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

interface AboutData {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  cv_url: string;
}

const AboutForm = ({ initialData }: { initialData: AboutData | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [pdfPreview, setPdfPreview] = useState<string | null>(
    initialData?.cv_url || null,
  );
  const [formState, setFormState] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    if (!formRef.current) return;

    try {
      const formData = new FormData(formRef.current);
      const result = await pushAboutData(formData);
      console.log("Action Result:", formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        setStatus({ type: "error", message: result.message });
      }
    } catch (error) {
      setStatus({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {status && (
        <div
          className={`fixed top-4 right-4 z-[9000] px-6 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 ${
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
              Edit Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Bio Description
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formState.description}
                  onChange={handleInputChange}
                  placeholder="Tell your story..."
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Media Uploads */}
          <div className="bg-white dark:bg-[#111]  p-6 pb-8 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Media & Attachments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="relative group">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Profile Photo
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
                    name="image"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  CV (PDF)
                </label>
                <div className="w-full h-full min-h-[130px] bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary transition-all relative flex flex-col items-center justify-center cursor-pointer p-6 text-center group">
                  <DocumentTextIcon className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors mb-2" />
                  <span className="text-sm text-gray-500 font-medium group-hover:text-primary transition-colors">
                    Click to upload PDF
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Max size 5MB
                  </span>
                  <input
                    type="file"
                    name="cv"
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
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Right Side: Live Preview */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <EyeIcon className="w-4 h-4" /> Live Preview
            </h3>

            <div className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
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

                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  {formState.title || "Your Job Title"}
                </h1>

                <div className="flex items-center gap-2 text-primary font-medium mb-6 text-sm">
                  <MapPinIcon className="w-4 h-4" />
                  <span>Based in Cairo, Egypt</span>
                </div>

                <div className="prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-6">
                  {formState.description ||
                    "Your description will appear here..."}
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
