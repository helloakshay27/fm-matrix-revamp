import { CHART } from "./usageData";
import { useUsage } from "./UsageContext";
import { buildAdopt } from "@/features/posthog-dashboard/data/metrics";
import type { DashboardState } from "@/features/posthog-dashboard/data/metrics";
import { useAdoptionUsageQueries, useUsageModules } from "./usageQueries";
import { ChartCard, GrowthStackedBar, HBarList, KV, Tile, TrendLineChart } from "./UsagePrimitives";

/** Adoption & Engagement — module adoption, engagement depth and retention. */
export function Adoption() {
  const { filters } = useUsage();
  const queries = useAdoptionUsageQueries(filters);
  const modulesQuery = useUsageModules(filters);
  const [engQ, trendQ, growthQ, retentionQ, rolesQ] = queries;
  const data = buildAdopt({} as DashboardState, filters.rangeTo, engQ.data, trendQ.data, growthQ.data, retentionQ.data, rolesQ.data);
  const adoptionError = queries.some((q) => q.isError) || modulesQuery.isError;
  const adoptionLoading = queries.some((q) => q.isLoading) || modulesQuery.isLoading;
  // Each card skeletons only while the endpoint it reads from is loading.
  const tilesLoading = engQ.isLoading || trendQ.isLoading;
  const modules = modulesQuery.data?.tree ?? [];
  const deltaLabel = (value: number | null) => value == null ? null : `${value > 0 ? "+" : ""}${value}% vs prev. period`;
  const breadthRows = data.roleShares.map((r) => ({ label: `${r.name} (${r.users})`, value: r.share, color: r.color }));
  const trendChart = trendQ.data ? data.trendChart : { labels: [], cur: [], prev: [] };

  return (
    <section className="section">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
      </div>

      {adoptionLoading && <span className="sr-only" role="status">Loading adoption analytics…</span>}
      {adoptionError && <div className="bmnote" role="alert">Some adoption analytics could not be loaded. Available metrics remain visible.</div>}
      {!adoptionLoading && !adoptionError && queries.some((q) => !q.data) && <div className="bmnote">Some adoption analytics are unavailable for this date range.</div>}

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 16 }}>
        <Tile
          loading={tilesLoading}
          label="Stickiness"
          val={data.tiles[0].disp}
          dir={data.tiles[0].delta == null ? "flat" : data.tiles[0].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(data.tiles[0].delta)}
          sub={data.tiles[0].sub}
        />
        <Tile
          loading={tilesLoading}
          label="Adoption Trend"
          val={data.tiles[1].disp}
          dir={data.tiles[1].disp.startsWith("-") ? "dn" : "up"}
          delta={null}
          sub={data.tiles[1].sub}
        />
        <Tile
          loading={tilesLoading}
          label="14-Day Activation"
          val={data.tiles[2].disp}
          dir={data.tiles[2].delta == null ? "flat" : data.tiles[2].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(data.tiles[2].delta)}
          sub={data.tiles[2].sub}
        />
        <Tile
          loading={tilesLoading}
          label="Module Breadth"
          val={data.tiles[3].disp}
          dir="flat"
          delta={deltaLabel(data.tiles[3].delta)}
          sub={data.tiles[3].sub}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <ChartCard
          eyebrow="Trend · SVG line chart"
          title="Adoption trend (weekly active staff, last 8 weeks)"
          purpose="Weekly active staff over the last 8 weeks — the trend line behind the Adoption Trend tile above."
          loading={trendQ.isLoading}
          skeleton="line"
        >
          <TrendLineChart labels={trendChart.labels} cur={trendChart.cur} prev={trendChart.prev} showPrev={filters.prev && trendChart.prev.length > 0} color={CHART.blue} fill={CHART.fill} />
          <div className="legend">
            <span>
              <i style={{ background: CHART.blue }} /> Weekly active staff
            </span>
          </div>
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Growth accounting · Last 6 weeks"
          title="New · Returning · Resurrecting · Dormant"
          purpose="Breaks the active staff base into newly issued logins, retained staff, win-backs and staff going quiet — a fuller view than a simple new-vs-returning split."
          loading={growthQ.isLoading}
          skeleton="stacked"
        >
          <GrowthStackedBar
            labels={data.growthWeeks.map((w) => w.label)}
            series={[
              { label: "New", data: data.growthWeeks.map((w) => w.nw), color: CHART.blue },
              { label: "Returning", data: data.growthWeeks.map((w) => w.ret), color: CHART.green },
              { label: "Resurrecting", data: data.growthWeeks.map((w) => w.res), color: CHART.mint },
            ]}
            negSeries={{ label: "Dormant", data: data.growthWeeks.map((w) => w.dorm), color: CHART.red }}
          />
          <div className="legend">
            <span>
              <i style={{ background: CHART.blue }} /> New
            </span>
            <span>
              <i style={{ background: CHART.green }} /> Returning
            </span>
            <span>
              <i style={{ background: CHART.mint }} /> Resurrecting
            </span>
            <span>
              <i style={{ background: CHART.red }} /> Dormant
            </span>
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="Retention · weekly cohorts"
          title="Do new staff logins keep coming back?"
          purpose="Each row = distinct_id values first active that week (proposed join key); cells = % of that cohort still active N weeks later."
          loading={retentionQ.isLoading}
          skeleton="table" skeletonRows={6} skeletonCols={6}
        >
          <div className="tbl-wrap">
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Cohort</th>
                  {Array.from({ length: data.retentionCohorts[0]?.length ?? 0 }, (_, w) => (
                    <th key={w}>Week {w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.retentionCohorts.map((cohort, i) => (
                    <tr key={data.retentionRowLabels[i]}>
                      <td className="lbl">{data.retentionRowLabels[i]}</td>
                      {cohort.map((value, w) => value == null ? <td key={w} className="ph">·</td> : <td key={w} className={value > 55 ? "hot" : undefined} style={{ background: `rgba(var(--heat-rgb), calc(var(--heat-a0) + ${value / 100} * var(--heat-a1)))` }}>{value}%</td>)}
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Adoption by role"
          title="Which staff roles are active?"
          purpose="Active-user share and user counts by role, returned by the roles analytics endpoint."
          loading={rolesQ.isLoading}
          skeleton="bars"
        >
          <HBarList rows={breadthRows} />
        </ChartCard>

        <ChartCard
          eyebrow="Dormant staff"
          title="Dormant staff"
          purpose="Dormant-user count and activity band returned by the adoption engagement endpoint."
          loading={engQ.isLoading}
          skeleton="kv"
        >
          <div className="kv">
            <KV
              k="Dormant staff"
              v={engQ.data?.dormant_users ? String(engQ.data.dormant_users.value) : "—"}
              u={engQ.data?.dormant_users?.band ?? ""}
            />
          </div>
        </ChartCard>
      </div>

      <div style={{ marginTop: 12 }}>
        <ChartCard
          eyebrow="League table"
          title="Module-wise breakdown"
          purpose="Module users, events and sessions from the API. The endpoint does not return duration, trend or status values."
          loading={modulesQuery.isLoading}
          skeleton="table" skeletonRows={5} skeletonCols={7}
        >
          <div className="tbl-wrap">
            <table className="league">
              <thead>
                <tr>
                  <th>Module</th>
                  <th className="num">Active users</th>
                  <th className="num">Events</th>
                  <th className="num">Sessions</th>
                  <th>Avg time</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((row) => <tr key={row.name}><td className="strong">{row.name}</td><td className="num">{row.users.toLocaleString()}</td><td className="num">{row.events.toLocaleString()}</td><td className="num">{row.sessions.toLocaleString()}</td><td>—</td><td>—</td><td>—</td></tr>)}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

export default Adoption;
