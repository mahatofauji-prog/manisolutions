import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { solutionsStorage } from '../../services/solutionsStorage';

export const AdminSecurityDashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load current admin email
    try {
      const creds = solutionsStorage.getAdminCredentials();
      setEmail(creds.email);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      // Get current creds
      const creds = solutionsStorage.getAdminCredentials();
      const updatedCreds = { ...creds };
      
      let changed = false;
      if (email && email.trim() !== creds.email) {
        updatedCreds.email = email.trim();
        changed = true;
      }
      
      if (newPassword) {
        updatedCreds.passwordHash = newPassword.trim();
        changed = true;
      }

      if (changed) {
        localStorage.setItem('mani_admin_custom_creds_v1', JSON.stringify(updatedCreds));
      }
      
      setStatus('success');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to update security settings');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#171A1F]">Admin Credentials</h2>
          <p className="text-sm text-[#626873] mt-1">
            Update the email and password used to access this CMS.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E1DA] overflow-hidden shadow-sm">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {status === 'success' && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-semibold border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
              Credentials updated successfully! Note: Keep these safe.
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 text-sm font-semibold border border-rose-100">
              <AlertCircle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Security Warning:</strong> Changing these credentials will apply immediately. You must use the new email and password on your next login.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#171A1F]">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@example.com"
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22] text-[#171A1F]"
              />
            </div>

            <div className="space-y-1.5 pt-4 border-t border-[#E4E1DA]">
              <label className="text-sm font-bold text-[#171A1F]">New Password (Leave blank to keep current)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22] text-[#171A1F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#171A1F]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E4E1DA] rounded-xl focus:outline-none focus:border-[#C79A22] text-[#171A1F]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4E1DA] flex justify-end">
            <button
              type="submit"
              disabled={status === 'saving'}
              className="px-6 py-3 bg-[#171A1F] text-white font-bold rounded-xl hover:bg-[#2D313A] transition-colors flex items-center gap-2"
            >
              {status === 'saving' ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Credentials
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
