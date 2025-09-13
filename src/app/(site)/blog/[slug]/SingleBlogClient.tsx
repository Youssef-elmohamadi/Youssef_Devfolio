"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "react-use";
import Image from "next/image";
import TableOfContents from "../../components/BlogIndex";
import { Blog } from "@/types";

type CodeCopyButtonProps = {
  code: string;
};

const CodeCopyButton = ({ code }: CodeCopyButtonProps) => {
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
      className="absolute top-1 right-2 text-gray-400 hover:text-white transition-colors p-1 rounded-md"
    >
      {isCopied ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </button>
  );
};

// Props type for SingleBlogClient
type SingleBlogClientProps = {
  blogPost: Blog;
};

// Main component to display the blog post
const SingleBlogClient = ({ blogPost }: SingleBlogClientProps) => {
  const router = useRouter();
  const contentLang = blogPost.lang === "ar" ? "rtl" : "ltr"; // Function to render block content

  const renderBlock = (block: any, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <h2
            id={block.id.toString()}
            className="text-2xl font-bold text-primary mt-10 mb-4"
          >
            {block.content}
          </h2>
        );
      case "text":
        return (
          <p
            lang={blogPost.lang}
            dir={contentLang}
            className={`mb-6 text-lg leading-relaxed line-height ${
              contentLang === "rtl" ? "text-right" : ""
            }`}
            style={{ whiteSpace: "pre-line" }}
          >
            {block.content}
          </p>
        );
      case "code":
        return (
          <div className="relative my-6 rounded-lg shadow-lg">
            <SyntaxHighlighter
              language={block.language}
              style={dracula}
              className="rounded-lg !p-4 !py-6"
            >
              {block.content}
            </SyntaxHighlighter>
            <CodeCopyButton code={block.content} />
            <div className="absolute top-2 left-3 text-xs text-gray-500 font-mono capitalize">
              {block.language}
            </div>
          </div>
        );
      case "image":
        return (
          <figure className="my-6">
            <Image
              src={block.url}
              alt={block.caption || "Image"}
              width={800}
              height={500}
              className="rounded-lg shadow-lg mx-auto"
            />
            {block.caption && (
              <figcaption className="text-center text-gray-400 mt-2 text-sm">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      case "external-video":
        return (
          <div className="my-8 rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={block.url}
                title={block.caption || "Video"}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.caption && (
              <figcaption className="text-center text-gray-400 mt-2 text-sm">
                {block.caption}
              </figcaption>
            )}
          </div>
        );
      case "banner":
        return (
          <div className="relative w-full h-64 md:h-96 my-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={block.url}
              alt={block.caption || "Banner"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-2xl md:text-4xl font-bold">
                {block.caption}
              </h2>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Sidebar for Table of Contents */}
      <TableOfContents content={blogPost.content} />
      <div className="max-w-4xl mx-auto lg:ml-80">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-8 md:mb-12"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>
        {/* Title */}
        <h1 className="md:text-3xl text-xl font-bold mb-4 text-center text-primary">
          {blogPost.title}
        </h1>
        {/* Meta Info */}
        <div className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-5 w-5" />
            <span>{blogPost.date}</span>
          </div>
          <span className="mx-2">•</span>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-5 w-5" />
            <span>{blogPost.readTime}</span>
          </div>
        </div>
        {/* Blog Content */}
        <div
          lang={blogPost.lang}
          dir={contentLang}
          className="prose prose-invert max-w-none"
        >
          {blogPost.content &&
            blogPost.content.map((block, index) => (
              <React.Fragment key={index}>
                {renderBlock(block, index)}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogClient;
