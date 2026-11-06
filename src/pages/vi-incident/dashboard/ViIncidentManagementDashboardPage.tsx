import { useEffect, useRef, useState } from "react";
import { AnalyticsModal } from "../../../components/vi-incident/management-dashboard/AnalyticsModal";
// import { CapaPanel } from "../../../components/vi-incident/management-dashboard/CapaPanel"; — API pending
import { DrillDrawer } from "../../../components/vi-incident/management-dashboard/DrillDrawer";
import { FilterBar } from "../../../components/vi-incident/management-dashboard/FilterBar";
// import { IncidentDirectory } from "../../../components/vi-incident/management-dashboard/IncidentDirectory"; — API pending
import { IncidentOverview } from "../../../components/vi-incident/management-dashboard/IncidentOverview";
import { IncidentsPanel } from "../../../components/vi-incident/management-dashboard/IncidentsPanel";
import { InvestigationPanel } from "../../../components/vi-incident/management-dashboard/InvestigationPanel";
import { ToastHost } from "../../../components/vi-incident/management-dashboard/InfoButton";
import { MyDashboard } from "../../../components/vi-incident/management-dashboard/MyDashboard";
import { ShellBanner } from "../../../components/vi-incident/management-dashboard/ShellBanner";
import { ModuleTabs, TopBar } from "../../../components/vi-incident/management-dashboard/TopBar";
import "../../../components/vi-incident/management-dashboard/incidentDashboard.css";
import {
  useIncidentDashboard,
  useIncidentFilterOptions,
  type IncidentFilters,
  type RecentIncident,
} from "../../../components/vi-incident/management-dashboard/api";
import {
  ANALYTICS_CATALOG,
  // DRILLS, — sample detail panels, API pending
  // ROWS, — Incident Directory, API pending
  SCOPES,
  titleForFilters,
  type DrillModel,
  type ModuleKey,
  type Persona,
} from "../../../components/vi-incident/management-dashboard/data";
import { DashboardLoadingContext } from "../../../components/vi-incident/management-dashboard/loading";

interface ToastItem {
  id: number;
  message: string;
}

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Current month to date. */
function defaultFilters(): IncidentFilters {
  const today = new Date();
  return {
    circleIds: [],
    functionIds: [],
    zoneId: "",
    workLocationId: "",
    classificationId: "",
    dateFrom: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    dateTo: isoDate(today),
  };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] ?? ch);

function recentDrill(row: RecentIncident): DrillModel {
  const fields: [string, string][] = [
    ["Classification", row.classification],
    ["Circle", row.circle],
    ["Personnel Area", row.personnel_area],
    ["Location", row.location],
    ["Reporter", row.reporter],
    ["Incident date", `${row.incident_date} ${row.incident_time}`],
    ["Injury", row.injury],
    ["Workflow status", row.workflow_status],
  ];
  const body = fields.map(([label, value]) => `<tr><td class="strong">${label}</td><td>${escapeHtml(value || "—")}</td></tr>`).join("");
  return {
    crumb: `Recent Incidents › ${escapeHtml(row.incident_id)}`,
    title: `${escapeHtml(row.incident_id)} · ${escapeHtml(row.classification)}`,
    html: `<div class="dr-stats"><div class="dr-stat"><div class="v">${escapeHtml(row.status)}</div><div class="l">Status</div></div><div class="dr-stat"><div class="v">${escapeHtml(row.injury)}</div><div class="l">Injury</div></div></div><h4>Incident details</h4><table class="dr-tbl"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>${body}</tbody></table>`,
  };
}

