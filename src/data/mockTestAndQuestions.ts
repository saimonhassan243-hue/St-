/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface McqQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  boardSource: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CqSubQuestion {
  label: 'ক' | 'খ' | 'গ' | 'ঘ';
  marks: number;
  type: 'জ্ঞানমূলক' | 'অনুধাবনমূলক' | 'প্রয়োগমূলক' | 'উচ্চতর দক্ষতামূলক';
  question: string;
  modelAnswer: string;
  keyPoints: string[];
}

export interface CqQuestion {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  stem: string; // উদ্দীপক
  stemDiagramUrl?: string;
  subQuestions: CqSubQuestion[];
  boardSource: string;
}

export const SAMPLE_MCQ_QUESTIONS: McqQuestion[] = [
  // Physics
  {
    id: 'mcq_phy_1',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterId: 'ch_phy_2',
    chapterName: '২য় অধ্যায়: গতি',
    question: 'একটি গাড়ি স্থির অবস্থান থেকে 2 m/s² সুষম ত্বরণে চলা শুরু করলে 5 সেকেন্ড পর গাড়িটির শেষবেগ কত হবে?',
    options: ['5 m/s', '10 m/s', '20 m/s', '25 m/s'],
    correctIndex: 1,
    explanation: 'v = u + at = 0 + (2 × 5) = 10 m/s.',
    boardSource: "ঢাকা বোর্ড ২০২৩",
    difficulty: 'Easy'
  },
  {
    id: 'mcq_phy_2',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterId: 'ch_phy_2',
    chapterName: '২য় অধ্যায়: গতি',
    question: 'খাড়া উপরের দিকে নিক্ষিপ্ত বস্তুর সর্বোচ্চ উচ্চতায় বেগ (v) কত হয়?',
    options: ['9.8 m/s', '0 m/s', '4.9 m/s', 'অসীম'],
    correctIndex: 1,
    explanation: 'সর্বোচ্চ উচ্চতায় পৌঁছানোর মুহূর্তে বস্তুটি ক্ষণিকের জন্য স্থির হয়, তাই v = 0 m/s.',
    boardSource: "রাজশাহী বোর্ড ২০২৪",
    difficulty: 'Easy'
  },
  {
    id: 'mcq_phy_3',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterId: 'ch_phy_4',
    chapterName: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি',
    question: 'একটি মোটরের প্রদত্ত ক্ষমতা 1000 W এবং কার্যকর ক্ষমতা 800 W হলে কর্মদক্ষতা কত?',
    options: ['60%', '75%', '80%', '85%'],
    correctIndex: 2,
    explanation: 'কর্মদক্ষতা η = (P_out / P_in) × 100% = (800 / 1000) × 100% = 80%.',
    boardSource: "চট্টগ্রাম বোর্ড ২০২৪",
    difficulty: 'Medium'
  },
  {
    id: 'mcq_phy_4',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterId: 'ch_phy_3',
    chapterName: '৩য় অধ্যায়: বল',
    question: '10 kg ভরের একটি বস্তুর উপর 50 N বল প্রয়োগ করলে ত্বরণ কত হবে?',
    options: ['0.2 m/s²', '5 m/s²', '50 m/s²', '500 m/s²'],
    correctIndex: 1,
    explanation: 'F = ma => a = F / m = 50 / 10 = 5 m/s².',
    boardSource: "কুমিল্লা বোর্ড ২০২৩",
    difficulty: 'Easy'
  },

  // Chemistry
  {
    id: 'mcq_chem_1',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterId: 'ch_chem_3',
    chapterName: '৩য় অধ্যায়: পদার্থের গঠন',
    question: 'ক্রোমিয়ামের (Cr, পারমাণবিক সংখ্যা ২৪) সঠিক ইলেকট্রন বিন্যাস কোনটি?',
    options: [
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁴ 4s²',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s⁰',
      '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴'
    ],
    correctIndex: 1,
    explanation: 'অর্ধপূর্ণ (d⁵) অরবিটালের অধিক স্থিতিশীলতার জন্য ক্রোমিয়ামের ৪s অরবিটাল থেকে ১টি ইলেকট্রন ৩d অরবিটালে প্রবেশ করে।',
    boardSource: "সকল বোর্ড ২০২৪",
    difficulty: 'Medium'
  },
  {
    id: 'mcq_chem_2',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterId: 'ch_chem_4',
    chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি',
    question: 'পর্যায় সারণির একই পর্যায়ের বাম থেকে ডানে গেলে পারমাণবিক ব্যাসার্ধের কী পরিবর্তন হয়?',
    options: ['হ্রাস পায়', 'বৃদ্ধি পায়', 'অপরিবর্তিত থাকে', 'প্রথমে কমে পরে বাড়ে'],
    correctIndex: 0,
    explanation: 'একই পর্যায়ে বাম থেকে ডানে প্রোটন সংখ্যা বৃদ্ধি পাওয়ায় নিউক্লিয়াসের আকর্ষণ শক্তি বৃদ্ধি পায়, ফলে আকার বা ব্যাসার্ধ হ্রাস পায়।',
    boardSource: "যশোর বোর্ড ২০২৩",
    difficulty: 'Easy'
  },
  {
    id: 'mcq_chem_3',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterId: 'ch_chem_5',
    chapterName: '৫ম অধ্যায়: রাসায়নিক বন্ধন',
    question: 'নিচের কোন যৌগে সমযোজী বন্ধন বিদ্যমান?',
    options: ['NaCl', 'CaO', 'CH₄', 'MgCl₂'],
    correctIndex: 2,
    explanation: 'CH₄ (মিথেন) এ দুটি অধাতু কার্বন ও হাইড্রোজেনের মধ্যে ইলেকট্রন শেয়ারের মাধ্যমে সমযোজী বন্ধন গঠিত হয়।',
    boardSource: "দিনাজপুর বোর্ড ২০২৪",
    difficulty: 'Easy'
  },

  // General Math
  {
    id: 'mcq_math_1',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    chapterId: 'ch_math_3',
    chapterName: '৩য় অধ্যায়: বীজগাণিতিক রাশি',
    question: 'x + 1/x = 3 হলে x² + 1/x² এর মান কত?',
    options: ['5', '7', '9', '11'],
    correctIndex: 1,
    explanation: 'x² + 1/x² = (x + 1/x)² - 2 = 3² - 2 = 9 - 2 = 7.',
    boardSource: "ঢাকা বোর্ড ২০২৪",
    difficulty: 'Easy'
  },
  {
    id: 'mcq_math_2',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    chapterId: 'ch_math_9',
    chapterName: '৯ম অধ্যায়: ত্রিকোণমিতিক অনুপাত',
    question: 'sin 30° + cos 60° এর মান কত?',
    options: ['0', '1/2', '1', '√3/2'],
    correctIndex: 2,
    explanation: 'sin 30° = 1/2 এবং cos 60° = 1/2. সুতরাং 1/2 + 1/2 = 1.',
    boardSource: "বরিশাল বোর্ড ২০২৪",
    difficulty: 'Easy'
  },
  {
    id: 'mcq_math_3',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    chapterId: 'ch_math_8',
    chapterName: '৮ম অধ্যায়: বৃত্ত',
    question: 'অর্ধবৃত্তস্থ কোণ কত ডিগ্রী?',
    options: ['45°', '60°', '90°', '180°'],
    correctIndex: 2,
    explanation: 'উপপাদ্য অনুযায়ী অর্ধবৃত্তস্থ কোণ এক সমকোণ বা 90°।',
    boardSource: "রাজশাহী বোর্ড ২০২৩",
    difficulty: 'Easy'
  },

  // Higher Math
  {
    id: 'mcq_hmath_1',
    subjectId: 'hmath',
    subjectName: 'উচ্চতর গণিত',
    chapterId: 'ch_hmath_12',
    chapterName: '১২শ অধ্যায়: সমতলীয় ভেক্টর',
    question: 'দুটি সমান ও বিপরীতমুখী ভেক্টরের লব্ধি কী হবে?',
    options: ['একক ভেক্টর', 'শূন্য ভেক্টর', 'অবস্থান ভেক্টর', 'স্বাধীন ভেক্টর'],
    correctIndex: 1,
    explanation: 'সমান মান কিন্তু পরস্পর বিপরীতমুখী দুটি ভেক্টরের যোগফল শূন্য ভেক্টর (Null vector) হয়।',
    boardSource: "ঢাকা বোর্ড ২০২৩",
    difficulty: 'Easy'
  },

  // Biology
  {
    id: 'mcq_bio_1',
    subjectId: 'bio',
    subjectName: 'জীববিজ্ঞান',
    chapterId: 'ch_bio_2',
    chapterName: '২য় অধ্যায়: জীবকোষ ও টিস্যু',
    question: 'কোষের শক্তিঘর (Power House of Cell) কাকে বলা হয়?',
    options: ['গলজি বস্তু', 'রাইবোসোম', 'মাইটোকন্ড্রিয়া', 'লাইসোজোম'],
    correctIndex: 2,
    explanation: 'শ্বসনের ধাপসমূহ সম্পন্ন করে ATP উৎপন্ন করায় মাইটোকন্ড্রিয়াকে পাওয়ার হাউস বলা হয়।',
    boardSource: "ময়মনসিংহ বোর্ড ২০২৪",
    difficulty: 'Easy'
  },

  // ICT
  {
    id: 'mcq_ict_1',
    subjectId: 'ict',
    subjectName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    chapterId: 'ch_ict_3',
    chapterName: '৩য় অধ্যায়: ডিজিটাল নিরাপত্তা',
    question: 'নিরাপদ পাসওয়ার্ড তৈরির জন্য ন্যূনতম কী ধরনের অক্ষর সংমিশ্রণ জরুরি?',
    options: [
      'শুধু নিজের মোবাইল নম্বর',
      'শুধু ছোট হাতের ইংরেজি বর্ণ',
      'বড় ও ছোট হাতের অক্ষর, সংখ্যা এবং বিশেষ চিহ্ন (#, $, % ইত্যাদি)',
      'শুধু জন্মতারিখ ও নাম'
    ],
    correctIndex: 2,
    explanation: 'জটিল ও নিরাপদ পাসওয়ার্ড তৈরি করতে ক্যাপিটাল লেটার, স্মল লেটার, ডিজিট ও স্পেশাল ক্যারেক্টারের মিশ্রণ ব্যবহার করা উচিত।',
    boardSource: "সকল বোর্ড ২০২৩",
    difficulty: 'Easy'
  }
];

