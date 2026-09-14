import { Subject, Chapter, ChapterProgressData, ReligionBn, StreamKey } from '../types';
import { getChapterTaskStatus, toBengaliNumber, formatBengaliProgress } from './progressCalculator';

export type ComplexityTier = 'high' | 'moderate' | 'standard';

export interface SubjectComplexityInfo {
  tier: ComplexityTier;
  tierLabelBn: string;
  minHours: number;
  maxHours: number;
  avgHours: number;
  durationFormattedBn: string;
  recommendedDailyMinutes: number;
  badgeColor: string;
  descriptionBn: string;
}

export interface FixedTimeBuffers {
  sleepHours: number; // 7 to 8 hours (default 7.5h = 450 mins)
  sleepMinutes: number;
  mealsPersonalHours: number; // 3 hours (180 mins)
  mealsPersonalMinutes: number;
  schoolCoachingHours: number; // default 5.5 hours (330 mins)
  schoolCoachingMinutes: number;
  worshipPrayerHours: number; // default 1.8 hours (110 mins for 5 daily prayers or worship)
  worshipPrayerMinutes: number;
  totalFixedMinutes: number;
  netAvailableStudyMinutes: number;
  netAvailableStudyHours: number;
}

export interface AdaptiveTargetChapter {
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  totalChaptersInSubject: number;
  complexity: SubjectComplexityInfo;
  taskStatus: {
    conceptClear: boolean;
    cqSolve: boolean;
    mcqSolve: boolean;
    percentage: number;
    earnedPoints: number;
    isFullyDone: boolean;
    tasksDoneCount: number;
  };
  progressData?: ChapterProgressData;
  isAheadOfSchedule?: boolean;
  priorityScore: number;
  reasonBn: string;
}

export interface BoardRankAccelerationMetrics {
  targetRankLabel: string; // 'Board Top Rank #1 (Roll 1 Standard)'
  paceStatus: 'top_rank_optimal' | 'crunch_acceleration' | 'hyper_velocity' | 'steady_pace';
  paceStatusBn: string;
  recommendedStudyHours: number;
  backlogChapterCount: number;
  totalChaptersInScope: number;
  daysRemainingToExam: number;
  requiredDailyChapterVelocity: number; // e.g. 0.35 chapters/day
  accelerationReasonBn: string;
  leisureBufferDeductionMins: number;
  sleepBufferHours: number;
  isCrunchActive: boolean;
}

export interface AdaptiveScheduleResult {
  currentDateStr: string;
  buffers: FixedTimeBuffers;
  targetChapter: AdaptiveTargetChapter | null;
  nextQueuedChapter: AdaptiveTargetChapter | null;
  allUnfinishedChaptersCount: number;
  completedChaptersTodayCount: number;
  estimatedDaysToCompleteSyllabus: number;
  dailyStudyHoursAllocated: number;
  recalculationTimestamp: string;
  boardRankMetrics: BoardRankAccelerationMetrics;
}

/**
 * 0. BOARD RANK #1 DYNAMIC ACCELERATION CALCULATOR
 * Analyzes exam target date and unfinished backlog to dynamically scale
 * study targets and trim leisure buffers for Roll #1 pace.
 */
