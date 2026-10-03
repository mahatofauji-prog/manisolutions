import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Cpu, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock, 
  ChevronRight,
  ArrowLeft,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { BookableServiceType, ServiceBooking } from '../../types';
import { serviceBookingStorage } from '../../services/serviceBookingStorage';
import { COMPANY_INFO } from '../../data/companyData';

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: BookableServiceType;
  onBookingConfirmed?: (booking: ServiceBooking) => void;
}

export const BookServiceModal: React.FC<BookServiceModalProps> = ({
  isOpen,
  onClose,
  initialService = 'website',
  onBookingConfirmed
}) => {
  const [selectedService, setSelectedService] = useState<BookableServiceType>(initialService);

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [projectRequirements, setProjectRequirements] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [budget, setBudget] = useState('₹20,000 - ₹50,000');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Service-Specific Fields
  // 1. Website
  const [websiteType, setWebsiteType] = useState('Business / Corporate Website');
  const [requiredPages, setRequiredPages] = useState('Home, About, Services, Contact, WhatsApp CTA');
  const [existingWebsiteUrl, setExistingWebsiteUrl] = useState('');

  // 2. Custom Software
  const [softwareType, setSoftwareType] = useState('Custom ERP / Business Software');
  const [requiredModules, setRequiredModules] = useState('Customer Management, Billing, Reports, Role-Based Access');
  const [userCountOrBranches, setUserCountOrBranches] = useState('1 - 10 Users (Single Branch)');

  // 3. AI Automation
  const [businessType, setBusinessType] = useState('Retail / MSME / Service Provider');
  const [currentWorkflow, setCurrentWorkflow] = useState('');
  const [whatToAutomate, setWhatToAutomate] = useState('Customer Inquiries, WhatsApp Follow-Ups & Lead Management');
  const [currentToolsUsed, setCurrentToolsUsed] = useState('WhatsApp, Google Sheets, Email');

  // UI Flow States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentFailedState, setPaymentFailedState] = useState<{ failed: boolean; reason?: string }>({ failed: false });
  const [confirmedBooking, setConfirmedBooking] = useState<ServiceBooking | null>(null);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setPaymentFailedState({ failed: false });
      setConfirmedBooking(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleServiceChange = (st: BookableServiceType) => {
    setSelectedService(st);
    setErrorMessage('');
    setPaymentFailedState({ failed: false });
  };

  const handlePayAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPaymentFailedState({ failed: false });

    // Basic Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city/location.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order on Server for exactly ₹199 (19900 paise)
      const payload = {
        serviceType: selectedService,
        fullName: fullName.trim(),
        businessName: businessName.trim() || 'Individual / Startup',
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        projectRequirements: projectRequirements.trim() || 'Direct architecture consultation booking.',
        preferredContactMethod,
        websiteType: selectedService === 'website' ? websiteType : undefined,
        requiredPages: selectedService === 'website' ? requiredPages : undefined,
        existingWebsiteUrl: selectedService === 'website' ? existingWebsiteUrl.trim() : undefined,
        softwareType: selectedService === 'custom_software' ? softwareType : undefined,
        requiredModules: selectedService === 'custom_software' ? requiredModules : undefined,
        userCountOrBranches: selectedService === 'custom_software' ? userCountOrBranches : undefined,
        businessType: selectedService === 'ai_automation' ? businessType : undefined,
        currentWorkflow: selectedService === 'ai_automation' ? currentWorkflow : undefined,
        whatToAutomate: selectedService === 'ai_automation' ? whatToAutomate : undefined,
        currentToolsUsed: selectedService === 'ai_automation' ? currentToolsUsed : undefined,
        budget,
        additionalRequirements: additionalRequirements.trim()
      };

      const orderRes = await serviceBookingStorage.createBookingOrder(payload);

      if (!orderRes.success || !orderRes.razorpayOrderId) {
        setIsProcessing(false);
        setErrorMessage(orderRes.message || 'Failed to initialize booking payment order with server.');
        return;
      }

      // 2. Open Official Razorpay Checkout Modal
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderRes.keyId,
          amount: 19900, // 19900 paise = ₹199
          currency: 'INR',
          name: 'MANI Solution',
          description: `Booking Fee: ${
            selectedService === 'website'
              ? 'Website Development'
              : selectedService === 'custom_software'
              ? 'Custom Software Development'
              : 'AI Automation'
          }`,
          order_id: orderRes.razorpayOrderId,
          prefill: {
            name: fullName,
            email: email,
            contact: phone
          },
          notes: {
            bookingId: orderRes.bookingId,
            serviceType: selectedService
          },
          theme: { color: '#C79A22' },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setPaymentFailedState({
                failed: true,
                reason: 'Payment process was cancelled by user. Your booking has not been confirmed.'
              });
            }
          },
          handler: async (response: any) => {
            // 3. Server-Side Payment Signature & Amount Verification
            try {
              const verifyRes = await serviceBookingStorage.verifyPayment({
                bookingId: orderRes.bookingId!,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              setIsProcessing(false);

              if (verifyRes.success && verifyRes.booking) {
                setConfirmedBooking(verifyRes.booking);
                if (onBookingConfirmed) {
                  onBookingConfirmed(verifyRes.booking);
                }
              } else {
                setPaymentFailedState({
                  failed: true,
                  reason: verifyRes.message || 'Payment signature verification failed on server.'
                });
              }
            } catch (vErr: any) {
              setIsProcessing(false);
              setPaymentFailedState({
                failed: true,
                reason: vErr.message || 'Server error while verifying Razorpay signature.'
              });
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          console.error('Razorpay Booking Payment Failed:', resp.error);
          setIsProcessing(false);
          setPaymentFailedState({
            failed: true,
            reason: resp.error?.description || resp.error?.reason || 'Payment was declined.'
          });
        });
        rzp.open();
      } else {
        setIsProcessing(false);
        setErrorMessage('Razorpay Checkout SDK is still loading in browser. Please check your internet connection or refresh and try again.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected error occurred while setting up your booking.');
    }
  };

  return (
    <div 
      id="service-booking-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-[#E4E1DA] shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E4E1DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C79A22]/15 border border-[#C79A22]/30 flex items-center justify-center text-[#C79A22]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#171A1F]">
                Book Professional Service
              </h2>
              <p className="text-[11px] text-[#626873]">
                Direct technical consultation with founder & engineering team
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 bg-[#FDFBF7]/40">
          
          {/* CONFIRMATION STATE VIEW */}
          {confirmedBooking ? (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Booking Confirmed
                </span>
                <h3 className="text-2xl font-black text-[#171A1F]">
                  Thank you for choosing MANI Solution!
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] leading-relaxed">
                  Your service booking has been successfully confirmed. Our team will review your requirements and connect with you soon.
                </p>
              </div>

              {/* Booking Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3 text-left max-w-lg mx-auto text-xs">
                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2.5">
                  <span className="text-[#626873] font-semibold">Service</span>
                  <span className="font-bold text-[#171A1F]">{confirmedBooking.serviceName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2.5">
                  <span className="text-[#626873] font-semibold">Booking ID</span>
                  <span className="font-mono font-bold text-[#C79A22]">{confirmedBooking.bookingId}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2.5">
                  <span className="text-[#626873] font-semibold">Booking Amount</span>
                  <span className="font-bold text-[#171A1F]">₹{confirmedBooking.amount}</span>
                </div>

                <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2.5">
                  <span className="text-[#626873] font-semibold">Payment Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified & Paid
                  </span>
                </div>

                {confirmedBooking.razorpayPaymentId && (
                  <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-2.5">
                    <span className="text-[#626873] font-semibold">Razorpay Payment ID</span>
                    <span className="font-mono text-slate-700 text-[11px]">{confirmedBooking.razorpayPaymentId}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#626873] font-semibold">Client Name</span>
                  <span className="font-bold text-[#171A1F]">{confirmedBooking.fullName} ({confirmedBooking.phone})</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 max-w-lg mx-auto">
                Our team will contact you using the details provided in your booking via {confirmedBooking.preferredContactMethod}.
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Close & Return to Site
                </button>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
                    `Hello MANI Solution,\n\nI have just booked ${confirmedBooking.serviceName} (Booking ID: ${confirmedBooking.bookingId}).\n\nLooking forward to our technical consultation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp Now
                </a>
              </div>
            </div>
          ) : (
            /* BOOKING FORM VIEW */
            <form onSubmit={handlePayAndBook} className="space-y-5">
              
              {/* Service Selection Tabs (3 Services) */}
              <div>
                <label className="block text-xs font-bold text-[#171A1F] mb-1.5 uppercase tracking-wider">
                  1. Select Service to Book
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleServiceChange('website')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedService === 'website'
                        ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-md'
                        : 'bg-white text-slate-700 border-[#E4E1DA] hover:border-[#C79A22]'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${selectedService === 'website' ? 'text-[#C79A22]' : 'text-slate-500'}`} />
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">Website</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleServiceChange('custom_software')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedService === 'custom_software'
                        ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-md'
                        : 'bg-white text-slate-700 border-[#E4E1DA] hover:border-[#C79A22]'
                    }`}
                  >
                    <Cpu className={`w-4 h-4 ${selectedService === 'custom_software' ? 'text-[#C79A22]' : 'text-slate-500'}`} />
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">Custom Software</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleServiceChange('ai_automation')}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      selectedService === 'ai_automation'
                        ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-md'
                        : 'bg-white text-slate-700 border-[#E4E1DA] hover:border-[#C79A22]'
                    }`}
                  >
                    <Bot className={`w-4 h-4 ${selectedService === 'ai_automation' ? 'text-[#C79A22]' : 'text-slate-500'}`} />
                    <span className="text-[11px] sm:text-xs font-bold leading-tight">AI Automation</span>
                  </button>
                </div>
              </div>

              {/* Service Details Banner */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-amber-100 text-[#C79A22]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {selectedService === 'website' 
                        ? 'Website Development Architecture Booking' 
                        : selectedService === 'custom_software' 
                        ? 'Custom Software / ERP Architecture Booking' 
                        : 'Business AI & Automation Workflow Booking'}
                    </span>
                    <span className="text-[11px] text-slate-600">Fixed Consultation Fee • Direct Founder Review</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 line-through block">₹999</span>
                  <span className="text-sm font-black text-[#171A1F]">₹199</span>
                </div>
              </div>

              {/* Common Fields */}
              <div className="space-y-3">
                <span className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                  2. Contact & Organization Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Business / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma Tech Clinic"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      City / State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Preferred Contact Method
                    </label>
                    <select
                      value={preferredContactMethod}
                      onChange={(e) => setPreferredContactMethod(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                    >
                      <option value="WhatsApp">WhatsApp (Fastest response)</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Service-Specific Fields */}
              <div className="space-y-3 pt-1">
                <span className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                  3. {selectedService === 'website' ? 'Website Details' : selectedService === 'custom_software' ? 'Software Scope' : 'AI Automation Scope'}
                </span>

                {/* WEBSITE SPECIFIC */}
                {selectedService === 'website' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Website Type
                        </label>
                        <select
                          value={websiteType}
                          onChange={(e) => setWebsiteType(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        >
                          <option value="Business / Corporate Website">Business / Corporate Website</option>
                          <option value="E-commerce Store">E-commerce Store (Razorpay/UPI)</option>
                          <option value="School / College / Institution">School / College / Institution</option>
                          <option value="Clinic / Hospital Portal">Clinic / Hospital Portal</option>
                          <option value="Restaurant / Food Service">Restaurant / Food Service</option>
                          <option value="Trust / NGO Website">Trust / NGO Website</option>
                          <option value="Custom Web Application">Custom Web Application</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Existing Website URL (if redesigning)
                        </label>
                        <input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={existingWebsiteUrl}
                          onChange={(e) => setExistingWebsiteUrl(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Key Required Pages & Features
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Home, About Us, Services, Inquiry Form, WhatsApp Chat, Admin Portal"
                        value={requiredPages}
                        onChange={(e) => setRequiredPages(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                      />
                    </div>
                  </div>
                )}

                {/* CUSTOM SOFTWARE SPECIFIC */}
                {selectedService === 'custom_software' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Software / System Type
                        </label>
                        <select
                          value={softwareType}
                          onChange={(e) => setSoftwareType(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        >
                          <option value="Custom ERP System">Custom ERP System</option>
                          <option value="CRM & Lead Management">CRM & Lead Management</option>
                          <option value="Billing & Inventory Software">Billing & Inventory Software</option>
                          <option value="Hospital / Clinic Management System">Hospital / Clinic Management System</option>
                          <option value="School / Institute Management System">School / Institute Management System</option>
                          <option value="Custom Web/Mobile App">Custom Web/Mobile App</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Number of Users / Branches
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 15 staff users, 2 office branches"
                          value={userCountOrBranches}
                          onChange={(e) => setUserCountOrBranches(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Key Modules / Features Needed
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Billing, Patient Tokens, Staff Attendance, WhatsApp Invoices, PDF Reports"
                        value={requiredModules}
                        onChange={(e) => setRequiredModules(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                      />
                    </div>
                  </div>
                )}

                {/* AI AUTOMATION SPECIFIC */}
                {selectedService === 'ai_automation' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Business Industry / Type
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Real Estate, Clinic, Retail, B2B Manufacturing"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Tools / Platforms Currently Used
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. WhatsApp, Google Sheets, Excel, Tally, Zoho"
                          value={currentToolsUsed}
                          onChange={(e) => setCurrentToolsUsed(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        What do you want to automate?
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 24/7 WhatsApp AI customer replies, Auto lead capture into CRM, Automated follow-ups"
                        value={whatToAutomate}
                        onChange={(e) => setWhatToAutomate(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                      />
                    </div>
                  </div>
                )}

                {/* Requirements Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Describe Your Project Requirements / Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide any additional details, operational challenges, or specific milestones you want to achieve..."
                    value={projectRequirements}
                    onChange={(e) => setProjectRequirements(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                  />
                </div>
              </div>

              {/* Approximate Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Approximate Project Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-white focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000 (Standard)</option>
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Advanced)</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Full Stack / ERP)</option>
                    <option value="₹1,00,000+">₹1,00,000+ (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Booking Consultation Amount
                  </label>
                  <div className="px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 font-bold text-[#171A1F] flex items-center justify-between">
                    <span>Fixed Consultation Fee</span>
                    <span className="text-emerald-700 font-mono text-sm font-black">₹199 Only</span>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Failed Alert (with Try Again option) */}
              {paymentFailedState.failed && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Payment was not completed.</span>
                  </div>
                  <p className="text-slate-700">
                    {paymentFailedState.reason || 'Your payment was declined or cancelled. Your booking has not been confirmed.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentFailedState({ failed: false })}
                    className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Sticky Submit Button Strip */}
              <div className="pt-2 border-t border-[#E4E1DA] space-y-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isProcessing
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#171A1F] hover:bg-black text-white hover:shadow-lg'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#C79A22]" />
                  <span>
                    {isProcessing 
                      ? 'Initializing Secure Razorpay...' 
                      : `PAY ₹199 & BOOK ${selectedService === 'website' ? 'WEBSITE' : selectedService === 'custom_software' ? 'SOFTWARE' : 'AI AUTOMATION'}`}
                  </span>
                </button>

                <div className="flex items-center justify-between text-[10px] text-[#626873] px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Secure 256-bit encrypted Razorpay payment
                  </span>
                  <span>Instant server-side verification</span>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
