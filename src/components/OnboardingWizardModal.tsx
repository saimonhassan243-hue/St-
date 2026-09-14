import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, ChevronRight, ArrowLeft, ArrowRight,
  BookOpen, Layers, Check, ShieldCheck, Compass, Award,
  School, MapPin, User, Flame, X, CheckSquare, Square,
  Atom, FlaskConical, Dna, Calculator, Globe, HeartHandshake,
  BookmarkCheck, Sparkle, AlertCircle, GraduationCap
} from 'lucide-react';
import { 
  StreamKey, ReligionKey, ReligionBn, FourthSubjectKey, 
  UserProfile, FirebaseUserData, Subject, Chapter 
} from '../types';
import { 
  COMPULSORY_SUBJECTS, STREAM_SUBJECTS, RELIGION_DATA,
  STREAM_OPTIONS, FOURTH_SUBJECT_OPTIONS, RELIGION_OPTIONS,
  getFourthSubject, mapProfileReligionToSubjectKey, mapSubjectKeyToProfileReligion
} from '../data/curriculum';
import { toBengaliNumber } from '../utils/progressCalculator';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialProfile: UserProfile;
  initialStream: StreamKey;
  initialFourthSubject: FourthSubjectKey;
  initialReligion?: ReligionKey;
  initialCustomSelectedChapterIds?: string[];
  currentUser?: FirebaseUserData | null;
  onComplete: (data: {
    profile: Partial<UserProfile>;
    stream: StreamKey;
    religion: ReligionKey;
    fourthSubject: FourthSubjectKey;
    syllabusPath: 'standard' | 'custom';
    customSelectedChapterIds?: string[];
  }) => void;
}

