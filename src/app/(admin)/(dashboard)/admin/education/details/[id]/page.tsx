import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  CalendarDaysIcon,
  TrophyIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { getEducationsForEdit } from "@/lib/api/admin/education";

export const metadata = {
  title: "Admin | Education Details",
};

interface PageProps {
  params: {
    id: string;
  };
}

const EducationDetailsPage = async ({ params }: PageProps) => {
  const educationRes = await getEducationsForEdit(params.id);
const education = educationRes?.data;

  if (!education) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10 flex flex-col items-center">
      {/* Navigation Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link
          href="/admin/education"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 group-hover:border-indigo-500/50 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Education</span>
        </Link>

        <Link
          href={`/admin/education/update/${params.id}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/10 text-white rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Edit Degree</span>
        </Link>
      </div>

      {/* Main Credential Card */}
      <div className="w-full max-w-4xl relative">
        {/* Background Glow */}
        <div className="absolute top-10 left-10 w-2/3 h-2/3 bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="bg-white dark:bg-[#111] rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl relative">
          {/* Top Banner Decoration */}
          <div className="h-32 bg-gradient-to-r from-primary/70 via-primary/50 to-primary/25 relative">
            <div className="absolute -bottom-12 left-8 md:left-12">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center shadow-xl border-4 border-white dark:border-[#111]">
                <AcademicCapIcon className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-12 px-8 md:px-12">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-2">
                  {education.degree}
                </h1>
                <div className="flex items-center gap-2 text-xl text-gray-500 dark:text-gray-400 font-medium">
                  <BuildingLibraryIcon className="w-6 h-6 text-primary" />
                  <span>{education.university}</span>
                </div>
              </div>

              {/* Grade Badge */}
              {education.grade && (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Grade Achieved
                  </span>
                  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-bold flex items-center gap-2 border border-green-100 dark:border-green-800">
                    <TrophyIcon className="w-5 h-5" />
                    {education.grade}
                  </div>
                </div>
              )}
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-primary">
                  <CalendarDaysIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {education.duration}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-primary">
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Location
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {education.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
              <div className="pl-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" /> Description
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {education.description ||
                    "No additional description provided for this degree."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsPage;
