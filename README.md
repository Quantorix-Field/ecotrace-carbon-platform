# EcoTrace — Carbon Footprint Awareness Platform

A science-backed web application that helps individuals understand, track, and reduce their personal carbon footprint through an interactive calculator, daily activity logging, and personalised reduction insights.

**[Live Demo →](https://ecotrace-carbon-platform.vercel.app)** &nbsp;|&nbsp; **[GitHub →](https://github.com/Quantorix-Field/ecotrace-carbon-platform)**

---

## What it does

Most people have no idea how their daily choices translate into carbon emissions. EcoTrace makes that invisible cost visible — across transport, energy, food, and shopping — and immediately tells you where to focus your effort for maximum impact.

- **Carbon Calculator** — Covers four emission categories with emission factors sourced from IPCC AR6 WG3 and IEA 2024. Inputs include vehicle type, flight frequency, grid mix, diet, food waste, clothing habits, and digital consumption.
- **Visual Breakdown** — SVG donut chart with per-category split so users can see at a glance where their footprint is heaviest.
- **Personalised Action Plan** — Recommendations are generated dynamically based on the user's specific inputs, ranked by impact potential (high / medium / low), with quantified CO₂e savings for each action.
- **Daily Activity Log** — Track individual activities over time. Add and remove entries; emissions calculated per entry in real time.
- **Global Context** — Per-capita CO₂ benchmarks for India, World Average, China, UK, USA, and Australia so users can contextualise their number.
- **Paris Agreement Tracker** — Shows how far the user is from the 2.0 tCO₂e/yr target set by the Paris Agreement for 2050.

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Markup | HTML5 (semantic) | Accessibility, SEO, zero parse overhead |
| Styling | CSS3 with custom properties | Themeable, no runtime, instant paint |
| Logic | Vanilla ES2022 | No build step, no dependency surface, fast cold start |
| Fonts | Syne + DM Sans (Google Fonts) | Only external dependency; preconnected |
| Hosting | Vercel | Edge CDN, zero config, automatic HTTPS |

No frameworks. No bundler. No npm. A single HTML file that scores 100 on Lighthouse performance because there is nothing to load except the document itself.

---

## Emission factors

All calculations use peer-reviewed, publicly available data:

| Source | Used for |
|---|---|
| [IPCC AR6 WG3 Annex III](https://www.ipcc.ch/report/ar6/wg3/) | Transport (car, flight, transit) |
| [IEA Emissions Factors 2024](https://www.iea.org/data-and-statistics) | Electricity grid intensity by region |
| [Poore & Nemecek 2018, *Science*](https://doi.org/10.1126/science.aaq0216) | Food & diet emission factors |
| [WRAP / Quantis](https://wrap.org.uk) | Fashion & electronics lifecycle emissions |

---

## Accessibility

- WCAG 2.2 AA compliant
- Full keyboard navigation with WAI-ARIA tab pattern (arrow key switching)
- ARIA live regions for screen-reader announcements on all dynamic updates
- Skip-to-content link for keyboard users
- All colour contrast ratios ≥ 4.5:1
- Focus-visible outlines on every interactive element
- Semantic landmark roles throughout (`banner`, `main`, `contentinfo`, `region`)

---

## Security

- Content-Security-Policy meta tag restricts resource origins
- `X-Content-Type-Options: nosniff` prevents MIME sniffing
- All user input sanitised before DOM insertion — no raw `innerHTML` with user data
- `frame-ancestors 'none'` blocks clickjacking
- No third-party scripts, no analytics, no tracking

---

## Performance

- Single file, zero JavaScript dependencies
- Google Fonts loaded with `preconnect` + `display=swap` to eliminate render-blocking
- All animations use CSS `transform` and `opacity` — no layout thrashing
- `requestAnimationFrame` gates gauge bar animation
- All event listeners registered as `{ passive: true }` where applicable
- No render-blocking resources

---

## Testing

Every interactive element carries a `data-testid` attribute for automated testing:

```bash
# Example selectors for Playwright / Cypress
data-testid="calculator-section"
data-testid="tab-transport"
data-testid="btn-calculate"
data-testid="results-section"
data-testid="btn-add-activity"
data-testid="activity-row-{id}"
```

---

## Run locally

No build step required.

```bash
git clone https://github.com/Quantorix-Field/ecotrace-carbon-platform.git
cd ecotrace-carbon-platform
open index.html        # macOS
# or
start index.html       # Windows
# or just drag index.html into any browser
```

---

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Quantorix-Field/ecotrace-carbon-platform)

1. Fork this repo
2. Connect to [Vercel](https://vercel.com)
3. Deploy — done in under 60 seconds

---

## License

MIT — see [LICENSE](./LICENSE)
