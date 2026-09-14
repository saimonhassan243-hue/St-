/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  X, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Layers, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  Zap, 
  CheckSquare, 
  Square,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { 
  TOP_10_CRITICAL_FORMULAS, 
  HIGH_YIELD_CQ_PATTERNS, 
  FIFTY_ESSENTIAL_MCQS, 
  EXAM_DAY_EQUIPMENT_CHECKLIST,
  EquipmentChecklistItem
} from '../data/examEveData';

interface ExamEveRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  examDate?: string;
  studentName?: string;
}

type EveSection = 'formulas' | 'cq_patterns' | 'fifty_mcqs' | 'equipment_checklist' | 'strategy';

const STORAGE_KEY_EQUIPMENT = 'ssc_exam_equipment_checklist_v1';

export const ExamEveRevisionModal: React.FC<ExamEveRevisionModalProps> = ({
  isOpen,
  onClose,
  examDate,
  studentName = 'শিক্ষার্থী',
}) => {
  const [activeSection, setActiveSection] = useState<EveSection>('formulas');
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);

  // Equipment Checklist State from localStorage
  const [checkedEquipment, setCheckedEquipment] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EQUIPMENT);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleEquipment = (id: string) => {
    setCheckedEquipment(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_EQUIPMENT, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleCopyFormula = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormulaId(id);
    setTimeout(() => setCopiedFormulaId(null), 2000);
  };

  const totalEquipment = EXAM_DAY_EQUIPMENT_CHECKLIST.length;
  const checkedCount = Object.values(checkedEquipment).filter(Boolean).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#050811]/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-[#0b1021] border border-amber-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl shadow-amber-500/5 overflow-hidden text-slate-100"
      >
        {/* Top Dark Neon Glow Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-anek flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  পরীক্ষার আগের রাত স্পেশাল রিভিশন মোড
                </span>
                <span className="text-xs text-slate-400 font-anek hidden md:inline-block">
                  Night-Before-Exam Mode
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white font-jakarta mt-0.5">
                টপ ১০ সূত্র, ৫টি CQ প্যাটার্ন ও ৫০টি গোল্ডেন MCQ
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-950/80 px-4 py-2 border-b border-white/10 overflow-x-auto no-scrollbar flex items-center gap-2">
          {[
            { id: 'formulas' as EveSection, label: '⚡ টপ ১০ সূত্র শীট', icon: Zap },
            { id: 'cq_patterns' as EveSection, label: '✍️ ৫টি ১০০% CQ প্যাটার্ন', icon: FileText },
            { id: 'fifty_mcqs' as EveSection, label: '🔘 ৫০টি গোল্ডেন MCQ', icon: HelpCircle },
            { id: 'equipment_checklist' as EveSection, label: `🎒 পরীক্ষার দিনের ব্যাগ (${checkedCount}/${totalEquipment})`, icon: CheckSquare },
            { id: 'strategy' as EveSection, label: '⏱️ ৩ ঘণ্টার হল টাইম ম্যানেজমেন্ট', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold font-anek flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-b from-[#0b1021] via-slate-950 to-[#0b1021]">
          {/* 1. TOP 10 FORMULAS */}
          {activeSection === 'formulas' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-anek flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  পরীক্ষার আগের রাতে নতুন কোনো টপিক না পড়ে শুধু এই অপরিহার্য সূত্রগুলো চোখ বুলিয়ে নিন।
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TOP_10_CRITICAL_FORMULAS.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/25 hover:border-amber-400/50 transition-all space-y-2.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-anek">
                        {item.subject} • #{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {item.boardPriority}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white font-jakarta">{item.title}</h4>

                    {/* Formula Pill with Copy */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300">
                        {item.formula}
                      </span>
                      <button
                        onClick={() => handleCopyFormula(item.formula, item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="সূত্র কপি করুন"
                      >
                        {copiedFormulaId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 font-anek">
                      <span className="text-slate-400">প্রতীক পরিচয়: </span>
                      {item.variables}
                    </p>

                    <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-indigo-200 font-anek">
                      💡 <strong>বোর্ড ট্রিক:</strong> {item.examApplicationTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HIGH YIELD CQ PATTERNS */}
          {activeSection === 'cq_patterns' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 font-anek flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  বোর্ড পরীক্ষার সার্বজনীন ৫টি সৃজনশীল প্রশ্ন ও খাতার ধাপে ধাপে সমাধান ব্লুপ্রিন্ট।
                </span>
              </div>

              <div className="space-y-4">
                {HIGH_YIELD_CQ_PATTERNS.map((pat, idx) => (
                  <div
                    key={pat.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 transition-all space-y-3.5 shadow-xl"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-anek">
                          {pat.subject} ({pat.chapter})
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-anek">
                          ★ {pat.marksGuarantee}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">প্যাটার্ন #{idx + 1}</span>
                    </div>

                    <h4 className="text-base font-bold text-white font-jakarta">
                      {pat.patternTitle}
                    </h4>

                    {/* Stem Sample */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 text-xs text-slate-200 font-hind">
                      <span className="text-purple-400 font-bold block mb-1">নমুনা উদ্দীপক:</span>
                      {pat.stemSample}
                    </div>

                    {/* Step by Step Solution */}
                    <div className="space-y-1.5 font-anek">
                      <span className="text-xs font-bold text-slate-300">খাতায় লেখার ধারাবাহিক ধাপসমূহ:</span>
                      <div className="space-y-1 pl-1">
                        {pat.stepByStepSolution.map((step, sIdx) => (
                          <div key={sIdx} className="p-2 rounded-xl bg-slate-950/50 border border-white/5 text-xs text-slate-200">
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pitfall to avoid */}
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 font-anek flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>কমন ভুল এড়ান:</strong> {pat.commonPitfallsToAvoid}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 50 ESSENTIAL MCQS */}
          {activeSection === 'fifty_mcqs' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 font-anek flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  সর্বাধিক রিপিট হওয়া ৫০টি বোর্ড এমসিকিউ ও কুইক মেমরি পয়েন্ট (এক পলকে রিভিশন)।
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FIFTY_ESSENTIAL_MCQS.map((mcq, idx) => (
                  <div
                    key={mcq.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 hover:border-teal-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-anek">
                      <span className="font-bold text-teal-300">{mcq.subject}</span>
                      <span className="font-mono">#{idx + 1}</span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-bold text-white font-hind leading-snug">
                      {mcq.question}
                    </h5>

                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-bold font-anek flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>উত্তর: {mcq.correctAnswer}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-anek">
                      📌 <span className="text-slate-300">স্মারক নোট:</span> {mcq.quickNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EQUIPMENT CHECKLIST */}
          {activeSection === 'equipment_checklist' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white font-jakarta">
                    পরীক্ষার হলের ব্যাগ প্রস্তুতি প্রগ্রেস
                  </h4>
                  <p className="text-xs text-slate-400 font-anek mt-0.5">
                    আইটেমগুলোতে টিক দিয়ে নিশ্চিত করুন কোনো প্রয়োজনীয় জিনিস যেন ভুলে বাদ না পড়ে
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-amber-400 font-jakarta">
                    {checkedCount} / {totalEquipment}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {checkedCount === totalEquipment ? 'সব রেডি ✓' : 'চেক করুন'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {EXAM_DAY_EQUIPMENT_CHECKLIST.map((item) => {
                  const isChecked = !!checkedEquipment[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleEquipment(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-white shadow-sm'
                          : 'bg-slate-900/90 border-white/10 hover:border-slate-600 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          className="mt-0.5 text-amber-400 shrink-0"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className={`text-xs sm:text-sm font-bold font-anek ${
                              isChecked ? 'text-emerald-200 line-through' : 'text-white'
                            }`}>
                              {item.title}
                            </h5>
                            {item.required && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 uppercase">
                                আবশ্যক
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-anek">{item.notes}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. 3-HOUR EXAM HALL STRATEGY */}
          {activeSection === 'strategy' && (
            <div className="space-y-5 font-anek">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>এসএসসি বোর্ড ৩ ঘণ্টার আদর্শ সময় বণ্টন ছক</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  পরীক্ষার হলে অতিরিক্ত টেনশন পরিহার করে সময় অনুযায়ী নিখুঁত উত্তর সম্পন্নের বৈজ্ঞানিক ফর্মুলা।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-center">
                  <span className="text-xs font-bold text-amber-400">১ম ৩০ মিনিট</span>
                  <h5 className="text-base font-extrabold text-white font-jakarta">MCQ ৩০টি প্রশ্ন</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ১ম রাউন্ডে নিশ্চিত প্রশ্নগুলো ১৫ মিনিটে ভরাট করুন। ২য় রাউন্ডে গাণিতিক অঙ্কগুলো ঠান্ডা মাথায় সমাধান করুন।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-center">
                  <span className="text-xs font-bold text-emerald-400">পরবর্তী ২ ঘণ্টা ২৫ মিনিট</span>
                  <h5 className="text-base font-extrabold text-white font-jakarta">৭টি CQ প্রশ্ন</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    প্রতিটি সৃজনশীলের জন্য বরাদ্দ ঠিক <strong>২১ মিনিট</strong> (ক-১ মি, খ-৩ মি, গ-৮ মি, ঘ-৯ মি)।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-2 text-center">
                  <span className="text-xs font-bold text-purple-400">শেষ ৫ মিনিট</span>
                  <h5 className="text-base font-extrabold text-white font-jakarta">রোল, মার্জিন ও খাতা রিভিশন</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ওএমআর শিটের রোল, রেজিস্ট্রেশন ও বিষয় কোডের বৃত্ত ভরাট এবং অতিরিক্ত লুজ শিটের নম্বর ঠিক আছে কিনা রিচেক করুন।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between text-xs text-slate-400 font-anek">
          <span>🌙 আজ রাতে পর্যাপ্ত ঘুম নিশ্চিত করুন (অন্তত ৬-৭ ঘণ্টা)</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs font-anek cursor-pointer shadow-lg shadow-amber-500/20"
          >
            ধন্যবাদ, প্রস্তুত আছি ✓
          </button>
        </div>
      </motion.div>
    </div>
  );
};
