import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  CheckCircle2, 
  Circle, 
  StickyNote, 
  Check, 
  X, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Chapter, ChapterProgressData, ChapterStatus } from '../types';
import { 
  getChapterTaskStatus, 
  formatBengaliProgress, 
  toBengaliNumber 
} from '../utils/progressCalculator';

export interface UltraModernChapterCardProps {
  chapter: Chapter;
  index: number;
  progress?: ChapterProgressData;
  onUpdateStatus: (chapterId: string, status: ChapterStatus) => void;
  onUpdateNote?: (chapterId: string, note: string) => void;
  onUpdateProgressData?: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
}

const DEFAULT_EXAM_TAGS = [
  'অর্ধবার্ষিক ✓',
  'বার্ষিক ✓',
  'প্রাক-নির্বাচনী ✓',
  'নির্বাচনী ✓',
  'নিজের ✓',
];

// Helper to parse chapter number and title
const parseChapterInfo = (name: string, index: number) => {
  if (name.includes(':')) {
    const parts = name.split(':');
    const headerPart = parts[0].trim();
    const titlePart = parts.slice(1).join(':').trim();
    
    // Try to extract digit like "১ম" or "২য়" or "১"
    const match = headerPart.match(/([০-৯0-9]+)/);
    const badgeNumber = match ? toBengaliNumber(match[1]) : toBengaliNumber(index + 1);
    
    return {
      badge: badgeNumber,
      subtitle: headerPart,
      title: titlePart,
    };
  }

  return {
    badge: toBengaliNumber(index + 1),
    subtitle: `${toBengaliNumber(index + 1)}ম অধ্যায়`,
    title: name,
  };
};

