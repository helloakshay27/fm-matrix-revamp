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
import { C } from '../data/constants';
import {
  TRAIN_BY_NAME,
  TRAIN_CATEGORY,
  TRAIN_FAILS,
  TRAIN_INT_EXT_BARS,
  TRAIN_PF,
  TRAIN_SCORE,
} from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function TrainingSection() {
  const { openDrill } = useMsafeDashboard();
  const [pfMode, setPfMode] = useState('donut');
  const [catMode, setCatMode] = useState('donut');

  return (
    <AccordionShell
      title="Training — Safety Certification"
      sub="Pass rates, categories, and who still needs a re-attempt"
      excelLabel="Training"
    >
      <div className="g g3">
        <ChartCard
          title="Pass vs Fail Rate"
          sub="All training records"
          infoKey="train-pf"
          showPdf
          chartSwitch={<ChartSwitch modes={['donut', 'bar']} value={pfMode} onChange={setPfMode} />}
        >
          {pfMode === 'donut' ? (
            <SideLegendDonut
              data={TRAIN_PF}
              centerValue="91.7%"
              centerLabel="Pass Rate"
              bodyLabel="Records"
              onRowClick={(name) => openDrill(name === 'Fail' ? 'train-fail' : 'train-pass', name)}
            />
          ) : (
            <SliceBarChart data={TRAIN_PF} />
          )}
        </ChartCard>

        <ChartCard title="Internal vs External Pass Rate" sub="Compared side-by-side" infoKey="train-int-ext">
          <div style={{ padding: '4px 0' }}>
            {TRAIN_INT_EXT_BARS.map((g) => (
              <div key={g.group}>
                <div
                  style={{
                    fontSize: 10.5,
                    color: 'var(--sage)',
                    fontWeight: 600,
                    marginTop: 6,
                    marginBottom: 2,
                  }}
                >
                  {g.group}
                </div>
                {g.rows.map((r) => (
                  <div key={r.label} className="pb-row">
                    <span className="pb-label">{r.label}</span>
                    <div className="pb-wrap">
                      <div className="pb-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                    <span className="pb-val">{r.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Training by Name" sub="Volume by training programme" infoKey="train-name">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TRAIN_BY_NAME} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: C.sage }} />
                <Tooltip />
                <Bar dataKey="value" fill={C.sage} radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Category-wise Trainings"
        sub="Training volume rolled up by category — Statutory Compliance, Technical Safety, Behavioral Safety, Emergency Response, Induction"
        infoKey="train-category"
        showPdf
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
      >
        {catMode === 'donut' && <DonutChart data={TRAIN_CATEGORY} />}
        {catMode === 'bar' && <SliceBarChart data={TRAIN_CATEGORY} />}
        {catMode === 'table' && <ChartTable data={TRAIN_CATEGORY} valueLabel="Records" />}
      </ChartCard>

      <div className="g g-2-1" style={{ marginTop: 16 }}>
        <ChartCard title="Score Distribution" sub="Histogram of actual scores where recorded (n=15,842)" infoKey="train-score">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TRAIN_SCORE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: C.sage }} />
                <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                <Tooltip />
                <Bar dataKey="n" radius={[5, 5, 0, 0]}>
                  {TRAIN_SCORE.map((d) => (
                    <Cell key={d.bucket} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Recent Training Failures"
          sub="Latest sessions requiring re-attempt"
          infoKey="train-fails"
          tag={
            <span
              className="card-tag"
              style={{
                background: 'var(--vi-red-tint)',
                color: 'var(--vi-red)',
                borderColor: 'rgba(238,39,55,.20)',
              }}
            >
              34 last 7 days
            </span>
          }
        >
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Training</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {TRAIN_FAILS.map((t) => (
                  <tr key={t.user + t.tr} onClick={() => openDrill('train-fail', t.user)}>
                    <td className="cell-strong">{t.user}</td>
                    <td>{t.tr}</td>
                    <td>
                      <span className={`badge ${t.type === 'Internal' ? 'b-info' : 'b-neutral'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.date}</td>
                    <td>
                      <span className="badge b-fail">{t.score}/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </AccordionShell>
  );
}
