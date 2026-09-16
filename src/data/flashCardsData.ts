/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FlashCardItem {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCategory: 'physics' | 'chemistry' | 'math' | 'hmath' | 'biology' | 'bgs' | 'bangla' | 'english';
  topic: string;
  question: string;
  answer: string;
  formulaOrKey?: string;
  boardImportance: '★★★' | '★★';
  hint?: string;
}

export const FLASH_CARDS_DATA: FlashCardItem[] = [
  // Physics
  {
    id: 'phy_01',
    subjectId: 'physics',
    subjectName: 'পদার্থবিজ্ঞান',
    subjectCategory: 'physics',
    topic: 'গতি ও সমীকরণ',
    question: 'সুষম ত্বরণে চলমান বস্তুর সরণ, বেগ ও ত্বরণের সম্পর্কযুক্ত প্রধান ৪টি সূত্র কী কী?',
    answer: '১. v = u + at\n২. s = ((u + v)/2) × t\n৩. s = ut + ½at²\n৪. v² = u² + 2as',
    formulaOrKey: 'v² = u² + 2as, s = ut + ½at²',
    boardImportance: '★★★',
    hint: 'গতিশক্তি ও বলের গাণিতিক সমস্যায় সার্বক্ষণিক প্রয়োগ হয়।'
  },
  {
    id: 'phy_02',
    subjectId: 'physics',
    subjectName: 'পদার্থবিজ্ঞান',
    subjectCategory: 'physics',
    topic: 'বল ও নিউটনের সূত্র',
    question: 'নিউটনের গতির দ্বিতীয় সূত্র এবং বলের পরিমাপ সমীকরণটি বিবৃত করো।',
    answer: 'বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে বস্তুর ভরবেগের পরিবর্তনও সেদিকে ঘটে।\nগাণিতিক রূপ: F = ma (যেখানে m=ভর, a=ত্বরণ)।',
    formulaOrKey: 'F = ma = m(v - u)/t',
    boardImportance: '★★★',
    hint: 'ঘাতবল = বল × সময় = ভরবেগের পরিবর্তন।'
  },
  {
    id: 'phy_03',
    subjectId: 'physics',
    subjectName: 'পদার্থবিজ্ঞান',
    subjectCategory: 'physics',
    topic: 'কাজ, ক্ষমতা ও শক্তি',
    question: 'কর্মদক্ষতা (Efficiency) এবং বিভব শক্তির গাণিতিক সূত্র কী?',
    answer: 'কর্মদক্ষতা (η) = (লভ্য কার্যকর শক্তি / মোট প্রদত্ত শক্তি) × ১০০%\nবিভব শক্তি E_p = mgh, গতিশক্তি E_k = ½mv²',
    formulaOrKey: 'η = (P_out / P_in) × 100%, E_k = ½mv²',
    boardImportance: '★★★',
    hint: '১ অশ্বক্ষমতা (1 HP) = 746 Watt।'
  },
  {
    id: 'phy_04',
    subjectId: 'physics',
    subjectName: 'পদার্থবিজ্ঞান',
    subjectCategory: 'physics',
    topic: 'পদার্থের অবস্থা ও চাপ',
    question: 'আর্কিমিডিসের নীতি এবং প্লবতার সমীকরণটি কী?',
    answer: 'কোনো বস্তুকে স্থির তরল বা বায়বীয় পদার্থে আংশিক বা সম্পূর্ণ নিমজ্জিত করলে বস্তুটি কিছু ওজন হারায়। এই হারানো ওজন বস্তু কর্তৃক অপসারিত তরলের ওজনের সমান।\nপ্লবতা F_B = Vρg (যেখানে V=আয়তন, ρ=ঘনত্ব, g=অভিকর্ষজ ত্বরণ)।',
    formulaOrKey: 'F_B = Vρg, P = hρg',
    boardImportance: '★★★',
    hint: 'ভাসন ও নিমজ্জনের শর্ত: W > F_B হলে ডুববে, W = F_B নিমজ্জিত হয়ে ভাসবে।'
  },
  {
    id: 'phy_05',
    subjectId: 'physics',
    subjectName: 'পদার্থবিজ্ঞান',
    subjectCategory: 'physics',
    topic: 'চল বিদ্যুৎ',
    question: 'ওহমের সূত্র ও রোধের সূত্রাবলি কী?',
    answer: 'নির্দিষ্ট তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎ প্রবাহ পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক (I = V/R)।\nতড়িৎ ক্ষমতা: P = VI = I²R = V²/R।\nতুল্য রোধ: শ্রেণি R_s = R₁ + R₂ + ...; সমান্তরাল 1/R_p = 1/R₁ + 1/R₂ + ...',
    formulaOrKey: 'V = IR, P = I²R, E = (P × t) / 1000 kWh',
    boardImportance: '★★★',
    hint: '১ ইউনিট বিদ্যুৎ খরচ = ১ kWh = ৩.৬ × ১০⁶ জুল।'
  },

  // Chemistry
  {
    id: 'chem_01',
    subjectId: 'chemistry',
    subjectName: 'রসায়ন',
    subjectCategory: 'chemistry',
    topic: 'মোলের ধারণা ও রাসায়নিক গণনা',
    question: 'মোল সংখ্যা (n) গণনার সার্বজনীন রূপান্তর সূত্রাবলি কী?',
    answer: 'মোল সংখ্যা n = W / M = V (Litre, STP) / 22.4 = N / N_A = S × V(Litre)\nযেখানে W=ভর, M=আণবিক ভর, N_A = 6.023 × 10²³, S=মোলারিটি।',
    formulaOrKey: 'n = W/M = V/22.4 = N/6.023×10²³ = SV',
    boardImportance: '★★★',
    hint: 'মোলারিটি S = (1000 × W) / (M × V_mL)।'
  },
  {
    id: 'chem_02',
    subjectId: 'chemistry',
    subjectName: 'রসায়ন',
    subjectCategory: 'chemistry',
    topic: 'পর্যায় সারণি',
    question: 'পর্যায় সারণিতে পারমাণবিক ব্যাসার্ধ, আয়নীকরণ শক্তি ও তড়িৎ ঋণাত্মকতার পর্যায়বৃত্ত পরিবর্তন কীরূপ?',
    answer: '১. পারমাণবিক ব্যাসার্ধ: একই পর্যায়ে বাম থেকে ডানে কমবে, একই গ্রুপে ওপর থেকে নিচে বাড়বে।\n২. আয়নীকরণ শক্তি ও তড়িৎ ঋণাত্মকতা: বাম থেকে ডানে বাড়বে, ওপর থেকে নিচে কমবে।',
    formulaOrKey: 'ব্যাসার্ধ ∝ ১ / আয়নীকরণ শক্তি',
    boardImportance: '★★★',
    hint: 'হিলিয়াম (He) এর আয়নীকরণ শক্তি সর্বাধিক, ফ্লোরিন (F) সর্বাধিক তড়িৎ ঋণাত্মক।'
  },
  {
    id: 'chem_03',
    subjectId: 'chemistry',
    subjectName: 'রসায়ন',
    subjectCategory: 'chemistry',
    topic: 'খনিজ সম্পদ ও জীবাশ্ম',
    question: 'অ্যালকেন, অ্যালকিন, অ্যালকাইন এবং অ্যালকোহলের সাধারণ আণবিক সংকেত কী?',
    answer: '• অ্যালকেন: CₙH₂ₙ₊₂\n• অ্যালকিন: CₙH₂ₙ\n• অ্যালকাইন: CₙH₂ₙ₋₂\n• অ্যালকোহল: CₙH₂ₙ₊₁OH\n• ফ্যাটি এসিড: CₙH₂ₙ₊₁COOH',
    formulaOrKey: 'C_n H_{2n+2}, C_n H_{2n}, C_n H_{2n-2}',
    boardImportance: '★★★',
    hint: 'ব্রোমিন দ্রবণ পরীক্ষা (লাল বর্ণ দূর হওয়া) দ্বারা অসম্পৃক্ততা প্রমাণ করা হয়।'
  },

  // General Math
  {
    id: 'math_01',
    subjectId: 'general_math',
    subjectName: 'সাধারণ গণিত',
    subjectCategory: 'math',
    topic: 'ত্রিকোণমিতিক অনুপাত',
    question: 'ত্রিকোণমিতির মৌলিক অভেদাবলি (Pythagorean Identities) কী কী?',
    answer: '১. sin²θ + cos²θ = 1\n২. sec²θ - tan²θ = 1 ⇒ sec²θ = 1 + tan²θ\n৩. cosec²θ - cot²θ = 1 ⇒ cosec²θ = 1 + cot²θ',
    formulaOrKey: 'sin²θ + cos²θ = 1, tan θ = sin θ / cos θ',
    boardImportance: '★★★',
    hint: 'tan 45° = 1, sin 30° = 1/2, cos 60° = 1/2, sin 90° = 1।'
  },
  {
    id: 'math_02',
    subjectId: 'general_math',
    subjectName: 'সাধারণ গণিত',
    subjectCategory: 'math',
    topic: 'পরিসংখ্যান',
    question: 'বিন্যস্ত উপাত্তের মধ্যক ও প্রচুরক নির্ণয়ের সূত্র কী?',
    answer: 'মধ্যক = L + [ (N/2 - F_c) / f_m ] × h\nপ্রচুরক = L + [ f₁ / (f₁ + f₂) ] × h\nযেখানে L=শ্রেণির নিম্নসীমা, F_c=পূর্ববর্তী ক্রমযোজিত গণসংখ্যা, f_m=মধ্যক শ্রেণির গণসংখ্যা, h=শ্রেণি ব্যবধান।',
    formulaOrKey: 'Median = L + [(N/2 - F_c)/f_m] × h',
    boardImportance: '★★★',
    hint: 'f₁ = f_0 - f_1, f₂ = f_0 - f_2।'
  },
  {
    id: 'math_03',
    subjectId: 'general_math',
    subjectName: 'সাধারণ গণিত',
    subjectCategory: 'math',
    topic: 'সমান্তর ও গুণোত্তর ধারা',
    question: 'সমান্তর ধারার n-তম পদ ও n পদের সমষ্টির সূত্র কী?',
    answer: 'n-তম পদ = a + (n - 1)d\nn পদের সমষ্টি S_n = (n / 2) [ 2a + (n - 1)d ]\nগুণোত্তর ধারার n-তম পদ = arⁿ⁻¹\nসমষ্টি S_n = a(rⁿ - 1)/(r - 1) [যখন r > 1] অথবা a(1 - rⁿ)/(1 - r) [যখন r < 1]',
    formulaOrKey: 'S_n = (n/2)[2a + (n-1)d], n-th = a + (n-1)d',
    boardImportance: '★★★',
    hint: 'স্বাভাবিক সংখ্যার সমষ্টি = n(n+1)/2, বর্গের সমষ্টি = n(n+1)(2n+1)/6।'
  },

  // Higher Math
  {
    id: 'hmath_01',
    subjectId: 'higher_math',
    subjectName: 'উচ্চতর গণিত',
    subjectCategory: 'hmath',
    topic: 'স্থানাঙ্ক জ্যামিতি',
    question: 'দুটি বিন্দুর মধ্যবর্তী দূরত্ব, ঢাল এবং ত্রিভুজের ক্ষেত্রফলের সূত্র কী?',
    answer: 'দূরত্ব d = √[(x₂ - x₁)² + (y₂ - y₁)²]\nসরলরেখার ঢাল m = (y₂ - y₁) / (x₂ - x₁) = tan θ\nত্রিভুজের ক্ষেত্রফল = ½ |x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂)|',
    formulaOrKey: 'd = √[(Δx)² + (Δy)²], m = Δy / Δx',
    boardImportance: '★★★',
    hint: 'পরস্পর লম্ব রেখার ঢালদ্বয়ের গুণফল m₁ × m₂ = -1।'
  },
  {
    id: 'hmath_02',
    subjectId: 'higher_math',
    subjectName: 'উচ্চতর গণিত',
    subjectCategory: 'hmath',
    topic: 'দ্বিপদী বিস্তৃতি ও ভেক্টর',
    question: '(a + x)ⁿ এর দ্বিপদী বিস্তৃতি এবং ভেক্টর ডট ও ক্রস গুণনের শর্ত কী?',
    answer: 'T_{r+1} = ⁿC_r · aⁿ⁻ʳ · xʳ\nভেক্টর ডট গুণন: A · B = |A||B| cos θ (লম্ব হলে A · B = 0)\nভেক্টর ক্রস গুণন: |A × B| = |A||B| sin θ (সমান্তরাল হলে A × B = 0)',
    formulaOrKey: 'A · B = A_x B_x + A_y B_y + A_z B_z = 0',
    boardImportance: '★★★',
    hint: 'একক ভেক্টর â = A / |A|।'
  },

  // Biology
  {
    id: 'bio_01',
    subjectId: 'biology',
    subjectName: 'জীববিজ্ঞান',
    subjectCategory: 'biology',
    topic: 'কোষ বিভাজন',
    question: 'মাইটোসিস ও মিয়োসিস কোষ বিভাজনের প্রধান পার্থক্য ও তাৎপর্য কী?',
    answer: 'মাইটোসিস: দেহকোষে ঘটে, সমীকরণিক বিভাজন (ক্রোমোজোম সংখ্যা অপরিবর্তিত থাকে 2n → 2n), দৈহিক বৃদ্ধিতে কাজ করে।\nমিয়োসিস: জনন মাতৃকোষে ঘটে, হ্রাসমূলক বিভাজন (ক্রোমোজোম সংখ্যা অর্ধেক হয় 2n → n), গ্যামেট সৃষ্টি ও প্রজাতির ধারাবাহিকতা রক্ষা করে।',
    formulaOrKey: 'Mitosis (2n → 2n), Meiosis (2n → n)',
    boardImportance: '★★★',
    hint: 'ক্রসিং ওভার মিয়োসিস-১ এর প্যাকাইটিন উপ-পর্যায়ে ঘটে।'
  },
  {
    id: 'bio_02',
    subjectId: 'biology',
    subjectName: 'জীববিজ্ঞান',
    subjectCategory: 'biology',
    topic: 'জীবনীশক্তি ও সালোকসংশ্লেষণ',
    question: 'সালোকসংশ্লেষণের সামগ্রিক রাসায়নিক বিক্রিয়া এবং ক্যালভিন চক্রের প্রথম স্থায়ী পদার্থ কী?',
    answer: 'বিক্রিয়া: 6CO₂ + 12H₂O + আলো/ক্লোরোফিল → C₆H₁₂O₆ + 6H₂O + 6O₂\nC₃ চক্রে (Calvin cycle) প্রথম স্থায়ী পদার্থ: ৩-ফসফোগ্লিসারিক এসিড (3-PGA)\nC₄ চক্রে প্রথম স্থায়ী পদার্থ: অক্সালোঅ্যাসিটিক এসিড (OAA)',
    formulaOrKey: '6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂',
    boardImportance: '★★★',
    hint: 'আলোক পর্যায়ে ATP ও NADPH+H⁺ তৈরি হয় যাকে আত্তীকরণ শক্তি বলে।'
  },

  // Bangla & English
  {
    id: 'bng_01',
    subjectId: 'bangla',
    subjectName: 'বাংলা ব্যাকরণ',
    subjectCategory: 'bangla',
    topic: 'সমাস ও প্রত্যয়',
    question: 'দ্বন্দ্ব, কর্মধারয়, দ্বিগু ও বহুব্রীহি সমাস চেনার সহজ টেকনিক কী?',
    answer: '• দ্বন্দ্ব: উভয় পদের অর্থ প্রধান (মা-বাবা)\n• কর্মধারয়: পরপদের অর্থ প্রধান ও তুলনামূলক (নীলপদ্ম)\n• দ্বিগু: সংখ্যাবাচক শব্দ পূর্বে বসে সমাহার বোঝায় (তেমাথা)\n• বহুব্রীহি: পূর্ব বা পরপদের অর্থ না বুঝিয়ে ভিন্ন অর্থ বোঝায় (দশ আনন যার = দশানন/রাবণ)',
    formulaOrKey: 'দ্বন্দ্ব=উভয়পদ, কর্মধারয়/তৎপুরুষ/দ্বিগু=পরপদ, অব্যয়ীভাব=পূর্বপদ, বহুব্রীহি=অন্যপদ',
    boardImportance: '★★★',
    hint: 'নঞর্থক বহুব্রীহিতে না-বোধক অব্যয় পূর্বে বসে।'
  },
  {
    id: 'eng_01',
    subjectId: 'english',
    subjectName: 'English Grammar',
    subjectCategory: 'english',
    topic: 'Right Form of Verbs & Conditionals',
    question: 'Conditional Sentences এর ৩টি গোল্ডেন রুল কী কী?',
    answer: '1st Conditional: If + Present Indefinite + Future Indefinite (If it rains, we will stay).\n2nd Conditional: If + Past Indefinite + Subject + would/could + V₁ (If I had money, I would help).\n3rd Conditional: If + Past Perfect + Subject + would have/could have + V₃ (If you had called, I would have come).',
    formulaOrKey: 'If + Past Perfect → Sub + would have + V₃',
    boardImportance: '★★★',
    hint: 'No sooner had... than, Scarcely had... when এর পর Past Indefinite বসে।'
  }
];
