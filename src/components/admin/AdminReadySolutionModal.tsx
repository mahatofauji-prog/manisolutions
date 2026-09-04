import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Save, 
  Trash2, 
  Plus, 
  Layers, 
  DollarSign, 
  Link as LinkIcon, 
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ReadySolutionItem, ReadySolutionPriceType } from '../../types';
import { READY_SOLUTIONS_CATEGORIES } from '../../data/readySolutionsData';

interface AdminReadySolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (solutionData: Omit<ReadySolutionItem, 'id' | 'createdAt'>, id?: string) => void;
  editingSolution: ReadySolutionItem | null;
}

export const AdminReadySolutionModal: React.FC<AdminReadySolutionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSolution
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Schools');
  const [customCategory, setCustomCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [technologyText, setTechnologyText] = useState('');
  const [suitableForText, setSuitableForText] = useState('');
  
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<ReadySolutionPriceType>('Starting From');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featuredOnHomepage, setFeaturedOnHomepage] = useState(true);
  const [homepagePriority, setHomepagePriority] = useState<number>(1);
  const [demoUrl, setDemoUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingSolution) {
      setTitle(editingSolution.title || '');
      setSlug(editingSolution.slug || '');
      
      const isStandardCat = READY_SOLUTIONS_CATEGORIES.includes(editingSolution.category);
      if (isStandardCat && editingSolution.category !== 'All') {
        setCategory(editingSolution.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(editingSolution.category || '');
      }

      setShortDescription(editingSolution.shortDescription || '');
      setFullDescription(editingSolution.fullDescription || '');
      setThumbnailUrl(editingSolution.thumbnailUrl || '');
      setAdditionalImages(editingSolution.additionalImages || []);
      
      setFeaturesText(editingSolution.features ? editingSolution.features.join('\n') : '');
      setBenefitsText(editingSolution.benefits ? editingSolution.benefits.join('\n') : '');
      setTechnologyText(editingSolution.technology ? editingSolution.technology.join(', ') : '');
      setSuitableForText(editingSolution.suitableFor ? editingSolution.suitableFor.join(', ') : '');
      
      setPrice(editingSolution.price || '');
      setPriceType(editingSolution.priceType || 'Starting From');
      setStatus(editingSolution.status || 'published');
      setFeaturedOnHomepage(editingSolution.featuredOnHomepage ?? true);
      setHomepagePriority(editingSolution.homepagePriority || 1);
      setDemoUrl(editingSolution.demoUrl || '');
    } else {
      // Reset defaults for new solution
      setTitle('');
      setSlug('');
      setCategory('Schools');
      setCustomCategory('');
      setShortDescription('');
      setFullDescription('');
      setThumbnailUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop');
      setAdditionalImages([]);
      setFeaturesText('');
      setBenefitsText('');
      setTechnologyText('React, Node.js, PostgreSQL, Tailwind CSS');
      setSuitableForText('Small & Medium Businesses, Enterprises');
      setPrice('Starting from ₹19,999');
      setPriceType('Starting From');
      setStatus('published');
      setFeaturedOnHomepage(true);
      setHomepagePriority(1);
      setDemoUrl('');
    }
    setErrorMessage('');
  }, [editingSolution, isOpen]);

  if (!isOpen) return null;

  // Image Upload helper (Compress image to base64 canvas)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
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
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 800;
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
        if (isGallery) {
          setAdditionalImages(prev => [...prev, dataUrl]);
        } else {
          setThumbnailUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryUrl = () => {
    if (newImageUrl.trim()) {
      setAdditionalImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter the Ready Solution Title.');
      return;
    }

    const finalCategory = category === 'Other' 
      ? (customCategory.trim() || 'General') 
      : category;

    if (!shortDescription.trim()) {
      setErrorMessage('Please enter a short description.');
      return;
    }

    if (!fullDescription.trim()) {
      setErrorMessage('Please enter the full description.');
      return;
    }

    if (!thumbnailUrl.trim()) {
      setErrorMessage('Please provide a thumbnail image or upload one.');
      return;
    }

    // Split features & benefits
    const features = featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const benefits = benefitsText
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const technology = technologyText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const suitableFor = suitableForText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const solutionData: Omit<ReadySolutionItem, 'id' | 'createdAt'> = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category: finalCategory,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      additionalImages,
      features: features.length > 0 ? features : ['Core business automation module', 'Fast cloud deployment', 'Mobile & desktop responsive'],
      benefits: benefits.length > 0 ? benefits : ['Save operational hours', 'Improve customer retention', 'Zero maintenance headache'],
      technology: technology.length > 0 ? technology : ['React', 'Node.js', 'PostgreSQL'],
      suitableFor: suitableFor.length > 0 ? suitableFor : ['All Businesses'],
      price: price.trim(),
      priceType,
      status,
      featuredOnHomepage,
      homepagePriority: Number(homepagePriority) || 1,
      demoUrl: demoUrl.trim()
    };

    onSave(solutionData, editingSolution?.id);
    onClose();
  };

  return (
    <div 
      id="admin-ready-solution-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-auto text-left relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-[#0F172A] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C79A22]/20 border border-[#C79A22]/40 text-[#ECC348] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready Solutions CMS</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {editingSolution ? 'Edit Ready Solution' : 'Add New Ready Solution'}
            </h3>
            <p className="text-xs text-slate-300">
              Manage pre-built software products for public catalog & homepage showcase.
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Core Info */}
            <div className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Solution Title / Name <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart School Management ERP System"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Category <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                >
                  {READY_SOLUTIONS_CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name (e.g. Logistics, Solar)"
                    className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Short Description (Card Summary) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief 1-2 sentence pitch shown on cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB] resize-none"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F]">
                  <span>Full Description (Detail Page) <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed explanation of system modules, workflows, and features..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Pricing & License */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Price Display</span>
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. Starting from ₹24,999"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Price Type</span>
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Starting From">Starting From</option>
                    <option value="Fixed Price">Fixed Price</option>
                    <option value="Monthly Subscription">Monthly Subscription</option>
                    <option value="Yearly Subscription">Yearly Subscription</option>
                    <option value="Request Price">Request Price</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Right Column: Visuals & Advanced Settings */}
            <div className="space-y-4">
              
              {/* Primary Thumbnail Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Product Thumbnail Image <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-[#626873]">16:9 or 16:10 ratio</span>
                </label>

                {thumbnailUrl && (
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E4E1DA] bg-slate-900">
                    <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="Paste image URL (Unsplash, Cloudinary, etc.)"
                    className="flex-grow px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:bg-slate-50 cursor-pointer text-xs font-bold text-[#171A1F] flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, false)}
                    />
                  </label>
                </div>
              </div>

              {/* Key Features (One per line) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Key Features Included</span>
                  <span className="text-[10px] text-[#626873]">One feature per line</span>
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Automated Online Fee Collection&#10;Biometric Attendance Tracking&#10;Dedicated Parent Mobile App&#10;CBSE Report Card Generator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Benefits (One per line) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#171A1F] flex items-center justify-between">
                  <span>Business Impact / Benefits</span>
                  <span className="text-[10px] text-[#626873]">One per line</span>
                </label>
                <textarea
                  rows={2}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  placeholder="Save 80+ hours of administrative work&#10;Zero fee delay with WhatsApp reminders"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Suitable For & Tech Stack */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Suitable For</span>
                  </label>
                  <input
                    type="text"
                    value={suitableForText}
                    onChange={(e) => setSuitableForText(e.target.value)}
                    placeholder="Schools, Colleges, Academies"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171A1F]">
                    <span>Tech Stack</span>
                  </label>
                  <input
                    type="text"
                    value={technologyText}
                    onChange={(e) => setTechnologyText(e.target.value)}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Publishing & Homepage Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-[#E4E1DA] space-y-3">
                <div className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">
                  Visibility & Display Settings
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Status Toggle */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#171A1F]">Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E1DA] text-xs font-bold text-[#171A1F]"
                    >
                      <option value="published">Published (Live)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  {/* Show on Homepage Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featuredOnHomepage}
                      onChange={(e) => setFeaturedOnHomepage(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#171A1F]">
                      Show on Homepage <span className="text-[10px] text-[#626873]">(Max 6 shown)</span>
                    </span>
                  </label>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[#E4E1DA] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] text-xs font-bold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-black shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-4 h-4 text-[#ECC348]" />
              <span>{editingSolution ? 'Update Solution' : 'Save & Publish Solution'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
