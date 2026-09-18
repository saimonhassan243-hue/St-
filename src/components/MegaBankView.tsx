import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  Award, 
  FileText, 
  HelpCircle, 
  Zap, 
  Search, 
  Filter, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  Bookmark, 
  BookOpen,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';
import { 
  ALL_EDUCATION_BOARDS, 
  ALL_YEARS, 
  MEGA_BOARD_QUESTIONS, 
  CADET_COLLEGE_PAPERS, 
  FORMULA_CHEAT_SHEET 
} from '../data/megaQuestionBankData';
import { Subject } from '../types';

interface MegaBankViewProps {
  subjects: Subject[];
  onOpenFlashcards: () => void;
  onOpenPractice: (chapterName?: string) => void;
  onOpenEveMode: () => void;
  onOpenPredictionMatrix: () => void;
}

export const MegaBankView: React.FC<MegaBankViewProps> = ({
  subjects,
  onOpenFlashcards,
  onOpenPractice,
  onOpenEveMode,
  onOpenPredictionMatrix,
}) => {
  const [activeMegaTab, setActiveMegaTab] = useState<'BOARDS' | 'CADET' | 'FORMULAS'>('BOARDS');
  const [selectedBoard, setSelectedBoard] = useState<string>('সব বোর্ড');
  const [selectedYear, setSelectedYear] = useState<string>('সব বছর');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);

  // Filtered Board Questions
  const filteredBoardQuestions = MEGA_BOARD_QUESTIONS.filter((item) => {
    const matchesBoard = selectedBoard === 'সব বোর্ড' || item.boardName === selectedBoard;
    const matchesYear = selectedYear === 'সব বছর' || item.year.toString() === selectedYear.replace(/\D/g, '');
    const matchesSearch = 
      searchQuery.trim() === '' ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionStem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBoard && matchesYear && matchesSearch;
  });

  const handleCopyFormula = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedFormulaId(id);
    setTimeout(() => setCopiedFormulaId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Cyber Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-950 border border-purple-500/30 p-6 sm:p-8 shadow-[0_0_35px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono font-bold tracking-wide">
              <Database className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>NCTB MEGA QUESTION & RESOURCE VAULT (2015-2026)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>মেগা ব্যাংক ও রিসোর্স হাব</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              সকল শিক্ষা বোর্ডের বিগত ১২ বছরের প্রশ্নোত্তর, শীর্ষ ক্যাডেট কলেজের মডেল টেস্ট পেপারস এবং অল-ইন-ওয়ান ফর্মুলা চিটশিট সংকলন।
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenFlashcards}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>🎴</span>
              <span>ফ্ল্যাশ কার্ডস</span>
            </button>
            <button
              onClick={onOpenPredictionMatrix}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>📊</span>
              <span>বোর্ড প্রেডিকশন</span>
            </button>
            <button
              onClick={() => onOpenPractice()}
              className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950" />
              <span>AI CQ মূল্যায়ন</span>
            </button>
          </div>
        </div>

        {/* Mega Bank Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 flex-wrap">
          <button
            onClick={() => setActiveMegaTab('BOARDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMegaTab === 'BOARDS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black border border-purple-400/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>সকল বোর্ড প্রশ্ন ব্যাংক (২০১৫-২০২৬)</span>
          </button>

          <button
            onClick={() => setActiveMegaTab('CADET')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMegaTab === 'CADET'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black border border-purple-400/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>ক্যাডেট কলেজ স্পেশাল পেপারস</span>
          </button>

          <button
            onClick={() => setActiveMegaTab('FORMULAS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeMegaTab === 'FORMULAS'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black border border-purple-400/40'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>অল-ইন-ওয়ান ফর্মুলা চিটশিট</span>
          </button>
        </div>
      </div>

      {/* 1. 🏛️ ALL EDUCATION BOARDS TAB */}
      {activeMegaTab === 'BOARDS' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="বিষয়, অধ্যায় বা টপিক খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Board Selector */}
            <div>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {ALL_EDUCATION_BOARDS.map((board) => (
                  <option key={board} value={board}>
                    {board}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {ALL_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredBoardQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                      {q.boardName} '{q.year.toString().slice(-2)}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">{q.subjectName}</span>
                    <span className="text-xs text-slate-400 font-medium">({q.chapterName})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {q.type}
                    </span>
                    <button
                      onClick={() => onOpenPractice(q.chapterName)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      AI টেস্ট নিন ⚡
                    </button>
                  </div>
                </div>

                {/* Stimulus / Stem */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 text-sm text-slate-200 leading-relaxed font-sans">
                  <span className="font-bold text-cyan-400 mr-2">উদ্দীপক:</span>
                  {q.questionStem}
                </div>

                {/* Sub-Questions */}
                {q.cqSubQuestions && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300">
                      <span className="font-bold text-purple-400 mr-1.5">(ক) [১]</span>
                      {q.cqSubQuestions.k}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300">
                      <span className="font-bold text-purple-400 mr-1.5">(খ) [২]</span>
                      {q.cqSubQuestions.kh}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300">
                      <span className="font-bold text-purple-400 mr-1.5">(গ) [৩]</span>
                      {q.cqSubQuestions.g}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-slate-300">
                      <span className="font-bold text-purple-400 mr-1.5">(ঘ) [৪]</span>
                      {q.cqSubQuestions.gh}
                    </div>
                  </div>
                )}

                {/* Explanation / Solution Insight */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                  <span className="font-bold text-indigo-300 mr-1.5">💡 সমাধান ও মূল কনসেপ্ট:</span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 🎓 CADET COLLEGE SPECIAL PAPERS */}
      {activeMegaTab === 'CADET' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CADET_COLLEGE_PAPERS.map((paper) => (
            <div
              key={paper.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-black text-sm">
                    ⭐
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{paper.collegeName}</h4>
                    <p className="text-xs text-amber-300 font-medium">
                      {paper.subjectName} • {paper.examType} ({paper.year})
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-slate-300">
                  {paper.totalMarks} Marks / {paper.durationMinutes} min
                </span>
              </div>

              {/* Highlighted Topics */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-400">গুরুত্বপূর্ণ ফোকাস টপিক:</div>
                <div className="flex flex-wrap gap-1.5">
                  {paper.highlightedTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-medium"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample CQ */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-400 mr-1.5">নমুনা স্ট্যান্ডার্ড CQ:</span>
                {paper.sampleCqStem}
              </div>

              {/* Expert Tips */}
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-slate-400">
                <span className="font-bold text-slate-200 mr-1">ক্যাডেট এক্সামিনার টিপস:</span>
                {paper.expertTips}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 📐 ALL-IN-ONE FORMULA CHEAT SHEET */}
      {activeMegaTab === 'FORMULAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {FORMULA_CHEAT_SHEET.map((f) => (
            <div
              key={f.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-cyan-400 mr-2">{f.subjectName}</span>
                  <span className="text-xs text-slate-400 font-medium">({f.chapterName})</span>
                  <h4 className="text-base font-black text-white mt-1">{f.formulaName}</h4>
                </div>

                <button
                  onClick={() => handleCopyFormula(f.formulaLatex, f.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="সূত্র কপি করুন"
                >
                  {copiedFormulaId === f.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Formula Block */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 font-mono text-sm text-cyan-300 whitespace-pre-line tracking-wide">
                {f.formulaLatex}
              </div>

              {/* Units & Symbols */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                {f.unitsAndSymbols.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/50 border border-white/5">
                    <span className="font-bold text-purple-300 mr-1">{item.symbol}:</span>
                    <span className="text-slate-300">{item.meaning}</span>
                    <span className="text-[10px] text-slate-500 block">[{item.unit}]</span>
                  </div>
                ))}
              </div>

              {/* Application Tip */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
                <span className="font-bold text-cyan-300 mr-1">📌 প্রয়োগ কৌশল:</span>
                {f.applicationTip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
