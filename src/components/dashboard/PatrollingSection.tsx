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
} from "recharts";
import { Footprints, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { fetchPatrolling, PatrollingEndpoint, PatrollingResponse } from "@/services/fmDashboardAPI";

type Row = Record<string, unknown>;
type State = { data?: PatrollingResponse; error?: string };

const PALETTE = ANALYTICS_PALETTE;
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

const Empty = () => (
  <div className="h-full min-h-[200px] flex items-center justify-center text-sm text-[#888780]">
    No data for the selected period
  </div>
);

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

  const bar = (horizontal: boolean) => {
    if (!rows.length || !keys.length) return <Empty />;
    const series = keys.slice(0, 4);
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout={horizontal ? "vertical" : "horizontal"} margin={{ left: horizontal ? 24 : 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={!horizontal} horizontal={!horizontal} />
          {horizontal ? (
            <>
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey={labelKey} width={110} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            </>
          ) : (
            <>
              <XAxis dataKey={labelKey} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={rows.length > 6 ? -30 : 0} textAnchor={rows.length > 6 ? "end" : "middle"} height={rows.length > 6 ? 60 : 30} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
          {series.length > 1 && <Legend formatter={humanize} wrapperStyle={{ fontSize: 11 }} />}
          {series.map((k, i) => (
            <Bar key={k} dataKey={k} name={humanize(k)} fill={PALETTE[i % PALETTE.length]} radius={[4, 4, 0, 0]} barSize={28} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const status = () => {
    const valueKey = keys.find((k) => /count|total|value/i.test(k)) ?? keys[0];
    if (!rows.length || !valueKey) return <Empty />;
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey={valueKey} nameKey={labelKey} innerRadius={60} outerRadius={95} paddingAngle={2}>
            {rows.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const trend = () => {
    if (!rows.length || !keys.length) return <Empty />;
    const series = keys.slice(0, 3);
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={labelKey} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-auto h-full content-start">
        {list.map((k, i) => (
          <div
            key={k.key}
            className="rounded-lg bg-[#f6f4ee] border border-[#c4b89d]/50 p-4"
            style={{ borderLeft: `4px solid ${PALETTE[i % PALETTE.length]}` }}
          >
            <div className="text-2xl font-semibold text-[#2c2c2c]">{fmt(k.key, k.value)}</div>
            <div className="text-xs font-medium text-[#888780] mt-1">{humanize(k.key)}</div>
          </div>
        ))}
      </div>
    ) : (
      <Empty />
    );

  const table = () => {
    if (!rows.length) return kpiTiles(toKpis(payload));
    const cols = Object.keys(rows[0]).filter((k) => !isObj(rows[0][k]) && !Array.isArray(rows[0][k])).slice(0, 6);
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#f6f4ee]">
            <tr>
              {cols.map((c) => (
                <th key={c} className="text-left font-semibold px-2 py-2 text-[#2c2c2c]">{humanize(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[#d5dbdb]/60">
                {cols.map((c) => (
                  <td key={c} className="px-2 py-1.5 text-[#2c2c2c]">{String(r[c] ?? "-")}</td>
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
    <Card className="bg-white border border-[#c4b89d]/60 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Footprints className="w-4 h-4 text-[#da7756]" />
          {title ?? TITLES[ep] ?? humanize(endpoint)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[280px] relative p-0">
        <div className="absolute inset-0 px-4 pb-4">
          {loading && !state.data ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-7 w-7 rounded-full border-2 border-gray-200 border-t-[#da7756] animate-spin" />
            </div>
          ) : state.error ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-sm text-[#e7848e]">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to load</span>
            </div>
          ) : (
            body()
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatrollingCard;
