import React, { useCallback } from 'react';
import type { ChartConfiguration, ChartType } from 'chart.js/auto';
import { ChartCard } from '../ChartCard';
import {
  D,
  PALETTE,
  MONTHS,
  CHART_CTX,
  getInfo,
  memTableData,
  planTableData,
  payPlanTableData,
  revPlanTableData,
  weekdayTableData,
  leadTimeTableData,
  monthAmenTableData,
  cancelAmenTableData,
  collTrendTableData,
  cancelTableData,
  ticketCatTableData,
  eventTrendTableData,
} from '../../clubDashboardData';

const asCfg = (cfg: unknown) => cfg as ChartConfiguration;

export const MemChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: MONTHS,
          datasets: [
            { label: 'New Joins', data: D.joins, backgroundColor: PALETTE.green },
            { label: 'Expiries', data: D.expiries, backgroundColor: PALETTE.err },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="New Joins vs Expiries – 6 Months"
      subtitle="New memberships outpaced expiries in 4 of 6 months – June net gain +8."
      info={getInfo('New Joins vs Expiries')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Joins', 'Expiries', 'Net'], rows: memTableData as (string | number)[][] }}
      ctxText={CHART_CTX.memChart}
    />
  );
};

export const PlanChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: D.planLabels,
          datasets: [{ data: D.planCounts, backgroundColor: [PALETTE.green, PALETTE.green2, PALETTE.teal, PALETTE.lav, PALETTE.blue] }],
        },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Plan Distribution"
      subtitle="Annual plans (39%) drive 52% of revenue – 38 monthly members are renewal risk."
      info={getInfo('Plan Distribution')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Plan', 'Members', 'Share'], rows: planTableData as (string | number)[][] }}
      ctxText={CHART_CTX.planChart}
    />
  );
};

export const PayPlanChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: D.payPlanLabels,
          datasets: [{ data: D.payPlanCounts, backgroundColor: [PALETTE.green, PALETTE.teal, PALETTE.lav, PALETTE.blue] }],
        },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Membership by Payment Plan"
      subtitle="Yearly lump-sum most popular (94 members). Quarterly plans cover 99 collectively."
      info={getInfo('Membership by Payment Plan')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      table={{ headers: ['Plan', 'Members', 'Schedule'], rows: payPlanTableData as (string | number)[][] }}
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
      subtitle="Annual plan holders (39% of base) contribute 52% of monthly revenue."
      info={getInfo('Revenue by Plan Type')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      table={{ headers: ['Plan', 'Revenue', '% Total'], rows: revPlanTableData as (string | number)[][] }}
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
      subtitle="Members 68% · Guests 22% · Staff 10% – guest share growing MoM."
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      ctxText={CHART_CTX.bookTypeChart}
    />
  );
};

export const WeekdayChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data: D.occupancyByDay, backgroundColor: D.occupancyByDay.map((v) => (v >= 75 ? PALETTE.green : v >= 60 ? PALETTE.teal : PALETTE.warn)) }],
        },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Weekday vs Weekend Utilisation"
      subtitle="Weekends run 21pts above weekday average – Saturday peak at 82%."
      info={getInfo('Weekday vs Weekend')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Day', 'Utilisation %'], rows: weekdayTableData as (string | number)[][] }}
      ctxText={CHART_CTX.weekdayChart}
    />
  );
};

export const LeadTimeChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Same day', '1-2 days', '3-7 days', '8+ days'], datasets: [{ data: D.leadTime, backgroundColor: PALETTE.blue }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 50, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Booking Lead Time"
      subtitle="63% of bookings made within 48 hours – limiting advance revenue visibility."
      info={getInfo('Booking Lead Time')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      table={{ headers: ['Lead Time', '% Bookings'], rows: leadTimeTableData as (string | number)[][] }}
      ctxText={CHART_CTX.leadTimeChart}
    />
  );
};

