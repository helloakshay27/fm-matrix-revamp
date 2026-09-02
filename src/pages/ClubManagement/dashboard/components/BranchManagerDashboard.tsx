import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TopNavDateFilter } from './TopNavDateFilter';
import { SectionGuide } from './SectionGuide';
import { KpiCard } from './KpiCard';
import { InfoTooltip } from './InfoTooltip';
import { AiInsightBlock } from './AiInsightBlock';
import { AvailableSlotsHeatmap, CapacityAnalysisCard } from './AmenityVisuals';
import {
  MemChart, PlanChart, PayPlanChart, RevPlanChart, BookTypeChart, WeekdayChart, LeadTimeChart,
  MonthAmenChart, CancelAmenChart, PayChart, CollTrendChart, MethodChart, CancelChart, TicketChart,
  TicketCatChart, EventTrendChart,
} from './charts/BranchCharts';
import { useDrill } from '../DrillContext';
import { useStickyHeaderStack } from '../useStickyHeaderStack';
import { D, getInfo } from '../clubDashboardData';
import {
  activeMembersHTML, todayBookingsHTML, collectionsHTML, ticketsHTML, renewalsHTML, renewalRowHTML,
  noShowHTML, invoiceHTML, eventHTML, groupDrillHTML, groupRowHTML, memberDaysHTML, cancelHTML,
  pendingHTML, coachDrillHTML, occupancyHTML,
} from '../drillTemplates';
import {
  defaultDateRange,
  type DateRangeParams,
  getMemberOverview,
  getGroupMemberships,
  getGuestOverview,
  getStaffOverview,
  getBillingOverview,
  getPaymentMethods,
  getCancellationRateTrend,
  getOverdueInvoices,
  getPendingPayments,
  getActiveMembersCount,
  getNewJoinVsExpiries,
  getMembershipByPaymentPlan,
  getPlanDistribution,
  getActiveMembershipDaysRemaining,
  getUpcomingRenewalsCount,
  getUpcomingRenewalsList,
  getBookingSummary,
  getAvailableSlotsByDay,
  getWeekdayVsWeekendUtilisation,
  getBookingLeadTimeDistribution,
  getMonthlyBookingPercentageByAmenity,
  getCancellationRateByAmenity,
  getCapacityOverview,
  getAmenityUtilizationAnalysis,
  getBlockedByAmenity,
  getBlockedSlotsByAmenity,
  getCancelledBookings,
  getOpenTicketsCount,
  getOpenTicketsByAge,
  getTicketCategoryDistribution,
  getRegistrationFillRateUpcomingEvents,
  getEventRegistrationTrend,
} from '@/services/clubDashboardApi';

const SECTIONS = [
  { id: 'bs-branchoverview', label: 'Branch Overview' },
  { id: 'bs-payments', label: 'Payments' },
  { id: 'bs-membership', label: 'Membership' },
  { id: 'bs-amenities', label: 'Amenities & Bookings' },
  { id: 'bs-coaches', label: 'Coach Schedule' },
  { id: 'bs-capacity', label: 'Capacity & Blocks' },
  { id: 'bs-tickets', label: 'Tickets' },
  { id: 'bs-events', label: 'Events' },
];

const COACH_LABELS: Record<'today' | 'tomorrow' | 'week', string> = {
  today: 'Showing coach and staff bookings per slot per amenity for today.',
  tomorrow: 'Showing coach and staff bookings per slot per amenity for tomorrow.',
  week: 'Showing coach and staff bookings per slot per amenity for this week.',
};

function formatINR(v: number | undefined): string {
  const n = v ?? 0;
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return '₹' + Math.round(n / 1000) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}

function daysBadgeClass(daysLeft: number): string {
  if (daysLeft < 30) return 'days-err';
  if (daysLeft < 60) return 'days-warn';
  return 'days-ok';
}

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('expir') || s.includes('risk') || s.includes('emergency')) return 'b-err';
  if (s.includes('renew') || s.includes('due') || s.includes('watch') || s.includes('planned')) return 'b-warn';
  return 'b-ok';
}

function actionBadgeClass(action: string): string {
  const a = action.toLowerCase();
  if (a.includes('escalate')) return 'b-err';
  if (a.includes('remind')) return 'b-warn';
  return 'b-ok';
}

// Membership period pills map to date ranges (the API has no "period" keyword, only from_date/to_date).
function memberPeriodRange(period: 'month' | 'quarter' | 'year'): DateRangeParams {
  const now = new Date();
  const to_date = now.toISOString().slice(0, 10);
  const from = new Date(now);
  if (period === 'month') from.setDate(1);
  else if (period === 'quarter') from.setMonth(from.getMonth() - 2, 1);
  else from.setMonth(0, 1);
  return { from_date: from.toISOString().slice(0, 10), to_date };
}

// Booking period pills map directly onto booking_summary's `range` values.
const BOOK_RANGE: Record<'day' | 'week' | 'month' | 'year', string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
};

