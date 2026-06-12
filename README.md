# 🌿 EcoTrace — Carbon Footprint Awareness Platform

> Understand, track, and reduce your personal carbon footprint — with science-backed emission factors and a personalised action plan.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff.svg)](https://vitejs.dev)
[![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-black.svg)](https://ecotrace-carbon-platform.vercel.app)

**Live demo:** [ecotrace-carbon-platform.vercel.app](https://ecotrace-carbon-platform.vercel.app)

---

## What it does

EcoTrace calculates your annual CO₂e emissions across four life categories, ranks personalised reduction actions by real impact, and shows where you stand against global benchmarks. Everything runs in the browser — no account, no server, no data sent anywhere.

| Feature | Details |
|---|---|
| Carbon calculator | Transport, Energy, Food, Shopping — 30+ input fields |
| Emission factors | IPCC AR6 WG3 (2022) + IEA World Energy Outlook 2024 |
| Results & donut chart | Per-category breakdown, total in kg CO₂e and tonnes |
| Personalised action plan | 16 actions ranked by impact tier + estimated annual saving |
| Paris 2050 gap tracker | Visual progress bar vs 500 kg CO₂e / person target |
| Global comparison | India, World, China, UK, USA, Australia — interactive bars |
| Daily activity log | Log eco-actions, track streaks, filter by category |
| PWA-ready | Service worker, web manifest, offline shell |
| Accessibility | WCAG 2.1 AA — skip link, ARIA roles, reduced-motion support |

---

## Tech stack

- **React 18** — functional components, hooks, no class components
- **Vite 5** — dev server + production build with vendor chunk splitting
- **Jest 29 + Testing Library** — unit tests with coverage thresholds
- **PropTypes** — runtime prop validation on every component
- **Vanilla CSS** — design token system via CSS custom properties, no CSS framework
- **Service Worker** — cache-first static assets, network-first API routes

---

## Project structure

```
ecotrace-carbon-platform/
├── public/
│   ├── index.html          # App shell — OG tags, manifest link, noscript fallback
│   └── sw.js               # Service worker — cache-first with versioned cache busting
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Sticky nav with scroll blur + mobile hamburger menu
│   │   ├── Hero.jsx         # Landing section with stat cards and trust signals
│   │   ├── StatsStrip.jsx   # Scrolling ticker (mobile) / grid (desktop) of climate stats
│   │   ├── Calculator.jsx   # 4-tab form — Transport, Energy, Food, Shopping
│   │   ├── Results.jsx      # SVG donut chart, Paris gap tracker, global comparison bars
│   │   ├── Insights.jsx     # Filterable action cards ranked by impact + saving
│   │   ├── ActivityLog.jsx  # Daily eco-action log with streak counter
│   │   ├── GlobalContext.jsx # Dark section — per-country emission bars with inline notes
│   │   └── Footer.jsx       # Links, data source citations, author credit
│   ├── utils/
│   │   ├── emissions.js     # Pure calculation functions + IPCC/IEA emission factors
│   │   └── insights.js      # Action library with trigger predicates and saving estimators
│   ├── styles/
│   │   └── global.css       # Design tokens, reset, typography, layout utilities
│   ├── App.jsx              # Root — state management, emissions derivation, layout
│   └── index.js             # React DOM entry + service worker registration
├── tests/
│   ├── emissions.test.js    # 67 assertions — all calc functions + constants
│   ├── insights.test.js     # 43 assertions — generateInsights, topInsights, totalPotentialSaving
│   ├── setup.js             # jest-dom matchers
│   └── __mocks__/
│       └── styleMock.js     # CSS module mock for Jest
├── babel.config.js
├── vite.config.js
└── package.json
```

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# Clone
git clone https://github.com/Quantorix-Field/ecotrace-carbon-platform.git
cd ecotrace-carbon-platform

# Install
npm install

# Dev server (localhost:3000)
npm run dev

# Run tests
npm test

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Emission factors

All factors are in **kg CO₂e per unit**.

### Transport

| Mode | Factor | Source |
|---|---|---|
| Petrol car | 0.192 kg / km | IPCC AR6 WG3 Table 10.SM.7 |
| Diesel car | 0.171 kg / km | IPCC AR6 WG3 |
| Electric car (India grid) | 0.053 kg / km | CEA 2023 grid intensity |
| Motorcycle | 0.103 kg / km | IPCC AR6 WG3 |
| Bus | 0.089 kg / km per passenger | IEA 2024 |
| Train / metro | 0.041 kg / km per passenger | IEA 2024 |
| Short-haul flight (<1500 km) | 0.255 kg / km per passenger | IPCC AR6 WG3 |
| Long-haul flight (≥1500 km) | 0.195 kg / km per passenger | IPCC AR6 WG3 |

### Energy

| Source | Factor | Source |
|---|---|---|
| Electricity — India | 0.716 kg / kWh | CEA CO₂ Baseline Database 2023 |
| Electricity — World avg | 0.436 kg / kWh | IEA World Energy Outlook 2024 |
| Natural gas | 2.040 kg / m³ | IPCC AR6 WG3 |
| LPG | 1.510 kg / kg | IPCC AR6 WG3 |

### Food (per kg, lifecycle)

| Item | Factor | Source |
|---|---|---|
| Beef | 27.0 kg CO₂e / kg | IPCC AR6 WG3 Ch. 7 |
| Lamb | 39.2 kg CO₂e / kg | IPCC AR6 WG3 Ch. 7 |
| Chicken | 6.9 kg CO₂e / kg | IPCC AR6 WG3 |
| Dairy | 3.2 kg CO₂e / kg | IPCC AR6 WG3 |
| Vegetables | 2.0 kg CO₂e / kg | Our World in Data |
| Legumes | 0.9 kg CO₂e / kg | Our World in Data |

---

## Testing

```bash
npm test              # run all tests with coverage
npm run test:watch    # watch mode during development
```

Coverage thresholds enforced in `package.json`:

| Metric | Threshold |
|---|---|
| Statements | 80% |
| Branches | 70% |
| Functions | 80% |
| Lines | 80% |

Tests cover all public utility functions — `calcTransport`, `calcEnergy`, `calcFood`, `calcShopping`, `calcTotal`, `getBreakdown`, `parisGap`, `generateInsights`, `topInsights`, and `totalPotentialSaving` — with 110 assertions across 10 describe blocks.

---

## Architecture decisions

**State in App.jsx only.** All inputs and derived emissions live at the root. Components receive what they need via props — no context, no external state library. For an app this size, that's the right call.

**Pure utility functions.** `emissions.js` and `insights.js` contain zero React. Every function takes plain objects and returns numbers or arrays. This makes them trivially testable and reusable.

**No charting library.** The donut chart in Results is raw SVG — 30 lines, no bundle weight, fully accessible via `aria-label`. A charting library would add ~50 kB for no functional gain.

**CSS custom properties over Tailwind.** The design token system in `global.css` gives full control over the visual language without a compiler step or class name explosion in JSX.

---

## Data sources

- [IPCC AR6 Working Group III (2022)](https://www.ipcc.ch/report/ar6/wg3/) — transport, energy, food emission factors
- [IEA World Energy Outlook 2024](https://www.iea.org/reports/world-energy-outlook-2024) — grid intensities, global energy stats
- [CEA CO₂ Baseline Database v19 (2023)](https://cea.nic.in) — India-specific grid emission factor
- [Our World in Data — CO₂ emissions](https://ourworldindata.org/co2-emissions) — per-capita country benchmarks
- [World Bank 2023](https://data.worldbank.org) — population figures

---

## License

MIT © 2026 Purushotam Kumar — see [LICENSE](./LICENSE)
