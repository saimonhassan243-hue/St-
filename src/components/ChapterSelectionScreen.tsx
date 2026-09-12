import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckSquare, Square, Filter, Search, RotateCcw, 
  Sparkles, Check, ChevronDown, ChevronRight, Eye, 
  EyeOff, ArrowRight, Layers, BookOpen, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { Subject, StreamKey } from '../types';
import { STREAM_OPTIONS } from '../data/curriculum';

interface ChapterSelectionScreenProps {
  compulsorySubjects: Subject[];
  streamSubjects: Subject[];
  fourthSubject: Subject;
  religionSubject: Subject;
  stream: StreamKey;
  customSelectedChapterIds?: string[];
  onSaveSelection: (selectedIds: string[] | undefined) => void;
  onSwitchToFeed: () => void;
}

export const ChapterSelectionScreen: React.FC<ChapterSelectionScreenProps> = ({
  compulsorySubjects,
  streamSubjects,
  fourthSubject,
  religionSubject,
  stream,
  customSelectedChapterIds,
  onSaveSelection,
  onSwitchToFeed,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'compulsory' | 'stream' | 'fourth' | 'religion'>('all');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Group all active subjects
  const allStreamSubjects = useMemo(() => {
    return [
      ...compulsorySubjects.map((s) => ({ ...s, categoryType: 'compulsory' as const, categoryLabel: 'আবশ্যিক' })),
      ...streamSubjects.map((s) => ({ ...s, categoryType: 'stream' as const, categoryLabel: 'বিভাগীয়' })),
      { ...fourthSubject, categoryType: 'fourth' as const, categoryLabel: '৪র্থ বিষয়' },
      { ...religionSubject, categoryType: 'religion' as const, categoryLabel: 'ধর্ম ও নৈতিক' },
    ];
  }, [compulsorySubjects, streamSubjects, fourthSubject, religionSubject]);

  // All chapter IDs across student's stream
  const allChapterIds = useMemo(() => {
    const ids: string[] = [];
    allStreamSubjects.forEach((sub) => {
      sub.chapters.forEach((ch) => ids.push(ch.id));
    });
    return ids;
  }, [allStreamSubjects]);

  const totalAllCount = allChapterIds.length;

  // Selected Set (if customSelectedChapterIds is undefined, default to all chapters selected)
  const isCustomActive = customSelectedChapterIds !== undefined;
  const currentSelectedSet = useMemo(() => {
    return new Set(customSelectedChapterIds || allChapterIds);
  }, [customSelectedChapterIds, allChapterIds]);

  const selectedCount = isCustomActive ? (customSelectedChapterIds?.length || 0) : totalAllCount;
  const hiddenCount = totalAllCount - selectedCount;

  // Ticking / Unticking single chapter
  const handleToggleChapter = (chapterId: string) => {
    const nextSet = new Set(currentSelectedSet);
    if (nextSet.has(chapterId)) {
      nextSet.delete(chapterId);
    } else {
      nextSet.add(chapterId);
    }
    
    // Save to parent state immediately
    if (nextSet.size === totalAllCount) {
      onSaveSelection(undefined); // all selected
    } else {
      onSaveSelection(Array.from(nextSet));
    }
  };

  // Toggle all chapters for a single subject
  const handleToggleSubject = (subject: Subject) => {
    const subIds = subject.chapters.map((c) => c.id);
    const allChecked = subIds.every((id) => currentSelectedSet.has(id));

    const nextSet = new Set(currentSelectedSet);
    if (allChecked) {
      subIds.forEach((id) => nextSet.delete(id));
    } else {
      subIds.forEach((id) => nextSet.add(id));
    }

    if (nextSet.size === totalAllCount) {
      onSaveSelection(undefined);
    } else {
      onSaveSelection(Array.from(nextSet));
    }
  };

  // Preset Handlers
  const handleApplyPreset = (preset: 'all' | 'short70' | 'halfYearly' | 'annual' | 'clear') => {
    if (preset === 'all') {
      onSaveSelection(undefined);
      return;
    }
    if (preset === 'clear') {
      onSaveSelection([]);
      return;
    }

    const newSet = new Set<string>();
    allStreamSubjects.forEach((sub) => {
      const len = sub.chapters.length;
      if (preset === 'short70') {
        const take = Math.max(1, Math.ceil(len * 0.7));
        sub.chapters.slice(0, take).forEach((c) => newSet.add(c.id));
      } else if (preset === 'halfYearly') {
        const take = Math.max(1, Math.ceil(len * 0.5));
        sub.chapters.slice(0, take).forEach((c) => newSet.add(c.id));
      } else if (preset === 'annual') {
        const start = Math.floor(len * 0.35);
        sub.chapters.slice(start).forEach((c) => newSet.add(c.id));
      }
    });

    onSaveSelection(Array.from(newSet));
  };

  const toggleAccordion = (subId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subId]: prev[subId] === undefined ? false : !prev[subId],
    }));
  };

  // Filtered by category tab and search query
  const displayedSubjects = useMemo(() => {
    let list = allStreamSubjects;

    if (activeCategoryTab !== 'all') {
      list = list.filter((s) => s.categoryType === activeCategoryTab);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list
        .map((s) => {
          const subMatches = s.name.toLowerCase().includes(q);
          const filteredChapters = s.chapters.filter((c) => 
            c.name.toLowerCase().includes(q) || subMatches
          );
          return {
            ...s,
            chapters: filteredChapters,
          };
        })
        .filter((s) => s.chapters.length > 0);
    }

    return list;
  }, [allStreamSubjects, activeCategoryTab, searchTerm]);

  const streamName = STREAM_OPTIONS.find((s) => s.id === stream)?.label || 'বিজ্ঞান বিভাগ';

  return (
    <div className="space-y-6">
      {/* 1. SELECTION SCREEN HERO BANNER */}
      <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 font-jakarta">
                <Filter className="w-3.5 h-3.5" />
                FILTER ENGINE • SELECTION SCREEN
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-white/5">
                {streamName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                ৪র্থ বিষয়: {fourthSubject.name}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-jakarta flex items-center gap-2">
              <span>অধ্যায় নির্বাচন স্ক্রিন (Active Syllabus Target)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl font-hind leading-relaxed">
              আপনার প্রয়োজন অনুযায়ী অধ্যায়গুলো <span className="text-emerald-400 font-bold">টিক (✓)</span> দিন। টিক করা অধ্যায়গুলোই শুধুমাত্র আপনার কাস্টম সিলেবাস ফিডে প্রদর্শিত হবে; আনচেক করা অধ্যায়গুলো স্বয়ংক্রিয়ভাবে লুকায়িত থাকবে।
            </p>
          </div>

          {/* Quick Metrics & Go to Feed CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="p-3 sm:px-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-base">
                {selectedCount}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-jakarta uppercase tracking-wider font-semibold">
                  টার্গেটে সক্রিয়
                </span>
                <span className="text-xs font-bold text-white font-hind">
                  {selectedCount} টি অধ্যায় (লুকায়িত: {hiddenCount} টি)
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSwitchToFeed}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>সিলেবাস ফিডে দেখুন</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 2. PRESETS & SEARCH BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg space-y-4">
        {/* Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-white/5">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 font-jakarta mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            দ্রুত প্রিসেট:
          </span>
          <button
            onClick={() => handleApplyPreset('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              !isCustomActive || selectedCount === totalAllCount
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-white/5'
            }`}
          >
            🌟 সমগ্র সিলেবাস (সকল অধ্যায়)
          </button>
          <button
            onClick={() => handleApplyPreset('short70')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all"
          >
            ⚡ সংক্ষিপ্ত সিলেবাস (৭০%)
          </button>
          <button
            onClick={() => handleApplyPreset('halfYearly')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all"
          >
            📝 ১ম সাময়িক / অর্ধবার্ষিক
          </button>
          <button
            onClick={() => handleApplyPreset('annual')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all"
          >
            🎯 টেস্ট / বার্ষিক পরীক্ষা
          </button>
          <button
            onClick={() => handleApplyPreset('clear')}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition-all ml-auto"
          >
            <Square className="w-3 h-3 inline mr-1" /> সব আনচেক
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `সকল বিষয় (${allStreamSubjects.length})` },
              { id: 'compulsory', label: `আবশ্যিক (${compulsorySubjects.length})` },
              { id: 'stream', label: `বিভাগীয় (${streamSubjects.length})` },
              { id: 'fourth', label: `৪র্থ বিষয় (${fourthSubject.name})` },
              { id: 'religion', label: 'ধর্ম ও নৈতিক' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategoryTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="অধ্যায় বা বিষয়ের নাম খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE SUBJECTS & CHAPTERS LIST */}
      <div className="space-y-4">
        {displayedSubjects.map((subject) => {
          const subChapterIds = subject.chapters.map((c) => c.id);
          const checkedInSub = subChapterIds.filter((id) => currentSelectedSet.has(id)).length;
          const isAllCheckedInSub = subChapterIds.length > 0 && checkedInSub === subChapterIds.length;
          const isExpanded = expandedSubjects[subject.id] !== false;

          let badgeColor = 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
          if (subject.categoryType === 'stream') {
            badgeColor = 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30';
          } else if (subject.categoryType === 'fourth') {
            badgeColor = 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30';
          } else if (subject.categoryType === 'religion') {
            badgeColor = 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
          }

          return (
            <div
              key={subject.id}
              className="rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg overflow-hidden backdrop-blur-md transition-all"
            >
              {/* Subject Header */}
              <div 
                onClick={() => toggleAccordion(subject.id)}
                className="p-4 sm:p-5 bg-slate-800/40 hover:bg-slate-800/60 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 p-1">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
                        {subject.categoryLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-hind">
                        {subject.name}
                      </h3>
                      <span className="text-xs font-bold text-slate-400 font-jakarta">
                        ({checkedInSub}/{subject.chapters.length} টি সক্রিয়)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject Quick Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleToggleSubject(subject)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                      isAllCheckedInSub
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : checkedInSub > 0
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isAllCheckedInSub ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>সব নির্বাচিত ✓</span>
                      </>
                    ) : checkedInSub > 0 ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{checkedInSub}টি নির্বাচিত</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        <span>সব টিক দিন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chapters Checkbox Grid */}
              {isExpanded && (
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-2.5 bg-slate-950/40">
                  {subject.chapters.map((chapter, idx) => {
                    const isChecked = currentSelectedSet.has(chapter.id);
                    return (
                      <motion.div
                        key={chapter.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleToggleChapter(chapter.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex items-start justify-between gap-3 ${
                          isChecked
                            ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-slate-900 border-emerald-500/40 shadow-sm ring-1 ring-emerald-500/20 text-white'
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800/70 hover:text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Checkbox Icon */}
                          <div
                            className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                              isChecked
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'border-slate-600 bg-slate-800'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-anek">
                              অধ্যায় {idx + 1}
                            </span>
                            <h4 className={`text-xs sm:text-sm font-bold tracking-tight leading-snug font-hind mt-0.5 ${
                              isChecked ? 'text-white' : 'text-slate-300'
                            }`}>
                              {chapter.name}
                            </h4>
                          </div>
                        </div>

                        {/* Visibility Status Pill */}
                        <div className="shrink-0 pt-0.5">
                          {isChecked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-anek">
                              <Eye className="w-2.5 h-2.5" /> সক্রিয়
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-white/5 font-anek">
                              <EyeOff className="w-2.5 h-2.5" /> লুকায়িত
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. BOTTOM FLOATING BAR */}
      <div className="sticky bottom-4 z-30 p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-hind">
            ফিল্টার টার্গেটে <strong className="text-emerald-300 font-bold">{selectedCount}টি অধ্যায়</strong> নির্বাচিত। 
            {hiddenCount > 0 ? (
              <span className="text-slate-400"> (বাকি {hiddenCount}টি মূল ফিডে লুকায়িত থাকবে)</span>
            ) : (
              <span className="text-slate-400"> (সকল অধ্যায় দৃশ্যমান)</span>
            )}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSwitchToFeed}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer font-hind"
        >
          <span>কাস্টম সিলেবাস ফিড দেখুন ({selectedCount} টি অধ্যায়)</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </motion.button>
      </div>
    </div>
  );
};
