import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

const VI_AUDIT_DASHBOARD_ENDPOINT = "/vi_audits/dashboard.json";

export type ViAuditDashboardRole = "auditor" | "spoc" | "action_owner" | "functional_head";

interface WorkflowCount {
  label?: string;
  count?: number;
}

/** Counts for one role from GET /vi_audits/dashboard.json?role=<role> (data.<role>). */
export interface ViAuditDashboardCounts {
  total_audits?: number;
  total_draft_audits?: number;
  total_open_audits?: number;
  total_closed_audits?: number;
  total_observations?: number;
  observation_workflow?: Record<string, WorkflowCount>;
  [key: string]: unknown;
}

/** Number from the counts, or 0 while loading / when the API doesn't send it. */
export const dashboardCount = (value: unknown) => (typeof value === "number" ? value : Number(value) || 0);

/** Count for one observation-workflow stage, e.g. "pending_by_spoc". */
export const workflowCount = (counts: ViAuditDashboardCounts | null, stage: string) =>
  dashboardCount(counts?.observation_workflow?.[stage]?.count);

/** Stats-card counts for a role's audit list page. */
export const useViAuditDashboard = (role: ViAuditDashboardRole) => {
  const [counts, setCounts] = useState<ViAuditDashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const response = await fetch(
          getFullUrl(`${VI_AUDIT_DASHBOARD_ENDPOINT}?${new URLSearchParams({ role }).toString()}`),
          { headers: { Authorization: getAuthHeader() }, signal: controller.signal },
        );
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const json = await response.json();
        const data = json?.data ?? json;
        setCounts((data?.[role] ?? data) as ViAuditDashboardCounts);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load audit dashboard counts:", error);
        toast.error("Failed to load audit summary");
        setCounts(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [role]);

  return { counts, loading };
};
