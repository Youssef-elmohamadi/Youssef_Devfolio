import Blogs from "./components/Blogs";
import Hero from "./components/Hero";
import Newsletter from "./components/Newsletter";
import Projects from "./components/Projects";
import { generateSEO } from "@/utils/seo";

const homePageUrl = "https://youssef-devfolio.vercel.app";
const homePageTitle = "Youssef Elmohamadi | Frontend Developer | The Forge";
const homePageDescription =
  "Welcome to the portfolio of Youssef Elmohamadi The Forge, a Frontend Developer and Computer Science student. Explore my projects, blog posts, and skills in React, Next.js, and modern web development.";
const homePageImage =
  "https://youssef-devfolio.vercel.app/seo/home-preview.jpg"; // OG/Twitter image

export const metadata = generateSEO({
  title: homePageTitle,
  description: homePageDescription,
  url: homePageUrl,
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

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Blogs />
      <Newsletter />
    </>
  );
}
