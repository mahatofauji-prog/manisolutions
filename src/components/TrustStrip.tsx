import React from 'react';
import { CheckCircle2, ShieldCheck, Smartphone, Sparkles, Target } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const highlights = [
    { label: 'Custom Built', desc: 'Engineered specifically for your workflow', icon: ShieldCheck },
    { label: 'Mobile Friendly', desc: 'Fluid responsive performance on every screen', icon: Smartphone },
    { label: 'Modern Design', desc: 'Clean, high-trust corporate visual standards', icon: Sparkles },
    { label: 'Business Focused', desc: 'Measurable outcomes & operational efficiency', icon: Target },
  ];

  return (
    <section 
      id="trust-introduction-strip"
      className="relative z-20 border-y border-[#E4E1DA] bg-[#F7F6F2] py-12 sm:py-16"
    >
      {/* Subtle top gold accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#C79A22]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Intro Text */}
          <div className="lg:col-span-5 text-left space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F] font-sans leading-snug">
              Technology that turns ideas into <span className="text-gold-gradient">digital solutions.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#626873] leading-relaxed">
              From a professional business website to a complete custom management system, MANI Solution builds technology around your real business needs.
            </p>
          </div>

          {/* Right 4 Highlights */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {highlights.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.label}
                  className="p-4 rounded-xl glass-card border border-[#E4E1DA] hover:border-[#C79A22]/30 transition-all duration-200 text-left space-y-2 group"
                >
                  <div className="flex items-center gap-1.5 text-[#C79A22]">
                    <CheckCircle2 className="w-4 h-4 fill-[#C79A22]/20 shrink-0" />
                    <span className="text-xs font-bold text-[#171A1F] tracking-wide group-hover:text-[#C79A22] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626873] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
