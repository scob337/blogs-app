import Image from "next/image"
import Link from "next/link"
import IPost from './../../Types/PostTypes'
import { motion } from 'framer-motion';
import Nopic from '../../../public/photo.png'
interface Props {
  post: IPost
}

export default function PostCard({ post }: Props) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl bg-gradient-to-br from-white via-white to-gray-50 rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow border border-gray-100/20 backdrop-blur-sm"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Link href={`/author/${post.authorId}`}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
              >
                <Image 
                  src={post.author?.img || Nopic} 
                  alt="author" 
                  width={40} 
                  height={40}
                  className="object-cover"
                />
              </motion.div>
            </Link>
            <div>
              <Link 
                href={`/author/${post.authorId}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {post.author?.fName || 'Anonymous'}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          
          <Link href={`auth/articles/${post.id}`} className="block group">
            <motion.h2 
              whileHover={{ x: 5 }}
              className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
            >
              {post.title}
            </motion.h2>
            
            <div 
              className="text-gray-600 prose prose-sm max-w-none line-clamp-3 group-hover:text-gray-900 transition-colors"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Link>
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <span className="px-3 py-1 bg-white/80 border border-gray-100 rounded-full text-sm text-gray-600 shadow-sm">
              {post.category || 'General'}
            </span>
            <Link 
              href={`auth/articles/${post.id}`}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Read more
            </Link>
          </div>
        </div>
        
        {post.thumbnail && (
          <Link href={`auth/articles/${post.id}`} className="block">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-48 h-48 relative rounded-lg overflow-hidden"
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </Link>
        )}
      </div>
    </motion.div>
  )
}
