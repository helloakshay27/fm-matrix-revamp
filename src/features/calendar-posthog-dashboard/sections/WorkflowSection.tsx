import { ChartCard } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { ModuleNav } from '../components/ModuleNav';
import { Tiles } from '../components/Tile';
import { SkeletonFunnel, SkeletonTable } from '../components/Skeleton';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/** Layer 3 — Workflow Usage. */
export function WorkflowSection() {
  const { vm, palette, flowsLoading } = useCalendarDashboard();
  const { flows } = vm;
  const w = flows.workflow;

  return (
    <section className="page on" id="pgFlows">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          User completion of key app workflows per module, all-modules comparison, and where
          sessions enter &amp; exit.
        </span>
      </div>

      <ModuleNav />

      <Tiles specs={flows.tiles} columns={4} id="wfKpis" className="tiles-4" loading={flowsLoading} />

      <div id="wfScopeNote">
        {w.incompleteNote && (
          <div className="bmnote crashnote">
            <span>&#9888;</span>
            <div>
              <b>Scope note on this funnel.</b> {w.incompleteNote}
            </div>
          </div>
        )}
      </div>

      <ChartCard
        id="card-wfFunnel"
        style={{ margin: '16px 0' }}
        eyebrow="Workflow funnel (real event sequence)"
        title={`${w.name} — completion funnel`}
        purpose="Shows step-by-step completion and drop-off for the selected workflow, using the real PostHog event names in sequence."
      >
        {flowsLoading ? (
          <SkeletonFunnel />
        ) : flows.funnel.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No workflow events recorded for this module in the selected period
          </div>
        ) : (
          <div className="funnel">
            {flows.funnel.map((s, i) => (
              <div key={s.step}>
                {s.dropPct != null && <div className="fdrop">▼ {s.dropPct}% drop-off</div>}
                <div
                  className="fstep"
                  style={{
                    width: `${45 + (s.ofEntrants / 100) * 55}%`,
                    background: palette.blue,
                    opacity: 1 - i * 0.1,
                    borderRadius: 8,
                  }}
                  title={`${s.step}: ${s.ofEntrants}% of entrants remain`}
                >
                  {s.step}
                  <span className="fsub">{s.ofEntrants}% of entrants</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      <ChartCard
        id="card-allScreens"
        style={{ marginTop: 12 }}
        eyebrow="All screens in this module"
        title="All screens in this module"
        purpose={`Every screen path inside ${w.name}, with users, events, sessions and completion rate for each — the module-scoped equivalent of the funnel above, at the individual-screen level.`}
      >
        {flowsLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : flows.screens.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No screen activity recorded for this module in the selected period
          </div>
        ) : (
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
              {flows.screens.map((row) => (
                <tr key={row.screen}>
                  <td>{row.screen}</td>
                  <td className="num">{row.users.toLocaleString()}</td>
                  <td className="num">{row.events.toLocaleString()}</td>
                  <td className="num">{row.sessions.toLocaleString()}</td>
                  <td className="num">{row.completion != null ? `${row.completion}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ChartCard>

      <ChartCard
        id="card-entryScreens"
        style={{ marginTop: 12 }}
        eyebrow="Session start signal"
        title="Session start signal"
        purpose="The first screen or event recorded per session app-wide."
      >
        {flowsLoading ? (
          <SkeletonTable rows={4} cols={4} />
        ) : flows.entryRows.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No entry screens recorded for this period
          </div>
        ) : (
          <table className="pathtbl">
            <thead>
              <tr>
                <th>Event / Screen</th>
                <th className="num">Visitors</th>
                <th className="num">Views</th>
                <th>Build</th>
              </tr>
            </thead>
            <tbody>
              {flows.entryRows.map((row) => (
                <tr key={row.event}>
                  <td>{row.event}</td>
                  <td className="num">{row.sessions.toLocaleString()}</td>
                  <td className="num">{row.views.toLocaleString()}</td>
                  <td>{row.build}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ChartCard>
    </section>
  );
}
