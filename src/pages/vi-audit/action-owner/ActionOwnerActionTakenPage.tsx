import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, Paperclip, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import {
  findViActionPlan,
  getViAuditDetail,
  markViActionPlanClosed,
  viAuditBasePath,
} from "@/components/vi-audit/viAuditData";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";

// Action-taken endpoint. Confirm with the backend team — the Audit API is not live yet.
const actionTakenEndpoint = (planId: string) => `/pms/vi_audit_action_plans/${planId}/actions_taken.json`;

interface ActionTakenEntry {
  description: string;
  attachments: File[];
  closureDate: string;
}

const emptyEntry = (): ActionTakenEntry => ({ description: "", attachments: [], closureDate: "" });

const requiredLabel = (text: string) => (
  <>
    {text} <span className="fm-required-mark">*</span>
  </>
);

// Action Owner: record the action taken against a corrective / preventive plan (step 4 of 4).
const ActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id, observationId, planId } = useParams();
  const audit = useMemo(() => getViAuditDetail(id), [id]);
  const observation = audit.observations.find((o) => o.id === observationId);
  const found = observation ? findViActionPlan(observation, planId) : null;

  const planPath = `${viAuditBasePath("action-owner")}/${audit.id}/observations/${observationId}/plans/${planId}`;

  const [entries, setEntries] = useState<ActionTakenEntry[]>([emptyEntry()]);
  const [submitting, setSubmitting] = useState(false);

  const kind = found?.kind ?? "corrective";
  const sectionTitle =
    kind === "corrective" ? "Corrective Action Taken (0–7 days)" : "Preventive Action Taken (15–30 days)";

  const updateEntry = (index: number, patch: Partial<ActionTakenEntry>) =>
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const validate = () => {
    const invalid = entries.findIndex((e) => !e.description.trim() || !e.closureDate);
    if (invalid !== -1) {
      toast.error(
        entries.length > 1
          ? `Action ${invalid + 1}: please describe the action taken and add the Closure Date`
          : "Please describe the action taken and add the Closure Date",
      );
      return false;
    }
    return true;
  };

  const buildPayload = (status: "draft" | "submitted") => {
    const payload = new FormData();
    payload.append("action_taken[audit_id]", audit.id);
    payload.append("action_taken[observation_id]", observationId ?? "");
    payload.append("action_taken[action_plan_id]", planId ?? "");
    payload.append("action_taken[plan_type]", kind);
    payload.append("action_taken[status]", status);
    entries.forEach((entry, i) => {
      payload.append(`action_taken[actions][${i}][description]`, entry.description);
      payload.append(`action_taken[actions][${i}][closure_date]`, entry.closureDate);
      entry.attachments.forEach((file) => payload.append(`action_taken[actions][${i}][attachments][]`, file));
    });
    return payload;
  };

  const save = async (status: "draft" | "submitted") => {
    if (submitting) return;
    if (status === "submitted" && !validate()) return;
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(actionTakenEndpoint(planId ?? "")), {
        method: "POST",
        headers: { Authorization: getAuthHeader() },
        body: buildPayload(status),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      if (status === "submitted") {
        // Plan is now closed by the action owner — show the SPOC observation view with the update.
        markViActionPlanClosed(audit.id, observationId ?? "", planId ?? "");
        toast.success("Action taken submitted successfully");
        navigate(`${viAuditBasePath("spoc")}/${audit.id}/observations/${observationId}`);
      } else {
        toast.success("Action taken saved to draft");
        navigate(planPath);
      }
    } catch (error) {
      console.error("Action taken save failed:", error);
      toast.error(status === "draft" ? "Failed to save draft" : "Failed to submit action taken");
    } finally {
      setSubmitting(false);
    }
  };

  if (!observation || !found) {
    return (
      <div className="p-6 min-h-screen">
        <button
          type="button"
          onClick={() => navigate(planPath)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-[rgba(26,26,24,0.68)] hover:text-[#1A1A18]"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="text-sm text-[rgba(26,26,24,0.48)]">Action plan not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(planPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back to action plan"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Audit</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">
          {audit.auditCode}/{observation.id}/{found.plan.id}
        </span>
      </div>

      {/* Stepper: 4 of 4 — earlier steps done, action taken current (neutral states) */}
      <div className="mb-6 max-w-lg">
        <p className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">4 of 4 steps</p>
        <div className="flex items-center">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={`flex items-center ${n < 4 ? "flex-1" : ""}`}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-[#1A1A18] text-sm font-semibold text-[#1A1A18] ${
                  n < 4 ? "bg-[#F1EEE7]" : "bg-white"
                }`}
              >
                {n < 4 ? <Check className="w-4 h-4" /> : n}
              </span>
              {n < 4 && <span className="mx-2 h-px flex-1 bg-[#1A1A18]" />}
            </div>
          ))}
        </div>
      </div>

      <h2 className="mb-4 text-[14px] font-semibold uppercase tracking-[0.02em] text-[#1A1A18]">
        CAPA – Corrective &amp; Preventive Actions
      </h2>

      <DetailCard icon={sectionIcon(ShieldCheck)} title={sectionTitle} className="mb-5">
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={index} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
              {entries.length > 1 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">Action {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setEntries((prev) => prev.filter((_, i) => i !== index))}
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
                  label={requiredLabel("Action Taken")}
                  placeholder={
                    kind === "corrective"
                      ? "Describe immediate actions taken..."
                      : "Describe preventive actions taken..."
                  }
                  value={entry.description}
                  onChange={(e) => updateEntry(index, { description: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <div>
                  <label className="fm-action-secondary inline-flex cursor-pointer">
                    <Paperclip className="w-4 h-4" />
                    Upload Attachment
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        updateEntry(index, { attachments: [...entry.attachments, ...files] });
                        e.target.value = "";
                      }}
                    />
                  </label>
                  {entry.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.attachments.map((file, fileIndex) => (
                        <span
                          key={`${file.name}-${fileIndex}`}
                          className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18]"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateEntry(index, {
                                attachments: entry.attachments.filter((_, i) => i !== fileIndex),
                              })
                            }
                            className="text-[rgba(26,26,24,0.48)] hover:text-[#1A1A18]"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="max-w-sm">
                  <TextField
                    fullWidth
                    type="date"
                    label={requiredLabel("Closure Date")}
                    value={entry.closureDate}
                    onChange={(e) => updateEntry(index, { closureDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEntries((prev) => [...prev, emptyEntry()])}
              className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[#1A1A18] hover:bg-[#F5F4F0]"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </DetailCard>

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button type="button" className="fm-action-secondary" onClick={() => save("draft")} disabled={submitting}>
          Save Draft
        </button>
        <button type="button" className="fm-action-primary" onClick={() => save("submitted")} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ActionOwnerActionTakenPage;
