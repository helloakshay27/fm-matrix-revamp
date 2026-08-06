import ChartCanvas from '../ChartCanvas';
import { useCeoDashboardPortfolioHealth } from '@/hooks/useCeoDashboardPortfolioHealth';
import { useCeoDashboardProjectTypeClassification } from '@/hooks/useCeoDashboardProjectTypeClassification';
import { useCeoDashboardProjectMatrix } from '@/hooks/useCeoDashboardProjectMatrix';
import { useCeoDashboardDepartmentHealthScorecard } from '@/hooks/useCeoDashboardDepartmentHealthScorecard';
import type { CeoDashboardWorkTypeStat, CeoDashboardProjectMatrixRow, CeoDashboardDepartmentScorecardRow } from '@/types/ceoDashboard';

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

function fmt(n: number | undefined) {
  return typeof n === 'number' ? n.toLocaleString('en-IN') : '—';
}

function WorkTypeRow({ label, stat }: { label: string; stat: CeoDashboardWorkTypeStat | undefined }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{stat && stat.open > 0 ? <span style={{ color: '#8B6914', fontWeight: 600 }}>{fmt(stat.open)}</span> : <span style={{ color: 'var(--muted)' }}>{fmt(stat?.open)}</span>}</td>
      <td>
        <span style={{ color: '#108C72', fontWeight: 600 }}>{fmt(stat?.done)}</span>{' '}
        {stat && <span style={{ fontSize: 9, color: 'var(--sub)' }}>({stat.done_percentage}%)</span>}
      </td>
      <td>{stat && stat.overdue > 0 ? <span style={{ color: '#C0303D', fontWeight: 700 }}>{fmt(stat.overdue)}</span> : <span style={{ color: 'var(--muted)' }}>{fmt(stat?.overdue)}</span>}</td>
      <td><strong>{fmt(stat?.total)}</strong></td>
    </tr>
  );
}

function splitBlockersSummary(summary: string | undefined) {
  if (!summary) return { heading: '', detail: '' };
  const match = summary.match(/^(.*?)\.\s*(Overdue tasks.*)$/s);
  if (match) return { heading: match[1], detail: match[2] };
  return { heading: summary, detail: '' };
}

const STATUS_DOT_COLOR: Record<string, string> = {
  green: '#108C72',
  orange: '#EDC488',
  red: '#E7848E',
};

const TYPE_BADGE: Record<string, { className?: string; style?: React.CSSProperties }> = {
  Ongoing: { className: 'badge bb' },
  Internal: { className: 'badge bt' },
  Deliverable: { style: { background: '#DA775620', color: '#A0522D' } },
};

const FLAG_BADGE_CLASS: Record<string, string> = {
  Healthy: 'bg',
  Watch: 'bw',
  'At Risk': 'bw',
  Slow: 'bw',
  Idle: 'br',
  Critical: 'br',
};

function ProjectMatrixTableRow({ row }: { row: CeoDashboardProjectMatrixRow }) {
  const typeBadge = TYPE_BADGE[row.type] ?? { className: 'badge bd' };
  const flagClass = FLAG_BADGE_CLASS[row.flag] ?? 'bd';
  const isStale = row.flag === 'Idle' || row.flag === 'Critical';

  return (
    <tr>
      <td><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: STATUS_DOT_COLOR[row.status] ?? '#9E9E9E' }} /></td>
      <td style={{ fontWeight: 600 }}>{row.project}</td>
      <td><span className={typeBadge.className} style={{ fontSize: 9, ...typeBadge.style }}>{row.type}</span></td>
      <td>{row.manager}</td>
      <td><span className={`badge ${flagClass}`}>{row.health_metric}</span></td>
      <td><span className={`badge ${row.issues > 0 ? 'br' : 'bd'}`}>{row.issues}</span></td>
      <td style={{ color: isStale ? '#E7848E' : 'var(--sub)' }}>{row.last_active}</td>
      <td><span className={`badge ${flagClass}`}>{row.flag}</span></td>
    </tr>
  );
}

const DEPT_HEALTH_STYLE: Record<string, { emoji: string; background: string; color: string; rowBg?: string }> = {
  Critical: { emoji: '🔴', background: '#E7848E20', color: '#C0303D', rowBg: '#E7848E08' },
  'At Risk': { emoji: '🟡', background: '#EDC48820', color: '#8B6914' },
  Healthy: { emoji: '🟢', background: '#89F7E720', color: '#108C72' },
};

function pctColor(pct: number, invert = false) {
  const good = invert ? pct <= 2 : pct >= 75;
  const warnZone = invert ? pct <= 10 : pct >= 50;
  if (good) return '#108C72';
  if (warnZone) return '#8B6914';
  return '#C0303D';
}

