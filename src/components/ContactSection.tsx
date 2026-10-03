import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { enquiryStorage } from '../services/enquiryStorage';
import { ContactFormData } from '../types';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  MapPin, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ContactSectionProps {
  onOpenDemoModal: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenDemoModal }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    service: 'Website Development',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please provide your name';
    if (!formData.phone.trim()) {
      errors.phone = 'Please provide your phone or WhatsApp number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.message.trim()) errors.message = 'Please provide a brief message';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    enquiryStorage.create({
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      projectRequirements: formData.message,
    });

    setIsSubmitted(true);
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: 'Website Development',
      message: ''
    });
  };

  return (
    <section id="contact-section" className="py-20 lg:py-28 bg-[var(--theme-bg-main)] relative overflow-hidden">
      {/* Background radial lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#C79A22]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main CTA Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] p-8 sm:p-12 border border-[#C79A22]/35 shadow-2xl mb-16 text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C79A22]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--theme-bg-secondary)] border border-[#C79A22]/40 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            <Sparkles className="w-3.5 h-3.5" />
            Ready To Upgrade Your Digital Presence?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--theme-text-primary)] font-sans tracking-tight max-w-2xl mx-auto">
            Have an Idea? <span className="text-gold-gradient">Let's Build It.</span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--theme-text-primary)] max-w-xl mx-auto">
            Tell us what you need and we'll help you find the right digital solution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              id="cta-open-demo-btn"
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] font-bold text-base shadow-xl shadow-[#C79A22]/25 hover:shadow-2xl transition-all"
            >
              Get Free Demo
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-bold text-base flex items-center justify-center gap-2.5 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

        </div>

        {/* Contact Info & Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contacts & Founder Info */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[var(--theme-text-primary)] font-sans">
                Direct Official Contacts
              </h3>
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Reach out directly via phone, WhatsApp, or email for prompt project discussion.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3">
              
              {/* Phone */}
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="p-4 rounded-2xl glass-card border border-[var(--theme-border)] hover:border-[#C79A22]/40 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#C79A22] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)] block tracking-wider">
                    Direct Phone Line
                  </span>
                  <span className="text-base font-bold text-[var(--theme-text-primary)] group-hover:text-[#C79A22] transition-colors font-mono">
                    {COMPANY_INFO.phone}
                  </span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl glass-card border border-[var(--theme-border)] hover:border-[#25D366]/40 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)] block tracking-wider">
                    Instant WhatsApp Chat
                  </span>
                  <span className="text-base font-bold text-[var(--theme-text-primary)] group-hover:text-[#25D366] transition-colors font-mono">
                    {COMPANY_INFO.whatsapp}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="p-4 rounded-2xl glass-card border border-[#E4E1DA] hover:border-blue-500/40 flex items-center gap-4 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-text-muted)] block tracking-wider">
                    Official Email
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[var(--theme-text-primary)] group-hover:text-blue-600 transition-colors truncate">
                    {COMPANY_INFO.email}
                  </span>
                </div>
              </a>

            </div>

            {/* Operating Availability */}
            <div className="p-4 rounded-2xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] space-y-2 text-xs text-[var(--theme-text-secondary)]">
              <div className="flex items-center gap-2 text-[#C79A22] font-semibold">
                <Clock className="w-4 h-4" />
                <span>Response Time Commitment</span>
              </div>
              <p>
                Inquiries are typically reviewed within 2 hours during active business hours.
              </p>
              <div className="text-[11px] text-[var(--theme-text-muted)]">
                Founder: <strong className="text-[var(--theme-text-primary)]">{COMPANY_INFO.founder}</strong>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-gradient-to-b from-white to-[var(--theme-bg-secondary)] p-6 sm:p-8 border border-[var(--theme-border)] shadow-2xl text-left">
              
              <div className="mb-6 space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] font-sans">
                  Send an Online Enquiry
                </h3>
                <p className="text-xs sm:text-sm text-[var(--theme-text-muted)]">
                  Fill in your project requirements below to receive a personalized scope and quote.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm text-center space-y-4 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-[#171A1F]">Thank you! Your enquiry has been received successfully.</h4>
                    <p className="text-xs text-[#626873] max-w-md mx-auto">
                      Our team will review your requirements and get back to you shortly.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs font-semibold hover:bg-slate-100"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                        Your Full Name <span className="text-[#C79A22]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] transition-colors"
                      />
                      {formErrors.name && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                        Phone / WhatsApp Number <span className="text-[#C79A22]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] transition-colors"
                      />
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email & Service Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                        Required Service <span className="text-[#C79A22]">*</span>
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] text-sm focus:outline-none focus:border-[#C79A22] transition-colors"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Custom Software">Custom Software / ERP</option>
                        <option value="Business AI & Automation">Business AI & Automation</option>
                        <option value="Complete Digital Transformation">Complete Digital Transformation</option>
                        <option value="Other Technology Service">Other Technology Service</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--theme-text-secondary)]">
                      Project Requirements & Details <span className="text-[#C79A22]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe your business, what you need (e.g. restaurant QR menu, coaching student fee portal, business website), and your target timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] transition-colors resize-none"
                    />
                    {formErrors.message && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      id="btn-submit-contact-enquiry"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Enquiry</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
