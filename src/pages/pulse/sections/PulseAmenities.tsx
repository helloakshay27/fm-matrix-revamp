import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import {
  fetchAmenitiesKpi,
  fetchAmenitiesUtilization,
  fetchAmenityBreakdown,
  fetchFacilitiesOverview,
  fetchFacilityUtilization,
  fetchFacilitiesDetails,
  type AmenitiesKpi,
  type AmenitiesUtilization,
  type AmenityBreakdown,
  type FacilitiesOverview,
  type FacilityUtilizationOverview,
  type FacilitiesDetailsResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E",
  red: "#E7848E",
  blue: "#6B9BCC",
  orange: "#EDC488",
  gray: "#D3D1C7",
  teal: "#9EC8BA",
  purple: "#CECBF6",
};

// Static placeholder — no backing API yet for booking-source attribution.
const STATIC_BOOKING_SOURCE = [
  { name: "App", pct: 35, color: C.blue },
  { name: "Email", pct: 28, color: C.red },
  { name: "Admin Booking", pct: 18, color: C.green },
  { name: "Other", pct: 19, color: C.orange },
];

// Cycled by position to color the Booking Status / Payment Channels donuts —
// both are arbitrary-length breakdowns from the API, not fixed categories.
const DONUT_COLOR_PALETTE = [C.green, C.orange, C.red, C.blue, C.purple, C.teal, C.gray];

