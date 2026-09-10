import type { UsageDay } from '@/features/posthog-dashboard/api/adoptionApi';
import type { TrafficData } from '@/features/posthog-dashboard/data/metrics';
import type { UsageDistributionResponse } from '../api/adoptionApi';

/**
 * The "Usage over time" series, at a granularity and with labels a reader can act on.
 *
 * Two problems with the shared builder's output, both fixed here rather than in
 * `buildTraffic` — the FM dashboard uses that too and is happy with it as-is:
 *
 *   1. Granularity. The API only ever returns a daily series, so a quarter-long range is
 *      90+ points in 680px. Ranges past ~two months are rolled up to one point per calendar
 *      month; shorter ones stay daily (see MONTHLY_ABOVE_DAYS).
 *   2. Labels. The shared `mdLabel` renders '2026-08-09' as "8/9", which reads as 8 September
 *      to half the audience and as nothing at all to the rest. Days become "9 Aug" and months
 *      become "Aug" — spelled out, unambiguous in any locale.
 *
 * What the monthly roll-up means per measure:
 *   views / sessions — additive, so the monthly number is the true month total.
 *   visitors — NOT additive. The API's daily `visitors` is a distinct-user count per day, so
 *     summing a month gives "sum of daily actives", not distinct users that month (anyone
 *     active on five days counts five times). A true monthly unique needs a month-granularity
 *     call the API does not expose, so this is the closest available.
 */

type Measure = 'visitors' | 'views' | 'sessions';

/**
 * Ranges longer than two months go month-wise; anything shorter stays daily.
 *
 * The threshold is a day count, not a month count: "last 30 days" straddles a month boundary
 * most of the time, and rolling that up would answer a question about 30 days with two bars,
 * one of them a part-month. At 60+ days the daily line is the unreadable one, and the
 * part-month at each end is a smaller share of what is on screen.
 */
const MONTHLY_ABOVE_DAYS = 62;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-06-22' -> '2026-06'. */
const monthKey = (day: string) => day.slice(0, 7);

const monthName = (key: string) => MONTHS[Number(key.slice(5, 7)) - 1] ?? key;

/** '2026-06' -> 'Jun', or 'Jun 26' when the range crosses a year boundary. */
const monthLabel = (key: string, withYear: boolean) =>
  withYear ? `${monthName(key)} ${key.slice(2, 4)}` : monthName(key);

/** '2026-08-09' -> '9 Aug', or '9 Aug 26' when the range crosses a year boundary. */
const dayLabel = (day: string, withYear: boolean) =>
  `${Number(day.slice(8, 10))} ${monthName(day)}${withYear ? ` ${day.slice(2, 4)}` : ''}`;

