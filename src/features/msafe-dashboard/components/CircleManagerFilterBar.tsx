import { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  OutlinedInput,
} from '@mui/material';
import { CIRCLES, FUNCTIONS, ZONES } from '../data/constants';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

const VI_FOCUS = '#C72030';

const fieldStyles = {
  height: 40,
  backgroundColor: '#fff',
  fontSize: '13px',
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: '10px 14px',
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '8px',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: VI_FOCUS },
    '&.Mui-focused fieldset': { borderColor: VI_FOCUS },
  },
  '& .MuiInputLabel-root': {
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
    '&.Mui-focused': { color: VI_FOCUS },
  },
};

const dateFieldStyles = {
  ...fieldStyles,
  '& .MuiInputBase-root': {
    height: 40,
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 280,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const EMP_TYPES = [
  'Internal / External',
  'Internal (FTE)',
  'External (Non-FTE)',
];

export function CircleManagerFilterBar() {
  const {
    persona,
    circle,
    setCircle,
    functions,
    setFunctions,
    zone,
    setZone,
    empType,
    setEmpType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    applyFilters,
    resetFilters,
    setPageTitle,
  } = useMsafeDashboard();

  const [funcOpen, setFuncOpen] = useState(false);

  if (persona !== 'circle') return null;

  const functionSummary =
    functions.length === 0
      ? 'Select Function'
      : functions.length === 1
        ? functions[0]
        : `${functions.length} Functions Selected`;

  return (
    <div className="cm-filter-bar" style={{ display: 'flex' }}>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 160, flex: '1 1 160px', maxWidth: 220 }}
      >
        <InputLabel shrink>
          Circle <span style={{ color: '#EE2737' }}>*</span>
        </InputLabel>
        <MuiSelect
          label="Circle *"
          notched
          displayEmpty
          value={circle}
          onChange={(e) => {
            const v = String(e.target.value);
            setCircle(v);
            setPageTitle(`M-Safe · ${v} Circle`);
          }}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {CIRCLES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 170, flex: '1 1 170px', maxWidth: 240 }}
      >
        <InputLabel shrink>
          Function <span style={{ color: '#EE2737' }}>*</span>
        </InputLabel>
        <MuiSelect
          multiple
          label="Function *"
          notched
          displayEmpty
          open={funcOpen}
          onOpen={() => setFuncOpen(true)}
          onClose={() => setFuncOpen(false)}
          value={functions}
          onChange={(e) => {
            const v = e.target.value;
            setFunctions(typeof v === 'string' ? v.split(',') : (v as string[]));
          }}
          input={<OutlinedInput notched label="Function *" />}
          renderValue={() => (
            <span style={{ color: functions.length ? '#2C2C2C' : '#9ca3af' }}>
              {functionSummary}
            </span>
          )}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {FUNCTIONS.map((fn) => (
            <MenuItem key={fn} value={fn} dense>
              <Checkbox
                checked={functions.includes(fn)}
                size="small"
                sx={{
                  color: '#C4B89D',
                  '&.Mui-checked': { color: VI_FOCUS },
                  py: 0.25,
                }}
              />
              <ListItemText
                primary={fn}
                primaryTypographyProps={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}
              />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 140, flex: '1 1 140px', maxWidth: 200 }}
      >
        <InputLabel shrink>Zone</InputLabel>
        <MuiSelect
          label="Zone"
          notched
          displayEmpty
          value={zone}
          onChange={(e) => {
            const v = String(e.target.value);
            setZone(v);
            setPageTitle(
              v === 'All Zones'
                ? `M-Safe · ${circle} Circle`
                : `M-Safe · ${circle} · ${v} Zone`,
            );
          }}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {ZONES.map((z) => (
            <MenuItem key={z} value={z}>
              {z}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 160, flex: '1 1 160px', maxWidth: 220 }}
      >
        <InputLabel shrink>
          Employee Type <span style={{ color: '#EE2737' }}>*</span>
        </InputLabel>
        <MuiSelect
          label="Employee Type *"
          notched
          displayEmpty
          value={empType}
          onChange={(e) => setEmpType(String(e.target.value))}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
        >
          {EMP_TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      <TextField
        type="date"
        label={
          <>
            Start Date <span style={{ color: '#EE2737' }}>*</span>
          </>
        }
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ ...dateFieldStyles, minWidth: 140, flex: '0 1 150px' }}
      />

      <span className="cm-filter-to">to</span>

      <TextField
        type="date"
        label={
          <>
            End Date <span style={{ color: '#EE2737' }}>*</span>
          </>
        }
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        size="small"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        sx={{ ...dateFieldStyles, minWidth: 140, flex: '0 1 150px' }}
      />

      <button type="button" className="cm-apply-btn" onClick={applyFilters}>
        Apply
      </button>
      <button type="button" className="cm-reset-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
