// =============================================================
// Dashboard.jsx — CradleSense
// Central NICU Station Overview.
// Displays independent Bed telemetry stations, top-level KPI metrics,
// and real-time clinical alarm indicators in a spacious, breathable layout.
// =============================================================

import { LayoutDashboard, AlertTriangle, ShieldCheck, Activity, Radio, Bed as BedIcon } from "lucide-react";
import BedPanel from "../components/BedPanel";
import AlertPanel from "../components/AlertPanel";
import { BED_IDS } from "../data/bedConfig";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { beds, acknowledgeAlert, totalActiveAlerts, dataSource } = useApp();

  // Aggregate all active alerts across all beds
  const allActiveAlerts = Object.values(beds).flatMap((b) =>
    b.alerts.filter((a) => a.lifecycle !== "RESOLVED")
  );

  const nominalBedsCount = Object.values(beds).filter(
    (b) => b.alerts.filter((a) => a.lifecycle !== "RESOLVED").length === 0
  ).length;

  return (
    <div className="flex flex-col gap-6 fade-in max-w-[1560px] mx-auto">

      {/* ── Page Header ── */}
      <div className="glass-panel px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{ width: 46, height: 46, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}
          >
            <LayoutDashboard size={22} className="text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-bold tracking-tight text-white" style={{ fontSize: 18 }}>
                NICU Central Telemetry Station
              </h1>
              <span
                className="mono font-semibold px-2.5 py-0.5 rounded-full"
                style={{ fontSize: 10, background: "rgba(56,189,248,0.12)", color: "var(--blue-accent)", border: "1px solid rgba(56,189,248,0.25)" }}
              >
                6 BEDS ACTIVE
              </span>
            </div>
            <p className="mono mt-1" style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Continuous Non-Invasive Infant Monitoring System (NCMS) · Wearable IoT Prototype
            </p>
          </div>
        </div>

        {/* Global Alarms Status */}
        {totalActiveAlerts > 0 ? (
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl alert-banner-appear"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}
          >
            <AlertTriangle size={18} style={{ color: "var(--red-alert)" }} />
            <div>
              <div className="font-bold mono leading-tight" style={{ fontSize: 12, color: "var(--red-alert)" }}>
                {totalActiveAlerts} Active Physiological Alarm{totalActiveAlerts > 1 ? "s" : ""}
              </div>
              <div className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
                Immediate clinical attention required
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="mono font-semibold text-emerald-400" style={{ fontSize: 11 }}>
              All 6 Stations Operating Within Nominal Range
            </span>
          </div>
        )}
      </div>

      {/* ── Top KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BedIcon,
            title: "Total Stations",
            value: "6 Beds",
            sub: "Full unit census monitored",
            color: "#38bdf8",
            bg: "rgba(56,189,248,0.08)",
          },
          {
            icon: ShieldCheck,
            title: "Nominal Stations",
            value: `${nominalBedsCount} / 6`,
            sub: "All vitals in safe zone",
            color: "#22c55e",
            bg: "rgba(34,197,94,0.08)",
          },
          {
            icon: AlertTriangle,
            title: "Active Alarms",
            value: totalActiveAlerts.toString(),
            sub: totalActiveAlerts === 0 ? "Zero alarm threshold breaches" : "Threshold breach detected",
            color: totalActiveAlerts > 0 ? "#ef4444" : "#94a3b8",
            bg: totalActiveAlerts > 0 ? "rgba(239,68,68,0.12)" : "rgba(148,163,184,0.08)",
          },
          {
            icon: Radio,
            title: "Telemetry Ingestion",
            value: dataSource === "SIMULATION" ? "Sim Engine" : dataSource === "DATASET" ? "Replay Mode" : "IoT Hardware",
            sub: "1.0 Hz periodic sampling rate",
            color: "#818cf8",
            bg: "rgba(129,140,248,0.08)",
          },
        ].map(({ icon: Icon, title, value, sub, color, bg }) => (
          <div
            key={title}
            className="glass-panel p-4 flex items-center gap-3.5"
            style={{ borderRadius: 16 }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width: 40, height: 40, background: bg, border: `1px solid ${color}33` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div className="mono uppercase tracking-wider" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
                {title}
              </div>
              <div className="font-bold mono text-white mt-0.5" style={{ fontSize: 16 }}>
                {value}
              </div>
              <div className="mono mt-0.5 truncate" style={{ fontSize: 9, color: "var(--text-faint)" }}>
                {sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section Title & Stations Header ── */}
      <div className="flex items-center justify-between gap-4 mt-1">
        <div className="flex items-center gap-3">
          <div className="h-4 rounded-full" style={{ width: 3.5, background: "linear-gradient(180deg, #38bdf8, #6366f1)" }} />
          <span className="font-bold uppercase tracking-widest text-slate-300" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
            NICU Bed Stations Matrix
          </span>
        </div>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono text-slate-400" style={{ fontSize: 10 }}>
          Click any station card to open full continuous waveform telemetry
        </span>
      </div>

      {/* ── 6-Bed Grid (Spacious, 3 cols desktop, 2 cols tablet, 1 col mobile) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {BED_IDS.map((bedId) => (
          <BedPanel key={bedId} bedId={bedId} />
        ))}
      </div>

      {/* ── Active Alarms Tray (Rendered with generous spacing) ── */}
      {allActiveAlerts.length > 0 && (
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center gap-3">
            <div className="h-4 rounded-full" style={{ width: 3.5, background: "linear-gradient(180deg, #ef4444, #dc2626)" }} />
            <span className="font-bold uppercase tracking-widest" style={{ fontSize: 11, color: "var(--red-alert)", letterSpacing: "0.12em" }}>
              Active Clinical Alerts Queue ({allActiveAlerts.length})
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(239,68,68,0.25)" }} />
          </div>
          <AlertPanel alerts={allActiveAlerts} onAcknowledge={acknowledgeAlert} />
        </div>
      )}

      {/* ── System Status & Clinical Research Notice ── */}
      <div
        className="rounded-2xl p-4 mono flex items-center justify-between flex-wrap gap-3 mt-2"
        style={{ background: "rgba(15,23,42,0.6)", border: "1px solid var(--chip-border)", fontSize: 10, color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-sky-400" />
          <span className="font-semibold text-slate-300">CradleSense Central Workstation</span>
          <span>·</span>
          <span>Dual-core ESP32-S3 IoT Gateway</span>
          <span>·</span>
          <span>MAX30102 PPG & MLX90614 Medical IR</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: "var(--amber-warn)" }}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>ACADEMIC RESEARCH PROTOTYPE — NOT CERTIFIED FOR CLINICAL LIFE SUPPORT</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
