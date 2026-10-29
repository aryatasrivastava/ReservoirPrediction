import React from 'react';
import { ReservoirMetadata } from '../types';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface LevelGaugeProps {
  currentLevel: number;
  reservoir: ReservoirMetadata;
}

export const LevelGauge: React.FC<LevelGaugeProps> = ({ currentLevel, reservoir }) => {
  const percentage = Math.min(
    100,
    Math.max(
      0,
      ((currentLevel - reservoir.deadStorageLevelM) /
        (reservoir.fullReservoirLevelM - reservoir.deadStorageLevelM)) *
        100
    )
  );

  const rawPercentage = ((currentLevel / reservoir.fullReservoirLevelM) * 100).toFixed(1);

  // Determine state color
  let statusColor = 'from-blue-600 to-cyan-500';
  let badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  let statusText = 'Normal';

  if (currentLevel >= reservoir.dangerLevelM) {
    statusColor = 'from-red-600 to-rose-500';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
    statusText = 'Critical Danger';
  } else if (currentLevel >= reservoir.warningLevelM) {
    statusColor = 'from-amber-600 to-yellow-500';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    statusText = 'Warning Level';
  } else if (currentLevel >= 80.0) {
    statusColor = 'from-cyan-600 to-blue-500';
    badgeColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    statusText = 'Elevated Watch';
  }

  // Calculate percentage positions for markers
  const warningPos = ((reservoir.warningLevelM - reservoir.deadStorageLevelM) / (reservoir.fullReservoirLevelM - reservoir.deadStorageLevelM)) * 100;
  const dangerPos = ((reservoir.dangerLevelM - reservoir.deadStorageLevelM) / (reservoir.fullReservoirLevelM - reservoir.deadStorageLevelM)) * 100;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Storage Level
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentLevel.toFixed(1)}
              <span className="text-xl sm:text-2xl font-semibold text-slate-400 ml-1">m</span>
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badgeColor}`}>
              {statusText}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Capacity</span>
          <span className="text-xl font-bold text-cyan-400 font-mono">{rawPercentage}%</span>
        </div>
      </div>

      {/* Visual Reservoir Column Gauge */}
      <div className="relative w-full h-44 bg-slate-950/80 rounded-xl border border-slate-800 p-2 overflow-hidden flex flex-col justify-end">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />

        {/* Danger Threshold Marker Line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500/80 flex items-center justify-between px-2 text-[10px] text-red-400 font-mono z-20 pointer-events-none"
          style={{ bottom: `${dangerPos}%` }}
        >
          <span className="bg-slate-900/90 px-1 py-0.5 rounded border border-red-500/40 flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" /> Danger ({reservoir.dangerLevelM}m)
          </span>
          <span className="bg-slate-900/90 px-1 py-0.5 rounded border border-red-500/40">92%</span>
        </div>

        {/* Warning Threshold Marker Line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/80 flex items-center justify-between px-2 text-[10px] text-amber-400 font-mono z-20 pointer-events-none"
          style={{ bottom: `${warningPos}%` }}
        >
          <span className="bg-slate-900/90 px-1 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-2.5 h-2.5" /> Warning ({reservoir.warningLevelM}m)
          </span>
          <span className="bg-slate-900/90 px-1 py-0.5 rounded border border-amber-500/40">85%</span>
        </div>

        {/* Animated Water Fill */}
        <div
          className={`w-full bg-gradient-to-t ${statusColor} rounded-lg transition-all duration-700 relative overflow-hidden shadow-inner opacity-90`}
          style={{ height: `${percentage}%` }}
        >
          {/* Wave overlay animation */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-wave rounded-t-lg" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2),transparent)]" />
        </div>
      </div>

      {/* Threshold Key Indicators */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Dead Storage</span>
          <span className="font-mono text-slate-300 font-medium">{reservoir.deadStorageLevelM}m</span>
        </div>
        <div className="text-center">
          <span className="text-amber-400 block text-[11px]">Warning Mark</span>
          <span className="font-mono text-amber-300 font-medium">{reservoir.warningLevelM}m</span>
        </div>
        <div className="text-right">
          <span className="text-red-400 block text-[11px]">Full Res. Level</span>
          <span className="font-mono text-slate-300 font-medium">{reservoir.fullReservoirLevelM}m</span>
        </div>
      </div>
    </div>
  );
};
