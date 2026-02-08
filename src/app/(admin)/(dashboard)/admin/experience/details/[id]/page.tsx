import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { getExperiencesForEdit } from "@/lib/api/admin/experience";

export const metadata = {
  title: "Admin | Experience Details",
};

interface PageProps {
  params: {
    id: string;
  };
}

const ExperienceDetailsPage = async ({ params }: PageProps) => {
  const experience = await getExperiencesForEdit(params.id);

  if (!experience) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10 flex flex-col items-center">
      {/* Navigation Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link
          href="/admin/experience"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-primary/50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Experiences</span>
        </Link>

        <Link
          href={`/admin/experience/update/${params.id}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Edit Experience</span>
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-4xl relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-12 border-b border-gray-100 dark:border-gray-800 pb-10">
            {/* Company Logo Placeholder */}
            <div className="w-24 h-24 rounded-3xl bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-400 border border-primary-100 dark:border-primary shadow-sm flex-shrink-0">
              <BuildingOffice2Icon className="w-12 h-12" />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {experience.job_title}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mt-1">
                  at{" "}
                  <span className="text-primary dark:text-primary font-bold">
                    {experience.company}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                  {experience.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  {experience.location}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Key Achievements */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <CheckBadgeIcon className="w-5 h-5 text-primary" />
                  Key Responsibilities & Achievements
                </h3>

                <div className="space-y-4">
                  {experience.tasks && experience.tasks.length > 0 ? (
                    experience.tasks.map((task: string, index: number) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex-shrink-0 mt-1.5">
                          <div className="w-6 h-6 rounded-full bg-primary dark:bg-primary/20 flex items-center justify-center border border-primary dark:border-primary group-hover:border-primary transition-colors">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                          {task}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No tasks listed for this role.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Stats / Meta */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Role Overview
                </h4>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Employment Type
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Full-time
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Work Setting
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {experience.location.toLowerCase().includes("remote")
                          ? "Remote"
                          : "On-site"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <h4 className="text-lg font-bold mb-2">Need Changes?</h4>
                <p className="text-white text-sm mb-4">
                  Update role details, add new achievements, or modify timeline.
                </p>
                <Link
                  href={`/admin/experience/update/${params.id}`}
                  className="inline-block w-full py-3 bg-white text-primary text-center font-bold rounded-xl transition-colors"
                >
                  Update Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailsPage;
