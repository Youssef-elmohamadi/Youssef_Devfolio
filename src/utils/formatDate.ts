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

export const formatRelativeTime = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (isNaN(date.getTime())) return "-";

  if (diffInSeconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
};