export const UltraModernChapterCard: React.FC<UltraModernChapterCardProps> = ({
  chapter,
  index,
  progress,
  onUpdateStatus,
  onUpdateNote,
  onUpdateProgressData,
}) => {
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [tempNote, setTempNote] = useState(progress?.notes || '');

  // Parse chapter display title and badge number
  const { badge, subtitle, title } = parseChapterInfo(chapter.name, index);

  // Selected Exam Tags
  const activeTags = progress?.examTags ?? [DEFAULT_EXAM_TAGS[0], DEFAULT_EXAM_TAGS[3]];

  // Algorithmic Task Progress:
  // Concept Clear = 33.3% Weight
  // CQ Solve = 33.3% Weight
  // MCQ Solve = 33.4% Weight
  const taskStatus = getChapterTaskStatus(progress);
  const percentage = taskStatus.percentage;
  const isFullDone = taskStatus.isFullyDone;
  const bookReading = taskStatus.conceptClear;
  const cqPractice = taskStatus.cqSolve;
  const mcqPractice = taskStatus.mcqSolve;

  // Toggle Action checklist item
  const handleToggleItem = (itemKey: 'bookReading' | 'cqPractice' | 'mcqPractice') => {
    const currentVal = itemKey === 'bookReading' ? bookReading : itemKey === 'cqPractice' ? cqPractice : mcqPractice;
    const newVal = !currentVal;

    const newReading = itemKey === 'bookReading' ? newVal : bookReading;
    const newCq = itemKey === 'cqPractice' ? newVal : cqPractice;
    const newMcq = itemKey === 'mcqPractice' ? newVal : mcqPractice;

    const newCount = (newReading ? 1 : 0) + (newCq ? 1 : 0) + (newMcq ? 1 : 0);

    let newStatus: ChapterStatus = 'not_started';
    if (newCount === 3) {
      newStatus = 'completed';
    } else if (newCount > 0) {
      newStatus = 'in_progress';
    }

    if (onUpdateProgressData) {
      onUpdateProgressData(chapter.id, {
        [itemKey]: newVal,
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      });
    } else {
      // Fallback
      onUpdateStatus(chapter.id, newStatus);
    }
  };

  // Toggle Exam Tag
  const handleToggleTag = (tag: string) => {
    let newTags: string[];
    if (activeTags.includes(tag)) {
      newTags = activeTags.filter((t) => t !== tag);
    } else {
      newTags = [...activeTags, tag];
    }

    if (onUpdateProgressData) {
      onUpdateProgressData(chapter.id, { examTags: newTags });
    }
  };

  // Save Note
  const handleSaveNote = () => {
    if (onUpdateNote) {
      onUpdateNote(chapter.id, tempNote);
    } else if (onUpdateProgressData) {
      onUpdateProgressData(chapter.id, { notes: tempNote });
    }
    setShowNoteEditor(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 overflow-hidden border ${
        isFullDone
          ? 'bg-gradient-to-br from-emerald-950/35 via-slate-900/90 to-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
          : taskStatus.tasksDoneCount > 0
          ? 'bg-gradient-to-br from-emerald-950/20 via-slate-900/95 to-slate-900/90 border-emerald-500/25 hover:border-emerald-500/40 shadow-lg'
          : 'bg-slate-900/80 hover:bg-slate-900/95 border-white/10 hover:border-emerald-500/20 shadow-md'
      }`}
    >
      {/* Subtle top indicator glow if completed */}
      {isFullDone && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300" />
      )}

      {/* ============================================================== */}
      {/* 1. CHAPTER HEADER BLOCK                                       */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        {/* Left Side: Green Rounded Badge + Title */}
        <div className="flex items-start gap-3">
          {/* Green Rounded Badge showing Chapter Number (e.g. '২') */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 text-slate-950 font-extrabold flex items-center justify-center font-anek shadow-md shadow-emerald-500/30 text-lg sm:text-xl shrink-0 select-none">
            {badge}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-emerald-400/90 tracking-wide font-anek uppercase">
                {subtitle}
              </span>
              {isFullDone && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-anek">
                  <Check className="w-2.5 h-2.5" /> মাস্টার্ড
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug font-hind mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Right Side: Progress Status Pill & Notes Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Progress Status Pill (e.g., '১০০% সম্পন্ন' or '%৬৫ সম্পন্ন') */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold font-anek flex items-center gap-1.5 transition-all shadow-sm ${
              isFullDone
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-emerald-500/30'
                : percentage > 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isFullDone ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}>
              {percentage > 0 ? formatBengaliProgress(percentage) : '%০ শুরু করুন'}
            </span>
          </div>

          {/* Quick Note Toggle */}
          <button
            onClick={() => setShowNoteEditor(!showNoteEditor)}
            title="নোট লিখুন"
            className={`p-1.5 rounded-xl border transition-all ${
              progress?.notes
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 hover:bg-slate-800 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PROGRESS BAR & EXAM CATEGORIES TAGS                         */}
      {/* ============================================================== */}
      <div className="space-y-3 mb-4">
        {/* Animated Green Progress Bar directly underneath */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-teal-300 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </div>

        {/* Tags Row for Exam Categories: 'অর্ধবার্ষিক ✓', 'বার্ষিক ✓', 'প্রাক-নির্বাচনী ✓', 'নির্বাচনী ✓', 'নিজের ✓' */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 font-anek">টার্গেট:</span>
          {DEFAULT_EXAM_TAGS.map((tag) => {
            const isSelected = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all font-anek flex items-center gap-1 select-none ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 border border-white/5'
                }`}
              >
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THREE CORE ACTION CARDS (Interactive Checklist Buttons)     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
        {/* Option 1: 📘 "মূল বই রিডিং + কনসেপ্ট ক্লিয়ার" */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => handleToggleItem('bookReading')}
          className={`relative p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all select-none ${
            bookReading
              ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10'
              : 'bg-slate-800/50 hover:bg-slate-800/80 border-white/10 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">📘</span>
            <div className="min-w-0">
              <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                bookReading ? 'text-emerald-200' : 'text-slate-200'
              }`}>
                মূল বই রিডিং + কনসেপ্ট ক্লিয়ার
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                Board Book Reading
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {bookReading ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-slate-400" />
            )}
          </div>
        </motion.button>

        {/* Option 2: ✍️ "সৃজনশীল অনুশীলন (CQ Solve)" */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => handleToggleItem('cqPractice')}
          className={`relative p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all select-none ${
            cqPractice
              ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10'
              : 'bg-slate-800/50 hover:bg-slate-800/80 border-white/10 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">✍️</span>
            <div className="min-w-0">
              <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                cqPractice ? 'text-emerald-200' : 'text-slate-200'
              }`}>
                সৃজনশীল অনুশীলন (CQ Solve)
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                Creative Questions
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {cqPractice ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-slate-400" />
            )}
          </div>
        </motion.button>

        {/* Option 3: 🔘 "বহুনির্বাচনী অনুশীলন (MCQ Solve)" */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => handleToggleItem('mcqPractice')}
          className={`relative p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all select-none ${
            mcqPractice
              ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-md shadow-emerald-500/10'
              : 'bg-slate-800/50 hover:bg-slate-800/80 border-white/10 text-slate-300 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg shrink-0">🔘</span>
            <div className="min-w-0">
              <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight leading-tight ${
                mcqPractice ? 'text-emerald-200' : 'text-slate-200'
              }`}>
                বহুনির্বাচনী অনুশীলন (MCQ Solve)
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                MCQ Practice
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {mcqPractice ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border border-slate-600 hover:border-slate-400" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Expandable Quick Note Drawer */}
      <AnimatePresence>
        {showNoteEditor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/10 overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5 text-amber-400" />
                  অধ্যায়ভিত্তিক ব্যক্তিগত রিভিশন নোট
                </label>
                <button
                  type="button"
                  onClick={() => setShowNoteEditor(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="গুরুত্বপূর্ণ সূত্র, দুর্বল পয়েন্ট বা শিক্ষক নির্দেশিত নোট লিখুন..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteEditor(false)}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  নোট সেভ করুন
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Note preview badge if note exists and editor is closed */}
      {!showNoteEditor && progress?.notes && (
        <div 
          onClick={() => setShowNoteEditor(true)}
          className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2 text-xs text-amber-300/90 cursor-pointer hover:text-amber-200"
        >
          <StickyNote className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span className="truncate italic">নোট: {progress.notes}</span>
        </div>
      )}
    </motion.div>
  );
};
