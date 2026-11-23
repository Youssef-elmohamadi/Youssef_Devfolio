import type { MetadataRoute } from "next";
import { getCourses, normalizeSlug } from "@/lib/api/courses";
import { getArticles } from "@/lib/api/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://the-forge-one.vercel.app").replace(/\/+$/, "");

  const staticRoutes = ["", "/about", "/contact", "/courses", "/blog", "/projects"];
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const route of staticRoutes) {
    const enUrl = `${baseUrl}/en${route}`;
    const arUrl = `${baseUrl}/ar${route}`;

    sitemapEntries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: route === "" || route === "/courses" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: enUrl,
          ar: arUrl,
        },
      },
    });

    sitemapEntries.push({
      url: arUrl,
      lastModified: new Date(),
      changeFrequency: route === "" || route === "/courses" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: enUrl,
          ar: arUrl,
        },
      },
    });
  }

  // Dynamic courses & lectures
  try {
    const [resEn, resAr] = await Promise.all([
      getCourses({ per_page: 50 }, "en"),
      getCourses({ per_page: 50 }, "ar"),
    ]);

    const coursesEn = resEn.data || [];
    const coursesAr = resAr.data || [];

    for (const c of coursesEn) {
      const arMatch = coursesAr.find((a) => a.id === c.id);
      const enSlug = normalizeSlug(c.slug);
      const arSlug = normalizeSlug(arMatch?.slug || c.slug);

      const enUrl = `${baseUrl}/en/courses/${encodeURIComponent(enSlug)}`;
      const arUrl = `${baseUrl}/ar/courses/${encodeURIComponent(arSlug)}`;

      sitemapEntries.push({
        url: enUrl,
        lastModified: c.published_at ? new Date(c.published_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
          },
        },
      });

      sitemapEntries.push({
        url: arUrl,
        lastModified: c.published_at ? new Date(c.published_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
          },
        },
      });
    }
  } catch (err) {
    console.error("Failed to build course sitemap entries:", err);
  }

  // Dynamic articles
  try {
    const resArticles = await getArticles(1, 50, undefined, "en");
    for (const art of resArticles.data || []) {
      const enUrl = `${baseUrl}/en/blog/${art.id}`;
      const arUrl = `${baseUrl}/ar/blog/${art.id}`;

      sitemapEntries.push({
        url: enUrl,
        lastModified: art.date?.raw ? new Date(art.date.raw) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
          },
        },
      });

      sitemapEntries.push({
        url: arUrl,
        lastModified: art.date?.raw ? new Date(art.date.raw) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: {
            en: enUrl,
            ar: arUrl,
          },
        },
      });
    }
  } catch (err) {
    console.error("Failed to build article sitemap entries:", err);
  }

  return sitemapEntries;
}
