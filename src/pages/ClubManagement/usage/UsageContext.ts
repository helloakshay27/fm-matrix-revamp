import { createContext, useContext } from "react";
import type { UsageFilters } from "./usageData";

/**
 * Shared state for the Club Usage Dashboard: the active date-range / previous-period
 * filters shared by Traffic / Adoption / Workflow. Provided once by ClubUsageDashboard and
 * consumed by the Traffic / Adoption / Workflow sections so every section recomputes
 * off the same coordinated filter state.
 */
export interface UsageContextValue {
  filters: UsageFilters;
  recentlyActive: number | null;
  setRecentlyActive: (value: number | null) => void;
  refreshing: boolean;
}

export const UsageContext = createContext<UsageContextValue | null>(null);

export function useUsage(): UsageContextValue {
  const ctx = useContext(UsageContext);
  if (!ctx) {
    throw new Error("useUsage must be used inside a <UsageContext.Provider>");
  }
  return ctx;
}
