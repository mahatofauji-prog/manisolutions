import React, { useState, useEffect } from 'react';
import { solutionsStorage } from '../../services/solutionsStorage';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminEditor } from './AdminEditor';
import { AdminProjectsDashboard } from './AdminProjectsDashboard';
import { AdminEnquiriesDashboard } from './AdminEnquiriesDashboard';
import { AdminWorkApplicationsDashboard } from './AdminWorkApplicationsDashboard';
import { AdminReadySolutionsDashboard } from './AdminReadySolutionsDashboard';
import { AdminCustomOrdersDashboard } from './AdminCustomOrdersDashboard';
import { AdminFounderProfileDashboard } from './AdminFounderProfileDashboard';
import { AdminBrandSettingsDashboard } from './AdminBrandSettingsDashboard';
import { AdminDataExportDashboard } from './AdminDataExportDashboard';
import { AdminAiAutomationDashboard } from './AdminAiAutomationDashboard';
import { AdminSecurityDashboard } from './AdminSecurityDashboard';
import { AdminWebsiteTemplatesDashboard } from './AdminWebsiteTemplatesDashboard';
import { AdminCategoriesDashboard } from './AdminCategoriesDashboard';
import { LayoutGrid, FolderPlus, Inbox, Briefcase, Sparkles, Layers, Cpu, User, Image as ImageIcon, Database, Lock, LogOut } from 'lucide-react';
import { ReadySolutionItem, WebsiteTemplate } from '../../types';

interface AdminPortalProps {
  onNavigateHome: () => void;
  onViewPublicSolution: (slug: string) => void;
  onViewReadySolution?: (solution: ReadySolutionItem) => void;
  onViewBusinessAi?: (slug: string) => void;
  onViewWebsiteTemplate?: (template: WebsiteTemplate) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateHome,
  onViewPublicSolution,
  onViewReadySolution,
  onViewBusinessAi,
  onViewWebsiteTemplate
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<'custom-orders' | 'ready-solutions' | 'website-templates' | 'categories' | 'ai-solutions' | 'brand-settings' | 'enquiries' | 'work-applications' | 'founder-profile' | 'portfolio' | 'solutions' | 'data-export' | 'security-settings'>('custom-orders');
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(solutionsStorage.isAdminAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    solutionsStorage.logoutAdmin();
    setIsAuthenticated(false);
  };

  const handleNewPost = () => {
    setEditingId(null);
    setCurrentView('editor');
  };

  const handleEditPost = (id: string) => {
    setEditingId(id);
    setCurrentView('editor');
  };

  const handleEditorSaved = () => {
    setCurrentView('dashboard');
    setEditingId(null);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  return (
    <div id="admin-portal-wrapper" className="pt-8 sm:pt-12 pb-24 lg:pt-14 lg:pb-32 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Admin Navigation Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E1DA] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setAdminTab('custom-orders'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'custom-orders'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Cpu className="w-4 h-4 text-[#ECC348]" />
              <span>Custom Solution Orders</span>
            </button>

            <button
              onClick={() => { setAdminTab('ready-solutions'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'ready-solutions'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Ready Solutions CMS</span>
            </button>

            <button
              onClick={() => { setAdminTab('website-templates'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'website-templates'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#2563EB]" />
              <span>Website Templates CMS</span>
            </button>

            <button
              onClick={() => { setAdminTab('categories'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'categories'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              <span>Categories CMS</span>
            </button>

            <button
              onClick={() => { setAdminTab('ai-solutions'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'ai-solutions'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>AI & Automation CMS</span>
            </button>

            <button
              onClick={() => { setAdminTab('enquiries'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'enquiries'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Inbox className="w-4 h-4 text-emerald-500" />
              <span>Enquiries</span>
            </button>

            <button
              onClick={() => { setAdminTab('work-applications'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'work-applications'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span>Work With Us (Applications)</span>
            </button>

            <button
              onClick={() => { setAdminTab('brand-settings'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'brand-settings'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#C79A22]" />
              <span>Brand Settings</span>
            </button>

            <button
              onClick={() => { setAdminTab('founder-profile'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'founder-profile'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <User className="w-4 h-4 text-[#C79A22]" />
              <span>Founder Profile</span>
            </button>

            <button
              onClick={() => { setAdminTab('portfolio'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'portfolio'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <FolderPlus className="w-4 h-4 text-[#C79A22]" />
              <span>Projects & Featured Work</span>
            </button>

            <button
              onClick={() => setAdminTab('solutions')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'solutions'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#2563EB]" />
              <span>Full Solutions CMS</span>
            </button>

            <button
              onClick={() => { setAdminTab('data-export'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'data-export'
                  ? 'bg-[#171A1F] text-white shadow-md'
                  : 'bg-white text-[#626873] border border-[#E4E1DA] hover:text-[#171A1F]'
              }`}
            >
              <Database className="w-4 h-4 text-[#C79A22]" />
              <span>Data Export</span>
            </button>

            <button
              onClick={() => { setAdminTab('security-settings'); setCurrentView('dashboard'); }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                adminTab === 'security-settings'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <button
              onClick={onNavigateHome}
              className="text-xs font-bold text-[#626873] hover:text-[#171A1F] underline"
            >
              ← Public Website
            </button>
          </div>
        </div>

        {adminTab === 'custom-orders' ? (
          <AdminCustomOrdersDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'ready-solutions' ? (
          <AdminReadySolutionsDashboard 
            onBackToSite={onNavigateHome}
            onViewPublicSolution={(sol) => {
              if (onViewReadySolution) {
                onViewReadySolution(sol);
              } else {
                onNavigateHome();
              }
            }}
          />
        ) : adminTab === 'website-templates' ? (
          <AdminWebsiteTemplatesDashboard 
            onBackToSite={onNavigateHome}
            onViewTemplate={(tpl) => {
              if (onViewWebsiteTemplate) {
                onViewWebsiteTemplate(tpl);
              } else {
                onNavigateHome();
              }
            }}
          />
        ) : adminTab === 'categories' ? (
          <AdminCategoriesDashboard 
            onBackToSite={onNavigateHome}
          />
        ) : adminTab === 'ai-solutions' ? (
          <AdminAiAutomationDashboard 
            onViewPublicSolution={(slug) => {
              if (onViewBusinessAi) {
                onViewBusinessAi(slug);
              } else {
                onNavigateHome();
              }
            }}
          />
        ) : adminTab === 'brand-settings' ? (
          <AdminBrandSettingsDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'enquiries' ? (
          <AdminEnquiriesDashboard onLogout={handleLogout} />
        ) : adminTab === 'work-applications' ? (
          <AdminWorkApplicationsDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'founder-profile' ? (
          <AdminFounderProfileDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'portfolio' ? (
          <AdminProjectsDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'data-export' ? (
          <AdminDataExportDashboard onBackToSite={onNavigateHome} />
        ) : adminTab === 'security-settings' ? (
          <AdminSecurityDashboard />
        ) : (
          currentView === 'dashboard' ? (
            <AdminDashboard
              onNewPost={handleNewPost}
              onEditPost={handleEditPost}
              onViewPublic={onViewPublicSolution}
              onLogout={handleLogout}
              onNavigateHome={onNavigateHome}
            />
          ) : (
            <AdminEditor
              editId={editingId}
              onBack={() => setCurrentView('dashboard')}
              onSaved={handleEditorSaved}
            />
          )
        )}

      </div>
    </div>
  );
};

