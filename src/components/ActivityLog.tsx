import { useState, useId } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ActivityEntry, ImpactLevel, Category } from "../types";

interface ActivityTypeOption {
  value: Category | "other";
  label: string;
  examples: string;
}

interface ImpactOption {
  value: ImpactLevel;
  label: string;
}

interface EntryRowProps {
  entry: ActivityEntry;
  onRemove: () => void;
}

const ACTIVITY_TYPES: ActivityTypeOption[] = [
  { value: "transport", label: "🚗 Transport", examples: "Walked to work, took the bus"           },
  { value: "energy",    label: "⚡ Energy",    examples: "Turned off AC, line-dried clothes"      },
  { value: "food",      label: "🥗 Food",      examples: "Ate plant-based meal, avoided beef"     },
  { value: "shopping",  label: "🛍️ Shopping",  examples: "Bought second-hand, skipped a purchase" },
  { value: "other",     label: "🌿 Other",     examples: "Planted a tree, composted waste"        },
];

const IMPACT_OPTIONS: ImpactOption[] = [
  { value: "high",   label: "High"   },
  { value: "medium", label: "Medium" },
  { value: "low",    label: "Low"    },
];

function today(): string {
  return new Date().toISOString().split("T")[0];
}

const SAMPLE_ENTRIES: ActivityEntry[] = [
  {
    id:          "sample-1",
    date:        today(),
    category:    "transport",
    description: "Cycled to work instead of driving",
    impact:      "high",
  },
  {
    id:          "sample-2",
    date:        today(),
    category:    "food",
    description: "Cooked a fully plant-based dinner",
    impact:      "medium",
  },
];

const DEFAULT_FORM = {
  date:        today(),
  category:    "transport" as Category | "other",
  description: "",
  impact:      "medium" as ImpactLevel,
};

