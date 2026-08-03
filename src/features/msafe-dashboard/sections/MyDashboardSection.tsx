import { LayoutDashboard, Plus, X } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { C } from '../data/constants';
import {
  ANALYTICS_CATALOG,
  KRCC_BY_CIRCLE,
  KRCC_CATEGORY,
  KRCC_STATUS,
  KRCC_TURNAROUND,
  LMC_BY_FUNC,
  LMC_DAILY,
  LMC_TREND_12MO,
  SMT_BY_CIRCLE,
  SMT_BY_FUNC,
  TRAIN_BY_NAME,
  TRAIN_CATEGORY,
  TRAIN_PF,
  TRAIN_SCORE,
  USER_COMP,
  USER_REG_12MO,
  USERS_BY_FUNC,
  USERS_PER_CIRCLE_STACKED,
} from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';
import { DonutChart } from '../components/DonutChart';

const KPI_VALUES: Record<string, string> = {
  'kpi-users': '27,438',
  'kpi-krcc': '23,972 (87.4%)',
  'kpi-lmc': '1,284',
  'kpi-training': '94.2%',
  'kpi-smt': '438',
};

function ChartById({ id }: { id: string }) {
  if (id === 'userComp') return <DonutChart data={USER_COMP} height={180} />;
  if (id === 'userFunc') return <DonutChart data={USERS_BY_FUNC} height={180} />;
  if (id === 'krccStatus') return <DonutChart data={KRCC_STATUS} height={180} />;
  if (id === 'krccCategory') return <DonutChart data={KRCC_CATEGORY} height={180} />;
  if (id === 'lmcFunc') return <DonutChart data={LMC_BY_FUNC} height={180} />;
  if (id === 'trainPF') return <DonutChart data={TRAIN_PF} height={180} />;
  if (id === 'trainCategory') return <DonutChart data={TRAIN_CATEGORY} height={180} />;
  if (id === 'smtFunc') return <DonutChart data={SMT_BY_FUNC} height={180} />;

  if (id === 'userReg') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={USER_REG_12MO}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="m" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.terra} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'lmcDaily') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={LMC_DAILY}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="d" tick={{ fontSize: 8 }} interval={5} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.vi} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'lmcTrend12mo') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={LMC_TREND_12MO}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="m" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.sage} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'circleUsers') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={USERS_PER_CIRCLE_STACKED} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-35} textAnchor="end" height={56} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="Internal" stackId="a" fill={C.blue} />
          <Bar dataKey="External" stackId="a" fill={C.terra} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'krccCircle') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={KRCC_BY_CIRCLE}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {KRCC_BY_CIRCLE.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'krccTurnaround') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={KRCC_TURNAROUND}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="days" radius={[4, 4, 0, 0]}>
            {KRCC_TURNAROUND.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'trainName') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={TRAIN_BY_NAME} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis type="number" tick={{ fontSize: 9 }} />
          <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="value" fill={C.sage} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'trainScore') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={TRAIN_SCORE}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="bucket" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="n" radius={[4, 4, 0, 0]}>
            {TRAIN_SCORE.map((d) => (
              <Cell key={d.bucket} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'smtCircle') {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={SMT_BY_CIRCLE}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="n" fill={C.lav} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return <div style={{ padding: 24, color: 'var(--sage)' }}>Chart preview</div>;
}

export function MyDashboardSection() {
  const { selectedAnalytics, setSelectedAnalytics, setAnalyticsOpen } = useMsafeDashboard();

  const items = ANALYTICS_CATALOG.items.filter((i) => selectedAnalytics.includes(i.id));

  return (
    <>
      <div className="page-hd mydash-hd">
        <div>
          <h2>My Dashboard</h2>
          <div className="sub">Your personalized view · pick any metric or chart from M-Safe</div>
        </div>
        <button type="button" className="select-analytics-btn" onClick={() => setAnalyticsOpen(true)}>
          <Plus size={15} />
          Select Analytics
        </button>
      </div>

      {!items.length ? (
        <div className="mydash-empty">
          <LayoutDashboard size={48} />
          <div className="t">No analytics selected yet</div>
          <div className="s">
            Build your own view by picking any KPI or chart from M-Safe. They&apos;ll show up here, live.
          </div>
          <button type="button" className="select-analytics-btn" onClick={() => setAnalyticsOpen(true)}>
            <Plus size={15} />
            Select Analytics
          </button>
        </div>
      ) : (
        <div className="mydash-grid">
          {items.map((it) =>
            it.type === 'kpi' ? (
              <div key={it.id} className="kpi">
                <button
                  type="button"
                  className="mydash-card-remove"
                  onClick={() => setSelectedAnalytics(selectedAnalytics.filter((x) => x !== it.id))}
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
                <div className="kpi-top">
                  <div className="kpi-lbl">{it.label}</div>
                </div>
                <div className="kpi-val">{KPI_VALUES[it.id] || '—'}</div>
                <span className="mydash-module-tag">M-Safe</span>
              </div>
            ) : (
              <div key={it.id} className="card mydash-chart-card">
                <button
                  type="button"
                  className="mydash-card-remove"
                  onClick={() => setSelectedAnalytics(selectedAnalytics.filter((x) => x !== it.id))}
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
                <div className="card-hd">
                  <div>
                    <div className="card-title">{it.label}</div>
                    <span className="mydash-module-tag">M-Safe</span>
                  </div>
                </div>
                <div className="chart-wrap">
                  <ChartById id={it.id} />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <div className="footer">
        My Dashboard · GoPhygital / Lockated for Vodafone Idea · July 2026
      </div>
    </>
  );
}
