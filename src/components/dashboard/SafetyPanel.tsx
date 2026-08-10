import { useEffect, useMemo, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
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
  type IncidentTrendDatum,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BodyInjuryChartCard from "@/components/incident-analytics/BodyInjuryChartCard";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";
import type { PermitsDashboardData, IncidentsDashboardData } from "@/hooks/useFmDashboardData";

/** Small placeholder for a widget whose backing field the permits dashboard API doesn't provide (yet) or returned empty. */
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

/** PermitTimelineChartCard only accepts these 3 statuses — match by keyword since the live API's casing/wording isn't confirmed. Returns null (row dropped) for anything unrecognized rather than guessing. */
function normalizePermitTimelineStatus(status: string): "Expired" | "Draft" | "Open" | null {
  const s = status.toLowerCase();
  if (s.includes("expired")) return "Expired";
  if (s.includes("draft")) return "Draft";
  if (s.includes("open") || s.includes("active")) return "Open";
  return null;
}

/** Status strings from the live API aren't confirmed, so match by keyword rather than exact string. */
function permitStatusTone(status: string): TableBadgeTone {
  const s = status.toLowerCase();
  if (s.includes("expired") || s.includes("stuck") || s.includes("reject")) return "red";
  if (s.includes("pending") || s.includes("hold")) return "amber";
  if (s.includes("closed") || s.includes("approved") || s.includes("open") || s.includes("active")) return "green";
  return "grey";
}

const STATUS_TILE_BG_COLORS = ["#EFEFFB", "#B7DCD44D", "#E3909026", "#85BDF633", "#EFEFFB"];

// The per-incident RCA/Corrective-Action/Assigned-To list ("Incidents
// Requiring Action" table) isn't part of this integration — the reference
// doc's Notes explicitly say that data (level_wise, status_summary,
// top_categories, incident_kpis, rca_data) lives on a separate, pre-existing
// `incident_dashboard/*` API surface, not on incidents_overview/trend/
// analysis/hotspots. Left as illustrative mock data until that surface is
// wired up as its own task.
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

const PERMIT_LEVEL_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756"];

interface PermitExceptionTableRow {
  ref: string;
  type: string;
  dateLabel: string;
  daysOpen: string;
  status: string;
}

const PERMIT_EXCEPTION_COLUMNS: DataTableColumn<PermitExceptionTableRow>[] = [
  { key: "ref", header: "Permit Ref", render: (row) => <span className="font-semibold text-brand-text">{row.ref}</span> },
  { key: "type", header: "Permit Type", render: (row) => row.type },
  { key: "dateLabel", header: "Raised / Expiry Date", render: (row) => row.dateLabel },
  {
    key: "daysOpen",
    header: "Days Open",
    render: (row) => (
      <span className={cn(permitStatusTone(row.status) === "red" ? "text-brand-error" : "text-[#8A5A00]")}>
        {row.daysOpen}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <TableBadge tone={permitStatusTone(row.status)}>{row.status}</TableBadge>,
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
  /** Live permits/permit-bottleneck/permit-detail data — null until loaded or if the dashboard's site scope isn't resolved yet. */
  permits: PermitsDashboardData | null;
  permitsLoading: boolean;
  /** Live incidents overview/trend/analysis/hotspots data — null until loaded or if the dashboard's site scope isn't resolved yet. */
  incidents: IncidentsDashboardData | null;
  incidentsLoading: boolean;
}

export function SafetyPanel({ activeSection, permits, permitsLoading, incidents, incidentsLoading }: SafetyPanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const el = sectionRefs.current[activeSection];
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeSection]);

  const registerRef = (key: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  const permitOverview = permits?.overview ?? null;
  const permitStatus = permitOverview?.status_breakdown ?? null;
  const totalPermits = permitOverview?.total_permits;
  const openCount = permitStatus?.open;
  const expiredCount = permitStatus?.expired;
  const draftCount = permitStatus?.draft;
  const approvedCount = permitStatus?.approved;
  const closedCount = permitStatus?.closed;
  const holdCount = permitStatus?.hold;
  const rejectedCount = permitStatus?.rejected;
  const permitCompliancePercent = permitOverview?.permit_compliance;
  const safetyCompliancePercent = permitOverview?.safety_compliance_percent;
  const violationsCount = permitOverview?.violations_count;

  const pctOfTotal = (value: number | undefined) =>
    typeof value === "number" && typeof totalPermits === "number" && totalPermits > 0
      ? `${Math.round((value / totalPermits) * 100)}% of all permits`
      : undefined;

  const permitStatusBars = useMemo(() => {
    if (!permitStatus || typeof totalPermits !== "number" || totalPermits <= 0) return [];
    const rows: { label: string; value: number; pct: number }[] = [
      { label: "Draft (stuck)", value: draftCount ?? NaN },
      { label: "Expired", value: expiredCount ?? NaN },
      { label: "Open / Active", value: openCount ?? NaN },
      { label: "Closed", value: closedCount ?? NaN },
    ];
    return rows
      .filter((r) => typeof r.value === "number" && !Number.isNaN(r.value))
      .map((r) => ({ ...r, pct: Math.round((r.value / totalPermits) * 100) }));
  }, [permitStatus, totalPermits, draftCount, expiredCount, openCount, closedCount]);

  const permitLevelBottleneckData = useMemo(() => {
    const rows = permits?.bottleneck?.by_level;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        level: row?.level ?? row?.name ?? "Unknown",
        count: typeof row?.stuck_count === "number" ? row.stuck_count : typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.count > 0);
  }, [permits]);

  const permitRiskWeightedData = useMemo(() => {
    const rows = permits?.bottleneck?.by_type;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        type: row?.type ?? row?.name ?? "Unknown",
        count: typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.count > 0);
  }, [permits]);

  const permitTimelineData: PermitTimelinePoint[] = useMemo(() => {
    const rows = permits?.detail?.age_timeline;
    if (!Array.isArray(rows)) return [];
    const result: PermitTimelinePoint[] = [];
    for (const row of rows) {
      if (!row || typeof row.days_ago !== "number" || typeof row.status !== "string") continue;
      const status = normalizePermitTimelineStatus(row.status);
      if (status) result.push({ daysAgo: row.days_ago, status });
    }
    return result;
  }, [permits]);

  const permitExceptionRows: PermitExceptionTableRow[] = useMemo(() => {
    const rows = permits?.detail?.exceptions;
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => ({
      ref: row?.ref ?? row?.permit_ref ?? `Permit ${index + 1}`,
      type: row?.type ?? row?.permit_type ?? "—",
      dateLabel: row?.date_label ?? row?.expiry_date ?? row?.raised_date ?? "—",
      daysOpen: typeof row?.days_open === "number" ? `${row.days_open}d` : "—",
      status: row?.status ?? "—",
    }));
  }, [permits]);

  const permitPendingApprovalRows = useMemo(
    () => permitExceptionRows.filter((row) => /pending\s*(closure|extend)/i.test(row.status)),
    [permitExceptionRows]
  );

  const permitRepeatExtensions = useMemo(() => {
    const rows = permits?.detail?.repeat_extensions;
    return Array.isArray(rows) ? rows : [];
  }, [permits]);

  // --- Incidents (live) ---
  const incidentOverview = incidents?.overview ?? null;
  const incidentStatus = incidentOverview?.status_breakdown ?? null;
  const totalIncidents = incidentOverview?.total_incidents;
  const openIncidents = incidentStatus?.open;
  const underInvestigationIncidents = incidentStatus?.under_investigation;
  const pendingIncidents = incidentStatus?.pending;
  const closedIncidents = incidentStatus?.closed;
  const finalClosureIncidents = incidentStatus?.final_closure;
  const provisionalClosureIncidents = incidentStatus?.provisional_closure;
  const sohiScore = incidentOverview?.sohi_score;
  const nearMissRate = incidentOverview?.near_miss_rate;
  const incidentsPerMillionSqft = incidentOverview?.incidents_per_million_sqft;
  const ltir = incidentOverview?.ltir;
  const safeManHours = incidentOverview?.safe_man_hours;
  const externalSupportCount = incidentOverview?.external_support_count;
  const externalSupportPercent = incidentOverview?.external_support_percent;
  const rawRecordCount = incidentOverview?.raw_record_count;

  const incidentTrendData: IncidentTrendDatum[] = useMemo(() => {
    const rows = incidents?.trend?.monthly_trend;
    if (!Array.isArray(rows)) return [];
    const result: IncidentTrendDatum[] = [];
    for (const row of rows) {
      if (row && typeof row.month === "string" && typeof row.incidents === "number") {
        result.push({ month: row.month, incidents: row.incidents });
      }
    }
    return result;
  }, [incidents]);

  const incidentAnalysis = incidents?.analysis ?? null;

  const severityDistData = useMemo(() => {
    const rows = incidentAnalysis?.severity_distribution;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        name: row?.name ?? row?.severity ?? "Unknown",
        value: typeof row?.value === "number" ? row.value : typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.value > 0);
  }, [incidentAnalysis]);

  const rootCauseData = useMemo(() => {
    const rows = incidentAnalysis?.root_cause_breakdown;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        name: row?.name ?? row?.cause ?? "Unknown",
        value: typeof row?.value === "number" ? row.value : typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.value > 0);
  }, [incidentAnalysis]);

  const incidentCategoryBars = useMemo(() => {
    const rows = incidentAnalysis?.category_breakdown;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => {
        const value = typeof row?.count === "number" ? row.count : 0;
        const pct =
          typeof row?.percent === "number"
            ? row.percent
            : typeof totalIncidents === "number" && totalIncidents > 0
              ? Math.round((value / totalIncidents) * 100)
              : 0;
        return { label: row?.category ?? row?.name ?? "Unknown", value, pct };
      })
      .filter((row) => row.value > 0);
  }, [incidentAnalysis, totalIncidents]);

  const closureRatePercent = incidentAnalysis?.closure_rate_percent;
  const avgResolutionTime = incidentAnalysis?.avg_resolution_time;
  const resolutionSampleSize = incidentAnalysis?.sample_size;
  const closureIntegrityPercent = incidentAnalysis?.closure_integrity_percent;
  const closureIntegritySampleSize = incidentAnalysis?.closure_integrity_sample_size;
  const safetyComplianceScore = incidentAnalysis?.safety_compliance_score;

  const incidentHotspots = incidents?.hotspots ?? null;

  const quietEscalationData = useMemo(() => {
    const rows = incidentHotspots?.by_location;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        location: row?.location ?? row?.name ?? "Unknown",
        count: typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.count > 0);
  }, [incidentHotspots]);

  const incidentBodyPartRows = useMemo(() => {
    const rows = incidentHotspots?.by_body_part;
    return Array.isArray(rows) ? rows : [];
  }, [incidentHotspots]);

  const incidentBodyPartKeys = useMemo(() => {
    const keys = new Set<string>();
    incidentBodyPartRows.forEach((row) => {
      Object.keys(row ?? {}).forEach((key) => {
        if (key !== "category" && key !== "name" && typeof row[key] === "number") keys.add(key);
      });
    });
    return Array.from(keys);
  }, [incidentBodyPartRows]);

  const incidentBodyPartChartData = useMemo(
    () => incidentBodyPartRows.map((row) => ({ ...row, category: row?.category ?? row?.name ?? "Unknown" })),
    [incidentBodyPartRows]
  );

  const incidentStatusTiles = useMemo(() => {
    if (!incidentStatus) return [];
    const entries: { label: string; value: number; color: string }[] = [
      { label: "Open", value: openIncidents ?? NaN, color: "text-brand-error" },
      { label: "Under Invest.", value: underInvestigationIncidents ?? NaN, color: "text-[#8A5A00]" },
      { label: "Pending", value: pendingIncidents ?? NaN, color: "text-[#8A5A00]" },
      { label: "Closed", value: closedIncidents ?? NaN, color: "text-brand-success" },
      { label: "Final Closure", value: finalClosureIncidents ?? NaN, color: "text-brand-success" },
      { label: "Prov. Closure", value: provisionalClosureIncidents ?? NaN, color: "text-brand-green" },
    ].filter((entry) => typeof entry.value === "number" && !Number.isNaN(entry.value));
    if (typeof totalIncidents === "number") entries.push({ label: "Total", value: totalIncidents, color: "text-brand-text" });
    return entries;
  }, [
    incidentStatus,
    openIncidents,
    underInvestigationIncidents,
    pendingIncidents,
    closedIncidents,
    finalClosureIncidents,
    provisionalClosureIncidents,
    totalIncidents,
  ]);

  const safetyAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (typeof expiredCount === "number") alerts.push(`${expiredCount} Permits Expired`);
    if (typeof draftCount === "number") alerts.push(`${draftCount} Draft Permits Stuck`);
    if (typeof externalSupportCount === "number") alerts.push(`${externalSupportCount} Incidents Need Support`);
    return alerts;
  }, [expiredCount, draftCount, externalSupportCount]);

  const permitsLoadingLabel = permitsLoading ? "Loading…" : "—";
  const incidentsLoadingLabel = incidentsLoading ? "Loading…" : "—";

  const sohiItems: SafetyGridItem[] = [
    {
      key: "sohi-score",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="SOHI Score"
          value={typeof sohiScore === "number" ? `${sohiScore}/10` : incidentsLoading ? "Loading…" : "—"}
          accent="success"
          subtitle="Safety & Operational Health Index"
          progress={typeof sohiScore === "number" ? sohiScore * 10 : undefined}
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
          value={typeof ltir === "number" ? ltir.toFixed(2) : incidentsLoading ? "Loading…" : "—"}
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
          value={typeof permitCompliancePercent === "number" ? `${permitCompliancePercent}%` : "—"}
          accent="error"
          subtitle={
            typeof openCount === "number" && typeof totalPermits === "number" && typeof expiredCount === "number"
              ? `${openCount} open of ${totalPermits} · ${expiredCount} expired`
              : permitsLoading
                ? "Loading…"
                : "Not available"
          }
          progress={typeof permitCompliancePercent === "number" ? permitCompliancePercent : undefined}
          className="h-full"
        />
      ),
    },
    {
      key: "sohi-contradiction",
      layout: { x: 0, y: 3, w: 12, h: 6, minW: 4, minH: 4 },
      content: (
        <div className="rounded-lg bg-brand-light p-4 h-full">
          <div className="text-brand-body-4 font-bold text-brand-text">
            SOHI score vs the number it doesn&apos;t include
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5">
            Composite score looks healthy. Permit compliance underneath it does not.
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-success">
                {typeof sohiScore === "number" ? sohiScore : "—"}
                <span className="text-brand-body-3 text-brand-text-light">/10</span>
              </div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">SOHI score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand">
                {typeof permitCompliancePercent === "number" ? permitCompliancePercent : 0}
                <span className="text-brand-body-3 text-brand-text-light">%</span>
              </div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">
                Permit compliance
              </div>
            </div>
          </div>

          <div className="text-brand-body-5 text-brand mt-3">
            {typeof openCount === "number" &&
            typeof totalPermits === "number" &&
            typeof expiredCount === "number" &&
            typeof sohiScore === "number" &&
            typeof permitCompliancePercent === "number"
              ? `${openCount} of ${totalPermits} permits are open and compliant — ${expiredCount} already expired. A ${sohiScore} composite score next to ${permitCompliancePercent}% permit compliance means the score is not weighting this risk the way the raw number suggests it should.`
              : permitsLoading || incidentsLoading
                ? "Loading permit compliance and SOHI score data…"
                : "Permit compliance and/or SOHI score data not available for this period."}
          </div>
        </div>
      ),
    },
    {
      key: "sohi-incident-trend",
      layout: { x: 0, y: 9, w: 6, h: 6, minW: 4, minH: 4 },
      content: incidentTrendData.length ? (
        <IncidentTrendChartCard
          title="Incident Trend"
          subtitle="Are incidents rising?"
          data={incidentTrendData}
          height={200}
          className="h-full no-drag"
        />
      ) : (
        <EmptyStateCard
          title="Incident Trend"
          subtitle="Are incidents rising?"
          message={incidentsLoading ? "Loading…" : "No incident trend data for this period."}
          className="h-full no-drag"
        />
      ),
    },
    {
      key: "sohi-incident-support",
      layout: { x: 6, y: 9, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg flex flex-col items-center justify-center text-center p-6 h-full">
          <div className="text-4xl font-bold text-brand">
            {typeof externalSupportPercent === "number"
              ? `${externalSupportPercent}%`
              : incidentsLoading
                ? incidentsLoadingLabel
                : "0%"}
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-1 max-w-[240px]">
            {typeof externalSupportCount === "number" && typeof totalIncidents === "number"
              ? `${externalSupportCount} of ${totalIncidents} incidents need external support — the team cannot close these alone`
              : incidentsLoading
                ? "Loading…"
                : "External support data not available for this period."}
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
          value={typeof nearMissRate === "number" ? String(nearMissRate) : incidentsLoadingLabel}
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
          value={typeof incidentsPerMillionSqft === "number" ? incidentsPerMillionSqft.toLocaleString() : incidentsLoadingLabel}
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
          value={typeof ltir === "number" ? ltir.toFixed(2) : incidentsLoadingLabel}
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
          value={typeof safeManHours === "number" ? String(safeManHours) : incidentsLoadingLabel}
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
          {typeof nearMissRate === "number" && typeof incidentsPerMillionSqft === "number"
            ? `${nearMissRate === 0 ? "Zero" : nearMissRate} Near Miss / Good Catch reports alongside ${incidentsPerMillionSqft.toLocaleString()} incidents per million sq ft is a contradiction worth naming: either near-misses genuinely aren't happening (unlikely at this incident rate) or nobody is reporting them — the second explanation is usually the real one, and it means the reporting culture itself needs attention, not just the incidents.`
            : incidentsLoading
              ? "Loading near-miss vs incident-rate data…"
              : "Near-miss / incident-rate data not available for this period."}
        </div>
      ),
    },
    {
      key: "inc-severity",
      layout: { x: 0, y: 6, w: 4, h: 7, minW: 3, minH: 4 },
      content: severityDistData.length ? (
        <PieChartCard
          title="Severity Distribution"
          subtitle="High / Medium / Low"
          data={severityDistData}
          centerLabel={typeof totalIncidents === "number" ? String(totalIncidents) : undefined}
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Severity Distribution"
          subtitle="High / Medium / Low"
          message={incidentsLoading ? "Loading…" : "No severity distribution data for this period."}
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
          value={typeof closureRatePercent === "number" ? `${closureRatePercent}%` : incidentsLoadingLabel}
          accent="warning"
          subtitle={
            typeof closedIncidents === "number" && typeof totalIncidents === "number"
              ? `Closed ÷ Total × 100 — ${closedIncidents} of ${totalIncidents}.${
                  typeof avgResolutionTime === "number"
                    ? ` Avg Resolution Time: ${avgResolutionTime} days${typeof resolutionSampleSize === "number" ? ` (n=${resolutionSampleSize})` : ""}.`
                    : ""
                }`
              : "Closed ÷ Total × 100"
          }
          className="h-full flex flex-col justify-center"
        />
      ),
    },
    {
      key: "inc-rootcause",
      layout: { x: 8, y: 6, w: 4, h: 7, minW: 3, minH: 4 },
      content: rootCauseData.length ? (
        <PieChartCard
          title="Primary Root Cause"
          subtitle="Human · Equipment · Process · Environment"
          data={rootCauseData}
          centerLabel={typeof totalIncidents === "number" ? String(totalIncidents) : undefined}
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Primary Root Cause"
          subtitle="Human · Equipment · Process · Environment"
          message={incidentsLoading ? "Loading…" : "No root-cause breakdown data for this period."}
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
          value={typeof safetyComplianceScore === "number" ? `${safetyComplianceScore}/100` : incidentsLoadingLabel}
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
            {incidentStatusTiles.length ? `${incidentStatusTiles.length} confirmed statuses` : "Status breakdown"} including Final &amp; Provisional closure
          </div>

          {incidentStatusTiles.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {incidentStatusTiles.map((s, index) => (
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
          ) : (
            <div className="text-brand-body-5 text-brand-text-light mb-3">
              {incidentsLoading ? "Loading…" : "No status breakdown data for this period."}
            </div>
          )}

          {typeof externalSupportCount === "number" && (
            <div className="rounded-md bg-brand-error-bg px-3 py-2 text-brand-body-5 font-semibold text-brand-error mb-2">
              {externalSupportCount} incidents require external support
              {typeof externalSupportPercent === "number" ? ` (${externalSupportPercent}%)` : ""}
            </div>
          )}
          {typeof rawRecordCount === "number" && typeof totalIncidents === "number" && rawRecordCount !== totalIncidents && (
            <div className="rounded-md bg-brand-warning-light px-3 py-2 text-brand-body-5 text-[#B8860B] mb-4">
              The incident list itself shows {rawRecordCount} records, not {totalIncidents}. Not resolved here — could
              mean duplicate entries or multi-row incidents. Flagged, not assumed either way.
            </div>
          )}

          <div className="text-brand-body-5 font-semibold text-brand-text-light uppercase tracking-wide mb-2">
            By Category
          </div>
          {incidentCategoryBars.length ? (
            <div className="space-y-2">
              {incidentCategoryBars.map((bar) => (
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
          ) : (
            <div className="text-brand-body-5 text-brand-text-light">
              {incidentsLoading ? "Loading…" : "No category breakdown data for this period."}
            </div>
          )}
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
              <div className="text-2xl font-bold text-brand-error">
                {typeof closureIntegrityPercent === "number" ? `${closureIntegrityPercent}%` : incidentsLoadingLabel}
              </div>
              <div className="text-brand-body-5 text-brand-text-light">
                {typeof closureIntegritySampleSize === "number"
                  ? `of ${closureIntegritySampleSize} closed incidents`
                  : "of closed incidents"}
              </div>
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
      content: quietEscalationData.length ? (
        <BarChartCard
          title="Quiet escalation — repeat Low Risk by location"
          subtitle="One location generating incidents repeatedly, not many unrelated minor events"
          data={quietEscalationData}
          categoryKey="location"
          orientation="horizontal"
          series={[{ dataKey: "count", name: "Incidents" }]}
          insightVariant="plain"
          insight='Low Risk dominates the raw count and gets ignored in favor of rarer severe incidents. A location that keeps generating "Low Risk" incidents over and over is quietly escalating toward something serious — the severity label resets every time, so nobody aggregates it by place.'
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Quiet escalation — repeat Low Risk by location"
          subtitle="One location generating incidents repeatedly, not many unrelated minor events"
          message={incidentsLoading ? "Loading…" : "No repeat-location escalation data for this period."}
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
      content: incidentBodyPartChartData.length && incidentBodyPartKeys.length ? (
        <BarChartCard
          title="Which category hurts which body part"
          subtitle='Turns "we had 12 equipment incidents" into "this equipment is taking hands"'
          data={incidentBodyPartChartData}
          categoryKey="category"
          orientation="horizontal"
          stacked
          series={incidentBodyPartKeys.map((key) => ({ dataKey: key, name: key }))}
          insightVariant="plain"
          insight="If Equipment Failure incidents disproportionately injure Arms, that's a guarding or lockout-tagout gap on specific machinery — a maintenance work order, not a training memo."
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Which category hurts which body part"
          subtitle='Turns "we had 12 equipment incidents" into "this equipment is taking hands"'
          message={incidentsLoading ? "Loading…" : "No category-by-body-part data for this period."}
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
      content: (
        <StatHeroCard
          tone="purple"
          label="Total Permits"
          value={typeof totalPermits === "number" ? String(totalPermits) : permitsLoadingLabel}
          accent="green"
          subtitle="All types"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-open",
      layout: { x: 3, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Open"
          value={typeof openCount === "number" ? String(openCount) : permitsLoadingLabel}
          accent="success"
          subtitle="Active"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-expired",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Expired"
          value={typeof expiredCount === "number" ? String(expiredCount) : permitsLoadingLabel}
          accent="error"
          subtitle="Non-compliant"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-draft",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Draft"
          value={typeof draftCount === "number" ? String(draftCount) : permitsLoadingLabel}
          accent="error"
          subtitle={pctOfTotal(draftCount) ?? "Stuck in draft"}
          className="h-full"
        />
      ),
    },
    {
      key: "permit-approved",
      layout: { x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Approved"
          value={typeof approvedCount === "number" ? String(approvedCount) : permitsLoadingLabel}
          accent="success"
          subtitle="Cleared, awaiting close"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-closed",
      layout: { x: 3, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Closed"
          value={typeof closedCount === "number" ? String(closedCount) : permitsLoadingLabel}
          accent="green"
          subtitle="Completed lifecycle"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-hold",
      layout: { x: 6, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="Hold"
          value={typeof holdCount === "number" ? String(holdCount) : permitsLoadingLabel}
          accent="warning"
          subtitle="Paused mid-process"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-rejected",
      layout: { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Rejected"
          value={typeof rejectedCount === "number" ? String(rejectedCount) : permitsLoadingLabel}
          accent="error"
          subtitle="Denied outright"
          className="h-full"
        />
      ),
    },
    {
      key: "permit-timeline",
      layout: { x: 0, y: 6, w: 12, h: 6, minW: 6, minH: 4 },
      content: permitTimelineData.length ? (
        <PermitTimelineChartCard
          title="Permit age timeline"
          subtitle={
            typeof totalPermits === "number"
              ? `${totalPermits} permits · today line shows how much is already expired vs in progress`
              : "Today line shows how much is already expired vs in progress"
          }
          data={permitTimelineData}
          insight={
            typeof expiredCount === "number" && typeof draftCount === "number" && typeof totalPermits === "number" && totalPermits > 0
              ? `${expiredCount} expired plus ${draftCount} stuck in draft is ${Math.round(((expiredCount + draftCount) / totalPermits) * 100)}% of all permits in some non-compliant state. The exceptions table below lists each by name and age — this chart is what makes the scale obvious before reading it.`
              : undefined
          }
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Permit age timeline"
          subtitle="Today line shows how much is already expired vs in progress"
          message={permitsLoading ? "Loading permit timeline…" : "No permit age timeline data for this period."}
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
          {permitPendingApprovalRows.length ? (
            <div className="space-y-2">
              {permitPendingApprovalRows.map((row) => (
                <div key={row.ref} className="flex items-center justify-between text-brand-body-5">
                  <span className="text-brand-text">
                    {row.ref} · {row.type} · marked &quot;{row.status}&quot;
                  </span>
                  <TableBadge tone="amber">
                    {/pending\s*extend/i.test(row.status) ? "Extension approval still pending" : "Closure approval still pending"}
                  </TableBadge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-brand-body-5 text-brand-text-light">
              {permitsLoading ? "Loading…" : "No permits currently sitting on a pending closure/extension approval."}
            </div>
          )}
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
      content: permitLevelBottleneckData.length ? (
        <BarChartCard
          title="Approval level bottleneck"
          subtitle="Which specific level has the most, and oldest, stuck approvals"
          data={permitLevelBottleneckData}
          categoryKey="level"
          orientation="horizontal"
          categoryColors={PERMIT_LEVEL_COLORS}
          showInfoIcon
          series={[{ dataKey: "count", name: "Stuck Approvals" }]}
          insightVariant="plain"
          insight='If one level accounts for most stuck approvals, that&apos;s not "approvals are slow" — it&apos;s a named role or person to follow up with today, not a vague process complaint.'
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Approval level bottleneck"
          subtitle="Which specific level has the most, and oldest, stuck approvals"
          message={permitsLoading ? "Loading…" : "No approval-level bottleneck data for this period."}
          className="h-full"
        />
      ),
    },
    {
      key: "permit-risk-weighted",
      layout: { x: 0, y: 23, w: 12, h: 6, minW: 6, minH: 4 },
      content: permitRiskWeightedData.length ? (
        <BarChartCard
          title="Expired/draft-stuck permits by risk-weighted type"
          subtitle="Height and Hot Work carry more inherent risk than Cold or Radiology work"
          data={permitRiskWeightedData}
          categoryKey="type"
          orientation="horizontal"
          series={[{ dataKey: "count", name: "Permits" }]}
          insightVariant="plain"
          insight="A handful of expired Height Work permits sitting unactioned is a materially bigger exposure than the same count of expired Cold Work permits — a flat volume bar can't tell the two apart."
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Expired/draft-stuck permits by risk-weighted type"
          subtitle="Height and Hot Work carry more inherent risk than Cold or Radiology work"
          message={permitsLoading ? "Loading…" : "No risk-weighted permit type data for this period."}
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
          {permitRepeatExtensions.length ? (
            <div className="space-y-2">
              {permitRepeatExtensions.map((row, index) => (
                <div key={row.ref ?? row.permit_ref ?? index} className="flex items-center justify-between text-brand-body-5">
                  <span className="text-brand-text">
                    {row.ref ?? row.permit_ref ?? `Permit ${index + 1}`} · {row.type ?? "—"}
                  </span>
                  <TableBadge tone="red">
                    {typeof row.extension_count === "number" ? `Extended ${row.extension_count}×` : "Extended"}
                  </TableBadge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-brand-body-5 text-brand-text-light">
              {permitsLoading ? "Loading…" : "No repeat-extended permits in this period."}
            </div>
          )}
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
            {typeof totalPermits === "number" ? `${totalPermits} total` : "Total"} · Expired → Draft → Active
          </div>
          {permitStatusBars.length ? (
            <div className="space-y-2">
              {permitStatusBars.map((bar) => (
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
          ) : (
            <div className="text-brand-body-5 text-brand-text-light">
              {permitsLoading ? "Loading…" : "No permit status breakdown for this period."}
            </div>
          )}
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
          value={typeof safetyCompliancePercent === "number" ? `${safetyCompliancePercent}%` : permitsLoadingLabel}
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
          value={typeof violationsCount === "number" ? String(violationsCount) : permitsLoadingLabel}
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
      content: permitExceptionRows.length ? (
        <DataTableCard
          title="Permit Exceptions Log"
          subtitle="Which permits need action — Expired → Draft Stuck → Pending Approvals, oldest first in each group"
          columns={PERMIT_EXCEPTION_COLUMNS}
          data={permitExceptionRows}
          getRowKey={(row) => row.ref}
          className="h-full no-drag"
        />
      ) : (
        <EmptyStateCard
          title="Permit Exceptions Log"
          subtitle="Which permits need action — Expired → Draft Stuck → Pending Approvals, oldest first in each group"
          message={permitsLoading ? "Loading permit exceptions…" : "No permit exceptions for this period."}
          className="h-full"
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
      <div className="rounded-lg bg-brand-light px-5 py-4">
        <div className="flex items-center gap-2 text-brand-body-5 font-bold uppercase tracking-wide text-brand mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          Safety Alerts
        </div>
        <div className="flex flex-wrap gap-2">
          {safetyAlerts.map((alert) => (
            <span
              key={alert}
              className="rounded-full bg-white px-3 py-1.5 text-brand-body-5 font-semibold text-brand border border-brand/40"
            >
              {alert}
            </span>
          ))}
        </div>
      </div>

      <div ref={registerRef("SOHI")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetySohiGridLayout" items={sohiItems} responsive />
      </div>

      <div ref={registerRef("Incidents")} className="scroll-mt-24">
        {incidentsLoading && (
          <div className="mb-3 flex items-center gap-2 rounded-md border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light">
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
            Loading incident analytics for the selected sites and date range…
          </div>
        )}
        <SafetyGridSection storageKey="safetyIncidentsGridLayout" items={incidentsItems} responsive />
      </div>

      <div ref={registerRef("Permits")} className="scroll-mt-24">
        {permitsLoading && (
          <div className="mb-3 flex items-center gap-2 rounded-md border border-brand-border bg-white px-3 py-2 text-brand-body-5 text-brand-text-light">
            <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
            Loading permit analytics for the selected sites and date range…
          </div>
        )}
        <SafetyGridSection storageKey="safetyPermitsGridLayout" items={permitsItems} responsive />
      </div>

      <div ref={registerRef("Emergency")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetyEmergencyGridLayout" items={emergencyItems} responsive />
      </div>
    </div>
  );
}
