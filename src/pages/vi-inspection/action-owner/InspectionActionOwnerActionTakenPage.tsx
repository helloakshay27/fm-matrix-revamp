import { useMemo } from "react";
import { useInspectionDraft } from "@/components/vi-inspection/useInspectionDraft";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ListChecks, Paperclip, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import {
  auditFieldSx,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { getViInspection } from "@/components/vi-inspection/viInspectionData";
import { INSPECTION_ACTION_OWNER_PATH } from "./InspectionActionOwnerDetailPage";

// Same file types as the other inspection / incident attachments.
const ALLOWED_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";
const isAllowedAttachment = (file: File) =>
  ALLOWED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

type TakenKind = "corrective" | "preventive";

interface TakenEntry {
  description: string;
  attachments: File[];
  closureDate: string;
}

type FindingTaken = Record<TakenKind, TakenEntry[]>;

const TAKEN_LABEL: Record<TakenKind, string> = {
  corrective: "Corrective Action Taken",
  preventive: "Preventive Action Taken",
};

const todayIso = () => new Date().toISOString().split("T")[0];
const emptyEntry = (): TakenEntry => ({ description: "", attachments: [], closureDate: todayIso() });
const emptyFindingTaken = (): FindingTaken => ({ corrective: [emptyEntry()], preventive: [emptyEntry()] });

// Action Owner: add the corrective & preventive action taken for each checklist finding.
// The Inspection API is not live yet: Save Draft / Submit validate the form and return to the inspection.
const InspectionActionOwnerActionTakenPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const inspectionPath = `${INSPECTION_ACTION_OWNER_PATH}/${id}`;
  const findings = useMemo(() => getViInspection(id).checklist, [id]);

  const { value: taken, setValue: setTaken, loading, error, saving, retry, saveDraft, clearDraft } = useInspectionDraft<FindingTaken[]>(`action-owner-action-taken:${id}`, () => findings.map(emptyFindingTaken));

  const updateEntries = (findingIndex: number, kind: TakenKind, update: (entries: TakenEntry[]) => TakenEntry[]) =>
    setTaken((prev) => prev.map((item, i) => (i === findingIndex ? { ...item, [kind]: update(item[kind]) } : item)));

  const updateEntry = (findingIndex: number, kind: TakenKind, entryIndex: number, patch: Partial<TakenEntry>) =>
    updateEntries(findingIndex, kind, (entries) =>
      entries.map((entry, i) => (i === entryIndex ? { ...entry, ...patch } : entry)),
    );

  const addAttachments = (findingIndex: number, kind: TakenKind, entryIndex: number, fileList: FileList | null) => {
    const files = Array.from(fileList || []);
    const rejected = files.filter((f) => !isAllowedAttachment(f));
    if (rejected.length) {
      toast.error(
        `${rejected.map((f) => f.name).join(", ")} not allowed. Only PDF, JPEG, JPG and PNG files are accepted.`,
      );
    }
    const current = taken[findingIndex][kind][entryIndex].attachments;
    updateEntry(findingIndex, kind, entryIndex, { attachments: [...current, ...files.filter(isAllowedAttachment)] });
  };

  const handleSaveDraft = async () => {
    if (!(await saveDraft())) return;
    toast.success("Action taken saved to draft");
    navigate(inspectionPath);
  };

  const handleSubmit = async () => {
    for (const [findingIndex, item] of taken.entries()) {
      for (const kind of ["corrective", "preventive"] as TakenKind[]) {
        const invalid = item[kind].findIndex((e) => !e.description.trim() || !e.closureDate);
        if (invalid !== -1) {
          const suffix = item[kind].length > 1 ? ` (${invalid + 1})` : "";
          toast.error(
            `${findingIndex + 1}. ${findings[findingIndex].finding} — ${TAKEN_LABEL[kind]}${suffix}: description and Closure Date are required`,
          );
          return;
        }
      }
    }
    if (!(await clearDraft())) return;
    toast.success("Action taken submitted successfully");
    navigate(inspectionPath);
  };

  const renderTakenSection = (findingIndex: number, kind: TakenKind) => {
    const entries = taken[findingIndex][kind];
    return (
      <div className="rounded-xl border border-gray-200 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">{TAKEN_LABEL[kind]}</span>
          <button
            type="button"
            onClick={() => updateEntries(findingIndex, kind, (prev) => [...prev, emptyEntry()])}
            className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-gray-900 hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-6">
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex} className={entryIndex > 0 ? "border-t border-gray-200 pt-6" : ""}>
              {entries.length > 1 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-gray-900">Action {entryIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => updateEntries(findingIndex, kind, (prev) => prev.filter((_, i) => i !== entryIndex))}
                    className="rounded-[8px] p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label={`Remove action ${entryIndex + 1}`}
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
                  label={requiredLabel(TAKEN_LABEL[kind])}
                  placeholder="Describe the action taken..."
                  value={entry.description}
                  onChange={(e) => updateEntry(findingIndex, kind, entryIndex, { description: e.target.value })}
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
                        addAttachments(findingIndex, kind, entryIndex, e.target.files);
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
                              updateEntry(findingIndex, kind, entryIndex, {
                                attachments: entry.attachments.filter((_, i) => i !== fileIndex),
                              })
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
                    label={requiredLabel("Closure Date")}
                    value={entry.closureDate}
                    onChange={(e) => updateEntry(findingIndex, kind, entryIndex, { closureDate: e.target.value })}
                    sx={auditFieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (error) return <div className="p-6" role="alert">Unable to load draft. <button onClick={retry}>Retry</button></div>;
  if (loading) return <div className="p-6" role="status">Loading draft...</div>;
  return (
    <fieldset disabled={saving} className="p-4 sm:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(inspectionPath)}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Inspection</h1>
        <span className="text-sm text-gray-500">Action Taken</span>
      </div>

      <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
        <p className="text-sm text-gray-500">
          Add the corrective and preventive action taken for each checklist finding.
        </p>
      </DetailCard>

      {findings.map((finding, findingIndex) => (
        <DetailCard
          key={findingIndex}
          icon={sectionIcon(ListChecks)}
          title={`${findingIndex + 1}. ${finding.finding}`}
          className="mb-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {renderTakenSection(findingIndex, "corrective")}
            {renderTakenSection(findingIndex, "preventive")}
          </div>
        </DetailCard>
      ))}

      <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
        <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </fieldset>
  );
};

export default InspectionActionOwnerActionTakenPage;
