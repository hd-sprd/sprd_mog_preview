import { useState } from 'react'

const IMG_URL = id =>
  `https://image.spreadshirt.net/image-server/v1/designs/${id}.png?width=600`

export default function DesignCard({ design, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const { designId, userId, title } = design

  return (
    <article onClick={onClick} className="group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-sm">
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
        <p className="text-xs text-gray-400 mt-1">User #{userId}</p>
      </div>
    </article>
  )
}
