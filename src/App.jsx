import { useState, useEffect, useMemo, useCallback } from 'react'
import Header from './components/Header'
import DesignCard from './components/DesignCard'
import DesignModal from './components/DesignModal'

const PAGE_SIZE = 16

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'tiere',
    label: 'Tiere',
    emoji: '🐾',
    keywords: ['katze', 'katz', 'hund', 'fuchs', 'bär', 'bear', 'panda', 'dinosaurier', 'dino',
      'einhorn', 'unicorn', 'cat', 'dog', 'wolf', 'vogel', 'bird', 'pferd', 'horse', 'tier',
      'hase', 'rabbit', 'fisch', 'fish', 'pinguin', 'penguin', 'flamingo', 'elefant', 'elephant',
      'löwe', 'lion', 'dackel', 'corgi', 'husky', 'hamster', 'eule', 'owl', 'biene', 'bee',
      'koala', 'delfin', 'dolphin', 'oktopus', 'octopus', 'drache', 'dragon', 'affe', 'monkey',
      'schildkröte', 'turtle', 'kuh', 'cow', 'schwein', 'pig', 'schaf', 'sheep', 'frosch', 'frog',
      'igel', 'hedgehog', 'otter', 'waschbär', 'raccoon', 'kaninchen', 'papagei', 'parrot',
      'adler', 'eagle', 'taube', 'lama', 'alpaka', 'alpaca', 'schlange', 'snake', 'hai', 'shark',
      'krokodil', 'crocodile', 'gorilla', 'nilpferd', 'giraffe', 'zebra', 'rentier', 'reindeer',
      'fuchs', 'wal', 'whale', 'krabbe', 'crab', 'libelle', 'dragonfly', 'schmetterling',
      'butterfly', 'schnecke', 'snail', 'marienkäfer', 'ladybug', 'gecko', 'chamäleon', 'loup',
      'renard', 'tier', 'animal', 'wildlife', 'zoo'],
  },
  {
    id: 'halloween',
    label: 'Halloween',
    emoji: '🎃',
    keywords: ['halloween', 'horror', 'skull', 'totenkopf', 'hexe', 'witch', 'geist', 'ghost',
      'zombie', 'gruselig', 'scary', 'vampire', 'kürbis', 'pumpkin', 'monster', 'böse', 'evil',
      'devil', 'teufel', 'skeleton', 'skelett', 'dead', 'tot ', 'dead inside', 'creepy', 'haunted',
      'blood', 'blut', 'bat', 'fledermaus', 'spider', 'spinne', 'demon', 'dämon', 'frankenstein',
      'mumie', 'mummy', 'cauldron', 'kessel', 'grusel', 'death', 'tod '],
  },
  {
    id: 'weihnachten',
    label: 'Weihnachten',
    emoji: '🎄',
    keywords: ['weihnachten', 'weihnacht', 'christmas', 'ugly', 'xmas', 'nikolaus', 'santa',
      'advent', 'elch', 'moose', 'schnee', 'snow', 'snowman', 'schneemann', 'winter', 'elf',
      'rudolph', 'grinch', 'sleigh', 'schlitten', 'stollen', 'lebkuchen', 'gingerbread',
      'tannenbaum', 'weihnachtsbaum', 'mistel', 'mistletoe', 'jingle', 'merry', 'frohe'],
  },
  {
    id: 'geburtstag',
    label: 'Geburtstag',
    emoji: '🎂',
    keywords: ['geburtstag', 'birthday', 'geschenk', 'gift', 'jahrestag', 'anniversary',
      'jubiläum', 'feier', 'party ', 'celebration', 'überraschung', 'surprise', 'bday',
      'geschenkidee', 'present', 'happy birthday', 'herzlichen glückwunsch', 'glückwunsch',
      'congratulations', 'jubilä'],
  },
  {
    id: 'liebe',
    label: 'Liebe & Familie',
    emoji: '❤️',
    keywords: ['liebe', 'love', 'herz', 'heart', 'paar', 'couple', 'partner', 'verliebt',
      'valentinstag', 'valentine', 'kiss', 'kuss', 'mama', 'papa', 'familie', 'family',
      'mutter', 'vater', 'mother', 'father', 'oma', 'opa', 'grandma', 'grandpa', 'baby',
      'schwanger', 'pregnant', 'hochzeit', 'wedding', 'verlobung', 'engagement', 'freundin',
      'boyfriend', 'girlfriend', 'wife', 'husband', 'ehemann', 'ehefrau', 'soulmate',
      'together', 'zusammen', 'friendship', 'freundschaft', 'bestie', 'bff', 'sohn', 'tochter'],
  },
  {
    id: 'sport',
    label: 'Sport & Fitness',
    emoji: '🏃',
    keywords: ['sport', 'yoga', 'fahrrad', 'cycling', 'radfahren', 'fitness', 'fussball',
      'soccer', 'football', 'marathon', 'gym', 'workout', 'training', 'running', 'laufen',
      'joggen', 'klettern', 'climbing', 'surfen', 'surf', 'ski', 'snowboard', 'bergsteigen',
      'hiking', 'wandern', 'triathlon', 'schwimmen', 'swimming', 'tennis', 'basketball',
      'volleyball', 'baseball', 'golf', 'boxing', 'boxen', 'kampfsport', 'martial arts',
      'crossfit', 'pilates', 'weightlifting', 'runner', 'athlete', 'cyclist', 'biker'],
  },
  {
    id: 'musik',
    label: 'Musik & Gaming',
    emoji: '🎮',
    keywords: ['musik', 'music', 'rock', 'metal', 'rap', 'hip hop', 'band', 'guitar', 'gitarre',
      'piano', 'drum', 'schlagzeug', 'dj', 'gamer', 'gaming', 'game', 'videogame', 'nerd',
      'geek', 'pixel', 'controller', 'playstation', 'xbox', 'nintendo', 'retrogamer', 'rpg',
      'dungeon', 'fantasy', 'wizard', 'mage', 'headphone', 'kopfhörer', 'vinyl', 'concert',
      'konzert', 'festival', 'punk', 'jazz', 'classical', 'electronic', 'bass', 'synthesizer',
      'streamer', 'streaming', 'twitch', 'minecraft', 'fortnite', 'zelda', 'mario'],
  },
  {
    id: 'vintage',
    label: 'Vintage & Retro',
    emoji: '🕹️',
    keywords: ['vintage', 'retro', 'tattoo', 'oldschool', 'old school', 'distressed', 'grunge',
      'worn', 'classic ', 'antik', 'nostalgie', 'nostalgia', '80s', '90s', '70s', 'eighties',
      'nineties', 'seventies', 'art deco', 'boho', 'bohemian', 'hippie', 'woodstock',
      'western', 'cowboy', 'steampunk', 'gothic', 'goth', 'blackwork', 'linework', 'engraving'],
  },
]

