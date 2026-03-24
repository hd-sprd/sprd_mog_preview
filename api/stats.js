// Vercel serverless – aggregate stats (persistent via Vercel KV / Redis)
import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const [upvotes, comments] = await Promise.all([
    kv.hgetall('upvotes'),
    kv.hgetall('comment_counts'),
  ])

  res.status(200).json({
    upvotes:  upvotes  || {},
    comments: comments || {},
  })
}
