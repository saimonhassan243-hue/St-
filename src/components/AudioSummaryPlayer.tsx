/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  FastForward, 
  Rewind, 
  Sparkles, 
  X, 
  Headphones, 
  ListMusic, 
  CheckCircle2 
} from 'lucide-react';
import { AudioSummaryTrack, getAudioSummaryForChapter } from '../data/audioSummaries';

interface AudioSummaryPlayerProps {
  currentTrack?: AudioSummaryTrack;
  chapterName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isFloatingDock?: boolean;
}

export const AudioSummaryPlayer: React.FC<AudioSummaryPlayerProps> = ({
  currentTrack,
  chapterName = '২য় অধ্যায়: গতি (Motion)',
  isOpen = false,
  onClose,
  isFloatingDock = false,
}) => {
  const activeTrack = currentTrack || getAudioSummaryForChapter(chapterName);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentProgress, setCurrentProgress] = useState<number>(0); // in seconds
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalDuration = activeTrack.durationSeconds || 180;

  // Web Speech API Voice Synthesis initialization
  const startSpeech = () => {
    if (!('speechSynthesis' in window)) {
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(activeTrack.summaryText);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Try finding Bangla or standard voice
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD'));
    if (bnVoice) {
      utterance.voice = bnVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentProgress(totalDuration);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const pauseSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const resumeSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      startSpeech();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSpeech();
    } else {
      resumeSpeech();
    }
  };

  const handleRestart = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentProgress(0);
    startSpeech();
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);

    if (isPlaying) {
      window.speechSynthesis.cancel();
      startSpeech();
    }
  };

  // Simulated progress tick while playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, playbackSpeed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen && !isFloatingDock) return null;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((currentProgress / totalDuration) * 100));

  return (
    <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 max-w-md w-[92vw] sm:w-[380px]">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="bg-slate-950/95 border border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-500" />

        {/* Top Title & Close */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-anek block">
                {activeTrack.speaker}
              </span>
              <h4 className="text-xs font-bold text-white font-jakarta truncate">
                {activeTrack.chapterName}
              </h4>
            </div>
          </div>

          {onClose && (
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsPlaying(false);
                onClose();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Track Title */}
        <p className="text-[11px] text-slate-300 font-anek line-clamp-2 leading-tight">
          {activeTrack.title}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{formatTime(currentProgress)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between pt-1">
          {/* Speed Pill */}
          <button
            onClick={handleSpeedChange}
            className="px-2 py-1 rounded-lg bg-slate-800 text-[10px] font-bold text-indigo-300 hover:bg-slate-700 font-mono cursor-pointer border border-white/5"
            title="প্লেব্যাক স্পিড পরিবর্তন করুন"
          >
            {playbackSpeed}x
          </button>

          {/* Core Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentProgress(prev => Math.max(0, prev - 10))}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="১০ সেকেন্ড পেছনে"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button
              onClick={() => setCurrentProgress(prev => Math.min(totalDuration, prev + 10))}
              className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="১০ সেকেন্ড সামনে"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Restart */}
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white cursor-pointer"
            title="শুরু থেকে শুনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Highlights Dropdown / Notes */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-amber-300 font-anek flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>প্রধান অডিও পয়েন্টসমূহ:</span>
          </span>
          <ul className="text-[10px] text-slate-300 font-anek space-y-0.5 pl-3 list-disc">
            {activeTrack.keyBulletPoints.slice(0, 2).map((pt, idx) => (
              <li key={idx} className="line-clamp-1">{pt}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};
