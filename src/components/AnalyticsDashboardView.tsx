import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Activity, 
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Subject, UserProfile, ChapterProgressData } from '../types';
import { toBengaliNumber } from '../utils/progressCalculator';

interface AnalyticsDashboardViewProps {
  profile: UserProfile;
  subjects: Subject[];
  chapterProgress?: Record<string, ChapterProgressData>;
  customSelectedChapterIds?: string[];
  targetDailyHours?: number;
  completedDailyHours?: number;
  onNavigateToRoutine?: () => void;
  onNavigateToWeakPoints?: () => void;
  onNavigateToSyllabus?: () => void;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  profile,
  subjects,
  chapterProgress = {},
  customSelectedChapterIds,
  targetDailyHours = 6.0,
  completedDailyHours = 5.2,
  onNavigateToRoutine,
  onNavigateToWeakPoints,
  onNavigateToSyllabus,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  // Filter subjects and chapters if custom syllabus is active
  const filteredSubjects = useMemo(() => {
    const isCustom = Array.isArray(customSelectedChapterIds) && customSelectedChapterIds.length > 0;
    return subjects
      .map((sub) => ({
        ...sub,
        chapters: isCustom
          ? sub.chapters.filter((ch) => customSelectedChapterIds.includes(ch.id))
          : sub.chapters,
      }))
      .filter((sub) => sub.chapters.length > 0);
  }, [subjects, customSelectedChapterIds]);

  // Subject-wise detailed progress analytics
  const subjectAnalytics = useMemo(() => {
    return filteredSubjects.map((sub) => {
      const totalChapters = sub.chapters.length;
      let completedChapters = 0;
      let inProgressChapters = 0;
      let bookReadingDone = 0;
      let cqPracticeDone = 0;
      let mcqPracticeDone = 0;

      sub.chapters.forEach((ch) => {
        const prog = chapterProgress[ch.id];
        if (prog) {
          if (prog.status === 'completed' || prog.status === 'revised') completedChapters++;
          else if (prog.status === 'in_progress') inProgressChapters++;

          if (prog.bookReading) bookReadingDone++;
          if (prog.cqPractice) cqPracticeDone++;
          if (prog.mcqPractice) mcqPracticeDone++;
        }
      });

      const percent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

      return {
        id: sub.id,
        name: sub.name,
        totalChapters,
        completedChapters,
        inProgressChapters,
        bookReadingDone,
        cqPracticeDone,
        mcqPracticeDone,
        percent,
      };
    });
  }, [filteredSubjects, chapterProgress]);

  // Overall statistics
  const overallStats = useMemo(() => {
    let totalChapters = 0;
    let totalCompleted = 0;
    let totalCQ = 0;
    let totalMCQ = 0;
    let totalBookReading = 0;

    subjectAnalytics.forEach((sub) => {
      totalChapters += sub.totalChapters;
      totalCompleted += sub.completedChapters;
      totalCQ += sub.cqPracticeDone;
      totalMCQ += sub.mcqPracticeDone;
      totalBookReading += sub.bookReadingDone;
    });

    const overallPercent = totalChapters > 0 ? Math.round((totalCompleted / totalChapters) * 100) : 0;

    // Identify weak or lagging subjects (completion < 40%)
    const laggingSubjects = subjectAnalytics
      .filter((s) => s.percent < 40)
      .sort((a, b) => a.percent - b.percent);

    // Identify strong subjects (completion >= 60%)
    const strongSubjects = subjectAnalytics
      .filter((s) => s.percent >= 60)
      .sort((a, b) => b.percent - a.percent);

    return {
      totalChapters,
      totalCompleted,
      totalRemaining: totalChapters - totalCompleted,
      totalCQ,
      totalMCQ,
      totalBookReading,
      overallPercent,
      laggingSubjects,
      strongSubjects,
    };
  }, [subjectAnalytics]);

  // 7-day study hours mock data synced with current target
  const weeklyStudyData = useMemo(() => {
    return [
      { day: 'শনিবার', dayShort: 'শনি', target: targetDailyHours, actual: targetDailyHours + 0.5, completion: 100 },
      { day: 'রবিবার', dayShort: 'রবি', target: targetDailyHours, actual: targetDailyHours - 0.5, completion: 90 },
      { day: 'সোমবার', dayShort: 'সোম', target: targetDailyHours, actual: targetDailyHours + 1.0, completion: 100 },
      { day: 'মঙ্গলবার', dayShort: 'মঙ্গল', target: targetDailyHours, actual: targetDailyHours, completion: 100 },
      { day: 'বুধবার', dayShort: 'বুধ', target: targetDailyHours, actual: targetDailyHours - 1.0, completion: 80 },
      { day: 'বৃহস্পতিবার', dayShort: 'বৃহঃ', target: targetDailyHours, actual: targetDailyHours + 0.5, completion: 100 },
      { day: 'আজ (শুক্রবার)', dayShort: 'শুক্র', target: targetDailyHours, actual: completedDailyHours, completion: Math.min(100, Math.round((completedDailyHours / targetDailyHours) * 100)) },
    ];
  }, [targetDailyHours, completedDailyHours]);

