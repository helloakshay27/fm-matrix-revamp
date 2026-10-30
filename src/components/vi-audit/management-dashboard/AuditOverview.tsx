import { INFO, KPI_CONFIG, fmt, heatClass } from "./data";
import { PathIcon } from "./icons";
import { InfoButton } from "./InfoButton";
import { Skeleton } from "@/components/ui/skeleton";
import { KPI_FIELD, type AuditKpi, type ClosureRow } from "./viAuditDashboardApi";

interface AuditOverviewProps {
  kpi: AuditKpi | null;
  closure: ClosureRow[] | null;
  loading: boolean;
  activeGroup: string | null;
  onJump: (panel: string, group: string) => void;
  onCircle: (row: ClosureRow) => void;
}

const pct = (value: number) => `${Math.round(value)}%`;

export function AuditOverview({ kpi, closure, loading, activeGroup, onJump, onCircle }: AuditOverviewProps) {
  return (
    <>
      <div className="sec" id="sec-overview">
        <div className="sec-hd">
          <div className="sec-lbl">Overview — Audit Snapshot</div>
          <div className="sec-line" />
        </div>
        <div className="flow-hint">Click any KPI to jump to its full section below · numbers follow the audit journey: Audit → Observation → Action plan → Action taken</div>
        <div className="kpi-grid flow-kpi-grid">
          {KPI_CONFIG.map((item) => {
            if (item.id === "kpi-draft") return null;
            const field = KPI_FIELD[item.id];
            return (
              <div
                key={item.id}
                className={`kpi flow-kpi${activeGroup === item.group ? " kpi-active" : ""}`}
                style={{ ["--kpi-c" as string]: item.color, ["--kpi-tint" as string]: item.tint }}
                onClick={() => onJump(item.panel, item.group)}
              >
                <div className="kpi-top">
                  <div className="kpi-lbl">
                    {item.label}
                    <InfoButton text={item.info} />
                  </div>
                  <div className="kpi-ico">
                    <PathIcon d={item.icon} size={14} />
                  </div>
                </div>
                <div className="kpi-val">{loading ? <Skeleton className="h-6 w-16" /> : kpi && field ? fmt(kpi[field]) : "—"}</div>
                <div className="kpi-flow-arrow">↓ tap to view {item.section}</div>
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
                <div>Delayed CAPA</div>
              </div>
              {loading ? (
                <div className="card-sub" style={{ padding: "20px 0", textAlign: "center" }}>Loading…</div>
              ) : !closure ? (
                <div className="card-sub" style={{ padding: "20px 0", textAlign: "center" }}>Couldn’t load closure progress</div>
              ) : closure.length === 0 ? (
                <div className="card-sub" style={{ padding: "20px 0", textAlign: "center" }}>No closure data for these filters</div>
              ) : (
                closure.map((row) => {
                  const values = [row.audit_closed, row.action_plan_created, row.action_taken, row.ontime_capa, row.delayed_capa];
                  return (
                    <div key={row.circle} className="hm-row">
                      <div className="hm-label">{row.circle}</div>
                      {values.map((value, index) => (
                        <div key={index} className={`hm-cell ${heatClass(value)}`} onClick={() => onCircle(row)}>
                          {pct(value)}
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
              <div className="hm-scale">
                Scale
                <div className="hm-scale-block">
                  <span style={{ background: "rgba(238,39,55,.28)" }} />
                  <span style={{ background: "rgba(255,196,0,.55)" }} />
                  <span style={{ background: "rgba(255,143,107,.42)" }} />
                  <span style={{ background: "#CADEF8" }} />
                </div>
                &lt;70% → ≥90%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
