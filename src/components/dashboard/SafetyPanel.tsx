import { useEffect, useMemo, useRef, useState } from "react";
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
  type StatHeroAccent,
  type StatHeroTone,
} from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BodyInjuryChartCard, { type BodyInjuryChartApiState } from "@/components/incident-analytics/BodyInjuryChartCard";
import { SafetyGridSection, type SafetyGridItem } from "@/components/dashboard/SafetyGridSection";
import type { PermitsDashboardData, IncidentsDashboardData } from "@/hooks/useFmDashboardData";
import incidentAnalyticsAPI, { type BodyInjuryCategoryBodyPartRow } from "@/services/incidentAnalyticsAPI";

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

function normalizePermitTimelineStatus(status: string): string {
  return status.trim() || "Unknown";
}

function permitStatusTone(status: string): TableBadgeTone {
  const s = status.toLowerCase();
  if (s.includes("expired") || s.includes("stuck") || s.includes("reject")) return "red";
  if (s.includes("pending") || s.includes("hold")) return "amber";
  if (s.includes("closed") || s.includes("approved") || s.includes("open") || s.includes("active")) return "green";
  return "grey";
}

const STATUS_TILE_TONES: StatHeroTone[] = ["purple", "teal", "peach", "blue", "purple"];

interface IncidentRow {
  id: string;
  date: string;
  category: string | null;
  level: string;
  status: string;
  description: string;
  rca: string | null;
  assignedTo: string;
  daysOpen: number;
}

const incidentStatusTone = (status: string): "red" | "green" | "grey" => {
  const normalized = status.toLowerCase();
  if (normalized === "open" || normalized === "under_investigation") return "red";
  if (normalized === "closed" || normalized === "final_closure") return "green";
  return "grey";
};

const INCIDENT_COLUMNS: DataTableColumn<IncidentRow>[] = [
  { key: "id", header: "ID", render: (row) => <span className="font-semibold text-brand-text">{row.id}</span> },
  { key: "date", header: "Date", render: (row) => row.date },
  { key: "category", header: "Category", render: (row) => row.category ?? "—" },
  { key: "level", header: "Level", render: (row) => <TableBadge tone="green">{row.level}</TableBadge> },
  {
    key: "status",
    header: "Status",
    render: (row) => <TableBadge tone={incidentStatusTone(row.status)}>{row.status}</TableBadge>,
  },
  { key: "description", header: "Description", render: (row) => row.description },
  { key: "rca", header: "RCA", render: (row) => row.rca ?? "—" },
  { key: "assignedTo", header: "Assigned To", render: (row) => row.assignedTo },
  { key: "daysOpen", header: "Days Open", render: (row) => row.daysOpen },
];

const PERMIT_LEVEL_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756"];
const PERMIT_RISK_COLORS = ["#9EC8BA", "#8E7BE0", "#DA7756", "#DA7756", "#DA7756"];

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

interface SafetyPanelProps {
  activeSection: string;
  siteIds: (number | string)[];
  fromDate: string;
  toDate: string;
  /** Live permits/permit-bottleneck/permit-detail data — null until loaded or if the dashboard's site scope isn't resolved yet. */
  permits: PermitsDashboardData | null;
  permitsLoading: boolean;
  /** Live incidents overview/trend/analysis/hotspots data — null until loaded or if the dashboard's site scope isn't resolved yet. */
  incidents: IncidentsDashboardData | null;
  incidentsLoading: boolean;
}

