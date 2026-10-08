import React, { useState } from 'react';
import { ShieldAlert, Lock, Unlock, X, AlertCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockAdmin: (pin: string) => boolean;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onUnlockAdmin,
  onSuccess,
  title = "Administrator Access Required",
  description = "Please enter the Admin Security PIN to perform deletion and management tasks.",
}) => {
  const [adminPin, setAdminPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockAdmin(adminPin)) {
      setError('');
      setAdminPin('');
      onSuccess();
      onClose();
    } else {
      setError('Invalid Admin Security PIN. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] rounded-3xl border-2 border-rose-300 shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-amber-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-100" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{title}</h3>
              <p className="text-[11px] text-rose-100/90 font-medium">Portal Admin Authorization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto border border-rose-300 shadow-inner">
            <Lock className="w-7 h-7 text-rose-700" />
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter Admin PIN"
                className="w-full text-center text-2xl tracking-[0.4em] font-mono py-3 bg-white border border-rose-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                autoFocus
              />
              {error && (
                <p className="text-xs font-bold text-rose-600 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify Admin PIN</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
