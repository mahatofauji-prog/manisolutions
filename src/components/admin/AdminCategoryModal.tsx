import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Upload,
  AlertCircle
} from 'lucide-react';
import { BusinessCategory } from '../../types';

interface AdminCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Partial<BusinessCategory>) => Promise<void>;
  editingCategory?: BusinessCategory | null;
}

export const AdminCategoryModal: React.FC<AdminCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [displayOrder, setDisplayOrder] = useState('1');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name || '');
        setSlug(editingCategory.slug || '');
        setShortDesc(editingCategory.shortDesc || '');
        setIconName(editingCategory.iconName || 'Sparkles');
        setImageUrl(editingCategory.imageUrl || '');
        setStatus(editingCategory.status || 'published');
        setDisplayOrder(editingCategory.displayOrder ? String(editingCategory.displayOrder) : '1');
      } else {
        setName('');
        setSlug('');
        setShortDesc('');
        setIconName('Sparkles');
        setImageUrl('');
        setStatus('published');
        setDisplayOrder('1');
      }
      setErrorMessage('');
      setIsSaving(false);
    }
  }, [isOpen, editingCategory]);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(dataUrl);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setErrorMessage('');
      
      if (!name.trim()) {
        setErrorMessage('Category Name is required.');
        return;
      }

      setIsSaving(true);

      const categoryData: Partial<BusinessCategory> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        shortDesc: shortDesc.trim(),
        iconName: iconName.trim() || 'Sparkles',
        imageUrl: imageUrl.trim(),
        status,
        displayOrder: Number(displayOrder) || 1
      };

      await onSave(categoryData);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => !isSaving && onClose()}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E4E1DA] flex items-center justify-between shrink-0 bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-[#171A1F]">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-xs text-[#626873] mt-0.5">
              Manage website design categories for the public marketplace.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Basic Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">Category Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Health & Fitness"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">URL Slug <span className="text-slate-400 font-normal">(Auto-generates if empty)</span></label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. health-fitness"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">Short Description</label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Gyms, Clinics, Hospitals & Yoga Centers"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">Lucide Icon Name</label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="e.g. Stethoscope, Dumbbell, Sparkles"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                />
                <p className="text-[10px] text-slate-400">Exact name of the icon component from lucide-react</p>
              </div>
            </div>

            {/* Right Column: Visuals & Meta */}
            <div className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Category Background Image</span>
                </label>
                
                {imageUrl && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E4E1DA] bg-slate-900 shadow-inner">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste image URL or upload"
                    className="flex-grow px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:bg-slate-50 cursor-pointer text-xs font-bold text-[#171A1F] flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#C79A22]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#C79A22]"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E4E1DA] bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#171A1F] hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Category</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
