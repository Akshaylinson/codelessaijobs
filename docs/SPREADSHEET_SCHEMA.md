# Codeless AI Jobs - Google Sheets Schema Documentation

This document describes the exact architecture and formatting guidelines for the **Codeless AI Jobs Database** Google Spreadsheet.

The spreadsheet contains **exactly two worksheets**:
1. `Jobs` (for all job opportunities and inline company details)
2. `Settings` (for public site-wide configuration key-value pairs)

No separate company worksheets, categories worksheets, or relational foreign keys are used. Each job row is self-contained.

---

## 1. Worksheet: `Jobs`

This worksheet stores all job listings. Every row represents one job listing. The columns must appear in this exact order:

| Col # | Column Name | Type | Mandatory for Publication? | Description & Rules |
|---|---|---|---|---|
| 1 | `job_id` | Text | **Yes** | Stable unique identifier (e.g., `JOB-2026-001`). Never changes when titles are edited. |
| 2 | `slug` | Text | **Yes** | URL-friendly unique identifier (e.g., `senior-ai-engineer-anthropic`). Lowercase letters, numbers, hyphens. Used in `/jobs/:slug`. |
| 3 | `job_title` | Text | **Yes** | Official title of the role (e.g., `Senior AI Research Engineer`). |
| 4 | `company_name` | Text | **Yes** | Hiring company name (e.g., `Anthropic`). The same company can have multiple listings. |
| 5 | `company_logo_url` | URL | No | Public direct image URL (PNG, SVG, JPG, WebP). If omitted or broken, the website displays styled company initials or the default logo. |
| 6 | `company_website` | URL | No | Official company website URL (e.g., `https://anthropic.com`). |
| 7 | `company_description` | Text | No | Brief overview of what the company does. |
| 8 | `job_description` | Text (Rich) | **Yes** | Full description including responsibilities, eligibility, skills, salary, benefits. Supports multiline formatting, markdown headings (`###`), and bullet lists (`-`). |
| 9 | `about_role` | Text | No | Optional highlighted role overview callout shown at the top of the job details page. |
| 10 | `application_url` | URL | **Yes** | Direct URL to the employer's official application page or ATS (must start with `https://` or `http://`). |
| 11 | `tags` | Text (Pipe-separated) | **Yes** | Pipe-separated tags (e.g., `Python Developer \| Software Development \| Remote \| Full-Time`). At least 1 valid tag is required. |
| 12 | `status` | Text | **Yes** | Must be one of: `Draft`, `Published`, `Closed`, `Archived`. Only `Published` rows appear publicly on the site. |
| 13 | `date_added` | Date (YYYY-MM-DD) | No | Date the vacancy was first listed. Set once and preserved. |
| 14 | `last_updated` | Date (YYYY-MM-DD) | No | Date the vacancy was last revised or verified. |

### Rules for Administrator Data Entry:
- **No code changes needed:** Simply add a new row in Google Sheets, set `status` to `Published`, and the job appears automatically.
- **Pipe-separated tags:** Enter tags separated by `|`. Whitespace around tags is automatically trimmed by Apps Script and the frontend. Duplicate tags within the same job are deduplicated.
- **Publication validation:** If a row has `status = Published` but is missing `slug`, `job_title`, `company_name`, `job_description`, or `application_url`, the API automatically excludes it to protect the public site from displaying broken cards.

---

## 2. Worksheet: `Settings`

This worksheet configures site-wide text and behavioral parameters in key-value format:

| Column # | Column Name | Type | Description |
|---|---|---|---|
| 1 | `setting_key` | Text | The unique configuration key name. |
| 2 | `setting_value` | Text / Number | The configuration value. |

### Supported Configuration Keys:

| `setting_key` | Default Fallback | Description |
|---|---|---|
| `site_name` | `Codeless AI Jobs` | Name displayed in navbar, footer, and page title tags. |
| `site_description` | `Curated job aggregator for AI, fullstack, and cloud engineering opportunities.` | Description for hero, meta tags, and footer. |
| `contact_email` | `hello@codelessai.in` | Email address shown in the footer and disclaimer page for candidate inquiries or employer takedown requests. |
| `jobs_per_page` | `8` | Number of job cards shown per page on `/jobs`. |
| `homepage_job_count` | `6` | Number of recent job cards shown on the homepage. |
| `api_cache_duration` | `300` | Google Apps Script CacheService TTL in seconds (default: 5 minutes). |
| `default_company_logo` | `""` | Optional fallback logo image URL if a job row has no `company_logo_url`. |
| `cta_heading` | `Ready to Land Your Next AI or Engineering Role?` | Headline text for the homepage call-to-action banner. |
| `cta_description` | `Browse verified tech opportunities with transparent descriptions...` | Subtitle text for the homepage call-to-action banner. |
| `announcement` | `""` | Optional top notification banner text (e.g., `✨ 10+ new AI roles added this week!`). Leave empty to hide banner. |
