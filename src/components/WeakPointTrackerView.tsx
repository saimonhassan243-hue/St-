import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  Search, 
  Filter, 
  RotateCcw, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  Flame,
  Check,
  StickyNote,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Zap,
  Target
} from 'lucide-react';
import { Subject, ChapterWeakPointData, WeakPointStatus } from '../types';
import { getTopicsForChapter, PredefinedTopic } from '../data/chapterWeakPointTopics';
import { toBengaliNumber } from '../utils/progressCalculator';

const STORAGE_KEY_WEAK_POINTS = 'ssc_student_weak_points_v2';

interface WeakPointTrackerViewProps {
  subjects: Subject[];
  customSelectedChapterIds?: string[];
  onNavigateToRoutine?: () => void;
  onNavigateToSyllabus?: (subjectId: string, chapterId: string) => void;
}

export const WeakPointTrackerView: React.FC<WeakPointTrackerViewProps> = ({
  subjects,
  customSelectedChapterIds,
  onNavigateToRoutine,
  onNavigateToSyllabus,
}) => {
  // 1. Weak points persistent state (chapterId -> ChapterWeakPointData)
  const [weakPointsMap, setWeakPointsMap] = useState<Record<string, ChapterWeakPointData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEAK_POINTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  // UI state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'struggling' | 'needs_revision' | 'mastered'>('all');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Record<string, boolean>>({});
  
  // Custom weak point input state per chapter
  const [customInputMap, setCustomInputMap] = useState<Record<string, string>>({});
  const [activeNotesChapterId, setActiveNotesChapterId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WEAK_POINTS, JSON.stringify(weakPointsMap));
    } catch (e) {
      console.warn('Failed to save weak points to localStorage:', e);
    }
  }, [weakPointsMap]);

  // STRICT FILTERING: Strictly load ONLY chapters included in customSelectedChapterIds (or all if not defined/empty)
  const filteredSubjectsAndChapters = useMemo(() => {
    const isCustomActive = Array.isArray(customSelectedChapterIds) && customSelectedChapterIds.length > 0;

    return subjects
      .map((subject) => {
        let activeChapters = subject.chapters;
        if (isCustomActive) {
          activeChapters = subject.chapters.filter((ch) => customSelectedChapterIds.includes(ch.id));
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          activeChapters = activeChapters.filter((ch) => 
            ch.name.toLowerCase().includes(query) || 
            subject.name.toLowerCase().includes(query)
          );
        }

        return {
          ...subject,
          chapters: activeChapters,
        };
      })
      .filter((sub) => sub.chapters.length > 0);
  }, [subjects, customSelectedChapterIds, searchQuery]);

  // Expand all chapters by default initially
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    filteredSubjectsAndChapters.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        initialExpanded[ch.id] = true;
      });
    });
    setExpandedChapterIds((prev) => ({ ...initialExpanded, ...prev }));
  }, [filteredSubjectsAndChapters]);

  // Overall weakness metrics
  const stats = useMemo(() => {
    let totalTopics = 0;
    let strugglingCount = 0;
    let needsRevisionCount = 0;
    let masteredCount = 0;
    let customItemsCount = 0;

    filteredSubjectsAndChapters.forEach((sub) => {
      sub.chapters.forEach((ch) => {
        const topics = getTopicsForChapter(ch.id, ch.name, sub.name);
        totalTopics += topics.length;

        const data = weakPointsMap[ch.id];
        if (data) {
          topics.forEach((t) => {
            const st = data.topicChecklist[t.id];
            if (st === 'struggling') strugglingCount++;
            else if (st === 'needs_revision') needsRevisionCount++;
            else if (st === 'mastered') masteredCount++;
          });
          customItemsCount += (data.customWeakPoints || []).length;
        }
      });
    });

    return {
      totalTopics,
      strugglingCount,
      needsRevisionCount,
      masteredCount,
      customItemsCount,
      totalTrackedCount: strugglingCount + needsRevisionCount + masteredCount,
    };
  }, [filteredSubjectsAndChapters, weakPointsMap]);

  // Toggle chapter expand/collapse
  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapterIds((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  // Toggle predefined topic status
  const handleSetTopicStatus = (chapterId: string, topicId: string, status: WeakPointStatus) => {
    setWeakPointsMap((prev) => {
      const currentChapterData = prev[chapterId] || {
        chapterId,
        topicChecklist: {},
        customWeakPoints: [],
        personalNotes: '',
      };

      const currentStatus = currentChapterData.topicChecklist[topicId];
      // If clicking the same status, untoggle it back to unassigned
      const newStatus = currentStatus === status ? undefined : status;

      const updatedChecklist = { ...currentChapterData.topicChecklist };
      if (newStatus) {
        updatedChecklist[topicId] = newStatus;
      } else {
        delete updatedChecklist[topicId];
      }

      return {
        ...prev,
        [chapterId]: {
          ...currentChapterData,
          topicChecklist: updatedChecklist,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  // Add custom weak point
  const handleAddCustomWeakPoint = (chapterId: string) => {
    const text = (customInputMap[chapterId] || '').trim();
    if (!text) return;

    setWeakPointsMap((prev) => {
      const currentChapterData = prev[chapterId] || {
        chapterId,
        topicChecklist: {},
        customWeakPoints: [],
        personalNotes: '',
      };

      const newItem = {
        id: `custom_wp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text,
        createdAt: new Date().toISOString(),
        isResolved: false,
      };

      return {
        ...prev,
        [chapterId]: {
          ...currentChapterData,
          customWeakPoints: [...(currentChapterData.customWeakPoints || []), newItem],
          updatedAt: new Date().toISOString(),
        },
      };
    });

    setCustomInputMap((prev) => ({ ...prev, [chapterId]: '' }));
  };

  // Delete custom weak point
  const handleDeleteCustomWeakPoint = (chapterId: string, itemId: string) => {
    setWeakPointsMap((prev) => {
      const currentChapterData = prev[chapterId];
      if (!currentChapterData) return prev;

      return {
        ...prev,
        [chapterId]: {
          ...currentChapterData,
          customWeakPoints: currentChapterData.customWeakPoints.filter((item) => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  // Toggle custom weak point resolved
  const handleToggleCustomResolved = (chapterId: string, itemId: string) => {
    setWeakPointsMap((prev) => {
      const currentChapterData = prev[chapterId];
      if (!currentChapterData) return prev;

      return {
        ...prev,
        [chapterId]: {
          ...currentChapterData,
          customWeakPoints: currentChapterData.customWeakPoints.map((item) => 
            item.id === itemId ? { ...item, isResolved: !item.isResolved } : item
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  // Update personal notes
  const handleSaveNotes = (chapterId: string, notes: string) => {
    setWeakPointsMap((prev) => {
      const currentChapterData = prev[chapterId] || {
        chapterId,
        topicChecklist: {},
        customWeakPoints: [],
        personalNotes: '',
      };

      return {
        ...prev,
        [chapterId]: {
          ...currentChapterData,
          personalNotes: notes,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Dynamic Diagnosis Summary */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A1836] via-[#151C2C] to-[#0F172A] border border-rose-500/30 shadow-2xl overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-anek">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>CUSTOM SYLLABUS WEAK POINT & TOPIC TRACKER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-jakarta">
              দুর্বল পয়েন্ট ও টপিক এনালাইজার
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-anek leading-relaxed">
              আপনার নির্বাচিত কাস্টম সিলেবাসের প্রতিটি অধ্যায়ের কঠিন টপিকগুলো চিহ্নিত করুন এবং কাস্টম নোট সংরক্ষণ করুন। AI রুটিন ইঞ্জিন এই ডাটা ব্যবহার করে আপনার জন্য বিশেষ রিভিশন স্লট তৈরি করবে।
            </p>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0 font-anek">
            <div className="p-3 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[11px] text-rose-300 block font-semibold">🔴 দুর্বল টপিক</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">
                {toBengaliNumber(stats.strugglingCount)}
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-[11px] text-amber-300 block font-semibold">🟡 রিভিশন দরকার</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {toBengaliNumber(stats.needsRevisionCount)}
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-[11px] text-emerald-300 block font-semibold">🟢 আয়ত্তে এসেছে</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {toBengaliNumber(stats.masteredCount)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Focus Guidance Pill */}
        {stats.strugglingCount > 0 && (
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/20 flex items-center justify-between gap-3 font-anek">
            <div className="flex items-center gap-2.5 text-xs text-rose-200">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                আপনি <strong>{toBengaliNumber(stats.strugglingCount)}টি</strong> বিষয়ে দুর্বলতা চিহ্নিত করেছেন। রুটিনে এই টপিকগুলো ফোকাস স্লটে অন্তর্ভুক্ত করা হয়েছে।
              </span>
            </div>
            {onNavigateToRoutine && (
              <button
                onClick={onNavigateToRoutine}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1 shrink-0 transition-all cursor-pointer"
              >
                <span>রুটিনে দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অধ্যায় বা বিষয়ের নাম দিয়ে সার্চ করুন..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-700/60 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/60 font-anek"
          />
        </div>

        {/* Status Filter Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-anek">
          {[
            { id: 'all', label: 'সকল টপিক' },
            { id: 'struggling', label: '🔴 শুধু দুর্বল' },
            { id: 'needs_revision', label: '🟡 রিভিশন দরকার' },
            { id: 'mastered', label: '🟢 আয়ত্তাধীন' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === item.id
                  ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Subjects & Selected Custom Chapters Accordion Feed */}
      {filteredSubjectsAndChapters.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 space-y-3 font-anek">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">কোনো কাস্টম অধ্যায় পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            আপনার সিলেবাস সেটআপ থেকে কাস্টম অধ্যায় নির্বাচন করুন অথবা সার্চ কুয়েরি ক্লিয়ার করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSubjectsAndChapters.map((subject) => {
            return (
              <div 
                key={subject.id} 
                className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-xl"
              >
                {/* Subject Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-jakarta">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-anek">
                        নির্বাচিত কাস্টম অধ্যায়: {toBengaliNumber(subject.chapters.length)}টি
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chapters Feed */}
                <div className="divide-y divide-white/5">
                  {subject.chapters.map((chapter) => {
                    const isExpanded = expandedChapterIds[chapter.id] !== false;
                    const predefinedTopics = getTopicsForChapter(chapter.id, chapter.name, subject.name);
                    const chapterData = weakPointsMap[chapter.id] || {
                      chapterId: chapter.id,
                      topicChecklist: {},
                      customWeakPoints: [],
                      personalNotes: '',
                    };

                    const chapterStrugglingCount = predefinedTopics.filter(
                      (t) => chapterData.topicChecklist[t.id] === 'struggling'
                    ).length;

                    // Filter predefined topics based on status filter
                    const visibleTopics = predefinedTopics.filter((t) => {
                      if (statusFilter === 'all') return true;
                      return chapterData.topicChecklist[t.id] === statusFilter;
                    });

                    return (
                      <div key={chapter.id} className="p-4 sm:p-5 transition-colors hover:bg-white/[0.01]">
                        {/* Chapter Title Bar with Collapse Toggle */}
                        <div className="flex items-center justify-between gap-3">
                          <button
                            onClick={() => toggleChapterExpand(chapter.id)}
                            className="flex items-center gap-2.5 text-left group flex-1 cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform" />
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors font-jakarta">
                              {chapter.name}
                            </h4>
                            {chapterStrugglingCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-anek">
                                {toBengaliNumber(chapterStrugglingCount)}টি দুর্বলতা
                              </span>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            {/* Notes Button */}
                            <button
                              onClick={() => setActiveNotesChapterId(activeNotesChapterId === chapter.id ? null : chapter.id)}
                              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                chapterData.personalNotes 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent'
                              }`}
                              title="ব্যক্তিগত নোট বা ফর্মুলা লিখুন"
                            >
                              <StickyNote className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline font-anek">নোট</span>
                            </button>

                            {/* Collapse button */}
                            <button
                              onClick={() => toggleChapterExpand(chapter.id)}
                              className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Chapter Content when Expanded */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4"
                            >
                              {/* 1. Pre-defined High Yield Topics Checklist */}
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-anek block">
                                  গুরুত্বপূর্ণ টপিক ও দুর্বলতা চেকলিস্ট:
                                </span>

                                <div className="grid grid-cols-1 gap-2">
                                  {visibleTopics.map((topic) => {
                                    const currentStatus = chapterData.topicChecklist[topic.id];

                                    return (
                                      <div
                                        key={topic.id}
                                        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                          currentStatus === 'struggling'
                                            ? 'bg-rose-950/20 border-rose-500/40'
                                            : currentStatus === 'needs_revision'
                                            ? 'bg-amber-950/20 border-amber-500/40'
                                            : currentStatus === 'mastered'
                                            ? 'bg-emerald-950/20 border-emerald-500/40'
                                            : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                                        }`}
                                      >
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-slate-100 font-anek">
                                              {topic.topicTitle}
                                            </span>
                                            <span className="text-[10px] text-amber-400 font-mono">
                                              {topic.boardFrequency}
                                            </span>
                                          </div>
                                          {topic.hint && (
                                            <p className="text-[11px] text-slate-400 font-anek">
                                              💡 {topic.hint}
                                            </p>
                                          )}
                                        </div>

                                        {/* Status Toggle Buttons */}
                                        <div className="flex items-center gap-1.5 shrink-0 font-anek">
                                          <button
                                            onClick={() => handleSetTopicStatus(chapter.id, topic.id, 'struggling')}
                                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                              currentStatus === 'struggling'
                                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                                : 'bg-slate-800/80 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10'
                                            }`}
                                          >
                                            🔴 দুর্বল
                                          </button>
                                          <button
                                            onClick={() => handleSetTopicStatus(chapter.id, topic.id, 'needs_revision')}
                                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                              currentStatus === 'needs_revision'
                                                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30'
                                                : 'bg-slate-800/80 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10'
                                            }`}
                                          >
                                            🟡 রিভিশন
                                          </button>
                                          <button
                                            onClick={() => handleSetTopicStatus(chapter.id, topic.id, 'mastered')}
                                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                              currentStatus === 'mastered'
                                                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30'
                                                : 'bg-slate-800/80 text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                                            }`}
                                          >
                                            🟢 আয়ত্তে
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 2. Custom Weak Points Added by Student */}
                              {chapterData.customWeakPoints && chapterData.customWeakPoints.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-anek block">
                                    আপনার যুক্ত করা ব্যক্তিগত দুর্বল পয়েন্টসমূহ:
                                  </span>

                                  <div className="space-y-1.5">
                                    {chapterData.customWeakPoints.map((item) => (
                                      <div
                                        key={item.id}
                                        className="p-2.5 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between gap-3 font-anek"
                                      >
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleToggleCustomResolved(chapter.id, item.id)}
                                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                              item.isResolved
                                                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                                : 'border-slate-600 bg-slate-900'
                                            }`}
                                          >
                                            {item.isResolved && <Check className="w-3 h-3 stroke-[3]" />}
                                          </button>
                                          <span className={`text-xs ${item.isResolved ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                            {item.text}
                                          </span>
                                        </div>

                                        <button
                                          onClick={() => handleDeleteCustomWeakPoint(chapter.id, item.id)}
                                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                          title="মুছে ফেলুন"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 3. Add Custom Weak Point Input */}
                              <div className="flex items-center gap-2 pt-2">
                                <input
                                  type="text"
                                  value={customInputMap[chapter.id] || ''}
                                  onChange={(e) => setCustomInputMap({ ...customInputMap, [chapter.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddCustomWeakPoint(chapter.id);
                                  }}
                                  placeholder="নির্দিষ্ট কোনো সমস্যা লিখুন (যেমন: গতির ৩য় সমীকরণ দিয়ে ম্যাথ ভুল হয়)..."
                                  className="flex-1 px-3.5 py-2 bg-slate-950/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-anek"
                                />
                                <button
                                  onClick={() => handleAddCustomWeakPoint(chapter.id)}
                                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-anek flex items-center gap-1 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>যুক্ত করুন</span>
                                </button>
                              </div>

                              {/* 4. Personal Chapter Notes Drawer */}
                              {activeNotesChapterId === chapter.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 font-anek"
                                >
                                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                                    <span className="flex items-center gap-1.5">
                                      <StickyNote className="w-3.5 h-3.5" />
                                      <span>ব্যক্তিগত অধ্যায় নোট ও বিশেষ স্মরণিকা:</span>
                                    </span>
                                  </div>
                                  <textarea
                                    value={chapterData.personalNotes || ''}
                                    onChange={(e) => handleSaveNotes(chapter.id, e.target.value)}
                                    placeholder="এই অধ্যায়ের প্রয়োজনীয় সূত্র, শর্টকাট টেকনিক বা পরীক্ষার আগের রিভিশন নোট এখানে লিখে রাখুন..."
                                    rows={3}
                                    className="w-full p-2.5 bg-slate-950/80 border border-amber-500/30 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-anek"
                                  />
                                </motion.div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
