import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { blogPosts, BlogPost } from '../data/blogPosts';
import { formatDate } from '../utils/jobUtils';

export const BlogSection: React.FC = () => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-blue-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Career Resources & Advice</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Insights for Modern Tech Job Hunters
          </h2>
          <p className="text-base text-slate-600">
            Expert strategies on interview preparation, compensation benchmarking, and resume tailoring for AI and software engineering disciplines.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-blue-700 font-semibold">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(post.date)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePost(post)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-hidden focus-visible:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Complete Article Modal Dialog */}
      {activePost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {activePost.category} • {activePost.readTime}
                </span>
                <h3 id="blog-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {activePost.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                  <span>By {activePost.author}</span>
                  <span>•</span>
                  <span>{formatDate(activePost.date)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-slate-700 space-y-4 pt-4 border-t border-slate-100">
              {activePost.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(Boolean);
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-600">
                      {items.map((it, i) => (
                        <li key={i}>{it.replace(/^-\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
