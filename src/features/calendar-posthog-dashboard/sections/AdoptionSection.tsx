import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { StackedBarChart } from '@/features/analytics-dashboard-shared/charts/StackedBarChart';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/** Layer 2 — Adoption & Engagement. */
export function AdoptionSection() {
  const { vm, palette } = useCalendarDashboard();
  const { adopt } = vm;

  const itemColor = [palette.blue, palette.violet, palette.green];

  return (
    <section className="page on">
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

      <Tiles specs={adopt.tiles} columns={3} style={{ marginTop: 16 }} />

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Trend · SVG line chart"
        title="Adoption trend (weekly active users, last 8 weeks)"
        purpose="Weekly active users over the last 8 weeks — the trend line behind the Adoption Trend tile above."
      >
        <LineChart
          palette={palette}
          cur={adopt.trend.values}
          prev={null}
          labels={adopt.trend.labels}
          color={palette.blue}
          fill={palette.fill}
        />
        <Legend items={[{ label: 'Weekly active users', color: palette.blue }]} />
      </ChartCard>

      <div className="grid2">
        <ChartCard
          eyebrow="Growth accounting · Last 6 weeks"
          title="New · Returning · Resurrecting · Dormant"
          purpose="Breaks the active base into new signups, retained users, win-backs and users going quiet — a fuller view than a simple new-vs-returning split."
        >
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
        </ChartCard>

        <ChartCard
          eyebrow="Retention · weekly cohorts"
          title="Do new users keep coming back?"
          purpose="Each row = users first active that week; cells = % of that cohort still active N weeks later."
        >
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
                <tr key={adopt.retention.labels[i]}>
                  <td className="lbl">{adopt.retention.labels[i]}</td>
                  {row.map((v, w) =>
                    v == null ? (
                      <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>
                        ·
                      </td>
                    ) : (
                      <td
                        key={w}
                        style={{
                          background: `rgba(${palette.heatRgb},${(
                            palette.heatA0 +
                            (v / 100) * palette.heatA1
                          ).toFixed(2)})`,
                          color: v / 100 > 0.55 ? palette.onHeat : 'var(--ink)',
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
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Adoption by item type"
          title="What users actually create"
          purpose="Share of event_created{event_type} by item type — event, task or reminder — the real, confirmed type property on event_created/event_create_failed (also mirrored on event_create_type_selected{type} at the point of choice)."
        >
          <div className="hbars">
            {adopt.itemTypes.map((row, i) => (
              <div className="role" key={row.label}>
                <div className="rn">{row.label}</div>
                <div className="rbar">
                  <i style={{ width: `${Math.round(row.share * 100)}%`, background: itemColor[i] }} />
                </div>
                <div className="rv">{Math.round(row.share * 100)}%</div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="Dormant users"
          title="Dormant users"
          purpose="Registered users with no activity in the last 14 days — out of scope for the 14-Day Activation tile above."
        >
          <div className="kv">
            <div>
              <div className="k">Dormant users</div>
              <div className="v" style={{ fontSize: 22 }}>
                {adopt.dormantUsers.toLocaleString()}
              </div>
              <div className="u">no activity 14+ days</div>
            </div>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Secondary feature reach · reference"
        title="Real sub-flows, reach not funnel"
        purpose="Reference card — not a filter. These five areas are real, catalogue-sourced flows, but per an explicit product decision this dashboard does not give them their own multi-step funnel (see the Create Event workflow card's scope note) — this card surfaces each one's real terminal event at a single reach figure instead, so a reviewer can see these features are alive and in use. It does not change any other number on the dashboard."
      >
        <table className="pathtbl">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Terminal event</th>
              <th>Note</th>
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
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="League table"
        title="Provider-wise breakdown"
        purpose="Active users, sessions and bounce rate per connected calendar provider, worst-trending first. Users who have connected no external calendar account fall outside this breakdown entirely — the app's own built-in calendar needs no provider connection, so this table under-counts total active users relative to Traffic & Session by design."
      >
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
              // Bands are keyed off bounce rate, the same way the reference reads them.
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
      </ChartCard>
    </section>
  );
}
