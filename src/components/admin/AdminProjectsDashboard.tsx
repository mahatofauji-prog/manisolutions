import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Star, 
  Eye, 
  EyeOff, 
  Sparkles, 
  FolderPlus, 
  CheckCircle, 
  AlertCircle,
  X,
  Laptop
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { AdminAddProjectModal } from './AdminAddProjectModal';

interface AdminProjectsDashboardProps {
  onBackToSite?: () => void;
}

export const AdminProjectsDashboard: React.FC<AdminProjectsDashboardProps> = ({
  onBackToSite
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  
  // Custom Delete Confirmation State
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadProjects = () => {
    const raw = solutionsStorage.getAll();
    const mapped: ProjectItem[] = raw.map(item => ({
      id: item.id,
      projectName: item.title,
      category: item.category,
      description: item.shortDescription || item.fullDescription,
      projectUrl: item.liveUrl || 'https://manisolutions.com',
      thumbnailUrl: item.featuredImage,
      technologies: item.technologiesUsed || [],
      clientName: item.clientType,
      projectDate: item.projectDate,
      featured: item.isFeatured,
      published: item.status === 'published',
      createdAt: item.createdAt
    }));
    setProjects(mapped);
  };

  useEffect(() => {
    loadProjects();
    const unsubscribe = subscribeToSolutions(loadProjects);
    return () => unsubscribe();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  // Open custom confirmation dialog
  const handleRequestDelete = (project: ProjectItem) => {
    setProjectToDelete(project);
  };

  // Confirmed Permanent Delete
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const deleted = solutionsStorage.delete(projectToDelete.id);
      if (deleted) {
        loadProjects();
        showToast(`"${projectToDelete.projectName}" deleted successfully.`, 'success');
        setProjectToDelete(null);
      } else {
        showToast('Failed to delete project from storage.', 'error');
      }
    } catch {
      showToast('Error deleting project. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = (project: ProjectItem) => {
    const newStatus = project.published ? 'draft' : 'published';
    solutionsStorage.update(project.id, {
      status: newStatus
    });
    loadProjects();
    showToast(
      `Project "${project.projectName}" is now ${newStatus === 'published' ? 'Published' : 'saved as Draft'}.`,
      'success'
    );
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    const newFeatured = !project.featured;
    solutionsStorage.update(project.id, {
      isFeatured: newFeatured
    });
    loadProjects();
    showToast(
      `Project "${project.projectName}" ${newFeatured ? 'marked as Featured' : 'removed from Featured'}.`,
      'success'
    );
  };

  // Stats calculation
  const totalProjects = projects.length;
  const publishedCount = projects.filter(p => p.published).length;
  const draftCount = projects.filter(p => !p.published).length;
  const featuredCount = projects.filter(p => p.featured).length;

  const filteredProjects = projects.filter(p =>
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171A1F] py-6 sm:py-8 px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs sm:text-sm font-bold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/70 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Title & Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" /> MANI Solution CMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171A1F]">
              Featured Work / Projects
            </h1>
            <p className="text-xs sm:text-sm text-[#626873]">
              Add, edit, publish and showcase custom websites, apps, AI tools and digital solutions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {onBackToSite && (
              <button
                onClick={onBackToSite}
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-[#E4E1DA] hover:bg-slate-100 text-xs font-bold text-[#171A1F] transition-colors"
              >
                ← Back to Main Site
              </button>
            )}

            <button
              id="admin-add-new-project-top-btn"
              onClick={handleOpenAddModal}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Total Projects</div>
            <div className="text-2xl sm:text-3xl font-black text-[#171A1F]">{totalProjects}</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">Published</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{publishedCount}</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600">Featured</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{featuredCount}</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E4E1DA] shadow-sm space-y-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Drafts</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-500">{draftCount}</div>
          </div>
        </div>

        {/* Search Bar & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-[#E4E1DA]">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, category, client..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#171A1F] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Projects List / Table */}
        <div className="bg-white rounded-2xl border border-[#E4E1DA] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E4E1DA] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Project Preview</th>
                  <th className="py-3.5 px-4">Name & Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No projects match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Preview Image Thumbnail */}
                      <td className="py-3 px-4 w-28">
                        <div className="w-20 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                          {project.thumbnailUrl ? (
                            <img
                              src={project.thumbnailUrl}
                              alt={project.projectName}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-1 text-center">
                              <Laptop className="w-3.5 h-3.5 text-[#C79A22]" />
                              <span className="text-[8px] font-semibold text-slate-300">Preview</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Name & Short Description */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-[#171A1F] text-sm leading-tight">
                          {project.projectName}
                        </div>
                        <div className="text-[11px] text-[#626873] line-clamp-1 mt-0.5">
                          {project.description}
                        </div>
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#2563EB] hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                          >
                            <span>{project.projectUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] uppercase font-bold">
                          {project.category}
                        </span>
                      </td>

                      {/* Published Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold inline-flex items-center gap-1 transition-all ${
                            project.published
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {project.published ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                          <span>{project.published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(project)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            project.featured
                              ? 'bg-amber-100 border-amber-300 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-500'
                          }`}
                          title={project.featured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRequestDelete(project)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div 
          id="admin-delete-project-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setProjectToDelete(null)}
        >
          <div 
            className="bg-white border border-[#E4E1DA] rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full space-y-5 text-[#171A1F] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-[#171A1F]">
                  Delete this project?
                </h3>
                <p className="text-xs sm:text-sm text-[#626873]">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Project:</div>
              <div className="font-bold text-sm text-[#171A1F]">{projectToDelete.projectName}</div>
              <div className="text-[11px] text-slate-500">Category: {projectToDelete.category}</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Project'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      <AdminAddProjectModal
        isOpen={isAddModalOpen}
        editProject={editingProject}
        onClose={() => setIsAddModalOpen(false)}
        onSaved={() => {
          loadProjects();
          showToast(
            editingProject ? 'Project updated successfully!' : 'New project published successfully!',
            'success'
          );
        }}
      />
    </div>
  );
};
