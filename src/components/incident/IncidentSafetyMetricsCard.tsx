import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IncidentSafetyMetricsCardProps {
  data: unknown;
  loading?: boolean;
}

type ApiRecord = Record<string, unknown>;

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
];

// Confirmed live shape of GET /incident_dashboard/safety_metrics.json —
// unlike most other not-yet-confirmed endpoints in this app, this one HAS
// been checked against a real response:
//   {
//     success, message,
//     card_incidentNearMissAndGoodCatch: { response: <number>, info: {...}, ... },
//     card_incidentPerSquareFit:          { response: <number>, info: {...}, ... },
//     get_SafeManHours:                   { response: <number>, info: {...}, ... },
//   }
// Each metric is its own sub-object keyed by a card_*/get_* name, with the
// actual number under `.response` and a human-readable blurb under
// `.info.info` (falling back to `.info.formula`/`.info.Formula`).
//
// LTIR and Zero Incident Days did NOT appear anywhere in the confirmed
// response — the backend may not have those two cards implemented yet, or
// they're conditional on data this sample didn't have. Their key names below
// are therefore still guesses (several candidates), so they'll render 0
// until confirmed for real.
function getCard(record: ApiRecord | null, keys: string[]): ApiRecord | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as ApiRecord;
  }
  return null;
}

function cardValue(card: ApiRecord | null): number {
  if (!card) return 0;
  const value = card["response"];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return 0;
}

function cardInfo(card: ApiRecord | null): string | undefined {
  const info = card?.["info"];
  if (!info || typeof info !== "object") return undefined;
  const row = info as ApiRecord;
  for (const key of ["info", "formula", "Formula"]) {
    const value = row[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return undefined;
}

const METRICS: { label: string; cardKeys: string[] }[] = [
  {
    label: "LTIR",
    cardKeys: ["card_LTIR", "get_LTIR", "card_ltir", "card_Ltir"],
  },
  {
    label: "Zero Incident Days",
    cardKeys: ["card_ZeroIncidentDays", "get_ZeroIncidentDays", "card_zeroIncidentDays"],
  },
  {
    label: "Incident Per Million Sq Ft Per Annum",
    cardKeys: ["card_incidentPerSquareFit", "card_incidentPerMillionSqFt"],
  },
  {
    label: "Incident Near Miss Good Catch Per Million Sq Ft Per Annum",
    cardKeys: ["card_incidentNearMissAndGoodCatch"],
  },
  {
    label: "Safe Man-Hours",
    cardKeys: ["get_SafeManHours", "card_SafeManHours"],
  },
];

const IncidentSafetyMetricsCard: React.FC<IncidentSafetyMetricsCardProps> = ({ data, loading = false }) => {
  const record = data && typeof data === "object" && !Array.isArray(data) ? (data as ApiRecord) : null;

  const cards = METRICS.map(({ label, cardKeys }) => {
    const card = getCard(record, cardKeys);
    return {
      label,
      value: cardValue(card),
      info: cardInfo(card),
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
        <h3
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Incident Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, index) => {
          const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
          return (
            <div
              key={card.label}
              className="rounded-2xl p-6 text-center overflow-hidden relative"
              style={{ backgroundColor: cardStyle.bg }}
            >
              {card.info && (
                <div className="absolute top-3 right-3">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                          <Info className="w-4 h-4" style={{ color: cardStyle.numColor }} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                        <p className="text-sm leading-snug">{card.info}</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className="text-sm text-gray-600 font-medium mb-3 leading-tight break-words">
                {card.label}
              </div>
              {loading ? (
                <div
                  className="h-8 rounded animate-pulse mx-auto w-3/4"
                  style={{ backgroundColor: `${cardStyle.numColor}33` }}
                />
              ) : (
                <div className="text-3xl font-extrabold" style={{ color: cardStyle.numColor }}>
                  {Number(card.value).toLocaleString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentSafetyMetricsCard;
