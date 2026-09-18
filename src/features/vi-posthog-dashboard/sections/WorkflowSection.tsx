import { INFO } from '@/features/posthog-dashboard/data/constants';
import { fmtC } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Tile } from '../components/Tile';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';
import { toModuleLabel } from '../data/usageChart';

/** Layer 3 — module nav + workflow_usage (tiles, funnel, flow list, entry screens). */
export function WorkflowSection() {
  const { vm, palette } = useViDashboard();
  const { flows, status, state } = vm;
  const { funnel } = flows;
  // The raw key is what was queried; the label is what the chips and headings read.
  const moduleName = state.module ?? '—';
  const moduleLabel = state.module ? toModuleLabel(state.module) : '—';
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

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {toViTiles(flows.tiles).map((t) => (
          <Tile key={t.id} spec={t} />
        ))}
      </div>

      <ChartCard
        className="my16"
        eyebrow="Workflow funnel (real event sequence)"
        title={`${moduleLabel} — completion funnel`}
        purpose="Shows step-by-step completion and drop-off for the selected module, using the real PostHog event names in the sequence the endpoint derived them in."
      >
        {/*
          Steps, reach and drop-off are the response's own `funnel` block — the server derives
          the sequence from the module's real events (`funnel_source: "events"`) rather than
          from any list held in this app, so the card follows whatever the module actually
          emits in the window.
        */}
        <Guard
          status={status.flows}
          empty={funnel.steps.length === 0}
          emptyLabel={`No event sequence returned for ${moduleName} in this window.`}
        >
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
                  <span className="fsub">
                    {pctOfEntrants(funnel.reaches[i])}% of entrants · {fmtC(funnel.reaches[i])} users
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Guard>
      </ChartCard>

      <ChartCard
        className="mt12"
        eyebrow="All screens in this module (F-scr)"
        title="All screens in this module"
        purpose={INFO['chart.flowList'].f}
      >
        {/* The response's own `flows` rows for the selected module — the same call the funnel
            above reads, so the two always agree. `f_comp` comes back null per row on this
            endpoint, which is why Completion can read "—". */}
        <Guard
          status={status.flows}
          empty={flows.flowRows.length === 0}
          emptyLabel="No screens recorded for this module."
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
                  <td className="num">{fmtC(row.users)}</td>
                  <td className="num">{fmtC(row.events)}</td>
                  <td className="num">{fmtC(row.sessions)}</td>
                  <td className="num">{row.comp == null ? '—' : `${Math.round(row.comp)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>

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
