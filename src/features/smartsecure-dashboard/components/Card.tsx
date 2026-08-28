import type { CSSProperties, ReactNode } from 'react';
import { InfoButton } from './InfoButton';

interface CardHeadProps {
  cr?: ReactNode;
  ct: ReactNode;
  cd?: ReactNode;
}

/** The common card-head layout: eyebrow (cr) / title (ct) / description (cd). */
export function CardHead({ cr, ct, cd }: CardHeadProps) {
  return (
    <>
      {cr && <div className="cr">{cr}</div>}
      <div className="ct">{ct}</div>
      {cd && <div className="cd">{cd}</div>}
    </>
  );
}

interface CardProps {
  infoKey?: string;
  className?: string;
  style?: CSSProperties;
  head: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}

export function Card({ infoKey, className, style, head, bodyClassName, children }: CardProps) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`} style={style}>
      <div className="card-head">{head}</div>
      <div className={`card-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
      {infoKey && <InfoButton infoKey={infoKey} />}
    </div>
  );
}
