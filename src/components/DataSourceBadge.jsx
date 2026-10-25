// =============================================================
// DataSourceBadge.jsx — CradleSense
//
// CORRECTIONS FROM ORIGINAL:
// - Removed hardcoded "Active Ingestion · 1.0 Hz"
// - Removed "TLS / AES-128" (unverified security claim)
// - Now reads actual dataSource from context and shows real status
// - Each mode clearly labelled: SIMULATION / DATASET / LIVE
// =============================================================

import { Database, FlaskConical, Wifi } from "lucide-react";
import { useApp } from "../context/AppContext";

const SOURCE_CONFIG = {
  SIMULATION: {
    icon:    <FlaskConical size={15} className="text-indigo-400" />,
    label:   "SIMULATED DATA",
    desc:    "Synthetic demonstration readings — not patient measurements",
    dotColor:"var(--indigo-accent)",
    bg:      "rgba(129,140,248,0.08)",
    border:  "rgba(129,140,248,0.22)",
    textColor:"var(--indigo-accent)",
  },
  DATASET: {
    icon:    <Database size={15} className="text-amber-400" />,
    label:   "DATASET REPLAY",
    desc:    "Pre-recorded data — not live monitoring",
    dotColor:"var(--amber-warn)",
    bg:      "rgba(245,158,11,0.08)",
    border:  "rgba(245,158,11,0.22)",
    textColor:"var(--amber-warn)",
  },
  LIVE: {
    icon:    <Wifi size={15} className="text-green-400" />,
    label:   "LIVE — ESP32-S3",
    desc:    "Real readings from hardware via HTTP POST",
    dotColor:"var(--green-ok)",
    bg:      "rgba(34,197,94,0.08)",
    border:  "rgba(34,197,94,0.22)",
    textColor:"var(--green-ok)",
  },
};

function DataSourceBadge() {
  const { dataSource } = useApp();
  const cfg = SOURCE_CONFIG[dataSource] || SOURCE_CONFIG.SIMULATION;

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <Database size={14} style={{ color: "var(--blue-accent)" }} />
        <span
          className="font-bold uppercase tracking-widest"
          style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.08em" }}
        >
          Data Source
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Source badge */}
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 40, height: 40, background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {cfg.icon}
            <span
              className="absolute top-0.5 right-0.5 rounded-full"
              style={{ width: 7, height: 7, background: cfg.dotColor }}
            />
          </div>
          <div>
            <div className="font-bold tracking-wide mono" style={{ fontSize: 11, color: cfg.textColor }}>
              {cfg.label}
            </div>
            <div className="mono mt-0.5" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
              {cfg.desc}
            </div>
          </div>
        </div>

        {/* Current mode details */}
        <div className="flex flex-col gap-1.5">
          {[
            { label: "MODE",     value: dataSource          },
            { label: "PROTOCOL", value: dataSource === "LIVE" ? "HTTP POST → Node.js" : "Internal replay" },
            { label: "DEVICE",   value: dataSource === "LIVE" ? "ESP32-S3 Mini" : "N/A" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-1"
              style={{ borderBottom: "1px solid var(--chip-border)" }}
            >
              <span className="mono uppercase tracking-wider" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
                {label}
              </span>
              <span className="mono font-semibold" style={{ fontSize: 9.5, color: "var(--text-secondary)" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Prototype notice */}
        <div
          className="rounded-lg px-3 py-2 mono"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", fontSize: 9, color: "var(--amber-warn)", lineHeight: 1.5 }}
        >
          RESEARCH PROTOTYPE — Not for clinical use
        </div>
      </div>
    </div>
  );
}

export default DataSourceBadge;