function classifyDesign(title) {
  const t = title.toLowerCase()
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => t.includes(kw))) return cat.id
  }
  return 'sonstige'
}

// ── CSV parsing ────────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split('\n')
  return lines.slice(1).map(line => {
    const parts = line.split(';').map(v => v.replace(/^"|"$/g, '').trim())
    const d = { designId: parts[0], userId: parts[1], title: parts[2] || '' }
    d.category = classifyDesign(d.title)
    return d
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

// ── Component ─────────────────────────────────────────────────────────────────

const ALL_TABS = [
  { id: 'all', label: 'Alle' },
  ...CATEGORIES,
  { id: 'sonstige', label: 'Sonstige' },
]

export default function App() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ upvotes: {}, comments: {} })
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('default') // 'default' | 'upvotes'
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [scrollToComments, setScrollToComments] = useState(false)
  const [randomSeed, setRandomSeed] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    fetch('/MOG_EU_DESIGNS.csv')
      .then(r => r.text())
      .then(text => setDesigns(parseCSV(text)))
      .finally(() => setLoading(false))
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    let list = activeTab === 'all' ? designs : designs.filter(d => d.category === activeTab)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(d => d.title.toLowerCase().includes(q))
    }
    if (sortBy === 'upvotes') {
      list = [...list].sort((a, b) =>
        (stats.upvotes[b.designId] || 0) - (stats.upvotes[a.designId] || 0)
      )
    }
    return list
  }, [designs, query, activeTab, sortBy, stats])

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

  const handleTab = id => {
    setActiveTab(id)
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

  // Category counts (memoized so they don't recalculate on every render)
  const categoryCounts = useMemo(() => {
    const counts = { all: designs.length, sonstige: 0 }
    CATEGORIES.forEach(c => { counts[c.id] = 0 })
    designs.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1
    })
    return counts
  }, [designs])

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

          <div className="mt-3 flex items-center justify-center gap-3">
            {/* Sort toggle */}
            <button
              onClick={() => { setSortBy(s => s === 'upvotes' ? 'default' : 'upvotes'); setPage(1); setRandomSeed(null); triggerAnim() }}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors
                ${sortBy === 'upvotes'
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'}`}
            >
              <svg className="w-3 h-3" fill={sortBy === 'upvotes' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Most Liked
            </button>

            {randomized && (
              <button onClick={handleClearRandom}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                Random mode active · click to clear
              </button>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-1 py-3">
              {ALL_TABS.map(tab => {
                const count = categoryCounts[tab.id] ?? 0
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wide rounded-full
                      border transition-colors
                      ${active
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                      }`}
                  >
                    <span>{tab.label}</span>
                    {!loading && (
                      <span className={`text-[10px] ${active ? 'text-gray-300' : 'text-gray-300'}`}>
                        {count.toLocaleString()}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
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
            <p className="text-gray-400 text-sm">
              {query ? `No designs found for "${query}"` : 'No designs in this category.'}
            </p>
            <button onClick={() => { setQuery(''); setActiveTab('all'); triggerAnim() }}
              className="mt-4 text-xs text-gray-500 underline">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div
              key={animKey}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayed.map((d, i) => (
                <DesignCard
                  key={d.designId}
                  design={d}
                  index={i}
                  upvotes={stats.upvotes[d.designId] || 0}
                  comments={stats.comments[d.designId] || 0}
                  onClick={() => setSelected(d)}
                  onCommentClick={() => { setSelected(d); setScrollToComments(true) }}
                />
              ))}
            </div>

            {!randomized && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button onClick={() => handlePage(-1)} disabled={page === 1}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  ← Prev
                </button>
                <span className="text-xs text-gray-400 px-4">{page} / {totalPages}</span>
                <button onClick={() => handlePage(1)} disabled={page === totalPages}
                  className="px-4 py-2 text-xs border border-gray-200 text-gray-600
                    hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next →
                </button>
              </div>
            )}

            {randomized && (
              <div className="mt-12 text-center">
                <button onClick={handleRandomize}
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase
                    border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
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
        <DesignModal
          design={selected}
          onClose={() => { setSelected(null); setScrollToComments(false) }}
          scrollToComments={scrollToComments}
        />
      )}
    </div>
  )
}
