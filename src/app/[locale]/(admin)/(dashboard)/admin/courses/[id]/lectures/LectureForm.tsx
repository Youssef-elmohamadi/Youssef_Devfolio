"use client";

import React, { useState, useRef } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaCode,
  FaHeading,
  FaBold,
  FaItalic,
  FaListUl,
  FaProjectDiagram,
  FaSquareRootAlt,
  FaTable,
  FaColumns,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useTheme } from "@/app/context/ThemeContext";
import {
  createLectureAction,
  updateLectureAction,
  uploadCourseAssetAction,
} from "@/actions/courses";
import LectureMarkdownRenderer from "@/app/[locale]/(site)/components/LectureMarkdownRenderer";
import type { LectureDetail } from "@/types/courses";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";
import SlugInput, { generateSlug } from "@/app/[locale]/(admin)/components/form/SlugInput";

interface LectureFormProps {
  courseId: number | string;
  courseSlug?: string;
  initialLecture?: LectureDetail;
  isEdit?: boolean;
}

function parseTranslatableField(val: any): { en: string; ar: string } {
  if (!val) return { en: "", ar: "" };
  if (typeof val === "string") return { en: val, ar: "" };
  if (typeof val === "object") {
    return {
      en: typeof val.en === "string" ? val.en : "",
      ar: typeof val.ar === "string" ? val.ar : "",
    };
  }
  return { en: "", ar: "" };
}

