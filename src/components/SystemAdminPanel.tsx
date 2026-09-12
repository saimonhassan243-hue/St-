/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Sliders,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Atom,
  Briefcase,
  Landmark,
  FileCheck,
  TrendingUp,
  Download,
  Upload,
  Bookmark,
  Sparkles,
  Zap,
  Target,
  Clock,
  HardDrive,
  Search,
  School,
  User,
  GraduationCap,
  Eye,
  EyeOff,
  Copy,
  LogOut,
  ChevronDown,
  ChevronUp,
  Filter,
  Users,
  Check,
  X
} from 'lucide-react';
import {
  Subject,
  StreamKey,
  ReligionBn,
  FourthSubjectKey,
  UserProgressState,
  ChapterStatus
} from '../types';
import {
  STREAM_OPTIONS,
  FOURTH_SUBJECT_OPTIONS,
  COMPULSORY_SUBJECTS,
  STREAM_SUBJECTS,
  RELIGION_DATA,
} from '../data/curriculum';

// Fixed Master Passcode strictly set as required
const MASTER_ADMIN_PASSCODE = '1919131514';

export interface StudentMonitoringRecord {
  id: string;
  isCurrentUser?: boolean;
  name: string;
  school: string;
  sscBatch: string;
  classLevel: string;
  group: string;
  religion: ReligionBn;
  district: string;
  progressPercent: number;
  selectedChapters: {
    subjectName: string;
    chapters: {
      id: string;
      title: string;
      status: ChapterStatus;
      bookReading: boolean;
      cqPractice: boolean;
      mcqPractice: boolean;
    }[];
  }[];
}

interface SystemAdminPanelProps {
  userState: UserProgressState;
  onUpdateStream: (newStream: StreamKey) => void;
  onUpdateFourthSubject: (key: FourthSubjectKey) => void;
  onUpdateReligion: (bn: ReligionBn) => void;
  onResetProgress: () => void;
  onResetSuggestions: () => void;
  onFactoryReset: () => void;
  onImportState?: (importedState: UserProgressState) => void;
  activeSubjects: Subject[];
  isAuthenticated?: boolean;
  onAuthenticate?: (status: boolean) => void;
  onLockPanel?: () => void;
}

