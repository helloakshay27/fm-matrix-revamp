import React, { useCallback } from 'react';
import type { ChartConfiguration, ChartType } from 'chart.js/auto';
import { ChartCard } from '../ChartCard';
import {
  SA,
  PALETTE,
  MONTHS,
  CHART_CTX,
  getInfo,
  revAllTableData,
  memGrowthTableData,
  churnTableData,
  arpuTableData,
  payFailTableData,
  bookTypeAllTableData,
  revCatAllTableData,
} from '../../clubDashboardData';

const asCfg = (cfg: unknown) => cfg as ChartConfiguration;
const BRANCHES = ['Branch A', 'Branch B', 'Branch C', 'Branch D'];

export const RevAllChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: MONTHS,
          datasets: [
            { label: 'Branch A', data: SA.branchRev[0], backgroundColor: PALETTE.green },
            { label: 'Branch B', data: SA.branchRev[1], backgroundColor: PALETTE.green2 },
            { label: 'Branch C', data: SA.branchRev[2], backgroundColor: PALETTE.teal },
            { label: 'Branch D', data: SA.branchRev[3], backgroundColor: PALETTE.lav },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true, title: { display: true, text: '₹ Lakhs', font: { size: 9 } } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Revenue by Branch – 6 Months"
      subtitle="Branch A growing consistently (+23% over 6M). Branch D is the only branch declining."
      info={getInfo('Revenue by Branch')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Branch A', 'Branch B', 'Branch C', 'Branch D'], rows: revAllTableData as (string | number)[][] }}
      ctxText={CHART_CTX.revAllChart}
    />
  );
};

