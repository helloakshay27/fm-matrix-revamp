import type { CSSProperties, ReactNode } from 'react';
import { InfoButton } from './InfoButton';
import { AiButton } from './AiButton';

export type Accent = 'orange' | 'blue' | 'green';

interface CardHeadProps {
  cr?: ReactNode;
  ct: ReactNode;
  cd?: ReactNode;
  ctExtra?: ReactNode;
}

/** The common card-head layout: eyebrow (cr) / title (ct) / description (cd). */
export function CardHead({ cr, ct, cd, ctExtra }: CardHeadProps) {
  return (
    <>
      {cr && <div className="phg-cr">{cr}</div>}
      <div className="phg-ct" style={{ margin: 0 }}>{ct}{ctExtra}</div>
      {cd && <div className="phg-cd">{cd}</div>}
    </>
  );
}

interface CardProps {
  accent?: Accent;
  infoKey?: string;
  aiKey?: string;
  className?: string;
  style?: CSSProperties;
  head: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}

export function Card({ accent, infoKey, aiKey, className, style, head, bodyClassName, children }: CardProps) {
  return (
    <div className={`phg-card${className ? ` ${className}` : ''}`} style={style}>
      <div className={`phg-card-head${accent ? ` b-${accent}` : ''}`}>{head}</div>
      <div className={`phg-card-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
      {infoKey && <InfoButton infoKey={infoKey} />}
      {aiKey && <AiButton chartKey={aiKey} />}
    </div>
  );
}
