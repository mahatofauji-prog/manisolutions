import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { categoriesStorage, subscribeToCategories } from '../services/categoriesStorage';
import { BusinessCategory } from '../types';
import { 
  ShoppingBag, 
  Utensils, 
  Scissors, 
  Dumbbell, 
  GraduationCap, 
  School, 
  BookOpen, 
  ShoppingCart, 
  HeartPulse, 
  Building2, 
  HandHeart, 
  Wrench, 
  MapPin, 
  Rocket, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  MessageSquare,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface BusinessTypesSectionProps {
  onSelectIndustry?: (id: string) => void;
  onSelectSolution?: (id: string) => void;
  onOpenDemoModal: () => void;
}

export const BusinessTypesSection: React.FC<BusinessTypesSectionProps> = ({ onOpenDemoModal, onSelectIndustry, onSelectSolution }) => {
  
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [activeCardId, setActiveCardId] = useState<string>('');

  useEffect(() => {
    const loadCategories = () => {
      const pub = categoriesStorage.getPublished();
      setCategories(pub);
      if (pub.length > 0) {
        setActiveCardId(prev => pub.find(c => c.id === prev) ? prev : pub[0].id);
      }
    };
    loadCategories();
    return subscribeToCategories(loadCategories);
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return ShoppingBag;
      case 'Utensils': return Utensils;
      case 'Scissors': return Scissors;
      case 'Dumbbell': return Dumbbell;
      case 'GraduationCap': return GraduationCap;
      case 'School': return School;
      case 'BookOpen': return BookOpen;
      case 'ShoppingCart': return ShoppingCart;
      case 'HeartPulse': return HeartPulse;
      case 'Building2': return Building2;
      case 'HandHeart': return HandHeart;
      case 'Wrench': return Wrench;
      case 'MapPin': return MapPin;
      case 'Rocket': return Rocket;
      case 'TrendingUp': return TrendingUp;
      default: return Sparkles;
    }
  };

  const handleCardClick = (cat: BusinessCategory) => { 
    if (onSelectIndustry) {
      onSelectIndustry(cat.id);
    } else if (onSelectSolution) {
      onSelectSolution(cat.id);
    }
  };

  return (
    <section id="business-types-section" className="py-20 lg:py-28 bg-[var(--theme-bg-secondary)] relative overflow-hidden">
      {/* Subtle Background Ambience */}
      <div className="absolute inset-0 bg-tech-dots opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#C79A22]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-bg-secondary)] border border-[#C79A22]/40 text-xs font-bold uppercase tracking-widest text-[#C79A22] shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>Ready-to-Launch Website Designs</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            Ready-to-Launch <span className="text-gold-gradient">Website Designs</span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#626873] leading-relaxed max-w-2xl mx-auto font-normal">
            Choose your industry, explore professionally designed website templates, and launch your website starting at just ₹999.
          </p>
        </div>

        {/* 
          15 Business Categories in a Strict 3-Column Grid on ALL Devices (Mobile, Tablet, Desktop)
        */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 items-stretch w-full">
          {categories.map((cat, index) => {
            const Icon = getCategoryIcon(cat.iconName);
            const isActive = activeCardId === cat.id;
            const categoryNumber = cat.categoryNumber || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);

            return (
              <div
                key={cat.id}
                id={`business-category-card-${cat.id}`}
                onClick={() => handleCardClick(cat)}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between border select-none w-full min-w-0 ${
                  isActive
                    ? 'border-[#C79A22] ring-1 ring-[#C79A22] shadow-xl shadow-[#C79A22]/20 scale-[1.01]'
                    : 'border-white/15 hover:border-[#C79A22]/70 hover:shadow-2xl hover:shadow-[#C79A22]/15'
                }`}
                style={{
                  minHeight: '240px',
                  height: '100%'
                }}
              >
                {/* 1. Full-Card Image Covering 100% Width x 100% Height */}
                <img
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80'}
                  alt={`${cat.name} in India - MANI Solution`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* 
                  2. Carefully Controlled Dark Navy Gradient Overlay
                  Transparent at top -> Dark Navy at bottom for crystal-clear readability
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-colors duration-300 pointer-events-none" />

                {/* Top Bar: Category Number & Subtle Status */}
                <div className="relative z-10 p-2 sm:p-3 md:p-4 lg:p-5 flex items-center justify-between w-full min-w-0 overflow-hidden pointer-events-none">
                  <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-[var(--theme-bg-secondary)]/90 border border-[var(--theme-border)] text-[9px] sm:text-[11px] font-mono font-extrabold text-[#C79A22] backdrop-blur-md shadow-md shrink-0">
                    {categoryNumber}
                  </span>

                  <div className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wider uppercase transition-all duration-300 backdrop-blur-md flex items-center gap-1 shrink-0 ${
                    isActive 
                      ? 'bg-[#C79A22] text-[#060e20] shadow-md font-extrabold' 
                      : 'bg-white/70 border border-[var(--theme-border)] text-[#626873] group-hover:border-[#C79A22]/60 group-hover:text-[#C79A22]'
                  }`}>
                    <span className="hidden sm:inline">View</span>
                    <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                
                {/* Bottom Bar: Icon, Category Name, and Short Description */}
                <div className="relative z-10 p-2 sm:p-3 md:p-4 lg:p-5 mt-auto w-full min-w-0 overflow-hidden transform group-hover:-translate-y-0.5 transition-transform duration-300 ease-out pointer-events-none">
                  <div className="bg-white/85 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/50 shadow-lg">
                    {/* Category Icon */}
                    <div className="mb-1 sm:mb-2 inline-flex">
                      <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md ${
                        isActive
                          ? 'bg-gradient-to-br from-white to-[var(--theme-bg-secondary)] text-[#171A1F] border border-[#E4E1DA]'
                          : 'bg-white border border-[#E4E1DA] text-[#C79A22] group-hover:bg-[#C79A22] group-hover:text-white group-hover:border-[#C79A22]'
                      }`}>
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      </div>
                    </div>

                    {/* Category Title */}
                    <h3 className="text-[11px] sm:text-sm md:text-lg lg:text-xl font-bold text-[#171A1F] font-sans tracking-tight leading-tight line-clamp-2 break-words">
                      {cat.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[9px] sm:text-[11px] md:text-xs text-[#626873] mt-0.5 line-clamp-2 leading-tight font-normal break-words mb-2 sm:mb-3">
                      {cat.shortDesc}
                    </p>

                    {/* Pricing & CTA */}
                    <div className="border-t border-[#E4E1DA] pt-2 sm:pt-3 flex flex-col gap-1.5 sm:gap-2">
                      <div className="text-[9px] sm:text-[11px] font-bold text-emerald-700">
                        Starting at ₹999
                      </div>
                      <button className="w-full py-1.5 sm:py-2 px-2 sm:px-3 bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] text-[10px] sm:text-xs font-black tracking-wide rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 duration-200 transition-all flex items-center justify-center gap-1">
                        <span>VIEW DESIGNS</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Contact / Free Demo Bar */}
        <div className="mt-14 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] border border-[#C79A22]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-[#171A1F] font-sans">
              Don't see your specific industry listed?
            </h4>
            <p className="text-xs sm:text-sm text-[#626873] max-w-xl">
              We design custom digital workflows for specialized requirements across India. Speak directly with our technical team today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              id="btn-custom-industry-demo"
              onClick={onOpenDemoModal}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] text-[#060e20] text-xs sm:text-sm font-bold shadow-lg shadow-[#C79A22]/25 hover:shadow-[#C79A22]/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Custom Solution Demo</span>
              <Sparkles className="w-4 h-4 fill-current" />
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E1DA] hover:border-[#25D366] text-xs sm:text-sm font-semibold text-[#171A1F] transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Discuss on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

          </section>
  );
};
