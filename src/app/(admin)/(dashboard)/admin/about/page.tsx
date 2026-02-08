import React from 'react';
import AboutForm from './AboutClient'; 
import { getAboutData } from '@/lib/api/admin/about';

export const metadata = {
  title: "Admin | About Management",
};

const AboutPage = async () => {
  const initialData = await getAboutData();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              About Me
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your personal information, bio, and resume.
            </p>
        </div>

        <AboutForm initialData={initialData} />
      </div>
    </div>
  );
};

export default AboutPage;