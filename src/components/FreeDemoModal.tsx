import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { enquiryStorage } from '../services/enquiryStorage';
import { DemoFormData } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<DemoFormData>({
    fullName: '',
    businessName: '',
    businessType: 'Retail / Commercial Store',
    city: '',
    phone: '',
    whatsapp: '',
    email: '',
    service: 'Website Development',
    projectDescription: '',
    timelinePreference: 'Immediate (Within 1-2 Weeks)'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.businessName.trim()) errors.businessName = 'Please enter your business / organization name';
    if (!formData.city.trim()) errors.city = 'Please enter your city / location';
    
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your contact phone number';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'Please enter your WhatsApp number';
    } else if (formData.whatsapp.replace(/\D/g, '').length < 10) {
      errors.whatsapp = 'Please enter a valid 10-digit WhatsApp number';
    }

    if (!formData.projectDescription.trim()) {
      errors.projectDescription = 'Please briefly describe your requirement';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    enquiryStorage.create({
      fullName: formData.fullName,
      phone: formData.phone || formData.whatsapp,
      email: formData.email,
      service: formData.service,
      projectRequirements: `Business: ${formData.businessName} (${formData.businessType})
City: ${formData.city}
Timeline: ${formData.timelinePreference}
Description: ${formData.projectDescription}`,
    });

    setIsSubmitted(true);
  };

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText(formData.whatsapp);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      businessName: '',
      businessType: 'Retail / Commercial Store',
      city: '',
      phone: '',
      whatsapp: '',
      email: '',
      service: 'Website Development',
      projectDescription: '',
      timelinePreference: 'Immediate (Within 1-2 Weeks)'
    });
    setFormErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] border border-[#C79A22]/40 shadow-2xl shadow-black overflow-hidden my-6">
        
        {/* Top Decorative Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 border-b border-[#E4E1DA] flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#C79A22]">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free Architectural Consultation
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#171A1F] font-sans">
              Request a Free Demo & Consultation
            </h3>
            <p className="text-xs text-[#626873]">
              Submit your requirements below to test a live prototype and discuss project architecture.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="p-8 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-[#171A1F]">Thank you! Your enquiry has been received successfully.</h4>
                <p className="text-sm text-[#626873] max-w-md mx-auto">
                  Our team will review your requirements and get back to you shortly.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold transition-all"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Row 1: Full Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Full Name <span className="text-[#C79A22]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Hariom Mahato"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  {formErrors.fullName && (
                    <p className="text-[10px] text-red-400">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Business / Organization Name <span className="text-[#C79A22]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mahato Retail & Co."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  {formErrors.businessName && (
                    <p className="text-[10px] text-red-400">{formErrors.businessName}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Business Type & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Business Type <span className="text-[#C79A22]">*</span>
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="Retail Store / Shop">Retail Store / Shop</option>
                    <option value="Restaurant / Cafe / Food Service">Restaurant / Cafe / Food Service</option>
                    <option value="School / College / Institution">School / College / Institution</option>
                    <option value="Coaching / Tuition Academy">Coaching / Tuition Academy</option>
                    <option value="Salon / Spa / Fitness Center">Salon / Spa / Fitness Center</option>
                    <option value="Healthcare / Clinic / Pharmacy">Healthcare / Clinic / Pharmacy</option>
                    <option value="Real Estate / Construction">Real Estate / Construction</option>
                    <option value="Trust / NGO / Foundation">Trust / NGO / Foundation</option>
                    <option value="Startup / Tech Venture">Startup / Tech Venture</option>
                    <option value="Service Provider / Contractor">Service Provider / Contractor</option>
                    <option value="Other Industry">Other Industry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    City / Location <span className="text-[#C79A22]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guwahati / Ranchi / Delhi"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  {formErrors.city && (
                    <p className="text-[10px] text-red-400">{formErrors.city}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Phone Number <span className="text-[#C79A22]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 96783 77275"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        phone: val,
                        // auto-populate whatsapp if currently empty
                        whatsapp: formData.whatsapp ? formData.whatsapp : val
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-400">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    WhatsApp Number <span className="text-[#C79A22]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 96783 77275"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  {formErrors.whatsapp && (
                    <p className="text-[10px] text-red-400">{formErrors.whatsapp}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Email & Required Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#626873]">
                    Required Service <span className="text-[#C79A22]">*</span>
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Software Development">Software Development / ERP</option>
                    <option value="Business AI & Automation">Business AI & Automation</option>
                    <option value="Other">Other Custom Tech Project</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Project Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#626873]">
                  Project Description & Key Requirements <span className="text-[#C79A22]">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your current operations, features you need (e.g. online orders, fee management, Business AI assistant, staff billing), and questions for the demo..."
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22] resize-none"
                />
                {formErrors.projectDescription && (
                  <p className="text-[10px] text-red-400">{formErrors.projectDescription}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-[#E4E1DA] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-[#626873] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C79A22]" />
                  <span>No obligation • 100% Confidential</span>
                </div>

                <button
                  type="submit"
                  id="btn-submit-request-free-demo"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] text-[#060e20] text-sm font-bold shadow-lg shadow-[#C79A22]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#060e20]" />
                  <span>Request Free Demo</span>
                  <ArrowRight className="w-4 h-4 text-[#060e20]" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
