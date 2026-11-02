import fs from 'node:fs';
import path from 'node:path';
import { seedJobs } from '../src/data/seedJobs';
import { isValidPublishedJob } from '../src/utils/jobUtils';
import { Job } from '../src/types/job';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_DOMAIN = 'https://jobs.codelessai.in';

async function fetchOrFallbackJobs(): Promise<Job[]> {
  const apiUrl = process.env.VITE_JOBS_API_URL?.trim();

  if (apiUrl) {
    try {
      console.log(`Fetching live jobs from Google Apps Script for static generation: ${apiUrl}`);
      const separator = apiUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${apiUrl}${separator}action=listJobs`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        const rawJobs = json.jobs || json.data?.jobs || (Array.isArray(json.data) ? json.data : []);
        const valid = rawJobs.filter(isValidPublishedJob);
        if (valid.length > 0) {
          console.log(`Successfully fetched ${valid.length} live published jobs for SSG.`);
          return valid;
        }
      }
    } catch (e: any) {
      console.warn(`Could not reach Apps Script during build (${e.message}). Falling back to snapshot.`);
    }
  }

  console.log(`Using built-in verified snapshot dataset (${seedJobs.length} jobs) for static generation.`);
  return seedJobs.filter(isValidPublishedJob);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function run() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Dist directory does not exist at ${DIST_DIR}. Run vite build first.`);
    process.exit(1);
  }

  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`dist/index.html not found!`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const jobs = await fetchOrFallbackJobs();

  // 1. Write CNAME for custom domain
  fs.writeFileSync(path.join(DIST_DIR, 'CNAME'), 'jobs.codelessai.in\n');
  console.log('✓ Created CNAME for jobs.codelessai.in');

  // 2. Write 404.html (copy of index.html for client-side routing fallback)
  fs.writeFileSync(path.join(DIST_DIR, '404.html'), baseHtml);
  console.log('✓ Created 404.html SPA router fallback');

  // 3. Generate static HTML for /jobs
  const jobsDir = path.join(DIST_DIR, 'jobs');
  fs.mkdirSync(jobsDir, { recursive: true });

  let jobsPageHtml = baseHtml
    .replace(
      /<title>.*?<\/title>/,
      '<title>Browse All Jobs | Codeless AI Jobs</title>'
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${BASE_DOMAIN}/jobs" />`
    );
  fs.writeFileSync(path.join(jobsDir, 'index.html'), jobsPageHtml);
  console.log('✓ Generated static /jobs/index.html');

  // 4. Generate static HTML for /disclaimer
  const disclaimerDir = path.join(DIST_DIR, 'disclaimer');
  fs.mkdirSync(disclaimerDir, { recursive: true });

  let disclaimerPageHtml = baseHtml
    .replace(
      /<title>.*?<\/title>/,
      '<title>Disclaimer & Aggregator Terms | Codeless AI Jobs</title>'
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${BASE_DOMAIN}/disclaimer" />`
    );
  fs.writeFileSync(path.join(disclaimerDir, 'index.html'), disclaimerPageHtml);
  console.log('✓ Generated static /disclaimer/index.html');

  // 5. Generate individual static HTML pages for each job: /jobs/:slug/index.html
  for (const job of jobs) {
    const jobDir = path.join(jobsDir, job.slug);
    fs.mkdirSync(jobDir, { recursive: true });

    const jobTitleSafe = escapeHtml(job.job_title);
    const companySafe = escapeHtml(job.company_name);
    const pageTitle = `${jobTitleSafe} at ${companySafe} | Codeless AI Jobs`;
    const cleanDesc = escapeHtml(
      job.job_description.slice(0, 155).replace(/[\n#*-]/g, ' ').replace(/\s+/g, ' ').trim()
    );
    const canonicalUrl = `${BASE_DOMAIN}/jobs/${job.slug}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.job_title,
      description: job.job_description,
      datePosted: job.date_added || new Date().toISOString().slice(0, 10),
      jobLocation: job.tags.some((t) => t.toLowerCase() === 'remote')
        ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'Worldwide' } }
        : undefined,
      jobLocationType: job.tags.some((t) => t.toLowerCase() === 'remote')
        ? 'TELECOMMUTE'
        : undefined,
      applicantLocationRequirements: job.tags.some((t) => t.toLowerCase() === 'remote')
        ? { '@type': 'Country', name: 'Worldwide' }
        : undefined,
      employmentType: job.tags.some((t) => t.toLowerCase() === 'internship')
        ? 'INTERN'
        : job.tags.some((t) => t.toLowerCase() === 'part-time')
        ? 'PART_TIME'
        : 'FULL_TIME',
      hiringOrganization: {
        '@type': 'Organization',
        name: job.company_name,
        sameAs: job.company_website || undefined,
        logo: job.company_logo_url || undefined,
      },
      directApply: true,
      url: canonicalUrl,
    };

    let staticJobHtml = baseHtml
      .replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`)
      .replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${cleanDesc}" />`
      )
      .replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${canonicalUrl}" />`
      )
      .replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${pageTitle}" />`
      )
      .replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${cleanDesc}" />`
      )
      .replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${canonicalUrl}" />`
      )
      .replace(
        '</head>',
        `  <script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>\n</head>`
      );

    fs.writeFileSync(path.join(jobDir, 'index.html'), staticJobHtml);
  }
  console.log(`✓ Generated ${jobs.length} static individual job pages (/jobs/:slug/index.html)`);

  // 6. Generate sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_DOMAIN}/jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_DOMAIN}/disclaimer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
`;

  for (const job of jobs) {
    const jobMod = job.last_updated || job.date_added || today;
    sitemapXml += `  <url>
    <loc>${BASE_DOMAIN}/jobs/${job.slug}</loc>
    <lastmod>${jobMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  }

  sitemapXml += `</urlset>\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
  console.log('✓ Generated sitemap.xml');

  // 7. Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# AI/LLM crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${BASE_DOMAIN}/sitemap.xml
LLMs: ${BASE_DOMAIN}/llms.txt
`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);
  console.log('✓ Generated robots.txt');

  // 8. Copy llms.txt to dist (already in public/, Vite copies it — but ensure it exists)
  const llmsSrc = path.resolve(process.cwd(), 'public/llms.txt');
  const llmsDest = path.join(DIST_DIR, 'llms.txt');
  if (fs.existsSync(llmsSrc) && !fs.existsSync(llmsDest)) {
    fs.copyFileSync(llmsSrc, llmsDest);
  }
  console.log('✓ Verified llms.txt for AI/LLM crawlers (GEO)');

  console.log('Static site generation complete!');
}

run().catch((err) => {
  console.error('Error during static site generation:', err);
  process.exit(1);
});
