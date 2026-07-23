import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Building2 } from "lucide-react";
import {
  fetchEntityKpi, fetchEntitiesBySite, fetchEntityList, fetchEntityBreakdown,
  type EntityKpi, type EntitiesBySite, type EntityListResponse, type EntityBreakdown,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = { green: "#798C5E", red: "#E49191", blue: "#6B9BCC", orange: "#EDC488" };

interface Props { filters: PulseFilters }

export function PulseCustomers({ filters }: Props) {
  const [kpi, setKpi] = useState<EntityKpi | null>(null);
  const [bySite, setBySite] = useState<EntitiesBySite | null>(null);
  const [list, setList] = useState<EntityListResponse | null>(null);
  const [breakdown, setBreakdown] = useState<EntityBreakdown | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading) fetchEntityList(filters, page).then(setList).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [k, s, l, b] = await Promise.all([
        fetchEntityKpi(filters),
        fetchEntitiesBySite(filters),
        fetchEntityList(filters, p),
        fetchEntityBreakdown(filters),
      ]);
      setKpi(k); setBySite(s); setList(l); setBreakdown(b);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading customers…</div>;
  }

  const startIdx = list ? (list.pagination.current_page - 1) * list.pagination.per_page : 0;
  const hasData = !!(kpi || (bySite && bySite.sites.length) || list || (breakdown && breakdown.breakdown.length));

  return (
    <div>
      <div className="pd-section-header">
        <div className="pd-section-icon"><Building2 className="w-5 h-5" /></div>
        <div>
          <h2 className="pd-section-title">Customers</h2>
          <div className="pd-section-subtitle">Entities onboarded across sites</div>
        </div>
      </div>

      {!hasData && (
        <div className="pd-empty">
          <Building2 className="pd-empty-icon" />
          No customer data available for the selected filters.
        </div>
      )}

      {kpi && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Entities", value: kpi.total },
            { label: "Active", value: kpi.active },
            { label: "Inactive", value: kpi.inactive },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pd-charts-row">
        {kpi && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Active vs Inactive</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active", value: kpi.active },
                      { name: "Inactive", value: kpi.inactive },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="75%"
                    dataKey="value"
                  >
                    <Cell fill={C.green} />
                    <Cell fill={C.red} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {bySite && bySite.sites.length > 0 && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Entities by Site</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySite.sites} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="site_name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="active"   name="Active"   fill={C.green} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="inactive" name="Inactive" fill={C.red}   radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {breakdown && breakdown.breakdown.length > 0 && (
        <div className="pd-chart-card" style={{ marginBottom: 20 }}>
          <div className="pd-chart-title">Entity Breakdown — Users per Customer</div>
          <div className="pd-chart-inner" style={{ height: Math.max(260, breakdown.breakdown.length * 26) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={breakdown.breakdown}
                margin={{ left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="active_user_count"   name="Active"   fill={C.green} stackId="users" />
                <Bar dataKey="inactive_user_count" name="Inactive" fill={C.red}   stackId="users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {list && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Entity List</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th><th>Name</th><th>Customer Type</th><th>Email</th>
                  <th>Mobile</th><th>Site</th><th>Active</th><th className="pd-num">Leases</th><th>Domains</th>
                </tr>
              </thead>
              <tbody>
                {list.entities.map((e, i) => (
                  <tr key={e.entity_id}>
                    <td className="pd-num">{startIdx + i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{e.name}</td>
                    <td>{e.customer_type}</td>
                    <td>{e.email || "—"}</td>
                    <td>{e.mobile || "—"}</td>
                    <td>{e.site_name}</td>
                    <td>
                      <span className={`pd-badge ${e.active === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>
                        {e.active}
                      </span>
                    </td>
                    <td className="pd-num">{e.leases.length}</td>
                    <td style={{ color: "var(--color-text-light)", fontSize: 12 }}>{e.domains.join(", ") || "—"}</td>
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
                <button className={`pd-page-btn active`}>{page}</button>
                <button className="pd-page-btn" disabled={page >= list.pagination.total_pages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
