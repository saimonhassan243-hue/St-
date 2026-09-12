/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useId } from 'react';
import { motion } from 'motion/react';
import { 
  Timer, 
  Calendar, 
  Clock, 
  Sparkles, 
  Flame, 
  Target, 
  Edit3, 
  Check, 
  RotateCcw,
  Zap,
  BellRing
} from 'lucide-react';

interface TimeBreakdown {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalHours: number;
}

interface ExamCountdownWidgetProps {
  targetDate?: string;
  batchLabel?: string;
  onUpdateTargetDate?: (newDate: string) => void;
  variant?: 'full' | 'compact' | 'hero';
  className?: string;
  id?: string;
}

const DEFAULT_SSC_2028_DATE = '2028-02-15T09:00:00';

export const ExamCountdownWidget: React.FC<ExamCountdownWidgetProps> = ({
  targetDate = DEFAULT_SSC_2028_DATE,
  batchLabel = 'SSC 2028',
  onUpdateTargetDate,
  variant = 'full',
  className = '',
  id = 'ssc-live-countdown-widget',
}) => {
  const [examDate, setExamDate] = useState<string>(targetDate || DEFAULT_SSC_2028_DATE);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(targetDate ? targetDate.slice(0, 10) : '2028-02-15');
  const dateInputId = useId();

  // Helper to compute time remaining
  const getTimeRemaining = useCallback((targetIso: string): TimeBreakdown => {
    try {
      const targetTime = new Date(targetIso).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(difference) || difference <= 0) {
        return {
          totalMs: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          totalHours: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const totalHours = Math.floor(difference / (1000 * 60 * 60));

      return {
        totalMs: difference,
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        totalHours,
      };
    } catch {
      return {
        totalMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        totalHours: 0,
      };
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeBreakdown>(() => getTimeRemaining(examDate));

  // Sync prop changes
  useEffect(() => {
    if (targetDate) {
      setExamDate(targetDate);
      setEditInput(targetDate.slice(0, 10));
    }
  }, [targetDate]);

  // LIVE COUNTDOWN TIMER WITH SAFE CLEANUP
  useEffect(() => {
    // 1. Immediately update once to avoid 1-second lag
    setTimeLeft(getTimeRemaining(examDate));

    // 2. Set interval for every 1000ms
    const intervalId = window.setInterval(() => {
      setTimeLeft(getTimeRemaining(examDate));
    }, 1000);

    // 3. Clean up safely on unmount or when examDate changes to avoid background memory leaks
    return () => {
      window.clearInterval(intervalId);
    };
  }, [examDate, getTimeRemaining]);

  const handleSaveDate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editInput) return;
    const formatted = `${editInput}T09:00:00`;
    setExamDate(formatted);
    if (onUpdateTargetDate) {
      onUpdateTargetDate(formatted);
    }
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    setExamDate(DEFAULT_SSC_2028_DATE);
    setEditInput('2028-02-15');
    if (onUpdateTargetDate) {
      onUpdateTargetDate(DEFAULT_SSC_2028_DATE);
    }
    setIsEditing(false);
  };

  // Convert digits to Bengali numerals if needed or stylish modern typography
  const toBn = (n: number | string) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n)
      .split('')
      .map((ch) => {
        const d = parseInt(ch, 10);
        return isNaN(d) ? ch : bnDigits[d];
      })
      .join('');
  };

  const formattedTargetDateString = new Date(examDate).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // PRESET EXAM MILESTONES FOR SSC 2028
  const PRESET_DATES = [
    { label: 'SSC 2028 চূড়ান্ত পরীক্ষা', date: '2028-02-15' },
    { label: 'টেস্ট (নির্বাচনী) ২০২৭', date: '2027-11-15' },
    { label: 'প্রাক-নির্বাচনী (Pre-test) ২০২৭', date: '2027-08-01' },
  ];

  // 1. COMPACT VARIANT (for top headers or sidebars)
  if (variant === 'compact') {
    return (
      <div 
        id={id}
        className={`bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-3 text-white ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-300 font-jakarta uppercase tracking-wider">
            {batchLabel} EXAM:
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
            {timeLeft.days}d
          </span>
          <span className="text-slate-500">:</span>
          <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            {String(timeLeft.hours).padStart(2, '0')}h
          </span>
          <span className="text-slate-500">:</span>
          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
          <span className="text-slate-500">:</span>
          <span className="px-2 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30 animate-pulse">
            {String(timeLeft.seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>
    );
  }

  // 2. FULL GLASSMORPHIC CARD VARIANT (Default)
  return (
    <div
      id={id}
      className={`relative w-full rounded-3xl overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-slate-950/90 border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Glowing Pulsing Ambient Accents */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/60 via-pink-500/60 to-transparent" />

      <div className="p-5 sm:p-7 md:p-8 space-y-6">
        
        {/* TOP STATUS ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          
          {/* Glowing Live Pulsing Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.9)]"></span>
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-white tracking-wider font-jakarta uppercase flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-purple-400" />
                  LIVE EXAM COUNTDOWN
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-jakarta shadow-xs">
                  {batchLabel}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  নির্ধারিত লক্ষ্য: ১৫ ফেব্রুয়ারি ২০২৮
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-hind">
                টার্গেট বোর্ড পরীক্ষা: <span className="text-slate-200 font-semibold">{formattedTargetDateString}</span>
              </p>
            </div>
          </div>

          {/* Action / Date Edit Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              id="btn-toggle-edit-target-date"
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
              <span>{isEditing ? 'বন্ধ করুন' : 'তারিখ সেট করুন'}</span>
            </button>
            <button
              type="button"
              id="btn-reset-default-2028"
              onClick={handleResetToDefault}
              title="SSC 2028 ডিফল্ট তারিখে রিসেট"
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DATE CONFIGURATION ACCORDION */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label htmlFor={dateInputId} className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                পরীক্ষার নির্দিষ্ট তারিখ নির্বাচন করুন:
              </label>
              <span className="text-[11px] text-slate-400">
                ডিফল্ট: 15 February 2028
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id={dateInputId}
                type="date"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 flex-1"
              />
              <button
                type="button"
                onClick={() => handleSaveDate()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                সংরক্ষণ করুন
              </button>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">দ্রুত সিলেক্ট:</span>
              {PRESET_DATES.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setEditInput(p.date);
                    const formatted = `${p.date}T09:00:00`;
                    setExamDate(formatted);
                    if (onUpdateTargetDate) onUpdateTargetDate(formatted);
                    setIsEditing(false);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/90 text-purple-300 hover:bg-purple-900/40 border border-purple-500/20 transition-all cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4 GLOWING GLASSMORPHIC COUNTDOWN DIGIT TILES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          
          {/* 1. DAYS TILE */}
          <div className="relative group p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_8px_25px_rgba(168,85,247,0.15)] backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all">
            <div className="absolute top-2 right-2.5 text-[10px] font-bold text-purple-400/80 uppercase tracking-widest font-jakarta">
              DAYS
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-anek text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-300 tracking-tight mt-2">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-purple-300 mt-2 font-hind flex items-center gap-1">
              <span>দিন</span>
              <span className="text-[10px] text-slate-400 font-mono">({toBn(timeLeft.days)})</span>
            </div>
            <div className="w-8 h-1 bg-purple-500/40 rounded-full mt-2" />
          </div>

          {/* 2. HOURS TILE */}
          <div className="relative group p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400/60 shadow-[0_8px_25px_rgba(99,102,241,0.15)] backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all">
            <div className="absolute top-2 right-2.5 text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest font-jakarta">
              HOURS
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-anek text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-300 tracking-tight mt-2">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-indigo-300 mt-2 font-hind flex items-center gap-1">
              <span>ঘণ্টা</span>
              <span className="text-[10px] text-slate-400 font-mono">({toBn(timeLeft.hours)})</span>
            </div>
            <div className="w-8 h-1 bg-indigo-500/40 rounded-full mt-2" />
          </div>

          {/* 3. MINUTES TILE */}
          <div className="relative group p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_8px_25px_rgba(6,182,212,0.15)] backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all">
            <div className="absolute top-2 right-2.5 text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest font-jakarta">
              MINUTES
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-anek text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-300 tracking-tight mt-2">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-cyan-300 mt-2 font-hind flex items-center gap-1">
              <span>মিনিট</span>
              <span className="text-[10px] text-slate-400 font-mono">({toBn(timeLeft.minutes)})</span>
            </div>
            <div className="w-8 h-1 bg-cyan-500/40 rounded-full mt-2" />
          </div>

          {/* 4. SECONDS TILE (WITH PULSING GLOW) */}
          <div className="relative group p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-pink-500/40 hover:border-pink-400/70 shadow-[0_8px_30px_rgba(244,63,94,0.25)] backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-2 right-2.5 text-[10px] font-bold text-pink-400 uppercase tracking-widest font-jakarta flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              SECS
            </div>
            <div className="text-3xl sm:text-5xl md:text-6xl font-black font-anek text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 tracking-tight mt-2">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-pink-300 mt-2 font-hind flex items-center gap-1">
              <span>সেকেন্ড</span>
              <span className="text-[10px] text-slate-400 font-mono">({toBn(timeLeft.seconds)})</span>
            </div>
            <div className="w-8 h-1 bg-pink-500 rounded-full mt-2 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </div>
        </div>

        {/* BOTTOM METRICS STRIP */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-hind">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 text-amber-300 border border-amber-500/20 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              মোট অবশিষ্ট সময়: প্রায় {toBn(timeLeft.totalHours)} ঘণ্টা
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 text-indigo-300 border border-indigo-500/20 font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              প্রতিদিন ৪-৫ ঘণ্টা সুষম রিভিশন লক্ষ্যমাত্রা
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <BellRing className="w-3.5 h-3.5 text-purple-400" />
            <span>লাইভ সেকেন্ড ট্র্যাকার রিয়েল-টাইমে আপডেট হচ্ছে</span>
          </div>
        </div>

      </div>
    </div>
  );
};