export const SAMPLE_CQ_QUESTIONS: CqQuestion[] = [
  {
    id: 'cq_phy_motion_1',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterId: 'ch_phy_2',
    chapterName: '২য় অধ্যায়: গতি (Motion)',
    stem: 'একটি ৮০০ কেজি ভরের স্থির গাড়ি ২০ সেকেন্ডে সুষম ত্বরণে চলার পর ৬০ কিমি/ঘণ্টা বেগ অর্জন করে। পরবর্তীতে গাড়িটি সমবেগে আরও ১০ সেকেন্ড চলে ব্রেক চেপে ৫ সেকেন্ডে সম্পূর্ণ থেমে যায়।',
    boardSource: "ঢাকা বোর্ড ২০২৪ (সদৃশ মডেল)",
    subQuestions: [
      {
        label: 'ক',
        marks: 1,
        type: 'জ্ঞানমূলক',
        question: 'তাৎক্ষণিক দ্রুতি কাকে বলে?',
        modelAnswer: 'কোনো নির্দিষ্ট মুহূর্তে বস্তুর অতি ক্ষুদ্র সময় ব্যবধানে দূরত্বের পরিবর্তনের হারকে তাৎক্ষণিক দ্রুতি বলে।',
        keyPoints: ['নির্দিষ্ট মুহূর্ত', 'দূরত্বের পরিবর্তনের হার', 'ক্ষুদ্র সময় ব্যবধান']
      },
      {
        label: 'খ',
        marks: 2,
        type: 'অনুধাবনমূলক',
        question: 'বৃত্তাকার পথে সমদ্রুতিতে ঘূর্ণায়মান বস্তুর ত্বরণ থাকে কেন? ব্যাখ্যা কর।',
        modelAnswer: 'বৃত্তাকার পথে ঘূর্ণায়মান বস্তুর দ্রুতি একই থাকলেও প্রতি মুহূর্তে তার গতির দিক পরিবর্তিত হয়। বেগ একটি ভেক্টর রাশি হওয়ায় দিক পরিবর্তনের কারণে বেগের পরিবর্তন ঘটে। আর বেগের পরিবর্তনের হারকেই ত্বরণ বলা হয়। ফলে কেন্দ্রমুখী ত্বরণ সৃষ্টি হয়।',
        keyPoints: ['ভেক্টর রাশি', 'দিক পরিবর্তন', 'বেগের পরিবর্তন', 'কেন্দ্রমুখী ত্বরণ']
      },
      {
        label: 'গ',
        marks: 3,
        type: 'প্রয়োগমূলক',
        question: 'প্রথম ২০ সেকেন্ডে গাড়িটির ত্বরণ ও অতিক্রান্ত দূরত্ব নির্ণয় কর।',
        modelAnswer: 'এখানে, আদিবেগ u = 0, সময় t = 20 s, শেষবেগ v = 60 km/h = 60 × (1000/3600) = 16.67 m/s.\nত্বরণ a = (v - u)/t = 16.67 / 20 = 0.833 m/s².\nঅতিক্রান্ত দূরত্ব s = ut + 1/2 at² = 0 + 0.5 × 0.833 × (20)² = 166.67 m.\nউত্তর: ত্বরণ 0.833 m/s² এবং অতিক্রান্ত দূরত্ব 166.67 মিটার।',
        keyPoints: ['v কে m/s এ রূপান্তর', 'a = (v-u)/t সূত্র প্রয়োগ', 's = ut + ½at² বা s = ((u+v)/2)t সঠিক হিসাব', 'একক মিটার ও m/s² উল্লেখ']
      },
      {
        label: 'ঘ',
        marks: 4,
        type: 'উচ্চতর দক্ষতামূলক',
        question: 'গাড়িটির সমগ্র যাত্রাপথের গতি বিশ্লেষণ করে বেগ-সময় (v-t) লেখচিত্রের সাহায্যে মোট দূরত্ব নির্ণয় করা সম্ভব কিনা—গাণিতিকভাবে যাচাই কর।',
        modelAnswer: 'হ্যাঁ, v-t লেখচিত্র অঙ্কন করে তার আবদ্ধ ক্ষেত্রের ক্ষেত্রফল নির্ণয়ের মাধ্যমে মোট দূরত্ব বের করা সম্ভব।\n১ম অংশ (ত্বরণ 0-20s): ত্রিভুজাকার ক্ষেত্র = 1/2 × ভূমি × উচ্চতা = 1/2 × 20 × 16.67 = 166.67 m.\n২য় অংশ (সমবেগ 20-30s): আয়তক্ষেত্র = দৈর্ঘ্য × প্রস্থ = 10 × 16.67 = 166.7 m.\n৩য় অংশ (মন্দন 30-35s): ত্রিভুজাকার ক্ষেত্র = 1/2 × 5 × 16.67 = 41.67 m.\nমোট দূরত্ব S = 166.67 + 166.7 + 41.67 = 375.04 m.\nলেখচিত্রের ক্ষেত্রফলের সাথে গাণিতিক সূত্র s = s1 + s2 + s3 পুরোপুরি সামঞ্জস্যপূর্ণ।',
        keyPoints: ['৩টি অংশের সুস্পষ্ট বিভাজন (ত্বরণ, সমবেগ, মন্দন)', 'লেখচিত্রের জ্যামিতিক ক্ষেত্রফল ব্যাখ্যা', '৩টি দূরত্বের সঠিক যোগফল (প্রায় ৩৭৫ মি.)', 'যৌক্তিক সমাপ্তি মন্তব্য']
      }
    ]
  },
  {
    id: 'cq_chem_periodic_1',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterId: 'ch_chem_4',
    chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি ও রাসায়নিক বন্ধন',
    stem: 'পর্যায় সারণির ৩টি কাল্পনিক মৌল: A (পারমাণবিক সংখ্যা ১১), B (পারমাণবিক সংখ্যা ১২) এবং C (পারমাণবিক সংখ্যা ১৭)।',
    boardSource: "রাজশাহী বোর্ড ২০২৪ (সদৃশ মডেল)",
    subQuestions: [
      {
        label: 'ক',
        marks: 1,
        type: 'জ্ঞানমূলক',
        question: 'অষ্টক নিয়ম (Octet rule) কী?',
        modelAnswer: 'অণু গঠনকালে মৌলসমূহ তাদের সর্বশেষ শক্তিস্তরে নিষ্ক্রিয় গ্যাসের মতো আটটি করে ইলেকট্রন ধারণের যে প্রবণতা দেখায় তাকে অষ্টক নিয়ম বলে।',
        keyPoints: ['সর্বশেষ শক্তিস্তর', 'আটটি ইলেকট্রন ধারণ', 'নিষ্ক্রিয় গ্যাসের ইলেকট্রন বিন্যাস']
      },
      {
        label: 'খ',
        marks: 2,
        type: 'অনুধাবনমূলক',
        question: 'সোডিয়ামকে কেন কেরোসিনের নিচে রাখা হয়? ব্যাখ্যা কর।',
        modelAnswer: 'সোডিয়াম অত্যন্ত সক্রিয় ক্ষার ধাতু। এটি খোলা বাতাসে রাখলে বাতাসের অক্সিজেন ও জলীয় বাষ্পের সাথে তীব্রভাবে বিক্রিয়া করে তাপ ও হাইড্রোজেন গ্যাস উৎপন্ন করে এবং আগুন ধরে যেতে পারে। কেরোসিন সোডিয়ামের সাথে বিক্রিয়া করে না বলে একে সুরক্ষিত রাখতে কেরোসিনের নিচে সংরক্ষণ করা হয়।',
        keyPoints: ['উচ্চ সক্রিয় ক্ষার ধাতু', 'বাতাসের অক্সিজেন ও আর্দ্রতার সাথে তীব্র বিক্রিয়া', 'অগ্নিঝুঁকি রোধ']
      },
      {
        label: 'গ',
        marks: 3,
        type: 'প্রয়োগমূলক',
        question: 'A ও C মৌলদ্বয় দ্বারা গঠিত যৌগের বন্ধন গঠন কৌশল চিত্রসহ ব্যাখ্যা কর।',
        modelAnswer: 'A মৌলটি হলো সোডিয়াম (Na, Z=11) এবং C মৌলটি ক্লোরিন (Cl, Z=17)।\nNa এর ইলেকট্রন বিন্যাস: 2, 8, 1। এটি সর্বশেষ কক্ষপথের ১টি ইলেকট্রন ত্যাগ করে Na⁺ ক্যাটায়নে পরিণত হয়।\nCl এর ইলেকট্রন বিন্যাস: 2, 8, 7। এটি ১টি ইলেকট্রন গ্রহণ করে Cl⁻ অ্যানায়নে পরিণত হয়।\nবিপরীতধর্মী Na⁺ ও Cl⁻ আয়নদ্বয় স্থির বৈদ্যুতিক আকর্ষণ বলের মাধ্যমে যুক্ত হয়ে NaCl আয়নিক বন্ধন গঠন করে।',
        keyPoints: ['মৌল শনাক্তকরণ (Na ও Cl)', 'ইলেকট্রন ত্যাগ ও গ্রহণ সমীকরণ', 'আয়নিক বন্ধন ও স্থির বৈদ্যুতিক আকর্ষণ বল উল্লেখ']
      },
      {
        label: 'ঘ',
        marks: 4,
        type: 'উচ্চতর দক্ষতামূলক',
        question: 'A ও B এর প্রথম আয়নীকরণ শক্তির মানের মধ্যে কোনটি বেশি হবে? যুক্তি সহকারে বিশ্লেষণ কর।',
        modelAnswer: 'A হলো সোডিয়াম (Na) এবং B হলো ম্যাগনেসিয়াম (Mg)। উভয়েই পর্যায় সারণির ৩য় পর্যায়ের মৌল।\nপর্যায় সারণির একই পর্যায়ে বাম থেকে ডানে গেলে পারমাণবিক সংখ্যা বাড়ার সাথে সাথে নিউক্লীয় আধান বাড়ে কিন্তু নতুন কোনো শক্তিস্তর যুক্ত হয় না।\nফলে নিউক্লিয়াস কর্তৃক সর্ববহিস্থ স্তরের ইলেকট্রনের প্রতি আকর্ষণ বল বৃদ্ধি পায় এবং পরমাণুর ব্যাসার্ধ হ্রাস পায়।\nম্যাগনেসিয়ামের ব্যাসার্ধ সোডিয়ামের চেয়ে ছোট এবং এর ইলেকট্রন বিন্যাসে ৩s অরবিটাল পূর্ণ (3s²) থাকায় তা অধিক স্থিতিশীল। তাই Mg থেকে ১টি ইলেকট্রন অপসারন করতে Na এর তুলনায় অধিক শক্তির প্রয়োজন হয়।\nঅতএব, B (ম্যাগনেসিয়াম)-এর প্রথম আয়নীকরণ শক্তি A (সোডিয়াম)-এর চেয়ে বেশি।',
        keyPoints: ['একই পর্যায় (৩য় পর্যায়) শনাক্তকরণ', 'পারমাণবিক ব্যাসার্ধ হ্রাসের কারণ ব্যাখ্যা', '3s² অরবিটালের পূর্ণতার স্থায়িত্ব উল্লেখ', 'স্পষ্ট সিদ্ধান্ত (Mg > Na)']
      }
    ]
  }
];

