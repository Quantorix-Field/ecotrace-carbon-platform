/**
 * Emission factors sourced from IPCC AR6 WG3 (2022) and IEA World Energy Outlook 2024.
 * All values in kg CO₂e per unit unless noted.
 */

import type {
  TransportInputs,
  EnergyInputs,
  FoodInputs,
  ShoppingInputs,
  Emissions,
  EmissionBreakdown,
  ParisGapResult,
} from "../types";

// ─── Emission Factors ─────────────────────────────────────────────────────────

export const FACTORS = {
  transport: {
    car_petrol:   0.192, // kg CO₂e / km
    car_diesel:   0.171, // kg CO₂e / km
    car_electric: 0.053, // kg CO₂e / km (India grid intensity)
    motorcycle:   0.103, // kg CO₂e / km
    bus:          0.089, // kg CO₂e / km per passenger
    train:        0.041, // kg CO₂e / km per passenger
    flight_short: 0.255, // kg CO₂e / km per passenger (<1500 km)
    flight_long:  0.195, // kg CO₂e / km per passenger (≥1500 km)
  },
  energy: {
    electricity_india: 0.716, // kg CO₂e / kWh (CEA 2023)
    electricity_world: 0.436, // kg CO₂e / kWh (IEA global avg)
    natural_gas:       2.040, // kg CO₂e / m³
    lpg:               1.510, // kg CO₂e / kg
    coal:              2.420, // kg CO₂e / kg
  },
  food: {
    beef:       27.0, // kg CO₂e / kg
    lamb:       39.2, // kg CO₂e / kg
    pork:        7.6, // kg CO₂e / kg
    chicken:     6.9, // kg CO₂e / kg
    fish:        6.1, // kg CO₂e / kg
    dairy:       3.2, // kg CO₂e / kg
    eggs:        4.8, // kg CO₂e / kg
    vegetables:  2.0, // kg CO₂e / kg
    grains:      1.4, // kg CO₂e / kg
    legumes:     0.9, // kg CO₂e / kg
  },
  shopping: {
    clothing:    20.0, // kg CO₂e / item (avg garment, lifecycle)
    electronics: 70.0, // kg CO₂e / item (avg device, lifecycle)
    furniture:   90.0, // kg CO₂e / item
    plastic:      6.0, // kg CO₂e / kg
    paper:        1.8, // kg CO₂e / kg
  },
} as const;

/** Regional per-capita benchmarks in kg CO₂e / year (IEA 2024, World Bank 2023) */
export const BENCHMARKS: Record<string, number> = {
  india:     1800,
  world:     4700,
  china:     7200,
  uk:        5500,
  usa:      14000,
  australia: 15000,
};

/** Paris Agreement 2050 target in kg CO₂e / person / year */
export const PARIS_TARGET_2050 = 500;

// ─── Calculation Functions ────────────────────────────────────────────────────

/**
 * Calculates annual transport emissions in kg CO₂e.
 * Covers personal vehicles, public transit, and flights.
 * @param inputs - Transport activity inputs
 * @returns Annual emissions in kg CO₂e rounded to nearest integer
 */
export function calcTransport(inputs: Partial<TransportInputs> = {}): number {
  const {
    carType = "car_petrol",
    carKmPerWeek = 0,
    motorbikeKmPerWeek = 0,
    busKmPerWeek = 0,
    trainKmPerWeek = 0,
    flightShortPerYear = 0,
    flightLongPerYear = 0,
    avgFlightKm = 1200,
  } = inputs;

  const carFactor =
    (FACTORS.transport as Record<string, number>)[carType] ??
    FACTORS.transport.car_petrol;

  const weekly =
    carFactor * carKmPerWeek +
    FACTORS.transport.motorcycle * motorbikeKmPerWeek +
    FACTORS.transport.bus * busKmPerWeek +
    FACTORS.transport.train * trainKmPerWeek;

  const annual =
    weekly * 52 +
    flightShortPerYear * avgFlightKm * FACTORS.transport.flight_short +
    flightLongPerYear * avgFlightKm * 2 * FACTORS.transport.flight_long;

  return Math.round(annual);
}

/**
 * Calculates annual home energy emissions in kg CO₂e.
 * Covers electricity, natural gas, and LPG consumption.
 * @param inputs - Energy consumption inputs
 * @returns Annual emissions in kg CO₂e rounded to nearest integer
 */
