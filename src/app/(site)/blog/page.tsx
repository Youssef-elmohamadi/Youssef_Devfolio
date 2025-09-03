import React from "react";
import BlogsClientPage from "./BlogsClientPage";
import { generateSEO } from "@/utils/seo"; // اتأكد من المسار الصحيح

const blogPageUrl = "https://the-forge-one.vercel.app/blog";
const blogPageTitle = "Blog Posts | Youssef Elmohamadi | The Forge";
const blogPageDescription =
  "Read the latest blog posts about web development, React, Next.js, and software engineering tips.";
const blogPageImage = "https://the-forge-one.vercel.app/youssef.png"; // صورة OG/Twitter مخصصة للمدونة

export const metadata = generateSEO({
  title: blogPageTitle,
  description: blogPageDescription,
  url: blogPageUrl,
  image: blogPageImage,
  type: "article", // علشان تعتبر صفحة مقالات
  keywords: [
    "Youssef Elmohamadi",
    "blog",
    "web development",
    "React",
    "Next.js",
    "software engineering",
    "JavaScript",
    "frontend tips",
    "programming blogs",
  ],
});

const Blog = () => {
  return <BlogsClientPage />;
};

export default Blog;
