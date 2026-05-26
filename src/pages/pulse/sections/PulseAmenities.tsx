import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  fetchAmenitiesKpi, fetchAmenitiesUtilization, fetchAmenitiesList, fetchAmenityBreakdown,
  type AmenitiesKpi, type AmenitiesUtilization, type AmenitiesListResponse, type AmenityBreakdown,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E", red: "#E7848E", blue: "#6B9BCC",
  orange: "#EDC488", gray: "#D3D1C7", teal: "#9EC8BA", purple: "#CECBF6",
};

interface Props { filters: PulseFilters }

export function PulseAmenities({ filters }: Props) {
  const [kpi, setKpi] = useState<AmenitiesKpi | null>(null);
  const [util, setUtil] = useState<AmenitiesUtilization | null>(null);
  const [list, setList] = useState<AmenitiesListResponse | null>(null);
  const [breakdown, setBreakdown] = useState<AmenityBreakdown | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading) fetchAmenitiesList(filters, page).then(setList).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [k, u, l, b] = await Promise.all([
        fetchAmenitiesKpi(filters),
        fetchAmenitiesUtilization(filters),
        fetchAmenitiesList(filters, p),
        fetchAmenityBreakdown(filters),
      ]);
      setKpi(k); setUtil(u); setList(l); setBreakdown(b);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading amenities…</div>;
  }

  const startIdx = list ? (list.pagination.current_page - 1) * list.pagination.per_page : 0;

  return (
    <div>
      <div className="pd-section-title">Amenities</div>

      {kpi && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Bookings",   value: kpi.total_bookings },
            { label: "Confirmed",        value: kpi.confirmed },
            { label: "Pending",          value: kpi.pending },
            { label: "Cancelled",        value: kpi.cancelled },
            { label: "Failed",           value: kpi.failed },
            { label: "Bookable",         value: kpi.bookable },
            { label: "Request Type",     value: kpi.request_type },
            { label: "Revenue",          value: kpi.total_revenue, currency: true },
            { label: "Wallet Payments",  value: kpi.wallet_payments },
            { label: "Online Payments",  value: kpi.online_payments },
          ].map((item) => (
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

      {kpi && (
        <div className="pd-charts-row-3">
          <div className="pd-chart-card">
            <div className="pd-chart-title">Booking Status</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Confirmed", value: kpi.confirmed },
                      { name: "Pending",   value: kpi.pending },
                      { name: "Cancelled", value: kpi.cancelled },
                      { name: "Failed",    value: kpi.failed },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="50%" outerRadius="70%"
                    dataKey="value"
                  >
                    {[C.green, C.orange, C.red, C.gray].map((color, i) => <Cell key={i} fill={color} />)}
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
                      { name: "Other",  value: Math.max(0, kpi.total_bookings - kpi.wallet_payments - kpi.online_payments) },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="50%" outerRadius="70%"
                    dataKey="value"
                  >
                    {[C.blue, C.purple, C.gray].map((color, i) => <Cell key={i} fill={color} />)}
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
                      { name: "Request",  value: kpi.request_type },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="50%" outerRadius="70%"
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
          <div className="pd-chart-title">Bookings per Facility — Request vs Bookable</div>
          <div className="pd-chart-inner" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown.breakdown} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="request_count" name="Request" fill={C.orange} stackId="bookings" />
                <Bar dataKey="bookable_count" name="Bookable" fill={C.teal} stackId="bookings" radius={[3, 3, 0, 0]} />
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
                  <th>Facility</th><th>Site</th><th>Type</th><th>Total</th>
                  <th>Confirmed</th><th>Pending</th><th>Cancelled</th><th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {util.facilities.map((f) => (
                  <tr key={f.facility_id}>
                    <td style={{ fontWeight: 500 }}>{f.facility_name}</td>
                    <td>{f.site_name}</td>
                    <td>{f.fac_type}</td>
                    <td>{f.total}</td>
                    <td style={{ color: C.green, fontWeight: 500 }}>{f.confirmed}</td>
                    <td style={{ color: C.orange }}>{f.pending}</td>
                    <td style={{ color: C.red }}>{f.cancelled}</td>
                    <td className="pd-revenue">₹{f.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {list && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Amenities List</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>#</th><th>Facility</th><th>Type</th><th>Max</th><th>Min</th>
                  <th>Complementary</th><th>Prepaid</th><th>Postpaid</th><th>Active</th>
                </tr>
              </thead>
              <tbody>
                {list.amenities.map((a, i) => (
                  <tr key={a.facility_id}>
                    <td>{startIdx + i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{a.facility_name}</td>
                    <td>{a.fac_type}</td>
                    <td>{a.max_people}</td>
                    <td>{a.min_people}</td>
                    <td><span className={`pd-badge ${a.complementary === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>{a.complementary}</span></td>
                    <td><span className={`pd-badge ${a.prepaid === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>{a.prepaid}</span></td>
                    <td><span className={`pd-badge ${a.postpaid === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>{a.postpaid}</span></td>
                    <td><span className={`pd-badge ${a.active === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>{a.active}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {list.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–{Math.min(startIdx + list.pagination.per_page, list.pagination.total_count)} of {list.pagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button className="pd-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
                <button className="pd-page-btn active">{page}</button>
                <button className="pd-page-btn" disabled={page >= list.pagination.total_pages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
