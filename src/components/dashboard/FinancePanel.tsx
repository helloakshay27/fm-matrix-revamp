import { useEffect, useRef, useMemo } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import type { FinanceDashboardData } from "@/hooks/useFmDashboardData";

// Finance module — dynamically binds the 8 live finance endpoints with tolerant readers
// and clean fallback/empty states across Overview, Procurement, Invoices, KPIs, GDN, and Wallet tabs.
// #B8694A terra-dk, #798C5E sage, #9EC8BA teal, #CECBF6 lavender, #EDC488
// warning, #6B9BCC info, #108C72 success) — no new hex values introduced.
// Red/error tones are intentionally avoided throughout this module; the
// most-urgent tier uses the deeper terra-dk orange instead of red.

/** Small placeholder for a widget whose backing field the finance dashboard API doesn't provide (yet) or returned empty. */
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
    <Card className={cn("border-brand-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-brand-body-3 font-semibold text-brand-text">{title}</CardTitle>
        {subtitle && <p className="text-brand-body-5 text-brand-text-light">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-brand-body-5 text-brand-text-light">{message}</p>
      </CardContent>
    </Card>
  );
}

// --- Tolerant readers for the not-yet-confirmed Finance API shape ---
type FinanceRow = Record<string, unknown>;
type FinanceValue = FinanceRow | FinanceRow[] | null | undefined;

function financeArray(value: FinanceValue): FinanceRow[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    for (const key of ["items", "data", "records", "invoices", "queue", "rows"]) {
      const nested = (value as FinanceRow)[key];
      if (Array.isArray(nested)) return nested as FinanceRow[];
    }
  }
  return [];
}

function financeNumber(value: FinanceValue, keys: string[]): number | null {
  if (!value || Array.isArray(value)) return null;
  for (const key of keys) {
    const v = (value as FinanceRow)[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  }
  return null;
}

function financeString(row: FinanceRow | undefined, keys: string[]): string | null {
  if (!row) return null;
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim() !== "") return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function financeStageRow(value: FinanceValue, stageKeys: string[], label: string) {
  if (!value || Array.isArray(value)) return null;
  let stage: FinanceRow | undefined;
  for (const key of stageKeys) {
    const v = (value as FinanceRow)[key];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      stage = v as FinanceRow;
      break;
    }
  }
  if (!stage) return null;
  const requested = financeNumber(stage, ["requested", "total"]);
  const approved = financeNumber(stage, ["approved"]);
  const pending = financeNumber(stage, ["pending"]);
  const rejected = financeNumber(stage, ["rejected"]);
  if (requested == null && approved == null && pending == null && rejected == null) return null;
  return { stage: label, Requested: requested ?? 0, Approved: approved ?? 0, Pending: pending ?? 0, Rejected: rejected ?? 0 };
}

