import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StatHeroCard,
  PieChartCard,
  BarChartCard,
  DataTableCard,
  TableBadge,
  PermitTimelineChartCard,
  IncidentTrendChartCard,
  type DataTableColumn,
  type TableBadgeTone,
  type PermitTimelinePoint,
} from "@/components/charts";
import BodyInjuryChartCard from "@/components/incident-analytics/BodyInjuryChartCard";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";

const SAFETY_ALERTS = [
  "16 Permits Expired",
  "52 Draft Permits Stuck",
  "173 Incidents Need Support",
];

const INCIDENT_TREND_DATA = [
  { month: "Jan", incidents: 38 },
  { month: "Feb", incidents: 44 },
  { month: "Mar", incidents: 40 },
  { month: "Apr", incidents: 48 },
  { month: "May", incidents: 52 },
  { month: "Jun", incidents: 44 },
];

const SEVERITY_DIST_DATA = [
  { name: "Low Risk", value: 200 },
  { name: "Moderate Risk", value: 40 },
  { name: "High Risk", value: 22 },
];

const ROOT_CAUSE_DATA = [
  { name: "Human Error", value: 120 },
  { name: "Environmental", value: 74 },
  { name: "Equipment Failure", value: 44 },
  { name: "Process", value: 24 },
];

const QUIET_ESCALATION_DATA = [
  { location: "Tower C · Level 7", count: 9 },
  { location: "Basement Parking", count: 7 },
  { location: "Lobby", count: 5 },
  { location: "B Wing · Ground", count: 4 },
  { location: "Rooftop", count: 3 },
];

const CATEGORY_BODYPART_DATA = [
  { category: "Equipment Failure", Head: 2, Arms: 7, Neck: 1 },
  { category: "Environmental", Head: 3, Arms: 3, Neck: 1 },
  { category: "Nature", Head: 3, Arms: 2, Neck: 1 },
];

const STATUS_BREAKDOWN = [
  { label: "Open", value: 83, color: "text-brand-error" },
  { label: "Under Invest.", value: 4, color: "text-[#8A5A00]" },
  { label: "Pending", value: 2, color: "text-[#8A5A00]" },
  { label: "Closed", value: 33, color: "text-brand-success" },
  { label: "Final Closure", value: 14, color: "text-brand-success" },
  { label: "Prov. Closure", value: 8, color: "text-brand-green" },
  { label: "Total", value: 262, color: "text-brand-text" },
];

const STATUS_TILE_BG_COLORS = ["#EFEFFB", "#B7DCD44D", "#E3909026", "#85BDF633", "#EFEFFB"];

const CATEGORY_BARS = [
  { label: "Nature", value: 144, pct: 55 },
  { label: "Environmental", value: 74, pct: 28 },
  { label: "Equipment Failure", value: 44, pct: 17 },
];

interface IncidentRow {
  id: string;
  date: string;
  category: string;
  level: string;
  status: string;
  description: string;
  rca: string;
  assignedTo: string;
}

const INCIDENT_ROWS: IncidentRow[] = [
  { id: "2216", date: "28/04/2026", category: "Equipment Failure", level: "Low Risk", status: "Open", description: "Testing", rca: "—", assignedTo: "—" },
  { id: "2215", date: "27/04/2026", category: "Equipment Failure", level: "Low Risk", status: "Final Closure", description: "Testing", rca: "climate", assignedTo: "Mahendra Lungare" },
  { id: "2217", date: "28/04/2026", category: "Environmental", level: "Low Risk", status: "Closed", description: "Testing", rca: "closed", assignedTo: "Mahendra Lungare" },
  { id: "2218", date: "08/05/2026", category: "Nature", level: "Low Risk", status: "Prov. Closure", description: "Testing", rca: "—", assignedTo: "Samsung Users" },
  { id: "2219", date: "08/05/2026", category: "Nature", level: "Low Risk", status: "Final Closure", description: "Testing an incident", rca: "—", assignedTo: "User 1" },
];

const STATUS_BADGE_TONE: Record<string, "red" | "green" | "grey"> = {
  Open: "red",
  "Final Closure": "green",
  Closed: "green",
  "Prov. Closure": "grey",
};

