// =============================================================
// VitalCard.jsx — CradleSense
// Displays a single vital-sign measurement with status badge.
//
// CORRECTIONS FROM ORIGINAL:
// - sensorTag for temp changed from "LM35 PROBE" → "MLX90614 IR"
// - label for temp changed from "BODY TEMPERATURE" → "SURFACE TEMPERATURE"
// - Status UNKNOWN added for when value is unavailable
// - Accepts optional `chartId` prop for unique gradient scoping
// =============================================================

import { Heart, Droplets, Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react";

const PARAM_CONFIG = {
  hr: {
    label:     "HEART RATE",
    sensorTag: "MAX30102 PPG",
    unit:      "BPM",
    accent:    "#ef4444",
    glow:      "rgba(239,68,68,0.22)",
    ring:      "rgba(239,68,68,0.12)",
    topBar:    "linear-gradient(90deg, transparent, #ef4444 40%, transparent)",
    glowClass: "card-glow-red",
    icon:      (cls) => <Heart size={18} className={cls} />,
  },
  spo2: {
    label:     "SpO₂ (ESTIMATED)",
    sensorTag: "MAX30102 OPTICAL",
    unit:      "%",
    accent:    "#06b6d4",
    glow:      "rgba(6,182,212,0.22)",
    ring:      "rgba(6,182,212,0.12)",
    topBar:    "linear-gradient(90deg, transparent, #06b6d4 40%, transparent)",
    glowClass: "card-glow-cyan",
    icon:      () => <Droplets size={18} className="spo2-pulse" />,
  },
  temp: {
    label:     "SURFACE TEMPERATURE",
    sensorTag: "MLX90614 IR",
    unit:      "°C",
    accent:    "#f59e0b",
    glow:      "rgba(245,158,11,0.22)",
    ring:      "rgba(245,158,11,0.12)",
    topBar:    "linear-gradient(90deg, transparent, #f59e0b 40%, transparent)",
    glowClass: "card-glow-amber",
    icon:      () => <Thermometer size={18} />,
  },
};

function VitalCard({ param, value, status, trend, valid = true }) {
  const cfg = PARAM_CONFIG[param];
  if (!cfg) return null;

  const isAlert   = status === "ALERT";
  const isWarning = status === "WARNING";
  const isUnknown = value === null || value === undefined || !valid;

  const statusColor  = isUnknown
    ? "var(--text-muted)"
    : isAlert   ? "var(--red-alert)"
    : isWarning ? "var(--amber-warn)"
    : "var(--green-ok)";

  const statusBg = isUnknown
    ? "rgba(100,116,139,0.10)"
    : isAlert   ? "rgba(239,68,68,0.12)"
    : isWarning ? "rgba(245,158,11,0.12)"
    : "rgba(34,197,94,0.10)";

  const statusBorder = isUnknown
    ? "rgba(100,116,139,0.22)"
    : isAlert   ? "rgba(239,68,68,0.35)"
    : isWarning ? "rgba(245,158,11,0.35)"
    : "rgba(34,197,94,0.25)";

  const statusLabel = isUnknown
    ? "UNAVAILABLE"
    : isAlert   ? "ALERT"
    : isWarning ? "WARNING"
    : "NOMINAL";

  const displayValue = isUnknown
    ? "—"
    : param === "temp"
    ? Number(value).toFixed(1)
    : value;

  const valueColor = isUnknown
    ? "var(--text-faint)"
    : isAlert ? "var(--red-alert)"
    : cfg.accent;

  const iconAnimClass = param === "hr" && !isUnknown ? "heartbeat" : "";

  return (
    <div
      className={`relative overflow-hidden p-5 flex flex-col justify-between ${cfg.glowClass} ${isAlert ? "alert-card-pulse" : ""}`}
      style={{
        background:   "var(--card-bg)",
        borderRadius: 14,
        border:       isAlert
          ? "1px solid rgba(239,68,68,0.45)"
          : "1px solid var(--panel-border)",
        boxShadow: isAlert
          ? "0 0 24px rgba(239,68,68,0.10)"
          : "var(--card-box-shadow)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        minHeight:  168,
      }}
    >
      {/* Colored top accent bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 2.5, background: cfg.topBar, borderRadius: "14px 14px 0 0" }}
      />

      {/* Top row: Icon + Label + Sensor Tag + Trend */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width:     40,
              height:    40,
              background: cfg.ring,
              color:     isAlert ? "var(--red-alert)" : cfg.accent,
              border:    `1px solid ${cfg.glow}`,
            }}
          >
            {cfg.icon(iconAnimClass)}
          </div>
          <div>
            <div
              className="font-bold tracking-widest uppercase"
              style={{ fontSize: 9.5, color: "var(--text-muted)", letterSpacing: "0.08em" }}
            >
              {cfg.label}
            </div>
            <div className="mono font-medium mt-0.5" style={{ fontSize: 9, color: "var(--text-faint)" }}>
              {cfg.sensorTag}
            </div>
          </div>
        </div>

        {/* Trend arrow — hidden if unavailable */}
        {!isUnknown && (
          <div className="flex flex-col items-center gap-0.5 mt-0.5" style={{ color: "var(--text-faint)" }}>
            {trend === "up"   ? <TrendingUp  size={14} style={{ color: isAlert ? "var(--red-alert)" : "var(--text-muted)" }} />
            : trend === "down" ? <TrendingDown size={14} style={{ color: isAlert ? "var(--red-alert)" : "var(--text-muted)" }} />
            : <Minus size={14} style={{ color: "var(--text-faint)" }} />}
            <span className="mono" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"}
            </span>
          </div>
        )}
      </div>

      {/* Big Value */}
      <div
        className="flex items-baseline gap-2 relative z-10 my-2 value-flash"
        key={String(displayValue)}
      >
        <span
          className="mono font-bold leading-none"
          style={{ fontSize: 44, color: valueColor, letterSpacing: "-0.03em" }}
        >
          {displayValue}
        </span>
        {!isUnknown && (
          <span className="mono font-semibold" style={{ fontSize: 14, color: isAlert ? "var(--red-alert)" : "var(--text-muted)" }}>
            {cfg.unit}
          </span>
        )}
      </div>

      {/* Status badge */}
      <div
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full self-start relative z-10"
        style={{ background: statusBg, border: `1px solid ${statusBorder}` }}
      >
        <span
          className="relative inline-flex rounded-full"
          style={{ width: 6, height: 6, background: statusColor }}
        />
        <span className="font-bold tracking-widest mono" style={{ fontSize: 9.5, color: statusColor, letterSpacing: "0.08em" }}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

export default VitalCard;
