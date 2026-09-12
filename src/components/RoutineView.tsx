import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, CheckCircle2, Circle, Sparkles, 
  BookOpen, Plus, Trash2, RotateCcw, Award, Check,
  Sliders, Sun, Sunset, Moon, Activity, Coffee, Shield,
  Printer, ArrowRight, Zap, Target, BookMarked, Layers,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Subject, StreamKey, ReligionBn, UserProfile, ChapterProgressData } from '../types';
import { 
  ScheduleInputs, 
  RoutineTimeSlot, 
  computeScheduleMetrics, 
  buildAutomatedRoutine, 
  buildFullDayTimeline,
  format12HourBn,
  formatDurationBn
} from '../utils/routineBuilder';
import { toBengaliNumber, formatBengaliProgress } from '../utils/progressCalculator';

interface RoutineViewProps {
  profile: UserProfile;
  stream: StreamKey;
  religionSubject: Subject;
  religionBn: ReligionBn;
  allActiveSubjects?: Subject[];
  chapterProgress?: Record<string, ChapterProgressData>;
}

const DEFAULT_INPUTS: ScheduleInputs = {
  targetStudyHours: 5,
  schoolStart: '08:00',
  schoolEnd: '13:30',
  playStart: '17:00',
  playEnd: '18:30',
  sleepStart: '22:30',
  sleepEnd: '05:30',
};

const STORAGE_KEY_INPUTS = 'ssc_routine_builder_inputs_v1';
const STORAGE_KEY_CHECKED = 'ssc_routine_builder_checked_v1';

