import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Home, 
  Star, 
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Building,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ReadySolutionItem, ReadySolutionRequest, PageView } from '../../types';
import { readySolutionsStorage, subscribeToReadySolutions } from '../../services/readySolutionsStorage';
import { READY_SOLUTIONS_CATEGORIES } from '../../data/readySolutionsData';
import { AdminReadySolutionModal } from './AdminReadySolutionModal';
import { AdminConfirmDeleteModal } from './AdminConfirmDeleteModal';

interface AdminReadySolutionsDashboardProps {
  onBackToSite: () => void;
  onViewPublicSolution?: (solution: ReadySolutionItem) => void;
}

export const AdminReadySolutionsDashboard: React.FC<AdminReadySolutionsDashboardProps> = ({
  onBackToSite,
  onViewPublicSolution
}) => {
  const [solutions, setSolutions] = useState<ReadySolutionItem[]>([]);
  const [requests, setRequests] = useState<ReadySolutionRequest[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'requests'>('products');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'published' | 'draft'>('All');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<ReadySolutionItem | null>(null);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, title: string, type: 'solution' | 'request' | 'reset' } | null>(null);

  const loadData = () => {
    setSolutions(readySolutionsStorage.getAll());
    setRequests(readySolutionsStorage.getAllRequests());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToReadySolutions(loadData);
    return () => unsubscribe();
  }, []);

  // Stats calculations
  const stats = useMemo(() => {
    const total = solutions.length;
    const published = solutions.filter(s => s.status === 'published').length;
    const drafts = solutions.filter(s => s.status === 'draft').length;
    const homepageFeatured = solutions.filter(s => s.status === 'published' && s.featuredOnHomepage).length;
    const totalRequests = requests.length;
    const newRequests = requests.filter(r => r.status === 'New').length;

    return { total, published, drafts, homepageFeatured, totalRequests, newRequests };
  }, [solutions, requests]);

  // Filtered solutions
  const filteredSolutions = useMemo(() => {
    return solutions.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === 'All' || s.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [solutions, searchQuery, categoryFilter, statusFilter]);

  // Actions
  const handleSaveSolution = (data: Omit<ReadySolutionItem, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      readySolutionsStorage.update(id, data);
    } else {
      readySolutionsStorage.create(data);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title, type: 'solution' });
  };

  const handleToggleStatus = (id: string) => {
    readySolutionsStorage.toggleStatus(id);
  };

  const handleToggleHomepage = (id: string) => {
    readySolutionsStorage.toggleHomepage(id);
  };

  const handleUpdateRequestStatus = (id: string, newStatus: 'New' | 'Contacted' | 'In Progress' | 'Closed') => {
    readySolutionsStorage.updateRequestStatus(id, newStatus);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTarget({ id, title: 'customer request record', type: 'request' });
  };

  const handleResetDefaults = () => {
    setDeleteTarget({ id: 'reset', title: 'database and restore all factory default products', type: 'reset' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    return new Promise<void>((resolve, reject) => {
      try {
        if (deleteTarget.type === 'solution') {
          const success = readySolutionsStorage.delete(deleteTarget.id);
          if (!success) throw new Error('Deletion failed');
        } else if (deleteTarget.type === 'request') {
          const success = readySolutionsStorage.deleteRequest(deleteTarget.id);
          if (!success) throw new Error('Deletion failed');
        } else if (deleteTarget.type === 'reset') {
          readySolutionsStorage.resetToDefault();
        }
        setDeleteTarget(null);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  return (
    <div id="admin-ready-solutions-dashboard" className="space-y-6 text-left">
      
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E1DA] shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/20 text-[#C79A22] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Built Product Ecosystem</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#171A1F]">
            Ready Solutions CMS
          </h2>
          <p className="text-xs text-[#626873]">
            Manage pre-packaged digital products, prices, homepage 6-product showcase, and client orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSolution(null);
              setIsAddEditModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C79A22] via-[#E2B744] to-[#C79A22] hover:brightness-110 text-[#0A0E17] text-xs font-black shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ready Solution</span>
          </button>

          <button
            onClick={handleResetDefaults}
            title="Reset Default Products"
            className="p-2.5 rounded-xl bg-white border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Total Solutions</div>
          <div className="text-2xl font-black text-[#171A1F]">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Live Published</div>
          <div className="text-2xl font-black text-emerald-600">{stats.published}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Draft / Hidden</div>
          <div className="text-2xl font-black text-amber-600">{stats.drafts}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">
            Homepage Showcase <span className="text-[10px] text-slate-400 font-normal">(Max 6)</span>
          </div>
          <div className="text-2xl font-black text-[#2563EB]">
            {Math.min(stats.homepageFeatured, 6)} <span className="text-xs font-normal text-slate-400">/ 6 active</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Products vs Customer Requests */}
      <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-2">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'products'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C79A22]" />
          <span>Products Catalog ({solutions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'requests'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <span>Customer Requests ({requests.length})</span>
          {stats.newRequests > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {stats.newRequests}
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: PRODUCTS CMS */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E4E1DA]">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#626873] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category & Status Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F]"
              >
                <option value="All">All Categories</option>
                {READY_SOLUTIONS_CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F]"
              >
                <option value="All">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Solutions Table / List */}
          <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
            {filteredSolutions.length === 0 ? (
              <div className="p-12 text-center text-[#626873] space-y-2">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-bold text-sm text-[#171A1F]">No Ready Solutions Found</div>
                <div className="text-xs">Try adjusting your search or add a new solution.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#E4E1DA] text-[#626873] font-bold">
                    <tr>
                      <th className="py-3 px-4">Solution</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Homepage (Max 6)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E1DA]">
                    {filteredSolutions.map((sol) => (
                      <tr key={sol.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Thumbnail & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={sol.thumbnailUrl}
                              alt=""
                              className="w-12 h-9 rounded-lg object-cover border border-[#E4E1DA] shrink-0 bg-slate-100"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-[#171A1F] truncate max-w-xs">
                                {sol.title}
                              </div>
                              <div className="text-[10px] text-[#626873] font-mono">
                                ID: {sol.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                            {sol.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-[#171A1F]">
                          {sol.price || sol.priceType}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(sol.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              sol.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {sol.status === 'published' ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        {/* Homepage Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleHomepage(sol.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              sol.featuredOnHomepage
                                ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                            title="Toggle Homepage Display"
                          >
                            {sol.featuredOnHomepage ? '★ Shown on Home' : '— Off Home'}
                          </button>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onViewPublicSolution && (
                              <button
                                onClick={() => onViewPublicSolution(sol)}
                                className="p-1.5 rounded-lg text-[#626873] hover:text-[#171A1F] hover:bg-slate-100"
                                title="View Public Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setEditingSolution(sol);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50"
                              title="Edit Solution"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(sol.id, sol.title)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete Solution"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: CUSTOMER PURCHASE / ENQUIRY REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          
          <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
            {requests.length === 0 ? (
              <div className="p-12 text-center text-[#626873] space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-bold text-sm text-[#171A1F]">No Ready Solution Requests Yet</div>
                <div className="text-xs">When visitors click &quot;Get This Solution&quot; on the website, their requirements will appear here.</div>
              </div>
            ) : (
              <div className="divide-y divide-[#E4E1DA]">
                {requests.map((req) => (
                  <div key={req.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Top Row: Ref ID, Product & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {req.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#171A1F]">
                          {req.solutionTitle}
                        </h4>
                        {req.solutionCategory && (
                          <span className="text-[10px] font-semibold text-[#626873] bg-slate-100 px-2 py-0.5 rounded">
                            {req.solutionCategory}
                          </span>
                        )}
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#626873]">Status:</span>
                        <select
                          value={req.status}
                          onChange={(e) => handleUpdateRequestStatus(req.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            req.status === 'New'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : req.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : req.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Row: Contact Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[#626873] block text-[10px]">Client Name:</span>
                        <strong className="text-[#171A1F]">{req.fullName}</strong>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Mobile / WhatsApp:</span>
                        <a href={`tel:${req.mobileNumber}`} className="text-[#2563EB] hover:underline font-bold">
                          {req.mobileNumber}
                        </a>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Email:</span>
                        <a href={`mailto:${req.email}`} className="text-[#171A1F] hover:underline">
                          {req.email}
                        </a>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Business / Organization:</span>
                        <span className="text-[#171A1F] font-semibold">{req.businessName || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Address & Additional Notes */}
                    {(req.city || req.state || req.fullAddress || req.additionalRequirements) && (
                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-[#171A1F] space-y-1 border border-[#E4E1DA]">
                        {(req.city || req.state || req.fullAddress) && (
                          <div className="flex items-start gap-1.5 text-[#626873]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>Location: {req.fullAddress ? `${req.fullAddress}, ` : ''}{req.city ? `${req.city}, ` : ''}{req.state || ''}</span>
                          </div>
                        )}
                        {req.additionalRequirements && (
                          <div className="text-[#171A1F]">
                            <strong>Requirements:</strong> {req.additionalRequirements}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick WhatsApp & Call Actions */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#626873]">
                      <span>Submitted: {new Date(req.createdAt).toLocaleString()}</span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${req.whatsappNumber || req.mobileNumber}?text=${encodeURIComponent(
                            `Hello ${req.fullName}, thank you for your interest in MANI Solution's "${req.solutionTitle}". I am contacting you regarding your request (Ref: ${req.id}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp Client</span>
                        </a>

                        <a
                          href={`tel:${req.mobileNumber}`}
                          className="px-3 py-1 rounded-lg bg-[#171A1F] hover:bg-black text-white font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminReadySolutionModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingSolution(null);
        }}
        onSave={handleSaveSolution}
        editingSolution={editingSolution}
      />

      <AdminConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || 'item'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
