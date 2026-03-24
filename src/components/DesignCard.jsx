import { useState } from 'react'

const IMG_URL = id =>
  `https://image.spreadshirt.net/image-server/v1/designs/${id}.png?width=600`

export default function DesignCard({ id, onClick }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-sm">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={IMG_URL(id)}
          alt={`Design ${id}`}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain p-6 transition-transform duration-500 ease-out
            group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Meta */}
      <div className="mt-3 px-0.5">
        <p className="text-xs text-gray-400 tracking-wide">Design</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">#{id}</p>
      </div>
    </article>
  )
}