export const RoutineView: React.FC<RoutineViewProps> = ({
  profile,
  stream,
  religionSubject,
  religionBn,
  allActiveSubjects = [],
  chapterProgress = {},
}) => {
  // 1. User inputs for automated routine builder
  const [scheduleInputs, setScheduleInputs] = useState<ScheduleInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_INPUTS;
  });

  // 2. Mark-as-done state for daily timetable tasks
  const [completedTasksMap, setCompletedTasksMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // UI state
  const [showConfigDrawer, setShowConfigDrawer] = useState(true);
  const [viewMode, setViewMode] = useState<'study_grid' | 'full_day'>('study_grid');
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customSlots, setCustomSlots] = useState<RoutineTimeSlot[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [customTime, setCustomTime] = useState('04:00 PM - 05:00 PM');

  // Persist inputs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(scheduleInputs));
    } catch {
      // ignore
    }
  }, [scheduleInputs]);

  // Persist checked tasks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(completedTasksMap));
    } catch {
      // ignore
    }
  }, [completedTasksMap]);

  // Handle input changes
  const handleInputChange = <K extends keyof ScheduleInputs>(key: K, value: ScheduleInputs[K]) => {
    setScheduleInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Compute 24-Hour Metrics (Deductions of School, Play, Sleep)
  const metrics = useMemo(() => {
    return computeScheduleMetrics(scheduleInputs);
  }, [scheduleInputs]);

  // Subject list fallback
  const subjectsToUse = useMemo(() => {
    if (allActiveSubjects.length > 0) return allActiveSubjects;
    return [
      { id: 'math', name: 'সাধারণ গণিত', chapters: [] },
      { id: 'core', name: stream === 'science' ? 'পদার্থবিজ্ঞান ও রসায়ন' : stream === 'business' ? 'হিসাববিজ্ঞান' : 'ইতিহাস ও বিশ্বসভ্যতা', chapters: [] },
      religionSubject,
    ];
  }, [allActiveSubjects, stream, religionSubject]);

  // Auto-Allocate Routine Blocks
  const automatedStudySlots = useMemo(() => {
    return buildAutomatedRoutine(
      scheduleInputs,
      subjectsToUse,
      stream,
      religionBn,
      completedTasksMap
    );
  }, [scheduleInputs, subjectsToUse, stream, religionBn, completedTasksMap]);

  // Combine automated study slots with any custom slots
  const allStudySlots = useMemo(() => {
    return [...automatedStudySlots, ...customSlots];
  }, [automatedStudySlots, customSlots]);

  // Complete 24-Hour Day Flow
  const fullDayTimeline = useMemo(() => {
    return buildFullDayTimeline(scheduleInputs, allStudySlots);
  }, [scheduleInputs, allStudySlots]);

  // Toggle mark-as-done for a slot
  const handleToggleTask = (slotId: string) => {
    setCompletedTasksMap((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  };

  // Reset all marks
  const handleResetChecklist = () => {
    setCompletedTasksMap({});
  };

  // Quick Presets
  const applyPreset = (hours: number) => {
    setScheduleInputs((prev) => ({
      ...prev,
      targetStudyHours: hours,
    }));
  };

  // Add custom slot
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject.trim()) return;
    const newSlot: RoutineTimeSlot = {
      id: `custom_slot_${Date.now()}`,
      type: 'study',
      periodName: 'কাস্টম স্টাডি সেশন (Custom Study Block)',
      startTime: '16:00',
      endTime: '17:00',
      formattedTime: customTime,
      durationMinutes: 60,
      durationFormatted: '১.০ ঘণ্টা',
      subjectTitle: customSubject.trim(),
      focusTopic: customTopic.trim() || 'নির্ধারিত টপিক রিভিশন ও নোট তৈরি',
      assignedTask: 'concept_clear',
      assignedTaskTitle: '📘 কাস্টম টাস্ক',
      taskBadgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      isCompleted: false,
      categoryTag: 'কাস্টম সেশন',
      categoryTagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      isCustom: true,
    };
    setCustomSlots((prev) => [...prev, newSlot]);
    setCustomSubject('');
    setCustomTopic('');
    setShowAddCustomModal(false);
  };

  const removeCustomSlot = (id: string) => {
    setCustomSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Calculation of Task Completion in Daily Timetable
  const totalStudyBlocks = allStudySlots.length;
  const completedStudyBlocks = allStudySlots.filter((s) => completedTasksMap[s.id]).length;
  const progressPercentage = totalStudyBlocks > 0 ? Math.round((completedStudyBlocks / totalStudyBlocks) * 100) : 0;
  const formattedCompletion = formatBengaliProgress(progressPercentage);

  return (
    <div className="relative w-full text-slate-100 font-hind">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/85 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-5 sm:p-7 md:p-9 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* ============================================================== */}
        {/* 1. TOP HEADER & CONTROLS                                       */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 border border-cyan-400/40 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 shrink-0">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide font-jakarta">
                  TIME-BLOCKING ROUTINE BUILDER
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-anek">
                  অটোমেটেড রুটিন
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-anek">
                  {profile.sscBatch}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                স্কুল, ঘুম ও বিনোদন বাদ দিয়ে অবশিষ্ট ফ্রি সময়ে বিজ্ঞানভিত্তিক স্টাডি টাইম-ব্লকিং
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showConfigDrawer ? 'ইনপুট হাইড' : 'শিডিউল ইনপুট পরিবর্তন'}</span>
              {showConfigDrawer ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>

            <button
              onClick={() => setShowAddCustomModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>স্লট যোগ</span>
            </button>

            <button
              onClick={handleResetChecklist}
              title="আজকের পড়ার চেকলিস্ট রিসেট করুন"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => window.print()}
              title="রুটিন প্রিন্ট করুন"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. SCHEDULE INPUTS & 24H DEDUCTION METRICS DRAWER              */}
        {/* ============================================================== */}
        <AnimatePresence>
          {showConfigDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-slate-800/60 border border-cyan-500/25 backdrop-blur-xl shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-jakarta">
                      DAILY SCHEDULE INPUTS & PARAMETERS
                    </h3>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 mr-1 font-anek">কুইক প্রিসেট:</span>
                    {[
                      { hours: 3.5, label: '৩.৫ ঘণ্টা (হালকা)' },
                      { hours: 5, label: '৫ ঘণ্টা (আদর্শ)' },
                      { hours: 6.5, label: '৬.৫ ঘণ্টা (পরীক্ষা)' },
                      { hours: 8, label: '৮ ঘণ্টা (নিবিড়)' },
                    ].map((p) => (
                      <button
                        key={p.hours}
                        onClick={() => applyPreset(p.hours)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-anek ${
                          scheduleInputs.targetStudyHours === p.hours
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/5'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Target Study Hours */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-cyan-400" />
                          <span>দৈনিক টার্গেট স্টাডি</span>
                        </label>
                        <span className="text-sm font-extrabold text-cyan-400 font-anek">
                          {toBengaliNumber(scheduleInputs.targetStudyHours)} ঘণ্টা
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">প্রতিদিন পড়ার মোট কাঙ্ক্ষিত সময়</p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleInputChange('targetStudyHours', Math.max(2, scheduleInputs.targetStudyHours - 0.5))}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="2"
                        max="10"
                        step="0.5"
                        value={scheduleInputs.targetStudyHours}
                        onChange={(e) => handleInputChange('targetStudyHours', parseFloat(e.target.value))}
                        className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                      />
                      <button
                        onClick={() => handleInputChange('targetStudyHours', Math.min(10, scheduleInputs.targetStudyHours + 0.5))}
                        className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 2. School Hours */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>স্কুল ও কোচিং সময়</span>
                        </label>
                        <span className="text-xs font-bold text-amber-300 font-anek">
                          {formatDurationBn(metrics.schoolMinutes)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">শুরু এবং ছুটির সময়সীমা</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">শুরু</span>
                        <input
                          type="time"
                          value={scheduleInputs.schoolStart}
                          onChange={(e) => handleInputChange('schoolStart', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500 font-anek"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">ছুটি</span>
                        <input
                          type="time"
                          value={scheduleInputs.schoolEnd}
                          onChange={(e) => handleInputChange('schoolEnd', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500 font-anek"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Play & Relaxation Hours */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-rose-400" />
                          <span>খেলাধুলা ও মাইন্ড রিফ্রেশ</span>
                        </label>
                        <span className="text-xs font-bold text-rose-300 font-anek">
                          {formatDurationBn(metrics.playMinutes)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">শারীরিক ব্যায়াম ও বন্ধুদের সাথে সময়</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">শুরু</span>
                        <input
                          type="time"
                          value={scheduleInputs.playStart}
                          onChange={(e) => handleInputChange('playStart', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-rose-500 font-anek"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">শেষ</span>
                        <input
                          type="time"
                          value={scheduleInputs.playEnd}
                          onChange={(e) => handleInputChange('playEnd', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-rose-500 font-anek"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Sleep Schedule */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>ঘুম ও বিশ্রামের সময়</span>
                        </label>
                        <span className="text-xs font-bold text-indigo-300 font-anek">
                          {formatDurationBn(metrics.sleepMinutes)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">পরিমিত ঘুম স্মৃতিশক্তি বৃদ্ধি করে</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">ঘুমাতে যাওয়া</span>
                        <input
                          type="time"
                          value={scheduleInputs.sleepStart}
                          onChange={(e) => handleInputChange('sleepStart', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-indigo-500 font-anek"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">ঘুম থেকে উঠা</span>
                        <input
                          type="time"
                          value={scheduleInputs.sleepEnd}
                          onChange={(e) => handleInputChange('sleepEnd', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-indigo-500 font-anek"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Day Deduction Formula Bar */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-950/70 border border-white/5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs mb-2.5">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 font-jakarta">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>২৪ ঘণ্টার স্বয়ংক্রিয় টাইম-ব্যালান্স ও ফ্রি স্লট ডিডাকশন</span>
                    </span>
                    <span className="text-slate-400 font-anek">
                      ২৪ ঘণ্টা - ({toBengaliNumber(metrics.sleepHours)}h ঘুম + {toBengaliNumber(metrics.schoolHours)}h স্কুল + {toBengaliNumber(metrics.playHours)}h খেলা) = <strong className="text-cyan-400 font-bold">{toBengaliNumber(metrics.freeHours)} ঘণ্টা ফ্রি সময়</strong>
                    </span>
                  </div>

                  {/* Multi-segment 24-hour bar */}
                  <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-800 border border-slate-700/60 shadow-inner">
                    {/* Sleep segment */}
                    <div
                      style={{ width: `${(metrics.sleepMinutes / 1440) * 100}%` }}
                      className="bg-indigo-600 relative group"
                      title={`ঘুম: ${formatDurationBn(metrics.sleepMinutes)}`}
                    />
                    {/* School segment */}
                    <div
                      style={{ width: `${(metrics.schoolMinutes / 1440) * 100}%` }}
                      className="bg-amber-500 relative group"
                      title={`স্কুল: ${formatDurationBn(metrics.schoolMinutes)}`}
                    />
                    {/* Play segment */}
                    <div
                      style={{ width: `${(metrics.playMinutes / 1440) * 100}%` }}
                      className="bg-rose-500 relative group"
                      title={`খেলাধুলা: ${formatDurationBn(metrics.playMinutes)}`}
                    />
                    {/* Study allocated segment */}
                    <div
                      style={{ width: `${(metrics.targetStudyMinutes / 1440) * 100}%` }}
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 relative group"
                      title={`টার্গেট স্টাডি: ${formatDurationBn(metrics.targetStudyMinutes)}`}
                    />
                    {/* Remaining leisure segment */}
                    <div
                      style={{ width: `${(metrics.remainingLeisureMinutes / 1440) * 100}%` }}
                      className="bg-slate-700/60 relative group"
                      title={`অন্যান্য বিরতি ও খাবার: ${formatDurationBn(metrics.remainingLeisureMinutes)}`}
                    />
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 flex-wrap mt-2.5 text-[11px] text-slate-400 font-anek">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                      ঘুম ({toBengaliNumber(metrics.sleepHours)}h)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      স্কুল ({toBengaliNumber(metrics.schoolHours)}h)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      খেলা ({toBengaliNumber(metrics.playHours)}h)
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                      পড়াশোনা ({toBengaliNumber(metrics.targetStudyHours)}h)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                      খাবার ও ব্যক্তিগত সময় ({toBengaliNumber(Math.round((metrics.remainingLeisureMinutes / 60) * 10) / 10)}h)
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* 3. DAILY ROUTINE PROGRESS & VIEW MODE SWITCHER                 */}
        {/* ============================================================== */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg">
          {/* Progress metric with 'Anek Bangla' font and animated gradient bar */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-base shadow-md shadow-emerald-500/20 font-anek shrink-0">
              {progressPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-jakarta">
                  TODAY'S ROUTINE PROGRESS
                </h3>
                <span 
                  className="text-xs font-bold text-emerald-400 font-anek"
                  style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
                >
                  {formattedCompletion}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-anek mt-0.5">
                নির্ধারিত {toBengaliNumber(totalStudyBlocks)}টি স্টাডি ব্লকের মধ্যে {toBengaliNumber(completedStudyBlocks)}টি সম্পন্ন হয়েছে
              </p>
            </div>
          </div>

          {/* Animated Gradient Bar & View Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="w-full sm:w-56">
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="p-1 rounded-xl bg-slate-950/80 border border-white/5 flex items-center gap-1 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('study_grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'study_grid'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>স্টাডি গ্রিড</span>
              </button>
              <button
                onClick={() => setViewMode('full_day')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'full_day'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>২৪ ঘণ্টা শিডিউল</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. INTERACTIVE TIMETABLE GRID                                  */}
        {/* ============================================================== */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 font-jakarta uppercase tracking-wider">
                {viewMode === 'study_grid' ? 'AUTOMATED STUDY BLOCKS & TASK ALLOCATION' : 'COMPLETE 24-HOUR CHRONOLOGICAL TIMELINE'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-anek">
                {toBengaliNumber(viewMode === 'study_grid' ? allStudySlots.length : fullDayTimeline.length)}টি স্লট
              </span>
            </div>
            <span className="text-xs text-slate-400 font-hind">
              ✓ চেকবক্সে ক্লিক করে আজকের পড়া সম্পন্ন মার্ক করুন
            </span>
          </div>

          {/* Timetable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(viewMode === 'study_grid' ? allStudySlots : fullDayTimeline).map((slot, idx) => {
              const isDone = completedTasksMap[slot.id];
              const isStudy = slot.type === 'study';

              // Visual styling based on time slot
              let cardBg = 'bg-slate-800/40 hover:bg-slate-800/60 border-white/5';
              let iconHeader = <Sun className="w-4 h-4 text-amber-400" />;
              
              if (slot.id.includes('morning')) {
                iconHeader = <Sun className="w-4 h-4 text-amber-400" />;
              } else if (slot.id.includes('evening')) {
                iconHeader = <Sunset className="w-4 h-4 text-orange-400" />;
              } else if (slot.id.includes('night')) {
                iconHeader = <Moon className="w-4 h-4 text-indigo-400" />;
              } else if (slot.type === 'school') {
                iconHeader = <BookOpen className="w-4 h-4 text-amber-400" />;
                cardBg = 'bg-amber-950/20 border-amber-500/20';
              } else if (slot.type === 'play') {
                iconHeader = <Activity className="w-4 h-4 text-rose-400" />;
                cardBg = 'bg-rose-950/20 border-rose-500/20';
              } else if (slot.type === 'sleep') {
                iconHeader = <Moon className="w-4 h-4 text-slate-400" />;
                cardBg = 'bg-slate-900/60 border-slate-700/40';
              }

              if (isDone && isStudy) {
                cardBg = 'bg-emerald-950/30 border-emerald-500/30 shadow-lg shadow-emerald-500/5';
              }

              return (
                <motion.div
                  key={slot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${cardBg}`}
                >
                  {/* Subtle top indicator bar */}
                  {isDone && isStudy && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />
                  )}

                  <div>
                    {/* Slot Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {iconHeader}
                        <span className="text-xs font-bold text-white font-jakarta">
                          {slot.periodName}
                        </span>
                      </div>

                      {/* Duration Badge */}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-300 border border-cyan-500/30 font-anek">
                        {slot.durationFormatted}
                      </span>
                    </div>

                    {/* Time Range */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-3 font-anek bg-slate-900/60 px-2.5 py-1.5 rounded-xl border border-white/5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{slot.formattedTime}</span>
                    </div>

                    {/* Subject & Topic (for study) */}
                    {isStudy ? (
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block mb-1 ${slot.categoryTagColor || 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'}`}>
                            {slot.categoryTag}
                          </span>
                          <h4 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                            {slot.subjectTitle}
                          </h4>
                          <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                            {slot.focusTopic}
                          </p>
                        </div>

                        {/* Assigned Task Pill */}
                        {slot.assignedTaskTitle && (
                          <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 ${slot.taskBadgeColor}`}>
                            <span>{slot.assignedTaskTitle}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {slot.focusTopic}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Slot Footer & Checkbox */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    {isStudy ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleToggleTask(slot.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                            isDone ? 'bg-slate-950 text-emerald-400 border-transparent' : 'border-slate-500'
                          }`}>
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{isDone ? 'পড়া সম্পন্ন ✓' : 'সম্পন্ন করুন'}</span>
                        </button>

                        {slot.isCustom && (
                          <button
                            onClick={() => removeCustomSlot(slot.id)}
                            title="স্লট ডিলিট করুন"
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 font-anek">
                        নির্ধারিত দৈনিক সময়
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. ADD CUSTOM SLOT MODAL                                       */}
        {/* ============================================================== */}
        {showAddCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleAddCustom}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl text-xs"
            >
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-jakarta">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>নতুন পড়ার স্লট যুক্ত করুন</span>
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">বিষয় বা সাবজেক্টের নাম</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="যেমন: ইংরেজি ২য় পত্র / জীববিজ্ঞান"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">পড়ার নির্দিষ্ট টপিক বা অধ্যায়</label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="যেমন: Right forms of verbs ৩টি নিয়ম অনুশীলন"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">সময়সীমা</label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="যেমন: ০৪:০০ PM - ০৫:০০ PM"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-anek"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
                >
                  স্লট সেভ করুন
                </button>
              </div>
            </motion.form>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. STUDY ADVICE & COGNITIVE SCIENCE CARD                       */}
        {/* ============================================================== */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-950/25 via-slate-900 to-slate-900 border border-amber-500/25 flex items-start gap-3.5 shadow-md">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs leading-relaxed text-amber-200/90">
            <span className="font-bold text-amber-300 block mb-1 font-jakarta">
              SSC CANDIDATE'S SCIENTIFIC TIME-BLOCKING SECRETS:
            </span>
            ১. <strong>ভোরের স্লট (Dawn Study)</strong>: মস্তিষ্ক সতেজ থাকায় গণিত ও বিজ্ঞানের মতো গভীর মনোযোগের বিষয়ের মৌলিক ধারণা স্পষ্টকরণে (Concept Clear) ব্যবহার করুন।<br />
            ২. <strong>সন্ধ্যার স্লট (Evening Focus)</strong>: সৃজনশীল প্রশ্ন (CQ Solve) সমাধান ও টাইমিং প্র্যাকটিসের জন্য আদর্শ।<br />
            ৩. <strong>নৈশ রিভিশন (Night Mastery)</strong>: ঘুমানোর পূর্বে বহুনির্বাচনী প্রশ্ন (MCQ Solve) এবং {religionSubject.name}-এর গুরুত্বপূর্ণ পাঠ রিভিশন দিলে ঘুমে তা স্মৃতিতে স্থায়ী হয়।
          </div>
        </div>
      </motion.div>
    </div>
  );
};
