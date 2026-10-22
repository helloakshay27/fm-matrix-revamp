import type { CSSProperties } from 'react';
import { InfoButton } from '@/features/analytics-dashboard-shared/components/InfoButton';
import { SkeletonTile } from './Skeleton';
import type { AccountingTileSpec } from '../data/accountingMetricIds';
import { kpiInfo } from '../data/kpiInfo';

/**
 * One KPI tile, rendered from the `TileSpec` the shared metrics layer produces.
 * The target / benchmark row has been removed per product decision — KPIs are
 * read-only here and the on/off-target badge is not shown.
 */
export function Tile({ spec }: { spec: AccountingTileSpec }) {
  const info = kpiInfo(spec.infoLabel);
  const deltaText =
    spec.delta != null || /\b(prev|previous|prior)\b/i.test(spec.deltaText ?? '')
      ? null
      : spec.deltaText;

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
      {deltaText && (
        <div className={`delta ${deltaText.startsWith('▼') ? 'dn' : 'up'}`}>{deltaText}</div>
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
  specs: AccountingTileSpec[];
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
