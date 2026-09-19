import { Subject, StreamKey, ReligionBn, ChapterProgressData, ChapterWeakPointData, ExamConfigData } from '../types';
import { toBengaliNumber } from './progressCalculator';

export type SubjectTier = 'core_complex' | 'conceptual_applied' | 'standard_theory';

export interface SubjectAiWeightInfo {
  tier: SubjectTier;
  tierLabelBn: string;
  baseDurationMinutes: number; // e.g. 90-120, 60-75, 45-60
  durationFormattedBn: string;
  hasWeakPointBoost: boolean;
  boostMinutes: number;
  totalAllocatedMinutes: number;
  weakTopicsList?: string[];
  badgeColor: string;
}

export interface LiveCountdownInfo {
  examDateStr: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  isUrgent: boolean; // < 30 days
  isCrunch: boolean; // 30-75 days
  isSteady: boolean; // > 75 days
  statusBadgeBn: string;
  statusBadgeColor: string;
}

export interface SyllabusFittingMetrics {
  totalActiveChapters: number;
  completedChapters: number;
  inProgressChapters: number;
  backlogChapters: number;
  completionRatePercent: number;
  remainingDaysToExam: number;
  requiredDailyVelocity: number; // Chapters / Day
  requiredDailyVelocityBn: string;
  recommendedDailyStudyHours: number;
  recommendedDailyStudyHoursBn: string;
  estimatedCompletionDateBn: string;
  isFitFeasible: boolean;
  pacingAdviceBn: string;
}

export type TimelineBlockType = 'study' | 'school_fixed' | 'sleep' | 'meal' | 'leisure_sports' | 'worship' | 'review';

export interface DailyScheduleSlot {
  id: string;
  type: TimelineBlockType;
  periodName: string;
  startTime: string; // "06:15"
  endTime: string;   // "07:45"
  formattedTime: string; // "০৬:১৫ AM - ০৭:৪৫ AM"
  durationMinutes: number;
  durationFormatted: string; // "১.৫ ঘণ্টা" বা "৯০ মিনিট"
  
  // Study session attributes
  subjectId?: string;
  subjectTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  focusTopic?: string;
  subjectTier?: SubjectTier;
  subjectTierLabelBn?: string;
  hasWeakPointBoost?: boolean;
  weakPointReasonBn?: string;
  assignedTaskType?: 'concept_clear' | 'cq_solve' | 'mcq_solve' | 'revision';
  assignedTaskLabelBn?: string;
  taskBadgeColor?: string;
  
  // Interaction & state
  isCompleted: boolean;
  completedAt?: string;
  isFixedSchoolBlock?: boolean;
  isLifestyleBlock?: boolean;
  iconType?: 'school' | 'book' | 'moon' | 'coffee' | 'sun' | 'activity' | 'award' | 'zap';
}

export interface DayRoutinePlan {
  dayIndex: number; // 0 = Saturday, 1 = Sunday, etc.
  dayNameBn: string;
  dateFormattedBn: string;
  assignedSubjectsCount: number;
  totalStudyMinutes: number;
  totalStudyHoursBn: string;
  slots: DailyScheduleSlot[];
}

/**
 * 1. AI Subject Difficulty Detection & Duration Calculator
 * - Complex Core Subjects (Physics, Chemistry, Higher Math, General Math, Accounting): 90-120 mins
 * - Conceptual/Application Subjects (Biology, ICT, English): 60-75 mins
 * - Standard/Theoretical Subjects (Bangla, BGS, Religion): 45-60 mins
 */
