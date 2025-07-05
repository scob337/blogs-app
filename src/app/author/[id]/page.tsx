'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {Mail, Edit, Plus, ArrowLeft, BookOpen, UserCircle } from 'lucide-react';
import PostCard from '@/Components/AuthArticle/post-card';
import IPost from '@/Types/PostTypes';
import { useUser } from '../../../../contexts/UserContext';

interface Author {
  id: string;
  fName: string;
  lName: string;
  img: string;
  bio?: string;
  email?: string;
}

export default function AuthorPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Fetch author data
        const authorResponse = await fetch(`/api/author/${id}`);
        if (!authorResponse.ok) {
          throw new Error('Failed to fetch author data');
        }
        const authorData = await authorResponse.json();
        
        if (authorData && authorData[0] && authorData[0].author) {
          setAuthor(authorData[0].author);
          
          // Check if this is the current logged-in user
          if (user && user.id === authorData[0].author.id) {
            setIsCurrentUser(true);
          }
        }
        
        // Fetch author posts
        const postsResponse = await fetch(`/api/author/${id}/posts`);
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch author posts');
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching author info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPosts();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-md max-w-md">
          <div className="flex justify-center mb-6">
            <UserCircle className="w-20 h-20 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">لم يتم العثور على المؤلف</h1>
          <p className="text-gray-600 mb-6">المؤلف الذي تبحث عنه غير موجود.</p>
          <Link href="/stories" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة إلى المقالات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/stories" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة إلى المقالات
          </Link>
        </div>
        
        {/* Author Profile */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:flex-shrink-0 flex items-center justify-center p-6 md:p-8">
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                <Image
                  src={author.img || '/placeholder-avatar.png'}
                  alt={`${author.fName} ${author.lName}`}
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-6 md:p-8 md:flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 text-right">{author.fName} {author.lName}</h1>
              
              <div className="flex items-center text-gray-600 mb-3 justify-end">
                <span>{author.email}</span>
                <Mail className="w-5 h-5 mr-2 ml-2" />
              </div>

              <div className="flex items-center text-gray-600 mb-4 justify-end">
                <span>{posts.length} مقالة منشورة</span>
                <BookOpen className="w-5 h-5 mr-2 ml-2" />
              </div>
              
              {author.bio && (
                <p className="text-gray-700 mb-6 text-right border-r-4 border-blue-100 pr-4">{author.bio}</p>
              )}
              
              {isCurrentUser && (
                <div className="flex space-x-4 justify-end">
                  <Link href="/auth/articles/create" className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition flex items-center mr-4">
                    <Plus className="w-4 h-4 ml-2" />
                    مقالة جديدة
                  </Link>
                  <Link href="/settings" className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition flex items-center">
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل الملف الشخصي
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right flex items-center justify-end">
            <BookOpen className="w-6 h-6 ml-2" />
            المقالات المنشورة
          </h2>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-16 h-16 text-gray-300" />
              </div>
              <p className="text-gray-600 text-lg font-medium">لم ينشر هذا المؤلف أي مقالات بعد.</p>
              {isCurrentUser && (
                <div className="mt-6">
                  <Link href="/auth/articles/create" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition inline-flex items-center">
                    <Plus className="w-5 h-5 ml-2" />
                    إنشاء مقالة جديدة
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
