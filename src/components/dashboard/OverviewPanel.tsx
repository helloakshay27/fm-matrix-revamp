import { useState } from "react";
import {
  Wrench,
  HardHat,
  RefreshCw,
  Wallet,
  Zap,
  Lock,
  Users,
  Star,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { AreaTrendChartCard } from "@/components/charts";
import { cn } from "@/lib/utils";
import { VEDA_PALETTE } from "@/styles/vedaTheme";
import { gridItem, ModuleSection, useSectionScroll } from "@/components/dashboard/moduleGrid";

/** Status colour lives only inside pills, matching veda-gardens-vertical-bars. */
type ChipTone = "high" | "mid" | "ok" | "grey";
type DeltaTone = "good" | "bad" | "neutral";

interface ModuleChip {
  label: string;
  tone: ChipTone;
  emphasize?: boolean;
  targetModule: string;
  targetSubTab?: string;
}

interface ModuleSnapshot {
  key: string;
  label: string;
  icon: LucideIcon;
  value: string;
  delta?: string;
  deltaTone?: DeltaTone;
  subtitle: string;
  chips: ModuleChip[];
}

interface AttentionItem {
  rank: number;
  title: string;
  subtitle: string;
  trend: string;
  trendTone: "critical" | "warn" | "muted";
  targetModule: string;
  targetSubTab: string;
}

const CHIP_CLASS: Record<ChipTone, string> = {
  high: "bg-[#FDEDED] text-[#A32126]",
  mid: "bg-[#FFF2D6] text-[#8A5B00]",
  ok: "bg-[#E0F7EA] text-[#0B7A3B]",
  grey: "bg-[rgba(26,26,24,0.06)] text-[rgba(26,26,24,0.68)]",
};

const TREND_PILL: Record<AttentionItem["trendTone"], string> = {
  critical: CHIP_CLASS.high,
  warn: CHIP_CLASS.mid,
  muted: CHIP_CLASS.grey,
};

const DELTA_PILL: Record<DeltaTone, string> = {
  good: CHIP_CLASS.ok,
  bad: CHIP_CLASS.high,
  neutral: CHIP_CLASS.grey,
};

const MODULE_SNAPSHOTS: ModuleSnapshot[] = [
  {
    key: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    value: "679",
    delta: "↑12",
    deltaTone: "bad",
    subtitle: "open tickets · this week",
    chips: [
      { label: "AMC Miss 128", tone: "mid", targetModule: "maintenance", targetSubTab: "AMC" },
      { label: "Assets Down 63", tone: "high", targetModule: "maintenance", targetSubTab: "Assets" },
      { label: "676 PPM Overdue", tone: "high", targetModule: "maintenance", targetSubTab: "Checklists" },
      { label: "Vendor Risk Flagged", tone: "high", emphasize: true, targetModule: "maintenance", targetSubTab: "Vendor" },
    ],
  },
  {
    key: "safety",
    label: "Safety",
    icon: HardHat,
    value: "83",
    delta: "↓5",
    deltaTone: "good",
    subtitle: "open incidents · this week",
    chips: [
      { label: "71% No RCA", tone: "high", targetModule: "safety", targetSubTab: "Incidents" },
      { label: "52 Draft Stuck", tone: "high", targetModule: "safety", targetSubTab: "Permits" },
      { label: "Emergency Prep Gap", tone: "high", emphasize: true, targetModule: "safety", targetSubTab: "Emergency" },
    ],
  },
  {
    key: "transitioning",
    label: "Transitioning",
    icon: RefreshCw,
    value: "3",
    delta: "↓2",
    deltaTone: "good",
    subtitle: "HOTO pending · this week",
    chips: [
      { label: "38 Open Snags", tone: "mid", targetModule: "transitioning", targetSubTab: "Snagging" },
      { label: "5 Violations", tone: "high", targetModule: "transitioning", targetSubTab: "Fitout" },
      { label: "3 HOTO Pending", tone: "mid", targetModule: "transitioning", targetSubTab: "HOTO" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: Wallet,
    value: "15+",
    delta: "↑3",
    deltaTone: "bad",
    subtitle: "pending approvals · today",
    chips: [
      { label: "2 Overdue Invoices", tone: "high", targetModule: "finance", targetSubTab: "Invoices" },
      { label: "130 Draft PRs", tone: "mid", targetModule: "finance", targetSubTab: "Procurement" },
      { label: "Wallet: 21 Users Active", tone: "ok", emphasize: true, targetModule: "finance", targetSubTab: "Wallet" },
    ],
  },
  {
    key: "utility",
    label: "Utility",
    icon: Zap,
    value: "~950",
    delta: "↑40",
    deltaTone: "bad",
    subtitle: "billing records pending · this month",
    chips: [
      { label: "Billing May Be Inflated", tone: "high", targetModule: "utility", targetSubTab: "Utility Consumption" },
      { label: "Meter Logged Out-of-Order", tone: "high", targetModule: "utility", targetSubTab: "Daily Readings" },
      { label: "Solar Data 16mo Stale", tone: "high", emphasize: true, targetModule: "utility", targetSubTab: "Solar Generator" },
    ],
  },
  {
    key: "security",
    label: "Security",
    icon: Lock,
    value: "15%",
    delta: "↓4%",
    deltaTone: "bad",
    subtitle: "patrol compliance · this week",
    chips: [
      { label: "Vehicle Ins. 6yr Expired", tone: "high", targetModule: "security", targetSubTab: "Vehicles" },
      { label: "Patrol System Error", tone: "high", targetModule: "security", targetSubTab: "Patrol" },
      { label: "Expired Creds", tone: "mid", targetModule: "security", targetSubTab: "Staff" },
      { label: "Gate Pass 18 Unmatched", tone: "mid", emphasize: true, targetModule: "security", targetSubTab: "Gate Passes" },
    ],
  },
  {
    key: "crm",
    label: "CRM",
    icon: Users,
    value: "2/10",
    subtitle: "usage score",
    chips: [
      { label: "73% Neg Feedback", tone: "high", targetModule: "crm", targetSubTab: "Overview" },
      { label: "99.5K pts Unredeemed", tone: "mid", targetModule: "crm", targetSubTab: "Overview" },
      { label: "Low Adoption", tone: "grey", targetModule: "crm", targetSubTab: "Campaigns" },
    ],
  },
  {
    key: "vas",
    label: "VAS",
    icon: Star,
    value: "15mo",
    delta: "↑1mo",
    deltaTone: "bad",
    subtitle: "oldest OSR payment pending",
    chips: [
      { label: "Parking 6% + 0 Bookings", tone: "mid", targetModule: "vas", targetSubTab: "Parking" },
      { label: "F&B Order Status", tone: "mid", emphasize: true, targetModule: "vas", targetSubTab: "F&B" },
      { label: "Booking: 56pg Real Usage", tone: "ok", emphasize: true, targetModule: "vas", targetSubTab: "Booking" },
    ],
  },
];

const ATTENTION_ITEMS: AttentionItem[] = [
  {
    rank: 1,
    title: "Closure Integrity — 71% of closed Safety incidents have zero RCA",
    subtitle: 'Undermines trust in every "Closed" number, not just Safety\'s',
    trend: "NEW ⚠",
    trendTone: "critical",
    targetModule: "safety",
    targetSubTab: "Incidents",
  },
  {
    rank: 2,
    title: "Billing Crisis — ~950 utility bills pending, 13+ months",
    subtitle: "Possibly inflated by duplicates (Vohra Enterprises 6× identical)",
    trend: "↔ under review",
    trendTone: "muted",
    targetModule: "utility",
    targetSubTab: "Utility Consumption",
  },
  {
    rank: 3,
    title: 'Expired but marked "Active" — 16 permits + vehicle insurance up to 6yr',
    subtitle: "Status field checks the record, not the actual expiry date",
    trend: "NEW ⚠",
    trendTone: "critical",
    targetModule: "safety",
    targetSubTab: "Permits",
  },
  {
    rank: 4,
    title: "Asset & AMC Crisis — 63 broken (₹6.1L at risk), 41 AMC never serviced",
    subtitle: "128 AMC visits missed · breakdown rate 16.7%",
    trend: "↑ worsening",
    trendTone: "warn",
    targetModule: "maintenance",
    targetSubTab: "Assets",
  },
  {
    rank: 5,
    title: "Audit Programme Stalled — 0 of 27 asset audits complete",
    subtitle: "68% of execution runs through a single person — bus-factor risk",
    trend: "↔ unchanged",
    trendTone: "muted",
    targetModule: "maintenance",
    targetSubTab: "Audit",
  },
  {
    rank: 6,
    title: "Patrol Gap — no night-shift log since Jan 2026, plus system error",
    subtitle: "Patrolling List currently returns HTTP 500",
    trend: "NEW ⚠",
    trendTone: "critical",
    targetModule: "security",
    targetSubTab: "Patrol",
  },
];

const HEALTH_TREND = [
  { month: "Jan", score: 7.1 },
  { month: "Feb", score: 6.4 },
  { month: "Mar", score: 6.0 },
  { month: "Apr", score: 5.6 },
  { month: "May", score: 5.4 },
  { month: "Jun", score: 5.2 },
];

interface OverviewPanelProps {
  activeSection: string;
  visibleKeys?: Set<string>;
  onNavigate?: (moduleKey: string, subTab?: string) => void;
}

function ModuleSnapshotCard({
  module,
  onNavigate,
}: {
  module: ModuleSnapshot;
  onNavigate?: (moduleKey: string, subTab?: string) => void;
}) {
  const Icon = module.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNavigate?.(module.key)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate?.(module.key);
        }
      }}
      className="group relative flex h-full w-full cursor-pointer flex-col gap-1 rounded-2xl bg-[#F5F4F0] px-[18px] pb-4 pt-[18px] text-left transition-colors hover:bg-[#EFEDE6]"
    >
      <span className="absolute right-12 top-3.5 grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-white text-[#1A1A18]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="pr-16 text-[12px] text-[rgba(26,26,24,0.68)]">{module.label}</div>
      <div className="flex items-center gap-2">
        <span className="text-[24px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#1A1A18]">
          {module.value}
        </span>
        {module.delta && module.deltaTone && (
          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", DELTA_PILL[module.deltaTone])}>
            {module.delta}
          </span>
        )}
      </div>
      <div className="text-[11.5px] text-[rgba(26,26,24,0.48)]">{module.subtitle}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {module.chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.(chip.targetModule, chip.targetSubTab);
            }}
            className={cn(
              "no-drag rounded-full px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap transition-opacity hover:opacity-80",
              CHIP_CLASS[chip.tone],
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AttentionRow({
  item,
  onNavigate,
}: {
  item: AttentionItem;
  onNavigate?: (moduleKey: string, subTab?: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate?.(item.targetModule, item.targetSubTab)}
      className="flex w-full items-center gap-3 rounded-2xl bg-[#F5F4F0] px-4 py-3 text-left transition-colors hover:bg-[#EFEDE6]"
    >
      <span className="w-4 shrink-0 text-center text-sm font-semibold text-[rgba(26,26,24,0.48)]">{item.rank}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-snug text-[#1A1A18]">{item.title}</span>
        <span className="mt-0.5 block text-[12px] leading-snug text-[rgba(26,26,24,0.48)]">{item.subtitle}</span>
      </span>
      <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", TREND_PILL[item.trendTone])}>
        {item.trend}
      </span>
    </button>
  );
}

export function OverviewPanel({ activeSection, visibleKeys, onNavigate }: OverviewPanelProps) {
  const registerRef = useSectionScroll(activeSection);
  const [showMoreAttention, setShowMoreAttention] = useState(false);
  const [topItem, ...moreItems] = ATTENTION_ITEMS;

  const overviewItems = [
    gridItem(
      "ov-brief",
      0,
      0,
      12,
      3,
      <div className="flex h-full gap-3.5">
        <div className="flex min-w-0 flex-1 flex-col justify-center rounded-2xl bg-[#F5F4F0] px-6 py-4">
          <div className="text-[11.5px] text-[rgba(26,26,24,0.48)]">Portfolio command center</div>
          <div className="mt-1 text-[20px] font-semibold tracking-[-0.015em] text-[#1A1A18]">
            Site health sits at 5.2/10
          </div>
          <p className="mt-1.5 max-w-[860px] text-[13px] leading-relaxed text-[rgba(26,26,24,0.68)]">
            Compliance and finance are the main drag. Utility billing (~950 pending) remains the largest
            unresolved financial exposure; 128 AMC misses and 63 asset breakdowns need parallel watch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.("overview", "Health")}
          className="flex w-[168px] shrink-0 flex-col items-start justify-center gap-1 rounded-2xl bg-[#F5F4F0] px-4 text-left transition-colors hover:bg-[#EFEDE6]"
        >
          <span className="text-[12px] text-[rgba(26,26,24,0.68)]">Health</span>
          <span className="text-[24px] font-semibold leading-none tracking-[-0.015em] text-[#1A1A18]">
            5.2<span className="text-[12px] font-medium text-[rgba(26,26,24,0.48)]"> /10</span>
          </span>
          <span className="mt-1 rounded-full bg-[#FFF2D6] px-2.5 py-0.5 text-[11px] font-semibold text-[#8A5B00]">
            Watch
          </span>
        </button>
      </div>
    ),
  ];

  const attentionItems = [
    gridItem(
      "ov-attention",
      0,
      0,
      12,
      showMoreAttention ? 10 : 5,
      <div className="flex h-full flex-col overflow-auto rounded-2xl bg-[#F5F4F0] px-6 py-[22px]">
        <div className="mb-3">
          <div className="text-[14px] font-semibold text-[#1A1A18]">What needs attention</div>
          <div className="mt-0.5 text-[12px] text-[rgba(26,26,24,0.48)]">Click a row to open the module</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <AttentionRow item={topItem} onNavigate={onNavigate} />
          <button
            type="button"
            onClick={() => setShowMoreAttention((v) => !v)}
            className="flex items-center gap-1.5 px-1 py-0.5 text-[10px] font-semibold text-[#888780]"
          >
            <span>{showMoreAttention ? "Show less" : `+${moreItems.length} more`}</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", showMoreAttention && "rotate-180")} />
          </button>
          {showMoreAttention &&
            moreItems.map((item) => <AttentionRow key={item.rank} item={item} onNavigate={onNavigate} />)}
        </div>
      </div>
    ),
  ];

  const healthItems = [
    gridItem(
      "ov-health-trend",
      0,
      0,
      12,
      8,
      <AreaTrendChartCard
        title="Site Health Score trend"
        subtitle="Is 5.2/10 improving or declining? Not just what it is today · dimension weights pending final sign-off"
        data={HEALTH_TREND}
        categoryKey="month"
        valueKey="score"
        color={VEDA_PALETTE[0]}
        height={160}
        insight="Score has fallen from 7.1 to 5.2 over 6 months — a steady decline, not a one-off dip. Compliance and Finance are the two components dragging it down."
        insightTone="info"
        insightVariant="plain"
        showInfoIcon
        className="h-full overflow-auto"
      />
    ),
  ];

  const moduleCardItems = MODULE_SNAPSHOTS.map((mod, idx) =>
    gridItem(
      `ov-mod-${mod.key}`,
      (idx % 4) * 3,
      Math.floor(idx / 4) * 5,
      3,
      5,
      <ModuleSnapshotCard module={mod} onNavigate={onNavigate} />,
    ),
  );

  return (
    <div className="space-y-6">
      <ModuleSection
        id="Overview"
        storageKey="overviewHeroGrid"
        moduleKey="overview"
        subTab="Overview"
        items={overviewItems}
        visibleKeys={visibleKeys}
        registerRef={registerRef}
      />
      <div ref={registerRef("Modules")} className="scroll-mt-24">
        <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.09em] text-[rgba(26,26,24,0.48)]">
          Module snapshot — click a pill to deep-link · click a card to open the tab
        </div>
        <ModuleSection
          id="Modules-cards"
          storageKey="overviewModulesGridV2"
          moduleKey="overview"
          subTab="Modules"
          items={moduleCardItems}
          visibleKeys={visibleKeys}
          registerRef={() => () => undefined}
        />
        <ModuleSection
          id="Modules-attention"
          storageKey="overviewAttentionGrid"
          moduleKey="overview"
          subTab="Modules"
          items={attentionItems}
          visibleKeys={visibleKeys}
          registerRef={() => () => undefined}
        />
      </div>
      <div>
        <div className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.09em] text-[rgba(26,26,24,0.48)]">
          Site health breakdown
        </div>
        <ModuleSection
          id="Health"
          storageKey="overviewHealthGrid"
          moduleKey="overview"
          subTab="Health"
          items={healthItems}
          visibleKeys={visibleKeys}
          registerRef={registerRef}
        />
      </div>
    </div>
  );
}
