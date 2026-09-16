import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Target, Sparkles, CheckCircle2, 
  X, Clock, Award, ShieldAlert, BookOpen, 
  ArrowRight, Flame, Layers, AlertTriangle, Zap
} from 'lucide-react';
import { ExamConfigData, ExamType, ExamTypeBn } from '../types';
import { toBengaliNumber } from '../utils/progressCalculator';
import { calculateLiveCountdown } from '../utils/aiDynamicExamRoutineEngine';

interface ExamTargetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ExamConfigData) => Promise<void> | void;
  currentConfig?: ExamConfigData | null;
  totalChaptersInScope?: number;
}

interface ExamOption {
  type: ExamType;
  nameBn: ExamTypeBn;
  badgeBn: string;
  descriptionBn: string;
  defaultDate: string;
  iconBg: string;
  borderColor: string;
  tag: string;
}

const EXAM_OPTIONS: ExamOption[] = [
  {
    type: 'half_yearly',
    nameBn: 'অর্ধবার্ষিক',
    badgeBn: 'Half-Yearly Exam',
    descriptionBn: 'প্রথম পর্বের নির্বাচিত অধ্যায়সমূহ ও অর্ধবার্ষিক মূল্যায়ন',
    defaultDate: '2026-07-15',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    borderColor: 'border-emerald-500/40',
    tag: 'নবম/দশম শ্রেণি',
  },
  {
    type: 'annual',
    nameBn: 'বার্ষিক',
    badgeBn: 'Annual Exam',
    descriptionBn: 'শ্রেণি সমাপনী চূড়ান্ত বার্ষিক পরীক্ষা ও সম্পূর্ণ বই মূল্যায়ন',
    defaultDate: '2026-11-25',
    iconBg: 'bg-blue-500/20 text-blue-400',
    borderColor: 'border-blue-500/40',
    tag: 'শ্রেণি ফাইনাল',
  },
  {
    type: 'pre_test',
    nameBn: 'প্রি-টেস্ট',
    badgeBn: 'Pre-Test Exam',
    descriptionBn: 'দশম শ্রেণির প্রাক-নির্বাচনী মূল্যায়ন ও টেস্টের পূর্ণাঙ্গ প্রস্তুতি',
    defaultDate: '2027-10-15',
    iconBg: 'bg-purple-500/20 text-purple-400',
    borderColor: 'border-purple-500/40',
    tag: 'বোর্ড প্রাক-প্রস্তুতি',
  },
  {
    type: 'test',
    nameBn: 'টেস্ট',
    badgeBn: 'Test Examination',
    descriptionBn: 'বোর্ড টেস্ট/নির্বাচনী পরীক্ষা — এসএসসির চূড়ান্ত যোগ্যতা যাচাই',
    defaultDate: '2027-11-20',
    iconBg: 'bg-amber-500/20 text-amber-400',
    borderColor: 'border-amber-500/40',
    tag: 'নির্বাচনী মডেল',
  },
  {
    type: 'ssc',
    nameBn: 'এসএসসি',
    badgeBn: 'SSC Board Final 2028',
    descriptionBn: 'মাধ্যমিক স্কুল সার্টিফিকেট (এসএসসি) জাতীয় বোর্ড ফাইনাল পরীক্ষা',
    defaultDate: '2028-02-15',
    iconBg: 'bg-rose-500/20 text-rose-400',
    borderColor: 'border-rose-500/40',
    tag: 'গোল্ডেন A+ টার্গেট',
  },
];

