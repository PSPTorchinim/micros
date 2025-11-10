// Utility to convert a string to a URL-friendly slug
export function toUrlSlug(str: string): string {
  return encodeURIComponent(str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''));      // Trim hyphens from start/end
}
