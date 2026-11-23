"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLocale } from "next-intl";
import { unwrapField } from "@/utils/slug";

export type ArticleStats = {
  id?: number;
  title: string | Record<string, string>;
  stats?: {
    views: number;
    likes: number;
  };
};

export type LectureStats = {
  id?: number;
  title: string | Record<string, string>;
  views?: number;
  reading_time?: number;
  courseTitle?: string | Record<string, string>;
};

interface ArticlesChartProps {
  data?: ArticleStats[];
  articles?: ArticleStats[];
  lectures?: LectureStats[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl shadow-lg backdrop-blur-md">
        <p className="font-semibold text-gray-800 dark:text-white mb-2 text-sm max-w-[240px] whitespace-normal">
          {p.fullTitle}
        </p>
        {p.courseName && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {p.courseName}
          </p>
        )}
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm font-medium">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
            <span className="text-gray-900 dark:text-white font-bold">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ArticlesChart({
  data,
  articles,
  lectures = [],
}: ArticlesChartProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"articles" | "lectures">("articles");

  const effectiveArticles = articles || data || [];

  const viewsLabel = isAr ? "المشاهدات" : "Views";
  const likesLabel = isAr ? "الإعجابات" : "Likes";
  const readingTimeLabel = isAr ? "وقت القراءة (دقائق)" : "Reading Time (min)";

  const articlesChartData = useMemo(() => {
    if (!effectiveArticles || !Array.isArray(effectiveArticles)) return [];
    return [...effectiveArticles]
      .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
      .slice(0, 10)
      .map((item) => {
        const titleStr = unwrapField(item.title, locale) || (isAr ? "بدون عنوان" : "Unknown");
        return {
          name: titleStr.length > 22 ? titleStr.substring(0, 22) + "..." : titleStr,
          [viewsLabel]: item.stats?.views || 0,
          [likesLabel]: item.stats?.likes || 0,
          fullTitle: titleStr,
        };
      });
  }, [effectiveArticles, locale, isAr, viewsLabel, likesLabel]);

  const lecturesChartData = useMemo(() => {
    if (!lectures || !Array.isArray(lectures)) return [];
    return [...lectures]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map((item) => {
        const titleStr = unwrapField(item.title, locale) || (isAr ? "بدون عنوان" : "Unknown");
        const courseName = item.courseTitle ? unwrapField(item.courseTitle, locale) : "";
        return {
          name: titleStr.length > 22 ? titleStr.substring(0, 22) + "..." : titleStr,
          [viewsLabel]: item.views || 0,
          [readingTimeLabel]: item.reading_time || 0,
          fullTitle: titleStr,
          courseName,
        };
      });
  }, [lectures, locale, isAr, viewsLabel, readingTimeLabel]);

  const currentData: any[] = activeTab === "articles" ? articlesChartData : lecturesChartData;

  const titleText =
    activeTab === "articles"
      ? isAr
        ? "أداء المقالات (المشاهدات والإعجابات)"
        : "Articles Performance (Views & Likes)"
      : isAr
      ? "أداء الشروحات والمحاضرات (المشاهدات ووقت القراءة)"
      : "Written Tutorials & Lectures (Views & Reading Time)";

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-xl shadow-sm space-y-4">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {titleText}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isAr
              ? "إحصائيات تفصيلية لأداء المحتوى والمشاهدات حسب اللغة المختارة"
              : "Detailed content metrics and views in the selected language"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "articles"
                ? "bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {isAr ? "المقالات" : "Articles"}{" "}
            <span className="opacity-75">({articlesChartData.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("lectures")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "lectures"
                ? "bg-white dark:bg-gray-900 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {isAr ? "الشروحات المكتوبة" : "Written Tutorials"}{" "}
            <span className="opacity-75">({lecturesChartData.length})</span>
          </button>
        </div>
      </div>

      {currentData.length === 0 ? (
        <div className="flex items-center justify-center h-80 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-gray-500">
          <p>{isAr ? "لا توجد بيانات متاحة للمخططات" : "No data available for charts"}</p>
        </div>
      ) : (
        <div className="w-full h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              barSize={24}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6a00" stopOpacity={1} />
                  <stop offset="95%" stopColor="#ff9a4d" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={activeTab === "articles" ? "#6B7280" : "#06b6d4"}
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor={activeTab === "articles" ? "#9ca3af" : "#22d3ee"}
                    stopOpacity={0.8}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                className="stroke-gray-200 dark:stroke-gray-800"
                opacity={0.6}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
                content={<CustomTooltip />}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px", fontSize: "13px", fontWeight: 500 }}
              />
              <Bar
                dataKey={viewsLabel}
                fill="url(#colorViews)"
                radius={[6, 6, 0, 0]}
                name={viewsLabel}
              />
              <Bar
                dataKey={activeTab === "articles" ? likesLabel : readingTimeLabel}
                fill="url(#colorSecondary)"
                radius={[6, 6, 0, 0]}
                name={activeTab === "articles" ? likesLabel : readingTimeLabel}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
