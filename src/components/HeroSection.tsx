import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  popularTags: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ popularTags }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (clean) {
      navigate(`/jobs?q=${encodeURIComponent(clean)}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/jobs?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50/40 border-b border-slate-200/70 py-10 sm:py-16 md:py-20 lg:py-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Curated Job Vacancies</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-4 sm:mb-6">
          Discover Hand Curated <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
            Tech & AI Opportunities
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
          Aggregated directly from company career sites into a unified, zero-clutter directory.
          Browse transparent listings and apply straight to the source.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 px-2 sm:px-0">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white rounded-2xl border border-slate-300 shadow-md focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all"
          >
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, skills (Python, React), or company..."
                className="w-full pl-3 pr-4 py-2.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden bg-transparent"
                aria-label="Search job opportunities"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-sm transition-all"
            >
              <span>Search Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Tag-based discovery experience */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-0">
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium mr-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Trending tags:</span>
            </span>
            {popularTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 shadow-2xs transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
