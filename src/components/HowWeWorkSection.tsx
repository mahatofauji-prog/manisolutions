import React, { useState } from 'react';
import { HOW_WE_WORK_STEPS } from '../data/companyData';
import { Search, PenTool, Code2, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

import understandImg from '../assets/images/understand_stage_visual_1787467856055.jpg';
import designImg from '../assets/images/design_stage_visual_1787467873580.jpg';
import buildImg from '../assets/images/build_stage_visual_1787467887664.jpg';
import launchImg from '../assets/images/launch_stage_visual_1787467904906.jpg';

export const HowWeWorkSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return Search;
      case 'PenTool': return PenTool;
      case 'Code2': return Code2;
      case 'Rocket': return Rocket;
      default: return CheckCircle2;
    }
  };

  const getStageVisual = (number: string) => {
    switch (number) {
      case '01':
        return { img: understandImg, alt: '01 Understand Stage - Business Discovery & Requirements Analysis' };
      case '02':
        return { img: designImg, alt: '02 Design Stage - Product UI/UX Architecture' };
      case '03':
        return { img: buildImg, alt: '03 Build Stage - Software Engineering & Development' };
      case '04':
        return { img: launchImg, alt: '04 Launch Stage - Cloud Deployment & Going Live' };
      default:
        return { img: understandImg, alt: 'MANI Stage Visual' };
    }
  };

  return (
    <section id="how-we-work-section" className="py-20 lg:py-28 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-white/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            Structured Delivery Workflow
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            From Idea to <span className="text-gold-gradient">Digital Solution</span>
          </h2>

          <p className="text-base sm:text-lg text-[#626873]">
            A clear, disciplined 4-stage engineering roadmap ensuring zero miscommunication and on-time launch.
          </p>
        </div>

        {/* 4 Steps Grid - 2 Columns on Mobile, Tablet & Desktop */}
        <div className="relative">
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 relative z-10">
            {HOW_WE_WORK_STEPS.map((step, idx) => {
              const Icon = getStepIcon(step.iconName);
              const isActive = activeStep === idx;
              const visual = getStageVisual(step.number);

              return (
                <div
                  key={step.number}
                  id={`how-we-work-step-${step.number}`}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between border overflow-hidden group ${
                    isActive
                      ? 'bg-gradient-to-b from-white to-[var(--theme-bg-secondary)] border-[#C79A22] shadow-xl shadow-[#C79A22]/15 -translate-y-1 sm:-translate-y-2'
                      : 'glass-card border-[#E4E1DA] hover:border-[var(--theme-border)] hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    
                    {/* 16:9 Stage Visual */}
                    <div className="relative w-full aspect-[16/9] mb-2 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden border border-[#E4E1DA] shadow-sm bg-[#F7F6F2] group-hover:border-[#C79A22]/40 transition-colors">
                      <img
                        src={visual.img}
                        alt={visual.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xl sm:text-3xl font-extrabold font-sans ${isActive ? 'text-gold-gradient' : 'text-slate-500'}`}>
                        {step.number}
                      </span>

                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-[#C79A22] text-[#060e20] shadow-md shadow-[#C79A22]/30' 
                          : 'bg-slate-50 text-[#C79A22] border border-[#C79A22]/20'
                      }`}>
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-xl font-bold text-[#171A1F] font-sans leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-[#171A1F] leading-snug">
                      {step.desc}
                    </p>

                    <p className="text-[11px] sm:text-xs text-[#626873] leading-relaxed font-normal pt-2 border-t border-[#E4E1DA]">
                      {step.detail}
                    </p>

                  </div>

                  <div className="mt-4 sm:mt-6 pt-2.5 sm:pt-3 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold">
                    <span className={isActive ? 'text-[#C79A22]' : 'text-slate-500'}>
                      Phase {step.number}
                    </span>
                    <span className={`flex items-center gap-1 ${isActive ? 'text-[#171A1F]' : 'text-[#626873]'}`}>
                      <span className="hidden xs:inline">{isActive ? 'Active Review' : 'Step Overview'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

