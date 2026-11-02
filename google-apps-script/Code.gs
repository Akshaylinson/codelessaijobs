/**
 * @file Code.gs
 * Codeless AI Jobs - Google Apps Script Web Application
 * 
 * Provides a high-performance, read-only JSON API for the public website.
 * Reads directly from "Codeless AI Jobs Database" Google Spreadsheet.
 * 
 * Endpoints:
 *   GET ?action=listJobs           - Returns all published, valid jobs + site settings
 *   GET ?action=getJob&slug=<slug> - Returns a single published job by slug or ID
 *   GET ?action=getSettings        - Returns public settings
 */

// Configuration: If bound directly to the spreadsheet (Extensions > Apps Script),
// SpreadsheetApp.getActiveSpreadsheet() will be used automatically.
// If deployed as a standalone script, set the SPREADSHEET_ID below:
var SPREADSHEET_ID = ""; // Leave blank if container-bound to the sheet

var CACHE_EXPIRATION_SECONDS = 300; // 5 minutes cache

/**
 * Main HTTP GET handler
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = (params && params.action) ? params.action : "listJobs";

    switch (action) {
      case "listJobs":
        return handleListJobs();

      case "getJob":
        var slug = params.slug || params.id;
        return handleGetJob(slug);

      case "getSettings":
        return handleGetSettings();

      default:
        return createJsonResponse({
          success: false,
          error: "Invalid action. Supported actions: listJobs, getJob, getSettings"
        }, 400);
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: "An unexpected server error occurred: " + error.message
    }, 500);
  }
}

/**
 * Retrieves the spreadsheet reference
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Action: listJobs
 * Returns all valid published jobs and public settings.
 */
function handleListJobs() {
  var cache = CacheService.getScriptCache();
  var cacheKey = "codeless_jobs_list_v1";
  var cached = cache.get(cacheKey);

  if (cached) {
    try {
      var cachedObj = JSON.parse(cached);
      return createJsonResponse(cachedObj);
    } catch (e) {
      // ignore cache parse error and refetch
    }
  }

  var ss = getSpreadsheet();
  if (!ss) {
    return createJsonResponse({ success: false, error: "Spreadsheet could not be accessed." }, 500);
  }

  var jobsSheet = ss.getSheetByName("Jobs");
  if (!jobsSheet) {
    return createJsonResponse({ success: false, error: "Jobs worksheet not found in spreadsheet." }, 404);
  }

  var settings = readSettings(ss);
  var jobs = readPublishedJobs(jobsSheet);

  var payload = {
    success: true,
    count: jobs.length,
    jobs: jobs,
    settings: settings,
    timestamp: new Date().toISOString()
  };

  // Cache response
  try {
    var serialized = JSON.stringify(payload);
    // CacheService limit per entry is 100KB
    if (serialized.length < 95000) {
      var ttl = (settings.api_cache_duration && !isNaN(Number(settings.api_cache_duration)))
        ? Number(settings.api_cache_duration)
        : CACHE_EXPIRATION_SECONDS;
      cache.put(cacheKey, serialized, Math.min(ttl, 21600));
    }
  } catch (e) {
    // Cache put failed, non-fatal
  }

  return createJsonResponse(payload);
}

/**
 * Action: getJob
 * Returns an individual published job by unique slug or job_id.
 */
function handleGetJob(slug) {
  if (!slug || !slug.trim()) {
    return createJsonResponse({ success: false, error: "Missing required 'slug' parameter." }, 400);
  }

  var ss = getSpreadsheet();
  var jobsSheet = ss.getSheetByName("Jobs");
  if (!jobsSheet) {
    return createJsonResponse({ success: false, error: "Jobs worksheet not found." }, 404);
  }

  var jobs = readPublishedJobs(jobsSheet);
  var target = slug.trim().toLowerCase();

  for (var i = 0; i < jobs.length; i++) {
    var j = jobs[i];
    if (j.slug.toLowerCase() === target || j.job_id.toLowerCase() === target) {
      return createJsonResponse({
        success: true,
        job: j
      });
    }
  }

  return createJsonResponse({
    success: false,
    error: "Job not found with slug or ID: " + slug
  }, 404);
}

/**
 * Action: getSettings
 * Returns public site settings.
 */
function handleGetSettings() {
  var ss = getSpreadsheet();
  var settings = readSettings(ss);
  return createJsonResponse({
    success: true,
    settings: settings
  });
}

