'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PostCard from '@/Components/AuthArticle/post-card';
import IPost from '@/Types/PostTypes';

interface Author {
  id: string;
  fName: string;
  lName: string;
  img: string;
  bio?: string;
}

export default function AuthorPage() {
  const { id } = useParams();
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      try {
        setLoading(true);

        // Fetch author data
        const authorResponse = await fetch(`/api/author/${id}`);
        if (!authorResponse.ok) {
          throw new Error('Failed to fetch author data');
        }
        const authorData = await authorResponse.json();
        setAuthor(authorData);

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

    fetchAuthorAndPosts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Author Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the requested author.</p>
          <Link href="/auth">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author Info */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <Image
                src={author.img || '/placeholder-avatar.png'}
                alt={`${author.fName} ${author.lName}`}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {author.fName} {author.lName}
              </h1>
              {author.bio && (
                <p className="text-gray-600 mb-4">{author.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Author Posts */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{author.fName}'s Articles</h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">This author hasn't published any articles yet.</p>
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
  );
}