export const MonthAmenChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: D.monthAmenLabels,
          datasets: [
            { label: 'Padel', data: D.monthAmenData[0], backgroundColor: PALETTE.green },
            { label: 'Badminton', data: D.monthAmenData[1], backgroundColor: PALETTE.green2 },
            { label: 'Gym', data: D.monthAmenData[2], backgroundColor: PALETTE.teal },
            { label: 'All Day', data: D.monthAmenData[3], backgroundColor: PALETTE.lav },
            { label: 'Others', data: D.monthAmenData[4], backgroundColor: PALETTE.blue },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 7, font: { size: 9 } } } },
          scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, max: 110, ticks: { callback: (v: number) => v + '%' } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Monthly Booking % by Amenity"
      subtitle="Padel consistently 32% of all bookings – highest single-amenity share."
      info={getInfo('Monthly Booking % by Amenity')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Padel', 'Badminton', 'Gym', 'All Day', 'Others'], rows: monthAmenTableData as (string | number)[][] }}
      ctxText={CHART_CTX.monthAmenChart}
    />
  );
};

export const CancelAmenChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: D.amenNames, datasets: [{ data: D.cancelAmen, backgroundColor: D.cancelAmen.map((v) => (v > 5 ? PALETTE.err : v > 3 ? PALETTE.warn : PALETTE.ok)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 8, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Cancellation Rate by Amenity"
      subtitle="All Day Pass (6.2%) cancellation rate is 2x branch average."
      info={getInfo('Cancellation Rate by Amenity')}
      types={[{ type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Amenity', 'Cancel %'], rows: cancelAmenTableData as (string | number)[][] }}
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
      subtitle="82% first-attempt collection – above the 80% branch target."
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
        data: { labels: MONTHS, datasets: [{ data: D.collEfficiency, borderColor: PALETTE.green, backgroundColor: PALETTE.green + '30', fill: true, tension: 0.35 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 70, max: 90, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Collection Efficiency Trend"
      subtitle="6-month upward trend 76% → 82% – systematic improvement in payment processes."
      info={getInfo('Collection Efficiency Trend')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Efficiency %'], rows: collTrendTableData as (string | number)[][] }}
      ctxText={CHART_CTX.collTrendChart}
    />
  );
};

export const MethodChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['UPI', 'Card', 'Wallet', 'Bank Transfer'], datasets: [{ data: [44, 38, 12, 6], backgroundColor: PALETTE.blue }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 60 } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Payment Method Mix"
      subtitle="UPI dominant at 44% – wallet adoption (12%) indicates healthy prepaid uptake."
      info={getInfo('Payment Method Mix')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.methodChart}
    />
  );
};

export const CancelChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: MONTHS, datasets: [{ data: D.cancelRate, borderColor: PALETTE.err, backgroundColor: PALETTE.err + '20', fill: true, tension: 0.35 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 0, max: 8, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Cancellation Rate Trend"
      subtitle="Cancellations declined 3 months running – 5.1% → 2.9%."
      info={getInfo('Cancellation Rate Trend')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Cancel %'], rows: cancelTableData as (string | number)[][] }}
      ctxText={CHART_CTX.cancelChart}
    />
  );
};

export const TicketChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['0-2d', '3-5d', '6-10d', '>10d'], datasets: [{ data: D.ticketAging, backgroundColor: [PALETTE.ok, PALETTE.warn, PALETTE.err, PALETTE.err] }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Open Tickets by Age"
      subtitle="3 tickets aged >5 days – SLA breach risk if unresolved by tomorrow."
      info={getInfo('Open Tickets by Age')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.ticketChart}
    />
  );
};

export const TicketCatChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Facility', 'Billing', 'Membership'], datasets: [{ data: D.ticketCats, backgroundColor: [PALETTE.err, PALETTE.warn, PALETTE.lav] }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Ticket Category Distribution"
      subtitle="Facility complaints (45%) dominate – mostly AC maintenance across courts."
      info={getInfo('Ticket Category')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Category', 'Count', '%'], rows: ticketCatTableData as (string | number)[][] }}
      ctxText={CHART_CTX.ticketCatChart}
    />
  );
};

export const EventTrendChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: D.eventNames, datasets: [{ data: D.eventFill, backgroundColor: D.eventFill.map((v) => (v >= 70 ? PALETTE.ok : v >= 50 ? PALETTE.warn : PALETTE.err)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Event Registration Trend"
      subtitle="Paid events avg 74% fill vs 42% for complimentary."
      info={getInfo('Event Registration Trend')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Event', 'Fill %', 'Revenue'], rows: eventTrendTableData as (string | number)[][] }}
      ctxText={CHART_CTX.eventTrendChart}
    />
  );
};
