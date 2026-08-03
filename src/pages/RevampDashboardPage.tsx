import { useEffect, useRef, useState } from "react";
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
  type DataTableColumn,
  type TableBadgeTone,
} from "@/components/charts";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
import { SafetyPanel } from "@/components/dashboard/SafetyPanel";

const ResponsiveGridLayout = WidthProvider(Responsive);
const TICKETS_GRID_STORAGE_KEY = "revampTicketsGridLayout";

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
      "Ticket",
      "Task",
      "Schedule",
      "Soft Service",
      "Assets",
      "Inventory",
      "AMC",
      "Attendance",
      "Audit",
      "Waste",
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
  ANALYTICS_PALETTE[1],
  ANALYTICS_PALETTE[2],
  ANALYTICS_PALETTE[4],
  ANALYTICS_PALETTE[0],
  ANALYTICS_PALETTE[6],
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
  "#E7848E",
  "#E7848E",
  "#108C72",
  "#108C72",
  "#108C72",
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

const SOURCE_ORIGIN_COLORS = ["#798C5E", "#EDC488", "#6B9BCC", "#9EC8BA", "#E7848E"];

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

const PEAK_HOURS_COLORS = ["#108C72", "#EDC488", "#E7848E", "#E7848E", "#EDC488", "#108C72", "#108C72"];

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

export default function RevampDashboardPage() {
  const [activeModule, setActiveModule] = useState<string>(MODULES[0].key);
  const current = MODULES.find((m) => m.key === activeModule) ?? MODULES[0];
  const [activeSubTab, setActiveSubTab] = useState<string>(current.subTabs[0]);
  const [timeSegment, setTimeSegment] = useState("Today");
  const [goldenActive, setGoldenActive] = useState(false);
  const [redFlagActive, setRedFlagActive] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const isTicketsView = activeModule === "maintenance" && activeSubTab === "Ticket";
  const isSafetyView = activeModule === "safety";

  const [ticketsLayout, setTicketsLayout] = useState<GridLayout.Layout[]>(DEFAULT_TICKETS_LAYOUT);

  useEffect(() => {
    const stored = loadStoredLayout();
    if (stored) setTicketsLayout(stored);
  }, []);

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

  return (
    <div className="bg-brand-bg min-h-screen">
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

      {/* Pill sub-navbar for the active module */}
      <div className="flex flex-wrap gap-3 px-6 py-4">
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

      <div className="px-6 pb-6">
        {isTicketsView && (
          <FilterPillBar
            segments={["Today", "This Week", "This Month"]}
            activeSegment={timeSegment}
            onSegmentChange={setTimeSegment}
            goldenActive={goldenActive}
            onGoldenToggle={() => setGoldenActive((v) => !v)}
            redFlagActive={redFlagActive}
            onRedFlagToggle={() => setRedFlagActive((v) => !v)}
            className="mb-4"
          />
        )}

        {isTicketsView ? (
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
              layouts={{ lg: ticketsLayout }}
              onDragStop={(layout) => persistTicketsLayout(layout)}
              onResizeStop={(layout) => persistTicketsLayout(layout)}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
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
                  categoryColors={["#E7848E", "#EDC488"]}
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
                  categoryColors={["#E7848E", "#EDC488"]}
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
            </ResponsiveGridLayout>
          </div>
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
  );
}
