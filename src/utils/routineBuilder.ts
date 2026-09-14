import { Subject, StreamKey, ReligionBn } from '../types';
import { toBengaliNumber } from './progressCalculator';
import { getSubjectComplexity, AdaptiveTargetChapter } from './adaptiveRoutineEngine';

export interface ScheduleInputs {
  targetStudyHours: number; // e.g., 5
  schoolStart: string; // "08:00"
  schoolEnd: string; // "13:30"
  playStart: string; // "17:00"
  playEnd: string; // "18:30"
  sleepStart: string; // "22:30"
  sleepEnd: string; // "05:30"
  mealsPersonalHours?: number; // default 3h (180 mins)
  prayerWorshipHours?: number; // default 1.8h (110 mins)
}

export type SlotType = 'study' | 'school' | 'play' | 'sleep' | 'break' | 'meal' | 'worship';
export type StudyTaskType = 'concept_clear' | 'cq_solve' | 'mcq_solve';

export interface RoutineTimeSlot {
  id: string;
  type: SlotType;
  periodName: string; // e.g. "ভোরকালীন স্টাডি ব্লক (Morning Block)"
  startTime: string; // "06:00"
  endTime: string; // "07:30"
  formattedTime: string; // "০৬:০০ AM - ০৭:৩০ AM"
  durationMinutes: number;
  durationFormatted: string; // "১.৫ ঘণ্টা"

  // Study specific
  subjectTitle?: string;
  chapterTitle?: string;
  complexityLabel?: string;
  complexityHours?: string;
  focusTopic?: string;
  assignedTask?: StudyTaskType;
  assignedTaskTitle?: string; // "📘 Concept Clear (৩৩.৩% ওয়েট)"
  taskBadgeColor?: string;

  isCompleted: boolean;
  completedAt?: string;
  categoryTag?: string;
  categoryTagColor?: string;
  isCustom?: boolean;
}

export interface ScheduleMetrics {
  totalDayMinutes: number; // 1440 (24h)
  sleepMinutes: number;
  schoolMinutes: number;
  playMinutes: number;
  mealsPersonalMinutes: number;
  worshipPrayerMinutes: number;
  committedMinutes: number; // Sleep + School + Meals + Prayer + Play
  freeMinutes: number; // 1440 - committed
  targetStudyMinutes: number;
  remainingLeisureMinutes: number; // free - targetStudy
  sleepHours: number;
  schoolHours: number;
  playHours: number;
  mealsPersonalHours: number;
  worshipPrayerHours: number;
  freeHours: number;
  targetStudyHours: number;
}

// Convert "HH:MM" 24h format to total minutes from midnight
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

// Convert total minutes from midnight to "HH:MM" 24h format
export const minutesToTime = (minutes: number): string => {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Format "HH:MM" to 12-hour formatted string with Bengali numerals
// e.g. "08:00" -> "০৮:০০ AM", "13:30" -> "০১:৩০ PM"
export const format12HourBn = (timeStr: string): string => {
  const mins = timeToMinutes(timeStr);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const hStr = toBengaliNumber(String(h12).padStart(2, '0'));
  const mStr = toBengaliNumber(String(m).padStart(2, '0'));
  return `${hStr}:${mStr} ${period}`;
};

// Format a time interval e.g. "০৬:০০ AM - ০৭:৩০ AM"
export const formatTimeRangeBn = (startStr: string, endStr: string): string => {
  return `${format12HourBn(startStr)} - ${format12HourBn(endStr)}`;
};

// Format duration in minutes to Bengali string, e.g. "১.৫ ঘণ্টা" or "৪৫ মিনিট"
export const formatDurationBn = (minutes: number): string => {
  if (minutes < 60) {
    return `${toBengaliNumber(minutes)} মিনিট`;
  }
  const hours = minutes / 60;
  const rounded = hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1);
  return `${toBengaliNumber(rounded)} ঘণ্টা`;
};

