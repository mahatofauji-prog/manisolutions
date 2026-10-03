import React, { useState } from 'react';
import { solutionsStorage } from '../../services/solutionsStorage';
import { ShieldCheck, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSecurityDashboard: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      setMsg({ type: 'error', text: 'Please enter your current administrative password.' });
      return;
    }

    // Verify current password first
    const isCurrentValid = solutionsStorage.verifyAdminPassword(currentPassword);
    if (!isCurrentValid) {
      setMsg({ type: 'error', text: 'Current password verification failed. Please enter the correct current password.' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match. Please re-enter identical passwords.' });
      return;
    }

    const success = solutionsStorage.updateAdminPassword(newPassword);
    if (success) {
      setMsg({ type: 'success', text: 'Administrative credentials updated and verified successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMsg({ type: 'error', text: 'Failed to update administrative password.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#171A1F]">
          Admin Security & <span className="text-gold-gradient">Access Control</span>
        </h2>
        <p className="text-xs text-[#626873] mt-1">
          Update the master administrative password with server-grade verification.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Protected Single Source of Truth Session</span>
        </div>
        <p>Password updates take effect immediately for all active administrative logins across devices.</p>
      </div>

      <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-[#E4E1DA] p-6 space-y-4 text-xs shadow-sm">
        {msg && (
          <div className={`p-3.5 rounded-xl border font-bold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="font-bold text-[#171A1F]">Current Administrative Password *</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22]"
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-[#171A1F]">New Password *</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22]"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-[#171A1F]">Confirm New Password *</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E1DA] focus:outline-none focus:border-[#C79A22]"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#C79A22] text-[#171A1F] font-bold flex items-center gap-1.5 hover:bg-[#d8a82a] transition-all shadow-sm"
        >
          <Lock className="w-4 h-4" />
          <span>Update Admin Password</span>
        </button>
      </form>
    </div>
  );
};
