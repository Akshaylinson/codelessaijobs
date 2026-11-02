# CODELESS AI JOBS
## Complete Website Development Specification

### 1. PROJECT OBJECTIVE

Build a complete, responsive, production-ready job discovery and aggregation website named **Codeless AI Jobs**.

The website will be hosted at:

`jobs.codelessai.in`

The platform will allow users to discover job opportunities from different companies, browse job cards, view complete job descriptions and apply through the application URL supplied for each listing.

Codeless AI Jobs operates as a job aggregator. Job information is curated and entered manually by the administrator into Google Sheets.

The website must display the information supplied by the administrator without requiring source-code modifications for individual job listings.

The primary goal is to create a professional, modern, easy-to-maintain job discovery platform with minimal infrastructure costs.

Use the usability principles of established job portals such as Indeed and Naukri as inspiration, but create an original Codeless AI Jobs design.

Do not copy their branding, logos, proprietary designs or copyrighted content.

---

### 2. MANDATORY TECHNICAL ARCHITECTURE

Use the following technology stack:

**Frontend**
- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- React Router, or an equivalent routing solution compatible with static hosting.
- Lucide React for icons.

**Hosting**
- GitHub Pages.
- Custom domain: `jobs.codelessai.in`.
- GitHub Actions for deployment.

**Data storage**
- Google Sheets.

**Data-access API**
- Google Apps Script web application.

**Images**
- Publicly accessible company logo URLs stored in Google Sheets.
- No thumbnail images.
- No image uploads.
- No image-storage service.

**Administration**
- Google Sheets is the only administrative interface.
- Do not create a separate admin dashboard.
- Do not create admin login pages.
- Do not create job creation or editing forms in React.

**Infrastructure restrictions**
- No dedicated server.
- No VPS.
- No PostgreSQL or MySQL database.
- No Firebase.
- No Supabase.
- No mandatory paid backend.
- No separate company database.
- No separate categories worksheet.
- No unnecessary external services.

Google Apps Script will run on Google's infrastructure. The project must remain usable without the owner maintaining a traditional server.

Do not introduce additional infrastructure without explaining why it is necessary.

---

### 3. GOOGLE SHEETS DATA MODEL

Create documentation and Apps Script logic for a Google spreadsheet named:

`Codeless AI Jobs Database`

Use exactly two application-data worksheets:

1. `Jobs`
2. `Settings`

Do not create separate worksheets for companies, categories or tags.

#### Worksheet: Jobs

Use the following columns in this exact order:

1. `job_id`
2. `slug`
3. `job_title`
4. `company_name`
5. `company_logo_url`
6. `company_website`
7. `company_description`
8. `job_description`
9. `about_role`
10. `application_url`
11. `tags`
12. `status`
13. `date_added`
14. `last_updated`

Each row represents one complete job listing.

All company information must be stored directly in the corresponding job record.

Do not require company IDs or references to separate company records.

The same company can have multiple independent job listings.

#### Field requirements

**job_id**
- Unique and stable identifier.
- Generated when a job is first created, or supplied by the administrator.
- Never change automatically when the title changes.

**slug**
- URL-friendly identifier for the job.
- Must remain unique.
- Prefer a readable format based on the job title and company, with a stable identifier appended if necessary.
- Do not generate URLs that become ambiguous when titles are duplicated.

**job_title**
- Required.

**company_name**
- Required.

**company_logo_url**
- Optional public image URL.
- Must not require uploading an image.
- Must support missing or broken image URLs.

**company_website**
- Optional company website URL.

**company_description**
- Optional text describing the company.

**job_description**
- Required.
- Contains the complete main job description.
- May contain multiple paragraphs, headings, lists, links and other supported rich-text formatting.
- May include responsibilities, eligibility requirements, required skills, preferred skills, qualifications, experience, benefits, salary information and other job details.
- Do not split these details into additional spreadsheet columns.

**about_role**
- Optional.
- Contains the separate role overview supplied by the administrator.
- Support multiline text and the agreed rich-text format.

**application_url**
- Required before publication.
- Determines the destination of the Apply Now button.

**tags**
- Required for published jobs.
- Contains administrator-defined tags.
- Support multiple tags in one cell.

Use a pipe-separated format for spreadsheet entry, for example:

