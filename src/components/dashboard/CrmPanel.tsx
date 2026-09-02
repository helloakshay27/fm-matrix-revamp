import { useEffect, useRef, useState, useMemo } from "react";
import {
  HeroGradientStripCard,
  StatHeroCard,
  BarChartCard,
  AreaTrendChartCard,
  ProgressListCard,
  DataTableCard,
  TableBadge,
  TaskListCard,
  UpcomingListCard,
  StatListCard,
  type DataTableColumn,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";
import { CrmCalendarCard } from "@/components/dashboard/CrmCalendarCard";
import { cn } from "@/lib/utils";
import type { CrmDashboardData } from "@/hooks/useFmDashboardData";

interface OpenDealRow {
  account: string;
  value: string;
  stage: string;
  close: string;
  days: number;
}

const OPEN_DEAL_COLUMNS: DataTableColumn<OpenDealRow>[] = [
  { key: "account", header: "Account", render: (row) => <span className="font-semibold text-brand-text">{row.account}</span> },
  { key: "value", header: "Value", render: (row) => row.value },
  {
    key: "stage",
    header: "Stage",
    render: (row) => (
      <TableBadge tone={row.stage === "Negotiation" ? "terra" : row.stage === "Demo Scheduled" ? "blue" : "amber"}>
        {row.stage}
      </TableBadge>
    ),
  },
  { key: "close", header: "Close", render: (row) => row.close },
  { key: "days", header: "Days", render: (row) => row.days },
];

type CrmValue = Record<string, unknown> | Record<string, unknown>[] | null | undefined;

function crmNumber(value: CrmValue, keys: string[]): number | null {
  if (!value || Array.isArray(value)) return null;
  for (const key of keys) {
    const v = (value as Record<string, unknown>)[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return null;
}

function crmString(value: CrmValue, keys: string[]): string | null {
  if (!value || Array.isArray(value)) return null;
  for (const key of keys) {
    const v = (value as Record<string, unknown>)[key];
    if (typeof v === "string" && v.trim() !== "") return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function crmArray(value: CrmValue, candidateKeys: string[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  if (value && typeof value === "object") {
    for (const key of [...candidateKeys, "items", "data", "records", "list", "deals", "events", "transactions", "rows", "stages"]) {
      const nested = (value as Record<string, unknown>)[key];
      if (Array.isArray(nested)) return nested as Record<string, unknown>[];
    }
  }
  return [];
}

function formatCrmLakhs(value: number | null): string | null {
  if (value == null) return null;
  return value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${value.toFixed(1)}L`;
}

function EmptyStateCard({
  title,
  subtitle,
  message,
  className,
}: {
  title: string;
  subtitle?: string;
  message: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-brand-border h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <p className="text-brand-body-5 text-brand-text-light text-center py-4">{message}</p>
      </CardContent>
    </Card>
  );
}

interface CrmPanelProps {
  activeSection: string;
  data?: CrmDashboardData | null;
  loading?: boolean;
  /** When set, renders only the cards the user has saved to My Dashboard, across all sections. */
  visibleKeys?: Set<string>;
}

export function CrmPanel({ activeSection, data, loading = false, visibleKeys }: CrmPanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [trendMode, setTrendMode] = useState<"line" | "bar">("line");
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  const leaseOverviewValue = data?.leaseOverview ?? null;
  const walletOverviewValue = data?.walletOverview ?? null;
  const walletDistributionValue = data?.walletDistribution ?? null;
  const eventsOverviewValue = data?.eventsOverview ?? null;
  const broadcastOverviewValue = data?.broadcastOverview ?? null;
  const walletTransactionsValue = data?.walletTransactions ?? null;

  const loadingLabel = loading ? "Loading…" : "—";

  // --- Live metric extractions from CRM API ---
  const liveRevenue = crmNumber(leaseOverviewValue, ["total_value", "value", "revenue", "rent_collected", "lease_value"]);
  const liveDealsWon = crmNumber(leaseOverviewValue, ["deals_won", "won_count", "total_deals_won", "won"]);
  const liveDealsLost = crmNumber(leaseOverviewValue, ["deals_lost", "lost_count", "total_deals_lost", "lost"]);
  const liveWonValue = crmNumber(leaseOverviewValue, ["won_value", "deals_won_value", "won_amount"]);
  const liveLostValue = crmNumber(leaseOverviewValue, ["lost_value", "deals_lost_value", "lost_amount"]);
  const livePipeline = crmNumber(leaseOverviewValue, ["pipeline_value", "pipeline", "total_pipeline", "active_pipeline"]) ??
    crmNumber(walletOverviewValue, ["balance", "wallet_balance", "total_balance", "amount"]);
  const liveAvgDeal = crmNumber(leaseOverviewValue, ["avg_deal_value", "avg_deal", "average_deal"]);
  const liveWinRate = crmNumber(leaseOverviewValue, ["win_rate", "conversion_rate"]) ??
    crmNumber(walletOverviewValue, ["win_rate", "conversion_rate", "rate"]);

  const liveTransactions = crmNumber(walletOverviewValue, ["total_transactions", "transaction_count", "count"]) ??
    crmArray(walletTransactionsValue).length;
  const liveEventsCount = crmNumber(eventsOverviewValue, ["total_events", "count", "events_count"]) ??
    crmArray(eventsOverviewValue).length;
  const liveWalletShare = crmString(walletDistributionValue, ["top_category", "primary_category", "category"]);

  // Revenue trend extraction
  const liveRevenueTrend = useMemo(() => {
    const rawTrend = crmArray(leaseOverviewValue, ["monthly_trend", "revenue_trend", "trend", "trends", "monthly_data"]);
    return rawTrend
      .map((r) => ({
        month: String(r["month"] || r["name"] || r["label"] || r["period"] || ""),
        revenue: typeof r["revenue"] === "number" ? r["revenue"] : Number(r["revenue"] || r["value"] || r["amount"] || 0),
      }))
      .filter((r) => r.month !== "");
  }, [leaseOverviewValue]);

  // Lead performance extraction
  const leadPerformanceRows = useMemo(() => {
    const raw = crmArray(leaseOverviewValue, ["lead_performance", "leads", "funnel"]);
    return raw.map((r, idx) => ({
      label: String(r["label"] || r["name"] || r["stage"] || `Stage ${idx + 1}`),
      value: String(r["value"] || r["count"] || 0),
      percent: typeof r["percent"] === "number" ? r["percent"] : Number(r["percent"] || 0),
      color: String(r["color"] || ["#6B9BCC", "#108C72", "#DA7756", "#CECBF6"][idx % 4]),
    }));
  }, [leaseOverviewValue]);

  // Open deals extraction
  const openDealsRows = useMemo<OpenDealRow[]>(() => {
    const rawDeals = crmArray(leaseOverviewValue, ["deals", "open_deals", "top_deals", "top_open_deals"]);
    return rawDeals.map((r, idx) => ({
      account: String(r["account"] || r["name"] || r["tenant"] || r["client"] || `Account ${idx + 1}`),
      value: typeof r["value"] === "number" ? formatCrmLakhs(r["value"]) ?? `₹${r["value"]}` : String(r["value"] || r["amount"] || "—"),
      stage: String(r["stage"] || r["status"] || "Active"),
      close: String(r["close"] || r["close_date"] || r["expected_close"] || "—"),
      days: typeof r["days"] === "number" ? r["days"] : Number(r["days"] || r["age_days"] || 0),
    }));
  }, [leaseOverviewValue]);

  // Module adoption extraction
  const adoptionData = useMemo(() => {
    const raw = crmArray(walletDistributionValue, ["modules", "adoption", "distribution"]);
    if (raw.length > 0) {
      return raw.map((r, idx) => ({
        module: String(r["module"] || r["name"] || r["category"] || `Module ${idx + 1}`),
        pct: Number(r["pct"] || r["percent"] || r["percentage"] || r["value"] || 0),
      }));
    }
    const derived: { module: string; pct: number }[] = [];
    if (liveTransactions != null && liveTransactions > 0) derived.push({ module: "Wallet", pct: Math.min(100, liveTransactions) });
    if (liveEventsCount != null && liveEventsCount > 0) derived.push({ module: "Events", pct: Math.min(100, liveEventsCount * 10) });
    const broadcastCount = crmNumber(broadcastOverviewValue, ["total_broadcasts", "count", "broadcast_count"]);
    if (broadcastCount != null && broadcastCount > 0) derived.push({ module: "Broadcast", pct: Math.min(100, broadcastCount * 10) });
    return derived;
  }, [walletDistributionValue, liveTransactions, liveEventsCount, broadcastOverviewValue]);

  // Pipeline by stage extraction
  const pipelineStageRows = useMemo(() => {
    const raw = crmArray(leaseOverviewValue, ["stages", "pipeline_stages", "by_stage", "pipeline_by_stage"]);
    const colors = ["#CECBF6", "#9EC8BA", "#6B9BCC", "#EDC488", "#DA7756"];
    return raw.map((r, idx) => ({
      label: String(r["stage"] || r["name"] || r["label"] || `Stage ${idx + 1}`),
      value: String(r["count"] || r["value"] || 0),
      percent: Number(r["percent"] || r["percentage"] || 0),
      color: String(r["color"] || colors[idx % colors.length]),
    }));
  }, [leaseOverviewValue]);

  // Upcoming events / items extraction
  const upcomingItems = useMemo(() => {
    const raw = crmArray(eventsOverviewValue, ["upcoming", "upcoming_events", "events", "items"]);
    return raw.map((r) => ({
      day: String(r["day"] || r["date"] || "").slice(0, 2),
      month: String(r["month"] || "Event"),
      title: String(r["title"] || r["name"] || r["event_name"] || "Scheduled Event"),
      time: String(r["time"] || r["event_time"] || "—"),
    }));
  }, [eventsOverviewValue]);

  // Pending tasks extraction
  const pendingTaskRows = useMemo(() => {
    const raw = crmArray(leaseOverviewValue, ["tasks", "pending_tasks", "my_tasks"]);
    return raw.map((r) => ({
      label: String(r["title"] || r["label"] || r["name"] || "Task"),
      subtitle: String(r["subtitle"] || r["account"] || r["description"] || ""),
      due: String(r["due"] || r["due_date"] || "Pending"),
      overdue: Boolean(r["overdue"] || r["is_overdue"]),
    }));
  }, [leaseOverviewValue]);

  // Dynamic calendar setup
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      inMonth: true,
      isToday: i + 1 === today.getDate(),
    }));
  }, [daysInMonth, today]);

  // Activity counts
  const callsCount = crmNumber(eventsOverviewValue, ["calls", "calls_count", "total_calls"]);
  const meetingsCount = crmNumber(eventsOverviewValue, ["meetings", "meetings_count", "total_meetings"]);
  const tasksCount = crmNumber(leaseOverviewValue, ["tasks_done", "completed_tasks", "tasks_count"]);
  const emailsCount = crmNumber(broadcastOverviewValue, ["emails_sent", "sent_emails", "broadcasts_sent"]);
  const notesCount = crmNumber(leaseOverviewValue, ["notes_count", "notes_added", "total_notes"]);

  // --- Overview ---
  const overviewItems: SafetyGridItem[] = [
    {
      key: "crm-hero",
      layout: { x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3, isResizable: false, isDraggable: false },
      content: (
        <HeroGradientStripCard
          className="h-full"
          items={[
            {
              label: "My Revenue",
              value: liveRevenue != null ? formatCrmLakhs(liveRevenue) ?? `₹${liveRevenue}` : loadingLabel,
              subtitle: liveRevenue != null ? "Live lease value" : "Total revenue",
            },
            {
              label: "Deals Won",
              value: liveDealsWon != null ? String(liveDealsWon) : loadingLabel,
              subtitle: liveAvgDeal != null ? `Avg deal ${formatCrmLakhs(liveAvgDeal)}` : "Closed deals",
            },
            {
              label: "My Pipeline",
              value: livePipeline != null ? formatCrmLakhs(livePipeline) ?? `₹${livePipeline}` : loadingLabel,
              subtitle: "Active pipeline value",
            },
            {
              label: "Win Rate",
              value: liveWinRate != null ? `${liveWinRate}%` : loadingLabel,
              subtitle: liveWinRate != null ? (Number(liveWinRate) >= 55 ? "On target" : "Below 55% target") : "Conversion rate",
            },
            {
              label: "Events",
              value: liveEventsCount != null ? String(liveEventsCount) : loadingLabel,
              subtitle: "This period",
            },
            {
              label: "Transactions",
              value: liveTransactions != null ? String(liveTransactions) : loadingLabel,
              subtitle: liveWalletShare ? `Top: ${liveWalletShare}` : "This period",
            },
          ]}
        />
      ),
    },
    {
      key: "crm-revenue-performance-label",
      layout: { x: 0, y: 3, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1">
          Revenue &amp; Performance
        </div>
      ),
    },
    {
      key: "crm-revenue-trend",
      layout: { x: 0, y: 4, w: 6, h: 8, minW: 4, minH: 6 },
      content: (
        <div className="h-full relative">
          <div className="absolute top-4 right-4 z-20 flex gap-1 no-drag">
            <button
              type="button"
              onClick={() => setTrendMode("line")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${trendMode === "line" ? "bg-brand text-white" : "bg-brand-bg text-brand-text-light"}`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setTrendMode("bar")}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${trendMode === "bar" ? "bg-brand text-white" : "bg-brand-bg text-brand-text-light"}`}
            >
              Bar
            </button>
          </div>
          {liveRevenueTrend.length > 0 ? (
            trendMode === "line" ? (
              <AreaTrendChartCard
                title="My Revenue Trend"
                subtitle="Closed-won revenue by month"
                data={liveRevenueTrend}
                categoryKey="month"
                valueKey="revenue"
                unit="L"
                color="#108C72"
                height={160}
                className="h-full"
              />
            ) : (
              <BarChartCard
                title="My Revenue Trend"
                subtitle="Closed-won revenue by month"
                data={liveRevenueTrend}
                categoryKey="month"
                series={[{ dataKey: "revenue", name: "Revenue (₹L)" }]}
                categoryColors={["#108C72"]}
                className="h-full"
              />
            )
          ) : (
            <EmptyStateCard
              title="My Revenue Trend"
              subtitle="Closed-won revenue by month"
              message={loading ? "Loading…" : "No revenue trend data available for this period."}
              className="h-full"
            />
          )}
          <div className="grid grid-cols-3 gap-3 px-4 pb-4 mt-4">
            {[
              { label: "Revenue", value: liveRevenue != null ? formatCrmLakhs(liveRevenue) ?? `₹${liveRevenue}` : "—", color: "#108C72" },
              { label: "Pipeline", value: livePipeline != null ? formatCrmLakhs(livePipeline) ?? `₹${livePipeline}` : "—", color: "#6B9BCC" },
              { label: "Avg Deal", value: liveAvgDeal != null ? formatCrmLakhs(liveAvgDeal) ?? `₹${liveAvgDeal}` : "—", color: "#2C2C2C" },
            ].map((box) => (
              <div key={box.label} className="rounded-lg bg-brand-bg border border-brand-border text-center py-2.5">
                <div className="text-brand-body-5 text-brand-text-light">{box.label}</div>
                <div className="text-base font-bold mt-0.5" style={{ color: box.color }}>
                  {box.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "crm-win-loss",
      layout: { x: 6, y: 4, w: 6, h: 8, minW: 4, minH: 6 },
      content: (
        <Card className="border-brand-border h-full overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-body-3 font-semibold text-brand-text">Win / Loss This Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-brand-bg border border-brand-border text-center py-4">
                <div className="text-brand-body-5 text-brand-text-light">Won</div>
                <div className="text-2xl font-bold text-brand-success mt-1">{liveDealsWon != null ? liveDealsWon : "—"}</div>
                <div className="text-brand-body-5 text-brand-text-light mt-0.5">{formatCrmLakhs(liveWonValue) ?? (liveWonValue != null ? `₹${liveWonValue}` : "—")}</div>
              </div>
              <div className="rounded-lg bg-brand-bg border border-brand-border text-center py-4">
                <div className="text-brand-body-5 text-brand-text-light">Lost</div>
                <div className="text-2xl font-bold text-[#E7848E] mt-1">{liveDealsLost != null ? liveDealsLost : "—"}</div>
                <div className="text-brand-body-5 text-brand-text-light mt-0.5">{formatCrmLakhs(liveLostValue) ?? (liveLostValue != null ? `₹${liveLostValue}` : "—")}</div>
              </div>
            </div>

            {leadPerformanceRows.length > 0 && (
              <>
                <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                  Lead Performance
                </div>
                <div className="space-y-2">
                  {leadPerformanceRows.map((row) => (
                    <div key={row.label} className="flex items-center gap-3">
                      <span className="w-24 flex-shrink-0 truncate text-brand-body-5 text-brand-text-light">
                        {row.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-brand-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                        />
                      </div>
                      <span className="flex-shrink-0 text-brand-body-5 font-semibold text-brand-text">{row.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {liveWinRate != null && (
              <div className="flex items-center justify-between text-brand-body-5 mt-3 pt-2 border-t border-brand-border">
                <span className="text-brand-text-light">Conversion Rate</span>
                <span className="font-semibold text-brand-success">{liveWinRate}%</span>
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      key: "crm-adoption-sentiment-label",
      layout: { x: 0, y: 12, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1">
          Module Adoption &amp; Sentiment
        </div>
      ),
    },
    {
      key: "crm-adoption",
      layout: { x: 0, y: 13, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        adoptionData.length > 0 ? (
          <BarChartCard
            title="Module Adoption"
            subtitle="Which CRM modules are active?"
            data={adoptionData}
            categoryKey="module"
            orientation="horizontal"
            series={[{ dataKey: "pct", name: "Adoption %" }]}
            categoryColors={["#108C72", "#6B9BCC", "#9EC8BA", "#DA7756"]}
            showInfoIcon
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Module Adoption"
            subtitle="Which CRM modules are active?"
            message={loading ? "Loading…" : "No module adoption data available for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "crm-sentiment",
      layout: { x: 6, y: 13, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <EmptyStateCard
          title="Complaint Sentiment Trend"
          subtitle="Tenant sentiment tracking"
          message={loading ? "Loading…" : "No sentiment trend data recorded for this period."}
          className="h-full"
        />
      ),
    },
    {
      key: "crm-activities-label",
      layout: { x: 0, y: 19, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1">
          My Activities This Period
        </div>
      ),
    },
    {
      key: "crm-activities",
      layout: { x: 0, y: 20, w: 12, h: 3, minW: 6, minH: 3 },
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 h-full">
          <StatHeroCard tone="purple" label="Calls" value={callsCount != null ? String(callsCount) : loadingLabel} accent="info" className="h-full" />
          <StatHeroCard tone="teal" label="Meetings" value={meetingsCount != null ? String(meetingsCount) : loadingLabel} accent="error" className="h-full" />
          <StatHeroCard tone="peach" label="Tasks Done" value={tasksCount != null ? String(tasksCount) : loadingLabel} accent="success" className="h-full" />
          <StatHeroCard tone="blue" label="Broadcasts Sent" value={emailsCount != null ? String(emailsCount) : loadingLabel} accent="green" className="h-full" />
          <StatHeroCard tone="purple" label="Notes Added" value={notesCount != null ? String(notesCount) : loadingLabel} accent="neutral" className="h-full" />
        </div>
      ),
    },
  ];

  // --- My Pipeline ---
  const pipelineItems: SafetyGridItem[] = [
    {
      key: "crm-pipeline-stage-full",
      layout: { x: 0, y: 0, w: 6, h: 7, minW: 4, minH: 5 },
      content: (
        pipelineStageRows.length > 0 ? (
          <ProgressListCard
            title="Pipeline by Stage"
            subtitle={livePipeline != null ? `Active pipeline · ${formatCrmLakhs(livePipeline)}` : "Deals by stage"}
            sections={[{ rows: pipelineStageRows }]}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Pipeline by Stage"
            subtitle="Deals by stage"
            message={loading ? "Loading…" : "No pipeline stage data found for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "crm-pipeline-deals-full",
      layout: { x: 6, y: 0, w: 6, h: 7, minW: 4, minH: 5 },
      content: (
        openDealsRows.length > 0 ? (
          <DataTableCard
            title="Top Open Deals"
            columns={OPEN_DEAL_COLUMNS}
            data={openDealsRows}
            getRowKey={(row) => row.account}
            className="h-full no-drag"
          />
        ) : (
          <EmptyStateCard
            title="Top Open Deals"
            subtitle="Active deals"
            message={loading ? "Loading…" : "No open deals found for this period."}
            className="h-full no-drag"
          />
        )
      ),
    },
  ];

  // --- Calendar ---
  const calendarItems: SafetyGridItem[] = [
    {
      key: "crm-calendar-label",
      layout: { x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1">
          Calendar &amp; Activities
        </div>
      ),
    },
    {
      key: "crm-calendar-grid",
      layout: { x: 0, y: 1, w: 8, h: 11, minW: 5, minH: 8 },
      content: (
        <CrmCalendarCard
          monthLabel={monthName}
          cells={calendarCells}
          events={{}}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          selectedDayLabel={today.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })}
          selectedDayTasks={[]}
          className="h-full"
        />
      ),
    },
    {
      key: "crm-upcoming",
      layout: { x: 8, y: 1, w: 4, h: 7, minW: 3, minH: 5 },
      content: (
        upcomingItems.length > 0 ? (
          <UpcomingListCard
            title="Upcoming 7 Days"
            items={upcomingItems}
            miniStats={[
              { label: "Events", value: upcomingItems.length, tone: "info" },
            ]}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Upcoming 7 Days"
            subtitle="Scheduled activities"
            message={loading ? "Loading…" : "No upcoming events scheduled."}
            className="h-full"
          />
        )
      ),
    },
  ];

  // --- My Tasks ---
  const tasksItems: SafetyGridItem[] = [
    {
      key: "crm-tasks-label",
      layout: { x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1">
          My Open Tasks
        </div>
      ),
    },
    {
      key: "crm-pending-tasks",
      layout: { x: 0, y: 1, w: 6, h: 8, minW: 4, minH: 6 },
      content: (
        pendingTaskRows.length > 0 ? (
          <TaskListCard
            title="Pending Tasks"
            rows={pendingTaskRows}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Pending Tasks"
            subtitle="Follow-ups & action items"
            message={loading ? "Loading…" : "No pending tasks for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "crm-quick-stats",
      layout: { x: 6, y: 1, w: 6, h: 8, minW: 4, minH: 6 },
      content: (
        <StatListCard
          title="Quick Stats"
          rows={[
            { label: "Revenue This Period", value: liveRevenue != null ? formatCrmLakhs(liveRevenue) ?? `₹${liveRevenue}` : "—" },
            { label: "Win Rate", value: liveWinRate != null ? `${liveWinRate}%` : "—" },
            { label: "Deals Won", value: liveDealsWon != null ? String(liveDealsWon) : "—" },
            { label: "Avg Deal Size", value: liveAvgDeal != null ? formatCrmLakhs(liveAvgDeal) ?? `₹${liveAvgDeal}` : "—" },
          ]}
          className="h-full"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div ref={registerRef("Overview")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="crmOverviewGridLayout"
          items={overviewItems}
          static
          moduleKey="crm"
          subTab="Overview"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("My Pipeline")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="crmPipelineGridLayout_v2"
          items={pipelineItems}
          static
          moduleKey="crm"
          subTab="My Pipeline"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Calendar")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="crmCalendarGridLayout"
          items={calendarItems}
          static
          moduleKey="crm"
          subTab="Calendar"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("My Tasks")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="crmTasksGridLayout"
          items={tasksItems}
          static
          moduleKey="crm"
          subTab="My Tasks"
          visibleKeys={visibleKeys}
        />
      </div>
    </div>
  );
}

