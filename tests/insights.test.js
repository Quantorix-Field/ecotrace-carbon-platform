import {
  generateInsights,
  topInsights,
  totalPotentialSaving,
} from "../src/utils/insights";

const ZERO = { transport: {}, energy: {}, food: {}, shopping: {} };

const HEAVY_DRIVER = {
  transport: { carType: "car_petrol", carKmPerWeek: 200, flightShortPerYear: 6 },
  energy:    {},
  food:      {},
  shopping:  {},
};

const HIGH_ENERGY = {
  transport: {},
  energy:    { electricityKwhPerMonth: 400, lpgKgPerMonth: 10, gridRegion: "india" },
  food:      {},
  shopping:  {},
};

const MEAT_HEAVY = {
  transport: {},
  energy:    {},
  food:      { beefKgPerWeek: 1.5, lambKgPerWeek: 0.8, dairyKgPerWeek: 3 },
  shopping:  {},
};

const FAST_FASHION = {
  transport: {},
  energy:    {},
  food:      {},
  shopping:  { clothingItemsPerYear: 25, electronicsPerYear: 3, plasticKgPerMonth: 2 },
};

const ALL_HIGH = {
  transport: {
    carType:            "car_petrol",
    carKmPerWeek:       300,
    motorbikeKmPerWeek: 80,
    flightShortPerYear: 8,
    flightLongPerYear:  4,
  },
  energy: {
    electricityKwhPerMonth: 500,
    lpgKgPerMonth:          12,
    gridRegion:             "india",
  },
  food: {
    beefKgPerWeek:  2,
    lambKgPerWeek:  1,
    dairyKgPerWeek: 4,
  },
  shopping: {
    clothingItemsPerYear: 30,
    electronicsPerYear:   4,
    plasticKgPerMonth:    3,
  },
};

function spread(fixture) {
  return [fixture.transport, fixture.energy, fixture.food, fixture.shopping];
}

describe("generateInsights", () => {
  test("returns an array", () => {
    const result = generateInsights(...spread(ZERO));
    expect(Array.isArray(result)).toBe(true);
  });

  test("returns empty array when no triggers fire", () => {
    const result = generateInsights({}, {}, {}, {});
    expect(result).toHaveLength(0);
  });

  test("returns insights for heavy driver", () => {
    const result = generateInsights(...spread(HEAVY_DRIVER));
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns insights for high energy user", () => {
    const result = generateInsights(...spread(HIGH_ENERGY));
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns insights for meat-heavy diet", () => {
    const result = generateInsights(...spread(MEAT_HEAVY));
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns insights for fast fashion shopper", () => {
    const result = generateInsights(...spread(FAST_FASHION));
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns more insights for ALL_HIGH than any single category", () => {
    const all    = generateInsights(...spread(ALL_HIGH));
    const driver = generateInsights(...spread(HEAVY_DRIVER));
    const energy = generateInsights(...spread(HIGH_ENERGY));
    expect(all.length).toBeGreaterThanOrEqual(driver.length);
    expect(all.length).toBeGreaterThanOrEqual(energy.length);
  });

  test("each insight has required fields", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    results.forEach((insight) => {
      expect(insight).toHaveProperty("id");
      expect(insight).toHaveProperty("category");
      expect(insight).toHaveProperty("title");
      expect(insight).toHaveProperty("description");
      expect(insight).toHaveProperty("impact");
      expect(insight).toHaveProperty("effort");
      expect(insight).toHaveProperty("timeframe");
      expect(insight).toHaveProperty("estimatedSaving");
    });
  });

  test("estimatedSaving is always a non-negative number", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    results.forEach((insight) => {
      expect(typeof insight.estimatedSaving).toBe("number");
      expect(insight.estimatedSaving).toBeGreaterThanOrEqual(0);
    });
  });

  test("impact values are only high | medium | low", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const valid = new Set(["high", "medium", "low"]);
    results.forEach((insight) => {
      expect(valid.has(insight.impact)).toBe(true);
    });
  });

  test("effort values are only high | medium | low", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const valid = new Set(["high", "medium", "low"]);
    results.forEach((insight) => {
      expect(valid.has(insight.effort)).toBe(true);
    });
  });

  test("timeframe values are valid strings", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const valid = new Set(["immediate", "short-term", "long-term"]);
    results.forEach((insight) => {
      expect(valid.has(insight.timeframe)).toBe(true);
    });
  });

  test("no duplicate IDs in results", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const ids = results.map((r) => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test("results are sorted high → medium → low impact", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const ORDER = { high: 0, medium: 1, low: 2 };
    for (let i = 1; i < results.length; i++) {
      expect(ORDER[results[i].impact]).toBeGreaterThanOrEqual(
        ORDER[results[i - 1].impact]
      );
    }
  });

  test("within same impact tier, sorted by estimatedSaving descending", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const highOnly = results.filter((r) => r.impact === "high");
    for (let i = 1; i < highOnly.length; i++) {
      expect(highOnly[i].estimatedSaving).toBeLessThanOrEqual(
        highOnly[i - 1].estimatedSaving
      );
    }
  });

  test("category field matches one of the four categories", () => {
    const results = generateInsights(...spread(ALL_HIGH));
    const valid = new Set(["transport", "energy", "food", "shopping"]);
    results.forEach((insight) => {
      expect(valid.has(insight.category)).toBe(true);
    });
  });

  test("heavy driver triggers at least one transport insight", () => {
    const results = generateInsights(...spread(HEAVY_DRIVER));
    const transport = results.filter((r) => r.category === "transport");
    expect(transport.length).toBeGreaterThan(0);
  });

  test("high energy user triggers at least one energy insight", () => {
    const results = generateInsights(...spread(HIGH_ENERGY));
    const energy = results.filter((r) => r.category === "energy");
    expect(energy.length).toBeGreaterThan(0);
  });

  test("meat-heavy diet triggers at least one food insight", () => {
    const results = generateInsights(...spread(MEAT_HEAVY));
    const food = results.filter((r) => r.category === "food");
    expect(food.length).toBeGreaterThan(0);
  });

  test("fast fashion triggers at least one shopping insight", () => {
    const results = generateInsights(...spread(FAST_FASHION));
    const shopping = results.filter((r) => r.category === "shopping");
    expect(shopping.length).toBeGreaterThan(0);
  });

  test("does not throw on null/undefined inputs", () => {
    expect(() => generateInsights(null, null, null, null)).not.toThrow();
    expect(() => generateInsights(undefined, undefined, undefined, undefined)).not.toThrow();
  });

  test("flight-heavy profile triggers flight reduction insight", () => {
    const inputs = { transport: { flightShortPerYear: 8 }, energy: {}, food: {}, shopping: {} };
    const results = generateInsights(...spread(inputs));
    const flightAction = results.find((r) => r.id === "t4");
    expect(flightAction).toBeDefined();
  });

  test("EV switch insight triggers only for petrol car with high mileage", () => {
    const petrolHigh   = generateInsights({ carType: "car_petrol",   carKmPerWeek: 100 }, {}, {}, {});
    const electricHigh = generateInsights({ carType: "car_electric", carKmPerWeek: 100 }, {}, {}, {});
    const evInsightInPetrol   = petrolHigh.find((r) => r.id === "t1");
    const evInsightInElectric = electricHigh.find((r) => r.id === "t1");
    expect(evInsightInPetrol).toBeDefined();
    expect(evInsightInElectric).toBeUndefined();
  });
});

