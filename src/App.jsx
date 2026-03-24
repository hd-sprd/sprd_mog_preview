import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import DesignCard from './components/DesignCard'
import DesignModal from './components/DesignModal'

const PAGE_SIZE = 24

function parseCSV(text) {
  const lines = text.trim().split('\n')
  // skip header row
  return lines.slice(1).map(line => {
    const parts = line.split(';').map(v => v.replace(/^"|"$/g, '').trim())
    return { designId: parts[0], userId: parts[1], title: parts[2] || '' }
  }).filter(d => d.designId)
}

export default function App() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = e => {
    setQuery(e.target.value)
    setPage(1)
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
            {loading ? 'Loading…' : `${filtered.length.toLocaleString()} designs`}
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={handleSearch}
              placeholder="Search designs by title…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-sm
                focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400"
            />
          </div>
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
            <button onClick={() => setQuery('')} className="mt-4 text-xs text-gray-500 underline">
              Clear search
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginated.map(d => (
                <DesignCard key={d.designId} design={d} onClick={() => setSelected(d)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-xs text-gray-400 px-4">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
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
