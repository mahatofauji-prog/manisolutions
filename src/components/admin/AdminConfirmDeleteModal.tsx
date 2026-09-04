import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface AdminConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export const AdminConfirmDeleteModal: React.FC<AdminConfirmDeleteModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      console.error(err);
      setError("Unable to delete. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E4E1DA] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <button 
            onClick={onCancel}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-[#171A1F] mb-2">Delete this {title}?</h3>
        <p className="text-sm text-[#626873] mb-6">
          This action cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-[#171A1F] bg-slate-50 border border-[#E4E1DA] hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 border border-red-600 hover:bg-red-700 hover:border-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isDeleting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
