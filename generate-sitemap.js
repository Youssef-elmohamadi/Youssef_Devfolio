import fs from "fs";
import path from "path";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://the-forge-one.vercel.app"
).replace(/\/+$/, "");

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://khaled67.alwaysdata.net"
).replace(/\/+$/, "");

/**
 * Safely unwrap and encode a slug that may be a JSON string, a localized object {en, ar},
 * or a raw Arabic/English string, avoiding double encoding and curly braces in XML.
 */
function unwrapSlug(val, locale = "en") {
  if (!val) return "";
  let clean = val;

  if (typeof val === "object" && val !== null) {
    clean = val[locale] || val.en || val.ar || Object.values(val)[0] || "";
  } else {
    clean = String(val);
  }

  clean = clean.trim();
  if (clean.startsWith("{") && clean.endsWith("}")) {
    try {
      const parsed = JSON.parse(clean);
      if (typeof parsed === "object" && parsed !== null) {
        clean = parsed[locale] || parsed.en || parsed.ar || Object.values(parsed)[0] || clean;
      }
    } catch {
      // not valid JSON
    }
  }

  // Decode any nested percent-encoding without throwing
  try {
    while (clean.includes("%")) {
      const decoded = decodeURIComponent(clean);
      if (decoded === clean) break;
      clean = decoded;
    }
  } catch {
    // ignore
  }

  clean = clean.replace(/[<>:"/\\|?*{}]/g, "").trim();
  return encodeURIComponent(clean);
}

/**
 * Try fetching sitemap data from the backend /api/sitemap endpoint first.
 */
async function fetchSitemapFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/sitemap`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    console.warn("Could not fetch /api/sitemap from backend, falling back to public endpoints:", e.message);
    return null;
  }
}

/* =========================
   Fallback: Fetch all courses & lectures
========================= */
async function getAllCoursesFromApi() {
  try {
    const [resEn, resAr] = await Promise.all([
      fetch(`${API_BASE}/api/courses?per_page=50&lang=en`, { cache: "no-store" }),
      fetch(`${API_BASE}/api/courses?per_page=50&lang=ar`, { cache: "no-store" }),
    ]);

    const jsonEn = resEn.ok ? await resEn.json() : { data: [] };
    const jsonAr = resAr.ok ? await resAr.json() : { data: [] };

    const coursesEn = jsonEn.data || [];
    const coursesAr = jsonAr.data || [];

    const detailedCourses = [];
    for (const c of coursesEn) {
      try {
        const arMatch = coursesAr.find((a) => a.id === c.id);
        const detailRes = await fetch(`${API_BASE}/api/courses/${encodeURIComponent(c.slug)}?lang=en`, {
          cache: "no-store",
        });
        const detailJson = detailRes.ok ? await detailRes.json() : null;
        const fullCourse = detailJson?.data || c;

        detailedCourses.push({
          id: c.id,
          slugs: {
            en: c.slug,
            ar: arMatch?.slug || c.slug,
          },
          published_at: c.published_at,
          lectures: fullCourse.lectures || [],
        });
      } catch {
        detailedCourses.push({
          id: c.id,
          slugs: { en: c.slug, ar: c.slug },
          published_at: c.published_at,
          lectures: [],
        });
      }
    }
    return detailedCourses;
  } catch (e) {
    console.warn("Could not fetch courses for sitemap:", e.message);
    return [];
  }
}

/* =========================
   Fallback: Fetch all articles
========================= */
async function getAllPostsFromApi() {
  try {
    let page = 1;
    let lastPage = 1;
    const posts = [];

    while (page <= lastPage) {
      const res = await fetch(`${API_BASE}/api/articles?page=${page}`, {
        cache: "no-store",
      });

      if (!res.ok) break;

      const json = await res.json();
      posts.push(...(json.data || []));
      lastPage = json.meta?.last_page || 1;
      page++;
    }

    return posts;
  } catch (e) {
    console.warn("Could not fetch articles for sitemap:", e.message);
    return [];
  }
}

/* =========================
   Build sitemap XML with xhtml:link alternates
========================= */
function buildSitemap(items) {
  const urls = items
    .map((it) => {
      const alternatesXml = it.alternates
        ? Object.entries(it.alternates)
            .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`)
            .join("\n")
        : "";

      return `  <url>
    <loc>${it.url}</loc>
${alternatesXml}
    ${it.lastmod ? `<lastmod>${it.lastmod}</lastmod>` : ""}
    ${it.changefreq ? `<changefreq>${it.changefreq}</changefreq>` : ""}
    ${typeof it.priority === "number" ? `<priority>${it.priority}</priority>` : ""}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

/* =========================
   Generate sitemap.xml
========================= */
async function generate() {
  const items = [];

  // 1. Static Pages (/en and /ar with alternates)
  const staticPaths = [
    { path: "", changefreq: "daily", priority: 1.0 },
    { path: "/about", changefreq: "monthly", priority: 0.7 },
    { path: "/contact", changefreq: "monthly", priority: 0.7 },
    { path: "/courses", changefreq: "daily", priority: 0.9 },
    { path: "/blog", changefreq: "weekly", priority: 0.8 },
    { path: "/projects", changefreq: "weekly", priority: 0.8 },
  ];

  for (const sp of staticPaths) {
    const enUrl = `${BASE_URL}/en${sp.path}`;
    const arUrl = `${BASE_URL}/ar${sp.path}`;
    const alternates = {
      en: enUrl,
      ar: arUrl,
      "x-default": enUrl,
    };

    items.push({
      url: enUrl,
      alternates,
      changefreq: sp.changefreq,
      priority: sp.priority,
    });
    items.push({
      url: arUrl,
      alternates,
      changefreq: sp.changefreq,
      priority: sp.priority,
    });
  }

  // 2. Dynamic Content (Courses, Lectures, Articles)
  const backendData = await fetchSitemapFromBackend();

  if (backendData && Array.isArray(backendData.courses)) {
    // Process backend sitemap response
    for (const c of backendData.courses) {
      const enSlug = unwrapSlug(c.slugs?.en || c.slug, "en");
      const arSlug = unwrapSlug(c.slugs?.ar || c.slug, "ar");
      const enUrl = `${BASE_URL}/en/courses/${enSlug}`;
      const arUrl = `${BASE_URL}/ar/courses/${arSlug}`;
      const alternates = {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      };

      const lastmod = c.updated_at ? c.updated_at.split("T")[0] : undefined;

      items.push({ url: enUrl, alternates, lastmod, changefreq: "weekly", priority: 0.8 });
      items.push({ url: arUrl, alternates, lastmod, changefreq: "weekly", priority: 0.8 });
    }

    if (Array.isArray(backendData.lectures)) {
      for (const lec of backendData.lectures) {
        const cEn = unwrapSlug(lec.slugs?.en?.course_slug || "course", "en");
        const lEn = unwrapSlug(lec.slugs?.en?.lecture_slug || "lecture", "en");
        const cAr = unwrapSlug(lec.slugs?.ar?.course_slug || "course", "ar");
        const lAr = unwrapSlug(lec.slugs?.ar?.lecture_slug || "lecture", "ar");

        const enUrl = `${BASE_URL}/en/courses/${cEn}/${lEn}`;
        const arUrl = `${BASE_URL}/ar/courses/${cAr}/${lAr}`;
        const alternates = {
          en: enUrl,
          ar: arUrl,
          "x-default": enUrl,
        };

        const lastmod = lec.updated_at ? lec.updated_at.split("T")[0] : undefined;

        items.push({ url: enUrl, alternates, lastmod, changefreq: "weekly", priority: 0.7 });
        items.push({ url: arUrl, alternates, lastmod, changefreq: "weekly", priority: 0.7 });
      }
    }

    if (Array.isArray(backendData.articles)) {
      for (const art of backendData.articles) {
        const enUrl = `${BASE_URL}/en/blog/${art.id}`;
        const arUrl = `${BASE_URL}/ar/blog/${art.id}`;
        const alternates = {
          en: enUrl,
          ar: arUrl,
          "x-default": enUrl,
        };

        const lastmod = art.updated_at ? art.updated_at.split("T")[0] : undefined;

        items.push({ url: enUrl, alternates, lastmod, changefreq: "weekly", priority: 0.6 });
        items.push({ url: arUrl, alternates, lastmod, changefreq: "weekly", priority: 0.6 });
      }
    }
  } else {
    // Fallback if backend /api/sitemap is not available
    const [posts, courses] = await Promise.all([
      getAllPostsFromApi(),
      getAllCoursesFromApi(),
    ]);

    for (const post of posts) {
      const enUrl = `${BASE_URL}/en/blog/${post.id}`;
      const arUrl = `${BASE_URL}/ar/blog/${post.id}`;
      const alternates = {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      };
      const lastmod = post.date?.raw?.split("T")[0];

      items.push({ url: enUrl, alternates, lastmod, changefreq: "weekly", priority: 0.6 });
      items.push({ url: arUrl, alternates, lastmod, changefreq: "weekly", priority: 0.6 });
    }

    for (const c of courses) {
      const enSlug = unwrapSlug(c.slugs?.en || c.slug, "en");
      const arSlug = unwrapSlug(c.slugs?.ar || c.slug, "ar");
      const enUrl = `${BASE_URL}/en/courses/${enSlug}`;
      const arUrl = `${BASE_URL}/ar/courses/${arSlug}`;
      const alternates = {
        en: enUrl,
        ar: arUrl,
        "x-default": enUrl,
      };
      const lastmod = c.published_at?.split("T")[0];

      items.push({ url: enUrl, alternates, lastmod, changefreq: "weekly", priority: 0.8 });
      items.push({ url: arUrl, alternates, lastmod, changefreq: "weekly", priority: 0.8 });

      if (Array.isArray(c.lectures)) {
        for (const lec of c.lectures) {
          const lEn = unwrapSlug(lec.slugs?.en || lec.slug, "en");
          const lAr = unwrapSlug(lec.slugs?.ar || lec.slug, "ar");
          const lecEnUrl = `${BASE_URL}/en/courses/${enSlug}/${lEn}`;
          const lecArUrl = `${BASE_URL}/ar/courses/${arSlug}/${lAr}`;
          const lecAlternates = {
            en: lecEnUrl,
            ar: lecArUrl,
            "x-default": lecEnUrl,
          };
          const lecLastmod = lec.published_at?.split("T")[0] || lastmod;

          items.push({ url: lecEnUrl, alternates: lecAlternates, lastmod: lecLastmod, changefreq: "weekly", priority: 0.7 });
          items.push({ url: lecArUrl, alternates: lecAlternates, lastmod: lecLastmod, changefreq: "weekly", priority: 0.7 });
        }
      }
    }
  }

  const xml = buildSitemap(items);
  const filePath = path.join(process.cwd(), "public", "sitemap.xml");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, xml, "utf8");

  console.log(`✅ Multilingual sitemap.xml generated successfully with ${items.length} URLs`);
  console.log(filePath);
}

/* =========================
   Run
========================= */
generate().catch((err) => {
  console.error("❌ Error generating sitemap:", err);
  process.exit(1);
});
