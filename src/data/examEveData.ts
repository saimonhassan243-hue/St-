/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CriticalFormula {
  id: string;
  subject: string;
  title: string;
  formula: string;
  variables: string;
  examApplicationTip: string;
  boardPriority: '⭐️⭐️⭐️ Super Hot' | '⭐️⭐️ High Priority';
}

export interface HighYieldCqPattern {
  id: string;
  subject: string;
  chapter: string;
  patternTitle: string;
  stemSample: string;
  stepByStepSolution: string[];
  commonPitfallsToAvoid: string;
  marksGuarantee: string;
}

export interface QuickReviewMcq {
  id: string;
  subject: string;
  question: string;
  correctAnswer: string;
  quickNote: string;
}

export interface EquipmentChecklistItem {
  id: string;
  title: string;
  category: 'mandatory' | 'stationery' | 'health_comfort';
  required: boolean;
  notes: string;
}

export const TOP_10_CRITICAL_FORMULAS: CriticalFormula[] = [
  {
    id: 'f_phy_1',
    subject: 'পদার্থবিজ্ঞান',
    title: 'গতির সমীকরণ ও পরন্ত বস্তু',
    formula: 's = ut + ½at²  এবং  v² = u² + 2as',
    variables: 'u = আদিবেগ, v = শেষবেগ, a = ত্বরণ (বা g = 9.8 m/s²), t = সময়, s = সরণ বা উচ্চতা h',
    examApplicationTip: 'স্থির অবস্থান বললে u = 0 ধরবে। খাড়া উপরের ক্ষেত্রে a = -g এবং সর্বোচ্চ উচ্চতায় v = 0।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_phy_2',
    subject: 'পদার্থবিজ্ঞান',
    title: 'ভরবেগের নিত্যতা ও সংঘর্ষ',
    formula: 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂  এবং  (m₁ + m₂)v (মিলিত বেগ)',
    variables: 'm₁, m₂ = ভর, u₁, u₂ = আদিবেগ, v₁, v₂ = শেষবেগ, v = মিলিত বেগ',
    examApplicationTip: 'বিপরীত দিকে আসলে যেকোনো একটি বেগকে ঋণাত্মক (-) ধরতে হবে। বন্দুক-গুলির ক্ষেত্রে আদি ভরবেগ = 0।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_phy_3',
    subject: 'পদার্থবিজ্ঞান',
    title: 'কর্মদক্ষতা (Efficiency) ও কার্যকর ক্ষমতা',
    formula: 'η = (P_out / P_in) × 100% = (W_out / W_in) × 100%',
    variables: 'P_out = কার্যকর ক্ষমতা (mgh / t), P_in = প্রদত্ত ক্ষমতা, η = কর্মদক্ষতা',
    examApplicationTip: 'পাম্পের পানির ভর m = V × ρ (যেখানে পানির ঘনত্ব ρ = 1000 kg/m³)।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_math_1',
    subject: 'সাধারণ গণিত',
    title: 'x⁵ + 1/x⁵ এর সার্বজনীন অনুসিদ্ধান্ত',
    formula: 'x⁵ + 1/x⁵ = (x³ + 1/x³)(x² + 1/x²) - (x + 1/x)',
    variables: 'x + 1/x এর মান প্রদত্ত থাকে (যেমন √3 বা 3)',
    examApplicationTip: 'প্রথমে পৃথকভাবে x² + 1/x² ও x³ + 1/x³ এর মান বের করে গুণ করবে।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_math_2',
    subject: 'সাধারণ গণিত',
    title: 'ত্রিকোণমিতিক অভেদ ও সম্পর্ক',
    formula: 'sin²θ + cos²θ = 1, sec²θ - tan²θ = 1, cosec²θ - cot²θ = 1',
    variables: 'θ = কোণ (0° ≤ θ ≤ 90°)',
    examApplicationTip: 'secθ + tanθ = x হলে secθ - tanθ = 1/x সরাসরি প্রয়োগ করা যায়।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_chem_1',
    subject: 'রসায়ন',
    title: 'আইসোটোপ প্রাচুর্য থেকে আপেক্ষিক পারমাণবিক ভর',
    formula: 'আপেক্ষিক ভর = (p × m + q × n) / 100',
    variables: 'p, q = আইসোটোপের ভরসংখ্যা; m, n = শতকরা প্রাচুর্য (%)',
    examApplicationTip: 'ক্লোরিন ³⁵Cl (75%) ও ³⁷Cl (25%) এর ক্ষেত্রে উত্তর সবসময় 35.5 আসে।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_chem_2',
    subject: 'রসায়ন',
    title: 'মোল সংখ্যা ও গ্যাসের মোলার আয়তন (STP)',
    formula: 'n = w / M = V / 22.4 = N / (6.023 × 10²³)',
    variables: 'w = ভর (g), M = আণবিক ভর, V = STP তে আয়তন (L), N = অণু/পরমাণু সংখ্যা',
    examApplicationTip: 'STP তে যেকোনো গ্যাসের ১ মোলের আয়তন ২২.৪ লিটার।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_hmath_1',
    subject: 'উচ্চতর গণিত',
    title: 'দ্বিপদী বিস্তৃতির সাধারণ পদ',
    formula: 'T_(r+1) = nCr × x^(n-r) × y^r',
    variables: '(x + y)^n বিস্তৃতিতে (r+1) তম পদ',
    examApplicationTip: 'x-বর্জিত বা ধ্রুবক পদের জন্য x এর ঘাতকে 0 এর সমান ধরতে হবে।',
    boardPriority: '⭐️⭐️ High Priority'
  },
  {
    id: 'f_math_stat',
    subject: 'সাধারণ গণিত',
    title: 'পরিসংখ্যানের সংক্ষিপ্ত পদ্ধতিতে গড় ও মধ্যক',
    formula: 'গড় x̄ = a + (Σfᵢuᵢ / N) × h  এবং  মধ্যক = L + (N/2 - F_c) / f_m × h',
    variables: 'a = অনুমিত গড়, uᵢ = ধাপ বিচ্যুতি, L = মধ্যক শ্রেণির নিম্নসীমা, F_c = যোজিত গণসংখ্যা',
    examApplicationTip: 'পরিসংখ্যান থেকে ১টি প্রশ্ন ফুল ১০ মার্কস নিশ্চিত করার সবচেয়ে সহজ জায়গা।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  },
  {
    id: 'f_phy_current',
    subject: 'পদার্থবিজ্ঞান',
    title: 'তড়িৎ প্রবাহ ও তুল্যরোধ',
    formula: 'I = V / R_eq  এবং  E = I(R + r), বিদ্যুৎ বিল W = (P × t) / 1000 kWh',
    variables: 'V = বিভব পার্থক্য, R = বর্তনীর রোধ, r = অভ্যন্তরীণ রোধ, W = শক্তি (ইউনিট)',
    examApplicationTip: 'শ্রেণি সমবায়ে R_s = R₁ + R₂, সমান্তরাল সমবায়ে 1/R_p = 1/R₁ + 1/R₂।',
    boardPriority: '⭐️⭐️⭐️ Super Hot'
  }
];

export const HIGH_YIELD_CQ_PATTERNS: HighYieldCqPattern[] = [
  {
    id: 'cq_pat_1',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'গতি ও কাজ শক্তি ক্ষমতা',
    patternTitle: 'মুক্তভাবে পরন্ত বস্তুর বিভিন্ন বিন্দুতে শক্তির সংরক্ষণশীলতা নীতি',
    stemSample: 'একটি ৫০০ গ্রাম ভরের বস্তুকে ভূমি হতে ৪০ মিটার উঁচু কোনো স্থান হতে মুক্তভাবে ফেলে দেওয়া হলো।',
    stepByStepSolution: [
      'ধাপ ১: সর্বোচ্চ বিন্দু A তে গতিশক্তি Ek = 0 এবং বিভব শক্তি Ep = mgh = 0.5 × 9.8 × 40 = 196 J। মোট শক্তি E_A = 196 J।',
      'ধাপ ২: কোনো মধ্যবর্তী বিন্দু B তে (যেমন ১০ মিটার নেমে আসলে) গতিশক্তি Ek = ½mv² = mgx = 0.5 × 9.8 × 10 = 49 J এবং Ep = mg(h-x) = 0.5 × 9.8 × 30 = 147 J। মোট শক্তি E_B = 49 + 147 = 196 J।',
      'ধাপ ৩: ভূমি স্পর্শ করার ঠিক পূর্বমুহূর্তে C বিন্দুতে Ep = 0 এবং Ek = mgh = 196 J। মোট শক্তি E_C = 196 J।',
      'ধাপ ৪: সিদ্ধান্ত: প্রতিটি বিন্দুতে মোট যান্ত্রিক শক্তি ধ্রুবক বা সংরক্ষিত থাকে।'
    ],
    commonPitfallsToAvoid: 'বস্তুর ভর গ্রামে (g) দেওয়া থাকলে তাকে অবশ্যই ১০০০ দিয়ে ভাগ করে কেজিতে (kg) নিতে হবে!',
    marksGuarantee: '১০ এ ১০ নিশ্চিত বোর্ড প্রশ্ন'
  },
  {
    id: 'cq_pat_2',
    subject: 'রসায়ন',
    chapter: 'পর্যায় সারণি ও মৌলের পর্যায়বৃত্ত ধর্ম',
    patternTitle: 'কাল্পনিক প্রতীকী মৌল দ্বারা আয়নীকরণ শক্তি ও পারমাণবিক আকারের তুলনা',
    stemSample: 'X(11), Y(12), Z(13) এবং W(19) চারটি প্রতীকী মৌল।',
    stepByStepSolution: [
      'ধাপ ১: মৌলগুলোর ইলেকট্রন বিন্যাস লিখবে: X=2,8,1 (Na), Y=2,8,2 (Mg), Z=2,8,3 (Al), W=2,8,8,1 (K)।',
      'ধাপ ২: পর্যায় ও গ্রুপ উল্লেখ করবে (X, Y, Z ৩য় পর্যায়; W ৪র্থ পর্যায়)।',
      'ধাপ ৩: একই পর্যায়ে ডানে গেলে কার্যকর নিউক্লীয় আধান বাড়ে এবং আকার ছোট হয়, তাই পারমাণবিক আকার: X > Y > Z।',
      'ধাপ ৪: আয়নীকরণ শক্তি আকার হ্রাসের কারণে বৃদ্ধি পায়: X < Z < Y (এখানে ম্যাগনেসিয়ামের পূর্ণ 3s² উপস্তর থাকায় Y এর IE বেশি)।'
    ],
    commonPitfallsToAvoid: 'ম্যাগনেসিয়াম (Y) ও অ্যালুমিনিয়াম (Z) এর মধ্যে আয়নীকরণ শক্তির ব্যতিক্রমে 3s² এর পূর্ণতার কারণ ব্যাখ্যা না করলে ১ নম্বর কাটা যায়।',
    marksGuarantee: 'বোর্ড ঘ-নম্বরে শতভাগ কমন'
  },
  {
    id: 'cq_pat_3',
    subject: 'সাধারণ গণিত',
    chapter: 'ত্রিকোণমিতিক অনুপাত ও অভেদ',
    patternTitle: 'tanθ + sinθ = m এবং tanθ - sinθ = n হলে m² - n² = 4√(mn) প্রমাণ',
    stemSample: 'p = tan A + sin A এবং q = tan A - sin A।',
    stepByStepSolution: [
      'ধাপ ১: বামপক্ষ L.H.S = p² - q² = (tanA + sinA)² - (tanA - sinA)²',
      'ধাপ ২: 4ab সূত্র প্রয়োগ: = 4 tanA sinA',
      'ধাপ ৩: বর্গমূল রূপান্তর: = 4 √(tan²A sin²A) = 4 √[tan²A (1 - cos²A)]',
      'ধাপ ৪: গুণফল বিস্তার: = 4 √(tan²A - tan²A cos²A) = 4 √(tan²A - sin²A) = 4 √[(tanA+sinA)(tanA-sinA)] = 4√(pq) = R.H.S [প্রমাণিত]।'
    ],
    commonPitfallsToAvoid: 'tan²A cos²A = sin²A রূপান্তরটি ব্র্যাকেটে সাইডনোট হিসেবে প্রদর্শন আবশ্যক।',
    marksGuarantee: 'গ-বিভাগে ৪ নম্বরের সুপার কমন'
  },
  {
    id: 'cq_pat_4',
    subject: 'সাধারণ গণিত',
    chapter: 'বৃত্তের উপপাদ্য (জ্যামিতি)',
    patternTitle: 'উপপাদ্য ২০: বৃত্তের একই চাপের উপর দণ্ডায়মান কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ',
    stemSample: 'O কেন্দ্রবিশিষ্ট বৃত্তে BC চাপের উপর দণ্ডায়মান কেন্দ্রস্থ কোণ ∠BOC এবং বৃত্তস্থ কোণ ∠BAC।',
    stepByStepSolution: [
      'ধাপ ১: বিশেষ নির্বচন ও পরিষ্কার বৃত্তের চিত্র পেন্সিল ও কম্পাস দিয়ে নিখুঁতভাবে অঙ্কন।',
      'ধাপ ২: অঙ্কন: মনে করি AC রেখাংশ কেন্দ্রগামী নয়। A বিন্দু দিয়ে কেন্দ্রগামী রেখাংশ AD আঁকি।',
      'ধাপ ৩: ΔAOB এ OA = OB (একই বৃত্তের ব্যাসার্ধ) বলে ∠OAB = ∠OBA। ত্রিভুজের বহিঃস্থ কোণ ∠BOD = ∠OAB + ∠OBA = 2∠OAB।',
      'ধাপ ৪: একইভাবে ΔAOC হতে বহিঃস্থ কোণ ∠COD = 2∠OAC। সমীকরণ দুটি যোগ করে: ∠BOD + ∠COD = 2(∠OAB + ∠OAC) => ∠BOC = 2∠BAC [প্রমাণিত]।'
    ],
    commonPitfallsToAvoid: 'চিত্র ছাড়া জ্যামিতির খাতায় কোনো নম্বর দেওয়া হয় না। অবশ্যই কম্পাস ব্যবহার করবে।',
    marksGuarantee: 'জ্যামিতিতে নিশ্চিত পূর্ণ নম্বর'
  },
  {
    id: 'cq_pat_5',
    subject: 'পদার্থবিজ্ঞান',
    chapter: 'চলতড়িৎ ও বর্তনী',
    patternTitle: 'মিশ্র বর্তনীর তুল্যরোধ, প্রতি রোধের মধ্য দিয়ে বিদ্যুৎ প্রবাহ ও বিলের হিসাব',
    stemSample: 'R₁=6Ω, R₂=12Ω সমান্তরালে এবং তাদের সাথে R₃=4Ω শ্রেণিতে যুক্ত হয়ে 24V উৎসের সাথে সংযুক্ত।',
    stepByStepSolution: [
      'ধাপ ১: সমান্তরাল অংশের তুল্যরোধ: 1/R_p = 1/6 + 1/12 = 3/12 => R_p = 4 Ω।',
      'ধাপ ২: সম্পূর্ণ বর্তনীর মোট তুল্যরোধ R_eq = R_p + R₃ = 4 + 4 = 8 Ω।',
      'ধাপ ৩: মোট তড়িৎপ্রবাহ I = V / R_eq = 24 / 8 = 3 A।',
      'ধাপ ৪: R₃ এর প্রবাহ = 3 A এবং সমান্তরাল শাখার বিভব V_p = I × R_p = 3 × 4 = 12 V। R₁ এর প্রবাহ I₁ = 12/6 = 2 A, R₂ এর প্রবাহ I₂ = 12/12 = 1 A।'
    ],
    commonPitfallsToAvoid: 'বিদ্যুৎ বিলের ক্ষেত্রে P কে কিলোওয়াটে নিতে ১০০০ দিয়ে ভাগ এবং সময়কে ঘণ্টায় গুণ করতে হবে।',
    marksGuarantee: '১০ মার্কসের পূর্ণ প্রশ্ন'
  }
];

export const FIFTY_ESSENTIAL_MCQS: QuickReviewMcq[] = [
  { id: 'q1', subject: 'পদার্থবিজ্ঞান', question: 'এসআই (SI) পদ্ধতিতে বলের একক কী?', correctAnswer: 'নিউটন (N)', quickNote: '1 N = 1 kg·m/s²' },
  { id: 'q2', subject: 'পদার্থবিজ্ঞান', question: 'মহাকর্ষীয় ধ্রুবক G এর মান কত?', correctAnswer: '6.673 × 10⁻¹¹ N·m²/kg²', quickNote: 'একক ও মাত্রা প্রায়ই এমসিকিউতে আসে' },
  { id: 'q3', subject: 'পদার্থবিজ্ঞান', question: 'শব্দ তরঙ্গের বেগ কোন মাধ্যমে সবচেয়ে বেশি?', correctAnswer: 'কঠিন মাধ্যমে', quickNote: 'কঠিন > তরল > বায়বীয় (শূন্য মাধ্যমে শব্দ চলে না)' },
  { id: 'q4', subject: 'পদার্থবিজ্ঞান', question: 'পানির ঘনত্ব সবচেয়ে বেশি কোন তাপমাত্রায়?', correctAnswer: '4° সেলসিয়াস (1000 kg/m³)', quickNote: 'ব্যতিক্রমী প্রসারণের কারণে' },
  { id: 'q5', subject: 'পদার্থবিজ্ঞান', question: '১ অশ্বক্ষমতা (1 Horse Power) সমান কত ওয়াট?', correctAnswer: '746 W', quickNote: '1 hp = 746 Watt' },

  { id: 'q6', subject: 'রসায়ন', question: 'নিউক্লিয়াসে কোন কোন কণা থাকে?', correctAnswer: 'প্রোটন ও নিউট্রন (একত্রে নিউক্লিয়ন)', quickNote: 'ইলেকট্রন নিউক্লিয়াসের বাইরে শক্তিস্তরে ঘোরে' },
  { id: 'q7', subject: 'রসায়ন', question: 'আধুনিক পর্যায় সারণিতে কয়টি পর্যায় ও কয়টি গ্রুপ আছে?', correctAnswer: '৭টি পর্যায় ও ১৮টি গ্রুপ', quickNote: 'মৌল সংখ্যা ১১৮টি' },
  { id: 'q8', subject: 'রসায়ন', question: 'কোন মৌলের তড়িৎ ঋণাত্মকতা সবচেয়ে বেশি?', correctAnswer: 'ফ্লোরিন (F = 4.0)', quickNote: 'দ্বিতীয় সর্বোচ্চ অক্সিজেন (O = 3.5)' },
  { id: 'q9', subject: 'রসায়ন', question: 'মরিচার সঠিক রাসায়নিক সংকেত কোনটি?', correctAnswer: 'Fe₂O₃·nH₂O', quickNote: 'হাইড্রেটেড ফেরিক অক্সাইড' },
  { id: 'q10', subject: 'রসায়ন', question: 'ভিনেগার বা সিরকায় কত শতাংশ অ্যাসিটিক এসিড থাকে?', correctAnswer: '৪% থেকে ১০% জলীয় দ্রবণ', quickNote: 'সংকেত CH₃COOH' },

  { id: 'q11', subject: 'সাধারণ গণিত', question: 'কোনো বৃত্তের পরিধি ও ব্যাসের অনুপাতকে কী বলে?', correctAnswer: 'পাই (π ≈ 3.1416)', quickNote: 'π একটি অমূলদ সংখ্যা' },
  { id: 'q12', subject: 'সাধারণ গণিত', question: 'বর্গের কর্ণের দৈর্ঘ্যের সূত্র কোনটি?', correctAnswer: '√2 × এক বাহুর দৈর্ঘ্য (√2 a)', quickNote: 'বর্গের ক্ষেত্রফল = a²' },
  { id: 'q13', subject: 'সাধারণ গণিত', question: 'log₁₀ 1 এর মান কত?', correctAnswer: '0 (শূন্য)', quickNote: 'log₁₀ 10 = 1 এবং log 1 = 0' },
  { id: 'q14', subject: 'সাধারণ গণিত', question: 'sin 90° এবং cos 0° এর মান কত?', correctAnswer: 'উভয়ের মান ১ (1)', quickNote: 'sin 0° = 0, cos 90° = 0' },
  { id: 'q15', subject: 'সাধারণ গণিত', question: 'একটি ত্রিভুজের তিন কোণের সমষ্টি কত?', correctAnswer: '১৮০° বা ২ সমকোণ', quickNote: 'চতুর্ভুজের চার কোণের সমষ্টি ৩৬০°' },

  { id: 'q16', subject: 'জীববিজ্ঞান', question: 'সালোকসংশ্লেষণের আলোক পর্যায়ের প্রধান উপাদান কী?', correctAnswer: 'সূর্যালোক ও ক্লোরোফিল', quickNote: 'অন্ধকার ধাপে কার্বন ডাই অক্সাইড বিজারিত হয়ে গ্লুকোজ তৈরি করে' },
  { id: 'q17', subject: 'জীববিজ্ঞান', question: 'মানুষের দেহে ক্রোমোজোম সংখ্যা কয়টি?', correctAnswer: '৪৬টি বা ২৩ জোড়া', quickNote: '২২ জোড়া অটোসোম ও ১ জোড়া সেক্স ক্রোমোজোম' },
  { id: 'q18', subject: 'জীববিজ্ঞান', question: 'রক্তের সার্বজনীন দাতা এবং গ্রহীতা গ্রুপ কোনটি?', correctAnswer: 'দাতা O-নেগেটিভ (বা O), গ্রহীতা AB-পজিটিভ (বা AB)', quickNote: 'বোর্ড এমসিকিউ সুপার রিপিট' },

  { id: 'q19', subject: 'আইসিটি', question: '১ কিলোবাইট (1 KB) সমান কত বাইট?', correctAnswer: '১০২৪ বাইট (1024 Bytes)', quickNote: '1 Byte = 8 bits' },
  { id: 'q20', subject: 'আইসিটি', question: 'ই-মেইলের পূর্ণরূপ কী?', correctAnswer: 'Electronic Mail', quickNote: 'ই-কমার্সের পূর্ণরূপ Electronic Commerce' }
];

export const EXAM_DAY_EQUIPMENT_CHECKLIST: EquipmentChecklistItem[] = [
  {
    id: 'eq_admit',
    title: 'মূল প্রবেশপত্র (Admit Card) ও ২ সেট ফটোকপি',
    category: 'mandatory',
    required: true,
    notes: 'অবশ্যই লেমিনেটবিহীন মূল কপিটি সাথে রাখবেন। স্বাক্ষর ও রোল নম্বর মিলিয়ে নেবেন।'
  },
  {
    id: 'eq_reg_card',
    title: 'বোর্ড রেজিস্ট্রেশন কার্ড (Registration Card)',
    category: 'mandatory',
    required: true,
    notes: 'এডমিট কার্ডের সাথে পিন বা পাউচে সুরক্ষিত রাখুন।'
  },
  {
    id: 'eq_pens',
    title: 'কালো কালির বলপেন (কমপক্ষে ৩-৪টি সচল পেন)',
    category: 'stationery',
    required: true,
    notes: 'কোনো জেল পেন বা লাল/সবুজ পেন ব্যবহার করবেন না। ২-১ দিন আগে লিখে স্মুথ করে রাখা ভালো।'
  },
  {
    id: 'eq_pencils',
    title: '2B / HB পেন্সিল (২টি), শার্পনার ও নরম ইরেজার',
    category: 'stationery',
    required: true,
    notes: 'বৃত্ত ভরাট ও চিত্র অঙ্কনের জন্য নিখুঁত পেন্সিল আবশ্যক।'
  },
  {
    id: 'eq_calc',
    title: 'বোর্ড অনুমোদিত নন-প্রোগ্রামেবল সায়েন্টিফিক ক্যালকুলেটর (fx-100MS / fx-991EX)',
    category: 'stationery',
    required: true,
    notes: 'ক্যালকুলেটরের ব্যাটারি চেক করে ফ্রেশ ব্যাটারি নিশ্চিত করুন।'
  },
  {
    id: 'eq_geometry',
    title: 'স্বচ্ছ স্কেল (১২ ইঞ্চি) ও জ্যামিতি বক্স (কম্পাস, চাঁদা)',
    category: 'stationery',
    required: true,
    notes: 'মার্জিন টানতে ও জ্যামিতির উপপাদ্য/সম্পাদ্যের জন্য স্বচ্ছ স্কেল জরুরি।'
  },
  {
    id: 'eq_pouch',
    title: 'সম্পূর্ণ স্বচ্ছ ট্রান্সপারেন্ট ফাইল বা জিপার পাউচ',
    category: 'stationery',
    required: true,
    notes: 'বোর্ড পরীক্ষা কেন্দ্রে অস্বচ্ছ ব্যাগ বা রঙিন বক্স নিয়ে প্রবেশ নিষিদ্ধ।'
  },
  {
    id: 'eq_watch',
    title: 'সাধারণ অ্যানালগ রিস্টওয়াচ (স্মার্টওয়াচ সম্পূর্ণ নিষিদ্ধ)',
    category: 'mandatory',
    required: true,
    notes: 'পরীক্ষার প্রতি ২০ মিনিট পর পর সময় ট্র্যাক করার জন্য অ্যানালগ ঘড়ি জরুরি।'
  },
  {
    id: 'eq_water',
    title: 'স্বচ্ছ লেবেলবিহীন পানির বোতল ও টিস্যু পেপার',
    category: 'health_comfort',
    required: false,
    notes: 'হাতের ঘাম মোছার জন্য টিস্যু ও মন শান্ত রাখতে পানি পান।'
  }
];
