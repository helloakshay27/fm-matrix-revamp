import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import {
  StatHeroCard,
  PieChartCard,
  BarChartCard,
  DataTableCard,
  TableBadge,
  StatListCard,
  ProgressListCard,
  type DataTableColumn,
  type TableBadgeTone,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";

// The Finance module isn't wired to a live dashboard API yet — layout and
// figures below mirror the fm_matrix_phase10 (Phase 9B) mockup's Finance tab
// (Overview/Procurement/Invoices/KPIs/GDN/Wallet) as illustrative content
// until a real endpoint exists. Colors are the same brand tokens already used
// by Maintenance/Safety charts elsewhere in this app (#DA7756 terra, #B8694A
// terra-dk, #798C5E sage, #9EC8BA teal, #CECBF6 lavender, #EDC488 warning,
// #6B9BCC info, #108C72 success) — no new hex values introduced. Red/error
// tones are intentionally avoided throughout this module; the most-urgent
// tier uses the deeper terra-dk orange instead of red.

const FINANCE_ALERTS = ["~950 Utility Bills Pending", "2 Invoices >90 Days", "WO / Service PR API Errors"];

// Same ANALYTICS_PALETTE indices Maintenance's own age-tier bars (e.g.
// "Resolved/Unresolved tickets by age tier" in RevampDashboardPage.tsx) draw
// from — teal → warning yellow → terra → sage, ageing least→most severe.
const INVOICE_AGEING_COLORS = [ANALYTICS_PALETTE[2], ANALYTICS_PALETTE[4], ANALYTICS_PALETTE[0], ANALYTICS_PALETTE[1]];

interface KpiStatusRow {
  kpi: string;
  status: string;
  tone: TableBadgeTone;
}

const PO_WO_STATUS_ROWS: KpiStatusRow[] = [
  { kpi: "PO/WO Completion Rate, Avg Processing Time", status: "Blocked — WO Module down", tone: "terra" },
  { kpi: "Vendor/Team Performance, SLA Compliance %", status: "Blocked — WO Module down", tone: "terra" },
  { kpi: "Goods vs Service Receipt Ratio, Vendor Fulfillment", status: "Blocked — Service PR Module down", tone: "terra" },
  { kpi: "GRN Pending / Blocked count", status: "5 Blocked GRNs — already tracked in queue below", tone: "amber" },
];

const KPI_STATUS_COLUMNS: DataTableColumn<KpiStatusRow>[] = [
  { key: "kpi", header: "KPI", render: (row) => row.kpi },
  { key: "status", header: "Status", render: (row) => <TableBadge tone={row.tone}>{row.status}</TableBadge> },
];

interface ApprovalQueueRow {
  id: string;
  type: "GRN" | "Material PR";
  supplier: string;
}

const APPROVAL_QUEUE_ROWS: ApprovalQueueRow[] = [
  { id: "ID 6172", type: "GRN", supplier: "PowerTech Metering Solutions" },
  { id: "ID 6171", type: "GRN", supplier: "PowerTech Metering Solutions" },
  { id: "PR 123547", type: "Material PR", supplier: "PowerTech Metering · Technical" },
  { id: "PR 123546", type: "Material PR", supplier: "PowerTech Metering · Technical" },
  { id: "PR 123545", type: "Material PR", supplier: "PowerTech Metering · Technical" },
];

const APPROVAL_TYPE_STYLE: Record<ApprovalQueueRow["type"], React.CSSProperties> = {
  GRN: { backgroundColor: "#6B9BCC20", color: "#2a5f8f" },
  "Material PR": { backgroundColor: "#798C5E20", color: "#798C5E" },
};

interface PendingFinancialRecordRow {
  id: string;
  prNo: string;
  refNo: string;
  supplier: string;
  pendingWith: string;
  raisedOn: string;
  amount: string;
}

const PENDING_FINANCIAL_RECORD_ROWS: PendingFinancialRecordRow[] = [
  { id: "10251", prNo: "100117", refNo: "123553", supplier: "PowerTech Metering Solutions", pendingWith: "Abhishek Sharma", raisedOn: "17-03-2026", amount: "₹2,750" },
  { id: "10257", prNo: "100119", refNo: "123555", supplier: "PowerTech Metering Solutions", pendingWith: "—", raisedOn: "11-05-2026", amount: "₹1,100" },
];

const PENDING_FINANCIAL_RECORD_COLUMNS: DataTableColumn<PendingFinancialRecordRow>[] = [
  { key: "id", header: "ID", render: (row) => <span className="font-semibold text-brand-text">{row.id}</span> },
  { key: "prNo", header: "PR No.", render: (row) => row.prNo },
  { key: "refNo", header: "Reference No.", render: (row) => row.refNo },
  { key: "supplier", header: "Supplier", render: (row) => row.supplier },
  { key: "pendingWith", header: "Pending With", render: (row) => row.pendingWith },
  { key: "status", header: "Status", render: () => <TableBadge tone="amber">Pending</TableBadge> },
  { key: "raisedOn", header: "Raised On", render: (row) => row.raisedOn },
  { key: "amount", header: "Amount", render: (row) => row.amount },
];

interface FinancePanelProps {
  activeSection: string;
}

export function FinancePanel({ activeSection }: FinancePanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  // --- Overview ---
  const overviewItems: SafetyGridItem[] = [
    {
      key: "fin-pending-approvals",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Pending Approvals"
          value="15+"
          accent="error"
          subtitle="GRN + Material PR · Your queue"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-overdue-invoices",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Overdue Invoices"
          value="2"
          accent="error"
          subtitle="Over 90 days · Immediate action"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-draft-prs",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Draft PRs"
          value="130+"
          accent="warning"
          subtitle="Not submitted · Oldest: May 2026"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-blocked-grns",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Blocked GRNs"
          value="5"
          accent="warning"
          subtitle="Pending approval · PowerTech"
          className="h-full"
        />
      ),
    },
  ];

  // --- Procurement ---
  const procurementItems: SafetyGridItem[] = [
    {
      key: "fin-proc-pipeline",
      layout: { x: 0, y: 0, w: 6, h: 7, minW: 4, minH: 5 },
      content: (
        <BarChartCard
          title="Procurement Pipeline"
          subtitle="Material PR → PO  |  Service PR → WO · where is it stuck?"
          data={[
            { stage: "Material PR → PO", Requested: 9, Approved: 5, Pending: 3, Rejected: 1 },
            { stage: "Service PR → WO", Requested: 12, Approved: 4, Pending: 6, Rejected: 2 },
          ]}
          categoryKey="stage"
          orientation="horizontal"
          stacked
          series={[
            { dataKey: "Requested", name: "Requested" },
            { dataKey: "Approved", name: "Approved" },
            { dataKey: "Pending", name: "Pending" },
            { dataKey: "Rejected", name: "Rejected" },
          ]}
          className="h-full"
        />
      ),
    },
    {
      key: "fin-vendor-risk",
      layout: { x: 6, y: 0, w: 6, h: 7, minW: 4, minH: 5 },
      content: (
        <PieChartCard
          title="Vendor Payment Concentration Risk"
          subtitle="Share of approval-queue spend by vendor — a financial concern, distinct from Maintenance's vendor performance tracking"
          data={[
            { name: "PowerTech", value: 42 },
            { name: "Connexions", value: 18 },
            { name: "Others (48)", value: 28 },
            { name: "Unicorn", value: 12 },
          ]}
          centerLabel="100"
          showInfoIcon
          className="h-full"
        />
      ),
    },
    {
      key: "fin-pr-sr-split",
      layout: { x: 0, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="PR vs SR Split"
          value="68 / 77"
          accent="neutral"
          subtitle="Material PR vs Service Requisition — real split, not one combined funnel"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-pending-value",
      layout: { x: 3, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Pending Requisition Value"
          value="₹18.4L"
          accent="warning"
          subtitle="₹ tied up, not just item counts"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-budget-util",
      layout: { x: 6, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Budget Utilization %"
          value="94%"
          accent="error"
          subtitle="Of allocated procurement budget, this period"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-procurement-score",
      layout: { x: 9, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="⭐ Procurement Efficiency Score"
          value="44/100"
          accent="warning"
          subtitle="Composite: approval speed, budget discipline, PR-to-PO conversion"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-requisitions-by-dept",
      layout: { x: 0, y: 10, w: 12, h: 5, minW: 6, minH: 4 },
      content: (
        <ProgressListCard
          title="Requisitions by Department / Site"
          subtitle="Where procurement demand is concentrated"
          sections={[
            {
              rows: [
                { label: "Facilities", value: "76", percent: 52, color: "#DA7756" },
                { label: "IT", value: "45", percent: 31, color: "#6B9BCC" },
                { label: "Admin", value: "24", percent: 17, color: "#798C5E" },
              ],
            },
          ]}
          className="h-full"
        />
      ),
    },
    {
      key: "fin-po-wo-status",
      layout: { x: 0, y: 15, w: 12, h: 7, minW: 6, minH: 5 },
      content: (
        <DataTableCard
          title="PO/WO & GRN/SES metrics — mostly blocked"
          subtitle="The WO Module and Service PR Module are already confirmed returning API 500 errors above"
          columns={KPI_STATUS_COLUMNS}
          data={PO_WO_STATUS_ROWS}
          getRowKey={(row) => row.kpi}
          insight="Building confident-looking performance numbers for a system we've already told you is broken would be dishonest — these stay blocked until the underlying API errors are fixed, not filled with invented figures."
          className="h-full no-drag"
        />
      ),
    },
  ];

  // --- Invoices ---
  const invoicesItems: SafetyGridItem[] = [
    {
      key: "fin-invoice-ageing",
      layout: { x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <BarChartCard
          title="Invoice Ageing"
          subtitle="Days outstanding — what is overdue?"
          data={[
            { bucket: "<30d", count: 5 },
            { bucket: "30–60d", count: 3 },
            { bucket: "60–90d", count: 2 },
            { bucket: ">90d", count: 2 },
          ]}
          categoryKey="bucket"
          series={[{ dataKey: "count", name: "Invoices" }]}
          categoryColors={INVOICE_AGEING_COLORS}
          showInfoIcon
          className="h-full"
        />
      ),
    },
    {
      key: "fin-invoice-ageing-summary",
      layout: { x: 6, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <ProgressListCard
          title="Invoice Ageing Summary"
          subtitle="Overdue breakdown · escalation status"
          sections={[
            {
              rows: [
                { label: "< 30 days", value: "5", percent: 50, color: INVOICE_AGEING_COLORS[0] },
                { label: "30–60 days", value: "3", percent: 30, color: INVOICE_AGEING_COLORS[1] },
                { label: "60–90 days", value: "2", percent: 20, color: INVOICE_AGEING_COLORS[2] },
                { label: "> 90 days", value: "2 · Escalate", percent: 20, color: INVOICE_AGEING_COLORS[3] },
              ],
            },
          ]}
          footnote="Amount figures pending DB confirmation · Akshay Shinde to map invoice_amount column"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-invoices-over-90",
      layout: { x: 0, y: 6, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        <StatListCard
          title="Invoices over 90 days — named"
          subtitle='"Escalate" now has a vendor attached, not just a count of 2'
          rows={[
            { label: "PowerTech Metering Solutions · Invoice 7741", badge: { tone: "terra", label: "104 days" } },
            { label: "Connexions Facility Mgmt · Invoice 7702", badge: { tone: "terra", label: "97 days" } },
          ]}
          className="h-full"
        />
      ),
    },
    {
      key: "fin-system-health",
      layout: { x: 0, y: 10, w: 12, h: 2, minW: 6, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light h-full">
          <span className="flex-shrink-0">⚙</span>
          <span>
            <strong className="text-brand-text font-semibold">System Health:</strong> WO Module + Service PR Module
            returning API 500 errors — flagged to application support team
          </span>
        </div>
      ),
    },
    {
      key: "fin-approval-queue",
      layout: { x: 0, y: 12, w: 12, h: 7, minW: 6, minH: 5 },
      content: (
        <Card className="border-brand-border h-full overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-body-3 font-semibold text-brand-text">Your Approval Queue</CardTitle>
            <p className="text-brand-body-5 text-brand-text-light">Items at Site Incharge level — act today</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {APPROVAL_QUEUE_ROWS.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-lg border border-brand-border px-3 py-2"
                >
                  <span
                    className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={APPROVAL_TYPE_STYLE[row.type]}
                  >
                    {row.type}
                  </span>
                  <div>
                    <div className="text-brand-body-4 font-semibold text-brand-text">{row.id}</div>
                    <div className="text-brand-body-5 text-brand-text-light">{row.supplier}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      key: "fin-pending-financial-records",
      layout: { x: 0, y: 19, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <DataTableCard
          title="Top Pending Financial Records"
          subtitle="Pending status only · Sorted by oldest first — click row to drill and act"
          columns={PENDING_FINANCIAL_RECORD_COLUMNS}
          data={PENDING_FINANCIAL_RECORD_ROWS}
          getRowKey={(row) => row.id}
          className="h-full no-drag"
        />
      ),
    },
  ];

  // --- KPIs ---
  const kpisItems: SafetyGridItem[] = [
    {
      key: "fin-opex",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Monthly OPEX" value="₹14.2L" accent="neutral" subtitle="Current month spend" className="h-full" />
      ),
    },
    {
      key: "fin-capex",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Annual CAPEX" value="₹32L" accent="neutral" subtitle="FY 2026–27 allocation" className="h-full" />
      ),
    },
    {
      key: "fin-budget-utilization",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Budget Utilization"
          value="94%"
          accent="success"
          progress={94}
          subtitle="On track · 6% remaining"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-pending-invoices",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Pending Invoices" value="₹8.4L" accent="error" subtitle="Awaiting approval" className="h-full" />
      ),
    },
    {
      key: "fin-utility-cost",
      layout: { x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Utility Cost" value="₹2.7L" accent="warning" subtitle="Electricity + DG this month" className="h-full" />
      ),
    },
    {
      key: "fin-vendor-payments-due",
      layout: { x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Vendor Payments Due" value="₹6.2L" accent="warning" subtitle="Outstanding to vendors" className="h-full" />
      ),
    },
    {
      key: "fin-maintenance-cost-ratio",
      layout: { x: 6, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="peach" label="Maintenance Cost Ratio" value="3:1" accent="success" subtitle="Planned vs reactive spend" className="h-full" />
      ),
    },
    {
      key: "fin-procurement-spend",
      layout: { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Procurement Spend" value="₹3.2L" accent="neutral" subtitle="Approved PRs this month" className="h-full" />
      ),
    },
    {
      key: "fin-cost-savings",
      layout: { x: 0, y: 6, w: 6, h: 3, minW: 3, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Cost Savings" value="₹1.6L" accent="success" subtitle="vs prior month" className="h-full" />
      ),
    },
    {
      key: "fin-risk-score",
      layout: { x: 6, y: 6, w: 6, h: 3, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Financial Risk Score"
          value="78%"
          accent="warning"
          progress={78}
          subtitle="Billing backlog primary driver"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-risk-driver",
      layout: { x: 0, y: 9, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <BarChartCard
          title="What is driving the 78% financial risk score"
          subtitle="Connects the risk score to the billing-backlog alert"
          data={[
            { driver: "Billing backlog", pts: 48 },
            { driver: "Vendor non-compliance", pts: 16 },
            { driver: "Invoice ageing", pts: 9 },
            { driver: "Other", pts: 5 },
          ]}
          categoryKey="driver"
          orientation="horizontal"
          categoryColors={[ANALYTICS_PALETTE[0], ANALYTICS_PALETTE[4], ANALYTICS_PALETTE[4], ANALYTICS_PALETTE[1]]}
          series={[{ dataKey: "pts", name: "Points" }]}
          labelFormatter={(value) => `${value} of 78`}
          insight="Billing backlog alone accounts for most of the financial risk score. The ~950 pending utility bills and this 78% number are the same root cause — fixing one fixes most of the other."
          insightVariant="plain"
          className="h-full"
        />
      ),
    },
  ];

  // --- GDN ---
  const gdnItems: SafetyGridItem[] = [
    {
      key: "fin-gdn-label",
      layout: { x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1 border-b border-brand-border">
          GDN — Goods Dispatch Notes
        </div>
      ),
    },
    {
      key: "fin-gdn-dispatched",
      layout: { x: 0, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Dispatched" value="5" accent="success" subtitle="Goods dispatched from site" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-approved",
      layout: { x: 3, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Approved" value="3" accent="success" subtitle="GDN approved by SI" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-pending",
      layout: { x: 6, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="peach" label="Pending" value="1" accent="warning" subtitle="Awaiting approval" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-rejected",
      layout: { x: 9, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Rejected" value="3" accent="error" subtitle="Requires re-submission" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-bill-info",
      layout: { x: 0, y: 4, w: 12, h: 2, minW: 6, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <div className="flex items-center gap-2 rounded-lg border border-brand-warning bg-brand-warning-light px-3 py-2 text-brand-body-5 text-[#8A5A00] h-full">
          <span className="flex-shrink-0">⚠</span>
          <span>
            <strong className="font-semibold">Bill Information:</strong> Invoice amounts pending DB mapping · Akshay
            Shinde to confirm <code>invoice_amount</code> column · Finance Risk Score based on billing backlog volume
            (950 records)
          </span>
        </div>
      ),
    },
  ];

  // --- Wallet ---
  const walletItems: SafetyGridItem[] = [
    {
      key: "fin-wallet-label",
      layout: { x: 0, y: 0, w: 12, h: 1, minW: 6, minH: 1, isResizable: false, isDraggable: false },
      content: (
        <div className="text-brand-caption font-bold text-brand-text-light uppercase tracking-wide pb-1 border-b border-brand-border">
          Wallet — Tenant Financial Transactions
        </div>
      ),
    },
    {
      key: "fin-wallet-users",
      layout: { x: 0, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Wallet Users" value="21" accent="success" subtitle="Active wallet accounts" className="h-full" />
      ),
    },
    {
      key: "fin-wallet-balance",
      layout: { x: 3, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Total Wallet Balance"
          value="1,158 pts"
          accent="success"
          subtitle="Reconciled · HSBC 1,000 + others"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-loyalty-points",
      layout: { x: 6, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Loyalty Points Available"
          value="99,500 pts"
          accent="warning"
          subtitle="Silver tier · 500 pts from Gold"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-points-redeemed",
      layout: { x: 9, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Points Redeemed"
          value="0%"
          accent="error"
          subtitle="Not communicated to tenants"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-wallet-by-tenant",
      layout: { x: 0, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <ProgressListCard
          title="Wallet Balance by Tenant"
          subtitle="Confirmed real data ✓"
          sections={[
            {
              rows: [
                { label: "HSBC", value: "1,000 pts", percent: 86, color: "#108C72" },
                { label: "Lockated", value: "101 pts", percent: 9, color: "#6B9BCC" },
                { label: "Vinayak", value: "57 pts", percent: 5, color: "#9EC8BA" },
              ],
            },
          ]}
          className="h-full"
        />
      ),
    },
    {
      key: "fin-wallet-action",
      layout: { x: 6, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <Card className="border-brand-border h-full overflow-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-brand-body-3 font-semibold text-brand-text">Wallet Action Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-brand-light p-3 mb-3">
              <div className="text-brand-body-5 font-semibold text-brand">0% redemption rate — awareness gap</div>
              <p className="text-brand-body-5 text-brand-text mt-1 leading-relaxed">
                99,500 points sitting idle. Tenants are unaware of their wallet balance. Send a broadcast to all 21
                wallet users.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-brand-body-5">
                <span className="text-brand-text">Action</span>
                <TableBadge tone="amber">Send Broadcast via CRM</TableBadge>
              </div>
              <div className="flex items-center justify-between text-brand-body-5">
                <span className="text-brand-text">Points to Gold Tier</span>
                <TableBadge tone="amber">500 pts remaining</TableBadge>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Finance Alerts strip */}
      <div className="rounded-lg bg-brand-light px-5 py-4">
        <div className="flex items-center gap-2 text-brand-body-5 font-bold uppercase tracking-wide text-brand mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          Finance Alerts
        </div>
        <div className="flex flex-wrap gap-2">
          {FINANCE_ALERTS.map((alert) => (
            <span
              key={alert}
              className="rounded-full bg-white px-3 py-1.5 text-brand-body-5 font-semibold text-brand border border-brand/40"
            >
              {alert}
            </span>
          ))}
        </div>
      </div>

      <div ref={registerRef("Overview")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeOverviewGridLayout" items={overviewItems} />
      </div>

      <div ref={registerRef("Procurement")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeProcurementGridLayout" items={procurementItems} />
      </div>

      <div ref={registerRef("Invoices")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeInvoicesGridLayout" items={invoicesItems} />
      </div>

      <div ref={registerRef("KPIs")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeKpisGridLayout" items={kpisItems} />
      </div>

      <div ref={registerRef("GDN")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeGdnGridLayout" items={gdnItems} />
      </div>

      <div ref={registerRef("Wallet")} className="scroll-mt-24">
        <SafetyGridSection storageKey="financeWalletGridLayout" items={walletItems} />
      </div>
    </div>
  );
}
