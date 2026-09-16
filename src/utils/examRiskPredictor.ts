/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChapterProgressData, ChapterWeakPointData, WeakPointStatus } from '../types';
import { toBengaliNumber } from './progressCalculator';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface ChapterRiskAssessment {
  chapterId: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskLabelBn: string;
  riskBadgeClass: string;
  riskIcon: string;
  reasons: string[];
  recommendedAction: string;
  daysSinceLastReview: number | null;
}

/**
 * Calculates Exam Risk % by correlating:
 * 1. Completion & Task Status (Reading, CQ, MCQ)
 * 2. Weak Points checklist status (struggling, needs_revision, custom notes)
 * 3. Revision recency (days since completion/review)
 */
export function calculateChapterExamRisk(
  chapterId: string,
  progress?: ChapterProgressData,
  weakPointData?: ChapterWeakPointData
): ChapterRiskAssessment {
  let riskScore = 0;
  const reasons: string[] = [];

  // 1. Base Task Completion Risk (Max 45 points)
  if (!progress || progress.status === 'not_started') {
    riskScore += 45;
    reasons.push('অধ্যায়টি এখনো শুরু করা হয়নি');
  } else if (progress.status === 'in_progress') {
    let uncompletedTasks = 0;
    if (!progress.bookReading) {
      uncompletedTasks++;
      reasons.push('মূল বই রিডিং ও কনসেপ্ট বাকি');
    }
    if (!progress.cqPractice) {
      uncompletedTasks++;
      reasons.push('সৃজনশীল (CQ) সমাধান বাকি');
    }
    if (!progress.mcqPractice) {
      uncompletedTasks++;
      reasons.push('বহুনির্বাচনী (MCQ) অনুশীলন বাকি');
    }
    riskScore += 10 + uncompletedTasks * 10;
  } else if (progress.status === 'completed' || progress.status === 'revised') {
    // If marked completed but missing specific task checks
    if (!progress.cqPractice) {
      riskScore += 12;
      reasons.push('বোর্ড CQ সমাধান নিশ্চিত করা প্রয়োজন');
    }
    if (!progress.mcqPractice) {
      riskScore += 8;
      reasons.push('MCQ টেস্ট সম্পন্ন করা প্রয়োজন');
    }
  }

  // 2. Weak Points Weighting (Max 40 points)
  if (weakPointData) {
    let strugglingCount = 0;
    let needsRevisionCount = 0;
    let unresolvedCustom = 0;

    Object.values(weakPointData.topicChecklist || {}).forEach((status: WeakPointStatus) => {
      if (status === 'struggling') strugglingCount++;
      else if (status === 'needs_revision') needsRevisionCount++;
    });

    (weakPointData.customWeakPoints || []).forEach((cp) => {
      if (!cp.isResolved) unresolvedCustom++;
    });

    if (strugglingCount > 0) {
      const added = Math.min(30, strugglingCount * 12);
      riskScore += added;
      reasons.push(`${toBengaliNumber(strugglingCount)}টি জটিল টপিক এখনো অমীমাংসিত`);
    }

    if (needsRevisionCount > 0) {
      const added = Math.min(15, needsRevisionCount * 6);
      riskScore += added;
      reasons.push(`${toBengaliNumber(needsRevisionCount)}টি টপিকে রিভিশন প্রয়োজন`);
    }

    if (unresolvedCustom > 0) {
      const added = Math.min(15, unresolvedCustom * 7);
      riskScore += added;
      reasons.push(`${toBengaliNumber(unresolvedCustom)}টি ব্যক্তিগত দুর্বল পয়েন্ট নোট করা আছে`);
    }
  }

  // 3. Revision Recency Risk (Max 15 points)
  let daysSinceLastReview: number | null = null;
  if (progress?.completedAt) {
    const completedDate = new Date(progress.completedAt);
    const now = new Date();
    const diffMs = now.getTime() - completedDate.getTime();
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    daysSinceLastReview = diffDays;

    if (diffDays > 21) {
      riskScore += 15;
      reasons.push(`গত ${toBengaliNumber(diffDays)} দিন যাবত কোনো রিভিশন হয়নি`);
    } else if (diffDays > 10) {
      riskScore += 8;
      reasons.push(`গত ${toBengaliNumber(diffDays)} দিন আগে পড়া হয়েছে`);
    }
  } else if (progress?.status === 'completed') {
    riskScore += 5;
    reasons.push('সর্বশেষ রিভিশনের তারিখ অনুল্লিখিত');
  }

  // Clamp risk score to 0 - 100
  riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

  // If chapter is fully revised and marked mastered with 0 weaknesses, give minimal risk
  if (
    progress?.status === 'revised' &&
    progress?.bookReading &&
    progress?.cqPractice &&
    progress?.mcqPractice &&
    (!weakPointData || Object.values(weakPointData.topicChecklist || {}).every((s) => s === 'mastered'))
  ) {
    riskScore = Math.min(riskScore, 10);
  }

  // Determine Risk Level and Visuals
  let riskLevel: RiskLevel = 'low';
  let riskLabelBn = `ঝুঁকি কম • ${toBengaliNumber(riskScore)}%`;
  let riskBadgeClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  let riskIcon = '🟢';
  let recommendedAction = 'নিয়মিত চর্চা বজায় রাখুন ও সংক্ষিপ্ত কুইজ দিন';

  if (riskScore >= 70) {
    riskLevel = 'critical';
    riskLabelBn = `উচ্চ ঝুঁকি • ${toBengaliNumber(riskScore)}% 🔥`;
    riskBadgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20';
    riskIcon = '🔴';
    recommendedAction = 'অবিলম্বে কনসেপ্ট ক্লিয়ার করুন ও ৫টি CQ সলভ করুন';
  } else if (riskScore >= 45) {
    riskLevel = 'high';
    riskLabelBn = `সতর্কতা • ${toBengaliNumber(riskScore)}%`;
    riskBadgeClass = 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    riskIcon = '🟠';
    recommendedAction = 'দুর্বল টপিকগুলো চিহ্নিত করে ৫ মিনিটের সাইলেন্ট রিকল দিন';
  } else if (riskScore >= 25) {
    riskLevel = 'moderate';
    riskLabelBn = `মাঝারি • ${toBengaliNumber(riskScore)}%`;
    riskBadgeClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    riskIcon = '🟡';
    recommendedAction = 'বোর্ড স্ট্যান্ডার্ড ২০টি MCQ সমাধান করুন';
  }

  return {
    chapterId,
    riskScore,
    riskLevel,
    riskLabelBn,
    riskBadgeClass,
    riskIcon,
    reasons: reasons.length > 0 ? reasons : ['অধ্যায় প্রস্তুতি সন্তোষজনক'],
    recommendedAction,
    daysSinceLastReview,
  };
}
