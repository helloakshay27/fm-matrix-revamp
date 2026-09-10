import type { ReactNode } from 'react';

/**
 * The small `i` affordance on every tile and chart card. Hover/focus reveal is pure CSS
 * (`.info-wrap:hover .info-pop`, defined in each dashboard's scoped stylesheet), so this
 * only has to render the markup.
 */
export function InfoButton({ children }: { children: ReactNode }) {
  return (
    <span className="info-wrap">
      <button type="button" className="info-btn" aria-label="How this is calculated">
        i
      </button>
      <div className="info-pop">{children}</div>
    </span>
  );
}

/** Formula + business-meaning body, the shape every KPI tile's popover uses. */
export function KpiInfoBody({ formula, meaning }: { formula: string; meaning: string }) {
  return (
    <>
      <b>Formula</b>
      {formula}
      <div className="sep">
        <b>Business meaning</b>
        {meaning}
      </div>
    </>
  );
}
