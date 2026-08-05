import { useEffect, useMemo, useRef, useState } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import {
  RefreshCw,
  Wrench,
  HardHat,
  Wallet,
  Users,
  Zap,
  Lock,
  Star,
  Store,
  Database,
  Settings as SettingsIcon,
  Calculator,
  ChevronLeft,
  CalendarDays,
  BarChart3,
  ChevronDown,
  RotateCcw,
  Lightbulb,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChartCard,
  BarChartCard,
  ComboBarLineChartCard,
  StatHeroCard,
  FilterPillBar,
  DataTableCard,
  TableBadge,
  TicketHeatmapCard,
  StatListCard,
  GaugeChartCard,
  HighlightStatCard,
  ScatterTimelineChartCard,
  AreaTrendChartCard,
  MultiAreaTrendChartCard,
  StatusSummaryCard,
  ProgressListCard,
  HourlyPatternChartCard,
  MultiLineTrendChartCard,
  type DataTableColumn,
  type TableBadgeTone,
} from "@/components/charts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { SafetyPanel } from "@/components/dashboard/SafetyPanel";

const ResponsiveGridLayout = WidthProvider(Responsive);
const TICKETS_GRID_STORAGE_KEY = "revampTicketsGridLayout-v2";

const DEFAULT_TICKETS_LAYOUT: GridLayout.Layout[] = [
  { i: "hero-sla", x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
  { i: "hero-customer", x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
  { i: "hero-internal", x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 3 },
  { i: "ticket-pool", x: 0, y: 3, w: 12, h: 7, minW: 4, minH: 4 },
  { i: "category-bar", x: 0, y: 10, w: 12, h: 7, minW: 4, minH: 4 },
  { i: "category-table", x: 0, y: 17, w: 12, h: 7, minW: 4, minH: 4 },
  { i: "reply-resolution", x: 0, y: 24, w: 6, h: 7, minW: 3, minH: 4 },
  { i: "sla-breach", x: 6, y: 24, w: 6, h: 7, minW: 3, minH: 4 },
  { i: "resolved-age", x: 0, y: 31, w: 6, h: 6, minW: 3, minH: 3 },
  { i: "unresolved-age", x: 6, y: 31, w: 6, h: 6, minW: 3, minH: 3 },
  { i: "ticket-heatmap", x: 0, y: 37, w: 12, h: 8, minW: 6, minH: 5 },
  { i: "tech-workload", x: 0, y: 45, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "golden-open", x: 0, y: 51, w: 3, h: 3, minW: 2, minH: 3 },
  { i: "redflag-open", x: 3, y: 51, w: 3, h: 3, minW: 2, minH: 3 },
  { i: "golden-age", x: 6, y: 51, w: 3, h: 3, minW: 2, minH: 3 },
  { i: "sitewide-age", x: 9, y: 51, w: 3, h: 3, minW: 2, minH: 3 },
  { i: "golden-redflag-chart", x: 0, y: 54, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "golden-aged-table", x: 0, y: 60, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "godrej-distress", x: 0, y: 65, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "by-user", x: 0, y: 69, w: 4, h: 5, minW: 3, minH: 4 },
  { i: "by-dept", x: 4, y: 69, w: 4, h: 5, minW: 3, minH: 4 },
  { i: "by-tenant", x: 8, y: 69, w: 4, h: 5, minW: 3, minH: 4 },
  { i: "location-volume", x: 0, y: 74, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "csat", x: 0, y: 79, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "escalation", x: 6, y: 79, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "source-origin", x: 0, y: 82, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "repeat-complaints", x: 0, y: 87, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "asset-linked-tickets", x: 0, y: 92, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "smart-insights", x: 0, y: 96, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "peak-hours", x: 0, y: 103, w: 12, h: 5, minW: 6, minH: 4 },

  // Maintenance › Assets
  { i: "assets-section-label", x: 0, y: 108, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "asset-hero-total", x: 0, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-hero-good", x: 2, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-hero-fair", x: 4, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-hero-bad", x: 6, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-hero-health", x: 8, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-hero-replacement", x: 10, y: 109, w: 2, h: 3, minW: 2, minH: 3 },
  { i: "asset-health-card", x: 0, y: 112, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "asset-breakdown-gauge", x: 0, y: 119, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-value-risk", x: 6, y: 119, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-critical-noncritical", x: 0, y: 125, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-repeat-breakdowns", x: 6, y: 125, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-breakdown-allocation", x: 0, y: 131, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-category-breakdown", x: 6, y: 131, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-lifecycle", x: 0, y: 137, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "asset-amc-pair", x: 0, y: 144, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "asset-mttr-pair", x: 0, y: 149, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "asset-repair-cost-ratio", x: 0, y: 154, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-cost-by-category", x: 6, y: 154, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-high-maintenance", x: 0, y: 160, w: 6, h: 6, minW: 3, minH: 4 },
  { i: "asset-ownership-cost", x: 6, y: 160, w: 6, h: 6, minW: 3, minH: 4 },

  // Maintenance › Audit
  { i: "audit-section-label", x: 0, y: 166, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "audit-open-observations", x: 0, y: 167, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-score", x: 6, y: 167, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-asset-completion-pct", x: 0, y: 170, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-missing-assets", x: 6, y: 170, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-missing-docs", x: 0, y: 173, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-qr-compliance", x: 6, y: 173, w: 6, h: 3, minW: 3, minH: 3 },
  { i: "audit-unauthorized-movement", x: 0, y: 176, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "audit-status-overview", x: 0, y: 181, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "audit-kpi-table", x: 0, y: 188, w: 12, h: 8, minW: 6, minH: 6 },
  { i: "audit-red-flags", x: 0, y: 196, w: 12, h: 10, minW: 6, minH: 6 },
  { i: "audit-insights", x: 0, y: 206, w: 12, h: 9, minW: 6, minH: 6 },
  { i: "audit-status-repository", x: 0, y: 215, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "audit-completion-bar", x: 0, y: 222, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "audit-stalled", x: 0, y: 228, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "audit-execution-concentration", x: 0, y: 233, w: 12, h: 4, minW: 6, minH: 3 },

  // Maintenance › AMC
  { i: "amc-section-label", x: 0, y: 237, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "amc-health-card", x: 0, y: 238, w: 12, h: 7, minW: 6, minH: 5 },
  { i: "amc-discrepancy-banner", x: 0, y: 245, w: 12, h: 2, minW: 6, minH: 2 },
  { i: "amc-expiry-timeline", x: 0, y: 247, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "amc-expiry-banner", x: 0, y: 253, w: 12, h: 2, minW: 6, minH: 2 },
  { i: "amc-urgency-criticality", x: 0, y: 255, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "amc-vendor-concentration", x: 0, y: 261, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "amc-cost-at-risk", x: 0, y: 267, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "amc-service-asset-split", x: 0, y: 271, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "amc-critical-pending-pair", x: 0, y: 277, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "amc-coverage-by-category", x: 0, y: 282, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "amc-cost-trend", x: 0, y: 288, w: 12, h: 6, minW: 6, minH: 4 },

  // Maintenance › Checklists
  { i: "checklist-section-label", x: 0, y: 294, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "checklist-inhouse-card", x: 0, y: 295, w: 6, h: 7, minW: 4, minH: 5 },
  { i: "checklist-oem-card", x: 6, y: 295, w: 6, h: 7, minW: 4, minH: 5 },
  { i: "checklist-type-breakdown", x: 0, y: 302, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "checklist-skipped-items", x: 0, y: 308, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "checklist-kpi-pair", x: 0, y: 313, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "checklist-top10-completed", x: 0, y: 317, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "checklist-sitewise-compliance", x: 0, y: 323, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "checklist-monthly-trend", x: 0, y: 328, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "checklist-red-flags", x: 0, y: 334, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "checklist-smart-insights", x: 0, y: 340, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "checklist-tenant-mismatch", x: 0, y: 346, w: 12, h: 4, minW: 6, minH: 3 },

  // Maintenance › Inventory
  { i: "inventory-section-label", x: 0, y: 350, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "inventory-kpi-row", x: 0, y: 351, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "inventory-urgent-restock", x: 0, y: 355, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "inventory-type-breakdown", x: 0, y: 359, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "inventory-health-score", x: 0, y: 365, w: 12, h: 3, minW: 6, minH: 3 },
  { i: "inventory-consumption-trend", x: 0, y: 368, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "inventory-category-consumption", x: 0, y: 374, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "inventory-deadstock-value", x: 0, y: 380, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "inventory-kpi-table", x: 0, y: 386, w: 12, h: 7, minW: 6, minH: 5 },

  // Maintenance › Waste
  { i: "waste-section-label", x: 0, y: 393, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "waste-kpi-row", x: 0, y: 394, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "waste-workflow-bottlenecks", x: 0, y: 398, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "waste-breakdown", x: 0, y: 403, w: 4, h: 8, minW: 3, minH: 6 },
  { i: "waste-vendor-performance", x: 4, y: 403, w: 4, h: 8, minW: 3, minH: 6 },
  { i: "waste-sustainability", x: 8, y: 403, w: 4, h: 8, minW: 3, minH: 6 },
  { i: "waste-weekly-trend-stale", x: 0, y: 411, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "waste-records-table", x: 0, y: 415, w: 12, h: 8, minW: 6, minH: 6 },
  { i: "waste-handoff-banner", x: 0, y: 423, w: 12, h: 2, minW: 6, minH: 2 },

  // Maintenance › Attendance
  { i: "attendance-section-label", x: 0, y: 426, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "attendance-card", x: 0, y: 427, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "attendance-trend", x: 0, y: 433, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "attendance-department-wise", x: 0, y: 438, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "attendance-staffing-breach", x: 0, y: 443, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "attendance-repeat-lateness", x: 0, y: 449, w: 12, h: 5, minW: 6, minH: 4 },

  // Maintenance › Survey
  { i: "survey-section-label", x: 0, y: 454, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "survey-kpi-row", x: 0, y: 455, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "survey-satisfaction-scale", x: 0, y: 459, w: 12, h: 4, minW: 6, minH: 3 },
  { i: "survey-response-by-category", x: 0, y: 463, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "survey-weekly-csat-trend", x: 0, y: 469, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "survey-weekly-breakdown-table", x: 0, y: 474, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "survey-hourly-response", x: 0, y: 480, w: 12, h: 5, minW: 6, minH: 4 },

  // Maintenance › Vendor
  { i: "vendor-section-label", x: 0, y: 485, w: 12, h: 1, minW: 6, minH: 1 },
  { i: "vendor-kpi-row", x: 0, y: 486, w: 12, h: 8, minW: 6, minH: 6 },
  { i: "vendor-repeat-requests", x: 0, y: 494, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "vendor-response-time", x: 0, y: 499, w: 6, h: 7, minW: 4, minH: 5 },
  { i: "vendor-amc-status-table", x: 6, y: 499, w: 6, h: 7, minW: 4, minH: 5 },
  { i: "vendor-health", x: 0, y: 506, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "vendor-response-trend", x: 0, y: 512, w: 12, h: 6, minW: 6, minH: 4 },
  { i: "vendor-expired-kyc", x: 0, y: 518, w: 12, h: 5, minW: 6, minH: 4 },
  { i: "vendor-data-hygiene-banner", x: 0, y: 523, w: 12, h: 2, minW: 6, minH: 2 },
];


function loadStoredLayout(): GridLayout.Layout[] | null {
  try {
    const raw = localStorage.getItem(TICKETS_GRID_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// A saved layout can predate cards added later, or can have captured a
// transiently-collapsed size (e.g. react-grid-layout's w:1,h:1 fallback for an
// item missing from `layouts` at drag/resize time, persisted by mistake).
// Reconcile against the current default: use the stored position/size only
// when it isn't smaller than the card's own minW/minH, so a corrupted or
// stale entry self-heals back to its intended default instead of persisting.
function reconcileLayout(stored: GridLayout.Layout[] | null): GridLayout.Layout[] {
  if (!stored) return DEFAULT_TICKETS_LAYOUT;
  const storedById = new Map(stored.map((item) => [item.i, item]));
  return DEFAULT_TICKETS_LAYOUT.map((defaultItem) => {
    const storedItem = storedById.get(defaultItem.i);
    if (!storedItem) return defaultItem;
    const minW = defaultItem.minW ?? 1;
    const minH = defaultItem.minH ?? 1;
    if (storedItem.w < minW || storedItem.h < minH) return defaultItem;
    return storedItem;
  });
}

type ChipTone = "red" | "amber" | "green" | "grey";

interface ModuleChip {
  label: string;
  tone: ChipTone;
}

interface ModuleStat {
  label: string;
  value: string;
  tone: ChipTone;
}

interface ModuleDefinition {
  key: string;
  label: string;
  icon: LucideIcon;
  summary: string;
  subTabs: string[];
  stats: ModuleStat[];
  chips: ModuleChip[];
}

const CHIP_TONE_CLASSES: Record<ChipTone, string> = {
  red: "bg-brand-error-bg text-brand-error border border-brand-error",
  amber: "bg-brand-warning-light text-[#8A5A00] border border-brand-warning",
  green: "bg-brand-success-bg text-brand-success border border-brand-success",
  grey: "bg-brand-muted text-brand-text-light border border-brand-border",
};

const STAT_TONE_CLASSES: Record<ChipTone, string> = {
  red: "text-brand-error",
  amber: "text-[#8A5A00]",
  green: "text-brand-success",
  grey: "text-brand-text",
};

const MODULES: ModuleDefinition[] = [
  {
    key: "transitioning",
    label: "Transitioning",
    icon: RefreshCw,
    summary: "Snagging, violations and handover-takeover progress across the portfolio.",
    subTabs: ["HOTO", "Snagging", "Insights", "Fitout"],
    stats: [
      { label: "Open Snags", value: "38", tone: "amber" },
      { label: "Violations", value: "5", tone: "red" },
      { label: "HOTO Pending", value: "3", tone: "amber" },
    ],
    chips: [
      { label: "38 Open Snags", tone: "amber" },
      { label: "5 Violations", tone: "red" },
      { label: "3 HOTO Pending", tone: "amber" },
    ],
  },
  {
    key: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    summary: "AMC coverage, asset uptime and PPM checklist compliance.",
    subTabs: [
      "Tickets",
      "Assets",
      "Audit",
      "AMC",
      "Checklists",
      "Inventory",
      "Waste",
      "Attendance",
      "Survey",
      "Vendor",
    ],
    stats: [
      { label: "AMC Miss", value: "128", tone: "amber" },
      { label: "Assets Down", value: "63", tone: "red" },
      { label: "PPM Overdue", value: "676", tone: "red" },
    ],
    chips: [
      { label: "AMC Miss 128", tone: "amber" },
      { label: "Assets Down 63", tone: "red" },
      { label: "676 PPM Overdue", tone: "red" },
      { label: "Vendor Risk Flagged", tone: "red" },
    ],
  },
  {
    key: "safety",
    label: "Safety",
    icon: HardHat,
    summary: "Incident closure integrity, permit-to-work backlog and emergency readiness.",
    subTabs: ["SOHI", "Incidents", "Permits", "Emergency"],
    stats: [
      { label: "No RCA on Closed Incidents", value: "71%", tone: "red" },
      { label: "Permits Stuck in Draft", value: "52", tone: "red" },
    ],
    chips: [
      { label: "71% No RCA", tone: "red" },
      { label: "52 Draft Stuck", tone: "red" },
      { label: "Emergency Prep Gap", tone: "red" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: Wallet,
    summary: "Invoice ageing, purchase-requisition backlog and wallet adoption.",
    subTabs: ["Overview", "Procurement", "Invoices", "KPIs", "GDN", "Wallet"],
    stats: [
      { label: "Overdue Invoices", value: "2", tone: "red" },
      { label: "Draft PRs", value: "130", tone: "amber" },
      { label: "Wallet Active Users", value: "21", tone: "green" },
    ],
    chips: [
      { label: "2 Overdue Invoices", tone: "red" },
      { label: "130 Draft PRs", tone: "amber" },
      { label: "Wallet: 21 Users Active", tone: "green" },
    ],
  },
  {
    key: "crm",
    label: "CRM",
    icon: Users,
    summary: "Tenant sentiment, loyalty redemption and engagement adoption.",
    subTabs: ["Overview", "My Pipeline", "Calendar", "My Tasks", "Campaigns"],
    stats: [
      { label: "Negative Feedback", value: "73%", tone: "red" },
      { label: "Points Unredeemed", value: "99.5K", tone: "amber" },
    ],
    chips: [
      { label: "73% Neg Feedback", tone: "red" },
      { label: "99.5K pts Unredeemed", tone: "amber" },
      { label: "Low Adoption", tone: "grey" },
    ],
  },
  {
    key: "utility",
    label: "Utility",
    icon: Zap,
    summary: "Meter health, billing accuracy and solar generation data freshness.",
    subTabs: [
      "Energy",
      "Water",
      "STP",
      "Daily Readings",
      "Utility Request",
      "Utility Consumption",
      "EV Consumption",
      "Solar Generator",
    ],
    stats: [
      { label: "Billing Risk", value: "High", tone: "red" },
      { label: "Solar Data Staleness", value: "16mo", tone: "red" },
    ],
    chips: [
      { label: "Billing May Be Inflated", tone: "red" },
      { label: "Meter Logged Out-of-Order", tone: "red" },
      { label: "Solar Data 16mo Stale", tone: "red" },
    ],
  },
  {
    key: "security",
    label: "Security",
    icon: Lock,
    summary: "Patrol system health, gate-pass reconciliation and credential expiry.",
    subTabs: ["Gate Passes", "Patrol", "Visitors", "Vehicles", "Staff"],
    stats: [
      { label: "Vehicle Insurance Expired", value: "6yr", tone: "red" },
      { label: "Gate Pass Unmatched", value: "18", tone: "amber" },
    ],
    chips: [
      { label: "Vehicle Ins. 6yr Expired", tone: "red" },
      { label: "Patrol System Error", tone: "red" },
      { label: "Expired Creds", tone: "amber" },
      { label: "Gate Pass 18 Unmatched", tone: "amber" },
    ],
  },
  {
    key: "vas",
    label: "Value Added Services",
    icon: Star,
    summary: "Parking utilisation, F&B order flow and amenity booking adoption.",
    subTabs: ["F&B", "OSR", "Parking", "Booking", "Space Management", "Mailroom"],
    stats: [
      { label: "Parking Utilisation", value: "6%", tone: "amber" },
      { label: "Booking Usage", value: "56pg", tone: "green" },
    ],
    chips: [
      { label: "Parking 6% + 0 Bookings", tone: "amber" },
      { label: "F&B Order Status", tone: "amber" },
      { label: "Booking: 56pg Real Usage", tone: "green" },
    ],
  },
  {
    key: "marketplace",
    label: "Market Place",
    icon: Store,
    summary: "Redemption marketplace listings, vendor payouts and catalogue health.",
    subTabs: ["Listings", "Vendors", "Payouts", "Catalogue"],
    stats: [
      { label: "Active Listings", value: "12", tone: "green" },
      { label: "Vendor Payouts Pending", value: "3", tone: "amber" },
    ],
    chips: [
      { label: "99.5K pts Unredeemed", tone: "amber" },
      { label: "3 Vendor Payouts Pending", tone: "amber" },
      { label: "12 Active Listings", tone: "green" },
    ],
  },
  {
    key: "master",
    label: "Master",
    icon: Database,
    summary: "Master-data completeness across sites, entities and duplicate records.",
    subTabs: ["Locations", "Assets Master", "Vendors Master", "Categories"],
    stats: [
      { label: "Master Entities", value: "48", tone: "grey" },
      { label: "Duplicate Records Flagged", value: "2", tone: "amber" },
    ],
    chips: [
      { label: "48 Master Data Entities", tone: "grey" },
      { label: "6 Pending Approvals", tone: "amber" },
      { label: "2 Duplicate Records Flagged", tone: "amber" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: SettingsIcon,
    summary: "Role configuration, permission conflicts and integration health.",
    subTabs: ["Roles", "Permissions", "Integrations", "Notifications"],
    stats: [
      { label: "Roles Configured", value: "14", tone: "grey" },
      { label: "Permission Conflicts", value: "3", tone: "amber" },
    ],
    chips: [
      { label: "14 Roles Configured", tone: "grey" },
      { label: "3 Permission Conflicts", tone: "amber" },
      { label: "Integration Health: OK", tone: "green" },
    ],
  },
  {
    key: "accounting",
    label: "Accounting",
    icon: Calculator,
    summary: "Ledger reconciliation, tax setup and bill-approval throughput.",
    subTabs: ["Ledger", "Tax Setup", "Bills", "Reconciliation"],
    stats: [
      { label: "Unreconciled Entries", value: "27", tone: "amber" },
      { label: "Bills Pending Approval", value: "9", tone: "amber" },
    ],
    chips: [
      { label: "27 Unreconciled Entries", tone: "amber" },
      { label: "9 Bills Pending Approval", tone: "amber" },
      { label: "Tax Setup: Up to Date", tone: "green" },
    ],
  },
];

// Maintenance › Ticket analytics — sourced from the "SECTION 2: KPI Scorecard"
// and "TICKETS INSIGHT PANELS" blocks in fm_matrix_phase10 (29).html.
const TICKET_POOL_DATA = [
  { name: "Pending", value: 412 },
  { name: "In Progress", value: 284 },
  { name: "On Hold", value: 156 },
  { name: "Closed", value: 117 },
];

interface CategoryRow {
  category: string;
  total: number;
  tatBreach: number;
  tatTone: TableBadgeTone;
  trendDisplay: string;
  trendTone: "red" | "green" | "neutral";
  ageing: string;
  ageingHighlight?: boolean;
}

// Per-status split is illustrative — the reference only gives category totals
// plus a descriptive insight ("R&M / General are almost all Pending+In
// Progress; AC / FSC are mostly Closed"); these breakdowns are built to match
// that shape and sum to the exact totals below.
const CATEGORY_STACK_DATA = [
  { category: "Repair & Maintenance", pending: 140, inProgress: 130, onHold: 20, closed: 8 },
  { category: "General Tickets", pending: 90, inProgress: 88, onHold: 12, closed: 8 },
  { category: "Plumbing", pending: 55, inProgress: 60, onHold: 25, closed: 22 },
  { category: "Housekeeping", pending: 15, inProgress: 20, onHold: 20, closed: 33 },
  { category: "Air Conditioner", pending: 8, inProgress: 12, onHold: 8, closed: 29 },
  { category: "FSC", pending: 5, inProgress: 8, onHold: 5, closed: 22 },
];

const CATEGORY_TABLE_DATA: CategoryRow[] = [
  { category: "Repair & Maintenance", total: 298, tatBreach: 94.5, tatTone: "red", trendDisplay: "↑ +6%", trendTone: "red", ageing: "76d", ageingHighlight: true },
  { category: "General Tickets", total: 198, tatBreach: 94.4, tatTone: "red", trendDisplay: "↑ +3%", trendTone: "red", ageing: "58d" },
  { category: "Plumbing", total: 162, tatBreach: 66.7, tatTone: "amber", trendDisplay: "↓ -4%", trendTone: "green", ageing: "27d" },
  { category: "Housekeeping", total: 88, tatBreach: 41, tatTone: "amber", trendDisplay: "· 0%", trendTone: "neutral", ageing: "15d" },
  { category: "Air Conditioner", total: 57, tatBreach: 18.9, tatTone: "green", trendDisplay: "↓ -9%", trendTone: "green", ageing: "6d" },
  { category: "FSC", total: 40, tatBreach: 12, tatTone: "green", trendDisplay: "· +1%", trendTone: "neutral", ageing: "4d" },
];

const REPLY_VS_RESOLUTION_DATA = [
  { month: "Jul", replyHrs: 20, resolutionDays: 0.8 },
  { month: "Aug", replyHrs: 19, resolutionDays: 0.9 },
  { month: "Sep", replyHrs: 28, resolutionDays: 1.1 },
  { month: "Oct", replyHrs: 34, resolutionDays: 1.1 },
  { month: "Nov", replyHrs: 36, resolutionDays: 1.2 },
  { month: "Dec", replyHrs: 32, resolutionDays: 1.1 },
  { month: "Jan", replyHrs: 24, resolutionDays: 0.9 },
  { month: "Feb", replyHrs: 20, resolutionDays: 0.9 },
  { month: "Mar", replyHrs: 19, resolutionDays: 1.3 },
  { month: "Apr", replyHrs: 17, resolutionDays: 1.7 },
  { month: "May", replyHrs: 20, resolutionDays: 2.2 },
  { month: "Jun", replyHrs: 17, resolutionDays: 3.0 },
];

const SLA_BREACH_TREND_DATA = [
  { month: "Jul", breaches: 95 },
  { month: "Aug", breaches: 102 },
  { month: "Sep", breaches: 108 },
  { month: "Oct", breaches: 115 },
  { month: "Nov", breaches: 128 },
  { month: "Dec", breaches: 145 },
  { month: "Jan", breaches: 140 },
  { month: "Feb", breaches: 148 },
  { month: "Mar", breaches: 152 },
];

const AGE_TIER_COLORS = [
  ANALYTICS_PALETTE[3],
  ANALYTICS_PALETTE[2],
  ANALYTICS_PALETTE[2],
  ANALYTICS_PALETTE[0],
  ANALYTICS_PALETTE[3],
];

const RESOLVED_AGE_TIER_DATA = [
  { tier: "0-6h", count: 8 },
  { tier: "6-12h", count: 25 },
  { tier: "12-24h", count: 65 },
  { tier: "24-48h", count: 75 },
  { tier: "48h+", count: 295 },
];

const UNRESOLVED_AGE_TIER_DATA = [
  { tier: "0-6h", count: 35 },
  { tier: "6-12h", count: 55 },
  { tier: "12-24h", count: 70 },
  { tier: "24-48h", count: 95 },
  { tier: "48h+", count: 405 },
];

const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEATMAP_HOURS = Array.from({ length: 24 }, (_, i) => i);
const HEATMAP_DATA: number[][] = HEATMAP_DAYS.map((_, dayIdx) =>
  HEATMAP_HOURS.map((h) => {
    const wave = Math.sin(((h - 3) / 24) * Math.PI * 2) * 5 + 5.5;
    const jitter = ((dayIdx * 13 + h * 7) % 5) - 2;
    return Math.max(0, Math.round(wave + jitter));
  })
);

const TECH_WORKLOAD_DATA = [
  { tech: "R. Verma", count: 34 },
  { tech: "S. Khan", count: 27 },
  { tech: "A. Singh", count: 19 },
  { tech: "P. Nair", count: 17 },
  { tech: "M. Joshi", count: 12 },
];

const TECH_WORKLOAD_COLORS = [
  "#9EC8BA",
  "#9EC8BA",
  "#DA7756",
  "#DA7756",
  "#DA7756",
];

const GOLDEN_REDFLAG_AGE_DATA = [
  { person: "Abdul Ghaffar", golden: 26, redFlag: 17 },
  { person: "Deepak Yadav", golden: 9, redFlag: 15 },
  { person: "Vinayak Mane", golden: 13, redFlag: 18 },
  { person: "Kshitij Rasal", golden: 17, redFlag: 17 },
];

const GOLDEN_AGED_ROWS = [
  { id: "2189-10486", label: "Keyboard not working", ageDays: 39, tone: "red" as TableBadgeTone },
  { id: "2189-10481", label: "AV timing issue", ageDays: 31, tone: "red" as TableBadgeTone },
  { id: "2189-10508", label: "AV system issue", ageDays: 19, tone: "amber" as TableBadgeTone },
];

const LOCATION_TICKET_VOLUME_DATA = [
  { location: "Business Bay", tickets: 230 },
  { location: "Tower C", tickets: 145 },
  { location: "Basement Parking", tickets: 95 },
];

const SOURCE_ORIGIN_DATA = [
  { source: "Manual/Direct", tickets: 405 },
  { source: "Asset", tickets: 150 },
  { source: "Checklist", tickets: 90 },
  { source: "Survey", tickets: 30 },
  { source: "Patrolling", tickets: 5 },
];

const SOURCE_ORIGIN_COLORS = ["#8E7BE0", "#8E7BE0", "#6B9BCC", "#9EC8BA", "#8E7BE0"];

const REPEAT_COMPLAINTS_DATA = [
  { issue: "Godrej Living — AC not cooling", count: 3 },
  { issue: "HSBC — Network Devices down", count: 2 },
];

const ASSET_LINKED_TICKETS_DATA = [
  { asset: "DG Sync Panel", count: 5 },
  { asset: "CCTV Camera", count: 3 },
];

const PEAK_COMPLAINT_HOURS_DATA = [
  { hour: "8AM", count: 20 },
  { hour: "10AM", count: 45 },
  { hour: "12PM", count: 65 },
  { hour: "2PM", count: 55 },
  { hour: "4PM", count: 40 },
  { hour: "6PM", count: 15 },
  { hour: "8PM", count: 12 },
];

const PEAK_HOURS_COLORS = ["#9EC8BA", "#DA7756", "#DA7756", "#DA7756", "#DA7756", "#9EC8BA", "#9EC8BA"];

const CATEGORY_TABLE_COLUMNS: DataTableColumn<CategoryRow>[] = [
  { key: "category", header: "Category", render: (row) => <span className="font-semibold text-brand-text">{row.category}</span> },
  { key: "total", header: "Total", render: (row) => row.total },
  {
    key: "tatBreach",
    header: "TAT Breach",
    render: (row) => <TableBadge tone={row.tatTone}>{row.tatBreach}%</TableBadge>,
  },
  {
    key: "trend",
    header: "vs Last Month",
    render: (row) => (
      <span
        className={cn(
          "text-brand-body-5 font-medium",
          row.trendTone === "red" && "text-brand-error",
          row.trendTone === "green" && "text-brand-success",
          row.trendTone === "neutral" && "text-brand-text-light"
        )}
      >
        {row.trendDisplay}
      </span>
    ),
  },
  {
    key: "ageing",
    header: "Avg Ageing",
    render: (row) => (
      <span className={cn(row.ageingHighlight ? "text-brand-error font-bold" : "text-brand-text")}>{row.ageing}</span>
    ),
  },
];

// Maintenance › Assets analytics — sourced from the "mn-assets" section
// (Asset Management Dashboard through Asset Ownership Cost Analysis) in
// fm_matrix_phase10 (29).html.
const BRAND_HEX = {
  green: "#798C5E",
  ok: "#108C72",
  warn: "#EDC488",
  err: "#E7848E",
  blue: "#6B9BCC",
  orange: "#DA7756",
  teal: "#9EC8BA",
  dark: "#2C2C2C",
};

const CRITICAL_BREAKDOWN_DATA = [
  { category: "Critical assets", rate: 19 },
  { category: "Non-Critical assets", rate: 14 },
];

const BREAKDOWN_BY_ALLOCATION_DATA = [
  { team: "IT Assets", count: 16 },
  { team: "Housekeeping", count: 14 },
  { team: "Electrical", count: 12 },
  { team: "Common Area", count: 11 },
  { team: "Security", count: 8 },
];
const BREAKDOWN_BY_ALLOCATION_COLORS = ["#DA7756", "#DA7756", "#DA7756", "#8E7BE0", "#8E7BE0"];

const CATEGORY_ASSET_BREAKDOWN_DATA = [
  { category: "IT", count: 124 },
  { category: "Non-IT", count: 98 },
  { category: "Building", count: 62 },
  { category: "Furniture", count: 48 },
  { category: "Vehicle", count: 24 },
  { category: "Meter", count: 17 },
  { category: "Land", count: 3 },
];
const CATEGORY_ASSET_BREAKDOWN_COLORS = [
  BRAND_HEX.blue,
  "#8E7BE0",
  BRAND_HEX.orange,
  "#8E7BE0",
  "#8E7BE0",
  BRAND_HEX.teal,
  "#9EC8BA",
];

const ASSET_LIFECYCLE_DATA = [
  { name: "In Use", value: 280 },
  { name: "Breakdown", value: 63 },
  { name: "Allocated", value: 30 },
  { name: "In Store", value: 3 },
  { name: "Disposed", value: 2 },
];

const REPAIR_COST_RATIO_DATA = [
  { asset: "DG Sync Panel", ratio: 39 },
  { asset: "CCTV Camera", ratio: 18 },
  { asset: "UPS Room Panel", ratio: 9 },
  { asset: "AC Compressor", ratio: 6 },
];
const REPAIR_COST_RATIO_COLORS = ["#DA7756", "#DA7756", "#8E7BE0", "#8E7BE0"];

const COST_BY_CATEGORY_DATA = [
  { category: "IT", value: 14.2 },
  { category: "Vehicle", value: 5.1 },
  { category: "Meter", value: 2.8 },
  { category: "Land", value: 1.2 },
];

// Maintenance › Audit analytics — sourced from the "mn-audit" section in
// fm_matrix_phase10 (29).html.
interface AuditKpiRow {
  kpi: string;
  formula: string;
  value: string;
  tone: TableBadgeTone;
}

const AUDIT_KPI_DATA: AuditKpiRow[] = [
  { kpi: "Audit Compliance Score ⭐", formula: "Completed ÷ Scheduled × 100", value: "35%", tone: "red" },
  { kpi: "Vendor Audit Pass Rate %", formula: "Vendor Passed ÷ Vendor Conducted × 100", value: "0% — never conducted", tone: "red" },
  { kpi: "Operational Audit Compliance %", formula: "Operational Passed ÷ Operational Conducted × 100", value: "40%", tone: "amber" },
  { kpi: "Average Audit Score", formula: "Average score across completed audits", value: "62/100", tone: "amber" },
  { kpi: "Total Audit Observations", formula: "Count of all recorded observations", value: "27 open", tone: "red" },
  { kpi: "CAPA Closure Rate %", formula: "Closed Tasks ÷ Total Audit Tasks × 100", value: "31%", tone: "red" },
];

const AUDIT_KPI_COLUMNS: DataTableColumn<AuditKpiRow>[] = [
  { key: "kpi", header: "KPI", render: (row) => <span className="text-brand-text">{row.kpi}</span> },
  { key: "formula", header: "Formula", render: (row) => <span className="text-brand-body-5 text-brand-text-light">{row.formula}</span> },
  { key: "value", header: "Value", render: (row) => <TableBadge tone={row.tone}>{row.value}</TableBadge> },
];

const AUDIT_STATUS_OVERVIEW_DATA = [
  { name: "Conducted", value: 4 },
  { name: "Pending", value: 1 },
  { name: "Overdue", value: 22 },
];

const AUDIT_COMPLETION_DATA = [
  { type: "Asset Audit", pct: 0, fraction: "0/27" },
  { type: "Vendor Audit", pct: 0, fraction: "0/6" },
  { type: "Operational", pct: 40, fraction: "4/10" },
];

// Maintenance › AMC analytics — sourced from the "mn-amc" section in
// fm_matrix_phase10 (29).html.
const AMC_EXPIRY_TIMELINE_LANES = [
  {
    label: "",
    points: [
      ...[-195, -148, -122, -108, -88, -70, -60, -52, -45, -38, -32, -25, -20, -12].map((day) => ({
        day,
        status: "expired",
      })),
      ...[5, 15, 22, 40, 48].map((day) => ({ day, status: "upcoming" })),
    ],
  },
];
const AMC_EXPIRY_STATUS_COLORS = { expired: BRAND_HEX.err, upcoming: BRAND_HEX.ok };
const AMC_EXPIRY_STATUS_LABELS = { expired: "Expired", upcoming: "Upcoming" };

const AMC_URGENCY_LANES = [
  {
    label: "Critical",
    points: [
      ...[-195, -148, -108, -95, -55, -40, -28].map((day) => ({ day, status: "criticalExpired" })),
      ...[5, 15, 30].map((day) => ({ day, status: "criticalUpcoming" })),
    ],
  },
  {
    label: "Non-Critical",
    points: [
      ...[-100, -75, -60, -45, -30, -20].map((day) => ({ day, status: "nonCriticalExpired" })),
      ...[20, 35, 50].map((day) => ({ day, status: "nonCriticalUpcoming" })),
    ],
  },
];
const AMC_URGENCY_STATUS_COLORS = {
  criticalExpired: "#DA7756",
  nonCriticalExpired: BRAND_HEX.warn,
  criticalUpcoming: BRAND_HEX.ok,
  nonCriticalUpcoming: BRAND_HEX.teal,
};
const AMC_URGENCY_STATUS_LABELS = {
  criticalExpired: "Critical, expired",
  nonCriticalExpired: "Non-Critical, expired",
  criticalUpcoming: "Critical, upcoming",
  nonCriticalUpcoming: "Non-Critical, upcoming",
};

const AMC_VENDOR_CONCENTRATION_DATA = [
  { vendor: "PowerTech Metering", pct: 68 },
  { vendor: "Connexions Facility", pct: 55 },
  { vendor: "Unicorn InfoSol.", pct: 41 },
  { vendor: "Reliance Digital", pct: 28 },
  { vendor: "Oizom Instruments", pct: 19 },
];
const AMC_VENDOR_CONCENTRATION_COLORS = ["#DA7756", "#DA7756", "#DA7756", "#DA7756", "#9EC8BA"];

const AMC_SERVICE_ASSET_SPLIT_DATA = [
  { type: "Service AMCs", total: 150, missed: 8 },
  { type: "Asset AMCs", total: 214, missed: 120 },
];

const AMC_COVERAGE_BY_CATEGORY_DATA = [
  { category: "IT", pct: 88 },
  { category: "Vehicle", pct: 79 },
  { category: "Meter", pct: 42 },
  { category: "Furniture", pct: 31 },
];
const AMC_COVERAGE_BY_CATEGORY_COLORS = ["#8E7BE0", "#8E7BE0", "#9EC8BA", "#9EC8BA"];

const AMC_COST_TREND_DATA = [
  { month: "Jan", cost: 6.8 },
  { month: "Feb", cost: 7.0 },
  { month: "Mar", cost: 6.2 },
  { month: "Apr", cost: 7.9 },
  { month: "May", cost: 8.1 },
  { month: "Jun", cost: 7.6 },
];

// Maintenance › Checklists analytics — sourced from the "mn-checklist" section in
// fm_matrix_phase10 (29).html.
const CHECKLIST_TYPE_BREAKDOWN_DATA = [
  { type: "PPM", completed: 0, open: 89, overdue: 2002 },
  { type: "AMC", completed: 0, open: 0, overdue: 364 },
  { type: "Preparedness", completed: 2, open: 28, overdue: 4461 },
  { type: "Routine", completed: 340, open: 145, overdue: 210 },
  { type: "Pest Control", completed: 52, open: 18, overdue: 9 },
];

const CHECKLIST_TOP10_COMPLETED_DATA = [
  { checklist: "Housekeeping Daily", completions: 340 },
  { checklist: "Security Patrol Log", completions: 298 },
  { checklist: "Fire Extinguisher Visual", completions: 210 },
  { checklist: "Lift Inspection", completions: 187 },
  { checklist: "Water Tank Check", completions: 164 },
  { checklist: "Pest Control Round", completions: 142 },
  { checklist: "Waste Segregation", completions: 128 },
  { checklist: "HVAC Filter Check", completions: 109 },
  { checklist: "Signage Check", completions: 94 },
  { checklist: "Landscaping Round", completions: 81 },
];

const CHECKLIST_SITEWISE_COMPLIANCE_DATA = [
  { site: "Lobby", compliance: 68 },
  { site: "Tower C", compliance: 54 },
  { site: "B Wing", compliance: 49 },
  { site: "Business Bay", compliance: 31 },
  { site: "Rooftop", compliance: 28 },
  { site: "Basement", compliance: 22 },
];
const CHECKLIST_SITEWISE_COMPLIANCE_COLORS = ["#9EC8BA", "#8E7BE0", "#8E7BE0", "#8E7BE0", "#8E7BE0", "#8E7BE0"];

const CHECKLIST_MONTHLY_TREND_DATA = [
  { month: "Jan", completed: 420, pending: 580 },
  { month: "Feb", completed: 398, pending: 640 },
  { month: "Mar", completed: 375, pending: 710 },
  { month: "Apr", completed: 360, pending: 780 },
  { month: "May", completed: 342, pending: 850 },
  { month: "Jun", completed: 330, pending: 920 },
];

// Maintenance › Inventory analytics — sourced from the "mn-inventory" section in
// fm_matrix_phase10 (29).html.
const INVENTORY_TYPE_BREAKDOWN_DATA = [
  { type: "Consumable", critical: 62, nonCritical: 41 },
  { type: "Sparse", critical: 48, nonCritical: 47 },
];

const INVENTORY_CONSUMPTION_TREND_DATA = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 38500 },
  { month: "Mar", value: 51000 },
  { month: "Apr", value: 47000 },
  { month: "May", value: 58000 },
  { month: "Jun", value: 61500 },
];

const INVENTORY_CATEGORY_CONSUMPTION_DATA = [
  { category: "Electrical", value: 24800 },
  { category: "Plumbing", value: 18200 },
  { category: "Housekeeping", value: 14600 },
  { category: "IT", value: 9400 },
  { category: "Stationery", value: 4200 },
];

const INVENTORY_DEADSTOCK_DATA = [
  { category: "Electrical", value: 68000 },
  { category: "Plumbing", value: 52000 },
  { category: "IT Spares", value: 41000 },
  { category: "Housekeeping", value: 28000 },
  { category: "Other", value: 21000 },
];

interface InventoryKpiRow {
  kpi: string;
  formula: string;
  value: string;
  tone: TableBadgeTone;
}

const INVENTORY_KPI_DATA: InventoryKpiRow[] = [
  { kpi: "Current Inventory Value", formula: "Σ (Quantity × Unit Cost)", value: "₹8.4L (198 costed items)", tone: "amber" },
  { kpi: "Critical Stock Status", formula: "Items below reorder threshold", value: "2 flagged", tone: "red" },
  { kpi: "Turnover Ratio", formula: "Consumption ÷ Avg Stock Held", value: "0.6x — slow-moving", tone: "red" },
  { kpi: "Dead Stock & Overstock Value", formula: "Value of items with zero movement in 90+ days", value: "₹2.1L across 173 items", tone: "red" },
  { kpi: "GRN & GDN Workflow Status", formula: "Goods Received/Dispatched pending vs completed", value: "12 pending, 84 completed", tone: "amber" },
  { kpi: "Green Inventory Adoption %", formula: "Ecofriendly items ÷ Total items × 100", value: "18.7%", tone: "green" },
];

const INVENTORY_KPI_COLUMNS: DataTableColumn<InventoryKpiRow>[] = [
  { key: "kpi", header: "KPI", render: (row) => <span className="text-brand-text">{row.kpi}</span> },
  { key: "formula", header: "Formula", render: (row) => <span className="text-brand-body-5 text-brand-text-light">{row.formula}</span> },
  { key: "value", header: "Value", render: (row) => <TableBadge tone={row.tone}>{row.value}</TableBadge> },
];

// Maintenance › Waste analytics — sourced from the "mn-waste" section in
// fm_matrix_phase10 (29).html.
interface WasteRecordRow {
  categoryLabel: string;
  categoryTone: TableBadgeTone;
  name: string;
  generated: number;
  recycled: string;
  recycledTone?: "ok" | "err";
  vendorTone: TableBadgeTone;
  vendorLabel: string;
  lastUpdated: string;
  complianceTone: TableBadgeTone;
  complianceLabel: string;
}

const WASTE_RECORDS_DATA: WasteRecordRow[] = [
  { categoryLabel: "Customer", categoryTone: "blue", name: "Oizom Instruments", generated: 57, recycled: "—", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "grey", complianceLabel: "Pending" },
  { categoryLabel: "Customer", categoryTone: "blue", name: "Reliance Digital", generated: 24, recycled: "—", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "grey", complianceLabel: "Pending" },
  { categoryLabel: "Customer", categoryTone: "blue", name: "HSBC", generated: 19, recycled: "—", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "grey", complianceLabel: "Pending" },
  { categoryLabel: "Common Area", categoryTone: "amber", name: "Dry Waste", generated: 162, recycled: "90 ✓", recycledTone: "ok", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "grey", complianceLabel: "Pending" },
  { categoryLabel: "Common Area", categoryTone: "green", name: "Wet Waste", generated: 90, recycled: "90 ✓", recycledTone: "ok", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "grey", complianceLabel: "Pending" },
  { categoryLabel: "Hazardous", categoryTone: "red", name: "Common Area", generated: 78, recycled: "0", recycledTone: "err", vendorTone: "red", vendorLabel: "Not set", lastUpdated: "18/02/2026", complianceTone: "red", complianceLabel: "Unconfirmed" },
];

const WASTE_RECORDS_COLUMNS: DataTableColumn<WasteRecordRow>[] = [
  { key: "category", header: "Category", render: (row) => <TableBadge tone={row.categoryTone}>{row.categoryLabel}</TableBadge> },
  { key: "name", header: "Customer / Area", render: (row) => <span className="font-semibold text-brand-text">{row.name}</span> },
  { key: "generated", header: "Generated (KG)", align: "center", render: (row) => <span className="text-brand-text">{row.generated}</span> },
  {
    key: "recycled",
    header: "Recycled (KG)",
    align: "center",
    render: (row) => (
      <span className={cn("font-semibold", row.recycledTone === "ok" ? "text-brand-success" : row.recycledTone === "err" ? "text-brand-error" : "text-brand-text-light")}>
        {row.recycled}
      </span>
    ),
  },
  { key: "vendor", header: "Vendor", align: "center", render: (row) => <TableBadge tone={row.vendorTone}>{row.vendorLabel}</TableBadge> },
  { key: "lastUpdated", header: "Last Updated", align: "center", render: (row) => <span className="text-brand-error">{row.lastUpdated}</span> },
  { key: "compliance", header: "Compliance", align: "center", render: (row) => <TableBadge tone={row.complianceTone}>{row.complianceLabel}</TableBadge> },
];

// Maintenance › Attendance analytics — sourced from the "mn-attendance" section in
// fm_matrix_phase10 (29).html.
const ATTENDANCE_TREND_DATA = [
  { month: "Jan", presentPct: 92 },
  { month: "Feb", presentPct: 90 },
  { month: "Mar", presentPct: 88 },
  { month: "Apr", presentPct: 91 },
  { month: "May", presentPct: 89 },
  { month: "Jun", presentPct: 89 },
];

const ATTENDANCE_STAFFING_BREACH_DATA = [
  { day: "Mon", absent: 0, breach: 15 },
  { day: "Tue", absent: 1, breach: 42 },
  { day: "Wed", absent: 0, breach: 18 },
  { day: "Thu", absent: 1, breach: 48 },
  { day: "Fri", absent: 1, breach: 51 },
  { day: "Sat", absent: 0, breach: 20 },
  { day: "Sun", absent: 0, breach: 17 },
];

// Maintenance › Survey analytics — sourced from the "mn-survey" section in
// fm_matrix_phase10 (29).html.
const SURVEY_SATISFACTION_SCALE = [
  { emoji: "🤩", label: "Extremely Happy", pct: "18% (10)", color: BRAND_HEX.ok },
  { emoji: "😊", label: "Happy", pct: "9% (5)", color: BRAND_HEX.ok },
  { emoji: "😐", label: "Neutral", pct: "27% (15)", color: BRAND_HEX.green },
  { emoji: "🙁", label: "Not Happy", pct: "32% (18)", color: BRAND_HEX.warn },
  { emoji: "😞", label: "Dissatisfied", pct: "14% (8)", color: BRAND_HEX.err },
];

const SURVEY_WEEKLY_CSAT_DATA = [
  { week: "Dec28-Jan3", csat: 1.11 },
  { week: "Jan4-Jan10", csat: 2.0 },
  { week: "Jan11-Jan17", csat: 1.11 },
  { week: "Feb8-Feb14", csat: 5.0 },
];
const SURVEY_WEEKLY_CSAT_COLORS = ["#9EC8BA", "#8E7BE0", "#9EC8BA", "#DA7756"];

interface SurveyWeeklyRow {
  week: string;
  csat: string;
  negative: string;
  positive: string;
  total: string;
  highlight?: boolean;
}

const SURVEY_WEEKLY_BREAKDOWN_DATA: SurveyWeeklyRow[] = [
  { week: "Dec 28 - Jan 3", csat: "1.11", negative: "78% (7)", positive: "22% (2)", total: "9" },
  { week: "Jan 4 - Jan 10", csat: "2.00 +80%", negative: "60% (6)", positive: "40% (4)", total: "10" },
  { week: "Jan 11 - Jan 17", csat: "1.11 -44%", negative: "78% (28)", positive: "22% (8)", total: "36", highlight: true },
  { week: "Feb 8 - Feb 14", csat: "5.00", negative: "0% (0)", positive: "100% (1)", total: "1" },
];

const SURVEY_HOURLY_RESPONSE_DATA = [
  { hour: "12AM", value: 10 },
  { hour: "2AM", value: 5 },
  { hour: "4AM", value: 4 },
  { hour: "6AM", value: 13 },
  { hour: "8AM", value: 4 },
  { hour: "10AM", value: 5 },
  { hour: "12PM", value: 10 },
  { hour: "2PM", value: 11 },
  { hour: "4PM", value: 14 },
  { hour: "6PM", value: 4 },
  { hour: "8PM", value: 12 },
  { hour: "10PM", value: 12 },
];

// Maintenance › Vendor analytics — sourced from the "mn-vendor" section in
// fm_matrix_phase10 (29).html.
interface VendorAmcRow {
  vendor: string;
  contracts: number;
  missed: number;
  missedTone: "ok" | "warn" | "err";
  spend: string;
  statusTone: TableBadgeTone;
  statusLabel: string;
}

const VENDOR_AMC_STATUS_DATA: VendorAmcRow[] = [
  { vendor: "PowerTech Metering", contracts: 18, missed: 14, missedTone: "err", spend: "₹18.4L", statusTone: "red", statusLabel: "Breached" },
  { vendor: "Connexions", contracts: 24, missed: 8, missedTone: "warn", spend: "₹22.1L", statusTone: "amber", statusLabel: "At Risk" },
  { vendor: "Unicorn InfoSol.", contracts: 12, missed: 0, missedTone: "ok", spend: "₹9.8L", statusTone: "green", statusLabel: "On Track" },
  { vendor: "Help Test", contracts: 6, missed: 3, missedTone: "warn", spend: "₹4.2L", statusTone: "amber", statusLabel: "Renew KYC" },
];

const VENDOR_AMC_STATUS_COLUMNS: DataTableColumn<VendorAmcRow>[] = [
  { key: "vendor", header: "Vendor", render: (row) => <span className="font-semibold text-brand-text">{row.vendor}</span> },
  { key: "contracts", header: "Contracts", align: "center", render: (row) => <span className="text-brand-text">{row.contracts}</span> },
  {
    key: "missed",
    header: "Missed",
    align: "center",
    render: (row) => (
      <span className={cn("font-semibold", row.missedTone === "ok" ? "text-brand-success" : row.missedTone === "warn" ? "text-[#8A5A00]" : "text-brand-error")}>
        {row.missed}
      </span>
    ),
  },
  { key: "spend", header: "Total Spend", align: "center", render: (row) => <span className="text-brand-text">{row.spend}</span> },
  { key: "status", header: "Status", align: "center", render: (row) => <TableBadge tone={row.statusTone}>{row.statusLabel}</TableBadge> },
];

const VENDOR_RESPONSE_TREND_DATA = [
  { month: "Mar", powerTech: 3.0, connexions: 4.2, unicorn: 4.0, helpTest: 7.5 },
  { month: "Apr", powerTech: 3.1, connexions: 4.4, unicorn: 4.8, helpTest: 9.0 },
  { month: "May", powerTech: 3.0, connexions: 4.6, unicorn: 5.5, helpTest: 10.2 },
  { month: "Jun", powerTech: 3.2, connexions: 4.8, unicorn: 6.1, helpTest: 11.4 },
];

const INSIGHT_ITEM_TONE_STYLES = {
  err: { bg: "rgba(231,132,142,0.16)", color: "#E7848E" },
  warn: { bg: "rgba(237,196,136,0.22)", color: "#7A4F00" },
  ok: { bg: "rgba(16,140,114,0.12)", color: "#108C72" },
} as const;

const INSIGHT_CATEGORY_TONE_STYLES = {
  err: { bg: "rgba(231,132,142,0.16)", color: "#E7848E" },
  warn: { bg: "rgba(237,196,136,0.22)", color: "#7A4F00" },
  terra: { bg: "rgba(218,119,86,0.16)", color: "#A34A30" },
  purple: { bg: "rgba(206,203,246,0.3)", color: "#4B4780" },
  info: { bg: "rgba(107,155,204,0.18)", color: "#3A6A9A" },
  sage: { bg: "rgba(121,140,94,0.16)", color: "#798C5E" },
  ok: { bg: "rgba(16,140,114,0.12)", color: "#108C72" },
} as const;

type InsightTone = keyof typeof INSIGHT_CATEGORY_TONE_STYLES;

interface InsightItem {
  priority: "P1" | "P2" | "P3";
  priorityTone: keyof typeof INSIGHT_ITEM_TONE_STYLES;
  label: string;
  age: string;
  isNew?: boolean;
  module: string;
  subTab: string;
}

interface InsightCategory {
  key: string;
  title: string;
  count: number;
  summary: string;
  tone: InsightTone;
  items: InsightItem[];
}

const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    key: "critical",
    title: "Critical",
    count: 5,
    summary: "5 items · P1 leadership action required",
    tone: "err",
    items: [
      { priority: "P1", priorityTone: "err", label: "16 Permits Expired", age: "15m", isNew: true, module: "safety", subTab: "Permits" },
      { priority: "P1", priorityTone: "err", label: "950 Utility Bills Pending", age: "2h", module: "finance", subTab: "Invoices" },
      { priority: "P1", priorityTone: "err", label: "Patrol Gap Since Jan 2026", age: "Today", module: "security", subTab: "Patrol" },
      { priority: "P1", priorityTone: "err", label: "27 Asset Audits Overdue", age: "2m", isNew: true, module: "maintenance", subTab: "Audit" },
      { priority: "P1", priorityTone: "err", label: "2 Invoices > 90 Days", age: "Yesterday", module: "finance", subTab: "Invoices" },
    ],
  },
  {
    key: "attention",
    title: "Attention Needed",
    count: 5,
    summary: "Human intervention required this week",
    tone: "warn",
    items: [
      { priority: "P2", priorityTone: "warn", label: "128 AMC Visits Missed", age: "Today", module: "maintenance", subTab: "AMC" },
      { priority: "P2", priorityTone: "warn", label: "73% Washroom Negative", age: "1h", isNew: true, module: "crm", subTab: "Overview" },
      { priority: "P2", priorityTone: "warn", label: "Solar Feed Stale", age: "2h", module: "utility", subTab: "Solar Generator" },
      { priority: "P2", priorityTone: "warn", label: "8 Vendor KYC Expiring", age: "Today", module: "maintenance", subTab: "Vendor" },
      { priority: "P2", priorityTone: "warn", label: "0 Vendor Audits Conducted", age: "Yesterday", module: "maintenance", subTab: "Vendor" },
    ],
  },
  {
    key: "op-backlog",
    title: "Operational Backlog",
    count: 5,
    summary: "Workflow queues accumulating across modules",
    tone: "terra",
    items: [
      { priority: "P2", priorityTone: "warn", label: "130+ Draft PRs Abandoned", age: "Today", module: "finance", subTab: "Procurement" },
      { priority: "P2", priorityTone: "warn", label: "55 Permit Drafts Stuck", age: "Today", module: "safety", subTab: "Permits" },
      { priority: "P2", priorityTone: "warn", label: "15+ Approvals Pending at SI Level", age: "Today", module: "finance", subTab: "Overview" },
      { priority: "P2", priorityTone: "warn", label: "3 HOTO Pending — 2 Vendor→FM, 1 FM→User", age: "Today", module: "transitioning", subTab: "HOTO" },
      { priority: "P2", priorityTone: "warn", label: "38 Open Snags — Survey 16, Permit 22", age: "Today", module: "transitioning", subTab: "Snagging" },
    ],
  },
  {
    key: "data-quality",
    title: "Data Quality",
    count: 5,
    summary: "Data integrity blocking reporting accuracy",
    tone: "purple",
    items: [
      { priority: "P3", priorityTone: "ok", label: "Waste Vendor Field Blank on All Records", age: "Yesterday", module: "maintenance", subTab: "Waste" },
      { priority: "P3", priorityTone: "ok", label: "Negative Meter Readings × 2", age: "2h", module: "utility", subTab: "Daily Readings" },
      { priority: "P3", priorityTone: "ok", label: "Vohra × 6 Duplicate Bills", age: "Today", module: "utility", subTab: "Energy" },
      { priority: "P3", priorityTone: "ok", label: "Events + Broadcast APIs Broken", age: "Today", module: "crm", subTab: "Overview" },
      { priority: "P3", priorityTone: "ok", label: "Lead Module — Seed Data Only", age: "Today", module: "crm", subTab: "Overview" },
    ],
  },
  {
    key: "predictions",
    title: "Predictions",
    count: 1,
    summary: "Leading indicators signalling deterioration",
    tone: "info",
    items: [
      { priority: "P2", priorityTone: "warn", label: "AMC Miss (128) + 63 Breakdowns — Link Unconfirmed", age: "Today", module: "maintenance", subTab: "AMC" },
    ],
  },
  {
    key: "recommendations",
    title: "Recommendations",
    count: 5,
    summary: "Actions expected to improve portfolio health",
    tone: "sage",
    items: [
      { priority: "P2", priorityTone: "warn", label: "Renew Expired Permits", age: "Today", module: "safety", subTab: "Permits" },
      { priority: "P2", priorityTone: "warn", label: "Start Asset Audit Programme", age: "2h", module: "maintenance", subTab: "Audit" },
      { priority: "P2", priorityTone: "warn", label: "Resolve Billing Backlog", age: "Yesterday", module: "finance", subTab: "Invoices" },
      { priority: "P2", priorityTone: "warn", label: "Restore Solar Feed", age: "2h", module: "utility", subTab: "Solar Generator" },
      { priority: "P2", priorityTone: "warn", label: "Validate Meter Imports", age: "Today", module: "utility", subTab: "Daily Readings" },
    ],
  },
  {
    key: "positive",
    title: "Positive Signals",
    count: 3,
    summary: "Evidence of effective operational execution",
    tone: "ok",
    items: [
      { priority: "P3", priorityTone: "ok", label: "24 Zero Incident Days", age: "Today", module: "safety", subTab: "Incidents" },
      { priority: "P3", priorityTone: "ok", label: "LTIR 0.00", age: "Today", module: "safety", subTab: "SOHI" },
      { priority: "P3", priorityTone: "ok", label: "Waste Recycling 43%", age: "Yesterday", module: "maintenance", subTab: "Waste" },
    ],
  },
  {
    key: "anomalies",
    title: "Anomalies",
    count: 3,
    summary: "Unusual readings requiring investigation",
    tone: "warn",
    items: [
      { priority: "P2", priorityTone: "warn", label: "Negative Meter Readings × 2", age: "2h", module: "utility", subTab: "Daily Readings" },
      { priority: "P2", priorityTone: "warn", label: "Common Area Consumption +12%", age: "Today", module: "utility", subTab: "Energy" },
      { priority: "P2", priorityTone: "warn", label: "0 Patrol Tickets Generated", age: "Today", module: "security", subTab: "Patrol" },
    ],
  },
  {
    key: "escalations",
    title: "Escalations",
    count: 2,
    summary: "Executive action required — cannot delegate",
    tone: "err",
    items: [
      { priority: "P1", priorityTone: "err", label: "Audit Programme Stalled — Escalate Now", age: "Today", module: "maintenance", subTab: "Audit" },
      { priority: "P1", priorityTone: "err", label: "Phantom Routes Inflating Patrol — Deactivate Import 12", age: "Today", module: "security", subTab: "Patrol" },
    ],
  },
  {
    key: "recently-changed",
    title: "Recently Changed",
    count: 0,
    summary: "Audit trail · no recent changes",
    tone: "purple",
    items: [],
  },
];

const INSIGHT_GLOW_TOTAL = INSIGHT_CATEGORIES.slice(0, 5).reduce((sum, cat) => sum + cat.count, 0);

// Per-module insight datasets — sourced from irInsightDatasets in fm_matrix_phase10 (29).html.
// Each module's Insights rail is grounded in that module's own tickets/assets/rows (not the
// generic cross-module list above), matching the reference's tab-aware "GLOBAL INSIGHTS RAIL".
const INSIGHT_CATEGORY_ORDER = [
  "critical",
  "attention",
  "op-backlog",
  "data-quality",
  "predictions",
  "recommendations",
  "positive",
  "anomalies",
  "escalations",
  "recently-changed",
] as const;

interface ModuleInsightHealth {
  critical: number;
  dueWeek: number;
  escalated: number;
  badge: string;
  badgeTone: InsightTone;
}

interface ModuleInsightDataset {
  title: string;
  subtitle: string;
  health: ModuleInsightHealth;
  items: Partial<Record<(typeof INSIGHT_CATEGORY_ORDER)[number], InsightItem[]>>;
}

const MODULE_INSIGHT_DATASETS: Record<string, ModuleInsightDataset> = {
  maintenance: {
    title: "Maintenance Intelligence",
    subtitle: "4 active insights",
    health: { critical: 2, dueWeek: 2, escalated: 0, badge: "HIGH RISK", badgeTone: "err" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "128 AMC Visits Missed", age: "Today", module: "maintenance", subTab: "AMC" },
        { priority: "P1", priorityTone: "err", label: "676 PPM Overdue", age: "Today", module: "maintenance", subTab: "Checklists" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "63 Asset Breakdowns", age: "Today", module: "maintenance", subTab: "Assets" },
        { priority: "P2", priorityTone: "warn", label: "SLA Breach 28%", age: "Today", module: "maintenance", subTab: "Tickets" },
      ],
    },
  },
  safety: {
    title: "Safety Intelligence",
    subtitle: "4 active insights",
    health: { critical: 1, dueWeek: 1, escalated: 2, badge: "WATCH", badgeTone: "warn" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "16 Permits Expired", age: "Today", module: "safety", subTab: "Permits" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "55 Draft Permits Stuck", age: "Today", module: "safety", subTab: "Permits" },
      ],
      positive: [
        { priority: "P3", priorityTone: "ok", label: "24 Zero Incident Days", age: "Today", module: "safety", subTab: "Incidents" },
        { priority: "P3", priorityTone: "ok", label: "LTIR 0.00", age: "Today", module: "safety", subTab: "SOHI" },
      ],
    },
  },
  finance: {
    title: "Financial Intelligence",
    subtitle: "4 active insights",
    health: { critical: 2, dueWeek: 2, escalated: 0, badge: "HIGH RISK", badgeTone: "err" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "950 Utility Bills Pending", age: "Today", module: "finance", subTab: "Invoices" },
        { priority: "P1", priorityTone: "err", label: "2 Invoices > 90 Days", age: "Today", module: "finance", subTab: "Invoices" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "130 Draft PRs", age: "Today", module: "finance", subTab: "Procurement" },
        { priority: "P2", priorityTone: "warn", label: "WO API Error", age: "Today", module: "finance", subTab: "Overview" },
      ],
    },
  },
  utility: {
    title: "Utility Intelligence",
    subtitle: "3 active insights",
    health: { critical: 1, dueWeek: 2, escalated: 0, badge: "WATCH", badgeTone: "warn" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "Solar Feed Stale", age: "Today", module: "utility", subTab: "Solar Generator" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "Meter Anomalies", age: "Today", module: "utility", subTab: "Daily Readings" },
        { priority: "P2", priorityTone: "warn", label: "Water Monitoring Gap", age: "Today", module: "utility", subTab: "Water" },
      ],
    },
  },
  crm: {
    title: "Tenant Intelligence",
    subtitle: "2 active insights",
    health: { critical: 1, dueWeek: 1, escalated: 0, badge: "WATCH", badgeTone: "warn" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "73% Washroom Negative", age: "Today", module: "crm", subTab: "Overview" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "Loyalty Redemption 0%", age: "Today", module: "crm", subTab: "Overview" },
      ],
    },
  },
  security: {
    title: "Security Intelligence",
    subtitle: "3 active insights",
    health: { critical: 1, dueWeek: 2, escalated: 0, badge: "HIGH RISK", badgeTone: "err" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "Patrol Gap Since Jan 2026", age: "Today", module: "security", subTab: "Patrol" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "2 Credentials Expired", age: "Today", module: "security", subTab: "Staff" },
        { priority: "P2", priorityTone: "warn", label: "0 Patrol Tickets Generated", age: "Today", module: "security", subTab: "Patrol" },
      ],
    },
  },
  vas: {
    title: "VAS Intelligence",
    subtitle: "2 active insights",
    health: { critical: 1, dueWeek: 1, escalated: 0, badge: "WATCH", badgeTone: "warn" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "OSR 15 Months Pending", age: "Today", module: "vas", subTab: "OSR" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "Loyalty Unredeemed", age: "Today", module: "vas", subTab: "F&B" },
      ],
    },
  },
  transitioning: {
    title: "Transition Intelligence",
    subtitle: "2 active insights",
    health: { critical: 1, dueWeek: 1, escalated: 0, badge: "WATCH", badgeTone: "warn" },
    items: {
      critical: [
        { priority: "P1", priorityTone: "err", label: "38 Open Snags", age: "Today", module: "transitioning", subTab: "Snagging" },
      ],
      attention: [
        { priority: "P2", priorityTone: "warn", label: "5 Violations", age: "Today", module: "transitioning", subTab: "Snagging" },
      ],
    },
  },
};

