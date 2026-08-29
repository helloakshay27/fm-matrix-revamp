import { useState } from 'react';
import { useSmartSecureDashboard } from '../context/DashboardContext';
import { InfoButton } from './InfoButton';
import type { TileSpec } from '../data/types';

const ARROW = { up: '▲', dn: '▼', flat: '—' } as const;

/** Ported from the wireframe's own `tile()` function, including the user-editable
 *  benchmark row (bm) with a live on-target / off-target badge. */
export function Tile({ id, label, val, dir, delta, sub, raw, unit, goodUp, noTarget }: TileSpec) {
  const { getBenchmark, setBenchmark } = useSmartSecureDashboard();
  const showTarget = !noTarget && !!id;
  const target = showTarget ? getBenchmark(id!) : null;
  const [draft, setDraft] = useState<string>(target == null ? '' : String(target));

  const hasTarget = target != null && !Number.isNaN(target);
  const met = hasTarget && raw != null && (goodUp !== false ? raw >= target! : raw <= target!);

  const commit = () => {
    if (!id) return;
    const v = draft.trim();
    setBenchmark(id, v === '' ? null : parseFloat(v));
  };

  return (
    <div className="tile">
      <div className="tophead">
        <div className="lbl">{label}</div>
        {id && <InfoButton infoKey={id} />}
      </div>
      <div className="val">{val}</div>
      {delta != null && dir && (
        <div className={`delta ${dir}`}>
          {ARROW[dir]} {delta}
        </div>
      )}
      {sub && <div className="sub2">{sub}</div>}
      {showTarget && (
        <div className="bm">
          <span className="bl">Target</span>
          <input
            className="bmin"
            type="text"
            inputMode="decimal"
            value={draft}
            placeholder="—"
            title="Set your own target for this KPI"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          />
          {unit && <span className="bu">{unit}</span>}
          <span className={`bb ${!hasTarget ? 'unset' : met ? 'met' : 'miss'}`}>
            {!hasTarget ? 'set a target' : met ? '✓ on target' : '✕ off target'}
          </span>
        </div>
      )}
    </div>
  );
}
