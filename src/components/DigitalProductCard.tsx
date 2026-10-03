import React from 'react';
import { DigitalProduct } from '../types';
import { ArrowRight } from 'lucide-react';

interface DigitalProductCardProps {
  product: DigitalProduct;
  onSelectProduct: (product: DigitalProduct, openCheckout?: boolean) => void;
  className?: string;
  showDiscountBadge?: boolean;
  compact?: boolean;
}

export const DigitalProductCard: React.FC<DigitalProductCardProps> = ({
  product,
  onSelectProduct,
  className = '',
  showDiscountBadge = true,
  compact = false
}) => {
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  if (compact) {
    return (
      <div
        onClick={() => onSelectProduct(product, false)}
        className={`group bg-white rounded-xl sm:rounded-2xl border border-[#E4E1DA] hover:border-[#C79A22] shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer h-full select-none ${className}`}
      >
        {/* Compact Image */}
        <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-slate-50 shrink-0">
          <img
            src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {discount > 0 && showDiscountBadge && (
            <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] sm:text-[10px] font-black shadow z-10">
              {discount}% OFF
            </span>
          )}

          {product.isFeatured && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#C79A22] text-[#060e20] text-[8px] sm:text-[9px] font-black uppercase z-10">
              Featured
            </span>
          )}
        </div>

        {/* Compact Content */}
        <div className="p-2 sm:p-3.5 flex flex-col flex-grow justify-between space-y-1.5 sm:space-y-2 text-left">
          <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] group-hover:text-[#C79A22] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 flex-wrap pt-1 border-t border-slate-100">
            <span className="text-xs sm:text-sm font-black text-[#171A1F]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectProduct(product, false)}
      className={`group bg-white rounded-2xl border border-[#E4E1DA] hover:border-[#C79A22]/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer h-full ${className}`}
    >
      {/* Image Wrapper */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Container */}
        <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none z-10">
          {product.category && (
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] sm:text-[11px] font-extrabold text-[#C79A22] border border-[#E4E1DA] shadow-sm uppercase tracking-wider shrink-0 max-w-[70%] truncate pointer-events-auto">
              {product.category}
            </span>
          )}

          <div className="flex items-center gap-1.5 flex-wrap ml-auto pointer-events-auto">
            {product.isFeatured && (
              <span className="px-2.5 py-1 rounded-full bg-[#C79A22] text-[#060e20] text-[10px] sm:text-[11px] font-black shadow-md uppercase tracking-wider shrink-0">
                Featured
              </span>
            )}
            {(product.offer?.isEnabled && product.offer.badge) ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow shrink-0">
                {product.offer.badge}
              </span>
            ) : (discount > 0 && showDiscountBadge && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black shadow shrink-0">
                {discount}% OFF
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Content: Title, Description, and Purchase Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-4 text-left">
        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-extrabold text-[#171A1F] group-hover:text-[#C79A22] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-[#626873] line-clamp-2 leading-relaxed font-normal">
            {product.shortDescription}
          </p>
        </div>

        {/* Purchase Section: Price Row and Buy Now Button below */}
        <div className="mt-auto pt-3.5 border-t border-[#E4E1DA] space-y-3">
          {/* Price & Product Type Row */}
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg lg:text-xl font-black text-[#171A1F]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.productType && (
              <span className="text-[10px] sm:text-[11px] text-emerald-700 font-bold uppercase tracking-wider shrink-0">
                {product.productType}
              </span>
            )}
          </div>

          {/* Buy Now CTA Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product, true);
            }}
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#C79A22] hover:bg-[#B38A1E] active:scale-[0.99] text-[#171A1F] text-xs sm:text-sm font-black shadow-sm group-hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

