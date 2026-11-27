import type { HeatmapRow, HeatmapStage } from "./api";
import { FOLLOW_UP, KPI_INFO, VISIBLE_KPI_IDS, cardInfo, fmt, fmtKpi } from "./data";
import { PathIcon } from "./icons";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoButton } from "./InfoButton";
import { DataState } from "./DataState";
import { useDashboardLoading } from "./loading";

interface IncidentOverviewProps {
  values: readonly number[];
  heatmap: HeatmapRow[];
  heatmapStages: HeatmapStage[];
  activeGroup: string | null;
  /** Leave out when the detail sections are hidden: the KPI cards then are not clickable. */
  onJump?: (panel: string, group: string) => void;
  onDrill: (key: string) => void;
}

export function IncidentOverview({ values, heatmap, heatmapStages, activeGroup, onJump, onDrill }: IncidentOverviewProps) {
  // One column per API stage (the stylesheet assumes five).
  const hmColumns = { gridTemplateColumns: `120px repeat(${Math.max(heatmapStages.length, 1)}, 1fr)` };
  const loading = useDashboardLoading();
  return (
    <>
      {/* <div className="alert-strip">
        <span className="a-lbl">⚡ Priority Actions</span>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-review")}>38 incidents awaiting SPOC review &gt; 3 days</button>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-overdue")}>64 CAPA plans past target date</button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-ext")}>29 target-date extensions logged</button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-lost")}>17 injury incidents with days away from work still open</button>
      </div> */}
      <div className="sec" id="sec-overview">
        <div className="sec-hd"><div className="sec-lbl">Overview — Incident Snapshot</div><div className="sec-line" /></div>
        <div className="flow-hint">{onJump ? "Click any KPI to jump to its full section below · numbers" : "Numbers"} follow the incident journey: Report → SPOC review → Action plan → Action taken</div>
        <div className="kpi-grid flow-kpi-grid">
          {VISIBLE_KPI_IDS.map((id) => {
            // Only these cards are shown; each value is read by its position in KPI_INFO.
            const index = KPI_INFO.findIndex((item) => item.id === id);
            const kpi = KPI_INFO[index];
            if (!kpi) return null;
            return (
            <div key={kpi.id} className={`kpi flow-kpi${activeGroup === kpi.group ? " kpi-active" : ""}`} style={{ ["--kpi-c" as string]: kpi.color, ["--kpi-tint" as string]: kpi.tint, ...(onJump ? null : { cursor: "default" }) }} onClick={onJump ? () => onJump(kpi.panel, kpi.group) : undefined}>
              <div className="kpi-top">
                <div className="kpi-lbl">{kpi.label}<InfoButton text={kpi.info} /></div>
                <div className="kpi-ico"><PathIcon d={kpi.icon} size={14} /></div>
              </div>
              <div className="kpi-val">{loading ? <Skeleton className="h-6 w-20" /> : fmtKpi(values[index])}</div>
              {onJump ? <div className="kpi-flow-arrow">↓ tap to view {kpi.section}</div> : null}
            </div>
            );
          })}
        </div>
      </div>
      <div className="sec" id="sec-heatmap">
        <div className="g">
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="card-title">Closure Progress by Circle<InfoButton text={cardInfo("Closure Progress by Circle × Stage")} /></div>
                <div className="card-sub">Count per stage · hover for count of total and % · click a cell to drill into that circle</div>
              </div>
            </div>
            <div className="hm-wrap">
              <div className="hm-hd" style={hmColumns}><div>Circle</div>{heatmapStages.map((stage) => <div key={stage.key}>{stage.label}</div>)}</div>
              {loading ? <DataState /> : null}
              {!loading && heatmap.length === 0 ? <div className="hm-row"><div className="hm-label">No circles in the selected scope</div></div> : null}
              {!loading && heatmap.map((row) => (
                <div key={row.circle} className="hm-row" style={hmColumns}>
                  <div className="hm-label">{row.circle}</div>
                  {row.cells.map((cell, index) => (
                    <div key={index} className={`hm-cell ${cell.cls}`} style={cell.cls ? undefined : { background: "var(--div)" }} title={cell.title} onClick={() => onDrill("circle-underperform")}>{cell.value}</div>
                  ))}
                </div>
              ))}
              <div className="hm-scale">Scale <div className="hm-scale-block"><span style={{ background: "rgba(238,39,55,.28)" }} /><span style={{ background: "rgba(255,196,0,.55)" }} /><span style={{ background: "rgba(255,143,107,.42)" }} /><span style={{ background: "var(--sky)" }} /></div> Low → High</div>
            </div>
          </div>
          {/* <div className="card">
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
          </div> */}
        </div>
      </div>
    </>
  );
}
