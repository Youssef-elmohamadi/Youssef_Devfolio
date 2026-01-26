// lib/seo.ts
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  asPath?: string; 
  type?: "website" | "article" | "profile";
  keywords?: string[];
  publishedTime?: string;
  authors?: string[];
}

export function generateSEO({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  icons = "/logo/dark-logo.webp",
  noIndex = false,
  asPath = "",
  type = "website",
  keywords = [],
  publishedTime,
  authors = ["Youssef Elmohamadi"],
}: SEOProps): Metadata {
    const canonicalUrl = new URL(asPath, SITE_CONFIG.url).href;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`, 
    },
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: SITE_CONFIG.locale,
      type,
      ...(type === "article" && {
        publishedTime,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
    },

    icons: {
      icon: icons,
      shortcut: icons,
      apple: icons,
    },
  };
}