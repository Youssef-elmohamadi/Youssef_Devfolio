import fs from "fs";
import path from "path";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://the-forge-one.vercel.app";

const API_URL = "https://khaled67.alwaysdata.net/api/articles";

/* =========================
   Fetch all articles
========================= */
async function getAllPostsFromApi() {
  let page = 1;
  let lastPage = 1;
  const posts = [];

  while (page <= lastPage) {
    const res = await fetch(`${API_URL}?page=${page}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch articles page ${page}`);
    }

    const json = await res.json();

    posts.push(...json.data);
    lastPage = json.meta.last_page;
    page++;
  }

  return posts;
}

/* =========================
   Build sitemap XML
========================= */
function buildSitemap(items) {
  const urls = items
    .map(
      (it) => `
  <url>
    <loc>${it.url}</loc>
    ${it.lastmod ? `<lastmod>${it.lastmod}</lastmod>` : ""}
    ${it.changefreq ? `<changefreq>${it.changefreq}</changefreq>` : ""}
    ${
      typeof it.priority === "number"
        ? `<priority>${it.priority}</priority>`
        : ""
    }
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/* =========================
   Generate sitemap.xml
========================= */
async function generate() {
  const staticPages = [
    { url: `${BASE_URL}/`, changefreq: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, changefreq: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changefreq: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changefreq: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, changefreq: "weekly", priority: 0.8 },
  ];

  const posts = await getAllPostsFromApi();

  const postItems = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.id}`,
    lastmod: post.date?.raw?.split("T")[0],
    changefreq: "weekly",
    priority: 0.6,
  }));

  const items = [...staticPages, ...postItems];
  const xml = buildSitemap(items);

  const filePath = path.join(process.cwd(), "public", "sitemap.xml");

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, xml, "utf8");

  console.log("✅ Sitemap generated successfully");
  console.log(filePath);
}

/* =========================
   Run
========================= */
generate().catch((err) => {
  console.error("❌ Error generating sitemap:", err);
  process.exit(1);
});
