import type { CSSProperties } from 'react';
import { InfoButton } from '@/features/analytics-dashboard-shared/components/InfoButton';
import { SkeletonTile } from './Skeleton';
import type { CalendarTileSpec } from '../data/calendarMetricIds';
import { kpiInfo } from '../data/kpiInfo';

/**
 * One KPI tile, rendered from the `TileSpec` the shared metrics layer produces.
 * The target / benchmark row has been removed per product decision — KPIs are
 * read-only here and the on/off-target badge is not shown.
 */
export function Tile({ spec }: { spec: CalendarTileSpec }) {
  const info = kpiInfo(spec.infoLabel);

  const dir = spec.delta == null ? 'flat' : spec.delta > 0 ? 'up' : spec.delta < 0 ? 'dn' : 'flat';
  const arrow = dir === 'up' ? '▲' : dir === 'dn' ? '▼' : '—';
  // A fall in a "lower is better" metric is good news, so colour by meaning, not by sign.
  const deltaGood = spec.delta == null ? null : spec.goodUp ? spec.delta >= 0 : spec.delta <= 0;

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
      {/* Some tiles change by something that is not a percentage — seconds, a step name,
          "vs prior 8 weeks" — so those carry their own line, arrow included. */}
      {spec.deltaText ? (
        <div className={`delta ${spec.deltaText.startsWith('▼') ? 'dn' : 'up'}`}>{spec.deltaText}</div>
      ) : (
        spec.delta != null && (
          <div className={`delta ${deltaGood ? 'up' : 'dn'}`}>
            {arrow} {Math.abs(spec.delta)}% vs prev. period
          </div>
        )
      )}
      {spec.sub && <div className="sub2">{spec.sub}</div>}
    </div>
  );
}

/** Convenience renderer for a `.tiles` grid. */
export function Tiles({
  specs,
  columns,
  style,
  id,
  className,
  loading = false,
}: {
  specs: CalendarTileSpec[];
  columns: number;
  style?: CSSProperties;
  id?: string;
  className?: string;
  loading?: boolean;
}) {
  return (
    <div
      id={id}
      className={`tiles${className ? ` ${className}` : ''}`}
      style={{ gridTemplateColumns: `repeat(${columns},1fr)`, ...style }}
    >
      {loading
        ? Array.from({ length: specs.length || columns }).map((_, i) => (
            <SkeletonTile key={i} />
          ))
        : specs.map((s) => (
            <Tile key={s.id} spec={s} />
          ))}
    </div>
  );
}
