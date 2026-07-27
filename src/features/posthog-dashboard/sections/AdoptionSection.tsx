import { Card, CardHead } from '../components/Card';
import { Tile } from '../components/Tile';
import { LineChart } from '../components/charts/LineChart';
import { GrowthChart } from '../components/charts/GrowthChart';
import { HorizontalBars } from '../components/charts/HorizontalBars';
import { RetentionHeatmap } from '../components/charts/RetentionHeatmap';
import { SiteHealthTable } from '../components/tables/SiteHealthTable';
import { RegionTable } from '../components/tables/RegionTable';
import { useDashboard } from '../context/DashboardContext';

export function AdoptionSection() {
  const { vm } = useDashboard();
  const { adopt, siteHealth, region } = vm;

  return (
    <div className="phg-section" id="secAdopt">
      <div className="phg-section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="phg-layerpill">Layer 2 · A1–A9</span>
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
          head={<CardHead cr="A3 · Adoption trend · Last 8 weeks" ct="Weekly active users" cd="Are more of your people using the app week over week?" />}
        >
          <LineChart cur={adopt.trendChart.cur} prev={adopt.trendChart.prev} />
        </Card>

        <Card
          accent="green"
          infoKey="chart.growth"
          aiKey="chart.growth"
          head={<CardHead cr="Growth accounting · Last 6 weeks" ct="New · returning · resurrecting · dormant" cd="How your active base changes each week." />}
        >
          <GrowthChart weeks={adopt.growthWeeks} />
          <div className="phg-legend">
            <span><i style={{ background: 'var(--phg-blue)' }} /> New</span>
            <span><i style={{ background: 'var(--phg-green)' }} /> Returning</span>
            <span><i style={{ background: 'var(--phg-orange)' }} /> Resurrecting</span>
            <span><i style={{ background: 'var(--phg-red)' }} /> Dormant</span>
          </div>
        </Card>
      </div>

      <div className="phg-two" style={{ marginTop: 14 }}>
        <Card
          accent="blue"
          infoKey="chart.retention"
          aiKey="chart.retention"
          bodyClassName="phg-tbl-wrap"
          head={<CardHead cr="Retention · weekly cohorts" ct="Do new users keep coming back?" cd="Each row = users first active that week; cells = % still active weeks later." />}
        >
          <RetentionHeatmap cohorts={adopt.retentionCohorts} rowLabels={adopt.retentionRowLabels} />
        </Card>

        <Card
          accent="orange"
          infoKey="chart.role"
          aiKey="chart.role"
          head={<CardHead cr="A8 · Adoption by role" ct="Who is (and isn't) using the app" cd="Active users ÷ provisioned users, per role." />}
        >
          <HorizontalBars rows={adopt.roleShares} />
          <div className="phg-kv" style={{ marginTop: 14 }}>
            <div><div className="phg-k">A6 · Module breadth</div><div className="phg-v">{adopt.breadthKv}</div><div className="phg-u">of licensed modules in use</div></div>
            <div><div className="phg-k">A4 · Dormant users</div><div className="phg-v">{adopt.dormantKv}</div><div className="phg-u">no activity 14+ days</div></div>
            <div><div className="phg-k">A5 · 14-day activation</div><div className="phg-v">{adopt.activationKv}</div><div className="phg-u">of new joiners</div></div>
          </div>
        </Card>
      </div>

      {siteHealth && (
        <Card
          accent="green"
          infoKey="chart.siteHealth"
          aiKey="chart.siteHealth"
          style={{ marginTop: 14 }}
          bodyClassName="phg-tbl-wrap"
          head={
            <CardHead
              cr={<>A9 · Site &amp; org adoption health <span className="phg-tierbadge">{siteHealth.tierBadge}</span></>}
              ct="Adoption league table — worst first"
              cd="Seat utilisation, trend and flagship-flow completion by site. ⚑ = sudden-drop early warning (WAU below 65% of 8-week peak)."
            />
          }
        >
          <table className="phg-league"><SiteHealthTable rows={siteHealth.rows} /></table>
        </Card>
      )}

      {region && (
        <Card
          accent="orange"
          infoKey="chart.region"
          aiKey="chart.region"
          style={{ marginTop: 14 }}
          bodyClassName="phg-tbl-wrap"
          head={
            <CardHead
              cr={<>Portfolio roll-up <span className="phg-tierbadge">Management</span></>}
              ct="Adoption health by region"
              cd="Drill a region → its sites → a single site."
            />
          }
        >
          <table className="phg-league"><RegionTable rows={region.rows} /></table>
        </Card>
      )}
    </div>
  );
}