export default function ActivityLog() {
  const [entries, setEntries] = useLocalStorage<ActivityEntry[]>(
    "ecotrace-activity-log",
    SAMPLE_ENTRIES
  );
  const [form, setForm]         = useState(DEFAULT_FORM);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const descId = useId();

  const setField =
    <K extends keyof typeof DEFAULT_FORM>(key: K) =>
    (val: (typeof DEFAULT_FORM)[K]) =>
      setForm((f) => ({ ...f, [key]: val }));

  const handleAdd = () => {
    if (!form.description.trim()) {
      setError("Please describe the activity.");
      return;
    }
    if (form.description.trim().length < 5) {
      setError("Description is too short — add a few more words.");
      return;
    }
    setError("");
    setEntries((prev) => [
      {
        ...form,
        id: `entry-${Date.now()}`,
        description: form.description.trim(),
      },
      ...prev,
    ]);
    setForm(DEFAULT_FORM);
    setShowForm(false);
  };

  const handleRemove = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const grouped = entries.reduce<Record<string, ActivityEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const streakDays = (() => {
    const dates = [...new Set(entries.map((e) => e.date))].sort((a, b) =>
      b.localeCompare(a)
    );
    if (dates.length === 0) return 0;
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    let cursorTime = cursor.getTime();
    for (const d of dates) {
      const entryDate = new Date(d).getTime();
      const diff = Math.round((cursorTime - entryDate) / 86400000);
      if (diff <= 1) {
        streak++;
        cursorTime = entryDate;
      } else break;
    }
    return streak;
  })();

  return (
    <div
      className="section"
      style={{ background: "#fff", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--space-8)",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <span
              className="badge badge-green"
              style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}
            >
              Daily habits
            </span>
            <h2 id="activity-heading" style={{ marginBottom: "var(--space-2)" }}>
              Activity log
            </h2>
            <p style={{ maxWidth: "48ch" }}>
              Track the eco-friendly choices you make each day. Small actions
              compound into real change.
            </p>
          </div>

          {streakDays > 0 && (
            <div
              className="card animate-pulse-green"
              style={{
                textAlign: "center",
                padding: "var(--space-4) var(--space-6)",
                borderColor: "var(--green-300)",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "1.75rem" }}>🔥</div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--green-600)",
                  lineHeight: 1,
                }}
              >
                {streakDays}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginTop: 2 }}>
                day streak
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
          className="activity-summary"
        >
          {ACTIVITY_TYPES.slice(0, 4).map(({ value, label }) => {
            const count = entries.filter((e) => e.category === value).length;
            return (
              <div
                key={value}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "var(--space-4)",
                  background: count > 0 ? "var(--green-50)" : "var(--gray-50)",
                  borderColor: count > 0 ? "var(--green-200)" : "var(--color-border)",
                }}
              >
                <div style={{ fontSize: "1.25rem" }}>{label.split(" ")[0]}</div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: count > 0 ? "var(--green-600)" : "var(--gray-400)",
                    lineHeight: 1.1,
                  }}
                >
                  {count}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>
                  {label.split(" ").slice(1).join(" ")}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: "var(--space-6)" }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm((v) => !v)}
            aria-expanded={showForm}
            aria-controls="add-entry-form"
          >
            {showForm ? "✕ Cancel" : "+ Log an activity"}
          </button>
        </div>

        {showForm && (
          <div
            id="add-entry-form"
            className="card"
            style={{
              marginBottom: "var(--space-8)",
              borderColor: "var(--green-200)",
              animation: "fadeUp var(--transition-base) ease",
            }}
          >
            <h3 style={{ fontSize: "1rem", marginBottom: "var(--space-5)" }}>
              Log a new activity
            </h3>

            <div className="grid-2" style={{ marginBottom: "var(--space-4)" }}>
              <div className="form-group">
                <label htmlFor="entry-date">Date</label>
                <input
                  id="entry-date"
                  type="date"
                  value={form.date}
                  max={today()}
                  onChange={(e) => setField("date")(e.target.value)}
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9375rem",
                    fontFamily: "var(--font-sans)",
                    color: "var(--gray-900)",
                    background: "#fff",
                    width: "100%",
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="entry-category">Category</label>
                <select
                  id="entry-category"
                  value={form.category}
                  onChange={(e) =>
                    setField("category")(e.target.value as Category | "other")
                  }
                  aria-label="Activity category"
                >
                  {ACTIVITY_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor={descId}>
                What did you do?
                <span
                  style={{
                    fontWeight: 400,
                    color: "var(--gray-400)",
                    marginLeft: "var(--space-2)",
                  }}
                >
                  ({ACTIVITY_TYPES.find((t) => t.value === form.category)?.examples})
                </span>
              </label>
              <input
                id={descId}
                type="text"
                value={form.description}
                onChange={(e) => setField("description")(e.target.value)}
                placeholder="e.g. Cycled 8 km to work instead of driving"
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                aria-describedby={error ? "entry-error" : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <span
                  id="entry-error"
                  role="alert"
                  style={{
                    fontSize: "0.8125rem",
                    color: "#dc2626",
                    marginTop: "var(--space-1)",
                  }}
                >
                  {error}
                </span>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "var(--space-5)" }}>
              <label>Impact level</label>
              <div
                style={{ display: "flex", gap: "var(--space-2)" }}
                role="radiogroup"
                aria-label="Impact level"
              >
                {IMPACT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    role="radio"
                    aria-checked={form.impact === value}
                    onClick={() => setField("impact")(value)}
                    className={`btn btn-sm ${
                      form.impact === value
                        ? value === "high"
                          ? "btn-primary"
                          : "btn-outline"
                        : "btn-ghost"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleAdd}>
              Add to log
            </button>
          </div>
        )}

        {entries.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "var(--space-12)",
              color: "var(--gray-400)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>📋</div>
            <p style={{ color: "var(--gray-400)" }}>
              No activities logged yet. Add your first one above.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}
            aria-label="Activity log entries"
            role="list"
          >
            {sortedDates.map((date) => (
              <div key={date} role="listitem">
                <div
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--gray-500)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
                    weekday: "long",
                    year:    "numeric",
                    month:   "long",
                    day:     "numeric",
                  })}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
                >
                  {grouped[date].map((entry) => (
                    <EntryRow
                      key={entry.id}
                      entry={entry}
                      onRemove={() => handleRemove(entry.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .activity-summary { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .activity-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function EntryRow({ entry, onRemove }: EntryRowProps) {
  const meta = ACTIVITY_TYPES.find((t) => t.value === entry.category);

  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        borderLeft: `3px solid ${
          entry.impact === "high"
            ? "var(--green-500)"
            : entry.impact === "medium"
            ? "#f59e0b"
            : "var(--gray-300)"
        }`,
      }}
    >
      <span style={{ fontSize: "1.25rem", flexShrink: 0 }} aria-hidden="true">
        {meta?.label.split(" ")[0] ?? "🌿"}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: "0.9375rem",
          color: "var(--gray-800)",
          lineHeight: 1.4,
        }}
      >
        {entry.description}
      </span>
      <span className={`badge badge-${entry.impact}`} style={{ flexShrink: 0 }}>
        {entry.impact}
      </span>
      <button
        onClick={onRemove}
        aria-label={`Remove entry: ${entry.description}`}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--gray-400)",
          fontSize: "1rem",
          padding: "var(--space-1)",
          borderRadius: "var(--radius-sm)",
          transition: "color var(--transition-fast)",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gray-400)")}
      >
        ✕
      </button>
    </div>
  );
}
