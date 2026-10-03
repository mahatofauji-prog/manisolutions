import React from 'react';
import { PageView } from '../../types';
import { COMPANY_INFO } from '../../data/companyData';
import { RefreshCw, ArrowLeft, ShieldCheck, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';

interface RefundCancellationPolicyPageProps {
  onNavigate: (page: PageView) => void;
}

export const RefundCancellationPolicyPage: React.FC<RefundCancellationPolicyPageProps> = ({ onNavigate }) => {
  const effectiveDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        
        {/* Back Button & Header */}
        <div className="space-y-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C79A22] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="space-y-2 border-b border-[#E4E1DA] pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C79A22]/10 text-[#C79A22] text-xs font-black border border-[#C79A22]/30">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refund & Cancellation Policy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">
              Refund & Cancellation Policy
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#626873]">
              <Calendar className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Last updated: {effectiveDate}</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-[#474D57] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171A1F]">1. Digital Products & Downloads</h2>
            <p>
              Due to the immediate digital delivery and non-tangible irrevocable nature of downloadable assets (such as E-books, source code packages, templates, and digital files), all sales of digital products are generally non-refundable once the file or download link has been accessed or generated.
            </p>
            <p>
              However, if you experience technical issues downloading the file, or if the product file is corrupt or does not match the product description, please reach out to us at <strong>{COMPANY_INFO.email}</strong> within 7 days of purchase. We will promptly provide a replacement or resolution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171A1F]">2. Custom Software & Website Development</h2>
            <p>
              For custom software, ERP development, and custom website projects:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Project milestones and cancellation terms are specified in the individual service agreement.</li>
              <li>Advance or milestone payments cover design and development hours already rendered and are non-refundable once milestone deliverables are approved.</li>
              <li>Clients may cancel ongoing maintenance agreements by giving 30 days written notice before the next billing cycle.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171A1F]">3. Refund Processing</h2>
            <p>
              If a refund is approved by MANI Solution management under eligible circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The refund will be processed to the original payment method (via Razorpay or bank transfer) within 5 to 7 business days.</li>
              <li>Confirmation of refund initiation will be emailed to your registered email address.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#171A1F]">4. Contact For Inquiries & Disputes</h2>
            <p>
              If you have any questions concerning our refund or cancellation terms, please contact:
            </p>
            <div className="p-4 rounded-xl border border-[#E4E1DA] bg-slate-50 space-y-2">
              <p className="font-bold text-[#171A1F]">{COMPANY_INFO.name}</p>
              <p className="text-xs text-[#626873]">Email: {COMPANY_INFO.email}</p>
              <p className="text-xs text-[#626873]">Phone: {COMPANY_INFO.phone}</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
