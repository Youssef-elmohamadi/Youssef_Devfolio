import React from "react";
import SettingsForm from "./SettingsClient";
import { getProfileData, getSocialLinks, getSupportedPlatforms } from "@/lib/api/admin/profile";

export const metadata = {
  title: "Admin | Profile Settings",
};

const SettingsPage = async () => {
  const initialData = await getProfileData();
  const socialLinks = await getSocialLinks();
  const supportedPlatforms = await getSupportedPlatforms();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your personal name, main profile image, landing bio, and social media links.
          </p>
        </div>

        <SettingsForm 
          initialData={initialData} 
          socialLinks={socialLinks} 
          supportedPlatforms={supportedPlatforms} 
        />
      </div>
    </div>
  );
};

export default SettingsPage;
