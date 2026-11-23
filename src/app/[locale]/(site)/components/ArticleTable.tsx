"use client";

interface ArticleTableProps {
  tableData: {
    headers: string[];
    rows: string[][];
  };
  caption?: string;
}

export default function ArticleTable({ tableData, caption }: ArticleTableProps) {
  if (!tableData?.headers?.length) return null;

  return (
    <div className="overflow-x-auto my-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-sm">
      <table className="w-full text-sm text-left">
        {caption && (
          <caption className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium text-left bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
            {caption}
          </caption>
        )}
        <thead className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
          <tr>
            {tableData.headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
          {tableData.rows.map((row, ri) => (
            <tr
              key={ri}
              className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
