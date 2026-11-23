import React from "react";
import { notFound } from "next/navigation";
import { Link } from '@/i18n/routing';
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { getExperiencesForEdit } from "@/lib/api/admin/experience";
import { unwrapField } from "@/utils/slug";

export const metadata = {
  title: "Admin | Experience Details",
};

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

const ExperienceDetailsPage = async ({ params }: PageProps) => {
  const { id, locale } = await params;
  const experience = await getExperiencesForEdit(id);

  if (!experience) {
    return notFound();
  }

  const jobTitleStr = unwrapField(experience.job_title, locale);
  const companyStr = unwrapField(experience.company, locale);
  const locationStr = unwrapField(experience.location, locale);
  const durationStr = unwrapField(experience.duration, locale);

  const rawTasks = experience.tasks;
  const tasksList: string[] = Array.isArray(rawTasks)
    ? rawTasks
    : (rawTasks && typeof rawTasks === "object"
        ? (rawTasks[locale] || rawTasks.en || [])
        : []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10 flex flex-col items-center">
      {/* Navigation Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link
          href="/admin/experience"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-primary/50 transition-colors rtl:rotate-180">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Experiences</span>
        </Link>

        <Link
          href={`/admin/experience/update/${id}`}
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                  {jobTitleStr}
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mt-1">
                  at{" "}
                  <span className="text-primary dark:text-primary font-bold">
                    {companyStr}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                  {durationStr}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  {locationStr}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-primary" />
                Key Responsibilities & Achievements
              </h3>

              {tasksList.length > 0 ? (
                <div className="space-y-4">
                  {tasksList.map((task: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-gray-800/80 hover:border-primary/20 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0"></span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No tasks listed for this experience.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetailsPage;
