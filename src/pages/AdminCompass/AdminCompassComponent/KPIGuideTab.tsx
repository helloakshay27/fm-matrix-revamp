// ─────────────────────────────────────────────
// KPIGuideTab.tsx  —  KPI Creation Guide
// ─────────────────────────────────────────────
import React, { useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Factory,
  Lightbulb,
  ShoppingBag,
  Target,
  TrendingUp,
  Truck,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { kpiClass } from "./Shared";

const CHECKLIST_PILLS = [
  "Specific & Clear",
  "Measurable (has a number)",
  "Achievable",
  "Relevant to goals",
  "Time-bound (has a frequency)",
  "Assigned to one owner",
];

const STEPS = [
  {
    n: 1,
    title: "Define What You Want to Measure",
    description:
      "Start by identifying what outcomes matter most to your team or department.",
    detail:
      "Name the outcome in plain language (e.g. “new qualified leads” or “invoice accuracy”). Avoid vague goals—one KPI should track one clear thing.",
    icon: Target,
    rowBg: "bg-sky-50/80",
    iconBg: "bg-sky-500 text-white",
  },
  {
    n: 2,
    title: "Make It Measurable with a Unit",
    description:
      "Every KPI needs a clear unit so progress can be tracked objectively.",
    detail:
      "Pick a unit from your organization’s list (₹, %, #, Hours, etc.) so everyone reports the same way and dashboards stay comparable.",
    icon: BarChart3,
    rowBg: "bg-violet-50/80",
    iconBg: "bg-violet-500 text-white",
  },
  {
    n: 3,
    title: "Set a Realistic Target Value",
    description:
      "Set a target that is ambitious but achievable based on past performance.",
    detail:
      "Use history, seasonality, and capacity when you set the number. You can adjust targets later as the business changes.",
    icon: TrendingUp,
    rowBg: "bg-emerald-50/80",
    iconBg: "bg-emerald-500 text-white",
  },
  {
    n: 4,
    title: "Set Traffic Light Thresholds",
    description:
      "Define when a KPI is Green (on track), Yellow (at risk), or Red (off track).",
    detail:
      "Thresholds turn raw numbers into decisions. Agree on green/yellow/red bands with the owner so alerts feel fair and actionable.",
    icon: AlertCircle,
    rowBg: "bg-orange-50/80",
    iconBg: "bg-orange-500 text-white",
  },
  {
    n: 5,
    title: "Assign to the Right Person",
    description:
      "Every KPI should have a clear owner who is responsible for tracking and improving it.",
    detail:
      "The owner updates actuals, explains variances, and drives follow-up. One primary owner keeps accountability simple.",
    icon: UserRound,
    rowBg: "bg-indigo-50/80",
    iconBg: "bg-indigo-500 text-white",
  },
  {
    n: 6,
    title: "Choose the Right Frequency",
    description:
      "How often you track a KPI should match how often it changes meaningfully.",
    detail:
      "Use weekly for fast-moving metrics (pipeline, tickets) and monthly or quarterly for slower ones (revenue, churn).",
    icon: CheckCircle2,
    rowBg: "bg-teal-50/80",
    iconBg: "bg-teal-500 text-white",
  },
] as const;

type SampleFrequency = "daily" | "weekly" | "monthly" | "quarterly";

const FREQUENCY_BADGE: Record<
  SampleFrequency,
  { label: string; className: string }
> = {
  daily: {
    label: "Daily",
    className: "border-rose-200 bg-rose-100 text-rose-900",
  },
  weekly: {
    label: "Weekly",
    className: "border-sky-200 bg-sky-100 text-sky-900",
  },
  monthly: {
    label: "Monthly",
    className: "border-emerald-200 bg-emerald-100 text-emerald-900",
  },
  quarterly: {
    label: "Quarterly",
    className: "border-violet-200 bg-violet-100 text-violet-900",
  },
};

interface SampleKpi {
  name: string;
  frequency: SampleFrequency;
}

interface SampleDepartment {
  name: string;
  kpis: SampleKpi[];
}

interface SampleIndustry {
  id: string;
  name: string;
  deptCount: number;
  kpiCount: number;
  cardBg: string;
  cardBorder: string;
  iconWrap: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: string | number }>;
  departments: SampleDepartment[];
}

