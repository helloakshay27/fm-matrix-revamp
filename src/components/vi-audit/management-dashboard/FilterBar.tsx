import { useState } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select as MuiSelect,
  TextField,
} from "@mui/material";
import { AUDIT_TYPES, FILTER_CIRCLES, FUNCTIONS, ZONES, type Persona } from "./data";

interface FilterBarProps {
  persona: Persona;
  circle: string;
  zone: string;
  auditType: string;
  dateFrom: string;
  dateTo: string;
  functions: string[];
  onCircle: (value: string) => void;
  onZone: (value: string) => void;
  onAuditType: (value: string) => void;
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
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: "10px 14px",
    fontSize: "13px",
    fontFamily: "'Poppins', sans-serif",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: VI_FOCUS },
    "&.Mui-focused fieldset": { borderColor: VI_FOCUS },
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px",
    fontFamily: "'Poppins', sans-serif",
    "&.Mui-focused": { color: VI_FOCUS },
  },
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
  "& .MuiInputBase-input": {
    padding: "10px 14px",
    fontSize: "13px",
    fontFamily: "'Poppins', sans-serif",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 320,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const checkboxSx = {
  color: "#C4B89D",
  "&.Mui-checked": { color: VI_FOCUS },
  py: 0.25,
};

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <InputLabel shrink>
      {text}
      {required ? <span style={{ color: "#EE2737" }}> *</span> : null}
    </InputLabel>
  );
}

export function FilterBar({
  persona,
  circle,
  zone,
  auditType,
  dateFrom,
  dateTo,
  functions,
  onCircle,
  onZone,
  onAuditType,
  onDateFrom,
  onDateTo,
  onFunctions,
  onApply,
  onReset,
}: FilterBarProps) {
  const [funcOpen, setFuncOpen] = useState(false);
  const circleRequired = persona === "circle";
  const circleLabel = circleRequired ? "Circle *" : "Circle";
  const functionLabel = circleRequired ? "Function *" : "Function";
  const functionSummary =
    functions.length === 0 ? "Select Function" : functions.length === 1 ? functions[0] : `${functions.length} Functions Selected`;

  return (
    <div className="cm-filter-bar">
      <FormControl variant="outlined" size="small" sx={{ minWidth: 170, flex: "1 1 170px", maxWidth: 220 }}>
        <FieldLabel text="Circle" required={circleRequired} />
        <MuiSelect
          label={circleLabel}
          notched
          value={circle}
          onChange={(event) => onCircle(String(event.target.value))}
          input={<OutlinedInput notched label={circleLabel} />}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {FILTER_CIRCLES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 170, flex: "1 1 170px", maxWidth: 230 }}>
        <FieldLabel text="Function" required={circleRequired} />
        <MuiSelect
          multiple
          displayEmpty
          label={functionLabel}
          notched
          open={funcOpen}
          onOpen={() => setFuncOpen(true)}
          onClose={() => setFuncOpen(false)}
          value={functions}
          onChange={(event) => {
            const value = event.target.value;
            onFunctions(typeof value === "string" ? value.split(",") : value);
          }}
          input={<OutlinedInput notched label={functionLabel} />}
          renderValue={() => <span style={{ color: functions.length ? "#2C2C2C" : "#9ca3af" }}>{functionSummary}</span>}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {FUNCTIONS.map((item) => (
            <MenuItem key={item} value={item} dense>
              <Checkbox checked={functions.includes(item)} size="small" sx={checkboxSx} />
              <ListItemText primary={item} primaryTypographyProps={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }} />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 180, flex: "1 1 180px", maxWidth: 230 }}>
        <FieldLabel text="Personnel Area / Zone" />
        <MuiSelect
          label="Personnel Area / Zone"
          notched
          value={zone}
          onChange={(event) => onZone(String(event.target.value))}
          input={<OutlinedInput notched label="Personnel Area / Zone" />}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {ZONES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ minWidth: 160, flex: "1 1 160px", maxWidth: 210 }}>
        <FieldLabel text="Audit Type" />
        <MuiSelect
          label="Audit Type"
          notched
          value={auditType}
          onChange={(event) => onAuditType(String(event.target.value))}
          input={<OutlinedInput notched label="Audit Type" />}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {AUDIT_TYPES.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <TextField
        type="date"
        label={
          <>
            Audit Date From <span style={{ color: "#EE2737" }}>*</span>
          </>
        }
        value={dateFrom}
        onChange={(event) => onDateFrom(event.target.value)}
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }}
      />

      <span className="cm-filter-to">to</span>

      <TextField
        type="date"
        label={
          <>
            Audit Date To <span style={{ color: "#EE2737" }}>*</span>
          </>
        }
        value={dateTo}
        onChange={(event) => onDateTo(event.target.value)}
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ ...dateFieldStyles, minWidth: 150, flex: "0 1 168px" }}
      />

      <button type="button" className="cm-apply-btn" onClick={onApply}>
        Apply
      </button>
      <button type="button" className="cm-reset-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
