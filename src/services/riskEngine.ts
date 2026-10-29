/**
 * Pure hydrological risk engine for reservoir level classification,
 * rate of change computation, threshold crossing detection, and automated alert synthesis.
 */

import { RiskTier, ThresholdCrossing, RiskAssessment, ReservoirMetadata } from '../types';
import { DEFAULT_RESERVOIR } from '../data/mockReservoirData';

/**
 * Classifies a reservoir water level into a standardized flood risk tier.
 * @param level - Water level in meters
 * @param warningLevel - Warning threshold (default 85.0m)
 * @param dangerLevel - Critical / Danger threshold (default 92.0m)
 */
export function classifyRiskTier(
  level: number,
  warningLevel = DEFAULT_RESERVOIR.warningLevelM,
  dangerLevel = DEFAULT_RESERVOIR.dangerLevelM
): RiskTier {
  if (level >= dangerLevel) {
    return 'CRITICAL';
  }
  if (level >= warningLevel) {
    return 'WARNING';
  }
  if (level >= 80.0) {
    return 'WATCH';
  }
  return 'NORMAL';
}

export interface DayChange {
  date: string;
  changeM: number; // change from previous day in meters
  rateDirection: 'rising' | 'falling' | 'stable';
}

/**
 * Computes day-to-day rate of change for a time-series sequence.
 */
export function computeDayToDayChange(
  records: Array<{ date: string; level: number }>
): DayChange[] {
  if (!records || records.length === 0) return [];

  return records.map((curr, idx) => {
    if (idx === 0) {
      return {
        date: curr.date,
        changeM: 0,
        rateDirection: 'stable' as const,
      };
    }
    const prev = records[idx - 1];
    const diff = Number((curr.level - prev.level).toFixed(2));
    let rateDirection: 'rising' | 'falling' | 'stable' = 'stable';
    if (diff > 0.05) rateDirection = 'rising';
    else if (diff < -0.05) rateDirection = 'falling';

    return {
      date: curr.date,
      changeM: diff,
      rateDirection,
    };
  });
}

/**
 * Finds the earliest forecast day that breaches a safety threshold (Warning or Critical).
 */
export function findFirstThresholdCrossing(
  predictions: Array<{ date: string; level: number }>,
  warningLevel = DEFAULT_RESERVOIR.warningLevelM,
  dangerLevel = DEFAULT_RESERVOIR.dangerLevelM,
  referenceDateStr?: string
): ThresholdCrossing {
  if (!predictions || predictions.length === 0) {
    return {
      crossed: false,
      date: null,
      level: null,
      tier: 'NORMAL',
      daysFromNow: null,
    };
  }

  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date(predictions[0].date);

  for (let i = 0; i < predictions.length; i++) {
    const item = predictions[i];
    if (item.level >= dangerLevel) {
      const targetDate = new Date(item.date);
      const diffDays = Math.max(0, Math.round((targetDate.getTime() - refDate.getTime()) / (1000 * 3600 * 24)));
      return {
        crossed: true,
        date: item.date,
        level: item.level,
        tier: 'CRITICAL',
        daysFromNow: diffDays,
      };
    }
    if (item.level >= warningLevel) {
      const targetDate = new Date(item.date);
      const diffDays = Math.max(0, Math.round((targetDate.getTime() - refDate.getTime()) / (1000 * 3600 * 24)));
      return {
        crossed: true,
        date: item.date,
        level: item.level,
        tier: 'WARNING',
        daysFromNow: diffDays,
      };
    }
  }

  return {
    crossed: false,
    date: null,
    level: null,
    tier: 'NORMAL',
    daysFromNow: null,
  };
}

/**
 * Formats ISO date string (YYYY-MM-DD) to friendly short string (e.g. 'Oct 8')
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Builds a comprehensive risk assessment, alert message, and operational action plan.
 * Used identically across Dashboard and Scenario Simulator.
 */
