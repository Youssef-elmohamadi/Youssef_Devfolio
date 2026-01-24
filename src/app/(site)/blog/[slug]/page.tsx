// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { generateSEO } from "@/utils/seo";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";

async function getArticle(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
      next: { revalidate: 3600 } // تحديث كل ساعة
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const blogPost = await getArticle(params.slug);
  if (!blogPost) return {};

  return generateSEO({
    title: `${blogPost.title} | Youssef Elmohamadi`,
    description: blogPost.excerpt,
    image: blogPost.feature_image,
    type: "article",
  });
}

export default async function SingleBlogPage({ params }: any) {
  const blogPost = await getArticle(params.slug);
  if (!blogPost) notFound();

  return <SingleBlogClient blogPost={blogPost} />;
}