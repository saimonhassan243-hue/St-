import { Subject, StreamKey, ReligionBn } from '../types';
import { toBengaliNumber } from './progressCalculator';

export interface ScheduleInputs {
  targetStudyHours: number; // e.g., 5
  schoolStart: string; // "08:00"
  schoolEnd: string; // "13:30"
  playStart: string; // "17:00"
  playEnd: string; // "18:30"
  sleepStart: string; // "22:30"
  sleepEnd: string; // "05:30"
}

export type SlotType = 'study' | 'school' | 'play' | 'sleep' | 'break';
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
  committedMinutes: number; // Sleep + School + Play
  freeMinutes: number; // 1440 - committed
  targetStudyMinutes: number;
  remainingLeisureMinutes: number; // free - targetStudy
  sleepHours: number;
  schoolHours: number;
  playHours: number;
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

// Compute high-level schedule metrics from inputs
export const computeScheduleMetrics = (inputs: ScheduleInputs): ScheduleMetrics => {
  const sleepMinutes = getIntervalMinutes(inputs.sleepStart, inputs.sleepEnd);
  const schoolMinutes = getIntervalMinutes(inputs.schoolStart, inputs.schoolEnd);
  const playMinutes = getIntervalMinutes(inputs.playStart, inputs.playEnd);

  const committedMinutes = sleepMinutes + schoolMinutes + playMinutes;
  const freeMinutes = Math.max(0, 1440 - committedMinutes);
  const targetStudyMinutes = Math.round(inputs.targetStudyHours * 60);
  const remainingLeisureMinutes = Math.max(0, freeMinutes - targetStudyMinutes);

  return {
    totalDayMinutes: 1440,
    sleepMinutes,
    schoolMinutes,
    playMinutes,
    committedMinutes,
    freeMinutes,
    targetStudyMinutes,
    remainingLeisureMinutes,
    sleepHours: Math.round((sleepMinutes / 60) * 10) / 10,
    schoolHours: Math.round((schoolMinutes / 60) * 10) / 10,
    playHours: Math.round((playMinutes / 60) * 10) / 10,
    freeHours: Math.round((freeMinutes / 60) * 10) / 10,
    targetStudyHours: inputs.targetStudyHours,
  };
};

/**
 * AUTO ROUTINE ALLOCATION ALGORITHM:
 * 1. Deduct School, Play, and Sleep hours from 24 hours to identify free daytime slots.
 * 2. Evenly distribute the requested target study hours into morning, evening, and night blocks.
 * 3. Assign active subjects and 3 core tasks:
 *    - Morning Slot: 📘 Concept Clear (33.3% Weight) - Sharp fresh mind
 *    - Evening Slot: ✍️ CQ Solve (33.3% Weight) - Deep creative problem solving
 *    - Night Slot: 🔘 MCQ Solve (33.4% Weight) - Speed recall & revision
 */
