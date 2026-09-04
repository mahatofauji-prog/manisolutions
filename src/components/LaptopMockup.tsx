import React, { useState } from 'react';
import { Laptop, Sparkles } from 'lucide-react';

interface LaptopMockupProps {
  imageSrc: string;
  title?: string;
  className?: string;
  aspectRatio?: string;
  showGlassSheen?: boolean;
}

export const LaptopMockup: React.FC<LaptopMockupProps> = ({
  imageSrc,
  title = "Project Preview",
  className = "",
  showGlassSheen = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const hasValidSrc = Boolean(imageSrc && imageSrc.trim() && !imgError);

  return (
    <div className={`relative w-full max-w-4xl mx-auto group ${className}`}>
      {/* Laptop Screen Body Frame */}
      <div className="relative mx-auto rounded-t-2xl bg-gradient-to-b from-[#2A2E35] via-[#1E2228] to-[#121519] p-2.5 sm:p-3 md:p-3.5 shadow-2xl border border-slate-700/60 transition-transform duration-500 group-hover:scale-[1.01]">
        
        {/* Top Web Camera Dot & Sensor */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700/80" />
          <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* 16:9 Inner Screen Display Container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-t-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
          {hasValidSrc ? (
            /* Real Web Image Screenshot */
            <img
              src={imageSrc}
              alt={title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            /* Clean Default Tech Screen Placeholder */
            <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#090D16] flex flex-col items-center justify-center p-4 text-center space-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-[#C79A22] shadow-lg">
                <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-[#C79A22]" />
              </div>
              <div className="relative z-10 space-y-0.5 max-w-[200px] sm:max-w-xs">
                <div className="text-[11px] sm:text-xs font-bold text-slate-200 truncate">{title}</div>
                <div className="text-[9px] sm:text-[10px] text-[#A67C00] font-semibold flex items-center justify-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> MANI Solution Preview
                </div>
              </div>
            </div>
          )}

          {/* Screen Glass Reflection Sheen */}
          {showGlassSheen && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/15 pointer-events-none" />
          )}

          {/* Subtle Inner Screen Shadow */}
          <div className="absolute inset-0 shadow-inner shadow-black/40 pointer-events-none" />
        </div>
      </div>

      {/* Laptop Base Hinge & Keyboard Deck */}
      <div className="relative mx-auto w-[106%] -ml-[3%] h-3 sm:h-4 md:h-4.5 bg-gradient-to-b from-[#3A3F47] via-[#2A2E35] to-[#1A1D22] rounded-b-xl border-t border-slate-600/50 shadow-xl flex items-center justify-center">
        {/* Center Opening Notch Lip */}
        <div className="w-14 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-[#121519] rounded-b-md border-x border-b border-slate-700/60" />
      </div>

      {/* Soft Ambient Laptop Shadow */}
      <div className="w-[90%] mx-auto h-3 sm:h-5 bg-black/40 blur-xl rounded-full -mt-1 sm:-mt-2 pointer-events-none" />
    </div>
  );
};
