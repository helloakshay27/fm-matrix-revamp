import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { Tiles } from '../components/Tile';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import type { SessTab } from '../context/calendarDashboardStore';

const MEASURES: { key: SessTab; label: string }[] = [
  { key: 'visitors', label: 'Users' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
];

/** Layer 1 — Traffic & Session. */
export function TrafficSection() {
  const { vm, palette, setSessTab } = useCalendarDashboard();
  const { traffic, sessTab } = vm;

  const series =
    sessTab === 'views' ? traffic.views : sessTab === 'sessions' ? traffic.sessions : traffic.users;
  const color =
    sessTab === 'views' ? palette.violet : sessTab === 'sessions' ? palette.green : palette.blue;
  const fill =
    sessTab === 'views'
      ? palette.violetTint
      : sessTab === 'sessions'
        ? palette.greenTint
        : palette.fill;
  const measureLabel = MEASURES.find((m) => m.key === sessTab)?.label ?? 'Users';
  const platformColor = [palette.violet, palette.green];

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
          <li>
            Which connected-calendar providers generate the highest traffic, and are users staying
            active day over day?
          </li>
        </ul>
      </div>

      <Tiles specs={traffic.tiles} columns={3} />

      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time · SVG chart"
          title="Usage over time"
          purpose="Users, screen views, and sessions over time, across all providers, with the previous period overlaid for comparison."
        >
          <div className="charttabs" style={{ marginBottom: 10 }}>
            {MEASURES.map((m) => (
              <button
                key={m.key}
                type="button"
                className={sessTab === m.key ? 'on' : undefined}
                onClick={() => setSessTab(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <LineChart
          palette={palette}
            cur={series.cur}
            prev={vm.prev ? series.prev : null}
            labels={series.labels}
            color={color}
            fill={fill}
          />
          <Legend
            items={[
              { label: measureLabel, color },
              ...(vm.prev ? [{ label: 'Previous period', dashed: true as const }] : []),
            ]}
          />
        </ChartCard>

        <ChartCard
          eyebrow="Device / platform split"
          title="Platform usage"
          purpose="Share of active users by platform, from the device-platform property this catalogue names as part of the standard device stamps every event carries — shows where release testing and support effort should concentrate."
        >
          <div className="hbars">
            {traffic.platformRows.map((row, i) => (
              <div className="role" key={row.label}>
                <div className="rn">{row.label}</div>
                <div className="rbar">
                  <i style={{ width: `${Math.round(row.share * 100)}%`, background: platformColor[i] }} />
                </div>
                <div className="rv">{Math.round(row.share * 100)}%</div>
              </div>
            ))}
          </div>
          <div className="kv" style={{ marginTop: 14 }}>
            <div>
              <div className="k">Views / session</div>
              <div className="v" style={{ fontSize: 18 }}>
                {traffic.viewsPerSession}
              </div>
              <div className="u">screens per visit</div>
            </div>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
