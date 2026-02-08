"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import TableOfContents from "../../components/BlogIndex";
import { likeArticleAction } from "@/actions/articles";
import CodeCopyButton from "../../components/CodeCopyButton";
import SocialShareButtons from "../../components/SocialShareButtons";
import { useTheme } from "@/app/context/ThemeContext";

type BlogContentBlock = {
  id: number;
  title: string | null;
  text?: string;
  code?: string;
  images?: string[];
  videos?: string[];
};
const SingleBlogClient = ({
  blogPost,
}: {
  blogPost: {
    id: string;
    title: string;
    excerpt: string;
    content: Array<{
      id: number;
      title: string | null;
      text?: string;
      code?: string;
      images?: string[];
      videos?: string[];
    }>;
    date: {
      diff: string;
    };
    lang: string;
    feature_image: string;
    stats: {
      views: number;
      likes: number;
      liked: boolean;
    };
  };
}) => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");
  const isRtl = blogPost.lang === "ar";
  const [isLiked, setIsLiked] = useState(blogPost.stats?.liked || false);
  const [likesCount, setLikesCount] = useState(blogPost.stats?.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleLike = async () => {
    if (isLoading) return;
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLoading(true);

    try {
      const data = await likeArticleAction(Number(blogPost.id));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-white">
      <TableOfContents content={blogPost.content} lang={blogPost.lang} />

      <div className="max-w-4xl mx-auto lg:ml-80">
        <button
          onClick={() => router.back()}
          className="group flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-8"
        >
          <div className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 group-hover:border-primary/50 transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <span className="font-medium">Go Back</span>
        </button>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-orange-400 leading-tight">
          {blogPost.title}
        </h1>
        <div className="bg-white/70 dark:bg-[#111] backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-12 shadow-xl dark:shadow-none transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>{blogPost.date.diff}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <ClockIcon className="h-4 w-4 text-primary" />
                <span>5 min read</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <EyeIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span className="font-mono font-bold">
                  {blogPost.stats.views.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-70 hover:scale-105 ${
                  isLiked
                    ? "text-red-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-400"
                }`}
                title={isLiked ? "Unlike" : "Like"}
              >
                <HeartIcon
                  className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`}
                />
                <span className="font-mono font-bold">
                  {likesCount.toLocaleString()}
                </span>
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-4" />

          <SocialShareButtons
            title={blogPost.title}
            description={blogPost.excerpt}
            url={currentUrl}
            isRtl={isRtl}
          />
        </div>

        {/* المقال */}
        <article
          className={`prose prose-lg max-w-none ${
            isRtl ? "text-right" : "text-left"
          } dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-orange-500 transition-colors duration-300`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {blogPost.content.map((block: BlogContentBlock) => (
            <div key={block.id} className="mb-12 group/block">
              {/* العناوين الفرعية */}
              {block.title && (
                <div className="relative">
                  <h2
                    id={block.id.toString()}
                    className="text-2xl md:text-3xl font-bold mt-10 mb-6 flex items-center gap-3"
                  >
                    <span className="w-1.5 h-8 bg-primary rounded-full inline-block"></span>
                    {block.title}
                  </h2>
                </div>
              )}

              {/* النصوص */}
              {block.text && (
                <p className="text-lg leading-8 mb-6 whitespace-pre-line">
                  {block.text}
                </p>
              )}

              {/* الأكواد البرمجية */}
              {block.code && (
                <div className="relative my-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-[#1f2129] border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-mono font-semibold">JavaScript</span>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                  </div>
                  <SyntaxHighlighter
                    language="javascript"
                    style={isDark ? dracula : oneLight}
                    customStyle={{ margin: 0, padding: "1.5rem" }}
                    showLineNumbers={true}
                    wrapLines={true}
                  >
                    {block.code}
                  </SyntaxHighlighter>
                  <CodeCopyButton code={block.code} />
                </div>
              )}

              {/* الصور */}
              {block.images && block.images.length > 0 && (
                <div
                  className={`grid gap-6 my-8 ${
                    block.images.length > 1
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1"
                  }`}
                >
                  {block.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden dark:shadow-2xl border border-gray-200 dark:border-gray-800 group hover:border-primary/50 transition-all duration-300"
                    >
                      <Image
                        src={img}
                        alt={`content image ${idx + 1}`}
                        width={800}
                        height={500}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* الفيديوهات */}
              {block.videos?.map((vid: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 my-8 bg-black"
                >
                  <video
                    src={vid}
                    controls
                    className="w-full h-auto max-h-[500px]"
                  />
                </div>
              ))}
            </div>
          ))}
        </article>

        {/* القسم السفلي */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
            {isRtl
              ? "هل أعجبك المقال؟ شاركه الآن!"
              : "Enjoyed the read? Share it!"}
          </p>
          <div className="flex justify-center">
            <SocialShareButtons
              title={blogPost.title}
              description={blogPost.excerpt}
              url={currentUrl}
              isRtl={isRtl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogClient;
