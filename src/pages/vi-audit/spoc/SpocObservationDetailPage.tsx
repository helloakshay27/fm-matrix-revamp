import { useNavigate, useParams } from "react-router-dom";
import { FilePenLine, Plus } from "lucide-react";
import { ObservationDetailView } from "@/components/vi-audit/ObservationDetailView";
import { useMemo } from "react";
import {
  VI_AUDIT_DETAIL_URLS,
  useViAuditDetail,
  useViObservationDetail,
} from "@/components/vi-audit/useViAuditDetail";
import { isPlanDateBreached, type ViActionPlan, type ViObservation } from "@/components/vi-audit/viAuditData";
import { PlanExtensionForm } from "@/components/vi-audit/PlanExtensionForm";

const isDraftPlan = (plan: ViActionPlan) => String(plan.status).toLowerCase() === "draft";

// Draft action plans saved with "Save draft" — the button then reads "Continue Draft" and opens
// the action plan form with them preselected.
const hasDraftActionPlans = (observation: ViObservation) =>
  [...observation.correctiveActions, ...observation.preventiveActions].some(isDraftPlan);

// The SPOC creates the action plan once per observation: when at least one corrective and one
// preventive plan have been submitted (none left in draft), there is nothing more to create.
const hasSubmittedActionPlans = (observation: ViObservation) => {
  const plans = [...observation.correctiveActions, ...observation.preventiveActions];
  return (
    observation.correctiveActions.length > 0 &&
    observation.preventiveActions.length > 0 &&
    !plans.some(isDraftPlan)
  );
};

// SPOC: observation detail with "Create Action Plan" — hidden once the corrective + preventive
// plans are submitted (or every plan is closed).
// Audit summary from GET /vi_audits/spoc_audits.json?id=:id; the observation itself from
// GET /vi_audit_observations/:observationId.json, whose action plan ids the view then loads from
// GET /vi_audit_action_plans/:id.json (corrective / preventive tabs).
const SpocObservationDetailPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const { audit, loading: auditLoading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.spoc);
  const { observation: freshObservation, loading: observationLoading } = useViObservationDetail(observationId);
  const auditPath = `/safety/audit/spoc/${id}`;

  // Use the observation API's copy (latest action plans) in place of the one inside the audit.
  const auditWithObservation = useMemo(() => {
    if (!audit || !freshObservation || !observationId) return audit;
    const fresh: ViObservation = { ...freshObservation, id: observationId };
    // Keep the audit's value where the observation API sends nothing, but always take its plans.
    const mergeInto = (base: ViObservation): ViObservation => {
      const out = { ...base } as Record<string, unknown>;
      for (const [key, value] of Object.entries(fresh)) {
        const empty = value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
        if (!empty) out[key] = value;
      }
      return {
        ...(out as unknown as ViObservation),
        correctiveActions: fresh.correctiveActions,
        preventiveActions: fresh.preventiveActions,
      };
    };
    const existing = audit.observations.find((o) => o.id === observationId);
    return {
      ...audit,
      observations: existing
        ? audit.observations.map((o) => (o.id === observationId ? mergeInto(o) : o))
        : [...audit.observations, fresh],
    };
  }, [audit, freshObservation, observationId]);

  return (
    <ObservationDetailView
      auditId={id}
      observationId={observationId}
      audit={auditWithObservation}
      loading={auditLoading || observationLoading}
      auditPath={auditPath}
      // Breached plan (target date passed, not closed by the action owner): SPOC extends it.
      // navigate(0) reloads the page so the plan shows its new date and reason.
      renderPlanFooter={(plan) =>
        isPlanDateBreached(plan) ? <PlanExtensionForm plan={plan} onExtended={() => navigate(0)} /> : null
      }
      footer={({ observation, allPlansClosed }) =>
        allPlansClosed || hasSubmittedActionPlans(observation) ? null : (
          <div className="fm-action-bar pt-4 sm:pt-6">
            <button
              type="button"
              className="fm-action-primary"
              onClick={() => navigate(`${auditPath}/observations/${observation.id}/action-plan`)}
            >
              {hasDraftActionPlans(observation) ? (
                <>
                  <FilePenLine className="w-4 h-4" />
                  Continue Draft
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Action Plan
                </>
              )}
            </button>
          </div>
        )
      }
    />
  );
};

export default SpocObservationDetailPage;