export const MixChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: ['Membership', 'Amenity', 'Events'], datasets: [{ data: SA.revMix, backgroundColor: [PALETTE.green, PALETTE.teal, PALETTE.lav] }] },
        options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Revenue Mix – Portfolio"
      subtitle="Membership 68% – high concentration. Events at 10% is underdeveloped for 4 branches."
      info={getInfo('Revenue Mix')}
      types={[{ type: 'doughnut', label: 'Donut' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      ctxText={CHART_CTX.mixChart}
    />
  );
};

export const MemGrowthChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: MONTHS,
          datasets: [
            { label: 'Branch A', data: SA.netGrowth[0], backgroundColor: PALETTE.green },
            { label: 'Branch B', data: SA.netGrowth[1], backgroundColor: PALETTE.green2 },
            { label: 'Branch C', data: SA.netGrowth[2], backgroundColor: PALETTE.teal },
            { label: 'Branch D', data: SA.netGrowth[3], backgroundColor: PALETTE.lav },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { title: { display: true, text: 'Net Members', font: { size: 9 } } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Net Membership Growth by Branch"
      subtitle="Branch D: negative growth in 3 of 6 months – structural churn, not seasonal."
      info={getInfo('Net Membership Growth')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'line', label: 'Line' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Branch A', 'Branch B', 'Branch C', 'Branch D'], rows: memGrowthTableData as (string | number)[][] }}
      ctxText={CHART_CTX.memGrowthChart}
    />
  );
};

export const ChurnChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: MONTHS,
          datasets: [
            { label: 'Branch A', data: SA.churnRate[0], borderColor: PALETTE.ok, tension: 0.35 },
            { label: 'Branch B', data: SA.churnRate[1], borderColor: PALETTE.blue, tension: 0.35 },
            { label: 'Branch C', data: SA.churnRate[2], borderColor: PALETTE.warn, tension: 0.35 },
            { label: 'Branch D', data: SA.churnRate[3], borderColor: PALETTE.err, tension: 0.35 },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { title: { display: true, text: 'Churn %', font: { size: 9 } } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Churn Rate by Branch – 6 Months"
      subtitle="Branch A improving. Branch D elevated at 4.9% – 2.3x the portfolio leader."
      info={getInfo('Churn Rate by Branch')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Branch A', 'Branch B', 'Branch C', 'Branch D'], rows: churnTableData as (string | number)[][] }}
      ctxText={CHART_CTX.churnChart}
    />
  );
};

export const RenewConvChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: BRANCHES, datasets: [{ data: SA.renewConv, backgroundColor: SA.renewConv.map((v) => (v >= 85 ? PALETTE.ok : v >= 75 ? PALETTE.warn : PALETTE.err)) }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 60, max: 100, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Renewal Conversion by Branch"
      subtitle="Branch D converts only 69% of renewals – 18pts below Branch A."
      info={getInfo('Renewal Conversion')}
      types={[{ type: 'bar', label: 'Bar' }, { type: 'doughnut', label: 'Donut' }]}
      buildConfig={build}
      ctxText={CHART_CTX.renewConvChart}
    />
  );
};

export const ArpuChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: BRANCHES, datasets: [{ data: SA.arpu, backgroundColor: [PALETTE.ok, PALETTE.teal, PALETTE.warn, PALETTE.err] }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 3500, title: { display: true, text: '₹/member', font: { size: 9 } } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="ARPU by Branch"
      subtitle="Branch D earns ₹794 more/member but loses them faster."
      info={getInfo('ARPU by Branch')}
      types={[{ type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Branch', 'ARPU'], rows: arpuTableData as (string | number)[][] }}
      ctxText={CHART_CTX.arpuChart}
    />
  );
};

export const PayFailChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: { labels: MONTHS, datasets: [{ data: SA.payFail, borderColor: PALETTE.err, backgroundColor: PALETTE.err + '20', fill: true, tension: 0.35 }] },
        options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 4, max: 10, ticks: { callback: (v: number) => v + '%' } } } },
      }),
    []
  );
  return (
    <ChartCard
      title="Payment Failure Rate Trend"
      subtitle="Portfolio failure rate 8.2% → 6.1% over 6M – UPI adoption driving improvement."
      info={getInfo('Payment Failure Rate')}
      types={[{ type: 'line', label: 'Line' }, { type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Month', 'Failure %'], rows: payFailTableData as (string | number)[][] }}
      ctxText={CHART_CTX.payFailChart}
    />
  );
};

export const BookTypeAllChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: BRANCHES,
          datasets: [
            { label: 'Members', data: SA.bookByType.map((b) => b[0]), backgroundColor: PALETTE.green },
            { label: 'Guests', data: SA.bookByType.map((b) => b[1]), backgroundColor: PALETTE.lav },
            { label: 'Staff', data: SA.bookByType.map((b) => b[2]), backgroundColor: PALETTE.teal },
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
      title="Bookings by Member Type – All Branches"
      subtitle="Branch D has proportionally more guest bookings (27%) – a conversion opportunity."
      info={getInfo('Bookings by Member Type - All')}
      types={[{ type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Branch', 'Members', 'Guests', 'Staff'], rows: bookTypeAllTableData as (string | number)[][] }}
      ctxText={CHART_CTX.bookTypeAllChart}
    />
  );
};

export const RevCatAllChart: React.FC = () => {
  const build = useCallback(
    (type: ChartType) =>
      asCfg({
        type,
        data: {
          labels: BRANCHES,
          datasets: [
            { label: 'Member Adult', data: SA.revCatByBranch.map((b) => b[0]), backgroundColor: PALETTE.green },
            { label: 'Guest Adult', data: SA.revCatByBranch.map((b) => b[1]), backgroundColor: PALETTE.green2 },
            { label: 'Member Child', data: SA.revCatByBranch.map((b) => b[2]), backgroundColor: PALETTE.teal },
            { label: 'Guest Child', data: SA.revCatByBranch.map((b) => b[3]), backgroundColor: PALETTE.lav },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 7, font: { size: 9 } } } },
          scales: { x: { grid: { display: false } }, y: { beginAtZero: true, title: { display: true, text: '₹ Lakhs', font: { size: 9 } } } },
        },
      }),
    []
  );
  return (
    <ChartCard
      title="Revenue by Booking Category – All Branches"
      subtitle="Member Adults dominant across all branches. Guest Adult revenue is the key second lever."
      info={getInfo('Revenue by Booking Category - All')}
      types={[{ type: 'bar', label: 'Bar' }]}
      buildConfig={build}
      table={{ headers: ['Branch', 'Member Adult', 'Guest Adult', 'Member Child', 'Guest Child'], rows: revCatAllTableData as (string | number)[][] }}
      ctxText={CHART_CTX.revCatAllChart}
    />
  );
};
