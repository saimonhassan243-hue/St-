import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, Calendar, Clock, Sparkles, CheckCircle2, 
  BookOpen, Flame, Award, AlertTriangle, ChevronRight, 
  RotateCcw, Printer, Zap, Layers, ShieldCheck, Sun, 
  Moon, Coffee, Activity, ChevronLeft, Filter, Info,
  TrendingUp, BarChart3, CheckSquare, Square
} from 'lucide-react';
import { 
  UserProfile, 
  Subject, 
  StreamKey, 
  ReligionBn, 
  ChapterProgressData, 
  ChapterWeakPointData,
  ExamConfigData,
  FirebaseUserData 
} from '../types';
import { toBengaliNumber } from '../utils/progressCalculator';
import { 
  calculateLiveCountdown, 
  calculateSyllabusFitting, 
  generateSmartDailySchedule, 
  generateWeeklyDistributionPlan,
  DailyScheduleSlot,
  DayRoutinePlan,
  LiveCountdownInfo,
  SyllabusFittingMetrics,
  getAiSubjectDifficulty
} from '../utils/aiDynamicExamRoutineEngine';
import { ExamTargetConfigModal } from './ExamTargetConfigModal';
import { 
  getLocalExamConfig, 
  saveLocalExamConfig, 
  syncExamConfigToFirebase 
} from '../services/firebaseUserService';

interface RoutineViewProps {
  profile: UserProfile;
  stream: StreamKey;
  religionSubject: Subject;
  religionBn: ReligionBn;
  allActiveSubjects?: Subject[];
  chapterProgress?: Record<string, ChapterProgressData>;
  customSelectedChapterIds?: string[];
  examDate?: string;
  examConfig?: ExamConfigData;
  sscBatch?: string;
  currentUser?: FirebaseUserData | null;
  onUpdateProgressData?: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
  onNavigateToSyllabus?: (subjectId: string, chapterId: string) => void;
  onUpdateExamConfig?: (config: ExamConfigData) => void;
}

const STORAGE_KEY_CHECKED_SLOTS = 'ssc_smart_routine_checked_slots_v2';
const STORAGE_KEY_WEAK_POINTS = 'ssc_student_weak_points_v2';

