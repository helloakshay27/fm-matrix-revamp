import { useState } from "react";
import { ANALYTICS_CATALOG, KPI_CONFIG, fmt, type ChartSpec } from "./data";
import { AuditChart, ChartSwitch, myDashSwitches } from "./AuditChart";
import { CloseIcon, GridIcon, PlusIcon } from "./icons";
import { EMPTY_CHART, KPI_FIELD, type AuditKpi } from "./viAuditDashboardApi";

interface MyDashboardProps {
  selected: string[];
  kpi: AuditKpi | null;
  charts: Record<string, ChartSpec | null>;
  loading: boolean;
  onOpenPicker: () => void;
  onRemove: (id: string) => void;
  onDrill: (key: string) => void;
}

function DashChartCard({ spec, label, loading, onRemove }: { spec: ChartSpec | null | undefined; label: string; loading: boolean; onRemove: () => void }) {
  const resolved = spec ?? EMPTY_CHART;
  const [type, setType] = useState(resolved.defaultType);
  const message = loading ? "Loading…" : spec === undefined ? "This chart isn’t returned by the dashboard API" : spec === null ? "Couldn’t load data" : spec.labels.length === 0 ? "No data for these filters" : "";

  return (
    <div className="card mydash-chart-card">
      <button type="button" className="mydash-card-remove" title="Remove" onClick={onRemove}>
        <CloseIcon size={12} />
      </button>
      <div className="card-hd">
        <div>
          <span className="mydash-module-tag">Audit</span>
          <div className="card-title">{label}</div>
        </div>
        {!message && <ChartSwitch options={myDashSwitches(resolved)} value={type} onChange={setType} />}
      </div>
      {message ? (
        <div className="card-sub" style={{ padding: "28px 0", textAlign: "center" }}>{message}</div>
      ) : (
        <div className="chart-wrap">
          <AuditChart spec={resolved} type={type} />
        </div>
      )}
    </div>
  );
}

export function MyDashboard({ selected, kpi, charts, loading, onOpenPicker, onRemove, onDrill }: MyDashboardProps) {
  return (
    <>
      <div className="page-hd mydash-hd">
        <div>
          <h2>My Dashboard</h2>
          <div className="sub">Your personalized view · pick any metric or chart from Audit</div>
        </div>
        <button type="button" className="select-analytics-btn" onClick={onOpenPicker}>
          <PlusIcon />
          Select Analytics
        </button>
      </div>
      {selected.length === 0 ? (
        <div className="mydash-empty">
          <GridIcon />
          <div className="t">No analytics selected yet</div>
          <div className="s">Build your own view by picking any KPI or chart from Audit. They&apos;ll show up here, live.</div>
          <button type="button" className="select-analytics-btn" onClick={onOpenPicker}>
            <PlusIcon />
            Select Analytics
          </button>
        </div>
      ) : (
        <div className="mydash-grid">
          {selected.map((id) => {
            const item = ANALYTICS_CATALOG.find((entry) => entry.id === id);
            if (!item) return null;
            if (item.type === "kpi") {
              const config = KPI_CONFIG.find((entry) => entry.id === id);
              if (!config) return null;
              const field = KPI_FIELD[config.id];
              const value = loading || !kpi || !field ? null : kpi[field];
              return (
                <div
                  key={id}
                  className="kpi"
                  style={{ ["--kpi-c" as string]: config.color, ["--kpi-tint" as string]: config.tint, position: "relative" }}
                  onClick={() => onDrill(id)}
                >
                  <button
                    type="button"
                    className="mydash-card-remove"
                    title="Remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemove(id);
                    }}
                  >
                    <CloseIcon size={12} />
                  </button>
                  <span className="mydash-module-tag">Audit</span>
                  <div className="kpi-top">
                    <div className="kpi-lbl">{config.label}</div>
                  </div>
                  <div className="kpi-val">{value == null ? "—" : fmt(value)}</div>
                  <div className="kpi-sub">
                    <span className="kpi-trend up" />
                  </div>
                </div>
              );
            }
            return <DashChartCard key={id} spec={charts[id]} label={item.label} loading={loading} onRemove={() => onRemove(id)} />;
          })}
        </div>
      )}
      <div className="footer">My Dashboard · Wireframe · GoPhygital / Lockated for Vodafone Idea · Selections reset on page reload in this wireframe · October 2026</div>
    </>
  );
}
