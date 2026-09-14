/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, BookOpen, Calendar, Target, Star, Timer, 
  GraduationCap, Award, RotateCcw, AlertCircle, Bookmark, Sparkles,
  Shield, ShieldAlert, KeyRound
} from 'lucide-react';
import { 
  StreamKey, 
  ReligionKey, 
  ReligionBn,
  Subject, 
  ChapterStatus, 
  ChapterProgressData,
  UserProfile, 
  UserProgressState,
  NavTabKey,
  FourthSubjectKey,
  GlobalNoticeData,
  FirebaseUserData
} from './types';
import { 
  COMPULSORY_SUBJECTS, 
  STREAM_SUBJECTS, 
  RELIGION_DATA,
  FOURTH_SUBJECT_OPTIONS,
  getFourthSubject,
  mapProfileReligionToSubjectKey,
  mapSubjectKeyToProfileReligion
} from './data/curriculum';
import { ModernStudentProfile, AI_AVATARS_LIST } from './components/ModernStudentProfile';
import { SubjectsSlide } from './components/SubjectsSlide';
import { ProgressSlide } from './components/ProgressSlide';
import { RoutineView } from './components/RoutineView';
import { CountdownView } from './components/CountdownView';
import { SuggestionsView } from './components/SuggestionsView';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EmergencyBroadcastLockOverlay } from './components/EmergencyBroadcastLockOverlay';
import { SystemAdminPanel } from './components/SystemAdminPanel';
import { UserAuthModal } from './components/UserAuthModal';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { BannedAccessLockOverlay } from './components/BannedAccessLockOverlay';
import { 
  checkIfDeviceOrIpBanned, 
  getOrCreateDeviceId, 
  getDeviceSecurityInfo,
  BanCheckResult 
} from './services/deviceSecurityService';
import { 
  fetchGlobalNotice, 
  updateGlobalNotice, 
  DEFAULT_NOTICE_DATA,
  STORAGE_KEY_NOTICE 
} from './services/firebaseNoticeService';
import { 
  getLocalAuthUser, 
  syncUserToFirebase, 
  calculateStudyMinutes, 
  sanitizeUserId,
  hasActiveAuthSession,
  saveLocalAuthSession,
  clearLocalAuthSession,
  hasCompletedOnboardingCheck,
  setOnboardingCompleted
} from './services/firebaseUserService';

const STORAGE_KEY = 'ssc_student_dashboard_v2';

const DEFAULT_PROFILE: UserProfile = {
  name: 'মো: সাইমন হাসান',
  school: 'সরকারি জিলা স্কুল',
  group: 'বিজ্ঞান (Science)',
  classLevel: 'নবম শ্রেণী (Class 9)',
  sscBatch: 'SSC 2028',
  district: 'কুমিল্লা',
  division: 'চট্টগ্রাম',
  phone: '+880 1700-000000',
  avatar: AI_AVATARS_LIST[0].url,
  streakDays: 15,
  targetGrade: 'GPA 5.00 (Golden A+)',
  religion: 'ইসলাম',
};

