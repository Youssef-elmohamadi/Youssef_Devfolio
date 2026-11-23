import React from "react";
import { getDashboardStatistics } from "@/lib/api/admin/statistics";
import { getArticles } from "@/lib/api/articles";
import { getCourses } from "@/lib/api/courses";
import {
  FaFileAlt,
  FaProjectDiagram,
  FaEnvelope,
  FaStar,
  FaHeart,
  FaEye,
  FaGraduationCap,
  FaBookOpen,
  FaClock,
} from "react-icons/fa";
import { Link } from '@/i18n/routing';
import ArticlesChart from "./components/ArticlesChart";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const Admin = async ({ params }: PageProps) => {
  const { locale } = await params;
  const isAr = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net";

  const [stats, articlesRes, coursesRes] = await Promise.all([
    getDashboardStatistics(locale),
    getArticles(1, 50, undefined, locale).catch(() => ({ data: [] })),
    getCourses({ per_page: 50 }, locale).catch(() => ({ data: [], meta: { total: 0 } })),
  ]);

  const articlesData = articlesRes.data || [];
  const totalViews = articlesData.reduce((sum: number, article: any) => sum + (article.stats?.views || 0), 0);
  const totalLikes = articlesData.reduce((sum: number, article: any) => sum + (article.stats?.likes || 0), 0);

  const coursesList = coursesRes?.data || [];
  const courseDetails = await Promise.all(
    coursesList.map((c: any) =>
      fetch(`${baseUrl}/api/courses/${c.id}?lang=${locale}`, {
        headers: { Accept: "application/json", "Accept-Language": locale },
        next: { revalidate: 3600, tags: ["courses", `courses:${locale}`] },
      })
        .then((r) => r.json())
        .then((d) => d.data)
        .catch(() => null)
    )
  );

  const lecturesList = courseDetails
    .filter(Boolean)
    .flatMap((c: any) =>
      (c.lectures || []).map((l: any) => ({
        ...l,
        courseTitle: c.title,
      }))
    );

  const totalLectureViews = lecturesList.reduce((sum: number, l: any) => sum + (l.views || 0), 0);
  const totalReadingTime = lecturesList.reduce((sum: number, l: any) => sum + (l.reading_time || 0), 0);

  const statCards = [
    {
      title: isAr ? "إجمالي المقالات" : "Total Articles",
      value: stats.articlesCount,
      icon: <FaFileAlt className="text-3xl text-orange-500/20 group-hover:text-orange-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-orange-500",
    },
    {
      title: isAr ? "مشاهدات المقالات" : "Article Views",
      value: totalViews,
      icon: <FaEye className="text-3xl text-purple-500/20 group-hover:text-purple-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-purple-500",
    },
    {
      title: isAr ? "إعجابات المقالات" : "Article Likes",
      value: totalLikes,
      icon: <FaHeart className="text-3xl text-pink-500/20 group-hover:text-pink-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-pink-500",
    },
    {
      title: isAr ? "الشروحات المكتوبة" : "Written Tutorials",
      value: stats.coursesCount,
      icon: <FaGraduationCap className="text-3xl text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />,
      link: "/admin/courses",
      color: "border-emerald-500",
    },
    {
      title: isAr ? "إجمالي المحاضرات" : "Total Lectures",
      value: stats.lecturesCount || lecturesList.length,
      icon: <FaBookOpen className="text-3xl text-cyan-500/20 group-hover:text-cyan-500 transition-colors" />,
      link: "/admin/courses",
      color: "border-cyan-500",
    },
    {
      title: isAr ? "مشاهدات الشروحات" : "Tutorial Views",
      value: totalLectureViews,
      icon: <FaStar className="text-3xl text-indigo-500/20 group-hover:text-indigo-500 transition-colors" />,
      link: "/admin/courses",
      color: "border-indigo-500",
    },
    {
      title: isAr ? "وقت قراءة الشروحات" : "Tutorials Reading Time",
      value: `${totalReadingTime} ${isAr ? "دقيقة" : "min"}`,
      icon: <FaClock className="text-3xl text-teal-500/20 group-hover:text-teal-500 transition-colors" />,
      link: "/admin/courses",
      color: "border-teal-500",
    },
    {
      title: isAr ? "إجمالي المشاريع" : "Total Projects",
      value: stats.projectsCount,
      icon: <FaProjectDiagram className="text-3xl text-blue-500/20 group-hover:text-blue-500 transition-colors" />,
      link: "/admin/projects",
      color: "border-blue-500",
    },
    {
      title: isAr ? "إجمالي المهارات" : "Total Skills",
      value: stats.skillsCount,
      icon: <FaStar className="text-3xl text-yellow-500/20 group-hover:text-yellow-500 transition-colors" />,
      link: "/admin/skills",
      color: "border-yellow-500",
    },
    {
      title: isAr ? "إجمالي الرسائل" : "Total Messages",
      value: stats.messagesCount,
      icon: <FaEnvelope className="text-3xl text-green-500/20 group-hover:text-green-500 transition-colors" />,
      link: "/admin/messages",
      color: "border-green-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isAr ? "لوحة التحكم" : "Admin Dashboard"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isAr
            ? "مرحبًا بك مجددًا! نظرة عامة على إحصائيات المقالات، الشروحات المكتوبة، وبورتفوليو الخاص بك."
            : "Welcome back! Overview of your articles, written tutorials, and portfolio statistics."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, idx) => (
          <Link
            href={card.link}
            key={idx}
            className={`group flex items-center justify-between p-5 bg-white dark:bg-gray-900 border-s-4 ${card.color} rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800`}
          >
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {card.value}
              </h3>
            </div>
            <div className="relative">
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ArticlesChart
          articles={articlesData}
          lectures={lecturesList}
        />
      </div>
    </div>
  );
};

export default Admin;
