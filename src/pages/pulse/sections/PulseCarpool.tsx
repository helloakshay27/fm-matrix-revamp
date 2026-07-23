import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Car } from "lucide-react";
import {
  fetchCarpoolKpi, fetchCarpoolTrend, fetchCarpoolTrust, fetchCarpoolTopDrivers,
  fetchCarpoolRidesList, fetchCarpoolReportedRidesList,
} from "@/services/carpoolAnalyticsApi";
import type { PulseFilters } from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E", blue: "#6B9BCC", orange: "#EDC488",
  red: "#E7848E", purple: "#CECBF6", teal: "#9EC8BA",
};

type Row = Record<string, unknown>;
type Pagination = { current_page: number; total_count: number; total_pages: number; per_page: number };

function titleCase(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Every list-shaped carpool endpoint wraps its rows under a key we can only guess
// (e.g. "rides", "top_drivers") — fall back to the first array found in the payload
// so the table still renders if the guessed wrapper key is wrong.
function firstArray(raw: unknown, preferredKey?: string): Row[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  if (preferredKey && Array.isArray(obj[preferredKey])) return obj[preferredKey] as Row[];
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

function kpiEntries(raw: unknown): { label: string; value: number; currency: boolean }[] {
  if (!raw || typeof raw !== "object") return [];
  return Object.entries(raw as Record<string, unknown>)
    .filter(([, v]) => typeof v === "number")
    .map(([k, v]) => ({ label: titleCase(k), value: v as number, currency: /revenue|fare|amount|price|earning/i.test(k) }));
}

function deriveColumns(rows: Row[]): string[] {
  const keys = new Set<string>();
  rows.slice(0, 10).forEach((r) => Object.keys(r ?? {}).forEach((k) => keys.add(k)));
  return Array.from(keys).filter((k) => {
    const sample = rows.find((r) => r[k] !== undefined && r[k] !== null)?.[k];
    return !(sample && typeof sample === "object");
  });
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

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
          ? d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })
          : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      }
    }
    return v;
  }
  return String(v);
}

interface TrendPoint { month: string; rides_offered: number; requests_received: number; seats_filled: number }
interface TrendSeries { name: string; data: number[] }
interface TrendResponse { months: string[]; series: TrendSeries[] }

// Confirmed shape: { months: [...], series: [{ name: "Rides Offered", data: [...] }, ...] }
function normalizeTrend(raw: unknown): TrendPoint[] {
  const obj = raw as Partial<TrendResponse> | undefined;
  if (!obj?.months || !Array.isArray(obj.series)) return [];

  const byName = (re: RegExp) => obj.series!.find((s) => re.test(s.name))?.data;
  const offered = byName(/offer/i) ?? obj.series[0]?.data ?? [];
  const requested = byName(/request/i) ?? obj.series[1]?.data ?? [];
  const seats = byName(/seat/i) ?? obj.series[2]?.data ?? [];

  return obj.months.map((month, i) => ({
    month,
    rides_offered: offered[i] ?? 0,
    requests_received: requested[i] ?? 0,
    seats_filled: seats[i] ?? 0,
  }));
}

interface StarPoint { star: number; driver: number; passenger: number }
interface TrustSeries { name: string; data: number[] }
interface TrustSummary {
  avg_driver_rating: number;
  avg_passenger_rating: number;
  driver_rating_count: number;
  passenger_rating_count: number;
  total_ratings: number;
  total_reports: number;
  open_reports: number;
}
interface TrustResponse { stars: number[]; series: TrustSeries[]; summary: TrustSummary }

// Confirmed shape: { stars: [1..5], series: [{ name: "Driver Ratings", data }, { name: "Passenger Ratings", data }], summary: {...} }
function normalizeTrust(raw: unknown): { stars: StarPoint[]; summary: TrustSummary | undefined } {
  const obj = raw as Partial<TrustResponse> | undefined;
  if (!obj?.stars || !Array.isArray(obj.series)) return { stars: [], summary: undefined };

  const byName = (re: RegExp) => obj.series!.find((s) => re.test(s.name))?.data;
  const driver = byName(/driver/i) ?? obj.series[0]?.data ?? [];
  const passenger = byName(/passenger|rider/i) ?? obj.series[1]?.data ?? [];

  const stars = obj.stars.map((star, i) => ({
    star,
    driver: driver[i] ?? 0,
    passenger: passenger[i] ?? 0,
  }));

  return { stars, summary: obj.summary };
}

interface Props { filters: PulseFilters }

