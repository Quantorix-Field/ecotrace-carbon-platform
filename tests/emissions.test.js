import {
  calcTransport,
  calcEnergy,
  calcFood,
  calcShopping,
  calcTotal,
  getBreakdown,
  parisGap,
  FACTORS,
  BENCHMARKS,
  PARIS_TARGET_2050,
} from "../src/utils/emissions";

describe("calcTransport", () => {
  test("returns 0 for empty inputs", () => {
    expect(calcTransport()).toBe(0);
    expect(calcTransport({})).toBe(0);
  });

  test("petrol car only — weekly km × factor × 52", () => {
    const result = calcTransport({ carType: "car_petrol", carKmPerWeek: 100 });
    expect(result).toBe(Math.round(0.192 * 100 * 52));
  });

  test("electric car uses correct lower factor", () => {
    const petrol   = calcTransport({ carType: "car_petrol",   carKmPerWeek: 100 });
    const electric = calcTransport({ carType: "car_electric", carKmPerWeek: 100 });
    expect(electric).toBeLessThan(petrol);
    expect(electric).toBe(Math.round(FACTORS.transport.car_electric * 100 * 52));
  });

  test("diesel car factor is between electric and petrol", () => {
    const petrol   = calcTransport({ carType: "car_petrol",   carKmPerWeek: 100 });
    const diesel   = calcTransport({ carType: "car_diesel",   carKmPerWeek: 100 });
    const electric = calcTransport({ carType: "car_electric", carKmPerWeek: 100 });
    expect(diesel).toBeLessThan(petrol);
    expect(diesel).toBeGreaterThan(electric);
  });

  test("unknown carType falls back to petrol factor", () => {
    const fallback = calcTransport({ carType: "hovercraft", carKmPerWeek: 100 });
    const petrol   = calcTransport({ carType: "car_petrol", carKmPerWeek: 100 });
    expect(fallback).toBe(petrol);
  });

  test("motorbike contributes correctly", () => {
    const result = calcTransport({ motorbikeKmPerWeek: 50 });
    expect(result).toBe(Math.round(FACTORS.transport.motorcycle * 50 * 52));
  });

  test("bus and train accumulate correctly", () => {
    const result = calcTransport({ busKmPerWeek: 40, trainKmPerWeek: 60 });
    const expected = Math.round(
      (FACTORS.transport.bus * 40 + FACTORS.transport.train * 60) * 52
    );
    expect(result).toBe(expected);
  });

  test("short-haul flights use correct factor and default avgFlightKm", () => {
    const result = calcTransport({ flightShortPerYear: 2 });
    expect(result).toBe(Math.round(2 * 1200 * FACTORS.transport.flight_short));
  });

  test("long-haul flights use doubled avgFlightKm", () => {
    const result = calcTransport({ flightLongPerYear: 1, avgFlightKm: 1200 });
    expect(result).toBe(Math.round(1 * 1200 * 2 * FACTORS.transport.flight_long));
  });

  test("combined multi-mode inputs sum correctly", () => {
    const inputs = {
      carType:            "car_petrol",
      carKmPerWeek:       80,
      motorbikeKmPerWeek: 20,
      busKmPerWeek:       10,
      trainKmPerWeek:     30,
      flightShortPerYear: 2,
      flightLongPerYear:  1,
      avgFlightKm:        1200,
    };
    const weekly =
      FACTORS.transport.car_petrol * 80 +
      FACTORS.transport.motorcycle  * 20 +
      FACTORS.transport.bus         * 10 +
      FACTORS.transport.train       * 30;
    const annual =
      weekly * 52 +
      2 * 1200 * FACTORS.transport.flight_short +
      1 * 1200 * 2 * FACTORS.transport.flight_long;
    expect(calcTransport(inputs)).toBe(Math.round(annual));
  });

  test("returns a non-negative integer", () => {
    const result = calcTransport({ carKmPerWeek: 50 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calcEnergy", () => {
  test("returns 0 for empty inputs", () => {
    expect(calcEnergy()).toBe(0);
    expect(calcEnergy({})).toBe(0);
  });

  test("uses India grid factor by default", () => {
    const result = calcEnergy({ electricityKwhPerMonth: 100 });
    expect(result).toBe(Math.round(100 * 12 * FACTORS.energy.electricity_india));
  });

  test("uses world factor when gridRegion is world", () => {
    const india = calcEnergy({ electricityKwhPerMonth: 100, gridRegion: "india" });
    const world = calcEnergy({ electricityKwhPerMonth: 100, gridRegion: "world" });
    expect(world).toBeLessThan(india);
    expect(world).toBe(Math.round(100 * 12 * FACTORS.energy.electricity_world));
  });

  test("LPG calculation is correct", () => {
    const result = calcEnergy({ lpgKgPerMonth: 10 });
    expect(result).toBe(Math.round(10 * 12 * FACTORS.energy.lpg));
  });

  test("natural gas calculation is correct", () => {
    const result = calcEnergy({ gasM3PerMonth: 5 });
    expect(result).toBe(Math.round(5 * 12 * FACTORS.energy.natural_gas));
  });

  test("all fuels sum correctly", () => {
    const inputs = {
      electricityKwhPerMonth: 200,
      gasM3PerMonth:          10,
      lpgKgPerMonth:           8,
      gridRegion:             "india",
    };
    const expected = Math.round(
      200 * 12 * FACTORS.energy.electricity_india +
      10  * 12 * FACTORS.energy.natural_gas +
      8   * 12 * FACTORS.energy.lpg
    );
    expect(calcEnergy(inputs)).toBe(expected);
  });

  test("returns a non-negative integer", () => {
    expect(calcEnergy({ electricityKwhPerMonth: 150 })).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(calcEnergy({ electricityKwhPerMonth: 150 }))).toBe(true);
  });
});

describe("calcFood", () => {
  test("returns 0 for empty inputs", () => {
    expect(calcFood()).toBe(0);
    expect(calcFood({})).toBe(0);
  });

  test("beef has highest emission factor", () => {
    const beef    = calcFood({ beefKgPerWeek:        1 });
    const chicken = calcFood({ chickenKgPerWeek:     1 });
    const veggies = calcFood({ vegetablesKgPerWeek:  1 });
    expect(beef).toBeGreaterThan(chicken);
    expect(chicken).toBeGreaterThan(veggies);
  });

  test("beef annual calculation is correct", () => {
    const result = calcFood({ beefKgPerWeek: 0.5 });
    expect(result).toBe(Math.round(0.5 * FACTORS.food.beef * 52));
  });

  test("eggs are converted to kg equivalent before applying factor", () => {
    const result = calcFood({ eggsPerWeek: 7 });
    expect(result).toBe(Math.round(7 * 0.06 * FACTORS.food.eggs * 52));
  });

  test("plant-based foods produce lower emissions than equivalent meat", () => {
    const meat  = calcFood({ beefKgPerWeek:   1 });
    const plant = calcFood({ legumeKgPerWeek: 1 });
    expect(plant).toBeLessThan(meat);
  });

  test("combined diet inputs sum correctly", () => {
    const inputs = {
      beefKgPerWeek:       0.3,
      chickenKgPerWeek:    0.5,
      dairyKgPerWeek:      1.0,
      vegetablesKgPerWeek: 2.0,
      grainsKgPerWeek:     1.5,
    };
    const weeklyKg =
      0.3 * FACTORS.food.beef       +
      0.5 * FACTORS.food.chicken    +
      1.0 * FACTORS.food.dairy      +
      2.0 * FACTORS.food.vegetables +
      1.5 * FACTORS.food.grains;
    expect(calcFood(inputs)).toBe(Math.round(weeklyKg * 52));
  });

  test("returns a non-negative integer", () => {
    const result = calcFood({ beefKgPerWeek: 1 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calcShopping", () => {
  test("returns 0 for empty inputs", () => {
    expect(calcShopping()).toBe(0);
    expect(calcShopping({})).toBe(0);
  });

  test("electronics emit more than clothing per item", () => {
    const electronics = calcShopping({ electronicsPerYear:   1 });
    const clothing    = calcShopping({ clothingItemsPerYear: 1 });
    expect(electronics).toBeGreaterThan(clothing);
  });

  test("clothing calculation is correct", () => {
    const result = calcShopping({ clothingItemsPerYear: 5 });
    expect(result).toBe(Math.round(5 * FACTORS.shopping.clothing));
  });

  test("plastic monthly usage annualises correctly", () => {
    const result = calcShopping({ plasticKgPerMonth: 2 });
    expect(result).toBe(Math.round(2 * 12 * FACTORS.shopping.plastic));
  });

  test("all categories sum correctly", () => {
    const inputs = {
      clothingItemsPerYear: 8,
      electronicsPerYear:   2,
      furniturePerYear:     1,
      plasticKgPerMonth:    1.5,
      paperKgPerMonth:      0.5,
    };
    const expected = Math.round(
      8   * FACTORS.shopping.clothing     +
      2   * FACTORS.shopping.electronics  +
      1   * FACTORS.shopping.furniture    +
      1.5 * 12 * FACTORS.shopping.plastic +
      0.5 * 12 * FACTORS.shopping.paper
    );
    expect(calcShopping(inputs)).toBe(expected);
  });

  test("returns a non-negative integer", () => {
    const result = calcShopping({ clothingItemsPerYear: 10 });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe("calcTotal", () => {
  test("sums all four categories", () => {
    expect(calcTotal({ transport: 1000, energy: 500, food: 300, shopping: 200 })).toBe(2000);
  });

  test("handles missing categories as 0", () => {
    expect(calcTotal({ transport: 1000 })).toBe(1000);
    expect(calcTotal({})).toBe(0);
  });

  test("returns 0 for empty call", () => {
    expect(calcTotal()).toBe(0);
  });
});

describe("getBreakdown", () => {
  test("returns all-zero object when total is 0", () => {
    const result = getBreakdown(0, 0, 0, 0);
    expect(result).toEqual({ transport: 0, energy: 0, food: 0, shopping: 0 });
  });

  test("percentages sum to approximately 100", () => {
    const result = getBreakdown(1000, 500, 300, 200);
    const sum = result.transport + result.energy + result.food + result.shopping;
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });

  test("largest category has highest percentage", () => {
    const result = getBreakdown(5000, 500, 300, 200);
    expect(result.transport).toBeGreaterThan(result.energy);
    expect(result.transport).toBeGreaterThan(result.food);
    expect(result.transport).toBeGreaterThan(result.shopping);
  });

  test("equal categories each get ~25%", () => {
    const result = getBreakdown(1000, 1000, 1000, 1000);
    expect(result.transport).toBe(25);
    expect(result.energy).toBe(25);
    expect(result.food).toBe(25);
    expect(result.shopping).toBe(25);
  });

  test("single non-zero category gets 100%", () => {
    const result = getBreakdown(1000, 0, 0, 0);
    expect(result.transport).toBe(100);
    expect(result.energy).toBe(0);
  });
});

describe("parisGap", () => {
  test("onTrack is true when total is at or below target", () => {
    expect(parisGap(500).onTrack).toBe(true);
    expect(parisGap(300).onTrack).toBe(true);
  });

  test("onTrack is false when total exceeds target", () => {
    expect(parisGap(4700).onTrack).toBe(false);
  });

  test("gap is 0 when on track", () => {
    expect(parisGap(400).gap).toBe(0);
  });

  test("gap equals difference when above target", () => {
    expect(parisGap(1500).gap).toBe(1000);
  });

  test("reductionNeeded is correct percentage", () => {
    const result = parisGap(1000);
    expect(result.reductionNeeded).toBe(50);
  });

  test("reductionNeeded is 0 when on track", () => {
    expect(parisGap(500).reductionNeeded).toBe(0);
  });
});

describe("Emission factor constants", () => {
  test("PARIS_TARGET_2050 is 500 kg", () => {
    expect(PARIS_TARGET_2050).toBe(500);
  });

  test("all transport factors are positive numbers", () => {
    Object.values(FACTORS.transport).forEach((v) => {
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThan(0);
    });
  });

  test("beef emits more than chicken per kg", () => {
    expect(FACTORS.food.beef).toBeGreaterThan(FACTORS.food.chicken);
  });

  test("India grid is more carbon-intensive than world average", () => {
    expect(FACTORS.energy.electricity_india).toBeGreaterThan(
      FACTORS.energy.electricity_world
    );
  });

  test("all BENCHMARKS are positive", () => {
    Object.values(BENCHMARKS).forEach((v) => {
      expect(v).toBeGreaterThan(0);
    });
  });

  test("USA benchmark exceeds India benchmark", () => {
    expect(BENCHMARKS.usa).toBeGreaterThan(BENCHMARKS.india);
  });
});
