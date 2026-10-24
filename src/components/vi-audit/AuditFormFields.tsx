import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Users } from "lucide-react";
import { MenuItem, TextField, type MenuProps } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import type { MasterOption } from "./useViAuditMasters";
import type { ViActiveUserOption } from "./useViActiveUsers";
import { UserAutocomplete } from "./ViUserPicker";
import { sectionIcon } from "./ViAuditUi";
import { OTHER_OPTION_VALUE } from "./viAuditApi";

// Shared fields / sections of the Vi Audit forms (Add Audit and Edit Audit pages).

/** Master / user ids are numeric on the backend; send numbers, or null when not selected. */
export const toId = (value: string | undefined | null): number | string | null => {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : value;
};

export function getLoggedInUser(): { name: string; email: string; designation: string } {
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

// Ticket-form field look — defined in ViAuditUi (shared with the user pickers), re-exported here.
export { auditFieldSx } from "./ViAuditUi";
import { auditFieldSx } from "./ViAuditUi";

export const requiredLabel = (text: string) => (
  <>
    {text} <span className="text-red-500 ml-0.5">*</span>
  </>
);

// Labelled MUI select — the global field standard places the label above the control.
// Options are plain strings (value = label) or masters records ({ value: id, label: name }).
export function SelectField({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
  menuProps,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: (string | MasterOption)[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  /** Extra MUI Menu props (e.g. anchorOrigin) merged over the defaults. */
  menuProps?: Partial<MenuProps>;
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
      sx={auditFieldSx}
      InputLabelProps={{ shrink: true }}
      SelectProps={{
        displayEmpty: true,
        MenuProps: {
          ...menuProps,
          PaperProps: { ...menuProps?.PaperProps, style: { maxHeight: 320, ...menuProps?.PaperProps?.style } },
        },
        renderValue: (selected) =>
          selected ? (
            labelFor(selected as string)
          ) : (
            <span className="text-gray-400">{loading ? "Loading..." : placeholder}</span>
          ),
      }}
    >
      {normalized.length ? (
        normalized.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ whiteSpace: "normal" }}>
            {option.label}
          </MenuItem>
        ))
      ) : (
        // An empty list would open as a blank box — say so instead.
        <MenuItem disabled value="__no_options__" sx={{ fontSize: 14, fontStyle: "italic" }}>
          No options available
        </MenuItem>
      )}
    </TextField>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-28 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-500">:</span>
      <span className="font-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}

// Small inline "+ Add more" style action.
export function AddMoreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-gray-900 hover:bg-gray-100"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// Sub-section heading inside a section card (e.g. Add Audit step 2): brand-coloured title,
// optionally preceded by a divider that separates it from the previous sub-section.
export function SubSectionTitle({ children, divider = false }: { children: ReactNode; divider?: boolean }) {
  return (
    <div className={divider ? "mt-6 border-t border-gray-200 pt-6" : ""}>
      <h3 className="mb-4 text-[15px] font-semibold text-brand">{children}</h3>
    </div>
  );
}

export interface OtherPerson {
  name: string;
  designation: string;
}

/**
 * "People Interacted With" card: FTE / Non-FTE users (searchable picker) and Others
 * (free-text name + designation).
 */
