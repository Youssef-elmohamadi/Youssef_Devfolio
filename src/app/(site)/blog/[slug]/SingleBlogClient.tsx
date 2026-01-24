"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  ClipboardIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "react-use";
import Image from "next/image";
import TableOfContents from "../../components/BlogIndex";

// مكون زر النسخ
const CodeCopyButton = ({ code }: { code: string }) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    copyToClipboard(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
    >
      {isCopied ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </button>
  );
};

const SingleBlogClient = ({ blogPost }: { blogPost: any }) => {
  const router = useRouter();
  const isRtl = blogPost.lang === "ar";

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* الفهرس يحتاج لمصفوفة العناوين فقط من الـ content */}
      <TableOfContents content={blogPost.content} />

      <div className="max-w-4xl mx-auto lg:ml-80">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-primary mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary text-center">
          {blogPost.title}
        </h1>

        <div className="flex justify-center items-center space-x-4 text-gray-400 mb-10 text-sm">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{blogPost.date.diff}</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>5 min read</span>
          </div>
        </div>

        <article
          className={`prose prose-invert max-w-none ${isRtl ? "text-right" : "text-left"}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {blogPost.content.map((block: any) => (
            <div key={block.id} className="mb-10">
              {/* العنوان الفرعي */}
              {block.title && (
                <h2
                  id={block.id}
                  className="text-2xl font-bold text-primary mt-8 mb-4"
                >
                  {block.title}
                </h2>
              )}

              {/* النص */}
              {block.text && (
                <p className="text-lg leading-relaxed mb-6 whitespace-pre-line">
                  {block.text}
                </p>
              )}

              {/* الكود */}
              {block.code && (
                <div className="relative my-6 group">
                  <SyntaxHighlighter
                    language="javascript"
                    style={dracula}
                    className="rounded-lg !p-6"
                  >
                    {block.code}
                  </SyntaxHighlighter>
                  <CodeCopyButton code={block.code} />
                </div>
              )}

              {/* الصور */}
              {block.images?.map((img: string, idx: number) => (
                <Image
                  key={idx}
                  src={img}
                  alt="content image"
                  width={800}
                  height={450}
                  className="rounded-xl shadow-2xl my-6 mx-auto"
                />
              ))}

              {/* الفيديوهات */}
              {block.videos?.map((vid: string, idx: number) => (
                <video
                  key={idx}
                  src={vid}
                  controls
                  className="w-full rounded-xl my-6 shadow-lg"
                />
              ))}
            </div>
          ))}
        </article>
      </div>
    </div>
  );
};

export default SingleBlogClient;
