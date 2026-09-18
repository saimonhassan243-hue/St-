import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Flame, 
  Clock, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Subject, ChapterProgressData } from '../types';

interface BacklogRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  onApplyPlan: () => void;
}

export const BacklogRecoveryModal: React.FC<BacklogRecoveryModalProps> = ({
  isOpen,
  onClose,
  subjects,
  chapterProgress,
  onApplyPlan,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'BALANCED' | 'AGGRESSIVE' | 'LIGHT'>('BALANCED');

  if (!isOpen) return null;

  const handleExecuteAutoRebalance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onApplyPlan();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 sm:p-8 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">AI ব্যাকলগ অটো-রিকভারি ইঞ্জিন</h3>
                <p className="text-xs text-cyan-300">স্বয়ংক্রিয় ফ্রি-স্লট ডিস্ট্রিবিউশন অ্যালগরিদম</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <div className="mt-6 space-y-6">
              {/* Algorithm Explanation */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed space-y-2">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>অ্যালগরিদম কীভাবে কাজ করে?</span>
                </div>
                <p>
                  ১. আপনার আসন্ন সাপ্তাহিক ছুটির দিন (শুক্রবার ও শনিবার) এবং সাধারণ দিনের ফ্রি স্লট স্ক্যান করে।
                  <br />
                  ২. কঠিন ও গুরুত্বপূর্ণ টপিকগুলোকে সকালের তাজা মন থাকার স্লটে আগে বসায়।
                  <br />
                  ৩. আপনাকে অতিরিক্ত প্রেশার না দিয়ে দৈনিক পড়ার সময় সর্বোচ্চ ৩০-৪৫ মিনিট সামঞ্জস্য করে।
                </p>
              </div>

              {/* Recovery Speed Profile */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">রিকভারি পেস ও তীব্রতা নির্বাচন করুন:</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSpeed('LIGHT')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedSpeed === 'LIGHT'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">লাইট পেস</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">দৈনিক +২০ মিনিট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSpeed('BALANCED')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedSpeed === 'BALANCED'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">ব্যালান্সড (প্রস্তাবিত)</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">দৈনিক +৩৫ মিনিট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSpeed('AGGRESSIVE')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedSpeed === 'AGGRESSIVE'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200 font-bold shadow-lg shadow-rose-500/20'
                        : 'bg-slate-950/60 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">ফাস্ট ট্র্যাক</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">দৈনিক +৬০ মিনিট</div>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleExecuteAutoRebalance}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>রুটিন ক্যালকুলেশন ও রিব্যালান্স হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>১-ক্লিকে রুটিন রিব্যালান্স নিশ্চিত করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-3xl">
                ✓
              </div>
              <h4 className="text-xl font-black text-white">রুটিন সফলভাবে আপডেট হয়েছে!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                আপনার ব্যাকলগ টাস্কগুলো আসন্ন ছুটির দিনে বুদ্ধিমত্তার সাথে রি-শিডিউল করে দেওয়া হয়েছে।
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
              >
                রুটিন দেখতে যান
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
