import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from './components/Header'
import DesignCard from './components/DesignCard'
import DesignModal from './components/DesignModal'

const PAGE_SIZE = 16

function parseCSV(text) {
  const lines = text.trim().split('\n')
  return lines.slice(1).map(line => {
    const parts = line.split(';').map(v => v.replace(/^"|"$/g, '').trim())
    return { designId: parts[0], userId: parts[1], title: parts[2] || '' }
  }).filter(d => d.designId)
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [randomSeed, setRandomSeed] = useState(null) // null = normal mode
  const [animKey, setAnimKey] = useState(0)          // changes → cards remount → animation restarts

  useEffect(() => {
    fetch('/MOG_EU_DESIGNS.csv')
      .then(r => r.text())
      .then(text => setDesigns(parseCSV(text)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return designs
    const q = query.toLowerCase()
    return designs.filter(d => d.title.toLowerCase().includes(q))
  }, [designs, query])

  // When randomSeed changes → reshuffle from filtered
  const randomized = useMemo(() => {
    if (randomSeed === null) return null
    return shuffle(filtered).slice(0, PAGE_SIZE)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomSeed, filtered])

  const displayed = randomized ?? filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = randomized ? null : Math.ceil(filtered.length / PAGE_SIZE)

  const triggerAnim = useCallback(() => setAnimKey(k => k + 1), [])

  const handleSearch = e => {
    setQuery(e.target.value)
    setPage(1)
    setRandomSeed(null)
    triggerAnim()
  }

  const handlePage = dir => {
    setPage(p => p + dir)
    setRandomSeed(null)
    triggerAnim()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRandomize = () => {
    setRandomSeed(Math.random())
    setPage(1)
    triggerAnim()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearRandom = () => {
    setRandomSeed(null)
    setPage(1)
    triggerAnim()
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero + Search */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Collection</p>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900">
            Design Preview
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-light">
            {loading ? 'Loading…'
              : randomized ? `${PAGE_SIZE} random designs`
              : `${filtered.length.toLocaleString()} designs`}
          </p>

          {/* Search + Randomize */}
          <div className="mt-6 max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={handleSearch}
                placeholder="Search by title…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-sm
                  focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleRandomize}
              title="Show random designs"
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-wide border border-gray-200
                text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap rounded-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Randomize
            </button>
          </div>

          {/* Active random badge */}
          {randomized && (
            <button
              onClick={handleClearRandom}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
              Random mode active · click to clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="aspect-square bg-gray-100 animate-pulse rounded-sm" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-2/3" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm">No designs found for "{query}"</p>
            <button onClick={() => { setQuery(''); triggerAnim() }}
              className="mt-4 text-xs text-gray-500 underline">
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* key changes → all cards unmount+remount → animation restarts */}
            <div
              key={animKey}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayed.map((d, i) => (
                <DesignCard
                  key={d.designId}
                  design={d}
                  index={i}
                  onClick={() => setSelected(d)}
                />
              ))}
            </div>

            {/* Pagination (hidden in random mode) */}
            {!randomized && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePage(-1)}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-400 px-4">{page} / {totalPages}</span>
                <button
                  onClick={() => handlePage(1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Re-randomize button at bottom */}
            {randomized && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleRandomize}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase
                    border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Shuffle Again
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <DesignModal design={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
