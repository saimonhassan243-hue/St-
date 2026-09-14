/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BoardPredictionItem {
  id: string;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  subjectName: string;
  importancePercentage: number; // e.g. 96
  tier: 'super_hot' | 'high_priority' | 'moderate';
  isMustRead: boolean;
  repeatFrequency: string; // e.g. "গত ৫ বছরে ৪ বার এসেছে"
  recentBoardTags: string[]; // e.g. ["ঢাকা '২৪", "রাজশাহী '২৩", "চট্টগ্রাম '২২"]
  cqExpectedCount: string; // e.g. "১-২ টি নিশ্চিত CQ"
  mcqExpectedMarks: number; // e.g. 3-4
  topKeyTopics: string[];
  hotNotes: string;
}

export const BOARD_PREDICTIONS: BoardPredictionItem[] = [
  {
    id: 'pred_phy_motion',
    chapterId: 'ch_phy_2',
    chapterName: '২য় অধ্যায়: গতি (Motion)',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    importancePercentage: 98,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'প্রতি বছর ১০০% নিশ্চিত (১০/১০ বোর্ড)',
    recentBoardTags: ["ঢাকা '২৪", "রাজশাহী '২৩", "কুমিল্লা '২৪", "দিনাজপুর '২৩"],
    cqExpectedCount: '১ টি পূর্ণাঙ্গ CQ নিশ্চিত',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'গতির সমীকরণ (s = ut + ½at², v² = u² + 2as)',
      'পরন্ত বস্তু ও খাড়া নিক্ষিপ্ত বস্তুর গতি',
      'v-t বেগ-সময় লেখচিত্র থেকে মোট অতিক্রান্ত দূরত্ব'
    ],
    hotNotes: 'লেখচিত্র থেকে ক্ষেত্রফল নির্ণয়ের অঙ্ক এবং গাড়ি-পুলিশের চোর ধরার অঙ্ক বোর্ডে সবচেয়ে বেশি রিপিট হয়।'
  },
  {
    id: 'pred_phy_force',
    chapterId: 'ch_phy_3',
    chapterName: '৩য় অধ্যায়: বল (Force)',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    importancePercentage: 95,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'গত ৫ বছরে ৯ বার বিভিন্ন বোর্ডে এসেছে',
    recentBoardTags: ["ঢাকা '২৩", "যশোর '২৪", "চট্টগ্রাম '২৪", "সিলেট '২৩"],
    cqExpectedCount: '১ টি নিশ্চিত CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'ভরবেগের সংরক্ষণ সূত্র ও শক্তির সংরক্ষণশীলতা',
      'ঘর্ষণ বল ও ত্বরণ নির্ণয় (F - fk = ma)',
      'নিউটনের ২য় ও ৩য় সূত্রভিত্তিক গাণিতিক সমস্যা'
    ],
    hotNotes: 'বন্দুক-গুলির পশ্চাৎবেগ এবং দুটি গাড়ির সংঘর্ষে মিলিত বেগ নির্ণয় বোর্ড পরীক্ষার হট প্যাটার্ন।'
  },
  {
    id: 'pred_phy_work_power',
    chapterId: 'ch_phy_4',
    chapterName: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    importancePercentage: 96,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'প্রতি বছর ৯৫% সম্ভাবনা',
    recentBoardTags: ["ঢাকা '২৪", "ময়মনসিংহ '২৩", "কুমিল্লা '২৩", "রাজশাহী '২৪"],
    cqExpectedCount: '১ টি নিশ্চিত CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'কর্মদক্ষতা (Efficiency η = P_out / P_in × 100%)',
      'মুক্তভাবে পরন্ত বস্তুর বিভিন্ন বিন্দুতে মোট শক্তির নিত্যতা',
      'পানির পাম্পের কার্যকর ক্ষমতা ও কৃতকাজ'
    ],
    hotNotes: 'পাম্পের ক্ষমতা নষ্ট হওয়া বা কর্মদক্ষতা বৃদ্ধি সম্পর্কিত গ/ঘ প্রশ্ন নিশ্চিত কমন থাকে।'
  },
  {
    id: 'pred_chem_structure',
    chapterId: 'ch_chem_3',
    chapterName: '৩য় অধ্যায়: পদার্থের গঠন',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    importancePercentage: 94,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'প্রতি বছর ১০০% নিশ্চিত (৯/৯ বোর্ড)',
    recentBoardTags: ["ঢাকা '২৪", "চট্টগ্রাম '২৩", "রাজশাহী '২৪", "বরিশাল '২৩"],
    cqExpectedCount: '১ টি পূর্ণাঙ্গ CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'বোর পরমাণু মডেল ও রাদারফোর্ড মডেলের সীমাবদ্ধতা',
      'ইলেকট্রন বিন্যাসের ব্যতিক্রম (Cr, Cu) ও 2n² নিয়ম',
      'আইসোটোপের শতকরা প্রাচুর্য থেকে আপেক্ষিক পারমাণবিক ভর'
    ],
    hotNotes: 'আইসোটোপ ও ক্রোমিয়াম/কপারের ব্যতিক্রমী ইলেকট্রন বিন্যাস অনুধাবন ও প্রয়োগে নিশ্চিত আসে।'
  },
  {
    id: 'pred_chem_periodic',
    chapterId: 'ch_chem_4',
    chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    importancePercentage: 97,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'সব বোর্ডে প্রতি বছর প্রশ্ন থাকে',
    recentBoardTags: ["ঢাকা '২৪", "যশোর '২৩", "দিনাজপুর '২৪", "কুমিল্লা '২৩"],
    cqExpectedCount: '১-২ টি CQ',
    mcqExpectedMarks: 4,
    topKeyTopics: [
      'পর্যায়বৃত্ত ধর্ম (আয়নাকরণ শক্তি, পারমাণবিক আকার, তড়িৎ ঋণাত্মকতা)',
      'মৌলের অবস্থান নির্ণয় (গ্রুপ ও পর্যায়)',
      'পর্যায়ে ও গ্রুপে আয়নিকরণ শক্তির ব্যতিক্রম (Be vs B, N vs O)'
    ],
    hotNotes: 'কাল্পনিক প্রতীক X, Y, Z দিয়ে পর্যায়বৃত্ত ধর্মের ক্রম ব্যাখ্যা করার ঘ-নম্বর প্রশ্ন সবচেয়ে গুরুত্বপূর্ণ।'
  },
  {
    id: 'pred_chem_bonding',
    chapterId: 'ch_chem_5',
    chapterName: '৫ম অধ্যায়: রাসায়নিক বন্ধন',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    importancePercentage: 96,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'গত ৬ বছরে শতভাগ রিপিটেশন',
    recentBoardTags: ["ঢাকা '২৩", "রাজশাহী '২৪", "চট্টগ্রাম '২৪", "সিলেট '২৩"],
    cqExpectedCount: '১ টি নিশ্চিত CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'আয়নিক ও সমযোজী বন্ধন গঠন চিত্রসহ ব্যাখ্যা',
      'যৌগের পানিতে দ্রবণীয়তা ও বিদ্যুৎ পরিবাহিতা',
      'মুক্তজোড় ও বন্ধনজোড় ইলেকট্রন গণনা'
    ],
    hotNotes: 'যৌগের কেলাস গঠন ও গলনাঙ্ক-স্ফুটনাঙ্ক উচ্চ হওয়ার কারণ ঘ নম্বরে নিয়মিত আসে।'
  },
  {
    id: 'pred_math_algebraic',
    chapterId: 'ch_math_3',
    chapterName: '৩য় অধ্যায়: বীজগাণিতিক রাশি',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    importancePercentage: 99,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'ক বিভাগ থেকে ১টি প্রশ্ন ১০০% বাধ্যতামূলক কমন',
    recentBoardTags: ["ঢাকা '২৪", "রাজশাহী '২৪", "চট্টগ্রাম '২৩", "কুমিল্লা '২৪"],
    cqExpectedCount: '১ টি নিশ্চিত CQ (১০ মার্কস)',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'x + 1/x মান থেকে x⁵ + 1/x⁵ ও x⁶ - 1/x⁶ এর মান নির্ণয়',
      'বর্গ ও ঘন সংবলিত সূত্রাবলির প্রমাণ ও মান নির্ণয়',
      'উৎপাদকে বিশ্লেষণ (ভাগশেষ উপপাদ্য)'
    ],
    hotNotes: 'x² = 3 + 2√2 উদ্দীপক দিয়ে x⁴ + 1/x⁴ ও x⁵ - 1/x⁵ নির্ণয় বোর্ড পরীক্ষার সার্বজনীন প্রশ্ন।'
  },
  {
    id: 'pred_math_circle',
    chapterId: 'ch_math_8',
    chapterName: '৮ম অধ্যায়: বৃত্ত (Circle)',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    importancePercentage: 95,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'জ্যামিতি বিভাগ থেকে ১টি পূর্ণাঙ্গ CQ নিশ্চিত',
    recentBoardTags: ["ঢাকা '২৪", "যশোর '২৩", "বরিশাল '২৪", "দিনাজপুর '২৩"],
    cqExpectedCount: '১ টি নিশ্চিত CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'উপপাদ্য ২০: বৃত্তের একই চাপের উপর দণ্ডায়মান কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ',
      'উপপাদ্য ২৩: বৃত্তে অন্তর্লিখিত চতুর্ভুজের বিপরীত কোণদ্বয়ের সমষ্টি দুই সমকোণ',
      'সম্পাদ্য: পরিবৃত্ত ও অন্তর্বৃত্ত অঙ্কন'
    ],
    hotNotes: 'উপপাদ্য ২০ ও ২৩ এবং পরিবৃত্ত অঙ্কনের বিবরণ প্রতি বছর কোনো না কোনো বোর্ডে অবধারিত আসে।'
  },
  {
    id: 'pred_math_trig',
    chapterId: 'ch_math_9',
    chapterName: '৯ম অধ্যায়: ত্রিকোণমিতিক অনুপাত',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    importancePercentage: 97,
    tier: 'super_hot',
    isMustRead: true,
    repeatFrequency: 'গ বিভাগ (ত্রিকোণমিতি) থেকে ১টি CQ বাধ্যতামূলক',
    recentBoardTags: ["ঢাকা '২৪", "রাজশাহী '২৩", "চট্টগ্রাম '২৪", "ময়মনসিংহ '২৩"],
    cqExpectedCount: '১ টি নিশ্চিত CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'ত্রিকোণমিতিক অভেদাবলি প্রমাণ (tanθ + secθ = x হলে sinθ = ?)',
      'মান নির্ণয় ও সমীকরণ সমাধান (0° ≤ θ ≤ 90°)',
      'দূরত্ব ও উচ্চতা (১০ম অধ্যায় সমন্বিত সমস্যা)'
    ],
    hotNotes: 'tanA + sinA = m, tanA - sinA = n হলে m² - n² = 4√(mn) প্রমাণ প্রায় প্রতিটি বোর্ডের সুপার ফেভারিট।'
  },
  {
    id: 'pred_hmath_vector',
    chapterId: 'ch_hmath_12',
    chapterName: '১২শ অধ্যায়: সমতলীয় ভেক্টর',
    subjectId: 'hmath',
    subjectName: 'উচ্চতর গণিত',
    importancePercentage: 92,
    tier: 'super_hot',
    isMustRead: true,
    recentBoardTags: ["ঢাকা '২৪", "চট্টগ্রাম '২৩", "রাজশাহী '২৪"],
    repeatFrequency: 'জ্যামিতি অংশে ১টি নিশ্চিত ৫/১০ নম্বরের প্রশ্ন',
    cqExpectedCount: '১ টি CQ',
    mcqExpectedMarks: 2,
    topKeyTopics: [
      'ভেক্টরের সাহায্যে সামান্তরিক ও ট্রাপিজিয়ামের উপপাদ্য প্রমাণ',
      'অবস্থান ভেক্টর ও বিভাজন বিন্দুর ভেক্টর রূপ'
    ],
    hotNotes: 'ভেক্টর পদ্ধতিতে ত্রিভুজের মধ্যমাত্রয় সমবিন্দু প্রমাণ প্রায় বিকল্পহীন।'
  },
  {
    id: 'pred_bio_cell',
    chapterId: 'ch_bio_2',
    chapterName: '২য় অধ্যায়: জীবকোষ ও টিস্যু',
    subjectId: 'bio',
    subjectName: 'জীববিজ্ঞান',
    importancePercentage: 95,
    tier: 'super_hot',
    isMustRead: true,
    recentBoardTags: ["ঢাকা '২৪", "যশোর '২৩", "কুমিল্লা '২৪"],
    repeatFrequency: 'প্রতি বছর নিশ্চিত ১টি CQ',
    cqExpectedCount: '১ টি CQ',
    mcqExpectedMarks: 3,
    topKeyTopics: [
      'মাইটোকন্ড্রিয়া ও প্লাস্টিডের চিহ্নিত চিত্র ও কাজ',
      'উদ্ভিদ টিস্যু (জাইলেম ও ফ্লোয়েম নালিকা বান্ডল)',
      'প্রাণী টিস্যু (স্নায়ুটিস্যু ও নিউরনের গঠন)'
    ],
    hotNotes: 'মাইটোকন্ড্রিয়াকে কেন পাওয়ার হাউস বলা হয় এবং প্লাস্টিডের গঠন চিহ্নিত চিত্রসহ প্রায়ই আসে।'
  },
  {
    id: 'pred_ict_security',
    chapterId: 'ch_ict_3',
    chapterName: '৩য় অধ্যায়: আমার শিক্ষায় ইন্টারনেট ও ডিজিটাল নিরাপত্তা',
    subjectId: 'ict',
    subjectName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    importancePercentage: 94,
    tier: 'super_hot',
    isMustRead: true,
    recentBoardTags: ["সকল বোর্ড '২৪", "সকল বোর্ড '২৩"],
    repeatFrequency: 'এমসিকিউ ৫-৬টি প্রশ্ন নিশ্চিত',
    cqExpectedCount: 'MCQ স্পেশাল (২৫ এ ২৫)',
    mcqExpectedMarks: 6,
    topKeyTopics: [
      'ডিজিটাল নিরাপত্তা আইন ও কপিরাইট',
      'পাসওয়ার্ডের নিরাপত্তা ও টু-স্টেপ ভেরিফিকেশন',
      'কম্পিউটার ভাইরাস, ট্রোজান হর্স ও অ্যান্টিভাইরাস'
    ],
    hotNotes: 'ইন্টারনেটের নিরাপদ ব্যবহার ও ই-বুকের প্রকারভেদ থেকে ২-৩টি প্রশ্ন অবধারিত।'
  }
];

export function getPredictionForChapter(chapterNameOrId: string): BoardPredictionItem | undefined {
  return BOARD_PREDICTIONS.find(p => 
    p.chapterId === chapterNameOrId || 
    p.chapterName.toLowerCase().includes(chapterNameOrId.toLowerCase()) ||
    chapterNameOrId.toLowerCase().includes(p.chapterName.toLowerCase())
  );
}
