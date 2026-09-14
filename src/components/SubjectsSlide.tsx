import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Sparkles, Filter, Search, RotateCcw, 
  ChevronDown, ChevronUp, CheckCircle2, Clock, BookCheck, Circle, Star, StickyNote, Layers,
  LayoutGrid
} from 'lucide-react';
import { Subject, ChapterProgressData, ChapterStatus, StreamKey, ReligionKey, FourthSubjectKey } from '../types';
import { STREAM_OPTIONS } from '../data/curriculum';
import { SubjectCard } from './SubjectCard';
import { SuggestionsView } from './SuggestionsView';
import { SyllabusCustomizer } from './SyllabusCustomizer';
import { AlgorithmicProgressCalculator } from './AlgorithmicProgressCalculator';
import { toBengaliNumber } from '../utils/progressCalculator';

interface SubjectsSlideProps {
  compulsorySubjects: Subject[];
  streamSubjects: Subject[];
  religionSubject: Subject;
  fourthSubject: Subject;
  fourthSubjectKey: FourthSubjectKey;
  customSelectedChapterIds?: string[];
  stream: StreamKey;
  religion: ReligionKey;
  chapterProgress: Record<string, ChapterProgressData>;
  suggestionProgress: Record<string, boolean>;
  onStreamChange: (stream: StreamKey) => void;
  onReligionChange: (religion: ReligionKey) => void;
  onFourthSubjectChange: (key: FourthSubjectKey) => void;
  onSaveCustomSyllabus: (selectedIds: string[] | undefined) => void;
  onUpdateStatus: (chapterId: string, status: ChapterStatus) => void;
  onUpdateNote: (chapterId: string, note: string) => void;
  onToggleSuggestion: (subjectId: string, index: number) => void;
  onBatchSetStatus: (subject: Subject, status: ChapterStatus) => void;
  onUpdateProgressData?: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
  onOpenMindMap?: (chapterName: string) => void;
  onOpenAudio?: (chapterName: string) => void;
  onStartPractice?: (chapterName: string) => void;
}

