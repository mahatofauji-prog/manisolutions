import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Calendar, 
  Tag, 
  Award,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { workStorage } from '../../services/workStorage';
import { PublicApplicationStatusDTO, ApplicationStatus } from '../../types';
import { AuthorizedContributorIdCardModal } from './AuthorizedContributorIdCardModal';

interface WorkApplicationTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAppId?: string;
  onOpenVerification?: (contributorId: string) => void;
}

export const WorkApplicationTrackerModal: React.FC<WorkApplicationTrackerModalProps> = ({
  isOpen,
  onClose,
  initialAppId,
  onOpenVerification
}) => {
  const [appIdInput, setAppIdInput] = useState(initialAppId || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PublicApplicationStatusDTO | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ID Card modal state
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  useEffect(() => {
    if (initialAppId && isOpen) {
      setAppIdInput(initialAppId);
      performSearch(initialAppId);
    }
  }, [initialAppId, isOpen]);

  if (!isOpen) return null;

  const performSearch = (queryId?: string) => {
    const target = (queryId || appIdInput).trim();
    if (!target) {
      setErrorMsg('Please enter your Application Number (e.g. MANI-WE-2026-000001).');
      setResult(null);
      setHasSearched(true);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    setTimeout(() => {
      const data = workStorage.trackApplication(target);
      setIsLoading(false);
      if (data) {
        setResult(data);
        setErrorMsg(null);
      } else {
        setResult(null);
        setErrorMsg(`No application found matching "${target}". Please verify the number from your acknowledgement receipt.`);
      }
    }, 250);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
      case 'Active Contributor':
      case 'Approved':
      case 'Project Assigned':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          icon: CheckCircle2,
          dotColor: 'bg-emerald-500'
        };
      case 'Under Review':
      case 'Shortlisted':
      case 'Interview / Discussion Required':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-300',
          icon: Clock,
          dotColor: 'bg-blue-500'
        };
      case 'On Hold':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-300',
          icon: AlertCircle,
          dotColor: 'bg-amber-500'
        };
      case 'Not Selected':
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-300',
          icon: XCircle,
          dotColor: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Clock,
          dotColor: 'bg-slate-400'
        };
    }
  };

  const isSelectedOrActive = result?.status === 'Selected' || result?.status === 'Active Contributor' || result?.status === 'Approved' || result?.status === 'Project Assigned';
  const isNotSelected = result?.status === 'Not Selected' || result?.status === 'Rejected';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        
        {/* Background click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative bg-white border border-[#E4E1DA] rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 text-[#171A1F] z-10 overflow-hidden space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#171A1F]">Track Your Application</h3>
                <p className="text-xs text-[#626873]">
                  Enter your unique Application Number to check your current review status.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="Close tracker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              performSearch();
            }}
            className="space-y-2"
          >
            <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
              Application Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. MANI-WE-2026-000001"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-[#171A1F] font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-[#2563EB] focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:normal-case placeholder:font-normal"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Status</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Result Card or Error */}
          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              {errorMsg ? (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Application Not Found</p>
                    <p className="leading-relaxed text-rose-700">{errorMsg}</p>
                    <p className="text-[11px] text-rose-600 pt-1">
                      Tip: Double check if your number matches format <strong>MANI-WE-2026-XXXXXX</strong>.
                    </p>
                  </div>
                </div>
              ) : result ? (
                <div className="rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] p-5 sm:p-6 space-y-5">
                  
                  {/* Status Banner */}
                  {(() => {
                    const badge = getStatusBadge(result.status);
                    const StatusIcon = badge.icon;
                    return (
                      <div className={`p-4 rounded-xl border ${badge.bg} flex items-start sm:items-center justify-between gap-3 flex-wrap`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${badge.dotColor} animate-ping`} />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                              Current Application Status
                            </span>
                            <span className="text-base font-extrabold flex items-center gap-1.5">
                              <StatusIcon className="w-4 h-4" />
                              {result.status}
                            </span>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono opacity-80">
                          ID: {result.id}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Outcome Message (Selected vs Not Selected vs In Progress) */}
                  {isSelectedOrActive && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-[#0F172A] text-white space-y-3 shadow-lg">
                      <div className="flex items-center gap-2 text-[#ECC348] text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Congratulations!</span>
                      </div>
                      <p className="text-sm font-bold text-white leading-snug">
                        “Congratulations! You have been selected to work with MANI Solution.”
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        You are an authorized project contributor. When a matching client mandate or project is scheduled, our operations team coordinates directly on agreed deliverables and your 40% project share.
                      </p>

                      {result.contributorId && (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Contributor ID</span>
                            <span className="text-sm font-mono font-bold text-[#ECC348]">{result.contributorId}</span>
                          </div>

                          <button
                            onClick={() => setIsIdCardOpen(true)}
                            className="px-4 py-2 rounded-xl bg-[#C79A22] hover:bg-[#b58b1d] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
                          >
                            <Award className="w-4 h-4" />
                            <span>Download Contributor ID Card</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isNotSelected && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1 leading-relaxed">
                      <p className="font-bold text-rose-800">
                        “Thank you for your application. At this time, your application has not been selected.”
                      </p>
                      <p className="text-rose-700 text-[11px]">
                        We review hundreds of profiles for specialized project requirements. You are welcome to re-apply in the future as you expand your portfolio and technical domain experience.
                      </p>
                    </div>
                  )}

                  {!isSelectedOrActive && !isNotSelected && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1 leading-relaxed">
                      <p className="font-bold text-blue-800">
                        Application Active in Review Pipeline
                      </p>
                      <p className="text-blue-700 text-[11px]">
                        Our management team evaluates your skill stack, past projects, and portfolio. We update statuses promptly as client mandates are queued.
                      </p>
                    </div>
                  )}

                  {/* Public Safe Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-[#E4E1DA]">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#626873] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#C79A22]" />
                        Application Number
                      </span>
                      <div className="font-mono font-bold text-[#171A1F]">{result.id}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#626873] flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#C79A22]" />
                        Applied Category
                      </span>
                      <div className="font-medium text-[#171A1F] flex flex-wrap gap-1">
                        {result.workCategories.map((cat, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#626873] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C79A22]" />
                        Application Date
                      </span>
                      <div className="text-[#171A1F]">
                        {new Date(result.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#626873] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C79A22]" />
                        Last Updated
                      </span>
                      <div className="text-[#171A1F]">
                        {result.updatedAt
                          ? new Date(result.updatedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : 'Recent'}
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="pt-2 border-t border-[#E4E1DA] flex items-center justify-between text-xs text-[#626873]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Public tracker never exposes personal contact info or internal notes.</span>
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-all"
            >
              Close
            </button>
          </div>

        </div>

      </div>

      {/* ID Card Modal if applicant clicks Download ID card */}
      {result && result.contributorId && (
        <AuthorizedContributorIdCardModal
          isOpen={isIdCardOpen}
          onClose={() => setIsIdCardOpen(false)}
          contributor={{
            fullName: result.fullName,
            contributorId: result.contributorId,
            role: result.contributorRole || result.workCategories[0] || 'Authorized Contributor',
            issueDate: result.createdAt,
            status: result.status
          }}
          onOpenVerification={onOpenVerification}
        />
      )}
    </>
  );
};
