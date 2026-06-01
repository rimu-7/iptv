import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export function getChannelId(name: string, url: string): string {
  const cleanName = slugify(name || "unnamed")
  const urlStr = url || ""
  let hash = 0
  for (let i = 0; i < urlStr.length; i++) {
    hash = (hash << 5) - hash + urlStr.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  const cleanHash = Math.abs(hash).toString(36).slice(0, 6)
  return `${cleanName}-${cleanHash}`
}
