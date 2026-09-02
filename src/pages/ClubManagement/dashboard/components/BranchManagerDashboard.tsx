import React, { useState } from 'react';
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
import { D, getInfo, type MemPeriodKey, type BookPeriodKey, type RefundPeriodKey } from '../clubDashboardData';
import {
  activeMembersHTML, todayBookingsHTML, collectionsHTML, ticketsHTML, renewalsHTML, renewalRowHTML,
  noShowHTML, invoiceHTML, eventHTML, groupDrillHTML, groupRowHTML, memberDaysHTML, cancelHTML,
  pendingHTML, coachDrillHTML, occupancyHTML,
} from '../drillTemplates';

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

export const BranchManagerDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const { openDrill } = useDrill();
  const [memPeriod, setMemPeriod] = useState<MemPeriodKey>('month');
  const [bookPeriod, setBookPeriod] = useState<BookPeriodKey>('month');
  const [refundPeriod, setRefundPeriod] = useState<RefundPeriodKey>('day');
  const [coachPeriod, setCoachPeriod] = useState<'today' | 'tomorrow' | 'week'>('today');

  const mem = D.memPeriod[memPeriod];
  const book = D.bookTotals[bookPeriod];

  return (
    <div>
      <div className="topnav">
        <div className="brand">
          <div className="logo">RC</div>
          <div>
            <div className="name">The Recess Club</div>
            <div className="sub">Branch Manager</div>
          </div>
          {/* <span className="wireframe-badge">Wireframe · v6</span> */}
        </div>
        <TopNavDateFilter />
        <div className="nav-right">
          <span className="scope-pill">📍 Branch A – Worli</span>
          {/* <button className="switch-btn" onClick={onSwitchRole}>Switch role</button> */}
        </div>
      </div>
      <SectionGuide sections={SECTIONS} />

      <div className="wrap">
        {/* KPI STRIP */}
        <div className="kpi-strip">
          <KpiCard label="Active Memberships" value={238} ctx="+14 joins · –6 expiries" delta="Net +8 · retention 96.8%" onClick={() => openDrill('Active Memberships', '238 active · plan breakdown', activeMembersHTML())} />
          <KpiCard label="Collections (MTD)" value="₹4.2L" ctx="of ₹5.1L billed · 82%" delta="₹38K pending · ₹12K overdue" onClick={() => openDrill('Collections', 'MTD collected vs billed', collectionsHTML())} />
          <KpiCard label="Bookings" value={480} ctx="This Month · 5 amenities" delta="14 cancellations this month" onClick={() => openDrill('Bookings', 'Bookings for selected period', todayBookingsHTML())} />
          <KpiCard label="Amenity Utilisation" value="68%" bar={{ width: 68 }} delta="5 slots available now" onClick={() => openDrill('Amenity Utilisation', 'Avg across active amenities', occupancyHTML())} />
          <KpiCard label="Open Tickets" value={11} ctx={<span style={{ color: '#F4A0A8', fontWeight: 600 }}>3 aged &gt;5 days</span>} delta="Tickets by age →" onClick={() => openDrill('Open Tickets', '11 open · 3 aged >5 days', ticketsHTML())} />
          <KpiCard label="Upcoming Renewals" value={9} ctx="2 on payment retry" delta="₹38K at risk" onClick={() => openDrill('Upcoming Renewals', '9 due · 2 payment-failed', renewalsHTML())} />
        </div>

        {/* BRANCH OVERVIEW */}
        <div className="section-head" id="bs-branchoverview"><div className="lbl">Branch Overview</div><div className="line" /></div>
        <div className="branch-overview">
          <div className="us-card">
            <div className="us-title">Members</div><div className="us-main">250</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>238</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: 'var(--error-text)', fontWeight: 700 }}>12</span></div>
            <div className="us-row"><span>Group Members</span><span>22</span></div>
          </div>
          <div className="us-card">
            <div className="us-title">Guests</div><div className="us-main">65</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>47</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: '#888', fontWeight: 700 }}>18</span></div>
            <div className="us-row"><span>New This Month</span><span>9</span></div>
          </div>
          <div className="us-card">
            <div className="us-title">Staff</div><div className="us-main">15</div>
            <div className="us-row"><span>Active</span><span style={{ color: 'var(--success)', fontWeight: 700 }}>12</span></div>
            <div className="us-row"><span>Inactive</span><span style={{ color: '#888', fontWeight: 700 }}>3</span></div>
            <div className="us-row"><span>On Duty Today</span><span>8</span></div>
          </div>
          <div className="us-card" style={{ cursor: 'pointer' }} onClick={() => openDrill('Group Memberships', '4 groups · 22 members', groupDrillHTML())}>
            <div className="us-title">Group Memberships</div><div className="us-main">4</div>
            <div className="us-row"><span>Full DY MEM</span><span>3 members</span></div>
            <div className="us-row"><span>Special Summer</span><span>4 members</span></div>
            <div className="us-row"><span>Cricket Group</span><span>4 members</span></div>
            <div className="us-row"><span style={{ color: 'var(--sage)' }}>+ 2 more groups</span><span style={{ color: 'var(--sage)' }}>11</span></div>
          </div>
        </div>

        {/* PAYMENTS */}
        <div className="section-head" id="bs-payments"><div className="lbl">Payments</div><div className="line" /></div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Billed (MTD)</div><div className="ms-value">₹5.1L</div><div className="ms-ctx">Forecast ₹6.0L full month</div></div>
          <div className="mini-stat"><div className="ms-label">Collected</div><div className="ms-value" style={{ color: 'var(--success)' }}>₹4.2L</div><div className="ms-ctx">82% collection efficiency</div></div>
          <div className="mini-stat"><div className="ms-label">Pending</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>₹38K</div><div className="ms-ctx">8 invoices · avg 4 days aged</div></div>
          <div className="mini-stat"><div className="ms-label">Overdue</div><div className="ms-value" style={{ color: 'var(--error-text)' }}>₹12K</div><div className="ms-ctx">2 invoices · aged &gt;7 days</div></div>
          <div className="mini-stat"><div className="ms-label">Retry Success</div><div className="ms-value" style={{ color: 'var(--success)' }}>71%</div><div className="ms-ctx">5 of 7 retries converted</div></div>
        </div>
        <div className="grid3">
          <PayChart />
          <CollTrendChart />
          <MethodChart />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
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
            <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>{D.refundCtx[refundPeriod]}</div>
            <table><tbody>
              <tr><th>Member</th><th>Amenity</th><th>Amount</th><th>Date</th></tr>
              <tr><td>Rohan Shah</td><td>Padel Court 1</td><td>₹600</td><td>29 Jun</td></tr>
              <tr><td>Guest A</td><td>All Day Pass</td><td>₹500</td><td>25 Jun</td></tr>
              <tr><td>Ira Joshi</td><td>Badminton A</td><td>₹400</td><td>20 Jun</td></tr>
            </tbody></table>
          </div>
          <CancelChart />
        </div>
        <div style={{ marginTop: 12 }}><div className="card">
          <div className="card-title">Pending Payments <span className="muted">8 invoices · ₹38,000 total</span></div>
          <table><tbody>
            <tr><th>Member</th><th>Type</th><th>Plan</th><th>For</th><th>Amount</th><th>Since</th><th>Action</th></tr>
            <tr className="clickable" onClick={() => openDrill('Pending', 'Rohan Sharma', pendingHTML('Rohan Sharma', 'Member', 'Annual', 'Renewal', '₹6,000', '3 days'))}><td>Rohan Sharma</td><td><span className="badge b-blue">Member</span></td><td>Annual</td><td>Renewal</td><td>₹6,000</td><td>3d</td><td><span className="badge b-warn">Remind</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Pending', 'Priya Kapoor', pendingHTML('Priya Kapoor', 'Member', 'Quarterly', 'Renewal', '₹2,000', '1 day'))}><td>Priya Kapoor</td><td><span className="badge b-blue">Member</span></td><td>Quarterly</td><td>Renewal</td><td>₹2,000</td><td>1d</td><td><span className="badge b-ok">New</span></td></tr>
            <tr><td>Guest A</td><td><span className="badge b-lav">Guest</span></td><td>Day Pass</td><td>Booking fee</td><td>₹500</td><td>5d</td><td><span className="badge b-err">Escalate</span></td></tr>
            <tr><td>Neha Patil</td><td><span className="badge b-blue">Member</span></td><td>Monthly</td><td>Renewal</td><td>₹700</td><td>2d</td><td><span className="badge b-warn">Remind</span></td></tr>
            <tr><td>Karan Desai</td><td><span className="badge b-blue">Member</span></td><td>Annual</td><td>Amenity fee</td><td>₹1,200</td><td>4d</td><td><span className="badge b-warn">Remind</span></td></tr>
            <tr><td>Guest B</td><td><span className="badge b-lav">Guest</span></td><td>Day Pass</td><td>Booking fee</td><td>₹500</td><td>6d</td><td><span className="badge b-err">Escalate</span></td></tr>
            <tr><td>Sana Iyer</td><td><span className="badge b-blue">Member</span></td><td>Quarterly</td><td>Instalment</td><td>₹2,000</td><td>1d</td><td><span className="badge b-ok">New</span></td></tr>
            <tr><td>Staff D</td><td><span className="badge b-teal">Staff</span></td><td>Staff Plan</td><td>Amenity fee</td><td>₹400</td><td>3d</td><td><span className="badge b-warn">Remind</span></td></tr>
          </tbody></table>
          <div className="note">2 guest invoices aged &gt;5 days – no auto-retry for guest accounts. Manual escalation required.</div>
        </div></div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Overdue Invoices <span className="muted">aged &gt;7 days</span></div>
            <table><tbody>
              <tr><th>Account</th><th>Amount</th><th>Aged</th><th>Action</th></tr>
              <tr className="clickable" onClick={() => openDrill('Overdue', 'Member Account A', invoiceHTML('Member Account A', '₹1,000', '12 days'))}><td>Member Account A</td><td>₹1,000</td><td>12d</td><td><span className="badge b-err">Escalate</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Overdue', 'Member Account B', invoiceHTML('Member Account B', '₹500', '9 days'))}><td>Member Account B</td><td>₹500</td><td>9d</td><td><span className="badge b-warn">Remind</span></td></tr>
            </tbody></table>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--rc-green)' }}>82%</div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--sage)', marginTop: 4 }}>Collection Efficiency</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 6, maxWidth: 170 }}>vs 80% branch target · up from 76% six months ago</div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#555' }}>5 of 7 payment retries successful this month</div>
          </div>
        </div>

        {/* MEMBERSHIP */}
        <div className="section-head" id="bs-membership"><div className="lbl">Membership</div><div className="line" /></div>
        <div className="active-mem-hero">
          <div className="amh-left">
            <div className="amh-label">Active Memberships</div>
            <div className="amh-value">{mem.active}</div>
            <div className="amh-ctx">{memPeriod === 'month' ? 'This Month' : memPeriod === 'quarter' ? 'This Quarter' : 'This Year'} · Net +{mem.joins - mem.expiry} · Retention {mem.retention}</div>
          </div>
          <div className="amh-stats">
            <div className="amh-stat"><div className="ahs-label">New Joins</div><div className="ahs-val">{mem.joins}</div></div>
            <div className="amh-stat"><div className="ahs-label">Expiries</div><div className="ahs-val">{mem.expiry}</div></div>
            <div className="amh-stat"><div className="ahs-label">Churn Rate</div><div className="ahs-val">{mem.churn}</div></div>
            <div className="amh-stat"><div className="ahs-label">Retention</div><div className="ahs-val">{mem.retention}</div></div>
          </div>
        </div>
        <div className="filter-bar" style={{ marginBottom: 12 }}>
          <span className="filter-lbl">Membership Period:</span>
          <button className={'fpill' + (memPeriod === 'month' ? ' active' : '')} onClick={() => setMemPeriod('month')}>This Month</button>
          <button className={'fpill' + (memPeriod === 'quarter' ? ' active' : '')} onClick={() => setMemPeriod('quarter')}>This Quarter</button>
          <button className={'fpill' + (memPeriod === 'year' ? ' active' : '')} onClick={() => setMemPeriod('year')}>This Year</button>
        </div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Retention Rate</div><div className="ms-value" style={{ color: 'var(--success)' }}>{mem.retention}</div><div className="ms-ctx">{mem.retCtx}</div></div>
          <div className="mini-stat"><div className="ms-label">Avg Tenure</div><div className="ms-value">14.2 mo</div><div className="ms-ctx">up from 13.6 last quarter</div></div>
          <div className="mini-stat"><div className="ms-label">New Joins</div><div className="ms-value">{mem.joins}</div><div className="ms-ctx">{mem.newCtx}</div></div>
          <div className="mini-stat"><div className="ms-label">Expiring</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>{mem.expiry}</div><div className="ms-ctx">{mem.expCtx}</div></div>
          <div className="mini-stat"><div className="ms-label">Churn Rate</div><div className="ms-value" style={{ color: 'var(--success)' }}>{mem.churn}</div><div className="ms-ctx">below 3% target ✓</div></div>
        </div>
        <div className="grid2">
          <MemChart />
          <PlanChart />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Active Membership Days Remaining<InfoTooltip info={getInfo('Active Membership Days Remaining')} /></div>
            <div className="chart-sub">Members with &lt;30 days remaining need a renewal nudge this week.</div>
            <table><tbody>
              <tr><th>Member</th><th>Plan</th><th>Days Left</th><th>Free Bookings</th><th>Status</th></tr>
              <tr className="clickable" onClick={() => openDrill('Days Remaining', 'Neha Patil', memberDaysHTML('Neha Patil', 'Monthly', '12', '2'))}><td>Neha Patil</td><td>Monthly</td><td><span className="days-err">12</span></td><td>2</td><td><span className="badge b-err">Expiring soon</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Days Remaining', 'Priya Kapoor', memberDaysHTML('Priya Kapoor', 'Quarterly', '45', '5'))}><td>Priya Kapoor</td><td>Quarterly</td><td><span className="days-warn">45</span></td><td>5</td><td><span className="badge b-warn">Renewal due</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Days Remaining', 'Rohan Shah', memberDaysHTML('Rohan Shah', 'Family', '103', 'Unlimited'))}><td>Rohan Shah</td><td>Family</td><td><span className="days-ok">103</span></td><td>Unlimited</td><td><span className="badge b-ok">Active</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Days Remaining', 'Karan Desai', memberDaysHTML('Karan Desai', 'Annual', '218', 'Unlimited'))}><td>Karan Desai</td><td>Annual</td><td><span className="days-ok">218</span></td><td>Unlimited</td><td><span className="badge b-ok">Active</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Days Remaining', 'Aarav Mehta', memberDaysHTML('Aarav Mehta', 'Annual', '284', 'Unlimited'))}><td>Aarav Mehta</td><td>Annual</td><td><span className="days-ok">284</span></td><td>Unlimited</td><td><span className="badge b-ok">Active</span></td></tr>
            </tbody></table>
            <div className="note">2 members expiring within 30 days. Send renewal reminders now.</div>
          </div>
          <div className="card">
            <div className="card-title">Upcoming Renewals – This Month<InfoTooltip info={getInfo('Upcoming Renewals')} /></div>
            <div className="chart-sub">6 memberships expire in July. 4 auto-renew; 2 need manual follow-up.</div>
            <table><tbody>
              <tr><th>Member</th><th>Plan</th><th>Expiry</th><th>Phone</th><th>Auto-Renew</th></tr>
              <tr className="clickable" onClick={() => openDrill('Renewal', 'Aarav Mehta', renewalRowHTML('Aarav Mehta', 'Annual', 'Retry D3'))}><td>Aarav Mehta</td><td>Annual</td><td>2 Jul</td><td>98XX-XXXXX</td><td><span className="badge b-warn">Retry D3</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('Renewal', 'Priya Kapoor', renewalRowHTML('Priya Kapoor', 'Quarterly', 'Retry D1'))}><td>Priya Kapoor</td><td>Quarterly</td><td>1 Jul</td><td>91XX-XXXXX</td><td><span className="badge b-warn">Retry D1</span></td></tr>
              <tr><td>Rohan Shah</td><td>Family</td><td>3 Jul</td><td>90XX-XXXXX</td><td><span className="badge b-ok">Auto ✓</span></td></tr>
              <tr><td>Neha Patil</td><td>Monthly</td><td>4 Jul</td><td>88XX-XXXXX</td><td><span className="badge b-ok">Auto ✓</span></td></tr>
              <tr><td>Karan Desai</td><td>Annual</td><td>5 Jul</td><td>77XX-XXXXX</td><td><span className="badge b-ok">Auto ✓</span></td></tr>
              <tr><td>Sana Iyer</td><td>Quarterly</td><td>15 Jul</td><td>99XX-XXXXX</td><td><span className="badge b-ok">Auto ✓</span></td></tr>
            </tbody></table>
          </div>
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <PayPlanChart />
          <RevPlanChart />
        </div>
        <div style={{ marginTop: 12 }}><div className="card">
          <div className="card-title">Group Memberships – All Active Groups<InfoTooltip info={getInfo('Group Memberships')} /></div>
          <div className="chart-sub">4 active group plans · 22 members · 94% renewal rate vs 87% for individual plans.</div>
          <table><tbody>
            <tr><th>Group Name</th><th>Plan</th><th>Members</th><th>Payment Freq.</th><th>Expiry</th><th>Status</th></tr>
            <tr className="clickable" onClick={() => openDrill('Group: Full DY MEM', '3 members', groupRowHTML('Full DY MEM', '3', 'Annual', 'Dec 2026'))}><td>Full DY MEM Group</td><td>Full DY MEM</td><td>3</td><td>Yearly</td><td>Dec 2026</td><td><span className="badge b-ok">Active</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Group: Special Summer', '4 members', groupRowHTML('Special Summer', '4', 'Quarterly', 'Sep 2026'))}><td>Special Summer Group</td><td>Special Summer Plan</td><td>4</td><td>Quarterly</td><td>Sep 2026</td><td><span className="badge b-ok">Active</span></td></tr>
            <tr><td>SPC Group</td><td>SPC Membership</td><td>3</td><td>Quarterly</td><td>Sep 2026</td><td><span className="badge b-ok">Active</span></td></tr>
            <tr><td>Cricket Group</td><td>Cricket Plan</td><td>4</td><td>Quarterly</td><td>Oct 2026</td><td><span className="badge b-ok">Active</span></td></tr>
            <tr><td>DY Corporate Group</td><td>Corporate Plan</td><td>8</td><td>Yearly</td><td>Mar 2027</td><td><span className="badge b-ok">Active</span></td></tr>
          </tbody></table>
        </div></div>

        {/* AMENITIES & BOOKINGS */}
        <div className="section-head" id="bs-amenities"><div className="lbl">Amenities & Bookings</div><div className="line" /></div>
        <div className="grid2eq">
          <div className="card">
            <div className="card-title">Total Bookings</div>
            <div className="filter-bar">
              <span className="filter-lbl">Period:</span>
              {(['day', 'week', 'month', 'year'] as const).map((p) => (
                <button key={p} className={'fpill' + (bookPeriod === p ? ' active' : '')} onClick={() => setBookPeriod(p)}>
                  {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'This Year'}
                </button>
              ))}
            </div>
            <div className="booking-big"><span className="bval">{book.total.toLocaleString()}</span><span className="blbl">total bookings</span></div>
            <div className="bk-split">
              <div className="bk-seg"><div className="bsv" style={{ color: 'var(--blue)' }}>{book.member.toLocaleString()}</div><div className="bsl">Members</div></div>
              <div className="bk-seg"><div className="bsv" style={{ color: '#5850a8' }}>{book.guest.toLocaleString()}</div><div className="bsl">Guests</div></div>
              <div className="bk-seg"><div className="bsv" style={{ color: '#2d7a68' }}>{book.staff.toLocaleString()}</div><div className="bsl">Staff</div></div>
            </div>
            <div style={{ marginTop: 8 }}><AiInsightBlock ctxText="Monthly bookings split by member type for the selected period." /></div>
          </div>
          <BookTypeChart member={book.member} guest={book.guest} staff={book.staff} />
        </div>
        <div className="grid2" style={{ marginTop: 12 }}>
          <AvailableSlotsHeatmap />
          <div className="card">
            <div className="card-title">No-Shows Today<InfoTooltip info={getInfo('No-Shows Today')} /></div>
            <div className="chart-sub">3 no-shows · penalty applied · rate down from 11% last week.</div>
            <table><tbody>
              <tr><th>Member</th><th>Amenity</th><th>Slot</th><th>Penalty</th></tr>
              <tr className="clickable" onClick={() => openDrill('No-Show', 'Sana Iyer', noShowHTML('Sana Iyer', 'Padel Court 2', '7-8 AM'))}><td>Sana Iyer</td><td>Padel Court 2</td><td>7-8 AM</td><td><span className="badge b-err">₹100</span></td></tr>
              <tr className="clickable" onClick={() => openDrill('No-Show', 'Vikram Rao', noShowHTML('Vikram Rao', 'Badminton A', '6-7 PM'))}><td>Vikram Rao</td><td>Badminton A</td><td>6-7 PM</td><td><span className="badge b-err">₹100</span></td></tr>
              <tr><td>Ira Joshi</td><td>Gym Floor</td><td>9-10 AM</td><td><span className="badge b-err">₹100</span></td></tr>
            </tbody></table>
            <div className="note">No-show rate 8.4% – down from 11% last week. Penalty policy working.</div>
          </div>
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <WeekdayChart />
          <LeadTimeChart />
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <MonthAmenChart />
          <CancelAmenChart />
        </div>

        {/* COACH & STAFF SCHEDULE */}
        <div className="section-head" id="bs-coaches"><div className="lbl">Coach & Staff Schedule</div><div className="line" /></div>
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
          <div className="chart-sub">{COACH_LABELS[coachPeriod]}</div>
          <table><tbody>
            <tr><th>Time Slot</th><th>Amenity</th><th>Coach / Staff</th><th>Session Type</th><th>Booker</th><th>Reason Type</th><th>Status</th></tr>
            <tr className="clickable" onClick={() => openDrill('Coach Slot', 'Amit Sharma – Padel 7AM', coachDrillHTML('Amit Sharma', 'Padel Court 1', '7-8 AM', 'Private Coaching', 'Rohan Shah'))}><td>7-8 AM</td><td>Padel Court 1</td><td><strong>Amit Sharma</strong></td><td>Private Coaching</td><td>Rohan Shah</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Coach Slot', 'Priya Nair – Gym 8AM', coachDrillHTML('Priya Nair', 'Gym Floor', '8-9 AM', 'Pilates', 'Group · 8 participants'))}><td>8-9 AM</td><td>Gym Floor</td><td><strong>Priya Nair</strong></td><td>Pilates</td><td>Group · 8 participants</td><td><span className="badge b-teal">Group</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Coach Slot', 'Karan Das – Padel 8AM', coachDrillHTML('Karan Das', 'Padel Court 1', '8-9 AM', 'Group Session', 'Group · 4 participants'))}><td>8-9 AM</td><td>Padel Court 1</td><td><strong>Karan Das</strong></td><td>Group Session</td><td>Group · 4 participants</td><td><span className="badge b-teal">Group</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Coach Slot', 'Vikram Iyer – Badminton 9AM', coachDrillHTML('Vikram Iyer', 'Badminton A', '9-10 AM', 'Coaching', 'Sana Iyer'))}><td>9-10 AM</td><td>Badminton A</td><td><strong>Vikram Iyer</strong></td><td>Coaching</td><td>Sana Iyer</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>10-11 AM</td><td>Gym Floor</td><td><strong>Priya Nair</strong></td><td>Yoga</td><td>Group · 6 participants</td><td><span className="badge b-teal">Group</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>10-11 AM</td><td>CRG FL Court</td><td><strong>Amit Sharma</strong></td><td>Advanced Training</td><td>Karan Desai</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>11 AM-1 PM</td><td>Gym Floor</td><td style={{ color: '#888', fontStyle: 'italic' }}>– Unassigned –</td><td>–</td><td>Open</td><td>–</td><td><span className="badge b-warn">No Coach</span></td></tr>
            <tr><td>6-7 PM</td><td>Padel Court 1</td><td><strong>Amit Sharma</strong></td><td>Evening Session</td><td>Ira Joshi</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>6-7 PM</td><td>Gym Floor</td><td><strong>Sana Mehta</strong></td><td>Zumba</td><td>Group · 12 participants</td><td><span className="badge b-teal">Group</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>7-8 PM</td><td>Badminton A</td><td><strong>Vikram Iyer</strong></td><td>Coaching</td><td>Guest A</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>7-8 PM</td><td>Gym Floor</td><td><strong>Priya Nair</strong></td><td>Pilates</td><td>Group · 9 participants</td><td><span className="badge b-teal">Group</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>8-9 PM</td><td>Padel Court 1</td><td><strong>Karan Das</strong></td><td>Private Coaching</td><td>Neha Patil</td><td><span className="badge b-blue">Private</span></td><td><span className="badge b-ok">Confirmed</span></td></tr>
            <tr><td>8-10 PM</td><td>Badminton A</td><td style={{ color: '#888', fontStyle: 'italic' }}>– Unassigned –</td><td>–</td><td>Open</td><td>–</td><td><span className="badge b-warn">No Coach</span></td></tr>
          </tbody></table>
          <div className="note">5 unassigned slots today. Consider assigning Priya Nair to the 11 AM-1 PM Gym window – she is free between her 10 AM and 6 PM sessions.</div>
        </div>

        {/* CAPACITY & BLOCKS */}
        <div className="section-head" id="bs-capacity"><div className="lbl">Capacity & Blocks</div><div className="line" /></div>
        <div className="mini-stats">
          <div className="mini-stat"><div className="ms-label">Total Amenities</div><div className="ms-value">9</div><div className="ms-ctx">Configured (IDs 73-81)</div></div>
          <div className="mini-stat"><div className="ms-label">Active</div><div className="ms-value" style={{ color: 'var(--success)' }}>7</div><div className="ms-ctx">2 inactive</div></div>
          <div className="mini-stat"><div className="ms-label">Available Today</div><div className="ms-value" style={{ color: 'var(--success)' }}>5</div><div className="ms-ctx">Kabaddi + Chess blocked</div></div>
          <div className="mini-stat"><div className="ms-label">Blocked Slot-Days (MTM)</div><div className="ms-value" style={{ color: 'var(--warning-text)' }}>18</div><div className="ms-ctx">Across all amenities</div></div>
          <div className="mini-stat"><div className="ms-label">Advance Window</div><div className="ms-value">30-60d</div><div className="ms-ctx">Varies by amenity</div></div>
        </div>
        <div className="grid2eq">
          <CapacityAnalysisCard />
          <div className="card">
            <div className="card-title">Cancelled Bookings – This Month <span className="muted">14 total</span></div>
            <div className="chart-sub">All Day Pass contributes 36% of cancellations despite 12% of bookings.</div>
            <table><tbody>
              <tr><th>Member</th><th>Type</th><th>Amenity</th><th>Slot</th><th>Reason</th></tr>
              <tr className="clickable" onClick={() => openDrill('Cancel', 'Rohan Shah', cancelHTML('Rohan Shah', 'Member', 'Padel Court 1', '29 Jun 8AM', 'Member initiated'))}><td>Rohan Shah</td><td><span className="badge b-blue">Member</span></td><td>Padel Court 1</td><td>29 Jun 8AM</td><td>Member</td></tr>
              <tr className="clickable" onClick={() => openDrill('Cancel', 'Guest A', cancelHTML('Guest A', 'Guest', 'All Day Pass', '28 Jun', 'Last-minute'))}><td>Guest A</td><td><span className="badge b-lav">Guest</span></td><td>All Day Pass</td><td>28 Jun</td><td>Last-minute</td></tr>
              <tr><td>Ira Joshi</td><td><span className="badge b-blue">Member</span></td><td>Gym Floor</td><td>27 Jun 6AM</td><td>Member</td></tr>
              <tr><td>Guest B</td><td><span className="badge b-lav">Guest</span></td><td>All Day Pass</td><td>26 Jun</td><td>Last-minute</td></tr>
              <tr><td>Staff C</td><td><span className="badge b-teal">Staff</span></td><td>Badminton A</td><td>25 Jun 7PM</td><td>Rescheduled</td></tr>
            </tbody></table>
          </div>
        </div>
        <div className="grid2eq" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-title">Blocked Days by Amenity</div>
            <div className="chart-sub">Kabaddi has the most blocked days (3) – overlapping peak periods.</div>
            <table><tbody>
              <tr><th>Amenity</th><th>Type</th><th>Blocked Days</th><th>Reason Type</th><th>Status</th></tr>
              <tr><td>Padel Court 1</td><td>Bookable</td><td><span className="days-warn">2</span></td><td>Court Resurfacing</td><td><span className="badge b-warn">Planned</span></td></tr>
              <tr><td>CRG FL Court</td><td>Bookable</td><td>1</td><td>Maintenance</td><td><span className="badge b-warn">Planned</span></td></tr>
              <tr><td>Badminton Court A</td><td>Bookable</td><td>0</td><td>–</td><td><span className="badge b-ok">Open</span></td></tr>
              <tr><td>Gym Floor</td><td>Bookable</td><td>0</td><td>–</td><td><span className="badge b-ok">Open</span></td></tr>
              <tr><td>Kabaddi Court</td><td>Bookable</td><td><span className="days-err">3</span></td><td>Maintenance</td><td><span className="badge b-err">Emergency</span></td></tr>
              <tr><td>Chess Court</td><td>Bookable</td><td>1</td><td>Event Setup</td><td><span className="badge b-green">Scheduled</span></td></tr>
              <tr><td>All Day Pass</td><td>Bookable</td><td>0</td><td>–</td><td><span className="badge b-ok">Open</span></td></tr>
            </tbody></table>
            <div className="note">Padel Court 1 block overlaps peak morning slots – reschedule to mid-day to recover ~₹9,600 in lost revenue.</div>
          </div>
          <div className="card">
            <div className="card-title">Blocked Slots by Amenity</div>
            <div className="chart-sub">Gym has 6 blocked slots – equipment service during off-peak hours.</div>
            <table><tbody>
              <tr><th>Amenity</th><th>Blocked Slots</th><th>Peak Impact</th><th>Reason Type</th><th>Status</th></tr>
              <tr><td>Padel Court 1</td><td><span className="days-err">8</span></td><td><span className="badge b-err">High</span></td><td>Court Resurfacing</td><td><span className="badge b-warn">Planned</span></td></tr>
              <tr><td>CRG FL Court</td><td>3</td><td><span className="badge b-warn">Medium</span></td><td>Maintenance</td><td><span className="badge b-warn">Planned</span></td></tr>
              <tr><td>Badminton Court A</td><td>4</td><td><span className="badge b-warn">Medium</span></td><td>Maintenance</td><td><span className="badge b-warn">Planned</span></td></tr>
              <tr><td>Gym Floor</td><td><span className="days-warn">6</span></td><td><span className="badge b-ok">Low</span></td><td>Equipment Service</td><td><span className="badge b-green">Scheduled</span></td></tr>
              <tr><td>Kabaddi Court</td><td>0</td><td><span className="badge b-ok">None</span></td><td>–</td><td><span className="badge b-ok">Open</span></td></tr>
              <tr><td>All Day Pass</td><td>0</td><td><span className="badge b-ok">None</span></td><td>–</td><td><span className="badge b-ok">Open</span></td></tr>
            </tbody></table>
          </div>
        </div>

        {/* TICKETS */}
        <div className="section-head" id="bs-tickets"><div className="lbl">Tickets</div><div className="line" /></div>
        <div className="grid2eq">
          <TicketChart />
          <TicketCatChart />
        </div>

        {/* EVENTS */}
        <div className="section-head" id="bs-events"><div className="lbl">Events</div><div className="line" /></div>
        <div className="grid2">
          <div className="card">
            <div className="card-title">Registration Fill Rate – Upcoming Events<InfoTooltip info={getInfo('Registration Fill Rate')} /></div>
            <div className="chart-sub">Cricket Event at 88% fill with 2 days to go – near sellout.</div>
            <table><tbody>
              <tr><th>Event</th><th>Date</th><th>Type</th><th>Fill Rate</th><th>Seats</th></tr>
              <tr className="clickable" onClick={() => openDrill('Cricket Event', '1 July · ₹222/seat', eventHTML('Cricket Event', '35/40', '₹7,770'))}><td>Cricket Event</td><td>1 Jul</td><td><span className="badge b-ok">Paid</span></td><td><div className="progress"><div style={{ width: '88%', background: 'var(--success)' }} /></div> 88%</td><td>35/40</td></tr>
              <tr className="clickable" onClick={() => openDrill('Tennis Event', '3 July · ₹333/seat', eventHTML('Tennis Event', '24/40', '₹7,992'))}><td>Tennis Event</td><td>3 Jul</td><td><span className="badge b-ok">Paid</span></td><td><div className="progress"><div style={{ width: '60%', background: 'var(--sage)' }} /></div> 60%</td><td>24/40</td></tr>
              <tr><td>Fitness Boot</td><td>5 Jul</td><td><span className="badge b-warn">Comp.</span></td><td><div className="progress"><div style={{ width: '31%', background: 'var(--error)' }} /></div> 31%</td><td>12/40</td></tr>
            </tbody></table>
            <div className="note">Fitness Boot at 31% – send reminder to 28 members who attended last quarter's session.</div>
          </div>
          <EventTrendChart />
        </div>
      </div>
    </div>
  );
};