`Python Developer | Software Development | Remote | Full-Time`

Trim whitespace around each tag and ignore empty tag entries.

Tags must be dynamically derived from the published job data.

Do not maintain a hardcoded list of allowed tags.

**status**
- Supported values: `Draft`, `Published`, `Closed`, `Archived`.
- Only valid Published records appear in the public active job listings.
- Closed and Archived jobs must not appear in the default public job listings.

**date_added**
- Set when a job is first created, if not supplied.
- Do not change it during subsequent edits.

**last_updated**
- Update when a job is modified.
- Implement an appropriate Apps Script mechanism or document the spreadsheet workflow required to maintain it reliably.

#### Worksheet: Settings

Use these columns:

1. `setting_key`
2. `setting_value`

Support settings such as:

- `site_name`
- `site_description`
- `contact_email`
- `jobs_per_page`
- `api_cache_duration`
- `default_company_logo`
- `cta_heading`
- `cta_description`
- `announcement`

Use sensible defaults when optional settings are missing.

Do not store credentials or secrets in settings that are exposed through the public API.

---

### 4. DATA MANAGEMENT PRINCIPLES

The administrator must be able to add any company and any job title without changing the frontend code.

The system must not assume that all jobs contain the same information.

For example, one job may have a company description, while another may not.

One job description may include a detailed eligibility section, while another may consist of several paragraphs without explicit headings.

Both must be supported.

Never invent missing information.

Never display empty labels or blank sections on job cards or job detail pages.

The frontend must use the actual information supplied in Google Sheets.

A published job must have:
- A unique job ID.
- A unique slug.
- A job title.
- A company name.
- A job description.
- An application URL.
- At least one valid tag.
- A Published status.

If a record is missing required publication fields, do not display it as a valid published listing.

Provide a documented validation process so administrators can identify invalid rows.

Do not automatically delete invalid records from the spreadsheet.

---

### 5. GOOGLE APPS SCRIPT API

Implement a Google Apps Script web application that reads the configured spreadsheet.

The API must provide the following public read operations:

- List published jobs.
- Retrieve an individual published job.
- Retrieve public website settings.

Suggested operations:

`?action=listJobs`

`?action=getJob&slug=python-developer-example-company`

`?action=getSettings`

The actual deployed API URL must be configured through an environment variable in the frontend.

Suggested environment variable:

`VITE_JOBS_API_URL`

Do not place spreadsheet credentials or unrestricted access tokens in frontend code.

#### API behavior

- Return JSON.
- Validate requested actions.
- Return consistent response structures.
- Return only published, valid jobs through public endpoints.
- Support retrieving a job by its stable ID or unique slug.
- Handle missing worksheets.
- Handle missing or malformed rows.
- Normalize dates consistently.
- Preserve multiline job descriptions.
- Parse pipe-separated tags.
- Handle missing optional values.
- Avoid repeated spreadsheet reads for individual cells.
- Read data efficiently in batches.
- Support a reasonable caching strategy.
- Return useful error messages without exposing private spreadsheet contents.

The public API must be read-only.

There must be no public job-creation, job-editing, job-deletion or publishing endpoints.

Administrators manage the spreadsheet directly through Google Sheets permissions.

The spreadsheet itself must not be made publicly editable.

Document the Apps Script execution identity, deployment access settings and spreadsheet permissions.

---

### 6. WEBSITE ROUTES

Create the following routes:

`/`

Homepage.

`/jobs`

Complete job listing page.

`/jobs/:slug`

Individual job details page.

`/disclaimer`

Disclaimer page.

Do not create separate pages for:
- Companies.
- About Us.
- Contact Us.
- Privacy Policy.
- Admin Dashboard.
- Admin Login.

Privacy information must be accessible from the homepage, such as through a footer section or an accessible privacy overlay.

The disclaimer must have its own dedicated route.

The homepage must remain the primary entry point for the platform.

---

### 7. HOMEPAGE DESIGN

Build a polished, modern landing page.

The homepage must contain the following sections in this order:

#### A. Navigation bar

Include:
- Codeless AI Jobs logo or wordmark.
- Home navigation.
- Browse Jobs navigation.
- A prominent Browse Jobs button where appropriate.

