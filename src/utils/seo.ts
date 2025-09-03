// lib/seo.ts
import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
  siteName?: string;
  type?: "website" | "article";
  twitterHandle?: string;
  robots?: string;
}

export function generateSEO({
  title,
  description,
  url,
  image = "https://the-forge-one.vercel.app/elmohammadi.jpg",
  keywords,
  siteName = "Youssef Elmohamadi | The Forge",
  type = "website",
  twitterHandle = "@elmohamadidev",
  robots = "index, follow",
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords: keywords?.join(", "), 
    openGraph: {
      title,
      description,
      url,
      type, 
      siteName,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      creator: twitterHandle, // ضيف الـ handle
      images: image ? [image] : [],
    },
    robots: robots as Metadata["robots"],
    icons: {
      icon: "/logo/dark-logo.webp",
    },
  };
}
