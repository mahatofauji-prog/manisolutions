import React, { useState, useEffect } from 'react';
import { seoStorage, subscribeToSeoSettings } from '../../services/seoStorage';
import { PageSeoConfig } from '../../types';
import { 
  Globe, 
  Save, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Eye, 
  ShieldCheck, 
  Sliders, 
  Link, 
  FileText, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export const AdminSeoSettingsDashboard: React.FC<{ onBackToSite?: () => void }> = () => {
  const [seoConfigs, setSeoConfigs] = useState<Record<string, PageSeoConfig>>(() => seoStorage.getAll());
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [activeConfig, setActiveConfig] = useState<PageSeoConfig>(() => seoStorage.getForPage('home'));

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      const all = seoStorage.getAll();
      setSeoConfigs(all);
      if (all[selectedPageId]) {
        setActiveConfig(all[selectedPageId]);
      }
    };
    return subscribeToSeoSettings(handleUpdate);
  }, [selectedPageId]);

  const handleSelectPage = (pageId: string) => {
    setSelectedPageId(pageId);
    setActiveConfig(seoStorage.getForPage(pageId));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await seoStorage.savePageConfig(selectedPageId, activeConfig);
      setToast({ type: 'success', text: `SEO metadata updated successfully for ${activeConfig.pageName}!` });
      setTimeout(() => setToast(null), 4000);
    } catch (e) {
      setToast({ type: 'error', text: 'Failed to update SEO metadata.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all page SEO settings to default configurations?')) {
      await seoStorage.resetToDefaults();
      setToast({ type: 'success', text: 'SEO settings reset to default optimal configurations.' });
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-lg animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E4E1DA] shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engine Optimization & Social Cards CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#171A1F]">SEO & Metadata Management</h2>
          <p className="text-xs text-[#626873]">Configure SEO titles, meta descriptions, canonical URLs, OpenGraph previews and indexing rules.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Page Selector & Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Select Page */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-[#E4E1DA] shadow-sm space-y-3">
          <h3 className="font-extrabold text-xs text-[#171A1F] uppercase tracking-wider px-2">Indexable Pages</h3>
          <div className="space-y-1">
            {(Object.values(seoConfigs) as PageSeoConfig[]).map((cfg: PageSeoConfig) => {
              const isActive = cfg.pageId === selectedPageId;
              return (
                <button
                  key={cfg.pageId}
                  onClick={() => handleSelectPage(cfg.pageId)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive 
                      ? 'bg-[#171A1F] text-white shadow-md' 
                      : 'hover:bg-slate-50 text-[#626873] border border-transparent'
                  }`}
                >
                  <span className="truncate">{cfg.pageName}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    cfg.robotsNoIndex ? 'bg-rose-100 text-rose-800' : (isActive ? 'bg-[#C79A22] text-[#171A1F]' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {cfg.robotsNoIndex ? 'noindex' : 'index'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: SEO Configuration Form */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E4E1DA] shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
            <div>
              <h3 className="text-base font-black text-[#171A1F]">{activeConfig.pageName} SEO Settings</h3>
              <span className="text-xs font-mono text-slate-400">ID: {activeConfig.pageId}</span>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              Live Verified
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            <div>
              <label className="block text-[#626873] font-bold mb-1">SEO Title (30 - 60 chars)</label>
              <input
                type="text"
                required
                value={activeConfig.title}
                onChange={e => setActiveConfig({ ...activeConfig, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] font-medium"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">{activeConfig.title.length} characters</span>
            </div>

            <div>
              <label className="block text-[#626873] font-bold mb-1">Meta Description (120 - 160 chars)</label>
              <textarea
                rows={3}
                required
                value={activeConfig.metaDescription}
                onChange={e => setActiveConfig({ ...activeConfig, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] font-medium"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">{activeConfig.metaDescription.length} characters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#626873] font-bold mb-1">Canonical URL *</label>
                <input
                  type="text"
                  required
                  value={activeConfig.canonicalUrl}
                  onChange={e => setActiveConfig({ ...activeConfig, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[#626873] font-bold mb-1">Primary H1 Heading</label>
                <input
                  type="text"
                  value={activeConfig.h1Heading || ''}
                  onChange={e => setActiveConfig({ ...activeConfig, h1Heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] font-medium"
                />
              </div>
            </div>

            {/* OpenGraph & Social Cards */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-3">
              <h4 className="font-extrabold text-[#171A1F] text-xs">OpenGraph & Social Sharing Card Override</h4>
              
              <div>
                <label className="block text-[#626873] font-bold mb-1">OG Title</label>
                <input
                  type="text"
                  value={activeConfig.ogTitle || activeConfig.title}
                  onChange={e => setActiveConfig({ ...activeConfig, ogTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E1DA]"
                />
              </div>

              <div>
                <label className="block text-[#626873] font-bold mb-1">OG Description</label>
                <input
                  type="text"
                  value={activeConfig.ogDescription || activeConfig.metaDescription}
                  onChange={e => setActiveConfig({ ...activeConfig, ogDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E1DA]"
                />
              </div>

              <div>
                <label className="block text-[#626873] font-bold mb-1">OG Social Image URL</label>
                <input
                  type="text"
                  value={activeConfig.ogImage || 'https://www.manisolution.com/logo.png'}
                  onChange={e => setActiveConfig({ ...activeConfig, ogImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E4E1DA] font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Indexing Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeConfig.robotsNoIndex}
                  onChange={e => setActiveConfig({ ...activeConfig, robotsNoIndex: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="font-bold text-[#171A1F]">Set Robots to Noindex / Nofollow (Hide page from search engines)</span>
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E4E1DA]">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save SEO Metadata'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
