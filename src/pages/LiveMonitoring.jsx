// =============================================================
// LiveMonitoring.jsx — CradleSense
// Detailed monitoring view for the selected bed.
//
// CORRECTIONS FROM ORIGINAL:
// - Reads selectedBed from AppContext (no longer hardcoded NEO-001)
// - Shows per-bed readings, not a shared simulation
// - Removed false WebSocket/MQTT/REST claims
// - systemStatus no longer hardcoded true
// - Correct hardware info: ESP32-S3 + MAX30102 + MLX90614
// =============================================================

import { useState } from "react";
import { Activity, ChevronDown } from "lucide-react";

import VitalCard   from "../components/VitalCard";
import VitalChart  from "../components/VitalChart";
import SystemStatus from "../components/SystemStatus";
import AlertPanel  from "../components/AlertPanel";
import RecentData  from "../components/RecentData";
import { useApp, CONNECTION_STATE } from "../context/AppContext";
import { BED_CONFIGS, BED_IDS } from "../data/bedConfig";

function getParamStatus(param, value, thresholds, valid) {
  if (!valid || value === null || value === undefined) return "UNAVAILABLE";
  if (param === "hr") return (value < thresholds.hrLow || value > thresholds.hrHigh) ? "ALERT" : "NORMAL";
  if (param === "spo2") return value < thresholds.spo2Low ? "ALERT" : "NORMAL";
  if (param === "temp") return (value < thresholds.tempLow || value > thresholds.tempHigh) ? "ALERT" : "NORMAL";
  return "NORMAL";
}

function getTrend(current, previous) {
  if (previous == null || current == null) return "flat";
  return current > previous ? "up" : current < previous ? "down" : "flat";
}

