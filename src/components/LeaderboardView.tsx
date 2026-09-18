import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Award, 
  Sparkles, 
  Zap, 
  Medal, 
  TrendingUp, 
  ShieldCheck,
  Users,
  Search
} from 'lucide-react';
import { UserProfile, LeaderboardStudent } from '../types';

interface LeaderboardViewProps {
  profile: UserProfile;
  onOpenAchievements: () => void;
  onNavigateToRoutine: () => void;
}

const SEEDED_LEADERBOARD: LeaderboardStudent[] = [
  {
    rank: 1,
    name: 'তানভীর আহমেদ',
    school: 'ঢাকা রেসিডেন্সিয়াল মডেল কলেজ',
    group: 'বিজ্ঞান (Science)',
    xp: 4850,
    points: 4850,
    streak: 34,
    avatar: '⚡',
    badge: 'বোর্ড টপার',
    badgeTitle: 'বোর্ড টপার',
    level: 7,
    completedChapters: 36,
    completionRate: 96,
  },
  {
    rank: 2,
    name: 'ফারহানা ইসলাম',
    school: 'ভিকারুননিসা নূন স্কুল এন্ড কলেজ',
    group: 'বিজ্ঞান (Science)',
    xp: 4620,
    points: 4620,
    streak: 29,
    avatar: '👑',
    badge: 'CQ মাস্টার',
    badgeTitle: 'CQ মাস্টার',
    level: 6,
    completedChapters: 34,
    completionRate: 94,
  },
  {
    rank: 3,
    name: 'আবরার জাহিন',
    school: 'মির্জাপুর ক্যাডেট কলেজ',
    group: 'বিজ্ঞান (Science)',
    xp: 4390,
    points: 4390,
    streak: 25,
    avatar: '🔥',
    badge: 'ম্যাথ উইজার্ড',
    badgeTitle: 'ম্যাথ উইজার্ড',
    level: 6,
    completedChapters: 32,
    completionRate: 91,
  },
  {
    rank: 4,
    name: 'সাদিয়া জাহান',
    school: 'রাজশাহী কলেজিয়েট স্কুল',
    group: 'বিজ্ঞান (Science)',
    xp: 4150,
    points: 4150,
    streak: 21,
    avatar: '⭐',
    badge: 'ফোকাস লিজেন্ড',
    badgeTitle: 'ফোকাস লিজেন্ড',
    level: 5,
    completedChapters: 30,
    completionRate: 88,
  },
  {
    rank: 5,
    name: 'রাফসান হক',
    school: 'চট্টগ্রাম কলেজিয়েট স্কুল',
    group: 'বিজ্ঞান (Science)',
    xp: 3980,
    points: 3980,
    streak: 19,
    avatar: '🚀',
    badge: 'স্পিড রিভিশনার',
    badgeTitle: 'স্পিড রিভিশনার',
    level: 5,
    completedChapters: 28,
    completionRate: 85,
  },
  {
    rank: 6,
    name: 'নুসরাত তাবাসসুম',
    school: 'আইডিয়াল স্কুল অ্যান্ড কলেজ',
    group: 'ব্যবসায় শিক্ষা (Business Studies)',
    xp: 3820,
    points: 3820,
    streak: 18,
    avatar: '💎',
    badge: 'অ্যাকাউন্টিং প্রো',
    badgeTitle: 'অ্যাকাউন্টিং প্রো',
    level: 5,
    completedChapters: 27,
    completionRate: 84,
  },
  {
    rank: 7,
    name: 'মাহমুদুল হাসান',
    school: 'কুমিল্লা জিলা স্কুল',
    group: 'বিজ্ঞান (Science)',
    xp: 3650,
    points: 3650,
    streak: 15,
    avatar: '🎯',
    badge: 'টপ পারফর্মার',
    badgeTitle: 'টপ পারফর্মার',
    level: 4,
    completedChapters: 25,
    completionRate: 81,
  }
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  profile,
  onOpenAchievements,
  onNavigateToRoutine,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('সকল বিভাগ');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const divisions = ['সকল বিভাগ', 'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'কুমিল্লা', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

  // Current user's virtual score
  const userXP = (profile.targetGrade ? 3200 : 2800) + (profile.streakDays || 1) * 25;
  const userRank = 8;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Cyber Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/60 to-slate-950 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-wide">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>SSC NATIONAL LEADERBOARD & XP ARENA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>জাতীয় লিডারবোর্ড ও রেটিং</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              সারা দেশের SSC পরীক্ষার্থীদের সাথে পড়াশোনার সময়, অধ্যায় পূর্ণতা ও স্ট্রিক বজায় রেখে XP অর্জন করুন এবং শীর্ষে পৌঁছান।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAchievements}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>অর্জন ও বেইজ দেখুন</span>
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/10">
          {/* Rank 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-400/30 flex items-center gap-3 order-2 sm:order-1">
            <div className="w-10 h-10 rounded-2xl bg-slate-400/20 border border-slate-300/40 flex items-center justify-center font-black text-slate-200 text-lg">
              ২
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-white truncate">{SEEDED_LEADERBOARD[1].name}</div>
              <div className="text-[11px] text-slate-400 truncate">{SEEDED_LEADERBOARD[1].school}</div>
              <div className="text-xs font-black text-slate-300">{SEEDED_LEADERBOARD[1].points} XP</div>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-400/50 flex items-center gap-3 order-1 sm:order-2 shadow-lg shadow-amber-500/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/30 border border-amber-400 flex items-center justify-center font-black text-amber-300 text-2xl">
              👑
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>#১ চ্যাম্পিয়ন</span>
              </div>
              <div className="text-sm font-black text-white truncate">{SEEDED_LEADERBOARD[0].name}</div>
              <div className="text-xs font-black text-amber-400">{SEEDED_LEADERBOARD[0].points} XP</div>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-700/30 flex items-center gap-3 order-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-700/20 border border-amber-600/40 flex items-center justify-center font-black text-amber-400 text-lg">
              ৩
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-bold text-white truncate">{SEEDED_LEADERBOARD[2].name}</div>
              <div className="text-[11px] text-slate-400 truncate">{SEEDED_LEADERBOARD[2].school}</div>
              <div className="text-xs font-black text-amber-500">{SEEDED_LEADERBOARD[2].points} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Own Ranking Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border border-cyan-400/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-black text-base">
            #{userRank}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{profile.name || 'আপনি'} (আপনার প্রোফাইল)</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-cyan-300">{profile.school || 'SSC পরীক্ষার্থী'} • ব্যাচ {profile.sscBatch || '২০২৬'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-slate-400 text-[10px]">মোট পয়েন্ট</div>
            <div className="text-base font-black text-cyan-300">{userXP} XP</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-[10px]">স্ট্রিক</div>
            <div className="text-base font-black text-rose-400 flex items-center gap-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span>{profile.streakDays || 1} দিন</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>শীর্ষ এসএসসি পরীক্ষার্থীদের তালিকা</span>
        </h3>

        <div className="space-y-2">
          {SEEDED_LEADERBOARD.map((student) => (
            <div
              key={student.rank}
              className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                    student.rank === 1
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : student.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : student.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {student.rank}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{student.name}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {student.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{student.school}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs shrink-0">
                <div className="text-right">
                  <div className="font-black text-amber-400">{student.points} XP</div>
                  <div className="text-[10px] text-slate-400">{student.completionRate}% সিলেবাস</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
