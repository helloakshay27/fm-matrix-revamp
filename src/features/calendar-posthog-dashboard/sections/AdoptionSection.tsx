import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { Guard } from '@/features/analytics-dashboard-shared/components/Guard';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { StackedBarChart } from '@/features/analytics-dashboard-shared/charts/StackedBarChart';
import { fmtC } from '@/features/analytics-dashboard-shared/format';
import { TenantScopeNote } from '../components/ScopeNote';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import { toCalendarTiles } from '../data/calendarMetricIds';

export function AdoptionSection() {
  const { vm, palette } = useCalendarDashboard();
  const { adopt, modules, status, state } = vm;

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">
          Measure how effectively users adopt and engage with the app’s major modules, and
          whether they keep coming back day over day.
        </span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules receive the highest engagement and adoption?</li>
          <li>Which modules need UX improvements, and where do users spend the most time?</li>
          <li>Are users returning to daily use, and is retention improving over time?</li>
        </ul>
      </div>

      <TenantScopeNote layer="adoption_engagement, growth, retention and roles" />

      <Guard status={status.adopt}>
        <Tiles specs={toCalendarTiles(adopt.tiles)} columns={3} style={{ marginTop: 16 }} />
      </Guard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Trend · weekly active users"
        title="Adoption trend (weekly active users)"
        purpose="Weekly active users over the trailing weeks — the trend line behind the Adoption Trend tile above."
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
            palette={palette}
            showPrev={state.prev}
          />
          <Legend
            items={[
              { label: 'Weekly active users', color: palette.blue },
              ...(adopt.trendChart.prev.length ? [{ label: 'Previous period', dashed: true }] : []),
            ]}
          />
        </Guard>
      </ChartCard>

      <div className="grid2">
        <ChartCard
          eyebrow="Growth accounting"
          title="New · Returning · Resurrecting · Dormant"
          purpose="Breaks the active base into new signups, retained users, win-backs and users going quiet — a fuller view than a simple new-vs-returning split."
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
                { label: 'Resurrecting', data: adopt.growthWeeks.map((w) => w.res), color: palette.mint },
              ]}
              negSeries={{
                label: 'Dormant',
                data: adopt.growthWeeks.map((w) => w.dorm),
                color: palette.red,
              }}
              palette={palette}
            />
            <Legend
              items={[
                { label: 'New', color: palette.blue },
                { label: 'Returning', color: palette.green },
                { label: 'Resurrecting', color: palette.mint },
                { label: 'Dormant', color: palette.red },
              ]}
            />
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Retention · weekly cohorts"
          title="Do new users keep coming back?"
          purpose="Each row = users first active that week; cells = % of that cohort still active N weeks later."
        >
          <Guard
            status={status.adopt}
            empty={adopt.retentionCohorts.length === 0}
            emptyLabel="No cohorts in this window."
          >
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cohort</th>
                  {adopt.retentionCohorts[0]?.map((_, w) => <th key={w}>Week {w}</th>)}
                </tr>
              </thead>
              <tbody>
                {adopt.retentionCohorts.map((row, i) => (
                  <tr key={adopt.retentionRowLabels[i]}>
                    <td className="lbl">{adopt.retentionRowLabels[i]}</td>
                    {row.map((val, w) => {
                      // A cohort can only be observed for as many weeks as have elapsed since
                      // it started; the builder reports those future cells as null.
                      if (val == null) {
                        return (
                          <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>
                            ·
                          </td>
                        );
                      }
                      const t = val / 100;
                      const bg = `rgba(${palette.heatRgb},${(palette.heatA0 + t * palette.heatA1).toFixed(2)})`;
                      return (
                        <td key={w} style={{ background: bg, color: t > 0.55 ? palette.onHeat : 'var(--ink)' }}>
                          {Math.round(val)}%
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
          eyebrow="Adoption by role"
          title="Who is using the calendar"
          /* The wireframe split this by event_created{event_type} — event / task / reminder.
             No endpoint exposes an arbitrary event property as a breakdown, and `roles` is the
             only share-of-users split the API offers, so the card reports that and says so. */
          purpose="Share of active users by role, from the roles endpoint. The catalogue's own lens here is event_created{event_type} — event / task / reminder — but no endpoint exposes an arbitrary event property as a breakdown, so this reports the role split the API can actually serve."
        >
          <Guard
            status={status.adopt}
            empty={adopt.roleShares.length === 0}
            emptyLabel="No role data for this filter set."
          >
            <div className="hbars">
              {adopt.roleShares.map((r) => (
                <div className="role" key={r.name}>
                  <div className="rn">{r.name}</div>
                  <div className="rbar">
                    <i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }} />
                  </div>
                  <div className="rv">{Math.round(r.share * 100)}%</div>
                </div>
              ))}
            </div>
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Dormant users"
          title="Dormant users"
          purpose="Registered users with no activity in the last 14 days — out of scope for the 14-Day Activation tile above."
        >
          <Guard status={status.adopt}>
            <div className="kv">
              <div>
                <div className="k">Dormant users</div>
                <div className="v" style={{ fontSize: 22 }}>
                  {adopt.dormantKv}
                </div>
                <div className="u">no activity 14+ days</div>
              </div>
            </div>
          </Guard>
        </ChartCard>
      </div>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="League table"
        title="Module-wise breakdown"
        /* The wireframe had a Provider-wise table (Google / Outlook / iCloud / Exchange).
           `calendar_account_connected{provider}` is a real catalogue property, but none of the
           nine endpoints takes or returns a provider dimension, so that table could only ever
           render empty. `modules` is the real league table the API serves. */
        purpose="Users, events and sessions per module, busiest first — from the modules endpoint, grouped by real route segments. The wireframe's Provider-wise breakdown is not shown: calendar_account_connected{provider} is a real catalogue property, but no endpoint exposes a provider dimension to group by."
      >
        <Guard
          status={status.modules}
          empty={modules.length === 0}
          emptyLabel="No module activity for this filter set."
        >
          <table className="league">
            <thead>
              <tr>
                <th>Module</th>
                <th className="num">Users</th>
                <th className="num">Events</th>
                <th className="num">Sessions</th>
                <th className="num">Events / user</th>
              </tr>
            </thead>
            <tbody>
              {[...modules]
                .sort((a, b) => b.users - a.users)
                .map((m) => (
                  <tr key={m.name}>
                    <td className="strong">{m.name}</td>
                    <td className="num">{m.users.toLocaleString()}</td>
                    <td className="num">{fmtC(m.events)}</td>
                    <td className="num">{m.sessions.toLocaleString()}</td>
                    <td className="num">{m.users ? (m.events / m.users).toFixed(1) : '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Guard>
      </ChartCard>
    </section>
  );
}
