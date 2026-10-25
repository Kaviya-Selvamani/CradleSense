// =============================================================
// AppContext — CradleSense Global State
// Provides: 6-bed telemetry, alert lifecycle, data source mode,
// thresholds, connection status, and selectedBed routing.
// =============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { BED_CONFIGS } from "../data/bedConfig";
import { ALERT_THRESHOLDS } from "../data/demoData";
import { generateSimReading } from "../data/simulationEngine";
import { DATA_SOURCE, CONNECTION_STATE } from "../data/constants";

export { DATA_SOURCE, CONNECTION_STATE };

const STALE_TIMEOUT_MS = 8000; // mark stale after 8 s without a reading

function buildInitBedState(bedId) {
  return {
    bedId,
    deviceId:    BED_CONFIGS[bedId].deviceId,
    hr:          null,
    spo2:        null,
    surfaceTemp: null,
    lastUpdate:  null,
    connection:  CONNECTION_STATE.UNKNOWN,
    quality: {
      heartRateValid:    false,
      spo2Valid:         false,
      temperatureValid:  false,
    },
    source: DATA_SOURCE.SIMULATION,
    chartHr:    [],
    chartSpo2:  [],
    chartTemp:  [],
    alerts:     [],   // active alerts [{id,param,value,time,status,bedId}]
    alertHistory: [], // all events [{id,param,value,time,status,lifecycle,bedId}]
  };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dataSource,  setDataSource]  = useState(DATA_SOURCE.SIMULATION);
  const [thresholds,  setThresholds]  = useState({ ...ALERT_THRESHOLDS });
  const [selectedBed, setSelectedBed] = useState("BED-01");

  // Per-bed state map
  const [beds, setBeds] = useState(() => {
    const init = {};
    Object.keys(BED_CONFIGS).forEach((id) => {
      init[id] = buildInitBedState(id);
    });
    return init;
  });

  // Track which alert params are currently active per bed
  const alertedRef = useRef({});

  // Stale detection: track last reading timestamps
  const lastReadingTime = useRef({});

  // ─── Ingest a reading for one bed ─────────────────────────
  const ingestReading = useCallback(
    (bedId, reading, source) => {
      const now = Date.now();
      lastReadingTime.current[bedId] = now;

      const { heartRate, spo2, surfaceTemperature, quality, timestamp } = reading;
      const time = timestamp
        ? new Date(timestamp).toLocaleTimeString("en-IN", { hour12: false })
        : new Date().toLocaleTimeString("en-IN", { hour12: false });

      // ─ Evaluate alerts ─
      const fired = [];
      if (quality.heartRateValid && heartRate !== null) {
        if (heartRate < thresholds.hrLow || heartRate > thresholds.hrHigh) {
          fired.push({
            param: "HR",
            value: `${heartRate} BPM`,
            direction: heartRate < thresholds.hrLow ? "low" : "high",
            description: heartRate < thresholds.hrLow
              ? "Below demonstration threshold"
              : "Above demonstration threshold",
          });
        }
      }
      if (quality.spo2Valid && spo2 !== null) {
        if (spo2 < thresholds.spo2Low) {
          fired.push({
            param: "SpO₂",
            value: `${spo2}%`,
            direction: "low",
            description: "Below demonstration threshold",
          });
        }
      }
      if (quality.temperatureValid && surfaceTemperature !== null) {
        if (surfaceTemperature < thresholds.tempLow || surfaceTemperature > thresholds.tempHigh) {
          fired.push({
            param: "SurfTemp",
            value: `${Number(surfaceTemperature).toFixed(1)}°C`,
            direction: surfaceTemperature < thresholds.tempLow ? "low" : "high",
            description: surfaceTemperature < thresholds.tempLow
              ? "Below demonstration threshold"
              : "Above demonstration threshold",
          });
        }
      }

      const prevAlertsSet = alertedRef.current[bedId] || new Set();
      const newAlertsSet  = new Set(fired.map((a) => a.param));

      // Build new active alerts list
      const newAlerts = fired.map((a) => ({
        id: `${bedId}-${a.param}-${time}`,
        bedId,
        param: a.param,
        value: a.value,
        time,
        description: a.description,
        direction: a.direction,
        lifecycle: "ACTIVE",
        source,
      }));

      // Build history events
      const newHistoryEvents = [];
      // New firings
      fired.forEach((a) => {
        if (!prevAlertsSet.has(a.param)) {
          newHistoryEvents.push({
            id: `${bedId}-${a.param}-${time}-FIRED`,
            bedId,
            param: a.param,
            value: a.value,
            time,
            type: "ALERT",
            description: a.description,
            lifecycle: "ACTIVE",
          });
        }
      });
      // Recoveries
      prevAlertsSet.forEach((param) => {
        if (!newAlertsSet.has(param)) {
          const recovered = (() => {
            if (param === "HR")       return `${heartRate} BPM`;
            if (param === "SpO₂")     return `${spo2}%`;
            if (param === "SurfTemp") return `${Number(surfaceTemperature).toFixed(1)}°C`;
            return "—";
          })();
          newHistoryEvents.push({
            id: `${bedId}-${param}-${time}-RECOVERED`,
            bedId,
            param,
            value: recovered,
            time,
            type: "RECOVERED",
            description: `${param} returned to within demonstration threshold`,
            lifecycle: "RESOLVED",
          });
        }
      });

      alertedRef.current[bedId] = newAlertsSet;

      setBeds((prev) => {
        const bed = prev[bedId];
        const updatedChartHr   = [...(bed.chartHr   || []).slice(-59), { time, hr:   heartRate ?? null }];
        const updatedChartSpo2 = [...(bed.chartSpo2 || []).slice(-59), { time, spo2: spo2 ?? null }];
        const updatedChartTemp = [...(bed.chartTemp  || []).slice(-59), { time, temp: surfaceTemperature ?? null }];

        return {
          ...prev,
          [bedId]: {
            ...bed,
            hr:          heartRate ?? null,
            spo2:        spo2 ?? null,
            surfaceTemp: surfaceTemperature ?? null,
            lastUpdate:  time,
            connection:  CONNECTION_STATE.CONNECTED,
            quality,
            source,
            chartHr:   updatedChartHr,
            chartSpo2: updatedChartSpo2,
            chartTemp: updatedChartTemp,
            alerts: newAlerts,
            alertHistory: [
              ...newHistoryEvents,
              ...bed.alertHistory,
            ].slice(0, 100),
          },
        };
      });
    },
    [thresholds]
  );

  // ─── Acknowledge an alert ──────────────────────────────────
  const acknowledgeAlert = useCallback((bedId, alertId) => {
    setBeds((prev) => {
      const bed = prev[bedId];
      return {
        ...prev,
        [bedId]: {
          ...bed,
          alerts: bed.alerts.map((a) =>
            a.id === alertId ? { ...a, lifecycle: "ACKNOWLEDGED" } : a
          ),
          alertHistory: bed.alertHistory.map((e) =>
            e.id === alertId ? { ...e, lifecycle: "ACKNOWLEDGED" } : e
          ),
        },
      };
    });
  }, []);

  // ─── Simulation loop ───────────────────────────────────────
  const simRef = useRef(null);

  useEffect(() => {
    if (dataSource !== DATA_SOURCE.SIMULATION) {
      if (simRef.current) clearInterval(simRef.current);
      return;
    }

    simRef.current = setInterval(() => {
      Object.keys(BED_CONFIGS).forEach((bedId, idx) => {
        // Stagger beds by 200 ms offset by using a timeout
        setTimeout(() => {
          const reading = generateSimReading(bedId, idx);
          ingestReading(bedId, reading, DATA_SOURCE.SIMULATION);
        }, idx * 120);
      });
    }, 2000);

    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [dataSource, ingestReading]);

  // ─── Stale detection loop ──────────────────────────────────
  useEffect(() => {
    const staleCheck = setInterval(() => {
      const now = Date.now();
      setBeds((prev) => {
        const updated = { ...prev };
        Object.keys(BED_CONFIGS).forEach((bedId) => {
          const lastTime = lastReadingTime.current[bedId];
          if (lastTime && now - lastTime > STALE_TIMEOUT_MS) {
            updated[bedId] = {
              ...updated[bedId],
              connection: CONNECTION_STATE.STALE,
            };
          }
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(staleCheck);
  }, []);

  // ─── Active alert count ────────────────────────────────────
  const totalActiveAlerts = Object.values(beds).reduce(
    (sum, bed) => sum + bed.alerts.filter((a) => a.lifecycle !== "RESOLVED").length,
    0
  );

  return (
    <AppContext.Provider
      value={{
        beds,
        selectedBed,
        setSelectedBed,
        dataSource,
        setDataSource,
        thresholds,
        setThresholds,
        ingestReading,
        acknowledgeAlert,
        totalActiveAlerts,
        DATA_SOURCE,
        CONNECTION_STATE,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