export const RoutineView: React.FC<RoutineViewProps> = ({
  profile,
  stream,
  religionSubject,
  religionBn,
  allActiveSubjects = [],
  chapterProgress = {},
  customSelectedChapterIds,
  examDate: propExamDate = '2028-02-15',
  examConfig: propExamConfig,
  sscBatch = '2028',
  currentUser,
  onUpdateProgressData,
  onNavigateToSyllabus,
  onUpdateExamConfig,
}) => {
  // 1. Exam Configuration State
  const [examConfig, setExamConfig] = useState<ExamConfigData>(() => {
    if (propExamConfig && propExamConfig.isConfigured) return propExamConfig;
    const local = getLocalExamConfig();
    if (local && local.isConfigured) return local;
    return {
      examType: 'ssc',
      examTypeBn: 'এসএসসি',
      examDate: propExamDate || '2028-02-15',
      targetStudyHours: 6.5,
      isConfigured: false,
      updatedAt: new Date().toISOString(),
    };
  });

  // Modal display control
  const [showConfigModal, setShowConfigModal] = useState<boolean>(() => {
    // Show modal if never configured before
    const local = getLocalExamConfig();
    return !(local && local.isConfigured);
  });

  // 2. Weak Points Map (Read from tracker storage)
  const [weakPointsMap, setWeakPointsMap] = useState<Record<string, ChapterWeakPointData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEAK_POINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // 3. Checked / Completed Slots State
  const [checkedSlots, setCheckedSlots] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED_SLOTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  // 4. Day & Filter Navigation State
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [slotFilter, setSlotFilter] = useState<'all' | 'study' | 'lifestyle'>('all');
  const [routineRefreshKey, setRoutineRefreshKey] = useState<number>(0);

  // 5. Live Countdown Ticker (1-second pulse)
  const [countdown, setCountdown] = useState<LiveCountdownInfo>(() =>
    calculateLiveCountdown(examConfig.examDate)
  );

  useEffect(() => {
    setCountdown(calculateLiveCountdown(examConfig.examDate));
    const timer = setInterval(() => {
      setCountdown(calculateLiveCountdown(examConfig.examDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [examConfig.examDate]);

  // Sync prop changes
  useEffect(() => {
    if (propExamConfig && propExamConfig.isConfigured) {
      setExamConfig(propExamConfig);
    }
  }, [propExamConfig]);

  // 6. Calculate Dynamic Syllabus Fitting Metrics
  const fittingMetrics: SyllabusFittingMetrics = calculateSyllabusFitting(
    allActiveSubjects,
    customSelectedChapterIds,
    chapterProgress,
    examConfig.examDate
  );

  // 7. Generate 7-Day Revolving Plan
  const weeklyPlans: DayRoutinePlan[] = generateWeeklyDistributionPlan(
    allActiveSubjects,
    customSelectedChapterIds,
    chapterProgress,
    weakPointsMap,
    checkedSlots
  );

  const activeDayPlan = weeklyPlans[selectedDayIndex] || weeklyPlans[0];

  // Filter slots based on user selection
  const visibleSlots = activeDayPlan.slots.filter((s) => {
    if (slotFilter === 'study') return s.type === 'study';
    if (slotFilter === 'lifestyle') return s.type !== 'study';
    return true;
  });

  // Toggle slot completion
  const handleToggleSlot = (slotId: string) => {
    setCheckedSlots((prev) => {
      const next = { ...prev, [slotId]: !prev[slotId] };
      try {
        localStorage.setItem(STORAGE_KEY_CHECKED_SLOTS, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Save Exam Target Configuration
  const handleSaveExamConfig = async (newConfig: ExamConfigData) => {
    setExamConfig(newConfig);
    saveLocalExamConfig(newConfig);

    if (currentUser?.userId || profile.name) {
      const uId = currentUser?.userId || profile.name;
      await syncExamConfigToFirebase(uId, newConfig);
    }

    if (onUpdateExamConfig) {
      onUpdateExamConfig(newConfig);
    }

    setRoutineRefreshKey((prev) => prev + 1);
  };

  // Print Routine
  const handlePrintRoutine = () => {
    window.print();
  };

  // Calculate completed study minutes for today
  const todayStudySlots = activeDayPlan.slots.filter((s) => s.type === 'study');
  const completedStudyCount = todayStudySlots.filter((s) => checkedSlots[s.id]).length;
  const totalStudyCount = todayStudySlots.length;

  return (
    <div className="relative w-full text-slate-100 font-hind space-y-6 select-none" key={routineRefreshKey}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & EXAM TARGET BAR                                           */}
      {/* ========================================================================= */}
      <div className="relative bg-slate-900/85 border border-white/10 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-jakarta flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI DYNAMIC EXAM ROUTINE ENGINE</span>
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-jakarta">
                {examConfig.examTypeBn} লক্ষ্যমাত্রা
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white font-jakarta flex items-center gap-2.5">
              <span>{examConfig.examTypeBn} পরীক্ষার স্মার্ট এআই রুটিন</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-normal border border-white/10 font-anek">
                {new Date(examConfig.examDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-anek mt-1">
              বিদ্যালয় সময় (০৮:০০ AM - ০৪:৫০ PM) ফ্রিজ রেখে লাইফস্টাইল ব্যালেন্স ও দুর্বল বিষয়ভিত্তিক সময় বরাদ্দ।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer font-jakarta"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>টার্গেট পরিবর্তন করুন</span>
            </button>

            <button
              onClick={() => setRoutineRefreshKey((prev) => prev + 1)}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 hover:text-white transition-colors cursor-pointer"
              title="রুটিন রিফ্রেশ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrintRoutine}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 hover:text-white transition-colors cursor-pointer"
              title="প্রিন্ট বা সেভ"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE COUNTDOWN & DYNAMIC SYLLABUS FITTING CARD                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Live Countdown Timer (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/85 border border-indigo-500/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 font-jakarta uppercase">LIVE COUNTDOWN</span>
                <h4 className="text-xs font-bold text-white font-anek">পরীক্ষার বাকি সময়</h4>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${countdown.statusBadgeColor} font-anek`}>
              {countdown.statusBadgeBn}
            </span>
          </div>

          {/* Big Digital Countdown Grid */}
          <div className="grid grid-cols-4 gap-2 my-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-jakarta">
                {toBengaliNumber(countdown.daysRemaining)}
              </span>
              <span className="text-[10px] text-slate-400 font-anek">দিন (Days)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-indigo-400 font-jakarta">
                {toBengaliNumber(countdown.hoursRemaining)}
              </span>
              <span className="text-[10px] text-slate-400 font-anek">ঘণ্টা (Hrs)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-jakarta">
                {toBengaliNumber(countdown.minutesRemaining)}
              </span>
              <span className="text-[10px] text-slate-400 font-anek">মিনিট (Mins)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center relative overflow-hidden">
              <span className="block text-2xl sm:text-3xl font-black text-pink-400 font-jakarta">
                {toBengaliNumber(String(Math.floor((Date.now() / 1000) % 60)).padStart(2, '0'))}
              </span>
              <span className="text-[10px] text-slate-400 font-anek">সেকেন্ড (Sec)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-anek">
            <span>টার্গেট ব্যাচ: <strong className="text-white">{sscBatch}</strong></span>
            <span>দৈনিক লক্ষ্য: <strong className="text-amber-300">{toBengaliNumber((examConfig.targetStudyHours || 6.5).toFixed(1))} ঘণ্টা</strong></span>
          </div>
        </div>

        {/* Right: Dynamic Syllabus Fitting Engine (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/85 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-jakarta uppercase">SYLLABUS FITTING ENGINE</span>
                  <h4 className="text-xs font-bold text-white font-anek">সিলেবাস কভারেজ ও গতির পূর্বাভাস</h4>
                </div>
              </div>

              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-jakarta">
                {toBengaliNumber(fittingMetrics.completionRatePercent)}% সমাপ্ত
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-white/10 mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${Math.min(100, fittingMetrics.completionRatePercent)}%` }}
              />
            </div>

            {/* 4 Fitting Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-anek">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">মোট অধ্যায়</span>
                <strong className="text-sm font-bold text-white font-jakarta">
                  {toBengaliNumber(fittingMetrics.totalActiveChapters)}টি
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">বাকি / ব্যাকলগ</span>
                <strong className="text-sm font-bold text-amber-300 font-jakarta">
                  {toBengaliNumber(fittingMetrics.backlogChapters)}টি
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">প্রয়োজনীয় গতি</span>
                <strong className="text-sm font-bold text-indigo-300 font-jakarta">
                  {fittingMetrics.requiredDailyVelocityBn} অধ্যায়/দিন
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <span className="text-[10px] text-slate-400 block">সমাপ্তির তারিখ</span>
                <strong className="text-xs font-bold text-emerald-300 font-jakarta">
                  {fittingMetrics.estimatedCompletionDateBn}
                </strong>
              </div>
            </div>
          </div>

          {/* Pacing advice banner */}
          <div className="mt-3.5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 font-anek flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="line-clamp-2 leading-relaxed">
              <strong>এআই নির্দেশনা:</strong> {fittingMetrics.pacingAdviceBn}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AI DURATION RULES & WEAK POINT LOGIC EXPLAINER                         */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/5 backdrop-blur-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-anek">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-2">
              <span>এআই বিষয়ভিত্তিক সময় বরাদ্দ ও দুর্বল পয়েন্ট নিয়ম</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MAX 4 SUBJECTS/DAY
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              কঠিন বিষয়ে ৯০-১২০ মি., প্রায়োগিক বিষয়ে ৬০-৭৫ মি., তাত্ত্বিক বিষয়ে ৪৫-৬০ মি. এবং দুর্বল বিষয়ে +১৫ থেকে +৩০ মিনিট অটো-বুস্ট।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] shrink-0 font-jakarta">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30">
            উচ্চ জটিলতা: ৯০-১২০ মি.
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            প্রায়োগিক: ৬০-৭৫ মি.
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            তাত্ত্বিক: ৪৫-৬০ মি.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 7-DAY REVOLVING SCHEDULE TABS & FILTER BAR                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-anek">
          {weeklyPlans.map((plan) => {
            const isSelected = plan.dayIndex === selectedDayIndex;
            return (
              <button
                key={plan.dayIndex}
                onClick={() => setSelectedDayIndex(plan.dayIndex)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400'
                    : 'bg-slate-900/80 text-slate-300 border border-white/5 hover:bg-slate-800'
                }`}
              >
                <span>{plan.dayNameBn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {plan.dateFormattedBn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slot Filters (All / Study / Lifestyle) */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-white/5 shrink-0 font-anek text-xs">
          <button
            onClick={() => setSlotFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              slotFilter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            সব টাইম-ব্লক ({activeDayPlan.slots.length})
          </button>
          <button
            onClick={() => setSlotFilter('study')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
              slotFilter === 'study'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>স্টাডি সেশন ({todayStudySlots.length})</span>
          </button>
          <button
            onClick={() => setSlotFilter('lifestyle')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              slotFilter === 'lifestyle'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            লাইফস্টাইল ও স্কুল
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE TIMELINE / DAILY SCHEDULE CARD                             */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-5 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-4">
        {/* Timeline Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{activeDayPlan.dayNameBn}-এর সময়সূচি ({activeDayPlan.dateFormattedBn})</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek mt-0.5">
              মোট অধ্যয়ন সময়: <strong className="text-cyan-300">{activeDayPlan.totalStudyHoursBn}</strong> • নির্বাচিত বিষয়: <strong className="text-white">{toBengaliNumber(activeDayPlan.assignedSubjectsCount)}টি</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 font-anek">
              সম্পন্ন: <strong className="text-emerald-400">{toBengaliNumber(completedStudyCount)}</strong> / {toBengaliNumber(totalStudyCount)} সেশন
            </span>
          </div>
        </div>

        {/* Timeline Slots Container */}
        <div className="space-y-3 pt-2">
          {visibleSlots.map((slot, idx) => {
            const isDone = Boolean(checkedSlots[slot.id]);

            // ===================================================================
            // CASE A: STRICT FROZEN SCHOOL BLOCK (08:00 AM - 04:50 PM)
            // ===================================================================
            if (slot.isFixedSchoolBlock) {
              return (
                <div
                  key={slot.id}
                  className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-indigo-950/60 border-2 border-indigo-500/40 shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-anek"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-xl">🏫</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-500/50 font-jakarta uppercase tracking-wider">
                          STRICT FROZEN SCHOOL BLOCK
                        </span>
                        <span className="text-xs font-bold text-indigo-300 font-jakarta">
                          {slot.formattedTime}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {slot.durationFormatted}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white font-jakarta">
                        {slot.periodName}
                      </h4>
                      <p className="text-xs text-indigo-200/80 mt-0.5">
                        {slot.focusTopic} (এই ব্লকে কোনো অতিরিক্ত স্টাডি বা রিভিশন টাস্ক দেওয়া হয় না)।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    <span className="text-[11px] font-bold text-indigo-300/90 px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>ক্লাস ও প্রাতিষ্ঠানিক সময়</span>
                    </span>
                  </div>
                </div>
              );
            }

            // ===================================================================
            // CASE B: STUDY SESSIONS (High-Yield Subject Blocks)
            // ===================================================================
            if (slot.type === 'study') {
              return (
                <div
                  key={slot.id}
                  className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-anek ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                      : 'bg-slate-950/60 border-white/10 hover:border-indigo-500/40 hover:bg-slate-950/80 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleSlot(slot.id)}
                      className="mt-0.5 p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      title={isDone ? 'সম্পন্ন হিসেবে চিহ্নিত' : 'সম্পন্ন করুন'}
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Badge bar */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-black text-cyan-300 font-jakarta">
                          {slot.formattedTime}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-jakarta">
                          {slot.durationFormatted}
                        </span>

                        {slot.assignedTaskLabelBn && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${slot.taskBadgeColor || 'bg-blue-500/20 text-blue-300 border-blue-500/40'}`}>
                            {slot.assignedTaskLabelBn}
                          </span>
                        )}

                        {slot.hasWeakPointBoost && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-jakarta animate-pulse">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>WEAK POINT BOOST</span>
                          </span>
                        )}
                      </div>

                      {/* Subject and Chapter title */}
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-white font-jakarta">
                          {slot.subjectTitle}
                        </h4>
                        {slot.chapterTitle && (
                          <span className="text-xs text-indigo-300 font-bold">
                            • {slot.chapterTitle}
                          </span>
                        )}
                      </div>

                      {/* Focus Topic description */}
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {slot.focusTopic}
                      </p>

                      {/* Weak point reason note */}
                      {slot.weakPointReasonBn && (
                        <div className="mt-1.5 text-[11px] text-amber-300/90 flex items-center gap-1 font-anek">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{slot.weakPointReasonBn}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Action: Navigate to chapter in syllabus */}
                  {onNavigateToSyllabus && slot.subjectId && slot.chapterId && (
                    <div className="shrink-0 sm:self-center">
                      <button
                        onClick={() => onNavigateToSyllabus(slot.subjectId!, slot.chapterId!)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/10 transition-colors cursor-pointer"
                      >
                        <span>অধ্যায়ে যান</span>
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            // ===================================================================
            // CASE C: LIFESTYLE BLOCKS (Sleep, Meals, Recreation, Review)
            // ===================================================================
            return (
              <div
                key={slot.id}
                className="relative p-3.5 sm:p-4 rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-between gap-4 font-anek text-xs text-slate-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center shrink-0">
                    {slot.type === 'sleep' && <Moon className="w-4 h-4 text-indigo-400" />}
                    {slot.type === 'meal' && <Coffee className="w-4 h-4 text-amber-400" />}
                    {slot.type === 'worship' && <Sun className="w-4 h-4 text-emerald-400" />}
                    {slot.type === 'leisure_sports' && <Activity className="w-4 h-4 text-pink-400" />}
                    {slot.type === 'review' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 font-jakarta">{slot.formattedTime}</span>
                      <span className="text-[10px] text-slate-500">({slot.durationFormatted})</span>
                    </div>
                    <h5 className="font-bold text-slate-200">{slot.periodName}</h5>
                    <p className="text-[11px] text-slate-400">{slot.focusTopic}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400">
                    লাইফস্টাইল
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. EXAM CONFIGURATION MODAL OVERLAY                                       */}
      {/* ========================================================================= */}
      <ExamTargetConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveExamConfig}
        currentConfig={examConfig}
        totalChaptersInScope={fittingMetrics.totalActiveChapters}
      />
    </div>
  );
};
