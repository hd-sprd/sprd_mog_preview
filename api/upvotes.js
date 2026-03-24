// Vercel serverless – upvotes (persistent via Redis)
import { createClient } from 'redis'

const client = createClient({ url: process.env.REDIS_URL })
  .on('error', err => console.error('Redis error:', err))

async function connect() {
  if (!client.isOpen) await client.connect()
  return client
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  try {
    const r = await connect()

    if (req.method === 'GET') {
      const { designId } = req.query
      if (!designId) return res.status(400).json({ error: 'Missing designId' })
      const count = await r.hGet('upvotes', designId)
      return res.status(200).json({ upvotes: Number(count || 0) })
    }

    if (req.method === 'POST') {
      const { designId } = req.body || {}
      if (!designId) return res.status(400).json({ error: 'Missing designId' })
      const count = await r.hIncrBy('upvotes', designId, 1)
      return res.status(200).json({ upvotes: count })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
