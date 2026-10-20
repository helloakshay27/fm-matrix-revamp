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
import { Autocomplete, CircularProgress, MenuItem, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { useViAuditMasters, type MasterOption } from "@/components/vi-audit/useViAuditMasters";
import {
  VI_USER_SEARCH_MIN_CHARS,
  useViUserSearch,
  type ViActiveUserOption,
} from "@/components/vi-audit/useViActiveUsers";
import {
  AuditTypeSelectModal,
  isViAuditType,
  type ViAuditType,
} from "@/components/vi-audit/AuditTypeSelectModal";

// Create-audit endpoint. Confirm with the backend team — the Audit API is not live yet.
const VI_AUDIT_CREATE_ENDPOINT = "/vi_audits.json";

// Observation attachments: the audit API only accepts PDF, JPEG, JPG and PNG.
const ALLOWED_ATTACHMENT_EXTENSIONS = ["pdf", "jpeg", "jpg", "png"];
const ALLOWED_ATTACHMENT_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ATTACHMENT_ACCEPT = ".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png";

const isAllowedAttachment = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  // Check the extension (what the API validates on) and, when the browser reports one, the MIME type.
  return (
    ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension) &&
    (!file.type || ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type))
  );
};

/** Master / user ids are numeric on the backend; send numbers, or null when not selected. */
const toId = (value: string | undefined | null): number | string | null => {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : value;
};

/**
 * Reads a file as the attachment format the audit API expects:
 * `data:<mime>;name=<filename>;base64,<data>` (one entry per file — any number per observation).
 */
const fileToNamedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      // ";" and "," delimit the data-URL header, so keep them out of the file name.
      const safeName = file.name.replace(/[;,]/g, "_");
      resolve(dataUrl.replace(/^data:([^;,]*)/, (_, mime) => `data:${mime || "application/octet-stream"};name=${safeName}`));
    };
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
    reader.readAsDataURL(file);
  });

/** Best-effort message from an API error body ({ message } / { error } / { errors }). */
const apiErrorMessage = (body: unknown): string => {
  if (!body || typeof body !== "object") return "";
  const b = body as Record<string, unknown>;
  if (typeof b.message === "string") return b.message;
  if (typeof b.error === "string") return b.error;
  if (Array.isArray(b.errors)) return b.errors.filter((e) => typeof e === "string").join(", ");
  if (b.errors && typeof b.errors === "object") {
    return Object.entries(b.errors as Record<string, unknown>)
      .map(([field, msgs]) => `${field} ${Array.isArray(msgs) ? msgs.join(", ") : String(msgs)}`)
      .join("; ");
  }
  return "";
};

// Basic Details / Observation Classification dropdowns come from GET /vi_audits/masters.json
// (see useViAuditMasters); people pickers search the users API (useViUserSearch) — all FTE /
// Non-FTE users for "People Interacted With", internal employees only for SPOC / Functional Head.

