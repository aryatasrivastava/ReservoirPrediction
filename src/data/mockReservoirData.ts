import { DailyHydrologyRecord, ModelBenchmark, ReservoirMetadata } from '../types';

/**
 * Metadata for the monitored reservoir
 */
export const DEFAULT_RESERVOIR: ReservoirMetadata = {
  id: 'res-pinecrest-01',
  name: 'Cascade Pinecrest Reservoir',
  location: 'Northern Hydrological Basin, Sector 4',
  riverBasin: 'Clearwater River Catchment',
  maxCapacityMCM: 1450.0, // Million Cubic Meters
  deadStorageLevelM: 30.0, // Minimum operational level
  warningLevelM: 85.0, // Warning threshold (Alert triggers here)
  dangerLevelM: 92.0, // Critical flood emergency threshold
  fullReservoirLevelM: 100.0, // Maximum full reservoir level (FRL)
  spillwayGates: 8,
  catchmentAreaKm2: 3840.0,
};

/**
 * 14-day historical telemetry up to current date (Oct 5, 2026)
 */
export const HISTORICAL_HYDROLOGY_DATA: DailyHydrologyRecord[] = [
  {
    date: '2026-09-22',
    waterLevelM: 77.4,
    storageVolumeMCM: 980.5,
    capacityPercentage: 67.6,
    inflowCusecs: 280,
    outflowCusecs: 240,
    rainfallMm: 4.2,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-23',
    waterLevelM: 77.8,
    storageVolumeMCM: 991.2,
    capacityPercentage: 68.3,
    inflowCusecs: 310,
    outflowCusecs: 240,
    rainfallMm: 8.5,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-24',
    waterLevelM: 78.1,
    storageVolumeMCM: 999.0,
    capacityPercentage: 68.9,
    inflowCusecs: 295,
    outflowCusecs: 250,
    rainfallMm: 6.0,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-25',
    waterLevelM: 78.5,
    storageVolumeMCM: 1010.4,
    capacityPercentage: 69.7,
    inflowCusecs: 330,
    outflowCusecs: 250,
    rainfallMm: 12.4,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-26',
    waterLevelM: 78.9,
    storageVolumeMCM: 1021.5,
    capacityPercentage: 70.4,
    inflowCusecs: 340,
    outflowCusecs: 260,
    rainfallMm: 15.0,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-27',
    waterLevelM: 79.2,
    storageVolumeMCM: 1030.1,
    capacityPercentage: 71.0,
    inflowCusecs: 320,
    outflowCusecs: 260,
    rainfallMm: 9.8,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-28',
    waterLevelM: 79.6,
    storageVolumeMCM: 1041.8,
    capacityPercentage: 71.8,
    inflowCusecs: 350,
    outflowCusecs: 270,
    rainfallMm: 18.2,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-29',
    waterLevelM: 80.1,
    storageVolumeMCM: 1056.2,
    capacityPercentage: 72.8,
    inflowCusecs: 390,
    outflowCusecs: 280,
    rainfallMm: 24.5,
    riskTier: 'NORMAL',
  },
  {
    date: '2026-09-30',
    waterLevelM: 80.7,
    storageVolumeMCM: 1073.4,
    capacityPercentage: 74.0,
    inflowCusecs: 430,
    outflowCusecs: 290,
    rainfallMm: 31.0,
    riskTier: 'WATCH',
  },
  {
    date: '2026-10-01',
    waterLevelM: 81.3,
    storageVolumeMCM: 1091.1,
    capacityPercentage: 75.2,
    inflowCusecs: 460,
    outflowCusecs: 310,
    rainfallMm: 28.6,
    riskTier: 'WATCH',
  },
  {
    date: '2026-10-02',
    waterLevelM: 81.9,
    storageVolumeMCM: 1108.9,
    capacityPercentage: 76.5,
    inflowCusecs: 490,
    outflowCusecs: 320,
    rainfallMm: 35.2,
    riskTier: 'WATCH',
  },
  {
    date: '2026-10-03',
    waterLevelM: 82.5,
    storageVolumeMCM: 1126.8,
    capacityPercentage: 77.7,
    inflowCusecs: 520,
    outflowCusecs: 330,
    rainfallMm: 42.0,
    riskTier: 'WATCH',
  },
  {
    date: '2026-10-04',
    waterLevelM: 83.1,
    storageVolumeMCM: 1145.0,
    capacityPercentage: 78.9,
    inflowCusecs: 560,
    outflowCusecs: 340,
    rainfallMm: 48.5,
    riskTier: 'WATCH',
  },
  {
    date: '2026-10-05',
    waterLevelM: 83.8, // Current Today
    storageVolumeMCM: 1166.2,
    capacityPercentage: 80.4,
    inflowCusecs: 610,
    outflowCusecs: 350,
    rainfallMm: 56.4,
    riskTier: 'WATCH',
  },
];

/**
 * Baseline 7-day future forecast (Oct 6 - Oct 12, 2026)
 * Notice: On Oct 8, 2026, water level reaches 85.6m, triggering the Warning alert!
 */
