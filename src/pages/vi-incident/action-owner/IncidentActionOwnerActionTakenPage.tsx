import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Paperclip, ShieldCheck, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { getViIncident, getViIncidentActionPlans } from "@/components/vi-incident/viIncidentData";
import { saveSubmittedActionTaken } from "@/components/vi-incident/viIncidentActionTakenStore";
import { INCIDENT_ACTION_OWNER_PATH } from "./IncidentActionOwnerListPage";

// Same file types as the other incident / audit attachments.
const ALLOWED_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";
const isAllowedAttachment = (file: File) =>
  ALLOWED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

interface ActionTakenEntry {
  corrective: string;
  preventive: string;
  attachments: File[];
  closureDate: string;
}

const todayIso = () => new Date().toISOString().split("T")[0];

// Action Owner: add the corrective & preventive action taken for each plan assigned to them.
// The Incident API is not live yet: Save Draft / Submit validate the form and return to the incident.
const IncidentActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const incidentPath = `${INCIDENT_ACTION_OWNER_PATH}/${id}`;
  const plans = useMemo(() => getViIncidentActionPlans(getViIncident(id)), [id]);

  const [entries, setEntries] = useState<ActionTakenEntry[]>(() =>
    plans.map(() => ({ corrective: "", preventive: "", attachments: [], closureDate: todayIso() })),
  );

  const updateEntry = (index: number, patch: Partial<ActionTakenEntry>) =>
    setEntries((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const handleSaveDraft = () => {
    toast.success("Action taken saved to draft");
    navigate(incidentPath);
  };

  const handleSubmit = () => {
    for (const [index, entry] of entries.entries()) {
      const label = `${index + 1}. ${plans[index].cause}`;
      if (!entry.corrective.trim() || !entry.preventive.trim() || !entry.closureDate) {
        toast.error(`${label}: Corrective action, Preventive action and Closure Date are required`);
        return;
      }
    }
    saveSubmittedActionTaken(
      id,
      Object.fromEntries(
        plans.map((plan, index) => [
          plan.id,
          {
            corrective: entries[index].corrective.trim(),
            preventive: entries[index].preventive.trim(),
            closureDate: new Date(entries[index].closureDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            attachments: entries[index].attachments.map((file) => file.name),
          },
        ]),
      ),
    );
    toast.success("Action taken submitted successfully");
    navigate(incidentPath);
  };

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
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">Action Taken</span>
      </div>

      <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
        <div className="space-y-8">
          {plans.map((plan, index) => {
            const entry = entries[index];
            return (
              <div key={plan.id} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
                <div className="mb-4 text-sm font-semibold text-[#1A1A18]">
                  {index + 1}. {plan.cause}
                </div>
                <div className="space-y-5">
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={requiredLabel("Corrective Action taken")}
                    placeholder="Describe immediate actions to be taken..."
                    value={entry.corrective}
                    onChange={(e) => updateEntry(index, { corrective: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={requiredLabel("Preventive Action taken")}
                    placeholder="Describe immediate actions to be taken..."
                    value={entry.preventive}
                    onChange={(e) => updateEntry(index, { preventive: e.target.value })}
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
                          const rejected = files.filter((f) => !isAllowedAttachment(f));
                          if (rejected.length) {
                            toast.error(
                              `${rejected.map((f) => f.name).join(", ")} not allowed. Only PDF, JPEG, JPG and PNG files are accepted.`,
                            );
                          }
                          updateEntry(index, { attachments: [...entry.attachments, ...files.filter(isAllowedAttachment)] });
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
                                updateEntry(index, { attachments: entry.attachments.filter((_, i) => i !== fileIndex) })
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
                      label={requiredLabel("Select closure Date")}
                      value={entry.closureDate}
                      onChange={(e) => updateEntry(index, { closureDate: e.target.value })}
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
        <button type="button" className="fm-action-secondary" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button type="button" className="fm-action-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default IncidentActionOwnerActionTakenPage;
