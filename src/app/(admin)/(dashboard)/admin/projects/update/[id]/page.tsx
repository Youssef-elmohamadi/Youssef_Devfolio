import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectForEdit } from '@/lib/api/admin/projects';
import EditProjectForm from './EditProjectForm';

export const metadata = {
  title: "Admin | Edit Project",
};

interface PageProps {
  params: {
    id: string;
  };
}

const UpdateProjectPage = async ({ params }: PageProps) => {
  const projectData = await getProjectForEdit(params.id);

  if (!projectData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Edit Project
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Update details for <span className="text-primary font-bold">{projectData.title}</span>.
            </p>
        </div>

        {/* The Update Form */}
        <EditProjectForm initialData={projectData} />
        
      </div>
    </div>
  );
};

export default UpdateProjectPage;