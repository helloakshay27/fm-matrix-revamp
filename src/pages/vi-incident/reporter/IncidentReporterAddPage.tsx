import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, FileText, HeartPulse, Trash2, User } from "lucide-react";
import { Switch, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { AuditLoadingState, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import {
  AddMoreButton,
  InfoRow,
  getLoggedInUser,
  requiredLabel,
  toId,
} from "@/components/vi-audit/AuditFormFields";
import { AttachmentPicker, IncidentSelectField, fileToDataUrl } from "@/components/vi-incident/IncidentFormFields";
import {
  errorToast,
  isOthersOption,
  saveViIncident,
  useViIncidentDetail,
  useViIncidentMasters,
} from "@/components/vi-incident/viIncidentApi";
import { todayIso, type ViIncidentAttachment } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_REPORTER_PATH } from "./IncidentReporterListPage";

interface InjuryEntry {
  /** Server id of a saved injury (empty for a new one). */
  id: string;
  name: string;
  age: string;
  personTypeId: string;
  natureOfInjuryId: string;
  bodyPartId: string;
  vendor: string;
  subVendor: string;
}

const EMPTY_INJURY: InjuryEntry = {
  id: "",
  name: "",
  age: "",
  personTypeId: "",
  natureOfInjuryId: "",
  bodyPartId: "",
  vendor: "",
  subVendor: "",
};

const isBlankInjury = (i: InjuryEntry) =>
  !i.id && ![i.name, i.age, i.personTypeId, i.natureOfInjuryId, i.bodyPartId, i.vendor, i.subVendor].some((v) => v.trim());

const nowTime = () => new Date().toTimeString().slice(0, 5);
const orNull = (value: string) => value.trim() || null;

// Reporter: create (POST /vi_incidents.json) or edit a draft (PATCH /vi_incidents/:id.json) —
// step 1 (reporter, basic, classification), step 2 (incident, injury). Save draft keeps it as a
// draft; Submit sends `submit: true`, which the API validates.
const IncidentReporterAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViIncidentMasters();
  const { incident, loading: incidentLoading } = useViIncidentDetail(id);
  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);

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
  const [otherValues, setOtherValues] = useState({ classification: "", category: "", subCategory: "", facilityType: "" });
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [savedAttachments, setSavedAttachments] = useState<ViIncidentAttachment[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);
  const [spoc, setSpoc] = useState<ViActiveUserOption | null>(null);
  const [functionalHead, setFunctionalHead] = useState<ViActiveUserOption | null>(null);
  const [injuryHappened, setInjuryHappened] = useState(false);
  const [injuries, setInjuries] = useState<InjuryEntry[]>([{ ...EMPTY_INJURY }]);
  const [savedInjuryIds, setSavedInjuryIds] = useState<string[]>([]);

  // Editing a draft: fill the form once the incident has loaded.
  const prefilled = useRef(false);
  useEffect(() => {
    if (!incident || prefilled.current) return;
    prefilled.current = true;
    setBasic({
      dateOfIncident: incident.incidentDateIso,
      timeOfIncident: incident.incidentTime24,
      circle: incident.ids.circle,
      personnelArea: incident.ids.personnelArea,
      workLocation: incident.ids.workLocation,
      facilityType: incident.ids.facilityType,
      location: incident.incidentLocation,
      function: incident.ids.function,
    });
    setClassification({
      classification: incident.ids.classification,
      category: incident.ids.category,
      subCategory: incident.ids.subCategory,
    });
    setOtherValues(incident.otherValues);
    setDetails(incident.incident);
    setSavedAttachments(incident.attachments);
    setSpoc(incident.spocUser);
    setFunctionalHead(incident.functionalHeadUser);
    setInjuryHappened(incident.injuryHappened);
    if (incident.injuries.length) {
      setInjuries(
        incident.injuries.map((i) => ({
          id: i.id,
          name: i.name,
          age: i.age,
          personTypeId: i.personTypeId,
          natureOfInjuryId: i.natureOfInjuryId,
          bodyPartId: i.bodyPartId,
          vendor: i.vendor,
          subVendor: i.subVendor,
        })),
      );
    }
    setSavedInjuryIds(incident.injuries.map((i) => i.id).filter(Boolean));
  }, [incident]);

  // Choosing the "Others" master asks for the value in a text field.
  const others = {
    classification: isOthersOption(masters.classifications, classification.classification),
    category: isOthersOption(masters.categories, classification.category),
    subCategory: isOthersOption(masters.subCategories, classification.subCategory),
    facilityType: isOthersOption(masters.facilityTypes, basic.facilityType),
  };

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
      others.facilityType && !otherValues.facilityType.trim() && "Other Type of Facility",
      !basic.location.trim() && "Location",
      !basic.function && "Function",
      !classification.classification && "Classification",
      others.classification && !otherValues.classification.trim() && "Other Classification",
      !classification.category && "Category",
      others.category && !otherValues.category.trim() && "Other Category",
      !classification.subCategory && "Sub Category",
      others.subCategory && !otherValues.subCategory.trim() && "Other Sub Category",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    if (new Date(`${basic.dateOfIncident}T${basic.timeOfIncident}`) > new Date()) {
      toast.error("Date and time of incident cannot be in the future");
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
      const invalid = injuries.findIndex(
        (i) => !i.name.trim() || !i.age || !i.personTypeId || !i.natureOfInjuryId || !i.bodyPartId,
      );
      if (invalid !== -1) {
        toast.error(
          `Please complete injury ${invalid + 1}: Impacted Person, Age, Nature of Person Impacted, Nature of Injury and Body Part Affected`,
        );
        return false;
      }
    }
    return true;
  };

  const buildIncident = async () => {
    const kept = injuryHappened ? injuries.filter((i) => !isBlankInjury(i)) : [];
    const keptIds = new Set(kept.map((i) => i.id).filter(Boolean));
    return {
      incident_date: basic.dateOfIncident || null,
      incident_time: basic.timeOfIncident || null,
      circle_id: toId(basic.circle),
      personal_area_id: toId(basic.personnelArea),
      work_location_id: toId(basic.workLocation),
      location: basic.location.trim(),
      department_id: toId(basic.function),
      facility_type_id: toId(basic.facilityType),
      classification_id: toId(classification.classification),
      category_id: toId(classification.category),
      sub_category_id: toId(classification.subCategory),
      facility_type_other_value: others.facilityType ? orNull(otherValues.facilityType) : null,
      classification_other_value: others.classification ? orNull(otherValues.classification) : null,
      category_other_value: others.category ? orNull(otherValues.category) : null,
      sub_category_other_value: others.subCategory ? orNull(otherValues.subCategory) : null,
      incident_details: details.trim(),
      injury_happened: injuryHappened,
      spoc_id: toId(spoc?.id),
      functional_head_id: toId(functionalHead?.id),
      injuries_attributes: [
        ...kept.map((i) => ({
          ...(i.id ? { id: toId(i.id) } : {}),
          impacted_person_name: i.name.trim(),
          impacted_person_age: i.age,
          injured_person_type_id: toId(i.personTypeId),
          nature_of_injury_id: toId(i.natureOfInjuryId),
          body_part_id: toId(i.bodyPartId),
          vendor: i.vendor.trim(),
          sub_vendor: i.subVendor.trim(),
        })),
        // Saved injuries the reporter removed (or all of them once "no injury" is chosen).
        ...savedInjuryIds.filter((injuryId) => !keptIds.has(injuryId)).map((injuryId) => ({ id: toId(injuryId), _destroy: true })),
      ],
      attachments: await Promise.all(attachments.map(fileToDataUrl)),
      remove_attachment_ids: removedAttachmentIds.map(toId),
    };
  };

  const save = async (submit: boolean) => {
    if (saving) return;
    if (submit && (!validateStepOne() || !validateStepTwo())) return;
    setSaving(true);
    try {
      await saveViIncident(id, await buildIncident(), submit);
      toast.success(submit ? "Incident submitted successfully" : "Incident saved to draft");
      navigate(INCIDENT_REPORTER_PATH);
    } catch (error) {
      errorToast(submit ? "Failed to submit incident" : "Failed to save draft", error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => (step === 2 ? setStep(1) : navigate(INCIDENT_REPORTER_PATH));

  if (editing && incidentLoading) return <AuditLoadingState message="Loading incident..." />;
  if (editing && !incident) {
    return <AuditLoadingState message="Incident not found." onBack={() => navigate(INCIDENT_REPORTER_PATH)} />;
  }
  if (editing && incident && !incident.canEdit) {
    return (
      <AuditLoadingState
        message="This incident has been submitted and can no longer be edited."
        onBack={() => navigate(`${INCIDENT_REPORTER_PATH}/${id}`)}
      />
    );
  }

  const actionBar = (primary: { label: string; onClick: () => void }) => (
    <div className="fm-action-bar pt-4 sm:pt-6">
      <button type="button" className="fm-action-secondary" onClick={() => save(false)} disabled={saving}>
        Save draft
      </button>
      <button type="button" className="fm-action-primary" onClick={primary.onClick} disabled={saving}>
        {primary.label}
      </button>
    </div>
  );

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
        <h1 className="text-xl font-semibold text-[#1A1A18]">Incident{incident ? ` — ${incident.incidentNo}` : ""}</h1>
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
              <InfoRow label="Name" value={incident?.reporter.name || loggedInUser.name} />
              <InfoRow label="Mail ID" value={incident?.reporter.mailId || loggedInUser.email} />
              <InfoRow label="Employer" value={incident?.reporter.employer || loggedInUser.designation} />
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
              <IncidentSelectField
                label="Circle"
                required
                value={basic.circle}
                onChange={(v) => setBasic((p) => ({ ...p, circle: v }))}
                options={masters.circles}
                loading={mastersLoading}
                placeholder="Select incident circle"
              />
              <IncidentSelectField
                label="Personnel Area"
                required
                value={basic.personnelArea}
                onChange={(v) => setBasic((p) => ({ ...p, personnelArea: v }))}
                options={masters.personalAreas}
                loading={mastersLoading}
                placeholder="Select personnel area"
              />
              <IncidentSelectField
                label="Work Location"
                required
                value={basic.workLocation}
                onChange={(v) => setBasic((p) => ({ ...p, workLocation: v }))}
                options={masters.workLocations}
                loading={mastersLoading}
                placeholder="Select work location"
              />
              <IncidentSelectField
                label="Type of Facility"
                required
                value={basic.facilityType}
                onChange={(v) => setBasic((p) => ({ ...p, facilityType: v }))}
                options={masters.facilityTypes}
                loading={mastersLoading}
                placeholder="Select type of facility"
              />
              {others.facilityType && (
                <TextField
                  fullWidth
                  label={requiredLabel("Other Type of Facility")}
                  placeholder="Enter type of facility"
                  value={otherValues.facilityType}
                  onChange={(e) => setOtherValues((p) => ({ ...p, facilityType: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              <TextField
                fullWidth
                label={requiredLabel("Location")}
                placeholder="Enter incident location"
                value={basic.location}
                onChange={(e) => setBasic((p) => ({ ...p, location: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <IncidentSelectField
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
              <IncidentSelectField
                label="Classification"
                required
                value={classification.classification}
                onChange={(v) => setClassification((p) => ({ ...p, classification: v }))}
                options={masters.classifications}
                loading={mastersLoading}
                placeholder="Select incident classification"
              />
              <IncidentSelectField
                label="Category"
                required
                value={classification.category}
                onChange={(v) => setClassification((p) => ({ ...p, category: v }))}
                options={masters.categories}
                loading={mastersLoading}
                placeholder="Select incident category"
              />
              <IncidentSelectField
                label="Sub Category"
                required
                value={classification.subCategory}
                onChange={(v) => setClassification((p) => ({ ...p, subCategory: v }))}
                options={masters.subCategories}
                loading={mastersLoading}
                placeholder="Select incident sub category"
              />
              {others.classification && (
                <TextField
                  fullWidth
                  label={requiredLabel("Other Classification")}
                  placeholder="Enter classification"
                  value={otherValues.classification}
                  onChange={(e) => setOtherValues((p) => ({ ...p, classification: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              {others.category && (
                <TextField
                  fullWidth
                  label={requiredLabel("Other Category")}
                  placeholder="Enter category"
                  value={otherValues.category}
                  onChange={(e) => setOtherValues((p) => ({ ...p, category: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              {others.subCategory && (
                <TextField
                  fullWidth
                  label={requiredLabel("Other Sub Category")}
                  placeholder="Enter sub category"
                  value={otherValues.subCategory}
                  onChange={(e) => setOtherValues((p) => ({ ...p, subCategory: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </div>
          </DetailCard>

          {actionBar({ label: "Next", onClick: () => validateStepOne() && setStep(2) })}
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
              <AttachmentPicker
                files={attachments}
                onFilesChange={setAttachments}
                existing={savedAttachments}
                onRemoveExisting={(attachment) => {
                  setSavedAttachments((prev) => prev.filter((a) => a !== attachment));
                  if (attachment.id) setRemovedAttachmentIds((prev) => [...prev, attachment.id]);
                }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <UserSelectField
                  label="SPOC"
                  required
                  value={spoc}
                  onChange={setSpoc}
                  employeeType="internal"
                  // All internal users listed on open, with the reporter (who may assign themselves) on top.
                  preload
                  includeCurrentUser
                  placeholder="Search SPOC by email or mobile"
                />
                <UserSelectField
                  label="Functional Head"
                  required
                  value={functionalHead}
                  onChange={setFunctionalHead}
                  employeeType="internal"
                  preload
                  includeCurrentUser
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
                  <div key={entry.id || index} className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
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
                        label={requiredLabel("Impacted Person Name")}
                        placeholder="Enter name"
                        value={entry.name}
                        onChange={(e) => updateInjury(index, { name: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        fullWidth
                        type="number"
                        label={requiredLabel("Impacted Person Age")}
                        placeholder="Enter age"
                        value={entry.age}
                        onChange={(e) => updateInjury(index, { age: e.target.value })}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <IncidentSelectField
                        label="Nature of Person Impacted"
                        required
                        value={entry.personTypeId}
                        onChange={(v) => updateInjury(index, { personTypeId: v })}
                        options={masters.injuredPersonTypes}
                        loading={mastersLoading}
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
                      <IncidentSelectField
                        label="Nature of Injury"
                        required
                        value={entry.natureOfInjuryId}
                        onChange={(v) => updateInjury(index, { natureOfInjuryId: v })}
                        options={masters.naturesOfInjury}
                        loading={mastersLoading}
                        placeholder="Select injury type"
                      />
                      <IncidentSelectField
                        label="Body Part Affected"
                        required
                        value={entry.bodyPartId}
                        onChange={(v) => updateInjury(index, { bodyPartId: v })}
                        options={masters.bodyParts}
                        loading={mastersLoading}
                        placeholder="Select body part"
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

          {actionBar({ label: "Submit", onClick: () => save(true) })}
        </>
      )}
    </div>
  );
};

export default IncidentReporterAddPage;
