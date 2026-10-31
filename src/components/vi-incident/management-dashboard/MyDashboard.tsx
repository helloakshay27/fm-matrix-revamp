import { useState } from "react";
import { ANALYTICS_CATALOG, KPI_INFO, fmt, type ChartKind, type ChartSpec } from "./data";
import { ChartSwitch, IncidentChart, myDashSwitches } from "./IncidentChart";
import { CloseIcon, GridIcon, PlusIcon } from "./icons";

interface MyDashboardProps {
  selected: string[];
  values: readonly number[];
  charts: Record<string, ChartSpec>;
  onOpenPicker: () => void;
  onRemove: (id: string) => void;
  onDrill: (key: string) => void;
}

function DashChart({ spec, label, onRemove }: { spec: ChartSpec; label: string; onRemove: () => void }) {
  const [type, setType] = useState<ChartKind>(spec.defaultType);
  return (
    <div className="card mydash-chart-card">
      <button type="button" className="mydash-card-remove" title="Remove" onClick={onRemove}><CloseIcon size={12} /></button>
      <div className="card-hd">
        <div><span className="mydash-module-tag">Incident</span><div className="card-title">{label}</div></div>
        <ChartSwitch options={myDashSwitches(spec)} value={type} onChange={setType} />
      </div>
      <div className="chart-wrap"><IncidentChart spec={spec} type={type} /></div>
    </div>
  );
}

export function MyDashboard({ selected, values, charts, onOpenPicker, onRemove, onDrill }: MyDashboardProps) {
  return (
    <>
      <div className="page-hd mydash-hd">
        <div><h2>My Dashboard</h2><div className="sub">Your personalized view · pick any metric or chart from Incident</div></div>
        <button type="button" className="select-analytics-btn" onClick={onOpenPicker}><PlusIcon />Select Analytics</button>
      </div>
      {selected.length === 0 ? (
        <div className="mydash-empty">
          <GridIcon />
          <div className="t">No analytics selected yet</div>
          <div className="s">Build your own view by picking any KPI or chart from Incident. They&apos;ll show up here, live.</div>
          <button type="button" className="select-analytics-btn" onClick={onOpenPicker}><PlusIcon />Select Analytics</button>
        </div>
      ) : (
        <div className="mydash-grid">
          {selected.map((id) => {
            const item = ANALYTICS_CATALOG.find((entry) => entry.id === id);
            if (!item) return null;
            if (item.kind === "kpi") {
              const index = KPI_INFO.findIndex((kpi) => kpi.id === id);
              return (
                <button key={id} type="button" className="kpi mydash-kpi" onClick={() => onDrill(id)}>
                  <span className="mydash-card-remove" onClick={(event) => { event.stopPropagation(); onRemove(id); }}><CloseIcon size={12} /></span>
                  <span className="mydash-module-tag">Incident</span>
                  <div className="kpi-lbl">{item.label}</div>
                  <div className="kpi-val">{fmt(values[index])}</div>
                </button>
              );
            }
            return <DashChart key={id} spec={charts[id]} label={item.label} onRemove={() => onRemove(id)} />;
          })}
        </div>
      )}
      <div className="footer">My Dashboard · Wireframe · GoPhygital / Lockated for Vodafone Idea · Selections reset on page reload in this wireframe · October 2026</div>
    </>
  );
}
