/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  PenTool, 
  Eraser, 
  Trash2, 
  Download, 
  Grid, 
  Circle, 
  Square, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Copy,
  Maximize2
} from 'lucide-react';

interface MathScienceCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle?: string;
}

type ToolType = 'pen' | 'eraser' | 'line' | 'circle' | 'rect';
type GridType = 'graph' | 'dots' | 'blank';

const COLORS = [
  '#ffffff', // White
  '#38bdf8', // Cyan
  '#fbbf24', // Amber
  '#34d399', // Emerald
  '#f43f5e', // Rose
  '#818cf8', // Indigo
  '#a855f7', // Purple
  '#f97316', // Orange
];

const STROKE_WIDTHS = [2, 4, 8, 14];

export const MathScienceCanvasModal: React.FC<MathScienceCanvasModalProps> = ({
  isOpen,
  onClose,
  chapterTitle = 'ম্যাথ ও সায়েন্স ড্রয়িং ক্যানভাস',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#38bdf8');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [gridType, setGridType] = useState<GridType>('graph');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Drawing state refs
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshot = useRef<ImageData | null>(null);

  // Initialize Canvas Size
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Save existing drawing if any
    const ctx = canvas.getContext('2d');
    let prevData: ImageData | null = null;
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      prevData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Redraw grid and restore
    if (ctx) {
      drawBackground(ctx, canvas.width, canvas.height, gridType);
      if (prevData) {
        ctx.putImageData(prevData, 0, 0);
      }
    }
  };

  // Draw Grid/Background
  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    type: GridType
  ) => {
    // Fill dark background
    ctx.fillStyle = '#090d1a';
    ctx.fillRect(0, 0, width, height);

    if (type === 'graph') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Main Axes X and Y in Center
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.5;
      // Y Axis
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      // X Axis
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    } else if (type === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const step = 25;
      for (let x = 12; x < width; x += step) {
        for (let y = 12; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  // Re-render when modal opens or grid changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(resizeCanvas, 50);
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [isOpen, gridType]);

  // Helper for coordinates
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Start Drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    startPos.current = coords;
    setIsDrawing(true);

    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = tool === 'eraser' ? '#090d1a' : color;
    ctx.lineWidth = tool === 'eraser' ? strokeWidth * 3 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // Draw Movement
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot.current) {
      // Restore previous state for geometric shapes
      ctx.putImageData(snapshot.current, 0, 0);

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';

      if (tool === 'line') {
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        const w = coords.x - startPos.current.x;
        const h = coords.y - startPos.current.y;
        ctx.strokeRect(startPos.current.x, startPos.current.y, w, h);
      } else if (tool === 'circle') {
        const radius = Math.hypot(coords.x - startPos.current.x, coords.y - startPos.current.y);
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  // Stop Drawing
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save to history for undo
    const currentSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), currentSnapshot]);
    setHistoryIndex((prev) => prev + 1);
  };

  // Clear Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawBackground(ctx, canvas.width, canvas.height, gridType);
    setHistory([]);
    setHistoryIndex(-1);
  };

  // Undo
  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyIndex < 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (historyIndex === 0) {
      drawBackground(ctx, canvas.width, canvas.height, gridType);
      setHistoryIndex(-1);
    } else {
      ctx.putImageData(history[historyIndex - 1], 0, 0);
      setHistoryIndex((prev) => prev - 1);
    }
  };

  // Download Canvas as PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ssc-math-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#04060d]/95 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#090d1a] border border-cyan-500/30 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden text-slate-100"
      >
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-jakarta">
                {chapterTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-anek">
                গণিতের হিসাব-নিকাশ, জ্যামিতিক অঙ্কন ও বিজ্ঞানের চিত্র আঁকার ডিজিটাল রাফ খাতা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold font-anek flex items-center gap-1.5 transition-colors"
              title="ইমেজ ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">সেভ/ডাউনলোড</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="p-2 sm:p-3 bg-slate-950/70 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0 font-anek text-xs">
          {/* Tools (Pen, Eraser, Shapes) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                tool === 'pen' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
              title="পেন্সিল"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">কলম</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                tool === 'eraser' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
              title="ইরেজার (রাবার)"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ইরেজার</span>
            </button>
            <button
              onClick={() => setTool('line')}
              className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                tool === 'line' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
              title="সরলরেখা"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool('rect')}
              className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                tool === 'rect' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
              title="আয়তক্ষেত্র"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool('circle')}
              className={`p-2 rounded-xl flex items-center gap-1 transition-all ${
                tool === 'circle' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
              title="বৃত্ত"
            >
              <Circle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-xl border border-white/5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser') setTool('pen');
                }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110 opacity-80'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-white/5">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  strokeWidth === w ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Grid Background Switcher & Undo/Clear */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-white/5">
              <button
                onClick={() => setGridType('graph')}
                className={`px-2 py-1 rounded-lg text-[11px] ${
                  gridType === 'graph' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                গ্রাফ গ্রিড
              </button>
              <button
                onClick={() => setGridType('dots')}
                className={`px-2 py-1 rounded-lg text-[11px] ${
                  gridType === 'dots' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                ডট গ্রিড
              </button>
              <button
                onClick={() => setGridType('blank')}
                className={`px-2 py-1 rounded-lg text-[11px] ${
                  gridType === 'blank' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                ব্ল্যাঙ্ক
              </button>
            </div>

            <button
              onClick={handleUndo}
              disabled={historyIndex < 0}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              title="আগের অবস্থায় ফিরুন (Undo)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30"
              title="সব মুছে ফেলুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Drawing Area */}
        <div 
          ref={containerRef} 
          className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden touch-none select-none"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block"
          />
        </div>
      </motion.div>
    </div>
  );
};
