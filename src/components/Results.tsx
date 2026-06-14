import { useMemo } from "react";
import { calcTotal, getBreakdown, parisGap, BENCHMARKS } from "../utils/emissions";
import type { Emissions, EmissionBreakdown, ParisGapResult } from "../types";

interface ResultsProps {
  emissions: Emissions;
}

interface DonutChartProps {
  breakdown: EmissionBreakdown;
  total: number;
}

interface LegendRowProps {
  meta: { label: string; emoji: string; color: string };
  kg: number;
  pct: number;
}

interface ParisCardProps {
  gap: ParisGapResult;
  total: number;
}

interface ComparisonCardProps {
  total: number;
}

const CATEGORY_META = {
  transport: { label: "Transport", emoji: "🚗", color: "#16a34a" },
  energy:    { label: "Energy",    emoji: "⚡", color: "#0ea5e9" },
  food:      { label: "Food",      emoji: "🥗", color: "#f59e0b" },
  shopping:  { label: "Shopping",  emoji: "🛍️", color: "#8b5cf6" },
} as const;

export default function Results({ emissions }: ResultsProps) {
  const total = calcTotal(emissions);
  const breakdown = useMemo(
    () =>
      getBreakdown(
        emissions.transport,
        emissions.energy,
        emissions.food,
        emissions.shopping
      ),
    [emissions]
  );
  const gap = useMemo(() => parisGap(total), [total]);
  const tCO2 = (total / 1000).toFixed(2);

  return (
    <div
      className="section"
      style={{ background: "#fff", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span
            className="badge badge-green"
            style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}
          >
            Step 2 — Your results
          </span>
          <h2 id="results-heading">Your carbon footprint</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
          className="results-grid"
        >
          <div
            className="card card-elevated"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-6)",
              padding: "var(--space-8)",
            }}
          >
            <DonutChart breakdown={breakdown} total={total} />

            <div style={{ width: "100%" }}>
              {(
                Object.entries(CATEGORY_META) as [
                  keyof typeof CATEGORY_META,
                  (typeof CATEGORY_META)[keyof typeof CATEGORY_META]
                ][]
              ).map(([key, meta]) => (
                <LegendRow
                  key={key}
                  meta={meta}
                  kg={emissions[key]}
                  pct={breakdown[key]}
                />
              ))}
            </div>

            <div
              style={{
                textAlign: "center",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--color-border)",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color:
                    total > 4700
                      ? "#dc2626"
                      : total > 1800
                      ? "#f59e0b"
                      : "var(--green-600)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {tCO2}t
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--gray-500)",
                  marginTop: "var(--space-1)",
                }}
              >
                CO₂e per year
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
          >
            <ParisCard gap={gap} total={total} />
            <ComparisonCard total={total} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function DonutChart({ breakdown, total }: DonutChartProps) {
  const size = 220;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const segments = (
    Object.entries(CATEGORY_META) as [
      keyof typeof CATEGORY_META,
      (typeof CATEGORY_META)[keyof typeof CATEGORY_META]
    ][]
  ).map(([key, meta]) => ({
    key,
    color: meta.color,
    pct: breakdown[key] ?? 0,
  }));

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circumference;
    const gap = circumference - dash;
    const rotation = (offset / 100) * 360 - 90;
    offset += seg.pct;
    return { ...seg, dash, gap, rotation };
  });

  return (
    <div
      className="donut-wrapper"
      role="img"
      aria-label={`Emissions breakdown donut chart. Total: ${(
        total / 1000
      ).toFixed(2)} tonnes CO₂e per year`}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--gray-100)"
          strokeWidth={28}
        />
        {arcs.map((arc) =>
          arc.pct > 0 ? (
            <circle
              key={arc.key}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={28}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeLinecap="butt"
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          ) : null
        )}
      </svg>
      <div className="donut-label">
        <span className="total">{(total / 1000).toFixed(1)}t</span>
        <span className="unit">CO₂e / yr</span>
      </div>
    </div>
  );
}

function LegendRow({ meta, kg, pct }: LegendRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-2) 0",
        borderBottom: "1px solid var(--gray-100)",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: meta.color,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
      <span style={{ fontSize: "0.875rem", color: "var(--gray-600)", flex: 1 }}>
        {meta.emoji} {meta.label}
      </span>
      <span
        style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gray-800)" }}
      >
        {(kg / 1000).toFixed(2)}t
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--gray-400)",
          minWidth: "2.5rem",
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function ParisCard({ gap, total }: ParisCardProps) {
  const pct = Math.min(100, Math.round((500 / total) * 100));

  return (
    <div
      className="card"
      style={{ borderColor: gap.onTrack ? "var(--green-300)" : "var(--gray-200)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "var(--space-4)",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-1)" }}>
            🎯 Paris 2050 Gap
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--gray-500)" }}>
            Target: 500 kg CO₂e / person / year
          </p>
        </div>
        {gap.onTrack ? (
          <span className="badge badge-low">On track ✓</span>
        ) : (
          <span className="badge badge-high">-{gap.reductionNeeded}% needed</span>
        )}
      </div>

      <div className="progress-track" style={{ marginBottom: "var(--space-3)" }}>
        <div
          className="progress-bar"
          style={{
            width: `${pct}%`,
            background: gap.onTrack ? "var(--green-500)" : "var(--gray-300)",
          }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of the way to the Paris 2050 target`}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--gray-400)",
        }}
      >
        <span>0 kg</span>
        <span style={{ color: "var(--green-600)", fontWeight: 600 }}>
          Target: 500 kg
        </span>
        <span>{(total / 1000).toFixed(1)}t (you)</span>
      </div>

      {!gap.onTrack && (
        <p
          style={{
            marginTop: "var(--space-4)",
            fontSize: "0.875rem",
            color: "var(--gray-600)",
            padding: "var(--space-3)",
            background: "var(--gray-50)",
            borderRadius: "var(--radius-sm)",
            lineHeight: 1.6,
          }}
        >
          You need to reduce your footprint by{" "}
          <strong>{(gap.gap / 1000).toFixed(2)}t CO₂e</strong> to reach the
          Paris 2050 target. Check your personalised action plan below.
        </p>
      )}
    </div>
  );
}

function ComparisonCard({ total }: ComparisonCardProps) {
  const entries = [
    { label: "You",       value: total,               highlight: true  },
    { label: "🇮🇳 India",  value: BENCHMARKS.india,    highlight: false },
    { label: "🌍 World",   value: BENCHMARKS.world,    highlight: false },
    { label: "🇨🇳 China",  value: BENCHMARKS.china,    highlight: false },
    { label: "🇬🇧 UK",     value: BENCHMARKS.uk,       highlight: false },
    { label: "🇺🇸 USA",    value: BENCHMARKS.usa,      highlight: false },
  ];

  const max = Math.max(...entries.map((e) => e.value));

  return (
    <div className="card">
      <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)" }}>
        🌐 Global comparison
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {entries.map(({ label, value, highlight }) => {
          const pct = Math.round((value / max) * 100);
          const tVal = (value / 1000).toFixed(2);
          return (
            <div key={label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8125rem",
                  marginBottom: "var(--space-1)",
                  fontWeight: highlight ? 700 : 400,
                  color: highlight ? "var(--gray-900)" : "var(--gray-600)",
                }}
              >
                <span>{label}</span>
                <span>{tVal}t</span>
              </div>
              <div
                className="progress-track"
                style={{ height: highlight ? 10 : 7 }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${pct}%`,
                    background: highlight
                      ? value > BENCHMARKS.world
                        ? "#ef4444"
                        : "var(--green-500)"
                      : "var(--gray-300)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
