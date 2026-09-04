import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { BusinessCategory } from '../../types';
import { categoriesStorage, subscribeToCategories } from '../../services/categoriesStorage';
import { AdminCategoryModal } from './AdminCategoryModal';
import { AdminConfirmDeleteModal } from './AdminConfirmDeleteModal';

interface AdminCategoriesDashboardProps {
  onBackToSite: () => void;
}

export const AdminCategoriesDashboard: React.FC<AdminCategoriesDashboardProps> = ({
  onBackToSite
}) => {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BusinessCategory | null>(null);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, title: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    setCategories(categoriesStorage.getAll());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToCategories(loadData);
    return () => unsubscribe();
  }, []);

  const handleSaveCategory = async (data: Partial<BusinessCategory>) => {
    if (editingCategory) {
      await categoriesStorage.update(editingCategory.id, data);
    } else {
      await categoriesStorage.create(data as Omit<BusinessCategory, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoriesStorage.delete(deleteTarget.id);
      setDeleteTarget(null);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete category.');
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await categoriesStorage.toggleStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCategories = categories.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.shortDesc?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-bold flex justify-between items-center">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-700">Dismiss</button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4E1DA] shadow-sm">
        
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-[#E4E1DA] rounded-xl text-xs sm:text-sm text-[#171A1F] focus:outline-none focus:border-[#C79A22] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          
          <button
            onClick={loadData}
            className="p-2 sm:p-2.5 bg-white border border-[#E4E1DA] hover:bg-slate-50 text-[#626873] rounded-xl transition-all flex items-center justify-center"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E4E1DA]">
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-[#171A1F] uppercase tracking-wider w-[60px]">Order</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-[#171A1F] uppercase tracking-wider">Category Name</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-[#171A1F] uppercase tracking-wider">Icon</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-[#171A1F] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-bold text-[#171A1F] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1DA]">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#626873]">
                    <FolderOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm">No categories found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 sm:px-6 sm:py-4 align-middle">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {cat.displayOrder}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4 align-middle">
                      <div className="flex items-center gap-3">
                        {cat.imageUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E4E1DA]">
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-[#E4E1DA] flex items-center justify-center shrink-0">
                            <FolderOpen className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-[#171A1F]">{cat.name}</div>
                          <div className="text-[10px] sm:text-xs text-[#626873] truncate max-w-[200px]">{cat.shortDesc}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 sm:px-6 sm:py-4 align-middle">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium font-mono">
                        {cat.iconName}
                      </div>
                    </td>

                    <td className="px-4 py-3 sm:px-6 sm:py-4 align-middle">
                      <button
                        onClick={() => handleToggleStatus(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                          cat.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {cat.status === 'published' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {cat.status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="px-4 py-3 sm:px-6 sm:py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsAddEditModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-[#C79A22] hover:bg-[#C79A22]/10 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => setDeleteTarget({ id: cat.id, title: cat.name })}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Category"
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

      <AdminCategoryModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <AdminConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={`Delete Category "${deleteTarget?.title}"`}
        description="Are you sure you want to delete this category? This action cannot be undone. Ensure no templates are currently assigned to this category."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
