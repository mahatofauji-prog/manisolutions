import React, { useState, useEffect } from 'react';
import { digitalProductsStorage, subscribeToDigitalProducts } from '../../services/digitalProductsStorage';
import { DigitalProduct } from '../../types';
import { Sparkles, ShoppingCart, ArrowRight, ArrowLeft, Flame, Layers, Search } from 'lucide-react';
import { DigitalProductCard } from '../DigitalProductCard';

interface DigitalProductsStorePageProps {
  onSelectProduct: (product: DigitalProduct, openCheckout?: boolean) => void;
  onNavigateHome: () => void;
}

export const DigitalProductsStorePage: React.FC<DigitalProductsStorePageProps> = ({ onSelectProduct, onNavigateHome }) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'featured'>('featured');

  useEffect(() => {
    const load = () => {
      setProducts(digitalProductsStorage.getPublished());
    };
    load();
    return subscribeToDigitalProducts(load);
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category))).filter(Boolean)];

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (p.name || '').toLowerCase().includes(q) ||
      (p.shortDescription || '').toLowerCase().includes(q) ||
      (p.fullDescription || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'featured') {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
    return 0;
  });

  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className="min-h-screen bg-[var(--theme-bg-secondary)] py-12 lg:py-20 relative overflow-hidden text-left">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-dots opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#C79A22]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Navigation back */}
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22] text-xs font-bold text-[#171A1F] shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#C79A22]" />
            <span>Back to MANI Solution Home</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/40 text-xs font-bold uppercase tracking-widest text-[#C79A22] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>Premium Digital Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            MANI SOLUTION <span className="text-gold-gradient">DIGITAL STORE</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#626873] leading-relaxed max-w-2xl mx-auto font-normal">
            Production-grade trading bots, valuation suites, enterprise AI playbooks, and developer templates with instant secure downloads.
          </p>
        </div>

        {/* Search, Categories & Sorting Bar */}
        <div className="space-y-6">
          <div className="max-w-xl mx-auto relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, category, tags..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#E4E1DA] text-xs sm:text-sm font-medium text-[#171A1F] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C79A22]/50"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 rounded-2xl bg-white border border-[#E4E1DA] text-xs sm:text-sm font-bold text-[#171A1F] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C79A22]/50 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#171A1F] text-white shadow-md'
                      : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F] hover:border-[#C79A22]/50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Section Banner if on 'All' */}
        {activeCategory === 'All' && !searchQuery && featuredProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
              <h2 className="text-lg sm:text-xl font-black text-[#171A1F] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C79A22]" />
                <span>Featured Digital Assets</span>
              </h2>
              <span className="text-xs font-bold text-[#626873]">Top rated & verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.slice(0, 2).map((product) => {
                const discount = product.compareAtPrice && product.compareAtPrice > product.price 
                  ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
                  : 0;

                return (
                  <div
                    key={`feat-${product.id}`}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-[#C79A22]/40 hover:border-[#C79A22] shadow-md hover:shadow-2xl transition-all duration-300 p-6 flex flex-col sm:flex-row gap-6 cursor-pointer items-center"
                  >
                    <div className="w-full sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                      <img
                        src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                          {discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 flex-grow text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C79A22]/10 text-[#C79A22] text-[10px] font-black uppercase">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{product.productType}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#171A1F] group-hover:text-[#C79A22] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#626873] line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-lg font-black text-[#171A1F]">₹{product.price.toLocaleString('en-IN')}</span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through ml-2">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-[#C79A22] group-hover:underline">
                          View Asset <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E4E1DA] pb-3">
            <h2 className="text-lg sm:text-xl font-black text-[#171A1F] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2563EB]" />
              <span>{activeCategory === 'All' ? 'All Digital Products' : `${activeCategory} Products`}</span>
            </h2>
            <span className="text-xs font-bold text-[#626873]">{sortedProducts.length} items available</span>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-[#E4E1DA] shadow-sm max-w-xl mx-auto space-y-4">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-[#171A1F]">No digital products found in this category</h3>
              <p className="text-xs text-[#626873]">
                Explore all categories or reset your search query.
              </p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="px-5 py-2.5 rounded-xl bg-[#171A1F] text-white text-xs font-bold shadow-md hover:bg-black transition-all"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {sortedProducts.map((product) => (
                <DigitalProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
