import { notFound } from "next/navigation";
import { blogs } from "@/contents/blogs";
import { generateSEO } from "@/utils/seo";
import type { Metadata } from "next";
import SingleBlogClient from "./SingleBlogClient"; // Import the new client component
import { Blog } from "@/types";

// This remains a Server Component because it exports generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const blogPost = blogs.find((blog) => blog.slug === params.slug);

  if (!blogPost) {
    notFound();
  }

  const url = `https://youssef-devfolio.vercel.app/blog/${blogPost.slug}`;

  return generateSEO({
    title: `${blogPost.title} | Youssef Elmohamadi | The Forge`,
    description: blogPost.excerpt,
    url,
    type: "article",
  });
}

// This is also a Server Component. It fetches data and renders the Client Component.
const SingleBlogPage = ({ params }: { params: { slug: string } }) => {
  const blogPost = blogs.find((blog) => blog.slug === params.slug);
  if (!blogPost) {
    notFound();
  }

  // Pass the server-fetched data to the client component
  return <SingleBlogClient blogPost={blogPost} />;
};

export default SingleBlogPage;