import React, { useState, useEffect } from 'react';
import { SolutionItem } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers } from 'lucide-react';

interface FeaturedSolutionBannerProps {
  onSelectSolution?: (slug: string) => void;
  onSelectRelatedSolution?: (slug: string) => void;
  onOpenDemoModal: () => void;
}

export const FeaturedSolutionBanner: React.FC<FeaturedSolutionBannerProps> = ({
  onSelectSolution,
  onSelectRelatedSolution,
  onOpenDemoModal
}) => {
  const handleSelect = onSelectSolution || onSelectRelatedSolution || (() => {});
  const [featuredItem, setFeaturedItem] = useState<SolutionItem | null>(null);

  useEffect(() => {
    const load = () => {
      const featured = solutionsStorage.getFeatured();
      if (featured.length > 0) {
        setFeaturedItem(featured[0]);
      }
    };
    load();
    const unsubscribe = subscribeToSolutions(load);
    return () => unsubscribe();
  }, []);

  if (!featuredItem) return null;

  return (
    <section id="featured-solution-spotlight" className="py-16 lg:py-20 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#C79A22]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="rounded-3xl bg-gradient-to-br from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] border border-[#C79A22]/40 p-8 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Grid texture in container */}
          <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C79A22]/15 border border-[#C79A22]/40 text-xs font-extrabold text-[#C79A22] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Solution
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  ● Live Enterprise Software
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] tracking-tight leading-tight">
                  {featuredItem.title}
                </h2>
                <p className="text-base sm:text-lg text-[#626873] leading-relaxed font-normal">
                  {featuredItem.shortDescription}
                </p>
              </div>

              {/* Highlights / Features Checklist */}
              {featuredItem.keyFeatures && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {featuredItem.keyFeatures.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#171A1F]">
                      <CheckCircle2 className="w-4 h-4 text-[#C79A22] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-4">
                <button
                  id="explore-featured-solution-btn"
                  onClick={() => handleSelect(featuredItem.slug)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] font-bold text-sm shadow-xl shadow-[#C79A22]/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Explore Solution <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="featured-solution-demo-btn"
                  onClick={onOpenDemoModal}
                  className="px-6 py-3.5 rounded-xl bg-[#F7F6F2]/70 hover:bg-[#F7F6F2] border border-[var(--theme-border)] text-[#171A1F] font-semibold text-sm transition-all"
                >
                  Request a Free Demo
                </button>
              </div>

            </div>

            {/* Right Interactive Visual Showcase */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => onSelectSolution(featuredItem.slug)}
                className="group cursor-pointer relative rounded-2xl overflow-hidden bg-[#F7F6F2] border border-[var(--theme-border)] hover:border-[#C79A22]/60 transition-all shadow-2xl"
              >
                <img
                  src={featuredItem.featuredImage}
                  alt={featuredItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-100" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded bg-white/90 backdrop-blur-md text-[#C79A22] font-bold border border-[#E4E1DA]">
                    {featuredItem.category}
                  </span>
                  <span className="text-[#626873] font-semibold group-hover:text-[#171A1F] flex items-center gap-1">
                    View Blueprint →
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
