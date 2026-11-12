import { AlertTriangle } from "lucide-react";
import {
  StatHeroCard,
  BarChartCard,
  PieChartCard,
  StatListCard,
  ProgressListCard,
  DataTableCard,
  TableBadge,
  HighlightStatCard,
  type DataTableColumn,
} from "@/components/charts";
import { VEDA_COLORS, VEDA_PIE_PROPS } from "@/styles/vedaTheme";
import { gridItem, ModuleSection, useSectionScroll } from "@/components/dashboard/moduleGrid";

const { purple, blue, growth, warning, danger, olive, mint } = VEDA_COLORS;

interface BillRow {
  client: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  status: string;
  tone: "red" | "amber";
}

const BILL_COLUMNS: DataTableColumn<BillRow>[] = [
  { key: "client", header: "Client", render: (r) => <span className="font-semibold text-brand-text">{r.client}</span> },
  { key: "type", header: "Reading Type", render: (r) => r.type },
  { key: "from", header: "From", render: (r) => r.from },
  { key: "to", header: "To", render: (r) => r.to },
  { key: "amount", header: "Amount", render: (r) => r.amount },
  { key: "status", header: "Status", render: (r) => <TableBadge tone={r.tone}>{r.status}</TableBadge> },
];

const BILL_ROWS: BillRow[] = [
  { client: "Northern Operating", type: "EBKVh", from: "Sep 2025", to: "Oct 2025", amount: "₹2,08,911", status: "Pending", tone: "red" },
  { client: "Synechron Technologies", type: "DGKVAH", from: "Sep 2025", to: "Oct 2025", amount: "₹1,01,468", status: "Pending", tone: "red" },
  { client: "CompuCom CSI", type: "electric", from: "Aug 2025", to: "Sep 2025", amount: "₹89,065", status: "Pending", tone: "red" },
  { client: "HSBC", type: "EBKVh", from: "Aug 2025", to: "Sep 2025", amount: "₹60,456", status: "Pending", tone: "red" },
  { client: "M/S Vohra Enterprises", type: "DGKVAH", from: "Sep 2025", to: "Sep 2025", amount: "₹9,259.2 × 6", status: "Duplicate Check", tone: "amber" },
];

interface DupRow {
  entity: string;
  from: string;
  to: string;
  amount: string;
  status: string;
}

const DUP_COLUMNS: DataTableColumn<DupRow>[] = [
  { key: "entity", header: "Entity", render: (r) => r.entity },
  { key: "from", header: "From", render: (r) => r.from },
  { key: "to", header: "To", render: (r) => r.to },
  { key: "amount", header: "Amount", render: (r) => r.amount },
  { key: "status", header: "Status", render: (r) => <TableBadge tone="amber">{r.status}</TableBadge> },
];

interface CalcRow {
  client: string;
  meter: string;
  factor: string;
  rate: string;
  actual: string;
  total: string;
  amount: string;
}

const CALC_COLUMNS: DataTableColumn<CalcRow>[] = [
  { key: "client", header: "Client", render: (r) => r.client },
  { key: "meter", header: "Meter No.", render: (r) => r.meter },
  { key: "factor", header: "Adj. Factor", render: (r) => r.factor },
  { key: "rate", header: "Rate/kWh", render: (r) => r.rate },
  { key: "actual", header: "Actual", render: (r) => r.actual },
  { key: "total", header: "Total", render: (r) => r.total },
  { key: "amount", header: "Amount", render: (r) => r.amount },
];

const ALERTS = [
  "Duplicate Billing Rows Found",
  "Meter Sequencing Corruption",
  "Solar Data Stale — Feb 2025",
  "Water Equipment 100% Down",
];

interface UtilityPanelProps {
  activeSection: string;
  visibleKeys?: Set<string>;
}

