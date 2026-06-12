import { useState, useCallback } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import Calculator from "./components/Calculator";
import Results from "./components/Results";
import Insights from "./components/Insights";
import ActivityLog from "./components/ActivityLog";
import GlobalContext from "./components/GlobalContext";
import Footer from "./components/Footer";
import { calcTransport, calcEnergy, calcFood, calcShopping } from "./utils/emissions";

const DEFAULT_INPUTS = {
  transport: {
    carType: "car_petrol",
    carKmPerWeek: 0,
    motorbikeKmPerWeek: 0,
    busKmPerWeek: 0,
    trainKmPerWeek: 0,
    flightShortPerYear: 0,
    flightLongPerYear: 0,
    avgFlightKm: 1200,
  },
  energy: {
    electricityKwhPerMonth: 0,
    gasM3PerMonth: 0,
    lpgKgPerMonth: 0,
    gridRegion: "india",
  },
  food: {
    beefKgPerWeek: 0,
    lambKgPerWeek: 0,
    porkKgPerWeek: 0,
    chickenKgPerWeek: 0,
    fishKgPerWeek: 0,
    dairyKgPerWeek: 0,
    eggsPerWeek: 0,
    vegetablesKgPerWeek: 0,
    grainsKgPerWeek: 0,
    legumeKgPerWeek: 0,
  },
  shopping: {
    clothingItemsPerYear: 0,
    electronicsPerYear: 0,
    furniturePerYear: 0,
    plasticKgPerMonth: 0,
    paperKgPerMonth: 0,
  },
};

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);

  const updateSection = useCallback((section, values) => {
    setInputs((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  }, []);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true);
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setHasCalculated(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const emissions = {
    transport: calcTransport(inputs.transport),
    energy:    calcEnergy(inputs.energy),
    food:      calcFood(inputs.food),
    shopping:  calcShopping(inputs.shopping),
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header onReset={handleReset} />

      <main id="main-content">
        <Hero onStart={() =>
          document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
        } />

        <StatsStrip />

        <section id="calculator" aria-labelledby="calculator-heading">
          <Calculator
            inputs={inputs}
            onUpdate={updateSection}
            onCalculate={handleCalculate}
          />
        </section>

        {hasCalculated && (
          <>
            <section id="results" aria-labelledby="results-heading">
              <Results emissions={emissions} inputs={inputs} />
            </section>

            <section id="insights" aria-labelledby="insights-heading">
              <Insights
                transportInputs={inputs.transport}
                energyInputs={inputs.energy}
                foodInputs={inputs.food}
                shoppingInputs={inputs.shopping}
                emissions={emissions}
              />
            </section>
          </>
        )}

        <section id="activity" aria-labelledby="activity-heading">
          <ActivityLog />
        </section>

        <section id="global" aria-labelledby="global-heading">
          <GlobalContext emissions={emissions} hasCalculated={hasCalculated} />
        </section>
      </main>

      <Footer />
    </>
  );
}
