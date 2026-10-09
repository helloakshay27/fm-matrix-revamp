import React, { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPatrolling, PatrollingEndpoint, PatrollingResponse } from "@/services/fmDashboardAPI";

type Row = Record<string, unknown>;
type State = { data?: PatrollingResponse; error?: string };

const PIE_COLORS = [
  "#76CDC1",
  "#E39090",
  "#CDCAF5",
  "#9EC8BA",
  "#EDC488",
  "#8E7BE0",
  "#DA7756",
  "#798C5E",
];
const PALETTE = PIE_COLORS;

// Tile styling mirrors the "Ticket Status Overview" card.
const TILE_STYLES = {
  red: { bg: "rgba(227,144,144,0.15)", num: "#D97655" },
  green: { bg: "rgba(183,220,212,0.30)", num: "#2E7D6B" },
  purple: { bg: "#EFEFFB", num: "#6B5EA8" },
};
const tileStyle = (key: string) => {
  if (/open|reopen|critical|pending|miss|fail|overdue/i.test(key)) return TILE_STYLES.red;
  if (/closed|complete|done/i.test(key)) return TILE_STYLES.green;
  return TILE_STYLES.purple;
};

const META_KEYS = new Set(["success", "message", "filters", "status_code", "errors"]);
const LABEL_KEYS = [
  "name", "label", "status", "category", "date", "day", "guard_name", "guard", "staff_name",
  "location", "location_name", "shift", "shift_name", "site_name", "ticket_category",
];

const isObj = (v: unknown): v is Row => !!v && typeof v === "object" && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const humanize = (k: string) =>
  k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bPct\b/, "%");
const isPct = (k: string) => /percent|pct|rate|compliance/i.test(k);

/** Inner payload of an endpoint response (the key usually matches the endpoint name). */
function payloadOf(res: PatrollingResponse | undefined, endpoint: string): unknown {
  if (!res) return undefined;
  if (res[endpoint] !== undefined) return res[endpoint];
  if (res.data !== undefined) return res.data;
  const key = Object.keys(res).find((k) => !META_KEYS.has(k));
  return key ? res[key] : undefined;
}

const NUM_STR = /^-?\d+(\.\d+)?\s*%?$/;

/** Deep-convert numeric strings ("12", "85.5%") to numbers so the charts can plot them. */
function coerce(v: unknown): unknown {
  if (typeof v === "string" && NUM_STR.test(v.trim())) return parseFloat(v);
  if (Array.isArray(v)) return v.map(coerce);
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, coerce(x)]));
  return v;
}

/** Zip parallel arrays ({labels:[..], data:[..]} or {categories:[..], series:[{name,data:[..]}]}). */
function zipParallel(p: Row): Row[] {
  const labels = ["labels", "categories", "dates", "x"]
    .map((k) => p[k])
    .find((v) => Array.isArray(v)) as unknown[] | undefined;
  if (!labels) return [];
  const rows: Row[] = labels.map((l) => ({ name: String(l) }));
  let added = false;
  for (const [k, v] of Object.entries(p)) {
    if (Array.isArray(v) && v.length === labels.length && v.every(isNum) && v !== labels) {
      v.forEach((n, i) => (rows[i][k] = n));
      added = true;
    }
    if (Array.isArray(v) && v.every((x) => isObj(x) && Array.isArray(x.data))) {
      (v as Row[]).forEach((ser, si) => {
        const key = typeof ser.name === "string" ? ser.name : `series_${si + 1}`;
        (ser.data as unknown[]).forEach((n, i) => {
          if (rows[i] && isNum(n)) {
            rows[i][key] = n;
            added = true;
          }
        });
      });
    }
  }
  return added ? rows : [];
}

/** Best-effort conversion of any payload into chartable rows. */
function toRows(raw: unknown, depth = 0): Row[] {
  const p = depth === 0 ? coerce(raw) : raw;
  if (Array.isArray(p)) {
    if (p.some(isObj)) return p.filter(isObj);
    if (p.length && p.every(isNum)) return p.map((v, i) => ({ name: String(i + 1), value: v }));
    return [];
  }
  if (!isObj(p) || depth > 3) return [];
  const zipped = zipParallel(p);
  if (zipped.length) return zipped;
  for (const v of Object.values(p)) {
    if (Array.isArray(v) && v.some(isObj)) return v.filter(isObj);
  }
  for (const v of Object.values(p)) {
    if (isObj(v) || Array.isArray(v)) {
      const nested = toRows(v, depth + 1);
      if (nested.length) return nested;
    }
  }
  const nums = Object.entries(p).filter(([, v]) => isNum(v));
  if (nums.length) return nums.map(([k, v]) => ({ name: humanize(k), value: v }));
  // { label: { count: n } } style maps
  const entries = Object.entries(p).filter(([, v]) => isObj(v));
  return entries.map(([k, v]) => ({ name: humanize(k), ...(v as Row) }));
}