// Calculate overnight interval (e.g. 22:30 to 05:30)
export const getIntervalMinutes = (startStr: string, endStr: string): number => {
  const startM = timeToMinutes(startStr);
  const endM = timeToMinutes(endStr);
  if (endM >= startM) {
    return endM - startM;
  }
  // Crosses midnight (e.g., 22:30 to 05:30)
  return (1440 - startM) + endM;
};

// Compute high-level schedule metrics with Dynamic Time Buffering:
// Excludes fixed blocks: Sleep (7-8h), Meals/Personal (3h), School/Coaching, Daily Prayer/Worship slots
export const computeScheduleMetrics = (inputs: ScheduleInputs): ScheduleMetrics => {
  const sleepMinutes = getIntervalMinutes(inputs.sleepStart, inputs.sleepEnd);
  const schoolMinutes = getIntervalMinutes(inputs.schoolStart, inputs.schoolEnd);
  const playMinutes = getIntervalMinutes(inputs.playStart, inputs.playEnd);

  // Dynamic Buffers: Meals/Personal (3h) and Prayer/Worship (~1.8h = 110m)
  const mealsPersonalMinutes = Math.round((inputs.mealsPersonalHours ?? 3.0) * 60);
  const worshipPrayerMinutes = Math.round((inputs.prayerWorshipHours ?? 1.8) * 60);

  const committedMinutes = sleepMinutes + schoolMinutes + mealsPersonalMinutes + worshipPrayerMinutes + playMinutes;
  const freeMinutes = Math.max(0, 1440 - committedMinutes);
  const targetStudyMinutes = Math.round(inputs.targetStudyHours * 60);
  const remainingLeisureMinutes = Math.max(0, freeMinutes - targetStudyMinutes);

  return {
    totalDayMinutes: 1440,
    sleepMinutes,
    schoolMinutes,
    playMinutes,
    mealsPersonalMinutes,
    worshipPrayerMinutes,
    committedMinutes,
    freeMinutes,
    targetStudyMinutes,
    remainingLeisureMinutes,
    sleepHours: Math.round((sleepMinutes / 60) * 10) / 10,
    schoolHours: Math.round((schoolMinutes / 60) * 10) / 10,
    playHours: Math.round((playMinutes / 60) * 10) / 10,
    mealsPersonalHours: Math.round((mealsPersonalMinutes / 60) * 10) / 10,
    worshipPrayerHours: Math.round((worshipPrayerMinutes / 60) * 10) / 10,
    freeHours: Math.round((freeMinutes / 60) * 10) / 10,
    targetStudyHours: inputs.targetStudyHours,
  };
};

/**
 * AUTO-ADAPTIVE ROUTINE ALLOCATION ALGORITHM:
 * 1. Deduct Fixed Blocks: Sleep (7-8h), Meals/Personal (3h), School, Prayer/Worship from 24h.
 * 2. If targetChapter is provided, align the morning and evening blocks to the target chapter.
 * 3. Assign chapter duration based on subject complexity:
 *    - Math/Physics (High): 4-5h average per chapter
 *    - Bangla/Religion (Standard): 2-3h average per chapter
 *    - Chemistry/Biology/Accounting: 3.5-4h
 * 4. Assign 3 core study tasks:
 *    - Morning Slot: 📘 Concept Clear (33.3% Weight)
 *    - Evening Slot: ✍️ CQ Solve (33.3% Weight)
 *    - Night Slot: 🔘 MCQ Solve (33.4% Weight)
 */
