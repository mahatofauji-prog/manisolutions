import React from 'react';
import { Laptop } from 'lucide-react';

interface LaptopMockupProps {
  imageSrc?: string;
  title?: string;
}

export const LaptopMockup: React.FC<LaptopMockupProps> = ({ imageSrc, title }) => {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      {/* Device frame */}
      <div className="relative rounded-t-xl bg-[#1e232d] p-1.5 sm:p-2.5 shadow-xl border border-slate-700/60">
        {/* Camera dot */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-600" />
        
        {/* Screen */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-slate-900 flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title || 'Project preview'}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 p-4">
              <Laptop className="w-8 h-8 opacity-40" />
              <span className="text-[10px] font-mono opacity-60">Preview coming soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Laptop Base */}
      <div className="relative mx-auto h-2 sm:h-3 w-[105%] -left-[2.5%] rounded-b-lg bg-[#2a303c] border-t border-slate-600 shadow-md">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 rounded-b bg-slate-600" />
      </div>
    </div>
  );
};
