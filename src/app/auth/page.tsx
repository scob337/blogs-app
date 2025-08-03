'use client'

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Settings, User, ArrowUpDown, Clock, MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import Loading from '@/Components/Loading';
import UserStats from '@/Components/Dashboard/UserStats';

// Update the Post interface to include likes, comments, and views
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
  likes?: Array<{ id: string; userId: string }>;
  comments?: Array<{ id: string }>;
  views?: number;
}

// Define sorting options type
type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostCommented' | 'mostViewed';

const Articles = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserPosts, setLoadingUserPosts] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/posts`);
        const data = await response.json();
        if (data && Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Unexpected data format:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch user's posts
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

  // Sort posts based on selected option
  const sortedPosts = useMemo(() => {
    const postsToSort = [...posts];
    
    switch (sortBy) {
      case 'newest':
        return postsToSort.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return postsToSort.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'mostLiked':
        return postsToSort.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case 'mostCommented':
        return postsToSort.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      case 'mostViewed':
        return postsToSort.sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return postsToSort;
    }
  }, [posts, sortBy]);

  // Sort user's posts by newest first
  const sortedUserPosts = useMemo(() => {
    return [...userPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userPosts]);

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'New';
      case 'oldest': return 'Old';
      case 'mostLiked': return ' Most Liked';
      case 'mostCommented': return 'Most Commented ';
      case 'mostViewed': return 'Most Viewed ';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* User Stats Section */}
        {user && <UserStats className="mb-8" />}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* User's Posts Section */}
            {user && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">My Articles</h2>
                  <Link
                    href="/stories"
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition"
                  >
                   Show All
                  </Link>
                </div>
                
                {loadingUserPosts ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You have not published any articles yet</p>
                    <Link
                      href="/auth/articles/create"
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                     Write your first article
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedUserPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <Link href={`/auth/articles/${post.id}`} className="block">
                          <h3 className="font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                            {post.content.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            {post.likes && post.likes.length > 0 && (
                              <span className="flex items-center gap-1">
                                <ThumbsUp size={14} />
                                {post.likes.length}
                              </span>
                            )}
                            {post.comments && post.comments.length > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare size={14} />
                                {post.comments.length}
                              </span>
                            )}
                            {post.views && post.views > 0 && (
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.views}
                              </span>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* All Articles Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Latest Articles</h1>
                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ArrowUpDown size={16} />
                      <span>{getSortLabel(sortBy)}</span>
                    </button>
                    {showSortMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        {(['newest', 'oldest', 'mostLiked', 'mostCommented', 'mostViewed'] as SortOption[]).map((option) => (
                          <button
                            key={option}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSortBy(option);
                              setShowSortMenu(false);
                            }}
                            className={`w-full text-right px-4 py-2 hover:bg-gray-50 transition-colors ${
                              sortBy === option ? 'text-indigo-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {getSortLabel(option)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href="/auth/articles/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center flex-shrink-0"
                  >
                    <Pencil className="w-4 h-4 ml-2" /> Write Article
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 mb-4">No articles available at the moment</p>
                  <Link
                    href="/auth/articles/create"
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Start writing your first article
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <Link href={`/auth/articles/${post.id}`}>
                        <div className="p-6">
                          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="ml-2">
                                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              {post.likes && post.likes.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <ThumbsUp size={14} />
                                  {post.likes.length}
                                </span>
                              )}
                              {post.comments && post.comments.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare size={14} />
                                  {post.comments.length}
                                </span>
                              )}
                              {post.views && post.views > 0 && (
                                <span className="flex items-center gap-1">
                                  <Eye size={14} />
                                  {post.views}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {user && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={user.img || '/placeholder-avatar.png'}
                      alt={user.fName}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="mr-4">
                    <h3 className="font-bold text-gray-900">{user.fName} {user.lName}</h3>
                    <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                    
                    <div className="flex gap-2">
                      <Link 
                        href={`/author/${user.id}`} 
                        className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition flex items-center"
                      >
                        <User className="w-3 h-3 ml-1" /> My Profile
                      </Link>
                      <Link 
                        href="/settings" 
                        className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition flex items-center"
                      >
                        <Settings className="w-3 h-3 ml-1" /> Settings
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Your Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Articles Published</span>
                      <span className="font-medium text-sm">
                        {loadingUserPosts ? '...' : userPosts.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Views</span>
                      <span className="font-medium text-sm">
                        {loadingUserPosts ? '...' : userPosts.reduce((sum, post) => sum + (post.views || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  href="/auth/articles/create" 
                  className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 ml-2" /> Write New Article
                </Link>
                <Link 
                  href="/stories" 
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="ml-2">My Articles</span>
                </Link>
                <Link 
                  href="/bookmarks" 
                  className="flex items-center text-gray-700 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="ml-2">Bookmarks</span>
                </Link>
              </div>
            </div>
            
            {/* Popular Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/tag/technology" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors">
                  Technology
                </Link>
                <Link href="/tag/design" className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors">
                  Design
                </Link>
                <Link href="/tag/development" className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm hover:bg-purple-100 transition-colors">
                  Development
                </Link>
                <Link href="/tag/ui-ux" className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm hover:bg-orange-100 transition-colors">
                  UI/UX
                </Link>
                <Link href="/tag/programming" className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 transition-colors">
                  Programming
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Articles;
