import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { LineChart } from '../components/charts/LineChart';
import { HorizontalBars } from '../components/charts/HorizontalBars';
import { useDashboard } from '../context/DashboardContext';
import { BenchmarkNote } from '../components/TierNote';
import { CanvasGrid } from '../components/CanvasGrid';
import { CanvasTile } from '../components/CanvasTile';

const SESS_TABS: { key: 'visitors' | 'views' | 'sessions'; label: string }[] = [
  { key: 'visitors', label: 'Visitors' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
];

export function TrafficSection() {
  const { vm, setSessTab } = useDashboard();
  const { traffic, state, status } = vm;
  const hasUsage = traffic.chart.cur.some((v) => v > 0);

  return (
    <section className="page on" id="pgTraffic">
      <BenchmarkNote />

      <div className="section" id="secTraffic">
        <div className="section-head">
          <h2>Summary</h2>
          <span className="layerpill">Layer 1 · U1–U8</span>
          <span className="sd">Who is using the app, and how much.</span>
        </div>

        <CanvasGrid id="traffic">
          <CanvasTile id="traffic-tiles" title="Key Metrics" defaultCs={12}>
            <div className="paper bare">
              <div className="pbody">
                <div className="tiles">
                  {traffic.tiles.map((t) => <Tile key={t.id} {...t} />)}
                </div>
              </div>
            </div>
          </CanvasTile>

          <CanvasTile id="traffic-usage" title="Usage over time" defaultCs={8}>
            <Card
              infoKey="chart.usage"
              aiKey="chart.usage"
              head={
                <>
                  <div className="cr">Last {state.date} days{state.prev ? ' · vs previous period' : ''}</div>
                  <div className="charthead">
                    <CardHead ct="Usage over time" />
                    <div className="charttabs">
                      {SESS_TABS.map((t) => (
                        <button key={t.key} className={state.sessTab === t.key ? 'on' : ''} onClick={() => setSessTab(t.key)}>{t.label}</button>
                      ))}
                    </div>
                  </div>
                  <div className="charthead"><span /><span className="gb">Group by <b>Day</b></span></div>
                </>
              }
            >
              <Guard status={status.traffic} empty={!hasUsage}>
                <LineChart cur={traffic.chart.cur} prev={traffic.chart.prev} showPrev={state.prev} labels={traffic.chart.labels} />
                <div className="legend">
                  <span><i style={{ background: 'var(--blue)' }} /> Current period</span>
                  <span><i className="dash" /> Previous period</span>
                  <span><i style={{ background: 'var(--border-2)' }} /> Latest (partial day)</span>
                </div>
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="traffic-device" title="Web vs mobile usage" defaultCs={4}>
            <Card
              infoKey="chart.device"
              aiKey="chart.device"
              head={<CardHead cr="U7 · Device / platform split" ct="Web vs mobile usage" cd="Share of sessions by device_type, with distinct users per device." />}
            >
              <Guard status={status.traffic} empty={traffic.deviceRows.length === 0}>
                <HorizontalBars rows={traffic.deviceRows.map(([name, share, color]) => ({ name, share, color }))} />
              </Guard>
              <div className="kv" style={{ marginTop: 20 }}>
                <div><div className="k">U8 · Recently online</div><div className="v">{traffic.liveKv ?? '—'}</div><div className="u">active in last 30 min</div></div>
                <div><div className="k">U4 · Views / session</div><div className="v">{traffic.vpsKv}</div><div className="u">screens per visit</div></div>
              </div>
            </Card>
          </CanvasTile>
        </CanvasGrid>
      </div>
    </section>
  );
}
