import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { dashboardApi, type RecentTicket } from "@/api/dashboard";
import { useAuthStore } from "@/stores/authStore";
import Spinner from "@/components/common/Spinner";

// ── Colours ────────────────────────────────────────────────────────────────
const PRIORITY_COLORS: Record<string, string> = {
  critical: "#A32D2D",
  high: "#DA7756",
  medium: "#BA7517",
  low: "#3B6D11",
};
const SOURCE_COLORS = [
  "#534AB7",
  "#DA7756",
  "#185FA5",
  "#085041",
  "#BA7517",
  "#888780",
];

// ── Helpers ────────────────────────────────────────────────────────────────
type Filters = Record<string, string>;

const TICKETS = "/tickets";
// Returns { to, state } — use as <Link to={x.to} state={x.state}> or navigate(x.to, { state: x.state })
const toTickets = (filters: Filters) => ({ to: TICKETS, state: { filters } });

// ── Sub-components ─────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
  icon?: string;
  filters?: Filters;
  muted?: boolean;
}

const StatCard = ({
  label,
  value,
  sub,
  accent = "var(--coral)",
  icon,
  filters,
  muted,
}: StatCardProps) => {
  const inner = (
    <div
      className={`card p-5 flex flex-col gap-1 h-full ${filters ? "cursor-pointer transition-transform hover:scale-[1.02]" : ""}`}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-label uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </p>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <p
        className="font-display text-h1 mt-1"
        style={{ color: muted ? "var(--text-muted)" : accent }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
  if (!filters) return inner;
  const nav = toTickets(filters);
  return (
    <Link to={nav.to} state={nav.state} className="block">
      {inner}
    </Link>
  );
};

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="card p-5 h-full">
    <p
      className="text-label uppercase mb-4"
      style={{ color: "var(--text-muted)" }}
    >
      {title}
    </p>
    {children}
  </div>
);

const SectionHeader = ({
  title,
  to,
  label = "View all →",
}: {
  title: string;
  to?: { to: string; state: object };
  label?: string;
}) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-h3" style={{ color: "var(--text)" }}>
      {title}
    </h2>
    {to && (
      <Link
        to={to.to}
        state={to.state}
        className="text-small font-medium"
        style={{ color: "var(--coral)" }}
      >
        {label}
      </Link>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="card px-3 py-2 text-xs shadow-lg"
      style={{ color: "var(--text)" }}
    >
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name ?? p.dataKey}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const SlaChip = ({ dueAt }: { dueAt: string | null }) => {
  if (!dueAt)
    return (
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        —
      </span>
    );
  const diffH = (new Date(dueAt).getTime() - Date.now()) / 3_600_000;
  const breached = diffH < 0;
  const atRisk = diffH >= 0 && diffH < 4;
  const color = breached
    ? "var(--crimson)"
    : atRisk
      ? "var(--amber)"
      : "var(--leaf)";
  const label = breached
    ? "Breached"
    : atRisk
      ? `${Math.round(diffH)}h left`
      : new Date(dueAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
  return (
    <span className="text-xs font-medium" style={{ color }}>
      {label}
    </span>
  );
};

// ── Ticket Table (shared) ──────────────────────────────────────────────────
const TicketTable = ({ tickets }: { tickets: RecentTicket[] }) => (
  <div className="card overflow-x-auto">
    <table className="w-full text-sm min-w-[700px]">
      <thead>
        <tr
          style={{
            borderBottom: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
          }}
        >
          {[
            "#",
            "Subject",
            "Customer",
            "Category",
            "Priority",
            "SLA",
            "Status",
          ].map((h) => (
            <th
              key={h}
              className="px-4 py-2.5 text-left text-label uppercase font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickets.map((t, i) => (
          <tr
            key={t.id}
            style={{
              borderBottom:
                i < tickets.length - 1 ? "1px solid var(--border)" : "none",
            }}
            className="transition-colors"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--stone-10)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
          >
            <td
              className="px-4 py-2.5 font-mono text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              #{t.number}
            </td>
            <td className="px-4 py-2.5 max-w-[200px]">
              <Link
                to={`/tickets/${t.id}`}
                className="block truncate font-medium"
                style={{ color: "var(--text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--coral)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
              >
                {t.subject}
              </Link>
            </td>
            <td
              className="px-4 py-2.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {t.customer.name}
            </td>
            <td
              className="px-4 py-2.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {t.category?.name ?? "—"}
            </td>
            <td className="px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      PRIORITY_COLORS[t.priority] ?? "var(--stone)",
                  }}
                />
                <span
                  className="text-xs capitalize"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.priority}
                </span>
              </div>
            </td>
            <td className="px-4 py-2.5">
              <SlaChip dueAt={t.sla_resolve_due_at} />
            </td>
            <td className="px-4 py-2.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: (t.status.color ?? "#888") + "22",
                  color: t.status.color ?? "var(--text-muted)",
                }}
              >
                {t.status.name}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {tickets.length === 0 && (
      <p
        className="py-8 text-center text-small"
        style={{ color: "var(--text-muted)" }}
      >
        No tickets.
      </p>
    )}
  </div>
);

// ── Priority Donut (shared, clickable segments) ────────────────────────────
const PriorityDonut = ({
  data,
  baseFilters = {},
}: {
  data: { critical: number; high: number; medium: number; low: number };
  baseFilters?: Filters;
}) => {
  const navigate = useNavigate();
  const chartData = [
    { name: "Critical", value: data.critical, key: "critical" },
    { name: "High", value: data.high, key: "high" },
    { name: "Medium", value: data.medium, key: "medium" },
    { name: "Low", value: data.low, key: "low" },
  ].filter((d) => d.value > 0);

  if (!chartData.length) {
    return (
      <p
        className="text-center text-xs py-10"
        style={{ color: "var(--text-muted)" }}
      >
        No open tickets
      </p>
    );
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            paddingAngle={3}
            cursor="pointer"
            onClick={(d) => {
              const n = toTickets({
                ...baseFilters,
                priority: d.key as string,
              });
              navigate(n.to, { state: n.state });
            }}
          >
            {chartData.map((d) => (
              <Cell key={d.key} fill={PRIORITY_COLORS[d.key as string]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {chartData.map((d) => (
          <Link
            key={d.name}
            to={TICKETS}
            state={toTickets({ ...baseFilters, priority: d.key }).state}
            className="flex items-center gap-1.5 hover:opacity-75"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: PRIORITY_COLORS[d.key] }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {d.name} ({d.value})
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

// ── Category Bar (shared, clickable) ──────────────────────────────────────
const CategoryBar = ({
  data,
  baseFilters = {},
  allCategories,
}: {
  data: { name: string; count: number }[];
  baseFilters?: Filters;
  allCategories?: { id: string; name: string }[];
}) => {
  const navigate = useNavigate();
  if (!data.length)
    return (
      <p
        className="text-center text-xs py-10"
        style={{ color: "var(--text-muted)" }}
      >
        No category data
      </p>
    );

  const handleClick = (entry: { name?: string }) => {
    if (!allCategories) return;
    const cat = allCategories.find((c) => c.name === entry.name!);
    if (cat) {
      const n = toTickets({ ...baseFilters, category_id: cat.id });
      navigate(n.to, { state: n.state });
    }
  };

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 30)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          name="Tickets"
          fill="#534AB7"
          radius={[0, 4, 4, 0]}
          maxBarSize={20}
          cursor="pointer"
          onClick={handleClick}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── Status Grid (clickable) ────────────────────────────────────────────────
const StatusGrid = ({
  statuses,
  baseFilters = {},
}: {
  statuses: {
    name: string;
    color?: string | null;
    state_type: string;
    count: number;
  }[];
  baseFilters?: Filters;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {statuses.slice(0, 6).map((s) => (
      <Link
        key={s.name}
        to={TICKETS}
        state={toTickets({ ...baseFilters, status_id: s.name }).state}
        className="card p-4 text-center hover:opacity-80 transition-opacity"
      >
        <div
          className="w-3 h-3 rounded-full mx-auto mb-2"
          style={{ backgroundColor: s.color ?? "var(--stone)" }}
        />
        <p className="font-semibold text-base" style={{ color: "var(--text)" }}>
          {s.count}
        </p>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "var(--text-muted)" }}
        >
          {s.name}
        </p>
      </Link>
    ))}
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const navigate = useNavigate();

  const {
    data: dash,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  if (isError || !dash)
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-small" style={{ color: "var(--text-muted)" }}>
          Failed to load dashboard.
        </p>
      </div>
    );

  const meId = dash.current_user_id;
  const myFilters: Filters = { assigned_agent_id: meId };

  const sourceData = Object.entries(dash.by_source)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      key: name,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="font-display text-h1" style={{ color: "var(--text)" }}>
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-small" style={{ color: "var(--text-muted)" }}>
          Here's what needs your attention today.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          SECTION: Overall Stats
      ══════════════════════════════════════════ */}
      <section>
        <SectionHeader title="Overview" />

        {/* Primary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard
            label="Open Tickets"
            value={dash.open_count}
            icon="🎫"
            filters={{}}
          />
          <StatCard
            label="Assigned to Me"
            value={dash.assigned_to_me}
            icon="👤"
            accent="var(--violet)"
            filters={myFilters}
          />
          <StatCard
            label="SLA Breached"
            value={dash.sla_breached}
            icon="⚠️"
            accent="var(--crimson)"
            sub={
              dash.sla_at_risk > 0 ? `${dash.sla_at_risk} at risk` : undefined
            }
            filters={{ sla_breached: "true" }}
          />
          <StatCard
            label="Escalated"
            value={dash.escalated}
            icon="🔺"
            accent="var(--amber)"
            filters={{ escalated: "true" }}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Unassigned"
            value={dash.unassigned}
            icon="📥"
            accent="var(--sky)"
            filters={{ unassigned: "true" }}
          />
          <StatCard
            label="Critical"
            value={dash.by_priority.critical}
            icon="🚨"
            accent="var(--crimson)"
            filters={{ priority: "critical" }}
          />
          <StatCard
            label="Created Today"
            value={dash.created_today}
            icon="➕"
            accent="var(--forest)"
            muted={dash.created_today === 0}
            filters={{}}
          />
          <StatCard
            label="Resolved Today"
            value={dash.resolved_today}
            icon="✅"
            accent="var(--leaf)"
            muted={dash.resolved_today === 0}
            filters={{}}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Trend + Priority
      ══════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="Trends &amp; Breakdown"
          to={toTickets({})}
          label="All tickets →"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 7-day trend — 2 cols */}
          <div className="md:col-span-2">
            <ChartCard title="Tickets Created — Last 7 Days">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={dash.tickets_trend}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#DA7756"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#DA7756" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Tickets"
                    stroke="#DA7756"
                    strokeWidth={2}
                    fill="url(#trendGrad)"
                    dot={{ r: 3, fill: "#DA7756", strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Priority donut */}
          <ChartCard title="Open by Priority">
            <PriorityDonut data={dash.by_priority} />
          </ChartCard>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Category + Source
      ══════════════════════════════════════════ */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category bar — 2 cols */}
          <div className="md:col-span-2">
            <ChartCard title="Open Tickets by Category">
              <CategoryBar data={dash.by_category} />
            </ChartCard>
          </div>

          {/* Source channel donut */}
          <ChartCard title="Tickets by Channel">
            {sourceData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={3}
                      cursor="pointer"
                      onClick={(d) => {
                        const n = toTickets({
                          source_channel: d.key as string,
                        });
                        navigate(n.to, { state: n.state });
                      }}
                    >
                      {sourceData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={SOURCE_COLORS[i % SOURCE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {sourceData.map((d, i) => (
                    <Link
                      key={d.name}
                      to={TICKETS}
                      state={toTickets({ source_channel: d.key }).state}
                      className="flex items-center gap-1.5 hover:opacity-75"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            SOURCE_COLORS[i % SOURCE_COLORS.length],
                        }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {d.name} ({d.value})
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p
                className="text-center text-xs py-10"
                style={{ color: "var(--text-muted)" }}
              >
                No data
              </p>
            )}
          </ChartCard>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION: Status Breakdown
      ══════════════════════════════════════════ */}
      {dash.by_status.length > 0 && (
        <section>
          <SectionHeader title="By Status" />
          <StatusGrid statuses={dash.by_status} />
        </section>
      )}

      {/* ══════════════════════════════════════════
          SECTION: Inbox
      ══════════════════════════════════════════ */}
      {isAdmin && dash.inbox_email_stats ? (
        <section>
          <SectionHeader title="Inbox — Agent Breakdown" />
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--bg)",
                  }}
                >
                  {[
                    "Agent",
                    "Pending",
                    "Ticket Created",
                    "No Action",
                    "Junk",
                    "Total",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-label uppercase font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dash.inbox_email_stats.by_user.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-small"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No inbox data available.
                    </td>
                  </tr>
                )}
                {dash.inbox_email_stats.by_user.map((row, i) => {
                  const total =
                    row.pending + row.ticket_created + row.no_action + row.junk;
                  return (
                    <tr
                      key={row.user}
                      className="cursor-pointer"
                      style={{
                        borderBottom:
                          i < dash.inbox_email_stats!.by_user.length - 1
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--stone-10)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "")
                      }
                      onClick={() =>
                        navigate(`/inbox/${row.user_id}`, {
                          state: { agentName: row.user },
                        })
                      }
                    >
                      <td
                        className="px-4 py-2.5 font-medium"
                        style={{ color: "var(--coral)" }}
                      >
                        {row.user}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--amber)22",
                            color: "var(--amber)",
                          }}
                        >
                          {row.pending}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--forest)22",
                            color: "var(--forest)",
                          }}
                        >
                          {row.ticket_created}
                        </span>
                      </td>
                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {row.no_action}
                      </td>
                      <td
                        className="px-4 py-2.5 text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {row.junk}
                      </td>
                      <td
                        className="px-4 py-2.5 font-medium text-xs"
                        style={{ color: "var(--text)" }}
                      >
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {dash.inbox_email_stats.by_user.length > 0 && (
                <tfoot>
                  <tr
                    style={{
                      borderTop: "2px solid var(--border)",
                      backgroundColor: "var(--bg)",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 font-semibold text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Total
                    </td>
                    {(
                      [
                        "pending",
                        "ticket_created",
                        "no_action",
                        "junk",
                      ] as const
                    ).map((key) => (
                      <td
                        key={key}
                        className="px-4 py-2.5 font-semibold text-xs"
                        style={{ color: "var(--text)" }}
                      >
                        {dash.inbox_email_stats!.by_user.reduce(
                          (s, r) => s + r[key],
                          0
                        )}
                      </td>
                    ))}
                    <td
                      className="px-4 py-2.5 font-semibold text-xs"
                      style={{ color: "var(--text)" }}
                    >
                      {dash.inbox_email_stats.by_user.reduce(
                        (s, r) =>
                          s +
                          r.pending +
                          r.ticket_created +
                          r.no_action +
                          r.junk,
                        0
                      )}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </section>
      ) : !isAdmin ? (
        <section>
          <SectionHeader
            title="My Inbox"
            to={toTickets(myFilters)}
            label="View my tickets →"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatCard
              label="My Open"
              value={dash.my_inbox.open}
              icon="📋"
              accent="var(--violet)"
              filters={myFilters}
            />
            <StatCard
              label="SLA Breached"
              value={dash.my_inbox.sla_breached}
              icon="⚠️"
              accent="var(--crimson)"
              sub={
                dash.my_inbox.sla_at_risk > 0
                  ? `${dash.my_inbox.sla_at_risk} at risk`
                  : undefined
              }
              filters={{ ...myFilters, sla_breached: "true" }}
            />
            <StatCard
              label="Escalated"
              value={dash.my_inbox.escalated}
              icon="🔺"
              accent="var(--amber)"
              filters={{ ...myFilters, escalated: "true" }}
            />
            <StatCard
              label="Critical"
              value={dash.my_inbox.by_priority.critical}
              icon="🚨"
              accent="var(--crimson)"
              filters={{ ...myFilters, priority: "critical" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ChartCard title="My Tickets by Priority">
              <PriorityDonut
                data={dash.my_inbox.by_priority}
                baseFilters={myFilters}
              />
            </ChartCard>

            <ChartCard title="My Tickets by Status">
              {dash.my_inbox.by_status.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={dash.my_inbox.by_status}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="count"
                        nameKey="name"
                        paddingAngle={3}
                        cursor="pointer"
                        onClick={(d) => {
                          const n = toTickets({
                            ...myFilters,
                            status_id: d.name as string,
                          });
                          navigate(n.to, { state: n.state });
                        }}
                      >
                        {dash.my_inbox.by_status.map((s, i) => (
                          <Cell
                            key={s.name}
                            fill={
                              s.color ?? SOURCE_COLORS[i % SOURCE_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<CustomTooltip />}
                        formatter={(v, n) => [v, n]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {dash.my_inbox.by_status.map((s, i) => (
                      <Link
                        key={s.name}
                        to={TICKETS}
                        state={
                          toTickets({ ...myFilters, status_id: s.name }).state
                        }
                        className="flex items-center gap-1.5 hover:opacity-75"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              s.color ??
                              SOURCE_COLORS[i % SOURCE_COLORS.length],
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {s.name} ({s.count})
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <p
                  className="text-center text-xs py-10"
                  style={{ color: "var(--text-muted)" }}
                >
                  No tickets assigned
                </p>
              )}
            </ChartCard>

            <ChartCard title="My Tickets by Category">
              <CategoryBar
                data={dash.my_inbox.by_category}
                baseFilters={myFilters}
              />
            </ChartCard>
          </div>

          {dash.my_inbox.recent.length > 0 && (
            <TicketTable tickets={dash.my_inbox.recent} />
          )}
          {dash.my_inbox.recent.length === 0 && (
            <div className="card py-10 text-center">
              <p className="text-small" style={{ color: "var(--text-muted)" }}>
                No tickets assigned to you.
              </p>
            </div>
          )}
        </section>
      ) : null}

      {/* ══════════════════════════════════════════
          SECTION: Recent Tickets (all)
      ══════════════════════════════════════════ */}
      <section>
        <SectionHeader
          title="Recent Tickets"
          to={toTickets({})}
          label="View all →"
        />
        <TicketTable tickets={dash.recent_tickets} />
      </section>
    </div>
  );
};

export default DashboardPage;
