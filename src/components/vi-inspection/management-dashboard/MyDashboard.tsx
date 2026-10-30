import { useState } from "react";
import { ANALYTICS_CATALOG, CHARTS, KPI_INFO, SCOPES, fmt, type ChartKind } from "./data";
import { ChartSwitch, InspectionChart, myDashSwitches } from "./InspectionChart";
import { CloseIcon, GridIcon, PlusIcon } from "./icons";

interface MyDashboardProps {
  selected: string[];
  onOpenPicker: () => void;
  onRemove: (id: string) => void;
  onDrill: (key: string) => void;
}

function DashChart({ id, label, onRemove }: { id: string; label: string; onRemove: () => void }) {
  const spec = CHARTS[id];
  const [type, setType] = useState<ChartKind>(spec.defaultType);
  return (
    <div className="card mydash-chart-card">
      <button type="button" className="mydash-card-remove" title="Remove" onClick={onRemove}><CloseIcon size={12} /></button>
      <div className="card-hd">
        <div><span className="mydash-module-tag">Inspection</span><div className="card-title">{label}</div></div>
        <ChartSwitch options={myDashSwitches(spec)} value={type} onChange={setType} />
      </div>
      <div className="chart-wrap"><InspectionChart spec={spec} type={type} /></div>
    </div>
  );
}

export function MyDashboard({ selected, onOpenPicker, onRemove, onDrill }: MyDashboardProps) {
  return (
    <>
      <div className="page-hd mydash-hd">
        <div><h2>My Dashboard</h2><div className="sub">Your personalized view · pick any metric or chart from Inspection</div></div>
        <button type="button" className="select-analytics-btn" onClick={onOpenPicker}><PlusIcon />Select Analytics</button>
      </div>
      {selected.length === 0 ? (
        <div className="mydash-empty">
          <GridIcon />
          <div className="t">No analytics selected yet</div>
          <div className="s">Build your own view by picking any KPI or chart from Inspection. They&apos;ll show up here, live.</div>
          <button type="button" className="select-analytics-btn" onClick={onOpenPicker}><PlusIcon />Select Analytics</button>
        </div>
      ) : (
        <div className="mydash-grid">
          {selected.map((id) => {
            const item = ANALYTICS_CATALOG.find((entry) => entry.id === id);
            if (!item) return null;
            if (item.kind === "kpi") {
              const index = KPI_INFO.findIndex((kpi) => kpi.id === id);
              const kpi = KPI_INFO[index];
              return (
                <button key={id} type="button" className="kpi mydash-kpi" style={{ ["--kpi-c" as string]: kpi.color, ["--kpi-tint" as string]: kpi.tint, position: "relative" }} onClick={() => onDrill(id)}>
                  <span className="mydash-card-remove" onClick={(event) => { event.stopPropagation(); onRemove(id); }}><CloseIcon size={12} /></span>
                  <span className="mydash-module-tag">Inspection</span>
                  <div className="kpi-top"><div className="kpi-lbl">{item.label}</div></div>
                  <div className="kpi-val">{fmt(SCOPES.admin.k[index])}</div>
                </button>
              );
            }
            return <DashChart key={id} id={id} label={item.label} onRemove={() => onRemove(id)} />;
          })}
        </div>
      )}
      <div className="footer">My Dashboard · Wireframe · GoPhygital / Lockated for Vodafone Idea · Selections reset on page reload in this wireframe · October 2026</div>
    </>
  );
}