function DepartmentScorecardTableRow({ row }: { row: CeoDashboardDepartmentScorecardRow }) {
  const healthStyle = DEPT_HEALTH_STYLE[row.health] ?? DEPT_HEALTH_STYLE.Healthy;

  return (
    <tr style={healthStyle.rowBg ? { background: healthStyle.rowBg } : undefined}>
      <td style={{ fontWeight: 700, color: 'var(--terra)' }}>{row.department_name}</td>
      <td>{fmt(row.people)}</td>
      <td style={{ color: row.open_tasks > 0 ? '#8B6914' : undefined, fontWeight: row.open_tasks > 200 ? 700 : 600 }}>{fmt(row.open_tasks)}</td>
      <td>{fmt(row.in_progress)}</td>
      <td style={{ color: '#108C72' }}>{fmt(row.completed)}</td>
      <td style={{ color: row.overdue > 0 ? '#C0303D' : undefined, fontWeight: row.overdue > 0 ? 700 : 400 }}>{fmt(row.overdue)}</td>
      <td style={{ color: pctColor(row.completion_percentage) }}>{row.completion_percentage}%</td>
      <td style={{ color: pctColor(row.overdue_percentage, true) }}>{row.overdue_percentage}%</td>
      <td>
        <span className="badge" style={{ background: healthStyle.background, color: healthStyle.color }}>
          {healthStyle.emoji} {row.health}
        </span>
      </td>
    </tr>
  );
}

interface OverviewTabProps {
  fromDate?: string;
  toDate?: string;
}

