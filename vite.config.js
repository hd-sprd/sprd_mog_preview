import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// ── Local CSV helpers ─────────────────────────────────────────────────────────

const DATA_DIR      = join(process.cwd(), 'data')
const COMMENTS_FILE = join(DATA_DIR, 'comments.csv')
const UPVOTES_FILE  = join(DATA_DIR, 'upvotes.csv')

function ensureFiles() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  if (!existsSync(COMMENTS_FILE)) writeFileSync(COMMENTS_FILE, 'designId;timestamp;comment\n')
  if (!existsSync(UPVOTES_FILE))  writeFileSync(UPVOTES_FILE,  'designId;count\n')
}

function isValid(text) {
  return (
    typeof text === 'string' &&
    text.trim().length > 0 &&
    text.length <= 255 &&
    !/[<>&"\\;]/.test(text)  // block HTML / CSV-injection chars
  )
}

function getComments(designId) {
  ensureFiles()
  return readFileSync(COMMENTS_FILE, 'utf-8')
    .trim().split('\n').slice(1).filter(Boolean)
    .map(l => { const p = l.split(';'); return { designId: p[0], timestamp: p[1], comment: p.slice(2).join(';') } })
    .filter(c => c.designId === designId)
}

function addComment(designId, comment) {
  ensureFiles()
  const existing = readFileSync(COMMENTS_FILE, 'utf-8')
  writeFileSync(COMMENTS_FILE, existing + `${designId};${new Date().toISOString()};${comment}\n`)
}

function getUpvotes(designId) {
  ensureFiles()
  for (const line of readFileSync(UPVOTES_FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean)) {
    const [id, count] = line.split(';')
    if (id === designId) return parseInt(count) || 0
  }
  return 0
}

function addUpvote(designId) {
  ensureFiles()
  const lines = readFileSync(UPVOTES_FILE, 'utf-8').trim().split('\n').filter(Boolean)
  let found = false
  const updated = lines.map((l, i) => {
    if (i === 0) return l
    const [id, count] = l.split(';')
    if (id === designId) { found = true; return `${id};${parseInt(count) + 1}` }
    return l
  })
  if (!found) updated.push(`${designId};1`)
  writeFileSync(UPVOTES_FILE, updated.join('\n') + '\n')
  return getUpvotes(designId)
}

function getAllStats() {
  ensureFiles()
  const upvotes = {}
  readFileSync(UPVOTES_FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean).forEach(l => {
    const [id, count] = l.split(';')
    if (id) upvotes[id] = parseInt(count) || 0
  })
  const comments = {}
  readFileSync(COMMENTS_FILE, 'utf-8').trim().split('\n').slice(1).filter(Boolean).forEach(l => {
    const id = l.split(';')[0]
    if (id) comments[id] = (comments[id] || 0) + 1
  })
  return { upvotes, comments }
}

function readBody(req) {
  return new Promise(resolve => {
    let b = ''
    req.on('data', c => { b += c })
    req.on('end', () => resolve(b))
  })
}

// ── Vite plugin: local dev API ────────────────────────────────────────────────

const localApiPlugin = {
  name: 'local-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, 'http://localhost')
      const json = (data, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(data))
      }

      if (req.method === 'GET' && url.pathname === '/api/stats') {
        return json(getAllStats())
      }

      if (req.method === 'GET' && url.pathname === '/api/comments') {
        const id = url.searchParams.get('designId')
        if (!id) return json({ error: 'Missing designId' }, 400)
        return json({ comments: getComments(id), upvotes: getUpvotes(id) })
      }

      if (req.method === 'POST' && url.pathname === '/api/comments') {
        let data
        try { data = JSON.parse(await readBody(req)) } catch { return json({ error: 'Bad JSON' }, 400) }
        const { designId, comment } = data || {}
        if (!designId || !comment) return json({ error: 'Missing fields' }, 400)
        if (!isValid(comment)) return json({ error: 'Invalid comment (max 255 chars, no special characters)' }, 422)
        addComment(designId, comment.trim())
        return json({ ok: true })
      }

      if (req.method === 'GET' && url.pathname === '/api/upvotes') {
        const id = url.searchParams.get('designId')
        if (!id) return json({ error: 'Missing designId' }, 400)
        return json({ upvotes: getUpvotes(id) })
      }

      if (req.method === 'POST' && url.pathname === '/api/upvotes') {
        let data
        try { data = JSON.parse(await readBody(req)) } catch { return json({ error: 'Bad JSON' }, 400) }
        const { designId } = data || {}
        if (!designId) return json({ error: 'Missing designId' }, 400)
        return json({ upvotes: addUpvote(designId) })
      }

      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), localApiPlugin],
})
