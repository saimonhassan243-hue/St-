/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Flame, 
  BookOpen,
  Award
} from 'lucide-react';
import { DetailedTopicBreakdown } from '../data/priorityDetailedBreakdowns';

interface CrucialTopicBreakdownCardProps {
  data: DetailedTopicBreakdown;
  isMastered: boolean;
  onToggle: () => void;
  defaultExpanded?: boolean;
}

export const CrucialTopicBreakdownCard: React.FC<CrucialTopicBreakdownCardProps> = ({
  data,
  isMastered,
  onToggle,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      id={`crucial-topic-${data.id}`}
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        isMastered 
          ? 'bg-emerald-950/20 border-emerald-500/30 shadow-lg shadow-emerald-950/20' 
          : 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/50 shadow-xl'
      }`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-anek">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {data.priority} {data.priorityLabel}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 font-anek">
                <Flame className="w-3 h-3" />
                {data.tag}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {data.chapter}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug flex items-center gap-2">
              <span className="text-amber-400 font-jakarta">{data.subjectName}:</span>
              <span>{data.topicTitle}</span>
            </h3>

            {/* Overview */}
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {data.overview}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
            <button
              type="button"
              id={`btn-toggle-mastered-${data.id}`}
              onClick={onToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isMastered 
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
              }`}
            >
              {isMastered ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>প্রস্তুতি সম্পন্ন ✓</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-amber-400" />
                  <span>সম্পন্ন চিহ্নিত করুন</span>
                </>
              )}
            </button>

            <button
              type="button"
              id={`btn-expand-${data.id}`}
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Toggle details"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick formulas strip when collapsed */}
        {!isExpanded && data.formulas.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-amber-400/90 shrink-0 font-jakarta">মূল সূত্রাবলি:</span>
            {data.formulas.slice(0, 3).map((f, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-amber-200 font-mono text-[11px] border border-amber-500/20 whitespace-nowrap shadow-xs"
              >
                {f.formula}
              </span>
            ))}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-[11px] text-slate-400 hover:text-amber-300 ml-auto shrink-0 underline cursor-pointer"
            >
              বিস্তারিত বিশ্লেষণ ও CQ দেখুন →
            </button>
          </div>
        )}
      </div>

      {/* Expanded Details Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/10 bg-slate-950/60 p-4 sm:p-6 space-y-5"
          >
            {/* 1. Mathematical Formulas & Notations */}
            {data.formulas.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5 font-jakarta">
                  <Sparkles className="w-3.5 h-3.5" />
                  গাণিতিক সূত্র ও সূত্রের প্রায়োগিক ব্যাখ্যা (FORMULAS & NOTATION)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.formulas.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-1.5 shadow-md"
                    >
                      <div className="text-[11px] font-semibold text-slate-400">
                        {item.name}
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 font-mono text-sm sm:text-base font-bold tracking-wide">
                        {item.formula}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Core Concepts / Breakdown Points */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase flex items-center gap-1.5 font-jakarta">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                গুরুত্বপূর্ণ মূল ধারণা ও কনসেপ্ট ক্লিয়ারিং (KEY EXAM CONCEPTS)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.breakdownPoints.map((point, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CQ Question Pattern & High-Yield Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide font-jakarta">
                    সৃজনশীল ‘গ’ প্রয়োগমূলক প্যাটার্ন (৩ নম্বর)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200">
                    CQ ৩ নম্বর
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-hind">
                  {data.cqPattern.gQuestion}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-jakarta">
                    সৃজনশীল ‘ঘ’ উচ্চতর দক্ষতামূলক প্যাটার্ন (৪ নম্বর)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200">
                    CQ ৪ নম্বর
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-hind">
                  {data.cqPattern.ghQuestion}
                </p>
              </div>
            </div>

            {/* 4. MCQ Highlights & Board Frequency */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 font-jakarta">
                  <Award className="w-3.5 h-3.5 text-amber-400" /> বিগত বোর্ড পরীক্ষায় পুনরাবৃত্তি:
                </div>
                <div className="text-slate-300 font-medium font-anek">
                  {data.boardExamRepeats}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
                >
                  সংক্ষিপ্ত করুন ↑
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
