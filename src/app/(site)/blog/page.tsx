// app/blog/page.tsx
import React from "react";
import BlogsClientPage from "./BlogsClientPage";
import { generateSEO } from "@/utils/seo";
import { getArticles } from "@/lib/api/articles";

const blogPageTitle = "Blog Posts | Youssef Elmohamadi | The Forge";
const blogPageDescription =
  "Read the latest blog posts about web development, React, Next.js, and software engineering tips.";

export const metadata = generateSEO({
  title: blogPageTitle,
  description: blogPageDescription,
  type: "website",
  keywords: [
    "Youssef Elmohamadi",
    "blog",
    "web development",
    "React",
    "Laravel",
  ],
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Blog({ searchParams }: Props) {
  const page =
    typeof (await searchParams).page === "string" ? Number((await searchParams).page) : 1;

  const response = await getArticles(page);

  const articles = response.data || [];
  const meta = response.meta || null;

  return (
    <main>
      <BlogsClientPage initialBlogs={articles} meta={meta} />
    </main>
  );
}
