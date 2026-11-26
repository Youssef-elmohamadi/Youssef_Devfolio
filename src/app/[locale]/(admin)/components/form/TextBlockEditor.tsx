"use client";

import React, { useRef, useState } from "react";
import { FaEye, FaEyeSlash, FaCode, FaBold, FaItalic, FaLink } from "react-icons/fa";
import { renderFormattedContent } from "@/app/[locale]/(site)/components/FormattedArticleText";

interface TextBlockEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export default function TextBlockEditor({
  value,
  onChange,
  rows = 5,
  placeholder = "Write your text content here...",
  className = "",
}: TextBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const wrapSelection = (before: string, after: string, defaultPlaceholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value || "";

    const selectedText = currentVal.substring(start, end);
    const replacement = selectedText || defaultPlaceholder;
    const newVal =
      currentVal.substring(0, start) +
      before +
      replacement +
      after +
      currentVal.substring(end);

    onChange(newVal);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + replacement.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Quick-Action Formatting Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-850 rounded-t-lg border border-gray-200 dark:border-gray-700/80 text-xs">
        <div className="flex items-center flex-wrap gap-1.5">
          {/* [badge] Button */}
          <button
            type="button"
            onClick={() => wrapSelection("[badge]", "[/badge]", "المصطلح")}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary/15 hover:bg-primary/25 text-primary dark:text-orange-400 font-mono font-bold transition-colors border border-primary/25"
            title="تظليل الكلمة وتطويقها بـ [badge]...[/badge]"
          >
            <span>[badge] تمييز</span>
          </button>

          {/* ==word== Button */}
          <button
            type="button"
            onClick={() => wrapSelection("==", "==", "المصطلح")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono font-semibold transition-colors"
            title="تطويق الكلمة بـ ==...=="
          >
            <span>==تمييز==</span>
          </button>

          {/* Inline Code Button */}
          <button
            type="button"
            onClick={() => wrapSelection("`", "`", "code")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono transition-colors"
            title="كود مضمّن `...`"
          >
            <FaCode className="text-[11px]" />
            <span>كود</span>
          </button>

          {/* Bold Button */}
          <button
            type="button"
            onClick={() => wrapSelection("**", "**", "نص عريض")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold transition-colors"
            title="نص عريض **...**"
          >
            <FaBold className="text-[10px]" />
          </button>

          {/* Italic Button */}
          <button
            type="button"
            onClick={() => wrapSelection("*", "*", "نص مائل")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 italic transition-colors"
            title="نص مائل *...*"
          >
            <FaItalic className="text-[10px]" />
          </button>

          {/* Link Button */}
          <button
            type="button"
            onClick={() => wrapSelection("[", "](https://...)", "نص الرابط")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="إدراج رابط [نص](رابط)"
          >
            <FaLink className="text-[10px]" />
            <span>رابط</span>
          </button>
        </div>

        {/* Live Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview((prev) => !prev)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            showPreview
              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
              : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
          title="معاينة مباشرة لشكل التمييز"
        >
          {showPreview ? <FaEyeSlash /> : <FaEye />}
          <span>{showPreview ? "إخفاء المعاينة" : "معاينة"}</span>
        </button>
      </div>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-lg p-4 text-sm text-gray-900 dark:text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y font-sans leading-relaxed"
        placeholder={placeholder}
      />

      {/* Live Preview Box if toggled */}
      {showPreview && value && (
        <div className="p-4 rounded-lg bg-white dark:bg-gray-900/90 border border-blue-500/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800 text-[11px] font-bold text-blue-500">
            <span>معاينة حية للنص والمصطلحات:</span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
            {renderFormattedContent(value)}
          </p>
        </div>
      )}

      {/* Helpful Hint */}
      <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 px-1">
        <span>💡</span>
        <span>
          حدد أي كلمة واضغط على <code className="font-mono text-primary font-bold">[badge]</code> أو اكتب مباشرة{" "}
          <code className="font-mono text-primary font-semibold">[badge]المصطلح[/badge]</code> أو{" "}
          <code className="font-mono text-primary font-semibold">==المصطلح==</code> لتمييزه كبادج في المقال.
        </span>
      </p>
    </div>
  );
}
