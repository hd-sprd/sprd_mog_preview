// Vercel serverless – comments (persistent via Redis)
import { createClient } from 'redis'

const client = createClient({ url: process.env.REDIS_URL })
  .on('error', err => console.error('Redis error:', err))

async function connect() {
  if (!client.isOpen) await client.connect()
  return client
}

const MAX_CHARS = 255
const INVALID_RE = /[<>&"\\;]/

function isValid(text) {
  return typeof text === 'string' && text.trim().length > 0 &&
    text.length <= MAX_CHARS && !INVALID_RE.test(text)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  try {
    const r = await connect()

    if (req.method === 'GET') {
      const { designId } = req.query
      if (!designId) return res.status(400).json({ error: 'Missing designId' })
      const [raw, upvoteCount] = await Promise.all([
        r.lRange(`comments:${designId}`, 0, -1),
        r.hGet('upvotes', designId),
      ])
      const comments = (raw || []).map(c => typeof c === 'string' ? JSON.parse(c) : c)
      return res.status(200).json({ comments, upvotes: Number(upvoteCount || 0) })
    }

    if (req.method === 'POST') {
      const { designId, comment } = req.body || {}
      if (!designId || !comment) return res.status(400).json({ error: 'Missing fields' })
      if (!isValid(comment)) return res.status(422).json({ error: 'Invalid comment (max 255 chars, no special characters)' })
      const entry = { designId, timestamp: new Date().toISOString(), comment: comment.trim() }
      await Promise.all([
        r.rPush(`comments:${designId}`, JSON.stringify(entry)),
        r.hIncrBy('comment_counts', designId, 1),
      ])
      return res.status(200).json({ ok: true })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
