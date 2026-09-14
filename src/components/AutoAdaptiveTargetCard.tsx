import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, CheckCircle2, Circle, Sparkles, BookOpen, 
  ArrowRight, Clock, ShieldCheck, Flame, ChevronRight,
  RotateCw, Coffee, Moon, Sunrise, Compass
} from 'lucide-react';
import { Subject, ChapterProgressData } from '../types';
import { 
  AdaptiveTargetChapter, 
  FixedTimeBuffers, 
  runAdaptiveRoutineEngine 
} from '../utils/adaptiveRoutineEngine';
import { toBengaliNumber, formatBengaliProgress } from '../utils/progressCalculator';

interface AutoAdaptiveTargetCardProps {
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  customSelectedChapterIds?: string[];
  completedTodayChapterIds?: string[];
  onUpdateProgressData: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
  onChapterCompletedAheadOfTime?: (chapter: AdaptiveTargetChapter) => void;
  onNavigateToSyllabus?: (subjectId: string, chapterId: string) => void;
}

export const AutoAdaptiveTargetCard: React.FC<AutoAdaptiveTargetCardProps> = ({
  subjects,
  chapterProgress,
  customSelectedChapterIds,
  completedTodayChapterIds = [],
  onUpdateProgressData,
  onChapterCompletedAheadOfTime,
  onNavigateToSyllabus,
}) => {
  const [showBufferDetails, setShowBufferDetails] = useState(false);
  const [justCompletedCelebration, setJustCompletedCelebration] = useState<string | null>(null);
  const [localCompletedToday, setLocalCompletedToday] = useState<string[]>(completedTodayChapterIds);

  // Compute adaptive schedule and current target chapter dynamically
  const engineResult = runAdaptiveRoutineEngine(
    subjects,
    chapterProgress,
    customSelectedChapterIds,
    localCompletedToday
  );

  const target = engineResult.targetChapter;
  const nextTarget = engineResult.nextQueuedChapter;
  const buffers = engineResult.buffers;

  // Real-time task checklist status for the active target chapter
  const conceptClear = target?.taskStatus.conceptClear ?? false;
  const cqSolve = target?.taskStatus.cqSolve ?? false;
  const mcqSolve = target?.taskStatus.mcqSolve ?? false;
  const percentage = target?.taskStatus.percentage ?? 0;
  const formattedPct = formatBengaliProgress(percentage);

  // Handle toggling individual checklist task
  const handleToggleTask = (taskType: 'bookReading' | 'cqPractice' | 'mcqPractice') => {
    if (!target) return;

    const currentProg = chapterProgress[target.chapterId] || {
      status: 'in_progress',
      bookReading: false,
      cqPractice: false,
      mcqPractice: false,
    };

    const updatedTaskValue = !currentProg[taskType];
    const newBookReading = taskType === 'bookReading' ? updatedTaskValue : Boolean(currentProg.bookReading);
    const newCqPractice = taskType === 'cqPractice' ? updatedTaskValue : Boolean(currentProg.cqPractice);
    const newMcqPractice = taskType === 'mcqPractice' ? updatedTaskValue : Boolean(currentProg.mcqPractice);

    const willBeFullyDone = newBookReading && newCqPractice && newMcqPractice;

    onUpdateProgressData(target.chapterId, {
      [taskType]: updatedTaskValue,
      status: willBeFullyDone ? 'completed' : 'in_progress',
      completedAt: willBeFullyDone ? new Date().toISOString() : undefined,
    });

    // If this completed all 3 tasks, trigger instant re-scheduling ahead of time
    if (willBeFullyDone) {
      triggerInstantReScheduling(target);
    }
  };

  // Instant Update Trigger: Mark 100% completed ahead of time
  const handleMarkFullyCompleted = () => {
    if (!target) return;

    onUpdateProgressData(target.chapterId, {
      status: 'completed',
      bookReading: true,
      cqPractice: true,
      mcqPractice: true,
      completedAt: new Date().toISOString(),
    });

    triggerInstantReScheduling(target);
  };

  const triggerInstantReScheduling = (completedChapter: AdaptiveTargetChapter) => {
    setJustCompletedCelebration(completedChapter.chapterName);
    setLocalCompletedToday((prev) => [...prev, completedChapter.chapterId]);

    if (onChapterCompletedAheadOfTime) {
      onChapterCompletedAheadOfTime(completedChapter);
    }

    setTimeout(() => {
      setJustCompletedCelebration(null);
    }, 4500);
  };

  // Skip / Pick Next Chapter
  const handleSkipTarget = () => {
    if (!target) return;
    setLocalCompletedToday((prev) => [...prev, target.chapterId]);
  };

  if (!target) {
    return (
      <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-xl shadow-xl text-center overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white font-jakarta">
          অসাধারণ! আজকের সমস্ত নির্ধারিত অধ্যায় সম্পূর্ণ হয়েছে
        </h3>
        <p className="text-xs text-slate-400 font-anek mt-1">
          অটো-অ্যাডাপ্টিভ রুটিন ইঞ্জিনের সকল সিলেবাস টার্গেট সফলভাবে সম্পন্ন হয়েছে।
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full text-slate-100 font-hind">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Adaptive Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-850/90 to-slate-900/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl p-5 sm:p-7 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500" />

        {/* Top Header: Badge, Title & Time Buffering Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/20 shrink-0">
              <Zap className="w-5 h-5 fill-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-jakarta flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  REAL-TIME AUTO-ADAPTIVE
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-anek ${target.complexity.badgeColor}`}>
                  {target.complexity.tierLabelBn} • {target.complexity.durationFormattedBn}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-0.5 font-jakarta">
                আজকের অটো-অ্যাডাপ্টিভ টার্গেট অধ্যায়
              </h2>
            </div>
          </div>

          {/* Buffers Pill Toggle Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowBufferDetails(!showBufferDetails)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-xs text-slate-300 hover:text-white font-anek flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showBufferDetails ? 'বাফার সংক্ষেপ' : '২৪ ঘণ্টার টাইম বাফারিং'}</span>
            </button>

            <button
              onClick={handleSkipTarget}
              title="পরবর্তী অগ্রাধিকারপ্রাপ্ত অধ্যায়ে স্কিপ করুন"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-xs text-slate-300 hover:text-white font-anek flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCw className="w-3 h-3 text-amber-400" />
              <span>স্কিপ</span>
            </button>
          </div>
        </div>

        {/* Dynamic Celebration Alert when marked 100% complete ahead of time */}
        <AnimatePresence>
          {justCompletedCelebration && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-emerald-600/30 border border-emerald-400/50 backdrop-blur-md text-emerald-200 flex items-start gap-3 shadow-lg"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center shrink-0 text-emerald-300 mt-0.5">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white font-jakarta">
                  ⚡ ইনস্ট্যান্ট রিশিডিউলিং সক্রিয়!
                </p>
                <p className="text-xs text-emerald-300 font-anek mt-0.5 leading-relaxed">
                  অভিনন্দন! <strong>"{justCompletedCelebration}"</strong> পূর্বনির্ধারিত সময়ের আগেই ১০০% সম্পন্ন হয়েছে। অটো-অ্যাডাপ্টিভ ইঞ্জিন পরবর্তী অগ্রাধিকারপ্রাপ্ত অধ্যায় স্বয়ংক্রিয়ভাবে শিডিউল করেছে!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. DYNAMIC TIME BUFFERING BREAKDOWN DRAWER */}
        <AnimatePresence>
          {showBufferDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5 font-jakarta">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    DYNAMIC TIME BUFFERING FORMULA (২৪ ঘণ্টা এক্সক্লুশন)
                  </span>
                  <span className="text-[11px] text-slate-400 font-anek">
                    নেট স্টাডি বাফার: <strong className="text-emerald-400 font-bold">{toBengaliNumber(buffers.netAvailableStudyHours)} ঘণ্টা</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">পরিমিত ঘুম</span>
                      <span className="text-xs font-bold text-slate-200 font-anek">
                        {toBengaliNumber(buffers.sleepHours)} ঘণ্টা (৭-৮h)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">খাবার ও ফ্রেশ</span>
                      <span className="text-xs font-bold text-slate-200 font-anek">
                        {toBengaliNumber(buffers.mealsPersonalHours)} ঘণ্টা (৩h বাফার)
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">স্কুল ও কোচিং</span>
                      <span className="text-xs font-bold text-slate-200 font-anek">
                        {toBengaliNumber(buffers.schoolCoachingHours)} ঘণ্টা
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-teal-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">নামাজ / প্রার্থনা</span>
                      <span className="text-xs font-bold text-slate-200 font-anek">
                        {toBengaliNumber(buffers.worshipPrayerHours)} ঘণ্টা (৫ ওয়াক্ত)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-anek leading-relaxed">
                  💡 <strong>বিজ্ঞানসম্মত বাফারিং:</strong> অতিরিক্ত ক্লান্তি বা বার্নআউট রোধে ঘুম (৭-৮ ঘণ্টা), ৩ ঘণ্টা খাবার ও ব্যক্তিগত পরিচর্যা, এবং প্রার্থনা স্লট সম্পূর্ণ সুরক্ষিত রাখা হয়েছে। অবশিষ্ট সময়ে বিষয়ভিত্তিক জটিলতা অনুযায়ী স্টাডি ব্লক স্বয়ংক্রিয়ভাবে সমন্বিত হয়।
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. ACTIVE TARGET CHAPTER SHOWCASE */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold font-anek">
                {target.subjectName}
              </span>
              <span className="text-xs text-slate-400 font-anek">
                অধ্যায় {toBengaliNumber(target.chapterIndex)} / {toBengaliNumber(target.totalChaptersInSubject)}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold font-anek bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {target.reasonBn}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide font-hind">
              {target.chapterName}
            </h3>

            <p className="text-xs text-slate-300 font-anek mt-1 leading-relaxed">
              {target.complexity.descriptionBn}
            </p>
          </div>

          {/* Quick Info Pill: Estimated Duration & Completion Button */}
          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-center">
              <span className="text-[10px] text-slate-400 block font-anek">বিষয় জটিলতা</span>
              <span className="text-xs font-extrabold text-cyan-300 font-anek">
                {target.complexity.durationFormattedBn}
              </span>
            </div>

            <button
              onClick={handleMarkFullyCompleted}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer font-anek"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>মার্ক ১০০% সম্পন্ন</span>
            </button>
          </div>
        </div>

        {/* 3. LIVE TASK CHECKLIST (Concept Clear 33.3%, CQ Solve 33.3%, MCQ Solve 33.4%) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-jakarta">
                LIVE TASK CHECKLIST
              </span>
              <span className="text-[11px] text-cyan-400 font-anek font-semibold">
                (৩টি ধাপে পূর্ণাঙ্গ প্রস্তুতি)
              </span>
            </div>
            <span 
              className="text-xs font-extrabold text-emerald-400 font-anek"
              style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
            >
              {formattedPct}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700/60 mb-3.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          {/* 3 Interactive Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Task 1: Concept Clear */}
            <button
              onClick={() => handleToggleTask('bookReading')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                conceptClear
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-200 shadow-md shadow-blue-500/10'
                  : 'bg-slate-850 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {conceptClear ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-hind">
                    📘 Concept Clear
                  </span>
                  <span className="text-[10px] font-bold text-blue-400 font-anek">
                    ৩৩.৩%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-anek mt-0.5">
                  মূল বই রিডিং, সূত্র ও উদাহরণ বোঝা
                </p>
              </div>
            </button>

            {/* Task 2: CQ Solve */}
            <button
              onClick={() => handleToggleTask('cqPractice')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                cqSolve
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-850 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {cqSolve ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-hind">
                    ✍️ CQ Solve
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 font-anek">
                    ৩৩.৩%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-anek mt-0.5">
                  বোর্ড ও শীর্ষ স্কুলের সৃজনশীল সমাধান
                </p>
              </div>
            </button>

            {/* Task 3: MCQ Solve */}
            <button
              onClick={() => handleToggleTask('mcqPractice')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                mcqSolve
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-md shadow-purple-500/10'
                  : 'bg-slate-850 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {mcqSolve ? (
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-hind">
                    🔘 MCQ Solve
                  </span>
                  <span className="text-[10px] font-bold text-purple-400 font-anek">
                    ৩৩.৪%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-anek mt-0.5">
                  টাইমার সেট করে বহুনির্বাচনী রিভিশন
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 4. UPCOMING QUEUED CHAPTER PEEK (Next Priority) */}
        {nextTarget && (
          <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-anek">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-300">পরবর্তী অগ্রাধিকার:</span>
              <span className="text-cyan-300 font-bold">{nextTarget.subjectName}</span>
              <span>-</span>
              <span className="text-slate-200">{nextTarget.chapterName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                {nextTarget.complexity.tierLabelBn}
              </span>
            </div>

            {onNavigateToSyllabus && (
              <button
                onClick={() => onNavigateToSyllabus(target.subjectId, target.chapterId)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>সিলেবাসে অধ্যায়টি দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
