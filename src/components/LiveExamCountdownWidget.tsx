import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, Calendar, Sparkles, Clock, Flame, AlertCircle } from 'lucide-react';
import { toBengaliNumber } from '../utils/progressCalculator';

interface LiveExamCountdownWidgetProps {
  examDate?: string;
  sscBatch?: string;
  variant?: 'hero' | 'compact' | 'card';
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const LiveExamCountdownWidget: React.FC<LiveExamCountdownWidgetProps> = ({
  examDate = '2028-02-15',
  sscBatch = 'SSC 2028',
  variant = 'hero',
  className = '',
}) => {
  const calculateTimeRemaining = (targetDateString: string): TimeRemaining => {
    const targetTime = new Date(targetDateString).getTime();
    const currentTime = Date.now();
    const difference = targetTime - currentTime;

    if (difference <= 0 || isNaN(targetTime)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(examDate)
  );

  // Safe timer interval cleanup inside React useEffect to prevent background memory leaks
  useEffect(() => {
    // Initial immediate calculation
    setTimeRemaining(calculateTimeRemaining(examDate));

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(examDate));
    }, 1000);

    // CRITICAL: Cleanup interval on unmount or when examDate changes
    return () => {
      clearInterval(intervalId);
    };
  }, [examDate]);

  const units = [
    { label: 'দিন (Days)', value: timeRemaining.days, color: 'text-cyan-400', glow: 'bg-cyan-500/20' },
    { label: 'ঘণ্টা (Hours)', value: timeRemaining.hours, color: 'text-indigo-400', glow: 'bg-indigo-500/20' },
    { label: 'মিনিট (Mins)', value: timeRemaining.minutes, color: 'text-emerald-400', glow: 'bg-emerald-500/20' },
    { label: 'সেকেন্ড (Secs)', value: timeRemaining.seconds, color: 'text-pink-400', glow: 'bg-pink-500/20', pulsing: true },
  ];

  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-3 shadow-lg ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase font-jakarta">
              {sscBatch} COUNTDOWN
            </div>
            <div className="text-xs font-extrabold text-white font-anek">
              {toBengaliNumber(timeRemaining.days)} দিন {toBengaliNumber(timeRemaining.hours)} ঘণ্টা বাকি
            </div>
          </div>
        </div>

        {/* Live pulsing indicator */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping inline-block" />
          <span className="text-[10px] font-bold text-pink-300 font-anek">
            {toBengaliNumber(String(timeRemaining.seconds).padStart(2, '0'))}s
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl ${className}`}>
      {/* Background ambient glowing pulses */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Timer className="w-5 h-5" />
            </div>
            {/* Live Indicator Dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide font-jakarta">
                LIVE EXAM COUNTDOWN
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-anek">
                {sscBatch}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-anek">
              বোর্ড পরীক্ষার লাইভ সময় গণনা • টার্গেট: ১৫ ফেব্রুয়ারি ২০২৮
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/5 text-xs text-slate-300 font-anek">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>১৫ ফেব্রুয়ারি ২০২৮</span>
          </div>
        </div>
      </div>

      {/* 4 Glowing Countdown Blocks */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-white/10 backdrop-blur-xl text-center shadow-lg group hover:border-cyan-500/40 transition-all"
          >
            {/* Subtle glow background */}
            <div className={`absolute inset-0 rounded-2xl ${unit.glow} opacity-20 blur-xl pointer-events-none group-hover:opacity-40 transition-opacity`} />

            <div className="relative">
              <div className={`text-3xl sm:text-5xl font-black font-anek ${unit.color} tracking-tight drop-shadow-sm`}>
                {toBengaliNumber(String(unit.value).padStart(2, '0'))}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-2 font-anek">
                {unit.label}
              </div>
            </div>

            {/* Glowing Pulse for seconds */}
            {unit.pulsing && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-sm shadow-pink-500/50" />
            )}
          </div>
        ))}
      </div>

      {/* Motivational Bottom Bar */}
      <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-slate-800/40 to-slate-900 border border-white/5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-hind">
            প্রতিটি সেকেন্ড মূল্যবান! প্রতিদিন অন্তত ৫ ঘণ্টা মন দিয়ে পড়াশোনা করুন।
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-cyan-400 font-bold font-anek shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>টার্গেট: গোল্ডেন A+</span>
        </div>
      </div>
    </div>
  );
};
