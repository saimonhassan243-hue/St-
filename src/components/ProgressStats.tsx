import React from 'react';
import { CheckCircle2, Clock, Award, BookCheck, Search, Filter } from 'lucide-react';
import { ChapterStatus } from '../types';

interface ProgressStatsProps {
  totalChapters: number;
  completedChapters: number;
  revisedChapters: number;
  inProgressChapters: number;
  totalSuggestions: number;
  masteredSuggestions: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | ChapterStatus | 'suggestions_only';
  onFilterChange: (filter: 'all' | ChapterStatus | 'suggestions_only') => void;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  totalChapters,
  completedChapters,
  revisedChapters,
  inProgressChapters,
  totalSuggestions,
  masteredSuggestions,
  searchQuery,
  onSearchChange,
  statusFilter,
  onFilterChange,
}) => {
  const doneCount = completedChapters + revisedChapters;
  const overallPercentage = totalChapters > 0 ? Math.round((doneCount / totalChapters) * 100) : 0;
  const suggestionPercentage = totalSuggestions > 0 ? Math.round((masteredSuggestions / totalSuggestions) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs mb-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Total Progress */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 text-xs font-semibold mb-1">
            <span>সামগ্রিক অগ্রগতি</span>
            <span className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded text-xs font-bold">
              {overallPercentage}%
            </span>
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
            {doneCount} <span className="text-sm font-normal text-stone-500">/ {totalChapters} অধ্যায়</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Revised & Mastered Chapters */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 text-xs font-semibold mb-1">
            <span>রিভিশন সম্পন্ন</span>
            <BookCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-900 tracking-tight">
            {revisedChapters} <span className="text-sm font-normal text-stone-500">টি অধ্যায়</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">পূর্ণ প্রস্তুতি ও রিভিশন শেষ</p>
        </div>

        {/* Reading in progress */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 text-xs font-semibold mb-1">
            <span>বর্তমানে পড়ছি</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 tracking-tight">
            {inProgressChapters} <span className="text-sm font-normal text-stone-500">টি অধ্যায়</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">চলমান পাঠ্যক্রম</p>
        </div>

        {/* Suggestions Mastered */}
        <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-600 text-xs font-semibold mb-1">
            <span>সুপার সাজেশন আয়ত্ত</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
            {masteredSuggestions} <span className="text-sm font-normal text-stone-500">/ {totalSuggestions} টপিক</span>
          </div>
          <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${suggestionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="input-chapter-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="অধ্যায় বা বিষয়ের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center text-xs text-stone-400 font-medium mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 mr-1" /> ফিল্টার:
          </div>

          {[
            { id: 'all', label: 'সকল' },
            { id: 'in_progress', label: 'চলছে' },
            { id: 'completed', label: 'পড়া শেষ' },
            { id: 'revised', label: 'রিভিশন শেষ' },
            { id: 'not_started', label: 'বাকি' },
            { id: 'suggestions_only', label: 'সাজেশন আছে' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-${tab.id}`}
              onClick={() => onFilterChange(tab.id as any)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
