import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';
import { ProjectItem, ProjectCategory } from '../../types';
import { solutionsStorage } from '../../services/solutionsStorage';
import { LaptopMockup } from '../LaptopMockup';

interface AdminAddProjectModalProps {
  isOpen: boolean;
  editProject: ProjectItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  'Websites',
  'Apps',
  'Software',
  'AI',
  'Automation',
  'Tools'
];

const SAMPLE_PRESETS = [
  { label: 'Website Hero', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'E-commerce Shop', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'ERP & Billing', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mobile App UI', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI Bot & Automation', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Real Estate Portal', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminAddProjectModal: React.FC<AdminAddProjectModalProps> = ({
  isOpen,
  editProject,
  onClose,
  onSaved,
}) => {
  const [projectName, setProjectName] = useState('');
  const [category, setCategory] = useState<ProjectCategory | string>('Websites');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['React', 'Tailwind CSS', 'Node.js']);
  const [techInput, setTechInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  
  // Image Upload and UI feedback states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showManualUrlInput, setShowManualUrlInput] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editProject) {
      setProjectName(editProject.projectName || '');
      setCategory(editProject.category || 'Websites');
      setDescription(editProject.description || '');
      setProjectUrl(editProject.projectUrl || '');
      setThumbnailUrl(editProject.thumbnailUrl || '');
      setTechnologies(editProject.technologies || []);
      setClientName(editProject.clientName || '');
      setProjectDate(editProject.projectDate || new Date().toISOString().split('T')[0]);
      setFeatured(Boolean(editProject.featured));
      setPublished(editProject.published !== false);
    } else {
      setProjectName('');
      setCategory('Websites');
      setDescription('');
      setProjectUrl('');
      setThumbnailUrl('');
      setTechnologies(['React', 'Tailwind CSS', 'Node.js']);
      setClientName('');
      setProjectDate(new Date().toISOString().split('T')[0]);
      setFeatured(false);
      setPublished(true);
    }
    setImageUploadStatus(null);
    setFormError(null);
    setShowManualUrlInput(false);
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  // Add Tech Tag
  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  // Process Device Image File Upload (JPG, JPEG, PNG, WEBP)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const isValidExt = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
    const isValidType = validExtensions.includes(file.type.toLowerCase()) || isValidExt;

    if (!isValidType) {
      setImageUploadStatus({
        type: 'error',
        message: 'Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploadingImage(true);
    setImageUploadStatus(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawResult = e.target?.result as string;
        if (!rawResult) {
          throw new Error('Failed to read image data.');
        }

        // Optimize and compress image via canvas for persistent storage
        const img = new Image();
        img.onload = () => {
          try {
            const maxDimension = 1280;
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              setThumbnailUrl(rawResult);
              setIsUploadingImage(false);
              setImageUploadStatus({
                type: 'success',
                message: `Image uploaded successfully (${file.name})`
              });
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            // High quality, lightweight JPEG
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setThumbnailUrl(compressedDataUrl);
            setIsUploadingImage(false);
            setImageUploadStatus({
              type: 'success',
              message: `Image uploaded successfully (${file.name})`
            });
          } catch {
            setThumbnailUrl(rawResult);
            setIsUploadingImage(false);
            setImageUploadStatus({
              type: 'success',
              message: `Image uploaded successfully (${file.name})`
            });
          }
        };

        img.onerror = () => {
          setIsUploadingImage(false);
          setImageUploadStatus({
            type: 'error',
            message: 'Could not parse image. Please select another image file.'
          });
        };

        img.src = rawResult;
      };

      reader.onerror = () => {
        setIsUploadingImage(false);
        setImageUploadStatus({
          type: 'error',
          message: 'Error reading file from your device. Please try again.'
        });
      };

      reader.readAsDataURL(file);
    } catch {
      setIsUploadingImage(false);
      setImageUploadStatus({
        type: 'error',
        message: 'Failed to process image upload. Existing image preserved.'
      });
    }

    // Reset input so re-uploading the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setThumbnailUrl('');
    setImageUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = (publishStatus: boolean) => {
    setFormError(null);

    if (!projectName.trim()) {
      setFormError('Please enter a Project Name.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please enter a short project description.');
      return;
    }

    try {
      const payload = {
        title: projectName.trim(),
        slug: solutionsStorage.generateSlug(projectName),
        category: category,
        contentType: 'website' as const,
        shortDescription: description.trim(),
        fullDescription: description.trim(),
        featuredImage: thumbnailUrl.trim(),
        galleryImages: [],
        projectStatus: 'Live' as const,
        technologiesUsed: technologies,
        keyFeatures: [],
        benefits: [],
        clientType: clientName.trim() || undefined,
        projectDate: projectDate || new Date().toISOString().split('T')[0],
        tags: technologies,
        seoTitle: `${projectName.trim()} | MANI Solution`,
        seoDescription: description.trim(),
        status: publishStatus ? ('published' as const) : ('draft' as const),
        isFeatured: featured,
        liveUrl: projectUrl.trim() || undefined
      };

      if (editProject) {
        solutionsStorage.update(editProject.id, payload);
      } else {
        solutionsStorage.create(payload);
      }

      onSaved();
      onClose();
    } catch {
      setFormError('Failed to save project. Please check fields and try again.');
    }
  };

  return (
    <div 
      id="admin-add-project-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-[#E4E1DA] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#171A1F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E4E1DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C79A22]" />
            <h2 className="text-base sm:text-xl font-bold text-[#171A1F]">
              {editProject ? 'Edit Project' : 'Add New Project'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6">
          
          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Project Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Apex Health Clinic Portal"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Project Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Project Live URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Project Live URL (Website / App Demo Link)
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-mono text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* THUMBNAIL & IMAGE UPLOAD SECTION */}
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C79A22]" />
                  <span>Thumbnail / Project Preview</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload a screenshot from your device gallery/files (JPG, PNG, WEBP) to display in the laptop mockup.
                </p>
              </div>

              {/* Hidden File Input for Native Gallery/Picker on Mobile & Desktop */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="project-image-file-input"
              />

              {/* Upload & Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 shrink-0"
                >
                  {isUploadingImage ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : thumbnailUrl ? (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace Image</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                    </>
                  )}
                </button>

                {thumbnailUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Image</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowManualUrlInput(!showManualUrlInput)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{showManualUrlInput ? 'Hide URL' : 'Image URL'}</span>
                </button>
              </div>
            </div>

            {/* Upload Feedback Status */}
            {imageUploadStatus && (
              <div 
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                  imageUploadStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                }`}
              >
                {imageUploadStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{imageUploadStatus.message}</span>
              </div>
            )}

            {/* Optional Manual URL / Presets Input */}
            {showManualUrlInput && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-3 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-700">Enter Image URL Directly:</span>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] text-slate-500 font-bold block">Or Pick a Standard Preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setThumbnailUrl(p.url);
                          setImageUploadStatus({ type: 'success', message: `Applied preset: ${p.label}` });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-300 hover:border-[#2563EB] text-[10.5px] font-semibold text-slate-700"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Laptop Mockup Presentation Area */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-600 font-bold">
                  Laptop Mockup Preview ({thumbnailUrl ? 'Custom Screenshot' : 'Default Placeholder'}):
                </span>
                {thumbnailUrl && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Image Loaded
                  </span>
                )}
              </div>
              
              <div className="bg-slate-900/5 p-3 sm:p-5 rounded-2xl border border-slate-200/80">
                <LaptopMockup 
                  imageSrc={thumbnailUrl} 
                  title={projectName || 'Project Preview'} 
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Project Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the solution features, business value, and key accomplishments..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Client Name & Project Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Client / Business Name (Optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Enterprises"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Project Release Date (Optional)
              </label>
              <input
                type="date"
                value={projectDate}
                onChange={(e) => setProjectDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Technologies Used */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Technologies Used
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                placeholder="e.g. React, Node.js, UPI API..."
                className="flex-grow px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(idx)} className="text-slate-400 hover:text-rose-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#C79A22] rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Featured Project</div>
                <div className="text-[10px] text-slate-500">Highlight with gold star badge</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-[#2563EB] rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Publish Project</div>
                <div className="text-[10px] text-slate-500">Make visible on public portfolio</div>
              </div>
            </label>
          </div>

        </div>

        {/* Modal Buttons Footer */}
        <div className="px-4 sm:px-6 py-4 bg-[#FDFBF7] border-t border-[#E4E1DA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-extrabold text-xs shadow-md flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{editProject ? 'Update & Publish' : 'Publish Project'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
