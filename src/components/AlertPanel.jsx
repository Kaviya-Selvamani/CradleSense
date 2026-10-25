// =============================================================
// AlertPanel.jsx — CradleSense
// Displays active demonstration alerts with lifecycle management.
//
// CORRECTIONS FROM ORIGINAL:
// - Dismiss by stable alert ID, not array index
// - "Acknowledge" does NOT resolve/remove the alert — it marks it ACKNOWLEDGED
// - Active conditions remain visible until they clear
// - Alert descriptions are honest about prototype status
// =============================================================

import { CheckCircle, ShieldAlert, AlertTriangle, Bell } from "lucide-react";

const PARAM_COLOR = {
  HR:       "#ef4444",
  "SpO₂":  "#06b6d4",
  SurfTemp: "#f59e0b",
};

const LIFECYCLE_STYLE = {
  ACTIVE: {
    bg:     "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
    color:  "var(--red-alert)",
    label:  "ACTIVE",
  },
  ACKNOWLEDGED: {
    bg:     "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    color:  "var(--amber-warn)",
    label:  "ACKNOWLEDGED",
  },
};

function AlertPanel({ alerts = [], onAcknowledge }) {
  const visible = alerts.filter((a) => a.lifecycle !== "RESOLVED");

  if (!visible || visible.length === 0) {
    return (
      <div
        className="glass-panel p-6 flex flex-col items-center justify-center gap-3"
        style={{ minHeight: 148 }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 44, height: 44, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
        >
          <CheckCircle size={22} style={{ color: "var(--green-ok)" }} />
        </div>
        <div className="text-center">
          <div className="font-semibold" style={{ fontSize: 13.5, color: "var(--green-ok)" }}>
            No Active Demonstration Alarms
          </div>
          <div className="mono mt-1" style={{ fontSize: 10, color: "var(--text-muted)" }}>
            No threshold triggers detected in current session.
            Missing data does not confirm normal physiological state.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-panel overflow-hidden alert-card-pulse"
      style={{ border: "1px solid rgba(239,68,68,0.4)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.18)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 28, height: 28, background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.3)" }}
        >
          <ShieldAlert size={15} style={{ color: "var(--red-alert)" }} />
        </div>
        <span
          className="font-bold tracking-widest uppercase"
          style={{ fontSize: 11, color: "var(--red-alert)", letterSpacing: "0.1em" }}
        >
          Active Demonstration Alarms
        </span>
        <div
          className="ml-auto flex items-center justify-center rounded-full font-bold mono"
          style={{ width: 22, height: 22, background: "var(--red-alert)", fontSize: 11, color: "#fff", boxShadow: "0 0 8px rgba(239,68,68,0.5)" }}
        >
          {visible.length}
        </div>
      </div>

      {/* Disclaimer strip */}
      <div
        className="px-5 py-1.5 mono flex items-center gap-2"
        style={{ background: "rgba(245,158,11,0.06)", borderBottom: "1px solid rgba(245,158,11,0.12)", fontSize: 9, color: "var(--amber-warn)" }}
      >
        <Bell size={9} />
        DEMONSTRATION ONLY — Thresholds are unvalidated. Not for clinical use.
      </div>

      {/* Alert items */}
      <div>
        {visible.map((alert) => {
          const paramColor = PARAM_COLOR[alert.param] || "#ef4444";
          const ls = LIFECYCLE_STYLE[alert.lifecycle] || LIFECYCLE_STYLE.ACTIVE;

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 px-5 py-3.5 alert-appear"
              style={{
                borderBottom: "1px solid rgba(239,68,68,0.1)",
                background:   "rgba(239,68,68,0.03)",
              }}
            >
              {/* Icon */}
              <div
                className="relative flex-shrink-0 flex items-center justify-center rounded-xl mt-0.5"
                style={{ width: 34, height: 34, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--red-alert)" }}
              >
                <AlertTriangle size={15} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Bed tag */}
                  {alert.bedId && (
                    <span
                      className="mono font-bold px-2 py-0.5 rounded"
                      style={{ fontSize: 8.5, background: "rgba(56,189,248,0.12)", color: "var(--blue-accent)", border: "1px solid rgba(56,189,248,0.25)" }}
                    >
                      {alert.bedId}
                    </span>
                  )}
                  <span className="font-bold tracking-wide" style={{ fontSize: 12, color: "var(--red-alert)" }}>
                    THRESHOLD ALERT
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full font-bold mono"
                    style={{ fontSize: 9, background: `${paramColor}18`, color: paramColor, border: `1px solid ${paramColor}40`, letterSpacing: "0.06em" }}
                  >
                    {alert.param}
                  </span>
                  {/* Lifecycle badge */}
                  <span
                    className="px-2 py-0.5 rounded-full mono font-bold"
                    style={{ fontSize: 8.5, background: ls.bg, border: `1px solid ${ls.border}`, color: ls.color }}
                  >
                    {ls.label}
                  </span>
                </div>

                <div className="mono flex items-center gap-3 mt-1.5 flex-wrap" style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
                  <span>
                    Value:{" "}
                    <strong style={{ color: "var(--red-alert)", fontSize: 12 }}>{alert.value}</strong>
                  </span>
                  <span style={{ color: "var(--text-faint)" }}>·</span>
                  <span>Triggered: {alert.time}</span>
                </div>

                <div className="mono mt-1" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
                  {alert.description}
                </div>
              </div>

              {/* Acknowledge — does NOT remove alert */}
              {alert.lifecycle === "ACTIVE" && (
                <button
                  onClick={() => onAcknowledge && onAcknowledge(alert.bedId, alert.id)}
                  className="flex-shrink-0 flex items-center justify-center rounded-lg mono font-bold"
                  style={{
                    padding:    "4px 10px",
                    background: "rgba(245,158,11,0.10)",
                    border:     "1px solid rgba(245,158,11,0.28)",
                    cursor:     "pointer",
                    color:      "var(--amber-warn)",
                    fontSize:   9,
                    letterSpacing: "0.05em",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  title="Acknowledge alert — condition remains monitored"
                >
                  ACK
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertPanel;
