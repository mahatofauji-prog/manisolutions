import React, { useState } from 'react';
import { PageView, ReadySolutionItem, WebsiteTemplate } from './types';
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
import { OrderCustomSolutionModal } from './components/custom-solution/OrderCustomSolutionModal';
import { OrderCustomSolutionPage } from './components/custom-solution/OrderCustomSolutionPage';
import { FreeDemoModal } from './components/FreeDemoModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { SeoHead } from './components/SeoHead';

export default function App() {
  const getInitialPage = (): PageView => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname;
    if (path === '/solution011253' || path === '/solution011253/') {
      return 'admin';
    }
    if (path === '/solutions' || path === '/solutions/') return 'solutions';
    if (path === '/ready-solutions' || path === '/ready-solutions/') return 'ready-solutions';
    if (path === '/work-with-us' || path === '/work-with-us/') return 'work-with-us';
    if (path === '/about' || path === '/about/') return 'about';
    if (path === '/services' || path === '/services/') return 'services';
    if (path === '/work' || path === '/work/') return 'work';
    if (path === '/contact' || path === '/contact/') return 'contact';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(getInitialPage);
  const [selectedSolutionSlug, setSelectedSolutionSlug] = useState<string | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [selectedReadySolution, setSelectedReadySolution] = useState<ReadySolutionItem | null>(null);
  const [selectedWebsiteTemplate, setSelectedWebsiteTemplate] = useState<WebsiteTemplate | null>(null);
  const [selectedBusinessAiSlug, setSelectedBusinessAiSlug] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isCustomOrderModalOpen, setIsCustomOrderModalOpen] = useState<boolean>(false);
  const [prefilledCustomOrderSolution, setPrefilledCustomOrderSolution] = useState<string | undefined>(undefined);

  // Sync state on popstate (browser back/forward navigation)
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on page transition & update URL path
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (page === 'admin') {
        targetPath = '/solution011253';
      } else if (page === 'home') {
        targetPath = '/';
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
    <div className="min-h-screen bg-[var(--theme-bg-main)] text-[var(--theme-text-primary)] flex flex-col justify-between selection:bg-[var(--theme-gold-light)] selection:text-[var(--theme-text-primary)] font-sans">
      
      {/* Dynamic SEO Head Management */}
      <SeoHead
        currentPage={currentPage}
        selectedSolutionSlug={selectedSolutionSlug}
        selectedIndustryId={selectedIndustryId}
        selectedBusinessAiSlug={selectedBusinessAiSlug}
      />

      {/* Global Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        
        {/* Render Dedicated Sub-Service Page if active */}
        {selectedServiceDetail ? (
          <ServiceDetailView
            service={selectedServiceDetail}
            onNavigate={handleNavigate}
            onOpenDemoModal={() => setIsDemoModalOpen(true)}
          />
        ) : (
          <>
            {/* HOME VIEW: The Complete Master Experience */}
            {currentPage === 'home' && (
              <>
                <Hero
                  onNavigate={handleNavigate}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <WorkHeroCtaBanner 
                  onNavigate={handleNavigate} 
                  onOpenCustomOrder={() => handleOpenCustomOrder()}
                />
                <TrustStrip />

                <ServicesSection
                  onNavigate={handleNavigate}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <WhyManiSection />
                
                {/* Ready Solutions Pre-Built Products Section (Max 6 on Homepage) */}
                <ReadySolutionsSection
                  onNavigate={handleNavigate}
                  onSelectSolution={handleSelectReadySolution}
                />

                {/* 2. Dynamic Featured Work Section */}
                <FeaturedWorkSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onNavigateToAdmin={() => handleNavigate('admin')}
                />

                <BusinessTypesSection
                  onSelectIndustry={handleSelectIndustry}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
                <HowWeWorkSection />
                                <BusinessAiSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                  onSelectSolution={handleSelectBusinessAi}
                />
                <CostEstimator />
                <AboutSection />
                <MissionSection />
                <ContactSection
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
                />
              </>
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

            {/* FOUNDER ADMIN CMS PORTAL */}
            {currentPage === 'admin' && (
              <AdminPortal
                onNavigateHome={() => handleNavigate('home')}
                onViewPublicSolution={handleSelectSolution}
                onViewReadySolution={(solution) => {
                  handleSelectReadySolution(solution);
                }}
                onViewBusinessAi={handleSelectBusinessAi}
                onViewWebsiteTemplate={handleSelectWebsiteTemplate}
              />
            )}

            {/* SERVICES OVERVIEW VIEW */}
            {currentPage === 'services' && (
              <div className="pt-24">
                <ServicesSection
                  onNavigate={handleNavigate}
                  onOpenDemoModal={() => setIsDemoModalOpen(true)}
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

      {/* Global Order Custom Solution Modal */}
      <OrderCustomSolutionModal
        isOpen={isCustomOrderModalOpen}
        onClose={() => setIsCustomOrderModalOpen(false)}
        prefilledSolution={prefilledCustomOrderSolution}
      />

      {/* Floating WhatsApp Quick Link */}
      <FloatingWhatsApp />

      {/* Corporate Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

    </div>
  );
}
