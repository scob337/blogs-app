import React from "react"


const SkeletonCard = () => {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-white via-white to-gray-50 rounded-xl p-6 mb-6 border border-gray-100/20 backdrop-blur-sm animate-pulse">
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        {/* Author section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="space-y-1">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-300 rounded"></div>

        {/* Content preview */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded"></div>
          <div className="h-3 w-11/12 bg-gray-200 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
        </div>

        {/* Category & Read more */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="px-6 py-2 bg-gray-200 rounded-full w-24 h-6"></div>
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Thumbnail */}
      <div className="w-48 h-48 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
  )
}

const Loading = () => {
  return (
    <div className="flex flex-wrap justify-center gap-5 px-3 py-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default Loading
