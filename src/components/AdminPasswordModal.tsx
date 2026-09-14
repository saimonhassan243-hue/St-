/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  X,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Fixed Passcode Validation: Set passcode strictly to '1919131514'
export const MASTER_ADMIN_PASSCODE = '1919131514';

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passcode.trim() === MASTER_ADMIN_PASSCODE) {
      setErrorMessage(null);
      setPasscode('');
      onSuccess();
    } else {
      // Access Logic: If passcode is INCORRECT: Show error toast "ভুল পাসওয়ার্ড! প্রবেশাধিকার সংরক্ষিত।"
      setErrorMessage('ভুল পাসওয়ার্ড! প্রবেশাধিকার সংরক্ষিত।');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleClose = () => {
    setPasscode('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-hind">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/90 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-xl shadow-purple-600/30 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-amber-400">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-jakarta">
              ADMIN VERIFICATION
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white font-jakarta">
            মাস্টার অ্যাডমিন পাসকোড
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
            শিক্ষার্থীদের মনিটরিং ডাটাবেস এবং সিস্টেম নিয়ন্ত্রণের জন্য নির্ধারিত পাসকোড লিখুন।
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-5 space-y-3.5">
            <div className={`relative ${shake ? 'animate-bounce' : ''}`}>
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="পাসওয়ার্ড দিন"
                  autoFocus
                  className={`w-full px-4 py-3 pl-10 pr-11 rounded-2xl bg-slate-950/90 border text-white placeholder-slate-500 text-xs font-mono tracking-widest focus:outline-none transition-all shadow-inner text-center ${
                    errorMessage
                      ? 'border-rose-500 ring-2 ring-rose-500/30'
                      : 'border-white/15 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30'
                  }`}
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400">
                  <Lock className="w-4 h-4" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 cursor-pointer font-jakarta transition-all"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-300" />
                <span>লগইন করুন (Verify)</span>
              </motion.button>
            </div>
          </form>

          <div className="mt-4 text-[10px] text-slate-500 flex items-center gap-1 font-anek">
            <ShieldAlert className="w-3 h-3 text-purple-400" />
            <span>প্রবেশাধিকার সংরক্ষিত • মাস্টার পাসকোড প্রযোজ্য</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