function parseDashboardDate(value?: string): Date {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function parseDashboardDate(value?: string): Date {
  if (!value) return new Date();
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function SafetyPanel({
  activeSection,
  siteIds,
  fromDate,
  toDate,
  permits,
  permitsLoading,
  incidents,
  incidentsLoading,
  visibleKeys,
}: SafetyPanelProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [bodyInjuryApiState, setBodyInjuryApiState] = useState<BodyInjuryChartApiState>({
    response: null,
    loading: true,
    error: null,
  });
  const selectedSiteIds = siteIds.join(",");
  const shouldLoadBodyInjuryData =
    !visibleKeys || visibleKeys.has("fm-inc-bodyinjury") || visibleKeys.has("fm-inc-bodypart");

  useEffect(() => {
    if (!shouldLoadBodyInjuryData) {
      setBodyInjuryApiState({ response: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setBodyInjuryApiState({ response: null, loading: true, error: null });
    incidentAnalyticsAPI
      .getBodyInjuryChart(parseDashboardDate(fromDate), parseDashboardDate(toDate), selectedSiteIds)
      .then((response) => {
        if (!cancelled) setBodyInjuryApiState({ response, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setBodyInjuryApiState({
            response: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load body injury data",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fromDate, toDate, selectedSiteIds, shouldLoadBodyInjuryData]);

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
  const permitCompliancePercent = permitOverview?.permit_compliance?.percent;
  const permitValidCount = permitOverview?.permit_compliance?.valid_count;
  const permitActiveCount = permitOverview?.permit_compliance?.active_count;
  const permitTimelineTotal = permits?.detail?.age_timeline?.total;
  const permitExceptionCounts = permits?.detail?.exceptions_log?.by_category ?? {};
  const permitExceptionTotal = permits?.detail?.exceptions_log?.total;
  const permitRepeatExtensionTotal = permits?.detail?.repeat_extensions?.total;

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
    const rows = permits?.bottleneck?.approval_level_bottleneck;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        level: row?.level_name?.trim() || "Unknown",
        count: typeof row?.stuck_count === "number" ? row.stuck_count : 0,
        oldestStuckDays: row?.oldest_stuck_days,
      }))
      .map((row) => ({
        ...row,
        level: typeof row.oldestStuckDays === "number" ? `${row.level} · oldest ${row.oldestStuckDays}d` : row.level,
      }))
      .filter((row) => row.count > 0);
  }, [permits]);

  const permitTimelineData: PermitTimelinePoint[] = useMemo(() => {
    const rows = permits?.detail?.age_timeline?.data;
    if (!Array.isArray(rows)) return [];
    const result: PermitTimelinePoint[] = [];
    for (const row of rows) {
      if (!row || typeof row.age_days !== "number" || typeof row.status !== "string") continue;
      result.push({ daysAgo: row.age_days, status: normalizePermitTimelineStatus(row.status) });
    }
    return result;
  }, [permits]);

  const permitExceptionRows: PermitExceptionTableRow[] = useMemo(() => {
    const rows = permits?.detail?.exceptions_log?.data;
    if (!Array.isArray(rows)) return [];
    return rows.map((row, index) => ({
      ref: row?.reference_number ?? `Permit ${index + 1}`,
      type: row?.permit_type ?? "—",
      dateLabel: row?.expiry_date ?? row?.raised_date ?? "—",
      daysOpen: typeof row?.days_open === "number" ? `${row.days_open}d` : "—",
      status: row?.exception_category ?? row?.status ?? "—",
    }));
  }, [permits]);

  const permitClosureApprovalRows = useMemo(
    () => permitExceptionRows.filter((row) => /pending\s+(closure|extend)/i.test(row.status)),
    [permitExceptionRows]
  );

  const permitRepeatExtensions = useMemo(() => {
    const rows = permits?.detail?.repeat_extensions?.data;
    return Array.isArray(rows) ? rows : [];
  }, [permits]);

  // --- Incidents (live) ---
  const incidentKpis = incidents?.kpis ?? null;
  const incidentStatus = incidents?.hotspots?.status_breakdown ?? null;
  const totalIncidents = incidentStatus?.total;
  const openIncidents = incidentStatus?.open;
  const underInvestigationIncidents = incidentStatus?.under_investigation;
  const pendingIncidents = incidentStatus?.pending;
  const closedIncidents = incidentStatus?.closed;
  const finalClosureIncidents = incidentStatus?.final_closure;
  const provisionalClosureIncidents = incidentStatus?.provisional_closure;
  const zeroIncidentDays = incidentKpis?.zero_incident_days;
  const incidentsPerMillionSqft = incidentKpis?.incident_rate.area ? incidentKpis.incident_rate.rate : undefined;
  const externalSupport = incidents?.trend?.external_support;

  const incidentTrendData: IncidentTrendDatum[] = useMemo(() => {
    const rows = incidents?.trend?.monthly_trend;
    if (!Array.isArray(rows)) return [];
    const result: IncidentTrendDatum[] = [];
    for (const row of rows) {
      if (row && typeof row.month === "string" && typeof row.incident_count === "number") {
        result.push({ month: row.month, incidents: row.incident_count });
      }
    }
    return result;
  }, [incidents]);

  const incidentAnalysis = incidents?.analysis ?? null;

  const severityDistData = useMemo(() => {
    const breakdown = incidents?.hotspots?.severity_distribution;
    if (!breakdown) return [];
    return Object.entries(breakdown)
      .map(([severity, value]) => ({ name: severity === "unknown" ? "Unknown" : `Level ${severity}`, value }))
      .filter((row) => row.value > 0);
  }, [incidents]);

  const rootCauseData = useMemo(() => {
    const rows = incidentAnalysis?.root_cause_breakdown;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        name: row?.root_cause ?? "Unknown",
        value: typeof row?.count === "number" ? row.count : 0,
      }))
      .filter((row) => row.value > 0);
  }, [incidentAnalysis]);

  const closureRatePercent = incidentAnalysis?.closure_rate_percent;
  const avgResolutionTime = incidentAnalysis?.avg_resolution_time?.days;
  const resolutionSampleSize = incidentAnalysis?.avg_resolution_time?.sample_size;
  const closedIncidentQuality = incidentAnalysis?.closed_incident_quality;
  const incidentAnalysisPercent =
    typeof incidentAnalysis?.percent === "number" ? incidentAnalysis.percent : closedIncidentQuality?.percent;
  const safetyComplianceScore = incidentAnalysis?.safety_compliance_score;

  const incidentHotspots = incidents?.hotspots ?? null;

  const quietEscalationData = useMemo(() => {
    const rows = incidentHotspots?.quiet_escalation_by_location?.data;
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => ({
        location: row?.location ?? "Unknown",
        count: typeof row?.low_risk_count === "number" ? row.low_risk_count : 0,
      }))
      .filter((row) => row.count > 0);
  }, [incidentHotspots]);

  const incidentRows: IncidentRow[] = (incidentHotspots?.incidents_requiring_action ?? []).map((row) => ({
    id: String(row.incident_id),
    date: row.date,
    category: row.category,
    level: row.level,
    status: row.status,
    description: row.description,
    rca: row.rca,
    assignedTo: row.assigned_to,
    daysOpen: row.days_open,
  }));
  const incidentBodyPartRows = incidentHotspots?.by_body_part ?? [];
  const incidentBodyPartKeys = Array.from(
    new Set(
      incidentBodyPartRows.flatMap((row) =>
        Object.keys(row).filter((key) => key !== "category" && key !== "name" && typeof row[key] === "number")
      )
    )
  );
  const incidentBodyPartChartData: Record<string, string | number>[] = incidentBodyPartRows.map((row) => {
    const mapped: Record<string, string | number> = {
      category: row.category ?? row.name ?? "Unknown",
    };
    incidentBodyPartKeys.forEach((key) => {
      const count = row[key];
      if (typeof count === "number") mapped[key] = count;
    });
    return mapped;
  });
  const bodyInjuryCategoryRows =
    bodyInjuryApiState.response?.category_body_part_breakdown?.data ??
    bodyInjuryApiState.response?.data?.category_body_part_breakdown?.data ??
    [];
  const mappedBodyPartChart = useMemo(() => {
    const categories = new Map<string, Record<string, string | number>>();
    const bodyParts = new Set<string>();

    (bodyInjuryCategoryRows ?? []).forEach((row) => {
      const count = Number(row.injury_count);
      if (!Number.isFinite(count) || count <= 0) return;

      const category = row.category?.trim() || "Unknown";
      const bodyPart = row.body_part?.trim() || "Unknown";
      const categoryRow = categories.get(category) ?? { category };
      categoryRow[bodyPart] = Number(categoryRow[bodyPart] ?? 0) + count;
      categories.set(category, categoryRow);
      bodyParts.add(bodyPart);
    });

    return { data: Array.from(categories.values()), keys: Array.from(bodyParts) };
  }, [bodyInjuryCategoryRows]);
  const bodyPartChartData = mappedBodyPartChart.data.length
    ? mappedBodyPartChart.data
    : incidentBodyPartChartData;
  const bodyPartChartKeys = mappedBodyPartChart.keys.length
    ? mappedBodyPartChart.keys
    : incidentBodyPartKeys;

  const incidentStatusTiles = useMemo(() => {
    if (!incidentStatus) return [];
    const entries: { label: string; value: number; color: string }[] = [
      { label: "Open", value: openIncidents ?? NaN, color: "text-brand-error" },
      { label: "Under Invest.", value: underInvestigationIncidents ?? NaN, color: "text-[#8A5A00]" },
      { label: "Pending", value: pendingIncidents ?? NaN, color: "text-[#8A5A00]" },
      { label: "Closed", value: closedIncidents ?? NaN, color: "text-brand-success" },
      { label: "Final Closure", value: finalClosureIncidents ?? NaN, color: "text-brand-success" },
      { label: "Prov. Closure", value: provisionalClosureIncidents ?? NaN, color: "text-brand-green" },
      { label: "Other", value: incidentStatus.other ?? NaN, color: "text-brand-text-light" },
    ].filter((entry) => typeof entry.value === "number" && !Number.isNaN(entry.value));
    if (typeof totalIncidents === "number") entries.push({ label: "Total", value: totalIncidents, accent: "neutral" });
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
    if (typeof externalSupport?.count === "number") alerts.push(`${externalSupport.count} Incidents Need Support`);
    return alerts;
  }, [expiredCount, draftCount, externalSupport]);

  const permitsLoadingLabel = permitsLoading ? "Loading…" : "—";
  const incidentsLoadingLabel = incidentsLoading ? "Loading…" : "—";

  const sohiItems: SafetyGridItem[] = [
    /* SOHI Score is hidden until its inputs and formula are backed by captured data.
    {
      key: "sohi-score",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Safety Compliance Score"
          value={typeof safetyComplianceScore === "number" ? String(safetyComplianceScore) : incidentsLoadingLabel}
          accent="success"
          subtitle="Composite score reported by the incidents API"
          className="h-full"
        />
      ),
    },
    */
    {
      key: "sohi-zero",
      layout: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Zero Incident Days"
          value={typeof zeroIncidentDays === "number" ? String(zeroIncidentDays) : incidentsLoadingLabel}
          accent="success"
          subtitle="Days since most recent incident"
          className="h-full"
        />
      ),
    },
    /* LTIR is hidden until lost-time injury data is captured.
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
    */
    {
      key: "sohi-permit",
      layout: { x: 4, y: 0, w: 4, h: 3, minW: 2, minH: 3 },
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
      layout: { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <div className="rounded-xl bg-[var(--color-bg)] p-4 h-full">
          <div className="text-brand-body-4 font-bold text-brand-text-light">
            Safety compliance snapshot
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5">
            Composite incident score for the selected scope
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-text">
                {typeof safetyComplianceScore === "number" ? safetyComplianceScore : "—"}
              </div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">Safety compliance score</div>
            </div>
          </div>

          <div className="text-brand-body-5 text-brand-text-light mt-3">
            {typeof safetyComplianceScore === "number"
              ? `Safety compliance score: ${safetyComplianceScore}.`
              : incidentsLoading
                ? "Loading safety compliance data…"
                : "Safety compliance data is not available for this period."}
          </div>
        </div>
      ),
    },
    {
      key: "sohi-incident-trend",
      layout: { x: 0, y: 3, w: 6, h: 6, minW: 4, minH: 4 },
      content: incidentTrendData.length ? (
        <IncidentTrendChartCard
          title="Incident Trend"
          subtitle="Monthly incident counts for the selected period"
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
      layout: { x: 6, y: 3, w: 6, h: 6, minW: 4, minH: 4 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg flex flex-col p-5 h-full">
          <div className="pr-10">
            <div className="text-brand-body-3 font-bold text-brand-text">External support required</div>
            <div className="text-brand-body-5 text-brand-text-light mt-0.5">
              Share of incidents that needed outside help
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold text-brand">
            {typeof externalSupport?.percent === "number"
              ? `${externalSupport.percent}%`
              : incidentsLoading
                ? incidentsLoadingLabel
                : "—"}
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-1 max-w-[240px]">
            {typeof externalSupport?.count === "number" && typeof externalSupport.total === "number"
              ? `${externalSupport.count} of ${externalSupport.total} incidents need external support`
              : incidentsLoading
                ? "Loading…"
                : "External support data not available for this period."}
          </div>
          {typeof externalSupport?.percent === "number" && (
            <div className="mt-4 h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, externalSupport.percent))}%`, backgroundColor: "#F2A312" }}
              />
            </div>
          )}
          </div>
        </div>
      ),
    },
  ];

  const incidentsItems: SafetyGridItem[] = [
    {
      key: "inc-total",
      layout: { x: 0, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Total Incidents"
          value={typeof totalIncidents === "number" ? String(totalIncidents) : incidentsLoadingLabel}
          accent="warning"
          subtitle="For selected sites and period"
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
          value={typeof incidentsPerMillionSqft === "number" ? incidentsPerMillionSqft.toLocaleString() : "—"}
          accent="error"
          subtitle={incidentKpis?.incident_rate.area ? "Normalized by site area" : "Site area unavailable"}
          className="h-full"
        />
      ),
    },
    /* LTIR is hidden until lost-time injury data is captured.
    {
      key: "inc-ltir2",
      layout: { x: 6, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="peach"
          label="LTIR"
          value="—"
          accent="success"
          subtitle={
            "Lost Time Injury Rate"
          }
          className="h-full"
        />
      ),
    },
    */
    {
      key: "inc-action-count",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="blue"
          label="Incidents Requiring Action"
          value={typeof incidentHotspots?.incidents_requiring_action_count === "number"
            ? String(incidentHotspots.incidents_requiring_action_count)
            : incidentsLoadingLabel}
          accent="info"
          subtitle="Open incidents with an assignee"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-severity",
      layout: { x: 0, y: 3, w: 4, h: 7, minW: 3, minH: 4 },
      content: severityDistData.length ? (
        <PieChartCard
          title="Severity Distribution"
          subtitle="API severity levels; numeric tier meanings are not specified"
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
      layout: { x: 4, y: 3, w: 4, h: 7, minW: 3, minH: 4 },
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
      layout: { x: 8, y: 3, w: 4, h: 7, minW: 3, minH: 4 },
      content: rootCauseData.length ? (
        <PieChartCard
          title="Primary Root Cause"
          subtitle="Root-cause counts reported by the API"
          data={rootCauseData}
          centerLabel={typeof totalIncidents === "number" ? String(totalIncidents) : undefined}
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Primary Root Cause"
          subtitle="Root-cause counts reported by the API"
          message={incidentsLoading ? "Loading…" : "No root-cause breakdown data for this period."}
          className="h-full"
        />
      ),
    },
    {
      key: "inc-rootnote",
      layout: { x: 0, y: 10, w: 12, h: 2, minW: 4, minH: 2, isResizable: false, isDraggable: false },
      content: (
        <p className="text-brand-body-5 text-brand-text-light">
          Root-cause counts show the reasons recorded for incidents in the selected scope.
        </p>
      ),
    },
    {
      key: "inc-compliance",
      layout: { x: 9, y: 0, w: 3, h: 3, minW: 2, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Safety Compliance Score"
          value={typeof safetyComplianceScore === "number" ? String(safetyComplianceScore) : incidentsLoadingLabel}
          accent="warning"
          subtitle="Composite score reported by the API"
          className="h-full"
        />
      ),
    },
    {
      key: "inc-status-breakdown",
      layout: { x: 0, y: 12, w: 12, h: 9, minW: 6, minH: 6 },
      content: (
        <div className="bg-white border border-brand-border rounded-lg p-5 h-full overflow-auto">
          <div className="text-brand-body-3 font-bold text-brand-text">Incident Status Breakdown</div>
          <div className="text-brand-body-5 text-brand-text-light mb-3">
            {incidentStatusTiles.length ? `${incidentStatusTiles.length} confirmed statuses` : "Status breakdown"} including Final &amp; Provisional closure
          </div>

          {incidentStatusTiles.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {incidentStatusTiles.map((s, index) => (
                <StatHeroCard
                  key={s.label}
                  tone={STATUS_TILE_TONES[index % STATUS_TILE_TONES.length]}
                  label={s.label}
                  value={String(s.value)}
                  accent={s.accent}
                  className="status-tile"
                />
              ))}
            </div>
          ) : (
            <div className="text-brand-body-5 text-brand-text-light mb-3">
              {incidentsLoading ? "Loading…" : "No status breakdown data for this period."}
            </div>
          )}

          {typeof externalSupport?.count === "number" && (
            <div className="rounded-md bg-brand-error-bg px-3 py-2 text-brand-body-5 font-semibold text-brand-error mb-2">
              {externalSupport.count} incidents require external support
              {typeof externalSupport.percent === "number" ? ` (${externalSupport.percent}%)` : ""}
            </div>
          )}

          <div className="text-brand-body-5 font-semibold text-brand-text-light uppercase tracking-wide mb-2">
            Category breakdown
          </div>
          <div className="text-brand-body-5 text-brand-text-light">
            Category breakdown is not provided by the configured Safety dashboard endpoints.
          </div>
        </div>
      ),
    },
    {
      key: "inc-closure-integrity",
      layout: { x: 0, y: 21, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        <div className="bg-[var(--color-surface)] rounded-lg p-4 h-full overflow-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-brand-body-4 font-bold text-brand-text">Closed incident quality</div>
              <div className="text-brand-body-5 text-brand-text-light mt-0.5">
                    Closed incidents meeting the API&apos;s quality criteria
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4 mr-10">
              <div className="text-2xl font-bold text-brand-error">
                {typeof closedIncidentQuality?.percent === "number" ? `${closedIncidentQuality.percent}%` : incidentsLoadingLabel}
              </div>
              <div className="text-brand-body-5 text-brand-text-light">
                {typeof closedIncidentQuality?.total_closed === "number"
                  ? `${closedIncidentQuality.qualifying_count} of ${closedIncidentQuality.total_closed} closed incidents`
                  : "of closed incidents"}
              </div>
            </div>
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-2">
            This percentage and qualifying count are reported by the incidents analysis API.
          </div>
        </div>
      ),
    },
    {
      key: "inc-quiet-escalation",
      layout: { x: 0, y: 25, w: 12, h: 6, minW: 6, minH: 4 },
      content: quietEscalationData.length ? (
        <BarChartCard
          title="Quiet escalation — repeat Low Risk by location"
          subtitle={`Low-risk incidents by location${typeof incidentHotspots?.quiet_escalation_by_location?.location_coverage_count === "number" ? ` · ${incidentHotspots.quiet_escalation_by_location.location_coverage_count} locations covered` : ""}`}
          data={quietEscalationData}
          categoryKey="location"
          orientation="horizontal"
          categoryColors={["#9EC8BA", "#8E7BE0", "#DA7756", "#DA7756", "#DA7756"]}
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
      content: incidentRows.length ? (
        <DataTableCard
          title="Incidents Requiring Action"
          subtitle="Open incidents with an assignee, as reported by the API"
          columns={INCIDENT_COLUMNS}
          data={incidentRows}
          getRowKey={(row) => row.id}
          className="h-full no-drag"
        />
      ) : (
        <EmptyStateCard
          title="Incidents Requiring Action"
          subtitle="Open incidents with an assignee, as reported by the API"
          message={incidentsLoading ? "Loading…" : "No incidents requiring action for this period."}
          className="h-full"
        />
      ),
    },
    {
      key: "inc-bodypart",
      layout: { x: 0, y: 45, w: 12, h: 6, minW: 6, minH: 4 },
      content: bodyPartChartData.length && bodyPartChartKeys.length ? (
        <BarChartCard
          title="Which category hurts which body part"
          subtitle="Injury counts by reported incident category and body part"
          data={bodyPartChartData}
          categoryKey="category"
          orientation="horizontal"
          stacked
          series={bodyPartChartKeys.map((key) => ({ dataKey: key, name: key }))}
          className="h-full"
        />
      ) : (
        <EmptyStateCard
          title="Which category hurts which body part"
          subtitle="Injury counts by reported incident category and body part"
          message={
            incidentsLoading || bodyInjuryApiState.loading
              ? "Loading…"
              : bodyInjuryApiState.error
                ? "Unable to load category-by-body-part data."
                : "No category-by-body-part data for this period."
          }
          className="h-full"
        />
      ),
    },
    {
      key: "inc-bodyinjury",
      layout: { x: 0, y: 51, w: 12, h: 9, minW: 6, minH: 6 },
      content: (
        <BodyInjuryChartCard
          startDate={fromDate}
          endDate={toDate}
          siteIds={selectedSiteIds}
          apiState={bodyInjuryApiState}
        />
      ),
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
            typeof permitTimelineTotal === "number"
              ? `${permitTimelineTotal} permits · age plotted against status`
              : "Permit age plotted against status"
          }
          data={permitTimelineData}
          height={150}
          insight={
            typeof expiredCount === "number" && typeof draftCount === "number" && typeof totalPermits === "number" && totalPermits > 0
              ? `${expiredCount} expired plus ${draftCount} stuck in draft is ${Math.round(((expiredCount + draftCount) / totalPermits) * 100)}% of all permits in some non-compliant state. The exceptions table below lists each by name and age — this chart is what makes the scale obvious before reading it.`
              : undefined
          }
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
        <div className="h-full overflow-auto rounded-lg border border-brand-border border-l-4 border-l-brand-error bg-[var(--color-surface)] p-4">
          <div className="text-brand-body-4 font-bold text-brand-text">
            Is &quot;Closed&quot; actually closed?
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5 mb-3">
            Permits marked Closed or Extended, crossed against their own approval status
          </div>
          {permitClosureApprovalRows.length ? (
            <div>
              {permitClosureApprovalRows.map((row) => {
                const isClosure = /closure/i.test(row.status);
                return (
                  <div
                    key={row.ref}
                    className="flex items-center justify-between gap-4 border-b border-brand-border py-2 text-brand-body-5 last:border-b-0"
                  >
                    <span className={cn("min-w-0", isClosure ? "text-brand-error" : "text-brand-text")}>
                      {row.ref} · {row.type} · marked &quot;{row.status}&quot;
                    </span>
                    <TableBadge tone="amber">
                      {isClosure ? "Closure approval still pending" : "Extension approval still pending"}
                    </TableBadge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-brand-body-5 text-brand-text-light">
              {permitsLoading ? "Loading…" : "No pending closure or extension approvals."}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-brand-border pt-3 text-brand-body-5">
            <span className="text-brand-text-light">Incident analysis percent</span>
            <span className="font-semibold text-brand-text">
              {typeof incidentAnalysisPercent === "number"
                ? `${incidentAnalysisPercent}%`
                : incidentsLoading
                  ? "Loading…"
                  : "—"}
            </span>
          </div>
          <div className="text-brand-body-5 text-brand-text-light mt-3">
            A permit whose closure approval is still sitting pending isn&apos;t actually closed — it&apos;s a
            status field that moved ahead of the paperwork. This connects the permit list to the separate
            Pending Approvals queue instead of treating them as two unrelated pages.
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
    /* Risk-weighted permit types are hidden until the required risk data is captured.
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
          categoryColors={PERMIT_RISK_COLORS}
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
    */
    {
      key: "permit-repeat-extensions",
      layout: { x: 0, y: 29, w: 12, h: 4, minW: 6, minH: 3 },
      content: (
        <div className="bg-[var(--color-surface)] rounded-lg p-4 h-full overflow-auto">
          <div className="text-brand-body-4 font-bold text-brand-text">Repeat extensions</div>
          <div className="text-brand-body-5 text-brand-text-light mt-0.5 mb-3">
            {typeof permitRepeatExtensionTotal === "number"
              ? `${permitRepeatExtensionTotal} permits returned by the API with multiple extensions`
              : "Permits with multiple extensions"}
          </div>
          {permitRepeatExtensions.length ? (
            <div className="space-y-2">
              {permitRepeatExtensions.map((row, index) => (
                <div key={row.pms_permit_id ?? index} className="flex items-center justify-between text-brand-body-5">
                  <span className="text-brand-text">
                    {row.reference_number ?? `Permit ${index + 1}`} · {row.permit_type ?? "—"}
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
    /* Permit-wise Safety Compliance % is hidden until its required data is captured.
    {
      key: "permit-compliance",
      layout: { x: 0, y: 39, w: 6, h: 4, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="purple"
          label="Permit-wise Safety Compliance %"
          value={typeof safetyCompliancePercent === "number" ? `${safetyCompliancePercent}%` : permitsLoadingLabel}
          accent="warning"
          subtitle={typeof activePermitsChecked === "number" ? `${activePermitsChecked} active permits checked` : "API-reported safety compliance"}
          className="h-full"
        />
      ),
    },
    */
    /* Permit violations / non-compliance is hidden until the required data is captured.
    {
      key: "permit-violations",
      layout: { x: 6, y: 39, w: 6, h: 4, minW: 3, minH: 3 },
      content: (
        <StatHeroCard
          tone="teal"
          label="Permit Violations / Non-Compliance"
          value={typeof violationsCount === "number" ? String(violationsCount) : permitsLoadingLabel}
          accent="error"
          subtitle="API-reported permit violation count"
          className="h-full"
        />
      ),
    },
    */
    {
      key: "permit-note",
      layout: { x: 0, y: 43, w: 12, h: 2, minW: 6, minH: 2 },
      content: (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(permitExceptionCounts).map(([category, count]) => (
            <TableBadge key={category} tone="grey">{category}: {count}</TableBadge>
          ))}
          {typeof permitExceptionTotal === "number" && (
            <TableBadge tone="grey">Total exceptions: {permitExceptionTotal}</TableBadge>
          )}
          {typeof permitValidCount === "number" && typeof permitActiveCount === "number" && (
            <span className="text-brand-body-5 text-brand-text-light">
              Permit compliance counts: {permitValidCount} valid of {permitActiveCount} active.
            </span>
          )}
        </div>
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

  /* Fire & Emergency Compliance is hidden until its API data is available.
  const emergencyItems: SafetyGridItem[] = [
    {
      key: "emergency-fire",
      layout: { x: 0, y: 0, w: 12, h: 9, minW: 6, minH: 5 },
      content: (
        <EmptyStateCard
          title="Fire & Emergency Compliance"
          subtitle="No fire or emergency-compliance endpoint is included in the supplied Safety API reference."
          message="Data unavailable from the configured Safety dashboard APIs."
          className="h-full"
        />
      ),
    },
  ];
  */

  return (
    <div className="space-y-4">
      {/* Safety Alerts strip */}
      <div className="veda-alert-strip rounded-lg bg-brand-light px-5 py-4">
        <div className="veda-alert-title flex items-center gap-2 text-brand-body-5 font-bold uppercase tracking-wide text-brand mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          Safety Alerts
        </div>
        <div className="flex flex-wrap gap-2">
          {safetyAlerts.map((alert) => (
            <span
              key={alert}
              className="veda-alert-pill rounded-full bg-white px-3 py-1.5 text-brand-body-5 font-semibold text-brand border border-brand/40"
            >
              {alert}
            </span>
          ))}
        </div>
      </div>

      <div ref={registerRef("SOHI")} className={cn("scroll-mt-24", (incidentsLoading || permitsLoading) && "veda-loading")}>
        <SafetyGridSection
          storageKey="safetySohiGridLayout-v2"
          items={sohiItems}
          layoutOverrides={{ "sohi-contradiction": { x: 9, y: 3, w: 3, h: 3, minW: 2, minH: 3 } }}
          responsive
          moduleKey="safety"
          subTab="SOHI"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Incidents")} className={cn("scroll-mt-24", incidentsLoading && "veda-loading")}>
        <SafetyGridSection
          storageKey="safetyIncidentsGridLayout-v2"
          items={incidentsItems}
          responsive
          moduleKey="safety"
          subTab="Incidents"
          visibleKeys={visibleKeys}
        />
      </div>

      <div ref={registerRef("Permits")} className={cn("scroll-mt-24", permitsLoading && "veda-loading")}>
        <SafetyGridSection
          storageKey="safetyPermitsGridLayout"
          items={permitsItems}
          responsive
          moduleKey="safety"
          subTab="Permits"
          visibleKeys={visibleKeys}
        />
      </div>

      {/* Fire & Emergency Compliance KPI section is not currently data-backed.
      <div ref={registerRef("Emergency")} className="scroll-mt-24">
        <SafetyGridSection storageKey="safetyEmergencyGridLayout" items={emergencyItems} />
      </div>
      */}
    </div>
  );
}
