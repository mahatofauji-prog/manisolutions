import React, { useState, useEffect } from 'react';
import { ManiLogo } from './ManiLogo';
import { COMPANY_INFO } from '../data/companyData';
import { User, ShieldCheck, Target, Building, Phone, Mail } from 'lucide-react';
import { founderProfileStorage, subscribeToFounderProfile } from '../services/founderProfileStorage';
import { FounderProfile } from '../types';

export const AboutSection: React.FC = () => {
  const [founderProfile, setFounderProfile] = useState<FounderProfile>(() => founderProfileStorage.get());
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setFounderProfile(founderProfileStorage.get());
      setImgError(false);
    };
    handleUpdate();
    const unsubscribe = subscribeToFounderProfile(handleUpdate);
    return () => unsubscribe();
  }, []);

  return (
    <section id="about-mani-solutions" className="py-20 lg:py-28 bg-[#F7F6F2] relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#C79A22]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C79A22]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Tag */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C79A22]/30 text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            <Building className="w-3.5 h-3.5" />
            Corporate Profile
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171A1F] font-sans tracking-tight">
            About <span className="text-gold-gradient">MANI Solution</span>
          </h2>

          <p className="text-base sm:text-lg text-[#626873]">
            Modern Advancement for New India
          </p>
        </div>

        {/* 2-Column Corporate Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Emblem & Founder Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Brand Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white via-[var(--theme-bg-secondary)] to-[var(--theme-bg-secondary)] border border-[#C79A22]/35 shadow-2xl space-y-6 text-center">
              <div className="flex justify-center">
                <ManiLogo size="xl" showSubtitle={false} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#171A1F] font-sans">
                  {COMPANY_INFO.name}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#C79A22] font-semibold">
                  {COMPANY_INFO.fullName}
                </p>
              </div>

              {/* Founder Section Card with Dynamic Larger Profile Image */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] text-left space-y-3.5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Founder Profile Photo (2x larger circular profile with clean border) */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-white ring-4 ring-[#C79A22]/20 shadow-lg overflow-hidden shrink-0 bg-slate-100 relative group flex items-center justify-center">
                    {founderProfile.photoUrl && !imgError ? (
                      <img
                        src={founderProfile.photoUrl}
                        alt={founderProfile.name || 'Founder Mr. Hariom Mahato'}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Clean Professional Default Profile Placeholder */
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200 text-[#171A1F]">
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#C79A22]/80 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Founder Information */}
                  <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C79A22] font-bold block">
                      {founderProfile.designation || 'FOUNDER & LEAD TECHNOLOGIST'}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-[#171A1F] font-sans tracking-tight">
                      {founderProfile.name || 'Mr. Hariom Mahato'}
                    </h4>
                    <p className="text-xs text-[#626873] leading-relaxed pt-0.5">
                      {founderProfile.bio || 'Dedicated to empowering Indian enterprises with robust, transparent, and future-proof digital infrastructure.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contacts */}
              <div className="grid grid-cols-2 gap-2 text-left text-xs">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="p-2.5 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/40 text-[#626873] hover:text-[#171A1F] flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span className="truncate">{COMPANY_INFO.phone}</span>
                </a>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="p-2.5 rounded-xl bg-white border border-[#E4E1DA] hover:border-[#C79A22]/40 text-[#626873] hover:text-[#171A1F] flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C79A22]" />
                  <span className="truncate">Email Team</span>
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Mission & Core Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#171A1F] font-sans leading-snug">
                Empowering Businesses Across India Through Purpose-Driven Technology.
              </h3>

              <p className="text-base text-[#626873] leading-relaxed">
                <strong>MANI Solution</strong> (<em>Modern Advancement for New India</em>) is a digital solutions company founded by Hariom Mahato.
              </p>

              <p className="text-base text-[#626873] leading-relaxed">
                MANI Solution is a digital solutions company providing professional websites, custom software, mobile applications, automation solutions and business management systems for modern businesses, institutions and organizations across India.
              </p>
            </div>

            {/* Core Values Pillar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl glass-card border border-[#E4E1DA] space-y-2">
                <div className="flex items-center gap-2 text-[#C79A22]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold text-[#171A1F]">Integrity & Transparency</span>
                </div>
                <p className="text-xs text-[#626873] leading-relaxed">
                  Clear timelines, transparent cost structures, and real functional deliverables with zero misleading claims.
                </p>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-[#E4E1DA] space-y-2">
                <div className="flex items-center gap-2 text-[#C79A22]">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-bold text-[#171A1F]">Practical Business Utility</span>
                </div>
                <p className="text-xs text-[#626873] leading-relaxed">
                  Every feature built solves a real everyday problem — saving staff hours, automating billing, and boosting sales.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
