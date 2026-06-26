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
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/categories";

type Category = { id: number; name: string; slug?: string };

type Toast = { type: "success" | "error"; message: string };

export default function CategoriesClient({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
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
  const [newName, setNewName] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // --- Create ---
  const handleCreate = () => {
    if (!newName.trim()) return;
    const formData = new FormData();
    formData.append("name", newName.trim());

    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result.success) {
        // Optimistic UI — add a temp item (page will revalidate)
        setCategories((prev) => [
          ...prev,
          { id: Date.now(), name: newName.trim() },
        ]);
        setNewName("");
        setShowCreateForm(false);
        showToast("success", "Category created successfully!");
      } else {
        showToast("error", result.message);
      }
    });
  };

  // --- Edit ---
  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdate = (id: number) => {
    if (!editName.trim()) return;
    const formData = new FormData();
    formData.append("name", editName.trim());
    formData.append("_method", "PUT");

    startTransition(async () => {
      const result = await updateCategoryAction(id, formData);
      if (result.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, name: editName.trim() } : c))
        );
        setEditingId(null);
        showToast("success", "Category updated!");
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
        showToast("success", "Category deleted!");
      } else {
        showToast("error", result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-medium text-sm ${
              toast.type === "success"
                ? "bg-green-500"
                : "bg-red-500"
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
          className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium text-sm active:scale-95"
        >
          {showCreateForm ? <FaTimes /> : <FaPlus />}
          {showCreateForm ? "Cancel" : "New Category"}
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
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaTag className="text-[#ff6a00]" /> New Category
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Category name (e.g. JavaScript)"
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00] outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={handleCreate}
                  disabled={isPending || !newName.trim()}
                  className="inline-flex items-center gap-2 bg-[#ff6a00] hover:bg-[#e65f00] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all"
                >
                  <FaSave /> Save
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
            <p className="text-lg font-medium">No categories yet</p>
            <p className="text-sm mt-1 opacity-70">
              Click "New Category" to create your first one.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {i + 1}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUpdate(cat.id)
                        }
                        className="bg-gray-50 dark:bg-gray-900 border border-[#ff6a00] rounded-lg px-3 py-1.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a00]/30 outline-none text-sm w-48"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                          <FaTag className="text-[#ff6a00] text-xs" />
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {cat.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                    {cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            disabled={isPending}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all dark:bg-green-900/10 dark:text-green-400"
                          >
                            <FaSave className="text-xs" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-400"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </>
                      ) : deletingId === cat.id ? (
                        <>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Delete?
                          </span>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-medium hover:bg-red-700 transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(cat)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white transition-all dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white dark:hover:text-black"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button
                            onClick={() => setDeletingId(cat.id)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
