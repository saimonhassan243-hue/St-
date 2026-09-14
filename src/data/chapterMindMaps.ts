/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MindMapNode {
  id: string;
  title: string;
  type: 'root' | 'branch' | 'leaf' | 'formula' | 'warning';
  description?: string;
  formula?: string;
  badge?: string;
  children?: MindMapNode[];
}

export interface ChapterMindMap {
  id: string;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  subjectName: string;
  coreTheme: string;
  rootNode: MindMapNode;
}

export const CHAPTER_MIND_MAPS: ChapterMindMap[] = [
  {
    id: 'mm_phy_motion',
    chapterId: 'ch_phy_2',
    chapterName: '২য় অধ্যায়: গতি (Motion)',
    subjectId: 'phy',
    subjectName: 'পদার্থবিজ্ঞান',
    coreTheme: 'গতি, রাশিমালা, সমীকরণ ও লেখচিত্রের সম্পূর্ণ ভিজুয়াল মানচিত্র',
    rootNode: {
      id: 'phy2_root',
      title: 'গতি (Motion)',
      type: 'root',
      description: 'স্থির ও গতিশীল অবস্থার মৌলিক সূত্রাবলি ও গ্রাফ',
      children: [
        {
          id: 'phy2_branch1',
          title: '১. স্কেলার ও ভেক্টর রাশি',
          type: 'branch',
          badge: 'মৌলিক ভিত্তি',
          children: [
            { id: 'phy2_b1_1', title: 'দূরত্ব (Distance)', type: 'leaf', description: 'স্কেলার রাশি, দিকবিহীন অতিক্রান্ত মোট পথ (মিটার)' },
            { id: 'phy2_b1_2', title: 'সরণ (Displacement)', type: 'leaf', description: 'ভেক্টর রাশি, আদি ও শেষ অবস্থানের মধ্যকার ন্যূনতম সরলরৈখিক দূরত্ব' },
            { id: 'phy2_b1_3', title: 'দ্রুতি vs বেগ', type: 'leaf', description: 'দ্রুতি = দূরত্ব / সময় (স্কেলার), বেগ = সরণ / সময় (ভেক্টর)' }
          ]
        },
        {
          id: 'phy2_branch2',
          title: '২. গতির ৪টি মৌলিক সমীকরণ',
          type: 'branch',
          badge: '★ ১০০% CQ হটস্পট',
          children: [
            { id: 'phy2_f1', title: '১ম সমীকরণ', type: 'formula', formula: 'v = u + at', description: 'সময় ও বেগের সম্পর্ক' },
            { id: 'phy2_f2', title: '২য় সমীকরণ', type: 'formula', formula: 's = ut + ½at²', description: 'দূরত্ব ও সময়ের সম্পর্ক' },
            { id: 'phy2_f3', title: '৩য় সমীকরণ', type: 'formula', formula: 'v² = u² + 2as', description: 'সময় (t) অনুপস্থিত থাকলে প্রযোজ্য' },
            { id: 'phy2_f4', title: '৪র্থ সমীকরণ', type: 'formula', formula: 's = ((u + v) / 2) × t', description: 'গড় বেগের সাহায্যে দূরত্ব' }
          ]
        },
        {
          id: 'phy2_branch3',
          title: '৩. পরন্ত ও নিক্ষিপ্ত বস্তু',
          type: 'branch',
          badge: 'মাধ্যাকর্ষণ g = 9.8',
          children: [
            { id: 'phy2_b3_1', title: 'গ্যালিলিওর ৩টি সূত্র', type: 'leaf', description: '১. সমান সময়ে সমান পথ, ২. বেগ সময়ের সমানুপাতিক (v ∝ t), ৩. দূরত্ব দূরত্বের বর্গের সমানুপাতিক (h ∝ t²)' },
            { id: 'phy2_f5', title: 'সর্বোচ্চ উচ্চতা ও সময়', type: 'formula', formula: 'H_max = u² / 2g , T_total = 2u / g', description: 'খাড়া উপরে নিক্ষেপের ক্ষেত্রে' }
          ]
        },
        {
          id: 'phy2_branch4',
          title: '৪. লেখচিত্র (v-t & s-t Graphs)',
          type: 'branch',
          badge: 'বোর্ড ঘ-নম্বর প্রশ্ন',
          children: [
            { id: 'phy2_b4_1', title: 'v-t গ্রাফের ঢাল (Slope)', type: 'leaf', description: 'ঢাল = ত্বরণ (Acceleration)' },
            { id: 'phy2_b4_2', title: 'v-t গ্রাফের ক্ষেত্রফল', type: 'leaf', description: 'সীমাবদ্ধ অঞ্চলের ক্ষেত্রফল = মোট অতিক্রান্ত দূরত্ব (s)' },
            { id: 'phy2_w1', title: 'সতর্কতা / কমন ভুল', type: 'warning', description: 'km/h থাকলে অবশ্যই 1000/3600 (বা 3.6 দিয়ে ভাগ) করে m/s এ রূপান্তর করে নিতে হবে!' }
          ]
        }
      ]
    }
  },
  {
    id: 'mm_chem_periodic',
    chapterId: 'ch_chem_4',
    chapterName: '৪র্থ অধ্যায়: পর্যায় সারণি',
    subjectId: 'chem',
    subjectName: 'রসায়ন',
    coreTheme: 'পর্যায় সারণির পটভূমি, ইলেকট্রন বিন্যাস ও পর্যায়বৃত্ত ধর্মের মানচিত্র',
    rootNode: {
      id: 'chem4_root',
      title: 'পর্যায় সারণি (Periodic Table)',
      type: 'root',
      description: '১১৮টি মৌলের বৈশিষ্ট্য, অবস্থান ও ধর্মের ছন্দবদ্ধ বিন্যাস',
      children: [
        {
          id: 'chem4_b1',
          title: '১. পর্যায় সারণির পরিচিতি',
          type: 'branch',
          badge: '৭টি পর্যায়, ১৮টি গ্রুপ',
          children: [
            { id: 'chem4_l1', title: 'পর্যায় সংখ্যা', type: 'leaf', description: 'সর্বোচ্চ প্রধান কোয়ান্টাম সংখ্যা (n)' },
            { id: 'chem4_l2', title: 'গ্রুপ নির্ধারণের নিয়ম', type: 'leaf', description: 's-ব্লক: s ইলেকট্রন সংখ্যা; p-ব্লক: s + p + 10; d-ব্লক: (n-1)d + ns' }
          ]
        },
        {
          id: 'chem4_b2',
          title: '২. পর্যায়বৃত্ত ধর্মাবলি',
          type: 'branch',
          badge: '★ সুপার হট CQ',
          children: [
            { id: 'chem4_p1', title: 'পারমাণবিক আকার / ব্যাসার্ধ', type: 'leaf', description: 'পর্যায়ে বাম→ডানে হ্রাস পায়, গ্রুপে উপর→নিচে বৃদ্ধি পায়' },
            { id: 'chem4_p2', title: 'আয়নাকরণ শক্তি (IE)', type: 'leaf', description: 'পর্যায়ে বাম→ডানে বৃদ্ধি পায়, গ্রুপে উপর→নিচে হ্রাস পায় (ব্যতিক্রম: Be > B, N > O)' },
            { id: 'chem4_p3', title: 'তড়িৎ ঋণাত্মকতা (EN)', type: 'leaf', description: 'সমযোজী বন্ধনের ইলেকট্রন মেঘ নিজের দিকে আকর্ষণের ক্ষমতা (ফ্লোরিন F = ৪.০ সর্বোচ্চ)' }
          ]
        },
        {
          id: 'chem4_b3',
          title: '৩. বিশেষ বৈশিষ্ট্যের মৌলসমূহ',
          type: 'branch',
          badge: 'নামকরণ ও ব্যবহার',
          children: [
            { id: 'chem4_g1', title: 'ক্ষার ধাতু (Group 1)', type: 'leaf', description: 'Li, Na, K, Rb, Cs, Fr (তীব্র ক্ষার ও H₂ গ্যাস তৈরি করে)' },
            { id: 'chem4_g2', title: 'মৃৎক্ষার ধাতু (Group 2)', type: 'leaf', description: 'Be, Mg, Ca, Sr, Ba, Ra (মাটিতে এদের অক্সাইড পাওয়া যায়)' },
            { id: 'chem4_g17', title: 'হ্যালোজেন (Group 17)', type: 'leaf', description: 'F, Cl, Br, I (লবণ উৎপাদক)' },
            { id: 'chem4_g18', title: 'নিষ্ক্রিয় গ্যাস (Group 18)', type: 'leaf', description: 'He, Ne, Ar, Kr, Xe, Rn (অষ্টক পূর্ণ ও সুস্থিত)' }
          ]
        }
      ]
    }
  },
  {
    id: 'mm_math_algebra',
    chapterId: 'ch_math_3',
    chapterName: '৩য় অধ্যায়: বীজগাণিতিক রাশি',
    subjectId: 'gmath',
    subjectName: 'সাধারণ গণিত',
    coreTheme: 'বর্গ, ঘন, অনুসিদ্ধান্ত ও উৎপাদকের পূর্ণাঙ্গ মাইন্ড ম্যাপ',
    rootNode: {
      id: 'math3_root',
      title: 'বীজগাণিতিক রাশি (Algebraic Expressions)',
      type: 'root',
      description: 'বোর্ড ক-বিভাগের ১০ মার্কস নিশ্চিত করার রোডম্যাপ',
      children: [
        {
          id: 'math3_b1',
          title: '১. বর্গের প্রধান সূত্র ও অনুসিদ্ধান্ত',
          type: 'branch',
          badge: 'বর্গ ও মান নির্ণয়',
          children: [
            { id: 'math3_f1', title: 'a² + b²', type: 'formula', formula: '(a + b)² - 2ab = (a - b)² + 2ab', description: 'সবচেয়ে বেশি ব্যবহৃত' },
            { id: 'math3_f2', title: '4ab ও 2(a² + b²)', type: 'formula', formula: '4ab = (a+b)² - (a-b)²', description: 'ab = ((a+b)/2)² - ((a-b)/2)²' },
            { id: 'math3_f3', title: '(a + b + c)²', type: 'formula', formula: 'a² + b² + c² + 2(ab + bc + ca)', description: '৩ পদের বর্গের রাশি' }
          ]
        },
        {
          id: 'math3_b2',
          title: '২. ঘনের সূত্রাবলি',
          type: 'branch',
          badge: 'x³ + 1/x³ প্যাটার্ন',
          children: [
            { id: 'math3_f4', title: 'a³ + b³ (অনুসিদ্ধান্ত)', type: 'formula', formula: '(a + b)³ - 3ab(a + b)', description: 'মান নির্ণয়ের জন্য' },
            { id: 'math3_f5', title: 'a³ - b³ (অনুসিদ্ধান্ত)', type: 'formula', formula: '(a - b)³ + 3ab(a - b)', description: 'ঋণাত্মক মানের জন্য' },
            { id: 'math3_f6', title: 'x⁵ + 1/x⁵ স্পেশাল ট্রিক', type: 'formula', formula: '(x³ + 1/x³)(x² + 1/x²) - (x + 1/x)', description: 'বোর্ডের সুপার হট গ/ঘ প্রশ্ন' }
          ]
        },
        {
          id: 'math3_b3',
          title: '৩. উৎপাদকে বিশ্লেষণ ও ভাগশেষ উপপাদ্য',
          type: 'branch',
          badge: 'Factorization',
          children: [
            { id: 'math3_f7', title: 'ভ্যানিশিং মেথড', type: 'leaf', description: 'চলকের যে মানের জন্য f(x) = 0 হয়, তা দিয়ে (x - a) সাধারণ উৎপাদক বের করা' },
            { id: 'math3_w1', title: 'সাইকেল ও চিহ্ন সতর্কতা', type: 'warning', description: '(a-b)(b-c)(c-a) সাইক্লিক অর্ডারে মাইনাস চিহ্নের কমন নিতে ভুল যেন না হয়!' }
          ]
        }
      ]
    }
  }
];

