import { useEffect, useMemo, useState } from "react";
import { useInspectionDraft } from "@/components/vi-inspection/useInspectionDraft";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, ClipboardCheck, FileText, Paperclip, User, UserPlus, X } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { useViAuditMasters } from "@/components/vi-audit/useViAuditMasters";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { AutocompleteLabel, UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { InfoRow, SelectField, getLoggedInUser, requiredLabel } from "@/components/vi-audit/AuditFormFields";
import {
  CHECKLIST_ANSWERS,
  INSPECTION_CHECKLIST,
  INSPECTION_TYPE_OPTIONS,
} from "@/components/vi-inspection/viInspectionData";
import { INSPECTION_INSPECTOR_PATH } from "./InspectionRolePlaceholderPage";

// Attachments accept the same file types as incident/audit.
const ALLOWED_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";
const isAllowedAttachment = (file: File) =>
  ALLOWED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

interface ChecklistAnswer {
  answer: string;
  remarks: string;
  attachments: File[];
}

/** Thumbnail for an image attachment (file chip for PDFs), with a remove button. */
const AttachmentPreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const isImage = file.type.startsWith("image/");
  const url = useMemo(() => (isImage ? URL.createObjectURL(file) : ""), [file, isImage]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  return (
    <div className="relative" title={file.name}>
      {isImage ? (
        <img src={url} alt={file.name} className="h-20 w-24 rounded-[10px] object-cover border border-[rgba(26,26,24,0.09)]" />
      ) : (
        <div className="flex h-20 w-24 flex-col items-center justify-center gap-1 rounded-[10px] bg-[#F5F4F0] px-1 text-[rgba(26,26,24,0.48)]">
          <FileText className="w-5 h-5" />
          <span className="w-full truncate text-center text-[10px]">{file.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[rgba(26,26,24,0.68)] shadow hover:text-[#1A1A18]"
        aria-label={`Remove ${file.name}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const TOTAL_STEPS = 3;
const todayIso = () => new Date().toISOString().split("T")[0];

// Inspector: create inspection — step 1 (inspector + basic details), step 2 (checklist), step 3 (assignment).
// The Inspection API is not live yet: Save draft / Submit validate the form and return to the list.
const InspectionInspectorAddPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViAuditMasters();
  const [step, setStep] = useState(1);

  const { value: draft, setValue: setDraft, loading, error, saving, retry, saveDraft, clearDraft } = useInspectionDraft("inspector-add", () => ({
    basic: {
    dateOfInspection: todayIso(),
    circle: "",
    personnelArea: "",
    workLocation: "",
    location: "",
    function: "",
    facilityType: "",
    type: "",
    },
    answers: Object.fromEntries(INSPECTION_CHECKLIST.map((q) => [q.id, { answer: "", remarks: "", attachments: [] }])) as Record<string, ChecklistAnswer>,
    spoc: null as ViActiveUserOption | null,
    functionalHead: null as ViActiveUserOption | null,
    targetDate: "",
  }));
  const { basic, answers, spoc, functionalHead, targetDate } = draft;
  const setBasic = (update: (previous: typeof basic) => typeof basic) => setDraft((prev) => ({ ...prev, basic: update(prev.basic) }));
  const setAnswers = (update: (previous: typeof answers) => typeof answers) => setDraft((prev) => ({ ...prev, answers: update(prev.answers) }));
  const setSpoc = (value: ViActiveUserOption | null) => setDraft((prev) => ({ ...prev, spoc: value }));
  const setFunctionalHead = (value: ViActiveUserOption | null) => setDraft((prev) => ({ ...prev, functionalHead: value }));
  const setTargetDate = (value: string) => setDraft((prev) => ({ ...prev, targetDate: value }));

  const updateAnswer = (id: string, patch: Partial<ChecklistAnswer>) =>
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const validateStepOne = () => {
    const missing = [
      !basic.dateOfInspection && "Date of Inspection",
      !basic.circle && "Circle",
      !basic.personnelArea && "Personnel Area",
      !basic.workLocation && "Work Location",
      !basic.location.trim() && "Inspection Location",
      !basic.function && "Function",
      !basic.facilityType && "Type of Facility",
      !basic.type && "Type",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    const unanswered = INSPECTION_CHECKLIST.findIndex((q) => !answers[q.id].answer);
    if (unanswered !== -1) {
      toast.error(`Please answer checklist question ${unanswered + 1}`);
      return false;
    }
    return true;
  };

  const validateStepThree = () => {
    const missing = [!spoc && "SPOC", !functionalHead && "Functional Head", !targetDate && "Target Date"].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleBack = () => (step > 1 ? setStep(step - 1) : navigate(INSPECTION_INSPECTOR_PATH));

  const handleNext = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;
    setStep(step + 1);
  };

  const handleSaveDraft = async () => {
    if (!(await saveDraft())) return;
    toast.success("Inspection saved to draft");
    navigate(INSPECTION_INSPECTOR_PATH);
  };

  const handleSubmit = async () => {
    if (!validateStepOne() || !validateStepTwo() || !validateStepThree()) return;
    if (!(await clearDraft())) return;
    toast.success("Inspection submitted successfully");
    navigate(INSPECTION_INSPECTOR_PATH);
  };

  const addAttachments = (id: string, fileList: FileList | null) => {
    const files = Array.from(fileList || []);
    const rejected = files.filter((f) => !isAllowedAttachment(f));
    if (rejected.length) {
      toast.error(
        `${rejected.map((f) => f.name).join(", ")} not allowed. Only PDF, JPEG, JPG and PNG files are accepted.`,
      );
    }
    updateAnswer(id, { attachments: [...answers[id].attachments, ...files.filter(isAllowedAttachment)] });
  };

  if (error) return <div className="p-6" role="alert">Unable to load draft. <button onClick={retry}>Retry</button></div>;
  if (loading) return <div className="p-6" role="status">Loading draft...</div>;
  return (
    <fieldset disabled={saving} className="p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Inspection</h1>
      </div>

      {/* Stepper: n of 3 steps — completed steps show a check */}
      <div className="mb-6 max-w-md">
        <p className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">
          {step} of {TOTAL_STEPS} steps
        </p>
        <div className="flex items-center">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div key={n} className={`flex items-center ${n < TOTAL_STEPS ? "flex-1" : ""}`}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  n <= step
                    ? "border-[1.5px] border-[#1A1A18] bg-[#F1EEE7] text-[#1A1A18]"
                    : "border border-[rgba(26,26,24,0.12)] bg-white text-[rgba(26,26,24,0.48)]"
                }`}
              >
                {n < step ? <Check className="w-4 h-4" /> : n}
              </span>
              {n < TOTAL_STEPS && (
                <span className={`mx-2 h-px flex-1 ${n < step ? "bg-[#1A1A18]" : "bg-[rgba(26,26,24,0.12)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <DetailCard icon={sectionIcon(User)} title="Inspector Details" className="mb-5">
            <div className="space-y-2">
              <InfoRow label="Name" value={loggedInUser.name} />
              <InfoRow label="Mail ID" value={loggedInUser.email} />
              <InfoRow label="Employer Name" value={loggedInUser.designation} />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
              <TextField
                fullWidth
                type="date"
                label={requiredLabel("Date of Inspection")}
                value={basic.dateOfInspection}
                onChange={(e) => setBasic((p) => ({ ...p, dateOfInspection: e.target.value }))}
                inputProps={{ max: todayIso() }}
                InputLabelProps={{ shrink: true }}
              />
              <SelectField
                label="Circle"
                required
                value={basic.circle}
                onChange={(v) => setBasic((p) => ({ ...p, circle: v }))}
                options={masters.clusters}
                loading={mastersLoading}
                placeholder="Select inspection circle"
              />
              <SelectField
                label="Personnel Area"
                required
                value={basic.personnelArea}
                onChange={(v) => setBasic((p) => ({ ...p, personnelArea: v }))}
                options={masters.circles}
                loading={mastersLoading}
                placeholder="Select personnel area"
              />
              <SelectField
                label="Work Location"
                required
                value={basic.workLocation}
                onChange={(v) => setBasic((p) => ({ ...p, workLocation: v }))}
                options={masters.workLocations}
                loading={mastersLoading}
                placeholder="Select work location"
              />
              <TextField
                fullWidth
                label={requiredLabel("Inspection Location")}
                placeholder="Enter inspection location"
                value={basic.location}
                onChange={(e) => setBasic((p) => ({ ...p, location: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <SelectField
                label="Function"
                required
                value={basic.function}
                onChange={(v) => setBasic((p) => ({ ...p, function: v }))}
                options={masters.departments}
                loading={mastersLoading}
                placeholder="Select inspection function"
              />
              <SelectField
                label="Type of Facility"
                required
                value={basic.facilityType}
                onChange={(v) => setBasic((p) => ({ ...p, facilityType: v }))}
                options={masters.visitBusinessAreas}
                loading={mastersLoading}
                placeholder="Select type of facility"
              />
              <SelectField
                label="Type"
                required
                value={basic.type}
                onChange={(v) => setBasic((p) => ({ ...p, type: v }))}
                options={INSPECTION_TYPE_OPTIONS}
                placeholder="Select inspection type"
              />
            </div>
          </DetailCard>
        </>
      )}

      {step === 2 && (
        <DetailCard icon={sectionIcon(ClipboardCheck)} title="Checklists" className="mb-5">
          <div className="space-y-6">
            {INSPECTION_CHECKLIST.map((q, index) => {
              const entry = answers[q.id];
              return (
                <div key={q.id} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
                  <p className="mb-3 text-sm font-medium text-[#1A1A18]">
                    {index + 1}. {requiredLabel(q.question)}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-6">
                    {CHECKLIST_ANSWERS.map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1A18]">
                        <input
                          type="radio"
                          name={`checklist-${q.id}`}
                          value={option}
                          checked={entry.answer === option}
                          onChange={() => updateAnswer(q.id, { answer: option })}
                          className="h-4 w-4 accent-[#1A1A18]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Remarks (if any)"
                    placeholder="Enter remarks"
                    value={entry.remarks}
                    onChange={(e) => updateAnswer(q.id, { remarks: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                  {entry.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.attachments.map((file, i) => (
                        <AttachmentPreview
                          key={`${file.name}-${i}`}
                          file={file}
                          onRemove={() =>
                            updateAnswer(q.id, { attachments: entry.attachments.filter((_, idx) => idx !== i) })
                          }
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#1A1A18] underline-offset-2 hover:underline">
                      <Paperclip className="w-4 h-4" />
                      Attachment
                      <input
                        type="file"
                        multiple
                        accept={ATTACHMENT_ACCEPT}
                        className="hidden"
                        onChange={(e) => {
                          addAttachments(q.id, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </DetailCard>
      )}

      {step === 3 && (
        <DetailCard icon={sectionIcon(UserPlus)} title="Assign Functional Head" className="mb-5">
          <div className="grid grid-cols-3 items-end gap-5 [&>div]:min-w-0">
            <UserSelectField
              label="SPOC"
              required
              value={spoc}
              onChange={setSpoc}
              employeeType="internal"
              placeholder="Search SPOC by email or mobile"
            />
            <UserSelectField
              label="Functional Head"
              required
              value={functionalHead}
              onChange={setFunctionalHead}
              employeeType="internal"
              placeholder="Search functional head by email or mobile"
            />
            <div>
              <AutocompleteLabel required>Select Target Date</AutocompleteLabel>
              <TextField
                fullWidth
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                inputProps={{ min: todayIso(), "aria-label": "Select Target Date" }}
              />
            </div>
          </div>
        </DetailCard>
      )}

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button type="button" className="fm-action-secondary" onClick={handleSaveDraft}>
          Save draft
        </button>
        {step < TOTAL_STEPS ? (
          <button type="button" className="fm-action-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button type="button" className="fm-action-primary" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </fieldset>
  );
};

export default InspectionInspectorAddPage;
