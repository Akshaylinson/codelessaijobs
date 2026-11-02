import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Tag,
  Share2,
  Check,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Job, SiteSettings } from '../types/job';
import { JobCard } from '../components/JobCard';
import {
  formatDate,
  getRelatedJobs,
  sanitizeUrl,
  isValidUrl,
} from '../utils/jobUtils';

interface JobDetailPageProps {
  jobs: Job[];
  settings?: SiteSettings;
  loading: boolean;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  jobs,
  settings,
  loading,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

  // Find job matching slug or ID
  const job = useMemo(() => {
    if (!slug) return null;
    const clean = slug.trim().toLowerCase();
    return jobs.find(
      (j) => j.slug.toLowerCase() === clean || j.job_id.toLowerCase() === clean
    );
  }, [jobs, slug]);

  // Find related jobs
  const relatedJobs = useMemo(() => {
    if (!job) return [];
    return getRelatedJobs(job, jobs, 3);
  }, [job, jobs]);

  // Update dynamic page title and inject JSON-LD JobPosting schema
  useEffect(() => {
    if (job) {
      document.title = `${job.job_title} at ${job.company_name} | Codeless AI Jobs`;

      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          `Apply for ${job.job_title} at ${job.company_name}. Curated job opportunity on Codeless AI Jobs.`
        );
      }

      // Inject JSON-LD JobPosting
      const scriptId = 'jobposting-jsonld';
      let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }

