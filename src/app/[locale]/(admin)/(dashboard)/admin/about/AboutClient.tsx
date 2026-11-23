"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  PhotoIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { pushAboutData } from "@/actions/about";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";
import { useLocale } from "next-intl";

interface AboutData {
  id?: number;
  title: string | Record<string, string>;
  description: string | Record<string, string>;
  image_url: string;
  cv_url: string;
}

function parseInitialTranslatable(val: unknown): { en: string; ar: string } {
  if (!val) return { en: "", ar: "" };
  if (typeof val === "object") {
    const obj = val as Record<string, string>;
    return { en: obj.en || "", ar: obj.ar || "" };
  }
  const str = String(val);
  if (str.trim().startsWith("{") && str.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "object" && parsed !== null) {
        return { en: parsed.en || "", ar: parsed.ar || "" };
      }
    } catch {
      // ignore
    }
  }
  return { en: str, ar: "" };
}

const AboutForm = ({ initialData }: { initialData: AboutData | null }) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Translatable State
  const [title, setTitle] = useState(parseInitialTranslatable(initialData?.title));
  const [description, setDescription] = useState(parseInitialTranslatable(initialData?.description));

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [pdfPreview, setPdfPreview] = useState<string | null>(
    initialData?.cv_url || null,
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Completion states
  const completion = {
    en: Boolean(title.en.trim() && description.en.trim()),
    ar: Boolean(title.ar.trim() && description.ar.trim()),
  };

  const hasErrors = {
    en: Boolean(
      fieldErrors["title.en"] ||
        fieldErrors["title"] ||
        fieldErrors["description.en"] ||
        fieldErrors["description"]
    ),
    ar: Boolean(fieldErrors["title.ar"] || fieldErrors["description.ar"]),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfPreview(url);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    if (!title.en.trim()) errors.title = ["Job Title (English) is required"];
    if (!description.en.trim()) errors.description = ["Bio Description (English) is required"];

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus(null);

    if (!formRef.current) return;

    try {
      const formData = new FormData();
      formData.append("title[en]", title.en.trim());
      if (title.ar.trim()) formData.append("title[ar]", title.ar.trim());
      formData.append("description[en]", description.en.trim());
      if (description.ar.trim()) formData.append("description[ar]", description.ar.trim());

      const imageInput = formRef.current.querySelector('input[name="image_file"]') as HTMLInputElement;
      const imageFile = imageInput?.files?.[0];
      if (imageFile) {
        if (imageFile.size > 2 * 1024 * 1024) { // 2MB limit
          setStatus({
            type: "error",
            message: "Profile photo size must be less than 2MB.",
          });
          setIsLoading(false);
          return;
        }
        formData.append("image_file", imageFile);
      }
      
      const cvInput = formRef.current.querySelector('input[name="cv_file"]') as HTMLInputElement;
      const cvFile = cvInput?.files?.[0];
      if (cvFile) {
        if (cvFile.size > 5 * 1024 * 1024) { // 5MB limit
          setStatus({
            type: "error",
            message: "CV file size must be less than 5MB.",
          });
          setIsLoading(false);
          return;
        }
        formData.append("cv_file", cvFile);
      }

      const result = await pushAboutData(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        let errMsg = result.message;
        if (errMsg === "validation.max.file") {
          errMsg = "One of the files exceeds the allowed size limit (2MB for photos, 5MB for PDFs).";
        } else if (errMsg === "validation.mimes") {
          errMsg = "Invalid file type. Please upload a valid image or PDF document.";
        }
        setStatus({ type: "error", message: errMsg });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const currentTitle = title[activeLang]?.trim() || title.en || "Your Job Title";
  const currentDescription =
    description[activeLang]?.trim() || description.en || "Your description will appear here...";

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {status && (
        <div
          className={`fixed top-4 right-4 z-[100000] px-6 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 ${
            status.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircleIcon className="w-6 h-6" />
          ) : (
            <XCircleIcon className="w-6 h-6" />
          )}
          <span className="font-semibold">{status.message}</span>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
      >
        {/* Left Side: Editor */}
        <div className="space-y-6">
          {/* Text Fields */}
          <div className="bg-white dark:bg-[#111] p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              {isAr ? "تعديل البيانات" : "Edit Details"}
            </h2>

            {/* Language Tabs */}
            <div className="mb-6">
              <LanguageTabs
                activeLang={activeLang}
                onChange={setActiveLang}
                completion={completion}
                hasErrors={hasErrors}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {isAr ? "المسمى الوظيفي" : "Job Title"} ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={title[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setTitle((prev) => ({ ...prev, [activeLang]: e.target.value }));
                    if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: [] }));
                  }}
                  placeholder={activeLang === "ar" ? "مثال: كبير مهندسي الويب (Full Stack)" : "e.g. Senior Full Stack Developer"}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.title[0]}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {isAr ? "النبذة التعريفية" : "Bio Description"} ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={6}
                  value={description[activeLang]}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(e) => {
                    setDescription((prev) => ({ ...prev, [activeLang]: e.target.value }));
                    if (fieldErrors.description) setFieldErrors((prev) => ({ ...prev, description: [] }));
                  }}
                  placeholder={activeLang === "ar" ? "اكتب نبذتك الشخصية وخبراتك هنا..." : "Tell your story..."}
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none leading-relaxed"
                />
                {fieldErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.description[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="bg-white dark:bg-[#111] p-6 pb-8 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              {isAr ? "الوسائط والمرفقات" : "Media & Attachments"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="relative group">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {isAr ? "الصورة الشخصية" : "Profile Photo"}
                </label>
                <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <PhotoIcon className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ArrowUpTrayIcon className="w-8 h-8 text-white" />
                  </div>
                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  {isAr ? "السيرة الذاتية (PDF)" : "CV (PDF)"}
                </label>
                <div className="w-full h-full min-h-[130px] bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all relative flex flex-col items-center justify-center cursor-pointer p-6 text-center group">
                  <DocumentTextIcon className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                  <span className="text-sm text-gray-500 font-medium group-hover:text-primary transition-colors">
                    {isAr ? "انقر لرفع ملف PDF" : "Click to upload PDF"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {isAr ? "الحد الأقصى 5 ميجابايت" : "Max size 5MB"}
                  </span>
                  <input
                    type="file"
                    name="cv_file"
                    accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handlePdfChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {isLoading
              ? isAr
                ? "جاري الحفظ..."
                : "Saving..."
              : isAr
              ? "حفظ التغييرات"
              : "Save Changes"}
          </button>
        </div>

        {/* Right Side: Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <EyeIcon className="w-4 h-4" /> {isAr ? "معاينة مباشرة" : "Live Preview"} ({activeLang.toUpperCase()})
            </h3>

            <div
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              {/* Header Background - Primary Color */}
              <div className="h-28 bg-primary"></div>

              <div className="px-8 pb-8 relative">
                {/* Profile Image Preview */}
                <div className="relative -mt-14 mb-5">
                  <div className="w-28 h-28 rounded-2xl border-4 border-white dark:border-[#111] overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile"
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {currentTitle}
                </h1>

                <div className="flex items-center gap-2 text-primary font-medium mb-6 text-sm">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{activeLang === "ar" ? "مقيم في القاهرة، مصر" : "Based in Cairo, Egypt"}</span>
                </div>

                <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-6">
                  {currentDescription}
                </div>
              </div>

              {/* PDF Viewer Section */}
              {pdfPreview && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-2">
                      <DocumentTextIcon className="w-3 h-3" /> CV Preview
                    </span>
                  </div>
                  {/* Native PDF Viewer via iframe */}
                  <div
                    className="h-[500px] w-full bg-white relative isolate"
                    style={{ colorScheme: "light" }}
                  >
                    <iframe
                      src={`${pdfPreview}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full"
                      title="CV Preview"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutForm;
