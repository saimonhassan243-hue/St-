import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Timer, Calendar, Sparkles, Target, Award, 
  CheckCircle2, Clock, Flame, ArrowRight, Edit2
} from 'lucide-react';
import { UserProfile } from '../types';

interface CountdownViewProps {
  profile: UserProfile;
  examDate: string;
  onUpdateExamDate?: (newDate: string) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  profile,
  examDate,
  onUpdateExamDate,
}) => {
  const [currentExamDate, setCurrentExamDate] = useState<string>(examDate || '2028-02-15');
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);

  const calculateTimeLeft = (target: string): TimeLeft => {
    const difference = +new Date(target) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(currentExamDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentExamDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentExamDate]);

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
    <div className="relative w-full text-slate-100 font-hind">
      {/* Ambient glowing backdrops */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide font-jakarta">
                  SSC EXAM COUNTDOWN
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-anek">
                  {profile.sscBatch}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                বোর্ড পরীক্ষার চূড়ান্ত প্রস্তুতি এবং সময় গণনা টাইমার
              </p>
            </div>
          </div>

          {/* Edit Target Date Button */}
          <button
            onClick={() => setIsEditingDate(!isEditingDate)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all self-start md:self-auto"
          >
            <Edit2 className="w-3.5 h-3.5 text-purple-400" />
            <span>তারিখ পরিবর্তন করুন</span>
          </button>
        </div>

        {/* Edit Date Form */}
        {isEditingDate && (
          <form onSubmit={handleSaveDate} className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-purple-500/30 flex flex-wrap items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">টার্গেট পরীক্ষার তারিখ:</label>
            <input
              type="date"
              value={currentExamDate}
              onChange={(e) => setCurrentExamDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              সংরক্ষণ
            </button>
            <button
              type="button"
              onClick={() => setIsEditingDate(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-xs"
            >
              বাতিল
            </button>
          </form>
        )}

        {/* Live Countdown Clocks */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'দিন (Days)', value: timeLeft.days, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', text: 'text-purple-300' },
            { label: 'ঘণ্টা (Hours)', value: timeLeft.hours, color: 'from-indigo-500/20 to-indigo-600/5', border: 'border-indigo-500/30', text: 'text-indigo-300' },
            { label: 'মিনিট (Minutes)', value: timeLeft.minutes, color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/30', text: 'text-cyan-300' },
            { label: 'সেকেন্ড (Seconds)', value: timeLeft.seconds, color: 'from-pink-500/20 to-pink-600/5', border: 'border-pink-500/30', text: 'text-pink-300' },
          ].map((block, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-6 rounded-3xl bg-gradient-to-b ${block.color} border ${block.border} text-center shadow-lg backdrop-blur-md`}
            >
              <div className={`text-3xl sm:text-5xl font-black font-anek ${block.text} tracking-tight`}>
                {String(block.value).padStart(2, '০')}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-2">
                {block.label}
              </div>
            </div>
          ))}
        </div>

        {/* Target Milestone Tracker */}
        <div className="mt-10 p-6 rounded-3xl bg-slate-800/40 border border-white/5">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-jakarta">
              SSC PREPARATION ROADMAP & MILESTONES
            </h3>
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      চূড়ান্ত
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
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
              "প্রতিদিনের ছোট ছোট পড়াশোনা ও রিভিশনই পরীক্ষার দিন আত্মবিশ্বাস এনে দেবে। নিজের ধর্মাচরণ ও পড়ালেখা দুটোই নিয়মানুবর্তিতার অংশ।"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
