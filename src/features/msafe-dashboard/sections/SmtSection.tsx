import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { DonutChart } from '../components/DonutChart';
import { MsafeChartTooltip } from '../components/MsafeChartTooltip';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import { SMT_BELOW, SMT_BY_CIRCLE, SMT_BY_FUNC, SMT_FREQ, SMT_RECENT } from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function SmtSection() {
  const { openDrill } = useMsafeDashboard();
  const [circleMode, setCircleMode] = useState('bar');

  return (
    <AccordionShell
      title="SMT — Senior Management Tour Field Visits"
      sub="Field visit coverage across circles and functions"
      excelLabel="SMT Visits"
    >
      <div className="g g3">
        <ChartCard
          title="Visits per Circle · This Month"
          sub="Ranked by SMT field visit count"
          infoKey="smt-circle"
          showPdf
          chartSwitch={<ChartSwitch modes={['bar', 'table']} value={circleMode} onChange={setCircleMode} />}
        >
          {circleMode === 'table' ? (
            <div className="chart-as-table">
              <table>
                <thead>
                  <tr>
                    <th>Circle</th>
                    <th>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {SMT_BY_CIRCLE.map((d) => (
                    <tr key={d.name}>
                      <td>{d.name}</td>
                      <td className="num">{d.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={SMT_BY_CIRCLE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: C.sage }} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(44,44,44,.04)' }}
                    content={(props) => <MsafeChartTooltip {...props} bodyLabel="Visits" />}
                  />
                  <Bar dataKey="n" fill={C.lav} radius={[5, 5, 0, 0]} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="SMT by Function" sub="Which functions are doing the visits" infoKey="smt-func">
          <DonutChart data={SMT_BY_FUNC} bodyLabel="Visits" />
        </ChartCard>

        <ChartCard title="Visit Frequency" sub="Sites visited over last quarter" infoKey="smt-freq">
          <ProgressRows rows={SMT_FREQ} />
        </ChartCard>
      </div>

      <div className="g g-2-1" style={{ marginTop: 16 }}>
        <ChartCard
          title="Recent SMT Visits"
          sub="Latest field verifications logged"
          infoKey="smt-recent"
          tag={<span className="card-tag">Last 20</span>}
        >
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Done By</th>
                  <th>Function</th>
                  <th>Circle</th>
                  <th>Area Visited</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {SMT_RECENT.map((s) => (
                  <tr key={s.name + s.date} onClick={() => openDrill('smt-visit', s.name)}>
                    <td className="cell-strong">{s.name}</td>
                    <td>{s.func}</td>
                    <td>{s.circle}</td>
                    <td>{s.area}</td>
                    <td>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard
          title="SMT Visit Progress by Circle"
          sub="Circles currently working toward the 20 visits/month target"
          infoKey="smt-progress"
        >
          <ProgressRows
            rows={SMT_BELOW.map((c) => {
              const pct = Math.round((c.visits / c.target) * 100);
              return {
                label: c.name,
                pct,
                val: `${c.visits}/${c.target}`,
                color: pct < 60 ? C.vi : C.warn,
                onClick: () => openDrill('smt-below', c.name),
              };
            })}
          />
        </ChartCard>
      </div>
    </AccordionShell>
  );
}
