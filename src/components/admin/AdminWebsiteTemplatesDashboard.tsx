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
import { WebsiteTemplate } from '../../types';
import { websiteTemplatesStorage, subscribeToTemplates, TemplateOrder } from '../../services/websiteTemplatesStorage';
import { categoriesStorage, subscribeToCategories } from '../../services/categoriesStorage';
import { BusinessCategory } from '../../types';
import { AdminWebsiteTemplateModal } from './AdminWebsiteTemplateModal';
import { AdminConfirmDeleteModal } from './AdminConfirmDeleteModal';

interface AdminWebsiteTemplatesDashboardProps {
  onBackToSite: () => void;
  onViewTemplate?: (template: WebsiteTemplate) => void;
}

export const AdminWebsiteTemplatesDashboard: React.FC<AdminWebsiteTemplatesDashboardProps> = ({
  onBackToSite,
  onViewTemplate
}) => {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [orders, setOrders] = useState<TemplateOrder[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'orders'>('catalog');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'published' | 'draft'>('All');

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WebsiteTemplate | null>(null);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, title: string, type: 'template' | 'order' | 'reset' } | null>(null);

  const loadData = () => {
    setCategories(categoriesStorage.getAll());
    setTemplates(websiteTemplatesStorage.getAll());
    setOrders(websiteTemplatesStorage.getAllOrders());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToTemplates(loadData);
    const unsubCategories = subscribeToCategories(loadData);
    return () => {
      unsubscribe();
      unsubCategories();
    };
  }, []);

  // Stats calculations
  const stats = useMemo(() => {
    const total = templates.length;
    const published = templates.filter(t => t.status === 'published').length;
    const drafts = templates.filter(t => t.status === 'draft').length;
    const featured = templates.filter(t => t.isFeatured && t.status === 'published').length;
    const totalOrders = orders.length;
    const newOrders = orders.filter(o => o.status === 'New').length;

    return { total, published, drafts, featured, totalOrders, newOrders };
  }, [templates, orders]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const q = searchQuery.toLowerCase();
      const cats = Array.isArray(t.categories) && t.categories.length > 0
        ? t.categories
        : (t.category ? [t.category] : []);
      const catNames = cats.map(c => String(getCategoryName(c)).toLowerCase());

      const matchesSearch = 
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        catNames.some(cn => cn.includes(q));

      const matchesCat = categoryFilter === 'All' || cats.some(c => String(c).toLowerCase() === categoryFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [templates, searchQuery, categoryFilter, statusFilter]);

  // Map category ID to clean human-readable name
  const getCategoryName = (id: any) => {
    if (!id) return "Unknown";
    if (typeof id === "object") return id.name || id.id || "Unknown";
    const found = categoriesStorage.getAll().find(c => c.id === id);
    return found ? found.name : id;
  };

  // Actions
  const handleSaveTemplate = async (data: Omit<WebsiteTemplate, 'id' | 'createdAt'>, id?: string): Promise<void> => {
    if (id) {
      await websiteTemplatesStorage.update(id, data);
    } else {
      await websiteTemplatesStorage.create(data);
    }
  };

  const handleDeleteTemplate = (id: string, title: string) => {
    setDeleteTarget({ id, title, type: 'template' });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await websiteTemplatesStorage.toggleStatus(id);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await websiteTemplatesStorage.toggleFeatured(id);
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  const handleUpdateOrderStatus = (id: string, newStatus: TemplateOrder['status']) => {
    websiteTemplatesStorage.updateOrderStatus(id, newStatus);
  };

  const handleDeleteOrder = (id: string) => {
    setDeleteTarget({ id, title: 'template order request record', type: 'order' });
  };

  const handleResetDefaults = () => {
    setDeleteTarget({ id: 'reset', title: 'database and restore default website templates catalog', type: 'reset' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    return new Promise<void>((resolve, reject) => {
      try {
        if (deleteTarget.type === 'template') {
          const success = websiteTemplatesStorage.delete(deleteTarget.id);
          if (!success) throw new Error('Deletion failed');
        } else if (deleteTarget.type === 'order') {
          const success = websiteTemplatesStorage.deleteOrder(deleteTarget.id);
          if (!success) throw new Error('Deletion failed');
        } else if (deleteTarget.type === 'reset') {
          websiteTemplatesStorage.resetToDefault();
        }
        setDeleteTarget(null);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  return (
    <div id="admin-website-templates-dashboard" className="space-y-6 text-left">
      
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E1DA] shadow-sm animate-in fade-in duration-300">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready-to-Launch Templates System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#171A1F]">
            Website Templates CMS
          </h2>
          <p className="text-xs text-[#626873]">
            Manually create and edit template catalog, set prices, assign to business industries, and process purchases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingTemplate(null);
              setIsAddEditModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#ECC348]" />
            <span>Add Template</span>
          </button>

          <button
            onClick={handleResetDefaults}
            title="Reset Catalog to Factory Defaults"
            className="p-2.5 rounded-xl bg-white border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Total Templates</div>
          <div className="text-2xl font-black text-[#171A1F]">{stats.total}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Published Active</div>
          <div className="text-2xl font-black text-emerald-600">{stats.published}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Featured Badge</div>
          <div className="text-2xl font-black text-amber-500">{stats.featured}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <div className="text-xs text-[#626873] font-semibold">Template Orders</div>
          <div className="text-2xl font-black text-[#2563EB]">
            {stats.totalOrders} <span className="text-xs font-normal text-slate-400">({stats.newOrders} new)</span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E1DA] pb-2">
        <button
          onClick={() => setActiveSubTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'catalog'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C79A22]" />
          <span>Templates Directory ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'orders'
              ? 'bg-[#171A1F] text-white shadow-sm'
              : 'bg-white text-[#626873] border border-[#E4E1DA]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <span>Purchase Requests ({orders.length})</span>
          {stats.newOrders > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {stats.newOrders}
            </span>
          )}
        </button>
      </div>

      {/* Subtab 1: Directory */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E4E1DA]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#626873] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F]"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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

          {/* Directory Listing Table */}
          <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
            {filteredTemplates.length === 0 ? (
              <div className="p-12 text-center text-[#626873] space-y-2">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-bold text-sm text-[#171A1F]">No Website Templates Found</div>
                <div className="text-xs">Adjust search filters or add a new website template.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#E4E1DA] text-[#626873] font-bold">
                    <tr>
                      <th className="py-3 px-4">Template</th>
                      <th className="py-3 px-4">Industry Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E1DA]">
                    {filteredTemplates.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-8 rounded object-cover border border-[#E4E1DA] shrink-0 bg-slate-100"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-[#171A1F] truncate max-w-xs">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-[#626873] font-mono">
                                ID: {item.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {(Array.isArray(item.categories) && item.categories.length > 0 ? item.categories : [item.category || 'retail'])
                              .map(catId => (
                                <span key={catId} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-100 whitespace-nowrap">
                                  {getCategoryName(catId)}
                                </span>
                              ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#171A1F]">
                          {item.price}
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              item.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                          >
                            {item.status === 'published' ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleFeatured(item.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              item.isFeatured
                                ? 'bg-amber-50 text-amber-700 border-amber-300'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            {item.isFeatured ? '★ Featured' : '— Standard'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {onViewTemplate && (
                              <button
                                onClick={() => onViewTemplate(item)}
                                className="p-1.5 rounded text-[#626873] hover:text-[#171A1F] hover:bg-slate-100"
                                title="Preview Details Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            {item.demoUrl && (
                              <a
                                href={item.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded text-[#626873] hover:text-[#171A1F] hover:bg-slate-100"
                                title="View Live Demo website"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              onClick={() => {
                                setEditingTemplate(item);
                                setIsAddEditModalOpen(true);
                              }}
                              className="p-1.5 rounded text-[#2563EB] hover:bg-blue-50"
                              title="Edit Template Data"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteTemplate(item.id, item.title)}
                              className="p-1.5 rounded text-rose-500 hover:bg-rose-50"
                              title="Delete Template"
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

      {/* Subtab 2: Orders */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-[#626873] space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="font-bold text-sm text-[#171A1F]">No Template Purchase Orders Yet</div>
                <div className="text-xs">When users click &quot;Buy Template&quot; or request it, they will show up here.</div>
              </div>
            ) : (
              <div className="divide-y divide-[#E4E1DA]">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Header bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {ord.id}
                        </span>
                        <h4 className="font-extrabold text-sm text-[#171A1F]">
                          {ord.templateTitle}
                        </h4>
                        <span className="text-[10px] font-bold text-[#626873] bg-slate-100 px-2 py-0.5 rounded uppercase">
                          {getCategoryName(ord.templateCategory)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#626873]">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            ord.status === 'New'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : ord.status === 'Contacted'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : ord.status === 'In Progress'
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
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Client data */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[#626873] block text-[10px]">Client Name:</span>
                        <strong className="text-[#171A1F]">{ord.fullName}</strong>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Phone Number:</span>
                        <a href={`tel:${ord.mobileNumber}`} className="text-[#2563EB] hover:underline font-bold">
                          {ord.mobileNumber}
                        </a>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Email Address:</span>
                        <a href={`mailto:${ord.email}`} className="text-[#171A1F] hover:underline">
                          {ord.email}
                        </a>
                      </div>

                      <div>
                        <span className="text-[#626873] block text-[10px]">Business Name:</span>
                        <span className="text-[#171A1F] font-semibold">{ord.businessName || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Customer specs / requirements */}
                    {(ord.city || ord.state || ord.fullAddress || ord.additionalRequirements) && (
                      <div className="p-3 rounded-xl bg-slate-50 text-xs text-[#171A1F] space-y-1 border border-[#E4E1DA]">
                        {(ord.city || ord.state || ord.fullAddress) && (
                          <div className="flex items-start gap-1.5 text-[#626873]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>Location: {ord.fullAddress ? `${ord.fullAddress}, ` : ''}{ord.city ? `${ord.city}, ` : ''}{ord.state || ''}</span>
                          </div>
                        )}
                        {ord.additionalRequirements && (
                          <div className="text-[#171A1F]">
                            <strong>Notes / Customization Requests:</strong> {ord.additionalRequirements}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Date and contact buttons */}
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#626873]">
                      <span>Submitted: {new Date(ord.createdAt).toLocaleString()}</span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/91${ord.whatsappNumber || ord.mobileNumber}?text=${encodeURIComponent(
                             `Hello ${ord.fullName}, thank you for choosing the "${ord.templateTitle}" website template from MANI Solution. I am contacting you regarding your request reference ID: ${ord.id}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebd59] text-white font-bold flex items-center gap-1.5 shadow-sm transition-all text-xs"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp Client</span>
                        </a>

                        <a
                          href={`tel:${ord.mobileNumber}`}
                          className="px-3 py-1 rounded-lg bg-[#171A1F] hover:bg-black text-white font-bold flex items-center gap-1.5 transition-all text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Client</span>
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

      {/* Templates CMS Modal Form */}
      <AdminWebsiteTemplateModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
        editingTemplate={editingTemplate}
      />

      {/* Delete/Confirm Dialog */}
      <AdminConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || 'record'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
