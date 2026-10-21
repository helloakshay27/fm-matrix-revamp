import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import type { ViActionPlan, ViPlanKind } from "./viAuditData";
import { obj, text, toActionPlan } from "./useViAuditDetail";

export interface ViActionPlanDetail {
  plan: ViActionPlan;
  kind: ViPlanKind;
  /** From the API — false once the plan can no longer be edited / actioned. */
  canEdit?: boolean;
}

// Accepts the plan at the root or under vi_audit_action_plan / action_plan / data.
const toPlanDetail = (json: unknown): ViActionPlanDetail => {
  const root = obj(json);
  const raw = obj(root.vi_audit_action_plan ?? root.action_plan ?? root.data ?? root);
  const kind: ViPlanKind = text(raw.action_type).toLowerCase() === "preventive" ? "preventive" : "corrective";
  return {
    plan: toActionPlan(raw, 0, kind === "corrective" ? "Ca" : "Pa"),
    kind,
    canEdit: typeof raw.can_edit === "boolean" ? raw.can_edit : undefined,
  };
};

const actionPlanEndpoint = (planId: string) => `/vi_audit_action_plans/${encodeURIComponent(planId)}.json`;

/** Fetches one action plan — GET /vi_audit_action_plans/:id.json. */
export const fetchViActionPlan = async (planId: string, signal?: AbortSignal) => {
  const response = await fetch(getFullUrl(actionPlanEndpoint(planId)), {
    headers: { Authorization: getAuthHeader() },
    signal,
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return toPlanDetail(await response.json());
};

/** One corrective / preventive action plan (GET /vi_audit_action_plans/:id.json). */
export const useViActionPlanDetail = (planId: string | undefined) => {
  const [detail, setDetail] = useState<ViActionPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        setDetail(await fetchViActionPlan(planId, controller.signal));
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to load action plan:", error);
        toast.error("Failed to load action plan");
        setDetail(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [planId]);

  return { detail, loading };
};

/**
 * Several action plans by id, fetched in parallel (GET /vi_audit_action_plans/:id.json each).
 * Returns the plans that loaded, keyed by the requested id; failed ones are left out so the
 * caller can fall back to its own copy.
 */
export const useViActionPlans = (planIds: string[]) => {
  const key = planIds.join(",");
  const [plans, setPlans] = useState<Record<string, ViActionPlanDetail>>({});
  const [loading, setLoading] = useState(planIds.length > 0);

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (!ids.length) {
      setPlans({});
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    Promise.allSettled(ids.map((planId) => fetchViActionPlan(planId, controller.signal))).then((results) => {
      if (controller.signal.aborted) return;
      const loaded: Record<string, ViActionPlanDetail> = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled") loaded[ids[i]] = result.value;
        else console.error(`Failed to load action plan ${ids[i]}:`, result.reason);
      });
      if (Object.keys(loaded).length < ids.length) toast.error("Some action plans could not be loaded");
      setPlans(loaded);
      setLoading(false);
    });
    return () => controller.abort();
  }, [key]);

  return useMemo(() => ({ plans, loading }), [plans, loading]);
};