export function ViIncidentManagementDashboardPage() {
  const [persona, setPersona] = useState<Persona>("admin");
  const [module, setModule] = useState<ModuleKey>("incident");
  const [draft, setDraft] = useState<IncidentFilters>(defaultFilters);
  const [applied, setApplied] = useState<IncidentFilters>(draft);
  const options = useIncidentFilterOptions();
  const live = useIncidentDashboard(applied);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  // const [dirFilter, setDirFilter] = useState("all");
  // const [dirQuery, setDirQuery] = useState("");
  const [drill, setDrill] = useState<DrillModel | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [savedAnalytics, setSavedAnalytics] = useState<string[]>([]);
  const [draftAnalytics, setDraftAnalytics] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const toastId = useRef(0);
  const highlightTimer = useRef<number | null>(null);
  const scope = SCOPES[persona];

  const notify = (message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  };

  const optionName = (list: { id: string; name: string }[], id: string) => list.find((item) => item.id === id)?.name ?? "";
  const circleNames = (ids: string[]) => ids.map((id) => optionName(options.circles, id)).filter(Boolean);
  const title = titleForFilters(persona, circleNames(applied.circleIds), optionName(options.zones, applied.zoneId));

  useEffect(() => {
    if (live.error) notify(`Some dashboard data could not be loaded (${live.error})`);
  }, [live.error]);

  const switchPersona = (next: Persona) => {
    setPersona(next);
    const reset = defaultFilters();
    setDraft(reset);
    setApplied(reset);
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

  // Sample detail panels (KPI legends, heatmap cells) are off until their APIs exist.
  // const openDrill = (key: string) => setDrill(DRILLS[key] ?? { crumb: "Incident", title: "Details", html: "<div class='dr-note'>Detail view for this item.</div>" });
  const openDrill = () => {};
  // const openRow = (index: number) => setDrill(ROWS[index].detail);

  const applyFilters = () => {
    if (persona === "circle" && (draft.circleIds.length === 0 || draft.functionIds.length === 0)) {
      notify("Select at least one Circle and one Function to apply");
      return;
    }
    if (!draft.dateFrom || !draft.dateTo || draft.dateFrom > draft.dateTo) {
      notify("Select a valid Incident Date range");
      return;
    }
    setApplied({ ...draft });
    const names = circleNames(draft.circleIds);
    const scopeName = names.length === 0 ? "Pan India" : names.length === 1 ? names[0] : `${names.length} Circles`;
    notify(`Filters applied · dashboard refreshed for ${scopeName}`);
  };

  // Feeds the hidden "Live · … · Last synced" status line under the page title.
  // const scopeText = live.loading
  //   ? "Loading…"
  //   : `${fmt(live.kpis[0])} incidents · ${fmt(live.kpis[4])} with injury · Last synced ${live.syncedAt?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? "—"}`;

  return (
    <DashboardLoadingContext.Provider value={live.loading}>
    <div className="vid">
      <ShellBanner />
      <TopBar persona={persona} module={module} role={scope.role} onPersona={switchPersona} onModule={switchModule} />
      <FilterBar
        persona={persona}
        value={draft}
        options={options}
        onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
        onApply={applyFilters}
        onReset={() => {
          const reset = defaultFilters();
          setDraft(reset);
          setApplied(reset);
          notify("Filters reset to default");
        }}
      />
      <ModuleTabs module={module} onModule={switchModule} />
      <main className={`content module-content${module === "incident" ? " active" : ""}`}>
        <div className="page-hd">
          <div>
            <h2>{title}</h2>
            {/* "Live · … · Last synced" status line hidden for now.
            <div className="sub"><span className="live-dot" />Live · <span>{scopeText}</span></div>
            */}
          </div>
        </div>
        <IncidentOverview values={live.kpis} heatmap={live.heatmap} activeGroup={activeGroup} onJump={jumpTo} onDrill={openDrill} />
        <IncidentsPanel values={live.kpis} charts={live.charts} recent={live.recent} highlighted={highlight === "acc-inc"} onDrill={openDrill} onRecent={(row) => setDrill(recentDrill(row))} />
        <InvestigationPanel charts={live.charts} highlighted={highlight === "acc-inv"} onDrill={openDrill} />
        {/* API pending — Action Plans (CAPA) panel and Incident Directory.
        <CapaPanel charts={live.charts} highlighted={highlight === "acc-capa"} onDrill={openDrill} />
        <IncidentDirectory filter={dirFilter} query={dirQuery} onFilter={setDirFilter} onQuery={setDirQuery} onRow={openRow} />
        */}
      </main>
      <main className={`content module-content${module === "mydashboard" ? " active" : ""}`}>
        <MyDashboard
          selected={savedAnalytics}
          values={live.kpis}
          charts={live.charts}
          onOpenPicker={() => { setDraftAnalytics(savedAnalytics); setPickerOpen(true); }}
          onRemove={(id) => setSavedAnalytics((current) => current.filter((item) => item !== id))}
          onDrill={openDrill}
        />
      </main>
      <AnalyticsModal
        open={pickerOpen}
        selected={draftAnalytics}
        onToggle={(id) => setDraftAnalytics((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
        onToggleAll={(checked) => setDraftAnalytics(checked ? ANALYTICS_CATALOG.map((item) => item.id) : [])}
        onClear={() => setDraftAnalytics([])}
        onApply={() => { setSavedAnalytics(draftAnalytics); setPickerOpen(false); }}
        onClose={() => setPickerOpen(false)}
      />
      <DrillDrawer drill={drill} onClose={() => setDrill(null)} />
      <ToastHost toasts={toasts} />
    </div>
    </DashboardLoadingContext.Provider>
  );
}

export default ViIncidentManagementDashboardPage;
