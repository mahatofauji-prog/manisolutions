import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import { ReadySolutionItem, PageView } from '../../types';
import { readySolutionsStorage, subscribeToReadySolutions } from '../../services/readySolutionsStorage';
import { ReadySolutionCard } from './ReadySolutionCard';
import { GetSolutionModal } from './GetSolutionModal';

interface ReadySolutionsSectionProps {
  onNavigate: (page: PageView) => void;
  onSelectSolution: (solution: ReadySolutionItem) => void;
}

export const ReadySolutionsSection: React.FC<ReadySolutionsSectionProps> = ({
  onNavigate,
  onSelectSolution
}) => {
  const [solutions, setSolutions] = useState<ReadySolutionItem[]>([]);
  const [selectedSolutionForModal, setSelectedSolutionForModal] = useState<ReadySolutionItem | null>(null);
  const [isGetModalOpen, setIsGetModalOpen] = useState(false);

  const loadSolutions = () => {
    // Up to 8 published items on homepage for rich browsing
    const homeSolutions = readySolutionsStorage.getHomepageSolutions(10);
    setSolutions(homeSolutions);
  };

  useEffect(() => {
    loadSolutions();
    const unsubscribe = subscribeToReadySolutions(loadSolutions);
    return () => unsubscribe();
  }, []);

  const handleGetSolution = (solution: ReadySolutionItem) => {
    setSelectedSolutionForModal(solution);
    setIsGetModalOpen(true);
  };

  return (
    <section 
      id="ready-solutions-section"
      className="py-12 sm:py-16 lg:py-20 bg-[var(--theme-bg-main)] relative overflow-hidden border-b border-[#E4E1DA]"
    >
      {/* Background Subtle Accents */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Section Header with Top-Right "View More ERP & CRM Solutions →" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E1DA] pb-4 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] text-[11px] font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Turnkey Business Software</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171A1F] tracking-tight">
              ERP & <span className="text-gold-gradient">CRM Solutions</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#626873] leading-relaxed max-w-2xl font-normal">
              Pre-built enterprise ERP, CRM & digital management solutions, ready to power your business.
            </p>
          </div>

          {/* Top-Right Button */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              id="view-more-ready-solutions-top-btn"
              onClick={() => {
                onNavigate('ready-solutions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all group border border-slate-700"
            >
              <span>View More ERP & CRM Solutions</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#ECC348] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {solutions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E4E1DA] text-center space-y-4 max-w-xl mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#171A1F]">
              ERP & CRM Solutions Coming Soon
            </h3>
            <p className="text-xs text-[#626873]">
              We are currently packaging new pre-built products for your industry. Check back soon or contact us for custom software.
            </p>
          </div>
        ) : (
          <>
            {/* 1. Mobile Horizontal Scroll Catalogue (Compact 3 visible at a time) */}
            <div className="flex sm:hidden overflow-x-auto gap-2.5 pb-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
              {solutions.map((solution) => (
                <div key={solution.id} className="w-[31.5%] min-w-[104px] shrink-0 snap-start">
                  <ReadySolutionCard
                    solution={solution}
                    onViewDetails={(sol) => onSelectSolution(sol)}
                    onGetSolution={handleGetSolution}
                    compact={true}
                  />
                </div>
              ))}
            </div>

            {/* 2. Desktop Grid (Exactly 3 Solutions Per Row: md:grid-cols-3) */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:hidden gap-4 lg:gap-6 items-stretch">
              {solutions.slice(0, 6).map((solution) => (
                <ReadySolutionCard
                  key={solution.id}
                  solution={solution}
                  onViewDetails={(sol) => onSelectSolution(sol)}
                  onGetSolution={handleGetSolution}
                  compact={false}
                />
              ))}
            </div>

            {/* 3. Large Desktop Grid (4-5 Solutions Per Row) */}
            <div className="hidden xl:grid xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5 items-stretch">
              {solutions.slice(0, 10).map((solution) => (
                <ReadySolutionCard
                  key={solution.id}
                  solution={solution}
                  onViewDetails={(sol) => onSelectSolution(sol)}
                  onGetSolution={handleGetSolution}
                  compact={true}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Get Solution Request Modal */}
      <GetSolutionModal
        solution={selectedSolutionForModal}
        isOpen={isGetModalOpen}
        onClose={() => {
          setIsGetModalOpen(false);
          setSelectedSolutionForModal(null);
        }}
      />
    </section>
  );
};
