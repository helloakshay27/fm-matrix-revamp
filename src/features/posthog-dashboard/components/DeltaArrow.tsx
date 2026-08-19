interface DeltaArrowProps {
  delta: number;
  goodUp?: boolean;
}

/** KPI-tile delta badge, e.g. "↗ +12%" in green or "↘ -4%" in red. */
export function DeltaArrow({ delta, goodUp = true }: DeltaArrowProps) {
  const good = delta > 0 === goodUp;
  const cls = good ? 'up' : 'dn';
  const arrow = delta > 0 ? '↗' : delta < 0 ? '↘' : '→';
  return <span className={`delta ${cls}`}>{arrow}{delta > 0 ? '+' : ''}{delta}%</span>;
}

interface TrendArrowProps {
  delta: number;
  goodUp?: boolean;
}

/** Compact table-row trend arrow, no percentage text (caller renders that separately). */
export function TrendArrow({ delta, goodUp = true }: TrendArrowProps) {
  const good = delta >= 0 === goodUp;
  const cls = delta === 0 ? 'flat' : good ? 'up' : 'dn';
  const arrow = delta > 0 ? '↗' : delta < 0 ? '↘' : '→';
  return <span className={`arrow ${cls}`}>{arrow}</span>;
}
