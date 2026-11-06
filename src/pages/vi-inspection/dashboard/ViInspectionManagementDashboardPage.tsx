import { useRef, useState } from "react";
import { ActionPlansPanel } from "../../../components/vi-inspection/management-dashboard/ActionPlansPanel";
import { FilterBar } from "../../../components/vi-inspection/management-dashboard/FilterBar";
import { InspectionOverview } from "../../../components/vi-inspection/management-dashboard/InspectionOverview";
import { ToastHost } from "../../../components/vi-inspection/management-dashboard/InfoButton";
import { ShellBanner } from "../../../components/vi-inspection/management-dashboard/ShellBanner";
import { ModuleTabs, TopBar } from "../../../components/vi-inspection/management-dashboard/TopBar";
import "../../../components/vi-inspection/management-dashboard/inspectionDashboard.css";
import { fmt, type ModuleKey, type Persona } from "../../../components/vi-inspection/management-dashboard/data";
import {
  useInspectionDashboardData,
  useInspectionFilterOptions,
  type InspectionDashboardFilters,
} from "../../../components/vi-inspection/management-dashboard/viInspectionDashboardApi";

interface ToastItem {
  id: number;
  message: string;
}

const isoDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// Default period: the current month up to today.
const defaultFilters = (): InspectionDashboardFilters => {
  const today = new Date();
  return {
    clusterIds: [],
    functionIds: [],
    zoneIds: [],
    workLocationIds: [],
    inspectionTypeIds: [],
    dateFrom: isoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
    dateTo: isoDate(today),
  };
};

export function ViInspectionManagementDashboardPage() {
  const [persona, setPersona] = useState<Persona>("admin");
  const [module, setModule] = useState<ModuleKey>("inspection");
  // Filter bar values while editing; `applied` is what the data requests use (set on Apply / Reset).
  const [filters, setFilters] = useState<InspectionDashboardFilters>(defaultFilters);
  const [applied, setApplied] = useState<InspectionDashboardFilters>(filters);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastId = useRef(0);
  const highlightTimer = useRef<number | null>(null);
  const options = useInspectionFilterOptions();
  const { kpi, spoc, owners, closure, loading } = useInspectionDashboardData(applied);

  const notify = (message: string) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  };

  const update = <K extends keyof InspectionDashboardFilters>(key: K) => (value: InspectionDashboardFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  // Title from the applied circles / zones: one name, a count, or Pan India when none is picked.
  const scopeLabel = (list: { id: string; name: string }[], ids: string[], singular: string, plural: string) =>
    ids.length === 0 ? "" : ids.length === 1 ? `${list.find((item) => item.id === ids[0])?.name ?? ""} ${singular}` : `${ids.length} ${plural}`;
  const circleLabel = scopeLabel(options.circles, applied.clusterIds, "Circle", "Circles");
  const zoneLabel = scopeLabel(options.zones, applied.zoneIds, "Zone", "Zones");
  const title = `Inspection · ${circleLabel || "Pan India View"}${zoneLabel ? ` · ${zoneLabel}` : ""}`;

  const switchPersona = (next: Persona) => {
    setPersona(next);
    // Pan India has no circle filter: drop any circles picked in the Circle Manager view and reload.
    if (next === "admin") {
      setFilters((current) => ({ ...current, clusterIds: [] }));
      setApplied((current) => (current.clusterIds.length ? { ...current, clusterIds: [] } : current));
    }
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

  const apply = () => {
    if (!filters.dateFrom || !filters.dateTo) {
      notify("Select the inspection date range");
      return;
    }
    if (filters.dateFrom > filters.dateTo) {
      notify("Inspection Date From must be before Inspection Date To");
      return;
    }
    if (persona === "circle" && filters.clusterIds.length === 0) {
      notify("Select a circle");
      return;
    }
    setApplied(filters);
  };

  return (
    <div className="vinsp">
      <ShellBanner />
      <TopBar persona={persona} module={module} role={persona === "admin" ? "Pan India" : "Circle Manager"} onPersona={switchPersona} onModule={switchModule} />
      <FilterBar
        persona={persona}
        options={options}
        circles={filters.clusterIds}
        functions={filters.functionIds}
        zones={filters.zoneIds}
        workLocations={filters.workLocationIds}
        inspectionTypes={filters.inspectionTypeIds}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onCircles={update("clusterIds")}
        onFunctions={update("functionIds")}
        onZones={update("zoneIds")}
        onWorkLocations={update("workLocationIds")}
        onInspectionTypes={update("inspectionTypeIds")}
        onDateFrom={update("dateFrom")}
        onDateTo={update("dateTo")}
        onApply={apply}
        onReset={() => {
          const next = defaultFilters();
          setFilters(next);
          setApplied(next);
        }}
      />
      <ModuleTabs module={module} onModule={switchModule} />
      <main className={`content module-content${module === "inspection" ? " active" : ""}`}>
        <div className="page-hd">
          <div>
            <h2>{title}</h2>
            <div className="sub">
              <span className="live-dot" />
              {loading ? "Loading…" : kpi ? `Live · ${fmt(kpi.total_inspections)} inspections · ${fmt(kpi.total_observations)} observations` : "Couldn’t load inspection data"}
            </div>
          </div>
        </div>
        <InspectionOverview kpi={kpi} closure={closure} loading={loading} activeGroup={activeGroup} onJump={jumpTo} />
        <ActionPlansPanel highlighted={highlight === "acc-act"} loading={loading} spoc={spoc} owners={owners} />
      </main>
      <ToastHost toasts={toasts} />
    </div>
  );
}

export default ViInspectionManagementDashboardPage;
