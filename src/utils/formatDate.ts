import { format, parseISO, formatDistanceToNow } from "date-fns";

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return format(parseISO(dateStr), "MMM dd, yyyy");
  } catch (e) {
    return dateStr;
  }
}

export function formatTimeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch (e) {
    return dateStr;
  }
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