export const calculateBoardRankAcceleration = (
  examDateStr: string = '2028-02-15',
  unfinishedChaptersCount: number = 0,
  totalChaptersCount: number = 0
): BoardRankAccelerationMetrics => {
  const targetTime = new Date(examDateStr).getTime();
  const now = Date.now();
  const diffDays = Math.max(1, Math.floor((targetTime - now) / (1000 * 60 * 60 * 24)));

  // Velocity needed (Chapters per day to finish 100% with 2 rounds of revision)
  // Roll 1 standard requires syllabus completion + 30 days final revision buffer
  const effectiveExamDays = Math.max(15, diffDays - 30);
  const totalChaptersToRevise = unfinishedChaptersCount > 0 ? unfinishedChaptersCount : Math.max(1, totalChaptersCount);
  const velocity = Math.round((totalChaptersToRevise / effectiveExamDays) * 100) / 100;

  let recommendedHours = 8.0;
  let paceStatus: BoardRankAccelerationMetrics['paceStatus'] = 'top_rank_optimal';
  let paceStatusBn = 'বোর্ড টপ র‍্যাংক #১ স্ট্যান্ডার্ড পেস';
  let accelerationReasonBn = 'প্রতিদিন ৩-৪টি বিষয়ের কনসেপ্ট, CQ ও MCQ গভীর বিশ্লেষণের মাধ্যমে রোল ১ স্ট্যান্ডার্ড বজায় রাখা হচ্ছে।';
  let leisureDeductionMins = 0;
  let sleepBuffer = 7.5;
  let isCrunchActive = false;

  if (diffDays <= 60 || (unfinishedChaptersCount > 25 && diffDays <= 120)) {
    // Hyper Velocity / Crunch Mode
    recommendedHours = 10.5;
    paceStatus = 'hyper_velocity';
    paceStatusBn = 'হাইপার অ্যাক্সিলারেশন (বোর্ড গোল্ড মেডেল পেস)';
    accelerationReasonBn = `পরীক্ষার বাকি মাত্র ${toBengaliNumber(diffDays)} দিন এবং ${toBengaliNumber(unfinishedChaptersCount)}টি অধ্যায় বাকি। বিনোদন বাফার কমিয়ে সর্বোচ্চ ১০.৫ ঘণ্টা স্টাডি স্লট অটো-অ্যালোকেট করা হয়েছে।`;
    leisureDeductionMins = 60;
    sleepBuffer = 6.8;
    isCrunchActive = true;
  } else if (diffDays <= 120 || unfinishedChaptersCount > 35) {
    // High Crunch Acceleration
    recommendedHours = 9.0;
    paceStatus = 'crunch_acceleration';
    paceStatusBn = 'ক্রাঞ্চ মোড অ্যাক্সিলারেশন (রোল ১ টার্গেট)';
    accelerationReasonBn = `সিলেবাসের গতি বাড়াতে ও ব্যাকলগ ক্লিয়ার করতে দৈনিক ৯.০ ঘণ্টা নিবিড় প্রস্তুতি শিডিউল করা হয়েছে।`;
    leisureDeductionMins = 30;
    sleepBuffer = 7.0;
    isCrunchActive = true;
  } else {
    // Optimal Roll 1 Standard
    recommendedHours = 8.0;
    paceStatus = 'top_rank_optimal';
    paceStatusBn = 'বোর্ড টপ র‍্যাংক #১ স্ট্যান্ডার্ড পেস';
    accelerationReasonBn = 'নিয়মিত ধারাবাহিকতায় সর্বোচ্চ ৪টি বিষয় রোটেশনের মাধ্যমে শীর্ষ মেধা তালিকায় অবস্থানের প্রস্তুতি।';
    leisureDeductionMins = 0;
    sleepBuffer = 7.5;
    isCrunchActive = false;
  }

  return {
    targetRankLabel: 'Board Top Rank #1 (Roll 1 Standard)',
    paceStatus,
    paceStatusBn,
    recommendedStudyHours: recommendedHours,
    backlogChapterCount: unfinishedChaptersCount,
    totalChaptersInScope: totalChaptersCount,
    daysRemainingToExam: diffDays,
    requiredDailyChapterVelocity: velocity,
    accelerationReasonBn,
    leisureBufferDeductionMins: leisureDeductionMins,
    sleepBufferHours: sleepBuffer,
    isCrunchActive,
  };
};

/**
 * 1. DYNAMIC TIME BUFFERING & COMPLEXITY CLASSIFICATION
 * Math/Physics: 4-5 hours average per chapter
 * Bangla/Religion: 2-3 hours average per chapter
 * Others (Biology, Chemistry, Accounting, ICT): 3.5-4 hours
 */
