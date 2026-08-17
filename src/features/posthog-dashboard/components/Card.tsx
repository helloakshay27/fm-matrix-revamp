import React, { CSSProperties, ReactNode } from 'react';
import { InfoButton } from './InfoButton';
import { AiButton } from './AiButton';

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
      {cr && <div className="cr">{cr}</div>}
      <div className="ct" style={{ margin: 0 }}>{ct}{ctExtra}</div>
      {cd && <div className="cd">{cd}</div>}
    </>
  );
}

interface CardProps {
  infoKey?: string;
  aiKey?: string;
  className?: string;
  style?: CSSProperties;
  head: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ infoKey, aiKey, className, style, head, bodyClassName, children, ...rest }, ref) => {
  return (
    <div ref={ref} className={`card${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <div className="card-head">{head}</div>
      <div className={`card-body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
      {infoKey && <InfoButton infoKey={infoKey} />}
      {aiKey && <AiButton chartKey={aiKey} />}
    </div>
  );
});
