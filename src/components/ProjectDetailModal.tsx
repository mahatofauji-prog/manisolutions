import React from 'react';
import { X, ExternalLink, Calendar, User, Tag, Layers, ArrowLeft, CheckCircle } from 'lucide-react';
import { LaptopMockup } from './LaptopMockup';
import { ProjectItem } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDemoModal?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenDemoModal
}) => {
  if (!isOpen || !project) return null;

  const handleVisitSite = () => {
    if (project.projectUrl) {
      window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      id="project-detail-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-[#E4E1DA] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E1DA] bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#171A1F] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 text-[10px] font-bold">
                ★ Featured Work
              </span>
            )}
          </div>

          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 sm:space-y-8 bg-[#FDFBF7]/50">
          
          {/* Laptop Preview Container */}
          <div className="pt-2">
            <LaptopMockup 
              imageSrc={project.thumbnailUrl} 
              title={project.projectName}
            />
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E1DA] pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#171A1F] tracking-tight">
                  {project.projectName}
                </h2>
                {project.clientName && (
                  <p className="text-xs sm:text-sm text-[#626873] font-medium flex items-center gap-1.5 mt-1">
                    <User className="w-4 h-4 text-[#C79A22]" /> Built for: <span className="text-[#171A1F] font-bold">{project.clientName}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {project.projectUrl && (
                  <button
                    id="visit-live-website-modal-btn"
                    onClick={handleVisitSite}
                    className="px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}

                <button
                  id="modal-back-to-work-btn"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-white border border-[#E4E1DA] hover:bg-slate-100 text-[#171A1F] text-xs sm:text-sm font-bold transition-colors"
                >
                  Back to My Work
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C79A22]">Project Overview</h3>
              <p className="text-sm sm:text-base text-[#414652] leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-[#E4E1DA] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#2563EB]" /> Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date & Category Info */}
              <div className="p-4 rounded-xl bg-white border border-[#E4E1DA] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C79A22]" /> Delivery Information
                </h4>
                <div className="space-y-1 text-xs text-[#626873]">
                  <div><strong className="text-[#171A1F]">Category:</strong> {project.category}</div>
                  {project.projectDate && (
                    <div><strong className="text-[#171A1F]">Release Date:</strong> {new Date(project.projectDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
                  )}
                  <div><strong className="text-[#171A1F]">Status:</strong> <span className="text-emerald-600 font-bold">● Published Solution</span></div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F7F6F2] border-t border-[#E4E1DA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#626873]">
          <span>Need a similar solution for your business?</span>
          <div className="flex items-center gap-3">
            {onOpenDemoModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDemoModal();
                }}
                className="px-4 py-2 rounded-lg bg-[#C79A22] text-white font-bold hover:bg-[#b8860b] transition-colors"
              >
                Get Custom Quote →
              </button>
            )}
            <button
              onClick={onClose}
              className="text-[#171A1F] font-bold hover:underline"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
