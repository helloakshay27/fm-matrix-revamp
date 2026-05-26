import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  fetchEventsKpi, fetchEventsRegistrationsKpi, fetchEventsByCategory, fetchTopEvents,
  type EventsKpi, type EventsRegistrationsKpi, type EventsByCategory, type TopEvents,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = { green: "#798C5E", red: "#E49191", blue: "#6B9BCC", orange: "#EDC488", purple: "#CECBF6" };

function fmtDateTime(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
  );
}

interface Props { filters: PulseFilters }

export function PulseEvents({ filters }: Props) {
  const [kpi, setKpi] = useState<EventsKpi | null>(null);
  const [regKpi, setRegKpi] = useState<EventsRegistrationsKpi | null>(null);
  const [byCategory, setByCategory] = useState<EventsByCategory | null>(null);
  const [topEvents, setTopEvents] = useState<TopEvents | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, [filters]);

  async function loadAll() {
    setLoading(true);
    try {
      const [k, rk, bc, te] = await Promise.all([
        fetchEventsKpi(filters),
        fetchEventsRegistrationsKpi(filters),
        fetchEventsByCategory(filters),
        fetchTopEvents(filters),
      ]);
      setKpi(k); setRegKpi(rk); setByCategory(bc); setTopEvents(te);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading events…</div>;
  }

  return (
    <div>
      <div className="pd-section-title">Events</div>

      {kpi && (
        <>
          <div className="pd-subsection-title">Event Overview</div>
          <div className="pd-kpi-grid" style={{ marginBottom: 16 }}>
            {[
              { label: "Total Events",        value: kpi.total_events },
              { label: "Upcoming",            value: kpi.upcoming_events },
              { label: "Past",                value: kpi.past_events },
              { label: "Complementary",       value: kpi.complementary_events },
              { label: "Paid",                value: kpi.paid_events },
              { label: "Requestable",         value: kpi.requestable_events },
              { label: "Pending Requests",    value: kpi.pending_requests },
              { label: "Total Registrations", value: kpi.total_registrations },
            ].map((item) => (
              <div key={item.label} className="pd-kpi-card">
                <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
                <div className="pd-kpi-label">{item.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {regKpi && (
        <>
          <div className="pd-subsection-title">Registration Analytics</div>
          <div className="pd-kpi-grid">
            {[
              { label: "Approved",           value: regKpi.approved },
              { label: "Pending",            value: regKpi.pending },
              { label: "Rejected",           value: regKpi.rejected },
              { label: "Attended",           value: regKpi.attended },
              { label: "Paid Registrations", value: regKpi.paid_registrations },
              { label: "Attendance Rate",    value: `${regKpi.attendance_rate}%` },
            ].map((item) => (
              <div key={item.label} className="pd-kpi-card">
                <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
                <div className="pd-kpi-label">{item.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="pd-charts-row">
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
                  <Bar dataKey="total_events"        name="Events"        fill={C.purple} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="total_registrations" name="Registrations" fill={C.blue}   radius={[3, 3, 0, 0]} />
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
                      { name: "Pending",  value: regKpi.pending },
                      { name: "Rejected", value: regKpi.rejected },
                      { name: "Attended", value: regKpi.attended },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="75%"
                    dataKey="value"
                  >
                    {[C.green, C.orange, C.red, C.blue].map((color, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {topEvents && topEvents.top_events.length > 0 && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Top 10 Events by Registrations</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>Rank</th><th>Event</th><th>Site</th><th>From</th><th>To</th>
                  <th>Paid</th><th>Registrations</th><th>Attended</th>
                </tr>
              </thead>
              <tbody>
                {topEvents.top_events.map((e, i) => (
                  <tr key={e.event_id}>
                    <td style={{ fontWeight: 700 }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.event_name}</td>
                    <td>{e.site_name}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>{fmtDateTime(e.from_time)}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>{fmtDateTime(e.to_time)}</td>
                    <td>
                      <span className={`pd-badge ${e.is_paid ? "pd-badge-warn" : "pd-badge-yes"}`}>
                        {e.is_paid ? "Paid" : "Free"}
                      </span>
                    </td>
                    <td>{e.total_registrations}</td>
                    <td>{e.attended}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