Keep the navigation clean and responsive.

Do not include links to nonexistent pages.

#### B. Hero section

Create a visually appealing hero section with:

- A clear headline about discovering job opportunities.
- A concise supporting description.
- A job search input.
- A search button.
- A tag-based discovery experience.
- Optional featured tags derived from current published jobs.

Do not use fabricated job counts or other invented statistics.

The search interface should be prominent without making the hero unnecessarily tall.

#### C. Latest Jobs section

Display job cards from the published job dataset.

The section heading should be configurable or easy to change.

Sort jobs by date added, newest first, when valid dates are available.

Display a reasonable number of jobs on the homepage, such as six or eight, configurable through the Settings worksheet.

If there are fewer jobs than the configured limit, show the available jobs.

Do not show empty or fabricated cards.

If no jobs are available, display a clear empty state.

#### D. View More Jobs button

Place a View More Jobs button beneath the homepage job cards.

The button must navigate to:

`/jobs`

The full job listing page must display all eligible published listings through pagination.

#### E. Blog section

Include a visually appealing blog or career resources section.

The blog section may initially use a small collection of manually authored, static career articles stored in the frontend source code.

Do not create another worksheet or require a backend for blog management.

Do not fabricate testimonials, user success stories, company partnerships or employment statistics.

Each blog card should contain:
- Article title.
- Short summary.
- Optional publication date.
- Read More link.

If complete blog articles are implemented, provide actual readable content.

If only previews are implemented, do not create misleading links to nonexistent articles.

Keep the blog section easy to extend.

#### F. Call-to-action section

Create a CTA section encouraging users to explore job opportunities.

The heading and supporting text should be configurable through Google Sheets.

Include a button linking to `/jobs`.

#### G. Footer

Include:
- Codeless AI Jobs branding.
- A concise description of the platform.
- Privacy information link or accessible overlay.
- Disclaimer link to `/disclaimer`.
- Configured contact email, if provided.
- Copyright notice.

Do not invent contact details.

---

### 8. ALL JOBS PAGE

Route:

`/jobs`

This page lists all currently published and valid job listings.

Include:
- Search bar.
- Tag filters.
- Job cards.
- Result count.
- Pagination.
- Loading state.
- Error state.
- Empty state.
- Clear filters action.

The page must remain usable on mobile devices.

Use a sidebar for filters on larger screens and a mobile-friendly filter drawer on smaller screens.

Do not introduce category filters.

Do not require users to create accounts.

Do not implement application submission forms.

#### Search

Support keyword search across:
- Job title.
- Company name.
- Tags.

Where practical, also search the job description.

Search should be case-insensitive and should handle extra whitespace.

#### Tag filtering

Tags are the primary classification and filtering mechanism.

Derive the available tags dynamically from the published jobs returned by the API.

Allow administrators to introduce new tags by editing Google Sheets.

The frontend must automatically recognize newly introduced tags.

Users must be able to:
- Select one tag.
- Combine multiple tags.
- Remove selected tags.
- Clear all filters.

Multiple selected tags should use clearly documented matching behavior. Prefer AND matching by default, so each additional selected tag narrows the results to jobs containing all selected tags.

Provide a user-friendly interface that makes the active filters visible.

#### Sorting

Support:
- Newest first.
- Oldest first, when dates are available.

Do not add unnecessary salary or category filters because these are not part of the agreed data model.

#### Pagination

Use the configured page size.

Reset pagination when the user changes the search term or filters.

Keep the result count accurate.

Do not display Closed or Archived jobs in the default public results.

---

### 9. JOB CARD COMPONENT

Create one reusable JobCard component for the homepage and the `/jobs` page.

Each job card must display:

1. Company logo.
2. Company name.
3. Job title.
4. A short excerpt of the job description.
5. Two or three tags.
6. Date added, when available.
7. A clear View Details action.

The entire card may be clickable, but nested interactive controls must behave correctly and remain accessible.

Clicking a job card should open its individual job details page.

Do not put the external Apply Now button directly on the job card unless explicitly configured later. The primary card action should open the full job details page.

Do not display job thumbnails.

#### Company logos

Read the logo URL directly from the corresponding job record.

