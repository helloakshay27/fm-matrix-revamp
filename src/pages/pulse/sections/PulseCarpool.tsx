import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Car, ArrowUp, ArrowDown } from "lucide-react";
import {
  fetchCarpoolRideOverview,
  fetchCarpoolRideRoutesTraffic,
  fetchTopDrivers,
  fetchRideDetails,
  fetchReportDetails,
} from "@/services/pulseDashboardApi";
import type { PulseFilters, RideOverviewResponse, RideRoutesTrafficResponse } from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E",
  blue: "#6B9BCC",
  orange: "#EDC488",
  red: "#E7848E",
  purple: "#CECBF6",
  teal: "#9EC8BA",
};

const PEAK_HOUR_COLOR = { morning: "#DA8B6B", evening: "#798C5E" };

const ROUTE_VOLUME_WIDTH: Record<"high" | "med" | "low", number> = { high: 3, med: 2.25, low: 1.25 };
const ROUTE_VOLUME_OPACITY: Record<"high" | "med" | "low", number> = { high: 1, med: 0.65, low: 0.35 };
const ROUTE_MAP_VIEWBOX = { width: 260, height: 150 };
const ROUTE_MAP_MAX_SPOKES = 8;

function curvedPathBetween(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - 18;
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
}

type RoutesMapData = {
  nodes: { id: string; x: number; y: number; label: string; showLabel: boolean; isHub: boolean }[];
  routes: { key: string; path: string; intensity: "high" | "med" | "low" }[];
};

const EMPTY_ROUTES_MAP_DATA: RoutesMapData = { nodes: [], routes: [] };

const INTENSITY_RANK: Record<"high" | "med" | "low", number> = { high: 3, med: 2, low: 1 };

// Real node coordinates come back as tightly-clustered lat/long pairs (several
// ids round to the same place name), so raw geo projection crushes them into a
// tiny corner and their labels overlap. Instead, merge same-label nodes/routes
// and lay them out as a hub-and-spoke fan around the busiest location — this
// mirrors the actual traffic shape (nearly every route touches the hub) while
// keeping every label legible.
function buildRoutesMapData(traffic: RideRoutesTrafficResponse): RoutesMapData {
  const ridesByLabel = new Map<string, number>();
  traffic.nodes.forEach((n) => {
    ridesByLabel.set(n.label, (ridesByLabel.get(n.label) ?? 0) + n.total_rides);
  });

  const routesByPair = new Map<
    string,
    { a: string; b: string; rides: number; intensity: "high" | "med" | "low" }
  >();
  traffic.routes.forEach((r) => {
    if (r.from_label === r.to_label) return;
    const [a, b] = [r.from_label, r.to_label].sort();
    const key = `${a}__${b}`;
    const existing = routesByPair.get(key);
    const intensity =
      !existing || INTENSITY_RANK[r.intensity] > INTENSITY_RANK[existing.intensity]
        ? r.intensity
        : existing.intensity;
    routesByPair.set(key, { a, b, rides: (existing?.rides ?? 0) + r.rides, intensity });
  });

  const labels = Array.from(ridesByLabel.keys());
  if (labels.length === 0) return { nodes: [], routes: [] };

  const hubLabel = labels.reduce((a, b) => (ridesByLabel.get(b)! > ridesByLabel.get(a)! ? b : a));
  const spokes = labels
    .filter((l) => l !== hubLabel)
    .sort((a, b) => ridesByLabel.get(b)! - ridesByLabel.get(a)!)
    .slice(0, ROUTE_MAP_MAX_SPOKES);

  const { width, height } = ROUTE_MAP_VIEWBOX;
  const pad = 22;
  const hx = pad + (width - pad * 2) * 0.14;
  const hy = height / 2;
  const maxRadius = width - hx - pad;

  const positions = new Map<string, { x: number; y: number }>([[hubLabel, { x: hx, y: hy }]]);
  const m = spokes.length;
  spokes.forEach((label, i) => {
    const t = m > 1 ? i / (m - 1) : 0.5;
    const angle = -0.62 * Math.PI + 1.24 * Math.PI * t;
    const radius = maxRadius * (0.5 + 0.5 * t);
    const x = hx + Math.cos(angle) * radius;
    const y = Math.min(height - pad, Math.max(pad, hy + Math.sin(angle) * radius));
    positions.set(label, { x, y });
  });

  const nodes = [hubLabel, ...spokes].map((label) => ({
    id: label,
    ...positions.get(label)!,
    label,
    showLabel: true,
    isHub: label === hubLabel,
  }));

  const routes = Array.from(routesByPair.values())
    .filter((r) => positions.has(r.a) && positions.has(r.b))
    .map((r) => ({
      key: `${r.a}-${r.b}`,
      path: curvedPathBetween(positions.get(r.a)!, positions.get(r.b)!),
      intensity: r.intensity,
    }));

  return { nodes, routes };
}

