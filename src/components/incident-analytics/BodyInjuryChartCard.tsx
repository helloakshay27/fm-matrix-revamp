import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";
import humanBodyImg from "@/assets/human_body.png";

interface BodyInjuryChartCardProps {
  startDate?: string;
  endDate?: string;
}

// ── Coordinate space ──────────────────────────────────────────────────────────
// viewBox="-200 0 1293 873"
//   • The PNG (893×873) sits at x=0, y=0 — coordinates below are in PNG pixels.
//   • The 200 px of negative-x space is label padding on the left side.
//   • The 200 px of extra right space (893 → 1093) is label padding on the right.
//
// Body-part positions (measured on the 893×873 image):
//   Head center   ≈ (446,  85)
//   Eyes          ≈ (415,  72) and (478, 72)
//   Mouth/Tongue  ≈ (446, 128)
//   Neck          ≈ (446, 175)
//   Upper arms    ≈ (222, 320) and (618, 320)
//   Mid-thighs    ≈ (375, 495) and (518, 495)
// ─────────────────────────────────────────────────────────────────────────────

const MARKER_CONFIG: {
  key: string;
  dots: { cx: number; cy: number }[];
  linePath: string;
  labelX: number;
  labelY: number;
  anchor: "start" | "end";
}[] = [
  {
    key: "Head",
    dots: [{ cx: 446, cy: 85 }],
    linePath: "M 458 85 L 905 85 L 905 48",
    labelX: 912,
    labelY: 48,
    anchor: "start",
  },
  {
    key: "Eyes",
    dots: [
      { cx: 415, cy: 72 },
      { cx: 478, cy: 72 },
    ],
    linePath: "M 408 72 L -12 72 L -12 38",
    labelX: -18,
    labelY: 38,
    anchor: "end",
  },
  {
    key: "Tongue",
    dots: [{ cx: 446, cy: 128 }],
    linePath: "M 454 128 L 905 128",
    labelX: 912,
    labelY: 123,
    anchor: "start",
  },
  {
    key: "Neck",
    dots: [{ cx: 446, cy: 175 }],
    linePath: "M 438 175 L -12 175",
    labelX: -18,
    labelY: 170,
    anchor: "end",
  },
  {
    // Dots placed on upper-arm area of both arms
    key: "Arms",
    dots: [
      { cx: 330, cy: 320 },
      { cx: 550, cy: 320 },
    ],
    linePath: "M 317 320 L -12 320",
    labelX: -18,
    labelY: 315,
    anchor: "end",
  },
  {
    // Dots placed on mid-thigh of both legs
    key: "Legs",
    dots: [
      { cx: 375, cy: 495 },
      { cx: 518, cy: 495 },
    ],
    linePath: "M 525 495 L 905 495",
    labelX: 912,
    labelY: 490,
    anchor: "start",
  },
];

const getMarkerColor = (pct: number): string => {
  if (pct >= 20) return "#C72030";
  if (pct >= 10) return "#D97655";
  if (pct > 0) return "#E6B94A";
  return "#D1D5DB";
};

const BodyInjuryChartCard: React.FC<BodyInjuryChartCardProps> = ({
  startDate,
  endDate,
}) => {
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
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
      const url = `${getFullUrl("/incident_dashboard/body_injury_chart.json")}?${params}`;
      const resp = await fetch(url, getAuthenticatedFetchOptions());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      setPercentages(data.percentage || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedEntries = Object.entries(percentages).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: "Work Sans, sans-serif" }}
        >
          Body Injury Analysis
        </h3>
        <RefreshCw
          className={`w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors ${
            loading ? "animate-spin" : ""
          }`}
          onClick={fetchData}
        />
      </div>

      <div className="p-5">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-[340px]">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C72030] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Body diagram with overlaid injury markers ── */}
            <div className="flex justify-center">
              <svg
                viewBox="-200 0 1293 873"
                style={{ width: "100%", maxWidth: "460px" }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Real PNG body image anchored at origin */}
                <image
                  href={humanBodyImg}
                  x="0"
                  y="0"
                  width="893"
                  height="873"
                  preserveAspectRatio="xMidYMid meet"
                />

                {MARKER_CONFIG.map(
                  ({ key, dots, linePath, labelX, labelY, anchor }) => {
                    const pct = percentages[key];
                    const isActive = pct !== undefined && pct > 0;
                    const color = isActive ? getMarkerColor(pct) : "#D1D5DB";

                    return (
                      <g key={key}>
                        {/* Dashed callout line */}
                        {isActive && (
                          <path
                            d={linePath}
                            stroke={color}
                            strokeWidth="2.5"
                            fill="none"
                            opacity="0.8"
                            strokeDasharray="7 4"
                          />
                        )}

                        {/* Dot(s) on the body zone */}
                        {dots.map((dot, i) => (
                          <g key={i}>
                            {isActive && (
                              <circle
                                cx={dot.cx}
                                cy={dot.cy}
                                r="26"
                                fill={color}
                                opacity="0.15"
                              />
                            )}
                            <circle
                              cx={dot.cx}
                              cy={dot.cy}
                              r="13"
                              fill={isActive ? color : "#F3F4F6"}
                              stroke={color}
                              strokeWidth="2.5"
                            />
                            {isActive && (
                              <circle cx={dot.cx} cy={dot.cy} r="5" fill="white" />
                            )}
                          </g>
                        ))}

                        {/* Label: part name + percentage */}
                        {isActive && (
                          <text
                            textAnchor={anchor}
                            style={{ fontFamily: "Work Sans, sans-serif" }}
                          >
                            <tspan x={labelX} y={labelY} fontSize="24" fill="#6B7280">
                              {key}
                            </tspan>
                            <tspan
                              x={labelX}
                              dy="36"
                              fontSize="30"
                              fontWeight="700"
                              fill={color}
                            >
                              {pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`}
                            </tspan>
                          </text>
                        )}
                      </g>
                    );
                  }
                )}
              </svg>
            </div>

            {/* ── Legend ── */}
            {sortedEntries.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3"
                  style={{ fontFamily: "Work Sans, sans-serif" }}
                >
                  Injury Distribution
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                  {sortedEntries.map(([part, pct]) => {
                    const color = getMarkerColor(pct);
                    return (
                      <div key={part} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-600 flex-1 truncate">
                          {part}
                        </span>
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{ color }}
                        >
                          {pct % 1 === 0 ? `${pct}%` : `${pct.toFixed(1)}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedEntries.length === 0 && !loading && (
              <div className="flex items-center justify-center h-16 text-sm text-gray-400">
                No injury data available
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BodyInjuryChartCard;