/**
 * Efficiently reads published jobs in batch with full validation.
 * Expected exact columns (14):
 * 1. job_id
 * 2. slug
 * 3. job_title
 * 4. company_name
 * 5. company_logo_url
 * 6. company_website
 * 7. company_description
 * 8. job_description
 * 9. about_role
 * 10. application_url
 * 11. tags
 * 12. status
 * 13. date_added
 * 14. last_updated
 */
function readPublishedJobs(sheet) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  if (values.length <= 1) {
    return []; // No data rows
  }

  var headers = values[0];
  var jobs = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    
    // Check status
    var status = String(row[11] || "").trim();
    if (status !== "Published") {
      continue; // Exclude Draft, Closed, Archived, or empty
    }

    var jobId = String(row[0] || "").trim();
    var slug = String(row[1] || "").trim();
    var jobTitle = String(row[2] || "").trim();
    var companyName = String(row[3] || "").trim();
    var companyLogo = String(row[4] || "").trim();
    var companyWebsite = String(row[5] || "").trim();
    var companyDesc = String(row[6] || "").trim();
    var jobDesc = String(row[7] || "").trim();
    var aboutRole = String(row[8] || "").trim();
    var appUrl = String(row[9] || "").trim();
    var rawTags = String(row[10] || "").trim();
    var dateAdded = normalizeDate(row[12]);
    var lastUpdated = normalizeDate(row[13]);

    // Validation: Mandatory publication fields
    if (!jobId || !slug || !jobTitle || !companyName || !jobDesc || !appUrl) {
      continue; // Skip invalid records missing required fields
    }

    // Must have at least one valid tag
    var tags = parsePipeTags(rawTags);
    if (tags.length === 0) {
      continue;
    }

    // Basic URL check for application_url
    if (!isValidHttpUrl(appUrl)) {
      continue;
    }

    jobs.push({
      job_id: jobId,
      slug: slug,
      job_title: jobTitle,
      company_name: companyName,
      company_logo_url: companyLogo || null,
      company_website: companyWebsite || null,
      company_description: companyDesc || null,
      job_description: jobDesc,
      about_role: aboutRole || null,
      application_url: appUrl,
      tags: tags,
      status: "Published",
      date_added: dateAdded,
      last_updated: lastUpdated || null
    });
  }

  // Sort newest first by default
  jobs.sort(function(a, b) {
    var timeA = a.date_added ? new Date(a.date_added).getTime() : 0;
    var timeB = b.date_added ? new Date(b.date_added).getTime() : 0;
    return timeB - timeA;
  });

  return jobs;
}

/**
 * Reads settings key/value pairs from Settings worksheet
 */
function readSettings(ss) {
  var defaultSettings = {
    site_name: "Codeless AI Jobs",
    site_description: "Discover verified tech, AI, fullstack, and cloud engineering opportunities.",
    contact_email: "hello@codelessai.in",
    jobs_per_page: 8,
    homepage_job_count: 6,
    api_cache_duration: 300,
    default_company_logo: "",
    cta_heading: "Ready to Land Your Next AI or Engineering Role?",
    cta_description: "Browse verified opportunities with transparent descriptions and direct application links.",
    announcement: ""
  };

  if (!ss) return defaultSettings;
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) return defaultSettings;

  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return defaultSettings;

  for (var r = 1; r < values.length; r++) {
    var key = String(values[r][0] || "").trim();
    var val = values[r][1];

    if (key && val !== undefined && val !== null) {
      defaultSettings[key] = String(val).trim();
    }
  }

  return defaultSettings;
}

/**
 * Parses pipe-separated tags into a clean deduplicated array
 */
function parsePipeTags(raw) {
  if (!raw) return [];
  var parts = String(raw).split("|");
  var seen = {};
  var tags = [];

  for (var i = 0; i < parts.length; i++) {
    var tag = parts[i].trim();
    if (!tag) continue;
    var lower = tag.toLowerCase();
    if (!seen[lower]) {
      seen[lower] = true;
      tags.push(tag);
    }
  }

  return tags;
}

/**
 * Normalizes date objects or text into ISO date strings (YYYY-MM-DD)
 */
function normalizeDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    try {
      return Utilities.formatDate(val, "GMT", "yyyy-MM-dd");
    } catch (e) {
      return val.toISOString().slice(0, 10);
    }
  }
  var str = String(val).trim();
  if (!str) return "";
  
  var d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return str;
}

/**
 * Validates HTTP/HTTPS URL
 */
function isValidHttpUrl(str) {
  if (!str) return false;
  var lower = str.toLowerCase();
  return lower.indexOf("http://") === 0 || lower.indexOf("https://") === 0;
}

/**
 * Creates standardized CORS-enabled JSON output
 */
function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
