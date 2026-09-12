import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Target, 
  Star, 
  Timer,
  Sliders
} from 'lucide-react';
import { NavTabKey } from '../types';

interface NavOption {
  id: NavTabKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  accent: string;
}

const NAV_OPTIONS: NavOption[] = [
  { id: 'profile', label: 'প্রোফাইল', shortLabel: 'প্রোফাইল', icon: User, accent: 'from-indigo-500 to-indigo-600' },
  { id: 'syllabus', label: 'সিলেবাস', shortLabel: 'সিলেবাস', icon: BookOpen, accent: 'from-blue-500 to-indigo-600' },
  { id: 'routine', label: 'রুটিন', shortLabel: 'রুটিন', icon: Calendar, accent: 'from-cyan-500 to-blue-600' },
  { id: 'progress', label: 'প্রোগ্রেস', shortLabel: 'প্রোগ্রেস', icon: Target, accent: 'from-emerald-500 to-teal-600' },
  { id: 'suggestions', label: 'সাজেশন', shortLabel: 'সাজেশন', icon: Star, accent: 'from-amber-400 to-amber-600' },
  { id: 'countdown', label: 'কাউন্টডাউন', shortLabel: 'কাউন্টডাউন', icon: Timer, accent: 'from-purple-500 to-pink-600' },
  { id: 'admin', label: 'অ্যাডমিন', shortLabel: 'অ্যাডমিন', icon: Sliders, accent: 'from-purple-600 to-rose-600' },
];

interface FloatingBottomNavProps {
  activeTab: NavTabKey;
  onChangeTab: (tab: NavTabKey) => void;
  streakCount?: number;
}

export const FloatingBottomNav: React.FC<FloatingBottomNavProps> = ({
  activeTab,
  onChangeTab,
  streakCount = 15,
}) => {
  return (
    <aside aria-label="নিচের দ্রুত নেভিগেশন বার" className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-xl sm:max-w-2xl pointer-events-none">
      <nav 
        id="master-floating-bottom-nav"
        className="pointer-events-auto bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.6)] rounded-2xl sm:rounded-full p-1.5 sm:p-2 flex items-center justify-between gap-1 transition-all"
      >
        {NAV_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onChangeTab(item.id)}
              className={`relative flex-1 py-1.5 sm:py-2 px-1 sm:px-2.5 rounded-xl sm:rounded-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 outline-none select-none z-10 ${
                isActive 
                  ? 'text-white font-bold' 
                  : 'text-slate-400 hover:text-slate-200 font-medium hover:bg-white/5'
              }`}
            >
              {/* Active Indicator Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="masterBottomNavActivePill"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 rounded-xl sm:rounded-full shadow-lg shadow-indigo-600/40 -z-10 border border-indigo-400/30"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon 
                  className={`w-4 h-4 sm:w-4 sm:h-4 transition-transform ${
                    isActive ? 'scale-110 text-white' : 'text-slate-400'
                  }`} 
                />
                {item.id === 'progress' && streakCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                )}
                {item.id === 'suggestions' && !isActive && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}
              </div>

              {/* Label */}
              <span className="text-[10px] sm:text-xs tracking-tight whitespace-nowrap font-hind">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
