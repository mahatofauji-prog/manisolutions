import React, { useState, useEffect } from 'react';
import { ManiLogo } from './ManiLogo';
import { PageView } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { workStorage, subscribeToWorkApplications } from '../services/workStorage';
import { Phone, Mail, MessageSquare, ArrowUp, User, Linkedin, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDemoModal }) => {
  const [isWorkEnabled, setIsWorkEnabled] = useState<boolean>(() => workStorage.isFeatureEnabled());

  useEffect(() => {
    setIsWorkEnabled(workStorage.isFeatureEnabled());
    const unsubscribe = subscribeToWorkApplications(() => {
      setIsWorkEnabled(workStorage.isFeatureEnabled());
    });
    return () => unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#F1F0EB] text-[var(--theme-text-muted)] border-t border-[var(--theme-border)] relative overflow-hidden">
      {/* Subtle top golden glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--theme-bg-secondary)] to-transparent" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8">
        
        {/* Top Header: Logo, Description & Founder */}
        <div className="space-y-3 text-left border-b border-[var(--theme-border)] pb-6">
          <div className="flex items-center my-1">
            <ManiLogo size="lg" showSubtitle={true} />
          </div>

          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] max-w-2xl leading-relaxed">
            Digital technology and business solutions for the modern world. Empowering Indian enterprises, institutions, and growing companies with robust digital infrastructure.
          </p>

          <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[var(--theme-border)] inline-flex items-center gap-2 text-xs text-[var(--theme-text-secondary)] shadow-sm">
            <User className="w-3.5 h-3.5 text-[#C79A22]" />
            <span>Founded by <strong className="text-[var(--theme-text-primary)]">{COMPANY_INFO.founder}</strong></span>
          </div>
        </div>

        {/* 2-Column Links Grid (Active on Mobile, Tablet & Desktop) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 border-b border-[var(--theme-border)] pb-6">
          
          {/* Left Column: Follow MANI Solution & Services */}
          <div className="space-y-5 text-left">
            {/* Follow MANI Solution */}
            <div className="space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Follow MANI Solution
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/mani-solution-a300ba344?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[#0A66C2] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.facebook.com/share/1DXiLYyXZd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[#1877F2] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Services
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onNavigate('service-website')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Website Development
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('service-app')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    App Development
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('service-software')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Software Development
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('service-ai-automation')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Business AI & Automation
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenDemoModal}
                    className="text-[#C79A22] font-semibold hover:underline text-left text-xs pt-0.5 block cursor-pointer"
                  >
                    + Request Free Demo
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Company & Legal */}
          <div className="space-y-5 text-left">
            {/* Company */}
            <div className="space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Company
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors leading-snug cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('ready-solutions')}
                    className="hover:text-[#ECC348] text-[#ECC348] font-bold transition-colors flex items-center gap-1 leading-snug cursor-pointer"
                  >
                    <span>ERP & CRM Solutions</span>
                    <span className="text-[9px] px-1 bg-[#ECC348]/20 text-[#ECC348] rounded font-mono">NEW</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('solutions')}
                    className="hover:text-[#C79A22] text-[#C79A22] font-semibold transition-colors leading-snug cursor-pointer"
                  >
                    Our Digital Solutions
                  </button>
                </li>
                {isWorkEnabled && (
                  <li>
                    <button
                      onClick={() => onNavigate('work-with-us')}
                      className="hover:text-[#2563EB] text-[#2563EB] font-semibold transition-colors leading-snug cursor-pointer"
                    >
                      Work With Us & Earn
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => onNavigate('about')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors leading-snug cursor-pointer"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('services')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors leading-snug cursor-pointer"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('work')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors leading-snug cursor-pointer"
                  >
                    Work & Blueprints
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors leading-snug cursor-pointer"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Legal
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => onNavigate('privacy-policy')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('terms-and-conditions')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('refund-cancellation-policy')}
                    className="hover:text-[var(--theme-text-primary)] transition-colors text-left leading-snug cursor-pointer"
                  >
                    Refund & Cancellation Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Direct Contact & Book Architectural Demo */}
        <div className="space-y-4 text-left border-b border-[var(--theme-border)] pb-6">
          <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#C79A22]">
            Direct Contact
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-[var(--theme-text-secondary)]">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="flex items-center gap-2 hover:text-[#C79A22] transition-colors truncate"
            >
              <Phone className="w-4 h-4 text-[#C79A22] shrink-0" />
              <span className="font-mono truncate">{COMPANY_INFO.phone}</span>
            </a>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#25D366] transition-colors truncate"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="truncate">WhatsApp: {COMPANY_INFO.whatsapp}</span>
            </a>

            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center gap-2 hover:text-[var(--theme-text-primary)] transition-colors truncate"
              style={{ overflowWrap: 'anywhere' }}
            >
              <Mail className="w-4 h-4 text-[#C79A22] shrink-0" />
              <span className="truncate">{COMPANY_INFO.email}</span>
            </a>
          </div>

          <div className="pt-1">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text-primary)] shadow-sm transition-colors text-center cursor-pointer"
            >
              Book Architectural Demo
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted)]">
          <div className="text-center sm:text-left space-y-0.5">
            <p>© 2026 {COMPANY_INFO.name}. All Rights Reserved.</p>
            <p className="text-[var(--theme-text-muted)]">
              Modern Advancement for New India • Founded by <span className="text-[var(--theme-text-secondary)] font-semibold">{COMPANY_INFO.founder}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-4 h-4 text-[#C79A22]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
