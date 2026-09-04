import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Clock, 
  DollarSign, 
  Globe, 
  Smartphone, 
  Code, 
  Layers, 
  Palette, 
  Megaphone, 
  TrendingUp, 
  Video, 
  PenTool, 
  Search, 
  Users, 
  ChevronRight,
  HelpCircle,
  Laptop,
  Award,
  FileText,
  AlertTriangle,
  Percent,
  Check,
  Lock
} from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyData';
import { workStorage, subscribeToWorkApplications } from '../../services/workStorage';
import { WorkApplicationForm, WORK_CATEGORIES_LIST } from './WorkApplicationForm';
import { WorkApplicationTrackerModal } from './WorkApplicationTrackerModal';
import { ContributorVerificationModal } from './ContributorVerificationModal';

interface WorkWithUsPageProps {
  onOpenDemoModal?: () => void;
  onNavigateHome?: () => void;
}

export const WorkWithUsPage: React.FC<WorkWithUsPageProps> = ({ onNavigateHome }) => {
  const [isWorkEnabled, setIsWorkEnabled] = useState<boolean>(() => workStorage.isFeatureEnabled());
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'track' | 'verify'>('overview');
  const [trackingAppId, setTrackingAppId] = useState<string>('');
  const [verifyContributorId, setVerifyContributorId] = useState<string>('');

  // Modals state
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsWorkEnabled(workStorage.isFeatureEnabled());
    const unsubscribe = subscribeToWorkApplications(() => {
      setIsWorkEnabled(workStorage.isFeatureEnabled());
    });
    return () => unsubscribe();
  }, []);

  const handleStartApply = () => {
    if (!isWorkEnabled) return;
    setActiveTab('apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTrackerWithId = (appId: string) => {
    setTrackingAppId(appId);
    setIsTrackerModalOpen(true);
  };

  const handleOpenVerificationWithId = (contributorId: string) => {
    setVerifyContributorId(contributorId);
    setIsVerificationModalOpen(true);
  };

  const steps = [
    {
      step: '01',
      title: 'Apply',
      desc: 'Submit your professional details, skills and preferred contributor role.',
      highlight: 'Simple Application'
    },
    {
      step: '02',
      title: 'Review & Verification',
      desc: 'Our team reviews your application, expertise and profile.',
      highlight: 'Profile Evaluation'
    },
    {
      step: '03',
      title: 'Project Collaboration',
      desc: 'Selected contributors may receive relevant project opportunities based on skills, availability and project requirements.',
      highlight: 'Matching Projects'
    },
    {
      step: '04',
      title: 'Earn Per Project',
      desc: 'Complete your assigned contribution and receive the applicable project-based commission/share according to the agreed terms.',
      highlight: 'Project Earnings'
    }
  ];

  // ============================================================
  // APPLICATIONS CLOSED VIEW (When disabled in Admin)
  // ============================================================
  if (!isWorkEnabled) {
    return (
      <div id="work-with-us-closed-page" className="pt-24 sm:pt-28 pb-24 bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#626873] border-b border-[#E4E1DA] pb-4">
            <span>MANI Solution</span>
            <span>/</span>
            <span className="text-[#171A1F] font-bold">Work With Us & Earn</span>
            <span>/</span>
            <span className="text-amber-700 font-semibold">Applications Closed</span>
          </div>

          {/* Main Closed Banner Card */}
          <div className="rounded-3xl bg-white border border-[#E4E1DA] p-8 sm:p-12 shadow-xl space-y-6">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Notice: Program Intake Paused</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171A1F]">
                Work With Us applications are currently closed.
              </h1>

              <p className="text-sm sm:text-base text-[#626873] leading-relaxed max-w-2xl">
                Thank you for your interest in joining MANI Solution’s contributor ecosystem. New contributor intake and application submissions are currently closed as we review active candidates and fulfill current project assignments.
              </p>
              
              <p className="text-xs sm:text-sm text-[#878D96] leading-relaxed">
                Please check back later when new contributor openings are announced.
              </p>
            </div>

            {/* Existing Applicant & Verification Tools Still Accessible */}
            <div className="pt-6 border-t border-[#E4E1DA] grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#171A1F]">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Already Applied?</span>
                </div>
                <p className="text-xs text-[#626873] leading-relaxed">
                  If you have already submitted your application, you can still check your evaluation status or download your Authorized Contributor ID.
                </p>
                <button
                  id="closed-page-track-btn"
                  onClick={() => setIsTrackerModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Application Status</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#171A1F]">
                  <ShieldCheck className="w-4 h-4 text-[#C79A22]" />
                  <span>Verify Contributor ID</span>
                </div>
                <p className="text-xs text-[#626873] leading-relaxed">
                  Clients and partners can verify official contributor credentials using the Contributor ID issued by MANI Solution.
                </p>
                <button
                  id="closed-page-verify-btn"
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ECC348]" />
                  <span>Verify Contributor</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Global Modals for existing applicants & verifiers */}
        <WorkApplicationTrackerModal
          isOpen={isTrackerModalOpen}
          onClose={() => setIsTrackerModalOpen(false)}
          initialAppId={trackingAppId}
          onOpenVerification={handleOpenVerificationWithId}
        />

        <ContributorVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          initialContributorId={verifyContributorId}
        />
      </div>
    );
  }

  return (
    <div id="work-with-us-page" className="pt-24 sm:pt-28 pb-24 bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] min-h-screen">
      
      {/* Top Breadcrumb & Switcher Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-4">
          <div className="flex items-center gap-2 text-xs text-[#626873]">
            <span>MANI Solution</span>
            <span>/</span>
            <span className="text-[#171A1F] font-bold">Work With Us & Earn</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-[#E4E1DA]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-[#171A1F] shadow-sm'
                  : 'text-[#626873] hover:text-[#171A1F]'
              }`}
            >
              Overview & Model
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'apply'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#626873] hover:text-[#171A1F]'
              }`}
            >
              <span>Apply for Work</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
            <button
              onClick={() => setIsTrackerModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#626873] hover:text-[#171A1F] hover:bg-white/50 flex items-center gap-1.5 transition-all"
            >
              <Search className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Track Application</span>
            </button>
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#626873] hover:text-[#171A1F] hover:bg-white/50 flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Verify Contributor</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-16 sm:space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ============================================================ */}
          {/* 1. HERO SECTION & CORE VALUE PROPOSITION */}
          {/* ============================================================ */}
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A0E17] via-[#0F172A] to-[#1E293B] border border-slate-800 p-8 sm:p-12 lg:p-16 text-left text-white shadow-2xl">
            <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />
            <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#C79A22]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-8">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Freelance Contributor Network</span>
              </div>

              {/* Exact Requested Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans leading-tight tracking-tight text-white">
                  Build With <span className="text-gradient-gold">MANI Solution</span>.<br />
                  Grow With Every Project.
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl">
                  Join our professional freelance contributor network and collaborate with MANI Solution on real digital projects across development, design, marketing, sales and business growth.
                </p>
              </div>

              {/* Introductory Statement */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  MANI Solution works with independent professionals who contribute to projects based on their expertise, role and project requirements. Contributors are engaged on a project-by-project basis, allowing skilled professionals to work flexibly while participating in real client projects.
                </p>
              </div>

              {/* PROJECT-BASED EARNING STRUCTURE */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#ECC348] font-extrabold text-lg sm:text-xl">
                    <Percent className="w-5 h-5 text-[#ECC348]" />
                    <span>Project-Based Earning Structure</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    There is no fixed monthly salary under the MANI Solution Contributor Network. Earnings are calculated on a project basis according to the contributor’s assigned role and the applicable project terms.
                  </p>
                </div>

                {/* Two Prominent Earning Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  
                  {/* CARD 1 */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-[#C79A22]/50 hover:border-[#ECC348] transition-all space-y-3 relative group shadow-lg">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Client Acquisition</span>
                      <span className="px-3 py-1 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/60 text-[#ECC348] text-xs sm:text-sm font-extrabold shadow-sm">
                        40% Commission
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Lead Generation / Client Acquisition
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Contributors who successfully bring qualified clients or project opportunities to MANI Solution may receive 40% of the applicable project amount, subject to the agreed project and payment terms.
                    </p>
                  </div>

                  {/* CARD 2 */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/50 hover:border-blue-400 transition-all space-y-3 relative group shadow-lg">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Execution</span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/60 text-blue-300 text-xs sm:text-sm font-extrabold shadow-sm">
                        60% Project Share
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Project Development & Delivery
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Developers and other technical or creative contributors responsible for project execution and delivery may receive 60% of the applicable project amount, according to their assigned role and agreed project terms.
                    </p>
                  </div>

                </div>
              </div>

              {/* IMPORTANT PROFESSIONAL DISCLAIMER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Important Disclaimer</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Important: The MANI Solution Contributor Network is a project-based freelance collaboration model and does not provide a fixed monthly salary or guarantee a minimum number of projects. Project availability, contributor responsibilities, commission/share percentages and payment terms may vary depending on the project agreement. Contributors are compensated only according to the applicable project terms.
                </p>
                <p className="text-slate-400 leading-relaxed font-semibold pt-1">
                  Applying to the Contributor Network does not guarantee selection, project allocation or earnings.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={handleStartApply}
                  className="px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:translate-y-[-1px]"
                >
                  <span>Apply for Work</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsTrackerModalOpen(true)}
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <Search className="w-4 h-4 text-[#ECC348]" />
                  <span>Track Application</span>
                </button>
              </div>

            </div>
          </section>

          {/* ============================================================ */}
          {/* 2. WHO CAN JOIN THE MANI SOLUTION CONTRIBUTOR NETWORK? */}
          {/* ============================================================ */}
          <section className="space-y-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                  Network Roles
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F]">
                  Who Can Join the MANI Solution Contributor Network?
                </h2>
                <p className="text-sm text-[#626873] max-w-2xl">
                  We collaborate with independent professionals and specialists across all key digital domains.
                </p>
              </div>

              <button
                onClick={handleStartApply}
                className="px-5 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold shrink-0 self-start sm:self-auto flex items-center gap-1.5 transition-all"
              >
                <span>Apply for Work</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {WORK_CATEGORIES_LIST.map((cat) => {
                const IconC = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#2563EB]/40 hover:shadow-md transition-all space-y-3 text-left flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#2563EB] flex items-center justify-center">
                        <IconC className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-bold text-[#171A1F]">
                        {cat.label}
                      </h3>

                      <p className="text-xs text-[#626873] leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <button
                      onClick={handleStartApply}
                      className="pt-2 text-[11px] font-bold text-[#2563EB] hover:text-[#1d4ed8] flex items-center gap-1 transition-colors self-start"
                    >
                      <span>Apply in this role</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. HOW THE NETWORK WORKS */}
          {/* ============================================================ */}
          <section className="space-y-8 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Collaboration Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F]">
                How The Network Works
              </h2>
              <p className="text-sm text-[#626873] max-w-2xl">
                A simple and transparent 4-step project collaboration journey.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s) => (
                <div 
                  key={s.step} 
                  className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm hover:border-[#C79A22]/50 hover:shadow-md transition-all space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-[#C79A22]/30 group-hover:text-[#C79A22] transition-colors">
                      {s.step}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-[#626873]">
                      {s.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#171A1F]">
                    {s.title}
                  </h3>

                  <p className="text-xs text-[#626873] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. TRACKING & CONTRIBUTOR VERIFICATION CALLOUT */}
          {/* ============================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            
            {/* Tracking Card */}
            <div className="p-8 rounded-3xl bg-[#F7F6F2] border border-[#E4E1DA] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#171A1F]">
                Already Applied? Track Your Application
              </h3>
              <p className="text-xs text-[#626873] leading-relaxed">
                Check your review status in real-time with your unique Application Number (e.g. <code>MANI-WE-2026-000001</code>). Selected contributors can also download their Authorized Contributor ID card.
              </p>
              <button
                onClick={() => setIsTrackerModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Track Application Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Verification Card */}
            <div className="p-8 rounded-3xl bg-[#F7F6F2] border border-[#E4E1DA] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#171A1F]">
                Verify Authorized Contributor ID
              </h3>
              <p className="text-xs text-[#626873] leading-relaxed">
                Clients and partners can verify official contributor credentials using the Contributor ID (e.g. <code>MANI-CN-2026-000001</code>) issued by MANI Solution.
              </p>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Verify Contributor ID</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </section>

          {/* ============================================================ */}
          {/* 5. BOTTOM CTA BANNER */}
          {/* ============================================================ */}
          <section className="p-8 sm:p-12 rounded-3xl bg-[#171A1F] text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl font-bold text-white">
                Ready to contribute to client projects and earn?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Submit your profile in 3 minutes. Receive your unique application number and downloadable official acknowledgement.
              </p>
            </div>

            <button
              onClick={handleStartApply}
              className="px-8 py-4 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02]"
            >
              <span>Apply for Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

        </div>
      ) : (
        <div ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkApplicationForm 
            onSuccess={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCancel={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTracker={handleOpenTrackerWithId}
          />
        </div>
      )}

      {/* Global Application Tracker Modal */}
      <WorkApplicationTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        initialAppId={trackingAppId}
        onOpenVerification={handleOpenVerificationWithId}
      />

      {/* Global Contributor Verification Modal */}
      <ContributorVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        initialContributorId={verifyContributorId}
      />

    </div>
  );
};
