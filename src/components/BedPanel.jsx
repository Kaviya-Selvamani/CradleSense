// =============================================================
// BedPanel.jsx — CradleSense
// Spacious, high-clarity NICU Bed Telemetry Station Card.
// Displays independent physiological readings, active status,
// real-time mini sparkline trend, and clinical alarm states.
// =============================================================

import { useNavigate } from "react-router-dom";
import {
  Bed, AlertTriangle, Clock, CheckCircle, Heart,
  Droplets, Thermometer, ChevronRight, Activity,
} from "lucide-react";
import { useApp, CONNECTION_STATE } from "../context/AppContext";
import { BED_CONFIGS } from "../data/bedConfig";

const CONN_STYLE = {
  [CONNECTION_STATE.CONNECTED]:    { color: "var(--green-ok)",      dot: "var(--green-ok)",    label: "LIVE TELEMETRY", pulse: true  },
  [CONNECTION_STATE.STALE]:        { color: "var(--amber-warn)",    dot: "var(--amber-warn)",  label: "STALE STREAM",   pulse: false },
  [CONNECTION_STATE.DISCONNECTED]: { color: "var(--red-alert)",     dot: "var(--red-alert)",   label: "OFFLINE",        pulse: false },
  [CONNECTION_STATE.SENSOR_ERROR]: { color: "var(--red-alert)",     dot: "var(--red-alert)",   label: "SENSOR FAULT",   pulse: false },
  [CONNECTION_STATE.CONNECTING]:   { color: "var(--amber-warn)",    dot: "var(--amber-warn)",  label: "CONNECTING…",    pulse: false },
  [CONNECTION_STATE.UNKNOWN]:      { color: "var(--text-muted)",    dot: "var(--text-faint)",  label: "STANDBY",        pulse: false },
};

const SOURCE_LABEL = {
  SIMULATION: { label: "SIMULATION", color: "var(--indigo-accent)", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.25)" },
  DATASET:    { label: "DATASET",    color: "var(--amber-warn)",    bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)"  },
  LIVE:       { label: "HARDWARE",   color: "var(--green-ok)",      bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.25)"   },
};

