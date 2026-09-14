import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Timer, Calendar, Sparkles, Target, Award, 
  CheckCircle2, Clock, Flame, ArrowRight, Edit2, ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../types';
import { LiveExamCountdownWidget } from './LiveExamCountdownWidget';

interface CountdownViewProps {
  profile: UserProfile;
  examDate: string;
  onUpdateExamDate?: (newDate: string) => void;
  onOpenAdmin?: () => void;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  profile,
  examDate,
  onUpdateExamDate,
  onOpenAdmin,
}) => {
  const [currentExamDate, setCurrentExamDate] = useState<string>(examDate || '2028-02-15');
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  const handleSaveDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateExamDate) {
      onUpdateExamDate(currentExamDate);
    }
    setIsEditingDate(false);
  };

  const milestones = [
    { title: 'প্রি-টেস্ট পরীক্ষা', date: '২০২৭ সালের আগস্ট', status: 'upcoming' },
    { title: 'টেস্ট নির্বাচনী পরীক্ষা', date: '২০২৭ সালের নভেম্বর', status: 'upcoming' },
    { title: 'এসএসসি ফরম ফিলাপ', date: '২০২৭ সালের ডিসেম্বর', status: 'upcoming' },
    { title: 'এসএসসি বোর্ড পরীক্ষা', date: new Date(currentExamDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }), status: 'final' },
  ];

  return (
    <div className="relative w-full text-slate-100 font-hind space-y-6">
      {/* 1. Live Exam Countdown Timer Widget with Glowing Pulsing Indicators */}
      <LiveExamCountdownWidget
        examDate={currentExamDate}
        sscBatch={profile.sscBatch}
        variant="hero"
      />

      {/* 2. Target Date Settings & Roadmap */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>টার্গেট পরীক্ষার তারিখ কাস্টমাইজেশন</span>
            </h3>
            <p className="text-xs text-slate-400 font-anek mt-0.5">
              বর্তমান নির্ধারিত তারিখ: {new Date(currentExamDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-purple-400" />
              <span>তারিখ পরিবর্তন করুন</span>
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>সিস্টেম কন্ট্রোল</span>
              </button>
            )}
          </div>
        </div>

        {/* Edit Date Form */}
        {isEditingDate && (
          <form onSubmit={handleSaveDate} className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">টার্গেট পরীক্ষার তারিখ:</label>
            <input
              type="date"
              value={currentExamDate}
              onChange={(e) => setCurrentExamDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 font-anek"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              সংরক্ষণ
            </button>
            <button
              type="button"
              onClick={() => setIsEditingDate(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs transition-all cursor-pointer"
            >
              বাতিল
            </button>
          </form>
        )}

        {/* Target Milestone Tracker */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-jakarta">
              SSC PREPARATION ROADMAP & MILESTONES
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  m.status === 'final'
                    ? 'bg-purple-950/30 border-purple-500/40'
                    : 'bg-slate-900/60 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-anek">
                    ধাপ {idx + 1}
                  </span>
                  {m.status === 'final' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-anek">
                      চূড়ান্ত
                    </span>
                  )}
                </div>
                <h5 className="text-sm font-bold text-white mb-1">{m.title}</h5>
                <p className="text-xs text-slate-400 font-anek">{m.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-800/60 to-indigo-950/40 border border-purple-500/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-jakarta">
              TARGET: {profile.targetGrade || 'GPA 5.00 (Golden A+)'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              "প্রতিদিনের ছোট ছোট পড়াশোনা ও রিভিশনই পরীক্ষার দিন আত্মবিশ্বাস এনে দেবে। রুটিন মেনে নিয়ম করে পড়ালেখা চালিয়ে যান।"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
