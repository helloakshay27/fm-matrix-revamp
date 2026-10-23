import { FOLLOW_UP, HEATMAP, INFO, KPI_CONFIG, fmt, heatClass } from "./data";
import { DownloadIcon, PathIcon } from "./icons";
import { InfoButton } from "./InfoButton";

interface AuditOverviewProps {
  values: number[];
  activeGroup: string | null;
  onJump: (panel: string, group: string) => void;
  onDownload: (section: string) => void;
  onDrill: (key: string) => void;
}

export function AuditOverview({ values, activeGroup, onJump, onDownload, onDrill }: AuditOverviewProps) {
  return (
    <>
      <div className="alert-strip">
        <span className="a-lbl">⚡ Priority Actions</span>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-spoc")}>
          155 observations awaiting a SPOC action plan &gt; 7 days
        </button>
        <button type="button" className="alert-chip" onClick={() => onDrill("alert-overdue")}>
          128 action plans past target date
        </button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-ext")}>
          47 target-date extensions logged
        </button>
        <button type="button" className="alert-chip warn" onClick={() => onDrill("alert-draft")}>
          29 draft audits older than 15 days
        </button>
      </div>

      <div className="sec" id="sec-overview">
        <div className="sec-hd">
          <div className="sec-lbl">Overview — Audit Snapshot</div>
          <div className="sec-line" />
        </div>
        <div className="flow-hint">Click any KPI to jump to its full section below · numbers follow the audit journey: Audit → Observation → Action plan → Action taken</div>
        <div className="kpi-grid flow-kpi-grid">
          {KPI_CONFIG.map((kpi, index) => (
            <div
              key={kpi.id}
              className={`kpi flow-kpi${activeGroup === kpi.group ? " kpi-active" : ""}`}
              style={{ ["--kpi-c" as string]: kpi.color, ["--kpi-tint" as string]: kpi.tint }}
              onClick={() => onJump(kpi.panel, kpi.group)}
            >
              <button
                type="button"
                className="kpi-dl-btn"
                title="Download Excel"
                onClick={(event) => {
                  event.stopPropagation();
                  onDownload(kpi.section);
                }}
              >
                <DownloadIcon size={12} />
              </button>
              <div className="kpi-top">
                <div className="kpi-lbl">
                  {kpi.label}
                  <InfoButton text={kpi.info} />
                </div>
                <div className="kpi-ico">
                  <PathIcon d={kpi.icon} size={14} />
                </div>
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
                <div className="card-title">
                  Closure Progress by Circle × Stage
                  <InfoButton text={INFO.heatmap} />
                </div>
                <div className="card-sub">% complete per stage · click a cell to drill into that circle</div>
              </div>
            </div>
            <div className="hm-wrap">
              <div className="hm-hd">
                <div>Circle</div>
                <div>Audit Closed</div>
                <div>Plan Created</div>
                <div>Action Taken</div>
                <div>On-time</div>
                <div>No Extension</div>
              </div>
              {HEATMAP.map((row) => (
                <div key={row.circle} className="hm-row">
                  <div className="hm-label">{row.circle}</div>
                  {row.values.map((value, index) => (
                    <div key={index} className={`hm-cell ${heatClass(value)}`} onClick={() => onDrill("circle-underperform")}>
                      {value}%
                    </div>
                  ))}
                </div>
              ))}
              <div className="hm-scale">
                Scale
                <div className="hm-scale-block">
                  <span style={{ background: "rgba(238,39,55,.28)" }} />
                  <span style={{ background: "rgba(237,196,136,.35)" }} />
                  <span style={{ background: "rgba(158,200,186,.35)" }} />
                  <span style={{ background: "rgba(16,140,114,.22)" }} />
                </div>
                &lt;70% → ≥90%
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-hd">
              <div>
                <div className="card-title">
                  Circles Needing Follow-up
                  <InfoButton text={INFO.followup} />
                </div>
                <div className="card-sub">Lowest overall closure progress</div>
              </div>
            </div>
            <div>
              {FOLLOW_UP.map((row, index) => (
                <div key={row.circle} className="lb-row" onClick={() => onDrill("circle-underperform")}>
                  <div className="lb-rank">{index + 1}</div>
                  <div className="lb-info">
                    <div className="lb-name">{row.circle}</div>
                    <div className="lb-meta">Average across the five stages</div>
                  </div>
                  <div className="lb-val">{row.average}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
