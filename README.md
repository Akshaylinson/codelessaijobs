# Codeless AI Jobs (`jobs.codelessai.in`)

A modern, responsive, production-ready job discovery and aggregation platform for tech, AI, and software engineering opportunities.

Codeless AI Jobs operates with **zero server infrastructure costs** by pairing a **React + Vite + TypeScript** frontend hosted on **GitHub Pages** with a curated **Google Sheets** database queried via a read-only **Google Apps Script** API.

---

## 🌟 Key Features

- **Google Sheets As CMS**: The administrator curates and publishes job opportunities entirely within Google Sheets. Zero code changes or rebuilds are needed to add or update listings.
- **Dynamic Tag Classification**: No rigid categories. Tags are entered as pipe-separated values (e.g., `Python | AI | Remote | Full-Time`) and dynamically derived for filters.
- **Multi-Tag AND Filtering & Search**: Instant case-insensitive keyword search across job titles, companies, tags, and full markdown descriptions. Combine multiple tags to narrow down results.
- **Direct Employer Application**: Prominent "Apply Now" buttons direct candidates straight to the employer's official job portal or ATS. No intermediate resumes or account sign-ups.
- **Static Site Generation & SEO Ready**: Generates static HTML for every published job, Open Graph social share cards, canonical tags, `sitemap.xml`, and valid Schema.org `JobPosting` JSON-LD.
- **Zero Server Maintenance**: Runs entirely on Google Sheets + Google Apps Script + GitHub Pages (custom domain: `jobs.codelessai.in`).

---

## 🚀 How Administrators Add a Company & Publish a Job

Administrators do **not** touch the code or Git repository to post new jobs.

### Step-by-Step Workflow:
1. Open your **Codeless AI Jobs Database** Google Spreadsheet.
2. Select the **`Jobs`** worksheet.
3. Add a new row at the bottom with the following 14 columns:
   1. **`job_id`**: A unique ID (e.g. `JOB-2026-009`).
   2. **`slug`**: A URL-safe slug (e.g. `staff-ai-engineer-huggingface`).
   3. **`job_title`**: Job title (e.g. `Staff AI Engineer`).
   4. **`company_name`**: Name of the company (e.g. `Hugging Face`).
   5. **`company_logo_url`**: Direct URL to company logo (optional; fallback initials are generated if omitted).
   6. **`company_website`**: Official company website (e.g. `https://huggingface.co`).
   7. **`company_description`**: Brief company overview (optional).
   8. **`job_description`**: Full job description with responsibilities, qualifications, and benefits (supports multiline text, markdown headings, and bullet points).
   9. **`about_role`**: Short role summary callout (optional).
   10. **`application_url`**: Official application URL (e.g. `https://huggingface.co/careers/staff-ai-engineer`).
   11. **`tags`**: Pipe-separated tags (e.g. `Python | Machine Learning | Remote | Full-Time`).
   12. **`status`**: Set to **`Published`** (case-sensitive).
   13. **`date_added`**: Today's date (e.g. `2026-11-02`).
   14. **`last_updated`**: Today's date.
4. Save the row. The job is instantly accessible via the Google Apps Script API!

*To take down or close a role:* Simply change the `status` column from `Published` to `Closed` or `Archived`. It will disappear from public search results immediately.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Modular functional components, hooks, clean UX. |
| **Styling** | Tailwind CSS v4 | Professional, high-contrast typography, mobile-first design. |
| **Routing** | React Router v7 | Seamless client routing + pre-rendered static HTML routes. |
| **Icons** | Lucide React | Lightweight, accessible iconography. |
| **Data Store** | Google Sheets | Exactly two sheets: `Jobs` and `Settings`. |
| **Read API** | Google Apps Script | Read-only JSON endpoint with in-memory caching and batch row retrieval. |
| **Hosting** | GitHub Pages | Custom domain `jobs.codelessai.in` with HTTPS. |
| **Automation** | GitHub Actions | Automated lint, unit tests, static page generation, and deployment. |

