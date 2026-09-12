import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, School, MapPin, Phone, Calendar, 
  Sparkles, Upload, Edit3, Check, X, ShieldCheck,
  Camera, Award, CheckCircle2, Bookmark, Flame, ArrowRight,
  RefreshCw, CheckCircle, Info, GraduationCap, BookOpen
} from 'lucide-react';
import { UserProfile, ReligionBn } from '../types';

export const AI_AVATARS_LIST = [
  {
    id: 'avatar-1',
    label: 'সাইমন (AI)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
    tags: 'Science • Tech'
  },
  {
    id: 'avatar-2',
    label: 'আয়েশা (AI)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    tags: 'Biology • Topper'
  },
  {
    id: 'avatar-3',
    label: 'ফারহান (AI)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    tags: 'Math • Physics'
  },
  {
    id: 'avatar-4',
    label: 'সুমাইয়া (AI)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    tags: 'Literature • Arts'
  },
  {
    id: 'avatar-5',
    label: 'রাফিদ (AI)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    tags: 'Business • Logic'
  },
  {
    id: 'avatar-6',
    label: 'নাফিসা (AI)',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    tags: 'ICT • Olympiad'
  }
];

interface ModernStudentProfileProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onGoToSubjects?: () => void;
  onGoToProgress?: () => void;
}

