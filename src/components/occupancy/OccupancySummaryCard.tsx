import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface OccupancySummaryCardProps {
  startDate?: string;
  endDate?: string;
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

// The 3 occupany_dashboard endpoints below (per the "fm" Postman collection
// at the repo root — note "occupany" is the live path spelling, not a typo
// introduced here) haven't been hit against a live backend from this
// environment, so every value is read tolerantly (several likely key-name
// candidates, plus a couple of common envelope/array shapes seen on sibling
// "_dashboard" endpoints elsewhere in this app) instead of trusting one exact
// field name.
function pickNumber(raw: unknown, keys: string[]): number {
  if (!raw || typeof raw !== "object") return 0;
  const record = raw as ApiRecord;
  const candidates: unknown[] = [record];
  if ("response" in record) candidates.unshift(record["response"]);
  if ("data" in record) candidates.push(record["data"]);

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) return candidate;
    if (Array.isArray(candidate)) return candidate.length;
    if (candidate && typeof candidate === "object") {
      const obj = candidate as ApiRecord;
      for (const key of keys) {
        const value = obj[key];
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
          return Number(value);
        }
      }
    }
  }
  return 0;
}

// GET /occupany_dashboard/get_flat_occupancy.json hasn't been hit against a
// live backend from this environment. Sibling "_dashboard" pie/category
// endpoints elsewhere in this app (confirmed live) return `response` as an
// array of { name, y } pairs rather than a flat { key: count } object, so
// that shape is tried first here too, falling back to a flat object — then
// each of Occupied/Non-Occupied is matched by scanning row names for a
// keyword rather than trusting one exact field name.
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
        const rawVal = r["y"] ?? r["value"] ?? r["count"];
        const num = typeof rawVal === "number" ? rawVal : Number(rawVal);
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

function findByKeyword(rows: NameValueRow[], keywords: string[], excludeKeywords: string[] = []): number {
  const row = rows.find(
    (r) =>
      keywords.some((k) => r.name.toLowerCase().includes(k)) &&
      !excludeKeywords.some((k) => r.name.toLowerCase().includes(k))
  );
  return row ? row.value : 0;
}

const OccupancySummaryCard: React.FC<OccupancySummaryCardProps> = ({ startDate, endDate }) => {
  const [fitoutData, setFitoutData] = useState<unknown>(null);
  const [usersData, setUsersData] = useState<unknown>(null);
  const [downloadsData, setDownloadsData] = useState<unknown>(null);
  const [occupancyData, setOccupancyData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const siteId = localStorage.getItem("selectedSiteId") || "";
      const fromDate = startDate || "2020-01-01";
      const toDate = endDate || new Date().toISOString().split("T")[0];

      const params = new URLSearchParams({ from_date: fromDate, to_date: toDate });
      if (siteId) params.set("site_id", siteId);
      const qs = params.toString();

      const [fitoutRes, usersRes, downloadsRes, occupancyRes] = await Promise.all([
        fetch(`${getFullUrl("/occupany_dashboard/get_fitout_flat")}?${qs}`, getAuthenticatedFetchOptions()),
        fetch(`${getFullUrl("/occupany_dashboard/get_total_users")}?${qs}`, getAuthenticatedFetchOptions()),
        fetch(`${getFullUrl("/occupany_dashboard/get_total_downloads")}?${qs}`, getAuthenticatedFetchOptions()),
        fetch(`${getFullUrl("/occupany_dashboard/get_flat_occupancy")}?${qs}`, getAuthenticatedFetchOptions()),
      ]);

      if (!fitoutRes.ok) throw new Error(`HTTP ${fitoutRes.status}`);
      if (!usersRes.ok) throw new Error(`HTTP ${usersRes.status}`);
      if (!downloadsRes.ok) throw new Error(`HTTP ${downloadsRes.status}`);
      if (!occupancyRes.ok) throw new Error(`HTTP ${occupancyRes.status}`);

      const [fitout, users, downloads, occupancy] = await Promise.all([
        fitoutRes.json(),
        usersRes.json(),
        downloadsRes.json(),
        occupancyRes.json(),
      ]);

      setFitoutData(fitout);
      setUsersData(users);
      setDownloadsData(downloads);
      setOccupancyData(occupancy);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const occupancyRows = extractNameValueRows(occupancyData);
  const occupiedCount = findByKeyword(occupancyRows, ["occupied", "occupancy"], ["non", "un", "vacant"]);
  const nonOccupiedCount = findByKeyword(occupancyRows, ["non_occupied", "non-occupied", "unoccupied", "vacant", "not_occupied", "non occupied"]);

  const cards = [
    {
      label: "FitOut",
      value: pickNumber(fitoutData, ["fitout", "fitout_count", "total_fitout", "fitout_flats", "count", "total"]),
    },
    {
      label: "Total Registered User",
      value: pickNumber(usersData, ["total_users", "registered_users", "total_registered_users", "users", "count", "total"]),
    },
    {
      label: "Total Downloads",
      value: pickNumber(downloadsData, ["total_downloads", "downloads", "download_count", "count", "total"]),
    },
    {
      label: "Occupied",
      value: occupiedCount,
    },
    {
      label: "Non-Occupied",
      value: nonOccupiedCount,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <div className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3 flex items-center justify-between">
        <h3
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Occupancy Summary
        </h3>
        <RefreshCw
          className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors ${loading ? "animate-spin" : ""}`}
          onClick={fetchData}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

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

export default OccupancySummaryCard;