/** Every calendar day in [from, to] — the API omits days with no activity. */
function dayRange(from: string, to: string): string[] {
  const out: string[] = [];
  const end = new Date(`${to}T00:00:00Z`);
  for (let d = new Date(`${from}T00:00:00Z`); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/** Every month key from `first` to `last` inclusive, so a month with no events stays a gap. */
function monthRange(first: string, last: string): string[] {
  const out: string[] = [];
  let [y, m] = first.split('-').map(Number);
  const [ly, lm] = last.split('-').map(Number);
  while (y < ly || (y === ly && m <= lm)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

/** Sums one measure into the given buckets, keyed by whatever prefix the bucket is. */
function bucket(rows: UsageDay[], measure: Measure, keys: string[], keyOf: (day: string) => string) {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const k = keyOf(r.day);
    totals.set(k, (totals.get(k) ?? 0) + (r[measure] ?? 0));
  }
  return keys.map((k) => totals.get(k) ?? 0);
}

/** Trims/pads the previous period to `n` points so the reference overlay lines up. */
const align = (values: number[], n: number) =>
  values.length >= n ? values.slice(-n) : [...Array(n - values.length).fill(0), ...values];

export function toUsageChart(
  chart: TrafficData['chart'],
  usage: UsageDistributionResponse | undefined,
  measure: Measure,
  from: string,
  to: string,
): TrafficData['chart'] {
  const cur = usage?.usage_over_time.current ?? [];
  const prev = usage?.usage_over_time.previous ?? [];
  if (cur.length === 0) return chart;

  const days = dayRange(from, to);
  if (days.length === 0) return chart;

  const months = monthRange(monthKey(days[0]), monthKey(days[days.length - 1]));
  const spansYears = new Set(days.map((d) => d.slice(0, 4))).size > 1;

  if (days.length > MONTHLY_ABOVE_DAYS) {
    return {
      ...chart,
      labels: months.map((k) => monthLabel(k, spansYears)),
      cur: bucket(cur, measure, months, monthKey),
      prev: prev.length ? align(bucketPrevMonths(prev, measure), months.length) : [],
    };
  }

  const identity = (d: string) => d;
  return {
    ...chart,
    labels: days.map((d) => dayLabel(d, spansYears)),
    cur: bucket(cur, measure, days, identity),
    prev: prev.length ? align(bucket(prev, measure, prevDays(prev), identity), days.length) : [],
  };
}

/**
 * Weekly-chart axis: "W1 … W8" instead of the shared builder's "8/4" week-start dates.
 *
 * Each chart's own title already says which weeks these are ("last 8 weeks"), so the axis only
 * has to number them — and eight short labels all fit, where eight dates do not. The dates are
 * not thrown away: they come back spelled out in `tips`, which the hover card shows.
 */
export function toWeekLabels(labels: string[]): { axis: string[]; tips: string[] } {
  return {
    axis: labels.map((_, i) => `W${i + 1}`),
    tips: labels.map((l, i) => {
      const spelled = spellMd(l);
      return spelled ? `W${i + 1} · week of ${spelled}` : `W${i + 1}`;
    }),
  };
}

/**
 * Retention cohort rows: "5/22 · 128" -> a "22 May" label plus "128 new users" as hover text.
 *
 * The shared builder packs the cohort's size into the row label, which makes the first column
 * the widest thing in the grid and buries the date it is really keyed on. The size is still
 * worth having, so it moves to the row's tooltip rather than being dropped.
 */
export function toCohortLabels(labels: string[]): { labels: string[]; titles: string[] } {
  const parts = labels.map((l) => l.split(' · '));
  return {
    labels: parts.map(([md], i) => spellMd(md) ?? labels[i]),
    titles: parts.map(([md, size]) => {
      const when = spellMd(md) ?? md;
      return size ? `Employees first seen in the week of ${when} · ${size} new` : when;
    }),
  };
}

/**
 * Role rows: 'pms_occupant' -> 'Occupant'.
 *
 * The roles endpoint returns the raw `user_role` property, which is a database value, not a
 * label — the `pms_` prefix is an internal namespace and the underscores are not words. This
 * only tidies the string; it does not rename or regroup a role, so an unrecognised value
 * still comes through recognisably.
 */
export function toRoleLabel(role: string): string {
  const words = role.replace(/^pms_/, '').split(/[_\-\s]+/).filter(Boolean);
  if (words.length === 0) return role;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/** '8/4' -> '4 Aug'. Returns null for anything not in the shared mdLabel's M/D shape. */
function spellMd(label: string): string | null {
  const [m, d] = label.split('/').map(Number);
  if (!Number.isFinite(m) || !Number.isFinite(d) || !MONTHS[m - 1]) return null;
  return `${d} ${MONTHS[m - 1]}`;
}

/** The previous period's own months, in order. */
function bucketPrevMonths(rows: UsageDay[], measure: Measure) {
  const days = rows.map((r) => r.day).sort();
  const months = monthRange(monthKey(days[0]), monthKey(days[days.length - 1]));
  return bucket(rows, measure, months, monthKey);
}

/** The previous period's own days, in order — the API omits inactive ones, so derive the span. */
function prevDays(rows: UsageDay[]) {
  const days = rows.map((r) => r.day).sort();
  return dayRange(days[0], days[days.length - 1]);
}
