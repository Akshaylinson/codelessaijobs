import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Search, Menu, X, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types/job';

interface NavbarProps {
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ settings }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isJobs = location.pathname.startsWith('/jobs');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {settings?.announcement && !announcementDismissed && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs sm:text-sm font-medium py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-1 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span className="truncate">
                {settings.announcement.replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}]|[\uD800-\uDBFF][\uDC00-\uDFFF]/gu, '').trim()}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementDismissed(true)}
              aria-label="Close announcement"
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Codeless <span className="text-blue-600">AI</span> Jobs
              </span>
              <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wider -mt-1 hidden sm:block">
                Curated Career Aggregator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isHome
                  ? 'text-blue-600 bg-blue-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isJobs
                  ? 'text-blue-600 bg-blue-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Browse Jobs
            </Link>
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-150 hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Explore All Jobs</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/jobs"
              className="p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
              aria-label="Search jobs"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              isHome ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              isJobs ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Browse Jobs
          </Link>
          <div className="pt-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Explore All Jobs</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
