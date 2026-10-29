/**
 * TypeScript definitions for Reservoir Water Level Prediction & Risk Analytics
 */

export type RiskTier = 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type MLModelType = 'lstm' | 'random_forest' | 'linear_regression';

export interface ReservoirMetadata {
  id: string;
  name: string;
  location: string;
  riverBasin: string;
  maxCapacityMCM: number; // Million Cubic Meters
  deadStorageLevelM: number; // meters
  warningLevelM: number; // meters (e.g., 85.0m)
  dangerLevelM: number; // meters (e.g., 92.0m)
  fullReservoirLevelM: number; // meters (e.g., 100.0m)
  spillwayGates: number;
  catchmentAreaKm2: number;
}

export interface DailyHydrologyRecord {
  date: string; // YYYY-MM-DD
  waterLevelM: number; // meters
  storageVolumeMCM: number; // Million Cubic Meters
  capacityPercentage: number; // 0 - 100%
  inflowCusecs: number; // m³/s
  outflowCusecs: number; // m³/s
  rainfallMm: number; // mm in 24h
  riskTier: RiskTier;
  isForecast?: boolean;
}

export interface ForecastInput {
  rainfall: number; // expected average daily rainfall (mm)
  inflow: number; // estimated average inflow (m³/s)
  outflow: number; // scheduled dam release / outflow (m³/s)
  current_level: number; // current reservoir level (m)
  model: MLModelType; // selected ML architecture
  horizonDays?: number; // 3, 7, or 14 days forecast
}

export interface PredictedDay {
  date: string;
  level: number;
  inflow?: number;
  outflow?: number;
  rainfall?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

export interface ForecastResult {
  predictions: PredictedDay[];
  model: MLModelType;
  generated_at: string;
  simulationNote?: string;
}

export interface ThresholdCrossing {
  crossed: boolean;
  date: string | null;
  level: number | null;
  tier: RiskTier;
  daysFromNow: number | null;
}

export interface RiskAssessment {
  currentTier: RiskTier;
  predictedPeakTier: RiskTier;
  predictedPeakLevel: number;
  predictedPeakDate: string;
  dailyRateOfChangeM: number; // m/day
  thresholdCrossing: ThresholdCrossing;
  alertTitle: string;
  alertMessage: string;
  recommendedActions: string[];
}

export interface ModelBenchmark {
  id: MLModelType;
  name: string;
  description: string;
  rmse: number; // Root Mean Square Error (meters)
  mae: number; // Mean Absolute Error (meters)
  r2Score: number; // R² Score (0 - 1)
  latencyMs: number; // Avg inference latency (ms)
  strengths: string;
  bestFor: string;
}
