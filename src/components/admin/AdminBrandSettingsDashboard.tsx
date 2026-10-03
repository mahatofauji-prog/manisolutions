import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  ShieldCheck,
  Smartphone,
  Layers,
  FileImage,
  Sliders,
  Globe,
  Search,
  ExternalLink,
  Edit
} from 'lucide-react';
import { brandLogoStorage, subscribeToBrandLogo, DEFAULT_LOGO_URL, compressImageDataUrl } from '../../services/brandLogoStorage';
import { seoStorage, subscribeToSeoSettings } from '../../services/seoStorage';
import { BrandLogoConfig, PageSeoConfig } from '../../types';
import { ManiLogo } from '../ManiLogo';
import { COMPANY_INFO } from '../../data/companyData';

interface AdminBrandSettingsDashboardProps {
  onBackToSite?: () => void;
}

export const AdminBrandSettingsDashboard: React.FC<AdminBrandSettingsDashboardProps> = ({
  onBackToSite
}) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'seo'>('seo');

  // Logo state
  const [config, setConfig] = useState<BrandLogoConfig>(() => brandLogoStorage.getConfig());
  const [activeLogoUrl, setActiveLogoUrl] = useState<string>(() => brandLogoStorage.getActiveLogoUrl());
  const [isCustom, setIsCustom] = useState<boolean>(() => brandLogoStorage.isCustom());

  // Staged logo upload state
  const [stagedLogoUrl, setStagedLogoUrl] = useState<string | null>(null);
  const [stagedFileInfo, setStagedFileInfo] = useState<{
    name: string;
    sizeFormatted: string;
    type: string;
    dimensions?: string;
  } | null>(null);

  // SEO state
  const [seoConfigs, setSeoConfigs] = useState<PageSeoConfig[]>(() => Object.values(seoStorage.getAll()));
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [editingSeo, setEditingSeo] = useState<PageSeoConfig>(() => seoStorage.getForPage('home'));

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewBg, setPreviewBg] = useState<'dark' | 'light' | 'checker'>('dark');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const handleUpdate = () => {
      const conf = brandLogoStorage.getConfig();
      setConfig(conf);
      setActiveLogoUrl(brandLogoStorage.getActiveLogoUrl());
      setIsCustom(brandLogoStorage.isCustom());

      const seos = Object.values(seoStorage.getAll());
      setSeoConfigs(seos);
    };

    handleUpdate();
    const unsubLogo = subscribeToBrandLogo(handleUpdate);
    const unsubSeo = subscribeToSeoSettings(handleUpdate);
    return () => {
      unsubLogo();
      unsubSeo();
    };
  }, []);

  useEffect(() => {
    setEditingSeo(seoStorage.getForPage(selectedPageId));
  }, [selectedPageId]);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await seoStorage.savePageConfig(editingSeo.pageId, editingSeo);
      showToast(`Saved SEO settings for ${editingSeo.pageName}!`, 'success');
    } catch {
      showToast('Failed to save SEO settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const isValidExt = /\.(png|jpg|jpeg|webp)$/i.test(fileName);
    const isValidType = validExtensions.includes(file.type.toLowerCase()) || isValidExt;

    if (!isValidType) {
      showToast('Please select a valid image file (PNG, JPG, JPEG, or WebP).', 'error');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setIsProcessing(false);
        showToast('Failed to read image file.', 'error');
        return;
      }

      const img = new Image();
      img.onload = async () => {
        try {
          const compressedUrl = await compressImageDataUrl(dataUrl, 800);
          setStagedLogoUrl(compressedUrl);
          setStagedFileInfo({
            name: file.name,
            sizeFormatted: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type || 'image/png',
            dimensions: `${img.width} × ${img.height} px`
          });
          showToast('Image uploaded & staged. Click "Save Changes" to publish.', 'success');
        } catch {
          showToast('Image processing error.', 'error');
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    if (!stagedLogoUrl) return;
    setIsSaving(true);
    try {
      await brandLogoStorage.saveLogo(stagedLogoUrl, { fileName: stagedFileInfo?.name });
      setStagedLogoUrl(null);
      setStagedFileInfo(null);
      showToast('Brand logo updated and published site-wide!', 'success');
    } catch {
      showToast('Failed to save brand logo.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetLogo = async () => {
    if (!window.confirm('Restore default official MANI Solution logo?')) return;
    try {
      await brandLogoStorage.removeLogo();
      setStagedLogoUrl(null);
      setStagedFileInfo(null);
      showToast('Restored default MANI Solution logo.', 'success');
    } catch {
      showToast('Failed to remove logo.', 'error');
    }
  };

  const previewDisplayUrl = stagedLogoUrl || activeLogoUrl;

  return (
    <div id="admin-brand-settings-dashboard" className="space-y-8 animate-fadeIn text-left">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-800' : 'bg-rose-950 text-rose-200 border-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#171A1F] via-[#21262F] to-[#171A1F] p-6 sm:p-8 rounded-3xl border border-[#C79A22]/30 shadow-xl text-white">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Brand & SEO CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            SEO & Brand Identity Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Configure website meta titles, meta descriptions, canonical URLs, OpenGraph cards, search engine indexing, and custom brand logo.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Subtabs: SEO vs Logo */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#E4E1DA] shadow-sm max-w-md">
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'seo' ? 'bg-[#171A1F] text-white shadow' : 'text-[#626873] hover:text-[#171A1F]'
          }`}
        >
          <Search className="w-4 h-4 text-[#C79A22]" />
          <span>SEO & Search Metadata</span>
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'logo' ? 'bg-[#171A1F] text-white shadow' : 'text-[#626873] hover:text-[#171A1F]'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#C79A22]" />
          <span>Brand Logo & Emblem</span>
        </button>
      </div>

      {/* TAB 1: SEO & SEARCH ENGINE METADATA */}
      {activeTab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Page Selector */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-[#171A1F] border-b border-[#E4E1DA] pb-3">
              Select Page to Optimize
            </h3>
            <div className="space-y-2">
              {seoConfigs.map(cfg => {
                const isSelected = cfg.pageId === selectedPageId;
                return (
                  <button
                    key={cfg.pageId}
                    onClick={() => setSelectedPageId(cfg.pageId)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/60 border-[#C79A22] text-[#171A1F] shadow-sm font-extrabold'
                        : 'bg-slate-50/50 border-[#E4E1DA] text-[#626873] hover:bg-slate-100/70 font-semibold'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{cfg.pageName}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{cfg.canonicalUrl}</div>
                    </div>
                    {cfg.robotsNoIndex && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold shrink-0">
                        NoIndex
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: SEO Editor Form & Search Snippet Preview */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live Search Engine Snippet Preview Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C79A22] uppercase tracking-wider">
                <Search className="w-3.5 h-3.5" />
                <span>Google Search Result Preview</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1 font-sans">
                <div className="text-xs text-emerald-800 font-mono truncate">
                  {editingSeo.canonicalUrl || 'https://www.manisolution.com/'}
                </div>
                <div className="text-base sm:text-lg font-bold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                  {editingSeo.title || 'Page Title Placeholder'}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {editingSeo.metaDescription || 'Page meta description placeholder.'}
                </div>
              </div>
            </div>

            {/* SEO Form */}
            <form onSubmit={handleSaveSeo} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E4E1DA] shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
                <h3 className="font-extrabold text-sm text-[#171A1F]">
                  Editing SEO: {editingSeo.pageName}
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {editingSeo.pageId}
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#171A1F] mb-1">
                  SEO Title Tag (`&lt;title&gt;`) *
                </label>
                <input
                  type="text"
                  required
                  value={editingSeo.title}
                  onChange={e => setEditingSeo({ ...editingSeo, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] font-medium focus:ring-2 focus:ring-[#C79A22]/50 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Recommended: 30-60 characters. Current: {editingSeo.title.length} characters.
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#171A1F] mb-1">
                  Meta Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingSeo.metaDescription}
                  onChange={e => setEditingSeo({ ...editingSeo, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] font-medium focus:ring-2 focus:ring-[#C79A22]/50 text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Recommended: 120-160 characters. Current: {editingSeo.metaDescription.length} characters.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171A1F] mb-1">
                    Canonical URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingSeo.canonicalUrl}
                    onChange={e => setEditingSeo({ ...editingSeo, canonicalUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171A1F] mb-1">
                    Primary H1 Heading Override
                  </label>
                  <input
                    type="text"
                    value={editingSeo.h1Heading || ''}
                    onChange={e => setEditingSeo({ ...editingSeo, h1Heading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="border-t border-[#E4E1DA] pt-4 space-y-4">
                <div className="font-extrabold text-xs text-[#171A1F]">OpenGraph Social Share Settings</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#626873] mb-1">OG Title</label>
                    <input
                      type="text"
                      value={editingSeo.ogTitle}
                      onChange={e => setEditingSeo({ ...editingSeo, ogTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#626873] mb-1">OG Image URL</label>
                    <input
                      type="text"
                      value={editingSeo.ogImage}
                      onChange={e => setEditingSeo({ ...editingSeo, ogImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#626873] mb-1">OG Description</label>
                  <textarea
                    rows={2}
                    value={editingSeo.ogDescription}
                    onChange={e => setEditingSeo({ ...editingSeo, ogDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-[#E4E1DA] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSeo.robotsNoIndex}
                    onChange={e => setEditingSeo({ ...editingSeo, robotsNoIndex: e.target.checked })}
                    className="rounded text-[#C79A22] focus:ring-[#C79A22]"
                  />
                  <span className="font-bold text-[#171A1F]">Block Search Engines (`noindex, nofollow`)</span>
                </label>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] font-black text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving SEO Config...' : 'Save Page SEO Config'}</span>
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

      {/* TAB 2: LOGO MANAGEMENT */}
      {activeTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#E4E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#171A1F] font-sans">
                  Official Brand Emblem
                </h3>
                <p className="text-xs text-[#626873]">
                  Recommended format: Transparent PNG or WebP. Optimal dimensions: 512 × 512 px or square aspect ratio.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-[#E4E1DA] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E4E1DA] p-3 shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={previewDisplayUrl}
                      alt="Active Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#171A1F]">
                      {isCustom ? (stagedFileInfo?.name || 'Custom Uploaded Emblem') : 'Default Official Emblem'}
                    </div>
                    <div className="text-[10px] text-[#626873] mt-0.5">
                      {stagedFileInfo?.dimensions || '512 × 512 px'} · {stagedFileInfo?.sizeFormatted || 'Standard SVG/PNG'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C79A22]" />
                    <span>Upload Logo</span>
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                      title="Restore Default Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {stagedLogoUrl && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="text-xs font-bold text-amber-900">
                    Staged New Logo — Click "Save Changes" to publish.
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveLogo}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] font-extrabold text-xs shadow flex items-center gap-1.5 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E4E1DA] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-[#171A1F] border-b border-[#E4E1DA] pb-3">
                Placement Preview
              </h3>
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <ManiLogo size="md" />
                <div className="text-[10px] text-slate-400">Header & Mobile Navigation Display</div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
