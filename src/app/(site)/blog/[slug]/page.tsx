import { notFound } from "next/navigation";
import { blogs } from "@/contents/blogs";
import { generateSEO } from "@/utils/seo";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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

export default function SingleBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const blogPost = blogs.find((blog) => blog.slug === params.slug);

  if (!blogPost) notFound();

  return <SingleBlogClient blogPost={blogPost} />;
}
