import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { getUser } from "@/utils/auth";
import {
  VI_USER_SEARCH_MIN_CHARS,
  useViUserSearch,
  type ViActiveUserOption,
} from "./useViActiveUsers";

// Shared searchable user pickers for the Vi Audit forms (Add Audit people / SPOC / Functional
// Head, Action Plan responsible person). Users come from
// /pms/users/vi_fte_non_fte_active_users.json (see useViUserSearch).

// Label rendered OUTSIDE the Autocomplete (same 12px/600 style as the global field standard).
// An MUI `label` inside an Autocomplete gets lifted into the field's clickable root by the
// global label-above CSS, which breaks MUI's focus handling — the popup opens and instantly
// closes. Same pattern as the app's other Autocompletes (e.g. ReporteesReassignPage).
export function AutocompleteLabel({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="block mb-1.5 text-[12px] font-semibold text-[rgba(26,26,24,0.68)]">
      {children}
      {required && <span className="fm-required-mark">*</span>}
    </span>
  );
}

/** The logged-in user (localStorage "user") as a picker option, or null. */
const currentUserOption = (): ViActiveUserOption | null => {
  const user = getUser();
  if (!user?.id) return null;
  const name = [user.firstname, user.lastname].filter(Boolean).join(" ").trim() || user.email || `User ${user.id}`;
  return {
    id: String(user.id),
    name,
    email: user.email || undefined,
    mobile: user.mobile ? String(user.mobile) : undefined,
  };
};

// Server-side user search (q[email_or_mobile_cont]) — same Autocomplete setup as the working
// ReporteesReassignPage picker: controlled input, results from the API (no client filtering),
// spinner while searching, no MUI label (see AutocompleteLabel).
// `preload` lists users (employee-type filter only) before anything is typed.
export function UserAutocomplete({
  value,
  onChange,
  employeeType,
  preload = false,
  excludeIds,
  placeholder,
  ariaLabel,
  clearOnSelect = false,
  includeCurrentUser = false,
}: {
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  preload?: boolean;
  excludeIds?: string[];
  placeholder: string;
  ariaLabel: string;
  /** Empty the search box after each pick (for multi-user pickers that keep `value` null). */
  clearOnSelect?: boolean;
  /** Always offer the logged-in user (marked "You"), e.g. a reporter assigning themselves. */
  includeCurrentUser?: boolean;
}) {
  // inputValue = text shown in the box (incl. the selected user's name MUI writes back);
  // searchTerm = only what the user typed, so selecting someone doesn't trigger a search.
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { options: results, loading } = useViUserSearch(searchTerm, employeeType, { preload });

  // The logged-in user, offered first (when the typed text matches them) — the users API may leave
  // them out, and its search only matches email / mobile.
  const me = useMemo(() => (includeCurrentUser ? currentUserOption() : null), [includeCurrentUser]);
  const meMatches = (() => {
    if (!me) return false;
    const q = searchTerm.trim().toLowerCase();
    return !q || [me.name, me.email, me.mobile].some((field) => field?.toLowerCase().includes(q));
  })();
  const withMe = me && meMatches ? [me, ...results.filter((u) => u.id !== me.id)] : results;

  const options = excludeIds?.length ? withMe.filter((u) => !excludeIds.includes(u.id)) : withMe;
  // Keep the selected user in the option list so MUI can render it after the results change.
  const allOptions = value && !options.some((u) => u.id === value.id) ? [value, ...options] : options;
  const tooShort = !preload && searchTerm.trim().length < VI_USER_SEARCH_MIN_CHARS;

  return (
    <Autocomplete
      options={allOptions}
      loading={loading}
      value={value}
      onChange={(_, user) => {
        onChange(user);
        // MUI writes the picked name into the box just before onChange; clear it for multi-pick.
        if (clearOnSelect && user) {
          setInputValue("");
          setSearchTerm("");
        }
      }}
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
            <span className="flex items-center gap-2 text-sm text-[#1A1A18]">
              {user.name}
              {me && user.id === me.id && (
                <span className="rounded-full bg-[#F5F4F0] px-2 py-[1px] text-[10px] font-semibold text-[rgba(26,26,24,0.68)]">
                  You
                </span>
              )}
            </span>
            {user.email && <span className="text-xs text-[rgba(26,26,24,0.48)]">{user.email}</span>}
          </div>
        </li>
      )}
      loadingText="Loading..."
      noOptionsText={
        tooShort ? `Type at least ${VI_USER_SEARCH_MIN_CHARS} characters of email or mobile` : "No matching users"
      }
      slotProps={{
        // Opt out of the global "Type to search" injector (utils/globalMUISelectSearchEnhancer): it
        // doesn't recognise the portalled Autocomplete popup, injects its own box and focuses it,
        // which blurs this input and closes the popup the moment it opens.
        listbox: { "data-disable-mui-select-search": "true" } as HTMLAttributes<HTMLElement>,
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
          inputProps={{
            ...params.inputProps,
            "aria-label": ariaLabel,
            // Stop Chrome offering saved emails / addresses over the results ("email" in the
            // placeholder triggers its autofill; plain "off" is ignored for that).
            autoComplete: "chrome-off",
            name: "vi-user-search",
          }}
        />
      )}
    />
  );
}

// Labelled single-user picker (label above, searchable).
export function UserSelectField({
  label,
  required,
  value,
  onChange,
  employeeType,
  preload,
  placeholder,
  includeCurrentUser,
}: {
  label: string;
  required?: boolean;
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  preload?: boolean;
  placeholder: string;
  /** Always offer the logged-in user (marked "You"). */
  includeCurrentUser?: boolean;
}) {
  return (
    <div>
      <AutocompleteLabel required={required}>{label}</AutocompleteLabel>
      <UserAutocomplete
        value={value}
        onChange={onChange}
        employeeType={employeeType}
        preload={preload}
        includeCurrentUser={includeCurrentUser}
        placeholder={placeholder}
        ariaLabel={label}
      />
    </div>
  );
}
