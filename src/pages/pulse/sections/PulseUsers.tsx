import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import {
  fetchUsersKpi, fetchUsersBySite, fetchPulseUsers,
  type UsersKpi, type UsersBySite, type PulseUsersResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E", blue: "#6B9BCC", orange: "#EDC488",
  purple: "#CECBF6", teal: "#9EC8BA", pink: "#E7848E",
};

const USER_TABS = [
  { label: "All",      value: undefined   },
  { label: "Admin",    value: "Admin"     },
  { label: "Occupant", value: "Occupant"  },
] as const;

type TabValue = typeof USER_TABS[number]["value"];

interface Props { filters: PulseFilters }

export function PulseUsers({ filters }: Props) {
  const [kpi, setKpi] = useState<UsersKpi | null>(null);
  const [bySite, setBySite] = useState<UsersBySite | null>(null);
  const [users, setUsers] = useState<PulseUsersResponse | null>(null);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<TabValue>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1, tab);
  }, [filters]);

  useEffect(() => {
    if (!loading) fetchPulseUsers(filters, page, tab).then(setUsers).catch(console.error);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchPulseUsers(filters, 1, tab).then(setUsers).catch(console.error);
  }, [tab]);

  async function loadAll(p: number, t: TabValue) {
    setLoading(true);
    try {
      const [k, s, u] = await Promise.all([
        fetchUsersKpi(filters),
        fetchUsersBySite(filters),
        fetchPulseUsers(filters, p, t),
      ]);
      setKpi(k); setBySite(s); setUsers(u);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading users…</div>;
  }

  const startIdx = users ? (users.pagination.current_page - 1) * users.pagination.per_page : 0;

  return (
    <div>
      <div className="pd-section-title">Users</div>

      {kpi && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Users",      value: kpi.total_users },
            { label: "Admins",           value: kpi.admins },
            { label: "Occupants",        value: kpi.occupants },
            { label: "Occupant Admins",  value: kpi.occupant_admins },
            { label: "Org Admins",       value: kpi.org_admins },
            { label: "Male",             value: kpi.male },
            { label: "Female",           value: kpi.female },
            { label: "New Users",        value: kpi.new_users },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {kpi && (
        <div className="pd-charts-row">
          <div className="pd-chart-card">
            <div className="pd-chart-title">User Type Breakdown</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Admins",         value: kpi.admins },
                      { name: "Occupants",      value: kpi.occupants },
                      { name: "Occupant Admins",value: kpi.occupant_admins },
                      { name: "Org Admins",     value: kpi.org_admins },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="75%"
                    dataKey="value"
                  >
                    {[C.purple, C.green, C.orange, C.teal].map((color, i) => (
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
            <div className="pd-chart-title">Gender Distribution</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: kpi.male },
                      { name: "Female", value: kpi.female },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="75%"
                    dataKey="value"
                  >
                    <Cell fill={C.blue} />
                    <Cell fill={C.pink} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {bySite && bySite.sites.length > 0 && (
        <div className="pd-charts-row-single">
          <div className="pd-chart-card">
            <div className="pd-chart-title">Users by Site</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySite.sites} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="site_name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="admins"    name="Admins"    fill={C.purple} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="occupants" name="Occupants" fill={C.green}  radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {users && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">User List</span>
            <div className="pd-sub-tabs">
              {USER_TABS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={`pd-sub-tab${tab === t.value ? " active" : ""}`}
                  onClick={() => setTab(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Type</th><th>Email</th>
                  <th>Mobile</th><th>Alt Mobile</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.users.map((u, i) => (
                  <tr key={u.user_id}>
                    <td>{startIdx + i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{u.user_name}</td>
                    <td><span className="pd-badge pd-badge-pub">{u.user_type}</span></td>
                    <td>{u.email || "—"}</td>
                    <td>{u.mobile || "—"}</td>
                    <td>{u.alternate_mobile || "—"}</td>
                    <td>
                      <span className={`pd-badge ${u.status === "Yes" ? "pd-badge-yes" : "pd-badge-no"}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–{Math.min(startIdx + users.pagination.per_page, users.pagination.total_count)} of {users.pagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button className="pd-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
                <button className="pd-page-btn active">{page}</button>
                <button className="pd-page-btn" disabled={page >= users.pagination.total_pages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