Requirements:
- Consistent logo container dimensions.
- Appropriate object-fit behavior.
- Preserved image aspect ratio.
- Useful alt text.
- Fallback for missing logos.
- Fallback for broken image URLs.
- No image uploads.

If a company logo is missing, display the configured default logo or a simple company-initials fallback.

Do not require a company to exist in a separate database.

---

### 10. INDIVIDUAL JOB DETAILS PAGE

Route:

`/jobs/:slug`

Every job must have a unique URL.

Use the slug to retrieve the correct record from the public job dataset.

If a slug is missing, duplicated or invalid, handle the condition safely.

Display:
- Company logo.
- Company name.
- Job title.
- All available job tags.
- Company website, if available.
- Company description, if available.
- Full job description.
- About the role, if available.
- Date added, if available.
- Last updated, where useful.

Do not display separate fields for:
- Eligibility.
- Required skills.
- Preferred skills.
- Responsibilities.
- Education.
- Experience.
- Employment type.
- Work mode.
- Salary.
- Categories.

Those details belong inside the administrator-provided job description and tags.

The website must preserve supported description formatting, including:
- Paragraphs.
- Headings.
- Bullet lists.
- Numbered lists.
- Links.
- Line breaks.

Use a safe rendering approach.

If HTML formatting is supported, sanitize untrusted content before rendering it.

If plain text is used, preserve paragraph breaks and provide readable typography.

#### Apply Now button

Include a prominent Apply Now button.

The button destination must come from the job's `application_url`.

Each job must redirect to its own configured destination.

Validate that application URLs use permitted schemes, preferably HTTPS.

Do not hardcode employer destinations.

Open external links in an appropriate manner and use safe link attributes when opening a new tab.

Display a brief notice that the visitor will be redirected to the company's external application website.

If an application URL is missing or invalid, do not display an active Apply Now button.

Do not accept job applications on the Codeless AI Jobs website.

#### Related jobs

Display a small related-jobs section based on overlapping tags.

Do not display the current job as its own related result.

If there are no suitable related jobs, hide the section.

---

### 11. COMPANY INFORMATION

Do not create a Companies worksheet.

Do not require company IDs.

Every job row contains its own company information.

Required company field:
- Company name.

Optional company fields:
- Company logo URL.
- Company website.
- Company description.

The same company may appear in multiple job records.

The website should display the company information belonging to the selected job.

Do not attempt to maintain a separate master company database.

---

### 12. TAG SYSTEM

Do not create a Categories worksheet.

Do not hardcode a list of allowed tags.

Administrators may enter any relevant tags.

Examples:
- Python Developer.
- Software Development.
- Artificial Intelligence.
- Machine Learning.
- Work From Home.
- Hybrid.
- Full-Time.
- Part-Time.
- Internship.
- Entry Level.
- Remote.
- Frontend Development.
- Backend Development.
- UI/UX Design.

These examples are not restrictions.

Parse tags from each job's `tags` cell.

Normalize whitespace and perform case-insensitive matching while preserving a readable display format.

Prevent duplicate tags within the same job when their normalized values are identical.

Derive the public filter options from actual published listings.

The homepage may display a small selection of popular or featured tags derived from available job data.

Do not create categories that require manual maintenance elsewhere.

---

### 13. SETTINGS AND PRIVACY

Load public website settings from Google Sheets.

Provide sensible fallback defaults.

Settings may control:
- Site name.
- Site description.
- Contact email.
- Homepage job count.
- Default company logo.
- CTA content.
- Announcement.
- Cache duration.

Do not expose private information through public settings.

The homepage footer must provide access to the privacy information.

The privacy information must describe the actual behavior of the website, including external links and any analytics or logging implemented.

Do not claim that the website collects no personal data unless that has been verified.

Avoid unnecessary analytics and third-party trackers.

If analytics are added, document the data collected and any required privacy controls.

---

### 14. DISCLAIMER PAGE

Route:

`/disclaimer`

Explain that:
- The platform aggregates job opportunities from different companies and sources.
- Codeless AI Jobs is not necessarily the employer for any listed vacancy.
- Companies control their own recruitment and application processes.
- Job details and application links may change.
- Users should verify information with the employer.
- Codeless AI Jobs does not guarantee employment.
- Company names and logos belong to their respective owners.
- A listing does not imply an official partnership with an employer.

