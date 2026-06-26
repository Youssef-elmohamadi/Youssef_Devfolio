"use client";
// CategoryFilter component – provides a glass‑morphic dropdown to filter blog articles by category.
import { useEffect, useState, useRef } from "react";
import { getCategories } from "@/lib/api/categories";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useClickAway } from "react-use";

type Category = { id: number; name: string; slug?: string };

interface Props {
  selectedId: number | null;
  onChange: (id: number | null) => void;
}

export const CategoryFilter = ({ selectedId, onChange }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    // Fetch all categories from the backend API.
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const selectedCategory = selectedId 
    ? categories.find(c => c.id === selectedId) 
    : null;

  return (
    <div className="relative w-full sm:w-64" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-md px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm transition-all hover:bg-white/60 dark:hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <span className="truncate">
          {selectedCategory ? selectedCategory.name : "All Categories"}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 rounded-xl border border-white/20 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg p-1"
          >
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <button
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                  selectedId === null
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                }`}
              >
                <span>All Categories</span>
                {selectedId === null && <CheckIcon className="w-4 h-4" />}
              </button>

              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onChange(c.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors mt-1 ${
                    selectedId === c.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {selectedId === c.id && <CheckIcon className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