export function calcEnergy(inputs: Partial<EnergyInputs> = {}): number {
  const {
    electricityKwhPerMonth = 0,
    gasM3PerMonth = 0,
    lpgKgPerMonth = 0,
    gridRegion = "india",
  } = inputs;

  const electricityFactor =
    gridRegion === "india"
      ? FACTORS.energy.electricity_india
      : FACTORS.energy.electricity_world;

  const annual =
    electricityKwhPerMonth * 12 * electricityFactor +
    gasM3PerMonth * 12 * FACTORS.energy.natural_gas +
    lpgKgPerMonth * 12 * FACTORS.energy.lpg;

  return Math.round(annual);
}

/**
 * Calculates annual food-related emissions in kg CO₂e.
 * Uses lifecycle emission factors per kg of food consumed.
 * @param inputs - Weekly food consumption inputs
 * @returns Annual emissions in kg CO₂e rounded to nearest integer
 */
export function calcFood(inputs: Partial<FoodInputs> = {}): number {
  const {
    beefKgPerWeek = 0,
    lambKgPerWeek = 0,
    porkKgPerWeek = 0,
    chickenKgPerWeek = 0,
    fishKgPerWeek = 0,
    dairyKgPerWeek = 0,
    eggsPerWeek = 0,
    vegetablesKgPerWeek = 0,
    grainsKgPerWeek = 0,
    legumeKgPerWeek = 0,
  } = inputs;

  const weeklyKg =
    beefKgPerWeek * FACTORS.food.beef +
    lambKgPerWeek * FACTORS.food.lamb +
    porkKgPerWeek * FACTORS.food.pork +
    chickenKgPerWeek * FACTORS.food.chicken +
    fishKgPerWeek * FACTORS.food.fish +
    dairyKgPerWeek * FACTORS.food.dairy +
    eggsPerWeek * 0.06 * FACTORS.food.eggs +
    vegetablesKgPerWeek * FACTORS.food.vegetables +
    grainsKgPerWeek * FACTORS.food.grains +
    legumeKgPerWeek * FACTORS.food.legumes;

  return Math.round(weeklyKg * 52);
}

/**
 * Calculates annual shopping and consumption emissions in kg CO₂e.
 * Uses lifecycle assessment factors per item or kg of goods.
 * @param inputs - Shopping and consumption inputs
 * @returns Annual emissions in kg CO₂e rounded to nearest integer
 */
export function calcShopping(inputs: Partial<ShoppingInputs> = {}): number {
  const {
    clothingItemsPerYear = 0,
    electronicsPerYear = 0,
    furniturePerYear = 0,
    plasticKgPerMonth = 0,
    paperKgPerMonth = 0,
  } = inputs;

  const annual =
    clothingItemsPerYear * FACTORS.shopping.clothing +
    electronicsPerYear * FACTORS.shopping.electronics +
    furniturePerYear * FACTORS.shopping.furniture +
    plasticKgPerMonth * 12 * FACTORS.shopping.plastic +
    paperKgPerMonth * 12 * FACTORS.shopping.paper;

  return Math.round(annual);
}

/**
 * Sums all category emissions into a total annual footprint.
 * @param emissions - Per-category emission values in kg CO₂e
 * @returns Total annual emissions in kg CO₂e
 */
export function calcTotal(emissions: Partial<Emissions> = {}): number {
  const { transport = 0, energy = 0, food = 0, shopping = 0 } = emissions;
  return transport + energy + food + shopping;
}

/**
 * Converts raw emission values into percentage breakdown by category.
 * Returns all zeros if total is zero to avoid division by zero.
 * @param transport - Transport emissions in kg CO₂e
 * @param energy - Energy emissions in kg CO₂e
 * @param food - Food emissions in kg CO₂e
 * @param shopping - Shopping emissions in kg CO₂e
 * @returns Percentage breakdown per category (0-100)
 */
export function getBreakdown(
  transport: number,
  energy: number,
  food: number,
  shopping: number
): EmissionBreakdown {
  const total = calcTotal({ transport, energy, food, shopping });
  if (total === 0) return { transport: 0, energy: 0, food: 0, shopping: 0 };

  return {
    transport: Math.round((transport / total) * 100),
    energy:    Math.round((energy / total) * 100),
    food:      Math.round((food / total) * 100),
    shopping:  Math.round((shopping / total) * 100),
  };
}

/**
 * Calculates the gap between current emissions and the Paris 2050 target.
 * Target: 500 kg CO₂e per person per year (IPCC AR6 WG3).
 * @param totalKgPerYear - Current annual emissions in kg CO₂e
 * @returns Gap analysis including absolute gap and reduction percentage needed
 */
export function parisGap(totalKgPerYear: number): ParisGapResult {
  const gap = totalKgPerYear - PARIS_TARGET_2050;
  return {
    gap: Math.max(0, gap),
    onTrack: gap <= 0,
    reductionNeeded: Math.max(
      0,
      Math.round((gap / totalKgPerYear) * 100)
    ),
  };
}
