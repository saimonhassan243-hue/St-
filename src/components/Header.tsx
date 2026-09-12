import React from 'react';
import { StreamKey, ReligionKey } from '../types';
import { STREAM_OPTIONS, RELIGION_OPTIONS } from '../data/curriculum';
import { BookOpen, GraduationCap, Sparkles, Printer, RotateCcw } from 'lucide-react';

interface HeaderProps {
  stream: StreamKey;
  religion: ReligionKey;
  onStreamChange: (stream: StreamKey) => void;
  onReligionChange: (religion: ReligionKey) => void;
  onReset: () => void;
  activeView: 'tracker' | 'suggestions';
  setActiveView: (view: 'tracker' | 'suggestions') => void;
}

export const Header: React.FC<HeaderProps> = ({
  stream,
  religion,
  onStreamChange,
  onReligionChange,
  onReset,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                  SSC সিলেবাস ও সাজেশন ট্র্যাকার
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SSC ২০২৬-২৭
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                অধ্যায়ভিত্তিক প্রস্তুতি ও বোর্ড পরীক্ষার স্পেশাল ৩-স্টার সাজেশন
              </p>
            </div>
          </div>

          {/* Action Navigation Tabs */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 border border-stone-200/70">
              <button
                id="tab-syllabus-tracker"
                onClick={() => setActiveView('tracker')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'tracker'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                সিলেবাস ট্র্যাকার
              </button>
              <button
                id="tab-suggestions-bank"
                onClick={() => setActiveView('suggestions')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'suggestions'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                সাজেশন শিট (৩⭐️ ও ২⭐️)
              </button>
            </div>

            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              <button
                id="btn-print-summary"
                onClick={() => window.print()}
                title="প্রিন্ট বা PDF সংরক্ষণ করুন"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">প্রিন্ট</span>
              </button>
              <button
                id="btn-reset-progress"
                onClick={onReset}
                title="সকল অগ্রগতি রিসেট করুন"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-red-600 hover:border-red-200 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">রিসেট</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stream & Religion Selection Controls */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Stream Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 shrink-0">বিভাগ:</span>
            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/80">
              {STREAM_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  id={`stream-opt-${opt.id}`}
                  onClick={() => onStreamChange(opt.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    stream === opt.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Religion Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 shrink-0">ধর্ম শিক্ষা:</span>
            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200/80">
              {RELIGION_OPTIONS.map((rel) => (
                <button
                  key={rel.id}
                  id={`religion-opt-${rel.id}`}
                  onClick={() => onReligionChange(rel.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    religion === rel.id
                      ? 'bg-stone-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {rel.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
