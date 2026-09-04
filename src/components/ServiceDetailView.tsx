import React from 'react';
import { ServiceDetail, PageView } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Video, 
  Bot,
  ArrowLeft, 
  Check, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Code2, 
  MessageSquare, 
  ArrowRight
} from 'lucide-react';

interface ServiceDetailViewProps {
  service: ServiceDetail;
  onNavigate: (page: PageView) => void;
  onOpenDemoModal: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  service,
  onNavigate,
  onOpenDemoModal
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'website': return Globe;
      case 'app': return Smartphone;
      case 'software': return Cpu;
      case 'ai-automation':
      case 'ai-video': return Bot;
      default: return Layers;
    }
  };

  const IconComp = getIcon(service.id);

  return (
    <div className="pt-8 sm:pt-12 pb-20 lg:pt-14 lg:pb-28 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('services')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] hover:text-[#C79A22] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Solutions
        </button>

        {/* Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] p-8 sm:p-12 border border-[#C79A22]/35 shadow-2xl space-y-6 text-left relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#0f2042] border border-[#C79A22]/30 text-[#C79A22]">
              <IconComp className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-[#C79A22]/15 border border-[#C79A22]/40 text-[#C79A22] text-xs font-bold uppercase tracking-widest">
              {service.badge}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--theme-text-secondary)] font-medium px-3 py-1 rounded-full bg-white/5 border border-[var(--theme-border)]">
              <Clock className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Turnaround: {service.estimatedTimeline}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--theme-text-primary)] font-sans tracking-tight">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg text-[var(--theme-text-secondary)] max-w-3xl leading-relaxed">
            {service.fullDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onOpenDemoModal}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] text-[#060e20] text-sm font-bold shadow-lg shadow-[#C79A22]/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#060e20]" />
              <span>Get Free {service.title} Demo</span>
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(`Hello MANI Solution, I would like to discuss a requirement for ${service.title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Discuss on WhatsApp
            </a>
          </div>

        </div>

        {/* Detailed Offerings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Column: Offerings & Benefits */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Offerings List */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 border border-[var(--theme-border)] space-y-4">
              <h2 className="text-xl font-bold text-[var(--theme-text-primary)] font-sans flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#C79A22]" />
                Specific Solutions We Build Under {service.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.items.map((item) => (
                  <div
                    key={item}
                    className="p-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] flex items-center gap-2.5 text-xs text-[var(--theme-text-primary)]"
                  >
                    <Check className="w-4 h-4 text-[#C79A22] shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Architectural Benefits */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 border border-[var(--theme-border)] space-y-4">
              <h2 className="text-xl font-bold text-[var(--theme-text-primary)] font-sans flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C79A22]" />
                Key Quality Standards & Guarantees
              </h2>
              <div className="space-y-2.5 pt-2">
                {service.keyBenefits.map((ben, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--theme-text-secondary)]">
                    <span className="text-[#C79A22] font-bold mt-0.5">•</span>
                    <span>{ben}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Use Cases */}
            <div className="rounded-2xl glass-card p-6 sm:p-8 border border-[var(--theme-border)] space-y-4">
              <h2 className="text-xl font-bold text-[var(--theme-text-primary)] font-sans">
                Common Industry Deployments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.sampleUseCases.map((useCase, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-xs text-[var(--theme-text-secondary)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22]">Deployment 0{idx + 1}</span>
                    <div>{useCase}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Deliverables Checklist & Tech Stack */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Deliverables Card */}
            <div className="rounded-2xl bg-gradient-to-b from-white to-[var(--theme-bg-secondary)] p-6 sm:p-7 border border-[#C79A22]/30 shadow-xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A22] block">
                Official Package Inclusions
              </span>
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)] font-sans">
                What You Receive
              </h3>
              
              <div className="space-y-2.5 pt-2">
                {service.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--theme-text-primary)]">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="rounded-2xl glass-card p-6 border border-[var(--theme-border)] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-muted)] block">
                Engineering Stack
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg bg-[#0f2042] border border-[#C79A22]/20 text-xs font-semibold text-[var(--theme-text-primary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Consultation Box */}
            <div className="p-6 rounded-2xl bg-white border border-[var(--theme-border)] space-y-4 text-center">
              <h4 className="text-base font-bold text-[var(--theme-text-primary)] font-sans">
                Need a Custom Quote for {service.title}?
              </h4>
              <p className="text-xs text-[var(--theme-text-muted)]">
                Share your operational workflow with founder Mr. Hariom Mahato for direct scope scoping.
              </p>
              <button
                onClick={onOpenDemoModal}
                className="w-full py-3 rounded-xl bg-[#C79A22] text-black text-xs font-bold shadow hover:bg-[#e5c158] transition-colors"
              >
                Request Free Architecture Review
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