export const buildAutomatedRoutine = (
  inputs: ScheduleInputs,
  activeSubjects: Subject[],
  stream: StreamKey,
  religionBn: ReligionBn,
  savedCompletionState: Record<string, boolean> = {},
  adaptiveTarget?: AdaptiveTargetChapter | null
): RoutineTimeSlot[] => {
  const targetMinutes = Math.max(60, Math.round(inputs.targetStudyHours * 60));

  // Determine subject and chapter for study blocks
  // If an adaptive target chapter exists, prioritize it
  let morningSubjectName = 'সাধারণ গণিত';
  let morningChapterTitle = '';
  let morningComplexityLabel = 'উচ্চ জটিলতা • ৪-৫ ঘণ্টা';
  let morningComplexityHours = '৪-৫ ঘণ্টা';

  if (adaptiveTarget) {
    morningSubjectName = adaptiveTarget.subjectName;
    morningChapterTitle = adaptiveTarget.chapterName;
    morningComplexityLabel = adaptiveTarget.complexity.tierLabelBn;
    morningComplexityHours = adaptiveTarget.complexity.durationFormattedBn;
  } else {
    const mathSubject = activeSubjects.find(s => s.name.includes('গণিত') || s.name.includes('Math'));
    const morningSubject = mathSubject || activeSubjects[0] || { name: 'সাধারণ গণিত', chapters: [] };
    morningSubjectName = morningSubject.name;
    morningChapterTitle = morningSubject.chapters?.[0]?.name || 'মৌলিক অধ্যায়';
    const comp = getSubjectComplexity(morningSubjectName);
    morningComplexityLabel = comp.tierLabelBn;
    morningComplexityHours = comp.durationFormattedBn;
  }

  // Evening: Core department subject (Physics/Chemistry for Science, Accounting for Business)
  const deptSubject = activeSubjects.find(s => {
    if (stream === 'science') return s.name.includes('পদার্থ') || s.name.includes('রসায়ন') || s.name.includes('জীব');
    if (stream === 'business') return s.name.includes('হিসাব') || s.name.includes('ব্যবসায়');
    return s.name.includes('ইতিহাস') || s.name.includes('পৌরনীতি') || s.name.includes('ভূগোল');
  });
  const eveningSubject = deptSubject || activeSubjects[1] || { name: 'বিভাগীয় প্রধান বিষয়', chapters: [] };
  const eveningComp = getSubjectComplexity(eveningSubject.name);

  // Night: Religion or Language / ICT
  const relSubject = activeSubjects.find(s => s.name.includes('ধর্ম') || s.name.includes('শিক্ষা'));
  const nightSubject = relSubject || activeSubjects.find(s => s.name.includes('বাংলা') || s.name.includes('ইংরেজি') || s.name.includes('তথ্য')) || { name: `${religionBn} ও নৈতিক শিক্ষা`, chapters: [] };
  const nightComp = getSubjectComplexity(nightSubject.name);

  // Distribute duration proportionally:
  let morningDuration = 0;
  let eveningDuration = 0;
  let nightDuration = 0;
  let afternoonDuration = 0;

  if (inputs.targetStudyHours <= 4) {
    morningDuration = Math.round((targetMinutes * 0.35) / 15) * 15;
    eveningDuration = Math.round((targetMinutes * 0.40) / 15) * 15;
    nightDuration = targetMinutes - (morningDuration + eveningDuration);
  } else if (inputs.targetStudyHours <= 6) {
    morningDuration = Math.round((targetMinutes * 0.32) / 15) * 15;
    eveningDuration = Math.round((targetMinutes * 0.42) / 15) * 15;
    nightDuration = targetMinutes - (morningDuration + eveningDuration);
  } else {
    morningDuration = 105; // 1h 45m
    afternoonDuration = 90; // 1h 30m
    eveningDuration = 150; // 2h 30m
    nightDuration = targetMinutes - (morningDuration + afternoonDuration + eveningDuration);
    if (nightDuration < 60) nightDuration = 60;
  }

  // 1. Morning study block:
  const wakeM = timeToMinutes(inputs.sleepEnd);
  const morningStartM = wakeM + 30; // 30m buffer for morning prayer/worship & fresh
  const morningEndM = morningStartM + morningDuration;

  // 2. Evening study block:
  const playEndM = timeToMinutes(inputs.playEnd);
  const eveningStartM = playEndM;
  const eveningEndM = eveningStartM + eveningDuration;

  // 3. Night study block:
  const sleepStartM = timeToMinutes(inputs.sleepStart);
  const nightEndM = sleepStartM;
  const nightStartM = nightEndM - nightDuration;

  const slots: RoutineTimeSlot[] = [];

  // Morning Study Block
  const morningStartStr = minutesToTime(morningStartM);
  const morningEndStr = minutesToTime(morningEndM);
  slots.push({
    id: 'block_morning_study',
    type: 'study',
    periodName: 'ভোরকালীন স্টাডি ব্লক (Morning Block)',
    startTime: morningStartStr,
    endTime: morningEndStr,
    formattedTime: formatTimeRangeBn(morningStartStr, morningEndStr),
    durationMinutes: morningDuration,
    durationFormatted: formatDurationBn(morningDuration),
    subjectTitle: morningSubjectName,
    chapterTitle: morningChapterTitle,
    complexityLabel: morningComplexityLabel,
    complexityHours: morningComplexityHours,
    focusTopic: morningChapterTitle ? `অধ্যায়: ${morningChapterTitle} - মূল সূত্র ও কনসেপ্ট ক্লিয়ার` : 'মূল সূত্র, উপপাদ্য ও মৌলিক ধারণা স্পষ্টকরণ',
    assignedTask: 'concept_clear',
    assignedTaskTitle: '📘 Concept Clear (৩৩.৩% ওয়েট)',
    taskBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    isCompleted: Boolean(savedCompletionState['block_morning_study']),
    categoryTag: 'অটো-টার্গেট মৌলিক',
    categoryTagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  });

  // Optional Afternoon Study Block for intensive plans (>6h)
  if (afternoonDuration > 0) {
    const afternoonStartM = timeToMinutes(inputs.schoolEnd) + 90;
    const afternoonEndM = afternoonStartM + afternoonDuration;
    const aftStartStr = minutesToTime(afternoonStartM);
    const aftEndStr = minutesToTime(afternoonEndM);
    const extraSubject = activeSubjects[2] || { name: 'বাংলা ২য় পত্র / ইংরেজি', chapters: [] };
    const aftComp = getSubjectComplexity(extraSubject.name);

    slots.push({
      id: 'block_afternoon_study',
      type: 'study',
      periodName: 'বিকেল সেশন (Afternoon Intensive)',
      startTime: aftStartStr,
      endTime: aftEndStr,
      formattedTime: formatTimeRangeBn(aftStartStr, aftEndStr),
      durationMinutes: afternoonDuration,
      durationFormatted: formatDurationBn(afternoonDuration),
      subjectTitle: extraSubject.name,
      chapterTitle: extraSubject.chapters?.[0]?.name,
      complexityLabel: aftComp.tierLabelBn,
      complexityHours: aftComp.durationFormattedBn,
      focusTopic: 'ব্যাকরণ, অনুধাবন ও লিখিত প্রস্তুতি',
      assignedTask: 'concept_clear',
      assignedTaskTitle: '📘 Concept Clear (৩৩.৩% ওয়েট)',
      taskBadgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      isCompleted: Boolean(savedCompletionState['block_afternoon_study']),
      categoryTag: 'নিবিড় প্রস্তুতি',
      categoryTagColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    });
  }

  // Evening Study Block
  const eveningStartStr = minutesToTime(eveningStartM);
  const eveningEndStr = minutesToTime(eveningEndM);
  slots.push({
    id: 'block_evening_study',
    type: 'study',
    periodName: 'সন্ধ্যা স্টাডি ব্লক (Evening Prime)',
    startTime: eveningStartStr,
    endTime: eveningEndStr,
    formattedTime: formatTimeRangeBn(eveningStartStr, eveningEndStr),
    durationMinutes: eveningDuration,
    durationFormatted: formatDurationBn(eveningDuration),
    subjectTitle: eveningSubject.name,
    chapterTitle: eveningSubject.chapters?.[0]?.name,
    complexityLabel: eveningComp.tierLabelBn,
    complexityHours: eveningComp.durationFormattedBn,
    focusTopic: 'বিগত বছরের বোর্ড সৃজনশীল ও মডেল টেস্ট CQ সমাধান',
    assignedTask: 'cq_solve',
    assignedTaskTitle: '✍️ CQ Solve (৩৩.৩% ওয়েট)',
    taskBadgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    isCompleted: Boolean(savedCompletionState['block_evening_study']),
    categoryTag: 'বিভাগীয় সৃজনশীল',
    categoryTagColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  });

  // Night Study Block
  const nightStartStr = minutesToTime(nightStartM);
  const nightEndStr = minutesToTime(nightEndM);
  slots.push({
    id: 'block_night_study',
    type: 'study',
    periodName: 'নৈশ রিভিশন ও টেস্ট ব্লক (Night Mastery)',
    startTime: nightStartStr,
    endTime: nightEndStr,
    formattedTime: formatTimeRangeBn(nightStartStr, nightEndStr),
    durationMinutes: nightDuration,
    durationFormatted: formatDurationBn(nightDuration),
    subjectTitle: nightSubject.name,
    chapterTitle: nightSubject.chapters?.[0]?.name,
    complexityLabel: nightComp.tierLabelBn,
    complexityHours: nightComp.durationFormattedBn,
    focusTopic: 'বহুনির্বাচনী দ্রুত সমাধান, জ্ঞানমূলক প্রশ্ন ও সারসংক্ষেপ রিভিশন',
    assignedTask: 'mcq_solve',
    assignedTaskTitle: '🔘 MCQ Solve (৩৩.৪% ওয়েট)',
    taskBadgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    isCompleted: Boolean(savedCompletionState['block_night_study']),
    categoryTag: 'বহুনির্বাচনী ও দ্রুত রিভিশন',
    categoryTagColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  });

  return slots;
};

