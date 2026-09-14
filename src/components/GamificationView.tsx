import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Medal, 
  Crown, 
  Target, 
  TrendingUp, 
  Lock, 
  Unlock,
  ChevronRight,
  FlameKindling
} from 'lucide-react';
import { UserProfile, ChapterProgressData, AchievementBadge, LeaderboardStudent } from '../types';
import { toBengaliNumber } from '../utils/progressCalculator';

interface GamificationViewProps {
  profile: UserProfile;
  chapterProgress?: Record<string, ChapterProgressData>;
  totalCompletedHours?: number;
  totalCompletedTasks?: number;
  onNavigateToRoutine?: () => void;
  onNavigateToSyllabus?: () => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  profile,
  chapterProgress = {},
  totalCompletedHours = 42.5,
  totalCompletedTasks = 68,
  onNavigateToRoutine,
  onNavigateToSyllabus,
}) => {
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'all' | 'science' | 'weekly'>('all');
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<'all' | 'mastery' | 'streak' | 'time'>('all');

  // Compute stats from chapterProgress
  const completedChaptersCount = useMemo(() => {
    return Object.values(chapterProgress).filter(
      (ch) => ch.status === 'completed' || ch.status === 'revised'
    ).length;
  }, [chapterProgress]);

  const cqSolvedCount = useMemo(() => {
    return Object.values(chapterProgress).filter((ch) => ch.cqPractice).length;
  }, [chapterProgress]);

  const mcqSolvedCount = useMemo(() => {
    return Object.values(chapterProgress).filter((ch) => ch.mcqPractice).length;
  }, [chapterProgress]);

  const bookReadingCount = useMemo(() => {
    return Object.values(chapterProgress).filter((ch) => ch.bookReading).length;
  }, [chapterProgress]);

  // Total XP calculation
  const streak = profile.streakDays || 15;
  const totalXP = useMemo(() => {
    return (
      completedChaptersCount * 120 +
      cqSolvedCount * 45 +
      mcqSolvedCount * 30 +
      bookReadingCount * 25 +
      streak * 60 +
      Math.round(totalCompletedHours * 40)
    );
  }, [completedChaptersCount, cqSolvedCount, mcqSolvedCount, bookReadingCount, streak, totalCompletedHours]);

  // Level Progression: Each level is 800 XP
  const level = Math.max(1, Math.floor(totalXP / 800) + 1);
  const currentLevelXP = totalXP % 800;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / 800) * 100));

  const levelTitle = useMemo(() => {
    if (level >= 10) return 'বোর্ড গোল্ড মেডেলিস্ট (Board Gold Medalist)';
    if (level >= 8) return 'বোর্ড টপ র‍্যাংক এসপায়ারেন্ট (Top Rank Aspirant)';
    if (level >= 6) return 'সিলেবাস গ্ল্যাডিয়েটর (Syllabus Gladiator)';
    if (level >= 4) return 'প্র্যাকটিস মাস্টার (Practice Master)';
    if (level >= 2) return 'অধ্যাবসায়ী শিক্ষার্থী (Diligent Scholar)';
    return 'নবীন যোদ্ধা (Novice Scholar)';
  }, [level]);

  // Achievement Badges System
  const badges: AchievementBadge[] = useMemo(() => [
    {
      id: 'badge_math_master',
      title: 'ম্যাথ মাস্টার',
      titleEn: 'Math Master',
      description: 'গণিতের ৫টি বা তার বেশি অধ্যায়ের কনসেপ্ট ও CQ সম্পূর্ণ করুন',
      icon: '📐',
      category: 'mastery',
      xpReward: 350,
      isUnlocked: completedChaptersCount >= 5,
      currentValue: Math.min(completedChaptersCount, 5),
      targetValue: 5,
      rarity: 'Rare',
    },
    {
      id: 'badge_physics_champ',
      title: 'ফিজিক্স চ্যাম্প',
      titleEn: 'Physics Champ',
      description: 'পদার্থবিজ্ঞান ও বিজ্ঞানের অধ্যায়ে সফল প্রস্তুতি সম্পন্ন করুন',
      icon: '⚡️',
      category: 'mastery',
      xpReward: 400,
      isUnlocked: cqSolvedCount >= 8,
      currentValue: Math.min(cqSolvedCount, 8),
      targetValue: 8,
      rarity: 'Epic',
    },
    {
      id: 'badge_streak_warrior',
      title: 'স্ট্রিক ওয়ারিয়র',
      titleEn: 'Streak Warrior',
      description: 'টানা ৭ দিন নিয়মিত পড়াশোনার স্ট্রিক বজায় রাখুন',
      icon: '🔥',
      category: 'streak',
      xpReward: 300,
      isUnlocked: streak >= 7,
      currentValue: Math.min(streak, 7),
      targetValue: 7,
      rarity: 'Common',
    },
    {
      id: 'badge_streak_legend',
      title: 'স্ট্রিক লেজেন্ড',
      titleEn: 'Streak Legend',
      description: 'টানা ১৪ দিন বা তার বেশি অক্ষুণ্ণ স্ট্রিক বজায় রাখুন',
      icon: '👑',
      category: 'streak',
      xpReward: 600,
      isUnlocked: streak >= 14,
      currentValue: Math.min(streak, 14),
      targetValue: 14,
      rarity: 'Legendary',
    },
    {
      id: 'badge_night_owl',
      title: 'নাইট আউল',
      titleEn: 'Night Owl',
      description: 'রাত্রিকালীন রিভিশন স্লট সম্পন্ন করে সিলেবাস এগিয়ে নিন',
      icon: '🦉',
      category: 'time',
      xpReward: 250,
      isUnlocked: totalCompletedHours >= 20,
      currentValue: Math.min(Math.round(totalCompletedHours), 20),
      targetValue: 20,
      rarity: 'Rare',
    },
    {
      id: 'badge_early_bird',
      title: 'আর্লি বার্ড',
      titleEn: 'Early Bird',
      description: 'ভোরবেলার রুটিন স্লটে নিয়মিত পড়া সম্পন্ন করুন',
      icon: '🌅',
      category: 'time',
      xpReward: 250,
      isUnlocked: totalCompletedHours >= 15,
      currentValue: Math.min(Math.round(totalCompletedHours), 15),
      targetValue: 15,
      rarity: 'Common',
    },
    {
      id: 'badge_cq_prodigy',
      title: 'CQ প্রডিজি',
      titleEn: 'CQ Prodigy',
      description: '১৫টি বা তার বেশি সৃজনশীল প্রশ্নের সফল প্র্যাকটিস টিক দিন',
      icon: '✍️',
      category: 'mastery',
      xpReward: 500,
      isUnlocked: cqSolvedCount >= 15,
      currentValue: Math.min(cqSolvedCount, 15),
      targetValue: 15,
      rarity: 'Epic',
    },
    {
      id: 'badge_mcq_beast',
      title: 'MCQ বিস্ট',
      titleEn: 'MCQ Beast',
      description: '২০টি বা তার বেশি অধ্যায়ের বহুনির্বাচনী রিভিশন সম্পন্ন করুন',
      icon: '🎯',
      category: 'mastery',
      xpReward: 450,
      isUnlocked: mcqSolvedCount >= 20,
      currentValue: Math.min(mcqSolvedCount, 20),
      targetValue: 20,
      rarity: 'Rare',
    },
    {
      id: 'badge_syllabus_conqueror',
      title: 'সিলেবাস কনকারার',
      titleEn: 'Syllabus Conqueror',
      description: '১০টি বা তার বেশি অধ্যায় পূর্ণাঙ্গ রিভাইসড মার্ক করুন',
      icon: '🏆',
      category: 'mastery',
      xpReward: 700,
      isUnlocked: completedChaptersCount >= 10,
      currentValue: Math.min(completedChaptersCount, 10),
      targetValue: 10,
      rarity: 'Legendary',
    },
  ], [completedChaptersCount, cqSolvedCount, mcqSolvedCount, streak, totalCompletedHours]);

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  const filteredBadges = useMemo(() => {
    if (selectedBadgeCategory === 'all') return badges;
    return badges.filter((b) => b.category === selectedBadgeCategory);
  }, [badges, selectedBadgeCategory]);

  // Simulated Board Rank Leaderboard
  const leaderboard: LeaderboardStudent[] = useMemo(() => {
    const list: LeaderboardStudent[] = [
      {
        rank: 1,
        name: 'তাহমিদ আহমেদ',
        school: 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ',
        xp: 4850,
        streak: 28,
        avatar: '👨‍🎓',
        batch: profile.sscBatch,
        group: 'বিজ্ঞান',
        level: 8,
        badgeTitle: 'বোর্ড টপ র‍্যাংক #১',
        completedChapters: 24,
      },
      {
        rank: 2,
        name: 'সাদিয়া ইসলাম মিথিলা',
        school: 'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ',
        xp: 4320,
        streak: 22,
        avatar: '👩‍🎓',
        batch: profile.sscBatch,
        group: 'বিজ্ঞান',
        level: 7,
        badgeTitle: 'গোল্ডেন এস্পায়ারেন্ট',
        completedChapters: 21,
      },
      {
        rank: 3,
        name: profile.name || 'সাইমন হাসান',
        school: profile.school || 'সরকারি বিজ্ঞান কলেজ সংযুক্ত হাই স্কুল',
        xp: totalXP,
        streak: streak,
        avatar: '⭐️',
        batch: profile.sscBatch,
        group: profile.group,
        isCurrentUser: true,
        level: level,
        badgeTitle: levelTitle.split(' ')[0],
        completedChapters: completedChaptersCount,
      },
      {
        rank: 4,
        name: 'আবরার ফাহিম',
        school: 'রাজশাহী কলেজিয়েট স্কুল',
        xp: 3280,
        streak: 18,
        avatar: '🧑‍💻',
        batch: profile.sscBatch,
        group: 'বিজ্ঞান',
        level: 5,
        badgeTitle: 'ম্যাথ জিনিয়াস',
        completedChapters: 16,
      },
      {
        rank: 5,
        name: 'নুসরাত জাহান',
        school: 'চট্টগ্রাম কলেজিয়েট স্কুল',
        xp: 2950,
        streak: 14,
        avatar: '👩‍🔬',
        batch: profile.sscBatch,
        group: 'ব্যবসায় শিক্ষা',
        level: 4,
        badgeTitle: 'ফোকাস কিং',
        completedChapters: 14,
      },
      {
        rank: 6,
        name: 'তানভীর হাসান',
        school: 'বরিশাল জিলা স্কুল',
        xp: 2600,
        streak: 12,
        avatar: '👨‍🏫',
        batch: profile.sscBatch,
        group: 'মানবিক',
        level: 4,
        badgeTitle: 'সিলেবাস ট্র্যাকার',
        completedChapters: 12,
      },
    ];

    // Sort by XP descending and re-assign rank numbers
    return list
      .sort((a, b) => b.xp - a.xp)
      .map((student, idx) => ({
        ...student,
        rank: idx + 1,
      }));
  }, [profile, totalXP, streak, level, levelTitle, completedChaptersCount]);

  const currentUserRank = leaderboard.find((s) => s.isCurrentUser)?.rank || 3;

  return (
    <div className="space-y-6">
      {/* 1. Hero Gamification & Streak Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1A38] via-[#151C2C] to-[#0D121F] border border-amber-500/30 shadow-2xl overflow-hidden">
        {/* Ambient Warm Golden Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-anek">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>SSC GAMIFIED REWARDS & MOTIVATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-jakarta">
              পড়াশোনার রিওয়ার্ড ও স্ট্রিক সেন্টার
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-anek leading-relaxed">
              প্রতিটি অধ্যায় শেষ করুন, রুটিন মেনে স্টাডি করুন এবং ব্যাজ আনলক করে সারা বাংলাদেশের শিক্ষার্থীদের সাথে বোর্ড মেধা তালিকায় এগিয়ে থাকুন!
            </p>
          </div>

          {/* Level & XP Progression Dial */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 w-full lg:w-80 shrink-0 space-y-3 font-anek shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-300 font-semibold block">বর্তমান লেভেল</span>
                <h3 className="text-lg font-black text-white flex items-center gap-1.5 font-jakarta">
                  <span>LEVEL {toBengaliNumber(level)}</span>
                  <Crown className="w-4 h-4 text-amber-400" />
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">মোট অর্জিত পয়েন্ট</span>
                <span className="text-lg font-black text-amber-400 font-mono">
                  {toBengaliNumber(totalXP)} XP
                </span>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{toBengaliNumber(currentLevelXP)} XP</span>
                <span>লেভেল {toBengaliNumber(level + 1)} এর জন্য ৮০০ XP</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">টাইটেল:</span>
              <span className="font-bold text-amber-300 truncate max-w-[180px]">{levelTitle}</span>
            </div>
          </div>
        </div>

        {/* 2. Daily Study Streak Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900/80 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-anek">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 shrink-0">
              🔥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">
                  টানা {toBengaliNumber(streak)} দিনের স্টাডি স্ট্রিক!
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  সক্রিয় ফ্লেম
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                প্রতিদিন অন্তত ১টি রুটিন টাস্ক টিক দিলে আপনার স্ট্রিক সচল থাকবে।
              </p>
            </div>
          </div>

          {/* 7-Day Flame Track */}
          <div className="flex items-center gap-1.5 shrink-0">
            {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'].map((day, idx) => {
              const isPastOrToday = idx <= 5; // active days
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isPastOrToday
                        ? 'bg-gradient-to-t from-orange-600 to-amber-500 text-slate-950 shadow-md shadow-orange-500/25'
                        : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    {isPastOrToday ? '🔥' : '•'}
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">{day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Achievement Badges Grid Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-jakarta">
              <Medal className="w-5 h-5 text-amber-400" />
              <span>অর্জন ও মেডেল ব্যাজ ({toBengaliNumber(unlockedBadgesCount)}/{toBengaliNumber(badges.length)} আনলকড)</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek">
              বিশেষ মাইলফলক অর্জন করে সম্মানসূচক মেডেল এবং বোনাস XP সংগ্রহ করুন।
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 font-anek">
            {[
              { id: 'all', label: 'সকল ব্যাজ' },
              { id: 'mastery', label: 'বিষয়গত' },
              { id: 'streak', label: 'স্ট্রিক' },
              { id: 'time', label: 'সময়ানুবর্তিতা' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedBadgeCategory(cat.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedBadgeCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBadges.map((badge) => {
            const progressPercent = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -2 }}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  badge.isUnlocked
                    ? 'bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/60 border-white/5 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                          badge.isUnlocked
                            ? 'bg-amber-500/20 border border-amber-500/40'
                            : 'bg-slate-800/80 border border-slate-700/50 grayscale'
                        }`}
                      >
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-1.5">
                          <span>{badge.title}</span>
                          {badge.isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {badge.titleEn}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                        badge.rarity === 'Legendary'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : badge.rarity === 'Epic'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : badge.rarity === 'Rare'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-700/40 text-slate-300 border-slate-600'
                      }`}
                    >
                      {badge.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-anek leading-relaxed mt-1">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar and XP reward */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2 font-anek">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      অগ্রগতি: {toBengaliNumber(badge.currentValue)}/{toBengaliNumber(badge.targetValue)}
                    </span>
                    <span className="font-bold text-amber-400 font-mono">
                      +{toBengaliNumber(badge.xpReward)} XP
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Simulated Live Board Rank Leaderboard */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-jakarta">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>বোর্ড মেধা তালিকা ও লিডারবোর্ড (SSC {profile.sscBatch})</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek">
              টাস্ক কমপ্লিশন, স্ট্রিক ও পড়াশোনার ঘণ্টার ভিত্তিতে রিয়েলটাইম পজিশন।
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-anek flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>আপনার বর্তমান অবস্থান: #{toBengaliNumber(currentUserRank)}</span>
          </div>
        </div>

        {/* Leaderboard Table Feed */}
        <div className="space-y-2 font-anek">
          {leaderboard.map((student) => {
            const isTop3 = student.rank <= 3;

            return (
              <div
                key={student.rank}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  student.isCurrentUser
                    ? 'bg-gradient-to-r from-indigo-950/70 via-indigo-900/50 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 font-mono ${
                      student.rank === 1
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-md shadow-amber-500/30'
                        : student.rank === 2
                        ? 'bg-slate-300 text-slate-950 shadow-md'
                        : student.rank === 3
                        ? 'bg-amber-700 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : student.rank}
                  </div>

                  {/* Avatar & Student Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white font-jakarta truncate">
                        {student.name}
                      </h4>
                      {student.isCurrentUser && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-500 text-white font-anek">
                          আপনি
                        </span>
                      )}
                      <span className="text-[10px] text-amber-300 font-medium px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                        {student.badgeTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
                      {student.school} • {student.group}
                    </p>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="flex items-center gap-4 shrink-0 text-right font-mono">
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-500 block">স্ট্রিক</span>
                    <span className="text-xs font-bold text-orange-400 font-anek">
                      🔥 {toBengaliNumber(student.streak)} দিন
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">স্কোর</span>
                    <span className="text-sm font-black text-amber-400">
                      {toBengaliNumber(student.xp)} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
