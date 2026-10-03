import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertCircle, Phone, Mail, User, Building, MapPin, MessageSquare } from 'lucide-react';
import { WebsiteTemplate } from '../../types';
import { websiteTemplatesStorage } from '../../services/websiteTemplatesStorage';
import { COMPANY_INFO } from '../../data/companyData';

interface GetTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WebsiteTemplate;
}

export const GetTemplateModal: React.FC<GetTemplateModalProps> = ({ isOpen, onClose, template }) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!fullName.trim() || !mobileNumber.trim() || !email.trim()) {
      setErrorMessage('Please fill out all required fields marked with *');
      setIsSubmitting(false);
      return;
    }

    try {
      websiteTemplatesStorage.createOrder({
        templateId: template.id,
        templateTitle: template.title,
        templateCategory: template.category,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || mobileNumber.trim(),
        email: email.trim(),
        businessName: businessName.trim(),
        city: city.trim(),
        state: state.trim(),
        fullAddress: fullAddress.trim(),
        additionalRequirements: additionalRequirements.trim()
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-filled WhatsApp message for instant chat
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
    `Hello MANI Solution, I would like to purchase and launch the "${template.title}" Website Template (${template.price}) for my business.`
  )}`;

  return (
    <div 
      id="get-template-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-auto text-left relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Launch Request</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">
              Launch Your Website
            </h3>
            <p className="text-xs text-slate-300">
              Template: {template.title} • <span className="text-[#ECC348] font-bold">{template.price}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-[#171A1F]">Order Submitted Successfully!</h4>
              <p className="text-xs sm:text-sm text-[#626873] leading-relaxed max-w-md mx-auto">
                Thank you for choosing MANI Solution! Hariom Mahato and our tech development team will review your request and reach out to you within the next 2-4 hours.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Instantly Chat on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hariom Mahato"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Address <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mobile Number <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>WhatsApp Number</span>
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Leave empty if same as mobile"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Business Name */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Business / Organization Name</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mahato Grocery Mart"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>City</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Jamshedpur"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>State</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Jharkhand"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Full Address */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">Full Address</label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Enter shop or clinic address..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Additional comments */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">Customisation / Domain Setup Requests</label>
                <textarea
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. I need custom colors, my own domain name (example.com), and custom menu items..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

            </div>

            {/* Form actions */}
            <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-between gap-3 shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-slate-500 hover:text-[#25D366] flex items-center gap-1 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Or Chat Directly</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] text-xs font-bold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#ECC348]" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
