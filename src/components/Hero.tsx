interface HeroProps {
  onStart: () => void;
}

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

const STATS = [
  { value: "4.7t", label: "World avg CO₂ per person / year" },
  { value: "1.8t", label: "India avg CO₂ per person / year" },
  { value: "0.5t", label: "Paris 2050 target per person"    },
] as const;

const TRUST_SIGNALS = [
  "Free & open-source",
  "No account needed",
  "Data stays on your device",
] as const;

export default function Hero({ onStart }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        background:
          "linear-gradient(160deg, var(--green-50) 0%, #fff 55%, var(--green-50) 100%)",
        paddingBlock: "var(--space-20)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div aria-hidden="true" style={decorCircle(1)} />
      <div aria-hidden="true" style={decorCircle(2)} />

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left — copy */}
          <div className="animate-fade-up">
            <span
              className="badge badge-green"
              style={{ marginBottom: "var(--space-4)", display: "inline-flex" }}
            >
              🌍 Science-backed · IPCC AR6 + IEA 2024
            </span>

            <h1
              id="hero-heading"
              style={{
                marginBottom: "var(--space-6)",
                letterSpacing: "-0.03em",
                color: "var(--gray-900)",
              }}
            >
              Know your{" "}
              <span
                style={{
                  color: "var(--green-600)",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                carbon footprint
                <Underline />
              </span>
              . Shrink it.
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "var(--gray-600)",
                maxWidth: "48ch",
                marginBottom: "var(--space-8)",
              }}
            >
              EcoTrace calculates your personal CO₂ emissions across transport,
              energy, food, and shopping — then gives you a ranked action plan
              to cut them. No sign-up. No data sent anywhere.
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <button onClick={onStart} className="btn btn-primary btn-lg">
                Calculate my footprint
              </button>
              <a href="#global" className="btn btn-outline btn-lg">
                See global data
              </a>
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--space-6)",
                marginTop: "var(--space-8)",
                flexWrap: "wrap",
              }}
            >
              {TRUST_SIGNALS.map((t) => (
                <span
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontSize: "0.875rem",
                    color: "var(--gray-500)",
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: "var(--green-500)" }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — stat cards */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
            className="animate-fade-up"
          >
            {STATS.map(({ value, label }, i) => (
              <StatCard key={label} value={value} label={label} index={i} />
            ))}

            <div
              className="card"
              style={{
                background: "var(--green-600)",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <span style={{ fontSize: "2rem" }}>🎯</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }}>
                  Paris Agreement target
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--green-100)",
                    marginTop: 2,
                  }}
                >
                  We need to reach 0.5t CO₂e per person by 2050 to limit
                  warming to 1.5°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-10) !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatCard({ value, label, index }: StatCardProps) {
  const colors = [
    { bg: "#fff",            border: "var(--green-200)", val: "var(--green-700)" },
    { bg: "var(--green-50)", border: "var(--green-200)", val: "var(--green-800)" },
    { bg: "var(--gray-50)",  border: "var(--gray-200)",  val: "var(--gray-700)"  },
  ] as const;
  const c = colors[index % colors.length];

  return (
    <div
      className="card"
      style={{
        background: c.bg,
        borderColor: c.border,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-4) var(--space-5)",
        animationDelay: `${index * 80}ms`,
      }}
    >
      <span
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: c.val,
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
          minWidth: "3.5rem",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: "0.875rem", color: "var(--gray-600)", lineHeight: 1.4 }}>
        {label}
      </span>
    </div>
  );
}

function Underline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 12"
      style={{
        position: "absolute",
        bottom: -6,
        left: 0,
        width: "100%",
        height: 10,
        overflow: "visible",
      }}
    >
      <path
        d="M2,8 Q50,2 100,8 Q150,14 198,6"
        stroke="var(--green-400)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function decorCircle(n: number): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    background: "var(--green-100)",
    opacity: 0.5,
    pointerEvents: "none",
    zIndex: 0,
  };
  if (n === 1)
    return { ...base, width: 400, height: 400, top: -120, right: -80 };
  return { ...base, width: 280, height: 280, bottom: -80, left: -60 };
}
