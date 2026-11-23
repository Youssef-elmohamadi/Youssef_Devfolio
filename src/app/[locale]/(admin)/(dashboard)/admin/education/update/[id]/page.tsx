import React from 'react';
import { notFound } from 'next/navigation';
import { getEducationsForEdit } from '@/lib/api/admin/education';
import EditEducationForm from './EditEducationForm';
import { unwrapField } from '@/utils/slug';

export const metadata = {
  title: "Admin | Edit Education",
};

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

const UpdateEducationPage = async ({ params }: PageProps) => {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const educationData = await getEducationsForEdit(id);

  if (!educationData || !educationData.data) {
    return notFound();
  }

  const degreeStr = unwrapField(educationData.data.degree, locale);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
              {isAr ? "تعديل المؤهل الدراسي" : "Edit Education"}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {isAr
                ? `تحديث التفاصيل الأكاديمية لـ ${degreeStr}.`
                : `Update academic details for ${degreeStr}.`}
            </p>
        </div>

        {/* The Update Form */}
        <EditEducationForm initialData={educationData.data} />
        
      </div>
    </div>
  );
};

export default UpdateEducationPage;
