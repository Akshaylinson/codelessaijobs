import React, { useEffect } from 'react';
import { X, ShieldCheck, ExternalLink, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactEmail?: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  contactEmail = 'hello@codelessai.in',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-xl font-bold text-slate-900">
                Privacy Information & Transparency
              </h2>
              <p className="text-xs text-slate-500">Codeless AI Jobs Transparency Statement</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Close privacy notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-900 font-medium">
              We respect candidate privacy. No user accounts, passwords, resumes, or tracking profiles are created on Codeless AI Jobs.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">1. Information We Do Not Collect</h3>
            <p>
              Visitors do not register accounts, log in, or upload resumes on this website. All browsing, searching, and filtering occurs either client-side in your browser or through read-only Google Apps Script data access.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">2. External Employer Redirection</h3>
            <p>
              When you click the &ldquo;Apply Now&rdquo; button on any job listing, you are redirected directly to the official external career page, ATS, or application portal operated by the respective hiring company. Any information you submit on that external website is governed strictly by the employer&rsquo;s individual privacy policy.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">3. Caching and Storage</h3>
            <p>
              To ensure fast page load speeds and prevent unnecessary repeated network queries, the website may store temporary read-only job listings in your browser&rsquo;s local memory cache. No sensitive personal identifier is stored or sent to advertising exchanges.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-1">4. Contact & Inquiries</h3>
            <p>
              If you represent an employer and wish to request updates or removal of a job listing, or have questions regarding data handling, please contact our administrator at{' '}
              <a href={`mailto:${contactEmail}`} className="text-blue-600 font-semibold underline">
                {contactEmail}
              </a>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
