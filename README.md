# CradleSense — Neonatal ICU Continuous Monitoring System (NCMS)

**CradleSense** is a centralized neonatal monitoring dashboard designed for Neonatal Intensive Care Units (NICU), built for the final-year engineering project:

> **Neonatal ICU Continuous Monitoring System Using Wearable IoT (NCMS)**  
> Developed by **Kaviya Selvamani**

---

## 🏥 Overview

In high-acuity Neonatal Intensive Care Units, continuous, non-invasive vital sign monitoring is critical for the early identification of hypoxemia, bradycardia/tachycardia, hypothermia, and neonatal distress. 

**CradleSense** provides clinical teams with a modern central workstation interface that tracks multiple neonatal beds concurrently, providing real-time vital metrics, dynamic trend visualizations, audible and visual clinical alert workflows, and data audit trails.

---

## ⚡ Key Features

- **Multi-Bed Central Station**: 6 distinct neonatal beds (Incubators, Radiant Warmers, Step-Down Cots, Phototherapy Unit) monitored concurrently.
- **Continuous Vital Tracking**:
  - **Heart Rate (HR)**: Measured in Beats Per Minute (BPM) with pediatric threshold limits (100–180 BPM).
  - **Pulse Oximetry (SpO₂)**: Continuous arterial oxygen saturation percentage with threshold alarming (< 90%).
  - **Surface Temperature**: Non-contact infrared temperature monitoring (36.0°C – 37.5°C).
- **Clinical Alert Lifecycle**: Alerts adhere to clinical alert workflows (**ACTIVE** ➜ **ACKNOWLEDGED** ➜ **RESOLVED**) with acoustic cue controls and stable alert identifiers.
- **Waveform & Trend Analytics**: Synchronized charts powered by Recharts with SVG gradient isolation and dynamic physiological reference boundaries.
- **Historical Data Logging**: Tabular data log with pagination, status filtering, and CSV export for clinical auditing.
- **3-Tier Data Pipeline**:
  - **Simulation Mode**: Real-time physiological engine modeling stochastic baseline variation and acute distress episodes.
  - **Dataset Replay**: Historical dataset playback for test and verification.
  - **Live Hardware Ingestion**: Seamless ingestion endpoint for microcontrollers via HTTP/SSE.
- **Dark & Light Medical Workstation Themes**: High-contrast, fatigue-reducing dark interface designed for low-light NICU environments, switchable to high-clarity daylight theme.

---

## 🔌 Hardware Architecture & Sensor Stack

| Component | Function | Interface | Description |
|:---|:---|:---|:---|
| **ESP32-S3** | Primary Edge IoT Microcontroller | Dual-core Xtensa LX7, 240 MHz | Samples sensor buses, performs initial signal filtering, and transmits telemetry via 2.4 GHz Wi-Fi. |
| **MAX30102** | Photoplethysmography (PPG) | I²C (Address `0x57`) | Optical sensor measuring pulse rate and peripheral oxygen saturation (SpO₂). |
| **MLX90614** | Infrared Thermometry | I²C (Address `0x5A`) | Non-contact medical-grade thermopile sensor measuring skin surface temperature without epidermal trauma. |
| **Sound / Microphone Module** | Acoustic Distress Detection | Analog / Digital Comparator | High-sensitivity sensor for neonate cry detection and distress classification. |
| **MPU-6050** | 6-Axis Motion / IMU | I²C (Address `0x68`) | Accelerometer and gyroscope tracking neonate activity, convulsion patterns, and sleeping posture. |

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/) & [Oxlint](https://oxc.rs/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Custom Properties for theme tokens
- **Charting**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kaviya-Selvamani/CradleSense.git
   cd CradleSense
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
Neonatal Monitoring/
├── public/                 # Static assets & favicon
├── src/
│   ├── components/         # Reusable UI & clinical components
│   │   ├── AlertHistory.jsx
│   │   ├── AlertPanel.jsx
│   │   ├── BedPanel.jsx
│   │   ├── DataSourceBadge.jsx
│   │   ├── Header.jsx
│   │   ├── RecentData.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SystemStatus.jsx
│   │   ├── VitalCard.jsx
│   │   └── VitalChart.jsx
│   ├── context/            # Central application state & live data ingestion
│   │   └── AppContext.jsx
│   ├── data/               # Configuration, mock records & simulation engine
│   │   ├── bedConfig.js
│   │   ├── constants.js
│   │   ├── demoData.js
│   │   └── simulationEngine.js
│   ├── pages/              # Main application views
│   │   ├── AlertsPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── GraphsPage.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── LiveMonitoring.jsx
│   │   └── SettingsPage.jsx
│   ├── App.jsx             # Top-level routing & layout wrapper
│   ├── index.css           # Design tokens, medical palette & utilities
│   └── main.jsx            # Application entrypoint
├── package.json
└── vite.config.js
```

---

## 🛡️ Clinical Disclaimer

This software and hardware specification is developed exclusively as an **Academic Engineering Research Prototype** for demonstration and educational purposes. It has not been approved by regulatory bodies (e.g., FDA, CE-MDR, CDSCO) and is **not certified for diagnostic, therapeutic, or clinical patient monitoring in real-world healthcare settings**.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
