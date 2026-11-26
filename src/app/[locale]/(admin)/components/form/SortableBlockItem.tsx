"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaChevronUp, FaChevronDown, FaTrash } from "react-icons/fa";

interface SortableBlockItemProps {
  id: number | string;
  index: number;
  totalBlocks: number;
  blockType: string;
  blockTypeLabel: string;
  blockTypeBadgeColor: string;
  blockTypeColor: string;
  blockTypeIcon?: React.ReactNode;
  isAr?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

export default function SortableBlockItem({
  id,
  index,
  totalBlocks,
  blockType,
  blockTypeLabel,
  blockTypeBadgeColor,
  blockTypeColor,
  blockTypeIcon,
  isAr = true,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.75 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-[#0a0a0a] border rounded-xl p-5 relative group transition-all ${blockTypeColor} ${
        isDragging
          ? "border-primary ring-2 ring-primary/40 shadow-2xl scale-[1.01]"
          : "hover:shadow-md"
      }`}
    >
      {/* Block Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 dark:border-gray-800/80">
        <div className="flex items-center gap-2.5">
          {/* Drag Handle with Grip Icon */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1.5 -ms-1 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
            title={isAr ? "اضغط واسحب لإعادة الترتيب بالماوس" : "Drag to reorder"}
            aria-label="Drag handle"
          >
            <FaGripVertical className="w-4 h-4 text-gray-400 hover:text-primary transition-colors" />
          </button>

          {/* Block Type Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 ${blockTypeBadgeColor}`}
            >
              {blockTypeIcon && <span>{blockTypeIcon}</span>}
              <span>{blockTypeLabel}</span>
            </span>
            <span className="text-xs font-mono font-semibold text-gray-400">
              #{index + 1}
            </span>
          </div>
        </div>

        {/* Action Buttons: Move Up, Move Down, Delete */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={isAr ? "تحريك لأعلى" : "Move up"}
          >
            <FaChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === totalBlocks - 1}
            className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title={isAr ? "تحريك لأسفل" : "Move down"}
          >
            <FaChevronDown size={12} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title={isAr ? "حذف البلوك" : "Remove block"}
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>

      {/* Block Content Editor */}
      <div>{children}</div>
    </div>
  );
}
