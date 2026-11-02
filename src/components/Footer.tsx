import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Shield, AlertTriangle } from 'lucide-react';
import { SiteSettings } from '../types/job';
import { PrivacyModal } from './PrivacyModal';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const contactEmail = settings?.contact_email || 'hello@codelessai.in';
  const siteDescription =
    settings?.site_description ||
    'Codeless AI Jobs is a curated job aggregator connecting ambitious engineers, researchers, and creators with innovative companies worldwide.';

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-2.5 text-white font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>
                  Codeless <span className="text-blue-400">AI</span> Jobs
                </span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                {siteDescription}
              </p>

            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-white transition-colors">
                    Browse All Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="hover:text-white transition-colors">
                    Disclaimer & Aggregator Notice
                  </Link>
                </li>
              </ul>
            </div>

            {/* Compliance & Contact */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Trust & Contact
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors text-left"
                  >
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Aggregator Disclaimer</span>
                  </Link>
                </li>
                {contactEmail && (
                  <li className="pt-2">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{contactEmail}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {currentYear} Codeless AI Jobs. All company names, logos and trademarks belong to their respective owners.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPrivacyOpen(true)}
                className="hover:text-slate-300 underline"
              >
                Privacy Information
              </button>
              <span>•</span>
              <Link to="/disclaimer" className="hover:text-slate-300 underline">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible Privacy Modal */}
      <PrivacyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        contactEmail={contactEmail}
      />
    </>
  );
};