export const buildAutomatedRoutine = (
  inputs: ScheduleInputs,
  activeSubjects: Subject[],
  stream: StreamKey,
  religionBn: ReligionBn,
  savedCompletionState: Record<string, boolean> = {}
): RoutineTimeSlot[] => {
  const targetMinutes = Math.max(60, Math.round(inputs.targetStudyHours * 60));

  // Determine subjects for the 3 study blocks:
  // Subject 1 (Morning): Math or Physics/Accounting
  const mathSubject = activeSubjects.find(s => s.name.includes('গণিত') || s.name.includes('Math'));
  const morningSubject = mathSubject || activeSubjects[0] || { name: 'সাধারণ গণিত' };

  // Subject 2 (Evening): Core Stream Subject
  const deptSubject = activeSubjects.find(s => {
    if (stream === 'science') return s.name.includes('পদার্থ') || s.name.includes('রসায়ন') || s.name.includes('জীব');
    if (stream === 'business') return s.name.includes('হিসাব') || s.name.includes('ব্যবসায়');
    return s.name.includes('ইতিহাস') || s.name.includes('পৌরনীতি') || s.name.includes('ভূগোল');
  });
  const eveningSubject = deptSubject || activeSubjects[1] || { name: 'বিভাগীয় প্রধান বিষয়' };

  // Subject 3 (Night): Religion, Language (Bangla/English), or ICT
  const relSubject = activeSubjects.find(s => s.name.includes('ধর্ম') || s.name.includes('শিক্ষা'));
  const nightSubject = relSubject || activeSubjects.find(s => s.name.includes('বাংলা') || s.name.includes('ইংরেজি') || s.name.includes('তথ্য')) || { name: `${religionBn} ও নৈতিক শিক্ষা` };

  // Calculate duration distribution for morning, evening, and night:
  // Evening is typically the longest study block (35-40%), Morning (30%), Night (30%)
  let morningDuration = 0;
  let eveningDuration = 0;
  let nightDuration = 0;
  let afternoonDuration = 0;

  if (inputs.targetStudyHours <= 4) {
    // 4 hours or less: Split across morning, evening, night
    morningDuration = Math.round((targetMinutes * 0.3) / 15) * 15;
    eveningDuration = Math.round((targetMinutes * 0.4) / 15) * 15;
    nightDuration = targetMinutes - (morningDuration + eveningDuration);
  } else if (inputs.targetStudyHours <= 6) {
    // 5 to 6 hours: Morning 90-105m, Evening 120-150m, Night 90-105m
    morningDuration = Math.round((targetMinutes * 0.3) / 15) * 15;
    eveningDuration = Math.round((targetMinutes * 0.4) / 15) * 15;
    nightDuration = targetMinutes - (morningDuration + eveningDuration);
  } else {
    // > 6 hours (Intensive preparation): 4 blocks (Morning, Afternoon, Evening, Night)
    morningDuration = 105; // 1h 45m
    afternoonDuration = 90; // 1h 30m
    eveningDuration = 150; // 2h 30m
    nightDuration = targetMinutes - (morningDuration + afternoonDuration + eveningDuration);
    if (nightDuration < 60) nightDuration = 60;
  }

  // 1. Morning study block placement:
  // Starts after waking up (sleepEnd + 30 mins for prayer/fresh)
  const wakeM = timeToMinutes(inputs.sleepEnd);
  const morningStartM = wakeM + 30; // e.g. 05:30 + 30 = 06:00
  const morningEndM = morningStartM + morningDuration;

  // 2. Evening study block placement:
  // Starts right after play/relaxation ends (playEnd)
  const playEndM = timeToMinutes(inputs.playEnd); // e.g. 18:30 (06:30 PM)
  const eveningStartM = playEndM;
  const eveningEndM = eveningStartM + eveningDuration;

  // 3. Night study block placement:
  // Starts after dinner break (e.g. 21:00 or 21:15) and ends around sleepStart
  const sleepStartM = timeToMinutes(inputs.sleepStart); // e.g. 22:30
  const nightEndM = sleepStartM;
  const nightStartM = nightEndM - nightDuration;

  // Build the list of slots
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
    subjectTitle: morningSubject.name,
    focusTopic: 'মূল সূত্র, উপপাদ্য ও মৌলিক ধারণা স্পষ্টকরণ',
    assignedTask: 'concept_clear',
    assignedTaskTitle: '📘 Concept Clear (৩৩.৩% ওয়েট)',
    taskBadgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    isCompleted: Boolean(savedCompletionState['block_morning_study']),
    categoryTag: 'আবশ্যিক মৌলিক',
    categoryTagColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  });

  // Optional Afternoon Study Block for intensive study plans (>6h)
  if (afternoonDuration > 0) {
    const afternoonStartM = timeToMinutes(inputs.schoolEnd) + 90; // 1.5h after school (lunch/rest)
    const afternoonEndM = afternoonStartM + afternoonDuration;
    const aftStartStr = minutesToTime(afternoonStartM);
    const aftEndStr = minutesToTime(afternoonEndM);
    const extraSubject = activeSubjects[2] || { name: 'বাংলা ২য় পত্র / ইংরেজি' };
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

// Generate complete 24-hour day schedule for visual timetable comparison
export const buildFullDayTimeline = (
  inputs: ScheduleInputs,
  studySlots: RoutineTimeSlot[]
): RoutineTimeSlot[] => {
  const schoolDuration = getIntervalMinutes(inputs.schoolStart, inputs.schoolEnd);
  const playDuration = getIntervalMinutes(inputs.playStart, inputs.playEnd);
  const sleepDuration = getIntervalMinutes(inputs.sleepStart, inputs.sleepEnd);

  const nonStudySlots: RoutineTimeSlot[] = [
    {
      id: 'fixed_school',
      type: 'school',
      periodName: '🏫 স্কুল ও ক্লাস সময় (School Hours)',
      startTime: inputs.schoolStart,
      endTime: inputs.schoolEnd,
      formattedTime: formatTimeRangeBn(inputs.schoolStart, inputs.schoolEnd),
      durationMinutes: schoolDuration,
      durationFormatted: formatDurationBn(schoolDuration),
      focusTopic: 'স্কুলের নিয়মিত ক্লাস, প্র্যাকটিক্যাল ল্যাব ও শিক্ষক নোট',
      isCompleted: false,
      categoryTag: 'প্রাতিষ্ঠানিক',
      categoryTagColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    {
      id: 'fixed_play',
      type: 'play',
      periodName: '⚽ খেলাধুলা ও মাইন্ড রিফ্রেশ (Play & Refreshment)',
      startTime: inputs.playStart,
      endTime: inputs.playEnd,
      formattedTime: formatTimeRangeBn(inputs.playStart, inputs.playEnd),
      durationMinutes: playDuration,
      durationFormatted: formatDurationBn(playDuration),
      focusTopic: 'শারীরিক ব্যায়াম, বন্ধুদের সাথে খেলা ও মস্তিষ্ক রিচার্জ',
      isCompleted: false,
      categoryTag: 'বিনোদন ও স্বাস্থ্য',
      categoryTagColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    },
    {
      id: 'fixed_sleep',
      type: 'sleep',
      periodName: '🌙 পরিমিত ঘুম ও বিশ্রাম (Deep Sleep)',
      startTime: inputs.sleepStart,
      endTime: inputs.sleepEnd,
      formattedTime: formatTimeRangeBn(inputs.sleepStart, inputs.sleepEnd),
      durationMinutes: sleepDuration,
      durationFormatted: formatDurationBn(sleepDuration),
      focusTopic: 'পরবর্তী দিনের জন্য পূর্ণ শক্তি অর্জন ও স্মৃতি সংরক্ষণ',
      isCompleted: false,
      categoryTag: 'বিশ্রাম ও স্বাস্থ্য',
      categoryTagColor: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
    },
  ];

  // Combine and sort by chronological start time
  const all = [...studySlots, ...nonStudySlots];
  all.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  return all;
};
