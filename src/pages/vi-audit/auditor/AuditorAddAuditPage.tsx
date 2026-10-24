import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  Trash2,
  User,
  X,
} from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { useViAuditMasters } from "@/components/vi-audit/useViAuditMasters";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { sectionIcon, auditTextareaSx } from "@/components/vi-audit/ViAuditUi";
import {
  AddMoreButton,
  InfoRow,
  PeopleInteractedSection,
  SelectField,
  ObservationClassificationFields,
  SubSectionTitle,
  classificationPayload,
  getLoggedInUser,
  missingClassification,
  requiredLabel,
  toId,
  type OtherPerson,
} from "@/components/vi-audit/AuditFormFields";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_TYPES_LABEL,
  apiErrorMessage,
  fileToNamedDataUrl,
  isAllowedAttachment,
} from "@/components/vi-audit/viAuditApi";
import {
  AuditTypeSelectModal,
  isViAuditType,
  type ViAuditType,
} from "@/components/vi-audit/AuditTypeSelectModal";

// Create-audit endpoint. Confirm with the backend team — the Audit API is not live yet.
const VI_AUDIT_CREATE_ENDPOINT = "/vi_audits.json";

// Basic Details / Observation Classification dropdowns come from GET /vi_audits/masters.json
// (see useViAuditMasters); people pickers search the users API (useViUserSearch) — all FTE /
// Non-FTE users for "People Interacted With", internal employees only for SPOC / Functional Head.

// One observation card (step 2): its own classification, people, vendor and details.
interface ObservationEntry {
  /** Stable React key for the card. */
  key: string;
  classification: string;
  category: string;
  subCategory: string;
  /** Free text when "Others" is picked (sent as classification_other / category_other / sub_category_other). */
  classificationOther: string;
  categoryOther: string;
  subCategoryOther: string;
  fteUsers: ViActiveUserOption[];
  otherPeople: OtherPerson[];
  vendorName: string;
  subVendorName: string;
  observation: string;
  attachments: File[];
  spoc: ViActiveUserOption | null;
  functionalHead: ViActiveUserOption | null;
}

let observationKeySeq = 0;
const emptyObservation = (): ObservationEntry => ({
  key: `obs-${++observationKeySeq}`,
  classification: "",
  category: "",
  subCategory: "",
  classificationOther: "",
  categoryOther: "",
  subCategoryOther: "",
  fteUsers: [],
  otherPeople: [],
  vendorName: "",
  subVendorName: "",
  observation: "",
  attachments: [],
  spoc: null,
  functionalHead: null,
});

// people_interacted_with entries for one observation card.
const peoplePayload = (o: ObservationEntry) => [
  ...o.fteUsers.map((user) => ({ type: "user", user_id: toId(user.id) })),
  ...o.otherPeople.map((person) => ({ type: "other", name: person.name, role: person.designation })),
];

const todayIso = () => new Date().toISOString().split("T")[0];

const AuditorAddAuditPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViAuditMasters();

  // Audit type comes from the "Select type of audit" modal on the list page (?type=corporate|circle)
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const auditType: ViAuditType | null = isViAuditType(typeParam) ? typeParam : null;
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  const [basic, setBasic] = useState({
    dateOfAudit: todayIso(),
    circle: "",
    personnelArea: "",
    workLocation: "",
    facilityType: "",
    location: "",
    function: "",
  });
  const [observations, setObservations] = useState<ObservationEntry[]>(() => [emptyObservation()]);

  const updateObservation = (index: number, patch: Partial<ObservationEntry>) =>
    setObservations((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const validateStepOne = () => {
    const missing = [
      !basic.dateOfAudit && "Date of Audit",
      !basic.circle && "Circle",
      // circle_id is required only for circle audits
      auditType === "circle" && !basic.personnelArea && "Personnel Area",
      !basic.workLocation && "Work Location",
      !basic.facilityType && "Type of Facility",
      !basic.location.trim() && "Location",
      !basic.function && "Function",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  // Step 2: every observation card needs its classification, details, SPOC and Functional Head
  // (people / vendor are optional).
  const validateStepTwo = () => {
    for (const [index, o] of observations.entries()) {
      const missing = [
        ...missingClassification(o),
        !o.observation.trim() && "Observation",
        !o.spoc && "SPOC",
        !o.functionalHead && "Functional Head",
      ].filter(Boolean);
      if (missing.length) {
        const label = observations.length > 1 ? `Observation ${index + 1}: ` : "";
        toast.error(`${label}Please fill ${missing.join(", ")}`);
        return false;
      }
    }
    return true;
  };

  // Request body for POST /vi_audits.json. `submit: false` saves a draft.
  // Vendor, classification (or "Others" text) and people interacted with are observation
  // fields — sent only inside each observations_attributes item.
  const buildPayload = async (submit: boolean) => {
    return {
    submit,
    vi_audit: {
      audit_type: auditType ?? "",
      audit_date: basic.dateOfAudit,
      cluster_id: toId(basic.circle),
      circle_id: toId(basic.personnelArea),
      work_location_id: toId(basic.workLocation),
      audit_location: basic.location.trim(),
      department_id: toId(basic.function),
      visit_business_area_id: toId(basic.facilityType),
      observations_attributes: await Promise.all(
        observations.map(async (o) => ({
          observation: o.observation.trim(),
          ...classificationPayload(o),
          vendor_name: o.vendorName.trim(),
          sub_vendor_name: o.subVendorName.trim(),
          people_interacted_with: peoplePayload(o),
          spoc_id: toId(o.spoc?.id),
          functional_head_id: toId(o.functionalHead?.id),
          attachments: await Promise.all(o.attachments.map(fileToNamedDataUrl)),
        })),
      ),
    },
    };
  };

  const sendAudit = async (status: "draft" | "submitted") => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(VI_AUDIT_CREATE_ENDPOINT), {
        method: "POST",
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(await buildPayload(status === "submitted")),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(result) || `Request failed with status ${response.status}`);
      toast.success(status === "draft" ? "Audit saved to draft" : "Audit submitted successfully");
      navigate("/safety/audit-list");
    } catch (error) {
      console.error("Audit save failed:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(
        `${status === "draft" ? "Failed to save draft" : "Failed to submit audit"}${message ? `: ${message}` : ""}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else navigate("/safety/audit-list");
  };

  const handleNext = () => {
    if (validateStepOne()) setStep(2);
  };

  const handleSubmit = () => {
    if (validateStepOne() && validateStepTwo()) sendAudit("submitted");
  };

  const header = (
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={handleBack}
        className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
        aria-label="Back"
      >
        <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
      </button>
      <h1 className="text-xl font-semibold text-[#1A1A18]">Audit</h1>
      {auditType && (
        <span className="ml-1 inline-flex items-center rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
          {auditType === "corporate" ? "Corporate" : "Circle"} audit
        </span>
      )}
    </div>
  );

  // --- No type in the URL (page opened directly): ask for it in the same modal --
  if (auditType === null) {
    return (
      <div className="p-6 min-h-screen">
        {header}
        <AuditTypeSelectModal
          open
          onClose={() => navigate("/safety/audit-list")}
          onSelect={(type) => setSearchParams({ type }, { replace: true })}
        />
      </div>
    );
  }

  // --- Two-step form -------------------------------------------------------
  return (
    <div className="p-6 min-h-screen">
      {header}

      {/* Stepper: 1 of 2 steps — neutral current / done states (solid ink is for CTAs) */}
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
                <span
                  className={`mx-2 h-px flex-1 ${step === 2 ? "bg-[#1A1A18]" : "bg-[rgba(26,26,24,0.12)]"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <>
          <DetailCard icon={sectionIcon(User)} title="Auditor Details" className="mb-5">
            <div className="space-y-2">
              <InfoRow label="Name" value={loggedInUser.name} />
              <InfoRow label="Mail ID" value={loggedInUser.email} />
              <InfoRow label="Designation" value={loggedInUser.designation} />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(FileText)} title="Basic Details" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
              <TextField
                fullWidth
                type="date"
                label={requiredLabel("Date of Audit")}
                value={basic.dateOfAudit}
                onChange={(e) => setBasic((p) => ({ ...p, dateOfAudit: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <SelectField
                label="Circle"
                required
                value={basic.circle}
                onChange={(v) => setBasic((p) => ({ ...p, circle: v }))}
                options={masters.clusters}
                loading={mastersLoading}
                placeholder="Select audit circle"
              />
              <SelectField
                label="Personnel Area"
                required={auditType === "circle"}
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
                placeholder="Enter location"
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
                placeholder="Select function"
              />
            </div>
          </DetailCard>

          <div className="fm-action-bar pt-4 sm:pt-6">
            <button type="button" className="fm-action-secondary" onClick={() => sendAudit("draft")} disabled={submitting}>
              Save draft
            </button>
            <button type="button" className="fm-action-primary" onClick={handleNext} disabled={submitting}>
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {/* Step 2: one card per observation — Observation Classification, People Interacted
              With, Vendor Details and Observation Details. "Add more observation" adds a whole
              new card; each card's values are saved on its own observation. */}
          {observations.map((entry, index) => (
            <div
              key={entry.key}
              className="mb-5 w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              {observations.length > 1 && (
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-[15px] font-semibold text-gray-900">Observation {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setObservations((prev) => prev.filter((_, i) => i !== index))}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label={`Remove observation ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <SubSectionTitle>Observation Classification</SubSectionTitle>
              <ObservationClassificationFields
                value={entry}
                onChange={(patch) => updateObservation(index, patch)}
                classifications={masters.classifications}
                categories={masters.categories}
                subCategories={masters.subCategories}
                loading={mastersLoading}
              />

              <SubSectionTitle divider>People Interacted With</SubSectionTitle>
              <PeopleInteractedSection
                bare
                fteUsers={entry.fteUsers}
                onFteUsersChange={(users) => updateObservation(index, { fteUsers: users })}
                otherPeople={entry.otherPeople}
                onOtherPeopleChange={(people) => updateObservation(index, { otherPeople: people })}
              />

              <SubSectionTitle divider>Vendor Details</SubSectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField
                  fullWidth
                  label="Vendor"
                  placeholder="Enter vendor name"
                  value={entry.vendorName}
                  onChange={(e) => updateObservation(index, { vendorName: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Sub Vendor"
                  placeholder="Enter sub vendor name"
                  value={entry.subVendorName}
                  onChange={(e) => updateObservation(index, { subVendorName: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <SubSectionTitle divider>Observation Details</SubSectionTitle>
              <div className="space-y-5">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  sx={auditTextareaSx}
                  label={requiredLabel("Observation")}
                  placeholder="Enter observation details"
                  value={entry.observation}
                  onChange={(e) => updateObservation(index, { observation: e.target.value })}
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
                        const allowed = files.filter(isAllowedAttachment);
                        const rejected = files.filter((file) => !isAllowedAttachment(file));
                        if (rejected.length) {
                          toast.error(
                            `${rejected.map((file) => file.name).join(", ")} ${
                              rejected.length === 1 ? "is" : "are"
                            } not allowed. ${ATTACHMENT_TYPES_LABEL}`,
                          );
                        }
                        if (allowed.length) {
                          updateObservation(index, { attachments: [...entry.attachments, ...allowed] });
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <span className="ml-3 text-xs text-gray-500">PNG / JPEG only</span>
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
                              updateObservation(index, {
                                attachments: entry.attachments.filter((_, i) => i !== fileIndex),
                              })
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <UserSelectField
                    label="SPOC"
                    required
                    value={entry.spoc}
                    onChange={(user) => updateObservation(index, { spoc: user })}
                    employeeType="internal"
                    placeholder="Search SPOC by email or mobile"
                  />
                  <UserSelectField
                    label="Functional Head"
                    required
                    value={entry.functionalHead}
                    onChange={(user) => updateObservation(index, { functionalHead: user })}
                    employeeType="internal"
                    placeholder="Search functional head by email or mobile"
                  />
                </div>
              </div>

              {/* Add another full observation card (only under the last card) */}
              {index === observations.length - 1 && (
                <div className="mt-4 flex justify-end">
                  <AddMoreButton
                    label="Add more observation"
                    onClick={() => setObservations((prev) => [...prev, emptyObservation()])}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="fm-action-bar pt-4 sm:pt-6">
            <button type="button" className="fm-action-secondary" onClick={() => sendAudit("draft")} disabled={submitting}>
              Save draft
            </button>
            <button type="button" className="fm-action-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditorAddAuditPage;