export function getAiSubjectDifficulty(subjectName: string): {
  tier: SubjectTier;
  tierLabelBn: string;
  baseDurationMinutes: number;
  badgeColor: string;
} {
  const norm = (subjectName || '').toLowerCase();

  // 1. Complex Core Subjects (High Focus: 90 - 120 mins)
  if (
    norm.includes('উচ্চতর গণিত') ||
    norm.includes('higher math') ||
    norm.includes('পদার্থ') ||
    norm.includes('physics') ||
    norm.includes('রসায়ন') ||
    norm.includes('chemistry') ||
    norm.includes('সাধারণ গণিত') ||
    norm.includes('mathematics') ||
    norm.includes('math') ||
    norm.includes('হিসাববিজ্ঞান') ||
    norm.includes('accounting')
  ) {
    return {
      tier: 'core_complex',
      tierLabelBn: 'জটিল ও গভীর ফোকাস বিষয় (Complex Core)',
      baseDurationMinutes: 90, // 90 to 120 mins
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    };
  }

  // 2. Conceptual & Application Subjects (Medium Focus: 60 - 75 mins)
  if (
    norm.includes('জীববিজ্ঞান') ||
    norm.includes('biology') ||
    norm.includes('তথ্য') ||
    norm.includes('ict') ||
    norm.includes('ইংরেজি') ||
    norm.includes('english') ||
    norm.includes('ফিন্যান্স') ||
    norm.includes('finance') ||
    norm.includes('ব্যাংকিং')
  ) {
    return {
      tier: 'conceptual_applied',
      tierLabelBn: 'ধারণাগত ও প্রায়োগিক বিষয় (Applied Concept)',
      baseDurationMinutes: 75, // 60 to 75 mins
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    };
  }

  // 3. Standard & Theoretical Subjects (Concise Revision: 45 - 60 mins)
  return {
    tier: 'standard_theory',
    tierLabelBn: 'তাত্ত্বিক ও রিভিশন বিষয় (Standard Theory)',
    baseDurationMinutes: 60, // 45 to 60 mins
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };
}

/**
 * 2. Weak Point Tracker Cross-Checker & Weighting Engine
 */
export function calculateSubjectAiWeight(
  subjectName: string,
  chapterId?: string,
  weakPointsMap: Record<string, ChapterWeakPointData> = {}
): SubjectAiWeightInfo {
  const diff = getAiSubjectDifficulty(subjectName);
  let boostMinutes = 0;
  let hasWeakPointBoost = false;
  const weakTopicsList: string[] = [];

  if (chapterId && weakPointsMap[chapterId]) {
    const data = weakPointsMap[chapterId];
    
    // Check topic checklist
    if (data.topicChecklist) {
      Object.entries(data.topicChecklist).forEach(([topicId, status]) => {
        if (status === 'struggling' || status === 'needs_revision') {
          hasWeakPointBoost = true;
          weakTopicsList.push(topicId);
        }
      });
    }

    // Check custom weak points
    if (data.customWeakPoints && data.customWeakPoints.length > 0) {
      data.customWeakPoints.forEach((p) => {
        if (!p.isResolved) {
          hasWeakPointBoost = true;
          weakTopicsList.push(p.text);
        }
      });
    }
  }

  if (hasWeakPointBoost) {
    // Add +15 to +30 mins depending on base difficulty
    boostMinutes = diff.tier === 'core_complex' ? 30 : 15;
  }

  const totalAllocatedMinutes = diff.baseDurationMinutes + boostMinutes;
  const durationFormattedBn = formatMinutesBn(totalAllocatedMinutes);

  return {
    tier: diff.tier,
    tierLabelBn: diff.tierLabelBn,
    baseDurationMinutes: diff.baseDurationMinutes,
    durationFormattedBn,
    hasWeakPointBoost,
    boostMinutes,
    totalAllocatedMinutes,
    weakTopicsList: weakTopicsList.slice(0, 3),
    badgeColor: hasWeakPointBoost 
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
      : diff.badgeColor,
  };
}

/**
 * 3. Live Countdown Calculator
 */