export function PeopleInteractedSection({
  fteUsers,
  onFteUsersChange,
  otherPeople,
  onOtherPeopleChange,
  bare = false,
}: {
  /** Render only the content (no card), for use inside another section card. */
  bare?: boolean;
  fteUsers: ViActiveUserOption[];
  onFteUsersChange: (users: ViActiveUserOption[]) => void;
  otherPeople: OtherPerson[];
  onOtherPeopleChange: (people: OtherPerson[]) => void;
}) {
  const [showFtePicker, setShowFtePicker] = useState(false);
  const [otherDraft, setOtherDraft] = useState<OtherPerson | null>(null);

  const content = (
      <div className="space-y-6">
        {/* FTE / Non-FTE */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-900">FTE / Non-FTE</span>
            <AddMoreButton label="Add more" onClick={() => setShowFtePicker(true)} />
          </div>
          {showFtePicker && (
            <div className="mb-3 max-w-md">
              {/* Searchable — the active FTE / Non-FTE list can be long */}
              <UserAutocomplete
                label="Person"
                excludeIds={fteUsers.map((u) => u.id)}
                value={null}
                onChange={(user) => {
                  if (!user) return;
                  if (!fteUsers.some((s) => s.id === user.id)) onFteUsersChange([...fteUsers, user]);
                  setShowFtePicker(false);
                }}
                placeholder="Search person by email or mobile"
                ariaLabel="Person"
              />
            </div>
          )}
          {fteUsers.length > 0 ? (
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {fteUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-gray-900">
                    {user.name}
                    {user.email && <span className="text-gray-500"> · {user.email}</span>}
                  </span>
                  <button
                    type="button"
                    onClick={() => onFteUsersChange(fteUsers.filter((s) => s.id !== user.id))}
                    className="rounded-[8px] p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label={`Remove ${user.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showFtePicker && <p className="text-sm text-gray-500">No FTE / Non-FTE people added.</p>
          )}
        </div>

        {/* Others */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-gray-900">Others</span>
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
                sx={auditFieldSx}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label={requiredLabel("Designation")}
                placeholder="Enter designation"
                value={otherDraft.designation}
                onChange={(e) => setOtherDraft((p) => (p ? { ...p, designation: e.target.value } : p))}
                sx={auditFieldSx}
                InputLabelProps={{ shrink: true }}
              />
              <div className="flex gap-2">
                <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => setOtherDraft(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => {
                    if (!otherDraft.name.trim() || !otherDraft.designation.trim()) {
                      toast.error("Please enter name and designation");
                      return;
                    }
                    onOtherPeopleChange([...otherPeople, otherDraft]);
                    setOtherDraft(null);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          {otherPeople.length > 0 ? (
            <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
              {otherPeople.map((person, index) => (
                <div key={`${person.name}-${index}`} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-gray-900">
                    {person.name} <span className="text-gray-500">· {person.designation}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOtherPeopleChange(otherPeople.filter((_, i) => i !== index))}
                    className="rounded-[8px] p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label={`Remove ${person.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !otherDraft && <p className="text-sm text-gray-500">No other people added.</p>
          )}
        </div>
      </div>
  );

  if (bare) return content;
  return (
    <DetailCard icon={sectionIcon(Users)} title="People Interacted With" className="mb-5">
      {content}
    </DetailCard>
  );
}

// --- Observation classification (Classification / Category / Sub Category + "Others") -------

/** One observation's classification values; `*Other` holds the text typed for "Others". */
export interface ObservationClassificationValue {
  classification: string;
  category: string;
  subCategory: string;
  classificationOther: string;
  categoryOther: string;
  subCategoryOther: string;
}

// Masters options plus a single "Others" choice at the end (a master literally named "Others"
// is replaced by it, so the API gets the free text instead of that id).
const withOthersOption = (options: MasterOption[]): MasterOption[] => [
  ...options.filter((option) => option.label.trim().toLowerCase() !== "others"),
  { value: OTHER_OPTION_VALUE, label: "Others" },
];

/** API fields for one observation: `*_id`, or blank id + `*_other` text when "Others" is picked. */
export const classificationPayload = (v: ObservationClassificationValue) => {
  const pick = (id: string, other: string, key: "classification" | "category" | "sub_category") =>
    id === OTHER_OPTION_VALUE
      ? { [`${key}_id`]: null, [`${key}_other`]: other.trim() }
      : { [`${key}_id`]: toId(id) };
  return {
    ...pick(v.classification, v.classificationOther, "classification"),
    ...pick(v.category, v.categoryOther, "category"),
    ...pick(v.subCategory, v.subCategoryOther, "sub_category"),
  };
};

/** Labels of the classification fields still missing (a value, or the "Others" text). */
export const missingClassification = (v: ObservationClassificationValue) =>
  [
    (!v.classification || (v.classification === OTHER_OPTION_VALUE && !v.classificationOther.trim())) && "Classification",
    (!v.category || (v.category === OTHER_OPTION_VALUE && !v.categoryOther.trim())) && "Category",
    (!v.subCategory || (v.subCategory === OTHER_OPTION_VALUE && !v.subCategoryOther.trim())) && "Sub Category",
  ].filter(Boolean) as string[];

/** Classification / Category / Sub Category dropdowns; picking "Others" shows a textbox below. */
export function ObservationClassificationFields({
  value,
  onChange,
  classifications,
  categories,
  subCategories,
  loading,
}: {
  value: ObservationClassificationValue;
  onChange: (patch: Partial<ObservationClassificationValue>) => void;
  classifications: MasterOption[];
  categories: MasterOption[];
  subCategories: MasterOption[];
  loading?: boolean;
}) {
  const fields: {
    label: string;
    key: "classification" | "category" | "subCategory";
    otherKey: "classificationOther" | "categoryOther" | "subCategoryOther";
    options: MasterOption[];
    placeholder: string;
  }[] = [
    { label: "Classification", key: "classification", otherKey: "classificationOther", options: classifications, placeholder: "Select observation classification" },
    { label: "Category", key: "category", otherKey: "categoryOther", options: categories, placeholder: "Select observation category" },
    { label: "Sub Category", key: "subCategory", otherKey: "subCategoryOther", options: subCategories, placeholder: "Select observation sub-category" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {fields.map(({ label, key, otherKey, options, placeholder }) => (
        <div key={key} className="space-y-3">
          <SelectField
            label={label}
            required
            value={value[key]}
            onChange={(v) => onChange({ [key]: v, ...(v !== OTHER_OPTION_VALUE ? { [otherKey]: "" } : {}) })}
            options={withOthersOption(options)}
            loading={loading}
            placeholder={placeholder}
          />
          {value[key] === OTHER_OPTION_VALUE && (
            <TextField
              fullWidth
              label={requiredLabel(`Other ${label}`)}
              placeholder={`Enter ${label.toLowerCase()}`}
              value={value[otherKey]}
              onChange={(e) => onChange({ [otherKey]: e.target.value })}
              sx={auditFieldSx}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
