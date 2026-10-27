import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ClipboardCheck,
  FileText,
  User,
  UserPlus,
} from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import {
  AutocompleteLabel,
  UserSelectField,
} from "@/components/vi-audit/ViUserPicker";
import { auditFieldSx, AuditLoadingState, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import {
  InfoRow,
  getLoggedInUser,
  requiredLabel,
} from "@/components/vi-audit/AuditFormFields";
import {
  AttachmentPicker,
  IncidentSelectField,
} from "@/components/vi-incident/IncidentFormFields";
import { useInspectionTypeOptions } from "@/features/vi-inspection/master/api/queries";
import {
  errorToast,
  saveViInspection,
  useViInspectionChecklistQuestions,
  useViInspectionDetail,
  useViInspectionMasters,
  useViInspectionNearbySites,
  type InspectionFormInput,
} from "@/components/vi-inspection/viInspectionApi";
import {
  CHECKLIST_ANSWERS,
  INSPECTION_PATHS,
  todayIso,
  type ViInspectionAttachment,
} from "@/components/vi-inspection/viInspectionData";

const INSPECTOR_PATH = INSPECTION_PATHS.inspector;

// The inspector's current position (browser geolocation) — the nearby-sites lookup needs it.
type GeoStatus = "idle" | "locating" | "ready" | "denied" | "policy" | "error";

// The site can switch geolocation off for every page with a Permissions-Policy header
// (geolocation=()); the browser then rejects without prompting and no retry can help.
const geolocationAllowedBySite = () => {
  const doc = document as Document & {
    permissionsPolicy?: { allowsFeature: (feature: string) => boolean };
    featurePolicy?: { allowsFeature: (feature: string) => boolean };
  };
  const policy = doc.permissionsPolicy ?? doc.featurePolicy;
  return policy ? policy.allowsFeature("geolocation") : true;
};
interface GeoState {
  status: GeoStatus;
  coords: { latitude: number; longitude: number } | null;
}
const TOTAL_STEPS = 3;

interface AnswerDraft {
  answer: string;
  remark: string;
  files: File[];
  existing: ViInspectionAttachment[];
  removeAttachmentIds: string[];
}

const emptyAnswer = (): AnswerDraft => ({
  answer: "",
  remark: "",
  files: [],
  existing: [],
  removeAttachmentIds: [],
});
const hasContent = (a: AnswerDraft) =>
  Boolean(
    a.answer ||
      a.remark.trim() ||
      a.files.length ||
      a.existing.length ||
      a.removeAttachmentIds.length
  );

interface BasicDraft {
  inspection_date: string;
  circle_id: string;
  personal_area_id: string;
  work_location_id: string;
  inspection_type_id: string;
  inspector_location: string;
  inspection_site_id: string;
  department_id: string;
  facility_type_id: string;
}

const EMPTY_BASIC: BasicDraft = {
  inspection_date: todayIso(),
  circle_id: "",
  personal_area_id: "",
  work_location_id: "",
  inspection_type_id: "",
  inspector_location: "",
  inspection_site_id: "",
  department_id: "",
  facility_type_id: "",
};

// Inspector: create / edit an inspection — step 1 (inspector + basic details), step 2 (checklist
// answers, remarks, attachments), step 3 (SPOC, Functional Head, target date).
// Save draft: POST /vi_inspections.json or PATCH /vi_inspections/:id.json. Submit additionally submits
// (draft → open); after that the inspection is read-only for the Inspector.
const InspectionInspectorAddPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViInspectionMasters();
  // Inspection types come from their own API (GET /vi_inspection_type_masters.json), which carries
  // lat_long_required — it decides whether the Inspection Location field is shown.
  const { data: inspectionTypes = [], isLoading: inspectionTypesLoading } =
    useInspectionTypeOptions();
  const { inspection, loading: inspectionLoading } = useViInspectionDetail(id);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [basic, setBasicState] = useState<BasicDraft>(EMPTY_BASIC);
  const [answers, setAnswers] = useState<Record<string, AnswerDraft>>({});
  const [spoc, setSpoc] = useState<ViActiveUserOption | null>(null);
  const [functionalHead, setFunctionalHead] =
    useState<ViActiveUserOption | null>(null);
  const [targetDate, setTargetDate] = useState("");

  const { questions, loading: questionsLoading } =
    useViInspectionChecklistQuestions(basic.inspection_type_id);

  // Continue from the saved draft.
  const prefilled = useRef(false);
  useEffect(() => {
    if (!inspection || prefilled.current) return;
    prefilled.current = true;
    setBasicState({
      inspection_date: inspection.inspectionDate || todayIso(),
      circle_id: inspection.circleId,
      personal_area_id: inspection.personalAreaId,
      work_location_id: inspection.workLocationId,
      inspection_type_id: inspection.inspectionTypeId,
      inspector_location: inspection.inspectorLocation,
      inspection_site_id: inspection.inspectionSiteId,
      department_id: inspection.departmentId,
      facility_type_id: inspection.facilityTypeId,
    });
    setAnswers(
      Object.fromEntries(
        inspection.checklistResponses.map((r) => [
          r.questionId,
          {
            answer: r.answer,
            remark: r.remark,
            files: [],
            existing: r.attachments,
            removeAttachmentIds: [],
          },
        ])
      )
    );
    setSpoc(inspection.spoc);
    setFunctionalHead(inspection.functionalHead);
    setTargetDate(inspection.targetDate);
  }, [inspection]);

  // Active types only — plus the draft's own type, so an edit still shows it if it was deactivated.
  const inspectionTypeOptions = useMemo(
    () =>
      inspectionTypes
        .filter(
          (type) => type.active || String(type.id) === basic.inspection_type_id
        )
        .map((type) => ({ value: String(type.id), label: type.name })),
    [inspectionTypes, basic.inspection_type_id]
  );
  const latLongRequired = Boolean(
    inspectionTypes.find((type) => String(type.id) === basic.inspection_type_id)
      ?.lat_long_required
  );

  // Current location (sent with every inspection); lat/long types also list the sites within 2 km of it.
  const [geo, setGeo] = useState<GeoState>({ status: "idle", coords: null });
  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo({ status: "error", coords: null });
      return;
    }
    if (!geolocationAllowedBySite()) {
      setGeo({ status: "policy", coords: null });
      return;
    }
    setGeo((prev) => ({ status: "locating", coords: prev.coords }));
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setGeo({
          status: "ready",
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        }),
      (error) =>
        setGeo({ status: error.code === error.PERMISSION_DENIED ? "denied" : "error", coords: null }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);
  useEffect(() => {
    if (geo.status === "idle") locate();
  }, [geo.status, locate]);
  const { sites: nearbySites, loading: nearbyLoading } = useViInspectionNearbySites(
    latLongRequired ? basic.inspection_type_id : "",
    geo.coords
  );
  // A draft's saved site stays selectable even if it's no longer within 2 km.
  const siteOptions = useMemo(() => {
    const savedId = inspection?.inspectionSiteId;
    if (
      savedId &&
      basic.inspection_site_id === savedId &&
      !nearbySites.some((site) => site.value === savedId)
    ) {
      const name = inspection.inspectionSite || inspection.inspectorLocation;
      return [...nearbySites, { value: savedId, name, label: name }];
    }
    return nearbySites;
  }, [nearbySites, inspection, basic.inspection_site_id]);
  const siteHint =
    geo.status === "locating"
      ? "Getting your current location..."
      : geo.status === "denied"
        ? "Location access is blocked. Allow location for this site in your browser (address bar → site settings → Location), then retry."
        : geo.status === "policy"
          ? "Location is turned off for this site by its security policy (Permissions-Policy: geolocation). Please contact the admin."
        : geo.status === "error"
          ? "Couldn't get your current location."
          : geo.status === "ready" && !nearbyLoading && nearbySites.length === 0
            ? "No sites found within 2 km of your current location."
            : geo.status === "ready"
              ? "Sites within 2 km of your current location, nearest first."
              : "";

  const setBasic = (patch: Partial<BasicDraft>) =>
    setBasicState((prev) => ({ ...prev, ...patch }));
  const answerFor = (questionId: string) =>
    answers[questionId] ?? emptyAnswer();
  const updateAnswer = (questionId: string, patch: Partial<AnswerDraft>) =>
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...(prev[questionId] ?? emptyAnswer()), ...patch },
    }));

  // Answers belong to a type: changing it drops them (the API does the same on save).
  const changeInspectionType = (typeId: string) => {
    if (typeId === basic.inspection_type_id) return;
    if (Object.values(answers).some(hasContent))
      toast.info("Checklist answers were cleared for the new inspection type");
    setAnswers({});
    // Sites belong to a type too.
    setBasic({ inspection_type_id: typeId, inspection_site_id: "", inspector_location: "" });
  };

  const changeSite = (siteId: string) => {
    const site = siteOptions.find((option) => option.value === siteId);
    setBasic({ inspection_site_id: siteId, inspector_location: site?.name ?? "" });
  };

  const validateStepOne = () => {
    const missing = [
      !basic.inspection_date && "Date of Inspection",
      !basic.circle_id && "Circle",
      !basic.personal_area_id && "Personnel Area",
      !basic.work_location_id && "Work Location",
      !basic.inspection_type_id && "Inspection Type",
      latLongRequired && !basic.inspection_site_id && "Inspection Location",
      latLongRequired && !geo.coords && "Current location (allow location access)",
      !basic.department_id && "Function",
      !basic.facility_type_id && "Type of Facility",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    if (questionsLoading) {
      toast.error("Checklist questions are still loading");
      return false;
    }
    if (!questions.length) {
      toast.error(
        "The selected inspection type has no active checklist questions"
      );
      return false;
    }
    const unanswered = questions.findIndex((q) => !answerFor(q.id).answer);
    if (unanswered !== -1) {
      toast.error(`Please answer checklist question ${unanswered + 1}`);
      return false;
    }
    return true;
  };

  const validateStepThree = () => {
    const missing = [
      !spoc && "SPOC",
      !functionalHead && "Functional Head",
      !targetDate && "Target Date",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    if (targetDate < basic.inspection_date) {
      toast.error("Target Date can't be before the Date of Inspection");
      return false;
    }
    return true;
  };

  const buildInput = (): InspectionFormInput => ({
    ...basic,
    // Only types with lat_long_required ask for it; otherwise it's cleared.
    inspector_location: latLongRequired ? basic.inspector_location.trim() : "",
    latitude: geo.coords ? String(geo.coords.latitude) : "",
    longitude: geo.coords ? String(geo.coords.longitude) : "",
    inspection_site_id: latLongRequired ? basic.inspection_site_id : "",
    spoc_id: spoc?.id ?? "",
    functional_head_id: functionalHead?.id ?? "",
    target_date: targetDate,
    // Only this type's questions; a draft sends just the rows that have something in them.
    responses: questions
      .filter((q) => hasContent(answerFor(q.id)))
      .map((q) => {
        const a = answerFor(q.id);
        return {
          questionId: q.id,
          answer: a.answer,
          remark: a.remark.trim(),
          files: a.files,
          removeAttachmentIds: a.removeAttachmentIds,
        };
      }),
  });

  const save = async (submit: boolean) => {
    if (saving) return;
    if (
      submit &&
      (!validateStepOne() || !validateStepTwo() || !validateStepThree())
    )
      return;
    setSaving(true);
    try {
      await saveViInspection(id, buildInput(), submit);
      toast.success(
        submit
          ? "Inspection submitted successfully"
          : "Inspection saved to draft"
      );
      navigate(INSPECTOR_PATH);
    } catch (error) {
      errorToast(
        submit ? "Failed to submit inspection" : "Failed to save draft",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () =>
    step > 1 ? setStep(step - 1) : navigate(INSPECTOR_PATH);
  const handleNext = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;
    setStep(step + 1);
  };

  if (isEdit && inspectionLoading && !inspection) {
    return (
      <AuditLoadingState
        message="Loading inspection..."
        onBack={() => navigate(INSPECTOR_PATH)}
      />
    );
  }
  if (isEdit && inspection && !inspection.canEdit) {
    return (
      <AuditLoadingState
        message="This inspection has been submitted and can no longer be edited."
        onBack={() => navigate(INSPECTOR_PATH)}
      />
    );
  }

  return (
    <fieldset disabled={saving} className="p-4 sm:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
          {isEdit
            ? `Edit Inspection${inspection ? ` — ${inspection.inspectionNo}` : ""}`
            : "Inspection"}
        </h1>
      </div>

      {/* Stepper: n of 3 steps — completed steps show a check */}
      <div className="mb-6 max-w-md">
        <p className="mb-2 text-xs text-gray-500">
          {step} of {TOTAL_STEPS} steps
        </p>
        <div className="flex items-center">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`flex items-center ${n < TOTAL_STEPS ? "flex-1" : ""}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  n <= step
                    ? "border-[1.5px] border-gray-900 bg-[#EDEAE3] text-gray-900"
                    : "border border-gray-200 bg-white text-gray-500"
                }`}
              >
                {n < step ? <Check className="w-4 h-4" /> : n}
              </span>
              {n < TOTAL_STEPS && (
                <span
                  className={`mx-2 h-px flex-1 ${n < step ? "bg-gray-900" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <DetailCard
            icon={sectionIcon(User)}
            title="Inspector Details"
            className="mb-5"
          >
            <div className="space-y-2">
              <InfoRow
                label="Name"
                value={inspection?.inspector?.name || loggedInUser.name}
              />
              <InfoRow
                label="Mail ID"
                value={inspection?.inspector?.email || loggedInUser.email}
              />
              <InfoRow
                label="Designation"
                value={
                  inspection?.inspector?.designation || loggedInUser.designation
                }
              />
            </div>
          </DetailCard>

          <DetailCard
            icon={sectionIcon(FileText)}
            title="Basic Details"
            className="mb-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
              <TextField
                sx={auditFieldSx}
                fullWidth
                type="date"
                label={requiredLabel("Date of Inspection")}
                value={basic.inspection_date}
                onChange={(e) => setBasic({ inspection_date: e.target.value })}
                inputProps={{ max: todayIso() }}
                InputLabelProps={{ shrink: true }}
              />
              <IncidentSelectField
                label="Circle"
                required
                value={basic.circle_id}
                onChange={(v) => setBasic({ circle_id: v })}
                options={masters.circles}
                loading={mastersLoading}
                placeholder="Select circle"
              />
              <IncidentSelectField
                label="Personnel Area"
                required
                value={basic.personal_area_id}
                onChange={(v) => setBasic({ personal_area_id: v })}
                options={masters.personalAreas}
                loading={mastersLoading}
                placeholder="Select personnel area"
              />
              <IncidentSelectField
                label="Work Location"
                required
                value={basic.work_location_id}
                onChange={(v) => setBasic({ work_location_id: v })}
                options={masters.workLocations}
                loading={mastersLoading}
                placeholder="Select work location"
              />
              <IncidentSelectField
                label="Inspection Type"
                required
                value={basic.inspection_type_id}
                onChange={changeInspectionType}
                options={inspectionTypeOptions}
                loading={inspectionTypesLoading}
                placeholder="Select inspection type"
              />
              {latLongRequired && (
                <div>
                  <IncidentSelectField
                    label="Inspection Location"
                    required
                    value={basic.inspection_site_id}
                    onChange={changeSite}
                    options={siteOptions}
                    loading={geo.status === "locating" || nearbyLoading}
                    disabled={!geo.coords && siteOptions.length === 0}
                    placeholder="Select inspector location"
                  />
                  {siteHint && (
                    <p className="mt-1 text-xs text-gray-500">
                      {siteHint}
                      {(geo.status === "denied" || geo.status === "error") && (
                        <button
                          type="button"
                          onClick={locate}
                          className="ml-1 font-semibold text-brand underline underline-offset-2"
                        >
                          Retry
                        </button>
                      )}
                    </p>
                  )}
                </div>
              )}
              <IncidentSelectField
                label="Function"
                required
                value={basic.department_id}
                onChange={(v) => setBasic({ department_id: v })}
                options={masters.departments}
                loading={mastersLoading}
                placeholder="Select function"
              />
              <IncidentSelectField
                label="Type of Facility"
                required
                value={basic.facility_type_id}
                onChange={(v) => setBasic({ facility_type_id: v })}
                options={masters.facilityTypes}
                loading={mastersLoading}
                placeholder="Select type of facility"
              />
            </div>
          </DetailCard>
        </>
      )}

      {step === 2 && (
        <DetailCard
          icon={sectionIcon(ClipboardCheck)}
          title="Checklists"
          className="mb-5"
        >
          {questionsLoading ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Loading checklist questions...
            </p>
          ) : !basic.inspection_type_id ? (
            <p className="py-6 text-center text-sm text-gray-500">
              Select an inspection type in step 1.
            </p>
          ) : !questions.length ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No active checklist questions for this inspection type.
            </p>
          ) : (
            <div className="space-y-6">
              {questions.map((q, index) => {
                const entry = answerFor(q.id);
                return (
                  <div
                    key={q.id}
                    className={
                      index > 0
                        ? "border-t border-gray-200 pt-6"
                        : ""
                    }
                  >
                    <p className="mb-3 text-sm font-medium text-gray-900">
                      {index + 1}. {requiredLabel(q.question)}
                    </p>
                    <div className="mb-3 flex flex-wrap gap-6">
                      {CHECKLIST_ANSWERS.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-2 text-sm text-gray-900"
                        >
                          <input
                            type="radio"
                            name={`checklist-${q.id}`}
                            value={option}
                            checked={entry.answer === option}
                            onChange={() =>
                              updateAnswer(q.id, { answer: option })
                            }
                            className="h-4 w-4 accent-gray-900"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      sx={auditFieldSx}
                      label="Remarks (if any)"
                      placeholder="Enter remarks"
                      value={entry.remark}
                      onChange={(e) =>
                        updateAnswer(q.id, { remark: e.target.value })
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                    <div className="mt-3">
                      <AttachmentPicker
                        label="Attachment"
                        files={entry.files}
                        onFilesChange={(files) => updateAnswer(q.id, { files })}
                        existing={entry.existing}
                        onRemoveExisting={(attachment) =>
                          updateAnswer(q.id, {
                            existing: entry.existing.filter(
                              (a) => a.id !== attachment.id
                            ),
                            removeAttachmentIds: [
                              ...entry.removeAttachmentIds,
                              attachment.id,
                            ],
                          })
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DetailCard>
      )}

      {step === 3 && (
        <DetailCard
          icon={sectionIcon(UserPlus)}
          title="Assign SPOC & Functional Head"
          className="mb-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-5 [&>div]:min-w-0">
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
                sx={auditFieldSx}
                fullWidth
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                inputProps={{
                  min: basic.inspection_date || todayIso(),
                  "aria-label": "Select Target Date",
                }}
              />
            </div>
          </div>
        </DetailCard>
      )}

      <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
        <button
          type="button"
          className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => save(false)}
        >
          {saving ? "Saving..." : "Save draft"}
        </button>
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => save(true)}
          >
            {saving ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </fieldset>
  );
};

export default InspectionInspectorAddPage;
