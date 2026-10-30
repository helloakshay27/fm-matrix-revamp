import { useRef, useState } from "react";
import { AnalyticsModal } from "../../../components/vi-audit/management-dashboard/AnalyticsModal";
import { AuditDirectory } from "../../../components/vi-audit/management-dashboard/AuditDirectory";
import { AuditOverview } from "../../../components/vi-audit/management-dashboard/AuditOverview";
import { AuditsPanel } from "../../../components/vi-audit/management-dashboard/AuditsPanel";
import { CapaPanel } from "../../../components/vi-audit/management-dashboard/CapaPanel";
import { DrillDrawer } from "../../../components/vi-audit/management-dashboard/DrillDrawer";
import { FilterBar } from "../../../components/vi-audit/management-dashboard/FilterBar";
import { ToastHost } from "../../../components/vi-audit/management-dashboard/InfoButton";
import { MyDashboard } from "../../../components/vi-audit/management-dashboard/MyDashboard";
import { ObservationsPanel } from "../../../components/vi-audit/management-dashboard/ObservationsPanel";
import { ShellBanner } from "../../../components/vi-audit/management-dashboard/ShellBanner";
import { ModuleTabs, TopBar } from "../../../components/vi-audit/management-dashboard/TopBar";
import "../../../components/vi-audit/management-dashboard/auditDashboard.css";
import {
  ANALYTICS_CATALOG,
  DRILLS,
  SCOPES,
  fmt,
  recentAuditDrill,
  type DrillModel,
  type ModuleKey,
  type Persona,
} from "../../../components/vi-audit/management-dashboard/data";
import { useManagementDashboard } from "../../../components/vi-audit/management-dashboard/useManagementDashboard";
import type { DashboardQuery } from "../../../components/vi-audit/management-dashboard/managementDashboardApi";

interface ToastItem {
  id: number;
  message: string;
}

const DEFAULT_FROM = "2026-10-01";
const DEFAULT_TO = "2026-10-31";

const EMPTY_QUERY: DashboardQuery = {
  clusterId: "",
  zoneId: "",
  functionIds: [],
  auditType: "",
  dateFrom: DEFAULT_FROM,
  dateTo: DEFAULT_TO,
};

