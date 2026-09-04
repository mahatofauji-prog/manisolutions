import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Save, 
  Plus, 
  Layers, 
  DollarSign, 
  Link as LinkIcon, 
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { WebsiteTemplate } from '../../types';
import { categoriesStorage } from '../../services/categoriesStorage';

interface AdminWebsiteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: Omit<WebsiteTemplate, 'id' | 'createdAt'>, id?: string) => Promise<void> | void;
  editingTemplate: WebsiteTemplate | null;
}

export const AdminWebsiteTemplateModal: React.FC<AdminWebsiteTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['retail']);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [price, setPrice] = useState('₹1,499');
  const [demoUrl, setDemoUrl] = useState('');
  const [buyUrl, setBuyUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [featuresText, setFeaturesText] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingTemplate) {
      setTitle(editingTemplate.title || '');
      setSlug(editingTemplate.slug || '');
      const cats = Array.isArray(editingTemplate.categories) && editingTemplate.categories.length > 0
        ? editingTemplate.categories
        : (editingTemplate.category ? [editingTemplate.category] : ['retail']);
      setSelectedCategories(cats);
      setDescription(editingTemplate.description || '');
      setThumbnailUrl(editingTemplate.thumbnailUrl || '');
      setPrice(editingTemplate.price || '₹1,499');
      setDemoUrl(editingTemplate.demoUrl || '');
      setBuyUrl(editingTemplate.buyUrl || '');
      setIsFeatured(editingTemplate.isFeatured ?? false);
      setStatus(editingTemplate.status || 'published');
      setDisplayOrder(editingTemplate.displayOrder || 1);
      setFeaturesText(editingTemplate.features ? editingTemplate.features.join('\n') : '');
    } else {
      setTitle('');
      setSlug('');
      setSelectedCategories(['retail']);
      setDescription('');
      setThumbnailUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop');
      setPrice('₹1,499');
      setDemoUrl('');
      setBuyUrl('');
      setIsFeatured(false);
      setStatus('published');
      setDisplayOrder(1);
      setFeaturesText('100% Mobile & Tablet Responsive\nFast Page Load Speed\nDirect WhatsApp Quick Booking\nCustomised Banner Graphics');
    }
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(false);
    setIsCategoryDropdownOpen(false);
  }, [editingTemplate, isOpen]);

  if (!isOpen) return null;

  // Compress and convert uploaded image file to Base64
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
        const MAX_HEIGHT = 650;
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
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setThumbnailUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length === 1) {
        setErrorMessage('At least one business category must be selected.');
        return;
      }
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories(categoriesStorage.getAll().map(c => c.id));
  };

  const clearCategories = () => {
    const cats = categoriesStorage.getAll();
    if (cats.length > 0) {
      setSelectedCategories([cats[0].id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter the Website Template Title.');
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMessage('Please select at least one connected business category.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please enter the Description.');
      return;
    }
    if (!price.trim()) {
      setErrorMessage('Please enter the Price (e.g. ₹1,499).');
      return;
    }
    if (!thumbnailUrl.trim()) {
      setErrorMessage('Please provide a preview thumbnail or upload one.');
      return;
    }

    const features = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const templateData: Omit<WebsiteTemplate, 'id' | 'createdAt'> = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      categories: selectedCategories,
      category: selectedCategories[0] || 'retail',
      description: description.trim(),
      price: price.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      demoUrl: demoUrl.trim(),
      buyUrl: buyUrl.trim(),
      isFeatured,
      status,
      displayOrder: Number(displayOrder) || 1,
      features: features.length > 0 ? features : ['Mobile-responsive architecture', 'Zero maintenance hosting']
    };

    setIsSaving(true);

    try {
      await onSave(templateData, editingTemplate?.id);
      setSuccessMessage(editingTemplate ? 'Template updated successfully!' : 'Template saved successfully!');
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (err) {
      console.error('Error saving website template:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save template changes. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div 
      id="admin-website-template-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-auto text-left relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MANI Solution • Website Templates CMS</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {editingTemplate ? 'Edit Website Template' : 'Add Website Template'}
            </h3>
            <p className="text-xs text-slate-300">
              Create, edit, or configure live demo links and pricing for industry website templates.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow">
          
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Core Fields */}
            <div className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Template Title <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern Fashion Retail Theme 01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>URL Slug <span className="text-[10px] text-slate-400 font-normal">(Auto-generated if empty)</span></span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. fashion-retail-01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Multi-Category Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Connected Business Categories <span className="text-rose-500">*</span></span>
                  </label>
                  <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {selectedCategories.length} Selected
                  </span>
                </div>

                {/* Display selected category chips */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-[#E4E1DA] space-y-2.5">
                  <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                    {selectedCategories.map((catId) => {
                      const catObj = categoriesStorage.getAll().find(c => c.id === catId);
                      const name = catObj ? catObj.name : catId;
                      return (
                        <span
                          key={catId}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-[#171A1F] border border-[#E4E1DA] text-xs font-bold shadow-sm"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => toggleCategory(catId)}
                            className="w-4 h-4 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove Category"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  {/* Toggle checklist dropdown button */}
                  <div className="pt-2 border-t border-[#E4E1DA]/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#2563EB] text-xs font-bold text-[#2563EB] flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isCategoryDropdownOpen ? 'Close Category Selector' : 'Add / Modify Categories'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={selectAllCategories}
                        className="text-[10px] font-bold text-slate-500 hover:text-[#171A1F] underline"
                      >
                        Select All
                      </button>
                    </div>
                  </div>

                  {/* Expandable Scrollable Checkbox Grid */}
                  {isCategoryDropdownOpen && (
                    <div className="pt-3 border-t border-[#E4E1DA] grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 animate-in fade-in duration-150">
                      {categoriesStorage.getAll().map((cat) => {
                        const isChecked = selectedCategories.includes(cat.id);
                        return (
                          <div
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs transition-all select-none ${
                              isChecked
                                ? 'bg-blue-50/80 border-[#2563EB] text-[#171A1F] font-bold shadow-xs'
                                : 'bg-white border-[#E4E1DA] text-slate-600 hover:bg-slate-100/70 font-medium'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer shrink-0"
                            />
                            <span className="truncate">{cat.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400">
                  Template will automatically appear under all selected category pages on the website.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Template Description <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what features, sub-pages, and aesthetics this template offers to customers..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Pricing (Manual Entry) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Price <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="text"
                    required
                    value={price.replace('₹', '')}
                    onChange={(e) => setPrice('₹' + e.target.value)}
                    placeholder="1,499"
                    className="w-full pl-7 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Preview, URLs, and Settings */}
            <div className="space-y-4">
              
              {/* Primary Thumbnail Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Template Thumbnail Image <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400">16:10 or 16:9 ratio recommended</span>
                </label>

                {thumbnailUrl && (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#E4E1DA] bg-slate-900 shadow-inner">
                    <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Paste public image URL"
                    className="flex-grow px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:bg-slate-50 cursor-pointer text-xs font-bold text-[#171A1F] flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
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

              {/* Live Demo URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Live Demo URL</span>
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="e.g. https://fashion-demo.manisolution.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Custom Buy Now / Order Info URL (Optional override, otherwise uses standard purchase modal) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Custom Buy Link / Info <span className="text-[10px] text-slate-400 font-normal">(Optional override)</span></span>
                </label>
                <input
                  type="text"
                  value={buyUrl}
                  onChange={(e) => setBuyUrl(e.target.value)}
                  placeholder="e.g. Custom UPI URL or WhatsApp link override"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Bullet Key Features */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Key Features Included</span>
                  <span className="text-[10px] text-slate-400">One per line</span>
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="WhatsApp ordering module&#10;Google Maps search tag&#10;Custom QR Menu Code"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Visibility and Featured Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F] block">Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E4E1DA] text-xs font-bold text-[#171A1F]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F] block">Display Order:</label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#E4E1DA] text-xs font-bold text-[#171A1F]"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    id="isFeaturedCheckbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedCheckbox" className="text-xs font-bold text-[#171A1F] cursor-pointer">
                    Mark as Featured Template
                  </label>
                </div>
              </div>

            </div>

          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-[#E4E1DA] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] text-xs font-bold transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#ECC348]" />
                  <span>{editingTemplate ? 'Update Template' : 'Save Template'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