Keep the disclaimer accessible from the footer.

---

### 15. GOOGLE APPS SCRIPT IMPLEMENTATION

Provide complete Apps Script source code.

The script must:
- Read the Jobs worksheet.
- Read the Settings worksheet.
- Return published jobs.
- Exclude invalid and unpublished records.
- Retrieve jobs by slug or ID.
- Parse pipe-separated tags.
- Preserve job description formatting.
- Normalize dates.
- Handle empty cells.
- Return JSON.
- Handle API errors safely.
- Read rows efficiently.
- Cache public data when appropriate.

The public API must be read-only.

Do not implement spreadsheet write operations through publicly accessible endpoints.

Configure the script to access the spreadsheet through its execution identity and permissions.

Do not make the spreadsheet publicly editable.

Document the configuration steps, including:
1. Creating the spreadsheet.
2. Adding the required headers.
3. Obtaining the spreadsheet ID.
4. Configuring the Apps Script project.
5. Authorizing spreadsheet access.
6. Deploying the web application.
7. Setting the correct API URL in the frontend.
8. Testing public access.
9. Understanding Apps Script quotas and deployment limitations.

Provide useful error messages without revealing private spreadsheet data.

---

### 16. STATIC WEBSITE AND SEO

The website is hosted on GitHub Pages, so individual routes must work with static hosting.

Implement a reliable strategy for individual job URLs.

Prefer generating static HTML pages for eligible published jobs at build time.

The build process should:
1. Fetch published job data from the Apps Script API.
2. Generate individual job pages.
3. Include the correct job title and description in the generated HTML.
4. Generate appropriate page metadata.
5. Generate canonical URLs.
6. Generate Open Graph metadata.
7. Generate a sitemap.
8. Deploy the resulting static files through GitHub Actions.

Implement valid JobPosting structured data when a listing meets the applicable requirements.

Use only real information present in the job record.

Do not invent employment types, salary values, locations, deadlines, or employer details.

Ensure expired or closed listings are not represented as active opportunities.

If the API is unavailable during the build, fail clearly or use an explicitly configured last-known-good snapshot. Do not silently generate fake job pages.

Document the difference between live API updates and static HTML updates.

The administrator must be able to publish jobs without editing the frontend source code.

However, SEO-generated HTML and the sitemap must be refreshed through a build and deployment, unless another documented rendering mechanism is implemented.

---

### 17. GITHUB PAGES DEPLOYMENT

Prepare the project for:

`jobs.codelessai.in`

Include:
- Vite production configuration.
- GitHub Actions workflow.
- Automated build and deployment.
- Custom-domain setup documentation.
- DNS configuration instructions.
- HTTPS instructions.
- API endpoint configuration.
- `.env.example`.

Use a configurable variable:

`VITE_JOBS_API_URL`

Do not commit credentials.

Because the site uses a custom domain at the root, configure the Vite base path appropriately.

Ensure direct navigation to job detail pages works after deployment.

Do not rely on client-side navigation alone if a route cannot be opened directly or refreshed on GitHub Pages.

Use generated static job pages or another reliable static-hosting-compatible routing solution.

---

### 18. PERFORMANCE AND ERROR HANDLING

Implement:
- Efficient API requests.
- Appropriate caching.
- Loading indicators.
- Error states.
- Empty states.
- Broken-image fallbacks.
- Responsive job cards.
- Pagination.
- Safe URL handling.
- Graceful handling of missing optional fields.

Avoid unnecessary repeated requests to Google Apps Script.

The website should remain usable when some optional data is unavailable.

If the API fails, show a clear error message and a retry option rather than inventing job listings.

Do not display fabricated statistics or job counts.

---

### 19. VISUAL DESIGN

Use a clean, professional design appropriate for a technology startup.

Preferred visual direction:
- White or very light background.
- Dark typography.
- Blue accent color.
- Clear spacing.
- Modern job cards.
- Subtle borders and shadows.
- Readable job descriptions.
- Responsive navigation.
- Simple iconography.
- Strong visual hierarchy.

The homepage must prioritize finding jobs quickly.

Avoid:
- Excessive animations.
- Huge decorative hero sections.
- Unnecessary gradients.
- Overcrowded cards.
- Fake logos.
- Fake company partnerships.
- Invented statistics.
- Placeholder listings in production.

