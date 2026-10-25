// =============================================================
// AlertsPage.jsx — CradleSense
// Full alert lifecycle management with bed filter.
//
// CORRECTIONS:
// - Acknowledge via stable alert ID (not array index)
// - Alerts not silently dismissed — shown until condition clears
// - Alert history shows bed identity and lifecycle state
// - Bed filter dropdown
// =============================================================

import { useState } from "react";
import { Bell, SlidersHorizontal, ChevronDown } from "lucide-react";

import AlertPanel  from "../components/AlertPanel";
import AlertHistory from "../components/AlertHistory";
import { useApp } from "../context/AppContext";
import { BED_CONFIGS, BED_IDS } from "../data/bedConfig";

function AlertsPage() {
  const { beds, acknowledgeAlert, thresholds } = useApp();
  const [bedFilter, setBedFilter] = useState("ALL");
  const [showPicker, setShowPicker] = useState(false);

  // Aggregate alerts
  const allActiveAlerts = Object.values(beds).flatMap((b) =>
    b.alerts.filter((a) => a.lifecycle !== "RESOLVED")
  );

  const filteredActive = bedFilter === "ALL"
    ? allActiveAlerts
    : allActiveAlerts.filter((a) => a.bedId === bedFilter);

  const allHistory = Object.values(beds).flatMap((b) => b.alertHistory || []);
  const filteredHistory = bedFilter === "ALL"
    ? allHistory
    : allHistory.filter((e) => e.bedId === bedFilter);

  const alertCount = allHistory.filter((e) => e.type === "ALERT").length;
  const recovCount = allHistory.filter((e) => e.type === "RECOVERED").length;

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* Page header */}
      <div className="glass-panel px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 42, height: 42, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.28)" }}
          >
            <Bell size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
              Alarm & Event Management
            </h2>
            <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              Demonstration threshold alerts · Acknowledge does not resolve active conditions
            </p>
          </div>
        </div>

        {/* Summary + Bed filter */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <span className="mono font-bold" style={{ fontSize: 11, color: "var(--red-alert)" }}>{alertCount}</span>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--red-alert)" }}> ALARMS</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}>
            <span className="mono font-bold" style={{ fontSize: 11, color: "var(--green-ok)" }}>{recovCount}</span>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--green-ok)" }}> RESOLVED</span>
          </div>

          {/* Bed filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg mono font-bold cursor-pointer"
              style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: "var(--text-primary)", fontSize: 10 }}
            >
              {bedFilter === "ALL" ? "All Beds" : BED_CONFIGS[bedFilter]?.label}
              <ChevronDown size={12} />
            </button>
            {showPicker && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
                style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 150 }}
              >
                {["ALL", ...BED_IDS].map((bid) => (
                  <button
                    key={bid}
                    onClick={() => { setBedFilter(bid); setShowPicker(false); }}
                    className="w-full text-left px-4 py-2.5 cursor-pointer"
                    style={{
                      background: bid === bedFilter ? "rgba(56,189,248,0.10)" : "transparent",
                      color:      bid === bedFilter ? "var(--blue-accent)" : "var(--text-secondary)",
                      fontSize:   12,
                      fontWeight: bid === bedFilter ? 600 : 400,
                      borderBottom: "1px solid var(--panel-border)",
                    }}
                  >
                    {bid === "ALL" ? "All Beds" : BED_CONFIGS[bid]?.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active alerts */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #ef4444, #dc2626)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Active Alarms
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <AlertPanel alerts={filteredActive} onAcknowledge={acknowledgeAlert} />

      {/* Threshold display */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #f59e0b, #fbbf24)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Demonstration Thresholds
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={14} style={{ color: "var(--amber-warn)" }} />
          <span className="font-bold uppercase tracking-widest" style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.08em" }}>
            Configured Demonstration Limits
          </span>
          <span className="mono ml-auto" style={{ fontSize: 9, color: "var(--amber-warn)" }}>
            ⚠ UNVALIDATED — Not clinical reference ranges
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: "HR Lower",    value: thresholds.hrLow,   unit: "BPM", color: "#ef4444" },
            { label: "HR Upper",    value: thresholds.hrHigh,  unit: "BPM", color: "#ef4444" },
            { label: "SpO₂ Min",    value: thresholds.spo2Low, unit: "%",   color: "#06b6d4" },
            { label: "Surf T Low",  value: thresholds.tempLow, unit: "°C",  color: "#f59e0b" },
            { label: "Surf T High", value: thresholds.tempHigh,unit: "°C",  color: "#f59e0b" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}>
              <span className="mono uppercase font-semibold" style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</span>
              <span className="mono font-bold" style={{ fontSize: 22, color, lineHeight: 1 }}>{value}</span>
              <span className="mono" style={{ fontSize: 9.5, color: "var(--text-faint)" }}>{unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Event history */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #06b6d4, #38bdf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Event History
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>{filteredHistory.length} EVENTS</span>
      </div>

      <AlertHistory
        history={filteredHistory}
        bedFilter={bedFilter === "ALL" ? null : bedFilter}
      />
    </div>
  );
}

export default AlertsPage;
