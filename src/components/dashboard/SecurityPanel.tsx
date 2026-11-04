import { AlertTriangle } from "lucide-react";
import {
  StatHeroCard,
  BarChartCard,
  PieChartCard,
  StatListCard,
  ProgressListCard,
  HighlightStatCard,
} from "@/components/charts";
import { VEDA_COLORS, VEDA_PIE_PROPS } from "@/styles/vedaTheme";
import { gridItem, ModuleSection, useSectionScroll } from "@/components/dashboard/moduleGrid";

const { purple, blue, growth, warning, danger, olive } = VEDA_COLORS;

const ALERTS = [
  "Patrol Gap — No Log Since Jan 2026",
  "2 Expired Staff Credentials Still Approved",
  "4 Visitors Pending 80+ Days",
  "Patrolling System Error (HTTP 500)",
];

interface SecurityPanelProps {
  activeSection: string;
  visibleKeys?: Set<string>;
}

export function SecurityPanel({ activeSection, visibleKeys }: SecurityPanelProps) {
  const registerRef = useSectionScroll(activeSection);

  const gateItems = [
    gridItem(
      "sec-alerts",
      0,
      0,
      12,
      2,
      <div className="h-full rounded-2xl bg-[#F5F4F0] px-5 py-3">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#1A1A18]">
          <AlertTriangle className="h-3.5 w-3.5" /> Security Alerts
        </div>
        <div className="flex flex-wrap gap-2">
          {ALERTS.map((alert) => (
            <span key={alert} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#1A1A18]">
              {alert}
            </span>
          ))}
        </div>
      </div>
    ),
    gridItem("sec-patrol-kpi", 0, 2, 3, 3, <StatHeroCard tone="peach" label="Patrol Compliance" value="15%" accent="error" subtitle="Last patrol log: Jan 2026" progress={15} className="h-full" />),
    gridItem("sec-visitors-kpi", 3, 2, 3, 3, <StatHeroCard tone="purple" label="Visitors Today" value="47" accent="neutral" subtitle="32 expected · 15 unexpected" className="h-full" />),
    gridItem("sec-passes-kpi", 6, 2, 3, 3, <StatHeroCard tone="teal" label="Gate Passes" value="87" accent="info" subtitle="43 inward · 44 outward · 18 unmatched" className="h-full" />),
    gridItem("sec-staff-kpi", 9, 2, 3, 3, <StatHeroCard tone="blue" label="Security Staff" value="12 / 14" accent="warning" subtitle="2 expired credentials still approved" className="h-full" />),
    gridItem(
      "sec-reconcile",
      0,
      5,
      7,
      6,
      <BarChartCard
        title="Gate Pass Reconciliation"
        subtitle="18 returnable passes unmatched — potential asset loss"
        data={[
          { kind: "Inward", count: 43 },
          { kind: "Outward", count: 44 },
          { kind: "Unmatched", count: 18 },
        ]}
        categoryKey="kind"
        series={[{ dataKey: "count", name: "Passes" }]}
        categoryColors={[blue, growth, danger]}
        insight="Track whether the 18 unmatched passes are growing, not just the static count."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-invoice-gap",
      7,
      5,
      5,
      6,
      <HighlightStatCard
        title="Material entering with no invoice closure"
        subtitle="Most inward passes show ₹0 invoiced"
        value="8 of 10"
        valueCaption="sampled, uninvoiced"
        tone="warning"
        description="Goods cross the gate but the financial loop rarely closes — the same pattern as AMC and utility billing, on physical material."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-approval",
      0,
      11,
      6,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Gate Pass Approval Status"
        subtitle="Approved · Pending · Rejected"
        showInfoIcon
        data={[
          { name: "Approved", value: 52 },
          { name: "Pending", value: 28 },
          { name: "Rejected", value: 7 },
        ]}
        centerLabel="87"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-returnable",
      6,
      11,
      6,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Returnable vs Non-Returnable"
        subtitle="Material movement type"
        data={[
          { name: "Returnable", value: 46 },
          { name: "Non-returnable", value: 41 },
        ]}
        centerLabel="87"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-categories",
      0,
      17,
      6,
      5,
      <ProgressListCard
        title="Category-wise Material Movement"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "IT Equipment", value: "34", percent: 100, color: blue },
              { label: "Furniture", value: "19", percent: 56, color: purple },
              { label: "AMC Spares", value: "15", percent: 44, color: warning },
              { label: "Consumables", value: "9", percent: 26, color: olive },
            ],
          },
        ]}
      />
    ),
    gridItem(
      "sec-io-trend",
      6,
      17,
      6,
      5,
      <BarChartCard
        title="Inward vs Outward Trend"
        subtitle="6 months"
        data={[
          { month: "Jan", inward: 30, outward: 22 },
          { month: "Feb", inward: 28, outward: 26 },
          { month: "Mar", inward: 36, outward: 31 },
          { month: "Apr", inward: 40, outward: 38 },
          { month: "May", inward: 43, outward: 41 },
          { month: "Jun", inward: 43, outward: 44 },
        ]}
        categoryKey="month"
        stacked
        series={[
          { dataKey: "inward", name: "Inward" },
          { dataKey: "outward", name: "Outward" },
        ]}
        seriesColors={[blue, growth]}
        className="h-full overflow-auto"
      />
    ),
  ];

  const patrolItems = [
    gridItem("sec-planned", 0, 0, 4, 3, <StatHeroCard tone="purple" label="Planned Patrols" value="53" accent="neutral" subtitle="Scheduled this period" className="h-full" />),
    gridItem("sec-completed", 4, 0, 4, 3, <StatHeroCard tone="teal" label="Completed Patrols" value="41" accent="success" subtitle="77% completion rate" progress={77} className="h-full" />),
    gridItem("sec-missed", 8, 0, 4, 3, <StatHeroCard tone="peach" label="Missed Patrols" value="12" accent="error" subtitle="Inflated by phantom routes" className="h-full" />),
    gridItem("sec-incidents-found", 0, 3, 6, 3, <StatHeroCard tone="blue" label="Incidents Found" value="0" accent="neutral" subtitle="None via patrol" className="h-full" />),
    gridItem("sec-tickets-via", 6, 3, 6, 3, <StatHeroCard tone="purple" label="Tickets via Patrol" value="0" accent="error" subtitle="0 of 41 raised a ticket" className="h-full" />),
    gridItem(
      "sec-shift-bar",
      0,
      6,
      6,
      6,
      <BarChartCard
        title="Patrol completion by shift"
        subtitle="Night isn't low — it stopped in Jan 2026"
        data={[
          { shift: "Morning", done: 18, planned: 20 },
          { shift: "Afternoon", done: 16, planned: 18 },
          { shift: "Night", done: 7, planned: 15 },
        ]}
        categoryKey="shift"
        series={[
          { dataKey: "done", name: "Completed" },
          { dataKey: "planned", name: "Planned" },
        ]}
        seriesColors={[growth, olive]}
        insight="Patrolling List currently returns HTTP 500 in the live system. This is a broken feature, not empty data."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-patrol-link",
      6,
      6,
      6,
      6,
      <StatListCard
        title="Patrol → Ticket / Incident link"
        subtitle="Ticket Id and Incident Id exist on each response — none populated"
        className="h-full overflow-auto"
        rows={[
          { label: "Responses with a Ticket Id", badge: { tone: "red", label: "0 of 41" } },
          { label: "Responses with an Incident Id", badge: { tone: "red", label: "0 of 41" } },
          { label: "Panchshil Gate patrolling", badge: { tone: "green", label: "41 Completed" } },
          { label: "Night Patrol (3 checkpoints)", badge: { tone: "red", label: "Last Jan 2026" } },
          { label: "Patrol Import 12", badge: { tone: "red", label: "Phantom Route" } },
        ]}
      />
    ),
    gridItem(
      "sec-patrol-trend",
      0,
      12,
      7,
      5,
      <BarChartCard
        title="Patrol Completion Trend"
        subtitle="6 months · completed ÷ scheduled"
        showInfoIcon
        data={[
          { month: "Jan", pct: 82 },
          { month: "Feb", pct: 74 },
          { month: "Mar", pct: 61 },
          { month: "Apr", pct: 48 },
          { month: "May", pct: 33 },
          { month: "Jun", pct: 15 },
        ]}
        categoryKey="month"
        series={[{ dataKey: "pct", name: "Completion %" }]}
        seriesColors={[danger]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-guards",
      7,
      12,
      5,
      5,
      <StatListCard
        title="Guard Performance"
        subtitle="Named accountability, not a shift average"
        className="h-full overflow-auto"
        rows={[
          { label: "Morning Shift", badge: { tone: "green", label: "18/18" } },
          { label: "Afternoon Shift", badge: { tone: "green", label: "16/18" } },
          { label: "Night Shift", badge: { tone: "red", label: "7/15 · since Jan" } },
        ]}
      />
    ),
  ];

  const visitorItems = [
    gridItem("sec-expected", 0, 0, 3, 3, <StatHeroCard tone="teal" label="Expected Visitors" value="32" accent="success" subtitle="Pre-registered · approved" className="h-full" />),
    gridItem("sec-unexpected", 3, 0, 3, 3, <StatHeroCard tone="blue" label="Unexpected Visitors" value="15" accent="warning" subtitle="Walk-in · verified at gate" className="h-full" />),
    gridItem("sec-rejected", 6, 0, 3, 3, <StatHeroCard tone="peach" label="Rejected Visitors" value="0" accent="error" subtitle="Feature not configured — not a real zero" className="h-full" />),
    gridItem("sec-blacklist", 9, 0, 3, 3, <StatHeroCard tone="purple" label="Blacklisted Visitors" value="0" accent="neutral" subtitle="No blacklist records found" className="h-full" />),
    gridItem(
      "sec-visitor-trend",
      0,
      3,
      12,
      6,
      <BarChartCard
        title="Visitor Trend"
        subtitle="Illustrative — the live visitor list currently shows no history"
        data={[
          { month: "Jan", visitors: 310 },
          { month: "Feb", visitors: 280 },
          { month: "Mar", visitors: 360 },
          { month: "Apr", visitors: 410 },
          { month: "May", visitors: 390 },
          { month: "Jun", visitors: 440 },
        ]}
        categoryKey="month"
        series={[{ dataKey: "visitors", name: "Visitors" }]}
        seriesColors={[purple]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-visitor-cats",
      0,
      9,
      6,
      6,
      <StatListCard
        title="Visitors by Category"
        subtitle="Guest · Support Staff"
        className="h-full overflow-auto"
        rows={[
          { label: "Business Meeting", value: "28" },
          { label: "Personal Visit", value: "4" },
          { label: "Interview", value: "3" },
          { label: "Delivery / Courier", value: "6" },
          { label: "Vendor / Contractor", value: "12" },
        ]}
      />
    ),
    gridItem(
      "sec-occupancy",
      6,
      9,
      6,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Currently Inside vs Exited"
        subtitle="Real-time occupancy"
        data={[
          { name: "Inside", value: 18 },
          { name: "Exited", value: 29 },
        ]}
        centerLabel="47"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-companies",
      0,
      15,
      12,
      4,
      <StatListCard
        title="Top Visiting Companies"
        className="h-full overflow-auto"
        rows={[
          { label: "Oizom Instruments Pvt. Ltd.", value: "14" },
          { label: "Godrej Living", value: "9" },
          { label: "HSBC", value: "6" },
        ]}
        note="Oizom also leads gate-pass and AMC concentration. Three systems now point at the same name."
      />
    ),
  ];

  const vehicleItems = [
    gridItem(
      "sec-insurance",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="Vehicle insurance status"
        subtitle="Active only checks the record — not whether insurance is valid"
        data={[
          { band: "Valid", count: 6 },
          { band: "Expired <1y", count: 2 },
          { band: "Expired 1–3y", count: 4 },
          { band: "Expired 3y+", count: 5 },
        ]}
        categoryKey="band"
        series={[{ dataKey: "count", name: "Vehicles" }]}
        categoryColors={[growth, warning, danger, purple]}
        insight="Several vehicles marked Active have insurance expired 3–6 years ago."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "sec-host",
      7,
      0,
      5,
      6,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Guest vehicle host concentration"
        subtitle="11 of 11 guest vehicles under one host name"
        showInfoIcon
        data={[{ name: "Single host", value: 11 }]}
        centerLabel="100%"
        insight="You currently cannot answer which tenant a guest vehicle belongs to."
        className="h-full overflow-auto"
      />
    ),
  ];

  const staffItems = [
    gridItem(
      "sec-staff",
      0,
      0,
      12,
      5,
      <StatListCard
        title="Security Staff"
        subtitle="12 of 14 credentials current"
        className="h-full overflow-auto"
        rows={[
          { label: "Expired credentials still Approved", badge: { tone: "red", label: "2" } },
          { label: "Active credentials", badge: { tone: "green", label: "12 of 14" } },
        ]}
        note="A staff member with expired credentials still marked Approved is an access-control gap — the same pattern as vehicle insurance."
      />
    ),
  ];

  return (
    <div className="space-y-6">
      <ModuleSection id="Gate Passes" storageKey="securityGateGrid" moduleKey="security" subTab="Gate Passes" items={gateItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Patrol" storageKey="securityPatrolGrid" moduleKey="security" subTab="Patrol" items={patrolItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Visitors" storageKey="securityVisitorGrid" moduleKey="security" subTab="Visitors" items={visitorItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Vehicles" storageKey="securityVehicleGrid" moduleKey="security" subTab="Vehicles" items={vehicleItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Staff" storageKey="securityStaffGrid" moduleKey="security" subTab="Staff" items={staffItems} visibleKeys={visibleKeys} registerRef={registerRef} />
    </div>
  );
}
