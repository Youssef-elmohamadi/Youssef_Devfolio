// lib/seo.ts
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  locale?: string; // "en" | "ar"
  asPath?: string; // e.g. "/about" or "/courses" or ""
  alternatePaths?: {
    en?: string;
    ar?: string;
  };
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
  locale = "en",
  asPath = "",
  alternatePaths,
  type = "website",
  keywords = [],
  publishedTime,
  authors = ["Youssef Elmohamadi"],
}: SEOProps): Metadata {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url).replace(/\/+$/, "");

  // Normalize asPath to strip leading locale prefix if present
  let cleanPath = asPath.trim();
  if (cleanPath.startsWith("/en/") || cleanPath === "/en") {
    cleanPath = cleanPath.slice(3);
  } else if (cleanPath.startsWith("/ar/") || cleanPath === "/ar") {
    cleanPath = cleanPath.slice(3);
  }
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }
  if (cleanPath === "/") {
    cleanPath = "";
  }

  // Paths for hreflang alternates
  const enSubPath = alternatePaths?.en
    ? (alternatePaths.en.startsWith("/") ? alternatePaths.en : `/${alternatePaths.en}`)
    : cleanPath;
  const arSubPath = alternatePaths?.ar
    ? (alternatePaths.ar.startsWith("/") ? alternatePaths.ar : `/${alternatePaths.ar}`)
    : cleanPath;

  const currentSubPath = locale === "ar" ? arSubPath : enSubPath;
  const canonicalUrl = `${baseUrl}/${locale}${currentSubPath === "/" ? "" : currentSubPath}`;
  const enUrl = `${baseUrl}/en${enSubPath === "/" ? "" : enSubPath}`;
  const arUrl = `${baseUrl}/ar${arSubPath === "/" ? "" : arSubPath}`;

  const isAr = locale === "ar";
  const siteName = isAr ? "يوسف المحمدي | The Forge" : SITE_CONFIG.name;
  const ogLocale = isAr ? "ar_AR" : "en_US";
  const alternateOgLocale = isAr ? ["en_US"] : ["ar_AR"];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
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
