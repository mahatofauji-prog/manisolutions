import React, { useState } from 'react';
import { WebsiteTemplate } from '../../types';
import { categoriesStorage } from '../../services/categoriesStorage';
import { GetTemplateModal } from './GetTemplateModal';
import { 
  ArrowLeft, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight, 
  Cpu, 
  ShieldCheck, 
  Smartphone, 
  MessageSquare, 
  Zap, 
  Send
} from 'lucide-react';

interface TemplateDetailPageProps {
  template: WebsiteTemplate;
  onBackToListing: () => void;
  onBackToHome: () => void;
  onOpenDemoModal: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const TemplateDetailPage: React.FC<TemplateDetailPageProps> = ({
  template,
  onBackToListing,
  onBackToHome,
  onOpenDemoModal,
  onSelectCategory
}) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const getCategoryName = (id: string) => {
    const found = categoriesStorage.getAll().find(c => c.id === id);
    return found ? found.name : id;
  };

  const primaryCategory = Array.isArray(template.categories) && template.categories.length > 0
    ? template.categories[0]
    : (template.category || 'retail');
  const categoryFriendlyName = getCategoryName(primaryCategory);

  return (
    <div id="template-detail-page" className="py-12 sm:py-20 bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] relative min-h-screen">
      {/* Visual background decorations */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-slate-50 to-[var(--theme-bg-main)] opacity-70 pointer-events-none" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-8 animate-in fade-in duration-300">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#626873] font-semibold border-b border-[#E4E1DA] pb-4">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#171A1F] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button 
            onClick={onBackToListing}
            className="hover:text-[#171A1F] transition-colors"
          >
            {categoryFriendlyName}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">{template.title}</span>
        </div>

        {/* Back navigation buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToListing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E4E1DA] text-xs font-bold text-[#626873] hover:text-[#171A1F] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {categoryFriendlyName} Directory</span>
          </button>

          <span className="text-xs text-[#626873] font-mono">ID Reference: {template.id}</span>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          
          {/* LEFT COLUMN: VISUAL SCREENSHOTS, DESCRIPTION, FEATURES */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual template presentation card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#E4E1DA] shadow-xl p-3 sm:p-4">
              <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-inner relative group border border-slate-100">
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title Block & Connected Category Chips */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Connected Business Categories:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {(Array.isArray(template.categories) && template.categories.length > 0 ? template.categories : [template.category || 'retail'])
                    .map((catId) => {
                      const catName = getCategoryName(catId);
                      return (
                        <button
                          key={catId}
                          onClick={() => onSelectCategory ? onSelectCategory(catId) : onBackToListing()}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs tracking-wide rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 shadow-xs"
                          title={`Browse all ${catName} Templates`}
                        >
                          <span>{catName}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>
                      );
                    })}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171A1F] tracking-tight leading-tight">
                {template.title}
              </h1>
            </div>

            {/* Tab specs: About This Template */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-5">
              <h3 className="text-base sm:text-lg font-black text-[#171A1F] flex items-center gap-2 border-b border-dashed border-[#E4E1DA] pb-3">
                <Zap className="w-4 h-4 text-[#C79A22]" />
                <span>Template Overview</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#626873] leading-relaxed whitespace-pre-wrap">
                {template.description}
              </p>
            </div>

            {/* Template specs: Features included */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-5">
              <h3 className="text-base sm:text-lg font-black text-[#171A1F] flex items-center gap-2 border-b border-dashed border-[#E4E1DA] pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Core Integrated Modules</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {template.features && template.features.length > 0 ? (
                  template.features.map((feat, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-[#E4E1DA] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-bold text-[#171A1F] block">{feat}</strong>
                        <span className="text-[10px] text-slate-400">Optimised for Indian clients</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3 bg-slate-50 rounded-xl border border-[#E4E1DA] flex items-start gap-2.5">
                      <Smartphone className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-bold text-[#171A1F] block">100% Mobile Responsive</strong>
                        <span className="text-[10px] text-slate-400">Fits perfectly on all smartphones</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-[#E4E1DA] flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-bold text-[#171A1F] block">WhatsApp Quick Checkout</strong>
                        <span className="text-[10px] text-slate-400">Receive orders directly on WhatsApp</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tech Stack Specs */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-4">
              <h3 className="text-base sm:text-lg font-black text-[#171A1F] flex items-center gap-2 border-b border-dashed border-[#E4E1DA] pb-3">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span>Technical Specifications</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Engine</span>
                  <strong className="text-[#171A1F] font-bold">Vite + React 18</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Styling</span>
                  <strong className="text-[#171A1F] font-bold">Tailwind CSS</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Load Speed</span>
                  <strong className="text-emerald-600 font-bold">98/100 Mobile</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">SEO Schema</span>
                  <strong className="text-emerald-600 font-bold">Full JSON-LD</strong>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTION SIDEBAR WIDGET */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
            
            <div className="bg-white rounded-3xl border border-[#C79A22]/40 shadow-2xl p-6 sm:p-8 space-y-6">
              
              {/* Promotion tag */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Launch Package</span>
              </div>

              {/* Price display widget */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Launch Package Cost</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#171A1F]">{template.price}</span>
                  <span className="text-xs text-[#626873] font-bold">/ One-time cost</span>
                </div>
                <span className="text-[10px] text-[#C79A22] font-semibold block">★ Free customized branding setup included!</span>
              </div>

              <hr className="border-[#E4E1DA]" />

              {/* Bullet list of checkouts */}
              <div className="space-y-3.5 text-xs text-[#626873]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Custom domain connection (.com / .in / .co.in)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Your own logo & business banner graphics setup</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Your catalog list, shop items & price lists configured</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Lifetime high-speed cloud hosting options</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#171A1F] to-black hover:brightness-110 text-white text-xs sm:text-sm font-black shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#ECC348] fill-current" />
                  <span>Launch This Website</span>
                </button>

                {template.demoUrl && (
                  <a
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#171A1F] text-[#171A1F] text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>View Live Demo Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>

            {/* Quick consultation helpline */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#626873] space-y-2">
              <strong className="text-[#171A1F] font-bold block">Need Help with Domain & Server?</strong>
              <p className="leading-relaxed">
                Hariom Mahato and the technical support desk are here for you. We manage servers, domain purchases, and SSL setups. Feel free to contact our development desk for queries.
              </p>
              <button
                onClick={onOpenDemoModal}
                className="text-xs font-bold text-[#C79A22] hover:underline flex items-center gap-1"
              >
                <span>Ask Technical Support</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Templates Launch Form Modal */}
      <GetTemplateModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        template={template}
      />
    </div>
  );
};
