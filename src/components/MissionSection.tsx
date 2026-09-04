import React from 'react';
import { Sparkles, Globe, Cpu, ArrowUpRight } from 'lucide-react';

export const MissionSection: React.FC = () => {
  return (
    <section id="company-mission-section" className="py-20 lg:py-24 bg-[#F7F6F2] relative overflow-hidden border-t border-[#E4E1DA]">
      {/* Background Indian digital network graphic abstraction */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C79A22]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/35 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
          <Sparkles className="w-3.5 h-3.5" />
          The Vision
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
          Our <span className="text-gold-gradient">Mission</span>
        </h2>

        {/* Sophisticated Mission Statement Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-[var(--theme-bg-secondary)] border border-[#C79A22]/40 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#C79A22]/15 rounded-full blur-2xl pointer-events-none" />
          
          <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#171A1F] leading-relaxed font-sans">
            “To make modern digital technology accessible, practical and useful for businesses and organizations across India.”
          </p>

          {/* Micro Indian Digital Network Nodes */}
          <div className="mt-8 pt-6 border-t border-[#E4E1DA] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-3 rounded-xl bg-white border border-[#E4E1DA] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22]">Accessible</span>
              <div className="text-xs text-[#626873]">Clean interfaces anyone can manage with zero technical background.</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E4E1DA] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22]">Practical</span>
              <div className="text-xs text-[#626873]">Built to resolve everyday billing, customer, and staffing bottlenecks.</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E4E1DA] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C79A22]">Scalable</span>
              <div className="text-xs text-[#626873]">Cloud-ready foundations that grow effortlessly as your business expands.</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