export function getMindMapForChapter(chapterNameOrId: string): ChapterMindMap {
  const found = CHAPTER_MIND_MAPS.find(m => 
    m.chapterId === chapterNameOrId || 
    m.chapterName.toLowerCase().includes(chapterNameOrId.toLowerCase()) ||
    chapterNameOrId.toLowerCase().includes(m.chapterName.toLowerCase())
  );
  if (found) return found;

  // Generic fallback mind map generated for any chapter
  return {
    id: `mm_${chapterNameOrId}`,
    chapterId: chapterNameOrId,
    chapterName: chapterNameOrId,
    subjectId: 'gen',
    subjectName: 'এসএসসি প্রস্তুতি',
    coreTheme: 'মূল বইয়ের প্রধান শিক্ষণফল, সূত্রাবলি ও বোর্ড প্রশ্নের সারাংশ',
    rootNode: {
      id: 'gen_root',
      title: chapterNameOrId,
      type: 'root',
      description: 'বোর্ড স্ট্যান্ডার্ড সংক্ষিপ্ত ধারণার মানচিত্র',
      children: [
        {
          id: 'gen_b1',
          title: '১. মৌলিক ধারণা ও সংজ্ঞা',
          type: 'branch',
          badge: 'জ্ঞান ও অনুধাবন',
          children: [
            { id: 'gen_l1', title: 'মূল বইয়ের মূল প্রতিপাদ্য', type: 'leaf', description: 'অধ্যায়ের কেন্দ্রীয় শিক্ষণফল ও সংজ্ঞা' },
            { id: 'gen_l2', title: 'গুরুত্বপূর্ণ অনুধাবনমূলক প্রশ্ন', type: 'leaf', description: 'কেন ও কীভাবে সম্পর্কিত বৈজ্ঞানিক ব্যাখ্যা' }
          ]
        },
        {
          id: 'gen_b2',
          title: '২. প্রয়োগ ও সূত্রাবলি',
          type: 'branch',
          badge: 'গাণিতিক প্রয়োগ',
          children: [
            { id: 'gen_f1', title: 'প্রধান গাণিতিক সূত্রাবলি', type: 'formula', formula: 'মূল সমীকরণ ও প্রতীকসমূহের পরিচয়', description: 'একক রূপান্তর ও নিখুঁত গণনা' },
            { id: 'gen_l3', title: 'উদ্দীপকের তথ্য ডিকোড করা', type: 'leaf', description: 'প্রদত্ত মান থেকে প্রয়োজনীয় অজ্ঞাত চলক নির্ণয়' }
          ]
        },
        {
          id: 'gen_b3',
          title: '৩. উচ্চতর দক্ষতা ও বোর্ড হটস্পট',
          type: 'branch',
          badge: 'বোর্ড প্রশ্ন সমাধান',
          children: [
            { id: 'gen_l4', title: 'বিগত ৫ বছরের বোর্ড প্যাটার্ন', type: 'leaf', description: 'সবচেয়ে বেশি আসা সৃজনশীল কাঠামো' },
            { id: 'gen_w1', title: 'পরীক্ষার হলের সতর্কতা', type: 'warning', description: 'সময়ের দিকে লক্ষ্য রেখে ২০ মিনিটের মধ্যে সম্পূর্ণ উত্তর উপস্থাপন করুন।' }
          ]
        }
      ]
    }
  };
}
