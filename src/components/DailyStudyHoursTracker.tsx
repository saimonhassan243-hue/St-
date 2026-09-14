import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, Clock, CheckCircle2, Flame, Award, Zap, 
  Plus, RotateCcw, AlertCircle, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { toBengaliNumber, formatBengaliProgress } from '../utils/progressCalculator';
import { BoardRankAccelerationMetrics } from '../utils/adaptiveRoutineEngine';

interface DailyStudyHoursTrackerProps {
  targetStudyHours: number; // e.g. 8.5
  completedStudyHours: number; // e.g. 5.0
  manualExtraMinutes?: number; // e.g. 30
  onAddManualMinutes?: (mins: number) => void;
  onResetManualMinutes?: () => void;
  boardRankMetrics?: BoardRankAccelerationMetrics;
  completedTasksCount?: number;
  totalTasksCount?: number;
  className?: string;
}

export const DailyStudyHoursTracker: React.FC<DailyStudyHoursTrackerProps> = ({
  targetStudyHours,
  completedStudyHours,
  manualExtraMinutes = 0,
  onAddManualMinutes,
  onResetManualMinutes,
  boardRankMetrics,
  completedTasksCount = 0,
  totalTasksCount = 0,
  className = '',
}) => {
  // Total completed hours including any manually logged extra self-study
  const totalCompletedHours = Math.round((completedStudyHours + (manualExtraMinutes / 60)) * 10) / 10;
  const remainingHours = Math.max(0, Math.round((targetStudyHours - totalCompletedHours) * 10) / 10);
  const rawProgressPercent = targetStudyHours > 0 ? (totalCompletedHours / targetStudyHours) * 100 : 0;
  const clampedProgressPercent = Math.min(100, Math.round(rawProgressPercent));
  const isTargetMet = totalCompletedHours >= targetStudyHours;

  const targetHoursBn = toBengaliNumber(targetStudyHours.toFixed(1).replace('.0', ''));
  const completedHoursBn = toBengaliNumber(totalCompletedHours.toFixed(1).replace('.0', ''));
  const remainingHoursBn = toBengaliNumber(remainingHours.toFixed(1).replace('.0', ''));
  const progressPctBn = formatBengaliProgress(clampedProgressPercent);

  const paceLabel = boardRankMetrics?.paceStatusBn || 'বোর্ড টপ র‍্যাংক #১ স্ট্যান্ডার্ড পেস';
  const isCrunch = boardRankMetrics?.isCrunchActive ?? false;

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-850/90 to-slate-900/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl p-5 sm:p-7 overflow-hidden ${className}`}>
      {/* Top Accent Gradient Line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-jakarta">
                DAILY STUDY HOURS PROGRESS TRACKER
              </h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-anek flex items-center gap-1 ${
                isCrunch 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                <Zap className="w-3 h-3 text-cyan-400" />
                {paceLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              বোর্ড প্রথম স্থান (Roll 1) অর্জনের লক্ষ্যমাত্রায় দৈনিক পড়ার সময় ও অগ্রগতি ট্র্যাকিং
            </p>
          </div>
        </div>

        {/* Target Met Badge */}
        {isTargetMet && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 self-start sm:self-auto shadow-md">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>আজকের টার্গেট সম্পন্ন! 🌟</span>
          </div>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
        {/* Metric 1: AI-Assigned Target Study Hours */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-300 font-jakarta">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              AI TARGET STUDY HOURS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-anek">
              Roll 1 Goal
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-anek tracking-tight">
              {targetHoursBn}
            </span>
            <span className="text-xs font-bold text-slate-400 font-anek">ঘণ্টা (Hours)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            বোর্ড শীর্ষ র‍্যাংক নিশ্চিত করতে দৈনিক কাঙ্ক্ষিত স্টাডি সময়
          </p>
        </div>

        {/* Metric 2: Completed Study Hours */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-bold flex items-center gap-1.5 text-emerald-300 font-jakarta">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              COMPLETED STUDY HOURS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-anek">
              {progressPctBn} অর্জিত
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-anek tracking-tight">
              {completedHoursBn}
            </span>
            <span className="text-xs font-bold text-slate-400 font-anek">ঘণ্টা (Completed)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            রুটিন স্লট সম্পন্ন ও অতিরিক্ত পড়া মিলিয়ে মোট ট্র্যাকিং
          </p>
        </div>

        {/* Metric 3: Remaining Target Hours */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-bold flex items-center gap-1.5 text-amber-300 font-jakarta">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              REMAINING TARGET HOURS
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-anek ${
              isTargetMet 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              {isTargetMet ? 'সম্পূর্ণ' : 'বাকি'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl sm:text-3xl font-extrabold font-anek tracking-tight ${
              isTargetMet ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {remainingHoursBn}
            </span>
            <span className="text-xs font-bold text-slate-400 font-anek">
              {isTargetMet ? 'ঘণ্টা (লক্ষ্য পূরণ)' : 'ঘণ্টা বাকি (Remaining)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isTargetMet 
              ? 'চমৎকার! আপনি আজকের লক্ষ্যমাত্রা সম্পূর্ণ স্পর্শ করেছেন।' 
              : 'আজকের নির্ধারিত শীর্ষ তালিকায় থাকতে বাকি সময় সম্পন্ন করুন।'}
          </p>
        </div>
      </div>

      {/* Visual Progress Bar Section */}
      <div className="mt-5 p-4 rounded-2xl bg-slate-950/50 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 font-hind">
              দৈনিক টার্গেট অগ্রগতি (Daily Target Pace):
            </span>
            <span className="text-xs font-extrabold text-cyan-300 font-anek">
              {completedHoursBn} / {targetHoursBn} ঘণ্টা ({progressPctBn})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-anek hidden sm:inline">
            {totalTasksCount > 0 ? `${toBengaliNumber(completedTasksCount)}/${toBengaliNumber(totalTasksCount)}টি স্লট সম্পূর্ণ` : 'টাইম-ব্লকিং সক্রিয়'}
          </span>
        </div>

        {/* Visual Progress Bar with milestones */}
        <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full relative ${
              isTargetMet
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-lg shadow-emerald-500/40'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 shadow-lg shadow-cyan-500/30'
            }`}
          >
            {/* Gloss shine effect */}
            <div className="absolute inset-0 bg-white/15 rounded-full" />
          </motion.div>
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-anek mt-1.5 px-1">
          <span>০% (শুরু)</span>
          <span>৫০% (অর্ধেক)</span>
          <span>৭৫% (অগ্রসর)</span>
          <span className="font-bold text-emerald-400">১০০% (রোল ১ টার্গেট)</span>
        </div>
      </div>

      {/* Quick Time Logger & Manual Booster Controls */}
      {onAddManualMinutes && (
        <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 font-hind">
              অতিরিক্ত সেলফ-স্টাডি কুইক লগ (Quick Log Extra Hours):
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onAddManualMinutes(15)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-cyan-400/40 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer font-anek"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
              <span>+১৫ মিনিট</span>
            </button>

            <button
              type="button"
              onClick={() => onAddManualMinutes(30)}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-cyan-400/40 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer font-anek"
            >
              <Plus className="w-3 h-3 text-cyan-400" />
              <span>+৩০ মিনিট</span>
            </button>

            <button
              type="button"
              onClick={() => onAddManualMinutes(60)}
              className="px-2.5 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer font-anek"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              <span>+১.০ ঘণ্টা</span>
            </button>

            {manualExtraMinutes > 0 && onResetManualMinutes && (
              <button
                type="button"
                onClick={onResetManualMinutes}
                title="অতিরিক্ত লগ রিসেট করুন"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/5 text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