// Generate complete 24-hour day schedule with DYNAMIC TIME BUFFERING:
// Excludes fixed blocks: Sleep (7-8h), Meals/Personal (3h), School/Coaching, Daily Prayer/Worship slots
export const buildFullDayTimeline = (
  inputs: ScheduleInputs,
  studySlots: RoutineTimeSlot[],
  religionBn: ReligionBn = 'ইসলাম'
): RoutineTimeSlot[] => {
  const schoolDuration = getIntervalMinutes(inputs.schoolStart, inputs.schoolEnd);
  const playDuration = getIntervalMinutes(inputs.playStart, inputs.playEnd);
  const sleepDuration = getIntervalMinutes(inputs.sleepStart, inputs.sleepEnd);

  const isIslam = religionBn === 'ইসলাম';
  const worshipLabel = isIslam ? 'নামাজ' : 'উপাসনা ও প্রার্থনা';

  const fixedSlots: RoutineTimeSlot[] = [
    {
      id: 'fixed_sleep',
      type: 'sleep',
      periodName: '🌙 পরিমিত ঘুম ও বিশ্রাম (Deep Sleep)',
      startTime: inputs.sleepStart,
      endTime: inputs.sleepEnd,
      formattedTime: formatTimeRangeBn(inputs.sleepStart, inputs.sleepEnd),
      durationMinutes: sleepDuration,
      durationFormatted: formatDurationBn(sleepDuration),
      focusTopic: 'মস্তিষ্কের স্মৃতি একত্রীকরণ ও শারীরিক পূর্ণ শক্তি অর্জন (৭-৮ ঘণ্টা)',
      isCompleted: false,
      categoryTag: 'ঘুম ও স্বাস্থ্য (৭-৮h)',
      categoryTagColor: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    },
    {
      id: 'fixed_morning_prep',
      type: 'meal',
      periodName: `🌅 ফজর ${worshipLabel}, ফ্রেশ হওয়া ও সকালের নাস্তা`,
      startTime: inputs.sleepEnd,
      endTime: minutesToTime(timeToMinutes(inputs.sleepEnd) + 30),
      formattedTime: formatTimeRangeBn(inputs.sleepEnd, minutesToTime(timeToMinutes(inputs.sleepEnd) + 30)),
      durationMinutes: 30,
      durationFormatted: '৩০ মিনিট',
      focusTopic: `${worshipLabel} আদায়, ওযু/গোসল, স্বাস্থ্যকর নাস্তা ও দিনের মানসিক প্রস্তুতি`,
      isCompleted: false,
      categoryTag: 'খাবার ও ইবাদত',
      categoryTagColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    },
    {
      id: 'fixed_school',
      type: 'school',
      periodName: '🏫 স্কুল ও কোচিং সময় (School / Coaching)',
      startTime: inputs.schoolStart,
      endTime: inputs.schoolEnd,
      formattedTime: formatTimeRangeBn(inputs.schoolStart, inputs.schoolEnd),
      durationMinutes: schoolDuration,
      durationFormatted: formatDurationBn(schoolDuration),
      focusTopic: 'স্কুল ক্লাস, প্র্যাকটিক্যাল ল্যাব ও শিক্ষক লেকচার নোট সংগ্রহ',
      isCompleted: false,
      categoryTag: 'প্রাতিষ্ঠানিক সময়',
      categoryTagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    {
      id: 'fixed_lunch_break',
      type: 'meal',
      periodName: `🍽️ যোহর ${worshipLabel}, দুপুরের খাবার ও বিশ্রাম`,
      startTime: inputs.schoolEnd,
      endTime: minutesToTime(timeToMinutes(inputs.schoolEnd) + 60),
      formattedTime: formatTimeRangeBn(inputs.schoolEnd, minutesToTime(timeToMinutes(inputs.schoolEnd) + 60)),
      durationMinutes: 60,
      durationFormatted: '১.০ ঘণ্টা',
      focusTopic: 'পুষ্টিকর মধ্যাহ্নভোজ, হাত-মুখ ধোয়া এবং ২০-৩০ মিনিট পাওয়ার ন্যাপ',
      isCompleted: false,
      categoryTag: 'খাবার ও বিশ্রাম (৩h বাফার)',
      categoryTagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    {
      id: 'fixed_play',
      type: 'play',
      periodName: `⚽ আসর ${worshipLabel}, খেলাধুলা ও মাইন্ড রিফ্রেশ`,
      startTime: inputs.playStart,
      endTime: inputs.playEnd,
      formattedTime: formatTimeRangeBn(inputs.playStart, inputs.playEnd),
      durationMinutes: playDuration,
      durationFormatted: formatDurationBn(playDuration),
      focusTopic: 'শারীরিক এক্টিভিটি, মুক্ত বাতাসে হাঁটা ও রক্ত সঞ্চালন বৃদ্ধি',
      isCompleted: false,
      categoryTag: 'স্বাস্থ্য ও বিনোদন',
      categoryTagColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
    {
      id: 'fixed_dinner_worship',
      type: 'meal',
      periodName: `🍲 এশা ${worshipLabel}, নৈশভোজ ও পরিবারের সাথে সময়`,
      startTime: minutesToTime(timeToMinutes(inputs.sleepStart) - 60),
      endTime: inputs.sleepStart,
      formattedTime: formatTimeRangeBn(minutesToTime(timeToMinutes(inputs.sleepStart) - 60), inputs.sleepStart),
      durationMinutes: 60,
      durationFormatted: '১.০ ঘণ্টা',
      focusTopic: 'রাতের হালকা খাবার, পারিবারিক আলাপচারিতা ও বিছানায় যাওয়ার প্রস্তুতি',
      isCompleted: false,
      categoryTag: 'খাবার ও পারিবারিক (৩h বাফার)',
      categoryTagColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
  ];

  const all = [...studySlots, ...fixedSlots];
  all.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  return all;
};

