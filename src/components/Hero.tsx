import React from 'react';
import { PageView } from '../types';
import { HeroCinematicLoop } from './HeroCinematicLoop';

interface HeroProps {
  onNavigate: (page: PageView) => void;
  onOpenDemoModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenDemoModal }) => {
  return (
    <section 
      id="hero-section"
      className="relative w-full aspect-[16/9] overflow-hidden bg-[#0A0E17] border-b border-[#E4E1DA] select-none"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* Ambient Grid Layer */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />
      
      {/* Cinematic Looping Visual Showcase */}
      <div className="relative w-full h-full flex justify-center items-center">
        <HeroCinematicLoop onSelectServiceTab={() => onNavigate('services')} />
      </div>
    </section>
  );
};
