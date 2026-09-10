import React, { useMemo } from "react";
import { usePulseDashboard } from "../contexts/PulseDashboardContext";
import { KpiTile } from "../components/common/KpiTile";
import { LineChart } from "../components/charts/LineChart";
import { SectionState } from "../components/common/SectionState";
import { tileToKpi } from "../utils/tileAdapter";
import { getChartColors } from "../utils/chartColors";

// Platform labels shown in the device-split card. The API reports Desktop /
// Mobile groups; Pulse is a mobile-first app so we present those rows as the
// Android vs iOS split users care about. The share/percentage data is untouched.
const DEVICE_LABELS: Record<string, string> = {
  Desktop: "Android",
  Mobile: "iOS",
};

// x-axis labels arrive as "M/D" (e.g. 8/5). Render them as the month name so
// the usage-over-time chart shows Jan/Mar/May/... instead of day/month. The
// underlying dates, data and tick positions are untouched.
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toMonthLabel = (label: string): string => {
  const m = parseInt(label.split("/")[0], 10);
  return m >= 1 && m <= 12 ? MONTH_NAMES[m - 1] : label;
};

export const TrafficSession: React.FC = () => {
  const { sessTab, setSessTab, theme, vm } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const t = vm.traffic;

  // Usage chart line styling per tab — matches the wireframe's colour choices.
  const xLabels = useMemo(() => t.chart.labels.map(toMonthLabel), [t.chart.labels]);
  const chartOpts = useMemo(() => {
    if (sessTab === "visitors") {
      return { labels: xLabels, color: colors.blue, fill: colors.fill, metric: "Visitors" };
    }
    if (sessTab === "views") {
      return { labels: xLabels, color: colors.violet, fill: colors.violetTint, metric: "Views" };
    }
    return { labels: xLabels, color: colors.green, fill: "var(--green-tint)", metric: "Sessions" };
  }, [sessTab, xLabels, colors]);

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
                    <b>Usage over time</b>
                    For each day in the range, the solid line plots the chosen measure — Visitors (distinct active people), Views (screens opened) or Sessions (visits). The faint dashed line is the same measure for the immediately preceding period of equal length.
                    <div className="sep">
                      Lets you spot the trend and compare it like-for-like against the previous period. The short dashed tail at the end is a simple projection of where the current pace is heading.
                    </div>
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
                  <div className="ct">Android vs iOS usage</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Device / platform split</b>
                    Sessions split by the device they came from — Desktop, iOS and other mobile — each shown as a share of total sessions.
                    <div className="sep">
                      Tells you how residents are reaching the app. A heavy mobile/iOS share usually means people working on the move rather than at a desk — Pulse is a mobile-first community app, so this shows where release testing and support effort should concentrate.
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-deviceSplit">
              <div className="hbars">
                {t.deviceRows.length > 0 ? (
                  t.deviceRows.map(row => (
                    <div className="role" key={row[0]}>
                      <div className="rn">{DEVICE_LABELS[row[0]] ?? row[0]}</div>
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