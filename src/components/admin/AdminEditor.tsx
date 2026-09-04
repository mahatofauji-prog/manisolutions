import React, { useState, useEffect, useRef } from 'react';
import { SolutionItem, SolutionContentType, SolutionCategory, ProjectStatus, GalleryImage } from '../../types';
import { solutionsStorage } from '../../services/solutionsStorage';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Sparkles, 
  Plus, 
  Trash2, 
  Image, 
  Upload,
  Layers, 
  Smartphone, 
  Globe, 
  Bot, 
  Briefcase, 
  BookOpen, 
  Radio, 
  CheckCircle2, 
  Check, 
  ExternalLink,
  Code,
  Tag,
  AlertCircle
} from 'lucide-react';

interface AdminEditorProps {
  editId: string | null;
  onBack: () => void;
  onSaved: () => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Software / ERP Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Restaurant / Cafe QR', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Fitness & Mobile App', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Education & School ERP', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Business AI & Automation', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Real Estate & Modern Web', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Wholesale & Logistics', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Architecture & Tech', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' }
];

const COMMON_TECH_OPTIONS = [
  'Web Application',
  'Mobile Application',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Cloud Database',
  'Responsive UI',
  'Authentication',
  'REST API',
  'Thermal Printing Engine',
  'Push Notifications',
  'UPI Gateway',
  'Business AI Chatbot',
  'Voice Processing',
  'WhatsApp API Integration',
  'SEO Schema'
];

