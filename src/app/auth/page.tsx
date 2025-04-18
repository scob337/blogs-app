'use client'

import PostCard from '@/Components/AuthArticle/post-card'
import React, { useEffect, useState } from 'react'
import IPost  from './../../Types/PostTypes';


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
    <div className="px-3 py-5">
      {loading ? (
        <p className="text-center w-full py-10 text-gray-500">Loading...</p>
      ) : (
        <div className="flex justify-between gap-3 flex-wrap">
          {posts.map((post , index) => (
              <PostCard key={index}  post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Articles