function labelKeyOf(rows: Row[]): string {
  const first = rows[0] ?? {};
  return (
    LABEL_KEYS.find((k) => typeof first[k] === "string") ??
    Object.keys(first).find((k) => typeof first[k] === "string") ??
    "name"
  );
}

function numericKeysOf(rows: Row[], labelKey: string): string[] {
  const keys = new Set<string>();
  rows.forEach((r) =>
    Object.entries(r).forEach(([k, v]) => {
      if (k !== labelKey && isNum(v) && !/(^|_)id$/i.test(k)) keys.add(k);
    })
  );
  return [...keys];
}

/** Flatten every numeric scalar in an object (one level of nesting) into KPI tiles. */
function toKpis(raw: unknown): { key: string; value: number }[] {
  const p = coerce(raw);
  const out: { key: string; value: number }[] = [];
  const walk = (o: unknown, depth: number) => {
    if (!isObj(o) || depth > 2) return;
    Object.entries(o).forEach(([k, v]) => {
      if (isNum(v)) out.push({ key: k, value: v });
      else if (isObj(v)) walk(v, depth + 1);
    });
  };
  walk(p, 0);
  return out;
}

const fmt = (key: string, v: number) =>
  isPct(key) ? `${Number.isInteger(v) ? v : v.toFixed(1)}%` : v.toLocaleString();

const axisTick = { fontSize: 11, fill: "#6B7280" };
const axisLine = { stroke: "#D1D5DB" };
const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const Empty = () => (
  <div className="h-64 flex items-center justify-center">
    <p className="text-gray-500">No data available for the selected period</p>
  </div>
);

const renderCenterTotalLabel = (total: number) => {
  return ({ viewBox }: any) => {
    const { cx, cy } = viewBox;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} y={cy - 6} className="fill-gray-900" style={{ fontSize: "20px", fontWeight: 700 }}>
          {total.toLocaleString()}
        </tspan>
        <tspan x={cx} y={cy + 14} className="fill-gray-500" style={{ fontSize: "11px" }}>
          Total
        </tspan>
      </text>
    );
  };
};

const TITLES: Record<PatrollingEndpoint, string> = {
  patrolling_overview: "Patrolling Overview",
  patrolling_status_distribution: "Patrolling Status Distribution",
  patrolling_trend: "Patrolling Trend",
  patrolling_guard_performance: "Guard Performance",
  patrolling_location_analysis: "Location Analysis",
  patrolling_tickets_by_category: "Patrolling Tickets by Category",
  patrolling_ticket_link_and_staff: "Ticket Link & Staff",
  patrolling_completion_by_shift: "Patrolling Completion by Shift",
};

interface PatrollingCardProps {
  endpoint: string;
  title?: string;
  siteIds: string[];
  fromDate?: string;
  toDate?: string;
}

