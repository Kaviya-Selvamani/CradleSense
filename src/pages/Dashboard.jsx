// =============================================================
// Dashboard.jsx — CradleSense
// Six-bed overview. Displays independent BedPanel cards in a 3×2
// responsive grid. Click any bed card to open detailed monitoring.
// =============================================================

import { LayoutDashboard, AlertTriangle } from "lucide-react";
import BedPanel from "../components/BedPanel";
import AlertPanel from "../components/AlertPanel";
import { BED_IDS } from "../data/bedConfig";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { beds, acknowledgeAlert, totalActiveAlerts } = useApp();

  // Aggregate all active alerts across all beds
  const allActiveAlerts = Object.values(beds).flatMap((b) =>
    b.alerts.filter((a) => a.lifecycle !== "RESOLVED")
  );

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* ── Page header ── */}
      <div className="glass-panel px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 42, height: 42, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <LayoutDashboard size={20} className="text-sky-500" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
              NICU Overview — 6 Beds
            </h2>
            <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              CradleSense · Research Prototype · Click a bed card to view detailed monitoring
            </p>
          </div>
        </div>

        {totalActiveAlerts > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl alert-banner-appear"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)" }}
          >
            <AlertTriangle size={14} style={{ color: "var(--red-alert)" }} />
            <span className="font-bold mono" style={{ fontSize: 11, color: "var(--red-alert)" }}>
              {totalActiveAlerts} Active Demonstration Alarm{totalActiveAlerts > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Section divider ── */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #38bdf8, #6366f1)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Monitoring Stations
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
          {BED_IDS.length} beds · Simulation mode
        </span>
      </div>

      {/* ── 6-Bed grid: 3 cols desktop, 2 tablet, 1 mobile ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BED_IDS.map((bedId) => (
          <BedPanel key={bedId} bedId={bedId} />
        ))}
      </div>

      {/* ── Active alerts section (if any) ── */}
      {allActiveAlerts.length > 0 && (
        <>
          <div className="flex items-center gap-3 mt-1">
            <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #ef4444, #dc2626)" }} />
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
              Active Demonstration Alarms
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
          </div>
          <AlertPanel alerts={allActiveAlerts} onAcknowledge={acknowledgeAlert} />
        </>
      )}

      {/* ── Footer ── */}
      <div
        className="rounded-xl px-5 py-3 mono flex items-center justify-between flex-wrap gap-2"
        style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 4 }}
      >
        <span className="font-semibold" style={{ color: "var(--blue-accent)" }}>CradleSense · NCMS Research Dashboard</span>
        <span>ESP32-S3 · MAX30102 · MLX90614 IR</span>
        <span style={{ color: "var(--amber-warn)" }}>RESEARCH PROTOTYPE — NOT FOR CLINICAL USE</span>
      </div>
    </div>
  );
}

export default Dashboard;
