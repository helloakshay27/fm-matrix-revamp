import { ChartCard } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { ModuleNav } from '../components/ModuleNav';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/** Layer 3 — Workflow Usage. */
export function WorkflowSection() {
  const { vm, palette } = useCalendarDashboard();
  const { flows } = vm;
  const w = flows.workflow;

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

      <Tiles specs={flows.tiles} columns={4} />

      {w.incompleteNote && (
        <div className="bmnote crashnote">
          <span>&#9888;</span>
          <div>
            <b>Scope note on this funnel.</b> {w.incompleteNote}
          </div>
        </div>
      )}

      <ChartCard
        style={{ margin: '16px 0' }}
        eyebrow="Workflow funnel (real event sequence)"
        title={`${w.name} — completion funnel`}
        purpose="Shows step-by-step completion and drop-off for the selected workflow, using the real PostHog event names in sequence."
      >
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
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="All screens in this module"
        title="All screens in this module"
        purpose={`Every screen path inside ${w.name}, with users, events, sessions and completion rate for each — the module-scoped equivalent of the funnel above, at the individual-screen level.`}
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
            {flows.screens.map((row) => (
              <tr key={row.screen}>
                <td>{row.screen}</td>
                <td className="num">{row.users.toLocaleString()}</td>
                <td className="num">{row.events.toLocaleString()}</td>
                <td className="num">{row.sessions.toLocaleString()}</td>
                <td className="num">{row.completion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Session start signal"
        title="Session start signal"
        purpose="Unlike other products in this family, this catalogue documents no post-launch routing/destination property — app_launched is confirmed as “the first event of every session,” full stop, with no further breakdown of where a session lands next. app_launch_diagnostic is a real, second App Lifecycle & Diagnostics event, but is explicitly documented as debug-only — “Never fires in release builds” — so it is shown at true-to-code zero volume in production rather than omitted."
      >
        <table className="pathtbl">
          <thead>
            <tr>
              <th>Event</th>
              <th className="num">Sessions</th>
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
      </ChartCard>
    </section>
  );
}
