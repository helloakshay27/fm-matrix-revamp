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
  const { flows, status, declaredFunnel } = vm;
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
            filled with another module&rsquo;s numbers. The funnel below is still measured — it
            reads this workflow&rsquo;s declared catalogue events out of the app-wide event list,
            which is not scoped by <code>$pathname</code> and so does see mobile traffic.
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

        {/* How the numbers below were measured — a sequenced windowFunnel and a per-event
            count are not the same claim, so the card says which one it is showing. */}
        {declaredFunnel.source === 'events' && (
          <p className="scope-note">
            <span>&#9888;</span>
            <span>
              Step reach here is each event&rsquo;s own distinct-user count, not a sequenced
              funnel — a user counted at a later step is not proven to have passed the earlier
              ones. The endpoint computes a real <code>windowFunnel</code> for flows declared in
              its own <code>config/workflows.yml</code>, but that file currently carries only the
              Runwal specs; once Vi&rsquo;s flows are added there this card switches to it with
              no change here.
            </span>
          </p>
        )}
        {declaredFunnel.source === 'declared' && !declaredFunnel.dataComplete && (
          <p className="scope-note">
            <span>&#9888;</span>
            <span>
              At least one step of this flow is not instrumented anywhere in the tenant, so the
              completion rate is short for want of a measurement, not because employees
              abandoned the flow. The steps below say which.
            </span>
          </p>
        )}

        {/*
          `empty` is held false on purpose: a funnel with no traffic still lists its declared
          steps, so the reader can see WHICH events it is waiting on rather than a bare
          "no data" line.
        */}
        {/* A workflow with no module mapping is never going to be answered by the module-scoped
            query, so it must not sit behind that query's loading state — that spins forever on
            a result we have already decided to ignore. It is measured against the app-wide
            event list instead. */}
        <Guard status={onWeb ? status.flows : { loading: false, error: null }} empty={false}>
          {!onWeb || funnel.steps.length === 0 ? (
            /*
              The endpoint's auto-derived funnel can only scope by $pathname, which mobile
              events do not carry — so for the Vi app's own flows it comes back empty even
              while those events sit in the app-wide list. Fall back to the catalogue's
              declared step order and read each step's reach out of that list instead:
              real event names from the catalogue, real numbers from the API.
            */
            <div className="funnel">
              {declaredFunnel.steps.map((s, i) => (
                <div key={s.step}>
                  {s.dropPct != null && s.dropPct > 0 && (
                    <div className="fdrop">▼ {Math.round(s.dropPct)}% drop-off</div>
                  )}
                  <div
                    className={`fstep${s.awaiting ? ' fstep-empty' : ''}`}
                    style={
                      s.awaiting
                        ? undefined
                        : {
                            width: `${45 + (s.ofEntrants ?? 0) * 55}%`,
                            background: i === declaredFunnel.worst ? palette.amber : palette.blue,
                            opacity: 1 - i * 0.1,
                            borderRadius: 8,
                          }
                    }
                    title={
                      s.awaiting
                        ? `${s.step}: no events in range`
                        : `${s.step}: ${Math.round((s.ofEntrants ?? 0) * 100)}% of entrants remain (${fmtC(
                            s.users ?? 0,
                          )} users)`
                    }
                  >
                    {s.step}
                    <span className="fsub">
                      {s.uninstrumented
                        ? 'not instrumented — event never emitted'
                        : s.awaiting
                          ? 'awaiting data'
                          : `${Math.round((s.ofEntrants ?? 0) * 100)}% of entrants · ${fmtC(
                              s.users ?? 0,
                            )} users`}
                    </span>
                  </div>
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

      <ChartCard
        className="mt12"
        eyebrow="All screens in this module (F-scr)"
        title="All screens in this module"
        purpose={INFO['chart.flowList'].f}
      >
        {/*
          Rows are this workflow's own declared steps, not the module's raw sub-paths: the
          sub-path list only exists for web modules ($pathname), and it answers a different
          question anyway. Same source as the funnel above, so the two always agree.
          Completion is each step's share of the funnel's entrants — the endpoint returns
          `f_comp: null` on every per-flow row, so there is no server-side completion to show.
        */}
        <Guard
          status={onWeb ? status.flows : { loading: false, error: null }}
          empty={declaredFunnel.steps.length === 0}
          emptyLabel="This workflow declares no steps."
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
              {declaredFunnel.steps.map((s) => (
                <tr key={s.step}>
                  <td title={s.uninstrumented ? 'Not emitted anywhere in the tenant' : undefined}>
                    {s.step}
                  </td>
                  <td className="num">{s.users == null ? '—' : fmtC(s.users)}</td>
                  <td className="num">{s.events == null ? '—' : fmtC(s.events)}</td>
                  <td className="num">{s.sessions == null ? '—' : fmtC(s.sessions)}</td>
                  <td className="num" title="Share of the workflow's entrants that reached this step">
                    {s.ofEntrants == null ? '—' : `${Math.round(s.ofEntrants * 100)}%`}
                  </td>
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
