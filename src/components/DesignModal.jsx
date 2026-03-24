import { useEffect } from 'react'

const IMG_URL = id =>
  `https://image.spreadshirtmedia.net/image-server/v1/designs/${id}.png?width=600`

export default function DesignModal({ design, onClose }) {
  const { designId, userId, title } = design

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col sm:flex-row overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="sm:w-3/5 bg-gray-50 flex items-center justify-center p-8 sm:p-12 min-h-64">
          <img
            src={IMG_URL(designId)}
            alt={title || `Design ${designId}`}
            className="max-w-full max-h-[60vh] object-contain"
          />
        </div>

        {/* Details */}
        <div className="sm:w-2/5 p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Spreadshirt Design</p>
            <h2 className="text-xl font-medium text-gray-900 leading-snug">{title || '—'}</h2>

            <div className="mt-8 space-y-3 text-sm text-gray-500">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span>Design ID</span>
                <span className="text-gray-900 font-mono">{designId}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span>User ID</span>
                <span className="text-gray-900 font-mono">{userId}</span>
              </div>
              <div className="flex justify-between pb-3">
                <span>Format</span>
                <span className="text-gray-900">PNG · 1200 px</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button className="w-full bg-gray-900 text-white text-sm tracking-wide py-3.5 hover:bg-gray-700 transition-colors">
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-200 text-gray-600 text-sm tracking-wide py-3.5 hover:border-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
