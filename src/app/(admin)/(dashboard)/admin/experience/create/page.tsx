import React from 'react';
import CreateExperienceForm from './CreateExperienceForm';

export const metadata = {
  title: "Admin | Add Experience",
};

const CreateExperiencePage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Add Experience
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Showcase your career journey and professional achievements.
            </p>
        </div>

        {/* The Form */}
        <CreateExperienceForm />
        
      </div>
    </div>
  );
};

export default CreateExperiencePage;