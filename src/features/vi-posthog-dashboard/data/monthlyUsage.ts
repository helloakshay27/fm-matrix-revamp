import type { UsageDay } from '@/features/posthog-dashboard/api/adoptionApi';
import type { UsageDistributionResponse } from '../api/adoptionApi';
import type { TrafficData } from '@/features/posthog-dashboard/data/metrics';

/**
 * Month-wise "Usage over time".
 *
 * The API only ever returns a daily series, and over a quarter-long range that is 90+ points
 * squeezed into 680px — unreadable, and not how this chart is meant to read. So the daily rows
 * are rolled up into one point per calendar month here, in the Vi feature rather than in the
 * shared `buildTraffic`, which the FM dashboard also uses and still wants daily.
 *
 * Note on what the roll-up means per measure:
 *   views / sessions — additive, so the monthly number is the true month total.
 *   visitors — NOT additive. The API's daily `visitors` is a distinct-user count per day, so
 *     summing a month gives "sum of daily actives", not distinct users that month (anyone
 *     active on five days counts five times). Getting a true monthly unique needs a
 *     month-granularity call the API does not expose, so this is the closest available and
 *     the label below says "Employees" rather than claiming uniqueness.
 */

type Measure = 'visitors' | 'views' | 'sessions';

/** '2026-06-22' -> '2026-06'. */
const monthKey = (day: string) => day.slice(0, 7);

/** '2026-06' -> 'Jun', or 'Jun 26' when the range crosses a year boundary. */
function monthLabel(key: string, withYear: boolean) {
  const [y, m] = key.split('-');
  const name = MONTHS[Number(m) - 1] ?? key;
  return withYear ? `${name} ${y.slice(2)}` : name;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

/** Sums one measure per calendar month, over the months the range actually covers. */
function bucket(rows: UsageDay[], measure: Measure, months: string[]): number[] {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const k = monthKey(r.day);
    totals.set(k, (totals.get(k) ?? 0) + (r[measure] ?? 0));
  }
  return months.map((k) => totals.get(k) ?? 0);
}

/**
 * Rolls a `TrafficData.chart` up to one point per month.
 *
 * Falls back to the daily chart it was handed when the range does not span at least two
 * months — a single dot is worse than 20 daily points, and a "month-wise" view of one week
 * is not a view of anything.
 */
export function toMonthlyChart(
  chart: TrafficData['chart'],
  usage: UsageDistributionResponse | undefined,
  measure: Measure
): TrafficData['chart'] {
  const cur = usage?.usage_over_time.current ?? [];
  if (cur.length === 0) return chart;

  const days = cur.map((r) => r.day).sort();
  const months = monthRange(monthKey(days[0]), monthKey(days[days.length - 1]));
  if (months.length < 2) return chart;

  const spansYears = new Set(months.map((k) => k.slice(0, 4))).size > 1;
  const prevRows = usage?.usage_over_time.previous ?? [];

  return {
    ...chart,
    labels: months.map((k) => monthLabel(k, spansYears)),
    cur: bucket(cur, measure, months),
    // The previous-period overlay is a reference line, so it keeps the current line's length
    // and is aligned on its most recent months.
    prev: prevRows.length ? alignPrev(prevRows, measure, months.length) : [],
  };
}

/** The previous period's own months, trimmed/padded to `n` points so the overlay lines up. */
function alignPrev(rows: UsageDay[], measure: Measure, n: number): number[] {
  const days = rows.map((r) => r.day).sort();
  const months = monthRange(monthKey(days[0]), monthKey(days[days.length - 1]));
  const values = bucket(rows, measure, months);
  return values.length >= n ? values.slice(-n) : [...Array(n - values.length).fill(0), ...values];
}
