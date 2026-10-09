import { useState, useEffect, useRef } from 'react';
import './PATMAnalyticsDashboard.css';
import {
  usePatmTrafficSession,
  usePatmUsageAndDistribution,
  usePatmAdoptionEngagement,
  usePatmAdoptionTrend,
  usePatmGrowth,
  usePatmRetention,
  usePatmModules,
  usePatmSubModules,
  usePatmWorkflowUsage,
  TREND_WEEKS,
  GROWTH_WEEKS,
  RETENTION_WEEKS,
} from './patmQueries';

/* Analytics metrics are sourced exclusively from API responses. */

/* ---------- formatting ---------- */
function fmtC(n: number): string {
  if (n >= 100000) return Math.round(n / 1000) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(Math.round(n));
}
function pct(x: number, d?: number): string {
  return x.toFixed(d == null ? 0 : d) + '%';
}
function fmtSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec < 10 ? '0' : ''}${sec}s` : `${sec}s`;
}
function fmtDelta(d: number | null | undefined): string | null {
  if (d == null) return null;
  return `${Math.abs(d).toFixed(1)}% vs prev. period`;
}
function deltaDir(
  d: number | null | undefined,
  goodUp = true,
): 'up' | 'dn' | 'flat' {
  if (d == null || Math.abs(d) < 0.1) return 'flat';
  const up = d > 0;
  return goodUp ? (up ? 'up' : 'dn') : up ? 'dn' : 'up';
}
function ymd(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}
function datesForRange(rangeDays: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (rangeDays - 1));
  return { from: ymd(from), to: ymd(to) };
}

/* ---------- KPI info dictionary ---------- */
const KPI_INFO: Record<string, { f: string; m: string }> = {
  'Active Users': {
    f: 'Unique team members (user_id) who fired at least one event during the selected period, across all connected organizations.',
    m: "Shows the reach of PATM among the team members with access — pulled directly from PostHog's person-level activity.",
  },
  'Screen Views': {
    f: 'Count of all View-typed events across the modules reported by the API.',
    m: 'Overall content consumption across the app.',
  },
  Sessions: {
    f: 'Count of distinct app sessions started in the period, from the first event of every session.',
    m: 'Usage volume across all team members.',
  },
  'Session Duration': {
    f: 'Total session time ÷ total sessions.',
    m: 'Engagement depth per visit — how long team members stay in PATM once they open it.',
  },
  'Bounce Rate': {
    f: '% of sessions with only a session-start event and dashboard_viewed, and no further interaction.',
    m: 'Immediate exits or a poor first impression of the home dashboard.',
  },
  'Recently Online': {
    f: 'Distinct team members with an event in the last 30 minutes.',
    m: 'A live pulse of who is actively working in PATM right now.',
  },
  'Seat Utilisation': {
    f: 'Active team members this period ÷ total licensed/onboarded team members across all organizations.',
    m: 'How much of the licensed team base is actually opening the app.',
  },
  Stickiness: {
    f: 'Average daily active users ÷ monthly active users (DAU/MAU) over the period.',
    m: 'Whether PATM use is a daily habit or an occasional check-in.',
  },
  'Adoption Trend': {
    f: '% change in weekly active users versus the prior 8-week average.',
    m: 'Whether adoption is accelerating or plateauing across organizations.',
  },
  '14-Day Activation': {
    f: '% of newly onboarded team members who fired an Action-typed event within 14 days of first login_success.',
    m: 'Whether new team members actually start creating and managing work, not just logging in.',
  },
  'Module Breadth': {
    f: 'Modules used at least once out of the total modules reported by the API.',
    m: 'How much of the platform a team has adopted.',
  },
  'Workflow Adoption': {
    f: "% of active users who fired the workflow's first event.",
    m: 'Shows how many team members attempt this process.',
  },
  'Completion Rate': {
    f: "% of users who reached the workflow's terminal event after starting it.",
    m: 'How effectively the workflow converts an attempt into a completed action.',
  },
  'Biggest Step Drop': {
    f: 'The single step in the funnel with the largest % of entrants lost.',
    m: 'Points to exactly where in the process team members are abandoning.',
  },
  'Usage Volume': {
    f: "Count of users who fired the workflow's terminal event this period.",
    m: 'Absolute volume of completed tasks, sprints, or documents.',
  },
};

/* ================================================================
   SVG CHART BUILDERS
   ================================================================ */

type ChartColors = {
  ink: string;
  faint: string;
  grid: string;
  line: string;
  blue: string;
  fill: string;
  mint: string;
  amber: string;
  red: string;
  violet: string;
  violetTint: string;
  green: string;
  greenTint: string;
};

function getColors(dark: boolean): ChartColors {
  return dark
    ? {
        ink: '#f2f0eb',
        faint: '#7b7871',
        grid: '#33302a',
        line: '#4a463d',
        blue: '#5f9df6',
        fill: '#22344b',
        mint: '#57c496',
        amber: '#dfa63e',
        red: '#e4735c',
        violet: '#9d90e8',
        violetTint: '#292440',
        green: '#4fc07f',
        greenTint: '#1a2c21',
      }
    : {
        ink: '#141413',
        faint: '#9b9990',
        grid: '#e6e4de',
        line: '#d9d6ce',
        blue: '#2c7be5',
        fill: '#d3e3f9',
        mint: '#3daf7d',
        amber: '#c98a12',
        red: '#b3402c',
        violet: '#7c6fd6',
        violetTint: '#e7e4f8',
        green: '#0f8a3d',
        greenTint: '#e2efe6',
      };
}

function escapeChartText(value: string | number): string {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]!,
  );
}

function chartTooltip(text: string): string {
  return `data-chart-tooltip="${escapeChartText(text)}" aria-label="${escapeChartText(text)}" tabindex="0"`;
}

function axisLabel(
  x: number,
  y: number,
  txt: string | number,
  anchor = 'middle',
  faint: string,
): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="11" fill="${faint}" font-family="Inter,-apple-system,sans-serif">${escapeChartText(txt)}</text>`;
}

