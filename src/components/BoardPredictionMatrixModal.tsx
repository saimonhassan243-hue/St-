/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  X, 
  Flame, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Layers, 
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { BOARD_PREDICTIONS, BoardPredictionItem } from '../data/boardPredictionData';

interface BoardPredictionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMindMap?: (chapterName: string) => void;
  onOpenAudio?: (chapterName: string) => void;
  onStartTest?: (subjectId: string) => void;
}

export const BoardPredictionMatrixModal: React.FC<BoardPredictionMatrixModalProps> = ({
  isOpen,
  onClose,
  onOpenMindMap,
  onOpenAudio,
  onStartTest,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'super_hot' | 'must_read'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  if (!isOpen) return null;

  const filteredList = BOARD_PREDICTIONS.filter(item => {
    if (filterTier === 'super_hot' && item.importancePercentage < 95) return false;
    if (filterTier === 'must_read' && !item.isMustRead) return false;
    if (selectedSubject !== 'all' && item.subjectId !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-slate-950 border border-emerald-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-anek">
                  ১০ বছরের বোর্ড ট্রেন্ড অ্যানালাইসিস
                </span>
                <span className="text-xs text-slate-400 font-anek">বোর্ড প্রশ্ন সম্ভাবনা ম্যাট্রিক্স</span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white font-jakarta mt-0.5">
                বোর্ড প্রেডিকশন ম্যাট্রিক্স ও হট টপিক ব্যাজ
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-900/70 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'সকল প্রেডিকশন' },
              { id: 'super_hot', label: '🔥 সুপার হট (৯৫%+ সম্ভাবনা)' },
              { id: 'must_read', label: '★ ১০০% মাস্ট রিড' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterTier(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-anek transition-all whitespace-nowrap cursor-pointer ${
                  filterTier === f.id
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 font-anek focus:outline-none"
          >
            <option value="all">সকল বিষয়</option>
            <option value="phy">পদার্থবিজ্ঞান</option>
            <option value="chem">রসায়ন</option>
            <option value="gmath">সাধারণ গণিত</option>
            <option value="hmath">উচ্চতর গণিত</option>
            <option value="bio">জীববিজ্ঞান</option>
            <option value="ict">আইসিটি</option>
          </select>
        </div>

        {/* Scrollable Matrix Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-emerald-500/40 transition-all space-y-3 shadow-xl relative overflow-hidden"
              >
                {/* Importance Metric Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-emerald-400 font-jakarta">
                        {item.subjectName}
                      </span>
                      {item.isMustRead && (
                        <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-anek flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" /> মাস্ট রিড
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-jakarta">
                      {item.chapterName}
                    </h4>
                  </div>

                  {/* Percentage Metric Circle */}
                  <div className="px-3 py-1 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-right shrink-0">
                    <div className="text-base sm:text-lg font-black text-emerald-300 font-jakarta leading-none">
                      {item.importancePercentage}%
                    </div>
                    <span className="text-[9px] text-emerald-400/80 font-anek">বোর্ড সম্ভাবনা</span>
                  </div>
                </div>

                {/* Repeat Frequency & Expected Marks */}
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300 font-anek">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-amber-300 font-medium">
                    📌 {item.cqExpectedCount}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400">
                    {item.repeatFrequency}
                  </span>
                </div>

                {/* Recent Boards Tag List */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-anek mr-1">বিগত বোর্ড:</span>
                  {item.recentBoardTags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 border border-white/5 text-slate-300 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Top Key Topics Checklist */}
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-300 font-anek">প্রধান প্রশ্নমুখী টপিক:</span>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-slate-300 font-anek">
                    {item.topKeyTopics.map((top, tIdx) => (
                      <li key={tIdx}>{top}</li>
                    ))}
                  </ul>
                </div>

                {/* Hot Note */}
                <p className="text-[11px] text-amber-200/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 font-anek leading-relaxed">
                  🔥 <strong>বোর্ড অ্যানালাইসিস:</strong> {item.hotNotes}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  {onOpenMindMap && (
                    <button
                      onClick={() => onOpenMindMap(item.chapterName)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold font-anek flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3 h-3 text-indigo-400" />
                      <span>মাইন্ড ম্যাপ</span>
                    </button>
                  )}
                  {onOpenAudio && (
                    <button
                      onClick={() => onOpenAudio(item.chapterName)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold font-anek flex items-center gap-1 cursor-pointer"
                    >
                      <span>🎧 অডিও</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400 font-anek">
          <span>📊 বিগত ১০ বছরের ঢাকা, রাজশাহী, চট্টগ্রাম ও অন্যান্য বোর্ডের তথ্যানুযায়ী আপডেটকৃত</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold font-anek cursor-pointer"
          >
            ঠিক আছে
          </button>
        </div>
      </motion.div>
    </div>
  );
};
