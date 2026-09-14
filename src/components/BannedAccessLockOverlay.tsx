import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Lock, 
  RefreshCw, 
  KeyRound, 
  AlertOctagon, 
  Smartphone, 
  Globe, 
  Calendar, 
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { App as CapacitorApp } from '@capacitor/app';
import { BanCheckResult, unbanDevice, unbanIp } from '../services/deviceSecurityService';

interface BannedAccessLockOverlayProps {
  banDetails: BanCheckResult;
  onRecheck: () => Promise<void>;
  onUnbanSuccess: () => void;
}

export const BannedAccessLockOverlay: React.FC<BannedAccessLockOverlayProps> = ({
  banDetails,
  onRecheck,
  onUnbanSuccess,
}) => {
  const [isRechecking, setIsRechecking] = useState(false);
  const [showAdminUnlock, setShowAdminUnlock] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  // Hardware Back Button & Popstate Trap
  useEffect(() => {
    let handler: any = null;
    try {
      CapacitorApp.addListener('backButton', () => {
        console.warn('Hardware back pressed during Ban Lock - blocked');
      }).then((h) => {
        handler = h;
      });
    } catch {
      // ignore
    }

    const trapHistory = () => {
      window.history.pushState(null, '', window.location.href);
    };
    trapHistory();
    window.addEventListener('popstate', trapHistory);

    return () => {
      if (handler && typeof handler.remove === 'function') {
        handler.remove();
      }
      window.removeEventListener('popstate', trapHistory);
    };
  }, []);

  // Manual re-check
  const handleCheckNow = async () => {
    setIsRechecking(true);
    try {
      await onRecheck();
    } finally {
      setIsRechecking(false);
    }
  };

  // Admin Master Passcode Bypass & Self-Unban
  const handleAdminBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() !== '1919131514') {
      setPasscodeError('ভুল মাস্টার পাসকোড! সঠিক এডমিন পাসকোড প্রদান করুন।');
      return;
    }

    setIsUnlocking(true);
    setPasscodeError('');

    try {
      if (banDetails.deviceID) {
        await unbanDevice(banDetails.deviceID);
      }
      if (banDetails.ipAddress) {
        await unbanIp(banDetails.ipAddress);
      }

      setUnlockSuccess(true);
      setTimeout(() => {
        onUnbanSuccess();
      }, 1000);
    } catch {
      setPasscodeError('আনলক সম্পন্ন করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।');
    } finally {
      setIsUnlocking(false);
    }
  };

  const formatDateBn = (dateStr?: string) => {
    if (!dateStr) return 'এইমাত্র';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div 
      id="banned-access-lock-overlay"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0D111D] overflow-y-auto transform-gpu select-none"
    >
      {/* Deep Neon Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#5B50F6]/10 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg rounded-3xl bg-[#151C2C] border border-rose-500/40 shadow-2xl p-6 sm:p-8 font-hind text-slate-100 my-auto"
      >
        {/* Animated Badge & Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-950/60">
              <ShieldAlert className="w-10 h-10 animate-pulse text-rose-500" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-slate-900 border border-rose-500 flex items-center justify-center text-rose-400 shadow-md">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold uppercase tracking-wider mb-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>ACCESS RESTRICTED • ডিভাইস ব্লকড</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-jakarta tracking-tight">
            অ্যাক্সেস সম্পূর্ণভাবে স্থগিত
          </h2>

          <div className="mt-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm font-anek leading-relaxed text-center font-medium">
            আপনার ডিভাইস বা আইপি অ্যাড্রেস থেকে অ্যাপ অ্যাক্সেস ব্লক করা হয়েছে। এডমিনের অনুমতি ছাড়া এই অ্যাপটি ব্যবহার করা সম্ভব নয়।
          </div>
        </div>

        {/* Security Parameters Details Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5 text-xs mb-6">
          {/* Target Identifier */}
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1.5 font-anek">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              ডিভাইস আইডি (Device ID):
            </span>
            <span className="font-mono text-[11px] text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 max-w-[210px] truncate">
              {banDetails.deviceID || 'DEV-SSC2028-IDENTIFIER'}
            </span>
          </div>

          {/* Network IP */}
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1.5 font-anek">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              নেটওয়ার্ক আইপি (IP Address):
            </span>
            <span className="font-mono text-xs text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {banDetails.ipAddress || '103.145.118.42'}
            </span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1.5 font-anek">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              ব্লকের সময়কাল:
            </span>
            <span className="text-slate-300 font-anek">
              {formatDateBn(banDetails.bannedAt)}
            </span>
          </div>

          {/* Reason */}
          <div className="pt-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-anek mb-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              ব্লক করার কারণ (Reason):
            </span>
            <p className="text-amber-200/90 text-xs bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 font-anek">
              {banDetails.reason || 'অ্যাকাউন্টের নিরাপত্তা নিয়ম লঙ্ঘন বা সন্দেহজনক কার্যকলাপ।'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          {/* Re-check Real-time Ban Status */}
          <button
            id="btn-recheck-ban-status"
            onClick={handleCheckNow}
            disabled={isRechecking}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-anek disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRechecking ? 'animate-spin' : ''}`} />
            <span>{isRechecking ? 'যাচাই করা হচ্ছে...' : 'স্ট্যাটাস পুনঃযাচাই করুন (Recheck Status)'}</span>
          </button>

          {/* Toggle Admin Master Passcode Unlock */}
          <button
            onClick={() => {
              setShowAdminUnlock(!showAdminUnlock);
              setPasscodeError('');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer font-anek"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>এডমিন আনলক প্যানেল (Admin Master Unlock)</span>
          </button>
        </div>

        {/* Admin Unlock Modal Accordion */}
        <AnimatePresence>
          {showAdminUnlock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-white/10"
            >
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white font-jakarta">
                    MASTER ADMIN PASSCODE UNLOCK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3 font-anek">
                  যদি আপনি সিস্টেম এডমিন হন, মাস্টার পাসকোড দিয়ে এই ডিভাইস ও আইপি আনব্যান করুন:
                </p>

                {unlockSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-anek font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>সফলভাবে আনব্যান সম্পন্ন হয়েছে! অ্যাপে প্রবেশ করা হচ্ছে...</span>
                  </div>
                ) : (
                  <form onSubmit={handleAdminBypass} className="space-y-3">
                    <div className="relative">
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          setPasscodeError('');
                        }}
                        placeholder="পাসওয়ার্ড দিন"
                        autoFocus
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>

                    {passcodeError && (
                      <p className="text-[11px] text-rose-400 font-anek flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                        <span>{passcodeError}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isUnlocking || !passcode}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer font-anek disabled:opacity-50"
                    >
                      {isUnlocking ? 'আনলক করা হচ্ছে...' : 'ডিভাইস ও আইপি আনব্যান করুন'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Support Info */}
        <div className="mt-5 pt-3 border-t border-white/5 text-center text-[11px] text-slate-500 font-anek flex items-center justify-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ভুলবশত ব্লক হয়ে থাকলে প্রধান প্রশাসকের সাথে যোগাযোগ করুন</span>
        </div>
      </motion.div>
    </div>
  );
};
