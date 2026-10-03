import React from 'react';
import { PageView } from '../../types';
import { COMPANY_INFO } from '../../data/companyData';
import { FileText, Shield, ArrowLeft, Calendar, CheckCircle2 } from 'lucide-react';

interface TermsAndConditionsPageProps {
  onNavigate: (page: PageView) => void;
}

export const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({ onNavigate }) => {
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
              <FileText className="w-3.5 h-3.5" />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#171A1F]">Terms & Conditions</h1>
            <p className="text-xs sm:text-sm text-[#626873] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Effective Date: <strong>{effectiveDate}</strong></span>
              <span>• Brand: <strong>{COMPANY_INFO.name}</strong></span>
            </p>
          </div>
        </div>

        {/* Policy Content Body */}
        <div className="bg-white rounded-3xl border border-[#E4E1DA] p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-[#171A1F]">
          
          {/* A. Introduction */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">A. Introduction</h2>
            <p>
              These Terms & Conditions govern the use of the <strong>{COMPANY_INFO.name}</strong> website and the purchase/use of its services and digital products. By using our website, placing an order, purchasing a digital product, subscribing to an ERP plan, or engaging MANI Solution for a service, you agree to abide by these applicable terms.
            </p>
          </div>

          {/* B. Website Development Payment Terms */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">B. Website Development Payment Terms</h2>
            <p className="font-semibold text-[#171A1F] bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              For website development projects: 50% advance payment is required before development work begins. The remaining 50% payment is due after the agreed website work is completed and before/at final delivery or handover, according to the agreed project arrangement.
            </p>
            <p>
              Development work will begin only after the required advance payment has been received. If the project scope changes after development begins, additional charges or timeline changes may apply after discussion with the client.
            </p>
          </div>

          {/* C. Website Development Timeline */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">C. Website Development Timeline</h2>
            <ul className="list-disc pl-5 space-y-2 text-[#626873]">
              <li><strong className="text-[#171A1F]">Template / Ready-to-Launch Website Projects:</strong> Estimated completion in 5–7 working days.</li>
              <li><strong className="text-[#171A1F]">Full Custom Website Projects:</strong> Estimated completion in approximately 30–40 working days.</li>
            </ul>
            <p>
              Custom timelines may vary depending on project complexity, number of pages, features, client requirements, content availability, third-party integrations, revisions, and client response time. Timelines are not unconditional guarantees. If the client delays required content, approvals, or feedback, delivery timelines will be extended accordingly.
            </p>
          </div>

          {/* D. Custom App Development */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">D. Custom App Development</h2>
            <p>
              For full custom applications, estimated development time may be approximately 30–40 working days or longer depending on project complexity. Final timelines depend on agreed scope, features, integrations, testing, and client approvals. Large or complex applications may require a separate project timeline agreement.
            </p>
          </div>

          {/* E. Project Cancellation After Development Starts */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">E. Project Cancellation After Development Starts</h2>
            <p className="font-semibold text-rose-900 bg-rose-50/70 p-3 rounded-xl border border-rose-200">
              If MANI Solution has received an advance payment and has already started development work, and the client later decides that they no longer want to continue the project, the advance payment already received will be non-refundable. This is because development work, time, resources, and project preparation may already have been spent.
            </p>
          </div>

          {/* F. If MANI Solution Cannot Complete the Agreed Project */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">F. If MANI Solution Cannot Complete the Agreed Project</h2>
            <p>
              If MANI Solution accepts a project and, after development work has commenced, determines that it genuinely cannot complete the agreed project within the agreed scope, MANI Solution will communicate this to the client. If MANI Solution is unable to complete the agreed project for reasons attributable to MANI Solution, the advance payment received for the uncompleted project work will be returned to the client, subject to agreed project terms and any clearly documented work already delivered/accepted.
            </p>
          </div>

          {/* G. Project Scope and Change Requests */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">G. Project Scope and Change Requests</h2>
            <p>
              Projects will be developed according to the agreed scope. Requests for additional features, pages, integrations, designs, or functionality that were not part of the original scope may require additional charges, additional development time, and a revised delivery timeline.
            </p>
          </div>

          {/* H. Client Content and Responsibilities */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">H. Client Content and Responsibilities</h2>
            <p>The client is responsible for providing correct business information, text/content, images/logos, required documents, product/service information, feedback, approvals, and API/login credentials when legitimately required. MANI Solution is not responsible for delays caused by missing or delayed client information.</p>
          </div>

          {/* I. Website Hosting */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">I. Website Hosting</h2>
            <p>Clients have two possible options depending on the project:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#626873]">
              <li><strong className="text-[#171A1F]">Option 1:</strong> The client may purchase/pay separately for hosting.</li>
              <li><strong className="text-[#171A1F]">Option 2:</strong> Where technically suitable, MANI Solution may deploy the website using available free hosting such as Vercel's applicable free hosting option.</li>
            </ul>
            <p>Free hosting availability and limits are controlled by the hosting provider and may change.</p>
          </div>

          {/* J. Domain and Third-Party Services */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">J. Domain and Third-Party Services</h2>
            <p>Unless specifically included in the project price, the client is responsible for applicable costs for domains, premium hosting, email services, paid APIs, payment gateways, third-party software, premium plugins, and SMS/WhatsApp API services.</p>
          </div>

          {/* K. ERP Services */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">K. ERP Services</h2>
            <p>Customers may receive a 5-day free trial where the applicable ERP plan provides such a trial. After the trial, continued use requires selecting a plan and making required recurring monthly payments. Exact features depend on the selected ERP plan.</p>
          </div>

          {/* L. ERP Subscription and Payment */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">L. ERP Subscription and Payment</h2>
            <p>ERP customers are responsible for maintaining active subscription payments. If a monthly payment is not completed, MANI Solution may suspend access after appropriate notice where applicable.</p>
          </div>

          {/* M. Digital Products */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">M. Digital Products</h2>
            <p>Digital products include templates, trading journals, Excel files, PDF resources, business templates, e-books, software resources, and ZIP files supplied electronically. Customers are responsible for providing correct email/account information.</p>
          </div>

          {/* N. Digital Product Refund Policy */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">N. Digital Product Refund Policy</h2>
            <p className="font-semibold text-emerald-900 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              ALL DIGITAL PRODUCT SALES ARE FINAL. Once a digital product has been purchased, the purchase is NON-REFUNDABLE. However, if there is a genuine technical issue such as file corruption, inaccessible purchased product, or payment completed without access, contact MANI Solution support for investigation and assistance.
            </p>
          </div>

          {/* O. Digital Product License / Usage */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">O. Digital Product License / Usage</h2>
            <p>Purchased digital products are licensed for permitted personal or business use. Reselling, redistributing, uploading publicly, or sharing original files without permission is strictly prohibited.</p>
          </div>

          {/* P. Intellectual Property */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">P. Intellectual Property</h2>
            <p>MANI Solution's website content, branding, designs, digital products, and software are protected by applicable intellectual property laws. Customers receive only rights explicitly granted.</p>
          </div>

          {/* Q. Privacy and Confidentiality */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">Q. Privacy and Confidentiality</h2>
            <p>MANI Solution respects customer privacy and does not disclose confidential project information or credentials to third parties without permission, except where required by law.</p>
          </div>

          {/* R. Project Portfolio / Social Media */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">R. Project Portfolio / Social Media</h2>
            <p>MANI Solution will not publicly publish customer project details or screenshots without appropriate permission where required.</p>
          </div>

          {/* S. Third-Party Services */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">S. Third-Party Services</h2>
            <p>We may use third-party services for hosting, payment gateways, cloud storage, and communication. We are not responsible for outages controlled by third-party providers.</p>
          </div>

          {/* T. Payment Gateways */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">T. Payment Gateways</h2>
            <p>Payments are processed securely through third-party providers such as Razorpay. We do not store unnecessary card credentials.</p>
          </div>

          {/* U. Warranties and Limitation */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">U. Warranties and Limitation</h2>
            <p>Services and digital products are provided on an as-is basis. We do not guarantee uninterrupted or error-free operation under all external network conditions.</p>
          </div>

          {/* V. Termination / Suspension */}
          <div className="space-y-3">
            <h2 className="text-lg font-black text-[#171A1F] border-b border-[#E4E1DA] pb-2">V. Termination / Suspension</h2>
            <p>MANI Solution may suspend or terminate access for fraudulent activity, payment defaults, or violation of these terms.</p>
          </div>

          {/* W. Policy Updates */}
          <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
            <h2 className="text-lg font-black text-[#171A1F]">W. Policy Updates</h2>
            <p>We may update these Terms & Conditions when necessary by posting the revised version on our website.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
