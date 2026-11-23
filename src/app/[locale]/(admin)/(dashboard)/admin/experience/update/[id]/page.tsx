import React from "react";
import { notFound } from "next/navigation";
import { getExperiencesForEdit } from "@/lib/api/admin/experience";
import EditExperienceForm from "./UpdateExperienceClient";
import { unwrapField } from "@/utils/slug";

export const metadata = {
  title: "Admin | Edit Experience",
};

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

const UpdateExperiencePage = async ({ params }: PageProps) => {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const experienceData = await getExperiencesForEdit(id);

  if (!experienceData) {
    return notFound();
  }

  const companyStr = unwrapField(experienceData.company, locale);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            {isAr ? "تعديل الخبرة المهنية" : "Edit Experience"}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {isAr
              ? `تحديث تفاصيل دورك في ${companyStr}.`
              : `Update details about your role at ${companyStr}.`}
          </p>
        </div>

        {/* The Update Form */}
        <EditExperienceForm initialData={experienceData} />
      </div>
    </div>
  );
};

export default UpdateExperiencePage;
