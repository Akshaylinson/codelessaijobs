import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Job, SiteSettings } from './types/job';
import { getJobsData } from './services/jobsApi';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { defaultSettings } from './data/seedSettings';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Automatically scrolls window to top on route navigation
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [isLive, setIsLive] = useState(false);

  const loadData = async (force = false) => {
    setLoading(true);
    try {
      const res = await getJobsData(force);
      setJobs(res.jobs);
      setSettings(res.settings);
      setIsLive(res.isLive);
      setError(res.error);
    } catch (err: any) {
      setError(err.message || 'Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
        {/* Navigation Bar */}
        <Navbar settings={settings} />

        {/* Primary Content View */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  jobs={jobs}
                  settings={settings}
                  loading={loading}
                />
              }
            />

            <Route
              path="/jobs"
              element={
                <JobsPage
                  jobs={jobs}
                  settings={settings}
                  loading={loading}
                  error={error}
                  onRefresh={() => loadData(true)}
                />
              }
            />

            <Route
              path="/jobs/:slug"
              element={
                <JobDetailPage
                  jobs={jobs}
                  settings={settings}
                  loading={loading}
                />
              }
            />

            <Route
              path="/disclaimer"
              element={<DisclaimerPage settings={settings} />}
            />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
                  <div className="max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
                    <p className="text-sm text-slate-600 mb-6">
                      The page you requested does not exist or has been relocated.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </BrowserRouter>
  );
}
