import React, { useState, useEffect } from 'react';
import { solutionsStorage } from '../../services/solutionsStorage';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminServiceBookingsDashboard } from './AdminServiceBookingsDashboard';
import { AdminDigitalProductsDashboard } from './AdminDigitalProductsDashboard';
import { AdminReadySolutionsDashboard } from './AdminReadySolutionsDashboard';
import { AdminProjectsDashboard } from './AdminProjectsDashboard';
import { AdminEnquiriesDashboard } from './AdminEnquiriesDashboard';
import { AdminFounderProfileDashboard } from './AdminFounderProfileDashboard';
import { AdminWebsiteCmsDashboard } from './AdminWebsiteCmsDashboard';
import { AdminWorkApplicationsDashboard } from './AdminWorkApplicationsDashboard';
import { AdminSecurityDashboard } from './AdminSecurityDashboard';
import { 
  LayoutDashboard, 
  CreditCard, 
  Package, 
  Briefcase, 
  Globe, 
  Inbox, 
  User, 
  Layers, 
  Users, 
  Lock, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { ReadySolutionItem, WebsiteTemplate } from '../../types';

interface AdminPortalProps {
  onNavigateHome: () => void;
  onViewPublicSolution: (slug: string) => void;
  onViewReadySolution?: (solution: ReadySolutionItem) => void;
  onViewBusinessAi?: (slug: string) => void;
  onViewWebsiteTemplate?: (template: WebsiteTemplate) => void;
}

export type AdminTab = 
  | 'dashboard'
  | 'service-bookings'
  | 'digital-products'
  | 'erp-crm'
  | 'website-app'
  | 'enquiries'
  | 'founder-profile'
  | 'website-cms'
  | 'work-applications'
  | 'security';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigateHome,
  onViewPublicSolution,
  onViewReadySolution
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    setIsAuthenticated(solutionsStorage.isAdminAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    solutionsStorage.logoutAdmin();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; isLocked?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'DASHBOARD',
      icon: <LayoutDashboard className="w-4 h-4 text-[#C79A22]" />
    },
    {
      id: 'service-bookings',
      label: 'SERVICE BOOKINGS',
      icon: <CreditCard className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'digital-products',
      label: 'DIGITAL PRODUCTS',
      icon: <Package className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'erp-crm',
      label: 'ERP & CRM',
      icon: <Briefcase className="w-4 h-4 text-purple-500" />
    },
    {
      id: 'website-app',
      label: 'WEBSITE & APP',
      icon: <Globe className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'enquiries',
      label: 'ENQUIRIES',
      icon: <Inbox className="w-4 h-4 text-teal-500" />
    },
    {
      id: 'founder-profile',
      label: 'FOUNDER & CO-FOUNDER',
      icon: <User className="w-4 h-4 text-[#C79A22]" />,
      isLocked: true
    },
    {
      id: 'website-cms',
      label: 'WEBSITE CMS',
      icon: <Layers className="w-4 h-4 text-indigo-500" />
    },
    {
      id: 'work-applications',
      label: 'WORK WITH US & EARN',
      icon: <Users className="w-4 h-4 text-blue-600" />,
      isLocked: true
    },
    {
      id: 'security',
      label: 'SECURITY',
      icon: <Lock className="w-4 h-4 text-rose-500" />
    }
  ];

  return (
    <div id="admin-portal-wrapper" className="pt-6 sm:pt-8 pb-24 lg:pt-10 lg:pb-32 bg-[var(--theme-bg-main)] min-h-screen text-[var(--theme-text-primary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Admin Navigation Top Header */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E4E1DA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#171A1F] text-[#C79A22] flex items-center justify-center font-black text-sm shadow">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#171A1F] tracking-wide">
                  MANI SOLUTION ADMIN
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <span className="text-[11px] text-[#626873]">
                Single Source of Truth Management Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C79A22]" />
              <span>Public Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Master Navigation Bar (All in-scope modules + the 2 locked modules) */}
        <div className="bg-white p-2 rounded-2xl border border-[#E4E1DA] shadow-sm overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1.5 min-w-max">
            {navItems.map((item) => {
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#171A1F] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.isLocked && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      LOCKED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Module View */}
        <div className="min-h-[500px]">
          {adminTab === 'dashboard' && <AdminDashboard />}
          {adminTab === 'service-bookings' && <AdminServiceBookingsDashboard />}
          {adminTab === 'digital-products' && (
            <AdminDigitalProductsDashboard onBackToSite={onNavigateHome} />
          )}
          {adminTab === 'erp-crm' && (
            <AdminReadySolutionsDashboard 
              onBackToSite={onNavigateHome}
              onViewPublicSolution={onViewReadySolution}
            />
          )}
          {adminTab === 'website-app' && (
            <AdminProjectsDashboard 
              onBackToSite={onNavigateHome}
              onViewPublicSolution={onViewPublicSolution}
            />
          )}
          {adminTab === 'enquiries' && (
            <AdminEnquiriesDashboard onLogout={handleLogout} />
          )}
          {/* LOCKED MODULE #1: FOUNDER & CO-FOUNDER (Completely untouched) */}
          {adminTab === 'founder-profile' && (
            <AdminFounderProfileDashboard />
          )}
          {adminTab === 'website-cms' && (
            <AdminWebsiteCmsDashboard onBackToSite={onNavigateHome} />
          )}
          {/* LOCKED MODULE #2: WORK WITH US & EARN (Completely untouched) */}
          {adminTab === 'work-applications' && (
            <AdminWorkApplicationsDashboard />
          )}
          {adminTab === 'security' && <AdminSecurityDashboard />}
        </div>

      </div>
    </div>
  );
};
