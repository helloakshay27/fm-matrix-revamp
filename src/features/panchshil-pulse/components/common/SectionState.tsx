import React from "react";
import type { SectionStatus } from "../../contexts/PulseDashboardContext";

interface SectionStateProps {
  status: SectionStatus;
  label: string;
  /** Layout-shaped placeholder shown while loading; falls back to a spinner. */
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Shared loading/error gate — mirrors the posthog-dashboard Guard behaviour:
 * while a section's queries are still in flight it shows a skeleton (or spinner), on
 * failure it surfaces the first error, and only once data is settled does it render the cards.
 */
export const SectionState: React.FC<SectionStateProps> = ({ status, label, skeleton, children }) => {
  if (status.loading) {
    if (skeleton) {
      return (
        <div className="pskeleton" role="status" aria-busy="true" aria-label={`Loading ${label}`}>
          {skeleton}
        </div>
      );
    }
    return (
      <div className="pstate loading" role="status">
        <span className="spinner" aria-hidden="true" />
        Loading {label}&hellip;
      </div>
    );
  }
  if (status.error) {
    return (
      <div className="pstate error" role="alert">
        <b>Couldn&rsquo;t load {label}.</b>{" "}
        {status.error.message || "Unknown error"}
      </div>
    );
  }
  return <>{children}</>;
};