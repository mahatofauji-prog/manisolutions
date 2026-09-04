import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUpRight, Search, Eye, EyeOff, GripVertical } from 'lucide-react';
import { BusinessAiItem } from '../../types';
import { businessAiStorage, subscribeToBusinessAi } from '../../services/businessAiStorage';
import { AdminAiAutomationEditor } from './AdminAiAutomationEditor';
import { AdminConfirmDeleteModal } from './AdminConfirmDeleteModal';

interface AdminAiAutomationDashboardProps {
  onViewPublicSolution: (slug: string) => void;
}

export const AdminAiAutomationDashboard: React.FC<AdminAiAutomationDashboardProps> = ({
  onViewPublicSolution
}) => {
  const [solutions, setSolutions] = useState<BusinessAiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, title: string } | null>(null);

  const loadSolutions = () => {
    setSolutions(businessAiStorage.getAll());
  };

  useEffect(() => {
    loadSolutions();
    const unsubscribe = subscribeToBusinessAi(loadSolutions);
    return () => unsubscribe();
  }, []);

  const handleNew = () => {
    setEditingId(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    loadSolutions();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    return new Promise<void>((resolve, reject) => {
      try {
        businessAiStorage.delete(deleteTarget.id);
        setDeleteTarget(null);
        loadSolutions();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleTogglePublish = (item: BusinessAiItem) => {
    businessAiStorage.update(item.id, {
      status: item.status === 'published' ? 'draft' : 'published'
    });
    loadSolutions();
  };

  const filteredSolutions = solutions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditorOpen) {
    return (
      <AdminAiAutomationEditor
        solutionId={editingId}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#171A1F]">AI & Automation CMS</h2>
          <p className="text-[#626873]">Manage your Business AI solutions and automation workflows.</p>
        </div>
        
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#171A1F] text-white rounded-xl font-bold hover:bg-[#2D313A] transition-all shadow-lg shadow-black/10"
        >
          <Plus className="w-5 h-5" />
          Add New Solution
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center gap-2 bg-[#F7F6F2]">
          <Search className="w-5 h-5 text-[#626873]" />
          <input
            type="text"
            placeholder="Search AI solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-[#171A1F] placeholder:text-[#626873]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-[#E4E1DA]">
                <th className="p-4 text-xs font-bold text-[#626873] uppercase tracking-wider w-10">Order</th>
                <th className="p-4 text-xs font-bold text-[#626873] uppercase tracking-wider">Solution</th>
                <th className="p-4 text-xs font-bold text-[#626873] uppercase tracking-wider">Category</th>
                <th className="p-4 text-xs font-bold text-[#626873] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-[#626873] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1DA]">
              {filteredSolutions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#626873]">
                    No AI solutions found. Click 'Add New Solution' to create one.
                  </td>
                </tr>
              ) : (
                filteredSolutions.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F6F2] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[#626873] font-bold text-xs cursor-grab">
                        {item.order || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-[#E4E1DA] overflow-hidden bg-slate-100 shrink-0">
                          {item.thumbnailUrl && (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#171A1F]">{item.title}</div>
                          <div className="text-xs text-[#626873] mt-0.5 max-w-xs truncate">{item.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-[#171A1F] rounded-md text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          item.status === 'published' 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {item.status === 'published' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {item.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'published' && (
                          <button
                            onClick={() => onViewPublicSolution(item.slug)}
                            className="p-2 text-[#626873] hover:text-[#C79A22] transition-colors"
                            title="View Public Page"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="p-2 text-[#626873] hover:text-[#C79A22] transition-colors"
                          title="Edit Solution"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                          className="p-2 text-[#626873] hover:text-red-500 transition-colors"
                          title="Delete Solution"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <AdminConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || 'item'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
