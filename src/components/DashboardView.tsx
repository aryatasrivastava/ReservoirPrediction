import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  DEFAULT_RESERVOIR,
  HISTORICAL_HYDROLOGY_DATA,
  BASELINE_FORECAST,
} from '../data/mockReservoirData';
import { buildAlertMessage, computeDayToDayChange, formatFriendlyDate } from '../services/riskEngine';
import { AlertBanner } from './AlertBanner';
import { LevelGauge } from './LevelGauge';
import {
  CloudRain,
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CombinedChartPoint {
  date: string;
  displayDate: string;
  historicalLevel?: number;
  forecastLevel?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
  rainfallMm: number;
  inflowCusecs: number;
  outflowCusecs: number;
  riskTier: string;
  isForecast: boolean;
}

export const DashboardView: React.FC<{ onNavigateToSimulator: () => void }> = ({ onNavigateToSimulator }) => {
  const reservoir = DEFAULT_RESERVOIR;
  const currentRecord = HISTORICAL_HYDROLOGY_DATA[HISTORICAL_HYDROLOGY_DATA.length - 1];
  const currentLevel = currentRecord.waterLevelM;

  // Compute risk assessment and alert synthesis using pure riskEngine
  const forecastPoints = BASELINE_FORECAST.map((f) => ({ date: f.date, level: f.waterLevelM }));
  const assessment = buildAlertMessage(currentLevel, forecastPoints, reservoir);

  // Compute rate of change for forecast days
  const forecastChanges = computeDayToDayChange(forecastPoints);

  // Chart view options
  const [showRainfall, setShowRainfall] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);

  // Prepare combined timeline dataset for Recharts
  const chartData: CombinedChartPoint[] = [
    ...HISTORICAL_HYDROLOGY_DATA.map((h) => ({
      date: h.date,
      displayDate: formatFriendlyDate(h.date),
      historicalLevel: h.waterLevelM,
      rainfallMm: h.rainfallMm,
      inflowCusecs: h.inflowCusecs,
      outflowCusecs: h.outflowCusecs,
      riskTier: h.riskTier,
      isForecast: false,
    })),
    ...BASELINE_FORECAST.map((f) => ({
      date: f.date,
      displayDate: formatFriendlyDate(f.date),
      forecastLevel: f.waterLevelM,
      confidenceLower: f.waterLevelM - 0.4,
      confidenceUpper: f.waterLevelM + 0.4,
      rainfallMm: f.rainfallMm,
      inflowCusecs: f.inflowCusecs,
      outflowCusecs: f.outflowCusecs,
      riskTier: f.riskTier,
      isForecast: true,
    })),
  ];

  const netFlow = currentRecord.inflowCusecs - currentRecord.outflowCusecs;

  return (
    <div className="space-y-6">
      {/* Top Banner: Prominent Oct 8 Alert Breached Notice */}
      <AlertBanner assessment={assessment} />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Level */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Water Level
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {currentLevel.toFixed(1)}
              <span className="text-sm font-normal text-slate-400 ml-1">m</span>
            </span>
            <span className="text-xs font-medium text-amber-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +0.7m / 24h
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Buffer to Warning:</span>
            <span className="font-mono text-amber-400 font-semibold">
              {(reservoir.warningLevelM - currentLevel).toFixed(1)}m
            </span>
          </div>
        </div>

        {/* Card 2: Storage Volume */}
        <div className="glass-panel rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Storage Volume
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {currentRecord.storageVolumeMCM.toFixed(1)}
              <span className="text-sm font-normal text-slate-400 ml-1">MCM</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {currentRecord.capacityPercentage}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Max Gross Storage:</span>
            <span className="font-mono text-slate-300 font-medium">{reservoir.maxCapacityMCM} MCM</span>
          </div>
        </div>

        {/* Card 3: River Flow Balance */}
        <div className="glass-panel rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Net Inflow Accumulation
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              +{netFlow}
              <span className="text-sm font-normal text-slate-400 ml-1">m³/s</span>
            </span>
            <span className="text-xs text-amber-400 font-medium">Accumulating</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>In: <strong className="text-slate-200">{currentRecord.inflowCusecs}</strong></span>
            <span>Out: <strong className="text-slate-200">{currentRecord.outflowCusecs} m³/s</strong></span>
          </div>
        </div>

        {/* Card 4: Catchment Rainfall */}
        <div className="glass-panel rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              24h Catchment Rainfall
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {currentRecord.rainfallMm.toFixed(1)}
              <span className="text-sm font-normal text-slate-400 ml-1">mm</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-medium">
              Heavy Monsoon
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Basin Catchment Area:</span>
            <span className="font-mono text-slate-300 font-medium">{reservoir.catchmentAreaKm2} km²</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Reservoir Level Telemetry & 7-Day AI Forecast</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  LSTM Model
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Past 14 days historical telemetry combined with 7-day predictive neural forecast horizon.
              </p>
            </div>

            {/* Chart controls */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowRainfall(!showRainfall)}
                aria-pressed={showRainfall}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  showRainfall
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Rainfall Bars
              </button>
              <button
                onClick={() => setShowConfidence(!showConfidence)}
                aria-pressed={showConfidence}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  showConfidence
                    ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Confidence Band
              </button>
            </div>
          </div>

          {/* Recharts Chart Container */}
          <div className="h-80 sm:h-96 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 15, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis
                  dataKey="displayDate"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="level"
                  domain={[70, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(v) => `${v}m`}
                />
                {showRainfall && (
                  <YAxis
                    yAxisId="rain"
                    orientation="right"
                    domain={[0, 120]}
                    stroke="#38bdf8"
                    fontSize={11}
                    tickFormatter={(v) => `${v}mm`}
                  />
                )}

                {/* Warning & Danger Reference Threshold Lines */}
                <ReferenceLine
                  yAxisId="level"
                  y={reservoir.warningLevelM}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `Warning Threshold (${reservoir.warningLevelM}m)`,
                    fill: '#f59e0b',
                    fontSize: 11,
                    position: 'insideTopLeft',
                  }}
                />
                <ReferenceLine
                  yAxisId="level"
                  y={reservoir.dangerLevelM}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `Danger Threshold (${reservoir.dangerLevelM}m)`,
                    fill: '#ef4444',
                    fontSize: 11,
                    position: 'insideTopLeft',
                  }}
                />

                {/* Split line indicating Forecast boundary (Today: Oct 5) */}
                <ReferenceLine
                  yAxisId="level"
                  x="Oct 5"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                  label={{
                    value: 'Today (Oct 5)',
                    fill: '#93c5fd',
                    fontSize: 11,
                    position: 'top',
                  }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as CombinedChartPoint;
                      const level = data.historicalLevel ?? data.forecastLevel;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1.5 font-sans min-w-[200px]">
                          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 font-semibold text-slate-200">
                            <span>{label} ({data.date})</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                data.isForecast ? 'bg-indigo-900 text-indigo-300' : 'bg-blue-900 text-blue-300'
                              }`}
                            >
                              {data.isForecast ? 'Predicted' : 'Telemetry'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-300 pt-1">
                            <span>Water Level:</span>
                            <span className="font-mono font-bold text-white text-sm">
                              {level?.toFixed(2)} m
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Inflow / Outflow:</span>
                            <span className="font-mono text-slate-200">
                              {data.inflowCusecs} / {data.outflowCusecs} m³/s
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Precipitation:</span>
                            <span className="font-mono text-cyan-400">{data.rainfallMm} mm</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                            <span>Risk Tier:</span>
                            <span
                              className={`font-semibold ${
                                data.riskTier === 'CRITICAL'
                                  ? 'text-red-400'
                                  : data.riskTier === 'WARNING'
                                  ? 'text-amber-400'
                                  : data.riskTier === 'WATCH'
                                  ? 'text-yellow-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {data.riskTier}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                  formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
                />

                {/* Rainfall bars */}
                {showRainfall && (
                  <Bar
                    yAxisId="rain"
                    dataKey="rainfallMm"
                    name="Rainfall (mm)"
                    fill="#0284c7"
                    opacity={0.35}
                    radius={[4, 4, 0, 0]}
                  />
                )}

                {/* Confidence Area */}
                {showConfidence && (
                  <Area
                    yAxisId="level"
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="none"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    name="Confidence Band"
                  />
                )}

                {/* Historical line (Solid Blue) */}
                <Line
                  yAxisId="level"
                  type="monotone"
                  dataKey="historicalLevel"
                  name="Historical Telemetry (m)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#3b82f6', stroke: '#1d4ed8' }}
                  activeDot={{ r: 6 }}
                />

                {/* Forecast line (Dashed Cyan / Amber) */}
                <Line
                  yAxisId="level"
                  type="monotone"
                  dataKey="forecastLevel"
                  name="AI Predicted Level (m)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#38bdf8', stroke: '#0284c7' }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level Gauge Column (1 col) */}
        <div className="space-y-6">
          <LevelGauge currentLevel={currentLevel} reservoir={reservoir} />

          {/* Quick Simulator CTA Card */}
          <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900/60">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Hydrological What-If Simulator</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Test hypothetical dam operations, adjust spillway gate discharge rates, and simulate severe storm scenarios.
            </p>
            <button
              onClick={onNavigateToSimulator}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Launch Simulator</span>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Outlook Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>7-Day Predictive Risk Schedule</span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated by Risk Engine for spillway scheduling and threshold breach mitigation.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Normal (&lt;80m)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Watch (&ge;80m)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning (&ge;85m)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Danger (&ge;92m)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Predicted Level</th>
                <th className="py-3 px-3">Day-to-Day Change</th>
                <th className="py-3 px-3">Inflow / Outflow</th>
                <th className="py-3 px-3">Rainfall</th>
                <th className="py-3 px-3">Risk Tier</th>
                <th className="py-3 px-3">Status Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {BASELINE_FORECAST.map((item, idx) => {
                const dayChange = forecastChanges[idx];
                const isOct8 = item.date === '2026-10-08';
                return (
                  <tr
                    key={item.date}
                    className={`transition-colors ${
                      isOct8
                        ? 'bg-amber-950/40 border-l-4 border-amber-500 font-semibold'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-3 px-3 font-sans font-medium text-slate-200 flex items-center gap-1.5">
                      <span>{formatFriendlyDate(item.date)}</span>
                      {isOct8 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-slate-950 font-bold uppercase font-sans">
                          Threshold Cross
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-white font-bold text-sm">
                      {item.waterLevelM.toFixed(1)} m
                    </td>
                    <td className="py-3 px-3">
                      {dayChange && dayChange.changeM !== 0 ? (
                        <span
                          className={
                            dayChange.changeM > 0
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {dayChange.changeM > 0 ? `+${dayChange.changeM}` : dayChange.changeM} m/d
                        </span>
                      ) : (
                        <span className="text-slate-400">Baseline</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {item.inflowCusecs} / {item.outflowCusecs} m³/s
                    </td>
                    <td className="py-3 px-3 text-cyan-400 font-medium">
                      {item.rainfallMm} mm
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          item.riskTier === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : item.riskTier === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.riskTier === 'WATCH'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.riskTier}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 text-xs">
                      {isOct8 ? (
                        <span className="text-amber-300 font-medium">
                          Breaches {reservoir.warningLevelM}m warning line. Prepare gate hoists.
                        </span>
                      ) : item.waterLevelM > reservoir.warningLevelM ? (
                        <span className="text-slate-300">Sustained high storage buffer.</span>
                      ) : (
                        <span className="text-slate-400">Within operational envelope.</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
