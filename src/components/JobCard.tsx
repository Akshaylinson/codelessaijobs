import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Building2 } from 'lucide-react';
import { Job } from '../types/job';
import { generateExcerpt, formatDate } from '../utils/jobUtils';

interface JobCardProps {
  job: Job;
  defaultLogo?: string;
  onTagClick?: (tag: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, defaultLogo, onTagClick }) => {
  const [imageError, setImageError] = useState(false);

  const logoUrl = job.company_logo_url?.trim() || defaultLogo?.trim();
  const showFallbackAvatar = !logoUrl || imageError;

  // Generate initials (e.g., "Anthropic" -> "AN", "Mistral AI" -> "MA")
  const initials = job.company_name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'CO';

  // Display top 3 tags on card
  const visibleTags = (job.tags || []).slice(0, 3);
  const remainingTagCount = (job.tags || []).length - visibleTags.length;

  return (
    <article className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 sm:p-6 overflow-hidden">
      <div>
        {/* Header: Logo, Company Name, Date */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {showFallbackAvatar ? (
                <div
                  className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-wider"
                  aria-label={`${job.company_name} logo`}
                >
                  {initials}
                </div>
              ) : (
                <img
                  src={logoUrl}
                  alt={`${job.company_name} logo`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain object-center p-1"
                  loading="lazy"
                />
              )}
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[180px] sm:max-w-[220px]">{job.company_name}</span>
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                <Link
                  to={`/jobs/${job.slug}`}
                  className="focus:outline-hidden focus-visible:underline"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {job.job_title}
                </Link>
              </h3>
            </div>
          </div>

          {job.date_added && (
            <time
              dateTime={job.date_added}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 shrink-0 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md"
            >
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDate(job.date_added)}</span>
            </time>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {generateExcerpt(job.job_description, 140)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 relative z-10">
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
              className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200 px-2.5 py-1 rounded-md transition-colors"
            >
              {tag}
            </button>
          ))}
          {remainingTagCount > 0 && (
            <span className="text-xs text-slate-600 font-medium px-1.5 py-0.5">
              +{remainingTagCount} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
        <div className="sm:hidden text-xs text-slate-600">
          {job.date_added ? formatDate(job.date_added) : 'Verified Listing'}
        </div>
        <div className="hidden sm:block text-xs text-slate-600">
          Direct employer application
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all">
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </article>
  );
};