export function calculateLiveCountdown(examDateStr: string = '2028-02-15'): LiveCountdownInfo {
  const target = new Date(examDateStr).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      examDateStr,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      isUrgent: true,
      isCrunch: false,
      isSteady: false,
      statusBadgeBn: 'পরীক্ষা আজ / চলমান',
      statusBadgeColor: 'bg-rose-500 text-white',
    };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const daysRemaining = Math.floor(totalMinutes / (60 * 24));
  const hoursRemaining = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutesRemaining = totalMinutes % 60;

  const isUrgent = daysRemaining <= 30;
  const isCrunch = daysRemaining > 30 && daysRemaining <= 90;
  const isSteady = daysRemaining > 90;

  let statusBadgeBn = 'স্বাভাবিক গতি ও পূর্ণাঙ্গ প্রস্তুতি';
  let statusBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

  if (isUrgent) {
    statusBadgeBn = 'জরুরি রিভিশন ও ক্রাঞ্চ মোড 🔥';
    statusBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (isCrunch) {
    statusBadgeBn = 'দ্রুত সিলেবাস কভারিং পেস ⚡';
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  return {
    examDateStr,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    isUrgent,
    isCrunch,
    isSteady,
    statusBadgeBn,
    statusBadgeColor,
  };
}

/**
 * 4. Dynamic Syllabus Fitting & Velocity Calculator
 */
export function calculateSyllabusFitting(
  allSubjects: Subject[],
  customSelectedChapterIds?: string[],
  chapterProgress: Record<string, ChapterProgressData> = {},
  examDateStr: string = '2028-02-15'
): SyllabusFittingMetrics {
  const isCustomActive = Array.isArray(customSelectedChapterIds) && customSelectedChapterIds.length > 0;
  const selectedSet = new Set(customSelectedChapterIds || []);

  let totalActiveChapters = 0;
  let completedChapters = 0;
  let inProgressChapters = 0;

  allSubjects.forEach((sub) => {
    sub.chapters.forEach((chap) => {
      if (isCustomActive && !selectedSet.has(chap.id)) {
        return; // skip excluded chapters
      }
      totalActiveChapters += 1;
      const prog = chapterProgress[chap.id];
      if (prog?.status === 'completed' || prog?.status === 'revised') {
        completedChapters += 1;
      } else if (prog?.status === 'in_progress') {
        inProgressChapters += 1;
      }
    });
  });

  const backlogChapters = Math.max(0, totalActiveChapters - completedChapters);
  const completionRatePercent = totalActiveChapters > 0
    ? Math.round((completedChapters / totalActiveChapters) * 1000) / 10
    : 0;

  const countdown = calculateLiveCountdown(examDateStr);
  const remainingDays = Math.max(1, countdown.daysRemaining);

  // Buffer 15 days for final mock test revision before exam
  const effectiveDaysForFirstPass = Math.max(7, remainingDays - 15);
  const requiredVelocity = Math.round((backlogChapters / effectiveDaysForFirstPass) * 100) / 100;

  // Recommended daily study hours based on backlog velocity
  let recommendedHours = 5.0;
  let pacingAdviceBn = 'নিয়মিত ধারাবাহিকতায় প্রতিদিন ৩-৪টি বিষয়ের কনসেপ্ট ক্লিয়ার ও CQ/MCQ সমাধান করুন।';

  if (requiredVelocity > 1.2 || remainingDays < 45) {
    recommendedHours = 8.5;
    pacingAdviceBn = `বাকি ${toBengaliNumber(remainingDays)} দিনে ${toBengaliNumber(backlogChapters)}টি অধ্যায় শেষ করতে দৈনিক গড়ে ৮.৫ ঘণ্টা গভীর প্রস্তুতি প্রয়োজন।`;
  } else if (requiredVelocity > 0.6 || remainingDays < 90) {
    recommendedHours = 6.5;
    pacingAdviceBn = `প্রতিদিন অন্তত ২টি অধ্যায়ের অনুশীলনের মাধ্যমে পরীক্ষা শুরুর ১৫ দিন পূর্বেই ১০০% সিলেবাস শেষ হবে।`;
  } else {
    recommendedHours = 5.0;
    pacingAdviceBn = 'পর্যাপ্ত সময় রয়েছে। প্রতিদিন স্বাচ্ছন্দ্যে ৩-৪টি বিষয় রোটেশন করে পড়ুন।';
  }

  // Estimated completion date
  const daysNeeded = Math.ceil(backlogChapters / Math.max(0.2, requiredVelocity));
  const estDate = new Date(Date.now() + daysNeeded * 86400000);
  const estDateBn = estDate.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    totalActiveChapters,
    completedChapters,
    inProgressChapters,
    backlogChapters,
    completionRatePercent,
    remainingDaysToExam: remainingDays,
    requiredDailyVelocity: requiredVelocity,
    requiredDailyVelocityBn: toBengaliNumber(requiredVelocity.toFixed(2)),
    recommendedDailyStudyHours: recommendedHours,
    recommendedDailyStudyHoursBn: toBengaliNumber(recommendedHours.toFixed(1)),
    estimatedCompletionDateBn: estDateBn,
    isFitFeasible: requiredVelocity <= 2.5,
    pacingAdviceBn,
  };
}

