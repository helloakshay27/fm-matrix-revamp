import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SideLegendDonut, SliceBarChart } from '../components/DonutChart';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import {
  KRCC_AGING,
  KRCC_BY_CIRCLE,
  KRCC_CATEGORY,
  KRCC_STATUS,
  KRCC_TURNAROUND,
} from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function KrccSection() {
  const { openDrill } = useMsafeDashboard();
  const [statusMode, setStatusMode] = useState('donut');
  const [catMode, setCatMode] = useState('donut');
  const [tatMode, setTatMode] = useState('bar');

  return (
    <AccordionShell
      title="KRCC — Key Risk Compliance Check"
      sub="Status, aging, and where clearance is falling behind"
      excelLabel="KRCC"
    >
      <div className="g g3">
        <ChartCard
          title="KRCC Clearance Status"
          sub="Cleared vs Pending vs Not Started"
          infoKey="krcc-status"
          showPdf
          pdfLabel="KRCC Clearance Status"
          chartSwitch={<ChartSwitch modes={['donut', 'bar']} value={statusMode} onChange={setStatusMode} />}
        >
          {statusMode === 'donut' ? (
            <SideLegendDonut
              data={KRCC_STATUS}
              centerValue="87.4%"
              centerLabel="Cleared"
              bodyLabel="Users"
              onRowClick={(name) => openDrill(`krcc-${name.toLowerCase().replace(/\s/g, '')}`, name)}
            />
          ) : (
            <SliceBarChart data={KRCC_STATUS} />
          )}
        </ChartCard>

        <ChartCard
          title="KRCC Aging — Pending Requests"
          sub="How long pending KRCCs have been waiting"
          infoKey="krcc-aging"
        >
          <ProgressRows
            rows={KRCC_AGING.map((r) => ({
              ...r,
              onClick: () => openDrill('krcc-stale', r.label),
            }))}
          />
        </ChartCard>

        <ChartCard
          title="KRCC Clearance % by Circle"
          sub="Green = ≥90% · Amber = 75–90% · Red = <75%"
          infoKey="krcc-circle"
          showPdf
          pdfLabel="KRCC by Circle"
        >
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={KRCC_BY_CIRCLE} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.sage }} />
                <YAxis tick={{ fontSize: 10, fill: C.sage }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: C.dark,
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11,
                    color: '#fff',
                  }}
                  formatter={(value) => [`${value}%`, 'Cleared %']}
                />
                <Bar dataKey="pct" radius={[5, 5, 0, 0]} name="Cleared %">
                  {KRCC_BY_CIRCLE.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard
          title="KRCC Cleared by Category"
          sub="Which check category makes up cleared KRCCs"
          infoKey="krcc-category"
          showPdf
          pdfLabel="KRCC by Category"
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
        >
          {catMode === 'donut' && <DonutChart data={KRCC_CATEGORY} />}
          {catMode === 'bar' && <SliceBarChart data={KRCC_CATEGORY} />}
          {catMode === 'table' && <ChartTable data={KRCC_CATEGORY} valueLabel="KRCCs Cleared" />}
        </ChartCard>

        <ChartCard
          title="KRCC Turnaround Time by Circle"
          sub="Avg calendar days from initiation to clearance"
          infoKey="krcc-turnaround"
          showPdf
          pdfLabel="KRCC Turnaround"
          chartSwitch={<ChartSwitch modes={['bar', 'table']} value={tatMode} onChange={setTatMode} />}
        >
          {tatMode === 'table' ? (
            <div className="chart-as-table">
              <table>
                <thead>
                  <tr>
                    <th>Label</th>
                    <th>Avg Days to Clear</th>
                  </tr>
                </thead>
                <tbody>
                  {KRCC_TURNAROUND.map((d) => (
                    <tr key={d.name}>
                      <td>{d.name}</td>
                      <td>{d.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={KRCC_TURNAROUND} margin={{ top: 4, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: C.sage }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={64}
                  />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip
                    contentStyle={{
                      background: C.dark,
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 11,
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} days`, 'Avg Days to Clear']}
                  />
                  <Bar dataKey="days" radius={[5, 5, 0, 0]} name="Avg Days to Clear">
                    {KRCC_TURNAROUND.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>
    </AccordionShell>
  );
}