type AreaChart = { linePath: string; areaPath: string; lastPoint: { x: number; y: number } };

const MATCH_SUCCESS_CHART_VIEWBOX = { width: 280, height: 70 };

function buildAreaChart(values: number[], width = 280, height = 70, padX = 4, padY = 8): AreaChart {
  if (values.length === 0) return { linePath: "", areaPath: "", lastPoint: { x: 0, y: 0 } };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / Math.max(values.length - 1, 1);
  const points = values.map((v, i) => ({
    x: padX + i * stepX,
    y: padY + (height - padY * 2) * (1 - (v - min) / range),
  }));
  const linePath = `M ${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`;
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last.x.toFixed(1)},${height} L ${first.x.toFixed(1)},${height} Z`;
  return { linePath, areaPath, lastPoint: last };
}

type Row = Record<string, unknown>;
type Pagination = {
  current_page: number;
  total_count: number;
  total_pages: number;
  per_page: number;
};

function titleCase(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Every list-shaped carpool endpoint wraps its rows under a key we can only guess
// (e.g. "rides", "top_drivers") — fall back to the first array found in the payload
// so the table still renders if the guessed wrapper key is wrong.
function firstArray(raw: unknown, preferredKey?: string): Row[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  if (preferredKey && Array.isArray(obj[preferredKey]))
    return obj[preferredKey] as Row[];
  for (const [k, v] of Object.entries(obj)) {
    if (k === "pagination") continue;
    if (Array.isArray(v)) return v as Row[];
  }
  return [];
}

function paginationOf(raw: unknown): Pagination | undefined {
  const obj = raw as Record<string, unknown> | undefined;
  const p = obj?.pagination;
  return p && typeof p === "object" ? (p as Pagination) : undefined;
}

function deriveColumns(rows: Row[]): string[] {
  const keys = new Set<string>();
  rows
    .slice(0, 10)
    .forEach((r) => Object.keys(r ?? {}).forEach((k) => keys.add(k)));
  return Array.from(keys).filter((k) => {
    const sample = rows.find((r) => r[k] !== undefined && r[k] !== null)?.[k];
    return !(sample && typeof sample === "object");
  });
}

const ISO_DATE_RE =
  /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

function formatCell(v: unknown, key?: string): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") {
    const looksLikeDateField = key ? /date|time|_at$|_on$/i.test(key) : false;
    if (looksLikeDateField && ISO_DATE_RE.test(v)) {
      const d = new Date(v);
      if (!isNaN(d.getTime())) {
        const hasTime = /[T ]\d{2}:\d{2}/.test(v);
        return hasTime
          ? d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          : d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
      }
    }
    return v;
  }
  return String(v);
}

interface Props {
  filters: PulseFilters;
}

export function PulseCarpool({ filters }: Props) {
  const [rideOverview, setRideOverview] = useState<RideOverviewResponse | null>(null);
  const [routesTraffic, setRoutesTraffic] = useState<RideRoutesTrafficResponse | null>(null);
  const [topDrivers, setTopDrivers] = useState<unknown>(null);
  const [rides, setRides] = useState<unknown>(null);
  const [reportedRides, setReportedRides] = useState<unknown>(null);
  const [ridesPage, setRidesPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRidesPage(1);
    setReportsPage(1);
    loadAll();
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchRideDetails(filters, ridesPage)
        .then(setRides)
        .catch(console.error);
  }, [ridesPage]);

  useEffect(() => {
    if (!loading)
      fetchReportDetails(filters, reportsPage)
        .then(setReportedRides)
        .catch(console.error);
  }, [reportsPage]);

  async function loadAll() {
    setLoading(true);
    const [ro, rt, td, r, rr] = await Promise.allSettled([
      fetchCarpoolRideOverview(filters),
      fetchCarpoolRideRoutesTraffic(filters),
      fetchTopDrivers(filters, 1, 10),
      fetchRideDetails(filters, 1),
      fetchReportDetails(filters, 1),
    ]);
    if (ro.status === "fulfilled") setRideOverview(ro.value);
    else console.error(ro.reason);
    if (rt.status === "fulfilled") setRoutesTraffic(rt.value);
    else console.error(rt.reason);
    if (td.status === "fulfilled") setTopDrivers(td.value);
    else console.error(td.reason);
    if (r.status === "fulfilled") setRides(r.value);
    else console.error(r.reason);
    if (rr.status === "fulfilled") setReportedRides(rr.value);
    else console.error(rr.reason);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading carpool…
      </div>
    );
  }

  const topDriverRows = firstArray(topDrivers, "drivers").slice(0, 10);
  const topDriverColumns = deriveColumns(topDriverRows);

  const rideRows = firstArray(rides, "rides");
  const rideColumns = deriveColumns(rideRows);
  const ridePagination = paginationOf(rides);
  const rideStartIdx = ridePagination
    ? (ridePagination.current_page - 1) * ridePagination.per_page
    : 0;

  const reportedRows = firstArray(reportedRides, "reports");
  const reportedColumns = deriveColumns(reportedRows);
  const reportedPagination = paginationOf(reportedRides);
  const reportedStartIdx = reportedPagination
    ? (reportedPagination.current_page - 1) * reportedPagination.per_page
    : 0;

  const hasData = !!(
    rideOverview ||
    routesTraffic ||
    topDriverRows.length ||
    rideRows.length ||
    reportedRows.length
  );

  const kpiCards: {
    label: string;
    value: string;
    badge?: { text: string; variant: "success" | "warning" | "info" | "neutral" | "danger" };
  }[] = rideOverview
      ? [
        {
          label: "Total Rides",
          value: rideOverview.kpis.total_rides.toLocaleString(),
          badge: {
            text: `${Math.round(rideOverview.rides_trend.growth_percentage)}%`,
            variant: rideOverview.rides_trend.trend === "up" ? "success" : "danger",
          },
        },
        { label: "Total Drivers", value: rideOverview.kpis.total_drivers.toLocaleString() },
        { label: "Total Passengers", value: rideOverview.kpis.total_passengers.toLocaleString() },
        { label: "Completed Rides", value: rideOverview.kpis.completed_rides.toLocaleString() },
        { label: "Seats Offered", value: rideOverview.kpis.seats_offered.toLocaleString() },
        { label: "Seats Filled", value: rideOverview.kpis.seats_filled.toLocaleString() },
        { label: "Seats Utilization", value: rideOverview.kpis.seats_utilization.toFixed(2) },
      ]
      : [];

  const ridesTrendData = rideOverview ? rideOverview.rides_trend.points : [];

  const routesMapData = routesTraffic ? buildRoutesMapData(routesTraffic) : EMPTY_ROUTES_MAP_DATA;

  const peakHoursData = rideOverview
    ? rideOverview.peak_hours.hours.map((h) => ({ hour: h.label, rides: h.rides, period: h.period }))
    : [];

  const rideCompletion = rideOverview
    ? {
      completed_pct: rideOverview.ride_completion.completion_rate,
      cancelled_pct: rideOverview.ride_completion.cancellation_rate,
      completed_count: rideOverview.ride_completion.completed,
      cancelled_count: rideOverview.ride_completion.cancelled,
    }
    : null;

  const matchSuccess = rideOverview
    ? {
      rate: rideOverview.ride_match.success_rate.toFixed(1),
      trend: rideOverview.ride_match.trend,
      change: Math.abs(rideOverview.ride_match.change).toFixed(1),
      chart: buildAreaChart(
        rideOverview.ride_match.data,
        MATCH_SUCCESS_CHART_VIEWBOX.width,
        MATCH_SUCCESS_CHART_VIEWBOX.height
      ),
    }
    : null;
  const MatchTrendIcon = matchSuccess?.trend === "down" ? ArrowDown : ArrowUp;

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <Car className="pd-empty-icon" />
          No carpool data available for the selected filters.
        </div>
      )}

      <div className="pd-kpi-grid pd-kpi-grid--4col">
        {kpiCards.map((item) => (
          <div key={item.label} className="pd-kpi-card pd-kpi-card--badged">
            <div className="pd-kpi-main">
              <div className="pd-kpi-label">{item.label}</div>
              <div className="pd-kpi-value">{item.value}</div>
            </div>
            {item.badge && (
              <span className={`pd-kpi-badge pd-kpi-badge-${item.badge.variant}`}>
                {item.badge.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="pd-growth-row">
        {ridesTrendData.length > 0 && (
          <div className="pd-growth-card pd-growth-card--carpool-rides-trend">
            <div className="pd-panel-title">Rides Trend</div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ridesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="rides_offered"
                    name="Rides Offered"
                    stroke={C.blue}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="requests_received"
                    name="Requests Received"
                    stroke={C.orange}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="seats_filled"
                    name="Seats Filled"
                    stroke={C.green}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {peakHoursData.length > 0 && (
          <div className="pd-growth-card pd-growth-card--carpool-peak-hours">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div className="pd-panel-title">Peak Hours</div>
                <div style={{ fontSize: 11, color: "var(--color-text-light)", marginTop: 2 }}>
                  Ride volume by hour of day
                </div>
              </div>
              <div className="pd-mini-legend pd-mini-legend--stacked">
                <span className="pd-mini-legend-item">
                  <i className="pd-mini-legend-dot" style={{ background: PEAK_HOUR_COLOR.morning }} />
                  Morning
                </span>
                <span className="pd-mini-legend-item">
                  <i className="pd-mini-legend-dot" style={{ background: PEAK_HOUR_COLOR.evening }} />
                  Evening
                </span>
              </div>
            </div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={peakHoursData.length > 10 ? 2 : 0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="rides" radius={[3, 3, 0, 0]}>
                    {peakHoursData.map((d, i) => (
                      <Cell key={`${d.hour}-${i}`} fill={PEAK_HOUR_COLOR[d.period]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="pd-growth-row">
        {routesMapData.nodes.length > 0 && (
          <div className="pd-growth-card pd-growth-card--carpool-routes">
            <div className="pd-panel-title">Most Active Routes</div>
            <div className="pd-growth-chart-inner pd-routes-body">
              <div className="pd-routes-map">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${ROUTE_MAP_VIEWBOX.width} ${ROUTE_MAP_VIEWBOX.height}`}
                  preserveAspectRatio="none"
                  style={{ display: "block" }}
                >
                  {routesMapData.routes.map((r) => (
                    <path
                      key={r.key}
                      d={r.path}
                      fill="none"
                      stroke="var(--color-info)"
                      strokeWidth={ROUTE_VOLUME_WIDTH[r.intensity]}
                      strokeOpacity={ROUTE_VOLUME_OPACITY[r.intensity]}
                      strokeLinecap="round"
                    />
                  ))}
                  {routesMapData.nodes.map((n) => (
                    <circle
                      key={n.id}
                      className="pd-routes-node-dot"
                      cx={n.x}
                      cy={n.y}
                      r={n.isHub ? 6 : 5}
                    />
                  ))}
                </svg>
                {routesMapData.nodes
                  .filter((n) => n.showLabel)
                  .map((n) => (
                    <span
                      key={n.id}
                      className="pd-routes-node-label"
                      style={{
                        left: `${(n.x / ROUTE_MAP_VIEWBOX.width) * 100}%`,
                        top: `${(n.y / ROUTE_MAP_VIEWBOX.height) * 100}%`,
                        fontWeight: n.isHub ? 700 : 500,
                      }}
                    >
                      {n.label}
                    </span>
                  ))}
              </div>
              <div className="pd-routes-legend">
                <div className="pd-routes-legend-title">Rides</div>
                <div className="pd-routes-legend-item">
                  <span className="pd-routes-legend-line" style={{ borderTopWidth: ROUTE_VOLUME_WIDTH.high, opacity: ROUTE_VOLUME_OPACITY.high }} />
                  High
                </div>
                <div className="pd-routes-legend-item">
                  <span className="pd-routes-legend-line" style={{ borderTopWidth: ROUTE_VOLUME_WIDTH.med, opacity: ROUTE_VOLUME_OPACITY.med }} />
                  Med
                </div>
                <div className="pd-routes-legend-item">
                  <span className="pd-routes-legend-line" style={{ borderTopWidth: ROUTE_VOLUME_WIDTH.low, opacity: ROUTE_VOLUME_OPACITY.low }} />
                  Low
                </div>
              </div>
            </div>
          </div>
        )}

        {rideCompletion && (
          <div className="pd-growth-card pd-growth-card--carpool-completion">
            <div className="pd-panel-title">Ride Completion &amp; Cancellation Rate</div>
            <div className="pd-growth-chart-inner pd-donut-card-body">
              <div className="pd-donut-hitbox pd-donut-hitbox-2xl">
                <div
                  className="pd-donut pd-donut-2xl"
                  style={{
                    background: `conic-gradient(#108C72 0% ${rideCompletion.completed_pct}%, var(--color-error) ${rideCompletion.completed_pct}% 100%)`,
                  }}
                />
                <div className="pd-donut-center">
                  <span className="pd-donut-center-value">{rideCompletion.completed_pct.toFixed(1)}%</span>
                  <span className="pd-donut-center-label">completed</span>
                </div>
              </div>
              <div className="pd-donut-legend">
                <div className="pd-donut-legend-item">
                  <span className="pd-donut-legend-dot" style={{ background: "#108C72" }} />
                  <span className="pd-donut-legend-name">Completed</span>
                  <span className="pd-donut-legend-value">{rideCompletion.completed_count}</span>
                </div>
                <div className="pd-donut-legend-item">
                  <span className="pd-donut-legend-dot" style={{ background: "var(--color-error)" }} />
                  <span className="pd-donut-legend-name">Cancelled</span>
                  <span className="pd-donut-legend-value">{rideCompletion.cancelled_count}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {matchSuccess && (
          <div className="pd-growth-card pd-growth-card--carpool-match-success">
            <div className="pd-panel-title">Ride Match Success Rate</div>
            <div className="pd-growth-chart-inner pd-match-success-body">
              <div className="pd-match-success-stat-row">
                <span className="pd-kpi-value">{matchSuccess.rate}%</span>
                <span className={`pd-growth-badge${matchSuccess.trend === "down" ? " pd-growth-badge--down" : ""}`}>
                  <MatchTrendIcon size={10} />
                  {matchSuccess.change}%
                </span>
              </div>
              <div className="pd-match-success-sublabel">vs last month</div>
              <div className="pd-match-success-chart">
                <svg
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${MATCH_SUCCESS_CHART_VIEWBOX.width} ${MATCH_SUCCESS_CHART_VIEWBOX.height}`}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="pd-match-success-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-info)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--color-info)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={matchSuccess.chart.areaPath} fill="url(#pd-match-success-fill)" stroke="none" />
                  <path
                    d={matchSuccess.chart.linePath}
                    fill="none"
                    stroke="var(--color-info)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={matchSuccess.chart.lastPoint.x}
                    cy={matchSuccess.chart.lastPoint.y}
                    r="4"
                    fill="var(--color-info)"
                    stroke="var(--color-card-white)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {topDriverRows.length > 0 && (
        <div className="pd-tbl-card" style={{ marginBottom: 20 }}>
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Top 10 Drivers</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  {topDriverColumns.map((c) => (
                    <th key={c}>{titleCase(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topDriverRows.map((row, i) => (
                  <tr key={String(row.id ?? row.driver_id ?? i)}>
                    <td className="pd-num">{i + 1}</td>
                    {topDriverColumns.map((c) => (
                      <td key={c}>{formatCell(row[c], c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rideRows.length > 0 && (
        <div className="pd-tbl-card" style={{ marginBottom: 20 }}>
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Rides</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  {rideColumns.map((c) => (
                    <th key={c}>{titleCase(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rideRows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {rideColumns.map((c) => (
                      <td key={c}>{formatCell(row[c], c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ridePagination && ridePagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {rideStartIdx + 1}–
                {Math.min(
                  rideStartIdx + ridePagination.per_page,
                  ridePagination.total_count
                )}{" "}
                of {ridePagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button
                  className="pd-page-btn"
                  disabled={ridesPage <= 1}
                  onClick={() => setRidesPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                <button className="pd-page-btn active">{ridesPage}</button>
                <button
                  className="pd-page-btn"
                  disabled={ridesPage >= ridePagination.total_pages}
                  onClick={() => setRidesPage((p) => p + 1)}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {reportedRows.length > 0 && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Reported Rides</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  {reportedColumns.map((c) => (
                    <th key={c}>{titleCase(c)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportedRows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {reportedColumns.map((c) => (
                      <td key={c}>{formatCell(row[c], c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reportedPagination && reportedPagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {reportedStartIdx + 1}–
                {Math.min(
                  reportedStartIdx + reportedPagination.per_page,
                  reportedPagination.total_count
                )}{" "}
                of {reportedPagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button
                  className="pd-page-btn"
                  disabled={reportsPage <= 1}
                  onClick={() => setReportsPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                <button className="pd-page-btn active">{reportsPage}</button>
                <button
                  className="pd-page-btn"
                  disabled={reportsPage >= reportedPagination.total_pages}
                  onClick={() => setReportsPage((p) => p + 1)}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
