// =============================================================
// VitalChart.jsx — CradleSense
// Time-series area chart for HR / SpO₂ / Surface Temperature.
//
// CORRECTIONS FROM ORIGINAL:
// - Gradient IDs now scoped per chart via `chartId` prop to prevent
//   SVG gradient conflicts when multiple charts render simultaneously.
// - "BODY TEMPERATURE" label → "SURFACE TEMPERATURE"
// - Reference lines configurable (not hardcoded demo thresholds)
// - Shows "No data" state when data array is empty
// - Gaps in data are handled via null values (connectNulls=false)
// =============================================================

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

function buildParamStyle(chartId) {
  return {
    hr: {
      color:      "#ef4444",
      gradientId: `${chartId}-hr`,
      label:      "HEART RATE",
      unit:       "BPM",
      dataKey:    "hr",
      domain:     ["auto", "auto"],
    },
    spo2: {
      color:      "#06b6d4",
      gradientId: `${chartId}-spo2`,
      label:      "SpO₂ (ESTIMATED)",
      unit:       "%",
      dataKey:    "spo2",
      domain:     [80, 100],
    },
    temp: {
      color:      "#f59e0b",
      gradientId: `${chartId}-temp`,
      label:      "SURFACE TEMPERATURE",
      unit:       "°C",
      dataKey:    "temp",
      domain:     ["auto", "auto"],
    },
  };
}

function CustomTooltip({ active, payload, label, unit, color }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div
      style={{
        background:    "var(--panel-bg)",
        border:        `1px solid ${color}60`,
        borderRadius:  10,
        padding:       "8px 14px",
        backdropFilter:"blur(12px)",
        boxShadow:     "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <p className="mono" style={{ color: "var(--text-muted)", marginBottom: 4, fontSize: 10 }}>
        {label}
      </p>
      <p className="mono font-bold" style={{ color, fontSize: 14 }}>
        {val !== undefined && val !== null
          ? (unit === "°C" ? Number(val).toFixed(1) : val)
          : "—"}
        {" "}
        <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>{unit}</span>
      </p>
    </div>
  );
}

function VitalChart({
  param,
  data = [],
  compact   = false,
  chartId   = "chart",
  refLines  = [],
}) {
  const PARAM_STYLE = buildParamStyle(chartId);
  const style = PARAM_STYLE[param];
  if (!style) return null;

  const chartHeight = compact ? 135 : 175;
  const hasData     = data.length > 0;

  return (
    <div
      className="glass-panel p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{ minHeight: compact ? 190 : 235 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-block rounded-full flex-shrink-0"
            style={{ width: 8, height: 8, background: style.color }}
          />
          <span
            className="font-bold tracking-widest uppercase"
            style={{ fontSize: 11, color: "var(--text-primary)", letterSpacing: "0.07em" }}
          >
            {style.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {refLines.length > 0 && (
            <div className="hidden sm:flex items-center gap-3">
              {refLines.map((ref) => (
                <span
                  key={ref.y}
                  className="mono flex items-center gap-1.5"
                  style={{ fontSize: 9.5, color: ref.stroke }}
                >
                  <span style={{ display: "inline-block", width: 12, height: 1, background: ref.stroke, borderTop: `1px dashed ${ref.stroke}` }} />
                  {ref.label}
                </span>
              ))}
            </div>
          )}
          <span
            className="mono px-2 py-0.5 rounded"
            style={{ fontSize: 9, color: "var(--text-muted)", background: "var(--chip-bg)", border: "1px solid var(--chip-border)" }}
          >
            {data.length} PTS
          </span>
        </div>
      </div>

      {/* Empty state */}
      {!hasData ? (
        <div
          className="flex items-center justify-center flex-1 mono"
          style={{ height: chartHeight, color: "var(--text-muted)", fontSize: 11 }}
        >
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id={style.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={style.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={style.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--chart-grid)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "var(--chart-tick)", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={{ stroke: "var(--panel-border)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={style.domain}
              tick={{ fill: "var(--chart-tick)", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              width={38}
            />

            <Tooltip
              content={<CustomTooltip unit={style.unit} color={style.color} />}
            />

            {refLines.map((ref) => (
              <ReferenceLine
                key={ref.y}
                y={ref.y}
                stroke={ref.stroke}
                strokeDasharray={ref.dash || "4 3"}
                strokeWidth={1}
                label={{
                  value:      ref.label,
                  position:   "insideTopRight",
                  fontSize:   8,
                  fill:       ref.stroke,
                  fontFamily: "JetBrains Mono, monospace",
                  dx: -4,
                }}
              />
            ))}

            <Area
              type="monotone"
              dataKey={style.dataKey}
              stroke={style.color}
              strokeWidth={2}
              fill={`url(#${style.gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: style.color, strokeWidth: 0 }}
              isAnimationActive={false}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default VitalChart;
