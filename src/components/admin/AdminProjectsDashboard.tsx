import React, { useState, useEffect } from 'react';
import { SolutionItem, SolutionContentType, ProjectStatus } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Search, 
  Globe, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff, 
  Star, 
  Image as ImageIcon,
  Layers,
  Tag,
  Briefcase
} from 'lucide-react';

interface AdminProjectsDashboardProps {
  onBackToSite: () => void;
  onViewPublicSolution: (slug: string) => void;
}

export const AdminProjectsDashboard: React.FC<AdminProjectsDashboardProps> = ({
  onBackToSite,
  onViewPublicSolution
}) => {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SolutionItem | null>(null);

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [slug, setSlug] = useState('');
  const [projectType, setProjectType] = useState<SolutionContentType>('website');
  const [category, setCategory] = useState('Websites');
  const [businessType, setBusinessType] = useState('');
  const [projectImage, setProjectImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption?: string }[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [techText, setTechText] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('Live');
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setSolutions(solutionsStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToSolutions(loadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setProjectName('');
    setSlug('');
    setProjectType('website');
    setCategory('Websites');
    setBusinessType('');
    setProjectImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop');
    setGalleryImages([]);
    setNewGalleryUrl('');
    setLiveUrl('https://');
    setShortDesc('');
    setFullDesc('');
    setTechText('React, TypeScript, Tailwind CSS, Node.js');
    setFeaturesText('Mobile Responsive\nHigh Speed Performance\nCustom Admin Panel');
    setProjectStatus('Live');
    setIsFeatured(true);
    setStatus('published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SolutionItem) => {
    setEditingItem(item);
    setProjectName(item.title);
    setSlug(item.slug || '');
    setProjectType(item.contentType || 'website');
    setCategory(item.category || 'Websites');
    setBusinessType(item.clientType || '');
    setProjectImage(item.featuredImage || '');
    setGalleryImages(item.galleryImages || []);
    setNewGalleryUrl('');
    setLiveUrl(item.liveUrl || item.demoUrl || '');
    setShortDesc(item.shortDescription || '');
    setFullDesc(item.fullDescription || '');
    setTechText((item.technologiesUsed || item.tags || []).join(', '));
    setFeaturesText((item.keyFeatures || []).join('\n'));
    setProjectStatus(item.projectStatus || 'Live');
    setIsFeatured(Boolean(item.isFeatured));
    setStatus(item.status || 'published');
    setIsModalOpen(true);
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages(prev => [...prev, { url: newGalleryUrl.trim(), caption: projectName || 'Screenshot' }]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !shortDesc.trim() || !projectImage.trim()) {
      alert('Please enter Project Name, Short Description, and Project Image.');
      return;
    }

    const techArray = techText.split(',').map(t => t.trim()).filter(Boolean);
    const featuresArray = featuresText.split('\n').map(f => f.trim()).filter(Boolean);

    if (editingItem) {
      solutionsStorage.update(editingItem.id, {
        title: projectName.trim(),
        slug: slug.trim() || undefined,
        contentType: projectType,
        category,
        clientType: businessType.trim(),
        featuredImage: projectImage.trim(),
        galleryImages,
        liveUrl: liveUrl.trim(),
        demoUrl: liveUrl.trim(),
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim() || shortDesc.trim(),
        technologiesUsed: techArray,
        tags: techArray,
        keyFeatures: featuresArray,
        projectStatus,
        isFeatured,
        status
      });
      showToast(`Project '${projectName}' updated successfully.`);
    } else {
      solutionsStorage.create({
        title: projectName.trim(),
        slug: slug.trim() || undefined,
        contentType: projectType,
        category,
        clientType: businessType.trim(),
        featuredImage: projectImage.trim(),
        galleryImages,
        liveUrl: liveUrl.trim(),
        demoUrl: liveUrl.trim(),
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim() || shortDesc.trim(),
        technologiesUsed: techArray,
        tags: techArray,
        keyFeatures: featuresArray,
        benefits: ['High conversion architecture', 'Modern mobile-first design'],
        projectDate: new Date().toISOString().slice(0, 10),
        seoTitle: `${projectName.trim()} | MANI Solution`,
        seoDescription: shortDesc.trim(),
        projectStatus,
        isFeatured,
        status
      });
      showToast(`Project '${projectName}' published successfully.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete '${name}'? This cannot be undone.`)) {
      await solutionsStorage.delete(id);
      showToast(`Project '${name}' deleted.`);
    }
  };

  const handleTogglePublish = (id: string, name: string, currentStatus: string) => {
    solutionsStorage.togglePublish(id);
    showToast(`'${name}' is now ${currentStatus === 'published' ? 'DRAFT' : 'PUBLISHED'}.`);
  };

  const handleToggleFeatured = (id: string) => {
    solutionsStorage.toggleFeatured(id);
  };

  const filteredSolutions = solutions.filter(s => {
    const matchesType = typeFilter === 'ALL' || s.contentType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery ||
      s.title.toLowerCase().includes(q) ||
      (s.clientType && s.clientType.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q);

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#171A1F] text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-[#C79A22]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C79A22]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E1DA] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#171A1F]">
              Website & App CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
              Single Source of Truth
            </span>
          </div>
          <p className="text-xs text-[#626873] mt-1">
            Manage live website, mobile app, and custom software projects. Changes immediately reflect on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C79A22]" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#626873] font-semibold block">Total Projects</span>
          <span className="text-2xl font-black text-[#171A1F]">{solutions.length}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-emerald-700 font-semibold block">Live Published</span>
          <span className="text-2xl font-black text-emerald-600">
            {solutions.filter(s => s.status === 'published').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-[#C79A22] font-semibold block">Featured on Home</span>
          <span className="text-2xl font-black text-[#C79A22]">
            {solutions.filter(s => s.isFeatured && s.status === 'published').length}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
          <span className="text-[11px] text-amber-700 font-semibold block">Draft / Hidden</span>
          <span className="text-2xl font-black text-amber-600">
            {solutions.filter(s => s.status === 'draft').length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name, client, tech or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Project Types</option>
            <option value="website">Websites</option>
            <option value="app">Mobile Apps</option>
            <option value="software">Custom Software</option>
            <option value="ai-solution">AI Solutions</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {filteredSolutions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E4E1DA] space-y-2">
          <Globe className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No projects found</h3>
          <p className="text-xs text-slate-400">Click "Add Project" above to create a new portfolio project.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm divide-y divide-[#E4E1DA]">
          {filteredSolutions.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 transition-colors ${
                item.status === 'published' ? 'hover:bg-slate-50/60' : 'bg-slate-50/40 opacity-75'
              }`}
            >
              <div className="flex items-start gap-4 flex-grow">
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-20 h-14 sm:w-28 sm:h-20 rounded-xl object-cover border border-[#E4E1DA] shrink-0 bg-slate-100"
                  />
                ) : (
                  <div className="w-20 h-14 sm:w-28 sm:h-20 rounded-xl bg-slate-100 border border-[#E4E1DA] flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-slate-300" />
                  </div>
                )}

                <div className="space-y-1.5 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-[#171A1F]">{item.title}</span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {item.status === 'published' ? '✓ Published' : 'Draft / Hidden'}
                    </span>

                    {item.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C79A22]/10 text-[#C79A22] border border-[#C79A22]/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#C79A22]" /> Featured
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.contentType || item.category}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Status: {item.projectStatus}
                    </span>
                  </div>

                  {item.clientType && (
                    <div className="text-[11px] text-[#626873] flex items-center gap-1 font-semibold">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{item.clientType}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.shortDescription}
                  </p>

                  {item.technologiesUsed && item.technologiesUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.technologiesUsed.slice(0, 5).map((tech, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Open Live Website / App"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => onViewPublicSolution(item.slug || item.id)}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                    title="View Solution Detail Page"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleTogglePublish(item.id, item.title, item.status)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      item.status === 'published'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                    }`}
                    title={item.status === 'published' ? 'Unpublish from Public Site' : 'Publish to Public Site'}
                  >
                    {item.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E4E1DA] shadow-2xl p-6 space-y-5 text-left my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22] block">
                  Website & App CMS
                </span>
                <h3 className="text-lg font-black text-[#171A1F]">
                  {editingItem ? 'Edit Project' : 'Add New Website / App Project'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahavtar Babaji Portal"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug (Auto-generated if empty)</label>
                  <input
                    type="text"
                    placeholder="e.g. mahavtarbabaji-in"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Type *</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as SolutionContentType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="website">Website</option>
                    <option value="app">Mobile App</option>
                    <option value="software">Custom Software</option>
                    <option value="ai-solution">AI Automation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Websites / E-commerce / Tech Support"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Business Type / Client</label>
                  <input
                    type="text"
                    placeholder="e.g. Mobosavior Tech Services"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Main Project Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={projectImage}
                    onChange={(e) => setProjectImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Live Website / App Link</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Gallery Images (Optional)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Paste additional image URL (https://...)"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="flex-grow px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold cursor-pointer"
                  >
                    Add to Gallery
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {galleryImages.map((g, idx) => (
                      <div key={idx} className="relative group w-16 h-12 rounded-lg overflow-hidden border border-slate-300">
                        <img src={g.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="One or two sentences highlighting the project's core feature and value."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive case study overview describing problem solved, architecture, and impact."
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Technologies Used (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Tailwind CSS, PostgreSQL"
                    value={techText}
                    onChange={(e) => setTechText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="In Development">In Development</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Beta">Beta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Key Features (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Mobile Responsive&#10;WhatsApp Direct Connect&#10;Custom Quotation Estimator"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E4E1DA] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#E4E1DA]">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-[#C79A22] focus:ring-[#C79A22]"
                    />
                    <span>Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={status === 'published'}
                      onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                      className="rounded text-emerald-600 focus:ring-emerald-600"
                    />
                    <span>Publish (Visible on Public Website)</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#171A1F] hover:bg-black text-white font-bold cursor-pointer shadow-sm"
                  >
                    {editingItem ? 'Save Changes' : 'Publish Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
