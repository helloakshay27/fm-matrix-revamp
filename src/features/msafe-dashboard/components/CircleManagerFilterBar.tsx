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

export function CircleManagerFilterBar() {
  const {
    persona,
    circles,
    setCircles,
    setCircleIds,
    functions,
    setFunctions,
    setFunctionIds,
    // zone,
    // setZone,
    // setZoneId,
    empType,
    setEmpType,
    setEmpTypeId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    applyFilters,
    resetFilters,
    setPageTitle,
    circleOptions,
    functionOptions,
    empTypeOptions,
    loadingFilterOptions,
  } = useMsafeDashboard();

  const [funcOpen, setFuncOpen] = useState(false);
  const [circleOpen, setCircleOpen] = useState(false);

  // Pan India ('admin') gets the exact same filter bar as Circle Manager —
  // Circle, Function, Employee Type, and Date range all apply for either persona.
  if (persona !== 'circle' && persona !== 'admin') return null;

  const functionSummary =
    functions.length === 0
      ? 'Select Function'
      : functions.length === 1
        ? functions[0]
        : `${functions.length} Functions Selected`;

  const circleSummary =
    circles.length === 0
      ? 'Select Circle'
      : circles.length === 1
        ? circles[0]
        : `${circles.length} Circles Selected`;

  return (
    <div className="cm-filter-bar" style={{ display: 'flex' }}>
      {persona === 'circle' && (
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 170, flex: '1 1 170px', maxWidth: 240 }}
        >
          <InputLabel shrink>
            Circle <span style={{ color: '#EE2737' }}>*</span>
          </InputLabel>
          <MuiSelect
            multiple
            label="Circle *"
            notched
            displayEmpty
            open={circleOpen}
            onOpen={() => setCircleOpen(true)}
            onClose={() => setCircleOpen(false)}
            value={circles}
            onChange={(e) => {
              const v = e.target.value;
              const names = typeof v === 'string' ? v.split(',') : (v as string[]);
              setCircles(names);
              const ids = names
                .map((n) => circleOptions.find((o) => o.name === n)?.id)
                .filter((id): id is string => Boolean(id));
              setCircleIds(ids);
              setPageTitle(
                names.length === 0
                  ? 'M-Safe · Circle Manager'
                  : names.length === 1
                    ? `M-Safe · ${names[0]} Circle`
                    : `M-Safe · ${names.length} Circles`,
              );
            }}
            input={<OutlinedInput notched label="Circle *" />}
            renderValue={() => (
              <span style={{ color: circles.length ? '#2C2C2C' : '#9ca3af' }}>{circleSummary}</span>
            )}
            sx={fieldStyles}
            MenuProps={selectMenuProps}
            disabled={loadingFilterOptions}
          >
            {circleOptions.map((c) => (
              <MenuItem key={c.id} value={c.name} dense>
                <Checkbox
                  checked={circles.includes(c.name)}
                  size="small"
                  sx={{
                    color: '#C4B89D',
                    '&.Mui-checked': { color: VI_FOCUS },
                    py: 0.25,
                  }}
                />
                <ListItemText
                  primary={c.name}
                  primaryTypographyProps={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}
                />
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      )}

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
            const names = typeof v === 'string' ? v.split(',') : (v as string[]);
            setFunctions(names);
            setFunctionIds(
              names
                .map((n) => functionOptions.find((o) => o.name === n)?.id)
                .filter((id): id is string => Boolean(id)),
            );
          }}
          input={<OutlinedInput notched label="Function *" />}
          renderValue={() => (
            <span style={{ color: functions.length ? '#2C2C2C' : '#9ca3af' }}>
              {functionSummary}
            </span>
          )}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
          disabled={loadingFilterOptions}
        >
          {functionOptions.map((fn) => (
            <MenuItem key={fn.id} value={fn.name} dense>
              <Checkbox
                checked={functions.includes(fn.name)}
                size="small"
                sx={{
                  color: '#C4B89D',
                  '&.Mui-checked': { color: VI_FOCUS },
                  py: 0.25,
                }}
              />
              <ListItemText
                primary={fn.name}
                primaryTypographyProps={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}
              />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>

      {/* <FormControl
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
            setZoneId(zoneOptions.find((o) => o.name === v)?.id ?? '');
            setPageTitle(
              v === 'All Zones'
                ? `M-Safe · ${circle} Circle`
                : `M-Safe · ${circle} · ${v} Zone`,
            );
          }}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
          disabled={loadingFilterOptions}
        >
          {zoneOptions.map((z) => (
            <MenuItem key={z.id || z.name} value={z.name}>
              {z.name}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl> */}

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
          onChange={(e) => {
            const v = String(e.target.value);
            setEmpType(v);
            setEmpTypeId(empTypeOptions.find((o) => o.name === v)?.id ?? '');
          }}
          sx={fieldStyles}
          MenuProps={selectMenuProps}
          disabled={loadingFilterOptions}
        >
          {empTypeOptions.map((t) => (
            <MenuItem key={t.id || t.name} value={t.name}>
              {t.name}
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

      <button type="button" className="cm-apply-btn" onClick={() => applyFilters()}>
        Apply
      </button>
      <button type="button" className="cm-reset-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
}
