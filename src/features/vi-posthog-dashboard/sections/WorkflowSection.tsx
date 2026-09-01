import { INFO } from '@/features/posthog-dashboard/data/constants';
import { fmtC } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { ModuleNav } from '../components/ModuleNav';
import { Tile } from '../components/Tile';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';

/** Layer 3 — modules (nav) + workflow_usage (tiles, funnel, flow list, entry screens). */
export function WorkflowSection() {
  const { vm, palette } = useViDashboard();
  const { flows, status } = vm;
  const { funnel } = flows;
  const maxReach = Math.max(...funnel.reaches, 1);

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Completion of the selected module&rsquo;s workflows, and where users navigate &amp; exit.
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
        eyebrow="Workflow funnel"
        title={`${flows.modName} — ${flows.flagshipFunnelName}`}
        purpose={INFO['chart.funnel'].f}
      >
        <Guard
          status={status.flows}
          empty={funnel.steps.length === 0}
          emptyLabel="No funnel recorded for this module."
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
                    width: `${45 + (funnel.reaches[i] / maxReach) * 55}%`,
                    background: i === funnel.worst ? palette.amber : palette.blue,
                    opacity: 1 - i * 0.08,
                    borderRadius: 8,
                  }}
                  title={`${step}: ${funnel.reaches[i]} reached`}
                >
                  {step}
                  <span className="fsub">{fmtC(funnel.reaches[i])} reached</span>
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
                    {row.dv != null && <span className={`arrow ${row.dv >= 0 ? 'up' : 'dn'}`}> {row.dv >= 0 ? '↗' : '↘'}</span>}
                  </td>
                  <td className="num">
                    {row.vw.toLocaleString()}
                    {row.dw != null && <span className={`arrow ${row.dw >= 0 ? 'up' : 'dn'}`}> {row.dw >= 0 ? '↗' : '↘'}</span>}
                  </td>
                  <td className="num">
                    {row.bo.toFixed(1)}%
                    {row.db != null && <span className={`arrow ${row.db <= 0 ? 'up' : 'dn'}`}> {row.db <= 0 ? '↘' : '↗'}</span>}
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
