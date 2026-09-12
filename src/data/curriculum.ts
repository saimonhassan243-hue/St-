import { Subject, ReligionKey, ReligionBn, Suggestion, FourthSubjectKey } from '../types';
import sscDataRaw from './ssc_curriculum_data.json';
import sscScienceDataRaw from './ssc_science_group_data.json';
import sscBusinessStudiesDataRaw from './ssc_business_studies_data.json';
import sscHumanitiesDataRaw from './ssc_humanities_group_data.json';
import sscFourthSubjectsRaw from './ssc_fourth_subjects_data.json';

export const SSC_CURRICULUM_STORE = sscDataRaw;
export const SSC_SCIENCE_GROUP_STORE = sscScienceDataRaw;
export const SSC_BUSINESS_STUDIES_STORE = sscBusinessStudiesDataRaw;
export const SSC_HUMANITIES_STORE = sscHumanitiesDataRaw;
export const SSC_FOURTH_SUBJECTS_STORE = sscFourthSubjectsRaw;

export const RELIGION_DATA: Record<string, Subject> = {
  islam: {
    id: sscDataRaw.religionSubjects.islam.id,
    name: sscDataRaw.religionSubjects.islam.name,
    chapters: sscDataRaw.religionSubjects.islam.chapters,
    suggestions: sscDataRaw.religionSubjects.islam.suggestions as Suggestion[],
  },
  hindu: {
    id: sscDataRaw.religionSubjects.hindu.id,
    name: sscDataRaw.religionSubjects.hindu.name,
    chapters: sscDataRaw.religionSubjects.hindu.chapters,
    suggestions: sscDataRaw.religionSubjects.hindu.suggestions as Suggestion[],
  },
  hinduism: {
    id: sscDataRaw.religionSubjects.hindu.id,
    name: sscDataRaw.religionSubjects.hindu.name,
    chapters: sscDataRaw.religionSubjects.hindu.chapters,
    suggestions: sscDataRaw.religionSubjects.hindu.suggestions as Suggestion[],
  },
  buddhist: {
    id: sscDataRaw.religionSubjects.buddhist.id,
    name: sscDataRaw.religionSubjects.buddhist.name,
    chapters: sscDataRaw.religionSubjects.buddhist.chapters,
    suggestions: sscDataRaw.religionSubjects.buddhist.suggestions as Suggestion[],
  },
  christian: {
    id: sscDataRaw.religionSubjects.christian.id,
    name: sscDataRaw.religionSubjects.christian.name,
    chapters: sscDataRaw.religionSubjects.christian.chapters,
    suggestions: sscDataRaw.religionSubjects.christian.suggestions as Suggestion[],
  },
};

export const COMPULSORY_SUBJECTS: Subject[] = sscDataRaw.compulsorySubjects.map((sub) => ({
  id: sub.id,
  name: sub.name,
  chapters: sub.chapters,
  suggestions: (sub.suggestions || []) as Suggestion[],
}));


export const STREAM_SUBJECTS: Record<string, Subject[]> = {
  science: sscScienceDataRaw.subjects.map((sub) => ({
    id: sub.id,
    name: sub.name,
    chapters: sub.chapters,
    suggestions: (sub.suggestions || []) as Suggestion[],
  })),
  business: sscBusinessStudiesDataRaw.subjects.map((sub) => ({
    id: sub.id,
    name: sub.name,
    chapters: sub.chapters,
    suggestions: (sub.suggestions || []) as Suggestion[],
  })),
  humanities: sscHumanitiesDataRaw.subjects.map((sub) => ({
    id: sub.id,
    name: sub.name,
    chapters: sub.chapters,
    suggestions: (sub.suggestions || []) as Suggestion[],
  })),
};

