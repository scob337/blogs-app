'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Settings, User } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import Loading from '@/Components/Loading';
import PostCard from '@/Components/AuthArticle/post-card';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    fName: string;
    lName: string;
    img: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
}


const Articles = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([])
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingUserPosts, setLoadingUserPosts] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/posts`)
        const data = await response.json()
        if (data && Array.isArray(data.posts)) {
          setPosts(data.posts)
        } else if (Array.isArray(data)) {
          setPosts(data)
        } else {
          console.error('Unexpected data format:', data)
          setPosts([])
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])


  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) {
        setLoadingUserPosts(false);
        return;
      }
      
      try {
        setLoadingUserPosts(true);
        const response = await fetch(`${window.location.origin}/api/user/posts`);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.posts)) {
            setUserPosts(data.posts);
          } else if (Array.isArray(data)) {
            setUserPosts(data);
          } else {
            console.error('Unexpected user posts data format:', data);
            setUserPosts([]);
          }
        } else {
          console.error('Failed to fetch user posts:', response.status);
          setUserPosts([]);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setUserPosts([]);
      } finally {
        setLoadingUserPosts(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* User's Posts Section */}
            {user && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">مقالاتي</h2>
                  <Link
                    href="/stories"
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                  >
                    عرض الكل
                  </Link>
                </div>
                
                {loadingUserPosts ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">لم تقم بنشر أي مقالات بعد</p>
                    <Link
                      href="/auth/articles/create"
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      اكتب مقالك الأول
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {userPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <Link href={`/auth/articles/${post.id}`} className="block hover:bg-gray-50 p-2 rounded transition">
                          <h3 className="font-medium text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* All Articles Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">أحدث المقالات</h1>
                <Link
                  href="/auth/articles/create"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
                >
                  <Pencil className="w-4 h-4 mr-2" /> كتابة مقال
                </Link>
              </div>
    
              {loading ? (
                <Loading />
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    لم يتم العثور على مقالات
                  </h3>
                  <p className="text-gray-600 mb-6">
                    كن أول من ينشر مقالاً على منصتنا!
                  </p>
                  <Link
                    href="/auth/articles/create"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    اكتب مقالك الأول
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
  
          {/* Aside Section */}
          <aside className="hidden lg:block w-80 space-y-6">
            {/* User Profile Card */}
            {user && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-indigo-100 mb-3">
                    <Image
                      src={user.img || '/placeholder-avatar.png'}
                      alt={`${user.fName} ${user.lName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.fName} {user.lName}</h3>
                  <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <Link href={`/author/${user.id}`} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition flex items-center">
                      <User className="w-3 h-3 mr-1" /> الملف الشخصي
                    </Link>
                    <Link href="/settings" className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition flex items-center">
                      <Settings className="w-3 h-3 mr-1" /> الإعدادات
                    </Link>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">إحصائياتك</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">المقالات المنشورة</span>
                      <span className="font-medium text-sm">{loadingUserPosts ? '...' : userPosts.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <Link href="/auth/articles/create" className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                  <Pencil className="w-4 h-4 mr-2" /> كتابة مقال جديد
                </Link>
                <Link href="/stories" className="flex items-center text-indigo-600 hover:text-indigo-700">
                  مقالاتي
                </Link>
              </div>
            </div>
            
            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الوسوم الشائعة</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">تكنولوجيا</span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">تصميم</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">تطوير</span>
                <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">واجهة المستخدم</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Articles
