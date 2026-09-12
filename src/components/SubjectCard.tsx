import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject, ChapterProgressData, ChapterStatus } from '../types';
import { 
  calculateAlgorithmicProgress, 
  toBengaliNumber 
} from '../utils/progressCalculator';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  BookCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  StickyNote, 
  Check, 
  X,
  Star
} from 'lucide-react';
import { UltraModernChapterCard } from './UltraModernChapterCard';

interface SubjectCardProps {
  subject: Subject;
  categoryName: string;
  categoryBadgeColor: string;
  chapterProgress: Record<string, ChapterProgressData>;
  suggestionProgress: Record<string, boolean>;
  onUpdateStatus: (chapterId: string, status: ChapterStatus) => void;
  onUpdateNote: (chapterId: string, note: string) => void;
  onToggleSuggestion: (subjectId: string, index: number) => void;
  onBatchSetStatus: (subject: Subject, status: ChapterStatus) => void;
  onUpdateProgressData?: (chapterId: string, updated: Partial<ChapterProgressData>) => void;
  searchQuery?: string;
  statusFilter?: 'all' | ChapterStatus | 'suggestions_only';
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  categoryName,
  categoryBadgeColor,
  chapterProgress,
  suggestionProgress,
  onUpdateStatus,
  onUpdateNote,
  onToggleSuggestion,
  onBatchSetStatus,
  onUpdateProgressData,
  searchQuery = '',
  statusFilter = 'all',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNoteChapterId, setActiveNoteChapterId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Algorithmic Task-Weighted Stats for this subject
  const subjectStats = calculateAlgorithmicProgress([subject], chapterProgress);
  const algorithmicPercentage = subjectStats.totalProgressPercent;
  const formattedProgress = subjectStats.formattedBengaliProgress;
  const totalChapters = subject.chapters.length;
  const completedCount = subjectStats.completedChaptersCount;

  // Filter chapters based on search query and status filter
  const filteredChapters = subject.chapters.filter((chapter) => {
    // Search query filter
    const matchesSearch = searchQuery.trim() === '' || 
      chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter === 'all') return true;
    if (statusFilter === 'suggestions_only') return (subject.suggestions && subject.suggestions.length > 0);

    const curStatus = chapterProgress[chapter.id]?.status || 'not_started';
    return curStatus === statusFilter;
  });

  // If filtered chapters is empty and there's a search/filter, and suggestions don't match, we might skip rendering or show message
  const hasSuggestions = subject.suggestions && subject.suggestions.length > 0;
  const isHiddenBySuggestionsOnly = statusFilter === 'suggestions_only' && !hasSuggestions;

  if (isHiddenBySuggestionsOnly) {
    return null;
  }

  if (filteredChapters.length === 0 && searchQuery.trim() !== '') {
    return null;
  }

  const openNoteEditor = (chapterId: string) => {
    setActiveNoteChapterId(chapterId);
    setTempNote(chapterProgress[chapterId]?.notes || '');
  };

  const saveNote = (chapterId: string) => {
    onUpdateNote(chapterId, tempNote);
    setActiveNoteChapterId(null);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-white/10 shadow-xl overflow-hidden transition-all duration-200 mb-5 backdrop-blur-md">
      {/* Subject Header */}
      <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${categoryBadgeColor}`}>
                {categoryName}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {subject.name}
              </h3>
              {hasSuggestions && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {subject.suggestions?.length}টি স্পেশাল সাজেশন
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-anek">
              মোট অধ্যায়: {toBengaliNumber(totalChapters)}টি • পূর্ণাঙ্গ সম্পন্ন: {toBengaliNumber(completedCount)}টি
            </p>
          </div>
        </div>

        {/* Algorithmic Progress & Quick Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="w-32 sm:w-44">
            <div 
              className="flex justify-between items-baseline text-xs font-semibold mb-1 font-anek"
              style={{ fontFamily: "'Anek Bangla', system-ui, sans-serif" }}
            >
              <span className="text-slate-400 text-[11px]">টাস্ক অগ্রগতি</span>
              <span className="text-emerald-400 font-bold text-xs">{formattedProgress}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${algorithmicPercentage}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onBatchSetStatus(subject, 'completed')}
              title="সব অধ্যায় সম্পন্ন হিসেবে চিহ্নিত করুন"
              className="px-2 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg transition-colors"
            >
              সব শেষ
            </button>
            <button
              onClick={() => onBatchSetStatus(subject, 'not_started')}
              title="অধ্যায় রিসেট করুন"
              className="px-2 py-1 text-[11px] font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              রিসেট
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label={isExpanded ? 'লুকান' : 'প্রদর্শন করুন'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* High-Priority Suggestions Box (if present) */}
      {hasSuggestions && (
        <div className="bg-amber-950/20 border-b border-amber-500/20 p-4 sm:px-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wide font-jakarta">
              BOARD EXAM PRIORITY SUGGESTIONS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {subject.suggestions?.map((sugg, idx) => {
              const key = `${subject.id}_${idx}`;
              const isMastered = !!suggestionProgress[key];
              return (
                <div
                  key={key}
                  onClick={() => onToggleSuggestion(subject.id, idx)}
                  className={`flex items-start justify-between gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                    isMastered
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-800/80 border-amber-500/20 text-slate-200 hover:border-amber-400/50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-sm font-bold text-amber-400 leading-none">
                      {sugg.priority}
                    </span>
                    <span className={`font-medium ${isMastered ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {sugg.topic}
                    </span>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isMastered
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isMastered ? 'আয়ত্ত শেষ ✓' : 'বাকি'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chapters List */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          {filteredChapters.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center italic font-hind">
              এই ফিল্টারে কোনো অধ্যায় পাওয়া যায়নি।
            </p>
          ) : (
            <div className="space-y-3.5">
              {filteredChapters.map((chapter, idx) => {
                const prog = chapterProgress[chapter.id] || { status: 'not_started' };
                // Find original chapter index in subject.chapters
                const originalIndex = subject.chapters.findIndex((c) => c.id === chapter.id);
                const chapterIndex = originalIndex >= 0 ? originalIndex : idx;

                return (
                  <UltraModernChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    index={chapterIndex}
                    progress={prog}
                    onUpdateStatus={onUpdateStatus}
                    onUpdateNote={onUpdateNote}
                    onUpdateProgressData={onUpdateProgressData}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inline Chapter Note Modal / Drawer */}
      {activeNoteChapterId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/10">
            <h4 className="text-base font-bold text-white mb-1 font-jakarta">
              অধ্যায়ের ব্যক্তিগত নোট ও টার্গেট
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              গুরুত্বপূর্ণ সূত্র, বারবার ভুল হওয়া ম্যাথ, বা রিভিশন ডেট লিখে রাখুন।
            </p>
            <textarea
              rows={3}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="যেমন: অনুঃ ৯.১ এর ১৭ ও ১৯ নং সমাধান বাকি, সূত্র রিভিশন জরুরি..."
              className="w-full p-3 text-xs border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-slate-950 text-white mb-4"
            />
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveNoteChapterId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => saveNote(activeNoteChapterId)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-colors"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
