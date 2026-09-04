import React, { useState, useEffect } from 'react';
import { ManiLogo } from './ManiLogo';
import { PageView } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { workStorage, subscribeToWorkApplications } from '../services/workStorage';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Cpu, 
  Bot,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenDemoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenDemoModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isWorkEnabled, setIsWorkEnabled] = useState<boolean>(() => workStorage.isFeatureEnabled());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsWorkEnabled(workStorage.isFeatureEnabled());
    const unsubscribe = subscribeToWorkApplications(() => {
      setIsWorkEnabled(workStorage.isFeatureEnabled());
    });
    return () => unsubscribe();
  }, []);

  const handleLinkClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allNavItems = [
    { label: 'Home', page: 'home' as PageView },
    { 
      label: 'Services', 
      page: 'services' as PageView,
      hasDropdown: true 
    },
    { label: 'Ready Solutions', page: 'ready-solutions' as PageView },
    { label: 'Solutions', page: 'solutions' as PageView },
    ...(isWorkEnabled ? [{ label: 'Work With Us', page: 'work-with-us' as PageView }] : []),
    { label: 'About', page: 'about' as PageView },
    { label: 'Work', page: 'work' as PageView },
    { label: 'Contact', page: 'contact' as PageView },
  ];

  const navItems = allNavItems;

  const serviceSubItems = [
    { label: 'Website Development', page: 'service-website' as PageView, icon: Globe, desc: 'Responsive & conversion websites' },
    { label: 'App Development', page: 'service-app' as PageView, icon: Smartphone, desc: 'iOS & Android mobile apps' },
    { label: 'Custom Software', page: 'service-software' as PageView, icon: Cpu, desc: 'Operations & billing systems' },
    { label: 'Business AI & Automation', page: 'service-ai-automation' as PageView, icon: Bot, desc: '24/7 AI assistants & voice agents' },
  ];

  return (
    <>
      <header
        id="main-navbar"
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--theme-bg-main)]/95 backdrop-blur-md border-b border-[#E4E1DA] shadow-md shadow-black/10 py-1.5 sm:py-2.5 md:py-3'
            : 'bg-[var(--theme-bg-main)]/90 backdrop-blur-md py-2 sm:py-3 md:py-3.5 border-b border-[#E4E1DA]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between min-h-[48px] sm:min-h-[56px]">
          {/* Logo */}
          <div className="transform scale-[1.35] sm:scale-[1.5] origin-left my-1">
            <ManiLogo
              size="md"
              onClick={() => handleLinkClick('home')}
              className="transition-transform duration-200 hover:scale-[1.01]"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      id="nav-services-dropdown-btn"
                      onClick={() => handleLinkClick('services')}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                        currentPage.startsWith('service')
                          ? 'text-[var(--theme-text-primary)] bg-white/10 shadow-inner text-gold-bright'
                          : 'text-[#626873] hover:text-[#171A1F] hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-[#C79A22]' : ''
                        }`}
                      />
                    </button>

                    {/* Services Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-72 pt-2 z-50">
                        <div className="glass-panel rounded-xl p-2 shadow-2xl border border-[#C79A22]/25 bg-[#091326]/95 backdrop-blur-xl">
                          <div className="px-3 py-2 border-b border-[#E4E1DA] mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C79A22]">
                              Our Core Capabilities
                            </span>
                          </div>
                          {serviceSubItems.map((sub) => {
                            const IconComponent = sub.icon;
                            return (
                              <button
                                key={sub.label}
                                onClick={() => handleLinkClick(sub.page)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                                  currentPage === sub.page
                                    ? 'bg-[#C79A22]/15 text-[var(--theme-text-primary)] border border-[#C79A22]/30'
                                    : 'hover:bg-slate-100 text-[#171A1F] hover:text-[var(--theme-text-primary)]'
                                }`}
                              >
                                <div className="p-2 rounded-md bg-[#0f2042] text-[#C79A22] shrink-0 mt-0.5 border border-[#C79A22]/20">
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold">{sub.label}</div>
                                  <div className="text-xs text-[#626873] font-normal">{sub.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                          <div className="pt-2 mt-1 border-t border-[#E4E1DA]">
                            <button
                              onClick={() => handleLinkClick('services')}
                              className="w-full text-center py-2 text-xs font-semibold text-[#C79A22] hover:text-[#fde68a] flex items-center justify-center gap-1"
                            >
                              View All Solutions Overview <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleLinkClick(item.page)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.page
                      ? 'text-[#171A1F] bg-slate-100 font-semibold text-[#C79A22]'
                      : 'text-[#626873] hover:text-[#171A1F] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Contact Tooltip / Link */}
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              id="nav-quick-call-btn"
              className="p-2.5 rounded-lg text-[#626873] hover:text-[#171A1F] hover:bg-slate-50 border border-[#E4E1DA] transition-colors"
              title="Call MANI Solution"
            >
              <Phone className="w-4 h-4 text-[#C79A22]" />
            </a>

            <button
              id="nav-get-free-demo-btn"
              onClick={onOpenDemoModal}
              className="relative group overflow-hidden rounded-lg px-5 py-2.5 bg-[#C79A22] text-[var(--theme-text-primary)] text-sm font-bold shadow-md shadow-[#C79A22]/20 hover:shadow-lg hover:shadow-[#C79A22]/35 transition-all duration-300 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current text-[var(--theme-text-primary)]" />
              <span>Get Free Demo</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-[42px] h-[42px] sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-slate-100/90 border border-[#E4E1DA] text-[#171A1F] hover:text-[var(--theme-text-primary)] active:scale-95 transition-all shadow-sm shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#F7F6F2]/98 backdrop-blur-2xl px-5 pt-4 pb-6 overflow-y-auto flex flex-col justify-between animate-fadeIn">
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#E4E1DA] flex items-center justify-between">
              <div className="transform scale-[1.35] sm:scale-[1.5] origin-left my-1">
                <ManiLogo
                  size="sm"
                  onClick={() => handleLinkClick('home')}
                  className="cursor-pointer"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-[#171A1F] hover:bg-slate-200"
                aria-label="Close Mobile Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleLinkClick('home')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'home' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleLinkClick('services')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'services' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                Services Overview
              </button>

              {/* Sub-services on mobile */}
              <div className="pl-4 space-y-1.5 border-l-2 border-[#C79A22]/30 my-1">
                {serviceSubItems.map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => handleLinkClick(sub.page)}
                    className={`block w-full text-left py-2 px-3 rounded-lg text-sm ${
                      currentPage === sub.page ? 'text-[#C79A22] font-semibold bg-slate-100' : 'text-[#626873]'
                    }`}
                  >
                    • {sub.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleLinkClick('ready-solutions')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors flex items-center justify-between ${
                  currentPage === 'ready-solutions' || currentPage === 'ready-solution-detail' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                <span>Ready Solutions</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#C79A22]/20 text-[#C79A22] font-mono rounded font-bold">NEW</span>
              </button>

              <button
                onClick={() => handleLinkClick('solutions')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'solutions' || currentPage === 'solution-detail' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                Our Digital Solutions
              </button>

              {isWorkEnabled && (
                <button
                  onClick={() => handleLinkClick('work-with-us')}
                  className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    currentPage === 'work-with-us' ? 'bg-blue-600/20 text-blue-600 border border-blue-600/30' : 'text-blue-600 font-bold'
                  }`}
                >
                  Work With Us & Earn
                </button>
              )}

              <button
                onClick={() => handleLinkClick('about')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'about' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                About MANI Solution
              </button>

              <button
                onClick={() => handleLinkClick('work')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'work' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                Work & Sample Solutions
              </button>

              <button
                onClick={() => handleLinkClick('contact')}
                className={`text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  currentPage === 'contact' ? 'bg-[#C79A22]/20 text-[#C79A22] border border-[#C79A22]/30' : 'text-[#171A1F]'
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E4E1DA] space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full py-3.5 rounded-xl bg-[#C79A22] text-[var(--theme-text-primary)] font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-[#C79A22]/20"
            >
              <Sparkles className="w-5 h-5 text-[var(--theme-text-primary)]" />
              Get Free Demo
            </button>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="py-3 px-3 rounded-xl bg-slate-100 border border-[#E4E1DA] text-[#171A1F] text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C79A22]" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(COMPANY_INFO.defaultWhatsAppMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-sm font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <div className="text-center text-[11px] text-[#626873] pt-2">
              Founder: <span className="text-[#171A1F] font-semibold">{COMPANY_INFO.founder}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
