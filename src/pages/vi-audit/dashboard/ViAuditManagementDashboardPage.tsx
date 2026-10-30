import { useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AuditOverview } from "../../../components/vi-audit/management-dashboard/AuditOverview";
import { AuditsPanel } from "../../../components/vi-audit/management-dashboard/AuditsPanel";
import { CapaPanel } from "../../../components/vi-audit/management-dashboard/CapaPanel";
import { DrillDrawer } from "../../../components/vi-audit/management-dashboard/DrillDrawer";
import { FilterBar } from "../../../components/vi-audit/management-dashboard/FilterBar";
import { ToastHost } from "../../../components/vi-audit/management-dashboard/InfoButton";
import { ObservationsPanel } from "../../../components/vi-audit/management-dashboard/ObservationsPanel";
import { ShellBanner } from "../../../components/vi-audit/management-dashboard/ShellBanner";
import { TopBar } from "../../../components/vi-audit/management-dashboard/TopBar";
import "../../../components/vi-audit/management-dashboard/auditDashboard.css";
import { SCOPES, type DrillModel, type ModuleKey, type Persona } from "../../../components/vi-audit/management-dashboard/data";
import {
  buildCharts,
  useAuditDashboardData,
  useAuditFilterOptions,
  useRecentAudits,
  type AuditDashboardFilters,
  type ClosureRow,
  type PastTargetPlan,
  type RecentAudit,
} from "../../../components/vi-audit/management-dashboard/viAuditDashboardApi";

interface ToastItem {
  id: number;
  message: string;
}

const isoDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Default period: the current month up to today.
const defaultFilters = (): AuditDashboardFilters => {
  const today = new Date();
  return {
    clusterIds: [],
    functionIds: [],
    zoneIds: [],
    workLocationIds: [],
    auditTypeIds: [],
    dateFrom: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    dateTo: isoDate(today),
  };
};

const recentDrill = (audit: RecentAudit): DrillModel => ({
  crumb: `Audits › ${audit.audit_id}`,
  title: `${audit.audit_id} · ${audit.audit_type}`,
  blocks: [
    { kind: "stats", items: [[String(audit.observations), "Observations"], [String(audit.capa_closed), "CAPA closed"], [audit.status || "—", "Status"]] },
    { kind: "heading", text: "Audit details" },
    {
      kind: "table",
      headers: ["Field", "Value"],
      rows: [
        ["Circle", audit.circle],
        ["Function", audit.function_name],
        ["Work Location", audit.audit_location],
        ["Auditor", audit.auditor],
        ["Email", audit.email],
        ["Mobile", audit.mobile],
        ["Submitted", audit.submitted_on],
        ["CAPA", String(audit.capa_count)],
        ["CAPA pending", String(audit.capa_pending)],
      ],
    },
  ],
});

const closureDrill = (row: ClosureRow): DrillModel => ({
  crumb: "Overview › Closure progress",
  title: `${row.circle} · closure by stage`,
  blocks: [{
    kind: "table",
    headers: ["Stage", "% complete"],
    rows: [
      ["Audit Closed", `${Math.round(row.audit_closed)}%`],
      ["Plan Created", `${Math.round(row.action_plan_created)}%`],
      ["Action Taken", `${Math.round(row.action_taken)}%`],
      ["On-time", `${Math.round(row.ontime_capa)}%`],
      ["Delayed CAPA", `${Math.round(row.delayed_capa)}%`],
    ],
  }],
});

const planDrill = (plan: PastTargetPlan): DrillModel => ({
  crumb: "CAPA › Plans past target date",
  title: `${plan.plan} · ${plan.audit}`,
  blocks: [{
    kind: "table",
    headers: ["Field", "Value"],
    rows: [
      ["Observation", plan.observation],
      ["Action Owner", plan.action_owner],
      ["Target date", plan.target_date],
      ["Days over", plan.days_over],
      ["Status", plan.status],
    ],
  }],
});

