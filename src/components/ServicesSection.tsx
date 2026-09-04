import React from 'react';
import { PageView } from '../types';
import { SERVICES_DATA } from '../data/companyData';
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Bot, 
  ArrowRight, 
  Check, 
  Layers, 
  Clock, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import websiteDevImg from '../assets/images/website_dev_visual_1787465534541.jpg';
import appDevImg from '../assets/images/app_dev_visual_1787465551870.jpg';
import customSoftwareImg from '../assets/images/custom_software_visual_1787465568844.jpg';
import businessAiImg from '../assets/images/business_ai_visual_1787465582131.jpg';

interface ServicesSectionProps {
  onNavigate: (page: PageView) => void;
  onOpenDemoModal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onNavigate,
  onOpenDemoModal
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'website':
        return Globe;
      case 'app':
        return Smartphone;
      case 'software':
        return Cpu;
      case 'ai-automation':
      case 'ai-video':
        return Bot;
      default:
        return Layers;
    }
  };

  const getServiceVisual = (id: string) => {
    switch (id) {
      case 'website':
        return { img: websiteDevImg, alt: 'Website Development UI Visualization' };
      case 'app':
        return { img: appDevImg, alt: 'App Development Mobile Ecosystem' };
      case 'software':
        return { img: customSoftwareImg, alt: 'Custom Software Command Center Dashboard' };
      case 'ai-automation':
      case 'ai-video':
        return { img: businessAiImg, alt: 'Business AI & Automation Workflow Interface' };
      default:
        return { img: websiteDevImg, alt: 'MANI Solution Visual' };
    }
  };

  const getAccentColor = (id: string) => {
    return {
      border: 'border-[#E4E1DA] hover:border-[#C79A22]/50 hover:shadow-lg hover:shadow-[#C79A22]/10',
      badgeBg: 'bg-white border border-[#E4E1DA] text-[#626873]',
      iconBg: 'bg-white border border-[#E4E1DA] text-[#C79A22]',
      glow: 'from-white'
    };
  };

  return (
    <section id="services-section" className="py-20 lg:py-28 bg-[#F7F6F2] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-bg-secondary)] border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            <Sparkles className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            Our Digital <span className="text-gold-gradient">Solutions</span>
          </h2>
          <p className="text-base sm:text-lg text-[#626873]">
            Everything you need to take your business digital.
          </p>
        </div>

        {/* 4 Major Service Cards Grid - Always 2 Columns on all devices */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-8">
          {SERVICES_DATA.map((service) => {
            const Icon = getIcon(service.id);
            const styling = getAccentColor(service.id);
            const visual = getServiceVisual(service.id);

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className={`rounded-xl sm:rounded-2xl bg-gradient-to-b ${styling.glow} via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] p-3 sm:p-6 lg:p-8 border ${styling.border} shadow-md sm:shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 overflow-hidden`}
              >
                <div>
                  
                  {/* 16:9 Unique Visual */}
                  <div className="relative w-full aspect-[16/9] mb-2.5 sm:mb-5 rounded-lg sm:rounded-xl overflow-hidden border border-[#E4E1DA] shadow-sm bg-[#F7F6F2] group-hover:border-[#C79A22]/40 transition-colors">
                    <img
                      src={visual.img}
                      alt={visual.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Top Badge & Icon */}
                  <div className="flex items-start sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl ${styling.iconBg} shadow-sm sm:shadow-md shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-md sm:rounded-lg ${styling.badgeBg}`}>
                          {service.badge}
                        </span>
                        <h3 className="text-xs sm:text-2xl font-bold text-[#171A1F] font-sans mt-0.5 sm:mt-1 group-hover:text-gold-gradient transition-all leading-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#626873]">
                      <Clock className="w-3.5 h-3.5 text-[#C79A22]" />
                      <span>{service.estimatedTimeline}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] sm:text-base text-[#626873] leading-tight sm:leading-relaxed mt-2 sm:mt-4 line-clamp-2 sm:line-clamp-none">
                    {service.shortDesc}
                  </p>

                  {/* Included Offerings List - Hidden on mobile for compact view, visible on tablet+ */}
                  <div className="hidden sm:block mt-4 sm:mt-6">
                    <span className="text-[10px] sm:text-xs font-semibold text-[#626873] uppercase tracking-wider block mb-2 sm:mb-3">
                      What's Included:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#171A1F]">
                      {service.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-white border border-[#E4E1DA]"
                        >
                          <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#C79A22] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Quick Feature Pills (Only on Mobile to save vertical space) */}
                  <div className="sm:hidden flex flex-wrap gap-1 mt-2">
                    {service.items.slice(0, 2).map((item) => (
                      <span key={item} className="text-[9px] px-1.5 py-0.5 rounded bg-white border border-[#E4E1DA] text-[#171A1F] truncate max-w-[110px]">
                        ✓ {item}
                      </span>
                    ))}
                  </div>

                  {/* Key Benefits Strip - Hidden on Mobile */}
                  <div className="hidden sm:block mt-4 p-2.5 sm:p-3.5 rounded-xl bg-slate-50 border border-[#E4E1DA] space-y-1 sm:space-y-1.5">
                    <div className="text-[10px] sm:text-[11px] font-bold text-[#C79A22] flex items-center gap-1 uppercase tracking-wider">
                      <ShieldCheck className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> High Quality Guarantee:
                    </div>
                    <ul className="text-[11px] sm:text-xs text-[#626873] space-y-1">
                      {service.keyBenefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1 sm:gap-1.5">
                          <span className="text-[#C79A22]">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Action Button */}
                <div className="mt-3 sm:mt-8 pt-2.5 sm:pt-5 border-t border-[#E4E1DA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
                  <button
                    id={`btn-explore-${service.id}`}
                    onClick={() => onNavigate(service.pageView)}
                    className="px-2.5 sm:px-5 py-1.5 sm:py-3 rounded-lg sm:rounded-xl bg-white hover:bg-slate-50 text-[#171A1F] hover:text-[#171A1F] border border-[#E4E1DA] hover:border-[#C79A22]/50 text-[10px] sm:text-sm font-bold flex items-center justify-between sm:justify-center gap-1 sm:gap-2 transition-all group-hover:border-[#C79A22]"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#C79A22] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={onOpenDemoModal}
                    className="hidden sm:block px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[11px] sm:text-xs font-semibold text-[#626873] hover:text-[#C79A22] transition-colors text-center"
                  >
                    Request Free Consultation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
