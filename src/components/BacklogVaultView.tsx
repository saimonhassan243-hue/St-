import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Zap, 
  Flame, 
  ShieldAlert, 
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BacklogItem, Subject, ChapterProgressData } from '../types';

interface BacklogVaultViewProps {
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  onTriggerDidNotStudyToday: () => void;
  onNavigateToRoutine: () => void;
  onNavigateToSyllabus: () => void;
  onOpenRecoveryModal: () => void;
}

const STORAGE_KEY_BACKLOG = 'ssc_backlog_vault_items_v1';

export const BacklogVaultView: React.FC<BacklogVaultViewProps> = ({
  subjects,
  chapterProgress,
  onTriggerDidNotStudyToday,
  onNavigateToRoutine,
  onNavigateToSyllabus,
  onOpenRecoveryModal,
}) => {
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BACKLOG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Backlog load note:', e);
    }
    // Default initial seeded backlog for immediate demonstration
    return [
      {
        id: 'backlog_phy_force',
        subjectId: 'phy',
        subjectName: 'পদার্থবিজ্ঞান',
        chapterId: 'ch_phy_3',
        chapterName: '৩য় অধ্যায়: বল (Force)',
        missedDate: '২০২৬-০৯-১৫',
        priority: 'CRITICAL',
        estimatedMinutes: 90,
        reason: 'স্কুল ল্যাব প্র্যাকটিক্যাল ও অতিরিক্ত ক্লান্তির কারণে পড়া হয়নি',
        isRecovered: false,
      },
      {
        id: 'backlog_chem_periodic',
        subjectId: 'chem',
        subjectName: 'রসায়ন',
        chapterId: 'ch_chem_4',
        chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি',
        missedDate: '২০২৬-০৯-১৬',
        priority: 'HIGH',
        estimatedMinutes: 60,
        reason: 'কোচিং টেস্টের কারণে স্কিপ হয়েছিল',
        isRecovered: false,
      },
    ];
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'RECOVERED'>('PENDING');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BACKLOG, JSON.stringify(backlogItems));
    } catch (e) {
      console.warn('Backlog save note:', e);
    }
  }, [backlogItems]);

  const handleToggleRecovered = (id: string) => {
    setBacklogItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRecovered: !item.isRecovered,
              recoveredAt: !item.isRecovered ? new Date().toISOString() : undefined,
            }
          : item
      )
    );
  };

  const handleManualAddTodaySkip = () => {
    onTriggerDidNotStudyToday();
    // Also create dynamic backlog entry
    const newItems: BacklogItem[] = [
      {
        id: `backlog_${Date.now()}_1`,
        subjectId: 'math',
        subjectName: 'উচ্চতর গণিত / সাধারণ গণিত',
        chapterId: 'ch_math_today',
        chapterName: 'দৈনিক নির্ধারিত পেন্ডিং টপিক',
        missedDate: new Date().toLocaleDateString('bn-BD'),
        priority: 'HIGH',
        estimatedMinutes: 75,
        reason: 'আজকের নির্ধারিত সময় স্কিপ হয়েছে (Smart Re-scheduler Active)',
        isRecovered: false,
        rescheduledDate: 'আগামী ছুটির দিন (শুক্রবার)',
        rescheduledSlot: 'সকাল ০৭:০০ - ০৮:১৫',
      },
    ];
    setBacklogItems((prev) => [...newItems, ...prev]);
  };

  const pendingCount = backlogItems.filter((i) => !i.isRecovered).length;
  const recoveredCount = backlogItems.filter((i) => i.isRecovered).length;
  const totalBacklogMinutes = backlogItems
    .filter((i) => !i.isRecovered)
    .reduce((acc, curr) => acc + curr.estimatedMinutes, 0);

  const filteredItems = backlogItems.filter((item) => {
    if (activeFilter === 'PENDING') return !item.isRecovered;
    if (activeFilter === 'RECOVERED') return item.isRecovered;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Cyber Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-950 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI BACKLOG RECOVERY VAULT v4.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>স্মার্ট ব্যাকলগ ভল্ট ও অটো-রিকভারি</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              যেকোনো কারণে পড়াশোনায় ঘাটতি হলে স্ট্রেস নেওয়ার দরকার নেই। আমাদের অটোমেটিক রিকভারি ইঞ্জিন আপনার মিস হওয়া টপিকগুলোকে ছুটির দিনগুলোতে বুদ্ধিমত্তার সাথে রি-শিডিউল করে দেবে।
            </p>
          </div>

          {/* Quick Action Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleManualAddTodaySkip}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-600/90 to-amber-600/90 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 border border-rose-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>আজ পড়তে পারিনি (1-Click)</span>
            </button>

            <button
              onClick={onOpenRecoveryModal}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 border border-cyan-300/50 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>স্মার্ট রি-ব্যালান্স শিডিউল</span>
            </button>
          </div>
        </div>

        {/* Backlog Quick Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Archive className="w-3.5 h-3.5 text-rose-400" />
              <span>পেন্ডিং ব্যাকলগ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">
              {pendingCount} <span className="text-xs font-normal text-slate-400">টি বিষয়</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>মোট মিস হওয়া সময়</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              {(totalBacklogMinutes / 60).toFixed(1)} <span className="text-xs font-normal text-slate-400">ঘণ্টা</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>রিকভার্ড সম্পন্ন</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {recoveredCount} <span className="text-xs font-normal text-slate-400">টি অধ্যায়</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>স্ট্রেস ইনডেক্স</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">
              {pendingCount === 0 ? '০% (নিরাপদ)' : `${Math.min(pendingCount * 12, 100)}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'PENDING'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            পেন্ডিং ভল্ট ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('RECOVERED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'RECOVERED'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            রিকভার্ড ({recoveredCount})
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            সবগুলো ({backlogItems.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToRoutine}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>সাপ্তাহিক রুটিনে যান</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Backlog List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900/40 border border-white/10 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-2xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">কোনো ব্যাকলগ বাকি নেই!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              আপনার সমস্ত পড়াশোনার টাস্ক আপ-টু-ডেট রয়েছে। আপনার সিলেবাস ও মক টেস্ট প্র্যাকটিস চালিয়ে যান।
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isDone = item.isRecovered;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-slate-900/40 border-emerald-500/30 opacity-70'
                    : item.priority === 'CRITICAL'
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/80 border-cyan-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-cyan-400 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        {item.subjectName}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          item.priority === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.estimatedMinutes} মিনিট
                      </span>
                      {item.missedDate && (
                        <span className="text-xs text-slate-400">
                          (মিসড: {item.missedDate})
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white">{item.chapterName}</h4>

                    {item.reason && (
                      <p className="text-xs text-slate-400 italic">
                        কারণ: {item.reason}
                      </p>
                    )}

                    {item.rescheduledDate && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-medium px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-500/20">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>প্রস্তাবিত রি-শিডিউল: {item.rescheduledDate} ({item.rescheduledSlot || 'সকাল'})</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleRecovered(item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 font-black'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isDone ? 'রিকভার্ড সম্পন্ন ✓' : 'রিকভার মার্ক করুন'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
