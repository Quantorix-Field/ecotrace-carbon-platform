interface StatItemProps {
  emoji: string;
  value: string;
  label: string;
}

const STRIP_STATS = [
  { emoji: "🌡️", value: "1.1°C",  label: "Global warming above pre-industrial levels" },
  { emoji: "💨", value: "37.4Gt", label: "Global CO₂ emissions in 2023 (IEA)"         },
  { emoji: "🌲", value: "10M+",   label: "Hectares of forest lost per year"            },
  { emoji: "⚡", value: "30%",    label: "Of emissions from energy production"         },
  { emoji: "🚗", value: "16%",    label: "Of emissions from road transport"            },
  { emoji: "🥩", value: "14.5%",  label: "Of emissions from livestock agriculture"     },
] as const;

export default function StatsStrip() {
  return (
    <div
      role="region"
      aria-label="Global climate statistics"
      style={{
        background: "var(--gray-900)",
        borderBlock: "1px solid var(--gray-800)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          padding: "var(--space-1) 0",
        }}
        className="stats-scroll"
      >
        {[...STRIP_STATS, ...STRIP_STATS].map((stat, i) => (
          <StatItem key={i} {...stat} />
        ))}
      </div>

      <style>{`
        .stats-scroll::-webkit-scrollbar { display: none; }

        @media (min-width: 769px) {
          .stats-scroll {
            display: grid !important;
            grid-template-columns: repeat(6, 1fr);
            overflow-x: unset;
          }
          .stats-scroll > *:nth-child(n+7) { display: none; }
        }

        @media (max-width: 768px) {
          .stats-scroll {
            animation: scrollTicker 28s linear infinite;
            width: max-content;
          }
          @keyframes scrollTicker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .stats-scroll:hover { animation-play-state: paused; }
        }
      `}</style>
    </div>
  );
}

function StatItem({ emoji, value, label }: StatItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-5) var(--space-6)",
        gap: "var(--space-1)",
        borderRight: "1px solid var(--gray-800)",
        minWidth: 180,
        flexShrink: 0,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "1.5rem", lineHeight: 1 }} aria-hidden="true">
        {emoji}
      </span>
      <span
        style={{
          fontSize: "1.375rem",
          fontWeight: 800,
          color: "var(--green-400)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--gray-400)",
          lineHeight: 1.4,
          maxWidth: "14ch",
        }}
      >
        {label}
      </span>
    </div>
  );
}
