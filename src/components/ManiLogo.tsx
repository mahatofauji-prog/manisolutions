import React, { useState, useEffect } from 'react';
import { brandLogoStorage, subscribeToBrandLogo } from '../services/brandLogoStorage';

interface ManiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'badge';
  className?: string;
  onClick?: () => void;
}

export const ManiLogo: React.FC<ManiLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'full',
  className = '',
  onClick
}) => {
  const [logoUrl, setLogoUrl] = useState<string>(() => brandLogoStorage.getActiveLogoUrl());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setLogoUrl(brandLogoStorage.getActiveLogoUrl());
      setHasError(false);
    };

    handleUpdate();
    const unsubscribe = subscribeToBrandLogo(handleUpdate);
    return () => unsubscribe();
  }, []);

  const iconSizeMap = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
    xl: 'w-12 h-12 sm:w-16 sm:h-16'
  };

  const titleSizeMap = {
    sm: 'text-sm sm:text-base',
    md: 'text-[18px] sm:text-[19px] md:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl'
  };

  const subtitleSizeMap = {
    sm: 'text-[7px] sm:text-[8px] tracking-wider',
    md: 'text-[7.5px] xs:text-[8px] sm:text-[9.5px] md:text-[11px] tracking-tight xs:tracking-wider sm:tracking-widest',
    lg: 'text-[9px] sm:text-xs tracking-widest',
    xl: 'text-xs sm:text-sm tracking-widest'
  };

  return (
    <div
      id="mani-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Round Shape Brand Logo Image */}
      <div className={`relative flex items-center justify-center shrink-0 rounded-full overflow-hidden border-2 border-[#C79A22]/70 shadow-md bg-slate-950 ${iconSizeMap[size]}`}>
        {!hasError && logoUrl ? (
          <img
            src={logoUrl}
            alt="MANI Solution Logo"
            onError={() => setHasError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          /* SVG Vector Fallback */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0f1d] to-[#040711] text-[#ECC348]">
            <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#C79A22" strokeWidth="3" opacity="0.6" />
              <path
                d="M26 72V30L50 54L74 30V72"
                fill="none"
                stroke="url(#goldGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="54" r="3.5" fill="#ECC348" />
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECC348" />
                  <stop offset="50%" stopColor="#C79A22" />
                  <stop offset="100%" stopColor="#E2B744" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>

      {/* Typography */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
            <span className={`font-sans font-extrabold tracking-tight text-[var(--theme-text-primary)] ${titleSizeMap[size]}`}>
              MANI
            </span>
            <span className={`font-sans font-semibold tracking-wider text-[#A67C00] ${titleSizeMap[size]}`}>
              Solution
            </span>
          </div>

          {showSubtitle && (
            <span className={`font-medium uppercase text-[var(--theme-text-muted)] mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis leading-none ${subtitleSizeMap[size]}`}>
              Modern Advancement for New India
            </span>
          )}
        </div>
      )}
    </div>
  );
};


