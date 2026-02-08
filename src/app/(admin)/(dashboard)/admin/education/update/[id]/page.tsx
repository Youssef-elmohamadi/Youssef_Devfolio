import React from 'react';
import { notFound } from 'next/navigation';
import { getEducationsForEdit } from '@/lib/api/admin/education';
import EditEducationForm from './EditEducationForm';

export const metadata = {
  title: "Admin | Edit Education",
};

interface PageProps {
  params: {
    id: string;
  };
}

const UpdateEducationPage = async ({ params }: PageProps) => {
  const educationData = await getEducationsForEdit(params.id);
  console.log(educationData);

  if (!educationData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Edit Education
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Update academic details for {educationData.data.degree}.
            </p>
        </div>

        {/* The Update Form */}
        <EditEducationForm initialData={educationData.data} />
        
      </div>
    </div>
  );
};

export default UpdateEducationPage;