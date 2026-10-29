# AquaForecast AI — Reservoir Water Level Prediction & Flood Risk Intelligence

AquaForecast AI is a hydrological decision-support platform designed for reservoir dam operations, flood forecasting, and water resource management. It combines real-time catchment telemetry visualization, interactive what-if simulation, and multi-tier flood risk classification powered by machine learning algorithms (LSTM Neural Networks, Random Forest Regressors, and Ridge Regression).

> **Honesty & Demo Data Notice:**  
> This frontend application currently runs on realistic hydrological simulation data and a deterministic mock prediction engine with physical mass balance equations. The end-to-end architecture is designed to integrate seamlessly with a live FastAPI backend for ML inference without requiring UI redesign.

---

## 🌟 Key Features

1. **Live Hydrological Dashboard**
   - Real-time reservoir storage telemetry (Water Level in meters, Storage Volume in MCM, Capacity %, Net River Inflow vs Discharge, 24h Precipitation).
   - Animated visual reservoir cross-section gauge with physical threshold markers (Dead Storage, Warning, Danger, Full Reservoir Level).
   - Interactive time-series Recharts graph plotting 14-day historical telemetry and 7-day predictive horizon with confidence intervals.
   - **Automated Threshold Crossing Alert**: Real-time detection of the **Oct 8 threshold breach** with dynamic action protocol synthesis.
   - 7-day predictive risk schedule table with day-to-day rate of rise/fall calculations.

2. **Hydrological What-If Scenario Simulator**
   - Interactive sliders to stress-test hypothetical weather scenarios: Current Level (60m–98m), Rainfall (0–150 mm/day), River Inflow (50–1,200 m³/s), Dam Outflow Release (50–1,000 m³/s).
   - Quick-load presets: *Heavy Monsoon Storm*, *Emergency Spillway Discharge*, *Drought / Low Inflow*, *Standard Baseline Run*.
   - Multi-model architecture selector: **LSTM Deep RNN**, **Random Forest Ensemble**, and **Ridge Linear Mass-Balance**.
   - Immediate feedback powered by `services/riskEngine.ts` displaying simulated trajectory vs baseline and emergency action recommendations.

3. **Historical Trends & Analytics**
   - Multi-metric historical trend analysis (Water Level rise vs 24h Precipitation, Inflow vs Outflow hydrograph).
   - Net storage change accumulation metrics and catchment balance summaries.
   - Searchable, filterable historical telemetry data table.
   - **One-click CSV Export** of full telemetry history.

4. **ML Methodology & Planned Architecture**
   - Visual architectural pipeline: `React Frontend → FastAPI → ML Model → Prediction → Risk Engine → Dashboard`.
   - ML model benchmark matrix (RMSE, MAE, R², Inference Latency, Strengths, Best Use Cases).
   - Hydrological feature importance ranking (Precipitation memory, river inflow lag, current retention, soil moisture).
   - Complete FastAPI JSON schema request/response specifications and integration guide.

5. **Design & Accessibility**
   - Dark & Light mode toggle with smooth transitions and persistent state.
   - Accessible color contrast, ARIA labels, and responsive layout for mobile, tablet, and desktop screens.

---

## 🛠️ Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v22)
- **npm**: `v9.0.0` or higher

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
# Navigate to project directory
cd reservoirpred

# Install dependencies
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to the printed local URL (typically `http://localhost:5173`).

### 3. Build for Production

```bash
npm run build
```

The optimized production bundle will be generated in the `dist/` directory.

---

## 📂 Project Structure

