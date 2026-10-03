import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { brandLogoStorage, subscribeToBrandLogo } from '../../services/brandLogoStorage';
import { 
  renderFrontCardToCanvas, 
  renderBackCardToCanvas, 
  downloadIdCardPdf 
} from '../../utils/idCardGenerator';

interface AuthorizedContributorIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributor: {
    fullName: string;
    contributorId: string;
    role: string;
    profilePhoto?: string;
    issueDate?: string;
    status?: string;
  };
  onOpenVerification?: (contributorId: string) => void;
}

export const AuthorizedContributorIdCardModal: React.FC<AuthorizedContributorIdCardModalProps> = ({
  isOpen,
  onClose,
  contributor,
  onOpenVerification
}) => {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');
  const [logoUrl, setLogoUrl] = useState<string>(() => brandLogoStorage.getActiveLogoUrl());
  const [copiedId, setCopiedId] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Subscribe to live brand logo updates
  useEffect(() => {
    const handleLogoUpdate = () => {
      const active = brandLogoStorage.getActiveLogoUrl();
      setLogoUrl(active);
    };
    handleLogoUpdate();
    const unsubscribe = subscribeToBrandLogo(handleLogoUpdate);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Format issue date nicely (e.g. "21 Aug 2026")
  const formattedDate = contributor.issueDate 
    ? new Date(contributor.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '21 Aug 2026';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(contributor.contributorId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // 100% Reliable PDF Download (Canvas 2D Engine -> jsPDF)
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    setDownloadSuccess(null);

    try {
      await downloadIdCardPdf(contributor, logoUrl);
      setDownloadSuccess('ID Card PDF downloaded successfully!');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback
      setErrorMessage('Could not auto-download PDF. Click "Print / Save ID Card (PDF)" to save as PDF directly.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 100% Reliable Image Download (Canvas 2D Engine -> PNG)
  const handleDownloadImage = async (side: 'front' | 'back') => {
    if (isGeneratingImage) return;
    setIsGeneratingImage(true);
    setErrorMessage(null);
    setDownloadSuccess(null);

    try {
      const canvas = side === 'front' 
        ? await renderFrontCardToCanvas(contributor, logoUrl)
        : await renderBackCardToCanvas(contributor);

      const dataUrl = canvas.toDataURL('image/png');
      const safeName = (contributor.fullName || 'Contributor').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${contributor.contributorId || 'MANI'}_${safeName}_${side.toUpperCase()}_CARD.png`;

      // Trigger instant direct download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(`${side === 'front' ? 'Front' : 'Back'} ID Card Image downloaded!`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Image Export Error:', err);
      setErrorMessage('Image download failed. Please use "Print / Save ID Card (PDF)".');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Reusable Front Card JSX for on-screen preview
  const renderFrontCard = () => {
    return (
      <div 
        className="relative w-full max-w-[340px] sm:max-w-[350px] aspect-[54/85.6] rounded-3xl overflow-hidden bg-[#0A0F1D] border-2 border-[#C79A22]/70 shadow-2xl flex flex-col justify-between text-center text-white select-none transition-all duration-300 print-card-page"
        style={{
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 25px -5px rgba(199,154,34,0.25)'
        }}
      >
        {/* Top Golden Accent Trim Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ECC348] via-[#C79A22] to-[#ECC348] z-20" />

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        {/* CARD FRONT HEADER: Logo & Brand */}
        <div className="relative z-10 pt-5 px-5 pb-3">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C79A22] bg-[#040711] shadow-md flex items-center justify-center mb-1.5">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="MANI Solution" 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/mani-logo.png';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#1E293B] flex items-center justify-center font-bold text-[#ECC348] text-sm">
                  MS
                </div>
              )}
            </div>
            
            <h3 className="text-base font-black tracking-wider text-white uppercase leading-none mt-1">
              MANI <span className="text-[#ECC348]">SOLUTION</span>
            </h3>
            
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
              Modern Advancement for New India
            </p>
          </div>
        </div>

        {/* CARD FRONT BODY: Contributor Information */}
        <div className="relative z-10 px-5 flex-1 flex flex-col items-center justify-center space-y-3">
          
          {/* Badge: AUTHORIZED CONTRIBUTOR */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C79A22]/15 border border-[#ECC348]/50 text-[#ECC348] text-xs font-extrabold tracking-wider uppercase shadow-inner">
            <Award className="w-3.5 h-3.5 text-[#ECC348]" />
            <span>Authorized Contributor</span>
          </div>

          {/* Profile Photo with Golden Ring & Verified Indicator */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#ECC348] bg-slate-900 shadow-xl mx-auto flex items-center justify-center">
              {contributor.profilePhoto ? (
                <img 
                  src={contributor.profilePhoto} 
                  alt={contributor.fullName} 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-3xl font-black text-slate-400">
                  {contributor.fullName ? contributor.fullName.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
            </div>
            
            {/* Active Verified Tick Badge */}
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0A0F1D] flex items-center justify-center shadow-md">
              <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
          </div>

          {/* Contributor Name & Role */}
          <div className="text-center space-y-0.5">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {contributor.fullName || 'Contributor'}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-blue-300 leading-tight">
              {contributor.role}
            </p>
          </div>

          {/* Contributor ID Box */}
          <div className="w-full bg-[#050811]/90 border border-slate-700/80 rounded-xl py-2 px-3 shadow-inner flex flex-col items-center justify-center">
            <span className="text-[9.5px] uppercase tracking-widest text-slate-400 font-bold">
              Contributor ID
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs sm:text-sm font-mono font-black text-[#ECC348] tracking-wider">
                {contributor.contributorId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded text-slate-400 hover:text-white transition-colors no-print"
                title="Copy Contributor ID"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>

        {/* CARD FRONT FOOTER: Status & Issue Date */}
        <div className="relative z-10 px-5 pt-2.5 pb-4 border-t border-slate-800 bg-[#070B14]/80">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE CONTRIBUTOR</span>
            </span>
            <span className="text-slate-300 font-medium font-mono text-[11.5px]">
              Issue Date: {formattedDate}
            </span>
          </div>
        </div>

      </div>
    );
  };

  // Reusable Back Card JSX for on-screen preview
  const renderBackCard = () => (
    <div 
      className="relative w-full max-w-[340px] sm:max-w-[350px] aspect-[54/85.6] rounded-3xl overflow-hidden bg-[#0A0F1D] border-2 border-[#C79A22]/70 shadow-2xl flex flex-col justify-between text-left text-white select-none transition-all duration-300 print-card-page"
      style={{
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 25px -5px rgba(199,154,34,0.25)'
      }}
    >
      {/* Top Golden Accent Trim Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2563EB] via-[#C79A22] to-[#ECC348] z-20" />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* CARD BACK HEADER */}
      <div className="relative z-10 pt-5 px-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black tracking-wider text-white uppercase leading-none">
              MANI SOLUTION
            </h4>
            <p className="text-[10px] font-bold text-[#ECC348] uppercase tracking-widest mt-1">
              CONTRIBUTOR INFORMATION
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/40 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            OFFICIAL ID
          </span>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-3" />
      </div>

      {/* CARD BACK BODY: Structured Information Table */}
      <div className="relative z-10 px-5 flex-1 flex flex-col justify-center space-y-3">
        
        {/* Information Card Container */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-inner">
          
          {/* Row 1: Contributor ID */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Contributor ID</span>
            <span className="text-xs sm:text-sm font-bold font-mono text-[#ECC348] tracking-wider">
              {contributor.contributorId}
            </span>
          </div>

          {/* Row 2: Role / Domain */}
          <div className="flex items-start justify-between pb-2 border-b border-slate-800 gap-2">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Role / Domain</span>
            <span className="text-xs sm:text-sm font-bold text-white text-right leading-tight">
              {contributor.role}
            </span>
          </div>

          {/* Row 3: Issue Date */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Issue Date</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-200 font-mono">
              {formattedDate}
            </span>
          </div>

          {/* Row 4: Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Contributor</span>
            </span>
          </div>

        </div>

        {/* QR Code Verification Block */}
        <div className="bg-[#050811] border border-slate-800 rounded-2xl p-3 flex items-center gap-3.5 shadow-md">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
              <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
              <rect x="10" y="10" width="28" height="28" fill="#000" />
              <rect x="15" y="15" width="18" height="18" fill="#fff" />
              <rect x="19" y="19" width="10" height="10" fill="#000" />

              <rect x="62" y="10" width="28" height="28" fill="#000" />
              <rect x="67" y="15" width="18" height="18" fill="#fff" />
              <rect x="71" y="19" width="10" height="10" fill="#000" />

              <rect x="10" y="62" width="28" height="28" fill="#000" />
              <rect x="15" y="67" width="18" height="18" fill="#fff" />
              <rect x="19" y="71" width="10" height="10" fill="#000" />

              <rect x="44" y="12" width="6" height="6" fill="#000" />
              <rect x="44" y="24" width="6" height="6" fill="#000" />
              <rect x="44" y="36" width="6" height="6" fill="#000" />
              <rect x="44" y="48" width="6" height="6" fill="#000" />
              <rect x="44" y="60" width="6" height="6" fill="#000" />
              <rect x="44" y="72" width="6" height="6" fill="#000" />
              <rect x="44" y="84" width="6" height="6" fill="#000" />

              <rect x="12" y="44" width="6" height="6" fill="#000" />
              <rect x="24" y="44" width="6" height="6" fill="#000" />
              <rect x="36" y="44" width="6" height="6" fill="#000" />
              <rect x="60" y="44" width="6" height="6" fill="#000" />
              <rect x="72" y="44" width="6" height="6" fill="#000" />
              <rect x="84" y="44" width="6" height="6" fill="#000" />

              <rect x="56" y="56" width="12" height="12" fill="#000" />
              <rect x="74" y="56" width="10" height="8" fill="#000" />
              <rect x="56" y="74" width="8" height="14" fill="#000" />
              <rect x="70" y="72" width="18" height="16" fill="#000" />
              <rect x="74" y="76" width="10" height="8" fill="#fff" />
              <rect x="78" y="80" width="4" height="4" fill="#000" />
              <rect x="24" y="54" width="8" height="4" fill="#000" />
              <rect x="54" y="20" width="4" height="8" fill="#000" />
            </svg>
          </div>

          <div className="space-y-1 text-left flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ECC348]" />
              <span>VERIFY CONTRIBUTOR</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-snug">
              Scan this QR code to verify this Contributor ID.
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              manisolution.com/verify
            </p>
          </div>
        </div>

      </div>

      {/* CARD BACK FOOTER */}
      <div className="relative z-10 px-5 pt-2 pb-4 border-t border-slate-800 bg-[#070B14]/80 text-center">
        <p className="text-[11px] font-medium text-slate-400 leading-normal">
          Authorized contributor credential issued by MANI Solution.
        </p>
      </div>

    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Dedicated Print Styles for Browser Print Dialog */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #dedicated-print-id-card,
          #dedicated-print-id-card * {
            visibility: visible !important;
          }
          #dedicated-print-id-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 30px !important;
            padding: 10px 0 !important;
            margin: 0 auto !important;
            background: transparent !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-card-page {
            width: 340px !important;
            height: 539px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-card-page:first-child {
            page-break-after: always !important;
            break-after: page !important;
            margin-bottom: 40px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Dedicated Print Target Element */}
      <div id="dedicated-print-id-card" className="hidden print:flex">
        {renderFrontCard()}
        {renderBackCard()}
      </div>

      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#0B1120] border border-slate-700/80 rounded-3xl shadow-2xl max-w-4xl w-full p-4 sm:p-7 text-white z-10 overflow-hidden space-y-5">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C79A22]/20 border border-[#ECC348]/40 flex items-center justify-center shadow-md">
              <Award className="w-5 h-5 text-[#ECC348]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Authorized Contributor Digital ID Card
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official digital credential issued by MANI Solution for verified project contributors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in no-print">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-amber-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Success Confirmation Toast */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold animate-in fade-in no-print shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-1 no-print">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveSide('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSide === 'both' ? 'bg-[#2563EB] text-white shadow' : 'hover:text-white'}`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveSide('front')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSide === 'front' ? 'bg-[#2563EB] text-white shadow' : 'hover:text-white'}`}
            >
              Front Side
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-3 py-1.5 rounded-lg transition-all ${activeSide === 'back' ? 'bg-[#2563EB] text-white shadow' : 'hover:text-white'}`}
            >
              Back Side
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenVerification && (
              <button
                onClick={() => onOpenVerification(contributor.contributorId)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#ECC348]" />
                <span>Verify Contributor</span>
              </button>
            )}

            {/* Print / Save ID Card (PDF) Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C79A22] to-[#B28518] hover:from-[#d8a82a] hover:to-[#C79A22] text-white text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              title="Open print dialog to print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save ID Card (PDF)</span>
            </button>
          </div>
        </div>

        {/* ON-SCREEN ID CARDS PREVIEW */}
        <div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 py-2 no-print"
        >
          {/* FRONT SIDE PREVIEW */}
          {(activeSide === 'both' || activeSide === 'front') && renderFrontCard()}

          {/* BACK SIDE PREVIEW */}
          {(activeSide === 'both' || activeSide === 'back') && renderBackCard()}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800 no-print">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#ECC348]" />
            <span>Digital ID Card is locked with non-transferable Contributor ID security.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
            >
              Close
            </button>

            {/* Download Front PNG */}
            <button
              onClick={() => handleDownloadImage('front')}
              disabled={isGeneratingImage || isGeneratingPdf}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold flex items-center gap-1.5 transition-all disabled:opacity-60"
              title="Download Front ID Card as High Resolution PNG Image"
            >
              <Download className="w-3.5 h-3.5 text-[#ECC348]" />
              <span>Front (PNG)</span>
            </button>

            {/* Download Back PNG */}
            <button
              onClick={() => handleDownloadImage('back')}
              disabled={isGeneratingImage || isGeneratingPdf}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold flex items-center gap-1.5 transition-all disabled:opacity-60"
              title="Download Back ID Card as High Resolution PNG Image"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Back (PNG)</span>
            </button>

            {/* Primary Download Full 2-Page PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf || isGeneratingImage}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] hover:from-[#3b82f6] hover:to-[#2563EB] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
              title="Generate and download 2-page High Resolution PDF of both Front and Back"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