export const SystemAdminPanel: React.FC<SystemAdminPanelProps> = ({
  userState,
  onUpdateStream,
  onUpdateFourthSubject,
  onUpdateReligion,
  onResetProgress,
  onResetSuggestions,
  onFactoryReset,
  onImportState,
  activeSubjects,
  isAuthenticated: propIsAuthenticated,
  onAuthenticate: propOnAuthenticate,
  onLockPanel: propOnLockPanel,
}) => {
  // Authentication State
  const [localAuth, setLocalAuth] = useState<boolean>(false);
  const isAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : localAuth;

  // Passcode Input Modal State
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [shakeAnimation, setShakeAnimation] = useState(false);

  // Active Admin Sub-tab: 'monitoring' (User Data & School Monitoring) | 'controls' (Curriculum & Reset Controls)
  const [activeAdminView, setActiveAdminView] = useState<'monitoring' | 'controls'>('monitoring');

  // Search & Filters for School Monitoring
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState<'all' | 'science' | 'business' | 'humanities'>('all');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentMonitoringRecord | null>(null);

  // System Notifications Toast
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Confirmation modal states
  const [confirmModalType, setConfirmModalType] = useState<
    'none' | 'reset-progress' | 'reset-suggestions' | 'factory-reset'
  >('none');

  // JSON Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastNotice({ message, type });
    setTimeout(() => setToastNotice(null), 3800);
  };

  // 1. PASSCODE VALIDATION HANDLER
  const handlePasscodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (passcodeInput.trim() === MASTER_ADMIN_PASSCODE) {
      setAuthError(null);
      setLocalAuth(true);
      if (propOnAuthenticate) propOnAuthenticate(true);
      showToast('প্রবেশাধিকার অনুমোদিত! মাস্টার ড্যাশবোর্ডে স্বাগতম।', 'success');
      setPasscodeInput('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! প্রবেশাধিকার সংরক্ষিত।');
      showToast('ভুল পাসওয়ার্ড! প্রবেশাধিকার সংরক্ষিত।', 'error');
      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 600);
    }
  };

  // 2. LOGOUT / LOCK PANEL HANDLER
  const handleLockPanel = () => {
    setLocalAuth(false);
    if (propOnAuthenticate) propOnAuthenticate(false);
    if (propOnLockPanel) propOnLockPanel();
    setPasscodeInput('');
    setAuthError(null);
    setSelectedStudentDetail(null);
    showToast('মাস্টার অ্যাডমিন প্যানেল সফলভাবে লক করা হয়েছে।', 'info');
  };

  // 3. COMPILE CURRENT LOGGED-IN USER RECORD (LIVE DATA)
  const currentStudentMonitoringRecord: StudentMonitoringRecord = useMemo(() => {
    let totalChaptersCount = 0;
    let completedChaptersCount = 0;

    const selectedChaptersGrouped = activeSubjects.map((subject) => {
      const subjectChapters = subject.chapters.map((ch) => {
        totalChaptersCount++;
        const prog = userState.chapters[ch.id];
        const isCompleted = prog?.status === 'completed' || prog?.status === 'revised';
        if (isCompleted) completedChaptersCount++;

        return {
          id: ch.id,
          title: ch.name,
          status: prog?.status || 'not_started',
          bookReading: Boolean(prog?.bookReading),
          cqPractice: Boolean(prog?.cqPractice),
          mcqPractice: Boolean(prog?.mcqPractice),
        };
      });

      return {
        subjectName: subject.name,
        chapters: subjectChapters,
      };
    });

    const progressPercent = totalChaptersCount > 0 ? Math.round((completedChaptersCount / totalChaptersCount) * 100) : 0;

    return {
      id: 'current-active-user',
      isCurrentUser: true,
      name: userState.profile.name || 'মো: সাইমন হাসান',
      school: userState.profile.school || 'কুমিল্লা জিলা স্কুল',
      sscBatch: userState.profile.sscBatch || 'SSC 2028',
      classLevel: userState.profile.classLevel || 'নবম শ্রেণী (Class 9)',
      group: userState.profile.group || 'বিজ্ঞান (Science)',
      religion: userState.profile.religion || 'ইসলাম',
      district: userState.profile.district || 'কুমিল্লা',
      progressPercent,
      selectedChapters: selectedChaptersGrouped,
    };
  }, [userState, activeSubjects]);

  // 4. MOCK PEER SCHOOL RECORDS (To demonstrate full institution monitoring across Bangladesh)
  const peerSchoolRecords: StudentMonitoringRecord[] = useMemo(() => [
    {
      id: 'peer-user-1',
      name: 'তানভীর আহমেদ',
      school: 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ',
      sscBatch: 'SSC 2028',
      classLevel: 'নবম শ্রেণী (Class 9)',
      group: 'বিজ্ঞান (Science)',
      religion: 'ইসলাম',
      district: 'ঢাকা',
      progressPercent: 78,
      selectedChapters: [
        {
          subjectName: 'পদার্থবিজ্ঞান',
          chapters: [
            { id: 'phy-1', title: 'ভৌত রাশি ও পরিমাপ', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'phy-2', title: 'গতি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'phy-3', title: 'বল', status: 'in_progress', bookReading: true, cqPractice: true, mcqPractice: false },
          ]
        },
        {
          subjectName: 'রসায়ন',
          chapters: [
            { id: 'chem-1', title: 'রসায়নের ধারণা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'chem-2', title: 'পদার্থের অবস্থা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: false },
            { id: 'chem-3', title: 'পদার্থের গঠন', status: 'in_progress', bookReading: true, cqPractice: false, mcqPractice: false },
          ]
        },
        {
          subjectName: 'উচ্চতর গণিত',
          chapters: [
            { id: 'hmath-1', title: 'সেট ও ফাংশন', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'hmath-2', title: 'বীজগাণিতিক রাশি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
          ]
        }
      ]
    },
    {
      id: 'peer-user-2',
      name: 'ফারহানা ইয়াসমিন',
      school: 'ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ',
      sscBatch: 'SSC 2028',
      classLevel: 'দশম শ্রেণী (Class 10)',
      group: 'বিজ্ঞান (Science)',
      religion: 'ইসলাম',
      district: 'ঢাকা',
      progressPercent: 86,
      selectedChapters: [
        {
          subjectName: 'জীববিজ্ঞান',
          chapters: [
            { id: 'bio-1', title: 'জীবন পাঠ', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'bio-2', title: 'জীবকোষ ও টিস্যু', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'bio-4', title: 'জীবনীশক্তি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
          ]
        },
        {
          subjectName: 'সাধারণ গণিত',
          chapters: [
            { id: 'gmath-1', title: 'বাস্তব সংখ্যা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'gmath-2', title: 'সেট ও ফাংশন', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'gmath-3', title: 'বীজগাণিতিক রাশি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
          ]
        }
      ]
    },
    {
      id: 'peer-user-3',
      name: 'সৌম্যদীপ রায়',
      school: 'চট্টগ্রাম কলেজিয়েট স্কুল',
      sscBatch: 'SSC 2028',
      classLevel: 'নবম শ্রেণী (Class 9)',
      group: 'ব্যবসায় শিক্ষা (Business Studies)',
      religion: 'হিন্দু',
      district: 'চট্টগ্রাম',
      progressPercent: 62,
      selectedChapters: [
        {
          subjectName: 'হিসাববিজ্ঞান',
          chapters: [
            { id: 'acc-1', title: 'হিসাববিজ্ঞানের পরিচিতি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'acc-2', title: 'লেনদেন', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'acc-3', title: 'দুতরফা দাখিলা পদ্ধতি', status: 'in_progress', bookReading: true, cqPractice: false, mcqPractice: false },
          ]
        },
        {
          subjectName: 'ফিন্যান্স ও ব্যাংকিং',
          chapters: [
            { id: 'fin-1', title: 'অর্থায়ন ও ব্যবসায় অর্থায়ন', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'fin-2', title: 'অর্থের সময়মূল্য', status: 'in_progress', bookReading: true, cqPractice: false, mcqPractice: false },
          ]
        }
      ]
    },
    {
      id: 'peer-user-4',
      name: 'আরিফুল ইসলাম',
      school: 'রাজশাহী কলেজিয়েট স্কুল',
      sscBatch: 'SSC 2028',
      classLevel: 'দশম শ্রেণী (Class 10)',
      group: 'মানবিক (Humanities)',
      religion: 'ইসলাম',
      district: 'রাজশাহী',
      progressPercent: 68,
      selectedChapters: [
        {
          subjectName: 'ইতিহাস ও বিশ্বসভ্যতা',
          chapters: [
            { id: 'hist-1', title: 'ইতিহাস পরিচিতি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'hist-2', title: 'বিশ্বসভ্যতা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'hist-11', title: 'ভাষা আন্দোলন ও পরবর্তী ঘটনাপ্রবাহ', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
          ]
        },
        {
          subjectName: 'পৌরনীতি ও নাগরিকতা',
          chapters: [
            { id: 'civ-1', title: 'পৌরনীতি ও নাগরিকতা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'civ-2', title: 'নাগরিক ও নাগরিকতা', status: 'in_progress', bookReading: true, cqPractice: false, mcqPractice: false },
          ]
        }
      ]
    },
    {
      id: 'peer-user-5',
      name: 'অনন্যা চাকমা',
      school: 'আইডিয়াল স্কুল অ্যান্ড কলেজ, মতিঝিল',
      sscBatch: 'SSC 2028',
      classLevel: 'নবম শ্রেণী (Class 9)',
      group: 'বিজ্ঞান (Science)',
      religion: 'বৌদ্ধ',
      district: 'ঢাকা',
      progressPercent: 74,
      selectedChapters: [
        {
          subjectName: 'পদার্থবিজ্ঞান',
          chapters: [
            { id: 'phy-1', title: 'ভৌত রাশি ও পরিমাপ', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'phy-2', title: 'গতি', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
          ]
        },
        {
          subjectName: 'রসায়ন',
          chapters: [
            { id: 'chem-1', title: 'রসায়নের ধারণা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: true },
            { id: 'chem-2', title: 'পদার্থের অবস্থা', status: 'completed', bookReading: true, cqPractice: true, mcqPractice: false },
          ]
        }
      ]
    }
  ], []);

  // ALL MONITORED STUDENTS (Live User first, followed by peers)
  const allMonitoredStudents = useMemo(() => {
    return [currentStudentMonitoringRecord, ...peerSchoolRecords];
  }, [currentStudentMonitoringRecord, peerSchoolRecords]);

  // FILTERED MONITORED STUDENTS
  const filteredStudents = useMemo(() => {
    return allMonitoredStudents.filter((student) => {
      // Search query filter (matches student name or school name)
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.school.toLowerCase().includes(q) ||
        student.district.toLowerCase().includes(q);

      // Group stream filter
      let matchesStream = true;
      if (streamFilter === 'science') matchesStream = student.group.includes('বিজ্ঞান') || student.group.includes('Science');
      else if (streamFilter === 'business') matchesStream = student.group.includes('ব্যবসায়') || student.group.includes('Business');
      else if (streamFilter === 'humanities') matchesStream = student.group.includes('মানবিক') || student.group.includes('Humanities');

      return matchesQuery && matchesStream;
    });
  }, [allMonitoredStudents, searchQuery, streamFilter]);

  // 5. EXPORT USER DATA SUMMARY (Download JSON & Copy Text)
  const handleExportAllUserData = () => {
    try {
      const summaryPayload = {
        exportedAt: new Date().toISOString(),
        systemName: 'SSC Master Platform - Master Admin Monitoring Report',
        activeStudentLiveRecord: currentStudentMonitoringRecord,
        allMonitoredStudentsSummary: allMonitoredStudents.map((s) => ({
          name: s.name,
          school: s.school,
          batch: s.sscBatch,
          class: s.classLevel,
          group: s.group,
          religion: s.religion,
          overallProgressPercent: `${s.progressPercent}%`,
          totalSelectedChaptersCount: s.selectedChapters.reduce((acc, sub) => acc + sub.chapters.length, 0),
          selectedChaptersBreakdown: s.selectedChapters.map((sub) => ({
            subject: sub.subjectName,
            chapters: sub.chapters.map((ch) => ({
              title: ch.title,
              conceptClear: ch.bookReading,
              cqSolved: ch.cqPractice,
              mcqSolved: ch.mcqPractice,
            })),
          })),
        })),
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(summaryPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ssc_master_student_monitoring_report_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('শিক্ষার্থীদের ডেটা সামারি সফলভাবে JSON আকারে ডাউনলোড হয়েছে!', 'success');
    } catch (err) {
      console.error(err);
      showToast('এক্সপোর্ট করতে সমস্যা হয়েছে।', 'error');
    }
  };

  const handleCopyUserSummary = () => {
    try {
      let textSummary = `📋 SSC MASTER PLATFORM - STUDENT MONITORING SUMMARY\nGenerated: ${new Date().toLocaleString('bn-BD')}\n\n`;
      allMonitoredStudents.forEach((st, idx) => {
        textSummary += `[${idx + 1}] ${st.name} ${st.isCurrentUser ? '(বর্তমান সক্রিয় শিক্ষার্থী)' : ''}\n`;
        textSummary += `🏫 শিক্ষাপ্রতিষ্ঠান: ${st.school}\n`;
        textSummary += `🎓 ব্যাচ: ${st.sscBatch} | শ্রেণী: ${st.classLevel} | বিভাগ: ${st.group} | ধর্ম: ${st.religion}\n`;
        textSummary += `📊 সামগ্রিক সিলেবাস প্রস্তুতি: ${st.progressPercent}%\n`;
        textSummary += `📚 নির্বাচিত অধ্যায় ও টাস্ক অগ্রগতি:\n`;
        st.selectedChapters.forEach((sub) => {
          textSummary += `   • ${sub.subjectName}:\n`;
          sub.chapters.forEach((ch) => {
            textSummary += `     - ${ch.title} [বই রিডিং: ${ch.bookReading ? '✓' : '✗'}, CQ: ${ch.cqPractice ? '✓' : '✗'}, MCQ: ${ch.mcqPractice ? '✓' : '✗'}]\n`;
          });
        });
        textSummary += `------------------------------------------------------------\n`;
      });

      navigator.clipboard.writeText(textSummary);
      showToast('শিক্ষার্থীদের সারসংক্ষেপ সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    } catch {
      showToast('ক্লিপবোর্ডে কপি করা সম্ভব হয়নি।', 'error');
    }
  };

  // -------------------------------------------------------------
  // RENDER 1: PASSWORD MODAL & LOCK GATEWAY IF NOT AUTHENTICATED
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div id="admin-security-gateway" className="max-w-xl mx-auto py-8 sm:py-14 px-4 font-hind">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/80 border border-purple-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-center"
        >
          {/* Ambient light glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon Emblem */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-xl shadow-purple-600/30 mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-purple-400">
                <KeyRound className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-jakarta">
                SECURITY ACCESS CONTROL
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-anek">
                PASSCODE PROTECTED
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white font-jakarta tracking-tight">
              মাস্টার অ্যাডমিন লগইন
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm leading-relaxed">
              সিস্টেম মনিটরিং, সকল শিক্ষার্থীর ডেটা ট্র্যাকিং এবং কারিকুলাম কন্ট্রোল অ্যাক্সেস করতে অ্যাডমিন পাসকোড লিখুন।
            </p>

            {/* Passcode Input Form */}
            <form onSubmit={handlePasscodeSubmit} className="w-full mt-6 space-y-4">
              <div
                className={`relative transition-transform ${
                  shakeAnimation ? 'animate-bounce text-rose-500 ring-2 ring-rose-500' : ''
                }`}
              >
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="অ্যাডমিন পাসকোড দিন..."
                    autoFocus
                    className="w-full px-4 py-3.5 pl-11 pr-12 rounded-2xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-sm font-mono tracking-widest focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner text-center"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4 text-purple-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Alert Display */}
              <AnimatePresence>
                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{authError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all font-jakarta"
              >
                <Unlock className="w-4 h-4 text-amber-300" />
                <span>মাস্টার প্যানেলে প্রবেশ করুন (Unlock Admin)</span>
              </motion.button>
            </form>

            <div className="mt-5 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-anek">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span>নিরাপত্তা নীতি: অননুমোদিত প্রবেশাধিকার সম্পূর্ণরূপে সংরক্ষিত।</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: MASTER ADMIN DASHBOARD (ONCE AUTHENTICATED)
  // -------------------------------------------------------------
  return (
    <div id="master-admin-dashboard" className="space-y-6 font-hind">
      
      {/* 1. TOP MASTER ADMIN BAR WITH LOCK PANEL / LOGOUT */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/90 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-jakarta flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MASTER ADMIN ACCESS GRANTED
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-anek">
                SSC 2028 MONITORING ENGINE
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-jakarta">
              মাস্টার অ্যাডমিন ও শিক্ষার্থী ট্র্যাকিং ড্যাশবোর্ড
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              সারাদেশের শিক্ষাপ্রতিষ্ঠান অনুযায়ী শিক্ষার্থীদের সিলেবাস সমাপ্তি, নির্বাচিত অধ্যায় তালিকা এবং Concept Clear (📘), CQ (✍️), MCQ (🔘) টাস্কের রিয়েল-টাইম পর্যবেক্ষণ।
            </p>
          </div>

          {/* Admin Header Action Controls (Lock Panel / Logout & Export) */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              id="admin-btn-export-data"
              onClick={handleExportAllUserData}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold font-jakarta flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>এক্সপোর্ট ডেটা (JSON)</span>
            </button>

            <button
              type="button"
              id="admin-btn-copy-summary"
              onClick={handleCopyUserSummary}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold font-jakarta flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-purple-400" />
              <span>কপি সামারি</span>
            </button>

            {/* Lock Panel (লগ আউট) Button */}
            <button
              type="button"
              id="admin-btn-lock-panel"
              onClick={handleLockPanel}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold font-jakarta flex items-center gap-2 shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>লগ আউট (Lock Panel)</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        <AnimatePresence>
          {toastNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                toastNotice.type === 'success'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                  : toastNotice.type === 'error'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-200'
                  : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastNotice.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. ADMIN NAVIGATION TABS SWITCHER */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveAdminView('monitoring')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-jakarta flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminView === 'monitoring'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-300" />
          <span>শিক্ষার্থী ও বিদ্যালয় ট্র্যাকিং (STUDENT & SCHOOL MONITORING)</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px]">
            {filteredStudents.length} জন
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminView('controls')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-jakarta flex items-center gap-2 transition-all cursor-pointer ${
            activeAdminView === 'controls'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-300" />
          <span>কারিকুলাম ও স্টেট কন্ট্রোল (SYSTEM STATE CONTROLS)</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* VIEW 1: USER DATA & SCHOOL MONITORING DASHBOARD               */}
      {/* ============================================================= */}
      {activeAdminView === 'monitoring' && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTER CONTROLS BAR */}
          <div className="bg-slate-900/80 rounded-3xl border border-white/10 p-5 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিক্ষার্থীর নাম বা বিদ্যালয়ের নাম খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Stream Filter Badges */}
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-jakarta">
                <Filter className="w-3.5 h-3.5 text-purple-400" /> বিভাগ ফিল্টার:
              </span>
              {[
                { id: 'all', label: 'সকল' },
                { id: 'science', label: 'বিজ্ঞান' },
                { id: 'business', label: 'ব্যবসায় শিক্ষা' },
                { id: 'humanities', label: 'মানবিক' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStreamFilter(filter.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    streamFilter === filter.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-950/60 border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

          </div>

          {/* ACTIVE STUDENT PROMINENT MONITORING CARD */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-300 font-jakarta uppercase tracking-wider">
                  বর্তমান সক্রিয় শিক্ষার্থী (LIVE USER ACTIVE MONITORING)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                সিলেবাস সমাপ্তি: {currentStudentMonitoringRecord.progressPercent}%
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  {currentStudentMonitoringRecord.name}
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                  <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold text-cyan-200">{currentStudentMonitoringRecord.school}</span>
                </p>
                <div className="text-[11px] text-slate-400 mt-1 font-anek">
                  {currentStudentMonitoringRecord.district} জেলা • ধর্ম: {currentStudentMonitoringRecord.religion}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">ব্যাচ ও শ্রেণী:</span>
                <span className="text-xs font-bold text-white px-2.5 py-1 rounded-xl bg-slate-800 border border-white/5">
                  {currentStudentMonitoringRecord.sscBatch} • {currentStudentMonitoringRecord.classLevel}
                </span>
                <div className="text-xs text-purple-300 font-semibold mt-1.5">
                  {currentStudentMonitoringRecord.group}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">সিলেবাস কভারেজ বার:</span>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${currentStudentMonitoringRecord.progressPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>অগ্রগতি</span>
                  <span className="font-bold text-emerald-400">{currentStudentMonitoringRecord.progressPercent}%</span>
                </div>
              </div>

              <div className="flex justify-start md:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(currentStudentMonitoringRecord)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-jakarta flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>অধ্যায় ও টাস্ক বিস্তারিত দেখুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* ALL MONITORED STUDENTS TABLE & CARDS */}
          <div className="bg-slate-900/80 rounded-3xl border border-white/10 p-5 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <School className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-jakarta">
                    সারাদেশের বিদ্যালয় ও শিক্ষার্থী পর্যবেক্ষণ তালিকা ({filteredStudents.length} জন)
                  </h3>
                  <p className="text-xs text-slate-400 font-hind">
                    শিক্ষাপ্রতিষ্ঠানভিত্তিক শিক্ষার্থীদের প্রোফাইল, সামগ্রিক অগ্রগতি এবং অধ্যায়ভিত্তিক টাস্ক স্ট্যাটাস
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-400">
                প্রদর্শিত: {filteredStudents.length} / {allMonitoredStudents.length} রেকর্ড
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-jakarta border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">শিক্ষার্থীর পরিচয়</th>
                    <th className="py-3 px-4">শিক্ষাপ্রতিষ্ঠান (School Name)</th>
                    <th className="py-3 px-3">ব্যাচ ও বিভাগ</th>
                    <th className="py-3 px-3 text-center">ধর্ম</th>
                    <th className="py-3 px-4 text-center">সিলেবাস অগ্রগতি %</th>
                    <th className="py-3 px-4 text-center">টাস্ক সারাংশ</th>
                    <th className="py-3 px-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-hind">
                  {filteredStudents.map((st) => {
                    // Calculate total Concept, CQ, MCQ across student's chapters
                    let conceptCount = 0;
                    let cqCount = 0;
                    let mcqCount = 0;
                    let totalChaps = 0;

                    st.selectedChapters.forEach((sub) => {
                      sub.chapters.forEach((c) => {
                        totalChaps++;
                        if (c.bookReading) conceptCount++;
                        if (c.cqPractice) cqCount++;
                        if (c.mcqPractice) mcqCount++;
                      });
                    });

                    return (
                      <tr key={st.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Student Name */}
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                              <User className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {st.isCurrentUser && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                    LIVE
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-normal font-anek">
                                {st.district}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* School Name */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-cyan-200 flex items-center gap-1.5">
                            <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            {st.school}
                          </span>
                        </td>

                        {/* Batch & Group */}
                        <td className="py-3.5 px-3">
                          <div className="text-white font-semibold font-anek text-xs">{st.sscBatch}</div>
                          <div className="text-[11px] text-purple-300">{st.group}</div>
                        </td>

                        {/* Religion */}
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-anek">
                            {st.religion}
                          </span>
                        </td>

                        {/* Progress % Bar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full"
                                style={{ width: `${st.progressPercent}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-200 min-w-[34px]">
                              {st.progressPercent}%
                            </span>
                          </div>
                        </td>

                        {/* Task Summary (Concept, CQ, MCQ) */}
                        <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-purple-300" title="Concept Clear / Book Reading">
                              📘 {conceptCount}/{totalChaps}
                            </span>
                            <span className="text-cyan-300" title="Creative Question Solved">
                              ✍️ {cqCount}/{totalChaps}
                            </span>
                            <span className="text-amber-300" title="Multiple Choice Solved">
                              🔘 {mcqCount}/{totalChaps}
                            </span>
                          </div>
                        </td>

                        {/* Action Button */}
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentDetail(st)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>ডিটেইলস</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 2: CURRICULUM STATE CONTROLS & RESET ACTIONS             */}
      {/* ============================================================= */}
      {activeAdminView === 'controls' && (
        <div className="space-y-6">
          
          {/* STREAM SWITCHER */}
          <section id="admin-stream-switcher" className="bg-slate-900/80 rounded-3xl border border-white/10 p-5 sm:p-7 backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-jakarta">
                    ডায়নামিক বিভাগ ও বিষয় কনফিগারেশন (SWITCH STUDENT STREAM)
                  </h3>
                  <p className="text-xs text-slate-400 font-hind">
                    এখানে পরিবর্তন করলে রিয়েল-টাইমে মূল অ্যাপের সিলেবাস, রুটিন এবং প্রোগ্রেস ট্র্যাকার আপডেট হবে
                  </p>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-anek font-semibold">
                বর্তমান বিভাগ: {userState.stream === 'science' ? 'বিজ্ঞান' : userState.stream === 'business' ? 'ব্যবসায় শিক্ষা' : 'মানবিক'}
              </span>
            </div>

            {/* Stream Buttons Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-jakarta">
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                বিভাগ নির্বাচন (STREAM):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STREAM_OPTIONS.map((opt) => {
                  const isSelected = userState.stream === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`admin-btn-stream-${opt.id}`}
                      onClick={() => {
                        onUpdateStream(opt.id);
                        showToast(`বিভাগ সফলভাবে '${opt.label}' এ পরিবর্তিত হয়েছে!`, 'success');
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-950/90 to-purple-950/80 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 ring-1 ring-indigo-400/50'
                          : 'bg-slate-950/60 border-white/5 hover:border-white/15 hover:bg-slate-950 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white flex items-center gap-1.5">
                          {opt.id === 'science' && <Atom className="w-4 h-4 text-cyan-400" />}
                          {opt.id === 'business' && <Briefcase className="w-4 h-4 text-emerald-400" />}
                          {opt.id === 'humanities' && <Landmark className="w-4 h-4 text-rose-400" />}
                          {opt.label}
                        </span>
                        {isSelected && (
                          <span className="p-1 rounded-full bg-indigo-500 text-white">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-hind line-clamp-2">
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4th Subject Switcher */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-jakarta">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ঐচ্ছিক ৪র্থ বিষয় নির্বাচন (OPTIONAL 4TH SUBJECT):
                </label>
                <span className="text-[11px] text-slate-400">
                  নির্বাচিত: {FOURTH_SUBJECT_OPTIONS.find((f) => f.id === userState.fourthSubject)?.label || 'উচ্চতর গণিত'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FOURTH_SUBJECT_OPTIONS.map((f) => {
                  const isSelected = userState.fourthSubject === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      id={`admin-btn-4th-${f.id}`}
                      onClick={() => {
                        onUpdateFourthSubject(f.id);
                        showToast(`৪র্থ বিষয় '${f.label}' এ আপডেট হয়েছে!`, 'success');
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-bold shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                      }`}
                    >
                      <div className="text-lg mb-1">{f.icon}</div>
                      <div className="text-xs font-bold text-white">{f.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{f.chaptersCount}টি অধ্যায়</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Religion Switcher */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5 font-jakarta">
                <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                ধর্ম ও নৈতিক শিক্ষা পাঠ্যবই ফিল্টার (RELIGION TEXTBOOK):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: 'ইসলাম' as ReligionBn, label: 'ইসলাম ও নৈতিক শিক্ষা' },
                  { key: 'হিন্দু' as ReligionBn, label: 'হিন্দুধর্ম ও নৈতিক শিক্ষা' },
                  { key: 'বৌদ্ধ' as ReligionBn, label: 'বৌদ্ধধর্ম ও নৈতিক শিক্ষা' },
                  { key: 'খ্রিস্টান' as ReligionBn, label: 'খ্রিস্টধর্ম ও নৈতিক শিক্ষা' },
                ].map((rel) => {
                  const isSelected = (userState.profile?.religion || 'ইসলাম') === rel.key;
                  return (
                    <button
                      key={rel.key}
                      type="button"
                      id={`admin-btn-rel-${rel.key}`}
                      onClick={() => {
                        onUpdateReligion(rel.key);
                        showToast(`ধর্ম পাঠ্যবই '${rel.label}' এ সেট করা হয়েছে!`, 'success');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500/60 text-purple-200 shadow-md ring-1 ring-purple-400/40'
                          : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                      }`}
                    >
                      {rel.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </section>

          {/* SYSTEM RESET & FACTORY RESTORE CONTROLS */}
          <section id="admin-system-actions" className="bg-slate-900/80 rounded-3xl border border-rose-500/20 p-5 sm:p-7 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-jakarta">
                    SYSTEM RESET & DATA MANAGEMENT (স্টেট রিসেট ও ডাটাবেস ব্যবস্থাপনা)
                  </h3>
                  <p className="text-xs text-slate-400 font-hind">
                    প্রোগ্রেস রিসেট করা, ফুল ফ্যাক্টরি রিস্টোর এবং স্টেট ব্যাকআপ সংরক্ষণের নিয়ন্ত্রণ
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Action 1: Reset Chapter Progress */}
              <button
                type="button"
                id="btn-admin-reset-progress"
                onClick={() => setConfirmModalType('reset-progress')}
                className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-1 font-bold text-xs font-jakarta">
                  <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
                  <span>পড়ার প্রোগ্রেস রিসেট</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  সকল দাগানো অধ্যায়, Concept, CQ ও MCQ অনুশীলনের মার্ক মুছে নতুন করে শুরু করুন।
                </p>
              </button>

              {/* Action 2: Reset Suggestions */}
              <button
                type="button"
                id="btn-admin-reset-suggestions"
                onClick={() => setConfirmModalType('reset-suggestions')}
                className="p-4 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-purple-400 mb-1 font-bold text-xs font-jakarta">
                  <Sparkles className="w-4 h-4" />
                  <span>সাজেশন টিকমার্ক রিসেট</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  দাগানো সকল প্রায়োরিটি সাজেশন টপিকের সম্পন্নতা তালিকা শূন্য করুন।
                </p>
              </button>

              {/* Action 3: Full Factory Restore */}
              <button
                type="button"
                id="btn-admin-factory-reset"
                onClick={() => setConfirmModalType('factory-reset')}
                className="p-4 rounded-2xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 hover:border-rose-500 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-rose-400 mb-1 font-bold text-xs font-jakarta">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ফুল ফ্যাক্টরি রিস্টোর</span>
                </div>
                <p className="text-[11px] text-rose-200/80 leading-snug">
                  প্রোফাইল, রুটিন, অধ্যায় ও কাউন্টডাউন সহ সম্পূর্ণ সিস্টেম ডিফল্টে ফেরান।
                </p>
              </button>
            </div>
          </section>

        </div>
      )}

      {/* ============================================================= */}
      {/* STUDENT DETAIL MODAL (INSPECT CHAPTERS & TASK BREAKDOWN)      */}
      {/* ============================================================= */}
      <AnimatePresence>
        {selectedStudentDetail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl max-h-[88vh] flex flex-col space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-jakarta flex items-center gap-2">
                      <span>{selectedStudentDetail.name}</span>
                      {selectedStudentDetail.isCurrentUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-anek">
                          সক্রিয় শিক্ষার্থী
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-cyan-300 font-semibold font-anek flex items-center gap-1">
                      <School className="w-3.5 h-3.5" />
                      {selectedStudentDetail.school} ({selectedStudentDetail.district})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Student Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-white/5 text-xs text-slate-300 font-anek">
                <div>
                  <span className="text-[10px] text-slate-500 block">ব্যাচ:</span>
                  <span className="font-bold text-white">{selectedStudentDetail.sscBatch}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">বিভাগ:</span>
                  <span className="font-bold text-purple-300">{selectedStudentDetail.group}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">ধর্ম:</span>
                  <span className="font-bold text-amber-300">{selectedStudentDetail.religion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">মোট অগ্রগতি:</span>
                  <span className="font-bold text-emerald-400">{selectedStudentDetail.progressPercent}%</span>
                </div>
              </div>

              {/* Selected Chapters Details List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="text-xs font-bold text-white font-jakarta flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    নির্বাচিত অধ্যায় ও টাস্ক অগ্রগতি (SELECTED CHAPTERS & TASKS):
                  </span>
                  <span className="text-[10px] text-slate-400">
                    📘 Concept Clear • ✍️ CQ Solve • 🔘 MCQ Solve
                  </span>
                </div>

                {selectedStudentDetail.selectedChapters.map((group, gIdx) => (
                  <div key={gIdx} className="bg-slate-950/70 border border-white/5 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{group.subjectName}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 font-anek">
                        {group.chapters.length}টি অধ্যায়
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {group.chapters.map((ch) => (
                        <div
                          key={ch.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300"
                        >
                          <span className="truncate pr-2 font-medium">{ch.title}</span>

                          {/* Task Breakdown Badges */}
                          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                            {/* Concept Clear (📘) */}
                            <span
                              className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                ch.bookReading
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                              title="Concept Clear / Book Reading"
                            >
                              📘 {ch.bookReading ? '✓' : '—'}
                            </span>

                            {/* CQ Practice (✍️) */}
                            <span
                              className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                ch.cqPractice
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                              title="Creative Question Practice"
                            >
                              ✍️ {ch.cqPractice ? '✓' : '—'}
                            </span>

                            {/* MCQ Practice (🔘) */}
                            <span
                              className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                ch.mcqPractice
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                              title="Multiple Choice Practice"
                            >
                              🔘 {ch.mcqPractice ? '✓' : '—'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedStudentDetail(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* CONFIRMATION RESET MODALS                                     */}
      {/* ============================================================= */}
      {confirmModalType !== 'none' && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/15 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-jakarta">
                  {confirmModalType === 'reset-progress' && 'পড়ার প্রোগ্রেস রিসেট নিশ্চিতকরণ'}
                  {confirmModalType === 'reset-suggestions' && 'সাজেশন মার্ক রিসেট নিশ্চিতকরণ'}
                  {confirmModalType === 'factory-reset' && 'ফুল ফ্যাক্টরি রিস্টোর নিশ্চিতকরণ'}
                </h4>
                <p className="text-xs text-slate-400">এই অ্যাকশনটি সাবধানে সম্পন্ন করুন</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-hind">
              {confirmModalType === 'reset-progress' &&
                'আপনার সকল বিষয়ের দাগানো পড়ার অগ্রগতি, Concept, CQ ও MCQ টিকমার্ক মুছে যাবে। প্রোফাইলের নাম, ধর্ম ও বিভাগ অক্ষুণ্ণ থাকবে। আপনি কি নিশ্চিত?'}
              {confirmModalType === 'reset-suggestions' &&
                'আপনার দাগানো সকল বিষয়ের সাজেশন সম্পন্নতার তালিকা শূন্য হয়ে যাবে। আপনি কি নিশ্চিত?'}
              {confirmModalType === 'factory-reset' &&
                'সতর্কতা: এটি সম্পূর্ণ ডেটাবেস ডিফল্ট অবস্থায় ফিরিয়ে আনবে। আপনার নাম, বিদ্যালয়, রুটিন এবং সকল প্রস্তুতি ডেটা রিসেট হবে।'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalType('none')}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                বাতিল করুন
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirmModalType === 'reset-progress') {
                    onResetProgress();
                    showToast('অধ্যায়ের পড়ার অগ্রগতি সফলভাবে রিসেট হয়েছে।', 'success');
                  } else if (confirmModalType === 'reset-suggestions') {
                    onResetSuggestions();
                    showToast('সাজেশনের সব টিকমার্ক সফলভাবে মুছে ফেলা হয়েছে।', 'success');
                  } else if (confirmModalType === 'factory-reset') {
                    onFactoryReset();
                    showToast('সিস্টেম ফ্যাক্টরি রিস্টোর সম্পন্ন হয়েছে।', 'success');
                  }
                  setConfirmModalType('none');
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                হ্যাঁ, সম্পন্ন করুন
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
