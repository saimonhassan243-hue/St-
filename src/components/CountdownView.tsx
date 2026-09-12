/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Flame, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';
import { ExamCountdownWidget } from './ExamCountdownWidget';

interface CountdownViewProps {
  profile: UserProfile;
  examDate: string;
  onUpdateExamDate?: (newDate: string) => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  profile,
  examDate,
  onUpdateExamDate,
}) => {
  const targetDateFormatted = new Date(examDate || '2028-02-15T09:00:00').toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const milestones = [
    { title: 'প্রি-টেস্ট পরীক্ষা', date: '২০২৭ সালের আগস্ট', status: 'upcoming', desc: 'অর্ধেক সিলেবাসের ওপর প্রস্তুতি মূল্যায়ন' },
    { title: 'টেস্ট (নির্বাচনী) পরীক্ষা', date: '২০২৭ সালের নভেম্বর', status: 'upcoming', desc: 'সম্পূর্ণ বোর্ড পাঠ্যক্রমের ওপর চূড়ান্ত মডেল টেস্ট' },
    { title: 'এসএসসি ফরম ফিলাপ', date: '২০২৭ সালের ডিসেম্বর', status: 'upcoming', desc: 'বোর্ড রেজিস্ট্রেশন ও রোল নিশ্চিতকরণ' },
    { title: 'এসএসসি বোর্ড পরীক্ষা ২০২৮', date: targetDateFormatted, status: 'final', desc: 'জাতীয় শিক্ষাবোর্ডের মূল এসএসসি পরীক্ষা' },
  ];

  return (
    <div id="countdown-view-container" className="space-y-6 text-slate-100 font-hind">
      
      {/* 1. LIVE EXAM COUNTDOWN TIMER WIDGET (GLASSMORPHIC WITH PULSING INDICATOR) */}
      <ExamCountdownWidget
        targetDate={examDate || '2028-02-15T09:00:00'}
        batchLabel={profile.sscBatch || 'SSC 2028'}
        onUpdateTargetDate={onUpdateExamDate}
        variant="hero"
      />

      {/* 2. TARGET MILESTONE ROADMAP */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-jakarta">
                SSC 2028 PREPARATION ROADMAP & MILESTONES
              </h3>
              <p className="text-xs text-slate-400">
                পরীক্ষার পূর্ববর্তী গুরুত্বপূর্ণ স্তর ও সময়সীমার তালিকা
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-anek">
            টার্গেট: {profile.targetGrade || 'Golden GPA 5.00'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {milestones.map((m, idx) => {
            const isFinal = m.status === 'final';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isFinal
                    ? 'bg-gradient-to-b from-purple-950/50 to-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/30'
                    : 'bg-slate-950/60 border-white/5 hover:border-white/15 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-anek ${
                    isFinal ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    ধাপ {idx + 1}
                  </span>
                  {isFinal ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      চূড়ান্ত পরীক্ষা
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      আসন্ন
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
                <p className="text-xs text-indigo-300 font-anek font-semibold mb-1.5">{m.date}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 3. DAILY STRATEGY & MOTIVATION BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900/90 to-indigo-950/50 border border-purple-500/25 flex flex-col sm:flex-row items-center gap-4 shadow-xl backdrop-blur-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
          <Flame className="w-6 h-6 text-amber-400" />
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
            <h4 className="text-sm font-bold text-white font-jakarta">
              প্রতিদিনের সফল রিভিশন ফর্মুলা: ৪+২ ঘণ্টা
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              অনুশীলন নির্দেশিকা
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-hind">
            &quot;নিয়মিত মূল বই রিডিং + টেস্ট পেপারের সৃজনশীল ও MCQ সমাধান করলে এসএসসি ২০২৮ পরীক্ষায় গোল্ডেন এ+ অর্জন নিশ্চিত। প্রতিদিনের লাইভ কাউন্টডাউন আপনাকে সময়ের সঠিক মূল্য মনে করিয়ে দেবে।&quot;
          </p>
        </div>
      </div>

    </div>
  );
};
