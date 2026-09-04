import React, { useState, useEffect, useMemo } from 'react';
import { Enquiry, EnquiryStatus } from '../../types';
import { enquiryStorage } from '../../services/enquiryStorage';
import { COMPANY_INFO } from '../../data/companyData';
import { 
  Search, Filter, Inbox, Phone, Mail, MessageSquare, 
  Trash2, X, AlertCircle, RotateCcw,
  CheckCircle, Clock, CheckCircle2, User, FileText, PhoneCall
, LogOut } from 'lucide-react';

interface AdminEnquiriesDashboardProps {
  onLogout: () => void;
}

export const AdminEnquiriesDashboard: React.FC<AdminEnquiriesDashboardProps> = ({ onLogout }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | EnquiryStatus>('All');
  const [serviceFilter, setServiceFilter] = useState('All');

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadData = () => {
    setEnquiries(enquiryStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = enquiryStorage.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      new: enquiries.filter(e => e.status === 'New').length,
      contacted: enquiries.filter(e => e.status === 'Contacted').length,
      inProgress: enquiries.filter(e => e.status === 'In Progress').length,
      converted: enquiries.filter(e => e.status === 'Converted').length,
      closed: enquiries.filter(e => e.status === 'Closed').length,
    };
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      if (serviceFilter !== 'All' && e.service !== serviceFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !e.fullName.toLowerCase().includes(q) &&
          !e.phone.toLowerCase().includes(q) &&
          !e.id.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [enquiries, statusFilter, serviceFilter, searchQuery]);

  const uniqueServices = useMemo(() => {
    return Array.from(new Set(enquiries.map(e => e.service)));
  }, [enquiries]);

  const handleDelete = (id: string) => {
    enquiryStorage.delete(id);
    setDeleteConfirmId(null);
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry(null);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: EnquiryStatus) => {
    enquiryStorage.update(id, { status: newStatus });
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
  };

  const handleUpdateNotes = (id: string, newNotes: string) => {
    enquiryStorage.update(id, { internalNotes: newNotes });
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, internalNotes: newNotes });
    }
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New': return <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200">NEW</span>;
      case 'Contacted': return <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">CONTACTED</span>;
      case 'In Progress': return <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold border border-purple-200">IN PROGRESS</span>;
      case 'Converted': return <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">CONVERTED</span>;
      case 'Closed': return <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">CLOSED</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Bar with Founder Details & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#C79A22]/20 text-[#C79A22] text-xs font-bold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-[#626873]">
              Welcome, <strong>Mr. Hariom Mahato</strong> (Founder & Chief Architect)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171A1F]">
            Enquiry Management System
          </h1>
        </div>
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all text-xs flex items-center gap-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] uppercase font-semibold">Total</span>
          <p className="text-2xl font-extrabold text-[#171A1F]">{stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-1">
          <span className="text-[11px] text-blue-600 uppercase font-semibold">New</span>
          <p className="text-2xl font-extrabold text-blue-600">{stats.new}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
          <span className="text-[11px] text-amber-600 uppercase font-semibold">Contacted</span>
          <p className="text-2xl font-extrabold text-amber-600">{stats.contacted}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-1">
          <span className="text-[11px] text-purple-600 uppercase font-semibold">In Progress</span>
          <p className="text-2xl font-extrabold text-purple-600">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[11px] text-emerald-600 uppercase font-semibold">Converted</span>
          <p className="text-2xl font-extrabold text-emerald-600">{stats.converted}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 uppercase font-semibold">Closed</span>
          <p className="text-2xl font-extrabold text-slate-600">{stats.closed}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/4 space-y-4">
          
          {/* Filters & Search */}
          <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none"
              >
                <option value="All">All Services</option>
                {uniqueServices.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); setServiceFilter('All'); }}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-[#E4E1DA] text-slate-500 transition-all text-xs"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Enquiries List */}
          <div className="rounded-2xl bg-white border border-[#E4E1DA] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-[#E4E1DA] uppercase font-semibold text-slate-400 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Enquiry ID & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service Required</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E1DA]">
                  {filteredEnquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedEnquiry(enq)}>
                      <td className="py-3 px-4">
                        <div className="font-mono text-[#171A1F] font-bold text-xs">{enq.id}</div>
                        <div className="text-[10px] text-[#626873]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#171A1F] font-semibold text-sm truncate max-w-[150px]">{enq.fullName}</div>
                        <div className="text-[#626873] text-[11px] font-mono">{enq.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600 truncate max-w-[150px] block">
                          {enq.service}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(enq.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                            title="View Details"
                          >
                            <Inbox className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(enq.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEnquiries.length === 0 && (
                <div className="py-16 text-center space-y-3">
                  <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-[#171A1F]">No enquiries found.</h3>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Selected Enquiry Details sidebar */}
        <div className="w-full lg:w-1/4">
          {selectedEnquiry ? (
            <div className="rounded-2xl bg-white border border-[#E4E1DA] shadow-sm overflow-hidden sticky top-6">
              <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-slate-50">
                <h3 className="text-sm font-bold text-[#171A1F]">Enquiry Details</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-[#171A1F]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-5">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Status</div>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-3 border-t border-[#E4E1DA] pt-4">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-[#171A1F]">{selectedEnquiry.fullName}</div>
                      <div className="text-[11px] text-[#626873]">Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a href={`tel:${selectedEnquiry.phone.replace(/\\s/g, '')}`} className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-bold flex items-center gap-1.5 border border-blue-200 transition-colors">
                      <PhoneCall className="w-3 h-3" /> Call
                    </a>
                    <a href={`https://wa.me/${selectedEnquiry.phone.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors">
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                    {selectedEnquiry.email && (
                      <a href={`mailto:${selectedEnquiry.email}`} className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center gap-1.5 border border-slate-200 transition-colors">
                        <Mail className="w-3 h-3" /> Email
                      </a>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#E4E1DA] pt-4 space-y-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Service Required</div>
                    <div className="text-xs font-semibold text-[#171A1F] bg-slate-50 border border-[#E4E1DA] p-2 rounded-lg">
                      {selectedEnquiry.service}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Project Requirements</div>
                    <div className="text-xs text-[#626873] bg-slate-50 border border-[#E4E1DA] p-3 rounded-lg whitespace-pre-line leading-relaxed">
                      {selectedEnquiry.projectRequirements}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E4E1DA] pt-4">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Internal Admin Notes</div>
                  <textarea
                    rows={4}
                    value={selectedEnquiry.internalNotes}
                    onChange={(e) => handleUpdateNotes(selectedEnquiry.id, e.target.value)}
                    placeholder="Add private notes here..."
                    className="w-full px-3 py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-[#171A1F] text-xs focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 h-64 flex items-center justify-center text-center p-6 text-slate-400">
              <div>
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Select an enquiry from the list to view full details and manage status.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E1DA] rounded-2xl p-6 shadow-xl max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-[#171A1F]">Confirm Deletion</h3>
            <p className="text-xs text-[#626873]">
              Are you sure you want to permanently delete this enquiry? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#626873] text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
