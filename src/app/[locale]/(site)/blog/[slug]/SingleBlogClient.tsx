"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from '@/i18n/routing';
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import dynamic from "next/dynamic";
import TableOfContents from "../../components/BlogIndex";
import { likeArticleAction, viewArticleAction } from "@/actions/articles";
import SocialShareButtons from "../../components/SocialShareButtons";
import CodeBlockWithPreview from "../../components/CodeBlockWithPreview";
import ArticleTable from "../../components/ArticleTable";
import ArticleEndHelper from "../../components/ArticleEndHelper";
import ArticleEndSentinel from "../../components/ArticleEndSentinel";
import { useTheme } from "@/app/context/ThemeContext";
import { formatRelativeTime } from "@/utils/formatDate";
import { useTranslations, useLocale } from "next-intl";
import { unwrapField } from "@/utils/slug";
import { localizeArticleContent } from "@/utils/articleContentTranslations";

const MermaidDiagram = dynamic(
  () => import("../../components/MermaidDiagram"),
  { ssr: false }
);

type BlogContentBlock = {
  id: number;
  type?: string | null;
  title: string | null;
  text?: string;
  code?: string;
  layout?: string | null;
  images?: string[];
  videos?: string[];
};
const SingleBlogClient = ({
  blogPost,
  locale: propLocale,
}: {
  blogPost: {
    id: string;
    title: any;
    excerpt: any;
    content: any;
    date: {
      diff: string;
      raw?: string;
    };
    created_at?: string;
    lang: string;
    feature_image: string;
    stats: {
      views: number;
      likes: number;
      liked: boolean;
    };
  };
  locale?: string;
}) => {
  const router = useRouter();
  const currentLocale = useLocale();
  const locale = propLocale || currentLocale || "en";
  const isRtl = locale === "ar";
  const [currentUrl, setCurrentUrl] = useState("");

  const resolvedTitle = unwrapField(blogPost.title, locale);
  const resolvedExcerpt = unwrapField(blogPost.excerpt, locale);

  const contentList: BlogContentBlock[] = React.useMemo(() => {
    const rawList: BlogContentBlock[] = Array.isArray(blogPost.content)
      ? blogPost.content
      : (blogPost.content as any)?.[locale] ||
        (blogPost.content as any)?.en ||
        (blogPost.content as any)?.ar ||
        [];

    const localized = localizeArticleContent(blogPost.id, rawList, locale);

    return localized.map((block) => {
      if (block.type === "heading" || block.title) {
        return {
          ...block,
          title: unwrapField(block.title, locale),
        };
      }
      return block;
    });
  }, [blogPost.content, blogPost.id, locale]);

  const [isLiked, setIsLiked] = useState(blogPost.stats?.liked || false);
  const [likesCount, setLikesCount] = useState(blogPost.stats?.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tCommon = useTranslations("common");
  const tBlog = useTranslations("blog");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
    viewArticleAction(blogPost.id).catch(console.error);
  }, [blogPost.id]);

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
    <div className="min-h-screen bg-transparent transition-colors duration-300 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-white">
      <TableOfContents content={contentList} lang={locale} />

      <div
        className={`max-w-4xl mx-auto ${
          isRtl ? "lg:mr-80 lg:ml-auto" : "lg:ml-80 lg:mr-auto"
        }`}
      >
        <button
          onClick={() => router.back()}
          className="group flex items-center space-x-2 rtl:space-x-reverse text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors mb-8"
        >
          <div className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 group-hover:border-primary/50 transition-colors">
            <ArrowLeftIcon className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
          </div>
          <span className="font-medium">{tCommon("back")}</span>
        </button>
        <h1 className="text-section md:text-[2.25rem] font-heading font-bold mb-6 tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-orange-400 leading-[1.2]">
          {resolvedTitle}
        </h1>
        <div className="bg-white/70 dark:bg-gray-900  backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-12 shadow-xl dark:shadow-none transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>{formatRelativeTime(blogPost.date?.raw || blogPost.created_at, locale)}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <ClockIcon className="h-4 w-4 text-primary" />
                <span>{tBlog("readTime", { minutes: 5 })}</span>
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
                className={`flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-70 hover:scale-105 ${isLiked
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
            title={resolvedTitle}
            description={resolvedExcerpt}
            url={currentUrl}
            isRtl={isRtl}
          />
        </div>

        {/* المقال */}
        <article
          className={`prose prose-lg max-w-none ${isRtl ? "text-right font-arabic" : "text-left font-sans"
            } dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-orange-500 transition-colors duration-300`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {(() => {
            // Find index of the second-to-last heading block
            const headingIndices: number[] = [];
            contentList.forEach((b: BlogContentBlock, i: number) => {
              if (b.type ? b.type === "heading" : Boolean(b.title)) {
                headingIndices.push(i);
              }
            });
            const triggerIndex =
              headingIndices.length >= 2
                ? headingIndices[headingIndices.length - 2]
                : -1;

            return contentList.map((block: BlogContentBlock, blockIndex: number) => {
              const renderSentinel = blockIndex === triggerIndex;

              const renderBlockContent = () => {
                // New typed blocks
                if (block.type) {
                  switch (block.type) {
                    case "heading":
                      return (
                        <div key={block.id} className="mb-12 group/block">
                          <div className="relative">
                            <h2
                              id={block.id.toString()}
                              className="text-2xl md:text-3xl font-bold mt-10 mb-6 flex items-center gap-3"
                            >
                              <span className="w-1.5 h-8 bg-primary rounded-full inline-block"></span>
                              {block.title}
                            </h2>
                          </div>
                        </div>
                      );
                    case "text":
                      return (
                        <div key={block.id} className="mb-12 group/block">
                          <p className="text-lg leading-8 mb-6 whitespace-pre-line">
                            {block.text}
                          </p>
                        </div>
                      );
                    case "code":
                      return (
                        <div key={block.id} className="mb-12 group/block">
                          <CodeBlockWithPreview
                            code={block.code || ""}
                            language="javascript"
                            isDark={isDark}
                          />
                        </div>
                      );
                    case "images":
                      return (
                        <div key={block.id} className="mb-12 group/block">
                          {block.images && block.images.length > 0 && (
                            <div
                              className={`grid gap-6 my-8 ${block.layout === "3"
                                ? "grid-cols-1 md:grid-cols-3"
                                : block.layout === "2"
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
                        </div>
                      );
                    case "video":
                      return (
                        <div key={block.id} className="mb-12 group/block">
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
                      );
                    case "diagram":
                      return (
                        <div key={block.id} className="mb-12 group/block">
                          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] p-6 overflow-auto my-8 shadow-sm transition-colors">
                            <MermaidDiagram code={block.code || ""} isDark={isDark} />
                          </div>
                        </div>
                      );
                    case "table": {
                      let parsedTable = null;
                      try {
                        parsedTable = block.text ? JSON.parse(block.text) : null;
                      } catch {
                        parsedTable = null;
                      }
                      return parsedTable ? (
                        <div key={block.id} className="mb-12 group/block my-8">
                          <ArticleTable tableData={parsedTable} />
                        </div>
                      ) : null;
                    }
                    default:
                      return null;
                  }
                }

                // Legacy blocks (no type field) - original fallback rendering
                return (
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
                      <CodeBlockWithPreview
                        code={block.code}
                        language="javascript"
                        isDark={isDark}
                      />
                    )}

                    {/* الصور */}
                    {block.images && block.images.length > 0 && (
                      <div
                        className={`grid gap-6 my-8 ${block.images.length > 1
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
                );
              };

              return (
                <React.Fragment key={block.id}>
                  {renderSentinel && <ArticleEndSentinel id="article-end" />}
                  {renderBlockContent()}
                </React.Fragment>
              );
            });
          })()}
        </article>

        {/* Fallback Sentinel if article has fewer than 2 headings */}
        <ArticleEndSentinel id="article-end-fallback" />

        {/* End of article helper character & speech bubble */}
        <ArticleEndHelper targetId="article-end" />

        {/* القسم السفلي */}

        {/* القسم السفلي */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-10 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
            {isRtl
              ? "هل أعجبك المقال؟ شاركه الآن!"
              : "Enjoyed the read? Share it!"}
          </p>
          <div className="flex justify-center">
            <SocialShareButtons
              title={resolvedTitle}
              description={resolvedExcerpt}
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
