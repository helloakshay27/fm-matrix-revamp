import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, FileText, HeartPulse, Paperclip, Trash2, User, X } from "lucide-react";
import { Switch, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { useViAuditMasters } from "@/components/vi-audit/useViAuditMasters";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import {
  AddMoreButton,
  InfoRow,
  SelectField,
  getLoggedInUser,
  requiredLabel,
} from "@/components/vi-audit/AuditFormFields";
import {
  BODY_PART_OPTIONS,
  INJURY_TYPE_OPTIONS,
  PERSON_IMPACTED_OPTIONS,
} from "@/components/vi-incident/viIncidentData";
import { INCIDENT_REPORTER_PATH } from "./IncidentReporterListPage";

// Attachments accept the same file types as audit observations.
const ALLOWED_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";
const isAllowedAttachment = (file: File) =>
  ALLOWED_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

interface InjuryEntry {
  age: string;
  personType: string;
  vendor: string;
  subVendor: string;
  natureOfInjury: string;
  bodyPart: string;
  daysAwayFromWork: string;
  restrictedWorkDays: string;
}

const EMPTY_INJURY: InjuryEntry = {
  age: "",
  personType: "",
  vendor: "",
  subVendor: "",
  natureOfInjury: "",
  bodyPart: "",
  daysAwayFromWork: "",
  restrictedWorkDays: "",
};

const todayIso = () => new Date().toISOString().split("T")[0];
const nowTime = () => new Date().toTimeString().slice(0, 5);

// Reporter: create incident — step 1 (reporter, basic, classification), step 2 (incident, injury).
// The Incident API is not live yet: Save draft / Submit validate the form and return to the list.
const IncidentReporterAddPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViAuditMasters();
  const [step, setStep] = useState<1 | 2>(1);

  const [reportedOn] = useState({ date: todayIso(), time: nowTime() });
  const [basic, setBasic] = useState({
    dateOfIncident: "",
    timeOfIncident: "",
    circle: "",
    personnelArea: "",
    workLocation: "",
    facilityType: "",
    location: "",
    function: "",
  });
  const [classification, setClassification] = useState({ classification: "", category: "", subCategory: "" });
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [spoc, setSpoc] = useState<ViActiveUserOption | null>(null);
  const [functionalHead, setFunctionalHead] = useState<ViActiveUserOption | null>(null);
  const [injuryHappened, setInjuryHappened] = useState(false);
  const [injuries, setInjuries] = useState<InjuryEntry[]>([{ ...EMPTY_INJURY }]);

  const updateInjury = (index: number, patch: Partial<InjuryEntry>) =>
    setInjuries((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const validateStepOne = () => {
    const missing = [
      !basic.dateOfIncident && "Date of Incident",
      !basic.timeOfIncident && "Time of Incident",
      !basic.circle && "Circle",
      !basic.personnelArea && "Personnel Area",
      !basic.workLocation && "Work Location",
      !basic.facilityType && "Type of Facility",
      !basic.location.trim() && "Location",
      !basic.function && "Function",
      !classification.classification && "Classification",
      !classification.category && "Category",
      !classification.subCategory.trim() && "Sub Category",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    if (!details.trim() || !spoc || !functionalHead) {
      toast.error("Please fill: Incident details, SPOC and Functional Head");
      return false;
    }
    if (injuryHappened) {
      const invalid = injuries.findIndex((i) => !i.natureOfInjury || !i.bodyPart);
      if (invalid !== -1) {
        toast.error(`Please complete injury ${invalid + 1}: Nature of Injury and Body Part Affected`);
        return false;
      }
    }
    return true;
  };

  const handleBack = () => (step === 2 ? setStep(1) : navigate(INCIDENT_REPORTER_PATH));

  const handleSaveDraft = () => {
    toast.success("Incident saved to draft");
    navigate(INCIDENT_REPORTER_PATH);
  };

  const handleSubmit = () => {
    if (!validateStepOne() || !validateStepTwo()) return;
    toast.success("Incident submitted successfully");
    navigate(INCIDENT_REPORTER_PATH);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident</h1>
      </div>

      {/* Stepper: 1 of 2 steps */}
      <div className="mb-6 max-w-md">
        <p className="mb-2 text-xs text-[rgba(26,26,24,0.48)]">{step} of 2 steps</p>
        <div className="flex items-center">
          {[1, 2].map((n) => (
            <div key={n} className={`flex items-center ${n === 1 ? "flex-1" : ""}`}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  n <= step
                    ? "border-[1.5px] border-[#1A1A18] bg-[#F1EEE7] text-[#1A1A18]"
                    : "border border-[rgba(26,26,24,0.12)] bg-white text-[rgba(26,26,24,0.48)]"
                }`}
              >
                {n}
              </span>
              {n === 1 && (
                <span className={`mx-2 h-px flex-1 ${step === 2 ? "bg-[#1A1A18]" : "bg-[rgba(26,26,24,0.12)]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <DetailCard icon={sectionIcon(User)} title="Reporter Details" className="mb-5">
            <div className="space-y-2">
              <InfoRow label="Name" value={loggedInUser.name} />
              <InfoRow label="Mail ID" value={loggedInUser.email} />
              <InfoRow label="Employer" value={loggedInUser.designation} />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
              <TextField
                fullWidth
                type="date"
                label={requiredLabel("Current Date")}
                value={reportedOn.date}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="time"
                label={requiredLabel("Current Time")}
                value={reportedOn.time}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: true }}
              />
              <span className="hidden lg:block" />
              <TextField
                fullWidth
                type="date"
                label={requiredLabel("Date of Incident")}
                value={basic.dateOfIncident}
                onChange={(e) => setBasic((p) => ({ ...p, dateOfIncident: e.target.value }))}
                inputProps={{ max: todayIso() }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                type="time"
                label={requiredLabel("Time of Incident")}
                value={basic.timeOfIncident}
                onChange={(e) => setBasic((p) => ({ ...p, timeOfIncident: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <SelectField
                label="Circle"
                required
                value={basic.circle}
                onChange={(v) => setBasic((p) => ({ ...p, circle: v }))}
                options={masters.clusters}
                loading={mastersLoading}
                placeholder="Select incident circle"
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
              <SelectField
                label="Type of Facility"
                required
                value={basic.facilityType}
                onChange={(v) => setBasic((p) => ({ ...p, facilityType: v }))}
                options={masters.visitBusinessAreas}
                loading={mastersLoading}
                placeholder="Select type of facility"
              />
              <TextField
                fullWidth
                label={requiredLabel("Location")}
                placeholder="Enter incident location"
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
                placeholder="Select incident function"
              />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(ClipboardList)} title="Incident Classification" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SelectField
                label="Classification"
                required
                value={classification.classification}
                onChange={(v) => setClassification((p) => ({ ...p, classification: v }))}
                options={masters.classifications}
                loading={mastersLoading}
                placeholder="Select incident classification"
              />
              <SelectField
                label="Category"
                required
                value={classification.category}
                onChange={(v) => setClassification((p) => ({ ...p, category: v }))}
                options={masters.categories}
                loading={mastersLoading}
                placeholder="Select incident category"
              />
              <TextField
                fullWidth
                label={requiredLabel("Sub Category")}
                placeholder="Enter incident sub category"
                value={classification.subCategory}
                onChange={(e) => setClassification((p) => ({ ...p, subCategory: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </DetailCard>

          <div className="fm-action-bar pt-4 sm:pt-6">
            <button type="button" className="fm-action-secondary" onClick={handleSaveDraft}>
              Save draft
            </button>
            <button
              type="button"
              className="fm-action-primary"
              onClick={() => validateStepOne() && setStep(2)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <DetailCard icon={sectionIcon(ClipboardList)} title="Incident Details" className="mb-5">
            <div className="space-y-5">
              <TextField
                fullWidth
                multiline
                minRows={4}
                label={requiredLabel("Incident")}
                placeholder="Enter incident details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <div>
                <label className="fm-action-secondary inline-flex cursor-pointer">
                  <Paperclip className="w-4 h-4" />
                  Upload Attachments
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
                      setAttachments((prev) => [...prev, ...files.filter(isAllowedAttachment)]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {attachments.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {attachments.map((file, i) => (
                      <span
                        key={`${file.name}-${i}`}
                        className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18]"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(HeartPulse)} title="Any Injury Happened?" className="mb-5">
            <div className="mb-4 flex items-center justify-end gap-2 text-sm text-[rgba(26,26,24,0.68)]">
              {injuryHappened ? "Yes" : "No"}
              <Switch checked={injuryHappened} onChange={(e) => setInjuryHappened(e.target.checked)} />
            </div>
            {injuryHappened && (
              <div className="space-y-6">
                {injuries.map((entry, index) => (
                  <div key={index} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
                    {injuries.length > 1 && (
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#1A1A18]">Injury {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => setInjuries((prev) => prev.filter((_, i) => i !== index))}
                          className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                          aria-label={`Remove injury ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      <TextField
                        fullWidth
                        type="number"
                        label="Impacted Person Age"
                        placeholder="Enter age"
                        value={entry.age}
                        onChange={(e) => updateInjury(index, { age: e.target.value })}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <SelectField
                        label="Nature of Person Impacted"
                        value={entry.personType}
                        onChange={(v) => updateInjury(index, { personType: v })}
                        options={PERSON_IMPACTED_OPTIONS}
                        placeholder="Select person type"
                      />
                      <TextField
                        fullWidth
                        label="Vendor"
                        placeholder="Enter vendor name"
                        value={entry.vendor}
                        onChange={(e) => updateInjury(index, { vendor: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        fullWidth
                        label="Sub Vendor"
                        placeholder="Enter sub vendor name"
                        value={entry.subVendor}
                        onChange={(e) => updateInjury(index, { subVendor: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                      <SelectField
                        label="Nature of Injury"
                        required
                        value={entry.natureOfInjury}
                        onChange={(v) => updateInjury(index, { natureOfInjury: v })}
                        options={INJURY_TYPE_OPTIONS}
                        placeholder="Select injury type"
                      />
                      <SelectField
                        label="Body Part Affected"
                        required
                        value={entry.bodyPart}
                        onChange={(v) => updateInjury(index, { bodyPart: v })}
                        options={BODY_PART_OPTIONS}
                        placeholder="Select body part"
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Days Away from Work"
                        placeholder="Number of days away from work"
                        value={entry.daysAwayFromWork}
                        onChange={(e) => updateInjury(index, { daysAwayFromWork: e.target.value })}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label="Restricted Work Days"
                        placeholder="Enter number of days"
                        value={entry.restrictedWorkDays}
                        onChange={(e) => updateInjury(index, { restrictedWorkDays: e.target.value })}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <AddMoreButton label="Add more" onClick={() => setInjuries((prev) => [...prev, { ...EMPTY_INJURY }])} />
                </div>
              </div>
            )}
          </DetailCard>

          <div className="fm-action-bar pt-4 sm:pt-6">
            <button type="button" className="fm-action-secondary" onClick={handleSaveDraft}>
              Save draft
            </button>
            <button type="button" className="fm-action-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentReporterAddPage;
