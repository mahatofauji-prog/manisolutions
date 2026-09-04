import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Bot
} from 'lucide-react';

export const CostEstimator: React.FC = () => {
  const [projectType, setProjectType] = useState<'website' | 'app' | 'software' | 'ai-automation'>('website');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Mobile Responsive Architecture',
    'WhatsApp Inquiries & Live Chat'
  ]);
  const [timelineUrgency, setTimelineUrgency] = useState<'standard' | 'priority'>('standard');

  const featureOptions: Record<string, string[]> = {
    website: [
      'Mobile Responsive Architecture',
      'WhatsApp Inquiries & Live Chat',
      'E-commerce & Online Catalog',
      'SEO & Google Maps Indexing',
      'Admin Content Management CMS',
      'Razorpay / UPI Payment Gateway'
    ],
    app: [
      'Android & iOS Cross-Platform',
      'Instant Push Notifications',
      'Customer Booking & Slot Calendar',
      'UPI Payment & Order Checkout',
      'GPS Live Tracking Integration',
      'Admin Realtime Analytics Hub'
    ],
    software: [
      'Staff Biometric / Mobile Attendance',
      'Automated GST & Thermal Invoicing',
      'Live Stock & Inventory Alerts',
      'QR Code Table / Parcel System',
      'Role-Based Staff Access Controls',
      'Daily Revenue & Expense Reports'
    ],
    'ai-automation': [
      '24/7 Website AI Chat Assistant',
      'AI Voice Receptionist for Phone Calls',
      'Automated Lead Qualification & WhatsApp Handoff',
      'Private Knowledge Base Setup',
      'Automated Customer Follow-ups & Reminders',
      'Custom Workflow API Integration'
    ]
  };

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      if (selectedFeatures.length > 1) {
        setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const calculateEstimate = () => {
    let days = 7;
    if (projectType === 'website') days = 7 + selectedFeatures.length * 1.5;
    if (projectType === 'app') days = 14 + selectedFeatures.length * 2.5;
    if (projectType === 'software') days = 15 + selectedFeatures.length * 3;
    if (projectType === 'ai-automation') days = 5 + selectedFeatures.length * 1.2;

    if (timelineUrgency === 'priority') {
      days = Math.max(3, Math.round(days * 0.65));
    }

    return {
      days: Math.round(days),
      featuresCount: selectedFeatures.length
    };
  };

  const estimate = calculateEstimate();

  const handleWhatsAppQuote = () => {
    const text = 
      `*PROJECT ESTIMATOR INQUIRY — MANI Solution*\n` +
      `*Project Type:* ${projectType.toUpperCase()}\n` +
      `*Selected Modules (${estimate.featuresCount}):*\n` +
      selectedFeatures.map(f => `• ${f}`).join('\n') + `\n` +
      `*Delivery Preference:* ${timelineUrgency === 'priority' ? 'Priority Fast Track' : 'Standard Development'}\n` +
      `*Estimated Target Timeline:* ~${estimate.days} Business Days\n\n` +
      `Please provide the final quotation and technical roadmap for my requirement.`;

    window.open(`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="project-scope-estimator" className="py-20 lg:py-24 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            <Calculator className="w-3.5 h-3.5" />
            Interactive Scope Planner
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            Estimate Your <span className="text-gold-gradient">Project Scope</span>
          </h2>

          <p className="text-base sm:text-lg text-[#626873]">
            Select your desired technology and required functional modules to get a customized timeline roadmap.
          </p>
        </div>

        {/* Planner Interactive Container */}
        <div className="rounded-3xl bg-gradient-to-b from-white to-[var(--theme-bg-secondary)] p-6 sm:p-10 border border-[#C79A22]/30 shadow-2xl space-y-8 text-left">
          
          {/* Step 1: Select Project Type */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626873] block">
              1. Choose Core Category:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'website', label: 'Website Development', icon: Globe },
                { id: 'app', label: 'App Development', icon: Smartphone },
                { id: 'software', label: 'Custom Software', icon: Cpu },
                { id: 'ai-automation', label: 'Business AI & Automation', icon: Bot },
              ].map((cat) => {
                const Icon = cat.icon;
                const isSelected = projectType === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setProjectType(cat.id as any);
                      setSelectedFeatures(featureOptions[cat.id].slice(0, 2));
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-[var(--theme-bg-secondary)] border-[#C79A22] shadow-lg shadow-[#C79A22]/15 ring-1 ring-[#C79A22]'
                        : 'glass-card border-[#E4E1DA] hover:border-[var(--theme-border)]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg w-fit ${isSelected ? 'bg-[#C79A22] text-black' : 'bg-slate-100 text-[#C79A22]'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#171A1F]">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Pick Features */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#626873] block">
              2. Select Desired Features & Modules:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {featureOptions[projectType].map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#C79A22]/15 border-[#C79A22] text-[#171A1F]'
                        : 'bg-[var(--theme-bg-secondary)] border-[#E4E1DA] text-[#626873] hover:text-[#171A1F]'
                    }`}
                  >
                    <span>{feat}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-[#C79A22] text-black' : 'border border-[var(--theme-border)]'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Timeline Urgency & Output Estimate */}
          <div className="pt-6 border-t border-[#E4E1DA] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Speed selection */}
            <div className="lg:col-span-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#626873] block">
                3. Deployment Schedule Preference:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTimelineUrgency('standard')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold ${
                    timelineUrgency === 'standard'
                      ? 'bg-blue-50 border-blue-400 text-[#171A1F]'
                      : 'bg-white border-[#E4E1DA] text-[#626873]'
                  }`}
                >
                  <div>Standard Roadmap</div>
                  <div className="text-[10px] text-[#626873] font-normal mt-0.5">Comprehensive QA Testing</div>
                </button>

                <button
                  onClick={() => setTimelineUrgency('priority')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold ${
                    timelineUrgency === 'priority'
                      ? 'bg-amber-50 border-[#C79A22] text-[#171A1F]'
                      : 'bg-white border-[#E4E1DA] text-[#626873]'
                  }`}
                >
                  <div className="text-[#C79A22]">Priority Fast Track</div>
                  <div className="text-[10px] text-[#626873] font-normal mt-0.5">Dedicated Sprint Delivery</div>
                </button>
              </div>
            </div>

            {/* Estimated Output Banner */}
            <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg-secondary)] border border-[#C79A22]/35 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#C79A22] flex items-center justify-center sm:justify-start gap-1">
                  <Clock className="w-3.5 h-3.5" /> Target Delivery Timeline
                </div>
                <div className="text-2xl font-black text-[#171A1F] font-sans">
                  ~{estimate.days} Business Days
                </div>
                <div className="text-[11px] text-[#626873]">
                  Includes full architecture, testing & training.
                </div>
              </div>

              <button
                onClick={handleWhatsAppQuote}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 shrink-0"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Get Exact Quote on WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
