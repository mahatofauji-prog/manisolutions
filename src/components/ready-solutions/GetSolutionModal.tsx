import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Send, Phone, Mail, Building, MapPin, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReadySolutionItem } from '../../types';
import { readySolutionsStorage } from '../../services/readySolutionsStorage';

interface GetSolutionModalProps {
  solution: ReadySolutionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GetSolutionModal: React.FC<GetSolutionModalProps> = ({
  solution,
  isOpen,
  onClose
}) => {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !solution) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = readySolutionsStorage.createRequest({
        solutionId: solution.id,
        solutionTitle: solution.title,
        solutionCategory: solution.category,
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

      setSubmittedRequestId(created.id);
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error submitting request:', err);
      setErrorMessage('Something went wrong while submitting your request. Please try again or contact us via WhatsApp.');
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSubmittedRequestId('');
    setFullName('');
    setMobileNumber('');
    setWhatsappNumber('');
    setEmail('');
    setBusinessName('');
    setCity('');
    setState('');
    setFullAddress('');
    setAdditionalRequirements('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div 
      id="get-ready-solution-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-auto text-left relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MANI Solution • Pre-built Ready Product</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Get This Solution
            </h3>
            <p className="text-xs text-slate-300">
              Selected: <span className="font-bold text-white">{solution.title}</span> ({solution.category})
            </p>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-2xl font-black text-[#171A1F]">
                  Request Submitted Successfully!
                </h4>
                <p className="text-xs font-mono font-bold text-[#2563EB]">
                  Reference ID: {submittedRequestId}
                </p>
                <p className="text-sm text-[#626873] leading-relaxed">
                  Thank you! Your request has been received. <strong className="text-[#171A1F]">MANI Solution</strong> will contact you shortly to demonstrate the system and discuss deployment.
                </p>
              </div>

              {/* Solution Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] text-left max-w-md mx-auto space-y-2">
                <div className="text-xs font-bold text-[#171A1F]">
                  Product: {solution.title}
                </div>
                <div className="text-xs text-[#626873] flex items-center justify-between">
                  <span>Category: {solution.category}</span>
                  <span className="font-bold text-emerald-700">{solution.price || solution.priceType}</span>
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/917322960686?text=${encodeURIComponent(
                    `Hello MANI Solution, I just submitted a request for "${solution.title}" (Ref: ${submittedRequestId}). I would like to discuss deployment details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Now</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Product Mini Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-[#E4E1DA] flex items-center gap-3">
                <img 
                  src={solution.thumbnailUrl} 
                  alt={solution.title}
                  className="w-14 h-14 rounded-xl object-cover border border-[#E4E1DA] shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-[#171A1F] truncate">
                    {solution.title}
                  </div>
                  <div className="text-[11px] text-[#626873] flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">{solution.category}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-700">{solution.price || solution.priceType}</span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                    <span>Full Name</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                    <span>Mobile Number</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#626873]">+91</span>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>WhatsApp Number</span>
                    <span className="text-[10px] text-[#626873] ml-1 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#626873]">+91</span>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="Leave blank if same as mobile"
                      maxLength={10}
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                    <span>Email Address</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Business / Organization Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Business / Organization Name</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex High School / City Clinic"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>City</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Patna, Ranchi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>State</span>
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra, Bihar, Jharkhand"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Full Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Full Address</span>
                  </label>
                  <input
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Shop/Office No, Street, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Additional Requirements */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Additional Requirements / Customizations</span>
                  </label>
                  <textarea
                    rows={3}
                    value={additionalRequirements}
                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                    placeholder="Any specific feature requirements, timeline, or branch count..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB] resize-none"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#E4E1DA]">
                <div className="text-[11px] text-[#626873] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Confidential • Fast 24-hr Response</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#0A0E17]" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Request'}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
