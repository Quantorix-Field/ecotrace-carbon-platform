// ─── Emission Inputs ─────────────────────────────────────────────────────────

export interface TransportInputs {
  carType: string;
  carKmPerWeek: number;
  motorbikeKmPerWeek: number;
  busKmPerWeek: number;
  trainKmPerWeek: number;
  flightShortPerYear: number;
  flightLongPerYear: number;
  avgFlightKm: number;
}

export interface EnergyInputs {
  electricityKwhPerMonth: number;
  gasM3PerMonth: number;
  lpgKgPerMonth: number;
  gridRegion: "india" | "world";
}

export interface FoodInputs {
  beefKgPerWeek: number;
  lambKgPerWeek: number;
  porkKgPerWeek: number;
  chickenKgPerWeek: number;
  fishKgPerWeek: number;
  dairyKgPerWeek: number;
  eggsPerWeek: number;
  vegetablesKgPerWeek: number;
  grainsKgPerWeek: number;
  legumeKgPerWeek: number;
}

export interface ShoppingInputs {
  clothingItemsPerYear: number;
  electronicsPerYear: number;
  furniturePerYear: number;
  plasticKgPerMonth: number;
  paperKgPerMonth: number;
}

export interface AllInputs {
  transport: TransportInputs;
  energy: EnergyInputs;
  food: FoodInputs;
  shopping: ShoppingInputs;
}

// ─── Emissions Results ────────────────────────────────────────────────────────

export interface Emissions {
  transport: number;
  energy: number;
  food: number;
  shopping: number;
}

export interface EmissionBreakdown {
  transport: number;
  energy: number;
  food: number;
  shopping: number;
}

export interface ParisGapResult {
  gap: number;
  onTrack: boolean;
  reductionNeeded: number;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type ImpactLevel = "high" | "medium" | "low";
export type EffortLevel = "high" | "medium" | "low";
export type Timeframe = "immediate" | "short-term" | "long-term";
export type Category = "transport" | "energy" | "food" | "shopping";

export interface Action {
  id: string;
  category: Category;
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  timeframe: Timeframe;
  estimatedSaving: number;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  date: string;
  category: Category | "other";
  description: string;
  impact: ImpactLevel;
}

// ─── Global Context ───────────────────────────────────────────────────────────

export interface Region {
  key: string;
  flag: string;
  name: string;
  benchmark: number;
  population: string;
  note: string;
  color: string;
}
