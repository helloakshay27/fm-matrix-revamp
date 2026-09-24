import React from "react";

interface ServicePartnerEvaluationCardProps {
  data: unknown;
}

type ApiRecord = Record<string, unknown>;

// GET /escalation_dashboard/service_partner_evaluation.json hasn't been hit
// against a live backend from this environment, so the row shape is fully
// unknown. Rather than guess exact column names and risk showing nothing (as
// happened with cause_wise_incidents/safety_metrics before their real shapes
// were confirmed), this renders whatever columns the first row actually has
// — humanized from their key names — so real data always shows up, however
// the backend happens to name its fields.
function extractRows(raw: unknown): ApiRecord[] {
  if (Array.isArray(raw)) return raw.filter((r): r is ApiRecord => !!r && typeof r === "object");
  if (raw && typeof raw === "object") {
    const record = raw as ApiRecord;
    const resp = record["response"];
    if (Array.isArray(resp)) return resp.filter((r): r is ApiRecord => !!r && typeof r === "object");
  }
  return [];
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCell(value: unknown): string {
  if (value == null) return "-";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const MAX_COLUMNS = 6;
const MAX_ROWS = 20;

const ServicePartnerEvaluationCard: React.FC<ServicePartnerEvaluationCardProps> = ({ data }) => {
  const rows = extractRows(data);
  const columns = rows.length > 0 ? Object.keys(rows[0]).slice(0, MAX_COLUMNS) : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Service Partner Evaluation</h3>
      </div>

      {rows.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">No service partner evaluation data found.</div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-gray-200 mx-4 mb-4 mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th
                    className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center"
                    style={{ backgroundColor: "#D97655" }}
                  >
                    Sr.
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center"
                      style={{ backgroundColor: "#D97655" }}
                    >
                      {humanize(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, MAX_ROWS).map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#F6F4EE" }}>
                    <td className="px-4 py-3 text-left text-gray-500 font-medium text-xs border-b border-gray-100 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c}
                        className="px-4 py-3 text-left text-gray-700 text-xs border-b border-gray-100 whitespace-nowrap"
                      >
                        {formatCell(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {rows.length > MAX_ROWS && (
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
          Showing first {MAX_ROWS} of {rows.length} records
        </div>
      )}
    </div>
  );
};

export default ServicePartnerEvaluationCard;
