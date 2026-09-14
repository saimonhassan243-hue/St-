/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  BookOpen, 
  Zap, 
  AlertTriangle, 
  ChevronRight, 
  ChevronDown,
  Layers,
  HelpCircle
} from 'lucide-react';
import { ChapterMindMap, MindMapNode, getMindMapForChapter } from '../data/chapterMindMaps';

interface MindMapViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterName?: string;
  chapterId?: string;
}

const TreeNode: React.FC<{ node: MindMapNode; level?: number }> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const hasChildren = node.children && node.children.length > 0;

  // Node Color Schemes based on type
  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  let titleColor = 'text-white';
  let containerBg = 'bg-slate-900/80 border-white/10';

  if (node.type === 'root') {
    containerBg = 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border-indigo-500/50 shadow-lg shadow-indigo-500/20';
    badgeColor = 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40';
  } else if (node.type === 'branch') {
    containerBg = 'bg-slate-800/90 border-indigo-400/30 shadow-md';
    badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (node.type === 'formula') {
    containerBg = 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-500/10';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (node.type === 'warning') {
    containerBg = 'bg-rose-950/40 border-rose-500/40 shadow-rose-500/10';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  }

  return (
    <div className={`space-y-2 ${level > 0 ? 'ml-4 sm:ml-6 pl-3 sm:pl-4 border-l-2 border-indigo-500/20' : ''}`}>
      <motion.div
        layout
        className={`p-3 sm:p-4 rounded-2xl border transition-all ${containerBg}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {node.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-anek ${badgeColor}`}>
                  {node.badge}
                </span>
              )}
              {node.type === 'formula' && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono">
                  গাণিতিক সূত্র
                </span>
              )}
              {node.type === 'warning' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-anek flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> পরীক্ষার সতর্কতা
                </span>
              )}
            </div>

            <h4 className={`text-xs sm:text-sm font-bold font-jakarta leading-snug ${titleColor}`}>
              {node.title}
            </h4>

            {node.description && (
              <p className="text-xs text-slate-300 font-anek leading-relaxed mt-0.5">
                {node.description}
              </p>
            )}

            {node.formula && (
              <div className="mt-2 p-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs sm:text-sm font-bold inline-block">
                ⚡ {node.formula}
              </div>
            )}
          </div>

          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
      </motion.div>

      {/* Children Branches */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 pt-1"
          >
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MindMapViewerModal: React.FC<MindMapViewerModalProps> = ({
  isOpen,
  onClose,
  chapterName = '২য় অধ্যায়: গতি (Motion)',
  chapterId,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const mindMapData = getMindMapForChapter(chapterName || chapterId || 'গতি');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-slate-950 border border-indigo-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ১-পেজ ভিজুয়াল রিভিশন
                </span>
                <span className="text-xs text-slate-400 font-anek">{mindMapData.subjectName}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-jakarta">
                {mindMapData.chapterName} মাইন্ড ম্যাপ
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-white/10 text-xs text-slate-300">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                className="p-1 hover:text-white"
                title="জুম আউট"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono text-[11px]">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1 hover:text-white"
                title="জুম ইন"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mind Map Tree Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
          <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 font-anek flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>কোর থিম:</strong> {mindMapData.coreTheme}
            </span>
          </div>

          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }} className="transition-transform duration-200">
            <TreeNode node={mindMapData.rootNode} />
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/70 flex items-center justify-between text-xs text-slate-400 font-anek">
          <span>💡 প্রতিটি নোডের বিস্তারিত ও সূত্র পড়তে অ্যারোতে ক্লিক করে প্রসারিত করুন</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-anek cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};
