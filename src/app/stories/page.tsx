'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Edit2, Trash2, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import IPost from '@/Types/PostTypes';

export default function StoriesPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('An error occurred while fetching posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      const response = await fetch(`/api/posts/${deletePostId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post.id !== deletePostId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('An error occurred while deleting the post');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <Toaster position="bottom-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
          <Link href="/auth/articles/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus size={18} className="mr-2" />
              New Article
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">No articles yet</h2>
            <p className="text-gray-500 mb-6">Start by creating your first article and share your thoughts with the world!</p>
            <Link href="/auth/articles/create">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Create New Article
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {post.thumbnail && (
                    <div className="md:w-64 h-48 relative">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/auth/articles/edit/${post.id}`}>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <Edit2 size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div 
                      className="text-gray-600 line-clamp-2 mb-4"
                      dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }}
                    />
                    <div className="flex justify-between items-center">
                      <Link href={`/auth/articles/${post.id}`}>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Article
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
