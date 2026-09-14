/**
 * Pre-defined high-yield topics for SSC chapters to identify and track weak points
 */

export interface PredefinedTopic {
  id: string;
  topicTitle: string;
  topicTitleEn?: string;
  difficulty: 'High' | 'Medium' | 'Foundational';
  boardFrequency: '★★★★★' | '★★★★' | '★★★';
  hint: string;
}

export const PREDEFINED_CHAPTER_TOPICS: Record<string, PredefinedTopic[]> = {
  // === GENERAL MATH (সাধারণ গণিত) ===
  'math_1': [
    { id: 'math_1_t1', topicTitle: 'মূলদ ও অমূলদ সংখ্যা প্রমাণ (যেমন: √২ একটি অমূলদ সংখ্যা)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সৃজনশীল ক/খ নম্বরে প্রায়ই আসে' },
    { id: 'math_1_t2', topicTitle: 'আবৃত দশমিক ভগ্নাংশকে সাধারণ ভগ্নাংশে রূপান্তর', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'MCQ ও ক নম্বরের জন্য গুরুত্বপূর্ণ' },
    { id: 'math_1_t3', topicTitle: 'পরিমিতির দশমিক মানের আসন্ন মান ও তাৎপর্যপূর্ণ অঙ্ক', difficulty: 'Foundational', boardFrequency: '★★★', hint: 'বেসিক কনসেপ্ট' },
  ],
  'math_2': [
    { id: 'math_2_t1', topicTitle: 'সেট গঠন পদ্ধতি থেকে তালিকা পদ্ধতিতে রূপান্তর', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'ক ও খ প্রশ্নের প্রধান টাইপ' },
    { id: 'math_2_t2', topicTitle: 'শক্তি সেট (Power Set) ও উপসেট সংখ্যা ২ⁿ প্রমাণ', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'সৃজনশীলে প্রায় প্রতি বছর আসে' },
    { id: 'math_2_t3', topicTitle: 'অন্যায় ও ফাংশনের ডোমেন ও রেঞ্জ নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সৃজনশীল গ নম্বরে আসে' },
    { id: 'math_2_t4', topicTitle: 'f(1/x) বা f(y) সম্পর্কিত ফাংশনের মান নির্ণয় ও প্রমাণ', difficulty: 'High', boardFrequency: '★★★★', hint: 'চার মার্কসের গ নম্বর প্রশ্ন' },
  ],
  'math_3': [
    { id: 'math_3_t1', topicTitle: 'বীজগাণিতিক রাশির বর্গ ও ঘন সংবলিত সূত্র প্রয়োগ', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'ক ও খ টাইপ' },
    { id: 'math_3_t2', topicTitle: 'x + 1/x = a হলে x⁵ + 1/x⁵ ও x⁶ + 1/x⁶ এর মান', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সুপার হিট বোর্ড স্ট্যান্ডার্ড গ প্রশ্ন' },
    { id: 'math_3_t3', topicTitle: 'ভাগশেষ উপপাদ্য ও উৎপাদকে বিশ্লেষণ (Factorization)', difficulty: 'High', boardFrequency: '★★★★', hint: 'উৎপাদকের বিশেষ নিয়ম' },
    { id: 'math_3_t4', topicTitle: 'বাস্তবভিত্তিক সমস্যা সমাধানে বীজগাণিতিক সূত্র গঠন', difficulty: 'Medium', boardFrequency: '★★★', hint: 'অনুপাত ভিত্তিক ম্যাথ' },
  ],
  'math_4': [
    { id: 'math_4_t1', topicTitle: 'সূচকের নিয়মাবলি ও সরলীকরণ (Simplify with Indices)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'খ নম্বর প্রশ্ন' },
    { id: 'math_4_t2', topicTitle: 'লগারিদমের মৌলিক সূত্রাবলি ও মান নির্ণয় (Log properties)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'ক ও খ নম্বর প্রশ্ন' },
    { id: 'math_4_t3', topicTitle: 'লগের সৃজনশীল প্রমাণ (x^logy = y^logx ইত্যাদি)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বর প্রশ্ন' },
  ],
  'math_7': [
    { id: 'math_7_t1', topicTitle: 'ত্রিভুজের ভূমি, শিরঃকোণ ও অপর দুই বাহুর সমষ্টি থেকে ত্রিভুজ অঙ্কন', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সম্পাদ্য ১ ও ২' },
    { id: 'math_7_t2', topicTitle: 'ত্রিভুজের ভূমি সংলগ্ন কোণ ও অন্তর থেকে ত্রিভুজ অঙ্কন', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সম্পাদ্য ৩' },
    { id: 'math_7_t3', topicTitle: 'সামান্তরিক ও ট্রাপিজিয়াম অঙ্কন (অঙ্কনের বিবরণ সহ)', difficulty: 'High', boardFrequency: '★★★★', hint: 'সম্পাদ্য ও অনুশীলনী' },
  ],
  'math_8': [
    { id: 'math_8_t1', topicTitle: 'বৃত্তের একই চাপের উপর দণ্ডায়মান কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ', difficulty: 'High', boardFrequency: '★★★★★', hint: 'উপপাদ্য ২০' },
    { id: 'math_8_t2', topicTitle: 'বৃত্তে অন্তর্লিখিত চতুর্ভুজের বিপরীত কোণদ্বয়ের সমষ্টি দুই সমকোণ', difficulty: 'High', boardFrequency: '★★★★★', hint: 'উপপাদ্য ২৩' },
    { id: 'math_8_t3', topicTitle: 'স্পর্শক সংক্রান্ত সম্পাদ্য (বহিঃস্থ বিন্দু থেকে স্পর্শক অঙ্কন)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'সম্পাদ্য ৬ ও ৯' },
  ],
  'math_9': [
    { id: 'math_9_t1', topicTitle: 'ত্রিকোণমিতিক অনুপাতগুলোর মৌলিক অভেদাবলি প্রমাণ (৯.১)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'খ ও গ এর প্রমাণ' },
    { id: 'math_9_t2', topicTitle: '৩০°, ৪৫°, ৬০° কোণের ত্রিকোণমিতিক মান বসিয়ে সমাধান (৯.২)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'সমীকরণ সমাধান' },
    { id: 'math_9_t3', topicTitle: 'কোণের শর্তসাপেক্ষে θ এর মান নির্ণয় (0° < θ < 90°)', difficulty: 'High', boardFrequency: '★★★★', hint: 'সৃজনশীল গ' },
  ],
  'math_10': [
    { id: 'math_10_t1', topicTitle: 'উন্নতি কোণ ও অবনতি কোণ সংক্রান্ত চিত্র আঁকা', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'ক নম্বর প্রশ্নের চিত্র' },
    { id: 'math_10_t2', topicTitle: 'নদীর বিস্তার ও টাওয়ারের উচ্চতা নির্ণয় (দূরত্ব ও উচ্চতা)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'খ ও গ নম্বর' },
    { id: 'math_10_t3', topicTitle: 'ঝড়ে খুঁটি ভেঙে সম্পূর্ণ বিচ্ছিন্ন না হয়ে ভূমির সাথে কোণ তৈরি', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সবচেয়ে জনপ্রিয় বোর্ড প্রশ্ন' },
  ],
  'math_16': [
    { id: 'math_16_t1', topicTitle: 'ত্রিভুজ ও চতুর্ভুজক্ষেত্রের ক্ষেত্রফল (১৬.১ ও ১৬.২)', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'সূত্রের নিখুঁত প্রয়োগ' },
    { id: 'math_16_t2', topicTitle: 'বৃত্ত সংক্রান্ত ক্ষেত্রফল ও পরিধি (১৬.৩)', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'চাকার ঘূর্ণন ও দূরত্বের ম্যাথ' },
    { id: 'math_16_t3', topicTitle: 'ঘনবস্তু, বেলন ও সমবৃত্তভূমিক কোণকের সমগ্রতলের ক্ষেত্রফল ও আয়তন (১৬.৪)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বরের বড় ম্যাথ' },
  ],
  'math_17': [
    { id: 'math_17_t1', topicTitle: 'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয় (Short-cut Mean)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'খ নম্বরের ১০০% কমন প্রশ্ন' },
    { id: 'math_17_t2', topicTitle: 'মধ্যক ও প্রচুরক নির্ণয়ের সূত্র এবং প্রয়োগ (Median & Mode)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'খ ও গ নম্বর' },
    { id: 'math_17_t3', topicTitle: 'আয়তলেখ, গণসংখ্যা বহুভুজ ও অজিভ রেখা অঙ্কন (Ogive curve)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বরের গ্রাফ পেপার' },
  ],

  // === PHYSICS (পদার্থবিজ্ঞান) ===
  'phy_1': [
    { id: 'phy_1_t1', topicTitle: 'ভার্নিয়ার স্কেলের ভার্নিয়ার ধ্রুবক ও পাঠ নির্ণয়', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'স্কেল পাঠ ও ক্যালিবার্স' },
    { id: 'phy_1_t2', topicTitle: 'স্ক্রু-গজের পিচ ও লঘিষ্ঠ গণন নির্ণয় এবং ত্রুটি হিসাব', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'যন্ত্রের পাঠ' },
    { id: 'phy_1_t3', topicTitle: 'মাত্রা সমীকরণ প্রতিপাদন ও সঠিকতা যাচাই', difficulty: 'Foundational', boardFrequency: '★★★', hint: 'খ নম্বর' },
  ],
  'phy_2': [
    { id: 'phy_2_t1', topicTitle: 'গতির সমীকরণসমূহ প্রয়োগ করে দূরত্ব, বেগ ও সময় নির্ণয় (v = u+at, s = ut+½at²)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ ও ঘ নম্বরের গাণিতিক সমস্যা' },
    { id: 'phy_2_t2', topicTitle: 'বেগ-সময় (v-t) লেখচিত্র থেকে ত্বরণ, মন্দন ও অতিক্রান্ত দূরত্ব নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ্রাফিক্যাল এনালাইসিস' },
    { id: 'phy_2_t3', topicTitle: 'পরন্ত বস্তুর সূত্র ও উলম্ব গতিতে নিক্ষিপ্ত বস্তুর মিলনকাল', difficulty: 'High', boardFrequency: '★★★★★', hint: 'বাঘ-হরিণ বা গাড়ি-পুলিশ টাইপ প্রশ্ন' },
  ],
  'phy_3': [
    { id: 'phy_3_t1', topicTitle: 'নিউটনের দ্বিতীয় সূত্র ও বলের পরিমাপ (F = ma)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'খ ও গ' },
    { id: 'phy_3_t2', topicTitle: 'ভরবেগের সংরক্ষণশীলতা নীতি ও বন্দুকের পশ্চাৎবেগ নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ ও ঘ নম্বর' },
    { id: 'phy_3_t3', topicTitle: 'সংঘর্ষে গতিশক্তি সংরক্ষিত থাকে কি না গাণিতিক বিশ্লেষণ', difficulty: 'High', boardFrequency: '★★★★★', hint: 'স্থিতিস্থাপক বনাম অস্থিতিস্থাপক সংঘর্ষ' },
    { id: 'phy_3_t4', topicTitle: 'ঘর্ষণ বল ও ত্বরণের হিসাব (F - f_k = ma)', difficulty: 'High', boardFrequency: '★★★★', hint: 'ঘর্ষণ যুক্ত তলের ম্যাথ' },
  ],
  'phy_4': [
    { id: 'phy_4_t1', topicTitle: 'কাজ, বিভব শক্তি (Ep = mgh) ও গতিশক্তি (Ek = ½mv²) নির্ণয়', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'গাণিতিক সমস্যা' },
    { id: 'phy_4_t2', topicTitle: 'মুক্তভাবে পড়ন্ত বস্তুর ক্ষেত্রে শক্তির সংরক্ষণশীলতা প্রমাণ (সব বিন্দুতে মোট শক্তি ধ্রুবক)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'বোর্ড পরীক্ষার টপ কমন ঘ প্রশ্ন' },
    { id: 'phy_4_t3', topicTitle: 'পাম্পের ক্ষমতা (Power) ও কর্মদক্ষতা (η) নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: 'শক্তির অপচয় ও কর্মদক্ষতার ম্যাথ' },
  ],
  'phy_5': [
    { id: 'phy_5_t1', topicTitle: 'ঘনত্ব, চাপ এবং তরলের অভ্যন্তরে বিন্দুর চাপ (P = hρg)', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'গ নম্বর' },
    { id: 'phy_5_t2', topicTitle: 'প্যাসকেলের সূত্র ও হাইড্রোলিক প্রেসে বল বৃদ্ধিকরণ নীতি', difficulty: 'High', boardFrequency: '★★★★★', hint: 'পিস্টনের ব্যাস ও বলের অনুপাত' },
    { id: 'phy_5_t3', topicTitle: 'আর্কিমিডিসের নীতি ও প্লবতা (বস্তু ভাসবে না ডুববে গাণিতিক ব্যাখ্যা)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'সবচেয়ে বেশি আসা সৃজনশীল ঘ' },
  ],

  // === CHEMISTRY (রসায়ন) ===
  'chem_3': [
    { id: 'chem_3_t1', topicTitle: 'রাদারফোর্ড ও বোর পরমাণু মডেলের সীমাবদ্ধতা ও তুলনা', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'খ ও গ প্রশ্ন' },
    { id: 'chem_3_t2', topicTitle: 'আউফবাউ নীতি অনুযায়ী ইলেকট্রন বিন্যাস ও ব্যতিক্রম (Cr, Cu)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বরের ইলেকট্রন বিন্যাস' },
    { id: 'chem_3_t3', topicTitle: 'আইসোটোপের শতকরা প্রাচুর্য থেকে আপেক্ষিক পারমাণবিক ভর নির্ণয়', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'গ নম্বর ম্যাথ' },
  ],
  'chem_4': [
    { id: 'chem_4_t1', topicTitle: 'ইলেকট্রন বিন্যাস হতে মৌলের পর্যায় ও গ্রুপ নির্ণয়', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'ক ও খ প্রশ্ন' },
    { id: 'chem_4_t2', topicTitle: 'পর্যাবৃত্ত ধর্ম (পারমাণবিক আকার, আয়নিকরণ শক্তি, তড়িৎ ঋণাত্মকতা)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'বোর্ডের প্রিয় তুলনামূলক প্রশ্ন' },
    { id: 'chem_4_t3', topicTitle: 'গ্রুপ ১, ২, ১৭ ও ১৮ এর মৌলসমূহের বিশেষ বৈশিষ্ট্য', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'খার ধাতু ও হ্যালোজেন' },
  ],
  'chem_5': [
    { id: 'chem_5_t1', topicTitle: 'আয়নিক ও সমযোজী বন্ধন গঠনের ডায়াগ্রাম ও ব্যাখ্যা', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'গ নম্বর' },
    { id: 'chem_5_t2', topicTitle: 'আয়নিক ও সমযোজী যৌগের বৈশিষ্ট্য তুলনা (গলনাঙ্ক, দ্রাব্যতা, বিদ্যুৎ পরিবাহিতা)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'ঘ নম্বর প্রশ্ন' },
    { id: 'chem_5_t3', topicTitle: 'যোজ্যতা ও মুক্তজোড়/বন্ধনজোড় ইলেকট্রন গণনা', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'অণুর গঠন' },
  ],
  'chem_6': [
    { id: 'chem_6_t1', topicTitle: 'মোলের ধারণা ও মোল সংখ্যা নির্ণয় (n = w/M = V/22.4 = N/N_A)', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'গ নম্বর ম্যাথ' },
    { id: 'chem_6_t2', topicTitle: 'দ্রবণের মোলারিটি ও ঘনমাত্রা নির্ণয় (S = 1000w / MV)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বর ম্যাথ' },
    { id: 'chem_6_t3', topicTitle: 'শতকরা সংযুতি থেকে স্থূল সংকেত ও আণবিক সংকেত নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: 'চার মার্কসের অঙ্ক' },
    { id: 'chem_6_t4', topicTitle: 'বিক্রিয়ার লিমিটিং বিক্রিয়ক ও উৎপাদের শতকরা পরিমাণ হিসাব', difficulty: 'High', boardFrequency: '★★★★★', hint: 'বোর্ডের সুপার হিট ঘ নম্বর' },
  ],

  // === HIGHER MATH (উচ্চতর গণিত) ===
  'hmath_2': [
    { id: 'hmath_2_t1', topicTitle: 'বহুপদীর মাত্রা, মুখ্য সহগ ও ধ্রুবপদ নির্ণয়', difficulty: 'Foundational', boardFrequency: '★★★', hint: 'ক নম্বর' },
    { id: 'hmath_2_t2', topicTitle: 'ভাগশেষ উপপাদ্য ও উৎপাদক উপপাদ্য প্রয়োগ', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'খ নম্বর' },
    { id: 'hmath_2_t3', topicTitle: 'আংশিক ভগ্নাংশে প্রকাশ (Partial Fractions - ৫টি নিয়ম)', difficulty: 'High', boardFrequency: '★★★★★', hint: '১০০% নিশ্চিত ৪ নম্বরের প্রশ্ন' },
  ],
  'hmath_7': [
    { id: 'hmath_7_t1', topicTitle: 'অনন্ত গুণোত্তর ধারার অসীমতক সমষ্টি (S_∞) থাকার শর্ত ও নির্ণয়', difficulty: 'High', boardFrequency: '★★★★★', hint: '|r| < 1 শর্ত' },
    { id: 'hmath_7_t2', topicTitle: 'আবৃত দশমিক সংখ্যাকে মূলদীয় ভগ্নাংশে রূপান্তর', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'খ নম্বর' },
    { id: 'hmath_7_t3', topicTitle: 'x এর উপর কি শর্ত আরোপ করলে ধারাটির অসীমতক সমষ্টি থাকবে', difficulty: 'High', boardFrequency: '★★★★★', hint: 'বোর্ড স্ট্যান্ডার্ড গ প্রশ্ন' },
  ],
  'hmath_8': [
    { id: 'hmath_8_t1', topicTitle: 'রেডিয়ান কোণ একটি ধ্রুব কোণ প্রমাণ ও s = rθ সূত্র প্রয়োগ', difficulty: 'Medium', boardFrequency: '★★★★★', hint: '৮.১' },
    { id: 'hmath_8_t2', topicTitle: 'চতুর্ভাগ ও চিহ্নের নিয়ম অনুযায়ী ত্রিকোণমিতিক কোণ নির্ণয় (n.π/2 ± θ)', difficulty: 'High', boardFrequency: '★★★★★', hint: '৮.২' },
    { id: 'hmath_8_t3', topicTitle: 'ত্রিকোণমিতিক সমীকরণ সমাধান ও মান নির্ণয় (৮.৩)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বর প্রশ্ন' },
  ],
  'hmath_11': [
    { id: 'hmath_11_t1', topicTitle: 'দুই বিন্দুর দূরত্ব সূত্র ও ত্রিভুজ/চতুর্ভুজের প্রকৃতি যাচাই (১১.১)', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'ক ও খ' },
    { id: 'hmath_11_t2', topicTitle: 'স্থানাঙ্কের সাহায্যে বহুভুজের ক্ষেত্রফল নির্ণয় (ঘড়ির কাঁটার বিপরীত ক্রমে) (১১.২)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'খ ও গ' },
    { id: 'hmath_11_t3', topicTitle: 'সরলরেখার ঢাল ও সমীকরণ নির্ণয় (y - y1 = m(x - x1)) (১১.৩ ও ১১.৪)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ নম্বরের বড় ম্যাথ' },
  ],

  // === BIOLOGY (জীববিজ্ঞান) ===
  'bio_2': [
    { id: 'bio_2_t1', topicTitle: 'উদ্ভিদ ও প্রাণী কোষের অঙ্গাণুসমূহের চিহ্নিত চিত্র ও কাজ', difficulty: 'Medium', boardFrequency: '★★★★★', hint: 'চিত্র আঁকার প্র্যাকটিস' },
    { id: 'bio_2_t2', topicTitle: 'মাইটোকন্ড্রিয়া ও প্লাস্টিডের গঠন ও গুরুত্ব', difficulty: 'High', boardFrequency: '★★★★★', hint: 'খ ও গ নম্বর' },
    { id: 'bio_2_t3', topicTitle: 'উদ্ভিদ টিস্যু (সরল ও জটিল) এবং স্নায়ু টিস্যুর গঠন', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'জাইলেম-ফ্লোয়েম' },
  ],
  'bio_4': [
    { id: 'bio_4_t1', topicTitle: 'সালোকসংশ্লেষণের আলোক ও অন্ধকার পর্যায় (ক্যালভিন চক্র ও হ্যাচ-স্ল্যাক চক্র)', difficulty: 'High', boardFrequency: '★★★★★', hint: 'গ ও ঘ নম্বর' },
    { id: 'bio_4_t2', topicTitle: 'শ্বসনের ধাপসমূহ (গ্লাইকোলাইসিস, ক্রেবস চক্র ও মোট ATP হিসাব)', difficulty: 'High', boardFrequency: '★★★★★', hint: '৩৮টি এটিপি হিসাব' },
    { id: 'bio_4_t3', topicTitle: 'সালোকসংশ্লেষণ ও শ্বসনের প্রভাবকসমূহ এবং গুরুত্ব', difficulty: 'Medium', boardFrequency: '★★★★', hint: 'তুলনামূলক প্রশ্ন' },
  ],
};

/**
 * Helper to get or generate predefined topics for any chapter
 */
export function getTopicsForChapter(chapterId: string, chapterName: string, subjectName: string): PredefinedTopic[] {
  if (PREDEFINED_CHAPTER_TOPICS[chapterId]) {
    return PREDEFINED_CHAPTER_TOPICS[chapterId];
  }

  // Fallback intelligent topic generator based on chapter name
  return [
    {
      id: `${chapterId}_t1`,
      topicTitle: `${chapterName} এর মূল কনসেপ্ট ও বই রিডিং`,
      difficulty: 'Foundational',
      boardFrequency: '★★★★',
      hint: 'মূল বইয়ের পাঠ ও সংজ্ঞাসমূহ আত্মস্থকরণ',
    },
    {
      id: `${chapterId}_t2`,
      topicTitle: `বোর্ড পরীক্ষায় আসা গুরূত্বপূর্ণ সৃজনশীল (CQ) প্রশ্ন টাইপ`,
      difficulty: 'High',
      boardFrequency: '★★★★★',
      hint: 'বিগত ৫ বছরের বোর্ড পরীক্ষার খ ও গ নম্বর প্রশ্ন সমাধান',
    },
    {
      id: `${chapterId}_t3`,
      topicTitle: `বহুনির্বাচনী প্রশ্ন (MCQ) ও দ্রুত সূত্র প্রয়োগের টেকনিক`,
      difficulty: 'Medium',
      boardFrequency: '★★★★★',
      hint: 'শর্টকাট ও ব্যতিক্রমী তথ্য মনে রাখা',
    },
    {
      id: `${chapterId}_t4`,
      topicTitle: `${chapterName} সংশ্লিষ্ট উচ্চতর দক্ষতা ও চিত্র/ব্যাখ্যামূলক প্রশ্ন`,
      difficulty: 'High',
      boardFrequency: '★★★★',
      hint: 'ঘ নম্বরের ৪ মার্কসের বিশ্লেষণধর্মী উত্তর তৈরি',
    },
  ];
}
