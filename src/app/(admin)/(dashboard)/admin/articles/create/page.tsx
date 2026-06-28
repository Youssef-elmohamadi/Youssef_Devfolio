"use client";

import React, { useState, useEffect } from "react";
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
  FaTag,
  FaHeading,
  FaAlignLeft,
  FaChevronUp,
  FaChevronDown,
  FaTable,
  FaProjectDiagram,
} from "react-icons/fa";
import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(
  () => import("@/app/(site)/components/MermaidDiagram"),
  { ssr: false }
);
import Link from "next/link";
import { createArticleAction } from "@/actions/articles";
import { getCategories } from "@/lib/api/categories";

// --- Types ---
type MediaItem = {
  id: string;
  file: File;
  preview: string;
};

type BlockType = "heading" | "text" | "images" | "video" | "code" | "diagram" | "table";

type TableData = {
  headers: string[];
  rows: string[][];
};

type ContentBlock = {
  id: number;
  type: BlockType;
  // heading block
  title: string;
  // text block
  text: string;
  // code / diagram block
  code: string;
  // images block
  images: MediaItem[];
  layout: "1" | "2" | "3";
  // video block
  videos: MediaItem[];
  // table block
  tableData: TableData;
};

type Category = { id: number; name: string };

// --- Block type config ---
const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: "heading", label: "Heading", icon: <FaHeading />, color: "text-purple-500" },
  { type: "text", label: "Text", icon: <FaAlignLeft />, color: "text-blue-500" },
  { type: "images", label: "Images", icon: <FaImage />, color: "text-green-500" },
  { type: "video", label: "Video", icon: <FaVideo />, color: "text-red-500" },
  { type: "code", label: "Code", icon: <FaCode />, color: "text-yellow-500" },
  { type: "diagram", label: "Diagram", icon: <FaProjectDiagram />, color: "text-cyan-500" },
  { type: "table", label: "Table", icon: <FaTable />, color: "text-orange-500" },
];

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  text: "Text",
  images: "Images",
  video: "Video",
  code: "Code",
  diagram: "Diagram",
  table: "Table",
};

const BLOCK_TYPE_COLORS: Record<BlockType, string> = {
  heading: "border-purple-500/30",
  text: "border-blue-500/30",
  images: "border-green-500/30",
  video: "border-red-500/30",
  code: "border-yellow-500/30",
  diagram: "border-cyan-500/30",
  table: "border-orange-500/30",
};

