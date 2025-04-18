'use client'

import PostCard from '@/Components/AuthArticle/post-card'
import React, { useEffect, useState } from 'react'
import IPost  from './../../Types/PostTypes';
import Loading from '@/Components/AuthArticle/Loading';


const Articles = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/posts`)
        const data = await response.json()
        setPosts(data)
        console.log(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Latest Articles</h1>

            </div>
  
            {loading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
  
          {/* Aside Section */}
          <aside className="hidden lg:block w-80 space-y-6">
            {/* Profile Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Published Posts</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Views</span>
                  <span className="font-medium">1.2K</span>
                </div>
              </div>
            </div>
  
            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">Technology</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">Design</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">Development</span>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">UI/UX</span>
              </div>
            </div>
  
            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="block text-blue-600 hover:text-blue-700">Write a new story</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700">Reading list</a>
                <a href="#" className="block text-blue-600 hover:text-blue-700">Your drafts</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Articles