function lineChart(
  cur: number[],
  prev: number[] | null,
  opts: {
    labels?: (string | number)[];
    previousLabels?: (string | number)[];
    color: string;
    fill: string;
    pctScale?: boolean;
    showPrev?: boolean;
    metric?: string;
  },
  C: ChartColors,
): string {
  const W = 680,
    H = 250,
    pl = opts.pctScale ? 54 : 44,
    pr = 14,
    pt = 16,
    pb = 30;
  const all = cur.concat(prev && opts.showPrev ? prev : []);
  const mn = opts.pctScale ? Math.max(0, Math.min(...all) - 0.6) : 0;
  const mx = opts.pctScale
    ? Math.min(100, Math.max(...all) + 0.6)
    : Math.max(...all) * 1.14 || 1;
  const span = mx - mn || 1;
  const n = cur.length;
  const xw = (W - pl - pr) / (n - 1 || 1);
  const X = (i: number) => pl + i * xw;
  const Y = (v: number) => pt + (H - pt - pb) * (1 - (v - mn) / span);
  const base = H - pb;
  const vfmt = opts.pctScale ? (v: number) => v.toFixed(1) + '%' : fmtC;
  function path(arr: number[]): string {
    let d = '';
    for (let i = 0; i < arr.length; i++) {
      d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(arr[i]).toFixed(1) + ' ';
    }
    return d;
  }
  const step = Math.max(1, Math.ceil(n / 6));
  let grid = '',
    xlab = '';
  for (let i = 0; i < n; i += step) {
    grid += `<line x1="${X(i).toFixed(1)}" y1="${pt}" x2="${X(i).toFixed(1)}" y2="${base}" stroke="${C.grid}" stroke-dasharray="2 4"/>`;
    xlab += axisLabel(
      X(i),
      H - 9,
      opts.labels ? opts.labels[i] : i + 1,
      'middle',
      C.faint,
    );
  }
  let ylab = '';
  for (let g = 0; g <= 2; g++) {
    const y = pt + ((H - pt - pb) * g) / 2,
      val = mn + span * (1 - g / 2);
    ylab += axisLabel(pl - 11, y + 4, vfmt(val), 'end', C.faint);
  }
  let areaD = '';
  for (let i = 0; i < n; i++) {
    areaD +=
      (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(cur[i]).toFixed(1) + ' ';
  }
  areaD += `L${X(n - 1).toFixed(1)} ${base} L${X(0).toFixed(1)} ${base} Z`;
  const prevPath =
    prev && opts.showPrev
      ? `<path d="${path(prev)}" fill="none" stroke="${C.line}" stroke-width="1.8" stroke-dasharray="4 4"/>`
      : '';
  const points = cur
    .map((value, i) => {
      const text = `${opts.labels?.[i] ?? i + 1}\n${opts.metric ?? 'Users'}: ${value.toLocaleString()}${opts.pctScale ? '%' : ''}`;
      return `<circle cx="${X(i)}" cy="${Y(value)}" r="9" fill="transparent" ${chartTooltip(text)}/>`;
    })
    .join('');
  const previousPoints =
    prev && opts.showPrev
      ? prev
          .map(
            (value, i) =>
              `<circle cx="${X(i)}" cy="${Y(value)}" r="9" fill="transparent" ${chartTooltip(`Previous period · ${opts.previousLabels?.[i] ?? i + 1}\n${opts.metric ?? 'Users'}: ${value.toLocaleString()}${opts.pctScale ? '%' : ''}`)}/>`,
          )
          .join('')
      : '';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
    ${grid}${ylab}${xlab}
    <line x1="${pl}" y1="${base}" x2="${W - pr}" y2="${base}" stroke="${C.grid}"/>
    <path d="${areaD}" fill="${opts.fill}"/>
    ${prevPath}
    <path d="${path(cur)}" fill="none" stroke="${opts.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${X(n - 1).toFixed(1)}" cy="${Y(cur[n - 1]).toFixed(1)}" r="3" fill="${opts.color}"/>
    ${previousPoints}${points}
  </svg>`;
}

function stackedBarChart(
  labels: string[],
  series: { label: string; data: number[]; color: string }[],
  negSeries: { label: string; data: number[]; color: string } | null,
  C: ChartColors,
): string {
  const W = 600,
    H = 260,
    pl = 40,
    pr = 12,
    pt = 14,
    pb = 26;
  const n = labels.length;
  const maxUp = Math.max(
    ...labels.map((_, i) => series.reduce((a, s) => a + s.data[i], 0)),
  );
  const maxDn = negSeries ? Math.max(...negSeries.data) : 0;
  const gap = (W - pl - pr) / n,
    bw = gap * 0.52;
  const zero = pt + (H - pt - pb) * (maxUp / (maxUp + maxDn || 1));
  const scaleUp = (zero - pt) / (maxUp || 1),
    scaleDn = (H - pb - zero) / (maxDn || 1);
  let bars = '',
    xlab = '';
  let hoverRegions = '';
  labels.forEach((lab, i) => {
    const x = pl + i * gap + (gap - bw) / 2;
    let y = zero;
    series.forEach((s) => {
      const h = s.data[i] * scaleUp;
      y -= h;
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" fill="${s.color}"/>`;
    });
    if (negSeries) {
      const hd = negSeries.data[i] * scaleDn;
      bars += `<rect x="${x.toFixed(1)}" y="${zero.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, hd).toFixed(1)}" fill="${negSeries.color}"/>`;
    }
    xlab += axisLabel(x + bw / 2, H - 8, lab, 'middle', C.faint);
    const tooltip = [
      lab,
      ...series.map((s) => `${s.label}: ${s.data[i].toLocaleString()}`),
      ...(negSeries
        ? [`${negSeries.label}: ${negSeries.data[i].toLocaleString()}`]
        : []),
    ].join('\n');
    hoverRegions += `<rect x="${pl + i * gap}" y="${pt}" width="${gap}" height="${H - pt - pb}" fill="transparent" ${chartTooltip(tooltip)}/>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${bars}${xlab}
    <line x1="${pl}" y1="${zero.toFixed(1)}" x2="${W - pr}" y2="${zero.toFixed(1)}" stroke="${C.line}"/>
    ${hoverRegions}
  </svg>`;
}

/* ================================================================
   SUBCOMPONENTS
   ================================================================ */

