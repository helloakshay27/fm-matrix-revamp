import { createContext, useContext } from "react";

/** True while the dashboard is fetching; cards swap their content for a loader, as on the M-Safe dashboard. */
export const DashboardLoadingContext = createContext(false);

export const useDashboardLoading = () => useContext(DashboardLoadingContext);
