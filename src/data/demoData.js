// =============================================================
// NEOVAULT REPLAY — Recorded Dataset
// Simulated neonatal physiological data for academic demonstration.
// NOT live patient data. NOT clinically validated.
// Dataset: Neonate 10 · 120 records
// =============================================================

export const DEMO_DATASET = [
  { time: "10:00:01", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:00:02", hr: 142, spo2: 97, temp: 36.7 },
  { time: "10:00:03", hr: 141, spo2: 98, temp: 36.8 },
  { time: "10:00:04", hr: 139, spo2: 97, temp: 36.8 },
  { time: "10:00:05", hr: 143, spo2: 96, temp: 36.7 },
  { time: "10:00:06", hr: 145, spo2: 96, temp: 36.9 },
  { time: "10:00:07", hr: 144, spo2: 97, temp: 36.9 },
  { time: "10:00:08", hr: 138, spo2: 98, temp: 36.8 },
  { time: "10:00:09", hr: 137, spo2: 98, temp: 36.7 },
  { time: "10:00:10", hr: 142, spo2: 97, temp: 36.8 },
  { time: "10:00:11", hr: 146, spo2: 96, temp: 36.9 },
  { time: "10:00:12", hr: 148, spo2: 95, temp: 37.0 },
  { time: "10:00:13", hr: 150, spo2: 95, temp: 37.1 },
  { time: "10:00:14", hr: 152, spo2: 94, temp: 37.1 },
  { time: "10:00:15", hr: 149, spo2: 95, temp: 37.0 },
  { time: "10:00:16", hr: 147, spo2: 96, temp: 36.9 },
  { time: "10:00:17", hr: 144, spo2: 97, temp: 36.8 },
  { time: "10:00:18", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:00:19", hr: 140, spo2: 98, temp: 36.7 },
  { time: "10:00:20", hr: 138, spo2: 98, temp: 36.7 },
  // Bradycardia + hypothermia event starts
  { time: "10:00:21", hr: 136, spo2: 97, temp: 36.6 },
  { time: "10:00:22", hr: 135, spo2: 97, temp: 36.6 },
  { time: "10:00:23", hr: 133, spo2: 96, temp: 36.5 },
  { time: "10:00:24", hr: 132, spo2: 96, temp: 36.5 },
  { time: "10:00:25", hr: 130, spo2: 95, temp: 36.4 },
  { time: "10:00:26", hr: 128, spo2: 94, temp: 36.3 },
  { time: "10:00:27", hr: 126, spo2: 93, temp: 36.2 },
  { time: "10:00:28", hr: 124, spo2: 92, temp: 36.2 },
  { time: "10:00:29", hr: 122, spo2: 91, temp: 36.1 },
  { time: "10:00:30", hr: 119, spo2: 90, temp: 36.0 },  // HR below threshold
  { time: "10:00:31", hr: 118, spo2: 90, temp: 35.9 },  // Temp below threshold
  { time: "10:00:32", hr: 117, spo2: 89, temp: 35.9 },
  { time: "10:00:33", hr: 116, spo2: 88, temp: 35.8 },  // SpO2 below threshold
  { time: "10:00:34", hr: 117, spo2: 89, temp: 35.9 },
  // Recovery begins
  { time: "10:00:35", hr: 120, spo2: 90, temp: 36.0 },
  { time: "10:00:36", hr: 123, spo2: 92, temp: 36.1 },
  { time: "10:00:37", hr: 126, spo2: 93, temp: 36.2 },
  { time: "10:00:38", hr: 129, spo2: 95, temp: 36.3 },
  { time: "10:00:39", hr: 132, spo2: 96, temp: 36.5 },
  { time: "10:00:40", hr: 136, spo2: 97, temp: 36.6 },
  { time: "10:00:41", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:00:42", hr: 143, spo2: 98, temp: 36.8 },
  { time: "10:00:43", hr: 145, spo2: 98, temp: 36.8 },
  { time: "10:00:44", hr: 148, spo2: 97, temp: 36.9 },
  // Tachycardia + hyperthermia event
  { time: "10:00:45", hr: 152, spo2: 96, temp: 37.0 },
  { time: "10:00:46", hr: 156, spo2: 96, temp: 37.1 },
  { time: "10:00:47", hr: 160, spo2: 95, temp: 37.2 },
  { time: "10:00:48", hr: 165, spo2: 95, temp: 37.3 },
  { time: "10:00:49", hr: 170, spo2: 94, temp: 37.4 },
  { time: "10:00:50", hr: 176, spo2: 94, temp: 37.5 },
  { time: "10:00:51", hr: 182, spo2: 93, temp: 37.6 },  // HR above threshold, Temp above threshold
  { time: "10:00:52", hr: 188, spo2: 93, temp: 37.7 },
  { time: "10:00:53", hr: 185, spo2: 94, temp: 37.6 },
  { time: "10:00:54", hr: 180, spo2: 95, temp: 37.5 },
  // Recovery from tachycardia
  { time: "10:00:55", hr: 174, spo2: 96, temp: 37.3 },
  { time: "10:00:56", hr: 168, spo2: 97, temp: 37.1 },
  { time: "10:00:57", hr: 161, spo2: 97, temp: 37.0 },
  { time: "10:00:58", hr: 155, spo2: 98, temp: 36.9 },
  { time: "10:00:59", hr: 149, spo2: 98, temp: 36.8 },
  { time: "10:01:00", hr: 144, spo2: 97, temp: 36.8 },
  { time: "10:01:01", hr: 141, spo2: 97, temp: 36.7 },
  { time: "10:01:02", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:01:03", hr: 139, spo2: 98, temp: 36.7 },
  { time: "10:01:04", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:05", hr: 143, spo2: 97, temp: 36.8 },
  { time: "10:01:06", hr: 142, spo2: 96, temp: 36.9 },
  { time: "10:01:07", hr: 140, spo2: 97, temp: 36.8 },
  { time: "10:01:08", hr: 138, spo2: 98, temp: 36.7 },
  { time: "10:01:09", hr: 137, spo2: 98, temp: 36.7 },
  { time: "10:01:10", hr: 139, spo2: 97, temp: 36.8 },
  { time: "10:01:11", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:12", hr: 143, spo2: 96, temp: 36.9 },
  { time: "10:01:13", hr: 145, spo2: 95, temp: 37.0 },
  { time: "10:01:14", hr: 147, spo2: 95, temp: 37.1 },
  { time: "10:01:15", hr: 149, spo2: 94, temp: 37.2 },
  { time: "10:01:16", hr: 147, spo2: 95, temp: 37.1 },
  { time: "10:01:17", hr: 144, spo2: 96, temp: 36.9 },
  { time: "10:01:18", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:19", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:01:20", hr: 139, spo2: 98, temp: 36.7 },
  // Second bradycardia episode
  { time: "10:01:21", hr: 137, spo2: 97, temp: 36.6 },
  { time: "10:01:22", hr: 134, spo2: 96, temp: 36.5 },
  { time: "10:01:23", hr: 131, spo2: 95, temp: 36.4 },
  { time: "10:01:24", hr: 127, spo2: 94, temp: 36.3 },
  { time: "10:01:25", hr: 123, spo2: 93, temp: 36.2 },
  { time: "10:01:26", hr: 119, spo2: 92, temp: 36.1 },
  { time: "10:01:27", hr: 116, spo2: 91, temp: 36.0 },
  { time: "10:01:28", hr: 114, spo2: 90, temp: 35.9 },
  { time: "10:01:29", hr: 116, spo2: 91, temp: 36.0 },
  { time: "10:01:30", hr: 119, spo2: 92, temp: 36.1 },
  { time: "10:01:31", hr: 123, spo2: 93, temp: 36.2 },
  { time: "10:01:32", hr: 128, spo2: 95, temp: 36.4 },
  { time: "10:01:33", hr: 133, spo2: 96, temp: 36.5 },
  { time: "10:01:34", hr: 138, spo2: 97, temp: 36.7 },
  { time: "10:01:35", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:36", hr: 143, spo2: 98, temp: 36.8 },
  { time: "10:01:37", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:38", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:01:39", hr: 139, spo2: 98, temp: 36.7 },
  { time: "10:01:40", hr: 141, spo2: 97, temp: 36.8 },
  // Stable normal zone
  { time: "10:01:41", hr: 142, spo2: 97, temp: 36.8 },
  { time: "10:01:42", hr: 143, spo2: 97, temp: 36.8 },
  { time: "10:01:43", hr: 142, spo2: 98, temp: 36.8 },
  { time: "10:01:44", hr: 141, spo2: 98, temp: 36.7 },
  { time: "10:01:45", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:01:46", hr: 140, spo2: 97, temp: 36.8 },
  { time: "10:01:47", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:48", hr: 143, spo2: 96, temp: 36.9 },
  { time: "10:01:49", hr: 145, spo2: 96, temp: 37.0 },
  { time: "10:01:50", hr: 144, spo2: 97, temp: 36.9 },
  { time: "10:01:51", hr: 142, spo2: 97, temp: 36.8 },
  { time: "10:01:52", hr: 140, spo2: 98, temp: 36.7 },
  { time: "10:01:53", hr: 139, spo2: 98, temp: 36.7 },
  { time: "10:01:54", hr: 141, spo2: 97, temp: 36.8 },
  { time: "10:01:55", hr: 143, spo2: 97, temp: 36.8 },
  { time: "10:01:56", hr: 142, spo2: 96, temp: 36.8 },
  { time: "10:01:57", hr: 140, spo2: 97, temp: 36.7 },
  { time: "10:01:58", hr: 138, spo2: 98, temp: 36.7 },
  { time: "10:01:59", hr: 137, spo2: 98, temp: 36.6 },
  { time: "10:02:00", hr: 139, spo2: 97, temp: 36.7 },
];

// =============================================================
// DEMONSTRATION ALERT THRESHOLDS
// Configurable thresholds for the academic prototype.
// NOT clinically validated neonatal reference ranges.
// =============================================================
export const ALERT_THRESHOLDS = {
  hrLow:   120,
  hrHigh:  180,
  spo2Low:  92,
  tempLow:  36.0,
  tempHigh: 37.5,
};

// Parameter display configuration
export const PARAM_CONFIG = {
  hr: {
    label: "Heart Rate",
    unit: "BPM",
    color: "#ef4444",
    gradientFrom: "#ef444430",
    gradientTo: "#ef444405",
  },
  spo2: {
    label: "SpO₂",
    unit: "%",
    color: "#06b6d4",
    gradientFrom: "#06b6d430",
    gradientTo: "#06b6d405",
  },
  temp: {
    label: "Temperature",
    unit: "°C",
    color: "#f59e0b",
    gradientFrom: "#f59e0b30",
    gradientTo: "#f59e0b05",
  },
};
