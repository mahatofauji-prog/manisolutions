import React from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, Code, Laptop } from 'lucide-react';
import { PageView, CustomSolutionOrder } from '../../types';
import { OrderCustomSolutionForm } from './OrderCustomSolutionForm';

interface OrderCustomSolutionPageProps {
  onNavigate: (page: PageView) => void;
}

export const OrderCustomSolutionPage: React.FC<OrderCustomSolutionPageProps> = ({ onNavigate }) => {
  return (
    <div id="order-custom-solution-page" className="pt-24 sm:pt-28 pb-20 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-semibold text-[#C79A22] bg-[#C79A22]/10 px-3 py-1 rounded-full">
            Custom Software & Web Engineering
          </span>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C79A22] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171A1F]">100% Tailored to You</h4>
              <p className="text-[11px] text-[#626873] leading-relaxed">No generic templates. Exact business logic, custom workflows & branding.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171A1F]">Enterprise Tech Stack</h4>
              <p className="text-[11px] text-[#626873] leading-relaxed">Built with Next.js, React, Node.js, Cloud Databases & scalable APIs.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171A1F]">Turnkey Support</h4>
              <p className="text-[11px] text-[#626873] leading-relaxed">From database architecture to cloud hosting, training & long-term maintenance.</p>
            </div>
          </div>
        </div>

        {/* Form Container Card */}
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 sm:p-10 lg:p-12 shadow-sm">
          <OrderCustomSolutionForm
            onCancel={() => onNavigate('home')}
            onSuccess={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

      </div>
    </div>
  );
};
