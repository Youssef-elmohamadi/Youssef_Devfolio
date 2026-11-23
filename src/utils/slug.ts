const TITLE_DICTIONARY: Record<string, { en: string; ar: string }> = {
  // Articles
  "Understanding State Snapshots & Batching in React": {
    en: "Understanding State Snapshots & Batching in React",
    ar: "فهم لقطات الحالة والتجميع في React",
  },
  "useRef in React: The Magic Behind That Tiny Object": {
    en: "useRef in React: The Magic Behind That Tiny Object",
    ar: "useRef في React: السحر وراء هذا الكائن",
  },
  "The Next.js 15 SEO Nightmare: How to Fix the Streaming Metadata Issue": {
    en: "The Next.js 15 SEO Nightmare: Metadata Bug",
    ar: "حل مشكلة Streaming Metadata في Next.js 15",
  },
  "Understanding React Fiber": {
    en: "Understanding React Fiber",
    ar: "فهم معمارية React Fiber",
  },
  "Improving React Performance with useTransition": {
    en: "Improving React Performance with useTransition",
    ar: "تحسين أداء React باستخدام useTransition",
  },
  // Courses
  "بناء تطبيقات الويب الحديثة باستخدام ASP.NET Core 8 و Clean Architecture": {
    en: "Building Modern Web Apps with ASP.NET Core 8 & Clean Architecture",
    ar: "بناء تطبيقات الويب الحديثة باستخدام ASP.NET Core 8 و Clean Architecture",
  },
  // Lectures
  "مقدمة في المعمارية النظيفة (Clean Architecture) وتقسيم الطبقات": {
    en: "Introduction to Clean Architecture & Layering",
    ar: "مقدمة في Clean Architecture وتقسيم الطبقات",
  },
  "تنفيذ نمط CQRS مع مكتبة MediatR ومعالجة العمليات": {
    en: "Implementing CQRS Pattern with MediatR",
    ar: "تنفيذ نمط CQRS مع مكتبة MediatR ومعالجة العمليات",
  },
};

function matchDictionary(text: string, locale: string): string | null {
  if (!text) return null;
  const clean = text.trim();
  for (const [key, mapping] of Object.entries(TITLE_DICTIONARY)) {
    if (clean === key || clean === mapping.en || clean === mapping.ar) {
      return locale === "ar" ? mapping.ar : mapping.en;
    }
  }
  return null;
}

/**
 * Unwraps a field that may be a JSON string, a localized object {en, ar}, or a plain string
 */
export function unwrapField(val: unknown, locale: string = "en"): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") {
    const obj = val as Record<string, any>;
    const directLocale = obj[locale];
    if (typeof directLocale === "string" && directLocale.trim().length > 0) {
      return directLocale;
    }
    const fallback = obj.en || obj.ar || Object.values(obj)[0] || "";
    if (typeof fallback === "string") {
      const dictMatch = matchDictionary(fallback, locale);
      if (dictMatch) return dictMatch;
      return fallback;
    }
    return String(fallback);
  }
  const str = String(val);
  if (str.trim().startsWith("{") && str.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "object" && parsed !== null) {
        const directLocale = parsed[locale];
        if (typeof directLocale === "string" && directLocale.trim().length > 0) {
          return directLocale;
        }
        const fallback = parsed.en || parsed.ar || Object.values(parsed)[0] || str;
        if (typeof fallback === "string") {
          const dictMatch = matchDictionary(fallback, locale);
          if (dictMatch) return dictMatch;
          return fallback;
        }
        return String(fallback);
      }
    } catch {
      // not valid json
    }
  }
  const dictMatch = matchDictionary(str, locale);
  if (dictMatch) return dictMatch;
  return str;
}

/**
 * Safely normalize URL slug (handles JSON translatable strings, decoded Arabic, URL-encoded %D8..., and spaces)
 */
export function normalizeSlug(slug: unknown): string {
  if (!slug) return "";
  let clean: string;
  if (typeof slug === "object" && slug !== null) {
    const obj = slug as Record<string, any>;
    clean = obj.en || obj.ar || Object.values(obj)[0] || "";
  } else {
    clean = String(slug);
  }

  if (clean.trim().startsWith("{") && clean.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(clean);
      if (typeof parsed === "object" && parsed !== null) {
        clean = parsed.en || parsed.ar || Object.values(parsed)[0] || clean;
      }
    } catch {
      // ignore
    }
  }

  // Safely decode any percent-encoded sequence without double encoding
  try {
    while (clean.includes("%")) {
      const decoded = decodeURIComponent(clean);
      if (decoded === clean) break;
      clean = decoded;
    }
  } catch {
    // Ignore decode error
  }

  // Remove illegal characters for file systems: < > : " / \ | ? * { }
  clean = clean.replace(/[<>:"/\\|?*{}]/g, "");

  return clean.trim().replace(/\s+/g, "-");
}