/** One self-fetching Patrolling card — rendered by the dashboard grid for each selected analytic. */
export const PatrollingCard: React.FC<PatrollingCardProps> = ({ endpoint, title, siteIds, fromDate, toDate }) => {
  const ep = endpoint as PatrollingEndpoint;
  const [state, setState] = useState<State>({});
  const [loading, setLoading] = useState(false);
  const siteKey = siteIds.join(",");

  const load = useCallback(async () => {
    if (!siteKey) return;
    setLoading(true);
    try {
      const data = await fetchPatrolling(ep, { siteIds: siteKey.split(","), fromDate, toDate });
      console.debug(`[Patrolling] ${ep}`, data);
      setState({ data });
    } catch (e) {
      setState({ error: e instanceof Error ? e.message : "Request failed" });
    } finally {
      setLoading(false);
    }
  }, [ep, siteKey, fromDate, toDate]);

  useEffect(() => {
    load();
  }, [load]);

  const payload = payloadOf(state.data, ep);
  const rows = toRows(payload);
  const labelKey = labelKeyOf(rows);
  const keys = numericKeysOf(rows, labelKey);

  const bar = (horizontal: boolean, hideCategoryLabels = false) => {
    if (!rows.length || !keys.length) return <Empty />;
    const series = keys.slice(0, 4);
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={rows} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 20, right: 30, left: horizontal ? 20 : 0, bottom: horizontal ? 20 : 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={!horizontal} horizontal={!horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
              <YAxis type="category" dataKey={labelKey} width={110} tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
            </>
          ) : (
            <>
              <XAxis
                dataKey={labelKey}
                tick={hideCategoryLabels ? false : axisTick}
                axisLine={axisLine}
                tickLine={axisLine}
                interval={0}
                angle={!hideCategoryLabels && rows.length > 6 ? -45 : 0}
                textAnchor={!hideCategoryLabels && rows.length > 6 ? "end" : "middle"}
                height={hideCategoryLabels ? 8 : 80}
              />
              <YAxis tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
            </>
          )}
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend formatter={humanize} wrapperStyle={{ fontSize: 11 }} />}
          {series.map((k, i) => (
            <Bar key={k} dataKey={k} name={humanize(k)} radius={[4, 4, 0, 0]} barSize={28} fill={PALETTE[i % PALETTE.length]}>
              {series.length === 1 &&
                rows.map((_, ri) => (
                  <Cell key={`cell-${ri}`} fill={PALETTE[ri % PALETTE.length]} />
                ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const status = () => {
    const valueKey = keys.find((k) => /count|total|value/i.test(k)) ?? keys[0];
    if (!rows.length || !valueKey) return <Empty />;
    const total = rows.reduce((sum, r) => sum + (Number(r[valueKey]) || 0), 0);
    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={rows}
            dataKey={valueKey}
            nameKey={labelKey}
            innerRadius={45}
            outerRadius={90}
            paddingAngle={2}
            stroke="#FFFFFF"
            strokeWidth={2}
            labelLine={false}
            label={({ name, value }) => `${name} (${value})`}
          >
            {rows.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
            <Label content={renderCenterTotalLabel(total)} position="center" />
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Count"]} />
          <Legend formatter={humanize} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const trend = () => {
    if (!rows.length || !keys.length) return <Empty />;
    const series = keys.slice(0, 3);
    return (
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={rows} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={labelKey} tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
          <YAxis tick={axisTick} axisLine={axisLine} tickLine={axisLine} />
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend formatter={humanize} wrapperStyle={{ fontSize: 11 }} />}
          {series.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} name={humanize(k)} stroke={PALETTE[i]} fill={PALETTE[i]} fillOpacity={0.18} strokeWidth={2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const kpiTiles = (list: { key: string; value: number }[]) =>
    list.length ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((k) => {
          const { bg, num } = tileStyle(k.key);
          return (
            <div
              key={k.key}
              className="rounded-2xl px-4 py-5 flex flex-col items-center text-center gap-1"
              style={{ backgroundColor: bg }}
            >
              <div className="text-2xl font-bold" style={{ color: num, fontFamily: "Work Sans, sans-serif" }}>
                {fmt(k.key, k.value)}
              </div>
              <div className="text-xs text-gray-500">{humanize(k.key)}</div>
            </div>
          );
        })}
      </div>
    ) : (
      <Empty />
    );

  const table = () => {
    if (!rows.length) return kpiTiles(toKpis(payload));
    const cols = Object.keys(rows[0]).filter((k) => !isObj(rows[0][k]) && !Array.isArray(rows[0][k])).slice(0, 6);
    return (
      <div className="h-64 overflow-auto rounded-lg border bg-white">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {cols.map((c) => (
                <th key={c} className="text-left font-semibold px-3 py-2 text-gray-700">{humanize(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                {cols.map((c) => (
                  <td key={c} className="px-3 py-1.5 text-gray-700">{String(r[c] ?? "-")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const body = () => {
    switch (ep) {
      case "patrolling_overview":
        return kpiTiles(toKpis(payload));
      case "patrolling_status_distribution":
        return status();
      case "patrolling_trend":
        return trend();
      case "patrolling_guard_performance":
        return bar(false, true);
      case "patrolling_completion_by_shift":
        return bar(false);
      case "patrolling_location_analysis":
      case "patrolling_tickets_by_category":
        return bar(true);
      default:
        return table();
    }
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm bg-white h-full flex flex-col">
      <CardHeader className="pb-4 px-6 pt-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#C72030]">
            {title ?? TITLES[ep] ?? humanize(endpoint)}
          </CardTitle>
          <RefreshCw
            data-no-drag="true"
            className={`w-5 h-5 flex-shrink-0 cursor-pointer text-black hover:text-gray-700 transition-colors z-50${loading ? " animate-spin" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              load();
            }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: "auto" }}
          />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-1 min-h-0">
        {loading && !state.data ? (
          <div className="bg-gray-50 rounded-lg p-4 min-h-[280px] flex items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C72030]" />
          </div>
        ) : state.error ? (
          <div className="bg-gray-50 rounded-lg p-4 min-h-[280px] flex flex-col items-center justify-center gap-2 text-sm text-[#E7848E]">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load</span>
          </div>
        ) : (
          ep === "patrolling_overview" ? (
            <div>{body()}</div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">{body()}</div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default PatrollingCard;