/* -------- Info popover -------- */
function InfoWrap({ label }: { label: string }) {
  const info = KPI_INFO[label] || {
    f: 'Definition not yet finalized.',
    m: 'Business meaning to be confirmed.',
  };
  return (
    <span className="info-wrap">
      <button className="info-btn">i</button>
      <div className="info-pop">
        <b>Formula</b>
        {info.f}
        <div className="sep">
          <b>Business meaning</b>
          {info.m}
        </div>
      </div>
    </span>
  );
}

/* -------- KPI Tile -------- */
interface TileProps {
  id?: string;
  label: string;
  val: string;
  dir?: 'up' | 'dn' | 'flat';
  delta?: string | null;
  sub?: string;
  raw?: number;
  unit?: string;
  goodUp?: boolean;
  noTarget?: boolean;
}

function Tile({
  id,
  label,
  val,
  dir = 'flat',
  delta,
  sub,
  raw,
  unit,
  goodUp = true,
  noTarget,
}: TileProps) {
  const [bmVal, setBmVal] = useState<string>('');
  const t = bmVal === '' ? null : parseFloat(bmVal);
  const met =
    raw == null || t == null || isNaN(t)
      ? null
      : goodUp
        ? (raw ?? 0) >= t
        : (raw ?? 0) <= t;
  const arrowSym = dir === 'up' ? '▲' : dir === 'dn' ? '▼' : '—';
  return (
    <div className="tile">
      <div className="tophead">
        <div className="lbl">{label}</div>
        <InfoWrap label={label} />
      </div>
      <div className="val">{val}</div>
      {delta != null && (
        <div className={`delta ${dir}`}>
          {arrowSym} {delta}
        </div>
      )}
      {sub && <div className="sub2">{sub}</div>}
      {!noTarget && id && (
        <div className="bm">
          <span className="bl">Target</span>
          <input
            className="bmin"
            type="text"
            inputMode="decimal"
            value={bmVal}
            placeholder="—"
            onChange={(e) => setBmVal(e.target.value)}
            title="Set your own target for this KPI"
          />
          {unit && <span className="bu">{unit}</span>}
          {met === null ? (
            <span className="bb unset">set a target</span>
          ) : met ? (
            <span className="bb met">✓ on target</span>
          ) : (
            <span className="bb miss">✕ off target</span>
          )}
        </div>
      )}
    </div>
  );
}