export function PulseCarpool({ filters }: Props) {
  const [kpi, setKpi] = useState<unknown>(null);
  const [trend, setTrend] = useState<unknown>(null);
  const [trust, setTrust] = useState<unknown>(null);
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
    if (!loading) fetchCarpoolRidesList(filters, ridesPage).then(setRides).catch(console.error);
  }, [ridesPage]);

  useEffect(() => {
    if (!loading) fetchCarpoolReportedRidesList(filters, reportsPage).then(setReportedRides).catch(console.error);
  }, [reportsPage]);

  async function loadAll() {
    setLoading(true);
    try {
      const [k, t, tr, td, r, rr] = await Promise.all([
        fetchCarpoolKpi(filters),
        fetchCarpoolTrend(filters),
        fetchCarpoolTrust(filters),
        fetchCarpoolTopDrivers(filters),
        fetchCarpoolRidesList(filters, 1),
        fetchCarpoolReportedRidesList(filters, 1),
      ]);
      setKpi(k); setTrend(t); setTrust(tr); setTopDrivers(td); setRides(r); setReportedRides(rr);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading carpool…</div>;
  }

  const kpis = kpiEntries(kpi);
  const trendData = normalizeTrend(trend);
  const { stars: trustData, summary: trustSummary } = normalizeTrust(trust);

  const topDriverRows = firstArray(topDrivers, "top_drivers").slice(0, 10);
  const topDriverColumns = deriveColumns(topDriverRows);

  const rideRows = firstArray(rides, "rides");
  const rideColumns = deriveColumns(rideRows);
  const ridePagination = paginationOf(rides);
  const rideStartIdx = ridePagination ? (ridePagination.current_page - 1) * ridePagination.per_page : 0;

  const reportedRows = firstArray(reportedRides, "reported_rides");
  const reportedColumns = deriveColumns(reportedRows);
  const reportedPagination = paginationOf(reportedRides);
  const reportedStartIdx = reportedPagination ? (reportedPagination.current_page - 1) * reportedPagination.per_page : 0;

  const hasData = !!(
    kpis.length || trendData.length || trustData.length ||
    topDriverRows.length || rideRows.length || reportedRows.length
  );

  return (
    <div>
      <div className="pd-section-header">
        <div className="pd-section-icon"><Car className="w-5 h-5" /></div>
        <div>
          <h2 className="pd-section-title">Carpool</h2>
          <div className="pd-section-subtitle">Ride sharing activity, trust and safety across sites</div>
        </div>
      </div>

      {!hasData && (
        <div className="pd-empty">
          <Car className="pd-empty-icon" />
          No carpool data available for the selected filters.
        </div>
      )}

      {kpis.length > 0 && (
        <div className="pd-kpi-grid">
          {kpis.map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">
                {item.currency
                  ? `₹${item.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                  : item.value.toLocaleString()}
              </div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {trendData.length > 0 && (
        <div className="pd-charts-row-single">
          <div className="pd-chart-card">
            <div className="pd-chart-title">Rides Trend</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rides_offered" name="Rides Offered" stroke={C.blue} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="requests_received" name="Requests Received" stroke={C.orange} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="seats_filled" name="Seats Filled" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {trustData.length > 0 && (
        <div className="pd-charts-row-single">
          <div className="pd-chart-card">
            <div className="pd-chart-title">
              Trust &amp; Ratings
              {trustSummary && (
                <span style={{ float: "right", fontWeight: 500, fontSize: 12, color: C.red }}>
                  {trustSummary.open_reports.toLocaleString()} open / {trustSummary.total_reports.toLocaleString()} reports
                </span>
              )}
            </div>
            {trustSummary && (
              <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#888780", marginBottom: 8 }}>
                <span>Avg Driver Rating: <strong style={{ color: C.purple }}>{trustSummary.avg_driver_rating.toFixed(1)}★</strong> ({trustSummary.driver_rating_count})</span>
                <span>Avg Passenger Rating: <strong style={{ color: C.teal }}>{trustSummary.avg_passenger_rating.toFixed(1)}★</strong> ({trustSummary.passenger_rating_count})</span>
                <span>Total Ratings: <strong>{trustSummary.total_ratings.toLocaleString()}</strong></span>
              </div>
            )}
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trustData.map((s) => ({ ...s, starLabel: `${s.star}★` }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="starLabel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="driver" name="Driver" fill={C.purple} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="passenger" name="Passenger" fill={C.teal} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

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
                  {topDriverColumns.map((c) => <th key={c}>{titleCase(c)}</th>)}
                </tr>
              </thead>
              <tbody>
                {topDriverRows.map((row, i) => (
                  <tr key={String(row.id ?? row.driver_id ?? i)}>
                    <td className="pd-num">{i + 1}</td>
                    {topDriverColumns.map((c) => <td key={c}>{formatCell(row[c], c)}</td>)}
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
                <tr>{rideColumns.map((c) => <th key={c}>{titleCase(c)}</th>)}</tr>
              </thead>
              <tbody>
                {rideRows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {rideColumns.map((c) => <td key={c}>{formatCell(row[c], c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ridePagination && ridePagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {rideStartIdx + 1}–{Math.min(rideStartIdx + ridePagination.per_page, ridePagination.total_count)} of {ridePagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button className="pd-page-btn" disabled={ridesPage <= 1} onClick={() => setRidesPage((p) => p - 1)}>‹ Prev</button>
                <button className="pd-page-btn active">{ridesPage}</button>
                <button className="pd-page-btn" disabled={ridesPage >= ridePagination.total_pages} onClick={() => setRidesPage((p) => p + 1)}>Next ›</button>
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
                <tr>{reportedColumns.map((c) => <th key={c}>{titleCase(c)}</th>)}</tr>
              </thead>
              <tbody>
                {reportedRows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {reportedColumns.map((c) => <td key={c}>{formatCell(row[c], c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reportedPagination && reportedPagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {reportedStartIdx + 1}–{Math.min(reportedStartIdx + reportedPagination.per_page, reportedPagination.total_count)} of {reportedPagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button className="pd-page-btn" disabled={reportsPage <= 1} onClick={() => setReportsPage((p) => p - 1)}>‹ Prev</button>
                <button className="pd-page-btn active">{reportsPage}</button>
                <button className="pd-page-btn" disabled={reportsPage >= reportedPagination.total_pages} onClick={() => setReportsPage((p) => p + 1)}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
