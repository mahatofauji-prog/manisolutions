import React from 'react';
import { WHY_MANI_POINTS, COMPANY_INFO } from '../data/companyData';
import { 
  Layers, 
  Cpu, 
  Smartphone, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle,
  Award
} from 'lucide-react';

export const WhyManiSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return Layers;
      case 'Cpu': return Cpu;
      case 'Smartphone': return Smartphone;
      case 'Sparkles': return Sparkles;
      case 'TrendingUp': return TrendingUp;
      case 'ShieldCheck': return ShieldCheck;
      default: return CheckCircle;
    }
  };

  return (
    <section id="why-mani-solutions" className="py-16 lg:py-24 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Subtle Premium Background */}
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-r from-slate-200/40 via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-[#C79A22]/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22] shadow-sm mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>The MANI Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight mb-3">
            Why Choose <span className="text-gold-gradient">MANI Solution?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#626873] font-normal">
            Technology is only useful when it solves a real business problem.
          </p>
        </div>

        {/* Main Layout: 2 Columns */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch">
          
          {/* LEFT SIDE — Brand Statement */}
          <div className="w-full lg:w-[40%] flex flex-col justify-start relative group">
            {/* Scroll animation simulation via standard tailwind duration classes */}
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-[#E4E1DA] shadow-2xl relative overflow-hidden hover:border-[#C79A22]/30 transition-colors duration-500 h-full flex flex-col justify-center">
              
              {/* Subtle ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C79A22]/10 transition-colors duration-500" />
              
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] font-sans leading-tight mb-8 relative z-10">
                “We don't just build digital products.<br className="hidden sm:block lg:hidden xl:block"/> We build solutions around your business.”
              </blockquote>

              <div className="space-y-4 relative z-10">
                <div className="text-sm lg:text-base font-bold text-[#626873] uppercase tracking-widest">
                  Modern Advancement for New India
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-[#C79A22]/50 to-transparent" />
                <div className="text-[10px] sm:text-xs font-semibold text-[#C79A22] uppercase tracking-wider flex items-center flex-wrap gap-2">
                  <span>Founder-led</span>
                  <span className="w-1 h-1 rounded-full bg-[#C79A22]/50" />
                  <span>Requirement-focused</span>
                  <span className="w-1 h-1 rounded-full bg-[#C79A22]/50" />
                  <span>Business-driven</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — Key Differences */}
          <div className="w-full lg:w-[60%] relative py-2">
            {/* Subtle Vertical Connecting Line */}
            <div className="absolute top-6 bottom-6 left-[19px] sm:left-[23px] w-px bg-gradient-to-b from-transparent via-[#C79A22]/30 to-transparent pointer-events-none" />

            <div className="space-y-6 sm:space-y-8 relative z-10">
              {WHY_MANI_POINTS.map((point, index) => {
                const IconComp = getIcon(point.icon);
                return (
                  <div key={point.title} className="group relative flex items-start gap-4 sm:gap-6 w-full cursor-default">
                    {/* Icon Node */}
                    <div className="relative z-10 shrink-0 flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E4E1DA] group-hover:border-[#C79A22]/80 flex items-center justify-center text-[#C79A22] shadow-lg group-hover:shadow-[#C79A22]/20 transition-all duration-300 group-hover:scale-110">
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-[#171A1F] transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Row Content */}
                    <div className="flex-1 pt-1 sm:pt-2 group-hover:translate-x-1 sm:group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mb-1 sm:mb-1.5">
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-[var(--theme-text-muted)] group-hover:text-[#C79A22] transition-colors duration-300">
                          0{index + 1}
                        </span>
                        <span className="hidden sm:block text-slate-600/50">—</span>
                        <h3 className="text-base sm:text-lg font-bold text-[#171A1F] font-sans group-hover:text-[#C79A22] transition-colors duration-300">
                          {point.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#626873] leading-relaxed font-normal lg:pr-8">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* FOUNDER ELEMENT STRIP */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white to-slate-50 border border-[#E4E1DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-[#C79A22]/30 transition-colors duration-300 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#C79A22]/0 group-hover:bg-[#C79A22]/[0.02] transition-colors duration-300 pointer-events-none" />
          
          <div className="flex flex-col relative z-10 shrink-0">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#C79A22] mb-1">
              Founder-Led Digital Solutions
            </span>
            <span className="text-base sm:text-lg font-bold text-[#171A1F] font-sans">
              {COMPANY_INFO.founder}
            </span>
            <span className="text-xs text-[#626873]">
              Founder, MANI Solution
            </span>
          </div>

          <div className="sm:max-w-md lg:max-w-xl text-xs sm:text-sm text-[#626873] leading-relaxed border-l-2 border-[#C79A22] pl-4 sm:pl-5 relative z-10 font-medium">
            "Every project is approached with direct attention to requirements, communication and delivery quality."
          </div>
        </div>

      </div>
    </section>
  );
};

