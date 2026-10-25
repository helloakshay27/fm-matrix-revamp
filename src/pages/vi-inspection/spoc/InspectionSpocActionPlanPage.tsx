import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Info, ListChecks, Plus, Trash2 } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditLoadingState, auditTextareaSx, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { MultiUserSelectField } from "@/components/vi-incident/IncidentFormFields";
import {
  errorToast,
  saveViInspectionActionPlans,
  useViInspectionDetail,
  type ActionPlanInput,
} from "@/components/vi-inspection/viInspectionApi";
import {
  ACTION_TYPES,
  ACTION_TYPE_LABEL,
  isPlanDraft,
  todayIso,
  type ViInspectionActionType,
} from "@/components/vi-inspection/viInspectionData";
import { INSPECTION_SPOC_PATH } from "./InspectionSpocDetailPage";

interface PlanDraft {
  /** Saved plan id, or null for a new one. */
  id: string | null;
  description: string;
  owners: ViActiveUserOption[];
  targetDate: string;
  released: boolean;
}

type ResponsePlans = Record<ViInspectionActionType, PlanDraft[]>;

const emptyPlan = (): PlanDraft => ({ id: null, description: "", owners: [], targetDate: "", released: false });
const hasContent = (plan: PlanDraft) => Boolean(plan.id || plan.description.trim() || plan.owners.length || plan.targetDate);
const isComplete = (plan: PlanDraft) => Boolean(plan.description.trim() && plan.owners.length && plan.targetDate);

