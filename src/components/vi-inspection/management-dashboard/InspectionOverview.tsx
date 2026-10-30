import { FOLLOW_UP, HEATMAP, HEATMAP_STAGES, KPI_INFO, cardInfo, fmt } from "./data";
import { DownloadIcon, PathIcon } from "./icons";
import { InfoButton } from "./InfoButton";

interface InspectionOverviewProps {
  values: readonly (number | string)[];
  activeGroup: string | null;
  onJump: (panel: string, group: string) => void;
  onDrill: (key: string) => void;
  onExcel: (section: string) => void;
}

export function InspectionOverview({ values, activeGroup, onJump, onDrill, onExcel }: InspectionOverviewProps) {
  return (
    <>
      <div className="alert-strip">
        <span className="a-lbl">⚡ Priority Actions</span>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-spoc")}>47 inspections awaiting a SPOC action plan &gt; 7 days</button>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-overdue")}>73 action plans past target date</button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-ext")}>41 target-date extensions logged</button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-sched")}>36 scheduled inspections past their date</button>
      </div>
      <div className="sec" id="sec-overview">
        <div className="sec-hd"><div className="sec-lbl">Overview — Inspection Snapshot</div><div className="sec-line" /></div>
        <div className="flow-hint">Click any KPI to jump to its full section below · numbers follow the inspection journey: Inspect → Checklist → Action plan → Action taken</div>
        <div className="kpi-grid flow-kpi-grid">
          {KPI_INFO.map((kpi, index) => (
            <div key={kpi.id} className={`kpi flow-kpi${activeGroup === kpi.group ? " kpi-active" : ""}`} style={{ ["--kpi-c" as string]: kpi.color, ["--kpi-tint" as string]: kpi.tint }} onClick={() => onJump(kpi.panel, kpi.group)}>
              <button type="button" className="kpi-dl-btn" title="Download Excel" onClick={(event) => { event.stopPropagation(); onExcel(kpi.section); }}>
                <DownloadIcon />
              </button>
              <div className="kpi-top">
                <div className="kpi-lbl">{kpi.label}<InfoButton text={kpi.info} /></div>
                <div className="kpi-ico"><PathIcon d={kpi.icon} size={14} /></div>
              </div>
              <div className="kpi-val">{fmt(values[index])}</div>
              <div className="kpi-flow-arrow">↓ tap to view {kpi.section}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="sec" id="sec-heatmap">
        <div className="g g-3-2">
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="card-title">Closure Progress by Circle × Stage<InfoButton text={cardInfo("Closure Progress by Circle × Stage")} /></div>
                <div className="card-sub">% complete per stage · click a cell to drill into that circle</div>
              </div>
            </div>
            <div className="hm-wrap">
              <div className="hm-hd"><div>Circle</div>{HEATMAP_STAGES.map((stage) => <div key={stage}>{stage}</div>)}</div>
              {HEATMAP.map((row) => (
                <div key={row.circle} className="hm-row">
                  <div className="hm-label">{row.circle}</div>
                  {row.cells.map((cell, index) => (
                    <div key={index} className={`hm-cell ${cell.cls}`} onClick={() => onDrill("circle-underperform")}>{cell.value}</div>
                  ))}
                </div>
              ))}
              <div className="hm-scale">Scale <div className="hm-scale-block"><span style={{ background: "rgba(238,39,55,.28)" }} /><span style={{ background: "rgba(237,196,136,.35)" }} /><span style={{ background: "rgba(158,200,186,.35)" }} /><span style={{ background: "rgba(16,140,114,.22)" }} /></div> &lt;70% → ≥90%</div>
            </div>
          </div>
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="card-title">Circles Needing Follow-up<InfoButton text={cardInfo("Circles Needing Follow-up")} /></div>
                <div className="card-sub">Lowest overall closure progress</div>
              </div>
            </div>
            {FOLLOW_UP.map((item, index) => (
              <div key={item.name} className="lb-row" onClick={() => onDrill("circle-underperform")}>
                <div className="lb-rank">{index + 1}</div>
                <div className="lb-info"><div className="lb-name">{item.name}</div><div className="lb-meta">{item.meta}</div></div>
                <div className="lb-val">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