// "payment failed" -> "Payment Failed", "pay_on_facility" -> "Pay On Facility",
// but short all-caps codes like "NA" are left alone.
function humanizeLabel(raw: string) {
  if (raw.length <= 4 && raw === raw.toUpperCase()) return raw;
  return raw
    .split(/[_\s]+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

// Maps a booking's free-text current_status (confirmed/pending/cancelled/
// "payment failed"/...) to the closest existing badge color.
function bookingStatusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmed") return "pd-badge-yes";
  if (s === "pending") return "pd-badge-warn";
  return "pd-badge-no";
}

// 60 -> "1 hr", 240 -> "4 hrs", 1440 -> "1 day", 90 -> "1.5 hrs".
function formatDuration(minutes: number) {
  if (minutes >= 1440 && minutes % 1440 === 0) {
    const days = minutes / 1440;
    return `${days} day${days !== 1 ? "s" : ""}`;
  }
  if (minutes >= 60) {
    const hours = Math.round((minutes / 60) * 10) / 10;
    return `${hours} hr${hours !== 1 ? "s" : ""}`;
  }
  return `${minutes} min`;
}

// Turns value/color segments into a flat array of unit colors (largest-
// remainder rounding so counts always sum to exactly `totalUnits`) — the
// pure-CSS waffle/unit chart's cell order.
function buildWaffleUnits(segments: { pct: number; color: string }[], totalUnits = 50) {
  const raw = segments.map((s) => (s.pct / 100) * totalUnits);
  const base = raw.map(Math.floor);
  const remaining = totalUnits - base.reduce((a, b) => a + b, 0);
  const remainders = raw
    .map((r, i) => ({ i, frac: r - base[i] }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remaining; k++) base[remainders[k].i]++;
  return segments.flatMap((s, i) => Array(base[i]).fill(s.color));
}

// "42000" -> "₹42K" — compact currency formatting for the Revenue by
// Amenity bar chart's value labels.
function formatCompactCurrency(value: number) {
  if (value >= 1000) return `₹${Math.round(value / 1000)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

interface Props {
  filters: PulseFilters;
}

export function PulseAmenities({ filters }: Props) {
  const [kpi, setKpi] = useState<AmenitiesKpi | null>(null);
  const [util, setUtil] = useState<AmenitiesUtilization | null>(null);
  const [bookingLogs, setBookingLogs] = useState<FacilitiesDetailsResponse | null>(null);
  const [breakdown, setBreakdown] = useState<AmenityBreakdown | null>(null);
  const [facilitiesOverview, setFacilitiesOverview] = useState<FacilitiesOverview | null>(null);
  const [facilityUtil, setFacilityUtil] = useState<FacilityUtilizationOverview | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchFacilitiesDetails(filters, page).then(setBookingLogs).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [lR, fR, fuR] = await Promise.allSettled([
        fetchFacilitiesDetails(filters, p),
        fetchFacilitiesOverview(filters),
        fetchFacilityUtilization(filters),
      ]);
      if (lR.status === "fulfilled") setBookingLogs(lR.value);
      if (fR.status === "fulfilled") setFacilitiesOverview(fR.value);
      else console.error("[PulseAmenities] facilities_overview failed:", fR.reason);
      if (fuR.status === "fulfilled") setFacilityUtil(fuR.value);
      else console.error("[PulseAmenities] facility_utilization failed:", fuR.reason);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading amenities…
      </div>
    );
  }

  const startIdx = bookingLogs
    ? (bookingLogs.pagination.current_page - 1) * bookingLogs.pagination.per_page
    : 0;
  const hasData = !!(
    kpi ||
    facilitiesOverview ||
    (util && util.facilities.length) ||
    bookingLogs ||
    (breakdown && breakdown.breakdown.length)
  );

  // Real monthly points backing both trend cards below — Utilisation Trend
  // plots new/returning, Bookable vs Requestable plots bookable/requestable,
  // both read off the same `points` array (each point carries all four keys).
  const utilPoints = (facilityUtil?.points ?? []).map((p) => ({
    month: p.label,
    new: p.new,
    returning: p.returning,
    bookable: p.bookable,
    requestable: p.requestable,
  }));

  // Derived layout for the pure-CSS waffle chart (Booking Source Analytics).
  // Fill order runs top-to-bottom the same as the legend but reversed
  // (Other → Admin Booking → Email → App), matching the reference image.
  const waffleUnits = buildWaffleUnits([...STATIC_BOOKING_SOURCE].reverse());

  // Booking Status / Payment Channels donut segments, colored by position
  // since the API returns an arbitrary-length breakdown, not fixed categories.
  const bookingStatusSegments = (facilitiesOverview?.booking_status.breakdown ?? []).map(
    (b, i) => ({
      name: humanizeLabel(b.status),
      value: b.count,
      color: DONUT_COLOR_PALETTE[i % DONUT_COLOR_PALETTE.length],
    })
  );
  const bookingStatusTotal = facilitiesOverview?.booking_status.total ?? 0;
  const confirmedBookings =
    facilitiesOverview?.booking_status.breakdown.find((b) => b.status === "confirmed")?.count ?? 0;
  const paymentChannelSegments = (facilitiesOverview?.payment_channels.breakdown ?? []).map(
    (p, i) => ({
      name: humanizeLabel(p.payment_method),
      value: p.count,
      color: DONUT_COLOR_PALETTE[i % DONUT_COLOR_PALETTE.length],
    })
  );
  const paymentChannelsTotal = facilitiesOverview?.payment_channels.total ?? 0;
  const revenueRows = (facilitiesOverview?.revenue_by_facility ?? []).map((r) => ({
    name: r.name,
    value: r.revenue,
  }));
  // The API can return multiple rows per facility name (distinct bookable
  // slot groups), so index into the key rather than assuming unique names.
  const utilRows = (facilityUtil?.utilisation_by_facility.facilities ?? []).map((f, i) => ({
    name: f.name,
    pct: f.utilisation_percentage,
    color: DONUT_COLOR_PALETTE[i % DONUT_COLOR_PALETTE.length],
  }));

  // Shared renderer for the two donut-with-center-total cards below (Booking
  // Status, Payment Channels) — `ringSegments` drives the actual gradient
  // math (may include an unlabeled remainder), `legendItems` is what's shown.
  const renderDonutCard = (
    title: string,
    ringSegments: { name: string; value: number; color: string }[],
    legendItems: { name: string; value: number; color: string }[],
    total: number
  ) => (
    <div className="pd-growth-card">
      <div className="pd-panel-title">{title}</div>
      <div className="pd-growth-chart-inner pd-donut-card-body">
        <div className="pd-donut-hitbox pd-donut-hitbox-lg">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ringSegments}
                dataKey="value"
                nameKey="name"
                innerRadius="74%"
                outerRadius="100%"
                paddingAngle={1}
              >
                {ringSegments.map((seg) => (
                  <Cell key={seg.name} fill={seg.color} fillOpacity={0.8} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pd-donut-center">
            <span className="pd-donut-center-value">{total}</span>
            <span className="pd-donut-center-label">TOTAL</span>
          </div>
        </div>
        <div className="pd-donut-legend">
          {legendItems.map((item) => (
            <div key={item.name} className="pd-donut-legend-item">
              <span className="pd-donut-legend-dot" style={{ background: item.color }} />
              <span className="pd-donut-legend-name">{item.name}</span>
              <span className="pd-donut-legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Shared renderer for the two identically-shaped trend cards below —
  // avoids duplicating the SVG/axis markup for each title. Each call computes
  // its own axis scale since Utilisation Trend and Bookable vs Requestable
  // plot different series with different value ranges.
  const renderTrendCard = (
    title: string,
    series: { key: "new" | "returning" | "bookable" | "requestable"; name: string; color: string }[],
    data: { month: string; new: number; returning: number; bookable: number; requestable: number }[],
    growthPercentage: number,
    trend: "up" | "down" | "flat"
  ) => {
    const TrendIcon = trend === "down" ? ArrowDown : ArrowUp;

    return (
      <div className="pd-growth-card pd-growth-card--amenities-trend">
        <div className="pd-panel-title">
          {title}
          {trend !== "flat" && (
            <span className="pd-growth-badge">
              <TrendIcon size={10} />
              {Math.abs(growthPercentage)}%
            </span>
          )}
        </div>
        <div className="pd-growth-chart-inner">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend align="left" wrapperStyle={{ fontSize: 10 }} />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="pd-mini-legend">
          {series.map((s) => (
            <span key={s.key} className="pd-mini-legend-item">
              <i className="pd-mini-legend-dot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div> */}
      </div>
    );
  };

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <Sparkles className="pd-empty-icon" />
          No amenities data available for the selected filters.
        </div>
      )}

      {facilitiesOverview && (
        <div className="pd-kpi-grid">
          {[
            {
              label: "Bookings",
              value: facilitiesOverview.kpis.total_bookings,
              // Real breakdown, not a fabricated delta — "N confirmed" of the total.
              badge:
                confirmedBookings > 0
                  ? { text: `+${confirmedBookings}`, variant: "success" as const }
                  : undefined,
            },
            {
              label: "Amenities Active",
              value: facilitiesOverview.kpis.active_facilities,
              // No total-facility-count field to build a meaningful percentage
              // against, so this card intentionally has no badge.
              badge: undefined as { text: string; variant: "success" | "warning" | "info" | "neutral" } | undefined,
            },
            {
              label: "Total Revenue",
              value: facilitiesOverview.kpis.total_revenue,
              currency: true,
              // No per-payment-method revenue split exists in the API (only
              // booking counts), so this card intentionally has no badge
              // rather than mislabeling a booking-count ratio as revenue.
              badge: undefined as { text: string; variant: "success" | "warning" | "info" | "neutral" } | undefined,
            },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card pd-kpi-card--badged">
              <div className="pd-kpi-main">
                <div className="pd-kpi-label">{item.label}</div>
                <div className="pd-kpi-value">
                  {item.currency
                    ? `₹${item.value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                    : item.value.toLocaleString()}
                </div>
              </div>
              {item.badge && (
                <span className={`pd-kpi-badge pd-kpi-badge-${item.badge.variant}`}>
                  {item.badge.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pd-growth-row">
        {renderTrendCard(
          "Utilisation Trend",
          [
            { key: "new", name: "New", color: "var(--color-primary)" },
            { key: "returning", name: "Returning", color: C.purple },
          ],
          utilPoints,
          facilityUtil?.utilisation_trend.growth_percentage ?? 0,
          facilityUtil?.utilisation_trend.trend ?? "flat"
        )}
        {renderTrendCard(
          "Bookable vs Requestable",
          [
            { key: "bookable", name: "Bookable", color: C.teal },
            { key: "requestable", name: "Requestable", color: C.orange },
          ],
          utilPoints,
          facilityUtil?.bookable_vs_requestable.growth_percentage ?? 0,
          facilityUtil?.bookable_vs_requestable.trend ?? "flat"
        )}

        {/* <div className="pd-growth-card pd-growth-card--amenities-source">
          <div className="pd-panel-title">Booking Source Analytics</div>
          <div className="pd-growth-chart-inner pd-waffle-body">
            <div className="pd-waffle-grid">
              {waffleUnits.map((color, i) => (
                <span key={i} className="pd-waffle-cell" style={{ background: color }} />
              ))}
            </div>
            <div className="pd-waffle-legend">
              {STATIC_BOOKING_SOURCE.map((s) => (
                <div key={s.name} className="pd-waffle-legend-item">
                  <span className="pd-waffle-legend-swatch" style={{ background: s.color }} />
                  <span className="pd-waffle-legend-name">{s.name}</span>
                  <span className="pd-waffle-legend-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>

      {facilitiesOverview && (
        <div className="pd-growth-row">
          {renderDonutCard(
            "Booking Status",
            bookingStatusSegments,
            bookingStatusSegments,
            bookingStatusTotal
          )}
          {renderDonutCard(
            "Payment Channels",
            paymentChannelSegments,
            paymentChannelSegments,
            paymentChannelsTotal
          )}

          <div className="pd-growth-card">
            <div className="pd-panel-title">Revenue by Amenity</div>
            <div className="pd-growth-chart-inner" style={{ overflowY: "auto" }}>
              <ResponsiveContainer width="100%" height={Math.max(160, revenueRows.length * 28)}>
                <BarChart data={revenueRows} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={formatCompactCurrency} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(v: number) => formatCompactCurrency(v)} />
                  <Bar
                    dataKey="value"
                    name="Revenue"
                    fill="var(--color-secondary-teal)"
                    radius={[0, 3, 3, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pd-growth-card">
            <div className="pd-panel-title">Utilization By Facility</div>
            <div className="pd-growth-chart-inner" style={{ overflowY: "auto" }}>
              <ResponsiveContainer width="100%" height={Math.max(160, utilRows.length * 28)}>
                <BarChart data={utilRows} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="pct" name="Utilization" radius={[0, 3, 3, 0]}>
                    {utilRows.map((r, i) => (
                      <Cell key={`${r.name}-${i}`} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* {kpi && (
        <div className="pd-charts-row-3">
          <div className="pd-chart-card">
            <div className="pd-chart-title">Booking Status</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Confirmed", value: kpi.confirmed },
                      { name: "Pending", value: kpi.pending },
                      { name: "Cancelled", value: kpi.cancelled },
                      { name: "Failed", value: kpi.failed },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {[C.green, C.orange, C.red, C.gray].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pd-chart-card">
            <div className="pd-chart-title">Payment Method</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Wallet", value: kpi.wallet_payments },
                      { name: "Online", value: kpi.online_payments },
                      {
                        name: "Other",
                        value: Math.max(
                          0,
                          kpi.total_bookings -
                          kpi.wallet_payments -
                          kpi.online_payments
                        ),
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {[C.blue, C.purple, C.gray].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pd-chart-card">
            <div className="pd-chart-title">Bookable vs Request</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Bookable", value: kpi.bookable },
                      { name: "Request", value: kpi.request_type },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    <Cell fill={C.teal} />
                    <Cell fill={C.orange} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {breakdown && breakdown.breakdown.length > 0 && (
        <div className="pd-chart-card" style={{ marginBottom: 20 }}>
          <div className="pd-chart-title">
            Bookings per Facility — Request vs Bookable
          </div>
          <div className="pd-chart-inner" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown.breakdown} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar
                  dataKey="request_count"
                  name="Request"
                  fill={C.orange}
                  stackId="bookings"
                />
                <Bar
                  dataKey="bookable_count"
                  name="Bookable"
                  fill={C.teal}
                  stackId="bookings"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {util && util.facilities.length > 0 && (
        <div className="pd-tbl-card" style={{ marginBottom: 20 }}>
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Facility Utilization</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Site</th>
                  <th>Type</th>
                  <th className="pd-num">Total</th>
                  <th className="pd-num">Confirmed</th>
                  <th className="pd-num">Pending</th>
                  <th className="pd-num">Cancelled</th>
                  <th className="pd-num">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {util.facilities.map((f) => (
                  <tr key={f.facility_id}>
                    <td style={{ fontWeight: 500 }}>{f.facility_name}</td>
                    <td>{f.site_name}</td>
                    <td>{f.fac_type}</td>
                    <td className="pd-num">{f.total}</td>
                    <td
                      className="pd-num"
                      style={{ color: C.green, fontWeight: 500 }}
                    >
                      {f.confirmed}
                    </td>
                    <td className="pd-num" style={{ color: C.orange }}>
                      {f.pending}
                    </td>
                    <td className="pd-num" style={{ color: C.red }}>
                      {f.cancelled}
                    </td>
                    <td className="pd-num pd-revenue">
                      ₹
                      {f.revenue.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}

      {bookingLogs && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Facility Bookings Log</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  <th>Amenity / Venue</th>
                  <th>Client / Tenant</th>
                  <th>Booking Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="pd-num">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {bookingLogs.bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="pd-num">{b.serial}</td>
                    <td style={{ fontWeight: 500 }}>{b.facility_name}</td>
                    <td>{b.tenant || "—"}</td>
                    <td>
                      {new Date(b.booking_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>{formatDuration(b.duration_minutes)}</td>
                    <td>
                      <span className={`pd-badge ${bookingStatusBadgeClass(b.current_status)}`}>
                        {humanizeLabel(b.current_status)}
                      </span>
                    </td>
                    <td className="pd-num pd-revenue">
                      ₹{b.amount_paid.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookingLogs.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–
                {Math.min(
                  startIdx + bookingLogs.pagination.per_page,
                  bookingLogs.pagination.total_count
                )}{" "}
                of {bookingLogs.pagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button
                  className="pd-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                <button className="pd-page-btn active">{page}</button>
                <button
                  className="pd-page-btn"
                  disabled={page >= bookingLogs.pagination.total_pages}
                  onClick={() => setPage((p) => p + 1)}
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
