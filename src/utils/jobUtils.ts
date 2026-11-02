import { Job } from '../types/job';

/**
 * Parses pipe-separated or comma-separated tags into a clean, deduplicated array.
 * Trims whitespace and ignores empty entries while preserving human-readable casing.
 * Example: "Python Developer | Software Development | Remote | Full-Time"
 */
export function parseTags(rawTags: string | string[] | undefined | null): string[] {
  if (!rawTags) return [];

  const rawList = Array.isArray(rawTags)
    ? rawTags
    : rawTags.split(/[|,]/);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of rawList) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(trimmed);
    }
  }

  return result;
}

/**
 * Validates that a job record fulfills all mandatory criteria for public listing:
 * - unique job_id
 * - unique slug
 * - job_title
 * - company_name
 * - job_description
 * - application_url (with valid web scheme)
 * - at least one tag
 * - status === 'Published'
 */
export function isValidPublishedJob(job: Partial<Job> | null | undefined): boolean {
  if (!job) return false;

  if (job.status !== 'Published') return false;
  if (!job.job_id || typeof job.job_id !== 'string' || !job.job_id.trim()) return false;
  if (!job.slug || typeof job.slug !== 'string' || !job.slug.trim()) return false;
  if (!job.job_title || typeof job.job_title !== 'string' || !job.job_title.trim()) return false;
  if (!job.company_name || typeof job.company_name !== 'string' || !job.company_name.trim()) return false;
  if (!job.job_description || typeof job.job_description !== 'string' || !job.job_description.trim()) return false;
  if (!job.application_url || typeof job.application_url !== 'string' || !isValidUrl(job.application_url)) return false;

  const tags = Array.isArray(job.tags) ? job.tags : parseTags(job.tags);
  if (!tags || tags.length === 0) return false;

  return true;
}

/**
 * Validates safe URL protocol (https:// or http://)
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes external URL, ensuring https:// or http://, or returns null.
 */
export function sanitizeUrl(url?: string | null): string | null {
  if (!url || !isValidUrl(url)) return null;
  return url.trim();
}

/**
 * Filters jobs by search query and tag selection (AND matching by default),
 * and sorts them newest/oldest.
 */
export function filterJobs(
  jobs: Job[],
  query: string = '',
  selectedTags: string[] = [],
  sort: 'newest' | 'oldest' = 'newest'
): Job[] {
  const cleanQuery = query.trim().toLowerCase();
  const normalizedSelectedTags = selectedTags.map((t) => t.trim().toLowerCase()).filter(Boolean);

  let filtered = jobs.filter((job) => {
    // Must be valid published job
    if (!isValidPublishedJob(job)) return false;

    // 1. Keyword search across title, company, tags, description
    if (cleanQuery) {
      const titleMatch = job.job_title.toLowerCase().includes(cleanQuery);
      const companyMatch = job.company_name.toLowerCase().includes(cleanQuery);
      const tagsMatch = job.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      const descMatch = job.job_description.toLowerCase().includes(cleanQuery);

      if (!titleMatch && !companyMatch && !tagsMatch && !descMatch) {
        return false;
      }
    }

    // 2. AND matching for tags: job must have EVERY selected tag
    if (normalizedSelectedTags.length > 0) {
      const jobTagsLower = job.tags.map((t) => t.toLowerCase());
      const hasAllTags = normalizedSelectedTags.every((reqTag) =>
        jobTagsLower.includes(reqTag)
      );
      if (!hasAllTags) {
        return false;
      }
    }

    return true;
  });

  // 3. Sort by date_added
  filtered = filtered.sort((a, b) => {
    const timeA = new Date(a.date_added || 0).getTime();
    const timeB = new Date(b.date_added || 0).getTime();

    if (isNaN(timeA) || isNaN(timeB)) {
      return 0;
    }

    return sort === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return filtered;
}

/**
 * Paginates an array of items.
 */
export function paginateJobs(
  jobs: Job[],
  page: number = 1,
  perPage: number = 8
): { items: Job[]; totalPages: number; currentPage: number; totalCount: number } {
  const safePerPage = Math.max(1, perPage);
  const totalCount = jobs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * safePerPage;
  const items = jobs.slice(start, start + safePerPage);

  return {
    items,
    totalPages,
    currentPage,
    totalCount,
  };
}

/**
 * Extracts and counts unique tags from all published jobs, sorted by popularity.
 */
export function extractUniqueTags(jobs: Job[]): { tag: string; count: number }[] {
  const map = new Map<string, { tag: string; count: number }>();

  for (const job of jobs) {
    if (!isValidPublishedJob(job)) continue;
    for (const t of job.tags) {
      const lower = t.toLowerCase();
      const existing = map.get(lower);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(lower, { tag: t, count: 1 });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Finds related jobs sharing the most overlapping tags, excluding the current job.
 */
export function getRelatedJobs(currentJob: Job, allJobs: Job[], limit: number = 3): Job[] {
  if (!currentJob || !currentJob.slug) return [];

  const currentTags = new Set(currentJob.tags.map((t) => t.toLowerCase()));

  const scored = allJobs
    .filter((j) => isValidPublishedJob(j) && j.slug !== currentJob.slug)
    .map((job) => {
      let overlap = 0;
      for (const t of job.tags) {
        if (currentTags.has(t.toLowerCase())) {
          overlap += 1;
        }
      }
      return { job, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) {
        return b.overlap - a.overlap;
      }
      return new Date(b.job.date_added || 0).getTime() - new Date(a.job.date_added || 0).getTime();
    });

  return scored.slice(0, limit).map((s) => s.job);
}

/**
 * Creates a clean plain-text excerpt from rich multiline description.
 */
export function generateExcerpt(text: string, maxLength: number = 140): string {
  if (!text) return '';
  // Remove markdown headers, list asterisks/bullets, and html tags
  const clean = text
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).trim() + '...';
}

/**
 * Formats a date string (e.g. "2026-10-24") into a human readable format
 */
export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