export const getSubjectComplexity = (subjectName: string): SubjectComplexityInfo => {
  const name = subjectName.toLowerCase();

  // High Complexity: Math, Higher Math, Physics, Accounting, Chemistry (4 - 5h)
  if (
    name.includes('গণিত') || 
    name.includes('math') || 
    name.includes('পদার্থ') || 
    name.includes('physics') || 
    name.includes('হিসাববিজ্ঞান') || 
    name.includes('রসায়ন') || 
    name.includes('chemistry')
  ) {
    return {
      tier: 'high',
      tierLabelBn: 'উচ্চ জটিলতা (Hard)',
      minHours: 4,
      maxHours: 5,
      avgHours: 4.5,
      durationFormattedBn: '৪-৫ ঘণ্টা / অধ্যায়',
      recommendedDailyMinutes: 270,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      descriptionBn: 'গাণিতিক সমাধান, সূত্র প্রতিপাদন ও সৃজনশীল গভীর বিশ্লেষণ প্রয়োজন।',
    };
  }

  // Standard Complexity: Bangla, Religion, BGS, History, Civics, Geography (2 - 3h)
  if (
    name.includes('বাংলা') || 
    name.includes('bangla') || 
    name.includes('ধর্ম') || 
    name.includes('নৈতিক') || 
    name.includes('religion') || 
    name.includes('ইসলাম') || 
    name.includes('হিন্দু') || 
    name.includes('বৌদ্ধ') || 
    name.includes('খ্রিস্টান') || 
    name.includes('ইতিহাস') || 
    name.includes('ভূগোল') || 
    name.includes('পৌরনীতি') ||
    name.includes('পরিচয়')
  ) {
    return {
      tier: 'standard',
      tierLabelBn: 'সাধারণ জটিলতা (Medium)',
      minHours: 2,
      maxHours: 3,
      avgHours: 2.5,
      durationFormattedBn: '২-৩ ঘণ্টা / অধ্যায়',
      recommendedDailyMinutes: 150,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      descriptionBn: 'বই রিডিং, মূল ভাব ও চরিত্র বিশ্লেষণ, এবং তথ্যভিত্তিক MCQ রিভিশন।',
    };
  }

  // Moderate Complexity: Biology, English, ICT, Finance, Economics, Business (3 - 4h)
  return {
    tier: 'moderate',
    tierLabelBn: 'মাঝারি জটিলতা (Moderate)',
    minHours: 3,
    maxHours: 4,
    avgHours: 3.5,
    durationFormattedBn: '৩-৪ ঘণ্টা / অধ্যায়',
    recommendedDailyMinutes: 210,
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    descriptionBn: 'শব্দার্থ, ডায়াগ্রাম/চিত্র, তথ্য প্রযুক্তি ও সৃজনশীল ব্যাখ্যামূলক প্রশ্ন।',
  };
};

/**
 * 2. FIXED TIME BUFFER DEDUCTION CALCULATOR
 * Excludes fixed blocks:
 * - Sleep: 7-8h (default 7.5h = 450m)
 * - Meals & Personal care: 3h (180m)
 * - School / Coaching: 5.5h (330m)
 * - Daily Prayer / Worship: 1.8h (110m for 5 prayers or morning/evening worship)
 */
export const calculateDynamicTimeBuffers = (
  custom?: Partial<{
    sleepHours: number;
    mealsPersonalHours: number;
    schoolCoachingHours: number;
    worshipPrayerHours: number;
  }>
): FixedTimeBuffers => {
  const sleepHours = custom?.sleepHours ?? 7.5; // 7.5 hours
  const mealsPersonalHours = custom?.mealsPersonalHours ?? 3.0; // 3 hours
  const schoolCoachingHours = custom?.schoolCoachingHours ?? 5.5; // 5.5 hours
  const worshipPrayerHours = custom?.worshipPrayerHours ?? 1.8; // ~1h 50m

  const sleepMinutes = Math.round(sleepHours * 60);
  const mealsPersonalMinutes = Math.round(mealsPersonalHours * 60);
  const schoolCoachingMinutes = Math.round(schoolCoachingHours * 60);
  const worshipPrayerMinutes = Math.round(worshipPrayerHours * 60);

  const totalFixedMinutes = sleepMinutes + mealsPersonalMinutes + schoolCoachingMinutes + worshipPrayerMinutes;
  const netAvailableStudyMinutes = Math.max(60, 1440 - totalFixedMinutes);
  const netAvailableStudyHours = Math.round((netAvailableStudyMinutes / 60) * 10) / 10;

  return {
    sleepHours,
    sleepMinutes,
    mealsPersonalHours,
    mealsPersonalMinutes,
    schoolCoachingHours,
    schoolCoachingMinutes,
    worshipPrayerHours,
    worshipPrayerMinutes,
    totalFixedMinutes,
    netAvailableStudyMinutes,
    netAvailableStudyHours,
  };
};

/**
 * 3. ADAPTIVE TARGET CHAPTER FINDER & PRIORITY QUEUE
 * Ranks all uncompleted chapters based on:
 * - In-progress status or partial task completion (Concept clear or CQ already done)
 * - Subject complexity (High complexity Math/Physics prioritized for prime study slots)
 * - Sequential syllabus order
 */
