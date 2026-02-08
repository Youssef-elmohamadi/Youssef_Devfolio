import React from "react";
import CreateSkillForm from "./CreateSkillForm";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export const metadata = {
  title: "Admin | Add Skills",
};

const CreateSkillsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-4 flex gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/articles"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FaArrowLeft className="text-gray-500" />
            </Link>
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Create Skills
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Add new technology stacks and skill sets to your portfolio.
            </p>
          </div>
        </div>

        {/* The Form */}
        <CreateSkillForm />
      </div>
    </div>
  );
};

export default CreateSkillsPage;
