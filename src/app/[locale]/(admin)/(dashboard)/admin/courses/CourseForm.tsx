"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaTimes,
  FaTag,
  FaPlus,
} from "react-icons/fa";
import { createCourseAction, updateCourseAction } from "@/actions/courses";
import type { CourseDetail, CourseLevel, CourseStatus } from "@/types/courses";
import LanguageTabs, { SupportedAdminLocale } from "@/app/[locale]/(admin)/components/form/LanguageTabs";
import SlugInput, { generateSlug } from "@/app/[locale]/(admin)/components/form/SlugInput";

interface CourseFormProps {
  initialCourse?: CourseDetail;
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

function normalizeTagString(raw: any): string {
  if (!raw) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    if (typeof raw.name === "string") return raw.name;
    if (typeof raw.name === "object" && raw.name !== null) {
      return raw.name.en || raw.name.ar || "";
    }
    if (typeof raw.en === "string" || typeof raw.ar === "string") {
      return raw.en || raw.ar || "";
    }
  }
  return String(raw || "");
}

export default function CourseForm({ initialCourse, isEdit = false }: CourseFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("admin.form");

  const [activeLang, setActiveLang] = useState<SupportedAdminLocale>("en");

  // Multilingual states
  const [title, setTitle] = useState(parseTranslatableField(initialCourse?.title));
  const [slug, setSlug] = useState(
    parseTranslatableField(initialCourse?.slugs || initialCourse?.slug)
  );
  const [description, setDescription] = useState(
    parseTranslatableField(initialCourse?.description)
  );
  const [subject, setSubject] = useState(parseTranslatableField(initialCourse?.subject));

  // Common metadata
  const [level, setLevel] = useState<CourseLevel>(initialCourse?.level || "beginner");
  const [status, setStatus] = useState<CourseStatus>(initialCourse?.status || "ongoing");
  const [startedAt, setStartedAt] = useState(
    initialCourse?.started_at ? initialCourse.started_at.split("T")[0] : ""
  );
  const [isPublished, setIsPublished] = useState(initialCourse?.is_published || false);

  // Tags
  const [tags, setTags] = useState<string[]>(
    initialCourse?.tags
      ? initialCourse.tags
          .map(normalizeTagString)
          .filter(Boolean)
      : []
  );
  const [tagInput, setTagInput] = useState("");

  // Cover Image
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialCourse?.cover_image || null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Completion & Error states
  const completion = {
    en: Boolean(title.en.trim() && description.en.trim() && subject.en.trim()),
    ar: Boolean(title.ar.trim() && description.ar.trim() && subject.ar.trim()),
  };

  const hasErrors = {
    en: Boolean(
      errors["title.en"] ||
        errors["title"] ||
        errors["description.en"] ||
        errors["subject.en"] ||
        errors["slug.en"]
    ),
    ar: Boolean(
      errors["title.ar"] ||
        errors["description.ar"] ||
        errors["subject.ar"] ||
        errors["slug.ar"]
    ),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    const formData = new FormData();
    formData.append("title[en]", title.en.trim());
    if (title.ar.trim()) {
      formData.append("title[ar]", title.ar.trim());
    }

    if (slug.en.trim()) {
      formData.append("slug[en]", slug.en.trim());
    }
    if (slug.ar.trim()) {
      formData.append("slug[ar]", slug.ar.trim());
    }

    formData.append("description[en]", description.en.trim());
    if (description.ar.trim()) {
      formData.append("description[ar]", description.ar.trim());
    }

    formData.append("subject[en]", subject.en.trim());
    if (subject.ar.trim()) {
      formData.append("subject[ar]", subject.ar.trim());
    }

    formData.append("level", level);
    formData.append("status", status);
    if (startedAt) formData.append("started_at", startedAt);
    formData.append("is_published", isPublished ? "1" : "0");

    if (coverFile) {
      formData.append("cover_image", coverFile);
    }

    tags.forEach((t, idx) => {
      formData.append(`tags[${idx}]`, t);
    });

    try {
      const res =
        isEdit && initialCourse
          ? await updateCourseAction(
              initialCourse.id,
              formData,
              typeof initialCourse.slug === "string"
                ? initialCourse.slug
                : (initialCourse as any)?.slug?.en
            )
          : await createCourseAction(formData);

      if (res.success) {
        router.push("/admin/courses");
        router.refresh();
      } else {
        if (res.errors) {
          setErrors(res.errors);
        }
        setGeneralError(res.message);
      }
    } catch (err: any) {
      setGeneralError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
        >
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <FaArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          </div>
          <span>{t("common.back")}</span>
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

      {/* Main Form Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit
              ? isAr
                ? "تعديل الكورس"
                : "Edit Course"
              : isAr
              ? "إنشاء كورس جديد"
              : "Create New Course"}
          </h2>
        </div>

        {/* Language Tabs */}
        <LanguageTabs
          activeLang={activeLang}
          onChange={setActiveLang}
          completion={completion}
          hasErrors={hasErrors}
        />

        {/* Translatable Fields */}
        <div className="space-y-6 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "عنوان الكورس" : "Course Title"} ({activeLang.toUpperCase()}){" "}
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
                  ? "مثال: دورة رياكت 19 المتقدمة والمعمارية النظيفة"
                  : "e.g. Advanced React 19 & Clean Architecture"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {(errors[`title.${activeLang}`] || (activeLang === "en" && errors.title)) && (
              <p className="text-xs text-red-500 font-medium">
                {errors[`title.${activeLang}`]?.[0] || errors.title?.[0]}
              </p>
            )}
          </div>

          {/* Slug Input */}
          <SlugInput
            value={slug[activeLang]}
            onChange={(val) => setSlug((prev) => ({ ...prev, [activeLang]: val }))}
            lang={activeLang}
            onAutoGenerate={() => handleAutoSlug(activeLang)}
            error={errors[`slug.${activeLang}`]?.[0] || (activeLang === "en" ? errors.slug?.[0] : undefined)}
          />

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "الموضوع / التصنيف" : "Subject"} ({activeLang.toUpperCase()}){" "}
              {activeLang === "en" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              required={activeLang === "en"}
              value={subject[activeLang]}
              onChange={(e) =>
                setSubject((prev) => ({ ...prev, [activeLang]: e.target.value }))
              }
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              placeholder={
                activeLang === "ar"
                  ? "مثال: دوت نت، رياكت، هندسة البرمجيات"
                  : "e.g. .NET Core, React, DevOps"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {(errors[`subject.${activeLang}`] || (activeLang === "en" && errors.subject)) && (
              <p className="text-xs text-red-500 font-medium">
                {errors[`subject.${activeLang}`]?.[0] || errors.subject?.[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "الوصف" : "Description"} ({activeLang.toUpperCase()}){" "}
              {activeLang === "en" && <span className="text-red-500">*</span>}
            </label>
            <textarea
              required={activeLang === "en"}
              rows={4}
              value={description[activeLang]}
              onChange={(e) =>
                setDescription((prev) => ({ ...prev, [activeLang]: e.target.value }))
              }
              dir={activeLang === "ar" ? "rtl" : "ltr"}
              placeholder={
                activeLang === "ar"
                  ? "قدم وصفاً شاملاً ومفصلاً لما سيتعلمه الطلاب في هذه الدورة..."
                  : "Provide a comprehensive summary of what students will learn..."
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            {(errors[`description.${activeLang}`] ||
              (activeLang === "en" && errors.description)) && (
              <p className="text-xs text-red-500 font-medium">
                {errors[`description.${activeLang}`]?.[0] || errors.description?.[0]}
              </p>
            )}
          </div>
        </div>

        {/* Global Metadata (Language-agnostic) */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            {isAr ? "إعدادات الكورس والوسائط" : "Course Settings & Media"}
          </h3>

          {/* Level, Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {isAr ? "المستوى *" : "Level *"}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="beginner">{isAr ? "مبتدئ" : "Beginner"}</option>
                <option value="intermediate">{isAr ? "متوسط" : "Intermediate"}</option>
                <option value="advanced">{isAr ? "متقدم" : "Advanced"}</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                {isAr ? "الحالة *" : "Status *"}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="ongoing">{isAr ? "قيد الإنشاء" : "Ongoing"}</option>
                <option value="completed">{isAr ? "مكتمل" : "Completed"}</option>
              </select>
            </div>
          </div>

          {/* Started At */}
          <div className="space-y-1.5 max-w-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "تاريخ البدء" : "Started At Date"}
            </label>
            <input
              type="date"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {isAr ? "صورة الغلاف" : "Cover Image"}
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {coverPreview && (
                <div className="relative w-36 h-24 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                  <Image src={coverPreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-primary bg-gray-50 dark:bg-gray-800/40 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors">
                <FaImage className="text-primary w-4 h-4" />
                <span>{isAr ? "اختيار صورة الغلاف" : "Choose Cover Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.cover_image && (
              <p className="text-xs text-red-500 font-medium">
                {errors.cover_image[0]}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <FaTag className="w-3 h-3 text-primary" />
              <span>{isAr ? "وسوم الكورس" : "Course Tags"}</span>
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={
                  isAr
                    ? "اكتب الوسم ثم اضغط Enter..."
                    : "Type tag name and press Enter..."
                }
                className="flex-1 px-3 py-2 text-sm rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-bold hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                {isAr ? "إضافة" : "Add"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((t) => {
                const tagLabel = typeof t === "string" ? t : normalizeTagString(t);
                return (
                  <span
                    key={tagLabel}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>#{tagLabel}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tagLabel)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {isAr ? "نشر الكورس مباشرة للجمهور" : "Publish Course Immediately"}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
