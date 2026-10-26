import { useState } from "react";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select as MuiSelect, TextField } from "@mui/material";
import { CLASSIFICATIONS, FILTER_CIRCLES, FUNCTIONS, ZONES, type Persona } from "./data";

interface FilterBarProps {
  persona: Persona;
  circle: string;
  zone: string;
  classification: string;
  dateFrom: string;
  dateTo: string;
  functions: string[];
  onCircle: (value: string) => void;
  onZone: (value: string) => void;
  onClassification: (value: string) => void;
  onDateFrom: (value: string) => void;
  onDateTo: (value: string) => void;
  onFunctions: (value: string[]) => void;
  onApply: () => void;
  onReset: () => void;
}

const VI_FOCUS = "#C72030";
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

export function FilterBar(props: FilterBarProps) {
  const [funcOpen, setFuncOpen] = useState(false);
  const required = props.persona === "circle";
  const circleLabel = required ? "Circle *" : "Circle";
  const functionLabel = required ? "Function *" : "Function";
  const summary = props.functions.length === 0 ? "Select Function" : props.functions.length === 1 ? props.functions[0] : `${props.functions.length} Functions Selected`;

  return (
    <div className="cm-filter-bar">
      <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 160px", maxWidth: 210 }}>
        <FieldLabel text="Circle" required={required} />
        <MuiSelect label={circleLabel} notched value={props.circle} onChange={(event) => props.onCircle(String(event.target.value))} input={<OutlinedInput notched label={circleLabel} />} sx={fieldStyles} MenuProps={menuProps}>
          {FILTER_CIRCLES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </MuiSelect>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 160px", maxWidth: 220 }}>
        <FieldLabel text="Function" required={required} />
        <MuiSelect multiple displayEmpty label={functionLabel} notched open={funcOpen} onOpen={() => setFuncOpen(true)} onClose={() => setFuncOpen(false)} value={props.functions} onChange={(event) => { const value = event.target.value; props.onFunctions(typeof value === "string" ? value.split(",") : value); }} input={<OutlinedInput notched label={functionLabel} />} renderValue={() => <span style={{ color: props.functions.length ? "#2C2C2C" : "#9ca3af" }}>{summary}</span>} sx={fieldStyles} MenuProps={menuProps}>
          {FUNCTIONS.map((item) => (
            <MenuItem key={item} value={item} dense>
              <Checkbox checked={props.functions.includes(item)} size="small" sx={{ color: "#C4B89D", "&.Mui-checked": { color: VI_FOCUS }, py: 0.25 }} />
              <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }} />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 170, flex: "1 1 170px", maxWidth: 220 }}>
        <FieldLabel text="Personnel Area / Zone" />
        <MuiSelect label="Personnel Area / Zone" notched value={props.zone} onChange={(event) => props.onZone(String(event.target.value))} input={<OutlinedInput notched label="Personnel Area / Zone" />} sx={fieldStyles} MenuProps={menuProps}>
          {ZONES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </MuiSelect>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 170, flex: "1 1 170px", maxWidth: 220 }}>
        <FieldLabel text="Incident Classification" />
        <MuiSelect label="Incident Classification" notched value={props.classification} onChange={(event) => props.onClassification(String(event.target.value))} input={<OutlinedInput notched label="Incident Classification" />} sx={fieldStyles} MenuProps={menuProps}>
          {CLASSIFICATIONS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </MuiSelect>
      </FormControl>
      <TextField type="date" label={<>Incident Date From <span style={{ color: "#EE2737" }}>*</span></>} value={props.dateFrom} onChange={(event) => props.onDateFrom(event.target.value)} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <span className="cm-filter-to">to</span>
      <TextField type="date" label={<>Incident Date To <span style={{ color: "#EE2737" }}>*</span></>} value={props.dateTo} onChange={(event) => props.onDateTo(event.target.value)} size="small" variant="outlined" InputLabelProps={{ shrink: true }} sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }} />
      <button type="button" className="cm-apply-btn" onClick={props.onApply}>Apply</button>
      <button type="button" className="cm-reset-btn" onClick={props.onReset}>Reset</button>
    </div>
  );
}
