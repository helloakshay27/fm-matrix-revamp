import { useState } from "react";
import { Checkbox, FormControl, InputLabel, ListItemText, ListSubheader, MenuItem, OutlinedInput, Select as MuiSelect, TextField } from "@mui/material";
import type { FilterOption, FilterOptions, IncidentFilters } from "./api";
import { BRAND, type Persona } from "./data";

interface FilterBarProps {
  persona: Persona;
  value: IncidentFilters;
  options: FilterOptions;
  onChange: (patch: Partial<IncidentFilters>) => void;
  onApply: () => void;
  onReset: () => void;
}

const ALL = "";
const VI_FOCUS = BRAND.crimson;
const fieldStyles = {
  height: 40,
  backgroundColor: "#fff",
  fontSize: "13px",
  "& .MuiInputBase-input, & .MuiSelect-select": { padding: "10px 14px", fontSize: "13px", fontFamily: "'Poppins', sans-serif" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: VI_FOCUS },
    "&.Mui-focused fieldset": { borderColor: VI_FOCUS },
  },
  "& .MuiInputLabel-root": { fontSize: "13px", fontFamily: "'Poppins', sans-serif", "&.Mui-focused": { color: VI_FOCUS } },
};
const dateFieldStyles = {
  ...fieldStyles,
  "& .MuiInputBase-root": {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: "8px",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: VI_FOCUS },
    "&.Mui-focused fieldset": { borderColor: VI_FOCUS },
  },
};
const menuProps = {
  PaperProps: { style: { maxHeight: 320, backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)", zIndex: 9999 } },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <InputLabel shrink>
      {text}
      {required ? <span style={{ color: BRAND.crimson }}> *</span> : null}
    </InputLabel>
  );
}

