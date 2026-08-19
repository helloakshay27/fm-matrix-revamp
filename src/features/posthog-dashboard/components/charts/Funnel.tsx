import { fmtC } from '../../data/format';
import type { FunnelData } from '../../data/metrics';

export function Funnel({ funnel }: { funnel: FunnelData }) {
  const { steps, reaches, dropPct, worst } = funnel;
  const top = reaches[0] || 1;

  return (
    <div className="funnel">
      {steps.map((step, i) => {
        const w = (reaches[i] / top) * 100;
        const drop = dropPct[i];
        const cls = i === worst ? 'bad' : drop != null && drop > 25 ? 'warn' : '';
        return (
          <div className="frow" key={`${step}-${i}`}>
            <div className="fs">{i + 1}. {step}</div>
            <div className="fbar"><i className={cls} style={{ width: `${w.toFixed(1)}%` }} /></div>
            <div className="fnum">
              {fmtC(reaches[i])}
              {drop != null && <span className="fdrop">-{Math.round(drop)}%</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
