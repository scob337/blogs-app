import Image from "next/image";
import Link from "next/link";
import IPost from './../../Types/PostTypes';
import { motion } from 'framer-motion';
import Nopic from '../../../public/photo.png';
import { useState } from 'react';
interface Props {
  post: IPost
}

export default function PostCard({ post }: Props) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  const [imageError, setImageError] = useState(false);
  const [authorImageError, setAuthorImageError] = useState(false);
  
  // Format category name for display
  const formatCategory = (category: string | undefined) => {
    if (!category) return 'General';
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl bg-white rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow border border-gray-100"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Link href={`/author/${post.authorId}`}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden cursor-pointer flex-shrink-0"
              >
                <Image 
                  src={!authorImageError ? (post.author?.img || Nopic) : Nopic} 
                  alt={post.author?.fName ? `${post.author.fName}'s profile` : 'Author'} 
                  width={40} 
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => setAuthorImageError(true)}
                />
              </motion.div>
            </Link>
            <div>
              <Link 
                href={`/author/${post.authorId}`}
                className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
              >
                {post.author?.fName || 'Anonymous'}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <time dateTime={post.createdAt} className="hover:text-gray-700">
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
          
          <Link href={`/auth/articles/${post.id}`} className="block group">
            <motion.h2 
              whileHover={{ x: 3 }}
              className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2"
            >
              {post.title}
            </motion.h2>
            
            <div 
              className="text-gray-600 text-sm md:text-base line-clamp-3 group-hover:text-gray-800 transition-colors"
              dangerouslySetInnerHTML={{ 
                __html: post.content.length > 120 
                  ? `${post.content.substring(0, 120).trim()}...` 
                  : post.content 
              }}
            />
          </Link>
          
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <Link 
                  href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium transition-colors"
                >
                  {formatCategory(post.category)}
                </Link>
              )}
              {post.tags?.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Link 
              href={`/auth/articles/${post.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 group"
            >
              Read more
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
        
        {(post.thumbnail || post.category) && (
          <div className="md:w-48 flex-shrink-0">
            <Link href={`/auth/articles/${post.id}`} className="block h-full">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full h-48 md:h-full relative rounded-lg overflow-hidden bg-gray-50"
              >
                {!imageError && post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                    onError={() => setImageError(true)}
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <span className="text-gray-400 text-sm">
                      {post.category ? formatCategory(post.category) : 'No Image'}
                    </span>
                  </div>
                )}
              </motion.div>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