const INDIAN_SAMPLE_INDUSTRIES: SampleIndustry[] = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    deptCount: 5,
    kpiCount: 21,
    cardBg: "bg-sky-50/90",
    cardBorder: "border-sky-200",
    iconWrap: "bg-sky-500 text-white",
    Icon: Factory,
    departments: [
      {
        name: "Production",
        kpis: [
          {
            name: "Overall equipment effectiveness (OEE) %",
            frequency: "daily",
          },
          { name: "Production volume vs plan", frequency: "daily" },
          { name: "Machine downtime hours", frequency: "weekly" },
          { name: "First-pass yield %", frequency: "weekly" },
          { name: "Scrap / rework as % of output", frequency: "monthly" },
        ],
      },
      {
        name: "Quality",
        kpis: [
          {
            name: "Defects per million opportunities (DPMO)",
            frequency: "weekly",
          },
          {
            name: "Customer complaints — manufacturing linked",
            frequency: "weekly",
          },
          { name: "Inspection pass rate %", frequency: "daily" },
          { name: "Cost of poor quality (COPQ)", frequency: "monthly" },
        ],
      },
      {
        name: "Maintenance",
        kpis: [
          { name: "Mean time to repair (MTTR)", frequency: "weekly" },
          { name: "Preventive maintenance compliance %", frequency: "monthly" },
          { name: "Unplanned maintenance % of total", frequency: "weekly" },
          { name: "Spare parts stock-out incidents", frequency: "monthly" },
        ],
      },
      {
        name: "Supply chain & stores",
        kpis: [
          { name: "Raw material stock coverage days", frequency: "weekly" },
          { name: "Supplier on-time delivery %", frequency: "monthly" },
          { name: "Inventory turnover ratio", frequency: "quarterly" },
          { name: "Purchase price variance", frequency: "monthly" },
        ],
      },
      {
        name: "Safety & compliance",
        kpis: [
          { name: "Lost-time injury frequency", frequency: "monthly" },
          { name: "Near-miss reports logged", frequency: "weekly" },
          { name: "Safety audit closure rate", frequency: "quarterly" },
          {
            name: "Statutory compliance checklist completion %",
            frequency: "monthly",
          },
        ],
      },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    deptCount: 4,
    kpiCount: 17,
    cardBg: "bg-emerald-50/90",
    cardBorder: "border-emerald-200",
    iconWrap: "bg-emerald-500 text-white",
    Icon: ShoppingBag,
    departments: [
      {
        name: "Store operations",
        kpis: [
          { name: "Sales per sq. ft.", frequency: "monthly" },
          { name: "Footfall to conversion %", frequency: "weekly" },
          { name: "Average transaction value (ATV)", frequency: "daily" },
          { name: "Shrinkage / pilferage % of sales", frequency: "monthly" },
          { name: "Store opening compliance %", frequency: "daily" },
        ],
      },
      {
        name: "Merchandising",
        kpis: [
          { name: "Out-of-stock (OOS) rate on top SKUs", frequency: "weekly" },
          { name: "Planogram compliance %", frequency: "weekly" },
          { name: "Markdown % of gross sales", frequency: "monthly" },
          { name: "Sell-through rate by category", frequency: "monthly" },
        ],
      },
      {
        name: "Sales & billing",
        kpis: [
          { name: "Gross margin % by category", frequency: "weekly" },
          { name: "Bills per cashier hour", frequency: "daily" },
          { name: "UPI / digital payment share %", frequency: "weekly" },
          { name: "Loyalty program participation rate", frequency: "monthly" },
        ],
      },
      {
        name: "Back office",
        kpis: [
          { name: "GST filing timeliness", frequency: "monthly" },
          {
            name: "Cash deposit vs POS reconciliation variance",
            frequency: "daily",
          },
          { name: "Vendor payment within terms %", frequency: "monthly" },
          { name: "Inventory audit accuracy %", frequency: "quarterly" },
        ],
      },
    ],
  },
  {
    id: "trading",
    name: "Trading",
    deptCount: 4,
    kpiCount: 18,
    cardBg: "bg-orange-50/90",
    cardBorder: "border-orange-200",
    iconWrap: "bg-orange-500 text-white",
    Icon: Truck,
    departments: [
      {
        name: "Procurement",
        kpis: [
          { name: "Purchase order cycle time", frequency: "weekly" },
          { name: "Cost savings vs last quarter", frequency: "quarterly" },
          { name: "Supplier quality rejection rate", frequency: "weekly" },
          {
            name: "Import / customs clearance lead time",
            frequency: "monthly",
          },
          { name: "Purchase price vs benchmark index", frequency: "monthly" },
        ],
      },
      {
        name: "Logistics & warehousing",
        kpis: [
          { name: "On-time in-full (OTIF) delivery %", frequency: "weekly" },
          { name: "Freight cost per tonne / km", frequency: "monthly" },
          { name: "Warehouse capacity utilization %", frequency: "weekly" },
          { name: "Damage in transit %", frequency: "monthly" },
        ],
      },
      {
        name: "Sales (B2B)",
        kpis: [
          { name: "Revenue vs target", frequency: "monthly" },
          {
            name: "Active customer accounts (repeat orders)",
            frequency: "weekly",
          },
          { name: "Average collection period (days)", frequency: "monthly" },
          { name: "Gross margin by product line", frequency: "monthly" },
          { name: "Order win rate from quotations", frequency: "quarterly" },
        ],
      },
      {
        name: "Finance & credit",
        kpis: [
          { name: "DSO — days sales outstanding", frequency: "monthly" },
          { name: "Bad debt write-off % of revenue", frequency: "quarterly" },
          { name: "Credit limit utilization vs policy", frequency: "weekly" },
          { name: "Working capital cycle (days)", frequency: "monthly" },
        ],
      },
    ],
  },
  {
    id: "services",
    name: "Services",
    deptCount: 5,
    kpiCount: 22,
    cardBg: "bg-violet-50/90",
    cardBorder: "border-violet-200",
    iconWrap: "bg-violet-500 text-white",
    Icon: Briefcase,
    departments: [
      {
        name: "Delivery & projects",
        kpis: [
          { name: "Projects delivered on time %", frequency: "monthly" },
          { name: "Billable utilization %", frequency: "weekly" },
          { name: "Schedule variance (days)", frequency: "weekly" },
          { name: "Change requests logged vs closed", frequency: "monthly" },
        ],
      },
      {
        name: "Client success",
        kpis: [
          { name: "Net Promoter Score (NPS)", frequency: "quarterly" },
          { name: "Customer satisfaction (CSAT) score", frequency: "monthly" },
          { name: "Renewal / expansion revenue %", frequency: "quarterly" },
          { name: "Support tickets per active account", frequency: "weekly" },
        ],
      },
      {
        name: "Sales & presales",
        kpis: [
          { name: "Pipeline value vs target", frequency: "weekly" },
          { name: "Proposal-to-win conversion %", frequency: "monthly" },
          { name: "Average deal size", frequency: "quarterly" },
          { name: "Sales cycle length (days)", frequency: "monthly" },
          { name: "New logos acquired", frequency: "monthly" },
        ],
      },
      {
        name: "Operations & admin",
        kpis: [
          { name: "Invoice accuracy first-time %", frequency: "weekly" },
          { name: "Contract compliance audit score", frequency: "quarterly" },
          { name: "Employee attrition % (rolling)", frequency: "monthly" },
          { name: "Training hours per employee", frequency: "quarterly" },
        ],
      },
      {
        name: "Finance",
        kpis: [
          { name: "Revenue recognition timeliness", frequency: "monthly" },
          { name: "EBITDA margin %", frequency: "monthly" },
          { name: "Cash runway (months)", frequency: "monthly" },
          { name: "Budget variance by cost centre", frequency: "monthly" },
          { name: "Outstanding receivables > 90 days", frequency: "weekly" },
        ],
      },
    ],
  },
];

