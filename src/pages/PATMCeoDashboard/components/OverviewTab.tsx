import ChartCanvas from '../ChartCanvas';

const terra = '#DA7756', ok = '#108C72', warn = '#EDC488', err = '#E7848E',
  dark = '#2C2C2C', lav = '#CECBF6', blue = '#6B9BCC', grid = 'rgba(197,184,157,0.22)',
  green = '#798C5E';

const baseOptions = (legend = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: legend, labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } },
    tooltip: { titleFont: { size: 11 }, bodyFont: { size: 10 } },
  },
  scales: {
    x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
    y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } },
  },
});

export default function OverviewTab() {
  return (
    <div>
      {/* EXECUTIVE BRIEFING */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Executive Briefing</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>
            AI-generated · 08 May 2026 · 01:07 PM
          </span>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg,#2C2C2C,#3D2E20)',
            borderRadius: 'var(--r12)',
            padding: '20px 24px',
            border: '1px solid rgba(218,119,86,.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>🤖</div>
            <div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.1em',
                  color: 'rgba(255,255,255,.4)',
                  marginBottom: 8,
                }}
              >
                Daily CEO Briefing — Thursday, 07 May 2026
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.9)', lineHeight: 1.8, fontWeight: 400 }}>
                Yesterday the team completed <strong style={{ color: '#89F7E7' }}>88 tasks</strong> but{' '}
                <strong style={{ color: '#E7848E' }}>14 new tasks became overdue</strong>, continuing a 5-week pattern
                of backlog growth. Bilal Shaikh's open task count crossed 400 for the first time — up from 380 last week
                — while Abdul Ghaffar has not completed a single task this month despite having 394 assigned. Two
                critical projects, <strong style={{ color: '#EDC488' }}>Parking and PTW</strong>, have had zero activity
                in the last 7+ days and remain at near-zero completion. The MoM recorded on 07 May has 0% follow-through
                so far — none of its action items have been started.{' '}
                <strong style={{ color: '#E7848E' }}>Your action needed today:</strong> Set end dates on FM Matrix App
                Revamp and Snag 360 App Revamp before the team standup — both are High priority with no deadline.
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <div
                  style={{
                    background: 'rgba(231,132,142,.15)',
                    border: '1px solid rgba(231,132,142,.3)',
                    borderRadius: 'var(--r100)',
                    padding: '4px 12px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#E7848E',
                  }}
                >
                  🔴 2 critical actions
                </div>
                <div
                  style={{
                    background: 'rgba(237,196,136,.15)',
                    border: '1px solid rgba(237,196,136,.3)',
                    borderRadius: 'var(--r100)',
                    padding: '4px 12px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#EDC488',
                  }}
                >
                  🟡 3 items to watch
                </div>
                <div
                  style={{
                    background: 'rgba(137,247,231,.1)',
                    border: '1px solid rgba(137,247,231,.2)',
                    borderRadius: 'var(--r100)',
                    padding: '4px 12px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#89F7E7',
                  }}
                >
                  ✅ 88 tasks completed yesterday
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO HEALTH */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Portfolio Health</div>
          <div className="sec-line" />
        </div>
        <div className="g g3">
          {/* Work type summary */}
          <div className="card">
            <div className="ct">Work type summary — 07 May 2026</div>
            <table className="ph-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Type</th>
                  <th>Open</th>
                  <th>Done</th>
                  <th>Overdue</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Projects</td>
                  <td>—</td>
                  <td>—</td>
                  <td>—</td>
                  <td><strong>39</strong></td>
                </tr>
                <tr>
                  <td>Tasks</td>
                  <td><span style={{ color: '#8B6914', fontWeight: 600 }}>3,265</span></td>
                  <td>
                    <span style={{ color: '#108C72', fontWeight: 600 }}>2,735</span>{' '}
                    <span style={{ fontSize: 9, color: 'var(--sub)' }}>(45%)</span>
                  </td>
                  <td><span style={{ color: '#C0303D', fontWeight: 700 }}>116</span></td>
                  <td><strong>6,000</strong></td>
                </tr>
                <tr>
                  <td>Sub-Tasks</td>
                  <td><span style={{ color: 'var(--muted)' }}>0</span></td>
                  <td><span style={{ color: '#108C72', fontWeight: 600 }}>56</span></td>
                  <td><span style={{ color: '#C0303D', fontWeight: 700 }}>7</span></td>
                  <td><strong>63</strong></td>
                </tr>
                <tr>
                  <td>To-Dos</td>
                  <td><span style={{ color: '#8B6914', fontWeight: 600 }}>10</span></td>
                  <td><span style={{ color: '#108C72', fontWeight: 600 }}>1,493</span></td>
                  <td><span style={{ color: '#C0303D', fontWeight: 700 }}>80</span></td>
                  <td><strong>1,583</strong></td>
                </tr>
                <tr>
                  <td>Issues</td>
                  <td><span style={{ color: '#C0303D', fontWeight: 700 }}>139</span></td>
                  <td><span style={{ color: '#108C72', fontWeight: 600 }}>861</span></td>
                  <td>—</td>
                  <td><strong>1,000</strong></td>
                </tr>
              </tbody>
            </table>
            <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
              <div className="i-lbl" style={{ color: '#C0303D' }}>
                6 projects critical — Parking, PTW, HSE, ZUWOS, Hi Society, MSafe
              </div>
              <div className="i-txt">
                Overdue tasks and 80 overdue To-Dos are the primary blockers across all of them.
              </div>
            </div>
          </div>

          {/* Project health split */}
          <div className="card">
            <div className="ct">Project health split</div>
            <div style={{ height: 150 }}>
              <ChartCanvas
                id="projHealth"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: ['Healthy', 'At Risk', 'Critical'],
                    datasets: [{ data: [15, 16, 8], backgroundColor: [ok, warn, err], borderWidth: 0, hoverOffset: 4 }],
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                      legend: { display: true, position: 'right', labels: { font: { size: 10 }, boxWidth: 8, padding: 6, color: dark } },
                    },
                  },
                }}
              />
            </div>
            <div className="g g3" style={{ gap: 8, marginTop: 12 }}>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Healthy</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#108C72' }}>15</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>38%</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>At Risk</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#EDC488' }}>16</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>41%</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Critical</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#E7848E' }}>8</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>21%</div>
              </div>
            </div>
          </div>

          {/* Task status breakdown */}
          <div className="card">
            <div className="ct">Task status breakdown</div>
            <div style={{ height: 200 }}>
              <ChartCanvas
                id="taskStatus"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: ['Done', 'Open', 'Overdue'],
                    datasets: [{ data: [5312, 7141, 2192], backgroundColor: [ok, lav, err], borderWidth: 0, hoverOffset: 4 }],
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '60%',
                    plugins: {
                      legend: { display: true, position: 'right', labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } },
                    },
                  },
                }}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="row"><span className="rn">Open</span><span className="rv" style={{ color: '#8B6914' }}>7,141</span></div>
              <div className="row"><span className="rn">In Progress</span><span className="rv" style={{ color: '#6B9BCC' }}>2,773</span></div>
              <div className="row"><span className="rn">Done</span><span className="rv" style={{ color: '#108C72' }}>5,312</span></div>
              <div className="row"><span className="rn">Overdue</span><span className="rv" style={{ color: '#C0303D' }}>2,192</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT TYPE CLASSIFICATION */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Project Type Classification</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>
            Health metric varies by type — completion % only applies to Deliverable projects
          </span>
        </div>
        <div className="g g3" style={{ marginBottom: 12 }}>
          <div className="card" style={{ borderLeft: '3px solid var(--blue)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--blue)' }}>Ongoing</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>18</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bb">Activity Health</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>Runs continuously — healthy if work logged in last 7 days.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">9 active</span>
              <span className="badge bw">5 at risk</span>
              <span className="badge br">4 stalled</span>
            </div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--terra)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--terra)' }}>Deliverable</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>14</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bw">Completion %</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>Has a defined outcome — on track if % aligns with time elapsed.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">4 on track</span>
              <span className="badge bw">6 at risk</span>
              <span className="badge br">4 critical</span>
            </div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--green)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--green)' }}>Internal</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>7</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bt">Task Velocity</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>GoPhygital team ops — healthy if closing ≥5 tasks/week.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">3 healthy</span>
              <span className="badge bw">2 slow</span>
              <span className="badge br">2 idle</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--sub)', fontStyle: 'italic', marginBottom: 20 }}>
          ⚠ Types inferred from project behaviour — Akshay to add <strong style={{ color: 'var(--dark)' }}>project_type</strong> field in storejust to make this automatic.
        </div>
      </div>

      {/* PROJECT MATRIX */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Project Matrix</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>
            Health metric varies by project type — see legend above
          </span>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Status</th>
                <th>Project</th>
                <th>Type</th>
                <th>Manager</th>
                <th>Health Metric</th>
                <th>Issues</th>
                <th>Last Active</th>
                <th>Flag</th>
              </tr>
            </thead>
            <tbody>
              {/* ONGOING */}
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#108C72' }} /></td>
                <td style={{ fontWeight: 600 }}>Hi Society</td>
                <td><span className="badge bb" style={{ fontSize: 9 }}>Ongoing</span></td>
                <td>Sadanand Gupta</td>
                <td><span className="badge bg">● Active today</span></td>
                <td><span className="badge br">284</span></td>
                <td style={{ color: 'var(--sub)' }}>Today</td>
                <td><span className="badge bw">Watch</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#108C72' }} /></td>
                <td style={{ fontWeight: 600 }}>FM Matrix</td>
                <td><span className="badge bb" style={{ fontSize: 9 }}>Ongoing</span></td>
                <td>Kshitij Rasal</td>
                <td><span className="badge bg">● Active today</span></td>
                <td><span className="badge br">218</span></td>
                <td style={{ color: 'var(--sub)' }}>Today</td>
                <td><span className="badge bg">Healthy</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#108C72' }} /></td>
                <td style={{ fontWeight: 600 }}>Projects &amp; Task Mgmt</td>
                <td><span className="badge bb" style={{ fontSize: 9 }}>Ongoing</span></td>
                <td>Sadanand Gupta</td>
                <td><span className="badge bg">● Active today</span></td>
                <td><span className="badge br">142</span></td>
                <td style={{ color: 'var(--sub)' }}>Today</td>
                <td><span className="badge bg">Healthy</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#108C72' }} /></td>
                <td style={{ fontWeight: 600 }}>Incident Management</td>
                <td><span className="badge bb" style={{ fontSize: 9 }}>Ongoing</span></td>
                <td>Adhip Shetty</td>
                <td><span className="badge bg">● Active 1d ago</span></td>
                <td><span className="badge bw">74</span></td>
                <td style={{ color: 'var(--sub)' }}>Yesterday</td>
                <td><span className="badge bg">Healthy</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EDC488' }} /></td>
                <td style={{ fontWeight: 600 }}>Club Management</td>
                <td><span className="badge bb" style={{ fontSize: 9 }}>Ongoing</span></td>
                <td>Sadanand Gupta</td>
                <td><span className="badge bw">⚠ Quiet 2d</span></td>
                <td><span className="badge br">98</span></td>
                <td style={{ color: 'var(--sub)' }}>2 days ago</td>
                <td><span className="badge bw">At Risk</span></td>
              </tr>
              {/* DELIVERABLE */}
              {[
                { name: 'HSE App', mgr: 'Shahab Tufail', pct: 38, color: '#EDC488', issues: '31', bw: true, flag: 'Critical' },
                { name: 'MSafe', mgr: 'Vinayak Mane', pct: 28, color: '#EDC488', issues: '18', bw: true, flag: 'Critical' },
                { name: 'PTW', mgr: 'Abdul Ghaffar', pct: 2, color: '#E7848E', issues: '9', bw: true, flag: 'Critical' },
                { name: 'Parking', mgr: 'Abdul Ghaffar', pct: 0, color: '#E7848E', issues: '0', bw: false, flag: 'Critical', lastActive: '29 days ago', lastColor: '#E7848E' },
                { name: 'Brokers CP App', mgr: 'Kshitij Rasal', pct: 0, color: '#E7848E', issues: '0', bw: false, flag: 'Stalled', lastActive: 'No activity', lastColor: '#E7848E' },
              ].map((p) => (
                <tr key={p.name}>
                  <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: p.pct > 5 ? '#EDC488' : '#E7848E' }} /></td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><span className="badge" style={{ fontSize: 9, background: '#DA775620', color: '#A0522D' }}>Deliverable</span></td>
                  <td>{p.mgr}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 60, background: 'var(--divider)', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                        <div style={{ width: `${p.pct}%`, height: 5, background: p.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 10, color: p.color, fontWeight: 600 }}>{p.pct}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${p.bw ? 'bw' : 'bd'}`}>{p.issues}</span></td>
                  <td style={{ color: (p as any).lastColor || 'var(--sub)' }}>{(p as any).lastActive || (p.pct > 10 ? '3 days ago' : p.pct > 1 ? '4 days ago' : '2 days ago')}</td>
                  <td><span className="badge br">{p.flag}</span></td>
                </tr>
              ))}
              {/* INTERNAL */}
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#E7848E' }} /></td>
                <td style={{ fontWeight: 600 }}>GoPhygital.work Corporate</td>
                <td><span className="badge bt" style={{ fontSize: 9 }}>Internal</span></td>
                <td>Sadanand Gupta</td>
                <td><span className="badge br">0 tasks/wk</span></td>
                <td><span className="badge bd">0</span></td>
                <td style={{ color: '#E7848E' }}>22 days ago</td>
                <td><span className="badge br">Idle</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EDC488' }} /></td>
                <td style={{ fontWeight: 600 }}>Dashboard Developments</td>
                <td><span className="badge bt" style={{ fontSize: 9 }}>Internal</span></td>
                <td>Manav Gandhi</td>
                <td><span className="badge bg">12 tasks/wk</span></td>
                <td><span className="badge bd">2</span></td>
                <td style={{ color: 'var(--sub)' }}>Today</td>
                <td><span className="badge bg">Healthy</span></td>
              </tr>
              <tr>
                <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#EDC488' }} /></td>
                <td style={{ fontWeight: 600 }}>Internal Products</td>
                <td><span className="badge bt" style={{ fontSize: 9 }}>Internal</span></td>
                <td>Sadanand Gupta</td>
                <td><span className="badge bw">2 tasks/wk</span></td>
                <td><span className="badge bd">4</span></td>
                <td style={{ color: 'var(--sub)' }}>3 days ago</td>
                <td><span className="badge bw">Slow</span></td>
              </tr>
              <tr>
                <td>—</td>
                <td style={{ color: 'var(--sub)' }}>+ 26 more projects</td>
                <td colSpan={6} style={{ color: 'var(--sub)', fontSize: 10 }}>
                  Mix of Ongoing, Deliverable, and Internal — type classification pending Akshay's field addition
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DEPARTMENT HEALTH SCORECARD */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Department Health Scorecard</div>
          <div className="sec-line" />
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', minWidth: 160 }}>Department</th>
                <th>People</th>
                <th>Open Tasks</th>
                <th>In Progress</th>
                <th>Completed</th>
                <th>Overdue</th>
                <th>Completion %</th>
                <th>Overdue %</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#E7848E08' }}>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Tech</td>
                <td>18</td>
                <td style={{ color: '#C0303D', fontWeight: 700 }}>1,847</td>
                <td>312</td>
                <td style={{ color: '#108C72' }}>1,248</td>
                <td style={{ color: '#C0303D', fontWeight: 700 }}>89</td>
                <td style={{ color: '#C0303D' }}>21%</td>
                <td style={{ color: '#C0303D' }}>4.8%</td>
                <td><span className="badge" style={{ background: '#E7848E20', color: '#C0303D' }}>🔴 Critical</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>No Dept Set</td>
                <td>3</td>
                <td style={{ color: '#C0303D', fontWeight: 700 }}>1,610</td>
                <td>2</td>
                <td style={{ color: '#108C72' }}>2</td>
                <td style={{ color: '#C0303D', fontWeight: 700 }}>1,218</td>
                <td style={{ color: '#C0303D' }}>0.1%</td>
                <td style={{ color: '#C0303D' }}>75.7%</td>
                <td><span className="badge" style={{ background: '#E7848E20', color: '#C0303D' }}>🔴 Critical</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Customer Success</td>
                <td>4</td>
                <td style={{ color: '#8B6914', fontWeight: 600 }}>184</td>
                <td>2</td>
                <td style={{ color: '#108C72' }}>178</td>
                <td style={{ color: '#C0303D' }}>6</td>
                <td style={{ color: '#8B6914' }}>47%</td>
                <td style={{ color: '#8B6914' }}>1.6%</td>
                <td><span className="badge" style={{ background: '#EDC48820', color: '#8B6914' }}>🟡 At Risk</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Quality Assurance</td>
                <td>5</td>
                <td style={{ color: '#8B6914', fontWeight: 600 }}>9</td>
                <td>2</td>
                <td style={{ color: '#108C72' }}>298</td>
                <td style={{ color: '#C0303D' }}>18</td>
                <td style={{ color: '#8B6914' }}>68%</td>
                <td style={{ color: '#8B6914' }}>2.1%</td>
                <td><span className="badge" style={{ background: '#EDC48820', color: '#8B6914' }}>🟡 At Risk</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Ops Excellence</td>
                <td>2</td>
                <td>0</td>
                <td>0</td>
                <td style={{ color: '#108C72' }}>15</td>
                <td style={{ color: '#C0303D' }}>3</td>
                <td style={{ color: '#8B6914' }}>60%</td>
                <td style={{ color: '#8B6914' }}>1.2%</td>
                <td><span className="badge" style={{ background: '#EDC48820', color: '#8B6914' }}>🟡 At Risk</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Finance</td>
                <td>2</td>
                <td>0</td>
                <td>0</td>
                <td style={{ color: '#108C72' }}>3</td>
                <td style={{ color: '#C0303D' }}>1</td>
                <td style={{ color: '#108C72' }}>75%</td>
                <td style={{ color: '#8B6914' }}>1.0%</td>
                <td><span className="badge" style={{ background: '#89F7E720', color: '#108C72' }}>🟢 Healthy</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>Design</td>
                <td>3</td>
                <td>20</td>
                <td>0</td>
                <td style={{ color: '#108C72' }}>172</td>
                <td style={{ color: '#108C72' }}>1</td>
                <td style={{ color: '#108C72' }}>88%</td>
                <td style={{ color: '#108C72' }}>0.1%</td>
                <td><span className="badge" style={{ background: '#89F7E720', color: '#108C72' }}>🟢 Healthy</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: 'var(--terra)' }}>HR &amp; Admin</td>
                <td>2</td>
                <td>0</td>
                <td>0</td>
                <td style={{ color: '#108C72' }}>6</td>
                <td style={{ color: '#108C72' }}>0</td>
                <td style={{ color: '#108C72' }}>100%</td>
                <td style={{ color: '#108C72' }}>0%</td>
                <td><span className="badge" style={{ background: '#89F7E720', color: '#108C72' }}>🟢 Healthy</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
          <div className="i-lbl" style={{ color: '#C0303D' }}>
            Tech and No-Department accounts for 85% of all overdue tasks
          </div>
          <div className="i-txt">
            Design and HR are healthy. QA and CS need attention. Tech is overwhelmed — 1,847 open tasks for 18 people = 103 tasks per person average. No-Department must be fixed immediately — Abdul Ghaffar and Sadanand Gupta need departments assigned in PATM.
          </div>
        </div>
      </div>
    </div>
  );
}