export const ExamTargetConfigModal: React.FC<ExamTargetConfigModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentConfig,
  totalChaptersInScope = 42,
}) => {
  const [selectedType, setSelectedType] = useState<ExamType>(currentConfig?.examType || 'ssc');
  const [examDate, setExamDate] = useState<string>(
    currentConfig?.examDate || '2028-02-15'
  );
  const [targetStudyHours, setTargetStudyHours] = useState<number>(
    currentConfig?.targetStudyHours || 6.5
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentOption = EXAM_OPTIONS.find((o) => o.type === selectedType) || EXAM_OPTIONS[4];

  // Quick select exam option
  const handleSelectOption = (opt: ExamOption) => {
    setSelectedType(opt.type);
    setExamDate(opt.defaultDate);
    setErrorMsg('');
  };

  // Preview countdown calculation
  const countdown = calculateLiveCountdown(examDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDate) {
      setErrorMsg('অনুগ্রহ করে পরীক্ষার সম্ভাব্য শুরুর তারিখ নির্বাচন করুন।');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const config: ExamConfigData = {
        examType: selectedType,
        examTypeBn: currentOption.nameBn,
        examDate,
        targetStudyHours,
        totalChaptersInScope,
        isConfigured: true,
        updatedAt: new Date().toISOString(),
      };

      await onSave(config);
      onClose();
    } catch (err: any) {
      setErrorMsg('টার্গেট সংরক্ষণ করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="exam-target-config-modal"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl overflow-y-auto font-hind select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-indigo-500/30 p-5 sm:p-7 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Ambient Top Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/10">
                <Target className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-jakarta">
                    AI EXAM ENGINE
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-jakarta">
                    100% SYLLABUS FIT
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-jakarta">
                  পরীক্ষার লক্ষ্য ও এআই রুটিন কনফিগারেশন
                </h3>
                <p className="text-xs text-slate-300 font-anek">
                  আপনার পরবর্তী পরীক্ষা নির্বাচন করুন; এআই আপনার সিলেবাসের সব অধ্যায় রুটিনে ফিট করে দেবে।
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-5 pr-1 font-anek">
            {/* 1. Exam Selector Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2.5 flex items-center gap-1.5 font-jakarta">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>১. আপনার লক্ষ্য পরীক্ষা নির্বাচন করুন (Select Exam Target):</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 sm:last:col-span-2 gap-2.5">
                {EXAM_OPTIONS.map((opt) => {
                  const isSelected = selectedType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => handleSelectOption(opt)}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? `bg-indigo-950/60 ${opt.borderColor} ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/10`
                          : 'bg-slate-950/50 border-white/5 hover:border-white/20 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl ${opt.iconBg} flex items-center justify-center shrink-0 border border-white/10 font-bold text-sm font-jakarta`}>
                        {opt.nameBn[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-1.5">
                            <span>{opt.nameBn} পরীক্ষা</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-jakarta">
                            {opt.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight line-clamp-1">
                          {opt.descriptionBn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Exam Date Picker & Countdown Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5 font-jakarta">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>২. পরীক্ষা শুরুর সম্ভাব্য তারিখ:</span>
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm font-jakarta focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  তারিখ পরিবর্তনের সাথে সাথে লাইভ কাউন্টডাউন এবং পড়ার গতি স্বয়ংক্রিয়ভাবে আপডেট হবে।
                </p>
              </div>

              {/* Live Countdown Preview Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>লাইভ সময় বাকি (Live Countdown):</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${countdown.statusBadgeColor}`}>
                    {countdown.statusBadgeBn}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="block text-lg font-black text-indigo-300 font-jakarta">
                      {toBengaliNumber(countdown.daysRemaining)}
                    </span>
                    <span className="text-[10px] text-slate-400">দিন</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="block text-lg font-black text-indigo-300 font-jakarta">
                      {toBengaliNumber(countdown.hoursRemaining)}
                    </span>
                    <span className="text-[10px] text-slate-400">ঘণ্টা</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/5">
                    <span className="block text-lg font-black text-indigo-300 font-jakarta">
                      {toBengaliNumber(countdown.minutesRemaining)}
                    </span>
                    <span className="text-[10px] text-slate-400">মিনিট</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Daily Target Study Hours Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-jakarta">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>৩. দৈনিক লক্ষ্য অধ্যয়ন সময় (Target Daily Study Hours):</span>
                </label>
                <span className="text-sm font-extrabold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 font-jakarta">
                  {toBengaliNumber(targetStudyHours.toFixed(1))} ঘণ্টা / দিন
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={targetStudyHours}
                onChange={(e) => setTargetStudyHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-jakarta">
                <span>৪.০ ঘণ্টা (নরমাল)</span>
                <span>৬.৫ ঘণ্টা (প্রস্তাবিত রোল ১)</span>
                <span>১০.০ ঘণ্টা (হাইপার ক্রাঞ্চ)</span>
              </div>
            </div>

            {/* AI Fit Guarantee Notice */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-white font-jakarta">
                  স্মার্ট সিলেবাস ডিস্ট্রিবিউশন গ্যারান্টি:
                </p>
                <p className="text-[11px] text-indigo-300 leading-relaxed">
                  আপনার সিলেবাসের মোট <strong>{toBengaliNumber(totalChaptersInScope)}টি অধ্যায়</strong> পরীক্ষার বাকি <strong>{toBengaliNumber(countdown.daysRemaining)} দিনের</strong> মধ্যে স্বয়ংক্রিয়ভাবে ভাগ হয়ে যাবে। এছাড়া দুর্বল বিষয়ের জন্য অতিরিক্ত সময় বরাদ্দ থাকবে।
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer font-jakarta"
              >
                {isSaving ? (
                  <span>টার্গেট সেট হচ্ছে...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>এআই রুটিন কার্যকর করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
