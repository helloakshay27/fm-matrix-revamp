import { useEffect, useState } from 'react';
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

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

async function fetchMsafeTrainingJson(endpoint: string, signal?: AbortSignal): Promise<unknown> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
  const params = new URLSearchParams({ company_id: companyId });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_tranning_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function extractFilterOptions(data: unknown, arrayKeys: string[], nameKeys: string[]): string[] {
  const record = data as Record<string, unknown> | null;
  let arr: unknown = undefined;
  for (const key of arrayKeys) {
    if (record && Array.isArray(record[key])) {
      arr = record[key];
      break;
    }
  }
  if (arr === undefined) arr = Array.isArray(data) ? data : [];

  const names = (arr as unknown[])
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      const obj = item as Record<string, unknown>;
      for (const key of nameKeys) {
        const v = obj?.[key];
        if (typeof v === 'string' && v.trim()) return v.trim();
      }
      return null;
    })
    .filter((v): v is string => Boolean(v));

  return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
}

async function fetchFilterOptions(
  endpoint: string,
  arrayKeys: string[],
  nameKeys: string[],
  signal: AbortSignal,
): Promise<string[]> {
  const data = await fetchMsafeTrainingJson(endpoint, signal);
  return extractFilterOptions(data, arrayKeys, nameKeys);
}

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
  const [circleOptions, setCircleOptions] = useState<string[]>([]);
  const [functionOptions, setFunctionOptions] = useState<string[]>([]);
  const [zoneOptions, setZoneOptions] = useState<string[]>(['All Zones']);
  const [empTypeOptions, setEmpTypeOptions] = useState<string[]>(['Internal / External']);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      const [circles, funcs, zones, empTypes] = await Promise.all([
        fetchFilterOptions('circle_level_filter.json', ['circles'], ['circle_name', 'name'], controller.signal).catch(
          (err) => {
            if ((err as Error).name !== 'AbortError') console.error('Failed to load circle filter:', err);
            return [] as string[];
          },
        ),
        fetchFilterOptions(
          'function_level_filter.json',
          ['functions'],
          ['function_name', 'name'],
          controller.signal,
        ).catch((err) => {
          if ((err as Error).name !== 'AbortError') console.error('Failed to load function filter:', err);
          return [] as string[];
        }),
        fetchFilterOptions('zone_level_filter.json', ['zones'], ['zone_name', 'name'], controller.signal).catch(
          (err) => {
            if ((err as Error).name !== 'AbortError') console.error('Failed to load zone filter:', err);
            return [] as string[];
          },
        ),
        fetchFilterOptions(
          'employee_type_filter.json',
          ['employee_types', 'types', 'data', 'result'],
          ['employee_type_name', 'employee_type', 'type_name', 'name'],
          controller.signal,
        ).catch((err) => {
          if ((err as Error).name !== 'AbortError') console.error('Failed to load employee type filter:', err);
          return [] as string[];
        }),
      ]);

      if (controller.signal.aborted) return;
      setCircleOptions(circles);
      setFunctionOptions(funcs);
      setZoneOptions(['All Zones', ...zones]);
      setEmpTypeOptions(['Internal / External', ...empTypes]);
      setLoadingFilters(false);
    })();

    return () => controller.abort();
  }, []);

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
          disabled={loadingFilters}
        >
          {circleOptions.map((c) => (
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
          disabled={loadingFilters}
        >
          {functionOptions.map((fn) => (
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
          disabled={loadingFilters}
        >
          {zoneOptions.map((z) => (
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
          disabled={loadingFilters}
        >
          {empTypeOptions.map((t) => (
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
