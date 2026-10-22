import { useState, type ReactNode } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
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
}: {
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  preload?: boolean;
  excludeIds?: string[];
  placeholder: string;
  ariaLabel: string;
}) {
  // inputValue = text shown in the box (incl. the selected user's name MUI writes back);
  // searchTerm = only what the user typed, so selecting someone doesn't trigger a search.
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { options: results, loading } = useViUserSearch(searchTerm, employeeType, { preload });

  const options = excludeIds?.length ? results.filter((u) => !excludeIds.includes(u.id)) : results;
  // Keep the selected user in the option list so MUI can render it after the results change.
  const allOptions = value && !options.some((u) => u.id === value.id) ? [value, ...options] : options;
  const tooShort = !preload && searchTerm.trim().length < VI_USER_SEARCH_MIN_CHARS;

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

// Labelled single-user picker (label above, searchable).
export function UserSelectField({
  label,
  required,
  value,
  onChange,
  employeeType,
  preload,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: ViActiveUserOption | null;
  onChange: (user: ViActiveUserOption | null) => void;
  employeeType?: string;
  preload?: boolean;
  placeholder: string;
}) {
  return (
    <div>
      <AutocompleteLabel required={required}>{label}</AutocompleteLabel>
      <UserAutocomplete
        value={value}
        onChange={onChange}
        employeeType={employeeType}
        preload={preload}
        placeholder={placeholder}
        ariaLabel={label}
      />
    </div>
  );
}
