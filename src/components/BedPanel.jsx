// =============================================================
// BedPanel.jsx — CradleSense
// Six-bed overview card showing independent readings per bed.
// Click to navigate to detailed monitoring view.
// =============================================================

import { useNavigate } from "react-router-dom";
import { Bed, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useApp, CONNECTION_STATE } from "../context/AppContext";
import { BED_CONFIGS } from "../data/bedConfig";

const CONN_STYLE = {
  [CONNECTION_STATE.CONNECTED]:    { color: "var(--green-ok)",      dot: "var(--green-ok)",    label: "LIVE",         pulse: true  },
  [CONNECTION_STATE.STALE]:        { color: "var(--amber-warn)",    dot: "var(--amber-warn)",  label: "STALE",        pulse: false },
  [CONNECTION_STATE.DISCONNECTED]: { color: "var(--red-alert)",     dot: "var(--red-alert)",   label: "DISCONNECTED", pulse: false },
  [CONNECTION_STATE.SENSOR_ERROR]: { color: "var(--red-alert)",     dot: "var(--red-alert)",   label: "SENSOR ERR",   pulse: false },
  [CONNECTION_STATE.CONNECTING]:   { color: "var(--amber-warn)",    dot: "var(--amber-warn)",  label: "CONNECTING…",  pulse: false },
  [CONNECTION_STATE.UNKNOWN]:      { color: "var(--text-muted)",    dot: "var(--text-faint)",  label: "UNKNOWN",      pulse: false },
};

const SOURCE_LABEL = {
  SIMULATION: { label: "SIM",  color: "var(--indigo-accent)", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.22)" },
  DATASET:    { label: "DATA", color: "var(--amber-warn)",    bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.22)"  },
  LIVE:       { label: "LIVE", color: "var(--green-ok)",      bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.22)"   },
};

function ValueDisplay({ value, unit, color, valid = true }) {
  const isNull = value === null || value === undefined || !valid;
  return (
    <div className="flex items-baseline gap-1">
      <span
        className="mono font-bold leading-none"
        style={{ fontSize: 26, color: isNull ? "var(--text-faint)" : color, letterSpacing: "-0.02em" }}
      >
        {isNull ? "—" : (unit === "°C" ? Number(value).toFixed(1) : value)}
      </span>
      {!isNull && (
        <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{unit}</span>
      )}
    </div>
  );
}

function BedPanel({ bedId }) {
  const navigate = useNavigate();
  const { beds, setSelectedBed } = useApp();
  const bed = beds[bedId];
  const cfg = BED_CONFIGS[bedId];

  if (!bed) return null;

  const connStyle   = CONN_STYLE[bed.connection] || CONN_STYLE[CONNECTION_STATE.UNKNOWN];
  const activeAlerts = bed.alerts.filter((a) => a.lifecycle !== "RESOLVED");
  const hasAlerts    = activeAlerts.length > 0;
  const srcLabel     = SOURCE_LABEL[bed.source] || SOURCE_LABEL.SIMULATION;

  const handleClick = () => {
    setSelectedBed(bedId);
    navigate("/live");
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl flex flex-col gap-0 cursor-pointer ${hasAlerts ? "alert-card-pulse" : ""}`}
      style={{
        background:   "var(--card-bg)",
        border:       hasAlerts
          ? "1px solid rgba(239,68,68,0.45)"
          : "1px solid var(--panel-border)",
        boxShadow:    hasAlerts
          ? "0 0 24px rgba(239,68,68,0.08)"
          : "var(--card-box-shadow)",
        transition:   "border-color 0.25s ease, transform 0.15s ease",
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open monitoring view for ${cfg.label}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height:     3,
          background: hasAlerts
            ? "linear-gradient(90deg, transparent, #ef4444 40%, transparent)"
            : "linear-gradient(90deg, transparent, var(--blue-accent) 40%, transparent)",
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* ── Header row ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 34, height: 34, background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)" }}
          >
            <Bed size={16} className="text-sky-500" />
          </div>
          <div>
            <div className="font-bold" style={{ fontSize: 13, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
              {cfg.label}
            </div>
            <div className="mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>
              {cfg.deviceId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Source chip */}
          <span
            className="mono font-bold px-2 py-0.5 rounded"
            style={{ fontSize: 8, background: srcLabel.bg, color: srcLabel.color, border: `1px solid ${srcLabel.border}` }}
          >
            {srcLabel.label}
          </span>
          {/* Connection dot */}
          <span className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
            {connStyle.pulse && (
              <span className="absolute inline-flex rounded-full" style={{ width: 10, height: 10, background: connStyle.dot, opacity: 0.4, animation: "ping 2.2s cubic-bezier(0,0,0.2,1) infinite" }} />
            )}
            <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: connStyle.dot }} />
          </span>
          <span className="mono font-semibold" style={{ fontSize: 8.5, color: connStyle.color }}>{connStyle.label}</span>
        </div>
      </div>

      {/* ── Vitals row ── */}
      <div className="grid grid-cols-3 gap-0 px-4 pb-3">
        {/* HR */}
        <div className="flex flex-col gap-1">
          <span className="mono uppercase" style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.07em" }}>HR</span>
          <ValueDisplay value={bed.hr} unit="BPM" color="#ef4444" valid={bed.quality.heartRateValid} />
        </div>
        {/* SpO₂ */}
        <div className="flex flex-col gap-1">
          <span className="mono uppercase" style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.07em" }}>SpO₂</span>
          <ValueDisplay value={bed.spo2} unit="%" color="#06b6d4" valid={bed.quality.spo2Valid} />
        </div>
        {/* Surface Temp */}
        <div className="flex flex-col gap-1">
          <span className="mono uppercase" style={{ fontSize: 8, color: "var(--text-faint)", letterSpacing: "0.07em" }}>Surf T</span>
          <ValueDisplay value={bed.surfaceTemp} unit="°C" color="#f59e0b" valid={bed.quality.temperatureValid} />
        </div>
      </div>

      {/* ── Footer: timestamp + alert count ── */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: "1px solid var(--panel-border)" }}
      >
        <div className="flex items-center gap-1.5 mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>
          <Clock size={9} />
          {bed.lastUpdate ? bed.lastUpdate : "Awaiting…"}
        </div>

        {hasAlerts ? (
          <div className="flex items-center gap-1.5" style={{ color: "var(--red-alert)" }}>
            <AlertTriangle size={11} />
            <span className="mono font-bold" style={{ fontSize: 9.5 }}>
              {activeAlerts.length} ALARM{activeAlerts.length > 1 ? "S" : ""}
            </span>
          </div>
        ) : bed.connection === CONNECTION_STATE.CONNECTED ? (
          <div className="flex items-center gap-1.5" style={{ color: "var(--green-ok)" }}>
            <CheckCircle size={11} />
            <span className="mono font-bold" style={{ fontSize: 9.5 }}>NOMINAL</span>
          </div>
        ) : (
          <span className="mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>
            {bed.connection === CONNECTION_STATE.STALE ? "⚠ STALE DATA" : "—"}
          </span>
        )}
      </div>
    </div>
  );
}

export default BedPanel;
