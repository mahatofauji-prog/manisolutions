import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  Filter, 
  X, 
  ArrowLeft, 
  School, 
  Hospital, 
  Utensils, 
  ShoppingBag, 
  Dumbbell, 
  Scissors, 
  GraduationCap, 
  HeartHandshake, 
  Building2, 
  Briefcase 
} from 'lucide-react';
import { ReadySolutionItem, PageView } from '../../types';
import { readySolutionsStorage, subscribeToReadySolutions } from '../../services/readySolutionsStorage';
import { READY_SOLUTIONS_CATEGORIES } from '../../data/readySolutionsData';
import { ReadySolutionCard } from './ReadySolutionCard';
import { GetSolutionModal } from './GetSolutionModal';

interface ReadySolutionsPageProps {
  onNavigate: (page: PageView) => void;
  onSelectSolution: (solution: ReadySolutionItem) => void;
}

export const ReadySolutionsPage: React.FC<ReadySolutionsPageProps> = ({
  onNavigate,
  onSelectSolution
}) => {
  const [solutions, setSolutions] = useState<ReadySolutionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedSolutionForModal, setSelectedSolutionForModal] = useState<ReadySolutionItem | null>(null);
  const [isGetModalOpen, setIsGetModalOpen] = useState(false);

  const loadAllPublished = () => {
    // Shows ALL published solutions (NO 6-project limit)
    const published = readySolutionsStorage.getPublished();
    setSolutions(published);
  };

  useEffect(() => {
    loadAllPublished();
    const unsubscribe = subscribeToReadySolutions(loadAllPublished);
    return () => unsubscribe();
  }, []);

  // Compute dynamic category list from existing items + standard presets
  const categories = useMemo(() => {
    const fromItems = solutions.map(s => s.category).filter(Boolean);
    const combined = Array.from(new Set(['All', ...READY_SOLUTIONS_CATEGORIES, ...fromItems]));
    return combined;
  }, [solutions]);

  // Filter solutions by category & search query
  const filteredSolutions = useMemo(() => {
    return solutions.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesCategory = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
      
      if (!q) return matchesCategory;

      const matchesSearch = 
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.fullDescription.toLowerCase().includes(q) ||
        (item.features && item.features.some(f => f.toLowerCase().includes(q))) ||
        (item.suitableFor && item.suitableFor.some(sf => sf.toLowerCase().includes(q))) ||
        (item.technology && item.technology.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [solutions, searchQuery, activeCategory]);

  const handleGetSolution = (solution: ReadySolutionItem) => {
    setSelectedSolutionForModal(solution);
    setIsGetModalOpen(true);
  };

  return (
    <div id="ready-solutions-page" className="pt-8 sm:pt-12 pb-24 lg:pt-14 lg:pb-32 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Back navigation & breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#626873] hover:text-[#171A1F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs text-[#626873] font-medium">
            Showing <strong className="text-[#171A1F]">{filteredSolutions.length}</strong> of <strong className="text-[#171A1F]">{solutions.length}</strong> ready products
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C79A22]/10 border border-[#C79A22]/30 text-[#C79A22] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turnkey Software Products</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171A1F] tracking-tight">
            Ready Solutions
          </h1>

          <p className="text-sm sm:text-base text-[#626873] leading-relaxed">
            Explore our collection of pre-built digital solutions designed for different businesses and organizations.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-4">
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-[#626873] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ready Solutions by name, category, features..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-[#E4E1DA] text-sm text-[#171A1F] placeholder:text-[#626873] shadow-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dynamic Category Pill Filters */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isActive
                      ? 'bg-[#171A1F] text-white shadow-md'
                      : 'bg-white text-[#626873] border border-[#E4E1DA] hover:border-slate-300 hover:text-[#171A1F]'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Solutions' : cat}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Full Grid Display of ALL Published Ready Solutions */}
        {filteredSolutions.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#E4E1DA] text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-[#171A1F]">
              {searchQuery || activeCategory !== 'All' 
                ? 'No Ready Solutions Match Your Filter' 
                : 'No Ready Solutions are currently available.'}
            </h3>
            <p className="text-xs text-[#626873]">
              {searchQuery || activeCategory !== 'All'
                ? 'Try resetting the search query or selecting "All Solutions" to see all available products.'
                : 'Check back soon as we continuously deploy new software solutions.'}
            </p>
            {(searchQuery || activeCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#171A1F] text-white text-xs font-bold shadow-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
            {filteredSolutions.map((solution) => (
              <ReadySolutionCard
                key={solution.id}
                solution={solution}
                onViewDetails={(sol) => onSelectSolution(sol)}
                onGetSolution={handleGetSolution}
              />
            ))}
          </div>
        )}

      </div>

      {/* Get Solution Request Modal */}
      <GetSolutionModal
        solution={selectedSolutionForModal}
        isOpen={isGetModalOpen}
        onClose={() => {
          setIsGetModalOpen(false);
          setSelectedSolutionForModal(null);
        }}
      />
    </div>
  );
};
