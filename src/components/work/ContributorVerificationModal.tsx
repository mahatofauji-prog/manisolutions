import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  Award, 
  Calendar, 
  Briefcase, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { workStorage } from '../../services/workStorage';
import { PublicContributorVerificationDTO } from '../../types';
import { ManiLogo } from '../ManiLogo';

interface ContributorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContributorId?: string;
}

export const ContributorVerificationModal: React.FC<ContributorVerificationModalProps> = ({
  isOpen,
  onClose,
  initialContributorId
}) => {
  const [contributorIdInput, setContributorIdInput] = useState(initialContributorId || '');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PublicContributorVerificationDTO | null>(null);

  useEffect(() => {
    if (initialContributorId && isOpen) {
      setContributorIdInput(initialContributorId);
      performVerification(initialContributorId);
    }
  }, [initialContributorId, isOpen]);

  if (!isOpen) return null;

  const performVerification = (queryId?: string) => {
    const target = (queryId || contributorIdInput).trim();
    if (!target) return;

    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const data = workStorage.verifyContributor(target);
      setResult(data);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-[#E4E1DA] rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 text-[#171A1F] z-10 overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C79A22]/15 text-[#C79A22] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#171A1F]">Verify Contributor</h3>
              <p className="text-xs text-[#626873]">
                Verify official MANI Solution Authorized Contributor ID credentials.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Close verification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            performVerification();
          }}
          className="space-y-2"
        >
          <label className="block text-xs font-bold text-[#171A1F] uppercase tracking-wider">
            Contributor ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={contributorIdInput}
                onChange={(e) => setContributorIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. MANI-CN-2026-000001"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-[#171A1F] font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-[#C79A22] focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-sans placeholder:normal-case placeholder:font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all shrink-0 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#ECC348]" />
                  <span>Verify ID</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Results */}
        {hasSearched && result && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {result.isValid ? (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#FCFAF6] to-white border-2 border-emerald-500/40 shadow-lg space-y-5 text-left">
                
                {/* Active Verified Banner */}
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3.5">
                  <div className="flex items-center gap-2.5 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        Official Verification Result
                      </span>
                      <span className="text-base font-extrabold text-emerald-900">
                        Active Authorized Contributor
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    VALID & VERIFIED
                  </span>
                </div>

                {/* Contributor Profile Card */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#E4E1DA] shadow-sm">
                  {result.profilePhoto ? (
                    <img
                      src={result.profilePhoto}
                      alt={result.contributorName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E4E1DA] bg-slate-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                      {result.contributorName.charAt(0)}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A22]">
                      MANI SOLUTION CONTRIBUTOR
                    </span>
                    <h4 className="text-lg font-black text-[#171A1F]">
                      {result.contributorName}
                    </h4>
                    <p className="text-xs font-semibold text-[#626873]">
                      {result.contributorRole}
                    </p>
                  </div>
                </div>

                {/* Contributor Attributes Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#626873] block">Contributor ID</span>
                    <span className="font-mono font-bold text-[#2563EB]">{result.contributorId}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#626873] block">Role / Category</span>
                    <span className="font-semibold text-[#171A1F]">{result.contributorRole}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#626873] block">Issue Date</span>
                    <span className="text-[#171A1F]">
                      {result.issueDate
                        ? new Date(result.issueDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Active'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#626873] block">Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Contributor</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#626873] leading-relaxed">
                  This individual is an authorized project contributor registered with MANI Solution.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 text-left">
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-6 h-6 text-rose-600" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-900">
                      Contributor ID Not Valid / Inactive
                    </h4>
                    <p className="text-xs text-rose-700">
                      The ID "{result.contributorId || contributorIdInput}" is not an active authorized contributor record.
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1">
                  <p className="font-semibold">Possible Reasons:</p>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-rose-700">
                    <li>The contributor ID was mistyped or does not exist in the official directory.</li>
                    <li>The contributor is currently inactive or under standard review.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Privacy Notice */}
        <div className="pt-2 border-t border-[#E4E1DA] flex items-center justify-between text-xs text-[#626873]">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>Official verification portal. Personal contact info is strictly confidential.</span>
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
  );
};
