import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ExternalLink, Filter, Laptop, Smartphone, Cpu, Bot, Zap, Wrench, ShieldCheck, Plus, Settings } from 'lucide-react';
import { LaptopMockup } from './LaptopMockup';
import { ProjectItem } from '../types';
import { solutionsStorage, subscribeToSolutions } from '../services/solutionsStorage';
import { ProjectDetailModal } from './ProjectDetailModal';

interface FeaturedWorkSectionProps {
  onOpenDemoModal?: () => void;
  onNavigateToAdmin?: () => void;
}

export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({
  onOpenDemoModal,
  onNavigateToAdmin
}) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Load projects from storage (mapping SolutionItem to ProjectItem)
  const loadProjects = () => {
    const rawItems = solutionsStorage.getPublished();
    const mapped: ProjectItem[] = rawItems.map(item => ({
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

  // Filter Categories
  const filterCategories = [
    { label: 'All', icon: Laptop },
    { label: 'Websites', icon: Laptop },
    { label: 'Apps', icon: Smartphone },
    { label: 'Software', icon: Cpu },
    { label: 'AI', icon: Bot },
    { label: 'Automation', icon: Zap },
    { label: 'Tools', icon: Wrench },
  ];

  // Helper matcher to filter items into category buckets
  const matchesCategory = (project: ProjectItem, filter: string): boolean => {
    if (filter === 'All') return true;
    return project.category === filter;
  };

  const filteredProjects = projects.filter(p => matchesCategory(p, activeFilter));

  const getCategoryCount = (filterLabel: string) => {
    return projects.filter(p => matchesCategory(p, filterLabel)).length;
  };

  const handleCardClick = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setIsDetailModalOpen(true);
  };

  const handleVisitDirectUrl = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="featured-work-section" className="py-20 lg:py-28 bg-[#FDFBF7] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background Decor Ambient Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E4E1DA] pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171A1F] tracking-tight">
              Featured <span className="gold-gradient">Work</span>
            </h2>

            <p className="text-sm sm:text-base text-[#626873] max-w-2xl font-medium leading-relaxed">
              Explore websites, software, AI tools and digital solutions created by MANI Solution.
            </p>
          </div>
        </div>

        {/* Category Filter System Tabs */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {filterCategories.map(({ label, icon: IconComponent }) => {
              const count = getCategoryCount(label);
              const isActive = activeFilter === label;

              return (
                <button
                  key={label}
                  id={`filter-btn-${label.toLowerCase()}`}
                  onClick={() => setActiveFilter(label)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-lg shadow-black/10 scale-[1.02]'
                      : 'bg-white text-[#626873] border-[#E4E1DA] hover:text-[#171A1F] hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#C79A22]' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-[#C79A22] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E4E1DA] p-8 space-y-3">
            <Laptop className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#171A1F]">Our latest work will appear here.</h3>
            <p className="text-xs text-[#626873]">New projects are being added. Check back soon.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E4E1DA] p-8 space-y-3">
            <Filter className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#171A1F]">No projects found in "{activeFilter}"</h3>
            <p className="text-xs text-[#626873]">Select another category filter above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                onClick={() => handleCardClick(project)}
                className="group cursor-pointer rounded-xl sm:rounded-2xl md:rounded-3xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/60 transition-all duration-300 p-2 sm:p-4 md:p-6 flex flex-col justify-between space-y-3 sm:space-y-4 md:space-y-5 hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1.5"
              >
                {/* 1. Realistic Laptop Mockup Container */}
                <div className="w-full pt-0.5">
                  <LaptopMockup 
                    imageSrc={project.thumbnailUrl}
                    title={project.projectName}
                  />
                </div>

                {/* 2. Project Card Content Body */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    {/* Category Badge & Featured Tag */}
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-100 text-[#171A1F] text-[8.5px] sm:text-[10px] md:text-[10.5px] font-bold border border-slate-200 uppercase tracking-wide">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="px-1.5 py-0.5 sm:px-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[8px] sm:text-[10px] font-bold">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xs sm:text-lg md:text-xl lg:text-2xl font-bold text-[#171A1F] group-hover:text-[#2563EB] transition-colors leading-tight sm:leading-snug">
                      {project.projectName}
                    </h3>

                    {/* Project Description */}
                    <p className="text-[9.5px] sm:text-xs md:text-sm text-[#626873] line-clamp-2 leading-tight sm:leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="hidden sm:flex flex-wrap gap-1 pt-1">
                      {project.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] sm:text-[10px] font-semibold text-slate-700">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-1 py-0.5 rounded bg-slate-100 text-[9px] sm:text-[10px] text-slate-500 font-bold">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Actions */}
                  <div className="pt-2 sm:pt-3 border-t border-[#E4E1DA] flex items-center justify-between gap-1 sm:gap-3">
                    <button
                      onClick={(e) => handleVisitDirectUrl(e, project.projectUrl)}
                      className="inline-flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-[9px] sm:text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </button>

                    <span className="text-[9px] sm:text-xs font-bold text-[#C79A22] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 sm:gap-1">
                      <span>Details</span> <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenDemoModal={onOpenDemoModal}
      />
    </section>
  );
};
