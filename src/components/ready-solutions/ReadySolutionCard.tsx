import React from 'react';
import { Check, ArrowRight, Eye, Sparkles, Zap, Shield, Layers } from 'lucide-react';
import { ReadySolutionItem } from '../../types';

interface ReadySolutionCardProps {
  solution: ReadySolutionItem;
  onViewDetails: (solution: ReadySolutionItem) => void;
  onGetSolution: (solution: ReadySolutionItem) => void;
}

export const ReadySolutionCard: React.FC<ReadySolutionCardProps> = ({
  solution,
  onViewDetails,
  onGetSolution
}) => {
  return (
    <div 
      id={`ready-solution-card-${solution.id}`}
      className="group rounded-2xl sm:rounded-3xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden text-left hover:-translate-y-1"
    >
      {/* Product Image Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={solution.thumbnailUrl}
          alt={solution.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Category Pill Tag */}
        <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 z-10">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#0F172A]/90 backdrop-blur-md text-[#ECC348] border border-[#C79A22]/40 text-[9px] sm:text-[11px] font-bold shadow-sm flex items-center gap-1 sm:gap-1.5">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ECC348] animate-pulse" />
            <span className="truncate max-w-[80px] sm:max-w-none">{solution.category}</span>
          </span>
        </div>

        {/* "Ready to Deploy" Status Tag */}
        <div className="absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-10">
          <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[8px] sm:text-[10px] font-bold flex items-center gap-0.5 sm:gap-1">
            <Sparkles className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
            <span className="hidden xs:inline">Ready to Deploy</span>
            <span className="xs:hidden">Ready</span>
          </span>
        </div>

        {/* Title over bottom of image */}
        <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 right-2 sm:right-3.5 z-10">
          <h3 className="text-xs sm:text-base lg:text-lg font-black text-white line-clamp-1 group-hover:text-[#ECC348] transition-colors drop-shadow-sm">
            {solution.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between space-y-3 sm:space-y-4">
        
        {/* Description */}
        <p className="text-[11px] sm:text-xs lg:text-[13px] text-[#626873] leading-relaxed line-clamp-2">
          {solution.shortDescription}
        </p>

        {/* Key Features Bullet Highlights (Top 3) */}
        {solution.features && solution.features.length > 0 && (
          <div className="space-y-1.5 sm:space-y-2 py-1.5 sm:py-2 border-y border-slate-100">
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1">
              <Layers className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#2563EB]" />
              <span>Key Features</span>
            </div>
            <ul className="space-y-1 sm:space-y-1.5">
              {solution.features.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="text-[10px] sm:text-xs text-[#171A1F] flex items-start gap-1.5 sm:gap-2">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5 stroke-[3]" />
                  </div>
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-1 sm:pt-2 space-y-2 sm:space-y-3">
          
          {/* Price Label */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#626873]">
              Investment:
            </span>
            <div className="text-right">
              <span className="text-xs sm:text-sm lg:text-base font-black text-[#171A1F]">
                {solution.price || solution.priceType || 'Request Price'}
              </span>
            </div>
          </div>

          {/* Buttons: View Details + Get Solution (Stacked on mobile, 2-col on sm+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
            <button
              onClick={() => onViewDetails(solution)}
              className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap"
            >
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#626873]" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => onGetSolution(solution)}
              className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] text-[10px] sm:text-xs font-black shadow-sm flex items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Get Solution</span>
              <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