// Heuristic: assume a raw number >= 1,00,000 is plain rupees (convert to Lakhs); anything
// smaller is assumed to already be expressed in Lakhs. Unconfirmed against a live response.
function formatFinanceLakhs(value: number | null): string | null {
  if (value == null) return null;
  return value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${value.toFixed(1)}L`;
}

function formatFinanceInr(raw: unknown): string {
  if (raw == null) return "—";
  const num = typeof raw === "number" ? raw : Number(raw);
  if (Number.isNaN(num)) return typeof raw === "string" && raw.trim() !== "" ? raw : "—";
  return `₹${num.toLocaleString("en-IN")}`;
}

function financeApprovalRow(row: FinanceRow, idx: number): ApprovalQueueRow {
  const rawType = financeString(row, ["type", "record_type", "category"]) ?? "";
  const isGrn = /grn/i.test(rawType);
  const type: ApprovalQueueRow["type"] = isGrn ? "GRN" : "Material PR";
  const rawId = financeString(row, ["id", "reference", "ref_no", "pr_no", "grn_no"]) ?? String(idx + 1);
  const id = /^(id|pr|grn)\s/i.test(rawId) ? rawId : `${isGrn ? "ID" : "PR"} ${rawId}`;
  const supplier = financeString(row, ["supplier", "vendor_name", "supplier_name"]) ?? "—";
  return { id, type, supplier };
}

function financeTopPendingRow(row: FinanceRow, idx: number): PendingFinancialRecordRow {
  return {
    id: financeString(row, ["id"]) ?? String(idx + 1),
    prNo: financeString(row, ["pr_no", "pr_number"]) ?? "—",
    refNo: financeString(row, ["ref_no", "reference_no", "reference"]) ?? "—",
    supplier: financeString(row, ["supplier", "vendor_name", "supplier_name"]) ?? "—",
    pendingWith: financeString(row, ["pending_with", "assigned_to"]) ?? "—",
    raisedOn: financeString(row, ["raised_on", "created_at", "raised_date"]) ?? "—",
    amount: formatFinanceInr(row["amount"] ?? row["value"]),
  };
}

function financeOverdueInvoiceRow(row: FinanceRow) {
  const vendor = financeString(row, ["vendor_name", "supplier_name", "supplier"]) ?? "Unknown vendor";
  const invoiceRef = financeString(row, ["invoice_number", "invoice_id", "reference"]);
  const days = financeNumber(row, ["days_overdue", "days", "age_days"]);
  return {
    label: invoiceRef ? `${vendor} · Invoice ${invoiceRef}` : vendor,
    badge: { tone: "terra" as const, label: typeof days === "number" ? `${days} days` : "Overdue" },
  };
}

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
  /** Live data for the 8 confirmed Finance endpoints — null until loaded or if the dashboard's site scope isn't resolved yet. */
  data?: FinanceDashboardData | null;
  loading?: boolean;
  /** When set, renders only the cards the user has saved to My Dashboard, across all sections. */
  visibleKeys?: Set<string>;
}

export function FinancePanel({ activeSection, data, loading = false, visibleKeys }: FinancePanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  const loadingLabel = loading ? "Loading…" : "—";

  // --- Live Finance data, read tolerantly (see fmDashboardAPI.ts's Finance section) ---
  const pendingApprovalsCount = financeNumber(data?.pendingApprovals, [
    "total",
    "count",
    "pending_approvals_count",
  ]);

  const draftPrsCount = financeNumber(data?.draftPrs, ["total", "count", "draft_prs_count"]);
  const draftPrsOldest = financeString(Array.isArray(data?.draftPrs) ? undefined : (data?.draftPrs as FinanceRow | undefined), [
    "oldest_date",
    "oldest_created_at",
    "oldest_pr_date",
  ]);

  const pendingValueAmount = formatFinanceLakhs(
    financeNumber(data?.pendingValue, ["total_value", "value", "amount", "pending_value"])
  );

  const prSrRow = Array.isArray(data?.prSrSplit) ? undefined : (data?.prSrSplit as FinanceRow | undefined);
  const materialPrCount = financeNumber(prSrRow, ["material_pr_count", "pr_count", "material_pr", "pr"]);
  const serviceReqCount = financeNumber(prSrRow, ["service_requisition_count", "sr_count", "service_requisition", "sr"]);

  const overdueInvoiceRows = financeArray(data?.overdueInvoices);
  const overdueInvoicesCount =
    financeNumber(Array.isArray(data?.overdueInvoices) ? undefined : (data?.overdueInvoices as FinanceRow | undefined), [
      "count",
      "total",
    ]) ?? (overdueInvoiceRows.length || null);

  const approvalQueueLiveRows = financeArray(data?.approvalQueue).map(financeApprovalRow);
  const topPendingLiveRows = financeArray(data?.topPendingRecords).map(financeTopPendingRow);

  const blockedGrnsCount =
    approvalQueueLiveRows.filter((r) => r.type === "GRN").length ||
    financeNumber(data?.pendingApprovals, ["blocked_grns", "grn_count", "blocked_grns_count"]);

  const vendorRiskData = useMemo(() => {
    const counts: Record<string, number> = {};
    topPendingLiveRows.forEach((r) => {
      if (r.supplier && r.supplier !== "—") {
        counts[r.supplier] = (counts[r.supplier] || 0) + 1;
      }
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, c]) => sum + c, 0);
    if (total === 0) return [];
    return entries.slice(0, 4).map(([name, val]) => ({
      name,
      value: Math.round((val / total) * 100),
    }));
  }, [topPendingLiveRows]);

  const pipelineLiveData = [
    financeStageRow(data?.procurementPipeline, ["material_pr_to_po", "material_pr", "pr_to_po"], "Material PR → PO"),
    financeStageRow(data?.procurementPipeline, ["service_pr_to_wo", "service_pr", "pr_to_wo"], "Service PR → WO"),
  ].filter((row): row is NonNullable<typeof row> => row !== null);

  const liveBudgetUtil = financeNumber(data?.procurementPipeline, ["budget_utilization", "utilization_percent", "budget_util"]);
  const liveProcScore = financeNumber(data?.procurementPipeline, ["procurement_score", "score", "efficiency_score"]);

  const invoiceAgeingData = useMemo(() => {
    if (overdueInvoiceRows.length === 0) return [];
    let less30 = 0;
    let b30_60 = 0;
    let b60_90 = 0;
    let over90 = 0;
    overdueInvoiceRows.forEach((row) => {
      const days = financeNumber(row, ["days_overdue", "days", "age_days"]) ?? 0;
      if (days < 30) less30++;
      else if (days <= 60) b30_60++;
      else if (days <= 90) b60_90++;
      else over90++;
    });
    const total = overdueInvoiceRows.length || 1;
    return [
      { bucket: "<30d", label: "< 30 days", count: less30, percent: Math.round((less30 / total) * 100), color: INVOICE_AGEING_COLORS[0] },
      { bucket: "30–60d", label: "30–60 days", count: b30_60, percent: Math.round((b30_60 / total) * 100), color: INVOICE_AGEING_COLORS[1] },
      { bucket: "60–90d", label: "60–90 days", count: b60_90, percent: Math.round((b60_90 / total) * 100), color: INVOICE_AGEING_COLORS[2] },
      { bucket: ">90d", label: "> 90 days", count: over90, percent: Math.round((over90 / total) * 100), color: INVOICE_AGEING_COLORS[3] },
    ];
  }, [overdueInvoiceRows]);

  const requisitionsByDeptRows = useMemo(() => {
    const raw = financeArray(data?.pendingValue);
    if (raw.length === 0) return [];
    const colors = ["#DA7756", "#6B9BCC", "#798C5E", "#CECBF6"];
    return raw.map((r, idx) => ({
      label: String(r["department"] || r["dept"] || r["name"] || `Dept ${idx + 1}`),
      value: String(r["count"] || r["total"] || r["value"] || 0),
      percent: Number(r["percent"] || r["percentage"] || 0),
      color: colors[idx % colors.length],
    }));
  }, [data?.pendingValue]);

  // --- Overview ---
  const overviewItems: SafetyGridItem[] = [
    {
      key: "fin-pending-approvals",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Pending Approvals"
          value={pendingApprovalsCount != null ? String(pendingApprovalsCount) : loadingLabel}
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
          value={overdueInvoicesCount != null ? String(overdueInvoicesCount) : loadingLabel}
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
          value={draftPrsCount != null ? String(draftPrsCount) : loadingLabel}
          accent="warning"
          subtitle={draftPrsOldest ? `Not submitted · Oldest: ${draftPrsOldest}` : "Not submitted"}
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
          value={blockedGrnsCount != null ? String(blockedGrnsCount) : loadingLabel}
          accent="warning"
          subtitle={blockedGrnsCount != null ? "Pending approval in queue" : "Awaiting approval"}
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
          data={
            pipelineLiveData.length
              ? pipelineLiveData
              : [
                  { stage: "Material PR → PO", Requested: 0, Approved: 0, Pending: 0, Rejected: 0 },
                  { stage: "Service PR → WO", Requested: 0, Approved: 0, Pending: 0, Rejected: 0 },
                ]
          }
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
        vendorRiskData.length > 0 ? (
          <PieChartCard
            title="Vendor Payment Concentration Risk"
            subtitle="Share of pending spend by vendor"
            data={vendorRiskData}
            centerLabel="100"
            showInfoIcon
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Vendor Payment Concentration Risk"
            subtitle="Share of pending spend by vendor"
            message={loading ? "Loading…" : "No vendor concentration data available for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "fin-pr-sr-split",
      layout: { x: 0, y: 7, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="PR vs SR Split"
          value={
            materialPrCount != null && serviceReqCount != null
              ? `${materialPrCount} / ${serviceReqCount}`
              : loadingLabel
          }
          accent="neutral"
          subtitle="Material PR vs Service Requisition"
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
          value={pendingValueAmount ?? loadingLabel}
          accent="warning"
          subtitle="Total pending requisition value"
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
          value={liveBudgetUtil != null ? `${liveBudgetUtil}%` : loadingLabel}
          accent="neutral"
          subtitle="Of allocated procurement budget"
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
          value={liveProcScore != null ? `${liveProcScore}/100` : loadingLabel}
          accent="neutral"
          subtitle="Composite procurement performance score"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-requisitions-by-dept",
      layout: { x: 0, y: 10, w: 12, h: 5, minW: 6, minH: 4 },
      content: (
        requisitionsByDeptRows.length > 0 ? (
          <ProgressListCard
            title="Requisitions by Department / Site"
            subtitle="Where procurement demand is concentrated"
            sections={[{ rows: requisitionsByDeptRows }]}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Requisitions by Department / Site"
            subtitle="Procurement demand distribution"
            message={loading ? "Loading…" : "No department requisition distribution data available for this period."}
            className="h-full"
          />
        )
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
        invoiceAgeingData.length > 0 ? (
          <BarChartCard
            title="Invoice Ageing"
            subtitle="Days outstanding — overdue distribution"
            data={invoiceAgeingData}
            categoryKey="bucket"
            series={[{ dataKey: "count", name: "Invoices" }]}
            categoryColors={INVOICE_AGEING_COLORS}
            showInfoIcon
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Invoice Ageing"
            subtitle="Days outstanding"
            message={loading ? "Loading…" : "No overdue invoices found for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "fin-invoice-ageing-summary",
      layout: { x: 6, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        invoiceAgeingData.length > 0 ? (
          <ProgressListCard
            title="Invoice Ageing Summary"
            subtitle="Overdue breakdown · escalation status"
            sections={[
              {
                rows: invoiceAgeingData.map((item) => ({
                  label: item.label,
                  value: String(item.count),
                  percent: item.percent,
                  color: item.color,
                })),
              },
            ]}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Invoice Ageing Summary"
            subtitle="Overdue breakdown"
            message={loading ? "Loading…" : "No overdue invoice summary for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "fin-invoices-over-90",
      layout: { x: 0, y: 6, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        overdueInvoiceRows.length ? (
          <StatListCard
            title="Invoices over 90 days — named"
            subtitle="Overdue invoices requiring immediate escalation"
            rows={overdueInvoiceRows.map(financeOverdueInvoiceRow)}
            className="h-full"
          />
        ) : (
          <EmptyStateCard
            title="Invoices over 90 days — named"
            subtitle="Overdue invoices"
            message={loading ? "Loading…" : "No invoices over 90 days for this period."}
            className="h-full"
          />
        )
      ),
    },
    {
      key: "fin-system-health",
      layout: { x: 0, y: 10, w: 12, h: 2, minW: 6, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light h-full">
          <span className="flex-shrink-0">⚙</span>
          <span>
            <strong className="text-brand-text font-semibold">System Health:</strong> Active integration status for Procurement & Invoices
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
            {approvalQueueLiveRows.length ? (
              <div className="space-y-2">
                {approvalQueueLiveRows.map((row, idx) => (
                  <div
                    key={`${row.id}-${idx}`}
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
            ) : (
              <p className="text-brand-body-5 text-brand-text-light">
                {loading ? "Loading…" : "No items in your approval queue for this period."}
              </p>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      key: "fin-pending-financial-records",
      layout: { x: 0, y: 19, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        topPendingLiveRows.length ? (
          <DataTableCard
            title="Top Pending Financial Records"
            subtitle="Pending status only · Sorted by oldest first — click row to drill and act"
            columns={PENDING_FINANCIAL_RECORD_COLUMNS}
            data={topPendingLiveRows}
            getRowKey={(row) => row.id}
            className="h-full no-drag"
          />
        ) : (
          <EmptyStateCard
            title="Top Pending Financial Records"
            subtitle="Pending status only · Sorted by oldest first — click row to drill and act"
            message={loading ? "Loading…" : "No pending financial records for this period."}
            className="h-full no-drag"
          />
        )
      ),
    },
  ];

  // --- KPIs ---
  const kpisItems: SafetyGridItem[] = [
    {
      key: "fin-opex",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Monthly OPEX" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="Current month spend" className="h-full" />
      ),
    },
    {
      key: "fin-capex",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Annual CAPEX" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="FY allocation" className="h-full" />
      ),
    },
    {
      key: "fin-budget-utilization",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Budget Utilization"
          value={liveBudgetUtil != null ? `${liveBudgetUtil}%` : loadingLabel}
          accent="neutral"
          subtitle="Of allocated procurement budget"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-pending-invoices",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Pending Invoices" value={overdueInvoicesCount != null ? String(overdueInvoicesCount) : loadingLabel} accent="error" subtitle="Awaiting approval" className="h-full" />
      ),
    },
    {
      key: "fin-utility-cost",
      layout: { x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Utility Cost" value={loading ? loadingLabel : "—"} accent="warning" subtitle="Electricity + DG this month" className="h-full" />
      ),
    },
    {
      key: "fin-vendor-payments-due",
      layout: { x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Vendor Payments Due" value={pendingValueAmount ?? loadingLabel} accent="warning" subtitle="Outstanding to vendors" className="h-full" />
      ),
    },
    {
      key: "fin-maintenance-cost-ratio",
      layout: { x: 6, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="peach" label="PR / SR Ratio" value={materialPrCount != null && serviceReqCount != null ? `${materialPrCount}:${serviceReqCount}` : loadingLabel} accent="neutral" subtitle="Material PR vs SR spend" className="h-full" />
      ),
    },
    {
      key: "fin-procurement-spend",
      layout: { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Procurement Spend" value={pendingValueAmount ?? loadingLabel} accent="neutral" subtitle="Pending PR value" className="h-full" />
      ),
    },
    {
      key: "fin-cost-savings",
      layout: { x: 0, y: 6, w: 6, h: 3, minW: 3, minH: 3 },
      content: (
        <StatHeroCard tone="purple" label="Procurement Score" value={liveProcScore != null ? `${liveProcScore}/100` : loadingLabel} accent="neutral" subtitle="Efficiency score" className="h-full" />
      ),
    },
    {
      key: "fin-risk-score",
      layout: { x: 6, y: 6, w: 6, h: 3, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Financial Approval Backlog"
          value={pendingApprovalsCount != null ? String(pendingApprovalsCount) : loadingLabel}
          accent="warning"
          subtitle="Pending approvals in queue"
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
        <StatHeroCard tone="purple" label="Dispatched" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="Goods dispatched from site" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-approved",
      layout: { x: 3, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="teal" label="Approved" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="GDN approved by SI" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-pending",
      layout: { x: 6, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="peach" label="Pending" value={loading ? loadingLabel : "—"} accent="warning" subtitle="Awaiting approval" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-rejected",
      layout: { x: 9, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard tone="blue" label="Rejected" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="Requires re-submission" className="h-full" />
      ),
    },
    {
      key: "fin-gdn-bill-info",
      layout: { x: 0, y: 4, w: 12, h: 2, minW: 6, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <div className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light h-full">
          <span className="flex-shrink-0">ℹ</span>
          <span>
            <strong className="font-semibold text-brand-text">GDN Records:</strong> Dispatch registers update in sync with procurement dispatches.
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
        <StatHeroCard tone="purple" label="Wallet Users" value={loading ? loadingLabel : "—"} accent="neutral" subtitle="Active wallet accounts" className="h-full" />
      ),
    },
    {
      key: "fin-wallet-balance",
      layout: { x: 3, y: 1, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Total Wallet Balance"
          value={loading ? loadingLabel : "—"}
          accent="neutral"
          subtitle="Reconciled wallet balance"
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
          value={loading ? loadingLabel : "—"}
          accent="neutral"
          subtitle="Available loyalty balance"
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
          value={loading ? loadingLabel : "—"}
          accent="neutral"
          subtitle="Redemption rate"
          className="h-full"
        />
      ),
    },
    {
      key: "fin-wallet-by-tenant",
      layout: { x: 0, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <EmptyStateCard
          title="Wallet Balance by Tenant"
          subtitle="Tenant wallet breakdown"
          message={loading ? "Loading…" : "No tenant wallet breakdown recorded for this period."}
          className="h-full"
        />
      ),
    },
    {
      key: "fin-wallet-action",
      layout: { x: 6, y: 4, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <EmptyStateCard
          title="Wallet Action Required"
          subtitle="Engagement & broadcast recommendations"
          message={loading ? "Loading…" : "No outstanding wallet actions required."}
          className="h-full"
        />
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
        <SafetyGridSection
          storageKey="financeOverviewGridLayout"
          items={overviewItems}
          moduleKey="finance"
          subTab="Overview"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Procurement")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="financeProcurementGridLayout"
          items={procurementItems}
          moduleKey="finance"
          subTab="Procurement"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Invoices")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="financeInvoicesGridLayout"
          items={invoicesItems}
          moduleKey="finance"
          subTab="Invoices"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("KPIs")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="financeKpisGridLayout"
          items={kpisItems}
          moduleKey="finance"
          subTab="KPIs"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("GDN")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="financeGdnGridLayout"
          items={gdnItems}
          moduleKey="finance"
          subTab="GDN"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Wallet")} className="scroll-mt-24">
        <SafetyGridSection
          storageKey="financeWalletGridLayout"
          items={walletItems}
          moduleKey="finance"
          subTab="Wallet"
          visibleKeys={visibleKeys}
        />
      </div>
    </div>
  );
}
