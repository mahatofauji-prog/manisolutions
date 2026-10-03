import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ExternalLink, Filter, Laptop, Smartphone, Cpu, Bot, Zap, Wrench, Globe } from 'lucide-react';
import { LaptopMockup } from './LaptopMockup';
import { ProjectItem } from '../types';
import { solutionsStorage, subscribeToSolutions } from '../services/solutionsStorage';
import { ProjectDetailModal } from './ProjectDetailModal';

interface FeaturedWorkSectionProps {
  onOpenDemoModal?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToSolutions?: () => void;
}

export const FeaturedWorkSection: React.FC<FeaturedWorkSectionProps> = ({
  onOpenDemoModal,
  onNavigateToAdmin,
  onNavigateToSolutions
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

  return (
    <section id="featured-work-section" className="py-12 sm:py-16 lg:py-20 bg-[#FDFBF7] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background Decor Ambient Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Section Header with Top-Right "View All Website & App Solutions →" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E1DA] pb-4 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-[11px] font-bold shadow-sm">
              <Globe className="w-3.5 h-3.5" />
              <span>Web & App Solutions</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171A1F] tracking-tight">
              Website & App <span className="gold-gradient">Solution</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#626873] max-w-2xl font-normal leading-relaxed">
              Explore websites, web applications, and custom digital solutions created by MANI Solution.
            </p>
          </div>

          {/* Top-Right View All Button */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              id="view-all-website-solutions-top-btn"
              onClick={() => {
                if (onNavigateToSolutions) {
                  onNavigateToSolutions();
                } else {
                  window.location.href = '/solutions';
                }
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all group border border-slate-700 cursor-pointer"
            >
              <span>View All Website & App Solutions</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C79A22] group-hover:translate-x-1 transition-transform" />
            </button>
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
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-[#171A1F] text-white border-[#171A1F] shadow-md scale-[1.02]'
                      : 'bg-white text-[#626873] border-[#E4E1DA] hover:text-[#171A1F] hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#C79A22]' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
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
          <>
            {/* 1. Mobile Horizontal Scroll Catalogue (Compact 3 visible at a time) */}
            <div className="flex sm:hidden overflow-x-auto gap-2.5 pb-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleCardClick(project)}
                  className="w-[31.5%] min-w-[104px] shrink-0 snap-start group cursor-pointer bg-white rounded-xl border border-[#E4E1DA] hover:border-[#C79A22] shadow-sm flex flex-col justify-between overflow-hidden text-left"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[8px] font-bold truncate max-w-[85%]">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-2 space-y-1 flex flex-col flex-grow justify-between">
                    <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-tight">
                      {project.projectName}
                    </h4>
                    <span className="text-[9px] font-bold text-[#C79A22] block">
                      Explore →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Grid (Exactly 3 Projects Per Row: md:grid-cols-3) */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:hidden gap-4 lg:gap-6 items-stretch">
              {filteredProjects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => handleCardClick(project)}
                  className="group cursor-pointer rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/60 transition-all duration-300 p-4 md:p-5 flex flex-col justify-between space-y-4 hover:shadow-xl hover:-translate-y-1 text-left"
                >
                  <div className="w-full">
                    <LaptopMockup 
                      imageSrc={project.thumbnailUrl}
                      title={project.projectName}
                    />
                  </div>

                  <div className="space-y-2 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#171A1F] text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#171A1F] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {project.projectName}
                      </h3>

                      <p className="text-xs text-[#626873] line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C79A22] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Wide Laptop / Large Desktop Grid (4-5 Projects Per Row) */}
            <div className="hidden xl:grid xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5 items-stretch">
              {filteredProjects.slice(0, 10).map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleCardClick(project)}
                  className="group cursor-pointer rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/60 transition-all duration-300 p-3.5 flex flex-col justify-between space-y-3 hover:shadow-lg hover:-translate-y-1 text-left"
                >
                  <div className="w-full">
                    <LaptopMockup 
                      imageSrc={project.thumbnailUrl}
                      title={project.projectName}
                    />
                  </div>

                  <div className="space-y-1.5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#171A1F] text-[9px] font-bold border border-slate-200 uppercase">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[9px] font-bold">
                            ★ Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#171A1F] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {project.projectName}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#E4E1DA] flex items-center justify-between text-xs font-bold text-[#C79A22]">
                      <span>View Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
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

