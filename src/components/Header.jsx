export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="text-sm font-semibold tracking-[0.15em] uppercase text-gray-900">
            Spreadhub
          </a>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-8">
            <a href="#" className="text-xs tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">
              Designs
            </a>
            <a href="#" className="text-xs tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">
              Collections
            </a>
            <a href="#" className="text-xs tracking-wide text-gray-500 hover:text-gray-900 transition-colors uppercase">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-5.197-5.197M15.803 15.803A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
