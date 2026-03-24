// Vercel serverless – upvotes (persistent via Vercel KV / Redis)
import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    const { designId } = req.query
    if (!designId) return res.status(400).json({ error: 'Missing designId' })
    const count = await kv.hget('upvotes', designId) || 0
    return res.status(200).json({ upvotes: Number(count) })
  }

  if (req.method === 'POST') {
    const { designId } = req.body || {}
    if (!designId) return res.status(400).json({ error: 'Missing designId' })
    const count = await kv.hincrby('upvotes', designId, 1)
    return res.status(200).json({ upvotes: count })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
