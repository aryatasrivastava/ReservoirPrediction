import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Area,
} from 'recharts';
import { MLModelType, ForecastInput, ForecastResult } from '../types';
import { DEFAULT_RESERVOIR, BASELINE_FORECAST, SIMULATOR_PRESETS } from '../data/mockReservoirData';
import { getForecast } from '../services/predictionService';
import { buildAlertMessage, computeDayToDayChange, formatFriendlyDate } from '../services/riskEngine';
import { AlertBanner } from './AlertBanner';
import {
  Sliders,
  Play,
  RotateCcw,
  CloudRain,
  Waves,
  Gauge,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';

export const SimulatorView: React.FC = () => {
  const reservoir = DEFAULT_RESERVOIR;

  // Simulator Inputs State
  const [inputs, setInputs] = useState<ForecastInput>({
    rainfall: 48,
    inflow: 610,
    outflow: 380,
    current_level: 83.8,
    model: 'lstm',
    horizonDays: 7,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null);

  // Initial simulation run on mount
  useEffect(() => {
    handleRunSimulation();
  }, []);

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const result = await getForecast(inputs);
      setForecastResult(result);
    } catch (err) {
      console.error('Simulation run failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = SIMULATOR_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setInputs({ ...preset.params });
    }
  };

  const handleReset = () => {
    setInputs({
      rainfall: 48,
      inflow: 610,
      outflow: 380,
      current_level: 83.8,
      model: 'lstm',
      horizonDays: 7,
    });
  };

  // Evaluate risk for the generated forecast using the pure riskEngine
  const predictions = forecastResult?.predictions || [];
  const riskAssessment = buildAlertMessage(
    inputs.current_level,
    predictions.map((p) => ({ date: p.date, level: p.level })),
    reservoir
  );

  const rateChanges = computeDayToDayChange(predictions.map((p) => ({ date: p.date, level: p.level })));

  // Build combined chart dataset with baseline comparison
  const chartData = predictions.map((pred, idx) => {
    const baselineItem = BASELINE_FORECAST[idx];
    return {
      date: pred.date,
      displayDate: formatFriendlyDate(pred.date),
      simulatedLevel: pred.level,
      confidenceLower: pred.confidenceLower,
      confidenceUpper: pred.confidenceUpper,
      baselineLevel: baselineItem ? baselineItem.waterLevelM : undefined,
      inflow: pred.inflow,
      outflow: pred.outflow,
      rainfall: pred.rainfall,
    };
  });

  const netCusecs = inputs.inflow - inputs.outflow;

  return (
    <div className="space-y-6">
      {/* Header Introduction */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Hydrological What-If Scenario Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
            Simulate hypothetical monsoon precipitation storms, stress-test gate discharge schedules, and compare predictions across ML models.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            aria-label="Reset simulation parameters to default"
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            aria-label="Run ML Reservoir Forecast"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run AI Forecast</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="glass-panel rounded-xl p-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
          Quick-Load Scenario Presets:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SIMULATOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 text-left transition-all hover:border-blue-500/50 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-blue-400">
                  {preset.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {preset.params.model.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              <span>Hydrological Parameters</span>
            </h2>
            <span className="text-[11px] text-cyan-400 font-mono">Interactive Sliders</span>
          </div>

          {/* Input 1: Current Water Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="current_level" className="font-medium text-slate-300">
                Current Water Level (m)
              </label>
              <span className="font-mono font-bold text-blue-400 text-sm">
                {inputs.current_level.toFixed(1)} m
              </span>
            </div>
            <input
              id="current_level"
              type="range"
              min={60.0}
              max={98.0}
              step={0.1}
              value={inputs.current_level}
              onChange={(e) => setInputs({ ...inputs, current_level: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              aria-label="Current water level in meters"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>60.0m (Low)</span>
              <span>85.0m (Warning)</span>
              <span>98.0m (Max FRL)</span>
            </div>
          </div>

          {/* Input 2: Expected Rainfall */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="rainfall" className="font-medium text-slate-300 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>Forecast Catchment Rainfall (mm/day)</span>
              </label>
              <span className="font-mono font-bold text-sky-400 text-sm">{inputs.rainfall} mm</span>
            </div>
            <input
              id="rainfall"
              type="range"
              min={0}
              max={150}
              step={1}
              value={inputs.rainfall}
              onChange={(e) => setInputs({ ...inputs, rainfall: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              aria-label="Forecast daily rainfall in millimeters"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0mm (Dry)</span>
              <span>50mm (Moderate)</span>
              <span>150mm (Severe Storm)</span>
            </div>
          </div>

          {/* Input 3: River Inflow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="inflow" className="font-medium text-slate-300 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-indigo-400" />
                <span>Estimated Upstream Inflow (m³/s)</span>
              </label>
              <span className="font-mono font-bold text-indigo-400 text-sm">{inputs.inflow} m³/s</span>
            </div>
            <input
              id="inflow"
              type="range"
              min={50}
              max={1200}
              step={10}
              value={inputs.inflow}
              onChange={(e) => setInputs({ ...inputs, inflow: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              aria-label="Upstream river inflow in cubic meters per second"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 m³/s</span>
              <span>600 m³/s (Normal)</span>
              <span>1,200 m³/s (Flood Peak)</span>
            </div>
          </div>

          {/* Input 4: Spillway Outflow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="outflow" className="font-medium text-slate-300 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dam Release / Outflow Discharge (m³/s)</span>
              </label>
              <span className="font-mono font-bold text-cyan-400 text-sm">{inputs.outflow} m³/s</span>
            </div>
            <input
              id="outflow"
              type="range"
              min={50}
              max={1000}
              step={10}
              value={inputs.outflow}
              onChange={(e) => setInputs({ ...inputs, outflow: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              aria-label="Dam spillway discharge in cubic meters per second"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 m³/s (Turbine min)</span>
              <span>400 m³/s</span>
              <span>1,000 m³/s (All Gates Open)</span>
            </div>
          </div>

          {/* Input 5: Model Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label htmlFor="model_select" className="text-xs font-semibold text-slate-300 block">
              Machine Learning Architecture
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'lstm', label: 'LSTM Net', desc: 'Deep RNN' },
                  { id: 'random_forest', label: 'Random Forest', desc: 'Ensemble' },
                  { id: 'linear_regression', label: 'Ridge Reg.', desc: 'Linear Mass' },
                ] as const
              ).map((m) => {
                const isSelected = inputs.model === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setInputs({ ...inputs, model: m.id as MLModelType })}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input 6: Horizon Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Forecast Horizon</span>
              <span className="font-mono text-indigo-400 font-bold">{inputs.horizonDays} Days</span>
            </div>
            <div className="flex gap-2">
              {[3, 7, 14].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setInputs({ ...inputs, horizonDays: days })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    inputs.horizonDays === days
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Water Balance Summary Strip */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Net River Flow Delta:</span>
              <span
                className={`font-mono font-bold ${
                  netCusecs >= 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {netCusecs >= 0 ? `+${netCusecs}` : netCusecs} m³/s
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hydrological Tendency:</span>
              <span className="text-slate-200 font-medium">
                {netCusecs > 100 || inputs.rainfall > 30
                  ? 'Accumulating Water Volume'
                  : netCusecs < -50
                  ? 'Depleting Water Volume'
                  : 'Near Equilibrium'}
              </span>
            </div>
          </div>
        </div>

        {/* Results & Visualizer Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Dynamic Risk Engine Assessment Output */}
          <AlertBanner assessment={riskAssessment} />

          {/* Simulation Forecast Chart Card */}
          <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Simulated Reservoir Trajectory</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {inputs.model.toUpperCase()} Engine
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {forecastResult?.simulationNote || 'Simulated predictive horizon vs baseline telemetry'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-0.5 bg-sky-400" /> Simulated
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-0.5 bg-slate-500 stroke-dashed" /> Baseline
                </span>
              </div>
            </div>

            {/* Recharts Simulation Trajectory */}
            <div className="h-72 sm:h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[65, 100]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}m`} />

                  <ReferenceLine
                    y={reservoir.warningLevelM}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Warning (${reservoir.warningLevelM}m)`,
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                  <ReferenceLine
                    y={reservoir.dangerLevelM}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Danger (${reservoir.dangerLevelM}m)`,
                      fill: '#ef4444',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 font-sans">
                            <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1">
                              {label} ({data.date})
                            </div>
                            <div className="flex justify-between gap-4 text-white">
                              <span>Simulated Level:</span>
                              <span className="font-mono font-bold text-sky-400">
                                {data.simulatedLevel?.toFixed(2)} m
                              </span>
                            </div>
                            {data.baselineLevel && (
                              <div className="flex justify-between gap-4 text-slate-400">
                                <span>Baseline Level:</span>
                                <span className="font-mono">{data.baselineLevel.toFixed(2)} m</span>
                              </div>
                            )}
                            <div className="flex justify-between gap-4 text-slate-400">
                              <span>In / Out / Rain:</span>
                              <span className="font-mono text-slate-300">
                                {data.inflow} / {data.outflow} m³/s | {data.rainfall}mm
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="confidenceUpper"
                    stroke="none"
                    fill="#38bdf8"
                    fillOpacity={0.15}
                  />

                  <Line
                    type="monotone"
                    dataKey="baselineLevel"
                    stroke="#64748b"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Baseline Forecast"
                  />

                  <Line
                    type="monotone"
                    dataKey="simulatedLevel"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#38bdf8' }}
                    activeDot={{ r: 7 }}
                    name="Simulated Level"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast Days Summary Table */}
          <div className="glass-panel rounded-2xl p-4 overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Horizon Projections Breakdown</span>
            </h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Simulated Level</th>
                  <th className="py-2 px-2">Daily Delta</th>
                  <th className="py-2 px-2">Confidence Range</th>
                  <th className="py-2 px-2">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-mono">
                {predictions.map((p, idx) => {
                  const change = rateChanges[idx]?.changeM ?? 0;
                  const tier =
                    p.level >= reservoir.dangerLevelM
                      ? 'CRITICAL'
                      : p.level >= reservoir.warningLevelM
                      ? 'WARNING'
                      : p.level >= 80.0
                      ? 'WATCH'
                      : 'NORMAL';

                  return (
                    <tr key={p.date} className="hover:bg-slate-900/40">
                      <td className="py-2 px-2 font-sans text-slate-200">{formatFriendlyDate(p.date)}</td>
                      <td className="py-2 px-2 text-white font-bold">{p.level.toFixed(2)} m</td>
                      <td className="py-2 px-2">
                        {change !== 0 ? (
                          <span className={change > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                            {change > 0 ? `+${change}` : change} m
                          </span>
                        ) : (
                          <span className="text-slate-500">0.00</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-slate-400 text-[11px]">
                        [{p.confidenceLower ?? (p.level - 0.3).toFixed(1)}m – {p.confidenceUpper ?? (p.level + 0.3).toFixed(1)}m]
                      </td>
                      <td className="py-2 px-2 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tier === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-300'
                              : tier === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : tier === 'WATCH'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {tier}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
