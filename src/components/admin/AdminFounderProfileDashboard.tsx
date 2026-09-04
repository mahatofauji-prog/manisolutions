import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Upload, 
  Trash2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Camera,
  Eye,
  ShieldCheck,
  Building
} from 'lucide-react';
import { founderProfileStorage, subscribeToFounderProfile } from '../../services/founderProfileStorage';
import { FounderProfile } from '../../types';

interface AdminFounderProfileDashboardProps {
  onBackToSite?: () => void;
}

export const AdminFounderProfileDashboard: React.FC<AdminFounderProfileDashboardProps> = ({
  onBackToSite
}) => {
  const [profile, setProfile] = useState<FounderProfile>(() => founderProfileStorage.get());
  const [name, setName] = useState(profile.name);
  const [designation, setDesignation] = useState(profile.designation);
  const [bio, setBio] = useState(profile.bio || '');
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewError, setPreviewError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const handleUpdate = () => {
      const current = founderProfileStorage.get();
      setProfile(current);
      setName(current.name);
      setDesignation(current.designation);
      setBio(current.bio || '');
      setPhotoUrl(current.photoUrl);
      setPreviewError(false);
    };

    handleUpdate();
    const unsubscribe = subscribeToFounderProfile(handleUpdate);
    return () => unsubscribe();
  }, []);

  // Trigger file picker for photo upload
  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Process and optimize image file upload (JPG, JPEG, PNG, WEBP)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const isValidExt = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
    const isValidType = validExtensions.includes(file.type.toLowerCase()) || isValidExt;

    if (!isValidType) {
      showToast('Invalid format. Please select a JPG, JPEG, PNG, or WEBP photo.', 'error');
      return;
    }

    setIsUploading(true);
    setPreviewError(false);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const rawResult = uploadEvent.target?.result as string;
      if (!rawResult) {
        setIsUploading(false);
        showToast('Failed to read image file.', 'error');
        return;
      }

      // Optimize image via HTML5 Canvas for optimal avatar resolution & storage
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 800; // Optimal square resolution for crisp profile display
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            setPhotoUrl(rawResult);
            setIsUploading(false);
            showToast('Photo selected successfully.', 'success');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
          setPhotoUrl(optimizedDataUrl);
          setIsUploading(false);
          showToast('Photo uploaded and ready to save.', 'success');
        } catch {
          setPhotoUrl(rawResult);
          setIsUploading(false);
          showToast('Photo loaded successfully.', 'success');
        }
      };

      img.onerror = () => {
        setIsUploading(false);
        showToast('Could not parse image. Please try another file.', 'error');
      };

      img.src = rawResult;
    };

    reader.onerror = () => {
      setIsUploading(false);
      showToast('Error reading image file.', 'error');
    };

    reader.readAsDataURL(file);
  };

  // Remove photo and restore fallback placeholder
  const handleRemovePhoto = () => {
    setPhotoUrl('');
    setPreviewError(false);
    showToast('Photo removed. Default professional placeholder will be shown.', 'success');
  };

  // Save all profile changes
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      showToast('Founder name cannot be empty.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await founderProfileStorage.save({
        name: name.trim(),
        designation: designation.trim() || 'FOUNDER & LEAD TECHNOLOGIST',
        bio: bio.trim(),
        photoUrl: photoUrl || ''
      });

      showToast('Founder Profile updated successfully! Changes are live across the website.', 'success');
    } catch {
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default seed data
  const handleResetDefaults = async () => {
    if (window.confirm('Reset founder profile to default settings?')) {
      const reset = await founderProfileStorage.resetToDefault();
      setName(reset.name);
      setDesignation(reset.designation);
      setBio(reset.bio || '');
      setPhotoUrl(reset.photoUrl);
      setPreviewError(false);
      showToast('Founder profile reset to defaults.', 'success');
    }
  };

  const hasPhoto = Boolean(photoUrl && photoUrl.trim().length > 0);

  return (
    <div id="admin-founder-profile-dashboard" className="space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          id="admin-profile-toast"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold border transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
              : 'bg-rose-950 text-rose-200 border-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#171A1F] via-[#21262F] to-[#171A1F] p-6 sm:p-8 rounded-3xl border border-[#C79A22]/30 shadow-xl text-white">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Leadership & Brand Identity
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
            Founder Profile & Photo
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Manage the founder's public photo, name, and designation displayed on the website's About section and leadership cards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reset to default details"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

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

      {/* Main Grid: Edit Form (Left) + Live Public Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Management Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-[#E4E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#171A1F]">
                <User className="w-4 h-4 text-[#C79A22]" />
                <span>Founder Information & Photo</span>
              </div>
              <span className="text-[11px] text-[#626873] font-medium">Single Source of Truth</span>
            </div>

            {/* Founder Profile Photo Uploader */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                Founder Profile Photo <span className="text-[#C79A22]">*</span>
              </label>

              <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-[#E4E1DA] flex flex-col sm:flex-row items-center gap-6">
                
                {/* Photo Display Avatar */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white ring-4 ring-[#C79A22]/30 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center">
                    {hasPhoto && !previewError ? (
                      <img
                        src={photoUrl}
                        alt="Founder preview"
                        onError={() => setPreviewError(true)}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200 text-[#171A1F]">
                        <User className="w-12 h-12 text-[#C79A22]/80 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Quick Change floating overlay icon */}
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-[#171A1F] text-white hover:bg-[#C79A22] shadow-md border-2 border-white transition-all transform hover:scale-105"
                    title="Upload or Replace Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Upload & Remove Action Controls */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <div className="text-sm font-bold text-[#171A1F]">
                      {hasPhoto ? 'Custom Photo Active' : 'Default Placeholder Active'}
                    </div>
                    <p className="text-xs text-[#626873] mt-0.5">
                      Supports JPG, JPEG, PNG, or WEBP. Automatically optimized for web display.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={handleTriggerUpload}
                      disabled={isUploading}
                      className="px-4 py-2 rounded-xl bg-[#171A1F] hover:bg-[#21262F] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#ECC348]" />
                      <span>{isUploading ? 'Processing...' : hasPhoto ? 'Replace Photo' : 'Upload Photo'}</span>
                    </button>

                    {hasPhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Founder Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="founder-name-input" className="block text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                Founder Name <span className="text-[#C79A22]">*</span>
              </label>
              <input
                id="founder-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mr. Hariom Mahato"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E4E1DA] bg-[#F7F6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A22]/50 text-sm font-semibold text-[#171A1F] transition-all"
              />
              <p className="text-[11px] text-[#626873]">
                Full formal name displayed on the founder profile card.
              </p>
            </div>

            {/* Founder Designation Input */}
            <div className="space-y-1.5">
              <label htmlFor="founder-designation-input" className="block text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                Designation / Title <span className="text-[#C79A22]">*</span>
              </label>
              <input
                id="founder-designation-input"
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. FOUNDER & LEAD TECHNOLOGIST"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E4E1DA] bg-[#F7F6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A22]/50 text-sm font-semibold text-[#171A1F] transition-all"
              />
              <p className="text-[11px] text-[#626873]">
                Official leadership role (defaults to FOUNDER & LEAD TECHNOLOGIST).
              </p>
            </div>

            {/* Founder Bio / Vision Description */}
            <div className="space-y-1.5">
              <label htmlFor="founder-bio-input" className="block text-xs font-extrabold uppercase tracking-wider text-[#171A1F]">
                Vision Statement / Brief Narrative
              </label>
              <textarea
                id="founder-bio-input"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure."
                className="w-full px-4 py-3 rounded-xl border border-[#E4E1DA] bg-[#F7F6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C79A22]/50 text-xs sm:text-sm text-[#171A1F] leading-relaxed transition-all resize-none"
              />
            </div>

            {/* Form Save Actions */}
            <div className="pt-4 border-t border-[#E4E1DA] flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#171A1F] to-[#21262F] hover:from-[#000] hover:to-[#171A1F] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-black/10 transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#ECC348]" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Live Website Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E4E1DA] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#171A1F]">
                <Eye className="w-4 h-4 text-[#C79A22]" />
                <span>Live Website Preview</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Real-time
              </span>
            </div>

            <p className="text-xs text-[#626873]">
              Here is how the Founder card appears on the public website (About Section):
            </p>

            {/* Public Card Mockup */}
            <div className="p-5 rounded-2xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-left space-y-3.5 shadow-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                
                {/* 2x Larger Circular Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-white ring-4 ring-[#C79A22]/20 shadow-lg overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                  {hasPhoto && !previewError ? (
                    <img
                      src={photoUrl}
                      alt={name || 'Mr. Hariom Mahato'}
                      onError={() => setPreviewError(true)}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200 text-[#171A1F]">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#C79A22]/80 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C79A22] font-bold block">
                    {designation || 'FOUNDER & LEAD TECHNOLOGIST'}
                  </span>
                  <h4 className="text-base sm:text-lg font-extrabold text-[#171A1F] font-sans tracking-tight">
                    {name || 'Mr. Hariom Mahato'}
                  </h4>
                  <p className="text-xs text-[#626873] leading-relaxed pt-0.5">
                    {bio || 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Feature Checklist */}
            <div className="space-y-2 pt-2 text-xs text-[#626873]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Responsive display sizes on mobile (80–100px) & desktop (96–120px)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Persistent storage across sessions & reloads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Automatic fallback to default professional placeholder</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
