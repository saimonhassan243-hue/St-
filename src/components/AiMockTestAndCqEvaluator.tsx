/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Clock, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  Check, 
  X, 
  Flame, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Subject, UserProfile } from '../types';
import { 
  SAMPLE_MCQ_QUESTIONS, 
  SAMPLE_CQ_QUESTIONS, 
  McqQuestion, 
  CqQuestion, 
  evaluateCqAnswerLocally,
  AiCqEvaluationResult
} from '../data/mockTestAndQuestions';

interface AiMockTestAndCqEvaluatorProps {
  subjects: Subject[];
  customSelectedChapterIds?: string[];
  profile?: UserProfile;
  initialChapterName?: string;
  onNavigateToSyllabus?: () => void;
  onNavigateToRoutine?: () => void;
}

type TabMode = 'mock_test' | 'cq_evaluator';

export const AiMockTestAndCqEvaluator: React.FC<AiMockTestAndCqEvaluatorProps> = ({
  subjects,
  customSelectedChapterIds = [],
  profile,
  initialChapterName,
  onNavigateToSyllabus,
  onNavigateToRoutine,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('mock_test');

  // ==========================================
  // 1. MOCK TEST STATE
  // ==========================================
  const [testState, setTestState] = useState<'config' | 'running' | 'completed'>('config');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [activeQuestions, setActiveQuestions] = useState<McqQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // index -> optionIndex
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // 10 mins
  const [timeTaken, setTimeTaken] = useState<number>(0);

  // Available questions filtered by active syllabus
  const filteredMcqPool = useMemo(() => {
    let list = SAMPLE_MCQ_QUESTIONS;
    if (selectedSubjectId !== 'all') {
      list = list.filter(q => q.subjectId === selectedSubjectId);
    }
    return list;
  }, [selectedSubjectId]);

  // Start Test Handler
  const handleStartTest = () => {
    const shuffled = [...filteredMcqPool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    setActiveQuestions(picked);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimerSeconds(picked.length * 60); // 1 min per question
    setTimeTaken(0);
    setTestState('running');
  };

  // Timer effect
  React.useEffect(() => {
    if (testState !== 'running') return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          setTestState('completed');
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [testState]);

  // Calculate score
  const scoreResult = useMemo(() => {
    let correct = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      total: activeQuestions.length,
      percentage: activeQuestions.length > 0 ? Math.round((correct / activeQuestions.length) * 100) : 0,
    };
  }, [activeQuestions, selectedAnswers]);

  // ==========================================
  // 2. CQ EVALUATOR STATE
  // ==========================================
  const [selectedCqIndex, setSelectedCqIndex] = useState<number>(0);
  const [writtenAnswerText, setWrittenAnswerText] = useState<string>('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<AiCqEvaluationResult | null>(null);

  const selectedCq = SAMPLE_CQ_QUESTIONS[selectedCqIndex] || SAMPLE_CQ_QUESTIONS[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
        // Pre-fill simulated OCR extract if empty
        if (!writtenAnswerText) {
          setWrittenAnswerText(`[হাতের লেখা খাতা থেকে এক্সট্র্যাক্টকৃত নমুনা উত্তর]\n(ক) নির্দিষ্ট মুহূর্তে বস্তুর দূরত্বের পরিবর্তনের হারকে তাৎক্ষণিক দ্রুতি বলে।\n(খ) বৃত্তাকার গতিতে দ্রুতি একই হলেও দিক পরিবর্তনের কারণে কেন্দ্রমুখী ত্বরণ সৃষ্টি হয়।\n(গ) v = u + at সূত্রানুযায়ী ত্বরণ a = 0.833 m/s² এবং অতিক্রান্ত দূরত্ব s = 166.67 মিটার।\n(ঘ) v-t গ্রাফের ক্ষেত্রফল বিশ্লেষণ করলে মোট দূরত্ব ৩টি অংশের যোগফল ৩৭৫ মিটার পাওয়া যায়।`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluateCq = () => {
    if (!writtenAnswerText.trim() && !uploadedImagePreview) return;
    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluateCqAnswerLocally(writtenAnswerText, selectedCq);
      setEvaluationResult(result);
      setIsEvaluating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold font-anek">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>বোর্ড সিলেবাস লিঙ্কড AI প্র্যাকটিস ও মূল্যায়ন ইঞ্জিন</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-jakarta tracking-tight">
              AI মক টেস্ট ও CQ খাতা মূল্যায়ন
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-anek max-w-2xl leading-relaxed">
              আপনার সক্রিয় কাস্টম সিলেবাসের ভিত্তিতে তৈরি করুন ইনস্ট্যান্ট এমসিকিউ মক টেস্ট এবং সৃজনশীল (CQ) উত্তরের ছবি বা টেক্সট জমা দিয়ে পান বোর্ড স্ট্যান্ডার্ড ১০-এ মার্কিং ও পূর্ণাঙ্গ পরামর্শ।
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shrink-0 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('mock_test');
                setTestState('config');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-anek flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'mock_test'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ইনস্ট্যান্ট মক টেস্ট</span>
            </button>
            <button
              onClick={() => setActiveTab('cq_evaluator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-anek flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'cq_evaluator'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-300" />
              <span>CQ খাতা মূল্যায়নকারী</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. INSTANT MOCK TEST BUILDER & RUNNER                         */}
      {/* ============================================================== */}
      {activeTab === 'mock_test' && (
        <div className="space-y-6">
          {/* CONFIG VIEW */}
          {testState === 'config' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-jakarta">
                    কাস্টম মক টেস্ট কনফিগার করুন
                  </h3>
                  <p className="text-xs text-slate-400 font-anek">
                    সিলেবাসের অধ্যায়ভিত্তিক প্রশ্ন ব্যাংক থেকে স্বয়ংক্রিয়ভাবে প্রশ্ন সাজানো হবে
                  </p>
                </div>
              </div>

              {/* Subject Selection */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 font-anek flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>বিষয় নির্বাচন করুন:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => setSelectedSubjectId('all')}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold font-anek transition-all text-left cursor-pointer ${
                      selectedSubjectId === 'all'
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800/60 text-slate-300 border-white/5 hover:border-white/20'
                    }`}
                  >
                    🌟 সকল সক্রিয় বিষয়
                  </button>
                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold font-anek transition-all text-left truncate cursor-pointer ${
                        selectedSubjectId === sub.id
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800/60 text-slate-300 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Selection */}
              <div className="space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-200 font-anek flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>প্রশ্নের সংখ্যা ও সময় সীমা:</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { count: 5, time: '৫ মিনিট', label: 'দ্রুত রিভিশন' },
                    { count: 10, time: '১০ মিনিট', label: 'স্ট্যান্ডার্ড ড্রিল' },
                    { count: 15, time: '১৫ মিনিট', label: 'ফুল বোর্ড স্পিড টেস্ট' },
                  ].map((item) => (
                    <button
                      key={item.count}
                      onClick={() => setQuestionCount(item.count)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        questionCount === item.count
                          ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-800/60 border-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div className="text-lg sm:text-xl font-extrabold font-jakarta">{item.count} টি MCQ</div>
                      <div className="text-xs text-indigo-200/90 font-anek mt-0.5">{item.time}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleStartTest}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base font-anek shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>মক টেস্ট শুরু করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* RUNNING TEST VIEW */}
          {testState === 'running' && activeQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
            >
              {/* Progress & Live Countdown Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 font-anek">প্রশ্ন:</span>
                  <span className="text-sm font-extrabold text-indigo-400 font-jakarta">
                    {currentQuestionIndex + 1} / {activeQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-bold font-mono">
                  <Clock className="w-4 h-4 animate-spin text-rose-400" />
                  <span>
                    {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Active Question Card */}
              {(() => {
                const currentQ = activeQuestions[currentQuestionIndex];
                const currentSelectedOpt = selectedAnswers[currentQuestionIndex];

                return (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-anek">
                          {currentQ.subjectName}
                        </span>
                        <span className="text-xs text-slate-400 font-anek">{currentQ.chapterName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                          {currentQ.boardSource}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white font-hind leading-relaxed">
                        {currentQuestionIndex + 1}. {currentQ.question}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {currentQ.options.map((opt, optIdx) => {
                        const isSelected = currentSelectedOpt === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setSelectedAnswers(prev => ({
                                ...prev,
                                [currentQuestionIndex]: optIdx,
                              }));
                            }}
                            className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md shadow-indigo-600/20'
                                : 'bg-slate-800/60 border-white/5 hover:border-slate-600 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                                  isSelected
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                              </span>
                              <span className="text-xs sm:text-sm font-medium font-hind">{opt}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                      >
                        আগের প্রশ্ন
                      </button>

                      {currentQuestionIndex < activeQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold font-anek flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                        >
                          <span>পরবর্তী প্রশ্ন</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setTestState('completed')}
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold font-anek flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/30"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>টেস্ট জমা দিন</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* COMPLETED TEST REVIEW */}
          {testState === 'completed' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* Scorecard Header */}
              <div className="text-center space-y-3 border-b border-white/10 pb-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-jakarta">
                  মক টেস্ট ফলাফল ও পারফরম্যান্স
                </h3>
                <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-anek">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    স্কোর: {scoreResult.correct} / {scoreResult.total} ({scoreResult.percentage}%)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                    ব্যয়িত সময়: {Math.floor(timeTaken / 60)} মি. {timeTaken % 60} সে.
                  </span>
                </div>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা পর্যালোচনা:</span>
                </h4>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {activeQuestions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-white font-hind leading-snug">
                            {idx + 1}. {q.question}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-anek shrink-0 ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {isCorrect ? 'সঠিক (+১)' : 'ভুল / অনুত্তরিত'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1 font-anek">
                          <p>
                            <span className="text-slate-400">আপনার উত্তর: </span>
                            <span className={isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                              {userAns !== undefined ? q.options[userAns] : 'উত্তর দেওয়া হয়নি'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="text-slate-400">সঠিক উত্তর: </span>
                              <span className="text-emerald-300 font-bold">{q.options[q.correctIndex]}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 mt-1 leading-relaxed">
                            💡 <span className="font-semibold text-slate-300">ব্যাখ্যা:</span> {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setTestState('config')}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-anek flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>নতুন টেস্ট কনফিগার করুন</span>
                </button>
                {onNavigateToSyllabus && (
                  <button
                    onClick={onNavigateToSyllabus}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-anek flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>সিলেবাসে ফিরে যান</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. CQ ANSWER EVALUATOR UI                                      */}
      {/* ============================================================== */}
      {activeTab === 'cq_evaluator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: CQ Stem & Sub-questions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-anek">
                  {selectedCq.subjectName}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">১০ মার্কস CQ</span>
              </div>

              {/* CQ Stem Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-anek">সৃজনশীল প্রশ্ন নির্বাচন করুন:</label>
                <select
                  value={selectedCqIndex}
                  onChange={(e) => {
                    setSelectedCqIndex(Number(e.target.value));
                    setEvaluationResult(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-anek focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {SAMPLE_CQ_QUESTIONS.map((cq, idx) => (
                    <option key={cq.id} value={idx}>
                      {cq.subjectName}: {cq.chapterName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stem Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-anek">
                  উদ্দীপক:
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-hind leading-relaxed">
                  {selectedCq.stem}
                </p>
              </div>

              {/* Sub-questions List */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-300 font-anek">প্রশ্নাবলি (ক, খ, গ, ঘ):</span>
                {selectedCq.subQuestions.map((sub) => (
                  <div key={sub.label} className="p-3 rounded-xl bg-slate-800/50 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-300 font-anek">
                        ({sub.label}) [{sub.type}]
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">{sub.marks} নম্বর</span>
                    </div>
                    <p className="text-xs text-slate-200 font-hind">{sub.question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Upload / Write Answer & Evaluation Results */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white font-jakarta flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>আপনার লিখিত CQ উত্তর জমা দিন</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-anek">ছবি বা টাইপ করা টেক্সট</span>
              </div>

              {/* Photo Upload Option */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 font-anek">খাতার ছবির মাধ্যমে জমা</h4>
                    <p className="text-[10px] text-slate-400 font-anek">আপনার হাতে লেখা উত্তরের পরিষ্কার ছবি আপলোড করুন</p>
                  </div>
                </div>

                <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-bold font-anek flex items-center gap-1.5 cursor-pointer transition-colors border border-purple-500/30 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>ছবি নির্বাচন করুন</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Image Preview if uploaded */}
              {uploadedImagePreview && (
                <div className="relative rounded-2xl overflow-hidden border border-purple-500/40 max-h-48 bg-black/40 flex items-center justify-center p-2">
                  <img src={uploadedImagePreview} alt="Handwritten Answer" className="max-h-44 object-contain rounded-xl" />
                  <button
                    onClick={() => setUploadedImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 text-rose-400 rounded-full hover:bg-rose-600 hover:text-white transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Text Area */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-anek flex items-center justify-between">
                  <span>উত্তর লিখুন বা এডিট করুন:</span>
                  <span className="text-[10px] text-slate-400">ক, খ, গ, ঘ ক্রমানুসারে লিখুন</span>
                </label>
                <textarea
                  value={writtenAnswerText}
                  onChange={(e) => setWrittenAnswerText(e.target.value)}
                  placeholder="এখানে আপনার (ক), (খ), (গ), (ঘ) উত্তর টাইপ করুন অথবা খাতার ছবি আপলোড করুন..."
                  rows={6}
                  className="w-full p-3.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-hind leading-relaxed"
                />
              </div>

              {/* Evaluate Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateCq}
                  disabled={isEvaluating || (!writtenAnswerText.trim() && !uploadedImagePreview)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm font-anek shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>AI খাতা মূল্যায়ন করছে...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <span>বোর্ড মার্কিং অনুযায়ী মূল্যায়ন করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Evaluation Results Card */}
            {evaluationResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/95 border border-purple-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5"
              >
                {/* Result Top Banner */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-xl font-jakarta shadow-md">
                      {evaluationResult.score}/10
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-jakarta">AI বোর্ড মূল্যায়ন স্কোর</span>
                        <span className="px-2 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {evaluationResult.gradeBadge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-anek">প্রধান পরীক্ষক গাইডলাইন অনুযায়ী সাজানো</p>
                    </div>
                  </div>

                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>

                {/* Sub-questions breakdown marks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-anek">ক (জ্ঞানমূলক)</div>
                    <div className="text-sm font-extrabold text-indigo-300 font-jakarta">
                      {evaluationResult.breakdown.knowledge.marks} / {evaluationResult.breakdown.knowledge.max}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-anek">খ (অনুধাবনমূলক)</div>
                    <div className="text-sm font-extrabold text-indigo-300 font-jakarta">
                      {evaluationResult.breakdown.understanding.marks} / {evaluationResult.breakdown.understanding.max}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-anek">গ (প্রয়োগমূলক)</div>
                    <div className="text-sm font-extrabold text-indigo-300 font-jakarta">
                      {evaluationResult.breakdown.application.marks} / {evaluationResult.breakdown.application.max}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-anek">ঘ (উচ্চতর দক্ষতা)</div>
                    <div className="text-sm font-extrabold text-indigo-300 font-jakarta">
                      {evaluationResult.breakdown.higherOrder.marks} / {evaluationResult.breakdown.higherOrder.max}
                    </div>
                  </div>
                </div>

                {/* Missing points & strengths */}
                <div className="space-y-3 font-anek">
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>উত্তরের শক্তিশালী দিকসমূহ:</span>
                    </span>
                    <ul className="space-y-1 pl-5 list-disc text-xs text-slate-300">
                      {evaluationResult.highlightedStrengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Missing points */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>পূর্ণ ১০/১০ নিশ্চিত করতে যেসব পয়েন্ট বাদ পড়েছে:</span>
                    </span>
                    <ul className="space-y-1 pl-5 list-disc text-xs text-amber-200/90">
                      {evaluationResult.missingKeyPoints.map((mp, idx) => (
                        <li key={idx}>{mp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Advice */}
                  <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                      বোর্ড পরীক্ষকের স্পেশাল টিপ:
                    </span>
                    <p className="leading-relaxed">{evaluationResult.boardStandardAdvice}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
