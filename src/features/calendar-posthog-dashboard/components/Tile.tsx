import type { CSSProperties } from 'react';
import { InfoButton } from '@/features/analytics-dashboard-shared/components/InfoButton';
import { useCalendarDashboard } from '../context/calendarDashboardStore';
import type { CalendarTileSpec } from '../data/calendarMetricIds';
import { kpiInfo } from '../data/kpiInfo';

/**
 * One KPI tile, rendered from the `TileSpec` the shared metrics layer produces. The target
 * row is user-editable and purely local — it never reaches the API.
 */
export function Tile({ spec }: { spec: CalendarTileSpec }) {
  const { getBenchmark, setBenchmark } = useCalendarDashboard();
  const info = kpiInfo(spec.infoLabel);
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
        <InfoButton>
          <>
            <b>Formula</b>
            {info.f}
            <div className="sep">
              <b>Business meaning</b>
              {info.m}
            </div>
          </>
        </InfoButton>
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

/** Convenience renderer for a `.tiles` grid. */
export function Tiles({
  specs,
  columns,
  style,
}: {
  specs: CalendarTileSpec[];
  columns: number;
  style?: CSSProperties;
}) {
  return (
    <div className="tiles" style={{ gridTemplateColumns: `repeat(${columns},1fr)`, ...style }}>
      {specs.map((s) => (
        <Tile key={s.id} spec={s} />
      ))}
    </div>
  );
}
