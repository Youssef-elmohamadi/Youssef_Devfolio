export const formatDate = (dateString: string, locale: string = "en"): string => {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatRelativeTime = (dateString: string | undefined, locale: string = "en"): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale === "ar" ? "ar-EG" : "en-US", { numeric: "auto" });

  const absDiff = Math.abs(diffInSeconds);
  if (absDiff < 60) {
    return rtf.format(Math.round(diffInSeconds), "second");
  }
  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, "minute");
  }
  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, "hour");
  }
  const diffInDays = Math.round(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, "day");
  }
  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, "month");
  }
  const diffInYears = Math.round(diffInDays / 365);
  return rtf.format(diffInYears, "year");
};
