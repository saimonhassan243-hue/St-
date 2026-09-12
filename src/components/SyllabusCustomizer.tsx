import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SlidersHorizontal, Check, X, Search, RotateCcw, 
  CheckSquare, Square, ChevronDown, ChevronRight, BookOpen, 
  Sparkles, Filter, ShieldCheck, HelpCircle
} from 'lucide-react';
import { Subject, Chapter } from '../types';

interface SyllabusCustomizerProps {
  subjects: Subject[];
  customSelectedChapterIds?: string[]; // undefined means all selected
  onSaveSelection: (selectedIds: string[] | undefined) => void;
  className?: string;
}

export const SyllabusCustomizer: React.FC<SyllabusCustomizerProps> = ({
  subjects,
  customSelectedChapterIds,
  onSaveSelection,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Collect all chapter IDs across all active subjects
  const allChapterIds = useMemo(() => {
    const ids: string[] = [];
    subjects.forEach((sub) => {
      sub.chapters.forEach((ch) => ids.push(ch.id));
    });
    return ids;
  }, [subjects]);

  const totalAllChaptersCount = allChapterIds.length;

  // Local editing state inside the modal
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
    new Set(customSelectedChapterIds || allChapterIds)
  );

  // Sync local editing state when modal opens or props change
  const handleOpenModal = () => {
    setLocalSelectedIds(new Set(customSelectedChapterIds || allChapterIds));
    setSearchTerm('');
    // Expand all subjects by default for convenience
    const expanded: Record<string, boolean> = {};
    subjects.forEach((s) => {
      expanded[s.id] = true;
    });
    setExpandedSubjects(expanded);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  // Check if all chapters are currently selected
  const isAllSelected = !customSelectedChapterIds || customSelectedChapterIds.length >= totalAllChaptersCount;
  const activeCount = customSelectedChapterIds ? customSelectedChapterIds.length : totalAllChaptersCount;

  // Toggle chapter in local edit set
  const toggleChapter = (id: string) => {
    setLocalSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all chapters for a specific subject
  const toggleSubjectAll = (subject: Subject) => {
    const subChapterIds = subject.chapters.map((c) => c.id);
    const allAreChecked = subChapterIds.every((id) => localSelectedIds.has(id));

    setLocalSelectedIds((prev) => {
      const next = new Set(prev);
      if (allAreChecked) {
        subChapterIds.forEach((id) => next.delete(id));
      } else {
        subChapterIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Select all chapters globally
  const handleSelectAllGlobally = () => {
    setLocalSelectedIds(new Set(allChapterIds));
  };

  // Deselect all chapters globally
  const handleDeselectAllGlobally = () => {
    setLocalSelectedIds(new Set());
  };

  // Apply quick presets
  const handleApplyPreset = (preset: 'all' | 'short70' | 'halfYearly' | 'annual') => {
    if (preset === 'all') {
      setLocalSelectedIds(new Set(allChapterIds));
      return;
    }

    const newSet = new Set<string>();
    subjects.forEach((sub) => {
      const count = sub.chapters.length;
      if (preset === 'short70') {
        // Take first 70% of chapters
        const limit = Math.max(1, Math.ceil(count * 0.7));
        sub.chapters.slice(0, limit).forEach((c) => newSet.add(c.id));
      } else if (preset === 'halfYearly') {
        // Half-yearly: first 50% of chapters
        const limit = Math.max(1, Math.ceil(count * 0.5));
        sub.chapters.slice(0, limit).forEach((c) => newSet.add(c.id));
      } else if (preset === 'annual') {
        // Annual / Final: remaining 50% or second half
        const start = Math.floor(count * 0.4);
        sub.chapters.slice(start).forEach((c) => newSet.add(c.id));
      }
    });
    setLocalSelectedIds(newSet);
  };

  // Save changes
  const handleSaveAndApply = () => {
    if (localSelectedIds.size >= totalAllChaptersCount) {
      // If all selected, reset to undefined (all chapters included)
      onSaveSelection(undefined);
    } else {
      onSaveSelection(Array.from(localSelectedIds));
    }
    setIsOpen(false);
  };

  // Quick 1-click reset on top bar
  const handleQuickReset = () => {
    onSaveSelection(undefined);
  };

  const toggleAccordion = (subjectId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  // Filtered subjects and chapters for display in modal
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    const term = searchTerm.toLowerCase();

    return subjects
      .map((sub) => {
        const matchesSubject = sub.name.toLowerCase().includes(term);
        const matchedChapters = sub.chapters.filter((ch) =>
          ch.name.toLowerCase().includes(term) || matchesSubject
        );
        return {
          ...sub,
          chapters: matchedChapters,
        };
      })
      .filter((sub) => sub.chapters.length > 0);
  }, [subjects, searchTerm]);

  return (
    <>
      {/* 1. Custom Syllabus Filter Top Bar (Matching Reference Specification) */}
      <div
        className={`w-full p-3 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide font-jakarta flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span>সিলেবাস ফিল্টার:</span>
          </span>

          {/* Dynamic count badge */}
          {isAllSelected ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>সমগ্র সিলেবাস (All) - {totalAllChaptersCount} অধ্যায়</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>কাস্টম সিলেবাস - {activeCount} / {totalAllChaptersCount} অধ্যায়</span>
            </div>
          )}

          {/* If custom filter is applied, show quick reset button */}
          {!isAllSelected && (
            <button
              onClick={handleQuickReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-white/5 transition-all"
              title="পুনরায় সমগ্র সিলেবাস লোড করুন"
            >
              <RotateCcw className="w-3 h-3" />
              <span>সব দেখান</span>
            </button>
          )}
        </div>

        {/* Button: "🎛️ সিলেবাস মডিফাই / কাস্টমাইজ" */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all cursor-pointer"
        >
          <span className="text-base leading-none">🎛️</span>
          <span>সিলেবাস মডিফাই / কাস্টমাইজ</span>
        </motion.button>
      </div>

      {/* 2. Interactive Chapter Checkbox Selection Overlay (Modal) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100 font-hind"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-white/10 bg-slate-900/90 backdrop-blur-xl flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
                    🎛️
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-jakarta flex items-center gap-2">
                      <span>সিলেবাস মডিফাই ও কাস্টমাইজেশন</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Interactive Filter
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      আপনার পরীক্ষার লক্ষ্য অনুযায়ী প্রয়োজনীয় অধ্যায়গুলো নির্বাচন করুন। বাদ দেওয়া অধ্যায়গুলো ড্যাশবোর্ডে লুকায়িত থাকবে।
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Presets & Controls Bar */}
              <div className="p-4 bg-slate-950/40 border-b border-white/5 space-y-3">
                {/* Presets Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 font-jakarta">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    PRESETS:
                  </span>
                  <button
                    onClick={() => handleApplyPreset('all')}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 transition-all"
                  >
                    🌟 সমগ্র সিলেবাস (১০০%)
                  </button>
                  <button
                    onClick={() => handleApplyPreset('short70')}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 transition-all"
                  >
                    ⚡ সংক্ষিপ্ত সিলেবাস (৭০%)
                  </button>
                  <button
                    onClick={() => handleApplyPreset('halfYearly')}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 transition-all"
                  >
                    📝 অর্ধবার্ষিক (১ম অংশ)
                  </button>
                  <button
                    onClick={() => handleApplyPreset('annual')}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/5 transition-all"
                  >
                    🎯 বার্ষিক / নির্বাচনী
                  </button>
                </div>

                {/* Search & Bulk Select */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="অধ্যায় বা বিষয়ের নাম খুঁজুন..."
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSelectAllGlobally}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      সব নির্বাচন
                    </button>
                    <button
                      onClick={handleDeselectAllGlobally}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-red-600/30 text-red-300 border border-red-500/30 transition-all"
                    >
                      <Square className="w-3.5 h-3.5" />
                      সব আনচেক
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Chapter List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[50vh] scrollbar-thin scrollbar-thumb-slate-700">
                {filteredSubjects.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    কোনো অধ্যায় বা বিষয় খুঁজে পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredSubjects.map((subject) => {
                    const subChapterIds = subject.chapters.map((c) => c.id);
                    const selectedInSub = subChapterIds.filter((id) => localSelectedIds.has(id)).length;
                    const isAllSubSelected = subChapterIds.length > 0 && selectedInSub === subChapterIds.length;
                    const isExpanded = expandedSubjects[subject.id] !== false;

                    return (
                      <div
                        key={subject.id}
                        className="rounded-2xl bg-slate-800/40 border border-white/5 overflow-hidden transition-all"
                      >
                        {/* Subject Accordion Header */}
                        <div className="p-3.5 sm:p-4 bg-slate-800/70 flex items-center justify-between gap-3 cursor-pointer select-none">
                          <div
                            onClick={() => toggleAccordion(subject.id)}
                            className="flex items-center gap-2.5 flex-1 min-w-0"
                          >
                            <span className="text-slate-400">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                              {subject.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                              ({selectedInSub}/{subject.chapters.length})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubjectAll(subject);
                            }}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                              isAllSubSelected
                                ? 'bg-indigo-600 text-white border-indigo-400'
                                : selectedInSub > 0
                                ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            {isAllSubSelected ? 'সব বাচাইকৃত ✓' : selectedInSub > 0 ? `${selectedInSub} টি সিলেক্টেড` : 'সব সিলেক্ট করুন'}
                          </button>
                        </div>

                        {/* Chapters Grid */}
                        {isExpanded && (
                          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/5 bg-slate-900/30">
                            {subject.chapters.map((chapter) => {
                              const isChecked = localSelectedIds.has(chapter.id);
                              return (
                                <label
                                  key={chapter.id}
                                  onClick={() => toggleChapter(chapter.id)}
                                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                                    isChecked
                                      ? 'bg-indigo-600/15 border-indigo-500/40 text-slate-100'
                                      : 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {}} // handled by label onClick
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border transition-all shrink-0 ${
                                      isChecked
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'border-slate-600 bg-slate-800'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="text-xs leading-tight">
                                    {chapter.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90 backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">মোট নির্বাচিত:</span>
                  <span className="font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-white/5">
                    {localSelectedIds.size} / {totalAllChaptersCount} অধ্যায়
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({Math.round((localSelectedIds.size / (totalAllChaptersCount || 1)) * 100)}% সিলেবাস)
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    বাতিল
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAndApply}
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>সংরক্ষণ ও ফিল্টার প্রয়োগ করুন</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
