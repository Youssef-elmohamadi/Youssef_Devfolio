import { notFound } from "next/navigation";
import { blogs } from "@/contents/blogs";
import { generateSEO } from "@/utils/seo";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";

// تعريف نوع عام للـ props
interface PageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// تعريف دالة generateMetadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug as string; // تحويل slug لـ string
  const blogPost = blogs.find((blog) => blog.slug === slug);
  if (!blogPost) notFound();

  const url = `https://youssef-devfolio.vercel.app/blog/${blogPost.slug}`;
  return generateSEO({
    title: `${blogPost.title} | Youssef Elmohamadi | The Forge`,
    description: blogPost.excerpt,
    url,
    type: "article",
  });
}

// تعريف الصفحة
export default function SingleBlogPage({ params }: PageProps) {
  const slug = params.slug as string; // تحويل slug لـ string
  const blogPost = blogs.find((blog) => blog.slug === slug);
  if (!blogPost) notFound();

  return <SingleBlogClient blogPost={blogPost} />;
}