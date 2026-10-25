// =============================================================
// SettingsPage.jsx — CradleSense
//
// CORRECTIONS FROM ORIGINAL:
// - LM35 card replaced with MLX90614 (correct sensor)
// - TLS/AES-128 security claim removed
// - Sensor interfaces: I²C for MAX30102 + MLX90614 (not ADC1 LM35)
// - Thresholds save propagates to AppContext (not local-only)
// - Data source selector added
// - Thresholds labelled as demonstration/unvalidated
// =============================================================

import { useState } from "react";
import {
  Settings, Cpu, Wifi, Thermometer, Heart, Droplets,
  CheckCircle, RotateCcw, Save, Database, FlaskConical,
  Sun, Moon,
} from "lucide-react";
import { useApp, DATA_SOURCE } from "../context/AppContext";
import { ALERT_THRESHOLDS } from "../data/demoData";

function ThresholdRow({ label, param, field, value, unit, color, onChange }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex items-center justify-center rounded-lg"
          style={{ width: 30, height: 30, background: `${color}15`, color, border: `1px solid ${color}30` }}
        >
          {param === "hr"   ? <Heart size={14} />
          : param === "spo2" ? <Droplets size={14} />
          : <Thermometer size={14} />}
        </span>
        <div>
          <div className="font-semibold" style={{ fontSize: 12.5, color: "var(--text-primary)" }}>{label}</div>
          <div className="mono mt-0.5" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>Unit: {unit}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(field, Number(e.target.value))}
          className="mono font-bold text-right rounded-lg px-3 py-1.5"
          style={{ width: 84, background: "var(--panel-bg)", border: `1px solid ${color}40`, color, fontSize: 13, outline: "none" }}
        />
        <span className="mono font-semibold" style={{ fontSize: 10, color: "var(--text-muted)" }}>{unit}</span>
      </div>
    </div>
  );
}

