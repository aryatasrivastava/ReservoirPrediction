import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { HISTORICAL_HYDROLOGY_DATA, DEFAULT_RESERVOIR } from '../data/mockReservoirData';
import { formatFriendlyDate } from '../services/riskEngine';
import {
  LineChart as LineChartIcon,
  Download,
  Calendar,
  ArrowDownUp,
  Droplets,
  Search,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'7d' | '14d'>('14d');
  const [searchQuery, setSearchQuery] = useState('');

  const displayedData =
    dateFilter === '7d'
      ? HISTORICAL_HYDROLOGY_DATA.slice(-7)
      : HISTORICAL_HYDROLOGY_DATA;

  // Formatted data for charts
  const chartData = displayedData.map((d) => ({
    ...d,
    displayDate: formatFriendlyDate(d.date),
    netFlow: d.inflowCusecs - d.outflowCusecs,
  }));

  // Filtered table rows
  const filteredRows = displayedData.filter(
    (row) =>
      row.date.includes(searchQuery) ||
      row.riskTier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.waterLevelM.toString().includes(searchQuery)
  );

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Water Level (m)',
      'Storage Volume (MCM)',
      'Capacity (%)',
      'Inflow (m3/s)',
      'Outflow (m3/s)',
      'Rainfall (mm)',
      'Risk Tier',
    ];

    const rows = HISTORICAL_HYDROLOGY_DATA.map((r) => [
      r.date,
      r.waterLevelM,
      r.storageVolumeMCM,
      r.capacityPercentage,
      r.inflowCusecs,
      r.outflowCusecs,
      r.rainfallMm,
      r.riskTier,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reservoir_telemetry_${DEFAULT_RESERVOIR.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hydrological balance sums
  const totalRainfall = displayedData.reduce((acc, curr) => acc + curr.rainfallMm, 0);
  const avgInflow = Math.round(displayedData.reduce((acc, curr) => acc + curr.inflowCusecs, 0) / displayedData.length);
  const avgOutflow = Math.round(displayedData.reduce((acc, curr) => acc + curr.outflowCusecs, 0) / displayedData.length);
  const levelRise = Number((displayedData[displayedData.length - 1].waterLevelM - displayedData[0].waterLevelM).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Header with Export & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Historical Telemetry & Catchment Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            In-depth multi-variable correlation analysis across reservoir levels, precipitation inputs, and discharge dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setDateFilter('7d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === '7d'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setDateFilter('14d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                dateFilter === '14d'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past 14 Days
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            aria-label="Export historical telemetry data to CSV file"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Hydrological Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Net Storage Change
          </span>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-white">{levelRise >= 0 ? `+${levelRise}` : levelRise}m</span>
            <span className="text-xs text-amber-400 font-sans">Accumulation</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            From {displayedData[0].waterLevelM}m to {displayedData[displayedData.length - 1].waterLevelM}m
          </span>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cumulative Rainfall
          </span>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-sky-400">{totalRainfall.toFixed(1)} mm</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Catchment total over {dateFilter}</span>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Average River Inflow
          </span>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-indigo-400">{avgInflow} m³/s</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Max peak: 610 m³/s</span>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Average Spillway Release
          </span>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-cyan-400">{avgOutflow} m³/s</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Turbines & 2 spillway radial gates</span>
        </div>
      </div>

      {/* Dual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Water Level & Rainfall Correlation */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Water Level Rise vs Daily Precipitation</span>
            </h3>
          </div>
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis yAxisId="lvl" domain={[75, 86]} stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}m`} />
                <YAxis yAxisId="rain" orientation="right" domain={[0, 80]} stroke="#38bdf8" fontSize={10} tickFormatter={(v) => `${v}mm`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-sans">
                          <div className="font-semibold text-white border-b border-slate-700 pb-1">{label}</div>
                          <div className="flex justify-between gap-4 text-slate-300 mt-1">
                            <span>Water Level:</span>
                            <span className="font-mono font-bold text-white">{data.waterLevelM} m</span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-300">
                            <span>Precipitation:</span>
                            <span className="font-mono text-sky-400">{data.rainfallMm} mm</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="lvl" type="monotone" dataKey="waterLevelM" name="Water Level (m)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line yAxisId="rain" type="monotone" dataKey="rainfallMm" name="Rainfall (mm)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Inflow vs Outflow Hydrograph */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-indigo-400" />
              <span>Inflow vs Outflow Hydrograph (m³/s)</span>
            </h3>
          </div>
          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 p-3 rounded-xl border border-slate-700 shadow-xl text-xs font-sans">
                          <div className="font-semibold text-white border-b border-slate-700 pb-1">{label}</div>
                          <div className="flex justify-between gap-4 text-indigo-300 mt-1">
                            <span>Inflow:</span>
                            <span className="font-mono font-bold">{data.inflowCusecs} m³/s</span>
                          </div>
                          <div className="flex justify-between gap-4 text-cyan-300">
                            <span>Outflow:</span>
                            <span className="font-mono font-bold">{data.outflowCusecs} m³/s</span>
                          </div>
                          <div className="flex justify-between gap-4 text-amber-300 pt-1 border-t border-slate-800">
                            <span>Net Accumulation:</span>
                            <span className="font-mono font-bold">+{data.netFlow} m³/s</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="inflowCusecs" name="Inflow (m³/s)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outflowCusecs" name="Outflow (m³/s)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Telemetry Data Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Historical Telemetry Log Archive</span>
            </h3>
            <p className="text-xs text-slate-400">
              Complete sensor records from automated catchment gauges and supervisory dam sensors.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search date or tier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider font-mono">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Level (m)</th>
                <th className="py-2.5 px-3">Storage (MCM)</th>
                <th className="py-2.5 px-3">Capacity %</th>
                <th className="py-2.5 px-3">Inflow (m³/s)</th>
                <th className="py-2.5 px-3">Outflow (m³/s)</th>
                <th className="py-2.5 px-3">Rain (mm)</th>
                <th className="py-2.5 px-3">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRows.map((row) => (
                <tr key={row.date} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{row.date}</td>
                  <td className="py-2.5 px-3 text-white font-bold">{row.waterLevelM.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.storageVolumeMCM.toFixed(1)}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-semibold">{row.capacityPercentage}%</td>
                  <td className="py-2.5 px-3 text-indigo-300">{row.inflowCusecs}</td>
                  <td className="py-2.5 px-3 text-cyan-300">{row.outflowCusecs}</td>
                  <td className="py-2.5 px-3 text-sky-400 font-semibold">{row.rainfallMm}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.riskTier === 'WATCH'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {row.riskTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