/* -------- Card shell -------- */
function ChartCard({
  eyebrow,
  title,
  purpose,
  children,
  showInsight,
}: {
  eyebrow: string;
  title: string;
  purpose: string;
  children: React.ReactNode;
  showInsight?: boolean;
}) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  function showTooltip(target: EventTarget, x?: number, y?: number) {
    const element =
      target instanceof Element ? target.closest('[data-chart-tooltip]') : null;
    const text = element?.getAttribute('data-chart-tooltip');
    if (!element || !text) {
      setTooltip(null);
      return;
    }
    const rect = element.getBoundingClientRect();
    setTooltip({
      text,
      x: Math.max(8, Math.min((x ?? rect.left) + 12, window.innerWidth - 260)),
      y: Math.max(8, Math.min((y ?? rect.top) + 12, window.innerHeight - 180)),
    });
  }
  return (
    <div
      className="card"
      onPointerMove={(event) =>
        showTooltip(event.target, event.clientX, event.clientY)
      }
      onPointerLeave={() => setTooltip(null)}
      onFocus={(event) => showTooltip(event.target)}
      onBlur={() => setTooltip(null)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setTooltip(null);
      }}
    >
      <div className="card-head">
        <div className="charthead">
          <div>
            <div className="cr">{eyebrow}</div>
            <div className="ct">{title}</div>
          </div>
          <div className="card-head-actions">
            {showInsight && (
              <button className="insight-btn">
                <span className="insight-plus">+</span> Insight
              </button>
            )}
            <span className="info-wrap">
              <button className="info-btn">i</button>
              <div className="info-pop">
                <b>Purpose</b>
                {purpose}
              </div>
            </span>
          </div>
        </div>
      </div>
      <div className="card-body">{children}</div>
      {tooltip && (
        <div
          className="chart-tooltip"
          role="tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

type QueryStatus = { isPending: boolean; isError: boolean };
function DataState({
  query,
  empty = false,
}: {
  query: QueryStatus;
  empty?: boolean;
}) {
  if (query.isError)
    return (
      <p className="sd" role="alert">
        Unable to load analytics. Please try again.
      </p>
    );
  if (query.isPending)
    return (
      <p className="sd" role="status">
        Loading analytics...
      </p>
    );
  return empty ? (
    <p className="sd">No data available for the selected filters.</p>
  ) : null;
}
function numberText(value: number | null | undefined) {
  return value == null || !Number.isFinite(value)
    ? '\u2014'
    : Math.round(value).toLocaleString();
}
function percentText(value: number | null | undefined, decimals = 0) {
  return value == null || !Number.isFinite(value)
    ? '\u2014'
    : pct(value, decimals);
}
function Metric({
  label,
  value,
  delta,
  percent = false,
  seconds = false,
  sub,
}: {
  label: string;
  value?: number | null;
  delta?: number | null;
  percent?: boolean;
  seconds?: boolean;
  sub?: string;
}) {
  return (
    <Tile
      label={label}
      val={
        value == null
          ? '\u2014'
          : percent
            ? percentText(value)
            : seconds
              ? fmtSeconds(value)
              : numberText(value)
      }
      dir={deltaDir(delta)}
      delta={fmtDelta(delta)}
      sub={sub}
      noTarget
    />
  );
}
function TrafficPage({
  dev,
  showPrev,
  dark,
  from,
  to,
  appId,
}: {
  dev: string;
  showPrev: boolean;
  range: number;
  dark: boolean;
  from: string;
  to: string;
  appId?: string;
}) {
  const C = getColors(dark);
  const [usageTab, setUsageTab] = useState<'visitors' | 'views' | 'sessions'>(
    'visitors',
  );
  const trafficQ = usePatmTrafficSession({ from, to, appId, device: dev });
  const usageQ = usePatmUsageAndDistribution({ from, to, appId, device: dev });
  const t = trafficQ.data?.tiles;
  const delta = trafficQ.data?.delta_pct;
  const current = usageQ.data?.usage_over_time?.current ?? [];
  const previous = usageQ.data?.usage_over_time?.previous ?? [];
  const apiDevices = usageQ.data?.device_split?.devices ?? [];
  const platforms =
    dev === 'mobile'
      ? ['Mobile']
      : dev === 'desktop'
        ? ['Desktop']
        : ['Desktop', 'Mobile'];
  const devices = platforms.map((platform) => {
    const entry = apiDevices.find(
      (device) => device.device.toLowerCase() === platform.toLowerCase(),
    );
    return {
      device: platform,
      users: entry?.users ?? 0,
      sessions: entry?.sessions ?? 0,
      session_share: entry?.session_share ?? 0,
    };
  });
  return (
    <>
      <div className="section-head">
        <h2>Traffic &amp; Session</h2>
        <span className="sd">Application traffic and session behavior.</span>
      </div>
      <DataState query={trafficQ} />
      <div className="tiles cols-3">
        <Metric
          label="Active Users"
          value={t?.active_users}
          delta={delta?.active_users}
        />
        <Metric
          label="Screen Views"
          value={t?.screen_views}
          delta={delta?.screen_views}
        />
        <Metric label="Sessions" value={t?.sessions} delta={delta?.sessions} />
        <Metric
          label="Session Duration"
          value={t?.avg_session_seconds}
          delta={delta?.avg_session_seconds}
          seconds
        />
        <Metric
          label="Bounce Rate"
          value={t?.bounce_rate}
          delta={delta?.bounce_rate}
          percent
        />
        <Metric
          label="Recently Online"
          value={t?.recently_online}
          sub="active in last 30 min"
        />
      </div>
      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time"
          title="Usage over time"
          purpose="Daily usage from the selected period, with the previous period for comparison."
        >
          <div className="charttabs">
            {(['visitors', 'views', 'sessions'] as const).map((tab) => (
              <button
                key={tab}
                className={usageTab === tab ? 'on' : ''}
                onClick={() => setUsageTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <DataState query={usageQ} empty={!current.length} />
          {current.length > 0 && (
            <div
              dangerouslySetInnerHTML={{
                __html: lineChart(
                  current.map((row) => row[usageTab]),
                  showPrev && previous.length
                    ? previous.map((row) => row[usageTab])
                    : null,
                  {
                    labels: current.map((row) => row.day),
                    previousLabels: previous.map((row) => row.day),
                    metric: usageTab,
                    color: C.blue,
                    fill: C.fill,
                    showPrev: showPrev && previous.length > 0,
                  },
                  C,
                ),
              }}
            />
          )}
          {current.length > 0 && (
            <div className="legend">
              <span>
                <i style={{ background: C.blue }} />
                Current period
              </span>
              {showPrev && previous.length > 0 && (
                <span>
                  <i className="dash" />
                  Previous period
                </span>
              )}
            </div>
          )}
        </ChartCard>
        <ChartCard
          eyebrow="U7 · Device / platform split"
          title="Web vs mobile usage"
          purpose="Share of sessions by device_type, with distinct users per device."
        >
          <p className="sd device-split-description">
            Share of sessions by device_type, with distinct users per device.
          </p>
          <DataState query={usageQ} />
          <div className="hbars">
            {devices.map((device) => (
              <div
                className="role"
                key={device.device}
                tabIndex={0}
                data-chart-tooltip={`${device.device}\nUsers: ${numberText(device.users)}\nSessions: ${numberText(device.sessions)}\nSession share: ${percentText(device.session_share)}`}
              >
                <div className="rn">{device.device}</div>
                <div className="rbar">
                  <i
                    style={{
                      width:
                        Math.max(0, Math.min(100, device.session_share)) + '%',
                      background: device.device === 'Mobile' ? C.mint : C.blue,
                    }}
                  />
                </div>
                <div className="rv">{percentText(device.session_share)}</div>
              </div>
            ))}
          </div>
          <div className="kv device-split-metrics">
            <div>
              <div className="k">U8 · Recently online</div>
              <div className="v">{numberText(t?.recently_online ?? 0)}</div>
              <div className="u">active in last 30 min</div>
            </div>
            <div>
              <div className="k">U4 · Views / session</div>
              <div className="v">
                {(usageQ.data?.views_per_session ?? 0).toFixed(1)}
              </div>
              <div className="u">screens per visit</div>
            </div>
          </div>
        </ChartCard>
      </div>
    </>
  );
}
function AdoptionPage({
  dev,
  dark,
  from,
  to,
  appId,
}: {
  dev: string;
  dark: boolean;
  from: string;
  to: string;
  appId?: string;
}) {
  const C = getColors(dark);
  const filters = { from, to, appId, device: dev };
  const engagementQ = usePatmAdoptionEngagement(filters);
  const trendQ = usePatmAdoptionTrend({
    to,
    weeks: TREND_WEEKS,
    appId,
    device: dev,
  });
  const growthQ = usePatmGrowth({
    to,
    weeks: GROWTH_WEEKS,
    appId,
    device: dev,
  });
  const retentionQ = usePatmRetention({
    to,
    weeks: RETENTION_WEEKS,
    appId,
    device: dev,
  });
  const modulesQ = usePatmModules(filters);
  const trafficQ = usePatmTrafficSession(filters);
  const eng = engagementQ.data;
  const trend = trendQ.data?.weekly?.current ?? [];
  const growth = growthQ.data?.weeks ?? [];
  const cohorts = retentionQ.data?.cohorts ?? [];
  const modules = modulesQ.data?.tree ?? [];
  const activeUsers = trafficQ.data?.tiles?.active_users;
  const weeks = [
    ...new Set(
      cohorts.flatMap((row) =>
        Object.keys(row).filter((key) => /^week\d+$/.test(key)),
      ),
    ),
  ].sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));
  return (
    <>
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">Module adoption, growth and retention.</span>
      </div>
      <DataState query={engagementQ} />
      <div className="tiles cols-3">
        <Metric
          label="Seat Utilisation"
          value={eng?.seat_utilisation?.value}
          delta={eng?.seat_utilisation?.delta_pct}
          percent
          sub={
            eng?.seat_utilisation?.licensed_seats == null
              ? 'Licensed seat count is required'
              : 'active / licensed team members'
          }
        />
        <Metric
          label="Stickiness"
          value={
            eng?.stickiness?.value == null
              ? undefined
              : eng.stickiness.value * 100
          }
          delta={eng?.stickiness?.delta_pct}
          percent
        />
        <Metric
          label="Adoption Trend"
          value={eng?.adoption_trend?.value}
          percent
        />
        <Metric
          label="14-Day Activation"
          value={eng?.activation?.value}
          delta={eng?.activation?.delta_pct}
          percent
        />
        <Tile
          label="Module Breadth"
          val={
            eng?.module_breadth?.in_use == null ||
            eng?.module_breadth?.total == null
              ? '\u2014'
              : eng.module_breadth.in_use + ' / ' + eng.module_breadth.total
          }
          noTarget
        />
        <Metric
          label="Dormant Users"
          value={eng?.dormant_users?.value}
          sub={eng?.dormant_users?.band}
        />
      </div>
      <ChartCard
        eyebrow="Trend · SVG line chart"
        title={`Adoption trend (weekly active users, last ${trend.length || TREND_WEEKS} weeks)`}
        purpose="Weekly active users reported by the API."
      >
        <DataState query={trendQ} empty={!trend.length} />
        {trend.length > 0 && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: lineChart(
                  trend.map((row) => row.wau),
                  null,
                  {
                    labels: trend.map((_, i) => `W${i + 1}`),
                    metric: 'Weekly active users',
                    color: C.blue,
                    fill: C.fill,
                  },
                  C,
                ),
              }}
            />
            <div className="legend">
              <span>
                <i style={{ background: C.blue }} />
                Weekly active users
              </span>
            </div>
          </>
        )}
      </ChartCard>
      <div className="grid2">
        <ChartCard
          eyebrow="Growth accounting"
          title="New / Returning / Resurrecting / Dormant"
          purpose="Weekly growth categories reported by the API."
        >
          <DataState query={growthQ} empty={!growth.length} />
          {growth.length > 0 && (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: stackedBarChart(
                    growth.map((row) => row.week),
                    [
                      {
                        label: 'New',
                        data: growth.map((row) => row.new),
                        color: C.blue,
                      },
                      {
                        label: 'Returning',
                        data: growth.map((row) => row.returning),
                        color: C.green,
                      },
                      {
                        label: 'Resurrecting',
                        data: growth.map((row) => row.resurrected),
                        color: C.mint,
                      },
                    ],
                    {
                      label: 'Dormant',
                      data: growth.map((row) => row.dormant),
                      color: C.red,
                    },
                    C,
                  ),
                }}
              />
              <div className="legend">
                {[
                  ['New', C.blue],
                  ['Returning', C.green],
                  ['Resurrecting', C.mint],
                  ['Dormant', C.red],
                ].map(([label, color]) => (
                  <span key={label}>
                    <i style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}
        </ChartCard>
        <ChartCard
          eyebrow="Retention"
          title="Do new team members keep coming back?"
          purpose="Weekly retention for API cohorts."
        >
          <DataState query={retentionQ} empty={!cohorts.length} />
          {cohorts.length > 0 && (
            <div className="tbl-wrap">
              <table className="rt">
                <thead>
                  <tr>
                    <th>Cohort</th>
                    <th>Users</th>
                    {weeks.map((week) => (
                      <th key={week}>Week {week.slice(4)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((row) => (
                    <tr key={row.cohort_week}>
                      <td className="lbl">{row.cohort_week}</td>
                      <td>{numberText(row.size)}</td>
                      {weeks.map((week) => {
                        const value =
                          typeof row[week] === 'number'
                            ? (row[week] as number)
                            : null;
                        return (
                          <td
                            key={week}
                            tabIndex={0}
                            data-chart-tooltip={`${row.cohort_week} / Week ${week.slice(4)}\nCohort size: ${numberText(row.size)}\nRetention: ${percentText(value)}`}
                            style={
                              value == null
                                ? undefined
                                : {
                                    background:
                                      'rgba(44,123,229,' +
                                      (0.09 +
                                        (Math.max(0, Math.min(100, value)) /
                                          100) *
                                          0.78) +
                                      ')',
                                  }
                            }
                          >
                            {percentText(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>
      </div>
      <ChartCard
        eyebrow="Module adoption"
        title="Which modules get used most?"
        purpose="Module users divided by active users for the same tenant and filters."
      >
        <DataState query={modulesQ} empty={!modules.length} />
        <DataState query={trafficQ} />
        <div className="hbars">
          {modules.map((module) => {
            const share =
              activeUsers != null && activeUsers > 0
                ? (module.users / activeUsers) * 100
                : null;
            return (
              <div
                className="role"
                key={module.name}
                tabIndex={0}
                data-chart-tooltip={`${module.name}\nUsers: ${numberText(module.users)}\nEvents: ${numberText(module.events)}\nSessions: ${numberText(module.sessions)}\nAdoption: ${percentText(share)}`}
              >
                <div className="rn">{module.name}</div>
                <div className="rbar">
                  <i
                    style={{
                      width: (share == null ? 0 : Math.min(100, share)) + '%',
                      background: C.blue,
                    }}
                  />
                </div>
                <div className="rv">{percentText(share)}</div>
              </div>
            );
          })}
        </div>
      </ChartCard>
      <ChartCard
        eyebrow="Module breakdown"
        title="Module-wise breakdown"
        purpose="Users, events, sessions and adoption rate per module for the selected period and filters."
      >
        <DataState query={modulesQ} empty={!modules.length} />
        <DataState query={trafficQ} />
        {modules.length > 0 && (
          <div className="tbl-wrap">
            <table className="pathtbl module-breakdown-tbl">
              <thead>
                <tr>
                  <th>Module</th>
                  <th className="num">Users</th>
                  <th className="num">Events</th>
                  <th className="num">Sessions</th>
                  <th className="num">Adoption</th>
                  <th className="module-bar-col"></th>
                </tr>
              </thead>
              <tbody>
                {modules
                  .slice()
                  .sort((a, b) => b.users - a.users)
                  .map((module) => {
                    const share =
                      activeUsers != null && activeUsers > 0
                        ? Math.min(100, (module.users / activeUsers) * 100)
                        : null;
                    return (
                      <tr
                        key={module.name}
                        tabIndex={0}
                        data-chart-tooltip={`${module.name}\nUsers: ${numberText(module.users)}\nEvents: ${numberText(module.events)}\nSessions: ${numberText(module.sessions)}\nAdoption: ${percentText(share)}`}
                      >
                        <td className="strong">{module.name}</td>
                        <td className="num">{numberText(module.users)}</td>
                        <td className="num">{numberText(module.events)}</td>
                        <td className="num">{numberText(module.sessions)}</td>
                        <td className="num">{percentText(share)}</td>
                        <td className="module-bar-col">
                          <div className="module-minibar">
                            <i
                              style={{
                                width: (share ?? 0) + '%',
                                background: C.blue,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </>
  );
}
function WorkflowPage({
  dev,
  dark,
  from,
  to,
  appId,
}: {
  dev: string;
  dark: boolean;
  from: string;
  to: string;
  appId?: string;
}) {
  const C = getColors(dark);
  const filters = { from, to, appId, device: dev };
  const modulesQ = usePatmModules(filters);
  const modules = modulesQ.data?.tree ?? [];
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSubModule, setSelectedSubModule] = useState('');
  const [subModuleCounts, setSubModuleCounts] = useState<Record<string, number>>({});
  const module = modules.some((row) => row.name === selectedModule)
    ? selectedModule
    : modules[0]?.name;
  const subModulesQ = usePatmSubModules({
    ...filters,
    module,
    enabled: modulesQ.isSuccess && !!module,
  });
  const subModules = subModulesQ.data?.tree ?? [];
  const subModule = subModules.some((row) => row.name === selectedSubModule)
    ? selectedSubModule
    : subModules[0]?.name;

  useEffect(() => {
    if (subModulesQ.isSuccess && module && subModules.length > 0) {
      setSubModuleCounts((prev) => ({ ...prev, [module]: subModules.length }));
    }
  }, [subModulesQ.isSuccess, module, subModules.length]);
  const workflowQ = usePatmWorkflowUsage({
    ...filters,
    module,
    subModule,
    enabled: !!module && subModulesQ.isSuccess,
  });
  const kpis = workflowQ.data?.kpis;
  const funnel = workflowQ.data?.funnel ?? [];
  const screens = workflowQ.data?.flows ?? [];
  const entries = workflowQ.data?.entry_screens ?? [];
  const name = [module, subModule].filter(Boolean).join(' / ');
  return (
    <>
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">Module workflows, completion and navigation.</span>
      </div>
      <div className="mnav">
        <DataState query={modulesQ} empty={!modules.length} />
        <div className="mnav-buckets">
          {modules.map((row) => {
            const count = row.name === module && subModulesQ.isSuccess
              ? subModules.length
              : subModuleCounts[row.name];
            return (
              <button
                key={row.name}
                className={row.name === module ? 'on' : ''}
                aria-pressed={row.name === module}
                onClick={() => {
                  setSelectedModule(row.name);
                  setSelectedSubModule('');
                }}
              >
                {row.name}
                {count != null && (
                  <span className="mcount">{count}</span>
                )}
              </button>
            );
          })}
        </div>
        {module && (
          <div className="mnav-mods">
            <DataState query={subModulesQ} empty={!subModules.length} />
            <div className="chip-bar">
              {subModules.map((row) => (
                <button
                  key={row.name}
                  className={`chip${row.name === subModule ? ' on' : ''}`}
                  aria-pressed={row.name === subModule}
                  onClick={() => setSelectedSubModule(row.name)}
                >
                  {row.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {module && subModulesQ.isSuccess && (
        <>
          <DataState query={workflowQ} />
          <div className="tiles cols-4">
            <Metric
              label="Workflow Adoption"
              value={kpis?.f_adopt?.value}
              delta={kpis?.f_adopt?.delta_pct}
              percent
            />
            <Metric
              label="Completion Rate"
              value={kpis?.f_comp?.value}
              delta={kpis?.f_comp?.delta_pct}
              percent
            />
            <Metric
              label="Biggest Step Drop"
              value={kpis?.f_step?.value}
              delta={kpis?.f_step?.delta_pct}
              percent
              sub={funnel.find((row) => row.biggest)?.step}
            />
            <Metric
              label="Usage Volume"
              value={kpis?.f_vol?.value}
              delta={kpis?.f_vol?.delta_pct}
            />
          </div>
          <ChartCard
            eyebrow="Workflow funnel"
            title={name + ' - completion funnel'}
            purpose="API funnel steps and drop-off rates."
          >
            <DataState query={workflowQ} empty={!funnel.length} />
            <div className="funnel">
              {funnel.map((row, i) => (
                <div
                  key={row.step + i}
                  tabIndex={0}
                  data-chart-tooltip={`${row.step}\nReach: ${percentText(row.reach)}\nDrop-off: ${percentText(row.drop_pct)}`}
                >
                  {row.drop_pct != null && (
                    <div className="fdrop">
                      &#9660; {percentText(row.drop_pct)} drop-off
                    </div>
                  )}
                  <div
                    className="fstep"
                    style={{
                      width: Math.max(0, Math.min(100, row.reach)) + '%',
                      background: C.blue,
                      borderRadius: 8,
                    }}
                  >
                    {row.step}
                    <span className="fsub">
                      {percentText(row.reach)} of entrants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard
            eyebrow="Module screens"
            title={'All screens in ' + name}
            purpose="Screen metrics reported by the API."
          >
            <div className="tbl-wrap">
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th className="num">Users</th>
                    <th className="num">Events</th>
                    <th className="num">Sessions</th>
                    <th className="num">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {!screens.length && (
                    <tr>
                      <td colSpan={5}>
                        <DataState query={workflowQ} empty />
                      </td>
                    </tr>
                  )}
                  {screens.map((row) => (
                    <tr key={row.path}>
                      <td>{row.path}</td>
                      <td className="num">{numberText(row.users)}</td>
                      <td className="num">{numberText(row.events)}</td>
                      <td className="num">{numberText(row.sessions)}</td>
                      <td className="num">{percentText(row.f_comp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
          <ChartCard
            eyebrow="Entry screens"
            title="Top entry screens"
            purpose="First screens reached in sessions, as reported by the API."
          >
            <div className="tbl-wrap">
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th className="num">Visitors</th>
                    <th className="num">Views</th>
                    <th className="num">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {!entries.length && (
                    <tr>
                      <td colSpan={4}>
                        <DataState query={workflowQ} empty />
                      </td>
                    </tr>
                  )}
                  {entries.map((row) => (
                    <tr key={row.path}>
                      <td>{row.path}</td>
                      <td className="num">{numberText(row.visitors)}</td>
                      <td className="num">{numberText(row.views)}</td>
                      <td className="num">{percentText(row.bounce)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      )}
    </>
  );
}

/* ================================================================
   MAIN DASHBOARD
   ================================================================ */
type Page = 'pgTraffic' | 'pgAdopt' | 'pgFlows';
type DevMode = 'all' | 'desktop' | 'mobile';
type RangePreset = 7 | 30 | 90;

export default function PATMAnalyticsDashboard() {
  const [page, setPage] = useState<Page>('pgTraffic');
  const [dev, setDev] = useState<DevMode>('all');
  const [showPrev, setShowPrev] = useState(true);
  const [range, setRange] = useState<number>(30);
  const [rangeLabel, setRangeLabel] = useState('Last 30 days');
  const [dateFrom, setDateFrom] = useState(() => datesForRange(30).from);
  const [dateTo, setDateTo] = useState(() => datesForRange(30).to);
  const [dateOpen, setDateOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  const { from: apiFrom, to: apiTo } = isCustomRange
    ? { from: dateFrom, to: dateTo }
    : datesForRange(range);

  /* persist theme */
  useEffect(() => {
    const saved = localStorage.getItem('patm-analytics-theme');
    if (saved === 'dark') setDark(true);
  }, []);

  /* close date picker on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node))
        setDateOpen(false);
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  function toggleTheme() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem('patm-analytics-theme', next ? 'dark' : 'light');
      return next;
    });
  }

  function handlePreset(days: RangePreset) {
    const labels: Record<number, string> = {
      7: 'Last 7 days',
      30: 'Last 30 days',
      90: 'Last 90 days',
    };
    setRange(days);
    setRangeLabel(labels[days]);
    setIsCustomRange(false);
    setDateOpen(false);
  }

  function handleApplyCustom() {
    if (!dateFrom || !dateTo || dateFrom > dateTo) return;
    const days = Math.max(
      1,
      Math.round(
        (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000,
      ) + 1,
    );
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    setRange(days);
    setRangeLabel(`${fmt(dateFrom)} – ${fmt(dateTo)}`);
    setIsCustomRange(true);
    setDateOpen(false);
  }

  const PAGE_TITLES: Record<Page, string> = {
    pgTraffic: 'Traffic & Session',
    pgAdopt: 'Adoption & Engagement',
    pgFlows: 'Workflow Usage',
  };

  const onlineQ = usePatmTrafficSession({
    from: apiFrom,
    to: apiTo,
    device: dev,
  });
  const recentlyOnline = onlineQ.data?.tiles?.recently_online;

  return (
    <div className="patm-analytics" data-theme={dark ? 'dark' : 'light'}>
      {/* TOP BAR */}
      <header className="topbar">
        <button
          className="iconbtn"
          onClick={() => setNavCollapsed((c) => !c)}
          aria-label="Toggle navigation"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
            <line x1="8" y1="3.5" x2="8" y2="16.5" />
          </svg>
        </button>
        <button className="topbar-back" aria-label="Back">
          &#8592;
        </button>
        <span className="topbar-title">PATM Analytics</span>
        <div className="topbar-spacer"></div>
        <span className="topbar-rule"></span>
        <button
          className="iconbtn"
          onClick={toggleTheme}
          title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {dark ? (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="10" cy="10" r="3.6" />
              <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
            </svg>
          )}
        </button>
        <span className="badge-sample">PATM &middot; PTM-01</span>
      </header>

      <div className={`shell${navCollapsed ? ' nav-collapsed' : ''}`}>
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h1 className="brandmark">PATM</h1>
          <p className="brandmark-sub">Project &amp; Task Management App</p>
          <nav>
            <div className="nav-group">
              <div className="nav-label">Layers</div>
              {(
                [
                  {
                    id: 'pgTraffic',
                    tip: 'Traffic & Session',
                    icon: (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.4 12.6 6.6 7.4l3.4 3.1 4.1-5.4 3.5 4.3" />
                        <path d="M2.4 16.4h15.2" />
                      </svg>
                    ),
                    label: 'Traffic & Session',
                  },
                  {
                    id: 'pgAdopt',
                    tip: 'Adoption & Engagement',
                    icon: (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="7.6" cy="6.8" r="2.9" />
                        <path d="M2.6 16.6c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6" />
                        <path d="M13.4 4.3a2.9 2.9 0 0 1 0 5.4M14.6 12.4c1.8.5 3 1.9 3 4.2" />
                      </svg>
                    ),
                    label: 'Adoption & Engagement',
                  },
                  {
                    id: 'pgFlows',
                    tip: 'Workflow Usage',
                    icon: (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 2.4 17.4 6 10 9.6 2.6 6Z" />
                        <path d="M2.6 10 10 13.6 17.4 10" />
                        <path d="M2.6 14 10 17.6 17.4 14" />
                      </svg>
                    ),
                    label: 'Workflow Usage',
                  },
                ] as {
                  id: Page;
                  tip: string;
                  icon: React.ReactNode;
                  label: string;
                }[]
              ).map((item) => (
                <button
                  key={item.id}
                  className={`nav-item${page === item.id ? ' on' : ''}`}
                  data-tip={item.tip}
                  onClick={() => setPage(item.id)}
                >
                  <span className="ni-ic">{item.icon}</span>
                  <span className="ni-t">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="page-head">
            <h2>{PAGE_TITLES[page]}</h2>
            <p className="page-sub">
              PATM Application &middot; All team members &middot; all
              organizations
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="filterbar">
            {/* Date range */}
            <div
              className={`daterange${dateOpen ? ' open' : ''}`}
              ref={dateRef}
            >
              <button
                className="ctrl"
                onClick={(e) => {
                  e.stopPropagation();
                  setDateOpen((o) => !o);
                }}
              >
                <span className="ic">📅</span>
                <span>{rangeLabel}</span>
                <span className="chev">▾</span>
              </button>
              <div className="daterange-pop">
                <div className="dr-presets">
                  {([7, 30, 90] as RangePreset[]).map((days) => {
                    const labels: Record<number, string> = {
                      7: 'Last 7 days',
                      30: 'Last 30 days',
                      90: 'Last 90 days',
                    };
                    return (
                      <button
                        key={days}
                        className={`dr-preset${range === days ? ' on' : ''}`}
                        onClick={() => handlePreset(days)}
                      >
                        {labels[days]}
                      </button>
                    );
                  })}
                </div>
                <div className="dr-custom">
                  <div className="dr-custom-label">Custom range</div>
                  <div className="dr-custom-row">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <span className="dr-to">&ndash;</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                  <button className="dr-apply" onClick={handleApplyCustom}>
                    Apply custom range
                  </button>
                </div>
              </div>
            </div>

            {/* Device toggle */}
            <div className="devtoggle">
              {(['all', 'desktop', 'mobile'] as DevMode[]).map((d) => (
                <button
                  key={d}
                  className={dev === d ? 'on' : ''}
                  onClick={() => setDev(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            {/* Previous period */}
            <label
              className={`ctrl${showPrev ? ' toggle-on' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPrev((p) => !p)}
            >
              <span className="ic">↺</span> Previous period{' '}
              {showPrev ? '✓' : ''}
            </label>

            <div className="filterbar-spacer"></div>

            {/* Recently online pill */}
            <span className="pill">
              <span className="dot"></span>
              {onlineQ.isError
                ? 'Online count unavailable'
                : onlineQ.isPending
                  ? 'Loading online count...'
                  : numberText(recentlyOnline) + ' recently online'}
            </span>
          </div>

          {/* PAGE CONTENT */}
          {page === 'pgTraffic' && (
            <TrafficPage
              dev={dev}
              showPrev={showPrev}
              range={range}
              dark={dark}
              from={apiFrom}
              to={apiTo}
            />
          )}
          {page === 'pgAdopt' && (
            <AdoptionPage dev={dev} dark={dark} from={apiFrom} to={apiTo} />
          )}
          {page === 'pgFlows' && (
            <WorkflowPage dev={dev} dark={dark} from={apiFrom} to={apiTo} />
          )}

          <div className="footer">
            <p>
              <b>Wireframe note.</b> Internal team-productivity view — shows all
              PATM users across every connected organization and both platforms;
              no cross-tenant filtering is applied by default. Every number on
              this dashboard is illustrative sample data — it recomputes as you
              change <code>device</code> and <code>previous period</code>, but
              none of it is pulled from the live PostHog project yet. The{' '}
              <b>module names, screen structure, and event names</b> are the
              real, code-verified events from PATM's own PostHog event
              catalogues — only the volumes, rates, and trend lines are
              placeholder figures standing in for that data until PostHog
              insights are wired into this dashboard.
            </p>
            <p>
              <b>Two catalogues, one product.</b> PATM ships a mobile app
              (Flutter, 112 events / 17 modules,{' '}
              <code>PATM_PostHog_Events.xlsx</code>) and a web app (React, 38
              events / 8 modules,{' '}
              <code>PATM_PostHog_Events_Clean.xlsx</code>, tracked via a single{' '}
              <code>usePATMEvents()</code> hook). The two catalogues use
              different naming conventions — mobile is snake_case (
              <code>task_created</code>), web is Title Case (
              <code>"PATM Project Created"</code>) — and the web app covers a
              narrower slice of the product: it has no Tasks, Auth, Chat/AI
              Assistant, Home Dashboard or Calendar module of its own. The{' '}
              <b>Desktop / Mobile toggle</b> above reweights every workflow that
              exists on both platforms (Task/Project Creation, Sprint Review,
              MoM Action-Point Conversion, Document Access) as a union of both
              event streams — matching FM Matrix's own Desktop/Mobile split
              convention, not the iOS/Android split used elsewhere in this
              engagement for mobile-only apps. The web catalogue does not
              document its own tenant (org/company) properties — assume
              org_id/org_name/company_id apply on mobile only until a live query
              confirms otherwise on web.
            </p>
            <p>
              <b>Shared PostHog project.</b> PATM's events carry{' '}
              <code>project_code=PTM-01</code> specifically because, per the
              catalogue's own disclosure, the PostHog project is shared with a
              separate resident-facing app. Any live query against this
              dashboard's numbers must filter on{' '}
              <code>project_code=PTM-01</code>, not just an org/company id, or
              it risks blending PATM's internal team traffic with the resident
              app's.
            </p>
            <p>
              <b>
                Known blind spot — Minutes of Meeting is mobile-only
                unreachable, but works on web.
              </b>{' '}
              On mobile, the MoM drawer item is commented out in the source, so
              none of its 5 mobile events can fire from the main navigation
              today, and <code>mom_created</code> carries a{' '}
              <code>mock: true</code> property — even the create action does not
              call a real backend on mobile. On web, however, MoM is fully
              implemented (List Viewed, Viewed, Created, Updated all fire for
              real from <code>MinutesOfMeeting.tsx</code> /{' '}
              <code>AddMoMPage.tsx</code> / <code>EditMoMPage.tsx</code>; only
              the delete event has no UI). The MOM Action-Point Conversion
              workflow (§7.3) therefore reflects web-sourced completions only,
              with the mobile-side gap called out explicitly in its scope note —
              a genuinely different reachability story per platform, not a
              single unreachable module.
            </p>
            <p>
              <b>Verification caveat.</b> Both catalogues are code-verified —
              read directly from each app's own logging call sites
              (AnalyticsContext on mobile, the <code>usePATMEvents()</code> hook
              on web), not from a live-traffic export — and carry no stated
              confirmation that any individual event has been observed firing on
              a live device. Treat every event below as accurate to what the
              code calls, not yet as confirmed live traffic. Hover the{' '}
              <code>i</code> on any tile or chart for its exact definition and
              source event names.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
