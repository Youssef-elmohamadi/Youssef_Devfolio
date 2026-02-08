import React from 'react';
import { notFound } from 'next/navigation';
import { getSkillForEdit } from '@/lib/api/admin/skills';
import EditSkillForm from './UpdateSkillClient';

export const metadata = {
  title: "Admin | Edit Skill",
};

interface PageProps {
  params: {
    id: string;
  };
}

const EditSkillPage = async ({ params }: PageProps) => {
  const skillData = await getSkillForEdit(params.id);

//   if (!skillData) {
//     return notFound();
//   }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Edit Skill
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Update your skill set details and technologies.
            </p>
        </div>

        {/* The Update Form */}
        <EditSkillForm initialData={skillData} />
        
      </div>
    </div>
  );
};

export default EditSkillPage;