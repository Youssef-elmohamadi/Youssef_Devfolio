import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  LinkIcon,
  CalendarDaysIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { getProjectForEdit } from "@/lib/api/admin/projects";

export const metadata = {
  title: "Admin | Project Details",
};

interface PageProps {
  params: {
    id: string;
  };
}

const ProjectDetailsPage = async ({ params }: PageProps) => {
  const project = await getProjectForEdit(params.id);

  if (!project) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10 flex flex-col items-center">
      {/* Navigation Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-primary/50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Projects</span>
        </Link>

        <Link
          href={`/admin/projects/update/${params.id}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Edit Project</span>
        </Link>
      </div>

      {/* Main Project Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden relative">
        {/* Hero Image Section */}
        <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-900 group">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 dark:text-gray-700">
              <span className="text-xl font-bold uppercase tracking-widest">
                No Thumbnail Available
              </span>
            </div>
          )}
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Title on Image */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 text-white/80 font-medium text-sm">
              <CalendarDaysIcon className="w-5 h-5" />
              <span>
                Created on{" "}
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Description & Tech Stack */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                About Project
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{project.description}</p>
              </div>
            </div>

            {/* Full Tech Stack */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TagIcon className="w-4 h-4" /> Tech Stack Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:text-primary hover:border-primary/30 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Actions & Links */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Project Links
              </h4>

              <div className="space-y-3">
                {/* Live Demo Button */}
                {project.demo_link ? (
                  <Link
                    href={project.demo_link}
                    target="_blank"
                    className="flex items-center justify-between w-full p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary hover:text-primary transition-all group shadow-sm"
                  >
                    <span className="flex items-center gap-3 font-bold text-gray-900 dark:text-white group-hover:text-primary">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      Live Demo
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      Visit
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl opacity-60 cursor-not-allowed">
                    <span className="flex items-center gap-3 font-bold text-gray-500">
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      Live Demo
                    </span>
                    <span className="text-xs text-gray-500">N/A</span>
                  </div>
                )}

                {/* GitHub Button */}
                {project.github_link ? (
                  <Link
                    href={project.github_link}
                    target="_blank"
                    className="flex items-center justify-between w-full p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-black dark:hover:border-white transition-all group shadow-sm"
                  >
                    <span className="flex items-center gap-3 font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-white">
                      <CodeBracketIcon className="w-5 h-5" />
                      Source Code
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      GitHub
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl opacity-60 cursor-not-allowed">
                    <span className="flex items-center gap-3 font-bold text-gray-500">
                      <CodeBracketIcon className="w-5 h-5" />
                      Source Code
                    </span>
                    <span className="text-xs text-gray-500">Private</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-bold text-primary">Tip:</span> Make sure
                the links are working correctly. You can update them anytime
                from the Edit page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
