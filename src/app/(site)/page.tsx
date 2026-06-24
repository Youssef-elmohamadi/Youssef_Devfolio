import { generateWebsiteSchema } from "@/lib/schema-generator";
import Blogs from "./components/Blogs";
import Hero from "./components/Hero";
import Newsletter from "./components/Newsletter";
import Projects from "./components/Projects";
import { generateSEO } from "@/utils/seo";
import { getHomeData, type Profile, type SocialLink, type HomeProject, type HomeArticle } from "@/lib/api/home";
import JsonLd from "./components/JsonLd";

const homePageTitle = "Youssef Elmohamadi | Frontend Developer | The Forge";
const homePageDescription =
  "Welcome to the portfolio of Youssef Elmohamadi The Forge, a Frontend Developer and Computer Science student. Explore my projects, blog posts, and skills in React, Next.js, and modern web development.";
const homePageImage = "https://the-forge-one.vercel.app/seo/home-preview.jpg";

export const metadata = generateSEO({
  title: homePageTitle,
  description: homePageDescription,
  image: homePageImage,
  type: "website",
  keywords: [
    "Youssef Elmohamadi",
    "frontend developer",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "web development",
    "portfolio",
    "software engineer",
  ],
});

export default async function Home() {
  const jsonLD = generateWebsiteSchema();

  let projects: HomeProject[] = [];
  let articles: HomeArticle[] = [];
  let profile: Profile | null = null;
  let socialLinks: SocialLink[] = [];

  try {
    const homeData = await getHomeData();
    profile = homeData.profile ?? null;
    socialLinks = homeData.SocialLink ?? [];
    projects = homeData.Project ?? [];
    articles = homeData.Article ?? [];
  } catch (error) {
    console.error("Failed to fetch home data", error);
  }

  return (
    <>
      <JsonLd data={jsonLD} />
      <Hero profile={profile} socialLinks={socialLinks} />
      <Projects projects={projects} />
      <Blogs articles={articles} />
      <Newsletter />
    </>
  );
}
