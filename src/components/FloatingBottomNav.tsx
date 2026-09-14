import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Target, 
  Star, 
  Timer,
  Shield,
  AlertTriangle,
  Award,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavTabKey } from '../types';

interface NavOption {
  id: NavTabKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  accent: string;
  badge?: string;
  isNew?: boolean;
}

const NAV_OPTIONS: NavOption[] = [
  { id: 'profile', label: 'প্রোফাইল', shortLabel: 'প্রোফাইল', icon: User, accent: 'from-indigo-500 to-indigo-600' },
  { id: 'syllabus', label: 'সিলেবাস', shortLabel: 'সিলেবাস', icon: BookOpen, accent: 'from-blue-500 to-indigo-600' },
  { id: 'routine', label: 'রুটিন', shortLabel: 'রুটিন', icon: Calendar, accent: 'from-cyan-500 to-blue-600' },
  { id: 'weakpoints', label: 'দুর্বল পয়েন্ট', shortLabel: 'দুর্বল পয়েন্ট', icon: AlertTriangle, accent: 'from-rose-500 to-amber-600', isNew: true },
  { id: 'gamification', label: 'রিওয়ার্ড ও স্ট্রিক', shortLabel: 'রিওয়ার্ড', icon: Award, accent: 'from-amber-400 to-orange-500', isNew: true },
  { id: 'analytics', label: 'এনালাইটিক্স', shortLabel: 'এনালাইটিক্স', icon: BarChart3, accent: 'from-emerald-500 to-cyan-600', isNew: true },
  { id: 'progress', label: 'প্রোগ্রেস', shortLabel: 'প্রোগ্রেস', icon: Target, accent: 'from-teal-500 to-emerald-600' },
  { id: 'suggestions', label: 'সাজেশন', shortLabel: 'সাজেশন', icon: Star, accent: 'from-amber-400 to-amber-600' },
  { id: 'countdown', label: 'কাউন্টডাউন', shortLabel: 'কাউন্টডাউন', icon: Timer, accent: 'from-purple-500 to-pink-600' },
  { id: 'admin', label: 'এডমিন', shortLabel: 'এডমিন', icon: Shield, accent: 'from-purple-600 to-rose-600' },
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab item smoothly into view when activeTab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(`#bottom-nav-item-${activeTab}`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeTab]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -140, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  return (
    <aside 
      aria-label="নিচের স্বয়ংক্রিয় স্ক্রলেবল নেভিগেশন বার" 
      className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-4xl pointer-events-none"
    >
      <div className="relative pointer-events-auto group">
        {/* Left Scroll Trigger Button (Desktop/Tablet) */}
        <button
          onClick={scrollLeft}
          title="বামে স্ক্রল করুন"
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-900/90 border border-white/20 text-slate-300 hover:text-white items-center justify-center shadow-lg hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Right Scroll Trigger Button (Desktop/Tablet) */}
        <button
          onClick={scrollRight}
          title="ডানে স্ক্রল করুন"
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-900/90 border border-white/20 text-slate-300 hover:text-white items-center justify-center shadow-lg hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Outer Nav Container with Frosted Glass and Soft Edge Gradient */}
        <div className="relative bg-slate-950/92 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.7)] rounded-2xl sm:rounded-full p-1 sm:p-1.5 overflow-hidden">
          
          {/* Scrollable Navigation Track */}
          <nav
            ref={scrollContainerRef}
            id="master-floating-bottom-nav"
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-1 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {NAV_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`bottom-nav-item-${item.id}`}
                  onClick={() => onChangeTab(item.id)}
                  className={`relative shrink-0 py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl sm:rounded-full flex items-center gap-1.5 sm:gap-2 transition-all duration-200 outline-none select-none z-10 cursor-pointer ${
                    isActive 
                      ? 'text-white font-bold shadow-sm' 
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
                  <div className="relative flex items-center justify-center">
                    <Icon 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? 'scale-110 text-white' : 'text-slate-400'
                      }`} 
                    />
                    {item.id === 'gamification' && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                    )}
                    {item.id === 'weakpoints' && !isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                    )}
                  </div>

                  {/* Label */}
                  <span className="text-[11px] sm:text-xs tracking-tight whitespace-nowrap font-anek">
                    {item.label}
                  </span>

                  {/* Badges / Pill Tags */}
                  {item.id === 'gamification' && streakCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 hidden sm:inline-block">
                      🔥 {streakCount}d
                    </span>
                  )}
                  {item.isNew && item.id !== 'gamification' && (
                    <span className="text-[8px] font-extrabold px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-tighter hidden md:inline-block">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};