function SingleSelect({ label, allLabel, value, options, onChange, required, searchable, width = 220 }: { label: string; allLabel: string; value: string; options: FilterOption[]; onChange: (value: string) => void; required?: boolean; searchable?: boolean; width?: number }) {
  const [search, setSearch] = useState("");
  const fullLabel = required ? `${label} *` : label;
  const needle = search.trim().toLowerCase();
  const visible = needle ? options.filter((item) => item.name.toLowerCase().includes(needle)) : options;
  // The selected option may be filtered out of the menu, so the closed box resolves its own label.
  const selectedName = options.find((item) => item.id === value)?.name ?? allLabel;

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 160px", maxWidth: width }}>
      <FieldLabel text={label} required={required} />
      <MuiSelect
        displayEmpty
        label={fullLabel}
        notched
        value={value}
        onChange={(event) => onChange(String(event.target.value))}
        onClose={() => setSearch("")}
        renderValue={() => selectedName}
        input={<OutlinedInput notched label={fullLabel} />}
        sx={fieldStyles}
        // Searchable menus already have their own search box, so opt out of the app-wide injected one.
        MenuProps={{ ...menuProps, autoFocus: false, MenuListProps: searchable ? ({ "data-disable-mui-select-search": "true" } as object) : undefined }}
      >
        {searchable ? (
          <ListSubheader sx={{ backgroundColor: "#fff", px: 1, py: 1, lineHeight: "normal" }}>
            <TextField
              size="small"
              fullWidth
              autoFocus
              placeholder={`Search ${label.toLowerCase()}…`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              // Keep keystrokes in the search box instead of letting the menu jump to matching items.
              onKeyDown={(event) => { if (event.key !== "Escape") event.stopPropagation(); }}
              sx={{ "& .MuiInputBase-input": { padding: "8px 10px", fontSize: "13px", fontFamily: "'Poppins', sans-serif" }, "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: VI_FOCUS } }}
            />
          </ListSubheader>
        ) : null}
        <MenuItem value={ALL}>{allLabel}</MenuItem>
        {visible.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        {searchable && visible.length === 0 ? <MenuItem disabled>No matches</MenuItem> : null}
      </MuiSelect>
    </FormControl>
  );
}

const ALL_VALUE = "__all__";

/** Checkbox multi-select with an "All" toggle, as on the M-Safe dashboard. */
function MultiSelect({ label, plural, value, options, loading, onChange, required, width = 220 }: { label: string; plural: string; value: string[]; options: FilterOption[]; loading: boolean; onChange: (value: string[]) => void; required?: boolean; width?: number }) {
  const [open, setOpen] = useState(false);
  const fullLabel = required ? `${label} *` : label;
  const allIds = options.map((item) => item.id);
  const allSelected = allIds.length > 0 && value.length === allIds.length;
  const nameOf = (id: string) => options.find((item) => item.id === id)?.name ?? id;
  const summary = value.length === 0 ? `All ${plural}` : value.length === 1 ? nameOf(value[0]) : `${value.length} ${plural} Selected`;
  const checkboxSx = { color: BRAND.slate, "&.Mui-checked": { color: VI_FOCUS }, py: 0.25 };
  const textProps = { fontSize: 13, fontFamily: "'Poppins', sans-serif" };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 160px", maxWidth: width }}>
      <FieldLabel text={label} required={required} />
      <MuiSelect
        multiple
        displayEmpty
        label={fullLabel}
        notched
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          const raw = typeof next === "string" ? next.split(",") : next;
          onChange(raw.includes(ALL_VALUE) ? (allSelected ? [] : allIds) : raw);
        }}
        input={<OutlinedInput notched label={fullLabel} />}
        renderValue={() => <span style={{ color: value.length ? BRAND.slate : "#9ca3af" }}>{summary}</span>}
        sx={fieldStyles}
        MenuProps={menuProps}
      >
        {loading ? <MenuItem disabled dense>Loading...</MenuItem> : null}
        <MenuItem value={ALL_VALUE} dense>
          <Checkbox checked={allSelected} size="small" sx={checkboxSx} />
          <ListItemText primary="All" primaryTypographyProps={textProps} />
        </MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id} dense>
            <Checkbox checked={value.includes(item.id)} size="small" sx={checkboxSx} />
            <ListItemText primary={item.name} primaryTypographyProps={textProps} />
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

export function FilterBar({ persona, value, options, onChange, onApply, onReset }: FilterBarProps) {
  const required = persona === "circle";

  return (
    <div className="cm-filter-bar">
      {/* Circle is only offered in the Circle Manager view; Pan India always covers every circle. */}
      {persona === "circle" ? (
        <MultiSelect label="Circle" plural="Circles" value={value.circleIds} options={options.circles} loading={options.loading} onChange={(circleIds) => onChange({ circleIds })} required={required} width={210} />
      ) : null}
      <MultiSelect label="Function" plural="Functions" value={value.functionIds} options={options.functions} loading={options.loading} onChange={(functionIds) => onChange({ functionIds })} required={required} />
      <SingleSelect label="Personnel Area / Zone" allLabel="All Zones" value={value.zoneId} options={options.zones} onChange={(zoneId) => onChange({ zoneId })} />
      <SingleSelect label="Work Location" allLabel="All Work Locations" value={value.workLocationId} options={options.workLocations} onChange={(workLocationId) => onChange({ workLocationId })} searchable />
      <SingleSelect label="Incident Classification" allLabel="All Classifications" value={value.classificationId} options={options.classifications} onChange={(classificationId) => onChange({ classificationId })} />
      <TextField type="date" label={<>Incident Date From <span style={{ color: BRAND.crimson }}>*</span></>} value={value.dateFrom} onChange={(event) => onChange({ dateFrom: event.target.value })} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <span className="cm-filter-to">to</span>
      <TextField type="date" label={<>Incident Date To <span style={{ color: BRAND.crimson }}>*</span></>} value={value.dateTo} onChange={(event) => onChange({ dateTo: event.target.value })} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <button type="button" className="cm-apply-btn" onClick={onApply}>Apply</button>
      <button type="button" className="cm-reset-btn" onClick={onReset}>Reset</button>
    </div>
  );
}
