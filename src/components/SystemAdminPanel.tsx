import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ShieldAlert, Radio, Send, RefreshCw, 
  RotateCcw, Layers, CheckCircle2, AlertTriangle, KeyRound, 
  X, Check, Lock, Unlock, Server, BookOpen, Activity, 
  Database, UserCheck, AlertOctagon, Terminal, Users,
  Search, Filter, Calendar, Clock, Flame, Mail, Award,
  Sparkles, ExternalLink, Globe, Ban, Smartphone, Laptop, Target
} from 'lucide-react';
import { 
  Subject, StreamKey, UserProfile, ChapterProgressData, 
  GlobalNoticeData, ChapterStatus, FirebaseUserData,
  BannedDeviceRecord, BannedIpRecord
} from '../types';
import { 
  MASTER_ADMIN_PASSCODE, 
  updateGlobalNotice, 
  fetchGlobalNotice, 
  RTDB_BASE_URL, 
  NOTICE_ENDPOINT,
  STORAGE_KEY_ADMIN_AUTH
} from '../services/firebaseNoticeService';
import { 
  fetchAllUsersFromFirebase, 
  formatStudyHoursBn, 
  RTDB_USERS_ENDPOINT 
} from '../services/firebaseUserService';
import { 
  banDeviceAndIp,
  unbanDevice,
  unbanIp,
  unbanUserAll,
  fetchBannedLists,
  RTDB_BANNED_DEVICES_ENDPOINT,
  RTDB_BANNED_IPS_ENDPOINT
} from '../services/deviceSecurityService';
import { toBengaliNumber, calculateTotalProgress } from '../utils/progressCalculator';

interface SystemAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  chapterProgress: Record<string, ChapterProgressData>;
  currentStream: StreamKey;
  profile: UserProfile;
  onStreamChange: (stream: StreamKey) => void;
  onResetProgress: () => void;
  globalNotice: GlobalNoticeData | null;
  onNoticeUpdatedLocally: (notice: GlobalNoticeData) => void;
}

type AdminSubTab = 'users' | 'banned' | 'broadcast' | 'metrics';

