/**
 * Prediction Service for Reservoir Water Level Forecasting
 * 
 * =========================================================================================
 * FUTURE FASTAPI BACKEND INTEGRATION SPECIFICATION:
 * =========================================================================================
 * When VITE_USE_REAL_API=true, this service sends an HTTP POST request to:
 *   POST ${API_BASE_URL}/predict
 * 
 * Expected Request JSON Shape:
 * {
 *   "rainfall": number,         // mm/day
 *   "inflow": number,           // m³/s
 *   "outflow": number,          // m³/s
 *   "current_level": number,    // meters
 *   "model": "lstm" | "random_forest" | "linear_regression"
 * }
 * 
 * Expected Response JSON Shape:
 * {
 *   "predictions": [
 *     {
 *       "date": "2026-10-06",
 *       "level": 84.4
 *     },
 *     ...
 *   ],
 *   "model": "lstm",
 *   "generated_at": "2026-10-05T12:00:00.000Z"
 * }
 * =========================================================================================
 */

import { ForecastInput, ForecastResult, PredictedDay } from '../types';
import { BASELINE_FORECAST } from '../data/mockReservoirData';

// Configuration flags
export const USE_REAL_API: boolean = import.meta.env.VITE_USE_REAL_API === 'true';
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Generates a mock deterministic reservoir water level forecast using
 * physical mass balance and model-specific hydrological dynamics.
 */
function generateMockForecast(input: ForecastInput): ForecastResult {
  const horizon = input.horizonDays || 7;
  const startDate = new Date('2026-10-06');
  const predictions: PredictedDay[] = [];

  let runningLevel = input.current_level;

  // Hydrological mass balance constants:
  // Catchment runoff factor (~0.35 - 0.55 of rainfall converts to delayed inflow)
  // Surface area of reservoir ~ 45 km² -> 1 meter rise ≈ 45 MCM
  // Net inflow (m³/s) * 86400 s/day = net daily m³
  const netCusecs = input.inflow - input.outflow;
  const directRainContributionM = (input.rainfall / 1000) * 1.8; // direct + catchment runoff ratio
  const flowDeltaM = (netCusecs * 86400) / (45 * 1000000); // meters per day from flow delta

  for (let i = 0; i < horizon; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Apply model-specific behavior and realistic non-linearities:
    let dailyShift = flowDeltaM + directRainContributionM;

    if (input.model === 'lstm') {
      // LSTM captures decaying temporal memory and upstream catchment concentration time
      const catchmentLag = Math.sin((i + 1) / 2) * 0.12 * (input.rainfall / 50);
      dailyShift += catchmentLag;
    } else if (input.model === 'random_forest') {
      // Random forest exhibits stepped non-linear response to high inflow thresholds
      const nonLinearStep = input.inflow > 600 ? 0.15 : -0.05;
      dailyShift += (nonLinearStep * (i + 1)) / 10;
    } else {
      // Linear regression uses direct proportional superposition
      dailyShift = dailyShift * 0.96;
    }

    // Accumulate level with bounds (between 25m and 105m)
    runningLevel = Math.max(25.0, Math.min(105.0, runningLevel + dailyShift));
    const roundedLevel = Number(runningLevel.toFixed(2));

    // Confidence intervals (wider for longer horizon & simpler models)
    const uncertaintyMultiplier = input.model === 'lstm' ? 0.08 : input.model === 'random_forest' ? 0.12 : 0.20;
    const errorMargin = (i + 1) * uncertaintyMultiplier;

    predictions.push({
      date: dateStr,
      level: roundedLevel,
      inflow: Math.max(0, Math.round(input.inflow + (Math.sin(i) * 20))),
      outflow: Math.round(input.outflow),
      rainfall: Math.max(0, Math.round(input.rainfall * Math.max(0.3, 1 - i * 0.08))),
      confidenceLower: Number(Math.max(25.0, roundedLevel - errorMargin).toFixed(2)),
      confidenceUpper: Number(Math.min(105.0, roundedLevel + errorMargin).toFixed(2)),
    });
  }

  return {
    predictions,
    model: input.model,
    generated_at: new Date().toISOString(),
    simulationNote: `Computed via deterministic hydrological mass-balance engine (${input.model.toUpperCase()}).`,
  };
}

/**
 * Main forecast dispatcher.
 * Switches seamlessly between the mock simulator and the live FastAPI backend based on configuration.
 */
export async function getForecast(input: ForecastInput): Promise<ForecastResult> {
  // Check if live API integration is enabled
  if (USE_REAL_API) {
    /* -------------------------------------------------------------------------
     * [FUTURE FASTAPI ENDPOINT CONNECTION POINT]
     * When backend is ready, standard POST to FastAPI /predict
     * ------------------------------------------------------------------------- */
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          rainfall: input.rainfall,
          inflow: input.inflow,
          outflow: input.outflow,
          current_level: input.current_level,
          model: input.model,
        }),
      });

      if (!response.ok) {
        throw new Error(`FastAPI server responded with status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        predictions: data.predictions,
        model: data.model || input.model,
        generated_at: data.generated_at || new Date().toISOString(),
        simulationNote: 'Retrieved live from FastAPI ML Inference Service.',
      };
    } catch (error) {
      console.warn(`[PredictionService] Live API request to ${API_BASE_URL}/predict failed. Falling back to deterministic mock.`, error);
      // Graceful fallback to mock with indicator
      const fallbackResult = generateMockForecast(input);
      fallbackResult.simulationNote = `Live API connection to ${API_BASE_URL} failed; fallback mock forecast active.`;
      return fallbackResult;
    }
  }

  // Deterministic Mock Generator with realistic network latency simulation (450ms)
  await new Promise((resolve) => setTimeout(resolve, 450));

  // If input matches default baseline conditions, return the aligned baseline forecast
  if (
    input.current_level === 83.8 &&
    input.rainfall === 48 &&
    input.inflow === 610 &&
    input.outflow === 380 &&
    input.model === 'lstm'
  ) {
    return {
      predictions: BASELINE_FORECAST.map((b) => ({
        date: b.date,
        level: b.waterLevelM,
        inflow: b.inflowCusecs,
        outflow: b.outflowCusecs,
        rainfall: b.rainfallMm,
        confidenceLower: Number((b.waterLevelM - 0.25).toFixed(2)),
        confidenceUpper: Number((b.waterLevelM + 0.25).toFixed(2)),
      })),
      model: 'lstm',
      generated_at: new Date().toISOString(),
      simulationNote: 'Standard baseline forecast loaded.',
    };
  }

  return generateMockForecast(input);
}