      const jobPostingData = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.job_title,
        description: job.job_description,
        datePosted: job.date_added || new Date().toISOString().slice(0, 10),
        hiringOrganization: {
          '@type': 'Organization',
          name: job.company_name,
          sameAs: job.company_website || undefined,
          logo: job.company_logo_url || undefined,
        },
        jobLocationType: job.tags.some((t) => t.toLowerCase() === 'remote')
          ? 'TELECOMMUTE'
          : undefined,
        employmentType: job.tags.some((t) => t.toLowerCase() === 'internship')
          ? 'INTERN'
          : job.tags.some((t) => t.toLowerCase() === 'part-time')
          ? 'PART_TIME'
          : 'FULL_TIME',
      };

      scriptTag.textContent = JSON.stringify(jobPostingData);

      return () => {
        const tag = document.getElementById(scriptId);
        if (tag) tag.remove();
      };
    }
  }, [job]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleApplyClick = () => {
    const validUrl = sanitizeUrl(job?.application_url);
    if (!validUrl) return;
    setShowRedirectModal(true);
  };

  const proceedToExternalApplication = () => {
    const validUrl = sanitizeUrl(job?.application_url);
    setShowRedirectModal(false);
    if (validUrl) {
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 animate-pulse space-y-6">
          <div className="w-24 h-4 bg-slate-200 rounded" />
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-slate-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="w-48 h-6 bg-slate-200 rounded" />
              <div className="w-32 h-4 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="w-full h-32 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Job Opportunity Not Found</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The requested listing may have expired, closed, or the URL slug &ldquo;{slug}&rdquo; is invalid.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Active Listings</span>
        </Link>
      </div>
    );
  }

  const logoUrl = job.company_logo_url?.trim() || settings?.default_company_logo?.trim();
  const showFallback = !logoUrl || imageError;
  const initials =
    job.company_name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'CO';

  const sanitizedAppUrl = sanitizeUrl(job.application_url);
  const companyWebsite = sanitizeUrl(job.company_website);

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & Share */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Jobs</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            aria-label="Share this job opportunity"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Role</span>
              </>
            )}
          </button>
        </div>

        {/* Main Job Card & Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-8 mb-8">

          {/* Logo + Company + Apply row (desktop) / stacked (mobile) */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 pb-6 border-b border-slate-100">

            {/* Left: Logo + Company + Title + Meta */}
            <div className="flex items-start gap-4 min-w-0">
              {/* Logo */}
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                {showFallback ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl tracking-wider">
                    {initials}
                  </div>
                ) : (
                  <img
                    src={logoUrl}
                    alt={`${job.company_name} logo`}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-contain object-center p-1"
                  />
                )}
              </div>

              {/* Company name + website + title + meta */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-700">{job.company_name}</span>
                  {companyWebsite && (
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      <Globe className="w-3 h-3" />
                      <span>Company Website</span>
                    </a>
                  )}
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight break-words">
                  {job.job_title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5 font-medium">
                  {job.date_added && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Posted {formatDate(job.date_added)}</span>
                    </div>
                  )}
                  {job.last_updated && job.last_updated !== job.date_added && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {formatDate(job.last_updated)}</span>
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Opportunity</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Now — right on desktop, full-width below on mobile */}
            <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-1.5">
              {sanitizedAppUrl ? (
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.01]"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Application destination unavailable
                </span>
              )}
              <span className="text-[11px] text-slate-400 text-center sm:text-right">
                Redirects to employer&rsquo;s official portal
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Role & Skill Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/jobs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Optional About Role Callout Box */}
        {job.about_role && (
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl border border-blue-200/80 p-6 sm:p-7 mb-8">
            <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>About the Role</span>
            </div>
            <p className="text-base text-slate-800 leading-relaxed font-medium">
              {job.about_role}
            </p>
          </div>
        )}

        {/* Full Job Description Section */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 pb-4 border-b border-slate-100 mb-6">
            Complete Job Description
          </h2>

          {/* Render formatted multiline text preserving paragraphs, headings, bullet lists */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {job.job_description
              .replace(/^(#{1,4}\s+[^\n]+)/gm, '\n\n$1\n\n')
              .split(/\n\s*\n/)
              .map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Check for markdown headings
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3
                      key={idx}
                      className="text-lg sm:text-xl font-bold text-slate-900 pt-4 pb-1 text-slate-900"
                    >
                      {trimmed.replace(/^###\s+/, '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl sm:text-2xl font-bold text-slate-900 pt-5 pb-1"
                    >
                      {trimmed.replace(/^##\s+/, '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('# ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl sm:text-2xl font-bold text-slate-900 pt-5 pb-1"
                    >
                      {trimmed.replace(/^#\s+/, '')}
                    </h2>
                  );
                }

                // Check for bullet list
                if (
                  trimmed.startsWith('- ') ||
                  trimmed.startsWith('* ') ||
                  trimmed.startsWith('• ') ||
                  trimmed.includes('\n- ') ||
                  trimmed.includes('\n* ')
                ) {
                  const lines = trimmed.split('\n').filter(Boolean);
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-2 text-slate-700 my-2">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx}>{line.replace(/^[-*•]\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }

                // Normal paragraph with line breaks
                return (
                  <p key={idx} className="leading-relaxed">
                    {trimmed.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < trimmed.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                );
              })}
          </div>

          {/* Bottom Apply Now Prompt */}
          {sanitizedAppUrl && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Interested in this position?
                </h4>
                <p className="text-xs text-slate-500">
                  Submit your application directly through {job.company_name}&rsquo;s portal.
                </p>
              </div>
              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                <span>Apply on Company Site</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Optional Company Description Card */}
        {job.company_description && (
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 mb-8">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>About {job.company_name}</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {job.company_description}
            </p>
          </section>
        )}

        {/* Related Jobs Section */}
        {relatedJobs.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Related Job Opportunities
              </h2>
              <Link
                to="/jobs"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
              >
                View all openings
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard
                  key={rJob.job_id}
                  job={rJob}
                  defaultLogo={settings?.default_company_logo}
                  onTagClick={(t) => navigate(`/jobs?tag=${encodeURIComponent(t)}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* External Redirection Modal */}
      {showRedirectModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="redirect-modal-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <ExternalLink className="w-6 h-6" />
            </div>

            <h3 id="redirect-modal-title" className="text-lg font-bold text-slate-900 mb-2">
              Leaving Codeless AI Jobs
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You are being redirected to <strong>{job.company_name}&rsquo;s</strong> official job portal to complete and submit your application.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRedirectModal(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={proceedToExternalApplication}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs transition-colors"
              >
                Continue to Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
