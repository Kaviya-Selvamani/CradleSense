// =============================================================
// HistoryPage.jsx — CradleSense
// Paginated history table with bed selector and data source label.
// =============================================================

import { useState } from "react";
import { History, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BED_CONFIGS, BED_IDS } from "../data/bedConfig";

const PAGE_SIZE = 20;

function getStatus(row, t) {
  if (row.hr == null && row.spo2 == null && row.temp == null) return "NO DATA";
  if (
    (row.hr   != null && (row.hr   < t.hrLow  || row.hr   > t.hrHigh))  ||
    (row.spo2 != null && row.spo2 < t.spo2Low)                           ||
    (row.temp != null && (row.temp < t.tempLow || row.temp > t.tempHigh))
  ) return "ALERT";
  return "NOMINAL";
}

function StatusBadge({ status }) {
  const map = {
    ALERT:   { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.30)",  color: "var(--red-alert)",  dot: "var(--red-alert)"  },
    NOMINAL: { bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.22)",  color: "var(--green-ok)",   dot: "var(--green-ok)"   },
    "NO DATA":{ bg: "var(--chip-bg)",      border: "var(--chip-border)",    color: "var(--text-muted)", dot: "var(--text-faint)" },
  };
  const s = map[status] || map.NOMINAL;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mono font-bold"
      style={{ fontSize: 8.5, background: s.bg, border: `1px solid ${s.border}`, color: s.color, letterSpacing: "0.06em", whiteSpace: "nowrap" }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", display: "inline-block", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function HistoryPage() {
  const { beds, thresholds, dataSource } = useApp();
  const [selectedBed, setSelectedBed] = useState(BED_IDS[0]);
  const [showPicker,  setShowPicker]   = useState(false);
  const [page,        setPage]         = useState(0);

  const bed = beds[selectedBed];
  const cfg = BED_CONFIGS[selectedBed];

  // Merge HR/SpO2/Temp chart arrays into unified row list
  const chartHr   = bed?.chartHr   || [];
  const chartSpo2 = bed?.chartSpo2 || [];
  const chartTemp = bed?.chartTemp  || [];

  const rows = chartHr.map((pt, i) => ({
    time:   pt.time,
    hr:     pt.hr ?? null,
    spo2:   chartSpo2[i]?.spo2 ?? null,
    temp:   chartTemp[i]?.temp ?? null,
    source: dataSource,
  })).reverse(); // newest first

  const annotated  = rows.map((row) => ({ ...row, status: getStatus(row, thresholds) }));
  const totalPages = Math.max(1, Math.ceil(annotated.length / PAGE_SIZE));
  const pageData   = annotated.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const alertRecords  = annotated.filter((r) => r.status === "ALERT").length;
  const totalRecords  = annotated.length;

  return (
    <div className="flex flex-col gap-5 fade-in">

      {/* Page header */}
      <div className="glass-panel px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 42, height: 42, background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.25)" }}
          >
            <History size={20} className="text-indigo-500" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide" style={{ fontSize: 16, color: "var(--text-primary)" }}>
              Session History
            </h2>
            <p className="mono mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
              {cfg?.label} · {totalRecords} records · Source: {dataSource}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <span className="mono font-bold" style={{ fontSize: 11, color: "var(--red-alert)" }}>{alertRecords}</span>
            <span className="mono" style={{ fontSize: 9.5, color: "var(--red-alert)" }}> ALERTS</span>
          </div>

          {/* Bed picker */}
          <div className="relative">
            <button
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg mono font-bold cursor-pointer"
              style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: "var(--text-primary)", fontSize: 10 }}
            >
              {cfg?.label}
              <ChevronDown size={12} />
            </button>
            {showPicker && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-50"
                style={{ background: "var(--panel-bg)", border: "1px solid var(--panel-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", minWidth: 150 }}
              >
                {BED_IDS.map((bid) => (
                  <button
                    key={bid}
                    onClick={() => { setSelectedBed(bid); setPage(0); setShowPicker(false); }}
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
      </div>

      {/* Section divider */}
      <div className="flex items-center gap-3">
        <div className="h-4 rounded-full" style={{ width: 3, background: "linear-gradient(180deg, #818cf8, #6366f1)" }} />
        <span className="font-bold uppercase tracking-widest" style={{ fontSize: 10.5, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Records · Page {page + 1} of {totalPages}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--panel-border)" }} />
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden flex flex-col">
        {annotated.length === 0 ? (
          <div className="flex items-center justify-center py-16 mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>
            No readings recorded yet for {cfg?.label}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: "collapse" }}>
                <thead style={{ background: "var(--table-header-bg)", backdropFilter: "blur(8px)" }}>
                  <tr style={{ borderBottom: "1px solid var(--table-border)" }}>
                    {["#", "Timestamp", "Heart Rate (BPM)", "SpO₂ (%)", "Surface Temp (°C)", "Source", "Status"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 uppercase tracking-wider text-${i >= 2 && i <= 4 ? "right" : i >= 5 ? "center" : "left"}`}
                        style={{ fontSize: 8.5, color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, idx) => {
                    const globalIdx = page * PAGE_SIZE + idx + 1;
                    return (
                      <tr
                        key={`${row.time}-${idx}`}
                        className="data-row"
                        style={{
                          borderBottom: "1px solid var(--table-border)",
                          background:   row.status === "ALERT" ? "rgba(239,68,68,0.03)" : idx % 2 === 1 ? "var(--table-row-alt)" : "transparent",
                        }}
                      >
                        <td className="px-5 py-3 mono" style={{ fontSize: 10, color: "var(--text-faint)" }}>{globalIdx}</td>
                        <td className="px-5 py-3 mono" style={{ fontSize: 10.5, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{row.time}</td>
                        <td className="px-5 py-3 mono font-bold text-right" style={{ fontSize: 11.5, color: "#ef4444" }}>
                          {row.hr != null ? row.hr : "—"}
                        </td>
                        <td className="px-5 py-3 mono font-bold text-right" style={{ fontSize: 11.5, color: "#06b6d4" }}>
                          {row.spo2 != null ? `${row.spo2}%` : "—"}
                        </td>
                        <td className="px-5 py-3 mono font-bold text-right" style={{ fontSize: 11.5, color: "#f59e0b" }}>
                          {row.temp != null ? `${Number(row.temp).toFixed(1)}°` : "—"}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="mono font-bold px-1.5 py-0.5 rounded" style={{ fontSize: 8, color: row.source === "LIVE" ? "var(--green-ok)" : row.source === "SIMULATION" ? "var(--indigo-accent)" : "var(--amber-warn)", background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}>
                            {row.source?.slice(0, 4)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid var(--panel-border)" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                Showing {Math.min(page * PAGE_SIZE + 1, totalRecords)}–{Math.min((page + 1) * PAGE_SIZE, totalRecords)} of {totalRecords}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg mono font-bold cursor-pointer"
                  style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: page === 0 ? "var(--text-faint)" : "var(--text-primary)", fontSize: 10, opacity: page === 0 ? 0.4 : 1 }}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <span className="mono font-bold px-2" style={{ fontSize: 10, color: "var(--text-muted)" }}>{page + 1} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg mono font-bold cursor-pointer"
                  style={{ background: "var(--chip-bg)", border: "1px solid var(--chip-border)", color: page >= totalPages - 1 ? "var(--text-faint)" : "var(--text-primary)", fontSize: 10, opacity: page >= totalPages - 1 ? 0.4 : 1 }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