export const AdminEditor: React.FC<AdminEditorProps> = ({
  editId,
  onBack,
  onSaved
}) => {
  // Mode: Form vs Live Preview
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [category, setCategory] = useState<string>('Software');
  const [contentType, setContentType] = useState<SolutionContentType>('software');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('Live');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [technologiesUsed, setTechnologiesUsed] = useState<string[]>(['Web Application', 'Cloud Database', 'Responsive UI']);
  const [techInput, setTechInput] = useState('');
  const [keyFeatures, setKeyFeatures] = useState<string[]>(['Staff & Attendance Management', 'Fast Multi-Counter Billing']);
  const [featureInput, setFeatureInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>(['Cuts manual billing time down to under 10 seconds per transaction']);
  const [benefitInput, setBenefitInput] = useState('');
  const [clientType, setClientType] = useState('Retailers & Enterprises');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [tags, setTags] = useState<string[]>(['Business Automation', 'ERP']);
  const [tagInput, setTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [author, setAuthor] = useState('MANI Solution');
  const [readingTime, setReadingTime] = useState('4 min read');
  const [liveUrl, setLiveUrl] = useState('');
  const [platformsInput, setPlatformsInput] = useState('Web, Android');

  // File Upload State for Cover Image
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadMsg, setCoverUploadMsg] = useState<string | null>(null);

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const isValidExt = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
    const isValidType = validExtensions.includes(file.type.toLowerCase()) || isValidExt;

    if (!isValidType) {
      setCoverUploadMsg('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      if (coverInputRef.current) coverInputRef.current.value = '';
      return;
    }

    setIsUploadingCover(true);
    setCoverUploadMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) {
        setIsUploadingCover(false);
        setCoverUploadMsg('Failed to read image.');
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        try {
          const maxDim = 1280;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            setFeaturedImage(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            setFeaturedImage(rawResult);
          }
          setIsUploadingCover(false);
          setCoverUploadMsg(`Uploaded ${file.name}`);
        } catch {
          setFeaturedImage(rawResult);
          setIsUploadingCover(false);
          setCoverUploadMsg(`Uploaded ${file.name}`);
        }
      };
      img.onerror = () => {
        setIsUploadingCover(false);
        setCoverUploadMsg('Error decoding image file.');
      };
      img.src = rawResult;
    };
    reader.onerror = () => {
      setIsUploadingCover(false);
      setCoverUploadMsg('Error reading file from device.');
    };
    reader.readAsDataURL(file);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // Gallery item temp state
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryType, setNewGalleryType] = useState<'desktop' | 'mobile' | 'dashboard' | 'feature'>('dashboard');

  // Load item if editing
  useEffect(() => {
    if (editId) {
      const item = solutionsStorage.getById(editId);
      if (item) {
        setTitle(item.title);
        setSlug(item.slug);
        setAutoSlug(false);
        setCategory(item.category);
        setContentType(item.contentType);
        setProjectStatus(item.projectStatus);
        setShortDescription(item.shortDescription);
        setFullDescription(item.fullDescription);
        setFeaturedImage(item.featuredImage);
        setGalleryImages(item.galleryImages || []);
        setTechnologiesUsed(item.technologiesUsed || []);
        setKeyFeatures(item.keyFeatures || []);
        setBenefits(item.benefits || []);
        setClientType(item.clientType || '');
        setProjectDate(item.projectDate || new Date().toISOString().split('T')[0]);
        setTags(item.tags || []);
        setSeoTitle(item.seoTitle || '');
        setSeoDescription(item.seoDescription || '');
        setStatus(item.status);
        setIsFeatured(item.isFeatured);
        setAuthor(item.author || 'MANI Solution');
        setReadingTime(item.readingTime || '4 min read');
        setLiveUrl(item.liveUrl || '');
        setPlatformsInput(item.platforms ? item.platforms.join(', ') : 'Web');
      }
    }
  }, [editId]);

  // Handle Title Change & Slug Sync
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      const generated = solutionsStorage.generateSlug(val);
      setSlug(generated);
      if (!seoTitle) setSeoTitle(`${val} | MANI Solution`);
    }
  };

  // Tech tags add
  const addTechTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !technologiesUsed.includes(clean)) {
      setTechnologiesUsed([...technologiesUsed, clean]);
      setTechInput('');
    }
  };

  const removeTechTag = (index: number) => {
    setTechnologiesUsed(technologiesUsed.filter((_, i) => i !== index));
  };

  // Key Features add
  const addFeature = () => {
    if (featureInput.trim()) {
      setKeyFeatures([...keyFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  };

  // Benefits add
  const addBenefit = () => {
    if (benefitInput.trim()) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  // Tags add
  const addTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Gallery image add
  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages([
        ...galleryImages,
        {
          url: newGalleryUrl.trim(),
          caption: newGalleryCaption.trim() || undefined,
          type: newGalleryType
        }
      ]);
      setNewGalleryUrl('');
      setNewGalleryCaption('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // Save / Publish
  const handleSave = (publishStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please enter a Title for this post/project.');
      return;
    }

    const platforms = platformsInput
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || solutionsStorage.generateSlug(title),
      category: category.trim(),
      contentType,
      shortDescription: shortDescription.trim() || title,
      fullDescription: fullDescription.trim() || shortDescription || title,
      featuredImage: featuredImage.trim(),
      galleryImages,
      projectStatus,
      technologiesUsed,
      keyFeatures,
      benefits,
      clientType: clientType.trim() || undefined,
      projectDate,
      tags,
      seoTitle: seoTitle.trim() || `${title} | MANI Solution`,
      seoDescription: seoDescription.trim() || shortDescription,
      status: publishStatus,
      isFeatured,
      author: author.trim() || 'MANI Solution',
      readingTime: readingTime.trim() || '4 min read',
      liveUrl: liveUrl.trim() || undefined,
      platforms: platforms.length > 0 ? platforms : undefined
    };

    if (editId) {
      solutionsStorage.update(editId, payload);
    } else {
      solutionsStorage.create(payload);
    }

    onSaved();
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E1DA] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#E4E1DA] text-[#626873] hover:text-[#171A1F] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#171A1F]">
              {editId ? 'Edit Content / Project' : 'Create New Post / Project'}
            </h2>
            <p className="text-xs text-slate-400">
              Configure fields, preview in real-time, and publish to the live MANI Solution portfolio.
            </p>
          </div>
        </div>

        {/* Tab & Save Controls */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-white p-1 border border-[#E4E1DA] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'form' ? 'bg-[#C79A22] text-[#171A1F]' : 'text-slate-400 hover:text-[#171A1F]'
              }`}
            >
              Editor Form
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all ${
                activeTab === 'preview' ? 'bg-[#C79A22] text-[#171A1F]' : 'text-slate-400 hover:text-[#171A1F]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>

          <button
            id="editor-save-draft-btn"
            onClick={() => handleSave('draft')}
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-[#334155] border border-white/15 text-[#171A1F] text-xs font-bold transition-all"
          >
            Save as Draft
          </button>

          <button
            id="editor-publish-btn"
            onClick={() => handleSave('published')}
            className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Publish to Website
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Left Form Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Content Type Selector */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                1. Select Content Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'software', label: 'Software', icon: Layers },
                  { type: 'app', label: 'Mobile App', icon: Smartphone },
                  { type: 'website', label: 'Website', icon: Globe },
                  { type: 'ai-solution', label: 'AI Solution', icon: Bot },
                  { type: 'case-study', label: 'Case Study', icon: Briefcase },
                  { type: 'article', label: 'Article / Guide', icon: BookOpen },
                  { type: 'update', label: 'Product Update', icon: Radio }
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setContentType(type as SolutionContentType);
                      if (type === 'software') setCategory('Software');
                      if (type === 'app') setCategory('Apps');
                      if (type === 'website') setCategory('Websites');
                      if (type === 'ai-solution') setCategory('AI Solutions');
                      if (type === 'case-study') setCategory('Case Studies');
                      if (type === 'article') setCategory('Technology');
                      if (type === 'update') setCategory('Updates');
                    }}
                    className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                      contentType === type
                        ? 'bg-[#C79A22]/15 border-[#C79A22] text-[#171A1F] shadow-md'
                        : 'bg-slate-50/50 border-[#E4E1DA] text-slate-400 hover:text-[#171A1F] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${contentType === type ? 'text-[#C79A22]' : 'text-slate-400'}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Core Information */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                2. Core Project / Article Details
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Title / Project Name *</label>
                <input
                  id="editor-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. MANI Business Management System"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#626873]">Clean URL Slug *</label>
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-[10px] text-[#C79A22] hover:underline"
                    >
                      {autoSlug ? 'Auto-sync: ON' : 'Auto-sync: OFF'}
                    </button>
                  </div>
                  <input
                    id="editor-slug-input"
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setSlug(e.target.value);
                    }}
                    placeholder="business-management-system"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-[#C79A22]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#626873]">Category</label>
                  <select
                    id="editor-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="Software">Software</option>
                    <option value="Apps">Apps</option>
                    <option value="Websites">Websites</option>
                    <option value="AI Solutions">AI Solutions</option>
                    <option value="Business Solutions">Business Solutions</option>
                    <option value="Case Studies">Case Studies</option>
                    <option value="Technology">Technology</option>
                    <option value="Updates">Updates</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Short Introduction / Summary *</label>
                <textarea
                  id="editor-shortdesc-input"
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Explain what the product is and what problem it solves in 1-2 clear sentences..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs focus:outline-none focus:border-[#C79A22]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Full Description / Overview *</label>
                <textarea
                  id="editor-fulldesc-input"
                  rows={6}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed project description, architecture overview, problem context, implementation..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#C79A22]"
                />
              </div>
            </div>

            {/* 3. Key Features & Benefits Manager */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-6">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                3. Key Features & Practical Business Benefits
              </label>

              {/* Key Features */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#626873]">Key Features List</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder="e.g. Staff Attendance, Fast Billing, Thermal Receipt Generator..."
                    className="flex-grow px-4 py-2 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 rounded-xl bg-[#C79A22] text-[#171A1F] font-bold text-xs hover:bg-[#b8860b] transition-all"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2">
                  {keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/40 border border-[#E4E1DA] text-xs text-[#171A1F]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A22]" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Benefits */}
              <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
                <label className="text-xs font-semibold text-[#626873]">Business Benefits (How It Helps)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                    placeholder="e.g. Cuts billing time down to under 8 seconds per transaction..."
                    className="flex-grow px-4 py-2 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="px-4 py-2 rounded-xl bg-[#10b981] text-[#171A1F] font-bold text-xs hover:bg-emerald-600 transition-all"
                  >
                    Add Benefit
                  </button>
                </div>

                <div className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/40 border border-emerald-500/10 text-xs text-[#171A1F]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{benefit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeBenefit(idx)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 4. Screenshots & Gallery */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                4. Screenshot Gallery (Desktop, Mobile, Dashboard, Feature)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Image URL (e.g. https://...)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    placeholder="Caption label"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={newGalleryType}
                    onChange={(e: any) => setNewGalleryType(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50/80 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="feature">Feature</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="w-full py-2 rounded-xl bg-[#C79A22] text-[#171A1F] font-bold text-xs hover:bg-[#b8860b] flex items-center justify-center"
                    title="Add to gallery"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-50 border border-[#E4E1DA] p-1.5 space-y-1">
                      <img src={img.url} alt={img.caption || ''} className="w-full h-24 object-cover rounded-lg" />
                      <div className="flex items-center justify-between text-[10px] text-[#626873] px-1">
                        <span className="truncate">{img.caption || img.type}</span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Right Settings Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status & Featured */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                Publishing & Status
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Project Status</label>
                <select
                  value={projectStatus}
                  onChange={(e: any) => setProjectStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                >
                  <option value="Live">Live</option>
                  <option value="In Development">In Development</option>
                  <option value="Completed">Completed</option>
                  <option value="Concept">Concept</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-[#E4E1DA]">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" /> Feature on Homepage
                  </label>
                  <p className="text-[10px] text-slate-400">Showcases in the top featured banner</p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#C79A22] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Project / Release Date</label>
                <input
                  type="date"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#626873]">Client Type / Industry</label>
                <input
                  type="text"
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value)}
                  placeholder="e.g. Retailers, Cafes, MSMEs"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
                />
              </div>
            </div>

            {/* Featured Image Picker */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                  Featured Cover Image
                </label>
                {coverUploadMsg && (
                  <span className="text-[10px] font-bold text-emerald-600 truncate max-w-[140px]">
                    {coverUploadMsg}
                  </span>
                )}
              </div>

              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-[#E4E1DA] relative flex items-center justify-center">
                {featuredImage ? (
                  <img src={featuredImage} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-slate-400 text-xs">
                    No image uploaded. Default placeholder will be used.
                  </div>
                )}
              </div>

              {/* Upload controls */}
              <input
                type="file"
                ref={coverInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleCoverFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="flex-grow px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingCover ? 'Uploading...' : featuredImage ? 'Replace Image' : 'Upload Image'}</span>
                </button>

                {featuredImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage('');
                      setCoverUploadMsg(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs focus:outline-none focus:border-[#C79A22]"
              />

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Or Pick a Tech Preset:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFeaturedImage(preset.url)}
                      className="px-2 py-1 rounded bg-slate-50 hover:bg-[#334155] border border-[#E4E1DA] text-[10px] text-[#626873]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Technologies Used Tags */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                Technologies Used (Authentic Only)
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechTag(techInput); } }}
                  placeholder="e.g. Cloud Database..."
                  className="flex-grow px-3 py-1.5 rounded-lg bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs"
                />
                <button
                  type="button"
                  onClick={() => addTechTag(techInput)}
                  className="px-3 py-1.5 rounded-lg bg-[#C79A22] text-[#171A1F] font-bold text-xs"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {technologiesUsed.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-50 border border-[#E4E1DA] text-[11px] text-[#171A1F] flex items-center gap-1.5">
                    {tech}
                    <button type="button" onClick={() => removeTechTag(idx)} className="text-slate-400 hover:text-rose-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E4E1DA]">
                <span className="text-[10px] text-slate-400 block mb-1">Quick Add:</span>
                <div className="flex flex-wrap gap-1">
                  {COMMON_TECH_OPTIONS.slice(0, 8).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => addTechTag(opt)}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-400 hover:text-[#171A1F]"
                    >
                      +{opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO & Meta */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C79A22] block">
                SEO & Search Metadata
              </label>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#626873]">SEO Page Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. Business Software | MANI Solution"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#626873]">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Search engine summary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#626873]">Keywords & Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }}
                    placeholder="e.g. ERP, Billing..."
                    className="flex-grow px-3 py-1.5 rounded-lg bg-slate-50 border border-[#E4E1DA] text-[#171A1F] text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(tagInput)}
                    className="px-3 py-1.5 rounded-lg bg-[#C79A22] text-[#171A1F] font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 text-[10px] text-[#626873] flex items-center gap-1">
                      #{t}
                      <button type="button" onClick={() => removeTag(idx)} className="text-slate-400 hover:text-rose-400">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Live Preview Mode Tab */
        <div className="p-8 rounded-3xl bg-slate-50 border border-[#E4E1DA] space-y-8">
          <div className="p-4 rounded-xl bg-white border border-[#C79A22]/40 flex items-center justify-between text-xs text-[#C79A22]">
            <span>Live Rendering Simulator (This is how it will appear to visitors)</span>
            <button
              onClick={() => setActiveTab('form')}
              className="font-bold underline text-[#171A1F]"
            >
              ← Return to Form
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded bg-[#C79A22]/20 text-[#C79A22] text-xs font-bold uppercase">{category}</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">● {projectStatus}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171A1F]">{title || 'Untitled Project'}</h1>
            
            <div className="p-4 rounded-xl bg-white border-l-4 border-[#C79A22] text-[#171A1F] text-sm">
              {shortDescription || 'Short summary goes here...'}
            </div>

            <img src={featuredImage} alt={title} className="w-full max-h-[380px] object-cover rounded-2xl border border-[#E4E1DA]" />

            <div className="text-[#626873] text-sm whitespace-pre-line leading-relaxed">
              {fullDescription || 'Full description overview...'}
            </div>

            {keyFeatures.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#E4E1DA]">
                <h3 className="text-lg font-bold text-[#171A1F]">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {keyFeatures.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white border border-[#E4E1DA] text-xs text-[#171A1F] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C79A22]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
