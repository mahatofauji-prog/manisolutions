import React, { useState, useEffect } from 'react';
import { SolutionItem } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { Sparkles, ArrowRight, Calendar, Layers, Smartphone, Globe, Bot, Briefcase, BookOpen } from 'lucide-react';

interface RecentlyBuiltSectionProps {
  onSelectSolution?: (slug: string) => void;
  onSelectRelatedSolution?: (slug: string) => void;
  onNavigateToSolutions: () => void;
}

export const RecentlyBuiltSection: React.FC<RecentlyBuiltSectionProps> = ({
  onSelectSolution,
  onSelectRelatedSolution,
  onNavigateToSolutions
}) => {
  const handleSelect = onSelectSolution || onSelectRelatedSolution || (() => {});
  const [recentItems, setRecentItems] = useState<SolutionItem[]>([]);

  useEffect(() => {
    const load = () => {
      setRecentItems(solutionsStorage.getRecent(6));
    };
    load();
    const unsubscribe = subscribeToSolutions(load);
    return () => unsubscribe();
  }, []);

  if (recentItems.length === 0) return null;

  return (
    <section id="recently-built-section" className="py-20 lg:py-28 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#1e3a8a]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E4E1DA] pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b]/70 border border-[#C79A22]/30 text-xs font-semibold text-[#C79A22] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Recently Built
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#171A1F] tracking-tight">
              Explore What We're <span className="gold-gradient">Building</span>
            </h2>
            <p className="text-sm sm:text-base text-[#626873] max-w-xl">
              Latest software releases, live business applications, and digital engineering insights from MANI Solution.
            </p>
          </div>

          <div>
            <button
              id="view-all-solutions-homepage-btn"
              onClick={onNavigateToSolutions}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#1e293b] border border-[#C79A22]/40 text-[#C79A22] hover:text-[#f5e6ad] text-sm font-bold transition-all shadow-md"
            >
              View All Solutions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Dynamic Cards Grid on ALL Devices */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-8 w-full">
          {recentItems.map((item) => (
            <div
              key={item.id}
              id={`recent-solution-${item.slug}`}
              onClick={() => handleSelect(item.slug)}
              className="group cursor-pointer rounded-xl sm:rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5 w-full min-w-0"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F6F2] w-full min-w-0">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 pointer-events-none w-full min-w-0">
                  <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md bg-[#F7F6F2]/85 backdrop-blur-md border border-[#E4E1DA] text-[9px] sm:text-[11px] font-semibold text-[#C79A22]">
                    {item.category}
                  </span>
                </div>

                {item.projectStatus && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none w-full min-w-0 text-right">
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 line-clamp-1 inline-block">
                      {item.projectStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-5 md:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4 w-full min-w-0">
                <div className="space-y-1.5 sm:space-y-2 w-full min-w-0">
                  <div className="text-[10px] sm:text-xs text-[#626873] flex items-center gap-1 w-full min-w-0 overflow-hidden">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {new Date(item.projectDate || item.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-base md:text-lg font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors leading-tight sm:leading-snug line-clamp-2 break-words">
                    {item.title}
                  </h3>

                  <p className="text-[10px] sm:text-sm text-[#626873] line-clamp-2 leading-snug sm:leading-relaxed break-words">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E4E1DA] flex flex-wrap items-center justify-between gap-1 w-full min-w-0 overflow-hidden">
                  <span className="text-[10px] sm:text-xs font-bold text-[#C79A22] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">View</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </span>
                  <span className="text-[9px] sm:text-[11px] text-[#626873] capitalize truncate shrink-0">
                    {item.contentType.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered "View All Solutions" button */}
        <div className="text-center pt-4">
          <button
            id="view-all-solutions-bottom-btn"
            onClick={onNavigateToSolutions}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] font-bold text-sm shadow-xl shadow-[#C79A22]/20 hover:scale-105 transition-all"
          >
            View All Digital Solutions →
          </button>
        </div>

      </div>
    </section>
  );
};
