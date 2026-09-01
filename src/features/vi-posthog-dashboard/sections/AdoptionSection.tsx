import {
  GROWTH_WEEKS,
  INFO,
  TREND_WEEKS,
} from '@/features/posthog-dashboard/data/constants';
import { fmtDur, pct } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { Tile } from '../components/Tile';
import { LineChart } from '../components/charts/LineChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';

/** Layer 2 — adoption_engagement, adoption_trend, growth, retention, roles + the site league. */
export function AdoptionSection() {
  const { vm, setCircle, palette } = useViDashboard();
  const { adopt, siteHealth, status, scopedSites } = vm;

  const retentionCols = adopt.retentionCohorts[0]?.length ?? 0;

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">
          Measure how effectively employees adopt and engage with the app&rsquo;s major modules, and
          whether they keep coming back day over day.
        </span>
      </div>
      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules and workplace services receive the highest engagement and adoption?</li>
          <li>Are employees returning to the application, and is retention improving over time?</li>
          <li>How does usage differ across roles and across sites?</li>
        </ul>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 16 }}>
        {toViTiles(adopt.tiles).map((t) => (
          <Tile key={t.id} spec={t} />
        ))}
      </div>

      <ChartCard
        className="mt12"
        eyebrow="Adoption trend chart (A6)"
        title={`Adoption trend (last ${TREND_WEEKS} weeks)`}
        purpose={INFO['chart.adoptTrend'].f}
      >
        <Guard
          status={status.adopt}
          empty={!adopt.trendChart.cur.some((v) => v > 0)}
          emptyLabel="No weekly activity recorded."
        >
          <LineChart
            cur={adopt.trendChart.cur}
            prev={adopt.trendChart.prev.length ? adopt.trendChart.prev : null}
            labels={adopt.trendChart.labels}
            color={palette.blue}
            fill={palette.fill}
          />
          <div className="legend">
            <span>
              <i style={{ background: palette.blue }} /> Weekly active users
            </span>
            {adopt.trendChart.prev.length > 0 && (
              <span>
                <i className="dash" /> Previous period
              </span>
            )}
          </div>
        </Guard>
      </ChartCard>

      <div className="grid2">
        <ChartCard
          eyebrow={`Growth accounting (A7) · last ${GROWTH_WEEKS} weeks`}
          title="New · Returning · Resurrected · Dormant"
          purpose={INFO['chart.growth'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.growthWeeks.length === 0}
            emptyLabel="No growth data for this filter set."
          >
            <StackedBarChart
              labels={adopt.growthWeeks.map((w) => w.label)}
              series={[
                { label: 'New', data: adopt.growthWeeks.map((w) => w.nw), color: palette.blue },
                { label: 'Returning', data: adopt.growthWeeks.map((w) => w.ret), color: palette.green },
                { label: 'Resurrected', data: adopt.growthWeeks.map((w) => w.res), color: palette.mint },
              ]}
              negSeries={{
                label: 'Dormant',
                data: adopt.growthWeeks.map((w) => w.dorm),
                color: palette.red,
              }}
            />
            <div className="legend">
              <span>
                <i style={{ background: palette.blue }} /> New
              </span>
              <span>
                <i style={{ background: palette.green }} /> Returning
              </span>
              <span>
                <i style={{ background: palette.mint }} /> Resurrected
              </span>
              <span>
                <i style={{ background: palette.red }} /> Dormant
              </span>
            </div>
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Retention cohort grid (A8)"
          title="Do new users keep coming back?"
          purpose={INFO['chart.retention'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.retentionCohorts.length === 0}
            emptyLabel="No cohorts in this window."
          >
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cohort · size</th>
                  {Array.from({ length: retentionCols }, (_, w) => (
                    <th key={w}>Week {w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adopt.retentionCohorts.map((row, i) => (
                  <tr key={adopt.retentionRowLabels[i]}>
                    <td className="lbl">{adopt.retentionRowLabels[i]}</td>
                    {row.map((v, w) => {
                      if (v == null) {
                        return (
                          <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>
                            ·
                          </td>
                        );
                      }
                      const t = v / 100;
                      return (
                        <td
                          key={w}
                          style={{
                            background: `rgba(${palette.heatRgb},${(palette.heatA0 + t * palette.heatA1).toFixed(2)})`,
                            color: t > 0.55 ? palette.onHeat : 'var(--ink)',
                          }}
                        >
                          {v}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Guard>
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Adoption by role (A9)"
          title="Who is (and isn't) using the app"
          purpose={INFO['chart.role'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.roleShares.length === 0}
            emptyLabel="No role breakdown for this filter set."
          >
            <div className="hbars">
              {adopt.roleShares.map((r) => (
                <div className="role" key={r.name}>
                  <div className="rn" title={`${r.users} users`}>
                    {r.name}
                  </div>
                  <div className="rbar">
                    <i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }} />
                  </div>
                  <div className="rv">{pct(r.share)}</div>
                </div>
              ))}
            </div>
            <div className="bmnote" style={{ marginTop: 12 }}>
              <span>&#8505;</span>
              <div>
                The reference specifies A9 as a split by <b>employment type</b> (Internal FTE vs.
                External contractor/vendor). No such property exists on any event in the
                catalogue &mdash; the reference itself tags A9 &ldquo;proposed&rdquo;, reasoning by
                analogy from the M-Safe dashboard. This card shows the <code>role</code> split,
                which is a confirmed context property, until employment type is instrumented.
              </div>
            </div>
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Dormant users (A10)"
          title="Dormant users"
          purpose="Users who were active before but have gone quiet — the mirror image of the activation tile above."
        >
          <Guard status={status.adopt}>
            <div className="kv">
              <div>
                <div className="k">Dormant users</div>
                <div className="v" style={{ fontSize: 22 }}>
                  {adopt.dormantKv}
                </div>
                <div className="u">no recent activity</div>
              </div>
              <div>
                <div className="k">Module breadth (A5)</div>
                <div className="v" style={{ fontSize: 22 }}>
                  {adopt.breadthKv}
                </div>
                <div className="u">modules in use</div>
              </div>
            </div>
          </Guard>
        </ChartCard>
      </div>

      {scopedSites.length > 1 && (
        <ChartCard
          className="mt12"
          eyebrow="League table (A12)"
          title="Circle-wise breakdown"
          purpose={INFO['chart.siteHealth'].f}
        >
          <Guard
            status={status.siteHealth}
            empty={!siteHealth || siteHealth.rows.length === 0}
            emptyLabel="No per-circle activity in this window."
          >
            <table className="league">
              <thead>
                <tr>
                  <th>Circle</th>
                  <th className="num">Active users</th>
                  <th className="num">Sessions</th>
                  <th className="num">Avg session</th>
                  <th className="num">Bounce</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(siteHealth?.rows ?? []).map((row) => {
                  // §7.2 A12 bands, keyed off bounce rate.
                  const [cls, label] =
                    row.bounce >= 22
                      ? ['st-drop', 'Watch']
                      : row.bounce >= 16
                        ? ['st-watch', 'Steady']
                        : ['st-healthy', 'Healthy'];
                  const arrow = row.trend == null ? 'flat' : row.trend > 0 ? 'up' : row.trend < 0 ? 'dn' : 'flat';
                  return (
                    <tr
                      key={row.siteId}
                      className="rowlink"
                      // One-shot so the scope never lands on an intermediate value.
                      onClick={() => setCircle('t1', row.siteId)}
                      title={`Drill into ${row.name}`}
                    >
                      <td className="strong">{row.name}</td>
                      <td className="num">{row.users.toLocaleString()}</td>
                      <td className="num">{row.sessions.toLocaleString()}</td>
                      <td className="num">{fmtDur(row.durSec)}</td>
                      <td className="num">{row.bounce.toFixed(1)}%</td>
                      <td>
                        <span className={`arrow ${arrow}`}>
                          {arrow === 'up' ? '↗' : arrow === 'dn' ? '↘' : '→'}
                          {row.trend != null && ` ${Math.abs(row.trend)}%`}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${cls}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Guard>
        </ChartCard>
      )}
    </section>
  );
}
