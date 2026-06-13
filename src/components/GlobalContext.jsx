import { useState } from "react";
import PropTypes from "prop-types";
import { BENCHMARKS, calcTotal } from "../utils/emissions";

const REGIONS = [
  {
    key:        "india",
    flag:       "🇮🇳",
    name:       "India",
    benchmark:  BENCHMARKS.india,
    population: "1.4B",
    note:       "Low per-capita but rapidly growing. Coal dominates the energy mix at ~70%.",
    color:      "var(--green-600)",
  },
  {
    key:        "world",
    flag:       "🌍",
    name:       "World avg",
    benchmark:  BENCHMARKS.world,
    population: "8.1B",
    note:       "Global average masks huge inequality — top 10% emit ~50% of all emissions.",
    color:      "#0ea5e9",
  },
  {
    key:        "china",
    flag:       "🇨🇳",
    name:       "China",
    benchmark:  BENCHMARKS.china,
    population: "1.4B",
    note:       "Largest total emitter. Per-capita has surpassed the EU due to coal and manufacturing.",
    color:      "#f59e0b",
  },
  {
    key:        "uk",
    flag:       "🇬🇧",
    name:       "United Kingdom",
    benchmark:  BENCHMARKS.uk,
    population: "67M",
    note:       "Significant grid decarbonisation since 2012 — renewables now exceed 50% of generation.",
    color:      "#8b5cf6",
  },
  {
    key:        "usa",
    flag:       "🇺🇸",
    name:       "United States",
    benchmark:  BENCHMARKS.usa,
    population: "335M",
    note:       "High car dependency and large homes drive above-average per-capita emissions.",
    color:      "#ef4444",
  },
  {
    key:        "australia",
    flag:       "🇦🇺",
    name:       "Australia",
    benchmark:  BENCHMARKS.australia,
    population: "26M",
    note:       "Highest per-capita in the G20, driven by coal exports, mining, and long-haul transport.",
    color:      "#f97316",
  },
];

const PARIS_TARGET = 500;

