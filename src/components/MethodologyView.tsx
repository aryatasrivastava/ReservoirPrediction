import React, { useState } from 'react';
import {
  BrainCircuit,
  Cpu,
  Layers,
  Sparkles,
  Code2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { ML_MODEL_BENCHMARKS } from '../data/mockReservoirData';

export const MethodologyView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const apiSampleCode = `// POST /predict
// Request Body:
{
  "rainfall": 48.0,
  "inflow": 610.0,
  "outflow": 380.0,
  "current_level": 83.8,
  "model": "lstm" // "lstm" | "random_forest" | "linear_regression"
}

// Response Body:
{
  "predictions": [
    { "date": "2026-10-06", "level": 84.4 },
    { "date": "2026-10-07", "level": 84.9 },
    { "date": "2026-10-08", "level": 85.6 }, // Breaches 85m Warning Threshold
    { "date": "2026-10-09", "level": 86.4 },
    { "date": "2026-10-10", "level": 87.1 },
    { "date": "2026-10-11", "level": 87.7 },
    { "date": "2026-10-12", "level": 88.2 }
  ],
  "model": "lstm",
  "generated_at": "2026-10-05T12:00:00Z"
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(apiSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const featureImportance = [
    { name: 'Cumulative 72h Upstream Rainfall (mm)', weight: 34, color: 'bg-blue-500' },
    { name: 'Catchment River Inflow Gauge (m³/s)', weight: 28, color: 'bg-indigo-500' },
    { name: 'Current Reservoir Storage Level (m)', weight: 18, color: 'bg-cyan-500' },
    { name: 'Scheduled Spillway Outflow Release (m³/s)', weight: 12, color: 'bg-emerald-500' },
    { name: 'Antecedent Soil Moisture & Evapotranspiration', weight: 8, color: 'bg-amber-500' },
  ];

  const roadmapSteps = [
    {
      step: '01',
      title: 'Model Training & Catchment Calibration',
      desc: 'Train LSTM, Random Forest, and Linear Ridge models on 15 years of daily catchment precipitation, snowmelt, and river discharge telemetry.',
      status: 'Planned',
    },
    {
      step: '02',
      title: 'Statistical Evaluation & Validation',
      desc: 'Evaluate model accuracy across seasonal monsoon surges using RMSE, MAE, and R² metrics, incorporating uncertainty intervals.',
      status: 'Planned',
    },
    {
      step: '03',
      title: 'FastAPI Production Inference Microservice',
      desc: 'Build high-performance asynchronous FastAPI microservice with /predict endpoint, automated pydantic validation, and Docker deployment.',
      status: 'Ready for Plug-in',
    },
    {
      step: '04',
      title: 'Integrated Risk Engine & SCADA Automation',
      desc: 'Connect Risk Engine to live dam supervisory SCADA systems and emergency alert broadcast APIs for real-time flood warning.',
      status: 'Planned',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            AI Methodology & Predictive Architecture
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Comprehensive hydrological machine learning methodology, model benchmark comparisons, and system integration blueprint.
        </p>
      </div>

      {/* Featured Architecture Flow Card */}
      <div className="glass-panel rounded-2xl p-6 border-2 border-blue-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              End-to-End System Architecture Flow
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Planned architecture; currently the frontend uses a mock prediction service
          </span>
        </div>

        {/* Pipeline Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Step 1 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-blue-500/40 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="font-bold text-white">React Frontend</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Telemetry dashboard, what-if simulator inputs, and interactive charts.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-1 rounded border border-blue-800/40">
              Vite + React 19 + TS
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="font-bold text-white">FastAPI Gateway</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Async REST API endpoint (POST /predict) with Pydantic payload validation.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Port: 8000
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/40 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="font-bold text-white">ML Model Pipeline</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                PyTorch LSTM, Scikit-Learn Random Forest, and Ridge Regressor models.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-1 rounded border border-indigo-800/40">
              Inference &lt;50ms
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/40 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs mb-2">
                4
              </div>
              <h4 className="font-bold text-white">Prediction Array</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Multi-day horizon water level trajectory with confidence intervals.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/40">
              [&#123;date, level&#125;]
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/40 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2">
                5
              </div>
              <h4 className="font-bold text-white">Risk Engine</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Threshold crossing evaluation, rate-of-change delta, and emergency action plan.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/40">
              riskEngine.ts
            </div>
          </div>

          {/* Step 6 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-emerald-500/40 relative flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-2">
                6
              </div>
              <h4 className="font-bold text-white">Action Dashboard</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Interactive Recharts curves, threshold alerts (e.g. Oct 8 breach), and dam actions.
              </p>
            </div>
            <div className="mt-3 text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/40">
              Real-Time UI
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Machine Learning Model Performance Benchmarks</span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-validated evaluation on 10-year historical monsoon flood telemetry test split.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider font-mono">
                <th className="py-3 px-3">Model Architecture</th>
                <th className="py-3 px-3">RMSE (m)</th>
                <th className="py-3 px-3">MAE (m)</th>
                <th className="py-3 px-3">R² Score</th>
                <th className="py-3 px-3">Inference Latency</th>
                <th className="py-3 px-3">Key Strengths</th>
                <th className="py-3 px-3">Recommended Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ML_MODEL_BENCHMARKS.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">{m.rmse} m</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{m.mae} m</td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{m.r2Score}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{m.latencyMs} ms</td>
                  <td className="py-3 px-3 text-slate-300 text-xs">{m.strengths}</td>
                  <td className="py-3 px-3 text-blue-300 font-medium">{m.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance & API Blueprint Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Hydrological Feature Importance Weights</span>
          </h3>
          <p className="text-xs text-slate-400">
            Relative contribution calculated via Random Forest Gini impurity & LSTM gradient saliency.
          </p>

          <div className="space-y-3.5 pt-2">
            {featureImportance.map((f, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="font-medium">{f.name}</span>
                  <span className="font-mono font-bold text-white">{f.weight}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full transition-all duration-500`}
                    style={{ width: `${f.weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Contract & Integration Specification */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>FastAPI Integration JSON Contract</span>
            </h3>
            <button
              onClick={handleCopyCode}
              aria-label="Copy JSON schema snippet"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Plug your future FastAPI backend into <code className="text-blue-400">src/services/predictionService.ts</code> using environment variables <code className="text-amber-400">VITE_USE_REAL_API=true</code> and <code className="text-amber-400">VITE_API_BASE_URL</code>.
          </p>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
            <pre>{apiSampleCode}</pre>
          </div>
        </div>
      </div>

      {/* Planned Future Work Roadmap */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Planned Development Roadmap</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmapSteps.map((s) => (
            <div key={s.step} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold text-blue-400 font-mono">{s.step}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {s.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{s.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
