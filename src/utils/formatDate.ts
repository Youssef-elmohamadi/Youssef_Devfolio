// lib/utils.ts أو utils/formatDate.ts

export const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  
  // صيغة: Jan 19, 2026
  return new Intl.DateTimeFormat("en-US", {
    month: "short", // Jan, Feb... (ممكن تخليها 'long' لو عايز January)
    day: "numeric", // 19
    year: "numeric", // 2026
  }).format(date);
};