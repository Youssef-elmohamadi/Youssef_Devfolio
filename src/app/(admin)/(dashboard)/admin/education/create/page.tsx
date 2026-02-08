import React from 'react';
import CreateEducationForm from './Createeducation';

export const metadata = {
  title: "Admin | Add Education",
};

const CreateEducationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Add Education
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              List your academic background, degrees, and certifications.
            </p>
        </div>

        {/* The Form */}
        <CreateEducationForm />
        
      </div>
    </div>
  );
};

export default CreateEducationPage;