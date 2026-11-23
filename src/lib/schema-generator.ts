// lib/schema-generator.ts
import { SITE_CONFIG } from "./constants";

export function generateWebsiteSchema(locale: string = "en") {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url).replace(/\/+$/, "");
  const isAr = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isAr ? "يوسف المحمدي | The Forge" : SITE_CONFIG.name,
    url: `${baseUrl}/${locale}`,
    inLanguage: locale,
    description: isAr
      ? "الموقع الشخصي للمهندس يوسف المحمدي، مطور Fullstack وواجهات أمامية. استعرض المشاريع البرمجية، المقالات التقنية، والكورسات التفاعلية."
      : SITE_CONFIG.description,
    author: {
      "@type": "Person",
      name: isAr ? "يوسف المحمدي" : "Youssef Elmohamadi",
      url: `${baseUrl}/${locale}`,
    },
  };
}

export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  slug,
  locale = "en",
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  locale?: string;
}) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url).replace(/\/+$/, "");
  const isAr = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`,
    },
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: isAr ? "يوسف المحمدي" : "Youssef Elmohamadi",
      url: `${baseUrl}/${locale}`,
    },
    publisher: {
      "@type": "Organization",
      name: isAr ? "يوسف المحمدي | The Forge" : SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/dark-logo.webp`,
      },
    },
  };
}

export function generateCourseSchema({
  title,
  description,
  image,
  courseSlug,
  locale = "en",
  lectures = [],
  level,
}: {
  title: string;
  description: string;
  image?: string | null;
  courseSlug: string;
  locale?: string;
  lectures?: Array<{ title: string; slug: string; description?: string | null }>;
  level?: string;
}) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url).replace(/\/+$/, "");
  const isAr = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description: description,
    inLanguage: locale,
    educationalLevel: level,
    provider: {
      "@type": "Person",
      name: isAr ? "يوسف المحمدي" : "Youssef Elmohamadi",
      url: `${baseUrl}/${locale}`,
    },
    image: image || `${baseUrl}/seo/home-preview.jpg`,
    url: `${baseUrl}/${locale}/courses/${courseSlug}`,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      inLanguage: locale,
    },
    ...(lectures.length > 0 && {
      syllabusSections: lectures.map((lec, idx) => ({
        "@type": "Syllabus",
        name: lec.title,
        position: idx + 1,
        description: lec.description || undefined,
        url: `${baseUrl}/${locale}/courses/${courseSlug}/${lec.slug}`,
      })),
    }),
  };
}

export function generateLectureSchema({
  title,
  description,
  courseTitle,
  courseSlug,
  lectureSlug,
  datePublished,
  locale = "en",
  image,
  wordCount,
}: {
  title: string;
  description: string;
  courseTitle?: string;
  courseSlug: string;
  lectureSlug: string;
  datePublished?: string | null;
  locale?: string;
  image?: string | null;
  wordCount?: number;
}) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url).replace(/\/+$/, "");
  const isAr = locale === "ar";

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description,
    inLanguage: locale,
    url: `${baseUrl}/${locale}/courses/${courseSlug}/${lectureSlug}`,
    ...(courseTitle && {
      isPartOf: {
        "@type": "Course",
        name: courseTitle,
        url: `${baseUrl}/${locale}/courses/${courseSlug}`,
      },
    }),
    ...(datePublished && {
      datePublished: datePublished,
      dateModified: datePublished,
    }),
    image: image || `${baseUrl}/seo/home-preview.jpg`,
    ...(typeof wordCount === "number" && { wordCount }),
    author: {
      "@type": "Person",
      name: isAr ? "يوسف المحمدي" : "Youssef Elmohamadi",
      url: `${baseUrl}/${locale}`,
    },
    publisher: {
      "@type": "Organization",
      name: isAr ? "يوسف المحمدي | The Forge" : SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo/dark-logo.webp`,
      },
    },
  };
}
