import React, { useState } from 'react';
import { PageView, ReadySolutionItem, WebsiteTemplate, DigitalProduct } from './types';
import { SERVICES_DATA, COMPANY_INFO } from './data/companyData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { ServicesSection } from './components/ServicesSection';
import { WhyManiSection } from './components/WhyManiSection';
import { ReadySolutionsSection } from './components/ready-solutions/ReadySolutionsSection';
import { ReadySolutionsPage } from './components/ready-solutions/ReadySolutionsPage';
import { ReadySolutionDetailView } from './components/ready-solutions/ReadySolutionDetailView';
import { BusinessTypesSection } from './components/BusinessTypesSection';
import { HowWeWorkSection } from './components/HowWeWorkSection';
import { RecentlyBuiltSection } from './components/solutions/RecentlyBuiltSection';
import { SolutionsListingView } from './components/solutions/SolutionsListingView';
import { SolutionDetailView } from './components/solutions/SolutionDetailView';
import { IndustryDetailView } from './components/solutions/IndustryDetailView';
import { TemplatesListingPage } from './components/templates/TemplatesListingPage';
import { TemplateDetailPage } from './components/templates/TemplateDetailPage';
import { AdminPortal } from './components/admin/AdminPortal';
import { BusinessAiSection } from './components/BusinessAiSection';
import { BusinessAiDetailView } from './components/BusinessAiDetailView';
import { AboutSection } from './components/AboutSection';
import { MissionSection } from './components/MissionSection';
import { CostEstimator } from './components/CostEstimator';
import { ContactSection } from './components/ContactSection';
import { ServiceDetailView } from './components/ServiceDetailView';
import { FeaturedWorkSection } from './components/FeaturedWorkSection';
import { WorkHeroCtaBanner } from './components/work/WorkHeroCtaBanner';
import { WorkWithUsPage } from './components/work/WorkWithUsPage';
import { DigitalProductsSection } from './components/DigitalProductsSection';
import { DigitalProductsStorePage } from './components/templates/DigitalProductsStorePage';
import { DigitalProductDetailPage } from './components/templates/DigitalProductDetailPage';
import { DigitalProductErrorBoundary } from './components/DigitalProductErrorBoundary';
import { DigitalThankYouPage } from './components/templates/DigitalThankYouPage';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { digitalProductsStorage, subscribeToDigitalProducts } from './services/digitalProductsStorage';
import { OrderCustomSolutionModal } from './components/custom-solution/OrderCustomSolutionModal';
import { OrderCustomSolutionPage } from './components/custom-solution/OrderCustomSolutionPage';
import { FreeDemoModal } from './components/FreeDemoModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { SeoHead } from './components/SeoHead';
import { PrivacyPolicyPage } from './components/legal/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/legal/TermsAndConditionsPage';
import { RefundCancellationPolicyPage } from './components/legal/RefundCancellationPolicyPage';
import { BookServiceModal } from './components/booking/BookServiceModal';
import { BookingConfirmationView } from './components/booking/BookingConfirmationView';
import { BookableServiceType, ServiceBooking } from './types';
import { websiteCmsStorage, subscribeToWebsiteCms } from './services/websiteCmsStorage';

