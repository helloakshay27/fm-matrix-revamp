import { useState } from 'react';
import { INFO } from '../data/constants';
import { useDashboard } from '../context/DashboardContext';
import { DeltaArrow } from './DeltaArrow';
import { InfoButton } from './InfoButton';
import type { TileSpec } from '../data/metrics';

export function Tile({ id, label, disp, delta, goodUp, sub, raw, unit }: TileSpec) {
  const { getBenchmark, setBenchmark } = useDashboard();
  const target = getBenchmark(id);
  const [raw_, setRaw] = useState<string>(target == null ? '' : String(target));

  const met = target != null && !Number.isNaN(target) && (goodUp !== false ? raw >= target : raw <= target);
  const hasTarget = target != null && !Number.isNaN(target);

  const commit = () => {
    const v = raw_.trim();
    setBenchmark(id, v === '' ? null : parseFloat(v));
  };

  return (
    <div className="phg-tile">
      {id in INFO && <InfoButton infoKey={id} />}
      <div className="phg-lbl">{label}</div>
      <div className="phg-val">{disp}</div>
      {delta != null && <DeltaArrow delta={delta} goodUp={goodUp} />}
      {sub && <div className="phg-sub2">{sub}</div>}
      <div className="phg-bm">
        <span className="phg-bl">Target</span>
        <input
          className="phg-bmin"
          type="text"
          inputMode="decimal"
          value={raw_}
          placeholder="—"
          title="Set your own target for this KPI"
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        />
        {unit && <span className="phg-bu">{unit}</span>}
        <span className={`phg-bb ${!hasTarget ? 'unset' : met ? 'met' : 'miss'}`}>
          {!hasTarget ? 'set a target' : met ? '✓ on target' : '✕ off target'}
        </span>
      </div>
    </div>
  );
}
