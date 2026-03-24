import { useState, useEffect } from 'react'
import Header from './components/Header'
import DesignCard from './components/DesignCard'
import DesignModal from './components/DesignModal'

export default function App() {
  const [designIds, setDesignIds] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/designs.txt')
      .then(r => r.text())
      .then(text => {
        const ids = text.split(',').map(s => s.trim()).filter(Boolean)
        setDesignIds(ids)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero banner */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">New Collection</p>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-gray-900">
            Design Preview
          </h1>
          <p className="mt-4 text-sm text-gray-400 font-light">
            {designIds.length > 0 ? `${designIds.length} designs` : ''}
          </p>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designIds.map(id => (
              <DesignCard key={id} id={id} onClick={() => setSelected(id)} />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <DesignModal id={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