export const BASELINE_FORECAST: DailyHydrologyRecord[] = [
  {
    date: '2026-10-06',
    waterLevelM: 84.4,
    storageVolumeMCM: 1184.5,
    capacityPercentage: 81.7,
    inflowCusecs: 640,
    outflowCusecs: 360,
    rainfallMm: 52.0,
    riskTier: 'WATCH',
    isForecast: true,
  },
  {
    date: '2026-10-07',
    waterLevelM: 84.9,
    storageVolumeMCM: 1200.0,
    capacityPercentage: 82.7,
    inflowCusecs: 620,
    outflowCusecs: 380,
    rainfallMm: 45.0,
    riskTier: 'WATCH',
    isForecast: true,
  },
  {
    date: '2026-10-08',
    waterLevelM: 85.6, // CROSSES 85.0m WARNING THRESHOLD HERE ON OCT 8!
    storageVolumeMCM: 1222.1,
    capacityPercentage: 84.3,
    inflowCusecs: 650,
    outflowCusecs: 400,
    rainfallMm: 60.0,
    riskTier: 'WARNING',
    isForecast: true,
  },
  {
    date: '2026-10-09',
    waterLevelM: 86.4,
    storageVolumeMCM: 1247.3,
    capacityPercentage: 86.0,
    inflowCusecs: 680,
    outflowCusecs: 420,
    rainfallMm: 58.0,
    riskTier: 'WARNING',
    isForecast: true,
  },
  {
    date: '2026-10-10',
    waterLevelM: 87.1,
    storageVolumeMCM: 1270.0,
    capacityPercentage: 87.6,
    inflowCusecs: 630,
    outflowCusecs: 440,
    rainfallMm: 40.0,
    riskTier: 'WARNING',
    isForecast: true,
  },
  {
    date: '2026-10-11',
    waterLevelM: 87.7,
    storageVolumeMCM: 1289.4,
    capacityPercentage: 88.9,
    inflowCusecs: 580,
    outflowCusecs: 450,
    rainfallMm: 30.0,
    riskTier: 'WARNING',
    isForecast: true,
  },
  {
    date: '2026-10-12',
    waterLevelM: 88.2,
    storageVolumeMCM: 1305.8,
    capacityPercentage: 90.0,
    inflowCusecs: 520,
    outflowCusecs: 460,
    rainfallMm: 22.0,
    riskTier: 'WARNING',
    isForecast: true,
  },
];

/**
 * Machine learning model performance benchmarks
 */
export const ML_MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    id: 'lstm',
    name: 'Long Short-Term Memory (LSTM)',
    description: 'Recurrent neural network with 2 stacked LSTM layers capturing non-linear temporal catchment lag and multi-day rainfall memory.',
    rmse: 0.42,
    mae: 0.31,
    r2Score: 0.968,
    latencyMs: 42,
    strengths: 'Excels at complex multi-day monsoon surges and non-linear reservoir retention lag dynamics.',
    bestFor: 'Operational flood early warning (3 to 14 days ahead)',
  },
  {
    id: 'random_forest',
    name: 'Random Forest Regressor',
    description: 'Ensemble of 150 decision trees trained on rolling averages, soil moisture index, and lagged discharge variables.',
    rmse: 0.68,
    mae: 0.52,
    r2Score: 0.932,
    latencyMs: 14,
    strengths: 'Robust against sporadic sensor noise, provides interpretable feature importances.',
    bestFor: 'Short-term horizon (1 to 5 days) and feature correlation audits',
  },
  {
    id: 'linear_regression',
    name: 'Ridge Linear Regression',
    description: 'L2-regularized linear baseline with engineered hydrological mass balance features (Inflow - Outflow + Effective Catchment Precipitation).',
    rmse: 1.15,
    mae: 0.89,
    r2Score: 0.854,
    latencyMs: 3,
    strengths: 'Instantaneous computation, transparent mass-conservation mathematical formulation.',
    bestFor: 'Fast baseline comparisons and low-compute edge deployment',
  },
];

/**
 * Simulator Presets
 */
export const SIMULATOR_PRESETS = [
  {
    id: 'heavy_monsoon',
    name: 'Heavy Monsoon Storm',
    description: 'Continuous intense rainfall (85mm/day) with surging upstream inflow (850 m³/s).',
    params: {
      rainfall: 85,
      inflow: 850,
      outflow: 350,
      current_level: 83.8,
      model: 'lstm' as const,
      horizonDays: 7,
    },
  },
  {
    id: 'controlled_release',
    name: 'Emergency Spillway Discharge',
    description: 'Aggressive dam release (750 m³/s) through 6 open spillway gates to counteract flood surge.',
    params: {
      rainfall: 45,
      inflow: 520,
      outflow: 750,
      current_level: 83.8,
      model: 'lstm' as const,
      horizonDays: 7,
    },
  },
  {
    id: 'dry_spell',
    name: 'Drought / Minimal Inflow',
    description: 'No precipitation, reduced catchment inflow (120 m³/s), and steady municipal outflow (200 m³/s).',
    params: {
      rainfall: 0,
      inflow: 120,
      outflow: 200,
      current_level: 83.8,
      model: 'random_forest' as const,
      horizonDays: 7,
    },
  },
  {
    id: 'baseline_forecast',
    name: 'Standard Baseline Run',
    description: 'Current meteorological forecast and planned standard gate discharge schedule.',
    params: {
      rainfall: 48,
      inflow: 610,
      outflow: 380,
      current_level: 83.8,
      model: 'lstm' as const,
      horizonDays: 7,
    },
  },
];
