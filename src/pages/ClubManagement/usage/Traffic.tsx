import { useEffect, useMemo, useState } from "react";
import { CHART } from "./usageData";
import { useUsage } from "./UsageContext";
import { buildTraffic } from "@/features/posthog-dashboard/data/metrics";
import type { DashboardState } from "@/features/posthog-dashboard/data/metrics";
import { useTrafficUsageQueries } from "./usageQueries";
import {
  ChartCard,
  ChartTabs,
  HBarList,
  KV,
  Tile,
  TrendLineChart,
} from "./UsagePrimitives";

type UsageTab = "staff" | "views" | "sessions";

/** Traffic & Session — overall back-office traffic, staff activity and session behaviour. */
export function Traffic() {
  const { filters, setRecentlyActive } = useUsage();
  const [tab, setTab] = useState<UsageTab>("staff");
  const queries = useTrafficUsageQueries(filters);
  const trafficQuery = queries[0];
  const usageQuery = queries[1];
  const chartData = useMemo(() => buildTraffic(
    { sessTab: tab === "staff" ? "visitors" : tab } as DashboardState,
    filters.rangeFrom,
    filters.rangeTo,
    trafficQuery.data,
    usageQuery.data,
  ), [tab, filters.rangeFrom, filters.rangeTo, trafficQuery.data, usageQuery.data]);
  const usageChart = usageQuery.data ? chartData.chart : { ...chartData.chart, labels: [], cur: [], prev: [] };
  useEffect(() => {
    setRecentlyActive(trafficQuery.data?.tiles?.recently_online ?? null);
  }, [trafficQuery.data, setRecentlyActive]);
  const chart = {
    cur: usageChart.cur,
    prev: usageChart.prev,
    color: tab === "staff" ? CHART.blue : tab === "views" ? CHART.violet : CHART.green,
    fill: tab === "staff" ? CHART.fill : tab === "views" ? CHART.violetTint : CHART.greenTint,
    name: tab === "staff" ? "Active Staff" : tab === "views" ? "Views" : "Sessions",
  };
  const sessionMix = chartData.deviceRows.map(([label, value, color]) => ({ label, value, color }));
  const deltaLabel = (value: number | null) => value == null ? null : `${value > 0 ? "+" : ""}${value}% vs prev. period`;

  return (
    <section className="section">
      <div className="section-head">
        <h2>Traffic &amp; Session</h2>
      </div>

      {(trafficQuery.isLoading || usageQuery.isLoading) && <div className="bmnote" role="status">Loading traffic analytics…</div>}
      {(trafficQuery.isError || usageQuery.isError) && <div className="bmnote" role="alert">Some traffic analytics could not be loaded. Available metrics remain visible.</div>}
      {(!trafficQuery.isLoading && !trafficQuery.data || !usageQuery.isLoading && !usageQuery.data) && !trafficQuery.isError && !usageQuery.isError && <div className="bmnote">Some traffic analytics are unavailable for this date range.</div>}

      <div className="tiles" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <Tile
          label="Active Staff"
          val={chartData.tiles[0].disp}
          dir={chartData.tiles[0].delta == null ? "flat" : chartData.tiles[0].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(chartData.tiles[0].delta)}
          sub={chartData.tiles[0].sub}
        />
        <Tile
          label="Screen Views"
          val={chartData.tiles[1].disp}
          dir={chartData.tiles[1].delta == null ? "flat" : chartData.tiles[1].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(chartData.tiles[1].delta)}
          sub={chartData.tiles[1].sub}
        />
        <Tile
          label="Sessions"
          val={chartData.tiles[2].disp}
          dir={chartData.tiles[2].delta == null ? "flat" : chartData.tiles[2].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(chartData.tiles[2].delta)}
          sub={chartData.tiles[2].sub}
        />
        <Tile
          label="Session Duration"
          val={chartData.tiles[3].disp}
          dir={chartData.tiles[3].delta == null ? "flat" : chartData.tiles[3].delta >= 0 ? "up" : "dn"}
          delta={deltaLabel(chartData.tiles[3].delta)}
          sub={chartData.tiles[3].sub}
        />
        <Tile
          label="Bounce Rate"
          val={chartData.tiles[4].disp}
          dir={chartData.tiles[4].delta == null ? "flat" : chartData.tiles[4].delta <= 0 ? "up" : "dn"}
          delta={deltaLabel(chartData.tiles[4].delta)}
          sub={chartData.tiles[4].sub}
        />
        <Tile
          label="Recently Active"
          val={chartData.tiles[5].disp}
          dir="flat"
          delta={deltaLabel(chartData.tiles[5].delta)}
          sub={chartData.tiles[5].sub}
        />
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time · SVG chart"
          title="Usage over time"
          purpose="Active staff, screen views, and sessions over time, with the previous period overlaid for comparison. Built on the proposed distinct_id join key."
        >
          <ChartTabs
            value={tab}
            onChange={(k) => setTab(k as UsageTab)}
            options={[
              { key: "staff", label: "Active Staff" },
              { key: "views", label: "Views" },
              { key: "sessions", label: "Sessions" },
            ]}
          />
          <TrendLineChart
            labels={usageChart.labels}
            cur={chart.cur}
            prev={chart.prev}
            showPrev={filters.prev}
            color={chart.color}
            fill={chart.fill}
          />
          <div className="legend">
            <span>
              <i style={{ background: chart.color }} /> {chart.name}
            </span>
            <span>
              <i className="dash" /> Previous period
            </span>
          </div>
        </ChartCard>

        <ChartCard
          eyebrow="Session mix"
          title="What staff touch in a session"
          purpose="Share of sessions that touch each top-level area at least once — shows where staff attention concentrates in a working session on this desktop-only console."
        >
          <HBarList rows={sessionMix} />
          <div className="kv" style={{ marginTop: 14 }}>
            <KV k="Views / session" v={chartData.vpsKv} u="screens per visit" small />
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

export default Traffic;
