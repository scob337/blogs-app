'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaRegComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useUser } from '../../../contexts/UserContext'
import toast, { Toaster } from 'react-hot-toast'
import ILike from '@/Types/LikeTypes'

// واجهة التعليق
interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: {
    fName: string;
    img: string;
  };
  createdAt: string;
  likes?: ILike[];
  likeCount?: number;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const { user } = useUser()

  // جلب التعليقات
  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comment`)
      console.log('Comments response status:', response.status)
      
      if (response.ok) {
        // تحويل الاستجابة إلى نص أولاً ثم محاولة تحليلها كـ JSON
        const text = await response.text()
        console.log('Raw response:', text)
        
        // التحقق من أن النص ليس فارغًا قبل تحليله
        if (text.trim()) {
          try {
            const data = JSON.parse(text)
            console.log('Parsed comments data:', data)
            
            // التحقق من شكل البيانات المستلمة
            let commentsData = [];
            if (Array.isArray(data)) {
              commentsData = data;
            } else if (data.comments && Array.isArray(data.comments)) {
              // في حالة كانت البيانات مغلفة في كائن
              commentsData = data.comments;
            } else {
              console.error('Unexpected comments data format:', data)
              commentsData = [];
            }
            
            // جلب عدد الإعجابات لكل تعليق
            const commentsWithLikes = await Promise.all(commentsData.map(async (comment: Comment) => {
              try {
                const likesResponse = await fetch(`/api/comments/${comment.id}/like`);
                if (likesResponse.ok) {
                  const likesData = await likesResponse.json();
                  comment.likeCount = likesData.count || 0;
                  
                  // التحقق مما إذا كان المستخدم قد أعجب بالتعليق
                  if (user) {
                    const userLiked = likesData.likerIds?.includes(user.id) || 
                                    likesData.likes.some((like: ILike) => {
                                      if (typeof like === 'string') return like === user.id;
                                      return like.userId === user.id || 
                                            (like.user && like.user.id === user.id);
                                    });
                    setLikedComments(prev => ({ ...prev, [comment.id]: userLiked }));
                  }
                }
                return comment;
              } catch (error) {
                console.error(`Error fetching likes for comment ${comment.id}:`, error);
                comment.likeCount = 0;
                return comment;
              }
            }));
            
            setComments(commentsWithLikes);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError)
            setComments([])
          }
        } else {
          console.log('Empty response received')
          setComments([])
        }
      } else {
        console.error('Failed to fetch comments:', response.status)
        setComments([])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  // إزالة fetchComments من قائمة التبعيات لمنع الحلقة اللانهائية
  useEffect(() => {
    fetchComments()
  }, [postId]) // إزالة fetchComments من هنا

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty', {
        position: 'bottom-right',
      })
      return
    }
    
    if (!user) {
      toast.error('Please login to comment', {
        position: 'bottom-right',
      })
      return
    }
    
    setSubmittingComment(true)
    
    // إنشاء تعليق مؤقت للعرض الفوري
    const optimisticComment: Comment = {
      id: 'temp-' + Date.now(),
      content: commentText,
      authorId: user.id,
      author: {
        fName: user.fName,
        img: user.img || '/placeholder-avatar.png'
      },
      createdAt: new Date().toISOString()
    }
    
    // إضافة التعليق المؤقت للواجهة
    setComments(prev => [optimisticComment, ...prev])
    const savedCommentText = commentText
    setCommentText('')
    
    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          content: savedCommentText,
          postId: postId,
          userId: user.id
        })
      })
      
      if (response.ok) {
        // إذا نجح الطلب، قم بتحديث التعليقات
        toast.success('Comment posted successfully!', {
          position: 'bottom-right',
          duration: 2000,
        })
        
        // إعادة جلب التعليقات من الخادم
        await fetchComments()
      } else {
        // إزالة التعليق المؤقت إذا فشل الطلب
        setComments(prev => prev.filter(c => c.id !== optimisticComment.id))
        throw new Error(`Failed to post comment: ${response.status}`)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast.error('Failed to post comment. Please try again.', {
        position: 'bottom-right',
      })
      // استعادة نص التعليق حتى لا يفقد المستخدم مدخلاته
      setCommentText(savedCommentText)
    } finally {
      setSubmittingComment(false)
    }
  }

  // إضافة وظيفة التعامل مع الإعجاب بالتعليق
  const handleCommentLike = async (commentId: string) => {
    if (!user) {
      toast.error('Please login to like comments', {
        position: 'bottom-right',
      });
      return;
    }
    
    // تحديث واجهة المستخدم بشكل متفائل
    const wasLiked = likedComments[commentId] || false;
    setLikedComments(prev => ({ ...prev, [commentId]: !wasLiked }));
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likeCount: (comment.likeCount || 0) + (wasLiked ? -1 : 1) }
          : comment
      )
    );
    
    try {
      console.log("Sending like request for comment:", commentId, "User:", user.id);
      
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Like response status:", response.status);
      
      if (!response.ok) {
        // التراجع عن التحديث المتفائل إذا فشل الطلب
        setLikedComments(prev => ({ ...prev, [commentId]: wasLiked }));
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, likeCount: (comment.likeCount || 0) + (wasLiked ? 1 : -1) }
              : comment
          )
        );
        
        const errorData = await response.text();
        console.error('Like error response:', errorData);
        
        throw new Error(`Failed to update like: ${response.status} ${errorData}`);
      }
      
      // استخدام API اللايك المخصص للحصول على معلومات محدثة
      const likesResponse = await fetch(`/api/comments/${commentId}/like`);
      const likesData = await likesResponse.json();
      
      // تحديث عدد اللايكات للتعليق
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likeCount: likesData.count || 0 }
            : comment
        )
      );
      
      // رسالة نجاح
      toast.success(wasLiked ? 'Like removed' : 'Comment liked!', {
        position: 'bottom-right',
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to update like. Please try again.', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="mt-10">
      <Toaster />
      <div className="flex items-center gap-2 mb-6">
        <FaRegComment className="text-gray-500" />
        <h3 className="text-xl font-bold text-gray-900">Comments ({comments.length})</h3>
      </div>
      
      {/* نموذج التعليق */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={user?.img || "/placeholder-avatar.png"}
              alt="Your avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              id="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={user ? "Add a comment..." : "Please login to comment"}
              disabled={!user || submittingComment}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[80px]"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!user || !commentText.trim() || submittingComment}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  !user || !commentText.trim() || submittingComment
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* قائمة التعليقات */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={comment.author?.img || "/placeholder-avatar.png"}
                  alt={comment.author?.fName || "Commenter"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {comment.author?.fName || "Anonymous"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  
                  {/* إضافة زر الإعجاب للتعليق */}
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={() => handleCommentLike(comment.id)}
                      className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      aria-label={likedComments[comment.id] ? "Remove like" : "Like this comment"}
                    >
                      {likedComments[comment.id] ? (
                        <FaHeart className="text-red-500" size={16} />
                      ) : (
                        <FaRegHeart size={16} />
                      )}
                      <span className="ml-1 text-sm">{comment.likeCount || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}