import { useEffect, useRef } from 'react'
import CommentSection from './CommentSection'

const IMG_URL = id =>
  `https://image.spreadshirtmedia.net/image-server/v1/designs/${id}.png?width=600`

export default function DesignModal({ design, onClose, scrollToComments, onStatsChange }) {
  const { designId, userId, title } = design
  const commentsRef = useRef(null)

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (scrollToComments && commentsRef.current) {
      commentsRef.current.scrollTop = 0
    }
  }, [scrollToComments])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 bg-white w-full max-w-4xl rounded-sm shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top: Image + Details — fixed, no scroll */}
        <div className="flex flex-col sm:flex-row shrink-0">

          {/* Image */}
          <div className="sm:w-1/2 bg-gray-50 flex items-center justify-center p-8 sm:p-12 min-h-48">
            <img
              src={IMG_URL(designId)}
              alt={title || `Design ${designId}`}
              className="max-w-full max-h-56 sm:max-h-64 object-contain"
            />
          </div>

          {/* Details + actions */}
          <div className="sm:w-1/2 flex flex-col justify-between p-7 gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Spreadshirt Design</p>
              <h2 className="text-xl font-medium text-gray-900 leading-snug">{title || '—'}</h2>

              <div className="mt-6 space-y-2.5 text-xs text-gray-500">
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span>Design ID</span>
                  <span className="text-gray-900 font-mono">{designId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span>User ID</span>
                  <span className="text-gray-900 font-mono">{userId}</span>
                </div>
                <div className="flex justify-between pb-2.5">
                  <span>Format</span>
                  <span className="text-gray-900">PNG · 600 px</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-gray-900 text-white text-xs tracking-widest uppercase py-3 hover:bg-gray-700 transition-colors">
                Add to Cart
              </button>
              <button
                onClick={onClose}
                className="w-full border border-gray-200 text-gray-500 text-xs tracking-wide py-3 hover:border-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Comments — scrollable */}
        <div
          ref={commentsRef}
          className="border-t border-gray-100 overflow-y-auto flex-1 min-h-0 px-7 pb-7"
        >
          <CommentSection designId={designId} onStatsChange={onStatsChange} />
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
