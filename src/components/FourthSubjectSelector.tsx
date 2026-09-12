import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { FourthSubjectKey } from '../types';
import { FOURTH_SUBJECT_OPTIONS } from '../data/curriculum';

interface FourthSubjectSelectorProps {
  selectedKey: FourthSubjectKey;
  onChange: (key: FourthSubjectKey) => void;
  className?: string;
}

export const FourthSubjectSelector: React.FC<FourthSubjectSelectorProps> = ({
  selectedKey,
  onChange,
  className = '',
}) => {
  const currentOption = FOURTH_SUBJECT_OPTIONS.find((opt) => opt.id === selectedKey) || FOURTH_SUBJECT_OPTIONS[0];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide font-jakarta flex items-center gap-1.5">
              <span>চতুর্থ বিষয় (4TH SUBJECT SELECTOR)</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 rounded-full border border-fuchsia-500/30">
                ঐচ্ছিক / ৪র্থ বিষয়
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              আপনার নির্বাচিত ৪র্থ বিষয়টি সিলেবাস ও অধ্যায় তালিকায় স্বয়ংক্রিয়ভাবে যুক্ত হবে
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-xl border border-white/5 self-start sm:self-auto">
          <span className="text-slate-400">বর্তমানে সক্রিয়:</span>
          <span className="font-bold text-fuchsia-300 flex items-center gap-1">
            <span>{currentOption.icon}</span>
            <span>{currentOption.label}</span>
          </span>
        </div>
      </div>

      {/* Grid of 4 Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {FOURTH_SUBJECT_OPTIONS.map((opt) => {
          const isSelected = selectedKey === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(opt.id)}
              className={`relative text-left p-3 rounded-xl border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-fuchsia-900/40 via-indigo-900/30 to-slate-900 border-fuchsia-500 shadow-lg shadow-fuchsia-500/20 ring-1 ring-fuchsia-400/50'
                  : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-fuchsia-500/20 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0 p-1.5 rounded-lg bg-slate-950/40 border border-white/5">
                    {opt.icon}
                  </span>
                  <div>
                    <h5 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {opt.label}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {opt.enLabel} (কোড: {opt.code})
                    </span>
                  </div>
                </div>

                <div className="shrink-0 mt-0.5">
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400/20" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600" />
                  )}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 truncate max-w-[130px]" title={opt.desc}>
                  {opt.desc}
                </span>
                <span className={`font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                  isSelected ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {opt.chaptersCount} অধ্যায়
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
