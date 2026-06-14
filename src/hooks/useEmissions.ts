/**
 * Custom hook that derives emission totals and breakdown from user inputs.
 * Memoises calculations so components never recompute on unrelated renders.
 */

import { useMemo } from "react";
import {
  calcTransport,
  calcEnergy,
  calcFood,
  calcShopping,
  calcTotal,
  getBreakdown,
  parisGap,
} from "../utils/emissions";
import type {
  TransportInputs,
  EnergyInputs,
  FoodInputs,
  ShoppingInputs,
  Emissions,
  EmissionBreakdown,
  ParisGapResult,
} from "../types";

interface UseEmissionsResult {
  emissions: Emissions;
  total: number;
  breakdown: EmissionBreakdown;
  gap: ParisGapResult;
  tCO2: string;
}

/**
 * Derives all emission-related values from the four input categories.
 * All values are memoised and only recompute when inputs change.
 * @param transport - Transport activity inputs
 * @param energy - Energy consumption inputs
 * @param food - Dietary inputs
 * @param shopping - Shopping and consumption inputs
 * @returns Emissions, total, breakdown percentages, Paris gap, and formatted total
 */
export function useEmissions(
  transport: Partial<TransportInputs>,
  energy: Partial<EnergyInputs>,
  food: Partial<FoodInputs>,
  shopping: Partial<ShoppingInputs>
): UseEmissionsResult {
  const emissions = useMemo<Emissions>(
    () => ({
      transport: calcTransport(transport),
      energy:    calcEnergy(energy),
      food:      calcFood(food),
      shopping:  calcShopping(shopping),
    }),
    [transport, energy, food, shopping]
  );

  const total = useMemo(() => calcTotal(emissions), [emissions]);

  const breakdown = useMemo(
    () =>
      getBreakdown(
        emissions.transport,
        emissions.energy,
        emissions.food,
        emissions.shopping
      ),
    [emissions]
  );

  const gap = useMemo(() => parisGap(total), [total]);

  const tCO2 = useMemo(() => (total / 1000).toFixed(2), [total]);

  return { emissions, total, breakdown, gap, tCO2 };
}
