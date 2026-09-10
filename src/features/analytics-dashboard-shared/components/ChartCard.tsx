import type { CSSProperties, ReactNode } from 'react';
import { InfoButton } from './InfoButton';

/**
 * Card shell for every chart and table across the FM Matrix v2 analytics dashboards:
 * eyebrow + title + an `i` popover carrying the card's purpose.
 */
export function ChartCard({
  eyebrow,
  title,
  purpose,
  className,
  style,
  children,
}: {
  eyebrow: string;
  title: string;
  purpose: ReactNode;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`} style={style}>
      <div className="card-head">
        <div className="charthead">
          <div>
            <div className="cr">{eyebrow}</div>
            <div className="ct">{title}</div>
          </div>
          <InfoButton>
            <>
              <b>Purpose</b>
              {purpose}
            </>
          </InfoButton>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

/** Legend row under a chart. A dashed swatch marks the previous-period overlay. */
export function Legend({
  items,
}: {
  items: Array<{ label: string; color?: string; dashed?: boolean }>;
}) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span key={it.label}>
          <i className={it.dashed ? 'dash' : undefined} style={it.dashed ? undefined : { background: it.color }} />{' '}
          {it.label}
        </span>
      ))}
    </div>
  );
}
