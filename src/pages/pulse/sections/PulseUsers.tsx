import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Users as UsersIcon, ArrowUp, ArrowDown } from "lucide-react";
import {
  fetchUsersOverview,
  fetchUsersDetails,
  type UsersOverview,
  type UsersDetailsResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const C = {
  green: "#798C5E",
  blue: "#6B9BCC",
  orange: "#EDC488",
  purple: "#CECBF6",
  teal: "#9EC8BA",
  pink: "#E7848E",
};

const USER_TYPE_COLOR_PALETTE = [C.orange, C.blue, C.pink, C.purple, C.teal, C.green];

const GENDER_DOLL_WIDTH = 68.8889;
const GENDER_DOLL_HEIGHT = 155;
const GENDER_DOLL_PATH =
  "M32.6829 0.078125C24.6181 1.11273 17.3053 10.4562 17.3053 22.5548C17.3053 29.222 19.6423 35.1187 23.0676 39.1954L27.1542 44.0576L20.8666 45.2248C16.4141 46.0514 13.1497 48.3746 10.3591 52.1572C7.56855 55.94 5.43516 61.2106 3.93996 67.2842C1.23293 78.2882 0.637541 91.7238 0.542969 103.567H15.339L19.4018 157.372C29.7198 159.673 40.736 159.592 50.6733 157.381L54.2677 103.568H68.3555C68.3462 91.5789 68.1908 77.9579 65.7378 66.8707C64.3855 60.7572 62.3353 55.4945 59.5113 51.7546C56.6862 48.015 53.2709 45.7054 48.2721 44.9405L41.855 43.9587L45.9057 38.9462C49.1829 34.8907 51.4047 29.0614 51.4047 22.5555C51.4047 9.65684 43.2401 0.109828 34.3545 0.109828L32.6829 0.078125Z";

function humanizeUserType(type: string | null) {
  if (!type) return "Unspecified";
  return type
    .split("_")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

interface Props {
  filters: PulseFilters;
}

export function PulseUsers({ filters }: Props) {
  const [usersOverview, setUsersOverview] = useState<UsersOverview | null>(null);
  const [users, setUsers] = useState<UsersDetailsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchUsersDetails(filters, page).then(setUsers).catch(console.error);
  }, [page]);



  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [oR, uR] = await Promise.allSettled([
        fetchUsersOverview(filters),
        fetchUsersDetails(filters, p),
      ]);
      if (oR.status === "fulfilled") setUsersOverview(oR.value);
      else console.error("[PulseUsers] users_overview failed:", oR.reason);
      if (uR.status === "fulfilled") setUsers(uR.value);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading users…
      </div>
    );
  }

  const startIdx = users
    ? (users.pagination.current_page - 1) * users.pagination.per_page
    : 0;
  const hasData = !!(usersOverview || users);

  const kpis = usersOverview?.kpis;
  const totalUsersTrendUp = kpis?.total_users_trend !== "down";
  const TotalUsersTrendIcon = totalUsersTrendUp ? ArrowUp : ArrowDown;

  const growthData =
    usersOverview?.growth_trend.points.map((p) => ({
      month: p.label,
      users: p.users,
      admins: p.admins,
      occupants: p.occupants,
    })) ?? [];
  const growthSeries = [
    { key: "users" as const, name: "Users", color: "var(--color-primary)" },
    { key: "admins" as const, name: "Admins", color: C.purple },
    { key: "occupants" as const, name: "Occupants", color: C.teal },
  ];

  const userTypeSegments = (usersOverview?.user_type_breakdown ?? []).map((b, i) => ({
    name: humanizeUserType(b.user_type),
    value: b.count,
    color: USER_TYPE_COLOR_PALETTE[i % USER_TYPE_COLOR_PALETTE.length],
  }));

  const maleWeight = usersOverview?.gender_distribution.males || 1;
  const femaleWeight = usersOverview?.gender_distribution.females || 1;
  const maleBandHeight = (GENDER_DOLL_HEIGHT * maleWeight) / (maleWeight + femaleWeight);
  const femaleBandHeight = GENDER_DOLL_HEIGHT - maleBandHeight;

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <UsersIcon className="pd-empty-icon" />
          No user data available for the selected filters.
        </div>
      )}

      {kpis && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Users", value: kpis.total_users },
            { label: "Admins", value: kpis.admin_users },
            { label: "Occupants", value: kpis.occupant_users },
            { label: "Occupant Admins", value: kpis.occupant_admin_users },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {kpis && (
        <div className="pd-mini-charts-row">
          <div className="pd-chart-card pd-mini-chart-card pd-mini-chart-card--growth">
            <div className="pd-panel-title">
              User Growth Trend
              {kpis.total_users_trend !== "flat" && (
                <span className="pd-growth-badge">
                  <TotalUsersTrendIcon size={10} />
                  {Math.abs(kpis.total_users_growth_percentage)}%
                </span>
              )}
            </div>
            <div className="pd-mini-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend align="left" wrapperStyle={{ fontSize: 10 }} />
                  {growthSeries.map((s) => (
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



          <div className="pd-chart-card pd-mini-chart-card pd-mini-chart-card--breakdown">
            <div className="pd-panel-title">User Type Breakdown</div>
            <div className="pd-mini-chart-inner pd-donut-wrap">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={userTypeSegments}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={34}
                    outerRadius={58}
                    startAngle={0}
                    endAngle={360}
                    paddingAngle={2}
                  >
                    {userTypeSegments.map((seg) => (
                      <Cell
                        key={seg.name}
                        fill={seg.color}
                        stroke="var(--color-card-white)"
                        strokeWidth={0.77}
                        opacity={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 10, lineHeight: "14px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pd-chart-card pd-mini-chart-card pd-mini-chart-card--gender">
            <div className="pd-panel-title">Gender Distribution</div>
            <div className="pd-gender-body">
              <div className="pd-gender-figure">
                <svg
                  className="pd-gender-doll"
                  viewBox={`0 0 ${GENDER_DOLL_WIDTH} ${GENDER_DOLL_HEIGHT}`}
                >
                  <clipPath id="pd-gender-doll-clip-female">
                    <rect
                      x="0"
                      y={maleBandHeight}
                      width={GENDER_DOLL_WIDTH}
                      height={femaleBandHeight}
                    />
                  </clipPath>
                  <clipPath id="pd-gender-doll-clip-male">
                    <rect x="0" y="0" width={GENDER_DOLL_WIDTH} height={maleBandHeight} />
                  </clipPath>
                  <g clipPath="url(#pd-gender-doll-clip-female)">
                    <path
                      d={GENDER_DOLL_PATH}
                      fill="color-mix(in srgb, var(--color-error) 55%, black)"
                    />
                  </g>
                  <g clipPath="url(#pd-gender-doll-clip-male)">
                    <path d={GENDER_DOLL_PATH} fill="var(--color-error)" />
                  </g>
                </svg>
              </div>
              <div className="pd-gender-legend">
                {(usersOverview?.gender_distribution.breakdown ?? [])
                  .filter((g) => g.gender.toLowerCase() === "male" || g.gender.toLowerCase() === "female")
                  .map((g) => (
                    <div key={g.gender} className="pd-gender-legend-item">
                      <span className={`pd-gender-legend-dot pd-gender-legend-dot-${g.gender}`} />
                      {g.label} ({g.count})
                    </div>
                  ))}
              </div>
            </div>
          </div>


        </div>
      )}

      {users && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">User Details</span>
            <div className="pd-sub-tabs" />
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Site</th>
                </tr>
              </thead>
              <tbody>
                {users.users.map((u) => (
                  <tr key={u.id}>
                    <td className="pd-num">{u.serial}</td>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "var(--color-text-light)", fontSize: 12 }}>
                      {u.email || "—"}
                    </td>
                    <td>
                      <span className="pd-badge pd-badge-pub">
                        {humanizeUserType(u.user_type)}
                      </span>
                    </td>
                    <td>{u.site_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–
                {Math.min(
                  startIdx + users.pagination.per_page,
                  users.pagination.total_count
                )}{" "}
                of {users.pagination.total_count}
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
                  disabled={page >= users.pagination.total_pages}
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
