import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { viAuditBasePath } from "@/components/vi-audit/viAuditData";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { apiErrorMessage } from "@/components/vi-audit/viAuditApi";

// Saves all corrective + preventive plans of an observation in one request.
// `submit: true` submits them; without it they are saved as a draft.
const saveActionPlansEndpoint = (observationId: string) =>
  `/vi_audit_observations/${observationId}/save_action_plans.json`;

type PlanKind = "corrective" | "preventive";

interface PlanEntry {
  description: string;
  responsiblePerson: ViActiveUserOption | null;
  targetDate: string;
  extendTargetDate: string;
  extensionReason: string;
  /** Server id of an existing plan — sent so the API updates it instead of creating a new one. */
  id?: string;
}

const todayIso = () => new Date().toISOString().split("T")[0];

const emptyEntry = (): PlanEntry => ({
  description: "",
  responsiblePerson: null,
  targetDate: todayIso(),
  extendTargetDate: "",
  extensionReason: "",
});

const PLAN_SECTIONS: { kind: PlanKind; title: string; window: string }[] = [
  { kind: "corrective", title: "Corrective Action Plan", window: "0–7 days" },
  { kind: "preventive", title: "Preventive Action Plan", window: "15–30 days" },
];

const requiredLabel = (text: string) => (
  <>
    {text} <span className="fm-required-mark">*</span>
  </>
);

const SpocActionPlanPage = () => {
  const navigate = useNavigate();
  const { id, observationId } = useParams();
  const basePath = viAuditBasePath("spoc");
  const observationPath = `${basePath}/${id}/observations/${observationId}`;

  const [plans, setPlans] = useState<Record<PlanKind, PlanEntry[]>>({
    corrective: [emptyEntry()],
    preventive: [emptyEntry()],
  });
  const [submitting, setSubmitting] = useState(false);

  const updateEntry = (kind: PlanKind, index: number, patch: Partial<PlanEntry>) =>
    setPlans((prev) => ({
      ...prev,
      [kind]: prev[kind].map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    }));

  const addEntry = (kind: PlanKind) =>
    setPlans((prev) => ({ ...prev, [kind]: [...prev[kind], emptyEntry()] }));

  const removeEntry = (kind: PlanKind, index: number) =>
    setPlans((prev) => ({ ...prev, [kind]: prev[kind].filter((_, i) => i !== index) }));

  const validate = () => {
    for (const { kind, title } of PLAN_SECTIONS) {
      for (const [index, entry] of plans[kind].entries()) {
        const label = plans[kind].length > 1 ? `${title} ${index + 1}` : title;
        if (!entry.description.trim() || !entry.responsiblePerson || !entry.targetDate) {
          toast.error(`${label}: Action Plan, Responsible Person and Target Date are required`);
          return false;
        }
        if (entry.extendTargetDate && entry.extendTargetDate < entry.targetDate) {
          toast.error(`${label}: Extended Target Date cannot be before the Target Date`);
          return false;
        }
        if (entry.extendTargetDate && !entry.extensionReason.trim()) {
          toast.error(`${label}: please add a reason for the extension`);
          return false;
        }
      }
    }
    return true;
  };

  const buildPayload = (submit: boolean) => {
    const actionPlans = PLAN_SECTIONS.flatMap(({ kind }) =>
      plans[kind]
        // Drafts may be partial — skip entries the user hasn't started.
        .filter((entry) => submit || entry.description.trim() || entry.responsiblePerson)
        .map((entry) => ({
          ...(entry.id ? { id: entry.id } : {}),
          action_type: kind,
          action_plan: entry.description.trim(),
          responsible_person_id: entry.responsiblePerson?.id ?? null,
          target_date: entry.targetDate,
        })),
    );
    return submit ? { submit: true, action_plans: actionPlans } : { action_plans: actionPlans };
  };

  // POST /vi_audit_observations/:id/save_action_plans.json — Submit sends `submit: true`, Save draft omits it.
  const save = async (submit: boolean) => {
    if (submitting) return;
    if (submit && !validate()) return;
    const payload = buildPayload(submit);
    if (!payload.action_plans.length) {
      toast.error("Add at least one action plan before saving");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(saveActionPlansEndpoint(observationId ?? "")), {
        method: "POST",
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(result) || `Request failed with status ${response.status}`);
      toast.success(submit ? "Action plan submitted successfully" : "Action plan saved to draft");
      navigate(observationPath);
    } catch (error) {
      console.error("Action plan save failed:", error);
      const message = error instanceof Error ? error.message : "";
      const failed = submit ? "Failed to submit action plan" : "Failed to save draft";
      toast.error(message ? `${failed} — ${message}` : failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(observationPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to observation"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Audit</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">
          {observationId} · Action Plan
        </span>
      </div>

      {/* Stepper: 3 of 3 — audit and observation steps done, action plan current (neutral states) */}
      <div className="mb-6 max-w-md">
        <p className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">3 of 3 steps</p>
        <div className="flex items-center">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`flex items-center ${n < 3 ? "flex-1" : ""}`}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-[1.5px] border-[#1A1A18] ${
                  n < 3 ? "bg-[#F1EEE7] text-[#1A1A18]" : "bg-white text-[#1A1A18]"
                }`}
              >
                {n < 3 ? <Check className="w-4 h-4" /> : n}
              </span>
              {n < 3 && <span className="mx-2 h-px flex-1 bg-[#1A1A18]" />}
            </div>
          ))}
        </div>
      </div>

      {PLAN_SECTIONS.map(({ kind, title, window }) => (
        <DetailCard key={kind} icon={sectionIcon(ShieldCheck)} title={`${title} (${window})`} className="mb-5">
          <div className="space-y-6">
            {plans[kind].map((entry, index) => (
              <div
                key={index}
                className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}
              >
                {plans[kind].length > 1 && (
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#1A1A18]">Action {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEntry(kind, index)}
                      className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                      aria-label={`Remove action ${index + 1}`}
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
                    label="Action Plan"
                    placeholder={
                      kind === "corrective"
                        ? "Describe immediate actions to be taken..."
                        : "Describe preventive actions to be taken..."
                    }
                    value={entry.description}
                    onChange={(e) => updateEntry(kind, index, { description: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <UserSelectField
                      label="Responsible Person"
                      required
                      employeeType="internal"
                      value={entry.responsiblePerson}
                      onChange={(user) => updateEntry(kind, index, { responsiblePerson: user })}
                      placeholder="Search responsible person by email or mobile"
                    />
                    <TextField
                      fullWidth
                      type="date"
                      label={requiredLabel("Select Target Date")}
                      value={entry.targetDate}
                      onChange={(e) => updateEntry(kind, index, { targetDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      type="date"
                      label="Extend Target Date"
                      value={entry.extendTargetDate}
                      onChange={(e) => updateEntry(kind, index, { extendTargetDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: entry.targetDate || undefined }}
                    />
                  </div>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={entry.extendTargetDate ? requiredLabel("Reason for extension") : "Reason for extension"}
                    placeholder="Describe the reason for extending the target date..."
                    value={entry.extensionReason}
                    onChange={(e) => updateEntry(kind, index, { extensionReason: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => addEntry(kind)}
                className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[#1A1A18] hover:bg-[#F5F4F0]"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </DetailCard>
      ))}

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button type="button" className="fm-action-secondary" onClick={() => save(false)} disabled={submitting}>
          Save draft
        </button>
        <button type="button" className="fm-action-primary" onClick={() => save(true)} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SpocActionPlanPage;
