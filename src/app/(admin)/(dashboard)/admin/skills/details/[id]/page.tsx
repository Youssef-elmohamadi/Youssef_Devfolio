import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  CalendarDaysIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { getSkillForEdit } from "@/lib/api/admin/skills";

export const metadata = {
  title: "Admin | Skill Details",
};

interface PageProps {
  params: {
    id: string;
  };
}

const SkillDetailsPage = async ({ params }: PageProps) => {
  const skill = await getSkillForEdit(params.id);

  if (!skill) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10 flex flex-col items-center">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-8">
        <Link
          href="/admin/skills"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-orange-500/50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Skills</span>
        </Link>

        <Link
          href={`/admin/skills/${params.id}/edit`}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Edit Skill</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <div className="w-full max-w-3xl relative">
        {/* Decorative Blur Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-orange-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Header / Icon Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative w-32 h-32 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl flex items-center justify-center border border-gray-100 dark:border-gray-800 shadow-sm text-orange-500 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                {skill.icon ? (
                  <div
                    className="w-16 h-16 fill-current drop-shadow-sm"
                    dangerouslySetInnerHTML={{ __html: skill.icon }}
                  />
                ) : (
                  <CodeBracketIcon className="w-16 h-16 text-gray-300 dark:text-gray-700" />
                )}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              {skill.title}
            </h1>

            <div className="h-1.5 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3 text-gray-400">
                <HashtagIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Tech Stack Count
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {skill.skills?.length || 0}{" "}
                <span className="text-lg font-medium text-gray-500">
                  Technologies
                </span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3 text-gray-400">
                <CalendarDaysIcon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Last Updated
                </span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Skills List Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center mb-6">
              Technologies in this stack
            </h3>

            <div className="flex flex-wrap justify-center gap-3">
              {skill.skills && skill.skills.length > 0 ? (
                skill.skills.map((item: string, index: number) => (
                  <span
                    key={index}
                    className="px-5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-base font-semibold rounded-xl shadow-sm hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 cursor-default select-none"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <p className="text-gray-400 italic">
                  No specific technologies listed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDetailsPage;
