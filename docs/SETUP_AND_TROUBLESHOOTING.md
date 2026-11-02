# Setup and Troubleshooting Guide: Codeless AI Jobs

This guide provides step-by-step instructions to connect **Google Sheets**, deploy the **Google Apps Script** read-only API, configure the frontend, and deploy to **GitHub Pages** with custom domain `jobs.codelessai.in`.

---

## Step 1: Create the Google Spreadsheet

1. Open [Google Sheets](https://sheets.new) in your Google account.
2. Title the spreadsheet: **`Codeless AI Jobs Database`**.
3. Create two worksheets:
   - **`Jobs`**
   - **`Settings`**
4. Import or paste the sample CSV data:
   - In `Jobs`, import or copy the headers and rows from `data/sample-jobs.csv`.
   - In `Settings`, import or copy the headers and rows from `data/sample-settings.csv`.
5. Keep the spreadsheet private to your Google account. **Do not make the spreadsheet publicly editable.**

---

## Step 2: Deploy Google Apps Script Web App

1. In your spreadsheet, click **Extensions** > **Apps Script**.
2. Replace any code in `Code.gs` with the complete script found in `google-apps-script/Code.gs` in this repository.
3. Because the script is bound to the spreadsheet, `SPREADSHEET_ID` can remain empty (`""`).
4. Click **Save** (disk icon).
5. Click **Deploy** (blue button in top right) > **New deployment**.
6. Click the gear icon next to "Select type" and select **Web app**.
7. Configure the deployment settings:
   - **Description**: `Codeless AI Jobs Public API v1`
   - **Execute as**: `Me (your email address)`
   - **Who has access**: `Anyone` *(Crucial: allows the public frontend to read JSON without requiring Google sign-in)*
8. Click **Deploy**.
9. Authorize the script when prompted by Google (*Review permissions* > choose your account > *Advanced* > *Go to Codeless AI Jobs Database (unsafe)* > *Allow*).
10. Copy the **Web App URL**. It will look like:
    ```
    https://script.google.com/macros/s/AKfycbx.../exec
    ```

---

## Step 3: Test the API Endpoint

Open your browser and test the URL with the action parameter:
```
https://script.google.com/macros/s/AKfycbx.../exec?action=listJobs
```
You should see a clean JSON response containing:
```json
{
  "success": true,
  "count": 6,
  "jobs": [ ... ],
  "settings": { ... },
  "timestamp": "2026-11-02T..."
}
```

---

## Step 4: Configure Frontend Environment Variables

1. In your local or deployment environment, create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Set the `VITE_JOBS_API_URL` variable:
   ```env
   VITE_JOBS_API_URL="https://script.google.com/macros/s/AKfycbx.../exec"
   ```
3. Test locally by running:
   ```bash
   npm run dev
   ```
   The site will now pull live jobs directly from your Google Sheet. If `VITE_JOBS_API_URL` is omitted or temporarily unreachable, the frontend automatically falls back to verified seed data with a friendly reconnection prompt.

---

## Step 5: Custom Domain & GitHub Pages Setup (`jobs.codelessai.in`)

### 1. GitHub Repository Secrets
In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**:
- **Name**: `VITE_JOBS_API_URL`
- **Value**: Your Google Apps Script Web App URL from Step 2.

### 2. DNS Configuration
In your DNS provider (Cloudflare, GoDaddy, Namecheap, Route 53):
- **Record Type**: `CNAME`
- **Host / Name**: `jobs`
- **Target / Value**: `<your-github-username>.github.io`
- **TTL**: `Auto` or `300`

### 3. GitHub Pages Settings
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment**:
   - **Source**: Select `GitHub Actions`.
3. Under **Custom domain**:
   - Enter `jobs.codelessai.in`.
   - Check **Enforce HTTPS** (GitHub will provision a free Let's Encrypt SSL certificate once DNS resolves).
4. Push your changes to the `main` branch. The included `.github/workflows/deploy.yml` workflow will automatically test, build, generate static SEO pages, and deploy to GitHub Pages.

---

## Troubleshooting Guide

### Issue 1: "Job count is 0 or my new job isn't showing up"
- **Check Status**: The `status` column must be exactly `Published` (case-sensitive). Rows marked `Draft`, `Closed`, or `Archived` are deliberately hidden.
- **Check Required Fields**: Every published job must have: `job_id`, `slug`, `job_title`, `company_name`, `job_description`, and a valid `application_url` starting with `https://` or `http://`.
- **Check Tags**: At least one pipe-separated tag is required.
- **Cache TTL**: Apps Script caches API responses for 5 minutes (`api_cache_duration: 300`). Wait 5 minutes or click "Try Reconnecting" in the UI to refresh.

### Issue 2: "Broken logo images"
- Provide a direct image link ending in `.png`, `.jpg`, `.svg`, or a CDN link that returns an image content-type.
- If a logo URL fails or is empty, Codeless AI Jobs automatically displays a stylized fallback badge containing the company's initials with high-contrast gradients.

### Issue 3: "Google Apps Script returns HTML instead of JSON"
- Ensure **Who has access** is set to `Anyone` in the Apps Script deployment settings. If set to "Only myself", unauthenticated requests will receive a Google sign-in redirect page instead of JSON.
- When updating Apps Script code, always create a **New version** under Deploy > Manage deployments > Edit > New Version > Deploy.

### Issue 4: "Direct navigation to /jobs/my-slug gives 404 on GitHub Pages"
- The build script (`scripts/generate-static.ts`) automatically pre-renders each job route as `/jobs/<slug>/index.html` during `npm run build`, and generates a `404.html` SPA fallback.
- Run `npm run build` to verify all slug directories are generated in `dist/jobs/`.