export default function OverviewTab({ fromDate, toDate }: OverviewTabProps) {
  const { data: portfolioHealth, isLoading, isError } = useCeoDashboardPortfolioHealth(fromDate, toDate);
  const {
    data: projectTypeClassification,
    isLoading: isProjectTypeLoading,
    isError: isProjectTypeError,
  } = useCeoDashboardProjectTypeClassification(fromDate, toDate);
  const {
    data: projectMatrix,
    isLoading: isProjectMatrixLoading,
    isError: isProjectMatrixError,
  } = useCeoDashboardProjectMatrix(fromDate, toDate);
  const {
    data: departmentHealthScorecard,
    isLoading: isDeptScorecardLoading,
    isError: isDeptScorecardError,
  } = useCeoDashboardDepartmentHealthScorecard(fromDate, toDate);

  const workType = portfolioHealth?.work_type_summary;
  const healthSplit = portfolioHealth?.project_health_split;
  const taskStatus = portfolioHealth?.task_status_breakdown;
  const { heading: blockersHeading, detail: blockersDetail } = splitBlockersSummary(workType?.blockers_summary);

  const ongoing = projectTypeClassification?.ongoing;
  const deliverable = projectTypeClassification?.deliverable;
  const internal = projectTypeClassification?.internal;

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
        {isLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading portfolio health…</div>
        )}
        {isError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load portfolio health data</div>
        )}
        {!isLoading && !isError && (
        <div className="g g3">
          {/* Work type summary */}
          <div className="card">
            <div className="ct">Work type summary</div>
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
                <WorkTypeRow label="Projects" stat={workType?.projects} />
                <WorkTypeRow label="Tasks" stat={workType?.tasks} />
                <WorkTypeRow label="Sub-Tasks" stat={workType?.sub_tasks} />
                <WorkTypeRow label="To-Dos" stat={workType?.todos} />
                <WorkTypeRow label="Issues" stat={workType?.issues} />
              </tbody>
            </table>
            {blockersHeading && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>
                  {blockersHeading}
                </div>
                {blockersDetail && <div className="i-txt">{blockersDetail}</div>}
              </div>
            )}
          </div>

          {/* Project health split */}
          <div className="card">
            <div className="ct">Project health split</div>
            <div style={{ height: 150 }}>
              <ChartCanvas
                key={`projHealth-${healthSplit?.healthy.count}-${healthSplit?.at_risk.count}-${healthSplit?.critical.count}`}
                id="projHealth"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: ['Healthy', 'At Risk', 'Critical'],
                    datasets: [{
                      data: [healthSplit?.healthy.count ?? 0, healthSplit?.at_risk.count ?? 0, healthSplit?.critical.count ?? 0],
                      backgroundColor: [ok, warn, err],
                      borderWidth: 0,
                      hoverOffset: 4,
                    }],
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
                <div style={{ fontSize: 20, fontWeight: 700, color: '#108C72' }}>{fmt(healthSplit?.healthy.count)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>{healthSplit?.healthy.percentage}%</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>At Risk</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#EDC488' }}>{fmt(healthSplit?.at_risk.count)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>{healthSplit?.at_risk.percentage}%</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Critical</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#E7848E' }}>{fmt(healthSplit?.critical.count)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>{healthSplit?.critical.percentage}%</div>
              </div>
            </div>
          </div>

          {/* Task status breakdown */}
          <div className="card">
            <div className="ct">Task status breakdown</div>
            <div style={{ height: 200 }}>
              <ChartCanvas
                key={`taskStatus-${taskStatus?.done}-${taskStatus?.open}-${taskStatus?.overdue}`}
                id="taskStatus"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: ['Done', 'Open', 'Overdue'],
                    datasets: [{
                      data: [taskStatus?.done ?? 0, taskStatus?.open ?? 0, taskStatus?.overdue ?? 0],
                      backgroundColor: [ok, lav, err],
                      borderWidth: 0,
                      hoverOffset: 4,
                    }],
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
              <div className="row"><span className="rn">Open</span><span className="rv" style={{ color: '#8B6914' }}>{fmt(taskStatus?.open)}</span></div>
              <div className="row"><span className="rn">In Progress</span><span className="rv" style={{ color: '#6B9BCC' }}>{fmt(taskStatus?.in_progress)}</span></div>
              <div className="row"><span className="rn">Done</span><span className="rv" style={{ color: '#108C72' }}>{fmt(taskStatus?.done)}</span></div>
              <div className="row"><span className="rn">Overdue</span><span className="rv" style={{ color: '#C0303D' }}>{fmt(taskStatus?.overdue)}</span></div>
            </div>
          </div>
        </div>
        )}
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
        {isProjectTypeLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading project type classification…</div>
        )}
        {isProjectTypeError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load project type classification data</div>
        )}
        {!isProjectTypeLoading && !isProjectTypeError && (
        <div className="g g3" style={{ marginBottom: 12 }}>
          <div className="card" style={{ borderLeft: '3px solid var(--blue)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--blue)' }}>Ongoing</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>{fmt(ongoing?.total)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bb">Activity Health</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>Runs continuously — healthy if work logged in last 7 days.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">{fmt(ongoing?.active)} active</span>
              <span className="badge bw">{fmt(ongoing?.at_risk)} at risk</span>
              <span className="badge br">{fmt(ongoing?.stalled)} stalled</span>
            </div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--terra)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--terra)' }}>Deliverable</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>{fmt(deliverable?.total)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bw">Completion %</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>Has a defined outcome — on track if % aligns with time elapsed.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">{fmt(deliverable?.on_track)} on track</span>
              <span className="badge bw">{fmt(deliverable?.at_risk)} at risk</span>
              <span className="badge br">{fmt(deliverable?.critical)} critical</span>
            </div>
          </div>
          <div className="card" style={{ borderLeft: '3px solid var(--green)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--green)' }}>Internal</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--dark)', lineHeight: 1 }}>{fmt(internal?.total)}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>projects</div>
              </div>
              <span className="badge bt">Task Velocity</span>
            </div>
            <div style={{ fontSize: 10, color: '#4A4A4A', marginBottom: 10 }}>GoPhygital team ops — healthy if closing ≥5 tasks/week.</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge bg">{fmt(internal?.healthy)} healthy</span>
              <span className="badge bw">{fmt(internal?.slow)} slow</span>
              <span className="badge br">{fmt(internal?.idle)} idle</span>
            </div>
          </div>
        </div>
        )}
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
        {isProjectMatrixLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading project matrix…</div>
        )}
        {isProjectMatrixError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load project matrix data</div>
        )}
        {!isProjectMatrixLoading && !isProjectMatrixError && (
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
              {projectMatrix?.matrix.map((row) => (
                <ProjectMatrixTableRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* DEPARTMENT HEALTH SCORECARD */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Department Health Scorecard</div>
          <div className="sec-line" />
        </div>
        {isDeptScorecardLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading department health scorecard…</div>
        )}
        {isDeptScorecardError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load department health scorecard data</div>
        )}
        {!isDeptScorecardLoading && !isDeptScorecardError && (
        <>
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
              {departmentHealthScorecard?.scorecard.map((row) => (
                <DepartmentScorecardTableRow key={row.department_id ?? row.department_name} row={row} />
              ))}
            </tbody>
          </table>
        </div>
        {departmentHealthScorecard?.warning_box && (
          <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
            <div className="i-lbl" style={{ color: '#C0303D' }}>
              {departmentHealthScorecard.warning_box.title}
            </div>
            <div className="i-txt">
              {departmentHealthScorecard.warning_box.description}
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
