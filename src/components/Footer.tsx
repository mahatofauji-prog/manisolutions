import React, { useState, useEffect } from 'react';
import { ManiLogo } from './ManiLogo';
import { PageView } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { workStorage, subscribeToWorkApplications } from '../services/workStorage';
import { Phone, Mail, MessageSquare, ArrowUp, ShieldCheck, User, Linkedin, Facebook } from 'lucide-react';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[var(--theme-border)]">
          
          {/* Col 1: Brand & Full Form */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="transform scale-[1.35] sm:scale-[1.5] origin-left my-1">
              <ManiLogo size="md" showSubtitle={true} />
            </div>

            <p className="text-sm text-[var(--theme-text-secondary)] max-w-md leading-relaxed pt-1">
              Digital technology and business solutions for the modern world. Empowering Indian enterprises, institutions, and growing companies with robust digital infrastructure.
            </p>

            <div className="p-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] inline-flex items-center gap-2 text-xs text-[var(--theme-text-secondary)]">
              <User className="w-4 h-4 text-[#C79A22]" />
              <span>Founded by <strong className="text-[var(--theme-text-primary)]">{COMPANY_INFO.founder}</strong></span>
            </div>

            {/* Follow MANI Solution */}
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A22]">
                Follow MANI Solution
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/mani-solution-a300ba344?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[#0A66C2] transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://www.facebook.com/share/1DXiLYyXZd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[#1877F2] transition-colors flex items-center gap-2 text-xs font-semibold shadow-sm"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Company Links */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A22]">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ready-solutions')}
                  className="hover:text-[#ECC348] text-[#ECC348] font-bold transition-colors flex items-center gap-1"
                >
                  <span>Ready Solutions</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#ECC348]/20 text-[#ECC348] rounded font-mono">NEW</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('solutions')}
                  className="hover:text-[#C79A22] text-[#C79A22] font-semibold transition-colors"
                >
                  Our Digital Solutions
                </button>
              </li>
              {isWorkEnabled && (
                <li>
                  <button
                    onClick={() => onNavigate('work-with-us')}
                    className="hover:text-[#2563EB] text-[#2563EB] font-semibold transition-colors"
                  >
                    Work With Us & Earn
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('work')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  Work & Blueprints
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Links */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A22]">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('service-website')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors text-left"
                >
                  Website Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-app')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors text-left"
                >
                  App Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-software')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors text-left"
                >
                  Software Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-ai-automation')}
                  className="hover:text-[var(--theme-text-primary)] transition-colors text-left"
                >
                  Business AI & Automation
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDemoModal}
                  className="text-[#C79A22] font-semibold hover:underline text-left text-xs pt-1 block"
                >
                  + Request Free Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C79A22]">
              Direct Contact
            </h4>
            
            <div className="space-y-2 text-sm text-[var(--theme-text-secondary)]">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex items-center gap-2 hover:text-[#C79A22] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C79A22] shrink-0" />
                <span className="font-mono">{COMPANY_INFO.phone}</span>
              </a>

              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>WhatsApp: {COMPANY_INFO.whatsapp}</span>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-[var(--theme-text-primary)] transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-[#C79A22] shrink-0" />
                <span className="truncate">{COMPANY_INFO.email}</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenDemoModal}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text-primary)] hover:text-[var(--theme-text-primary)] transition-colors text-center"
              >
                Book Architectural Demo
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--theme-text-muted)]">
          <div className="text-center sm:text-left space-y-1">
            <p>© 2026 {COMPANY_INFO.name}. All Rights Reserved.</p>
            <p className="text-[var(--theme-text-muted)]">
              Modern Advancement for New India • Founded by <span className="text-[var(--theme-text-secondary)] font-semibold">{COMPANY_INFO.founder}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors flex items-center gap-1.5"
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
