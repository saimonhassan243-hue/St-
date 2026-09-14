import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, ShieldAlert, WifiOff, KeyRound, 
  Lock, Unlock, RefreshCw, Radio, CheckCircle2, 
  X, AlertOctagon, Terminal
} from 'lucide-react';
import { GlobalNoticeData } from '../types';
import { MASTER_ADMIN_PASSCODE } from '../services/firebaseNoticeService';

interface EmergencyBroadcastLockOverlayProps {
  notice: GlobalNoticeData;
  isOffline: boolean;
  isOfflineLockActive: boolean;
  onAdminBypass: () => void;
  onDismissNotice?: () => void;
  onRetryConnection: () => void;
  onDeactivateNoticeFromAdmin?: (passcode: string) => Promise<boolean>;
}

export const EmergencyBroadcastLockOverlay: React.FC<EmergencyBroadcastLockOverlayProps> = ({
  notice,
  isOffline,
  isOfflineLockActive,
  onAdminBypass,
  onDismissNotice,
  onRetryConnection,
  onDeactivateNoticeFromAdmin,
}) => {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');

    if (passcode.trim() !== MASTER_ADMIN_PASSCODE) {
      setPasscodeError('ভুল মাস্টার পাসকোড! সঠিক ১০ ডিজিটের পাসকোড প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onDeactivateNoticeFromAdmin) {
        // Try deactivating globally on Firebase RTDB as well
        const success = await onDeactivateNoticeFromAdmin(passcode.trim());
        if (success) {
          setActionSuccessMessage('জরুরি নোটিশ সফলভাবে প্রত্যাহার করা হয়েছে ও সিস্টেম আনলক হয়েছে!');
          setTimeout(() => {
            onAdminBypass();
          }, 800);
          return;
        }
      }
      // Direct bypass fallback
      onAdminBypass();
    } catch {
      onAdminBypass();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUrgent = notice.severity === 'urgent';
  const isWarning = notice.severity === 'warning';

  const themeColors = isUrgent
    ? {
        border: 'border-rose-500/40',
        bg: 'bg-rose-950/40',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        glow: 'bg-rose-600/20',
        icon: <ShieldAlert className="w-10 h-10 text-rose-400 animate-pulse" />,
        pingColor: 'bg-rose-500',
      }
    : isWarning
    ? {
        border: 'border-amber-500/40',
        bg: 'bg-amber-950/40',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        glow: 'bg-amber-600/20',
        icon: <AlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />,
        pingColor: 'bg-amber-500',
      }
    : {
        border: 'border-cyan-500/40',
        bg: 'bg-cyan-950/40',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        glow: 'bg-cyan-600/20',
        icon: <Radio className="w-10 h-10 text-cyan-400 animate-pulse" />,
        pingColor: 'bg-cyan-500',
      };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-2xl text-slate-100 font-hind select-none">
      {/* Background glowing ambient pulses */}
      <div className={`absolute -top-20 -right-20 w-96 h-96 ${themeColors.glow} rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Lock Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`relative w-full max-w-xl rounded-3xl bg-slate-900/90 border ${themeColors.border} backdrop-blur-3xl shadow-2xl p-6 sm:p-9 overflow-hidden`}
      >
        {/* Glowing top line */}
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent`} />

        {/* Offline Security Alert Banner (if offline lock) */}
        {(isOffline || isOfflineLockActive) && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>অফলাইন সিকিউরিটি লক:</strong> ডিভাইস অফলাইনে রয়েছে বা নেটওয়ার্ক সংযোগ বিচ্ছিন্ন।
              </span>
            </div>
            <button
              onClick={onRetryConnection}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>পুনরায় চেষ্টা</span>
            </button>
          </div>
        )}

        {/* Central Icon and Live Broadcast Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-slate-800/90 border border-white/10 flex items-center justify-center shadow-inner">
              {isOfflineLockActive ? (
                <WifiOff className="w-10 h-10 text-amber-400" />
              ) : (
                themeColors.icon
              )}
            </div>

            {/* Pulsing broadcast ping */}
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${themeColors.pingColor} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-4 w-4 ${themeColors.pingColor}`} />
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-jakarta border ${themeColors.badgeBg}`}>
              {isOfflineLockActive ? 'OFFLINE SECURITY LOCK' : 'GLOBAL EMERGENCY BROADCAST LOCK'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-jakarta tracking-wide mb-2">
            {notice.title || 'জরুরি সিস্টেম নোটিশ ও প্ল্যাটফর্ম লক'}
          </h2>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent my-2" />

          {/* Detailed Message Box */}
          <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/5 text-left w-full">
            <p className="text-sm text-slate-200 leading-relaxed font-hind whitespace-pre-line">
              {notice.message}
            </p>
            {notice.updatedAt && (
              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-anek">
                <span>প্রেরক: {notice.updatedBy || 'সিস্টেম অ্যাডমিন'}</span>
                <span>সময়: {new Date(notice.updatedAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {/* Admin Bypass Button */}
            <button
              onClick={() => setShowPasscodeModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white text-xs font-bold border border-white/10 shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>অ্যাডমিন বাইপাস ও আনলক (Admin Bypass)</span>
            </button>

            {/* Retry Button */}
            <button
              onClick={onRetryConnection}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>রিফ্রেশ / স্ট্যাটাস চেক</span>
            </button>

            {/* Optional Student Dismiss if allowed */}
            {notice.allowStudentDismiss && onDismissNotice && (
              <button
                onClick={onDismissNotice}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Admin Passcode Modal */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-6 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowPasscodeModal(false);
                  setPasscodeError('');
                }}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-jakarta">
                    MASTER ADMIN AUTHENTICATION
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    লক প্রত্যাহার বা বাইপাস করতে পাসকোড দিন
                  </p>
                </div>
              </div>

              {actionSuccessMessage ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleVerifyPasscode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      ১০ ডিজিট মাস্টার অ্যাডমিন পাসকোড:
                    </label>
                    <input
                      type="password"
                      autoFocus
                      placeholder="পাসকোড প্রদান করুন (যেমন: 1919131514)"
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setPasscodeError('');
                      }}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    {passcodeError && (
                      <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-anek">
                        <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                        <span>{passcodeError}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasscodeModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'ভেরিফাই হচ্ছে...' : 'লক আনলক করুন'}</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
