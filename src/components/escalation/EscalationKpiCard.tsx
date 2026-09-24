import React from "react";

interface EscalationKpiCardProps {
  data: unknown;
  loading?: boolean;
}

type ApiRecord = Record<string, unknown>;
type NameValueRow = { name: string; value: number };

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
  { bg: "#F6DCE0", numColor: "#C6485A" },
];

// GET /escalation_dashboard/escalation_kpis.json?...&type=pie_chart hasn't
// been hit against a live backend from this environment. Two sibling
// "_dashboard" pie/category endpoints in this app (incident's
// cause_wise_incidents, confirmed live) return `response` as an array of
// { name, y } pairs rather than a flat { key: count } object, so — given the
// matching `type=pie_chart` param here — that shape is assumed first, with a
// flat-object fallback, and each of the 5 tiles below is matched by scanning
// row names for a keyword rather than trusting one exact field name.
function extractNameValueRows(raw: unknown): NameValueRow[] {
  if (!raw || typeof raw !== "object") return [];
  const record = raw as ApiRecord;
  const respVal = "response" in record ? record["response"] : raw;

  if (Array.isArray(respVal)) {
    return respVal
      .map((row): NameValueRow | null => {
        if (!row || typeof row !== "object") return null;
        const r = row as ApiRecord;
        const name = typeof r["name"] === "string" && r["name"].trim() !== "" ? (r["name"] as string) : "Unknown";
        const raw = r["y"] ?? r["value"] ?? r["count"];
        const num = typeof raw === "number" ? raw : Number(raw);
        if (!Number.isFinite(num)) return null;
        return { name, value: num };
      })
      .filter((r): r is NameValueRow => r !== null);
  }

  if (respVal && typeof respVal === "object" && !Array.isArray(respVal)) {
    return Object.entries(respVal as ApiRecord)
      .filter(([, v]) => typeof v === "number" || (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))))
      .map(([key, v]) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: Number(v),
      }));
  }

  return [];
}

function findByKeyword(rows: NameValueRow[], keywords: string[]): number {
  const row = rows.find((r) => keywords.some((k) => r.name.toLowerCase().includes(k)));
  return row ? row.value : 0;
}

const EscalationKpiCard: React.FC<EscalationKpiCardProps> = ({ data, loading = false }) => {
  const rows = extractNameValueRows(data);

  const openCount = findByKeyword(rows, ["open"]);
  const closeCount = findByKeyword(rows, ["close", "closed"]);
  const avgCount = findByKeyword(rows, ["average", "avg"]);
  const execCount = findByKeyword(rows, ["executive"]);

  const cards = [
    { label: "Open Escalations", value: openCount },
    { label: "Close Escalations", value: closeCount },
    { label: "Average Escalations", value: avgCount },
    { label: "Executive Escalations", value: execCount },
    { label: "Open & Close Escalations", value: `${openCount} / ${closeCount}` },
  ];

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
          Escalation Overview
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
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EscalationKpiCard;
