"use client"
import Link from "next/link";
import { motion } from "framer-motion";

const Hero9 = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#090E34] to-[#1A1F42] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-white/80 rounded-full border border-white/20 backdrop-blur-sm"
          >
            We Are Creative Writers
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Explore Inspiring <span className="text-blue-400">Blogs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your Daily Dose of Knowledge & Insights. Discover engaging stories, expert opinions, and insightful articles across various topics. Join our community of passionate writers and readers!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/auth"
              className="px-8 py-4 text-base font-semibold bg-white text-[#090E34] rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-blue-500/20"
            >
              Start Writing
            </Link>
            <Link
              href="/auth"
              className="px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Articles
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero9;
