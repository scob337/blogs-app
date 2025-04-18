import React from "react"

const ArticleSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Article Header */}
        <div className="mb-8 space-y-4">
          <div className="h-10 w-3/4 bg-gray-300 rounded"></div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="relative w-full h-[400px] mb-8 bg-gray-300 rounded-xl"></div>

        {/* Article Content */}
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded"></div>
          ))}
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="px-6 py-2 bg-gray-200 rounded-full w-24 h-6"></div>
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleSkeleton
