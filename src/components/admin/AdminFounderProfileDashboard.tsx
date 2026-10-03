import React, { useState, useEffect, useRef } from 'react';
import { 
  founderProfileStorage, 
  subscribeToFounderProfile 
} from '../../services/founderProfileStorage';
import { LeadershipProfile, LeadershipRole } from '../../types';
import { HARIOM_MAHATO_PHOTO, DEFAULT_FOUNDER_PHOTO } from '../../assets/founderImage';
import { 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle2, 
  Linkedin, 
  Mail, 
  Upload, 
  Image as ImageIcon, 
  Star,
  AlertCircle,
  X
} from 'lucide-react';

interface AdminFounderProfileDashboardProps {
  onBackToSite?: () => void;
}

export const AdminFounderProfileDashboard: React.FC<AdminFounderProfileDashboardProps> = () => {
  const [profiles, setProfiles] = useState<LeadershipProfile[]>(() => founderProfileStorage.getAllLeadership());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<LeadershipProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<LeadershipRole>('Founder');
  const [photoUrl, setPhotoUrl] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [fullBio, setFullBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [email, setEmail] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isPublished, setIsPublished] = useState(true);

  // Photo Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);

  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadData = () => {
    setProfiles(founderProfileStorage.getAllLeadership());
  };

  useEffect(() => {
    reloadData();
    const unsub = subscribeToFounderProfile(reloadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = (defaultRole: LeadershipRole = 'Co-Founder') => {
    setEditingProfile(null);
    setName('');
    setDesignation(defaultRole === 'Co-Founder' ? 'Co-Founder & Operations Lead' : '');
    setRole(defaultRole);
    setPhotoUrl('/images/founder.jpg');
    setShortBio('');
    setFullBio('');
    setLinkedin('');
    setEmail('');
    setDisplayOrder(profiles.length + 1);
    setIsPublished(true);
    setFormError('');
    setPhotoUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: LeadershipProfile) => {
    setEditingProfile(p);
    setName(p.name);
    setDesignation(p.designation);
    setRole(p.role);
    setPhotoUrl(p.photoUrl && p.photoUrl.trim() !== '' ? p.photoUrl : (p.role === 'Founder' ? HARIOM_MAHATO_PHOTO : DEFAULT_FOUNDER_PHOTO));
    setShortBio(p.shortBio || '');
    setFullBio(p.fullBio || '');
    setLinkedin(p.socialLinks?.linkedin || '');
    setEmail(p.socialLinks?.email || '');
    setDisplayOrder(p.displayOrder || 1);
    setIsPublished(p.isPublished);
    setFormError('');
    setPhotoUploadError(null);
    setIsModalOpen(true);
  };

  // Gallery Photo Upload Handler (Mobile & Desktop)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoUploadError('Image size should be less than 8MB.');
      return;
    }

    setIsProcessingPhoto(true);
    setPhotoUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // High quality scale & compression (max 800x800)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 800;
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

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
          setPhotoUrl(compressedDataUrl);
        } else {
          setPhotoUrl(event.target?.result as string);
        }
        setIsProcessingPhoto(false);
      };
      img.onerror = () => {
        setPhotoUploadError('Could not process this image file.');
        setIsProcessingPhoto(false);
      };
    };
    reader.onerror = () => {
      setPhotoUploadError('Failed to read photo from your device.');
      setIsProcessingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setFormError('Name and designation are required.');
      return;
    }

    await founderProfileStorage.saveLeadershipProfile({
      name: name.trim(),
      designation: designation.trim(),
      role,
      photoUrl: photoUrl.trim() || '/images/founder.jpg',
      shortBio: shortBio.trim(),
      fullBio: fullBio.trim() || undefined,
      socialLinks: {
        linkedin: linkedin.trim() || undefined,
        email: email.trim() || undefined
      },
      displayOrder: Number(displayOrder) || 1,
      isPublished
    }, editingProfile ? editingProfile.id : undefined);

    setIsModalOpen(false);
    reloadData();
    showToast(`${name.trim()} profile saved successfully!`);
  };

  const handleDelete = async (id: string, profileName: string) => {
    if (window.confirm(`Are you sure you want to remove ${profileName}?`)) {
      await founderProfileStorage.deleteLeadershipProfile(id);
      reloadData();
      showToast(`${profileName} profile removed.`);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean, profileName: string) => {
    await founderProfileStorage.toggleLeadershipPublished(id);
    reloadData();
    showToast(`${profileName} is now ${!currentStatus ? 'PUBLISHED' : 'HIDDEN'} on the public site`);
  };

  const founderItem = profiles.find(p => p.role === 'Founder');
  const coFounderItem = profiles.find(p => p.role === 'Co-Founder');
  const otherLeaders = profiles.filter(p => p.role !== 'Founder' && p.role !== 'Co-Founder');

  return (
    <div className="space-y-8 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              Founder & <span className="text-gold-gradient">Co-Founder CMS</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              Single Source of Truth
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Manage Founder, Co-Founder, and Leadership profiles, photos (upload from mobile gallery), and public credentials shown on the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!coFounderItem && (
            <button
              onClick={() => handleOpenAddModal('Co-Founder')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C79A22]" />
              <span>Add Co-Founder</span>
            </button>
          )}
          <button
            onClick={() => handleOpenAddModal('Leadership')}
            className="px-4 py-2 rounded-xl bg-[#C79A22] text-[#171A1F] text-xs font-bold hover:bg-[#d8a82a] transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leader / Team</span>
          </button>
        </div>
      </div>

      {/* Primary Leadership Cards: Founder & Co-Founder Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#C79A22]">
          Executive Leadership (Founder & Co-Founder)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Founder Card */}
          {founderItem && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/20 to-white border-2 border-[#C79A22]/40 shadow-md relative group space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  {/* Photo with Gold Accent */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#C79A22] shadow-lg shrink-0 bg-slate-100 flex items-center justify-center">
                    <img
                      src={founderItem.photoUrl && founderItem.photoUrl.trim() !== '' ? founderItem.photoUrl : HARIOM_MAHATO_PHOTO}
                      alt={founderItem.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = HARIOM_MAHATO_PHOTO;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-[#C79A22] text-[#171A1F] p-1 rounded-full shadow" title="Founder">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      FOUNDER
                    </span>
                    <h3 className="text-lg font-black text-[#171A1F]">
                      {founderItem.name}
                    </h3>
                    <p className="text-xs font-bold text-[#C79A22]">
                      {founderItem.designation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(founderItem.id, founderItem.isPublished, founderItem.name)}
                    className={`p-2 rounded-xl transition-colors ${
                      founderItem.isPublished ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                    }`}
                    title={founderItem.isPublished ? 'Published on website' : 'Hidden from website'}
                  >
                    {founderItem.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(founderItem)}
                    className="p-2 rounded-xl bg-[#171A1F] text-white hover:bg-black transition-colors"
                    title="Edit Founder Details & Photo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#626873] leading-relaxed line-clamp-2">
                {founderItem.shortBio || 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.'}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E4E1DA] text-xs">
                <span className="text-[11px] text-[#878D96]">
                  Status: <strong className={founderItem.isPublished ? 'text-emerald-700' : 'text-slate-500'}>
                    {founderItem.isPublished ? 'Live on Public Site' : 'Hidden'}
                  </strong>
                </span>

                <button
                  onClick={() => handleOpenEditModal(founderItem)}
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Update Photo & Bio</span>
                </button>
              </div>
            </div>
          )}

          {/* Co-Founder Card */}
          {coFounderItem ? (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-blue-50/20 to-white border-2 border-blue-400/40 shadow-md relative group space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  {/* Photo with Blue/Gold Accent */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg shrink-0 bg-slate-100 flex items-center justify-center">
                    {coFounderItem.photoUrl ? (
                      <img
                        src={coFounderItem.photoUrl}
                        alt={coFounderItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-blue-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
                      CO-FOUNDER
                    </span>
                    <h3 className="text-lg font-black text-[#171A1F]">
                      {coFounderItem.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-700">
                      {coFounderItem.designation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(coFounderItem.id, coFounderItem.isPublished, coFounderItem.name)}
                    className={`p-2 rounded-xl transition-colors ${
                      coFounderItem.isPublished ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                    }`}
                    title={coFounderItem.isPublished ? 'Published on website' : 'Hidden from website'}
                  >
                    {coFounderItem.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(coFounderItem)}
                    className="p-2 rounded-xl bg-[#171A1F] text-white hover:bg-black transition-colors"
                    title="Edit Co-Founder Details & Photo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#626873] leading-relaxed line-clamp-2">
                {coFounderItem.shortBio || 'Spearheading client growth, operations delivery, and organizational strategy.'}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E4E1DA] text-xs">
                <span className="text-[11px] text-[#878D96]">
                  Status: <strong className={coFounderItem.isPublished ? 'text-emerald-700' : 'text-slate-500'}>
                    {coFounderItem.isPublished ? 'Live on Public Site' : 'Hidden'}
                  </strong>
                </span>

                <button
                  onClick={() => handleOpenEditModal(coFounderItem)}
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Update Photo & Bio</span>
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => handleOpenAddModal('Co-Founder')}
              className="p-6 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#C79A22] cursor-pointer flex flex-col items-center justify-center text-center space-y-3 transition-all min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#C79A22] flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#171A1F]">Add Co-Founder Profile</h3>
                <p className="text-xs text-[#626873]">Upload your Co-Founder photo from mobile gallery and add details.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Leadership / Core Team if any */}
      {otherLeaders.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Leadership & Core Team Members ({otherLeaders.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherLeaders.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#171A1F]">{item.name}</h4>
                      <p className="text-[11px] text-[#C79A22]">{item.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Profile Modal with Full Mobile Gallery Upload Support */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E4E1DA] shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingProfile ? `Edit ${editingProfile.name}` : `Add ${role} Profile`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Upload high-resolution photo from mobile gallery and set executive details.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Photo Upload Section from Mobile Gallery / Device */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#E4E1DA] space-y-3">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Profile Photo (Mobile Gallery / Device File) <span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center gap-4">
                  {/* Photo Preview */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-[#C79A22]/50 shadow shrink-0 flex items-center justify-center">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}

                    {isProcessingPhoto && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    {/* Direct clickable label for 100% reliable mobile gallery opening */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label 
                        htmlFor="founder-photo-file-input"
                        className="cursor-pointer px-4 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#C79A22]" />
                        <span>Choose from Gallery / Camera</span>
                        <input
                          id="founder-photo-file-input"
                          type="file"
                          accept="image/*,image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>

                      {photoUrl && photoUrl !== '/images/founder.jpg' && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('/images/founder.jpg')}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      📱 Tap above to pick from your phone's Photo Gallery or take a camera photo (JPG, PNG, WebP).
                    </p>
                    {photoUploadError && (
                      <p className="text-[11px] font-bold text-rose-600">{photoUploadError}</p>
                    )}
                  </div>
                </div>

                {/* Optional URL input toggle */}
                <div className="pt-2 border-t border-[#E4E1DA]/80">
                  <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                    Or Enter Image URL (optional):
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /images/founder.jpg"
                    value={photoUrl.startsWith('data:') ? 'Image selected from device gallery' : photoUrl}
                    onChange={(e) => {
                      if (!e.target.value.includes('device gallery')) {
                        setPhotoUrl(e.target.value);
                      }
                    }}
                    disabled={photoUrl.startsWith('data:')}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  {photoUrl.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-[10px] text-rose-600 font-bold hover:underline mt-1"
                    >
                      Clear gallery image and enter URL instead
                    </button>
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Hariom Mahato"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#C79A22] bg-[#FCFAF6] focus:bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#C79A22] bg-[#FCFAF6] focus:bg-white text-xs font-bold"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Co-Founder">Co-Founder</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Core Team">Core Team</option>
                  </select>
                </div>
              </div>

              {/* Designation / Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Designation / Executive Title *</label>
                <input
                  type="text"
                  required
                  placeholder={role === 'Founder' ? 'Founder & Lead Technologist' : 'Co-Founder & Operations Lead'}
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#C79A22] bg-[#FCFAF6] focus:bg-white text-xs"
                />
              </div>

              {/* Short Bio */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Short Bio / Leadership Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview of leadership role, vision, and domain expertise..."
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#C79A22] bg-[#FCFAF6] focus:bg-white text-xs"
                />
              </div>

              {/* Full Bio */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Full Bio (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Detailed background, accomplishments, or domain experience..."
                  value={fullBio}
                  onChange={(e) => setFullBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#C79A22] bg-[#FCFAF6] focus:bg-white text-xs"
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#FCFAF6] focus:bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Official Email</label>
                  <input
                    type="email"
                    placeholder="leader@manisolution.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#FCFAF6] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Publish & Order */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C79A22] focus:ring-[#C79A22]"
                  />
                  <label htmlFor="isPublishedCheck" className="font-bold text-slate-800 cursor-pointer">
                    Show on Public Website (About Section)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Order:</span>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-center font-bold"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C79A22] text-[#171A1F] font-bold hover:bg-[#d8a82a] flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
