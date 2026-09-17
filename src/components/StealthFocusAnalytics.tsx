/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Flame, 
  Zap, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Brain
} from 'lucide-react';
import { toBengaliNumber } from '../utils/progressCalculator';

interface StealthFocusAnalyticsProps {
  totalStudyMinutesLogged?: number;
  onFocusUpdate?: (activeMinutes: number, focusScore: number) => void;
}

const STORAGE_KEY_FOCUS_METRICS = 'ssc_stealth_focus_metrics_v1';

export const StealthFocusAnalytics: React.FC<StealthFocusAnalyticsProps> = ({
  totalStudyMinutesLogged = 0,
  onFocusUpdate,
}) => {
  const [activeSessionSeconds, setActiveSessionSeconds] = useState<number>(0);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const [isUserActive, setIsUserActive] = useState<boolean>(true);
  const [showDetailedModal, setShowDetailedModal] = useState<boolean>(false);
  const [todayDeepWorkMinutes, setTodayDeepWorkMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FOCUS_METRICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          return parsed.minutes || 0;
        }
      }
    } catch {
      // fallback
    }
    return 0; // ZERO metric initialization default
  });

  const lastInteractionRef = useRef<number>(Date.now());
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus Quality Score Calculation (0 - 100%)
  // Factors: Continuous engagement without tab blur or long idle timeouts
  const focusQualityScore = React.useMemo(() => {
    if (!isTabFocused) return 40;
    if (!isUserActive) return 65;
    if (activeSessionSeconds > 1500) return 98; // > 25 mins deep work
    if (activeSessionSeconds > 900) return 92;  // > 15 mins
    if (activeSessionSeconds > 300) return 85;  // > 5 mins
    return 78;
  }, [isTabFocused, isUserActive, activeSessionSeconds]);

  // Activity Detector (Mouse, Keyboard, Touch, Scroll)
  useEffect(() => {
    const handleActivity = () => {
      lastInteractionRef.current = Date.now();
      if (!isUserActive) {
        setIsUserActive(true);
      }
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      // If no activity for 60 seconds, mark as idle
      idleTimeoutRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 60000);
    };

    const handleVisibilityChange = () => {
      const focused = document.visibilityState === 'visible';
      setIsTabFocused(focused);
      if (focused) handleActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [isUserActive]);

  // Active Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTabFocused && isUserActive) {
        setActiveSessionSeconds((prev) => {
          const next = prev + 1;
          // Every minute update today's deep work
          if (next % 60 === 0) {
            setTodayDeepWorkMinutes((d) => {
              const updated = d + 1;
              try {
                const todayStr = new Date().toISOString().split('T')[0];
                localStorage.setItem(
                  STORAGE_KEY_FOCUS_METRICS,
                  JSON.stringify({ date: todayStr, minutes: updated })
                );
              } catch (e) {
                console.warn('Focus metrics storage note:', e);
              }
              return updated;
            });
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTabFocused, isUserActive]);

  const activeMinutes = Math.floor(activeSessionSeconds / 60);
  const activeSeconds = activeSessionSeconds % 60;

  return (
    <>
      {/* Mini Floating Stealth Widget Pill in Dashboard */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowDetailedModal(true)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer select-none text-xs font-anek ${
            focusQualityScore >= 90
              ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
              : focusQualityScore >= 70
              ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-300'
              : 'bg-slate-900/80 border-amber-500/30 text-amber-300'
          }`}
          title="রিয়েলটাইম স্টিলথ ফোকাস কোয়ালিটি স্কোর"
        >
          <div className="relative flex items-center justify-center">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex items-center gap-1.5 font-bold">
            <span>ফোকাস: {toBengaliNumber(focusQualityScore)}%</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              ({toBengaliNumber(activeMinutes)} মি.)
            </span>
          </div>
        </button>
      </div>

      {/* Detailed Focus Modal */}
      <AnimatePresence>
        {showDetailedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050811]/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0b1021] border border-emerald-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl shadow-emerald-500/10 text-slate-100 font-hind relative"
            >
              {/* Top Close */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-jakarta">
                      স্টিলথ ফোকাস এনালাইটিক্স (Stealth OS)
                    </h3>
                    <p className="text-xs text-slate-400 font-anek">
                      অ্যাপ্লিকেশন স্ক্রিনে সক্রিয় মনোযোগ ও গভীর পাঠ সেশন ট্র্যাকার
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetailedModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Score Center */}
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-emerald-400 transition-all duration-1000"
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * focusQualityScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white font-mono">
                      {toBengaliNumber(focusQualityScore)}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-anek">
                      কোয়ালিটি স্কোর
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white font-jakarta mt-2">
                  {focusQualityScore >= 90
                    ? '⚡ সুপার পিক ফোকাস মোড সক্রিয়'
                    : focusQualityScore >= 75
                    ? '🎯 স্থির ও গভীর অধ্যয়ন মোড'
                    : '⚠️ মনোযোগ পুনরুদ্ধার প্রয়োজন'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs font-anek">
                  স্ক্রিনে নিয়মিত প্রশ্ন সমাধান, কনসেপ্ট রিভিশন ও ক্যানভাস ব্যবহারের মাধ্যমে মনোযোগ বৃদ্ধি পাচ্ছে।
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 font-anek text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px] block">চলমান সক্রিয় সেশন:</span>
                  <span className="text-base font-bold text-cyan-400 font-mono">
                    {toBengaliNumber(activeMinutes)} মি. {toBengaliNumber(activeSeconds)} সে.
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                  <span className="text-slate-400 text-[11px] block">আজকের ডিপ-ওয়ার্ক টাইম:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {toBengaliNumber(todayDeepWorkMinutes)} মিনিট
                  </span>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs font-anek">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">স্ক্রিন ভিজিবিলিটি স্ট্যাটাস:</span>
                  <span className={`font-bold ${isTabFocused ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isTabFocused ? 'অন-স্ক্রিন অ্যাক্টিভ ✓' : 'ট্যাব মিনিমাইজড ⏸'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ইউজার ইন্টার‍্যাকশন পেসিং:</span>
                  <span className={`font-bold ${isUserActive ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {isUserActive ? 'রেগুলার স্টাডি ফ্লো ⚡' : 'আইডল ডিটেক্টেড ⏳'}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowDetailedModal(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-anek shadow-md"
                >
                  পড়াশোনায় ফিরে যান →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
