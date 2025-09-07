"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  ArrowLeftIcon,
  ClipboardIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { useCopyToClipboard } from "react-use";
import { Blog } from "@/types";
type CodeCopyButtonProps = {    
    code:string;
}
// Helper component for the copy button
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
      className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1 rounded-md"
    >
      {isCopied ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <ClipboardIcon className="h-5 w-5" />
      )}
    </button>
  );
};
type SingleBlogClientProps = {
    blogPost: Blog;
};

// The main client component that renders the blog content
const SingleBlogClient = ({ blogPost }: SingleBlogClientProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-primary transition-colors mb-8 md:mb-12"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>

        <h1 className="md:text-3xl text-xl font-bold mb-4 text-center text-primary">
          {blogPost.title}
        </h1>
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

        <div lang="en" dir="ltr" className="prose prose-invert max-w-none">
          {blogPost.content &&
            blogPost.content.map((block, index) => (
              <React.Fragment key={index}>
                {block.type === "text" && (
                  <p
                    lang={blogPost.lang}
                    dir={blogPost.lang === "ar" ? "rtl" : "ltr"}
                    className="mb-6 text-lg leading-relaxed"
                  >
                    {block.content}
                  </p>
                )}
                {block?.type === "code" && (
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
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlogClient;
