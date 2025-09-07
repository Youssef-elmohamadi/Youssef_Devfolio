/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://the-forge-one.vercel.app", 
  generateRobotsTxt: true, // هيعمل robots.txt كمان
  sitemapSize: 5000, // عدد اللينكات في ملف sitemap واحد (تقدر تغير الرقم)
};
