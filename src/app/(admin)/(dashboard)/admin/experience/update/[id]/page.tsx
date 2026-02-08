import React from "react";
import { notFound } from "next/navigation";
import { getExperiencesForEdit } from "@/lib/api/admin/experience";
import EditExperienceForm from "./UpdateExperienceClient";


export const metadata = {
  title: "Admin | Edit Experience",
};

interface PageProps {
  params: {
    id: string;
  };
}

const UpdateExperiencePage = async ({ params }: PageProps) => {
  const experienceData = await getExperiencesForEdit(params.id);

  if (!experienceData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Edit Experience
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Update details about your role at {experienceData.company}.
          </p>
        </div>

        {/* The Update Form */}
        <EditExperienceForm initialData={experienceData} />
      </div>
    </div>
  );
};

export default UpdateExperiencePage;
