"use client";

import React, { useMemo } from "react";
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

type ArticleStats = {
  title: string;
  stats: {
    views: number;
    likes: number;
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl shadow-lg backdrop-blur-md">
        <p className="font-semibold text-gray-800 dark:text-white mb-2 text-sm max-w-[200px] whitespace-normal">
          {payload[0].payload.fullTitle}
        </p>
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
}: {
  data: ArticleStats[];
}) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data]
      .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
      .slice(0, 10)
      .map((item) => ({
        name: item.title?.length > 20 ? item.title.substring(0, 20) + "..." : (item.title || "Unknown"),
        Views: item.stats?.views || 0,
        Likes: item.stats?.likes || 0,
        fullTitle: item.title,
      }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-gray-500">
        <p>No data available for charts</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          barSize={24}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6a00" stopOpacity={1} />
              <stop offset="95%" stopColor="#ff9a4d" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6B7280" stopOpacity={1} />
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} className="stroke-gray-200 dark:stroke-gray-800" opacity={0.6} />
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
          <Bar dataKey="Views" fill="url(#colorViews)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Likes" fill="url(#colorLikes)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
