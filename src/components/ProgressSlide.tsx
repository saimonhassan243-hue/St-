import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, CheckCircle, Flame, Sparkles, Printer, 
  Target, TrendingUp, Plus, Minus
} from 'lucide-react';
import { Subject, ChapterProgressData, UserProfile } from '../types';
import { AlgorithmicProgressCalculator } from './AlgorithmicProgressCalculator';
import { 
  calculateAlgorithmicProgress, 
  toBengaliNumber 
} from '../utils/progressCalculator';
import { AutoAdaptiveTargetCard } from './AutoAdaptiveTargetCard';

interface ProgressSlideProps {
  profile: UserProfile;
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  suggestionProgress: Record<string, boolean>;
  customSelectedChapterIds?: string[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
  onUpdateProgressData?: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
  onNavigateToSyllabus?: (subjectId: string, chapterId: string) => void;
}

export const ProgressSlide: React.FC<ProgressSlideProps> = ({
  profile,
  subjects,
  chapterProgress,
  suggestionProgress,
  customSelectedChapterIds,
  onUpdateProfile,
  onUpdateProgressData,
  onNavigateToSyllabus,
}) => {
  // Algorithmic stats
  const algorithmicStats = calculateAlgorithmicProgress(
    subjects,
    chapterProgress,
    customSelectedChapterIds
  );

  // Aggregate stats
  let totalChapters = 0;
  let completedChapters = 0;
  let revisedChapters = 0;
  let inProgressChapters = 0;
  let totalSuggestions = 0;
  let masteredSuggestions = 0;

  const subjectBreakdown = subjects.map((sub) => {
    const total = sub.chapters.length;
    let completed = 0;
    let revised = 0;
    let inProg = 0;

    sub.chapters.forEach((c) => {
      const st = chapterProgress[c.id]?.status;
      if (st === 'completed') completed++;
      else if (st === 'revised') revised++;
      else if (st === 'in_progress') inProg++;
    });

    const done = completed + revised;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    totalChapters += total;
    completedChapters += completed;
    revisedChapters += revised;
    inProgressChapters += inProg;

    if (sub.suggestions) {
      totalSuggestions += sub.suggestions.length;
      sub.suggestions.forEach((_, idx) => {
        if (suggestionProgress[`${sub.id}_${idx}`]) {
          masteredSuggestions++;
        }
      });
    }

    return {
      id: sub.id,
      name: sub.name,
      total,
      completed,
      revised,
      inProg,
      done,
      pct,
    };
  });

  const totalDone = completedChapters + revisedChapters;
  const overallPercentage = totalChapters > 0 ? Math.round((totalDone / totalChapters) * 100) : 0;
  const streakDays = profile.streakDays || 15;

  const handleIncrementStreak = () => {
    onUpdateProfile({ streakDays: streakDays + 1 });
  };

  const handleDecrementStreak = () => {
    if (streakDays > 0) {
      onUpdateProfile({ streakDays: streakDays - 1 });
    }
  };

  return (
    <div className="relative w-full text-slate-100 font-hind">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Glassmorphic Container with rounded-3xl */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/70 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Slide Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide font-jakarta">
                STUDY PROGRESS & ANALYTICS
              </h2>
              <p className="text-xs text-slate-400">
                আপনার পড়াশোনার অগ্রগতি, অধ্যায় সমাপ্তির হার ও লক্ষ্যমাত্রা
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold shadow-lg transition-all hover:scale-102"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" /> রিপোর্ট প্রিন্ট করুন
          </button>
        </div>

        {/* Daily Dashboard Card: আজকের অটো-অ্যাডাপ্টিভ টার্গেট অধ্যায় */}
        <div className="mb-8">
          <AutoAdaptiveTargetCard
            subjects={subjects}
            chapterProgress={chapterProgress}
            customSelectedChapterIds={customSelectedChapterIds}
            onUpdateProgressData={onUpdateProgressData || ((_id, _val) => {})}
            onNavigateToSyllabus={onNavigateToSyllabus}
          />
        </div>

        {/* 3 Core Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Completion */}
          <div className="p-6 bg-slate-800/60 border border-emerald-500/20 rounded-3xl text-center relative overflow-hidden backdrop-blur-md shadow-lg">
            <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 
              className="text-4xl font-extrabold text-emerald-400 tracking-tight font-anek"
              style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
            >
              {algorithmicStats.formattedBengaliProgress}
            </h4>
            <p className="text-xs text-emerald-300 font-semibold mt-1">অ্যালগরিদমিক সিলেবাস অগ্রগতি</p>
            <p className="text-[11px] text-slate-400 mt-2 font-anek">
              {toBengaliNumber(algorithmicStats.completedChaptersCount)}টি পূর্ণাঙ্গ / {toBengaliNumber(algorithmicStats.totalSelectedChapters)}টি মোট অধ্যায়
            </p>
          </div>

          {/* Card 2: Streak */}
          <div className="p-6 bg-slate-800/60 border border-amber-500/20 rounded-3xl text-center relative overflow-hidden backdrop-blur-md shadow-lg">
            <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <h4 className="text-4xl font-extrabold text-amber-400 tracking-tight font-anek flex items-center justify-center gap-1.5">
              {streakDays} <span className="text-xl font-bold">দিন</span>
            </h4>
            <p className="text-xs text-amber-300 font-semibold mt-1">
              পড়াশোনার ধারাবাহিকতা (Streak)
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={handleDecrementStreak}
                title="একদিন কমান"
                className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">আজকের পড়া সম্পন্ন?</span>
              <button
                onClick={handleIncrementStreak}
                title="একদিন বাড়ান"
                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Target Grade */}
          <div className="p-6 bg-slate-800/60 border border-purple-500/20 rounded-3xl text-center relative overflow-hidden backdrop-blur-md shadow-lg">
            <div className="w-12 h-12 bg-purple-500/15 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-3xl sm:text-4xl font-extrabold text-purple-300 tracking-tight font-jakarta">
              {profile.targetGrade || 'GPA 5.00'}
            </h4>
            <p className="text-xs text-purple-300 font-semibold mt-1">টার্গেট ফলাফল</p>
            <p className="text-[11px] text-slate-400 mt-2 font-anek">
              {profile.sscBatch} • {profile.school}
            </p>
          </div>
        </div>

        {/* Secondary metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-center font-anek">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
            <span className="text-[11px] text-slate-400 font-hind">পড়া শেষ</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">{toBengaliNumber(completedChapters)}টি</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
            <span className="text-[11px] text-slate-400 font-hind">রিভিশন শেষ</span>
            <div className="text-2xl font-bold text-indigo-400 mt-0.5">{toBengaliNumber(revisedChapters)}টি</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
            <span className="text-[11px] text-slate-400 font-hind">চলমান পাঠ</span>
            <div className="text-2xl font-bold text-amber-400 mt-0.5">{toBengaliNumber(inProgressChapters)}টি</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-white/5">
            <span className="text-[11px] text-slate-400 font-hind">সুপার সাজেশন</span>
            <div className="text-2xl font-bold text-purple-400 mt-0.5">
              {toBengaliNumber(masteredSuggestions)} / {toBengaliNumber(totalSuggestions)}
            </div>
          </div>
        </div>

        {/* Algorithmic Task Completion Calculator */}
        <div className="mb-8">
          <AlgorithmicProgressCalculator
            subjects={subjects}
            chapterProgress={chapterProgress}
            customSelectedChapterIds={customSelectedChapterIds}
          />
        </div>

        {/* Subject-Wise Progress Bars */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-jakarta">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>SUBJECT BREAKDOWN</span>
          </h3>

          <div className="space-y-3">
            {subjectBreakdown.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{item.name}</span>
                    <span className="text-slate-400 font-anek text-[11px]">
                      ({item.done}/{item.total} অধ্যায় সম্পন্ন)
                    </span>
                  </div>
                  <span className="font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-anek">
                    {item.pct}%
                  </span>
                </div>

                {/* Progress bar track */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden flex p-0.5 border border-slate-700/50">
                  <div
                    className="bg-indigo-500 h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.revised / item.total) * 100 : 0}%` }}
                    title={`রিভিশন: ${item.revised}`}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.completed / item.total) * 100 : 0}%` }}
                    title={`পড়া শেষ: ${item.completed}`}
                  />
                  <div
                    className="bg-amber-400 h-full rounded-r-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.inProg / item.total) * 100 : 0}%` }}
                    title={`চলছে: ${item.inProg}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-anek">
                  <span>রিভিশন: {item.revised} | শেষ: {item.completed} | চলমান: {item.inProg}</span>
                  <span>বাকি: {item.total - item.done} অধ্যায়</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-white/10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <p className="font-bold text-white text-sm mb-0.5 font-jakarta">PRO STUDY TIP:</p>
            <p>
              বোর্ড পরীক্ষায় এ+ নিশ্চিত করতে প্রতিটি বিষয়ের ৩-স্টার চিহ্নিত সাজেশনগুলো আগে আয়ত্ত করুন এবং খাতায় অন্তত একবার সময় মেপে লিখুন।
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
