import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  Award,
  ChevronRight
} from 'lucide-react';

import scene1Img from '../assets/images/hero_scene_01_intro_1787469759473.jpg';
import scene2Img from '../assets/images/hero_scene_02_website_1787469774719.jpg';
import scene3Img from '../assets/images/hero_scene_03_app_1787469789661.jpg';
import scene4Img from '../assets/images/hero_scene_04_software_1787469802547.jpg';
import scene5Img from '../assets/images/hero_scene_05_aichat_1787469827904.jpg';
import scene6Img from '../assets/images/hero_scene_06_aivoice_1787469841796.jpg';
import scene7Img from '../assets/images/hero_scene_07_automation_1787469861902.jpg';
import scene8Img from '../assets/images/hero_scene_08_results_1787469876079.jpg';
import scene9Img from '../assets/images/hero_scene_09_multibiz_1787469895332.jpg';
import scene10Img from '../assets/images/hero_scene_10_outro_1787469911683.jpg';

interface SceneData {
  id: number;
  headline: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  icon: React.ReactNode;
  badge: string;
  storyPill: string;
}

interface HeroCinematicLoopProps {
  onSelectServiceTab?: () => void;
}

export const HeroCinematicLoop: React.FC<HeroCinematicLoopProps> = ({ onSelectServiceTab }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const scenes: SceneData[] = [
    {
      id: 1,
      headline: "Websites That Grow Businesses",
      subtitle: "Fast, Mobile-Responsive Websites Built for Sales, Leads & Conversions",
      image: scene2Img,
      fallbackImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
      icon: <Globe className="w-3.5 h-3.5 text-[#2563EB]" />,
      badge: "Website Development",
      storyPill: "0.3s Load Speed • SEO Optimized"
    },
    {
      id: 2,
      headline: "Smart Apps. Better Customer Experience.",
      subtitle: "Custom iOS & Android Mobile Applications for Modern Fast-Growing Brands",
      image: scene3Img,
      fallbackImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1600&q=80",
      icon: <Smartphone className="w-3.5 h-3.5 text-[#0284C7]" />,
      badge: "App Development",
      storyPill: "Instant UPI Sync • Smooth Native UI"
    },
    {
      id: 3,
      headline: "Business Software, Built Around You.",
      subtitle: "Tailored Management, Automated Billing & Custom ERP Systems",
      image: scene4Img,
      fallbackImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      icon: <Cpu className="w-3.5 h-3.5 text-[#059669]" />,
      badge: "Custom Software",
      storyPill: "GST Synced • Automated Invoicing"
    },
    {
      id: 4,
      headline: "Your Business, With an AI Assistant.",
      subtitle: "24/7 WhatsApp & Web AI Answering Inquiries Instantly",
      image: scene5Img,
      fallbackImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
      icon: <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />,
      badge: "Business AI Chat",
      storyPill: "< 0.8s Auto Reply • Catalog Sharing"
    },
    {
      id: 5,
      headline: "Never Miss a Customer Call.",
      subtitle: "Virtual AI Voice Receptionist Handling Calls & Appointment Booking",
      image: scene6Img,
      fallbackImage: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1600&q=80",
      icon: <PhoneCall className="w-3.5 h-3.5 text-[#D97706]" />,
      badge: "AI Voice Assistant",
      storyPill: "24/7 Call Sync • Zero Wait Time"
    },
    {
      id: 6,
      headline: "Turn Inquiries Into Qualified Leads.",
      subtitle: "Automated Lead Inflow, Customer Nurturing & CRM Management",
      image: scene7Img,
      fallbackImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80",
      badge: "Business Automation",
      icon: <Zap className="w-3.5 h-3.5 text-[#2563EB]" />,
      storyPill: "+145% Lead Inflow • 24 hrs Saved/Wk"
    },
    {
      id: 7,
      headline: "Automate & Manage Your Operations.",
      subtitle: "Real-Time Staff, Order & Analytics Dashboards for Business Growth",
      image: scene8Img,
      fallbackImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
      icon: <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />,
      badge: "Management Systems",
      storyPill: "+180% Business Growth • Real-Time ROI"
    },
    {
      id: 8,
      headline: "Built Around Your Business.",
      subtitle: "Empowering Local & Enterprise Brands Across Modern India",
      image: scene1Img,
      fallbackImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
      icon: <Sparkles className="w-3.5 h-3.5 text-[#C79A22]" />,
      badge: "MANI Solution",
      storyPill: "Empowering Indian Entrepreneurs"
    },
    {
      id: 9,
      headline: "Complete Digital Transformation.",
      subtitle: "Websites • Mobile Apps • Custom Software • AI Assistants",
      image: scene9Img,
      fallbackImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
      icon: <Users className="w-3.5 h-3.5 text-[#7C3AED]" />,
      badge: "All-In-One Ecosystem",
      storyPill: "99.4% Client Satisfaction"
    },
    {
      id: 10,
      headline: "MANI Solution",
      subtitle: "Digital Solutions Built Around Your Business",
      image: scene10Img,
      fallbackImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      icon: <Award className="w-3.5 h-3.5 text-[#C79A22]" />,
      badge: "Trusted Tech Partner",
      storyPill: "Transform Your Business Today"
    }
  ];

  const SCENE_INTERVAL_MS = 3800; // 3.8 seconds seamless scene cycle

  // Preload images
  useEffect(() => {
    scenes.forEach((scene) => {
      const img = new Image();
      img.src = scene.image;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
    }, SCENE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [scenes.length]);

  const activeScene = scenes[currentSceneIndex];

  const handleImageError = (sceneId: number) => {
    setFailedImages((prev) => ({ ...prev, [sceneId]: true }));
  };

  return (
    <div 
      id="hero-cinematic-showcase" 
      className="relative w-full h-full aspect-[16/9] overflow-hidden select-none bg-[#090D16]"
      style={{ aspectRatio: '16 / 9' }}
    >
      {/* 1. Cinematic Crossfading Background Scene Layers */}
      {scenes.map((scene, idx) => {
        const isActive = idx === currentSceneIndex;
        const isFailed = failedImages[scene.id];
        const displaySrc = isFailed ? scene.fallbackImage : (scene.image || scene.fallbackImage);

        return (
          <div
            key={scene.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Ken Burns Scale Effect */}
            <div className="relative w-full h-full overflow-hidden bg-slate-950">
              <img
                src={displaySrc}
                alt={scene.headline}
                referrerPolicy="no-referrer"
                loading="eager"
                onError={() => handleImageError(scene.id)}
                className={`w-full h-full object-cover transform transition-transform duration-[4500ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              
              {/* Natural Rich Gradient Overlay to ensure maximum text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent" />
            </div>
          </div>
        );
      })}

      {/* 2. Floating Minimalist Story Overlay */}
      <div 
        className="absolute inset-0 z-20 flex flex-col justify-between text-white pointer-events-none"
        style={{ padding: 'clamp(0.4rem, 2vw, 1.75rem)' }}
      >
        
        {/* Top Header Row with Brand & Progress Bar */}
        <div className="w-full flex items-center justify-between pointer-events-auto shrink-0 gap-2">
          <div 
            className="flex items-center bg-white/95 backdrop-blur-md rounded-full border border-[#E4E1DA] shadow-lg text-slate-900"
            style={{ 
              paddingLeft: 'clamp(0.35rem, 1vw, 0.75rem)',
              paddingRight: 'clamp(0.35rem, 1vw, 0.75rem)',
              paddingTop: 'clamp(0.15rem, 0.4vw, 0.375rem)',
              paddingBottom: 'clamp(0.15rem, 0.4vw, 0.375rem)',
              gap: 'clamp(0.25rem, 0.5vw, 0.5rem)'
            }}
          >
            <span 
              className="rounded-full bg-[#10B981] animate-pulse shrink-0" 
              style={{ width: 'clamp(4px, 0.5vw, 8px)', height: 'clamp(4px, 0.5vw, 8px)' }}
            />
            <span 
              className="font-black font-sans tracking-wide text-[#171A1F] whitespace-nowrap"
              style={{ fontSize: 'clamp(0.55rem, 1.05vw, 0.75rem)' }}
            >
              MANI Solution
            </span>
          </div>

          {/* Scene Progress Indicators */}
          <div 
            className="flex items-center bg-slate-950/60 backdrop-blur-md rounded-full border border-white/10"
            style={{ 
              paddingLeft: 'clamp(0.35rem, 0.8vw, 0.625rem)',
              paddingRight: 'clamp(0.35rem, 0.8vw, 0.625rem)',
              paddingTop: 'clamp(0.15rem, 0.4vw, 0.375rem)',
              paddingBottom: 'clamp(0.15rem, 0.4vw, 0.375rem)',
              gap: 'clamp(0.15rem, 0.4vw, 0.375rem)'
            }}
          >
            {scenes.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSceneIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  height: 'clamp(3px, 0.35vw, 6px)',
                  width: i === currentSceneIndex ? 'clamp(12px, 2vw, 24px)' : 'clamp(3px, 0.4vw, 6px)',
                  backgroundColor: i === currentSceneIndex ? '#C79A22' : 'rgba(255, 255, 255, 0.3)'
                }}
                title={`Scene ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Lower Left Headline & Contextual Story Badge */}
        <div 
          className="my-auto w-full max-w-2xl text-left pointer-events-auto"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'clamp(0.25rem, 0.9vw, 0.75rem)',
            paddingTop: 'clamp(0.1rem, 0.5vw, 0.5rem)',
            paddingBottom: 'clamp(0.1rem, 0.5vw, 0.5rem)'
          }}
        >
          {/* Service Category Badge */}
          <div 
            className="inline-flex items-center self-start rounded-md sm:rounded-lg bg-white/95 backdrop-blur-md border border-[#E4E1DA] shadow-md text-slate-900"
            style={{ 
              paddingLeft: 'clamp(0.35rem, 0.9vw, 0.75rem)',
              paddingRight: 'clamp(0.35rem, 0.9vw, 0.75rem)',
              paddingTop: 'clamp(0.12rem, 0.35vw, 0.25rem)',
              paddingBottom: 'clamp(0.12rem, 0.35vw, 0.25rem)',
              gap: 'clamp(0.25rem, 0.5vw, 0.375rem)'
            }}
          >
            <span style={{ display: 'inline-flex', width: 'clamp(10px, 1.2vw, 15px)', height: 'clamp(10px, 1.2vw, 15px)' }}>
              {activeScene.icon}
            </span>
            <span 
              className="font-bold font-sans tracking-wide text-[#171A1F] whitespace-nowrap"
              style={{ fontSize: 'clamp(0.55rem, 1.05vw, 0.75rem)' }}
            >
              {activeScene.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h2 
            className="font-extrabold text-white tracking-tight drop-shadow-md font-sans"
            style={{ 
              fontSize: 'clamp(0.85rem, 2.5vw, 2.25rem)',
              lineHeight: 1.15
            }}
          >
            {activeScene.headline}
          </h2>

          {/* Subtitle */}
          <p 
            className="text-slate-200 font-medium max-w-xl drop-shadow-sm font-sans"
            style={{ 
              fontSize: 'clamp(0.625rem, 1.2vw, 1rem)',
              lineHeight: 1.25
            }}
          >
            {activeScene.subtitle}
          </p>

          {/* Storytelling Outcome Pill & CTA */}
          <div 
            className="flex items-center flex-wrap"
            style={{ gap: 'clamp(0.35rem, 0.8vw, 0.75rem)', paddingTop: 'clamp(0.1rem, 0.4vw, 0.25rem)' }}
          >
            <div 
              className="inline-flex items-center rounded-lg sm:rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 shadow-xl text-white"
              style={{ 
                paddingLeft: 'clamp(0.35rem, 0.9vw, 0.75rem)',
                paddingRight: 'clamp(0.35rem, 0.9vw, 0.75rem)',
                paddingTop: 'clamp(0.12rem, 0.35vw, 0.25rem)',
                paddingBottom: 'clamp(0.12rem, 0.35vw, 0.25rem)',
                gap: 'clamp(0.25rem, 0.5vw, 0.375rem)'
              }}
            >
              <span 
                className="font-mono font-bold text-[#00F0FF] whitespace-nowrap"
                style={{ fontSize: 'clamp(0.5rem, 0.9vw, 0.656rem)' }}
              >
                {activeScene.storyPill}
              </span>
            </div>

            {onSelectServiceTab && (
              <button
                type="button"
                onClick={onSelectServiceTab}
                className="inline-flex items-center rounded-lg sm:rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold transition-colors whitespace-nowrap cursor-pointer"
                style={{ 
                  paddingLeft: 'clamp(0.35rem, 0.9vw, 0.75rem)',
                  paddingRight: 'clamp(0.35rem, 0.9vw, 0.75rem)',
                  paddingTop: 'clamp(0.12rem, 0.35vw, 0.25rem)',
                  paddingBottom: 'clamp(0.12rem, 0.35vw, 0.25rem)',
                  gap: 'clamp(0.2rem, 0.4vw, 0.25rem)',
                  fontSize: 'clamp(0.55rem, 0.95vw, 0.75rem)'
                }}
              >
                <span>Explore Service</span>
                <ChevronRight style={{ width: 'clamp(8px, 1vw, 12px)', height: 'clamp(8px, 1vw, 12px)' }} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Ambient Tagline */}
        <div 
          className="w-full flex items-center justify-between font-mono text-slate-300 border-t border-white/10 shrink-0"
          style={{ 
            fontSize: 'clamp(0.5rem, 0.85vw, 0.656rem)',
            paddingTop: 'clamp(0.15rem, 0.4vw, 0.375rem)'
          }}
        >
          <span className="text-[#38BDF8] font-bold truncate max-w-[70%] sm:max-w-none">
            Building Digital Solutions for Modern Businesses
          </span>
          <span className="hidden sm:inline text-amber-300 font-semibold whitespace-nowrap">
            • Modern Advancement for New India
          </span>
        </div>

      </div>
    </div>
  );
};
