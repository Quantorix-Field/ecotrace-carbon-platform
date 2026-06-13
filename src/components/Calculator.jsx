import { useState } from "react";
import PropTypes from "prop-types";

const TABS = [
  { id: "transport", label: "🚗 Transport" },
  { id: "energy",    label: "⚡ Energy"    },
  { id: "food",      label: "🥗 Food"      },
  { id: "shopping",  label: "🛍️ Shopping"  },
];

export default function Calculator({ inputs, onUpdate, onCalculate }) {
  const [activeTab, setActiveTab] = useState("transport");

  return (
    <div
      className="section"
      style={{ background: "var(--gray-50)", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
          <span className="badge badge-green" style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}>
            Step 1 — Enter your data
          </span>
          <h2 id="calculator-heading">Calculate your carbon footprint</h2>
          <p style={{ maxWidth: "54ch", marginInline: "auto", marginTop: "var(--space-3)" }}>
            Fill in what applies to you. Leave anything you don't do at zero.
            Emission factors are sourced from IPCC AR6 WG3 and IEA 2024.
          </p>
        </div>

        <div className="card card-elevated" style={{ maxWidth: 780, marginInline: "auto" }}>
          <div className="tabs" style={{ marginBottom: "var(--space-8)", width: "100%" }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                className={`tab${activeTab === id ? " active" : ""}`}
                onClick={() => setActiveTab(id)}
                aria-selected={activeTab === id}
                role="tab"
                aria-controls={`panel-${id}`}
                id={`tab-${id}`}
                style={{ flex: 1, textAlign: "center" }}
              >
                {label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
            {activeTab === "transport" && (
              <TransportForm values={inputs.transport} onChange={(v) => onUpdate("transport", v)} />
            )}
            {activeTab === "energy" && (
              <EnergyForm values={inputs.energy} onChange={(v) => onUpdate("energy", v)} />
            )}
            {activeTab === "food" && (
              <FoodForm values={inputs.food} onChange={(v) => onUpdate("food", v)} />
            )}
            {activeTab === "shopping" && (
              <ShoppingForm values={inputs.shopping} onChange={(v) => onUpdate("shopping", v)} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "var(--space-8)",
              paddingTop: "var(--space-6)",
              borderTop: "1px solid var(--color-border)",
              flexWrap: "wrap",
              gap: "var(--space-3)",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const idx = TABS.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1].id);
                }}
                disabled={activeTab === TABS[0].id}
                style={{ opacity: activeTab === TABS[0].id ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const idx = TABS.findIndex((t) => t.id === activeTab);
                  if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id);
                }}
                disabled={activeTab === TABS[TABS.length - 1].id}
                style={{ opacity: activeTab === TABS[TABS.length - 1].id ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>

            <button className="btn btn-primary" onClick={onCalculate}>
              Calculate my footprint →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="form-group">
      <label>
        {label}
        {hint && (
          <span style={{ fontWeight: 400, color: "var(--gray-400)", marginLeft: "var(--space-2)" }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function NumInput({ id, value, onChange, min = 0, max, step = 1, placeholder = "0" }) {
  return (
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      step={step}
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      aria-label={id}
    />
  );
}

function Row({ children }) {
  return (
    <div className="grid-2" style={{ marginBottom: "var(--space-5)" }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h4
      style={{
        color: "var(--green-700)",
        marginBottom: "var(--space-4)",
        marginTop: "var(--space-2)",
        fontSize: "0.8125rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 700,
      }}
    >
      {children}
    </h4>
  );
}

function TransportForm({ values, onChange }) {
  const set = (key) => (val) => onChange({ [key]: val });

  return (
    <div>
      <SectionTitle>Personal vehicle</SectionTitle>
      <Row>
        <Field label="Car type">
          <select
            value={values.carType}
            onChange={(e) => onChange({ carType: e.target.value })}
            aria-label="Car type"
          >
            <option value="car_petrol">Petrol car</option>
            <option value="car_diesel">Diesel car</option>
            <option value="car_electric">Electric car</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </Field>
        <Field label="Driving distance" hint="km / week">
          <NumInput id="carKmPerWeek" value={values.carKmPerWeek} onChange={set("carKmPerWeek")} />
        </Field>
      </Row>
      <Row>
        <Field label="Motorbike" hint="km / week">
          <NumInput id="motorbikeKmPerWeek" value={values.motorbikeKmPerWeek} onChange={set("motorbikeKmPerWeek")} />
        </Field>
        <Field label="Bus / auto-rickshaw" hint="km / week">
          <NumInput id="busKmPerWeek" value={values.busKmPerWeek} onChange={set("busKmPerWeek")} />
        </Field>
      </Row>
      <Row>
        <Field label="Train / metro" hint="km / week">
          <NumInput id="trainKmPerWeek" value={values.trainKmPerWeek} onChange={set("trainKmPerWeek")} />
        </Field>
      </Row>

      <SectionTitle>Flights</SectionTitle>
      <Row>
        <Field label="Short-haul flights" hint="trips / year, <1500 km">
          <NumInput id="flightShortPerYear" value={values.flightShortPerYear} onChange={set("flightShortPerYear")} />
        </Field>
        <Field label="Long-haul flights" hint="trips / year, ≥1500 km">
          <NumInput id="flightLongPerYear" value={values.flightLongPerYear} onChange={set("flightLongPerYear")} />
        </Field>
      </Row>
    </div>
  );
}

function EnergyForm({ values, onChange }) {
  const set = (key) => (val) => onChange({ [key]: val });

  return (
    <div>
      <SectionTitle>Electricity</SectionTitle>
      <Row>
        <Field label="Grid region">
          <select
            value={values.gridRegion}
            onChange={(e) => onChange({ gridRegion: e.target.value })}
            aria-label="Grid region"
          >
            <option value="india">India (0.716 kg CO₂e/kWh)</option>
            <option value="world">World avg (0.436 kg CO₂e/kWh)</option>
          </select>
        </Field>
        <Field label="Monthly consumption" hint="kWh / month">
          <NumInput id="electricityKwhPerMonth" value={values.electricityKwhPerMonth} onChange={set("electricityKwhPerMonth")} />
        </Field>
      </Row>

      <SectionTitle>Cooking &amp; heating fuel</SectionTitle>
      <Row>
        <Field label="LPG usage" hint="kg / month">
          <NumInput id="lpgKgPerMonth" value={values.lpgKgPerMonth} onChange={set("lpgKgPerMonth")} step={0.5} />
        </Field>
        <Field label="Natural gas" hint="m³ / month">
          <NumInput id="gasM3PerMonth" value={values.gasM3PerMonth} onChange={set("gasM3PerMonth")} step={0.5} />
        </Field>
      </Row>
    </div>
  );
}

function FoodForm({ values, onChange }) {
  const set = (key) => (val) => onChange({ [key]: val });

  return (
    <div>
      <SectionTitle>Meat &amp; animal products</SectionTitle>
      <Row>
        <Field label="Beef / veal" hint="kg / week">
          <NumInput id="beefKgPerWeek" value={values.beefKgPerWeek} onChange={set("beefKgPerWeek")} step={0.1} />
        </Field>
        <Field label="Lamb / goat" hint="kg / week">
          <NumInput id="lambKgPerWeek" value={values.lambKgPerWeek} onChange={set("lambKgPerWeek")} step={0.1} />
        </Field>
      </Row>
      <Row>
        <Field label="Pork" hint="kg / week">
          <NumInput id="porkKgPerWeek" value={values.porkKgPerWeek} onChange={set("porkKgPerWeek")} step={0.1} />
        </Field>
        <Field label="Chicken / poultry" hint="kg / week">
          <NumInput id="chickenKgPerWeek" value={values.chickenKgPerWeek} onChange={set("chickenKgPerWeek")} step={0.1} />
        </Field>
      </Row>
      <Row>
        <Field label="Fish / seafood" hint="kg / week">
          <NumInput id="fishKgPerWeek" value={values.fishKgPerWeek} onChange={set("fishKgPerWeek")} step={0.1} />
        </Field>
        <Field label="Dairy (milk, cheese, yoghurt)" hint="kg / week">
          <NumInput id="dairyKgPerWeek" value={values.dairyKgPerWeek} onChange={set("dairyKgPerWeek")} step={0.1} />
        </Field>
      </Row>
      <Row>
        <Field label="Eggs" hint="eggs / week">
          <NumInput id="eggsPerWeek" value={values.eggsPerWeek} onChange={set("eggsPerWeek")} />
        </Field>
      </Row>

      <SectionTitle>Plant-based foods</SectionTitle>
      <Row>
        <Field label="Vegetables" hint="kg / week">
          <NumInput id="vegetablesKgPerWeek" value={values.vegetablesKgPerWeek} onChange={set("vegetablesKgPerWeek")} step={0.1} />
        </Field>
        <Field label="Grains / rice / bread" hint="kg / week">
          <NumInput id="grainsKgPerWeek" value={values.grainsKgPerWeek} onChange={set("grainsKgPerWeek")} step={0.1} />
        </Field>
      </Row>
      <Row>
        <Field label="Legumes / lentils / beans" hint="kg / week">
          <NumInput id="legumeKgPerWeek" value={values.legumeKgPerWeek} onChange={set("legumeKgPerWeek")} step={0.1} />
        </Field>
      </Row>
    </div>
  );
}

function ShoppingForm({ values, onChange }) {
  const set = (key) => (val) => onChange({ [key]: val });

  return (
    <div>
      <SectionTitle>Goods &amp; purchases</SectionTitle>
      <Row>
        <Field label="Clothing items bought" hint="items / year">
          <NumInput id="clothingItemsPerYear" value={values.clothingItemsPerYear} onChange={set("clothingItemsPerYear")} />
        </Field>
        <Field label="Electronic devices" hint="items / year">
          <NumInput id="electronicsPerYear" value={values.electronicsPerYear} onChange={set("electronicsPerYear")} />
        </Field>
      </Row>
      <Row>
        <Field label="Furniture / large items" hint="items / year">
          <NumInput id="furniturePerYear" value={values.furniturePerYear} onChange={set("furniturePerYear")} />
        </Field>
        <Field label="Single-use plastic" hint="kg / month">
          <NumInput id="plasticKgPerMonth" value={values.plasticKgPerMonth} onChange={set("plasticKgPerMonth")} step={0.1} />
        </Field>
      </Row>
      <Row>
        <Field label="Paper / cardboard waste" hint="kg / month">
          <NumInput id="paperKgPerMonth" value={values.paperKgPerMonth} onChange={set("paperKgPerMonth")} step={0.1} />
        </Field>
      </Row>
    </div>
  );
}

const transportShape = PropTypes.shape({
  carType: PropTypes.string,
  carKmPerWeek: PropTypes.number,
  motorbikeKmPerWeek: PropTypes.number,
  busKmPerWeek: PropTypes.number,
  trainKmPerWeek: PropTypes.number,
  flightShortPerYear: PropTypes.number,
  flightLongPerYear: PropTypes.number,
  avgFlightKm: PropTypes.number,
});

const energyShape = PropTypes.shape({
  electricityKwhPerMonth: PropTypes.number,
  gasM3PerMonth: PropTypes.number,
  lpgKgPerMonth: PropTypes.number,
  gridRegion: PropTypes.string,
});

const foodShape = PropTypes.shape({
  beefKgPerWeek: PropTypes.number,
  lambKgPerWeek: PropTypes.number,
  porkKgPerWeek: PropTypes.number,
  chickenKgPerWeek: PropTypes.number,
  fishKgPerWeek: PropTypes.number,
  dairyKgPerWeek: PropTypes.number,
  eggsPerWeek: PropTypes.number,
  vegetablesKgPerWeek: PropTypes.number,
  grainsKgPerWeek: PropTypes.number,
  legumeKgPerWeek: PropTypes.number,
});

const shoppingShape = PropTypes.shape({
  clothingItemsPerYear: PropTypes.number,
  electronicsPerYear: PropTypes.number,
  furniturePerYear: PropTypes.number,
  plasticKgPerMonth: PropTypes.number,
  paperKgPerMonth: PropTypes.number,
});

Calculator.propTypes = {
  inputs: PropTypes.shape({
    transport: transportShape,
    energy:    energyShape,
    food:      foodShape,
    shopping:  shoppingShape,
  }).isRequired,
  onUpdate:    PropTypes.func.isRequired,
  onCalculate: PropTypes.func.isRequired,
};

TransportForm.propTypes = { values: transportShape.isRequired, onChange: PropTypes.func.isRequired };
EnergyForm.propTypes    = { values: energyShape.isRequired,    onChange: PropTypes.func.isRequired };
FoodForm.propTypes      = { values: foodShape.isRequired,      onChange: PropTypes.func.isRequired };
ShoppingForm.propTypes  = { values: shoppingShape.isRequired,  onChange: PropTypes.func.isRequired };
Field.propTypes         = { label: PropTypes.string.isRequired, hint: PropTypes.string, children: PropTypes.node.isRequired };
NumInput.propTypes      = { id: PropTypes.string.isRequired, value: PropTypes.number, onChange: PropTypes.func.isRequired, min: PropTypes.number, max: PropTypes.number, step: PropTypes.number, placeholder: PropTypes.string };
Row.propTypes           = { children: PropTypes.node.isRequired };
SectionTitle.propTypes  = { children: PropTypes.node.isRequired };
