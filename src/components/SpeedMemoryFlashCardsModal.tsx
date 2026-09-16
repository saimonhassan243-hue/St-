/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Timer, 
  Volume2, 
  VolumeX,
  Layers,
  HelpCircle,
  Eye,
  Check,
  Flame
} from 'lucide-react';
import { FLASH_CARDS_DATA, FlashCardItem } from '../data/flashCardsData';
import { toBengaliNumber } from '../utils/progressCalculator';

interface SpeedMemoryFlashCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DURATION_PER_CARD = 15; // 15 seconds auto-transition
const STORAGE_KEY_MASTERED_CARDS = 'ssc_flashcards_mastered_v1';

export const SpeedMemoryFlashCardsModal: React.FC<SpeedMemoryFlashCardsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DURATION_PER_CARD);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTERED_CARDS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filtered Cards
  const filteredCards = React.useMemo(() => {
    if (selectedSubject === 'all') return FLASH_CARDS_DATA;
    return FLASH_CARDS_DATA.filter((c) => c.subjectCategory === selectedSubject);
  }, [selectedSubject]);

  // Current Card
  const currentCard: FlashCardItem | undefined = filteredCards[currentIndex] || filteredCards[0];

  // Save mastered cards to localStorage
  const toggleMastered = (id: string) => {
    setMasteredCards((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY_MASTERED_CARDS, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Next / Previous Handlers
  const handleNext = () => {
    setIsFlipped(false);
    setSecondsRemaining(DURATION_PER_CARD);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setSecondsRemaining(DURATION_PER_CARD);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleResetTimer = () => {
    setSecondsRemaining(DURATION_PER_CARD);
    setIsFlipped(false);
  };

  // 15-Second Auto Transition Timer
  useEffect(() => {
    if (!isOpen || !isPlaying || filteredCards.length === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Auto flip or advance to next card
          handleNext();
          return DURATION_PER_CARD;
        }
        // Auto-reveal answer at 7 seconds if user hasn't flipped
        if (prev === 8 && !isFlipped) {
          setIsFlipped(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, isFlipped, filteredCards.length, currentIndex]);

  // Reset index when subject filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSecondsRemaining(DURATION_PER_CARD);
  }, [selectedSubject]);

  if (!isOpen || !currentCard) return null;

  const timerProgress = ((DURATION_PER_CARD - secondsRemaining) / DURATION_PER_CARD) * 100;
  const isCurrentMastered = !!masteredCards[currentCard.id];
  const masteredTotal = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050811]/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0b1021] border border-cyan-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden text-slate-100"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white font-jakarta flex items-center gap-2">
                  <span>স্পিড মেমোরি ফ্ল্যাশ কার্ড</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    ১৫ সে. মাইক্রো-লার্নিং
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-anek">
                বোর্ড পরীক্ষার সর্বোচ্চ গুরুত্বপুর্ণ সূত্র ও সংজ্ঞা দ্রুত ঝালাই করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-anek text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>মুখস্থ: {toBengaliNumber(masteredTotal)}/{toBengaliNumber(FLASH_CARDS_DATA.length)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none font-anek text-xs">
          {[
            { id: 'all', label: 'সকল বিষয়' },
            { id: 'physics', label: 'পদার্থবিজ্ঞান' },
            { id: 'chemistry', label: 'রসায়ন' },
            { id: 'math', label: 'সাধারণ গণিত' },
            { id: 'hmath', label: 'উচ্চতর গণিত' },
            { id: 'biology', label: 'জীববিজ্ঞান' },
            { id: 'bangla', label: 'বাংলা' },
            { id: 'english', label: 'English' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubject(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedSubject === cat.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
            style={{ width: `${timerProgress}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Main Card Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between items-center">
          {/* Card Info & Counter */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 font-anek mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                {currentCard.subjectName}
              </span>
              <span className="text-slate-400">টপিক: <strong className="text-slate-200">{currentCard.topic}</strong></span>
              <span className="text-amber-400 font-bold">{currentCard.boardImportance}</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-cyan-400 font-bold">
                {toBengaliNumber(currentIndex + 1)} / {toBengaliNumber(filteredCards.length)}
              </span>
            </div>
          </div>

          {/* Interactive 3D Flip Card Container */}
          <div 
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full max-w-2xl min-h-[280px] sm:min-h-[320px] rounded-3xl cursor-pointer perspective-1000 my-auto"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full h-full relative rounded-3xl transition-shadow duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* FRONT: Question / Concept */}
              <div 
                className={`absolute inset-0 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border ${
                  !isFlipped ? 'block' : 'hidden'
                } bg-gradient-to-br from-slate-900/90 via-[#0d142b] to-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-950/40`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-4">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      প্রশ্ন ও মৌলিক ধারণা
                    </span>
                    <span className="text-[11px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      কার্ডে ক্লিক করে উত্তর দেখুন ↻
                    </span>
                  </div>

                  <h2 className="text-base sm:text-xl font-bold text-white font-hind leading-relaxed text-slate-100">
                    {currentCard.question}
                  </h2>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-anek">
                  {currentCard.hint ? (
                    <span className="text-amber-300/90 text-xs">
                      💡 ইঙ্গিত: {currentCard.hint}
                    </span>
                  ) : (
                    <span>৭ সেকেন্ড পর স্বয়ংক্রিয় উত্তর প্রদর্শিত হবে</span>
                  )}

                  <span className="text-cyan-400 font-bold font-mono">
                    ⏳ {toBengaliNumber(secondsRemaining)} সেকেন্ড
                  </span>
                </div>
              </div>

              {/* BACK: Detailed Answer / Formula */}
              <div 
                className={`absolute inset-0 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border ${
                  isFlipped ? 'block' : 'hidden'
                } bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-900 border-indigo-500/40 shadow-2xl shadow-indigo-950/40`}
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-3">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      উত্তর, সূত্র ও সমাধান টেকনিক
                    </span>
                    <span className="text-[11px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      যাচাই সম্পন্ন ✓
                    </span>
                  </div>

                  {currentCard.formulaOrKey && (
                    <div className="p-3 rounded-2xl bg-indigo-900/40 border border-indigo-400/30 text-cyan-300 font-mono text-xs sm:text-sm font-bold mb-3 shadow-inner">
                      📌 মূল সূত্র: {currentCard.formulaOrKey}
                    </div>
                  )}

                  <div className="text-xs sm:text-sm text-slate-200 font-hind whitespace-pre-line leading-relaxed">
                    {currentCard.answer}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-anek">
                  <span className="text-indigo-300 font-semibold">পুনরায় ক্লিক করলে প্রশ্ন দেখা যাবে</span>
                  <span className="text-cyan-400 font-bold font-mono">⏳ {toBengaliNumber(secondsRemaining)} সে.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="w-full max-w-2xl mt-4 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="পূর্ববর্তী কার্ড"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2 text-xs font-bold font-anek transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 text-amber-400" />
                    <span>পজ</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span>প্লে</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="টাইমার রিসেট"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMastered(currentCard.id)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold font-anek flex items-center gap-2 transition-all ${
                  isCurrentMastered
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-800/80 text-slate-300 border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <Check className={`w-4 h-4 ${isCurrentMastered ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{isCurrentMastered ? 'আয়ত্তে আছে ✓' : 'মুখস্থ হয়েছে'}</span>
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs font-anek flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform"
              >
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
