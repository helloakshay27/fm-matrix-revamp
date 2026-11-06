import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { auditFieldSx, AuditLoadingState, FieldGrid, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { AttachmentLinks, AttachmentPicker } from "@/components/vi-incident/IncidentFormFields";
import { planTargetLabel } from "@/components/vi-inspection/InspectionPlanCard";
import {
  createViInspectionActionTaken,
  deleteViInspectionActionTaken,
  errorToast,
  isMyAssignment,
  submitViInspectionAssignment,
  updateViInspectionActionTaken,
  useViInspectionDetail,
} from "@/components/vi-inspection/viInspectionApi";
import {
  ACTION_TYPE_LABEL,
  assignmentStatus,
  formatInspectionDate,
  isPlanDraft,
  todayIso,
  type ViInspectionActionPlan,
  type ViInspectionAssignment,
  type ViInspectionAttachment,
  type ViInspectionChecklistResponse,
} from "@/components/vi-inspection/viInspectionData";
import { INSPECTION_ACTION_OWNER_PATH } from "./InspectionActionOwnerDetailPage";

interface EntryDraft {
  /** Saved entry id, or null for a new one. */
  id: string | null;
  description: string;
  closureDate: string;
  files: File[];
  existing: ViInspectionAttachment[];
  removeAttachmentIds: string[];
  dirty: boolean;
}

interface MyAssignment {
  assignment: ViInspectionAssignment;
  plan: ViInspectionActionPlan;
  response: ViInspectionChecklistResponse;
}

const newEntry = (): EntryDraft => ({
  id: null,
  description: "",
  closureDate: todayIso(),
  files: [],
  existing: [],
  removeAttachmentIds: [],
  dirty: true,
});

const entriesFrom = (assignment: ViInspectionAssignment): EntryDraft[] =>
  assignment.actionTakens.length
    ? assignment.actionTakens.map((t) => ({
        id: t.id,
        description: t.description,
        closureDate: t.closureDate,
        files: [],
        existing: t.attachments,
        removeAttachmentIds: [],
        dirty: false,
      }))
    : [newEntry()];

// Action Owner: action-taken entries on the owner's own assignments. Each entry is its own record
// (POST / PATCH / DELETE /vi_inspection_action_takens); Submit (POST
// /vi_inspection_action_assignments/:id/submit.json) closes only this owner's assignment.
const InspectionActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const inspectionPath = `${INSPECTION_ACTION_OWNER_PATH}/${id}`;
  const { inspection, loading, reload } = useViInspectionDetail(id);

  const [entries, setEntries] = useState<Record<string, EntryDraft[]>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  // Assignments whose entries should be re-read from the server after the next reload.
  const resync = useRef<Set<string>>(new Set());

  const mine = useMemo<MyAssignment[]>(
    () =>
      inspection
        ? inspection.checklistResponses.flatMap((response) =>
            response.actionPlans
              .filter((plan) => !isPlanDraft(plan))
              .flatMap((plan) =>
                plan.assignments
                  .filter((assignment) => isMyAssignment(assignment, inspection))
                  .map((assignment) => ({ assignment, plan, response })),
              ),
          )
        : [],
    [inspection],
  );

  // Seed each assignment's entries once, and again after it was saved / submitted.
  useEffect(() => {
    setEntries((prev) => {
      const next = { ...prev };
      for (const { assignment } of mine) {
        if (!next[assignment.id] || resync.current.has(assignment.id)) next[assignment.id] = entriesFrom(assignment);
      }
      resync.current.clear();
      return next;
    });
  }, [mine]);

  const updateEntry = (assignmentId: string, index: number, patch: Partial<EntryDraft>) =>
    setEntries((prev) => ({
      ...prev,
      [assignmentId]: prev[assignmentId].map((e, i) => (i === index ? { ...e, ...patch, dirty: true } : e)),
    }));

  const saveEntries = async (assignmentId: string) => {
    for (const entry of entries[assignmentId] ?? []) {
      if (!entry.dirty) continue;
      // A brand-new entry left empty is just skipped.
      if (!entry.id && !entry.description.trim() && !entry.files.length) continue;
      const input = {
        description: entry.description.trim(),
        closureDate: entry.closureDate,
        files: entry.files,
        removeAttachmentIds: entry.removeAttachmentIds,
      };
      if (entry.id) await updateViInspectionActionTaken(entry.id, input);
      else await createViInspectionActionTaken(assignmentId, input);
    }
  };

  const refresh = (assignmentId: string) => {
    resync.current.add(assignmentId);
    reload();
  };

  const handleSaveDraft = async (assignmentId: string) => {
    if (busyId) return;
    setBusyId(assignmentId);
    try {
      await saveEntries(assignmentId);
      toast.success("Action taken saved to draft");
      refresh(assignmentId);
    } catch (error) {
      errorToast("Failed to save action taken", error);
    } finally {
      setBusyId(null);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    if (busyId) return;
    const list = (entries[assignmentId] ?? []).filter((e) => e.id || e.description.trim() || e.files.length);
    if (!list.length) {
      toast.error("Add at least one action taken before submitting");
      return;
    }
    const invalid = list.findIndex((e) => !e.description.trim() || !e.closureDate);
    if (invalid !== -1) {
      toast.error(`Action Taken ${invalid + 1}: description and Closure Date are required`);
      return;
    }
    setBusyId(assignmentId);
    try {
      await saveEntries(assignmentId);
      await submitViInspectionAssignment(assignmentId);
      toast.success("Action taken submitted successfully");
      refresh(assignmentId);
    } catch (error) {
      errorToast("Failed to submit action taken", error);
      // Entries saved before the failure are on the server now.
      refresh(assignmentId);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (assignmentId: string, index: number) => {
    const entry = entries[assignmentId][index];
    if (!entry.id) {
      setEntries((prev) => {
        const next = prev[assignmentId].filter((_, i) => i !== index);
        return { ...prev, [assignmentId]: next.length ? next : [newEntry()] };
      });
      return;
    }
    if (busyId) return;
    setBusyId(assignmentId);
    try {
      await deleteViInspectionActionTaken(entry.id);
      toast.success("Action taken deleted");
      refresh(assignmentId);
    } catch (error) {
      errorToast("Failed to delete action taken", error);
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !inspection) return <AuditLoadingState message="Loading inspection..." onBack={() => navigate(inspectionPath)} />;
  if (!inspection) return <AuditLoadingState message="Inspection not found." onBack={() => navigate(INSPECTION_ACTION_OWNER_PATH)} />;

  const renderAssignment = ({ assignment, plan, response }: MyAssignment) => {
    const closed = assignment.status === "closed";
    const busy = busyId === assignment.id;
    const list = entries[assignment.id] ?? [];
    const status = assignmentStatus(assignment.status);

    return (
      <DetailCard
        key={assignment.id}
        icon={sectionIcon(ShieldCheck)}
        title={`${ACTION_TYPE_LABEL[plan.actionType]} Action — ${response.question}`}
        className="mb-5"
        headerActions={
          <span className={`whitespace-nowrap rounded px-2 py-1 text-xs font-medium ${status.tone}`}>
            {status.label}
          </span>
        }
      >
        <FieldGrid
          columns={3}
          fields={[
            { label: "Checklist Answer", value: response.answer },
            { label: "Action Type", value: ACTION_TYPE_LABEL[plan.actionType] },
            { label: "Target Date", value: planTargetLabel(plan) },
            ...(plan.extensionReason ? [{ label: "Reason for Extension", value: plan.extensionReason, span: true }] : []),
            { label: "Action Description", value: plan.description, span: true },
          ]}
        />

        <fieldset disabled={busy || closed} className="mt-5 space-y-6 border-t border-gray-200 pt-5">
          {closed ? (
            assignment.actionTakens.map((entry, index) => (
              <div key={entry.id} className={index > 0 ? "border-t border-gray-200 pt-5" : ""}>
                <div className="mb-1 text-xs font-semibold text-gray-500">Action Taken {index + 1}</div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{entry.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Closure Date: <span className="font-medium text-gray-900">{formatInspectionDate(entry.closureDate)}</span>
                </div>
                {entry.attachments.length > 0 && (
                  <div className="mt-2">
                    <AttachmentLinks attachments={entry.attachments} />
                  </div>
                )}
              </div>
            ))
          ) : (
            list.map((entry, index) => (
              <div key={entry.id ?? `new-${index}`} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-gray-900">
                    Action Taken {index + 1}
                    {entry.dirty && entry.id && <span className="ml-2 text-xs font-medium text-gray-500">(unsaved)</span>}
                  </span>
                  {(list.length > 1 || entry.id) && (
                    <button
                      type="button"
                      onClick={() => handleDelete(assignment.id, index)}
                      className="rounded-[8px] p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      aria-label={`Delete action taken ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-5">
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    sx={auditFieldSx}
                    label={requiredLabel("Description of action taken")}
                    placeholder="Describe the action taken..."
                    value={entry.description}
                    onChange={(e) => updateEntry(assignment.id, index, { description: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <AttachmentPicker
                    label="Upload Attachment"
                    files={entry.files}
                    onFilesChange={(files) => updateEntry(assignment.id, index, { files })}
                    existing={entry.existing}
                    onRemoveExisting={(attachment) =>
                      updateEntry(assignment.id, index, {
                        existing: entry.existing.filter((a) => a.id !== attachment.id),
                        removeAttachmentIds: [...entry.removeAttachmentIds, attachment.id],
                      })
                    }
                  />
                  <div className="max-w-sm">
                    <TextField
                      sx={auditFieldSx}
                      fullWidth
                      type="date"
                      label={requiredLabel("Closure Date")}
                      value={entry.closureDate}
                      onChange={(e) => updateEntry(assignment.id, index, { closureDate: e.target.value })}
                      inputProps={{ max: todayIso() }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          {!closed && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setEntries((prev) => ({ ...prev, [assignment.id]: [...(prev[assignment.id] ?? []), newEntry()] }))}
                className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-gray-900 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
                Add Action Taken
              </button>
              <div className="flex gap-2">
                <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => handleSaveDraft(assignment.id)}>
                  {busy ? "Saving..." : "Save Draft"}
                </button>
                <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => handleSubmit(assignment.id)}>
                  {busy ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </fieldset>
      </DetailCard>
    );
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(inspectionPath)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Inspection — {inspection.inspectionNo}</h1>
        <span className="text-sm text-gray-500">Action Taken</span>
      </div>

      {mine.length ? (
        mine.map(renderAssignment)
      ) : (
        <p className="py-16 text-center text-sm text-gray-500">No actions are assigned to you on this inspection.</p>
      )}
    </div>
  );
};

export default InspectionActionOwnerActionTakenPage;
