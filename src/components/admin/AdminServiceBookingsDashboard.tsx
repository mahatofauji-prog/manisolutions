import React, { useState, useEffect } from 'react';
import { 
  ServiceBooking, 
  ServiceBookingStatus, 
  BookableServiceType 
} from '../../types';
import { 
  serviceBookingStorage, 
  subscribeToServiceBookings, 
  syncBookingsFromRemote 
} from '../../services/serviceBookingStorage';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyData';

export const AdminServiceBookingsDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<ServiceBookingStatus>('CONFIRMED');
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setBookings(serviceBookingStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToServiceBookings(loadData);
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    await syncBookingsFromRemote();
    loadData();
    showToast('Bookings synced from server');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDetailModal = (b: ServiceBooking) => {
    setSelectedBooking(b);
    setNewStatus(b.bookingStatus);
    setAdminNotes(b.adminNotes || '');
  };

  const handleSaveStatus = async () => {
    if (!selectedBooking) return;
    setIsUpdating(true);
    await serviceBookingStorage.updateStatus(selectedBooking.bookingId, newStatus, adminNotes);
    setIsUpdating(false);
    setSelectedBooking(prev => prev ? { ...prev, bookingStatus: newStatus, adminNotes } : null);
    showToast(`Booking ${selectedBooking.bookingId} status updated to ${newStatus}`);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      b.bookingId.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.businessName.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q);

    const matchesService = serviceFilter === 'all' || b.serviceType === serviceFilter;
    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesService && matchesStatus && matchesPayment;
  });

  const totalPaidRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + (b.amount || 199), 0);

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              ₹199 Service Bookings (Razorpay Verified)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              Live Gateway Active
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Real-time consultation & service architecture bookings paid directly via Razorpay.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E1DA] text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm">
          <span className="text-[11px] text-[#626873] font-semibold block">Total Bookings</span>
          <span className="text-xl sm:text-2xl font-black text-[#171A1F]">{bookings.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm">
          <span className="text-[11px] text-emerald-700 font-semibold block">Paid & Verified</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600">
            {bookings.filter(b => b.paymentStatus === 'PAID').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm">
          <span className="text-[11px] text-amber-700 font-semibold block">Pending Payment</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600">
            {bookings.filter(b => b.paymentStatus === 'PENDING_PAYMENT').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm">
          <span className="text-[11px] text-[#C79A22] font-semibold block">Booking Fees Collected</span>
          <span className="text-xl sm:text-2xl font-black text-[#171A1F]">₹{totalPaidRevenue}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, client name, phone, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none focus:border-[#C79A22]"
            />
          </div>

          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none text-slate-700 font-semibold"
            >
              <option value="all">All Services</option>
              <option value="website">Website Development</option>
              <option value="custom_software">Custom Software</option>
              <option value="ai_automation">AI Automation</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none text-slate-700 font-semibold"
            >
              <option value="all">All Booking Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table / Cards */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No service bookings found</h3>
          <p className="text-xs text-slate-400">
            Bookings made through Website Development, Custom Software or AI Automation will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
          {filteredBookings.map((b) => (
            <div
              key={b.bookingId}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="space-y-2 flex-grow">
                {/* Header row with badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-[#171A1F] text-xs">
                    {b.bookingId}
                  </span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    b.paymentStatus === 'PAID'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {b.paymentStatus === 'PAID' ? '✓ ₹199 Paid' : 'Pending Payment'}
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {b.bookingStatus}
                  </span>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(b.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                {/* Client info */}
                <div className="text-xs space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <strong className="text-slate-900 font-bold">{b.fullName}</strong>
                    {b.businessName && (
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {b.businessName}
                      </span>
                    )}
                    <span className="font-bold text-[#C79A22]">{b.serviceName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px] pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {b.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {b.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {b.city}
                    </span>
                    {b.razorpayPaymentId && (
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                        Rzp ID: {b.razorpayPaymentId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Brief requirement snippet */}
                {b.projectRequirements && (
                  <p className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/70 max-w-2xl line-clamp-2">
                    {b.projectRequirements}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <button
                  onClick={() => handleOpenDetailModal(b)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#171A1F] hover:text-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <a
                  href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${b.fullName}, thank you for booking ${b.serviceName} with MANI Solution (Booking ID: ${b.bookingId}). We are reviewing your requirements.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-[#E4E1DA] shadow-2xl p-6 space-y-6 text-left my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">
                  Service Booking Details
                </span>
                <h3 className="text-lg font-mono font-black text-[#171A1F]">
                  {selectedBooking.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment & Status Strip */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Booking Amount:</span>
                <span className="font-bold text-sm text-[#171A1F]">₹{selectedBooking.amount} (INR)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className={`font-bold ${selectedBooking.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {selectedBooking.paymentStatus === 'PAID' ? '✓ Verified & Paid via Razorpay' : 'Pending Payment'}
                </span>
              </div>
              {selectedBooking.razorpayPaymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Razorpay Payment ID:</span>
                  <span className="font-mono text-slate-900">{selectedBooking.razorpayPaymentId}</span>
                </div>
              )}
              {selectedBooking.razorpayOrderId && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Razorpay Order ID:</span>
                  <span className="font-mono text-slate-900">{selectedBooking.razorpayOrderId}</span>
                </div>
              )}
            </div>

            {/* Client Info Grid */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Client Details</h4>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white border border-[#E4E1DA]">
                <div><span className="text-slate-500">Name:</span> <strong>{selectedBooking.fullName}</strong></div>
                <div><span className="text-slate-500">Business:</span> <strong>{selectedBooking.businessName || 'N/A'}</strong></div>
                <div><span className="text-slate-500">Phone:</span> <strong>{selectedBooking.phone}</strong></div>
                <div><span className="text-slate-500">Email:</span> <strong>{selectedBooking.email}</strong></div>
                <div><span className="text-slate-500">City:</span> <strong>{selectedBooking.city}</strong></div>
                <div><span className="text-slate-500">Preferred Contact:</span> <strong>{selectedBooking.preferredContactMethod}</strong></div>
              </div>
            </div>

            {/* Requirements & Service Specific Details */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {selectedBooking.serviceName} Specifics
              </h4>
              <div className="p-3.5 rounded-xl bg-white border border-[#E4E1DA] space-y-2">
                {selectedBooking.websiteType && (
                  <div><span className="text-slate-500">Website Type:</span> {selectedBooking.websiteType}</div>
                )}
                {selectedBooking.requiredPages && (
                  <div><span className="text-slate-500">Required Pages:</span> {selectedBooking.requiredPages}</div>
                )}
                {selectedBooking.existingWebsiteUrl && (
                  <div>
                    <span className="text-slate-500">Existing Website:</span>{' '}
                    <a href={selectedBooking.existingWebsiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      {selectedBooking.existingWebsiteUrl}
                    </a>
                  </div>
                )}
                {selectedBooking.softwareType && (
                  <div><span className="text-slate-500">Software Type:</span> {selectedBooking.softwareType}</div>
                )}
                {selectedBooking.requiredModules && (
                  <div><span className="text-slate-500">Required Modules:</span> {selectedBooking.requiredModules}</div>
                )}
                {selectedBooking.userCountOrBranches && (
                  <div><span className="text-slate-500">Users/Branches:</span> {selectedBooking.userCountOrBranches}</div>
                )}
                {selectedBooking.whatToAutomate && (
                  <div><span className="text-slate-500">What to Automate:</span> {selectedBooking.whatToAutomate}</div>
                )}
                {selectedBooking.currentToolsUsed && (
                  <div><span className="text-slate-500">Current Tools:</span> {selectedBooking.currentToolsUsed}</div>
                )}
                {selectedBooking.budget && (
                  <div><span className="text-slate-500">Target Budget:</span> {selectedBooking.budget}</div>
                )}
                {selectedBooking.projectRequirements && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block mb-1">Full Requirements:</span>
                    <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-line">
                      {selectedBooking.projectRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Update Status & Notes */}
            <div className="space-y-3 pt-2 border-t border-[#E4E1DA] text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Update Booking Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Booking Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ServiceBookingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-white font-semibold"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Internal Admin Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Scheduled Zoom call for Friday 3 PM"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleSaveStatus}
                  className="px-5 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white font-bold cursor-pointer transition-colors shadow"
                >
                  {isUpdating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