/**
 * 5. Smart Daily Schedule Generator (Strict School Freeze 08:00 AM - 04:50 PM & Max 4 Subjects)
 */
export function generateSmartDailySchedule(
  allSubjects: Subject[],
  customSelectedChapterIds?: string[],
  chapterProgress: Record<string, ChapterProgressData> = {},
  weakPointsMap: Record<string, ChapterWeakPointData> = {},
  savedCompletions: Record<string, boolean> = {},
  dayOffset: number = 0
): DailyScheduleSlot[] {
  const isCustomActive = Array.isArray(customSelectedChapterIds) && customSelectedChapterIds.length > 0;
  const selectedSet = new Set(customSelectedChapterIds || []);

  // Filter candidate subjects with unfinished chapters
  const candidateSubjects = allSubjects
    .map((sub) => {
      const activeChapters = sub.chapters.filter((c) => !isCustomActive || selectedSet.has(c.id));
      const unfinishedChapters = activeChapters.filter((c) => {
        const p = chapterProgress[c.id];
        return !p || p.status !== 'completed' && p.status !== 'revised';
      });
      return {
        subject: sub,
        activeChapters,
        unfinishedChapters,
      };
    })
    .filter((s) => s.activeChapters.length > 0);

  // Pick up to 4 subjects for today's routine using rotation based on dayOffset
  const numSubjectsToPick = Math.min(4, Math.max(2, candidateSubjects.length));
  const pickedSubjects: { subject: Subject; chapter: any; weight: SubjectAiWeightInfo }[] = [];

  for (let i = 0; i < numSubjectsToPick; i++) {
    const idx = (dayOffset * 2 + i) % candidateSubjects.length;
    const item = candidateSubjects[idx];
    if (!item) continue;
    
    // Pick the first unfinished chapter or first active chapter
    const targetChapter = item.unfinishedChapters[0] || item.activeChapters[0] || { id: `${item.subject.id}_c1`, name: 'মৌলিক অধ্যায়' };
    const weight = calculateSubjectAiWeight(item.subject.name, targetChapter.id, weakPointsMap);

    pickedSubjects.push({
      subject: item.subject,
      chapter: targetChapter,
      weight,
    });
  }

  // Fallback defaults if few subjects
  const sub1 = pickedSubjects[0] || {
    subject: { id: 'math', name: 'সাধারণ গণিত' },
    chapter: { id: 'math_1', name: 'বীজগাণিতিক রাশি' },
    weight: calculateSubjectAiWeight('সাধারণ গণিত'),
  };
  const sub2 = pickedSubjects[1] || {
    subject: { id: 'physics', name: 'পদার্থবিজ্ঞান' },
    chapter: { id: 'phy_1', name: 'গতি ও বল' },
    weight: calculateSubjectAiWeight('পদার্থবিজ্ঞান'),
  };
  const sub3 = pickedSubjects[2] || {
    subject: { id: 'chem', name: 'রসায়ন' },
    chapter: { id: 'chem_1', name: 'পদার্থের গঠন' },
    weight: calculateSubjectAiWeight('রসায়ন'),
  };
  const sub4 = pickedSubjects[3] || {
    subject: { id: 'bangla', name: 'বাংলা প্রথম পত্র' },
    chapter: { id: 'ban_1', name: 'শোভা ও বই পড়া' },
    weight: calculateSubjectAiWeight('বাংলা প্রথম পত্র'),
  };

  const slots: DailyScheduleSlot[] = [
    // 1. Deep Sleep (11:00 PM to 06:00 AM)
    {
      id: 'slot_sleep_night',
      type: 'sleep',
      periodName: 'গভীর ঘুম ও বিশ্রাম (Deep Restorative Sleep)',
      startTime: '23:00',
      endTime: '06:00',
      formattedTime: '১১:০০ PM - ০৬:০০ AM',
      durationMinutes: 420,
      durationFormatted: '৭ ঘণ্টা',
      focusTopic: 'মস্তিষ্কের স্মৃতি ধারণ ও শারীরিক ক্লান্তি দূরীকরণ',
      isCompleted: Boolean(savedCompletions['slot_sleep_night']),
      isLifestyleBlock: true,
      iconType: 'moon',
    },

    // 2. Morning Wakeup, Prayer/Worship & Fresh (06:00 AM to 06:15 AM)
    {
      id: 'slot_morning_fresh',
      type: 'worship',
      periodName: 'প্রাতঃকালীন প্রস্তুতি ও প্রার্থনা (Morning Prayer & Fresh)',
      startTime: '06:00',
      endTime: '06:15',
      formattedTime: '০৬:০০ AM - ০৬:১৫ AM',
      durationMinutes: 15,
      durationFormatted: '১৫ মিনিট',
      focusTopic: 'ঘুম থেকে ওঠা, ফ্রেশ হওয়া ও দিনের লক্ষ্য স্থির করা',
      isCompleted: Boolean(savedCompletions['slot_morning_fresh']),
      isLifestyleBlock: true,
      iconType: 'sun',
    },

    // 3. Morning High-Focus Study Session (06:15 AM to 07:45 AM) [90 mins]
    {
      id: 'slot_study_morning',
      type: 'study',
      periodName: 'ভোরকালীন নিবিড় স্টাডি সেশন (Morning Deep Work)',
      startTime: '06:15',
      endTime: '07:45',
      formattedTime: '০৬:১৫ AM - ০৭:৪৫ AM',
      durationMinutes: sub1.weight.totalAllocatedMinutes || 90,
      durationFormatted: sub1.weight.durationFormattedBn,
      subjectId: sub1.subject.id,
      subjectTitle: sub1.subject.name,
      chapterId: sub1.chapter.id,
      chapterTitle: sub1.chapter.name,
      focusTopic: `${sub1.chapter.name} — মূল সূত্র ও জটিল কনসেপ্ট ক্লিয়ারিং`,
      subjectTier: sub1.weight.tier,
      subjectTierLabelBn: sub1.weight.tierLabelBn,
      hasWeakPointBoost: sub1.weight.hasWeakPointBoost,
      weakPointReasonBn: sub1.weight.hasWeakPointBoost 
        ? `দুর্বল টপিক ফোকাস: ${sub1.weight.weakTopicsList?.join(', ')} (+${toBengaliNumber(sub1.weight.boostMinutes)} মি.)`
        : undefined,
      assignedTaskType: 'concept_clear',
      assignedTaskLabelBn: '📘 Concept Clear (৩৩.৩% ওয়েট)',
      taskBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      isCompleted: Boolean(savedCompletions['slot_study_morning']),
      iconType: 'book',
    },

    // 4. Breakfast & School Prep (07:45 AM to 08:00 AM)
    {
      id: 'slot_breakfast_prep',
      type: 'meal',
      periodName: 'সকালের পুষ্টিকর নাস্তা ও স্কুলের প্রস্তুতি',
      startTime: '07:45',
      endTime: '08:00',
      formattedTime: '০৭:৪৫ AM - ০৮:০০ AM',
      durationMinutes: 15,
      durationFormatted: '১৫ মিনিট',
      focusTopic: 'পুষ্টিকর নাস্তা গ্রহণ ও ব্যাগ/বই গোছানো',
      isCompleted: Boolean(savedCompletions['slot_breakfast_prep']),
      isLifestyleBlock: true,
      iconType: 'coffee',
    },

    // 5. STRICT FIXED SCHOOL BLOCK (08:00 AM to 04:50 PM) [530 mins]
    {
      id: 'slot_school_fixed',
      type: 'school_fixed',
      periodName: 'বিদ্যালয় ও কোচিং ক্লাস (School & Coaching - Frozen)',
      startTime: '08:00',
      endTime: '16:50',
      formattedTime: '০৮:০০ AM - ০৪:৫০ PM',
      durationMinutes: 530,
      durationFormatted: '৮ ঘণ্টা ৫০ মিনিট',
      focusTopic: 'শ্রেণিকক্ষে সরাসরি পাঠদান, নোট গ্রহণ ও প্রাতিষ্ঠানিক ক্লাস',
      isCompleted: Boolean(savedCompletions['slot_school_fixed']),
      isFixedSchoolBlock: true,
      isLifestyleBlock: true,
      iconType: 'school',
    },

    // 6. Refreshment, Asr/Sports & Afternoon Break (04:50 PM to 05:30 PM)
    {
      id: 'slot_afternoon_refresh',
      type: 'leisure_sports',
      periodName: 'বিকেলের খেলাধুলা, রিফ্রেশমেন্ট ও আসর',
      startTime: '16:50',
      endTime: '17:30',
      formattedTime: '০৪:৫০ PM - ০৫:৩০ PM',
      durationMinutes: 40,
      durationFormatted: '৪০ মিনিট',
      focusTopic: 'বাইরে হাঁটা/খেলাধুলা, হালকা নাস্তা ও ক্লান্তি মোচন',
      isCompleted: Boolean(savedCompletions['slot_afternoon_refresh']),
      isLifestyleBlock: true,
      iconType: 'activity',
    },

    // 7. Evening Study Session 1 (05:30 PM to 07:00 PM) [90 mins]
    {
      id: 'slot_study_evening_1',
      type: 'study',
      periodName: 'সন্ধাকালীন স্টাডি সেশন ১ (Creative CQ Solving)',
      startTime: '17:30',
      endTime: '19:00',
      formattedTime: '০৫:৩০ PM - ০৭:০০ PM',
      durationMinutes: sub2.weight.totalAllocatedMinutes || 90,
      durationFormatted: sub2.weight.durationFormattedBn,
      subjectId: sub2.subject.id,
      subjectTitle: sub2.subject.name,
      chapterId: sub2.chapter.id,
      chapterTitle: sub2.chapter.name,
      focusTopic: `${sub2.chapter.name} — বোর্ড স্ট্যান্ডার্ড সৃজনশীল (CQ) সমাধান`,
      subjectTier: sub2.weight.tier,
      subjectTierLabelBn: sub2.weight.tierLabelBn,
      hasWeakPointBoost: sub2.weight.hasWeakPointBoost,
      weakPointReasonBn: sub2.weight.hasWeakPointBoost 
        ? `দুর্বল টপিক ফোকাস: ${sub2.weight.weakTopicsList?.join(', ')} (+${toBengaliNumber(sub2.weight.boostMinutes)} মি.)`
        : undefined,
      assignedTaskType: 'cq_solve',
      assignedTaskLabelBn: '✍️ CQ Practice (৩৩.৩% ওয়েট)',
      taskBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isCompleted: Boolean(savedCompletions['slot_study_evening_1']),
      iconType: 'zap',
    },

    // 8. Evening Break / Maghrib / Snack (07:00 PM to 07:30 PM)
    {
      id: 'slot_evening_break',
      type: 'meal',
      periodName: 'সন্ধ্যার বিরতি, হালকা নাস্তা ও মাগরিব',
      startTime: '19:00',
      endTime: '19:30',
      formattedTime: '০৭:০০ PM - ০৭:৩০ PM',
      durationMinutes: 30,
      durationFormatted: '৩০ মিনিট',
      focusTopic: 'মাগরিবের প্রার্থনা, পানি/চা পান ও মানসিক সতেজতা',
      isCompleted: Boolean(savedCompletions['slot_evening_break']),
      isLifestyleBlock: true,
      iconType: 'coffee',
    },

    // 9. Prime Night Study Session 2 (07:30 PM to 09:15 PM) [105 mins]
    {
      id: 'slot_study_night_2',
      type: 'study',
      periodName: 'রাত্রিকালীন নিবিড় স্টাডি সেশন ২ (Prime Core Focus)',
      startTime: '19:30',
      endTime: '21:15',
      formattedTime: '০৭:৩০ PM - ০৯:১৫ PM',
      durationMinutes: sub3.weight.totalAllocatedMinutes || 105,
      durationFormatted: sub3.weight.durationFormattedBn,
      subjectId: sub3.subject.id,
      subjectTitle: sub3.subject.name,
      chapterId: sub3.chapter.id,
      chapterTitle: sub3.chapter.name,
      focusTopic: `${sub3.chapter.name} — বোর্ড প্রশ্ন বিশ্লেষণ ও সমস্যা সমাধান`,
      subjectTier: sub3.weight.tier,
      subjectTierLabelBn: sub3.weight.tierLabelBn,
      hasWeakPointBoost: sub3.weight.hasWeakPointBoost,
      weakPointReasonBn: sub3.weight.hasWeakPointBoost 
        ? `দুর্বল টপিক ফোকাস: ${sub3.weight.weakTopicsList?.join(', ')} (+${toBengaliNumber(sub3.weight.boostMinutes)} মি.)`
        : undefined,
      assignedTaskType: 'cq_solve',
      assignedTaskLabelBn: '⚡ Core Deep Solve',
      taskBadgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      isCompleted: Boolean(savedCompletions['slot_study_night_2']),
      iconType: 'book',
    },

    // 10. Dinner & Family Time (09:15 PM to 09:45 PM)
    {
      id: 'slot_dinner_family',
      type: 'meal',
      periodName: 'রাতের খাবার ও পারিবারিক সময় (Dinner & Family)',
      startTime: '21:15',
      endTime: '21:45',
      formattedTime: '০৯:১৫ PM - ০৯:৪৫ PM',
      durationMinutes: 30,
      durationFormatted: '৩০ মিনিট',
      focusTopic: 'পরিবারের সাথে রাতের খাবার গ্রহণ ও মানসিক রিল্যাক্সেশন',
      isCompleted: Boolean(savedCompletions['slot_dinner_family']),
      isLifestyleBlock: true,
      iconType: 'coffee',
    },

    // 11. Night Revision & MCQ Session 3 (09:45 PM to 10:45 PM) [60 mins]
    {
      id: 'slot_study_night_3',
      type: 'study',
      periodName: 'দিনের শেষ রিভিশন ও MCQ অনুশীলন (MCQ Quickfire)',
      startTime: '21:45',
      endTime: '22:45',
      formattedTime: '০৯:৪৫ PM - ১০:৪৫ PM',
      durationMinutes: sub4.weight.totalAllocatedMinutes || 60,
      durationFormatted: sub4.weight.durationFormattedBn,
      subjectId: sub4.subject.id,
      subjectTitle: sub4.subject.name,
      chapterId: sub4.chapter.id,
      chapterTitle: sub4.chapter.name,
      focusTopic: `${sub4.chapter.name} — বহুনির্বাচনী (MCQ) দ্রুত সমাধান ও সেলফ-টেস্ট`,
      subjectTier: sub4.weight.tier,
      subjectTierLabelBn: sub4.weight.tierLabelBn,
      hasWeakPointBoost: sub4.weight.hasWeakPointBoost,
      weakPointReasonBn: sub4.weight.hasWeakPointBoost 
        ? `দুর্বল টপিক ফোকাস: ${sub4.weight.weakTopicsList?.join(', ')} (+${toBengaliNumber(sub4.weight.boostMinutes)} মি.)`
        : undefined,
      assignedTaskType: 'mcq_solve',
      assignedTaskLabelBn: '🔘 MCQ Solve (৩৩.৪% ওয়েট)',
      taskBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      isCompleted: Boolean(savedCompletions['slot_study_night_3']),
      iconType: 'award',
    },

    // 12. Day Review & Bedtime Routine (10:45 PM to 11:00 PM)
    {
      id: 'slot_night_review',
      type: 'review',
      periodName: 'দিনের পর্যালোচনা ও ঘুমানোর প্রস্তুতি (Bedtime Wind Down)',
      startTime: '22:45',
      endTime: '23:00',
      formattedTime: '১০:৪৫ PM - ১১:০০ PM',
      durationMinutes: 15,
      durationFormatted: '১৫ মিনিট',
      focusTopic: 'আজকের অগ্রগতি পর্যালোচনা ও আগামীকালের জন্য লক্ষ্য প্রস্তুত করা',
      isCompleted: Boolean(savedCompletions['slot_night_review']),
      isLifestyleBlock: true,
      iconType: 'moon',
    },
  ];

  return slots;
}

