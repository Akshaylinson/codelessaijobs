import { SiteSettings } from '../types/job';

export const defaultSettings: SiteSettings = {
  site_name: 'Codeless AI Jobs',
  site_description: 'Discover verified tech, AI, fullstack, and cloud engineering opportunities from innovative companies worldwide.',
  contact_email: 'hello@codelessai.in',
  jobs_per_page: 8,
  homepage_job_count: 6,
  api_cache_duration: 300, // 5 minutes in seconds
  default_company_logo: '',
  cta_heading: 'Ready to Land Your Next AI or Engineering Role?',
  cta_description: 'Browse hundreds of verified tech opportunities with transparent descriptions, direct application links, and zero middleman hurdles.',
  announcement: '✨ 12+ new AI and Fullstack roles added this week! Verified directly with employer career portals.',
};
