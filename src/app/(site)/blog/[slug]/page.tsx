import { notFound } from "next/navigation";
import { blogs } from "@/contents/blogs";
import { generateSEO } from "@/utils/seo";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";

// تعريف نوع مخصص للـ props
interface BlogPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// تعريف دالة generateMetadata
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const blogPost = blogs.find((blog) => blog.slug === params.slug);
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
export default function SingleBlogPage({ params }: BlogPageProps) {
  const blogPost = blogs.find((blog) => blog.slug === params.slug);
  if (!blogPost) notFound();

  return <SingleBlogClient blogPost={blogPost} />;
}