function SettingsPage({ theme, onToggleTheme }) {
  const { dataSource, setDataSource, thresholds, setThresholds } = useApp();
  const [localThresholds, setLocalThresholds] = useState({ ...thresholds });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, val) => {
    setLocalThresholds((prev) => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    setThresholds({ ...localThresholds });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setLocalThresholds({ ...ALERT_THRESHOLDS });
    setSaved(false);
  };

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* Page header */}
      <div className="glass-panel px-6 py-4 flex items-center gap-3.5">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 42, height: 42, background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.25)" }}>
          <Settings size={20} className="text-slate-400" />
        </div>
        <div>
          <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
            System Configuration
          </h2>
          <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
            Data source, demonstration thresholds, and hardware reference
          </p>
        </div>
      </div>

      {/* ── Data Source ── */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #6366f1, #38bdf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Data Source
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <div className="glass-panel p-5">
        <div className="font-semibold mb-3" style={{ fontSize: 13, color: "var(--text-primary)" }}>
          Select Monitoring Data Source
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              key:   DATA_SOURCE.SIMULATION,
              icon:  <FlaskConical size={16} />,
              label: "Simulation Mode",
              desc:  "Synthetic demonstration data generated locally. No hardware required.",
              color: "var(--indigo-accent)",
              bg:    "rgba(129,140,248,0.08)",
              border:"rgba(129,140,248,0.22)",
            },
            {
              key:   DATA_SOURCE.DATASET,
              icon:  <Database size={16} />,
              label: "Dataset Replay",
              desc:  "Replay pre-recorded demonstration data. Labelled as replay — not live.",
              color: "var(--amber-warn)",
              bg:    "rgba(245,158,11,0.08)",
              border:"rgba(245,158,11,0.22)",
            },
            {
              key:   DATA_SOURCE.LIVE,
              icon:  <Wifi size={16} />,
              label: "Live Hardware",
              desc:  "Real readings from ESP32-S3 via HTTP POST to Node.js backend.",
              color: "var(--green-ok)",
              bg:    "rgba(34,197,94,0.08)",
              border:"rgba(34,197,94,0.22)",
            },
          ].map(({ key, icon, label, desc, color, bg, border }) => {
            const isActive = dataSource === key;
            return (
              <button
                key={key}
                onClick={() => setDataSource(key)}
                className="rounded-xl p-4 text-left cursor-pointer transition-all"
                style={{
                  background: isActive ? bg : "var(--chip-bg)",
                  border:     isActive ? `2px solid ${border}` : "1px solid var(--chip-border)",
                  outline:    "none",
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: isActive ? color : "var(--text-muted)" }}>
                  {icon}
                  <span className="font-bold" style={{ fontSize: 12, color: isActive ? color : "var(--text-primary)" }}>{label}</span>
                </div>
                <div className="mono" style={{ fontSize: 9.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Theme & Appearance ── */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #38bdf8, #818cf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Appearance & Theme
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <div className="glass-panel p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="font-semibold" style={{ fontSize: 13, color: "var(--text-primary)" }}>
            Display Mode
          </div>
          <div className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
            Current interface appearance: <span className="font-bold uppercase" style={{ color: "var(--blue-accent)" }}>{theme || "dark"} mode</span>
          </div>
        </div>
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer"
          style={{
            background: "var(--chip-bg)",
            border: "1px solid var(--chip-border)",
            color: "var(--text-primary)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {theme === "light" ? (
            <>
              <Moon size={15} className="text-indigo-400" />
              <span>Switch to Dark Theme</span>
            </>
          ) : (
            <>
              <Sun size={15} className="text-amber-400" />
              <span>Switch to Light Theme</span>
            </>
          )}
        </button>
      </div>

      {/* ── Thresholds ── */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #f59e0b, #ef4444)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Demonstration Thresholds
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold" style={{ fontSize: 13, color: "var(--text-primary)" }}>
              Physiological Threshold Limits
            </div>
            <p className="mono mt-0.5" style={{ fontSize: 9.5, color: "var(--amber-warn)" }}>
              ⚠ DEMONSTRATION ONLY — These are not clinically validated neonatal reference ranges
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <ThresholdRow label="Heart Rate — Low Limit"      param="hr"   field="hrLow"    value={localThresholds.hrLow}    unit="BPM" color="#ef4444" onChange={handleChange} />
          <ThresholdRow label="Heart Rate — High Limit"     param="hr"   field="hrHigh"   value={localThresholds.hrHigh}   unit="BPM" color="#ef4444" onChange={handleChange} />
          <ThresholdRow label="SpO₂ — Minimum (Estimated)" param="spo2" field="spo2Low"  value={localThresholds.spo2Low}  unit="%"   color="#06b6d4" onChange={handleChange} />
          <ThresholdRow label="Surface Temp — Low Limit"   param="temp" field="tempLow"  value={localThresholds.tempLow}  unit="°C"  color="#f59e0b" onChange={handleChange} />
          <ThresholdRow label="Surface Temp — High Limit"  param="temp" field="tempHigh" value={localThresholds.tempHigh} unit="°C"  color="#f59e0b" onChange={handleChange} />
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold mono cursor-pointer"
            style={{
              background: saved ? "rgba(34,197,94,0.15)" : "rgba(56,189,248,0.12)",
              border:     saved ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(56,189,248,0.3)",
              color:      saved ? "var(--green-ok)" : "var(--blue-accent)",
              fontSize:   11, letterSpacing: "0.05em", transition: "all 0.2s ease",
            }}
          >
            {saved ? <CheckCircle size={14} /> : <Save size={14} />}
            {saved ? "THRESHOLDS APPLIED" : "APPLY THRESHOLDS"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg mono font-bold cursor-pointer"
            style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: "var(--text-muted)", fontSize: 11 }}
          >
            <RotateCcw size={13} />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* ── Hardware Reference ── */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #38bdf8, #818cf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Hardware Reference
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon:  <Cpu size={18} style={{ color: "#38bdf8" }} />,
            title: "ESP32-S3 Mini Microcontroller",
            color: "#38bdf8",
            items: [
              ["Core Architecture",  "Dual-core Xtensa 32-bit LX7"],
              ["Clock Frequency",    "240 MHz"],
              ["Sensor Interfaces",  "I²C Bus (MAX30102 + MLX90614)"],
              ["Connectivity",       "2.4 GHz Wi-Fi (802.11 b/g/n)"],
              ["Data Protocol",      "HTTP POST to Node.js backend"],
            ],
          },
          {
            icon:  <Heart size={18} style={{ color: "#ef4444" }} />,
            title: "MAX30102 Optical Sensor",
            color: "#ef4444",
            items: [
              ["Measurement Mode",   "Dual LED (Red 660 nm + IR 880 nm)"],
              ["Communication",      "I²C Standard/Fast Mode (400 kHz)"],
              ["Output",             "Raw PPG → HR & estimated SpO₂"],
              ["Sampling Rate",      "Algorithm-dependent from raw ADC"],
              ["Note",               "SpO₂ is estimated, not clinical-grade"],
            ],
          },
          {
            icon:  <Thermometer size={18} style={{ color: "#f59e0b" }} />,
            title: "MLX90614 IR Temperature Sensor",
            color: "#f59e0b",
            items: [
              ["Measurement Type",   "Non-contact infrared thermometry"],
              ["Temperature Output", "Surface temperature (not core body)"],
              ["Communication",      "I²C (SMBus)"],
              ["Field of View",      "~90° (subject to placement)"],
              ["Note",               "Not a clinical-grade thermometer"],
            ],
          },
          {
            icon:  <Wifi size={18} style={{ color: "#22c55e" }} />,
            title: "IoT Gateway & Transmission",
            color: "#22c55e",
            items: [
              ["Data Protocol",      "HTTP POST (not MQTT or WebSocket)"],
              ["Backend",            "Node.js Express server"],
              ["Endpoint",           "POST /api/data"],
              ["Frontend Updates",   "Polling / SSE (configurable)"],
              ["Note",               "TLS not verified in this prototype"],
            ],
          },
        ].map(({ icon, title, color, items }) => (
          <div key={title} className="glass-panel p-4">
            <div className="flex items-center gap-2.5 mb-3" style={{ borderBottom: "1px solid var(--panel-border)", paddingBottom: 10 }}>
              <span className="flex items-center justify-center rounded-xl" style={{ width: 34, height: 34, background: `${color}15`, border: `1px solid ${color}30` }}>
                {icon}
              </span>
              <span className="font-bold" style={{ fontSize: 13, color: "var(--text-primary)" }}>{title}</span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="mono uppercase" style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.06em" }}>{k}</span>
                  <span className="mono font-semibold" style={{ fontSize: 10, color: "var(--text-secondary)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── App Info ── */}
      <div className="glass-panel p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Application",  value: "CradleSense NICU Monitor" },
            { label: "Version",      value: "Research Build" },
            { label: "Hardware",     value: "ESP32-S3 + MAX30102 + MLX90614" },
            { label: "Beds",         value: "6 (demonstration)" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-3 rounded-xl" style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}>
              <div className="mono uppercase" style={{ fontSize: 8.5, color: "var(--text-muted)", letterSpacing: "0.07em" }}>{label}</div>
              <div className="font-bold mono mt-1" style={{ fontSize: 11, color: "var(--text-primary)" }}>{value}</div>
            </div>
          ))}
        </div>
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2 mono"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", fontSize: 10, color: "var(--amber-warn)" }}
        >
          <span className="font-semibold">Neonatal ICU Continuous Monitoring System using Wearable IoT (NCMS)</span>
          <span>RESEARCH PROTOTYPE — NOT FOR CLINICAL USE</span>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