const DEFAULT_INSIGHT_HEALTH: ModuleInsightHealth = { critical: 5, dueWeek: 12, escalated: 2, badge: "HIGH RISK", badgeTone: "err" };

interface InsightRailData {
  title: string;
  subtitle: string;
  health: ModuleInsightHealth;
  categories: InsightCategory[];
}

// Mirrors updateInsightsForTab() in fm_matrix_phase10 (29).html: modules with a dedicated
// dataset show only their own non-empty categories; everything else falls back to the
// generic cross-module list (the reference's "management" / useExisting tab).
function getInsightRailData(moduleKey: string): InsightRailData {
  const dataset = MODULE_INSIGHT_DATASETS[moduleKey];
  if (!dataset) {
    return { title: "Insights", subtitle: "Portfolio Intelligence", health: DEFAULT_INSIGHT_HEALTH, categories: INSIGHT_CATEGORIES };
  }
  const categories: InsightCategory[] = INSIGHT_CATEGORY_ORDER.flatMap((key) => {
    const items = dataset.items[key];
    if (!items || items.length === 0) return [];
    const reference = INSIGHT_CATEGORIES.find((c) => c.key === key);
    return [
      {
        key,
        title: reference?.title ?? key,
        tone: reference?.tone ?? "warn",
        count: items.length,
        summary: `${items.length} item${items.length === 1 ? "" : "s"}`,
        items,
      },
    ];
  });
  return { title: dataset.title, subtitle: dataset.subtitle, health: dataset.health, categories };
}

