import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { MenuItem, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { viAuditBasePath } from "@/components/vi-audit/viAuditData";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";

// Create-action-plan endpoint. Confirm with the backend team — the Audit API is not live yet.
const actionPlanEndpoint = (observationId: string) =>
  `/pms/vi_audit_observations/${observationId}/action_plans.json`;

// Placeholder list — swap for the live user lookup once the Audit backend is available.
const RESPONSIBLE_PERSONS = ["Varne Shah", "Arun Mohan", "Veena Kumari", "Vikram Singh", "Kiran Joshi"];

type PlanKind = "corrective" | "preventive";

interface PlanEntry {
  description: string;
  responsiblePerson: string;
  targetDate: string;
  extendTargetDate: string;
  extensionReason: string;
}

const todayIso = () => new Date().toISOString().split("T")[0];

const emptyEntry = (): PlanEntry => ({
  description: "",
  responsiblePerson: "",
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
        if (!entry.responsiblePerson || !entry.targetDate) {
          toast.error(`${label}: Responsible Person and Target Date are required`);
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

  const buildPayload = (status: "draft" | "submitted") => {
    const payload = new FormData();
    payload.append("action_plan[audit_id]", id ?? "");
    payload.append("action_plan[observation_id]", observationId ?? "");
    payload.append("action_plan[status]", status);
    PLAN_SECTIONS.forEach(({ kind }) => {
      plans[kind].forEach((entry, i) => {
        const key = `action_plan[${kind}_actions][${i}]`;
        payload.append(`${key}[description]`, entry.description);
        payload.append(`${key}[responsible_person]`, entry.responsiblePerson);
        payload.append(`${key}[target_date]`, entry.targetDate);
        payload.append(`${key}[extended_target_date]`, entry.extendTargetDate);
        payload.append(`${key}[extension_reason]`, entry.extensionReason);
      });
    });
    return payload;
  };

  const save = async (status: "draft" | "submitted") => {
    if (submitting) return;
    if (status === "submitted" && !validate()) return;
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(actionPlanEndpoint(observationId ?? "")), {
        method: "POST",
        headers: { Authorization: getAuthHeader() },
        body: buildPayload(status),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      toast.success(status === "draft" ? "Action plan saved to draft" : "Action plan submitted successfully");
      navigate(observationPath);
    } catch (error) {
      console.error("Action plan save failed:", error);
      toast.error(status === "draft" ? "Failed to save draft" : "Failed to submit action plan");
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
                    <TextField
                      select
                      fullWidth
                      label={requiredLabel("Responsible Person")}
                      value={entry.responsiblePerson}
                      onChange={(e) => updateEntry(kind, index, { responsiblePerson: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) =>
                          selected ? (selected as string) : <span className="text-[rgba(26,26,24,0.3)]">Select</span>,
                      }}
                    >
                      {RESPONSIBLE_PERSONS.map((person) => (
                        <MenuItem key={person} value={person}>
                          {person}
                        </MenuItem>
                      ))}
                    </TextField>
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
        <button type="button" className="fm-action-secondary" onClick={() => save("draft")} disabled={submitting}>
          Save draft
        </button>
        <button type="button" className="fm-action-primary" onClick={() => save("submitted")} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default SpocActionPlanPage;
