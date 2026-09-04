import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { OrderCustomSolutionForm } from './OrderCustomSolutionForm';
import { CustomSolutionOrder } from '../../types';

interface OrderCustomSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: CustomSolutionOrder) => void;
  prefilledSolution?: string;
}

export const OrderCustomSolutionModal: React.FC<OrderCustomSolutionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  prefilledSolution
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      id="order-custom-solution-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E4E1DA] overflow-hidden my-6 transform transition-all max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100/90 hover:bg-slate-200 text-[#171A1F] transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 lg:p-10 custom-scrollbar">
          <OrderCustomSolutionForm
            isModal={true}
            prefilledSolution={prefilledSolution}
            onSuccess={(order) => {
              if (onSuccess) onSuccess(order);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};