function LiveMonitoring() {
  const { beds, selectedBed, setSelectedBed, acknowledgeAlert, thresholds, dataSource } = useApp();
  const [showBedPicker, setShowBedPicker] = useState(false);

  const bed = beds[selectedBed];
  const cfg = BED_CONFIGS[selectedBed];

  const prevHr = bed?.chartHr && bed.chartHr.length > 1 ? bed.chartHr[bed.chartHr.length - 2]?.value : null;
  const prevSpo2 = bed?.chartSpo2 && bed.chartSpo2.length > 1 ? bed.chartSpo2[bed.chartSpo2.length - 2]?.value : null;
  const prevTemp = bed?.chartTemp && bed.chartTemp.length > 1 ? bed.chartTemp[bed.chartTemp.length - 2]?.value : null;

  if (!bed || !cfg) {
    return (
      <div className="flex items-center justify-center h-64 mono" style={{ color: "var(--text-muted)", fontSize: 13 }}>
        Selected bed not found. Please choose a bed from the dashboard.
      </div>
    );
  }

  // Build recent readings for the table (from chart data)
  const recentReadings = [...(bed.chartHr || [])].reverse().slice(0, 10).map((pt, i) => ({
    time:   pt.time,
    hr:     pt.hr,
    spo2:   (bed.chartSpo2[bed.chartSpo2.length - 1 - i])?.spo2 ?? null,
    temp:   (bed.chartTemp[bed.chartTemp.length  - 1 - i])?.temp ?? null,
    status: "NOMINAL",
    source: dataSource,
  }));

  // Connection state → system status flags
  const isConnected = bed.connection === CONNECTION_STATE.CONNECTED;
  const systemStatus = {
    esp32:     isConnected,
    wifi:      isConnected,
    stream:    isConnected,
    dashboard: true,
  };

  const refLinesHr   = [
    { y: thresholds.hrHigh,  stroke: "#ef4444", dash: "4 3", label: `High ${thresholds.hrHigh}` },
    { y: thresholds.hrLow,   stroke: "#f59e0b", dash: "4 3", label: `Low ${thresholds.hrLow}`  },
  ];
  const refLinesSpo2 = [
    { y: thresholds.spo2Low, stroke: "#ef4444", dash: "4 3", label: `Low ${thresholds.spo2Low}%` },
  ];
  const refLinesTemp = [
    { y: thresholds.tempHigh,stroke: "#ef4444", dash: "4 3", label: `High ${thresholds.tempHigh}°C` },
    { y: thresholds.tempLow, stroke: "#f59e0b", dash: "4 3", label: `Low ${thresholds.tempLow}°C`  },
  ];

  const activeAlerts = bed.alerts.filter((a) => a.lifecycle !== "RESOLVED");

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* ── Page Header ── */}
      <div className="glass-panel px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 42, height: 42, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <Activity size={20} className="text-sky-500" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
              {cfg.label} — Detailed Monitoring
            </h2>
            <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              Device: {cfg.deviceId} · Last reading: {bed.lastUpdate || "awaiting…"}
            </p>
          </div>
        </div>

        {/* Bed picker */}
        <div className="relative">
          <button
            onClick={() => setShowBedPicker((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl mono font-bold cursor-pointer"
            style={{
              background:  "var(--chip-bg)",
              border:      "1px solid var(--chip-border)",
              color:       "var(--text-primary)",
              fontSize:    11,
              letterSpacing: "0.04em",
            }}
          >
            {cfg.label}
            <ChevronDown size={13} />
          </button>

          {showBedPicker && (
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
              style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 160 }}
            >
              {BED_IDS.map((bid) => {
                const bcfg = BED_CONFIGS[bid];
                const bbed = beds[bid];
                const hasAlerts = bbed?.alerts?.some((a) => a.lifecycle !== "RESOLVED");
                return (
                  <button
                    key={bid}
                    onClick={() => { setSelectedBed(bid); setShowBedPicker(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer"
                    style={{
                      background: bid === selectedBed ? "rgba(56,189,248,0.10)" : "transparent",
                      color:      bid === selectedBed ? "var(--blue-accent)" : "var(--text-secondary)",
                      fontSize:   12,
                      fontWeight: bid === selectedBed ? 600 : 400,
                      borderBottom: "1px solid var(--panel-border)",
                    }}
                  >
                    <span>{bcfg.label}</span>
                    {hasAlerts && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red-alert)", display: "inline-block" }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Vital Cards ── */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #38bdf8, #6366f1)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Current Measurements
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
          {dataSource === "SIMULATION" ? "⚠ SIMULATED DATA" : dataSource === "DATASET" ? "⚠ DATASET REPLAY" : "LIVE HARDWARE"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <VitalCard
          param="hr"
          value={bed.hr}
          status={getParamStatus("hr", bed.hr, thresholds, bed.quality.heartRateValid)}
          trend={getTrend(bed.hr, prevHr)}
          valid={bed.quality.heartRateValid}
        />
        <VitalCard
          param="spo2"
          value={bed.spo2}
          status={getParamStatus("spo2", bed.spo2, thresholds, bed.quality.spo2Valid)}
          trend={getTrend(bed.spo2, prevSpo2)}
          valid={bed.quality.spo2Valid}
        />
        <VitalCard
          param="temp"
          value={bed.surfaceTemp}
          status={getParamStatus("temp", bed.surfaceTemp, thresholds, bed.quality.temperatureValid)}
          trend={getTrend(bed.surfaceTemp, prevTemp)}
          valid={bed.quality.temperatureValid}
        />
      </div>

      {/* ── Charts ── */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #ef4444, #f59e0b)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Trend Charts — {cfg.label}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <VitalChart
        param="hr"
        data={bed.chartHr || []}
        chartId={`${selectedBed}-live-hr`}
        refLines={refLinesHr}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VitalChart
          param="spo2"
          data={bed.chartSpo2 || []}
          compact
          chartId={`${selectedBed}-live-spo2`}
          refLines={refLinesSpo2}
        />
        <VitalChart
          param="temp"
          data={bed.chartTemp || []}
          compact
          chartId={`${selectedBed}-live-temp`}
          refLines={refLinesTemp}
        />
      </div>

      {/* ── Alert Panel + System Status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <AlertPanel alerts={activeAlerts} onAcknowledge={acknowledgeAlert} />
        </div>
        <SystemStatus
          status={systemStatus}
          connectionState={bed.connection}
          lastUpdate={bed.lastUpdate}
        />
      </div>

      {/* ── Recent readings table ── */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #06b6d4, #38bdf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Recent Readings
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>
      <RecentData readings={recentReadings} />

      {/* ── Hardware notes (honest description) ── */}
      <div className="glass-panel p-5">
        <div className="font-bold uppercase tracking-widest mb-3" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Hardware Notes
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: "MAX30102 — Optical Sensor",
              desc: "Provides raw PPG (photoplethysmography) signals from which heart rate and estimated SpO₂ are derived by the firmware algorithm.",
              color: "#ef4444",
            },
            {
              title: "MLX90614 — IR Temperature",
              desc: "Non-contact infrared sensor measuring skin/surface temperature. Readings are surface temperature, not core body temperature.",
              color: "#f59e0b",
            },
            {
              title: "ESP32-S3 Mini — Communication",
              desc: "Collects sensor data and transmits via HTTP POST to the Node.js backend at configured intervals. No MQTT broker is used.",
              color: "#38bdf8",
            },
          ].map(({ title, desc, color }) => (
            <div key={title} className="rounded-xl p-4" style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}>
              <div className="font-bold mb-1.5" style={{ fontSize: 11.5, color }}>{title}</div>
              <div className="mono" style={{ fontSize: 9.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveMonitoring;
