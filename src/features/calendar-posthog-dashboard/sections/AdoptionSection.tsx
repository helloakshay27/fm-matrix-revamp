import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { StackedBarChart } from '@/features/analytics-dashboard-shared/charts/StackedBarChart';
import { Tiles } from '../components/Tile';
import { SkeletonChart, SkeletonTable, SkeletonBox } from '../components/Skeleton';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/** Layer 2 — Adoption & Engagement. */
export function AdoptionSection() {
  const { vm, palette, adoptLoading } = useCalendarDashboard();
  const { adopt } = vm;

  const itemColor = [palette.blue, palette.violet, palette.green];

  return (
    <section className="page on" id="pgAdopt">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">
          Measure how effectively users adopt and engage with the app’s major modules, and whether
          they keep coming back day over day.
        </span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules receive the highest engagement and adoption?</li>
          <li>Which modules need UX improvements, and where do users spend the most time?</li>
          <li>Are users returning to daily use, and is retention improving over time?</li>
          <li>
            What kind of item (event / task / reminder) do users create most, and how does usage
            differ by connected provider?
          </li>
        </ul>
      </div>

      <Tiles specs={adopt.tiles} columns={3} style={{ marginTop: 16 }} id="tilesAdoption" loading={adoptLoading} />

      <ChartCard
        id="card-adoptionTrend"
        style={{ marginTop: 12 }}
        eyebrow="Trend · SVG line chart"
        title="Adoption trend (weekly active users, last 8 weeks)"
        purpose="Weekly active users over the last 8 weeks — the trend line behind the Adoption Trend tile above."
      >
        {adoptLoading ? (
          <SkeletonChart height={200} />
        ) : adopt.trend.values.length === 0 ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No trend data recorded for this period
          </div>
        ) : (
          <>
            <LineChart
              palette={palette}
              cur={adopt.trend.values}
              prev={null}
              labels={adopt.trend.labels}
              color={palette.blue}
              fill={palette.fill}
            />
            <Legend items={[{ label: 'Weekly active users', color: palette.blue }]} />
          </>
        )}
      </ChartCard>

      <div className="grid2">
        <ChartCard
          id="card-growthAccounting"
          eyebrow="Growth accounting · Last 6 weeks"
          title="New · Returning · Resurrecting · Dormant"
          purpose="Breaks the active base into new signups, retained users, win-backs and users going quiet — a fuller view than a simple new-vs-returning split."
        >
          {adoptLoading ? (
            <SkeletonChart height={220} />
          ) : adopt.growth.length === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No growth accounting data recorded
            </div>
          ) : (
            <>
              <StackedBarChart
                palette={palette}
                labels={adopt.growth.map((w) => w.label)}
                series={[
                  { label: 'New', data: adopt.growth.map((w) => w.nw), color: palette.blue },
                  { label: 'Returning', data: adopt.growth.map((w) => w.ret), color: palette.green },
                  { label: 'Resurrecting', data: adopt.growth.map((w) => w.res), color: palette.mint },
                ]}
                negSeries={{ label: 'Dormant', data: adopt.growth.map((w) => w.dorm), color: palette.red }}
              />
              <Legend
                items={[
                  { label: 'New', color: palette.blue },
                  { label: 'Returning', color: palette.green },
                  { label: 'Resurrecting', color: palette.mint },
                  { label: 'Dormant', color: palette.red },
                ]}
              />
            </>
          )}
        </ChartCard>

        <ChartCard
          id="card-retentionCohort"
          eyebrow="Retention · weekly cohorts"
          title="Do new users keep coming back?"
          purpose="Each row = users first active that week; cells = % of that cohort still active N weeks later."
        >
          {adoptLoading ? (
            <SkeletonTable rows={4} cols={5} />
          ) : adopt.retention.rows.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No retention cohorts recorded for this period
            </div>
          ) : (
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cohort</th>
                  {Array.from({ length: adopt.retention.weeks }, (_, w) => (
                    <th key={w}>Week {w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adopt.retention.rows.map((row, i) => (
                  <tr key={adopt.retention.labels[i] ?? i}>
                    <td className="lbl">{adopt.retention.labels[i]}</td>
                    {row.map((v, w) =>
                      v == null ? (
                        <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>
                          ·
                        </td>
                      ) : (
                        <td
                          key={w}
                          title={`${adopt.retention.labels[i]} · Week ${w}: ${v}% retained`}
                          style={{
                            background: `rgba(${palette.heatRgb},${(
                              palette.heatA0 +
                              (v / 100) * palette.heatA1
                            ).toFixed(2)})`,
                            color: v / 100 > 0.55 ? palette.onHeat : 'var(--ink)',
                            cursor: 'default',
                          }}
                        >
                          {v}%
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          id="card-roleSplit"
          eyebrow="Adoption by item type"
          title="Top screens & modules"
          purpose="Distribution of custom events across top screens in calendar app."
        >
          {adoptLoading ? (
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SkeletonBox width={80} height={13} />
                <SkeletonBox width="60%" height={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SkeletonBox width={80} height={13} />
                <SkeletonBox width="40%" height={14} />
              </div>
            </div>
          ) : adopt.itemTypes.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No item type distribution available
            </div>
          ) : (
            <div className="hbars">
              {adopt.itemTypes.map((row, i) => (
                <div
                  className="role"
                  key={row.label}
                  title={`${row.label}: ${Math.round(row.share * 100)}% share`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rn">{row.label}</div>
                  <div className="rbar">
                    <i style={{ width: `${Math.round(row.share * 100)}%`, background: itemColor[i % itemColor.length] }} />
                  </div>
                  <div className="rv">{Math.round(row.share * 100)}%</div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard
          id="card-dormant"
          eyebrow="Dormant users"
          title="Dormant users"
          purpose="Registered users with no activity in the last 14 days — out of scope for the 14-Day Activation tile above."
        >
          <div className="kv">
            <div>
              <div className="k">Dormant users</div>
              <div className="v" style={{ fontSize: 22 }}>
                {adoptLoading ? (
                  <SkeletonBox width={60} height={28} style={{ display: 'inline-block' }} />
                ) : (
                  adopt.dormantUsers.toLocaleString()
                )}
              </div>
              <div className="u">no activity 14+ days</div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        id="card-secondaryFeatures"
        style={{ marginTop: 12 }}
        eyebrow="Secondary feature reach · reference"
        title="App screen event frequency"
        purpose="Live event activity and reach across screens in calendar app."
      >
        {adoptLoading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : adopt.secondaryFeatures.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            No screen activity recorded
          </div>
        ) : (
          <table className="pathtbl">
            <thead>
              <tr>
                <th>Screen</th>
                <th>Event identifier</th>
                <th>Activity</th>
                <th className="num">Users reached</th>
              </tr>
            </thead>
            <tbody>
              {adopt.secondaryFeatures.map((f) => (
                <tr key={f.feature}>
                  <td>{f.feature}</td>
                  <td>{f.event}</td>
                  <td>{f.note}</td>
                  <td className="num">{f.users.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ChartCard>

      <ChartCard
        id="card-siteWise"
        style={{ marginTop: 12 }}
        eyebrow="League table"
        title="Provider-wise breakdown"
        purpose="Active users, sessions and bounce rate per connected calendar provider."
      >
        {adoptLoading ? (
          <SkeletonTable rows={3} cols={7} />
        ) : adopt.providers.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            All connected calendar providers are aggregated in current scope.
          </div>
        ) : (
          <table className="league">
            <thead>
              <tr>
                <th>Provider</th>
                <th className="num">Active users</th>
                <th className="num">Sessions</th>
                <th className="num">Avg session</th>
                <th className="num">Bounce</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {adopt.providers.map((row) => {
                const [cls, label] =
                  row.bounce >= 22
                    ? ['st-drop', 'Watch']
                    : row.bounce >= 16
                      ? ['st-watch', 'Steady']
                      : ['st-healthy', 'Healthy'];
                return (
                  <tr key={row.provider}>
                    <td className="strong">{row.provider}</td>
                    <td className="num">{row.active.toLocaleString()}</td>
                    <td className="num">{row.sessions.toLocaleString()}</td>
                    <td className="num">{row.avgSession}</td>
                    <td className="num">{row.bounce}%</td>
                    <td>
                      <span className={`arrow ${row.trend}`}>
                        {row.trend === 'up' ? '↗' : row.trend === 'dn' ? '↘' : '→'}
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
        )}
      </ChartCard>
    </section>
  );
}
