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
  Sliders
} from 'lucide-react';
import { brandLogoStorage, subscribeToBrandLogo, DEFAULT_LOGO_URL, compressImageDataUrl } from '../../services/brandLogoStorage';
import { BrandLogoConfig } from '../../types';
import { ManiLogo } from '../ManiLogo';
import { COMPANY_INFO } from '../../data/companyData';

interface AdminBrandSettingsDashboardProps {
  onBackToSite?: () => void;
}

export const AdminBrandSettingsDashboard: React.FC<AdminBrandSettingsDashboardProps> = ({
  onBackToSite
}) => {
  const [config, setConfig] = useState<BrandLogoConfig>(() => brandLogoStorage.getConfig());
  const [activeLogoUrl, setActiveLogoUrl] = useState<string>(() => brandLogoStorage.getActiveLogoUrl());
  const [isCustom, setIsCustom] = useState<boolean>(() => brandLogoStorage.isCustom());

  // Staged / Pending upload state
  const [stagedLogoUrl, setStagedLogoUrl] = useState<string | null>(null);
  const [stagedFileInfo, setStagedFileInfo] = useState<{
    name: string;
    sizeFormatted: string;
    type: string;
    dimensions?: string;
  } | null>(null);

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
    };

    handleUpdate();
    const unsubscribe = subscribeToBrandLogo(handleUpdate);
    return () => unsubscribe();
  }, []);

  // Format file size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Trigger native mobile gallery / desktop file picker
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format
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
    reader.onload = async (loadEvent) => {
      const rawDataUrl = loadEvent.target?.result as string;
      if (!rawDataUrl) {
        setIsProcessing(false);
        showToast('Failed to load selected image.', 'error');
        return;
      }

      try {
        // Optimize and downscale image to ensure instant live web sync & fit Firestore limits
        const compressedUrl = await compressImageDataUrl(rawDataUrl, 512);
        const approxBytes = Math.round((compressedUrl.length * 3) / 4);

        setStagedFileInfo({
          name: file.name,
          sizeFormatted: formatBytes(approxBytes),
          type: file.type || 'image/png',
          dimensions: '512 × 512 px (Optimized HD)'
        });
        setStagedLogoUrl(compressedUrl);
        setIsProcessing(false);
        showToast('Image optimized! Click "Save Logo" to publish globally.', 'success');
      } catch (err) {
        console.warn('Image optimization warning:', err);
        setStagedLogoUrl(rawDataUrl);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      showToast('Error reading the image file from device storage.', 'error');
    };

    reader.readAsDataURL(file);
  };

  // Cancel pending stage
  const handleCancelStaged = () => {
    setStagedLogoUrl(null);
    setStagedFileInfo(null);
    showToast('Upload preview cancelled.', 'success');
  };

  // Save the staged logo
  const handleSaveLogo = async () => {
    if (!stagedLogoUrl) {
      showToast('No new logo selected to save.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await brandLogoStorage.saveLogo(stagedLogoUrl, {
        fileName: stagedFileInfo?.name || 'brand-logo.png',
        fileSizeFormatted: stagedFileInfo?.sizeFormatted
      });

      setStagedLogoUrl(null);
      setStagedFileInfo(null);
      showToast('Logo saved successfully! Active across the entire website.', 'success');
    } catch (err: any) {
      console.error('Failed to save logo:', err);
      showToast(err?.message || 'Failed to save logo. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove logo and restore default
  const handleRemoveLogo = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove the custom logo? The website will automatically restore the official default MANI Solution logo.'
    );

    if (!confirmed) return;

    try {
      await brandLogoStorage.removeLogo();
      setStagedLogoUrl(null);
      setStagedFileInfo(null);
      showToast('Custom logo removed. Default MANI Solution logo restored.', 'success');
    } catch (err) {
      console.error('Failed to remove logo:', err);
      showToast('Failed to remove custom logo.', 'error');
    }
  };

  const previewDisplayUrl = stagedLogoUrl || activeLogoUrl;

  return (
    <div id="admin-brand-settings-dashboard" className="space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          id="admin-brand-toast"
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
              : 'bg-rose-950 text-rose-200 border-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#171A1F] via-[#21262F] to-[#171A1F] p-6 sm:p-8 rounded-3xl border border-[#C79A22]/30 shadow-xl text-white">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Brand Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            Logo Management & Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Upload, update, or restore the official brand logo. Uploaded logos automatically update across the Header, Footer, Mobile Drawer, and public website cards in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <span className={`font-bold flex items-center gap-1.5 ${isCustom ? 'text-amber-400' : 'text-emerald-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isCustom ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              {isCustom ? 'Custom Active Logo' : 'Default Official Logo'}
            </span>
          </div>

          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all"
            >
              Public Site →
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Logo Management (Left) + Live Multi-Placement Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Logo Management Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E4E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Panel Title */}
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C79A22]/10 border border-[#C79A22]/20 flex items-center justify-center text-[#C79A22]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#171A1F]">
                    Logo Management
                  </h3>
                  <span className="text-[11px] text-[#626873]">
                    PNG (Transparent supported), JPG, JPEG, WebP
                  </span>
                </div>
              </div>

              {/* Background preview switch for transparent logos */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewBg('dark')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    previewBg === 'dark' ? 'bg-[#171A1F] text-white shadow-xs' : 'text-[#626873] hover:text-[#171A1F]'
                  }`}
                  title="Dark Background Preview"
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('light')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    previewBg === 'light' ? 'bg-white text-[#171A1F] shadow-xs' : 'text-[#626873] hover:text-[#171A1F]'
                  }`}
                  title="Light Background Preview"
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewBg('checker')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    previewBg === 'checker' ? 'bg-[#C79A22] text-white shadow-xs' : 'text-[#626873] hover:text-[#171A1F]'
                  }`}
                  title="Grid Checker Transparency Preview"
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Current Active & Stage Comparison Box */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                {stagedLogoUrl ? 'Selected New Logo (Preview Before Saving)' : 'Current Active Website Logo'}
              </label>

              <div className="p-6 rounded-2xl border border-[#E4E1DA] bg-[#F7F6F2] flex flex-col sm:flex-row items-center gap-6">
                
                {/* Logo Display Emblem */}
                <div 
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-white ring-4 ring-[#C79A22]/30 shadow-lg overflow-hidden flex items-center justify-center shrink-0 transition-all ${
                    previewBg === 'dark'
                      ? 'bg-slate-950'
                      : previewBg === 'light'
                      ? 'bg-white'
                      : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:10px_10px] bg-slate-100'
                  }`}
                >
                  <img
                    src={previewDisplayUrl}
                    alt="Active MANI Solution Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Details & Status */}
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                      Logo Status:
                    </span>
                    <span 
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        stagedLogoUrl
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isCustom
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {stagedLogoUrl ? 'Unsaved Staged Logo' : isCustom ? 'Custom Active Logo' : 'Official Default Logo'}
                    </span>
                  </div>

                  <p className="text-xs text-[#626873] leading-relaxed">
                    {stagedFileInfo ? (
                      <>
                        <span className="font-semibold text-[#171A1F]">{stagedFileInfo.name}</span>
                        {stagedFileInfo.dimensions && ` (${stagedFileInfo.dimensions})`}
                        <br />
                        Size: {stagedFileInfo.sizeFormatted}
                      </>
                    ) : isCustom ? (
                      <>
                        Active custom logo stored persistently.
                        <br />
                        {config.fileName && <span className="font-semibold text-[#171A1F]">{config.fileName}</span>}
                        {config.fileSizeFormatted && ` • ${config.fileSizeFormatted}`}
                      </>
                    ) : (
                      <>
                        Official MANI Solution emblem active with circular golden metallic frame.
                      </>
                    )}
                  </p>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

              </div>
            </div>

            {/* Action Buttons: Upload, Save, Cancel, Remove */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Upload New Logo Button */}
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  disabled={isProcessing || isSaving}
                  className="px-5 py-3 rounded-xl bg-[#171A1F] hover:bg-[#282E3A] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 text-[#ECC348]" />
                  <span>{isProcessing ? 'Processing Image...' : stagedLogoUrl ? 'Choose Different Image' : 'Upload New Logo'}</span>
                </button>

                {/* Save Logo Button (Enabled when new logo is staged) */}
                {stagedLogoUrl && (
                  <button
                    type="button"
                    onClick={handleSaveLogo}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C79A22] to-[#ECC348] hover:from-[#B5891E] hover:to-[#DBB238] text-[var(--theme-text-primary)] text-xs sm:text-sm font-extrabold shadow-lg shadow-[#C79A22]/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-[var(--theme-text-primary)]" />
                    <span>{isSaving ? 'Saving Logo...' : 'Save Logo'}</span>
                  </button>
                )}

                {/* Cancel Button */}
                {stagedLogoUrl && (
                  <button
                    type="button"
                    onClick={handleCancelStaged}
                    disabled={isSaving}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs sm:text-sm font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}

                {/* Remove Custom Logo Button (Restores Default) */}
                {isCustom && !stagedLogoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold border border-rose-200 transition-colors flex items-center gap-1.5 ml-auto active:scale-95"
                    title="Remove custom logo and restore official default MANI Solution logo"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Logo</span>
                  </button>
                )}

              </div>

              {/* Upload Tips Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] sm:text-xs text-[#171A1F] space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-[#A67C00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommendation & Compatibility</span>
                </div>
                <p className="text-[#626873] leading-relaxed">
                  For optimal appearance, use a square image (minimum 512×512 px). Transparent PNG or WebP files are automatically framed inside the brand emblem border.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Live Website Multi-Placement Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E4E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171A1F]">
                <Eye className="w-4 h-4 text-[#C79A22]" />
                <span>Live Website Preview</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Auto-Synced
              </span>
            </div>

            <p className="text-xs text-[#626873]">
              The logo automatically renders in all public touchpoints without hardcoding:
            </p>

            {/* 1. Header Navigation Bar Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] block">
                1. Header Navigation Bar (Desktop & Mobile)
              </span>
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-main)] border border-[#E4E1DA] shadow-xs flex items-center justify-between">
                <ManiLogo size="md" />
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-3 text-[11px] text-[#626873] font-medium">
                    <span>Services</span>
                    <span>Solutions</span>
                    <span>About</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#C79A22] text-[var(--theme-text-primary)] text-[10px] font-bold">
                    Demo
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Mobile Drawer Menu Header */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] block">
                2. Mobile Drawer Menu Header
              </span>
              <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E4E1DA] flex items-center justify-between">
                <ManiLogo size="sm" />
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-[#171A1F]">
                  <X className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 3. Footer Branding Placement */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626873] block">
                3. Footer Brand & Mission Card
              </span>
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] space-y-2">
                <ManiLogo size="md" showSubtitle={true} />
                <p className="text-[11px] text-[#626873] leading-relaxed">
                  Empowering Indian enterprises with scalable software, automation, and AI infrastructure.
                </p>
                <div className="pt-2 border-t border-[#E4E1DA] text-[10px] text-[#626873]">
                  Founder: <span className="font-bold text-[#171A1F]">{COMPANY_INFO.founder}</span>
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="pt-3 border-t border-[#E4E1DA] space-y-1.5 text-xs text-[#626873]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero component hardcoding — single unified source of truth</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>IndexedDB + LocalStorage dual persistence across reloads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant fallback to official MANI Solution default emblem</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
