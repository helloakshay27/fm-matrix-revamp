import React, { useMemo } from "react";
import { usePulseDashboard } from "../contexts/PulseDashboardContext";
import { KpiTile } from "../components/common/KpiTile";
import { LineChart } from "../components/charts/LineChart";
import { StackedBarChart } from "../components/charts/StackedBarChart";
import { SectionState } from "../components/common/SectionState";
import { fmtDurShort, tileToKpi } from "../utils/tileAdapter";
import { getChartColors } from "../utils/chartColors";

export const AdoptionEngagement: React.FC = () => {
  const { theme, vm } = usePulseDashboard();
  const colors = useMemo(() => getChartColors(), [theme]);

  const adopt = vm.adopt;

  // Retention heat columns — reference layout shows Week 0 through Week 5.
  const retentionCols = 6;

  const trendPrev = adopt.trendChart.prev.length ? adopt.trendChart.prev : undefined;

  // x-axis ticks arrive as "M/D" week-start dates (e.g. 7/13). Display them as
  // positional week labels (W1, W3, ...) for the 8-week window. The underlying
  // dates/data and the number of visible tick positions are unchanged.
  const trendLabels = adopt.trendChart.labels.map((_, i) => `W${i + 1}`);

  const growthSeries = useMemo(
    () => [
      { label: "New", data: adopt.growthWeeks.map(w => w.nw), color: colors.blue },
      { label: "Returning", data: adopt.growthWeeks.map(w => w.ret), color: colors.green },
      { label: "Resurrecting", data: adopt.growthWeeks.map(w => w.res), color: colors.mint }
    ],
    [adopt.growthWeeks, colors]
  );
  const growthNeg = useMemo(
    () => ({ label: "Dormant", data: adopt.growthWeeks.map(w => w.dorm), color: colors.red }),
    [adopt.growthWeeks, colors]
  );
  const growthLabels = adopt.growthWeeks.map((_, i) => `W${i + 1}`);

  const statusFor = (row: { users: number; bounce: number; trend: number | null }) => {
    if (row.users === 0 || (row.trend != null && row.trend <= -25)) {
      return { className: "st-drop", label: "Drop" };
    }
    if (row.bounce >= 40 || (row.trend != null && row.trend < 0)) {
      return { className: "st-watch", label: "Watch" };
    }
    return { className: "st-healthy", label: "Healthy" };
  };

  const heatStyle = (val: number) => {
    const t = val / 100;
    const bg = `rgba(${colors.heat}, ${(colors.heatA0 + t * colors.heatA1).toFixed(2)})`;
    const textCol = t > 0.55 ? colors.onHeat : "var(--ink)";
    return { background: bg, color: textCol };
  };

  return (
    <section className="page on" id="pgAdopt">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">Measure how effectively residents adopt and engage with the app&rsquo;s major modules, and whether they keep coming back.</span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules and services receive the highest engagement and adoption?</li>
          <li>Which modules need UX improvements, and where do residents spend the most time?</li>
          <li>Are residents returning to the application, and is retention improving over time?</li>
        </ul>
      </div>

      <SectionState status={vm.status.adopt} label="adoption data">
        {/* KPI Tiles */}
        <div className="tiles" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginTop: "16px" }} id="tilesAdoption">
          <KpiTile
            {...tileToKpi(adopt.tiles[0], { label: "Seat Utilisation", id: "seatUtil" })}
          />
          <KpiTile
            {...tileToKpi(adopt.tiles[1], { label: "Stickiness", id: "stickiness" })}
          />
          <KpiTile
            {...tileToKpi(adopt.tiles[2], { label: "Adoption Trend", noTarget: true })}
          />
          <KpiTile
            {...tileToKpi(adopt.tiles[3], { label: "14-Day Activation", id: "activation14" })}
          />
          <KpiTile
            {...tileToKpi(adopt.tiles[4], { label: "Module Breadth", id: "moduleBreadth2", noTarget: true })}
          />
        </div>

        {/* Adoption Trend Chart */}
        <div className="card" style={{ marginTop: "12px" }} id="card-adoptionTrend">
          <div className="card-head">
            <div className="charthead">
              <div>
                <div className="cr">Trend &middot; weekly active users</div>
                <div className="ct">Adoption trend (weekly active users, last 8 weeks)</div>
              </div>
              <span className="info-wrap">
                <button className="info-btn" type="button" tabIndex={-1}>i</button>
                <div className="info-pop">
                  <b>Adoption trend</b>
                  Weekly active users (WAU) plotted for each of the last 8 weeks, with the faint dashed line showing the prior comparison period.
                  <div className="sep">
                    Shows whether more of your community is engaging week over week, or whether active usage has flattened or fallen — the trend line behind the Adoption Trend tile above.
                  </div>
                </div>
              </span>
            </div>
          </div>
          <div className="card-body" id="body-adoptTrendChart">
            <LineChart
              cur={adopt.trendChart.cur}
              prev={trendPrev}
              opts={{ labels: trendLabels, color: colors.blue, fill: colors.fill, metric: "Weekly active users" }}
            />
            <div className="legend">
              <span>
                <i style={{ background: colors.blue }}></i> Weekly active users
              </span>
              {trendPrev && (
                <span>
                  <i className="dash"></i> Previous 8 weeks
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid2">
          {/* Growth Accounting stacked chart */}
          <div className="card" id="card-growthAccounting">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Growth accounting &middot; Last 6 weeks</div>
                  <div className="ct">New &middot; Returning &middot; Resurrecting &middot; Dormant</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Growth accounting</b>
                    Each week, active users are split into New (first-ever active), Returning (active the prior week too) and Resurrected (came back after a gap) above the line, with Dormant (were active before, not this week) shown below the line.
                    <div className="sep">
                      Explains why your active-user number moved: bars above zero are gains, the bar below zero is the loss. If losses regularly outweigh gains, growth is at risk — a fuller view than a simple new-vs-returning split.
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-growthAcct">
              <StackedBarChart
                labels={growthLabels}
                series={growthSeries}
                negSeries={growthNeg}
              />
              <div className="legend">
                <span><i style={{ background: colors.blue }}></i> New</span>
                <span><i style={{ background: colors.green }}></i> Returning</span>
                <span><i style={{ background: colors.mint }}></i> Resurrecting</span>
                <span><i style={{ background: colors.red }}></i> Dormant</span>
              </div>
            </div>
          </div>

          {/* Retention cohort grid */}
          <div className="card" id="card-retentionCohort">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Retention &middot; weekly cohorts</div>
                  <div className="ct">Do new users keep coming back?</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Retention</b>
                    Each row = residents first active that week; cells = % of that cohort still active N weeks later.
                    <div className="sep">
                      Reading left to right shows how well each joining group sticks around. Darker cells mean more people retained. It answers "once people start, do they keep coming back?"
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-retentionCohort">
              {adopt.retentionCohorts.length > 0 ? (
                <table className="rt">
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Cohort</th>
                      {Array.from({ length: retentionCols }).map((_, w) => (
                        <th key={w}>Week {w}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {adopt.retentionCohorts.map((curve, i) => (
                      <tr key={i}>
                        <td className="lbl">{adopt.retentionRowLabels[i] ?? `Cohort ${i + 1}`}</td>
                        {Array.from({ length: retentionCols }).map((_, w) => {
                          const val = curve[w];
                          if (val == null) {
                            return (
                              <td key={w} style={{ background: "var(--surface-2)", color: "var(--faint)" }}>
                                &middot;
                              </td>
                            );
                          }
                          return (
                            <td key={w} style={heatStyle(val)}>
                              {val}%
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="sd">No cohort data in period</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid2">
          {/* Audience split bars */}
          <div className="card" id="card-roleSplit">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Adoption by audience</div>
                  <div className="ct">Who is (and isn't) using the app</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Adoption by audience</b>
                    Active people broken down by their resident category (owner, tenant, visitor/family member), each shown as a share within the group — active users ÷ registered users per category.
                    <div className="sep">
                      Shows which type of resident is actually engaging. If a key category such as tenants is under-represented, adoption may be uneven — helping the community team see which segment of the resident base is actually engaging.
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-roleSplit">
              <div className="hbars">
                {adopt.roleShares.length > 0 ? (
                  adopt.roleShares.map((r, idx) => (
                    <div className="role" key={idx}>
                      <div className="rn">{r.name}</div>
                      <div className="rbar">
                        <i style={{ width: `${Math.round(r.share * 100)}%`, background: r.color }}></i>
                      </div>
                      <div className="rv">{(r.share * 100).toFixed(0)}%</div>
                    </div>
                  ))
                ) : (
                  <div className="sd">No role data in period</div>
                )}
              </div>
            </div>
          </div>

          {/* Dormant users card */}
          <div className="card" id="card-dormant">
            <div className="card-head">
              <div className="charthead">
                <div>
                  <div className="cr">Dormant users</div>
                  <div className="ct">Dormant users</div>
                </div>
                <span className="info-wrap">
                  <button className="info-btn" type="button" tabIndex={-1}>i</button>
                  <div className="info-pop">
                    <b>Dormant users</b>
                    Registered residents with no activity in the last 14 days.
                    <div className="sep">
                      There is no such thing as a completely "dead" user — some residents only engage seasonally (e.g. when a service or event interest them). This shows how many of the base is going quiet and is out of scope for the 14-Day Activation tile above.
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="card-body" id="body-dormantUsers">
              <div className="kv">
                <div>
                  <div className="k">Dormant residents</div>
                  <div className="v" style={{ fontSize: "22px" }}>
                    {adopt.dormantKv}
                  </div>
                  <div className="u">no activity in period</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionState>

      {/* Site-wise breakdown table — one traffic_session call for all sites in scope */}
      <div className="card" style={{ marginTop: "16px" }} id="card-siteWise">
        <div className="card-head">
          <div className="charthead">
            <div>
              <div className="cr">League table</div>
              <div className="ct">Site-wise breakdown</div>
            </div>
            <span className="info-wrap">
              <button className="info-btn" type="button" tabIndex={-1}>i</button>
              <div className="info-pop">
                <b>Site-wise breakdown</b>
                One row per site in scope, showing its active users, sessions, average session length and bounce rate, plus the change in active users versus the previous period — ranked busiest first so sites with no events sit at the bottom. Status flags a sudden drop (active users down 25%+), a site to watch, or a healthy site.
                <div className="sep">
                  A leaderboard to see which sites are adopting well and which are lagging or dropping and may need attention. There is no per-site endpoint, so each row is its own traffic_session call — the table only loads on the All-sites scope, and rows appear as each call lands.
                </div>
              </div>
            </span>
          </div>
        </div>
        <div className="card-body" id="body-siteWise">
          {vm.scopedSites.length < 2 ? (
            <div className="sd">
              Select a scope with 2+ sites (or All Sites) to compare sites against each other.
            </div>
          ) : (
            <SectionState status={vm.status.siteHealth} label="site breakdown">
              {vm.siteHealth ? (
                <div className="tbl-wrap">
                  <table className="league">
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th className="num">Active users</th>
                        <th className="num">Sessions</th>
                        <th className="num">Avg session</th>
                        <th className="num">Bounce</th>
                        <th>Trend</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vm.siteHealth.rows.map((row, idx) => {
                        const status = statusFor(row);
                        const trendSym = row.trend == null || row.trend === 0
                          ? "→"
                          : row.trend > 0
                            ? "↗"
                            : "↘";
                        const trendCls = row.trend == null || row.trend === 0
                          ? "flat"
                          : row.trend > 0
                            ? "up"
                            : "dn";

                        return (
                          <tr key={idx}>
                            <td className="strong">{row.name}</td>
                            <td className="num">{row.users.toLocaleString()}</td>
                            <td className="num">{row.sessions.toLocaleString()}</td>
                            <td className="num">{fmtDurShort(row.durSec)}</td>
                            <td className="num">{Math.round(row.bounce)}%</td>
                            <td>
                              <span className={`arrow ${trendCls}`}>
                                {trendSym}
                              </span>
                            </td>
                            <td>
                              <span className={`status ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="sd">No site activity in this period.</div>
              )}
            </SectionState>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdoptionEngagement;