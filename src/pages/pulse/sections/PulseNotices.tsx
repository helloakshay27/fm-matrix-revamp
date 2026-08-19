import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Bell } from "lucide-react";
import {
  fetchNoticeboardOverview,
  fetchNoticeboardBySite,
  fetchNoticeboardDetails,
  type NoticeboardOverview,
  type NoticeboardBySite,
  type NoticeboardDetailsResponse,
  type PulseFilters,
} from "@/services/pulseDashboardApi";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const C = {
  green: "#798C5E",
  red: "#E7848E",
  blue: "#6B9BCC",
  gray: "#D3D1C7",
  orange: "#EDC488",
  teal: "#9EC8BA",
};


// Builds a CSS conic-gradient string for a donut chart from value/color
// segments — the pure-CSS replacement for a recharts <Pie>.
function buildConicGradient(segments: { value: number; color: string }[]) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let acc = 0;
  const stops = segments.map((s) => {
    const start = (acc / total) * 100;
    acc += s.value;
    const end = (acc / total) * 100;
    return `${s.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

// Splits value segments into [{ ...segment, start, end }] percentages (0-100,
// matching conic-gradient's own 0%=top, clockwise convention) so a donut's
// hover hit-targets can be built as per-segment clip-path wedges.
function splitIntoSegmentRanges<T extends { value: number }>(segments: T[]) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let acc = 0;
  return segments.map((s) => {
    const start = (acc / total) * 100;
    acc += s.value;
    const end = (acc / total) * 100;
    return { ...s, start, end };
  });
}

// Builds a `clip-path: polygon(...)` pie-wedge from startPct/endPct (each
// 0-100 around the circle, 0 = top, clockwise) — the hit-target shape for
// one donut segment, since clip-path restricts both paint AND hover hit-testing.
function buildWedgeClipPath(startPct: number, endPct: number) {
  const angleToPoint = (pct: number) => {
    const theta = (pct / 100) * 2 * Math.PI;
    const x = 50 + 50 * Math.sin(theta);
    const y = 50 - 50 * Math.cos(theta);
    return `${x}% ${y}%`;
  };
  const steps = Math.max(2, Math.ceil(((endPct - startPct) / 100) * 36));
  const points = ["50% 50%"];
  for (let i = 0; i <= steps; i++) {
    points.push(angleToPoint(startPct + ((endPct - startPct) * i) / steps));
  }
  return `polygon(${points.join(", ")})`;
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  filters: PulseFilters;
}

export function PulseNotices({ filters }: Props) {
  const [noticeOverview, setNoticeOverview] = useState<NoticeboardOverview | null>(null);
  const [bySite, setBySite] = useState<NoticeboardBySite | null>(null);
  const [noticeFeed, setNoticeFeed] = useState<NoticeboardDetailsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const pulseEvents = usePulseEvents();


  // Fires once when the Notices tab is mounted (tab switch renders a fresh instance).
  useEffect(() => {
    pulseEvents.onNoticeListViewed();
  }, [pulseEvents]);

  useEffect(() => {
    setPage(1);
    loadAll(1);
  }, [filters]);

  useEffect(() => {
    if (!loading)
      fetchNoticeboardDetails(filters, page).then(setNoticeFeed).catch(console.error);
  }, [page]);

  async function loadAll(p: number) {
    setLoading(true);
    try {
      const [noR, nfR] = await Promise.allSettled([
        fetchNoticeboardOverview(filters),
        fetchNoticeboardDetails(filters, p),
      ]);
      if (noR.status === "fulfilled") setNoticeOverview(noR.value);
      else console.error("[PulseNotices] noticeboard_overview failed:", noR.reason);
      if (nfR.status === "fulfilled") setNoticeFeed(nfR.value);
      else console.error("[PulseNotices] noticeboard_details failed:", nfR.reason);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="pd-loader">
        <div className="pd-spinner" />
        Loading notices…
      </div>
    );
  }

  const startIdx = noticeFeed
    ? (noticeFeed.pagination.current_page - 1) * noticeFeed.pagination.per_page
    : 0;
  const hasData = !!(noticeOverview || (bySite && bySite.sites.length) || noticeFeed);

  // Real data for the Notice Status split bar.
  const statusSegments = noticeOverview
    ? [
      { name: "Active", value: noticeOverview.kpis.active_notices, color: C.blue },
      { name: "Inactive", value: noticeOverview.kpis.inactive_notices, color: C.red },
      { name: "Expired", value: noticeOverview.kpis.expired_notices, color: "color-mix(in srgb, var(--color-error) 70%, black)" },
    ]
    : [];
  const statusTotal = statusSegments.reduce((sum, s) => sum + s.value, 0) || 1;

  // Real data for Notices by Site (grouped bars: Total/Active/Expired).
  const siteRows = bySite?.sites ?? [];
  const siteChartData = siteRows.map((s) => ({
    name: s.site_name,
    Total: s.total,
    Active: s.active_count,
    Expired: s.expired_count,
  }));

  // Real daily points for the Weekly Active Broadcasts line chart.
  const broadcastDays = (noticeOverview?.weekly_active_broadcast.days ?? []).map((d) => ({
    label: new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    total: d.count,
  }));

  return (
    <div>
      {!hasData && (
        <div className="pd-empty">
          <Bell className="pd-empty-icon" />
          No notice data available for the selected filters.
        </div>
      )}

      {noticeOverview && (
        <div className="pd-kpi-grid">
          {[
            {
              label: "Total Notices",
              value: noticeOverview.kpis.total_notices,
              // Real count, not a fabricated period-over-period delta.
              badge: { text: `${noticeOverview.kpis.inactive_notices} Inactive`, variant: "neutral" as const },
            },
            { label: "Active", value: noticeOverview.kpis.active_notices, badge: { text: "On Air", variant: "success" as const } },
            { label: "Expired", value: noticeOverview.kpis.expired_notices, badge: { text: "Cleared", variant: "neutral" as const } },
            { label: "Important", value: noticeOverview.kpis.important_notices, badge: { text: "Critical", variant: "danger" as const } },
          ].map((item) => (
            <div key={item.label} className="pd-kpi-card pd-kpi-card--badged">
              <div className="pd-kpi-main">
                <div className="pd-kpi-label">{item.label}</div>
                <div className="pd-kpi-value">{item.value.toLocaleString()}</div>
              </div>
              <span className={`pd-kpi-badge pd-kpi-badge-${item.badge.variant}`}>
                {item.badge.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pd-growth-row">
        {/* <div className="pd-growth-card pd-growth-card--notice-source">
          <div className="pd-panel-title">Notice Source</div>
          <div className="pd-growth-chart-inner pd-donut-card-body">
            <div className="pd-donut-hitbox">
              <div
                className="pd-donut"
                style={{ background: buildConicGradient(noticeSourceSegments) }}
              />
              {splitIntoSegmentRanges(noticeSourceSegments).map((seg) => (
                <div
                  key={seg.name}
                  className="pd-donut-hit"
                  style={{ clipPath: buildWedgeClipPath(seg.start, seg.end) }}
                  data-tooltip={`${seg.name}: ${seg.value}`}
                />
              ))}
            </div>
            <div className="pd-donut-legend">
              {noticeSourceSegments.map((s) => (
                <div key={s.name} className="pd-donut-legend-item">
                  <span className="pd-donut-legend-dot" style={{ background: s.color }} />
                  <span className="pd-donut-legend-name">{s.name}</span>
                  <span className="pd-donut-legend-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {noticeOverview && (
          <div className="pd-growth-card pd-growth-card--notice-status">
            <div className="pd-panel-title">Notice Status</div>
            <div className="pd-growth-chart-inner pd-donut-card-body">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie
                    data={statusSegments}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={32}
                    outerRadius={50}
                    paddingAngle={2}
                  >
                    {statusSegments.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pd-donut-legend">
                {statusSegments.map((s) => (
                  <div key={s.name} className="pd-donut-legend-item">
                    <span className="pd-donut-legend-dot" style={{ background: s.color }} />
                    <span className="pd-donut-legend-name">{s.name}</span>
                    <span className="pd-donut-legend-value">
                      {s.value} ({Math.round((s.value / statusTotal) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {siteChartData.length > 0 && (
          <div className="pd-growth-card pd-growth-card--notices-by-site">
            <div className="pd-panel-title">Notices by Site</div>
            <div className="pd-growth-chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siteChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Total" fill={C.orange} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Active" fill={C.blue} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Expired" fill={C.red} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="pd-growth-card pd-growth-card--weekly-broadcasts">
          <div className="pd-panel-title">Weekly Active Broadcasts</div>
          <div className="pd-growth-chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={broadcastDays} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="#E5E5E5" strokeDasharray="1 2" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#8A8A8A" }}
                  tickLine={false}
                  axisLine={{ stroke: "#BDBDBD" }}
                />
                <YAxis hide />
                <Tooltip />
                <Legend align="left" wrapperStyle={{ fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke={C.teal}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {noticeFeed && (
        <div className="pd-tbl-card">
          <div className="pd-tbl-header">
            <span className="pd-tbl-title">Official Noticeboard feed</span>
          </div>
          <div className="pd-tbl-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th className="pd-num">#</th>
                  <th>Heading</th>
                  <th>Notice Text</th>
                  <th>Site</th>
                  <th>Created At</th>
                  <th>Important</th>
                </tr>
              </thead>
              <tbody>
                {noticeFeed.notices.map((n) => (
                  <tr key={n.id}>
                    <td className="pd-num">{n.serial}</td>
                    <td style={{ fontWeight: 500, maxWidth: 260 }}>
                      {n.notice_heading}
                    </td>
                    <td
                      style={{
                        maxWidth: 320,
                        color: "var(--color-text-light)",
                        fontSize: 12,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={n.notice_text}
                    >
                      {n.notice_text || "—"}
                    </td>
                    <td>{n.site_name}</td>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                      {fmtDate(n.created_at)}
                    </td>
                    <td>
                      {n.is_important ? (
                        <span className="pd-badge pd-badge-warn">
                          Important
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {noticeFeed.pagination.total_pages > 1 && (
            <div className="pd-pagination">
              <span>
                {startIdx + 1}–
                {Math.min(
                  startIdx + noticeFeed.pagination.per_page,
                  noticeFeed.pagination.total_count
                )}{" "}
                of {noticeFeed.pagination.total_count}
              </span>
              <div className="pd-pagination-btns">
                <button
                  className="pd-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹ Prev
                </button>
                <button className="pd-page-btn active">{page}</button>
                <button
                  className="pd-page-btn"
                  disabled={page >= noticeFeed.pagination.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
