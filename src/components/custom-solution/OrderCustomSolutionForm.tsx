import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Send, 
  Upload, 
  X, 
  Sparkles, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  DollarSign, 
  Clock, 
  Globe, 
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import { customSolutionOrderStorage } from '../../services/customSolutionOrderStorage';
import { CustomSolutionOrder } from '../../types';

interface OrderCustomSolutionFormProps {
  onSuccess?: (order: CustomSolutionOrder) => void;
  onCancel?: () => void;
  isModal?: boolean;
  prefilledSolution?: string;
}

const REQUIRED_SOLUTIONS = [
  'Website',
  'Web Application',
  'Mobile App',
  'Business Software',
  'School Management System',
  'Hospital Management System',
  'E-commerce',
  'AI Solution',
  'Automation',
  'Other'
];

const BUSINESS_CATEGORIES = [
  'Retail & E-commerce',
  'Education & Schools',
  'Healthcare & Clinics',
  'Hospitality & Restaurants',
  'Real Estate & Construction',
  'Manufacturing & Logistics',
  'Financial Services & Fintech',
  'Professional Services & Agency',
  'Gym & Fitness Studio',
  'Salon & Beauty Parlor',
  'NGO & Non-Profit',
  'Coaching & Training Institute',
  'IT & Technology Startup',
  'Other Business'
];

const BUDGET_OPTIONS = [
  'Not Sure',
  '₹10,000–₹25,000',
  '₹25,000–₹50,000',
  '₹50,000–₹1,00,000',
  '₹1,00,000+'
];

const TIMELINE_OPTIONS = [
  'Immediate (Within 1-2 Weeks)',
  '2 to 4 Weeks',
  '1 to 2 Months',
  '2 to 3 Months',
  '3+ Months (Enterprise)',
  'Flexible / Open'
];

