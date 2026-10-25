// =============================================================
// SystemStatus.jsx — CradleSense
//
// CORRECTIONS FROM ORIGINAL:
// - `active = status?.[key] !== false` → now requires explicit true
// - Added STALE, SENSOR_ERROR, UNKNOWN states
// - Removed hardcoded "MQTT / WebSocket" label (actual protocol is HTTP POST)
// - Shows actual connection state from context, not assumed default
// =============================================================

import { Cpu, Wifi, Radio, Monitor, AlertTriangle, Clock } from "lucide-react";
import { CONNECTION_STATE } from "../context/AppContext";

const ITEMS = [
  { icon: Cpu,     label: "ESP32-S3 Mini", key: "esp32",     note: "IoT Microcontroller" },
  { icon: Wifi,    label: "Wi-Fi",          key: "wifi",      note: "IEEE 802.11 b/g/n"  },
  { icon: Radio,   label: "Telemetry",      key: "stream",    note: "HTTP POST / Polling" },
  { icon: Monitor, label: "Dashboard",      key: "dashboard", note: "Monitoring UI"       },
];

const STATE_CONFIG = {
  [CONNECTION_STATE.CONNECTED]: {
    dotColor:  "var(--green-ok)",
    dotGlow:   "0 0 6px var(--green-ok)",
    label:     "Connected",
    textColor: "var(--green-ok)",
    bg:        "rgba(34,197,94,0.04)",
    border:    "rgba(34,197,94,0.18)",
    pulse:     true,
  },
  [CONNECTION_STATE.CONNECTING]: {
    dotColor:  "var(--amber-warn)",
    dotGlow:   "0 0 6px var(--amber-warn)",
    label:     "Connecting…",
    textColor: "var(--amber-warn)",
    bg:        "rgba(245,158,11,0.04)",
    border:    "rgba(245,158,11,0.18)",
    pulse:     false,
  },
  [CONNECTION_STATE.STALE]: {
    dotColor:  "var(--amber-warn)",
    dotGlow:   "none",
    label:     "Stale Data",
    textColor: "var(--amber-warn)",
    bg:        "rgba(245,158,11,0.04)",
    border:    "rgba(245,158,11,0.18)",
    pulse:     false,
  },
  [CONNECTION_STATE.DISCONNECTED]: {
    dotColor:  "var(--red-alert)",
    dotGlow:   "none",
    label:     "Disconnected",
    textColor: "var(--red-alert)",
    bg:        "rgba(239,68,68,0.04)",
    border:    "rgba(239,68,68,0.18)",
    pulse:     false,
  },
  [CONNECTION_STATE.SENSOR_ERROR]: {
    dotColor:  "var(--red-alert)",
    dotGlow:   "none",
    label:     "Sensor Error",
    textColor: "var(--red-alert)",
    bg:        "rgba(239,68,68,0.04)",
    border:    "rgba(239,68,68,0.18)",
    pulse:     false,
  },
  [CONNECTION_STATE.UNKNOWN]: {
    dotColor:  "var(--text-faint)",
    dotGlow:   "none",
    label:     "Unknown",
    textColor: "var(--text-muted)",
    bg:        "var(--chip-bg)",
    border:    "var(--chip-border)",
    pulse:     false,
  },
};

function StatusDot({ state }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG[CONNECTION_STATE.UNKNOWN];
  return (
    <span className="relative flex items-center justify-center flex-shrink-0" style={{ width: 10, height: 10 }}>
      {cfg.pulse && (
        <span
          className="absolute inline-flex rounded-full"
          style={{ width: 10, height: 10, background: cfg.dotColor, opacity: 0.4, animation: "ping 2.2s cubic-bezier(0,0,0.2,1) infinite" }}
        />
      )}
      <span
        className="relative inline-flex rounded-full"
        style={{ width: 8, height: 8, background: cfg.dotColor, boxShadow: cfg.dotGlow }}
      />
    </span>
  );
}

function SystemStatus({ status = {}, connectionState, lastUpdate }) {
  // connectionState drives overall header dot
  const overallCfg = STATE_CONFIG[connectionState] || STATE_CONFIG[CONNECTION_STATE.UNKNOWN];

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <Cpu size={14} style={{ color: "var(--blue-accent)" }} />
        <span
          className="font-bold uppercase tracking-widest"
          style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.08em" }}
        >
          Device Status
        </span>
        <span
          className="ml-auto inline-block rounded-full"
          style={{ width: 6, height: 6, background: overallCfg.dotColor, boxShadow: overallCfg.dotGlow }}
        />
        <span className="mono font-semibold" style={{ fontSize: 9, color: overallCfg.textColor, letterSpacing: "0.04em" }}>
          {overallCfg.label}
        </span>
      </div>

      {/* Stale warning banner */}
      {connectionState === CONNECTION_STATE.STALE && (
        <div
          className="px-4 py-2 flex items-center gap-2 mono"
          style={{ background: "rgba(245,158,11,0.08)", borderBottom: "1px solid rgba(245,158,11,0.15)", fontSize: 9, color: "var(--amber-warn)" }}
        >
          <AlertTriangle size={10} />
          Last values may be outdated — no recent readings received
        </div>
      )}

      {/* Items */}
      <div className="p-3 flex flex-col gap-2">
        {ITEMS.map(({ icon: Icon, label, key, note }) => {
          const state = status[key] === true
            ? CONNECTION_STATE.CONNECTED
            : status[key] === false
            ? CONNECTION_STATE.DISCONNECTED
            : CONNECTION_STATE.UNKNOWN;

          const cfg = STATE_CONFIG[state];
          return (
            <div
              key={key}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex items-center justify-center rounded-lg"
                  style={{ width: 28, height: 28, background: "rgba(56,189,248,0.08)", color: "var(--blue-accent)" }}
                >
                  <Icon size={14} />
                </span>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>{label}</div>
                  <div className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)", marginTop: 1 }}>{note}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot state={state} />
                <span className="mono font-semibold" style={{ fontSize: 9.5, color: cfg.textColor, letterSpacing: "0.04em" }}>
                  {state === CONNECTION_STATE.CONNECTED ? "Online"
                   : state === CONNECTION_STATE.DISCONNECTED ? "Offline"
                   : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last update */}
      {lastUpdate && (
        <div
          className="px-4 py-2 flex items-center gap-2 mono"
          style={{ borderTop: "1px solid var(--panel-border)", fontSize: 9, color: "var(--text-muted)" }}
        >
          <Clock size={9} />
          Last reading: {lastUpdate}
        </div>
      )}
    </div>
  );
}

export default SystemStatus;
