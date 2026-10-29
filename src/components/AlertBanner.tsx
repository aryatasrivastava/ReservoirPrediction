import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Info, ChevronDown, ChevronUp, BellRing } from 'lucide-react';
import { RiskAssessment } from '../types';

interface AlertBannerProps {
  assessment: RiskAssessment;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ assessment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { thresholdCrossing, alertTitle, alertMessage, recommendedActions } = assessment;

  // Determine styles based on risk tier
  const getBannerConfig = () => {
    if (thresholdCrossing.tier === 'CRITICAL') {
      return {
        bg: 'bg-red-950/40 border-red-500/50 text-red-200',
        badgeBg: 'bg-red-500 text-white',
        icon: <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />,
        glow: 'glow-danger',
        accentColor: 'text-red-400',
      };
    }
    if (thresholdCrossing.tier === 'WARNING' || thresholdCrossing.crossed) {
      return {
        bg: 'bg-amber-950/40 border-amber-500/50 text-amber-200 dark:bg-amber-950/40 dark:border-amber-500/50 light:bg-amber-50',
        badgeBg: 'bg-amber-500 text-slate-950 font-semibold',
        icon: <AlertTriangle className="w-6 h-6 text-amber-400 animate-bounce" />,
        glow: 'glow-warning',
        accentColor: 'text-amber-400',
      };
    }
    if (assessment.predictedPeakTier === 'WATCH') {
      return {
        bg: 'bg-yellow-950/30 border-yellow-500/40 text-yellow-200',
        badgeBg: 'bg-yellow-500 text-slate-950',
        icon: <Info className="w-6 h-6 text-yellow-400" />,
        glow: 'glow-warning',
        accentColor: 'text-yellow-400',
      };
    }
    return {
      bg: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200',
      badgeBg: 'bg-emerald-500 text-white',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      glow: '',
      accentColor: 'text-emerald-400',
    };
  };

  const config = getBannerConfig();

  return (
    <div
      role="region"
      aria-label="Hydrological Risk Alert"
      className={`rounded-xl border p-4 sm:p-5 transition-all duration-300 backdrop-blur-md ${config.bg} ${config.glow} shadow-lg`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 flex-shrink-0 mt-0.5">
            {config.icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${config.badgeBg}`}>
                {thresholdCrossing.crossed ? `Tier: ${thresholdCrossing.tier}` : `Status: ${assessment.currentTier}`}
              </span>
              {thresholdCrossing.crossed && thresholdCrossing.date && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5">
                  <BellRing className="w-3 h-3 text-amber-400" />
                  Threshold Breached on {thresholdCrossing.date}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white dark:text-white light:text-slate-900">
              {alertTitle}
            </h2>
            <p className="text-sm mt-1 text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed max-w-4xl">
              {alertMessage}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="Toggle recommended mitigation actions"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/70 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>{isExpanded ? 'Hide Actions' : 'Action Plan'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && recommendedActions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 transition-all duration-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <span>Automated Dam Operator & Emergency Protocols</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-200">
            {recommendedActions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-mono text-xs font-bold mt-0.5">
                  {idx + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