export default function GlobalContext({ emissions, hasCalculated }) {
  const [selected, setSelected] = useState(null);
  const userTotal = calcTotal(emissions);

  const maxVal = Math.max(
    ...REGIONS.map((r) => r.benchmark),
    hasCalculated ? userTotal : 0,
    PARIS_TARGET
  );

  return (
    <div
      className="section"
      style={{ background: "var(--gray-900)", borderTop: "1px solid var(--gray-800)", color: "#fff" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span
            className="badge"
            style={{ background: "var(--gray-800)", color: "var(--green-400)", marginBottom: "var(--space-3)", display: "inline-flex" }}
          >
            Global perspective
          </span>
          <h2 id="global-heading" style={{ color: "#fff" }}>How does the world compare?</h2>
          <p style={{ color: "var(--gray-400)", maxWidth: "54ch", marginInline: "auto", marginTop: "var(--space-3)" }}>
            Per-capita CO₂e emissions by country. Click any country to learn more.
            Data: IEA 2024, World Bank 2023.
          </p>
        </div>

        <div
          className="card"
          style={{ background: "var(--gray-800)", border: "1px solid var(--gray-700)", marginBottom: "var(--space-8)" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }} role="list" aria-label="Per-capita emissions by country">

            {/* Paris target */}
            <div role="listitem">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "var(--space-2)", color: "var(--green-400)", fontWeight: 700 }}>
                <span>🎯 Paris 2050 target</span>
                <span>0.5t</span>
              </div>
              <div className="progress-track" style={{ background: "var(--gray-700)", height: 6 }}>
                <div className="progress-bar" style={{ width: `${Math.round((PARIS_TARGET / maxVal) * 100)}%`, background: "var(--green-400)", height: "100%" }} />
              </div>
            </div>

            {/* User bar */}
            {hasCalculated && (
              <div role="listitem">
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", marginBottom: "var(--space-2)", fontWeight: 700, color: "#fff" }}>
                  <span>👤 You</span>
                  <span>{(userTotal / 1000).toFixed(2)}t</span>
                </div>
                <div className="progress-track" style={{ background: "var(--gray-700)", height: 12 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.round((userTotal / maxVal) * 100)}%`,
                      background: userTotal <= BENCHMARKS.india ? "var(--green-400)" : userTotal <= BENCHMARKS.world ? "#f59e0b" : "#ef4444",
                      height: "100%",
                      transition: "width 1s ease",
                    }}
                    role="progressbar"
                    aria-valuenow={Math.round(userTotal / 1000)}
                    aria-valuemin={0}
                    aria-valuemax={Math.round(maxVal / 1000)}
                    aria-label={`Your emissions: ${(userTotal / 1000).toFixed(2)} tonnes CO₂e`}
                  />
                </div>
              </div>
            )}

            {/* Country bars */}
            {REGIONS.map((region) => {
              const pct = Math.round((region.benchmark / maxVal) * 100);
              const isSelected = selected === region.key;

              return (
                <div
                  key={region.key}
                  role="listitem"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected((s) => (s === region.key ? null : region.key))}
                  aria-expanded={isSelected}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "var(--space-2)", color: isSelected ? "#fff" : "var(--gray-300)", fontWeight: isSelected ? 600 : 400, transition: "color var(--transition-fast)" }}>
                    <span>
                      {region.flag} {region.name}
                      <span style={{ marginLeft: "var(--space-3)", fontSize: "0.75rem", color: "var(--gray-500)", fontWeight: 400 }}>
                        pop. {region.population}
                      </span>
                    </span>
                    <span>{(region.benchmark / 1000).toFixed(1)}t</span>
                  </div>

                  <div className="progress-track" style={{ background: "var(--gray-700)", height: 10 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${pct}%`, background: region.color, opacity: isSelected ? 1 : 0.7, height: "100%", transition: "width 0.8s ease, opacity var(--transition-fast)" }}
                    />
                  </div>

                  {isSelected && (
                    <div
                      style={{ marginTop: "var(--space-3)", padding: "var(--space-3) var(--space-4)", background: "var(--gray-700)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", color: "var(--gray-300)", lineHeight: 1.6, animation: "fadeIn var(--transition-fast) ease" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {region.note}
                      {hasCalculated && (
                        <span style={{ display: "block", marginTop: "var(--space-2)", color: userTotal < region.benchmark ? "var(--green-400)" : "var(--gray-400)", fontWeight: 600 }}>
                          {userTotal < region.benchmark
                            ? `✓ Your footprint is ${((1 - userTotal / region.benchmark) * 100).toFixed(0)}% lower than ${region.name}.`
                            : `Your footprint is ${((userTotal / region.benchmark - 1) * 100).toFixed(0)}% higher than ${region.name}.`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-4)" }}
          className="context-cards"
        >
          <ContextCard
            emoji="📉"
            title="Needed reduction"
            body="Global emissions must fall ~45% from 2010 levels by 2030 to stay on a 1.5°C pathway. We're currently tracking for 2.5–3°C."
          />
          <ContextCard
            emoji="⚖️"
            title="Inequality gap"
            body="The richest 1% of humanity emits more than the bottom 50% combined. Per-capita averages mask this structural reality."
          />
          <ContextCard
            emoji="🔋"
            title="Energy transition"
            body="Renewables hit a record 30% of global electricity in 2023. Solar capacity is doubling every 3 years — the fastest energy scale-up in history."
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .context-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function ContextCard({ emoji, title, body }) {
  return (
    <div className="card" style={{ background: "var(--gray-800)", border: "1px solid var(--gray-700)" }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "var(--space-3)" }}>{emoji}</div>
      <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#fff", marginBottom: "var(--space-2)" }}>{title}</h4>
      <p style={{ fontSize: "0.875rem", color: "var(--gray-400)", lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

GlobalContext.propTypes = {
  emissions: PropTypes.shape({
    transport: PropTypes.number.isRequired,
    energy:    PropTypes.number.isRequired,
    food:      PropTypes.number.isRequired,
    shopping:  PropTypes.number.isRequired,
  }).isRequired,
  hasCalculated: PropTypes.bool.isRequired,
};

ContextCard.propTypes = {
  emoji: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body:  PropTypes.string.isRequired,
};
