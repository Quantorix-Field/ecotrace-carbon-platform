import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function Header({ onReset }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Calculator", href: "#calculator" },
    { label: "Results",    href: "#results"    },
    { label: "Insights",   href: "#insights"   },
    { label: "Activity",   href: "#activity"   },
    { label: "Global",     href: "#global"     },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "var(--header-height)",
        background: scrolled ? "rgba(255,255,255,0.92)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--gray-200)" : "transparent"}`,
        transition: "all var(--transition-base)",
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-6)",
        }}
      >
        {/* Logo */}
        <button
          onClick={onReset}
          aria-label="EcoTrace home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 36,
              height: 36,
              background: "var(--green-600)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            🌿
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: "var(--gray-900)",
              letterSpacing: "-0.02em",
            }}
          >
            Eco<span style={{ color: "var(--green-600)" }}>Trace</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          style={{ display: "flex", gap: "var(--space-1)" }}
          className="desktop-nav"
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                padding: "var(--space-2) var(--space-3)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--gray-600)",
                transition: "all var(--transition-fast)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--green-700)";
                e.currentTarget.style.background = "var(--green-50)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-600)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <a
            href="#calculator"
            onClick={(e) => handleNavClick(e, "#calculator")}
            className="btn btn-primary btn-sm"
            style={{ flexShrink: 0 }}
          >
            Calculate Now
          </a>

          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "none",
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-2)",
              cursor: "pointer",
              color: "var(--gray-600)",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
            className="hamburger"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          style={{
            position: "absolute",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            background: "#fff",
            borderBottom: "1px solid var(--gray-200)",
            padding: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-1)",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeIn var(--transition-fast) ease",
          }}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--gray-700)",
                textDecoration: "none",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-50)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

Header.propTypes = {
  onReset: PropTypes.func.isRequired,
};
