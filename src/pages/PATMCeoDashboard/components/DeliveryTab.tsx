import ChartCanvas from '../ChartCanvas';
import { useCeoDashboardSprintHealthDetailed } from '@/hooks/useCeoDashboardSprintHealthDetailed';
import { useCeoDashboardDeliveryAccountability } from '@/hooks/useCeoDashboardDeliveryAccountability';
import { useCeoDashboardProjectInactivityAlert } from '@/hooks/useCeoDashboardProjectInactivityAlert';
import { useCeoDashboardBacklogAndIssues } from '@/hooks/useCeoDashboardBacklogAndIssues';
import { useCeoDashboardIssueResolution } from '@/hooks/useCeoDashboardIssueResolution';
import { useCeoDashboardMomEffectiveness } from '@/hooks/useCeoDashboardMomEffectiveness';
import type { CeoDashboardSprintRow, CeoDashboardActiveSprint } from '@/types/ceoDashboard';

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

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[_\s]+/g, ' ').trim();
}

const SPRINT_STATUS_BADGE: Record<string, string> = {
  active: 'bg',
  completed: 'bg',
  open: 'bw',
  overrunning: 'bw',
  started: 'bw',
  'in progress': 'bd',
};

const SPRINT_ACTION_BADGE: Record<string, string> = {
  keep: 'bg',
  'close it': 'bw',
  abandon: 'br',
  delete: 'br',
};

function statusBadgeClass(status: string) {
  return SPRINT_STATUS_BADGE[normalizeKey(status)] ?? 'bd';
}

function actionBadgeClass(action: string) {
  return SPRINT_ACTION_BADGE[normalizeKey(action)] ?? 'bd';
}

function overrunColor(overrun: string) {
  if (/day/i.test(overrun)) return '#E7848E';
  if (overrun === 'Completed' || overrun === 'On time') return '#108C72';
  return 'var(--sub)';
}

function completionColor(pct: number | undefined) {
  if (pct === undefined || Number.isNaN(pct)) return 'var(--sub)';
  if (pct >= 70) return '#108C72';
  if (pct >= 40) return '#8B6914';
  return '#C0303D';
}

function parsePercentage(pct: string) {
  const n = parseFloat(pct);
  return Number.isNaN(n) ? undefined : n;
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string, withYear: boolean) => {
    const dt = new Date(`${d}T00:00:00`);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: withYear ? 'numeric' : undefined });
  };
  return `${fmt(start, false)} → ${fmt(end, true)}`;
}

function SprintHistoryTableRow({ row }: { row: CeoDashboardSprintRow }) {
  return (
    <tr>
      <td style={{ fontWeight: 600 }}>{row.name}</td>
      <td><span className={`badge ${statusBadgeClass(row.status)}`}>{row.status}</span></td>
      <td style={{ color: overrunColor(row.overrun), fontWeight: 600 }}>{row.overrun}</td>
      <td><span className={`badge ${actionBadgeClass(row.action)}`}>{row.action}</span></td>
      <td style={{ color: completionColor(parsePercentage(row.completion_percentage)), fontWeight: 700 }}>{row.completion_percentage}</td>
    </tr>
  );
}