export function buildAlertMessage(
  currentLevel: number,
  predictions: Array<{ date: string; level: number }>,
  reservoir: ReservoirMetadata = DEFAULT_RESERVOIR
): RiskAssessment {
  const currentTier = classifyRiskTier(currentLevel, reservoir.warningLevelM, reservoir.dangerLevelM);
  const crossing = findFirstThresholdCrossing(predictions, reservoir.warningLevelM, reservoir.dangerLevelM);

  // Determine peak forecast level
  let peakLevel = currentLevel;
  let peakDate = predictions.length > 0 ? predictions[0].date : new Date().toISOString().split('T')[0];

  predictions.forEach((p) => {
    if (p.level > peakLevel) {
      peakLevel = p.level;
      peakDate = p.date;
    }
  });

  const predictedPeakTier = classifyRiskTier(peakLevel, reservoir.warningLevelM, reservoir.dangerLevelM);

  // Compute average daily rate of change
  const rateChanges = computeDayToDayChange(predictions);
  const avgDailyChange = rateChanges.length > 1
    ? Number((rateChanges.slice(1).reduce((acc, c) => acc + c.changeM, 0) / (rateChanges.length - 1)).toFixed(2))
    : 0;

  // Build Alert Title, Message, and Action Plan
  let alertTitle = 'Hydrological Conditions Normal';
  let alertMessage = `Reservoir level is stable at ${currentLevel.toFixed(1)}m (${((currentLevel / reservoir.fullReservoirLevelM) * 100).toFixed(0)}% FRL). No threshold breaches expected within the forecast horizon.`;
  const recommendedActions: string[] = [
    'Maintain baseline hydropower generation discharge schedule.',
    'Continue routine 6-hour automated telemetry audits.',
  ];

  if (crossing.crossed && crossing.date) {
    const formattedDate = formatFriendlyDate(crossing.date);
    if (crossing.tier === 'CRITICAL') {
      alertTitle = `CRITICAL FLOOD EMERGENCY ALERT: Danger Level Expected on ${formattedDate}`;
      alertMessage = `Predictive models project water level will breach the ${reservoir.dangerLevelM.toFixed(1)}m Danger Threshold on ${formattedDate} (reaching ${crossing.level?.toFixed(1)}m). Immediate controlled spillway discharge required.`;
      recommendedActions.unshift(
        'Activate Emergency Action Plan (EAP Phase 3).',
        `Open 6 to 8 spillway gates to increase discharge to 800+ m³/s immediately.`,
        'Issue inundation flash warnings to downstream riverbank communities.',
        'Coordinate with National Disaster Response Force and regional catchment authorities.'
      );
    } else {
      alertTitle = `Threshold Warning: Water Level Crosses ${reservoir.warningLevelM.toFixed(1)}m on ${formattedDate}`;
      alertMessage = `Telemetry models project reservoir storage will exceed the ${reservoir.warningLevelM.toFixed(1)}m Warning Threshold on ${formattedDate} (reaching ${crossing.level?.toFixed(1)}m, peak ${peakLevel.toFixed(1)}m on ${formatFriendlyDate(peakDate)}).`;
      recommendedActions.unshift(
        `Pre-release dam storage: Increase outflow from ${DEFAULT_RESERVOIR.name} to buffer incoming monsoon surge.`,
        'Inspect spillway radial gate hoists and emergency backup generators.',
        'Notify downstream civil authorities and water resource management board.',
        'Enable high-frequency (15-minute) rainfall radar telemetry tracking.'
      );
    }
  } else if (predictedPeakTier === 'WATCH') {
    alertTitle = 'Advisory: Reservoir Rising Under Moderate Rainfall';
    alertMessage = `Inflow exceeds discharge. Water level is climbing (+${avgDailyChange}m/day) towards ${peakLevel.toFixed(1)}m by ${formatFriendlyDate(peakDate)}. Remaining buffer to warning threshold is ${(reservoir.warningLevelM - peakLevel).toFixed(1)}m.`;
    recommendedActions.unshift(
      'Gradually step up turbine discharge to moderate storage accumulation.',
      'Monitor upstream catchment rain-gauge sensors for precipitation intensification.'
    );
  } else if (currentLevel < 50.0) {
    alertTitle = 'Low Storage Advisory: Conservation Recommended';
    alertMessage = `Current level is ${currentLevel.toFixed(1)}m (${((currentLevel / reservoir.fullReservoirLevelM) * 100).toFixed(0)}% capacity). Inflow remains below seasonal baseline.`;
    recommendedActions.unshift(
      'Throttle irrigation and non-critical industrial releases.',
      'Prioritize municipal drinking water reserve allocations.'
    );
  }

  return {
    currentTier,
    predictedPeakTier,
    predictedPeakLevel: peakLevel,
    predictedPeakDate: peakDate,
    dailyRateOfChangeM: avgDailyChange,
    thresholdCrossing: crossing,
    alertTitle,
    alertMessage,
    recommendedActions,
  };
}
