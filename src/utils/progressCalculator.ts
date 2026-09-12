import { ChapterProgressData, Subject } from '../types';

export const TASK_WEIGHTS = {
  CONCEPT_CLEAR: 33.3,
  CQ_SOLVE: 33.3,
  MCQ_SOLVE: 33.4,
} as const;

// Convert English numbers/digits to Bengali numerals
export const toBengaliNumber = (num: number | string): string => {
  const banglaDigits: Record<string, string> = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };
  return String(num).replace(/[0-9]/g, (w) => banglaDigits[w] || w);
};

// Formats number to Bengali progress string e.g., "%১০০ সম্পন্ন" or "%৩৩.৩ সম্পন্ন"
export const formatBengaliProgress = (percent: number): string => {
  const clamped = Math.max(0, Math.min(100, percent));
  const rounded = clamped % 1 === 0 ? clamped.toFixed(0) : clamped.toFixed(1);
  return `%${toBengaliNumber(rounded)} সম্পন্ন`;
};

export interface ChapterTaskStatus {
  conceptClear: boolean;
  cqSolve: boolean;
  mcqSolve: boolean;
  earnedPoints: number;
  percentage: number;
  isFullyDone: boolean;
  tasksDoneCount: number;
}

// Calculate task status and earned points for an individual chapter
export const getChapterTaskStatus = (progress?: ChapterProgressData): ChapterTaskStatus => {
  const isOverallCompleted = progress?.status === 'completed' || progress?.status === 'revised';
  const conceptClear = Boolean(progress?.bookReading ?? isOverallCompleted);
  const cqSolve = Boolean(progress?.cqPractice ?? isOverallCompleted);
  const mcqSolve = Boolean(progress?.mcqPractice ?? isOverallCompleted);

  const tasksDoneCount = (conceptClear ? 1 : 0) + (cqSolve ? 1 : 0) + (mcqSolve ? 1 : 0);
  const isFullyDone = conceptClear && cqSolve && mcqSolve;

  // Exact weights: 33.3 + 33.3 + 33.4 = 100
  let earnedPoints = 0;
  if (conceptClear) earnedPoints += TASK_WEIGHTS.CONCEPT_CLEAR;
  if (cqSolve) earnedPoints += TASK_WEIGHTS.CQ_SOLVE;
  if (mcqSolve) earnedPoints += TASK_WEIGHTS.MCQ_SOLVE;

  // Round points cleanly
  earnedPoints = Math.round(earnedPoints * 10) / 10;
  const percentage = isFullyDone ? 100 : Math.min(100, earnedPoints);

  return {
    conceptClear,
    cqSolve,
    mcqSolve,
    earnedPoints,
    percentage,
    isFullyDone,
    tasksDoneCount,
  };
};

export interface AlgorithmicProgressResult {
  totalSelectedChapters: number;
  completedChaptersCount: number;
  inProgressChaptersCount: number;
  notStartedChaptersCount: number;

  totalPossiblePoints: number; // totalSelectedChapters * 100
  sumOfEarnedTaskPoints: number;
  totalProgressPercent: number; // Formula: (sumOfEarnedTaskPoints / (totalSelectedChapters * 100)) * 100

  conceptClearCount: number;
  conceptClearPoints: number;
  conceptClearPercent: number;

  cqSolveCount: number;
  cqSolvePoints: number;
  cqSolvePercent: number;

  mcqSolveCount: number;
  mcqSolvePoints: number;
  mcqSolvePercent: number;

  formattedBengaliProgress: string; // e.g. "%১০০ সম্পন্ন"
}

/**
 * CALCULATION ALGORITHM:
 * 1. Each selected chapter has 3 tasks:
 *    - Concept Clear = 33.3% Weight
 *    - CQ Solve = 33.3% Weight
 *    - MCQ Solve = 33.4% Weight
 * 2. Formula:
 *    Total Progress (%) = (Sum of Earned Task Points / Total Selected Chapters * 100) * 100.
 */
