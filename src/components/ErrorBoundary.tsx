import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Crash-Proof ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReloadPage = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 my-8 font-hind">
          <div className="max-w-lg w-full bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-jakarta">
              কিছু একটা সমস্যা হয়েছে
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              {this.props.fallbackMessage || 
                'কিছু একটা সমস্যা হয়েছে, অ্যাপটি পুনরায় চালু করুন'}
            </p>

            {this.state.error && (
              <div className="bg-slate-950/80 rounded-2xl p-3 border border-white/5 mb-6 text-left max-h-24 overflow-y-auto">
                <p className="text-[11px] font-mono text-rose-300 truncate">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> পুনরায় চেষ্টা করুন
              </button>
              <button
                type="button"
                onClick={this.handleReloadPage}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Home className="w-3.5 h-3.5" /> রিফ্রেশ করুন
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
