import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowUp, ArrowDown, UsersIcon } from "lucide-react";
import {
  fetchTenantsOverview,
  fetchTenantsDetails,
  fetchTenantTable,
  type TenantsOverview,
  type TenantsDetailsResponse,
  type TenantTableResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const C = {
  green: "#798C5E",
  red: "#E49191",
  blue: "#6B9BCC",
  orange: "#EDC488",
};



const TENANT_COLOR_PALETTE: { bg: string; text: string }[] = [
  { bg: "var(--color-info)", text: "#fff" },
  { bg: "var(--color-primary)", text: "#fff" },
  { bg: "var(--color-secondary-teal)", text: "var(--color-text)" },
  { bg: "var(--color-warning)", text: "var(--color-text)" },
  { bg: "var(--color-error)", text: "#fff" },
  { bg: "var(--color-growth-solid)", text: "#fff" },
  { bg: "rgba(107, 155, 204, 0.55)", text: "var(--color-text)" },
];

const MAX_ORG_MEMBER_CELLS = 8;

function groupIntoTreemapColumns<T>(items: T[]): T[][] {
  if (items.length === 0) return [];
  const [lead, ...rest] = items;
  const columns: T[][] = [[lead]];
  for (let i = 0; i < rest.length; i += 2) {
    columns.push(rest.slice(i, i + 2));
  }
  return columns;
}

interface Props {
  filters: PulseFilters;
}

export function PulseCustomers({ filters }: Props) {
  const [overview, setOverview] = useState<TenantsOverview | null>(null);
  const [tenantTable, setTenantTable] = useState<TenantTableResponse | null>(null);
  const [tenantsDetails, setTenantsDetails] = useState<TenantsDetailsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [entitySearch, setEntitySearch] = useState("");

  const pulseEvents = usePulseEvents();


  useEffect(() => {
    pulseEvents.onCustomerListViewed();
  }, [pulseEvents]);

  const orgMemberColumns = useMemo(() => {
    const tenants = tenantsDetails?.tenants ?? [];
    const top = [...tenants]
      .sort((a, b) => b.users_count - a.users_count)
      .slice(0, MAX_ORG_MEMBER_CELLS);
    const maxCount = top[0]?.users_count ?? 0;
    const sizeFloor = Math.max(1, maxCount * 0.15);
    const sorted = top.map((t, i) => ({
      name: t.name,
      value: t.users_count,
      weight: Math.max(t.users_count, sizeFloor),
      ...TENANT_COLOR_PALETTE[i % TENANT_COLOR_PALETTE.length],
    }));
    return groupIntoTreemapColumns(sorted);
  }, [tenantsDetails]);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchTenantTable(filters, page).then(setTenantTable).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [oR, tblR, tR] = await Promise.allSettled([
        fetchTenantsOverview(filters),
        fetchTenantTable(filters, p),
        fetchTenantsDetails(filters),
      ]);

      if (oR.status === "fulfilled") setOverview(oR.value);
      if (tblR.status === "fulfilled") setTenantTable(tblR.value);
      if (tR.status === "fulfilled") setTenantsDetails(tR.value);
      else console.error("[PulseCustomers] tenants_details failed:", tR.reason);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading customers…
      </div>
    );
  }

  const startIdx = tenantTable
    ? (tenantTable.pagination.current_page - 1) * tenantTable.pagination.per_page
    : 0;
  const hasData = !!(overview || tenantTable);

  const growth = overview?.monthly_growth;
  const growthChartData =
    growth?.points.map((p) => ({ month: p.label, count: p.count })) ?? [];
  const growthPercentage = growth ? Math.abs(growth.growth_percentage) : 0;
  const TrendIcon = growth?.trend === "down" ? ArrowDown : ArrowUp;

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <UsersIcon className="pd-empty-icon" />
          No user data available for the selected filters.
        </div>
      )}

      {overview && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Customer Entities", value: overview.kpis.total_customers },
            { label: "Active", value: overview.kpis.active_customers },
            { label: "Inactive", value: overview.kpis.inactive_customers },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pd-growth-row">
        <div className="pd-growth-card">
          <div className="pd-panel-title">
            Monthly Enrollment Growth
            {growth && (
              <span className="pd-growth-badge">
                <TrendIcon size={10} />
                {growthPercentage}%
              </span>
            )}
          </div>
          <div className="pd-growth-chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Customers"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="pd-growth-row">
        <div className="pd-growth-card">
          <div className="pd-panel-title">Organization-wise Members</div>
          <div className="pd-org-grid">
            {orgMemberColumns.length === 0 && (
              <div className="pd-empty" style={{ flex: 1, padding: "16px" }}>
                No organizations with members yet
              </div>
            )}
            {orgMemberColumns.map((column, ci) => {
              const columnTotal = column.reduce((sum, c) => sum + c.weight, 0);
              return (
                <div
                  key={ci}
                  className="pd-org-col"
                  style={{ flexGrow: columnTotal, flexBasis: 0 }}
                >
                  {column.map((cell) => (
                    <div
                      key={cell.name}
                      className="pd-org-cell"
                      style={{
                        background: cell.bg,
                        color: cell.text,
                        flexGrow: cell.weight,
                        flexBasis: 0,
                      }}
                    >
                      <span className="pd-org-cell-name">{cell.name}</span>
                      <span className="pd-org-cell-value">{cell.value}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="pd-growth-card">
          <div className="pd-panel-title">Top 3 Organizations By Engagement</div>
          <div className="pd-ranked-list" style={{ flex: 1, justifyContent: "center" }}>
            {(tenantsDetails?.top_tenants ?? []).map((o) => (
              <div key={o.id} className="pd-ranked-row">
                <div className={`pd-ranked-pos pd-ranked-pos-${o.rank}`}>{o.rank}</div>
                <div className="pd-ranked-name">{o.name}</div>
                <div>
                  <span className="pd-ranked-count">{o.users_count}</span>
                  <span className="pd-ranked-count-lbl">members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {tenantTable && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title pd-tbl-title--plain">Entity Management Directory</span>
            <input
              type="text"
              className="pd-tbl-search-input"
              placeholder="Search entities..."
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
            />
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tenantTable.tenants
                  .filter((t) =>
                    t.name.toLowerCase().includes(entitySearch.trim().toLowerCase())
                  )
                  .map((t) => (
                    <tr key={t.id}>
                      <td className="pd-num">{t.serial}</td>
                      <td style={{ fontWeight: 500 }}>{t.name}</td>
                      <td>
                        <span className="pd-chip">{t.type ?? "—"}</span>
                      </td>
                      <td>{t.site_name}</td>
                      <td>
                        <span
                          className={`pd-badge pd-badge--flat ${t.active ? "pd-badge-yes" : "pd-badge-no"}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {tenantTable.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–
                {Math.min(
                  startIdx + tenantTable.pagination.per_page,
                  tenantTable.pagination.total_count
                )}{" "}
                of {tenantTable.pagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button
                  className="pd-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                <button className={`pd-page-btn active`}>{page}</button>
                <button
                  className="pd-page-btn"
                  disabled={page >= tenantTable.pagination.total_pages}
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
