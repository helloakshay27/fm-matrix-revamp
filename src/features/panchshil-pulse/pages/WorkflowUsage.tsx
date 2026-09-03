import React from "react";
import { usePulseDashboard } from "../contexts/PulseDashboardContext";
import { KpiTile } from "../components/common/KpiTile";
import { SectionState } from "../components/common/SectionState";
import { tileToKpi } from "../utils/tileAdapter";
import { fmtC } from "../utils/calculations";
import type { ModuleOption } from "../../posthog-dashboard/data/metrics";

const VISIBLE = 8;

// ----------------------------------------------------------------
// Module / sub-module nav — derived from the API module tree
// ----------------------------------------------------------------

interface NavSelectProps {
  options: ModuleOption[];
  selected: string | null;
  onSelect: (name: string) => void;
}

const RenderChips: React.FC<NavSelectProps> = ({ options, selected, onSelect }) => {
  return (
    <>
      {options.slice(0, VISIBLE).map(m => (
        <button
          key={m.name}
          className={selected === m.name ? "on" : ""}
          onClick={() => onSelect(m.name)}
        >
          {m.name}
        </button>
      ))}
      {options.slice(VISIBLE).length > 0 && (
        <select
          className="mmore"
          value=""
          onChange={e => {
            const v = e.target.value;
            if (v) onSelect(v);
          }}
        >
          <option>More ({options.length - VISIBLE})&hellip;</option>
          {options.slice(VISIBLE).map(m => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

const WorkflowNav: React.FC = () => {
  const { vm, module, setModule, subModule, setSubModule } = usePulseDashboard();
  const { modules, subModules, status } = vm;

  return (
    <div className="mnav" id="modNav" title="Module & sub-module are derived from real $pathname segments — this filter applies to the Workflow Usage section only">
      <div className="mnav-buckets">
        {modules.slice(0, VISIBLE).map(m => (
          <button
            key={m.name}
            className={module === m.name ? "on" : ""}
            onClick={() => setModule(m.name)}
            title={`${fmtC(m.users)} users · ${fmtC(m.events)} events · ${fmtC(m.sessions)} sessions`}
          >
            {m.name}
            <span className="mcount">{fmtC(m.sessions)}</span>
          </button>
        ))}
        {modules.slice(VISIBLE).length > 0 && (
          <select
            className="mmore"
            value=""
            onChange={e => {
              const v = e.target.value;
              if (v) setModule(v);
            }}
          >
            <option>More ({modules.length - VISIBLE})&hellip;</option>
            {modules.slice(VISIBLE).map(m => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mnav-mods">
        {subModules.length > 0 ? (
          <div className="segbar">
            <RenderChips options={subModules} selected={subModule} onSelect={setSubModule} />
          </div>
        ) : status.flows.loading ? (
          <span className="sd">Loading modules&hellip;</span>
        ) : (
          <span className="sd">No sub-paths recorded under /{module ?? "—"}</span>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Main page
// ----------------------------------------------------------------
export const WorkflowUsage: React.FC = () => {
  const { vm } = usePulseDashboard();
  const flows = vm.flows;
  const funnel = flows.funnel;

  const funnelSteps = funnel.steps.map((step, i) => {
    const maxReach = funnel.reaches[0] || 1;
    const pct = Math.min(100, Math.round((funnel.reaches[i] / maxReach) * 100));
    const drop = i > 0 ? funnel.dropPct[i] : null;
    return { step, pct, drop };
  });

  return (
    <section className="page on" id="pgFlows">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Resident completion of key in-app workflows per module, all-modules comparison, and where residents navigate &amp; exit.
        </span>
      </div>

      {/* Module nav — modules + sub-modules from the API tree */}
      <WorkflowNav />

      <SectionState status={vm.status.flows} label="workflow data">
        {/* KPI Tiles — 4 tiles, grid-template-columns:repeat(4,1fr) exactly as HTML */}
        <div className="tiles" style={{ gridTemplateColumns: "repeat(4,1fr)" }} id="wfKpis">
          <KpiTile
            {...tileToKpi(flows.tiles[0], { label: "Workflow Adoption", id: "wfAdoption" })}
          />
          <KpiTile
            {...tileToKpi(flows.tiles[1], { label: "Completion Rate", id: "wfCompletion" })}
          />
          <KpiTile
            {...tileToKpi(flows.tiles[2], { label: "Biggest Step Drop", id: "wfDropoff" })}
          />
          <KpiTile
            {...tileToKpi(flows.tiles[3], { label: "Usage Volume", noTarget: true })}
          />
        </div>

        {/* Workflow Funnel card */}
        <div className="card" style={{ margin: "16px 0" }} id="card-wfFunnel">
          <div className="card-head">
            <div className="charthead">
              <div>
                <div className="cr">Workflow funnel (real event sequence)</div>
                <div className="ct">{flows.flagshipFunnelName}</div>
              </div>
              <span className="info-wrap">
                <button className="info-btn" type="button" tabIndex={-1}>i</button>
                <div className="info-pop">
                  <b>Workflow funnel</b>
                  For the flagship workflow of the selected module, the number of runs still present at each successive step, from start to finish. The percentage on each step is the drop from the step before it.
                  <div className="sep">
                    Each bar is narrower than the one above because some runs drop off. The highlighted step is the single biggest drop — worth a UX review of that screen to reduce abandonment. For {flows.modName || "this module"}, the steepest drop-off happens right after {funnel.steps[funnel.worst] ?? "the first step"}.
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="card-body" id="body-wfFunnel">
            {funnel.steps.length > 0 ? (
              <div className="funnel">
                {funnelSteps.map((fs, i) => (
                  <React.Fragment key={i}>
                    {fs.drop != null && fs.drop > 0 && (
                      <div className="fdrop">▼ {Math.round(fs.drop)}% drop-off</div>
                    )}
                    <div
                      className={`fstep${i === funnel.worst ? " worst" : ""}`}
                      style={{
                        width: `${fs.pct}%`,
                        background: "var(--blue)",
                        opacity: 1 - i * 0.1
                      }}
                      title={`${fs.step}: ${fs.pct}% of entrants remain`}
                    >
                      {fs.step}
                      <span className="fsub">{fs.pct}% of entrants</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="sd">No funnel steps recorded for this module.</div>
            )}
          </div>
        </div>

        {/* All screens table */}
        <div className="card" style={{ marginTop: "12px" }} id="card-allScreens">
          <div className="card-head">
            <div className="charthead">
              <div>
                <div className="cr">All screens in this module</div>
                <div className="ct">All screens in this module</div>
              </div>
              <span className="info-wrap">
                <button className="info-btn" type="button" tabIndex={-1}>i</button>
                <div className="info-pop">
                  <b>All screens in this module</b>
                  Every sub-path under the selected module, with the users, events and sessions recorded on it. Per-path completion (F-comp) needs a flow_key event property that is not instrumented yet, so it reads as a dash.
                  <div className="sep">
                    A per-screen scorecard so you can see which specific parts of the module are being used and which are ignored.
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="card-body" id="body-allScreens">
            {flows.flowRows.length > 0 ? (
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th className="num">Users</th>
                    <th className="num">Events</th>
                    <th className="num">Sessions</th>
                    <th className="num">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {flows.flowRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.path}</td>
                      <td className="num">{row.users.toLocaleString()}</td>
                      <td className="num">{row.events.toLocaleString()}</td>
                      <td className="num">{row.sessions.toLocaleString()}</td>
                      <td className="num">{row.comp == null ? "—" : `${Math.round(row.comp)}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="sd">No screen-level data in period.</div>
            )}
          </div>
        </div>

        {/* Top entry screens table */}
        <div className="card" style={{ marginTop: "12px" }} id="card-entryScreens">
          <div className="card-head">
            <div className="charthead">
              <div>
                <div className="cr">Top entry screens</div>
                <div className="ct">Top entry screens</div>
              </div>
              <span className="info-wrap">
                <button className="info-btn" type="button" tabIndex={-1}>i</button>
                <div className="info-pop">
                  <b>Top entry screens</b>
                  The screen each session lands on first, listed with its Visitors, Views and Bounce rate.
                  <div className="sep">
                    Shows the most common entry points into the app — what residents actually come to the app to do first, usually reached via push notification, deep link, or the app icon.
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="card-body" id="body-entryScreens">
            {flows.pathRows.length > 0 ? (
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th className="num">Visitors</th>
                    <th className="num">Views</th>
                    <th className="num">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {flows.pathRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.path}</td>
                      <td className="num">{row.vis.toLocaleString()}</td>
                      <td className="num">{row.vw.toLocaleString()}</td>
                      <td className="num">{Math.round(row.bo)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="sd">No entry-screen data in period.</div>
            )}
          </div>
        </div>
      </SectionState>
    </section>
  );
};

export default WorkflowUsage;