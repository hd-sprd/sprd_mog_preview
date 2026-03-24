// Vercel serverless – aggregate stats (persistent via Redis)
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
    const [upvotes, comments] = await Promise.all([
      r.hGetAll('upvotes'),
      r.hGetAll('comment_counts'),
    ])

    res.status(200).json({
      upvotes:  upvotes  || {},
      comments: comments || {},
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
