import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, CheckCircle2, Paperclip, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { hasSubmittedActionTaken, isPlanPendingByActionOwner, viAuditBasePath } from "@/components/vi-audit/viAuditData";
import { AuditLoadingState, sectionIcon, auditTextareaSx } from "@/components/vi-audit/ViAuditUi";
import { useViActionPlanDetail } from "@/components/vi-audit/useViActionPlanDetail";
import { VI_AUDIT_DETAIL_URLS, useViAuditDetail } from "@/components/vi-audit/useViAuditDetail";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_TYPES_LABEL,
  apiErrorMessage,
  fileToNamedDataUrl,
  isAllowedAttachment,
} from "@/components/vi-audit/viAuditApi";

// POST /vi_audit_capas.json creates ONE action taken (CAPA) against an action plan:
// { action_plan_id, submit?, vi_audit_capa: { action_taken, closure_date, attachments: ["data:..."] } }
// Without `submit` the CAPA is saved as a draft; `submit: true` closes it (needs action_taken +
// closure_date).
const CAPA_CREATE_ENDPOINT = "/vi_audit_capas.json";
// A draft CAPA ("Continue Draft") is updated with PUT and closed with POST .../submit.json.
const capaUpdateEndpoint = (capaId: string) => `/vi_audit_capas/${encodeURIComponent(capaId)}.json`;
const capaSubmitEndpoint = (capaId: string) => `/vi_audit_capas/${encodeURIComponent(capaId)}/submit.json`;

interface ActionTakenEntry {
  description: string;
  attachments: File[];
  /** YYYY-MM-DD — required to submit. */
  closureDate: string;
  /** Already created on the server — skipped if the save is retried after a partial failure. */
  created?: boolean;
  /** Server id of a saved draft CAPA — updated (PUT) instead of created again. */
  id?: string;
  /** Attachments already saved on the draft CAPA (shown read-only). */
  existingAttachments?: { name: string; url: string }[];
}

const emptyEntry = (): ActionTakenEntry => ({ description: "", attachments: [], closureDate: "" });

const requiredLabel = (text: string) => (
  <>
    {text} <span className="fm-required-mark">*</span>
  </>
);

// Action Owner: record the action taken against a corrective / preventive plan (step 4 of 4).
// Plan from GET /vi_audit_action_plans/:planId.json, audit / observation from GET /vi_audits/:id.json.
const ActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id, observationId, planId } = useParams();
  const { detail: found, loading: planLoading } = useViActionPlanDetail(planId);
  const { audit, loading: auditLoading } = useViAuditDetail(id, VI_AUDIT_DETAIL_URLS.actionOwner);
  const observation = audit?.observations.find((o) => o.id === observationId);

  const observationPath = `${viAuditBasePath("action-owner")}/${id}/observations/${observationId}`;
  const planPath = `${observationPath}/plans/${planId}`;

  const [entries, setEntries] = useState<ActionTakenEntry[]>([emptyEntry()]);
  const [submitting, setSubmitting] = useState(false);
  // "Action Taken Submitted" popup after a successful submit.
  const [showSubmitted, setShowSubmitted] = useState(false);
  // Draft CAPAs saved earlier ("Continue Draft") are preselected once the plan has loaded.
  const [hasDraft, setHasDraft] = useState(false);
  useEffect(() => {
    const drafts = (found?.plan.capas ?? []).filter((capa) => capa.status && capa.status !== "closed");
    if (!drafts.length) return;
    setEntries(
      drafts.map((capa) => ({
        id: capa.id,
        description: capa.description,
        closureDate: capa.closureDate.slice(0, 10),
        attachments: [],
        existingAttachments: capa.attachments,
      })),
    );
    setHasDraft(true);
  }, [found]);

  const kind = found?.kind ?? "corrective";
  const sectionTitle =
    kind === "corrective" ? "Corrective Action Taken " : "Preventive Action Taken (15–30 days)";

  const updateEntry = (index: number, patch: Partial<ActionTakenEntry>) =>
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  // Submit needs the action taken and its closure date; a draft only needs the description.
  const validate = (submit: boolean) => {
    const invalid = entries.findIndex((e) => !e.description.trim() || (submit && !e.closureDate));
    if (invalid !== -1) {
      const what = submit ? "describe the action taken and add the Closure Date" : "describe the action taken";
      toast.error(entries.length > 1 ? `Action ${invalid + 1}: please ${what}` : `Please ${what}`);
      return false;
    }
    return true;
  };

  // Per entry, in order: a new entry is created (POST /vi_audit_capas.json, `submit: true` closes
  // it); a saved draft is updated (PUT /vi_audit_capas/:id.json) and, on Submit, closed with
  // POST /vi_audit_capas/:id/submit.json.
  const save = async (submit: boolean) => {
    if (submitting || !planId || !validate(submit)) return;
    setSubmitting(true);
    const send = async (url: string, method: string, body?: unknown) => {
      const response = await fetch(getFullUrl(url), {
        method,
        headers: { Authorization: getAuthHeader(), ...(body ? { "Content-Type": "application/json" } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(result) || `request failed with status ${response.status}`);
    };
    try {
      for (const [index, entry] of entries.entries()) {
        if (entry.created) continue;
        const capa = {
          action_taken: entry.description.trim(),
          ...(entry.closureDate ? { closure_date: entry.closureDate } : {}),
          ...(entry.attachments.length || !entry.id
            ? { attachments: await Promise.all(entry.attachments.map(fileToNamedDataUrl)) }
            : {}),
        };
        try {
          if (entry.id) {
            await send(capaUpdateEndpoint(entry.id), "PUT", { vi_audit_capa: capa });
            if (submit) await send(capaSubmitEndpoint(entry.id), "POST");
          } else {
            await send(CAPA_CREATE_ENDPOINT, "POST", {
              action_plan_id: planId,
              ...(submit ? { submit: true } : {}),
              vi_audit_capa: capa,
            });
          }
        } catch (error) {
          const reason = error instanceof Error ? error.message : "";
          throw new Error(entries.length > 1 ? `Action ${index + 1}: ${reason}` : reason);
        }
        updateEntry(index, { created: true });
      }
      if (submit) {
        setShowSubmitted(true);
      } else {
        toast.success("Action taken saved to draft");
        navigate(planPath);
      }
    } catch (error) {
      console.error("Action taken save failed:", error);
      const message = error instanceof Error ? error.message : "";
      const failed = submit ? "Failed to submit action taken" : "Failed to save draft";
      toast.error(message ? `${failed}: ${message}` : failed);
    } finally {
      setSubmitting(false);
    }
  };

  if (planLoading || auditLoading) return <AuditLoadingState message="Loading action plan..." />;

  // Already closed by the action owner — nothing left to add.
  // (Same rule as the plan page: pending by the action owner, or observation "Pending By SPOC".)
  const canAddActionTaken = found
    ? !hasSubmittedActionTaken(found.plan) &&
      (isPlanPendingByActionOwner(found.plan) || observation?.status === "Pending By SPOC")
    : false;
  if (found && !canAddActionTaken && !showSubmitted) {
    return (
      <AuditLoadingState message="Action taken has already been submitted for this plan." onBack={() => navigate(planPath)} />
    );
  }

  if (!found) {
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

  // e.g. "Audit01/Obs02/Ca01"
  const planRef = [audit?.auditCode, observation?.observationNo ?? observation?.id ?? observationId, found.plan.actionNo ?? found.plan.id]
    .filter(Boolean)
    .join("/");
  const actionLabel = kind === "corrective" ? "Corrective Action Taken" : "Preventive Action Taken";

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
          {planRef}
        </span>
        {hasDraft && (
          <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700">
            Draft
          </span>
        )}
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
              {entries.length > 1 && !entry.id && (
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
                  rows={3}
                  sx={auditTextareaSx}
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
                      accept={ATTACHMENT_ACCEPT}
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const allowed = files.filter(isAllowedAttachment);
                        const rejected = files.filter((file) => !isAllowedAttachment(file));
                        if (rejected.length) {
                          toast.error(
                            `${rejected.map((file) => file.name).join(", ")} ${
                              rejected.length === 1 ? "is" : "are"
                            } not allowed. ${ATTACHMENT_TYPES_LABEL}`,
                          );
                        }
                        if (allowed.length) updateEntry(index, { attachments: [...entry.attachments, ...allowed] });
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">PNG / JPEG only</span>
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
                {!!entry.existingAttachments?.length && (
                  <div className="flex flex-wrap gap-2">
                    {entry.existingAttachments.map((file, fileIndex) => (
                      <a
                        key={`saved-${file.name}-${fileIndex}`}
                        href={file.url || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Already uploaded"
                        className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <Paperclip className="w-3 h-3 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </a>
                    ))}
                  </div>
                )}
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
        <button type="button" className="fm-action-secondary" onClick={() => save(false)} disabled={submitting}>
          Save Draft
        </button>
        <button type="button" className="fm-action-primary" onClick={() => save(true)} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Submitted popup — closing it (or either button) leaves the form */}
      <Dialog open={showSubmitted} onOpenChange={(open) => !open && navigate(planPath)}>
        <DialogContent className="sm:max-w-md rounded-2xl p-8 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F4F0]">
            <CheckCircle2 className="w-6 h-6 text-[rgba(26,26,24,0.68)]" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold text-[#1A1A18]">{actionLabel} Submitted</DialogTitle>
          <DialogDescription className="text-center text-sm text-[rgba(26,26,24,0.48)]">
            ID: {planRef}
          </DialogDescription>
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            <button type="button" className="fm-action-secondary" onClick={() => navigate(planPath)}>
              View Details
            </button>
            <button type="button" className="fm-action-primary" onClick={() => navigate(observationPath)}>
              View Action Plans
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionOwnerActionTakenPage;