interface OtherPerson {
  name: string;
  designation: string;
}

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
// Options are plain strings (value = label) or masters records ({ value: id, label: name }).
function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: (string | MasterOption)[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const normalized: MasterOption[] = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const labelFor = (selected: string) =>
    normalized.find((option) => option.value === selected)?.label ?? selected;

  return (
    <TextField
      select
      fullWidth
      label={required ? requiredLabel(label) : label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        displayEmpty: true,
        MenuProps: { PaperProps: { style: { maxHeight: 320 } } },
        renderValue: (selected) =>
          selected ? (
            labelFor(selected as string)
          ) : (
            <span className="text-[rgba(26,26,24,0.3)]">{loading ? "Loading..." : placeholder}</span>
          ),
      }}
    >
      {normalized.map((option) => (
        <MenuItem key={option.value} value={option.value} sx={{ whiteSpace: "normal" }}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

// Searchable single-user picker (SPOC / Functional Head) — internal employees only.
function UserSelectField({
  label,
  required,
  value,
  onChange,
  employeeType,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  placeholder: string;
}) {
  return (
    <div>
      <AutocompleteLabel required={required}>{label}</AutocompleteLabel>
      <UserAutocomplete
        value={value}
        onChange={onChange}
        employeeType={employeeType}
        placeholder={placeholder}
        ariaLabel={label}
      />
    </div>
  );
}

// Label rendered OUTSIDE the Autocomplete (same 12px/600 style as the global field standard).
// An MUI `label` inside an Autocomplete gets lifted into the field's clickable root by the
// global label-above CSS, which breaks MUI's focus handling — the popup opens and instantly
// closes. Same pattern as the app's other Autocompletes (e.g. ReporteesReassignPage).
function AutocompleteLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="block mb-1.5 text-[12px] font-semibold text-[rgba(26,26,24,0.68)]">
      {children}
      {required && <span className="fm-required-mark">*</span>}
    </span>
  );
}

// Server-side user search (q[email_or_mobile_cont]) — same Autocomplete setup as the working
// ReporteesReassignPage picker: controlled input, results from the API (no client filtering),
// spinner while searching, no MUI label (see AutocompleteLabel).
function UserAutocomplete({
  value,
  onChange,
  employeeType,
  excludeIds,
  placeholder,
  ariaLabel,
}: {
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  excludeIds?: string[];
  placeholder: string;
  ariaLabel: string;
}) {
  // inputValue = text shown in the box (incl. the selected user's name MUI writes back);
  // searchTerm = only what the user typed, so selecting someone doesn't trigger a search.
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { options: results, loading } = useViUserSearch(searchTerm, employeeType);

  const options = excludeIds?.length ? results.filter((u) => !excludeIds.includes(u.id)) : results;
  // Keep the selected user in the option list so MUI can render it after the results change.
  const allOptions = value && !options.some((u) => u.id === value.id) ? [value, ...options] : options;
  const tooShort = searchTerm.trim().length < VI_USER_SEARCH_MIN_CHARS;

  return (
    <Autocomplete
      options={allOptions}
      loading={loading}
      value={value}
      onChange={(_, user) => onChange(user)}
      inputValue={inputValue}
      onInputChange={(_, next, reason) => {
        setInputValue(next);
        if (reason === "input") setSearchTerm(next);
        if (reason === "clear") setSearchTerm("");
      }}
      filterOptions={(x) => x}
      getOptionLabel={(user) => user.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      renderOption={(props, user) => (
        <li {...props} key={user.id}>
          <div className="flex flex-col py-0.5">
            <span className="text-sm text-[#1A1A18]">{user.name}</span>
            {user.email && <span className="text-xs text-[rgba(26,26,24,0.48)]">{user.email}</span>}
          </div>
        </li>
      )}
      loadingText="Searching..."
      noOptionsText={
        tooShort ? `Type at least ${VI_USER_SEARCH_MIN_CHARS} characters of email or mobile` : "No matching users"
      }
      slotProps={{
        paper: {
          sx: {
            border: "1px solid rgba(26,26,24,0.09)",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.08)",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label=""
          placeholder={placeholder}
          inputProps={{ ...params.inputProps, "aria-label": ariaLabel }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
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
  const [showFtePicker, setShowFtePicker] = useState(false);
  const [otherPeople, setOtherPeople] = useState<OtherPerson[]>([]);
  const [otherDraft, setOtherDraft] = useState<OtherPerson | null>(null);
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
                    {/* Searchable — the active FTE / Non-FTE list can be long */}
                    <AutocompleteLabel>Person</AutocompleteLabel>
                    <UserAutocomplete
                      excludeIds={fteUsers.map((u) => u.id)}
                      value={null}
                      onChange={(user) => {
                        if (!user) return;
                        setFteUsers((prev) => (prev.some((s) => s.id === user.id) ? prev : [...prev, user]));
                        setShowFtePicker(false);
                      }}
                      placeholder="Search person by email or mobile"
                      ariaLabel="Person"
                    />
                  </div>
                )}
                {fteUsers.length > 0 ? (
                  <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
                    {fteUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-[#1A1A18]">
                          {user.name}
                          {user.email && <span className="text-[rgba(26,26,24,0.48)]"> · {user.email}</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFteUsers((prev) => prev.filter((s) => s.id !== user.id))}
                          className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                          aria-label={`Remove ${user.name}`}
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
