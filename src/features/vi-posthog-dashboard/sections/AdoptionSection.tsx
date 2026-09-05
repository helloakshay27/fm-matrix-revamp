import {
  GROWTH_WEEKS,
  INFO,
  TREND_WEEKS,
} from '@/features/posthog-dashboard/data/constants';
import { fmtDur, pct } from '@/features/posthog-dashboard/data/format';
import { ChartCard } from '../components/ChartCard';
import { Guard } from '../components/Guard';
import { Tile } from '../components/Tile';
import { LineChart } from '../components/charts/LineChart';
import { StackedBarChart } from '../components/charts/StackedBarChart';
import { useViDashboard } from '../context/viDashboardStore';
import { toViTiles } from '../data/viMetricIds';
import {
  TIER_LABEL,
  VI_COVERAGE_CAVEAT,
  VI_LEGACY_EVENTS,
  VI_MODERN_EVENTS,
  VI_MODULE_COVERAGE,
  viLegacyModuleCount,
  viModernModuleCount,
} from '../data/instrumentationCoverage';

/** Layer 2 — adoption_engagement, adoption_trend, growth, retention, roles + the site league. */
export function AdoptionSection() {
  const { vm, setCircle, palette } = useViDashboard();
  const { adopt, status } = vm;

  const retentionCols = adopt.retentionCohorts[0]?.length ?? 0;

  return (
    <section className="page on">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">
          Measure how effectively employees adopt and engage with the app&rsquo;s major modules, and
          whether they keep coming back day over day.
        </span>
      </div>
      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules and workplace services receive the highest engagement and adoption?</li>
          <li>Are employees returning to the application, and is retention improving over time?</li>
          <li>How does usage differ across roles and across sites?</li>
        </ul>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 16 }}>
        {toViTiles(adopt.tiles).map((t) => (
          <Tile key={t.id} spec={t} />
        ))}
      </div>

      <ChartCard
        className="mt12"
        eyebrow="Trend · SVG line chart"
        title={`Adoption trend (weekly active employees, last ${TREND_WEEKS} weeks)`}
        purpose={`Weekly active employees over the last ${TREND_WEEKS} weeks — the trend line behind the Adoption Trend tile above.`}
      >
        <Guard
          status={status.adopt}
          empty={!adopt.trendChart.cur.some((v) => v > 0)}
          emptyLabel="No weekly activity recorded."
        >
          <LineChart
            cur={adopt.trendChart.cur}
            prev={adopt.trendChart.prev.length ? adopt.trendChart.prev : null}
            labels={adopt.trendChart.labels}
            color={palette.blue}
            fill={palette.fill}
          />
          <div className="legend">
            <span>
              <i style={{ background: palette.blue }} /> Weekly active employees
            </span>
            {adopt.trendChart.prev.length > 0 && (
              <span>
                <i className="dash" /> Previous period
              </span>
            )}
          </div>
        </Guard>
      </ChartCard>

      <div className="grid2">
        <ChartCard
          eyebrow={`Growth accounting (A7) · last ${GROWTH_WEEKS} weeks`}
          title="New · Returning · Resurrected · Dormant"
          purpose={INFO['chart.growth'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.growthWeeks.length === 0}
            emptyLabel="No growth data for this filter set."
          >
            <StackedBarChart
              labels={adopt.growthWeeks.map((w) => w.label)}
              series={[
                { label: 'New', data: adopt.growthWeeks.map((w) => w.nw), color: palette.blue },
                { label: 'Returning', data: adopt.growthWeeks.map((w) => w.ret), color: palette.green },
                { label: 'Resurrected', data: adopt.growthWeeks.map((w) => w.res), color: palette.mint },
              ]}
              negSeries={{
                label: 'Dormant',
                data: adopt.growthWeeks.map((w) => w.dorm),
                color: palette.red,
              }}
            />
            <div className="legend">
              <span>
                <i style={{ background: palette.blue }} /> New
              </span>
              <span>
                <i style={{ background: palette.green }} /> Returning
              </span>
              <span>
                <i style={{ background: palette.mint }} /> Resurrected
              </span>
              <span>
                <i style={{ background: palette.red }} /> Dormant
              </span>
            </div>
          </Guard>
        </ChartCard>

        <ChartCard
          eyebrow="Retention cohort grid (A8)"
          title="Do new users keep coming back?"
          purpose={INFO['chart.retention'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.retentionCohorts.length === 0}
            emptyLabel="No cohorts in this window."
          >
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cohort · size</th>
                  {Array.from({ length: retentionCols }, (_, w) => (
                    <th key={w}>Week {w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adopt.retentionCohorts.map((row, i) => (
                  <tr key={adopt.retentionRowLabels[i]}>
                    <td className="lbl">{adopt.retentionRowLabels[i]}</td>
                    {row.map((v, w) => {
                      if (v == null) {
                        return (
                          <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>
                            ·
                          </td>
                        );
                      }
                      const t = v / 100;
                      return (
                        <td
                          key={w}
                          style={{
                            background: `rgba(${palette.heatRgb},${(palette.heatA0 + t * palette.heatA1).toFixed(2)})`,
                            color: t > 0.55 ? palette.onHeat : 'var(--ink)',
                          }}
                        >
                          {v}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Guard>
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Adoption by role (A9)"
          title="Who is (and isn't) using the app"
          purpose={INFO['chart.role'].f}
        >
          <Guard
            status={status.adopt}
            empty={adopt.roleShares.length === 0}
            emptyLabel="No role breakdown for this filter set."
          >
            <div className="hbars">
              {adopt.roleShares.map((r) => (
                <div className="role" key={r.name}>
                  <div className="rn" title={`${r.users} users`}>
                    {r.name}
                  </div>
                  <div className="rbar">
                    <i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }} />
                  </div>
                  <div className="rv">{pct(r.share)}</div>
                </div>
              ))}
            </div>
            <div className="bmnote" style={{ marginTop: 12 }}>
              <span>&#8505;</span>
              <div>
                The reference specifies A9 as a split by <b>employment type</b> (Internal FTE vs.
                External contractor/vendor). No such property exists on any event in the
                catalogue &mdash; the reference itself tags A9 &ldquo;proposed&rdquo;, reasoning by
                analogy from the M-Safe dashboard. This card shows the <code>role</code> split,
                which is a confirmed context property, until employment type is instrumented.
              </div>
            </div>
          </Guard>
        </ChartCard>

        {/*
          Dormant stands alone here, as it does in the reference. Module Breadth used to share
          this card, which put an unrelated metric — and a second, differently-scaled number —
          under a heading that says Dormant users; it already has its own tile in the row above,
          so the reader was reading the same figure twice under the wrong label.
        */}
        <ChartCard
          eyebrow="Dormant users (A10)"
          title="Dormant users"
          purpose="Registered employees/contractors with no activity in the last 14 days — out of scope for the 14-Day Activation tile above."
        >
          <Guard status={status.adopt}>
            <div className="kv">
              <div>
                <div className="k">Dormant employees</div>
                <div className="v" style={{ fontSize: 22 }}>
                  {adopt.dormantKv}
                </div>
                <div className="u">no activity 14+ days</div>
              </div>
            </div>
          </Guard>
        </ChartCard>
      </div>

      {/*
        Reference card, not a filter — it describes which generation of tracking code exists
        per module and changes no other number on this page. The reference dashboard also puts
        per-tier active-user counts and modern/legacy reach percentages here; those are seeded
        sample data in that wireframe, so they are left out rather than invented. What is real
        is the module list, each module's tier, and the per-sheet event totals.
      */}
      <ChartCard
        className="mt12"
        eyebrow="Instrumentation coverage · reference"
        title="Modern vs. Legacy event coverage"
        purpose="Reference card — not a filter. Vi my Workspace carries two instrumentation generations side by side: Modern (128 events, View/Action/Failure typed, real *_submitted / *_succeeded / *_failed funnels for the fully-instrumented modules) and Legacy (176 older Google-Analytics events, dual-sunk to both PostHog and Firebase, mostly page/click-only for the rest). This card shows both at once so you can see which modules are worth instrumenting properly next; it does not change any other number on the dashboard."
      >
        <div className="bmnote crashnote" style={{ marginBottom: 14 }}>
          <span>&#9888;</span>
          <div>
            <b>{VI_COVERAGE_CAVEAT.headline}</b> {VI_COVERAGE_CAVEAT.body}
          </div>
        </div>

        <div className="kv" style={{ marginBottom: 16 }}>
          <div>
            <div className="k">Modern instrumentation</div>
            <div className="v" style={{ fontSize: 20 }}>
              {viModernModuleCount} modules
            </div>
            <div className="u">{VI_MODERN_EVENTS} events · view / action / submit / outcome</div>
          </div>
          <div>
            <div className="k">Legacy GA instrumentation</div>
            <div className="v" style={{ fontSize: 20 }}>
              {viLegacyModuleCount} modules
            </div>
            <div className="u">{VI_LEGACY_EVENTS} events · mostly page / click only</div>
          </div>
        </div>

        <table className="pathtbl">
          <thead>
            <tr>
              <th>Module</th>
              <th>Tier</th>
              <th>What exists</th>
            </tr>
          </thead>
          <tbody>
            {VI_MODULE_COVERAGE.map((m) => (
              <tr key={m.name}>
                <td>{m.name}</td>
                <td>
                  {/* Both = the same feature is documented in each sheet, so it has the full
                      modern funnel AND the older click events still firing alongside it. */}
                  <span
                    className={`status ${
                      m.tier === 'both'
                        ? 'st-healthy'
                        : m.tier === 'modern'
                          ? 'st-watch'
                          : 'st-drop'
                    }`}
                  >
                    {TIER_LABEL[m.tier]}
                  </span>
                </td>
                <td>
                  {m.tier === 'both'
                    ? 'Full funnel + legacy click events'
                    : m.tier === 'modern'
                      ? 'View / action / failure typed events'
                      : 'Page / click events only — no step-level funnel'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ChartCard>

      {/*
        Circle-wise breakdown (A12) is hidden: the mobile-app events this dashboard reads
        carry no site, so `site_id` is never sent and there is no per-circle split to show.
        The league table and its `useSiteLeague` query were removed with it — restore both
        from git history if app events start carrying a site.
      */}
    </section>
  );
}