export function ViAuditManagementDashboardPage() {
  const [persona, setPersona] = useState<Persona>("admin");
  const [module] = useState<ModuleKey>("audit");
  const [filters, setFilters] = useState<AuditDashboardFilters>(defaultFilters);
  const [applied, setApplied] = useState<AuditDashboardFilters>(filters);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [drill, setDrill] = useState<DrillModel | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [recentSearch, setRecentSearch] = useState("");
  const debouncedRecentSearch = useDebounce(recentSearch, 400);
  const toastId = useRef(0);
  const highlightTimer = useRef<number | null>(null);
  const options = useAuditFilterOptions();
  // Circle Manager only loads after a circle is applied; Pan India loads for all circles.
  const sectionReady = persona === "admin" || applied.clusterIds.length > 0;
  const dashboard = useAuditDashboardData(applied, sectionReady);
  const recentAudits = useRecentAudits(applied, debouncedRecentSearch, sectionReady);
  const charts = buildCharts(dashboard);

  const scope = SCOPES[persona];

  const notify = (message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  };

  const update = <K extends keyof AuditDashboardFilters>(key: K) => (value: AuditDashboardFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const scopeLabel = (list: { id: string; name: string }[], ids: string[], singular: string, plural: string) =>
    ids.length === 0 ? "" : ids.length === 1 ? `${list.find((item) => item.id === ids[0])?.name ?? ""} ${singular}` : `${ids.length} ${plural}`;
  const circleLabel = scopeLabel(options.circles, applied.clusterIds, "Circle", "Circles");
  const zoneLabel = scopeLabel(options.zones, applied.zoneIds, "Zone", "Zones");
  const title =
    persona === "admin"
      ? `Audit · Pan India View${zoneLabel ? ` · ${zoneLabel}` : ""}`
      : `Audit · ${circleLabel || "Circle Manager View"}${zoneLabel ? ` · ${zoneLabel}` : ""}`;

  const switchPersona = (next: Persona) => {
    setPersona(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (next === "admin") {
      // Pan India section: clear circle filters and reload nationwide.
      const nextFilters = { ...filters, clusterIds: [] as string[] };
      setFilters(nextFilters);
      setApplied({ ...applied, clusterIds: [] });
      return;
    }
    // Circle Manager section: wait for a circle selection + Apply before loading.
    setFilters((current) => ({ ...current, clusterIds: [] }));
    setApplied((current) => ({ ...current, clusterIds: [] }));
  };

  const jumpTo = (panel: string, group: string) => {
    setActiveGroup(group);
    setHighlight(panel);
    document.getElementById(panel)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlight(null), 1600);
  };

  const apply = () => {
    if (!filters.dateFrom || !filters.dateTo) {
      notify("Select the audit date range");
      return;
    }
    if (filters.dateFrom > filters.dateTo) {
      notify("Audit Date From must be before Audit Date To");
      return;
    }
    if (persona === "circle" && filters.clusterIds.length === 0) {
      notify("Select a circle");
      return;
    }
    setApplied(filters);
  };

  const { kpi, loading } = dashboard;

  return (
    <div className="vad">
      <ShellBanner />
      <TopBar persona={persona} module={module} role={scope.role} onPersona={switchPersona} onModule={() => undefined} />
      <FilterBar
        persona={persona}
        options={options}
        circles={filters.clusterIds}
        functions={filters.functionIds}
        zones={filters.zoneIds}
        workLocations={filters.workLocationIds}
        auditTypes={filters.auditTypeIds}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onCircles={update("clusterIds")}
        onFunctions={update("functionIds")}
        onZones={update("zoneIds")}
        onWorkLocations={update("workLocationIds")}
        onAuditTypes={update("auditTypeIds")}
        onDateFrom={update("dateFrom")}
        onDateTo={update("dateTo")}
        onApply={apply}
        onReset={() => {
          const next = defaultFilters();
          setFilters(next);
          setApplied(next);
        }}
      />

      <main className="content module-content active">
        <div className="page-hd">
          <div>
            <h2>{title}</h2>
            {persona === "circle" && !sectionReady && (
              <div className="sub">Select a circle and click Apply to open the Circle Manager dashboard</div>
            )}
          </div>
        </div>
        {!sectionReady ? (
          <div className="card" style={{ padding: "36px 24px", textAlign: "center" }}>
            <div className="card-title">Circle Manager</div>
            <div className="card-sub" style={{ marginTop: 8 }}>
              Pick one or more circles in the filter bar, then Apply to load that circle’s audit snapshot, charts and CAPA lists.
            </div>
          </div>
        ) : (
          <>
            <AuditOverview
              kpi={kpi}
              closure={dashboard.closure}
              loading={loading}
              activeGroup={activeGroup}
              onJump={jumpTo}
              onCircle={(row) => setDrill(closureDrill(row))}
            />
            <AuditsPanel
              highlighted={highlight === "acc-audits"}
              loading={loading}
              auditFunc={charts.auditFunc}
              auditCircle={charts.auditCircle}
              recent={recentAudits.audits}
              recentTotal={recentAudits.total}
              recentLoading={recentAudits.loading}
              recentSearch={recentSearch}
              onRecentSearchChange={setRecentSearch}
              onAudit={(audit) => setDrill(recentDrill(audit))}
            />
            <ObservationsPanel
              highlighted={highlight === "acc-obs"}
              loading={loading}
              obsFunc={charts.obsFunc}
              obsCircle={charts.obsCircle}
              journeyByCircle={dashboard.journeyByCircle}
              journeyByFunction={dashboard.journeyByFunction}
            />
            <CapaPanel
              highlighted={highlight === "acc-capa"}
              loading={loading}
              capaStatus={charts.capaStatus}
              capaStatusFunc={charts.capaStatusFunc}
              capaAging={charts.capaAging}
              capaOverdue={charts.capaOverdue}
              ageing={dashboard.ageing}
              owners={dashboard.owners}
              pastTarget={dashboard.pastTarget}
              pastTargetTotal={dashboard.pastTargetTotal}
              onPlan={(plan) => setDrill(planDrill(plan))}
            />
          </>
        )}
      </main>

      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
      <ToastHost toasts={toasts} />
    </div>
  );
}

export default ViAuditManagementDashboardPage;
