import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { Job, SiteSettings } from '../types/job';
import { JobCard } from './JobCard';

interface LatestJobsSectionProps {
  jobs: Job[];
  settings?: SiteSettings;
  loading?: boolean;
}

export const LatestJobsSection: React.FC<LatestJobsSectionProps> = ({
  jobs,
  settings,
  loading = false,
}) => {
  const navigate = useNavigate();
  const limit = settings?.homepage_job_count || 6;
  const displayJobs = jobs.slice(0, limit);

  const handleTagClick = (tag: string) => {
    navigate(`/jobs?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-blue-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Published Roles
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Browse all open positions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <div className="w-24 h-3 bg-slate-200 rounded" />
                    <div className="w-36 h-4 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-slate-100 rounded" />
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-slate-200 rounded" />
                  <div className="w-20 h-6 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : displayJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayJobs.map((job) => (
                <JobCard
                  key={job.job_id}
                  job={job}
                  defaultLogo={settings?.default_company_logo}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>

            {/* View More Jobs Button */}
            <div className="mt-10 sm:mt-12 text-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 hover:text-blue-600 font-bold text-base shadow-xs hover:shadow-md transition-all duration-200"
              >
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>View More Jobs</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Published Roles Yet</h3>
            <p className="text-sm text-slate-500 mb-6">
              New job vacancies are currently being curated and published by our administrators.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Refresh Directory
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
