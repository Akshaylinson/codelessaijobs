export type JobStatus = 'Draft' | 'Published' | 'Closed' | 'Archived';

export interface Job {
  job_id: string;
  slug: string;
  job_title: string;
  company_name: string;
  company_logo_url?: string;
  company_website?: string;
  company_description?: string;
  job_description: string;
  about_role?: string;
  application_url: string;
  tags: string[];
  status: JobStatus;
  date_added: string;
  last_updated?: string;
}

export interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  jobs_per_page: number;
  homepage_job_count: number;
  api_cache_duration: number;
  default_company_logo?: string;
  cta_heading: string;
  cta_description: string;
  announcement?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  sort: 'newest' | 'oldest';
  page: number;
}
