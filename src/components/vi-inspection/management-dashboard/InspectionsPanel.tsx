import { CHARTS, fmt } from "./data";
import { ChartCard } from "./ChartCard";
import { DownloadIcon } from "./icons";
import { InspectionChart } from "./InspectionChart";

interface InspectionsPanelProps {
  values: readonly (number | string)[];
  highlighted: boolean;
  onDrill: (key: string) => void;
  onExcel: (section: string) => void;
}

// The wireframe ships this panel's config (CFG.charts / CFG.legend / CFG.myCharts) but not its HTML,
// so the layout mirrors the Incident dashboard's Incidents panel. KPI index order:
// 0 total · 1 draft · 2 scheduled · 3 open · 4 closed · 5 pending SPOC · 6 pending Action Owner.
export function InspectionsPanel({ values, highlighted, onDrill, onExcel }: InspectionsPanelProps) {
  const total = Number(values[0]);
  const closedPct = total ? `${((Number(values[4]) / total) * 100).toFixed(1)}%` : "0%";
  return (
    <div className={`accordion-panel${highlighted ? " nav-highlight" : ""}`} id="acc-ins">
      <div className="acc-hd">
        <div><div className="acc-title">Inspections</div><div className="acc-sub">Volume, status, type, where inspections happen, and scheduled coverage</div></div>
        <div className="acc-hd-actions">
          <button type="button" className="acc-dl-btn" onClick={() => onExcel("Inspections")}><DownloadIcon />Excel</button>
        </div>
      </div>
      <div className="g g3">
        <ChartCard title="Inspection Status" sub="Draft · Scheduled · Open · Closed" spec={CHARTS.insStatus} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <InspectionChart spec={CHARTS.insStatus} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{closedPct}</div><div className="dh-lbl">Closed</div></div>
              </div>
              <div className="donut-legend">
                <Legend swatch="#F4795F" label="Draft" value={fmt(values[1])} onClick={() => onDrill("ins-draft")} />
                <Legend swatch="#9B7FD4" label="Scheduled" value={fmt(values[2])} onClick={() => onDrill("ins-sched")} />
                <Legend swatch="var(--vi-red)" label="Open" value={fmt(values[3])} onClick={() => onDrill("ins-open")} />
                <Legend swatch="#0D47A1" label="Closed" value={fmt(values[4])} onClick={() => onDrill("ins-closed")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Open Inspection Stage" sub="Who owes the next step" spec={CHARTS.insStage} options={["donut", "bar"]}>
          {(type) => (
            <div className="donut-block">
              <div className="donut-c">
                <InspectionChart spec={CHARTS.insStage} type={type} compactDonut />
                <div className="donut-center"><div className="dh-val">{fmt(values[3])}</div><div className="dh-lbl">Open</div></div>
              </div>
              <div className="donut-legend">
                <Legend swatch="#F9A592" label="Pending By SPOC" value={fmt(values[5])} onClick={() => onDrill("ins-spoc")} />
                <Legend swatch="#FDE2C8" label="Pending By Action Owner" value={fmt(values[6])} border onClick={() => onDrill("ins-ao")} />
              </div>
            </div>
          )}
        </ChartCard>
        <ChartCard title="Inspections by Type" sub="Inspection type selected by the Inspector" spec={CHARTS.insType} options={["donut", "bar"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Inspections Submitted vs Closed · 12 Months" sub="Monthly volume" spec={CHARTS.insTrend} options={["line", "bar"]} />
        <ChartCard title="Inspections per Circle" sub="Top 12 circles · open vs closed" spec={CHARTS.insCircle} options={["bar", "table"]} />
      </div>
      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="Inspections by Type of Facility" sub="Type of Facility on the inspection" spec={CHARTS.insFacility} options={["bar", "donut"]} />
        <ChartCard title="Inspections by Function" sub="Function selected on the inspection" spec={CHARTS.insFunc} options={["donut", "bar"]} />
      </div>
      <div className="g g1" style={{ marginTop: 16 }}>
        <ChartCard title="Scheduled vs Completed by Circle" sub="% of scheduled inspections completed vs not yet done" spec={CHARTS.insCover} options={["bar", "table"]} />
      </div>
    </div>
  );
}

function Legend({ swatch, label, value, onClick, border }: { swatch: string; label: string; value: string; onClick: () => void; border?: boolean }) {
  return (
    <div className="dl-row" onClick={onClick}>
      <span className="dl-sw" style={{ background: swatch, border: border ? "1px solid #E8C9A5" : undefined }} />
      <span className="dl-lbl">{label}</span>
      <span className="dl-val">{value}</span>
    </div>
  );
}
