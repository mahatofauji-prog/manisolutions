import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Check, 
  Zap, 
  Cpu, 
  Users, 
  ArrowRight, 
  MessageSquare, 
  ExternalLink,
  DollarSign,
  ChevronRight,
  Clock,
  Laptop
} from 'lucide-react';
import { ReadySolutionItem, PageView } from '../../types';
import { GetSolutionModal } from './GetSolutionModal';

interface ReadySolutionDetailViewProps {
  solution: ReadySolutionItem;
  onNavigateBack: () => void;
  onNavigateToReadySolutions: () => void;
}

export const ReadySolutionDetailView: React.FC<ReadySolutionDetailViewProps> = ({
  solution,
  onNavigateBack,
  onNavigateToReadySolutions
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(solution.thumbnailUrl);
  const [isGetModalOpen, setIsGetModalOpen] = useState<boolean>(false);

  const allImages = [
    solution.thumbnailUrl,
    ...(solution.additionalImages || [])
  ];

  return (
    <div id="ready-solution-detail-view" className="pt-8 sm:pt-12 pb-24 lg:pt-14 lg:pb-32 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 text-left">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E1DA] pb-4">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Solutions</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#626873]">
            <button onClick={onNavigateToReadySolutions} className="hover:underline">Ready Solutions</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#171A1F] truncate max-w-[200px]">{solution.title}</span>
          </div>
        </div>

        {/* Hero Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Visual Showcase & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Featured Display Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 border border-[#E4E1DA] shadow-xl">
              <img
                src={selectedImage}
                alt={solution.title}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full bg-[#0F172A]/90 backdrop-blur-md text-[#ECC348] border border-[#C79A22]/40 text-xs font-bold shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ECC348] animate-pulse" />
                  {solution.category}
                </span>

                <span className="px-3 py-1.5 rounded-full bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Ready to Deploy
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#2563EB] shadow-md scale-105'
                        : 'border-[#E4E1DA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Deployment Readiness Guarantee Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-[#171A1F] text-sm">
                  Turnkey Software Guarantee by MANI Solution
                </div>
                <div className="text-[#626873] leading-relaxed">
                  Fully developed, tested, and ready for instant branding, custom domain setup, and cloud server provisioning within 24–48 hours.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Quick Specs & CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold">
                <Laptop className="w-3.5 h-3.5" />
                <span>Pre-Built Digital Product</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171A1F] tracking-tight leading-tight">
                {solution.title}
              </h1>

              <p className="text-sm text-[#626873] leading-relaxed">
                {solution.shortDescription}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-[#0F172A] text-white border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Pricing / License
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  {solution.priceType || 'Direct Deployment'}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-white">
                {solution.price || 'Contact for Quotation'}
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Includes source setup & domain mapping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full staff training & technical handoff</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1 Year technical maintenance & support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="detail-get-solution-btn"
                  onClick={() => setIsGetModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] font-black text-sm shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Get This Solution</span>
                  <ArrowRight className="w-4 h-4 text-[#0A0E17]" />
                </button>

                <a
                  href={`https://wa.me/917322960686?text=${encodeURIComponent(
                    `Hello MANI Solution, I am interested in the ready solution: "${solution.title}". Please share a live demo and quotation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

            {/* Suitable For Box */}
            {solution.suitableFor && solution.suitableFor.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-[#E4E1DA] space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#171A1F] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#2563EB]" />
                  <span>Suitable For</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {solution.suitableFor.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-[#171A1F] text-xs font-semibold border border-[#E4E1DA]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Deep Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
          
          {/* Full Description & Key Features (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Full Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-[#171A1F] border-b border-[#E4E1DA] pb-3">
                Solution Overview & Architecture
              </h2>
              <div className="text-sm text-[#626873] leading-relaxed whitespace-pre-line">
                {solution.fullDescription}
              </div>
            </div>

            {/* Key Features Grid */}
            {solution.features && solution.features.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] space-y-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#171A1F] border-b border-[#E4E1DA] pb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#2563EB]" />
                  <span>Key Features & Capabilities</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {solution.features.map((feat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#171A1F] leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Benefits */}
            {solution.benefits && solution.benefits.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E1DA] space-y-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#171A1F] border-b border-[#E4E1DA] pb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#C79A22]" />
                  <span>Business Impact & Benefits</span>
                </h2>

                <div className="space-y-3">
                  {solution.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#171A1F]">
                      <div className="w-5 h-5 rounded-full bg-[#C79A22]/20 text-[#C79A22] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="leading-relaxed font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Tech Stack & Founder Assurance (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tech Stack */}
            {solution.technology && solution.technology.length > 0 && (
              <div className="p-6 rounded-3xl bg-white border border-[#E4E1DA] space-y-4 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#171A1F] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2563EB]" />
                  <span>Technology Stack</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {solution.technology.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-[#171A1F] text-xs font-bold border border-[#E4E1DA]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Founder Note Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] flex items-center justify-center font-black">
                  M
                </div>
                <div>
                  <div className="text-xs font-bold text-white">MANI Solution Leadership</div>
                  <div className="text-[11px] text-slate-400">Founder: Mr. Hariom Mahato</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Every Ready Solution is built with strict enterprise standards, high speed, scalable database architecture, and zero bloatware.&rdquo;
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Dedicated Support</span>
                <span className="text-xs font-bold text-emerald-400">24/7 Available</span>
              </div>
            </div>

            {/* Bottom Floating CTA Button on Mobile */}
            <div className="p-4 rounded-2xl bg-[#0F172A] text-white space-y-3">
              <div className="text-xs font-bold text-slate-200">
                Ready to transform your business?
              </div>
              <button
                onClick={() => setIsGetModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] font-black text-xs shadow-md transition-all"
              >
                Request Deployment Now
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Modal */}
      <GetSolutionModal
        solution={solution}
        isOpen={isGetModalOpen}
        onClose={() => setIsGetModalOpen(false)}
      />
    </div>
  );
};
