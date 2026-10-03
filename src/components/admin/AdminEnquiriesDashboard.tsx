import React, { useState, useEffect } from 'react';
import { Enquiry, EnquiryStatus } from '../../types';
import { enquiryStorage, subscribeToEnquiries } from '../../services/enquiryStorage';
import { 
  Inbox, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Filter, 
  MessageSquare, 
  Eye, 
  X,
  FileText,
  Tag
} from 'lucide-react';

interface AdminEnquiriesDashboardProps {
  onLogout?: () => void;
}

export const AdminEnquiriesDashboard: React.FC<AdminEnquiriesDashboardProps> = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    // Strictly filter out any service bookings that might have been mirrored to enquiries
    const raw = enquiryStorage.getAll();
    const cleanEnquiries = raw.filter(e => {
      const isBooking = 
        e.id.startsWith('MANI-BKG') || 
        (e.service && e.service.includes('₹199 Paid Booking')) ||
        (e.projectRequirements && e.projectRequirements.includes('[₹199 PAID BOOKING]'));
      return !isBooking;
    });
    setEnquiries(cleanEnquiries);
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToEnquiries(loadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: EnquiryStatus) => {
    enquiryStorage.updateStatus(id, newStatus);
    showToast(`Enquiry ${id} status updated to ${newStatus}.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      enquiryStorage.delete(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
      showToast('Enquiry deleted.');
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      e.id.toLowerCase().includes(q) ||
      e.fullName.toLowerCase().includes(q) ||
      (e.business && e.business.toLowerCase().includes(q)) ||
      (e.city && e.city.toLowerCase().includes(q)) ||
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      e.phone.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.service && e.service.toLowerCase().includes(q)) ||
      (e.projectRequirements && e.projectRequirements.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E1DA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              Inbound Website Enquiries
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              Unpaid Inquiries Only
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            General website contact forms, demo requests, and corporate leads. Strictly isolated from paid ₹199 service bookings.
          </p>
        </div>

        <span className="text-xs font-bold text-[#C79A22] bg-[#C79A22]/10 border border-[#C79A22]/30 px-3.5 py-1.5 rounded-xl">
          {enquiries.length} Total Enquiries
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-blue-700 font-semibold block">New Enquiries</span>
          <span className="text-2xl font-black text-blue-600">
            {enquiries.filter(e => e.status === 'New').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-amber-700 font-semibold block">Contacted</span>
          <span className="text-2xl font-black text-amber-600">
            {enquiries.filter(e => e.status === 'Contacted').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-purple-700 font-semibold block">In Discussion</span>
          <span className="text-2xl font-black text-purple-600">
            {enquiries.filter(e => e.status === 'In Discussion').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-emerald-700 font-semibold block">Converted</span>
          <span className="text-2xl font-black text-emerald-600">
            {enquiries.filter(e => e.status === 'Converted').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold block">Closed</span>
          <span className="text-2xl font-black text-slate-600">
            {enquiries.filter(e => e.status === 'Closed').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, name, business, phone, email, city, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Discussion">In Discussion</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No enquiries found</h3>
          <p className="text-xs text-slate-400">
            Contact form submissions and demo requests will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="space-y-1.5 flex-grow">
                {/* Header Strip with Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#171A1F]">{enq.id}</span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    enq.status === 'New'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : enq.status === 'Contacted'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : enq.status === 'In Discussion'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : enq.status === 'Converted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {enq.status}
                  </span>

                  {enq.service && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C79A22]/10 text-[#C79A22] border border-[#C79A22]/30">
                      {enq.service}
                    </span>
                  )}

                  {enq.source && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                      Source: {enq.source}
                    </span>
                  )}

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(enq.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Sender Details */}
                <div className="text-xs space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900">{enq.fullName}</strong>
                    {enq.business && (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                        <Building className="w-3 h-3 inline mr-1 text-slate-400" />
                        {enq.business}
                      </span>
                    )}
                    {enq.city && (
                      <span className="text-slate-500 text-[11px] flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {enq.city}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px] pt-0.5">
                    <span className="font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {enq.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {enq.email}
                    </span>
                    {enq.subject && (
                      <span className="font-semibold text-slate-800">
                        Subject: {enq.subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                {enq.projectRequirements && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 max-w-2xl leading-relaxed">
                    {enq.projectRequirements}
                  </p>
                )}
              </div>

              {/* Status Update & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-[#E4E1DA] bg-white text-slate-800 font-semibold"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <button
                    onClick={() => setSelectedEnquiry(enq)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="View Full Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {enq.phone && (
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${enq.fullName}, thank you for contacting MANI Solution regarding ${enq.service || 'your enquiry'}. We received your message and would love to assist you.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                      title="Connect on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ENQUIRY DETAIL MODAL */}
      {selectedEnquiry && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E4E1DA] shadow-2xl p-6 space-y-4 text-left my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">
                  Enquiry Record
                </span>
                <h3 className="text-lg font-mono font-black text-[#171A1F]">
                  {selectedEnquiry.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div><span className="text-slate-500">Name:</span> <strong>{selectedEnquiry.fullName}</strong></div>
                <div><span className="text-slate-500">Business:</span> <strong>{selectedEnquiry.business || 'N/A'}</strong></div>
                <div><span className="text-slate-500">Phone:</span> <strong>{selectedEnquiry.phone}</strong></div>
                <div><span className="text-slate-500">Email:</span> <strong>{selectedEnquiry.email}</strong></div>
                <div><span className="text-slate-500">City:</span> <strong>{selectedEnquiry.city || 'N/A'}</strong></div>
                <div><span className="text-slate-500">Service:</span> <strong>{selectedEnquiry.service || 'General'}</strong></div>
                {selectedEnquiry.subject && (
                  <div className="col-span-2"><span className="text-slate-500">Subject:</span> <strong>{selectedEnquiry.subject}</strong></div>
                )}
                {selectedEnquiry.source && (
                  <div className="col-span-2"><span className="text-slate-500">Source:</span> <strong>{selectedEnquiry.source}</strong></div>
                )}
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-bold">Message Content:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.projectRequirements || 'No message provided.'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-bold">Update Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    const newSt = e.target.value as EnquiryStatus;
                    handleStatusChange(selectedEnquiry.id, newSt);
                    setSelectedEnquiry(prev => prev ? { ...prev, status: newSt } : null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-white font-semibold text-slate-800"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E1DA]">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
