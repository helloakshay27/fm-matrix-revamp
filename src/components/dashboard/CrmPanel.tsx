import { useEffect, useRef, useState } from "react";
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

// The CRM module isn't wired to a live dashboard API yet — layout and figures
// below mirror the fm_matrix_phase10 (Phase 9B) mockup's CRM tab
// (Overview/My Pipeline/Calendar/My Tasks/Campaigns) as illustrative content
// until a real endpoint exists. Colors are the same brand tokens already used
// by Finance/Safety/Maintenance charts elsewhere in this app.

interface OpenDealRow {
  account: string;
  value: string;
  stage: string;
  close: string;
  days: number;
}

const OPEN_DEAL_ROWS: OpenDealRow[] = [
  { account: "Skyline Residences", value: "₹9.5L", stage: "Negotiation", close: "02 Jul", days: 3 },
  { account: "Greenfield Heights", value: "₹7.2L", stage: "Proposal", close: "08 Jul", days: 9 },
  { account: "Url Business Park", value: "₹6.0L", stage: "Demo Scheduled", close: "12 Jul", days: 13 },
  { account: "Coral Bay Towers", value: "₹5.4L", stage: "Proposal", close: "15 Jul", days: 16 },
];

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

const REVENUE_TREND_DATA = [
  { month: "Jan", revenue: 8 },
  { month: "Feb", revenue: 10 },
  { month: "Mar", revenue: 9 },
  { month: "Apr", revenue: 14 },
  { month: "May", revenue: 16 },
  { month: "Jun", revenue: 18.4 },
];

const SENTIMENT_TREND_DATA = [
  { month: "Jan", sentiment: 61 },
  { month: "Feb", sentiment: 64 },
  { month: "Mar", sentiment: 68 },
  { month: "Apr", sentiment: 70 },
  { month: "May", sentiment: 71 },
  { month: "Jun", sentiment: 73 },
];

// June 2026 — Sunday-first grid, matching the reference mockup's calendar
const CALENDAR_CELLS: { day: number; inMonth: boolean; isToday?: boolean }[] = [
  { day: 31, inMonth: false },
  ...Array.from({ length: 30 }, (_, i) => ({ day: i + 1, inMonth: true, isToday: i + 1 === 29 })),
];

const CALENDAR_EVENTS: Record<number, ("meeting" | "call")[]> = {
  16: ["meeting"],
  17: ["call"],
  22: ["meeting"],
  29: ["call", "meeting"],
};

const UPCOMING_ITEMS = [
  { day: "01", month: "Jul", title: "Call — Aarav Mehta · Skyline Residences", time: "11:00 AM" },
  { day: "02", month: "Jul", title: "Demo — Greenfield Heights", time: "3:00 PM" },
  { day: "03", month: "Jul", title: "Follow-up meeting — Coral Bay Towers", time: "10:30 AM" },
];

const PENDING_TASK_ROWS = [
  { label: "Send proposal — Coral Bay Towers", subtitle: "Coral Bay Towers", due: "2d overdue", overdue: true },
  { label: "Schedule demo", subtitle: "Url Business Park", due: "1d overdue", overdue: true },
  { label: "Confirm site visit", subtitle: "Greenfield Heights", due: "Today", overdue: true },
  { label: "Update CRM notes", subtitle: "Skyline Residences", due: "01 Jul", overdue: false },
];

interface CrmPanelProps {
  activeSection: string;
  /** When set, renders only the cards the user has saved to My Dashboard, across all sections. */
  visibleKeys?: Set<string>;
}