function MiniSparkline({ data, color, height = 34 }) {
  if (!data || data.length < 2) {
    return (
      <div className="w-full flex items-center justify-center mono" style={{ height, fontSize: 9.5, color: "var(--text-faint)" }}>
        Awaiting telemetry waveform…
      </div>
    );
  }

  const values = data.map((d) => (d.hr != null ? d.hr : null)).filter((v) => v != null);
  if (values.length < 2) return null;

  const min = Math.min(...values) - 6;
  const max = Math.max(...values) + 6;
  const range = max - min || 1;
  const width = 320;

  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-hidden rounded-lg" style={{ height }}>
      <defs>
        <linearGradient id={`grad-spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-spark-${color.replace('#','')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VitalTile({ icon: Icon, label, value, unit, color, isAlert, valid = true, normalRange }) {
  const isNull = value === null || value === undefined || !valid;

  return (
    <div
      className="flex flex-col justify-between p-3 rounded-xl transition-all"
      style={{
        background: isAlert ? "rgba(239,68,68,0.12)" : "rgba(15,23,42,0.45)",
        border:     isAlert ? "1px solid rgba(239,68,68,0.38)" : "1px solid var(--chip-border)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-1.5 mono font-bold" style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
          <Icon size={12} style={{ color: isAlert ? "var(--red-alert)" : color }} />
          {label}
        </span>
        <span className="mono font-semibold" style={{ fontSize: 9, color: "var(--text-faint)" }}>
          {unit}
        </span>
      </div>

      <div className="my-1">
        <span
          className="mono font-bold leading-none tracking-tight block"
          style={{
            fontSize: 25,
            color: isNull ? "var(--text-faint)" : isAlert ? "var(--red-alert)" : color,
            letterSpacing: "-0.02em",
          }}
        >
          {isNull ? "—" : (unit === "°C" ? Number(value).toFixed(1) : value)}
        </span>
      </div>

      <div className="flex items-center justify-between mono mt-1" style={{ fontSize: 8.5 }}>
        <span style={{ color: "var(--text-faint)" }}>
          {normalRange}
        </span>
        {isAlert && (
          <span className="font-bold uppercase tracking-wider" style={{ color: "var(--red-alert)", fontSize: 8 }}>
            LIMIT
          </span>
        )}
      </div>
    </div>
  );
}

function BedPanel({ bedId }) {
  const navigate = useNavigate();
  const { beds, setSelectedBed, thresholds } = useApp();
  const bed = beds[bedId];
  const cfg = BED_CONFIGS[bedId];

  if (!bed) return null;

  const connStyle   = CONN_STYLE[bed.connection] || CONN_STYLE[CONNECTION_STATE.UNKNOWN];
  const activeAlerts = bed.alerts.filter((a) => a.lifecycle !== "RESOLVED");
  const hasAlerts    = activeAlerts.length > 0;
  const srcLabel     = SOURCE_LABEL[bed.source] || SOURCE_LABEL.SIMULATION;

  const isHrAlert   = bed.quality.heartRateValid && bed.hr !== null && (bed.hr < thresholds.hrLow || bed.hr > thresholds.hrHigh);
  const isSpo2Alert = bed.quality.spo2Valid && bed.spo2 !== null && bed.spo2 < thresholds.spo2Low;
  const isTempAlert = bed.quality.temperatureValid && bed.surfaceTemp !== null && (bed.surfaceTemp < thresholds.tempLow || bed.surfaceTemp > thresholds.tempHigh);

  const handleClick = () => {
    setSelectedBed(bedId);
    navigate("/live");
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex flex-col justify-between cursor-pointer group transition-all duration-200 ${
        hasAlerts ? "alert-card-pulse" : ""
      }`}
      style={{
        background:   "var(--card-bg)",
        border:       hasAlerts
          ? "1.5px solid rgba(239,68,68,0.55)"
          : "1px solid var(--panel-border)",
        boxShadow:    hasAlerts
          ? "0 4px 24px rgba(239,68,68,0.12)"
          : "var(--card-box-shadow)",
        padding:      "18px 20px 14px 20px",
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open telemetry view for ${cfg.label}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height:     3.5,
          background: hasAlerts
            ? "linear-gradient(90deg, transparent, #ef4444 40%, transparent)"
            : "linear-gradient(90deg, transparent, var(--blue-accent) 40%, transparent)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* ── Header Row ── */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform group-hover:scale-105"
            style={{
              width: 40,
              height: 40,
              background: hasAlerts ? "rgba(239,68,68,0.12)" : "rgba(56,189,248,0.12)",
              border:     hasAlerts ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(56,189,248,0.25)",
            }}
          >
            <Bed size={18} className={hasAlerts ? "text-red-500" : "text-sky-400"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white" style={{ fontSize: 14.5 }}>
                {cfg.label}
              </span>
              <span
                className="mono font-semibold px-2 py-0.5 rounded-full"
                style={{ fontSize: 9.5, background: "rgba(56,189,248,0.10)", color: "var(--blue-accent)", border: "1px solid rgba(56,189,248,0.2)" }}
              >
                {cfg.unitType || "Incubator"}
              </span>
            </div>
            <div className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {cfg.patientTag || `${cfg.deviceId} · Demonstration`}
            </div>
          </div>
        </div>

        {/* Live beacon & source badge */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--chip-border)" }}>
            <span className="relative flex items-center justify-center" style={{ width: 8, height: 8 }}>
              {connStyle.pulse && (
                <span className="absolute inline-flex rounded-full" style={{ width: 8, height: 8, background: connStyle.dot, opacity: 0.5, animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
              )}
              <span className="relative inline-flex rounded-full" style={{ width: 6, height: 6, background: connStyle.dot }} />
            </span>
            <span className="mono font-bold" style={{ fontSize: 8.5, color: connStyle.color }}>{connStyle.label}</span>
          </div>

          <span
            className="mono font-semibold px-1.5 py-0.5 rounded"
            style={{ fontSize: 8, background: srcLabel.bg, color: srcLabel.color, border: `1px solid ${srcLabel.border}` }}
          >
            {srcLabel.label}
          </span>
        </div>
      </div>

      {/* ── Vitals Grid (3 Individual Tiles) ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-3.5">
        <VitalTile
          icon={Heart}
          label="PULSE"
          value={bed.hr}
          unit="BPM"
          color="#f43f5e"
          isAlert={isHrAlert}
          valid={bed.quality.heartRateValid}
          normalRange={`${thresholds.hrLow}-${thresholds.hrHigh}`}
        />
        <VitalTile
          icon={Droplets}
          label="SpO₂"
          value={bed.spo2}
          unit="%"
          color="#06b6d4"
          isAlert={isSpo2Alert}
          valid={bed.quality.spo2Valid}
          normalRange={`>${thresholds.spo2Low}%`}
        />
        <VitalTile
          icon={Thermometer}
          label="SKIN T"
          value={bed.surfaceTemp}
          unit="°C"
          color="#f59e0b"
          isAlert={isTempAlert}
          valid={bed.quality.temperatureValid}
          normalRange={`${thresholds.tempLow}-${thresholds.tempHigh}°`}
        />
      </div>

      {/* ── Mini Real-Time Waveform Trend ── */}
      <div
        className="px-2.5 py-1.5 rounded-xl mb-3"
        style={{ background: "rgba(15,23,42,0.35)", border: "1px solid var(--chip-border)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="mono uppercase flex items-center gap-1 font-semibold" style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            <Activity size={10} className="text-rose-400" />
            HR Waveform History
          </span>
          <span className="mono" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
            30s trend
          </span>
        </div>
        <MiniSparkline data={bed.chartHr} color={isHrAlert ? "#ef4444" : "#f43f5e"} height={32} />
      </div>

      {/* ── Footer Info & Action ── */}
      <div
        className="flex items-center justify-between pt-2.5 mt-auto"
        style={{ borderTop: "1px solid var(--panel-border)" }}
      >
        <div className="flex items-center gap-1.5 mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
          <Clock size={11} />
          <span>Sync: {bed.lastUpdate || "Connecting…"}</span>
        </div>

        <div className="flex items-center gap-2">
          {hasAlerts ? (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
              style={{ background: "rgba(239,68,68,0.15)", color: "var(--red-alert)" }}
            >
              <AlertTriangle size={11} />
              <span className="mono font-bold" style={{ fontSize: 9.5 }}>
                {activeAlerts.length} ALARM{activeAlerts.length > 1 ? "S" : ""}
              </span>
            </div>
          ) : bed.connection === CONNECTION_STATE.CONNECTED ? (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{ background: "rgba(34,197,94,0.12)", color: "var(--green-ok)" }}
            >
              <CheckCircle size={10} />
              <span className="mono font-bold" style={{ fontSize: 9.5 }}>NOMINAL</span>
            </div>
          ) : null}

          <div
            className="flex items-center gap-1 mono font-semibold text-sky-400 group-hover:translate-x-0.5 transition-transform"
            style={{ fontSize: 10 }}
          >
            <span>Telemetry</span>
            <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BedPanel;
