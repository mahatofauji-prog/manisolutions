import React, { useState, useEffect } from 'react';
import { ManiLogo } from './ManiLogo';
import { COMPANY_INFO } from '../data/companyData';
import { User, ShieldCheck, Target, Building, Phone, Mail, Linkedin, Award, Star } from 'lucide-react';
import { founderProfileStorage, subscribeToFounderProfile } from '../services/founderProfileStorage';
import { LeadershipProfile } from '../types';
import { HARIOM_MAHATO_PHOTO, DEFAULT_FOUNDER_PHOTO } from '../assets/founderImage';

export const AboutSection: React.FC = () => {
  const [leadership, setLeadership] = useState<LeadershipProfile[]>(() => founderProfileStorage.getPublishedLeadership());

  useEffect(() => {
    const handleUpdate = () => {
      setLeadership(founderProfileStorage.getPublishedLeadership());
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Brand Emblem & Founder / Leadership Card */}
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

              {/* Leadership / Founder Profiles (Database Driven - Single Source of Truth) */}
              <div className="space-y-4 text-left">
                {leadership.map((leader) => {
                  const isFounder = leader.role === 'Founder' || leader.name.toLowerCase().includes('hariom');
                  const photoSrc = leader.photoUrl && leader.photoUrl.trim() !== ''
                    ? leader.photoUrl
                    : (isFounder ? HARIOM_MAHATO_PHOTO : DEFAULT_FOUNDER_PHOTO);

                  return (
                    <div 
                      key={leader.id}
                      className={`p-4 sm:p-5 rounded-2xl transition-all space-y-3 ${
                        isFounder
                          ? 'bg-gradient-to-br from-white via-amber-50/20 to-white border-2 border-[#C79A22]/50 shadow-md ring-1 ring-[#C79A22]/20'
                          : 'bg-[var(--theme-bg-secondary)] border border-[#E4E1DA] hover:border-[#C79A22]/50 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {/* Photo or Initials Avatar */}
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 overflow-hidden shrink-0 bg-slate-100 relative flex items-center justify-center ${
                          isFounder
                            ? 'border-[#C79A22] ring-4 ring-[#C79A22]/30 shadow-lg'
                            : 'border-white ring-4 ring-slate-200 shadow-md'
                        }`}>
                          <img
                            src={photoSrc}
                            alt={leader.name}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (isFounder) {
                                if (target.src !== HARIOM_MAHATO_PHOTO) {
                                  target.src = HARIOM_MAHATO_PHOTO;
                                }
                              } else {
                                target.src = DEFAULT_FOUNDER_PHOTO;
                              }
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C79A22] font-black block">
                              {leader.designation}
                            </span>
                            {leader.role && (
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                isFounder
                                  ? 'bg-[#C79A22] text-[#060e20] shadow-sm'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}>
                                {leader.role}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-[#171A1F] font-sans tracking-tight">
                            {leader.name}
                          </h4>
                          <p className="text-xs text-[#626873] leading-relaxed pt-0.5">
                            {leader.shortBio}
                          </p>
                          {leader.socialLinks?.linkedin && (
                            <a
                              href={leader.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline pt-1 font-semibold"
                            >
                              <Linkedin className="w-3 h-3" />
                              <span>LinkedIn Profile</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