/**
 * 6. Generate 7-Day Revolving Weekly Plan
 */
export function generateWeeklyDistributionPlan(
  allSubjects: Subject[],
  customSelectedChapterIds?: string[],
  chapterProgress: Record<string, ChapterProgressData> = {},
  weakPointsMap: Record<string, ChapterWeakPointData> = {},
  savedCompletions: Record<string, boolean> = {}
): DayRoutinePlan[] {
  const dayNamesBn = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার'];
  const today = new Date();
  
  return dayNamesBn.map((name, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    const dateFormattedBn = d.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
    });

    const slots = generateSmartDailySchedule(
      allSubjects,
      customSelectedChapterIds,
      chapterProgress,
      weakPointsMap,
      savedCompletions,
      idx
    );

    const studySlots = slots.filter((s) => s.type === 'study');
    const totalMins = studySlots.reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      dayIndex: idx,
      dayNameBn: name,
      dateFormattedBn,
      assignedSubjectsCount: studySlots.length,
      totalStudyMinutes: totalMins,
      totalStudyHoursBn: formatMinutesBn(totalMins),
      slots,
    };
  });
}

/**
 * Helper to format minutes into Bengali duration string
 */
export function formatMinutesBn(minutes: number): string {
  if (minutes < 60) {
    return `${toBengaliNumber(minutes)} মিনিট`;
  }
  const hours = minutes / 60;
  const formatted = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
  return `${toBengaliNumber(formatted)} ঘণ্টা`;
}

/**
 * 8. Helper to get all Chapter IDs that are part of Today's routine (Day 0)
 */
export function getTodaysRoutineChapterIds(
  allSubjects: Subject[],
  customSelectedChapterIds?: string[],
  chapterProgress: Record<string, ChapterProgressData> = {},
  weakPointsMap: Record<string, ChapterWeakPointData> = {},
  dayOffset: number = 0
): Set<string> {
  const schedule = generateSmartDailySchedule(
    allSubjects,
    customSelectedChapterIds,
    chapterProgress,
    weakPointsMap,
    {},
    dayOffset
  );
  const set = new Set<string>();
  schedule.forEach((slot) => {
    if (slot.type === 'study' && slot.chapterId) {
      set.add(slot.chapterId);
    }
  });
  return set;
}