const BLOCK_TYPE_BADGE_COLORS: Record<BlockType, string> = {
  heading: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  text: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  images: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  video: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  code: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  diagram: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  table: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function CreateArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [lang, setLang] = useState("en");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // 📸 Feature Media
  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [featureVideo, setFeatureVideo] = useState<File | null>(null);
  const [featureVideoPreview, setFeatureVideoPreview] = useState<string | null>(
    null,
  );

  // 🧱 Content Blocks
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [nextId, setNextId] = useState(1);

  // --- Table Helpers ---
  const addTableRow = (blockIndex: number) => {
    const newBlocks = [...contentBlocks];
    const cols = newBlocks[blockIndex].tableData.headers.length || 1;
    newBlocks[blockIndex].tableData.rows.push(Array(cols).fill(""));
    setContentBlocks(newBlocks);
  };

  const removeTableRow = (blockIndex: number, rowIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].tableData.rows.splice(rowIndex, 1);
    setContentBlocks(newBlocks);
  };

  const addTableCol = (blockIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].tableData.headers.push(`Column ${newBlocks[blockIndex].tableData.headers.length + 1}`);
    newBlocks[blockIndex].tableData.rows.forEach((r) => r.push(""));
    setContentBlocks(newBlocks);
  };

  const removeTableCol = (blockIndex: number, colIndex: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].tableData.headers.splice(colIndex, 1);
    newBlocks[blockIndex].tableData.rows.forEach((r) => r.splice(colIndex, 1));
    setContentBlocks(newBlocks);
  };

  const updateTableHeader = (blockIndex: number, colIndex: number, value: string) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].tableData.headers[colIndex] = value;
    setContentBlocks(newBlocks);
  };

  const updateTableCell = (blockIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const newBlocks = [...contentBlocks];
    newBlocks[blockIndex].tableData.rows[rowIndex][colIndex] = value;
    setContentBlocks(newBlocks);
  };

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
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: nextId,
      type,
      title: "",
      text: "",
      code: type === "diagram" ? "graph TD\n    A[Start] --> B[Process]\n    B --> C[End]" : "",
      images: [],
      layout: "1",
      videos: [],
      tableData: {
        headers: ["Column 1", "Column 2", "Column 3"],
        rows: [["Cell", "Cell", "Cell"], ["Cell", "Cell", "Cell"]],
      },
    };
    setContentBlocks([...contentBlocks, newBlock]);
    setNextId(nextId + 1);
  };

  const removeBlock = (index: number) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...contentBlocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setContentBlocks(newBlocks);
  };

  const updateBlockField = (
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

    // 1b. Category
    if (categoryId) formData.append("category_id", categoryId.toString());

    // 2. Tags
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    tagsArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // 3. Content Blocks (polymorphic)
    contentBlocks.forEach((block, blockIndex) => {
      formData.append(`content[${blockIndex}][type]`, block.type);

      if (block.type === "heading") {
        formData.append(`content[${blockIndex}][title]`, block.title);
      } else if (block.type === "text") {
        formData.append(`content[${blockIndex}][text]`, block.text);
      } else if (block.type === "code") {
        formData.append(`content[${blockIndex}][code]`, block.code);
      } else if (block.type === "diagram") {
        // Store mermaid code in the `code` field
        formData.append(`content[${blockIndex}][code]`, block.code);
      } else if (block.type === "table") {
        // Serialize table data as JSON string in `text` field
        formData.append(`content[${blockIndex}][text]`, JSON.stringify(block.tableData));
      } else if (block.type === "images") {
        formData.append(`content[${blockIndex}][layout]`, block.layout);
        block.images.forEach((img, indx) => {
          formData.append(`content_images[${blockIndex}][${indx}]`, img.file);
        });
      } else if (block.type === "video") {
        block.videos.forEach((vid, indx) => {
          formData.append(`content_videos[${blockIndex}][${indx}]`, vid.file);
        });
      }
    });

    try {
      const result = await createArticleAction(formData);

      if (!result.success) {
        let errMsg = result.message;
        if (errMsg === "validation.max.file") {
          errMsg = "One of the uploaded files exceeds the maximum size limit (typically 2MB for images, 5MB for PDFs/videos).";
        } else if (errMsg === "validation.mimes") {
          errMsg = "Invalid file type. Please upload a valid image or video file.";
        }
        setServerError(errMsg);
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

  // --- Render block editor based on type ---
  const renderBlockEditor = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "heading":
        return (
          <input
            type="text"
            value={block.title}
            onChange={(e) => updateBlockField(index, "title", e.target.value)}
            className="w-full bg-transparent border-b-2 border-purple-200 dark:border-purple-800 py-3 text-xl font-bold text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors"
            placeholder="Enter heading text..."
          />
        );

      case "text":
        return (
          <textarea
            value={block.text}
            onChange={(e) => updateBlockField(index, "text", e.target.value)}
            rows={5}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y"
            placeholder="Write your text content here..."
          />
        );

      case "code":
        return (
          <div className="relative">
            <div className="absolute top-3 right-3 text-xs text-gray-500 font-mono bg-gray-800 px-2 py-0.5 rounded">
              CODE
            </div>
            <textarea
              value={block.code}
              onChange={(e) => updateBlockField(index, "code", e.target.value)}
              rows={6}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-4 pt-5 text-sm font-mono text-green-400 focus:border-yellow-500 outline-none transition-colors resize-y"
              placeholder="// Paste your code here..."
            />
          </div>
        );

      case "images":
        return (
          <div className="space-y-4">
            {/* Layout Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Layout:
              </span>
              <div className="flex gap-2">
                {[
                  { value: "1", label: "1 Column", icon: "▮" },
                  { value: "2", label: "2 Columns", icon: "▮▮" },
                  { value: "3", label: "3 Columns", icon: "▮▮▮" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateBlockField(index, "layout", opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      block.layout === opt.value
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="tracking-widest mr-1">{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Previews */}
            {block.images.length > 0 && (
              <div className={`grid gap-4 ${
                block.layout === "3" ? "grid-cols-3" :
                block.layout === "2" ? "grid-cols-2" :
                "grid-cols-1"
              }`}>
                {block.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group/media"
                  >
                    <Image
                      src={img.preview}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index, "images", img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border-2 border-dashed border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 text-sm transition-colors justify-center">
              <FaPlus size={12} />
              <span>Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addBlockMedia(index, "images", e)}
              />
            </label>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            {/* Video Previews */}
            {block.videos.length > 0 && (
              <div className="space-y-3">
                {block.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="relative h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-black group/media"
                  >
                    <video
                      src={vid.preview}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeMediaItem(index, "videos", vid.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/media:opacity-100 transition-opacity"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center gap-2 cursor-pointer px-4 py-3 rounded-lg border-2 border-dashed border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm transition-colors justify-center">
              <FaPlus size={12} />
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
        );

      case "diagram":
        return (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute top-3 right-3 text-xs text-cyan-400 font-mono bg-gray-800 px-2 py-0.5 rounded">
                MERMAID
              </div>
              <textarea
                value={block.code}
                onChange={(e) => updateBlockField(index, "code", e.target.value)}
                rows={6}
                className="w-full bg-[#1e1e1e] border border-cyan-800 rounded-lg p-4 pt-5 text-sm font-mono text-cyan-300 focus:border-cyan-500 outline-none transition-colors resize-y"
                placeholder={`graph TD\n    A[Start] --> B[Process]\n    B --> C[End]`}
              />
            </div>
            {/* Live Preview */}
            {block.code && (
              <div className="rounded-lg border border-cyan-500/20 bg-gray-50 dark:bg-gray-900 p-4 overflow-auto">
                <p className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold mb-3">Preview</p>
                <MermaidDiagram code={block.code} />
              </div>
            )}
            <div className="text-xs text-gray-400 space-y-0.5">
              <p className="font-medium text-gray-500">Mermaid syntax examples:</p>
              <p><code className="text-cyan-400">graph TD</code> – Flowchart</p>
              <p><code className="text-cyan-400">sequenceDiagram</code> – Sequence</p>
              <p><code className="text-cyan-400">pie</code> – Pie Chart</p>
              <p><code className="text-cyan-400">mindmap</code> – Mind Map</p>
            </div>
          </div>
        );

      case "table":
        return (
          <div className="space-y-3">
            {/* Table Editor */}
            <div className="overflow-x-auto rounded-lg border border-orange-200 dark:border-orange-900/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 dark:bg-orange-900/10">
                    {block.tableData.headers.map((header, ci) => (
                      <th key={ci} className="p-1.5 border-b border-r border-orange-200 dark:border-orange-900/40 last:border-r-0">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={header}
                            onChange={(e) => updateTableHeader(index, ci, e.target.value)}
                            className="w-full bg-transparent text-xs font-bold text-orange-700 dark:text-orange-300 outline-none min-w-[60px]"
                            placeholder={`Col ${ci + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeTableCol(index, ci)}
                            className="text-red-400 hover:text-red-600 flex-shrink-0"
                          >
                            <FaTimes size={9} />
                          </button>
                        </div>
                      </th>
                    ))}
                    <th className="p-1.5 w-8">
                      <button
                        type="button"
                        onClick={() => addTableCol(index)}
                        className="text-orange-500 hover:text-orange-700"
                        title="Add column"
                      >
                        <FaPlus size={10} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {block.tableData.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-orange-100 dark:border-orange-900/20 last:border-b-0 hover:bg-orange-50/50 dark:hover:bg-orange-900/5">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-1.5 border-r border-orange-100 dark:border-orange-900/20 last:border-r-0">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => updateTableCell(index, ri, ci, e.target.value)}
                            className="w-full bg-transparent text-xs text-gray-700 dark:text-gray-300 outline-none min-w-[60px]"
                            placeholder="Cell"
                          />
                        </td>
                      ))}
                      <td className="p-1.5 w-8">
                        <button
                          type="button"
                          onClick={() => removeTableRow(index, ri)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTimes size={9} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() => addTableRow(index)}
              className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium"
            >
              <FaPlus size={10} /> Add Row
            </button>
          </div>
        );

      default:
        return null;
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

          {/* Content Block Builder */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FaCode className="text-[#ff6a00]" /> Content Builder
            </h2>

            {/* Rendered Blocks */}
            {contentBlocks.map((block, index) => (
              <div
                key={block.id}
                className={`bg-white dark:bg-[#0a0a0a] border rounded-xl p-5 relative group transition-all ${BLOCK_TYPE_COLORS[block.type]} hover:shadow-md`}
              >
                {/* Block Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${BLOCK_TYPE_BADGE_COLORS[block.type]}`}>
                      {BLOCK_TYPE_LABELS[block.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "down")}
                      disabled={index === contentBlocks.length - 1}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <FaChevronDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Remove block"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                {/* Block Content Editor */}
                {renderBlockEditor(block, index)}
              </div>
            ))}

            {/* Add Block Toolbar */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 hover:border-[#ff6a00]/50 transition-colors">
              <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider font-medium">
                Add Content Block
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() => addBlock(bt.type)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-all hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600`}
                  >
                    <span className={bt.color}>{bt.icon}</span>
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>
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
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                <FaTag className="text-[#ff6a00] text-xs" /> Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#ff6a00]"
              >
                <option value="">— No Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Language */}
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
