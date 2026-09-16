/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  X, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  BookOpen, 
  Save, 
  Flame, 
  HelpCircle,
  Award
} from 'lucide-react';
import { toBengaliNumber } from '../utils/progressCalculator';

interface ActiveRecallTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle?: string;
  subjectName?: string;
  onSaveRecallResult?: (notes: string, qualityRating: 'perfect' | 'moderate' | 'weak') => void;
}

const RECALL_DURATION_SECONDS = 300; // 5 Minutes

export const ActiveRecallTimerModal: React.FC<ActiveRecallTimerModalProps> = ({
  isOpen,
  onClose,
  chapterTitle = 'পঠিত অধ্যায়',
  subjectName = 'বিষয়',
  onSaveRecallResult,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(RECALL_DURATION_SECONDS);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [recallText, setRecallText] = useState<string>('');
  const [qualityRating, setQualityRating] = useState<'perfect' | 'moderate' | 'weak' | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Timer Effect
  useEffect(() => {
    if (!isOpen || !isActive || isCompleted) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isActive, isCompleted]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(RECALL_DURATION_SECONDS);
      setIsActive(true);
      setIsCompleted(false);
      setQualityRating(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((RECALL_DURATION_SECONDS - secondsLeft) / RECALL_DURATION_SECONDS) * 100;

  const handleSave = () => {
    if (onSaveRecallResult && qualityRating) {
      onSaveRecallResult(recallText, qualityRating);
    }
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050811]/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#0b1021] border border-purple-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl shadow-purple-500/10 overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-jakarta">
                  ৫ মিনিট অ্যাক্টিভ রিকল মোড
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                  MEMORY LOCK
                </span>
              </div>
              <p className="text-xs text-slate-400 font-anek">
                {subjectName} • {chapterTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Pulsating Timer Clock Centerpiece */}
          <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-slate-950/60 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-purple-600/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-wider flex items-center gap-1 drop-shadow-md">
                <span className="text-purple-300">{toBengaliNumber(String(minutes).padStart(2, '0'))}</span>
                <span className="text-slate-500 animate-pulse">:</span>
                <span className="text-cyan-300">{toBengaliNumber(String(seconds).padStart(2, '0'))}</span>
              </div>

              <span className="text-xs font-anek text-slate-400 mt-2 font-medium">
                বই বা নোট না দেখে মস্তিষ্কে মেমোরি রিকল করার সময়
              </span>

              {/* Controls */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setIsActive((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 text-xs font-bold font-anek transition-colors"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>বিরতি দিন</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      <span>চালু করুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSecondsLeft(RECALL_DURATION_SECONDS);
                    setIsCompleted(false);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10"
                  title="টাইমার রিসেট"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-5">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Guided Recall Prompts */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/25 space-y-2 font-anek text-xs">
            <h4 className="font-bold text-purple-300 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>রিকল নির্দেশিকা (নিচের ৩টি বিষয় মনে করার চেষ্টা করুন):</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300 pl-4 list-disc marker:text-purple-400">
              <li>১. এই অধ্যায়ের প্রধান ৩টি সূত্র, সমীকরণ বা গুরুত্বপূর্ণ সাল/ঘটনা কী?</li>
              <li>২. মূল ২টি বৈজ্ঞানিক সংজ্ঞা বা ব্যাকরণগত নিয়ম নিজের ভাষায় লিখুন।</li>
              <li>৩. পরীক্ষায় আসার মতো ১টি সম্ভাব্য সৃজনশীল (CQ) প্যাটার্ন চিন্তা করুন।</li>
            </ul>
          </div>

          {/* Scratchpad Textarea */}
          <div className="space-y-1.5 font-anek">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>আপনার ব্রেনস্টর্মিং ও রিকল নোটস (ঐচ্ছিক):</span>
              <span className="text-[11px] text-slate-500 font-normal">অধ্যায় নোটে সংরক্ষিত হবে</span>
            </label>
            <textarea
              value={recallText}
              onChange={(e) => setRecallText(e.target.value)}
              placeholder="বই না দেখে যা যা মনে পড়েছে এখানে সংক্ষেপে লিখুন..."
              rows={4}
              className="w-full p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-hind"
            />
          </div>

          {/* Self-Assessment Quality Rating */}
          <div className="space-y-2 font-anek">
            <span className="text-xs font-bold text-slate-300 block">
              রিকল অভিজ্ঞতা কেমন ছিল? (স্মরণ করার নির্ভুলতা):
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQualityRating('perfect')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                  qualityRating === 'perfect'
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-500/10 scale-102'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-emerald-500/30'
                }`}
              >
                <span className="text-base block mb-1">🎯</span>
                <span>সহজেই মনে পড়েছে</span>
                <span className="text-[10px] text-emerald-400 block font-normal">(১০০% ক্লিয়ার)</span>
              </button>

              <button
                type="button"
                onClick={() => setQualityRating('moderate')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                  qualityRating === 'moderate'
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-102'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-amber-500/30'
                }`}
              >
                <span className="text-base block mb-1">🤔</span>
                <span>কিছুটা অস্পষ্ট</span>
                <span className="text-[10px] text-amber-400 block font-normal">(৭০% ক্লিয়ার)</span>
              </button>

              <button
                type="button"
                onClick={() => setQualityRating('weak')}
                className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                  qualityRating === 'weak'
                    ? 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-lg shadow-rose-500/10 scale-102'
                    : 'bg-slate-900/80 text-slate-400 border-white/5 hover:border-rose-500/30'
                }`}
              >
                <span className="text-base block mb-1">⚠️</span>
                <span>ভুলে গেছি</span>
                <span className="text-[10px] text-rose-400 block font-normal">(রিভিশন আবশ্যক)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between gap-3 font-anek">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            বন্ধ করুন
          </button>

          <button
            onClick={handleSave}
            disabled={!qualityRating || savedSuccess}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>মেমোরি লক সম্পন্ন!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>লক ও সেভ করুন (+৫০ XP)</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