describe("topInsights", () => {
  test("returns at most n insights", () => {
    const result = topInsights(...spread(ALL_HIGH), 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  test("default n is 5", () => {
    const all = generateInsights(...spread(ALL_HIGH));
    const top = topInsights(...spread(ALL_HIGH));
    expect(top.length).toBeLessThanOrEqual(5);
    if (all.length >= 5) expect(top).toHaveLength(5);
  });

  test("returns fewer than n if not enough insights", () => {
    const result = topInsights({}, {}, {}, {}, 10);
    expect(result.length).toBe(0);
  });

  test("top insights are the first n from generateInsights", () => {
    const all = generateInsights(...spread(ALL_HIGH));
    const top = topInsights(...spread(ALL_HIGH), 4);
    expect(top).toEqual(all.slice(0, 4));
  });

  test("returns an array", () => {
    expect(Array.isArray(topInsights(...spread(ZERO), 5))).toBe(true);
  });
});

describe("totalPotentialSaving", () => {
  test("returns 0 for empty array", () => {
    expect(totalPotentialSaving([])).toBe(0);
  });

  test("sums estimatedSaving across all insights", () => {
    const insights = [
      { estimatedSaving: 300 },
      { estimatedSaving: 500 },
      { estimatedSaving: 200 },
    ];
    expect(totalPotentialSaving(insights)).toBe(1000);
  });

  test("handles missing estimatedSaving gracefully", () => {
    const insights = [
      { estimatedSaving: 300 },
      {},
      { estimatedSaving: 200 },
    ];
    expect(totalPotentialSaving(insights)).toBe(500);
  });

  test("result is non-negative for real insights", () => {
    const insights = generateInsights(...spread(ALL_HIGH));
    expect(totalPotentialSaving(insights)).toBeGreaterThanOrEqual(0);
  });

  test("ALL_HIGH profile has non-zero potential saving", () => {
    const insights = generateInsights(...spread(ALL_HIGH));
    expect(totalPotentialSaving(insights)).toBeGreaterThan(0);
  });

  test("potential saving for ALL_HIGH exceeds 1 tonne CO₂e", () => {
    const insights = generateInsights(...spread(ALL_HIGH));
    expect(totalPotentialSaving(insights)).toBeGreaterThan(1000);
  });
});
