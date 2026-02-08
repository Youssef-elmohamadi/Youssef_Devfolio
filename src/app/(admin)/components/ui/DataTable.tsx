"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxOpen } from "react-icons/fa";

// نفس الواجهات القديمة لضمان عدم كسر الكود
export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string; // إضافة: للتحكم في عرض العمود أو محاذاته
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
}: DataTableProps<T>) {
  // 1. Loading State (Skeleton Animation)
  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-dark/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-full rounded bg-gray-100 dark:bg-gray-800"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 w-full rounded bg-gray-50 dark:bg-gray-800/50"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!data || data.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 text-center dark:border-gray-800 dark:bg-dark/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <FaBoxOpen className="text-3xl text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No Data Found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          There represent no records to display at the moment.
        </p>
      </div>
    );
  }

  // 3. The Advanced Table
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-dark/50">
      {/* شريط علوي جمالي بلون البراند */}
      <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-primary/80 to-primary" />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          {/* Header */}
          <thead className="bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500 dark:bg-white/5 dark:text-gray-400">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 font-semibold ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <AnimatePresence>
              {data.map((item, rowIndex) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                  className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`whitespace-nowrap px-6 py-4 text-gray-700 dark:text-gray-300 ${col.className || ""}`}
                    >
                      {col.render ? (
                        col.render(item)
                      ) : col.accessorKey ? (
                        // التأكد من أن القيمة ليست null أو undefined
                        <span className="font-medium">
                          {String(item[col.accessorKey])}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer بسيط يظهر عدد النتائج */}
      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/5 dark:text-gray-400">
        Showing {data.length} records
      </div>
    </div>
  );
}
