import { notFound } from "next/navigation";
import { generateArticleSchema } from "@/lib/schema-generator";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { getArticleForEndUser } from "@/lib/api/articles";
import { generateSEO } from "@/utils/seo";
import JsonLd from "../../components/JsonLd";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const blogPost = await getArticleForEndUser(slug, locale);

  if (!blogPost) return {};

  return generateSEO({
    title: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.feature_image,
    type: "article",
    locale,
    asPath: `/blog/${slug}`,
    publishedTime: blogPost.created_at,
    keywords: blogPost.tags,
  });
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug, locale } = await params;
  const blogPost = await getArticleForEndUser(slug, locale);

  if (!blogPost) notFound();

  const jsonLd = generateArticleSchema({
    title: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.feature_image || "https://the-forge-one.vercel.app/seo/home-preview.jpg",
    datePublished: blogPost.created_at,
    dateModified: blogPost.updated_at || blogPost.created_at,
    slug: slug,
    locale: locale,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <SingleBlogClient blogPost={blogPost} />
    </>
  );
}
