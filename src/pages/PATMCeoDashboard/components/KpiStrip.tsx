import { useCeoDashboardSummary } from '@/hooks/useCeoDashboardSummary';

function fmt(n: number | undefined) {
  return typeof n === 'number' ? n.toLocaleString('en-IN') : '—';
}

function pct(n: number | undefined) {
  return typeof n === 'number' ? `${n}%` : '—';
}

function rateColor(rate: number | undefined) {
  if (typeof rate !== 'number') return '#EDC488';
  if (rate >= 70) return '#9EC8BA';
  if (rate >= 40) return '#EDC488';
  return '#E7848E';
}

interface KpiStripProps {
  fromDate?: string;
  toDate?: string;
}

export default function KpiStrip({ fromDate, toDate }: KpiStripProps) {
  const { data, isLoading, isError } = useCeoDashboardSummary(fromDate, toDate);

  const projects = data?.projects;
  const tasks = data?.tasks;
  const todos = data?.todos;
  const issues = data?.issues;
  const milestones = data?.milestones;
  const sprintHealth = data?.sprint_health;

  if (isLoading) {
    return (
      <div className="kpi-strip g6">
        <div className="ki" style={{ gridColumn: '1 / -1', color: 'rgba(255,255,255,.85)', fontSize: 12 }}>
          Loading KPIs…
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="kpi-strip g6">
        <div className="ki" style={{ gridColumn: '1 / -1', color: '#fff', fontSize: 12 }}>
          Failed to load KPI data
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-strip g6">
      <div className="ki">
        <div className="kt">Projects</div>
        <div className="kv">{fmt(projects?.total)}</div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.8)' }}>
          {fmt(projects?.critical)} critical · {fmt(projects?.at_risk)} at risk
        </div>
        <div className="kc">{fmt(projects?.healthy)} healthy</div>
      </div>
      <div className="ki">
        <div className="kt">Tasks</div>
        <div className="kv" style={{ color: '#EDC488' }}>{fmt(tasks?.total)}</div>
        <div className="pw">
          <div className="pb" style={{ width: `${tasks?.completion_rate ?? 0}%`, background: rateColor(tasks?.completion_rate) }} />
        </div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.9)' }}>
          {fmt(tasks?.completed)} done · {pct(tasks?.completion_rate)}
        </div>
        <div className="kc">{fmt(tasks?.overdue)} overdue · {fmt(tasks?.open)} open</div>
      </div>
      <div className="ki">
        <div className="kt">To-Dos</div>
        <div className="kv">{fmt(todos?.total)}</div>
        <div className="ks" style={{ color: 'rgba(255,255,255,.8)' }}>
          {fmt(todos?.open)} open · {fmt(todos?.in_progress)} in progress
        </div>
        <div className="kc">{fmt(todos?.standalone_actions)} standalone actions</div>
      </div>
      <div className="ki">
        <div className="kt">Issues</div>
        <div className="kv" style={{ color: '#E7848E' }}>{fmt(issues?.total)}</div>
        <div className="ks" style={{ color: '#E7848E' }}>
          {fmt(issues?.open)} open · {fmt(issues?.reopen)} reopen
        </div>
        <div className="kc">{fmt(issues?.completed)} completed · {fmt(issues?.closed)} closed</div>
      </div>
      <div className="ki">
        <div className="kt">Milestones</div>
        <div className="kv" style={{ color: '#EDC488' }}>{fmt(milestones?.total)}</div>
        <div className="pw">
          <div className="pb" style={{ width: `${milestones?.completion_rate ?? 0}%`, background: rateColor(milestones?.completion_rate) }} />
        </div>
        <div className="ks" style={{ color: '#E7848E' }}>
          {fmt(milestones?.completed)} done · {pct(milestones?.completion_rate)}
        </div>
        <div className="kc">
          {fmt(milestones?.in_progress)} in progress · avg {pct(milestones?.avg_completion_percent)}
        </div>
      </div>
      <div className="ki">
        <div className="kt">Sprint Health</div>
        <div className="kv" style={{ color: '#EDC488' }}>{pct(sprintHealth?.avg_velocity)}</div>
        <div className="pw">
          <div className="pb" style={{ width: `${sprintHealth?.avg_velocity ?? 0}%`, background: rateColor(sprintHealth?.avg_velocity) }} />
        </div>
        <div className="ks" style={{ color: '#E7848E' }}>
          {fmt(sprintHealth?.real_sprints)} real sprint of {fmt(sprintHealth?.total_sprints)}
        </div>
        <div className="kc">{fmt(sprintHealth?.abandoned_or_test)} abandoned or test</div>
      </div>
    </div>
  );
}
