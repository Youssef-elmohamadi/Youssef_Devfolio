import React from "react";
import { getDashboardStatistics } from "@/lib/api/admin/statistics";
import { getArticles } from "@/lib/api/articles";
import { FaFileAlt, FaProjectDiagram, FaEnvelope, FaStar } from "react-icons/fa";
import Link from "next/link";
import ArticlesChart from "./components/ArticlesChart";

const Admin = async () => {
  const [stats, articlesRes] = await Promise.all([
    getDashboardStatistics(),
    getArticles(1, 50).catch(() => ({ data: [] })),
  ]);

  const articlesData = articlesRes.data || [];
  const totalViews = articlesData.reduce((sum: number, article: any) => sum + (article.stats?.views || 0), 0);
  const totalLikes = articlesData.reduce((sum: number, article: any) => sum + (article.stats?.likes || 0), 0);

  const statCards = [
    {
      title: "Total Articles",
      value: stats.articlesCount,
      icon: <FaFileAlt className="text-4xl text-orange-500/20 group-hover:text-orange-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-orange-500",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: <FaStar className="text-4xl text-purple-500/20 group-hover:text-purple-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-purple-500",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      icon: <FaStar className="text-4xl text-pink-500/20 group-hover:text-pink-500 transition-colors" />,
      link: "/admin/articles",
      color: "border-pink-500",
    },
    {
      title: "Total Projects",
      value: stats.projectsCount,
      icon: <FaProjectDiagram className="text-4xl text-blue-500/20 group-hover:text-blue-500 transition-colors" />,
      link: "/admin/projects",
      color: "border-blue-500",
    },
    {
      title: "Total Skills",
      value: stats.skillsCount,
      icon: <FaStar className="text-4xl text-yellow-500/20 group-hover:text-yellow-500 transition-colors" />,
      link: "/admin/skills",
      color: "border-yellow-500",
    },
    {
      title: "Total Messages",
      value: stats.messagesCount,
      icon: <FaEnvelope className="text-4xl text-green-500/20 group-hover:text-green-500 transition-colors" />,
      link: "/admin/messages",
      color: "border-green-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your portfolio statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, idx) => (
          <Link
            href={card.link}
            key={idx}
            className={`group flex items-center justify-between p-6 bg-white dark:bg-gray-900 border-l-4 ${card.color} rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Articles Performance (Views & Likes)
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl shadow-sm">
          <ArticlesChart data={articlesRes.data || []} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
