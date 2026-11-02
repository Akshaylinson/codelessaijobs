import { Job, SiteSettings } from '../types/job';
import { seedJobs } from '../data/seedJobs';
import { defaultSettings } from '../data/seedSettings';
import { parseTags, isValidPublishedJob } from '../utils/jobUtils';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let cachedJobs: CacheEntry<{ jobs: Job[]; settings: SiteSettings; isLive: boolean }> | null = null;

const API_URL = import.meta.env.VITE_JOBS_API_URL?.trim();

/**
 * Normalizes an incoming raw job object from the Google Apps Script API or seed data,
 * ensuring tags are parsed arrays and all fields meet expected types.
 */
function normalizeJob(raw: any): Job | null {
  if (!raw || typeof raw !== 'object') return null;

  const job: Job = {
    job_id: String(raw.job_id || '').trim(),
    slug: String(raw.slug || '').trim(),
    job_title: String(raw.job_title || '').trim(),
    company_name: String(raw.company_name || '').trim(),
    company_logo_url: raw.company_logo_url ? String(raw.company_logo_url).trim() : undefined,
    company_website: raw.company_website ? String(raw.company_website).trim() : undefined,
    company_description: raw.company_description ? String(raw.company_description).trim() : undefined,
    job_description: String(raw.job_description || '').trim(),
    about_role: raw.about_role ? String(raw.about_role).trim() : undefined,
    application_url: String(raw.application_url || '').trim(),
    tags: Array.isArray(raw.tags) ? raw.tags : parseTags(raw.tags),
    status: raw.status || 'Published',
    date_added: String(raw.date_added || '').trim(),
    last_updated: raw.last_updated ? String(raw.last_updated).trim() : undefined,
  };

  return isValidPublishedJob(job) ? job : null;
}

/**
 * Normalizes raw settings dictionary from API or fallback.
 */
function normalizeSettings(raw: any): SiteSettings {
  if (!raw || typeof raw !== 'object') return defaultSettings;

  return {
    site_name: raw.site_name || defaultSettings.site_name,
    site_description: raw.site_description || defaultSettings.site_description,
    contact_email: raw.contact_email || defaultSettings.contact_email,
    jobs_per_page: Number(raw.jobs_per_page) || defaultSettings.jobs_per_page,
    homepage_job_count: Number(raw.homepage_job_count) || defaultSettings.homepage_job_count,
    api_cache_duration: Number(raw.api_cache_duration) || defaultSettings.api_cache_duration,
    default_company_logo: raw.default_company_logo || defaultSettings.default_company_logo,
    cta_heading: raw.cta_heading || defaultSettings.cta_heading,
    cta_description: raw.cta_description || defaultSettings.cta_description,
    announcement: raw.announcement || defaultSettings.announcement,
  };
}

/**
 * Fetches all published jobs and public settings.
 * If VITE_JOBS_API_URL is configured, fetches from Apps Script Web App.
 * Otherwise, seamlessly uses verified seed data.
 */
export async function getJobsData(forceRefresh = false): Promise<{
  jobs: Job[];
  settings: SiteSettings;
  isLive: boolean;
  error?: string;
}> {
  const cacheDurationMs = (defaultSettings.api_cache_duration || 300) * 1000;
  const now = Date.now();

  if (!forceRefresh && cachedJobs && now - cachedJobs.timestamp < cacheDurationMs) {
    return cachedJobs.data;
  }

  if (!API_URL) {
    const data = {
      jobs: seedJobs.filter(isValidPublishedJob),
      settings: defaultSettings,
      isLive: false,
    };
    cachedJobs = { data, timestamp: now };
    return data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const separator = API_URL.includes('?') ? '&' : '?';
    const response = await fetch(`${API_URL}${separator}action=listJobs`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Apps Script API responded with status ${response.status}`);
    }

    const json = await response.json();
    const rawJobs = json.jobs || json.data?.jobs || (Array.isArray(json.data) ? json.data : []);
    const rawSettings = json.settings || json.data?.settings;

    const validatedJobs: Job[] = [];
    for (const raw of rawJobs) {
      const normalized = normalizeJob(raw);
      if (normalized) {
        validatedJobs.push(normalized);
      }
    }

    const settings = normalizeSettings(rawSettings);
    const data = {
      jobs: validatedJobs,
      settings,
      isLive: true,
    };

    cachedJobs = { data, timestamp: now };
    return data;
  } catch (err: any) {
    console.warn('Apps Script API fetch error, falling back to seed data:', err.message);
    const fallbackData = {
      jobs: seedJobs.filter(isValidPublishedJob),
      settings: defaultSettings,
      isLive: false,
      error: `Live API temporarily unavailable (${err.message}). Displaying verified fallback dataset.`,
    };
    return fallbackData;
  }
}

/**
 * Retrieves a single published job by its unique slug or stable ID.
 */
export async function getJobBySlug(slug: string): Promise<{
  job: Job | null;
  settings: SiteSettings;
  allJobs: Job[];
  isLive: boolean;
}> {
  const { jobs, settings, isLive } = await getJobsData();
  const cleanSlug = slug.trim().toLowerCase();

  const found = jobs.find(
    (j) => j.slug.toLowerCase() === cleanSlug || j.job_id.toLowerCase() === cleanSlug
  );

  return {
    job: found || null,
    settings,
    allJobs: jobs,
    isLive,
  };
}
