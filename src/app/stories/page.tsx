'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Edit2, Trash2, Plus, Search, Calendar, Eye, Heart, MessageSquare, Pencil } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import IPost from '@/Types/PostTypes';

export default function StoriesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/user/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('حدث خطأ أثناء جلب المقالات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);
  
  // تصفية المقالات بناءً على مصطلح البحث والترتيب
  useEffect(() => {
    if (!posts.length) return;
    
    let result = [...posts];
    
    // تطبيق البحث
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // تطبيق الترتيب
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredPosts(result);
  }, [posts, searchTerm, sortBy]);

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      const response = await fetch(`/api/posts/${deletePostId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      const updatedPosts = posts.filter(post => post.id !== deletePostId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      toast.success('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('An error occurred while deleting the article');
    } finally {
      setShowDeleteModal(false);
      setDeletePostId(null);
    }
  };

  const openDeleteModal = (postId: string) => {
    setDeletePostId(postId);
    setShowDeleteModal(true);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
      <Toaster position="bottom-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 text-right md:text-right w-full md:w-auto">My Articles</h1>
          <Link href="/auth/articles/create" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-md hover:shadow-lg">
              <Pencil className="w-4 h-4 mr-2" />
              Write Article
            </button>
          </Link>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="ابحث في مقالاتك..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="title">العنوان</option>
              </select>
              
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredPosts.length === 0 && searchTerm ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">لا توجد نتائج للبحث</h2>
            <p className="text-gray-500 mb-6">لم نتمكن من العثور على أي مقالات تطابق بحثك. حاول استخدام كلمات مفتاحية مختلفة.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              عرض جميع المقالات
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pencil className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-4">No articles yet</h2>
              <p className="text-gray-500 mb-6">Start writing your first article to share your thoughts with the world.</p>
              <Link href="/auth/articles/create">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-300">
                  Write Your First Article
                </button>
              </Link>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  {post.thumbnail ? (
                    <div className="md:w-72 h-48 md:h-auto relative">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-72 h-48 md:h-auto relative bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-indigo-300 text-4xl font-light">مقال</span>
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="w-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 text-right">{post.title}</h2>
                        <div className="flex items-center text-gray-500 mb-4 justify-end">
                          <span className="text-gray-500 text-sm">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <Calendar className="w-4 h-4 mr-1 ml-2" />
                        </div>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Link href={`/auth/articles/edit/${post.id}`}>
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" aria-label="تعديل المقال">
                            <Edit2 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="حذف المقال"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div 
                      className="text-gray-600 line-clamp-3 mb-4 text-right"
                      dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 ml-1" />
                          <span>{Math.floor(Math.random() * 100) + 10}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 ml-1" />
                          <span>{Math.floor(Math.random() * 20)}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 ml-1" />
                          <span>{Math.floor(Math.random() * 10)}</span>
                        </div>
                      </div>
                      <Link href={`/auth/articles/${post.id}`}>
                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                          عرض المقال
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                {post.thumbnail ? (
                  <div className="h-48 relative">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 relative bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-indigo-300 text-4xl font-light">مقال</span>
                  </div>
                )}
                <div className="flex-1 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Link href={`/auth/articles/edit/${post.id}`}>
                        <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" aria-label="تعديل المقال">
                          <Edit2 size={16} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => openDeleteModal(post.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="حذف المقال"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="w-3 h-3 mr-1 ml-1" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 text-right line-clamp-2">{post.title}</h2>
                  <div 
                    className="text-gray-600 text-sm line-clamp-3 mb-4 text-right"
                    dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}
                  />
                </div>
                <div className="p-5 pt-0 mt-auto border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-gray-500 text-xs">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 ml-1" />
                        <span>{Math.floor(Math.random() * 100) + 10}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 ml-1" />
                        <span>{Math.floor(Math.random() * 20)}</span>
                      </div>
                    </div>
                    <Link href={`/auth/articles/${post.id}`}>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                        عرض المقال
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-right">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6 text-right">هل أنت متأكد من رغبتك في حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex justify-start space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                حذف
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State for Filtered Results */}
      {filteredPosts.length === 0 && posts.length > 0 && searchTerm && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs animate-slide-up">
          <p className="text-gray-700 text-sm">لا توجد نتائج تطابق بحثك. جرب كلمات مفتاحية أخرى.</p>
        </div>
      )}
    </div>
  );
}
