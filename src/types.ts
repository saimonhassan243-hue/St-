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

export type NavTabKey = 'profile' | 'syllabus' | 'routine' | 'weakpoints' | 'gamification' | 'analytics' | 'progress' | 'suggestions' | 'countdown' | 'admin';

export type ChapterStatus = 'not_started' | 'in_progress' | 'completed' | 'revised';

export type WeakPointStatus = 'struggling' | 'needs_revision' | 'mastered';

export interface ChapterWeakPointData {
  chapterId: string;
  topicChecklist: Record<string, WeakPointStatus>; // topicId -> status
  customWeakPoints: { id: string; text: string; createdAt: string; isResolved?: boolean }[];
  personalNotes?: string;
  updatedAt?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  category: 'mastery' | 'streak' | 'time' | 'special';
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentValue: number;
  targetValue: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface LeaderboardStudent {
  rank: number;
  name: string;
  school: string;
  xp: number;
  streak: number;
  avatar: string;
  batch: string;
  group: string;
  isCurrentUser?: boolean;
  level: number;
  badgeTitle: string;
  completedChapters: number;
}

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
  syllabusPath?: 'standard' | 'custom';
  hasCompletedOnboarding?: boolean;
  isSyllabusConfigured?: boolean;
  customSelectedChapterIds?: string[]; // chapterIds included in custom syllabus filter
  chapters: Record<string, ChapterProgressData>; // chapterId -> data
  suggestions: Record<string, boolean>; // `${subjectId}_${suggestionIndex}` -> mastered
  examDate: string; // ISO date string
  routine?: RoutineSlot[];
}

export interface GlobalNoticeData {
  isNoticeActive: boolean;
  title: string;
  message: string;
  severity?: 'urgent' | 'warning' | 'info';
  updatedAt?: string;
  updatedBy?: string;
  allowStudentDismiss?: boolean;
}

export interface DeviceSecurityInfo {
  deviceID: string;
  ipAddress: string;
  userAgent?: string;
  last_seen?: string;
}

export interface BannedDeviceRecord {
  deviceID: string;
  reason?: string;
  banned_at: string;
  banned_by?: string;
  user_name?: string;
  user_email?: string;
}

export interface BannedIpRecord {
  ipAddress: string;
  reason?: string;
  banned_at: string;
  banned_by?: string;
  user_name?: string;
  user_email?: string;
}

export interface FirebaseUserData {
  userId?: string;
  name: string;
  email: string;
  provider: 'Google' | 'Email';
  batch: string;
  group: string;
  created_at: string;
  total_study_minutes: number;
  streak_count: number;
  last_login: string;
  fourth_subject?: string;
  syllabus_path?: string;
  onboarding_completed?: boolean;
  security_info?: DeviceSecurityInfo;
  is_banned?: boolean;
  completion_percentage?: number;
}

export interface AuthSession {
  isLoggedIn: boolean;
  user: FirebaseUserData;
}

