const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://the-forge-one.vercel.app";

async function getAllPosts() {
  return [
    { slug: "understanding-react-fiber", updatedAt: "2025-06-01" },
    { slug: "react-performance-optimization", updatedAt: "2025-07-10" },
  ];
}

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

async function generate() {
  const staticPages = [
    { url: `${BASE_URL}/`, changefreq: "daily", priority: 1.0 },
    { url: `${BASE_URL}/about`, changefreq: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, changefreq: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, changefreq: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/projects`, changefreq: "weekly", priority: 0.8 },
  ];

  const posts = await getAllPosts();
  const postItems = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastmod: p.updatedAt,
    changefreq: "monthly",
    priority: 0.6,
  }));

  const items = [...staticPages, /* ...productItems, */ ...postItems];
  const xml = buildSitemap(items);

  // 👇 المسار بيتأكد انه دايمًا يكتب في جذر المشروع/public
  const filePath = path.join(process.cwd(), "public", "sitemap.xml");

  // تأكد أن مجلد public موجود
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, xml, "utf8");

  console.log("✅ Sitemap generated at:", filePath);
}

generate().catch((err) => {
  console.error("❌ Error generating sitemap:", err);
  process.exit(1);
});