// The global queryClient defaults to retry:1 + refetchOnWindowFocus/Reconnect, which makes
// every one of these ~30 dashboard queries fire again on a failed attempt or whenever the
// browser tab regains focus - each looking like the same API "running multiple times".
// These are read-only analytics reads: fetch once per queryKey change and stay put.
const Q = { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false } as const;

export const BranchManagerDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const { openDrill } = useDrill();
  const rootRef = useStickyHeaderStack<HTMLDivElement>();
  // Driven by the top-nav date filter (defaults to the trailing one year) - every date-scoped
  // query below keys off this so clicking "Apply" up there refetches everything at once.
  const [range, setRange] = useState<Required<DateRangeParams>>(() => defaultDateRange());

  const [memPeriod, setMemPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [bookPeriod, setBookPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [refundPeriod, setRefundPeriod] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [coachPeriod, setCoachPeriod] = useState<'today' | 'tomorrow' | 'week'>('today');
  const memRange = useMemo(() => memberPeriodRange(memPeriod), [memPeriod]);

  // ── Branch Overview ──
  const memberOverviewQ = useQuery({ ...Q, queryKey: ['club', 'memberOverview', range], queryFn: () => getMemberOverview(range) });
  const groupMembershipsQ = useQuery({ ...Q, queryKey: ['club', 'groupMemberships'], queryFn: () => getGroupMemberships('active') });
  const guestOverviewQ = useQuery({ ...Q, queryKey: ['club', 'guestOverview', range], queryFn: () => getGuestOverview(range) });
  const staffOverviewQ = useQuery({ ...Q, queryKey: ['club', 'staffOverview', range], queryFn: () => getStaffOverview(range) });

  // ── Payments ──
  const billingOverviewQ = useQuery({ ...Q, queryKey: ['club', 'billingOverview', range], queryFn: () => getBillingOverview(range) });
  const paymentMethodsQ = useQuery({ ...Q, queryKey: ['club', 'paymentMethods', range], queryFn: () => getPaymentMethods(range) });
  const cancellationTrendQ = useQuery({ ...Q, queryKey: ['club', 'cancellationRateTrend', range], queryFn: () => getCancellationRateTrend(range) });
  const overdueInvoicesQ = useQuery({ ...Q, queryKey: ['club', 'overdueInvoices', range], queryFn: () => getOverdueInvoices(range) });
  const pendingPaymentsQ = useQuery({ ...Q, queryKey: ['club', 'pendingPayments', range], queryFn: () => getPendingPayments(range) });

  // ── Membership ──
  // (all four now driven by the same top-nav `range` as everything else - see note by `Q` above)
  const activeMembersQ = useQuery({ ...Q, queryKey: ['club', 'activeMembers', range], queryFn: () => getActiveMembersCount(range) });
  const newJoinVsExpiriesQ = useQuery({ ...Q, queryKey: ['club', 'newJoinVsExpiries', range], queryFn: () => getNewJoinVsExpiries(range) });
  const membershipByPaymentPlanQ = useQuery({ ...Q, queryKey: ['club', 'membershipByPaymentPlan', range], queryFn: () => getMembershipByPaymentPlan(range) });
  const planDistributionQ = useQuery({ ...Q, queryKey: ['club', 'planDistribution', range], queryFn: () => getPlanDistribution(range) });
  const daysRemainingQ = useQuery({ ...Q, queryKey: ['club', 'activeMembershipDaysRemaining', range], queryFn: () => getActiveMembershipDaysRemaining(range) });
  const upcomingRenewalsCountQ = useQuery({ ...Q, queryKey: ['club', 'upcomingRenewalsCount', range], queryFn: () => getUpcomingRenewalsCount(range) });
  const upcomingRenewalsListQ = useQuery({ ...Q, queryKey: ['club', 'upcomingRenewalsList', range], queryFn: () => getUpcomingRenewalsList(range) });

  // ── Amenities & Bookings ──
  // Passing explicit from_date/to_date overrides the endpoint's `range` keyword (per its own
  // docs), so this now follows the top-nav filter too instead of the old period pills.
  const bookingSummaryQ = useQuery({ ...Q, queryKey: ['club', 'bookingSummary', range], queryFn: () => getBookingSummary(range) });
  const availableSlotsQ = useQuery({ ...Q, queryKey: ['club', 'availableSlots', range.to_date], queryFn: () => getAvailableSlotsByDay(range.to_date) });
  const weekdayUtilisationQ = useQuery({ ...Q, queryKey: ['club', 'weekdayVsWeekend', range], queryFn: () => getWeekdayVsWeekendUtilisation(range) });
  const leadTimeQ = useQuery({ ...Q, queryKey: ['club', 'leadTime', range], queryFn: () => getBookingLeadTimeDistribution(range) });
  const monthlyAmenityQ = useQuery({ ...Q, queryKey: ['club', 'monthlyAmenity', range], queryFn: () => getMonthlyBookingPercentageByAmenity(range) });
  const cancellationByAmenityQ = useQuery({ ...Q, queryKey: ['club', 'cancellationByAmenity', range], queryFn: () => getCancellationRateByAmenity(range) });

  // ── Capacity & Blocks ──
  const capacityOverviewQ = useQuery({ ...Q, queryKey: ['club', 'capacityOverview'], queryFn: () => getCapacityOverview() });
  const amenityUtilizationQ = useQuery({ ...Q, queryKey: ['club', 'amenityUtilization', range], queryFn: () => getAmenityUtilizationAnalysis(range) });
  const blockedByAmenityQ = useQuery({ ...Q, queryKey: ['club', 'blockedByAmenity', range], queryFn: () => getBlockedByAmenity(range) });
  const blockedSlotsByAmenityQ = useQuery({ ...Q, queryKey: ['club', 'blockedSlotsByAmenity', range], queryFn: () => getBlockedSlotsByAmenity(range) });
  const cancelledBookingsQ = useQuery({ ...Q, queryKey: ['club', 'cancelledBookings', range], queryFn: () => getCancelledBookings(range) });

  // ── Tickets ──
  const openTicketsCountQ = useQuery({ ...Q, queryKey: ['club', 'openTicketsCount', range], queryFn: () => getOpenTicketsCount(range) });
  const openTicketsByAgeQ = useQuery({ ...Q, queryKey: ['club', 'openTicketsByAge'], queryFn: () => getOpenTicketsByAge() });
  const ticketCategoryQ = useQuery({ ...Q, queryKey: ['club', 'ticketCategoryDistribution'], queryFn: () => getTicketCategoryDistribution() });

  // ── Events ──
  const registrationFillRateQ = useQuery({ ...Q, queryKey: ['club', 'registrationFillRate', range], queryFn: () => getRegistrationFillRateUpcomingEvents(range) });
  const eventTrendQ = useQuery({ ...Q, queryKey: ['club', 'eventRegistrationTrend', range], queryFn: () => getEventRegistrationTrend(range) });

  // ── Derived values ──
  const memberOverview = memberOverviewQ.data;
  const guestOverview = guestOverviewQ.data;
  const staffOverview = staffOverviewQ.data;
  const groupMemberships = groupMembershipsQ.data;
  const billing = billingOverviewQ.data;
  const newJoinVsExpiries = newJoinVsExpiriesQ.data ?? [];
  const latestMonth = newJoinVsExpiries[newJoinVsExpiries.length - 1];
  const activeMembers = activeMembersQ.data ?? 0;
  const bookingSummary = bookingSummaryQ.data;
  const amenityUtilization = amenityUtilizationQ.data ?? [];
  const avgUtilisation = amenityUtilization.length
    ? Math.round((amenityUtilization.reduce((s, a) => s + a.average_utilization_percentage, 0) / amenityUtilization.length) * 10) / 10
    : 0;
  const openTicketsByAge = openTicketsByAgeQ.data ?? [];
  const agedOver5 = openTicketsByAge.filter((b) => !/^0-2|^3-5/.test(b.age_bucket)).reduce((s, b) => s + b.ticket_count, 0);
  const capacityOverview = capacityOverviewQ.data;
  const memGap = D.memPeriod.month; // churn/retention aren't backed by an API yet - see Gap Report

  return (
    <div ref={rootRef}>
      <div className="topnav">
        <div className="brand">
          <div className="logo">RC</div>
          <div>
            <div className="name">The Recess Club</div>
            <div className="sub">Branch Manager</div>
          </div>
          {/* <span className="wireframe-badge">Wireframe · v6</span> */}
        </div>
        <TopNavDateFilter onApply={setRange} />
        <div className="nav-right">
          <span className="scope-pill">📍 Branch A – Worli</span>
          {/* <button className="switch-btn" onClick={onSwitchRole}>Switch role</button> */}
        </div>
      </div>
      <SectionGuide sections={SECTIONS} />

      <div className="wrap">
        {/* KPI STRIP */}
        <div className="kpi-strip">
          <KpiCard
            label="Active Memberships"
            value={activeMembers}
            ctx={latestMonth ? `+${latestMonth.new} joins · –${latestMonth.expired} expiries` : '—'}
            delta={latestMonth ? `Net ${latestMonth.new - latestMonth.expired >= 0 ? '+' : ''}${latestMonth.new - latestMonth.expired} · retention ${memGap.retention}` : memGap.retention}
            onClick={() => openDrill('Active Memberships', `${activeMembers} active · plan breakdown`, activeMembersHTML())}
          />
          <KpiCard
            label="Collections (MTD)"
            value={formatINR(billing?.collection)}
            ctx={billing ? `of ${formatINR(billing.billed)} billed · ${billing.billed ? Math.round((billing.collection / billing.billed) * 100) : 0}%` : '—'}
            delta={billing ? `${formatINR(billing.pending)} pending · ${formatINR(billing.overdue)} overdue` : '—'}
            onClick={() => openDrill('Collections', 'MTD collected vs billed', collectionsHTML())}
          />
          <KpiCard
            label="Bookings"
            value={bookingSummary?.total_bookings ?? 0}
            ctx="This Month · Amenities"
            delta="—"
            onClick={() => openDrill('Bookings', 'Bookings for selected period', todayBookingsHTML())}
          />
          <KpiCard
            label="Amenity Utilisation"
            value={`${avgUtilisation}%`}
            bar={{ width: avgUtilisation }}
            delta={capacityOverview ? `${capacityOverview.available_today} amenities available today` : '—'}
            onClick={() => openDrill('Amenity Utilisation', 'Avg across active amenities', occupancyHTML())}
          />
          <KpiCard
            label="Open Tickets"
            value={openTicketsCountQ.data ?? 0}
            ctx={<span style={{ color: '#F4A0A8', fontWeight: 600 }}>{agedOver5} aged &gt;5 days</span>}
            delta="Tickets by age →"
            onClick={() => openDrill('Open Tickets', `${openTicketsCountQ.data ?? 0} open`, ticketsHTML())}
          />
          <KpiCard
            label="Upcoming Renewals"
            value={upcomingRenewalsCountQ.data ?? 0}
            ctx="Due within a year"
            delta="—"
            onClick={() => openDrill('Upcoming Renewals', `${upcomingRenewalsCountQ.data ?? 0} due`, renewalsHTML())}
          />
        </div>

        {/* BRANCH OVERVIEW */}
        <div className="section-head" id="bs-branchoverview"><div className="lbl">Branch Overview</div><div className="line" /></div>
        <div className="branch-overview">
          <div className="us-card">
            <div className="us-title">Members</div><div className="us-main">{(memberOverview?.active_members ?? 0) + (memberOverview?.inactive_members ?? 0)}</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>{memberOverview?.active_members ?? 0}</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: 'var(--error-text)', fontWeight: 700 }}>{memberOverview?.inactive_members ?? 0}</span></div>
            <div className="us-row"><span>Group Members</span><span>{groupMemberships?.members_count ?? 0}</span></div>
          </div>
          <div className="us-card">
            <div className="us-title">Guests</div><div className="us-main">{guestOverview?.guests ?? 0}</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>{guestOverview?.active ?? 0}</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: '#888', fontWeight: 700 }}>{guestOverview?.inactive ?? 0}</span></div>
            <div className="us-row"><span>New This Month</span><span>{guestOverview?.new_this_month ?? 0}</span></div>
          </div>
          <div className="us-card">
            <div className="us-title">Staff</div><div className="us-main">{staffOverview?.staff ?? 0}</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>{staffOverview?.active ?? 0}</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: '#888', fontWeight: 700 }}>{staffOverview?.inactive ?? 0}</span></div>
            <div className="us-row"><span>On Duty Today</span><span>{staffOverview?.on_duty_today ?? 0}</span></div>
          </div>
          <div className="us-card" style={{ cursor: 'pointer' }} onClick={() => openDrill('Group Memberships', `${groupMemberships?.groups_count ?? 0} groups · ${groupMemberships?.members_count ?? 0} members`, groupDrillHTML())}>
            <div className="us-title">Group Memberships</div><div className="us-main">{groupMemberships?.groups_count ?? 0}</div>
            {(groupMemberships?.groups ?? []).slice(0, 3).map((g) => (
              <div className="us-row" key={g.group_name}><span>{g.group_name}</span><span>{g.members} members</span></div>
            ))}
            {(groupMemberships?.groups?.length ?? 0) > 3 && (
              <div className="us-row"><span style={{ color: 'var(--sage)' }}>+ {groupMemberships!.groups.length - 3} more groups</span></div>
            )}
          </div>
        </div>

        {/* PAYMENTS */}
        <div className="section-head" id="bs-payments"><div className="lbl">Payments</div><div className="line" /></div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Billed (MTD)</div><div className="ms-value">{formatINR(billing?.billed)}</div><div className="ms-ctx">Month to date</div></div>
          <div className="mini-stat"><div className="ms-label">Collected</div><div className="ms-value" style={{ color: 'var(--success)' }}>{formatINR(billing?.collection)}</div><div className="ms-ctx">{billing?.billed ? Math.round((billing.collection / billing.billed) * 100) : 0}% collection efficiency</div></div>
          <div className="mini-stat"><div className="ms-label">Pending</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>{formatINR(billing?.pending)}</div><div className="ms-ctx">Month to date</div></div>
          <div className="mini-stat"><div className="ms-label">Overdue</div><div className="ms-value" style={{ color: 'var(--error-text)' }}>{formatINR(billing?.overdue)}</div><div className="ms-ctx">Aged 7+ days</div></div>
          {/* <div className="mini-stat"><div className="ms-label">Retry Success</div><div className="ms-value" style={{ color: 'var(--success)' }}>—</div><div className="ms-ctx">Not tracked yet</div></div> */}
        </div>
        <div className="grid3">
          {/* <PayChart /> */}
          {/* <CollTrendChart /> */}
          <MethodChart data={paymentMethodsQ.data ?? {}} />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          {/* <div className="card">
            <div className="card-title">Total Refund Amount</div>
            <div className="filter-bar">
              <span className="filter-lbl">Period:</span>
              {(['day', 'week', 'month', 'year'] as const).map((p) => (
                <button key={p} className={'fpill' + (refundPeriod === p ? ' active' : '')} onClick={() => setRefundPeriod(p)}>
                  {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div>
            <div className="booking-big" style={{ margin: '6px 0 3px' }}>
              <span className="bval" style={{ color: 'var(--error-text)' }}>{D.refundTotals[refundPeriod]}</span>
              <span className="blbl">total refunds</span>
            </div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>Not backed by an API yet - showing placeholder data.</div>
          </div> */}
          <CancelChart data={cancellationTrendQ.data ?? []} />
        </div>
        <div style={{ marginTop: 12 }}><div className="card">
          <div className="card-title">Pending Payments <span className="muted">{(pendingPaymentsQ.data ?? []).length} invoices</span></div>
          <table><tbody>
            <tr><th>Member</th><th>Type</th><th>Context</th><th>For</th><th>Amount</th><th>Since</th><th>Action</th></tr>
            {(pendingPaymentsQ.data ?? []).map((p, i) => (
              <tr key={i} className="clickable" onClick={() => openDrill('Pending', p.member, pendingHTML(p.member, p.type, p.context, p.for, formatINR(p.amount), p.since))}>
                <td>{p.member}</td>
                <td><span className={'badge ' + (p.type === 'Guest' ? 'b-lav' : p.type === 'Staff' ? 'b-teal' : 'b-blue')}>{p.type}</span></td>
                <td>{p.context}</td>
                <td>{p.for}</td>
                <td>{formatINR(p.amount)}</td>
                <td>{p.since}</td>
                <td><span className={'badge ' + actionBadgeClass(p.action)}>{p.action}</span></td>
              </tr>
            ))}
          </tbody></table>
        </div></div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Overdue Invoices <span className="muted">aged &gt;7 days</span></div>
            <table><tbody>
              <tr><th>Account</th><th>Amount</th><th>Aged</th><th>Action</th></tr>
              {(overdueInvoicesQ.data ?? []).map((inv, i) => (
                <tr key={i} className="clickable" onClick={() => openDrill('Overdue', inv.account, invoiceHTML(inv.account, formatINR(inv.amount), inv.aged))}>
                  <td>{inv.account}</td><td>{formatINR(inv.amount)}</td><td>{inv.aged}</td>
                  <td><span className={'badge ' + actionBadgeClass(inv.action)}>{inv.action}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          {/* <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--rc-green)' }}>{billing?.billed ? Math.round((billing.collection / billing.billed) * 100) : 0}%</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--sage)', marginTop: 4 }}>Collection Efficiency</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 6, maxWidth: 170 }}>Month to date</div>
          </div> */}
        </div>

        {/* MEMBERSHIP */}
        <div className="section-head" id="bs-membership"><div className="lbl">Membership</div><div className="line" /></div>
        <div className="active-mem-hero">
          <div className="amh-left">
            <div className="amh-label">Active Memberships</div>
            <div className="amh-value">{activeMembers}</div>
            <div className="amh-ctx">
              Selected range
              {latestMonth ? ` · Net ${latestMonth.new - latestMonth.expired >= 0 ? '+' : ''}${latestMonth.new - latestMonth.expired}` : ''} · Retention {memGap.retention}
            </div>
          </div>
          <div className="amh-stats">
            {/* <div className="amh-stat"><div className="ahs-label">New Joins</div><div className="ahs-val">{latestMonth?.new ?? 0}</div></div>
            <div className="amh-stat"><div className="ahs-label">Expiries</div><div className="ahs-val">{latestMonth?.expired ?? 0}</div></div>
            <div className="amh-stat"><div className="ahs-label">Churn Rate</div><div className="ahs-val">{memGap.churn}</div></div>
            <div className="amh-stat"><div className="ahs-label">Retention</div><div className="ahs-val">{memGap.retention}</div></div> */}
          </div>
        </div>
        {/* Membership Period pills removed - the top-nav date filter now drives this section too. */}
        {/* <div className="filter-bar" style={{ marginBottom: 12 }}>
          <span className="filter-lbl">Membership Period:</span>
          <button className={'fpill' + (memPeriod === 'month' ? ' active' : '')} onClick={() => setMemPeriod('month')}>This Month</button>
          <button className={'fpill' + (memPeriod === 'quarter' ? ' active' : '')} onClick={() => setMemPeriod('quarter')}>This Quarter</button>
          <button className={'fpill' + (memPeriod === 'year' ? ' active' : '')} onClick={() => setMemPeriod('year')}>This Year</button>
        </div> */}
        {/* <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Retention Rate</div><div className="ms-value" style={{ color: 'var(--success)' }}>{memGap.retention}</div><div className="ms-ctx">Not backed by an API yet</div></div>
          <div className="mini-stat"><div className="ms-label">Avg Tenure</div><div className="ms-value">—</div><div className="ms-ctx">Not backed by an API yet</div></div>
          <div className="mini-stat"><div className="ms-label">New Joins</div><div className="ms-value">{latestMonth?.new ?? 0}</div><div className="ms-ctx">Latest month in range</div></div>
          <div className="mini-stat"><div className="ms-label">Expiring</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>{latestMonth?.expired ?? 0}</div><div className="ms-ctx">Latest month in range</div></div>
          <div className="mini-stat"><div className="ms-label">Churn Rate</div><div className="ms-value" style={{ color: 'var(--success)' }}>{memGap.churn}</div><div className="ms-ctx">Not backed by an API yet</div></div>
        </div> */}
        <div className="grid2">
          <MemChart data={newJoinVsExpiries} />
          <PlanChart data={planDistributionQ.data ?? []} />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Active Membership Days Remaining<InfoTooltip info={getInfo('Active Membership Days Remaining')} /></div>
            <div className="chart-sub">Members with &lt;30 days remaining need a renewal nudge this week.</div>
            <table><tbody>
              <tr><th>Member</th><th>Plan</th><th>Days Left</th><th>Free Bookings</th><th>Status</th></tr>
              {(daysRemainingQ.data ?? []).map((m, i) => (
                <tr key={i} className="clickable" onClick={() => openDrill('Days Remaining', m.member_name, memberDaysHTML(m.member_name, m.plan, String(m.days_left), String(m.free_bookings)))}>
                  <td>{m.member_name}</td><td>{m.plan}</td>
                  <td><span className={daysBadgeClass(m.days_left)}>{m.days_left}</span></td>
                  <td>{m.free_bookings}</td>
                  <td><span className={'badge ' + statusBadgeClass(m.status)}>{m.status}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
          {/* <div className="card">
            <div className="card-title">Upcoming Renewals<InfoTooltip info={getInfo('Upcoming Renewals')} /></div>
            <div className="chart-sub">Memberships expiring soon. Auto-renew tracking isn't available yet.</div>
            <table><tbody>
              <tr><th>Member</th><th>Plan</th><th>Expiry</th><th>Phone</th></tr>
              {(upcomingRenewalsListQ.data ?? []).map((r, i) => (
                <tr key={i} className="clickable" onClick={() => openDrill('Renewal', r.member_name, renewalRowHTML(r.member_name, r.plan, r.expiry))}>
                  <td>{r.member_name}</td><td>{r.plan}</td><td>{r.expiry}</td><td>{r.phone}</td>
                </tr>
              ))}
            </tbody></table>
          </div> */}
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <PayPlanChart data={membershipByPaymentPlanQ.data ?? { yearly: 0, half_yearly: 0, quarterly: 0, monthly: 0 }} />
          {/* <RevPlanChart /> */}
        </div>
        {/* <div style={{ marginTop: 12 }}><div className="card">
          <div className="card-title">Group Memberships – All Active Groups<InfoTooltip info={getInfo('Group Memberships')} /></div>
          <div className="chart-sub">{groupMemberships?.groups_count ?? 0} active group plans · {groupMemberships?.members_count ?? 0} members.</div>
          <table><tbody>
            <tr><th>Group Name</th><th>Plan</th><th>Members</th><th>Payment Freq.</th><th>Expiry</th><th>Status</th></tr>
            {(groupMemberships?.groups ?? []).map((g, i) => (
              <tr key={i} className="clickable" onClick={() => openDrill(`Group: ${g.group_name}`, `${g.members} members`, groupRowHTML(g.group_name, String(g.members), g.plan, g.expiry))}>
                <td>{g.group_name}</td><td>{g.plan}</td><td>{g.members}</td><td>{g.payment_frequency}</td><td>{g.expiry}</td>
                <td><span className={'badge ' + statusBadgeClass(g.status)}>{g.status}</span></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        </div> */}

        {/* AMENITIES & BOOKINGS */}
        <div className="section-head" id="bs-amenities"><div className="lbl">Amenities & Bookings</div><div className="line" /></div>
        <div className="grid2eq">
          <div className="card">
            <div className="card-title">Total Bookings</div>
            {/* Period pills removed - the top-nav date filter now drives this card too. */}
            {/* <div className="filter-bar">
              <span className="filter-lbl">Period:</span>
              {(['day', 'week', 'month', 'year'] as const).map((p) => (
                <button key={p} className={'fpill' + (bookPeriod === p ? ' active' : '')} onClick={() => setBookPeriod(p)}>
                  {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div> */}
            <div className="booking-big"><span className="bval">{(bookingSummary?.total_bookings ?? 0).toLocaleString()}</span><span className="blbl">total bookings</span></div>
            <div className="bk-split">
              <div className="bk-seg"><div className="bsv" style={{ color: 'var(--blue)' }}>{(bookingSummary?.member ?? 0).toLocaleString()}</div><div className="bsl">Members</div></div>
              <div className="bk-seg"><div className="bsv" style={{ color: '#5850a8' }}>{(bookingSummary?.guest ?? 0).toLocaleString()}</div><div className="bsl">Guests</div></div>
              <div className="bk-seg"><div className="bsv" style={{ color: '#2d7a68' }}>{(bookingSummary?.staff ?? 0).toLocaleString()}</div><div className="bsl">Staff</div></div>
            </div>
            <div style={{ marginTop: 8 }}><AiInsightBlock ctxText="Bookings split by member type for the selected period." /></div>
          </div>
          {/* <BookTypeChart member={bookingSummary?.member ?? 0} guest={bookingSummary?.guest ?? 0} staff={bookingSummary?.staff ?? 0} /> */}
        </div>
        {/* <div className="grid2" style={{ marginTop: 12 }}>
          <AvailableSlotsHeatmap data={availableSlotsQ.data} />
          <div className="card">
            <div className="card-title">No-Shows Today<InfoTooltip info={getInfo('No-Shows Today')} /></div>
            <div className="chart-sub">Not backed by an API yet - showing placeholder data.</div>
            <table><tbody>
              <tr><th>Member</th><th>Amenity</th><th>Slot</th><th>Penalty</th></tr>
              <tr className="clickable" onClick={() => openDrill('No-Show', 'Sana Iyer', noShowHTML('Sana Iyer', 'Padel Court 2', '7-8 AM'))}><td>Sana Iyer</td><td>Padel Court 2</td><td>7-8 AM</td><td><span className="badge b-err">₹100</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('No-Show', 'Vikram Rao', noShowHTML('Vikram Rao', 'Badminton A', '6-7 PM'))}><td>Vikram Rao</td><td>Badminton A</td><td>6-7 PM</td><td><span className="badge b-err">₹100</span></td></tr>
            </tbody></table>
          </div>
        </div> */}
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <WeekdayChart data={weekdayUtilisationQ.data ?? []} />
          <LeadTimeChart data={leadTimeQ.data ?? []} />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <MonthAmenChart data={monthlyAmenityQ.data ?? []} />
          <CancelAmenChart data={cancellationByAmenityQ.data ?? []} />
        </div>

        {/* COACH & STAFF SCHEDULE (not backed by an API yet - placeholder data) */}
        {/* <div className="section-head" id="bs-coaches"><div className="lbl">Coach & Staff Schedule</div><div className="line" /></div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Coaches On Duty</div><div className="ms-value" style={{ color: 'var(--rc-green)' }}>4</div><div className="ms-ctx">Today · 2 AM · 2 PM</div></div>
          <div className="mini-stat"><div className="ms-label">Sessions Today</div><div className="ms-value">11</div><div className="ms-ctx">Across 4 amenities</div></div>
          <div className="mini-stat"><div className="ms-label">Booked Slots</div><div className="ms-value" style={{ color: 'var(--success)' }}>11</div><div className="ms-ctx">Confirmed bookings</div></div>
          <div className="mini-stat"><div className="ms-label">Unassigned Slots</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>5</div><div className="ms-ctx">Open – no coach assigned</div></div>
          <div className="mini-stat"><div className="ms-label">Amenities Covered</div><div className="ms-value">4</div><div className="ms-ctx">Padel, Gym, Badminton, CRG</div></div>
        </div>
        <div className="card">
          <div className="card-title">
            Coach Booking Schedule – Today<InfoTooltip info={getInfo('Coach Booking Schedule')} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button className={'fpill' + (coachPeriod === 'today' ? ' active' : '')} onClick={() => setCoachPeriod('today')}>Today</button>
              <button className={'fpill' + (coachPeriod === 'tomorrow' ? ' active' : '')} onClick={() => setCoachPeriod('tomorrow')}>Tomorrow</button>
              <button className={'fpill' + (coachPeriod === 'week' ? ' active' : '')} onClick={() => setCoachPeriod('week')}>This Week</button>
            </div>
          </div>
          <div className="chart-sub">{COACH_LABELS[coachPeriod]} Not backed by an API yet - showing placeholder data.</div>
          <table><tbody>
            <tr><th>Time Slot</th><th>Amenity</th><th>Coach / Staff</th><th>Session Type</th><th>Booker</th><th>Reason Type</th><th>Status</th></tr>
            <tr className="clickable" onClick={() => openDrill('Coach Slot', 'Amit Sharma – Padel 7AM', coachDrillHTML('Amit Sharma', 'Padel Court 1', '7-8 AM', 'Private Coaching', 'Rohan Shah'))}><td>7-8 AM</td><td>Padel Court 1</td><td><strong>Amit Sharma</strong></td><td>Private Coaching</td><td>Rohan Shah</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>11 AM-1 PM</td><td>Gym Floor</td><td style={{ color: '#888', fontStyle: 'italic' }}>– Unassigned –</td><td>–</td><td>Open</td><td>–</td><td><span className="badge b-warn">No Coach</span></td></tr>
          </tbody></table>
        </div> */}

        {/* CAPACITY & BLOCKS */}
        <div className="section-head" id="bs-capacity"><div className="lbl">Capacity & Blocks</div><div className="line" /></div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Total Amenities</div><div className="ms-value">{capacityOverview?.total_amenities ?? 0}</div><div className="ms-ctx">Configured</div></div>
          <div className="mini-stat"><div className="ms-label">Active</div><div className="ms-value" style={{ color: 'var(--success)' }}>{capacityOverview?.active_amenities ?? 0}</div><div className="ms-ctx">Bookable</div></div>
          <div className="mini-stat"><div className="ms-label">Available Today</div><div className="ms-value" style={{ color: 'var(--success)' }}>{capacityOverview?.available_today ?? 0}</div><div className="ms-ctx">Not blocked today</div></div>
          <div className="mini-stat"><div className="ms-label">Blocked Slot-Days (MTM)</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>{capacityOverview?.blocked_slot_days_mtm ?? 0}</div><div className="ms-ctx">This month</div></div>
          <div className="mini-stat"><div className="ms-label">Advance Window</div><div className="ms-value">{capacityOverview?.advance_window ?? '—'}</div><div className="ms-ctx">Varies by amenity</div></div>
        </div>
        <div className="grid2eq">
          <CapacityAnalysisCard data={amenityUtilization} />
          <div className="card">
            <div className="card-title">Cancelled Bookings – This Month <span className="muted">{(cancelledBookingsQ.data ?? []).length} total</span></div>
            <table><tbody>
              <tr><th>Member</th><th>Type</th><th>Amenity</th><th>Slot</th><th>Reason</th></tr>
              {(cancelledBookingsQ.data ?? []).map((c, i) => (
                <tr key={i} className="clickable" onClick={() => openDrill('Cancel', c.member, cancelHTML(c.member, c.type, c.amenity, c.slot, c.reason))}>
                  <td>{c.member}</td>
                  <td><span className={'badge ' + (c.type === 'Guest' ? 'b-lav' : c.type === 'Staff' ? 'b-teal' : 'b-blue')}>{c.type}</span></td>
                  <td>{c.amenity}</td><td>{c.slot}</td><td>{c.reason}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Blocked Days by Amenity</div>
            <table><tbody>
              <tr><th>Amenity</th><th>Type</th><th>Blocked Days</th><th>Reason Type</th><th>Status</th></tr>
              {(blockedByAmenityQ.data ?? []).map((b, i) => (
                <tr key={i}><td>{b.amenity}</td><td>{b.type}</td><td>{b.blocked_days}</td><td>{b.reason}</td><td><span className={'badge ' + statusBadgeClass(b.status)}>{b.status}</span></td></tr>
              ))}
            </tbody></table>
          </div>
          <div className="card">
            <div className="card-title">Blocked Slots by Amenity</div>
            <table><tbody>
              <tr><th>Amenity</th><th>Blocked Slots</th><th>Peak Impact</th><th>Reason Type</th><th>Status</th></tr>
              {(blockedSlotsByAmenityQ.data ?? []).map((b, i) => (
                <tr key={i}><td>{b.amenity}</td><td>{b.blocked_slots}</td><td><span className={'badge ' + statusBadgeClass(b.peak_impact)}>{b.peak_impact}</span></td><td>{b.reason}</td><td><span className={'badge ' + statusBadgeClass(b.status)}>{b.status}</span></td></tr>
              ))}
            </tbody></table>
          </div>
        </div>

        {/* TICKETS */}
        <div className="section-head" id="bs-tickets"><div className="lbl">Tickets</div><div className="line" /></div>
        <div className="grid2eq">
          <TicketChart data={openTicketsByAge} />
          <TicketCatChart data={ticketCategoryQ.data ?? []} />
        </div>

        {/* EVENTS */}
        <div className="section-head" id="bs-events"><div className="lbl">Events</div><div className="line" /></div>
        <div className="grid2">
          <div className="card">
            <div className="card-title">Registration Fill Rate – Upcoming Events<InfoTooltip info={getInfo('Registration Fill Rate')} /></div>
            <table><tbody>
              <tr><th>Event</th><th>Date</th><th>Type</th><th>Fill Rate</th><th>Seats</th></tr>
              {(registrationFillRateQ.data ?? []).map((ev, i) => {
                const pct = parseFloat(ev.fill_rate) || 0;
                const barColor = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--sage)' : 'var(--error)';
                return (
                  <tr key={i} className="clickable" onClick={() => openDrill(ev.event, `${ev.date} · ${ev.type}`, eventHTML(ev.event, ev.seats, ev.fill_rate))}>
                    <td>{ev.event}</td><td>{ev.date}</td>
                    <td><span className={'badge ' + (ev.type === 'Paid' ? 'b-ok' : 'b-warn')}>{ev.type}</span></td>
                    <td><div className="progress"><div style={{ width: `${pct}%`, background: barColor }} /></div> {ev.fill_rate}</td>
                    <td>{ev.seats}</td>
                  </tr>
                );
              })}
            </tbody></table>
          </div>
          <EventTrendChart data={eventTrendQ.data ?? []} />
        </div>
      </div>
    </div>
  );
};
