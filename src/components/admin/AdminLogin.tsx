import React, { useState } from 'react';
import { solutionsStorage } from '../../services/solutionsStorage';
import { Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onNavigateHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = solutionsStorage.loginAdmin(password, email);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Invalid email or administrative password. Please check your credentials.');
      }
    }, 400);
  };

  return (
    <div id="admin-login-screen" className="min-h-screen bg-[var(--theme-bg-main)] text-[#171A1F] flex items-center justify-center p-4 pt-10 pb-16 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C79A22]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-[#E4E1DA] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#171A1F] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#C79A22]/20">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-[#171A1F] tracking-tight">
              MANI Solution CMS
            </h1>
            <p className="text-xs text-slate-400">
              Founder & Content Management System Portal
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#626873]">
              Administrator Email
            </label>
            <input
              id="admin-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter administrator email"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#626873]">
              Security Password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-[#E4E1DA] text-[#171A1F] placeholder-slate-500 text-sm focus:outline-none focus:border-[#C79A22] focus:ring-1 focus:ring-[#C79A22]"
              />
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1d4ed8] font-bold text-sm shadow-xl shadow-[#C79A22]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying...' : 'Access Admin Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="text-center pt-2 border-t border-[#E4E1DA]">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-[#C79A22] transition-colors"
          >
            ← Return to Public Website
          </button>
        </div>

      </div>

    </div>
  );
};
