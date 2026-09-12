export interface Chapter {
  id: string;
  name: string;
}

export interface Suggestion {
  topic: string;
  priority: '⭐️⭐️⭐️' | '⭐️⭐️';
  chapter?: string;
  formulas?: string[];
  breakdown?: string[];
  cqTips?: string;
  mcqTips?: string;
  targetType?: 'CQ' | 'MCQ' | 'High Priority CQ/MCQ';
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  suggestions?: Suggestion[];
}

export type StreamKey = 'science' | 'business' | 'humanities';
export type ReligionKey = 'islam' | 'hindu' | 'buddhist' | 'christian';
export type ReligionBn = 'ইসলাম' | 'হিন্দু' | 'বৌদ্ধ' | 'খ্রিস্টান';

export type NavTabKey = 'profile' | 'syllabus' | 'routine' | 'progress' | 'suggestions' | 'countdown' | 'admin';

export type ChapterStatus = 'not_started' | 'in_progress' | 'completed' | 'revised';

export interface ChapterProgressData {
  status: ChapterStatus;
  notes?: string;
  completedAt?: string;
  bookReading?: boolean; // 📘 মূল বই রিডিং + কনসেপ্ট ক্লিয়ার
  cqPractice?: boolean;  // ✍️ সৃজনশীল অনুশীলন (CQ Solve)
  mcqPractice?: boolean; // 🔘 বহুনির্বাচনী অনুশীলন (MCQ Solve)
  examTags?: string[];   // 'অর্ধবার্ষিক ✓', 'বার্ষিক ✓', 'প্রাক-নির্বাচনী ✓', 'নির্বাচনী ✓', 'নিজের ✓'
}

export interface SuggestionProgressData {
  mastered: boolean;
}

export interface UserProfile {
  name: string;
  school: string;
  group: string;
  classLevel: string;
  sscBatch: string;
  district: string;
  division: string;
  phone: string;
  avatar: string;
  streakDays: number;
  targetGrade: string;
  religion: ReligionBn;
}

export type FourthSubjectKey = 'hmath' | 'biology' | 'agri' | 'homescience';

export interface RoutineSlot {
  id: string;
  time: string;
  period: string;
  subjectName: string;
  focusTopic: string;
  completed: boolean;
}

export interface UserProgressState {
  profile: UserProfile;
  stream: StreamKey;
  religion: ReligionKey;
  fourthSubject?: FourthSubjectKey;
  customSelectedChapterIds?: string[]; // chapterIds included in custom syllabus filter
  chapters: Record<string, ChapterProgressData>; // chapterId -> data
  suggestions: Record<string, boolean>; // `${subjectId}_${suggestionIndex}` -> mastered
  examDate: string; // ISO date string
  routine?: RoutineSlot[];
}
