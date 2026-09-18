import { MegaBankQuestion, CadetCollegePaper, FormulaItem } from '../types';

export const ALL_EDUCATION_BOARDS = [
  'সব বোর্ড',
  'ঢাকা বোর্ড',
  'রাজশাহী বোর্ড',
  'চট্টগ্রাম বোর্ড',
  'কুমিল্লা বোর্ড',
  'দিনাজপুর বোর্ড',
  'যশোর বোর্ড',
  'সিলেট বোর্ড',
  'বরিশাল বোর্ড',
  'ময়মনসিংহ বোর্ড',
  'মাদ্রাসা বোর্ড',
];

export const ALL_YEARS = [
  'সব বছর',
  '2026 (প্রেডিকশন)',
  '2025 (মডেল)',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
];

export const MEGA_BOARD_QUESTIONS: MegaBankQuestion[] = [
  {
    id: 'mbq_phy_dhaka_24_1',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterName: '২য় অধ্যায়: গতি (Motion)',
    boardName: 'ঢাকা বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Hard',
    questionStem: 'একটি গাড়ি স্থির অবস্থান থেকে 2 m/s² সুষম ত্বরণে চলা শুরু করল। একই সময় 100m পেছন থেকে একটি মোটরসাইকেল 20 m/s সমবেগে গাড়িটিকে ধাওয়া করল।',
    cqSubQuestions: {
      k: 'সরণ কাকে বলে?',
      kh: 'সমত্বরণে চলমান বস্তুর বেগ-সময় লেখচিত্র কেমন হবে ব্যাখ্যা কর।',
      g: 'গাড়িটি 10 সেকেন্ডে কত দূরত্ব অতিক্রম করবে নির্ণয় কর।',
      gh: 'মোটরসাইকেলটি গাড়িটিকে কতবার এবং কখন অতিক্রম করতে পারবে তা গাণিতিক বিশ্লেষণের মাধ্যমে দেখাও।'
    },
    explanation: 'ধরি t সময় পর মিলিত হবে। s_car = 0.5 * 2 * t² = t²; s_bike = 20t - 100; সুতরাং t² - 20t + 100 = 0 => (t - 10)² = 0 => t = 10s। অর্থাৎ কেবল ১ বার অতিক্রম করবে 10 সেকেন্ড পর।',
    formulaRef: 's = ut + 0.5at², s = vt',
    tags: ['ঢাকা ২৪', 'গতি', 'চোর-পুলিশ হট প্যাটার্ন', 'বোর্ড টপ']
  },
  {
    id: 'mbq_phy_rajshahi_24_1',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterName: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি',
    boardName: 'রাজশাহী বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Hard',
    questionStem: '5 kW ক্ষমতার একটি পানির পাম্প 20m গভীর একটি কুয়া থেকে 5 মিনিটে 6000 লিটার পানি উত্তোলন করতে পারে। (g = 9.8 ms⁻²)',
    cqSubQuestions: {
      k: 'কর্মদক্ষতা কাকে বলে?',
      kh: 'শক্তির রূপান্তর ব্যাখ্যা কর যখন পাম্প পানি তোলে।',
      g: 'পাম্পটি দ্বারা কৃতকাজের পরিমাণ নির্ণয় কর।',
      gh: 'পাম্পটির কর্মদক্ষতা এবং অপচয়কৃত ক্ষমতার মান নির্ণয় কর ও মন্তব্য কর।'
    },
    explanation: 'W = mgh = 6000 * 9.8 * 20 = 1,176,000 J. P_out = W / t = 1,176,000 / 300 = 3920 W. Efficiency η = (3920 / 5000) * 100% = 78.4%.',
    formulaRef: 'η = (P_out / P_in) * 100%, P = W/t',
    tags: ['রাজশাহী ২৪', 'কর্মদক্ষতা', 'পাম্প হট প্রবলেম']
  },
  {
    id: 'mbq_chem_chittagong_24_1',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি',
    boardName: 'চট্টগ্রাম বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Medium',
    questionStem: 'পর্যায় সারণির ৩টি মৌল X (পারমাণবিক সংখ্যা ১১), Y (পারমাণবিক সংখ্যা ১২) এবং Z (পারমাণবিক সংখ্যা ১৭)।',
    cqSubQuestions: {
      k: 'মেন্ডেলিফের পর্যায় সূত্রটি লিখ।',
      kh: 'নিষ্ক্রিয় গ্যাসসমূহ রাসায়নিকভাবে কেন নিষ্ক্রিয় থাকে?',
      g: 'উদ্দীপকের মৌলগুলোর আয়নীকরণ শক্তির ক্রমানুসারে সাজাও।',
      gh: 'X এবং Z দ্বারা গঠিত যৌগ পানিতে দ্রবীভূত হয় কিন্তু কেরোসিনে নয়—ব্যাখ্যা কর।'
    },
    explanation: 'X=Na, Y=Mg, Z=Cl. একই পর্যায়ে বাম থেকে ডানে পারমাণবিক ব্যাসার্ধ কমে এবং আয়নীকরণ শক্তি বাড়ে। সুতরাং আয়নীকরণ শক্তি: Na < Mg < Cl। NaCl একটি আয়নিক যৌগ, তাই পোলার দ্রাবক পানিতে দ্রবীভূত হয়।',
    formulaRef: 'আয়নীকরণ শক্তি ∝ ১ / পারমাণবিক ব্যাসার্ধ',
    tags: ['চট্টগ্রাম ২৪', 'পর্যায় সারণি', 'আয়নিক বন্ধন']
  },
  {
    id: 'mbq_hmath_comilla_23_1',
    subjectId: 'hmath',
    subjectName: 'উচ্চতর গণিত',
    chapterName: '৮ম অধ্যায়: ত্রিকোণমিতি',
    boardName: 'কুমিল্লা বোর্ড',
    year: 2023,
    type: 'CQ',
    difficulty: 'Hard',
    questionStem: 'যদি tan θ = 3/4 এবং cos θ ঋণাত্মক হয়, তবে ত্রিকোণমিতিক সম্পর্ক নির্ণয় কর।',
    cqSubQuestions: {
      k: 'রেডিয়ান কোণ কাকে বলে?',
      kh: 'প্রমাণ কর যে, বৃত্তের ব্যাসার্ধের সমান চাপ কেন্দ্রে ১ রেডিয়ান কোণ উৎপন্ন করে।',
      g: 'sin θ এবং sec θ এর মান নির্ণয় কর।',
      gh: '(sin θ + cos θ) / (sec θ + tan θ) এর মান নির্ণয় কর।'
    },
    explanation: 'যেহেতু tan θ > 0 কিন্তু cos θ < 0, তাই θ ৩য় চতুর্ভাগে (3rd quadrant) অবস্থিত। সুতরাং sin θ = -3/5, cos θ = -4/5, sec θ = -5/4। মান বসিয়ে পাই: (-7/5) / (-5/4 + 3/4) = (-7/5) / (-2/4) = 14/5।',
    formulaRef: 's = rθ, sin²θ + cos²θ = 1',
    tags: ['কুমিল্লা ২৩', 'ত্রিকোণমিতি', 'চতুর্ভাগ কোণ']
  },
  {
    id: 'mbq_math_dinajpur_24_1',
    subjectId: 'math',
    subjectName: 'গণিত',
    chapterName: '৩য় অধ্যায়: বীজগাণিতিক রাশি',
    boardName: 'দিনাজপুর বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Medium',
    questionStem: 'x + 1/x = 3 এবং p² = 7 + 4√3 হলে:',
    cqSubQuestions: {
      k: 'উৎপাদকে বিশ্লেষণ কর: a³ - 9b³ + (a + b)³',
      kh: 'x⁵ + 1/x⁵ এর মান নির্ণয় কর।',
      g: 'প্রমাণ কর যে, p⁵ - 1/p⁵ = 724',
      gh: 'x⁴ - 1/x⁴ এর সঠিক মান নির্ণয় কর।'
    },
    explanation: 'x² + 1/x² = 7, x³ + 1/x³ = 18. x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) - (x + 1/x) = 7*18 - 3 = 126 - 3 = 123.',
    formulaRef: '(a+b)³ = a³ + b³ + 3ab(a+b)',
    tags: ['দিনাজপুর ২৪', 'বীজগণিত', 'পাওয়ার ৫ প্রবলেম']
  },
  {
    id: 'mbq_bio_jessore_24_1',
    subjectId: 'bio',
    subjectName: 'জীববিজ্ঞান',
    chapterName: '৪র্থ অধ্যায়: জীবনীশক্তি (Bioenergetics)',
    boardName: 'যশোর বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Medium',
    questionStem: 'উদ্ভিদে সংঘটিত দুটি প্রধান শারীরবৃত্তীয় প্রক্রিয়া M (সালোকসংশ্লেষণ) এবং N (শ্বসন)।',
    cqSubQuestions: {
      k: 'ATP কে কেন জৈব মুদ্রা বলা হয়?',
      kh: 'প্রস্বেদনকে ‘প্রয়োজনীয় অমঙ্গল’ বলা হয় কেন?',
      g: 'M প্রক্রিয়ার আলোক পর্যায়টির সংক্ষিপ্ত প্রবাহচিত্র দাও।',
      gh: 'জীবজগতের ভারসাম্য রক্ষায় M ও N প্রক্রিয়ার পারস্পরিক নির্ভরশীলতা বিশ্লেষণ কর।'
    },
    explanation: 'সালোকসংশ্লেষণে উৎপাদিত O₂ ও গ্লুকোজ শ্বসনে ব্যবহৃত হয় এবং শ্বসনে নির্গত CO₂ সালোকসংশ্লেষণে ব্যবহৃত হয়ে গ্যাসীয় ভারসাম্য রক্ষা করে।',
    formulaRef: '6CO₂ + 12H₂O + Light -> C₆H₁₂O₆ + 6O₂ + 6H₂O',
    tags: ['যশোর ২৪', 'সালোকসংশ্লেষণ', 'জীবনীশক্তি']
  },
  {
    id: 'mbq_bgs_mymensingh_24_1',
    subjectId: 'bgs',
    subjectName: 'বাংলাদেশ ও বিশ্বপরিচয়',
    chapterName: '১ম অধ্যায়: পূর্ব বাংলার আন্দোলন ও জাতীয়তাবাদের উত্থান',
    boardName: 'ময়মনসিংহ বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Medium',
    questionStem: '১৯৫২ সালের ২১ ফেব্রুয়ারি ঢাকার রাজপথে বুকের রক্ত ঢেলে বাঙালি মাতৃভাষার অধিকার ছিনিয়ে নেয়।',
    cqSubQuestions: {
      k: 'সর্বদলীয় কেন্দ্রীয় রাষ্ট্রভাষা সংগ্রাম পরিষদ কবে গঠিত হয়?',
      kh: 'যুক্তফ্রন্টের ২১ দফার মূল তাৎপর্য কী ছিল?',
      g: 'বাঙালি জাতীয়তাবাদের বিকাশে ভাষা আন্দোলনের অবদান ব্যাখ্যা কর।',
      gh: '‘১৯৫২ সালের ভাষা আন্দোলনই বাংলাদেশের স্বাধীনতার বীজ বপন করেছিল’—উক্তিটি মূল্যায়ন কর।'
    },
    explanation: 'ভাষা আন্দোলন বাঙালিদের মধ্যে প্রথম অসাম্প্রদায়িক ও স্বাধিকার চেতনার জন্ম দেয় যা পরবর্তীতে ৬ দফা, ৬৯ এর গণঅভ্যুত্থান এবং ৭১ এর মহান মুক্তিযুদ্ধের ভিত্তি রচনা করে।',
    formulaRef: 'ঐতিহাসিক মাইলফলক ১৯৫২ -> ১৯৬৬ -> ১৯৬৯ -> ১৯৭১',
    tags: ['ময়মনসিংহ ২৪', 'ভাষা আন্দোলন', 'জাতীয়তাবাদ']
  },
  {
    id: 'mbq_ict_sylhet_24_1',
    subjectId: 'ict',
    subjectName: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    chapterName: '৩য় অধ্যায়: আমার শিক্ষায় ইন্টারনেট',
    boardName: 'সিলেট বোর্ড',
    year: 2024,
    type: 'CQ',
    difficulty: 'Easy',
    questionStem: 'রাফি নবম শ্রেণির শিক্ষার্থী। সে অনলাইনে ই-বুক পড়ে এবং শিক্ষামূলক ওয়েবসাইট থেকে গণিতের সমাধান শেখে।',
    cqSubQuestions: {
      k: 'ই-লার্নিং কী?',
      kh: 'ডিজিটাল কনটেন্ট বলতে কী বোঝায়?',
      g: 'রাফির পড়াশোনায় ডিজিটাল কনটেন্ট কীভাবে সহায়তা করছে ব্যাখ্যা কর।',
      gh: 'শিক্ষাক্ষেত্রে ইন্টারনেটের ইতিবাচক ও নেতিবাচক দিকগুলো তুলনামূলক বিশ্লেষণ কর।'
    },
    explanation: 'ইন্টারনেট শিক্ষার্থীদের দূরশিক্ষণ, মাল্টিমিডিয়া ক্লাস এবং বিশ্বমানের শিক্ষামূলক রিসোর্সের অ্যাক্সেস দেয়, তবে স্ক্রিন টাইম আসক্তি থেকে সতর্ক থাকতে হবে।',
    formulaRef: 'ICT ইন এডুকেশন',
    tags: ['সিলেট ২৪', 'ই-লার্নিং', 'ডিজিটাল কনটেন্ট']
  }
];