// SPOC: corrective & preventive action plans for every checklist response answered "No"
// (PUT /vi_inspections/:id/action_plans.json saves a draft, POST …/action_plans/submit.json submits).
// Any number of plans per type; each plan can have several responsible persons. When nothing was
// answered "No", Submit is the SPOC's explicit review.
const InspectionSpocActionPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const inspectionPath = `${INSPECTION_SPOC_PATH}/${id}`;
  const { inspection, loading } = useViInspectionDetail(id);

  const [plans, setPlans] = useState<Record<string, ResponsePlans>>({});
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const findings = inspection?.checklistResponses.filter((r) => r.answer === "No") ?? [];

  // Start from the saved plans (one empty plan per type when there are none yet).
  const prefilled = useRef(false);
  useEffect(() => {
    if (!inspection || prefilled.current) return;
    prefilled.current = true;
    const initial: Record<string, ResponsePlans> = {};
    for (const response of inspection.checklistResponses.filter((r) => r.answer === "No")) {
      const byType = (type: ViInspectionActionType) =>
        response.actionPlans
          .filter((plan) => plan.actionType === type)
          .map((plan) => ({
            id: plan.id,
            description: plan.description,
            owners: plan.assignments.map((a) => a.owner).filter((o): o is ViActiveUserOption => o !== null),
            targetDate: plan.targetDate,
            released: !isPlanDraft(plan),
          }));
      const corrective = byType("corrective");
      const preventive = byType("preventive");
      initial[response.id] = {
        corrective: corrective.length ? corrective : [emptyPlan()],
        preventive: preventive.length ? preventive : [emptyPlan()],
      };
    }
    setPlans(initial);
  }, [inspection]);

  const updatePlans = (responseId: string, type: ViInspectionActionType, update: (list: PlanDraft[]) => PlanDraft[]) =>
    setPlans((prev) => ({ ...prev, [responseId]: { ...prev[responseId], [type]: update(prev[responseId][type]) } }));

  const updatePlan = (responseId: string, type: ViInspectionActionType, index: number, patch: Partial<PlanDraft>) =>
    updatePlans(responseId, type, (list) => list.map((plan, i) => (i === index ? { ...plan, ...patch } : plan)));

  const removePlan = (responseId: string, type: ViInspectionActionType, index: number) => {
    const plan = plans[responseId][type][index];
    if (plan.id) setRemovedIds((prev) => [...prev, plan.id as string]);
    updatePlans(responseId, type, (list) => {
      const next = list.filter((_, i) => i !== index);
      return next.length ? next : [emptyPlan()];
    });
  };

  const buildPayload = (): ActionPlanInput[] =>
    findings.flatMap((response) =>
      ACTION_TYPES.flatMap((type) =>
        (plans[response.id]?.[type] ?? []).filter(hasContent).map((plan) => ({
          id: plan.id,
          checklist_response_id: response.id,
          action_type: type,
          action_description: plan.description.trim(),
          target_date: plan.targetDate,
          responsible_person_ids: plan.owners.map((owner) => owner.id),
        })),
      ),
    );

  // Same rule as the API: every "No" needs ≥1 complete corrective and ≥1 complete preventive plan.
  const validateForSubmit = () => {
    for (const [index, response] of findings.entries()) {
      for (const type of ACTION_TYPES) {
        const list = (plans[response.id]?.[type] ?? []).filter(hasContent);
        const label = `${index + 1}. ${response.question} — ${ACTION_TYPE_LABEL[type]} Action Plan`;
        if (!list.length) {
          toast.error(`${label}: at least one plan is required`);
          return false;
        }
        const incomplete = list.findIndex((plan) => !isComplete(plan));
        if (incomplete !== -1) {
          toast.error(
            `${label}${list.length > 1 ? ` (${incomplete + 1})` : ""}: description, Responsible Person and Target Date are required`,
          );
          return false;
        }
      }
    }
    return true;
  };

  const save = async (submit: boolean) => {
    if (saving || !id) return;
    if (submit && !validateForSubmit()) return;
    setSaving(true);
    try {
      await saveViInspectionActionPlans(id, buildPayload(), removedIds, submit);
      toast.success(
        submit ? (findings.length ? "Action plan submitted successfully" : "Inspection reviewed") : "Action plan saved to draft",
      );
      navigate(inspectionPath);
    } catch (error) {
      errorToast(submit ? "Failed to submit action plan" : "Failed to save draft", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !inspection) return <AuditLoadingState message="Loading inspection..." onBack={() => navigate(inspectionPath)} />;
  if (!inspection) return <AuditLoadingState message="Inspection not found." onBack={() => navigate(INSPECTION_SPOC_PATH)} />;
  if (!inspection.canManageActionPlans || inspection.status !== "open") {
    return <AuditLoadingState message="Action plans can't be changed for this inspection." onBack={() => navigate(inspectionPath)} />;
  }

  const renderPlanSection = (responseId: string, type: ViInspectionActionType) => {
    const list = plans[responseId]?.[type] ?? [];
    return (
      <div className="rounded-xl border border-[rgba(26,26,24,0.09)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1A1A18]">{ACTION_TYPE_LABEL[type]} Action Plan</span>
          <button
            type="button"
            onClick={() => updatePlans(responseId, type, (prev) => [...prev, emptyPlan()])}
            className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[#1A1A18] hover:bg-[#F5F4F0]"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-6">
          {list.map((plan, index) => (
            <div key={plan.id ?? `new-${index}`} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
              {(list.length > 1 || plan.id) && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">
                    Plan {index + 1}
                    {plan.released && <span className="ml-2 text-xs font-medium text-[rgba(26,26,24,0.48)]">(Released)</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePlan(responseId, type, index)}
                    className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                    aria-label={`Remove plan ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="space-y-5">
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  sx={auditTextareaSx}
                  label={requiredLabel(`${ACTION_TYPE_LABEL[type]} Action Plan`)}
                  placeholder="Describe the action to be taken..."
                  value={plan.description}
                  onChange={(e) => updatePlan(responseId, type, index, { description: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <MultiUserSelectField
                  label="Responsible Persons"
                  required
                  value={plan.owners}
                  onChange={(owners) => updatePlan(responseId, type, index, { owners })}
                  placeholder="Search by email or mobile"
                />
                <TextField
                  fullWidth
                  type="date"
                  label={requiredLabel("Target Date")}
                  value={plan.targetDate}
                  onChange={(e) => updatePlan(responseId, type, index, { targetDate: e.target.value })}
                  inputProps={{ min: plan.released ? undefined : todayIso() }}
                  InputLabelProps={{ shrink: true }}
                  disabled={plan.released}
                  helperText={plan.released ? "Use “Extend Target Date” on the inspection page to change it." : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <fieldset disabled={saving} className="p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(inspectionPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Inspection — {inspection.inspectionNo}</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">Action Plan</span>
      </div>

      {findings.length === 0 ? (
        <DetailCard icon={sectionIcon(Info)} title="No action plans required" className="mb-5">
          <p className="text-sm text-[#1A1A18]">
            No checklist question was answered “No”, so there is nothing to plan. Submit to confirm you have
            reviewed this inspection.
          </p>
        </DetailCard>
      ) : (
        findings.map((response, index) => (
          <DetailCard
            key={response.id}
            icon={sectionIcon(ListChecks)}
            title={`${index + 1}. ${response.question}`}
            className="mb-5"
          >
            {response.remark && (
              <p className="mb-4 text-sm text-[rgba(26,26,24,0.68)]">
                <span className="font-medium text-[#1A1A18]">Inspector remark:</span> {response.remark}
              </p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {renderPlanSection(response.id, "corrective")}
              {renderPlanSection(response.id, "preventive")}
            </div>
          </DetailCard>
        ))
      )}

      <div className="fm-action-bar pt-4 sm:pt-6">
        {findings.length > 0 && (
          <button type="button" className="fm-action-secondary" onClick={() => save(false)}>
            {saving ? "Saving..." : "Save Draft"}
          </button>
        )}
        <button type="button" className="fm-action-primary" onClick={() => save(true)}>
          {saving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </fieldset>
  );
};

export default InspectionSpocActionPlanPage;
