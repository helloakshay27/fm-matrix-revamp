import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { MessageCircle } from "lucide-react";
import {
  fetchCommunityKpis, fetchTopCommunities, fetchCommunityGrowthTrend, fetchCommunityBreakdown,
  type CommunityKpis, type TopCommunities, type CommunityGrowthTrend, type CommunityBreakdown,
  type PulseFilters,
} from "@/services/pulseDashboardApi";

const PALETTE = [
  "#DA7756", "#798C5E", "#6B9BCC", "#EDC488",
  "#CECBF6", "#9EC8BA", "#E7848E", "#AAB9C5",
];
const C = { green: "#798C5E", red: "#E49191", orange: "#EDC488" };

interface Props { filters: PulseFilters }

export function PulseCommunity({ filters }: Props) {
  const [kpi, setKpi] = useState<CommunityKpis | null>(null);
  const [top, setTop] = useState<TopCommunities | null>(null);
  const [trend, setTrend] = useState<CommunityGrowthTrend | null>(null);
  const [breakdown, setBreakdown] = useState<CommunityBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, [filters]);

  async function loadAll() {
    setLoading(true);
    try {
      const [k, t, g, b] = await Promise.all([
        fetchCommunityKpis(filters),
        fetchTopCommunities(filters),
        fetchCommunityGrowthTrend(filters),
        fetchCommunityBreakdown(filters),
      ]);
      setKpi(k); setTop(t); setTrend(g); setBreakdown(b);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (loading) {
    return <div className="pd-loader"><div className="pd-spinner" />Loading community…</div>;
  }

  const top3 = top?.top_communities.slice(0, 3) ?? [];

  // Transform trend data for recharts (needs array of { month, Community1: n, Community2: n, ... })
  const trendData = trend
    ? trend.months.map((month, mi) => {
        const row: Record<string, string | number> = { month };
        trend.communities.forEach((c) => { row[c.name] = c.data[mi] ?? 0; });
        return row;
      })
    : [];

  // Transform breakdown for stacked horizontal bar
  const breakdownData = breakdown
    ? breakdown.breakdown.map((b) => ({
        name: b.name,
        Approved: b.approved_count,
        Pending: b.pending_count,
        Rejected: b.rejected_count,
      }))
    : [];

  const hasData = !!(kpi || top3.length || trendData.length || breakdownData.length);

  return (
    <div>
      <div className="pd-section-header">
        <div className="pd-section-icon"><MessageCircle className="w-5 h-5" /></div>
        <div>
          <h2 className="pd-section-title">Community</h2>
          <div className="pd-section-subtitle">Community membership growth and engagement</div>
        </div>
      </div>

      {!hasData && (
        <div className="pd-empty">
          <MessageCircle className="pd-empty-icon" />
          No community data available for the selected filters.
        </div>
      )}

      {kpi && (
        <div className="pd-kpi-grid">
          {[
            { label: "Total Communities",    value: kpi.total_communities },
            { label: "Active Communities",   value: kpi.active_communities },
            { label: "Inactive Communities", value: kpi.inactive_communities },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card">
              <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              <div className="pd-kpi-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pd-charts-row">
        {top3.length > 0 && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Top 3 Communities</div>
            <div className="pd-ranked-list" style={{ paddingTop: 16 }}>
              {top3.map((c, i) => (
                <div key={c.community_id} className="pd-ranked-row">
                  <div className={`pd-ranked-pos pd-ranked-pos-${i + 1}`}>{i + 1}</div>
                  <div className="pd-ranked-name">{c.name}</div>
                  <div>
                    <span className="pd-ranked-count">{c.member_count.toLocaleString()}</span>
                    <span className="pd-ranked-count-lbl">members</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trendData.length > 0 && trend && (
          <div className="pd-chart-card">
            <div className="pd-chart-title">Member Growth Trend</div>
            <div className="pd-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  {trend.communities.map((c, i) => (
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
      </div>

      {breakdownData.length > 0 && (
        <div className="pd-chart-card" style={{ marginBottom: 20 }}>
          <div className="pd-chart-title">Community Member Status Breakdown</div>
          <div
            className="pd-chart-inner"
            style={{ height: Math.max(280, breakdownData.length * 30) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={breakdownData} margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="Approved" fill={C.green}  stackId="members" />
                <Bar dataKey="Pending"  fill={C.orange} stackId="members" />
                <Bar dataKey="Rejected" fill={C.red}    stackId="members" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
