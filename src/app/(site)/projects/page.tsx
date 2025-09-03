import ProjectsClientPage from "./ProjectsClientPage";
import { generateSEO } from "@/utils/seo";
const projectsPageUrl = "https://the-forge-one.vercel.app/projects";
const projectsPageTitle =
  "Projects | Youssef Elmohamadi | Frontend Developer | The Forge";
const projectsPageDescription =
  "Explore the projects built by Youssef Elmohamadi, showcasing skills in React, Next.js, TypeScript, and modern web development.";
const projectsPageImage = "https://the-forge-one.vercel.app/youssef.png"; // OG/Twitter image

export const metadata = generateSEO({
  title: projectsPageTitle,
  description: projectsPageDescription,
  url: projectsPageUrl,
  image: projectsPageImage,
  type: "website",
  keywords: [
    "Youssef Elmohamadi",
    "projects",
    "portfolio",
    "frontend developer",
    "React",
    "Next.js",
    "TypeScript",
    "web development",
  ],
});

const Projects = () => {
  return <ProjectsClientPage />;
};

export default Projects;
