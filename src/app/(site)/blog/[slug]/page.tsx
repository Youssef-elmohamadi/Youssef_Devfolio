import { notFound } from "next/navigation";
import { generateArticleSchema } from "@/lib/schema-generator";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { getArticleForEndUser } from "@/lib/api/articles";
import { generateSEO } from "@/utils/seo";
import JsonLd from "../../components/JsonLd";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogPost = await getArticleForEndUser(slug);

  if (!blogPost) return {};

  return generateSEO({
    title: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.feature_image,
    type: "article",
    asPath: `/blog/${slug}`,
    publishedTime: blogPost.created_at,
    keywords: blogPost.tags, 
  });
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blogPost = await getArticleForEndUser(slug);

  if (!blogPost) notFound();
  // const jsonLd = generateArticleSchema({
  //   title: blogPost.title,
  //   description: blogPost.excerpt,
  //   image: blogPost.feature_image,
  //   datePublished: blogPost.created_at,
  //   dateModified: blogPost.updated_at,
  //   slug: slug,
  // });

  return (
    <>
      {/* <JsonLd data={jsonLd} /> */}

      <SingleBlogClient blogPost={blogPost} />
    </>
  );
}
