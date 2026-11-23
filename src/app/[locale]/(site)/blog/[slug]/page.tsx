import { notFound } from "next/navigation";
import { generateArticleSchema } from "@/lib/schema-generator";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient";
import { getArticleForEndUser } from "@/lib/api/articles";
import { generateSEO } from "@/utils/seo";
import JsonLd from "../../components/JsonLd";
import { unwrapField } from "@/utils/slug";
import { localizeArticleContent } from "@/utils/articleContentTranslations";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const blogPost = await getArticleForEndUser(slug, locale);

  if (!blogPost) return {};

  const title = unwrapField(blogPost.title, locale);
  const description = unwrapField(blogPost.excerpt, locale);

  return generateSEO({
    title,
    description,
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

  const title = unwrapField(blogPost.title, locale);
  const excerpt = unwrapField(blogPost.excerpt, locale);

  const rawBlocks = Array.isArray(blogPost.content)
    ? blogPost.content
    : (blogPost.content as any)?.[locale] ||
      (blogPost.content as any)?.en ||
      (blogPost.content as any)?.ar ||
      [];

  const localizedContent = localizeArticleContent(
    blogPost.id,
    rawBlocks,
    locale
  ).map((block: any) => ({
    ...block,
    title: unwrapField(block.title, locale),
  }));

  const localizedBlogPost = {
    ...blogPost,
    title,
    excerpt,
    content: localizedContent,
  };

  const jsonLd = generateArticleSchema({
    title,
    description: excerpt,
    image: blogPost.feature_image || "https://the-forge-one.vercel.app/seo/home-preview.jpg",
    datePublished: blogPost.created_at,
    dateModified: blogPost.updated_at || blogPost.created_at,
    slug: slug,
    locale: locale,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <SingleBlogClient blogPost={localizedBlogPost} locale={locale} />
    </>
  );
}