export const CADET_COLLEGE_PAPERS: CadetCollegePaper[] = [
  {
    id: 'cadet_faujdarhat_24',
    collegeName: 'ফৌজদারহাট ক্যাডেট কলেজ',
    subjectName: 'পদার্থবিজ্ঞান',
    examType: 'Test Special',
    year: 2024,
    totalMarks: 75,
    durationMinutes: 150,
    questionsCount: 8,
    highlightedTopics: ['ঘূর্ণন জড়তা ও ব্যাংকিং কোণ', 'আলোকের প্রতিসরণ ও লেন্স সূত্র', 'তরঙ্গ ও শব্দের ব্যতিচার'],
    sampleCqStem: 'একটি বাঁকা রাস্তায় গাড়ির নিরাপদ বেগ নির্ণয় ও ব্যাংকিং কোণের ত্রিকোণমিতিক বিশ্লেষণ।',
    expertTips: 'ক্যাডেট কলেজের প্রশ্নে সাধারণত ২-৩টি অধ্যায়ের সমন্বিত প্রশ্ন (Hybrid CQ) থাকে। বেসিক কনসেপ্ট ক্লিয়ার থাকলে পূর্ণ নম্বর পাওয়া সহজ।'
  },
  {
    id: 'cadet_mirzapur_24',
    collegeName: 'মির্জাপুর ক্যাডেট কলেজ',
    subjectName: 'উচ্চতর গণিত',
    examType: 'Pre-Test',
    year: 2024,
    totalMarks: 75,
    durationMinutes: 150,
    questionsCount: 8,
    highlightedTopics: ['দ্বিপদী বিস্তৃতি', 'স্থানাঙ্ক জ্যামিতি', 'ভেক্টর ও ত্রিকোণমিতি'],
    sampleCqStem: '(1 - 2x)ⁿ এর বিস্তৃতিতে x² ও x³ এর সহগ সমান হলে n এর মান এবং ত্রিভুজের ক্ষেত্রফল নির্ণয়।',
    expertTips: 'ক্যালকুলেশন ও রাফ স্টেপ অত্যন্ত পরিষ্কার রাখা আবশ্যক। ক্যাডেট এক্সামিনাররা সঠিক পদ্ধতির জন্য আলাদা মার্কস দেন।'
  },
  {
    id: 'cadet_rajshahi_24',
    collegeName: 'রাজশাহী ক্যাডেট কলেজ',
    subjectName: 'রসায়ন',
    examType: 'Test Special',
    year: 2024,
    totalMarks: 75,
    durationMinutes: 150,
    questionsCount: 8,
    highlightedTopics: ['মোলের ধারণা ও রাসায়নিক গণনা', 'পর্যায় সারণি ও ধাতু নিষ্কাশন', 'হাইড্রোকার্বন ও পলিমার'],
    sampleCqStem: 'একটি নির্দিষ্ট পাত্রে চুনাপাথর উত্তপ্ত করে প্রাপ্ত CO₂ গ্যাসের প্রমাণ তাপমাত্রা ও চাপে আয়তন নির্ণয়।',
    expertTips: 'সমতাকৃত রাসায়নিক সমীকরণ এবং একক উল্লেখ না করলে নম্বর কাটা যায়।'
  },
  {
    id: 'cadet_jhenaidah_24',
    collegeName: 'ঝিনাইদহ ক্যাডেট কলেজ',
    subjectName: 'জীববিজ্ঞান',
    examType: 'Model Test',
    year: 2024,
    totalMarks: 75,
    durationMinutes: 150,
    questionsCount: 8,
    highlightedTopics: ['কোষ বিভাজন (মায়োসিস)', 'জিনতত্ত্ব ও মেন্ডেলের সূত্র', 'রক্ত সংবহন তন্ত্র ও হৃদযন্ত্র'],
    sampleCqStem: 'একজন মানুষের রক্তের গ্রুপ AB+ এবং তার সন্তানের রক্ত সঞ্চালনের তুলনামূলক জেনেটিক চার্ট।',
    expertTips: 'চিহ্নিত চিত্র পরিষ্কার ও পেনসিল দিয়ে আঁকতে হবে। লেবেলিং ডানপাশে একপাশে সারিবদ্ধ করা ভালো।'
  },
  {
    id: 'cadet_sylhet_24',
    collegeName: 'সিলেট ক্যাডেট কলেজ',
    subjectName: 'গণিত',
    examType: 'Test Special',
    year: 2024,
    totalMarks: 100,
    durationMinutes: 180,
    questionsCount: 11,
    highlightedTopics: ['পরিমিতি (১৬শ অধ্যায়)', 'ত্রিকোণমিতি ও উচ্চতা-দূরত্ব', 'পরিসংখ্যান ও অজিভ রেখা'],
    sampleCqStem: 'একটি বেলনাকার ড্রামের ব্যাসার্ধ ও উচ্চতা নির্ণয় এবং তার সমগ্রতলের ক্ষেত্রফল হিসাব।',
    expertTips: 'পরিসংখ্যানে সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয়ের ছক ও গ্রাফ পেপার সঠিক স্কেলে পূরণ করা আবশ্যক।'
  },
  {
    id: 'cadet_cumilla_24',
    collegeName: 'কুমিল্লা ক্যাডেট কলেজ',
    subjectName: 'পদার্থবিজ্ঞান',
    examType: 'Pre-Test',
    year: 2024,
    totalMarks: 75,
    durationMinutes: 150,
    questionsCount: 8,
    highlightedTopics: ['চলবিদ্যুৎ ও রোধের বর্তনী', 'তড়িৎ ক্ষমতা ও বিল হিসাব', 'স্থির তড়িৎ ও কুলম্বের সূত্র'],
    sampleCqStem: 'মিশ্র বর্তনীতে তুল্য রোধ নির্ণয় ও বৈদ্যুতিক বাতি বেশি উজ্জ্বলতায় জ্বলবে কিনা তার গাণিতিক যাচাই।',
    expertTips: 'তড়িৎ প্রবাহ ও বিভব পার্থক্যের হিসাব Kirchhoff বা সমান্তরাল সূত্রের সাহায্যে ধাপে ধাপে লিখুন।'
  }
];

