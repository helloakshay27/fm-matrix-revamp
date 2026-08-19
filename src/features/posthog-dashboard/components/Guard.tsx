import type { ReactNode } from 'react';
import type { SectionStatus } from '../context/DashboardContext';

interface GuardProps {
  status: SectionStatus;
  /** True when the call succeeded but returned nothing for this filter set. */
  empty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
}

/** Renders a chart/table only once its API call has data; otherwise a loading / error / empty note. */
export function Guard({ status, empty, emptyLabel, children }: GuardProps) {
  if (status.loading) {
    return (
      <div className="state">
        <span className="spin" /> Loading…
      </div>
    );
  }
  if (status.error) {
    return (
      <div className="state err">
        Couldn’t load this metric — {status.error.message}
      </div>
    );
  }
  if (empty) {
    return (
      <div className="state">
        {emptyLabel ?? 'No activity recorded for this filter set.'}
      </div>
    );
  }
  return <>{children}</>;
}
