import React from 'react';
import { PageView } from '../../types';
import { COMPANY_INFO } from '../../data/companyData';
import { ShieldCheck, Lock, Database, UserCheck, Mail, Phone, ArrowLeft, Calendar } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (page: PageView) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const effectiveDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal & Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">Privacy Policy</h1>
            <p className="text-xs sm:text-sm text-[#626873] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Effective Date: <strong>{effectiveDate}</strong></span>
              <span>• Brand: <strong>{COMPANY_INFO.name}</strong></span>
            </p>
          </div>
        </div>

        {/* Policy Content Body */}
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-[#171A1F]">
          
          {/* Introduction */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">1. Introduction & Overview</h2>
            <p>
              Welcome to <strong>{COMPANY_INFO.name}</strong> ("MANI — Modern Advancement for New India", "we", "our", or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, purchase digital products, subscribe to ERP services, or engage us for website development, app development, software solutions, and AI automation services.
            </p>
            <p className="font-semibold text-[#2563EB] bg-blue-50/60 p-3 rounded-xl border border-blue-100">
              Important: MANI Solution does not sell customer personal information. We maintain strict confidentiality regarding customer project details and business data.
            </p>
          </div>

          {/* Information Collected */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#626873]">
              <li><strong className="text-[#171A1F]">Personal Identification Information:</strong> Name, email address, phone number, and company name provided during inquiries, orders, or registration.</li>
              <li><strong className="text-[#171A1F]">Billing & Payment Information:</strong> Payment-related information processed securely through third-party payment providers like Razorpay. We do not store full card numbers or sensitive financial credentials.</li>
              <li><strong className="text-[#171A1F]">Project & Business Information:</strong> Content, logos, brand assets, credentials, and business requirements provided by clients for custom development and ERP setup.</li>
              <li><strong className="text-[#171A1F]">Technical & Usage Information:</strong> Browser type, IP address, device information, operating system, and pages visited on our website.</li>
              <li><strong className="text-[#171A1F]">Cookies:</strong> Standard cookies and tracking technologies used to enhance user experience and analyze site traffic.</li>
            </ul>
          </div>

          {/* How Information is Used */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect for legitimate business purposes, including:</p>
            <ul className="list-disc pl-5 space-y-2 text-[#626873]">
              <li>Processing orders, verifying payments, and delivering purchased digital products securely.</li>
              <li>Managing ERP subscriptions, user accounts, and technical support access.</li>
              <li>Executing website development, custom software, app development, and AI automation projects according to agreed scopes.</li>
              <li>Responding to customer inquiries, support tickets, and consultation requests.</li>
              <li>Improving website performance, security, and user experience.</li>
              <li>Complying with legal obligations and resolving disputes where applicable.</li>
            </ul>
          </div>

          {/* Project & Customer Confidentiality */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#C79A22]" />
              <span>4. Project & Customer Confidentiality</span>
            </h2>
            <p>
              MANI Solution respects customer confidentiality. We do not intentionally publish or disclose private project information, screenshots, proprietary business logic, credentials, or confidential client materials without appropriate permission, except where required by law or necessary to provide the contracted service through trusted service providers.
            </p>
          </div>

          {/* Third-Party Service Providers */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">5. Third-Party Service Providers</h2>
            <p>
              We may share necessary information with trusted third-party service providers who assist us in operating our website, processing payments, hosting infrastructure, and delivering services. These may include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#626873]">
              <li><strong className="text-[#171A1F]">Payment Gateways:</strong> Razorpay for secure online payment processing.</li>
              <li><strong className="text-[#171A1F]">Cloud Hosting Providers:</strong> Vercel and secure cloud servers for web hosting and data storage.</li>
              <li><strong className="text-[#171A1F]">Communication Tools:</strong> Email and messaging services for customer updates and support.</li>
            </ul>
            <p>These third parties are obligated to maintain the confidentiality and security of your information.</p>
          </div>

          {/* Data Security & Retention */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">6. Data Security & Retention</h2>
            <p>
              We implement appropriate technical, administrative, and physical security measures to protect your personal and project information. We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, provide ongoing customer support, comply with legal requirements, and resolve disputes.
            </p>
          </div>

          {/* Customer Rights */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">7. Your Customer Rights</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal information held by MANI Solution. To exercise your rights or ask questions regarding your privacy, please contact our support team.
            </p>
          </div>

          {/* Policy Updates */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">8. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The updated version will be posted on this page with a revised effective date.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
            <h2 className="text-lg font-black text-[#171A1F]">9. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#171A1F]">Brand:</span>
                <span>{COMPANY_INFO.name} ({COMPANY_INFO.tagline})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C79A22]" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-[#2563EB] hover:underline">{COMPANY_INFO.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C79A22]" />
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="text-[#171A1F] font-mono">{COMPANY_INFO.phone}</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
