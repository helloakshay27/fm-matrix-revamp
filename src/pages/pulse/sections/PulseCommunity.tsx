import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { MessageCircle, ArrowUp, ArrowDown, User } from "lucide-react";
import {
  fetchCommunityOverview,
  fetchCommunityEngagement,
  type CommunityOverview,
  type CommunityEngagement,
  type PulseFilters,
} from "@/services/pulseDashboardApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const PALETTE = [
  "#DA7756",
  "#798C5E",
  "#6B9BCC",
  "#EDC488",
  "#CECBF6",
  "#9EC8BA",
  "#E7848E",
  "#AAB9C5",
];
const C = {
  green: "#798C5E",
  red: "#B50F0F",
  graphRed: "#D96A75",
  lightPink: "#F28C8F",
  orange: "#EDC488",
  gray: "#AAB9C5",
  blue: "#6B9BCC",
  purple: "#CECBF6",
};

// Static placeholder — no backing API yet for member-retention funnel data.
const STATIC_RETENTION_FUNNEL = [
  { label: "New Members", pct: 100 },
  { label: "Onboarded", pct: 82 },
  { label: "Active (30d)", pct: 64 },
  { label: "Engaged", pct: 47 },
  { label: "Retained", pct: 34 },
];
// Lightest at the top of the funnel, darkening toward "Retained".
const RETENTION_COLORS = STATIC_RETENTION_FUNNEL.map(
  (_, i) =>
    `color-mix(in srgb, var(--color-secondary-teal) ${100 - (i / (STATIC_RETENTION_FUNNEL.length - 1)) * 100}%, var(--color-growth-solid) ${(i / (STATIC_RETENTION_FUNNEL.length - 1)) * 100}%)`
);

// Static placeholder — no backing API yet for per-member activity.
const STATIC_MOST_ACTIVE_MEMBER = { name: "Rahul S.", events: 20 };

interface Props {
  filters: PulseFilters;
}

