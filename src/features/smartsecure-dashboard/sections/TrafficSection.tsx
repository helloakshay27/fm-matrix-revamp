import { useState } from 'react';
import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { LineChart } from '../../posthog-dashboard/components/charts/LineChart';
import { HorizontalBars } from '../../posthog-dashboard/components/charts/HorizontalBars';
import { useSmartSecureDashboard } from '../context/DashboardContext';

const USAGE_TABS: { key: 'visitors' | 'views' | 'sessions'; label: string }[] = [
  { key: 'visitors', label: 'Visitors' },
  { key: 'views', label: 'Views' },
  { key: 'sessions', label: 'Sessions' },
];

export function TrafficSection() {
  const { state, traffic } = useSmartSecureDashboard();
  const [usageTab, setUsageTab] = useState<'visitors' | 'views' | 'sessions'>('visitors');
  const series = traffic.usage[usageTab];

  return (
    <section className="page on" id="pgTraffic">
      <div className="section-head">
        <h2>Traffic &amp; Session</h2>
        <span className="sd">Monitor overall application traffic, gate-staff activity, and session behavior.</span>
      </div>
      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>How many gate staff and admins are actively using the app, and how frequently?</li>
          <li>Which societies generate the highest traffic, and are devices staying active shift over shift?</li>
        </ul>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {traffic.tiles.map((t) => <Tile key={t.label} {...t} />)}
      </div>

      <div className="grid2">
        <Card
          infoKey="U7"
          head={
            <>
              <div className="cr">Usage over time · SVG chart</div>
              <div className="charthead">
                <CardHead ct="Usage over time" />
                <div className="charttabs">
                  {USAGE_TABS.map((t) => (
                    <button key={t.key} className={usageTab === t.key ? 'on' : ''} onClick={() => setUsageTab(t.key)}>{t.label}</button>
                  ))}
                </div>
              </div>
            </>
          }
        >
          <LineChart cur={series.cur} prev={series.prev} showPrev={state.prev} labels={series.labels} />
          <div className="legend">
            <span><i style={{ background: series.color }} /> {series.legendLabel}</span>
            <span><i className="dash" /> Previous period</span>
          </div>
        </Card>

        <Card
          infoKey="U8"
          head={<CardHead cr="Device / platform split" ct="Web app vs mobile OS usage" cd="Share of active users by platform — SmartSecure runs on gate tablets, so this shows where release testing and support effort should concentrate." />}
        >
          <HorizontalBars rows={traffic.deviceRows} />
          <div className="kv" style={{ marginTop: 14 }}>
            <div>
              <div className="k">Views / session</div>
              <div className="v" style={{ fontSize: 18 }}>{traffic.viewsPerSession}</div>
              <div className="u">screens per visit</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
