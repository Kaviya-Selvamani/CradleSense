// =============================================================
// Header.jsx — CradleSense
//
// CORRECTIONS FROM ORIGINAL:
// - App name updated to "CradleSense" with "Neonatal Monitoring Dashboard"
// - Removed hardcoded "ONLINE" badge (replaced with dynamic alert count)
// - Removed hardcoded "Active (1 Hz)" / "NEO-001" center chips
// - Added "RESEARCH PROTOTYPE — NOT FOR CLINICAL USE" banner
// - System status indicator now reflects actual alert state
// =============================================================

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, Sun, Moon, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";

function Header({ theme, onToggleTheme }) {
  const [time, setTime] = useState(new Date());
  const { totalActiveAlerts, dataSource } = useApp();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const wallClock = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const wallDate  = time.toLocaleDateString("en-IN",  { day: "2-digit", month: "short", year: "numeric" });

  const hasAlert = totalActiveAlerts > 0;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex flex-col"
      style={{
        background:    "var(--header-bg)",
        borderBottom:  "1px solid var(--header-border)",
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition:    "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* ── Prototype disclaimer banner ── */}
      <div
        className="flex items-center justify-center gap-2 px-4 py-1 mono"
        style={{
          background: "rgba(245,158,11,0.08)",
          borderBottom: "1px solid rgba(245,158,11,0.15)",
          fontSize: 9,
          color: "var(--amber-warn)",
          letterSpacing: "0.06em",
        }}
      >
        <ShieldAlert size={9} />
        RESEARCH PROTOTYPE — NOT FOR CLINICAL USE — Values are demonstration data only
      </div>

      {/* ── Main header row ── */}
      <div
        className="flex items-center justify-between px-5"
        style={{ height: 54 }}
      >
        {/* ── Left: Logo + App Name ── */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              width: 38, height: 38,
              background: theme === "light" ? "rgba(2,132,199,0.12)" : "rgba(26,58,96,0.9)",
              border: "1px solid rgba(56,189,248,0.3)",
            }}
          >
            <Activity size={18} className="text-sky-500" />
            <span
              className="absolute top-0.5 right-0.5 rounded-full"
              style={{
                width: 7, height: 7,
                background: hasAlert ? "var(--red-alert)" : "var(--green-ok)",
              }}
            />
          </div>
          <div className="min-w-0">
            <h1
              className="font-bold leading-none truncate"
              style={{ fontSize: 15, color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              CradleSense
            </h1>
            <p className="mono truncate mt-0.5" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>
              Neonatal Monitoring Dashboard
            </p>
          </div>
        </div>

        {/* ── Center: Data source chip ── */}
        <div className="hidden lg:flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}
          >
            <span className="mono uppercase tracking-wider" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
              DATA SOURCE
            </span>
            <span
              className="mono font-bold"
              style={{ fontSize: 10, color: dataSource === "LIVE" ? "var(--green-ok)" : dataSource === "SIMULATION" ? "var(--indigo-accent)" : "var(--amber-warn)" }}
            >
              {dataSource}
            </span>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}
          >
            <span className="mono uppercase tracking-wider" style={{ fontSize: 8.5, color: "var(--text-faint)" }}>
              PROTOCOL
            </span>
            <span className="mono font-bold" style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              HTTP POST
            </span>
          </div>
        </div>

        {/* ── Right: Alert badge + Theme toggle + Clock ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Alert indicator */}
          {hasAlert && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full alert-banner-appear"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)" }}
            >
              <AlertTriangle size={12} style={{ color: "var(--red-alert)" }} />
              <span className="font-bold tracking-wide" style={{ fontSize: 10, color: "var(--red-alert)", letterSpacing: "0.05em" }}>
                {totalActiveAlerts} ALARM{totalActiveAlerts > 1 ? "S" : ""}
              </span>
              <span
                className="inline-flex rounded-full"
                style={{ width: 6, height: 6, background: "var(--red-alert)", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }}
              />
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center rounded-xl p-2 transition-all cursor-pointer"
            style={{ width: 34, height: 34, background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: "var(--text-secondary)" }}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark/light theme"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-sky-600" />}
          </button>

          {/* Clock */}
          <div className="hidden md:flex flex-col items-end" style={{ lineHeight: 1.15 }}>
            <span className="mono font-semibold" style={{ fontSize: 13, color: "var(--text-primary)" }}>
              {wallClock}
            </span>
            <span className="mono" style={{ fontSize: 9, color: "var(--text-muted)" }}>
              {wallDate}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