  const averageWeeklyHours = useMemo(() => {
    const total = weeklyStudyData.reduce((acc, d) => acc + d.actual, 0);
    return Math.round((total / 7) * 10) / 10;
  }, [weeklyStudyData]);

  const consistencyRate = useMemo(() => {
    const metCount = weeklyStudyData.filter((d) => d.actual >= d.target * 0.8).length;
    return Math.round((metCount / 7) * 100);
  }, [weeklyStudyData]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#122238] via-[#151C2C] to-[#0B111D] border border-cyan-500/30 shadow-2xl overflow-hidden">
        {/* Ambient Cyan/Emerald Glows */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-anek">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>SSC PERFORMANCE & AI PROGRESS ANALYTICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-jakarta">
              পারফরম্যান্স ও অগ্রগতি এনালাইটিক্স
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-anek leading-relaxed">
              আপনার পড়ার ধারাবাহিকতা, সাবজেক্টভিত্তিক সিলেবাস কভারেজ এবং AI ডায়াগনসিস রিপোর্ট দেখে প্রস্তুতিকে নিখুঁত ও ব্যালান্সড রাখুন।
            </p>
          </div>

          {/* Quick High-Level Metrics Pill Grid */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-anek">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
              <span className="text-[11px] text-cyan-300 font-semibold block">সামগ্রিক সিলেবাস</span>
              <span className="text-2xl font-black text-cyan-400 font-jakarta">
                {overallStats.overallPercent}%
              </span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[11px] text-emerald-300 font-semibold block">কনসিস্টেন্সি রেট</span>
              <span className="text-2xl font-black text-emerald-400 font-jakarta">
                {consistencyRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Automated AI Focus & Diagnosis Summary (Crucial Requirement) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-jakarta">
              AUTOMATED AI STUDY DIAGNOSIS & ACTION PLAN
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-anek">
            বোর্ড গোল্ডেন A+ টার্গেট
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-anek">
          {/* Lagging Areas Focus Box */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>জরুরি ফোকাস প্রয়োজন এমন বিষয়সমূহ:</span>
            </div>
            {overallStats.laggingSubjects.length > 0 ? (
              <div className="space-y-1.5">
                {overallStats.laggingSubjects.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs text-slate-300">
                    <span>• {sub.name}</span>
                    <span className="text-rose-400 font-bold font-mono">{sub.percent}% সম্পন্ন</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                চমৎকার! আপনার কোনো বিষয় বিপজ্জনকভাবে পিছিয়ে নেই।
              </p>
            )}
            <p className="text-[11px] text-slate-400 pt-1">
              💡 পরামর্শ: আগামীকালের রুটিনে পিছিয়ে থাকা বিষয়গুলোর CQ এবং বেসিক ফর্মুলা রিভিশনে অতিরিক্ত ১ ঘণ্টা বরাদ্দ দিন।
            </p>
          </div>

          {/* Strong Areas Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>শক্তিশালী দখল ও অগ্রগামী বিষয়সমূহ:</span>
            </div>
            {overallStats.strongSubjects.length > 0 ? (
              <div className="space-y-1.5">
                {overallStats.strongSubjects.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs text-slate-300">
                    <span>• {sub.name}</span>
                    <span className="text-emerald-400 font-bold font-mono">{sub.percent}% সম্পন্ন</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                নিয়মিত প্র্যাকটিসের মাধ্যমে বিষয়গুলোতে ৫০% এর বেশি অগ্রগতি নিশ্চিত করুন।
              </p>
            )}
            <p className="text-[11px] text-slate-400 pt-1">
              💡 পরামর্শ: শক্তিশালী বিষয়গুলোতে সাপ্তাহিক স্পিড টেস্ট এবং দ্রুত MCQ প্র্যাকটিসের মাধ্যমে রিভিশন চালু রাখুন।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 font-anek">
          {onNavigateToWeakPoints && (
            <button
              onClick={onNavigateToWeakPoints}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>দুর্বল পয়েন্ট ট্র্যাক করুন</span>
            </button>
          )}
          {onNavigateToRoutine && (
            <button
              onClick={onNavigateToRoutine}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>এডাপ্টিভ রুটিন দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Daily & Weekly Study Hours Comparison Visualizer */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-jakarta">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>দৈনিক ও সাপ্তাহিক স্টাডি আওয়ার্স এনালাইসিস</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek">
              টার্গেট ঘণ্টার বিপরীতে প্রতিদিনের অর্জিত পড়াশোনার সময় ও গড় হিসেব।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-anek">
            <span className="text-slate-400">সাপ্তাহিক দৈনিক গড়:</span>
            <span className="font-bold text-cyan-300 font-mono px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
              {toBengaliNumber(averageWeeklyHours)} ঘণ্টা/দিন
            </span>
          </div>
        </div>

        {/* 7-Day Visual Bar Chart */}
        <div className="space-y-3 font-anek">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-48 sm:h-56 pt-6 pb-2 px-2 bg-slate-950/60 rounded-2xl border border-white/5">
            {weeklyStudyData.map((data, idx) => {
              const maxScale = Math.max(10, targetDailyHours + 2);
              const actualHeightPercent = Math.min(100, Math.round((data.actual / maxScale) * 100));
              const targetHeightPercent = Math.min(100, Math.round((data.target / maxScale) * 100));
              const isToday = idx === 6;

              return (
                <div key={data.day} className="flex flex-col items-center justify-end h-full gap-2 group">
                  {/* Floating Hour Label */}
                  <span className="text-[10px] font-bold text-slate-300 font-mono group-hover:text-cyan-400 transition-colors">
                    {toBengaliNumber(data.actual)}h
                  </span>

                  {/* Dual Comparison Bars */}
                  <div className="w-full max-w-[36px] h-full flex items-end justify-center gap-1 relative">
                    {/* Target Guideline Ghost Bar */}
                    <div
                      style={{ height: `${targetHeightPercent}%` }}
                      className="w-1.5 bg-slate-700/60 rounded-full"
                      title={`টার্গেট: ${data.target}h`}
                    />
                    {/* Actual Completed Solid Bar */}
                    <motion.div
                      style={{ height: `${actualHeightPercent}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${actualHeightPercent}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className={`w-3.5 sm:w-5 rounded-t-lg transition-all ${
                        isToday
                          ? 'bg-gradient-to-t from-cyan-600 via-teal-400 to-emerald-300 shadow-md shadow-cyan-500/30'
                          : data.actual >= data.target
                          ? 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                          : 'bg-gradient-to-t from-amber-600 to-orange-400'
                      }`}
                      title={`${data.day}: অর্জিত ${data.actual}h / টার্গেট ${data.target}h`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[10px] sm:text-xs font-semibold ${isToday ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                    {data.dayShort}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-5 text-xs text-slate-400 font-anek pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-tr from-indigo-600 to-cyan-400 inline-block" />
              অর্জিত পড়াশোনা (Actual Study)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-3 rounded-full bg-slate-600 inline-block" />
              টার্গেট গোল (Target Goal)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Subject-Wise Syllabus Completion Matrix */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-jakarta">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>বিষয়ভিত্তিক সিলেবাস কভারেজ ম্যাট্রিক্স</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek">
              প্রতিটি বিষয়ের সিলেবাস অগ্রগতি, রিডিং, CQ এবং MCQ প্র্যাকটিসের সার্বিক চিত্র।
            </p>
          </div>

          <span className="text-xs text-slate-400 font-anek">
            মোট কাস্টম বিষয়: {toBengaliNumber(subjectAnalytics.length)}টি
          </span>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-anek">
          {subjectAnalytics.map((sub) => {
            return (
              <div
                key={sub.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-jakarta">
                    {sub.name}
                  </h4>
                  <span className="text-xs font-black text-cyan-400 font-mono">
                    {sub.percent}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>

                {/* 3-Pillar Breakdown (Reading, CQ, MCQ) */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <div>
                    <span className="block text-slate-500 text-[10px]">কনসেপ্ট</span>
                    <span className="font-semibold text-slate-300">
                      {toBengaliNumber(sub.bookReadingDone)}/{toBengaliNumber(sub.totalChapters)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px]">CQ সলভ</span>
                    <span className="font-semibold text-slate-300">
                      {toBengaliNumber(sub.cqPracticeDone)}/{toBengaliNumber(sub.totalChapters)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[10px]">MCQ রিভিশন</span>
                    <span className="font-semibold text-slate-300">
                      {toBengaliNumber(sub.mcqPracticeDone)}/{toBengaliNumber(sub.totalChapters)}
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
