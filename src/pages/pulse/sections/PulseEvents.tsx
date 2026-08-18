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
import { CalendarDays, ArrowUp, ArrowDown } from "lucide-react";
import {
  fetchEventsOverview,
  fetchEventsBreakup,
  fetchEventsDetails,
  type EventsOverview,
  type EventsBreakup,
  type EventsDetailsResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E",
  red: "#E49191",
  blue: "#6B9BCC",
  orange: "#EDC488",
  purple: "#CECBF6",
  teal: "#9EC8BA",
  eventsPaid: "#BF2B2B",
  eventsComplimentary: "#CE6868",
};

interface Props {
  filters: PulseFilters;
}

export function PulseEvents({ filters }: Props) {
  const [eventsOverview, setEventsOverview] = useState<EventsOverview | null>(null);
  const [eventsBreakup, setEventsBreakup] = useState<EventsBreakup | null>(null);
  const [eventsDirectory, setEventsDirectory] = useState<EventsDetailsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [eventSearch, setEventSearch] = useState("");

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchEventsDetails(filters, page).then(setEventsDirectory).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [eoR, bcR, edR] = await Promise.allSettled([
        fetchEventsOverview(filters),
        fetchEventsBreakup(filters),
        fetchEventsDetails(filters, p),
      ]);
      if (eoR.status === "fulfilled") setEventsOverview(eoR.value);
      else console.error("[PulseEvents] events_overview failed:", eoR.reason);
      if (bcR.status === "fulfilled") setEventsBreakup(bcR.value);
      else console.error("[PulseEvents] events_breakup failed:", bcR.reason);
      if (edR.status === "fulfilled") setEventsDirectory(edR.value);
      else console.error("[PulseEvents] events_details failed:", edR.reason);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading events…
      </div>
    );
  }

  const hasData = !!(eventsOverview || eventsBreakup || eventsDirectory);
  const startIdx = eventsDirectory
    ? (eventsDirectory.pagination.current_page - 1) * eventsDirectory.pagination.per_page
    : 0;

  // Real monthly points for the "Registration Scale & Growth Trend" chart.
  const regTrendData = (eventsOverview?.registration_trend.points ?? []).map((p) => ({
    month: p.label,
    approved: p.approved,
    rejected: p.rejected,
    pending: p.pending,
  }));
  const regTrendGrowthPct = eventsOverview?.registration_trend.growth_percentage ?? 0;
  const regTrendTrend = eventsOverview?.registration_trend.trend ?? "flat";
  const RegTrendIcon = regTrendTrend === "down" ? ArrowDown : ArrowUp;
  const regTrendSeries = [
    { key: "approved" as const, name: "Approved", color: "var(--color-primary)" },
    { key: "rejected" as const, name: "Rejected", color: C.purple },
    { key: "pending" as const, name: "Pending", color: C.teal },
  ];

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <CalendarDays className="pd-empty-icon" />
          No event data available for the selected filters.
        </div>
      )}

      {eventsOverview && (
        <>
          <div className="pd-subsection-title">Event Status Overview</div>
          <div className="pd-kpi-grid" style={{ marginBottom: 16 }}>
            {[
              { label: "Total Events", value: eventsOverview.event_status.total_events, badge: { text: "No Change", variant: "neutral" as const } },
              { label: "Upcoming", value: eventsOverview.event_status.upcoming_events, badge: { text: "--", variant: "neutral" as const } },
              { label: "Past", value: eventsOverview.event_status.past_events, badge: { text: "Completed", variant: "info" as const } },
              { label: "Complimentary", value: eventsOverview.event_status.complimentary_events, badge: { text: "Free", variant: "info" as const } },
              { label: "Paid", value: eventsOverview.event_status.paid_events, badge: { text: "Premium", variant: "warning" as const } },
            ].map((item) => (
              <div key={item.label} className="pd-kpi-card pd-kpi-card--badged">
                <div className="pd-kpi-main">
                  <div className="pd-kpi-label">{item.label}</div>
                  <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
                </div>
                <span className={`pd-kpi-badge pd-kpi-badge-${item.badge.variant}`}>
                  {item.badge.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {eventsOverview && (
        <>
          <div className="pd-subsection-title">Registration Metrics</div>
          <div className="pd-kpi-grid">
            {[
              {
                label: "Approved",
                value: eventsOverview.registration_metrics.approved,
                // Real share, not a fabricated delta.
                badge: {
                  text: `${Math.round(eventsOverview.registration_metrics.approval_rate)}%`,
                  variant: "success" as const,
                },
              },
              { label: "Pending", value: eventsOverview.registration_metrics.pending, badge: { text: "Awaiting", variant: "warning" as const } },
              {
                label: "Rejected / Attended",
                value: eventsOverview.registration_metrics.rejected + eventsOverview.registration_metrics.attended,
                // Real share, not a fabricated delta.
                badge: {
                  text: `${eventsOverview.registration_metrics.total_registrations > 0 ? Math.round(((eventsOverview.registration_metrics.rejected + eventsOverview.registration_metrics.attended) / eventsOverview.registration_metrics.total_registrations) * 100) : 0}%`,
                  variant: "danger" as const,
                },
              },
              { label: "Paid Registrations", value: eventsOverview.registration_metrics.paid_registrations, badge: { text: "Confirmed", variant: "success" as const } },
              {
                label: "Registration Rate",
                value: `${eventsOverview.registration_metrics.registration_rate.toFixed(1)}%`,
                badge:
                  eventsOverview.registration_metrics.registration_rate > 0
                    ? { text: "Active", variant: "success" as const }
                    : { text: "Pending Activity", variant: "warning" as const },
              },
            ].map((item) => (
              <div key={item.label} className="pd-kpi-card pd-kpi-card--badged">
                <div className="pd-kpi-main">
                  <div className="pd-kpi-label">{item.label}</div>
                  <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
                </div>
                <span className={`pd-kpi-badge pd-kpi-badge-${item.badge.variant}`}>
                  {item.badge.text}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="pd-chart-card pd-chart-card--event-revenue" style={{ marginBottom: 20 }}>
        <div className="pd-event-revenue-header">
          <div className="pd-panel-title">Revenue by event</div>
          <div className="pd-event-revenue-total">
            ₹{(eventsBreakup?.revenue_by_event.total_revenue ?? 0).toLocaleString("en-IN")}
            <span className="pd-kpi-badge pd-kpi-badge-info" style={{ marginLeft: 10 }}>
              Paid events only
            </span>
          </div>
        </div>
        <div className="pd-event-revenue-list pd-event-revenue-list--scroll">
          {(eventsBreakup?.revenue_by_event.events ?? []).map((e) => {
            const total = eventsBreakup?.revenue_by_event.total_revenue || 0;
            return (
              <div key={e.name} className="pd-event-revenue-row">
                <div className="pd-event-revenue-row-top">
                  <span className="pd-event-revenue-name">{e.name}</span>
                  <span className="pd-event-revenue-amount">
                    {e.revenue === 0 ? "Complimentary" : `₹${e.revenue.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <span className="pd-event-revenue-track">
                  <span
                    className="pd-event-revenue-fill"
                    style={{
                      width: total > 0 ? `${(e.revenue / total) * 100}%` : "0%",
                    }}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pd-growth-row">
        {eventsBreakup && eventsBreakup.category_breakdown.length > 0 && (
          <div className="pd-growth-card">
            <div className="pd-panel-title">Events by Category</div>
            <div className="pd-growth-chart-inner pd-hbar-list">
              {eventsBreakup.category_breakdown.map((cat, i) => {
                const maxCount = Math.max(
                  1,
                  ...eventsBreakup.category_breakdown.map((c) => c.count)
                );
                const label = cat.category
                  ? cat.category[0].toUpperCase() + cat.category.slice(1)
                  : "Uncategorized";
                return (
                  <div key={cat.category ?? "uncategorized"} className="pd-hbar-row">
                    <span className="pd-hbar-label" style={{ width: 100, textAlign: "left" }}>
                      {label}
                    </span>
                    <span className="pd-hbar-track">
                      <span
                        className="pd-hbar-fill"
                        style={{
                          width: `${(cat.count / maxCount) * 100}%`,
                          background: [C.orange, C.teal, C.purple][i % 3],
                        }}
                        data-tooltip={`${label}: ${cat.count} events (${cat.percentage}%)`}
                      />
                    </span>
                    <span className="pd-hbar-value" style={{ width: 24 }}>
                      {cat.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {eventsOverview && (
          <div className="pd-growth-card">
            <div className="pd-panel-title">Events Overview</div>
            <div className="pd-growth-chart-inner pd-events-split">
              <div
                className="pd-events-split-seg"
                style={{
                  flexGrow: eventsOverview.event_status.paid_events || 0.0001,
                  background: C.eventsPaid,
                }}
              >
                Paid ({eventsOverview.event_status.paid_events})
              </div>
              <div
                className="pd-events-split-seg"
                style={{
                  flexGrow: eventsOverview.event_status.complimentary_events || 0.0001,
                  background: C.eventsComplimentary,
                }}
              >
                Complimentary ({eventsOverview.event_status.complimentary_events})
              </div>
            </div>
          </div>
        )}

        {eventsOverview && (
          <div className="pd-growth-card">
            <div className="pd-panel-title">
              Registration Scale &amp; Growth Trend
              {regTrendTrend !== "flat" && (
                <span className="pd-growth-badge">
                  <RegTrendIcon size={10} />
                  {Math.abs(regTrendGrowthPct)}%
                </span>
              )}
            </div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend align="left" wrapperStyle={{ fontSize: 10 }} />
                  {regTrendSeries.map((s) => (
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
          </div>
        )}
      </div>

      {/* <div className="pd-charts-row">
        {byCategory && byCategory.categories.length > 0 && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Events by Category</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory.categories} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    tickFormatter={(v) => v ?? "Uncategorized"}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(v) => v ?? "Uncategorized"} />
                  <Legend verticalAlign="top" />
                  <Bar
                    dataKey="total_events"
                    name="Events"
                    fill={C.purple}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="total_registrations"
                    name="Registrations"
                    fill={C.blue}
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {regKpi && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Registration Status</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Approved", value: regKpi.approved },
                      { name: "Pending", value: regKpi.pending },
                      { name: "Rejected", value: regKpi.rejected },
                      { name: "Attended", value: regKpi.attended },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="75%"
                    dataKey="value"
                  >
                    {[C.green, C.orange, C.red, C.blue].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div> */}

      {eventsDirectory && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title pd-tbl-title--plain">Panchshil Corporate Events Directory</span>
            <input
              type="text"
              className="pd-tbl-search-input"
              placeholder="Search events..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
            />
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Site</th>
                  <th>Type</th>
                  <th className="pd-num">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {eventsDirectory.events
                  .filter((e) =>
                    e.title.toLowerCase().includes(eventSearch.trim().toLowerCase())
                  )
                  .map((e) => (
                    <tr key={e.id}>
                      <td className="pd-num">{e.serial}</td>
                      <td style={{ fontWeight: 500 }}>{e.title}</td>
                      <td>
                        <span className="pd-chip">
                          {e.category
                            ? e.category[0].toUpperCase() + e.category.slice(1)
                            : "—"}
                        </span>
                      </td>
                      <td>
                        {new Date(e.from_time).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td>{e.site_name}</td>
                      <td>
                        <span
                          className={`pd-badge pd-badge--flat ${e.is_paid ? "pd-badge-no" : "pd-badge-yes"
                            }`}
                        >
                          {e.is_paid ? "Paid" : "Complimentary"}
                        </span>
                      </td>
                      <td className="pd-num">{e.registrations}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {eventsDirectory.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–
                {Math.min(
                  startIdx + eventsDirectory.pagination.per_page,
                  eventsDirectory.pagination.total_count
                )}{" "}
                of {eventsDirectory.pagination.total_count}
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
                  disabled={page >= eventsDirectory.pagination.total_pages}
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
