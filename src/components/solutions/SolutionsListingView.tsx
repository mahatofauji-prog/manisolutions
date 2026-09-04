import React, { useState, useMemo, useEffect } from 'react';
import { SolutionItem, SolutionCategory, SolutionContentType } from '../../types';
import { solutionsStorage, subscribeToSolutions } from '../../services/solutionsStorage';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Smartphone, 
  Globe, 
  Bot, 
  Briefcase, 
  BookOpen, 
  Cpu, 
  Radio, 
  Calendar, 
  CheckCircle2, 
  Tag, 
  X,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Eye
} from 'lucide-react';

interface SolutionsListingViewProps {
  onSelectSolution?: (slug: string) => void;
  onSelectRelatedSolution?: (slug: string) => void;
  onOpenDemoModal: () => void;
  onNavigateToAdmin?: () => void;
}

const CATEGORIES: SolutionCategory[] = [
  'All',
  'Software',
  'Apps',
  'Websites',
  'AI Solutions',
  'Business Solutions',
  'Case Studies',
  'Technology',
  'Updates'
];

export const SolutionsListingView: React.FC<SolutionsListingViewProps> = ({
  onSelectSolution,
  onSelectRelatedSolution,
  onOpenDemoModal,
  onNavigateToAdmin
}) => {
  const handleSelect = onSelectSolution || onSelectRelatedSolution || (() => {});
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SolutionCategory>('All');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load published items and subscribe to real-time changes
  useEffect(() => {
    const load = () => {
      setSolutions(solutionsStorage.getPublished());
    };
    load();
    const unsubscribe = subscribeToSolutions(load);
    return () => unsubscribe();
  }, []);

  // Filter solutions dynamically
  const filteredSolutions = useMemo(() => {
    return solutions.filter(item => {
      // Category Filter
      if (selectedCategory !== 'All') {
        const matchesCategory = item.category.toLowerCase() === selectedCategory.toLowerCase();
        // Handle special aliases
        const isSoftwareRelated = selectedCategory === 'Software' && (item.category === 'Software' || item.contentType === 'software');
        const isAppsRelated = selectedCategory === 'Apps' && (item.category === 'Apps' || item.contentType === 'app');
        const isWebsitesRelated = selectedCategory === 'Websites' && (item.category === 'Websites' || item.contentType === 'website');
        const isAiRelated = selectedCategory === 'AI Solutions' && (item.category === 'AI Solutions' || item.contentType === 'ai-solution');
        const isBusinessRelated = selectedCategory === 'Business Solutions' && (item.category === 'Business Solutions' || item.category === 'Software');
        const isCaseStudiesRelated = selectedCategory === 'Case Studies' && (item.category === 'Case Studies' || item.contentType === 'case-study');
        const isTechRelated = selectedCategory === 'Technology' && (item.category === 'Technology' || item.contentType === 'article');
        const isUpdatesRelated = selectedCategory === 'Updates' && (item.category === 'Updates' || item.contentType === 'update');

        if (!matchesCategory && !isSoftwareRelated && !isAppsRelated && !isWebsitesRelated && !isAiRelated && !isBusinessRelated && !isCaseStudiesRelated && !isTechRelated && !isUpdatesRelated) {
          return false;
        }
      }

      // Content Type Filter
      if (selectedContentType !== 'all' && item.contentType !== selectedContentType) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inCategory = item.category.toLowerCase().includes(query);
        const inDesc = item.shortDescription.toLowerCase().includes(query) || item.fullDescription.toLowerCase().includes(query);
        const inTags = item.tags.some(t => t.toLowerCase().includes(query));
        const inTech = item.technologiesUsed.some(tech => tech.toLowerCase().includes(query));
        const inFeatures = item.keyFeatures.some(f => f.toLowerCase().includes(query));

        if (!inTitle && !inCategory && !inDesc && !inTags && !inTech && !inFeatures) {
          return false;
        }
      }

      return true;
    });
  }, [solutions, selectedCategory, selectedContentType, searchQuery]);

  const getContentTypeIcon = (type: SolutionContentType) => {
    switch (type) {
      case 'software':
        return <Layers className="w-3.5 h-3.5" />;
      case 'app':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5" />;
      case 'ai-solution':
        return <Bot className="w-3.5 h-3.5" />;
      case 'case-study':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'article':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'update':
        return <Radio className="w-3.5 h-3.5" />;
      default:
        return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Development':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Concept':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-[#626873] border-slate-500/30';
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedContentType('all');
    setSearchQuery('');
  };

  return (
    <div id="solutions-listing-page" className="pt-8 sm:pt-12 pb-24 lg:pt-14 lg:pb-32 bg-[#F7F6F2] min-h-screen text-[var(--theme-text-primary)] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#0b1b3a]/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-[#C79A22]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-tech-dots opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e293b]/60 border border-[#C79A22]/30 text-xs font-semibold tracking-wider text-[#C79A22] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            MANI Product Featured Work & Knowledge Hub
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171A1F]">
            Our Digital <span className="gold-gradient">Solutions</span>
          </h1>

          <p className="text-base sm:text-lg text-[#626873] leading-relaxed">
            Explore the software, applications, websites and digital solutions built by MANI Solution.
          </p>
        </div>

        {/* Control Bar: Search & Category Filters */}
        <div className="space-y-6">
          
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#626873] pointer-events-none" />
              <input
                id="solutions-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions, software, apps & articles..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/90 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-400 focus:outline-none focus:border-[#C79A22]/60 focus:ring-1 focus:ring-[#C79A22]/50 transition-all text-sm sm:text-base shadow-xl"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-[#626873] hover:text-[#171A1F] hover:bg-white/10 transition-all"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] font-bold border-[#C79A22] shadow-lg shadow-[#C79A22]/20 scale-105'
                      : 'bg-white text-[#626873] border-[#E4E1DA] hover:border-white/25 hover:text-[#171A1F] hover:bg-[#1e293b]/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Status & Count */}
          <div className="flex items-center justify-between text-xs text-[#626873] border-b border-[#E4E1DA] pb-4">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-[#171A1F]">{filteredSolutions.length}</strong> {filteredSolutions.length === 1 ? 'solution' : 'solutions'}</span>
              {(selectedCategory !== 'All' || searchQuery.trim()) && (
                <span className="text-[#C79A22]">• Filtered by: {selectedCategory !== 'All' ? selectedCategory : ''} {searchQuery ? `"${searchQuery}"` : ''}</span>
              )}
            </div>
            
            {(selectedCategory !== 'All' || searchQuery.trim()) && (
              <button
                id="reset-all-filters-btn"
                onClick={clearFilters}
                className="text-[#C79A22] hover:underline flex items-center gap-1 text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Solutions Grid */}
        {filteredSolutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredSolutions.map((item) => (
              <div
                key={item.id}
                id={`solution-card-${item.slug}`}
                onClick={() => handleSelect(item.slug)}
                className="group cursor-pointer rounded-2xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5"
              >
                {/* Card Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F6F2]">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F7F6F2]/85 backdrop-blur-md border border-[#E4E1DA] text-[11px] font-semibold text-[#C79A22]">
                      {getContentTypeIcon(item.contentType)}
                      {item.category}
                    </span>

                    {item.projectStatus && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeColor(item.projectStatus)}`}>
                        {item.projectStatus}
                      </span>
                    )}
                  </div>

                  {item.isFeatured && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C79A22] text-[var(--theme-text-primary)] text-[10px] font-extrabold uppercase tracking-wide shadow-md">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#626873]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(item.projectDate || item.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                      {item.readingTime && (
                        <span>{item.readingTime}</span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors leading-snug">
                      {item.title}
                    </h2>

                    <p className="text-sm text-[#626873] line-clamp-3 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>

                  {/* Key Highlights / Tech Tags */}
                  <div className="space-y-4 pt-2 border-t border-[#E4E1DA]">
                    {item.technologiesUsed && item.technologiesUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.technologiesUsed.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#1e293b]/70 border border-[#E4E1DA] text-[10px] text-[#626873]"
                          >
                            {tech}
                          </span>
                        ))}
                        {item.technologiesUsed.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-[#626873]">
                            +{item.technologiesUsed.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#C79A22] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] text-[#626873] capitalize">
                        {item.contentType.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-2xl bg-white/40 border border-[#E4E1DA] max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1e293b] flex items-center justify-center mx-auto text-[#626873]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#171A1F]">No solutions found</h3>
            <p className="text-sm text-[#626873]">
              We couldn't find any projects or articles matching your search query: <strong className="text-[#171A1F]">"{searchQuery}"</strong>
            </p>
            <button
              id="clear-empty-state-btn"
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-[#C79A22] text-[var(--theme-text-primary)] font-bold text-xs hover:bg-[#b8860b] transition-all"
            >
              Clear Search & Show All
            </button>
          </div>
        )}

        {/* Need a Custom Solution CTA Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] p-8 sm:p-10 border border-[#C79A22]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#171A1F]">
              Have a Specific Requirement in Mind?
            </h3>
            <p className="text-sm text-[#626873] max-w-xl">
              We engineer tailored software, mobile apps, and business systems designed specifically for your unique operational workflow.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="solutions-cta-demo-btn"
              onClick={onOpenDemoModal}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-white to-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] font-bold text-sm shadow-lg shadow-[#C79A22]/20 hover:scale-105 transition-all"
            >
              Request a Free Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
