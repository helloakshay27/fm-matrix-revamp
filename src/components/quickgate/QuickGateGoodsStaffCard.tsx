import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

interface QuickGateGoodsStaffCardProps {
  startDate?: string;
  endDate?: string;
}

type ApiRecord = Record<string, unknown>;

const CARD_STYLES = [
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
  { bg: "#EFEFFB", numColor: "#6B5EA8" },
  { bg: "#B7DCD44D", numColor: "#2E7D6B" },
  { bg: "#E3909026", numColor: "#D97655" },
  { bg: "rgba(133,189,246,0.20)", numColor: "#85BDF6" },
];

// goods_kpi / staff_kpis / delivery_visitor_data haven't been hit against a
// live backend from this environment, so every value below is read
// tolerantly (several likely key-name candidates instead of one exact field
// name) rather than assuming one fixed schema.
function pickNumber(record: ApiRecord | null | undefined, keys: string[]): number {
  if (!record || typeof record !== "object") return 0;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return 0;
}

function pickInfo(record: ApiRecord | null | undefined, keys: string[]): string | undefined {
  if (!record || typeof record !== "object") return undefined;
  const infoObj = record["info"];
  if (!infoObj || typeof infoObj !== "object") return undefined;
  for (const key of keys) {
    const value = (infoObj as ApiRecord)[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return undefined;
}

/** Unwraps a common envelope shape ({ goods_kpi: {...} }, { data: {...} }, { response: {...} }) if present. */
function unwrapEnvelope(raw: unknown, envelopeKeys: string[]): ApiRecord | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw as ApiRecord | null;
  const record = raw as ApiRecord;
  for (const key of envelopeKeys) {
    const nested = record[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested as ApiRecord;
  }
  return record;
}

/** Delivery-visitors endpoint might return a KPI object or a raw list — handle both. */
function extractCount(raw: unknown, envelopeKeys: string[], countKeys: string[]): number {
  if (Array.isArray(raw)) return raw.length;
  const record = unwrapEnvelope(raw, envelopeKeys);
  if (Array.isArray(record)) return (record as unknown[]).length;
  return pickNumber(record, countKeys);
}

const QuickGateGoodsStaffCard: React.FC<QuickGateGoodsStaffCardProps> = ({
  startDate,
  endDate,
}) => {
  const [goodsData, setGoodsData] = useState<unknown>(null);
  const [staffData, setStaffData] = useState<unknown>(null);
  const [deliveryData, setDeliveryData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const siteId = localStorage.getItem("selectedSiteId") || "";
      const fromDate = startDate || "2020-01-01";
      const toDate = endDate || new Date().toISOString().split("T")[0];

      const params = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
      });
      if (siteId) params.set("site_id", siteId);
      const qs = params.toString();

      const [goodsRes, staffRes, deliveryRes] = await Promise.all([
        fetch(`${getFullUrl("/pms/visitors/goods_kpi")}?${qs}`, getAuthenticatedFetchOptions()),
        fetch(`${getFullUrl("/pms/visitors/staff_kpis")}?${qs}`, getAuthenticatedFetchOptions()),
        fetch(`${getFullUrl("/pms/visitors/delivery_visitor_data")}?${qs}`, getAuthenticatedFetchOptions()),
      ]);

      if (!goodsRes.ok) throw new Error(`HTTP ${goodsRes.status}`);
      if (!staffRes.ok) throw new Error(`HTTP ${staffRes.status}`);
      if (!deliveryRes.ok) throw new Error(`HTTP ${deliveryRes.status}`);

      const [goods, staff, delivery] = await Promise.all([
        goodsRes.json(),
        staffRes.json(),
        deliveryRes.json(),
      ]);

      setGoodsData(goods);
      setStaffData(staff);
      setDeliveryData(delivery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goods = unwrapEnvelope(goodsData, ["goods_kpi", "data", "response"]);
  const staff = unwrapEnvelope(staffData, ["staff_kpis", "data", "response"]);

  const cards = [
    {
      label: "Good In",
      value: pickNumber(goods, ["good_in", "goods_in", "total_good_in", "goodIn", "good_in_count"]),
      info: pickInfo(goods, ["good_in", "goods_in", "goodIn"]),
    },
    {
      label: "Good Out",
      value: pickNumber(goods, ["good_out", "goods_out", "total_good_out", "goodOut", "good_out_count"]),
      info: pickInfo(goods, ["good_out", "goods_out", "goodOut"]),
    },
    {
      label: "Goods Outwards",
      value: pickNumber(goods, [
        "goods_outward",
        "goods_outwards",
        "total_goods_outward",
        "goodsOutward",
        "outward_count",
      ]),
      info: pickInfo(goods, ["goods_outward", "goods_outwards", "goodsOutward"]),
    },
    {
      label: "Goods Inwards",
      value: pickNumber(goods, [
        "goods_inward",
        "goods_inwards",
        "total_goods_inward",
        "goodsInward",
        "inward_count",
      ]),
      info: pickInfo(goods, ["goods_inward", "goods_inwards", "goodsInward"]),
    },
    {
      label: "Total Staff",
      value: pickNumber(staff, ["total_staff", "staff_total", "totalStaff"]),
      info: pickInfo(staff, ["total_staff", "totalStaff"]),
    },
    {
      label: "Staff In",
      value: pickNumber(staff, ["staff_in", "staffIn", "total_staff_in"]),
      info: pickInfo(staff, ["staff_in", "staffIn"]),
    },
    {
      label: "Staff Out",
      value: pickNumber(staff, ["staff_out", "staffOut", "total_staff_out"]),
      info: pickInfo(staff, ["staff_out", "staffOut"]),
    },
    {
      label: "Delivery Visitors",
      value: extractCount(
        deliveryData,
        ["delivery_visitor_data", "data", "response", "visitors"],
        ["delivery_visitors", "total_delivery_visitors", "count", "total"]
      ),
      info: undefined as string | undefined,
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
          Goods &amp; Staff Overview
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                <div
                  className="text-3xl font-extrabold"
                  style={{ color: cardStyle.numColor }}
                >
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

export default QuickGateGoodsStaffCard;
