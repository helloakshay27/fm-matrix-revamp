import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Bell } from "lucide-react";
import {
  fetchNoticeboardKpi, fetchNoticeboardBySite, fetchNoticeboardList,
  type NoticeboardKpi, type NoticeboardBySite, type NoticeboardListResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = { green: "#798C5E", red: "#E7848E", blue: "#6B9BCC", gray: "#D3D1C7" };

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

interface Props { filters: PulseFilters }

export function PulseNotices({ filters }: Props) {
  const [kpi, setKpi] = useState<NoticeboardKpi | null>(null);
  const [bySite, setBySite] = useState<NoticeboardBySite | null>(null);
  const [list, setList] = useState<NoticeboardListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading) fetchNoticeboardList(filters, page).then(setList).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [k, s, l] = await Promise.all([
        fetchNoticeboardKpi(filters),
        fetchNoticeboardBySite(filters),
        fetchNoticeboardList(filters, p),
      ]);
      setKpi(k); setBySite(s); setList(l);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading notices…</div>;
  }

  const startIdx = list ? (list.pagination.current_page - 1) * list.pagination.per_page : 0;
  const hasData = !!(kpi || (bySite && bySite.sites.length) || list);

  return (
    <div>
      <div className="pd-section-header">
        <div className="pd-section-icon"><Bell className="w-5 h-5" /></div>
        <div>
          <h2 className="pd-section-title">Notices</h2>
          <div className="pd-section-subtitle">Noticeboard status and visibility across sites</div>
        </div>
      </div>

      {!hasData && (
        <div className="pd-empty">
          <Bell className="pd-empty-icon" />
          No notice data available for the selected filters.
        </div>
      )}

      {kpi && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Notices",  value: kpi.total },
            { label: "Active",         value: kpi.active },
            { label: "Inactive",       value: kpi.inactive },
            { label: "Important",      value: kpi.important },
            { label: "Expired",        value: kpi.expired },
            { label: "Expiring Soon",  value: kpi.expiring_soon },
            { label: "Show on Home",   value: kpi.show_on_home },
            { label: "Shared",         value: kpi.shared },
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
            <div className="pd-chart-title">Notice Status</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Active",   value: kpi.active },
                      { name: "Inactive", value: kpi.inactive },
                      { name: "Expired",  value: kpi.expired },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="75%"
                    dataKey="value"
                  >
                    <Cell fill={C.green} />
                    <Cell fill={C.gray} />
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
            <div className="pd-chart-title">Notices by Site</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySite.sites} margin={{ bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="site_name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar dataKey="total"         name="Total"   fill={C.blue}  radius={[3, 3, 0, 0]} />
                  <Bar dataKey="active_count"  name="Active"  fill={C.green} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expired_count" name="Expired" fill={C.red}   radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {list && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Notices List</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th><th>Heading</th><th>Status</th><th>Important</th><th>Active</th>
                  <th>Expire Date</th><th>Expired</th><th>Sites</th><th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {list.notices.map((n, i) => (
                  <tr key={n.notice_id}>
                    <td className="pd-num">{startIdx + i + 1}</td>
                    <td style={{ fontWeight: 500, maxWidth: 260 }}>{n.heading}</td>
                    <td><span className="pd-badge pd-badge-pub">{n.status}</span></td>
                    <td>{n.is_important ? <span className="pd-badge pd-badge-warn">Important</span> : "—"}</td>
                    <td><span className={`pd-badge ${n.active ? "pd-badge-yes" : "pd-badge-no"}`}>{n.active ? "Yes" : "No"}</span></td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{fmtDate(n.expire_time)}</td>
                    <td>
                      {n.is_expired
                        ? <span className="pd-badge pd-badge-no">Expired</span>
                        : <span className="pd-badge pd-badge-yes">Active</span>
                      }
                    </td>
                    <td style={{ fontSize: 12, color: "var(--color-text-light)" }}>{n.sites.map((s) => s.site_name).join(", ") || "—"}</td>
                    <td style={{ fontSize: 12 }}>{n.created_by || "—"}</td>
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
