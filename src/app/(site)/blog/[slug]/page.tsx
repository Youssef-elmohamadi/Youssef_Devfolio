"use client";
import { useParams } from "next/navigation";
import React from "react";
import { blogs } from "@/contents/blogs"; // Assuming your blogs data is in this path
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
const SingleBlog = () => {
  const params = useParams();
  const slug = params?.slug;

  // Find the blog post that matches the slug
  const blogPost = blogs.find((blog) => blog.slug === slug);

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212121] text-white">
        <p className="text-2xl">Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-center">
          {blogPost.title}
        </h1>
        <p className="text-gray-400 text-lg mb-8 text-center">
          {blogPost.date} - {blogPost.readTime}
        </p>
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
                {block.type === "code" && (
                  <SyntaxHighlighter
                    language={block.language}
                    style={dracula}
                    className="rounded-lg shadow-lg my-6"
                  >
                    {block.content}
                  </SyntaxHighlighter>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
