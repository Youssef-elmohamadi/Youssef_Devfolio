"use client";

import React, { useState, useTransition } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaTag,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { unwrapField } from "@/utils/slug";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";

type Category = {
  id: number;
  name: string | Record<string, string>;
  slug?: string | Record<string, string>;
};

type Toast = { type: "success" | "error"; message: string };

export default function CategoriesClient({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Toast notification
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createLang, setCreateLang] = useState<"en" | "ar">("en");
  const [newName, setNewName] = useState({ en: "", ar: "" });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLang, setEditLang] = useState<"en" | "ar">("en");
  const [editName, setEditName] = useState({ en: "", ar: "" });

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- Create ---
  const handleCreate = () => {
    if (!newName.en.trim() && !newName.ar.trim()) return;
    const formData = new FormData();
    formData.append("name[en]", newName.en.trim());
    if (newName.ar.trim()) {
      formData.append("name[ar]", newName.ar.trim());
    }

    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result.success) {
        setCategories((prev) => [
          ...prev,
          { id: Date.now(), name: { ...newName } },
        ]);
        setNewName({ en: "", ar: "" });
        setShowCreateForm(false);
        showToast("success", isAr ? "تم إنشاء التصنيف بنجاح!" : "Category created successfully!");
      } else {
        showToast("error", result.message);
      }
    });
  };

  // --- Edit ---
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    if (typeof cat.name === "object") {
      setEditName({
        en: (cat.name as any).en || "",
        ar: (cat.name as any).ar || "",
      });
    } else {
      setEditName({ en: cat.name || "", ar: "" });
    }
  };

  const handleUpdate = (id: number) => {
    if (!editName.en.trim() && !editName.ar.trim()) return;
    const formData = new FormData();
    formData.append("name[en]", editName.en.trim());
    if (editName.ar.trim()) {
      formData.append("name[ar]", editName.ar.trim());
    }
    formData.append("_method", "PUT");

    startTransition(async () => {
      const result = await updateCategoryAction(id, formData);
      if (result.success) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, name: { ...editName } } : c
          )
        );
        setEditingId(null);
        showToast("success", isAr ? "تم تحديث التصنيف بنجاح!" : "Category updated!");
      } else {
        showToast("error", result.message);
      }
    });
  };

  // --- Delete ---
  const handleDelete = (id: number) => {
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setDeletingId(null);
        showToast("success", isAr ? "تم حذف التصنيف بنجاح!" : "Category deleted!");
      } else {
        showToast("error", result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 end-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm text-white font-medium ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Form Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreateForm((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium text-sm active:scale-95 cursor-pointer"
        >
          {showCreateForm ? <FaTimes /> : <FaPlus />}
          {showCreateForm ? (isAr ? "إلغاء" : "Cancel") : (isAr ? "تصنيف جديد" : "New Category")}
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-[#0a0a0a] border border-dashed border-[#ff6a00]/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaTag className="text-[#ff6a00]" /> {isAr ? "تصنيف جديد" : "New Category"}
                </h3>
                {/* Language Switcher Tabs */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCreateLang("en")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      createLang === "en"
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    English (EN) {newName.en.trim() ? "✓" : ""}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateLang("ar")}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      createLang === "ar"
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    العربية (AR) {newName.ar.trim() ? "✓" : ""}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newName[createLang]}
                  onChange={(e) =>
                    setNewName((prev) => ({
                      ...prev,
                      [createLang]: e.target.value,
                    }))
                  }
                  dir={createLang === "ar" ? "rtl" : "ltr"}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder={
                    createLang === "ar"
                      ? "اسم التصنيف بالعربية (مثال: جافاسكريبت)"
                      : "Category name in English (e.g. JavaScript)"
                  }
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={handleCreate}
                  disabled={isPending || (!newName.en.trim() && !newName.ar.trim())}
                  className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer"
                >
                  <FaSave /> {isAr ? "حفظ" : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Table */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FaTag className="text-5xl mb-4 opacity-30" />
            <p className="text-lg font-medium">{isAr ? "لا توجد تصنيفات حتى الآن" : "No categories yet"}</p>
            <p className="text-sm mt-1 opacity-70">
              {isAr
                ? 'اضغط على "تصنيف جديد" لإنشاء تصنيفك الأول.'
                : 'Click "New Category" to create your first one.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                <th className="text-start px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="text-start px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {isAr ? "الاسم" : "Name"}
                </th>
                <th className="text-start px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {isAr ? "الرابط اللطيف" : "Slug"}
                </th>
                <th className="text-end px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {isAr ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat, i) => {
                const displayName = unwrapField(cat.name, locale);
                const displaySlug = unwrapField(cat.slug, locale) || displayName.toLowerCase().replace(/\s+/g, "-");

                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditLang("en")}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                editLang === "en"
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              EN
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditLang("ar")}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                editLang === "ar"
                                  ? "bg-primary text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              AR
                            </button>
                          </div>
                          <input
                            type="text"
                            value={editName[editLang]}
                            onChange={(e) =>
                              setEditName((prev) => ({
                                ...prev,
                                [editLang]: e.target.value,
                              }))
                            }
                            dir={editLang === "ar" ? "rtl" : "ltr"}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleUpdate(cat.id)
                            }
                            className="bg-gray-50 dark:bg-gray-900 border border-[#ff6a00] rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00]/30 outline-none text-sm w-48"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                            <FaTag className="text-[#ff6a00] text-xs" />
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {displayName}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                      {displaySlug}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === cat.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(cat.id)}
                              disabled={isPending}
                              title={isAr ? "حفظ" : "Save"}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all dark:bg-green-900/10 dark:text-green-400 cursor-pointer"
                            >
                              <FaSave className="text-xs" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              title={isAr ? "إلغاء" : "Cancel"}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-400 cursor-pointer"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </>
                        ) : deletingId === cat.id ? (
                          <>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {isAr ? "حذف؟" : "Delete?"}
                            </span>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={isPending}
                              className="text-xs px-2.5 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium cursor-pointer"
                            >
                              {isAr ? "نعم" : "Yes"}
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              {isAr ? "لا" : "No"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(cat)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black cursor-pointer"
                              title={isAr ? "تعديل" : "Edit"}
                            >
                              <FaEdit className="text-xs" />
                            </button>
                            <button
                              onClick={() => setDeletingId(cat.id)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white cursor-pointer"
                              title={isAr ? "حذف" : "Delete"}
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
