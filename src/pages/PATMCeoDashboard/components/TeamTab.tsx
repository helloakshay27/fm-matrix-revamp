import { useState } from 'react';
import ChartCanvas from '../ChartCanvas';

const ok = '#108C72', warn = '#EDC488', err = '#E7848E', dark = '#2C2C2C',
  lav = '#CECBF6', terra = '#DA7756', grid = 'rgba(197,184,157,0.22)', green = '#798C5E';

const baseOpts = (legend = false) => ({
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: legend, labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } },
    tooltip: { titleFont: { size: 11 }, bodyFont: { size: 10 } },
  },
  scales: {
    x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
    y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
  },
});

const DEPT_OPTS = [
  { value: '', label: 'All Departments' },
  { value: 'cs', label: 'Customer Success & Operations' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR & Admin' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'ops', label: 'Operational Excellence' },
  { value: 'qa', label: 'Quality Assurance' },
  { value: 'sales', label: 'Sales' },
  { value: 'tech', label: 'Tech' },
];

type PersonRow = {
  name: string; dept: string; rowClass?: string;
  taskOpen: string | number; taskInProg: string | number; taskDone: string | number; taskOverdue: string | number;
  todoOpen: string | number; todoDone: string | number; todoOverdue: string | number;
  issues: string | number; doneYest: string; topOverdue: string; topOverdueColor?: string;
};

const PEOPLE: PersonRow[] = [
  // CS
  { name: 'Deepak Gupta', dept: 'cs', rowClass: 'row-overloaded', taskOpen: 184, taskInProg: 0, taskDone: 52, taskOverdue: 0, todoOpen: 0, todoDone: 26, todoOverdue: 16, issues: 0, doneYest: '—', topOverdue: '◆ todo: VI - check why (2026-04-23)\n◆ todo: Runwal Realty App (2026-04-23)' },
  { name: 'Anjali Lungare', dept: 'cs', taskOpen: 0, taskInProg: 2, taskDone: 99, taskOverdue: 4, todoOpen: 0, todoDone: 21, todoOverdue: 3, issues: 1, doneYest: '1', topOverdue: '• Panchshil FM user roles (2026-04-22)\n• Reset passwords for FM user (2026-04-16)\n◆ todo: FILL SELF EVALUATION (2026-05-04)' },
  { name: 'Sagar Singh', dept: 'cs', taskOpen: 0, taskInProg: 0, taskDone: 27, taskOverdue: 2, todoOpen: 0, todoDone: 122, todoOverdue: 11, issues: 0, doneYest: '—', topOverdue: '• zoom config on meeting module (2026-05-04)\n• cloud telephony activation (2026-04-01)' },
  // Design
  { name: 'Shahab Tufail Anwar', dept: 'design', taskOpen: 20, taskInProg: 0, taskDone: 14, taskOverdue: 1, todoOpen: 0, todoDone: 4, todoOverdue: 1, issues: 0, doneYest: '—', topOverdue: '• making PTW screens (2026-02-25)\n◆ todo: Meeting with Komal (2026-05-06)' },
  { name: 'Jahnvi Mulchandani', dept: 'design', taskOpen: 0, taskInProg: 0, taskDone: 15, taskOverdue: 0, todoOpen: 0, todoDone: 14, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '✓ None', topOverdueColor: '#108C72' },
  { name: 'Kshitij Rasal', dept: 'design', taskOpen: 0, taskInProg: 0, taskDone: 143, taskOverdue: 0, todoOpen: 0, todoDone: 14, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '✓ None', topOverdueColor: '#108C72' },
  // Finance
  { name: 'Punit Jain', dept: 'finance', taskOpen: 0, taskInProg: 0, taskDone: 2, taskOverdue: 1, todoOpen: 1, todoDone: 83, todoOverdue: 3, issues: 0, doneYest: 'TODO Invoicing', topOverdue: '• NDA with all vendors (2026-04-04)\n◆ todo: Ledger Reconciliation (2026-04-30)' },
  { name: 'Shraddha Barje', dept: 'finance', taskOpen: 0, taskInProg: 0, taskDone: 1, taskOverdue: 0, todoOpen: 1, todoDone: 115, todoOverdue: 6, issues: 0, doneYest: 'TODO Kaleyra', topOverdue: '◆ todo: declaration - piramal (2026-05-06)\n◆ todo: update holidays in PATM (2026-05-06)' },
  // HR
  { name: 'Ravi Sampat', dept: 'hr', taskOpen: 0, taskInProg: 0, taskDone: 6, taskOverdue: 0, todoOpen: 0, todoDone: 5, todoOverdue: 1, issues: 0, doneYest: 'TODO visitor register', topOverdue: '◆ todo: Set up server and UPS (2026-03-26)' },
  { name: 'Shalaka Nachare', dept: 'hr', taskOpen: 0, taskInProg: 0, taskDone: 0, taskOverdue: 0, todoOpen: 0, todoDone: 167, todoOverdue: 0, issues: 0, doneYest: 'TODO Interviews', topOverdue: '✓ None', topOverdueColor: '#108C72' },
  // Leadership
  { name: 'Chetan Bafna', dept: 'leadership', taskOpen: 0, taskInProg: 0, taskDone: 2, taskOverdue: 1, todoOpen: 0, todoDone: 31, todoOverdue: 10, issues: 0, doneYest: 'TODO Annexure 1', topOverdue: '• Setting Up All Accounts (2026-04-06)\n◆ todo: review holiday calendar (2026-04-30)' },
  // Ops
  { name: 'Adhip Shetty', dept: 'ops', taskOpen: 0, taskInProg: 0, taskDone: 15, taskOverdue: 2, todoOpen: 0, todoDone: 41, todoOverdue: 3, issues: 0, doneYest: 'TODO SHA Draft', topOverdue: '• Configure Research Agent (2026-04-15)\n• n8n INSTALLATION (2026-04-09)\n◆ todo: Share Business Plan (2026-05-07)' },
  { name: 'Manav Gandhi', dept: 'ops', taskOpen: 0, taskInProg: 0, taskDone: 0, taskOverdue: 1, todoOpen: 0, todoDone: 0, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '• Onlyoffice Automation (2026-03-28)' },
  // QA
  { name: 'Komal Shinde ⭐', dept: 'qa', rowClass: 'row-star', taskOpen: 0, taskInProg: 0, taskDone: 127, taskOverdue: 0, todoOpen: 0, todoDone: 144, todoOverdue: 1, issues: 0, doneYest: '—', topOverdue: '✓ None', topOverdueColor: '#108C72' },
  { name: 'Dinesh Shinde', dept: 'qa', taskOpen: 9, taskInProg: 1, taskDone: 111, taskOverdue: 14, todoOpen: 0, todoDone: 37, todoOverdue: 0, issues: 1, doneYest: '—', topOverdue: '• Hi society Revamp Testing (2026-04-29)\n• Appointmentz Module testing (2026-04-27)' },
  { name: 'Vinayak Mane', dept: 'qa', taskOpen: 0, taskInProg: 0, taskDone: 22, taskOverdue: 2, todoOpen: 0, todoDone: 64, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '• Test Loyalty Rustomjee (2026-03-26)\n• QA android, ios, web (2026-03-06)' },
  { name: 'Ubaid Hashmat', dept: 'qa', taskOpen: 0, taskInProg: 0, taskDone: 38, taskOverdue: 2, todoOpen: 0, todoDone: 4, todoOverdue: 6, issues: 1, doneYest: '—', topOverdue: '• Connect with Ajay for backend (2026-04-06)\n• Module not appears on web portal (2026-02-23)' },
  { name: 'Sakshi Salunke', dept: 'qa', taskOpen: 0, taskInProg: 0, taskDone: 5, taskOverdue: 0, todoOpen: 1, todoDone: 64, todoOverdue: 0, issues: 0, doneYest: 'TODO Assign Faisal', topOverdue: '✓ None', topOverdueColor: '#108C72' },
  // Sales
  { name: 'Aquil Hussain', dept: 'sales', taskOpen: 0, taskInProg: 0, taskDone: 0, taskOverdue: 0, todoOpen: 0, todoDone: 0, todoOverdue: 2, issues: 0, doneYest: '—', topOverdue: '◆ todo: Review STEM Agreement (2026-03-20)\n◆ todo: Send STEM Profile to Delhi (2026-03-13)' },
  // Tech
  { name: 'Akshay Shinde ⭐', dept: 'tech', rowClass: 'row-star', taskOpen: 1, taskInProg: 0, taskDone: 449, taskOverdue: 3, todoOpen: 0, todoDone: 9, todoOverdue: 6, issues: 16, doneYest: '—', topOverdue: '• forecast module as per zoho (2026-05-07)\n• User roles unit testing (2026-05-07)' },
  { name: 'Bilal Shaikh 🔴', dept: 'tech', rowClass: 'row-critical', taskOpen: 406, taskInProg: 0, taskDone: 47, taskOverdue: 7, todoOpen: 0, todoDone: 12, todoOverdue: 0, issues: 2, doneYest: '—', topOverdue: '• Resolve Panchshil Connect Event (2026-05-06)\n• Panchshil Connect app events (2026-05-06)' },
  { name: 'Mahendra Lungare 🔴', dept: 'tech', rowClass: 'row-critical', taskOpen: 435, taskInProg: 0, taskDone: 17, taskOverdue: 5, todoOpen: 1, todoDone: 3, todoOverdue: 2, issues: 3, doneYest: '—', topOverdue: '• Club Payment Showing Success (2026-04-28)\n◆ todo: Rustomjee CMS linkage (2026-05-06)' },
  { name: 'Ajay Pihulkar', dept: 'tech', taskOpen: 3, taskInProg: 1, taskDone: 154, taskOverdue: 5, todoOpen: 0, todoDone: 26, todoOverdue: 0, issues: 0, doneYest: 'TODO Kalerya mtg', topOverdue: '• Attach QR for Club membership (2026-05-07)\n• Patrolling new report (2026-05-04)' },
  { name: 'Abhishek Sharma', dept: 'tech', taskOpen: 5, taskInProg: 0, taskDone: 51, taskOverdue: 17, todoOpen: 0, todoDone: 1, todoOverdue: 2, issues: 15, doneYest: '—', topOverdue: '• QR based helpdesk point (2026-05-07)\n• Oman LNG sites Task (2026-05-07)\n• FM PASSWORD RESET (2026-05-05)' },
  { name: 'Prasad Nayak', dept: 'tech', taskOpen: 0, taskInProg: 0, taskDone: 80, taskOverdue: 13, todoOpen: 0, todoDone: 4, todoOverdue: 0, issues: 5, doneYest: '—', topOverdue: '• Notification screen revamp (2026-05-08)\n• Rustomjee plus module (2026-04-07)' },
  { name: 'Tejas Chaudhari', dept: 'tech', taskOpen: 1, taskInProg: 0, taskDone: 80, taskOverdue: 3, todoOpen: 0, todoDone: 29, todoOverdue: 0, issues: 19, doneYest: 'TODO Rustomjee CMS', topOverdue: '• My Bills backend (2026-04-08)\n• Connect new CMS and lockated (2026-03-13)' },
  { name: 'Rashid Raees Khan', dept: 'tech', taskOpen: 0, taskInProg: 0, taskDone: 31, taskOverdue: 9, todoOpen: 0, todoDone: 1, todoOverdue: 1, issues: 24, doneYest: '—', topOverdue: '• Login/SignUp OTP page (2026-04-20)\n• Visitor test notification (2026-04-16)' },
  { name: 'Dhananjay Bhoyar', dept: 'tech', taskOpen: 6, taskInProg: 0, taskDone: 116, taskOverdue: 2, todoOpen: 0, todoDone: 0, todoOverdue: 0, issues: 7, doneYest: '—', topOverdue: '• enhancement in life compass (2026-05-07)\n• Require form in f&b module (2026-05-07)' },
  { name: 'Ajay Ghenand', dept: 'tech', taskOpen: 0, taskInProg: 0, taskDone: 111, taskOverdue: 1, todoOpen: 0, todoDone: 10, todoOverdue: 0, issues: 6, doneYest: '—', topOverdue: '• Fitout Flat Rate (2026-04-10)' },
  { name: 'Parag Patil', dept: 'tech', taskOpen: 0, taskInProg: 1, taskDone: 14, taskOverdue: 1, todoOpen: 0, todoDone: 7, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '• Assessment Dashboard Issues (2026-03-25)' },
  // No dept
  { name: 'Abdul Ghaffar', dept: '', rowClass: 'row-critical', taskOpen: 394, taskInProg: 0, taskDone: 0, taskOverdue: 4, todoOpen: 0, todoDone: 67, todoOverdue: 1, issues: 0, doneYest: '—', topOverdue: '• Research and documentation (2026-03-13)\n• Holiday Calendar Full flow (2026-02-27)\n• Survey setup for OIG all sites (2026-02-23)' },
  { name: 'Sadanand Gupta', dept: '', taskOpen: 1214, taskInProg: 0, taskDone: 0, taskOverdue: '—', todoOpen: 0, todoDone: 0, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '1,214 overdue — department not set in PATM. Fix immediately.', topOverdueColor: '#C0303D' },
  { name: 'Gayatri Gaikwad', dept: '', taskOpen: 2, taskInProg: 2, taskDone: 2, taskOverdue: 0, todoOpen: 1, todoDone: 18, todoOverdue: 0, issues: 0, doneYest: '—', topOverdue: '✓ None', topOverdueColor: '#108C72' },
];

const DEPT_LABELS: Record<string, string> = {
  cs: 'Customer Success & Operations',
  design: 'Design',
  finance: 'Finance',
  hr: 'HR & Admin',
  leadership: 'Leadership',
  ops: 'Operational Excellence',
  qa: 'Quality Assurance',
  sales: 'Sales',
  tech: 'Tech',
  '': '⚠️ No Department Set — Has Active Work',
};

function numCell(val: string | number, className: string) {
  return <td className={className}>{val}</td>;
}

export default function TeamTab() {
  const [deptFilter, setDeptFilter] = useState('');

  const depts = Array.from(new Set(PEOPLE.map((p) => p.dept)));
  const visibleDepts = deptFilter ? [deptFilter] : depts;

  return (
    <div>
      {/* EFFICIENCY OVERVIEW */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Efficiency Overview</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>Based on 22,218 tasks · 07 May 2026</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, marginBottom: 12 }}>
          {/* Execution score */}
          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#2C2C2C,#3D2E20)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>Execution Score</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: '#EDC488', lineHeight: 1 }}>58</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginTop: 4 }}>out of 100</div>
            <div style={{ background: '#EDC48825', border: '1px solid #EDC48850', borderRadius: 'var(--r100)', padding: '4px 14px', marginTop: 10, fontSize: 11, fontWeight: 700, color: '#EDC488' }}>🟡 Needs Attention</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 8, lineHeight: 1.4 }}>Completion Rate · On-Time · Effort Accuracy · MoM Follow-through</div>
          </div>
          {/* 5 KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {[
              { label: 'Task Completion', val: '23.9%', color: '#8B6914', sub: '5,312 of 22,218 · Live DB', barW: '24%', barColor: '#EDC488', note: '↓ Target: 60%+', noteColor: '#C0303D' },
              { label: 'Avg Cycle Time', val: '16.2d', color: '#C0303D', sub: '3,436 tasks · Live DB', barW: '81%', barColor: '#E7848E', note: '↓ Target: under 5d', noteColor: '#C0303D' },
              { label: 'Overdue Rate', val: '9.9%', color: '#C0303D', sub: '2,192 of 22,218 · Live DB', barW: '10%', barColor: '#E7848E', note: '↓ Target: under 5%', noteColor: '#C0303D' },
              { label: 'Estimation Coverage', val: '12.5%', color: '#8B6914', sub: '2,773 of 22,218 · Live DB', barW: '13%', barColor: '#EDC488', note: 'Only 12.5% tasks have hours set', noteColor: '#8B6914' },
              { label: 'MoM Follow-through', val: '11%', color: '#C0303D', sub: '547 of 4,970 · Live DB', barW: '11%', barColor: '#E7848E', note: '↓ Target: 80%+', noteColor: '#C0303D' },
            ].map((k) => (
              <div key={k.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--sub)', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.val}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)', marginTop: 2 }}>{k.sub}</div>
                <div style={{ height: 4, background: 'var(--divider)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
                  <div style={{ width: k.barW, height: 4, background: k.barColor, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 9, color: k.noteColor, marginTop: 4 }}>{k.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECURRING TASK INSIGHT */}
      <div className="insight" style={{ background: '#6B9BCC12', borderColor: '#6B9BCC', marginBottom: 20 }}>
        <div className="i-lbl" style={{ color: '#2D5F8A' }}>⚠ Process gap — Only 17 of 22,307 tasks use recurring (0.08%)</div>
        <div className="i-txt">Team is manually recreating the same tasks every week instead of setting them up once — contributing directly to backlog growth. Action: Adhip Shetty to run a 30-min session on recurring task setup this week.</div>
      </div>

      {/* PEOPLE ALERTS */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">People Alerts</div>
          <div className="sec-line" />
        </div>
        <div className="g g3">
          {/* Top 10 Overdue */}
          <div className="card">
            <div className="ct">🔴 Top 10 Overdue Task Owners</div>
            {[
              { rank: 1, name: 'Sadanand Gupta', barW: '100%', val: '1,214', color: '#C0303D', rankColor: '#C0303D' },
              { rank: 2, name: 'Mahendra Lungare', barW: '36%', val: '440', color: '#C0303D', rankColor: '#C0303D' },
              { rank: 3, name: 'Bilal Shaikh', barW: '34%', val: '410', color: '#C0303D', rankColor: '#C0303D' },
              { rank: 4, name: 'Pooja Jadhav', barW: '33%', val: '402', color: '#C0303D', rankColor: '#C0303D' },
              { rank: 5, name: 'Abdul Ghaffar', barW: '33%', val: '398', color: '#C0303D', rankColor: '#C0303D' },
              { rank: 6, name: 'Deepak Gupta', barW: '15%', val: '184', color: '#8B6914', rankColor: '#8B6914', barColor: '#EDC488' },
              { rank: 7, name: 'Sohail Ansari', barW: '3%', val: '35', color: '#8B6914', rankColor: '#8B6914', barColor: '#EDC488' },
              { rank: 8, name: 'Dinesh Shinde', barW: '2%', val: '22', color: 'var(--sub)', rankColor: 'var(--sub)', barColor: 'var(--lav)' },
              { rank: 9, name: 'Shahab Tufail', barW: '2%', val: '21', color: 'var(--sub)', rankColor: 'var(--sub)', barColor: 'var(--lav)' },
              { rank: 10, name: 'Yash Rathod', barW: '1%', val: '18', color: 'var(--sub)', rankColor: 'var(--sub)', barColor: 'var(--lav)' },
            ].map((r, i) => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 9 ? '1px solid var(--divider)' : 'none', fontSize: 11 }}>
                <div style={{ width: 18, fontSize: 10, fontWeight: 700, color: r.rankColor, flexShrink: 0 }}>{r.rank}</div>
                <div style={{ flex: 1, fontWeight: r.rank <= 3 ? 600 : 400 }}>{r.name}</div>
                <div style={{ width: 80, background: 'var(--divider)', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: r.barW, height: 6, borderRadius: 3, background: (r as any).barColor || '#E7848E' }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: r.color, width: 38, textAlign: 'right' }}>{r.val}</div>
              </div>
            ))}
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>Top 5 own 2,864 overdue tasks — redistribution needed</div>
              <div className="i-txt">This is a workload allocation problem. CEO-level decision needed to redistribute or deprioritise tasks this week.</div>
            </div>
          </div>

          {/* Zero Work + Zero Velocity */}
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div className="ct">⚪ Zero Work — 5 People</div>
              <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 10 }}>No tasks, to-dos, or issues assigned. Review capacity and allocation.</div>
              <div className="zero-card">
                {[
                  { initials: 'AL', bg: '#EDC488', color: '#5A3E00', name: 'Anjali L.', sub: 'Test account', badgeClass: 'bw', badge: 'Test' },
                  { initials: 'PY', bg: '#E7848E', color: '#fff', name: 'Pratik Yadav', sub: 'Dept not set', badgeClass: 'br', badge: 'No work' },
                  { initials: 'SP', bg: '#E7848E', color: '#fff', name: 'Siddharth Patil', sub: 'Sales', badgeClass: 'br', badge: 'No work' },
                  { initials: 'SS', bg: '#E7848E', color: '#fff', name: 'Sneha Shivane', sub: 'CS & Ops', badgeClass: 'br', badge: 'No work' },
                  { initials: 'VB', bg: '#E7848E', color: '#fff', name: 'Vidhya Balota', sub: 'HR & Admin', badgeClass: 'br', badge: 'No work' },
                ].map((p) => (
                  <div key={p.name} className="zero-row">
                    <div className="av" style={{ background: p.bg, color: p.color }}>{p.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.sub}</div>
                    </div>
                    <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ct">🔴 Zero Velocity — Work Assigned, Nothing Completing</div>
              <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 10 }}>These people have tasks assigned but completed 0 tasks this month. Different from zero-work — they are blocked or disengaged.</div>
              <div className="zero-card">
                {[
                  { initials: 'AG', bg: '#E7848E', color: '#fff', name: 'Abdul Ghaffar', sub: '394 tasks assigned · 0 completed this month', badgeClass: 'br', badge: 'Blocked' },
                  { initials: 'MT', bg: '#EDC488', color: '#5A3E00', name: 'Mohsin Tanwar', sub: 'Tech Dev · 0 tasks, 0 todos, 0 issues', badgeClass: 'bw', badge: 'Idle' },
                  { initials: 'AQ', bg: '#EDC488', color: '#5A3E00', name: 'Aquil Hussain', sub: 'Sales · 0 tasks completed', badgeClass: 'bw', badge: 'Idle' },
                ].map((p) => (
                  <div key={p.name} className="zero-row">
                    <div className="av" style={{ background: p.bg, color: p.color }}>{p.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.sub}</div>
                    </div>
                    <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
                  </div>
                ))}
              </div>
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>Zero velocity ≠ zero work — something is blocking these people</div>
                <div className="i-txt">Check if tasks are blocked, unclear, or if the person is actually working outside PATM. Either close the tasks or reassign them.</div>
              </div>
            </div>
          </div>

          {/* Work Concentration Risk */}
          <div className="card">
            <div className="ct">⚠️ Work Concentration Risk</div>
            <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 12 }}>If any one of these people is unavailable, a significant share of work stops moving.</div>
            <div style={{ height: 160 }}>
              <ChartCanvas id="concentrationChart" config={{
                type: 'doughnut',
                data: { labels: ['Bilal Shaikh', 'Mahendra Lungare', 'Abdul Ghaffar', 'Rest of team'], datasets: [{ data: [406, 435, 394, 1500], backgroundColor: [err, err + 'cc', err + '88', ok + '44'], borderWidth: 0, hoverOffset: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } } } },
              } as any} />
            </div>
            <div style={{ marginTop: 12 }}>
              {[
                { name: 'Bilal Shaikh', tasks: '406 open tasks' },
                { name: 'Mahendra Lungare', tasks: '435 open tasks' },
                { name: 'Abdul Ghaffar', tasks: '394 open tasks' },
              ].map((r) => (
                <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ fontWeight: 600 }}>{r.name}</span>
                  <span style={{ color: '#C0303D', fontWeight: 700 }}>{r.tasks}</span>
                  <span className="badge br">High Risk</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0' }}>
                <span style={{ color: 'var(--sub)' }}>All other team members</span>
                <span style={{ color: 'var(--sub)' }}>remaining 53%</span>
                <span className="badge bg">Distributed</span>
              </div>
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>3 people hold 47% of all open work</div>
              <div className="i-txt">Start pairing junior team members with these 3 now. If any one leaves, their context and work goes with them.</div>
            </div>
          </div>
        </div>
      </div>

      {/* EFFORT & OVERDUE */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Effort &amp; Overdue</div>
          <div className="sec-line" />
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">Effort accuracy — estimated vs actual hours per person</div>
            <div style={{ height: 180 }}>
              <ChartCanvas id="effortChart" config={{
                type: 'bar',
                data: {
                  labels: ['Gayatri', 'Akshay', 'Kshitij', 'Dinesh', 'Sadanand', 'Abdul', 'Abhishek', 'Prasad'],
                  datasets: [
                    { label: 'Estimated hrs', data: [120, 90, 100, 110, 140, 130, 95, 85], backgroundColor: lav, borderRadius: 3 },
                    { label: 'Actual hrs', data: [108, 72, 88, 142, 156, 164, 118, 92], backgroundColor: terra + 'cc', borderRadius: 3 },
                  ],
                },
                options: baseOpts(true),
              } as any} />
            </div>
            <div style={{ marginTop: 10 }}>
              {[
                { name: 'Abdul Ghaffar', note: '+34 hrs over', badge: 'br', label: 'Overloaded' },
                { name: 'Dinesh Shinde', note: '+32 hrs over', badge: 'br', label: 'Overloaded' },
                { name: 'Sadanand Gupta', note: '+16 hrs over', badge: 'bw', label: 'Watch', noteColor: '#8B6914' },
                { name: 'Akshay Shinde', note: '−18 hrs', badge: 'bg', label: 'Under est.', noteColor: '#108C72' },
              ].map((r) => (
                <div key={r.name} className="row">
                  <span className="rn">{r.name}</span>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="rv" style={{ color: (r as any).noteColor || '#C0303D' }}>{r.note}</span>
                    <span className={`badge ${r.badge}`}>{r.label}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="insight" style={{ background: '#EDC48815', borderColor: '#EDC488', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#8B6914' }}>Only 12.5% of tasks have hours estimated — data above is partial</div>
              <div className="i-txt">Make hour estimation mandatory for all tasks above 2 hours in PATM.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Overdue by age + trend</div>
            {[
              { label: '1 day', w: '28%', color: '#89F7E7', val: 614, pct: '28%', valColor: '#0A7A6A' },
              { label: '2–7 days', w: '32%', color: '#EDC488', val: 701, pct: '32%', valColor: '#8B6914' },
              { label: '8–15 days', w: '18%', color: '#E7848E', val: 394, pct: '18%', valColor: '#C0303D' },
              { label: '16–30 days', w: '14%', color: '#C0303D', val: 307, pct: '14%', valColor: '#C0303D' },
              { label: '30+ days', w: '8%', color: '#8B0000', val: 176, pct: '8%', valColor: '#8B0000' },
            ].map((r, i) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 4 ? '1px solid var(--divider)' : 'none', fontSize: 11 }}>
                <div style={{ width: 80, fontSize: 10, color: 'var(--sub)', flexShrink: 0 }}>{r.label}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--divider)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: r.w, height: 8, borderRadius: 4, background: r.color }} />
                </div>
                <div style={{ fontWeight: 700, color: r.valColor, width: 38, textAlign: 'right' }}>{r.val}</div>
                <div style={{ width: 28, fontSize: 9, color: 'var(--sub)', textAlign: 'right' }}>{r.pct}</div>
              </div>
            ))}
            <div style={{ marginTop: 10 }}>
              <div className="ct-sm">Overdue trend — last 4 weeks</div>
              <div style={{ height: 90 }}>
                <ChartCanvas id="overduetrend" config={{
                  type: 'line',
                  data: { labels: ['4 wks ago', '3 wks ago', '2 wks ago', 'Last wk', 'This wk'], datasets: [{ label: 'Overdue Tasks', data: [1840, 1920, 2050, 2130, 2192], borderColor: err, backgroundColor: err + '22', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: err, borderWidth: 2 }] },
                  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } }, y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green }, min: 1600 } } },
                } as any} />
              </div>
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>176 tasks 30+ days overdue — abandoned, not delayed</div>
              <div className="i-txt">Close or reassign all tasks overdue 30+ days this sprint.</div>
            </div>
          </div>
        </div>
      </div>

      {/* PERSON-WISE AGEING MATRIX */}
      <div className="sec" style={{ marginTop: 0, paddingTop: 0 }}>
        <div className="sec-hd">
          <div className="sec-lbl">Person-wise Ageing Matrix</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>
            Overdue tasks distributed by age bucket per person · Dummy data — pending responsible_person_id join confirmation (Akshay)
          </span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl" style={{ minWidth: 650 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', minWidth: 150 }}>Person</th>
                  <th style={{ textAlign: 'center', color: '#0A7A6A' }}>1 Day</th>
                  <th style={{ textAlign: 'center', color: '#8B6914' }}>2–7 Days</th>
                  <th style={{ textAlign: 'center', color: '#C0303D' }}>8–15 Days</th>
                  <th style={{ textAlign: 'center', color: '#C0303D' }}>16–30 Days</th>
                  <th style={{ textAlign: 'center', color: '#8B0000' }}>30+ Days</th>
                  <th style={{ textAlign: 'center', fontWeight: 700, color: 'var(--dark)', borderLeft: '2px solid var(--divider)' }}>Total Overdue</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sadanand Gupta', d1: 124, d2: 292, d8: 298, d16: 312, d30: 188, total: '1,214', bg: '#FFF0F0', nameColor: '#C0303D', nameBold: true },
                  { name: 'Mahendra Lungare', d1: 98, d2: 118, d8: 78, d16: 84, d30: 62, total: '440', nameColor: '#C0303D' },
                  { name: 'Bilal Shaikh', d1: 82, d2: 127, d8: 86, d16: 72, d30: 43, total: '410', bg: '#FFF8F0', nameColor: '#C0303D' },
                  { name: 'Pooja Jadhav', d1: 76, d2: 114, d8: 82, d16: 70, d30: 60, total: '402', nameColor: '#C0303D' },
                  { name: 'Abdul Ghaffar', d1: 64, d2: 90, d8: 74, d16: 98, d30: 72, total: '398', bg: '#FFF8F0', nameColor: '#C0303D' },
                  { name: 'Deepak Gupta', d1: 38, d2: 58, d8: 42, d16: 32, d30: 14, total: '184', nameColor: '#8B6914', totalColor: '#8B6914' },
                  { name: 'Sohail Ansari', d1: 8, d2: 14, d8: 8, d16: 3, d30: 2, total: '35', bg: '#FAFAF8' },
                  { name: 'Dinesh Shinde', d1: 6, d2: 8, d8: 4, d16: 3, d30: 1, total: '22' },
                  { name: 'Shahab Tufail', d1: 5, d2: 7, d8: 4, d16: 3, d30: 2, total: '21', bg: '#FAFAF8' },
                  { name: 'Yash Rathod', d1: 4, d2: 6, d8: 4, d16: 2, d30: 2, total: '18' },
                ].map((r) => (
                  <tr key={r.name} style={{ background: (r as any).bg }}>
                    <td style={{ fontWeight: (r as any).nameBold ? 700 : 600, color: (r as any).nameColor || 'var(--dark)' }}>{r.name}</td>
                    <td style={{ textAlign: 'center', color: '#0A7A6A' }}>{r.d1}</td>
                    <td style={{ textAlign: 'center', color: '#8B6914' }}>{r.d2}</td>
                    <td style={{ textAlign: 'center', color: '#C0303D' }}>{r.d8}</td>
                    <td style={{ textAlign: 'center', color: '#C0303D' }}>{r.d16}</td>
                    <td style={{ textAlign: 'center', color: '#8B0000', fontWeight: 700 }}>{r.d30}</td>
                    <td style={{ textAlign: 'center', fontWeight: (r as any).nameBold ? 800 : 700, color: (r as any).totalColor || '#C0303D', borderLeft: '2px solid var(--divider)' }}>{r.total}</td>
                  </tr>
                ))}
                <tr style={{ background: '#F0EDE8', fontStyle: 'italic' }}>
                  <td style={{ color: 'var(--sub)', fontSize: 10 }}>+ others (remaining ~448)</td>
                  {['109', '—', '—', '—', '—', '~448'].map((v, i) => (
                    <td key={i} style={{ textAlign: 'center', color: 'var(--sub)', fontSize: 10, borderLeft: i === 5 ? '2px solid var(--divider)' : undefined }}>{v}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--divider)', background: 'var(--bg)' }}>
            <div className="insight" style={{ background: '#EDC48815', borderColor: '#EDC488', marginTop: 0 }}>
              <div className="i-lbl" style={{ color: '#8B6914' }}>⚠ Open item — Pending DB confirmation</div>
              <div className="i-txt">
                Person-level breakdown requires confirming that{' '}
                <code style={{ fontSize: 10, background: '#00000010', padding: '1px 4px', borderRadius: 3 }}>responsible_person_id</code>{' '}
                join is available in storejust DB for all open overdue tasks. Akshay to confirm before this chart is data-connected. Numbers above are dummy data based on total overdue counts from the PM report.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PER PERSON BREAKDOWN TABLE */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Per-Person Breakdown</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', whiteSpace: 'nowrap', paddingLeft: 10 }}>
            🔴 Critical &nbsp;🟡 Overloaded &nbsp;🟢 Performing &nbsp;⬜ Low work
          </span>
        </div>
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 12, borderBottom: '1px solid var(--divider)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--sub)' }}>Filter:</span>
          <select className="fsel-sm" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            {DEPT_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span style={{ fontSize: 9, color: 'var(--sub)', marginLeft: 4, fontStyle: 'italic' }}>Date filter functional after data connection</span>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="team-tbl">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', minWidth: 140 }}>Name</th>
                  <th colSpan={4} style={{ background: '#DA775610', borderRight: '1px solid var(--divider)', textAlign: 'center' }}>Tasks</th>
                  <th colSpan={3} style={{ background: '#CECBF625', borderRight: '1px solid var(--divider)', textAlign: 'center' }}>To-Dos</th>
                  <th>Issues</th>
                  <th>Done Yest.</th>
                  <th style={{ minWidth: 220, textAlign: 'left' }}>Top Overdue</th>
                </tr>
                <tr>
                  <th>—</th>
                  <th style={{ background: '#DA775608' }}>Open</th>
                  <th style={{ background: '#DA775608' }}>In Prog</th>
                  <th style={{ background: '#DA775608' }}>Done</th>
                  <th style={{ background: '#DA775608', borderRight: '1px solid var(--divider)' }}>Overdue</th>
                  <th style={{ background: '#CECBF615' }}>Open</th>
                  <th style={{ background: '#CECBF615' }}>Done</th>
                  <th style={{ background: '#CECBF615', borderRight: '1px solid var(--divider)' }}>Overdue</th>
                  <th>Open</th>
                  <th>—</th>
                  <th style={{ textAlign: 'left' }}>—</th>
                </tr>
              </thead>
              <tbody>
                {visibleDepts.map((dept) => {
                  const rows = PEOPLE.filter((p) => p.dept === dept);
                  if (!rows.length) return null;
                  const isNoDept = dept === '';
                  return (
                    <>
                      <tr key={`dept-${dept}`} className="dept-hd" style={isNoDept ? { background: '#E7848E15' } : undefined}>
                        <td colSpan={11}>{DEPT_LABELS[dept] || dept}</td>
                      </tr>
                      {rows.map((p) => (
                        <tr key={p.name} className={p.rowClass || ''}>
                          <td>{p.name}</td>
                          <td className={`num-open ${Number(p.taskOpen) >= 100 ? 'num-red' : Number(p.taskOpen) > 0 ? 'num-warn' : 'num-muted'}`}>{p.taskOpen}</td>
                          <td className={Number(p.taskInProg) > 0 ? 'num-warn' : 'num-muted'}>{p.taskInProg}</td>
                          <td className={Number(p.taskDone) > 0 ? 'num-ok' : 'num-muted'} style={Number(p.taskDone) > 300 ? { fontWeight: 800, fontSize: 13 } : undefined}>{p.taskDone}</td>
                          <td className={Number(p.taskOverdue) > 10 ? 'num-red' : Number(p.taskOverdue) > 0 ? 'num-red' : 'num-muted'} style={{ borderRight: '1px solid var(--divider)' }}>{p.taskOverdue}</td>
                          <td className={Number(p.todoOpen) > 0 ? 'num-warn' : 'num-muted'}>{p.todoOpen}</td>
                          <td className={Number(p.todoDone) > 0 ? 'num-ok' : 'num-muted'}>{p.todoDone}</td>
                          <td className={Number(p.todoOverdue) > 5 ? 'num-warn' : Number(p.todoOverdue) > 0 ? 'num-warn' : 'num-muted'} style={{ borderRight: '1px solid var(--divider)' }}>{p.todoOverdue}</td>
                          <td>{p.issues}</td>
                          <td>{p.doneYest}</td>
                          <td className="top-overdue" style={p.topOverdueColor ? { color: p.topOverdueColor } : undefined}>
                            {p.topOverdue.split('\n').map((line, i) => (
                              <span key={i}>{line}{i < p.topOverdue.split('\n').length - 1 && <br />}</span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
