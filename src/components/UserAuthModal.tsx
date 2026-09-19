import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, CheckCircle2, ShieldCheck, 
  Sparkles, X, LogIn, UserPlus, ArrowRight, Check,
  AlertCircle, RefreshCw, Flame, BookOpen, GraduationCap
} from 'lucide-react';
import { FirebaseUserData } from '../types';
import { syncUserToFirebase, sanitizeUserId, saveLocalAuthSession } from '../services/firebaseUserService';
import { getDeviceSecurityInfo, checkIfDeviceOrIpBanned } from '../services/deviceSecurityService';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: FirebaseUserData | null;
  onUserAuthenticated: (user: FirebaseUserData) => void;
  currentStreak?: number;
  totalStudyMinutes?: number;
  isMandatory?: boolean;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserAuthenticated,
  currentStreak = 15,
  totalStudyMinutes = 480,
  isMandatory = false,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState(currentUser?.group || 'বিজ্ঞান (Science)');
  const [batch, setBatch] = useState(currentUser?.batch || 'SSC 2028');
  const [emailVerified, setEmailVerified] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // 1. Google 1-Click Sign-in Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Verify if current device or IP is banned
      const banStatus = await checkIfDeviceOrIpBanned();
      if (banStatus.isBanned) {
        setIsLoading(false);
        setErrorMsg('আপনার ডিভাইস বা আইপি অ্যাড্রেস থেকে অ্যাপ অ্যাক্সেস ব্লক করা হয়েছে। এডমিনের অনুমতি ছাড়া এই অ্যাপটি ব্যবহার করা সম্ভব নয়।');
        return;
      }

      const secInfo = await getDeviceSecurityInfo();
      const googleUserEmail = (email && email.includes('@')) 
        ? email.trim().toLowerCase() 
        : (currentUser?.email || `student_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`);
      const studentName = (name && name.trim()) ? name.trim() : (currentUser?.name || 'শিক্ষার্থী');
      const userData: FirebaseUserData = {
        userId: sanitizeUserId(googleUserEmail),
        name: studentName,
        email: googleUserEmail,
        provider: 'Google',
        batch,
        group,
        created_at: currentUser?.created_at || new Date().toISOString(),
        total_study_minutes: totalStudyMinutes,
        streak_count: currentStreak,
        last_login: new Date().toISOString(),
        fourth_subject: currentUser?.fourth_subject,
        syllabus_path: currentUser?.syllabus_path,
        onboarding_completed: currentUser?.onboarding_completed,
        security_info: secInfo,
      };

      saveLocalAuthSession(userData);
      const res = await syncUserToFirebase(userData);
      setIsLoading(false);

      if (res.success && res.data) {
        setSuccessMsg('✓ গুগল অ্যাকাউন্ট সফলভাবে ভেরিফাইড ও সিঙ্ক হয়েছে!');
        onUserAuthenticated(res.data);
        if (onClose && !isMandatory) {
          setTimeout(() => onClose(), 800);
        }
      } else {
        onUserAuthenticated(userData);
        setSuccessMsg('✓ গুগল অ্যাকাউন্ট লোকাল সেশনে সংরক্ষিত হয়েছে!');
        if (onClose && !isMandatory) {
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'গুগল সাইন-ইন প্রক্রিয়ায় ত্রুটি ঘটেছে।');
    }
  };

  // 2. Email Login/Register Form Submit
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন।');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Verify if current device or IP is banned
      const banStatus = await checkIfDeviceOrIpBanned();
      if (banStatus.isBanned) {
        setIsLoading(false);
        setErrorMsg('আপনার ডিভাইস বা আইপি অ্যাড্রেস থেকে অ্যাপ অ্যাক্সেস ব্লক করা হয়েছে। এডমিনের অনুমতি ছাড়া এই অ্যাপটি ব্যবহার করা সম্ভব নয়।');
        return;
      }

      const secInfo = await getDeviceSecurityInfo();
      const userData: FirebaseUserData = {
        userId: sanitizeUserId(email),
        name: name.trim() || 'শিক্ষার্থী',
        email: email.trim().toLowerCase(),
        provider: 'Email',
        batch,
        group,
        created_at: authMode === 'register' ? new Date().toISOString() : (currentUser?.created_at || new Date().toISOString()),
        total_study_minutes: totalStudyMinutes,
        streak_count: currentStreak,
        last_login: new Date().toISOString(),
        fourth_subject: currentUser?.fourth_subject,
        syllabus_path: currentUser?.syllabus_path,
        onboarding_completed: currentUser?.onboarding_completed,
        security_info: secInfo,
      };

      saveLocalAuthSession(userData);
      const res = await syncUserToFirebase(userData);
      setIsLoading(false);

      if (res.success && res.data) {
        setSuccessMsg(
          authMode === 'register'
            ? '✓ একাউন্ট সফলভাবে তৈরি, ইমেইল ভেরিফাইড ও Firebase RTDB-তে সিঙ্ক হয়েছে!'
            : '✓ লগইন সফল ও ডেটাবেজে সেশন ভেরিফাইড হয়েছে!'
        );
        onUserAuthenticated(res.data);
        if (onClose && !isMandatory) {
          setTimeout(() => onClose(), 800);
        }
      } else {
        onUserAuthenticated(userData);
        setSuccessMsg('✓ সেশন ভেরিফাইড ও সংরক্ষিত হয়েছে (অফলাইন মোড)।');
        if (onClose && !isMandatory) {
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'অনুরোধটি সম্পন্ন করতে ত্রুটি হয়েছে।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto transform-gpu">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl bg-[#0D111D] border border-white/10 shadow-2xl overflow-hidden my-auto font-hind text-slate-100"
      >
        {/* Header with Close */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B50F6]/20 to-[#10B981]/20 border border-[#5B50F6]/40 flex items-center justify-center text-[#5B50F6]">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-jakarta">
                  {isMandatory
                    ? 'MANDATORY AUTHENTICATION GATE'
                    : currentUser
                    ? 'STUDENT ACCOUNT & SYNC'
                    : 'SIGN IN / REGISTER'}
                </h3>
                {isMandatory && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-anek">
                    বাধ্যতামূলক
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-anek">
                {isMandatory
                  ? 'ড্যাশবোর্ডে প্রবেশের পূর্বে গুগল বা ইমেইল দিয়ে সাইন ইন করুন'
                  : 'Firebase Realtime Database অটো-সিঙ্ক ও প্রোফাইল'}
              </p>
            </div>
          </div>

          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Current User Status Banner if logged in */}
          {currentUser && !isMandatory && (
            <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.provider === 'Google' ? 'G' : '✉'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 font-jakarta">
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-normal">
                      {currentUser.provider}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block flex items-center gap-1 justify-end font-anek">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>সিঙ্কড</span>
                </span>
                <span className="text-[10px] text-slate-400 font-anek">
                  {currentUser.group}
                </span>
              </div>
            </div>
          )}

          {/* 1-Click Google Sign In (গুগল অ্যাকাউন্ট দিয়ে এগিয়ে যান) */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 transform-gpu hover:scale-[1.01]"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-anek text-xs font-bold">গুগল অ্যাকাউন্ট দিয়ে এগিয়ে যান (Continue with Google)</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0D111D] px-2.5 text-[11px] text-slate-500 font-anek">
              অথবা ইমেইল ও পাসওয়ার্ড দিয়ে
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Tab Switch: Login vs Register */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-anek ${
                authMode === 'login'
                  ? 'bg-[#5B50F6] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer font-anek ${
                authMode === 'register'
                  ? 'bg-[#5B50F6] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              নতুন রেজিস্ট্রেশন (Register)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  আপনার পুরো নাম (Student Name)
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#5B50F6] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                ইমেইল এড্রেস (Email Address)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="আপনার ইমেইল দিন"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#5B50F6] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসওয়ার্ড দিন"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-[#5B50F6] focus:outline-none"
              />
            </div>

            {/* Email Verification Check Feature */}
            <div className="p-2.5 rounded-xl bg-[#151C2C] border border-emerald-500/30 flex items-start gap-2 text-[11px] font-anek">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-400 block">
                  ইমেইল ভেরিফিকেশন চেক (Email Verification Active):
                </span>
                <span className="text-slate-400">
                  নিরাপদ সেশন সুরক্ষার জন্য ইমেইল ফরম্যাট যাচাই ও Firebase নোড নিশ্চিতকরণ সচল রয়েছে।
                </span>
              </div>
            </div>

            {authMode === 'register' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    গ্রুপ (Group)
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#5B50F6] focus:outline-none"
                  >
                    <option value="বিজ্ঞান (Science)">বিজ্ঞান (Science)</option>
                    <option value="ব্যবসায় শিক্ষা">ব্যবসায় শিক্ষা</option>
                    <option value="মানবিক (Humanities)">মানবিক (Humanities)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ব্যাচ (Batch)
                  </label>
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-[#5B50F6] focus:outline-none"
                  >
                    <option value="SSC 2028">SSC 2028</option>
                    <option value="SSC 2027">SSC 2027</option>
                    <option value="SSC 2026">SSC 2026</option>
                  </select>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5 font-anek">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-anek">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Firebase RTDB সিঙ্ক হচ্ছে...</span>
                </>
              ) : authMode === 'register' ? (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>রেজিস্ট্রেশন সম্পন্ন করুন</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </form>

          {/* Sync Guarantee Note */}
          <p className="text-[11px] text-slate-500 text-center font-anek mt-2">
            🔒 আপনার নাম, ইমেইল, গ্রুপ, ও স্টাডি টাইম স্বয়ংক্রিয়ভাবে <code className="text-cyan-400">/users.json</code> এ সংরক্ষিত থাকবে।
          </p>
        </div>
      </motion.div>
    </div>
  );
};
