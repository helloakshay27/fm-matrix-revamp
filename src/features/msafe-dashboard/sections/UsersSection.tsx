import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SliceBarChart } from '../components/DonutChart';
import { UserDirectoryCard } from '../components/UserDirectoryCard';
import { C } from '../data/constants';
import {
  USER_COMP,
  USER_REG_12MO,
  USERS_BY_FUNC,
  USERS_PER_CIRCLE_STACKED,
} from '../data/mockData';

export function UsersSection() {
  const [compMode, setCompMode] = useState('donut');
  const [regMode, setRegMode] = useState('line');
  const [circleMode, setCircleMode] = useState('bar');
  const [funcMode, setFuncMode] = useState('donut');

  return (
    <AccordionShell
      title="Users — Internal & External"
      sub="Who's actually in the system, and how the base is growing"
      excelLabel="Users"
    >
      <div className="g g2">
        <ChartCard
          title="User Composition"
          sub="Internal FTE vs External contractors"
          infoKey="user-comp"
          showPdf
          pdfLabel="User Composition"
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={compMode} onChange={setCompMode} />}
        >
          {compMode === 'donut' && <DonutChart data={USER_COMP} />}
          {compMode === 'bar' && <SliceBarChart data={USER_COMP} />}
          {compMode === 'table' && <ChartTable data={USER_COMP} valueLabel="Users" />}
        </ChartCard>

        <ChartCard
          title="New Registrations · Last 12 Months"
          sub="Monthly onboarding trend"
          infoKey="user-reg"
          showPdf
          pdfLabel="New Registrations"
          chartSwitch={<ChartSwitch modes={['line', 'bar']} value={regMode} onChange={setRegMode} />}
        >
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              {regMode === 'line' ? (
                <AreaChart data={USER_REG_12MO}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="n"
                    stroke={C.terra}
                    fill="rgba(218,119,86,.14)"
                    strokeWidth={2.5}
                    name="New Joiners"
                  />
                </AreaChart>
              ) : (
                <BarChart data={USER_REG_12MO}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Bar dataKey="n" fill={C.terra} radius={[5, 5, 0, 0]} name="New Joiners" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="g g-2-1" style={{ marginTop: 16 }}>
        <ChartCard
          title="Users per Circle"
          sub="Distribution across 22 VIL circles"
          infoKey="user-circle"
          showPdf
          chartSwitch={<ChartSwitch modes={['bar', 'table']} value={circleMode} onChange={setCircleMode} />}
        >
          {circleMode === 'bar' ? (
            <div className="chart-wrap tall">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={USERS_PER_CIRCLE_STACKED} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: C.sage }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10.5 }} iconType="square" iconSize={10} />
                  <Bar dataKey="Internal" stackId="a" fill={C.blue} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="External" stackId="a" fill={C.terra} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-as-table" style={{ maxHeight: 280 }}>
              <table>
                <thead>
                  <tr>
                    <th>Circle</th>
                    <th>Internal</th>
                    <th>External</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {USERS_PER_CIRCLE_STACKED.map((r) => (
                    <tr key={r.name}>
                      <td>{r.name}</td>
                      <td className="num">{r.Internal.toLocaleString()}</td>
                      <td className="num">{r.External.toLocaleString()}</td>
                      <td className="num">{(r.Internal + r.External).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Users by Department / Function"
          sub="Sales, S&D, Technology, HR, Marketing, Ops, etc."
          infoKey="user-func"
          showPdf
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcMode} onChange={setFuncMode} />}
        >
          {funcMode === 'donut' && <DonutChart data={USERS_BY_FUNC} height={280} />}
          {funcMode === 'bar' && <SliceBarChart data={USERS_BY_FUNC} height={280} horizontal />}
          {funcMode === 'table' && <ChartTable data={USERS_BY_FUNC} valueLabel="Users" />}
        </ChartCard>
      </div>

      <UserDirectoryCard style={{ marginTop: 16 }} />
    </AccordionShell>
  );
}
