import { IncidentFieldGrid as FieldGrid } from "@/components/vi-incident/IncidentFieldGrid";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditLoadingState,
  sectionIcon,
  auditFieldSx,
} from "@/components/vi-audit/ViAuditUi";
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
  todayIso,
  type ViIncidentActionPlan,
  type ViIncidentAssignment,
  type ViIncidentAttachment,
} from "@/components/vi-incident/viIncidentData";
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
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(incidentPath)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Incident — {incident.incidentNo}</h1>
        <span className="text-sm text-gray-500">Action Taken</span>
      </div>

      <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
        <div className="space-y-8">
          {rows.map(({ plan, assignment, itemName }, index) => {
            const entry = entries[assignment.id];
            if (!entry) return null;
            const typeLabel = ACTION_TYPE_LABEL[plan.actionType];
            return (
              <div key={assignment.id} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                <div className="mb-1 text-sm font-semibold text-gray-900">
                  {index + 1}. {itemName || "Action plan"}
                </div>
                <div className="mb-4 rounded-lg bg-[#F6F4EE] px-4 py-3">
                  <div className="mb-1 text-xs font-semibold text-gray-500">{typeLabel} Action Plan</div>
                  <p className="mb-3 text-sm text-gray-900 whitespace-pre-wrap">{plan.description || "-"}</p>
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
                    sx={auditFieldSx}
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
                      sx={auditFieldSx}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DetailCard>

      <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
        <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => save(false)} disabled={saving}>
          Save Draft
        </button>
        <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => save(true)} disabled={saving}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default IncidentActionOwnerActionTakenPage;
