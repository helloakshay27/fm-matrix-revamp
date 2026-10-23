import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Paperclip,
  Store,
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
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import {
  AddMoreButton,
  InfoRow,
  PeopleInteractedSection,
  SelectField,
  getLoggedInUser,
  requiredLabel,
  toId,
  type OtherPerson,
} from "@/components/vi-audit/AuditFormFields";
import {
  ATTACHMENT_ACCEPT,
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

interface ObservationEntry {
  observation: string;
  attachments: File[];
  spoc: ViActiveUserOption | null;
  functionalHead: ViActiveUserOption | null;
}

const EMPTY_OBSERVATION: ObservationEntry = {
  observation: "",
  attachments: [],
  spoc: null,
  functionalHead: null,
};

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
  const [classification, setClassification] = useState({
    classification: "",
    category: "",
    subCategory: "",
  });
  const [fteUsers, setFteUsers] = useState<ViActiveUserOption[]>([]);
  const [otherPeople, setOtherPeople] = useState<OtherPerson[]>([]);
  const [vendor, setVendor] = useState({ vendorName: "", subVendorName: "" });
  const [observations, setObservations] = useState<ObservationEntry[]>([{ ...EMPTY_OBSERVATION }]);

  const updateObservation = (index: number, patch: Partial<ObservationEntry>) =>
    setObservations((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));

  const validateStepOne = () => {
    const missing = [
      !basic.dateOfAudit && "Date of Audit",
      !basic.circle && "Circle",
      !basic.personnelArea && "Personnel Area",
      !basic.workLocation && "Work Location",
      !basic.facilityType && "Type of Facility",
      !basic.location.trim() && "Location",
      !basic.function && "Function",
      !classification.classification && "Classification",
      !classification.category && "Category",
      !classification.subCategory && "Sub Category",
    ].filter(Boolean);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const validateStepTwo = () => {
    const invalidIndex = observations.findIndex(
      (o) => !o.observation.trim() || !o.spoc || !o.functionalHead,
    );
    if (invalidIndex !== -1) {
      toast.error(`Please complete Observation ${invalidIndex + 1}: details, SPOC and Functional Head`);
      return false;
    }
    return true;
  };

  // Request body for POST /vi_audits.json. `submit: false` saves a draft.
  const buildPayload = async (submit: boolean) => ({
    submit,
    vi_audit: {
      audit_type: auditType ?? "",
      audit_date: basic.dateOfAudit,
      cluster_id: toId(basic.circle),
      circle_id: toId(basic.personnelArea),
      work_location_id: toId(basic.workLocation),
      audit_location: basic.location.trim(),
      department_id: toId(basic.function),
      vendor_name: vendor.vendorName.trim(),
      sub_vendor_name: vendor.subVendorName.trim(),
      classification_id: toId(classification.classification),
      category_id: toId(classification.category),
      sub_category_id: toId(classification.subCategory),
      visit_business_area_id: toId(basic.facilityType),
      people_interacted_with: [
        ...fteUsers.map((user) => ({ type: "user", user_id: toId(user.id) })),
        ...otherPeople.map((person) => ({ type: "other", name: person.name, role: person.designation })),
      ],
      observations_attributes: await Promise.all(
        observations.map(async (o) => ({
          observation: o.observation.trim(),
          spoc_id: toId(o.spoc?.id),
          functional_head_id: toId(o.functionalHead?.id),
          attachments: await Promise.all(o.attachments.map(fileToNamedDataUrl)),
        })),
      ),
    },
  });

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

          <DetailCard icon={sectionIcon(ClipboardList)} title="Observation Classification" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SelectField
                label="Classification"
                required
                value={classification.classification}
                onChange={(v) => setClassification((p) => ({ ...p, classification: v }))}
                options={masters.classifications}
                loading={mastersLoading}
                placeholder="Select observation classification"
              />
              <SelectField
                label="Category"
                required
                value={classification.category}
                onChange={(v) => setClassification((p) => ({ ...p, category: v }))}
                options={masters.categories}
                loading={mastersLoading}
                placeholder="Select observation category"
              />
              <SelectField
                label="Sub Category"
                required
                value={classification.subCategory}
                onChange={(v) => setClassification((p) => ({ ...p, subCategory: v }))}
                options={masters.subCategories}
                loading={mastersLoading}
                placeholder="Select observation sub-category"
              />
            </div>
          </DetailCard>

          <PeopleInteractedSection
            fteUsers={fteUsers}
            onFteUsersChange={setFteUsers}
            otherPeople={otherPeople}
            onOtherPeopleChange={setOtherPeople}
          />

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
          <DetailCard icon={sectionIcon(Store)} title="Vendor Details" className="mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Vendor"
                placeholder="Enter vendor name"
                value={vendor.vendorName}
                onChange={(e) => setVendor((p) => ({ ...p, vendorName: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Sub Vendor"
                placeholder="Enter sub vendor name"
                value={vendor.subVendorName}
                onChange={(e) => setVendor((p) => ({ ...p, subVendorName: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(ClipboardList)} title="Observation Details" className="mb-5">
            <div className="space-y-6">
              {observations.map((entry, index) => (
                <div
                  key={index}
                  className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}
                >
                  {observations.length > 1 && (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#1A1A18]">Observation {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => setObservations((prev) => prev.filter((_, i) => i !== index))}
                        className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                        aria-label={`Remove observation ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="space-y-5">
                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
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
                                } not allowed. Only PDF, JPEG, JPG and PNG files are accepted.`,
                              );
                            }
                            if (allowed.length) {
                              updateObservation(index, { attachments: [...entry.attachments, ...allowed] });
                            }
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
                </div>
              ))}
              <div className="flex justify-end">
                <AddMoreButton
                  label="Add Observation"
                  onClick={() => setObservations((prev) => [...prev, { ...EMPTY_OBSERVATION }])}
                />
              </div>
            </div>
          </DetailCard>

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
