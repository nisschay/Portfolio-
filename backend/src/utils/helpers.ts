/**
 * Utility Helper Functions
 */

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculate reading time for text content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadTime(content: string, wordsPerMinute = 200): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Generate an excerpt from HTML content
 */
export function generateExcerpt(htmlContent: string, maxLength = 200): string {
  // Strip HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, '');
  // Normalize whitespace
  const normalized = text.replace(/\s+/g, ' ').trim();
  return truncate(normalized, maxLength);
}

/**
 * Format date for API responses
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse boolean from query string
 */
export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Delay execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Remove undefined values from an object
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}
