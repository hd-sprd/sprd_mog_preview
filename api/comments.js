// Vercel serverless function – comments
// Note: /tmp/ is ephemeral (resets on cold start). For persistence use a DB.
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const FILE = '/tmp/comments.csv'

function ensure() {
  if (!existsSync(FILE)) writeFileSync(FILE, 'designId;timestamp;comment\n')
}

function isValid(text) {
  return typeof text === 'string' && text.trim().length > 0 &&
    text.length <= 255 && !/[<>&"\\;]/.test(text)
}

function getComments(designId) {
  ensure()
  return readFileSync(FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean)
    .map(l => { const p = l.split(';'); return { designId: p[0], timestamp: p[1], comment: p.slice(2).join(';') } })
    .filter(c => c.designId === designId)
}

function addComment(designId, comment) {
  ensure()
  writeFileSync(FILE, readFileSync(FILE, 'utf-8') + `${designId};${new Date().toISOString()};${comment}\n`)
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET') {
    const designId = req.query.designId
    if (!designId) return res.status(400).json({ error: 'Missing designId' })
    return res.status(200).json({ comments: getComments(designId) })
  }

  if (req.method === 'POST') {
    const { designId, comment } = req.body || {}
    if (!designId || !comment) return res.status(400).json({ error: 'Missing fields' })
    if (!isValid(comment)) return res.status(422).json({ error: 'Invalid comment (max 255 chars, no special characters)' })
    addComment(designId, comment.trim())
    return res.status(200).json({ ok: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