export interface AiCqEvaluationResult {
  score: number; // out of 10
  breakdown: {
    knowledge: { marks: number; max: 1; feedback: string }; // 'ক'
    understanding: { marks: number; max: 2; feedback: string }; // 'খ'
    application: { marks: number; max: 3; feedback: string }; // 'গ'
    higherOrder: { marks: number; max: 4; feedback: string }; // 'ঘ'
  };
  highlightedStrengths: string[];
  missingKeyPoints: string[];
  boardStandardAdvice: string;
  gradeBadge: 'A+' | 'A' | 'A-' | 'B' | 'Improvement Needed';
}

export function evaluateCqAnswerLocally(
  userText: string,
  selectedCq: CqQuestion
): AiCqEvaluationResult {
  const textLength = userText.trim().length;
  const lower = userText.toLowerCase();

  // Keyword Matching heuristics based on subQuestions
  let knowledgeScore = 1;
  let understandingScore = 2;
  let appScore = 3;
  let hoScore = 4;

  const missingPoints: string[] = [];
  const strengths: string[] = [];

  // Check stem-specific keywords
  if (selectedCq.id.includes('phy')) {
    const hasFormula = /v\s*=\s*u|\bs\s*=\s*ut|\ba\s*=\s*|\bm\/s/i.test(userText);
    const hasValues = /16\.67|0\.83|375|20|60/i.test(userText);
    const hasGraphMention = /লেখচিত্র|আয়তক্ষেত্র|ক্ষেত্রফল|গ্রাফ|v-t/i.test(userText);

    if (!hasFormula) {
      appScore = Math.max(1, appScore - 1);
      missingPoints.push('গতির প্রধান সমীকরণ (v = u + at অথবা s = ut + ½at²) সঠিকভাবে উল্লেখ করা হয়নি');
    } else {
      strengths.push('সঠিক পদার্থবিজ্ঞান সূত্র ও সমীকরণের সার্থক প্রয়োগ');
    }

    if (!hasValues) {
      appScore = Math.max(1, appScore - 1);
      missingPoints.push('বেগের একক রূপান্তর (km/h থেকে m/s) এবং সুনির্দিষ্ট গাণিতিক মান অসম্পূর্ণ');
    } else {
      strengths.push('গাণিতিক এককের সঠিক রূপান্তর ও নির্ভুল ক্যালকুলেশন');
    }

    if (!hasGraphMention) {
      hoScore = Math.max(2, hoScore - 1);
      missingPoints.push('ঘ-নম্বরে লেখচিত্রের ৩টি অংশের জ্যামিতিক ক্ষেত্রফল বিশ্লেষণ স্পষ্ট নয়');
    } else {
      strengths.push('v-t লেখচিত্রভিত্তিক ক্ষেত্রফল ও দূরত্বের যৌক্তিক বিশ্লেষণ সম্পন্ন');
    }
  } else {
    // Chem
    const hasIons = /na\+|cl\-|আয়ন|ইলেকট্রন|ক্যাটায়ন|অ্যানায়ন/i.test(userText);
    const hasConfig = /2,\s*8,\s*1|2,\s*8,\s*7|3s|ইলেকট্রন বিন্যাস/i.test(userText);
    const hasComparison = /আয়নীকরণ শক্তি|ব্যাসার্ধ|আকার|নিউক্লিয়াস/i.test(userText);

    if (!hasIons) {
      appScore = Math.max(1, appScore - 1);
      missingPoints.push('আয়নিক বন্ধন গঠনে ক্যাটায়ন ও অ্যানায়ন সৃষ্টির সমীকরণ উল্লেখ জরুরি');
    } else {
      strengths.push('ইলেকট্রন আদান-প্রদান ও আয়ন সৃষ্টির যথাযথ রূপরেখা');
    }

    if (!hasConfig) {
      missingPoints.push('সোডিয়াম ও ক্লোরিনের পর্যায়বৃত্ত ইলেকট্রন বিন্যাস চিত্রসহ প্রদর্শন কাম্য');
    } else {
      strengths.push('নির্ভুল ইলেকট্রন বিন্যাস ও বন্ধনজোড় বিশ্লেষণ');
    }

    if (!hasComparison) {
      hoScore = Math.max(2, hoScore - 1);
      missingPoints.push('ঘ-নম্বরে পর্যায় সারণির একই পর্যায়ে আকার হ্রাস ও পূর্ণ উপস্তরের স্থিতিশীলতার ব্যাখ্যা অনুপস্থিত');
    } else {
      strengths.push('পর্যায়বৃত্ত ধর্ম ও আয়নীকরণ শক্তির সুন্দর বৈজ্ঞানিক যুক্তি উপস্থাপন');
    }
  }

  // Length constraints
  if (textLength < 120) {
    knowledgeScore = 0;
    understandingScore = 1;
    appScore = 1;
    hoScore = 1;
    missingPoints.push('উত্তর অত্যন্ত সংক্ষিপ্ত; বোর্ড পরীক্ষায় ৪টি সাব-প্রশ্নের (ক, খ, গ, ঘ) ক্রমানুসারে পূর্ণাঙ্গ বিস্তারিত লেখা আবশ্যক');
  } else if (textLength < 300) {
    understandingScore = Math.min(understandingScore, 1);
    appScore = Math.min(appScore, 2);
    hoScore = Math.min(hoScore, 2);
  }

  const totalScore = knowledgeScore + understandingScore + appScore + hoScore;

  let gradeBadge: AiCqEvaluationResult['gradeBadge'] = 'A+';
  if (totalScore >= 9) gradeBadge = 'A+';
  else if (totalScore >= 7) gradeBadge = 'A';
  else if (totalScore >= 5) gradeBadge = 'A-';
  else if (totalScore >= 4) gradeBadge = 'B';
  else gradeBadge = 'Improvement Needed';

  return {
    score: totalScore,
    breakdown: {
      knowledge: {
        marks: knowledgeScore,
        max: 1,
        feedback: knowledgeScore === 1 ? 'সঠিক জ্ঞানমূলক সংজ্ঞা উপস্থাপন করা হয়েছে।' : 'সংজ্ঞায় প্রধান পরিভাষা বাদ পড়েছে।'
      },
      understanding: {
        marks: understandingScore,
        max: 2,
        feedback: understandingScore === 2 ? 'অনুধাবনের কারণ ও বৈজ্ঞানিক ব্যাখ্যা সুস্পষ্ট।' : 'অনুধাবনে প্রধান কার্যকারণ সম্পর্কটি আরও সুস্পষ্ট করতে হবে।'
      },
      application: {
        marks: appScore,
        max: 3,
        feedback: appScore === 3 ? 'উদ্দীপকের মান ও সূত্রের নির্ভুল প্রয়োগ ঘটেছে।' : 'প্রয়োগে গাণিতিক একক বা সমীকরণ স্টেপ আরও নিখুঁত হওয়া প্রয়োজন।'
      },
      higherOrder: {
        marks: hoScore,
        max: 4,
        feedback: hoScore === 4 ? 'বোর্ড স্ট্যান্ডার্ড অনুযায়ী চমৎকার সিদ্ধান্ত ও তুলনামূলক বিশ্লেষণ।' : 'সিদ্ধান্ত গ্রহণের পূর্বে দুই বা ততোধিক দিক বিশ্লেষণ ও তুলনা আবশ্যক।'
      }
    },
    highlightedStrengths: strengths.length > 0 ? strengths : ['উত্তর লেখার আন্তরিক প্রচেষ্টা ও কাঠামোগত বিন্যাস প্রশংসনীয়'],
    missingKeyPoints: missingPoints.length > 0 ? missingPoints : ['বোর্ড পরীক্ষায় সময় ব্যবস্থাপনার দিকে খেয়াল রেখে ২০ মিনিটের মধ্যে এই মান বজায় রাখুন'],
    boardStandardAdvice: totalScore >= 8
      ? 'আপনার উত্তরের মান বোর্ডের পূর্ণ নম্বর (১০/১০) পাওয়ার জন্য পুরোপুরি উপযুক্ত। হস্তাক্ষর ও পরিচ্ছন্ন মার্জিন বজায় রাখুন।'
      : 'বোর্ড প্রধান পরীক্ষকদের নির্দেশনা অনুযায়ী "গ" ও "ঘ" অংশে আলাদা প্যারাগ্রাফ ও সূত্রের নাম সুস্পষ্টভাবে বোল্ড করে লিখলে পূর্ণ নম্বর নিশ্চিত হবে।',
    gradeBadge
  };
}