export interface KPIGuideTabProps {
  onGoToManagement: () => void;
}

const KPIGuideTab: React.FC<KPIGuideTabProps> = ({ onGoToManagement }) => {
  const [panel, setPanel] = useState<"how-to" | "samples">("how-to");
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [openIndustryId, setOpenIndustryId] = useState<string | null>(null);
  const [openDeptKey, setOpenDeptKey] = useState<string | null>(null);

  const toggleStep = (n: number) => {
    setOpenStep((prev) => (prev === n ? null : n));
  };

  const toggleIndustry = (id: string) => {
    setOpenIndustryId((prev) => (prev === id ? null : id));
    setOpenDeptKey(null);
  };

  const toggleDept = (key: string) => {
    setOpenDeptKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="w-full space-y-5">
      <div className="overflow-hidden rounded-xl shadow-md">
        <div className="flex flex-col gap-4 bg-gradient-to-r from-[#DA7756] via-[#c9674a] to-[#a85d42] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <BookOpen className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                KPI Creation Guide
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/90">
                Learn how to create KPIs and browse sample KPIs for your
                industry.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoToManagement}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#DA7756] shadow-sm transition-colors hover:bg-white/95 sm:self-center"
          >
            <BarChart3 className="h-4 w-4" />
            Go to KPI Management
          </button>
        </div>

        <div className="flex gap-2 border-x border-b border-[rgba(218,119,86,0.15)] bg-[#f6f4ee] p-2 sm:gap-3 sm:p-3">
          <button
            type="button"
            onClick={() => setPanel("how-to")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-5",
              panel === "how-to"
                ? cn(
                    "border border-[#DA7756] text-[#DA7756] shadow-sm",
                    kpiClass.surfacePanel
                  )
                : "border-transparent bg-transparent text-neutral-600 hover:bg-[#fef6f4]/70 hover:text-[#1a1a1a]"
            )}
          >
            <BookOpen className="h-4 w-4" />
            How to Create KPIs
          </button>
          <button
            type="button"
            onClick={() => setPanel("samples")}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all sm:flex-none sm:px-5",
              panel === "samples"
                ? cn(
                    "border border-[#DA7756] text-[#DA7756] shadow-sm",
                    kpiClass.surfacePanel
                  )
                : "border-transparent bg-transparent text-neutral-600 hover:bg-[#fef6f4]/70 hover:text-[#1a1a1a]"
            )}
          >
            <Target className="h-4 w-4" />
            Sample KPIs by Industry
          </button>
        </div>
      </div>

      {panel === "how-to" ? (
        <>
          <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" strokeWidth={2} />
              <h2 className="text-sm font-bold text-[#1a1a1a] sm:text-base">
                Quick Checklist: A good KPI should be…
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CHECKLIST_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1.5 text-xs font-semibold text-amber-900 sm:text-sm"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isOpen = openStep === step.n;
              return (
                <div
                  key={step.n}
                  className={cn(
                    "overflow-hidden rounded-xl border border-[rgba(218,119,86,0.12)] shadow-sm",
                    step.rowBg
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleStep(step.n)}
                    className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-white/40 sm:gap-4 sm:p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11">
                      <span
                        className={cn(
                          "flex h-full w-full items-center justify-center rounded-lg",
                          step.iconBg
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-semibold text-neutral-500">
                        Step {step.n}
                      </p>
                      <h3 className="mt-0.5 text-sm font-bold text-[#1a1a1a] sm:text-base">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-1 h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[rgba(218,119,86,0.1)] bg-[#faf9f6]/90 px-4 py-4 sm:px-5 sm:pl-[4.25rem]">
                      <p className="text-sm leading-relaxed text-neutral-700">
                        {step.detail}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/80 p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
              <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">
              Ready to create your first KPI?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-600">
              Head over to the KPI Management tab and click &quot;New KPI&quot;
              to get started.
            </p>
            <button
              type="button"
              onClick={onGoToManagement}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <BarChart3 className="h-4 w-4" />
              Go to KPI Management
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-[rgba(218,119,86,0.15)] bg-neutral-50/90 p-5 shadow-sm sm:p-6">
            <div className="mb-3 flex items-start gap-2">
              <Lightbulb
                className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
                strokeWidth={2}
              />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#1a1a1a] sm:text-lg">
                  Sample KPIs for Indian Businesses — Manufacturing, Retail,
                  Trading &amp; Services
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Click on an industry, then a department to view sample KPIs.
                  Use these as a reference when creating your own KPIs.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-200/80 pt-4">
              {(Object.keys(FREQUENCY_BADGE) as SampleFrequency[]).map(
                (freq) => (
                  <span
                    key={freq}
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                      FREQUENCY_BADGE[freq].className
                    )}
                  >
                    {FREQUENCY_BADGE[freq].label}
                  </span>
                )
              )}
              <span className="text-sm text-neutral-500">
                — recommended tracking frequency
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {INDIAN_SAMPLE_INDUSTRIES.map((ind) => {
              const IndustryIcon = ind.Icon;
              const isIndustryOpen = openIndustryId === ind.id;
              return (
                <div
                  key={ind.id}
                  className={cn(
                    "overflow-hidden rounded-xl border-2 shadow-sm transition-shadow",
                    ind.cardBorder,
                    ind.cardBg
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndustry(ind.id)}
                    className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-white/50 sm:p-5"
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
                        ind.iconWrap
                      )}
                    >
                      <IndustryIcon className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-[#1a1a1a]">
                        {ind.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-neutral-600">
                        {ind.deptCount} departments · {ind.kpiCount} sample KPIs
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200",
                        isIndustryOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isIndustryOpen && (
                    <div className="space-y-2 border-t border-[rgba(218,119,86,0.12)] bg-[#faf9f6]/90 px-3 py-3 sm:px-4 sm:py-4">
                      {ind.departments.map((dept) => {
                        const dk = `${ind.id}-${dept.name}`;
                        const deptOpen = openDeptKey === dk;
                        return (
                          <div
                            key={dk}
                            className={cn(
                              "overflow-hidden rounded-lg shadow-sm",
                              kpiClass.borderSoft,
                              kpiClass.surfaceCard
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => toggleDept(dk)}
                              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-neutral-50"
                            >
                              <span>{dept.name}</span>
                              <span className="flex items-center gap-2 text-xs font-normal text-neutral-500">
                                {dept.kpis.length} KPIs
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 text-neutral-400 transition-transform",
                                    deptOpen && "rotate-180"
                                  )}
                                />
                              </span>
                            </button>
                            {deptOpen && (
                              <ul className="border-t border-neutral-100 px-4 py-2">
                                {dept.kpis.map((k) => {
                                  const fb = FREQUENCY_BADGE[k.frequency];
                                  return (
                                    <li
                                      key={k.name}
                                      className="flex flex-col gap-2 border-b border-neutral-50 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                                    >
                                      <span className="text-sm text-neutral-800">
                                        {k.name}
                                      </span>
                                      <span
                                        className={cn(
                                          "inline-flex w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                          fb.className
                                        )}
                                      >
                                        {fb.label}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIGuideTab;