const INCIDENT_COLUMNS: DataTableColumn<IncidentRow>[] = [
  { key: "id", header: "ID", render: (row) => <span className="font-semibold text-brand-text">{row.id}</span> },
  { key: "date", header: "Date", render: (row) => row.date },
  { key: "category", header: "Category", render: (row) => row.category },
  { key: "level", header: "Level", render: (row) => <TableBadge tone="green">{row.level}</TableBadge> },
  {
    key: "status",
    header: "Status",
    render: (row) => <TableBadge tone={STATUS_BADGE_TONE[row.status] ?? "grey"}>{row.status}</TableBadge>,
  },
  { key: "description", header: "Description", render: (row) => row.description },
  { key: "rca", header: "RCA", render: (row) => row.rca },
  { key: "assignedTo", header: "Assigned To", render: (row) => row.assignedTo },
];

const PERMIT_TIMELINE_DATA: PermitTimelinePoint[] = [
  { daysAgo: 185, status: "Expired" },
  { daysAgo: 143, status: "Expired" },
  { daysAgo: 99, status: "Expired" },
  { daysAgo: 78, status: "Draft" },
  { daysAgo: 65, status: "Expired" },
  { daysAgo: 61, status: "Draft" },
  { daysAgo: 51, status: "Expired" },
  { daysAgo: 42, status: "Expired" },
  { daysAgo: 34, status: "Draft" },
  { daysAgo: 30, status: "Expired" },
  { daysAgo: 28, status: "Draft" },
  { daysAgo: 27, status: "Expired" },
  { daysAgo: 25, status: "Expired" },
  { daysAgo: 23, status: "Draft" },
  { daysAgo: 22, status: "Open" },
  { daysAgo: 21, status: "Draft" },
  { daysAgo: 20, status: "Open" },
  { daysAgo: 19, status: "Draft" },
  { daysAgo: 18, status: "Open" },
  { daysAgo: 16, status: "Open" },
  { daysAgo: 15, status: "Open" },
  { daysAgo: 12, status: "Open" },
];

const PERMIT_LEVEL_BOTTLENECK_DATA = [
  { level: "Level 614", count: 6 },
  { level: "Level 617", count: 5 },
  { level: "Level 615", count: 3 },
];

const PERMIT_LEVEL_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756"];

const PERMIT_RISK_WEIGHTED_DATA = [
  { type: "Height Work", count: 23 },
  { type: "Hot Work", count: 19 },
  { type: "Excavation", count: 7 },
  { type: "Cold Work", count: 11 },
  { type: "Radiology", count: 5 },
];

const PERMIT_RISK_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#DA7756", "#DA7756"];

const PERMIT_STATUS_BARS = [
  { label: "Draft (stuck)", value: 52, pct: 54 },
  { label: "Expired", value: 16, pct: 16 },
  { label: "Open / Active", value: 9, pct: 9 },
  { label: "Closed", value: 13, pct: 13 },
];

interface PermitExceptionRow {
  ref: string;
  type: string;
  dateLabel: string;
  daysOpen: string;
  status: string;
}

const PERMIT_EXCEPTIONS: PermitExceptionRow[] = [
  { ref: "Ref 90", type: "Hot Work", dateLabel: "Expired 23/11/2025", daysOpen: "190d", status: "Expired" },
  { ref: "Ref 82", type: "Excavation", dateLabel: "Expired 14/01/2026", daysOpen: "138d", status: "Expired" },
  { ref: "Ref 87", type: "Confined Space", dateLabel: "Expired 02/03/2026", daysOpen: "91d", status: "Expired" },
  { ref: "Ref 94", type: "Cold Work", dateLabel: "Raised 01/04/2026", daysOpen: "61d", status: "Draft · Stuck" },
  { ref: "Ref 95", type: "Height Work", dateLabel: "Raised 11/05/2026", daysOpen: "21d", status: "Draft · Stuck" },
  { ref: "Ref 617", type: "Hot Work", dateLabel: "Raised 02/05/2026", daysOpen: "30d", status: "Pending Closure" },
  { ref: "Ref 614", type: "Height Work", dateLabel: "Raised 09/05/2026", daysOpen: "23d", status: "Pending Extend" },
  { ref: "Ref 615", type: "Cold Work", dateLabel: "Raised 14/05/2026", daysOpen: "18d", status: "Pending Closure" },
];

