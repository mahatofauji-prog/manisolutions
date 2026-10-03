import React from 'react';
import { ReadySolutionItem } from '../../types';
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface IndustryDetailViewProps {
  industryId: string;
  onNavigateBack: () => void;
  onSelectIndustry: (id: string) => void;
  onSelectReadySolution: (solution: ReadySolutionItem) => void;
  onOpenDemoModal: () => void;
  onOpenCustomOrderModal: () => void;
}

export const IndustryDetailView: React.FC<IndustryDetailViewProps> = ({
  industryId,
  onNavigateBack,
  onOpenDemoModal,
  onOpenCustomOrderModal
}) => {
  const formattedTitle = industryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-[var(--theme-bg-secondary)] py-12 sm:py-20 text-[#171A1F] text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Back Button */}
        <div>
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] text-xs font-bold text-[#171A1F] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C79A22]" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero */}
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A22]/10 text-[#C79A22] text-xs font-black border border-[#C79A22]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industry Solution</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
            {formattedTitle} Digital Solutions & ERP
          </h1>

          <p className="text-sm text-[#626873] leading-relaxed max-w-2xl">
            Custom-tailored business software, point-of-sale systems, automated billing, and operations portals designed specifically for {formattedTitle}.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onOpenCustomOrderModal}
              className="px-6 py-3 rounded-xl bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <span>Request Custom {formattedTitle} Solution</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemoModal}
              className="px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold transition-all"
            >
              Book Live Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
