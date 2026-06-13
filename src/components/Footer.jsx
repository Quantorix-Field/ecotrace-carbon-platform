const FOOTER_LINKS = [
  {
    heading: "Platform",
    links: [
      { label: "Calculator",    href: "#calculator" },
      { label: "Results",       href: "#results"    },
      { label: "Insights",      href: "#insights"   },
      { label: "Activity Log",  href: "#activity"   },
      { label: "Global Data",   href: "#global"     },
    ],
  },
  {
    heading: "Data sources",
    links: [
      { label: "IPCC AR6 WG3 (2022)",       href: "https://www.ipcc.ch/report/ar6/wg3/", external: true },
      { label: "IEA World Energy 2024",      href: "https://www.iea.org/reports/world-energy-outlook-2024", external: true },
      { label: "CEA Emission Factor 2023",   href: "https://cea.nic.in", external: true },
      { label: "Our World in Data",          href: "https://ourworldindata.org/co2-emissions", external: true },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "GitHub repo",     href: "https://github.com/Quantorix-Field/ecotrace-carbon-platform", external: true },
      { label: "Open source MIT", href: "https://github.com/Quantorix-Field/ecotrace-carbon-platform/blob/main/LICENSE", external: true },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{ background: "var(--gray-950, #0a0f0d)", borderTop: "1px solid var(--gray-800)", color: "var(--gray-400)" }}
      aria-label="Site footer"
    >
      <div className="container" style={{ paddingBlock: "var(--space-12)" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--space-10)" }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <span
                style={{ width: 32, height: 32, background: "var(--green-600)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}
                aria-hidden="true"
              >
                🌿
              </span>
              <span style={{ fontWeight: 800, fontSize: "1.0625rem", color: "#fff", letterSpacing: "-0.02em" }}>
                Eco<span style={{ color: "var(--green-400)" }}>Trace</span>
              </span>
            </div>

            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--gray-500)", maxWidth: "30ch", marginBottom: "var(--space-5)" }}>
              Science-backed carbon tracking for individuals. Understand your footprint. Act on what matters.
            </p>

            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              {["IPCC AR6 data", "IEA 2024", "Open source"].map((badge) => (
                <span
                  key={badge}
                  style={{ padding: "0.2rem var(--space-3)", background: "var(--gray-800)", border: "1px solid var(--gray-700)", borderRadius: "var(--radius-full)", fontSize: "0.7rem", fontWeight: 600, color: "var(--green-400)", letterSpacing: "0.03em" }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gray-300)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-4)" }}>
                {heading}
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {links.map(({ label, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      style={{ fontSize: "0.875rem", color: "var(--gray-500)", textDecoration: "none", transition: "color var(--transition-fast)", display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--green-400)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gray-500)")}
                    >
                      {label}
                      {external && (
                        <span aria-label="opens in new tab" style={{ fontSize: "0.65rem", opacity: 0.6 }}>↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--gray-800)", paddingBlock: "var(--space-5)" }}>
        <div
          className="container"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)" }}
        >
          <p style={{ fontSize: "0.8125rem", color: "var(--gray-600)", margin: 0 }}>
            © {year} EcoTrace · Built by{" "}
            <a
              href="https://www.linkedin.com/in/purushotam-kumar-634720406/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--green-500)", textDecoration: "none", fontWeight: 600 }}
            >
              Purushotam Kumar
            </a>{" "}
            · <a href="https://github.com/Quantorix-Field/ecotrace-carbon-platform/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" style={{color: "var(--green-500)", textDecoration: "none", fontWeight: 600}}>MIT License</a>
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--gray-600)", margin: 0, textAlign: "right" }}>
            Emission factors: IPCC AR6 WG3 (2022) · IEA 2024 · CEA 2023
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: var(--space-8) !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
