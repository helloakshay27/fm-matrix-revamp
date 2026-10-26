import { IncidentFieldGrid as FieldGrid } from "@/components/vi-incident/IncidentFieldGrid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { AuditLoadingState, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { AttachmentPicker } from "@/components/vi-incident/IncidentFormFields";
import { planTargetLabel } from "@/components/vi-incident/IncidentActionPlanCards";
import {
  errorToast,
  myActionPlans,
  saveViIncidentAssignment,
  submitViIncidentAssignment,
  useViIncidentDetail,
  useViIncidentMyAssignmentIds,
} from "@/components/vi-incident/viIncidentApi";
import {
  ACTION_TYPE_LABEL,
  isAssignmentDraft,
  todayIso,
  type ViIncidentActionPlan,
  type ViIncidentAssignment,
  type ViIncidentAttachment,
} from "@/components/vi-incident/viIncidentData";
import { IncidentStatusPill } from "@/components/vi-incident/IncidentListView";
import { INCIDENT_ACTION_OWNER_PATH } from "./IncidentActionOwnerListPage";

interface ActionTakenEntry {
  actionTaken: string;
  closureDate: string;
  files: File[];
  saved: ViIncidentAttachment[];
  removedIds: string[];
}

// Action Owner: the action taken for each of their open / draft assignments on the incident.
// Save Draft — PATCH /vi_incident_action_assignments/:id.json (multipart, with files);
// Submit — the same save, then POST .../:id/submit.json. The last owner's submit closes the incident.
const IncidentActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const incidentPath = `${INCIDENT_ACTION_OWNER_PATH}/${id}`;
  const { incident, loading: incidentLoading } = useViIncidentDetail(id);
  const { ids: myAssignmentIds, loading: assignmentsLoading } = useViIncidentMyAssignmentIds(id);
  const loading = incidentLoading || assignmentsLoading;

  // One row per pending assignment, with the plan it belongs to.
  const rows = useMemo<{ plan: ViIncidentActionPlan; assignment: ViIncidentAssignment; itemName: string }[]>(() => {
    if (!incident) return [];
    const itemName = (itemId: string) => incident.checklistItems.find((item) => item.id === itemId)?.name ?? "";
    return myActionPlans(incident, myAssignmentIds).flatMap((plan) =>
      plan.assignments
        .filter((a) => a.status !== "closed")
        .map((assignment) => ({ plan, assignment, itemName: itemName(plan.checklistItemId) })),
    );
  }, [incident, myAssignmentIds]);

  const [entries, setEntries] = useState<Record<string, ActionTakenEntry>>({});
  const [saving, setSaving] = useState(false);
  const submitted = useRef(new Set<string>());

  // Start from what was saved as a draft.
  const prefilled = useRef(false);
  useEffect(() => {
    if (loading || !incident || prefilled.current) return;
    prefilled.current = true;
    setEntries(
      Object.fromEntries(
        rows.map(({ assignment }) => [
          assignment.id,
          {
            actionTaken: assignment.actionTaken,
            closureDate: assignment.closureDate || todayIso(),
            files: [],
            saved: assignment.attachments,
            removedIds: [],
          },
        ]),
      ),
    );
  }, [loading, incident, rows]);

  const updateEntry = (assignmentId: string, patch: Partial<ActionTakenEntry>) =>
    setEntries((prev) => ({ ...prev, [assignmentId]: { ...prev[assignmentId], ...patch } }));

  const save = async (submit: boolean) => {
    if (saving) return;
    if (submit) {
      const invalid = rows.findIndex(({ assignment }) => {
        const entry = entries[assignment.id];
        return !entry?.actionTaken.trim() || !entry.closureDate;
      });
      if (invalid !== -1) {
        toast.error(`${invalid + 1}. ${rows[invalid].itemName}: Action taken and Closure Date are required`);
        return;
      }
    }
    setSaving(true);
    try {
      // Assignments are saved one by one. On a partial failure, what already went through is
      // remembered so a retry neither re-uploads files nor re-submits (a second submit is a 403).
      for (const { assignment } of rows) {
        const entry = entries[assignment.id];
        if (!entry || submitted.current.has(assignment.id)) continue;
        await saveViIncidentAssignment(assignment.id, {
          actionTaken: entry.actionTaken.trim(),
          closureDate: entry.closureDate,
          files: entry.files,
          removeAttachmentIds: entry.removedIds,
        });
        updateEntry(assignment.id, { files: [], removedIds: [] });
        if (submit) {
          await submitViIncidentAssignment(assignment.id, entry.actionTaken.trim(), entry.closureDate);
          submitted.current.add(assignment.id);
        }
      }
      toast.success(submit ? "Action taken submitted successfully" : "Action taken saved to draft");
      navigate(incidentPath);
    } catch (error) {
      errorToast(submit ? "Failed to submit action taken" : "Failed to save draft", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AuditLoadingState message="Loading incident..." />;
  if (!incident) return <AuditLoadingState message="Incident not found." onBack={() => navigate(INCIDENT_ACTION_OWNER_PATH)} />;
  if (!rows.length || incident.storedStatus !== "open") {
    return <AuditLoadingState message="No pending actions on this incident." onBack={() => navigate(incidentPath)} />;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(incidentPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident — {incident.incidentNo}</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">Action Taken</span>
        {rows.some(({ assignment }) => isAssignmentDraft(assignment)) && (
          <IncidentStatusPill status="Draft" />
        )}
      </div>

      <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
        <div className="space-y-8">
          {rows.map(({ plan, assignment, itemName }, index) => {
            const entry = entries[assignment.id];
            if (!entry) return null;
            const typeLabel = ACTION_TYPE_LABEL[plan.actionType];
            return (
              <div key={assignment.id} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
                <div className="mb-1 text-sm font-semibold text-[#1A1A18]">
                  {index + 1}. {itemName || "Action plan"}
                </div>
                <div className="mb-4 rounded-[12px] bg-[#F7F6F2] px-4 py-3">
                  <div className="mb-1 text-xs font-semibold text-[rgba(26,26,24,0.48)]">{typeLabel} Action Plan</div>
                  <p className="mb-3 text-sm text-[#1A1A18] whitespace-pre-wrap">{plan.description || "-"}</p>
                  <FieldGrid columns={2} fields={[{ label: "Target Date", value: planTargetLabel(plan) }]} />
                </div>
                <div className="space-y-5">
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={requiredLabel(`${typeLabel} Action taken`)}
                    placeholder="Describe the action taken..."
                    value={entry.actionTaken}
                    onChange={(e) => updateEntry(assignment.id, { actionTaken: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <AttachmentPicker
                    label="Upload Attachment"
                    files={entry.files}
                    onFilesChange={(files) => updateEntry(assignment.id, { files })}
                    existing={entry.saved}
                    onRemoveExisting={(attachment) =>
                      updateEntry(assignment.id, {
                        saved: entry.saved.filter((a) => a !== attachment),
                        removedIds: attachment.id ? [...entry.removedIds, attachment.id] : entry.removedIds,
                      })
                    }
                  />
                  <div className="max-w-sm">
                    <TextField
                      fullWidth
                      type="date"
                      label={requiredLabel("Select closure Date")}
                      value={entry.closureDate}
                      onChange={(e) => updateEntry(assignment.id, { closureDate: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DetailCard>

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button type="button" className="fm-action-secondary" onClick={() => save(false)} disabled={saving}>
          Save Draft
        </button>
        <button type="button" className="fm-action-primary" onClick={() => save(true)} disabled={saving}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default IncidentActionOwnerActionTakenPage;