```
reservoirpred/
├── index.html                 # HTML shell with Google Fonts & responsive meta tags
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS styling and color extensions
├── tsconfig.json              # Strict TypeScript compiler configuration
├── vite.config.ts             # Vite configuration with React plugin
├── src/
│   ├── App.tsx                # Main application component & layout orchestrator
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Tailwind base styles and custom glassmorphism utilities
│   ├── vite-env.d.ts          # Vite environment variable definitions
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces (Hydrology, Forecast, Risk, Benchmarks)
│   ├── data/
│   │   └── mockReservoirData.ts  # Historical telemetry, baseline forecast, and presets
│   ├── services/
│   │   ├── riskEngine.ts      # Pure risk classification, rate-of-change, & alert generator
│   │   └── predictionService.ts # Forecast service with FastAPI plug-in and mock fallback
│   ├── context/
│   │   └── ThemeContext.tsx   # Dark/Light theme provider and localStorage synchronization
│   └── components/
│       ├── Navbar.tsx         # Responsive header, view switcher, API pill, theme toggle
│       ├── Footer.tsx         # System status & planned architecture flow banner
│       ├── AlertBanner.tsx    # Accessible, dynamic threshold breach alert banner
│       ├── LevelGauge.tsx     # Animated reservoir column gauge with threshold marks
│       ├── DashboardView.tsx  # Overview telemetry, Oct 8 alert, Recharts timeline & table
│       ├── SimulatorView.tsx  # What-if scenario simulator with interactive sliders
│       ├── AnalyticsView.tsx  # Historical trends, correlation charts & CSV export
│       └── MethodologyView.tsx# Architecture flow, benchmark table, feature weights & API docs
└── README.md                  # Project documentation
```

---

## 📊 Where Mock Data Lives & How to Swap in Real Data

All mock historical telemetry, baseline forecasts, reservoir metadata, and simulator presets live in:
👉 [`src/data/mockReservoirData.ts`](file:///c:/Users/sriva/OneDrive/Documents/projects/reservoirpred/src/data/mockReservoirData.ts)

### To swap in real data:
1. **Reservoir Metadata**: Update `DEFAULT_RESERVOIR` with the target dam's Full Reservoir Level (FRL), Warning Level, Danger Level, Catchment Area, and Max Storage Capacity.
2. **Telemetry Feeds**: Replace `HISTORICAL_HYDROLOGY_DATA` with time-series records fetched from your telemetry SCADA database or hydrological sensor API (containing `date`, `waterLevelM`, `storageVolumeMCM`, `inflowCusecs`, `outflowCusecs`, and `rainfallMm`).

---

## 🔌 Connecting the Future FastAPI Backend

The prediction service is located in:
👉 [`src/services/predictionService.ts`](file:///c:/Users/sriva/OneDrive/Documents/projects/reservoirpred/src/services/predictionService.ts)

### Environment Variables
Create a `.env` file in the project root:

```env
# Enable live HTTP calls to FastAPI
VITE_USE_REAL_API=true

# FastAPI base server URL
VITE_API_BASE_URL=http://localhost:8000
```

### Expected Request & Response JSON Contracts

When `VITE_USE_REAL_API=true`, `getForecast()` sends an HTTP POST request to `${VITE_API_BASE_URL}/predict`:

#### Request JSON Shape:
```json
{
  "rainfall": 48.0,
  "inflow": 610.0,
  "outflow": 380.0,
  "current_level": 83.8,
  "model": "lstm"
}
```

#### Expected Response JSON Shape:
```json
{
  "predictions": [
    { "date": "2026-10-06", "level": 84.4 },
    { "date": "2026-10-07", "level": 84.9 },
    { "date": "2026-10-08", "level": 85.6 },
    { "date": "2026-10-09", "level": 86.4 },
    { "date": "2026-10-10", "level": 87.1 },
    { "date": "2026-10-11", "level": 87.7 },
    { "date": "2026-10-12", "level": 88.2 }
  ],
  "model": "lstm",
  "generated_at": "2026-10-05T12:00:00.000Z"
}
```

If the API call fails or the server is offline, the service automatically logs a warning and falls back gracefully to the deterministic mock engine.

---

## 🗺️ Planned Future Work Roadmap

- [ ] **Phase 1: Model Training & Catchment Calibration** — Train PyTorch LSTM, Scikit-Learn Random Forest, and Ridge Regression models on 15 years of daily meteorological and river basin telemetry.
- [ ] **Phase 2: Statistical Evaluation** — Benchmark models across seasonal monsoon surges using RMSE, MAE, and R² metrics, incorporating uncertainty intervals.
- [ ] **Phase 3: FastAPI Production Microservice** — Build and deploy an asynchronous FastAPI server (`POST /predict`) with Pydantic schema validation and containerized deployment.
- [ ] **Phase 4: SCADA & Inundation Warning Integration** — Connect `services/riskEngine.ts` output to dam supervisory SCADA radial gate control hooks and emergency SMS/alert broadcasts for downstream civil authorities.

---

## 📄 License
MIT License. Built for hydrological safety and water resources intelligence.
