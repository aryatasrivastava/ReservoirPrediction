import React from 'react';
import { ArrowRight, Cpu, Layers, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Architecture Pipeline Flow Banner */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">System Architecture Flow</span>
                <span className="ml-2 text-[11px] text-amber-400 font-mono">
                  (Planned architecture; currently the frontend uses a mock prediction service)
                </span>
              </div>
            </div>

            {/* Visual Step-by-Step Flow */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono">
              <span className="bg-blue-950/70 text-blue-300 border border-blue-800/60 px-2.5 py-1 rounded-md font-semibold">
                React Frontend
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md">
                FastAPI
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 px-2.5 py-1 rounded-md font-semibold">
                ML Model
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded-md">
                Prediction
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="bg-amber-950/70 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-md font-semibold">
                Risk Engine
              </span>
              <ArrowRight className="w-3 h-3 text-slate-500" />
              <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-md font-semibold">
                Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* System Meta & Honesty Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 border-t border-slate-900 pt-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Hydrological Safety Protocol Level 2
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Ensemble Weights: LSTM (0.50), RF (0.35), Ridge (0.15)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Telemetry Ref: 2026-10-05 12:00 UTC
            </span>
            <span>&copy; 2026 AquaForecast AI Systems</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