export const calculateAlgorithmicProgress = (
  subjects: Subject[],
  chapterProgress: Record<string, ChapterProgressData>,
  selectedChapterIds?: string[]
): AlgorithmicProgressResult => {
  const selectedSet = selectedChapterIds ? new Set(selectedChapterIds) : null;

  // Gather only active selected chapters
  const activeChapterIds: string[] = [];
  subjects.forEach((subject) => {
    subject.chapters.forEach((chapter) => {
      if (!selectedSet || selectedSet.has(chapter.id)) {
        activeChapterIds.push(chapter.id);
      }
    });
  });

  const totalSelectedChapters = activeChapterIds.length;
  const totalPossiblePoints = totalSelectedChapters * 100;

  if (totalSelectedChapters === 0) {
    return {
      totalSelectedChapters: 0,
      completedChaptersCount: 0,
      inProgressChaptersCount: 0,
      notStartedChaptersCount: 0,
      totalPossiblePoints: 0,
      sumOfEarnedTaskPoints: 0,
      totalProgressPercent: 0,
      conceptClearCount: 0,
      conceptClearPoints: 0,
      conceptClearPercent: 0,
      cqSolveCount: 0,
      cqSolvePoints: 0,
      cqSolvePercent: 0,
      mcqSolveCount: 0,
      mcqSolvePoints: 0,
      mcqSolvePercent: 0,
      formattedBengaliProgress: '%০ সম্পন্ন',
    };
  }

  let completedChaptersCount = 0;
  let inProgressChaptersCount = 0;
  let notStartedChaptersCount = 0;

  let sumOfEarnedTaskPoints = 0;
  let conceptClearCount = 0;
  let cqSolveCount = 0;
  let mcqSolveCount = 0;

  activeChapterIds.forEach((chapterId) => {
    const prog = chapterProgress[chapterId];
    const taskStatus = getChapterTaskStatus(prog);

    sumOfEarnedTaskPoints += taskStatus.earnedPoints;

    if (taskStatus.conceptClear) conceptClearCount++;
    if (taskStatus.cqSolve) cqSolveCount++;
    if (taskStatus.mcqSolve) mcqSolveCount++;

    if (taskStatus.isFullyDone) {
      completedChaptersCount++;
    } else if (taskStatus.tasksDoneCount > 0 || prog?.status === 'in_progress') {
      inProgressChaptersCount++;
    } else {
      notStartedChaptersCount++;
    }
  });

  // Calculate algorithmic percentage:
  // Formula: (sumOfEarnedTaskPoints / (totalSelectedChapters * 100)) * 100
  const rawPercentage = (sumOfEarnedTaskPoints / totalPossiblePoints) * 100;
  const totalProgressPercent = Math.min(100, Math.round(rawPercentage * 10) / 10);

  // Sub-task points and percentages
  const conceptClearPoints = Math.round(conceptClearCount * TASK_WEIGHTS.CONCEPT_CLEAR * 10) / 10;
  const conceptClearPercent = Math.round((conceptClearCount / totalSelectedChapters) * 100);

  const cqSolvePoints = Math.round(cqSolveCount * TASK_WEIGHTS.CQ_SOLVE * 10) / 10;
  const cqSolvePercent = Math.round((cqSolveCount / totalSelectedChapters) * 100);

  const mcqSolvePoints = Math.round(mcqSolveCount * TASK_WEIGHTS.MCQ_SOLVE * 10) / 10;
  const mcqSolvePercent = Math.round((mcqSolveCount / totalSelectedChapters) * 100);

  sumOfEarnedTaskPoints = Math.round(sumOfEarnedTaskPoints * 10) / 10;

  return {
    totalSelectedChapters,
    completedChaptersCount,
    inProgressChaptersCount,
    notStartedChaptersCount,
    totalPossiblePoints,
    sumOfEarnedTaskPoints,
    totalProgressPercent,
    conceptClearCount,
    conceptClearPoints,
    conceptClearPercent,
    cqSolveCount,
    cqSolvePoints,
    cqSolvePercent,
    mcqSolveCount,
    mcqSolvePoints,
    mcqSolvePercent,
    formattedBengaliProgress: formatBengaliProgress(totalProgressPercent),
  };
};
