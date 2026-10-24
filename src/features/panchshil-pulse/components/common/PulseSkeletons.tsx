import React from "react";

/**
 * Loading placeholders for the Pulse dashboard pages. They reuse the real
 * layout classes (.tiles / .tile / .card / .grid2) so the skeleton occupies the
 * same footprint as the loaded content and nothing shifts when data arrives.
 */

type BarProps = { w?: string | number; h?: number; r?: number; style?: React.CSSProperties };

const Bar: React.FC<BarProps> = ({ w = "100%", h = 12, r, style }) => (
  <span className="skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const TilesSkeleton: React.FC<{ count: number }> = ({ count }) => (
  <div className="tiles" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
    {Array.from({ length: count }).map((_, i) => (
      <div className="tile" key={i}>
        <Bar w="45%" h={13} />
        <Bar w="60%" h={28} style={{ marginTop: 12 }} />
        <Bar w="35%" h={11} style={{ marginTop: 8 }} />
        <Bar w="80%" h={30} r={8} style={{ marginTop: 14 }} />
      </div>
    ))}
  </div>
);

const CardSkeleton: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div className="card" style={style}>
    <div className="card-head">
      <Bar w={140} h={11} />
      <Bar w={220} h={15} style={{ marginTop: 7 }} />
    </div>
    <div className="card-body">{children}</div>
  </div>
);

const ChartBody: React.FC<{ height?: number; tabs?: boolean }> = ({ height = 220, tabs }) => (
  <>
    {tabs && (
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <Bar w={70} h={26} r={8} />
        <Bar w={70} h={26} r={8} />
        <Bar w={70} h={26} r={8} />
      </div>
    )}
    <Bar h={height} r={8} />
    <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
      <Bar w={90} h={10} />
      <Bar w={110} h={10} />
    </div>
  </>
);

const HBarsBody: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="skel-rows">
    {Array.from({ length: rows }).map((_, i) => (
      <div className="skel-hbar" key={i}>
        <Bar w={90} h={11} />
        <Bar w={`${85 - i * 15}%`} h={10} r={5} />
        <Bar w={32} h={11} />
      </div>
    ))}
  </div>
);

const TableBody: React.FC<{ rows?: number; cols?: number }> = ({ rows = 6, cols = 5 }) => (
  <div className="skel-rows">
    {Array.from({ length: rows + 1 }).map((_, r) => (
      <div
        className="skel-trow"
        key={r}
        style={{ gridTemplateColumns: `2fr repeat(${cols - 1}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((__, c) => (
          <Bar key={c} w={c === 0 ? "70%" : "55%"} h={r === 0 ? 10 : 12} />
        ))}
      </div>
    ))}
  </div>
);

const FunnelBody: React.FC = () => (
  <div className="skel-rows">
    {[100, 78, 56, 38].map((w, i) => (
      <Bar key={i} w={`${w}%`} h={40} r={8} />
    ))}
  </div>
);

export const TrafficSkeleton: React.FC = () => (
  <>
    <TilesSkeleton count={3} />
    <div className="grid2">
      <CardSkeleton>
        <ChartBody tabs />
      </CardSkeleton>
      <CardSkeleton>
        <HBarsBody rows={3} />
        <Bar h={54} r={8} style={{ marginTop: 14 }} />
      </CardSkeleton>
    </div>
  </>
);

export const AdoptionSkeleton: React.FC = () => (
  <>
    <TilesSkeleton count={3} />
    <CardSkeleton style={{ marginTop: 12 }}>
      <ChartBody />
    </CardSkeleton>
    <div className="grid2">
      <CardSkeleton>
        <ChartBody height={200} />
      </CardSkeleton>
      <CardSkeleton>
        <TableBody rows={6} cols={6} />
      </CardSkeleton>
    </div>
    <div className="grid2">
      <CardSkeleton>
        <HBarsBody rows={4} />
      </CardSkeleton>
      <CardSkeleton>
        <TableBody rows={4} cols={3} />
      </CardSkeleton>
    </div>
  </>
);

export const WorkflowSkeleton: React.FC = () => (
  <>
    <TilesSkeleton count={4} />
    <CardSkeleton style={{ margin: "16px 0" }}>
      <FunnelBody />
    </CardSkeleton>
    <CardSkeleton style={{ marginTop: 12 }}>
      <TableBody rows={6} cols={5} />
    </CardSkeleton>
    <CardSkeleton style={{ marginTop: 12 }}>
      <TableBody rows={5} cols={4} />
    </CardSkeleton>
  </>
);

/** Placeholder chips for the sub-module segment bar while the module tree loads. */
export const ChipsSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="segbar" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <Bar key={i} w={70 + (i % 3) * 18} h={28} r={20} />
    ))}
  </div>
);