export default function LectureForm({
  courseId,
  courseSlug = "",
  initialLecture,
  isEdit = false,
}: LectureFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("admin.form");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Multilingual states
  const [title, setTitle] = useState(parseTranslatableField(initialLecture?.title));
  const [slug, setSlug] = useState(
    parseTranslatableField(initialLecture?.slugs || initialLecture?.slug)
  );
  const [description, setDescription] = useState(
    parseTranslatableField(initialLecture?.description)
  );
  const [content, setContent] = useState(parseTranslatableField(initialLecture?.content));

  // Common metadata
  const [order, setOrder] = useState(initialLecture?.order || 1);
  const [isPublished, setIsPublished] = useState(initialLecture?.is_published || false);

  const [viewMode, setViewMode] = useState<"write" | "preview" | "split">("split");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Completion indicators
  const completion = {
    en: Boolean(title.en.trim() && content.en.trim()),
    ar: Boolean(title.ar.trim() && content.ar.trim()),
  };

  const hasErrors = {
    en: Boolean(
      errors["title.en"] ||
        errors["title"] ||
        errors["content.en"] ||
        errors["content"] ||
        errors["slug.en"]
    ),
    ar: Boolean(
      errors["title.ar"] || errors["content.ar"] || errors["slug.ar"]
    ),
  };

  // Auto-slug generator
  const handleAutoSlug = (lang: "en" | "ar") => {
    const currentTitle = title[lang];
    if (currentTitle) {
      const generated = generateSlug(currentTitle, lang);
      setSlug((prev) => ({ ...prev, [lang]: generated }));
    }
  };

  const handleTitleChange = (val: string, lang: "en" | "ar") => {
    setTitle((prev) => ({ ...prev, [lang]: val }));
    // Auto-fill slug if empty
    if (!slug[lang].trim()) {
      setSlug((prev) => ({ ...prev, [lang]: generateSlug(val, lang) }));
    }
  };

  // Helper to insert markdown text at current cursor position
  const insertTextAtCursor = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentText = content[activeLang];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentText.substring(start, end) || placeholder;

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    setContent((prev) => ({ ...prev, [activeLang]: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  // Upload image handler
  const handleUploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadCourseAssetAction(formData);
      if (res.success && res.url) {
        const imageMarkdown = `\n![${file.name.replace(/\.[^/.]+$/, "")}](${res.url})\n`;
        insertTextAtCursor(imageMarkdown);
      } else {
        alert(res.message || "Failed to upload image");
      }
    } catch (err: any) {
      alert("Upload failed: " + err?.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Paste image directly from clipboard
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleUploadFile(file);
            break;
          }
        }
      }
    }
  };

  // Drag and drop image onto textarea
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith("image/")) {
        e.preventDefault();
        handleUploadFile(files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    const payload: any = {
      title: {
        en: title.en.trim(),
        ...(title.ar.trim() ? { ar: title.ar.trim() } : {}),
      },
      content: {
        en: content.en.trim(),
        ...(content.ar.trim() ? { ar: content.ar.trim() } : {}),
      },
      description: {
        ...(description.en.trim() ? { en: description.en.trim() } : {}),
        ...(description.ar.trim() ? { ar: description.ar.trim() } : {}),
      },
      order: Number(order) || 1,
      is_published: isPublished,
    };

    if (slug.en.trim() || slug.ar.trim()) {
      payload.slug = {
        ...(slug.en.trim() ? { en: slug.en.trim() } : {}),
        ...(slug.ar.trim() ? { ar: slug.ar.trim() } : {}),
      };
    }

    try {
      const res =
        isEdit && initialLecture
          ? await updateLectureAction(
              courseId,
              initialLecture.id,
              payload,
              courseSlug,
              typeof initialLecture.slug === "string"
                ? initialLecture.slug
                : (initialLecture as any)?.slug?.en
            )
          : await createLectureAction(courseId, payload, courseSlug);

      if (res.success) {
        router.push(`/admin/courses/${courseId}/lectures`);
        router.refresh();
      } else {
        if (res.errors) setErrors(res.errors);
        setGeneralError(res.message);
      }
    } catch (err: any) {
      setGeneralError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/admin/courses/${courseId}/lectures`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
        >
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <FaArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          </div>
          <span>{isAr ? "الرجوع للمحاضرات" : "Back to Lectures"}</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
        >
          <FaSave className="w-4 h-4" />
          <span>
            {isLoading
              ? t("common.saving")
              : isEdit
              ? t("common.update")
              : t("common.save")}
          </span>
        </button>
      </div>

      {generalError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
          {generalError}
        </div>
      )}

      {/* Language Tabs */}
      <LanguageTabs
        activeLang={activeLang}
        onChange={setActiveLang}
        completion={completion}
        hasErrors={hasErrors}
      />

      {/* Meta settings box */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Title */}
          <div className="md:col-span-6 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "عنوان المحاضرة" : "Lecture Title"} ({activeLang.toUpperCase()}){" "}
              {activeLang === "en" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={activeLang === "en"}
              value={title[activeLang]}
              onChange={(e) => handleTitleChange(e.target.value, activeLang)}
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              placeholder={
                activeLang === "ar"
                  ? "مثال: مقدمة إلى نمط CQRS ومكتبة MediatR"
                  : "e.g. Introduction to CQRS with MediatR"
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {(errors[`title.${activeLang}`] || (activeLang === "en" && errors.title)) && (
              <p className="text-xs text-red-500">
                {errors[`title.${activeLang}`]?.[0] || errors.title?.[0]}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="md:col-span-3 space-y-1">
            <SlugInput
              value={slug[activeLang]}
              onChange={(val) => setSlug((prev) => ({ ...prev, [activeLang]: val }))}
              lang={activeLang}
              onAutoGenerate={() => handleAutoSlug(activeLang)}
              error={errors[`slug.${activeLang}`]?.[0] || (activeLang === "en" ? errors.slug?.[0] : undefined)}
            />
          </div>

          {/* Order */}
          <div className="md:col-span-1 space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "الترتيب" : "Order"}
            </label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Publish Toggle */}
          <div className="md:col-span-2 flex items-center pt-5">
            <label className="relative inline-flex items-center cursor-pointer gap-2.5">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {isAr ? "منشور" : "Published"}
              </span>
            </label>
          </div>
        </div>

        {/* Short description */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            {isAr ? "ملخص قصير / عنوان فرعي" : "Short Summary / Subtitle"} ({activeLang.toUpperCase()})
          </label>
          <input
            type="text"
            value={description[activeLang]}
            onChange={(e) =>
              setDescription((prev) => ({ ...prev, [activeLang]: e.target.value }))
            }
            dir={activeLang === "ar" ? "rtl" : "ltr"}
            placeholder={
              activeLang === "ar"
                ? "ملخص سريع لأهداف ومخرجات هذه المحاضرة..."
                : "Brief overview of the lecture goals..."
            }
            className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* ── Markdown Editor with Live Preview Toolbar ─────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-800 text-xs">
          {/* Formatting Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertTextAtCursor("## ", "", "Heading 2")}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="Heading (##)"
            >
              <FaHeading className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("**", "**", "bold text")}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="Bold (**text**)"
            >
              <FaBold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("*", "*", "italic text")}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="Italic (*text*)"
            >
              <FaItalic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n- ", "", "List item")}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="Unordered List"
            >
              <FaListUl className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

            <button
              type="button"
              onClick={() =>
                insertTextAtCursor(
                  "\n```typescript\n",
                  "\n```\n",
                  "// Code snippet here\nconsole.log('Hello');"
                )
              }
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono text-[11px] cursor-pointer"
              title="Code Block"
            >
              <FaCode className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertTextAtCursor(
                  "\n```mermaid\nflowchart TD\n  A[Start] --> B[Process]\n  B --> C[Finish]\n",
                  "```\n"
                )
              }
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-cyan-600 dark:text-cyan-400 cursor-pointer"
              title="Mermaid Diagram"
            >
              <FaProjectDiagram className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n$$\n\\text{Throughput} = \\frac{N}{T}\n", "$$\n")}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-amber-600 dark:text-amber-400 font-mono cursor-pointer"
              title="KaTeX Display Math"
            >
              <FaSquareRootAlt className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertTextAtCursor(
                  "\n| Feature | Option A | Option B |\n| :--- | :--- | :--- |\n| Speed | Fast | Moderate |\n"
                )
              }
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-pointer"
              title="Markdown Table"
            >
              <FaTable className="w-3.5 h-3.5" />
            </button>

            <span className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-1" />

            {/* Upload Image Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUploadFile(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 font-semibold cursor-pointer"
              title={
                isAr
                  ? "رفع صورة أو سحبها وإفلاتها داخل المحرر"
                  : "Upload image or drag & drop onto editor"
              }
            >
              <FaImage className="w-3.5 h-3.5" />
              <span>
                {isUploading
                  ? isAr
                    ? "جاري الرفع..."
                    : "Uploading..."
                  : isAr
                  ? "إدراج صورة"
                  : "Insert Image"}
              </span>
            </button>
          </div>

          {/* Right Controls: Fast Lang Toggle + View Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Quick Lang Switcher in Editor */}
            <div className="flex items-center gap-1 bg-gray-200/80 dark:bg-gray-700/80 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeLang === "en"
                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                EN {content.en.trim() ? "✓" : ""}
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("ar")}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeLang === "ar"
                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                AR {content.ar.trim() ? "✓" : ""}
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-200/80 dark:bg-gray-700/80 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("write")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === "write"
                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FaEdit className="w-3 h-3" />
                  <span>{isAr ? "كتابة" : "Write"}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`hidden md:block px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === "split"
                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FaColumns className="w-3 h-3" />
                  <span>{isAr ? "عرض منقسم" : "Split View"}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FaEye className="w-3 h-3" />
                  <span>{isAr ? "معاينة" : "Preview"}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Body */}
        <div
          className={`grid ${
            viewMode === "split"
              ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x rtl:md:divide-x-reverse divide-gray-200 dark:divide-gray-800"
              : "grid-cols-1"
          }`}
        >
          {/* Write Textarea */}
          {(viewMode === "write" || viewMode === "split") && (
            <div className="p-4 flex flex-col">
              <div className="text-[11px] text-gray-400 mb-2 flex items-center justify-between">
                <span>
                  Markdown Editor ({activeLang.toUpperCase()}) — Paste or drop images directly
                </span>
                <span>
                  {content[activeLang].split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                ref={textareaRef}
                required={activeLang === "en"}
                rows={24}
                value={content[activeLang]}
                onChange={(e) =>
                  setContent((prev) => ({ ...prev, [activeLang]: e.target.value }))
                }
                dir={activeLang === "ar" ? "rtl" : "ltr"}
                onPaste={handlePaste}
                onDrop={handleDrop}
                placeholder={
                  activeLang === "ar"
                    ? "اكتب محتوى المحاضرة هنا بلغة ماركداون... استخدم # للعناوين، و ```mermaid للمخططات، و $$ للمعادلات الرياضية."
                    : "Write your lecture content in Markdown here... Use # for titles, ```mermaid for diagrams, and $$ for KaTeX equations."
                }
                className="w-full flex-1 p-3 rounded-xl font-mono text-sm leading-relaxed bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none resize-y"
              />
              {(errors[`content.${activeLang}`] ||
                (activeLang === "en" && errors.content)) && (
                <p className="text-xs text-red-500 mt-2 font-medium">
                  {errors[`content.${activeLang}`]?.[0] || errors.content?.[0]}
                </p>
              )}
            </div>
          )}

          {/* Live Preview Panel */}
          {(viewMode === "preview" || viewMode === "split") && (
            <div
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              className="p-6 overflow-y-auto max-h-[650px] bg-gray-50/50 dark:bg-gray-950/40"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-4 pb-2 border-b border-gray-200 dark:border-gray-800 flex items-center gap-1.5">
                <FaEye className="w-3 h-3" />
                <span>
                  {activeLang === "ar"
                    ? "معاينة مباشرة باللغة العربية"
                    : "Live Rendered Preview (EN)"}
                </span>
              </div>
              {content[activeLang].trim() ? (
                <article className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                  <LectureMarkdownRenderer
                    content={content[activeLang]}
                    isDark={isDark}
                  />
                </article>
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">
                  {activeLang === "ar"
                    ? "لا يوجد محتوى للمعاينة حالياً. ابدأ بكتابة الماركداون لرؤية المخرجات مباشرة."
                    : "Nothing to preview yet. Start typing markdown to see live output."}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
