import React, { useCallback } from 'react';
import type { ChartConfiguration, ChartType } from 'chart.js/auto';
import { ChartCard } from '../ChartCard';
import { D, PALETTE, CHART_CTX, getInfo } from '../../clubDashboardData';
import type {
  NewJoinVsExpiryPoint,
  PlanDistributionEntry,
  MembershipByPaymentPlan,
  DailyUtilisation,
  LeadTimeBucket,
  MonthlyAmenityBreakdown,
  CancellationRateByAmenityRow,
  PaymentMethodMix,
  CancellationRateTrendPoint,
  TicketAgeBucket,
  TicketCategoryRow,
  EventRegistrationTrendRow,
} from '@/services/clubDashboardApi';

const asCfg = (cfg: unknown) => cfg as ChartConfiguration;

export const MemChart: React.FC<{ data: NewJoinVsExpiryPoint[] }> = ({ data }) => {
  const labels = data.map((d) => d.month);
  const joins = data.map((d) => d.new);
  const expiries = data.map((d) => d.expired);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels,
          datasets: [
            { label: 'New Joins', data: joins, backgroundColor: PALETTE.green },
            { label: 'Expiries', data: expiries, backgroundColor: PALETTE.err },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
        },
      }),
    // Depend on the raw `data` prop, not the freshly-mapped local arrays above (those get a
    // new reference every render regardless of whether the data actually changed, which would
    // rebuild this chart on every unrelated re-render now that ChartCard watches buildConfig).
    [data]
  );
  return (
    <ChartCard
      title="New Joins vs Expiries – 6 Months"
      subtitle="Monthly new memberships vs expiries for the selected range."
      info={getInfo('New Joins vs Expiries')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Joins', 'Expiries', 'Net'], rows: data.map((d) => [d.month, d.new, d.expired, d.new - d.expired]) }}
      ctxText={CHART_CTX.memChart}
    />
  );
};

export const PlanChart: React.FC<{ data: PlanDistributionEntry[] }> = ({ data }) => {
  const labels = data.map((d) => d.plan);
  const counts = data.map((d) => d.count);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels,
          datasets: [{ data: counts, backgroundColor: [PALETTE.green, PALETTE.green2, PALETTE.teal, PALETTE.lav, PALETTE.blue] }],
        },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Plan Distribution"
      subtitle="Active members grouped by membership plan for the selected range."
      info={getInfo('Plan Distribution')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Plan', 'Members', 'Share'], rows: data.map((d) => [d.plan, d.count, d.percentage.toFixed(1) + '%']) }}
      ctxText={CHART_CTX.planChart}
    />
  );
};

export const PayPlanChart: React.FC<{ data: MembershipByPaymentPlan }> = ({ data }) => {
  const labels = ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly'];
  const counts = [data.yearly, data.half_yearly, data.quarterly, data.monthly];
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: counts, backgroundColor: [PALETTE.green, PALETTE.teal, PALETTE.lav, PALETTE.blue] }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Membership by Payment Plan"
      subtitle="Members grouped by how often they pay, for the selected range."
      info={getInfo('Membership by Payment Plan')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      table={{
        headers: ['Plan', 'Members', 'Schedule'],
        rows: labels.map((l, i) => [l, counts[i], ['Lump sum', '2 instalments', '3 instalments', 'Monthly'][i]]),
      }}
      ctxText={CHART_CTX.payPlanChart}
    />
  );
};

export const RevPlanChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: D.planLabels,
          datasets: [{ data: D.planRevenue, backgroundColor: [PALETTE.green, PALETTE.green2, PALETTE.teal, PALETTE.lav, PALETTE.blue] }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (v: number) => '₹' + Math.round(Number(v) / 1000) + 'K' } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Revenue by Plan Type"
      subtitle="Not backed by an API yet - needs a product decision (see Gap Report). Showing placeholder data."
      info={getInfo('Revenue by Plan Type')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.revPlanChart}
    />
  );
};

export const BookTypeChart: React.FC<{ member: number; guest: number; staff: number }> = ({ member, guest, staff }) => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Members', 'Guests', 'Staff'], datasets: [{ data: [member, guest, staff], backgroundColor: [PALETTE.green, PALETTE.lav, PALETTE.teal] }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    [member, guest, staff]
  );
  return (
    <ChartCard
      title="Bookings by Member Type"
      subtitle="Members vs guests vs staff, for the selected period."
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      ctxText={CHART_CTX.bookTypeChart}
    />
  );
};

const WEEKDAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const WeekdayChart: React.FC<{ data: DailyUtilisation[] }> = ({ data }) => {
  const byDay = new Map(data.map((d) => [d.day, d.average_utilisation]));
  const values = WEEKDAY_ORDER.map((day) => byDay.get(day) ?? 0);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: WEEKDAY_SHORT, datasets: [{ data: values, backgroundColor: values.map((v) => (v >= 75 ? PALETTE.green : v >= 60 ? PALETTE.teal : PALETTE.warn)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Weekday vs Weekend Utilisation"
      subtitle="Average amenity utilisation per day of the week."
      info={getInfo('Weekday vs Weekend')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Day', 'Utilisation %'], rows: WEEKDAY_ORDER.map((d, i) => [d, values[i].toFixed(1) + '%']) }}
      ctxText={CHART_CTX.weekdayChart}
    />
  );
};

export const LeadTimeChart: React.FC<{ data: LeadTimeBucket[] }> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  const labels = data.map((d) => d.bucket);
  const percentages = data.map((d) => Math.round((d.count / total) * 1000) / 10);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: percentages, backgroundColor: PALETTE.blue }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 50, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Booking Lead Time"
      subtitle="How far in advance bookings are made."
      info={getInfo('Booking Lead Time')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      table={{ headers: ['Lead Time', '% Bookings'], rows: data.map((d, i) => [d.bucket, percentages[i] + '%']) }}
      ctxText={CHART_CTX.leadTimeChart}
    />
  );
};

const AMENITY_SERIES_COLORS = [PALETTE.green, PALETTE.green2, PALETTE.teal, PALETTE.lav, PALETTE.blue];

export const MonthAmenChart: React.FC<{ data: MonthlyAmenityBreakdown[] }> = ({ data }) => {
  const labels = data.map((m) => m.month);
  // Rank amenities by their most recent month's share, keep the top 4, fold the rest into "Others".
  const latest = data[data.length - 1];
  const topNames = (latest?.amenities ?? [])
    .slice()
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4)
    .map((a) => a.amenity);
  const seriesNames = [...topNames, 'Others'];
  const seriesData = seriesNames.map((name) =>
    data.map((m) => {
      if (name === 'Others') {
        const known = m.amenities.filter((a) => topNames.includes(a.amenity)).reduce((s, a) => s + a.percentage, 0);
        return Math.max(0, Math.round((100 - known) * 10) / 10);
      }
      return m.amenities.find((a) => a.amenity === name)?.percentage ?? 0;
    })
  );
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels,
          datasets: seriesNames.map((name, i) => ({ label: name, data: seriesData[i], backgroundColor: AMENITY_SERIES_COLORS[i % AMENITY_SERIES_COLORS.length] })),
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 7, font: { size: 9 } } } },
          scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, max: 110, ticks: { callback: (v: number) => v + '%' } } },
        },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Monthly Booking % by Amenity"
      subtitle="Share of total bookings held by each amenity, per month."
      info={getInfo('Monthly Booking % by Amenity')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', ...seriesNames], rows: labels.map((m, i) => [m, ...seriesData.map((s) => s[i] + '%')]) }}
      ctxText={CHART_CTX.monthAmenChart}
    />
  );
};

