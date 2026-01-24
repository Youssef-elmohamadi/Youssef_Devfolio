"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // هوكات التنقل
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHoverSmall } from "@/utils/animations";
import { likeArticleAction } from "../../../../actions/articles";

// --- Blog Card Component ---
const BlogCard = ({ blog }: { blog: any }) => {
  const [isLiked, setIsLiked] = useState(blog.stats?.liked || false);
  const [likesCount, setLikesCount] = useState(blog.stats?.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    if (isLoading) return;

    const prevLiked = isLiked;
    const prevCount = likesCount;

    // Optimistic Update
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      const data = await likeArticleAction(blog.id);
      router.refresh();
      if (data && typeof data.liked !== "undefined") {
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.article
      className="bg-white dark:bg-dark/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full group"
      variants={fadeInUp}
      {...cardHoverSmall}
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

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-secondary/80 mb-3">
          <div className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-primary/70" />
            <span>{blog.date.diff}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaClock className="text-primary/70" />
            <span>5 min read</span>
          </div>
        </div>

        <motion.h2
          className="text-xl font-bold mb-3 line-clamp-2"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            href={`/blog/${blog.id}`}
            className="hover:text-primary transition-colors"
          >
            {blog.title}
          </Link>
        </motion.h2>

        <p className="text-secondary mb-6 text-sm line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center justify-end w-full gap-3">
            <div
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-default"
              title="Views"
            >
              <FaEye className="text-gray-400 dark:text-gray-500 text-sm" />
              <span>{blog.stats?.views || 0}</span>
            </div>

            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-50 text-red-500 dark:bg-red-900/20 shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </motion.div>
              <span className="text-xs font-bold">{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

// --- Main Client Page ---
export default function BlogsClientPage({
  initialBlogs,
  meta,
}: {
  initialBlogs: any[];
  meta: any; // استقبال الميتا داتا
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // دالة تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.last_page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    // التمرير للأعلى بسلاسة عند تغيير الصفحة
    window.scrollTo({ top: 0, behavior: "smooth" });

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <motion.h1
        className="text-4xl font-bold mb-12 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blog Posts
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {initialBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </motion.div>

      {/* --- Pagination UI --- */}
      {meta && meta.last_page > 1 && (
        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-2 bg-white dark:bg-dark/50 p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              <FaChevronLeft />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
                // منطق لإظهار عدد محدود من الصفحات
                if (
                  page === 1 ||
                  page === meta.last_page ||
                  (page >= meta.current_page - 1 &&
                    page <= meta.current_page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                        page === meta.current_page
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                // Dots ...
                if (
                  page === meta.current_page - 2 ||
                  page === meta.current_page + 2
                ) {
                  return (
                    <span key={page} className="text-gray-400 px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
