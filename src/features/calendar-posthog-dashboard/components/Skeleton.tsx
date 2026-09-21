import type { CSSProperties } from 'react';

export function SkeletonBox({
  width = '100%',
  height = 20,
  borderRadius = 6,
  style,
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`cal-skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonTile() {
  return (
    <div className="tile cal-skeleton-tile">
      <div className="tophead">
        <SkeletonBox width="60%" height={16} />
      </div>
      <SkeletonBox width="45%" height={32} style={{ marginTop: 10 }} />
      <SkeletonBox width="55%" height={14} style={{ marginTop: 8 }} />
      <div className="bm" style={{ marginTop: 14 }}>
        <SkeletonBox width="100%" height={16} />
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 220 }: { height?: number }) {
  return (
    <div className="cal-skeleton-chart" style={{ height }}>
      <div className="cal-skeleton-bars" style={{ height: height - 60 }}>
        <div className="cal-skeleton-bar" style={{ height: '35%' }} />
        <div className="cal-skeleton-bar" style={{ height: '65%' }} />
        <div className="cal-skeleton-bar" style={{ height: '45%' }} />
        <div className="cal-skeleton-bar" style={{ height: '80%' }} />
        <div className="cal-skeleton-bar" style={{ height: '55%' }} />
        <div className="cal-skeleton-bar" style={{ height: '90%' }} />
        <div className="cal-skeleton-bar" style={{ height: '70%' }} />
        <div className="cal-skeleton-bar" style={{ height: '85%' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <SkeletonBox width={40} height={12} />
        <SkeletonBox width={40} height={12} />
        <SkeletonBox width={40} height={12} />
        <SkeletonBox width={40} height={12} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <table className="pathtbl" style={{ width: '100%' }}>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, c) => (
            <th key={c}>
              <SkeletonBox width="70%" height={14} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}>
                <SkeletonBox width={c === 0 ? '80%' : '50%'} height={15} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SkeletonFunnel() {
  return (
    <div className="funnel">
      <SkeletonBox width="100%" height={42} borderRadius={8} />
      <SkeletonBox width="85%" height={42} borderRadius={8} />
      <SkeletonBox width="70%" height={42} borderRadius={8} />
      <SkeletonBox width="55%" height={42} borderRadius={8} />
    </div>
  );
}
