// Vercel serverless function – upvotes
import { readFileSync, writeFileSync, existsSync } from 'fs'

const FILE = '/tmp/upvotes.csv'

function ensure() {
  if (!existsSync(FILE)) writeFileSync(FILE, 'designId;count\n')
}

function getUpvotes(designId) {
  ensure()
  for (const line of readFileSync(FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean)) {
    const [id, count] = line.split(';')
    if (id === designId) return parseInt(count) || 0
  }
  return 0
}

function addUpvote(designId) {
  ensure()
  const lines = readFileSync(FILE, 'utf-8').trim().split('\n').filter(Boolean)
  let found = false
  const updated = lines.map((l, i) => {
    if (i === 0) return l
    const [id, count] = l.split(';')
    if (id === designId) { found = true; return `${id};${parseInt(count) + 1}` }
    return l
  })
  if (!found) updated.push(`${designId};1`)
  writeFileSync(FILE, updated.join('\n') + '\n')
  return getUpvotes(designId)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    const { designId } = req.query
    if (!designId) return res.status(400).json({ error: 'Missing designId' })
    return res.status(200).json({ upvotes: getUpvotes(designId) })
  }

  if (req.method === 'POST') {
    const { designId } = req.body || {}
    if (!designId) return res.status(400).json({ error: 'Missing designId' })
    return res.status(200).json({ upvotes: addUpvote(designId) })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