export default function App() {
  const getInitialPage = (): PageView => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/solution011253' || path === '/solution011253/') {
      return 'admin';
    }
    if (
      path === '/digital-products/thank-you' || 
      path === '/digital-products/thank-you/' || 
      path === '/thank-you' || 
      path === '/thank-you/' ||
      path === '/payment-success' ||
      path === '/payment-success/' ||
      path === '/order-success' ||
      path === '/order-success/'
    ) {
      return 'digital-thank-you';
    }
    if (path === '/digital-products' || path === '/digital-products/') {
      return 'digital-products';
    }
    if (path.startsWith('/product/') || path.startsWith('/digital-products/')) {
      return 'digital-product-detail';
    }
    if (path === '/privacy-policy' || path === '/privacy-policy/') return 'privacy-policy';
    if (path === '/terms-and-conditions' || path === '/terms-and-conditions/') return 'terms-and-conditions';
    if (path === '/refund-cancellation-policy' || path === '/refund-cancellation-policy/') return 'refund-cancellation-policy';
    if (path === '/website-development' || path === '/website-development/') return 'service-website';
    if (path === '/erp' || path === '/erp/') return 'service-software';
    if (path === '/software-development' || path === '/software-development/') return 'service-software';
    if (path === '/solutions' || path === '/solutions/') return 'solutions';
    if (path === '/ready-solutions' || path === '/ready-solutions/') return 'ready-solutions';
    if (path === '/work-with-us' || path === '/work-with-us/') return 'work-with-us';
    if (path === '/about' || path === '/about/') return 'about';
    if (path === '/services' || path === '/services/') return 'services';
    if (path === '/work' || path === '/work/') return 'work';
    if (path === '/contact' || path === '/contact/') return 'contact';
    if (path === '/book-service' || path === '/book-service/' || path === '/service-booking' || path === '/service-booking/') {
      return 'service-booking';
    }
    if (path === '/booking-confirmed' || path === '/booking-confirmed/' || path === '/service-booking-confirmed' || path === '/service-booking-confirmed/') {
      return 'service-booking-confirmed';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage);
  const [selectedSolutionSlug, setSelectedSolutionSlug] = useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [selectedReadySolution, setSelectedReadySolution] = useState<ReadySolutionItem | null>(null);
  const [selectedWebsiteTemplate, setSelectedWebsiteTemplate] = useState<WebsiteTemplate | null>(null);
  const [selectedBusinessAiSlug, setSelectedBusinessAiSlug] = useState<string | null>(null);
  const [selectedDigitalProduct, setSelectedDigitalProduct] = useState<DigitalProduct | null>(null);
  const [autoOpenCheckout, setAutoOpenCheckout] = useState<boolean>(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState<boolean>(false);
  const [prefilledCustomOrderSolution, setPrefilledCustomOrderSolution] = useState<string | undefined>(undefined);
  
  // ₹199 Service Booking System State
  const [isBookServiceModalOpen, setIsBookServiceModalOpen] = useState<boolean>(false);
  const [selectedBookableService, setSelectedBookableService] = useState<BookableServiceType>('website');
  const [confirmedBooking, setConfirmedBooking] = useState<ServiceBooking | null>(null);

  // Re-render when Website CMS section visibility toggles
  const [, setCmsTick] = useState(0);
  React.useEffect(() => {
    return subscribeToWebsiteCms(() => setCmsTick(t => t + 1));
  }, []);

  const handleOpenBookService = (serviceType?: BookableServiceType) => {
    if (serviceType) {
      setSelectedBookableService(serviceType);
    }
    setIsBookServiceModalOpen(true);
  };

  // Initial product lookup from URL slug on mount with async subscription fallback
  React.useEffect(() => {
    const resolveProduct = () => {
      const path = window.location.pathname;
      if (path.startsWith('/product/') || path.startsWith('/digital-products/')) {
        const slug = path.replace('/product/', '').replace('/digital-products/', '').replace('/', '');
        const found = digitalProductsStorage.getBySlug(slug);
        if (found) {
          setSelectedDigitalProduct(found);
        }
      }
    };
    resolveProduct();
    return subscribeToDigitalProducts(resolveProduct);
  }, []);

  // Sync state on popstate (browser back/forward navigation)
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on page transition & update URL path
  const handleNavigate = (page: PageView, paramSlug?: string, openCheckout?: boolean) => {
    setCurrentPage(page);
    setAutoOpenCheckout(!!openCheckout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (page === 'admin') {
        targetPath = '/solution011253';
      } else if (page === 'home') {
        targetPath = '/';
      } else if (page === 'digital-thank-you') {
        targetPath = '/digital-products/thank-you';
      } else if (page === 'digital-products') {
        targetPath = '/digital-products';
      } else if (page === 'digital-product-detail' && paramSlug) {
        targetPath = openCheckout ? `/product/${paramSlug}?buy=true` : `/product/${paramSlug}`;
      } else if (page === 'service-website') {
        targetPath = '/website-development';
      } else if (page === 'service-software') {
        targetPath = '/erp';
      } else if (page === 'service-booking') {
        targetPath = '/book-service';
      } else if (page === 'service-booking-confirmed') {
        targetPath = '/booking-confirmed';
      } else {
        targetPath = `/${page}`;
      }
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
  };

  const handleSelectSolution = (slug: string) => {
    setSelectedSolutionSlug(slug);
    setCurrentPage('solution-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBusinessAi = (slug: string) => {
    setSelectedBusinessAiSlug(slug);
    setCurrentPage('business-ai-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomOrder = (solutionName?: string) => {
    setPrefilledCustomOrderSolution(solutionName);
    setIsCustomOrderModalOpen(true);
  };


  const handleSelectIndustry = (id: string) => {
    setSelectedIndustryId(id);
    setCurrentPage('templates-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateBackFromIndustry = () => {
    setSelectedIndustryId(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWebsiteTemplate = (template: WebsiteTemplate) => {
    setSelectedWebsiteTemplate(template);
    setCurrentPage('template-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTemplatesListing = () => {
    setSelectedWebsiteTemplate(null);
    setCurrentPage('templates-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToSolutions = () => {
    setSelectedSolutionSlug(null);
    setCurrentPage('solutions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReadySolution = (solution: ReadySolutionItem) => {
    setSelectedReadySolution(solution);
    setCurrentPage('ready-solution-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToReadySolutions = () => {
    setSelectedReadySolution(null);
    setCurrentPage('ready-solutions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedServiceDetail = SERVICES_DATA.find(s => s.pageView === currentPage);

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[#171A1F] font-sans selection:bg-[#C79A22] selection:text-white">
      <SeoHead 
        currentPage={currentPage} 
        selectedDigitalProduct={selectedDigitalProduct}
        selectedSolutionSlug={selectedSolutionSlug}
        selectedIndustryId={selectedIndustryId}
        selectedBusinessAiSlug={selectedBusinessAiSlug}
      />
      
      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onOpenBookService={handleOpenBookService}
      />

      {/* Main Content Area */}
      <main className="relative">
        
        {currentPage === 'admin' ? (
          <AdminPortal
            onNavigateHome={() => handleNavigate('home')}
            onViewPublicSolution={handleSelectSolution}
            onViewReadySolution={(solution) => {
              handleSelectReadySolution(solution);
            }}
            onViewBusinessAi={handleSelectBusinessAi}
            onViewWebsiteTemplate={handleSelectWebsiteTemplate}
          />
        ) : (
          <>
            {/* SERVICE DETAIL VIEW */}
            {selectedServiceDetail && (
              <ServiceDetailView
                service={selectedServiceDetail}
                onNavigate={handleNavigate}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onSelectIndustry={handleSelectIndustry}
                onOpenCustomOrder={handleOpenCustomOrder}
                onOpenBookService={handleOpenBookService}
              />
            )}

            {/* HOMEPAGE VIEW */}
            {currentPage === 'home' && (
              <>
                {websiteCmsStorage.isSectionVisible('hero') && (
                  <Hero
                    onNavigate={handleNavigate}
                    onOpenDemoModal={() => setIsDemoModalOpen(true)}
                    onOpenCustomOrder={() => handleOpenCustomOrder()}
                  />
                )}
                {websiteCmsStorage.isSectionVisible('workCta') && (
                  <WorkHeroCtaBanner 
                    onNavigate={handleNavigate}
                    onOpenCustomOrder={() => handleOpenCustomOrder()}
                  />
                )}
                {websiteCmsStorage.isSectionVisible('trustStrip') && <TrustStrip />}

                {/* Digital Product Solution Section */}
                {websiteCmsStorage.isSectionVisible('digitalProducts') && (
                  <DigitalProductsSection
                    onSelectProduct={(prod, openCheckout) => {
                      setSelectedDigitalProduct(prod);
                      handleNavigate('digital-product-detail', prod.slug, openCheckout);
                    }}
                    onViewAllProducts={() => handleNavigate('digital-products')}
                  />
                )}

                {/* ERP & CRM Solutions (Pre-Built Products) */}
                {websiteCmsStorage.isSectionVisible('readySolutions') && (
                  <ReadySolutionsSection
                    onNavigate={handleNavigate}
                    onSelectSolution={handleSelectReadySolution}
                  />
                )}

                {/* Website & App Solution (Featured Work & Projects) */}
                {websiteCmsStorage.isSectionVisible('featuredWork') && (
                  <FeaturedWorkSection
                    onOpenDemoModal={() => setIsDemoModalOpen(true)}
                    onNavigateToAdmin={() => handleNavigate('admin')}
                    onNavigateToSolutions={() => handleNavigate('solutions')}
                  />
                )}

                {websiteCmsStorage.isSectionVisible('about') && <AboutSection />}
                {websiteCmsStorage.isSectionVisible('mission') && <MissionSection />}

                {/* Our Digital Solutions (Services Section) */}
                {websiteCmsStorage.isSectionVisible('services') && (
                  <ServicesSection
                    onNavigate={handleNavigate}
                    onOpenDemoModal={() => setIsDemoModalOpen(true)}
                    onOpenBookService={handleOpenBookService}
                  />
                )}
                {websiteCmsStorage.isSectionVisible('businessAi') && (
                  <BusinessAiSection
                    onOpenDemoModal={() => setIsDemoModalOpen(true)}
                    onSelectSolution={handleSelectBusinessAi}
                    onOpenBookService={handleOpenBookService}
                  />
                )}
                {websiteCmsStorage.isSectionVisible('costEstimator') && <CostEstimator />}
                {websiteCmsStorage.isSectionVisible('whyMani') && <WhyManiSection />}

                {websiteCmsStorage.isSectionVisible('howWeWork') && <HowWeWorkSection />}
                {websiteCmsStorage.isSectionVisible('contact') && (
                  <ContactSection
                    onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  />
                )}
              </>
            )}

            {/* DEDICATED DIGITAL PRODUCTS STORE PAGE */}
            {currentPage === 'digital-products' && (
              <DigitalProductsStorePage
                onSelectProduct={(prod, openCheckout) => {
                  setSelectedDigitalProduct(prod);
                  handleNavigate('digital-product-detail', prod.slug, openCheckout);
                }}
                onNavigateHome={() => handleNavigate('home')}
              />
            )}

            {/* DEDICATED DIGITAL THANK YOU & SECURE DOWNLOAD PAGE */}
            {currentPage === 'digital-thank-you' && (
              <DigitalThankYouPage
                onNavigateHome={() => handleNavigate('home')}
                onNavigateStore={() => handleNavigate('digital-products')}
              />
            )}

            {/* DEDICATED DIGITAL PRODUCT DETAIL PAGE */}
            {currentPage === 'digital-product-detail' && (
              <DigitalProductErrorBoundary
                onNavigateHome={() => handleNavigate('home')}
                onNavigateStore={() => handleNavigate('digital-products')}
              >
                <DigitalProductDetailPage
                  product={selectedDigitalProduct || undefined}
                  autoOpenCheckout={autoOpenCheckout}
                  productSlug={(() => {
                    const p = typeof window !== 'undefined' ? window.location.pathname : '';
                    if (p.startsWith('/product/')) return p.replace('/product/', '').replace('/', '');
                    if (p.startsWith('/digital-products/')) return p.replace('/digital-products/', '').replace('/', '');
                    return selectedDigitalProduct?.slug;
                  })()}
                  onBackToListing={() => handleNavigate('digital-products')}
                  onBackToHome={() => handleNavigate('home')}
                  onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
                  onSelectProduct={(input) => {
                    const slug = typeof input === 'string' ? input : input?.slug;
                    if (slug) {
                      const found = digitalProductsStorage.getBySlug(slug);
                      if (found) {
                        setSelectedDigitalProduct(found);
                        handleNavigate('digital-product-detail', found.slug);
                      }
                    }
                  }}
                />
              </DigitalProductErrorBoundary>
            )}

            {/* DEDICATED INDUSTRY SOLUTION DISCOVERY VIEW */}
            {currentPage === 'industry-detail' && selectedIndustryId && (
              <IndustryDetailView
                industryId={selectedIndustryId}
                onNavigateBack={handleNavigateBackFromIndustry}
                onSelectIndustry={handleSelectIndustry}
                onSelectReadySolution={handleSelectReadySolution}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onOpenCustomOrderModal={() => setIsCustomOrderModalOpen(true)}
              />
            )}

            {currentPage === 'templates-listing' && selectedIndustryId && (
              <TemplatesListingPage
                categoryId={selectedIndustryId}
                onBackToHome={handleNavigateBackFromIndustry}
                onSelectTemplate={handleSelectWebsiteTemplate}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onOpenCustomOrder={handleOpenCustomOrder}
              />
            )}

            {currentPage === 'template-detail' && selectedWebsiteTemplate && (
              <TemplateDetailPage
                template={selectedWebsiteTemplate}
                onBackToListing={handleBackToTemplatesListing}
                onBackToHome={handleNavigateBackFromIndustry}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
                onSelectCategory={handleSelectIndustry}
              />
            )}

            {/* WORK WITH US & EARN VIEW */}
            {currentPage === 'work-with-us' && (
              <WorkWithUsPage
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {/* LEGAL POLICY PAGES */}
            {currentPage === 'privacy-policy' && (
              <PrivacyPolicyPage onNavigate={handleNavigate} />
            )}
            {currentPage === 'terms-and-conditions' && (
              <TermsAndConditionsPage onNavigate={handleNavigate} />
            )}
            {currentPage === 'refund-cancellation-policy' && (
              <RefundCancellationPolicyPage onNavigate={handleNavigate} />
            )}

            {/* ORDER CUSTOM SOLUTION VIEW */}
            {currentPage === 'order-custom-solution' && (
              <OrderCustomSolutionPage
                onNavigate={handleNavigate}
              />
            )}

            {/* READY SOLUTIONS LISTING VIEW */}
            {currentPage === 'ready-solutions' && (
              <ReadySolutionsPage
                onNavigate={handleNavigate}
                onSelectSolution={handleSelectReadySolution}
              />
            )}

            {/* READY SOLUTION DETAIL VIEW */}
            {currentPage === 'ready-solution-detail' && selectedReadySolution && (
              <ReadySolutionDetailView
                solution={selectedReadySolution}
                onNavigateBack={handleNavigateToReadySolutions}
                onNavigateToReadySolutions={handleNavigateToReadySolutions}
              />
            )}

            {/* SOLUTIONS LISTING VIEW */}
            {currentPage === 'solutions' && (
              <SolutionsListingView
                onSelectSolution={handleSelectSolution}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {/* SOLUTION DETAIL VIEW */}
            {currentPage === 'solution-detail' && selectedSolutionSlug && (
              <SolutionDetailView
                slug={selectedSolutionSlug}
                onNavigateBack={handleNavigateToSolutions}
                onSelectRelatedSolution={handleSelectSolution}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {/* BUSINESS AI DETAIL VIEW */}
            {currentPage === 'business-ai-detail' && selectedBusinessAiSlug && (
              <BusinessAiDetailView
                slug={selectedBusinessAiSlug}
                onNavigateBack={() => handleNavigate('home')}
                onOpenCustomOrderModal={handleOpenCustomOrder}
                onOpenDemoModal={() => setIsDemoModalOpen(true)}
              />
            )}

            {/* SERVICES OVERVIEW VIEW */}
            {currentPage === 'services' && (
              <div className="pt-24">
                <ServicesSection
                  onNavigate={handleNavigate}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onOpenBookService={handleOpenBookService}
                />
                <RecentlyBuiltSection
                  onSelectSolution={handleSelectSolution}
                  onNavigateToSolutions={handleNavigateToSolutions}
                />
                <CostEstimator />
                <BusinessTypesSection
                  onSelectIndustry={handleSelectIndustry}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <ContactSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
              </div>
            )}

            {/* DEDICATED SERVICE BOOKING LANDING VIEW */}
            {currentPage === 'service-booking' && (
              <div className="pt-24 pb-16">
                <ServicesSection
                  onNavigate={handleNavigate}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onOpenBookService={handleOpenBookService}
                />
              </div>
            )}

            {/* SERVICE BOOKING CONFIRMATION VIEW */}
            {currentPage === 'service-booking-confirmed' && (
              <BookingConfirmationView
                booking={confirmedBooking}
                onNavigate={handleNavigate}
              />
            )}

            {/* ABOUT VIEW */}
            {currentPage === 'about' && (
              <div className="pt-24">
                <AboutSection />
                <MissionSection />
                <WhyManiSection />
                <ContactSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
              </div>
            )}

            {/* WORK / PROJECTS BLUEPRINTS VIEW */}
            {currentPage === 'work' && (
              <div className="pt-24">
                <FeaturedWorkSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onNavigateToAdmin={() => handleNavigate('admin')}
                />
                                <BusinessTypesSection
                  onSelectIndustry={handleSelectIndustry}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <BusinessAiSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onSelectSolution={handleSelectBusinessAi}
                  onOpenBookService={handleOpenBookService}
                />
                <ContactSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
              </div>
            )}

            {/* CONTACT VIEW */}
            {currentPage === 'contact' && (
              <div className="pt-24">
                <ContactSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <AboutSection />
              </div>
            )}
          </>
        )}

      </main>

      {/* Global Free Demo Modal */}
      <FreeDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Global Book Service ₹199 Modal */}
      <BookServiceModal
        isOpen={isBookServiceModalOpen}
        onClose={() => setIsBookServiceModalOpen(false)}
        initialService={selectedBookableService}
        onBookingConfirmed={(booking) => {
          setConfirmedBooking(booking);
          setIsBookServiceModalOpen(false);
          handleNavigate('service-booking-confirmed');
        }}
      />

      {/* Global Order Custom Solution Modal */}
      <OrderCustomSolutionModal
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
        prefilledSolution={prefilledCustomOrderSolution}
      />



      {/* Customer Portal / Account Dashboard */}
      <CustomerPortal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        onNavigateHome={() => handleNavigate('home')}
      />

      {/* Floating WhatsApp Quick Link */}
      <FloatingWhatsApp />

      {/* Corporate Global Footer */}
      {websiteCmsStorage.isSectionVisible('footer') && (
        <Footer
          onNavigate={handleNavigate}
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
        />
      )}

    </div>
  );
}
