/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, StreamKey } from '../types';
import { 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Circle, 
  Filter, 
  Search, 
  BookOpen, 
  Flame, 
  GraduationCap, 
  Layers, 
  Award, 
  ChevronRight,
  Calculator,
  Atom,
  Briefcase,
  Landmark,
  FileText
} from 'lucide-react';
import { 
  COMPULSORY_SUBJECTS, 
  STREAM_SUBJECTS, 
  RELIGION_DATA, 
  STREAM_OPTIONS 
} from '../data/curriculum';
import { 
  DETAILED_PRIORITY_TOPICS, 
  DetailedTopicBreakdown 
} from '../data/priorityDetailedBreakdowns';
import { CrucialTopicBreakdownCard } from './CrucialTopicBreakdownCard';

interface SuggestionsViewProps {
  compulsorySubjects?: Subject[];
  streamSubjects?: Subject[];
  fourthSubject?: Subject;
  religionSubject?: Subject;
  suggestionProgress: Record<string, boolean>;
  onToggleSuggestion: (subjectId: string, index: number) => void;
  currentStream?: StreamKey;
}

type TabKey = 'science' | 'business' | 'humanities' | 'compulsory';

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  compulsorySubjects = COMPULSORY_SUBJECTS,
  streamSubjects,
  fourthSubject,
  religionSubject = RELIGION_DATA.islam,
  suggestionProgress,
  onToggleSuggestion,
  currentStream = 'science',
}) => {
  // Stream tab switcher state (Science, Business Studies, Humanities, Compulsory)
  const [activeStreamTab, setActiveStreamTab] = useState<TabKey>(currentStream || 'science');
  
  // Priority filter: 'all' | '3star' | '2star'
  const [priorityFilter, setPriorityFilter] = useState<'all' | '3star' | '2star'>('all');
  
  // Search query for filtering topics or formulas
  const [searchQuery, setSearchQuery] = useState('');

  // Selected subject sub-filter within the stream ('all' or subjectId)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  // Toggle to show/hide all crucial breakdowns at once
  const [showAllBreakdowns, setShowAllBreakdowns] = useState(false);

  // Determine subjects to display based on active stream tab
  const activeStreamSubjects: Subject[] = useMemo(() => {
    switch (activeStreamTab) {
      case 'science': {
        const scienceSubs = [...(STREAM_SUBJECTS.science || [])];
        // If fourth subject is higher math or biology and not already in array, include it
        if (fourthSubject && !scienceSubs.some(s => s.id === fourthSubject.id)) {
          scienceSubs.push(fourthSubject);
        }
        return scienceSubs;
      }
      case 'business':
        return STREAM_SUBJECTS.business || [];
      case 'humanities':
        return STREAM_SUBJECTS.humanities || [];
      case 'compulsory':
        return [...compulsorySubjects, religionSubject];
      default:
        return streamSubjects || STREAM_SUBJECTS.science;
    }
  }, [activeStreamTab, compulsorySubjects, fourthSubject, religionSubject, streamSubjects]);

  // Relevant crucial topic breakdowns for the active tab
  const activeCrucialBreakdowns: DetailedTopicBreakdown[] = useMemo(() => {
    if (showAllBreakdowns) {
      return DETAILED_PRIORITY_TOPICS;
    }
    if (activeStreamTab === 'science') {
      // Show Physics (গতি), Chemistry (পদার্থের গঠন), Higher Math (স্থানাঙ্ক জ্যামিতি)
      return DETAILED_PRIORITY_TOPICS.filter(d => d.stream === 'science');
    }
    if (activeStreamTab === 'compulsory') {
      // Show General Math (সসীম ধারা)
      return DETAILED_PRIORITY_TOPICS.filter(d => d.stream === 'compulsory');
    }
    if (activeStreamTab === 'business') {
      return DETAILED_PRIORITY_TOPICS.filter(d => d.stream === 'business');
    }
    if (activeStreamTab === 'humanities') {
      return DETAILED_PRIORITY_TOPICS.filter(d => d.stream === 'humanities');
    }
    return DETAILED_PRIORITY_TOPICS;
  }, [activeStreamTab, showAllBreakdowns]);

  // Progress stats calculation
  const allStreamSubjectsWithSugg = activeStreamSubjects.filter(
    (sub) => sub.suggestions && sub.suggestions.length > 0
  );

  let streamTotalSuggCount = 0;
  let streamMasteredCount = 0;

  allStreamSubjectsWithSugg.forEach((sub) => {
    sub.suggestions?.forEach((_, idx) => {
      streamTotalSuggCount++;
      if (suggestionProgress[`${sub.id}_${idx}`]) {
        streamMasteredCount++;
      }
    });
  });

  const streamPercent = streamTotalSuggCount > 0 
    ? Math.round((streamMasteredCount / streamTotalSuggCount) * 100) 
    : 0;

  // Filter subjects and their suggestions
  const filteredSubjects = useMemo(() => {
    let list = activeStreamSubjects.filter(
      (sub) => sub.suggestions && sub.suggestions.length > 0
    );

    if (selectedSubjectId !== 'all') {
      list = list.filter((sub) => sub.id === selectedSubjectId);
    }

    return list.map((sub) => {
      const suggestions = (sub.suggestions || []).filter((s) => {
        // Priority filter
        if (priorityFilter === '3star' && s.priority !== '⭐️⭐️⭐️') return false;
        if (priorityFilter === '2star' && s.priority !== '⭐️⭐️') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const topicMatches = s.topic.toLowerCase().includes(q);
          const subMatches = sub.name.toLowerCase().includes(q);
          return topicMatches || subMatches;
        }

        return true;
      });

      return {
        ...sub,
        filteredSuggestions: suggestions,
      };
    }).filter(sub => sub.filteredSuggestions.length > 0);
  }, [activeStreamSubjects, selectedSubjectId, priorityFilter, searchQuery]);

  return (
    <div id="priority-suggestion-hub" className="space-y-6 font-hind">
      
      {/* 1. TOP HERO BANNER & STATS */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2.5 bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-2xl font-bold shadow-lg shadow-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-jakarta">
                SSC SUPER PRIORITY SUGGESTION HUB
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 font-anek">
                বোর্ড এক্সাম ২০২৬ স্পেশাল
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-jakarta">
              বিষয়ভিত্তিক প্রায়োরিটি সাজেশন ও সূত্রাবলি হাব
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              বিগত ১০ বছরের এসএসসি বোর্ড প্রশ্ন ও শীর্ষ ক্যাডেট কলেজের প্রশ্ন বিশ্লেষণের ভিত্তিতে নির্মিত হাই-ইল্ড সাজেশন।{' '}
              <strong className="text-amber-300 font-semibold">⭐️⭐️⭐️ (High Priority CQ/MCQ)</strong> এবং{' '}
              <strong className="text-cyan-300 font-semibold">⭐️⭐️ (Medium Priority)</strong> ট্যাগিং সহ গুরুত্বপূর্ণ অধ্যায়সমূহের বিশেষ ব্রেকডাউন।
            </p>
          </div>

          {/* Mastered Topics Counter Box */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 shrink-0 shadow-inner flex flex-col justify-center min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5 font-jakarta">
              <span>প্রস্তুতি সম্পন্নতা</span>
              <span className="text-amber-400 font-bold">{streamPercent}%</span>
            </div>

            <div className="text-2xl font-bold text-white font-anek flex items-baseline gap-1.5">
              <span>{streamMasteredCount}</span>
              <span className="text-xs font-normal text-slate-400">/ {streamTotalSuggCount} টপিক মাস্টার্ড</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${streamPercent}%` }}
              />
            </div>
            
            <div className="text-[10px] text-slate-400 text-center mt-2">
              টপিকের উপর ক্লিক করে সম্পন্ন (✓) মার্ক করুন
            </div>
          </div>
        </div>

        {/* 2. TAB SWITCHES: Science, Business Studies, Humanities, Compulsory */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-jakarta">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              বিভাগ নির্বাচন (SELECT STREAM):
            </span>
            <span className="text-xs text-slate-400 font-anek">
              যেকোনো বিভাগের সাজেশন দেখতে ট্যাবে ক্লিক করুন
            </span>
          </div>

          <div 
            id="stream-tabs-nav"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-white/10"
          >
            {/* Science Tab */}
            <button
              type="button"
              id="tab-btn-science"
              onClick={() => {
                setActiveStreamTab('science');
                setSelectedSubjectId('all');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeStreamTab === 'science'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Atom className="w-4 h-4 text-cyan-300 shrink-0" />
              <span className="whitespace-nowrap">বিজ্ঞান (Science)</span>
            </button>

            {/* Business Studies Tab */}
            <button
              type="button"
              id="tab-btn-business"
              onClick={() => {
                setActiveStreamTab('business');
                setSelectedSubjectId('all');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeStreamTab === 'business'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap">ব্যবসায় শিক্ষা (Business)</span>
            </button>

            {/* Humanities Tab */}
            <button
              type="button"
              id="tab-btn-humanities"
              onClick={() => {
                setActiveStreamTab('humanities');
                setSelectedSubjectId('all');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeStreamTab === 'humanities'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Landmark className="w-4 h-4 text-rose-300 shrink-0" />
              <span className="whitespace-nowrap">মানবিক (Humanities)</span>
            </button>

            {/* Compulsory & Religion Tab */}
            <button
              type="button"
              id="tab-btn-compulsory"
              onClick={() => {
                setActiveStreamTab('compulsory');
                setSelectedSubjectId('all');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeStreamTab === 'compulsory'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap">আবশ্যিক ও ধর্ম (Compulsory)</span>
            </button>
          </div>
        </div>

        {/* 3. Search & Priority Filtering Controls */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Priority filter buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 font-jakarta">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              প্রায়োরিটি ফিল্টার:
            </span>

            <button
              type="button"
              id="filter-btn-all"
              onClick={() => setPriorityFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                priorityFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 border border-white/5'
              }`}
            >
              সকল টপিক ({streamTotalSuggCount})
            </button>

            <button
              type="button"
              id="filter-btn-3star"
              onClick={() => setPriorityFilter('3star')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                priorityFilter === '3star'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 text-amber-300 hover:bg-slate-800 border border-amber-500/20'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>⭐️⭐️⭐️ High Priority CQ/MCQ</span>
            </button>

            <button
              type="button"
              id="filter-btn-2star"
              onClick={() => setPriorityFilter('2star')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                priorityFilter === '2star'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 text-cyan-300 hover:bg-slate-800 border border-cyan-500/20'
              }`}
            >
              <span>⭐️⭐️ Medium Priority</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-suggestion-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="টপিক, অধ্যায় বা সূত্র খুঁজুন..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all font-hind"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 4. Subject Sub-Chips */}
        <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 font-jakarta">বিষয় ফিল্টার:</span>
          <button
            type="button"
            onClick={() => setSelectedSubjectId('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedSubjectId === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            সকল বিষয় ({activeStreamSubjects.length})
          </button>
          {activeStreamSubjects.map((sub) => {
            const isSelected = selectedSubjectId === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SPECIFIC TOPIC BREAKDOWNS (REQUIREMENT 2):
          Physics (গতি অধ্যায়), Chemistry (পদার্থের গঠন), Higher Math (স্থানাঙ্ক জ্যামিতি), General Math (সসীম ধারা)
      */}
      {activeCrucialBreakdowns.length > 0 && (
        <section id="crucial-topic-breakdowns-section" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-jakarta">
                  CRUCIAL SSC TOPIC BREAKDOWNS & FORMULA CARDS
                </h3>
                <p className="text-[11px] text-slate-400">
                  বোর্ড পরীক্ষায় সর্বাধিক কমন অধ্যায়সমূহের বিশেষ গাণিতিক সূত্রাবলি, CQ প্যাটার্ন ও বিশ্লেষণ
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-toggle-all-breakdowns"
              onClick={() => setShowAllBreakdowns(!showAllBreakdowns)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
            >
              {showAllBreakdowns ? 'বর্তমান বিভাগের ব্রেকডাউনে ফিরুন' : 'সকল ব্রেকডাউন দেখুন (Physics, Chem, H.Math, G.Math)'}
            </button>
          </div>

          <div className="space-y-4">
            {activeCrucialBreakdowns.map((breakdown) => {
              // Find matching subject to toggle progress
              const matchSub = activeStreamSubjects.find(s => s.id === breakdown.subjectId) ||
                STREAM_SUBJECTS.science.find(s => s.id === breakdown.subjectId) ||
                COMPULSORY_SUBJECTS.find(s => s.id === breakdown.subjectId);
              
              const subId = matchSub ? matchSub.id : breakdown.subjectId;
              const originalIdx = matchSub?.suggestions?.findIndex(
                s => s.topic.includes(breakdown.chapter.split(':')[0]) || s.topic.includes('গতির সমীকরণ') || s.topic.includes('ইলেকট্রন বিন্যাস') || s.topic.includes('স্থানাঙ্ক') || s.topic.includes('সসীম ধারা')
              ) ?? 0;
              
              const key = `${subId}_${Math.max(0, originalIdx)}`;
              const isMastered = !!suggestionProgress[key];

              return (
                <CrucialTopicBreakdownCard
                  key={breakdown.id}
                  data={breakdown}
                  isMastered={isMastered}
                  onToggle={() => onToggleSuggestion(subId, Math.max(0, originalIdx))}
                  defaultExpanded={true}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* 3. ALL SUBJECT SUGGESTIONS GRID (PRIORITY TAGGING) */}
      <section id="all-subject-suggestions-grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 font-jakarta">
            <span className="w-2 h-4 rounded-full bg-amber-400" />
            বিষয়ভিত্তিক সকল সাজেশন তালিকা ({filteredSubjects.length} টি বিষয়)
          </h3>
          <span className="text-xs text-slate-400 font-anek">
            ⭐️⭐️⭐️ = হাই প্রায়োরিটি | ⭐️⭐️ = মিডিয়াম প্রায়োরিটি
          </span>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-white/5 space-y-2">
            <p className="text-sm text-slate-300 font-medium">কোনো সাজেশন টপিক পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-500">অনুসন্ধান শব্দ পরিবর্তন করে বা প্রায়োরিটি ফিল্টার রিলিজ করে দেখুন।</p>
            <button
              type="button"
              onClick={() => {
                setPriorityFilter('all');
                setSearchQuery('');
                setSelectedSubjectId('all');
              }}
              className="mt-2 px-4 py-1.5 bg-slate-800 text-amber-300 rounded-xl text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSubjects.map((sub) => {
              const suggestions = sub.filteredSuggestions;
              const isReligion = sub.id === religionSubject.id;

              return (
                <div
                  key={sub.id}
                  id={`subject-suggestions-${sub.id}`}
                  className="bg-slate-900/85 rounded-3xl border border-white/10 p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Subject Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3 h-3 rounded-full ${isReligion ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                        <div>
                          <h4 className="font-bold text-base text-white">{sub.name}</h4>
                          <span className="text-[11px] text-slate-400">
                            মোট {sub.chapters?.length || 0}টি অধ্যায়
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-white/5 font-anek">
                        {suggestions.length}টি টপিক
                      </span>
                    </div>

                    {/* Suggestions List */}
                    <div className="space-y-3">
                      {suggestions.map((sugg, idx) => {
                        const originalIdx = sub.suggestions?.indexOf(sugg) ?? idx;
                        const key = `${sub.id}_${originalIdx}`;
                        const isDone = !!suggestionProgress[key];
                        const isHighPriority = sugg.priority === '⭐️⭐️⭐️';

                        return (
                          <div
                            key={key}
                            id={`suggestion-item-${key}`}
                            onClick={() => onToggleSuggestion(sub.id, originalIdx)}
                            className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer select-none transition-all ${
                              isDone
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100 shadow-sm'
                                : isHighPriority
                                ? 'bg-slate-800/70 border-amber-500/25 hover:border-amber-500/50 hover:bg-slate-800/95 text-white shadow-md'
                                : 'bg-slate-800/40 border-white/5 hover:border-white/15 hover:bg-slate-800/70 text-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                type="button"
                                aria-label="Toggle suggestion status"
                                className="mt-0.5 shrink-0 focus:outline-none"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                ) : (
                                  <Circle className={`w-4 h-4 ${isHighPriority ? 'text-amber-400' : 'text-slate-500'} hover:text-slate-300`} />
                                )}
                              </button>

                              <div className="space-y-1">
                                <span
                                  className={`text-xs sm:text-sm font-medium block leading-snug ${
                                    isDone ? 'line-through text-slate-400' : 'text-slate-100 font-semibold'
                                  }`}
                                >
                                  {sugg.topic}
                                </span>

                                {/* Priority Badge Tag */}
                                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                  {isHighPriority ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 font-anek">
                                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                      ⭐️⭐️⭐️ High Priority CQ/MCQ
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-[10px] font-bold border border-cyan-500/25 font-anek">
                                      ⭐️⭐️ Medium Priority
                                    </span>
                                  )}

                                  <span className="text-[10px] text-slate-400">
                                    {isHighPriority ? 'বোর্ড পরীক্ষায় নিশ্চিত প্রশ্ন / ১০০% কমন' : 'স্ট্যান্ডার্ড সৃজনশীল ও নৈর্ব্যক্তিক'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Pill */}
                            <span
                              className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-anek ${
                                isDone 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                  : isHighPriority
                                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {isDone ? 'সম্পন্ন ✓' : 'বাকি'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Tip */}
                  <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      বোর্ড প্রশ্ন ও টেস্ট পেপার অনুশীলন সম্পন্ন করুন।
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