export default function StudentDashboard() {
  // ১. মাস্টার নেভিগেশন স্টেট: ৬টি অপশন
  const [activeTab, setActiveTab] = useState<NavTabKey>('profile');

  // ২. স্টেট লোডিং ও ডিফল্ট ফলব্যাক অ্যাসুরেন্স
  const [userState, setUserState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedReligion = parsed.religion || 'islam';
        const savedProfileReligion = parsed.profile?.religion || mapSubjectKeyToProfileReligion(savedReligion);

        return {
          profile: { 
            ...DEFAULT_PROFILE, 
            ...(parsed.profile || {}),
            religion: savedProfileReligion
          },
          stream: parsed.stream || 'science',
          religion: mapProfileReligionToSubjectKey(savedProfileReligion),
          fourthSubject: parsed.fourthSubject || 'hmath',
          customSelectedChapterIds: parsed.customSelectedChapterIds,
          chapters: parsed.chapters || {},
          suggestions: parsed.suggestions || {},
          examDate: parsed.examDate || '2028-02-15',
        };
      }
    } catch (e) {
      console.error('Crash-Proof recovery: Failed to load storage, initializing safe defaults:', e);
    }
    return {
      profile: DEFAULT_PROFILE,
      stream: 'science',
      religion: 'islam',
      chapters: {},
      suggestions: {},
      examDate: '2028-02-15',
    };
  });

  const [showResetModal, setShowResetModal] = useState(false);

  // Global Notice & Emergency Broadcast State
  const [globalNotice, setGlobalNotice] = useState<GlobalNoticeData | null>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_NOTICE);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  });
  const [isAdminBypassed, setIsAdminBypassed] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // Device & IP Ban Verification State
  const [banStatus, setBanStatus] = useState<BanCheckResult>({ isBanned: false });
  const [isBanChecking, setIsBanChecking] = useState<boolean>(true);

  // Authentication & Onboarding Enforcement State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return hasActiveAuthSession();
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    return !hasActiveAuthSession();
  });
  const [hasOnboardingCompleted, setHasOnboardingCompleted] = useState<boolean>(() => {
    return hasCompletedOnboardingCheck();
  });
  const [showOnboardingWizard, setShowOnboardingWizard] = useState<boolean>(() => {
    return hasActiveAuthSession() && !hasCompletedOnboardingCheck();
  });
  const [wizardKey, setWizardKey] = useState<number>(0);
  const [showSyllabusAlert, setShowSyllabusAlert] = useState<boolean>(false);

  // Recheck Ban Status Function
  const checkLiveBanStatus = async () => {
    try {
      const res = await checkIfDeviceOrIpBanned();
      setBanStatus(res);
      return res;
    } catch {
      return { isBanned: false };
    }
  };

  // Startup Security & Ban Verification
  useEffect(() => {
    const runInitialBanVerification = async () => {
      setIsBanChecking(true);
      try {
        await checkLiveBanStatus();
      } finally {
        setIsBanChecking(false);
      }
    };
    runInitialBanVerification();
  }, []);

  // Live Registered User State (Synced with /users/{userId}.json in Firebase RTDB)
  const [currentUser, setCurrentUser] = useState<FirebaseUserData>(() => {
    const saved = getLocalAuthUser();
    if (saved) return saved;
    return {
      userId: 'saimon_hassan243_gmail_com',
      name: DEFAULT_PROFILE.name,
      email: 'saimon.hassan243@gmail.com',
      provider: 'Google',
      batch: DEFAULT_PROFILE.sscBatch,
      group: DEFAULT_PROFILE.group,
      created_at: new Date('2026-09-01T08:30:00.000Z').toISOString(),
      total_study_minutes: 1980,
      streak_count: 15,
      last_login: new Date().toISOString(),
    };
  });

  // Auto-sync current student session to Firebase Realtime Database at /users/{userId}.json
  useEffect(() => {
    const totalMinutes = calculateStudyMinutes(userState.chapters);
    const fourthSubjectObj = FOURTH_SUBJECT_OPTIONS.find(f => f.id === userState.fourthSubject);
    const updatedUser: FirebaseUserData = {
      ...currentUser,
      name: userState.profile.name || currentUser.name,
      batch: userState.profile.sscBatch || currentUser.batch,
      group: userState.profile.group || currentUser.group,
      fourth_subject: fourthSubjectObj?.label || currentUser.fourth_subject || 'উচ্চতর গণিত',
      syllabus_path: userState.syllabusPath === 'standard' ? 'বোর্ড স্ট্যান্ডার্ড SSC 2028' : userState.syllabusPath === 'custom' ? 'কাস্টম সিলেবাস বিল্ডার' : (currentUser.syllabus_path || 'বোর্ড স্ট্যান্ডার্ড SSC 2028'),
      onboarding_completed: hasOnboardingCompleted,
      streak_count: userState.profile.streakDays || currentUser.streak_count || 15,
      total_study_minutes: totalMinutes,
      last_login: new Date().toISOString(),
    };
    syncUserToFirebase(updatedUser).then((res) => {
      if (res.data) {
        setCurrentUser(res.data);
      }
    }).catch((err) => {
      console.warn('Silent user RTDB sync catch:', err);
    });
  }, [
    userState.profile.name, 
    userState.profile.group, 
    userState.profile.sscBatch, 
    userState.profile.streakDays,
    userState.fourthSubject,
    userState.syllabusPath,
    hasOnboardingCompleted
  ]);

  const handleUserAuthenticated = (authUserData: FirebaseUserData) => {
    saveLocalAuthSession(authUserData);
    setCurrentUser(authUserData);
    setIsAuthenticated(true);
    setShowAuthModal(false);

    setUserState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: authUserData.name,
        group: (authUserData.group as any) || prev.profile.group,
        sscBatch: authUserData.batch || prev.profile.sscBatch,
      },
    }));

    const isDone = authUserData.onboarding_completed || hasCompletedOnboardingCheck();
    if (isDone) {
      setHasOnboardingCompleted(true);
      setOnboardingCompleted(true);
    } else {
      setShowOnboardingWizard(true);
    }
  };

  const handleLogout = () => {
    clearLocalAuthSession();
    setIsAuthenticated(false);
    setShowAuthModal(true);
  };

  const handleTabSelect = (tab: NavTabKey) => {
    if (tab === 'syllabus') {
      // Force-reset the wizard state to Step 1 and open overlay modal immediately
      setWizardKey((prev) => prev + 1);
      setShowOnboardingWizard(true);
      setShowSyllabusAlert(false);
      return;
    }
    setActiveTab(tab);
  };

  const handleCompleteOnboarding = (data: {
    profile: Partial<UserProfile>;
    stream: StreamKey;
    religion: ReligionKey;
    fourthSubject: FourthSubjectKey;
    syllabusPath: 'standard' | 'custom';
    customSelectedChapterIds?: string[];
  }) => {
    setOnboardingCompleted(true);
    setHasOnboardingCompleted(true);
    setShowOnboardingWizard(false);
    setShowSyllabusAlert(false);

    setUserState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...data.profile },
      stream: data.stream,
      religion: data.religion,
      fourthSubject: data.fourthSubject,
      syllabusPath: data.syllabusPath,
      customSelectedChapterIds: data.customSelectedChapterIds,
      hasCompletedOnboarding: true,
    }));

    const fourthSubjectObj = FOURTH_SUBJECT_OPTIONS.find(f => f.id === data.fourthSubject);
    const updatedUser: FirebaseUserData = {
      ...currentUser,
      name: data.profile.name || currentUser.name,
      group: data.profile.group || currentUser.group,
      batch: data.profile.sscBatch || currentUser.batch,
      fourth_subject: fourthSubjectObj?.label || data.fourthSubject,
      syllabus_path: data.syllabusPath === 'standard' ? 'বোর্ড স্ট্যান্ডার্ড SSC 2028' : 'কাস্টম সিলেবাস বিল্ডার',
      onboarding_completed: true,
      last_login: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    syncUserToFirebase(updatedUser).catch((err) => console.warn('Silent sync catch:', err));
  };

  // Fetch notice from Firebase Realtime Database
  const checkNotice = async () => {
    const notice = await fetchGlobalNotice();
    if (notice) {
      setGlobalNotice(notice);
    }
  };

  // Initial fetch and 30s polling + online/offline event handlers
  useEffect(() => {
    checkNotice();
    const interval = setInterval(checkNotice, 30000);

    const handleOnline = () => {
      setIsOffline(false);
      checkNotice();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [userState]);

  // Dynamic Subject Binding based on Selected Religion
  const compulsory = COMPULSORY_SUBJECTS;
  const streamSubjects = useMemo(() => {
    const list = STREAM_SUBJECTS[userState.stream] || STREAM_SUBJECTS.science;
    if (userState.stream === 'science') {
      const fourthKey = userState.fourthSubject || 'hmath';
      if (fourthKey === 'hmath') {
        return list.filter((s) => s.id !== 'hmath');
      } else if (fourthKey === 'biology') {
        return list.filter((s) => s.id === 'phy' || s.id === 'chem' || s.id === 'hmath' || s.id === 'bgs');
      }
    }
    return list;
  }, [userState.stream, userState.fourthSubject]);

  // DYNAMIC RELIGION FILTER MECHANICS:
  // 1. Student Profile Data Check: Read selected religion from profile
  // 2. Dynamic Subject Binding: If 'ইসলাম' -> islam, If 'হিন্দু' -> hindu, If 'বৌদ্ধ' -> buddhist, If 'খ্রিস্টান' -> christian
  // 3. Automatically hide other religion books so students only see their relevant religious studies textbook
  const religionSubject: Subject = useMemo(() => {
    const key = mapProfileReligionToSubjectKey(userState.profile?.religion || userState.religion);
    return RELIGION_DATA[key] || RELIGION_DATA.islam;
  }, [userState.profile?.religion, userState.religion]);

  const fourthSubjectKey: FourthSubjectKey = userState.fourthSubject || 'hmath';
  const fourthSubject: Subject = useMemo(() => {
    return getFourthSubject(fourthSubjectKey);
  }, [fourthSubjectKey]);

  const allActiveSubjects: Subject[] = useMemo(() => {
    return [...compulsory, ...streamSubjects, fourthSubject, religionSubject];
  }, [compulsory, streamSubjects, fourthSubject, religionSubject]);

  const handleFourthSubjectChange = (key: FourthSubjectKey) => {
    setUserState((prev) => ({
      ...prev,
      fourthSubject: key,
    }));
  };

  const handleSaveCustomSyllabus = (selectedIds: string[] | undefined) => {
    setUserState((prev) => ({
      ...prev,
      customSelectedChapterIds: selectedIds,
    }));
  };

  // Profile update handler with synchronized religion binding
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserState((prev) => {
      const newProfile = { ...prev.profile, ...updated };
      let newReligionKey = prev.religion;

      if (updated.religion) {
        newReligionKey = mapProfileReligionToSubjectKey(updated.religion);
      }

      return {
        ...prev,
        profile: newProfile,
        religion: newReligionKey,
      };
    });
  };

  // Group / Stream change handler
  const handleStreamChange = (stream: StreamKey) => {
    const groupNameMap: Record<StreamKey, string> = {
      science: 'বিজ্ঞান (Science)',
      business: 'ব্যবসায় শিক্ষা (Business Studies)',
      humanities: 'মানবিক (Humanities)',
    };
    setUserState((prev) => ({
      ...prev,
      stream,
      profile: {
        ...prev.profile,
        group: groupNameMap[stream] || prev.profile.group,
      },
    }));
  };

  // Subject Switcher / Religion change handler
  const handleReligionChange = (religion: ReligionKey) => {
    const bnLabel = mapSubjectKeyToProfileReligion(religion);
    setUserState((prev) => ({
      ...prev,
      religion,
      profile: {
        ...prev.profile,
        religion: bnLabel,
      },
    }));
  };

  // Chapter tracking handlers
  const handleUpdateChapterStatus = (chapterId: string, status: ChapterStatus) => {
    setUserState((prev) => {
      const isDone = status === 'completed' || status === 'revised';
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...prev.chapters[chapterId],
            status,
            completedAt: isDone ? new Date().toISOString() : undefined,
            bookReading: isDone ? true : prev.chapters[chapterId]?.bookReading,
            cqPractice: isDone ? true : prev.chapters[chapterId]?.cqPractice,
            mcqPractice: isDone ? true : prev.chapters[chapterId]?.mcqPractice,
          },
        },
      };
    });
  };

  const handleUpdateProgressData = (chapterId: string, updated: Partial<ChapterProgressData>) => {
    setUserState((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterId]: {
          ...prev.chapters[chapterId],
          ...updated,
        },
      },
    }));
  };

  const handleUpdateChapterNote = (chapterId: string, note: string) => {
    setUserState((prev) => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterId]: {
          ...prev.chapters[chapterId],
          notes: note,
          status: prev.chapters[chapterId]?.status || 'not_started',
        },
      },
    }));
  };

  const handleToggleSuggestion = (subjectId: string, index: number) => {
    const key = `${subjectId}_${index}`;
    setUserState((prev) => ({
      ...prev,
      suggestions: {
        ...prev.suggestions,
        [key]: !prev.suggestions[key],
      },
    }));
  };

  const handleBatchSetStatus = (subject: Subject, status: ChapterStatus) => {
    setUserState((prev) => {
      const updatedChapters = { ...prev.chapters };
      subject.chapters.forEach((c) => {
        updatedChapters[c.id] = {
          ...updatedChapters[c.id],
          status,
          completedAt: (status === 'completed' || status === 'revised') ? new Date().toISOString() : undefined,
        };
      });
      return {
        ...prev,
        chapters: updatedChapters,
      };
    });
  };

  const handleUpdateExamDate = (newDate: string) => {
    setUserState((prev) => ({ ...prev, examDate: newDate }));
  };

  const handleResetProgress = () => {
    setUserState((prev) => ({
      ...prev,
      chapters: {},
      suggestions: {},
    }));
    setShowResetModal(false);
  };

  const handleSystemRestore = () => {
    setUserState({
      profile: DEFAULT_PROFILE,
      stream: 'science',
      religion: 'islam',
      chapters: {},
      suggestions: {},
      examDate: '2028-02-15',
    });
    setActiveTab('profile');
  };

  return (
    <ErrorBoundary onReset={handleSystemRestore}>
      <div className="min-h-screen bg-[#0F172A] text-slate-100 font-hind selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden flex flex-col justify-between">
        {/* Background ambient gradient glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/20 via-slate-900/0 to-transparent pointer-events-none -z-10" />

        {/* Master Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:py-3.5">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-3">
            
            {/* Student & Brand Identity */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-base font-bold text-white tracking-wide font-jakarta">
                      SSC MASTER PLATFORM
                    </h1>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-anek">
                      {userState.profile.sscBatch}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-anek truncate max-w-xs sm:max-w-sm">
                    <span className="text-slate-200 font-semibold">{userState.profile.name}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                    <span className="truncate">{userState.profile.school}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Religion Indicator Badge (Visible on mobile/desktop header) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTabSelect('syllabus')}
                  title="ক্লিক করে সিলেবাসে ধর্মীয় বই দেখুন"
                  className="lg:hidden px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold font-anek flex items-center gap-1 shrink-0"
                >
                  <Bookmark className="w-3 h-3 text-amber-400" />
                  <span>{userState.profile.religion || 'ইসলাম'}</span>
                </button>

                {/* Mobile User Auth Button */}
                <button
                  onClick={() => setShowAuthModal(true)}
                  title="ইউজার একাউন্ট ও Firebase সিঙ্ক"
                  className="lg:hidden p-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:text-white"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* Mobile Admin Trigger Button */}
                <button
                  onClick={() => setShowAdminPanel(true)}
                  title="সিস্টেম অ্যাডমিন প্যানেল"
                  className="lg:hidden p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                >
                  <Shield className="w-4 h-4 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Desktop Top Nav Switcher & Religion Status Pill */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Active Religion Pill */}
              <button
                onClick={() => handleTabSelect('syllabus')}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-anek flex items-center gap-1.5 transition-all hover:bg-amber-500/25"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>ধর্ম: {religionSubject.name}</span>
              </button>

              {/* Header Tab Quick Links */}
              <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-white/10 shadow-inner">
                {[
                  { id: 'profile' as NavTabKey, label: 'প্রোফাইল', icon: User },
                  { id: 'syllabus' as NavTabKey, label: 'সিলেবাস', icon: BookOpen },
                  { id: 'routine' as NavTabKey, label: 'রুটিন', icon: Calendar },
                  { id: 'progress' as NavTabKey, label: 'প্রোগ্রেস', icon: Target },
                  { id: 'suggestions' as NavTabKey, label: 'সাজেশন', icon: Star },
                  { id: 'countdown' as NavTabKey, label: 'কাউন্টডাউন', icon: Timer },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabSelect(tab.id)}
                      className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 z-10 ${
                        isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="headerActivePill"
                          className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-md shadow-indigo-600/40"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Desktop User Account & Realtime Sync Button */}
              <button
                onClick={() => setShowAuthModal(true)}
                title="শিক্ষার্থী একাউন্ট ও Firebase সিঙ্ক"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-anek truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                  {currentUser.provider}
                </span>
              </button>

              {/* Desktop Admin Trigger Button */}
              <button
                onClick={() => setShowAdminPanel(true)}
                title="সিস্টেম অ্যাডমিন ও এমার্জেন্সি ব্রডকাস্ট (Passcode: 1919131514)"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-anek">অ্যাডমিন</span>
              </button>
            </div>

          </div>
        </header>

        {/* কন্টেন্ট এরিয়া (Ample bottom padding pb-28 sm:pb-32 for the Floating Bottom Bar) */}
        <main className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8 pb-28 sm:pb-32 w-full flex-1">
          <AnimatePresence mode="wait">
            {/* 1. 👤 প্রোফাইল (Profile) */}
            {activeTab === 'profile' && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <ModernStudentProfile
                  profile={userState.profile}
                  onUpdateProfile={handleUpdateProfile}
                  onGoToSubjects={() => handleTabSelect('syllabus')}
                  onGoToProgress={() => handleTabSelect('progress')}
                  onOpenAuthModal={() => setShowAuthModal(true)}
                  onOpenOnboardingWizard={() => setShowOnboardingWizard(true)}
                  onLogout={handleLogout}
                  currentUser={currentUser}
                />
              </motion.div>
            )}

            {/* 2. 📚 সিলেবাস (Syllabus) */}
            {activeTab === 'syllabus' && (
              <motion.div
                key="tab-syllabus"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <SubjectsSlide
                  compulsorySubjects={compulsory}
                  streamSubjects={streamSubjects}
                  fourthSubject={fourthSubject}
                  fourthSubjectKey={fourthSubjectKey}
                  customSelectedChapterIds={userState.customSelectedChapterIds}
                  religionSubject={religionSubject}
                  stream={userState.stream}
                  religion={userState.religion}
                  chapterProgress={userState.chapters}
                  suggestionProgress={userState.suggestions}
                  onStreamChange={handleStreamChange}
                  onReligionChange={handleReligionChange}
                  onFourthSubjectChange={handleFourthSubjectChange}
                  onSaveCustomSyllabus={handleSaveCustomSyllabus}
                  onUpdateStatus={handleUpdateChapterStatus}
                  onUpdateNote={handleUpdateChapterNote}
                  onToggleSuggestion={handleToggleSuggestion}
                  onBatchSetStatus={handleBatchSetStatus}
                  onUpdateProgressData={handleUpdateProgressData}
                />
              </motion.div>
            )}

            {/* 3. 📅 রুটিন (Routine) */}
            {activeTab === 'routine' && (
              <motion.div
                key="tab-routine"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <RoutineView
                  profile={userState.profile}
                  stream={userState.stream}
                  religionSubject={religionSubject}
                  religionBn={userState.profile.religion || 'ইসলাম'}
                  allActiveSubjects={allActiveSubjects}
                  chapterProgress={userState.chapters}
                  customSelectedChapterIds={userState.customSelectedChapterIds}
                  onUpdateProgressData={handleUpdateProgressData}
                  onNavigateToSyllabus={() => setActiveTab('syllabus')}
                />
              </motion.div>
            )}

            {/* 4. 🎯 প্রোগ্রেস (Progress) */}
            {activeTab === 'progress' && (
              <motion.div
                key="tab-progress"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <ProgressSlide
                  profile={userState.profile}
                  subjects={allActiveSubjects}
                  chapterProgress={userState.chapters}
                  suggestionProgress={userState.suggestions}
                  customSelectedChapterIds={userState.customSelectedChapterIds}
                  onUpdateProfile={handleUpdateProfile}
                  onResetProgress={() => setShowResetModal(true)}
                  onUpdateProgressData={handleUpdateProgressData}
                  onNavigateToSyllabus={() => setActiveTab('syllabus')}
                />
              </motion.div>
            )}

            {/* 5. ⭐️ সাজেশন (Suggestions) */}
            {activeTab === 'suggestions' && (
              <motion.div
                key="tab-suggestions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="bg-slate-900/80 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
                  <SuggestionsView
                    compulsorySubjects={compulsory}
                    streamSubjects={streamSubjects}
                    religionSubject={religionSubject}
                    suggestionProgress={userState.suggestions}
                    onToggleSuggestion={handleToggleSuggestion}
                  />
                </div>
              </motion.div>
            )}

            {/* 6. ⏱️ কাউন্টডাউন (Countdown) */}
            {activeTab === 'countdown' && (
              <motion.div
                key="tab-countdown"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CountdownView
                  profile={userState.profile}
                  examDate={userState.examDate}
                  onUpdateExamDate={handleUpdateExamDate}
                  onOpenAdmin={() => setShowAdminPanel(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* MASTER FLOATING BOTTOM NAVIGATION BAR */}
        <FloatingBottomNav
          activeTab={activeTab}
          onChangeTab={handleTabSelect}
          streakCount={userState.profile.streakDays}
        />

        {/* Footer */}
        <footer className="w-full text-center text-xs text-slate-500 py-6 border-t border-white/5 bg-slate-950/40">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-anek">
            <span className="text-slate-400">
              {userState.profile.name} • {userState.profile.school} ({userState.profile.sscBatch})
            </span>
            <span className="text-slate-600">
              ধর্ম পাঠ্যবই: {religionSubject.name} • Enterprise Dark Edition
            </span>
          </div>
        </footer>

        {/* Global Emergency Broadcast Lock Overlay */}
        {((globalNotice?.isNoticeActive || (isOffline && (globalNotice?.isNoticeActive ?? false))) && !isAdminBypassed) && (
          <EmergencyBroadcastLockOverlay
            notice={globalNotice || DEFAULT_NOTICE_DATA}
            isOffline={isOffline}
            isOfflineLockActive={isOffline && (globalNotice?.isNoticeActive ?? false)}
            onAdminBypass={() => setIsAdminBypassed(true)}
            onDismissNotice={
              globalNotice?.allowStudentDismiss ? () => setIsAdminBypassed(true) : undefined
            }
            onRetryConnection={checkNotice}
            onDeactivateNoticeFromAdmin={async (passcode) => {
              const res = await updateGlobalNotice({ isNoticeActive: false }, passcode);
              if (res.success && res.data) {
                setGlobalNotice(res.data);
                return true;
              }
              return false;
            }}
          />
        )}

        {/* System Admin Panel */}
        <SystemAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          subjects={allActiveSubjects}
          chapterProgress={userState.chapters}
          currentStream={userState.stream}
          profile={userState.profile}
          onStreamChange={handleStreamChange}
          onResetProgress={() => {
            handleResetProgress();
            setShowAdminPanel(false);
          }}
          globalNotice={globalNotice}
          onNoticeUpdatedLocally={(updated) => setGlobalNotice(updated)}
        />

        {/* Device & IP Ban Restriction Overlay Screen (Highest Priority) */}
        {banStatus.isBanned && (
          <BannedAccessLockOverlay
            banDetails={banStatus}
            onRecheck={async () => {
              await checkLiveBanStatus();
            }}
            onUnbanSuccess={() => {
              setBanStatus({ isBanned: false });
            }}
          />
        )}

        {/* User Registration & Login Auth Modal (Mandatory Gate when not authenticated) */}
        <UserAuthModal
          isOpen={!isAuthenticated || showAuthModal}
          isMandatory={!isAuthenticated}
          onClose={() => {
            if (isAuthenticated) {
              setShowAuthModal(false);
            }
          }}
          currentUser={currentUser}
          onUserAuthenticated={handleUserAuthenticated}
          currentStreak={userState.profile.streakDays || 15}
          totalStudyMinutes={calculateStudyMinutes(userState.chapters)}
        />

        {/* Interactive Onboarding & Syllabus Setup Wizard */}
        <OnboardingWizardModal
          key={`syllabus-wizard-${wizardKey}`}
          isOpen={showOnboardingWizard}
          onClose={() => {
            setShowOnboardingWizard(false);
          }}
          initialProfile={userState.profile}
          initialStream={userState.stream}
          initialReligion={userState.religion}
          initialFourthSubject={userState.fourthSubject || 'hmath'}
          currentUser={currentUser}
          onComplete={handleCompleteOnboarding}
        />

        {/* Syllabus Selection Gate Alert (Dark Neon Glassmorphism) */}
        {showSyllabusAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D111D]/85 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#151C2C] border border-[#5B50F6]/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl shadow-[#5B50F6]/20 relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5B50F6]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5B50F6]/20 border border-[#5B50F6]/40 flex items-center justify-center text-[#5B50F6] shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    সিলেবাস সেটআপ আবশ্যক
                  </span>
                  <h3 className="text-base font-bold text-white font-jakarta mt-1">
                    আগে আপনার অনবোর্ডিং প্রোফাইল ও সিলেবাস সিলেক্ট করুন
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed font-anek">
                সিলেবাস ও অধ্যায়ভিত্তিক প্রস্তুতি শুরু করতে অনুগ্রহ করে ৩-ধাপের অনবোর্ডিং উইজার্ড সম্পন্ন করে আপনার গ্রুপ, বোর্ড সিলেবাস এবং ৪র্থ বিষয় নিশ্চিত করুন।
              </p>
              <div className="flex items-center justify-end gap-3 font-anek">
                <button
                  onClick={() => setShowSyllabusAlert(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  পরে করব
                </button>
                <button
                  onClick={() => {
                    setShowSyllabusAlert(false);
                    setShowOnboardingWizard(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5B50F6] to-[#10B981] text-white text-xs font-bold shadow-lg shadow-[#5B50F6]/30 hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>অনবোর্ডিং ও সিলেবাস সেটআপ করুন</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-rose-500/30"
            >
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-base font-bold text-white font-jakarta">RESET PROGRESS?</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                আপনার দাগানো পড়ার অগ্রগতি ও সাজেশন সম্পন্ন হওয়ার তথ্য রিসেট হয়ে যাবে। আপনার প্রোফাইলের তথ্য ও নির্বাচিত ধর্ম অক্ষুণ্ণ থাকবে।
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-2xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleResetProgress}
                  className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors"
                >
                  রিসেট সম্পন্ন করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
