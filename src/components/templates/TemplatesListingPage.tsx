import React, { useState, useEffect } from 'react';
import { WebsiteTemplate } from '../../types';
import { websiteTemplatesStorage, subscribeToTemplates } from '../../services/websiteTemplatesStorage';
import { categoriesStorage } from '../../services/categoriesStorage';
import { 
  ArrowLeft, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  Info,
  PhoneCall,
  MessageSquare,
  Zap
} from 'lucide-react';

interface TemplatesListingPageProps {
  categoryId: string;
  onBackToHome: () => void;
  onSelectTemplate: (template: WebsiteTemplate) => void;
  onOpenDemoModal: () => void;
  onOpenCustomOrder: (solutionName?: string) => void;
}

export const TemplatesListingPage: React.FC<TemplatesListingPageProps> = ({
  categoryId,
  onBackToHome,
  onSelectTemplate,
  onOpenDemoModal,
  onOpenCustomOrder
}) => {
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);

  const loadTemplates = () => {
    setTemplates(websiteTemplatesStorage.getByCategory(categoryId));
  };

  useEffect(() => {
    loadTemplates();
    const unsubscribe = subscribeToTemplates(loadTemplates);
    return () => unsubscribe();
  }, [categoryId]);

  const categoryInfo = categoriesStorage.getAll().find(c => c.id === categoryId) || {
    id: categoryId,
    name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1) + ' Business',
    shortDesc: 'Launch your industry-grade website designed for modern Indian commerce.',
    iconName: 'Sparkles'
  };

  return (
    <div id="templates-listing-page" className="py-12 sm:py-20 bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] relative min-h-screen">
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 right-0 h-[350px] bg-gradient-to-b from-slate-50 to-[var(--theme-bg-main)] opacity-70 pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-[#C79A22]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-10">
        
        {/* Breadcrumb & Navigation Back */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#626873] font-semibold border-b border-[#E4E1DA] pb-4">
          <button 
            onClick={onBackToHome}
            className="hover:text-[#171A1F] transition-colors flex items-center gap-1"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-[#171A1F]">{categoryInfo.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-400">Templates</span>
        </div>

        {/* Category Main Banner */}
        <div className="space-y-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E4E1DA] text-xs font-bold text-[#626873] hover:text-[#171A1F] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Categories</span>
          </button>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready-To-Launch Website Designs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171A1F] tracking-tight uppercase">
              {categoryInfo.name} <span className="text-gold-gradient">Website Designs</span>
            </h1>
            <p className="text-sm sm:text-base text-[#626873] max-w-3xl leading-relaxed">
              Ready-to-launch website designs for {categoryInfo.name.toLowerCase()} starting at ₹999.
            </p>
          </div>
        </div>

        {/* Listing Section */}
        {templates.length === 0 ? (
          /* Empty State - High Converting Alternative Card */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E4E1DA] shadow-xl text-center space-y-6 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#C79A22]/10 text-[#C79A22] flex items-center justify-center mx-auto shadow-inner border border-[#C79A22]/20">
              <Zap className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-[#171A1F]">
                Templates Under Active Design!
              </h3>
              <p className="text-xs sm:text-sm text-[#626873] max-w-lg mx-auto leading-relaxed">
                We are currently crafting high-performance ready-made templates specifically optimized for the <strong className="text-[#171A1F]">{categoryInfo.name}</strong> industry.
              </p>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                However, you can still get a professional, custom-designed {categoryInfo.name} website from scratch built to your exact specifications today.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenCustomOrder(categoryInfo.name + ' Custom Website')}
                className="px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs sm:text-sm font-black shadow-lg shadow-black/10 hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>Get a Custom Website Built</span>
                <Sparkles className="w-4 h-4 text-[#ECC348] fill-current" />
              </button>

              <button
                onClick={onOpenDemoModal}
                className="px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E4E1DA] text-xs sm:text-sm font-bold text-[#171A1F] transition-colors"
              >
                Request Consultation
              </button>
            </div>
          </div>
        ) : (
          /* Templates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {templates.map((tpl) => (
              <div 
                key={tpl.id}
                className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden hover:shadow-2xl hover:border-[#C79A22]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden group">
                  <img
                    src={tpl.thumbnailUrl}
                    alt={tpl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-mono font-extrabold text-[#C79A22] border border-[#C79A22]/20 shadow">
                    ONE-TIME COST
                  </div>
                  {tpl.isFeatured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#171A1F] text-[#ECC348] rounded-lg text-[9px] font-black tracking-wider uppercase shadow">
                      ★ POPULAR
                    </div>
                  )}
                </div>

                {/* Content body */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(tpl.categories && tpl.categories.length > 0 ? tpl.categories : [tpl.category || categoryId])
                        .map((catId) => (
                          <span key={catId} className="px-2 py-0.5 bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] font-extrabold text-[9px] uppercase rounded-md">
                            {categoriesStorage.getAll().find(c => c.id === catId)?.name || catId}
                          </span>
                        ))}
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#171A1F] leading-tight">
                      {tpl.title}
                    </h3>
                    <p className="text-xs text-[#626873] line-clamp-3 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Bullet points summary */}
                  {tpl.features && tpl.features.length > 0 && (
                    <div className="border-t border-dashed border-[#E4E1DA] pt-3 space-y-1.5">
                      {tpl.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#626873]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C79A22] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action Grid */}
                  <div className="border-t border-[#E4E1DA] pt-4 flex flex-col gap-4 shrink-0">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">Launch Price</span>
                      <strong className="text-[#171A1F] text-lg sm:text-xl font-black">
                        {tpl.price}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      {tpl.demoUrl ? (
                        <a
                          href={tpl.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-2 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] hover:border-[#171A1F] text-[#171A1F] text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>VIEW DESIGN</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => onSelectTemplate(tpl)}
                          className="flex-1 px-2 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] hover:border-[#171A1F] text-[#171A1F] text-[10px] font-bold transition-all text-center"
                        >
                          VIEW DESIGN
                        </button>
                      )}

                      <button
                        onClick={() => onSelectTemplate(tpl)}
                        className="flex-1 px-2 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-[10px] font-black shadow transition-all hover:scale-[1.02] text-center"
                      >
                        GET THIS WEBSITE
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guarantee section banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-[#E4E1DA] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#626873] leading-relaxed">
          <div className="space-y-1 text-center sm:text-left">
            <strong className="text-[#171A1F] font-bold block text-sm">💡 Free Customisation Support</strong>
            <span>Every ready template purchase includes branding setup (adding your logo, colors, shop images, and items) handled directly by our development team for zero extra charge.</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <strong className="text-[#171A1F] font-bold block text-sm">🚀 24-Hour Express Launch</strong>
            <span>Once you choose a template and share your shop details, we will configure the cloud server and point your custom domain name (.com / .in) so it goes live in under 24 hours.</span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <strong className="text-[#171A1F] font-bold block text-sm">🛠️ Lifetime Free Hosting Option</strong>
            <span>We offer server structures designed to run with ultra-low overhead, so you won&apos;t be burdened with massive monthly recurring hosting subscription fees.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
