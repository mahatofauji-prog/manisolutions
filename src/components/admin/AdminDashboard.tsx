import React, { useState, useEffect, useMemo } from 'react';
import { SolutionItem, SolutionContentType, SolutionCategory } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { 
  LayoutGrid,
  Plus, 
  Search, 
  Filter, 
  Layers, 
  Smartphone, 
  Globe, 
  Bot, 
  Briefcase, 
  BookOpen, 
  Radio, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  RotateCcw, 
  Key, 
  LogOut, 
  CheckCircle, 
  FileText, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Star,
  X,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onNewPost: () => void;
  onEditPost: (id: string) => void;
  onViewPublic: (slug: string) => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNewPost,
  onEditPost,
  onViewPublic,
  onLogout,
  onNavigateHome
}) => {
  const [items, setItems] = useState<SolutionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Import JSON modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  const loadData = () => {
    setItems(solutionsStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToSolutions(loadData);
    return () => unsubscribe();
  }, []);

  // Filtered list
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSlug = item.slug.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        const inTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!inTitle && !inSlug && !inCat && !inTags) return false;
      }
      return true;
    });
  }, [items, categoryFilter, statusFilter, searchQuery]);

  // Statistics Metrics
  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter(i => i.status === 'published').length;
    const drafts = items.filter(i => i.status === 'draft').length;
    const software = items.filter(i => i.contentType === 'software').length;
    const apps = items.filter(i => i.contentType === 'app').length;
    const websites = items.filter(i => i.contentType === 'website').length;
    const articles = items.filter(i => i.contentType === 'article' || i.contentType === 'case-study').length;
    const featured = items.filter(i => i.isFeatured).length;

    return { total, published, drafts, software, apps, websites, articles, featured };
  }, [items]);

  const handleDelete = async (id: string) => {
    try {
      await solutionsStorage.delete(id);
      setDeleteConfirmId(null);
      alert('Solution deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete solution. Please try again.');
    }
  };

  const handleTogglePublish = (id: string) => {
    solutionsStorage.togglePublish(id);
    loadData();
  };

  const handleToggleFeatured = (id: string) => {
    solutionsStorage.toggleFeatured(id);
    loadData();
  };

  const handleExport = () => {
    const dataStr = solutionsStorage.exportJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mani-solutions-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async () => {
    setImportError('');
    const success = await solutionsStorage.importJSON(importJsonText);
    if (success) {
      setShowImportModal(false);
      setImportJsonText('');
      loadData();
    } else {
      setImportError('Invalid JSON structure. Please check the backup file format.');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Are you sure you want to reset all content to default seed data? Any unsaved custom posts will be overwritten.')) {
      await solutionsStorage.resetToDefaults();
      loadData();
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }
    solutionsStorage.updateAdminPassword(newPassword);
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setShowPasswordModal(false);
      setNewPassword('');
    }, 1500);
  };

  return (
    <div id="admin-dashboard-container" className="space-y-8">
      
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
            Content & Solutions Management System
          </h1>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="admin-create-new-btn"
            onClick={onNewPost}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Post / Project
          </button>

          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#626873] hover:text-[#171A1F] transition-all text-xs flex items-center gap-1"
            title="Export JSON Backup"
          >
            <Download className="w-4 h-4" /> Backup
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#626873] hover:text-[#171A1F] transition-all text-xs flex items-center gap-1"
            title="Import JSON"
          >
            <Upload className="w-4 h-4" /> Import
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#626873] hover:text-[#171A1F] transition-all text-xs flex items-center gap-1"
            title="Change Security Password"
          >
            <Key className="w-4 h-4" /> Password
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all text-xs flex items-center gap-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] uppercase font-semibold">Total Solutions</span>
          <p className="text-2xl font-extrabold text-[#171A1F]">{stats.total}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[11px] text-emerald-600 uppercase font-semibold">Published</span>
          <p className="text-2xl font-extrabold text-emerald-600">{stats.published}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
          <span className="text-[11px] text-amber-600 uppercase font-semibold">Drafts</span>
          <p className="text-2xl font-extrabold text-amber-600">{stats.drafts}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] uppercase font-semibold">Software</span>
          <p className="text-2xl font-extrabold text-[#171A1F]">{stats.software}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] uppercase font-semibold">Apps</span>
          <p className="text-2xl font-extrabold text-[#171A1F]">{stats.apps}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] uppercase font-semibold">Websites</span>
          <p className="text-2xl font-extrabold text-[#171A1F]">{stats.websites}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#C79A22] uppercase font-semibold">Featured</span>
          <p className="text-2xl font-extrabold text-[#C79A22]">{stats.featured}</p>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f172a]/90 ">
        
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, slug, category, tag..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80  text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200  text-[#171A1F] text-xs focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Status</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200  text-[#171A1F] text-xs focus:outline-none focus:border-[#2563EB]"
          >
            <option value="All">All Categories</option>
            <option value="Software">Software</option>
            <option value="Apps">Apps</option>
            <option value="Websites">Websites</option>
            <option value="AI Solutions">AI Solutions</option>
            <option value="Business Solutions">Business Solutions</option>
            <option value="Case Studies">Case Studies</option>
            <option value="Technology">Technology</option>
            <option value="Updates">Updates</option>
          </select>

          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-[#334155]  text-slate-400 hover:text-[#171A1F] text-xs"
            title="Reset to sample seed data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Content Management Table */}
      <div className="rounded-2xl bg-[#0f172a]/90  overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#626873]">
            <thead className="bg-slate-50 border-b border-[#E4E1DA] uppercase font-semibold text-slate-400 text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Content / Title</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Featured</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 border border-slate-200/40 transition-colors">
                  
                  {/* Title & Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-12 h-9 object-cover rounded-lg bg-slate-100  flex-shrink-0"
                      />
                      <div className="space-y-0.5 max-w-xs sm:max-w-sm">
                        <span className="font-bold text-white block truncate hover:text-[#C79A22]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate block">
                          /solutions/{item.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-[#626873] capitalize">
                      {item.contentType.replace('-', ' ')}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3 text-[#626873] font-medium">
                    {item.category}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleTogglePublish(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        item.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25'
                      }`}
                    >
                      ● {item.status}
                    </button>
                  </td>

                  {/* Featured Toggle Star */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        item.isFeatured
                          ? 'bg-[#C79A22]/20 border-[#C79A22] text-[#C79A22]'
                          : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#626873]'
                      }`}
                      title={item.isFeatured ? 'Featured on Homepage' : 'Mark as Featured'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {new Date(item.projectDate || item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {item.status === 'published' && (
                        <button
                          onClick={() => onViewPublic(item.slug)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        id={`edit-item-${item.slug}`}
                        onClick={() => onEditPost(item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="py-16 text-center bg-white border-t border-[#E4E1DA] space-y-3">
              <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-[#171A1F]">No content items found matching your filters.</h3>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setStatusFilter('all'); }}
                className="text-xs text-[#C79A22] underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E4E1DA] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full space-y-5 text-[#171A1F]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-[#171A1F]">
                  Delete this project?
                </h3>
                <p className="text-xs sm:text-sm text-[#626873]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {(() => {
              const target = items.find(i => i.id === deleteConfirmId);
              return target ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Project:</div>
                  <div className="font-bold text-sm text-[#171A1F]">{target.title}</div>
                  <div className="text-[11px] text-slate-500">Category: {target.category}</div>
                </div>
              ) : null;
            })()}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E1DA] rounded-2xl p-6 shadow-xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171A1F]">Update Security Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-[#171A1F]">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {passwordSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-500/30 text-emerald-600 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Password updated successfully!
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#626873]">New Administrative Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200  text-[#171A1F] text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#626873] text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#C79A22] text-white font-bold text-xs"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E1DA] rounded-2xl p-6 shadow-xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#171A1F]">Import Solutions Backup (JSON)</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-[#171A1F]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {importError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-[#626873]">Paste JSON Content</label>
              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="[ { title: '...', slug: '...' } ]"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200  text-[#171A1F] font-mono text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[#626873] text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-xl bg-[#C79A22] text-white font-bold text-xs"
              >
                Restore Content
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
