// app/admin/articles/[id]/ArticleDetailsClient.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaEdit,
  FaCalendarAlt,
  FaEye,
  FaHeart,
  FaCode,
  FaGlobe,
  FaTag,
} from "react-icons/fa";
import { formatDate } from "@/utils/formatDate"; // تأكد من مسار دالة التاريخ

export default function ArticleDetailsClient({ article }: { article: any }) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Articles</span>
        </Link>

        <Link
          href={`/admin/articles/update/${article.id}`}
          className="inline-flex items-center justify-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 font-medium"
        >
          <FaEdit />
          <span>Edit Article</span>
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {/* 1. Feature Media (Video takes priority, else Image) */}
        {article.feature_video ? (
          <div className="w-full bg-black aspect-video relative">
            <video
              src={article.feature_video}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        ) : article.feature_image ? (
          <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-900">
            <Image
              src={article.feature_image}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        <div className="p-6 md:p-10 space-y-8">
          {/* 2. Meta Info & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">
                  <FaGlobe className="text-blue-500" />{" "}
                  {article.lang === "en" ? "English" : "العربية"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt /> {formatDate(article.date.raw)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {article.author?.name}
                  </span>
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl min-w-[80px]">
                <FaEye className="text-blue-500 text-xl mb-1" />
                <span className="text-sm font-bold dark:text-white">
                  {article.stats?.views || 0}
                </span>
                <span className="text-[10px] text-gray-400 uppercase">
                  Views
                </span>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl min-w-[80px]">
                <FaHeart className="text-red-500 text-xl mb-1" />
                <span className="text-sm font-bold dark:text-white">
                  {article.stats?.likes || 0}
                </span>
                <span className="text-[10px] text-gray-400 uppercase">
                  Likes
                </span>
              </div>
            </div>
          </div>

          {/* 3. Excerpt */}
          <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-[#ff6a00] p-4 rounded-r-lg">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              {article.excerpt}
            </p>
          </div>

          {/* 4. Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                >
                  <FaTag className="text-xs opacity-50" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* 5. Content Blocks (The Core Content) */}
          <div className="space-y-10 pt-4">
            {article.content?.map((block: any, index: number) => (
              <div key={block.id || index} className="space-y-4">
                {/* Block Title */}
                {block.title && (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-[#ff6a00]">#</span> {block.title}
                  </h2>
                )}

                {/* Block Text */}
                {block.text && (
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {block.text}
                  </div>
                )}

                {/* Block Code */}
                {block.code && (
                  <div className="relative group rounded-lg overflow-hidden bg-[#1e1e1e] border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700">
                      <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                        <FaCode /> Code Snippet
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-green-400">
                      <code>{block.code}</code>
                    </pre>
                  </div>
                )}

                {/* Block Media Gallery (Images & Videos) */}
                {((block.images && block.images.length > 0) ||
                  (block.videos && block.videos.length > 0)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Images */}
                    {block.images?.map((imgUrl: string, i: number) => (
                      <div
                        key={`img-${i}`}
                        className="relative h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Content image ${i}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                    ))}
                    {/* Videos */}
                    {block.videos?.map((vidUrl: string, i: number) => (
                      <div
                        key={`vid-${i}`}
                        className="relative h-64 rounded-xl overflow-hidden bg-black border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <video
                          src={vidUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
