import { useState } from 'react'

const IMG_URL = id =>
  `https://image.spreadshirtmedia.net/image-server/v1/designs/${id}.png?width=300`

export default function DesignCard({ design, index, upvotes, comments, onClick, onCommentClick }) {
  const [loaded, setLoaded] = useState(false)
  const { designId, userId, title } = design

  // Stagger: max 8 cols × rows, cap delay at ~700ms for large grids
  const delay = Math.min(index * 40, 700)

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer card-reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 group-hover:bg-gray-200 transition-colors duration-300 overflow-hidden rounded-sm">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={IMG_URL(designId)}
          alt={title || `Design ${designId}`}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain p-6 transition-transform duration-500 ease-out
            group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Meta */}
      <div className="mt-3 px-0.5">
        <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {title || '—'}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-400">User #{userId}</p>
          {(upvotes > 0 || comments > 0) && (
            <div className="flex items-center gap-2">
              {upvotes > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {upvotes}
                </span>
              )}
              {comments > 0 && (
                <span
                  className="inline-flex items-center gap-0.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  onClick={e => { e.stopPropagation(); onCommentClick?.() }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  {comments}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