export function CrmPanel({ activeSection, visibleKeys }: CrmPanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [trendMode, setTrendMode] = useState<"line" | "bar">("line");
  const [selectedDay, setSelectedDay] = useState<number | null>(29);

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  const selectedDayTasks =
    selectedDay === 29
      ? [
          { time: "10:00 AM · 20 min", title: "Call — Follow-up with Maple County" },
          { time: "3:30 PM · 30 min", title: "Meeting — Internal pipeline review" },
        ]
      : [];

  // --- Overview ---
  const overviewItems: SafetyGridItem[] = [
    {
      key: "crm-hero",
      layout: { x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3, isResizable: false, isDraggable: false },
      content: (
        <HeroGradientStripCard
          className="h-full"
          items={[
            { label: "My Revenue", value: "₹18.4L", subtitle: "7 deals won" },
            { label: "Deals Won", value: "7", subtitle: "Avg deal ₹3.6L" },
            { label: "My Pipeline", value: "₹42.6L", subtitle: "12 open deals" },
            { label: "Win Rate", value: "47%", subtitle: "Below 55% target" },
            { label: "Overdue Tasks", value: "3", subtitle: "Need attention" },
            { label: "Meetings", value: "9", subtitle: "This month" },
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
          {trendMode === "line" ? (
            <AreaTrendChartCard
              title="My Revenue Trend"
              subtitle="Closed-won revenue by month"
              data={REVENUE_TREND_DATA}
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
              data={REVENUE_TREND_DATA}
              categoryKey="month"
              series={[{ dataKey: "revenue", name: "Revenue (₹L)" }]}
              categoryColors={["#108C72"]}
              className="h-full"
            />
          )}
          <div className="grid grid-cols-3 gap-3 px-4 pb-4 mt-4">
            {[
              { label: "Revenue", value: "₹18.4L", color: "#108C72" },
              { label: "Pipeline", value: "₹42.6L", color: "#6B9BCC" },
              { label: "Avg Deal", value: "₹3.6L", color: "#2C2C2C" },
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
                <div className="text-2xl font-bold text-brand-success mt-1">7</div>
                <div className="text-brand-body-5 text-brand-text-light mt-0.5">₹25.2L</div>
              </div>
              <div className="rounded-lg bg-brand-bg border border-brand-border text-center py-4">
                <div className="text-brand-body-5 text-brand-text-light">Lost</div>
                <div className="text-2xl font-bold text-[#E7848E] mt-1">4</div>
                <div className="text-brand-body-5 text-brand-text-light mt-0.5">₹9.8L</div>
              </div>
            </div>

            <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
              Lead Performance
            </div>
            <div className="space-y-2">
              {[
                { label: "New Leads", value: "24", percent: 100, color: "#6B9BCC" },
                { label: "Converted", value: "11", percent: 46, color: "#108C72" },
                { label: "New Today", value: "3", percent: 12, color: "#DA7756" },
              ].map((row) => (
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

            <div className="flex items-center justify-between text-brand-body-5 mt-3 pt-2 border-t border-brand-border">
              <span className="text-brand-text-light">Conversion Rate</span>
              <span className="font-semibold text-brand-success">45.8%</span>
            </div>

            <div className="flex items-start gap-2 rounded-md bg-brand-warning-light px-3 py-2 text-brand-body-5 text-[#8A5A00] mt-4">
              <span className="flex-shrink-0">⚠</span>
              <span className="leading-relaxed">
                <strong className="font-semibold">Win rate is 47%, below the 55% target.</strong> 3 deals have sat in
                Negotiation for 14+ days — a focused follow-up call often unsticks a stalled deal.
              </span>
            </div>
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
        <BarChartCard
          title="Module Adoption"
          subtitle="Which CRM modules are actually being used?"
          data={[
            { module: "Wallet", pct: 90 },
            { module: "Campaign", pct: 70 },
            { module: "Events", pct: 6 },
            { module: "Leads", pct: 8 },
            { module: "Broadcast", pct: 15 },
            { module: "Mailroom", pct: 2 },
          ]}
          categoryKey="module"
          orientation="horizontal"
          series={[{ dataKey: "pct", name: "Adoption %" }]}
          categoryColors={["#108C72", "#108C72", "#E7848E", "#E7848E", "#E7848E", "#E7848E"]}
          showInfoIcon
          className="h-full"
        />
      ),
    },
    {
      key: "crm-sentiment",
      layout: { x: 6, y: 13, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <AreaTrendChartCard
          title="Complaint Sentiment Trend"
          subtitle="Is tenant sentiment improving or worsening?"
          data={SENTIMENT_TREND_DATA}
          categoryKey="month"
          valueKey="sentiment"
          color="#E7848E"
          showInfoIcon
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
          <StatHeroCard tone="purple" label="Calls" value="18" accent="info" className="h-full" />
          <StatHeroCard tone="teal" label="Meetings" value="9" accent="error" className="h-full" />
          <StatHeroCard tone="peach" label="Tasks Done" value="14" accent="success" className="h-full" />
          <StatHeroCard tone="blue" label="Emails Sent" value="22" accent="green" className="h-full" />
          <StatHeroCard tone="purple" label="Notes Added" value="11" accent="neutral" className="h-full" />
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
        <ProgressListCard
          title="Pipeline by Stage"
          subtitle="12 open deals · ₹42.6L"
          sections={[
            {
              rows: [
                { label: "Lead", value: "4", percent: 100, color: "#CECBF6" },
                { label: "Qualified", value: "3", percent: 75, color: "#9EC8BA" },
                { label: "Demo Scheduled", value: "2", percent: 50, color: "#6B9BCC" },
                { label: "Proposal", value: "2", percent: 50, color: "#EDC488" },
                { label: "Negotiation", value: "1", percent: 25, color: "#DA7756" },
              ],
            },
          ]}
          className="h-full"
        />
      ),
    },
    {
      key: "crm-pipeline-deals-full",
      layout: { x: 6, y: 0, w: 6, h: 7, minW: 4, minH: 5 },
      content: (
        <DataTableCard
          title="Top Open Deals"
          columns={OPEN_DEAL_COLUMNS}
          data={OPEN_DEAL_ROWS}
          getRowKey={(row) => row.account}
          insight="₹9.5L in your top deal. Skyline Residences closes in 3 days — prioritise this follow-up first."
          className="h-full no-drag"
        />
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
          monthLabel="June 2026"
          cells={CALENDAR_CELLS}
          events={CALENDAR_EVENTS}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          selectedDayLabel="Monday, 29 Jun"
          selectedDayTasks={selectedDayTasks}
          className="h-full"
        />
      ),
    },
    {
      key: "crm-upcoming",
      layout: { x: 8, y: 1, w: 4, h: 7, minW: 3, minH: 5 },
      content: (
        <UpcomingListCard
          title="Upcoming 7 Days"
          items={UPCOMING_ITEMS}
          miniStats={[
            { label: "Pending", value: 4, tone: "warning" },
            { label: "Calls", value: 6, tone: "info" },
            { label: "Blocked", value: 1, tone: "error" },
          ]}
          className="h-full"
        />
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
        <TaskListCard
          title="Pending Tasks"
          badge={{ tone: "terra", label: "3 Overdue" }}
          rows={PENDING_TASK_ROWS}
          insight="3 overdue tasks — clear these first. Overdue tasks signal broken follow-up loops. Resolve or reschedule them now to keep your pipeline moving and your commitments credible."
          className="h-full"
        />
      ),
    },
    {
      key: "crm-quick-stats",
      layout: { x: 6, y: 1, w: 6, h: 8, minW: 4, minH: 6 },
      content: (
        <StatListCard
          title="Quick Stats"
          rows={[
            { label: "Revenue This Month", value: "₹18.4L" },
            { label: "Quota Achievement", badge: { tone: "terra", label: "78%" } },
            { label: "Win Rate", value: "47%" },
            { label: "Leads Converted", value: "11 / 24" },
            { label: "Avg Deal Size", value: "₹3.6L" },
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
