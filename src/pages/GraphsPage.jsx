// =============================================================
// GraphsPage.jsx — CradleSense
// Historical trend charts for selected bed.
// Corrected: sensor labels use MLX90614, not LM35.
// Unique chart IDs prevent SVG gradient conflicts.
// =============================================================

import { useState } from "react";
import { LineChart as LineChartIcon, ChevronDown } from "lucide-react";
import VitalChart from "../components/VitalChart";
import { useApp } from "../context/AppContext";
import { BED_CONFIGS, BED_IDS } from "../data/bedConfig";

function GraphsPage() {
  const { beds, selectedBed, setSelectedBed, thresholds, dataSource } = useApp();
  const [showBedPicker, setShowBedPicker] = useState(false);

  const bed = beds[selectedBed];
  const cfg = BED_CONFIGS[selectedBed];

  const refLinesHr   = [
    { y: thresholds.hrHigh,  stroke: "#ef4444", dash: "4 3", label: `High ${thresholds.hrHigh}` },
    { y: thresholds.hrLow,   stroke: "#f59e0b", dash: "4 3", label: `Low ${thresholds.hrLow}`   },
  ];
  const refLinesSpo2 = [
    { y: thresholds.spo2Low, stroke: "#ef4444", dash: "4 3", label: `Low ${thresholds.spo2Low}%` },
  ];
  const refLinesTemp = [
    { y: thresholds.tempHigh,stroke: "#ef4444", dash: "4 3", label: `High ${thresholds.tempHigh}°C` },
    { y: thresholds.tempLow, stroke: "#f59e0b", dash: "4 3", label: `Low ${thresholds.tempLow}°C`   },
  ];

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* Page header */}
      <div className="glass-panel px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 42, height: 42, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)" }}
          >
            <LineChartIcon size={20} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
              Trend Charts
            </h2>
            <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {cfg?.label} · {(bed?.chartHr || []).length} data points · {dataSource}
            </p>
          </div>
        </div>

        {/* Bed selector */}
        <div className="relative">
          <button
            onClick={() => setShowBedPicker((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl mono font-bold cursor-pointer"
            style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: "var(--text-primary)", fontSize: 11 }}
          >
            {cfg?.label || "Select Bed"}
            <ChevronDown size={13} />
          </button>
          {showBedPicker && (
            <div
              className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
              style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 160 }}
            >
              {BED_IDS.map((bid) => (
                <button
                  key={bid}
                  onClick={() => { setSelectedBed(bid); setShowBedPicker(false); }}
                  className="w-full text-left px-4 py-2.5 cursor-pointer"
                  style={{
                    background: bid === selectedBed ? "rgba(56,189,248,0.10)" : "transparent",
                    color:      bid === selectedBed ? "var(--blue-accent)" : "var(--text-secondary)",
                    fontSize:   12,
                    fontWeight: bid === selectedBed ? 600 : 400,
                    borderBottom: "1px solid var(--panel-border)",
                  }}
                >
                  {BED_CONFIGS[bid].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heart Rate */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #ef4444, #f87171)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Heart Rate
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>MAX30102 PPG · BPM</span>
      </div>
      <VitalChart
        param="hr"
        data={bed?.chartHr || []}
        chartId={`${selectedBed}-graphs-hr`}
        refLines={refLinesHr}
      />

      {/* SpO₂ */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #06b6d4, #38bdf8)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Estimated SpO₂
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>MAX30102 RED/IR · %</span>
      </div>
      <VitalChart
        param="spo2"
        data={bed?.chartSpo2 || []}
        chartId={`${selectedBed}-graphs-spo2`}
        refLines={refLinesSpo2}
      />

      {/* Surface Temperature */}
      <div className="flex items-center gap-3 mt-1">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #f59e0b, #fbbf24)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Surface Temperature
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
        <span className="mono" style={{ fontSize: 9.5, color: "var(--text-muted)" }}>MLX90614 IR · °C</span>
      </div>
      <VitalChart
        param="temp"
        data={bed?.chartTemp || []}
        chartId={`${selectedBed}-graphs-temp`}
        refLines={refLinesTemp}
      />

      {/* Footer */}
      <div
        className="rounded-xl px-5 py-3 mono flex items-center justify-between flex-wrap gap-2"
        style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", fontSize: 9.5, color: "var(--text-muted)", marginTop: 4 }}
      >
        <span>Recharts SVG · CradleSense Trend Viewer</span>
        <span style={{ color: "var(--amber-warn)" }}>Reference lines are demonstration thresholds only — not clinical limits</span>
        <span>{cfg?.label}</span>
      </div>
    </div>
  );
}

export default GraphsPage;
