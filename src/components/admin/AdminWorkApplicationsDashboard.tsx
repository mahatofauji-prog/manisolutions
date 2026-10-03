import React, { useState, useEffect, useMemo } from 'react';
import { WorkApplicationItem, ApplicationStatus } from '../../types';
import { workStorage, subscribeToWorkApplications } from '../../services/workStorage';
import { 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink, 
  CheckCircle2, 
  User, 
  FileText,
  X,
  Award,
  Globe,
  Github,
  Linkedin,
  CreditCard,
  Download
} from 'lucide-react';
import { AuthorizedContributorIdCardModal } from '../work/AuthorizedContributorIdCardModal';

export const AdminWorkApplicationsDashboard: React.FC = () => {
  const [apps, setApps] = useState<WorkApplicationItem[]>(() => workStorage.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<WorkApplicationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ID Card Modal State
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [idCardData, setIdCardData] = useState<any>(null);

  const reloadData = () => {
    setApps(workStorage.getAll());
  };

  useEffect(() => {
    reloadData();
    const unsub = subscribeToWorkApplications(reloadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    await workStorage.updateStatus(id, newStatus);
    reloadData();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Applicant status updated to ${newStatus}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete application from ${name}?`)) {
      await workStorage.delete(id);
      if (selectedApp?.id === id) setSelectedApp(null);
      reloadData();
      showToast('Application deleted');
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.mobileNumber.toLowerCase().includes(q) ||
        (app.city && app.city.toLowerCase().includes(q)) ||
        (app.contributorRole && app.contributorRole.toLowerCase().includes(q)) ||
        (app.skillsText && app.skillsText.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              Work With Us & <span className="text-gold-gradient">Earn Applications</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Talent & Partners
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Review submissions from developers, designers, automation engineers, and regional business contributors.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Total: <strong>{apps.length} Applicants</strong>
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E1DA]">
        <div className="relative flex-grow max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city, skills, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#C79A22]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Contacted">Contacted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="On Hold">On Hold</option>
          </select>
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            {filteredApps.length} applicants
          </span>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#E4E1DA] text-xs text-slate-500">
          No work applications found matching your criteria.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden divide-y divide-[#E4E1DA]">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-start gap-4 flex-grow">
                {/* Profile Photo Uploaded from Mobile Gallery */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#C79A22]/40 shadow-sm shrink-0 flex items-center justify-center">
                  {app.profilePhoto ? (
                    <img 
                      src={app.profilePhoto} 
                      alt={app.fullName} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {app.id}
                    </span>
                    <strong className="text-sm font-bold text-[#171A1F]">{app.fullName}</strong>
                    {app.city && (
                      <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {app.city}, {app.state || ''}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      app.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : app.status === 'Shortlisted'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                        : app.status === 'Reviewing'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {app.status || 'New'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[#626873]">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {app.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {app.mobileNumber}</span>
                    {app.contributorRole && (
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        Role: {app.contributorRole}
                      </span>
                    )}
                    {app.yearsOfExperience && (
                      <span className="text-slate-500 font-semibold">
                        Exp: {app.yearsOfExperience}
                      </span>
                    )}
                  </div>

                  {app.skillsText && (
                    <p className="text-[11px] text-slate-600 line-clamp-1">
                      <strong className="text-slate-800">Skills:</strong> {app.skillsText}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIdCardData({
                      fullName: app.fullName,
                      contributorId: app.contributorId || `MANI-CN-${app.id.replace(/\D/g, '').slice(-6) || '202601'}`,
                      role: app.contributorRole || app.workCategories?.[0] || 'Authorized Contributor',
                      profilePhoto: app.profilePhoto,
                      issueDate: app.selectionDate || app.createdAt,
                      status: 'Active Contributor'
                    });
                    setIsIdCardModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5"
                  title="View Authorized Contributor ID Card"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>ID Card</span>
                </button>

                <select
                  value={app.status || 'New'}
                  onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#E4E1DA] bg-white text-slate-700 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                  <option value="On Hold">On Hold</option>
                </select>

                <button
                  onClick={() => handleDelete(app.id, app.fullName)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Applicant Profile Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E4E1DA] shadow-2xl p-6 sm:p-7 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-[#C79A22] shrink-0 flex items-center justify-center shadow">
                  {selectedApp.profilePhoto ? (
                    <img src={selectedApp.profilePhoto} alt={selectedApp.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedApp.fullName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-blue-600 font-bold">{selectedApp.id}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] font-bold text-[#C79A22]">{selectedApp.contributorRole || selectedApp.workCategories?.[0]}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">ROLE APPLIED</span>
                  <strong className="text-slate-900">{selectedApp.contributorRole || 'General Contributor'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">EXPERIENCE</span>
                  <strong className="text-slate-900">{selectedApp.yearsOfExperience || selectedApp.experienceLevel || 'Not specified'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">EMAIL</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline">{selectedApp.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">PHONE / WHATSAPP</span>
                  <a href={`tel:${selectedApp.mobileNumber}`} className="text-slate-900">{selectedApp.mobileNumber}</a>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 font-bold block">LOCATION</span>
                  <span className="text-slate-700">{selectedApp.fullAddress || `${selectedApp.city}, ${selectedApp.state}`}</span>
                </div>
              </div>

              {selectedApp.skillsText && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">TECHNICAL SKILLS & TOOLS</span>
                  <p className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    {selectedApp.skillsText}
                  </p>
                </div>
              )}

              {selectedApp.previousWorkDetails && (
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">PREVIOUS WORK & EXPERIENCE</span>
                  <p className="mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.previousWorkDetails}
                  </p>
                </div>
              )}

              {/* Portfolio & Social Links */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {selectedApp.portfolioUrl && (
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center gap-1 hover:bg-blue-100"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
                {selectedApp.githubUrl && (
                  <a
                    href={selectedApp.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center gap-1 hover:bg-slate-200"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {selectedApp.linkedinUrl && (
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 font-bold flex items-center gap-1 hover:bg-blue-100"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIdCardData({
                      fullName: selectedApp.fullName,
                      contributorId: selectedApp.contributorId || `MANI-CN-${selectedApp.id.replace(/\D/g, '').slice(-6) || '202601'}`,
                      role: selectedApp.contributorRole || selectedApp.workCategories?.[0] || 'Authorized Contributor',
                      profilePhoto: selectedApp.profilePhoto,
                      issueDate: selectedApp.selectionDate || selectedApp.createdAt,
                      status: 'Active Contributor'
                    });
                    setIsIdCardModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 shadow"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>View / Download ID Card</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <select
                    value={selectedApp.status || 'New'}
                    onChange={(e) => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option value="New">New</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                    <option value="On Hold">On Hold</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 rounded-xl bg-[#171A1F] text-white font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authorized Contributor ID Card Modal */}
      {isIdCardModalOpen && idCardData && (
        <AuthorizedContributorIdCardModal
          isOpen={isIdCardModalOpen}
          onClose={() => setIsIdCardModalOpen(false)}
          contributor={idCardData}
        />
      )}
    </div>
  );
};