export const OrderCustomSolutionForm: React.FC<OrderCustomSolutionFormProps> = ({
  onSuccess,
  onCancel,
  isModal = false,
  prefilledSolution
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [requiredSolution, setRequiredSolution] = useState(prefilledSolution ? 'AI Solution' : '');
  const [customSolutionName, setCustomSolutionName] = useState('');
  const [projectRequirements, setProjectRequirements] = useState(prefilledSolution ? `I am interested in ordering the ${prefilledSolution} for my business. Please provide more details.` : '');
  const [budget, setBudget] = useState('₹25,000–₹50,000');
  const [expectedTimeline, setExpectedTimeline] = useState('2 to 4 Weeks');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // File Upload State
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referenceFileDataUrl, setReferenceFileDataUrl] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<CustomSolutionOrder | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleMobileChange = (val: string) => {
    setMobileNumber(val);
    if (sameAsMobile) {
      setWhatsappNumber(val);
    }
  };

  const handleSameAsMobileToggle = (checked: boolean) => {
    setSameAsMobile(checked);
    if (checked) {
      setWhatsappNumber(mobileNumber);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit. Please upload a smaller file or screenshot.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReferenceFileDataUrl(reader.result as string);
      setReferenceFileName(file.name);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setReferenceFileName('');
    setReferenceFileDataUrl('');
    setFileError(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(mobileNumber.trim())) {
      errors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (!email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!businessName.trim()) errors.businessName = 'Business / Organization Name is required';
    if (!businessCategory.trim()) errors.businessCategory = 'Please select your business category';
    if (!requiredSolution.trim()) errors.requiredSolution = 'Please select the required solution';
    if (!projectRequirements.trim()) {
      errors.projectRequirements = 'Please describe what you want us to build';
    } else if (projectRequirements.trim().length < 15) {
      errors.projectRequirements = 'Please provide a bit more detail (at least 15 characters)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(formErrors)[0];
      const el = document.getElementById(`custom-order-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const finalCategory = businessCategory === 'Other Business' && customCategory.trim() 
        ? customCategory.trim() 
        : businessCategory;

      const finalSolution = requiredSolution === 'Other' && customSolutionName.trim()
        ? customSolutionName.trim()
        : requiredSolution;

      const createdOrder = customSolutionOrderStorage.create({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        whatsappNumber: (sameAsMobile ? mobileNumber : whatsappNumber).trim() || mobileNumber.trim(),
        email: email.trim(),
        businessName: businessName.trim(),
        businessCategory: finalCategory,
        locationCity: locationCity.trim(),
        requiredSolution: finalSolution,
        projectRequirements: projectRequirements.trim(),
        budget: budget || 'Not Sure',
        expectedTimeline: expectedTimeline || '2 to 4 Weeks',
        referenceUrl: referenceUrl.trim(),
        additionalNotes: additionalNotes.trim(),
        referenceFileName: referenceFileName || undefined,
        referenceFileDataUrl: referenceFileDataUrl || undefined
      });

      setSubmittedOrder(createdOrder);
      if (onSuccess) {
        onSuccess(createdOrder);
      }
    } catch (err) {
      console.error('Failed to submit custom solution order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS VIEW
  if (submittedOrder) {
    const whatsappMessage = encodeURIComponent(
      `Hello MANI Solution team, I just placed a Custom Solution Request (${submittedOrder.id}) for "${submittedOrder.requiredSolution}" for my business "${submittedOrder.businessName}". Looking forward to discussing the project architecture!`
    );

    return (
      <div className="p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-bold tracking-wide">
            Order Reference ID: {submittedOrder.id}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#171A1F] pt-1">
            Thank you! Your custom solution request has been received.
          </h3>
          <p className="text-sm sm:text-base text-[#626873] leading-relaxed max-w-lg mx-auto">
            Our principal solutions architect and development team will review your project requirements and contact you shortly.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-[#F8F9FA] border border-[#E4E1DA] rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5 shadow-sm">
          <div className="flex justify-between border-b border-[#E4E1DA] pb-2">
            <span className="text-[#626873]">Client Name:</span>
            <span className="font-bold text-[#171A1F]">{submittedOrder.fullName}</span>
          </div>
          <div className="flex justify-between border-b border-[#E4E1DA] pb-2">
            <span className="text-[#626873]">Business:</span>
            <span className="font-bold text-[#171A1F]">{submittedOrder.businessName}</span>
          </div>
          <div className="flex justify-between border-b border-[#E4E1DA] pb-2">
            <span className="text-[#626873]">Requested Solution:</span>
            <span className="font-bold text-[#2563EB]">{submittedOrder.requiredSolution}</span>
          </div>
          <div className="flex justify-between border-b border-[#E4E1DA] pb-2">
            <span className="text-[#626873]">Budget Scope:</span>
            <span className="font-bold text-[#C79A22]">{submittedOrder.budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#626873]">Expected Timeline:</span>
            <span className="font-semibold text-[#171A1F]">{submittedOrder.expectedTimeline}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/917858022646?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect on WhatsApp Instantly</span>
          </a>

          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] font-bold text-sm transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left">
      
      {/* Header Info */}
      <div className="space-y-2 border-b border-[#E4E1DA] pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C79A22] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Engineering & Development</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#171A1F] tracking-tight">
          Order Your Custom Solution
        </h2>
        <p className="text-sm sm:text-base text-[#626873] leading-relaxed">
          Tell us what you need and we'll design and build a solution around your business.
        </p>
      </div>

      {/* SECTION 1: Client & Business Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C79A22] flex items-center gap-1.5">
          <Building2 className="w-4 h-4" />
          <span>1. Business & Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div id="custom-order-fullName" className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
              } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]`}
            />
            {formErrors.fullName && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div id="custom-order-email" className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@company.com"
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
                  formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
                } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]`}
              />
              <Mail className="w-4 h-4 text-[#626873] absolute left-3 top-3 pointer-events-none" />
            </div>
            {formErrors.email && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div id="custom-order-mobileNumber" className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
                  formErrors.mobileNumber ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
                } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]`}
              />
              <Phone className="w-4 h-4 text-[#626873] absolute left-3 top-3 pointer-events-none" />
            </div>
            {formErrors.mobileNumber && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.mobileNumber}</p>}
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#171A1F]">
                WhatsApp Number <span className="text-[#626873] font-normal">(Optional)</span>
              </label>
              <label className="inline-flex items-center gap-1 text-[11px] text-[#626873] cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsMobile}
                  onChange={(e) => handleSameAsMobileToggle(e.target.checked)}
                  className="rounded border-[#E4E1DA] text-[#C79A22] focus:ring-[#C79A22]"
                />
                <span>Same as Mobile</span>
              </label>
            </div>
            <div className="relative">
              <input
                type="tel"
                disabled={sameAsMobile}
                value={sameAsMobile ? mobileNumber : whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-white disabled:bg-slate-100 text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
              />
              <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Business Name */}
          <div id="custom-order-businessName" className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Business / Organization Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Apex Global Enterprises"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.businessName ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
              } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]`}
            />
            {formErrors.businessName && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.businessName}</p>}
          </div>

          {/* Business Category */}
          <div id="custom-order-businessCategory" className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Business Category <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={businessCategory}
              onChange={(e) => setBusinessCategory(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formErrors.businessCategory ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
              } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]`}
            >
              <option value="">Select Category...</option>
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {businessCategory === 'Other Business' && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Specify your business domain..."
                className="w-full mt-2 px-4 py-2 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F]"
              />
            )}
            {formErrors.businessCategory && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.businessCategory}</p>}
          </div>

          {/* Location / City */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Location / City <span className="text-[#626873] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Jamshedpur, Jharkhand / Mumbai / Delhi NCR"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
              />
              <MapPin className="w-4 h-4 text-[#626873] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: Required Solution & Specifications */}
      <div className="space-y-4 pt-2 border-t border-[#E4E1DA]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#C79A22] flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          <span>2. Project Specifications & Requirements</span>
        </h3>

        {/* Required Solution Selection */}
        <div id="custom-order-requiredSolution" className="space-y-2">
          <label className="block text-xs font-bold text-[#171A1F]">
            Required Solution <span className="text-rose-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {REQUIRED_SOLUTIONS.map((sol) => {
              const isSelected = requiredSolution === sol;
              return (
                <button
                  type="button"
                  key={sol}
                  onClick={() => setRequiredSolution(sol)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-[#171A1F] text-[#ECC348] border-[#171A1F] shadow-sm ring-2 ring-[#ECC348]/40'
                      : 'bg-white text-[#171A1F] border-[#E4E1DA] hover:border-[#C79A22]'
                  }`}
                >
                  <span className="line-clamp-1">{sol}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ECC348] shrink-0" />}
                </button>
              );
            })}
          </div>

          {requiredSolution === 'Other' && (
            <input
              type="text"
              value={customSolutionName}
              onChange={(e) => setCustomSolutionName(e.target.value)}
              placeholder="Specify custom software or application type..."
              className="w-full mt-2 px-4 py-2 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F]"
            />
          )}

          {formErrors.requiredSolution && (
            <p className="text-[11px] text-rose-500 font-semibold">{formErrors.requiredSolution}</p>
          )}
        </div>

        {/* Project Requirements (Large Textarea) */}
        <div id="custom-order-projectRequirements" className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-[#171A1F]">
            Project Requirements <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={projectRequirements}
            onChange={(e) => setProjectRequirements(e.target.value)}
            placeholder="Describe what you want us to build... Include required features, user roles, daily workflow problems to solve, design preferences, or target platforms."
            className={`w-full p-4 rounded-xl border ${
              formErrors.projectRequirements ? 'border-rose-400 bg-rose-50/30' : 'border-[#E4E1DA] bg-white'
            } text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22] leading-relaxed`}
          />
          {formErrors.projectRequirements && (
            <p className="text-[11px] text-rose-500 font-semibold">{formErrors.projectRequirements}</p>
          )}
        </div>

        {/* Budget & Timeline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Approximate Budget */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Approximate Budget</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {BUDGET_OPTIONS.map((bOpt) => {
                const isSelected = budget === bOpt;
                return (
                  <button
                    type="button"
                    key={bOpt}
                    onClick={() => setBudget(bOpt)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-bold text-center transition-all border ${
                      isSelected
                        ? 'bg-[#C79A22] text-[#0A0E17] border-[#C79A22] shadow-sm'
                        : 'bg-white text-[#626873] border-[#E4E1DA] hover:text-[#171A1F]'
                    }`}
                  >
                    {bOpt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expected Timeline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Expected Timeline</span>
            </label>
            <select
              value={expectedTimeline}
              onChange={(e) => setExpectedTimeline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
            >
              {TIMELINE_OPTIONS.map((tOpt) => (
                <option key={tOpt} value={tOpt}>{tOpt}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Reference URL & Additional Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Reference Website / App URL <span className="text-[#626873] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                placeholder="https://example.com/demo"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
              />
              <Globe className="w-4 h-4 text-[#626873] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#171A1F]">
              Additional Notes <span className="text-[#626873] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Need SMS gateway integration, GST invoices..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-white text-sm text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
            />
          </div>

        </div>

        {/* Upload Reference File / Image */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-[#171A1F]">
            Upload Reference File / Image <span className="text-[#626873] font-normal">(Optional — PDF, JPG, PNG up to 10MB)</span>
          </label>
          
          {referenceFileName ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-[#C79A22] shrink-0" />
                <span className="font-bold text-[#171A1F] truncate">{referenceFileName}</span>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 text-[#626873] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors ml-2"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#E4E1DA] hover:border-[#C79A22] rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors bg-white/50 hover:bg-white group">
              <Upload className="w-5 h-5 text-[#626873] group-hover:text-[#C79A22] transition-colors" />
              <p className="text-xs font-bold text-[#171A1F]">
                Click or drag & drop reference screenshot / specification document
              </p>
              <span className="text-[10px] text-[#626873]">
                Supports PNG, JPG, WEBP, PDF, DOCX (Max 10MB)
              </span>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}

          {fileError && (
            <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fileError}</span>
            </p>
          )}
        </div>

      </div>

      {/* Guarantee & Privacy note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-[#626873]">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#171A1F]">100% Confidentiality Guarantee:</strong> Your proprietary business workflows, ideas, and contact information are protected under strict MANI Solution Non-Disclosure standards.
        </p>
      </div>

      {/* Submit Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E4E1DA] bg-white hover:bg-slate-50 text-[#171A1F] font-bold text-sm transition-all"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Submitting Request...</span>
          ) : (
            <>
              <span>Submit Custom Solution Request</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </form>
  );
};
