import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  Sparkles, 
  Flame, 
  Zap, 
  Crown, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AchievementBadge } from '../types';

interface XpAchievementCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedXp?: number;
  currentLevel?: number;
  currentStreak?: number;
  recentBadge?: Partial<AchievementBadge>;
}

export const XpAchievementCelebrationModal: React.FC<XpAchievementCelebrationModalProps> = ({
  isOpen,
  onClose,
  earnedXp = 150,
  currentLevel = 4,
  currentStreak = 15,
  recentBadge = {
    title: 'ফিজিক্স মাস্টার বেইজ',
    description: 'পদার্থবিজ্ঞানের সকল মৌলিক গতির সমীকরণ রিভাইজ সম্পন্ন করেছেন',
    icon: '⚡',
    rarity: 'Epic',
  },
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-amber-400/40 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.25)] p-6 sm:p-8 text-center overflow-hidden"
        >
          {/* Confetti Glow Background Effect */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge Icon Animation */}
          <div className="relative mx-auto w-24 h-24 mt-2">
            <div className="absolute inset-0 rounded-3xl bg-amber-500/20 animate-ping" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-2xl flex items-center justify-center text-4xl">
              {recentBadge.icon || '🏆'}
            </div>
          </div>

          {/* Titles */}
          <div className="mt-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>লেভেল আপ ও নতুন অর্জন আনলক!</span>
            </div>
            <h3 className="text-2xl font-black text-white">{recentBadge.title}</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              {recentBadge.description}
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-6">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-amber-500/30">
              <div className="text-[10px] text-slate-400 font-bold">অর্জিত XP</div>
              <div className="text-base font-black text-amber-400 mt-0.5">+{earnedXp} XP</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
              <div className="text-[10px] text-slate-400 font-bold">বর্তমান লেভেল</div>
              <div className="text-base font-black text-cyan-400 mt-0.5">LVL {currentLevel}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-rose-500/30">
              <div className="text-[10px] text-slate-400 font-bold">স্ট্রিক ডে</div>
              <div className="text-base font-black text-rose-400 mt-0.5 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{currentStreak}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            অসাধারণ! চালিয়ে যাও 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
