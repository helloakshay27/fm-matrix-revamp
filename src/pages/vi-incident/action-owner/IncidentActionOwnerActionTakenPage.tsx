import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Paperclip, ShieldCheck, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import {
  auditFieldSx,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
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
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Incident</h1>
        <span className="text-sm text-gray-500">Action Taken</span>
      </div>

      <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
        <div className="space-y-8">
          {plans.map((plan, index) => {
            const entry = entries[index];
            return (
              <div key={plan.id} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                <div className="mb-4 text-sm font-semibold text-gray-900">
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
                    sx={auditFieldSx}
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
                    sx={auditFieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                  <div>
                    <label className="inline-flex items-center justify-center gap-2 h-9 px-4 text-sm border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50 cursor-pointer">
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
                            className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-900"
                          >
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateEntry(index, { attachments: entry.attachments.filter((_, i) => i !== fileIndex) })
                              }
                              className="text-gray-500 hover:text-gray-900"
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
        <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default IncidentActionOwnerActionTakenPage;