const PERMIT_STATUS_BADGE_TONE: Record<string, TableBadgeTone> = {
  Expired: "red",
  "Draft · Stuck": "red",
  "Pending Closure": "amber",
  "Pending Extend": "amber",
};

const PERMIT_EXCEPTION_COLUMNS: DataTableColumn<PermitExceptionRow>[] = [
  { key: "ref", header: "Permit Ref", render: (row) => <span className="font-semibold text-brand-text">{row.ref}</span> },
  { key: "type", header: "Permit Type", render: (row) => row.type },
  { key: "dateLabel", header: "Raised / Expiry Date", render: (row) => row.dateLabel },
  {
    key: "daysOpen",
    header: "Days Open",
    render: (row) => (
      <span className={cn(row.status === "Expired" || row.status === "Draft · Stuck" ? "text-brand-error" : "text-[#8A5A00]")}>
        {row.daysOpen}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <TableBadge tone={PERMIT_STATUS_BADGE_TONE[row.status] ?? "grey"}>{row.status}</TableBadge>,
  },
];

interface FireCheckItem {
  label: string;
  status: string;
  tone: TableBadgeTone;
}

const FIRE_EMERGENCY_ITEMS: FireCheckItem[] = [
  { label: "Fire Alarm Monthly Checklist", status: "Overdue · 12 months", tone: "red" },
  { label: "Fire NOC", status: "Valid · Expires Dec 2026", tone: "green" },
  { label: "Fire Extinguisher Inspection", status: "3 overdue", tone: "amber" },
  { label: "Sprinkler System Check", status: "Completed Jun 2026", tone: "green" },
  { label: "Emergency Exit Signage", status: "2 non-functional", tone: "amber" },
  { label: "Fire Drill (Last conducted)", status: "Mar 2026 · Q3 due", tone: "amber" },
];

interface SafetyPanelProps {
  activeSection: string;
}

export function SafetyPanel({ activeSection }: SafetyPanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  const sohiItems: SafetyGridItem[] = [
    {
      key: "sohi-score",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="SOHI Score"
          value="7.8/10"
          accent="success"
          subtitle="Safety & Operational Health Index"
          progress={78}
          className="h-full"
        />
      ),
    },
    {
      key: "sohi-zero",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Zero Incident Days"
          value="24"
          accent="success"
          subtitle="Consecutive · no LTI"
          className="h-full"
        />
      ),
    },
    {
      key: "sohi-ltir",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="LTIR"
          value="0.00"
          accent="success"
          subtitle="Lost Time Injury Rate · Industry KPI"
          className="h-full"
        />
      ),
    },
    {
      key: "sohi-permit",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Permit Compliance %"
          value="9%"
          accent="error"
          subtitle="9 open of 97 · 16 expired"
          progress={9}
          className="h-full"
        />
      ),
    },
    {
      key: "sohi-contradiction",
      layout: { x: 0, y: 3, w: 12, h: 6, minW: 4, minH: 4 },
      content: (
        <div className="rounded-lg bg-brand-error-bg p-4 h-full">
          <div className="text-brand-body-4 font-bold text-brand-text">
            SOHI score vs the number it doesn&apos;t include
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5">
            Composite score looks healthy. Permit compliance underneath it does not.
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-success">
                7.8<span className="text-brand-body-3 text-brand-text-light">/10</span>
              </div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">SOHI score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-error">
                9<span className="text-brand-body-3 text-brand-text-light">%</span>
              </div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">
                Permit compliance
              </div>
            </div>
          </div>

          <div className="text-brand-body-5 text-brand-error mt-3">
            9 of 97 permits are open and compliant — 16 already expired. A 7.8 composite score
            next to 9% permit compliance means the score is not weighting this risk the way the
            raw number suggests it should.
          </div>
        </div>
      ),
    },
    {
      key: "sohi-incident-trend",
      layout: { x: 0, y: 9, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <IncidentTrendChartCard
          title="Incident Trend"
          subtitle="Are incidents rising?"
          data={INCIDENT_TREND_DATA}
          height={200}
          className="h-full no-drag"
        />
      ),
    },
    {
      key: "sohi-incident-support",
      layout: { x: 6, y: 9, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg flex flex-col items-center justify-center text-center p-6 h-full">
          <div className="text-4xl font-bold text-brand-error">66%</div>
          <div className="text-brand-body-5 text-brand-text-light mt-1 max-w-[240px]">
            173 of 262 incidents need external support — the team cannot close these alone
          </div>
        </div>
      ),
    },
  ];

  const incidentsItems: SafetyGridItem[] = [
    {
      key: "inc-nearmiss",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Near Miss / Good Catch Rate"
          value="0"
          accent="warning"
          subtitle="Per million sq ft/annum — zero reported is a red flag, not good news"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-sqft",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Incidents / Million Sq Ft"
          value="5,800"
          accent="error"
          subtitle="Normalized rate, not raw count"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-ltir2",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="LTIR"
          value="0.00"
          accent="success"
          subtitle="Lost Time Injury Rate"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-manhours",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Safe Man Hours"
          value="248"
          accent="info"
          subtitle="Since last lost-time incident"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-warning-banner",
      layout: { x: 0, y: 3, w: 12, h: 3, minW: 4, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <div className="rounded-lg border border-brand-warning bg-brand-warning-light px-3 py-2 text-brand-body-5 text-[#B8860B] h-full overflow-auto">
          Zero Near Miss / Good Catch reports alongside 5,800 incidents per million sq ft is a
          contradiction worth naming: either near-misses genuinely aren&apos;t happening (unlikely
          at this incident rate) or nobody is reporting them — the second explanation is usually
          the real one, and it means the reporting culture itself needs attention, not just the
          incidents.
        </div>
      ),
    },
    {
      key: "inc-severity",
      layout: { x: 0, y: 6, w: 4, h: 7, minW: 3, minH: 4 },
      content: (
        <PieChartCard
          title="Severity Distribution"
          subtitle="High / Medium / Low"
          data={SEVERITY_DIST_DATA}
          centerLabel="262"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-closure-rate",
      layout: { x: 4, y: 6, w: 4, h: 7, minW: 3, minH: 4 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Incident Closure Rate %"
          value="17.9%"
          accent="warning"
          subtitle="Closed ÷ Total × 100 — 47 of 262. Avg Resolution Time: 12.4 days"
          className="h-full flex flex-col justify-center"
        />
      ),
    },
    {
      key: "inc-rootcause",
      layout: { x: 8, y: 6, w: 4, h: 7, minW: 3, minH: 4 },
      content: (
        <PieChartCard
          title="Primary Root Cause"
          subtitle="Human · Equipment · Process · Environment"
          data={ROOT_CAUSE_DATA}
          centerLabel="262"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-rootnote",
      layout: { x: 0, y: 13, w: 12, h: 2, minW: 4, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <p className="text-brand-body-5 text-brand-text-light">
          Root Cause is a different lens than the Category breakdown below — Category groups
          incidents by what happened, Root Cause groups by why. A Category-driven fix (better
          equipment) won&apos;t help if the real root cause is Human error.
        </p>
      ),
    },
    {
      key: "inc-compliance",
      layout: { x: 0, y: 15, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="⭐ Safety Compliance Score"
          value="48/100"
          accent="warning"
          subtitle="Composite: closure rate, CAPA completion, severity mix, repeat incidents"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-status-breakdown",
      layout: { x: 0, y: 18, w: 12, h: 9, minW: 6, minH: 6 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg p-5 h-full overflow-auto">
          <div className="text-brand-body-3 font-bold text-brand-text">Incident Status Breakdown</div>
          <div className="text-brand-body-5 text-brand-text-light mb-3">
            7 confirmed statuses including Final &amp; Provisional closure
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {STATUS_BREAKDOWN.map((s, index) => (
              <div
                key={s.label}
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: STATUS_TILE_BG_COLORS[index % STATUS_TILE_BG_COLORS.length] }}
              >
                <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
                <div className="text-brand-body-5 text-black mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-md bg-brand-error-bg px-3 py-2 text-brand-body-5 font-semibold text-brand-error mb-2">
            173 incidents require external support (66%)
          </div>
          <div className="rounded-md bg-brand-warning-light px-3 py-2 text-brand-body-5 text-[#B8860B] mb-4">
            The incident list itself shows 438 records, not 262. Not resolved here — could mean
            duplicate entries or multi-row incidents. Flagged, not assumed either way.
          </div>

          <div className="text-brand-body-5 font-semibold text-brand-text-light uppercase tracking-wide mb-2">
            By Category
          </div>
          <div className="space-y-2">
            {CATEGORY_BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="w-32 text-brand-body-5 text-brand-text-light flex-shrink-0">{bar.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-brand-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${bar.pct}%`, backgroundColor: bar.pct > 50 ? "#76CDC1" : "#E39090" }}
                  />
                </div>
                <span className="text-brand-body-5 font-semibold text-brand-text w-8 text-right">{bar.value}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "inc-closure-integrity",
      layout: { x: 0, y: 27, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        <div className="bg-white rounded-lg p-4 h-full overflow-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-brand-body-4 font-bold text-brand-text">Closure integrity score</div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">
                Share of Closed incidents with zero RCA, Corrective, or Preventive Action recorded
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-2xl font-bold text-brand-error">71%</div>
              <div className="text-brand-body-5 text-brand-text-light">of 33 closed incidents</div>
            </div>
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-2">
            &quot;Closed&quot; is being read as progress on this dashboard. Most closures have no
            root-cause documentation at all — the status field changed, but nothing was actually
            investigated. Every other &quot;Closed&quot; number on this page should be read with
            that in mind.
          </div>
        </div>
      ),
    },
    {
      key: "inc-quiet-escalation",
      layout: { x: 0, y: 31, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <BarChartCard
          title="Quiet escalation — repeat Low Risk by location"
          subtitle="One location generating incidents repeatedly, not 170 unrelated minor events"
          data={QUIET_ESCALATION_DATA}
          categoryKey="location"
          orientation="horizontal"
          categoryColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#DA7756", "#DA7756"]}
          series={[{ dataKey: "count", name: "Incidents" }]}
          insightVariant="plain"
          insight='Low Risk dominates the raw count and gets ignored in favor of rarer severe incidents. A location that keeps generating "Low Risk" incidents over and over is quietly escalating toward something serious — the severity label resets every time, so nobody aggregates it by place.'
          className="h-full"
        />
      ),
    },
    {
      key: "inc-table",
      layout: { x: 0, y: 37, w: 12, h: 8, minW: 6, minH: 5 },
      content: (
        <DataTableCard
          title="Incidents Requiring Action"
          subtitle="Sorted by action priority — Open → Under Investigation → oldest first. RCA · Corrective Action · Preventive Action · Assigned To — all confirmed fields"
          columns={INCIDENT_COLUMNS}
          data={INCIDENT_ROWS}
          getRowKey={(row) => row.id}
          className="h-full no-drag"
        />
      ),
    },
    {
      key: "inc-bodypart",
      layout: { x: 0, y: 45, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <BarChartCard
          title="Which category hurts which body part"
          subtitle='Turns "we had 12 equipment incidents" into "this equipment is taking hands"'
          data={CATEGORY_BODYPART_DATA}
          categoryKey="category"
          orientation="horizontal"
          stacked
          series={[
            { dataKey: "Head", name: "Head" },
            { dataKey: "Arms", name: "Arms" },
            { dataKey: "Neck", name: "Neck" },
          ]}
          insightVariant="plain"
          insight="If Equipment Failure incidents disproportionately injure Arms, that's a guarding or lockout-tagout gap on specific machinery — a maintenance work order, not a training memo."
          className="h-full"
        />
      ),
    },
    {
      key: "inc-bodyinjury",
      layout: { x: 0, y: 51, w: 12, h: 9, minW: 6, minH: 6 },
      content: <BodyInjuryChartCard />,
    },
  ];

  const permitsItems: SafetyGridItem[] = [
    {
      key: "permit-total",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="purple" label="Total Permits" value="97" accent="green" subtitle="All types" className="h-full" />,
    },
    {
      key: "permit-open",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="teal" label="Open" value="9" accent="success" subtitle="Active" className="h-full" />,
    },
    {
      key: "permit-expired",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="peach" label="Expired" value="16" accent="error" subtitle="Non-compliant" className="h-full" />,
    },
    {
      key: "permit-draft",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="blue" label="Draft" value="52" accent="error" subtitle="54% of all permits" className="h-full" />,
    },
    {
      key: "permit-approved",
      layout: { x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="purple" label="Approved" value="2" accent="success" subtitle="Cleared, awaiting close" className="h-full" />,
    },
    {
      key: "permit-closed",
      layout: { x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="teal" label="Closed" value="13" accent="green" subtitle="Completed lifecycle" className="h-full" />,
    },
    {
      key: "permit-hold",
      layout: { x: 6, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="peach" label="Hold" value="1" accent="warning" subtitle="Paused mid-process" className="h-full" />,
    },
    {
      key: "permit-rejected",
      layout: { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: <StatHeroCard tone="blue" label="Rejected" value="1" accent="error" subtitle="Denied outright" className="h-full" />,
    },
    {
      key: "permit-timeline",
      layout: { x: 0, y: 6, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <PermitTimelineChartCard
          title="Permit age timeline"
          subtitle="97 permits · today line shows how much is already expired vs in progress"
          data={PERMIT_TIMELINE_DATA}
          insight="16 expired plus 52 stuck in draft is over 70% of all permits in some non-compliant state. The exceptions table below lists each by name and age — this chart is what makes the scale obvious before reading it."
          className="h-full"
        />
      ),
    },
    {
      key: "permit-closed-check",
      layout: { x: 0, y: 12, w: 12, h: 5, minW: 6, minH: 4 },
      content: (
        <div className="bg-white rounded-lg p-4 h-full overflow-auto">
          <div className="text-brand-body-4 font-bold text-brand-text">Is &quot;Closed&quot; actually closed?</div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5 mb-3">
            Permits marked Closed or Extended, crossed against their own approval status
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-brand-body-5">
              <span className="text-brand-text">Ref 617 · Hot Work · marked &quot;Pending Closure&quot;</span>
              <TableBadge tone="amber">Closure approval still pending</TableBadge>
            </div>
            <div className="flex items-center justify-between text-brand-body-5">
              <span className="text-brand-text">Ref 614 · Height Work · marked &quot;Pending Extend&quot;</span>
              <TableBadge tone="amber">Extension approval still pending</TableBadge>
            </div>
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-3">
            A permit whose closure approval is still sitting pending isn&apos;t actually closed —
            it&apos;s a status field that moved ahead of the paperwork. This connects the permit
            list to the separate Pending Approvals queue instead of treating them as two unrelated
            pages.
          </div>
        </div>
      ),
    },
    {
      key: "permit-level-bottleneck",
      layout: { x: 0, y: 17, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <BarChartCard
          title="Approval level bottleneck"
          subtitle="Which specific level has the most, and oldest, stuck approvals"
          data={PERMIT_LEVEL_BOTTLENECK_DATA}
          categoryKey="level"
          orientation="horizontal"
          categoryColors={PERMIT_LEVEL_COLORS}
          showInfoIcon
          series={[{ dataKey: "count", name: "Stuck Approvals" }]}
          insightVariant="plain"
          insight='If one level accounts for most stuck approvals, that&apos;s not "approvals are slow" — it&apos;s a named role or person to follow up with today, not a vague process complaint.'
          className="h-full"
        />
      ),
    },
    {
      key: "permit-risk-weighted",
      layout: { x: 0, y: 23, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <BarChartCard
          title="Expired/draft-stuck permits by risk-weighted type"
          subtitle="Height and Hot Work carry more inherent risk than Cold or Radiology work"
          data={PERMIT_RISK_WEIGHTED_DATA}
          categoryKey="type"
          orientation="horizontal"
          categoryColors={PERMIT_RISK_COLORS}
          series={[{ dataKey: "count", name: "Permits" }]}
          insightVariant="plain"
          insight="A handful of expired Height Work permits sitting unactioned is a materially bigger exposure than the same count of expired Cold Work permits — a flat volume bar can't tell the two apart."
          className="h-full"
        />
      ),
    },
    {
      key: "permit-repeat-extensions",
      layout: { x: 0, y: 29, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        <div className="bg-white rounded-lg p-4 h-full overflow-auto">
          <div className="text-brand-body-4 font-bold text-brand-text">Repeat extensions</div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5 mb-3">
            Same permit extended more than once — never re-approved as fresh
          </div>
          <div className="flex items-center justify-between text-brand-body-5">
            <span className="text-brand-text">Ref 95 · Height Work</span>
            <TableBadge tone="red">Extended 2×</TableBadge>
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-3">
            A permit extended twice isn&apos;t &quot;running a bit long&quot; — it&apos;s operating
            without ever going through proper re-approval, a compliance gap dressed up as normal
            process.
          </div>
        </div>
      ),
    },
    {
      key: "permit-status",
      layout: { x: 0, y: 33, w: 12, h: 6, minW: 6, minH: 4 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg p-5 h-full overflow-auto">
          <div className="text-brand-body-3 font-bold text-brand-text">Permit Status</div>
          <div className="text-brand-body-5 text-brand-text-light mb-3">
            97 total · Expired → Draft → Active
          </div>
          <div className="space-y-2">
            {PERMIT_STATUS_BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="w-32 text-brand-body-5 text-brand-text-light flex-shrink-0">{bar.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-brand-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${bar.pct}%`, backgroundColor: bar.pct > 15 ? "#76CDC1" : "#E39090" }}
                  />
                </div>
                <span className="text-brand-body-5 font-semibold text-brand-text w-8 text-right">{bar.value}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: "permit-compliance",
      layout: { x: 0, y: 39, w: 6, h: 4, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Permit-wise Safety Compliance %"
          value="61%"
          accent="warning"
          subtitle="PPE, isolation, and approvals all completed — distinct from whether the permit itself was approved"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-violations",
      layout: { x: 6, y: 39, w: 6, h: 4, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Permit Violations / Non-Compliance"
          value="6"
          accent="error"
          subtitle="Unauthorized work or missing approvals found on approved/active permits"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-note",
      layout: { x: 0, y: 43, w: 12, h: 2, minW: 6, minH: 2 },
      content: (
        <p className="text-brand-body-5 text-brand-text-light">
          A permit can be fully approved through the workflow and still fail on-site safety
          requirements — these two numbers track a different failure mode than the
          approval-chain issues already flagged above.
        </p>
      ),
    },
    {
      key: "permit-exceptions",
      layout: { x: 0, y: 45, w: 12, h: 9, minW: 6, minH: 5 },
      content: (
        <DataTableCard
          title="Permit Exceptions Log"
          subtitle="Which permits need action — Expired → Draft Stuck → Pending Approvals, oldest first in each group"
          columns={PERMIT_EXCEPTION_COLUMNS}
          data={PERMIT_EXCEPTIONS}
          getRowKey={(row) => row.ref}
          className="h-full no-drag"
        />
      ),
    },
  ];

  const emergencyItems: SafetyGridItem[] = [
    {
      key: "emergency-fire",
      layout: { x: 0, y: 0, w: 12, h: 9, minW: 6, minH: 5 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg p-5 h-full overflow-auto">
          <div className="text-brand-body-3 font-bold text-brand-text">🔥 Fire &amp; Emergency Compliance</div>
          <div className="text-brand-body-5 text-brand-text-light mb-3">
            Fire safety systems · compliance status · checklist data
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3">
            {FIRE_EMERGENCY_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2 text-brand-body-5">
                <span className="text-brand-text">{item.label}</span>
                <TableBadge tone={item.tone}>{item.status}</TableBadge>
              </div>
            ))}
          </div>

          <div className="rounded-md bg-brand-error-bg px-3 py-2 text-brand-body-5 font-semibold text-brand-error mt-4">
            Fire alarm checklist overdue 12+ months · Emergency Preparedness data pending — not
            showing unverified scores
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Safety Alerts strip */}
      <div className="rounded-lg bg-brand-error-bg px-5 py-4">
        <div className="flex items-center gap-2 text-brand-body-5 font-bold uppercase tracking-wide text-brand-error mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          Safety Alerts
        </div>
        <div className="flex flex-wrap gap-2">
          {SAFETY_ALERTS.map((alert) => (
            <span
              key={alert}
              className="rounded-full bg-white px-3 py-1.5 text-brand-body-5 font-semibold text-brand-error border border-brand-error/40"
            >
              {alert}
            </span>
          ))}
        </div>
      </div>

      <div ref={registerRef("SOHI")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetySohiGridLayout" items={sohiItems} />
      </div>

      <div ref={registerRef("Incidents")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetyIncidentsGridLayout" items={incidentsItems} />
      </div>

      <div ref={registerRef("Permits")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetyPermitsGridLayout" items={permitsItems} />
      </div>

      <div ref={registerRef("Emergency")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetyEmergencyGridLayout" items={emergencyItems} />
      </div>
    </div>
  );
}
