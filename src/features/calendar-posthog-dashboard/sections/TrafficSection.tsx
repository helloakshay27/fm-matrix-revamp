import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { Guard } from '@/features/analytics-dashboard-shared/components/Guard';
import { fmtC } from '@/features/analytics-dashboard-shared/format';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { TenantScopeNote } from '../components/ScopeNote';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import { toCalendarTiles } from '../data/calendarMetricIds';
import { CALENDAR_MODULE, CALENDAR_SUB_MODULE } from '../data/constants';

const MEASURES = [
  { key: 'visitors', label: 'Users' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
] as const;

export function TrafficSection() {
  const { vm, palette, setSessTab } = useCalendarDashboard();
  const { traffic, status, state, calendarScope } = vm;

  const measureColor =
    state.sessTab === 'views' ? palette.violet : state.sessTab === 'sessions' ? palette.green : palette.blue;
  const measureFill =
    state.sessTab === 'views' ? palette.violetTint : state.sessTab === 'sessions' ? palette.greenTint : palette.fill;

  return (
    <section className="page on">
      <div className="section-head">
        <div className="eyebrow-sec" />
        <h2>Traffic &amp; Session</h2>
        <span className="sd">Monitor overall app traffic, user activity, and session behavior.</span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>How many users are actively using the app, and how frequently?</li>
          <li>Which platforms generate the highest traffic, and are users staying active day over day?</li>
        </ul>
      </div>

      {/* The one genuinely calendar-scoped view Layer 1 can produce — see ScopeNote. */}
      <ChartCard
        eyebrow={`Calendar module only · /${CALENDAR_MODULE}/${CALENDAR_SUB_MODULE}`}
        title="Calendar usage"
        purpose="Users, events and sessions recorded on the calendar screen itself, from the modules endpoint — the only Layer-1 figures the API can scope to a single page. Every other tile on this layer is whole-tenant."
      >
        <Guard
          status={status.calendarScope}
          empty={calendarScope == null}
          emptyLabel="No calendar activity recorded in this window."
        >
          <div className="kv">
            <div>
              <div className="k">Users</div>
              <div className="v" style={{ fontSize: 22 }}>
                {calendarScope?.users.toLocaleString()}
              </div>
              <div className="u">opened the calendar</div>
            </div>
            <div>
              <div className="k">Events</div>
              <div className="v" style={{ fontSize: 22 }}>
                {calendarScope ? fmtC(calendarScope.events) : '—'}
              </div>
              <div className="u">interactions recorded</div>
            </div>
            <div>
              <div className="k">Sessions</div>
              <div className="v" style={{ fontSize: 22 }}>
                {calendarScope?.sessions.toLocaleString()}
              </div>
              <div className="u">visits including the calendar</div>
            </div>
          </div>
        </Guard>
      </ChartCard>

      <TenantScopeNote layer="traffic_session and usage_and_distribution" />

      <Guard status={status.traffic}>
        <Tiles specs={toCalendarTiles(traffic.tiles)} columns={3} />
      </Guard>

      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time"
          title="Usage over time"
          purpose="Users, screen views, and sessions over time, with the previous period overlaid for comparison."
        >
          <div className="charttabs" style={{ marginBottom: 10 }}>
            {MEASURES.map((m) => (
              <button
                key={m.key}
                type="button"
                className={state.sessTab === m.key ? 'on' : undefined}
                onClick={() => setSessTab(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Guard
            status={status.traffic}
            empty={!traffic.chart.cur.some((v) => v > 0)}
            emptyLabel="No usage recorded in this date range."
          >
            <LineChart
              cur={traffic.chart.cur}
              prev={traffic.chart.prev.length ? traffic.chart.prev : null}
              labels={traffic.chart.labels}
              color={measureColor}
              fill={measureFill}
              palette={palette}
              showPrev={state.prev}
            />
            <Legend
              items={[
                { label: MEASURES.find((m) => m.key === state.sessTab)?.label ?? '', color: measureColor },
                ...(traffic.chart.prev.length ? [{ label: 'Previous period', dashed: true }] : []),
              ]}
            />
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Device / platform split"
          title="Platform usage"
          purpose="Share of active users by platform, from the device_type property on every event — shows where release testing and support effort should concentrate."
        >
          <Guard
            status={status.traffic}
            empty={traffic.deviceRows.length === 0}
            emptyLabel="No platform data for this filter set."
          >
            <div className="hbars">
              {traffic.deviceRows.map(([name, share, color]) => (
                <div className="role" key={name}>
                  <div className="rn">{name}</div>
                  <div className="rbar">
                    <i style={{ width: `${Math.round(share * 100)}%`, background: color }} />
                  </div>
                  <div className="rv">{Math.round(share * 100)}%</div>
                </div>
              ))}
            </div>
            <div className="kv" style={{ marginTop: 14 }}>
              <div>
                <div className="k">Views / session</div>
                <div className="v" style={{ fontSize: 18 }}>
                  {traffic.vpsKv}
                </div>
                <div className="u">screens per visit</div>
              </div>
            </div>
          </Guard>
        </ChartCard>
      </div>
    </section>
  );
}
