// Action library — each entry maps to a category and carries an estimated
// annual saving in kg CO₂e so we can rank by real impact, not vibes.

const ACTION_LIBRARY = [
  // Transport
  {
    id: "t1",
    category: "transport",
    trigger: (t) => t.carKmPerWeek > 50 && t.carType === "car_petrol",
    title: "Switch to an electric or hybrid vehicle",
    description:
      "Moving from a petrol car to an EV on India's current grid cuts per-km emissions by ~72%. At your mileage that's a significant annual saving.",
    saving: (t) => Math.round((0.192 - 0.053) * t.carKmPerWeek * 52),
    impact: "high",
    effort: "high",
    timeframe: "long-term",
  },
  {
    id: "t2",
    category: "transport",
    trigger: (t) => t.carKmPerWeek > 20,
    title: "Carpool or combine trips",
    description:
      "Sharing rides just 3 days a week roughly halves your per-trip footprint without changing your car.",
    saving: (t) => Math.round(0.192 * t.carKmPerWeek * 0.4 * 52),
    impact: "high",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "t3",
    category: "transport",
    trigger: (t) => t.carKmPerWeek > 10,
    title: "Replace short drives with cycling or walking",
    description:
      "Trips under 5 km account for a disproportionate share of urban car emissions. A bike handles most of them faster in city traffic.",
    saving: (t) => Math.round(0.192 * Math.min(t.carKmPerWeek * 0.3, 30) * 52),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "t4",
    category: "transport",
    trigger: (t) => t.flightShortPerYear > 2,
    title: "Reduce short-haul flights",
    description:
      "Short flights have the worst emissions-per-km ratio due to landing/takeoff cycles. Train alternatives exist for most routes under 700 km in India.",
    saving: (t) =>
      Math.round((t.flightShortPerYear - 2) * 1200 * 0.255),
    impact: "high",
    effort: "medium",
    timeframe: "short-term",
  },
  {
    id: "t5",
    category: "transport",
    trigger: (t) => t.motorbikeKmPerWeek > 50,
    title: "Switch to public transit for commutes",
    description:
      "Bus and metro emit roughly 50–80% less per passenger-km than a solo motorbike. Even a partial shift adds up fast.",
    saving: (t) =>
      Math.round((0.103 - 0.041) * t.motorbikeKmPerWeek * 0.5 * 52),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },

  // Energy
  {
    id: "e1",
    category: "energy",
    trigger: (e) => e.electricityKwhPerMonth > 200,
    title: "Install rooftop solar panels",
    description:
      "A 2 kWp system in most Indian cities generates ~2,400 kWh/year, offsetting a large chunk of grid electricity at India's 0.716 kg CO₂e/kWh intensity.",
    saving: (e) =>
      Math.round(Math.min(e.electricityKwhPerMonth * 12 * 0.5, 2400) * 0.716),
    impact: "high",
    effort: "high",
    timeframe: "long-term",
  },
  {
    id: "e2",
    category: "energy",
    trigger: (e) => e.electricityKwhPerMonth > 100,
    title: "Switch to LED lighting throughout your home",
    description:
      "LEDs use 75% less energy than incandescent bulbs. A typical household replacing all bulbs saves 300–500 kWh per year.",
    saving: () => Math.round(400 * 0.716),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "e3",
    category: "energy",
    trigger: (e) => e.electricityKwhPerMonth > 150,
    title: "Set AC to 24°C and use a ceiling fan",
    description:
      "Every degree above 18°C saves ~6% in cooling energy. 24°C with a fan feels like 21°C — BEE's own recommendation.",
    saving: (e) =>
      Math.round(e.electricityKwhPerMonth * 0.15 * 12 * 0.716),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "e4",
    category: "energy",
    trigger: (e) => e.lpgKgPerMonth > 5,
    title: "Switch to an induction cooktop",
    description:
      "Induction is ~84% efficient vs ~40% for LPG burners. If your electricity comes from any renewables, the emissions gap widens further.",
    saving: (e) =>
      Math.round(e.lpgKgPerMonth * 12 * 1.51 * 0.5),
    impact: "medium",
    effort: "medium",
    timeframe: "short-term",
  },
  {
    id: "e5",
    category: "energy",
    trigger: (e) => e.electricityKwhPerMonth > 80,
    title: "Unplug standby appliances and use smart power strips",
    description:
      "Standby power ('vampire load') accounts for 5–10% of home electricity use. Smart strips eliminate this with zero effort after setup.",
    saving: (e) =>
      Math.round(e.electricityKwhPerMonth * 0.07 * 12 * 0.716),
    impact: "low",
    effort: "low",
    timeframe: "immediate",
  },

  // Food
  {
    id: "f1",
    category: "food",
    trigger: (f) => f.beefKgPerWeek > 0.3,
    title: "Replace beef with chicken or legumes twice a week",
    description:
      "Beef emits ~4× more than chicken and ~30× more than lentils per kg. Two meat-free or lower-meat days per week makes a measurable dent.",
    saving: (f) =>
      Math.round((27.0 - 6.9) * f.beefKgPerWeek * 0.4 * 52),
    impact: "high",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "f2",
    category: "food",
    trigger: (f) => f.beefKgPerWeek + f.lambKgPerWeek > 0.5,
    title: "Try one fully plant-based day per week",
    description:
      "A single vegan day per week saves the equivalent of not driving ~100 km — every week. It compounds quickly.",
    saving: (f) =>
      Math.round((f.beefKgPerWeek * 27 + f.lambKgPerWeek * 39.2) * 0.14 * 52),
    impact: "high",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "f3",
    category: "food",
    trigger: (f) => f.dairyKgPerWeek > 2,
    title: "Swap some dairy for plant-based alternatives",
    description:
      "Oat milk emits ~80% less than cow's milk. Replacing half your dairy consumption is one of the highest-ROI diet changes available.",
    saving: (f) =>
      Math.round(f.dairyKgPerWeek * 0.5 * (3.2 - 0.9) * 52),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "f4",
    category: "food",
    trigger: (f) => f.vegetablesKgPerWeek < 2,
    title: "Increase local seasonal vegetables in your diet",
    description:
      "Local and seasonal produce avoids cold-chain logistics emissions. It's also the cheapest high-nutrition food category.",
    saving: () => Math.round(52 * 1.5),
    impact: "low",
    effort: "low",
    timeframe: "immediate",
  },

  // Shopping
  {
    id: "s1",
    category: "shopping",
    trigger: (s) => s.clothingItemsPerYear > 10,
    title: "Buy second-hand or swap clothing",
    description:
      "Fast fashion is one of the dirtiest industries. A single cotton T-shirt has a ~7 kg CO₂e footprint. Second-hand cuts that to near zero.",
    saving: (s) =>
      Math.round((s.clothingItemsPerYear - 5) * 20 * 0.8),
    impact: "high",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "s2",
    category: "shopping",
    trigger: (s) => s.electronicsPerYear > 1,
    title: "Extend device lifespans by 1–2 extra years",
    description:
      "Manufacturing a smartphone accounts for ~80% of its lifetime emissions. Keeping yours one extra year is more impactful than any green charging habit.",
    saving: (s) =>
      Math.round((s.electronicsPerYear - 1) * 70 * 0.5),
    impact: "high",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "s3",
    category: "shopping",
    trigger: (s) => s.plasticKgPerMonth > 1,
    title: "Switch to reusable bags, bottles, and containers",
    description:
      "Single-use plastic has a short life but a long production footprint. Reusables pay back their manufacturing emissions within weeks of use.",
    saving: (s) =>
      Math.round(s.plasticKgPerMonth * 12 * 6.0 * 0.6),
    impact: "medium",
    effort: "low",
    timeframe: "immediate",
  },
  {
    id: "s4",
    category: "shopping",
    trigger: (s) => s.clothingItemsPerYear > 5,
    title: "Choose quality over quantity — buy less, buy better",
    description:
      "The most sustainable item is the one you never buy. A capsule wardrobe approach typically cuts clothing emissions by 40–60%.",
    saving: (s) =>
      Math.round(s.clothingItemsPerYear * 20 * 0.3),
    impact: "medium",
    effort: "medium",
    timeframe: "short-term",
  },
];