export const SubjectsSlide: React.FC<SubjectsSlideProps> = ({
  compulsorySubjects,
  streamSubjects,
  religionSubject,
  fourthSubject,
  fourthSubjectKey,
  customSelectedChapterIds,
  stream,
  religion,
  chapterProgress,
  suggestionProgress,
  onStreamChange,
  onReligionChange,
  onFourthSubjectChange,
  onSaveCustomSyllabus,
  onUpdateStatus,
  onUpdateNote,
  onToggleSuggestion,
  onBatchSetStatus,
  onUpdateProgressData,
  onOpenMindMap,
  onOpenAudio,
  onStartPractice,
}) => {
  const [subView, setSubView] = useState<'syllabus' | 'suggestions'>('syllabus');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ChapterStatus | 'suggestions_only'>('all');
  const [selectedSubjectTab, setSelectedSubjectTab] = useState<string>('all');

  // Set of custom included chapter IDs (if filter applied)
  const selectedSet = useMemo(() => {
    return customSelectedChapterIds ? new Set(customSelectedChapterIds) : null;
  }, [customSelectedChapterIds]);

  // Helper to filter subject chapters according to custom selection
  const filterSub = (s: Subject): Subject => {
    if (!selectedSet) return s;
    return {
      ...s,
      chapters: s.chapters.filter((ch) => selectedSet.has(ch.id)),
    };
  };

  const displayCompulsory = useMemo(() => 
    compulsorySubjects.map(filterSub).filter((s) => s.chapters.length > 0),
    [compulsorySubjects, selectedSet]
  );

  const displayStream = useMemo(() => 
    streamSubjects.map(filterSub).filter((s) => s.chapters.length > 0),
    [streamSubjects, selectedSet]
  );

  const displayFourth = useMemo(() => 
    filterSub(fourthSubject),
    [fourthSubject, selectedSet]
  );

  const displayReligion = useMemo(() => 
    filterSub(religionSubject),
    [religionSubject, selectedSet]
  );

  const allActiveUnfilteredSubjects = useMemo(() => {
    return [...compulsorySubjects, ...streamSubjects, fourthSubject, religionSubject];
  }, [compulsorySubjects, streamSubjects, fourthSubject, religionSubject]);

  const allSubjectTabsList = useMemo(() => {
    const list: {
      id: string;
      subject: Subject;
      categoryName: string;
      badgeColor: string;
    }[] = [];

    displayCompulsory.forEach((sub) => {
      list.push({
        id: sub.id,
        subject: sub,
        categoryName: 'আবশ্যিক',
        badgeColor: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      });
    });

    displayStream.forEach((sub) => {
      list.push({
        id: sub.id,
        subject: sub,
        categoryName: 'বিভাগীয়',
        badgeColor: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      });
    });

    if (displayFourth.chapters.length > 0) {
      list.push({
        id: displayFourth.id,
        subject: displayFourth,
        categoryName: '৪র্থ বিষয়',
        badgeColor: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30',
      });
    }

    if (displayReligion.chapters.length > 0) {
      list.push({
        id: displayReligion.id,
        subject: displayReligion,
        categoryName: 'ধর্ম শিক্ষা',
        badgeColor: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      });
    }

    return list;
  }, [displayCompulsory, displayStream, displayFourth, displayReligion]);

  const totalStreamChaptersCount = useMemo(() => {
    return allActiveUnfilteredSubjects.reduce((acc, sub) => acc + sub.chapters.length, 0);
  }, [allActiveUnfilteredSubjects]);

  const activeFilteredChaptersCount = useMemo(() => {
    if (!selectedSet) return totalStreamChaptersCount;
    return customSelectedChapterIds?.length || 0;
  }, [selectedSet, customSelectedChapterIds, totalStreamChaptersCount]);

  return (
    <div className="relative w-full text-slate-100 font-hind">
      {/* Ambient glowing backdrops */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glassmorphic Container with rounded-3xl */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900/70 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Slide Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide font-jakarta">
                SYLLABUS & CHAPTER TRACKER
              </h2>
              <p className="text-xs text-slate-400">
                আবশ্যিক ও বিভাগীয় বিষয়সমূহ, অধ্যায় ট্র্যাকিং ও সুপার সাজেশন
              </p>
            </div>
          </div>

          {/* View Switcher: 1. Syllabus Feed, 2. Suggestions */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto backdrop-blur-md flex-wrap gap-1">
            <button
              onClick={() => setSubView('syllabus')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                subView === 'syllabus'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              কাস্টম সিলেবাস ফিড
            </button>
            <button
              onClick={() => setSubView('suggestions')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                subView === 'suggestions'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              সুপার সাজেশন শিট
            </button>
          </div>
        </div>

        {/* 2. Custom Syllabus Filter Top Bar & Search/Filters (When on syllabus view) */}
        {subView === 'syllabus' && (
          <div className="mt-4 space-y-3">
            {/* Filter Engine Active Status Card */}
            {selectedSet && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-jakarta">
                        FILTER ENGINE ACTIVE
                      </span>
                      <span className="text-xs font-bold text-white font-hind">
                        টার্গেটে অন্তর্ভুক্ত: <strong className="text-emerald-400">{activeFilteredChaptersCount} টি অধ্যায়</strong>
                      </span>
                      <span className="text-[11px] text-slate-400 font-hind">
                        (বাকি {totalStreamChaptersCount - activeFilteredChaptersCount} টি অধ্যায় লুকায়িত)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                  <button
                    onClick={() => onSaveCustomSyllabus(undefined)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>সকল অধ্যায় প্রদর্শন</span>
                  </button>
                </div>
              </div>
            )}

            <SyllabusCustomizer
              subjects={allActiveUnfilteredSubjects}
              customSelectedChapterIds={customSelectedChapterIds}
              onSaveSelection={onSaveCustomSyllabus}
            />

            {/* Algorithmic Progress Calculator for Active Selected Chapters */}
            <AlgorithmicProgressCalculator
              subjects={allActiveUnfilteredSubjects}
              chapterProgress={chapterProgress}
              customSelectedChapterIds={customSelectedChapterIds}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="অধ্যায় বা বিষয়ের নাম দিয়ে খুঁজুন..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <div className="flex items-center text-xs text-slate-400 font-medium mr-1 shrink-0 font-jakarta">
                  <Filter className="w-3.5 h-3.5 mr-1" /> STATUS:
                </div>
                {[
                  { id: 'all', label: 'সকল' },
                  { id: 'in_progress', label: 'চলছে' },
                  { id: 'completed', label: 'পড়া শেষ' },
                  { id: 'revised', label: 'রিভিশন' },
                  { id: 'not_started', label: 'বাকি' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      statusFilter === tab.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Quick Subject Tabs */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <button
                  type="button"
                  onClick={() => setSelectedSubjectTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedSubjectTab === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/5'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>সকল বিষয় ({toBengaliNumber(allSubjectTabsList.length)})</span>
                </button>

                {allSubjectTabsList.map((item) => {
                  const isSelected = selectedSubjectTab === item.id;
                  const completedCount = item.subject.chapters.filter((ch) => {
                    const p = chapterProgress[ch.id];
                    return (
                      p?.status === 'completed' ||
                      p?.status === 'revised' ||
                      (p?.bookReading && p?.cqPractice && p?.mcqPractice)
                    );
                  }).length;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSubjectTab(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-white/5'
                      }`}
                    >
                      <span className="truncate max-w-[150px]">{item.subject.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-anek ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950 font-extrabold'
                            : 'bg-slate-700/80 text-slate-400'
                        }`}
                      >
                        {toBengaliNumber(completedCount)}/{toBengaliNumber(item.subject.chapters.length)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* View Content */}
        <div className="mt-6">
          {subView === 'suggestions' ? (
            <div className="p-2 sm:p-4 rounded-2xl bg-slate-950/40 border border-white/5">
              <SuggestionsView
                compulsorySubjects={compulsorySubjects}
                streamSubjects={streamSubjects}
                fourthSubject={fourthSubject}
                religionSubject={religionSubject}
                suggestionProgress={suggestionProgress}
                onToggleSuggestion={onToggleSuggestion}
                currentStream={stream}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Empty state if 0 chapters are checked */}
              {displayCompulsory.length === 0 && 
               displayStream.length === 0 && 
               displayFourth.chapters.length === 0 && 
               displayReligion.chapters.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/25 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl">
                    🔍
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-hind">
                    কোনো অধ্যায় নির্বাচিত করা হয়নি!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-hind leading-relaxed">
                    আপনি ফিল্টার ইঞ্জিনে সব অধ্যায় আনচেক করে রেখেছেন। মূল ফিডে অধ্যায় দেখতে উপরের কাস্টমাইজারে অধ্যায় নির্বাচন করুন অথবা সকল অধ্যায় প্রদর্শন বাটনে ক্লিক করুন।
                  </p>
                  <button
                    onClick={() => onSaveCustomSyllabus(undefined)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer font-hind transition-transform hover:scale-105"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>সকল অধ্যায় প্রদর্শন করুন</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* If specific subject is selected in tabs */}
                  {selectedSubjectTab !== 'all' ? (
                    (() => {
                      const selectedItem = allSubjectTabsList.find((i) => i.id === selectedSubjectTab);
                      if (!selectedItem) return null;
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 font-jakarta">
                              <span className="w-2 h-4 rounded-full bg-indigo-400" />
                              {selectedItem.subject.name} ({selectedItem.categoryName})
                            </h3>
                            <button
                              type="button"
                              onClick={() => setSelectedSubjectTab('all')}
                              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                            >
                              সকল বিষয় দেখুন →
                            </button>
                          </div>
                          <div className="space-y-4">
                            <SubjectCard
                              key={selectedItem.subject.id}
                              subject={selectedItem.subject}
                              categoryName={selectedItem.categoryName}
                              categoryBadgeColor={selectedItem.badgeColor}
                              chapterProgress={chapterProgress}
                              suggestionProgress={suggestionProgress}
                              onUpdateStatus={onUpdateStatus}
                              onUpdateNote={onUpdateNote}
                              onToggleSuggestion={onToggleSuggestion}
                              onBatchSetStatus={onBatchSetStatus}
                              onUpdateProgressData={onUpdateProgressData}
                              searchQuery={searchQuery}
                              statusFilter={statusFilter}
                            />
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <>
                      {/* ১. আবশ্যিক বিষয়সমূহ */}
                      {displayCompulsory.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 font-jakarta">
                            <span className="w-2 h-4 rounded-full bg-emerald-400" />
                            COMPULSORY SUBJECTS (আবশ্যিক বিষয়সমূহ)
                          </h3>
                          <div className="space-y-4">
                            {displayCompulsory.map((sub) => (
                              <SubjectCard
                                key={sub.id}
                                subject={sub}
                                categoryName="আবশ্যিক"
                                categoryBadgeColor="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                chapterProgress={chapterProgress}
                                suggestionProgress={suggestionProgress}
                                onUpdateStatus={onUpdateStatus}
                                onUpdateNote={onUpdateNote}
                                onToggleSuggestion={onToggleSuggestion}
                                onBatchSetStatus={onBatchSetStatus}
                                onUpdateProgressData={onUpdateProgressData}
                                onOpenMindMap={onOpenMindMap}
                                onOpenAudio={onOpenAudio}
                                onStartPractice={onStartPractice}
                                searchQuery={searchQuery}
                                statusFilter={statusFilter}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ২. বিভাগীয় বিষয়সমূহ */}
                      {displayStream.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 font-jakarta">
                            <span className="w-2 h-4 rounded-full bg-indigo-400" />
                            DEPARTMENT SUBJECTS ({STREAM_OPTIONS.find((s) => s.id === stream)?.label})
                          </h3>
                          <div className="space-y-4">
                            {displayStream.map((sub) => (
                              <SubjectCard
                                key={sub.id}
                                subject={sub}
                                categoryName="বিভাগীয়"
                                categoryBadgeColor="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                                chapterProgress={chapterProgress}
                                suggestionProgress={suggestionProgress}
                                onUpdateStatus={onUpdateStatus}
                                onUpdateNote={onUpdateNote}
                                onToggleSuggestion={onToggleSuggestion}
                                onBatchSetStatus={onBatchSetStatus}
                                onUpdateProgressData={onUpdateProgressData}
                                onOpenMindMap={onOpenMindMap}
                                onOpenAudio={onOpenAudio}
                                onStartPractice={onStartPractice}
                                searchQuery={searchQuery}
                                statusFilter={statusFilter}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ৩. ৪র্থ বিষয় (4th Subject) */}
                      {displayFourth.chapters.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-fuchsia-300 mb-3 flex items-center gap-2 font-jakarta">
                            <span className="w-2 h-4 rounded-full bg-fuchsia-400" />
                            4TH SUBJECT (চতুর্থ বিষয়: {displayFourth.name})
                          </h3>
                          <div className="space-y-4">
                            <SubjectCard
                              key={displayFourth.id}
                              subject={displayFourth}
                              categoryName="৪র্থ বিষয়"
                              categoryBadgeColor="bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30"
                              chapterProgress={chapterProgress}
                              suggestionProgress={suggestionProgress}
                              onUpdateStatus={onUpdateStatus}
                              onUpdateNote={onUpdateNote}
                              onToggleSuggestion={onToggleSuggestion}
                              onBatchSetStatus={onBatchSetStatus}
                              onUpdateProgressData={onUpdateProgressData}
                              onOpenMindMap={onOpenMindMap}
                              onOpenAudio={onOpenAudio}
                              onStartPractice={onStartPractice}
                              searchQuery={searchQuery}
                              statusFilter={statusFilter}
                            />
                          </div>
                        </div>
                      )}

                      {/* ৪. ধর্ম ও নৈতিক শিক্ষা */}
                      {displayReligion.chapters.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 font-jakarta">
                            <span className="w-2 h-4 rounded-full bg-amber-400" />
                            RELIGION & ETHICS ({religionSubject.name})
                          </h3>
                          <div className="space-y-4">
                            <SubjectCard
                              key={displayReligion.id}
                              subject={displayReligion}
                              categoryName="ধর্ম শিক্ষা"
                              categoryBadgeColor="bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              chapterProgress={chapterProgress}
                              suggestionProgress={suggestionProgress}
                              onUpdateStatus={onUpdateStatus}
                              onUpdateNote={onUpdateNote}
                              onToggleSuggestion={onToggleSuggestion}
                              onBatchSetStatus={onBatchSetStatus}
                              onUpdateProgressData={onUpdateProgressData}
                              onOpenMindMap={onOpenMindMap}
                              onOpenAudio={onOpenAudio}
                              onStartPractice={onStartPractice}
                              searchQuery={searchQuery}
                              statusFilter={statusFilter}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
