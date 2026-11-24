import type { ReactNode } from 'react';

/** Load state of the API call behind one section of a dashboard. */
export interface SectionStatus {
  loading: boolean;
  error: Error | null;
}

interface GuardProps {
  status: SectionStatus;
  /** True when the call succeeded but returned nothing for this filter set. */
  empty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
}

/**
 * Renders a chart/table only once its API call has data; otherwise a loading / error / empty
 * note in its place.
 *
 * The three states are kept distinct on purpose: "still loading", "the call failed" and "the
 * call worked but this filter set has no activity" mean very different things to someone
 * reading a dashboard, and collapsing them into one blank card hides real outages.
 */
export function Guard({ status, empty, emptyLabel, children }: GuardProps) {
  if (status.loading) {
    return (
      <div className="state">
        <span className="spin" /> Loading…
      </div>
    );
  }
  if (status.error) {
    return <div className="state err">Couldn’t load this metric — {status.error.message}</div>;
  }
  if (empty) {
    return <div className="state">{emptyLabel ?? 'No activity recorded for this filter set.'}</div>;
  }
  return <>{children}</>;
}
