import { Fragment } from 'react';
import { ChartCard } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { Guard } from '@/features/analytics-dashboard-shared/components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import { findWorkflow } from '../data/constants';
import { toCalendarTiles } from '../data/calendarMetricIds';

export function WorkflowSection() {
  const { vm, palette, workflow } = useCalendarDashboard();
  const { flows, status } = vm;
  const w = findWorkflow(workflow);

  /** No web route for this workflow — the endpoint is never called. See data/constants.ts. */
  const notOnWeb = w.apiModule == null;

  const funnel = flows.funnel;
  const hasFunnel = funnel.steps.length > 0;

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          User completion of key app workflows per module, all-modules comparison, and where
          sessions enter &amp; exit.
        </span>
      </div>

      <ModuleNav />

      <Guard status={status.flows}>
        <Tiles specs={toCalendarTiles(flows.tiles)} columns={4} />
      </Guard>

      {notOnWeb ? (
        <div className="bmnote crashnote">
          <span>⚠</span>
          <div>
            <b>No web screen for this workflow.</b> {w.name} is not a flow the FM Matrix web
            calendar can serve — its catalogue events come from the mobile Calendar app. The
            workflow_usage endpoint derives funnels from route segments, and querying it
            without a module would return the Helpdesk default instead, so this card is left
            unqueried rather than filled with another module's numbers.
          </div>
        </div>
      ) : (
        w.incompleteNote && (
          <div className="bmnote crashnote">
            <span>⚠</span>
            <div>
              <b>Scope note on this funnel.</b> {w.incompleteNote}
            </div>
          </div>
        )
      )}

      <ChartCard
        style={{ margin: '16px 0' }}
        eyebrow="Workflow funnel"
        title={`${w.name} — completion funnel`}
        purpose="Step-by-step completion and drop-off for the selected workflow. The endpoint infers steps from real route patterns rather than from the catalogue event names listed on the tab, so read this as activity on the workflow's screen until the backend groups on the instrumented step events."
      >
        <Guard status={status.flows}>
          {!hasFunnel ? (
            /* No measured funnel back from the API. Rather than an empty box, show the
               catalogue's own declared steps — greyed, with no numbers — so a reviewer can see
               what this funnel IS once it reports, and can tell "not instrumented yet" apart
               from "instrumented and nobody used it". Every step name here is from the
               catalogue, and none of them carries a value. */
            <>
              <div className="state">
                {notOnWeb
                  ? 'Awaiting data — this workflow has no web screen, so the endpoint is not queried.'
                  : 'No measured funnel for this filter set yet. Declared steps from the catalogue:'}
              </div>
              <div className="funnel" style={{ marginTop: 10, opacity: 0.5 }}>
                {w.steps.map((step, i) => (
                  <div
                    key={step}
                    className="fstep"
                    style={{
                      width: `${100 - i * 6}%`,
                      background: 'var(--surface-3)',
                      color: 'var(--muted)',
                      borderRadius: 8,
                    }}
                    title={`${step} — declared in the catalogue, not measured`}
                  >
                    {step}
                    <span className="fsub">declared · awaiting data</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
          <div className="funnel">
            {/* Drop label and step bar are siblings, not nested — `.funnel` is a flex column
                whose 9px gap has to fall between them. */}
            {funnel.steps.map((step, i) => {
              const reach = funnel.reaches[i] ?? 0;
              const top = funnel.reaches[0] || 1;
              const remaining = Math.round((reach / top) * 100);
              const width = 45 + (remaining / 100) * 55;
              const drop = funnel.dropPct[i];
              return (
                <Fragment key={`${step}-${i}`}>
                  {i > 0 && drop != null && (
                    <div className="fdrop">▼ {Math.round(drop)}% drop-off</div>
                  )}
                  <div
                    className="fstep"
                    style={{
                      width: `${width}%`,
                      background: i === funnel.worst ? palette.red : palette.blue,
                      opacity: 1 - i * 0.1,
                      borderRadius: 8,
                    }}
                    title={`${step}: ${reach.toLocaleString()} users (${remaining}% of entrants)`}
                  >
                    {step}
                    <span className="fsub">
                      {reach.toLocaleString()} users · {remaining}% of entrants
                    </span>
                  </div>
                </Fragment>
              );
            })}
          </div>
          )}
        </Guard>
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="All screens in this module"
        title="All screens in this module"
        purpose={`Every screen path inside ${w.name}, with users, events, sessions and completion rate for each — the module-scoped equivalent of the funnel above, at the individual-screen level.`}
      >
        <Guard
          status={status.flows}
          empty={flows.flowRows.length === 0}
          emptyLabel={notOnWeb ? 'Awaiting data — this workflow has no web screen.' : 'No screens recorded.'}
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
                  <td className="num">{row.comp == null ? '—' : `${Math.round(row.comp)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Session entry points"
        title="Where sessions start"
        purpose="The screens sessions land on first, with visitors, views and bounce rate for each. The Calendar catalogue documents no routing/destination property of its own, so this is the endpoint's path-level view rather than a catalogue breakdown."
      >
        <Guard
          status={status.flows}
          empty={flows.pathRows.length === 0}
          emptyLabel={notOnWeb ? 'Awaiting data — this workflow has no web screen.' : 'No entry screens recorded.'}
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
                  <td className="num">{row.vis.toLocaleString()}</td>
                  <td className="num">{row.vw.toLocaleString()}</td>
                  <td className="num">{Math.round(row.bo)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>
    </section>
  );
}
