"use client";

import { Link } from '@/i18n/routing';
import Image from "next/image";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { fadeInUp, staggerContainer } from "@/utils/animations";
import { formatRelativeTime } from "@/utils/formatDate";
import { unwrapField } from "@/utils/slug";

export default function Blogs({ articles = [] }: { articles?: any[] }) {
  const t = useTranslations("home.featuredBlogs");
  const locale = useLocale();

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="text-center mb-12">
          <motion.h2
            className="text-section font-heading font-bold mb-3 tracking-tight text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
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
                    alt={unwrapField(blog.title, locale)}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <Link href={`/blog/${blog.id}`} className="block mb-2">
                  <h3 className="font-heading font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-250">
                    {unwrapField(blog.title, locale)}
                  </h3>
                </Link>

                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                  {unwrapField(blog.excerpt, locale)}
                </p>

                <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 gap-4 border-t border-gray-100 dark:border-gray-800/60 pt-4 mt-auto">
                  <span className="flex items-center">
                    <FaCalendarAlt className="me-1.5 h-3.5 w-3.5 text-gray-400" />
                    {formatRelativeTime(blog.date?.raw || blog.created_at || blog.date, locale)}
                  </span>
                  <span className="flex items-center">
                    <FaClock className="me-1.5 h-3.5 w-3.5 text-gray-400" />
                    {t("readTime", { minutes: 5 })}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/blog"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 dark:shadow-primary/10 font-semibold"
            >
              {t("viewAll")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
