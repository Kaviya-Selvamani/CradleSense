// =============================================================
// RecentData.jsx — CradleSense
//
// CORRECTIONS FROM ORIGINAL:
// - Added "Source" column showing SIMULATION / DATASET / LIVE
// - Null values explicitly show "—" not 0
// - "Surface Temp" column label (not "Temp")
// - Validity flags respected
// =============================================================

import { TableProperties } from "lucide-react";

const PARAM_COLOR = {
  hr:   "#ef4444",
  spo2: "#06b6d4",
  temp: "#f59e0b",
};

const SOURCE_CHIP = {
  SIMULATION: { bg: "rgba(129,140,248,0.12)", color: "var(--indigo-accent)", border: "rgba(129,140,248,0.25)", label: "SIM" },
  DATASET:    { bg: "rgba(245,158,11,0.12)",  color: "var(--amber-warn)",    border: "rgba(245,158,11,0.25)",  label: "DATA" },
  LIVE:       { bg: "rgba(34,197,94,0.12)",   color: "var(--green-ok)",      border: "rgba(34,197,94,0.25)",   label: "LIVE" },
};

function StatusChip({ status }) {
  const isAlert = status === "ALERT";
  const isWarn  = status === "WARNING";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mono font-bold"
      style={{
        fontSize:   8.5,
        background: isAlert ? "rgba(239,68,68,0.12)" : isWarn ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.10)",
        border:     isAlert ? "1px solid rgba(239,68,68,0.30)" : isWarn ? "1px solid rgba(245,158,11,0.30)" : "1px solid rgba(34,197,94,0.22)",
        color:      isAlert ? "var(--red-alert)" : isWarn ? "var(--amber-warn)" : "var(--green-ok)",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", display: "inline-block", background: isAlert ? "var(--red-alert)" : isWarn ? "var(--amber-warn)" : "var(--green-ok)", flexShrink: 0 }} />
      {status || "NOMINAL"}
    </span>
  );
}

function SourceChip({ source }) {
  const cfg = SOURCE_CHIP[source] || SOURCE_CHIP.SIMULATION;
  return (
    <span
      className="mono font-bold px-1.5 py-0.5 rounded"
      style={{ fontSize: 8.5, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

function RecentData({ readings = [] }) {
  return (
    <div className="glass-panel overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <TableProperties size={14} style={{ color: "var(--blue-accent)" }} />
        <span
          className="font-bold uppercase tracking-widest"
          style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.08em" }}
        >
          Recent Readings
        </span>
        <span
          className="ml-auto mono px-2 py-0.5 rounded text-[10px]"
          style={{ color: "var(--text-muted)", background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}
        >
          {readings.length} Records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto flex-1" style={{ maxHeight: 290 }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead className="sticky top-0 z-10" style={{ background: "var(--table-header-bg)", backdropFilter: "blur(8px)" }}>
            <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
              {[
                { label: "Time",          align: "left"   },
                { label: "HR (BPM)",      align: "right"  },
                { label: "SpO₂ (%)",      align: "right"  },
                { label: "Surface T °C",  align: "right"  },
                { label: "Status",        align: "center" },
                { label: "Source",        align: "center" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-4 py-2.5 uppercase tracking-wider text-${h.align}`}
                  style={{ fontSize: 8.5, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Awaiting readings…
                </td>
              </tr>
            ) : (
              readings.map((row, idx) => (
                <tr
                  key={`${row.time}-${idx}`}
                  className="data-row"
                  style={{
                    borderBottom: "1px solid var(--table-border)",
                    background: idx === 0 ? "rgba(56,189,248,0.04)" : idx % 2 === 1 ? "var(--table-row-alt)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Timestamp */}
                  <td className="px-4 py-2.5 mono" style={{ fontSize: 10, color: idx === 0 ? "var(--blue-accent)" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                    <div className="flex items-center gap-1.5">
                      {idx === 0 && <span className="inline-block rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: "var(--blue-accent)" }} />}
                      <span>{row.time}</span>
                    </div>
                  </td>

                  {/* HR */}
                  <td className="px-4 py-2.5 mono font-bold text-right" style={{ fontSize: 11.5, color: PARAM_COLOR.hr, whiteSpace: "nowrap" }}>
                    {row.hr != null ? row.hr : "—"}
                  </td>

                  {/* SpO₂ */}
                  <td className="px-4 py-2.5 mono font-bold text-right" style={{ fontSize: 11.5, color: PARAM_COLOR.spo2, whiteSpace: "nowrap" }}>
                    {row.spo2 != null ? `${row.spo2}%` : "—"}
                  </td>

                  {/* Surface Temperature */}
                  <td className="px-4 py-2.5 mono font-bold text-right" style={{ fontSize: 11.5, color: PARAM_COLOR.temp, whiteSpace: "nowrap" }}>
                    {row.temp != null ? `${Number(row.temp).toFixed(1)}°` : "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2.5 text-center" style={{ whiteSpace: "nowrap" }}>
                    <StatusChip status={row.status} />
                  </td>

                  {/* Source */}
                  <td className="px-4 py-2.5 text-center" style={{ whiteSpace: "nowrap" }}>
                    <SourceChip source={row.source} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentData;
