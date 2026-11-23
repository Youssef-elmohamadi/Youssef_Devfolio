"use client";

import { Link } from '@/i18n/routing';
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCode,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, cardHoverSmall } from "@/utils/animations";

// تعريف أنواع البيانات
type Project = {
  id: number;
  title: string;
  description: string;
  github_link: string;
  demo_link: string;
  tags: string[];
  image_url: string;
  created_at: string;
};

type Meta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
};

// --- Project Card Component ---
const ProjectCard = ({ project, t }: { project: Project; t: any }) => {
  return (
    <motion.div
      className="bg-white dark:bg-dark/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full group shadow-sm hover:shadow-md transition-all duration-300"
      variants={fadeInUp}
      {...cardHoverSmall}
    >
      {/* صورة المشروع */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <FaCode className="text-4xl opacity-20" />
          </div>
        )}

        {/* Overlay Links on Image Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          {project.demo_link && (
            <Link
              href={project.demo_link}
              target="_blank"
              className="p-3 bg-primary text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              title={t("liveDemo")}
            >
              <FaExternalLinkAlt />
            </Link>
          )}
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
              title={t("viewCode")}
            >
              <FaGithub />
            </Link>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* العناوين */}
        <motion.h2
          className=" font-bold mb-2 text-gray-900 dark:text-white"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {project.title}
        </motion.h2>

        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm line-clamp-3 leading-relaxed flex-grow">
          {project.description}
        </p>

        {/* التاغات Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="text-[10px] uppercase font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[10px] text-gray-400 self-center">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* روابط سريعة في الأسفل */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <FaGithub className="text-lg" /> {t("viewCode")}
            </Link>
          )}
          {project.demo_link && (
            <Link
              href={project.demo_link}
              target="_blank"
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors ms-auto"
            >
              {t("liveDemo")} <FaExternalLinkAlt className="rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Client Page ---
export default function ProjectsClientPage({
  initialProjects,
  meta,
}: {
  initialProjects: Project[];
  meta: Meta;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("projects");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // دالة تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.last_page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container md:pt-24 max-w-[1440px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-section font-bold mb-3 text-center text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("title")}
      </motion.h1>

      <motion.p
        className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t("subtitle")}
      </motion.p>

      {/* Projects Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {initialProjects.map((project) => (
          <ProjectCard key={project.id} project={project} t={t} />
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
              aria-label={t("previous")}
            >
              <FaChevronLeft className={isRtl ? "rotate-180" : ""} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(meta.last_page)].map((_, i) => {
                const page = i + 1;
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
              aria-label={t("next")}
            >
              <FaChevronRight className={isRtl ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      )}

      {initialProjects.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          {t("noProjects")}
        </div>
      )}
    </div>
  );
}