export const ModernStudentProfile: React.FC<ModernStudentProfileProps> = ({
  profile,
  onUpdateProfile,
  onGoToSubjects,
  onGoToProgress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData when profile changes outside
  React.useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Gallery File Upload Handlers
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      onUpdateProfile({ avatar: base64Url });
      setFormData(prev => ({ ...prev, avatar: base64Url }));
      triggerToast();
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    triggerToast();
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="relative w-full text-slate-100 font-hind">
      {/* Ambient glowing background orbs */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Success Notification Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-xl text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-100 font-jakarta">Profile Updated!</p>
              <p className="text-[11px] text-emerald-300">প্রোফাইলের তথ্য সফলভাবে সংরক্ষিত হয়েছে।</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic Card Container */}
      <motion.div 
        layout
        className="relative bg-slate-900/70 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden"
      >
        {/* Subtle glass reflection gradient at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-jakarta">
                  STUDENT PROFILE MANAGEMENT
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ব্যক্তিগত তথ্য, শিক্ষাপ্রতিষ্ঠান ও ডিজিটাল স্টুডেন্ট আইডি পোর্টাল
              </p>
            </div>
          </div>

          {/* Edit Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (isEditing) {
                handleCancelEdit();
              } else {
                setFormData(profile);
                setIsEditing(true);
              }
            }}
            className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all shadow-lg ${
              isEditing
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 border border-indigo-400/30'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" /> বাতিল করুন
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> প্রোফাইল এডিট করুন
              </>
            )}
          </motion.button>
        </div>

        {/* Hero Section: Avatar & Identity Highlight */}
        <div className="pt-8 pb-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 border-b border-white/5">
          
          {/* Avatar Area: Upload + AI Avatars */}
          <div className="flex flex-col items-center shrink-0">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-cyan-400 to-purple-500 rounded-full opacity-70 blur-xs group-hover:opacity-100 transition duration-300" />
              
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800 shadow-2xl">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Drag active overlay */}
                {dragActive && (
                  <div className="absolute inset-0 bg-indigo-600/80 flex flex-col items-center justify-center text-white text-xs font-bold p-2 text-center">
                    <Upload className="w-6 h-6 mb-1 animate-bounce" />
                    ছবিটি এখানে ছাড়ুন
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs">
                  <Camera className="w-5 h-5 mb-1" />
                  <span>ছবি পরিবর্তন</span>
                </div>
              </div>

              {/* Upload Badge Button */}
              <label
                htmlFor="device-image-upload"
                onClick={(e) => e.stopPropagation()}
                title="গ্যালারি থেকে আপলোড করুন"
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl border-2 border-slate-900 cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <input
                  ref={fileInputRef}
                  id="device-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-1 font-medium">
              <Upload className="w-3 h-3 text-indigo-400" /> ড্র্যাগ অ্যান্ড ড্রপ বা গ্যালারি থেকে আপলোড
            </p>

            {/* AI Generated Avatar Row */}
            <div className="mt-5 w-full max-w-xs text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>AI জেনারেটেড অবতার নির্বাচন করুন:</span>
              </div>

              <div className="flex items-center justify-center gap-2 flex-wrap">
                {AI_AVATARS_LIST.map((item) => {
                  const isSelected = profile.avatar === item.url;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        onUpdateProfile({ avatar: item.url });
                        triggerToast();
                      }}
                      className="relative cursor-pointer"
                      title={`${item.label} (${item.tags})`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-400 shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400/50'
                            : 'border-slate-700 hover:border-indigo-400/60 opacity-80 hover:opacity-100'
                        }`}
                      />
                      {isSelected && (
                        <motion.div
                          layoutId="activeAvatarRing"
                          className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Student Info Display & Badges */}
          <div className="flex-1 text-center lg:text-left">
            {/* Pill Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-anek flex items-center gap-1">
                <Bookmark className="w-3 h-3" /> {profile.sscBatch}
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-anek flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> {profile.classLevel}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-anek flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-400" /> ধর্ম: {profile.religion || 'ইসলাম'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-anek flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> লক্ষ্য: {profile.targetGrade || 'GPA 5.00'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold font-anek flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> স্ট্রিক: {profile.streakDays || 15} দিন
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {profile.name}
            </h1>
            
            {/* School & Group */}
            <p className="text-sm sm:text-base text-slate-300 font-medium mt-1 flex items-center justify-center lg:justify-start gap-2">
              <span>{profile.group}</span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-slate-400">{profile.school}</span>
            </p>

            {/* Meta badges */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <School className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">বিদ্যালয়ের নাম</p>
                  <p className="font-semibold text-slate-200 truncate">{profile.school}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">জেলা ও বিভাগ</p>
                  <p className="font-semibold text-slate-200">
                    {profile.district}, {profile.division}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">যোগাযোগ নম্বর</p>
                  <p className="font-semibold text-slate-200 font-anek">{profile.phone}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">ধর্ম শিক্ষা পাঠ্যবই</p>
                  <p className="font-semibold text-amber-300 truncate">
                    {profile.religion || 'ইসলাম'} ও নৈতিক শিক্ষা
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-medium">স্টুডেন্ট স্ট্যাটাস</p>
                  <p className="font-semibold text-emerald-400">অ্যাক্টিভ শিক্ষার্থী (নিয়মিত)</p>
                </div>
              </div>
            </div>

            {/* Action buttons (Navigation shortcuts) */}
            <div className="mt-6 flex flex-wrap gap-2.5 justify-center lg:justify-start">
              {onGoToSubjects && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGoToSubjects}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  সিলেবাস ও অধ্যায় দেখুন <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </motion.button>
              )}
              {onGoToProgress && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onGoToProgress}
                  className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  পড়াশোনার অগ্রগতি রিপোর্ট <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Edit Form Panel (Animated with AnimatePresence) */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 pt-6 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl relative">
                {/* Glow accent */}
                <div className="absolute top-0 right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-base">
                    <Edit3 className="w-5 h-5 text-indigo-400" />
                    <span>প্রোফাইল তথ্য সম্পাদন করুন (Edit Profile)</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    সকল পরিবর্তন লোকাল স্টোরেজে সংরক্ষিত হবে
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        শিক্ষার্থীর পূর্ণ নাম
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="যেমন: মো: সাইমন হাসান"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      />
                    </div>

                    {/* School Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        বিদ্যালয়ের নাম
                      </label>
                      <input
                        type="text"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        required
                        placeholder="যেমন: সরকারি জিলা স্কুল"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      />
                    </div>

                    {/* Class */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        শ্রেণী (Class Level)
                      </label>
                      <select
                        value={formData.classLevel}
                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      >
                        <option value="নবম শ্রেণী (Class 9)">নবম শ্রেণী (Class 9)</option>
                        <option value="দশম শ্রেণী (Class 10)">দশম শ্রেণী (Class 10)</option>
                        <option value="এসএসসি পরীক্ষার্থী (SSC Candidate)">এসএসসি পরীক্ষার্থী (SSC Candidate)</option>
                      </select>
                    </div>

                    {/* SSC Batch */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        এসএসসি ব্যাচ / বর্ষ
                      </label>
                      <input
                        type="text"
                        value={formData.sscBatch}
                        onChange={(e) => setFormData({ ...formData, sscBatch: e.target.value })}
                        placeholder="যেমন: SSC 2028 বা SSC 2026"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all font-anek"
                      />
                    </div>

                    {/* Group */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        বিভাগ (Group)
                      </label>
                      <select
                        value={formData.group}
                        onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      >
                        <option value="বিজ্ঞান (Science)">বিজ্ঞান (Science)</option>
                        <option value="ব্যবসায় শিক্ষা (Business Studies)">ব্যবসায় শিক্ষা (Business Studies)</option>
                        <option value="মানবিক (Humanities)">মানবিক (Humanities)</option>
                      </select>
                    </div>

                    {/* Religion */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>ধর্ম (Religion)</span>
                        <span className="text-[10px] text-amber-400 font-normal">পাঠ্যবই অটো ফিল্টার হবে</span>
                      </label>
                      <select
                        value={formData.religion || 'ইসলাম'}
                        onChange={(e) => setFormData({ ...formData, religion: e.target.value as ReligionBn })}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 text-xs transition-all"
                      >
                        <option value="ইসলাম">ইসলাম (ইসলাম ও নৈতিক শিক্ষা)</option>
                        <option value="হিন্দু">হিন্দু (হিন্দুধর্ম ও নৈতিক শিক্ষা)</option>
                        <option value="বৌদ্ধ">বৌদ্ধ (বৌদ্ধধর্ম ও নৈতিক শিক্ষা)</option>
                        <option value="খ্রিস্টান">খ্রিস্টান (খ্রিস্টধর্ম ও নৈতিক শিক্ষা)</option>
                      </select>
                    </div>

                    {/* Target Grade */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        টার্গেট গ্রেড (Target Result)
                      </label>
                      <input
                        type="text"
                        value={formData.targetGrade || 'GPA 5.00 (Golden A+)'}
                        onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                        placeholder="GPA 5.00 / Golden A+"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all font-anek"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        জেলা (District)
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="যেমন: কুমিল্লা, ঢাকা"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      />
                    </div>

                    {/* Division */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        বিভাগ (Division)
                      </label>
                      <input
                        type="text"
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        placeholder="যেমন: চট্টগ্রাম, ঢাকা, রাজশাহী"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        মোবাইল নম্বর
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1700-000000"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-xs transition-all font-anek"
                      />
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 rounded-2xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                    >
                      বাতিল
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
                    >
                      <Check className="w-4 h-4" /> পরিবর্তন সংরক্ষণ করুন
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
