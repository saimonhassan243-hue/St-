import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bell, 
  Clock, 
  Calendar, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Volume2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ReminderSetting } from '../types';

interface AiStudyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY_REMINDERS = 'ssc_study_reminders_v1';

export const AiStudyReminderModal: React.FC<AiStudyReminderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reminders, setReminders] = useState<ReminderSetting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMINDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Reminders load note:', e);
    }
    return [
      {
        id: 'rem_1',
        title: 'ভোরের তাজা মন পড়ার সেশন',
        time: '06:30',
        days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        isEnabled: true,
        type: 'routine',
        message: 'বিজ্ঞানের জটিল সূত্র ও অংক অনুশীলনের উপযুক্ত সময়!',
      },
      {
        id: 'rem_2',
        title: 'সন্ধ্যায় ১৫ সে. ফ্ল্যাশ কার্ডস রিভিশন',
        time: '18:45',
        days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        isEnabled: true,
        type: 'flashcard',
        message: 'দৈনিক ১০টি স্পিড কার্ড রিভিশন দিয়ে স্ট্রিক ধরে রাখুন!',
      },
      {
        id: 'rem_3',
        title: 'রাতের প্র্যাকটিস ও CQ অ্যানালাইসিস',
        time: '21:00',
        days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        isEnabled: true,
        type: 'routine',
        message: 'আজকের নির্ধারিত CQ প্রশ্নের পূর্ণাঙ্গ সমাধান করুন।',
      },
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('20:00');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
    } catch (e) {
      console.warn('Reminders save note:', e);
    }
  }, [reminders]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newRem: ReminderSetting = {
      id: `rem_${Date.now()}`,
      title: newTitle.trim(),
      time: newTime,
      days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isEnabled: true,
      type: 'routine',
      message: 'পড়ার সময় হয়েছে, ফোকাস বজায় রাখুন!',
    };
    setReminders((prev) => [...prev, newRem]);
    setNewTitle('');
  };

  const handleTriggerTestNudge = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">AI স্টাডি রিমাইন্ডার ইঞ্জিন</h3>
                <p className="text-xs text-cyan-300">স্মার্ট নোটিফিকেশন ও পড়ার সময়সূচি অ্যালার্ট</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto space-y-6 my-4 pr-1 flex-1">
            {/* Live Notification Test Toast */}
            {testNotificationSent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Zap className="w-4 h-4" />
                <span>🔔 [টেস্ট অ্যালার্ট]: পড়ার সময় হয়েছে! আজকের গণিত ৩য় অধ্যায়ের CQ সলভ করুন।</span>
              </motion.div>
            )}

            {/* Existing Reminders List */}
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    rem.isEnabled
                      ? 'bg-slate-950/80 border-cyan-500/30'
                      : 'bg-slate-950/30 border-white/5 opacity-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rem.title}</span>
                      <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {rem.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{rem.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(rem.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        rem.isEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rem.isEnabled ? 'চালু' : 'বন্ধ'}
                    </button>
                    <button
                      onClick={() => handleDelete(rem.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Reminder Form */}
            <form onSubmit={handleAddReminder} className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-300">নতুন রিমাইন্ডার অ্যালার্ট যুক্ত করুন:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: ইংরেজি গ্রামার প্র্যাকটিস"
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>রিমাইন্ডার সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>

          {/* Footer test nudge */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleTriggerTestNudge}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>টেস্ট নোটিফিকেশন বাজান</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              সম্পন্ন
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
