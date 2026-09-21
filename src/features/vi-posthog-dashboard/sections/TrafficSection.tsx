import { INFO } from '@/features/posthog-dashboard/data/constants';
import { pct } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { Tile } from '../components/Tile';
import { LineChart } from '../components/charts/LineChart';
import { usePlatformSplit } from '../api/queries';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';

const MEASURES = [
  // "Employees", not "Visitors": Vi my Workspace is an internal app, so the distinct users
  // behind this count are staff. The API field is still `visitors`.
  { key: 'visitors', label: 'Employees' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
] as const;

/** Layer 1 — traffic_session (U1/U2/U3/U5/U6/U8) + usage_and_distribution. */
export function TrafficSection() {
  const { vm, setSessTab, palette, queryFilters } = useViDashboard();
  const { traffic, status, state } = vm;
  const platformSplit = usePlatformSplit(queryFilters);
  // Android green, iOS blue; any other OS the API reports falls back to the neutral line.
  const platformColor: Record<string, string> = { Android: palette.green, iOS: palette.blue };

  const measureColor =
    state.sessTab === 'views'
      ? palette.violet
      : state.sessTab === 'sessions'
        ? palette.green
        : palette.blue;
  const measureFill =
    state.sessTab === 'views'
      ? palette.violetTint
      : state.sessTab === 'sessions'
        ? palette.greenTint
        : palette.fill;

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Traffic &amp; Session</h2>
        <span className="sd">
          Monitor overall application traffic, employee activity, and session behavior.
        </span>
      </div>
      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>How many employees and contractors are actively using the app, and how frequently?</li>
          <li>Which sites generate the highest traffic, and are employees staying active day over day?</li>
        </ul>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {toViTiles(traffic.tiles).map((t) => (
          <Tile key={t.id} spec={t} />
        ))}
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time (U7)"
          title="Usage over time"
          purpose={INFO['chart.usage'].f}
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
            />
            <div className="legend">
              <span>
                <i style={{ background: measureColor }} />{' '}
                {MEASURES.find((m) => m.key === state.sessTab)?.label}
              </span>
              {traffic.chart.prev.length > 0 && (
                <span>
                  <i className="dash" /> Previous period
                </span>
              )}
            </div>
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Platform split (U7)"
          title="Android vs iOS"
          // Not INFO['chart.device'] — that entry describes the FM Desktop/Mobile split.
          purpose="Share of sessions per mobile platform, taken from the os_breakdown inside device_split. Both platforms are always listed, so a zero reads as nobody on that platform rather than as missing data."
        >
          <Guard
            status={{ loading: platformSplit.isLoading, error: platformSplit.error }}
            empty={platformSplit.rows.length === 0}
            emptyLabel="No platform breakdown for this filter set."
          >
            <div className="hbars">
              {platformSplit.rows.map((row) => (
                <div
                  className="role"
                  key={row.label}
                  title={`${row.label}: ${row.sessions.toLocaleString()} sessions · ${row.users.toLocaleString()} users`}
                >
                  <div className="rn">{row.label}</div>
                  <div className="rbar">
                    <i
                      style={{
                        width: `${Math.round(row.share * 100)}%`,
                        background: platformColor[row.os] ?? palette.line,
                      }}
                    />
                  </div>
                  <div className="rv">{pct(row.share)}</div>
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