function ActiveSprintCard({ sprint }: { sprint: CeoDashboardActiveSprint }) {
  const isActive = normalizeKey(sprint.status) === 'active';
  const borderColor = isActive ? '#108C7240' : '#EDC48855';
  const insightBg = isActive ? '#108C7212' : '#E7848E12';
  const insightBorder = isActive ? '#108C72' : '#E7848E';
  const insightTitleColor = isActive ? '#108C72' : '#C0303D';

  return (
    <div className="sprint-card" style={{ borderColor, marginTop: 8 }}>
      <div className="sprint-hd">
        <div className="sprint-title">{sprint.name}</div>
        <span className={`badge ${statusBadgeClass(sprint.status)}`}>{sprint.status}</span>
      </div>
      <div className="sprint-meta">
        <span>Owner: {sprint.owner}</span>
        <span>{formatDateRange(sprint.start_date, sprint.end_date)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: 'var(--sub)' }}>Tasks</span>
        <span style={{ fontWeight: 600 }}>{sprint.tasks_done} of {sprint.tasks_total} done</span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${sprint.completion_percentage}%`, background: completionColor(sprint.completion_percentage) }} />
      </div>
      {sprint.warning_box && (
        <div className="insight" style={{ background: insightBg, borderColor: insightBorder, marginTop: 8 }}>
          <div className="i-lbl" style={{ color: insightTitleColor }}>{sprint.warning_box.title}</div>
          <div className="i-txt">{sprint.warning_box.description}</div>
        </div>
      )}
    </div>
  );
}

const MILESTONE_BAR_COLOR: Record<string, string> = {
  open: lav,
  'in progress': warn,
  completed: ok,
  'on hold': dark + '44',
};

const MILESTONE_LINE_COLOR: Record<string, string> = {
  open: lav,
  'in progress': warn,
  completed: '#C0303D',
  'on hold': dark + '66',
};

function formatStatusLabel(status: string) {
  return status.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

const CHART_PALETTE = [err, ok + 'bb', blue, warn, lav, terra, ok, err + '88', warn + 'aa', lav + 'cc', dark + '44'];

function paletteColor(i: number) {
  return CHART_PALETTE[i % CHART_PALETTE.length];
}

const ESCALATION_BUCKET_COLOR = ['#EDC488', '#E7848E', '#C0303D', '#8B0000'];
const ESCALATION_VALUE_COLOR = ['#8B6914', '#C0303D', '#C0303D', '#8B0000'];

const SOURCE_RANK_COLOR = [err, err, warn, warn];

const MOM_STATUS_COLOR: Record<string, string> = {
  'No Status': err + '88',
  Completed: ok,
  Open: warn,
  'In Progress': blue,
  Other: dark + '44',
};

const MOM_STATUS_TEXT_COLOR: Record<string, string> = {
  'No Status': '#C0303D',
  Completed: '#0A7A6A',
  Open: '#8B6914',
};

function momBarColor(count: number, max: number) {
  if (count === 0) return err;
  if (count === max) return ok;
  return warn;
}

interface DeliveryTabProps {
  fromDate?: string;
  toDate?: string;
}

export default function DeliveryTab({ fromDate, toDate }: DeliveryTabProps) {
  const {
    data: sprintHealth,
    isLoading: isSprintHealthLoading,
    isError: isSprintHealthError,
  } = useCeoDashboardSprintHealthDetailed(fromDate, toDate);
  const {
    data: deliveryAccountability,
    isLoading: isDeliveryAccountabilityLoading,
    isError: isDeliveryAccountabilityError,
  } = useCeoDashboardDeliveryAccountability(fromDate, toDate);
  const {
    data: projectInactivityAlert,
    isLoading: isProjectInactivityLoading,
    isError: isProjectInactivityError,
  } = useCeoDashboardProjectInactivityAlert(fromDate, toDate);
  const {
    data: backlogAndIssues,
    isLoading: isBacklogLoading,
    isError: isBacklogError,
  } = useCeoDashboardBacklogAndIssues(fromDate, toDate);

  const deadlineCoverage = deliveryAccountability?.deadline_coverage;
  const milestoneHealth = deliveryAccountability?.milestone_health;
  const zeroActivity = projectInactivityAlert?.zero_activity;
  const lowActivity = projectInactivityAlert?.low_activity;
  const backlogSummary = backlogAndIssues?.summary_bar;
  const createdVsCompleted = backlogAndIssues?.created_vs_completed_panel;
  const velocityPanel = backlogAndIssues?.weekly_completion_velocity_panel;

  const {
    data: issueResolution,
    isLoading: isIssueResolutionLoading,
    isError: isIssueResolutionError,
  } = useCeoDashboardIssueResolution(fromDate, toDate);

  const issueSummary = issueResolution?.summary;
  const avgDaysPanel = issueResolution?.avg_days_to_resolve_panel;
  const escalationPanel = issueResolution?.issues_open_30_plus_escalation_risk_panel;
  const issuesByTypePanel = issueResolution?.issues_by_type_top_sources_panel;
  const overduePanel = issueResolution?.overdue_tasks_reopened_issues_panel;
  const escalationMaxCount = escalationPanel ? Math.max(...escalationPanel.chart_data.map((d) => d.count), 1) : 1;

  const {
    data: momEffectiveness,
    isLoading: isMomEffectivenessLoading,
    isError: isMomEffectivenessError,
  } = useCeoDashboardMomEffectiveness(fromDate, toDate);

  const momConductedPanel = momEffectiveness?.mom_conducted_panel;
  const momStatusPanel = momEffectiveness?.status_breakdown_panel;
  const momFollowThroughPanel = momEffectiveness?.follow_through_panel;
  const momMaxCount = momConductedPanel ? Math.max(...momConductedPanel.chart_data.map((d) => d.count), 1) : 1;

  return (
    <div>
      {/* SPRINT HEALTH */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Sprint Health</div>
          <div className="sec-line" />
          {sprintHealth?.top_warning && (
            <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>
              ⚠ {sprintHealth.top_warning}
            </span>
          )}
        </div>
        {isSprintHealthLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading sprint health…</div>
        )}
        {isSprintHealthError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load sprint health data</div>
        )}
        {!isSprintHealthLoading && !isSprintHealthError && (
        <div className="g g2">
          <div className="card">
            <div className="ct">Active sprints</div>
            {sprintHealth?.active_sprints.length ? (
              sprintHealth.active_sprints.map((sprint) => <ActiveSprintCard key={sprint.id} sprint={sprint} />)
            ) : (
              <div style={{ fontSize: 11, color: 'var(--sub)', padding: '10px 0' }}>No active sprints</div>
            )}
          </div>
          <div className="card">
            <div className="ct">Sprint history — full picture</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#C0303D' }}>{sprintHealth?.summary_cards.abandoned_test}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Abandoned / Test</div>
                <div style={{ fontSize: 9, color: '#C0303D', fontWeight: 600 }}>Never closed</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#EDC488' }}>{sprintHealth?.summary_cards.active_sprints}</div>
                <div style={{ fontSize: 10, color: 'var(--sub)' }}>Active Sprint</div>
                <div style={{ fontSize: 9, color: '#8B6914', fontWeight: 600 }}>In progress</div>
              </div>
              <div className="card-sm" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#108C72' }}>{sprintHealth?.summary_cards.completed}</div>
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
                {sprintHealth?.sprint_history.map((row) => (
                  <SprintHistoryTableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
            {sprintHealth?.bottom_warning && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{sprintHealth.bottom_warning.title}</div>
                <div className="i-txt">{sprintHealth.bottom_warning.description}</div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* DELIVERY ACCOUNTABILITY */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Delivery Accountability</div>
          <div className="sec-line" />
          {deadlineCoverage && deadlineCoverage.no_end_date_count > 0 && (
            <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>⚠ Most projects have no end date set</span>
          )}
        </div>
        {isDeliveryAccountabilityLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading delivery accountability…</div>
        )}
        {isDeliveryAccountabilityError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load delivery accountability data</div>
        )}
        {!isDeliveryAccountabilityLoading && !isDeliveryAccountabilityError && (
        <div className="g g2" style={{ marginBottom: 12 }}>
          <div className="card">
            <div className="ct">Project deadline coverage</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 14 }}>
              {[
                { val: `${deadlineCoverage?.no_end_date_count ?? '—'}`, label: 'No end date set', sub: `${deadlineCoverage?.no_end_date_percentage ?? 0}% of projects`, color: '#C0303D' },
                { val: `${deadlineCoverage?.have_end_date_count ?? '—'}`, label: 'Have end date', sub: `${deadlineCoverage?.have_end_date_percentage ?? 0}% of projects`, color: '#0A7A6A' },
                { val: `${deadlineCoverage?.avg_completion ?? 0}%`, label: 'Avg completion', sub: '', color: '#C0303D' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', border: '1px solid var(--divider)', borderRadius: 'var(--r10)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 10, fontWeight: 600, color: item.color }}>{item.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>Longest running active projects with no end date:</div>
            {deadlineCoverage?.longest_running_projects.length ? (
              deadlineCoverage.longest_running_projects.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: i < deadlineCoverage.longest_running_projects.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                  <span style={{ fontWeight: 600, color: '#C0303D' }}>{String((p as any).name ?? (p as any).project ?? 'Unknown project')}</span>
                  <span style={{ color: 'var(--sub)' }}>{String((p as any).started ?? (p as any).start_date ?? '')}</span>
                  <span style={{ color: '#C0303D', fontWeight: 600 }}>{String((p as any).note ?? (p as any).description ?? '')}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 11, color: 'var(--sub)', padding: '6px 0' }}>All active projects have an end date set</div>
            )}
            {deadlineCoverage?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 12 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{deadlineCoverage.warning_box.title}</div>
                <div className="i-txt">{deadlineCoverage.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">Milestone health — completion vs status</div>
            <div style={{ height: 160 }}>
              <ChartCanvas
                key={`milestoneChart-${milestoneHealth?.chart_data.map((d) => `${d.status}:${d.count}:${d.avg_completion}`).join(',')}`}
                id="milestoneChart"
                config={{
                  type: 'bar',
                  data: {
                    labels: milestoneHealth?.chart_data.map((d) => formatStatusLabel(d.status)) ?? [],
                    datasets: [
                      {
                        label: 'Count',
                        data: milestoneHealth?.chart_data.map((d) => d.count) ?? [],
                        backgroundColor: milestoneHealth?.chart_data.map((d) => MILESTONE_BAR_COLOR[d.status.toLowerCase()] ?? grid) ?? [],
                        borderRadius: 4,
                        yAxisID: 'y',
                      },
                      {
                        label: 'Avg Completion %',
                        data: milestoneHealth?.chart_data.map((d) => d.avg_completion) ?? [],
                        backgroundColor: 'transparent',
                        borderColor: milestoneHealth?.chart_data.map((d) => MILESTONE_LINE_COLOR[d.status.toLowerCase()] ?? grid) ?? [],
                        borderWidth: 2,
                        type: 'line',
                        yAxisID: 'y1',
                        pointRadius: 5,
                        tension: 0.3,
                      },
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
                } as any}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              {milestoneHealth?.chart_data.map((d, i, arr) => {
                const isCompleted = d.status.toLowerCase() === 'completed';
                return (
                  <div key={d.status} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    <span style={{ color: isCompleted ? '#C0303D' : 'var(--dark)', fontWeight: isCompleted ? 600 : 400 }}>
                      {formatStatusLabel(d.status)}{isCompleted ? ' ⚠' : ''}
                    </span>
                    <span style={{ fontWeight: 700, color: isCompleted ? '#C0303D' : 'var(--dark)' }}>{d.count.toLocaleString('en-IN')}</span>
                    <span style={{ color: isCompleted ? '#C0303D' : 'var(--sub)' }}>avg {d.avg_completion}% complete</span>
                  </div>
                );
              })}
            </div>
            {milestoneHealth?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{milestoneHealth.warning_box.title}</div>
                <div className="i-txt">{milestoneHealth.warning_box.description}</div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* PROJECT INACTIVITY ALERT */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Project Inactivity Alert</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>Projects marked Active but no work logged recently</span>
        </div>
        {isProjectInactivityLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading project inactivity alert…</div>
        )}
        {isProjectInactivityError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load project inactivity alert data</div>
        )}
        {!isProjectInactivityLoading && !isProjectInactivityError && (
        <div className="g g2">
          <div className="card">
            <div className="ct">🚨 {zeroActivity?.title}</div>
            {zeroActivity?.projects.map((p, i, arr) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C0303D' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.subtitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#C0303D' }}>{p.days_since_last_activity} days</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>since last activity</div>
                </div>
              </div>
            ))}
            {zeroActivity?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{zeroActivity.warning_box.title}</div>
                <div className="i-txt">{zeroActivity.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">⚠️ {lowActivity?.title}</div>
            {lowActivity?.projects.map((p, i, arr) => (
              <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6914' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>{p.subtitle}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8B6914' }}>{p.days_since_last_task} days</div>
                  <div style={{ fontSize: 10, color: 'var(--sub)' }}>since last task</div>
                </div>
              </div>
            ))}
            {lowActivity?.warning_box && (
              <div className="insight" style={{ background: '#EDC48818', borderColor: '#EDC488', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#8B6914' }}>{lowActivity.warning_box.title}</div>
                <div className="i-txt">{lowActivity.warning_box.description}</div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* BACKLOG & ISSUES */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Backlog &amp; Issues</div>
          <div className="sec-line" />
          {backlogSummary?.net_growth_trend_text && (
            <span style={{ fontSize: 10, color: '#C0303D', paddingLeft: 8 }}>{backlogSummary.net_growth_trend_text}</span>
          )}
        </div>
        {isBacklogLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading backlog &amp; issues…</div>
        )}
        {isBacklogError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load backlog &amp; issues data</div>
        )}
        {!isBacklogLoading && !isBacklogError && (
        <>
        <div className="g g3" style={{ marginBottom: 12 }}>
          {[
            { label: 'Avg Created / Week', val: `${backlogSummary?.avg_created_per_week ?? '—'}`, color: '#C0303D' },
            { label: 'Avg Completed / Week', val: `${backlogSummary?.avg_completed_per_week ?? '—'}`, color: '#8B6914' },
            { label: 'Net Growth / Week', val: `${(backlogSummary?.net_growth_per_week ?? 0) >= 0 ? '+' : ''}${backlogSummary?.net_growth_per_week ?? 0} ↑`, color: '#C0303D', bg: '#E7848E10', border: '#E7848E55', labelColor: '#C0303D' },
          ].map((k) => (
            <div key={k.label} className="card-sm" style={{ textAlign: 'center', padding: 14, background: (k as any).bg, borderColor: (k as any).border }}>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: (k as any).labelColor || 'var(--sub)', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.val}</div>
            </div>
          ))}
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">{createdVsCompleted?.title ?? 'Created vs Completed'}</div>
            <div style={{ height: 180 }}>
              <ChartCanvas
                key={`backlogRaceChart-${createdVsCompleted?.chart_data.map((d) => `${d.week}:${d.created}:${d.completed}`).join(',')}`}
                id="backlogRaceChart"
                config={{
                  type: 'bar',
                  data: {
                    labels: createdVsCompleted?.chart_data.map((d) => d.week) ?? [],
                    datasets: [
                      { label: 'Created', data: createdVsCompleted?.chart_data.map((d) => d.created) ?? [], backgroundColor: err + '88', borderRadius: 3 },
                      { label: 'Completed', data: createdVsCompleted?.chart_data.map((d) => d.completed) ?? [], backgroundColor: ok + '88', borderRadius: 3 },
                    ],
                  },
                  options: baseOpts(true),
                } as any}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              {createdVsCompleted?.metrics.anomaly && (
                <div className="row"><span className="rn">{createdVsCompleted.metrics.anomaly.label}</span><span className="rv" style={{ color: '#8B6914' }}>{createdVsCompleted.metrics.anomaly.value}</span></div>
              )}
              {createdVsCompleted?.metrics.open_tasks && (
                <div className="row"><span className="rn">{createdVsCompleted.metrics.open_tasks.label}</span><span className="rv" style={{ color: '#C0303D' }}>{createdVsCompleted.metrics.open_tasks.value}</span></div>
              )}
              {createdVsCompleted?.metrics.overdue_tasks && (
                <div className="row"><span className="rn">{createdVsCompleted.metrics.overdue_tasks.label}</span><span className="rv" style={{ color: '#C0303D' }}>{createdVsCompleted.metrics.overdue_tasks.value}</span></div>
              )}
            </div>
            {createdVsCompleted?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{createdVsCompleted.warning_box.title}</div>
                <div className="i-txt">{createdVsCompleted.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">{velocityPanel?.title ?? 'Weekly completion velocity'}</div>
            <div style={{ height: 180 }}>
              <ChartCanvas
                key={`velocityChart-${velocityPanel?.chart_data.map((d) => `${d.week}:${d.completed}:${d.target}`).join(',')}`}
                id="velocityChart"
                config={{
                  type: 'line',
                  data: {
                    labels: velocityPanel?.chart_data.map((d) => d.week) ?? [],
                    datasets: [
                      { label: 'Tasks Completed', data: velocityPanel?.chart_data.map((d) => d.completed) ?? [], borderColor: ok, backgroundColor: ok + '18', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: ok, borderWidth: 2 },
                      { label: 'Target', data: velocityPanel?.chart_data.map((d) => d.target) ?? [], borderColor: warn, backgroundColor: 'transparent', borderDash: [6, 3], pointRadius: 0, borderWidth: 1.5 },
                    ],
                  },
                  options: baseOpts(true),
                } as any}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              {velocityPanel?.metrics.best_week && (
                <div className="row"><span className="rn">{velocityPanel.metrics.best_week.label}</span><span className="rv" style={{ color: '#108C72' }}>{velocityPanel.metrics.best_week.value}</span></div>
              )}
              {velocityPanel?.metrics.avg_completion && (
                <div className="row"><span className="rn">{velocityPanel.metrics.avg_completion.label}</span><span className="rv" style={{ color: '#8B6914' }}>{velocityPanel.metrics.avg_completion.value}</span></div>
              )}
              {velocityPanel?.metrics.trend_direction && (
                <div className="row"><span className="rn">{velocityPanel.metrics.trend_direction.label}</span><span className="rv" style={{ color: '#C0303D' }}>{velocityPanel.metrics.trend_direction.value}</span></div>
              )}
              {velocityPanel?.metrics.target_to_clear && (
                <div className="row"><span className="rn">{velocityPanel.metrics.target_to_clear.label}</span><span className="rv" style={{ color: '#C0303D' }}>{velocityPanel.metrics.target_to_clear.value}</span></div>
              )}
            </div>
            {velocityPanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{velocityPanel.warning_box.title}</div>
                <div className="i-txt">{velocityPanel.warning_box.description}</div>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* ISSUE RESOLUTION */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">Issue Resolution</div>
          <div className="sec-line" />
          {issueSummary && (
            <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>
              {issueSummary.total_issues.toLocaleString('en-IN')} issues total · {issueSummary.open_issues.toLocaleString('en-IN')} open · {issueSummary.reopened_issues.toLocaleString('en-IN')} reopened
            </span>
          )}
        </div>
        {isIssueResolutionLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading issue resolution…</div>
        )}
        {isIssueResolutionError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load issue resolution data</div>
        )}
        {!isIssueResolutionLoading && !isIssueResolutionError && (
        <>
        <div className="g g2" style={{ marginBottom: 12 }}>
          <div className="card">
            <div className="ct">{avgDaysPanel?.title ?? 'Avg days to resolve — monthly trend'}</div>
            <div style={{ height: 160 }}>
              <ChartCanvas
                key={`issueResChart-${avgDaysPanel?.chart_data.map((d) => `${d.month}:${d.avg_days}`).join(',')}`}
                id="issueResChart"
                config={{
                  type: 'line',
                  data: {
                    labels: avgDaysPanel?.chart_data.map((d) => d.month) ?? [],
                    datasets: [{ label: 'Avg days to resolve', data: avgDaysPanel?.chart_data.map((d) => d.avg_days) ?? [], borderColor: warn, backgroundColor: warn + '22', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: warn, borderWidth: 2 }],
                  },
                  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } }, y: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green }, min: 0 } } },
                } as any}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              {avgDaysPanel?.metrics.avg_resolution_time_this_month && (
                <div className="row"><span className="rn">{avgDaysPanel.metrics.avg_resolution_time_this_month.label}</span><span className="rv" style={{ color: '#8B6914' }}>{avgDaysPanel.metrics.avg_resolution_time_this_month.value}</span></div>
              )}
              {avgDaysPanel?.metrics.fastest_resolution && (
                <div className="row"><span className="rn">{avgDaysPanel.metrics.fastest_resolution.label}</span><span className="rv" style={{ color: '#108C72' }}>{avgDaysPanel.metrics.fastest_resolution.value}</span></div>
              )}
              {avgDaysPanel?.metrics.slowest_resolution && (
                <div className="row"><span className="rn">{avgDaysPanel.metrics.slowest_resolution.label}</span><span className="rv" style={{ color: '#C0303D' }}>{avgDaysPanel.metrics.slowest_resolution.value}</span></div>
              )}
              {avgDaysPanel?.metrics.issues_open_30_plus_days && (
                <div className="row"><span className="rn">{avgDaysPanel.metrics.issues_open_30_plus_days.label}</span><span className="rv" style={{ color: '#C0303D' }}>{avgDaysPanel.metrics.issues_open_30_plus_days.value}</span></div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="ct">{issuesByTypePanel?.title ?? 'Issues by type + top sources'}</div>
            <div style={{ height: 140 }}>
              <ChartCanvas
                key={`issueType-${issuesByTypePanel?.chart_data.map((d) => `${d.type}:${d.count}`).join(',')}`}
                id="issueType"
                config={{
                  type: 'bar',
                  data: {
                    labels: issuesByTypePanel?.chart_data.map((d) => d.type) ?? [],
                    datasets: [{ data: issuesByTypePanel?.chart_data.map((d) => d.count) ?? [], backgroundColor: issuesByTypePanel?.chart_data.map((_, i) => paletteColor(i)) ?? [], borderRadius: 4 }],
                  },
                  options: baseOpts(false),
                } as any}
              />
            </div>
            {issuesByTypePanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{issuesByTypePanel.warning_box.title}</div>
                <div className="i-txt">{issuesByTypePanel.warning_box.description}</div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <div className="ct-sm">Top issue sources</div>
              {issuesByTypePanel?.top_issue_sources.map((s, i) => (
                <div key={s.source} className="row"><span className="rn">{s.source}</span><span className="rv" style={{ color: SOURCE_RANK_COLOR[i] || 'var(--dark)' }}>{s.count}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="g g2">
          <div className="card">
            <div className="ct">{escalationPanel?.title ?? 'Issues open 30+ days — escalation risk'}</div>
            {escalationPanel?.chart_data.map((r, i) => (
              <div key={r.bucket} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < escalationPanel.chart_data.length - 1 ? '1px solid var(--divider)' : 'none', fontSize: 11 }}>
                <div style={{ width: 70, fontSize: 10, color: 'var(--sub)' }}>{r.bucket}</div>
                <div style={{ flex: 1, height: 8, background: 'var(--divider)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(r.count / escalationMaxCount) * 100}%`, height: 8, background: ESCALATION_BUCKET_COLOR[i % ESCALATION_BUCKET_COLOR.length], borderRadius: 4 }} />
                </div>
                <div style={{ fontWeight: 700, color: ESCALATION_VALUE_COLOR[i % ESCALATION_VALUE_COLOR.length], width: 30, textAlign: 'right' }}>{r.count}</div>
              </div>
            ))}
            {escalationPanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 12 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{escalationPanel.warning_box.title}</div>
                <div className="i-txt">{escalationPanel.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">{overduePanel?.title ?? 'Overdue tasks by project + reopened issues'}</div>
            <div style={{ height: 140 }}>
              <ChartCanvas
                key={`overdueByProj-${overduePanel?.chart_data.map((d) => `${d.project}:${d.count}`).join(',')}`}
                id="overdueByProj"
                config={{
                  type: 'bar',
                  data: {
                    labels: overduePanel?.chart_data.map((d) => d.project) ?? [],
                    datasets: [{ data: overduePanel?.chart_data.map((d) => d.count) ?? [], backgroundColor: overduePanel?.chart_data.map((_, i) => paletteColor(i)) ?? [], borderRadius: 4 }],
                  },
                  options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { titleFont: { size: 11 }, bodyFont: { size: 10 } } }, scales: { x: { grid: { color: grid }, ticks: { font: { size: 9 }, color: green } }, y: { grid: { display: false }, ticks: { font: { size: 9 }, color: green } } } },
                } as any}
              />
            </div>
            {overduePanel?.warning_box && (
              <div className="insight" style={{ background: '#EDC48815', borderColor: '#EDC488', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#8B6914' }}>{overduePanel.warning_box.title}</div>
                <div className="i-txt">{overduePanel.warning_box.description}</div>
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, color: 'var(--dark)' }}>
                Reopened issues ({issueSummary?.reopened_issues ?? 0}) — recurring problems:
              </div>
              {overduePanel?.reopened_issues.length ? (
                overduePanel.reopened_issues.map((r, i, arr) => (
                  <div key={i} style={{ fontSize: 11, padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                    🔄 {String((r as any).name ?? (r as any).title ?? 'Unknown issue')} — reopened {String((r as any).reopen_count ?? (r as any).count ?? '')}x
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 11, color: 'var(--sub)' }}>No reopened issues</div>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </div>

      {/* MOM EFFECTIVENESS */}
      <div className="sec">
        <div className="sec-hd">
          <div className="sec-lbl">MoM Effectiveness</div>
          <div className="sec-line" />
          <span style={{ fontSize: 10, color: 'var(--sub)', paddingLeft: 8 }}>Are meetings turning into action? · 6-month trend</span>
        </div>
        {isMomEffectivenessLoading && (
          <div className="card" style={{ fontSize: 12, color: 'var(--sub)' }}>Loading MoM effectiveness…</div>
        )}
        {isMomEffectivenessError && (
          <div className="card" style={{ fontSize: 12, color: '#C0303D' }}>Failed to load MoM effectiveness data</div>
        )}
        {!isMomEffectivenessLoading && !isMomEffectivenessError && (
        <div className="g g3">
          <div className="card">
            <div className="ct">{momConductedPanel?.title ?? 'MoM conducted — last 6 months'}</div>
            <div style={{ height: 140 }}>
              <ChartCanvas
                key={`momChart-${momConductedPanel?.chart_data.map((d) => `${d.month}:${d.count}`).join(',')}`}
                id="momChart"
                config={{
                  type: 'bar',
                  data: {
                    labels: momConductedPanel?.chart_data.map((d) => d.month) ?? [],
                    datasets: [{ data: momConductedPanel?.chart_data.map((d) => d.count) ?? [], backgroundColor: momConductedPanel?.chart_data.map((d) => momBarColor(d.count, momMaxCount)) ?? [], borderRadius: 4 }],
                  },
                  options: baseOpts(false),
                } as any}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {momConductedPanel?.chart_data.map((d) => (
                <div key={d.month} className="row">
                  <span className="rn">{d.full_month}</span>
                  <span className="rv" style={{ color: d.count === momMaxCount && d.count > 0 ? '#0A7A6A' : 'var(--dark)' }}>{d.count} {d.count === 1 ? 'MoM' : 'MoMs'}</span>
                </div>
              ))}
            </div>
            {momConductedPanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{momConductedPanel.warning_box.title}</div>
                <div className="i-txt">{momConductedPanel.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">{momStatusPanel?.title ?? 'MoM action items — status breakdown'}</div>
            <div style={{ height: 140 }}>
              <ChartCanvas
                key={`momTaskChart-${momStatusPanel?.chart_data.map((d) => `${d.status}:${d.count}`).join(',')}`}
                id="momTaskChart"
                config={{
                  type: 'doughnut',
                  data: {
                    labels: momStatusPanel?.chart_data.map((d) => d.status) ?? [],
                    datasets: [{ data: momStatusPanel?.chart_data.map((d) => d.count) ?? [], backgroundColor: momStatusPanel?.chart_data.map((d) => MOM_STATUS_COLOR[d.status] ?? grid) ?? [], borderWidth: 0, hoverOffset: 4 }],
                  },
                  options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: true, position: 'right', labels: { font: { size: 9 }, boxWidth: 8, padding: 6, color: dark } } } },
                } as any}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              {momStatusPanel?.chart_data.map((d) => (
                <div key={d.status} className="row">
                  <span className="rn">{d.status}</span>
                  <span className="rv" style={{ color: MOM_STATUS_TEXT_COLOR[d.status] || 'var(--dark)' }}>{d.count.toLocaleString('en-IN')} ({d.percentage}%)</span>
                </div>
              ))}
            </div>
            {momStatusPanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{momStatusPanel.warning_box.title}</div>
                <div className="i-txt">{momStatusPanel.warning_box.description}</div>
              </div>
            )}
          </div>
          <div className="card">
            <div className="ct">{momFollowThroughPanel?.title ?? 'MoM follow-through rate'}</div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#C0303D', lineHeight: 1 }}>{momFollowThroughPanel?.completion_percentage}%</div>
              <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 6 }}>{momFollowThroughPanel?.completion_rate_text}</div>
              <div style={{ background: '#E7848E20', border: '1px solid #E7848E55', borderRadius: 'var(--r100)', padding: '5px 16px', display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 700, color: '#C0303D' }}>
                {(momFollowThroughPanel?.completion_percentage ?? 0) >= 80 ? '✅' : '🔴'} {momFollowThroughPanel?.badge}
              </div>
            </div>
            <div style={{ height: 6, background: 'var(--divider)', borderRadius: 3, overflow: 'hidden', margin: '0 16px 16px' }}>
              <div style={{ width: `${momFollowThroughPanel?.completion_percentage ?? 0}%`, height: 6, background: '#E7848E', borderRadius: 3 }} />
            </div>
            <div style={{ padding: '0 4px' }}>
              <div className="row"><span className="rn">Action items raised total</span><span className="rv">{momFollowThroughPanel?.metrics.action_items_raised_total.toLocaleString('en-IN')}</span></div>
              <div className="row"><span className="rn">Completed</span><span className="rv" style={{ color: '#0A7A6A' }}>{momFollowThroughPanel?.metrics.completed.toLocaleString('en-IN')}</span></div>
              <div className="row"><span className="rn">No status (lost)</span><span className="rv" style={{ color: '#C0303D' }}>{momFollowThroughPanel?.metrics.no_status_lost.toLocaleString('en-IN')}</span></div>
            </div>
            {momFollowThroughPanel?.warning_box && (
              <div className="insight" style={{ background: '#E7848E12', borderColor: '#E7848E', marginTop: 10 }}>
                <div className="i-lbl" style={{ color: '#C0303D' }}>{momFollowThroughPanel.warning_box.title}</div>
                <div className="i-txt">{momFollowThroughPanel.warning_box.description}</div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
