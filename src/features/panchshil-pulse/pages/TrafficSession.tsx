import React, { useMemo } from "react";
import { usePulseDashboard } from "../contexts/PulseDashboardContext";
import { KpiTile } from "../components/common/KpiTile";
import { LineChart } from "../components/charts/LineChart";
import { SectionState } from "../components/common/SectionState";
import { tileToKpi } from "../utils/tileAdapter";
import { getChartColors } from "../utils/chartColors";

export const TrafficSession: React.FC = () => {
  const { sessTab, setSessTab, theme, vm } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const t = vm.traffic;

  // Usage chart line styling per tab — matches the wireframe's colour choices.
  const chartOpts = useMemo(() => {
    if (sessTab === "visitors") {
      return { labels: t.chart.labels, color: colors.blue, fill: colors.fill };
    }
    if (sessTab === "views") {
      return { labels: t.chart.labels, color: colors.violet, fill: colors.violetTint };
    }
    return { labels: t.chart.labels, color: colors.green, fill: "var(--green-tint)" };
  }, [sessTab, t.chart.labels, colors]);

  return (
    <section className="page on" id="pgTraffic">
      <div className="section-head">
        <div className="eyebrow-sec"></div>
        <h2>Traffic &amp; Session</h2>
        <span className="sd">Monitor overall application traffic, resident activity, and session behavior.</span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>How many residents are actively using the app, and how frequently?</li>
          <li>Which sites generate the highest traffic, and are residents returning?</li>
        </ul>
      </div>

      <SectionState status={vm.status.traffic} label="traffic data">
        {/* KPI Tiles */}
        <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)" }} id="tilesTraffic">
          <KpiTile
            {...tileToKpi(t.tiles[0], { label: "Active Users", id: "activeUsers" })}
          />
          <KpiTile
            {...tileToKpi(t.tiles[1], { label: "Screen Views" })}
            noTarget
          />
          <KpiTile
            {...tileToKpi(t.tiles[2], { label: "Sessions" })}
            noTarget
          />
          <KpiTile
            {...tileToKpi(t.tiles[3], { label: "Session Duration", noTarget: true })}
          />
          <KpiTile
            {...tileToKpi(t.tiles[4], { label: "Bounce Rate", id: "bounceRate" })}
          />
          <KpiTile
            {...tileToKpi(
              { ...t.tiles[5], delta: null, sub: "active in last 30 min" },
              { label: "Recently Online", noTarget: true }
            )}
          />
        </div>

        <div className="grid2">
          {/* Usage Over Time Chart Card */}
          <div className="card" id="card-trafficActive">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Usage over time</div>
                  <div className="ct">Usage over time</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Purpose</b>
                    Visitors, screen views, and sessions over time, across all sites, with the previous period overlaid for comparison.
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-trafActive">
              <div className="charttabs" id="usageTabs" style={{ marginBottom: "10px" }}>
                <button
                  className={sessTab === "visitors" ? "on" : ""}
                  onClick={() => setSessTab("visitors")}
                >
                  Visitors
                </button>
                <button
                  className={sessTab === "views" ? "on" : ""}
                  onClick={() => setSessTab("views")}
                >
                  Views
                </button>
                <button
                  className={sessTab === "sessions" ? "on" : ""}
                  onClick={() => setSessTab("sessions")}
                >
                  Sessions
                </button>
              </div>

              <div id="usageChartBody">
                <LineChart cur={t.chart.cur} prev={t.chart.prev} opts={chartOpts} />

                <div className="legend">
                  {sessTab === "visitors" && (
                    <span>
                      <i style={{ background: colors.blue }}></i> Visitors
                    </span>
                  )}
                  {sessTab === "views" && (
                    <span>
                      <i style={{ background: colors.violet }}></i> Views
                    </span>
                  )}
                  {sessTab === "sessions" && (
                    <span>
                      <i style={{ background: colors.green }}></i> Sessions
                    </span>
                  )}
                  <span>
                    <i className="dash"></i> Previous period
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Split Card */}
          <div className="card" id="card-deviceSplit">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Device / platform split</div>
                  <div className="ct">Web app vs mobile OS usage</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Purpose</b>
                    Share of sessions by device_platform — Pulse is a mobile-first community app, so this shows where release testing and support effort should concentrate.
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-deviceSplit">
              <div className="hbars">
                {t.deviceRows.length > 0 ? (
                  t.deviceRows.map(row => (
                    <div className="role" key={row[0]}>
                      <div className="rn">{row[0]}</div>
                      <div className="rbar">
                        <i style={{ width: `${Math.round(row[1] * 100)}%`, background: row[2] }}></i>
                      </div>
                      <div className="rv">{(row[1] * 100).toFixed(0)}%</div>
                    </div>
                  ))
                ) : (
                  <div className="sd">No device data in period</div>
                )}
              </div>

              <div className="kv" style={{ marginTop: "14px" }}>
                <div>
                  <div className="k">Views / session</div>
                  <div className="v" style={{ fontSize: "18px" }}>
                    {t.vpsKv}
                  </div>
                  <div className="u">screens per visit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionState>
    </section>
  );
};

export default TrafficSession;