import { useState } from "react";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select as MuiSelect, TextField } from "@mui/material";
import type { Persona } from "./data";
import type { AuditFilterOptions, FilterOption } from "./viAuditDashboardApi";

interface FilterBarProps {
  persona: Persona;
  options: AuditFilterOptions;
  circles: string[];
  functions: string[];
  zones: string[];
  workLocations: string[];
  auditTypes: string[];
  dateFrom: string;
  dateTo: string;
  onCircles: (ids: string[]) => void;
  onFunctions: (ids: string[]) => void;
  onZones: (ids: string[]) => void;
  onWorkLocations: (ids: string[]) => void;
  onAuditTypes: (ids: string[]) => void;
  onDateFrom: (value: string) => void;
  onDateTo: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

const ALL_VALUE = "__all__";
const VI_FOCUS = "#EE2737";
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
      {required ? <span style={{ color: "#EE2737" }}> *</span> : null}
    </InputLabel>
  );
}

const checkboxSx = { color: "#E6D7BE", "&.Mui-checked": { color: VI_FOCUS }, py: 0.25 };
const optionTextProps = { fontSize: 13, fontFamily: "'Poppins', sans-serif" };

// Multi-select dropdown (as on the inspection dashboard): an "All" toggle, then one checkbox per
// API option. Values are option ids; nothing selected means no filter.
function MultiSelect({ label, plural, required, value, options, loaded, onChange }: { label: string; plural: string; required?: boolean; value: string[]; options: FilterOption[]; loaded?: boolean; onChange: (ids: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const fieldLabel = required ? `${label} *` : label;
  const allSelected = options.length > 0 && value.length === options.length;
  const summary =
    value.length === 0
      ? `Select ${label}`
      : allSelected
        ? `All ${plural}`
        : value.length === 1
          ? options.find((item) => item.id === value[0])?.name ?? value[0]
          : `${value.length} ${plural} Selected`;
  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 170px", maxWidth: 230 }}>
      <FieldLabel text={label} required={required} />
      <MuiSelect
        multiple
        displayEmpty
        notched
        label={fieldLabel}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        value={value}
        onChange={(event) => {
          const raw = typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value;
          onChange(raw.includes(ALL_VALUE) ? (allSelected ? [] : options.map((item) => item.id)) : raw);
        }}
        input={<OutlinedInput notched label={fieldLabel} />}
        renderValue={() => <span style={{ color: value.length ? "#2F3043" : "#8C8D98" }}>{summary}</span>}
        sx={fieldStyles}
        MenuProps={menuProps}
      >
        {options.length === 0 && <MenuItem disabled dense>{loaded ? "No options available" : "Loading..."}</MenuItem>}
        {options.length > 0 && (
          <MenuItem value={ALL_VALUE} dense>
            <Checkbox checked={allSelected} indeterminate={value.length > 0 && !allSelected} size="small" sx={checkboxSx} />
            <ListItemText primary="All" primaryTypographyProps={optionTextProps} />
          </MenuItem>
        )}
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id} dense>
            <Checkbox checked={value.includes(item.id)} size="small" sx={checkboxSx} />
            <ListItemText primary={item.name} primaryTypographyProps={optionTextProps} />
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

export function FilterBar(props: FilterBarProps) {
  const required = props.persona === "circle";
  return (
    <div className="cm-filter-bar">
      <MultiSelect label="Circle" plural="Circles" required={required} value={props.circles} options={props.options.circles} loaded={props.options.loaded.circles} onChange={props.onCircles} />
      <MultiSelect label="Function" plural="Functions" value={props.functions} options={props.options.functions} loaded={props.options.loaded.functions} onChange={props.onFunctions} />
      <MultiSelect label="Personnel Area / Zone" plural="Zones" value={props.zones} options={props.options.zones} loaded={props.options.loaded.zones} onChange={props.onZones} />
      <MultiSelect label="Work Location" plural="Work Locations" value={props.workLocations} options={props.options.workLocations} loaded={props.options.loaded.workLocations} onChange={props.onWorkLocations} />
      <MultiSelect label="Audit Type" plural="Audit Types" value={props.auditTypes} options={props.options.auditTypes} loaded={props.options.loaded.auditTypes} onChange={props.onAuditTypes} />
      <TextField type="date" label={<>Audit Date From <span style={{ color: "#EE2737" }}>*</span></>} value={props.dateFrom} onChange={(event) => props.onDateFrom(event.target.value)} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <span className="cm-filter-to">to</span>
      <TextField type="date" label={<>Audit Date To <span style={{ color: "#EE2737" }}>*</span></>} value={props.dateTo} onChange={(event) => props.onDateTo(event.target.value)} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <button type="button" className="cm-apply-btn" onClick={props.onApply}>Apply</button>
      <button type="button" className="cm-reset-btn" onClick={props.onReset}>Reset</button>
    </div>
  );
}
