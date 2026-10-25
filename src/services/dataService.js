// =============================================================
// Data Service — Abstraction Layer
// Currently uses NEOVAULT REPLAY demo data.
// Replace getLatestReading / getHistoricalReadings / getAlerts
// with REST / WebSocket / MQTT calls when real backend is ready.
// =============================================================

import { DEMO_DATASET, ALERT_THRESHOLDS } from "../data/demoData";

let currentIndex = 0;

/**
 * Advance the internal cursor and return the next recorded reading.
 * Wraps around when the end of the dataset is reached.
 */
export function getLatestReading() {
  const reading = DEMO_DATASET[currentIndex % DEMO_DATASET.length];
  currentIndex++;
  return { ...reading };
}

/**
 * Return the first N readings from the dataset (historical seed).
 */
export function getHistoricalReadings(count = 20) {
  return DEMO_DATASET.slice(0, count).map((r) => ({ ...r }));
}

/**
 * Evaluate a reading against thresholds and return alert objects.
 * @param {object} reading - { hr, spo2, temp, time }
 * @returns {Array} array of alert objects (may be empty)
 */
export function evaluateAlerts(reading, thresholds = ALERT_THRESHOLDS) {
  const alerts = [];
  const { hr, spo2, temp, time } = reading;

  if (hr < thresholds.hrLow) {
    alerts.push({
      param: "HR",
      value: `${hr} BPM`,
      rawValue: hr,
      time,
      type: "ALERT",
      description: "Below demonstration threshold",
      direction: "low",
    });
  } else if (hr > thresholds.hrHigh) {
    alerts.push({
      param: "HR",
      value: `${hr} BPM`,
      rawValue: hr,
      time,
      type: "ALERT",
      description: "Above demonstration threshold",
      direction: "high",
    });
  }

  if (spo2 < thresholds.spo2Low) {
    alerts.push({
      param: "SpO₂",
      value: `${spo2} %`,
      rawValue: spo2,
      time,
      type: "ALERT",
      description: "Below demonstration threshold",
      direction: "low",
    });
  }

  if (temp < thresholds.tempLow) {
    alerts.push({
      param: "Temp",
      value: `${temp.toFixed(1)} °C`,
      rawValue: temp,
      time,
      type: "ALERT",
      description: "Below demonstration threshold",
      direction: "low",
    });
  } else if (temp > thresholds.tempHigh) {
    alerts.push({
      param: "Temp",
      value: `${temp.toFixed(1)} °C`,
      rawValue: temp,
      time,
      type: "ALERT",
      description: "Above demonstration threshold",
      direction: "high",
    });
  }

  return alerts;
}

/**
 * Reset the replay cursor to the beginning.
 * Useful when hot-reloading or restarting the simulation.
 */
export function resetDataStream() {
  currentIndex = 0;
}