export function UtilityPanel({ activeSection, visibleKeys }: UtilityPanelProps) {
  const registerRef = useSectionScroll(activeSection);

  const energyItems = [
    gridItem(
      "ut-alerts",
      0,
      0,
      12,
      2,
      <div className="h-full rounded-2xl bg-[#F5F4F0] px-5 py-3">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#1A1A18]">
          <AlertTriangle className="h-3.5 w-3.5" /> Utility Alerts
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
    gridItem(
      "ut-sources",
      0,
      2,
      12,
      5,
      <BarChartCard
        title="Generation sources by status"
        subtitle="2 active, 1 stale, 3 not configured out of 6 expected"
        data={[
          { source: "Electricity", status: 1 },
          { source: "DG", status: 1 },
          { source: "Solar", status: 0.4 },
          { source: "Wind", status: 0 },
          { source: "Hydro", status: 0 },
          { source: "External", status: 0.6 },
        ]}
        categoryKey="source"
        series={[{ dataKey: "status", name: "Live signal" }]}
        categoryColors={[growth, olive, warning, "#D3D1C7", "#D3D1C7", blue]}
        insight="Half the energy sources aren't producing usable data. Electricity and DG are live; Solar is 16 months stale."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-electricity",
      0,
      7,
      4,
      5,
      <StatListCard
        title="Electricity"
        subtitle="Grid power · Main LT Panel"
        className="h-full overflow-auto"
        rows={[
          { label: "Main LT Panel", badge: { tone: "green", label: "~1,842 kWh/day" } },
          { label: "Common Area Anomaly", badge: { tone: "amber", label: "+12% spike" } },
        ]}
      />
    ),
    gridItem(
      "ut-dg",
      4,
      7,
      4,
      5,
      <StatListCard
        title="DG (Diesel Generator)"
        subtitle="KIRLOSKAR DG"
        className="h-full overflow-auto"
        rows={[
          { label: "Diesel Consumption", value: "250 L/mo" },
          { label: "Power Factor", value: "0.98" },
          { label: "Status", badge: { tone: "green", label: "Active" } },
        ]}
      />
    ),
    gridItem(
      "ut-solar-card",
      8,
      7,
      4,
      5,
      <StatListCard
        title="Solar"
        subtitle="Full detail under Solar Generator"
        className="h-full overflow-auto"
        rows={[
          { label: "Status", badge: { tone: "red", label: "Stale" } },
          { label: "Last Record", value: "Feb 2025 (16mo)" },
          { label: "Carbon Saved", value: "22 Kg" },
        ]}
      />
    ),
    gridItem("ut-cost", 0, 12, 3, 3, <StatHeroCard tone="purple" label="Total Utility Cost" value="₹4.2L" accent="warning" subtitle="Electricity + DG + Water · this period" className="h-full" />),
    gridItem("ut-predictive", 3, 12, 3, 3, <StatHeroCard tone="teal" label="Actual vs Predicted" value="8,622" accent="info" subtitle="kWh · 29% under the 12,172 forecast" className="h-full" />),
    gridItem("ut-carbon-score", 6, 12, 3, 3, <StatHeroCard tone="peach" label="Carbon Score" value="31/100" accent="neutral" subtitle="Scope 1 + 2 + renewable" className="h-full" />),
    gridItem("ut-smart-meter", 9, 12, 3, 3, <StatHeroCard tone="blue" label="Smart Meter vs Manual" value="42%" accent="warning" subtitle="Smart-read · rest is manual entry" className="h-full" />),
    gridItem(
      "ut-elec-trend",
      0,
      15,
      6,
      6,
      <BarChartCard
        title="Electricity Consumption Trend"
        subtitle="Is consumption normal?"
        data={[
          { month: "Jan", kwh: 7200 },
          { month: "Feb", kwh: 6900 },
          { month: "Mar", kwh: 8100 },
          { month: "Apr", kwh: 8600 },
          { month: "May", kwh: 8420 },
          { month: "Jun", kwh: 8622 },
        ]}
        categoryKey="month"
        series={[{ dataKey: "kwh", name: "kWh" }]}
        seriesColors={[purple]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-benchmark",
      6,
      15,
      6,
      6,
      <BarChartCard
        title="Site Benchmark"
        subtitle="kWh / sqft · which site is inefficient?"
        showInfoIcon
        data={[
          { site: "Tower A", kwh: 1.8 },
          { site: "Tower B", kwh: 2.1 },
          { site: "Tower C", kwh: 3.4 },
          { site: "Common", kwh: 2.6 },
        ]}
        categoryKey="site"
        series={[{ dataKey: "kwh", name: "kWh/sqft" }]}
        categoryColors={[growth, blue, danger, warning]}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-energy-tree",
      0,
      21,
      6,
      5,
      <ProgressListCard
        title="Energy Tree %"
        subtitle="Total · Mains · DG"
        className="h-full overflow-auto"
        sections={[
          {
            rows: [
              { label: "Total", value: "100%", percent: 100, color: purple },
              { label: "Mains", value: "100%", percent: 100, color: blue },
              { label: "DG", value: "0%", percent: 0, color: danger },
            ],
          },
        ]}
      />
    ),
    gridItem(
      "ut-meter-health",
      6,
      21,
      6,
      5,
      <PieChartCard
        {...VEDA_PIE_PROPS}
        title="Meter Health"
        subtitle="Online / Offline / Missing / Communication Failure"
        showInfoIcon
        data={[
          { name: "Online", value: 41 },
          { name: "Offline", value: 7 },
          { name: "Missing", value: 4 },
          { name: "Comm. Failure", value: 6 },
        ]}
        centerLabel="58"
        insight="A meter in Communication Failure contributes zero data and will not show up in any consumption trend."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-device-alerts",
      0,
      26,
      12,
      4,
      <StatListCard
        title="Device Alerts"
        subtitle="Named device and a timestamp — 10 total"
        className="h-full overflow-auto"
        rows={[
          { label: "Not communicating — T5.3 Main", value: "26/06/2026 14:00" },
          { label: "Not communicating — T5.2 Main", value: "26/06/2026 14:00" },
          { label: "Not communicating — T5.1 Main", value: "26/06/2026 14:00" },
        ]}
      />
    ),
  ];

  const waterItems = [
    gridItem(
      "ut-water-down",
      0,
      0,
      12,
      3,
      <HighlightStatCard
        title="Not missing data — zero working equipment"
        subtitle="Both registered water assets are in Breakdown"
        value="2 / 2"
        valueCaption="assets down"
        tone="error"
        description="The 0 kL readings are the result of 100% of water monitoring hardware being non-functional. This is a facilities problem, not a software setup task."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-water-monitor",
      0,
      3,
      6,
      5,
      <StatListCard
        title="Water Monitoring"
        subtitle="2 total assets, both Breakdown"
        className="h-full overflow-auto"
        rows={[
          { label: "Consumption Target", value: "30 KL / day" },
          { label: "Test asset water — Ghar", badge: { tone: "red", label: "Breakdown" } },
          { label: "Test asset water — Ghar (2)", badge: { tone: "red", label: "Breakdown" } },
          { label: "Working assets", badge: { tone: "red", label: "0" } },
        ]}
      />
    ),
    gridItem("ut-water-fresh", 6, 3, 3, 5, <StatHeroCard tone="purple" label="Fresh vs Recycled" value="Target only" accent="neutral" subtitle="30 KL target, no live meter to split the two" className="h-full" />),
    gridItem("ut-water-occupant", 9, 3, 3, 5, <StatHeroCard tone="teal" label="Per Occupant" value="Blocked" accent="neutral" subtitle="Same 2 broken meters block this too" className="h-full" />),
  ];

  const stpItems = [
    gridItem(
      "ut-stp",
      0,
      0,
      6,
      6,
      <StatListCard
        title="STP Monitoring"
        subtitle="Sewage Treatment Plant"
        className="h-full overflow-auto"
        rows={[
          { label: "Status", badge: { tone: "amber", label: "Partial" } },
          { label: "STP Processing", value: "24 KL" },
          { label: "Treated Water Reused", value: "15 KL" },
          { label: "BOD / COD / pH", badge: { tone: "red", label: "Not configured" } },
          { label: "Reuse Efficiency", value: "63%" },
        ]}
      />
    ),
    gridItem(
      "ut-stp-efficiency",
      6,
      0,
      6,
      6,
      <HighlightStatCard
        title="STP Treatment Efficiency"
        subtitle="Different from Reuse Efficiency"
        value="Needs inflow"
        valueCaption="no denominator yet"
        tone="warning"
        description="24 KL processed is known, but total wastewater received is not. Reuse Efficiency is 63%. Treatment Efficiency cannot be computed until inflow volume exists."
        className="h-full overflow-auto"
      />
    ),
  ];

  const readingsItems = [
    gridItem(
      "ut-dg-readings",
      0,
      0,
      6,
      6,
      <StatListCard
        title="DG Daily Readings"
        subtitle="KIRLOSKAR DG · live"
        className="h-full overflow-auto"
        rows={[
          { label: "Running Hours Today", value: "2 hrs" },
          { label: "Diesel Level", badge: { tone: "amber", label: "50%" } },
          { label: "Battery DC Voltage", badge: { tone: "green", label: "24V" } },
        ]}
        note="Refuel threshold is 30%."
      />
    ),
    gridItem(
      "ut-meter-status",
      6,
      0,
      6,
      6,
      <StatListCard
        title="Meter Status"
        className="h-full overflow-auto"
        rows={[
          { label: "Main LT Panel (EBKVh)", badge: { tone: "green", label: "Active" } },
          { label: "Common Area", badge: { tone: "amber", label: "Anomaly +12%" } },
          { label: "Water assets", badge: { tone: "red", label: "2 — both breakdown" } },
          { label: "STP / BOD logging", badge: { tone: "red", label: "Not configured" } },
        ]}
      />
    ),
    gridItem(
      "ut-meter-sequence",
      0,
      6,
      12,
      5,
      <BarChartCard
        title="Meter Edit Critical — reading sequence"
        subtitle="Same meter, logged out of order"
        data={[
          { step: "1", reading: 2100 },
          { step: "2", reading: -3120 },
          { step: "3", reading: 2942 },
          { step: "4", reading: 1800 },
        ]}
        categoryKey="step"
        series={[{ dataKey: "reading", name: "Reading" }]}
        categoryColors={[blue, danger, warning, olive]}
        insight="Readings drop to -3120 then spike to 2942. Any total from this meter is unreliable."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
  ];

  const requestItems = [
    gridItem(
      "ut-pipeline",
      0,
      0,
      12,
      4,
      <StatListCard
        title="Billing Pipeline"
        subtitle="Meter Reading → UMR → Bill → SAP"
        className="h-full overflow-auto"
        rows={[
          { label: "Meter Reading", badge: { tone: "green", label: "Done" } },
          { label: "UMR Generated", badge: { tone: "green", label: "Done" } },
          { label: "Bill Issued", badge: { tone: "amber", label: "Partial" } },
          { label: "SAP Synced", badge: { tone: "red", label: "Pending / Failed" } },
        ]}
        note="The break is between Bill Issued and SAP sync. About 950 bills are still pending."
      />
    ),
    gridItem(
      "ut-duplicates",
      0,
      4,
      12,
      6,
      <DataTableCard
        title="Reported backlog may be inflated by duplicates"
        subtitle="M/S Vohra Enterprises appears 6 times with identical dates, consumption, and amount · ~950 reported pending"
        columns={DUP_COLUMNS}
        data={[
          { entity: "M/S Vohra Enterprises", from: "2025-09-01", to: "2025-09-30", amount: "₹9,259.2", status: "Duplicate #1" },
          { entity: "M/S Vohra Enterprises", from: "2025-09-01", to: "2025-09-30", amount: "₹9,259.2", status: "Duplicate #2" },
          { entity: "M/S Vohra Enterprises", from: "2025-09-01", to: "2025-09-30", amount: "₹9,259.2", status: "Duplicate #3" },
        ]}
        getRowKey={(r) => r.status}
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-bill-age",
      0,
      10,
      12,
      6,
      <BarChartCard
        title="Age of the ~950 pending bills"
        subtitle="A slow drip, or one old backlog?"
        data={[
          { band: "< 30d", count: 40 },
          { band: "1–3 mo", count: 80 },
          { band: "3–6 mo", count: 120 },
          { band: "6–12 mo", count: 210 },
          { band: "> 1 yr", count: 500 },
        ]}
        categoryKey="band"
        series={[{ dataKey: "count", name: "Bills" }]}
        categoryColors={[growth, mint, warning, danger, purple]}
        insight="Most of the backlog is over a year old — a one-time historical cleanup, not a faster ongoing process."
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-consumption-records",
      0,
      16,
      12,
      6,
      <DataTableCard
        title="Customer Consumption Records"
        subtitle="Client · Meter · Location · From/To · Amount"
        columns={BILL_COLUMNS}
        data={BILL_ROWS}
        getRowKey={(r) => r.client}
        className="h-full overflow-auto"
      />
    ),
  ];

  const calcItems = [
    gridItem(
      "ut-calc",
      0,
      0,
      12,
      5,
      <DataTableCard
        title="Meter reading calculations"
        subtitle="How a raw reading becomes a billed amount · one record configured"
        columns={CALC_COLUMNS}
        data={[{ client: "GoPhygital", meter: "12", factor: "0.0000562235", rate: "₹12", actual: "213,434", total: "12", amount: "₹144" }]}
        getRowKey={(r) => r.client}
        insight="The adjustment factor turns 213,434 units into a 12-unit billed consumption."
        className="h-full overflow-auto"
      />
    ),
  ];

  const evItems = [
    gridItem(
      "ut-ev",
      0,
      0,
      12,
      5,
      <StatListCard
        title="EV Charging"
        subtitle="8 transactions logged, all showing zero consumption"
        className="h-full overflow-auto"
        rows={[
          { label: "Units Consumed", badge: { tone: "grey", label: "0.00" } },
          { label: "Tariff / Tax / Amount", badge: { tone: "grey", label: "All ₹0.00" } },
          { label: "EV Module Status", badge: { tone: "grey", label: "Dormant" } },
        ]}
        note="HVAC monitoring is also not configured."
      />
    ),
  ];

  const solarItems = [
    gridItem(
      "ut-solar-trend",
      0,
      0,
      7,
      6,
      <BarChartCard
        title="Solar Generation Trend"
        subtitle="Data stale — last record Feb 2025"
        data={[
          { month: "Oct", units: 420 },
          { month: "Nov", units: 380 },
          { month: "Dec", units: 310 },
          { month: "Jan", units: 260 },
          { month: "Feb", units: 90 },
        ]}
        categoryKey="month"
        series={[{ dataKey: "units", name: "Units" }]}
        seriesColors={[warning]}
        insight="DATA STALE — 16 MONTHS. Action required before this series can be trusted."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
    gridItem(
      "ut-solar-predeath",
      7,
      0,
      5,
      6,
      <BarChartCard
        title="Last two days before it went dark"
        subtitle="23–24 Feb 2025"
        data={[
          { day: "23 AM", units: 121575 },
          { day: "23 PM", units: 403651 },
          { day: "24", units: 85864 },
        ]}
        categoryKey="day"
        series={[{ dataKey: "units", name: "Units" }]}
        categoryColors={[danger, warning, purple]}
        insight="Swings this large are not a stable reading that simply stopped. The sensor was already lying."
        insightTone="error"
        className="h-full overflow-auto"
      />
    ),
  ];

  return (
    <div className="space-y-6">
      <ModuleSection id="Energy" storageKey="utilityEnergyGrid" moduleKey="utility" subTab="Energy" items={energyItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Water" storageKey="utilityWaterGrid" moduleKey="utility" subTab="Water" items={waterItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="STP" storageKey="utilityStpGrid" moduleKey="utility" subTab="STP" items={stpItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Daily Readings" storageKey="utilityReadingsGrid" moduleKey="utility" subTab="Daily Readings" items={readingsItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Utility Request" storageKey="utilityRequestGrid" moduleKey="utility" subTab="Utility Request" items={requestItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Utility Consumption" storageKey="utilityCalcGrid" moduleKey="utility" subTab="Utility Consumption" items={calcItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="EV Consumption" storageKey="utilityEvGrid" moduleKey="utility" subTab="EV Consumption" items={evItems} visibleKeys={visibleKeys} registerRef={registerRef} />
      <ModuleSection id="Solar Generator" storageKey="utilitySolarGrid" moduleKey="utility" subTab="Solar Generator" items={solarItems} visibleKeys={visibleKeys} registerRef={registerRef} />
    </div>
  );
}
