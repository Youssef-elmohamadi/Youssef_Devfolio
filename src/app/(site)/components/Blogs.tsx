"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/utils/animations";
import { formatRelativeTime } from "@/utils/formatDate";

export default function Blogs({ articles = [] }: { articles?: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container max-w-7xl mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white"
            {...fadeInUp}
          >
            Latest Blog Posts
          </motion.h2>
          <motion.p
            className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Writing on web engineering, frontend frameworks, and the art of crafting web products.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {articles.map((blog) => (
            <motion.article
              key={blog.id}
              className="group bg-white dark:bg-dark/50 backdrop-blur-md rounded-2xl overflow-hidden hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 shadow-xs flex flex-col h-full"
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {blog.feature_image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={blog.feature_image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/blog/${blog.id}`} className="block mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-250">
                    {blog.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed flex-grow">
                  {blog.excerpt}
                </p>
                
                <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 space-x-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 mt-auto">
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                    {formatRelativeTime(blog.date?.raw || blog.created_at || blog.date)}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="mr-1.5 h-3.5 w-3.5 text-gray-400" />
                    5 min read
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/blog"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 dark:shadow-primary/10 font-semibold"
            >
              View All Posts
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
