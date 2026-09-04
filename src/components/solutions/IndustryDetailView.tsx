import React, { useState, useEffect } from 'react';
import { IndustrySolutionDetail, ReadySolutionItem } from '../../types';
import { getIndustrySolutionById, INDUSTRY_SOLUTIONS } from '../../data/industrySolutionsData';
import { INITIAL_READY_SOLUTIONS } from '../../data/readySolutionsData';
import { readySolutionsStorage } from '../../services/readySolutionsStorage';
import { COMPANY_INFO } from '../../data/companyData';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Building2,
  ShoppingBag,
  Utensils,
  Scissors,
  Dumbbell,
  GraduationCap,
  School,
  BookOpen,
  ShoppingCart,
  HeartPulse,
  HandHeart,
  Wrench,
  MapPin,
  Rocket,
  TrendingUp,
  Cpu,
  Layers,
  Smartphone,
  Globe,
  Bot,
  Zap,
  ShieldCheck,
  Calendar,
  Send,
  ExternalLink
} from 'lucide-react';

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
  onSelectIndustry,
  onSelectReadySolution,
  onOpenDemoModal,
  onOpenCustomOrderModal
}) => {
  const [industry, setIndustry] = useState<IndustrySolutionDetail | null>(null);
  const [matchingReadySolutions, setMatchingReadySolutions] = useState<ReadySolutionItem[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const found = getIndustrySolutionById(industryId);
    if (found) {
      setIndustry(found);

      // Load matching ready solutions
      const allReady = readySolutionsStorage ? readySolutionsStorage.getPublished() : INITIAL_READY_SOLUTIONS;
      const filtered = allReady.filter(rs => {
        return found.readySolutionCategories.some(cat => 
          rs.category.toLowerCase().includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(rs.category.toLowerCase()) ||
          rs.suitableFor?.some(s => s.toLowerCase().includes(found.name.toLowerCase()) || found.name.toLowerCase().includes(s.toLowerCase()))
        );
      });
      setMatchingReadySolutions(filtered);

      // Update page title
      document.title = `Digital Solutions for ${found.name} | MANI Solution`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [industryId]);

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

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'Website': return Globe;
      case 'Mobile App': return Smartphone;
      case 'Software / ERP': return Layers;
      case 'AI & Automation': return Bot;
      default: return Sparkles;
    }
  };

  if (!industry) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#FDFBF7] text-[var(--theme-text-primary)] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-xl">
          <Building2 className="w-12 h-12 text-[#C79A22] mx-auto" />
          <h2 className="text-2xl font-bold text-[#171A1F]">Industry Solution Not Found</h2>
          <p className="text-sm text-[#626873]">
            The industry specification you selected is currently unavailable or being updated.
          </p>
          <button
            onClick={onNavigateBack}
            className="px-6 py-3 rounded-xl bg-[#171A1F] text-white font-bold text-sm hover:bg-black transition-all"
          >
            ← Return to Industries
          </button>
        </div>
      </div>
    );
  }

  const Icon = getCategoryIcon(industry.iconName);

  const getWhatsAppIndustryChatUrl = () => {
    const text = encodeURIComponent(
      `Hello MANI Solution,\nI am looking for digital solutions tailored for my business in the *${industry.name}* sector.\n\nI would like to schedule a free consultation/demo.`
    );
    return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${text}`;
  };

  const handleConsultationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const msg = `Hello MANI Solution,\nI would like a custom solution consultation for *${industry.name}*.\n\n*Name:* ${data.fullName}\n*Business:* ${data.businessName}\n*Phone:* ${data.phone}\n*City:* ${data.city || 'India'}\n*Requirements:* ${data.requirements || 'Discuss digital solutions'}\n*Preferred Method:* ${data.preferredContact || 'WhatsApp'}`;
    const waUrl = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setFormSubmitted(true);
  };

  const otherIndustries = INDUSTRY_SOLUTIONS.filter(item => item.id !== industry.id).slice(0, 6);

  return (
    <div id="industry-solution-detail-page" className="pt-24 sm:pt-28 pb-24 bg-[#FDFBF7] min-h-screen text-[var(--theme-text-primary)] relative">
      
      {/* Background Ambience Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C79A22]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Navigation & Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-[#626873] border-b border-[#E4E1DA] pb-4">
          <button
            id="btn-back-to-all-industries"
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-[#171A1F] hover:text-[#C79A22] font-bold transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Industries</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[#626873]">Built For Business</span>
            <ChevronRight className="w-3 h-3 text-[#626873]" />
            <span className="text-[#C79A22] font-bold">{industry.name}</span>
          </div>
        </div>

        {/* 1. Industry Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/40 shadow-sm text-xs font-bold uppercase tracking-wider text-[#C79A22]">
              <span className="px-1.5 py-0.2 rounded bg-[#C79A22] text-white text-[10px] font-mono font-extrabold">
                {industry.categoryNumber}
              </span>
              <span>Sector Specific Solution</span>
            </div>

            {/* Main Industry Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171A1F] tracking-tight leading-tight">
              Digital Solutions for <span className="gold-gradient">{industry.name}</span>
            </h1>

            {/* Industry Tagline / Short Description */}
            <p className="text-base sm:text-lg text-[#626873] leading-relaxed font-normal">
              {industry.tagline}
            </p>

            {/* Recommended Core Solution Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-[#C79A22] border-y border-r border-[#E4E1DA] shadow-md space-y-1.5">
              <div className="flex items-center gap-2 text-[#C79A22] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Recommended Core Technology</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-[#171A1F]">
                {industry.recommendedSolution}
              </p>
            </div>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-industry-request-demo"
                onClick={onOpenDemoModal}
                className="px-6 py-3.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Request Free Demo</span>
                <Sparkles className="w-4 h-4 text-[#C79A22]" />
              </button>

              <button
                id="btn-industry-custom-order"
                onClick={onOpenCustomOrderModal}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#C79A22] text-[#171A1F] text-xs sm:text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Order Custom Solution</span>
                <ArrowRight className="w-4 h-4 text-[#C79A22]" />
              </button>

              <a
                id="btn-industry-whatsapp-chat"
                href={getWhatsAppIndustryChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E4E1DA] shadow-2xl group">
              <img
                src={industry.imageUrl}
                alt={`${industry.name} Solutions - MANI Solution`}
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Icon & Category Tag inside image */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-lg flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C79A22] text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-[#626873]">SECTOR</div>
                  <div className="text-xs font-black text-[#171A1F]">{industry.name}</div>
                </div>
              </div>

              {/* Bottom stats inside image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xl space-y-1">
                <div className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Custom Digital Architecture</span>
                  <span className="text-[#C79A22] font-mono">100% Tailored</span>
                </div>
                <div className="text-[11px] text-[#626873] leading-snug">
                  Engineered specifically around real-world Indian operational workflows and consumer habits.
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 2. Full Overview & Business Context */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E4E1DA] shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C79A22]">
            <Layers className="w-4 h-4" />
            <span>Overview & Industry Context</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F] tracking-tight">
            How We Empower {industry.name} with Modern Technology
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#626873] leading-relaxed font-normal">
            {industry.fullOverview}
          </p>

          {/* Suitable Business Types Chips */}
          {industry.suitableFor && industry.suitableFor.length > 0 && (
            <div className="pt-4 border-t border-[#E4E1DA]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#171A1F] mb-3">
                Suitable Business Models in This Sector:
              </div>
              <div className="flex flex-wrap gap-2">
                {industry.suitableFor.map((subType, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-[#171A1F] shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A22]" />
                    <span>{subType}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Popular Capabilities Grid */}
        <div className="space-y-6">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-xs font-bold uppercase tracking-wider text-[#C79A22]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Built-in Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] tracking-tight">
              Essential Features for {industry.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#626873]">
              Every module is designed to resolve friction points, automate repetitive tasks, and drive measurable revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {industry.popularFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/60 hover:shadow-xl hover:-translate-y-1 transition-all flex items-start gap-4 shadow-sm"
              >
                <div className="p-2.5 rounded-xl bg-[#C79A22]/10 text-[#C79A22] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#171A1F] leading-snug">
                    {feat}
                  </h4>
                  <p className="text-xs text-[#626873] leading-relaxed">
                    Standardized, production-tested capability integrated into your custom deployment.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. "What We Can Build" Comprehensive Modules */}
        <div className="space-y-6">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-xs font-bold uppercase tracking-wider text-[#C79A22]">
              <Layers className="w-3.5 h-3.5" />
              <span>Digital Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] tracking-tight">
              What We Can Build for Your Business
            </h2>
            <p className="text-xs sm:text-sm text-[#626873]">
              Choose individual specialized modules or combine them into a unified, all-in-one digital operating suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.modules.map((mod, idx) => {
              const ModIcon = getModuleIcon(mod.type);
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-[#E4E1DA] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg hover:shadow-2xl hover:border-[#C79A22]/60 hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-[#171A1F] text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                        {mod.type}
                      </span>
                      <div className="p-2 rounded-xl bg-[#C79A22]/10 text-[#C79A22]">
                        <ModIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#171A1F]">
                      {mod.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#626873] leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Capabilities list */}
                    <div className="space-y-2 pt-2 border-t border-[#E4E1DA]">
                      <div className="text-[11px] font-bold text-[#171A1F] uppercase tracking-wider">
                        Key Capabilities Included:
                      </div>
                      <ul className="space-y-1.5">
                        {mod.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="text-xs text-[#626873] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] mt-1.5 shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={onOpenDemoModal}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-[#171A1F] text-[#171A1F] hover:text-white border border-slate-200 hover:border-[#171A1F] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Demo for This Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Business Benefits & ROI */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-[var(--theme-bg-secondary)] border border-[#C79A22]/30 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <TrendingUp className="w-4 h-4" />
            <span>Measurable Business Impact</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171A1F]">
            How This Digital System Drives Growth for {industry.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {industry.businessBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-500/20 shadow-sm flex items-start gap-3.5"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#171A1F] leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          {/* Technologies Chips */}
          {industry.technologies && industry.technologies.length > 0 && (
            <div className="pt-4 border-t border-[#E4E1DA] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#626873] uppercase tracking-wider flex items-center gap-1.5 mr-2">
                <Cpu className="w-4 h-4 text-[#C79A22]" /> Production Tech Stack:
              </span>
              {industry.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-white border border-[#E4E1DA] text-xs font-semibold text-[#171A1F] shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 6. "Ready Solutions for [Industry]" Section */}
        <div id="industry-matching-ready-solutions" className="space-y-6 pt-4 border-t border-[#E4E1DA]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-xs font-bold uppercase tracking-wider text-[#C79A22]">
                <Zap className="w-3.5 h-3.5" />
                <span>Pre-Engineered Systems</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F] tracking-tight">
                Ready Solutions for {industry.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#626873]">
                Deploy instant production-ready platforms customized with your branding in 48-72 hours.
              </p>
            </div>
          </div>

          {matchingReadySolutions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingReadySolutions.map((rs) => (
                <div
                  key={rs.id}
                  id={`ready-solution-card-${rs.id}`}
                  className="group rounded-3xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 relative">
                      <img
                        src={rs.thumbnailUrl}
                        alt={rs.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {rs.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors line-clamp-2">
                      {rs.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#626873] line-clamp-2 leading-relaxed">
                      {rs.shortDescription}
                    </p>

                    {/* Features Preview */}
                    {rs.features && rs.features.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-[#E4E1DA]">
                        {rs.features.slice(0, 2).map((feat, fIdx) => (
                          <div key={fIdx} className="text-[11px] text-slate-700 flex items-center gap-1.5 line-clamp-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Price & Button */}
                  <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-between gap-2">
                    <div>
                      {rs.price && (
                        <div className="text-xs font-extrabold text-[#171A1F]">
                          {rs.price}
                        </div>
                      )}
                      <div className="text-[10px] text-[#626873] font-medium">
                        {rs.priceType || 'Starting From'}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectReadySolution(rs)}
                      className="px-4 py-2 rounded-xl bg-[#C79A22] hover:bg-[#b8860b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#E4E1DA] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-[#171A1F]">
                  Custom Architecture Available for {industry.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] max-w-xl">
                  We build custom software, web platforms, and mobile applications tailored to your specific {industry.name} workflow. Receive a personalized functional blueprint within 24 hours.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onOpenCustomOrderModal}
                  className="px-5 py-3 rounded-xl bg-[#171A1F] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-black transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Order Custom Solution</span>
                  <ArrowRight className="w-4 h-4 text-[#C79A22]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 7. Need Something Custom? Consultation Form */}
        <div id="industry-consultation-form-section" className="rounded-3xl bg-white p-6 sm:p-10 lg:p-12 border border-[#E4E1DA] shadow-2xl max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-xs font-bold uppercase tracking-wider text-[#C79A22]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Technical Consultation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F] tracking-tight">
              Let's Build for Your {industry.name} Business
            </h3>
            <p className="text-xs sm:text-sm text-[#626873]">
              Share your business requirements and our engineering team will create a tailored proposal and prototype demo.
            </p>
          </div>

          <form onSubmit={handleConsultationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171A1F]">Full Name *</label>
                <input
                  required
                  name="fullName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-slate-50 text-xs sm:text-sm text-[#171A1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171A1F]">Business / Brand Name *</label>
                <input
                  required
                  name="businessName"
                  type="text"
                  placeholder={`e.g. My ${industry.name} Business`}
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-slate-50 text-xs sm:text-sm text-[#171A1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171A1F]">Phone / Mobile Number *</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-slate-50 text-xs sm:text-sm text-[#171A1F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171A1F]">City / State</label>
                <input
                  name="city"
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-slate-50 text-xs sm:text-sm text-[#171A1F]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#171A1F]">Industry Sector</label>
                <input
                  disabled
                  value={industry.name}
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] bg-slate-100 text-xs sm:text-sm text-slate-700 font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#171A1F]">Tell Us About Your Requirements</label>
                <textarea
                  name="requirements"
                  rows={3}
                  placeholder={`Describe your specific workflows, software needs, or features you want for your ${industry.name} business...`}
                  className="w-full p-3 rounded-xl border border-[#E4E1DA] focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22] outline-none bg-slate-50 text-xs sm:text-sm text-[#171A1F]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#171A1F]">Preferred Contact Method</label>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#626873]">
                    <input type="radio" name="preferredContact" value="WhatsApp" defaultChecked className="text-[#C79A22] focus:ring-[#C79A22]" />
                    <span>WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#626873]">
                    <input type="radio" name="preferredContact" value="Phone Call" className="text-[#C79A22] focus:ring-[#C79A22]" />
                    <span>Phone Call</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#171A1F] to-black hover:from-black hover:to-[#171A1F] text-white text-xs sm:text-sm font-bold shadow-xl hover:shadow-black/20 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Tailored Consultation</span>
                <Send className="w-4 h-4 text-[#C79A22]" />
              </button>

              <button
                type="button"
                onClick={onOpenDemoModal}
                className="text-xs font-bold text-[#C79A22] hover:underline cursor-pointer"
              >
                Or request an instant live demo →
              </button>
            </div>

          </form>

        </div>

        {/* 8. Explore Other Industries Grid */}
        <div className="space-y-6 pt-10 border-t border-[#E4E1DA]">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#171A1F]">
                Explore Other Industries
              </h3>
              <p className="text-xs text-[#626873]">
                Discover digital solutions engineered for other specialized commercial sectors.
              </p>
            </div>
            <button
              onClick={onNavigateBack}
              className="text-xs font-bold text-[#C79A22] hover:underline cursor-pointer"
            >
              View All 15 Industries →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {otherIndustries.map((other) => {
              const OtherIcon = getCategoryIcon(other.iconName);
              return (
                <div
                  key={other.id}
                  id={`other-industry-card-${other.id}`}
                  onClick={() => onSelectIndustry(other.id)}
                  className="group p-4 rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] hover:shadow-lg transition-all cursor-pointer text-center space-y-2 flex flex-col items-center justify-center"
                >
                  <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-[#C79A22] text-[#C79A22] group-hover:text-white transition-colors">
                    <OtherIcon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors leading-tight line-clamp-1">
                    {other.name}
                  </div>
                  <div className="text-[10px] text-[#626873] font-mono">
                    #{other.categoryNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