interface WizardStepMeta {
  id: string;
  type: 'mode_selection' | 'group' | 'fourth_subject' | 'religion' | 'subject_checklist' | 'completion';
  title: string;
  subtitle: string;
  badge: string;
  subject?: Subject;
  groupCategory?: string;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  initialStream,
  initialFourthSubject,
  initialReligion,
  initialCustomSelectedChapterIds,
  currentUser,
  onComplete,
}) => {
  // Wizard Step Index (Always starts at Step 1 / Index 0)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [wizardMode, setWizardMode] = useState<'standard' | 'custom'>('standard');

  // Reset to Step 1 whenever modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setWizardMode('standard');
      if (initialCustomSelectedChapterIds && initialCustomSelectedChapterIds.length > 0) {
        setSelectedChapterIds(new Set(initialCustomSelectedChapterIds));
      }
    }
  }, [isOpen, initialCustomSelectedChapterIds]);

  // Core Form State
  const [name, setName] = useState(currentUser?.name || initialProfile.name || 'মো: সাইমন হাসান');
  const [school, setSchool] = useState(initialProfile.school || 'সরকারি জিলা স্কুল');
  const [district, setDistrict] = useState(initialProfile.district || 'কুমিল্লা');
  const [selectedStream, setSelectedStream] = useState<StreamKey>(initialStream || 'science');
  const [selectedReligion, setSelectedReligion] = useState<ReligionBn>(initialProfile.religion || 'ইসলাম');
  const [batch, setBatch] = useState(currentUser?.batch || initialProfile.sscBatch || 'SSC 2028');
  const [fourthSubject, setFourthSubject] = useState<FourthSubjectKey>(initialFourthSubject || 'hmath');

  // Custom chapter selection set (defaults to all chapters selected for 100% complete syllabus)
  const [selectedChapterIds, setSelectedChapterIds] = useState<Set<string>>(() => {
    if (initialCustomSelectedChapterIds && initialCustomSelectedChapterIds.length > 0) {
      return new Set(initialCustomSelectedChapterIds);
    }
    const ids = new Set<string>();
    // Pre-populate compulsory
    COMPULSORY_SUBJECTS.forEach((sub) => sub.chapters.forEach((ch) => ids.add(ch.id)));
    // Pre-populate science subjects
    STREAM_SUBJECTS.science.forEach((sub) => sub.chapters.forEach((ch) => ids.add(ch.id)));
    // Pre-populate 4th subjects
    const fSub = getFourthSubject('hmath');
    fSub.chapters.forEach((ch) => ids.add(ch.id));
    // Pre-populate religion
    RELIGION_DATA.islam.chapters.forEach((ch) => ids.add(ch.id));
    return ids;
  });

  // Calculate dynamic sequence of subject checklists based on selected stream & religion
  const activeSequence = useMemo<WizardStepMeta[]>(() => {
    const steps: WizardStepMeta[] = [
      {
        id: 'step_mode',
        type: 'mode_selection',
        title: 'সিলেবাস তৈরির ধরণ নির্ধারণ (Step 0)',
        subtitle: 'বোর্ড স্ট্যান্ডার্ড স্বয়ংক্রিয় সিলেবাস নাকি কাস্টমাইজড সিলেবাস?',
        badge: 'ধাপ ০: সিলেবাস মোড',
      },
      {
        id: 'step_group',
        type: 'group',
        title: 'আপনার বিভাগ সিলেক্ট করুন (Step 1)',
        subtitle: 'বিজ্ঞান, মানবিক নাকি ব্যবসায় শিক্ষা? আপনার বিভাগ নির্বাচন করুন',
        badge: 'ধাপ ১: বিভাগ নির্বাচন',
      },
      {
        id: 'step_fourth_sub',
        type: 'fourth_subject',
        title: 'আপনার ৪র্থ বিষয় সিলেক্ট করুন (Step 2)',
        subtitle: 'উচ্চতর গণিত, জীববিজ্ঞান, কৃষি শিক্ষা বা গার্হস্থ্য বিজ্ঞান বেছে নিন',
        badge: 'ধাপ ২: ৪র্থ বিষয়',
      },
      {
        id: 'step_religion',
        type: 'religion',
        title: 'আপনার ধর্ম সিলেক্ট করুন (Step 3)',
        subtitle: 'ধর্ম ও নৈতিক শিক্ষার সঠিক পাঠ্যবই সিলেবাসে যুক্ত করতে নির্বাচন করুন',
        badge: 'ধাপ ৩: ধর্ম নির্বাচন',
      },
    ];

    // Compulsory Core Subjects (Applies to all)
    // 1. বাংলা ১ম পত্র
    const b1st = COMPULSORY_SUBJECTS.find((s) => s.id === 'b1st');
    if (b1st) {
      steps.push({
        id: 'step_b1st',
        type: 'subject_checklist',
        title: 'বাংলা ১ম পত্র (NCTB বোর্ড স্ট্যান্ডার্ড)',
        subtitle: '১৫টি গদ্য, ১৫টি পদ্য এবং উপন্যাস (কাকতাড়ুয়া) ও নাটক (বহিপীর)',
        badge: 'আবশ্যিক বিষয়',
        subject: b1st,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // 2. বাংলা ২য় পত্র
    const b2nd = COMPULSORY_SUBJECTS.find((s) => s.id === 'b2nd');
    if (b2nd) {
      steps.push({
        id: 'step_b2nd',
        type: 'subject_checklist',
        title: 'বাংলা ২য় পত্র (ব্যাকরণ ও নির্মিতি)',
        subtitle: 'ধ্বনিতত্ত্ব, সন্ধি, সমাস, কারক, বাক্য ও ভাবসম্প্রসারণ অধ্যায়সমূহ',
        badge: 'আবশ্যিক বিষয়',
        subject: b2nd,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // 3. ইংরেজি ১ম পত্র
    const eng1 = COMPULSORY_SUBJECTS.find((s) => s.id === 'eng1');
    if (eng1) {
      steps.push({
        id: 'step_eng1',
        type: 'subject_checklist',
        title: 'ইংরেজি ১ম পত্র (English 1st Paper)',
        subtitle: 'Unit 1 থেকে Unit 14 রিডিং কমপ্রিহেনশন ও প্যাসেজ তালিকা',
        badge: 'আবশ্যিক বিষয়',
        subject: eng1,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // 4. ইংরেজি ২য় পত্র
    const eng2 = COMPULSORY_SUBJECTS.find((s) => s.id === 'eng2');
    if (eng2) {
      steps.push({
        id: 'step_eng2',
        type: 'subject_checklist',
        title: 'ইংরেজি ২য় পত্র (English 2nd Paper)',
        subtitle: 'Grammar Rules, Verbs, Transformation, Connectors & Writing',
        badge: 'আবশ্যিক বিষয়',
        subject: eng2,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // 5. সাধারণ গণিত
    const gmath = COMPULSORY_SUBJECTS.find((s) => s.id === 'gmath');
    if (gmath) {
      steps.push({
        id: 'step_gmath',
        type: 'subject_checklist',
        title: 'সাধারণ গণিত (General Mathematics)',
        subtitle: 'বাস্তব সংখ্যা থেকে পরিসংখ্যান পর্যন্ত ১৭টি বোর্ড অধ্যায়',
        badge: 'আবশ্যিক বিষয়',
        subject: gmath,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // 6. তথ্য ও যোগাযোগ প্রযুক্তি (ICT)
    const ict = COMPULSORY_SUBJECTS.find((s) => s.id === 'ict');
    if (ict) {
      steps.push({
        id: 'step_ict',
        type: 'subject_checklist',
        title: 'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
        subtitle: 'কম্পিউটার নিরাপত্তা, ডিজিটাল কনটেন্ট, স্প্রেডশিট ও ডেটাবেজ',
        badge: 'আবশ্যিক বিষয়',
        subject: ict,
        groupCategory: 'আবশ্যিক বিষয়',
      });
    }

    // Group Subjects: Triggers sequentially based on chosen group
    if (selectedStream === 'science') {
      // Science Group: Physics -> Chemistry -> Biology / Higher Math -> 4th Subject -> Bangladesh & Global Studies
      const scienceList = STREAM_SUBJECTS.science || [];
      const phy = scienceList.find((s) => s.id === 'phy');
      const chem = scienceList.find((s) => s.id === 'chem');
      
      if (phy) {
        steps.push({
          id: 'step_phy',
          type: 'subject_checklist',
          title: 'পদার্থবিজ্ঞান (Physics)',
          subtitle: 'ভৌত রাশি, গতি, বল, কাজ-শক্তি ও বিদ্যুৎসহ ১৪টি অধ্যায়',
          badge: 'বিজ্ঞান গ্রুপ',
          subject: phy,
          groupCategory: 'বিজ্ঞান বিভাগ',
        });
      }

      if (chem) {
        steps.push({
          id: 'step_chem',
          type: 'subject_checklist',
          title: 'রসায়ন (Chemistry)',
          subtitle: 'পর্যায় সারণি, রাসায়নিক বন্ধন, জারণ-বিজারণ ও হাইড্রোকার্বন',
          badge: 'বিজ্ঞান গ্রুপ',
          subject: chem,
          groupCategory: 'বিজ্ঞান বিভাগ',
        });
      }

      // Main Science Subject (Biology or Higher Math based on 4th subject)
      if (fourthSubject === 'agri' || fourthSubject === 'homescience') {
        const bio = scienceList.find((s) => s.id === 'bio');
        const hmath = scienceList.find((s) => s.id === 'hmath');
        if (bio) {
          steps.push({
            id: 'step_bio',
            type: 'subject_checklist',
            title: 'জীববিজ্ঞান (Biology - আবশ্যিক গ্রুপ বিষয়)',
            subtitle: '১৪টি অধ্যায়ের সম্পূর্ণ প্রস্তুতি চেকলিস্ট',
            badge: 'বিজ্ঞান গ্রুপ',
            subject: bio,
            groupCategory: 'বিজ্ঞান বিভাগ',
          });
        }
        if (hmath) {
          steps.push({
            id: 'step_hmath',
            type: 'subject_checklist',
            title: 'উচ্চতর গণিত (Higher Math - আবশ্যিক গ্রুপ বিষয়)',
            subtitle: '১৪টি অধ্যায়ের সম্পূর্ণ প্রস্তুতি চেকলিস্ট',
            badge: 'বিজ্ঞান গ্রুপ',
            subject: hmath,
            groupCategory: 'বিজ্ঞান বিভাগ',
          });
        }
      } else {
        const mainSciSubId = fourthSubject === 'hmath' ? 'bio' : 'hmath';
        const mainSciSub = scienceList.find((s) => s.id === mainSciSubId) || scienceList.find((s) => s.id === 'bio');
        if (mainSciSub) {
          steps.push({
            id: 'step_main_sci',
            type: 'subject_checklist',
            title: `${mainSciSub.name} (আবশ্যিক গ্রুপ বিষয়)`,
            subtitle: `${mainSciSub.chapters.length}টি অধ্যায়ের সম্পূর্ণ প্রস্তুতি তালিকা`,
            badge: 'বিজ্ঞান গ্রুপ',
            subject: mainSciSub,
            groupCategory: 'বিজ্ঞান বিভাগ',
          });
        }
      }

      // 4th Subject Checklist (Higher Math, Biology, Agriculture, or Home Science)
      const fourthSubObj = getFourthSubject(fourthSubject);
      if (fourthSubObj) {
        steps.push({
          id: `step_fourth_${fourthSubObj.id}`,
          type: 'subject_checklist',
          title: `${fourthSubObj.name} (আপনার নির্বাচিত ৪র্থ বিষয়)`,
          subtitle: `${fourthSubObj.chapters.length}টি অধ্যায়ের ব্যক্তিগত প্রস্তুতি তালিকা`,
          badge: '৪র্থ বিষয়',
          subject: fourthSubObj,
          groupCategory: '৪র্থ বিষয়',
        });
      }

      // Bangladesh & Global Studies (Strictly Science Group Subject)
      const bgs = scienceList.find((s) => s.id === 'bgs');
      if (bgs) {
        steps.push({
          id: 'step_bgs',
          type: 'subject_checklist',
          title: 'বাংলাদেশ ও বিশ্বপরিচয় (BGS - বিজ্ঞান গ্রুপ)',
          subtitle: 'মুক্তিযুদ্ধ, সৌরজগৎ, বাংলাদেশের ভূপ্রকৃতি, সংবিধান ও অর্থনীতিসহ ১৬টি অধ্যায়',
          badge: 'বিজ্ঞান গ্রুপ বিষয়',
          subject: bgs,
          groupCategory: 'বিজ্ঞান বিভাগ (Strict)',
        });
      }
    } else if (selectedStream === 'humanities') {
      const humList = STREAM_SUBJECTS.humanities || [];
      humList.forEach((sub) => {
        steps.push({
          id: `step_${sub.id}`,
          type: 'subject_checklist',
          title: `${sub.name} (মানবিক বিভাগ)`,
          subtitle: `${sub.chapters.length}টি অধ্যায়ের প্রস্তুতি চেকলিস্ট`,
          badge: 'মানবিক বিভাগ',
          subject: sub,
          groupCategory: 'মানবিক বিভাগ',
        });
      });
    } else if (selectedStream === 'business') {
      const busList = STREAM_SUBJECTS.business || [];
      busList.forEach((sub) => {
        steps.push({
          id: `step_${sub.id}`,
          type: 'subject_checklist',
          title: `${sub.name} (ব্যবসায় শিক্ষা)`,
          subtitle: `${sub.chapters.length}টি অধ্যায়ের প্রস্তুতি চেকলিস্ট`,
          badge: 'ব্যবসায় শিক্ষা',
          subject: busList.find((s) => s.id === sub.id) || sub,
          groupCategory: 'ব্যবসায় শিক্ষা বিভাগ',
        });
      });
    }

    // Final Completion Step
    steps.push({
      id: 'step_completion',
      type: 'completion',
      title: 'অভিনন্দন! আপনার SSC ২০২৮ সিলেবাস প্রস্তুত',
      subtitle: 'আপনার নির্বাচিত বিভাগ, ৪র্থ বিষয় এবং পূর্ণাঙ্গ পাঠ্যতালিকা কনফিগার সম্পন্ন হয়েছে',
      badge: 'প্রস্তুতি সম্পন্ন',
    });

    return steps;
  }, [selectedStream, selectedReligion, fourthSubject]);

  // Ensure current step index is within bounds
  const clampedStepIndex = Math.min(currentStepIndex, activeSequence.length - 1);
  const currentStep = activeSequence[clampedStepIndex];
  const totalSteps = activeSequence.length;

  if (!isOpen) return null;

  // Toggle chapter in selected set
  const toggleChapter = (chapterId: string) => {
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  // Select all chapters of current subject
  const selectAllCurrentSubject = (subject?: Subject) => {
    if (!subject) return;
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      subject.chapters.forEach((c) => next.add(c.id));
      return next;
    });
  };

  // Deselect all chapters of current subject
  const deselectAllCurrentSubject = (subject?: Subject) => {
    if (!subject) return;
    setSelectedChapterIds((prev) => {
      const next = new Set(prev);
      subject.chapters.forEach((c) => next.delete(c.id));
      return next;
    });
  };

  const handleNext = () => {
    if (clampedStepIndex < totalSteps - 1) {
      setCurrentStepIndex(clampedStepIndex + 1);
    } else {
      // Final Complete Action
      handleFinishWizard(wizardMode);
    }
  };

  const handlePrev = () => {
    if (clampedStepIndex > 0) {
      setCurrentStepIndex(clampedStepIndex - 1);
    }
  };

  const handleFinishWizard = (path: 'standard' | 'custom' = 'standard') => {
    const relKey = mapProfileReligionToSubjectKey(selectedReligion);
    const groupMap: Record<StreamKey, string> = {
      science: 'বিজ্ঞান (Science)',
      business: 'ব্যবসায় শিক্ষা (Business Studies)',
      humanities: 'মানবিক (Humanities)',
    };

    let finalChapterIds: string[] | undefined;
    if (path === 'standard') {
      finalChapterIds = undefined; // undefined indicates standard / all chapters included
    } else {
      finalChapterIds = Array.from(selectedChapterIds);
    }

    onComplete({
      profile: {
        name: name.trim(),
        school: school.trim(),
        district: district.trim(),
        group: groupMap[selectedStream],
        religion: selectedReligion,
        sscBatch: batch,
      },
      stream: selectedStream,
      religion: relKey,
      fourthSubject,
      syllabusPath: path,
      customSelectedChapterIds: finalChapterIds,
    });
  };

  const currentFourthSubObj = FOURTH_SUBJECT_OPTIONS.find((opt) => opt.id === fourthSubject) || FOURTH_SUBJECT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0D111D]/90 backdrop-blur-xl overflow-y-auto transform-gpu font-hind text-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-3xl rounded-3xl bg-[#0D111D] border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col transform-gpu"
      >
        {/* Neon Accent Glow Top Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#5B50F6] via-[#10B981] to-cyan-400 shrink-0" />

        {/* Wizard Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#151C2C]/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B50F6]/20 to-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-lg shadow-emerald-950/40">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white font-jakarta tracking-wide">
                  SSC SYLLABUS SETUP WIZARD
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-anek flex items-center gap-1">
                  <Sparkle className="w-3 h-3 text-emerald-400" />
                  ধাপ {toBengaliNumber(clampedStepIndex + 1)} / {toBengaliNumber(totalSteps)}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-anek mt-0.5">
                {currentStep.title} — ব্যক্তিগত সিলেবাস কনফিগারেশন
              </p>
            </div>
          </div>

          {/* Stepper Dots & Close */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 max-w-[150px] overflow-x-auto py-1">
              {activeSequence.map((step, idx) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    clampedStepIndex === idx
                      ? 'w-5 bg-[#10B981] shadow-sm shadow-emerald-400/50'
                      : clampedStepIndex > idx
                      ? 'w-2 bg-[#5B50F6]'
                      : 'w-1.5 bg-slate-800'
                  }`}
                />
              ))}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-2"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Wizard Body with Smooth Slide Transition */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-[#0D111D] transform-gpu">
          <AnimatePresence mode="wait">
            {/* STEP 0: SYLLABUS CREATION MODE (BOARD STANDARD VS CUSTOM) */}
            {currentStep.type === 'mode_selection' && (
              <motion.div
                key="step-mode-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Compass className="w-4 h-4" />
                    <span>সিলেবাস কনফিগারেশন মোড নির্বাচন</span>
                  </div>
                  <p className="text-xs text-slate-300 font-anek leading-relaxed">
                    আপনার এসএসসি ২০২৮ প্রস্তুতির জন্য আপনি কোন ধরণের সিলেবাস সেটআপ পছন্দ করবেন তা নির্বাচন করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option A: Board Standard Syllabus (NCTB Auto-Setup) */}
                  <div className="p-5 rounded-3xl bg-gradient-to-b from-[#151C2C] to-[#0D111D] border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/50 relative overflow-hidden flex flex-col justify-between group hover:border-emerald-400 transition-all">
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold font-anek flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>সুপারিশকৃত • ১-ক্লিক</span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-950/60">
                        <Award className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white font-hind leading-snug">
                        বোর্ড স্ট্যান্ডার্ড সিলেবাস
                      </h4>
                      <p className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">
                        NCTB Auto-Setup (SSC 2028)
                      </p>
                      <p className="text-xs text-slate-300 mt-3 font-anek leading-relaxed">
                        NCTB ২০২৮ বোর্ড স্ট্যান্ডার্ড কারিকুলাম অনুযায়ী বাংলা, ইংরেজি, গণিত, বিজ্ঞান গ্রুপ, ৪র্থ বিষয় ও ধর্মসহ শতভাগ অধ্যায় এক ক্লিকে স্বয়ংক্রিয়ভাবে লোড হবে।
                      </p>
                      
                      <div className="mt-4 space-y-1.5 text-[11px] text-slate-400 font-anek">
                        <div className="flex items-center gap-1.5 text-emerald-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>সকল আবশ্যিক ও গ্রুপ বিষয় শতভাগ অন্তর্ভুক্ত</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>বাংলাদেশ ও বিশ্বপরিচয় (Strictly বিজ্ঞান গ্রুপ)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>তাৎক্ষণিক ড্যাশবোর্ড সক্রিয়করণ</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFinishWizard('standard')}
                      className="mt-6 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer font-anek transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                      <span>১-ক্লিকে বোর্ড সিলেবাস সেট করুন</span>
                    </button>
                  </div>

                  {/* Option B: Customized Syllabus (Custom Setup) */}
                  <div className="p-5 rounded-3xl bg-[#151C2C]/80 border border-white/15 hover:border-cyan-400/50 transition-all flex flex-col justify-between relative group">
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-anek">
                      <span>ব্যক্তিগত পছন্দ</span>
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-cyan-950/60">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-white font-hind leading-snug">
                        কাস্টমাইজড সিলেবাস
                      </h4>
                      <p className="text-[11px] text-cyan-400 font-mono font-bold mt-0.5">
                        Custom Step-by-Step Setup
                      </p>
                      <p className="text-xs text-slate-300 mt-3 font-anek leading-relaxed">
                        ধাপে ধাপে আপনার বিভাগ, ৪র্থ বিষয়, ধর্ম এবং অধ্যায়ভিত্তিক চেকলিস্ট কাস্টমাইজ করুন। আপনার পড়া অনুযায়ী অধ্যায় বাদ বা যোগ করার সুযোগ থাকবে।
                      </p>

                      <div className="mt-4 space-y-1.5 text-[11px] text-slate-400 font-anek">
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>বিভাগ ও ৪র্থ বিষয় বাছাইয়ের সুযোগ</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>অধ্যায়ভিত্তিক নির্বাচন ও বাদ দেওয়ার স্বাধীনতা</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>ব্যক্তিগত অধ্যয়ন পরিকল্পনা তৈরি</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setWizardMode('custom');
                        setCurrentStepIndex(1);
                      }}
                      className="mt-6 w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 hover:border-cyan-400/40 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer font-anek transition-all"
                    >
                      <span>কাস্টম উইজার্ড শুরু করুন</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 1: GROUP / STREAM SELECTION */}
            {currentStep.type === 'group' && (
              <motion.div
                key="step-group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <User className="w-4 h-4" />
                    <span>শিক্ষার্থীর প্রাথমিক তথ্য</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">আপনার নাম</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">বিদ্যালয়ের নাম</label>
                      <input
                        type="text"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="আপনার স্কুল"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">জেলা</label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="আপনার জেলা"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white font-jakarta flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>আপনার বিভাগ সিলেক্ট করুন (Select Your Stream)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STREAM_OPTIONS.map((opt) => {
                      const isSelected = selectedStream === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedStream(opt.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'bg-gradient-to-b from-[#151C2C] to-[#0D111D] border-[#10B981] shadow-lg shadow-emerald-950/50 ring-1 ring-[#10B981]'
                              : 'bg-[#151C2C]/70 border-white/10 hover:border-white/20 hover:bg-[#151C2C]'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-white font-anek">{opt.label}</div>
                            <div className="text-[11px] text-cyan-400 font-jakarta font-semibold mt-0.5">{opt.enLabel}</div>
                            <p className="text-xs text-slate-400 mt-2 font-anek leading-relaxed">{opt.desc}</p>
                          </div>
                          {opt.id === 'science' && (
                            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <span>✓ বাংলাদেশ ও বিশ্বপরিচয় অন্তর্ভুক্ত</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: 4TH SUBJECT SELECTION */}
            {currentStep.type === 'fourth_subject' && (
              <motion.div
                key="step-fourth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-[#151C2C] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                      {currentFourthSubObj.icon}
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-anek">নির্বাচিত ৪র্থ বিষয়</div>
                      <div className="text-sm font-bold text-white font-anek">
                        {currentFourthSubObj.label} ({toBengaliNumber(currentFourthSubObj.chaptersCount)}টি অধ্যায়)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    কোড: {currentFourthSubObj.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOURTH_SUBJECT_OPTIONS.map((opt) => {
                    const isSelected = fourthSubject === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setFourthSubject(opt.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-[#151C2C] border-[#10B981] ring-1 ring-[#10B981] shadow-lg shadow-emerald-950/40'
                            : 'bg-[#151C2C]/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-900 border border-white/10">
                            {opt.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-bold text-white font-anek">{opt.label}</h5>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-cyan-400 font-jakarta">{opt.enLabel}</div>
                            <p className="text-xs text-slate-400 mt-1 font-anek leading-tight">{opt.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: RELIGION SELECTION */}
            {currentStep.type === 'religion' && (
              <motion.div
                key="step-religion"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RELIGION_OPTIONS.map((opt) => {
                    const isSelected = selectedReligion === opt.bnLabel;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedReligion(opt.bnLabel)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#151C2C] border-[#10B981] ring-1 ring-[#10B981] shadow-lg shadow-emerald-950/40'
                            : 'bg-[#151C2C]/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 font-bold">
                            📖
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white font-anek">{opt.label}</div>
                            <div className="text-xs text-slate-400 font-jakarta">{opt.enLabel}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#10B981] text-slate-950 flex items-center justify-center text-xs font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4+: SUBJECT CHECKLIST STEPS */}
            {currentStep.type === 'subject_checklist' && currentStep.subject && (
              <motion.div
                key={`step-subject-${currentStep.subject.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Control bar for bulk select / stats */}
                <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-anek">
                      {currentStep.groupCategory || 'পাঠ্যবই'}
                    </span>
                    <span className="text-xs text-slate-300 font-anek">
                      মোট অধ্যায়: {toBengaliNumber(currentStep.subject.chapters.length)}টি | নির্বাচিত: {toBengaliNumber(
                        currentStep.subject.chapters.filter((c) => selectedChapterIds.has(c.id)).length
                      )}টি
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectAllCurrentSubject(currentStep.subject)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 font-anek"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>সব নির্বাচন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deselectAllCurrentSubject(currentStep.subject)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 font-anek"
                    >
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>ক্লিয়ার</span>
                    </button>
                  </div>
                </div>

                {/* Chapter items list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-1">
                  {currentStep.subject.chapters.map((ch, idx) => {
                    const isChecked = selectedChapterIds.has(ch.id);
                    return (
                      <div
                        key={ch.id}
                        onClick={() => toggleChapter(ch.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                          isChecked
                            ? 'bg-[#151C2C] border-[#10B981]/60 text-white shadow-sm shadow-emerald-950/30'
                            : 'bg-[#151C2C]/50 border-white/5 text-slate-400 hover:bg-[#151C2C]/80 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all ${
                              isChecked
                                ? 'bg-[#10B981] text-slate-950 font-bold'
                                : 'border border-slate-700 bg-slate-900 text-transparent'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="text-xs font-anek truncate">
                            {ch.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          #{toBengaliNumber(idx + 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP: COMPLETION SCREEN */}
            {currentStep.type === 'completion' && (
              <motion.div
                key="step-complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 text-center py-2"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#10B981]/20 to-[#5B50F6]/20 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981] shadow-xl shadow-emerald-950/50">
                  <BookmarkCheck className="w-8 h-8 text-emerald-400" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white font-jakarta">
                    SSC ২০২৮ সিলেবাস প্রোফাইল তৈরি সম্পূর্ণ!
                  </h4>
                  <p className="text-xs text-slate-300 font-anek max-w-md mx-auto mt-1">
                    আপনার নির্বাচিত বিষয় ও অধ্যায়সমূহের ওপর ভিত্তি করে লাইভ প্রোগ্রেস ও স্টাডি ট্র্যাকার কনফিগার করা হয়েছে।
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-white/10">
                    <div className="text-[10px] text-slate-400 font-anek">বিভাগ (Group)</div>
                    <div className="text-xs font-bold text-white font-anek mt-0.5">
                      {selectedStream === 'science' ? 'বিজ্ঞান' : selectedStream === 'business' ? 'ব্যবসায় শিক্ষা' : 'মানবিক'}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-white/10">
                    <div className="text-[10px] text-slate-400 font-anek">৪র্থ বিষয়</div>
                    <div className="text-xs font-bold text-purple-300 font-anek mt-0.5">
                      {currentFourthSubObj.label}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-white/10">
                    <div className="text-[10px] text-slate-400 font-anek">ধর্ম শিক্ষা</div>
                    <div className="text-xs font-bold text-emerald-300 font-anek mt-0.5">
                      {selectedReligion}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#151C2C] border border-white/10">
                    <div className="text-[10px] text-slate-400 font-anek">সিলেক্টেড অধ্যায়</div>
                    <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                      {toBengaliNumber(selectedChapterIds.size)}টি
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wizard Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#151C2C]/90 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={clampedStepIndex === 0}
            className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 font-anek ${
              clampedStepIndex === 0
                ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পূর্ববর্তী ধাপ</span>
          </button>

          <div className="text-xs text-slate-400 font-anek hidden sm:block">
            ধাপ {toBengaliNumber(clampedStepIndex + 1)} / {toBengaliNumber(totalSteps)}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#10B981] to-emerald-600 hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer font-anek"
          >
            {clampedStepIndex === totalSteps - 1 ? (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              </>
            ) : (
              <>
                <span>পরবর্তী ধাপ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
