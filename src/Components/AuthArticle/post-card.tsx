import Image from "next/image"
import IPost from './../../Types/PostTypes'
import { motion } from 'framer-motion';

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
      className="w-full max-w-2xl bg-white rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden"
            >
              <Image 
                src={post.author?.img || "/placeholder-avatar.png"} 
                alt="author" 
                width={40} 
                height={40}
                className="object-cover"
              />
            </motion.div>
            <div>
              <span className="text-sm font-medium text-gray-700">{post.author?.fName || 'Anonymous'}</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>3 min read</span>
              </div>
            </div>
          </div>
          
          <motion.h2 
            whileHover={{ x: 5 }}
            className="text-2xl font-bold text-gray-900"
          >
            {post.title}
          </motion.h2>
          
          <div 
            className="text-gray-600 prose prose-sm max-w-none line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {post.category || 'General'}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-medium hover:text-blue-700"
            >
              Read more
            </motion.button>
          </div>
        </div>
        
        {post.thumbnail && (
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
        )}
      </div>
    </motion.div>
  )
}
