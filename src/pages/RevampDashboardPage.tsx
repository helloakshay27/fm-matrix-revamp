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
  ChevronDown,
  RotateCcw,
  Lightbulb,
  X,
  Loader2,
  AlertTriangle,
  Search,
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
  AreaTrendChartCard,
  MultiAreaTrendChartCard,
  StatusSummaryCard,
  ProgressListCard,
  HourlyPatternChartCard,
  MultiLineTrendChartCard,
  type DataTableColumn,
  type TableBadgeTone,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { ANALYTICS_PALETTE, getPaletteColor } from "@/styles/chartPalette";
import { SafetyPanel } from "@/components/dashboard/SafetyPanel";
import { FinancePanel } from "@/components/dashboard/FinancePanel";
import { CrmPanel } from "@/components/dashboard/CrmPanel";
import { fetchAllowedSites } from "@/services/sitesAPI";
import {
  useTicketsDashboardData,
  useAssetsDashboardData,
  useAuditDashboardData,
  useAmcDashboardData,
  useChecklistsDashboardData,
  useInventoryDashboardData,
  useWasteDashboardData,
  useAttendanceDashboardData,
  useSurveyDashboardData,
  useVendorDashboardData,
  usePermitsDashboardData,
  useIncidentsDashboardData,
} from "@/hooks/useFmDashboardData";

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
  red: "bg-brand-light text-brand border border-brand",
  amber: "bg-brand-warning-light text-[#8A5A00] border border-brand-warning",
  green: "bg-brand-success-bg text-brand-success border border-brand-success",
  grey: "bg-brand-muted text-brand-text-light border border-brand-border",
};

const STAT_TONE_CLASSES: Record<ChipTone, string> = {
  red: "text-brand",
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
    stats: [],
    chips: [],
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
  // {
  //   key: "marketplace",
  //   label: "Market Place",
  //   icon: Store,
  //   summary: "Redemption marketplace listings, vendor payouts and catalogue health.",
  //   subTabs: ["Listings", "Vendors", "Payouts", "Catalogue"],
  //   stats: [
  //     { label: "Active Listings", value: "12", tone: "green" },
  //     { label: "Vendor Payouts Pending", value: "3", tone: "amber" },
  //   ],
  //   chips: [
  //     { label: "99.5K pts Unredeemed", tone: "amber" },
  //     { label: "3 Vendor Payouts Pending", tone: "amber" },
  //     { label: "12 Active Listings", tone: "green" },
  //   ],
  // },
  // {
  //   key: "master",
  //   label: "Master",
  //   icon: Database,
  //   summary: "Master-data completeness across sites, entities and duplicate records.",
  //   subTabs: ["Locations", "Assets Master", "Vendors Master", "Categories"],
  //   stats: [
  //     { label: "Master Entities", value: "48", tone: "grey" },
  //     { label: "Duplicate Records Flagged", value: "2", tone: "amber" },
  //   ],
  //   chips: [
  //     { label: "48 Master Data Entities", tone: "grey" },
  //     { label: "6 Pending Approvals", tone: "amber" },
  //     { label: "2 Duplicate Records Flagged", tone: "amber" },
  //   ],
  // },
  // {
  //   key: "settings",
  //   label: "Settings",
  //   icon: SettingsIcon,
  //   summary: "Role configuration, permission conflicts and integration health.",
  //   subTabs: ["Roles", "Permissions", "Integrations", "Notifications"],
  //   stats: [
  //     { label: "Roles Configured", value: "14", tone: "grey" },
  //     { label: "Permission Conflicts", value: "3", tone: "amber" },
  //   ],
  //   chips: [
  //     { label: "14 Roles Configured", tone: "grey" },
  //     { label: "3 Permission Conflicts", tone: "amber" },
  //     { label: "Integration Health: OK", tone: "green" },
  //   ],
  // },
  // {
  //   key: "accounting",
  //   label: "Accounting",
  //   icon: Calculator,
  //   summary: "Ledger reconciliation, tax setup and bill-approval throughput.",
  //   subTabs: ["Ledger", "Tax Setup", "Bills", "Reconciliation"],
  //   stats: [
  //     { label: "Unreconciled Entries", value: "27", tone: "amber" },
  //     { label: "Bills Pending Approval", value: "9", tone: "amber" },
  //   ],
  //   chips: [
  //     { label: "27 Unreconciled Entries", tone: "amber" },
  //     { label: "9 Bills Pending Approval", tone: "amber" },
  //     { label: "Tax Setup: Up to Date", tone: "green" },
  //   ],
  // },
];

// Maintenance › Ticket analytics — wired to the live /fm_dashboard/tickets/*
// endpoints (src/services/fmDashboardAPI.ts). Only fixed lookups/labels
// live here now; all figures are computed from the API response at render time.
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

const AGE_TIER_COLORS = [
  ANALYTICS_PALETTE[3],
  ANALYTICS_PALETTE[2],
  ANALYTICS_PALETTE[2],
  ANALYTICS_PALETTE[0],
  ANALYTICS_PALETTE[3],
];

// Axis labels only — the heatmap's cell values always come from the API.
const HEATMAP_DAYS_FALLBACK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEATMAP_HOURS_FALLBACK = Array.from({ length: 24 }, (_, i) => i);

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-10" -> "Oct '25" */
function formatMonthLabel(month: string): string {
  const [year, mon] = month.split("-");
  const idx = Number(mon) - 1;
  const name = MONTH_NAMES[idx] ?? mon;
  return `${name} '${(year ?? "").slice(2)}`;
}

function tatBreachTone(percent: number): TableBadgeTone {
  if (percent >= 50) return "red";
  if (percent >= 20) return "amber";
  return "green";
}

function vsLastMonthDisplay(percent: number | null): { display: string; tone: "red" | "green" | "neutral" } {
  if (percent === null || percent === undefined) return { display: "–", tone: "neutral" };
  if (percent > 0) return { display: `↑ +${percent}%`, tone: "red" };
  if (percent < 0) return { display: `↓ ${percent}%`, tone: "green" };
  return { display: "· 0%", tone: "neutral" };
}

// Fixed, known source set the API always returns — colors keyed by name so
// they stay correct regardless of the order the backend returns them in.
const SOURCE_COLOR_MAP: Record<string, string> = {
  "Manual/Direct": "#8E7BE0",
  Asset: "#8E7BE0",
  Checklist: "#6B9BCC",
  Survey: "#9EC8BA",
  Patrolling: "#8E7BE0",
};

/** Small placeholder for a widget whose backing field the ticket dashboard API doesn't provide (yet) or returned empty. */
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
        <div className="flex h-32 items-center justify-center text-center text-brand-body-5 text-brand-text-light">
          {message}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Header controls: Select Period / Filters / Search popovers ---
// Defined at module scope (not nested inside the page component) so their
// identity is stable across parent re-renders — otherwise every loading/error
// state change on the page would remount them and wipe out in-progress input.

function formatApiDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function getDefaultDashboardDateRange(): { from: Date; to: Date } {
  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);
  return { from, to };
}

/** Compact label for the period button — derived purely from the applied {from, to}, so it stays correct regardless of which tab (Day/Month/Range) was used to set it. */
function periodButtonLabel({ from, to }: { from: Date; to: Date }): string {
  const sameDay = from.toDateString() === to.toDateString();
  if (sameDay) {
    return from.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }
  const isFirstOfMonth = from.getDate() === 1;
  const lastDayOfFromMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0);
  const isLastOfMonth = to.toDateString() === lastDayOfFromMonth.toDateString();
  const sameMonth = from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth();
  if (isFirstOfMonth && isLastOfMonth && sameMonth) {
    return from.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  return `${String(from.getDate()).padStart(2, "0")}/${String(from.getMonth() + 1).padStart(2, "0")} - ${formatDisplayDate(to)}`;
}

type PeriodMode = "day" | "month" | "range";

interface SelectPeriodPopoverProps {
  initialRange: { from: Date; to: Date };
  onApply: (range: { from: Date; to: Date }) => void;
  onReset: () => void;
  onClose: () => void;
}