interface InsightsRailProps {
  collapsed: boolean;
  onToggle: () => void;
  data: InsightRailData;
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  onNavigate: (module: string, subTab: string) => void;
}

function InsightsRail({ collapsed, onToggle, data, activeCategory, onCategoryChange, onNavigate }: InsightsRailProps) {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggle}
        title="Expand Insights panel"
        aria-label="Expand Insights panel"
        className="sticky top-4 flex w-[68px] flex-col items-center gap-2 rounded-lg border border-brand-border bg-white px-2 py-4 transition-shadow hover:shadow-md"
        style={{ boxShadow: "0 0 20px 2px rgba(218,119,86,0.4)" }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "rgba(218,119,86,0.15)", color: "#DA7756" }}
        >
          <Lightbulb className="h-4 w-4" />
        </span>
        <span className="text-brand-body-5 font-semibold text-brand-text">Insights</span>
        <span className="animate-pulse rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "#E7848E" }}>
          {INSIGHT_GLOW_TOTAL}
        </span>
      </button>
    );
  }

  return (
    <div className="sticky top-4 flex w-[300px] max-h-[calc(100vh-230px)] flex-shrink-0 flex-col overflow-y-auto rounded-lg border border-brand-border bg-white">
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
        <div>
          <div className="flex items-center gap-1.5 text-brand-body-3 font-bold text-brand-text">
            <Lightbulb className="h-4 w-4 text-brand" />
            {data.title}
          </div>
          <div className="text-brand-body-5 text-brand-text-light">{data.subtitle}</div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          title="Collapse insights rail"
          aria-label="Collapse insights rail"
          className="rounded p-1 text-brand-text-light transition-colors hover:text-brand-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="m-3 rounded-lg border px-3 py-2.5" style={{ borderColor: "#C4B89D", background: "#F6F4EE" }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold" style={{ color: "#2C2C2C" }}>Intelligence Health</span>
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: INSIGHT_CATEGORY_TONE_STYLES[data.health.badgeTone].bg, color: INSIGHT_CATEGORY_TONE_STYLES[data.health.badgeTone].color }}
          >
            {data.health.badge}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px]" style={{ color: "#798C5E" }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#108C72" }} />
          Monitoring
        </div>
        <div className="mt-2 flex items-center gap-5">
          <div>
            <div className="text-brand-h2 font-bold" style={{ color: "#E7848E" }}>{data.health.critical}</div>
            <div className="text-[9px]" style={{ color: "#888780" }}>Critical</div>
          </div>
          <div>
            <div className="text-brand-h2 font-bold" style={{ color: "#EDC488" }}>{data.health.dueWeek}</div>
            <div className="text-[9px]" style={{ color: "#888780" }}>Due This Week</div>
          </div>
          <div>
            <div className="text-brand-h2 font-bold" style={{ color: "#5A54A8" }}>{data.health.escalated}</div>
            <div className="text-[9px]" style={{ color: "#888780" }}>Escalated</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-[9px]" style={{ color: "#888780" }}>
          <span>Last Refresh</span>
          <span className="font-semibold" style={{ color: "#2C2C2C" }}>2 min ago</span>
        </div>
      </div>

      <div className="mx-3 mb-3 rounded-lg border px-3 py-2.5" style={{ borderColor: "#C4B89D", background: "#F6F4EE" }}>
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#2C2C2C" }}>Today's Executive Brief</div>
        <div className="mb-2 text-[10px]" style={{ color: "#798C5E" }}>Auto-generated portfolio summary</div>
        <div className="flex flex-col gap-1.5 text-[10px] leading-relaxed" style={{ color: "#2C2C2C" }}>
          <div className="flex gap-1.5">
            <span className="flex-shrink-0 font-bold" style={{ color: "#E7848E" }}>•</span>
            <span>Compliance deterioration across permits, audits and vendor accountability now spans multiple workflows.</span>
          </div>
          <div className="flex gap-1.5">
            <span className="flex-shrink-0 font-bold" style={{ color: "#E7848E" }}>•</span>
            <span>Utility billing at ~950 records is the highest unresolved financial exposure on the portfolio.</span>
          </div>
          <div className="flex gap-1.5">
            <span className="flex-shrink-0 font-bold" style={{ color: "#DA7756" }}>•</span>
            <span>128 AMC misses and 63 current asset breakdowns are tracked separately — a real trend link isn't confirmed yet, worth watching both together.</span>
          </div>
          <div className="flex gap-1.5">
            <span className="flex-shrink-0 font-bold" style={{ color: "#EDC488" }}>•</span>
            <span>Two escalations exceed operational thresholds and cannot be resolved without leadership intervention.</span>
          </div>
        </div>
      </div>

      <div className="pb-2">
        {data.categories.map((cat) => {
          const isOpen = activeCategory === cat.key;
          const tone = INSIGHT_CATEGORY_TONE_STYLES[cat.tone];
          return (
            <div key={cat.key} className="mb-1 px-1">
              <button
                type="button"
                onClick={() => onCategoryChange(isOpen ? "" : cat.key)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-brand-light"
              >
                <span className="flex-1 text-left text-brand-body-4 font-semibold text-brand-text">{cat.title}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: tone.bg, color: tone.color }}>
                  {cat.count}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-brand-text-light transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="pl-2 pr-1">
                  <div className="mb-1 text-[10px]" style={{ color: "#798C5E" }}>{cat.summary}</div>
                  {cat.items.length === 0 ? (
                    <div className="px-1 py-1.5 text-[10px] italic" style={{ color: "#798C5E" }}>
                      No recent structural changes detected.
                    </div>
                  ) : (
                    cat.items.map((item, idx) => {
                      const p = INSIGHT_ITEM_TONE_STYLES[item.priorityTone];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onNavigate(item.module, item.subTab)}
                          className="flex w-full items-center justify-between gap-2 rounded px-1.5 py-1 text-left transition-colors hover:bg-brand-light"
                        >
                          <span className="text-brand-body-5 leading-snug text-brand-text">
                            <span className="mr-1 rounded px-1 py-px text-[9px] font-bold" style={{ background: p.bg, color: p.color }}>
                              {item.priority}
                            </span>
                            {item.label}
                          </span>
                          <span className="flex flex-shrink-0 items-center gap-1.5">
                            {item.isNew && (
                              <span className="rounded px-1 py-px text-[8px] font-bold" style={{ background: "rgba(16,140,114,0.12)", color: "#108C72" }}>
                                <span className="mr-0.5 inline-block h-1 w-1 animate-pulse rounded-full bg-current" />
                                NEW
                              </span>
                            )}
                            <span className="text-[9px]" style={{ color: "#888780" }}>{item.age}</span>
                            <span className="text-[10px]" style={{ color: "#798C5E" }}>→</span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RevampDashboardPage() {
  const [activeModule, setActiveModule] = useState<string>(MODULES[0].key);
  const current = MODULES.find((m) => m.key === activeModule) ?? MODULES[0];
  const [activeSubTab, setActiveSubTab] = useState<string>(current.subTabs[0]);
  const [timeSegment, setTimeSegment] = useState("Today");
  const [goldenActive, setGoldenActive] = useState(false);
  const [redFlagActive, setRedFlagActive] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [activeInsightCategory, setActiveInsightCategory] = useState("critical");
  const insightRailData = useMemo(() => getInsightRailData(activeModule), [activeModule]);
  useEffect(() => {
    setActiveInsightCategory(insightRailData.categories[0]?.key ?? "");
  }, [insightRailData]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isTicketsView =
    activeModule === "maintenance" &&
    (activeSubTab === "Tickets" ||
      activeSubTab === "Assets" ||
      activeSubTab === "Audit" ||
      activeSubTab === "AMC" ||
      activeSubTab === "Checklists" ||
      activeSubTab === "Inventory" ||
      activeSubTab === "Waste" ||
      activeSubTab === "Attendance" ||
      activeSubTab === "Survey" ||
      activeSubTab === "Vendor");
  const isSafetyView = activeModule === "safety";

  const maintenanceSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const registerMaintenanceSectionRef = (key: string) => (el: HTMLDivElement | null) => {
    maintenanceSectionRefs.current[key] = el;
  };
  const navRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTicketsView) return;
    const el = maintenanceSectionRefs.current[activeSubTab];
    const container = scrollRef.current;
    if (!el || !container) return;
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top - 12;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [activeSubTab, isTicketsView]);

  const [ticketsLayout, setTicketsLayout] = useState<GridLayout.Layout[]>(() =>
    reconcileLayout(loadStoredLayout())
  );

  const persistTicketsLayout = (layout: GridLayout.Layout[]) => {
    setTicketsLayout(layout);
    localStorage.setItem(TICKETS_GRID_STORAGE_KEY, JSON.stringify(layout));
  };

  const resetTicketsLayout = () => {
    localStorage.removeItem(TICKETS_GRID_STORAGE_KEY);
    setTicketsLayout(DEFAULT_TICKETS_LAYOUT);
  };

  const scrollTabs = (direction: -1 | 1) => {
    tabsRef.current?.scrollBy({ left: direction * 200, behavior: "smooth" });
  };

  const handleModuleChange = (moduleKey: string) => {
    setActiveModule(moduleKey);
    const nextModule = MODULES.find((m) => m.key === moduleKey);
    setActiveSubTab(nextModule?.subTabs[0] ?? "");
  };

  const navigateTo = (moduleKey: string, subTab: string) => {
    setActiveModule(moduleKey);
    setActiveSubTab(subTab);
  };

  return (
    <div className="bg-brand-bg h-screen flex flex-col overflow-hidden">
      <div ref={navRef} className="flex-shrink-0 z-30 bg-brand-bg">
      {/* Title bar */}
      <div className="flex items-center justify-between bg-white border-b border-brand-border px-6 py-4">
        <h1 className="text-brand-h2 font-bold text-brand-text">Dashboard View</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-brand-border px-3 py-2 text-brand-body-4 text-brand font-medium"
          >
            <CalendarDays className="w-4 h-4" />
            03/08/2025 - 03/08/2026
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-brand-border px-3 py-2 text-brand-body-4 text-brand-text font-medium"
          >
            <BarChart3 className="w-4 h-4 text-brand" />
            Analytics ({MODULES.length})
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Underline tab nav */}
      <div className="flex items-center bg-white border-b border-brand-border px-2">
        <button
          type="button"
          onClick={() => scrollTabs(-1)}
          className="flex-shrink-0 p-2 text-brand-text-light hover:text-brand-text"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div ref={tabsRef} className="flex overflow-x-auto scrollbar-hide">
          {MODULES.map((module) => {
            const isActive = module.key === activeModule;
            return (
              <button
                key={module.key}
                type="button"
                onClick={() => handleModuleChange(module.key)}
                className={cn(
                  "flex-shrink-0 whitespace-nowrap px-4 py-3 text-brand-body-4 font-medium border-b-2 transition-colors",
                  isActive
                    ? "text-brand border-brand"
                    : "text-brand-text border-transparent hover:text-brand"
                )}
              >
                {module.label}
              </button>
            );
          })}
        </div>
      </div>

      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex items-start gap-4">
        <InsightsRail
          collapsed={railCollapsed}
          onToggle={() => setRailCollapsed((v) => !v)}
          data={insightRailData}
          activeCategory={activeInsightCategory}
          onCategoryChange={setActiveInsightCategory}
          onNavigate={navigateTo}
        />
        <div className="min-w-0 flex-1">
        {/* Pill sub-navbar for the active module */}
        <div className="flex flex-wrap gap-3 pt-4 pb-4">
          {current.subTabs.map((subTab) => {
            const isActive = subTab === activeSubTab;
            return (
              <button
                key={subTab}
                type="button"
                onClick={() => setActiveSubTab(subTab)}
                className={cn(
                  "rounded-full border px-5 py-2 text-brand-body-4 font-semibold transition-colors",
                  isActive
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-brand-green border-brand-sidebar hover:bg-brand-light"
                )}
              >
                {subTab}
              </button>
            );
          })}
        </div>

        {activeModule === "maintenance" && activeSubTab === "Tickets" && (
          <div className="pb-4">
            <FilterPillBar
              segments={["Today", "This Week", "This Month"]}
              activeSegment={timeSegment}
              onSegmentChange={setTimeSegment}
              goldenActive={goldenActive}
              onGoldenToggle={() => setGoldenActive((v) => !v)}
              redFlagActive={redFlagActive}
              onRedFlagToggle={() => setRedFlagActive((v) => !v)}
            />
          </div>
        )}
        {isTicketsView ? (
          <>
          <div className="relative w-full">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={resetTicketsLayout}
                className="flex items-center gap-1.5 text-brand-body-5 text-brand-text-light hover:text-brand-green"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset layout
              </button>
            </div>

            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: reconcileLayout(ticketsLayout) }}
              onDragStop={(layout) => persistTicketsLayout(layout)}
              onResizeStop={(layout) => persistTicketsLayout(layout)}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={48}
              margin={[16, 16]}
              resizeHandles={["se"]}
              containerPadding={[0, 0]}
              compactType="vertical"
              draggableCancel=".no-drag"
              isDraggable
              isResizable
            >
              <div key="hero-sla" className="h-full">
                <div ref={registerMaintenanceSectionRef("Tickets")} className="h-0" />
                <StatHeroCard
                  tone="purple"
                  label="Response SLA"
                  value="72%"
                  accent="success"
                  subtitle="28% breached · 42% resol."
                  progress={72}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="hero-customer" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Customer Tickets"
                  value="487"
                  accent="info"
                  subtitle="Tenant / occupant complaints"
                  className="h-full overflow-auto"
                />
              </div>
              <div key="hero-internal" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="Internal Tickets"
                  value="192"
                  accent="green"
                  subtitle="Operational / FM team raised"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="ticket-pool" className="h-full">
                <PieChartCard
                  title="Ticket pool composition"
                  subtitle="969 total · Pending / In Progress / On Hold / Closed"
                  data={TICKET_POOL_DATA}
                  centerLabel="969"
                  legendPosition="right"
                  showInfoIcon
                  insightVariant="plain"
                  insight="Pending + In Progress together are over 70% of the whole pool — most of the backlog hasn't even reached a resolution attempt yet, let alone breached."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="category-bar" className="h-full">
                <BarChartCard
                  title="Category comparison"
                  subtitle="Status breakdown per category · click any column to sort · click a row to drill in"
                  data={CATEGORY_STACK_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  stacked
                  showInfoIcon
                  insightVariant="plain"
                  insight="Repair & Maintenance and General Tickets are stacked with Pending + In Progress and almost no Closed — nobody has picked most of these up yet. Air Conditioner and FSC are mostly Closed — a different, healthier shape entirely."
                  seriesColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#9EC8BA"]}
                  series={[
                    { dataKey: "pending", name: "Pending" },
                    { dataKey: "inProgress", name: "In Progress" },
                    { dataKey: "onHold", name: "On Hold" },
                    { dataKey: "closed", name: "Closed" },
                  ]}
                  valueDomain={[0, 300]}
                  valueTicks={[0, 50, 100, 150, 200, 250, 300]}
                  height={260}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="category-table" className="h-full">
                <DataTableCard
                  title="Category comparison — detail"
                  subtitle="Total, breach rate, trend and average ageing per category"
                  columns={CATEGORY_TABLE_COLUMNS}
                  data={CATEGORY_TABLE_DATA}
                  getRowKey={(row) => row.category}
                  insight="Repair & Maintenance and General Tickets are both breaching badly and getting worse month over month. Air Conditioner is breaching the least and improving."
                  className="h-full overflow-auto no-drag"
                />
              </div>

              <div key="reply-resolution" className="h-full">
                <ComboBarLineChartCard
                  title="First Reply vs Resolution Time"
                  subtitle="Monthly · bars = reply (hrs), line = resolution (days)"
                  data={REPLY_VS_RESOLUTION_DATA}
                  categoryKey="month"
                  bar={{ dataKey: "replyHrs", name: "Avg Reply (hrs)" }}
                  line={{ dataKey: "resolutionDays", name: "Avg Resolution (days)" }}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Shows whether the problem is slow response or slow resolution. If the bars stay low but the line climbs, the team is picking up tickets on time but can't close them."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="sla-breach" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <BarChartCard
                  title="All-time SLA breach analysis"
                  subtitle="Every breach, 12 months · not just what's due soon"
                  data={SLA_BREACH_TREND_DATA}
                  categoryKey="month"
                  categoryColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#8E7BE0", "#8E7BE0"]}
                  series={[{ dataKey: "breaches", name: "Breaches" }]}
                  showInfoIcon
                  height={140}
                  className="border-none shadow-none p-0"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-brand-bg border border-brand-border rounded-lg">
                    <div className="text-brand-caption text-brand-text-light uppercase">Total Breaches</div>
                    <div className="text-brand-body-3 font-bold text-brand-error">1,847</div>
                  </div>
                  <div className="text-center p-3 bg-brand-bg border border-brand-border rounded-lg">
                    <div className="text-brand-caption text-brand-text-light uppercase">% of All Tickets</div>
                    <div className="text-brand-body-3 font-bold text-brand-error">61%</div>
                  </div>
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  This is the full history, not a forward-looking snapshot — breach volume has been climbing
                  steadily for 8 of the last 12 months, not just recently.
                </p>
              </div>

              <div key="resolved-age" className="h-full">
                <BarChartCard
                  title="Resolved tickets by age tier"
                  subtitle="How fast are tickets actually getting closed?"
                  data={RESOLVED_AGE_TIER_DATA}
                  categoryKey="tier"
                  series={[{ dataKey: "count", name: "Resolved" }]}
                  categoryColors={AGE_TIER_COLORS}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Most resolutions take over 48 hours. The fast buckets are a rounding error next to the 48h+ bar."
                  className="h-full overflow-auto"
                />
              </div>
              <div key="unresolved-age" className="h-full">
                <BarChartCard
                  title="Unresolved tickets by age tier"
                  subtitle="How long has the still-open backlog been waiting?"
                  data={UNRESOLVED_AGE_TIER_DATA}
                  categoryKey="tier"
                  series={[{ dataKey: "count", name: "Unresolved" }]}
                  categoryColors={AGE_TIER_COLORS}
                  showInfoIcon
                  insightVariant="plain"
                  insight="This isn't resolution speed — it's how old the current backlog already is. A tall 48h+ bar means tickets are aging in place, not just taking a while once picked up."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="ticket-heatmap" className="h-full">
                <TicketHeatmapCard
                  title="Ticket volume · hour × day"
                  subtitle="When does demand actually spike?"
                  days={HEATMAP_DAYS}
                  hours={HEATMAP_HOURS}
                  data={HEATMAP_DATA}
                  insight="Shows whether certain shifts or days carry disproportionate load. Filter to any date range independently of the rest of the dashboard."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="tech-workload" className="h-full">
                <BarChartCard
                  title="Technician workload"
                  subtitle="Open tickets assigned · sorted highest to lowest · dashed line = team average"
                  data={TECH_WORKLOAD_DATA}
                  categoryKey="tech"
                  orientation="horizontal"
                  categoryColors={TECH_WORKLOAD_COLORS}
                  series={[{ dataKey: "count", name: "Open Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Shows who is carrying too much. A redistribution opportunity, not just a workload report."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="golden-open" className="h-full">
                <StatHeroCard tone="purple" label="Golden Open" value="7" accent="warning" subtitle="VIP/senior-priority tickets" className="h-full" />
              </div>
              <div key="redflag-open" className="h-full">
                <StatHeroCard tone="teal" label="Red Flag Open" value="11" accent="error" subtitle="Separate manual flag" className="h-full" />
              </div>
              <div key="golden-age" className="h-full">
                <StatHeroCard tone="peach" label="Golden Avg Age" value="22d" accent="error" subtitle="vs 15d site-wide" className="h-full" />
              </div>
              <div key="sitewide-age" className="h-full">
                <StatHeroCard tone="blue" label="Site-wide Avg Age" value="15d" accent="info" subtitle="Benchmark line on chart below" className="h-full" />
              </div>

              <div key="golden-redflag-chart" className="h-full">
                <BarChartCard
                  title="Golden & Red Flag analysis — by person, by age"
                  subtitle="Merged view: who applies each flag, and whether it actually changes ticket age · dashed line = site-wide avg (15d)"
                  data={GOLDEN_REDFLAG_AGE_DATA}
                  categoryKey="person"
                  series={[
                    { dataKey: "golden", name: "Golden avg age" },
                    { dataKey: "redFlag", name: "Red Flag avg age" },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Several Golden tickets are aging worse than the site-wide average — a VIP flag that doesn't speed up response is decorative, not operational. Abdul Ghaffar applies both flags far more than anyone else."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="golden-aged-table" className="h-full">
                <StatListCard
                  title="Golden tickets aged past average"
                  subtitle="Sitting longer than the site-wide 15d benchmark"
                  rows={GOLDEN_AGED_ROWS.map((row) => ({
                    label: `${row.id} · ${row.label}`,
                    badge: { tone: row.tone, label: `${row.ageDays}d` },
                  }))}
                  note="These should be the first tickets touched each morning, not buried in the general queue."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="godrej-distress" className="h-full">
                <StatListCard
                  title="Godrej Living is showing distress in two separate systems"
                  subtitle="Same tenant, two independent signals — not a coincidence worth ignoring"
                  borderTone="error"
                  rows={[
                    { label: "Ticket volume", badge: { tone: "red", label: "142 — highest of any tenant" } },
                    { label: "OSR backlog (Value Added Services)", badge: { tone: "red", label: "Also the top account there" } },
                  ]}
                  note="A tenant leading in ticket volume AND service-request backlog at the same time points to an account-level relationship problem — worth a single conversation with this tenant, not two separate ones."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="by-user" className="h-full">
                <StatListCard
                  title="By User"
                  subtitle="Who's raising the most tickets"
                  rows={[
                    { label: "Parag Patil", value: "64" },
                    { label: "Mahendra Lungare", value: "51" },
                    { label: "Sadanand Gupta", value: "38" },
                  ]}
                  note="Worth checking whether Parag's volume is genuine reporting or logging on behalf of others."
                  className="h-full overflow-auto"
                />
              </div>
              <div key="by-dept" className="h-full">
                <StatListCard
                  title="By Department"
                  subtitle="Which team generates the most volume"
                  rows={[
                    { label: "IT", value: "218" },
                    { label: "Facilities", value: "184" },
                    { label: "Admin", value: "96" },
                  ]}
                  note="Confirms the same Audio Video/IT dominance already seen in Category Comparison."
                  className="h-full overflow-auto"
                />
              </div>
              <div key="by-tenant" className="h-full">
                <StatListCard
                  title="By Tenant"
                  subtitle="Which tenant raises the most"
                  rows={[
                    { label: "Godrej Living", badge: { tone: "red", label: "142 ⚠" } },
                    { label: "HSBC", value: "98" },
                    { label: "Deepak Gupta (Individual)", value: "41" },
                  ]}
                  note="See the callout above — this isn't just a ranking, it's half of a two-system pattern."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="location-volume" className="h-full">
                <BarChartCard
                  title="Location-wise Ticket Volume"
                  subtitle="Which floors/buildings generate the most tickets"
                  data={LOCATION_TICKET_VOLUME_DATA}
                  categoryKey="location"
                  orientation="horizontal"
                  series={[{ dataKey: "tickets", name: "Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Business Bay leads volume — worth checking whether that's tenant density or an equipment/quality problem specific to that building."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="csat" className="h-full">
                <StatHeroCard tone="purple" label="Customer Satisfaction Score" value="3.1/5" accent="warning" subtitle="Post-resolution rating, tickets module" className="h-full" />
              </div>
              <div key="escalation" className="h-full">
                <StatHeroCard tone="teal" label="Approaching Escalation" value="14" accent="error" subtitle="Tickets within 4 hours of breaching SLA" className="h-full" />
              </div>

              <div key="source-origin" className="h-full">
                <BarChartCard
                  title="Source-wise ticket origin"
                  subtitle="Asset · Checklist · Survey · Patrolling — where tickets actually come from"
                  data={SOURCE_ORIGIN_DATA}
                  categoryKey="source"
                  orientation="horizontal"
                  categoryColors={SOURCE_ORIGIN_COLORS}
                  series={[{ dataKey: "tickets", name: "Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight='If Patrolling generates almost no tickets despite 41 completed patrols, that confirms the same "0 tickets from patrols" gap already flagged in Security.'
                  className="h-full overflow-auto"
                />
              </div>

              <div key="repeat-complaints" className="h-full">
                <BarChartCard
                  title="Repeat Complaints"
                  subtitle="Same tenant, same issue, raised more than once — a fix that isn't holding"
                  data={REPEAT_COMPLAINTS_DATA}
                  categoryKey="issue"
                  categoryColors={["#DA7756", "#DA7756"]}
                  series={[{ dataKey: "count", name: "Occurrences" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Not a separate finding from Vendor's Repeat Service Requests — same root cause, visible from two different tabs. Worth resolving once, not tracking twice."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-linked-tickets" className="h-full">
                <BarChartCard
                  title="Asset-Breakdown-Linked Tickets"
                  subtitle="8 tickets total, traceable to just 2 repeat-offender assets"
                  data={ASSET_LINKED_TICKETS_DATA}
                  categoryKey="asset"
                  categoryColors={["#DA7756", "#DA7756"]}
                  series={[{ dataKey: "count", name: "Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Same assets already flagged in Assets' Repeat Breakdown card. DG Sync Panel's 5 tickets are the ticket-side proof that repairing it again is treating a symptom, not the actual decision that needs making."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="smart-insights" className="h-full">
                <StatListCard
                  title="🤖 Smart Insights — Ticket Module"
                  subtitle="Grounded in this site's actual data, not generic templates"
                  borderTone="warning"
                  rows={[
                    { label: "High Repeat Complaints", value: "Godrej Living AC (3x), HSBC Network (2x)" },
                    { label: "Increasing SLA Breaches", value: "28% breach rate, 14 approaching" },
                    { label: "Frequent Asset-Related Tickets", value: "DG Sync Panel: 5 tickets from 1 asset" },
                    { label: "High Pending Critical Tickets", value: "Golden tickets aging past 15d benchmark" },
                    { label: "Low Technician Closure Rate", value: "IT 218 vs Facilities 184" },
                    { label: "Peak Complaint Hours Detected", value: "See pattern below" },
                    { label: "High Reopened Tickets", value: "Repeat Complaints = reopened under new ID" },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="peak-hours" className="h-full">
                <BarChartCard
                  title="Peak Complaint Hours"
                  subtitle="Hour-of-day ticket creation pattern"
                  data={PEAK_COMPLAINT_HOURS_DATA}
                  categoryKey="hour"
                  categoryColors={PEAK_HOURS_COLORS}
                  series={[{ dataKey: "count", name: "Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Useful for scheduling technician shifts around actual complaint timing, not a flat roster."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="assets-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Assets")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Asset Management Dashboard
                </span>
              </div>

              <div key="asset-hero-total" className="h-full">
                <StatHeroCard tone="purple" label="Total Assets" value="378" accent="neutral" subtitle="Full site inventory" className="h-full overflow-auto" />
              </div>
              <div key="asset-hero-good" className="h-full">
                <StatHeroCard tone="teal" label="Good Condition" value="241" accent="success" subtitle="64% · Operating normally" className="h-full overflow-auto" />
              </div>
              <div key="asset-hero-fair" className="h-full">
                <StatHeroCard tone="peach" label="Fair Condition" value="82" accent="warning" subtitle="22% · Requires monitoring" className="h-full overflow-auto" />
              </div>
              <div key="asset-hero-bad" className="h-full">
                <StatHeroCard tone="blue" label="Bad Condition" value="55" accent="error" subtitle="14% · Needs repair or replacement" className="h-full overflow-auto" />
              </div>
              <div key="asset-hero-health" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Equipment Health Score"
                  value="6.4/10"
                  accent="warning"
                  subtitle="Condition-based monitoring"
                  progress={64}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="asset-hero-replacement" className="h-full">
                <StatHeroCard tone="peach" label="Replacement Due" value="14" accent="error" subtitle="End-of-life · Procure now" className="h-full overflow-auto" />
              </div>

              <div key="asset-health-card" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-bold text-brand-text">Asset Health</h3>
                    <p className="text-brand-body-5 text-brand-text-light">
                      378 total · <span className="text-brand-error font-semibold">16.7% breakdown rate</span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <TableBadge tone="green">In Use · 323</TableBadge>
                      <TableBadge tone="red">Breakdown · 63</TableBadge>
                      <TableBadge tone="blue">Allocated · 60</TableBadge>
                      <TableBadge tone="grey">In Store · 1</TableBadge>
                    </div>
                    <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                      Top 3 Currently Down
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">DG Sync Panel — Business Bay</span>
                        <TableBadge tone="red">48h down</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">CCTV Camera — Gate 2</span>
                        <TableBadge tone="red">36h down</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">UPS Room Panel — Lobby W1</span>
                        <TableBadge tone="amber">12h down</TableBadge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="asset-breakdown-gauge" className="h-full">
                <GaugeChartCard
                  title="Breakdown rate vs acceptable range"
                  subtitle="378 total assets · acceptable: 5–10%"
                  segments={[
                    { value: 70, color: "#E39090" },
                    { value: 15, color: "#CDCAF5" },
                    { value: 15, color: "#76CDC1" },
                  ]}
                  centerValue="100"
                  centerLabel="Total"
                  showInfoIcon
                  insightVariant="plain"
                  insight="Breakdown rate sits above the acceptable band. This means there is no current visibility into asset condition beyond breakdown reports."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-value-risk" className="h-full">
                <HighlightStatCard
                  title="Asset value at risk right now"
                  subtitle="Portion of ₹38.28L total asset value sitting in currently-broken equipment"
                  value="₹6.1L"
                  valueCaption="16% of total value"
                  tone="error"
                  description={
                    '"63 assets are broken" is an operations number. "₹6.1L of your asset base is non-functional right now" is a budget number — the breakdowns are concentrated in a handful of higher-value equipment, not evenly spread across cheap items.'
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-critical-noncritical" className="h-full">
                <BarChartCard
                  title="Critical vs Non-Critical breakdown rate"
                  subtitle="Is the equipment that matters most failing hardest?"
                  data={CRITICAL_BREAKDOWN_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  unit="%"
                  categoryColors={["#DA7756", "#9EC8BA"]}
                  series={[{ dataKey: "rate", name: "Breakdown rate" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="If Critical assets break down at a higher rate than Non-Critical ones, maintenance priority is inverted from where it should be — the equipment that matters most is getting the least protection."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-repeat-breakdowns" className="h-full">
                <StatListCard
                  title="Repeat breakdowns"
                  subtitle="Same asset failing more than once — a replace-it signal, not a repair-it signal"
                  rows={[
                    { label: "DG Sync Panel — Business Bay", badge: { tone: "red", label: "3rd breakdown this year" } },
                    { label: "CCTV Camera — Gate 2", badge: { tone: "amber", label: "2nd breakdown this year" } },
                  ]}
                  note="Every breakdown currently looks identical regardless of history. These two have failed before — repairing again is treating a symptom, not the equipment's actual condition."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-breakdown-allocation" className="h-full">
                <BarChartCard
                  title="Breakdowns by allocation"
                  subtitle="Which department or team is holding the most broken equipment"
                  data={BREAKDOWN_BY_ALLOCATION_DATA}
                  categoryKey="team"
                  orientation="horizontal"
                  categoryColors={BREAKDOWN_BY_ALLOCATION_COLORS}
                  series={[{ dataKey: "count", name: "Breakdowns" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="A named target for a conversation, not just an aggregate percentage — if breakdowns cluster under one team, that's specific enough to act on today."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-category-breakdown" className="h-full">
                <BarChartCard
                  title="Category-wise Asset Breakdown"
                  subtitle="Building · Land · Vehicle · IT · Non-IT · Meter · Furniture"
                  data={CATEGORY_ASSET_BREAKDOWN_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  categoryColors={CATEGORY_ASSET_BREAKDOWN_COLORS}
                  series={[{ dataKey: "count", name: "Assets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="IT and Non-IT dominate the portfolio by count — worth checking whether Vehicle and Meter categories (smaller count, often higher unit value) are getting proportionate maintenance attention."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-lifecycle" className="h-full">
                <PieChartCard
                  title="Asset Lifecycle Status"
                  subtitle="In Use · Breakdown · Allocated · In Store · Disposed"
                  data={ASSET_LIFECYCLE_DATA}
                  centerLabel="378"
                  showInfoIcon
                  insightVariant="plain"
                  insight="Disposed assets (written off) are now tracked separately from In Store (still on-site, unassigned) — these were previously conflated."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-amc-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="Assets Under AMC Coverage %"
                    value="73%"
                    accent="warning"
                    subtitle="276 of 378 assets have an active AMC contract"
                    borderAccent="warning"
                  />
                  <StatHeroCard
                    tone="teal"
                    label="Assets Without AMC Coverage"
                    value="102"
                    accent="error"
                    subtitle="27% of portfolio, zero contract"
                    borderAccent="error"
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  Cross-referenced against the 364 AMC contracts already tracked in AMC — 102 assets running with no
                  service contract at all is a real gap, not an estimate.
                </p>
              </div>

              <div key="asset-mttr-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="MTTR — Mean Time To Repair"
                    value="34hrs"
                    accent="warning"
                    subtitle="Avg across DG Sync Panel + CCTV Camera repeat-breakdown history"
                    borderAccent="warning"
                  />
                  <StatHeroCard
                    tone="teal"
                    label="MTBF — Mean Time Between Failures"
                    value="47d"
                    accent="error"
                    subtitle="DG Sync Panel: 3 breakdowns this year, ~47 days apart"
                    borderAccent="error"
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  Computed from the same repeat-breakdown records already tracked above — DG Sync Panel and CCTV
                  Camera are the only assets with enough breakdown history to calculate this reliably; the rest of
                  the portfolio needs more repair-timestamp history before MTTR/MTBF is meaningful sitewide.
                </p>
              </div>

              <div key="asset-repair-cost-ratio" className="h-full">
                <BarChartCard
                  title="Repair Cost vs Asset Value Ratio"
                  subtitle="Which assets are approaching a genuine repair-vs-replace decision"
                  data={REPAIR_COST_RATIO_DATA}
                  categoryKey="asset"
                  orientation="horizontal"
                  unit="%"
                  categoryColors={REPAIR_COST_RATIO_COLORS}
                  series={[{ dataKey: "ratio", name: "Repair cost ratio" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="DG Sync Panel's cumulative repairs are approaching 40% of replacement cost — past 50% is the usual threshold where replacing outright becomes cheaper than continuing to repair."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-cost-by-category" className="h-full">
                <BarChartCard
                  title="Cost by Asset Category"
                  subtitle="₹38.28L total portfolio value, split by category"
                  data={COST_BY_CATEGORY_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  unit="L"
                  categoryColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#8E7BE0"]}
                  series={[{ dataKey: "value", name: "₹L" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="IT carries the highest total value despite not having the highest unit count — a handful of expensive IT assets outweigh many cheaper furniture/fixture items."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-high-maintenance" className="h-full">
                <StatListCard
                  title="High Maintenance Cost Assets"
                  subtitle="Ranked by cumulative repair spend this year"
                  borderTone="error"
                  rows={[
                    { label: "DG Sync Panel — Business Bay", badge: { tone: "red", label: "₹42,000 · 3 repairs" } },
                    { label: "CCTV Camera — Gate 2", badge: { tone: "amber", label: "₹18,500 · 2 repairs" } },
                    { label: "UPS Room Panel — Lobby W1", badge: { tone: "amber", label: "₹9,200 · 1 repair" } },
                  ]}
                  note="Same underlying data as Repair Cost vs Asset Value Ratio above, ranked by absolute ₹ spend rather than percentage — useful for prioritizing budget conversations by real cost, not just ratio."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-ownership-cost" className="h-full">
                <StatListCard
                  title="Asset Ownership Cost Analysis"
                  subtitle="Repair spend + AMC contract cost, per asset — the real cost of keeping something running"
                  borderTone="warning"
                  rows={[
                    { label: "DG Sync Panel — repair + AMC", badge: { tone: "red", label: "₹42,000 + AMC share ≈ ₹58,000/yr" } },
                    { label: "CCTV Camera — repair + AMC", badge: { tone: "amber", label: "₹18,500 + AMC share ≈ ₹26,000/yr" } },
                  ]}
                  note="This is the number that actually matters for a replace decision — not just repair cost alone, but total annual cost of ownership including the AMC contract covering it."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Audit")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Audit Dashboard
                </span>
              </div>

              <div key="audit-open-observations" className="h-full">
                <StatHeroCard tone="purple" label="Open Observations" value="27" accent="error" subtitle="Audit findings pending closure" className="h-full overflow-auto" />
              </div>
              <div key="audit-score" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Audit Score"
                  value="35%"
                  accent="error"
                  subtitle="Programme stalled — escalate"
                  progress={35}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-asset-completion-pct" className="h-full">
                <StatHeroCard tone="purple" label="Asset Audit Completion %" value="14.8%" accent="error" subtitle="4 of 27 scheduled asset audits physically verified" className="h-full overflow-auto" />
              </div>
              <div key="audit-missing-assets" className="h-full">
                <StatHeroCard tone="teal" label="Missing Assets Detected" value="6" accent="error" subtitle="In system, not found physically during the 4 completed audits" className="h-full overflow-auto" />
              </div>
              <div key="audit-missing-docs" className="h-full">
                <StatHeroCard tone="purple" label="Assets Missing Documentation" value="31" accent="warning" subtitle="No invoice, warranty, AMC, or manual on file" className="h-full overflow-auto" />
              </div>
              <div key="audit-qr-compliance" className="h-full">
                <StatHeroCard tone="teal" label="QR / Barcode Compliance %" value="61%" accent="warning" subtitle="Properly tagged for identification and tracking" className="h-full overflow-auto" />
              </div>

              <div key="audit-unauthorized-movement" className="h-full">
                <StatListCard
                  title="Unauthorized Asset Movement Alerts"
                  subtitle="Assets shifted from designated location without approval"
                  borderTone="error"
                  rows={[
                    { label: "CCTV Camera — moved from Gate 2 to storage", badge: { tone: "red", label: "No approval on file" } },
                    { label: "UPS Room Panel — relocated within Lobby W1", badge: { tone: "amber", label: "Logged after the fact" } },
                  ]}
                  note="Only 4 of 27 audits are complete — this count will very likely grow once the rest are physically verified."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-status-overview" className="h-full">
                <PieChartCard
                  title="Audit Status Overview"
                  subtitle="Scheduled · Conducted · Pending · Overdue"
                  data={AUDIT_STATUS_OVERVIEW_DATA}
                  centerLabel="27"
                  showInfoIcon
                  insightVariant="plain"
                  insight="23 of 27 scheduled audits are now Overdue — this is the same 35% Audit Score crisis, shown as a status breakdown instead of a single percentage."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-kpi-table" className="h-full">
                <DataTableCard
                  title="Operational & Vendor Audit KPIs"
                  subtitle="Formula-based, per SPOC requirements"
                  columns={AUDIT_KPI_COLUMNS}
                  data={AUDIT_KPI_DATA}
                  getRowKey={(row) => row.kpi}
                  insight="Average Audit Score is now computed from the actual scores of the 4 completed audits (previously this row incorrectly showed a document-upload count instead) — 62/100 is based on a very small sample and will move a lot as more audits complete."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-red-flags" className="h-full">
                <StatListCard
                  title="🚨 Red Flags"
                  subtitle="Compliance risks requiring attention — all 8, per SPOC"
                  borderTone="error"
                  rows={[
                    { label: "Overdue Audits", badge: { tone: "red", label: "23 of 27" } },
                    { label: "Critical Audit Observations", badge: { tone: "red", label: "9 High Severity" } },
                    { label: "Open High Priority CAPA", badge: { tone: "red", label: "18 pending" } },
                    { label: "Overdue CAPA Tasks", badge: { tone: "red", label: "8 past target date" } },
                    { label: "Repeat Audit Findings", value: "Same observation, multiple audits — needs tracking" },
                    { label: "Low Performing Vendors", badge: { tone: "amber", label: "Unicorn InfoSol., Help Test" } },
                    { label: "Sites with Maximum Findings", badge: { tone: "red", label: "Business Bay — 14 of 27 observations" } },
                    { label: "Upcoming Audit Reviews", badge: { tone: "amber", label: "3 due within 14 days" } },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-insights" className="h-full">
                <StatListCard
                  title="🤖 Audit Insights"
                  subtitle="Grounded in this site's actual data, not generic advice"
                  borderTone="warning"
                  rows={[
                    { label: "High-Risk Vendor Alert", value: "Unicorn InfoSol. and Help Test both below passing — same names already flagged in Vendor" },
                    { label: "CAPA Priority Recommendation", value: "8 of 18 pending CAPA tasks are already overdue — action these first, not by age alone" },
                    { label: "Recurring Observation Analysis", value: "Fire Alarm Panel and Rooftop Water Tank repeat as findings — same items already flagged in Checklists" },
                    { label: "Audit Frequency Recommendation", value: "Business Bay carries 14 of 27 findings — more frequent audits there, not a blanket increase" },
                    { label: "Compliance Risk Prediction", value: "Vendors with 0% pass rate (never audited) are the highest-risk unknowns" },
                    { label: "Training Recommendation", value: "68% of audit execution runs through Abdul Ghaffar alone — cross-train a second auditor" },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-status-repository" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-bold text-brand-text">Audit Status & Repository</h3>
                    <p className="text-brand-body-5 text-brand-text-light">Audit progress · documents · certificates</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Asset Audits</div>
                        <div className="text-brand-body-3 font-bold text-brand-error">
                          0<span className="text-brand-caption">/27</span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Operational</div>
                        <div className="text-brand-body-3 font-bold text-[#8A5A00]">
                          4<span className="text-brand-caption">/10</span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Vendor</div>
                        <div className="text-brand-body-3 font-bold text-brand-error">
                          0<span className="text-brand-caption">/6</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">ISO Certificates</span>
                        <TableBadge tone="green">3 Active</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Audit Reports (YTD)</span>
                        <TableBadge tone="amber">4 of 43 uploaded</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">CAPA Documents</span>
                        <TableBadge tone="red">18 pending closure</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Compliance Certificates</span>
                        <TableBadge tone="amber">7 expiring in 30d</TableBadge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="audit-completion-bar" className="h-full">
                <BarChartCard
                  title="Audit completion"
                  subtitle="Sorted lowest first · Vendor audits have never been conducted"
                  data={AUDIT_COMPLETION_DATA}
                  categoryKey="type"
                  orientation="horizontal"
                  unit="%"
                  valueDomain={[0, 100]}
                  categoryColors={[BRAND_HEX.warn, BRAND_HEX.warn, "#DA7756"]}
                  series={[{ dataKey: "pct", name: "Completion" }]}
                  labelFormatter={(_value, index) => AUDIT_COMPLETION_DATA[index]?.fraction ?? ""}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Vendor audits show zero completion — not behind schedule, never executed. Asset audits are also at zero of 27, meaning there is no current visibility into asset condition beyond breakdown reports."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-stalled" className="h-full">
                <StatListCard
                  title="Stalled audits — oldest first"
                  subtitle="In Progress with no duration or % ever recorded, not genuinely ongoing"
                  rows={[
                    { label: "Short Audit Process Report 1 · Abdul Ghaffar", badge: { tone: "red", label: "62d no activity" } },
                    { label: "Short Audit Process Report 1 · Abdul Ghaffar", badge: { tone: "red", label: "58d no activity" } },
                    { label: "Engineering Audit Checklist 2 · Vinayak Mane", badge: { tone: "amber", label: "41d no activity" } },
                  ]}
                  note='These aren&apos;t "in progress" — they&apos;re opened and abandoned. Each one is a specific person to follow up with today, not a completion percentage to wait out.'
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-execution-concentration" className="h-full">
                <HighlightStatCard
                  title="Audit execution concentration"
                  subtitle="Share of all audits run through a single person"
                  value="68%"
                  valueCaption="Abdul Ghaffar"
                  tone="warning"
                  description="A named bus-factor risk, not a vague workload observation — if this person is unavailable, most audit execution stops with them."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("AMC")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  AMC Contracts
                </span>
              </div>

              <div key="amc-health-card" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-bold text-brand-text">AMC Health</h3>
                    <p className="text-brand-body-5 text-brand-text-light">364 total · 104 active</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Upcoming Visits</div>
                        <div className="text-brand-h2 font-bold text-brand-info mt-1">23</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Due in 30 days</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Due / Missed</div>
                        <div className="text-brand-h2 font-bold text-brand-error mt-1">128</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Vendor non-compliance</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Flagged AMCs</div>
                        <div className="text-brand-h2 font-bold text-[#8A5A00] mt-1">3</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Under Observation</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Never Serviced</div>
                        <div className="text-brand-h2 font-bold text-brand-error mt-1">41</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Active status, zero visits ever</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">AMC Expired</span>
                        <TableBadge tone="red">Multiple · alerts not firing</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Total AMC Value</span>
                        <span className="font-semibold text-brand-text-light">
                          ⚠ ₹8.02 Cr vs ₹800 Cr — unresolved discrepancy
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="amc-discrepancy-banner" className="h-full overflow-auto bg-brand-warning-light border border-brand-warning rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 text-[#8A5A00] leading-relaxed">
                  Our figure (₹8.02 Cr) and the source system's figure (₹8,000,162,075 = ₹800.02 Cr) differ by 100x.
                  Not resolved here — could be a data-entry error in the source (extra zeros) or an error on our
                  side. Flagged, not assumed.
                </p>
              </div>

              <div key="amc-expiry-timeline" className="h-full">
                <ScatterTimelineChartCard
                  title="AMC contract expiry timeline"
                  subtitle="364 contracts · today line shows how far coverage has collapsed"
                  lanes={AMC_EXPIRY_TIMELINE_LANES}
                  domain={[-200, 60]}
                  ticks={[-200, -150, -100, -50, 0, 50]}
                  statusColors={AMC_EXPIRY_STATUS_COLORS}
                  statusLabels={AMC_EXPIRY_STATUS_LABELS}
                  annotation={{ text: "335 expired", tone: "error" }}
                  showInfoIcon
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-expiry-banner" className="h-full overflow-auto bg-brand-error-bg border border-brand-error rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 text-brand-error font-semibold leading-relaxed">
                  335 of 364 contracts are already expired, not approaching expiry. The "Days Remaining" alert
                  system is confirmed not firing on these records (flagged to Akshay) — this is a system bug, not a
                  routine renewal backlog.
                </p>
              </div>

              <div key="amc-urgency-criticality" className="h-full">
                <ScatterTimelineChartCard
                  title="Expiry urgency vs asset criticality"
                  subtitle="A contract expiring on a Critical asset is a fire — on a Non-Critical asset it's routine admin"
                  lanes={AMC_URGENCY_LANES}
                  domain={[-200, 60]}
                  ticks={[-200, -150, -100, -50, 0, 50]}
                  statusColors={AMC_URGENCY_STATUS_COLORS}
                  statusLabels={AMC_URGENCY_STATUS_LABELS}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Contracts on Critical assets sitting past expiry (top-left, red) need same-week action. The same expiry status on Non-Critical assets can wait for the next renewal cycle."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-vendor-concentration" className="h-full">
                <BarChartCard
                  title="Is this one vendor, or a systemic collapse?"
                  subtitle="Share of missed visits and expired contracts by vendor"
                  data={AMC_VENDOR_CONCENTRATION_DATA}
                  categoryKey="vendor"
                  orientation="horizontal"
                  unit="%"
                  valueDomain={[0, 100]}
                  categoryColors={AMC_VENDOR_CONCENTRATION_COLORS}
                  series={[{ dataKey: "pct", name: "Missed/expired" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="If concentrated in 2-3 vendors, the fix is replacing them. If spread evenly across all vendors, the fix is the renewal process itself — two different conversations, two different owners."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-cost-at-risk" className="h-full">
                <HighlightStatCard
                  title="AMC cost at risk"
                  subtitle="Share of total AMC spend sitting in expired or never-serviced contracts"
                  value="92%"
                  valueCaption="335 of 364 contracts"
                  tone="error"
                  description="This isn't a static total cost — it's an active financial leak. Most of the money tied up in AMC contracts is paying for coverage that no longer exists."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-service-asset-split" className="h-full">
                <BarChartCard
                  title="Service vs Asset Contract Split"
                  subtitle="364 total contracts, previously treated as one pool"
                  data={AMC_SERVICE_ASSET_SPLIT_DATA}
                  categoryKey="type"
                  seriesColors={[BRAND_HEX.blue, "#9EC8BA"]}
                  series={[
                    { dataKey: "total", name: "Total Contracts" },
                    { dataKey: "missed", name: "Missed Visits" },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Asset AMCs (equipment) carry the bulk of the 128 missed visits — Service AMCs (cleaning, soft services) are comparatively current, meaning the crisis is concentrated in equipment contracts specifically."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-critical-pending-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="Critical Assets Without AMC"
                    value="17"
                    accent="error"
                    subtitle="Marked Critical, zero contract coverage"
                    borderAccent="error"
                  />
                  <StatHeroCard
                    tone="teal"
                    label="High Pending AMC Service Calls"
                    value="34"
                    accent="warning"
                    subtitle="Requested, not yet actioned by vendor"
                    borderAccent="warning"
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  17 Critical assets with zero AMC coverage is the sharpest single number in this section — if any
                  of these fail, there's no contracted vendor obligated to respond.
                </p>
              </div>

              <div key="amc-coverage-by-category" className="h-full">
                <BarChartCard
                  title="AMC Coverage by Asset Category"
                  subtitle="Group and sub-group — where coverage gaps concentrate"
                  data={AMC_COVERAGE_BY_CATEGORY_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  unit="%"
                  valueDomain={[0, 100]}
                  categoryColors={AMC_COVERAGE_BY_CATEGORY_COLORS}
                  series={[{ dataKey: "pct", name: "Coverage" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Furniture and Meter categories carry the lowest coverage — worth checking if that's intentional (low-value, low-risk items) or an oversight."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-cost-trend" className="h-full">
                <AreaTrendChartCard
                  title="Monthly AMC Cost Trend"
                  subtitle="Actual cost trend — corrected, the Vendor chart previously pointed to here tracks response time, not cost"
                  data={AMC_COST_TREND_DATA}
                  categoryKey="month"
                  valueKey="cost"
                  unit="Cr"
                  showInfoIcon
                  insightVariant="plain"
                  insight="Top Vendors by Contract Value remains in Vendor's Total Spend column, cross-linked not duplicated — this chart is genuinely new, showing the month-over-month spend pattern that wasn't tracked anywhere before."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Checklists")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Digital Checklist Dashboard
                </span>
              </div>

              <div key="checklist-inhouse-card" className="h-full">
                <StatusSummaryCard
                  title="In-House"
                  metrics={[
                    { label: "Scheduled", value: "1,248", color: BRAND_HEX.dark },
                    { label: "Open", value: "268", color: BRAND_HEX.warn },
                    { label: "Closed", value: "980", color: BRAND_HEX.ok },
                    { label: "Overdue", value: "68", color: BRAND_HEX.err },
                  ]}
                  progress={78}
                  progressColor={BRAND_HEX.ok}
                  caption="78% completion rate · 68 of the 268 Open are already overdue"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-oem-card" className="h-full">
                <StatusSummaryCard
                  title="OEM"
                  metrics={[
                    { label: "Scheduled", value: "843", color: BRAND_HEX.dark },
                    { label: "Open", value: "223", color: BRAND_HEX.warn },
                    { label: "Closed", value: "620", color: BRAND_HEX.ok },
                    { label: "Overdue", value: "73", color: BRAND_HEX.err },
                  ]}
                  progress={74}
                  progressColor={BRAND_HEX.ok}
                  caption="74% completion rate · 73 of the 223 Open are already overdue"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-type-breakdown" className="h-full">
                <BarChartCard
                  title="Checklist type breakdown — where it's broken, where it isn't"
                  subtitle="Routine and Pest Control are healthy · PPM, AMC, and Preparedness are not"
                  data={CHECKLIST_TYPE_BREAKDOWN_DATA}
                  categoryKey="type"
                  orientation="horizontal"
                  stacked
                  seriesColors={["#9EC8BA", "#DA7756", "#8E7BE0"]}
                  series={[
                    { dataKey: "completed", name: "Completed" },
                    { dataKey: "open", name: "Open" },
                    { dataKey: "overdue", name: "Overdue" },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="PPM has 0 completions against 2,091 scheduled, AMC has 0 against 364. These need investigation before the numbers are reported as a real backlog — it may be a sync issue, not genuine zero completion."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-skipped-items" className="h-full">
                <StatListCard
                  title="Perpetually skipped items"
                  subtitle="The same specific tasks avoided every cycle — not random slippage"
                  rows={[
                    {
                      label: "Fire Alarm Panel — Monthly Test (PPM)",
                      badge: { tone: "red", label: "Skipped 11 of last 12 cycles" },
                    },
                    {
                      label: "Rooftop Water Tank — Sediment Check (PPM)",
                      badge: { tone: "red", label: "Skipped 9 of last 12 cycles" },
                    },
                    {
                      label: "Emergency Lighting — Battery Backup Test (Preparedness)",
                      badge: { tone: "amber", label: "Skipped 6 of last 12 cycles" },
                    },
                  ]}
                  note="The same tasks failing every cycle points to the task being unclear, unassigned, or physically difficult — not general overload. Fixing the task definition, not just chasing completion %, is the real fix."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-kpi-pair" className="h-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatHeroCard
                  tone="purple"
                  label="Checklist Closure Rate"
                  value="31%"
                  accent="error"
                  subtitle="Completed ÷ Scheduled × 100, across PPM/AMC/Preparedness"
                  borderAccent="error"
                />
                <StatHeroCard
                  tone="teal"
                  label="Checklist Weightage Score"
                  value="58%"
                  accent="warning"
                  subtitle="Achieved ÷ Maximum Score — quality of completed inspections"
                  borderAccent="warning"
                />
              </div>

              <div key="checklist-top10-completed" className="h-full">
                <BarChartCard
                  title="Top 10 Completed Checklists"
                  subtitle="Most frequently executed operational activities"
                  data={CHECKLIST_TOP10_COMPLETED_DATA}
                  categoryKey="checklist"
                  orientation="horizontal"
                  categoryColors={CHECKLIST_TOP10_COMPLETED_DATA.map(() => "#9EC8BA")}
                  series={[{ dataKey: "completions", name: "Completions" }]}
                  showInfoIcon
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-sitewise-compliance" className="h-full">
                <BarChartCard
                  title="Site-wise Compliance"
                  subtitle="Compliance % grouped by Site/Floor"
                  data={CHECKLIST_SITEWISE_COMPLIANCE_DATA}
                  categoryKey="site"
                  orientation="horizontal"
                  unit="%"
                  valueDomain={[0, 100]}
                  categoryColors={CHECKLIST_SITEWISE_COMPLIANCE_COLORS}
                  series={[{ dataKey: "compliance", name: "Compliance" }]}
                  showInfoIcon
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-monthly-trend" className="h-full">
                <MultiAreaTrendChartCard
                  title="Monthly Completion Trend"
                  subtitle="Completed vs Pending, month-wise"
                  data={CHECKLIST_MONTHLY_TREND_DATA}
                  categoryKey="month"
                  series={[
                    { dataKey: "completed", name: "Completed", color: BRAND_HEX.ok },
                    { dataKey: "pending", name: "Pending", color: BRAND_HEX.err },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Pending has been growing faster than Completed for 3 straight months — the 31% closure rate above isn't a one-time dip, it's a worsening trend."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-red-flags" className="h-full">
                <StatListCard
                  title="🚨 Checklist Red Flags"
                  subtitle="All 6, per SPOC"
                  borderTone="error"
                  rows={[
                    { label: "Overdue Checklists", badge: { tone: "red", label: "676 past due date" } },
                    { label: "Low Closure Rate Checklists", badge: { tone: "red", label: "Preparedness: 0.04% closure" } },
                    { label: "Checklist Failure Analysis", badge: { tone: "amber", label: "Pass 62% · Fail 38%" } },
                    { label: "Repeated Failed Checklists", badge: { tone: "red", label: "Fire Alarm Panel — 11 of 12 cycles" } },
                    { label: "Low Weightage Score Checklists", badge: { tone: "amber", label: "6 checklists below 40% quality threshold" } },
                    { label: "High Pending Sites", badge: { tone: "red", label: "Business Bay — 312 pending checklists" } },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-smart-insights" className="h-full">
                <StatListCard
                  title="🤖 Checklist Smart Insights"
                  subtitle="Grounded in this site's actual data, not generic advice"
                  borderTone="warning"
                  rows={[
                    {
                      label: "Checklist Frequency Optimization",
                      value: "Preparedness scheduled at a volume (4,461 overdue) the team has never once kept pace with — the schedule itself may be unrealistic, not just under-executed",
                    },
                    {
                      label: "Priority Checklist Recommendation",
                      value: "Fire Alarm Panel and Rooftop Water Tank are both safety-critical and perpetually skipped — these two outrank the rest of the 676 overdue by consequence, not just age",
                    },
                    {
                      label: "Recurring Issue Detection",
                      value: "Same two items failing 9-11 of the last 12 cycles points to a task-definition problem, not random inconsistency",
                    },
                    {
                      label: "Resource Allocation Suggestion",
                      value: "Business Bay carries 312 of the pending load — the same building already flagged with the most Audit findings and highest ticket volume",
                    },
                    {
                      label: "Compliance Risk Prediction",
                      value: "Preparedness's 0.04% closure rate makes it the single highest-risk checklist type sitewide if an actual emergency occurs",
                    },
                    {
                      label: "Checklist Optimization Suggestion",
                      value: "Routine and Pest Control run cleanly at high volume — worth reviewing whether PPM and Preparedness could adopt the same simpler structure",
                    },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="checklist-tenant-mismatch" className="h-full">
                <StatListCard
                  title="Tenants asking for something that's officially off"
                  subtitle="Inactive services with matching ticket-category volume still coming in"
                  borderTone="warning"
                  rows={[
                    { label: "Washroom Cleaning — Building X", badge: { tone: "amber", label: "8 matching tickets this month" } },
                    { label: "HR Cabin Service — Test QA", badge: { tone: "amber", label: "3 matching tickets this month" } },
                  ]}
                  note="These aren't housekeeping stats — they're demand for something the system says doesn't exist. Either reactivate the service or redirect the requests somewhere real."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Inventory")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Inventory
                </span>
              </div>

              <div key="inventory-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatHeroCard tone="purple" label="Total Inventories" value="198" accent="neutral" subtitle="All types" />
                <StatHeroCard
                  tone="teal"
                  label="Active"
                  value="25"
                  accent="success"
                  subtitle="13% of total"
                  borderAccent="success"
                />
                <StatHeroCard
                  tone="peach"
                  label="Inactive"
                  value="173"
                  accent="error"
                  subtitle="87% of total — striking ratio"
                  borderAccent="error"
                />
                <StatHeroCard tone="blue" label="Ecofriendly" value="37" accent="info" subtitle="Tagged sustainable" />
              </div>

              <div key="inventory-urgent-restock" className="h-full">
                <StatListCard
                  title="Urgent restock priority"
                  subtitle="Critical + low quantity + near expiry, all three conditions at once"
                  borderTone="error"
                  rows={[
                    { label: "Adani Electric — Electric Meter", badge: { tone: "red", label: "Critical · Qty 980 · Expires 31 Mar 2026" } },
                    { label: "Demo80 — Consumable", badge: { tone: "red", label: "Critical · Low stock · No expiry set" } },
                  ]}
                  note="This is the actual list a Site Incharge needs today — not a low-stock list, a criticality list, and an expiry list he has to mentally combine himself."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-type-breakdown" className="h-full">
                <BarChartCard
                  title="Inventory by type and criticality"
                  subtitle="Consumable vs Sparse · Technical vs Non-Technical · Critical vs Non-Critical"
                  data={INVENTORY_TYPE_BREAKDOWN_DATA}
                  categoryKey="type"
                  seriesColors={["#8E7BE0", "#DA7756"]}
                  series={[
                    { dataKey: "critical", name: "Critical" },
                    { dataKey: "nonCritical", name: "Non-Critical" },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="87% inactive is a striking ratio if it holds at full scale — worth confirming whether this reflects genuine retirement of old stock or inactive records that should have been active."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-health-score" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="⭐ Inventory Health Score"
                  value="42/100"
                  accent="warning"
                  subtitle="Composite: availability, turnover, dead stock, cost trend"
                  borderAccent="warning"
                  className="h-full"
                />
              </div>

              <div key="inventory-consumption-trend" className="h-full">
                <AreaTrendChartCard
                  title="Consumption Cost & Trend"
                  subtitle="Monthly consumption value — is spend rising?"
                  data={INVENTORY_CONSUMPTION_TREND_DATA}
                  categoryKey="month"
                  valueKey="value"
                  color={BRAND_HEX.warn}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Consumption spend has been climbing steadily — worth checking whether this tracks against a genuine usage increase or price inflation on the same items."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-category-consumption" className="h-full">
                <BarChartCard
                  title="Category-wise Consumption"
                  subtitle="Where inventory is actually being used"
                  data={INVENTORY_CATEGORY_CONSUMPTION_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  categoryColors={INVENTORY_CATEGORY_CONSUMPTION_DATA.map(() => BRAND_HEX.orange)}
                  series={[{ dataKey: "value", name: "Consumption" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Electrical and Plumbing consumables dominate usage — matches the same categories already flagged as highest-breach in Category Comparison under Tickets."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-deadstock-value" className="h-full">
                <BarChartCard
                  title="Dead Stock & Overstock Value"
                  subtitle="173 items with zero movement in 90+ days — value at risk, by category"
                  data={INVENTORY_DEADSTOCK_DATA}
                  categoryKey="category"
                  orientation="horizontal"
                  categoryColors={INVENTORY_DEADSTOCK_DATA.map(() => "#9EC8BA")}
                  series={[{ dataKey: "value", name: "Value at risk" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="This is blocked capital sitting on shelves — worth a write-off or liquidation review, not just a count of inactive line items."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="inventory-kpi-table" className="h-full">
                <DataTableCard
                  title="Inventory KPIs"
                  subtitle="Formula-based, per SPOC requirements"
                  columns={INVENTORY_KPI_COLUMNS}
                  data={INVENTORY_KPI_DATA}
                  getRowKey={(row) => row.kpi}
                  insight="Current Inventory Value is based on the 198 items with confirmed unit cost — the remaining items need cost data added before the true portfolio total is complete."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-section-label" className="h-full flex items-center gap-2">
                <div ref={registerMaintenanceSectionRef("Waste")} className="h-0" />
                <span className="text-sm">♻</span>
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Waste Operations
                </span>
                <span className="text-brand-caption text-brand-text-light">420 KG total · 11 records · Last update 18/02/2026</span>
              </div>

              <div key="waste-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatHeroCard tone="purple" label="Waste Generated" value="420 KG" accent="neutral" subtitle="11 records · Last: 18 Feb 2026" />
                <StatHeroCard tone="teal" label="Total Recycled" value="180 KG" accent="success" subtitle="43% of total generated" />
                <StatHeroCard
                  tone="peach"
                  label="Awaiting Dispatch"
                  value="3"
                  accent="warning"
                  subtitle="Records pending dispatch approval"
                  borderAccent="warning"
                />
                <StatHeroCard
                  tone="blue"
                  label="Verification Pending"
                  value="2"
                  accent="error"
                  subtitle="Awaiting disposal confirmation"
                  borderAccent="error"
                />
              </div>

              <div key="waste-workflow-bottlenecks" className="h-full">
                <StatListCard
                  title="Workflow Bottlenecks"
                  subtitle="Where waste records are stuck in the cycle"
                  rows={[
                    { label: "Pending Dispatch Approval", badge: { tone: "amber", label: "3" } },
                    { label: "Awaiting Vendor Acknowledgement", badge: { tone: "amber", label: "5" } },
                    { label: "Verification Pending", badge: { tone: "amber", label: "2" } },
                    { label: "Exception Queue", badge: { tone: "red", label: "1" } },
                  ]}
                  note="Oldest active record: 38 days"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-breakdown" className="h-full">
                <ProgressListCard
                  title="Waste Breakdown"
                  subtitle="By origin & type · 420 KG total"
                  sections={[
                    {
                      heading: "Customer-attributed",
                      rows: [
                        { label: "Oizom Instruments", value: "57 KG", percent: 57, color: BRAND_HEX.orange },
                        { label: "Reliance Digital", value: "24 KG", percent: 24, color: BRAND_HEX.blue },
                        { label: "HSBC", value: "19 KG", percent: 19, color: BRAND_HEX.green },
                      ],
                      note: { label: "Customer subtotal", value: "100 KG" },
                    },
                    {
                      heading: "Common Area by Type",
                      rows: [
                        { label: "Dry Waste", value: "162 KG", percent: 65, color: BRAND_HEX.warn },
                        { label: "Wet Waste", value: "90 KG", percent: 36, color: BRAND_HEX.teal },
                        { label: "Hazardous", value: "78 KG", percent: 31, color: BRAND_HEX.err },
                      ],
                    },
                  ]}
                  footnote="Reconciliation note: Sub-totals (430 KG) exceed master total (420 KG) by 10 KG — confirm with site team"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-vendor-performance" className="h-full">
                <StatListCard
                  title="Vendor Performance"
                  subtitle="Waste collection compliance"
                  rows={[
                    { label: "Primary Collection Vendor", badge: { tone: "red", label: "Not configured" } },
                    { label: "Last Recorded Activity", value: "18/02/2026" },
                    { label: "Vendor Acknowledgement Pending", badge: { tone: "amber", label: "5 of 11 records" } },
                    { label: "SLA Compliance", badge: { tone: "red", label: "Not measured" } },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-sustainability" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-semibold text-brand-text">Sustainability Overview</h3>
                    <p className="text-brand-body-5 text-brand-text-light">Performance vs targets</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                      Confirmed Metrics
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Recycling Rate</span>
                        <span className="flex items-center gap-2">
                          <span className="w-14 h-1.5 bg-brand-bg rounded-full overflow-hidden inline-block">
                            <span className="h-full rounded-full block" style={{ width: "43%", backgroundColor: BRAND_HEX.warn }} />
                          </span>
                          <span className="font-semibold" style={{ color: BRAND_HEX.warn }}>43%</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Recycled Weight</span>
                        <span className="font-semibold text-brand-success">180 KG</span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Hazardous Waste</span>
                        <span className="flex flex-col items-end gap-1">
                          <span className="font-semibold" style={{ color: BRAND_HEX.warn }}>78 KG</span>
                          <TableBadge tone="amber">Awaiting Verification</TableBadge>
                        </span>
                      </div>
                    </div>
                    <p className="text-brand-caption text-brand-text-light py-2">Last Activity: 18 Jun 2026 · Owner: EHS Team</p>
                    <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mt-2 mb-2">
                      Pending Operational Data
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Segregation Compliance</span>
                        <TableBadge tone="grey">Pending data</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Carbon Offset (KG CO₂)</span>
                        <TableBadge tone="grey">Pending calc.</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Zero Waste Goal</span>
                        <TableBadge tone="grey">Target: configure</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Revenue from Recyclables</span>
                        <TableBadge tone="grey">Not tracked</TableBadge>
                      </div>
                    </div>
                    <p className="text-brand-body-5 text-brand-text-light leading-relaxed mt-3 pt-2 border-t border-brand-border">
                      4 sustainability metrics pending vendor + segregation setup
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div key="waste-weekly-trend-stale" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-semibold text-brand-text">Waste Generation — Weekly Trend</h3>
                    <p className="text-brand-body-5 text-brand-error">⚠ Data stale since 18 Feb 2026</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center gap-2 py-8 bg-brand-bg rounded-lg">
                      <BarChart3 className="w-8 h-8 opacity-40 text-brand-text-light" />
                      <span className="text-brand-body-5 font-semibold text-brand-error">⚠ Data Stale</span>
                      <span className="text-brand-caption text-brand-text-light">Last update: 18/02/2026 · 120+ days</span>
                      <span className="text-brand-caption text-brand-text-light">Upload new records to resume trend analysis</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="waste-records-table" className="h-full">
                <DataTableCard
                  title="Waste Generation Records"
                  subtitle="11 records confirmed · Customer · Category · KG · Status — drill any row for detail"
                  columns={WASTE_RECORDS_COLUMNS}
                  data={WASTE_RECORDS_DATA}
                  getRowKey={(row) => row.name}
                  insight="Recycled (KG) column: 180 KG total recycled allocated across Dry and Wet streams · Hazardous requires certified disposal — currently unconfirmed · Vendor column requires DB configuration"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-handoff-banner" className="h-full overflow-auto bg-brand-error-bg border border-brand-error rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 text-brand-error leading-relaxed">
                  Nobody has logged waste since 18/02/2026 — that's a named handoff failure, not an unowned data gap. Waste
                  logging responsibility needs an explicit assigned owner going forward, since it appears to have lapsed
                  when whoever was tracking it stopped, without anyone else picking it up.
                </p>
              </div>

              <div key="attendance-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Attendance")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Attendance
                </span>
              </div>

              <div key="attendance-card" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2 flex-row items-center justify-between">
                    <div>
                      <h3 className="text-brand-body-3 font-semibold text-brand-text">🧑‍🤝‍🧑 Attendance</h3>
                      <p className="text-brand-body-5 text-brand-text-light">Staff on-site today</p>
                    </div>
                    <TableBadge tone="green">Live</TableBadge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Present</span>
                        <span className="font-bold text-brand-success">34 / 38</span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Absent</span>
                        <TableBadge tone="amber">4</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Late Today</span>
                        <TableBadge tone="grey">2</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">On-Time Check-In %</span>
                        <TableBadge tone="green">89%</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Vendor Teams</span>
                        <span className="font-semibold text-brand-text">12 active on site</span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Open Positions</span>
                        <TableBadge tone="red">4 unfilled</TableBadge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="attendance-trend" className="h-full">
                <AreaTrendChartCard
                  title="Attendance trend"
                  subtitle="6 months · is presence stable or slipping?"
                  data={ATTENDANCE_TREND_DATA}
                  categoryKey="month"
                  valueKey="presentPct"
                  unit="%"
                  color={BRAND_HEX.ok}
                  showInfoIcon
                  className="h-full overflow-auto"
                />
              </div>

              <div key="attendance-department-wise" className="h-full">
                <StatListCard
                  title="Department-wise Present/Absent"
                  subtitle="Where are the gaps concentrated?"
                  rows={[
                    { label: "Maintenance/Technical", value: "11 / 2" },
                    { label: "Housekeeping", value: "9 / 1" },
                    { label: "Security", value: "8 / 0" },
                    { label: "Admin/Front Desk", value: "6 / 1" },
                  ]}
                  note="Maintenance/Technical carries the most absence today — worth checking if that's the same department behind the staffing-vs-breach link below."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="attendance-staffing-breach" className="h-full">
                <ComboBarLineChartCard
                  title="Staffing gaps vs category breach rate"
                  subtitle="Same days plotted together — is an absence the reason a category spikes?"
                  data={ATTENDANCE_STAFFING_BREACH_DATA}
                  categoryKey="day"
                  bar={{ dataKey: "absent", name: "AC Staff Absent" }}
                  line={{ dataKey: "breach", name: "AC Ticket Breach %", unit: "%" }}
                  showInfoIcon
                  insightVariant="plain"
                  insight="If the AC technician's absences line up with AC ticket breach spikes on the same days, that's a direct staffing-to-outcome link — not a coincidence to note separately in two different reports."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="attendance-repeat-lateness" className="h-full">
                <StatListCard
                  title="Repeat absence & habitual lateness"
                  subtitle="Same individuals repeatedly out or late vs spread evenly across the team"
                  rows={[
                    { label: "AC Technician — 3rd absence this month", badge: { tone: "red", label: "Repeat absence" } },
                    { label: "Housekeeping Staff — 2nd absence this month", badge: { tone: "amber", label: "Repeat absence" } },
                    { label: "Security Guard — 4 late check-ins this month", badge: { tone: "amber", label: "Habitual latecomer" } },
                    { label: "Front Desk Staff — 3 consecutive days absent", badge: { tone: "red", label: "Consecutive Absenteeism" } },
                  ]}
                  note="Repeat absence needs a different management response than occasional gaps. Consecutive absenteeism is a stronger signal than scattered occurrences — worth flagging separately since it usually means something specific (illness, disengagement, or a second job) rather than random bad luck."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="survey-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Survey")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Survey
                </span>
              </div>

              <div key="survey-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatHeroCard
                  tone="purple"
                  label="CSAT"
                  value="1.11"
                  accent="error"
                  subtitle="Out of 5 · Washroom survey"
                  borderAccent="error"
                />
                <StatHeroCard tone="teal" label="Total Questions" value="1" accent="neutral" subtitle="Help us keep our washrooms clean" />
                <StatHeroCard
                  tone="peach"
                  label="Positive"
                  value="15"
                  accent="success"
                  subtitle="26.8% of responses"
                  borderAccent="success"
                />
                <StatHeroCard
                  tone="blue"
                  label="Negative"
                  value="41"
                  accent="error"
                  subtitle="73.2% of responses"
                  borderAccent="error"
                />
              </div>

              <div key="survey-satisfaction-scale" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-semibold text-brand-text">Q1. Help us keep our washrooms clean</h3>
                    <p className="text-brand-body-5 text-brand-text-light">5-point response scale, not just positive/negative</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-around text-center">
                      {SURVEY_SATISFACTION_SCALE.map((item) => (
                        <div key={item.label}>
                          <div className="text-2xl">{item.emoji}</div>
                          <div className="text-brand-caption text-brand-text-light mt-1">{item.label}</div>
                          <div className="text-brand-body-4 font-bold mt-0.5" style={{ color: item.color }}>
                            {item.pct}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="survey-response-by-category" className="h-full">
                <ProgressListCard
                  title="Response by Category"
                  subtitle="Total Response: 59 · what's actually driving the negative score"
                  borderTone="error"
                  sections={[
                    {
                      rows: [
                        { label: "Foul smell", value: "40.7% (24)", percent: 100, color: BRAND_HEX.err },
                        { label: "Toilet Seat/Urinal Unclean", value: "6.8% (4)", percent: 17, color: BRAND_HEX.warn },
                        { label: "Soap Missing", value: "6.8% (4)", percent: 17, color: BRAND_HEX.warn },
                        { label: "Others", value: "5.1% (3)", percent: 13, color: BRAND_HEX.green },
                        { label: "Dirty floor", value: "3.4% (2)", percent: 8, color: BRAND_HEX.green },
                      ],
                    },
                  ]}
                  footnote='Foul smell alone is 40.7% of all complaints — nearly 6x the next category. This is a specific, fixable maintenance issue (ventilation, cleaning frequency), not a vague "cleanliness" problem.'
                  className="h-full overflow-auto"
                />
              </div>

              <div key="survey-weekly-csat-trend" className="h-full">
                <BarChartCard
                  title="Weekly CSAT trend"
                  subtitle="Improved, then relapsed — a flat percentage hides this shape entirely"
                  data={SURVEY_WEEKLY_CSAT_DATA}
                  categoryKey="week"
                  categoryColors={SURVEY_WEEKLY_CSAT_COLORS}
                  series={[{ dataKey: "csat", name: "CSAT" }]}
                  showInfoIcon
                  className="h-full overflow-auto"
                />
              </div>

              <div key="survey-weekly-breakdown-table" className="h-full overflow-auto bg-brand-error-bg border border-brand-error rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-brand-body-4 font-semibold text-brand-text">Weekly CSAT Breakdown</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-brand-border bg-white">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        {["Week", "CSAT", "Negative", "Positive", "Total"].map((header) => (
                          <th key={header} className="analytics-header bg-brand text-white font-semibold text-xs px-4 py-3 whitespace-nowrap text-center">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SURVEY_WEEKLY_BREAKDOWN_DATA.map((row) => (
                        <tr key={row.week} className={row.highlight ? "bg-brand-error-bg" : undefined}>
                          <td className="px-4 py-3 text-left border-b border-brand-border text-brand-text">{row.week}</td>
                          <td className="px-4 py-3 text-center border-b border-brand-border text-brand-text">{row.csat}</td>
                          <td className="px-4 py-3 text-center border-b border-brand-border text-brand-error">{row.negative}</td>
                          <td className="px-4 py-3 text-center border-b border-brand-border text-brand-success">{row.positive}</td>
                          <td className={cn("px-4 py-3 text-center border-b border-brand-border text-brand-text", row.highlight && "font-bold")}>
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-brand-body-5 font-semibold text-brand-error leading-relaxed mt-2">
                  Jan 4-10 genuinely improved (CSAT 2.00, +80%) — then Jan 11-17 relapsed all the way back to 78% negative,
                  with volume spiking to 36 responses, 3-4x the normal week. Whatever caused the Jan 4-10 improvement
                  didn't hold, and the relapse coincided with much higher engagement — worth checking what happened that
                  specific week.
                </p>
              </div>

              <div key="survey-hourly-response" className="h-full">
                <HourlyPatternChartCard
                  title="Response timing — hour of day"
                  subtitle="Total Response: 61 · when do people actually respond or complain"
                  data={SURVEY_HOURLY_RESPONSE_DATA}
                  showInfoIcon
                  insightVariant="plain"
                  insight="If complaints cluster at specific hours, that's when the underlying issue (odour, cleanliness) is at its worst — useful for scheduling cleaning shifts around actual complaint timing, not a fixed roster."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Vendor")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Vendor Management
                </span>
              </div>

              <div key="vendor-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-auto">
                <StatHeroCard tone="purple" label="Total Active Vendors" value="31" accent="neutral" subtitle="Across all contract types" />
                <StatHeroCard
                  tone="teal"
                  label="Vendor Performance Score"
                  value="7.2/10"
                  accent="warning"
                  subtitle="3 vendors flagged"
                  progress={72}
                  borderAccent="warning"
                />
                <StatHeroCard
                  tone="peach"
                  label="On-Time Service Completion %"
                  value="58%"
                  accent="warning"
                  subtitle="Distinct from response time — did the job finish on schedule"
                  borderAccent="warning"
                />
                <StatHeroCard
                  tone="blue"
                  label="SLA Compliance"
                  value="64%"
                  accent="warning"
                  subtitle="128 AMC visits missed"
                  progress={64}
                  borderAccent="warning"
                />
                <StatHeroCard
                  tone="purple"
                  label="AMC Vendor Status"
                  value="128"
                  accent="error"
                  subtitle="Missed visits · 104 active"
                  borderAccent="error"
                />
                <StatHeroCard
                  tone="teal"
                  label="Pending Vendor Tasks"
                  value="47"
                  accent="warning"
                  subtitle="GRN · PR · approvals"
                  borderAccent="warning"
                />
                <StatHeroCard
                  tone="peach"
                  label="Contract Renewals Due"
                  value="8"
                  accent="error"
                  subtitle="KYC expiring ≤ 30 days"
                  borderAccent="error"
                />
              </div>

              <div key="vendor-repeat-requests" className="h-full">
                <StatListCard
                  title="Repeat service requests — same vendor, same issue"
                  subtitle='Not "is this vendor slow" — "does their fix actually hold?"'
                  borderTone="error"
                  rows={[
                    { label: "Unicorn InfoSol. — Network Devices", badge: { tone: "red", label: "4 repeat calls, same fault" } },
                    { label: "Help Test — AC Compressor", badge: { tone: "amber", label: "2 repeat calls, same fault" } },
                  ]}
                  note="A vendor that responds fast but keeps getting called back for the same fault isn't actually fixing the problem — this is a different failure than slow response time, and needs a different conversation."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-response-time" className="h-full">
                <ProgressListCard
                  title="Vendor Response Time"
                  subtitle="Avg response time vs 4hr SLA"
                  sections={[
                    {
                      rows: [
                        { label: "Lockated Haven", value: "2.8h", percent: 95, color: BRAND_HEX.ok },
                        { label: "PowerTech", value: "3.2h", percent: 80, color: BRAND_HEX.ok },
                        { label: "Connexions", value: "4.8h ⚠", percent: 60, color: BRAND_HEX.warn },
                        { label: "Unicorn InfoSol.", value: "6.1h ✗", percent: 40, color: BRAND_HEX.err },
                        { label: "Help Test", value: "11.4h ✗", percent: 15, color: BRAND_HEX.err },
                      ],
                    },
                  ]}
                  footnote="SLA = 4 hours · 2 vendors breaching threshold"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-amc-status-table" className="h-full">
                <DataTableCard
                  title="AMC Vendor Status"
                  subtitle="364 contracts · Active / Missed / Expiring / Total Spend"
                  columns={VENDOR_AMC_STATUS_COLUMNS}
                  data={VENDOR_AMC_STATUS_DATA}
                  getRowKey={(row) => row.vendor}
                  insight="Spend is category-wise from AMC contract value — see Maintenance → AMC for full contract-level detail, not duplicated here."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-health" className="h-full">
                <StatListCard
                  title="Vendor Health"
                  subtitle="Compliance + performance — drill any item"
                  rows={[
                    { label: "KYC Due ≤ 30 days", badge: { tone: "red", label: "8" } },
                    { label: "Onboarding Pending", badge: { tone: "amber", label: "4" } },
                    { label: "Expiring Documents", badge: { tone: "amber", label: "11" } },
                    { label: "Inactive > 90 days", badge: { tone: "grey", label: "23" } },
                    { label: "Performance Flags", badge: { tone: "red", label: "3" } },
                  ]}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-response-trend" className="h-full">
                <MultiLineTrendChartCard
                  title="Vendor response time trend"
                  subtitle="4 months · dashed line = 4hr SLA"
                  data={VENDOR_RESPONSE_TREND_DATA}
                  categoryKey="month"
                  unit="h"
                  referenceValue={4}
                  series={[
                    { dataKey: "powerTech", name: "PowerTech", color: BRAND_HEX.ok },
                    { dataKey: "connexions", name: "Connexions", color: BRAND_HEX.warn },
                    { dataKey: "unicorn", name: "Unicorn InfoSol.", color: BRAND_HEX.err },
                    { dataKey: "helpTest", name: "Help Test", color: "#8B0000" },
                  ]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Unicorn InfoSol. and Help Test aren't just slow today — both have been getting worse for three straight months, which is a renewal-decision signal, not a one-off bad week."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-expired-kyc" className="h-full">
                <StatListCard
                  title="Active vendors with expired or missing KYC"
                  subtitle="A paperwork gap becomes a legal/payment risk when the vendor holds a live contract"
                  borderTone="error"
                  rows={[
                    { label: "PowerTech Metering — 18 live AMC contracts", badge: { tone: "red", label: "KYC Expired" } },
                    { label: "Mahindra PVT LTD — active PO relationship", badge: { tone: "red", label: "KYC Expired" } },
                    { label: "Tata Steel PVT LTD — active PO relationship", badge: { tone: "red", label: "KYC Expired" } },
                  ]}
                  note="These are the vendors that should get a call today — you can't properly process payment or tax documentation without valid registration, and all three currently have live financial relationships."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-data-hygiene-banner" className="h-full overflow-auto bg-brand-warning-light border border-brand-warning rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 leading-relaxed" style={{ color: "#B8860B" }}>
                  ⚠ Several vendor master records are test/junk entries ("qazwsxedcrfvtgbyhn," "a," "help test"). If this
                  file feeds vendor names elsewhere on the dashboard (AMC table, procurement concentration chart), test
                  records may be quietly distorting those metrics — worth a data-hygiene pass before trusting vendor
                  counts as final.
                </p>
              </div>
            </ResponsiveGridLayout>
          </div>
          </>
        ) : isSafetyView ? (
          <SafetyPanel activeSection={activeSubTab} />
        ) : (
          <div className="bg-white border border-brand-border rounded-lg p-6">
            <h2 className="text-brand-body-3 font-bold text-brand-text uppercase tracking-wide mb-1">
              {current.label} — {activeSubTab}
            </h2>
            <p className="text-brand-body-4 text-brand-text-light mb-5">{current.summary}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
              {current.stats.map((stat) => (
                <div key={stat.label} className="border border-brand-border rounded-lg p-4 bg-brand-bg">
                  <div className={cn("text-brand-h2 font-bold", STAT_TONE_CLASSES[stat.tone])}>
                    {stat.value}
                  </div>
                  <div className="text-brand-body-5 text-brand-text-light mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {current.chips.map((chip) => (
                <span
                  key={chip.label}
                  className={cn(
                    "rounded-full px-3 py-1 text-brand-body-5 font-medium",
                    CHIP_TONE_CLASSES[chip.tone]
                  )}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}
