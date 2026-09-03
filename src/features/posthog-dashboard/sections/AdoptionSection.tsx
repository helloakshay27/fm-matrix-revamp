import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { Guard } from '../components/Guard';
import { LineChart } from '../components/charts/LineChart';
import { GrowthChart } from '../components/charts/GrowthChart';
import { HorizontalBars } from '../components/charts/HorizontalBars';
import { RetentionHeatmap } from '../components/charts/RetentionHeatmap';
import { useDashboard } from '../context/DashboardContext';
import { CanvasGrid } from '../components/CanvasGrid';
import { CanvasTile } from '../components/CanvasTile';
import { SiteBreakdownSection } from './SiteBreakdownSection';
import { GROWTH_WEEKS, RETENTION_WEEKS, TREND_WEEKS } from '../data/constants';

export function AdoptionSection() {
  const { vm } = useDashboard();
  const { adopt, status, state } = vm;

  return (
    <section className="page on" id="pgAdopt">
      <div className="section">
        <div className="section-head">
          <h2>Summary</h2>
          <span className="layerpill">Layer 2 · A3–A8</span>
          <span className="sd">Habit, growth, retention, breadth and depth.</span>
        </div>

        <CanvasGrid id="adopt">
          <CanvasTile id="adopt-tiles" title="Key Metrics" defaultCs={12}>
            <div className="paper bare">
              <div className="pbody">
                <div className="tiles" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
                  {adopt.tiles.map((t) => <Tile key={t.id} {...t} />)}
                </div>
              </div>
            </div>
          </CanvasTile>

          <CanvasTile id="adopt-trend" title="Adoption trend" defaultCs={6}>
            <Card
              infoKey="chart.adoptTrend"
              aiKey="chart.adoptTrend"
              head={<CardHead cr={`A3 · Adoption trend · Last ${TREND_WEEKS} weeks`} ct="Weekly active users" cd="Are more of your people using the app week over week?" />}
            >
              <Guard status={status.adopt} empty={!adopt.trendChart.cur.some((v) => v > 0)}>
                <LineChart cur={adopt.trendChart.cur} prev={adopt.trendChart.prev} showPrev={state.prev} labels={adopt.trendChart.labels} />
                <div className="legend">
                  <span><i style={{ background: 'var(--blue)' }} /> Last {TREND_WEEKS} weeks</span>
                  <span><i className="dash" /> Prior {TREND_WEEKS} weeks</span>
                </div>
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="adopt-growth" title="Growth accounting" defaultCs={6}>
            <Card
              infoKey="chart.growth"
              aiKey="chart.growth"
              head={<CardHead cr={`Growth accounting · Last ${GROWTH_WEEKS} weeks`} ct="New · returning · resurrected · dormant" cd="How your active base changes each week." />}
            >
              <Guard status={status.adopt} empty={adopt.growthWeeks.length === 0}>
                <GrowthChart weeks={adopt.growthWeeks} />
                <div className="legend">
                  <span><i style={{ background: 'var(--blue)' }} /> New</span>
                  <span><i style={{ background: 'var(--mint)' }} /> Returning</span>
                  <span><i style={{ background: 'var(--amber)' }} /> Resurrected</span>
                  <span><i style={{ background: 'var(--red)' }} /> Dormant</span>
                </div>
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="adopt-retention" title="Retention" defaultCs={6}>
            <Card
              infoKey="chart.retention"
              aiKey="chart.retention"
              bodyClassName="tbl-wrap"
              head={<CardHead cr={`Retention · weekly cohorts · ${RETENTION_WEEKS} weeks`} ct="Do new users keep coming back?" cd="Each row = users first active that week (row label shows cohort size); cells = % still active weeks later." />}
            >
              <Guard status={status.adopt} empty={adopt.retentionCohorts.length === 0}>
                <RetentionHeatmap cohorts={adopt.retentionCohorts} rowLabels={adopt.retentionRowLabels} />
              </Guard>
            </Card>
          </CanvasTile>

          <CanvasTile id="adopt-role" title="Adoption by role" defaultCs={6}>
            <Card
              infoKey="chart.role"
              aiKey="chart.role"
              head={<CardHead cr="A8 · Adoption by role" ct="Who is (and isn't) using the app" cd="Share of active users per user_role. True A8 (÷ provisioned users) needs billing data the events don't carry." />}
            >
              <Guard status={status.adopt} empty={adopt.roleShares.length === 0}>
                <HorizontalBars rows={adopt.roleShares} />
              </Guard>
              <div className="kv" style={{ marginTop: 20 }}>
                <div><div className="k">A6 · Module breadth</div><div className="v">{adopt.breadthKv}</div><div className="u">modules with activity</div></div>
                <div><div className="k">A4 · Dormant users</div><div className="v">{adopt.dormantKv}</div><div className="u">no activity 14+ days</div></div>
                <div><div className="k">A5 · 14-day activation</div><div className="v">{adopt.activationKv}</div><div className="u">of new joiners</div></div>
              </div>
            </Card>
          </CanvasTile>
        </CanvasGrid>
      </div>

      <SiteBreakdownSection />
    </section>
  );
}
