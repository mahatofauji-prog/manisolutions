import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
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
    // STRICT REQUIREMENT: Max 6 published items on homepage
    const homeSolutions = readySolutionsStorage.getHomepageSolutions(6);
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
      className="py-16 sm:py-20 lg:py-24 bg-[var(--theme-bg-main)] relative overflow-hidden border-b border-[#E4E1DA]"
    >
      {/* Background Subtle Accents */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Software Products</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171A1F] tracking-tight">
            Ready Solutions
          </h2>

          <p className="text-sm sm:text-base text-[#626873] leading-relaxed">
            Pre-built digital solutions, ready to power your business.
          </p>
        </div>

        {/* Empty State */}
        {solutions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E4E1DA] text-center space-y-4 max-w-xl mx-auto">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#171A1F]">
              Ready Solutions Coming Soon
            </h3>
            <p className="text-xs text-[#626873]">
              We are currently packaging new pre-built products for your industry. Check back soon or contact us for custom software.
            </p>
          </div>
        ) : (
          <>
            {/* 2 COLUMNS GRID ACROSS ALL DEVICES AND SCREENS (MAX 6 ITEMS ON HOMEPAGE) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
              {solutions.slice(0, 6).map((solution) => (
                <ReadySolutionCard
                  key={solution.id}
                  solution={solution}
                  onViewDetails={(sol) => onSelectSolution(sol)}
                  onGetSolution={handleGetSolution}
                />
              ))}
            </div>

            {/* Bottom "View More Ready Solutions" Button */}
            <div className="text-center pt-6">
              <button
                id="view-more-ready-solutions-btn"
                onClick={() => {
                  onNavigate('ready-solutions');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#0F172A] hover:bg-black text-white font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-slate-700"
              >
                <span>View More Ready Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#ECC348]" />
              </button>
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
