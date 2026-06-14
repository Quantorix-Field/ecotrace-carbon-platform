import { useMemo, useState } from "react";
import { generateInsights, totalPotentialSaving } from "../utils/insights";
import { calcTotal } from "../utils/emissions";
import type { Emissions, TransportInputs, EnergyInputs, FoodInputs, ShoppingInputs, Action, ImpactLevel } from "../types";

interface InsightsProps {
  transportInputs: Partial<TransportInputs>;
  energyInputs: Partial<EnergyInputs>;
  foodInputs: Partial<FoodInputs>;
  shoppingInputs: Partial<ShoppingInputs>;
  emissions: Emissions;
}

interface SummaryTileProps {
  emoji: string;
  value: string | number;
  label: string;
  bg: string;
  light?: boolean;
}

interface ActionCardProps {
  action: Action;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

interface MetaPillProps {
  label: string;
  value: string;
}

type FilterValue = "all" | ImpactLevel | "immediate";

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all",       label: "All actions"   },
  { value: "high",      label: "High impact"   },
  { value: "medium",    label: "Medium impact" },
  { value: "low",       label: "Low impact"    },
  { value: "immediate", label: "Do it now"     },
];

const EFFORT_LABEL: Record<string, { text: string; color: string }> = {
  low:    { text: "Easy",     color: "var(--green-600)" },
  medium: { text: "Moderate", color: "var(--gray-500)"  },
  high:   { text: "Effort",   color: "var(--high-text)" },
};

export default function Insights({
  transportInputs,
  energyInputs,
  foodInputs,
  shoppingInputs,
  emissions,
}: InsightsProps) {
  const [filter, setFilter]     = useState<FilterValue>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const allInsights = useMemo(
    () => generateInsights(transportInputs, energyInputs, foodInputs, shoppingInputs),
    [transportInputs, energyInputs, foodInputs, shoppingInputs]
  );

  const filtered = useMemo(() => {
    if (filter === "all")       return allInsights;
    if (filter === "immediate") return allInsights.filter((a) => a.timeframe === "immediate");
    return allInsights.filter((a) => a.impact === filter);
  }, [allInsights, filter]);

  const potentialSaving = useMemo(() => totalPotentialSaving(allInsights), [allInsights]);
  const total = calcTotal(emissions);
  const savingPct = total > 0 ? Math.round((potentialSaving / total) * 100) : 0;

  if (allInsights.length === 0) {
    return (
      <div
        className="section"
        style={{ background: "var(--green-50)", borderTop: "1px solid var(--color-border)" }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🌱</span>
          <h2 id="insights-heading" style={{ marginTop: "var(--space-4)" }}>
            Your footprint looks good!
          </h2>
          <p style={{ maxWidth: "48ch", marginInline: "auto", marginTop: "var(--space-3)" }}>
            Based on your inputs, you're already well below average. Keep it up —
            and check back as your lifestyle changes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="section"
      style={{ background: "var(--green-50)", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span
            className="badge badge-green"
            style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}
          >
            Step 3 — Your action plan
          </span>
          <h2 id="insights-heading">Personalised recommendations</h2>
          <p style={{ maxWidth: "54ch", marginInline: "auto", marginTop: "var(--space-3)" }}>
            Ranked by impact. Implement all of these and you could cut your
            footprint by up to{" "}
            <strong style={{ color: "var(--green-700)" }}>
              {(potentialSaving / 1000).toFixed(2)}t CO₂e ({savingPct}%)
            </strong>{" "}
            per year.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
          className="insights-summary"
        >
          <SummaryTile emoji="🎯" value={allInsights.length}                                          label="actions identified"      bg="#fff"             />
          <SummaryTile emoji="💚" value={`${(potentialSaving / 1000).toFixed(1)}t`}                  label="potential annual saving" bg="var(--green-600)" light />
          <SummaryTile emoji="⚡" value={allInsights.filter((a) => a.timeframe === "immediate").length} label="you can start today"   bg="#fff"             />
        </div>

        <div
          style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", flexWrap: "wrap" }}
          role="group"
          aria-label="Filter recommendations by impact"
        >
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-ghost"}`}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "var(--space-10)", color: "var(--gray-500)" }}
          >
            No actions match this filter for your current inputs.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filtered.map((action, i) => (
              <ActionCard
                key={action.id}
                action={action}
                index={i}
                isExpanded={expanded === action.id}
                onToggle={() =>
                  setExpanded((prev) => (prev === action.id ? null : action.id))
                }
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .insights-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SummaryTile({ emoji, value, label, bg, light }: SummaryTileProps) {
  return (
    <div
      className="card"
      style={{ background: bg, border: "none", textAlign: "center", padding: "var(--space-5)" }}
    >
      <div style={{ fontSize: "1.75rem", marginBottom: "var(--space-2)" }}>{emoji}</div>
      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: light ? "#fff" : "var(--gray-900)",
          lineHeight: 1,
          marginBottom: "var(--space-1)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.8125rem", color: light ? "var(--green-100)" : "var(--gray-500)" }}>
        {label}
      </div>
    </div>
  );
}

function ActionCard({ action, index, isExpanded, onToggle }: ActionCardProps) {
  const effort = EFFORT_LABEL[action.effort] ?? EFFORT_LABEL.medium;

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${
          action.impact === "high"
            ? "var(--green-500)"
            : action.impact === "medium"
            ? "#f59e0b"
            : "var(--gray-300)"
        }`,
        cursor: "pointer",
        transition: "box-shadow var(--transition-fast)",
        animationDelay: `${index * 50}ms`,
      }}
      onClick={onToggle}
      role="button"
      aria-expanded={isExpanded}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "var(--space-4)",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              marginBottom: "var(--space-2)",
              flexWrap: "wrap",
            }}
          >
            <span className={`badge badge-${action.impact}`}>
              {action.impact} impact
            </span>
            <span style={{ fontSize: "0.75rem", color: effort.color, fontWeight: 600 }}>
              {effort.text}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--gray-400)",
                textTransform: "capitalize",
              }}
            >
              · {action.timeframe.replace("-", " ")}
            </span>
          </div>
          <h4
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--gray-900)",
              lineHeight: 1.4,
            }}
          >
            {action.title}
          </h4>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              background: "var(--green-50)",
              border: "1px solid var(--green-200)",
              borderRadius: "var(--radius-full)",
              padding: "var(--space-1) var(--space-3)",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "var(--green-700)",
              whiteSpace: "nowrap",
            }}
          >
            −{(action.estimatedSaving / 1000).toFixed(2)}t/yr
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: "var(--gray-400)",
              marginTop: "var(--space-1)",
              textAlign: "right",
            }}
          >
            CO₂e saved
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: "var(--space-4)",
            paddingTop: "var(--space-4)",
            borderTop: "1px solid var(--color-border)",
            animation: "fadeIn var(--transition-fast) ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--gray-600)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {action.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              marginTop: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <MetaPill label="Category" value={action.category} />
            <MetaPill label="Effort"   value={action.effort}   />
            <MetaPill label="When"     value={action.timeframe.replace("-", " ")} />
          </div>
        </div>
      )}
    </div>
  );
}

function MetaPill({ label, value }: MetaPillProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: "0.7rem",
          color: "var(--gray-400)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 600,
          color: "var(--gray-700)",
          textTransform: "capitalize",
        }}
      >
        {value}
      </span>
    </div>
  );
}
