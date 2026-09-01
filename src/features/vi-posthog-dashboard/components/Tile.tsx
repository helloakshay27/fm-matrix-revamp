import type { ViTileSpec } from '../data/viMetricIds';
import { useViDashboard } from '../context/viDashboardStore';
import { INFO } from '@/features/posthog-dashboard/data/constants';
import { InfoButton } from './InfoButton';

/**
 * One KPI tile, rendered from the `TileSpec` the shared metrics layer produces. The target
 * row is user-editable and purely local — it never reaches the API.
 */
export function Tile({ spec }: { spec: ViTileSpec }) {
  const { getBenchmark, setBenchmark } = useViDashboard();
  // INFO is keyed by the FM numbering; spec.id carries the Vi numbering.
  const info = INFO[spec.infoKey];
  const target = getBenchmark(spec.id);

  const dir = spec.delta == null ? 'flat' : spec.delta > 0 ? 'up' : spec.delta < 0 ? 'dn' : 'flat';
  const arrow = dir === 'up' ? '▲' : dir === 'dn' ? '▼' : '—';
  // A fall in a "lower is better" metric is good news, so colour by meaning, not by sign.
  const deltaGood = spec.delta == null ? null : spec.goodUp ? spec.delta >= 0 : spec.delta <= 0;

  let badge: JSX.Element;
  if (target == null || Number.isNaN(target)) {
    badge = <span className="bb unset">set a target</span>;
  } else {
    const met = spec.goodUp ? spec.raw >= target : spec.raw <= target;
    badge = <span className={`bb ${met ? 'met' : 'miss'}`}>{met ? '✓ on target' : '✕ off target'}</span>;
  }

  return (
    <div className="tile">
      <div className="tophead">
        <div className="lbl">{spec.label}</div>
        {info && (
          <InfoButton>
            <>
              <b>Formula</b>
              {info.f}
              <div className="sep">
                <b>What it tells you</b>
                {info.d}
              </div>
            </>
          </InfoButton>
        )}
      </div>
      <div className="val">{spec.disp}</div>
      {spec.delta != null && (
        <div className={`delta ${deltaGood ? 'up' : 'dn'}`}>
          {arrow} {Math.abs(spec.delta)}% vs prev. period
        </div>
      )}
      {spec.sub && <div className="sub2">{spec.sub}</div>}
      <div className="bm">
        <span className="bl">Target</span>
        <input
          className="bmin"
          type="text"
          inputMode="decimal"
          value={target == null || Number.isNaN(target) ? '' : String(target)}
          placeholder="—"
          title="Set your own target for this KPI"
          onChange={(e) => {
            const v = e.target.value.trim();
            setBenchmark(spec.id, v === '' ? null : parseFloat(v));
          }}
        />
        {spec.unit && <span className="bu">{spec.unit}</span>}
        {badge}
      </div>
    </div>
  );
}
