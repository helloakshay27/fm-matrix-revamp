import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ClipboardList, FileText, Paperclip, Store, Trash2, User } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { useViAuditMasters } from "@/components/vi-audit/useViAuditMasters";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { AuditLoadingState, sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { apiErrorMessage } from "@/components/vi-audit/viAuditApi";
import { useViAuditDraft } from "@/components/vi-audit/useViAuditDraft";
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

const AUDIT_LIST_PATH = "/safety/audit-list";
const viAuditUpdateEndpoint = (auditId: string) => `/vi_audits/${encodeURIComponent(auditId)}.json`;

interface ObservationEntry {
  /** Server id of an observation already saved on the draft — sent so it is updated, not re-created. */
  id?: string;
  observation: string;
  spoc: ViActiveUserOption | null;
  functionalHead: ViActiveUserOption | null;
  /** Names of attachments already saved on the draft (shown read-only). */
  existingAttachments: string[];
}

const emptyObservation = (): ObservationEntry => ({
  observation: "",
  spoc: null,
  functionalHead: null,
  existingAttachments: [],
});

/**
 * Auditor: edit a draft audit (/safety/audit-list/:id/edit). The draft is loaded from
 * GET /vi_audits/:id.json and preselected; Update sends PUT /vi_audits/:id.json.
 */
const AuditorEditAuditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const loggedInUser = useMemo(getLoggedInUser, []);
  const { masters, loading: mastersLoading } = useViAuditMasters();
  const { draft, loading: draftLoading } = useViAuditDraft(id);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  const [basic, setBasic] = useState({
    dateOfAudit: "",
    circle: "",
    personnelArea: "",
    workLocation: "",
    facilityType: "",
    location: "",
    function: "",
  });
  const [classification, setClassification] = useState({ classification: "", category: "", subCategory: "" });
  const [fteUsers, setFteUsers] = useState<ViActiveUserOption[]>([]);
  const [otherPeople, setOtherPeople] = useState<OtherPerson[]>([]);
  const [vendor, setVendor] = useState({ vendorName: "", subVendorName: "" });
  const [observations, setObservations] = useState<ObservationEntry[]>([emptyObservation()]);

  // Preselect the draft's saved values once it has loaded.
  useEffect(() => {
    if (!draft) return;
    setBasic(draft.basic);
    setClassification(draft.classification);
    setFteUsers(draft.fteUsers);
    setOtherPeople(draft.otherPeople);
    setVendor(draft.vendor);
    setObservations(draft.observations.length ? draft.observations : [emptyObservation()]);
  }, [draft]);

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
    const invalidIndex = observations.findIndex((o) => !o.observation.trim() || !o.spoc || !o.functionalHead);
    if (invalidIndex !== -1) {
      toast.error(`Please complete Observation ${invalidIndex + 1}: details, SPOC and Functional Head`);
      return false;
    }
    return true;
  };

  // Request body for PUT /vi_audits/:id.json.
  const buildPayload = () => ({
    vi_audit: {
      audit_type: draft?.auditType ?? "",
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
      observations_attributes: observations.map((o) => ({
        ...(o.id ? { id: toId(o.id) } : {}),
        observation: o.observation.trim(),
        spoc_id: toId(o.spoc?.id),
        functional_head_id: toId(o.functionalHead?.id),
      })),
    },
  });

  const handleUpdate = async () => {
    if (submitting || !id || !validateStepOne() || !validateStepTwo()) return;
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(viAuditUpdateEndpoint(id)), {
        method: "PUT",
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(result) || `Request failed with status ${response.status}`);
      toast.success("Audit updated successfully");
      navigate(AUDIT_LIST_PATH);
    } catch (error) {
      console.error("Audit update failed:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(`Failed to update audit${message ? `: ${message}` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (draftLoading) return <AuditLoadingState message="Loading audit..." />;
  if (!draft) return <AuditLoadingState message="Audit not found." onBack={() => navigate(AUDIT_LIST_PATH)} />;
  if (!draft.isDraft) {
    return <AuditLoadingState message="Only draft audits can be edited." onBack={() => navigate(AUDIT_LIST_PATH)} />;
  }

  const handleBack = () => {
    if (step === 2) setStep(1);
    else navigate(AUDIT_LIST_PATH);
  };

  const handleNext = () => {
    if (validateStepOne()) setStep(2);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Edit Audit</h1>
        {draft.auditType && (
          <span className="ml-1 inline-flex items-center rounded-full bg-[#F5F4F0] px-[10px] py-[3px] text-[11px] font-medium text-[rgba(26,26,24,0.68)]">
            {draft.auditType === "corporate" ? "Corporate" : "Circle"} audit
          </span>
        )}
      </div>

      {/* Stepper: 1 of 2 steps — same as the Add Audit page */}
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
            <button
              type="button"
              className="fm-action-secondary"
              onClick={() => navigate(AUDIT_LIST_PATH)}
              disabled={submitting}
            >
              Cancel
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
                  key={entry.id ?? `new-${index}`}
                  className={index > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}
                >
                  {observations.length > 1 && (
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#1A1A18]">Observation {index + 1}</span>
                      {/* Saved observations can't be removed through the update API — only newly added ones. */}
                      {!entry.id && (
                        <button
                          type="button"
                          onClick={() => setObservations((prev) => prev.filter((_, i) => i !== index))}
                          className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                          aria-label={`Remove observation ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
                    {entry.existingAttachments.length > 0 && (
                      <div>
                        <span className="mb-2 block text-[12px] font-semibold text-[rgba(26,26,24,0.68)]">
                          Attachments
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {entry.existingAttachments.map((name, fileIndex) => (
                            <span
                              key={`${name}-${fileIndex}`}
                              className="inline-flex max-w-[220px] items-center gap-1.5 rounded-full bg-[#F5F4F0] px-3 py-1 text-xs text-[#1A1A18]"
                            >
                              <Paperclip className="w-3 h-3 shrink-0 text-[rgba(26,26,24,0.48)]" />
                              <span className="truncate">{name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                  onClick={() => setObservations((prev) => [...prev, emptyObservation()])}
                />
              </div>
            </div>
          </DetailCard>

          <div className="fm-action-bar pt-4 sm:pt-6">
            <button type="button" className="fm-action-secondary" onClick={() => setStep(1)} disabled={submitting}>
              Back
            </button>
            <button type="button" className="fm-action-primary" onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditorEditAuditPage;
