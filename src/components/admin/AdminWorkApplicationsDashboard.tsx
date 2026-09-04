import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  Download, 
  User, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Filter, 
  FileText, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Tag,
  ChevronDown,
  Award,
  Printer,
  Edit3,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WorkApplicationItem, ApplicationStatus } from '../../types';
import { workStorage, subscribeToWorkApplications } from '../../services/workStorage';
import { WORK_CATEGORIES_LIST } from '../work/WorkApplicationForm';
import { AuthorizedContributorIdCardModal } from '../work/AuthorizedContributorIdCardModal';
import { ManiLogo } from '../ManiLogo';

interface AdminWorkApplicationsDashboardProps {
  onBackToSite?: () => void;
  onLogout?: () => void;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Application Received',
  'Under Review',
  'Shortlisted',
  'Interview / Discussion Required',
  'Selected',
  'Active Contributor',
  'Project Assigned',
  'On Hold',
  'Not Selected'
];

export const AdminWorkApplicationsDashboard: React.FC<AdminWorkApplicationsDashboardProps> = ({
  onBackToSite,
  onLogout
}) => {
  const [applications, setApplications] = useState<WorkApplicationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Detail Modal State
  const [selectedApp, setSelectedApp] = useState<WorkApplicationItem | null>(null);

  // Status Change State in modal
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Application Received');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [contributorRoleInput, setContributorRoleInput] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Selection Confirmation Modal State
  const [isConfirmSelectModalOpen, setIsConfirmSelectModalOpen] = useState(false);
  const [appToSelect, setAppToSelect] = useState<WorkApplicationItem | null>(null);

  // Delete Confirmation Modal State
  const [appToDelete, setAppToDelete] = useState<WorkApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ID Card Modal State
  const [idCardApp, setIdCardApp] = useState<WorkApplicationItem | null>(null);

  // Work With Us Feature Toggle State (Persistent in Admin)
  const [isFeatureEnabled, setIsFeatureEnabled] = useState<boolean>(() => workStorage.isFeatureEnabled());
  const [isTogglingFeature, setIsTogglingFeature] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadApplications = () => {
    const list = workStorage.getAll();
    setApplications(list);
    setIsFeatureEnabled(workStorage.isFeatureEnabled());
  };

  const handleToggleFeature = async () => {
    if (isTogglingFeature) return;
    setIsTogglingFeature(true);
    const nextState = !isFeatureEnabled;
    try {
      await workStorage.setFeatureEnabled(nextState);
      setIsFeatureEnabled(nextState);
      showToast(
        nextState 
          ? 'Work With Us & Earn is now ENABLED on the public website.' 
          : 'Work With Us & Earn is now DISABLED on the public website. Existing data is preserved.',
        'success'
      );
    } catch {
      showToast('Failed to update feature setting.', 'error');
    } finally {
      setIsTogglingFeature(false);
    }
  };

  useEffect(() => {
    loadApplications();
    const unsubscribe = subscribeToWorkApplications(loadApplications);
    return () => unsubscribe();
  }, []);

  const handleOpenDetailModal = (app: WorkApplicationItem) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNotesInput(app.adminNotes || '');
    setContributorRoleInput(app.contributorRole || app.workCategories[0] || 'Web Developer');
  };

  const handleSaveStatus = async () => {
    if (!selectedApp) return;

    // If changing to 'Selected', trigger confirmation modal
    if (newStatus === 'Selected' && selectedApp.status !== 'Selected' && selectedApp.status !== 'Active Contributor') {
      setAppToSelect(selectedApp);
      setIsConfirmSelectModalOpen(true);
      return;
    }

    setIsSavingStatus(true);
    const updated = await workStorage.updateStatus(selectedApp.id, newStatus, adminNotesInput, {
      contributorRole: contributorRoleInput
    });
    setIsSavingStatus(false);

    if (updated) {
      showToast(`Status updated to "${newStatus}" for ${selectedApp.fullName}.`, 'success');
      setSelectedApp({
        ...selectedApp,
        status: newStatus,
        adminNotes: adminNotesInput,
        contributorRole: contributorRoleInput
      });
      loadApplications();
    } else {
      showToast('Failed to update application status.', 'error');
    }
  };

  // Confirm selection handler
  const handleConfirmSelection = async () => {
    if (!appToSelect) return;

    const role = contributorRoleInput || appToSelect.workCategories[0] || 'Authorized Contributor';
    const updated = await workStorage.selectApplicant(appToSelect.id, role);

    if (updated) {
      showToast(`Applicant ${appToSelect.fullName} successfully SELECTED! Contributor ID generated: ${updated.contributorId}`, 'success');
      if (selectedApp && selectedApp.id === appToSelect.id) {
        setSelectedApp(updated);
        setNewStatus('Selected');
      }
      setIsConfirmSelectModalOpen(false);
      setAppToSelect(null);
      loadApplications();
    } else {
      showToast('Failed to select applicant.', 'error');
    }
  };

  const handleDeleteApplication = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    const success = await workStorage.delete(appToDelete.id);
    setIsDeleting(false);
    if (success) {
      showToast(`Application ${appToDelete.id} deleted permanently.`, 'success');
      setAppToDelete(null);
      if (selectedApp?.id === appToDelete.id) {
        setSelectedApp(null);
      }
      loadApplications();
    } else {
      showToast('Failed to delete application.', 'error');
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter(app => {
    // Search query matches Application Number, Name, Mobile, or Category
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      app.id.toLowerCase().includes(q) ||
      app.fullName.toLowerCase().includes(q) ||
      app.mobileNumber.includes(q) ||
      (app.contributorId && app.contributorId.toLowerCase().includes(q)) ||
      app.email.toLowerCase().includes(q) ||
      app.workCategories.some(c => c.toLowerCase().includes(q))
    );

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'Received') {
        matchesStatus = app.status === 'Application Received' || app.status === 'New';
      } else if (statusFilter === 'Active Contributors') {
        matchesStatus = app.status === 'Active Contributor' || app.status === 'Selected';
      } else {
        matchesStatus = app.status === statusFilter;
      }
    }

    // Category filter
    const matchesCategory = categoryFilter === 'all' || app.workCategories.includes(categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate Dashboard Statistics
  const totalCount = applications.length;
  const newCount = applications.filter(a => a.status === 'Application Received' || a.status === 'New').length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview / Discussion Required').length;
  const selectedCount = applications.filter(a => a.status === 'Selected' || a.status === 'Approved').length;
  const notSelectedCount = applications.filter(a => a.status === 'Not Selected' || a.status === 'Rejected').length;
  const activeContributorsCount = applications.filter(a => a.status === 'Active Contributor' || (a.status === 'Selected' && a.contributorId)).length;

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
      case 'Approved':
      case 'Active Contributor':
      case 'Project Assigned':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'Under Review':
      case 'Interview / Discussion Required':
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-300';
      case 'On Hold':
        return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'Not Selected':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-900 text-white border-emerald-700' 
            : 'bg-rose-900 text-white border-rose-700'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#171A1F]">Work With Us Applications</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Manage contributor profiles, perform evaluation reviews, select contributors, issue Authorized Contributor IDs, and manage project assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(workStorage.exportJSON());
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `mani_contributors_export_${new Date().toISOString().slice(0, 10)}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
              showToast('Exported all contributor data as JSON.', 'success');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 0. ADMIN FEATURE TOGGLE SETTING */}
      {/* ============================================================ */}
      <div 
        id="admin-work-with-us-toggle-card"
        className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
          isFeatureEnabled 
            ? 'bg-[#0F172A] text-white border-slate-700 shadow-md' 
            : 'bg-[#1E1B18] text-white border-amber-800/40 shadow-md'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ECC348]">
                Public Program Setting
              </span>
              <span className="text-slate-500">•</span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Work With Us & Earn
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                isFeatureEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                Status: {isFeatureEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              When <strong>ENABLED</strong>, the public navigation links, homepage banner button, and application form are active. When <strong>DISABLED</strong>, public links and CTAs are hidden and new submissions are closed.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isFeatureEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`} />
                <span className={`font-semibold ${
                  isFeatureEnabled ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {isFeatureEnabled ? 'Currently accepting applications' : 'Applications currently closed'}
                </span>
              </div>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="text-[11px] text-slate-400">
                🔒 All existing {totalCount} applications, applicant profiles & ID card records remain permanently safe.
              </span>
            </div>
          </div>

          {/* Toggle Switch Component */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-slate-900/90 p-3 rounded-2xl border border-slate-700/80">
            <span className={`text-xs font-extrabold ${!isFeatureEnabled ? 'text-rose-400' : 'text-slate-500'}`}>
              DISABLED
            </span>
            
            <button
              id="admin-toggle-work-feature-btn"
              type="button"
              role="switch"
              aria-checked={isFeatureEnabled}
              disabled={isTogglingFeature}
              onClick={handleToggleFeature}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C79A22] ${
                isFeatureEnabled ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-slate-600 hover:bg-slate-500'
              } ${isTogglingFeature ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  isFeatureEnabled ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>

            <span className={`text-xs font-extrabold ${isFeatureEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
              ENABLED
            </span>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. DASHBOARD STATISTICS CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Total */}
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'all' ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-md' : 'bg-white border-[#E4E1DA] hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 block">Total</span>
          <div className="text-2xl font-black">{totalCount}</div>
        </div>

        {/* New / Received */}
        <div 
          onClick={() => setStatusFilter('Received')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Received' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-[#E4E1DA] hover:border-blue-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">Received</span>
          <div className="text-2xl font-black text-blue-700">{newCount}</div>
        </div>

        {/* Under Review */}
        <div 
          onClick={() => setStatusFilter('Under Review')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Under Review' ? 'bg-cyan-600 text-white border-cyan-600 shadow-md' : 'bg-white border-[#E4E1DA] hover:border-cyan-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-600 block">Under Review</span>
          <div className="text-2xl font-black text-cyan-700">{underReviewCount}</div>
        </div>

        {/* Shortlisted */}
        <div 
          onClick={() => setStatusFilter('Shortlisted')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Shortlisted' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white border-[#E4E1DA] hover:border-purple-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 block">Shortlisted</span>
          <div className="text-2xl font-black text-purple-700">{shortlistedCount}</div>
        </div>

        {/* Selected */}
        <div 
          onClick={() => setStatusFilter('Selected')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Selected' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white border-[#E4E1DA] hover:border-emerald-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">Selected</span>
          <div className="text-2xl font-black text-emerald-700">{selectedCount}</div>
        </div>

        {/* Active Contributors */}
        <div 
          onClick={() => setStatusFilter('Active Contributors')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Active Contributors' ? 'bg-[#C79A22] text-white border-[#C79A22] shadow-md' : 'bg-white border-[#E4E1DA] hover:border-amber-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6B14] block">Active Contrib.</span>
          <div className="text-2xl font-black text-[#8C6B14]">{activeContributorsCount}</div>
        </div>

        {/* Not Selected */}
        <div 
          onClick={() => setStatusFilter('Not Selected')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'Not Selected' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-white border-[#E4E1DA] hover:border-rose-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">Not Selected</span>
          <div className="text-2xl font-black text-rose-700">{notSelectedCount}</div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH & FILTERS TOOLBAR */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar (Application Number, Name, Mobile, Category) */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Application No, Contributor ID, Name, Mobile, or Category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E4E1DA] bg-[#FCFAF6] text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none focus:bg-white transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#FCFAF6] border border-[#E4E1DA] px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-[#626873] font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#171A1F] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Received">Application Received</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview / Discussion Required">Interview / Discussion</option>
              <option value="Selected">Selected</option>
              <option value="Active Contributors">Active Contributors</option>
              <option value="Project Assigned">Project Assigned</option>
              <option value="On Hold">On Hold</option>
              <option value="Not Selected">Not Selected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-[#FCFAF6] border border-[#E4E1DA] px-3 py-1.5 rounded-xl text-xs">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-[#626873] font-semibold">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#171A1F] focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="all">All Categories</option>
              {WORK_CATEGORIES_LIST.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* ============================================================ */}
      {/* 3. APPLICATION TABLE */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-[#E4E1DA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F6F2] border-b border-[#E4E1DA] text-[#626873] font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Application Number</th>
                <th className="py-3.5 px-4">Applicant Name</th>
                <th className="py-3.5 px-4">Category / Domain</th>
                <th className="py-3.5 px-4">Mobile & Location</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1DA]">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => {
                  const statusClass = getStatusBadge(app.status);
                  const isSelected = app.status === 'Selected' || app.status === 'Active Contributor' || app.status === 'Approved';

                  return (
                    <tr key={app.id} className="hover:bg-[#FCFAF6] transition-colors">
                      
                      {/* Application Number & Contributor ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#2563EB]">{app.id}</div>
                        {app.contributorId && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-[#8C6B14] font-mono text-[9px] font-bold">
                              {app.contributorId}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Applicant Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {app.profilePhoto ? (
                            <img 
                              src={app.profilePhoto} 
                              alt={app.fullName} 
                              className="w-8 h-8 rounded-full object-cover border border-[#E4E1DA] shrink-0 bg-slate-100"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {app.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-[#171A1F] block">{app.fullName}</span>
                            <span className="text-[11px] text-[#626873]">{app.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {app.workCategories.slice(0, 2).map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-700">
                              {c}
                            </span>
                          ))}
                          {app.workCategories.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] text-slate-500">
                              +{app.workCategories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Mobile & Location */}
                      <td className="py-3.5 px-4 text-[#626873]">
                        <div className="font-medium text-[#171A1F]">{app.mobileNumber}</div>
                        <div className="text-[11px] text-[#626873]">{app.city}, {app.state}</div>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 text-[#626873]">
                        <div>
                          {new Date(app.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${statusClass}`}>
                          {app.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Application Detail */}
                          <button
                            onClick={() => handleOpenDetailModal(app)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Full Application"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* If selected: Download ID Card button */}
                          {isSelected && (
                            <button
                              onClick={() => setIdCardApp(app)}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                              title="Download Authorized Contributor ID Card"
                            >
                              <Award className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Select Action if not yet selected */}
                          {!isSelected && (
                            <button
                              onClick={() => {
                                setAppToSelect(app);
                                setContributorRoleInput(app.workCategories[0] || 'Web Developer');
                                setIsConfirmSelectModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold transition-colors"
                              title="Select this applicant"
                            >
                              Select
                            </button>
                          )}

                          {/* Delete Application */}
                          <button
                            onClick={() => setAppToDelete(app)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No applications found.</p>
                    <p className="text-xs">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. APPLICATION DETAIL MODAL */}
      {/* ============================================================ */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          
          <div className="fixed inset-0" onClick={() => setSelectedApp(null)} />

          <div className="relative bg-white border border-[#E4E1DA] rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 text-[#171A1F] z-10 overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4 sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#171A1F]">Application Review</h3>
                    <span className="font-mono font-bold text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded">
                      {selectedApp.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#626873]">
                    Submitted on {new Date(selectedApp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(selectedApp.status === 'Selected' || selectedApp.status === 'Active Contributor') && (
                  <button
                    onClick={() => setIdCardApp(selectedApp)}
                    className="px-3 py-1.5 rounded-xl bg-[#C79A22] hover:bg-[#b58b1d] text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Contributor ID Card</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Applicant Summary Banner */}
            <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-[#E4E1DA] shrink-0 shadow">
                {selectedApp.profilePhoto ? (
                  <img
                    src={selectedApp.profilePhoto}
                    alt={selectedApp.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-500">
                    {selectedApp.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-xl font-black text-[#171A1F]">{selectedApp.fullName}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#626873]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                    <a href={`tel:${selectedApp.mobileNumber}`} className="hover:underline">{selectedApp.mobileNumber}</a>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <a href={`https://wa.me/91${selectedApp.whatsappNumber?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                      WhatsApp
                    </a>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`mailto:${selectedApp.email}`} className="hover:underline">{selectedApp.email}</a>
                  </span>
                </div>

                <div className="text-xs text-[#626873] flex items-center justify-center sm:justify-start gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>{selectedApp.fullAddress}, {selectedApp.city}, {selectedApp.state} - {selectedApp.pinCode}</span>
                </div>
              </div>
            </div>

            {/* Contributor Status & Notes Management Control Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="font-bold text-xs uppercase tracking-wider text-[#171A1F] flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#2563EB]" />
                <span>Admin Decision & Status Control</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#171A1F]">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs font-bold text-[#171A1F] focus:ring-2 focus:ring-[#2563EB]"
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Contributor Role */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#171A1F]">Authorized Role (For ID Card)</label>
                  <input
                    type="text"
                    value={contributorRoleInput}
                    onChange={(e) => setContributorRoleInput(e.target.value)}
                    placeholder="e.g. Web Developer & React Specialist"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs font-medium"
                  />
                </div>

              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#171A1F]">Internal Admin Notes (Private)</label>
                <textarea
                  rows={2}
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Notes about interview outcome, code review, or client project assignment..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={isSavingStatus}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  {isSavingStatus ? 'Saving...' : 'Update Application Status & Notes'}
                </button>
              </div>
            </div>

            {/* Professional Details Breakdown */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-sm text-[#171A1F] border-b border-[#E4E1DA] pb-2">
                Professional Background & Work Capabilities
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E4E1DA]">
                <div>
                  <span className="font-bold text-[#626873] block text-[10px] uppercase">Selected Categories</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApp.workCategories.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#626873] block text-[10px] uppercase">Experience & Level</span>
                  <div className="text-sm font-bold text-[#171A1F] mt-1">
                    {selectedApp.yearsOfExperience} ({selectedApp.experienceLevel || 'Standard'})
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-bold text-[#626873] block text-[10px] uppercase">Skills & Tools</span>
                  <div className="text-xs text-[#171A1F] font-medium mt-1">
                    {selectedApp.skillsText || selectedApp.skills?.join(', ') || 'N/A'}
                  </div>
                </div>

                {selectedApp.previousWorkDetails && (
                  <div className="sm:col-span-2">
                    <span className="font-bold text-[#626873] block text-[10px] uppercase">Previous Work Details</span>
                    <p className="text-xs text-[#171A1F] leading-relaxed mt-1 bg-[#FCFAF6] p-3 rounded-lg border border-[#E4E1DA]">
                      {selectedApp.previousWorkDetails}
                    </p>
                  </div>
                )}

                {/* Portfolio Links */}
                <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2 border-t border-slate-100">
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Portfolio: {selectedApp.portfolioUrl}</span>
                    </a>
                  )}

                  {selectedApp.githubUrl && (
                    <a
                      href={selectedApp.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-800" />
                      <span>GitHub: {selectedApp.githubUrl}</span>
                    </a>
                  )}

                  {selectedApp.linkedinUrl && (
                    <a
                      href={selectedApp.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#E4E1DA] pt-4 text-xs text-[#626873]">
              <span>Application ID: <strong>{selectedApp.id}</strong></span>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close Details
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CONFIRM SELECTION MODAL (SECTION 10 OF SPEC) */}
      {/* ============================================================ */}
      {isConfirmSelectModalOpen && appToSelect && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          
          <div className="fixed inset-0" onClick={() => setIsConfirmSelectModalOpen(false)} />

          <div className="relative bg-white border border-[#E4E1DA] rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-[#171A1F] z-10 overflow-hidden space-y-5 text-left">
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#171A1F]">
                Are you sure you want to select this applicant?
              </h3>
              <p className="text-xs text-[#626873] leading-relaxed">
                Confirming selection will update status to <strong>Selected</strong>, automatically generate a unique <strong>Contributor ID</strong>, enable the <strong>Authorized Contributor Digital ID Card</strong>, and record the official selection timestamp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-[#626873] text-[10px] uppercase font-bold block">Applicant Name:</span>
                <span className="font-bold text-[#171A1F] text-sm">{appToSelect.fullName}</span>
              </div>
              <div>
                <span className="text-[#626873] text-[10px] uppercase font-bold block">Application Number:</span>
                <span className="font-mono text-[#2563EB]">{appToSelect.id}</span>
              </div>
              <div>
                <span className="text-[#626873] text-[10px] uppercase font-bold block">Assigned Role:</span>
                <input
                  type="text"
                  value={contributorRoleInput}
                  onChange={(e) => setContributorRoleInput(e.target.value)}
                  className="w-full px-3 py-1.5 mt-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  placeholder="e.g. Web Developer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmSelectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E4E1DA] text-xs font-semibold text-[#626873] hover:text-[#171A1F]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSelection}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Select</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 6. DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setAppToDelete(null)} />
          <div className="relative bg-white border border-rose-200 rounded-3xl shadow-2xl max-w-md w-full p-6 text-left space-y-4 z-10">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#171A1F]">Delete Application Permanently?</h3>
              <p className="text-xs text-[#626873] mt-1">
                Are you sure you want to delete application <strong>{appToDelete.id}</strong> ({appToDelete.fullName})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#E4E1DA] text-xs font-semibold text-[#626873]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApplication}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 7. DIGITAL ID CARD MODAL */}
      {/* ============================================================ */}
      {idCardApp && idCardApp.contributorId && (
        <AuthorizedContributorIdCardModal
          isOpen={true}
          onClose={() => setIdCardApp(null)}
          contributor={{
            fullName: idCardApp.fullName,
            contributorId: idCardApp.contributorId,
            role: idCardApp.contributorRole || idCardApp.workCategories[0] || 'Authorized Contributor',
            profilePhoto: idCardApp.profilePhoto,
            issueDate: idCardApp.selectionDate || idCardApp.createdAt,
            status: idCardApp.status
          }}
        />
      )}

    </div>
  );
};
