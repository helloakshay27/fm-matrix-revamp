import { ChartCard, Legend } from '@/features/analytics-dashboard-shared/components/ChartCard';
import { LineChart } from '@/features/analytics-dashboard-shared/charts/LineChart';
import { Tiles } from '../components/Tile';
import { SkeletonChart, SkeletonBox } from '../components/Skeleton';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import type { SessTab } from '../context/calendarDashboardStore';

const MEASURES: { key: SessTab; label: string }[] = [
  { key: 'visitors', label: 'Users' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
];

/** Layer 1 — Traffic & Session. */
export function TrafficSection() {
  const { vm, palette, setSessTab, trafficLoading } = useCalendarDashboard();
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
    <section className="page on" id="pgTraffic">
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

      <Tiles specs={traffic.tiles} columns={3} id="tilesTraffic" loading={trafficLoading} />

      <div className="grid2">
        <ChartCard
          id="card-trafficActive"
          eyebrow="Usage over time · SVG chart"
          title="Usage over time"
          purpose="Users, screen views, and sessions over time, across all providers, with the previous period overlaid for comparison."
        >
          <div className="charttabs" id="usageTabs" style={{ marginBottom: 10 }}>
            {MEASURES.map((m) => (
              <button
                key={m.key}
                type="button"
                data-u={m.key}
                className={sessTab === m.key ? 'on' : undefined}
                onClick={() => setSessTab(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div id="usageChartBody">
            {trafficLoading ? (
              <SkeletonChart height={220} />
            ) : series.cur.length === 0 ? (
              <div
                style={{
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  fontSize: 13,
                }}
              >
                No usage data recorded for this period
              </div>
            ) : (
              <>
                <LineChart
                  palette={palette}
                  cur={series.cur}
                  prev={vm.prev && series.prev.length > 0 ? series.prev : null}
                  labels={series.labels}
                  color={color}
                  fill={fill}
                  showPrev={vm.prev && series.prev.length > 0}
                />
                <Legend
                  items={[
                    { label: measureLabel, color },
                    ...(vm.prev && series.prev.length > 0
                      ? [{ label: 'Previous period', dashed: true as const }]
                      : []),
                  ]}
                />
              </>
            )}
          </div>
        </ChartCard>

        <ChartCard
          id="card-deviceSplit"
          eyebrow="Device / platform split"
          title="Platform usage"
          purpose="Share of active users by platform, from the device-platform property this catalogue names as part of the standard device stamps every event carries — shows where release testing and support effort should concentrate."
        >
          {trafficLoading ? (
            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SkeletonBox width={70} height={13} />
                <SkeletonBox width="85%" height={14} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <SkeletonBox width={70} height={13} />
                <SkeletonBox width="25%" height={14} />
              </div>
            </div>
          ) : traffic.platformRows.length === 0 ? (
            <div
              style={{
                padding: '24px 0',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: 13,
              }}
            >
              No platform breakdown available for this range
            </div>
          ) : (
            <div className="hbars">
              {traffic.platformRows.map((row, i) => (
                <div
                  className="role"
                  key={row.label}
                  title={`${row.label}: ${Math.round(row.share * 100)}% of users`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="rn">{row.label}</div>
                  <div className="rbar">
                    <i
                      style={{
                        width: `${Math.round(row.share * 100)}%`,
                        background: platformColor[i % platformColor.length],
                      }}
                    />
                  </div>
                  <div className="rv">{Math.round(row.share * 100)}%</div>
                </div>
              ))}
            </div>
          )}
          <div className="kv" style={{ marginTop: 14 }}>
            <div>
              <div className="k">Views / session</div>
              <div className="v" style={{ fontSize: 18 }}>
                {trafficLoading ? '...' : traffic.viewsPerSession}
              </div>
              <div className="u">screens per visit</div>
            </div>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}
