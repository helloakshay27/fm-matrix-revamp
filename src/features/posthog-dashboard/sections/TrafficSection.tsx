import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { LineChart } from '../components/charts/LineChart';
import { HorizontalBars } from '../components/charts/HorizontalBars';
import { useDashboard } from '../context/DashboardContext';

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
    <div className="phg-section" id="secTraffic">
      <div className="phg-section-head">
        <h2>Traffic &amp; Session</h2>
        <span className="phg-layerpill">Layer 1 · U1–U8</span>
        <span className="phg-sd">Who is using the app, how much — the web-analytics set (reframed for the app).</span>
      </div>

      <div className="phg-tiles">
        {traffic.tiles.map((t) => <Tile key={t.id} {...t} />)}
      </div>

      <div className="phg-two-32" style={{ marginTop: 14 }}>
        <Card
          accent="orange"
          infoKey="chart.usage"
          aiKey="chart.usage"
          head={
            <>
              <div className="phg-cr">Last {state.date} days{state.prev ? ' · vs previous period' : ''}</div>
              <div className="phg-charthead">
                <CardHead ct="Usage over time" />
                <div className="phg-charttabs">
                  {SESS_TABS.map((t) => (
                    <button key={t.key} className={state.sessTab === t.key ? 'on' : ''} onClick={() => setSessTab(t.key)}>{t.label}</button>
                  ))}
                </div>
              </div>
              <div className="phg-charthead"><span /><span className="phg-gb">Group by <b>Day</b></span></div>
            </>
          }
        >
          <Guard status={status.traffic} empty={!hasUsage}>
            <LineChart cur={traffic.chart.cur} prev={traffic.chart.prev} showPrev={state.prev} />
            <div className="phg-legend">
              <span><i style={{ background: 'var(--phg-orange)' }} /> Current period</span>
              <span><i className="dash" /> Previous period</span>
              <span><i style={{ background: 'var(--phg-midgray)' }} /> Latest (partial day)</span>
            </div>
          </Guard>
        </Card>

        <Card
          accent="blue"
          infoKey="chart.device"
          aiKey="chart.device"
          head={<CardHead cr="U7 · Device / platform split" ct="Web vs mobile usage" cd="Share of sessions by device_type, with distinct users per device." />}
        >
          <Guard status={status.traffic} empty={traffic.deviceRows.length === 0}>
            <HorizontalBars rows={traffic.deviceRows.map(([name, share, color]) => ({ name, share, color }))} />
          </Guard>
          <div className="phg-kv" style={{ marginTop: 14 }}>
            <div><div className="phg-k">U8 · Recently online</div><div className="phg-v">{traffic.liveKv ?? '—'}</div><div className="phg-u">active in last 30 min</div></div>
            <div><div className="phg-k">U4 · Views / session</div><div className="phg-v">{traffic.vpsKv}</div><div className="phg-u">screens per visit</div></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
