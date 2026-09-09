import type { ReactNode } from 'react';
import { InfoButton } from './InfoButton';

/**
 * Card shell for every chart/table: eyebrow + title + an `i` popover carrying the card's
 * purpose (the shared INFO dictionary's formula text).
 */
export function ChartCard({
  eyebrow,
  title,
  purpose,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  purpose: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
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
