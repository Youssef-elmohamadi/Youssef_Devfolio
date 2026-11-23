"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import { useClickAway } from "react-use";

export interface CustomSelectOption {
  value: string;
  label: string;
  count?: number;
  dotColor?: string;
  icon?: React.ReactNode;
}

interface CustomFilterSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  placeholder: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CustomFilterSelect({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  icon,
  className = "",
}: CustomFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Find active option if selected
  const activeOption = options.find((opt) => opt.value === value);
  const isSelected = Boolean(value && value !== "" && value !== "latest");

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel || placeholder}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 py-2.5 px-3.5 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-xs ${
          isSelected
            ? "bg-primary/5 dark:bg-primary/10 border-primary/40 dark:border-primary/40 text-primary dark:text-primary-light ring-1 ring-primary/20"
            : "bg-gray-50/90 dark:bg-gray-800/70 border-gray-200/90 dark:border-gray-700/80 text-gray-800 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/90 hover:border-primary/40 dark:hover:border-primary/40"
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          {icon && <span className="text-gray-400 dark:text-gray-500 shrink-0">{icon}</span>}
          {activeOption?.dotColor && (
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/50 dark:ring-black/50 ${activeOption.dotColor}`}
            />
          )}
          <span className="truncate">{activeOption ? activeOption.label : placeholder}</span>
          {activeOption?.count !== undefined && (
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary shrink-0">
              {activeOption.count}
            </span>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-gray-400 dark:text-gray-500 shrink-0 ms-1"
        >
          <FaChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className="absolute z-50 top-full mt-1.5 inset-x-0 min-w-[200px] rounded-xl border border-gray-200/90 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl overflow-hidden p-1.5"
          >
            <div className="max-h-60 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
              {options.map((opt) => {
                const isItemActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isItemActive}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`group w-full flex items-center justify-between gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-150 text-start ${
                      isItemActive
                        ? "bg-primary/10 dark:bg-primary/20 text-primary font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      {opt.dotColor && (
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ring-1 ring-white/50 dark:ring-black/50 ${opt.dotColor}`}
                        />
                      )}
                      {opt.icon && <span className="text-gray-400 shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ms-2">
                      {opt.count !== undefined && (
                        <span
                          className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                            isItemActive
                              ? "bg-primary/20 text-primary"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                          }`}
                        >
                          {opt.count}
                        </span>
                      )}
                      {isItemActive && (
                        <FaCheck className="w-3 h-3 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomFilterSelect;
