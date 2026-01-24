"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaImage,
  FaCode,
  FaArrowLeft,
  FaVideo,
  FaTimes,
  FaExclamationCircle,
} from "react-icons/fa";
import Link from "next/link";
import { createArticleAction } from "@/../../actions/articles"; // Import the Server Action

// --- Types ---
type MediaItem = {
  id: string;
  file: File;
  preview: string;
};

type ContentBlock = {
  id: number;
  title: string;
  text: string;
  code: string;
  images: MediaItem[];
  videos: MediaItem[];
};

export default function CreateArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null); // Global error state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [lang, setLang] = useState("en");
  const [tags, setTags] = useState("");

  // 📸 Feature Media
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [featureVideo, setFeatureVideo] = useState<File | null>(null);
  const [featureVideoPreview, setFeatureVideoPreview] = useState<string | null>(
    null,
  );

  // 🧱 Content Blocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: 1,
      title: "",
      text: "",
      code: "",
      images: [],
      videos: [],
    },
  ]);

  // --- Handlers: Feature Media ---
  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeatureImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFeatureVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeatureVideo(file);
      setFeatureVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeFeatureVideo = () => {
    setFeatureVideo(null);
    setFeatureVideoPreview(null);
  };

  // --- Handlers: Blocks ---
  const addBlock = () => {
    const newId =
      contentBlocks.length > 0
        ? contentBlocks[contentBlocks.length - 1].id + 1
        : 1;
    setContentBlocks([
      ...contentBlocks,
      { id: newId, title: "", text: "", code: "", images: [], videos: [] },
    ]);
  };

  const removeBlock = (index: number) => {
    const newBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(newBlocks);
  };

  const updateBlockText = (
    index: number,
    field: keyof ContentBlock,
    value: string,
  ) => {
    const newBlocks = [...contentBlocks];
    // @ts-ignore
    newBlocks[index][field] = value;
    setContentBlocks(newBlocks);
  };

  const addBlockMedia = (
    index: number,
    type: "images" | "videos",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newBlocks = [...contentBlocks];
    Array.from(files).forEach((file) => {
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        file: file,
        preview: URL.createObjectURL(file),
      };
      newBlocks[index][type].push(newItem);
    });

    setContentBlocks(newBlocks);
    e.target.value = "";
  };

  const removeMediaItem = (
    blockIndex: number,
    type: "images" | "videos",
    itemId: string,
  ) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex][type] = newBlocks[blockIndex][type].filter(
      (item) => item.id !== itemId,
    );
    setContentBlocks(newBlocks);
  };

  console.log(
    "Submitting FormData:",
    title,
    excerpt,
    lang,
    tags,
    contentBlocks,
  );
  // --- Submit Logic (Using Server Action) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("lang", lang);

    // 1. Feature Media
    if (featureImage) formData.append("feature_image", featureImage);
    if (featureVideo) formData.append("feature_video", featureVideo);

    // 2. Tags
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    tagsArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // 3. Content Blocks
    contentBlocks.forEach((block, blockIndex) => {
      formData.append(`content[${blockIndex}][title]`, block.title);
      formData.append(`content[${blockIndex}][text]`, block.text);
      if (block.code)
        formData.append(`content[${blockIndex}][code]`, block.code);

      
      block.images.forEach((img, indx) => {
        formData.append(`content_images[${blockIndex}][${indx}]`, img.file);
      });

      // Videos
      block.videos.forEach((vid, indx) => {
        formData.append(`content_videos[${blockIndex}][${indx}]`, vid.file);
      });
    });

    console.log("Submitting FormData:", formData);
    try {
      // 🔥 Call Server Action
      const result = await createArticleAction(formData);

      if (!result.success) {
        setServerError(result.message);
        // Scroll to top to see error
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/articles");
      }
    } catch (error) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Article
            </h1>
            <p className="text-sm text-gray-500">
              Craft a new masterpiece for the forge.
            </p>
          </div>
        </div>
      </div>

      {/* 🚨 Error Display Block */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 flex items-start gap-3">
          <FaExclamationCircle className="text-red-500 mt-0.5" />
          <div className="text-sm text-red-600 dark:text-red-400 font-medium">
            {serverError}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* === Left Column: Main Content === */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00] outline-none"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00] outline-none"
              />
            </div>
          </div>

          {/* Blocks Builder */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaCode className="text-[#ff6a00]" /> Content Sections
            </h2>

            {contentBlocks.map((block, index) => (
              <div
                key={block.id}
                className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 relative group hover:border-[#ff6a00]/30 transition-colors"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Section {index + 1}
                  </span>
                  {contentBlocks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) =>
                      updateBlockText(index, "title", e.target.value)
                    }
                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-2 text-lg font-bold text-gray-900 dark:text-white focus:border-[#ff6a00] outline-none"
                    placeholder="Section Title"
                  />
                  <textarea
                    value={block.text}
                    onChange={(e) =>
                      updateBlockText(index, "text", e.target.value)
                    }
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-gray-900 dark:text-gray-300 focus:border-[#ff6a00] outline-none"
                    placeholder="Paragraph content..."
                  />

                  <div className="relative">
                    <div className="absolute top-3 right-3 text-xs text-gray-500 font-mono">
                      CODE
                    </div>
                    <textarea
                      value={block.code}
                      onChange={(e) =>
                        updateBlockText(index, "code", e.target.value)
                      }
                      rows={3}
                      className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 focus:border-[#ff6a00] outline-none"
                      placeholder="// Optional code..."
                    />
                  </div>

                  {/* Block Media Gallery */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    {(block.images.length > 0 || block.videos.length > 0) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {block.images.map((img) => (
                          <div
                            key={img.id}
                            className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group/media"
                          >
                            <Image
                              src={img.preview}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeMediaItem(index, "images", img.id)
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                        {block.videos.map((vid) => (
                          <div
                            key={vid.id}
                            className="relative h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black group/media"
                          >
                            <video
                              src={vid.preview}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/50">
                              <FaVideo />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                removeMediaItem(index, "videos", vid.id)
                              }
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-auto"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-blue-500/30">
                        <FaImage className="text-blue-500" />
                        <span>Add Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => addBlockMedia(index, "images", e)}
                        />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm transition-colors border border-transparent hover:border-red-500/30">
                        <FaVideo className="text-red-500" />
                        <span>Add Videos</span>
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => addBlockMedia(index, "videos", e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addBlock}
              className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-[#ff6a00] hover:border-[#ff6a00] hover:bg-[#ff6a00]/5 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <FaPlus /> Add New Section
            </button>
          </div>
        </div>

        {/* === Right Column: Sidebar === */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              Publish
            </h3>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ff6a00] hover:bg-[#e65f00] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <FaSave /> Publish Article
                </>
              )}
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
              >
                <option value="en">English (en)</option>
                <option value="ar">Arabic (ar)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
                placeholder="React, Frontend"
              />
              <p className="text-xs text-gray-500 mt-1">Comma separated</p>
            </div>
          </div>

          {/* Feature Image */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feature Image
            </label>
            <div className="relative w-full h-48 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-[#ff6a00] transition-colors cursor-pointer group">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-[#ff6a00]">
                  <FaImage className="text-3xl mb-2" />
                  <span className="text-xs">Upload Image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFeatureImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Feature Video */}
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feature Video
            </label>

            {featureVideoPreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black border border-gray-800">
                <video
                  src={featureVideoPreview}
                  controls
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeFeatureVideo}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md hover:bg-red-700 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-red-500 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center text-gray-400 group-hover:text-red-500">
                  <FaVideo className="text-3xl mb-2" />
                  <span className="text-xs">Upload Video</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFeatureVideoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
