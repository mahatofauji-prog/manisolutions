import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, MessageSquare, Zap, Cpu, Code2, Rocket, ShoppingCart, Bot } from 'lucide-react';
import { BusinessAiItem, BusinessCategory } from '../types';
import { businessAiStorage, subscribeToBusinessAi } from '../services/businessAiStorage';
import { COMPANY_INFO } from '../data/companyData';

interface BusinessAiDetailViewProps {
  slug: string;
  onNavigateBack: () => void;
  onOpenCustomOrderModal: (solutionName: string) => void;
  onOpenDemoModal: () => void;
}

export const BusinessAiDetailView: React.FC<BusinessAiDetailViewProps> = ({
  slug,
  onNavigateBack,
  onOpenCustomOrderModal,
  onOpenDemoModal
}) => {
  const [solution, setSolution] = useState<BusinessAiItem | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const data = businessAiStorage.getBySlug(slug);
      if (data && data.status === 'published') {
        setSolution(data);
      }
    };
    handleUpdate();
    const unsubscribe = subscribeToBusinessAi(handleUpdate);
    return () => unsubscribe();
  }, [slug]);

  if (!solution) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-[#171A1F] mb-4">Solution Not Found</h2>
        <p className="text-[#626873] mb-8">The requested AI & Automation solution does not exist or has been unpublished.</p>
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#171A1F] text-white rounded-xl font-bold hover:bg-[#2D313A] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to AI & Automation
        </button>
      </div>
    );
  }

  const defaultWhatsappMessage = `Hello MANI Solution, I am interested in implementing the ${solution.title} for my business. Please share details and setup pricing.`;

  return (
    <div className="pt-24 pb-20">
      
      {/* Top Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#626873] hover:text-[#C79A22] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI & Automation
        </button>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
              <Bot className="w-3.5 h-3.5" />
              {solution.category}
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] leading-tight">
              {solution.title}
            </h1>
            
            <p className="text-lg text-[#626873] leading-relaxed">
              {solution.shortDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => onOpenCustomOrderModal(solution.title)}
                className="px-8 py-4 bg-[#171A1F] text-white rounded-xl font-bold hover:bg-[#2D313A] transition-all shadow-lg shadow-black/10 flex justify-center items-center gap-2"
              >
                Order This Solution
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={onOpenDemoModal}
                className="px-8 py-4 bg-white border border-[#E4E1DA] text-[#171A1F] rounded-xl font-bold hover:bg-[#F7F6F2] hover:border-[#C79A22]/50 transition-all flex justify-center items-center gap-2"
              >
                <Cpu className="w-5 h-5 text-[#C79A22]" />
                Get Custom Solution
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-[#C79A22]/10 blur-3xl rounded-full transform scale-90 translate-y-4"></div>
            <img 
              src={solution.thumbnailUrl} 
              alt={solution.title} 
              className="relative w-full aspect-[4/3] object-cover rounded-2xl border border-[#E4E1DA] shadow-2xl"
            />
          </div>
          
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="bg-[#F7F6F2] py-20 border-y border-[#E4E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Overview & What you get */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-20">
            
            <div className="lg:col-span-2 space-y-12">
              {/* Solution Overview */}
              <div>
                <h2 className="text-2xl font-bold text-[#171A1F] mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-[#C79A22]" />
                  What Is This Solution?
                </h2>
                <div className="prose prose-lg text-[#626873] max-w-none">
                  {solution.fullOverview.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* How It Works */}
              {solution.howItWorks && solution.howItWorks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#171A1F] mb-6 flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-[#C79A22]" />
                    How It Works
                  </h2>
                  <div className="space-y-4">
                    {solution.howItWorks.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#171A1F] text-[#C79A22] flex items-center justify-center font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <div className="pt-1 font-semibold text-[#171A1F]">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1 space-y-8">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl p-8 border border-[#E4E1DA] shadow-xl shadow-slate-200/50">
                <h3 className="text-lg font-bold text-[#171A1F] mb-2 border-b border-[#E4E1DA] pb-4">
                  Pricing Configuration
                </h3>
                
                {solution.pricingType === 'Fixed Price' && solution.price ? (
                  <div className="my-6">
                    <span className="text-3xl font-black text-[#171A1F]">{solution.price}</span>
                  </div>
                ) : (
                  <div className="my-6">
                    <span className="text-xl font-bold text-[#171A1F]">Custom Pricing</span>
                    <p className="text-sm text-[#626873] mt-2 leading-relaxed">
                      {solution.customPricingText || "Tell us about your requirements and we'll prepare a tailored solution for your business."}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => onOpenCustomOrderModal(solution.title)}
                  className="w-full py-4 bg-[#C79A22] hover:bg-[#b0871d] text-[#171A1F] font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  {solution.ctaText || "Request a Quote"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* What You Get / Deliverables */}
              {solution.deliverables && solution.deliverables.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-[#E4E1DA] shadow-sm">
                  <h3 className="text-lg font-bold text-[#171A1F] mb-6 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#C79A22]" />
                    What You Get
                  </h3>
                  <ul className="space-y-4">
                    {solution.deliverables.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#626873]">
                        <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
          </div>
          
          {/* Features and Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {/* Key Features */}
            {solution.features && solution.features.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-[#E4E1DA] shadow-sm">
                <h2 className="text-2xl font-bold text-[#171A1F] mb-8">Key Features</h2>
                <div className="space-y-4">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-[#C79A22] shrink-0" />
                      <span className="font-semibold text-[#171A1F]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Business Benefits */}
            {solution.benefits && solution.benefits.length > 0 && (
              <div className="bg-[#171A1F] text-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-8">Why Your Business Needs This</h2>
                <div className="space-y-4">
                  {solution.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#C79A22] shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Target Audience & Technology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {/* Target Businesses */}
            {solution.targetBusinesses && solution.targetBusinesses.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-[#171A1F] mb-6">Who Is This For?</h2>
                <div className="flex flex-wrap gap-3">
                  {solution.targetBusinesses.map((target, idx) => (
                    <span key={idx} className="px-4 py-2 bg-white border border-[#E4E1DA] text-[#626873] font-semibold text-sm rounded-full shadow-sm">
                      {target}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Technologies & Integrations */}
            <div>
              <h2 className="text-xl font-bold text-[#171A1F] mb-6 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#C79A22]" />
                Technology & Integrations
              </h2>
              <div className="flex flex-wrap gap-3">
                {solution.technologies?.map((tech, idx) => (
                  <span key={`tech-${idx}`} className="px-3 py-1.5 bg-[#171A1F]/5 text-[#171A1F] font-bold text-xs rounded-md">
                    {tech}
                  </span>
                ))}
                {solution.integrations?.map((int, idx) => (
                  <span key={`int-${idx}`} className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-md">
                    {int}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
            Ready to Automate Your Business?
          </h2>
          <p className="text-lg text-[#626873]">
            Our AI & Automation solutions can be customized to fit your exact business workflows and requirements. Let's discuss how we can help.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => onOpenCustomOrderModal(solution.title)}
              className="w-full sm:w-auto px-8 py-4 bg-[#171A1F] text-white rounded-xl font-bold hover:bg-[#2D313A] transition-all"
            >
              Order This Solution
            </button>
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-[#E4E1DA] text-[#171A1F] rounded-xl font-bold hover:bg-[#F7F6F2] transition-all"
            >
              Get Custom Solution
            </button>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 rounded-xl font-bold hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              {solution.whatsappCta || 'Chat on WhatsApp'}
            </a>
          </div>
        </div>
      </section>
      
    </div>
  );
};
