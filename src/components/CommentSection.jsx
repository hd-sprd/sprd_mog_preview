import { useState, useEffect } from 'react'

const MAX_CHARS = 255
const INVALID_RE = /[<>&"\\;]/

// ── Blacklist ──────────────────────────────────────────────────────────────────
const BLACKLIST = [
  // English profanity
  'fuck', 'shit', 'cunt', 'bitch', 'cock', 'pussy', 'asshole', 'motherfucker',
  'whore', 'slut', 'twat', 'wanker', 'nigger', 'faggot', 'retard', 'bastard',
  'dickhead', 'dumbass', 'jackass', 'prick', 'bollocks',
  // German profanity
  'scheiße', 'scheisse', 'ficken', 'arschloch', 'hurensohn', 'wichser', 'fotze',
  'schwuchtel', 'drecksau', 'vollidiot', 'wichsen', 'scheiß', 'verdammte',
  'schlampe', 'miststück', 'dreckskerl', 'blödmann', 'idiot',
  // Hate / Nazi
  'nazi', 'nazis', 'hitler', 'heil', 'auschwitz', 'nsdap', 'gestapo', 'waffen ss',
  'kkk', 'ku klux', 'white power', 'white supremacy', 'antisemit', 'antisemitic',
  'judensau', 'rassist', 'rassismus', 'neger', 'kanake',
  // Copyright brand bait
  'mickey mouse', 'disney', 'pokemon', 'nintendo', 'marvel comics', 'dc comics',
  'harry potter', 'star wars', 'louis vuitton', 'gucci', 'chanel', 'adidas',
]

function isBlacklisted(text) {
  const t = text.toLowerCase()
  return BLACKLIST.some(word => t.includes(word))
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function CommentSection({ designId }) {
  const [comments, setComments]     = useState([])
  const [upvotes, setUpvotes]       = useState(0)
  const [text, setText]             = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [upvoting, setUpvoting]     = useState(false)
  const [voted, setVoted]           = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/comments?designId=${designId}`).then(r => r.json()),
      fetch(`/api/upvotes?designId=${designId}`).then(r => r.json()),
    ]).then(([c, u]) => {
      setComments(c.comments || [])
      setUpvotes(u.upvotes || 0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [designId])

  const handleUpvote = async () => {
    if (upvoting || voted) return
    setUpvoting(true)
    try {
      const res = await fetch('/api/upvotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId }),
      })
      const data = await res.json()
      setUpvotes(data.upvotes)
      setVoted(true)
    } catch {}
    setUpvoting(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const trimmed = text.trim()
    if (!trimmed) return
    if (trimmed.length > MAX_CHARS) { setError(`Max ${MAX_CHARS} characters`); return }
    if (INVALID_RE.test(trimmed))   { setError('No special characters allowed (< > & " \\ ;)'); return }
    if (isBlacklisted(trimmed))     { setError('Your comment contains prohibited content.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, comment: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error'); setSubmitting(false); return }
      setComments(prev => [...prev, { designId, timestamp: new Date().toISOString(), comment: trimmed }])
      setText('')
    } catch { setError('Network error') }
    setSubmitting(false)
  }

  return (
    <div id="comments" className="pt-5">

      {/* Upvote */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={handleUpvote}
          disabled={upvoting || voted}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-full transition-colors
            ${voted
              ? 'bg-gray-900 border-gray-900 text-white cursor-default'
              : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
            }`}
        >
          <svg className="w-3.5 h-3.5" fill={voted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {upvotes > 0 ? upvotes : 'Like'}
        </button>
        {voted && <span className="text-xs text-gray-400">Thanks!</span>}
      </div>

      {/* Input — at the top so new comment appears at bottom of list */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setError('') }}
            placeholder="Add a comment…"
            rows={2}
            maxLength={MAX_CHARS}
            className="w-full text-xs border border-gray-200 rounded-sm px-3 py-2 resize-none
              focus:outline-none focus:border-gray-400 placeholder-gray-300"
          />
          <span className={`absolute bottom-2 right-2 text-[10px] ${text.length > MAX_CHARS - 20 ? 'text-orange-400' : 'text-gray-300'}`}>
            {text.length}/{MAX_CHARS}
          </span>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !text.trim()}
          className="w-full py-2 text-xs border border-gray-200 text-gray-500
            hover:border-gray-900 hover:text-gray-900 transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting…' : 'Post Comment'}
        </button>
      </form>

      {/* Comment list — below the form */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
          Comments {comments.length > 0 && <span className="font-normal">({comments.length})</span>}
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-300">No comments yet. Be the first!</p>
        ) : (
          <ul className="space-y-3 pr-1">
            {comments.map((c, i) => (
              <li key={i} className="text-xs text-gray-600 flex gap-2">
                <span className="text-gray-300 shrink-0">{timeAgo(c.timestamp)}</span>
                <span className="leading-relaxed">{c.comment}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
