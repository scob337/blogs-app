'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import IPost from '@/Types/PostTypes'
import Loading from '@/Components/AuthArticle/ArticleLoading'

export default function ArticlePage() {
  const { id } = useParams()
  const [post, setPost] = useState<IPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, relatedResponse] = await Promise.all([
          fetch(`${window.location.origin}/api/posts/${id}`),
          fetch(`${window.location.origin}/api/posts`)
        ])
        
        const [postData, relatedData] = await Promise.all([
          postResponse.json(),
          relatedResponse.json()
        ])

        setPost(postData)
        setRelatedPosts(relatedData.filter((p: IPost) => p.id !== id).slice(0, 3))
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading || !post) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={post.author?.img || "/placeholder-avatar.png"}
                      alt={post.author?.fName || "Author"}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <Link href={`/author/writer/${post.authorId}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                      {post.author?.fName || "Anonymous"}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Image */}
            {post.thumbnail && (
              <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.thumbnail || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Article Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {post.category && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                      {post.category}
                    </span>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Related Articles Aside */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    href={`/auth/articles/${relatedPost.id}`} 
                    key={relatedPost.id}
                    className="group block"
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={relatedPost.thumbnail || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {relatedPost.author?.fName || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(relatedPost.createdAt).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
