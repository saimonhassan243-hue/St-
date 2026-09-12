import React, { useState } from 'react';
import { Subject } from '../types';
import { Sparkles, Star, CheckCircle2, Circle, Filter } from 'lucide-react';

interface SuggestionsViewProps {
  compulsorySubjects: Subject[];
  streamSubjects: Subject[];
  fourthSubject?: Subject;
  religionSubject: Subject;
  suggestionProgress: Record<string, boolean>;
  onToggleSuggestion: (subjectId: string, index: number) => void;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  compulsorySubjects,
  streamSubjects,
  fourthSubject,
  religionSubject,
  suggestionProgress,
  onToggleSuggestion,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | '3star' | '2star'>('all');

  // Filter subjects that actually have suggestions defined
  const allActiveSubjects = [
    ...compulsorySubjects,
    ...streamSubjects,
    ...(fourthSubject ? [fourthSubject] : []),
    religionSubject,
  ].filter((sub) => sub.suggestions && sub.suggestions.length > 0);

  // Calculate totals
  let totalSuggCount = 0;
  let masteredCount = 0;

  allActiveSubjects.forEach((sub) => {
    sub.suggestions?.forEach((_, idx) => {
      totalSuggCount++;
      if (suggestionProgress[`${sub.id}_${idx}`]) {
        masteredCount++;
      }
    });
  });

  const percent = totalSuggCount > 0 ? Math.round((masteredCount / totalSuggCount) * 100) : 0;

  return (
    <div className="space-y-6 font-hind">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-800/60 to-indigo-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-md shadow-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-jakarta">
                BOARD EXAM SUPER SUGGESTIONS & HIGH-YIELD CHECKLIST
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              বিগত ১০ বছরের বোর্ড প্রশ্ন ও শীর্ষ ক্যাডেট কলেজের মডেল টেস্ট বিশ্লেষণের ভিত্তিতে ৩-স্টার (⭐️⭐️⭐️) এবং ২-স্টার (⭐️⭐️) সৃজনশীল ও গাণিতিক প্রশ্নাবলি। ধর্ম বিষয়ে <span className="text-amber-300 font-semibold">{religionSubject.name}</span> অন্তর্ভুক্ত রয়েছে।
            </p>
          </div>

          <div className="bg-slate-900/90 px-5 py-3.5 rounded-2xl border border-white/10 shrink-0 shadow-inner">
            <div className="text-[11px] font-semibold text-slate-400 mb-1">সাজেশন প্রস্তুতি সম্পন্ন</div>
            <div className="text-xl font-bold text-white font-anek">
              {masteredCount} <span className="text-xs font-normal text-slate-400">/ {totalSuggCount} টপিক</span>
            </div>
            <div className="w-36 bg-slate-800 rounded-full h-2 mt-2 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 font-jakarta">
            <Filter className="w-3.5 h-3.5" /> FILTER:
          </span>
          <button
            onClick={() => setPriorityFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              priorityFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-white/5'
            }`}
          >
            সকল সাজেশন ({totalSuggCount})
          </button>
          <button
            onClick={() => setPriorityFilter('3star')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              priorityFilter === '3star'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-amber-300 hover:bg-slate-800 border border-amber-500/20'
            }`}
          >
            ⭐️⭐️⭐️ ৩-স্টার (সর্বোচ্চ জরুরি)
          </button>
          <button
            onClick={() => setPriorityFilter('2star')}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              priorityFilter === '2star'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-white/5'
            }`}
          >
            ⭐️⭐️ ২-স্টার
          </button>
        </div>
      </div>

      {/* Grouped by Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allActiveSubjects.map((sub) => {
          const suggestions = (sub.suggestions || []).filter((s) => {
            if (priorityFilter === '3star') return s.priority === '⭐️⭐️⭐️';
            if (priorityFilter === '2star') return s.priority === '⭐️⭐️';
            return true;
          });

          if (suggestions.length === 0) return null;

          const isReligion = sub.id === religionSubject.id;

          return (
            <div
              key={sub.id}
              className="bg-slate-900/80 rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isReligion ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <h3 className="font-bold text-base text-white">{sub.name}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium font-anek">
                    {suggestions.length}টি টপিক
                  </span>
                </div>

                <div className="space-y-2.5">
                  {suggestions.map((sugg, idx) => {
                    const originalIdx = sub.suggestions?.indexOf(sugg) ?? idx;
                    const key = `${sub.id}_${originalIdx}`;
                    const isDone = !!suggestionProgress[key];

                    return (
                      <div
                        key={key}
                        onClick={() => onToggleSuggestion(sub.id, originalIdx)}
                        className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer select-none transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                            : 'bg-slate-800/50 border-white/5 hover:border-white/10 hover:bg-slate-800/80 text-white'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            aria-label="Toggle suggestion status"
                            className="mt-0.5 shrink-0 focus:outline-none"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                            )}
                          </button>
                          <div>
                            <span
                              className={`text-xs sm:text-sm font-medium ${
                                isDone ? 'line-through text-slate-400' : 'text-slate-100 font-semibold'
                              }`}
                            >
                              {sugg.topic}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-amber-400">
                                {sugg.priority}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {sugg.priority === '⭐️⭐️⭐️' ? 'বোর্ড পরীক্ষায় নিশ্চিত প্রশ্ন' : 'সৃজনশীল বা অনুধাবন'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-anek ${
                            isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {isDone ? 'সম্পন্ন ✓' : 'বাকি'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Study Tip */}
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                <span>টিপ: রিভিশন শেষে বোর্ড প্রশ্ন ও টেস্ট পেপার অনুশীলন করুন।</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
