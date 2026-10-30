import { useEffect, useState } from "react";
import {
  EMPTY_SECTIONS,
  fetchClosureProgress,
  fetchDashboardFilters,
  fetchDashboardKpis,
  fetchDashboardSections,
  type ClosureRow,
  type DashboardFilterOptions,
  type DashboardKpis,
  type DashboardQuery,
  type DashboardSections,
} from "./managementDashboardApi";

const EMPTY_FILTERS: DashboardFilterOptions = {
  clusters: [],
  functions: [],
  zones: [],
  auditTypes: [],
};

export const useManagementDashboard = (query: DashboardQuery) => {
  const [filters, setFilters] = useState<DashboardFilterOptions>(EMPTY_FILTERS);
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [closure, setClosure] = useState<ClosureRow[]>([]);
  const [sections, setSections] = useState<DashboardSections>(EMPTY_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardFilters()
      .then((options) => {
        if (!controller.signal.aborted) setFilters(options);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit dashboard filters:", err);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    Promise.all([fetchDashboardKpis(query), fetchClosureProgress(query), fetchDashboardSections(query)])
      .then(([nextKpis, nextClosure, nextSections]) => {
        if (controller.signal.aborted) return;
        setKpis(nextKpis);
        setClosure(nextClosure);
        setSections(nextSections);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit dashboard:", err);
        setKpis(null);
        setClosure([]);
        setSections(EMPTY_SECTIONS);
        setError("Could not load audit dashboard data");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [query.clusterId, query.zoneId, query.auditType, query.dateFrom, query.dateTo, query.functionIds.join("|")]);

  return { filters, kpis, closure, sections, loading, error };
};
