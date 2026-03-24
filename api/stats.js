// Vercel serverless – aggregate stats (upvote counts + comment counts)
import { readFileSync, existsSync } from 'fs'

const COMMENTS_FILE = '/tmp/comments.csv'
const UPVOTES_FILE  = '/tmp/upvotes.csv'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  const upvotes = {}
  if (existsSync(UPVOTES_FILE)) {
    readFileSync(UPVOTES_FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean).forEach(l => {
      const [id, count] = l.split(';')
      if (id) upvotes[id] = parseInt(count) || 0
    })
  }

  const comments = {}
  if (existsSync(COMMENTS_FILE)) {
    readFileSync(COMMENTS_FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean).forEach(l => {
      const id = l.split(';')[0]
      if (id) comments[id] = (comments[id] || 0) + 1
    })
  }

  res.status(200).json({ upvotes, comments })
}