export const FORMULA_CHEAT_SHEET: FormulaItem[] = [
  {
    id: 'form_phy_kinematics',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterName: '২য় অধ্যায়: গতি',
    formulaName: 'গতির মৌলিক সমীকরণসমূহ',
    formulaLatex: 'v = u + at \n s = ((u + v)/2) * t \n s = ut + ½at² \n v² = u² + 2as',
    unitsAndSymbols: [
      { symbol: 'u', meaning: 'আদিবেগ', unit: 'm/s' },
      { symbol: 'v', meaning: 'শেষবেগ', unit: 'm/s' },
      { symbol: 'a', meaning: 'ত্বরণ', unit: 'm/s²' },
      { symbol: 's', meaning: 'অতিক্রান্ত দূরত্ব / সরণ', unit: 'm' },
      { symbol: 't', meaning: 'সময়', unit: 's' }
    ],
    applicationTip: 'স্থির অবস্থান বললে u = 0, ব্রেক কষে থামানো বললে v = 0 এবং মন্দন হলে a ঋণাত্মক (-)।',
    boardHotRating: 5,
    commonMistakes: 'উচ্চতা সংক্রান্ত অঙ্কে g = 9.8 ms⁻² এর দিক ভুলে ধনাত্মক/ঋণাত্মক ভুল করা।'
  },
  {
    id: 'form_phy_work_power',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterName: '৪র্থ অধ্যায়: কাজ, ক্ষমতা ও শক্তি',
    formulaName: 'কৃতকাজ ও কর্মদক্ষতা সমীকরণ',
    formulaLatex: 'W = Fs cos θ = mgh \n E_k = ½mv² \n E_p = mgh \n P = W/t = Fv \n η = (P_output / P_input) × 100%',
    unitsAndSymbols: [
      { symbol: 'W', meaning: 'কৃতকাজ', unit: 'Joule (J)' },
      { symbol: 'P', meaning: 'ক্ষমতা', unit: 'Watt (W)' },
      { symbol: 'η', meaning: 'কর্মদক্ষতা (Efficiency)', unit: '%' },
      { symbol: 'E_k', meaning: 'গতিশক্তি', unit: 'J' },
      { symbol: 'E_p', meaning: 'বিভবশক্তি', unit: 'J' }
    ],
    applicationTip: 'পানির পাম্পের প্রশ্নে কার্যকর ক্ষমতা P_out = mgh / t হিসাব করে P_in এর সাথে অনুপাত করতে হবে।',
    boardHotRating: 5,
    commonMistakes: 'মিনিটকে সেকেন্ডে রূপান্তর করতে ভুলে যাওয়া (যেমন: ৫ মিনিট = ৩০০ সেকেন্ড)।'
  },
  {
    id: 'form_chem_mole',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    chapterName: '৬ষ্ঠ অধ্যায়: মোলের ধারণা ও রাসায়নিক গণনা',
    formulaName: 'মোল সংখ্যার মহা-সমন্বিত সূত্র',
    formulaLatex: 'n = w/M = N/N_A = V/22.4 (STP) = S × V(L)',
    unitsAndSymbols: [
      { symbol: 'n', meaning: 'মোল সংখ্যা', unit: 'mol' },
      { symbol: 'w', meaning: 'পদার্থের ভর', unit: 'gram (g)' },
      { symbol: 'M', meaning: 'আণবিক ভর / পারমাণবিক ভর', unit: 'g/mol' },
      { symbol: 'N', meaning: 'কণার সংখ্যা', unit: 'টি' },
      { symbol: 'N_A', meaning: 'অ্যাভোগাড্রো সংখ্যা (6.023 × 10²³)', unit: 'mol⁻¹' },
      { symbol: 'S', meaning: 'মোলারিটি / ঘনমাত্রা', unit: 'mol/L' }
    ],
    applicationTip: 'যে কোনো গাণিতিক প্রশ্নে প্রথমে প্রদত্ত মানকে মোল (n) এ রূপান্তর করে ফেললে অঙ্ক এক লাইনে সমাধান হয়।',
    boardHotRating: 5,
    commonMistakes: 'আণবিক ভর ভুল হিসাব করা অথবা STP ছাড়া অন্য তাপমাত্রায় 22.4L বসানো।'
  },
  {
    id: 'form_hmath_trig',
    subjectId: 'hmath',
    subjectName: 'উচ্চতর গণিত',
    chapterName: '৮ম অধ্যায়: ত্রিকোণমিতি',
    formulaName: 'বৃত্তীয় পরিমাপ ও চতুর্ভাগ সূত্র',
    formulaLatex: 's = rθ (θ রেডিয়ানে) \n sin²θ + cos²θ = 1 \n sec²θ - tan²θ = 1 \n cosec²θ - cot²θ = 1',
    unitsAndSymbols: [
      { symbol: 's', meaning: 'বৃত্তচাপের দৈর্ঘ্য', unit: 'm / cm' },
      { symbol: 'r', meaning: 'বৃত্তের ব্যাসার্ধ', unit: 'm / cm' },
      { symbol: 'θ', meaning: 'কেন্দ্রে উৎপন্ন কোণ', unit: 'radian (rad)' }
    ],
    applicationTip: 'ডিগ্রিকে রেডিয়ানে নিতে π/180 দিয়ে গুণ করতে হবে। কোণের চতুর্ভাগ (Quadrant) দেখে চিহ্ন নিশ্চিত করুন।',
    boardHotRating: 5,
    commonMistakes: 's = rθ সূত্রে কোণ θ ডিগ্রিতে রেখে হিসাব করা।'
  },
  {
    id: 'form_math_algebra',
    subjectId: 'math',
    subjectName: 'গণিত',
    chapterName: '৩য় অধ্যায়: বীজগাণিতিক রাশি',
    formulaName: 'বর্গ ও ঘনের অনুসিদ্ধান্তসমূহ',
    formulaLatex: '(a + b)² = (a - b)² + 4ab \n a² + b² = (a + b)² - 2ab \n a³ + b³ = (a + b)³ - 3ab(a + b) \n a³ - b³ = (a - b)³ + 3ab(a - b)',
    unitsAndSymbols: [
      { symbol: 'a, b', meaning: 'বাস্তব বীজগাণিতিক চলক', unit: 'Unitless' }
    ],
    applicationTip: 'x + 1/x দেওয়া থাকলে x² + 1/x² এবং x³ + 1/x³ এর মান আগে বের করে পরে x⁵ + 1/x⁵ এর মান বের করুন।',
    boardHotRating: 5,
    commonMistakes: '(a - b)³ সূত্রে চিহ্নের ভুল করা।'
  },
  {
    id: 'form_phy_electricity',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    chapterName: '১১শ অধ্যায়: চল বিদ্যুৎ',
    formulaName: 'ওহমের সূত্র ও তড়িৎ ক্ষমতা সমীকরণ',
    formulaLatex: 'V = IR \n R_s = R₁ + R₂ + ... \n 1/R_p = 1/R₁ + 1/R₂ + ... \n P = VI = I²R = V²/R \n W = Pt (kWh / Unit)',
    unitsAndSymbols: [
      { symbol: 'V', meaning: 'বিভব পার্থক্য', unit: 'Volt (V)' },
      { symbol: 'I', meaning: 'তড়িৎ প্রবাহ', unit: 'Ampere (A)' },
      { symbol: 'R', meaning: 'রোধ', unit: 'Ohm (Ω)' },
      { symbol: 'P', meaning: 'তড়িৎ ক্ষমতা', unit: 'Watt (W)' },
      { symbol: 'W', meaning: 'ব্যয়িত শক্তি (Unit)', unit: 'kWh' }
    ],
    applicationTip: 'বিদ্যুৎ বিল নির্ণয়ের সূত্র: ইউনিট সংখ্যা = (মোট ওয়াট × ঘণ্টা) / ১০০০। বিল = ইউনিট × প্রতি ইউনিটের মূল্য।',
    boardHotRating: 5,
    commonMistakes: 'মিশ্র বর্তনীতে কোন রোধগুলো সমান্তরালে আর কোনগুলো শ্রেণিতে তা সঠিকভাবে শনাক্ত করতে ভুল করা।'
  }
];
