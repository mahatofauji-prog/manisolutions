import React from 'react';
import { PageView } from '../../types';
import { OrderCustomSolutionForm } from './OrderCustomSolutionForm';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface OrderCustomSolutionPageProps {
  onNavigateHome: () => void;
  prefilledSolution?: string;
}

export const OrderCustomSolutionPage: React.FC<OrderCustomSolutionPageProps> = ({
  onNavigateHome,
  prefilledSolution
}) => {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-secondary)] py-12 sm:py-20 text-[#171A1F] text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Back Button */}
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] text-xs font-bold text-[#171A1F] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C79A22]" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A22]/10 text-[#C79A22] text-xs font-black border border-[#C79A22]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Engineering Order</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
            Request a Custom Software or ERP Solution
          </h1>
          <p className="text-xs sm:text-sm text-[#626873]">
            Describe your business workflows and technical requirements. Our senior engineering team will architect a tailored solution.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 sm:p-10 shadow-lg">
          <OrderCustomSolutionForm
            prefilledSolution={prefilledSolution}
            onSuccess={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

      </div>
    </div>
  );
};