function SelectPeriodPopover({ initialRange, onApply, onReset, onClose }: SelectPeriodPopoverProps) {
  const today = new Date();
  const todayStr = formatApiDate(today);
  const [mode, setMode] = useState<PeriodMode>("range");
  const [dayValue, setDayValue] = useState(formatApiDate(initialRange.to));
  const [monthValue, setMonthValue] = useState(
    `${initialRange.to.getFullYear()}-${String(initialRange.to.getMonth() + 1).padStart(2, "0")}`
  );
  const [fromValue, setFromValue] = useState(formatApiDate(initialRange.from));
  const [toValue, setToValue] = useState(formatApiDate(initialRange.to));

  const handleApply = () => {
    if (mode === "day") {
      const d = new Date(`${dayValue}T00:00:00`);
      onApply({ from: d, to: d });
    } else if (mode === "month") {
      const [y, m] = monthValue.split("-").map(Number);
      const from = new Date(y, m - 1, 1);
      const lastDay = new Date(y, m, 0);
      const to = lastDay > today ? today : lastDay;
      onApply({ from, to });
    } else {
      onApply({ from: new Date(`${fromValue}T00:00:00`), to: new Date(`${toValue}T00:00:00`) });
    }
    onClose();
  };

  return (
    <div className="w-72 rounded-lg border border-brand-border bg-white p-4 shadow-lg">
      <div className="text-brand-caption font-bold text-brand-green uppercase tracking-wide mb-3">Select Period</div>
      <div className="flex rounded-full border border-brand-sidebar overflow-hidden mb-4">
        {(["day", "month", "range"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 py-1.5 text-brand-body-5 font-semibold capitalize transition-colors",
              mode === m ? "bg-brand text-white" : "text-brand-green hover:bg-brand-light"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "day" && (
        <div className="mb-4">
          <label className="block text-brand-body-5 text-brand-text-light mb-1">Date:</label>
          <input
            type="date"
            value={dayValue}
            max={todayStr}
            onChange={(e) => setDayValue(e.target.value)}
            className="w-full rounded-full border border-brand-sidebar px-3 py-2 text-brand-body-4 text-brand-text"
          />
        </div>
      )}
      {mode === "month" && (
        <div className="mb-4">
          <label className="block text-brand-body-5 text-brand-text-light mb-1">Month:</label>
          <input
            type="month"
            value={monthValue}
            max={todayStr.slice(0, 7)}
            onChange={(e) => setMonthValue(e.target.value)}
            className="w-full rounded-full border border-brand-sidebar px-3 py-2 text-brand-body-4 text-brand-text"
          />
        </div>
      )}
      {mode === "range" && (
        <div className="mb-4 flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-brand-body-5 text-brand-text-light mb-1">From:</label>
            <input
              type="date"
              value={fromValue}
              max={toValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full rounded-full border border-brand-sidebar px-3 py-2 text-brand-body-4 text-brand-text"
            />
          </div>
          <div className="flex-1">
            <label className="block text-brand-body-5 text-brand-text-light mb-1">To:</label>
            <input
              type="date"
              value={toValue}
              min={fromValue}
              max={todayStr}
              onChange={(e) => setToValue(e.target.value)}
              className="w-full rounded-full border border-brand-sidebar px-3 py-2 text-brand-body-4 text-brand-text"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 rounded-full bg-brand py-2 text-brand-body-4 font-semibold text-white hover:bg-brand-hover"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={() => {
            onReset();
            onClose();
          }}
          className="rounded-full border border-brand-sidebar px-4 py-2 text-brand-body-4 font-semibold text-brand-green hover:bg-brand-light"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

interface FiltersPopoverProps {
  buildingOptions: string[];
  categoryOptions: string[];
  initialBuilding: string;
  initialCategory: string;
  onApply: (building: string, category: string) => void;
  onClose: () => void;
}

function FiltersPopover({
  buildingOptions,
  categoryOptions,
  initialBuilding,
  initialCategory,
  onApply,
  onClose,
}: FiltersPopoverProps) {
  const [building, setBuilding] = useState(initialBuilding);
  const [category, setCategory] = useState(initialCategory);

  return (
    <div className="w-72 rounded-lg border border-brand-border bg-white p-4 shadow-lg">
      <div className="text-brand-caption font-bold text-brand-green uppercase tracking-wide mb-3">Filters</div>
      <div className="mb-3">
        <label className="block text-brand-body-5 text-brand-text-light mb-1">Building / Wing</label>
        <select
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          className="w-full rounded-full border border-brand px-3 py-2 text-brand-body-4 text-brand-text"
        >
          <option value="all">All Buildings</option>
          {buildingOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        {buildingOptions.length === 0 && (
          <p className="mt-1 text-brand-caption text-brand-text-light">No building-level data loaded for this period yet.</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-brand-body-5 text-brand-text-light mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-full border border-brand-sidebar px-3 py-2 text-brand-body-4 text-brand-text"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={() => {
          onApply(building, category);
          onClose();
        }}
        className="w-full rounded-full bg-brand py-2 text-brand-body-4 font-semibold text-white hover:bg-brand-hover"
      >
        Apply Filters
      </button>
    </div>
  );
}

interface HeaderSearchResult {
  moduleKey: string;
  moduleLabel: string;
  subTab: string;
}

interface SearchPopoverProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: HeaderSearchResult[];
  onSelect: (result: HeaderSearchResult) => void;
}

function SearchPopover({ query, onQueryChange, results, onSelect }: SearchPopoverProps) {
  return (
    <div className="w-80 rounded-lg border border-brand-border bg-white p-3 shadow-lg">
      <div className="flex items-center gap-2 rounded-full border border-brand-sidebar px-3 py-2">
        <Search className="h-4 w-4 flex-shrink-0 text-brand-text-light" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search: vendor, patrol, billing, AMC…"
          className="w-full flex-1 text-brand-body-4 text-brand-text outline-none"
        />
      </div>
      {query.trim() && (
        <div className="mt-2 max-h-64 overflow-y-auto">
          {results.length ? (
            results.map((r) => (
              <button
                key={`${r.moduleKey}-${r.subTab}`}
                type="button"
                onClick={() => onSelect(r)}
                className="w-full rounded-md px-3 py-2 text-left text-brand-body-5 text-brand-text hover:bg-brand-light"
              >
                <span className="text-brand-text-light">{r.moduleLabel}</span> {" › "}
                <span className="font-semibold">{r.subTab}</span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-brand-body-5 text-brand-text-light">No matching module or tab.</p>
          )}
        </div>
      )}
    </div>
  );
}

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
          row.trendTone === "red" && "text-brand",
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
      <span className={cn(row.ageingHighlight ? "text-brand font-bold" : "text-brand-text")}>{row.ageing}</span>
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
  err: "#DA7756",
  blue: "#6B9BCC",
  orange: "#DA7756",
  teal: "#9EC8BA",
  dark: "#2C2C2C",
};

// Maintenance › Assets and Audit analytics — wired to the live
// /fm_dashboard/assets/* and /fm_dashboard/audits/* endpoints. Only fixed
// column/row shape definitions live here now; figures are computed at render time.
interface AuditKpiRow {
  kpi: string;
  formula: string;
  value: string;
  tone: TableBadgeTone;
}

const AUDIT_KPI_COLUMNS: DataTableColumn<AuditKpiRow>[] = [
  { key: "kpi", header: "KPI", render: (row) => <span className="text-brand-text">{row.kpi}</span> },
  { key: "formula", header: "Formula", render: (row) => <span className="text-brand-body-5 text-brand-text-light">{row.formula}</span> },
  { key: "value", header: "Value", render: (row) => <TableBadge tone={row.tone}>{row.value}</TableBadge> },
];

function auditScoreTone(percent: number): TableBadgeTone {
  if (percent >= 70) return "green";
  if (percent >= 40) return "amber";
  return "red";
}

// Maintenance › AMC analytics — sourced from the "mn-amc" section in
// fm_matrix_phase10 (29).html.
// Maintenance › AMC, Checklists, and Inventory analytics — wired to the live
// /fm_dashboard/amc/*, /fm_dashboard/checklists/*, /fm_dashboard/inventory/* endpoints.
// Only fixed column definitions live here now; figures are computed at render time.
interface InventoryKpiRow {
  kpi: string;
  formula: string;
  value: string;
  tone: TableBadgeTone;
}

const INVENTORY_KPI_COLUMNS: DataTableColumn<InventoryKpiRow>[] = [
  { key: "kpi", header: "KPI", render: (row) => <span className="text-brand-text">{row.kpi}</span> },
  { key: "formula", header: "Formula", render: (row) => <span className="text-brand-body-5 text-brand-text-light">{row.formula}</span> },
  { key: "value", header: "Value", render: (row) => <TableBadge tone={row.tone}>{row.value}</TableBadge> },
];

// Maintenance › Waste analytics — wired to the live /fm_dashboard/waste/* endpoints.
// Only the fixed column shape lives here now; row data is computed at render time
// from waste_breakdown.by_category (the API has no per-record log, only aggregates).
interface WasteCategoryTableRow {
  category: string;
  generatedKg: number;
  recycledKg: number;
  recycledPercent: number;
}

const WASTE_CATEGORY_TABLE_COLUMNS: DataTableColumn<WasteCategoryTableRow>[] = [
  { key: "category", header: "Category", render: (row) => <span className="font-semibold text-brand-text">{row.category}</span> },
  { key: "generated", header: "Generated (KG)", align: "center", render: (row) => <span className="text-brand-text">{row.generatedKg.toLocaleString()}</span> },
  { key: "recycled", header: "Recycled (KG)", align: "center", render: (row) => <span className="text-brand-text">{row.recycledKg.toLocaleString()}</span> },
  {
    key: "rate",
    header: "Recycled %",
    align: "center",
    render: (row) => (
      <TableBadge tone={row.recycledPercent >= 50 ? "green" : row.recycledPercent > 0 ? "amber" : "red"}>{row.recycledPercent}%</TableBadge>
    ),
  },
];

// Maintenance › Attendance, Survey, and Vendor analytics — wired to the live
// /fm_dashboard/attendance/*, /fm_dashboard/survey/*, /fm_dashboard/vendor/* endpoints.
// Only fixed column/row shape definitions live here now; figures are computed at render time.
interface SurveyWeeklyTableRow {
  week: string;
  avgCsat: number | null;
  responseCount: number | null;
}

const SURVEY_WEEKLY_TABLE_COLUMNS: DataTableColumn<SurveyWeeklyTableRow>[] = [
  { key: "week", header: "Week", render: (row) => <span className="font-semibold text-brand-text">{row.week}</span> },
  {
    key: "csat",
    header: "Avg CSAT",
    align: "center",
    render: (row) => <span className="text-brand-text">{row.avgCsat !== null ? row.avgCsat.toFixed(2) : "–"}</span>,
  },
  {
    key: "responses",
    header: "Responses",
    align: "center",
    render: (row) => <span className="text-brand-text">{row.responseCount !== null ? row.responseCount : "–"}</span>,
  },
];

interface VendorPerformanceTableRow {
  vendorName: string;
  totalRequests: number | null;
  breached: number | null;
  slaCompliancePercent: number | null;
}

const VENDOR_PERFORMANCE_TABLE_COLUMNS: DataTableColumn<VendorPerformanceTableRow>[] = [
  { key: "vendor", header: "Vendor", render: (row) => <span className="font-semibold text-brand-text">{row.vendorName}</span> },
  {
    key: "requests",
    header: "Total Requests",
    align: "center",
    render: (row) => <span className="text-brand-text">{row.totalRequests ?? "–"}</span>,
  },
  {
    key: "breached",
    header: "Breached",
    align: "center",
    render: (row) => <span className="text-brand font-semibold">{row.breached ?? "–"}</span>,
  },
  {
    key: "sla",
    header: "SLA Compliance",
    align: "center",
    render: (row) => (
      <TableBadge tone={row.slaCompliancePercent === null ? "grey" : row.slaCompliancePercent >= 80 ? "green" : row.slaCompliancePercent >= 50 ? "amber" : "red"}>
        {row.slaCompliancePercent !== null ? `${row.slaCompliancePercent}%` : "N/A"}
      </TableBadge>
    ),
  },
];

const INSIGHT_ITEM_TONE_STYLES = {
  err: { bg: "rgba(218,119,86,0.16)", color: "#DA7756" },
  warn: { bg: "rgba(237,196,136,0.22)", color: "#7A4F00" },
  ok: { bg: "rgba(16,140,114,0.12)", color: "#108C72" },
} as const;

const INSIGHT_CATEGORY_TONE_STYLES = {
  err: { bg: "rgba(218,119,86,0.16)", color: "#DA7756" },
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
        <span className="animate-pulse rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: "#DA7756" }}>
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
            <div className="text-brand-h2 font-bold" style={{ color: "#DA7756" }}>{data.health.critical}</div>
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
            <span className="flex-shrink-0 font-bold" style={{ color: "#DA7756" }}>•</span>
            <span>Compliance deterioration across permits, audits and vendor accountability now spans multiple workflows.</span>
          </div>
          <div className="flex gap-1.5">
            <span className="flex-shrink-0 font-bold" style={{ color: "#DA7756" }}>•</span>
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
  const isFinanceView = activeModule === "finance";
  const isCrmView = activeModule === "crm";

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

  // --- Tickets section: dynamic site scope, date range, and live API data ---
  const [dashboardSiteIds, setDashboardSiteIds] = useState<number[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [sitesError, setSitesError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id") ?? "";
    if (!userId) {
      setSitesLoading(false);
      setSitesError("No logged-in user found — cannot resolve allowed sites.");
      return;
    }
    let cancelled = false;
    setSitesLoading(true);
    fetchAllowedSites(userId)
      .then((res) => {
        if (cancelled) return;
        const ids = (res.sites ?? [])
          .map((s) => s.id)
          .filter((id): id is number => typeof id === "number");
        setDashboardSiteIds(ids);
        if (ids.length === 0) setSitesError("No sites are allowed for this user.");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setSitesError(err instanceof Error ? err.message : "Failed to load allowed sites.");
      })
      .finally(() => {
        if (!cancelled) setSitesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [dashboardDateRange, setDashboardDateRange] = useState<{ from: Date; to: Date }>(getDefaultDashboardDateRange);
  const [periodPopupOpen, setPeriodPopupOpen] = useState(false);
  const [filtersPopupOpen, setFiltersPopupOpen] = useState(false);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [appliedBuilding, setAppliedBuilding] = useState("all");
  const [appliedCategory, setAppliedCategory] = useState("all");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  const dashboardFromDate = useMemo(() => formatApiDate(dashboardDateRange.from), [dashboardDateRange.from]);
  const dashboardToDate = useMemo(() => formatApiDate(dashboardDateRange.to), [dashboardDateRange.to]);

  const {
    data: ticketsApiData,
    loading: ticketsLoading,
    error: ticketsError,
  } = useTicketsDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: assetsApiData,
    loading: assetsLoading,
    error: assetsError,
  } = useAssetsDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: auditApiData,
    loading: auditLoading,
    error: auditError,
  } = useAuditDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: amcApiData,
    loading: amcLoading,
    error: amcError,
  } = useAmcDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: checklistsApiData,
    loading: checklistsLoading,
    error: checklistsError,
  } = useChecklistsDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: inventoryApiData,
    loading: inventoryLoading,
    error: inventoryError,
  } = useInventoryDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: wasteApiData,
    loading: wasteLoading,
    error: wasteError,
  } = useWasteDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: attendanceApiData,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAttendanceDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: surveyApiData,
    loading: surveyLoading,
    error: surveyError,
  } = useSurveyDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: vendorApiData,
    loading: vendorLoading,
    error: vendorError,
  } = useVendorDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isTicketsView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: permitsApiData,
    loading: permitsLoading,
    error: permitsError,
  } = usePermitsDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isSafetyView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  const {
    data: incidentsApiData,
    loading: incidentsLoading,
    error: incidentsError,
  } = useIncidentsDashboardData({
    siteIds: dashboardSiteIds,
    fromDate: dashboardFromDate,
    toDate: dashboardToDate,
    enabled: isSafetyView && !sitesLoading && dashboardSiteIds.length > 0,
  });

  // Which section(s) failed to load — each one gets its own toast naming the
  // card/API that failed, instead of one generic banner above the grid.
  const failedSections = useMemo(
    () =>
      [
        { label: "Allowed Sites", error: sitesError },
        { label: "Tickets", error: ticketsError },
        { label: "Assets", error: assetsError },
        { label: "Audit", error: auditError },
        { label: "AMC", error: amcError },
        { label: "Checklists", error: checklistsError },
        { label: "Inventory", error: inventoryError },
        { label: "Waste", error: wasteError },
        { label: "Attendance", error: attendanceError },
        { label: "Survey", error: surveyError },
        { label: "Vendor", error: vendorError },
        { label: "Permits", error: permitsError },
        { label: "Incidents", error: incidentsError },
      ].filter((s): s is { label: string; error: string } => s.error !== null),
    [
      sitesError,
      ticketsError,
      assetsError,
      auditError,
      amcError,
      checklistsError,
      inventoryError,
      wasteError,
      attendanceError,
      surveyError,
      vendorError,
      permitsError,
      incidentsError,
    ]
  );
  const shownFailedSectionLabelsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    failedSections.forEach((section) => {
      if (!shownFailedSectionLabelsRef.current.has(section.label)) {
        toast.error(`${section.label} failed to load`, { description: section.error });
      }
    });
    shownFailedSectionLabelsRef.current = new Set(failedSections.map((s) => s.label));
  }, [failedSections]);

  const ticketsOverview = ticketsApiData.overview;
  const ticketsTrends = ticketsApiData.trends;
  const ticketsBreakdown = ticketsApiData.breakdown;
  const ticketsWorkforce = ticketsApiData.workforce;
  const ticketsQuality = ticketsApiData.quality;
  const ticketKpis = ticketsOverview?.kpis ?? null;

  const poolCompositionData = useMemo(() => {
    const pc = ticketsOverview?.pool_composition;
    if (!pc) return [];
    return [
      { name: "Pending", value: pc.pending },
      { name: "In Progress", value: pc.in_progress },
      { name: "On Hold", value: pc.on_hold },
      { name: "Closed", value: pc.closed },
    ];
  }, [ticketsOverview]);
  const poolTotal = ticketsOverview?.pool_composition.total ?? 0;

  const categoryStackData = useMemo(
    () =>
      (ticketsBreakdown?.by_category ?? []).map((c) => ({
        category: c.name,
        pending: c.status_breakdown.pending,
        inProgress: c.status_breakdown.in_progress,
        onHold: c.status_breakdown.on_hold,
        closed: c.status_breakdown.closed,
      })),
    [ticketsBreakdown]
  );

  const categoryTableData: CategoryRow[] = useMemo(
    () =>
      (ticketsBreakdown?.by_category ?? []).map((c) => {
        const trend = vsLastMonthDisplay(c.vs_last_month_percent);
        const ageingDays = Math.round(parseFloat(c.avg_ageing_days) || 0);
        return {
          category: c.name,
          total: c.total,
          tatBreach: c.tat_breach_percent,
          tatTone: tatBreachTone(c.tat_breach_percent),
          trendDisplay: trend.display,
          trendTone: trend.tone,
          ageing: `${ageingDays}d`,
          ageingHighlight: ageingDays >= 60,
        };
      }),
    [ticketsBreakdown]
  );

  const replyResolutionData = useMemo(
    () =>
      (ticketsTrends?.first_reply_vs_resolution.data ?? []).map((d) => ({
        month: formatMonthLabel(d.month),
        replyHrs: Number(d.avg_reply_hrs) || 0,
        resolutionDays: d.avg_resolution_days == null ? 0 : Number(d.avg_resolution_days) || 0,
      })),
    [ticketsTrends]
  );

  const slaBreach = ticketsTrends?.sla_breach ?? null;
  const slaBreachChartData = useMemo(
    () => (slaBreach?.data ?? []).map((d) => ({ month: formatMonthLabel(d.month), breaches: d.breach_count })),
    [slaBreach]
  );

  const resolvedAgeTierData = ticketsTrends?.resolved_by_age_tier ?? [];
  const unresolvedAgeTierData = ticketsTrends?.unresolved_by_age_tier ?? [];

  const heatmapDays = ticketsTrends?.volume_heatmap.days ?? HEATMAP_DAYS_FALLBACK;
  const heatmapHours = ticketsTrends?.volume_heatmap.hours ?? HEATMAP_HOURS_FALLBACK;
  const heatmapData = ticketsTrends?.volume_heatmap.data ?? [];

  const techWorkload = ticketsWorkforce?.technician_workload ?? null;
  const techWorkloadData = useMemo(
    () =>
      (techWorkload?.data ?? [])
        .slice()
        .sort((a, b) => b.open_ticket_count - a.open_ticket_count)
        .map((t) => ({ tech: t.name, count: t.open_ticket_count })),
    [techWorkload]
  );

  const goldenRedFlag = ticketsWorkforce?.golden_red_flag_by_person ?? null;
  const goldenRedFlagData = useMemo(
    () =>
      (goldenRedFlag?.data ?? []).map((p, i) => ({
        person: p.name ?? p.user_name ?? `User ${i + 1}`,
        golden: Number(p.golden_avg_age_days ?? p.golden ?? 0),
        redFlag: Number(p.red_flag_avg_age_days ?? p.red_flag ?? 0),
      })),
    [goldenRedFlag]
  );
  const siteWideAvgAgeDays = ticketKpis?.site_wide_avg_age_days ?? goldenRedFlag?.site_wide_avg_age_days ?? "0";
  const goldenAgedRows = useMemo(
    () =>
      goldenRedFlagData
        .filter((p) => p.golden > Number(siteWideAvgAgeDays))
        .map((p) => ({ label: p.person, badge: { tone: "red" as TableBadgeTone, label: `${p.golden}d` } })),
    [goldenRedFlagData, siteWideAvgAgeDays]
  );

  const byUserRows = useMemo(
    () =>
      (ticketsBreakdown?.by_user ?? [])
        .slice()
        .sort((a, b) => b.ticket_count - a.ticket_count)
        .slice(0, 6)
        .map((u) => ({ label: u.name, value: String(u.ticket_count) })),
    [ticketsBreakdown]
  );
  const byDeptRows = useMemo(
    () =>
      (ticketsBreakdown?.by_department ?? [])
        .slice()
        .sort((a, b) => b.ticket_count - a.ticket_count)
        .slice(0, 6)
        .map((d) => ({ label: d.name, value: String(d.ticket_count) })),
    [ticketsBreakdown]
  );

  const locationVolumeData = useMemo(
    () =>
      (ticketsBreakdown?.by_location ?? [])
        .slice()
        .sort((a, b) => b.ticket_count - a.ticket_count)
        .map((l) => ({ location: l.name, tickets: l.ticket_count })),
    [ticketsBreakdown]
  );

  const sourceOriginData = useMemo(
    () => (ticketsBreakdown?.by_source ?? []).map((s) => ({ source: s.source, tickets: s.ticket_count })),
    [ticketsBreakdown]
  );
  const sourceOriginColors = useMemo(
    () => sourceOriginData.map((s, i) => SOURCE_COLOR_MAP[s.source] ?? getPaletteColor(i)),
    [sourceOriginData]
  );

  const repeatComplaintsData = useMemo(
    () =>
      (ticketsQuality?.repeat_complaints ?? []).map((r, i) => ({
        issue: r.issue ?? r.description ?? r.tenant ?? `Repeat complaint ${i + 1}`,
        count: Number(r.count ?? r.ticket_count ?? 0),
      })),
    [ticketsQuality]
  );

  const assetLinked = ticketsQuality?.asset_linked_tickets ?? null;
  const assetLinkedData = useMemo(
    () => (assetLinked?.assets ?? []).map((a) => ({ asset: a.name, count: a.ticket_count })),
    [assetLinked]
  );

  const peakHours = useMemo(() => ticketsTrends?.peak_hours ?? [], [ticketsTrends]);
  const peakHoursData = useMemo(
    () => peakHours.map((h) => ({ hour: `${String(h.hour).padStart(2, "0")}:00`, count: h.ticket_count })),
    [peakHours]
  );
  const busiestHour = useMemo(
    () =>
      peakHours.length
        ? peakHours.reduce((max, h) => (h.ticket_count > max.ticket_count ? h : max), peakHours[0])
        : null,
    [peakHours]
  );

  const smartInsightRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    rows.push({
      label: "Repeat Complaints",
      value: repeatComplaintsData[0]
        ? `${repeatComplaintsData[0].issue} (${repeatComplaintsData[0].count}x)`
        : "No repeat complaints in this period",
    });
    if (slaBreach) {
      rows.push({
        label: "SLA Breaches",
        value: `${slaBreach.percent_of_all_tickets}% breach rate · ${slaBreach.total_breaches} of ${slaBreach.total_tickets} tickets`,
      });
    }
    rows.push({
      label: "Frequent Asset-Related Tickets",
      value: assetLinkedData[0]
        ? `${assetLinkedData[0].asset}: ${assetLinkedData[0].count} tickets`
        : "No repeat asset-linked tickets",
    });
    if (ticketKpis) {
      rows.push({
        label: "Golden Tickets",
        value: `${ticketKpis.golden_open} open · avg age ${ticketKpis.golden_avg_age_days}d vs site-wide ${ticketKpis.site_wide_avg_age_days}d`,
      });
    }
    rows.push({
      label: "Technician Workload",
      value: techWorkloadData[0]
        ? `${techWorkloadData[0].tech} carrying the most: ${techWorkloadData[0].count} open`
        : "No open tickets currently assigned",
    });
    rows.push({
      label: "Peak Complaint Hour",
      value: busiestHour
        ? `${String(busiestHour.hour).padStart(2, "0")}:00 · ${busiestHour.ticket_count} tickets`
        : "Not enough data yet",
    });
    return rows;
  }, [repeatComplaintsData, slaBreach, assetLinkedData, ticketKpis, techWorkloadData, busiestHour]);

  // --- Assets section: derived from the live /fm_dashboard/assets/* endpoints ---
  const assetsOverview = assetsApiData.overview;
  const assetsCondition = assetsApiData.condition;
  const assetsCategory = assetsApiData.category;
  const assetsMaintenance = assetsApiData.maintenance;
  const assetHealth = assetsOverview?.asset_health ?? null;

  const assetLifecycleData = useMemo(() => {
    if (!assetHealth) return [];
    const rows = [
      { name: "In Use", value: assetHealth.in_use },
      { name: "Breakdown", value: assetHealth.breakdown },
      { name: "Allocated", value: assetHealth.allocated },
      { name: "In Store", value: assetHealth.in_store },
      { name: "Disposed", value: assetHealth.disposed },
    ];
    if (assetHealth.unclassified > 0) rows.push({ name: "Unclassified", value: assetHealth.unclassified });
    return rows;
  }, [assetHealth]);

  const topCurrentlyDown = useMemo(() => assetsOverview?.top_currently_down ?? [], [assetsOverview]);

  const criticalBreakdownData = useMemo(() => {
    const c = assetsCondition?.critical_vs_noncritical_breakdown;
    if (!c) return [];
    return [
      { category: "Critical assets", rate: c.critical.breakdown_percent },
      { category: "Non-Critical assets", rate: c.non_critical.breakdown_percent },
    ];
  }, [assetsCondition]);

  const breakdownByAllocationData = useMemo(
    () =>
      (assetsCategory?.breakdowns_by_allocation ?? []).map((a) => ({
        team: a.allocation_type.charAt(0).toUpperCase() + a.allocation_type.slice(1),
        count: a.breakdown_count,
      })),
    [assetsCategory]
  );

  const categoryAssetBreakdownData = useMemo(
    () =>
      (assetsCategory?.category_wise_breakdown ?? [])
        .filter((c) => appliedCategory === "all" || c.name === appliedCategory)
        .slice()
        .sort((a, b) => b.total - a.total)
        .slice(0, 10)
        .map((c) => ({ category: c.name, count: c.total })),
    [assetsCategory, appliedCategory]
  );

  const costByCategoryData = useMemo(
    () =>
      (assetsCategory?.cost_by_category ?? [])
        .filter((c) => c.total_cost > 0)
        .filter((c) => appliedCategory === "all" || c.name === appliedCategory)
        .slice()
        .sort((a, b) => b.total_cost - a.total_cost)
        .slice(0, 8)
        .map((c) => ({ category: c.name, value: Number((c.total_cost / 100000).toFixed(2)) })),
    [assetsCategory, appliedCategory]
  );

  const repeatOffendersRows = useMemo(
    () =>
      (assetsMaintenance?.top_repeat_offenders ?? []).map((a) => ({
        label: a.name,
        badge: {
          tone: (a.breakdown_count >= 3 ? "red" : "amber") as TableBadgeTone,
          label: `${a.breakdown_count}x breakdown · MTBF ${a.mtbf_days}d`,
        },
      })),
    [assetsMaintenance]
  );

  const highMaintenanceCostRows = useMemo(
    () =>
      (assetsMaintenance?.high_maintenance_cost_assets ?? [])
        .slice()
        .sort((a, b) => b.total_repair_cost - a.total_repair_cost)
        .slice(0, 6)
        .map((a) => ({
          label: a.name,
          badge: {
            tone: "amber" as TableBadgeTone,
            label: `₹${a.total_repair_cost.toLocaleString()}${
              a.repair_cost_ratio_percent !== null ? ` · ${a.repair_cost_ratio_percent}% ratio` : ""
            }`,
          },
        })),
    [assetsMaintenance]
  );

  const repairCostRatioData = useMemo(
    () =>
      (assetsMaintenance?.high_maintenance_cost_assets ?? [])
        .filter((a) => a.repair_cost_ratio_percent !== null)
        .map((a) => ({ asset: a.name, ratio: a.repair_cost_ratio_percent as number })),
    [assetsMaintenance]
  );

  // --- Audit section: derived from the live /fm_dashboard/audits/* endpoints ---
  const auditOverview = auditApiData.overview;
  const auditAssetCompliance = auditApiData.assetCompliance;
  const auditExecution = auditApiData.execution;
  const auditFindings = auditApiData.findings;
  const auditByType = useMemo(() => auditOverview?.by_type ?? [], [auditOverview]);
  const auditAssetType = useMemo(() => auditByType.find((t) => t.audit_type === "Asset") ?? null, [auditByType]);
  const auditVendorType = useMemo(() => auditByType.find((t) => t.audit_type === "Vendor") ?? null, [auditByType]);
  const auditOperationalType = useMemo(
    () => auditByType.find((t) => t.audit_type !== "Asset" && t.audit_type !== "Vendor") ?? null,
    [auditByType]
  );

  const auditStatusOverviewData = useMemo(() => {
    const sb = auditOverview?.status_breakdown;
    if (!sb) return [];
    return Object.entries(sb)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
        value,
      }));
  }, [auditOverview]);

  const auditCompletionBarData = useMemo(
    () =>
      auditByType.map((t) => ({
        type: t.audit_type,
        pct: t.completion_percent,
        fraction: `${t.completed}/${t.total}`,
      })),
    [auditByType]
  );

  const auditExecutionConcentration = useMemo(
    () => (auditExecution?.execution_concentration ?? []).slice().sort((a, b) => b.share_percent - a.share_percent),
    [auditExecution]
  );
  const topAuditor = auditExecutionConcentration[0] ?? null;

  const auditStalledRows = useMemo(
    () =>
      (auditExecution?.stalled_audits ?? []).map((s, i) => ({
        label: (typeof s.name === "string" && s.name) || `Stalled audit ${i + 1}`,
        badge: {
          tone: "red" as TableBadgeTone,
          label: typeof s.days_stalled === "number" ? `${s.days_stalled}d no activity` : "No activity recorded",
        },
      })),
    [auditExecution]
  );

  const auditFindingsBySite = useMemo(
    () =>
      (auditFindings?.findings_by_site ?? [])
        .slice()
        .sort((a, b) => (b.findings_count ?? 0) - (a.findings_count ?? 0)),
    [auditFindings]
  );
  const topFindingsSite = auditFindingsBySite[0] ?? null;

  const auditRedFlagRows = useMemo(() => {
    const rows: { label: string; badge: { tone: TableBadgeTone; label: string } }[] = [];
    if (auditOverview) {
      rows.push({
        label: "Overdue Audits",
        badge: { tone: "red", label: `${auditOverview.status_breakdown.overdue} of ${auditOverview.total_audits}` },
      });
    }
    if (topFindingsSite) {
      rows.push({
        label: "Site with Maximum Findings",
        badge: {
          tone: "red",
          label: `${topFindingsSite.site_name ?? "Unknown site"} — ${topFindingsSite.findings_count ?? 0} findings`,
        },
      });
    }
    return rows;
  }, [auditOverview, topFindingsSite]);

  const auditInsightRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    if (topAuditor) {
      rows.push({
        label: "Execution Concentration",
        value: `${topAuditor.name} runs ${topAuditor.share_percent}% of all audits`,
      });
    }
    if (auditOverview) {
      rows.push({
        label: "Audit Status Split",
        value: `${auditOverview.status_breakdown.overdue} overdue vs ${auditOverview.status_breakdown.completed} completed of ${auditOverview.total_audits} total`,
      });
    }
    if (auditAssetCompliance) {
      rows.push({
        label: "Asset Compliance Gap",
        value: `${auditAssetCompliance.assets_missing_documentation} of ${auditAssetCompliance.total_assets} assets missing documentation`,
      });
      rows.push({
        label: "QR/Barcode Compliance",
        value: `${auditAssetCompliance.qr_barcode_compliance.compliance_percent}% of assets are QR/barcode compliant`,
      });
    }
    return rows;
  }, [topAuditor, auditOverview, auditAssetCompliance]);

  const auditKpiRows: AuditKpiRow[] = useMemo(() => {
    const rows: AuditKpiRow[] = [];
    if (auditOverview) {
      rows.push({
        kpi: "Audit Compliance Score",
        formula: "Completed ÷ Scheduled × 100",
        value: `${auditOverview.audit_score_percent}%`,
        tone: auditScoreTone(auditOverview.audit_score_percent),
      });
      rows.push({
        kpi: "Total Audits",
        formula: "Count of all audits in scope",
        value: String(auditOverview.total_audits),
        tone: auditOverview.total_audits > 0 ? "green" : "grey",
      });
      rows.push({
        kpi: "Overdue Audits",
        formula: "Status = Overdue",
        value: String(auditOverview.status_breakdown.overdue),
        tone: auditOverview.status_breakdown.overdue > 0 ? "red" : "green",
      });
    }
    if (auditAssetType) {
      rows.push({
        kpi: "Asset Audit Completion %",
        formula: "Asset audits completed ÷ scheduled × 100",
        value: `${auditAssetType.completion_percent}% (${auditAssetType.completed}/${auditAssetType.total})`,
        tone: auditScoreTone(auditAssetType.completion_percent),
      });
    }
    if (auditAssetCompliance) {
      rows.push({
        kpi: "QR / Barcode Compliance %",
        formula: "Compliant assets ÷ Total assets × 100",
        value: `${auditAssetCompliance.qr_barcode_compliance.compliance_percent}%`,
        tone: auditScoreTone(auditAssetCompliance.qr_barcode_compliance.compliance_percent),
      });
    }
    rows.push({
      kpi: "Vendor Audit Pass Rate %",
      formula: "Vendor Passed ÷ Vendor Conducted × 100",
      value: "Not available — no pass/fail field in the audits API",
      tone: "grey",
    });
    rows.push({
      kpi: "CAPA Closure Rate %",
      formula: "Closed CAPA tasks ÷ Total CAPA tasks × 100",
      value: "Not available — CAPA isn't part of the audits API",
      tone: "grey",
    });
    return rows;
  }, [auditOverview, auditAssetType, auditAssetCompliance]);

  // --- AMC section: derived from the live /fm_dashboard/amc/* endpoints ---
  const amcOverview = amcApiData.overview;
  const amcExpiry = amcApiData.expiry;
  const amcVendor = amcApiData.vendor;
  const amcCoverage = amcApiData.coverage;

  const amcExpiryTimelineData = useMemo(() => {
    const t = amcExpiry?.expiry_timeline;
    if (!t) return [];
    return [
      { bucket: "Expired", count: t.expired },
      { bucket: "Expiring 0-30d", count: t.expiring_0_30 },
      { bucket: "Expiring 31-90d", count: t.expiring_31_90 },
      { bucket: "Active 90+ d", count: t.active_90_plus },
    ];
  }, [amcExpiry]);

  const amcUrgencyCriticalityData = useMemo(() => {
    const rows = amcExpiry?.urgency_vs_criticality ?? [];
    const buckets = new Map<string, { bucket: string; critical: number; nonCritical: number }>();
    rows.forEach((r) => {
      const entry = buckets.get(r.expiry_bucket) ?? { bucket: r.expiry_bucket, critical: 0, nonCritical: 0 };
      if (r.criticality === "Critical") entry.critical += r.count;
      else entry.nonCritical += r.count;
      buckets.set(r.expiry_bucket, entry);
    });
    return Array.from(buckets.values());
  }, [amcExpiry]);

  const amcVendorConcentrationData = useMemo(
    () =>
      (amcVendor?.vendor_concentration ?? [])
        .slice()
        .sort((a, b) => b.missed_or_expired_percent - a.missed_or_expired_percent)
        .slice(0, 8)
        .map((v) => ({ vendor: v.vendor_name, pct: v.missed_or_expired_percent })),
    [amcVendor]
  );

  const amcCostTrendData = useMemo(
    () =>
      (amcVendor?.monthly_cost_trend ?? []).map((m) => ({
        month: formatMonthLabel(m.month),
        cost: Number((m.total_cost / 10000000).toFixed(2)),
      })),
    [amcVendor]
  );

  const amcCoverageByCategoryData = useMemo(
    () =>
      (amcCoverage?.coverage_by_category ?? [])
        .filter((c) => appliedCategory === "all" || c.name === appliedCategory)
        .slice()
        .sort((a, b) => a.coverage_percent - b.coverage_percent)
        .slice(0, 10)
        .map((c) => ({ category: c.name, pct: c.coverage_percent })),
    [amcCoverage, appliedCategory]
  );

  // --- Checklists section: derived from the live /fm_dashboard/checklists/* endpoints ---
  const checklistsOverview = checklistsApiData.overview;
  const checklistsCompliance = checklistsApiData.compliance;
  const checklistsTrends = checklistsApiData.trends;
  const checklistsFindings = checklistsApiData.findings;

  const checklistInHouse = useMemo(
    () => checklistsOverview?.execution_breakdown.find((e) => e.execution === "in_house") ?? null,
    [checklistsOverview]
  );
  const checklistVendorExecution = useMemo(
    () => checklistsOverview?.execution_breakdown.find((e) => e.execution === "vendor") ?? null,
    [checklistsOverview]
  );

  const checklistTypeBreakdownData = useMemo(
    () =>
      (checklistsOverview?.schedule_type_breakdown ?? []).map((t) => ({
        type: t.schedule_type,
        completed: t.status.closed,
        open: t.status.open + t.status.work_in_progress,
        overdue: t.status.overdue,
      })),
    [checklistsOverview]
  );

  const checklistTopSkippedItem = useMemo(() => {
    const rows = checklistsFindings?.perpetually_skipped ?? [];
    if (!rows.length) return null;
    return rows.slice().sort((a, b) => b.skip_rate_percent - a.skip_rate_percent)[0];
  }, [checklistsFindings]);

  const checklistSkippedRows = useMemo(
    () =>
      (checklistsFindings?.perpetually_skipped ?? [])
        .slice()
        .sort((a, b) => b.skip_rate_percent - a.skip_rate_percent)
        .slice(0, 5)
        .map((s) => ({
          label: s.name,
          badge: {
            tone: (s.skip_rate_percent >= 80 ? "red" : "amber") as TableBadgeTone,
            label: `Skipped ${s.skipped_count} of ${s.total_occurrences}`,
          },
        })),
    [checklistsFindings]
  );

  const checklistTop10CompletedData = useMemo(
    () =>
      (checklistsCompliance?.top_completed ?? [])
        .slice()
        .sort((a, b) => b.completed_count - a.completed_count)
        .slice(0, 10)
        .map((c) => ({ checklist: c.form_name, completions: c.completed_count })),
    [checklistsCompliance]
  );

  const checklistSitewiseComplianceData = useMemo(
    () =>
      (checklistsCompliance?.site_wise_compliance ?? [])
        .slice()
        .sort((a, b) => b.compliance_percent - a.compliance_percent)
        .slice(0, 10)
        .map((s) => ({ site: s.site_name, compliance: s.compliance_percent })),
    [checklistsCompliance]
  );

  const checklistMonthlyTrendData = useMemo(
    () =>
      (checklistsTrends?.monthly_trend ?? []).map((m) => ({
        month: formatMonthLabel(m.month),
        completed: m.completed,
        pending: m.pending,
      })),
    [checklistsTrends]
  );

  const checklistLowestClosureType = useMemo(() => {
    const types = checklistsOverview?.schedule_type_breakdown ?? [];
    if (!types.length) return null;
    return types.reduce((min, t) => (t.closure_rate_percent < min.closure_rate_percent ? t : min), types[0]);
  }, [checklistsOverview]);

  const checklistTopHighPendingSite = useMemo(() => {
    const rows = checklistsFindings?.high_pending_sites ?? [];
    if (!rows.length) return null;
    return rows.slice().sort((a, b) => b.pending_count - a.pending_count)[0];
  }, [checklistsFindings]);

  const checklistRedFlagRows = useMemo(() => {
    const rows: { label: string; badge: { tone: TableBadgeTone; label: string } }[] = [];
    if (checklistsOverview) {
      rows.push({
        label: "Overdue Checklists",
        badge: { tone: "red", label: `${checklistsOverview.status_breakdown.overdue} past due date` },
      });
    }
    if (checklistLowestClosureType) {
      rows.push({
        label: "Low Closure Rate Checklists",
        badge: {
          tone: "red",
          label: `${checklistLowestClosureType.schedule_type}: ${checklistLowestClosureType.closure_rate_percent}% closure`,
        },
      });
    }
    if (checklistTopSkippedItem) {
      rows.push({
        label: "Repeated Failed Checklists",
        badge: {
          tone: "red",
          label: `${checklistTopSkippedItem.name} — ${checklistTopSkippedItem.skipped_count} of ${checklistTopSkippedItem.total_occurrences} cycles`,
        },
      });
    }
    if (checklistsCompliance) {
      rows.push({
        label: "Weightage Scoring Adoption",
        badge: {
          tone: checklistsCompliance.weightage_scoring.adoption_percent < 50 ? "amber" : "green",
          label: `${checklistsCompliance.weightage_scoring.enabled_forms} of ${checklistsCompliance.weightage_scoring.total_forms} forms (${checklistsCompliance.weightage_scoring.adoption_percent}%)`,
        },
      });
    }
    if (checklistTopHighPendingSite) {
      rows.push({
        label: "High Pending Sites",
        badge: {
          tone: "red",
          label: `${checklistTopHighPendingSite.site_name} — ${checklistTopHighPendingSite.pending_count} pending checklists`,
        },
      });
    }
    return rows;
  }, [checklistsOverview, checklistLowestClosureType, checklistTopSkippedItem, checklistsCompliance, checklistTopHighPendingSite]);

  const checklistTopOverdueType = useMemo(() => {
    const rows = checklistsFindings?.overdue_by_type ?? [];
    if (!rows.length) return null;
    return rows.reduce((max, r) => (r.overdue_count > max.overdue_count ? r : max), rows[0]);
  }, [checklistsFindings]);

  const checklistInsightRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [];
    if (checklistTopOverdueType) {
      rows.push({
        label: "Highest Overdue Schedule Type",
        value: `${checklistTopOverdueType.schedule_type}: ${checklistTopOverdueType.overdue_count} overdue`,
      });
    }
    if (checklistTopSkippedItem) {
      rows.push({
        label: "Priority Checklist Recommendation",
        value: `${checklistTopSkippedItem.name} skipped ${checklistTopSkippedItem.skipped_count} of ${checklistTopSkippedItem.total_occurrences} cycles — a task-definition problem, not random inconsistency`,
      });
    }
    if (checklistTopHighPendingSite) {
      rows.push({
        label: "Resource Allocation Suggestion",
        value: `${checklistTopHighPendingSite.site_name} carries ${checklistTopHighPendingSite.pending_count} of the pending load`,
      });
    }
    if (checklistsOverview) {
      rows.push({
        label: "Category Split",
        value: `${checklistsOverview.category_split.technical} technical vs ${checklistsOverview.category_split.non_technical} non-technical checklists`,
      });
    }
    if (checklistInHouse && checklistVendorExecution) {
      rows.push({
        label: "Execution Split",
        value: `In-house: ${checklistInHouse.total} (${checklistInHouse.closure_rate_percent}% closure) vs Vendor: ${checklistVendorExecution.total} (${checklistVendorExecution.closure_rate_percent}% closure)`,
      });
    }
    return rows;
  }, [checklistTopOverdueType, checklistTopSkippedItem, checklistTopHighPendingSite, checklistsOverview, checklistInHouse, checklistVendorExecution]);

  // --- Inventory section: derived from the live /fm_dashboard/inventory/* endpoints ---
  const inventoryOverview = inventoryApiData.overview;
  const inventoryStockHealth = inventoryApiData.stockHealth;
  const inventoryConsumption = inventoryApiData.consumption;
  const inventoryOperations = inventoryApiData.operations;

  const inventoryTypeBreakdownData = useMemo(() => {
    const rows = inventoryOverview?.type_criticality_breakdown ?? [];
    const byType = new Map<string, { type: string; critical: number; nonCritical: number }>();
    rows.forEach((r) => {
      const entry = byType.get(r.inventory_type) ?? { type: r.inventory_type, critical: 0, nonCritical: 0 };
      if (r.criticality === "Critical") entry.critical += r.count;
      else entry.nonCritical += r.count;
      byType.set(r.inventory_type, entry);
    });
    return Array.from(byType.values());
  }, [inventoryOverview]);

  const inventoryUrgentRestockRows = useMemo(
    () =>
      (inventoryStockHealth?.urgent_restock_priority ?? []).map((r, i) => ({
        label: (typeof r.name === "string" && r.name) || `Item ${i + 1}`,
        badge: {
          tone: "red" as TableBadgeTone,
          label:
            [
              typeof r.quantity === "number" ? `Qty ${r.quantity}` : null,
              typeof r.expiry_date === "string" ? `Expires ${r.expiry_date}` : null,
            ]
              .filter(Boolean)
              .join(" · ") || "Urgent restock",
        },
      })),
    [inventoryStockHealth]
  );

  const inventoryConsumptionTrendData = useMemo(
    () =>
      (inventoryConsumption?.monthly_cost_trend ?? [])
        .filter((m): m is { month: string; value: number } => typeof m.month === "string" && typeof m.value === "number")
        .map((m) => ({ month: formatMonthLabel(m.month), value: m.value })),
    [inventoryConsumption]
  );

  const inventoryCategoryConsumptionData = useMemo(
    () =>
      (inventoryConsumption?.category_wise_consumption ?? [])
        .filter((c): c is { category: string; value: number } => typeof c.category === "string" && typeof c.value === "number")
        .map((c) => ({ category: c.category, value: c.value })),
    [inventoryConsumption]
  );

  const inventoryDeadstockData = useMemo(
    () =>
      (inventoryStockHealth?.dead_stock.by_category ?? []).map((c) => ({
        category: c.category,
        value: c.value_at_risk,
      })),
    [inventoryStockHealth]
  );

  const inventoryKpiRows: InventoryKpiRow[] = useMemo(() => {
    const rows: InventoryKpiRow[] = [];
    if (inventoryOverview) {
      rows.push({
        kpi: "Current Inventory Value",
        formula: "Σ (Quantity × Unit Cost)",
        value: `₹${inventoryOverview.current_inventory_value.value.toLocaleString()} (${inventoryOverview.current_inventory_value.costed_items_count} costed items)`,
        tone: "amber",
      });
    }
    if (inventoryStockHealth) {
      rows.push({
        kpi: "Critical Stock Status",
        formula: "Items below reorder threshold",
        value: `${inventoryStockHealth.critical_stock_count} flagged`,
        tone: inventoryStockHealth.critical_stock_count > 0 ? "red" : "green",
      });
      rows.push({
        kpi: "Dead Stock & Overstock Value",
        formula: "Value of items with zero movement in 90+ days",
        value: `₹${inventoryStockHealth.dead_stock.total_value.toLocaleString()} across ${inventoryStockHealth.dead_stock.item_count} items`,
        tone: inventoryStockHealth.dead_stock.item_count > 0 ? "red" : "green",
      });
    }
    if (inventoryConsumption) {
      rows.push({
        kpi: "Turnover Ratio",
        formula: "Consumption ÷ Avg Stock Held",
        value: `${inventoryConsumption.turnover_ratio}x`,
        tone: inventoryConsumption.turnover_ratio < 1 ? "red" : "green",
      });
    }
    if (inventoryOperations) {
      rows.push({
        kpi: "GRN Workflow Status",
        formula: "Goods Received pending vs completed",
        value: `${inventoryOperations.grn_workflow.pending} pending, ${inventoryOperations.grn_workflow.completed} completed`,
        tone: inventoryOperations.grn_workflow.pending > 0 ? "amber" : "green",
      });
      rows.push({
        kpi: "Green Inventory Adoption %",
        formula: "Ecofriendly items ÷ Total items × 100",
        value: `${inventoryOperations.green_inventory.adoption_percent}%`,
        tone: inventoryOperations.green_inventory.adoption_percent >= 30 ? "green" : "amber",
      });
    }
    return rows;
  }, [inventoryOverview, inventoryStockHealth, inventoryConsumption, inventoryOperations]);

  // --- Waste section: derived from the live /fm_dashboard/waste/* endpoints ---
  const wasteOverview = wasteApiData.overview;
  const wasteBreakdown = wasteApiData.breakdown;
  const wasteTrend = wasteApiData.trend;
  const wasteVendorData = wasteApiData.vendor;

  const wasteFreshnessTone: "green" | "amber" | "red" = useMemo(() => {
    const days = wasteOverview?.days_since_last_activity;
    if (days === null || days === undefined) return "green";
    if (days > 30) return "red";
    if (days > 14) return "amber";
    return "green";
  }, [wasteOverview]);

  const wasteCategoryProgressRows = useMemo(() => {
    const rows = (wasteBreakdown?.by_category ?? []).filter((r) => appliedCategory === "all" || r.category === appliedCategory);
    const max = Math.max(1, ...rows.map((r) => r.generated_kg));
    return rows
      .slice()
      .sort((a, b) => b.generated_kg - a.generated_kg)
      .map((r, i) => ({
        label: r.category,
        value: `${r.generated_kg.toLocaleString()} KG`,
        percent: Math.round((r.generated_kg / max) * 100),
        color: getPaletteColor(i),
      }));
  }, [wasteBreakdown, appliedCategory]);

  const wasteCommodityProgressRows = useMemo(() => {
    const rows = wasteBreakdown?.by_commodity ?? [];
    const max = Math.max(1, ...rows.map((r) => r.generated_kg));
    return rows
      .slice()
      .sort((a, b) => b.generated_kg - a.generated_kg)
      .map((r, i) => ({
        label: r.commodity,
        value: `${r.generated_kg.toLocaleString()} KG`,
        percent: Math.round((r.generated_kg / max) * 100),
        color: getPaletteColor(i),
      }));
  }, [wasteBreakdown]);

  const wasteBuildingProgressRows = useMemo(() => {
    const rows = (wasteBreakdown?.by_building ?? []).filter((r) => appliedBuilding === "all" || r.name === appliedBuilding);
    const max = Math.max(1, ...rows.map((r) => r.generated_kg));
    return rows
      .slice()
      .sort((a, b) => b.generated_kg - a.generated_kg)
      .map((r, i) => ({
        label: r.name,
        value: `${r.generated_kg.toLocaleString()} KG`,
        percent: Math.round((r.generated_kg / max) * 100),
        color: getPaletteColor(i),
      }));
  }, [wasteBreakdown, appliedBuilding]);

  const wasteHazardousRow = useMemo(
    () => (wasteBreakdown?.by_commodity ?? []).find((r) => r.commodity.toLowerCase().includes("hazardous")) ?? null,
    [wasteBreakdown]
  );

  const wasteVendorRows = useMemo(() => {
    const rows = (wasteVendorData?.by_vendor ?? []).map((v) => ({
      label: v.vendor_name,
      badge: {
        tone: "amber" as TableBadgeTone,
        label: `${v.total_handled_kg.toLocaleString()} KG · ${v.record_count} record${v.record_count === 1 ? "" : "s"}`,
      },
    }));
    if (wasteVendorData && wasteVendorData.untagged.record_count > 0) {
      rows.push({
        label: "Untagged (no vendor set)",
        badge: {
          tone: "red" as TableBadgeTone,
          label: `${wasteVendorData.untagged.total_kg.toLocaleString()} KG · ${wasteVendorData.untagged.record_count} records`,
        },
      });
    }
    return rows;
  }, [wasteVendorData]);

  const wasteWeeklyTrendData = useMemo(
    () =>
      (wasteTrend?.weekly_trend ?? []).map((w) => ({
        week: w.week_start,
        generated: w.generated_kg,
        recycled: w.recycled_kg,
      })),
    [wasteTrend]
  );

  const wasteCategoryTableRows: WasteCategoryTableRow[] = useMemo(
    () =>
      (wasteBreakdown?.by_category ?? [])
        .filter((r) => appliedCategory === "all" || r.category === appliedCategory)
        .slice()
        .sort((a, b) => b.generated_kg - a.generated_kg)
        .map((r) => ({
          category: r.category,
          generatedKg: r.generated_kg,
          recycledKg: r.recycled_kg,
          recycledPercent: r.generated_kg > 0 ? Math.round((r.recycled_kg / r.generated_kg) * 100) : 0,
        })),
    [wasteBreakdown, appliedCategory]
  );

  // --- Attendance section: derived from the live /fm_dashboard/attendance/* endpoints ---
  const attendanceOverview = attendanceApiData.overview;
  const attendanceDepartment = attendanceApiData.department;
  const attendanceTrend = attendanceApiData.trend;
  const attendancePatterns = attendanceApiData.patterns;

  const attendanceTrendChartData = useMemo(
    () =>
      (attendanceTrend?.monthly_trend ?? [])
        .filter((m) => typeof m.month === "string" && typeof m.present_percent === "number")
        .map((m) => ({ month: formatMonthLabel(m.month as string), presentPct: m.present_percent as number })),
    [attendanceTrend]
  );

  const attendanceDepartmentRows = useMemo(
    () =>
      (attendanceDepartment?.department_breakdown ?? [])
        .filter((d) => typeof d.department === "string")
        .map((d) => ({
          label: d.department as string,
          value: `${typeof d.present_count === "number" ? d.present_count : "–"} / ${
            typeof d.absent_count === "number" ? d.absent_count : "–"
          }`,
        })),
    [attendanceDepartment]
  );

  const attendanceRepeatAbsenceRows = useMemo(
    () =>
      (attendancePatterns?.repeat_absence ?? [])
        .filter((r) => typeof r.employee_name === "string")
        .map((r) => ({
          label: `${r.employee_name}${typeof r.department === "string" ? ` — ${r.department}` : ""}`,
          badge: {
            tone: "red" as TableBadgeTone,
            label: typeof r.absence_count === "number" ? `${r.absence_count} absences` : "Repeat absence",
          },
        })),
    [attendancePatterns]
  );

  const attendanceHabitualLatecomerRows = useMemo(
    () =>
      (attendancePatterns?.habitual_latecomers ?? [])
        .filter((r) => typeof r.employee_name === "string")
        .map((r) => ({
          label: `${r.employee_name}${typeof r.department === "string" ? ` — ${r.department}` : ""}`,
          badge: {
            tone: "amber" as TableBadgeTone,
            label: typeof r.late_count === "number" ? `${r.late_count} late check-ins` : "Habitual latecomer",
          },
        })),
    [attendancePatterns]
  );

  // --- Survey section: derived from the live /fm_dashboard/survey/* endpoints ---
  const surveyOverview = surveyApiData.overview;
  const surveyBreakdown = surveyApiData.breakdown;
  const surveyTrend = surveyApiData.trend;
  const surveyTiming = surveyApiData.timing;

  const surveyCategoryRows = useMemo(() => {
    const rows = (surveyBreakdown?.response_by_category ?? []).filter(
      (r) => typeof r.category === "string" && typeof r.count === "number"
    );
    const max = Math.max(1, ...rows.map((r) => r.count as number));
    return rows
      .slice()
      .sort((a, b) => (b.count as number) - (a.count as number))
      .map((r, i) => ({
        label: r.category as string,
        value: typeof r.percent === "number" ? `${r.percent}% (${r.count})` : `${r.count}`,
        percent: Math.round(((r.count as number) / max) * 100),
        color: getPaletteColor(i),
      }));
  }, [surveyBreakdown]);

  const surveyWeeklyTrendData = useMemo(
    () =>
      (surveyTrend?.weekly_trend ?? [])
        .filter((w) => typeof w.week_start === "string" && typeof w.avg_csat === "number")
        .map((w) => ({ week: w.week_start as string, csat: w.avg_csat as number })),
    [surveyTrend]
  );

  const surveyWeeklyTableRows: SurveyWeeklyTableRow[] = useMemo(
    () =>
      (surveyTrend?.weekly_trend ?? [])
        .filter((w) => typeof w.week_start === "string")
        .map((w) => ({
          week: w.week_start as string,
          avgCsat: typeof w.avg_csat === "number" ? w.avg_csat : null,
          responseCount: typeof w.response_count === "number" ? w.response_count : null,
        })),
    [surveyTrend]
  );

  const surveyHourlyData = useMemo(
    () =>
      (surveyTiming?.hourly_heatmap ?? []).map((h) => ({
        hour: h.hour === 0 ? "12AM" : h.hour < 12 ? `${h.hour}AM` : h.hour === 12 ? "12PM" : `${h.hour - 12}PM`,
        value: h.response_count,
      })),
    [surveyTiming]
  );

  // --- Vendor section: derived from the live /fm_dashboard/vendor/* endpoints ---
  const vendorOverview = vendorApiData.overview;
  const vendorPerformance = vendorApiData.performance;
  const vendorRepeatIssuesData = vendorApiData.repeatIssues;
  const vendorKycRisk = vendorApiData.kycRisk;

  const vendorPerformanceRows = useMemo(() => {
    const rows = (vendorPerformance?.by_vendor ?? []).filter((r) => typeof r.vendor_name === "string");
    const max = Math.max(1, ...rows.map((r) => (typeof r.total_requests === "number" ? r.total_requests : 0)));
    return rows.map((r, i) => ({
      label: r.vendor_name as string,
      value: typeof r.sla_compliance_percent === "number" ? `${r.sla_compliance_percent}%` : "–",
      percent: typeof r.total_requests === "number" ? Math.round((r.total_requests / max) * 100) : 0,
      color: getPaletteColor(i),
    }));
  }, [vendorPerformance]);

  const vendorPerformanceTableRows: VendorPerformanceTableRow[] = useMemo(
    () =>
      (vendorPerformance?.by_vendor ?? [])
        .filter((r) => typeof r.vendor_name === "string")
        .map((r) => ({
          vendorName: r.vendor_name as string,
          totalRequests: typeof r.total_requests === "number" ? r.total_requests : null,
          breached: typeof r.breached === "number" ? r.breached : null,
          slaCompliancePercent: typeof r.sla_compliance_percent === "number" ? r.sla_compliance_percent : null,
        })),
    [vendorPerformance]
  );

  const vendorRepeatIssueRows = useMemo(
    () =>
      (vendorRepeatIssuesData?.repeat_issues ?? [])
        .filter((r) => typeof r.vendor_name === "string")
        .map((r) => ({
          label: `${r.vendor_name}${typeof r.issue === "string" ? ` — ${r.issue}` : ""}`,
          badge: {
            tone: "red" as TableBadgeTone,
            label: typeof r.repeat_count === "number" ? `${r.repeat_count} repeat calls` : "Repeat issue",
          },
        })),
    [vendorRepeatIssuesData]
  );

  const vendorExpiredKycRows = useMemo(
    () =>
      (vendorKycRisk?.vendors_with_expired_kyc_and_live_contracts ?? [])
        .filter((r) => typeof r.vendor_name === "string")
        .map((r) => ({
          label: `${r.vendor_name}${typeof r.contract_type === "string" ? ` — ${r.contract_type}` : ""}`,
          badge: {
            tone: "red" as TableBadgeTone,
            label: typeof r.kyc_expiry_date === "string" ? `KYC expired ${r.kyc_expiry_date}` : "KYC Expired",
          },
        })),
    [vendorKycRisk]
  );

  // --- Header controls: options for the Filters popup, computed from whatever
  // data has actually loaded so far (only Waste currently exposes a building
  // dimension; Assets/AMC/Waste all expose a category dimension). ---
  const wasteBuildingOptions = useMemo(
    () => Array.from(new Set((wasteBreakdown?.by_building ?? []).map((b) => b.name))).sort(),
    [wasteBreakdown]
  );
  const categoryFilterOptions = useMemo(() => {
    const names = new Set<string>();
    (assetsCategory?.category_wise_breakdown ?? []).forEach((c) => names.add(c.name));
    (wasteBreakdown?.by_category ?? []).forEach((c) => names.add(c.category));
    (amcCoverage?.coverage_by_category ?? []).forEach((c) => names.add(c.name));
    return Array.from(names).sort();
  }, [assetsCategory, wasteBreakdown, amcCoverage]);

  const headerSearchResults: HeaderSearchResult[] = useMemo(() => {
    const q = headerSearchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: HeaderSearchResult[] = [];
    MODULES.forEach((module) => {
      module.subTabs.forEach((subTab) => {
        if (subTab.toLowerCase().includes(q) || module.label.toLowerCase().includes(q)) {
          results.push({ moduleKey: module.key, moduleLabel: module.label, subTab });
        }
      });
    });
    return results.slice(0, 12);
  }, [headerSearchQuery]);

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
          <span className="hidden text-brand-body-4 text-brand-text-light md:inline">
            {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setPeriodPopupOpen((v) => !v);
                setFiltersPopupOpen(false);
                setSearchPopupOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-brand-body-4 font-semibold text-white hover:bg-brand-hover"
            >
              <CalendarDays className="w-4 h-4" />
              {periodButtonLabel(dashboardDateRange)}
              <ChevronDown className="w-4 h-4" />
            </button>
            {periodPopupOpen && (
              <div className="absolute right-0 top-full z-40 mt-2">
                <SelectPeriodPopover
                  initialRange={dashboardDateRange}
                  onApply={(range) => setDashboardDateRange(range)}
                  onReset={() => setDashboardDateRange(getDefaultDashboardDateRange())}
                  onClose={() => setPeriodPopupOpen(false)}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setFiltersPopupOpen((v) => !v);
                setPeriodPopupOpen(false);
                setSearchPopupOpen(false);
              }}
              aria-label="Filters"
              title="Filters"
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md border text-brand-text hover:bg-brand-light",
                appliedBuilding !== "all" || appliedCategory !== "all" ? "border-brand text-brand" : "border-brand-border"
              )}
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            {filtersPopupOpen && (
              <div className="absolute right-0 top-full z-40 mt-2">
                <FiltersPopover
                  buildingOptions={wasteBuildingOptions}
                  categoryOptions={categoryFilterOptions}
                  initialBuilding={appliedBuilding}
                  initialCategory={appliedCategory}
                  onApply={(building, category) => {
                    setAppliedBuilding(building);
                    setAppliedCategory(category);
                  }}
                  onClose={() => setFiltersPopupOpen(false)}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSearchPopupOpen((v) => !v);
                setPeriodPopupOpen(false);
                setFiltersPopupOpen(false);
              }}
              aria-label="Search"
              title="Search"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-brand-border text-brand-text hover:bg-brand-light"
            >
              <Search className="w-4 h-4" />
            </button>
            {searchPopupOpen && (
              <div className="absolute right-0 top-full z-40 mt-2">
                <SearchPopover
                  query={headerSearchQuery}
                  onQueryChange={setHeaderSearchQuery}
                  results={headerSearchResults}
                  onSelect={(r) => {
                    navigateTo(r.moduleKey, r.subTab);
                    setSearchPopupOpen(false);
                    setHeaderSearchQuery("");
                  }}
                />
              </div>
            )}
          </div>
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
        <div className="flex items-start gap-4 flex-row-reverse">
        <InsightsRail
          collapsed={railCollapsed}
          onToggle={() => setRailCollapsed((v) => !v)}
          data={insightRailData}
          activeCategory={activeInsightCategory}
          onCategoryChange={setActiveInsightCategory}
          onNavigate={navigateTo}
        />
        <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 bg-brand-bg">
        {/* Pill sub-navbar for the active module */}
        <div className="flex flex-wrap gap-1.5 pt-3 pb-3">
          {current.subTabs.map((subTab) => {
            const isActive = subTab === activeSubTab;
            return (
              <button
                key={subTab}
                type="button"
                onClick={() => setActiveSubTab(subTab)}
                className={cn(
                  "rounded-full border px-3 py-1 text-brand-caption font-semibold transition-colors whitespace-nowrap",
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
          <div className="pb-3">
            <FilterPillBar
              goldenActive={goldenActive}
              onGoldenToggle={() => setGoldenActive((v) => !v)}
              redFlagActive={redFlagActive}
              onRedFlagToggle={() => setRedFlagActive((v) => !v)}
            />
          </div>
        )}
        </div>
        {isTicketsView ? (
          <>
          <div className="relative w-full">
            {(sitesLoading || ticketsLoading || assetsLoading || auditLoading || amcLoading || checklistsLoading || inventoryLoading || wasteLoading || attendanceLoading || surveyLoading || vendorLoading) && (
              <div className="mb-3 flex items-center gap-2 rounded-md border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light">
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                {sitesLoading ? "Resolving your allowed sites…" : "Loading ticket, asset, audit, AMC, checklist, inventory, waste, attendance, survey and vendor analytics for the selected sites and date range…"}
              </div>
            )}
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
                  value={ticketKpis ? `${ticketKpis.response_sla.percent}%` : "—"}
                  accent="success"
                  subtitle={
                    ticketKpis
                      ? `${ticketKpis.response_sla.breached_percent}% breached · ${ticketKpis.response_sla.resolution_percent}% resol.`
                      : "Loading…"
                  }
                  progress={ticketKpis ? Number(ticketKpis.response_sla.percent) : 0}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="hero-customer" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Customer Tickets"
                  value={ticketKpis ? String(ticketKpis.customer_tickets) : "—"}
                  accent="info"
                  subtitle="Tenant / occupant complaints"
                  className="h-full overflow-auto"
                />
              </div>
              <div key="hero-internal" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="Internal Tickets"
                  value={ticketKpis ? String(ticketKpis.internal_tickets) : "—"}
                  accent="green"
                  subtitle="Operational / FM team raised"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="ticket-pool" className="h-full">
                <PieChartCard
                  title="Ticket pool composition"
                  subtitle={`${poolTotal} total · Pending / In Progress / On Hold / Closed`}
                  data={poolCompositionData}
                  centerLabel={String(poolTotal)}
                  legendPosition="right"
                  showInfoIcon
                  insightVariant="plain"
                  insight={
                    poolTotal > 0
                      ? "Shows how the current pool splits across Pending, In Progress, On Hold and Closed for the selected sites and date range."
                      : "No tickets found for the selected sites and date range."
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="category-bar" className="h-full">
                <BarChartCard
                  title="Category comparison"
                  subtitle="Status breakdown per category for the selected sites and date range"
                  data={categoryStackData}
                  categoryKey="category"
                  orientation="horizontal"
                  stacked
                  showInfoIcon
                  insightVariant="plain"
                  insight={
                    categoryStackData.length
                      ? "Categories stacked mostly with Pending + In Progress and little Closed haven't been picked up yet; categories that are mostly Closed are in healthier shape."
                      : "No category breakdown available for this period."
                  }
                  seriesColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#9EC8BA"]}
                  series={[
                    { dataKey: "pending", name: "Pending" },
                    { dataKey: "inProgress", name: "In Progress" },
                    { dataKey: "onHold", name: "On Hold" },
                    { dataKey: "closed", name: "Closed" },
                  ]}
                  height={260}
                  className="h-full overflow-auto"
                />
              </div>

              <div key="category-table" className="h-full">
                <DataTableCard
                  title="Category comparison — detail"
                  subtitle="Total, breach rate, trend and average ageing per category"
                  columns={CATEGORY_TABLE_COLUMNS}
                  data={categoryTableData}
                  getRowKey={(row) => row.category}
                  insight={
                    categoryTableData.length
                      ? "Categories with a red TAT-breach badge and a rising trend are the ones actively getting worse, not just historically bad."
                      : "No category data for this period."
                  }
                  className="h-full overflow-auto no-drag"
                />
              </div>

              <div key="reply-resolution" className="h-full">
                <ComboBarLineChartCard
                  title="First Reply vs Resolution Time"
                  subtitle="Monthly · bars = reply (hrs), line = resolution (days)"
                  data={replyResolutionData}
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
                  title="SLA breach analysis"
                  subtitle="Breaches per month for the selected date range"
                  data={slaBreachChartData}
                  categoryKey="month"
                  series={[{ dataKey: "breaches", name: "Breaches" }]}
                  showInfoIcon
                  height={140}
                  className="border-none shadow-none p-0"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-brand-bg border border-brand-border rounded-lg">
                    <div className="text-brand-caption text-brand-text-light uppercase">Total Breaches</div>
                    <div className="text-brand-body-3 font-bold text-brand">
                      {slaBreach ? slaBreach.total_breaches.toLocaleString() : "—"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-brand-bg border border-brand-border rounded-lg">
                    <div className="text-brand-caption text-brand-text-light uppercase">% of All Tickets</div>
                    <div className="text-brand-body-3 font-bold text-brand">
                      {slaBreach ? `${slaBreach.percent_of_all_tickets}%` : "—"}
                    </div>
                  </div>
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  {slaBreach
                    ? `${slaBreach.total_breaches} of ${slaBreach.total_tickets} tickets breached SLA in the selected period.`
                    : "Loading SLA breach history for the selected sites and date range…"}
                </p>
              </div>

              <div key="resolved-age" className="h-full">
                <BarChartCard
                  title="Resolved tickets by age tier"
                  subtitle="How fast are tickets actually getting closed?"
                  data={resolvedAgeTierData}
                  categoryKey="tier"
                  series={[{ dataKey: "count", name: "Resolved" }]}
                  categoryColors={AGE_TIER_COLORS}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Shows how long tickets sat open before they were resolved, bucketed by age tier."
                  className="h-full overflow-auto"
                />
              </div>
              <div key="unresolved-age" className="h-full">
                <BarChartCard
                  title="Unresolved tickets by age tier"
                  subtitle="How long has the still-open backlog been waiting?"
                  data={unresolvedAgeTierData}
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
                  days={heatmapDays}
                  hours={heatmapHours}
                  data={heatmapData}
                  insight="Shows whether certain shifts or days carry disproportionate load, for the currently selected date range."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="tech-workload" className="h-full">
                {techWorkloadData.length ? (
                  <BarChartCard
                    title="Technician workload"
                    subtitle={`Open tickets assigned · sorted highest to lowest · team avg ${techWorkload?.team_avg_open_tickets ?? 0}`}
                    data={techWorkloadData}
                    categoryKey="tech"
                    orientation="horizontal"
                    series={[{ dataKey: "count", name: "Open Tickets" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Shows who is carrying too much. A redistribution opportunity, not just a workload report."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Technician workload"
                    subtitle="Open tickets assigned per technician"
                    message="No open tickets assigned to any technician in this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="golden-open" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Golden Open"
                  value={ticketKpis ? String(ticketKpis.golden_open) : "—"}
                  accent="warning"
                  subtitle="VIP/senior-priority tickets"
                  className="h-full"
                />
              </div>
              <div key="redflag-open" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Red Flag Open"
                  value={ticketKpis ? String(ticketKpis.red_flag_open) : "—"}
                  accent="error"
                  subtitle="Separate manual flag"
                  className="h-full"
                />
              </div>
              <div key="golden-age" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="Golden Avg Age"
                  value={ticketKpis ? `${ticketKpis.golden_avg_age_days}d` : "—"}
                  accent="error"
                  subtitle={ticketKpis ? `vs ${ticketKpis.site_wide_avg_age_days}d site-wide` : "Loading…"}
                  className="h-full"
                />
              </div>
              <div key="sitewide-age" className="h-full">
                <StatHeroCard
                  tone="blue"
                  label="Site-wide Avg Age"
                  value={ticketKpis ? `${ticketKpis.site_wide_avg_age_days}d` : "—"}
                  accent="info"
                  subtitle="Benchmark used across the Golden/Red Flag charts below"
                  className="h-full"
                />
              </div>

              <div key="golden-redflag-chart" className="h-full">
                {goldenRedFlagData.length ? (
                  <BarChartCard
                    title="Golden & Red Flag analysis — by person, by age"
                    subtitle={`Merged view: who applies each flag, and whether it actually changes ticket age · site-wide avg ${siteWideAvgAgeDays}d`}
                    data={goldenRedFlagData}
                    categoryKey="person"
                    series={[
                      { dataKey: "golden", name: "Golden avg age" },
                      { dataKey: "redFlag", name: "Red Flag avg age" },
                    ]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="A Golden/VIP flag that ages worse than the site-wide average isn't speeding up response — it's decorative."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Golden & Red Flag analysis — by person, by age"
                    subtitle="Merged view: who applies each flag, and whether it actually changes ticket age"
                    message="No Golden/Red Flag ticket activity by person for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              {/* <div key="golden-aged-table" className="h-full">
                {goldenAgedRows.length ? (
                  <StatListCard
                    title="Golden tickets aged past average"
                    subtitle={`Sitting longer than the site-wide ${siteWideAvgAgeDays}d benchmark`}
                    rows={goldenAgedRows}
                    note="These should be the first tickets touched each morning, not buried in the general queue."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Golden tickets aged past average"
                    subtitle={`Sitting longer than the site-wide ${siteWideAvgAgeDays}d benchmark`}
                    message="No Golden tickets currently aged past the site-wide average."
                    className="h-full overflow-auto"
                  />
                )}
              </div> */}

              {/* <div key="godrej-distress" className="h-full">
                <EmptyStateCard
                  title="Tenant-level distress signals"
                  subtitle="Cross-system view (tickets + service requests) by tenant"
                  message="Not available from the ticket dashboard API — tenant/account grouping and Value Added Services data aren't part of these 5 endpoints."
                  className="h-full overflow-auto"
                />
              </div> */}

              <div key="by-user" className="h-full">
                {byUserRows.length ? (
                  <StatListCard
                    title="By User"
                    subtitle="Who's raising the most tickets"
                    rows={byUserRows}
                    note="Worth checking whether a single high-volume user is genuine reporting or logging on behalf of others."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="By User"
                    subtitle="Who's raising the most tickets"
                    message="No per-user breakdown for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>
              <div key="by-dept" className="h-full">
                {byDeptRows.length ? (
                  <StatListCard
                    title="By Department"
                    subtitle="Which team generates the most volume"
                    rows={byDeptRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="By Department"
                    subtitle="Which team generates the most volume"
                    message="No department-level breakdown returned for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>
              <div key="by-tenant" className="h-full">
                <EmptyStateCard
                  title="By Tenant"
                  subtitle="Which tenant raises the most"
                  message="Not available from the ticket dashboard API — tenant/account grouping isn't part of these 5 endpoints."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="location-volume" className="h-full">
                {locationVolumeData.length ? (
                  <BarChartCard
                    title="Location-wise Ticket Volume"
                    subtitle="Which floors/buildings generate the most tickets"
                    data={locationVolumeData}
                    categoryKey="location"
                    orientation="horizontal"
                    series={[{ dataKey: "tickets", name: "Tickets" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight={`${locationVolumeData[0]?.location} leads volume — worth checking whether that's density or an equipment/quality problem specific to that location.`}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Location-wise Ticket Volume"
                    subtitle="Which floors/buildings generate the most tickets"
                    message="No location breakdown for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="csat" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Customer Satisfaction Score"
                  value="0"
                  accent="warning"
                  subtitle="Not returned by the ticket dashboard API"
                  className="h-full"
                />
              </div>
              <div key="escalation" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Approaching Escalation"
                  value="0"
                  accent="error"
                  subtitle="Not returned by the ticket dashboard API"
                  className="h-full"
                />
              </div>

              <div key="source-origin" className="h-full">
                <BarChartCard
                  title="Source-wise ticket origin"
                  subtitle="Manual/Direct · Asset · Checklist · Survey · Patrolling — where tickets actually come from"
                  data={sourceOriginData}
                  categoryKey="source"
                  orientation="horizontal"
                  categoryColors={sourceOriginColors}
                  series={[{ dataKey: "tickets", name: "Tickets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight="Shows which channel tickets actually originate from — useful for spotting a channel that's under- or over-reporting issues."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="repeat-complaints" className="h-full">
                {repeatComplaintsData.length ? (
                  <BarChartCard
                    title="Repeat Complaints"
                    subtitle="Same tenant, same issue, raised more than once — a fix that isn't holding"
                    data={repeatComplaintsData}
                    categoryKey="issue"
                    categoryColors={repeatComplaintsData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "count", name: "Occurrences" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Repeat complaints on the same issue point to a fix that isn't holding, not a new problem each time."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Repeat Complaints"
                    subtitle="Same tenant, same issue, raised more than once"
                    message="No repeat complaints in this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-linked-tickets" className="h-full">
                {assetLinkedData.length ? (
                  <BarChartCard
                    title="Asset-Breakdown-Linked Tickets"
                    subtitle={
                      assetLinked
                        ? `${assetLinked.total_tickets} tickets total, traceable to ${assetLinked.repeat_offender_asset_count} repeat-offender assets`
                        : undefined
                    }
                    data={assetLinkedData}
                    categoryKey="asset"
                    categoryColors={assetLinkedData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "count", name: "Tickets" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Assets generating repeat tickets are a symptom, not the underlying decision that needs making (repair again vs. replace)."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Asset-Breakdown-Linked Tickets"
                    subtitle="Tickets traceable back to a specific asset"
                    message="No asset-linked tickets in this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              {/* <div key="smart-insights" className="h-full">
                <StatListCard
                  title="Smart Insights — Ticket Module"
                  subtitle="Computed live from the selected sites and date range"
                  borderTone="warning"
                  rows={smartInsightRows}
                  className="h-full overflow-auto"
                />
              </div> */}

              <div key="peak-hours" className="h-full">
                {peakHoursData.length ? (
                  <BarChartCard
                    title="Peak Complaint Hours"
                    subtitle="Hour-of-day ticket creation pattern"
                    data={peakHoursData}
                    categoryKey="hour"
                    series={[{ dataKey: "count", name: "Tickets" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Useful for scheduling technician shifts around actual complaint timing, not a flat roster."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Peak Complaint Hours"
                    subtitle="Hour-of-day ticket creation pattern"
                    message="No ticket volume data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="assets-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Assets")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Asset Management Dashboard
                </span>
              </div>

              <div key="asset-hero-total" className="h-full">
                <StatHeroCard tone="purple" label="Total Assets" value={assetsOverview ? String(assetsOverview.total_assets) : "—"} accent="neutral" subtitle="Full site inventory" className="h-full overflow-auto" />
              </div>
              <div key="asset-hero-good" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Good Condition"
                  value={assetsOverview ? String(assetsOverview.condition.good) : "—"}
                  accent="success"
                  subtitle={
                    assetsOverview
                      ? `${Math.round((assetsOverview.condition.good / Math.max(1, assetsOverview.total_assets)) * 100)}% · Operating normally`
                      : "Loading…"
                  }
                  className="h-full overflow-auto"
                />
              </div>
              <div key="asset-hero-fair" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="Fair Condition"
                  value={assetsOverview ? String(assetsOverview.condition.fair) : "—"}
                  accent="warning"
                  subtitle={
                    assetsOverview
                      ? `${Math.round((assetsOverview.condition.fair / Math.max(1, assetsOverview.total_assets)) * 100)}% · Requires monitoring`
                      : "Loading…"
                  }
                  className="h-full overflow-auto"
                />
              </div>
              <div key="asset-hero-bad" className="h-full">
                <StatHeroCard
                  tone="blue"
                  label="Bad Condition"
                  value={assetsOverview ? String(assetsOverview.condition.bad) : "—"}
                  accent="error"
                  subtitle={
                    assetsOverview
                      ? `${Math.round((assetsOverview.condition.bad / Math.max(1, assetsOverview.total_assets)) * 100)}% · Needs repair or replacement`
                      : "Loading…"
                  }
                  className="h-full overflow-auto"
                />
              </div>
              <div key="asset-hero-health" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Equipment Health Score"
                  value={assetsOverview ? `${assetsOverview.condition.equipment_health_score}/10` : "—"}
                  accent="warning"
                  subtitle="Condition-based monitoring"
                  progress={assetsOverview ? assetsOverview.condition.equipment_health_score * 10 : 0}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="asset-hero-replacement" className="h-full">
                <StatHeroCard tone="peach" label="Replacement Due" value={assetsOverview ? String(assetsOverview.replacement_due_count) : "—"} accent="error" subtitle="End-of-life · Procure now" className="h-full overflow-auto" />
              </div>

              <div key="asset-health-card" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-bold text-brand-text">Asset Health</h3>
                    <p className="text-brand-body-5 text-brand-text-light">
                      {assetHealth ? (
                        <>
                          {assetHealth.total} total ·{" "}
                          <span className="text-brand font-semibold">{assetHealth.breakdown_rate_percent}% breakdown rate</span>
                        </>
                      ) : (
                        "Loading…"
                      )}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {assetHealth && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <TableBadge tone="green">In Use · {assetHealth.in_use}</TableBadge>
                        <TableBadge tone="red">Breakdown · {assetHealth.breakdown}</TableBadge>
                        <TableBadge tone="blue">Allocated · {assetHealth.allocated}</TableBadge>
                        <TableBadge tone="grey">In Store · {assetHealth.in_store}</TableBadge>
                        {assetHealth.disposed > 0 && <TableBadge tone="grey">Disposed · {assetHealth.disposed}</TableBadge>}
                      </div>
                    )}
                    <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mb-2">
                      Top {topCurrentlyDown.length || 3} Currently Down
                    </div>
                    <div className="space-y-2">
                      {topCurrentlyDown.length ? (
                        topCurrentlyDown.map((a) => (
                          <div key={a.pms_asset_id} className="flex items-center justify-between text-brand-body-5">
                            <span className="text-brand-text">
                              {a.name} — {a.location}
                            </span>
                            <TableBadge tone="red">{a.hours_down != null ? `${a.hours_down}h down` : "Down"}</TableBadge>
                          </div>
                        ))
                      ) : (
                        <div className="text-brand-body-5 text-brand-text-light">No assets currently down.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="asset-breakdown-gauge" className="h-full">
                <GaugeChartCard
                  title="Breakdown rate vs acceptable range"
                  subtitle={assetHealth ? `${assetHealth.total} total assets · acceptable: 5–10%` : "acceptable: 5–10%"}
                  segments={[
                    { value: 70, color: "#E39090" },
                    { value: 15, color: "#CDCAF5" },
                    { value: 15, color: "#76CDC1" },
                  ]}
                  centerValue={assetHealth ? `${assetHealth.breakdown_rate_percent}%` : "—"}
                  centerLabel="Breakdown Rate"
                  showInfoIcon
                  insightVariant="plain"
                  insight={
                    assetHealth && assetHealth.breakdown_rate_percent > 10
                      ? "Breakdown rate sits above the acceptable band."
                      : "Breakdown rate for the selected sites and date range."
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-value-risk" className="h-full">
                <HighlightStatCard
                  title="Asset value at risk right now"
                  subtitle="Portion of total asset value sitting in currently-broken equipment"
                  value="N/A"
                  valueCaption="Not returned by the assets dashboard API"
                  tone="error"
                  description="These 4 endpoints return total portfolio value and cost-by-category, but not the value of specifically the currently-broken subset — that figure isn't computable from what's available here."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-critical-noncritical" className="h-full">
                <BarChartCard
                  title="Critical vs Non-Critical breakdown rate"
                  subtitle="Is the equipment that matters most failing hardest?"
                  data={criticalBreakdownData}
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
                {repeatOffendersRows.length ? (
                  <StatListCard
                    title="Repeat breakdowns"
                    subtitle="Same asset failing more than once — a replace-it signal, not a repair-it signal"
                    rows={repeatOffendersRows}
                    note="These assets have failed more than once in this period — repairing again is treating a symptom, not the equipment's actual condition."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Repeat breakdowns"
                    subtitle="Same asset failing more than once"
                    message="No repeat-breakdown assets in this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-breakdown-allocation" className="h-full">
                {breakdownByAllocationData.length ? (
                  <BarChartCard
                    title="Breakdowns by allocation"
                    subtitle="Which allocation type is holding the most broken equipment"
                    data={breakdownByAllocationData}
                    categoryKey="team"
                    orientation="horizontal"
                    series={[{ dataKey: "count", name: "Breakdowns" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="A named target for a conversation, not just an aggregate percentage — if breakdowns cluster under one allocation type, that's specific enough to act on today."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Breakdowns by allocation"
                    subtitle="Which allocation type is holding the most broken equipment"
                    message="No allocation-level breakdown data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-category-breakdown" className="h-full">
                <BarChartCard
                  title="Category-wise Asset Breakdown"
                  subtitle="Top 10 asset groups by count"
                  data={categoryAssetBreakdownData}
                  categoryKey="category"
                  orientation="horizontal"
                  series={[{ dataKey: "count", name: "Assets" }]}
                  showInfoIcon
                  insightVariant="plain"
                  insight={
                    categoryAssetBreakdownData[0]
                      ? `${categoryAssetBreakdownData[0].category} dominates the portfolio by count — worth checking whether smaller categories with higher unit value are getting proportionate maintenance attention.`
                      : "No category breakdown for this period."
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-lifecycle" className="h-full">
                <PieChartCard
                  title="Asset Lifecycle Status"
                  subtitle="In Use · Breakdown · Allocated · In Store · Disposed"
                  data={assetLifecycleData}
                  centerLabel={assetHealth ? String(assetHealth.total) : "—"}
                  showInfoIcon
                  insightVariant="plain"
                  insight="In Store (still on-site, unassigned) is tracked separately from Disposed (written off)."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="asset-amc-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="Assets Under AMC Coverage %"
                    value={assetsCondition ? `${assetsCondition.amc_coverage.covered_percent}%` : "—"}
                    accent="warning"
                    subtitle={
                      assetsCondition
                        ? `${assetsCondition.amc_coverage.covered_count} of ${
                            assetsCondition.amc_coverage.covered_count + assetsCondition.amc_coverage.uncovered_count
                          } assets have an active AMC contract`
                        : "Loading…"
                    }
                  />
                  <StatHeroCard
                    tone="teal"
                    label="Assets Without AMC Coverage"
                    value={assetsCondition ? String(assetsCondition.amc_coverage.uncovered_count) : "—"}
                    accent="error"
                    subtitle={
                      assetsCondition
                        ? `${(100 - assetsCondition.amc_coverage.covered_percent).toFixed(1)}% of portfolio, zero contract`
                        : "Loading…"
                    }
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  {assetsCondition
                    ? `${assetsCondition.amc_coverage.uncovered_count} assets running with no service contract at all — a real gap, not an estimate.`
                    : "Loading AMC coverage for the selected sites and date range…"}
                </p>
              </div>

              <div key="asset-mttr-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="MTTR — Mean Time To Repair"
                    value={assetsMaintenance ? `${Math.round(Number(assetsMaintenance.mttr.hours))}hrs` : "—"}
                    accent="warning"
                    subtitle="Across this period's repeat-breakdown history"
                  />
                  <StatHeroCard
                    tone="teal"
                    label="MTBF — Mean Time Between Failures"
                    value={assetsMaintenance ? `${assetsMaintenance.mtbf.days}d` : "—"}
                    accent="error"
                    subtitle="Average across assets with breakdown history"
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  Computed from this period's repair-timestamp history — assets with little or no breakdown history don't
                  contribute enough data points for this to be meaningful sitewide.
                </p>
              </div>

              <div key="asset-repair-cost-ratio" className="h-full">
                {repairCostRatioData.length ? (
                  <BarChartCard
                    title="Repair Cost vs Asset Value Ratio"
                    subtitle="Which assets are approaching a genuine repair-vs-replace decision"
                    data={repairCostRatioData}
                    categoryKey="asset"
                    orientation="horizontal"
                    unit="%"
                    series={[{ dataKey: "ratio", name: "Repair cost ratio" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Past 50% of replacement cost is the usual threshold where replacing outright becomes cheaper than continuing to repair."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Repair Cost vs Asset Value Ratio"
                    subtitle="Which assets are approaching a genuine repair-vs-replace decision"
                    message="No repair-cost-ratio data for this period — this needs both a recorded purchase cost and repair cost on the same asset."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-cost-by-category" className="h-full">
                {costByCategoryData.length ? (
                  <BarChartCard
                    title="Cost by Asset Category"
                    subtitle={assetsCategory ? `₹${(assetsCategory.total_portfolio_value / 100000).toFixed(2)}L total portfolio value, split by category` : undefined}
                    data={costByCategoryData}
                    categoryKey="category"
                    orientation="horizontal"
                    unit="L"
                    series={[{ dataKey: "value", name: "₹L" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight={`${costByCategoryData[0]?.category} carries the highest recorded cost — a handful of expensive assets can outweigh many cheaper items.`}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Cost by Asset Category"
                    subtitle="Portfolio value split by category"
                    message="No per-category cost data recorded for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-high-maintenance" className="h-full">
                {highMaintenanceCostRows.length ? (
                  <StatListCard
                    title="High Maintenance Cost Assets"
                    subtitle="Ranked by cumulative repair spend in this period"
                    borderTone="error"
                    rows={highMaintenanceCostRows}
                    note="Ranked by absolute ₹ spend — useful for prioritizing budget conversations by real cost, not just ratio."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="High Maintenance Cost Assets"
                    subtitle="Ranked by cumulative repair spend"
                    message="No repair-cost data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="asset-ownership-cost" className="h-full">
                <EmptyStateCard
                  title="Asset Ownership Cost Analysis"
                  subtitle="Repair spend + AMC contract cost, per asset"
                  message="Not available from the assets dashboard API — per-asset AMC contract cost isn't returned by these 4 endpoints, only aggregate AMC coverage counts."
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
                <StatHeroCard
                  tone="purple"
                  label="Open Observations"
                  value="0"
                  accent="error"
                  subtitle="Not returned by the audits dashboard API"
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-score" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Audit Score"
                  value={auditOverview ? `${auditOverview.audit_score_percent}%` : "—"}
                  accent="error"
                  subtitle={
                    auditOverview
                      ? `${auditOverview.status_breakdown.overdue} overdue of ${auditOverview.total_audits} total`
                      : "Loading…"
                  }
                  progress={auditOverview?.audit_score_percent ?? 0}
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-asset-completion-pct" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Asset Audit Completion %"
                  value={auditAssetType ? `${auditAssetType.completion_percent}%` : "0"}
                  accent="error"
                  subtitle={
                    auditAssetType
                      ? `${auditAssetType.completed} of ${auditAssetType.total} scheduled asset audits physically verified`
                      : "No 'Asset' type audits in this period"
                  }
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-missing-assets" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="Missing Assets Detected"
                  value={auditAssetCompliance ? String(auditAssetCompliance.missing_assets_detected) : "—"}
                  accent="error"
                  subtitle="In system, not found physically during completed audits"
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-missing-docs" className="h-full">
                <StatHeroCard
                  tone="purple"
                  label="Assets Missing Documentation"
                  value={auditAssetCompliance ? String(auditAssetCompliance.assets_missing_documentation) : "—"}
                  accent="warning"
                  subtitle="No invoice, warranty, AMC, or manual on file"
                  className="h-full overflow-auto"
                />
              </div>
              <div key="audit-qr-compliance" className="h-full">
                <StatHeroCard
                  tone="teal"
                  label="QR / Barcode Compliance %"
                  value={auditAssetCompliance ? `${auditAssetCompliance.qr_barcode_compliance.compliance_percent}%` : "—"}
                  accent="warning"
                  subtitle="Properly tagged for identification and tracking"
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-unauthorized-movement" className="h-full">
                <EmptyStateCard
                  title="Unauthorized Asset Movement Alerts"
                  subtitle="Assets shifted from designated location without approval"
                  message="Not available from the audits dashboard API — asset movement/location-change tracking isn't part of these 4 endpoints."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="audit-status-overview" className="h-full">
                {auditStatusOverviewData.length ? (
                  <PieChartCard
                    title="Audit Status Overview"
                    subtitle="Scheduled · In Progress · Paused · Completed · Overdue · Closed · Cancelled"
                    data={auditStatusOverviewData}
                    centerLabel={auditOverview ? String(auditOverview.total_audits) : undefined}
                    showInfoIcon
                    insightVariant="plain"
                    insight={
                      auditOverview
                        ? `${auditOverview.status_breakdown.overdue} of ${auditOverview.total_audits} audits are Overdue — the same figure behind the Audit Score above, shown here as a status breakdown.`
                        : undefined
                    }
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Audit Status Overview"
                    subtitle="Scheduled · In Progress · Paused · Completed · Overdue · Closed · Cancelled"
                    message="No audits found for the selected sites and date range."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="audit-kpi-table" className="h-full">
                <DataTableCard
                  title="Audit KPIs"
                  subtitle="Computed live from the selected sites and date range"
                  columns={AUDIT_KPI_COLUMNS}
                  data={auditKpiRows}
                  getRowKey={(row) => row.kpi}
                  insight="Vendor Pass Rate and CAPA Closure Rate aren't computable — the audits API tracks status (scheduled/completed/overdue/etc.), not pass/fail outcomes or CAPA tasks."
                  className="h-full overflow-auto"
                />
              </div>

              {/* <div key="audit-red-flags" className="h-full">
                {auditRedFlagRows.length ? (
                  <StatListCard
                    title="Red Flags"
                    subtitle="Compliance risks computed live from the audits API"
                    borderTone="error"
                    rows={auditRedFlagRows}
                    note="Critical-observation severity, CAPA tracking, vendor pass rates, and audit review scheduling aren't returned by these 4 audit endpoints, so they can't be shown here."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Red Flags"
                    subtitle="Compliance risks computed live from the audits API"
                    message="No overdue audits or site-level findings for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div> */}

              {/* <div key="audit-insights" className="h-full">
                {auditInsightRows.length ? (
                  <StatListCard
                    title="Audit Insights"
                    subtitle="Computed live from the selected sites and date range"
                    borderTone="warning"
                    rows={auditInsightRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Audit Insights"
                    subtitle="Computed live from the selected sites and date range"
                    message="Not enough audit activity in this period to generate insights."
                    className="h-full overflow-auto"
                  />
                )}
              </div> */}

              <div key="audit-status-repository" className="h-full">
                <Card className="border-brand-border h-full overflow-auto">
                  <CardHeader className="pb-2">
                    <h3 className="text-brand-body-3 font-bold text-brand-text">Audit Status by Type</h3>
                    <p className="text-brand-body-5 text-brand-text-light">Completed vs. total, per audit type</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Asset</div>
                        <div className="text-brand-body-3 font-bold text-brand">
                          {auditAssetType?.completed ?? 0}
                          <span className="text-brand-caption">/{auditAssetType?.total ?? 0}</span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Operational</div>
                        <div className="text-brand-body-3 font-bold text-[#8A5A00]">
                          {auditOperationalType?.completed ?? 0}
                          <span className="text-brand-caption">/{auditOperationalType?.total ?? 0}</span>
                        </div>
                      </div>
                      <div className="text-center p-2 bg-brand-bg rounded-lg">
                        <div className="text-brand-caption text-brand-text-light">Vendor</div>
                        <div className="text-brand-body-3 font-bold text-brand">
                          {auditVendorType?.completed ?? 0}
                          <span className="text-brand-caption">/{auditVendorType?.total ?? 0}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-brand-body-5 text-brand-text-light">
                      Document/certificate tracking (ISO certificates, uploaded audit reports, CAPA documents, compliance
                      certificates) isn't part of the audits dashboard API.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div key="audit-completion-bar" className="h-full">
                {auditCompletionBarData.length ? (
                  <BarChartCard
                    title="Audit completion by type"
                    subtitle="Sorted as returned by the API"
                    data={auditCompletionBarData}
                    categoryKey="type"
                    orientation="horizontal"
                    unit="%"
                    valueDomain={[0, 100]}
                    categoryColors={auditCompletionBarData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "pct", name: "Completion" }]}
                    labelFormatter={(_value, index) => auditCompletionBarData[index]?.fraction ?? ""}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Zero completion means never executed, not merely behind schedule."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Audit completion by type"
                    subtitle="Sorted as returned by the API"
                    message="No audits found for the selected sites and date range."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="audit-stalled" className="h-full">
                {auditStalledRows.length ? (
                  <StatListCard
                    title="Stalled audits"
                    subtitle="In Progress with no recent activity"
                    rows={auditStalledRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Stalled audits"
                    subtitle="In Progress with no recent activity"
                    message="No stalled audits in this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="audit-execution-concentration" className="h-full">
                {topAuditor ? (
                  <HighlightStatCard
                    title="Audit execution concentration"
                    subtitle="Share of all audits run through a single person"
                    value={`${topAuditor.share_percent}%`}
                    valueCaption={topAuditor.name}
                    tone="warning"
                    description="A named bus-factor risk, not a vague workload observation — if this person is unavailable, most audit execution stops with them."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Audit execution concentration"
                    subtitle="Share of all audits run through a single person"
                    message="No audit execution data for this period."
                    className="h-full overflow-auto"
                  />
                )}
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
                    <p className="text-brand-body-5 text-brand-text-light">
                      {amcOverview ? `${amcOverview.total_contracts.toLocaleString()} total · ${amcOverview.health.active.toLocaleString()} active` : "Loading…"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Upcoming Visits</div>
                        <div className="text-brand-h2 font-bold text-brand-info mt-1">{amcOverview?.health.upcoming_visits_30d ?? "—"}</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Due in 30 days</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Due / Missed</div>
                        <div className="text-brand-h2 font-bold text-brand mt-1">{amcOverview?.health.due_missed_visits ?? "—"}</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Vendor non-compliance</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Flagged AMCs</div>
                        <div className="text-brand-h2 font-bold text-[#8A5A00] mt-1">{amcOverview?.health.flagged ?? "—"}</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Under Observation</div>
                      </div>
                      <div className="text-center p-3 bg-brand-bg rounded-lg">
                        <div className="text-brand-body-5 font-semibold text-brand-text">Never Serviced</div>
                        <div className="text-brand-h2 font-bold text-brand mt-1">{amcOverview?.health.never_serviced ?? "—"}</div>
                        <div className="text-brand-caption text-brand-text-light mt-1">Active status, zero visits ever</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">AMC Expired</span>
                        <TableBadge tone="red">{amcOverview ? `${amcOverview.health.expired.toLocaleString()} of ${amcOverview.total_contracts.toLocaleString()}` : "—"}</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Total AMC Value</span>
                        <span className="font-semibold text-brand-text-light">
                          {amcOverview ? `₹${(amcOverview.cost.total_amc_value / 10000000).toFixed(2)} Cr` : "—"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div key="amc-discrepancy-banner" className="h-full overflow-auto bg-brand-warning-light border border-brand-warning rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 text-[#8A5A00] leading-relaxed">
                  {amcOverview
                    ? `₹${(amcOverview.cost.total_amc_value / 10000000).toFixed(2)} Cr total AMC value across ${amcOverview.total_contracts.toLocaleString()} contracts — ${amcOverview.cost.cost_at_risk_percent}% of it is sitting in expired or never-serviced contracts.`
                    : "Loading AMC value for the selected sites and date range…"}
                </p>
              </div>

              <div key="amc-expiry-timeline" className="h-full">
                {amcExpiryTimelineData.length ? (
                  <BarChartCard
                    title="AMC contract expiry timeline"
                    subtitle={amcOverview ? `${amcOverview.total_contracts.toLocaleString()} contracts, bucketed by expiry status` : undefined}
                    data={amcExpiryTimelineData}
                    categoryKey="bucket"
                    orientation="horizontal"
                    categoryColors={["#DA7756", "#EDC488", "#9EC8BA", "#108C72"]}
                    series={[{ dataKey: "count", name: "Contracts" }]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="AMC contract expiry timeline"
                    subtitle="Contracts bucketed by expiry status"
                    message="No AMC contracts for the selected sites and date range."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="amc-expiry-banner" className="h-full overflow-auto bg-brand-light border border-brand rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 text-brand font-semibold leading-relaxed">
                  {amcOverview
                    ? `${amcOverview.health.expired.toLocaleString()} of ${amcOverview.total_contracts.toLocaleString()} contracts are already expired, not approaching expiry.`
                    : "Loading expiry status for the selected sites and date range…"}
                </p>
              </div>

              <div key="amc-urgency-criticality" className="h-full">
                {amcUrgencyCriticalityData.length ? (
                  <BarChartCard
                    title="Expiry urgency vs asset criticality"
                    subtitle="A contract expiring on a Critical asset is a fire — on a Non-Critical asset it's routine admin"
                    data={amcUrgencyCriticalityData}
                    categoryKey="bucket"
                    orientation="horizontal"
                    seriesColors={["#DA7756", "#9EC8BA"]}
                    series={[
                      { dataKey: "critical", name: "Critical" },
                      { dataKey: "nonCritical", name: "Non-Critical" },
                    ]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Contracts on Critical assets sitting in the Expired bucket need same-week action. The same expiry status on Non-Critical assets can wait for the next renewal cycle."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Expiry urgency vs asset criticality"
                    subtitle="Critical vs Non-Critical, by expiry bucket"
                    message="No expiry/criticality data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="amc-vendor-concentration" className="h-full">
                {amcVendorConcentrationData.length ? (
                  <BarChartCard
                    title="Is this one vendor, or a systemic collapse?"
                    subtitle="Share of missed visits and expired contracts by vendor"
                    data={amcVendorConcentrationData}
                    categoryKey="vendor"
                    orientation="horizontal"
                    unit="%"
                    valueDomain={[0, 100]}
                    categoryColors={amcVendorConcentrationData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "pct", name: "Missed/expired" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="If concentrated in 2-3 vendors, the fix is replacing them. If spread evenly across all vendors, the fix is the renewal process itself — two different conversations, two different owners."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Is this one vendor, or a systemic collapse?"
                    subtitle="Share of missed visits and expired contracts by vendor"
                    message="No vendor concentration data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="amc-cost-at-risk" className="h-full">
                <HighlightStatCard
                  title="AMC cost at risk"
                  subtitle="Share of total AMC spend sitting in expired or never-serviced contracts"
                  value={amcOverview ? `${amcOverview.cost.cost_at_risk_percent}%` : "—"}
                  valueCaption={amcOverview ? `${amcOverview.health.expired.toLocaleString()} of ${amcOverview.total_contracts.toLocaleString()} contracts` : undefined}
                  tone="error"
                  description="This isn't a static total cost — it's an active financial leak. Money tied up in expired/never-serviced AMC contracts is paying for coverage that no longer exists."
                  className="h-full overflow-auto"
                />
              </div>

              <div key="amc-service-asset-split" className="h-full">
                {amcOverview ? (
                  <BarChartCard
                    title="Service vs Asset Contract Split"
                    subtitle={`${amcOverview.total_contracts.toLocaleString()} total contracts`}
                    data={[
                      { type: "Asset Contracts", total: amcOverview.contract_split.asset_contracts },
                      { type: "Service Contracts", total: amcOverview.contract_split.service_contracts },
                    ]}
                    categoryKey="type"
                    series={[{ dataKey: "total", name: "Total Contracts" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="Per-type missed-visit counts aren't returned by the AMC API — only the aggregate contract split."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Service vs Asset Contract Split"
                    subtitle="Total contracts by type"
                    message="Loading contract split…"
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="amc-critical-pending-pair" className="h-full overflow-auto bg-white border border-brand-border rounded-lg p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <StatHeroCard
                    tone="purple"
                    label="Critical Assets Without AMC"
                    value={amcCoverage ? String(amcCoverage.critical_assets_without_amc) : "—"}
                    accent="error"
                    subtitle="Marked Critical, zero contract coverage"
                  />
                  <StatHeroCard
                    tone="teal"
                    label="High Pending AMC Service Calls"
                    value={amcCoverage ? String(amcCoverage.high_pending_service_calls) : "—"}
                    accent="warning"
                    subtitle="Requested, not yet actioned by vendor"
                  />
                </div>
                <p className="text-brand-body-5 text-brand-green leading-relaxed">
                  {amcCoverage
                    ? `${amcCoverage.critical_assets_without_amc.toLocaleString()} Critical assets with zero AMC coverage — if any of these fail, there's no contracted vendor obligated to respond.`
                    : "Loading AMC coverage for the selected sites and date range…"}
                </p>
              </div>

              <div key="amc-coverage-by-category" className="h-full">
                {amcCoverageByCategoryData.length ? (
                  <BarChartCard
                    title="AMC Coverage by Asset Category"
                    subtitle="Lowest-coverage categories first — where coverage gaps concentrate"
                    data={amcCoverageByCategoryData}
                    categoryKey="category"
                    orientation="horizontal"
                    unit="%"
                    valueDomain={[0, 100]}
                    categoryColors={amcCoverageByCategoryData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "pct", name: "Coverage" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight={`${amcCoverageByCategoryData[0]?.category} carries the lowest coverage — worth checking if that's intentional (low-value, low-risk items) or an oversight.`}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="AMC Coverage by Asset Category"
                    subtitle="Where coverage gaps concentrate"
                    message="No category coverage data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="amc-cost-trend" className="h-full">
                {amcCostTrendData.length ? (
                  <AreaTrendChartCard
                    title="Monthly AMC Cost Trend"
                    subtitle="Month-over-month AMC spend"
                    data={amcCostTrendData}
                    categoryKey="month"
                    valueKey="cost"
                    unit="Cr"
                    showInfoIcon
                    insightVariant="plain"
                    insight="Shows whether AMC spend is trending up or down month over month for the selected sites."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Monthly AMC Cost Trend"
                    subtitle="Month-over-month AMC spend"
                    message="No monthly cost trend for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Checklists")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Digital Checklist Dashboard
                </span>
              </div>

              <div key="checklist-inhouse-card" className="h-full">
                {checklistInHouse ? (
                  <StatusSummaryCard
                    title="In-House"
                    metrics={[
                      { label: "Scheduled", value: checklistInHouse.status.scheduled.toLocaleString(), color: BRAND_HEX.dark },
                      { label: "Open", value: checklistInHouse.status.open.toLocaleString(), color: BRAND_HEX.warn },
                      { label: "Closed", value: checklistInHouse.status.closed.toLocaleString(), color: BRAND_HEX.ok },
                      { label: "Overdue", value: checklistInHouse.status.overdue.toLocaleString(), color: BRAND_HEX.err },
                    ]}
                    progress={checklistInHouse.closure_rate_percent}
                    progressColor={BRAND_HEX.ok}
                    caption={`${checklistInHouse.closure_rate_percent}% completion rate · ${checklistInHouse.status.overdue.toLocaleString()} overdue of ${checklistInHouse.total.toLocaleString()} total`}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="In-House" message="No in-house checklists for this period." className="h-full overflow-auto" />
                )}
              </div>

              <div key="checklist-oem-card" className="h-full">
                {checklistVendorExecution ? (
                  <StatusSummaryCard
                    title="Vendor"
                    metrics={[
                      { label: "Scheduled", value: checklistVendorExecution.status.scheduled.toLocaleString(), color: BRAND_HEX.dark },
                      { label: "Open", value: checklistVendorExecution.status.open.toLocaleString(), color: BRAND_HEX.warn },
                      { label: "Closed", value: checklistVendorExecution.status.closed.toLocaleString(), color: BRAND_HEX.ok },
                      { label: "Overdue", value: checklistVendorExecution.status.overdue.toLocaleString(), color: BRAND_HEX.err },
                    ]}
                    progress={checklistVendorExecution.closure_rate_percent}
                    progressColor={BRAND_HEX.ok}
                    caption={`${checklistVendorExecution.closure_rate_percent}% completion rate · ${checklistVendorExecution.status.overdue.toLocaleString()} overdue of ${checklistVendorExecution.total.toLocaleString()} total`}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Vendor" message="No vendor-executed checklists for this period." className="h-full overflow-auto" />
                )}
              </div>

              <div key="checklist-type-breakdown" className="h-full">
                {checklistTypeBreakdownData.length ? (
                  <BarChartCard
                    title="Checklist type breakdown"
                    subtitle="Completed / Open / Overdue per schedule type"
                    data={checklistTypeBreakdownData}
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
                    insight="Schedule types with near-zero Completed against a large Overdue bar need investigation before being reported as a real backlog — it may be a sync issue, not genuine zero completion."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Checklist type breakdown"
                    subtitle="Completed / Open / Overdue per schedule type"
                    message="No checklist schedule-type data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-skipped-items" className="h-full">
                {checklistSkippedRows.length ? (
                  <StatListCard
                    title="Perpetually skipped items"
                    subtitle="Highest skip-rate forms — the same specific tasks avoided every cycle"
                    rows={checklistSkippedRows}
                    note="The same tasks failing every cycle points to the task being unclear, unassigned, or physically difficult — not general overload."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Perpetually skipped items"
                    subtitle="Highest skip-rate forms"
                    message="No perpetually-skipped checklist items for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-kpi-pair" className="h-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatHeroCard
                  tone="purple"
                  label="Checklist Closure Rate"
                  value={checklistsOverview ? `${checklistsOverview.closure_rate_percent}%` : "—"}
                  accent="error"
                  subtitle="Completed ÷ Scheduled × 100, across all schedule types"
                />
                <StatHeroCard
                  tone="teal"
                  label="Weightage Scoring Adoption %"
                  value={checklistsCompliance ? `${checklistsCompliance.weightage_scoring.adoption_percent}%` : "—"}
                  accent="warning"
                  subtitle={
                    checklistsCompliance
                      ? `${checklistsCompliance.weightage_scoring.enabled_forms} of ${checklistsCompliance.weightage_scoring.total_forms} forms use weightage scoring`
                      : "Forms with weightage scoring enabled ÷ Total forms"
                  }
                />
              </div>

              <div key="checklist-top10-completed" className="h-full">
                {checklistTop10CompletedData.length ? (
                  <BarChartCard
                    title="Top Completed Checklists"
                    subtitle="Most frequently executed operational activities"
                    data={checklistTop10CompletedData}
                    categoryKey="checklist"
                    orientation="horizontal"
                    categoryColors={checklistTop10CompletedData.map(() => "#9EC8BA")}
                    series={[{ dataKey: "completions", name: "Completions" }]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Top Completed Checklists"
                    subtitle="Most frequently executed operational activities"
                    message="No completed checklists for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-sitewise-compliance" className="h-full">
                {checklistSitewiseComplianceData.length ? (
                  <BarChartCard
                    title="Site-wise Compliance"
                    subtitle="Compliance % by site"
                    data={checklistSitewiseComplianceData}
                    categoryKey="site"
                    orientation="horizontal"
                    unit="%"
                    valueDomain={[0, 100]}
                    categoryColors={checklistSitewiseComplianceData.map((_, i) => getPaletteColor(i))}
                    series={[{ dataKey: "compliance", name: "Compliance" }]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Site-wise Compliance"
                    subtitle="Compliance % by site"
                    message="No site-wise compliance data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-monthly-trend" className="h-full">
                {checklistMonthlyTrendData.length ? (
                  <MultiAreaTrendChartCard
                    title="Monthly Completion Trend"
                    subtitle="Completed vs Pending, month-wise"
                    data={checklistMonthlyTrendData}
                    categoryKey="month"
                    series={[
                      { dataKey: "completed", name: "Completed", color: BRAND_HEX.ok },
                      { dataKey: "pending", name: "Pending", color: BRAND_HEX.err },
                    ]}
                    showInfoIcon
                    insightVariant="plain"
                    insight={
                      checklistsOverview
                        ? `${checklistsOverview.closure_rate_percent}% overall closure rate — watch whether Pending keeps growing faster than Completed month over month.`
                        : undefined
                    }
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Monthly Completion Trend"
                    subtitle="Completed vs Pending, month-wise"
                    message="No monthly trend data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-red-flags" className="h-full">
                {checklistRedFlagRows.length ? (
                  <StatListCard
                    title="Checklist Red Flags"
                    subtitle="Computed live from the checklists API"
                    borderTone="error"
                    rows={checklistRedFlagRows}
                    note="Pass/fail outcome tracking isn't part of the checklists API (only scheduled/open/overdue/closed status), so a Checklist Failure Analysis row isn't shown here."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Checklist Red Flags"
                    subtitle="Computed live from the checklists API"
                    message="No red flags detected for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-smart-insights" className="h-full">
                {checklistInsightRows.length ? (
                  <StatListCard
                    title="🤖 Checklist Smart Insights"
                    subtitle="Computed live from the selected sites and date range"
                    borderTone="warning"
                    rows={checklistInsightRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="🤖 Checklist Smart Insights"
                    subtitle="Computed live from the selected sites and date range"
                    message="Not enough checklist activity in this period to generate insights."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="checklist-tenant-mismatch" className="h-full">
                <EmptyStateCard
                  title="Tenants asking for something that's officially off"
                  subtitle="Inactive services with matching ticket-category volume still coming in"
                  message="Not available from the checklists dashboard API — this needs a cross-reference against inactive service definitions and ticket categories, which isn't part of these 4 endpoints."
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
                <StatHeroCard tone="purple" label="Total Items" value={inventoryOverview ? String(inventoryOverview.total_items) : "—"} accent="neutral" subtitle="All types" />
                <StatHeroCard
                  tone="teal"
                  label="Active"
                  value={inventoryOverview ? String(inventoryOverview.active_count) : "—"}
                  accent="success"
                  subtitle={
                    inventoryOverview
                      ? `${Math.round((inventoryOverview.active_count / Math.max(1, inventoryOverview.total_items)) * 100)}% of total`
                      : "Loading…"
                  }
                />
                <StatHeroCard
                  tone="peach"
                  label="Inactive"
                  value={inventoryOverview ? String(inventoryOverview.inactive_count) : "—"}
                  accent="error"
                  subtitle={
                    inventoryOverview
                      ? `${Math.round((inventoryOverview.inactive_count / Math.max(1, inventoryOverview.total_items)) * 100)}% of total`
                      : "Loading…"
                  }
                />
                <StatHeroCard tone="blue" label="Ecofriendly" value={inventoryOverview ? String(inventoryOverview.eco_friendly_count) : "—"} accent="info" subtitle="Tagged sustainable" />
              </div>

              <div key="inventory-urgent-restock" className="h-full">
                {inventoryUrgentRestockRows.length ? (
                  <StatListCard
                    title="Urgent restock priority"
                    subtitle="Critical + low quantity + near expiry, all three conditions at once"
                    borderTone="error"
                    rows={inventoryUrgentRestockRows}
                    note="This is the actual list a Site Incharge needs today — not a low-stock list, a criticality list, and an expiry list he has to mentally combine himself."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Urgent restock priority"
                    subtitle="Critical + low quantity + near expiry, all three conditions at once"
                    message="No items currently need urgent restocking."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="inventory-type-breakdown" className="h-full">
                {inventoryTypeBreakdownData.length ? (
                  <BarChartCard
                    title="Inventory by type and criticality"
                    subtitle="Critical vs Non-Critical, per inventory type"
                    data={inventoryTypeBreakdownData}
                    categoryKey="type"
                    seriesColors={["#8E7BE0", "#DA7756"]}
                    series={[
                      { dataKey: "critical", name: "Critical" },
                      { dataKey: "nonCritical", name: "Non-Critical" },
                    ]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Inventory by type and criticality"
                    subtitle="Critical vs Non-Critical, per inventory type"
                    message="No type/criticality breakdown for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="inventory-health-score" className="h-full">
                <StatHeroCard
                  tone="peach"
                  label="⭐ Inventory Health Score"
                  value={inventoryOverview ? `${inventoryOverview.inventory_health_score}/100` : "—"}
                  accent="warning"
                  subtitle="Composite: availability, turnover, dead stock, cost trend"
                  progress={inventoryOverview?.inventory_health_score ?? 0}
                  className="h-full"
                />
              </div>

              <div key="inventory-consumption-trend" className="h-full">
                {inventoryConsumptionTrendData.length ? (
                  <AreaTrendChartCard
                    title="Consumption Cost & Trend"
                    subtitle="Monthly consumption value — is spend rising?"
                    data={inventoryConsumptionTrendData}
                    categoryKey="month"
                    valueKey="value"
                    color={BRAND_HEX.warn}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Consumption Cost & Trend"
                    subtitle="Monthly consumption value"
                    message="No monthly consumption trend for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="inventory-category-consumption" className="h-full">
                {inventoryCategoryConsumptionData.length ? (
                  <BarChartCard
                    title="Category-wise Consumption"
                    subtitle="Where inventory is actually being used"
                    data={inventoryCategoryConsumptionData}
                    categoryKey="category"
                    orientation="horizontal"
                    categoryColors={inventoryCategoryConsumptionData.map(() => BRAND_HEX.orange)}
                    series={[{ dataKey: "value", name: "Consumption" }]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Category-wise Consumption"
                    subtitle="Where inventory is actually being used"
                    message="No category-wise consumption data for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="inventory-deadstock-value" className="h-full">
                {inventoryDeadstockData.length ? (
                  <BarChartCard
                    title="Dead Stock & Overstock Value"
                    subtitle={
                      inventoryStockHealth
                        ? `${inventoryStockHealth.dead_stock.item_count} items with zero movement in 90+ days — value at risk, by category`
                        : undefined
                    }
                    data={inventoryDeadstockData}
                    categoryKey="category"
                    orientation="horizontal"
                    categoryColors={inventoryDeadstockData.map(() => "#9EC8BA")}
                    series={[{ dataKey: "value", name: "Value at risk" }]}
                    showInfoIcon
                    insightVariant="plain"
                    insight="This is blocked capital sitting on shelves — worth a write-off or liquidation review, not just a count of inactive line items."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Dead Stock & Overstock Value"
                    subtitle="Value at risk, by category"
                    message="No dead-stock items for this period."
                    className="h-full overflow-auto"
                  />
                )}
              </div>

              <div key="inventory-kpi-table" className="h-full">
                <DataTableCard
                  title="Inventory KPIs"
                  subtitle="Computed live from the selected sites and date range"
                  columns={INVENTORY_KPI_COLUMNS}
                  data={inventoryKpiRows}
                  getRowKey={(row) => row.kpi}
                  insight={
                    inventoryOverview
                      ? `Current Inventory Value is based on the ${inventoryOverview.current_inventory_value.costed_items_count} items with confirmed unit cost — the remaining items need cost data added before the true portfolio total is complete.`
                      : undefined
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="waste-section-label" className="h-full flex items-center gap-2">
                <div ref={registerMaintenanceSectionRef("Waste")} className="h-0" />
                <span className="text-sm">♻</span>
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Waste Operations
                </span>
                <span className="text-brand-caption text-brand-text-light">
                  {wasteOverview
                    ? `${wasteOverview.total_generated_kg.toLocaleString()} KG total · ${wasteOverview.record_count} records${
                        wasteOverview.last_activity_date ? ` · Last update ${wasteOverview.last_activity_date}` : ""
                      }`
                    : "Loading…"}
                </span>
              </div>

              <div key="waste-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatHeroCard
                  tone="purple"
                  label="Waste Generated"
                  value={wasteOverview ? `${wasteOverview.total_generated_kg.toLocaleString()} KG` : "…"}
                  accent="neutral"
                  subtitle={
                    wasteOverview
                      ? `${wasteOverview.record_count} records${wasteOverview.last_activity_date ? ` · Last: ${wasteOverview.last_activity_date}` : ""}`
                      : undefined
                  }
                />
                <StatHeroCard
                  tone="teal"
                  label="Total Recycled"
                  value={wasteOverview ? `${wasteOverview.total_recycled_kg.toLocaleString()} KG` : "…"}
                  accent="success"
                  subtitle={wasteOverview ? `${wasteOverview.recycling_rate_percent}% of total generated` : undefined}
                />
                <StatHeroCard
                  tone="peach"
                  label="Vendor Coverage"
                  value={wasteOverview ? `${wasteOverview.vendor_coverage_percent}%` : "…"}
                  accent={wasteOverview && wasteOverview.vendor_coverage_percent >= 80 ? "success" : "warning"}
                  subtitle="Records with a collection vendor tagged"
                />
                <StatHeroCard
                  tone="blue"
                  label="Days Since Last Activity"
                  value={
                    wasteOverview?.days_since_last_activity !== null && wasteOverview?.days_since_last_activity !== undefined
                      ? `${wasteOverview.days_since_last_activity}`
                      : "…"
                  }
                  accent={wasteFreshnessTone === "red" ? "error" : wasteFreshnessTone === "amber" ? "warning" : "success"}
                  subtitle={wasteOverview?.last_activity_date ? `Last: ${wasteOverview.last_activity_date}` : undefined}
                />
              </div>

              <div key="waste-workflow-bottlenecks" className="h-full">
                <EmptyStateCard
                  title="Workflow Bottlenecks"
                  subtitle="Where waste records are stuck in the cycle"
                  message="The waste API doesn't track a dispatch/verification workflow stage — only generated vs. recycled totals per record. Not available."
                  className="h-full"
                />
              </div>

              <div key="waste-breakdown" className="h-full">
                {wasteCategoryProgressRows.length || wasteCommodityProgressRows.length || wasteBuildingProgressRows.length ? (
                  <ProgressListCard
                    title="Waste Breakdown"
                    subtitle={
                      wasteOverview
                        ? `By category, commodity & building · ${wasteOverview.total_generated_kg.toLocaleString()} KG total`
                        : "By category, commodity & building"
                    }
                    sections={[
                      ...(wasteCategoryProgressRows.length ? [{ heading: "By Category", rows: wasteCategoryProgressRows }] : []),
                      ...(wasteCommodityProgressRows.length ? [{ heading: "By Commodity", rows: wasteCommodityProgressRows }] : []),
                      ...(wasteBuildingProgressRows.length ? [{ heading: "By Building", rows: wasteBuildingProgressRows }] : []),
                    ]}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Waste Breakdown" message="No waste breakdown records for the selected sites, date range and filters." className="h-full" />
                )}
              </div>

              <div key="waste-vendor-performance" className="h-full">
                {wasteVendorRows.length ? (
                  <StatListCard title="Vendor Performance" subtitle="Waste collection compliance" rows={wasteVendorRows} className="h-full overflow-auto" />
                ) : (
                  <EmptyStateCard
                    title="Vendor Performance"
                    subtitle="Waste collection compliance"
                    message="No waste vendor activity recorded for the selected sites and date range."
                    className="h-full"
                  />
                )}
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
                            <span
                              className="h-full rounded-full block"
                              style={{ width: `${Math.min(100, wasteOverview?.recycling_rate_percent ?? 0)}%`, backgroundColor: BRAND_HEX.warn }}
                            />
                          </span>
                          <span className="font-semibold" style={{ color: BRAND_HEX.warn }}>
                            {wasteOverview ? `${wasteOverview.recycling_rate_percent}%` : "–"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Recycled Weight</span>
                        <span className="font-semibold text-brand-success">
                          {wasteOverview ? `${wasteOverview.total_recycled_kg.toLocaleString()} KG` : "–"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Hazardous Waste</span>
                        {wasteHazardousRow ? (
                          <span className="flex flex-col items-end gap-1">
                            <span className="font-semibold" style={{ color: BRAND_HEX.warn }}>
                              {wasteHazardousRow.generated_kg.toLocaleString()} KG
                            </span>
                            <TableBadge tone={wasteHazardousRow.recycled_kg > 0 ? "green" : "amber"}>
                              {wasteHazardousRow.recycled_kg > 0 ? `${wasteHazardousRow.recycled_kg.toLocaleString()} KG recycled` : "Awaiting Verification"}
                            </TableBadge>
                          </span>
                        ) : (
                          <TableBadge tone="grey">No hazardous waste logged</TableBadge>
                        )}
                      </div>
                    </div>
                    {wasteOverview?.last_activity_date && (
                      <p className="text-brand-caption text-brand-text-light py-2">Last Activity: {wasteOverview.last_activity_date}</p>
                    )}
                    <div className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide mt-2 mb-2">
                      Pending Operational Data
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Segregation Compliance</span>
                        <TableBadge tone="grey">Not returned by API</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Carbon Offset (KG CO₂)</span>
                        <TableBadge tone="grey">Not returned by API</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Zero Waste Goal</span>
                        <TableBadge tone="grey">Not returned by API</TableBadge>
                      </div>
                      <div className="flex items-center justify-between text-brand-body-5">
                        <span className="text-brand-text">Revenue from Recyclables</span>
                        <TableBadge tone="grey">Not returned by API</TableBadge>
                      </div>
                    </div>
                    <p className="text-brand-body-5 text-brand-text-light leading-relaxed mt-3 pt-2 border-t border-brand-border">
                      4 sustainability metrics are not exposed by the waste dashboard API — shown as N/A rather than estimated.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div key="waste-weekly-trend-stale" className="h-full">
                {wasteWeeklyTrendData.length ? (
                  <BarChartCard
                    title="Waste Generation — Weekly Trend"
                    subtitle="Generated vs recycled, by week"
                    data={wasteWeeklyTrendData}
                    categoryKey="week"
                    series={[
                      { dataKey: "generated", name: "Generated (KG)" },
                      { dataKey: "recycled", name: "Recycled (KG)" },
                    ]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Waste Generation — Weekly Trend"
                    message={
                      wasteOverview?.days_since_last_activity
                        ? `No weekly trend data — last activity was ${wasteOverview.days_since_last_activity} day(s) ago.`
                        : "No weekly waste trend data for the selected sites and date range."
                    }
                    className="h-full"
                  />
                )}
              </div>

              <div key="waste-records-table" className="h-full">
                {wasteCategoryTableRows.length ? (
                  <DataTableCard
                    title="Waste Generation by Category"
                    subtitle={
                      wasteOverview ? `${wasteOverview.record_count} records aggregated · Category · KG · Recycled %` : "Category · KG · Recycled %"
                    }
                    columns={WASTE_CATEGORY_TABLE_COLUMNS}
                    data={wasteCategoryTableRows}
                    getRowKey={(row) => row.category}
                    insight="The waste API returns category/commodity/building aggregates, not a per-record log — this table shows the category-level rollup."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Waste Generation by Category" message="No waste category records for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div
                key="waste-handoff-banner"
                className={cn(
                  "h-full overflow-auto rounded-lg p-3 flex items-center border",
                  wasteFreshnessTone === "red" && "bg-brand-light border-brand",
                  wasteFreshnessTone === "amber" && "bg-brand-warning-light border-brand-warning",
                  wasteFreshnessTone === "green" && "bg-brand-success-bg border-brand-success"
                )}
              >
                <p
                  className={cn(
                    "text-brand-body-5 leading-relaxed",
                    wasteFreshnessTone === "red" && "text-brand",
                    wasteFreshnessTone === "amber" && "text-[#8A5A00]",
                    wasteFreshnessTone === "green" && "text-brand-success"
                  )}
                >
                  {wasteOverview
                    ? wasteFreshnessTone === "red"
                      ? `No waste activity logged in ${wasteOverview.days_since_last_activity} days (last: ${
                          wasteOverview.last_activity_date ?? "unknown"
                        }) — waste logging responsibility needs an explicit owner.`
                      : wasteFreshnessTone === "amber"
                      ? `Waste logging is slowing down — ${wasteOverview.days_since_last_activity} days since the last recorded activity (${
                          wasteOverview.last_activity_date ?? "unknown"
                        }).`
                      : `Waste logging is current — last activity ${wasteOverview.days_since_last_activity} day(s) ago (${
                          wasteOverview.last_activity_date ?? "unknown"
                        }).`
                    : "Loading waste activity freshness…"}
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
                      <p className="text-brand-body-5 text-brand-text-light">Staff on-site today (live snapshot)</p>
                    </div>
                    <TableBadge tone="green">Live</TableBadge>
                  </CardHeader>
                  <CardContent>
                    {attendanceOverview ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-brand-body-5">
                          <span className="text-brand-text">Present</span>
                          <span className="font-bold text-brand-success">
                            {attendanceOverview.present_count} / {attendanceOverview.roster_size}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-brand-body-5">
                          <span className="text-brand-text">Absent</span>
                          <TableBadge tone={attendanceOverview.absent_count > 0 ? "amber" : "green"}>{attendanceOverview.absent_count}</TableBadge>
                        </div>
                        <div className="flex items-center justify-between text-brand-body-5">
                          <span className="text-brand-text">Late Today</span>
                          <TableBadge tone={attendanceOverview.late_count > 0 ? "amber" : "grey"}>{attendanceOverview.late_count}</TableBadge>
                        </div>
                        <div className="flex items-center justify-between text-brand-body-5">
                          <span className="text-brand-text">On-Time Check-In %</span>
                          <TableBadge tone={attendanceOverview.on_time_percent >= 80 ? "green" : "amber"}>{attendanceOverview.on_time_percent}%</TableBadge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-24 items-center justify-center text-brand-body-5 text-brand-text-light">Loading…</div>
                    )}
                    {attendanceOverview?.roster_size === 0 && (
                      <p className="text-brand-caption text-brand-text-light mt-3 pt-2 border-t border-brand-border">
                        This is a live "today" snapshot, not scoped by the selected date range — an empty roster means no attendance was recorded for
                        today at these sites.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div key="attendance-trend" className="h-full">
                {attendanceTrendChartData.length ? (
                  <AreaTrendChartCard
                    title="Attendance trend"
                    subtitle="Monthly · is presence stable or slipping?"
                    data={attendanceTrendChartData}
                    categoryKey="month"
                    valueKey="presentPct"
                    unit="%"
                    color={BRAND_HEX.ok}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Attendance trend" message="No monthly attendance trend data for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div key="attendance-department-wise" className="h-full">
                {attendanceDepartmentRows.length ? (
                  <StatListCard
                    title="Department-wise Present/Absent"
                    subtitle="Where are the gaps concentrated?"
                    rows={attendanceDepartmentRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Department-wise Present/Absent"
                    message="No department-level attendance breakdown for the selected sites and date range."
                    className="h-full"
                  />
                )}
              </div>

              <div key="attendance-staffing-breach" className="h-full">
                <EmptyStateCard
                  title="Staffing gaps vs category breach rate"
                  subtitle="Same days plotted together — is an absence the reason a category spikes?"
                  message="None of the 4 attendance endpoints cross-reference staffing gaps against ticket breach rate — that correlation isn't available from this API."
                  className="h-full"
                />
              </div>

              <div key="attendance-repeat-lateness" className="h-full">
                {attendanceRepeatAbsenceRows.length || attendanceHabitualLatecomerRows.length ? (
                  <StatListCard
                    title="Repeat absence & habitual lateness"
                    subtitle="Same individuals repeatedly out or late vs spread evenly across the team"
                    rows={[...attendanceRepeatAbsenceRows, ...attendanceHabitualLatecomerRows]}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Repeat absence & habitual lateness"
                    message="No repeat-absence or habitual-latecomer patterns detected for the selected sites and date range."
                    className="h-full"
                  />
                )}
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
                  label="Avg CSAT"
                  value={surveyOverview ? `${surveyOverview.avg_csat}` : "…"}
                  accent={surveyOverview && surveyOverview.avg_csat >= 3 ? "success" : "error"}
                  subtitle={surveyOverview ? `${surveyOverview.total_surveys_in_scope} survey(s) in scope` : undefined}
                />
                <StatHeroCard
                  tone="teal"
                  label="Total Responses"
                  value={surveyOverview ? `${surveyOverview.total_responses}` : "…"}
                  accent="neutral"
                  subtitle={surveyOverview ? `${surveyOverview.total_rating_answers} rating answers` : undefined}
                />
                <StatHeroCard
                  tone="peach"
                  label="Positive Sentiment"
                  value={surveyOverview ? `${surveyOverview.sentiment.positive_count}` : "…"}
                  accent="success"
                  subtitle={surveyOverview ? `${surveyOverview.sentiment.positive_percent}% of responses` : undefined}
                />
                <StatHeroCard
                  tone="blue"
                  label="Negative Sentiment"
                  value={surveyOverview ? `${surveyOverview.sentiment.negative_count}` : "…"}
                  accent="error"
                  subtitle={surveyOverview ? `${surveyOverview.sentiment.negative_percent}% of responses` : undefined}
                />
              </div>

              <div key="survey-satisfaction-scale" className="h-full">
                <EmptyStateCard
                  title="Per-question response scale"
                  subtitle="5-point response scale, not just positive/negative"
                  message="The survey API returns an aggregate positive/negative sentiment split, not a per-question 5-point scale breakdown — not available."
                  className="h-full"
                />
              </div>

              <div key="survey-response-by-category" className="h-full">
                {surveyCategoryRows.length ? (
                  <ProgressListCard
                    title="Response by Category"
                    subtitle={surveyBreakdown ? `Total Selections: ${surveyBreakdown.total_selections} · what's actually driving the score` : undefined}
                    sections={[{ rows: surveyCategoryRows }]}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Response by Category" message="No categorized survey responses for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div key="survey-weekly-csat-trend" className="h-full">
                {surveyWeeklyTrendData.length ? (
                  <BarChartCard
                    title="Weekly CSAT trend"
                    subtitle="Average CSAT by week"
                    data={surveyWeeklyTrendData}
                    categoryKey="week"
                    series={[{ dataKey: "csat", name: "CSAT" }]}
                    showInfoIcon
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Weekly CSAT trend" message="No weekly CSAT trend data for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div key="survey-weekly-breakdown-table" className="h-full">
                {surveyWeeklyTableRows.length ? (
                  <DataTableCard
                    title="Weekly CSAT Breakdown"
                    columns={SURVEY_WEEKLY_TABLE_COLUMNS}
                    data={surveyWeeklyTableRows}
                    getRowKey={(row) => row.week}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Weekly CSAT Breakdown" message="No weekly CSAT breakdown for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div key="survey-hourly-response" className="h-full">
                {surveyTiming && surveyTiming.total_responses > 0 ? (
                  <HourlyPatternChartCard
                    title="Response timing — hour of day"
                    subtitle={`Total Response: ${surveyTiming.total_responses} · when do people actually respond`}
                    data={surveyHourlyData}
                    showInfoIcon
                    insightVariant="plain"
                    insight="If responses cluster at specific hours, that's when the underlying issue is most active — useful for scheduling around actual response timing, not a fixed roster."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Response timing — hour of day"
                    message="No survey responses recorded for the selected sites and date range — hourly timing has nothing to show yet."
                    className="h-full"
                  />
                )}
              </div>

              <div key="vendor-section-label" className="h-full flex items-center">
                <div ref={registerMaintenanceSectionRef("Vendor")} className="h-0" />
                <span className="text-brand-caption font-semibold text-brand-text-light uppercase tracking-wide">
                  Vendor Management
                </span>
              </div>

              <div key="vendor-kpi-row" className="h-full grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-auto">
                <StatHeroCard
                  tone="purple"
                  label="Active Vendors"
                  value={vendorOverview ? `${vendorOverview.active_count}` : "…"}
                  accent="neutral"
                  subtitle={vendorOverview ? `${vendorOverview.total_vendors} total · ${vendorOverview.inactive_count} inactive` : undefined}
                />
                <StatHeroCard
                  tone="teal"
                  label="Onboarding Pending"
                  value={vendorOverview ? `${vendorOverview.onboarding_pending_count}` : "…"}
                  accent={vendorOverview && vendorOverview.onboarding_pending_count > 0 ? "warning" : "success"}
                  subtitle="Vendors yet to complete onboarding"
                />
                <StatHeroCard
                  tone="peach"
                  label="Pending Vendor Tasks"
                  value={vendorOverview ? `${vendorOverview.pending_vendor_tasks}` : "…"}
                  accent={vendorOverview && vendorOverview.pending_vendor_tasks > 0 ? "warning" : "success"}
                  subtitle="GRN · PR · approvals awaiting action"
                />
                <StatHeroCard
                  tone="blue"
                  label="KYC Due ≤ 30 Days"
                  value={vendorOverview ? `${vendorOverview.kyc.due_within_30_days}` : "…"}
                  accent={vendorOverview && vendorOverview.kyc.due_within_30_days > 0 ? "error" : "success"}
                  subtitle={vendorOverview ? `${vendorOverview.kyc.tracked_count} vendors with KYC tracked` : undefined}
                />
                <StatHeroCard
                  tone="purple"
                  label="SLA Compliance"
                  value={vendorPerformance ? `${vendorPerformance.overall.sla_compliance_percent}%` : "…"}
                  accent={vendorPerformance && vendorPerformance.overall.sla_compliance_percent >= 80 ? "success" : "warning"}
                  subtitle={
                    vendorPerformance
                      ? `${vendorPerformance.overall.total_requests} requests · ${vendorPerformance.overall.breached} breached`
                      : undefined
                  }
                />
                <StatHeroCard
                  tone="teal"
                  label="Vendors At KYC Risk"
                  value={vendorKycRisk ? `${vendorKycRisk.total_at_risk_count}` : "…"}
                  accent={vendorKycRisk && vendorKycRisk.total_at_risk_count > 0 ? "error" : "success"}
                  subtitle={vendorKycRisk ? `of ${vendorKycRisk.total_active_count} active vendors` : undefined}
                />
              </div>

              <div key="vendor-repeat-requests" className="h-full">
                {vendorRepeatIssueRows.length ? (
                  <StatListCard
                    title="Repeat service requests — same vendor, same issue"
                    subtitle='Not "is this vendor slow" — "does their fix actually hold?"'
                    borderTone="error"
                    rows={vendorRepeatIssueRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Repeat service requests"
                    subtitle='Not "is this vendor slow" — "does their fix actually hold?"'
                    message="No repeat-issue vendor requests for the selected sites and date range."
                    className="h-full"
                  />
                )}
              </div>

              <div key="vendor-response-time" className="h-full">
                {vendorPerformanceRows.length ? (
                  <ProgressListCard
                    title="Vendor Response / SLA Performance"
                    subtitle="SLA compliance % by vendor"
                    sections={[{ rows: vendorPerformanceRows }]}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard title="Vendor Response / SLA Performance" message="No per-vendor SLA performance data for the selected sites and date range." className="h-full" />
                )}
              </div>

              <div key="vendor-amc-status-table" className="h-full">
                {vendorPerformanceTableRows.length ? (
                  <DataTableCard
                    title="Vendor Performance"
                    subtitle={
                      vendorPerformance
                        ? `${vendorPerformance.overall.total_requests} requests · ${vendorPerformance.overall.breached} breached · ${vendorPerformance.overall.sla_compliance_percent}% SLA compliance`
                        : undefined
                    }
                    columns={VENDOR_PERFORMANCE_TABLE_COLUMNS}
                    data={vendorPerformanceTableRows}
                    getRowKey={(row) => row.vendorName}
                    insight="AMC contract-level spend and missed-visit detail lives in Maintenance → AMC — not duplicated here."
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Vendor Performance"
                    message="No per-vendor request/SLA data for the selected sites and date range. AMC contract-level detail lives in Maintenance → AMC."
                    className="h-full"
                  />
                )}
              </div>

              <div key="vendor-health" className="h-full">
                <StatListCard
                  title="Vendor Health"
                  subtitle="Compliance — drill any item"
                  rows={
                    vendorOverview
                      ? [
                          {
                            label: "KYC Due ≤ 30 days",
                            badge: { tone: (vendorOverview.kyc.due_within_30_days > 0 ? "red" : "green") as TableBadgeTone, label: `${vendorOverview.kyc.due_within_30_days}` },
                          },
                          {
                            label: "Onboarding Pending",
                            badge: { tone: (vendorOverview.onboarding_pending_count > 0 ? "amber" : "green") as TableBadgeTone, label: `${vendorOverview.onboarding_pending_count}` },
                          },
                          { label: "Inactive Vendors", badge: { tone: "grey" as TableBadgeTone, label: `${vendorOverview.inactive_count}` } },
                          { label: "Expiring Documents", badge: { tone: "grey" as TableBadgeTone, label: "Not returned by API" } },
                          { label: "Performance Flags", badge: { tone: "grey" as TableBadgeTone, label: "Not returned by API" } },
                        ]
                      : []
                  }
                  className="h-full overflow-auto"
                />
              </div>

              <div key="vendor-response-trend" className="h-full">
                <EmptyStateCard
                  title="Vendor response time trend"
                  subtitle="Monthly · per-vendor SLA trend"
                  message="None of the 4 vendor endpoints return a per-vendor monthly response-time trend — only a point-in-time overall/by-vendor snapshot is available."
                  className="h-full"
                />
              </div>

              <div key="vendor-expired-kyc" className="h-full">
                {vendorExpiredKycRows.length ? (
                  <StatListCard
                    title="Active vendors with expired or missing KYC"
                    subtitle="A paperwork gap becomes a legal/payment risk when the vendor holds a live contract"
                    borderTone="error"
                    rows={vendorExpiredKycRows}
                    className="h-full overflow-auto"
                  />
                ) : (
                  <EmptyStateCard
                    title="Active vendors with expired or missing KYC"
                    subtitle="A paperwork gap becomes a legal/payment risk when the vendor holds a live contract"
                    message={
                      vendorKycRisk && vendorKycRisk.total_at_risk_count > 0
                        ? `${vendorKycRisk.total_at_risk_count} vendor(s) are flagged at KYC risk, but the API didn't return the detailed list for this filter.`
                        : "No vendors currently flagged with expired KYC on a live contract."
                    }
                    className="h-full"
                  />
                )}
              </div>

              <div key="vendor-data-hygiene-banner" className="h-full overflow-auto bg-brand-warning-light border border-brand-warning rounded-lg p-3 flex items-center">
                <p className="text-brand-body-5 leading-relaxed" style={{ color: "#B8860B" }}>
                  {vendorOverview
                    ? `⚠ Only ${vendorOverview.kyc.tracked_count} of ${vendorOverview.total_vendors} vendors have KYC tracking data at all — the "at-risk" and "expiring" figures above only reflect vendors with tracked KYC, so the true risk may be larger than shown.`
                    : "Loading vendor data quality signal…"}
                </p>
              </div>
            </ResponsiveGridLayout>
          </div>
          </>
        ) : isSafetyView ? (
          <SafetyPanel
            activeSection={activeSubTab}
            permits={permitsApiData}
            permitsLoading={permitsLoading || sitesLoading}
            incidents={incidentsApiData}
            incidentsLoading={incidentsLoading || sitesLoading}
          />
        ) : isFinanceView ? (
          <FinancePanel activeSection={activeSubTab} />
        ) : isCrmView ? (
          <CrmPanel activeSection={activeSubTab} />
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
