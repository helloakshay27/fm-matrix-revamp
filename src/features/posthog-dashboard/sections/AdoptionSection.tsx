import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { LineChart } from '../components/charts/LineChart';
import { GrowthChart } from '../components/charts/GrowthChart';
import { HorizontalBars } from '../components/charts/HorizontalBars';
import { RetentionHeatmap } from '../components/charts/RetentionHeatmap';
import { useDashboard } from '../context/DashboardContext';
import { GROWTH_WEEKS, RETENTION_WEEKS, TREND_WEEKS } from '../data/constants';

export function AdoptionSection() {
  const { vm } = useDashboard();
  const { adopt, status, state } = vm;

  return (
    <div className="phg-section" id="secAdopt">
      <div className="phg-section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="phg-layerpill">Layer 2 · A1–A8</span>
        <span className="phg-sd">How well your people are adopting the app — habit, growth, retention, breadth &amp; depth.</span>
      </div>

      <div className="phg-tiles" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
        {adopt.tiles.map((t) => <Tile key={t.id} {...t} />)}
      </div>

      <div className="phg-two" style={{ marginTop: 14 }}>
        <Card
          accent="orange"
          infoKey="chart.adoptTrend"
          aiKey="chart.adoptTrend"
          head={<CardHead cr={`A3 · Adoption trend · Last ${TREND_WEEKS} weeks`} ct="Weekly active users" cd="Are more of your people using the app week over week?" />}
        >
          <Guard status={status.adopt} empty={!adopt.trendChart.cur.some((v) => v > 0)}>
            <LineChart cur={adopt.trendChart.cur} prev={adopt.trendChart.prev} showPrev={state.prev} labels={adopt.trendChart.labels} />
            <div className="phg-legend">
              <span><i style={{ background: 'var(--phg-orange)' }} /> Last {TREND_WEEKS} weeks</span>
              <span><i className="dash" /> Prior {TREND_WEEKS} weeks</span>
            </div>
          </Guard>
        </Card>

        <Card
          accent="green"
          infoKey="chart.growth"
          aiKey="chart.growth"
          head={<CardHead cr={`Growth accounting · Last ${GROWTH_WEEKS} weeks`} ct="New · returning · resurrected · dormant" cd="How your active base changes each week." />}
        >
          <Guard status={status.adopt} empty={adopt.growthWeeks.length === 0}>
            <GrowthChart weeks={adopt.growthWeeks} />
            <div className="phg-legend">
              <span><i style={{ background: 'var(--phg-blue)' }} /> New</span>
              <span><i style={{ background: 'var(--phg-green)' }} /> Returning</span>
              <span><i style={{ background: 'var(--phg-orange)' }} /> Resurrected</span>
              <span><i style={{ background: 'var(--phg-red)' }} /> Dormant</span>
            </div>
          </Guard>
        </Card>
      </div>

      <div className="phg-two" style={{ marginTop: 14 }}>
        <Card
          accent="blue"
          infoKey="chart.retention"
          aiKey="chart.retention"
          bodyClassName="phg-tbl-wrap"
          head={<CardHead cr={`Retention · weekly cohorts · ${RETENTION_WEEKS} weeks`} ct="Do new users keep coming back?" cd="Each row = users first active that week (row label shows cohort size); cells = % still active weeks later." />}
        >
          <Guard status={status.adopt} empty={adopt.retentionCohorts.length === 0}>
            <RetentionHeatmap cohorts={adopt.retentionCohorts} rowLabels={adopt.retentionRowLabels} />
          </Guard>
        </Card>

        <Card
          accent="orange"
          infoKey="chart.role"
          aiKey="chart.role"
          head={<CardHead cr="A8 · Adoption by role" ct="Who is (and isn't) using the app" cd="Share of active users per user_role. True A8 (÷ provisioned users) needs billing data the events don't carry." />}
        >
          <Guard status={status.adopt} empty={adopt.roleShares.length === 0}>
            <HorizontalBars rows={adopt.roleShares} />
          </Guard>
          <div className="phg-kv" style={{ marginTop: 14 }}>
            <div><div className="phg-k">A6 · Module breadth</div><div className="phg-v">{adopt.breadthKv}</div><div className="phg-u">modules with activity</div></div>
            <div><div className="phg-k">A4 · Dormant users</div><div className="phg-v">{adopt.dormantKv}</div><div className="phg-u">no activity 14+ days</div></div>
            <div><div className="phg-k">A5 · 14-day activation</div><div className="phg-v">{adopt.activationKv}</div><div className="phg-u">of new joiners</div></div>
          </div>
        </Card>
      </div>

    </div>
  );
}
