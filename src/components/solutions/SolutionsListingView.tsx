import React from 'react';
import { PageView } from '../../types';
import { solutionsStorage } from '../../services/solutionsStorage';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface SolutionsListingViewProps {
  onNavigateHome: () => void;
  onSelectSolution: (slug: string) => void;
  onOpenDemoModal: () => void;
  onOpenCustomOrder: (solutionName?: string) => void;
}

export const SolutionsListingView: React.FC<SolutionsListingViewProps> = ({
  onNavigateHome,
  onSelectSolution,
  onOpenDemoModal,
  onOpenCustomOrder
}) => {
  const solutions = solutionsStorage.getPublished();

  return (
    <div className="min-h-screen bg-[var(--theme-bg-secondary)] py-12 sm:py-20 text-[#171A1F] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] text-xs font-bold text-[#171A1F] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C79A22]" />
            <span>Back to Home</span>
          </button>

          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C79A22] bg-[#C79A22]/10 px-3 py-1 rounded-full border border-[#C79A22]/20">
              Portfolio & Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
              Tailored Digital Systems Built For Real Scale
            </h1>
            <p className="text-xs sm:text-sm text-[#626873]">
              Explore our completed solutions, custom ERP architectures, modern web applications, and enterprise automation projects.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectSolution(item.slug || item.id)}
              className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden hover:border-[#C79A22]/60 hover:shadow-xl transition-all cursor-pointer flex flex-col group"
            >
              {item.featuredImage && (
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#171A1F]/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {item.category}
                  </span>
                </div>
              )}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-black text-[#171A1F] group-hover:text-[#C79A22] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#626873] line-clamp-3 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E4E1DA] flex items-center justify-between text-xs font-bold text-[#C79A22]">
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
