import { useRef, useState } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChartCard, BarChartCard } from "@/components/charts";

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

// Example wiring for PieChartCard / BarChartCard — sourced from the "Ticket pool
// composition" and "Category comparison" panels in fm_matrix_phase10 (29).html.
const MAINTENANCE_TICKET_POOL_DATA = [
  { name: "Pending", value: 412 },
  { name: "In Progress", value: 284 },
  { name: "On Hold", value: 156 },
  { name: "Closed", value: 117 },
];

const MAINTENANCE_CATEGORY_DATA = [
  { category: "Repair & Maintenance", tickets: 298 },
  { category: "General Tickets", tickets: 198 },
  { category: "Plumbing", tickets: 162 },
  { category: "Housekeeping", tickets: 88 },
  { category: "Air Conditioner", tickets: 57 },
  { category: "FSC", tickets: 40 },
];

export default function RevampDashboardPage() {
  const [activeModule, setActiveModule] = useState<string>(MODULES[0].key);
  const current = MODULES.find((m) => m.key === activeModule) ?? MODULES[0];
  const [activeSubTab, setActiveSubTab] = useState<string>(current.subTabs[0]);
  const tabsRef = useRef<HTMLDivElement>(null);

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

        {activeModule === "maintenance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <PieChartCard
              title="Ticket pool composition"
              subtitle="969 total · Pending / In Progress / On Hold / Closed"
              data={MAINTENANCE_TICKET_POOL_DATA}
              centerLabel="969"
              insight="Pending + In Progress together are over 70% of the whole pool — most of the backlog hasn't reached a resolution attempt yet."
              insightTone="warning"
            />
            <BarChartCard
              title="Category comparison"
              subtitle="Open ticket volume by category"
              data={MAINTENANCE_CATEGORY_DATA}
              categoryKey="category"
              series={[{ dataKey: "tickets", name: "Tickets" }]}
              insight="Repair & Maintenance and General Tickets carry the largest, slowest-moving backlog."
              insightTone="error"
            />
          </div>
        )}
      </div>
    </div>
  );
}
