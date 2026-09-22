import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Info, Download } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface WaterConsumptionTopManagementCardProps {
  startDate?: string;
  endDate?: string;
}

type ApiRecord = Record<string, unknown>;

interface TileConfig {
  key: string;
  label: string;
  unit: string;
  endpoint: string;
  bg: string;
  color: string;
  defaultInfo: string;
}

const TILES: TileConfig[] = [
  {
    key: "totalSourced",
    label: "Total Sourced",
    unit: "KL",
    endpoint: "/utility_dashboard/card_total_water_consumption",
    bg: "#EFEFFB",
    color: "#6B5EA8",
    defaultInfo: "Total water sourced across all inlets.",
  },
  {
    key: "domestic",
    label: "Domestic Outlet",
    unit: "KL",
    endpoint: "/utility_dashboard/card_water_consumption_cards",
    bg: "rgba(183,220,212,0.30)",
    color: "#2E7D6B",
    defaultInfo: "Water consumed via the domestic outlet.",
  },
  {
    key: "flushing",
    label: "Flushing Outlet",
    unit: "KL",
    endpoint: "/utility_dashboard/site_wise_water_flushing",
    bg: "rgba(227,144,144,0.15)",
    color: "#D97655",
    defaultInfo: "Water consumed via the flushing outlet.",
  },
  {
    key: "irrigation",
    label: "Irrigation Outlet",
    unit: "KL",
    endpoint: "/utility_dashboard/site_wise_water_irrigation",
    bg: "rgba(237,196,136,0.25)",
    color: "#B8860B",
    defaultInfo: "Water consumed via the irrigation outlet.",
  },
];

// The 4 endpoints below haven't been hit against a live backend from this
// environment, so each value is read tolerantly — same flat
// { response, info: { info | formula } } shape already assumed for the
// sibling card_*/site_wise_* utility endpoints elsewhere in this app
// (EnergyIntensityCard, CarbonEmissionCard, FuelConsumptionCard,
// PowerConsumptionTopManagementCard) — instead of trusting one exact field
// name.
function pickNumber(raw: unknown): number {
  if (raw == null) return 0;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw !== "object") return 0;
  const record = raw as ApiRecord;
  const root = (record["data"] as ApiRecord) ?? record;
  const value = root["response"];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return 0;
}

function pickInfo(raw: unknown): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const record = raw as ApiRecord;
  const root = (record["data"] as ApiRecord) ?? record;
  const info = root["info"];
  if (!info || typeof info !== "object") return undefined;
  const infoRecord = info as ApiRecord;
  for (const key of ["info", "formula", "Formula"]) {
    const value = infoRecord[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return undefined;
}

function downloadTileCsv(label: string, unit: string, value: number) {
  const csv = `Metric,Value,Unit,Generated At\n"${label}",${value},${unit},${new Date().toISOString()}\n`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const WaterConsumptionTopManagementCard: React.FC<WaterConsumptionTopManagementCardProps> = ({
  startDate,
  endDate,
}) => {
  const [rawByKey, setRawByKey] = useState<Record<string, unknown>>({});
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

      const responses = await Promise.all(
        TILES.map((tile) => fetch(`${getFullUrl(tile.endpoint)}?${qs}`, getAuthenticatedFetchOptions()))
      );

      responses.forEach((res, idx) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} (${TILES[idx].label})`);
      });

      const bodies = await Promise.all(responses.map((res) => res.json()));
      const next: Record<string, unknown> = {};
      TILES.forEach((tile, idx) => {
        next[tile.key] = bodies[idx];
      });
      setRawByKey(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          Water Consumption Top Management
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TILES.map((tile) => {
          const raw = rawByKey[tile.key];
          const value = pickNumber(raw);
          const info = pickInfo(raw) ?? tile.defaultInfo;
          return (
            <div
              key={tile.key}
              className="rounded-2xl p-6 text-center overflow-hidden"
              style={{ backgroundColor: tile.bg }}
            >
              {loading ? (
                <div
                  className="h-9 rounded animate-pulse mx-auto w-2/3"
                  style={{ backgroundColor: `${tile.color}33` }}
                />
              ) : (
                <div className="text-3xl font-extrabold" style={{ color: tile.color }}>
                  {value.toLocaleString()} {tile.unit}
                </div>
              )}
              <div className="text-sm text-gray-600 font-medium mt-2 mb-4 leading-tight break-words">
                {tile.label}
              </div>
              <div className="flex items-center justify-end gap-3">
                <RefreshCw
                  className={`w-4 h-4 cursor-pointer transition-colors ${loading ? "animate-spin" : ""}`}
                  style={{ color: tile.color }}
                  onClick={fetchData}
                />
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" style={{ color: tile.color }} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                      <p className="text-sm leading-snug">{info}</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
                <Download
                  className="tile-download w-4 h-4 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                  style={{ color: tile.color }}
                  onClick={() => downloadTileCsv(tile.label, tile.unit, value)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WaterConsumptionTopManagementCard;
