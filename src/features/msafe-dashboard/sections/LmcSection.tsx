import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SliceBarChart } from '../components/DonutChart';
import { Leaderboard } from '../components/Leaderboard';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import {
  LMC_BY_FUNC,
  LMC_DAILY,
  LMC_STATUS,
  LMC_TOP,
  LMC_TREND_12MO,
  LMC_WEEK,
} from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function LmcSection() {
  const { openDrill } = useMsafeDashboard();
  const [dailyMode, setDailyMode] = useState('line');
  const [funcMode, setFuncMode] = useState('donut');
  const [trendMode, setTrendMode] = useState('line');

  return (
    <AccordionShell
      title="LMC — Line Manager Check Activity"
      sub="Daily sign-off volume and manager engagement"
      excelLabel="LMC"
    >
      <div className="g g-2-1">
        <ChartCard
          title="Daily LMC Volume — Last 30 Days"
          sub="Number of LMC sign-offs recorded per day"
          infoKey="lmc-daily"
          showPdf
          chartSwitch={<ChartSwitch modes={['line', 'bar']} value={dailyMode} onChange={setDailyMode} />}
        >
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              {dailyMode === 'line' ? (
                <AreaChart data={LMC_DAILY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.sage }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="n"
                    stroke={C.vi}
                    fill="rgba(238,39,55,.10)"
                    strokeWidth={2.5}
                    name="LMC Sign-offs"
                  />
                </AreaChart>
              ) : (
                <BarChart data={LMC_DAILY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.sage }} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Bar dataKey="n" fill={C.vi} radius={[5, 5, 0, 0]} name="LMC Sign-offs" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="LMC Completion — This Week" sub="Daily target vs actual" infoKey="lmc-week">
          <ProgressRows
            rows={LMC_WEEK.map((r) => ({
              ...r,
              onClick: () => openDrill(`lmc-${r.label.toLowerCase()}`, `LMC · ${r.label}`),
            }))}
          />
        </ChartCard>
      </div>

      <div className="g g3" style={{ marginTop: 16 }}>
        <ChartCard title="Top LMC Managers — Last 30 Days" sub="Most active line managers" infoKey="lmc-managers">
          <Leaderboard
            items={LMC_TOP.map((m) => ({
              name: m.name,
              meta: m.func,
              value: m.count,
              onClick: () => openDrill('user-detail', m.name),
            }))}
          />
        </ChartCard>

        <ChartCard
          title="LMC by Function"
          sub="Which function's managers are most active"
          infoKey="lmc-func"
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcMode} onChange={setFuncMode} />}
        >
          {funcMode === 'donut' && <DonutChart data={LMC_BY_FUNC} />}
          {funcMode === 'bar' && <SliceBarChart data={LMC_BY_FUNC} />}
          {funcMode === 'table' && <ChartTable data={LMC_BY_FUNC} valueLabel="LMC %" />}
        </ChartCard>

        <ChartCard title="LMC Status Breakdown" sub="All LMCs · this month" infoKey="lmc-status">
          <ProgressRows
            rows={LMC_STATUS.map((r) => ({
              ...r,
              onClick: () =>
                openDrill(`lmc-${r.label.toLowerCase().replace(/\s/g, '')}`, r.label),
            }))}
          />
        </ChartCard>
      </div>

      <ChartCard
        title="LMC Completion Trend — Last 12 Months"
        sub="Monthly LMC sign-off volume, long-term view"
        infoKey="lmc-trend-12mo"
        showPdf
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['line', 'bar', 'table']} value={trendMode} onChange={setTrendMode} />}
      >
        {trendMode === 'table' ? (
          <div className="chart-as-table">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Sign-offs</th>
                </tr>
              </thead>
              <tbody>
                {LMC_TREND_12MO.map((r) => (
                  <tr key={r.m}>
                    <td>{r.m}</td>
                    <td className="num">{r.n.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              {trendMode === 'line' ? (
                <AreaChart data={LMC_TREND_12MO}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="n"
                    stroke={C.sage}
                    fill="rgba(121,140,94,.10)"
                    strokeWidth={2.5}
                    name="LMC Sign-offs"
                  />
                </AreaChart>
              ) : (
                <BarChart data={LMC_TREND_12MO}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Bar dataKey="n" fill={C.sage} radius={[5, 5, 0, 0]} name="LMC Sign-offs" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </AccordionShell>
  );
}
