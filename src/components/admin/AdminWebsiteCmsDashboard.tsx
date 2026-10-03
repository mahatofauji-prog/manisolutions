import React, { useState, useEffect } from 'react';
import { 
  websiteCmsStorage, 
  subscribeToWebsiteCms, 
  WebsiteSectionConfig 
} from '../../services/websiteCmsStorage';
import { 
  Globe, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface AdminWebsiteCmsDashboardProps {
  onBackToSite: () => void;
}

export const AdminWebsiteCmsDashboard: React.FC<AdminWebsiteCmsDashboardProps> = ({ onBackToSite }) => {
  const [sections, setSections] = useState<WebsiteSectionConfig[]>(websiteCmsStorage.getAll());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setSections(websiteCmsStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToWebsiteCms(loadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = async (sectionId: string, currentStatus: boolean, name: string) => {
    await websiteCmsStorage.toggleVisibility(sectionId);
    showToast(`'${name}' is now ${!currentStatus ? 'VISIBLE' : 'HIDDEN'} on the public website.`);
  };

  const handleResetAll = async () => {
    if (window.confirm('Enable all sections to be visible on the public website?')) {
      await websiteCmsStorage.resetAllToVisible();
      showToast('All website sections are now visible.');
    }
  };

  const filteredSections = sections.filter(s => {
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const visibleCount = sections.filter(s => s.isVisible).length;
  const hiddenCount = sections.filter(s => !s.isVisible).length;

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
              Website CMS (Section Visibility)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
              Single Source of Truth
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Control the live visibility of existing sections on the Public Website. Hiding a section safely conceals it without deleting any underlying data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToSite}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E1DA] text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={handleResetAll}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Enable all sections"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Visible</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] font-semibold block">Configured Website Sections</span>
          <span className="text-2xl font-black text-[#171A1F]">{sections.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-emerald-700 font-semibold block">Live Visible Sections</span>
          <span className="text-2xl font-black text-emerald-600">{visibleCount}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-amber-700 font-semibold block">Hidden from Public</span>
          <span className="text-2xl font-black text-amber-600">{hiddenCount}</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search section by name, keyword or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none font-semibold text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Core">Core</option>
            <option value="Solutions">Solutions</option>
            <option value="Showcase">Showcase</option>
            <option value="Conversion">Conversion</option>
            <option value="Company">Company</option>
          </select>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              sec.isVisible ? 'hover:bg-slate-50/60' : 'bg-slate-50/40 opacity-75'
            }`}
          >
            <div className="space-y-1 flex-grow">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500">#{sec.id}</span>
                <span className="text-sm font-bold text-[#171A1F]">{sec.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {sec.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  sec.isVisible 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {sec.isVisible ? '✓ Visible on Website' : '✕ Hidden on Website'}
                </span>
              </div>
              <p className="text-xs text-[#626873] leading-relaxed max-w-2xl">
                {sec.description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggle(sec.id, sec.isVisible, sec.name)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  sec.isVisible
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {sec.isVisible ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Section</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show Section</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
