import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Home, Globe, MessageSquare, Phone, Mail, Calendar, FileText } from 'lucide-react';
import { ServiceBooking, PageView } from '../../types';
import { COMPANY_INFO } from '../../data/companyData';

interface BookingConfirmationViewProps {
  booking: ServiceBooking | null;
  onNavigate: (page: PageView) => void;
}

export const BookingConfirmationView: React.FC<BookingConfirmationViewProps> = ({
  booking,
  onNavigate
}) => {
  if (!booking) {
    return (
      <div className="pt-20 pb-28 min-h-screen bg-[var(--theme-bg-main)] flex items-center justify-center px-4 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E4E1DA] shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#C79A22] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#171A1F]">No Booking Selected</h2>
          <p className="text-xs text-[#626873]">
            Please select a service or view existing bookings.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 rounded-xl bg-[#171A1F] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="booking-confirmation-page" className="pt-12 sm:pt-16 pb-24 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        {/* Success Icon & Headings */}
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-300 inline-block">
              ✓ BOOKING CONFIRMED
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171A1F] font-sans tracking-tight">
              Thank you for choosing MANI Solution.
            </h1>
            <p className="text-sm sm:text-base text-[#626873] max-w-xl mx-auto leading-relaxed">
              Your service booking has been successfully confirmed. Our team will review your requirements and connect with you soon.
            </p>
          </div>
        </div>

        {/* Detailed Booking Summary Card */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E4E1DA] shadow-xl text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E1DA] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">
                Official Booking Reference
              </span>
              <span className="text-lg sm:text-xl font-mono font-black text-[#171A1F]">
                {booking.bookingId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified & Paid
              </span>
            </div>
          </div>

          {/* Key Parameters 2-Col Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[#626873] font-semibold block">SERVICE</span>
              <span className="font-bold text-sm text-[#171A1F] block">{booking.serviceName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[#626873] font-semibold block">BOOKING AMOUNT</span>
              <span className="font-bold text-sm text-[#171A1F] block">₹{booking.amount} (INR)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[#626873] font-semibold block">PAYMENT STATUS</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1">
                ✓ Verified & Paid via Razorpay
              </span>
            </div>

            {booking.razorpayPaymentId && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[#626873] font-semibold block">RAZORPAY PAYMENT ID</span>
                <span className="font-mono text-slate-800 text-xs truncate block">{booking.razorpayPaymentId}</span>
              </div>
            )}
          </div>

          {/* Client Details Section */}
          <div className="border-t border-[#E4E1DA] pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Customer & Project Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#626873]">
              <div>
                <span className="font-semibold text-slate-800">Client Name:</span> {booking.fullName}
              </div>
              {booking.businessName && (
                <div>
                  <span className="font-semibold text-slate-800">Organization:</span> {booking.businessName}
                </div>
              )}
              <div>
                <span className="font-semibold text-slate-800">Phone:</span> {booking.phone}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Email:</span> {booking.email}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Location:</span> {booking.city}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Preferred Contact:</span> {booking.preferredContactMethod}
              </div>
            </div>

            {booking.projectRequirements && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-slate-800 space-y-1 mt-2">
                <span className="font-bold text-amber-900 block">Submitted Requirements:</span>
                <p className="leading-relaxed whitespace-pre-line">{booking.projectRequirements}</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center leading-relaxed">
            Our team will contact you using the details provided in your booking via <strong>{booking.preferredContactMethod}</strong>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#C79A22]" />
            <span>View Services</span>
          </button>

          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(
              `Hello MANI Solution,\n\nI have confirmed booking ID: ${booking.bookingId} for ${booking.serviceName} (₹199 Paid).\n\nLet me know when we can begin our consultation.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
