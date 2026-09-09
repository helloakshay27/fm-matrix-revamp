import type { FunnelData } from '../data/metrics';

/** Ported from the wireframe's own funnel markup: full-width colored bars whose width
 *  and opacity shrink step over step, with the drop-off percentage shown above each
 *  step after the first. Visually distinct from the posthog-dashboard Funnel (a
 *  label/thin-bar/count row layout), so kept as its own component rather than reused. */
export function Funnel({ funnel }: { funnel: FunnelData }) {
  return (
    <div className="funnel">
      {funnel.steps.map((s, i) => {
        const width = 45 + (s.pctOfEntrants / 100) * 55;
        return (
          <div key={s.step}>
            {s.dropPct != null && <div className="fdrop">▼ {s.dropPct}% drop-off</div>}
            <div
              className="fstep"
              style={{ width: `${width}%`, background: 'var(--ss-chart-blue)', opacity: 1 - i * 0.1, borderRadius: 8 }}
              title={`${s.step}: ${s.pctOfEntrants}% of entrants remain`}
            >
              {s.step}
              <span className="fsub">{s.pctOfEntrants}% of entrants</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
