// =============================================================
// AlertHistory.jsx — CradleSense
// Timestamped event log for alert lifecycle history.
//
// CORRECTIONS FROM ORIGINAL:
// - Added Bed column
// - Added Lifecycle column (ACTIVE / ACKNOWLEDGED / RESOLVED)
// - Added FIRED / RECOVERED / ACKNOWLEDGED event types
// - Events keyed by stable string ID, not array index
// =============================================================

import { History } from "lucide-react";

const STATUS_STYLE = {
  ALERT: {
    bg:     "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.30)",
    color:  "var(--red-alert)",
    label:  "ALERT",
  },
  WARNING: {
    bg:     "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.30)",
    color:  "var(--amber-warn)",
    label:  "WARNING",
  },
  RECOVERED: {
    bg:     "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    color:  "var(--green-ok)",
    label:  "RECOVERED",
  },
  NORMAL: {
    bg:     "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    color:  "var(--green-ok)",
    label:  "NORMAL",
  },
};

const LIFECYCLE_STYLE = {
  ACTIVE: {
    bg:     "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.30)",
    color:  "var(--red-alert)",
    label:  "ACTIVE",
  },
  ACKNOWLEDGED: {
    bg:     "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.30)",
    color:  "var(--amber-warn)",
    label:  "ACKNOWLEDGED",
  },
  RESOLVED: {
    bg:     "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.25)",
    color:  "var(--green-ok)",
    label:  "RESOLVED",
  },
};

const PARAM_COLOR = {
  HR:       "#ef4444",
  "SpO₂":  "#06b6d4",
  SurfTemp: "#f59e0b",
  Temp:     "#f59e0b",
};

function StatusBadge({ type }) {
  const s = STATUS_STYLE[type] || STATUS_STYLE.ALERT;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold mono"
      style={{ fontSize: 8.5, background: s.bg, border: `1px solid ${s.border}`, color: s.color, letterSpacing: "0.06em", whiteSpace: "nowrap" }}
    >
      <span className="inline-block rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: s.color }} />
      {s.label}
    </span>
  );
}

function LifecycleBadge({ lifecycle }) {
  const s = LIFECYCLE_STYLE[lifecycle] || LIFECYCLE_STYLE.ACTIVE;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full font-bold mono"
      style={{ fontSize: 8.5, background: s.bg, border: `1px solid ${s.border}`, color: s.color, letterSpacing: "0.06em", whiteSpace: "nowrap" }}
    >
      {s.label}
    </span>
  );
}

function AlertHistory({ history = [], bedFilter = null }) {
  const displayed = bedFilter
    ? history.filter((e) => e.bedId === bedFilter)
    : history;

  return (
    <div className="glass-panel overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--panel-border)" }}
      >
        <History size={14} style={{ color: "var(--amber-warn)" }} />
        <span
          className="font-bold uppercase tracking-widest"
          style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.08em" }}
        >
          Event Log
        </span>
        {bedFilter && (
          <span
            className="mono px-2 py-0.5 rounded"
            style={{ fontSize: 9, color: "var(--blue-accent)", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)" }}
          >
            {bedFilter}
          </span>
        )}
        <span
          className="ml-auto flex items-center justify-center rounded-full mono font-semibold"
          style={{
            width: 22, height: 22,
            background: displayed.length > 0 ? "rgba(239,68,68,0.15)" : "var(--chip-bg)",
            border: displayed.length > 0 ? "1px solid rgba(239,68,68,0.3)" : "1px solid var(--chip-border)",
            fontSize: 9.5,
            color: displayed.length > 0 ? "var(--red-alert)" : "var(--text-muted)",
          }}
        >
          {displayed.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto flex-1" style={{ maxHeight: 290 }}>
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead
            className="sticky top-0 z-10"
            style={{ background: "var(--table-header-bg)", backdropFilter: "blur(8px)" }}
          >
            <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
              {["Time", "Bed", "Param", "Value", "Event", "Lifecycle", "Details"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 uppercase tracking-wider text-left"
                  style={{ fontSize: 8.5, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center mono"
                  style={{ fontSize: 11, color: "var(--text-muted)" }}
                >
                  No alert events logged in this session
                </td>
              </tr>
            ) : (
              displayed.map((evt, idx) => {
                const paramColor = PARAM_COLOR[evt.param] || "#ef4444";
                return (
                  <tr
                    key={evt.id || `${evt.time}-${idx}`}
                    className="data-row"
                    style={{
                      borderBottom: "1px solid var(--table-border)",
                      background: idx % 2 === 1 ? "var(--table-row-alt)" : "transparent",
                    }}
                  >
                    {/* Time */}
                    <td className="px-3 py-2.5 mono" style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {evt.time}
                    </td>

                    {/* Bed */}
                    <td className="px-3 py-2.5" style={{ whiteSpace: "nowrap" }}>
                      <span
                        className="mono font-bold px-1.5 py-0.5 rounded"
                        style={{ fontSize: 8.5, color: "var(--blue-accent)", background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.18)" }}
                      >
                        {evt.bedId || "—"}
                      </span>
                    </td>

                    {/* Param */}
                    <td className="px-3 py-2.5" style={{ whiteSpace: "nowrap" }}>
                      <span
                        className="mono font-bold px-2 py-0.5 rounded-full"
                        style={{ fontSize: 9, background: `${paramColor}18`, color: paramColor, border: `1px solid ${paramColor}35` }}
                      >
                        {evt.param}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="px-3 py-2.5 mono font-bold text-right" style={{ fontSize: 11, color: paramColor, whiteSpace: "nowrap" }}>
                      {evt.value ?? "—"}
                    </td>

                    {/* Event type */}
                    <td className="px-3 py-2.5" style={{ whiteSpace: "nowrap" }}>
                      <StatusBadge type={evt.type} />
                    </td>

                    {/* Lifecycle */}
                    <td className="px-3 py-2.5" style={{ whiteSpace: "nowrap" }}>
                      <LifecycleBadge lifecycle={evt.lifecycle} />
                    </td>

                    {/* Details */}
                    <td className="px-3 py-2.5 mono" style={{ fontSize: 10, color: "var(--text-secondary)", maxWidth: 200 }}>
                      <span className="truncate block">{evt.description || "—"}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertHistory;
