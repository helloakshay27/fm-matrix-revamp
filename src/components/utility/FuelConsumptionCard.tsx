import React from "react";

interface Props {
  data: any;
}

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "rgba(183,220,212,0.30)", numColor: "#2E7D6B" },
  { bg: "rgba(227,144,144,0.15)", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
];

const EXTRA_FIELD_LABELS: Record<string, string> = {
  factor: "Factor",
  area: "Area (sq ft)",
  power_value: "Power Value",
  incidents: "Incidents",
};

function humanize(key: string): string {
  return EXTRA_FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatVal(val: unknown): string {
  return val !== null && val !== undefined && val !== "" && !Number.isNaN(Number(val))
    ? Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "0";
}

// /utility_dashboard/card_fuel_consumption.json hasn't been hit against a
// live backend from this environment. Its sibling "card_*" utility endpoints
// in this app (EnergyIntensityCard, CarbonEmissionCard — both confirmed
// working) return a flat, non-enveloped object with the headline number
// under `response` plus a few sibling numeric fields (factor, area, ...), so
// that same shape is assumed here: a "Fuel Consumption" tile from `response`,
// plus whatever other numeric top-level fields the response actually has.
const FuelConsumptionCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};

  const extraStats = Object.entries(root)
    .filter(([key, val]) => key !== "response" && key !== "success" && key !== "message" && key !== "info")
    .filter(([, val]) => typeof val === "number" || (typeof val === "string" && val.trim() !== "" && !Number.isNaN(Number(val))))
    .map(([key, val]) => ({ label: humanize(key), value: formatVal(val) }));

  const stats = [{ label: "Fuel Consumption", value: formatVal(root.response) }, ...extraStats];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: "Work Sans, sans-serif" }}>
          Fuel Consumption
        </h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div key={s.label} className="rounded-2xl px-4 py-6 text-center" style={{ backgroundColor: style.bg }}>
                <div
                  className="text-xl font-bold mb-1 break-words leading-tight"
                  style={{ color: style.numColor, fontFamily: "Work Sans, sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-snug">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FuelConsumptionCard;
