import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Paperclip,
  Plus,
  Store,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { MenuItem, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import {
  AuditTypeSelectModal,
  isViAuditType,
  type ViAuditType,
} from "@/components/vi-audit/AuditTypeSelectModal";

// Create-audit endpoint. Confirm with the backend team — the Audit API is not live yet.
const VI_AUDIT_CREATE_ENDPOINT = "/pms/vi_audits.json";

// Placeholder option lists — swap for live master-data lookups once the Audit backend is available.
const CIRCLES = ["Mumbai", "Gujarat", "Delhi", "Karnataka"];
const PERSONNEL_AREAS = ["Worli", "Churchgate", "Andheri", "Bandra"];
const WORK_LOCATIONS = ["Birla Centurion Pvt. Ltd.", "Tata Projects Pvt. Ltd.", "Adani Realty Pvt. Ltd."];
const FACILITY_TYPES = ["Office", "Warehouse", "Tower Site", "Retail Store"];
const FUNCTIONS = ["Operations", "Maintenance", "Security", "Admin"];
const CLASSIFICATIONS = ["Very High", "High", "Medium", "Low"];
const CATEGORIES = ["Electronic", "Mechanical", "Civil"];
const SUB_CATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  Electronic: ["HVAC", "Wiring"],
  Mechanical: ["Plumbing"],
  Civil: ["Scaffolding"],
};
const FTE_USERS = ["Vansh Shah", "Arun Mohan", "Veena Kumari", "Vikram Singh", "Kiran Joshi"];
const SPOCS = ["Arun Mohan", "Veena Kumari", "Vikram Singh", "Kiran Joshi"];
const FUNCTIONAL_HEADS = ["Vinit Mehra", "Priya Nair", "Rohit Sharma"];

interface OtherPerson {
  name: string;
  designation: string;
}

interface ObservationEntry {
  observation: string;
  attachments: File[];
  spoc: string;
  functionalHead: string;
}

const EMPTY_OBSERVATION: ObservationEntry = {
  observation: "",
  attachments: [],
  spoc: "",
  functionalHead: "",
};

const todayIso = () => new Date().toISOString().split("T")[0];

function getLoggedInUser(): { name: string; email: string; designation: string } {
  try {
    const raw = JSON.parse(localStorage.getItem("user") || "{}");
    const name = [raw?.firstname, raw?.lastname].filter(Boolean).join(" ").trim();
    return {
      name: name || raw?.name || "",
      email: raw?.email || "",
      designation: raw?.designation || raw?.lock_role?.name || "",
    };
  } catch {
    return { name: "", email: "", designation: "" };
  }
}

const sectionIcon = (Icon: typeof User) => (
  <Icon className="w-[18px] h-[18px]" style={{ color: "rgba(26, 26, 24, 0.68)" }} />
);

const requiredLabel = (text: string) => (
  <>
    {text} <span className="fm-required-mark">*</span>
  </>
);

// Labelled MUI select — the global field standard places the label above the control.
function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <TextField
      select
      fullWidth
      label={required ? requiredLabel(label) : label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) =>
          selected ? (selected as string) : <span className="text-[rgba(26,26,24,0.3)]">{placeholder}</span>,
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-28 shrink-0 text-[rgba(26,26,24,0.48)]">{label}</span>
      <span className="text-[rgba(26,26,24,0.48)]">:</span>
      <span className="font-medium text-[#1A1A18]">{value || "-"}</span>
    </div>
  );
}