export function ViAuditManagementDashboardPage() {
  const [persona, setPersona] = useState<Persona>("admin");
  const [module, setModule] = useState<ModuleKey>("audit");
  const [circle, setCircle] = useState("");
  const [zone, setZone] = useState("");
  const [auditType, setAuditType] = useState("");
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);
  const [functions, setFunctions] = useState<string[]>([]);
  const [applied, setApplied] = useState<DashboardQuery>(EMPTY_QUERY);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [dirFilter, setDirFilter] = useState("all");
  const [dirQuery, setDirQuery] = useState("");
  const [drill, setDrill] = useState<DrillModel | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [savedAnalytics, setSavedAnalytics] = useState<string[]>([]);
  const [draftAnalytics, setDraftAnalytics] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const toastId = useRef(0);
  const highlightTimer = useRef<number | null>(null);

  const scope = SCOPES[persona];
  const { filters, kpis, closure, sections, loading, error } = useManagementDashboard(applied);
  const clusterName = filters.clusters.find((item) => item.id === applied.clusterId)?.name;
  const zoneName = filters.zones.find((item) => item.id === applied.zoneId)?.name;
  const title = zoneName
    ? `Audit · ${clusterName || "Pan India"} · ${zoneName}`
    : clusterName
      ? `Audit · ${clusterName}`
      : SCOPES[persona].title;

  const notify = (message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3000);
  };

  const switchPersona = (next: Persona) => {
    setPersona(next);
  };

  const switchModule = (next: ModuleKey) => {
    setModule(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const jumpTo = (panel: string, group: string) => {
    setActiveGroup(group);
    setHighlight(panel);
    document.getElementById(panel)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlight(null), 1600);
  };

  const openDrill = (key: string) => setDrill(DRILLS[key] ?? { crumb: "Audit", title: "Details", blocks: [{ kind: "note", text: "Detail view for this item." }] });

  return (
    <div className="vad">
      <ShellBanner />
      <TopBar persona={persona} module={module} role={scope.role} onPersona={switchPersona} onModule={switchModule} />
      <FilterBar
        persona={persona}
        circle={circle}
        zone={zone}
        auditType={auditType}
        dateFrom={dateFrom}
        dateTo={dateTo}
        functions={functions}
        clusters={filters.clusters}
        functionOptions={filters.functions}
        zones={filters.zones}
        auditTypes={filters.auditTypes}
        onCircle={setCircle}
        onZone={setZone}
        onAuditType={setAuditType}
        onDateFrom={setDateFrom}
        onDateTo={setDateTo}
        onFunctions={setFunctions}
        onApply={() => {
          setApplied({
            clusterId: circle,
            zoneId: zone,
            functionIds: functions,
            auditType,
            dateFrom,
            dateTo,
          });
          const circleLabel = filters.clusters.find((item) => item.id === circle)?.name;
          notify(`Filters applied · dashboard refreshed for ${circleLabel || "Pan India"}`);
        }}
        onReset={() => {
          setCircle("");
          setZone("");
          setAuditType("");
          setDateFrom(DEFAULT_FROM);
          setDateTo(DEFAULT_TO);
          setFunctions([]);
          setApplied(EMPTY_QUERY);
          notify("Filters reset to default");
        }}
      />
      <ModuleTabs module={module} onModule={switchModule} />

      <main className={`content module-content${module === "audit" ? " active" : ""}`}>
        <div className="page-hd">
          <div>
            <h2>{title}</h2>
            <div className="sub">
              <span className="live-dot" />
              {loading
                ? "Loading live audit figures…"
                : error
                  ? error
                  : `Live · ${fmt(kpis?.total_audits ?? 0)} audits and ${fmt(kpis?.total_observations ?? 0)} observations across ${closure.length} circles`}
            </div>
          </div>
          {/* <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="tb-icon-btn" title="Export" onClick={() => notify("Excel export started — Audit dashboard")}>
              <DownloadIcon />
            </button>
          </div> */}
        </div>
        <AuditOverview kpis={kpis} loading={loading} closure={closure} activeGroup={activeGroup} onJump={jumpTo} onDownload={(section) => notify(`Excel export started — ${section}`)} onDrill={openDrill} />
        <AuditsPanel sections={sections} loading={loading} highlighted={highlight === "acc-audits"} onDownload={(section) => notify(`Excel export started — ${section}`)} onDrill={openDrill} onAudit={(audit) => setDrill(recentAuditDrill(audit))} />
        <ObservationsPanel sections={sections} loading={loading} highlighted={highlight === "acc-obs"} onDownload={(section) => notify(`Excel export started — ${section}`)} onDrill={openDrill} />
        <CapaPanel sections={sections} closure={closure} loading={loading} highlighted={highlight === "acc-capa"} onDownload={(section) => notify(`Excel export started — ${section}`)} onDrill={openDrill} />
        <AuditDirectory audits={sections.recentAudits} loading={loading} filter={dirFilter} query={dirQuery} onFilter={setDirFilter} onQuery={setDirQuery} onAudit={(audit) => setDrill(recentAuditDrill(audit))} />
        <div className="footer">Audit Dashboard · GoPhygital / Lockated for Vodafone Idea · Figures load from the audit dashboard API.</div>
      </main>

      <main className={`content module-content${module === "mydashboard" ? " active" : ""}`}>
        <MyDashboard
          selected={savedAnalytics}
          onOpenPicker={() => {
            setDraftAnalytics(savedAnalytics);
            setPickerOpen(true);
          }}
          onRemove={(id) => setSavedAnalytics((current) => current.filter((item) => item !== id))}
          kpis={kpis}
          loading={loading}
          onDrill={openDrill}
        />
      </main>

      <AnalyticsModal
        open={pickerOpen}
        selected={draftAnalytics}
        onToggle={(id) => setDraftAnalytics((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
        onToggleAll={(checked) => setDraftAnalytics(checked ? ANALYTICS_CATALOG.map((item) => item.id) : [])}
        onClear={() => setDraftAnalytics([])}
        onApply={() => {
          setSavedAnalytics(draftAnalytics);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
      <ToastHost toasts={toasts} />
    </div>
  );
}

export default ViAuditManagementDashboardPage;
