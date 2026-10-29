import { useRef, useState } from "react";
import { AnalyticsModal } from "../../../components/vi-incident/management-dashboard/AnalyticsModal";
import { CapaPanel } from "../../../components/vi-incident/management-dashboard/CapaPanel";
import { DrillDrawer } from "../../../components/vi-incident/management-dashboard/DrillDrawer";
import { FilterBar } from "../../../components/vi-incident/management-dashboard/FilterBar";
import { IncidentDirectory } from "../../../components/vi-incident/management-dashboard/IncidentDirectory";
import { IncidentOverview } from "../../../components/vi-incident/management-dashboard/IncidentOverview";
import { IncidentsPanel } from "../../../components/vi-incident/management-dashboard/IncidentsPanel";
import { InvestigationPanel } from "../../../components/vi-incident/management-dashboard/InvestigationPanel";
import { ToastHost } from "../../../components/vi-incident/management-dashboard/InfoButton";
import { MyDashboard } from "../../../components/vi-incident/management-dashboard/MyDashboard";
import { ShellBanner } from "../../../components/vi-incident/management-dashboard/ShellBanner";
import { ModuleTabs, TopBar } from "../../../components/vi-incident/management-dashboard/TopBar";
import "../../../components/vi-incident/management-dashboard/incidentDashboard.css";
import {
  ANALYTICS_CATALOG,
  DRILLS,
  ROWS,
  SCOPES,
  titleForFilters,
  type DrillModel,
  type ModuleKey,
  type Persona,
} from "../../../components/vi-incident/management-dashboard/data";

interface ToastItem {
  id: number;
  message: string;
}

const DEFAULT_FROM = "2026-10-01";
const DEFAULT_TO = "2026-10-31";

export function ViIncidentManagementDashboardPage() {
  const [persona, setPersona] = useState<Persona>("admin");
  const [module, setModule] = useState<ModuleKey>("incident");
  const [title, setTitle] = useState(SCOPES.admin.title);
  const [circle, setCircle] = useState("All Circles");
  const [zone, setZone] = useState("All Zones");
  const [classification, setClassification] = useState("All classifications");
  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);
  const [functions, setFunctions] = useState<string[]>([]);
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

  const notify = (message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  };

  const switchPersona = (next: Persona) => {
    setPersona(next);
    setCircle(next === "circle" ? "Maharashtra & Goa" : "All Circles");
    setZone("All Zones");
    setTitle(SCOPES[next].title);
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

  const openDrill = (key: string) => setDrill(DRILLS[key] ?? { crumb: "Incident", title: "Details", html: "<div class='dr-note'>Detail view for this item.</div>" });
  const openRow = (index: number) => setDrill(ROWS[index].detail);

  return (
    <div className="vid">
      <ShellBanner />
      <TopBar persona={persona} module={module} role={scope.role} onPersona={switchPersona} onModule={switchModule} />
      <FilterBar
        persona={persona}
        circle={circle}
        zone={zone}
        classification={classification}
        dateFrom={dateFrom}
        dateTo={dateTo}
        functions={functions}
        onCircle={(value) => { setCircle(value); setTitle(titleForFilters(value)); }}
        onZone={(value) => { setZone(value); setTitle(titleForFilters(circle, value)); }}
        onClassification={setClassification}
        onDateFrom={setDateFrom}
        onDateTo={setDateTo}
        onFunctions={setFunctions}
        onApply={() => { setTitle(titleForFilters(circle)); notify(`Filters applied · dashboard refreshed for ${circle === "All Circles" ? "Pan India" : circle}`); }}
        onReset={() => {
          const nextCircle = persona === "circle" ? "Maharashtra & Goa" : "All Circles";
          setCircle(nextCircle);
          setZone("All Zones");
          setClassification("All classifications");
          setDateFrom(DEFAULT_FROM);
          setDateTo(DEFAULT_TO);
          setFunctions([]);
          setTitle(SCOPES[persona].title);
          notify("Filters reset to default");
        }}
      />
      <ModuleTabs module={module} onModule={switchModule} />
      <main className={`content module-content${module === "incident" ? " active" : ""}`}>
        <div className="page-hd">
          <div>
            <h2>{title}</h2>
            <div className="sub"><span className="live-dot" />Live · Last synced 2 min ago · <span>{scope.scope}</span></div>
          </div>
        </div>
        <IncidentOverview values={scope.k} activeGroup={activeGroup} onJump={jumpTo} onDrill={openDrill} />
        <IncidentsPanel values={scope.k} highlighted={highlight === "acc-inc"} onDrill={openDrill} onRow={openRow} />
        <InvestigationPanel highlighted={highlight === "acc-inv"} onDrill={openDrill} />
        <CapaPanel highlighted={highlight === "acc-capa"} onDrill={openDrill} />
        <IncidentDirectory filter={dirFilter} query={dirQuery} onFilter={setDirFilter} onQuery={setDirQuery} onRow={openRow} />
        <div className="footer">Incident Dashboard v1 · Wireframe · GoPhygital / Lockated for Vodafone Idea · All figures are illustrative dummy data. Priority actions, aging, past-target-date, extension, time-of-day and heatmap measures are proposals derived from the Figma fields and statuses and need confirmation · October 2026</div>
      </main>
      <main className={`content module-content${module === "mydashboard" ? " active" : ""}`}>
        <MyDashboard
          selected={savedAnalytics}
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
  );
}

export default ViIncidentManagementDashboardPage;
