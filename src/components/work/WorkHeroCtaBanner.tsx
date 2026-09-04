import React, { useState, useEffect } from 'react';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { PageView } from '../../types';
import { workStorage, subscribeToWorkApplications } from '../../services/workStorage';

interface WorkHeroCtaBannerProps {
  onNavigate: (page: PageView) => void;
  onOpenCustomOrder?: () => void;
}

export const WorkHeroCtaBanner: React.FC<WorkHeroCtaBannerProps> = ({ 
  onNavigate,
  onOpenCustomOrder
}) => {
  const [isWorkEnabled, setIsWorkEnabled] = useState<boolean>(() => workStorage.isFeatureEnabled());

  useEffect(() => {
    setIsWorkEnabled(workStorage.isFeatureEnabled());
    const unsubscribe = subscribeToWorkApplications(() => {
      setIsWorkEnabled(workStorage.isFeatureEnabled());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div 
      id="work-hero-cta-banner"
      className="relative z-30 bg-[#F5F4EE] border-b border-[#E4E1DA] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        
        {/* Left message with Gold Accent & Normal Homepage Typography */}
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#626873]">
          <div className="w-8 h-8 rounded-lg bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] flex items-center justify-center shrink-0 shadow-sm">
            {isWorkEnabled ? <Briefcase className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <p className="leading-snug">
            {isWorkEnabled ? (
              <>
                <span className="font-extrabold text-[#171A1F]">Join MANI Solution Talent Network</span>
                <span className="hidden md:inline text-[#626873]"> — Opportunities for Developers, Designers, Marketers & Lead Partners.</span>
              </>
            ) : (
              <>
                <span className="font-extrabold text-[#171A1F]">Need a Custom Software or Web Application?</span>
                <span className="hidden md:inline text-[#626873]"> — Get a custom tailored architectural proposal & live demo.</span>
              </>
            )}
          </p>
        </div>

        {/* CTA Buttons: Side-by-Side on Desktop, Stacked Vertically on Mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
          
          {/* Button: Order Custom Solution → */}
          <button
            id="hero-order-custom-solution-btn"
            onClick={() => {
              if (onOpenCustomOrder) {
                onOpenCustomOrder();
              } else {
                onNavigate('order-custom-solution');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#171A1F] hover:text-[#C79A22] border-2 border-[#C79A22] font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <span>Order Custom Solution</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C79A22]" />
          </button>

          {/* Button: Work With Us & Earn (Only rendered when ENABLED) */}
          {isWorkEnabled && (
            <button
              id="hero-work-with-us-btn"
              onClick={() => {
                onNavigate('work-with-us');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] text-[#171A1F] hover:brightness-105 font-extrabold text-xs sm:text-sm shadow-md shadow-[#C79A22]/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <span>Work With Us & Earn</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#171A1F]" />
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