---

## 📁 Project Structure

```
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD to GitHub Pages
├── data/
│   ├── sample-jobs.csv            # Sample CSV import for "Jobs" worksheet
│   └── sample-settings.csv        # Sample CSV import for "Settings" worksheet
├── docs/
│   ├── SPREADSHEET_SCHEMA.md      # Detailed column definitions and validation rules
│   └── SETUP_AND_TROUBLESHOOTING.md # Complete deployment & domain setup guide
├── google-apps-script/
│   └── Code.gs                    # Complete Google Apps Script web application code
├── public/                        # Static assets
├── scripts/
│   └── generate-static.ts         # Static pre-rendering, CNAME, sitemap & SEO generator
├── src/
│   ├── components/
│   │   ├── BlogSection.tsx        # Career resources & readable modal reader
│   │   ├── CtaSection.tsx         # Configurable CTA banner
│   │   ├── Footer.tsx             # Brand footer, disclaimer, and privacy trigger
│   │   ├── HeroSection.tsx        # Search bar & trending tag pills
│   │   ├── JobCard.tsx            # Reusable job card with logo fallback
│   │   ├── LatestJobsSection.tsx  # Homepage latest jobs showcase
│   │   ├── Navbar.tsx             # Sticky navbar & mobile navigation
│   │   ├── Pagination.tsx         # Accessible page controls
│   │   ├── PrivacyModal.tsx       # Privacy overlay and data disclosures
│   │   └── TagFilter.tsx          # Dynamic multi-tag filter with counts
│   ├── data/
│   │   ├── blogPosts.ts           # Curated static career advice guides
│   │   ├── seedJobs.ts            # Realistic seed jobs dataset for offline dev
│   │   └── seedSettings.ts        # Default settings fallback
│   ├── pages/
│   │   ├── DisclaimerPage.tsx     # Route /disclaimer (aggregator notice)
│   │   ├── HomePage.tsx           # Route / (landing page)
│   │   ├── JobDetailPage.tsx      # Route /jobs/:slug (job description & Apply Now)
│   │   └── JobsPage.tsx           # Route /jobs (all listings, filters, pagination)
│   ├── services/
│   │   └── jobsApi.ts             # Google Apps Script API client with cache & fallback
│   ├── types/
│   │   └── job.ts                 # TypeScript interfaces
│   ├── utils/
│   │   ├── jobUtils.ts            # Pure filtering, tag parsing, validation logic
│   │   └── jobUtils.test.ts       # 11 unit tests via node:test and tsx
│   ├── App.tsx                    # Route definitions and layout shell
│   ├── main.tsx                   # React root entry point
│   └── index.css                  # Tailwind CSS import and custom typography
├── .env.example                   # Environment variable template
├── index.html                     # HTML5 template with Open Graph & WebSite JSON-LD
└── package.json                   # Dependencies and scripts
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Optional)* Add your Google Apps Script Web App URL to `VITE_JOBS_API_URL`. If left empty, the application runs on high-fidelity seed data out of the box.

### 3. Run Unit Tests
```bash
npm test
```
Runs 11 automated unit tests verifying tag parsing, publication validation rules, AND filter logic, pagination, and date sorting.

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Test Production Build & Static Site Generation
```bash
npm run build
```
Builds the Vite application and runs `scripts/generate-static.ts` to pre-render static HTML for all jobs into `dist/`, generate `sitemap.xml`, and configure `dist/CNAME`.

---

## 🔒 Security & Privacy Discipline

- **Read-Only API**: Google Apps Script endpoints only accept read actions (`listJobs`, `getJob`, `getSettings`). No write endpoints exist.
- **Private Spreadsheet**: Google Sheets permissions remain restricted to the owner's Google account.
- **No Candidate PII**: No login, accounts, passwords, or resume uploads exist on this website.
- **Safe Outbound Redirection**: External application links are validated for valid `https://` / `http://` protocols and opened in safe tabs with `noopener,noreferrer`.
# codelessaijobs