export const findAdaptiveTargetChapters = (
  subjects: Subject[],
  chapterProgress: Record<string, ChapterProgressData>,
  customSelectedChapterIds?: string[],
  completedTodayChapterIds: string[] = []
): { currentTarget: AdaptiveTargetChapter | null; nextQueued: AdaptiveTargetChapter | null; unfinishedCount: number } => {
  const candidates: AdaptiveTargetChapter[] = [];

  subjects.forEach((subject) => {
    const complexity = getSubjectComplexity(subject.name);

    subject.chapters.forEach((chapter, index) => {
      // Filter if custom selection is active and chapter is not selected
      if (
        customSelectedChapterIds &&
        customSelectedChapterIds.length > 0 &&
        !customSelectedChapterIds.includes(chapter.id)
      ) {
        return;
      }

      const prog = chapterProgress[chapter.id];
      const taskStatus = getChapterTaskStatus(prog);

      // If chapter is already 100% finished or explicitly marked completed today, skip as current target
      if (taskStatus.isFullyDone || completedTodayChapterIds.includes(chapter.id)) {
        return;
      }

      // Priority Scoring:
      // High score = Higher priority to tackle today
      let priorityScore = 100;
      let reasonBn = 'পরবর্তী নির্ধারিত অধ্যায়';

      // Boost 1: Currently in-progress or partial tasks done
      if (prog?.status === 'in_progress' || taskStatus.tasksDoneCount > 0) {
        priorityScore += 150 + taskStatus.tasksDoneCount * 40;
        reasonBn = `চলমান অধ্যায় (${toBengaliNumber(taskStatus.tasksDoneCount)}/৩ টাস্ক সম্পন্ন)`;
      }

      // Boost 2: Subject Complexity (High complexity needs daytime slots)
      if (complexity.tier === 'high') {
        priorityScore += 60;
      } else if (complexity.tier === 'moderate') {
        priorityScore += 30;
      }

      // Negative offset based on chapter index so earlier chapters are prioritized
      priorityScore -= index * 2;

      candidates.push({
        subjectId: subject.id,
        subjectName: subject.name,
        chapterId: chapter.id,
        chapterName: chapter.name,
        chapterIndex: index + 1,
        totalChaptersInSubject: subject.chapters.length,
        complexity,
        taskStatus,
        progressData: prog,
        priorityScore,
        reasonBn,
      });
    });
  });

  // Sort descending by priorityScore
  candidates.sort((a, b) => b.priorityScore - a.priorityScore);

  const currentTarget = candidates[0] || null;
  const nextQueued = candidates[1] || null;

  return {
    currentTarget,
    nextQueued,
    unfinishedCount: candidates.length,
  };
};

/**
 * 4. FULL RE-SCHEDULING ENGINE
 * Recalculates the student's study day and projects estimated days to finish
 */
export const runAdaptiveRoutineEngine = (
  subjects: Subject[],
  chapterProgress: Record<string, ChapterProgressData>,
  customSelectedChapterIds?: string[],
  completedTodayChapterIds: string[] = [],
  customBuffers?: Partial<FixedTimeBuffers>,
  examDateStr: string = '2028-02-15'
): AdaptiveScheduleResult => {
  const buffers = calculateDynamicTimeBuffers(customBuffers);
  const { currentTarget, nextQueued, unfinishedCount } = findAdaptiveTargetChapters(
    subjects,
    chapterProgress,
    customSelectedChapterIds,
    completedTodayChapterIds
  );

  // Calculate daily hours available for study
  const dailyStudyHoursAllocated = buffers.netAvailableStudyHours;

  let totalChaptersInScope = 0;
  // Estimate total hours needed for all unfinished chapters
  let totalHoursNeeded = 0;
  subjects.forEach((s) => {
    const cInfo = getSubjectComplexity(s.name);
    s.chapters.forEach((c) => {
      if (
        customSelectedChapterIds &&
        customSelectedChapterIds.length > 0 &&
        !customSelectedChapterIds.includes(c.id)
      ) {
        return;
      }
      totalChaptersInScope += 1;
      const st = getChapterTaskStatus(chapterProgress[c.id]);
      if (!st.isFullyDone) {
        const remainingFraction = Math.max(0.2, (100 - st.percentage) / 100);
        totalHoursNeeded += cInfo.avgHours * remainingFraction;
      }
    });
  });

  const estimatedDaysToCompleteSyllabus = dailyStudyHoursAllocated > 0
    ? Math.max(1, Math.ceil(totalHoursNeeded / dailyStudyHoursAllocated))
    : 120;

  const boardRankMetrics = calculateBoardRankAcceleration(
    examDateStr,
    unfinishedCount,
    totalChaptersInScope
  );

  return {
    currentDateStr: new Date().toLocaleDateString('bn-BD', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    buffers,
    targetChapter: currentTarget,
    nextQueuedChapter: nextQueued,
    allUnfinishedChaptersCount: unfinishedCount,
    completedChaptersTodayCount: completedTodayChapterIds.length,
    estimatedDaysToCompleteSyllabus,
    dailyStudyHoursAllocated,
    recalculationTimestamp: new Date().toLocaleTimeString('bn-BD'),
    boardRankMetrics,
  };
};