export const STREAM_OPTIONS: { id: 'science' | 'business' | 'humanities'; label: string; enLabel: string; desc: string }[] = [
  { id: 'science', label: 'বিজ্ঞান বিভাগ', enLabel: 'Science', desc: 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান, উচ্চতর গণিত' },
  { id: 'business', label: 'ব্যবসায় শিক্ষা', enLabel: 'Business Studies', desc: 'হিসাববিজ্ঞান, ফিন্যান্স ও ব্যাংকিং, ব্যবসায় উদ্যোগ' },
  { id: 'humanities', label: 'মানবিক বিভাগ', enLabel: 'Humanities', desc: 'ইতিহাস ও বিশ্বসভ্যতা, ভূগোল ও পরিবেশ, অর্থনীতি, পৌরনীতি' }
];

export const FOURTH_SUBJECT_OPTIONS: {
  id: FourthSubjectKey;
  label: string;
  enLabel: string;
  chaptersCount: number;
  desc: string;
  icon: string;
  code: string;
}[] = [
  {
    id: 'hmath',
    label: 'উচ্চতর গণিত',
    enLabel: 'Higher Math',
    chaptersCount: 14,
    desc: '১৪টি অধ্যায় (সেট, বীজগণিত, জ্যামিতি, ত্রিকোণমিতি, স্থানাঙ্ক)',
    icon: '📐',
    code: '126'
  },
  {
    id: 'biology',
    label: 'জীববিজ্ঞান',
    enLabel: 'Biology',
    chaptersCount: 14,
    desc: '১৪টি অধ্যায় (কোষ, জীবনীশক্তি, হৃদপিণ্ড, বংশগতি, বিবর্তন)',
    icon: '🧬',
    code: '138'
  },
  {
    id: 'agri',
    label: 'কৃষি শিক্ষা',
    enLabel: 'Agriculture Studies',
    chaptersCount: 6,
    desc: '১ম থেকে ৬ষ্ঠ অধ্যায় (প্রযুক্তি, উপকরণ, জলবায়ু, উৎপাদন, বন)',
    icon: '🌾',
    code: '134'
  },
  {
    id: 'homescience',
    label: 'গার্হস্থ্য বিজ্ঞান',
    enLabel: 'Home Science',
    chaptersCount: 18,
    desc: '১ম থেকে ১৮শ অধ্যায় (গৃহ ব্যবস্থাপনা, শিশু বিকাশ, পুষ্টি, বস্ত্র)',
    icon: '🏡',
    code: '151'
  }
];

export function getFourthSubject(key?: FourthSubjectKey | string): Subject {
  const found = sscFourthSubjectsRaw.subjects.find((s) => s.key === key);
  if (found) {
    return {
      id: found.id,
      name: found.name,
      chapters: found.chapters,
      suggestions: (found.suggestions || []) as Suggestion[],
    };
  }
  // Fallback default: Higher Math
  const defaultSub = sscFourthSubjectsRaw.subjects[0];
  return {
    id: defaultSub.id,
    name: defaultSub.name,
    chapters: defaultSub.chapters,
    suggestions: (defaultSub.suggestions || []) as Suggestion[],
  };
}

export const RELIGION_OPTIONS: { id: ReligionKey; label: string; bnLabel: ReligionBn; enLabel: string }[] = [
  { id: 'islam', label: 'ইসলাম ও নৈতিক শিক্ষা', bnLabel: 'ইসলাম', enLabel: 'Islam' },
  { id: 'hindu', label: 'হিন্দুধর্ম ও নৈতিক শিক্ষা', bnLabel: 'হিন্দু', enLabel: 'Hinduism' },
  { id: 'buddhist', label: 'বৌদ্ধধর্ম ও নৈতিক শিক্ষা', bnLabel: 'বৌদ্ধ', enLabel: 'Buddhism' },
  { id: 'christian', label: 'খ্রিস্টধর্ম ও নৈতিক শিক্ষা', bnLabel: 'খ্রিস্টান', enLabel: 'Christianity' }
];

/**
 * Maps student profile religion string ('ইসলাম', 'হিন্দু', 'বৌদ্ধ', 'খ্রিস্টান')
 * to its corresponding curriculum subject key.
 */
export function mapProfileReligionToSubjectKey(profileReligion?: string | null): ReligionKey {
  if (!profileReligion) return 'islam';
  const trimmed = profileReligion.trim();
  
  if (trimmed === 'ইসলাম' || trimmed.toLowerCase() === 'islam') return 'islam';
  if (trimmed === 'হিন্দু' || trimmed === 'হিন্দুধর্ম' || trimmed.toLowerCase().includes('hindu')) return 'hindu';
  if (trimmed === 'বৌদ্ধ' || trimmed === 'বৌদ্ধধর্ম' || trimmed.toLowerCase().includes('buddhis')) return 'buddhist';
  if (trimmed === 'খ্রিস্টান' || trimmed === 'খ্রিষ্টান' || trimmed === 'খ্রিস্টধর্ম' || trimmed.toLowerCase().includes('christ')) return 'christian';
  
  return 'islam'; // Safe default fallback
}

/**
 * Maps curriculum subject key ('islam', 'hindu', 'buddhist', 'christian')
 * to student profile religion value ('ইসলাম', 'হিন্দু', 'বৌদ্ধ', 'খ্রিস্টান').
 */
export function mapSubjectKeyToProfileReligion(key: ReligionKey | string): ReligionBn {
  switch (key) {
    case 'islam':
      return 'ইসলাম';
    case 'hindu':
    case 'hinduism':
      return 'হিন্দু';
    case 'buddhist':
      return 'বৌদ্ধ';
    case 'christian':
      return 'খ্রিস্টান';
    default:
      return 'ইসলাম';
  }
}