// Small inline "+ Add more" style action.
function AddMoreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[#1A1A18] hover:bg-[#F5F4F0]"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

const AuditorAddAuditPage = () => {
  const navigate = useNavigate();
  const loggedInUser = useMemo(getLoggedInUser, []);

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
  const [fteUsers, setFteUsers] = useState<string[]>([]);
  const [showFtePicker, setShowFtePicker] = useState(false);
  const [otherPeople, setOtherPeople] = useState<OtherPerson[]>([]);
  const [otherDraft, setOtherDraft] = useState<OtherPerson | null>(null);
  const [vendor, setVendor] = useState({ vendorName: "", subVendorName: "" });
  const [observations, setObservations] = useState<ObservationEntry[]>([{ ...EMPTY_OBSERVATION }]);

  const subCategoryOptions = classification.category
    ? SUB_CATEGORIES_BY_CATEGORY[classification.category] ?? []
    : [];

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

  const buildPayload = (status: "draft" | "submitted") => {
    const payload = new FormData();
    payload.append("audit[audit_type]", auditType ?? "");
    payload.append("audit[status]", status);
    payload.append("audit[date_of_audit]", basic.dateOfAudit);
    payload.append("audit[circle]", basic.circle);
    payload.append("audit[personnel_area]", basic.personnelArea);
    payload.append("audit[work_location]", basic.workLocation);
    payload.append("audit[facility_type]", basic.facilityType);
    payload.append("audit[location]", basic.location);
    payload.append("audit[function]", basic.function);
    payload.append("audit[classification]", classification.classification);
    payload.append("audit[category]", classification.category);
    payload.append("audit[sub_category]", classification.subCategory);
    fteUsers.forEach((name) => payload.append("audit[fte_people][]", name));
    otherPeople.forEach((person, i) => {
      payload.append(`audit[other_people][${i}][name]`, person.name);
      payload.append(`audit[other_people][${i}][designation]`, person.designation);
    });
    payload.append("audit[vendor_name]", vendor.vendorName);
    payload.append("audit[sub_vendor_name]", vendor.subVendorName);
    observations.forEach((o, i) => {
      payload.append(`audit[observations][${i}][observation]`, o.observation);
      payload.append(`audit[observations][${i}][spoc]`, o.spoc);
      payload.append(`audit[observations][${i}][functional_head]`, o.functionalHead);
      o.attachments.forEach((file) => payload.append(`audit[observations][${i}][attachments][]`, file));
    });
    return payload;
  };

  const sendAudit = async (status: "draft" | "submitted") => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch(getFullUrl(VI_AUDIT_CREATE_ENDPOINT), {
        method: "POST",
        headers: { Authorization: getAuthHeader() },
        body: buildPayload(status),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      toast.success(status === "draft" ? "Audit saved to draft" : "Audit submitted successfully");
      navigate("/safety/audit-list");
    } catch (error) {
      console.error("Audit save failed:", error);
      toast.error(status === "draft" ? "Failed to save draft" : "Failed to submit audit");
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
                options={CIRCLES}
                placeholder="Select audit circle"
              />
              <SelectField
                label="Personnel Area"
                required
                value={basic.personnelArea}
                onChange={(v) => setBasic((p) => ({ ...p, personnelArea: v }))}
                options={PERSONNEL_AREAS}
                placeholder="Select personnel area"
              />
              <SelectField
                label="Work Location"
                required
                value={basic.workLocation}
                onChange={(v) => setBasic((p) => ({ ...p, workLocation: v }))}
                options={WORK_LOCATIONS}
                placeholder="Select work location"
              />
              <SelectField
                label="Type of Facility"
                required
                value={basic.facilityType}
                onChange={(v) => setBasic((p) => ({ ...p, facilityType: v }))}
                options={FACILITY_TYPES}
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
                options={FUNCTIONS}
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
                options={CLASSIFICATIONS}
                placeholder="Select observation classification"
              />
              <SelectField
                label="Category"
                required
                value={classification.category}
                onChange={(v) => setClassification((p) => ({ ...p, category: v, subCategory: "" }))}
                options={CATEGORIES}
                placeholder="Select observation category"
              />
              <SelectField
                label="Sub Category"
                required
                value={classification.subCategory}
                onChange={(v) => setClassification((p) => ({ ...p, subCategory: v }))}
                options={subCategoryOptions}
                placeholder={classification.category ? "Select observation sub-category" : "Select category first"}
                disabled={!classification.category}
              />
            </div>
          </DetailCard>

          <DetailCard icon={sectionIcon(Users)} title="People Interacted With" className="mb-5">
            <div className="space-y-6">
              {/* FTE / Non-FTE */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">FTE / Non-FTE</span>
                  <AddMoreButton label="Add more" onClick={() => setShowFtePicker(true)} />
                </div>
                {showFtePicker && (
                  <div className="mb-3 max-w-md">
                    <SelectField
                      label="Person"
                      value=""
                      onChange={(v) => {
                        setFteUsers((prev) => (prev.includes(v) ? prev : [...prev, v]));
                        setShowFtePicker(false);
                      }}
                      options={FTE_USERS.filter((u) => !fteUsers.includes(u))}
                      placeholder="Select person"
                    />
                  </div>
                )}
                {fteUsers.length > 0 ? (
                  <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
                    {fteUsers.map((name) => (
                      <div key={name} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-[#1A1A18]">{name}</span>
                        <button
                          type="button"
                          onClick={() => setFteUsers((prev) => prev.filter((n) => n !== name))}
                          className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                          aria-label={`Remove ${name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  !showFtePicker && (
                    <p className="text-sm text-[rgba(26,26,24,0.48)]">No FTE / Non-FTE people added.</p>
                  )
                )}
              </div>

              {/* Others */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">Others</span>
                  <AddMoreButton label="Add more" onClick={() => setOtherDraft({ name: "", designation: "" })} />
                </div>
                {otherDraft && (
                  <div className="mb-3 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-end gap-4">
                    <TextField
                      fullWidth
                      label={requiredLabel("Name")}
                      placeholder="Enter person name"
                      value={otherDraft.name}
                      onChange={(e) => setOtherDraft((p) => (p ? { ...p, name: e.target.value } : p))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label={requiredLabel("Designation")}
                      placeholder="Enter designation"
                      value={otherDraft.designation}
                      onChange={(e) => setOtherDraft((p) => (p ? { ...p, designation: e.target.value } : p))}
                      InputLabelProps={{ shrink: true }}
                    />
                    <div className="flex gap-2">
                      <button type="button" className="fm-action-secondary" onClick={() => setOtherDraft(null)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="fm-action-primary"
                        onClick={() => {
                          if (!otherDraft.name.trim() || !otherDraft.designation.trim()) {
                            toast.error("Please enter name and designation");
                            return;
                          }
                          setOtherPeople((prev) => [...prev, otherDraft]);
                          setOtherDraft(null);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                {otherPeople.length > 0 ? (
                  <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
                    {otherPeople.map((person, index) => (
                      <div key={`${person.name}-${index}`} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-[#1A1A18]">
                          {person.name}{" "}
                          <span className="text-[rgba(26,26,24,0.48)]">· {person.designation}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setOtherPeople((prev) => prev.filter((_, i) => i !== index))}
                          className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                          aria-label={`Remove ${person.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  !otherDraft && <p className="text-sm text-[rgba(26,26,24,0.48)]">No other people added.</p>
                )}
              </div>
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
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            updateObservation(index, { attachments: [...entry.attachments, ...files] });
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
                      <SelectField
                        label="SPOC"
                        required
                        value={entry.spoc}
                        onChange={(v) => updateObservation(index, { spoc: v })}
                        options={SPOCS}
                        placeholder="Select SPOC"
                      />
                      <SelectField
                        label="Functional Head"
                        required
                        value={entry.functionalHead}
                        onChange={(v) => updateObservation(index, { functionalHead: v })}
                        options={FUNCTIONAL_HEADS}
                        placeholder="Select functional head"
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
