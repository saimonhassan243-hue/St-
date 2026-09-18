import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  Flame, 
  Calendar, 
  Target, 
  Archive, 
  Database, 
  Trophy, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Moon, 
  BarChart3, 
  AlertTriangle,
  Layers,
  GraduationCap,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { UserProfile, Subject, ChapterProgressData, NavTabKey } from '../types';

interface CyberDashboardViewProps {
  profile: UserProfile;
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  examDate?: string;
  onNavigateTab: (tab: NavTabKey) => void;
  onOpenFlashcards: () => void;
  onOpenEveMode: () => void;
  onOpenPredictionMatrix: () => void;
  onOpenAchievementsModal: () => void;
  onOpenReminderModal: () => void;
  onOpenBacklogRecoveryModal: () => void;
}

export const CyberDashboardView: React.FC<CyberDashboardViewProps> = ({
  profile,
  subjects,
  chapterProgress,
  examDate = '2028-02-15',
  onNavigateTab,
  onOpenFlashcards,
  onOpenEveMode,
  onOpenPredictionMatrix,
  onOpenAchievementsModal,
  onOpenReminderModal,
  onOpenBacklogRecoveryModal,
}) => {
  // Compute overall completion stats
  let totalChapters = 0;
  let completedChapters = 0;

  subjects.forEach((subj) => {
    subj.chapters.forEach((ch) => {
      totalChapters++;
      const p = chapterProgress[ch.id];
      if (p && (p.status === 'completed' || p.status === 'revised')) {
        completedChapters++;
      }
    });
  });

  const completionRate = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Days left to exam calculation
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. 🌌 CYBERPUNK HERO COCKPIT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950 border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.18)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>STUDY OS MEGA-PLATFORM v4.5</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300 text-xs font-bold font-mono">
                {profile.group || 'বিজ্ঞান (Science)'} • ব্যাচ {profile.sscBatch || '২০২৬'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              স্বাগতম, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300">{profile.name || 'শিক্ষার্থী'}</span>!
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              আপনার এসএসসি প্রস্তুতি এখন ১০০% ট্র্যাকড। বিগত বছরের প্রশ্নব্যাংক, ক্যাডেট কলেজ স্পেশাল পেপার ও AI অটো-রিকভারি সম্পূর্ণ প্রস্তুত।
            </p>
          </div>

          {/* Key Metrics HUD Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Countdown */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>পরীক্ষার বাকি</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-0.5">
                {daysLeft} <span className="text-xs font-normal text-slate-400">দিন</span>
              </div>
            </div>

            {/* Streak */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>স্ট্রিক ফ্লেম</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <span>{profile.streakDays || 1}</span>
                <span className="text-xs font-normal text-slate-400">দিন</span>
              </div>
            </div>

            {/* Target GPA */}
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-purple-400" />
                <span>টার্গেট জিপিএ</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5">
                {profile.targetGrade || 'GPA 5.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => onNavigateTab('routine')}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/80 hover:to-blue-900/80 border border-cyan-500/30 text-left transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between text-cyan-400 mb-1">
              <Calendar className="w-4 h-4" />
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">দৈনিক রুটিন</div>
            <div className="text-[10px] text-slate-400">আজকের নির্ধারিত টাস্ক</div>
          </button>

          <button
            onClick={() => onNavigateTab('backlog')}
            className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-amber-950/60 hover:from-rose-900/80 hover:to-amber-900/80 border border-rose-500/30 text-left transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <Archive className="w-4 h-4" />
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-extrabold">AUTO</span>
            </div>
            <div className="text-xs font-bold text-white">ব্যাকলগ ভল্ট</div>
            <div className="text-[10px] text-slate-400">মিস হওয়া টপিক রিকভার</div>
          </button>

          <button
            onClick={() => onNavigateTab('megabank')}
            className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/80 hover:to-indigo-900/80 border border-purple-500/30 text-left transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500 text-white font-extrabold">2026</span>
            </div>
            <div className="text-xs font-bold text-white">মেগা ব্যাংক</div>
            <div className="text-[10px] text-slate-400">সকল বোর্ড ও ক্যাডেট পেপার</div>
          </button>

          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-yellow-950/60 hover:from-amber-900/80 hover:to-yellow-900/80 border border-amber-500/30 text-left transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <Trophy className="w-4 h-4" />
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white">লিডারবোর্ড</div>
            <div className="text-[10px] text-slate-400">জাতীয় র‍্যাঙ্ক ও XP</div>
          </button>
        </div>
      </div>

      {/* 2. ⚡ SMART STUDY ACTION HUB (Bento Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Syllabus Progress Radial */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>সিলেবাস পূর্ণতা ট্র্যাকার</span>
              </span>
              <span className="text-xs font-mono font-black text-white">{completionRate}%</span>
            </div>
            <h3 className="text-lg font-black text-white">মোট অগ্রগতি ও অধ্যায়</h3>
          </div>

          <div className="space-y-2">
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-md"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{completedChapters} টি অধ্যায় সম্পন্ন</span>
              <span>{totalChapters} টি মোট অধ্যায়</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('syllabus')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>সম্পূর্ণ সিলেবাস দেখুন</span>
          </button>
        </div>

        {/* Card 2: 15s Flashcards & Recall Accelerator */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>অ্যাক্টিভ রিকল মেমোরি</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                ১৫ SEC
              </span>
            </div>
            <h3 className="text-lg font-black text-white">স্পিড ফ্ল্যাশ কার্ডস ও সূত্র</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              বিজ্ঞানের কঠিন সূত্র, রাসায়নিক বিক্রিয়া ও গাণিতিক নিয়ম নিমেষেই মুখস্থ করুন।
            </p>
          </div>

          <button
            onClick={onOpenFlashcards}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
          >
            <span>🎴</span>
            <span>স্পিড কার্ড চালু করুন</span>
          </button>
        </div>

        {/* Card 3: Exam Eve / Prediction Matrix */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Moon className="w-4 h-4" />
                <span>এক্সাম নাইট হট মোড</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                PRO
              </span>
            </div>
            <h3 className="text-lg font-black text-white">পরীক্ষার আগের রাতের সামারি</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              পরীক্ষার শেষ মুহূর্তে শুধুমাত্র নিশ্চিত প্রশ্ন ও টপ-গ্রেড কনসেপ্টগুলো একনজরে রিভিশন দিন।
            </p>
          </div>

          <button
            onClick={onOpenEveMode}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
          >
            <span>🌙</span>
            <span>হট রিভিশন শিট খুলুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