export function PulseCommunity({ filters }: Props) {
  const [overview, setOverview] = useState<CommunityOverview | null>(null);
  const [engagementData, setEngagementData] = useState<CommunityEngagement | null>(null);
  const [loading, setLoading] = useState(true);

  const pulseEvents = usePulseEvents();


  // Fires once when the Community tab is mounted (tab switch renders a fresh instance).
  useEffect(() => {
    pulseEvents.onCommunityViewed();
  }, [pulseEvents]);

  useEffect(() => {
    loadAll();
  }, [filters]);

  async function loadAll() {
    setLoading(true);
    try {
      const [oR, eR] = await Promise.allSettled([
        fetchCommunityOverview(filters),
        fetchCommunityEngagement(filters),
      ]);
      if (oR.status === "fulfilled") setOverview(oR.value);
      else console.error("[PulseCommunity] community_overview failed:", oR.reason);
      if (eR.status === "fulfilled") setEngagementData(eR.value);
      else console.error("[PulseCommunity] community_engagement failed:", eR.reason);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading community…
      </div>
    );
  }

  const top3 = overview?.top_communities.slice(0, 3) ?? [];

  // Transform trend data for recharts (needs array of { month, Community1: n, Community2: n, ... })
  const trendData = overview
    ? overview.member_growth_trend.labels.map((month, mi) => {
      const row: Record<string, string | number> = { month };
      overview.member_growth_trend.series.forEach((c) => {
        row[c.name] = c.data[mi] ?? 0;
      });
      return row;
    })
    : [];

  // Transform breakdown for stacked bar chart.
  const breakdownData = engagementData
    ? engagementData.community_breakdown.map((b) => ({
      name: b.community_name,
      Approved: b.status_wise_breakdown.approved,
      Pending: b.status_wise_breakdown.pending,
      Rejected: b.status_wise_breakdown.rejected,
    }))
    : [];

  // Transform participation trend for recharts.
  const participationTrendData = engagementData
    ? engagementData.participation_trend.points.map((p) => ({
      month: p.label,
      "Total Participants": p.total_participants,
      "Active Contributors": p.active_contributors,
    }))
    : [];

  // Real Engaged / Not Engaged split for the Community Engagement Rate donut.
  const engagement = engagementData?.engagement;

  // Sparkline behind the "New Members This Month" stat — reuses the same
  // overall member-growth points so the card isn't just a bare number.
  const newMembers = overview?.new_members_this_month;
  const sparkPoints = overview?.member_growth_trend.points ?? [];
  const sparkMax = Math.max(1, ...sparkPoints.map((p) => p.members));
  const sparkPctX = (i: number) =>
    sparkPoints.length > 1 ? (i / (sparkPoints.length - 1)) * 100 : 50;
  const sparkPctY = (v: number) => 100 - (v / sparkMax) * 100;
  const NewMembersTrendIcon = newMembers?.trend === "down" ? ArrowDown : ArrowUp;

  const hasData = !!(
    overview ||
    engagementData ||
    top3.length ||
    trendData.length ||
    breakdownData.length
  );

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <MessageCircle className="pd-empty-icon" />
          No community data available for the selected filters.
        </div>
      )}

      {overview && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Communities", value: overview.kpis.total_communities },
            { label: "Active Communities", value: overview.kpis.active_communities },
            { label: "Inactive Communities", value: overview.kpis.inactive_communities },
            { label: "Total Members", value: overview.kpis.total_members },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pd-growth-row pd-growth-row--wrap-2col" style={{ marginBottom: 20 }}>
        {top3.length > 0 && (
          <div className="pd-growth-card pd-growth-card--community-top3">
            <div className="pd-panel-title">Top 3 Communities</div>
            <div className="pd-growth-chart-inner pd-ranked-list">
              {top3.map((c, i) => (
                <div key={c.community_id} className="pd-ranked-row">
                  <div className={`pd-ranked-pos pd-ranked-pos-${i + 1}`}>
                    {i + 1}
                  </div>
                  <div className="pd-ranked-name">{c.name}</div>
                  <div>
                    <span className="pd-ranked-count">
                      {c.members_count.toLocaleString()}
                    </span>
                    <span className="pd-ranked-count-lbl">members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trendData.length > 0 && overview && (
          <div className="pd-growth-card pd-growth-card--community-member-trend">
            <div className="pd-panel-title">Member Growth Trend</div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  {overview.member_growth_trend.series.map((c, i) => (
                    <Line
                      key={c.name}
                      type="monotone"
                      dataKey={c.name}
                      stroke={PALETTE[i % PALETTE.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {breakdownData.length > 0 && (
          <div className="pd-growth-card pd-growth-card--community-status-breakdown">
            <div className="pd-panel-title">
              Community Member Status Breakdown
            </div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdownData} margin={{ top: 8 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend
                    align="right"
                    wrapperStyle={{ fontSize: 10 }}
                    payload={[
                      { value: "Approved", type: "square", color: C.blue },
                      { value: "Pending", type: "square", color: C.graphRed },
                      { value: "Rejected", type: "square", color: C.lightPink },
                    ]}
                  />
                  <Bar dataKey="Rejected" fill={C.lightPink} stackId="members" />
                  <Bar dataKey="Pending" fill={C.graphRed} stackId="members" />
                  <Bar
                    dataKey="Approved"
                    fill={C.blue}
                    stackId="members"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {participationTrendData.length > 0 && (
          <div className="pd-growth-card pd-growth-card--community-participation-trend">
            <div className="pd-panel-title">Community Participation Trend</div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={participationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(0, 3)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar
                    dataKey="Total Participants"
                    fill={C.gray}
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                  <Line
                    type="monotone"
                    dataKey="Active Contributors"
                    stroke={C.red}
                    strokeWidth={2}
                    dot={{ r: 5, fill: C.red, strokeWidth: 0 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="pd-growth-row" style={{ marginBottom: 20 }}>
        <div className="pd-growth-card pd-growth-card--community-retention">
          <div className="pd-panel-title">Member Retention Rate</div>
          <div className="pd-growth-chart-inner pd-retention-funnel">
            {STATIC_RETENTION_FUNNEL.map((r, i) => (
              <div key={r.label} className="pd-retention-row">
                <span className="pd-retention-label">{r.label}</span>
                <span className="pd-retention-track">
                  <span
                    className="pd-retention-fill"
                    style={{ width: `${r.pct}%`, background: RETENTION_COLORS[i] }}
                  />
                </span>
                <span className="pd-retention-value">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="pd-growth-card pd-growth-card--community-active-member">
          <div className="pd-panel-title">Most Active Member</div>
          <div className="pd-growth-chart-inner pd-active-member-body">
            <div className="pd-active-member-avatar">
              <User size={26} />
            </div>
            <div className="pd-active-member-name">{STATIC_MOST_ACTIVE_MEMBER.name}</div>
            <div className="pd-active-member-meta">{STATIC_MOST_ACTIVE_MEMBER.events} events</div>
          </div>
        </div> */}

        {engagement && (
          <div className="pd-growth-card pd-growth-card--community-engagement">
            <div className="pd-panel-title">Community Engagement Rate</div>
            <div className="pd-growth-chart-inner pd-donut-card-body">
              <div className="pd-donut-hitbox pd-donut-hitbox-xl">
                <div
                  className="pd-donut pd-donut-xl"
                  style={{
                    background: `conic-gradient(var(--color-primary) 0% ${engagement.engagement_rate}%, var(--color-bg) ${engagement.engagement_rate}% 100%)`,
                  }}
                />
                <div className="pd-donut-center">
                  <span className="pd-donut-center-value">{engagement.engagement_rate}%</span>
                  <span className="pd-donut-center-label">engagement</span>
                </div>
              </div>
              <div className="pd-donut-legend">
                <div className="pd-donut-legend-item">
                  <span className="pd-donut-legend-dot" style={{ background: "var(--color-primary)" }} />
                  <span className="pd-donut-legend-name">Engaged</span>
                  <span className="pd-donut-legend-value">{engagement.engaged_members}</span>
                </div>
                <div className="pd-donut-legend-item">
                  <span className="pd-donut-legend-dot" style={{ background: "var(--color-bg)", border: "1px solid var(--color-border-subtle)" }} />
                  <span className="pd-donut-legend-name">Not engaged</span>
                  <span className="pd-donut-legend-value">{engagement.not_engaged_members}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {newMembers && (
          <div className="pd-growth-card pd-growth-card--community-new-members">
            <div className="pd-panel-title">New Members This Month</div>
            <div className="pd-growth-chart-inner pd-newmembers-body">
              <div className="pd-stat-spark-main">
                <div className="pd-kpi-value">{newMembers.count.toLocaleString()}</div>
                {newMembers.trend !== "flat" && (
                  <span className={`pd-growth-badge${newMembers.trend === "down" ? " pd-growth-badge--down" : ""}`}>
                    <NewMembersTrendIcon size={10} />
                    {Math.abs(newMembers.growth_percentage)}%
                  </span>
                )}
              </div>
              <div className="pd-stat-spark-chart">
                <svg width="117" height="68" viewBox="0 0 117 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2565_8137)">
                    <path d="M1.58203 2.61523L1.58203 41.1922C1.58203 42.6189 1.58203 56.2387 1.58203 62.3923C1.58203 64.0492 2.92301 65.3845 4.57987 65.3845C7.59933 65.3845 12.1061 65.3845 14.2307 65.3845H115.42M102.771 23.5383L71.1496 40.9742L45.8523 27.0255L20.555 50.9998" stroke="#DA7756" stroke-width="3.2" stroke-linecap="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2565_8137">
                      <rect width="117" height="68" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
