import { ChartCard } from '../components/ChartCard';
import { Leaderboard } from '../components/Leaderboard';
import { HEATMAP_DATA, UNDERPERFORM, heatmapClass } from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function HeatmapSection() {
  const { openDrill } = useMsafeDashboard();

  return (
    <div className="sec" id="sec-heatmap">
      <div className="sec-hd">
        <div className="sec-lbl">Circle-wise Compliance Heatmap</div>
        <div className="sec-line" />
      </div>

      <div className="g g-3-2">
        <ChartCard
          title="Compliance by Circle × Module"
          sub="% cleared per module · click a cell to drill into that circle-module combo"
          infoKey="heatmap"
        >
          <div className="hm-wrap">
            <div className="hm-hd">
              <div>Circle</div>
              <div>Training</div>
              <div>KRCC</div>
              <div>LMC</div>
              <div>SMT Visits</div>
              <div>External Approved</div>
            </div>
            {HEATMAP_DATA.map((r) => (
              <div key={r[0]} className="hm-row">
                <div className="hm-label">{r[0]}</div>
                {r.slice(1).map((v, i) => (
                  <div
                    key={i}
                    className={`hm-cell ${heatmapClass(v as number)}`}
                    onClick={() => openDrill('circle-underperform', String(r[0]))}
                    role="button"
                    tabIndex={0}
                  >
                    {v}%
                  </div>
                ))}
              </div>
            ))}
            <div className="hm-scale">
              <span>Compliance</span>
              <div className="hm-scale-block">
                <span className="c1" style={{ background: 'rgba(238,39,55,.28)' }} title="<70%" />
                <span className="c2" style={{ background: 'rgba(237,196,136,.35)' }} title="70–85%" />
                <span className="c3" style={{ background: 'rgba(158,200,186,.35)' }} title="85–95%" />
                <span className="c4" style={{ background: 'rgba(16,140,114,.22)' }} title=">95%" />
              </div>
              <span>&lt;70% → &gt;95%</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Circles That Need Growth in Performance"
          sub="Weighted compliance score across all modules · ranked by opportunity to improve"
          infoKey="priority-circles"
          tag={
            <span
              className="card-tag"
              style={{
                background: 'rgba(237,196,136,.20)',
                color: '#8A5A00',
                borderColor: 'rgba(237,196,136,.40)',
              }}
            >
              Support Focus
            </span>
          }
        >
          <Leaderboard
            items={UNDERPERFORM.map((c) => ({
              name: c.name,
              meta: c.note,
              value: `${c.score}%`,
              onClick: () => openDrill('circle-underperform', c.name),
            }))}
          />
        </ChartCard>
      </div>
    </div>
  );
}
