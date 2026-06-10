import ChartCanvas from '../ChartCanvas';

const ok = '#108C72', warn = '#EDC488', err = '#E7848E', dark = '#2C2C2C',
  lav = '#CECBF6', blue = '#6B9BCC', grid = 'rgba(197,184,157,0.22)', green = '#798C5E', terra = '#DA7756';

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

export default function DeliveryTab() {
  return (
    <div>
      {/* SPRINT HEALTH */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Sprint Health</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>
            ⚠ 7 of 9 sprints never closed — corrupting all velocity data
          </span>
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">Active sprints</div>
            <div className="sprint-card" style={{ borderColor: '#108C7240' }}>
              <div className="sprint-hd">
                <div className="sprint-title">Sprint 9 — PATM Enhancement</div>
                <span className="badge bg">Active</span>
              </div>
              <div className="sprint-meta">
                <span>Owner: Gayatri Gaikwad</span>
                <span>May 5 → May 8, 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: 'var(--sub)' }}>Tasks</span>
                <span style={{ fontWeight: 600 }}>7 of 12 done</span>
              </div>
              <div className="progress">
                <div className="progress-fill" style={{ width: '58%', background: '#108C72' }} />
              </div>
              <div className="insight" style={{ background: '#108C7212', borderColor: '#108C72', marginTop: 8 }}>
                <div className="i-lbl" style={{ color: '#108C72' }}>58% · 1 day left — 5 tasks to close</div>
                <div className="i-txt">Gayatri needs to prioritise these today to close on time.</div>
              </div>
            </div>
            <div className="sprint-card" style={{ borderColor: '#EDC48855', marginTop: 8 }}>
              <div className="sprint-hd">
                <div className="sprint-title">Sprint 8 — Pulse</div>
                <span className="badge bw">Overrunning</span>
              </div>
              <div className="sprint-meta">
                <span>Owner: Sadanand Gupta</span>
                <span>Jan 15 → Jan 15, 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: 'var(--sub)' }}>Overrun</span>
                <span style={{ fontWeight: 600, color: '#E7848E' }}>111 days past end</span>
              </div>
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 8 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>Close or extend with new date — corrupting metrics</div>
                <div className="i-txt">Move remaining tasks to Sprint 9 or set a hard new end date today.</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Sprint history — full picture</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#C0303D' }}>7</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Abandoned / Test</div>
                <div style={{ fontSize: 9, color: '#C0303D', fontWeight: 600 }}>Never closed</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#EDC488' }}>1</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Active Sprint</div>
                <div style={{ fontSize: 9, color: '#8B6914', fontWeight: 600 }}>In progress</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#108C72' }}>1</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Completed</div>
                <div style={{ fontSize: 9, color: '#108C72', fontWeight: 600 }}>Properly closed</div>
              </div>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Sprint</th>
                  <th>Status</th>
                  <th>Overrun</th>
                  <th>Action</th>
                  <th>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sprint 9 · PATM', status: 'Active', badgeClass: 'bg', overrun: 'On time', overrunColor: '#108C72', action: '✓ Keep', actionClass: 'bg', pct: '58%', pctColor: '#108C72' },
                  { name: 'Sprint 8 · Pulse', status: 'Open', badgeClass: 'bw', overrun: '111 days', overrunColor: '#E7848E', action: 'Close it', actionClass: 'bw', pct: '40%', pctColor: '#8B6914' },
                  { name: 'Sprint 7 · Sprint 1', status: 'Started', badgeClass: 'bw', overrun: '404 days', overrunColor: '#E7848E', action: 'Abandon', actionClass: 'br', pct: '25%', pctColor: '#C0303D' },
                  { name: 'Sprint 6 · Test11', status: 'Open', badgeClass: 'bd', overrun: '430 days', overrunColor: '#E7848E', action: 'Delete', actionClass: 'br', pct: '0%', pctColor: 'var(--sub)' },
                  { name: 'Sprint 5 · Testing', status: 'Open', badgeClass: 'bd', overrun: '437 days', overrunColor: '#E7848E', action: 'Delete', actionClass: 'br', pct: '5%', pctColor: 'var(--sub)' },
                  { name: 'Sprint 4 · AKSHAY', status: 'In progress', badgeClass: 'bd', overrun: 'Invalid date', overrunColor: 'var(--sub)', action: 'Delete', actionClass: 'br', pct: '—', pctColor: 'var(--sub)' },
                  { name: 'Sprint 3 · New Sprint', status: 'In progress', badgeClass: 'bd', overrun: 'Invalid date', overrunColor: 'var(--sub)', action: 'Delete', actionClass: 'br', pct: '—', pctColor: 'var(--sub)' },
                ].map((s) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className={`badge ${s.badgeClass}`}>{s.status}</span></td>
                    <td style={{ color: s.overrunColor, fontWeight: 600 }}>{s.overrun}</td>
                    <td><span className={`badge ${s.actionClass}`}>{s.action}</span></td>
                    <td style={{ color: s.pctColor, fontWeight: 700 }}>{s.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>7 open sprints corrupting all velocity data</div>
              <div className="i-txt">Close Sprints 3–8 today. Until then burn-down and velocity are meaningless.</div>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY ACCOUNTABILITY */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Delivery Accountability</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>⚠ Most projects have no end date set</span>
        </div>
        <div className="g g2" style={{ marginBottom: 12 }}>
          <div className="card">
            <div className="ct">Project deadline coverage</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
              {[
                { val: '27', label: 'No end date set', sub: '69% of projects', color: '#C0303D' },
                { val: '12', label: 'Have end date', sub: '31% of projects', color: '#0A7A6A' },
                { val: '0%', label: 'Avg completion', sub: 'Most show NULL', color: '#C0303D' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', border: '1px solid var(--divider)', borderRadius: 'var(--r10)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{item.label}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: item.color }}>{item.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>Longest running active projects with no end date:</div>
            {[
              { name: 'Runwal Connect', started: 'Started Jan 2023', note: '2+ years · no deadline', color: '#C0303D' },
              { name: 'Internal Products', started: 'Started Dec 2023', note: '17 months · no deadline', color: '#C0303D' },
              { name: 'Dashboard Developments', started: 'Started Dec 2023', note: '17 months · no deadline', color: '#8B6914' },
              { name: 'FM Matrix App Revamp', started: 'Started Feb 2024', note: 'High priority · no deadline', color: '#8B6914' },
              { name: 'Snag 360 App Revamp', started: 'Started May 2024', note: 'High priority · no deadline', color: '#8B6914' },
            ].map((p, i) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--divider)' : 'none' }}>
                <span style={{ fontWeight: 600, color: p.color }}>{p.name}</span>
                <span style={{ color: 'var(--sub)' }}>{p.started}</span>
                <span style={{ color: p.color, fontWeight: 600 }}>{p.note}</span>
              </div>
            ))}
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 12 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>No deadline = no accountability</div>
              <div className="i-txt">69% of active projects have no end date. You cannot measure delivery performance without target dates. This week: every High priority project must get an end date set in PATM.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Milestone health — completion vs status</div>
            <div style={{ height: 160 }}>
              <ChartCanvas id="milestoneChart" config={{
                type: 'bar',
                data: {
                  labels: ['Open', 'In Progress', 'Completed', 'On Hold'],
                  datasets: [
                    { label: 'Count', data: [298, 1161, 142, 15], backgroundColor: [lav, warn, ok, dark + '44'], borderRadius: 4, yAxisID: 'y' },
                    { label: 'Avg Completion %', data: [0, 9.5, 49, 7.6], backgroundColor: 'transparent', borderColor: [lav, warn, '#C0303D', dark + '66'], borderWidth: 2, type: 'line', yAxisID: 'y1', pointRadius: 5, tension: 0.3 },
                  ],
                },
                options: {
                  responsive: true, maintainAspectRatio: false,
                  plugins: { legend: { display: true, position: 'top', labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } } },
                  scales: {
                    x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
                    y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green }, position: 'left' },
                    y1: { grid: { display: false }, ticks: { font: { size: 9 }, color: green }, position: 'right', max: 100, min: 0 },
                  },
                },
              } as any} />
            </div>
            <div style={{ marginTop: 12 }}>
              {[
                { label: 'Open milestones', val: '298', sub: 'avg 0% complete', valColor: '' },
                { label: 'In Progress', val: '1,161', sub: 'avg 9.5% complete', valColor: '#8B6914' },
                { label: 'Marked Complete ⚠', val: '142', sub: 'avg only 49% done', valColor: '#C0303D', labelColor: '#C0303D' },
                { label: 'On Hold', val: '15', sub: 'avg 7.6% complete', valColor: '' },
              ].map((r, i) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
                  <span style={{ color: (r as any).labelColor || 'var(--dark)', fontWeight: (r as any).labelColor ? 600 : 400 }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: r.valColor || 'var(--dark)' }}>{r.val}</span>
                  <span style={{ color: r.valColor || 'var(--sub)' }}>{r.sub}</span>
                </div>
              ))}
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>142 milestones "completed" at only 49% — false closure</div>
              <div className="i-txt">Milestones are being marked complete before they are actually done. This inflates progress metrics. Audit and reopen these milestones this week.</div>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT INACTIVITY ALERT */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Project Inactivity Alert</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>Projects marked Active but no work logged recently</span>
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">🚨 Zero activity — 7+ days (Critical Projects)</div>
            {[
              { name: 'Parking', sub: 'Critical · Started 2023 · No end date', days: '29 days' },
              { name: 'PTW (Permit to Work)', sub: 'Critical · Started 2024 · No end date', days: '29 days' },
              { name: 'GoPhygital.work (Corporate)', sub: 'Critical · Active since 2024', days: '22 days' },
              { name: 'MSafe', sub: 'Critical · Active since 2024', days: '18 days' },
            ].map((p, i) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C0303D' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#C0303D' }}>{p.days}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>since last activity</div>
                </div>
              </div>
            ))}
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>Active status ≠ active work</div>
              <div className="i-txt">These projects are marked Active in PATM but no tasks have been created or updated recently. Either mark them On Hold or assign an owner to restart work this week.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">⚠️ Low activity — 15–30 days (At Risk Projects)</div>
            {[
              { name: 'Runwal Connect', sub: 'Active since Jan 2023 · 2+ years', days: '42 days' },
              { name: 'ERP Procurement', sub: 'Active since Jan 2024', days: '31 days' },
              { name: 'Vi My Workspace Stepathon', sub: 'Active since Mar 2024', days: '28 days' },
              { name: 'ZS Associates POC', sub: 'Active since Apr 2024', days: '17 days' },
            ].map((p, i) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6914' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8B6914' }}>{p.days}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>since last task</div>
                </div>
              </div>
            ))}
            <div className="insight" style={{ background: '#EDC48818', borderColor: '#EDC488', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#8B6914' }}>8 projects inactive 15–30 days</div>
              <div className="i-txt">Review each — either they are genuinely on hold (update status) or they need to be reactivated with a clear owner and deadline this sprint.</div>
            </div>
          </div>
        </div>
      </div>

      {/* BACKLOG & ISSUES */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Backlog &amp; Issues</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>Creating 38% more work than completing every week</span>
        </div>
        <div className="g g3" style={{ marginBottom: 12 }}>
          {[
            { label: 'Avg Created / Week', val: '447', color: '#C0303D' },
            { label: 'Avg Completed / Week', val: '325', color: '#8B6914' },
            { label: 'Net Growth / Week', val: '+122 ↑', color: '#C0303D', bg: '#E7848E10', border: '#E7848E55', labelColor: '#C0303D' },
          ].map((k) => (
            <div key={k.label} className="card-sm" style={{ textAlign: 'center', padding: 14, background: (k as any).bg, borderColor: (k as any).border }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: (k as any).labelColor || 'var(--sub)', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.val}</div>
            </div>
          ))}
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">Created vs Completed — last 9 weeks</div>
            <div style={{ height: 180 }}>
              <ChartCanvas id="backlogRaceChart" config={{
                type: 'bar',
                data: {
                  labels: ['Wk12', 'Wk13', 'Wk14', 'Wk15', 'Wk16', 'Wk17', 'Wk18', 'Wk19', 'Wk20'],
                  datasets: [
                    { label: 'Created', data: [180, 420, 510, 380, 360, 410, 290, 340, 310], backgroundColor: err + '88', borderRadius: 3 },
                    { label: 'Completed', data: [33, 355, 440, 279, 281, 312, 713, 288, 228], backgroundColor: ok + '88', borderRadius: 3 },
                  ],
                },
                options: baseOpts(true),
              } as any} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="rn">Wk18 anomaly (bulk close)</span><span className="rv" style={{ color: '#8B6914' }}>713 closed · 51d avg age</span></div>
              <div className="row"><span className="rn">Open tasks today vs 9 weeks ago</span><span className="rv" style={{ color: '#C0303D' }}>14,758 (+958)</span></div>
              <div className="row"><span className="rn">Overdue today vs 9 weeks ago</span><span className="rv" style={{ color: '#C0303D' }}>2,192 (+352)</span></div>
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>At current pace backlog grows ~500 tasks/month</div>
              <div className="i-txt">Without a task freeze on non-critical work, the overdue count will exceed 3,000 by end of June. Freeze non-critical creation for 2 weeks. Focus team on clearing, not creating.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Weekly completion velocity — is the team improving?</div>
            <div style={{ height: 180 }}>
              <ChartCanvas id="velocityChart" config={{
                type: 'line',
                data: {
                  labels: ['Wk12', 'Wk13', 'Wk14', 'Wk15', 'Wk16', 'Wk17', 'Wk18', 'Wk19', 'Wk20'],
                  datasets: [
                    { label: 'Tasks Completed', data: [33, 355, 440, 279, 281, 312, 713, 288, 228], borderColor: ok, backgroundColor: ok + '18', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: ok, borderWidth: 2 },
                    { label: 'Target (500/wk)', data: [500, 500, 500, 500, 500, 500, 500, 500, 500], borderColor: warn, backgroundColor: 'transparent', borderDash: [6, 3], pointRadius: 0, borderWidth: 1.5 },
                  ],
                },
                options: baseOpts(true),
              } as any} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="rn">Best week (Wk18 bulk close)</span><span className="rv" style={{ color: '#108C72' }}>713 completed</span></div>
              <div className="row"><span className="rn">Avg weekly completion (excl. Wk18)</span><span className="rv" style={{ color: '#8B6914' }}>325 tasks</span></div>
              <div className="row"><span className="rn">Trend direction</span><span className="rv" style={{ color: '#C0303D' }}>↓ Declining</span></div>
              <div className="row"><span className="rn">Target to clear backlog by Jun</span><span className="rv" style={{ color: '#C0303D' }}>500+ / week needed</span></div>
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>Completion velocity is declining week-on-week</div>
              <div className="i-txt">The team needs to complete 500+ tasks per week to start reducing the backlog. Current average is 325. The gap is widening, not closing.</div>
            </div>
          </div>
        </div>
      </div>

      {/* ISSUE RESOLUTION */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Issue Resolution</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>1,852 issues total · 175 open · 31 reopened</span>
        </div>
        <div className="g g2" style={{ marginBottom: 12 }}>
          <div className="card">
            <div className="ct">Avg days to resolve — monthly trend</div>
            <div style={{ height: 160 }}>
              <ChartCanvas id="issueResChart" config={{
                type: 'line',
                data: {
                  labels: ['Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26'],
                  datasets: [{ label: 'Avg days to resolve', data: [12.4, 10.8, 9.2, 8.1, 7.6, 8.4], borderColor: warn, backgroundColor: warn + '22', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: warn, borderWidth: 2 }],
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } }, y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green }, min: 0 } } },
              } as any} />
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="rn">Avg resolution time this month</span><span className="rv" style={{ color: '#8B6914' }}>8.4 days</span></div>
              <div className="row"><span className="rn">Fastest resolution</span><span className="rv" style={{ color: '#108C72' }}>Same day (0d)</span></div>
              <div className="row"><span className="rn">Slowest resolution</span><span className="rv" style={{ color: '#C0303D' }}>105 days</span></div>
              <div className="row"><span className="rn">Issues open 30+ days</span><span className="rv" style={{ color: '#C0303D' }}>49 issues</span></div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Issues by type + top sources</div>
            <div style={{ height: 140 }}>
              <ChartCanvas id="issueType" config={{
                type: 'bar',
                data: { labels: ['Bug', 'Enhancement', 'UI', 'Functional'], datasets: [{ data: [312, 428, 186, 131], backgroundColor: [err, ok + 'bb', blue, warn], borderRadius: 4 }] },
                options: baseOpts(false),
              } as any} />
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>Bug ratio at 30% — healthy benchmark is under 15%</div>
              <div className="i-txt">Freeze new features and run a focused QA sprint this week.</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="ct-sm">Top 5 issue sources</div>
              {[['Hi Society', '#E7848E', '284'], ['FM Matrix', '#E7848E', '218'], ['Projects & Task Mgmt', '#EDC488', '142'], ['Club Management', '#EDC488', '98'], ['Incident Management', '', '74']].map(([name, color, val]) => (
                <div key={name} className="row"><span className="rn">{name}</span><span className="rv" style={{ color: color || 'var(--dark)' }}>{val}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">Issues open 30+ days — escalation risk</div>
            {[
              { label: '30–45 days', w: '55%', color: '#EDC488', val: 27, valColor: '#8B6914' },
              { label: '45–60 days', w: '25%', color: '#E7848E', val: 12, valColor: '#C0303D' },
              { label: '60–90 days', w: '14%', color: '#C0303D', val: 7, valColor: '#C0303D' },
              { label: '90+ days', w: '6%', color: '#8B0000', val: 3, valColor: '#8B0000' },
            ].map((r, i) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--divider)' : 'none', fontSize: 11 }}>
                <div style={{ width: 70, fontSize: 10, color: 'var(--sub)' }}>{r.label}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--divider)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: r.w, height: 8, background: r.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontWeight: 700, color: r.valColor, width: 30, textAlign: 'right' }}>{r.val}</div>
              </div>
            ))}
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 12 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>49 issues open 30+ days — client escalation risk</div>
              <div className="i-txt">Assign a dedicated owner to the 3 issues open 90+ days and resolve this sprint.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">Overdue tasks by project + reopened issues</div>
            <div style={{ height: 140 }}>
              <ChartCanvas id="overdueByProj" config={{
                type: 'bar',
                data: { labels: ['Hi Society', 'FM Matrix', 'Club Mgmt', 'PATM', 'Incident', 'HSE App'], datasets: [{ data: [94, 68, 42, 28, 16, 8], backgroundColor: [err, err + 'bb', warn, warn + 'aa', lav, ok + '66'], borderRadius: 4 }] },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { titleFont: { size: 11 }, bodyFont: { size: 10 } } }, scales: { x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } }, y: { grid: { display: false }, ticks: { font: { size: 9 }, color: green } } } },
              } as any} />
            </div>
            <div className="insight" style={{ background: '#EDC48815', borderColor: '#EDC488', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#8B6914' }}>Hi Society has the most overdue — live client product</div>
              <div className="i-txt">Overdue tasks here are a direct client retention risk.</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'var(--dark)' }}>Reopened issues (31) — recurring problems:</div>
              <div style={{ fontSize: 11, padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>🔄 Hi Society Revamp — reopened 3x</div>
              <div style={{ fontSize: 11, padding: '5px 0', borderBottom: '1px solid var(--divider)' }}>🔄 Panchshil Connect Events — reopened 2x</div>
              <div style={{ fontSize: 11, padding: '5px 0' }}>🔄 FM Matrix Password Reset — reopened 2x</div>
            </div>
          </div>
        </div>
      </div>

      {/* MOM EFFECTIVENESS */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">MoM Effectiveness</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>Are meetings turning into action? · 6-month trend</span>
        </div>
        <div className="g g3">
          <div className="card">
            <div className="ct">MoM conducted — last 6 months</div>
            <div style={{ height: 140 }}>
              <ChartCanvas id="momChart" config={{
                type: 'bar',
                data: { labels: ['Oct 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Jun 26', 'Dec 26'], datasets: [{ data: [2, 15, 3, 1, 1, 1], backgroundColor: [ok, ok, warn, err, err, err], borderRadius: 4 }] },
                options: baseOpts(false),
              } as any} />
            </div>
            <div style={{ marginTop: 10 }}>
              {[['Dec 2025', '#0A7A6A', '15 MoMs'], ['Jan 2026', '', '3 MoMs'], ['Feb 2026', '', '1 MoM'], ['Jun 2026', '', '1 MoM'], ['Dec 2026', '', '1 MoM']].map(([label, color, val]) => (
                <div key={label} className="row"><span className="rn">{label}</span><span className="rv" style={{ color: color || 'var(--dark)' }}>{val}</span></div>
              ))}
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>MoM usage collapsed after Dec 2025</div>
              <div className="i-txt">Only 6 MoMs recorded in 2026. Either meetings stopped or the team stopped recording them in PATM. Both are problems.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">MoM action items — status breakdown</div>
            <div style={{ height: 140 }}>
              <ChartCanvas id="momTaskChart" config={{
                type: 'doughnut',
                data: { labels: ['No Status', 'Completed', 'Open', 'In Progress', 'Other'], datasets: [{ data: [3546, 547, 468, 406, 4], backgroundColor: [err + '88', ok, warn, blue, dark + '44'], borderWidth: 0, hoverOffset: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } } } },
              } as any} />
            </div>
            <div style={{ marginTop: 10 }}>
              {[['No status set', '#C0303D', '3,546 (71%)'], ['Completed', '#0A7A6A', '547 (11%)'], ['Open', '#8B6914', '468 (9%)'], ['In Progress', '', '406 (8%)']].map(([label, color, val]) => (
                <div key={label as string} className="row"><span className="rn">{label}</span><span className="rv" style={{ color: color as string || 'var(--dark)' }}>{val}</span></div>
              ))}
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>71% of meeting action items have no status</div>
              <div className="i-txt">3,546 action items raised in meetings are floating with no owner. Make status mandatory when creating MoM tasks.</div>
            </div>
          </div>
          <div className="card">
            <div className="ct">MoM follow-through rate</div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#C0303D', lineHeight: 1 }}>11%</div>
              <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 6 }}>of action items completed</div>
              <div style={{ background: '#E7848E20', border: '1px solid #E7848E55', borderRadius: 'var(--r100)', padding: '5px 16px', display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 700, color: '#C0303D' }}>
                🔴 Critical — Target 80%+
              </div>
            </div>
            <div style={{ height: 6, background: 'var(--divider)', borderRadius: 3, overflow: 'hidden', margin: '0 16px 16px' }}>
              <div style={{ width: '11%', height: 6, background: '#E7848E', borderRadius: 3 }} />
            </div>
            <div style={{ padding: '0 4px' }}>
              <div className="row"><span className="rn">Action items raised total</span><span className="rv">4,970</span></div>
              <div className="row"><span className="rn">Completed</span><span className="rv" style={{ color: '#0A7A6A' }}>547</span></div>
              <div className="row"><span className="rn">No status (lost)</span><span className="rv" style={{ color: '#C0303D' }}>3,546</span></div>
            </div>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>Meetings are not producing tracked action</div>
              <div className="i-txt">Only 11% of what is decided in meetings gets done. The MoM workflow exists in PATM — the team is not using it. Needs a process mandate.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
