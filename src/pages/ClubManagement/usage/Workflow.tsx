import { useEffect, useMemo, useState } from "react";
import { CHART } from "./usageData";
import { useUsage } from "./UsageContext";
import { ChartCard, Tile } from "./UsagePrimitives";
import { buildFlows } from "@/features/posthog-dashboard/data/metrics";
import type { DashboardState } from "@/features/posthog-dashboard/data/metrics";
import { useUsageModules, useWorkflowUsageQueries } from "./usageQueries";

export function Workflow() {
  const { filters } = useUsage();
  const [moduleName, setModuleName] = useState("");
  const [subModule, setSubModule] = useState("");
  const modulesQuery = useUsageModules(filters);
  const modules = useMemo(() => modulesQuery.data?.tree ?? [], [modulesQuery.data]);
  useEffect(() => {
    if (modules.length && !modules.some((item) => item.name === moduleName)) {
      setModuleName(modules[0].name);
      setSubModule("");
    }
  }, [modules, moduleName]);

  const subModulesQuery = useUsageModules(filters, moduleName || undefined);
  const subModules = useMemo(() => subModulesQuery.data?.tree ?? [], [subModulesQuery.data]);
  useEffect(() => {
    if (subModules.length && !subModules.some((item) => item.name === subModule)) {
      setSubModule(subModules[0].name);
    }
  }, [subModules, subModule]);

  const workflowFiltersSettled =
    Boolean(moduleName) &&
    !subModulesQuery.isLoading &&
    (subModulesQuery.isError || subModules.length === 0 || Boolean(subModule));
  const workflowQuery = useWorkflowUsageQueries(
    filters,
    moduleName || undefined,
    subModule || undefined,
    workflowFiltersSettled,
  );
  const data = useMemo(
    () => buildFlows({ module: moduleName || null, subModule: subModule || null } as DashboardState, workflowQuery.data),
    [moduleName, subModule, workflowQuery.data],
  );
  const deltaLabel = (value: number | null) => value == null ? null : `${value > 0 ? "+" : ""}${value}% vs prev. period`;
  const allLoading = modulesQuery.isLoading || subModulesQuery.isLoading || workflowQuery.isLoading;
  const hasError = modulesQuery.isError || subModulesQuery.isError || workflowQuery.isError;

  return (
    <section className="section">
      <div className="section-head">
        <h2>Workflow Usage</h2>
      </div>

      {allLoading && <div className="bmnote" role="status">Loading workflow analytics…</div>}
      {hasError && <div className="bmnote" role="alert">Some workflow analytics could not be loaded. Available data remains visible.</div>}
      {!allLoading && !hasError && (!modulesQuery.data || !workflowQuery.data) && <div className="bmnote">Workflow analytics are unavailable for this date range.</div>}

      <div className="mnav" title="Choose the module and sub-module used to filter workflow analytics">
        <div className="mnav-buckets">
          {modules.map((item) => (
            <button key={item.name} type="button" className={item.name === moduleName ? "on" : ""} onClick={() => { setModuleName(item.name); setSubModule(""); }}>
              {item.name}<span className="mcount">{item.events.toLocaleString()}</span>
            </button>
          ))}
        </div>
        <div className="mnav-mods">
          <div className="segbar">
            {subModules.map((item) => (
              <button key={item.name} type="button" className={item.name === subModule ? "on" : ""} onClick={() => setSubModule(item.name)}>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {data.tiles.map((tile, i) => {
          const delta = tile.delta;
          const dir = delta == null ? "flat" : (i === 2 ? delta <= 0 : delta >= 0) ? "up" : "dn";
          return <Tile key={tile.id} label={tile.label} val={tile.disp} dir={dir} delta={deltaLabel(delta)} sub={i === 2 ? data.funnel.steps[data.funnel.worst] : tile.sub} />;
        })}
      </div>

      <div style={{ margin: "16px 0" }}>
        <ChartCard
          eyebrow="Workflow funnel · API event sequence"
          title={`${data.modName} — completion funnel`}
          purpose="Shows the API-provided event steps, reach and drop-off for the selected module and sub-module."
        >
          {data.funnel.steps.length ? <div className="funnel">
            {data.funnel.steps.map((step, i) => {
              const reach = data.funnel.reaches[i] ?? 0;
              const maxReach = Math.max(...data.funnel.reaches, 1);
              const width = Math.max(25, (reach / maxReach) * 100);
              const drop = data.funnel.dropPct[i];
              return <div key={`${step}-${i}`}>
                {drop != null && <div className="fdrop">▼ {drop}% drop-off</div>}
                <div className="fstep" style={{ width: `${width}%`, background: CHART.blue, borderRadius: 8 }} title={`${step}: ${reach.toLocaleString()} users`}>
                  {step}<span className="fsub">{reach.toLocaleString()} users</span>
                </div>
              </div>;
            })}
          </div> : <div className="sub2">No workflow funnel data for this selection.</div>}
        </ChartCard>
      </div>

      <div style={{ marginTop: 12 }}>
        <ChartCard eyebrow="Workflow event breakdown" title="All steps in this workflow" purpose="Event users, counts, sessions and completion returned for each workflow path by the analytics API.">
          <div className="tbl-wrap"><table className="pathtbl">
            <thead><tr><th>Event</th><th className="num">Users</th><th className="num">Events</th><th className="num">Sessions</th><th className="num">Completion</th></tr></thead>
            <tbody>{data.flowRows.map((row) => <tr key={row.path}><td>{row.path}</td><td className="num">{row.users.toLocaleString()}</td><td className="num">{row.events.toLocaleString()}</td><td className="num">{row.sessions.toLocaleString()}</td><td className="num">{row.comp == null ? "—" : `${row.comp}%`}</td></tr>)}</tbody>
          </table></div>
        </ChartCard>
      </div>

      <div style={{ marginTop: 12 }}>
        <ChartCard eyebrow="Entry screens · API results" title="Top entry screens" purpose="Entry screen visitors, views and bounce rates returned by the analytics API for the selected workflow.">
          <div className="tbl-wrap"><table className="pathtbl">
            <thead><tr><th>Screen</th><th className="num">Visitors</th><th className="num">Views</th><th className="num">Bounce</th></tr></thead>
            <tbody>{data.pathRows.map((row) => <tr key={row.path}><td>{row.path}</td><td className="num">{row.vis.toLocaleString()}</td><td className="num">{row.vw.toLocaleString()}</td><td className="num">{row.bo}%</td></tr>)}</tbody>
          </table></div>
        </ChartCard>
      </div>
    </section>
  );
}

export default Workflow;
