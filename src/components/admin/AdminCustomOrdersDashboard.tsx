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
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Filter, 
  FileText, 
  Sparkles,
  Layers,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Tag,
  Paperclip,
  Check
} from 'lucide-react';
import { CustomSolutionOrder, CustomSolutionOrderStatus } from '../../types';
import { customSolutionOrderStorage, subscribeToCustomOrders } from '../../services/customSolutionOrderStorage';
import { AdminConfirmDeleteModal } from './AdminConfirmDeleteModal';

interface AdminCustomOrdersDashboardProps {
  onBackToSite?: () => void;
}

const STATUS_CONFIG: Record<CustomSolutionOrderStatus, { bg: string; text: string; border: string }> = {
  'New': { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Contacted': { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-700', border: 'border-blue-200' },
  'In Discussion': { bg: 'bg-amber-50 text-amber-800', text: 'text-amber-800', border: 'border-amber-200' },
  'Proposal Sent': { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-200' },
  'Confirmed': { bg: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Completed': { bg: 'bg-teal-50 text-teal-800', text: 'text-teal-800', border: 'border-teal-200' },
  'Cancelled': { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200' }
};

const ALL_STATUSES: CustomSolutionOrderStatus[] = [
  'New',
  'Contacted',
  'In Discussion',
  'Proposal Sent',
  'Confirmed',
  'Completed',
  'Cancelled'
];

const SOLUTION_FILTER_OPTIONS = [
  'All',
  'Website',
  'Web Application',
  'Mobile App',
  'Business Software',
  'School Management System',
  'Hospital Management System',
  'E-commerce',
  'AI Solution',
  'Automation',
  'Other'
];

export const AdminCustomOrdersDashboard: React.FC<AdminCustomOrdersDashboardProps> = ({
  onBackToSite
}) => {
  const [orders, setOrders] = useState<CustomSolutionOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [solutionFilter, setSolutionFilter] = useState<string>('all');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<CustomSolutionOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<CustomSolutionOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status & Note editing inside modal
  const [newStatus, setNewStatus] = useState<CustomSolutionOrderStatus>('New');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadOrders = () => {
    setOrders(customSolutionOrderStorage.getAll());
  };

  useEffect(() => {
    loadOrders();
    const unsubscribe = subscribeToCustomOrders(() => {
      loadOrders();
    });
    return () => unsubscribe();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Detail Modal
  const handleOpenDetail = (order: CustomSolutionOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNotesInput(order.adminNotes || '');
  };

  // Update Status & Notes
  const handleSaveStatusAndNotes = () => {
    if (!selectedOrder) return;
    setIsSavingStatus(true);
    try {
      const success = customSolutionOrderStorage.updateStatus(selectedOrder.id, newStatus, adminNotesInput.trim());
      if (success) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          adminNotes: adminNotesInput.trim()
        });
        showToast(`Order ${selectedOrder.id} status updated to "${newStatus}"`, 'success');
      } else {
        showToast('Failed to update order', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Delete Order
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    
    return new Promise<void>((resolve, reject) => {
      try {
        const success = customSolutionOrderStorage.delete(orderToDelete.id);
        if (success) {
          if (selectedOrder?.id === orderToDelete.id) {
            setSelectedOrder(null);
          }
          setOrderToDelete(null);
          showToast(`Order ${orderToDelete.id} deleted successfully`, 'success');
          resolve();
        } else {
          showToast('Failed to delete order', 'error');
          reject(new Error('Failed to delete'));
        }
      } catch (err) {
        console.error(err);
        showToast('Error deleting order', 'error');
        reject(err);
      }
    });
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mobileNumber.includes(searchQuery) ||
      (order.locationCity && order.locationCity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.requiredSolution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.projectRequirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSolution = solutionFilter === 'all' || order.requiredSolution.toLowerCase().includes(solutionFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSolution;
  });

  const stats = customSolutionOrderStorage.getStats();

  return (
    <div id="admin-custom-orders-dashboard" className="space-y-6 text-left">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2 border ${
            toastMessage.type === 'success' ? 'bg-emerald-900 text-emerald-100 border-emerald-700' : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E4E1DA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-[#C79A22] border border-amber-200 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Engineering CMS</span>
            </span>
            <span className="text-xs text-[#626873] font-semibold">{orders.length} Total Orders</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#171A1F] mt-1">
            Custom Solution Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#626873]">
            Manage client requests for custom software, web applications, apps, and bespoke platforms.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-base sm:text-lg font-black text-[#171A1F]">{stats.total}</div>
            <div className="text-[10px] uppercase font-bold text-[#626873]">Total</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-base sm:text-lg font-black text-emerald-700">{stats.new}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-700">New</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-base sm:text-lg font-black text-amber-700">{stats.inDiscussion}</div>
            <div className="text-[10px] uppercase font-bold text-amber-700">In Talk</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
            <div className="text-base sm:text-lg font-black text-indigo-700">{stats.confirmed}</div>
            <div className="text-[10px] uppercase font-bold text-indigo-700">Confirmed</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E1DA] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#626873] absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, business, phone, city, solution or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4E1DA] bg-slate-50 text-xs sm:text-sm text-[#171A1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Solution Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E4E1DA] rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#626873]" />
            <select
              value={solutionFilter}
              onChange={(e) => setSolutionFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#171A1F] focus:outline-none cursor-pointer"
            >
              <option value="all">All Solutions</option>
              {SOLUTION_FILTER_OPTIONS.filter(s => s !== 'All').map((sol) => (
                <option key={sol} value={sol}>{sol}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-[#E4E1DA] rounded-xl px-3 py-2 text-xs">
            <Tag className="w-3.5 h-3.5 text-[#626873]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#171A1F] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Orders Table / Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E4E1DA] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-[#626873] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#171A1F]">No Custom Solution Orders Found</h3>
          <p className="text-xs text-[#626873] max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || solutionFilter !== 'all'
              ? 'Try adjusting your search query or filters.'
              : 'Submitted custom solution orders will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E4E1DA] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-[#E4E1DA] text-[11px] font-bold text-[#626873] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Client & Business</th>
                  <th className="py-3.5 px-4">Requested Solution</th>
                  <th className="py-3.5 px-4">Budget & Timeline</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1DA] text-xs">
                {filteredOrders.map((order) => {
                  const statusSt = STATUS_CONFIG[order.status] || STATUS_CONFIG['New'];
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr 
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(order)}
                    >
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-[#171A1F]">{order.id}</div>
                        <div className="text-[10px] text-[#626873]">{orderDate}</div>
                      </td>

                      {/* Client & Business */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#171A1F]">{order.fullName}</div>
                        <div className="text-[11px] text-[#626873] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#C79A22]" />
                          <span className="truncate max-w-[160px]">{order.businessName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{order.mobileNumber}</div>
                      </td>

                      {/* Requested Solution */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#2563EB] flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#2563EB]" />
                          <span>{order.requiredSolution}</span>
                        </div>
                        <div className="text-[10px] text-[#626873] truncate max-w-[200px]">
                          {order.businessCategory}
                        </div>
                      </td>

                      {/* Budget & Timeline */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-[#C79A22]">{order.budget}</div>
                        <div className="text-[10px] text-[#626873]">{order.expectedTimeline}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusSt.bg} ${statusSt.border}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 text-slate-600 hover:text-[#171A1F] hover:bg-slate-100 rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={`https://wa.me/${order.whatsappNumber?.replace(/[^0-9]/g, '') || order.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.fullName}, regarding your custom solution request for "${order.requiredSolution}" on MANI Solution...`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setOrderToDelete(order)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-6 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E4E1DA] bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#C79A22] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#626873]">{selectedOrder.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[selectedOrder.status]?.bg || ''} ${STATUS_CONFIG[selectedOrder.status]?.border || ''}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-[#171A1F]">
                    {selectedOrder.requiredSolution} for {selectedOrder.businessName}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-[#626873] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Contact Information & Quick Actions */}
              <div className="bg-slate-50 border border-[#E4E1DA] rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>Client Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#626873] block">Full Name:</span>
                    <strong className="text-[#171A1F] text-sm">{selectedOrder.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[#626873] block">Business / Organization:</span>
                    <strong className="text-[#171A1F] text-sm">{selectedOrder.businessName}</strong>
                  </div>
                  <div>
                    <span className="text-[#626873] block">Industry Category:</span>
                    <span className="font-semibold text-[#171A1F]">{selectedOrder.businessCategory}</span>
                  </div>
                  <div>
                    <span className="text-[#626873] block">Location / City:</span>
                    <span className="font-semibold text-[#171A1F]">{selectedOrder.locationCity || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[#626873] block">Mobile Phone:</span>
                    <span className="font-bold text-[#171A1F]">{selectedOrder.mobileNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#626873] block">WhatsApp:</span>
                    <span className="font-bold text-emerald-700">{selectedOrder.whatsappNumber || selectedOrder.mobileNumber}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#626873] block">Email Address:</span>
                    <span className="font-bold text-[#171A1F]">{selectedOrder.email}</span>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-[#E4E1DA]">
                  <a
                    href={`tel:${selectedOrder.mobileNumber.replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#171A1F] font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Mobile</span>
                  </a>

                  <a
                    href={`https://wa.me/${selectedOrder.whatsappNumber?.replace(/[^0-9]/g, '') || selectedOrder.mobileNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.fullName}, I am connecting from MANI Solution regarding your custom solution request for "${selectedOrder.requiredSolution}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href={`mailto:${selectedOrder.email}?subject=${encodeURIComponent(`MANI Solution — Custom Solution Proposal for ${selectedOrder.businessName}`)}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#171A1F] font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-purple-600" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              {/* Project Requirements & Specifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#626873] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Project Requirements & Scope</span>
                </h3>

                <div className="bg-[#F8F9FA] border border-[#E4E1DA] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-[#626873] uppercase tracking-wider block">
                      Detailed Requirements:
                    </span>
                    <p className="text-xs sm:text-sm text-[#171A1F] leading-relaxed whitespace-pre-wrap mt-1">
                      {selectedOrder.projectRequirements}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E4E1DA] text-xs">
                    <div>
                      <span className="text-[#626873] block">Approximate Budget:</span>
                      <strong className="text-sm font-bold text-[#C79A22]">{selectedOrder.budget}</strong>
                    </div>
                    <div>
                      <span className="text-[#626873] block">Expected Timeline:</span>
                      <strong className="text-sm font-bold text-[#171A1F]">{selectedOrder.expectedTimeline}</strong>
                    </div>
                  </div>

                  {selectedOrder.referenceUrl && (
                    <div className="pt-2 border-t border-[#E4E1DA] text-xs">
                      <span className="text-[#626873] block">Reference Website / App:</span>
                      <a
                        href={selectedOrder.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                      >
                        <span>{selectedOrder.referenceUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {selectedOrder.additionalNotes && (
                    <div className="pt-2 border-t border-[#E4E1DA] text-xs">
                      <span className="text-[#626873] block">Additional Notes:</span>
                      <p className="text-[#171A1F] mt-0.5">{selectedOrder.additionalNotes}</p>
                    </div>
                  )}

                  {/* Uploaded File */}
                  {selectedOrder.referenceFileDataUrl && (
                    <div className="pt-3 border-t border-[#E4E1DA] space-y-2">
                      <span className="text-[11px] font-bold text-[#626873] uppercase tracking-wider flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5 text-[#C79A22]" />
                        <span>Attached Reference File / Screenshot:</span>
                      </span>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E4E1DA]">
                        <span className="text-xs font-bold text-[#171A1F] truncate">
                          {selectedOrder.referenceFileName || 'Uploaded Reference'}
                        </span>

                        <div className="flex items-center gap-2">
                          <a
                            href={selectedOrder.referenceFileDataUrl}
                            download={selectedOrder.referenceFileName || 'custom-reference'}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#171A1F] flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>

                      {/* If Image, show thumbnail */}
                      {selectedOrder.referenceFileDataUrl.startsWith('data:image') && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-[#E4E1DA] max-h-60 bg-slate-900 flex items-center justify-center">
                          <img
                            src={selectedOrder.referenceFileDataUrl}
                            alt="Reference Screenshot"
                            className="max-h-60 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span>Admin Management & Status Pipeline</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Update Status:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as CustomSolutionOrderStatus)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs font-bold text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#171A1F]">
                      Internal Notes:
                    </label>
                    <input
                      type="text"
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder="e.g. Sent proposal via email on 24th..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-white text-xs text-[#171A1F] focus:outline-none focus:ring-2 focus:ring-[#C79A22]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveStatusAndNotes}
                    disabled={isSavingStatus}
                    className="px-5 py-2 rounded-xl bg-[#171A1F] hover:bg-slate-800 text-[#ECC348] font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSavingStatus ? 'Saving...' : 'Save Status & Notes'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#E4E1DA] bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setOrderToDelete(selectedOrder)}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Request</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#171A1F] font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-[#171A1F]">
                Delete Custom Order {orderToDelete.id}?
              </h3>
              <p className="text-xs text-[#626873]">
                Are you sure you want to permanently delete the custom solution request from <strong>{orderToDelete.fullName} ({orderToDelete.businessName})</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E4E1DA] text-xs font-bold text-[#171A1F] hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
