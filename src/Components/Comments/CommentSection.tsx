'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaRegComment } from 'react-icons/fa'
import { useUser } from '../../../contexts/UserContext'
import toast, { Toaster } from 'react-hot-toast'

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
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
            if (Array.isArray(data)) {
              setComments(data)
            } else if (data.comments && Array.isArray(data.comments)) {
              // في حالة كانت البيانات مغلفة في كائن
              setComments(data.comments)
            } else {
              console.error('Unexpected comments data format:', data)
              setComments([])
            }
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