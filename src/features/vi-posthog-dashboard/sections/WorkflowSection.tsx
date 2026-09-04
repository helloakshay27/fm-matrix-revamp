import { INFO } from '@/features/posthog-dashboard/data/constants';
import { fmtC } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Tile } from '../components/Tile';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';
import { findWorkflow } from '../data/workflows';

/** Layer 3 — workflow nav + workflow_usage (tiles, funnel, flow list, entry screens). */
export function WorkflowSection() {
  const { vm, palette, workflow } = useViDashboard();
  const wf = findWorkflow(workflow);
  // A workflow with no route mapping has no screen in this web app at all — it is a
  // mobile-only employee flow. The endpoint would silently fall back to its maintenance/ticket
  // default and the cards below would print Helpdesk numbers under this workflow's name, so
  // nothing API-backed is shown for it.
  const onWeb = wf.apiModule !== null;
  const { flows, status } = vm;
  const { funnel } = flows;
  // The reference reads every step as a share of the people who ENTERED the funnel, not as
  // a share of the largest step — so step 1 is always 100% and the bars fall from there.
  // reaches[0] is the entrant count; guard it so a zero-reach funnel cannot divide by zero.
  const entrants = funnel.reaches[0] || 0;
  const pctOfEntrants = (reach: number) => (entrants > 0 ? Math.round((reach / entrants) * 100) : 0);

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Employee completion of key workplace-service workflows per module, all-modules
          comparison, and where employees navigate &amp; exit.
        </span>
      </div>

      <ModuleNav />

      {onWeb ? (
        <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
          {toViTiles(flows.tiles).map((t) => (
            <Tile key={t.id} spec={t} />
          ))}
        </div>
      ) : (
        <p className="scope-note">
          <span>&#9888;</span>
          <span>
            <b>{wf.name}</b> has no screen in the web app — it is an employee flow in the Vi
            mobile app, so its events arrive with <code>client = &apos;vi&apos;</code> rather than
            from here. The per-module tiles and screen tables are hidden for it rather than
            filled with another module&rsquo;s numbers; the funnel below lists the catalogue
            events it is waiting on.
          </span>
        </p>
      )}

      <ChartCard
        className="my16"
        eyebrow="Workflow funnel (real event sequence)"
        title={`${wf.name} — completion funnel`}
        purpose="Shows step-by-step completion and drop-off for the selected workflow, using the real PostHog event names in sequence."
      >
        {wf.caveat && <p className="scope-note">{wf.caveat}</p>}

        {/*
          `empty` is held false on purpose. Rather than a bare "no data" line, an empty funnel
          falls back to the workflow's declared catalogue steps so the reader can see WHICH
          events it is waiting on. Most of these are emitted by the Vi Flutter app
          (client = 'vi'), not by this web app, so an empty funnel here usually means no mobile
          traffic in range rather than a broken workflow.
        */}
        {/* A workflow with no module mapping is never going to be answered by this query, so
            it must not sit behind the query's loading state — that spins forever on a result
            we have already decided to ignore. Show its declared steps straight away. */}
        <Guard status={onWeb ? status.flows : { loading: false, error: null }} empty={false}>
          {!onWeb || funnel.steps.length === 0 ? (
            <div className="funnel">
              {wf.steps.map((step) => (
                <div
                  key={step}
                  className="fstep fstep-empty"
                  title={`${step}: no events in range`}
                >
                  {step}
                  <span className="fsub">awaiting data</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="funnel">
              {funnel.steps.map((step, i) => (
                <div key={`${step}-${i}`}>
                  {funnel.dropPct[i] != null && i > 0 && (
                    <div className="fdrop">▼ {Math.round(funnel.dropPct[i]!)}% drop-off</div>
                  )}
                  <div
                    className="fstep"
                    style={{
                      width: `${45 + (pctOfEntrants(funnel.reaches[i]) / 100) * 55}%`,
                      background: i === funnel.worst ? palette.amber : palette.blue,
                      opacity: 1 - i * 0.1,
                      borderRadius: 8,
                    }}
                    title={`${step}: ${pctOfEntrants(funnel.reaches[i])}% of entrants remain (${fmtC(
                      funnel.reaches[i],
                    )} users)`}
                  >
                    {step}
                    <span className="fsub">{pctOfEntrants(funnel.reaches[i])}% of entrants</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Guard>
      </ChartCard>

      {onWeb && (
      <ChartCard
        className="mt12"
        eyebrow="All screens in this module (F-scr)"
        title="All screens in this module"
        purpose={INFO['chart.flowList'].f}
      >
        <Guard
          status={status.flows}
          empty={flows.flowRows.length === 0}
          emptyLabel="No sub-paths recorded under this module."
        >
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
              {flows.flowRows.map((row) => (
                <tr key={row.path}>
                  <td>{row.path}</td>
                  <td className="num">{row.users.toLocaleString()}</td>
                  <td className="num">{row.events.toLocaleString()}</td>
                  <td className="num">{row.sessions.toLocaleString()}</td>
                  <td className="num">{row.comp == null ? '—' : `${row.comp.toFixed(1)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>
      )}

      <ChartCard
        className="mt12"
        eyebrow="Top entry screens (F-entry) · org-wide, not module-filtered"
        title="Where people start"
        purpose={INFO['chart.path'].f}
      >
        <Guard
          status={status.flows}
          empty={flows.pathRows.length === 0}
          emptyLabel="No entry screens recorded."
        >
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
              {flows.pathRows.map((row) => (
                <tr key={row.path}>
                  <td>{row.path}</td>
                  <td className="num">
                    {row.vis.toLocaleString()}
                    {row.dv != null && (
                      <span className={`arrow ${row.dv >= 0 ? 'up' : 'dn'}`}>
                        {' '}
                        {row.dv >= 0 ? '↗' : '↘'}
                      </span>
                    )}
                  </td>
                  <td className="num">
                    {row.vw.toLocaleString()}
                    {row.dw != null && (
                      <span className={`arrow ${row.dw >= 0 ? 'up' : 'dn'}`}>
                        {' '}
                        {row.dw >= 0 ? '↗' : '↘'}
                      </span>
                    )}
                  </td>
                  <td className="num">
                    {row.bo.toFixed(1)}%
                    {row.db != null && (
                      <span className={`arrow ${row.db <= 0 ? 'up' : 'dn'}`}>
                        {' '}
                        {row.db <= 0 ? '↘' : '↗'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>
    </section>
  );
}
