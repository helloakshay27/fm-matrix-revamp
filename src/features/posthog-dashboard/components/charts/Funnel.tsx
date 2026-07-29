import { fmtC } from '../../data/format';
import type { FunnelData } from '../../data/metrics';

export function Funnel({ funnel }: { funnel: FunnelData }) {
  const { steps, reaches, worst } = funnel;
  return (
    <div className="phg-funnel">
      {steps.map((step, i) => {
        const w = (reaches[i] / reaches[0]) * 100;
        const dropRatio = i > 0 ? (reaches[i - 1] - reaches[i]) / reaches[i - 1] : 0;
        const cls = i === worst ? 'bad' : i > 0 && dropRatio > 0.25 ? 'warn' : '';
        const drop = i > 0 ? Math.round(dropRatio * 100) : 0;
        return (
          <div className="phg-frow" key={i}>
            <div className="phg-fs">{i + 1}. {step}</div>
            <div className="phg-fbar"><i className={cls} style={{ width: `${w.toFixed(1)}%` }} /></div>
            <div className="phg-fnum">{fmtC(reaches[i])} {i > 0 && <span className="phg-fdrop">-{drop}%</span>}</div>
          </div>
        );
      })}
    </div>
  );
}
