import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Users } from "lucide-react";
import { MenuItem, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import type { MasterOption } from "./useViAuditMasters";
import type { ViActiveUserOption } from "./useViActiveUsers";
import { AutocompleteLabel, UserAutocomplete } from "./ViUserPicker";
import { sectionIcon } from "./ViAuditUi";

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

export const requiredLabel = (text: string) => (
  <>
    {text} <span className="fm-required-mark">*</span>
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

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="w-28 shrink-0 text-[rgba(26,26,24,0.48)]">{label}</span>
      <span className="text-[rgba(26,26,24,0.48)]">:</span>
      <span className="font-medium text-[#1A1A18]">{value || "-"}</span>
    </div>
  );
}

// Small inline "+ Add more" style action.
export function AddMoreButton({ label, onClick }: { label: string; onClick: () => void }) {
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
}: {
  fteUsers: ViActiveUserOption[];
  onFteUsersChange: (users: ViActiveUserOption[]) => void;
  otherPeople: OtherPerson[];
  onOtherPeopleChange: (people: OtherPerson[]) => void;
}) {
  const [showFtePicker, setShowFtePicker] = useState(false);
  const [otherDraft, setOtherDraft] = useState<OtherPerson | null>(null);

  return (
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
                  if (!fteUsers.some((s) => s.id === user.id)) onFteUsersChange([...fteUsers, user]);
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
                    onClick={() => onFteUsersChange(fteUsers.filter((s) => s.id !== user.id))}
                    className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                    aria-label={`Remove ${user.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showFtePicker && <p className="text-sm text-[rgba(26,26,24,0.48)]">No FTE / Non-FTE people added.</p>
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
            <div className="divide-y divide-[rgba(26,26,24,0.08)] rounded-[12px] border border-[rgba(26,26,24,0.09)]">
              {otherPeople.map((person, index) => (
                <div key={`${person.name}-${index}`} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-[#1A1A18]">
                    {person.name} <span className="text-[rgba(26,26,24,0.48)]">· {person.designation}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onOtherPeopleChange(otherPeople.filter((_, i) => i !== index))}
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
  );
}