export const CancelAmenChart: React.FC<{ data: CancellationRateByAmenityRow[] }> = ({ data }) => {
  const labels = data.map((d) => d.amenity);
  const rates = data.map((d) => d.cancellation_rate);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: rates, backgroundColor: rates.map((v) => (v > 5 ? PALETTE.err : v > 3 ? PALETTE.warn : PALETTE.ok)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Cancellation Rate by Amenity"
      subtitle="Cancelled bookings as a % of total, per amenity."
      info={getInfo('Cancellation Rate by Amenity')}
      types={[{ type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Amenity', 'Cancel %'], rows: data.map((d) => [d.amenity, d.cancellation_rate.toFixed(1) + '%']) }}
      ctxText={CHART_CTX.cancelAmenChart}
    />
  );
};

export const PayChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Paid', 'Pending', 'Overdue'], datasets: [{ data: [420000, 38000, 12000], backgroundColor: [PALETTE.ok, PALETTE.warn, PALETTE.err] }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Collections Status"
      subtitle="Not wired to an API yet (explicitly out of scope for this pass). Showing placeholder data."
      info={getInfo('Collections Status')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      ctxText={CHART_CTX.payChart}
    />
  );
};

export const CollTrendChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ data: D.collEfficiency, borderColor: PALETTE.green, backgroundColor: PALETTE.green + '30', fill: true, tension: 0.35 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 70, max: 90, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Collection Efficiency Trend"
      subtitle="Not wired to an API yet (explicitly out of scope for this pass). Showing placeholder data."
      info={getInfo('Collection Efficiency Trend')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      ctxText={CHART_CTX.collTrendChart}
    />
  );
};

const METHOD_ORDER = ['UPI', 'Card', 'Wallet', 'Bank Transfer', 'Cash'];
// The Postman collection's example shows display-cased keys ("Bank Transfer"), but a Rails
// JSON endpoint just as plausibly returns them snake_cased ("bank_transfer") or lowercased
// ("upi") - matching only the exact display string left the chart empty against real data.
const normalizeMethodKey = (s: string) => s.toLowerCase().replace(/[\s_-]/g, '');

export const MethodChart: React.FC<{ data: PaymentMethodMix }> = ({ data }) => {
  const entries = Object.entries(data).filter((entry): entry is [string, number] => typeof entry[1] === 'number');
  const known = METHOD_ORDER.map((label) => {
    const match = entries.find(([key]) => normalizeMethodKey(key) === normalizeMethodKey(label));
    return match ? ([label, match[1]] as [string, number]) : null;
  }).filter((x): x is [string, number] => x !== null);
  // Anything the API sent that didn't match one of the known method names still shows up,
  // instead of silently disappearing.
  const unmatched = entries.filter(([key]) => !METHOD_ORDER.some((label) => normalizeMethodKey(key) === normalizeMethodKey(label)));
  const combined = [...known, ...unmatched];
  const labels = combined.map(([key]) => key);
  const values = combined.map(([, value]) => value);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: values, backgroundColor: PALETTE.blue }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Payment Method Mix"
      subtitle="Share of payments received via each method, for the selected range."
      info={getInfo('Payment Method Mix')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.methodChart}
    />
  );
};

export const CancelChart: React.FC<{ data: CancellationRateTrendPoint[] }> = ({ data }) => {
  const labels = data.map((d) => d.month);
  const rates = data.map((d) => d.cancellation_rate);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: rates, borderColor: PALETTE.err, backgroundColor: PALETTE.err + '20', fill: true, tension: 0.35 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Cancellation Rate Trend"
      subtitle="Overall monthly booking cancellation rate."
      info={getInfo('Cancellation Rate Trend')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Cancel %'], rows: data.map((d) => [d.month, d.cancellation_rate.toFixed(1) + '%']) }}
      ctxText={CHART_CTX.cancelChart}
    />
  );
};

export const TicketChart: React.FC<{ data: TicketAgeBucket[] }> = ({ data }) => {
  const labels = data.map((d) => d.age_bucket);
  const counts = data.map((d) => d.ticket_count);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: counts, backgroundColor: [PALETTE.ok, PALETTE.warn, PALETTE.err, PALETTE.err] }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Open Tickets by Age"
      subtitle="Unresolved tickets grouped by how long they've been open (all-time)."
      info={getInfo('Open Tickets by Age')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.ticketChart}
    />
  );
};

export const TicketCatChart: React.FC<{ data: TicketCategoryRow[] }> = ({ data }) => {
  const labels = data.map((d) => d.category);
  const counts = data.map((d) => d.ticket_count);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: counts, backgroundColor: [PALETTE.err, PALETTE.warn, PALETTE.lav, PALETTE.blue, PALETTE.teal] }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    [data]
  );
  const total = counts.reduce((s, c) => s + c, 0) || 1;
  return (
    <ChartCard
      title="Ticket Category Distribution"
      subtitle="Open tickets grouped by category (all-time)."
      info={getInfo('Ticket Category')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Category', 'Count', '%'], rows: data.map((d) => [d.category, d.ticket_count, Math.round((d.ticket_count / total) * 100) + '%']) }}
      ctxText={CHART_CTX.ticketCatChart}
    />
  );
};

export const EventTrendChart: React.FC<{ data: EventRegistrationTrendRow[] }> = ({ data }) => {
  const labels = data.map((d) => d.event);
  const values = data.map((d) => parseFloat(d.percentage) || 0);
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels, datasets: [{ data: values, backgroundColor: values.map((v) => (v >= 70 ? PALETTE.ok : v >= 50 ? PALETTE.warn : PALETTE.err)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    [data]
  );
  return (
    <ChartCard
      title="Event Registration Trend"
      subtitle="Fill rate for the 10 most recent events."
      info={getInfo('Event Registration Trend')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Event', 'Fill %'], rows: data.map((d) => [d.event, d.percentage]) }}
      ctxText={CHART_CTX.eventTrendChart}
    />
  );
};
