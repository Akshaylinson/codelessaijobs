import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import { SiteSettings } from '../types/job';

interface DisclaimerPageProps {
  settings?: SiteSettings;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ settings }) => {
  useEffect(() => {
    document.title = 'Disclaimer & Aggregator Terms | Codeless AI Jobs';
  }, []);

  const contactEmail = settings?.contact_email || 'hello@codelessai.in';

  return (
    <div className="bg-slate-50/60 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Content Card */}
        <article className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-8">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Disclaimer & Aggregator Notice
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Transparency and operational guidelines for Codeless AI Jobs
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                1. Job Aggregation & Information Role
              </h2>
              <p>
                <strong>Codeless AI Jobs</strong> operates solely as a job discovery and aggregation platform.
                Job vacancies displayed on this website are curated and organized from publicly available company career portals, recruitment announcements, and hiring specifications.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                2. No Employer or Agency Affiliation
              </h2>
              <p>
                Codeless AI Jobs is not the employer, recruitment agency, or official hiring representative for any position listed on this website. A listing on this site does not constitute or imply an official partnership, endorsement, sponsorship, or contractual agency relationship with the featured company.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                3. Recruitment & Application Governance
              </h2>
              <p>
                Each hiring organization retains exclusive, independent control over its interview pipelines, job requirements, candidate evaluations, deadline adjustments, and selection decisions. All job applications are submitted directly to the employer&rsquo;s external portal or Applicant Tracking System (ATS).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                4. Information Accuracy & Candidate Verification
              </h2>
              <p>
                While administrators endeavor to maintain timely and accurate information entered into the primary Google Sheets database, job details, compensation estimates, responsibilities, and link destinations may change without prior notice. Candidates are strongly advised to independently verify all job requirements, deadlines, and terms directly on the employer&rsquo;s official careers portal before applying.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                5. No Employment Guarantees
              </h2>
              <p>
                Codeless AI Jobs makes no representations, warranties, or guarantees regarding interview callbacks, job offers, or successful employment outcomes resulting from utilizing this platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                6. Trademarks & Intellectual Property
              </h2>
              <p>
                All company names, brand names, product titles, and logos referenced on Codeless AI Jobs are the property and trademarks of their respective owners. Their inclusion here is strictly for identification and editorial aggregation purposes under fair use.
              </p>
            </section>

            <section className="pt-6 border-t border-slate-100 bg-slate-50 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-10 rounded-b-2xl">
              <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Questions or Removal Requests?
              </h2>
              <p className="text-sm text-slate-600 mb-4">
                If you are an authorized representative of a listed employer and wish to request an update, correction, or immediate removal of a vacancy, please contact:
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 underline text-sm"
              >
                <span>{contactEmail}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
