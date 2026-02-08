import React from "react";
import ProjectsClientPage from "./ProjectsClientPage";
import { generateSEO } from "@/utils/seo";
import { getProjects } from "@/lib/api/admin/projects";

const projectsPageTitle = "Projects | Youssef Elmohamadi | The Forge";
const projectsPageDescription =
  "Explore my latest web development projects, featuring React, Next.js, and Laravel applications.";

export const metadata = generateSEO({
  title: projectsPageTitle,
  description: projectsPageDescription,
  type: "website",
  keywords: [
    "Youssef Elmohamadi",
    "Projects",
    "Portfolio",
    "React",
    "Laravel",
    "Full Stack",
  ],
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Projects({ searchParams }: Props) {
  // استقبال رقم الصفحة من الرابط أو افتراض 1
  const page =
    typeof (await searchParams).page === "string" ? Number((await searchParams).page) : 1;

  const response = await getProjects(page);

  const projects = response.data || [];
  const meta = response.meta || null;

  return (
    <main>
      <ProjectsClientPage initialProjects={projects} meta={meta} />
    </main>
  );
}