import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Job, SiteSettings } from '../types/job';
import { JobCard } from '../components/JobCard';
import { TagFilter } from '../components/TagFilter';
import { Pagination } from '../components/Pagination';
import {
  filterJobs,
  paginateJobs,
  extractUniqueTags,
} from '../utils/jobUtils';

interface JobsPageProps {
  jobs: Job[];
  settings?: SiteSettings;
  loading: boolean;
  error?: string;
  onRefresh?: () => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  settings,
  loading,
  error,
  onRefresh,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from search parameters if present
  const queryParam = searchParams.get('q') || '';
  const tagParam = searchParams.get('tag') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagParam ? [tagParam] : []
  );
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions: { value: 'newest' | 'oldest'; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  // Sync state if URL query params change (e.g. from Hero link)
  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    if (tagParam && !selectedTags.includes(tagParam)) {
      setSelectedTags([tagParam]);
      setCurrentPage(1);
    }
  }, [tagParam]);

  // Derive unique tags from published jobs dynamically
  const availableTags = useMemo(() => extractUniqueTags(jobs), [jobs]);

  // Filter jobs based on active search, selected tags, and sort
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, searchQuery, selectedTags, sortOrder);
  }, [jobs, searchQuery, selectedTags, sortOrder]);

  // Paginate filtered results
  const perPage = settings?.jobs_per_page || 8;
  const paginationResult = useMemo(() => {
    return paginateJobs(filteredJobs, currentPage, perPage);
  }, [filteredJobs, currentPage, perPage]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const lower = tag.toLowerCase();
      const exists = prev.some((t) => t.toLowerCase() === lower);
      if (exists) {
        return prev.filter((t) => t.toLowerCase() !== lower);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1);
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.toLowerCase() !== tag.toLowerCase()));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50/60 min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse All Curated Opportunities
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Search verified engineering, AI, and developer vacancies aggregated directly from company career sites.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search job title, skills, or company name..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
                aria-label="Filter job listings by keyword"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-100"
                  aria-haspopup="listbox"
                  aria-expanded={sortDropdownOpen}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 hidden sm:inline font-medium">Sort:</span>
                  <span className="text-slate-900">{sortOptions.find((o) => o.value === sortOrder)?.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortDropdownOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setSortOrder(opt.value); setSortDropdownOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors ${
                          sortOrder === opt.value
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortOrder === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
                aria-label="Open filter tags drawer"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}</span>
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                  <span>Keyword: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="hover:text-blue-900"
                    aria-label="Remove search query filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium shadow-2xs"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-200"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleClearAllFilters}
                className="text-slate-500 hover:text-red-600 font-semibold underline ml-1"
              >
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* Main Layout: Sidebar + Listings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24 shadow-2xs">
              <TagFilter
                availableTags={availableTags}
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                onClearTags={() => setSelectedTags([])}
              />
            </div>
          </aside>

          {/* Jobs Listing Column */}
          <main className="md:col-span-3">
            {/* Results Status Header */}
            <div className="flex items-center justify-between mb-4 text-xs sm:text-sm text-slate-500">
              <div>
                Showing <strong className="text-slate-900 font-bold">{filteredJobs.length}</strong>{' '}
                {filteredJobs.length === 1 ? 'eligible position' : 'eligible positions'}
              </div>
              {filteredJobs.length > 0 && (
                <div>
                  Page {paginationResult.currentPage} of {paginationResult.totalPages}
                </div>
              )}
            </div>

            {/* Error Banner if API error occurred */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                  {onRefresh && (
                    <button
                      type="button"
                      onClick={onRefresh}
                      className="mt-2 text-xs font-bold text-amber-700 underline hover:text-amber-900"
                    >
                      Try Reconnecting to Live API
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                      <div className="space-y-2 flex-1">
                        <div className="w-32 h-4 bg-slate-200 rounded" />
                        <div className="w-48 h-5 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="w-full h-8 bg-slate-100 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginationResult.items.map((job) => (
                    <JobCard
                      key={job.job_id}
                      job={job}
                      defaultLogo={settings?.default_company_logo}
                      onTagClick={handleToggleTag}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                <Pagination
                  currentPage={paginationResult.currentPage}
                  totalPages={paginationResult.totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 mb-4">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  No Matching Vacancies Found
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  We could not find any active job listings matching your specific keyword or tag combinations.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs md:hidden"
        >
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                    <span>Filter Positions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                    aria-label="Close filter drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <TagFilter
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  onToggleTag={handleToggleTag}
                  onClearTags={() => setSelectedTags([])}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-sm"
                >
                  View {filteredJobs.length} Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
