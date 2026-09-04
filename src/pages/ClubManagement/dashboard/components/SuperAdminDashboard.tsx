import React from 'react';
import { TopNavDateFilter } from './TopNavDateFilter';
import { SectionGuide } from './SectionGuide';
import { AlertBar } from './AlertBar';
import { KpiCard } from './KpiCard';
import { InfoTooltip } from './InfoTooltip';
import {
  RevAllChart, MixChart, MemGrowthChart, ChurnChart, RenewConvChart, ArpuChart, PayFailChart,
  BookTypeAllChart, RevCatAllChart,
} from './charts/SuperCharts';
import { useDrill } from '../DrillContext';
import { useStickyHeaderStack } from '../useStickyHeaderStack';
import { getInfo } from '../clubDashboardData';
import {
  revenueAllHTML, membersAllHTML, occAllHTML, arpuAllHTML, renewConvAllHTML, vendorAllHTML, branchHTML,
} from '../drillTemplates';

const SECTIONS = [
  { id: 'ss-branchcomp', label: 'Branch Comparison' },
  { id: 'ss-revenue', label: 'Revenue Intelligence' },
  { id: 'ss-membership', label: 'Membership Intelligence' },
  { id: 'ss-payment', label: 'Payment & Renewal' },
  { id: 'ss-booking', label: 'Booking Intelligence' },
];

export const SuperAdminDashboard: React.FC<{ onSwitchRole: () => void }> = ({ onSwitchRole }) => {
  const { openDrill } = useDrill();
  const rootRef = useStickyHeaderStack<HTMLDivElement>();

  return (
    <div ref={rootRef}>
      <div className="topnav">
        <div className="brand">
          <div className="logo">RC</div>
          <div>
            <div className="name">The Recess Club</div>
            <div className="sub">Super Admin</div>
          </div>
          <span className="wireframe-badge">Wireframe · v6</span>
        </div>
        <TopNavDateFilter />
        <div className="nav-right">
          <span className="scope-pill">📍 All Branches (4)</span>
          <button className="switch-btn" onClick={onSwitchRole}>Switch role</button>
        </div>
      </div>
      <SectionGuide sections={SECTIONS} />
      <AlertBar />

      <div className="wrap" style={{ paddingTop: 0 }}>
        <div className="kpi-strip">
          <KpiCard label="Revenue" value="₹38.6L" ctx="MTD · All Branches" delta="Forecast ₹44.1L month end" onClick={() => openDrill('Revenue – All Branches', 'For selected period', revenueAllHTML())} />
          <KpiCard label="Active Memberships" value={912} ctx="+38 net this month" delta="Branch D: -1 (watch)" onClick={() => openDrill('Active Memberships', '912 across 4 branches', membersAllHTML())} />
          <KpiCard label="Avg Utilisation" value="61%" bar={{ width: 61 }} delta="Range: 44%-74%" onClick={() => openDrill('Avg Utilisation', 'Across 4 branches', occAllHTML())} />
          <KpiCard label="Avg ARPU" value="₹4,232" ctx="Per member/month" delta="Branch D highest ₹4,768" onClick={() => openDrill('Portfolio ARPU', 'Revenue per member', arpuAllHTML())} />
          <KpiCard label="Renewal Conversion" value="79%" ctx="Across all branches" delta="Branch D: 69% – lowest" onClick={() => openDrill('Renewal Conversion', '% due renewals converted', renewConvAllHTML())} />
          <KpiCard label="Vendor Payables" value="₹3.1L" ctx={<span style={{ color: '#F4A0A8', fontWeight: 600 }}>Oldest 41 days</span>} delta="Branch C oldest pending" onClick={() => openDrill('Vendor Payables', '₹3.1L across 4 branches', vendorAllHTML())} />
        </div>

        <div className="section-head" id="ss-branchcomp"><div className="lbl">Branch Comparison</div><div className="line" /></div>
        <div className="card">
          <div className="card-title">Branch Health Scorecard <span className="muted">Click any row to drill</span><InfoTooltip info={getInfo('Branch Health Scorecard')} /></div>
          <div className="chart-sub">Branch D is the only branch with negative net membership – 3 consecutive months of decline.</div>
          <table><tbody>
            <tr><th>Branch</th><th>Revenue</th><th>Trend</th><th>Members</th><th>Utilisation</th><th>ARPU</th><th>Churn</th><th>Renewal Conv.</th><th>Tickets</th><th>Health</th></tr>
            <tr className="clickable" onClick={() => openDrill('Branch A – Worli', 'Full snapshot', branchHTML('Branch A – Worli', '₹12.4L', '74%', '4', '11', 'ok'))}><td>Branch A – Worli</td><td>₹12.4L</td><td><span className="trend-up">▲6%</span></td><td>312</td><td>74%</td><td>₹3,974</td><td>2.1%</td><td><span className="trend-up">87%</span></td><td>11</td><td><span className="badge b-ok">Healthy</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Branch B – Bandra', 'Full snapshot', branchHTML('Branch B – Bandra', '₹10.1L', '68%', '7', '9', 'warn'))}><td>Branch B – Bandra</td><td>₹10.1L</td><td><span className="trend-up">▲2%</span></td><td>248</td><td>68%</td><td>₹4,073</td><td>2.8%</td><td>81%</td><td>9</td><td><span className="badge b-warn">Watch</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Branch C – Thane', 'Full snapshot', branchHTML('Branch C – Thane', '₹8.9L', '58%', '8', '5', 'warn'))}><td>Branch C – Thane</td><td>₹8.9L</td><td><span className="trend-down">▼3%</span></td><td>201</td><td>58%</td><td>₹4,428</td><td>3.4%</td><td>76%</td><td>5</td><td><span className="badge b-warn">Watch</span></td></tr>
            <tr className="clickable" onClick={() => openDrill('Branch D – Dadar', 'Full snapshot', branchHTML('Branch D – Dadar', '₹7.2L', '44%', '7', '9', 'err'))}><td>Branch D – Dadar</td><td>₹7.2L</td><td><span className="trend-down">▼14%</span></td><td>151</td><td>44%</td><td>₹4,768</td><td><span className="trend-down">4.9%</span></td><td><span className="trend-down">69%</span></td><td>9</td><td><span className="badge b-err">At Risk</span></td></tr>
          </tbody></table>
        </div>

        <div className="section-head" id="ss-revenue"><div className="lbl">Revenue Intelligence</div><div className="line" /></div>
        <div className="grid2">
          <RevAllChart />
          <MixChart />
        </div>

        <div className="section-head" id="ss-membership"><div className="lbl">Membership Intelligence</div><div className="line" /></div>
        <div className="grid2eq">
          <MemGrowthChart />
          <ChurnChart />
        </div>

        <div className="section-head" id="ss-payment"><div className="lbl">Payment & Renewal Intelligence</div><div className="line" /></div>
        <div className="grid3">
          <RenewConvChart />
          <ArpuChart />
          <PayFailChart />
        </div>

        <div className="section-head" id="ss-booking"><div className="lbl">Booking Intelligence – Cross-Branch</div><div className="line" /></div>
        <div className="grid2eq">
          <BookTypeAllChart />
          <RevCatAllChart />
        </div>
      </div>
    </div>
  );
};
