import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, Sparkles, CheckCircle2, ChevronDown, ChevronUp,
  BookOpen, Edit3, CheckSquare, Target, HelpCircle, Flame, Layers
} from 'lucide-react';
import { Subject, ChapterProgressData } from '../types';
import { 
  calculateAlgorithmicProgress, 
  toBengaliNumber, 
  formatBengaliProgress,
  TASK_WEIGHTS 
} from '../utils/progressCalculator';

interface AlgorithmicProgressCalculatorProps {
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  customSelectedChapterIds?: string[];
  compact?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const AlgorithmicProgressCalculator: React.FC<AlgorithmicProgressCalculatorProps> = ({
  subjects,
  chapterProgress,
  customSelectedChapterIds,
  compact = false,
  title = 'অ্যালগরিদমিক সিলেবাস প্রোগ্রেস ক্যালকুলেটর',
  subtitle = 'টাস্ক ওয়েটেজ ভিত্তিক বাস্তব ও নিখুঁত অধ্যায় প্রস্তুতি ট্র্যাকার',
  className = '',
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Compute algorithmic stats
  const stats = calculateAlgorithmicProgress(
    subjects,
    chapterProgress,
    customSelectedChapterIds
  );

  const {
    totalSelectedChapters,
    completedChaptersCount,
    inProgressChaptersCount,
    notStartedChaptersCount,
    totalPossiblePoints,
    sumOfEarnedTaskPoints,
    totalProgressPercent,
    conceptClearCount,
    conceptClearPoints,
    conceptClearPercent,
    cqSolveCount,
    cqSolvePoints,
    cqSolvePercent,
    mcqSolveCount,
    mcqSolvePoints,
    mcqSolvePercent,
    formattedBengaliProgress,
  } = stats;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-emerald-500/30 p-5 sm:p-7 shadow-2xl backdrop-blur-xl font-hind ${className}`}
    >
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-hind">
                {title}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-jakarta tracking-wider uppercase">
                ALGORITHMIC ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-hind">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Algorithm Formula Info Button */}
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold font-hind transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>ওয়েটেজ ফর্মুলা</span>
          {showFormulaDetails ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Expandable Formula & Weights Explanation Drawer */}
      <AnimatePresence>
        {showFormulaDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-white/5 py-4 my-2"
          >
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between font-bold text-white font-hind">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  ক্যালকুলেশন অ্যালগরিদম ও সূত্র (Calculation Algorithm)
                </span>
                <span className="text-[11px] text-slate-400 font-jakarta">
                  Total Weight = 100%
                </span>
              </div>

              {/* Task Weights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-blue-500/20">
                  <div className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    ১. কনসেপ্ট ক্লিয়ার (Concept Clear)
                  </div>
                  <div className="text-lg font-extrabold text-white font-anek mt-1">
                    ৩৩.৩% <span className="text-[10px] text-slate-400 font-normal">ওয়েট (Weight)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/20">
                  <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    ২. সৃজনশীল অনুশীলন (CQ Solve)
                  </div>
                  <div className="text-lg font-extrabold text-white font-anek mt-1">
                    ৩৩.৩% <span className="text-[10px] text-slate-400 font-normal">ওয়েট (Weight)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20">
                  <div className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                    <CheckSquare className="w-3 h-3" />
                    ৩. বহুনির্বাচনী অনুশীলন (MCQ Solve)
                  </div>
                  <div className="text-lg font-extrabold text-white font-anek mt-1">
                    ৩৩.৪% <span className="text-[10px] text-slate-400 font-normal">ওয়েট (Weight)</span>
                  </div>
                </div>
              </div>

              {/* Formula String */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-[11px] text-emerald-300 flex flex-col gap-1">
                <span className="text-slate-400 font-hind font-medium">অ্যালগরিদমিক গাণিতিক সমীকরণ:</span>
                <span className="font-semibold text-white">
                  Total Progress (%) = (Sum of Earned Task Points / Total Selected Chapters * 100) * 100
                </span>
                <span className="text-slate-400 text-[10px] font-hind">
                  বর্তমান হিসাব: ({toBengaliNumber(sumOfEarnedTaskPoints)} অর্জিত পয়েন্ট ÷ {toBengaliNumber(totalPossiblePoints)} মোট পয়েন্ট) × ১০০ = {toBengaliNumber(totalProgressPercent)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Metric Hero Section */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Bengali Formatted Hero Progress Badge */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-jakarta mb-1">
            ALGORITHMIC COMPLETION
          </span>

          {/* Formatted Bengali text using 'Anek Bangla' font (e.g., %১০০ সম্পন্ন) */}
          <div className="flex items-baseline gap-2">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-anek text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-md select-none"
              style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
            >
              {formattedBengaliProgress}
            </h1>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap justify-center lg:justify-start">
            <span className="text-xs font-bold text-slate-300 font-anek">
              মোট {toBengaliNumber(totalSelectedChapters)} টি নির্বাচিত অধ্যায়
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-emerald-400 font-bold font-anek">
              {toBengaliNumber(completedChaptersCount)} টি পূর্ণাঙ্গ শেষ
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-hind mt-1 max-w-xs">
            {toBengaliNumber(sumOfEarnedTaskPoints)} অর্জিত পয়েন্ট / {toBengaliNumber(totalPossiblePoints)} সম্ভাব্য পয়েন্ট
          </p>
        </div>

        {/* Right Side: Animated Gradient Loading Bars */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. Main Overall Animated Gradient Loading Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2 font-hind">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                সামগ্রিক সিলেবাস সমাপ্তির হার (Total Progress)
              </span>
              <span
                className="text-emerald-400 font-anek font-extrabold text-sm"
                style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
              >
                {formattedBengaliProgress}
              </span>
            </div>

            {/* Master Animated Gradient Bar Container */}
            <div className="relative w-full bg-slate-950/80 rounded-2xl h-4 p-0.5 border border-emerald-500/20 overflow-hidden shadow-inner">
              {/* Dynamic Animated Gradient Bar */}
              <motion.div
                className="h-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 relative overflow-hidden shadow-lg shadow-emerald-500/20"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Shimmer / light-sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
              </motion.div>
            </div>
          </div>

          {/* 2. Sub-Task Animated Gradient Loading Bars (33.3%, 33.3%, 33.4%) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Task 1: Concept Clear (33.3%) */}
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  কনসেপ্ট ক্লিয়ার
                </span>
                <span
                  className="font-bold text-white font-anek text-[13px]"
                  style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
                >
                  {formatBengaliProgress(conceptClearPercent)}
                </span>
              </div>

              {/* Animated Gradient Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-blue-500/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${conceptClearPercent}%` }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-hind">
                <span>ওয়েট: ৩৩.৩%</span>
                <span className="font-anek text-blue-200">
                  {toBengaliNumber(conceptClearCount)}/{toBengaliNumber(totalSelectedChapters)} অধ্যায়
                </span>
              </div>
            </div>

            {/* Task 2: CQ Solve (33.3%) */}
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-300 flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  CQ Solve
                </span>
                <span
                  className="font-bold text-white font-anek text-[13px]"
                  style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
                >
                  {formatBengaliProgress(cqSolvePercent)}
                </span>
              </div>

              {/* Animated Gradient Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-500/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${cqSolvePercent}%` }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-hind">
                <span>ওয়েট: ৩৩.৩%</span>
                <span className="font-anek text-emerald-200">
                  {toBengaliNumber(cqSolveCount)}/{toBengaliNumber(totalSelectedChapters)} অধ্যায়
                </span>
              </div>
            </div>

            {/* Task 3: MCQ Solve (33.4%) */}
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-300 flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-purple-400" />
                  MCQ Solve
                </span>
                <span
                  className="font-bold text-white font-anek text-[13px]"
                  style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
                >
                  {formatBengaliProgress(mcqSolvePercent)}
                </span>
              </div>

              {/* Animated Gradient Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-500/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${mcqSolvePercent}%` }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-hind">
                <span>ওয়েট: ৩৩.৪%</span>
                <span className="font-anek text-purple-200">
                  {toBengaliNumber(mcqSolveCount)}/{toBengaliNumber(totalSelectedChapters)} অধ্যায়
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Badges / Insights */}
      {!compact && (
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-hind">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>পূর্ণাঙ্গ সম্পন্ন: <strong className="text-white font-anek">{toBengaliNumber(completedChaptersCount)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>চলমান/আংশিক: <strong className="text-white font-anek">{toBengaliNumber(inProgressChaptersCount)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span>বাকি অধ্যায়: <strong className="text-white font-anek">{toBengaliNumber(notStartedChaptersCount)}</strong></span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-anek">
            ⚡ টাস্ক ক্লিক করলেই রিয়েল-টাইমে স্কোর আপডেট হয়
          </div>
        </div>
      )}
    </div>
  );
};
