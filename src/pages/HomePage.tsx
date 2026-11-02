import React, { useMemo } from 'react';
import { Job, SiteSettings } from '../types/job';
import { HeroSection } from '../components/HeroSection';
import { LatestJobsSection } from '../components/LatestJobsSection';
import { BlogSection } from '../components/BlogSection';
import { CtaSection } from '../components/CtaSection';
import { extractUniqueTags } from '../utils/jobUtils';

interface HomePageProps {
  jobs: Job[];
  settings?: SiteSettings;
  loading: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  jobs,
  settings,
  loading,
}) => {
  // Extract popular tags from real published jobs
  const popularTags = useMemo(() => {
    return extractUniqueTags(jobs).map((t) => t.tag);
  }, [jobs]);

  return (
    <div className="flex flex-col flex-1">
      {/* B. Hero Section */}
      <HeroSection popularTags={popularTags} />

      {/* C & D. Latest Jobs Section with View More Jobs Button */}
      <LatestJobsSection jobs={jobs} settings={settings} loading={loading} />

      {/* E. Blog & Career Resources Section */}
      <BlogSection />

      {/* F. Call-to-action Section */}
      <CtaSection settings={settings} />
    </div>
  );
};
