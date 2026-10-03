import React, { useState, useEffect } from 'react';
import { digitalProductsStorage, subscribeToDigitalProducts } from '../services/digitalProductsStorage';
import { DigitalProduct } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DigitalProductCard } from './DigitalProductCard';

interface DigitalProductsSectionProps {
  onSelectProduct: (product: DigitalProduct, openCheckout?: boolean) => void;
  onViewAllProducts: () => void;
}

export const DigitalProductsSection: React.FC<DigitalProductsSectionProps> = ({ onSelectProduct, onViewAllProducts }) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);

  useEffect(() => {
    const load = () => {
      const all = digitalProductsStorage.getPublished();
      // Sort: Featured first, then latest
      const sorted = [...all].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      // Allow up to 10 for compact catalogue browsing on wide screens / carousel
      setProducts(sorted.slice(0, 10));
    };
    load();
    return subscribeToDigitalProducts(load);
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="digital-products-marketplace" className="py-12 sm:py-16 lg:py-20 bg-[var(--theme-bg-secondary)] relative overflow-hidden border-b border-[#E4E1DA]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-dots opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#C79A22]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[#2563EB]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Section Header with Top Right "View All Products →" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E4E1DA] pb-4 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C79A22]/40 text-[11px] font-bold uppercase tracking-wider text-[#C79A22] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Digital Marketplace</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171A1F] font-sans tracking-tight">
              Digital Product <span className="text-gold-gradient">Solution</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#626873] leading-relaxed max-w-2xl font-normal">
              Premium digital products, e-books, and tools designed to help you work smarter, manage better and grow faster.
            </p>
          </div>

          {/* Top-Right "View All Products →" Button */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              onClick={onViewAllProducts}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#171A1F] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all group"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C79A22] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 1. Mobile Horizontal Scroll Catalogue (Exactly 3 cards visible at a time) */}
        <div className="flex sm:hidden overflow-x-auto gap-2.5 pb-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="w-[31.5%] min-w-[104px] shrink-0 snap-start">
              <DigitalProductCard
                product={product}
                onSelectProduct={onSelectProduct}
                compact={true}
              />
            </div>
          ))}
        </div>

        {/* 2. Desktop Grid (Exactly 3 Products Per Row: md:grid-cols-3) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:hidden gap-4 lg:gap-6 items-stretch">
          {products.slice(0, 6).map((product) => (
            <DigitalProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              compact={false}
            />
          ))}
        </div>

        {/* 3. Large Laptop / Wide Desktop Grid (Exactly 5 Products Per Row: xl:grid-cols-5) */}
        <div className="hidden xl:grid xl:grid-cols-5 gap-4 lg:gap-5 items-stretch">
          {products.slice(0, 10).map((product) => (
            <DigitalProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              compact={true}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