The design should feel polished and trustworthy on desktop and mobile.

---

### 20. ACCESSIBILITY

Implement:
- Semantic HTML.
- Keyboard-accessible navigation.
- Visible focus indicators.
- Accessible form labels.
- Sufficient contrast.
- Appropriate logo alt text.
- Mobile-friendly controls.
- Reduced-motion support.

Do not rely on color alone to communicate important information.

---

### 21. TESTING

Test the following:

**Spreadsheet integration**
- Published jobs are returned.
- Draft jobs are excluded.
- Closed jobs are excluded.
- Archived jobs are excluded.
- Missing optional fields are handled.
- Invalid records are excluded.
- Tags are parsed correctly.
- Multiline descriptions are preserved.
- Duplicate slugs are handled safely.

**Frontend**
- Homepage renders.
- Job cards load.
- Search works.
- Tag filtering works.
- Multiple filters work together.
- Pagination works.
- View More Jobs opens `/jobs`.
- Individual job pages load.
- Apply Now uses the correct URL.
- Missing logos display fallbacks.
- Missing optional sections remain hidden.
- Error and empty states work.
- Mobile layouts work.

**SEO**
- Individual job URLs work directly.
- Page titles are correct.
- Metadata matches each job.
- Sitemap generation works.
- Structured data is valid when implemented.
- Closed jobs are not advertised as active.

**Deployment**
- Production build succeeds.
- GitHub Actions deployment succeeds.
- Custom-domain configuration is documented.
- No credentials are exposed in the frontend.
- Direct links work after deployment.

Do not claim tests have passed unless they have actually been executed.

Document all remaining issues and manual configuration steps.

---

### 22. REQUIRED DELIVERABLES

Produce:
1. Complete React + Vite + TypeScript source code.
2. Complete Google Apps Script source code.
3. Google Sheets schema documentation.
4. Sample spreadsheet data for development only.
5. Job card component.
6. Homepage.
7. Complete jobs listing page.
8. Individual job detail page.
9. Search and tag filtering.
10. Pagination.
11. Blog section.
12. CTA section.
13. Disclaimer page.
14. Privacy information on the homepage.
15. Static job page generation.
16. SEO metadata and sitemap generation.
17. GitHub Actions deployment workflow.
18. `.env.example`.
19. Complete README.
20. Setup and troubleshooting documentation.

The README must explain how an administrator can add a company and publish a new job by editing Google Sheets, without editing the source code.

---

### 23. FINAL ACCEPTANCE CRITERIA

The project is complete when:
- The website can be deployed to GitHub Pages.
- Google Sheets is the sole primary job-data store.
- Google Apps Script provides the public read API.
- There are exactly two application-data worksheets: Jobs and Settings.
- There is no separate company database.
- There is no categories worksheet.
- Tags are dynamic and administrator-defined.
- Each job is an independent record.
- Company information is stored directly on each job.
- Job descriptions remain flexible and can contain complete formatted content.
- No separate eligibility, skills, education, experience, salary, responsibilities, or employment-type columns are required.
- Company logos are loaded from URLs.
- No thumbnail images or uploads are required.
- The homepage contains the hero, latest job cards, View More Jobs button, blog section, CTA and footer.
- The `/jobs` page supports search, tag filtering and pagination.
- Every job has an individual detail page.
- The Apply Now button uses the correct application URL.
- Privacy information is accessible from the homepage.
- The disclaimer has its own route.
- The website does not require user accounts.
- The website does not require a dedicated server or paid database.
- Deployment and maintenance are documented.
- The build succeeds and actual test results are recorded.

### FINAL EXECUTION INSTRUCTION

Build the complete application, not just a design mockup.

Implement the frontend, Google Apps Script API, spreadsheet schema, static page generation, deployment configuration and documentation.

Do not reintroduce features or infrastructure that contradict the agreed requirements.

Do not create unnecessary worksheets, fields, company records, category systems, admin pages, image uploads or backend services.

Keep the project simple, professional, secure, maintainable and suitable for a startup operating with minimal infrastructure.

Begin implementation immediately and continue until the code and documentation are ready for configuration and deployment.