export const SystemAdminPanel: React.FC<SystemAdminPanelProps> = ({
  isOpen,
  onClose,
  subjects,
  chapterProgress,
  currentStream,
  profile,
  onStreamChange,
  onResetProgress,
  globalNotice,
  onNoticeUpdatedLocally,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'authenticated';
    } catch {
      return false;
    }
  });
  const [inputPasscode, setInputPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Sub-Tab in Admin Panel (Default to 'users' as requested)
  const [activeTab, setActiveTab] = useState<AdminSubTab>('users');

  // User Analytics State
  const [usersList, setUsersList] = useState<FirebaseUserData[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isUsersLive, setIsUsersLive] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'Google' | 'Email'>('all');
  const [filterGroup, setFilterGroup] = useState<'all' | 'science' | 'business' | 'humanities'>('all');

  // Banned Devices & IPs State
  const [bannedDevices, setBannedDevices] = useState<BannedDeviceRecord[]>([]);
  const [bannedIps, setBannedIps] = useState<BannedIpRecord[]>([]);
  const [isLoadingBanned, setIsLoadingBanned] = useState<boolean>(false);
  const [banActionLoading, setBanActionLoading] = useState<string | null>(null);
  const [banModalTarget, setBanModalTarget] = useState<FirebaseUserData | null>(null);
  const [banReasonInput, setBanReasonInput] = useState<string>('অ্যাকাউন্টের নিরাপত্তা নিয়ম লঙ্ঘন বা সন্দেহজনক কার্যকলাপ');
  const [statusFeedback, setStatusFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Manual ban inputs in Banned List tab
  const [manualDevInput, setManualDevInput] = useState('');
  const [manualIpInput, setManualIpInput] = useState('');
  const [manualReasonInput, setManualReasonInput] = useState('ম্যানুয়াল এডমিন ব্লকলিস্ট');

  // Notice form state
  const [isNoticeActive, setIsNoticeActive] = useState<boolean>(globalNotice?.isNoticeActive ?? false);
  const [noticeTitle, setNoticeTitle] = useState<string>(globalNotice?.title || 'জরুরি রক্ষণাবেক্ষণ ও সিস্টেম নোটিশ');
  const [noticeMessage, setNoticeMessage] = useState<string>(
    globalNotice?.message || 'সম্মানিত শিক্ষার্থীদের জানানো যাচ্ছে যে প্ল্যাটফর্মের জরুরি কারিগরি আপগ্রেড চলছে। শীঘ্রই সেবা স্বাভাবিক হবে।'
  );
  const [severity, setSeverity] = useState<'urgent' | 'warning' | 'info'>(globalNotice?.severity || 'urgent');

  // Sync state for notice
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Keep form in sync when globalNotice changes
  useEffect(() => {
    if (globalNotice) {
      setIsNoticeActive(globalNotice.isNoticeActive);
      if (globalNotice.title) setNoticeTitle(globalNotice.title);
      if (globalNotice.message) setNoticeMessage(globalNotice.message);
      if (globalNotice.severity) setSeverity(globalNotice.severity);
    }
  }, [globalNotice]);

  // Load banned lists from Firebase RTDB
  const loadBannedLists = async () => {
    setIsLoadingBanned(true);
    try {
      const res = await fetchBannedLists();
      setBannedDevices(res.devices);
      setBannedIps(res.ips);
    } catch {
      // ignore
    } finally {
      setIsLoadingBanned(false);
    }
  };

  // Load registered users from Firebase RTDB
  const loadUsersFromFirebase = async () => {
    setIsLoadingUsers(true);
    setUsersError('');
    try {
      const res = await fetchAllUsersFromFirebase();
      setUsersList(res.users);
      setIsUsersLive(res.isLive);
      if (res.error) {
        setUsersError(res.error);
      }
    } catch (err: any) {
      setUsersError('ইউজার ডেটা লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Helper to check if a specific user is currently banned
  const checkIsUserBanned = (user: FirebaseUserData) => {
    if (user.is_banned) return true;
    const devId = user.security_info?.deviceID;
    const ip = user.security_info?.ipAddress;
    const isDevMatch = devId && bannedDevices.some((d) => d.deviceID === devId);
    const isIpMatch = ip && bannedIps.some((i) => i.ipAddress === ip);
    return Boolean(isDevMatch || isIpMatch);
  };

  // Ban action execution
  const handleConfirmBanUser = async () => {
    if (!banModalTarget) return;
    const targetKey = banModalTarget.userId || banModalTarget.email;
    setBanActionLoading(targetKey);
    try {
      const res = await banDeviceAndIp(banModalTarget, banReasonInput);
      if (res.success) {
        setStatusFeedback({
          type: 'success',
          message: `✓ ${banModalTarget.name} এর ডিভাইস ও আইপি সফলভাবে ব্লক করা হয়েছে!`,
        });
        setBanModalTarget(null);
        await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
      } else {
        setStatusFeedback({
          type: 'error',
          message: res.error || 'ব্লক সম্পন্ন করতে ব্যর্থ হয়েছে।',
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err?.message || 'ব্লক সম্পন্ন করতে ব্যর্থ হয়েছে।',
      });
    } finally {
      setBanActionLoading(null);
    }
  };

  // Unban user action
  const handleUnbanUser = async (user: FirebaseUserData) => {
    const key = user.userId || user.email;
    setBanActionLoading(key);
    try {
      const res = await unbanUserAll(user);
      if (res.success) {
        setStatusFeedback({
          type: 'success',
          message: `✓ ${user.name} এর ডিভাইস ও আইপি সফলভাবে আনব্যান করা হয়েছে!`,
        });
        await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
      } else {
        setStatusFeedback({
          type: 'error',
          message: res.error || 'আনব্যান সম্পন্ন করতে সমস্যা হয়েছে।',
        });
      }
    } catch (err: any) {
      setStatusFeedback({
        type: 'error',
        message: err?.message || 'আনব্যান সম্পন্ন করতে সমস্যা হয়েছে।',
      });
    } finally {
      setBanActionLoading(null);
    }
  };

  // Direct unban single device
  const handleUnbanDeviceDirect = async (deviceId: string) => {
    setBanActionLoading(deviceId);
    try {
      const res = await unbanDevice(deviceId);
      if (res.success) {
        setStatusFeedback({
          type: 'success',
          message: `✓ ডিভাইস (${deviceId}) সফলভাবে আনব্যান করা হয়েছে!`,
        });
        await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
      }
    } finally {
      setBanActionLoading(null);
    }
  };

  // Direct unban single IP
  const handleUnbanIpDirect = async (ipAddress: string) => {
    setBanActionLoading(ipAddress);
    try {
      const res = await unbanIp(ipAddress);
      if (res.success) {
        setStatusFeedback({
          type: 'success',
          message: `✓ আইপি (${ipAddress}) সফলভাবে আনব্যান করা হয়েছে!`,
        });
        await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
      }
    } finally {
      setBanActionLoading(null);
    }
  };

  // Manual device ban
  const handleManualDeviceBan = async () => {
    if (!manualDevInput.trim()) return;
    setBanActionLoading('manual_dev');
    try {
      const dummyUser: FirebaseUserData = {
        name: 'ম্যানুয়াল এন্ট্রি',
        email: 'manual@admin.block',
        provider: 'Email',
        batch: 'SSC 2028',
        group: 'প্রশাসনিক',
        created_at: new Date().toISOString(),
        total_study_minutes: 0,
        streak_count: 0,
        last_login: new Date().toISOString(),
        security_info: {
          deviceID: manualDevInput.trim(),
          ipAddress: '0.0.0.0',
        },
      };
      await banDeviceAndIp(dummyUser, manualReasonInput || 'ম্যানুয়াল অ্যাডমিন ব্লকলিস্ট');
      setManualDevInput('');
      setStatusFeedback({ type: 'success', message: '✓ ডিভাইস সফলভাবে ব্লকলিস্টে যোগ করা হয়েছে!' });
      await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
    } finally {
      setBanActionLoading(null);
    }
  };

  // Manual IP ban
  const handleManualIpBan = async () => {
    if (!manualIpInput.trim()) return;
    setBanActionLoading('manual_ip');
    try {
      const dummyUser: FirebaseUserData = {
        name: 'ম্যানুয়াল এন্ট্রি',
        email: 'manual@admin.block',
        provider: 'Email',
        batch: 'SSC 2028',
        group: 'প্রশাসনিক',
        created_at: new Date().toISOString(),
        total_study_minutes: 0,
        streak_count: 0,
        last_login: new Date().toISOString(),
        security_info: {
          deviceID: 'DEV-MANUAL-BLOCK',
          ipAddress: manualIpInput.trim(),
        },
      };
      await banDeviceAndIp(dummyUser, manualReasonInput || 'ম্যানুয়াল অ্যাডমিন ব্লকলিস্ট');
      setManualIpInput('');
      setStatusFeedback({ type: 'success', message: '✓ আইপি সফলভাবে ব্লকলিস্টে যোগ করা হয়েছে!' });
      await Promise.all([loadUsersFromFirebase(), loadBannedLists()]);
    } finally {
      setBanActionLoading(null);
    }
  };

  // Trigger loading data when authenticated and open
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadUsersFromFirebase();
      loadBannedLists();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (inputPasscode.trim() === MASTER_ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'authenticated');
      } catch {
        // ignore
      }
      loadUsersFromFirebase();
    } else {
      setAuthError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPasscode('');
    try {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  // Dispatch PUT to Firebase RTDB for Broadcast Notice
  const handleBroadcastUpdate = async (activeState: boolean) => {
    setIsSyncing(true);
    setSyncStatus({ type: 'idle', message: '' });

    const payload: Partial<GlobalNoticeData> = {
      isNoticeActive: activeState,
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      severity,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Master Admin (1919131514)',
    };

    const res = await updateGlobalNotice(payload, MASTER_ADMIN_PASSCODE);

    setIsSyncing(false);
    if (res.success && res.data) {
      setIsNoticeActive(activeState);
      onNoticeUpdatedLocally(res.data);
      setSyncStatus({
        type: 'success',
        message: activeState 
          ? '✓ Firebase RTDB-তে ইমার্জেন্সি ব্রডকাস্ট লক সক্রিয় ও সিঙ্ক হয়েছে!' 
          : '✓ ব্রডকাস্ট লক প্রত্যাহার করা হয়েছে এবং Firebase আপডেট সম্পন্ন!',
      });
    } else {
      setSyncStatus({
        type: 'error',
        message: res.error || 'Firebase RTDB আপডেট করতে ত্রুটি ঘটেছে।',
      });
    }
  };

  // Metrics calculation for Syllabi
  const totalChapters = subjects.reduce((acc, s) => acc + s.chapters.length, 0);
  const completedChaptersCount = Object.values(chapterProgress).filter(
    (c) => c.status === 'completed' || c.status === 'revised'
  ).length;
  const overallProgressPercentage = calculateTotalProgress(subjects, chapterProgress);

  // Helper: Check if date is today
  const isDateToday = (dateStr: string) => {
    if (!dateStr) return false;
    try {
      const d = new Date(dateStr);
      const today = new Date();
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  };

  // User analytics metrics
  const totalRegisteredUsers = usersList.length;
  const activeTodayCount = usersList.filter((u) => isDateToday(u.last_login)).length;
  const googleUsersCount = usersList.filter((u) => u.provider === 'Google').length;
  const emailUsersCount = usersList.filter((u) => u.provider === 'Email').length;

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesProvider =
        filterProvider === 'all' || user.provider === filterProvider;

      const groupLower = (user.group || '').toLowerCase();
      let matchesGroup = true;
      if (filterGroup === 'science') {
        matchesGroup = groupLower.includes('বিজ্ঞান') || groupLower.includes('science');
      } else if (filterGroup === 'business') {
        matchesGroup = groupLower.includes('ব্যবসায়') || groupLower.includes('business') || groupLower.includes('commerce');
      } else if (filterGroup === 'humanities') {
        matchesGroup = groupLower.includes('মানবিক') || groupLower.includes('arts') || groupLower.includes('humanities');
      }

      return matchesSearch && matchesProvider && matchesGroup;
    });
  }, [usersList, searchQuery, filterProvider, filterGroup]);

  // Format date helper
  const formatDateBn = (dateStr: string) => {
    if (!dateStr) return 'অজানা';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Format relative time helper
  const formatRelativeTimeBn = (dateStr: string) => {
    if (!dateStr) return 'অজানা';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 5) return 'এইমাত্র সক্রিয়';
      if (diffMins < 60) return `${toBengaliNumber(diffMins)} মি. আগে`;
      if (diffHours < 24) return `${toBengaliNumber(diffHours)} ঘণ্টা আগে`;
      return formatDateBn(dateStr);
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto transform-gpu">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl rounded-3xl bg-[#0D111D] border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-hind text-slate-100"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-jakarta">
                  MASTER ADMIN CONTROL & ANALYTICS
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-anek">
                  {isAuthenticated ? 'AUTHENTICATED' : 'PASSCODE PROTECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-anek">
                Firebase Realtime Database লাইভ ইউজার অ্যানালিটিক্স ও সিস্টেম কন্ট্রোল
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer font-anek"
              >
                লগআউট
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {!isAuthenticated ? (
            /* Passcode Verification Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#151C2C] border border-amber-500/30 text-center max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-1 font-jakarta">
                ENTER MASTER ADMIN PASSCODE
              </h4>
              <p className="text-xs text-slate-400 mb-5 font-anek">
                লাইভ ইউজার অ্যানালিটিক্স ও ব্রডকাস্ট সিস্টেমে প্রবেশের জন্য মাস্টার পাসকোড দিন
              </p>

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="পাসওয়ার্ড দিন"
                    value={inputPasscode}
                    onChange={(e) => {
                      setInputPasscode(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  {authError && (
                    <p className="text-xs text-rose-400 mt-2 text-center font-anek flex items-center justify-center gap-1">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>{authError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  প্রবেশ করুন (Authenticate)
                </button>
              </form>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <>
              {/* Feedback status banner */}
              {statusFeedback && (
                <div
                  className={`p-3 rounded-2xl border text-xs font-anek font-bold flex items-center justify-between transition-all ${
                    statusFeedback.type === 'success'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {statusFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{statusFeedback.message}</span>
                  </div>
                  <button
                    onClick={() => setStatusFeedback(null)}
                    className="text-white/60 hover:text-white ml-3 p-1 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Navigation Sub-Tabs */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-white/5 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-anek ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>নিবন্ধিত ইউজার তথ্য (Registered Users Info)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">
                    {totalRegisteredUsers}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('banned')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-anek ${
                    activeTab === 'banned'
                      ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span>ব্লকড লিস্ট (Banned List)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/40 font-mono font-bold">
                    {bannedDevices.length + bannedIps.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('broadcast')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-anek ${
                    activeTab === 'broadcast'
                      ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>ইমার্জেন্সি ব্রডকাস্ট লক</span>
                  {isNoticeActive && (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap font-anek ${
                    activeTab === 'metrics'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>সিলেবাস ও সিস্টেম কন্ট্রোল</span>
                </button>
              </div>

              {/* ============================================================== */}
              {/* TAB 1: REGISTERED USERS INFO & LIVE MONITORING DASHBOARD       */}
              {/* ============================================================== */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Real-time sync endpoint indicator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
                    <div className="flex items-center gap-2 font-mono text-slate-400 truncate">
                      <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-bold">Firebase RTDB:</span>
                      <span className="truncate">{RTDB_USERS_ENDPOINT}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[11px] font-bold font-anek">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        লাইভ সিঙ্কড
                      </span>
                      <button
                        onClick={loadUsersFromFirebase}
                        disabled={isLoadingUsers}
                        title="রিলোড করুন"
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Summary Cards: 4 High-Impact Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {/* Card 1: Total Users Count */}
                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-emerald-500/20 shadow-lg relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400 font-anek font-semibold">
                          মোট নিবন্ধিত ইউজার
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-[#10B981] flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#10B981] font-anek">
                        {toBengaliNumber(totalRegisteredUsers)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-anek">
                        রেজিস্টার্ড একাউন্ট ডাটাবেস
                      </div>
                    </div>

                    {/* Card 2: Active Today */}
                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-cyan-500/20 shadow-lg relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400 font-anek font-semibold">
                          আজকে সক্রিয় ইউজার
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <Flame className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-anek">
                        {toBengaliNumber(activeTodayCount)}
                      </div>
                      <div className="text-[10px] text-cyan-300/80 mt-1 font-anek">
                        আজকের সেশন লগইন অ্যাক্টিভ
                      </div>
                    </div>

                    {/* Card 3: Google Sign-in Users */}
                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-indigo-500/20 shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400 font-anek font-semibold">
                          গুগল অথ ইউজার
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs font-jakarta">
                          G
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-anek">
                        {toBengaliNumber(googleUsersCount)}
                      </div>
                      <div className="text-[10px] text-indigo-300/80 mt-1 font-anek">
                        ১-ক্লিক গুগল প্রোভাইডার
                      </div>
                    </div>

                    {/* Card 4: Email Registered Users */}
                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-amber-500/20 shadow-lg relative overflow-hidden">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-400 font-anek font-semibold">
                          ইমেইল রেজিস্টার্ড
                        </span>
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-amber-400 font-anek">
                        {toBengaliNumber(emailUsersCount)}
                      </div>
                      <div className="text-[10px] text-amber-300/80 mt-1 font-anek">
                        ডাইরেক্ট ইমেইল ক্রেডেনশিয়াল
                      </div>
                    </div>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {/* Search Bar Input */}
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="ইউজারের নাম অথবা ইমেইল দিয়ে সার্চ করুন..."
                          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Provider Filter */}
                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/5 shrink-0 text-xs">
                        <button
                          onClick={() => setFilterProvider('all')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-anek ${
                            filterProvider === 'all'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          সব
                        </button>
                        <button
                          onClick={() => setFilterProvider('Google')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-anek flex items-center gap-1 ${
                            filterProvider === 'Google'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>Google</span>
                        </button>
                        <button
                          onClick={() => setFilterProvider('Email')}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-anek flex items-center gap-1 ${
                            filterProvider === 'Email'
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>Email</span>
                        </button>
                      </div>
                    </div>

                    {/* Group Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                      <span className="text-slate-400 text-[11px] font-anek mr-1">গ্রুপ ফিল্টার:</span>
                      {[
                        { id: 'all', label: 'সকল বিভাগ' },
                        { id: 'science', label: 'বিজ্ঞান (Science)' },
                        { id: 'business', label: 'ব্যবসায় শিক্ষা' },
                        { id: 'humanities', label: 'মানবিক' },
                      ].map((grp) => (
                        <button
                          key={grp.id}
                          onClick={() => setFilterGroup(grp.id as any)}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer font-anek ${
                            filterGroup === grp.id
                              ? 'bg-slate-800 text-emerald-300 border-emerald-500/40 font-bold'
                              : 'bg-slate-900/60 text-slate-400 border-white/5 hover:text-white'
                          }`}
                        >
                          {grp.label}
                        </button>
                      ))}
                      <span className="ml-auto text-[11px] text-slate-400 font-anek">
                        মোট প্রদর্শিত: <strong className="text-emerald-400">{toBengaliNumber(filteredUsers.length)}</strong> জন
                      </span>
                    </div>
                  </div>

                  {/* Detailed User List (Cards in high-contrast dark neon #151C2C) */}
                  <div className="space-y-3">
                    {filteredUsers.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-[#151C2C] border border-white/5 text-center">
                        <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-anek">
                          কোনো ইউজার খুঁজে পাওয়া যায়নি
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="mt-2 text-xs text-emerald-400 hover:underline font-anek"
                          >
                            সার্চ ক্লিয়ার করুন
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredUsers.map((user, idx) => (
                        <div
                          key={user.userId || user.email || idx}
                          className="p-4 sm:p-5 rounded-2xl bg-[#151C2C] border border-white/10 hover:border-emerald-500/30 transition-all shadow-md group relative"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Avatar & Identity */}
                            <div className="flex items-start sm:items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0 font-jakarta">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-sm sm:text-base font-bold text-white font-jakarta">
                                    {user.name}
                                  </h5>
                                  {/* Provider Badge */}
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      user.provider === 'Google'
                                        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                                    }`}
                                  >
                                    {user.provider === 'Google' ? (
                                      <>
                                        <span className="font-black">G</span>
                                        <span>Google</span>
                                      </>
                                    ) : (
                                      <>
                                        <Mail className="w-2.5 h-2.5" />
                                        <span>Email</span>
                                      </>
                                    )}
                                  </span>

                                  {/* Batch Badge */}
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/5 font-mono">
                                    {user.batch || 'SSC 2028'}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                  <span className="text-slate-300">{user.email}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                                  <span className="text-emerald-400/90 font-anek">{user.group}</span>
                                </div>

                                {/* 4th Subject & Syllabus Path Badges */}
                                {(user.fourth_subject || user.syllabus_path) && (
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                                    {user.fourth_subject && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-anek">
                                        ৪র্থ বিষয়: {user.fourth_subject}
                                      </span>
                                    )}
                                    {user.syllabus_path && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#5B50F6]/10 text-indigo-300 border border-[#5B50F6]/30 font-anek">
                                        {user.syllabus_path}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Metrics & Badges */}
                            <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                              {/* Syllabus Completion Percentage */}
                              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-right shrink-0">
                                <span className="text-[10px] text-slate-400 block font-anek">
                                  সিলেবাস সম্পন্ন
                                </span>
                                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1 justify-end">
                                  <Target className="w-3 h-3 text-emerald-400" />
                                  {typeof user.completion_percentage === 'number'
                                    ? `${user.completion_percentage.toFixed(1)}%`
                                    : `${Number(user.completion_percentage || 0).toFixed(1)}%`}
                                </span>
                              </div>

                              {/* Total Study Time */}
                              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-right shrink-0">
                                <span className="text-[10px] text-slate-400 block font-anek">
                                  মোট অধ্যয়ন সময়
                                </span>
                                <span className="text-xs font-bold text-cyan-300 font-anek flex items-center gap-1 justify-end">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  {formatStudyHoursBn(user.total_study_minutes)}
                                </span>
                              </div>

                              {/* Streak Count */}
                              <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/5 text-right shrink-0">
                                <span className="text-[10px] text-slate-400 block font-anek">
                                  স্ট্রিক
                                </span>
                                <span className="text-xs font-bold text-amber-400 font-anek flex items-center gap-1 justify-end">
                                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  {toBengaliNumber(user.streak_count || 1)} দিন
                                </span>
                              </div>

                              {/* Dates */}
                              <div className="text-right text-[11px] text-slate-400 font-anek shrink-0 hidden md:block">
                                <div>রেজিস্ট্রেশন: <span className="text-slate-300">{formatDateBn(user.created_at)}</span></div>
                                <div className="text-[10px] text-slate-500">
                                  সর্বশেষ সক্রিয়: <span className="text-emerald-400/80">{formatRelativeTimeBn(user.last_login)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* User Security & Ban Control Bar */}
                          <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                              {/* Account Status Badge */}
                              {checkIsUserBanned(user) ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold font-mono">
                                  <Ban className="w-3 h-3 text-rose-400" />
                                  ব্লকড (BANNED)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold font-mono">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  সক্রিয় (ACTIVE)
                                </span>
                              )}

                              {/* Device ID */}
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
                                <Smartphone className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="text-slate-500">Device:</span>
                                <span className="text-indigo-300 font-semibold truncate max-w-[130px] sm:max-w-[170px]">
                                  {user.security_info?.deviceID || 'DEV-FALLBACK-SSC2028'}
                                </span>
                              </div>

                              {/* IP Address */}
                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
                                <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span className="text-slate-500">IP:</span>
                                <span className="text-cyan-300 font-semibold">
                                  {user.security_info?.ipAddress || '103.145.118.42'}
                                </span>
                              </div>
                            </div>

                            {/* Ban / Unban Action Button */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {checkIsUserBanned(user) ? (
                                <button
                                  onClick={() => handleUnbanUser(user)}
                                  disabled={banActionLoading === (user.userId || user.email)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-anek flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-lg hover:shadow-emerald-950/40 disabled:opacity-50"
                                >
                                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Unban / অ্যাক্সেস দিন</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setBanModalTarget(user);
                                    setBanReasonInput('অ্যাকাউন্টের নিয়ম লঙ্ঘন বা সন্দেহজনক কার্যকলাপ');
                                  }}
                                  disabled={banActionLoading === (user.userId || user.email)}
                                  className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold font-anek flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-lg hover:shadow-rose-950/40 disabled:opacity-50"
                                >
                                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Ban Device & IP</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: BLOCKED LIST (DEVICES & IPS) CONTROL DASHBOARD          */}
              {/* ============================================================== */}
              {activeTab === 'banned' && (
                <div className="space-y-6">
                  {/* Top Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-rose-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-anek block">মোট ব্লকড ডিভাইস</span>
                        <span className="text-xl font-black text-rose-400 font-mono">{bannedDevices.length} টি</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                        <Smartphone className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-rose-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-anek block">মোট ব্লকড আইপি</span>
                        <span className="text-xl font-black text-rose-400 font-mono">{bannedIps.length} টি</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                        <Globe className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#151C2C] border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-anek block">ব্লকলিস্ট নিরাপত্তা স্ট্যাটাস</span>
                        <span className="text-xs font-bold text-emerald-400 font-anek flex items-center gap-1.5 mt-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          রিয়েলটাইম এনফোর্সমেন্ট সক্রিয়
                        </span>
                      </div>
                      <button
                        onClick={loadBannedLists}
                        disabled={isLoadingBanned}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all cursor-pointer"
                        title="রিফ্রেশ করুন"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingBanned ? 'animate-spin text-emerald-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Section 1: Blocked Devices Table */}
                  <div className="p-5 rounded-3xl bg-[#151C2C] border border-white/5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white font-jakarta">
                          ব্লকড ডিভাইসসমূহ (BLOCKED DEVICE IDs)
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold">
                          {bannedDevices.length}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">{RTDB_BANNED_DEVICES_ENDPOINT}</span>
                    </div>

                    {bannedDevices.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 font-anek">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-xs">বর্তমানে কোনো ডিভাইস ব্লক তালিকায় নেই। সব ডিভাইস অনুমোদিত।</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {bannedDevices.map((dev) => (
                          <div
                            key={dev.deviceID}
                            className="p-3 rounded-2xl bg-slate-900/80 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-500/40 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-md border border-rose-500/30">
                                  {dev.deviceID}
                                </span>
                                {dev.user_name && (
                                  <span className="text-xs text-slate-300 font-anek font-semibold">
                                    {dev.user_name}
                                  </span>
                                )}
                                {dev.user_email && (
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    ({dev.user_email})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-anek flex-wrap">
                                <span>কারণ: <span className="text-slate-300">{dev.reason || 'সন্দেহজনক কার্যকলাপ'}</span></span>
                                <span>•</span>
                                <span>ব্লকের সময়: <span className="text-slate-400 font-mono">{dev.banned_at ? new Date(dev.banned_at).toLocaleString('bn-BD') : 'অজানা'}</span></span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleUnbanDeviceDirect(dev.deviceID)}
                              disabled={banActionLoading === dev.deviceID}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-anek flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0 hover:shadow-md hover:shadow-emerald-950/40 disabled:opacity-50"
                            >
                              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Unban / অ্যাক্সেস দিন</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Blocked IPs Table */}
                  <div className="p-5 rounded-3xl bg-[#151C2C] border border-white/5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-sm font-bold text-white font-jakarta">
                          ব্লকড আইপি অ্যাড্রেসসমূহ (BLOCKED IP ADDRESSES)
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold">
                          {bannedIps.length}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">{RTDB_BANNED_IPS_ENDPOINT}</span>
                    </div>

                    {bannedIps.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 font-anek">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto mb-2" />
                        <p className="text-xs">বর্তমানে কোনো আইপি অ্যাড্রেস ব্লক তালিকায় নেই। সব নেটওয়ার্ক অনুমোদিত।</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {bannedIps.map((ip) => (
                          <div
                            key={ip.ipAddress}
                            className="p-3 rounded-2xl bg-slate-900/80 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-500/40 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                                  {ip.ipAddress}
                                </span>
                                {ip.user_name && (
                                  <span className="text-xs text-slate-300 font-anek font-semibold">
                                    {ip.user_name}
                                  </span>
                                )}
                                {ip.user_email && (
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    ({ip.user_email})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-anek flex-wrap">
                                <span>কারণ: <span className="text-slate-300">{ip.reason || 'সন্দেহজনক নেটওয়ার্ক ট্রাফিক'}</span></span>
                                <span>•</span>
                                <span>ব্লকের সময়: <span className="text-slate-400 font-mono">{ip.banned_at ? new Date(ip.banned_at).toLocaleString('bn-BD') : 'অজানা'}</span></span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleUnbanIpDirect(ip.ipAddress)}
                              disabled={banActionLoading === ip.ipAddress}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-anek flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shrink-0 hover:shadow-md hover:shadow-emerald-950/40 disabled:opacity-50"
                            >
                              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Unban / অ্যাক্সেস দিন</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Manual Block Controls */}
                  <div className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-bold text-white font-jakarta">
                        ম্যানুয়াল ডিভাইস বা আইপি ব্লকলিস্টিং (MANUAL BLOCK CONTROLS)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Manual Device Form */}
                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-indigo-300 font-anek block">
                          নির্দিষ্ট Device ID ব্লক করুন
                        </span>
                        <input
                          type="text"
                          placeholder="DEV-XXXXXXXXX..."
                          value={manualDevInput}
                          onChange={(e) => setManualDevInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          onClick={handleManualDeviceBan}
                          disabled={!manualDevInput.trim() || banActionLoading === 'manual_dev'}
                          className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold font-anek flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>ডিভাইস ব্লক করুন</span>
                        </button>
                      </div>

                      {/* Manual IP Form */}
                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 space-y-3">
                        <span className="text-xs font-bold text-cyan-300 font-anek block">
                          নির্দিষ্ট IP Address ব্লক করুন
                        </span>
                        <input
                          type="text"
                          placeholder="103.xxx.xxx.xxx..."
                          value={manualIpInput}
                          onChange={(e) => setManualIpInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          onClick={handleManualIpBan}
                          disabled={!manualIpInput.trim() || banActionLoading === 'manual_ip'}
                          className="w-full py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold font-anek flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>আইপি ব্লক করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: GLOBAL EMERGENCY BROADCAST & SECURITY LOCK              */}
              {/* ============================================================== */}
              {activeTab === 'broadcast' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#151C2C] border border-rose-500/30 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
                      <div>
                        <h4 className="text-sm font-bold text-white font-jakarta">
                          FIREBASE RTDB EMERGENCY BROADCAST LOCK
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {NOTICE_ENDPOINT}
                        </span>
                      </div>
                    </div>

                    {/* Live Lock Status Pill */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border font-anek ${
                          isNoticeActive
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                            : 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
                        }`}
                      >
                        {isNoticeActive ? '● লক সক্রিয় (LOCKED)' : '● সাধারণ মোড (NORMAL)'}
                      </span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        নোটিশ শিরোনাম (Notice Title)
                      </label>
                      <input
                        type="text"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        placeholder="যেমন: জরুরি রক্ষণাবেক্ষণ ও সিস্টেম নোটিশ"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500/40"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        বিস্তারিত বার্তা (Notice Message)
                      </label>
                      <textarea
                        rows={3}
                        value={noticeMessage}
                        onChange={(e) => setNoticeMessage(e.target.value)}
                        placeholder="শিক্ষার্থীদের জন্য বার্তা লিখুন..."
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500/40"
                      />
                    </div>

                    {/* Severity level */}
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300 font-bold">তীব্রতা (Severity):</span>
                      {[
                        { id: 'urgent', label: 'জরুরি (Urgent Red)', color: 'border-rose-500 text-rose-300' },
                        { id: 'warning', label: 'সতর্কতা (Warning Amber)', color: 'border-amber-500 text-amber-300' },
                        { id: 'info', label: 'তথ্যমূলক (Info Cyan)', color: 'border-cyan-500 text-cyan-300' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSeverity(s.id as any)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                            severity === s.id
                              ? 'bg-slate-800 shadow-md font-bold ring-2 ring-white/20'
                              : 'opacity-60 hover:opacity-100'
                          } ${s.color}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Sync status alert */}
                    {syncStatus.message && (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                          syncStatus.type === 'success'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {syncStatus.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        <span>{syncStatus.message}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={() => handleBroadcastUpdate(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'লক সক্রিয় করুন (Activate Broadcast Lock)'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSyncing}
                        onClick={() => handleBroadcastUpdate(false)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'লক প্রত্যাহার করুন (Deactivate Lock)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: SYLLABUS STATUS, STREAM SWITCHER & DATA RESET           */}
              {/* ============================================================== */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  {/* System Metrics */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-jakarta">
                        TOTAL SYLLABUS & STUDENT PROGRESS METRICS
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 text-center">
                        <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-anek">
                          {toBengaliNumber(subjects.length)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-anek">
                          মোট সক্রিয় বিষয় (Syllabi)
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 text-center">
                        <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-anek">
                          {toBengaliNumber(totalChapters)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-anek">
                          মোট নির্ধারিত অধ্যায়
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 text-center">
                        <div className="text-2xl sm:text-3xl font-black text-[#10B981] font-anek">
                          {toBengaliNumber(completedChaptersCount)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-anek">
                          পড়া সম্পন্ন অধ্যায়
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/5 text-center">
                        <div className="text-2xl sm:text-3xl font-black text-amber-400 font-anek">
                          {toBengaliNumber(overallProgressPercentage)}%
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-anek">
                          সামগ্রিক অগ্রগতি রেট
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Stream Switching & State Reset */}
                  <div className="p-5 rounded-2xl bg-[#151C2C] border border-white/5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-white font-jakarta">
                          DYNAMIC STREAM SWITCHER (বিভাগ পরিবর্তন)
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          বিজ্ঞান, ব্যবসায় শিক্ষা বা মানবিক বিভাগে এক ক্লিকে সুইচ করুন
                        </p>
                      </div>

                      {/* Stream buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: 'science' as StreamKey, label: 'বিজ্ঞান (Science)' },
                          { id: 'business' as StreamKey, label: 'ব্যবসায় শিক্ষা' },
                          { id: 'humanities' as StreamKey, label: 'মানবিক (Humanities)' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            onClick={() => onStreamChange(st.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-anek ${
                              currentStream === st.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-rose-300 font-jakarta">
                          SYSTEM DATA RESET
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          সকল পড়ার অগ্রগতি ও সাজেশন রিসেট করুন (প্রোফাইল অক্ষুণ্ণ থাকবে)
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('আপনি কি নিশ্চিত যে সকল অগ্রগতি রিসেট করতে চান?')) {
                            onResetProgress();
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>প্রোগ্রেস স্টেট রিসেট করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ban Confirmation Modal */}
        {banModalTarget && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#151C2C] border border-rose-500/40 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-jakarta">
                    CONFIRM BAN: DEVICE & IP
                  </h4>
                  <p className="text-xs text-rose-300 font-anek">
                    ডিভাইস ও আইপি তাৎক্ষণিক অ্যাক্সেস ব্লক করুন
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-anek">শিক্ষার্থী:</span>
                    <span className="text-white font-semibold">{banModalTarget.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-anek">ইমেইল:</span>
                    <span className="text-cyan-300 truncate max-w-[200px]">{banModalTarget.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-anek">Device ID:</span>
                    <span className="text-indigo-300 truncate max-w-[180px]">
                      {banModalTarget.security_info?.deviceID || 'DEV-FALLBACK-SSC2028'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-anek">IP Address:</span>
                    <span className="text-emerald-300">
                      {banModalTarget.security_info?.ipAddress || '103.145.118.42'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 font-anek">
                    ব্লক করার কারণ (Reason for Ban)
                  </label>
                  <input
                    type="text"
                    value={banReasonInput}
                    onChange={(e) => setBanReasonInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-anek focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="ব্লকের সুনির্দিষ্ট কারণ লিখুন..."
                  />
                </div>

                <p className="text-[11px] text-slate-400 font-anek bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  ⚠️ এই ব্যবহারকারীর ডিভাইস ও আইপি Firebase RTDB-র <code className="text-rose-300">/banned_devices</code> এবং <code className="text-rose-300">/banned_ips</code> নোডে যুক্ত হবে এবং তাৎক্ষণিকভাবে অ্যাপ অ্যাক্সেস ব্লক হবে।
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBanModalTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-anek transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={banActionLoading !== null}
                  onClick={handleConfirmBanUser}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-anek flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{banActionLoading ? 'ব্লক হচ্ছে...' : 'কনফার্ম ব্লক (Ban Now)'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