const IMPACT_ORDER = { high: 0, medium: 1, low: 2 };

export function generateInsights(transportInputs, energyInputs, foodInputs, shoppingInputs) {
  const matched = ACTION_LIBRARY.filter((action) => {
    try {
      switch (action.category) {
        case "transport": return action.trigger(transportInputs ?? {});
        case "energy":    return action.trigger(energyInputs ?? {});
        case "food":      return action.trigger(foodInputs ?? {});
        case "shopping":  return action.trigger(shoppingInputs ?? {});
        default:          return false;
      }
    } catch {
      return false;
    }
  });

  return matched
    .map((action) => {
      let saving = 0;
      try {
        switch (action.category) {
          case "transport": saving = action.saving(transportInputs ?? {}); break;
          case "energy":    saving = action.saving(energyInputs ?? {}); break;
          case "food":      saving = action.saving(foodInputs ?? {}); break;
          case "shopping":  saving = action.saving(shoppingInputs ?? {}); break;
        }
      } catch {
        saving = 0;
      }
      return { ...action, estimatedSaving: Math.max(0, saving) };
    })
    .sort((a, b) => {
      const impactDiff = IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact];
      if (impactDiff !== 0) return impactDiff;
      return b.estimatedSaving - a.estimatedSaving;
    });
}

export function topInsights(transportInputs, energyInputs, foodInputs, shoppingInputs, n = 5) {
  return generateInsights(transportInputs, energyInputs, foodInputs, shoppingInputs).slice(0, n);
}

export function totalPotentialSaving(insights) {
  return insights.reduce((sum, a) => sum + (a.estimatedSaving ?? 0), 0);
}
