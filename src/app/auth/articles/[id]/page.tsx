'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import IPost from '@/Types/PostTypes'
import Loading from '@/Components/AuthArticle/ArticleLoading'
import CommentSection from '@/Components/Comments/CommentSection'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useUser } from '../../../../../contexts/UserContext'
import toast, { Toaster } from 'react-hot-toast'
import { Calendar, Bookmark, BookmarkCheck, MessageSquare, Eye, ArrowLeft, Share2 } from 'lucide-react'

interface ILike {
  id?: string;
  userId?: string;
  user?: {
    id: string;
  };
}

export default function ArticlePage() {
  const { id } = useParams()
  const [post, setPost] = useState<IPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  // تحسين وظيفة التحميل الأولي للتحقق من اللايكات وزيادة عداد المشاهدات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Increase view count
        await fetch(`/api/posts/${id}/view`, { method: 'POST' });
        
        // Load article data, related articles, likes, and view count
        const [postResponse, relatedResponse, likesResponse, viewsResponse] = await Promise.all([
          fetch(`/api/posts/${id}`),
          fetch(`/api/posts`),
          fetch(`/api/posts/${id}/like`),
          fetch(`/api/posts/${id}/views`)
        ]);
        
        const [postData, relatedData, likesData, viewsData] = await Promise.all([
          postResponse.json(),
          relatedResponse.json(),
          likesResponse.json(),
          viewsResponse.json()
        ]);

        setPost(postData);
        setViewCount(viewsData.count || 0);
        setRelatedPosts(relatedData.filter((p: IPost) => p.id !== id).slice(0, 3));
        
        // Update like count from API
        setLikeCount(likesData.count || 0);
        
        // Check if user liked the article
        if (user) {
          const userLiked = likesData.likerIds?.includes(user.id) || 
                          (Array.isArray(likesData.likes) && likesData.likes.some((like: ILike | string) => {
                            if (typeof like === 'string') return like === user.id;
                            return like.userId === user.id || 
                                  (like.user && like.user.id === user.id);
                          }));
          setLiked(!!userLiked);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  // تصحيح وظيفة اللايك
  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like this article', {
        position: 'bottom-right',
      });
      return;
    }
    
    // تحديث واجهة المستخدم بشكل متفائل
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      console.log("Sending like request for post:", id, "User:", user.id);
      
      // Get token from cookies
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      const token = tokenCookie ? tokenCookie.split('=')[1].trim() : null;
      
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: id,
          userId: user.id,
          commentId: null
        })
      });
      
      console.log("Like response status:", response.status);
      
      if (!response.ok) {
        // التراجع عن التحديث المتفائل إذا فشل الطلب
        setLiked(wasLiked);
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
        
        const errorData = await response.text();
        console.error('Like error response:', errorData);
        
        throw new Error(`Failed to update like: ${response.status} ${errorData}`);
      }
      
      // استخدام API اللايك المخصص للحصول على معلومات محدثة
      const likesResponse = await fetch(`/api/posts/${id}/like`);
      const likesData = await likesResponse.json();
      
      // تحديث عدد اللايكات وحالة اللايك للمستخدم الحالي
      setLikeCount(likesData.count || 0);
      
      if (user) {
        const userLiked = likesData.likerIds?.includes(user.id) || 
                          likesData.likes.some((like: ILike) => {
                            if (typeof like === 'string') return like === user.id;
                            return like.userId === user.id || 
                                  (like.user && like.user.id === user.id);
                          });
        setLiked(userLiked);
      }
      
      // Success message
      toast.success(wasLiked ? 'Removed like' : 'Liked the article!', {
        position: 'bottom-right',
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to update like. Please try again.', {
        position: 'bottom-right',
      });
    }
  }

  if (loading || isLoading) {
    return <Loading />;
  }

  if (!post) {
    return <div>Article not found</div>;
  }
  
  // Format date in English
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  
  // مشاركة المقال
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Read article: ${post.title}`,
          url: window.location.href,
        });
        toast.success('Article shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Copy link for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied');
    }
  };
  
  // حفظ المقال
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? 'Article removed from bookmarks' : 'Article saved');
    // TODO: Add logic to save article to database
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster position="bottom-right" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* زر العودة */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-5 w-5 ml-1 transform rotate-180 group-hover:translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Article Header */}
            <div className="mb-8 text-right">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 order-2 md:order-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <Link href={`/author/writer/${post.authorId}`} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors block text-right">
                        {post.author?.fName || "Unknown"}
                      </Link>
                      <div className="flex items-center text-xs text-gray-500 justify-end">
                        <span>{formattedDate}</span>
                        <Calendar className="w-3 h-3 mr-1 ml-2" />
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm">
                      <Image
                        src={post.author?.img || "/placeholder-avatar.png"}
                        alt={post.author?.fName || "Article author"}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 order-1 md:order-2 w-full md:w-auto justify-end">
                  {post.category && (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                      {post.category}
                    </span>
                  )}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye className="w-4 h-4 ml-1" />
                    <span>{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Image */}
            {post.thumbnail ? (
              <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="relative w-full h-[250px] mb-8 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center shadow-md">
                <span className="text-indigo-300 text-5xl font-light">مقال</span>
              </div>
            )}

            {/* Article Actions */}
            <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-3 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label={liked ? "Unlike this article" : "Like this article"}
                >
                  {liked ? (
                    <FaHeart className="text-red-500" size={18} />
                  ) : (
                    <FaRegHeart size={18} />
                  )}
                  <span className="ml-1 font-medium text-sm">{likeCount}</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors"
                  aria-label="Share article"
                >
                  <Share2 size={18} />
                  <span className="ml-1 text-sm">Share</span>
                </button>
                
                <button 
                  onClick={handleBookmark}
                  className="flex items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors"
                  aria-label={bookmarked ? "Remove from bookmarks" : "Save article"}
                >
                  {bookmarked ? (
                    <BookmarkCheck size={18} className="text-indigo-500" />
                  ) : (
                    <Bookmark size={18} />
                  )}
                  <span className="ml-1 text-sm">Save</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-gray-400" />
                <span className="text-sm text-gray-500">{Math.floor(Math.random() * 10) + 1} comments</span>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none ltr text-left prose-headings:text-left prose-p:text-left prose-ul:text-left prose-ol:text-left mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Article Tags */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['articles', 'content', 'blogging'].map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* استخدام مكون التعليقات */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments</h3>
              <CommentSection postId={id as string} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-100 shadow-sm mx-auto mb-3">
                  <Image
                    src={post.author?.img || "/placeholder-avatar.png"}
                    alt={post.author?.fName || "Article author"}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <Link href={`/author/writer/${post.authorId}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors block">
                  {post.author?.fName || "Unknown"}
                </Link>
                <p className="text-sm text-gray-500 mt-1">Content Writer</p>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-sm text-gray-600 text-center">Specialized in content creation and knowledge sharing</p>
              </div>
              
              <div className="mt-4">
                <Link href={`/author/writer/${post.authorId}`}>
                  <button className="w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors text-sm font-medium">
                    View All Articles
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Related Articles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-64">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.length > 0 ? relatedPosts.map((relatedPost) => (
                  <Link 
                    href={`/auth/articles/${relatedPost.id}`} 
                    key={relatedPost.id}
                    className="group block"
                  >
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        {relatedPost.thumbnail ? (
                          <Image
                            src={relatedPost.thumbnail}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <span className="text-indigo-300 text-lg font-light">Post</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-right">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {relatedPost.author?.fName || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center justify-end">
                          <span>{new Date(relatedPost.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <Calendar className="w-3 h-3 mr-1 ml-1" />
                        </p>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No related articles available</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
