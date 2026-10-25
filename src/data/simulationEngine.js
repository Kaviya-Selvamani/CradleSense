// =============================================================
// Simulation Engine — CradleSense
// Generates clearly labelled SIMULATED physiological readings
// for UI testing and academic demonstration.
// IMPORTANT: These values are NOT real patient measurements.
//
// Each bed has a different baseline and scenario variation so
// all six panels show independent, distinct readings.
// =============================================================

// Per-bed baselines (demonstration values, not neonatal references)
const BED_BASELINES = {
  "BED-01": { hr: 142, spo2: 97, temp: 36.7 },
  "BED-02": { hr: 148, spo2: 96, temp: 36.5 },
  "BED-03": { hr: 138, spo2: 98, temp: 36.8 },
  "BED-04": { hr: 155, spo2: 95, temp: 37.0 },
  "BED-05": { hr: 135, spo2: 97, temp: 36.3 },
  "BED-06": { hr: 145, spo2: 96, temp: 36.6 },
};

// Per-bed scenario states for demonstration variety
const scenarioState = {};

Object.keys(BED_BASELINES).forEach((bedId) => {
  scenarioState[bedId] = {
    tick: 0,
    phase: "stable",
    phaseTimer: 0,
  };
});

function jitter(base, range) {
  return +(base + (Math.random() - 0.5) * 2 * range).toFixed(1);
}

function nextPhase(state, bedIdx) {
  // Each bed cycles through phases independently using its index as seed
  const phases = ["stable", "stable", "stable", "bradycardia", "stable", "tachycardia"];
  const phaseIdx = Math.floor(state.tick / 15) % phases.length;
  // Offset by bedIdx so not all beds do the same thing simultaneously
  const offsetPhaseIdx = (phaseIdx + bedIdx) % phases.length;
  return phases[offsetPhaseIdx];
}

/**
 * Generate one simulated reading for the given bed.
 * Returns an object shaped like the actual ESP32-S3 payload.
 *
 * @param {string} bedId
 * @param {number} bedIdx - used to offset demonstration phases
 * @returns {object}
 */
export function generateSimReading(bedId, bedIdx = 0) {
  const base  = BED_BASELINES[bedId];
  const state = scenarioState[bedId];

  state.tick += 1;
  const phase = nextPhase(state, bedIdx);

  let hr, spo2, temp, hrValid = true, spo2Valid = true, tempValid = true;

  switch (phase) {
    case "bradycardia":
      hr   = jitter(base.hr - 22, 2);
      spo2 = jitter(base.spo2 - 4, 1);
      temp = jitter(base.temp - 0.3, 0.1);
      break;
    case "tachycardia":
      hr   = jitter(base.hr + 38, 2);
      spo2 = jitter(base.spo2 - 2, 1);
      temp = jitter(base.temp + 0.4, 0.1);
      break;
    default: // stable
      hr   = jitter(base.hr, 3);
      spo2 = jitter(base.spo2, 1);
      temp = jitter(base.temp, 0.1);
  }

  // Clamp to plausible physiological ranges for demonstration
  hr   = Math.max(60, Math.min(220, Math.round(hr)));
  spo2 = Math.max(70, Math.min(100, Math.round(spo2)));
  temp = Math.max(32.0, Math.min(41.0, +temp.toFixed(1)));

  return {
    deviceId:           `NCMS-00${bedIdx + 1}`,
    timestamp:          new Date().toISOString(),
    heartRate:          hr,
    spo2:               spo2,
    surfaceTemperature: temp,
    quality: {
      heartRateValid:   hrValid,
      spo2Valid:        spo2Valid,
      temperatureValid: tempValid,
    },
    _simulated: true,  // internal flag — never shown as live
  };
}
