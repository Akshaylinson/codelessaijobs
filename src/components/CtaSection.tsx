import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types/job';

interface CtaSectionProps {
  settings?: SiteSettings;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ settings }) => {
  const heading = settings?.cta_heading || 'Ready to Land Your Next AI or Engineering Role?';
  const description =
    settings?.cta_description ||
    'Browse hundreds of verified tech opportunities with transparent descriptions, direct application links, and zero middleman hurdles.';

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>Direct-to-Employer Applications</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 text-white leading-tight">
          {heading}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all duration-150"
          >
            <span>Explore All Openings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/disclaimer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-sm font-semibold border border-white/15 transition-colors"
          >
            Read Aggregator Disclaimer
          </Link>
        </div>
      </div>
    </section>
  );
};
