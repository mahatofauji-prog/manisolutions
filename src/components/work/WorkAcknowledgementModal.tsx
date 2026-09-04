import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  Search, 
  ArrowRight,
  Clock,
  User,
  Tag,
  Calendar
} from 'lucide-react';
import { ManiLogo } from '../ManiLogo';
import { COMPANY_INFO } from '../../data/companyData';
import { WorkApplicationItem } from '../../types';

interface WorkAcknowledgementModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: WorkApplicationItem | null;
  onOpenTracker?: (appId: string) => void;
}

export const WorkAcknowledgementModal: React.FC<WorkAcknowledgementModalProps> = ({
  isOpen,
  onClose,
  application,
  onOpenTracker
}) => {
  if (!isOpen || !application) return null;

  const formattedDate = new Date(application.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-[#E4E1DA] rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 text-[#171A1F] z-10 overflow-hidden space-y-6">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Submission Confirmed
              </span>
              <h3 className="text-xl font-black text-[#171A1F]">Application Submitted Successfully</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* OFFICIAL ACKNOWLEDGEMENT LETTER PREVIEW & PRINTABLE VIEW */}
        {/* ============================================================ */}
        <div 
          id="printable-acknowledgement-sheet" 
          className="p-6 sm:p-8 rounded-2xl bg-[#FCFAF6] border-2 border-[#E4E1DA] shadow-inner space-y-6 text-left relative"
        >
          {/* Watermark/Background Accent */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <ManiLogo size="lg" showText={false} />
          </div>

          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#171A1F] pb-5">
            <div className="flex items-center gap-3">
              <ManiLogo size="md" />
            </div>
            <div className="sm:text-right space-y-0.5 text-xs text-[#626873]">
              <div className="font-bold text-[#171A1F] text-sm">MANI SOLUTION</div>
              <div className="text-[11px] font-medium text-[#C79A22]">Modern Advancement for New India</div>
              <div>Web: manisolution.com | Official Contributor Portal</div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="text-center space-y-1 py-1">
            <span className="px-3 py-1 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#8C6B14] text-[10px] font-bold tracking-widest uppercase inline-block">
              WORK WITH US & EARN
            </span>
            <h4 className="text-lg sm:text-xl font-black tracking-tight text-[#171A1F]">
              APPLICATION ACKNOWLEDGEMENT
            </h4>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-4 sm:p-5 rounded-xl border border-[#E4E1DA]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#C79A22]" />
                Application Number
              </span>
              <div className="text-base font-black font-mono text-[#2563EB] tracking-wider">
                {application.id}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1">
                <User className="w-3 h-3 text-[#C79A22]" />
                Applicant Name
              </span>
              <div className="text-sm font-bold text-[#171A1F]">
                {application.fullName}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#C79A22]" />
                Applied Category
              </span>
              <div className="text-xs font-semibold text-[#171A1F] flex flex-wrap gap-1">
                {application.workCategories.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C79A22]" />
                Application Date
              </span>
              <div className="text-xs font-medium text-[#171A1F]">
                {formattedDate}
              </div>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#626873]">Current Status:</span>
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{application.status || 'Application Received'}</span>
              </span>
            </div>
          </div>

          {/* Acknowledgement Message */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed space-y-1.5">
            <p className="font-bold text-amber-900">
              Dear {application.fullName},
            </p>
            <p>
              “Thank you for applying to work with MANI Solution. Your application has been successfully received and is currently under review.”
            </p>
            <p className="text-[11px] text-amber-800">
              Please preserve your unique Application Number <strong>{application.id}</strong> to track your review progress anytime through our online portal.
            </p>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="pt-2 border-t border-[#E4E1DA] text-[10px] text-[#626873] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C79A22] shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> This document serves strictly as an electronic application receipt. This acknowledgement is <strong>NOT an offer letter or selection letter</strong>. Project assignment and 40% contributor payouts are subject to profile shortlisting and agreed project deliverables.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {onOpenTracker && (
            <button
              onClick={() => onOpenTracker(application.id)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Search className="w-4 h-4 text-[#2563EB]" />
              <span>Track Application Status</span>
            </button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] text-xs font-semibold transition-all"
            >
              Done
            </button>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Acknowledgement (PDF)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
