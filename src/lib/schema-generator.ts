// lib/schema-generator.ts
import { SITE_CONFIG } from "./constants";

// 1. سكيم الموقع العام (يوضع في الصفحة الرئيسية)
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    author: {
      "@type": "Person",
      name: "Youssef Elmohamadi",
    },
  };
}

// 2. سكيم المقال (لصفحات البلوج)
export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  slug,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${slug}`,
    },
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: "Youssef Elmohamadi",
      url: SITE_CONFIG.url, // رابط صفحتك الشخصية
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo/dark-logo.webp`,
      },
    },
  };
}